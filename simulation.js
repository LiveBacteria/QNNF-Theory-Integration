const os = require("os");
const fs = require("fs");
const { GPU } = require("gpu.js");
const gl = require("gl");
const gpu = new GPU({
  mode: "gpu",
  canvas: require("canvas"),
  webGl: gl(1, 1), // tiny headless gl context
});
const path = require("path");
const child_process = require("child_process");
const { Transform } = require("stream");
const math = require("mathjs");
const createKDTree = require("static-kdtree");
const geokdbush = require("geokdbush");
const kdTree = require("./kdtree.js");
const prompt = require("prompt");
const ProgressBar = require("progress");

const exampleSuperposition = {
  "0_0_0": {
    initialXYZ: [0, 0, 0],
    currentXYZ: [0, 0, 0],
    entangledNeurons: [
      {
        x: 0,
        y: 0,
        z: 0,
        state: 1,
      },
      {
        x: 0,
        y: 0,
        z: 0,
        state: 1,
      },
    ],
    // state: Normalised average state of all entangled neurons
    state: 0.15,
  },
  "0_0_1": {
    initialXYZ: [0, 0, 1],
    currentXYZ: [0, 0, 1],
    neurons: [
      {
        x: 0,
        y: 0,
        z: 1,
        state: 1,
      },
      {
        x: 0,
        y: 0,
        z: 1,
        state: 1,
      },
    ],
    state: 1,
  },
};

class KDTree {
  constructor(k) {
    this.root = null;
    this.k = k;
    this.values = new Map();
    this.nnnwv = this.nearestNWithValue;
  }

  insert(point, value, node = this.root, depth = 0) {
    if (node === null) {
      this.values.set(point.toString(), value);
      return new Node(point, value, depth % this.k);
    }

    if (point[node.axis] < node.point[node.axis]) {
      node.left = this.insert(point, value, node.left, depth + 1);
    } else {
      node.right = this.insert(point, value, node.right, depth + 1);
    }

    return node;
  }

  nearestOld(point, n, node = this.root, depth = 0, best = []) {
    if (node === null) {
      return best;
    }

    let axis = node.axis;
    let nextBranch = null;
    let oppositeBranch = null;

    if (
      best.length < n ||
      this.distance(point, best[0].point) > this.distance(point, node.point)
    ) {
      if (best.length === n) {
        best.shift(); // remove the farthest node from the list
      }
      best.push(node);
      best.sort(
        (a, b) => this.distance(point, b.point) - this.distance(point, a.point)
      ); // sort the list by distance
    }

    if (point[axis] < node.point[axis]) {
      nextBranch = node.left;
      oppositeBranch = node.right;
    } else {
      nextBranch = node.right;
      oppositeBranch = node.left;
    }

    best = this.nearest(point, n, nextBranch, depth + 1, best);

    if (
      best.length < n ||
      Math.abs(node.point[axis] - point[axis]) <
        this.distance(point, best[0].point)
    ) {
      best = this.nearest(point, n, oppositeBranch, depth + 1, best);
    }

    return best;
  }

  nearest(point, n, node = this.root, depth = 0, best = []) {
    if (node === null) {
      return best;
    }

    let axis = node.axis;
    let nextBranch = null;
    let oppositeBranch = null;

    if (
      best.length < n ||
      this.distance(point, best[0].node.point) >
        this.distance(point, node.point)
    ) {
      if (best.length === n) {
        best.shift(); // remove the farthest node from the list
      }
      let value = this.values.get(node.point.toString());
      best.push({ node: node, value: value });
      best.sort(
        (a, b) =>
          this.distance(point, b.node.point) -
          this.distance(point, a.node.point)
      ); // sort the list by distance
    }

    if (point[axis] < node.point[axis]) {
      nextBranch = node.left;
      oppositeBranch = node.right;
    } else {
      nextBranch = node.right;
      oppositeBranch = node.left;
    }

    best = this.nearest(point, n, nextBranch, depth + 1, best);

    if (
      best.length < n ||
      Math.abs(node.point[axis] - point[axis]) <
        this.distance(point, best[0].node.point)
    ) {
      best = this.nearest(point, n, oppositeBranch, depth + 1, best);
    }

    return best;
  }

  nearestWithValue(point) {
    let nearestNode = this.nearest(point);
    return this.values.get(nearestNode.point.toString());
  }

  nearestNWithValue(point, n) {
    let nearestNodes = this.nearest(point, n);
    return nearestNodes.map((node) => this.values.get(node.point.toString()));
  }

  distance(a, b) {
    let sum = 0;
    for (let i = 0; i < this.k; i++) {
      sum += Math.pow(a[i] - b[i], 2);
    }
    return Math.sqrt(sum);
  }

  dispose() {
    this.root = null;
    this.values.clear();
  }
}

class QuantumMechanics {
  constructor() {}

  // Enacts the motion from the superposition
  // Updates the positions of the superpositions in the KDTree
  // Differing states will result in different motions
  // States(Noramlised) are represented by the following:
  // 0: no motion
  // 1: attraction
  // 2: chase
  enactMotionFromSuperposition(superposition) {
    // this will enact the motion from the superposition

    // Get the state of the superposition
    const state = this.collapseSuperposition(superposition);

    // Get the motion from the state
    const motion = this.getMotionFromState(state);
  }

  // Gets the motion from the state
  // States(Noramlised) are represented by the following:
  // 0: no motion
  // 1: attraction
  // 2: chase
  getMotionFromState(state) {}
}

class QuantumSpace extends QuantumMechanics {
  constructor() {
    super();
    this.superpositions = new KDTree(3);
  }

  // Creates a superposition from the temporal state by entangling the neurons in the ActiveMeshStates
  // Inserts the superposition into the KDTree
  createSuperpositionFromTemporalState() {
    // this will create a superposition from a temporal state

    if (this.activeMeshStates.length > 0) {
      // Get averaged xyz coordinates and state from ActiveMeshStates
      const { avgXYZ, avgState } = this.activeMeshStates.reduce(
        (acc, cur, _, arr) => {
          acc.avgXYZ.x += cur.x / arr.length;
          acc.avgXYZ.y += cur.y / arr.length;
          acc.avgXYZ.z += cur.z / arr.length;
          acc.avgState += cur.state / arr.length;
          return acc;
        },
        { avgXYZ: { x: 0, y: 0, z: 0 }, avgState: 0 }
      );

      // Format superpositionTitle and round state to nearest integer
      const superpositionTitle = `${avgXYZ.x}_${avgXYZ.y}_${avgXYZ.z}`;
      let state = Math.round(avgState);

      // Insert average position into KDTree with corresponding superposition
      this.superpositions.insert([avgXYZ.x, avgXYZ.y, avgXYZ.z], {
        neurons: this.activeMeshStates,
        currentXYZ: avgXYZ,
        initialXYZ: avgXYZ,
        state,
      });
    } else {
      console.error("No active mesh states to create superposition from");
    }
  }

  // Collapses the superposition to a single state. ie observing/measuring the superposition.
  // The collapse method is based on the next nearest neighbors of the given superpositions intial xyz recursively placing the given superpositions current xyz at half the distance between the next nearest neighbor and its current xyz divided by the iteration
  // NOTE: The current implementation does not represent the full scale of quantum gravity and it's effects of the gravitons on the superposition, however, it does provide a good approximation of the collapse of the superposition
  collapseSuperposition(superposition) {
    const nResults = this.superpositions.nearestNWithValue(superposition, 50);

    for (let i = 0; i < nResults.length; i++) {
      const { neurons, currentXYZ, initialXYZ, state } = nResults[i];

      const nextNearestNeighbor = nResults[0];

      const { currentXYZ: nextNearestNeighborXYZ } = nextNearestNeighbor;

      const distance = Math.sqrt(
        Math.pow(currentXYZ.x - nextNearestNeighborXYZ.x, 2) +
          Math.pow(currentXYZ.y - nextNearestNeighborXYZ.y, 2) +
          Math.pow(currentXYZ.z - nextNearestNeighborXYZ.z, 2)
      );

      const iteration = 1;

      const newXYZ = {
        x:
          currentXYZ.x +
          (nextNearestNeighborXYZ.x - currentXYZ.x) / distance / iteration,
        y:
          currentXYZ.y +
          (nextNearestNeighborXYZ.y - currentXYZ.y) / distance / iteration,
        z:
          currentXYZ.z +
          (nextNearestNeighborXYZ.z - currentXYZ.z) / distance / iteration,
      };

      this.superpositions.insert([newXYZ.x, newXYZ.y, newXYZ.z], {
        neurons,
        currentXYZ: newXYZ,
        initialXYZ,
        state,
      });
    }
  }

  // This function will be used to calculate the gravitons state based on the superpositionss entangled neurons when fired.
  // The graviton will contain a value between 0 and 1 inclusively
  // The value of the graviton determines the state it resides in, chase, gravity well, neutral
  calculateGravitonState() {}

  // this will rank the superpositions based on the number of matches with the temporal state
  // there could be two methods for this
  // one, ranks the superpositions based on the number of matches with the temporal state
  // two, ranks the superpositions based on the nearest superposition to the this.activeMeshStates averaged xyz coordinates
  // method one is more accurate, but method two is faster due to less calculations
  // potentially a combination of the two methods could be used. method two could be used to narrow down the superpositions to a few, and then method one could be used to rank the remaining superpositions
  // method two would be able to use a KD tree to find the nearest superposition
  rankSuperpositions(superposition) {
    // this will rank the superpositions based on the number of matches with the temporal state
    for (let neuron of allNeurons) {
      tree.root = tree.insert(
        [neuron.x, neuron.y, neuron.z],
        neuron,
        tree.root
      );
    }
  }

  // This method supports the dynamic quantum mechanics in the quantum space by utilising a R* tree to locate the superposition that has the most matches with the temporal state
  // This method also has self balancing properties
  locateSuperpositionsFromTemporalStateRTree() {
    // TODO: Implement R* tree
    // TODO: Locate superposition with most matches with the temporal state
  }

  // NOTE: This method will not be compatible with the dynamic quantum mechanics in the quantum space
  // this will locate the superposition that has the most matches with the temporal state
  locateSuperpositionsFromTemporalStateKDTree() {
    //this will return the n best superpositions that match the temporal state
    const n = 50; // number of superpositions to return. Will need to eventually hit every superposition ie n = superpositions.length
    const matches = []; // array of matches

    // get the n best matches
    // The matches will inherently be ranked
    matches.push(this.superpositions.nearestNWithValue([x, y, z], n));
  }
}

class Environment extends QuantumSpace {
  constructor(meshName) {
    super();
    // get refs to the octants files of the mesh directory
    const octants = fs.readdirSync(`${meshName}`);
    this.running = false;
    this.activeMeshStates = [];
    this.neuronsToUpdate = [];
  }

  step() {
    // run the simulation for one step

    // get and udpate the active mesh states
    this.processActiveMeshStates();

    // propagate the signals
    this.propagateSignals();
  }

  // run the simulation
  run() {
    // run loop that can be stopped/toggled
    while (this.running) {
      // run the simulation
      this.step();
    }

    // run the simulation once
    // this.step();

    // run the simulation until a certain time
    // this.stepUntil(time);
  }

  // stop the simulation
  stop() {
    this.running = false;
  }

  getAdjacentOctantFiles(octantFile) {
    let [x, y, z] = octantFile.split("_").map(parseFloat);
    let adjacentOctants = [];

    // Iterate over all octant files
    for (let otherOctantFile of fs.readdirSync(`${this.name}`)) {
      let [otherX, otherY, otherZ] = otherOctantFile.split("_").map(parseFloat);

      // Calculate the Euclidean distance between the centers of the octants
      let dx = x - otherX;
      let dy = y - otherY;
      let dz = z - otherZ;
      let distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

      // If the distance is less than or equal to sqrt(3) times the octant size, the octants are adjacent
      // (The diagonal of a cube is sqrt(3) times the side length)
      if (distance <= Math.sqrt(3) * this.octantSize) {
        adjacentOctants.push(otherOctantFile);
      }
    }

    return adjacentOctants;
  }

  // Get all neurons from the current and adjacent octants
  getNeuronsFromPoint(point) {
    // Load the adjacency map from a file
    let adjacencyMap = new Map(
      JSON.parse(fs.readFileSync("adjacencyMap.json"))
    );

    const octantFiles = fs.readdirSync(`${this.name}`);

    // determine which octant file contains the point
    let octantFile = octantFiles.find((octantFile) => {
      let [x, y, z] = octantFile.split("_").map(parseFloat);
      return (
        point.x >= x &&
        point.x < x + this.octantSize &&
        point.y >= y &&
        point.y < y + this.octantSize &&
        point.z >= z &&
        point.z < z + this.octantSize
      );
    });

    let neurons = JSON.parse(fs.readFileSync(`${this.name}/${octantFile}`));

    // Load all neurons from the current and adjacent octants into memory
    let allNeurons = neurons.slice(); // Make a copy of the neurons array
    for (let adjacentOctantFile of adjacencyMap.get(octantFile)) {
      let adjacentNeurons = JSON.parse(
        fs.readFileSync(`${this.name}/${adjacentOctantFile}`)
      );
      allNeurons.push(...adjacentNeurons);
    }

    return allNeurons;
  }

  // get the neuron from the given point
  getNeuronFromPoint(point) {
    // Load the adjacency map from a file
    const octantFiles = fs.readdirSync(`${this.name}`);

    // determine which octant file contains the point
    let octantFile = octantFiles.find((octantFile) => {
      let [x, y, z] = octantFile.split("_").map(parseFloat);
      return (
        point.x >= x &&
        point.x < x + this.octantSize &&
        point.y >= y &&
        point.y < y + this.octantSize &&
        point.z >= z &&
        point.z < z + this.octantSize
      );
    });

    let neurons = JSON.parse(fs.readFileSync(`${this.name}/${octantFile}`));

    // get neuron object from the octant file that contains the point
    let neuron = neurons.find((neuron) => {
      return (
        neuron.x === point.x && neuron.y === point.y && neuron.z === point.z
      );
    });

    return neuron;
  }

  // get the connections of the given neuron
  getNeuronConnections(neuron) {
    const octantFiles = fs.readdirSync(`${this.name}`);

    // determine which octant file contains the neuron
    let octantFile = octantFiles.find((octantFile) => {
      let [x, y, z] = octantFile.split("_").map(parseFloat);
      return (
        neuron.x >= x &&
        neuron.x < x + this.octantSize &&
        neuron.y >= y &&
        neuron.y < y + this.octantSize &&
        neuron.z >= z &&
        neuron.z < z + this.octantSize
      );
    });

    // load neurons from the octant file
    let neurons = JSON.parse(fs.readFileSync(`${this.name}/${octantFile}`));

    // Get the connections for the neuron
    let neuronInOctant = neurons.find(
      (n) => n.x === neuron.x && n.y === neuron.y && n.z === neuron.z
    );
    let connectionPoints = neuronInOctant ? neuronInOctant.connections : [];

    // get the neurons from the connection points
    let connections = [];
    for (let connectionPoint of connectionPoints) {
      let connectionNeuron = this.getNeuronFromPoint(connectionPoint);
      connections.push(connectionNeuron);
    }

    return connections;
  }

  getAdjacentOctantFiles(octantFile) {
    let [x, y, z] = octantFile.split("_").map(parseFloat);
    let adjacentOctants = [];

    // Iterate over all octant files
    for (let otherOctantFile of fs.readdirSync(`${this.name}`)) {
      let [otherX, otherY, otherZ] = otherOctantFile.split("_").map(parseFloat);

      // Calculate the Euclidean distance between the centers of the octants
      let dx = x - otherX;
      let dy = y - otherY;
      let dz = z - otherZ;
      let distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

      // If the distance is less than or equal to sqrt(3) times the octant size, the octants are adjacent
      // (The diagonal of a cube is sqrt(3) times the side length)
      if (distance <= Math.sqrt(3) * this.octantSize) {
        adjacentOctants.push(otherOctantFile);
      }
    }

    return adjacentOctants;
  }

  fireNeuron(neuron) {
    // Get the neuron's connections
    let connections = this.getNeuronConnections(neuron);

    // Fire the neuron's connections
    for (let connection of connections) {
      this.activeMeshStates.add(connection);
    }
  }

  processActiveMeshStates() {
    if (this.activeMeshStates.length !== 0) {
      // create a superposition from the active mesh states
      this.createSuperpositionFromTemporalState();
      // cycle through all active mesh states
      for (let neuron of this.activeMeshStates) {
        this.fireNeuron(neuron);
        this.activeMeshStates.delete(neuron);
      }
    }
  }

  // Propagate the signals through the mesh
  propagateSignals() {
    for (let neuron of this.neuronsToUpdate) {
      this.activeMeshStates.add(neuron);
      this.neuronsToUpdate.delete(neuron);
    }
  }
}

// binary color code for red, green, blue
// RGB 0 - 255
const red = 150;
const green = 255;
const blue = 255;

class Simulation extends Environment {
  constructor(meshName) {
    super(meshName);
    this.activeMeshStates = new ActiveMeshStates(); // active mesh states
  }
}

const main = () => {
  // create a new simulation
  const simulation = new Simulation("mesh1");
  simulation.run();
  simulation.stop();
};

main();
