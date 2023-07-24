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

class Neuron {
  constructor(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.connections = [];
    this.synapticPathways = this.connections.length;
    this.state = 0; // QUBIT STATE
  }
  entangle(neuron) {
    this.connections.push(neuron);
    this.synapticPathways = this.connections.length;
    // call class superposition generation function here
  }
  collapse() {
    this.state = 1;
  }
}

class NeuronTransform extends Transform {
  constructor(options) {
    super(options);
  }

  _transform(chunk, encoding, callback) {
    let neuron = JSON.stringify(chunk) + ",\n";
    this.push(neuron);
    callback();
  }
}

class Octant {
  constructor(x, y, z, size, depth, name = "octants") {
    this.x = x;
    this.y = y;
    this.z = z;
    this.size = size;
    this.depth = depth;
    this.neurons = [];
    this.name = name;
  }

  // contains(neuron) {
  //   return (
  //     neuron.x >= this.x &&
  //     neuron.x < this.x + this.size &&
  //     neuron.y >= this.y &&
  //     neuron.y < this.y + this.size &&
  //     neuron.z >= this.z &&
  //     neuron.z < this.z + this.size
  //   );
  // }

  // Add a method to check if a neuron is within this octant
  contains(neuron) {
    let halfSize = this.size / 2;
    return (
      neuron.x >= this.x - halfSize &&
      neuron.x < this.x + halfSize &&
      neuron.y >= this.y - halfSize &&
      neuron.y < this.y + halfSize &&
      neuron.z >= this.z - halfSize &&
      neuron.z < this.z + halfSize
    );
  }

  addNeuron(neuron) {
    if (this.depth > 0) {
      // Determine which child octant this neuron belongs to
      let childX = neuron.x < this.x ? 0 : 1;
      let childY = neuron.y < this.y ? 0 : 1;
      let childZ = neuron.z < this.z ? 0 : 1;
      let index = childX + childY * 2 + childZ * 4;

      // Create the child octant if it doesn't exist
      if (!this.children) {
        this.children = [];
      }
      if (!this.children[index]) {
        let newSize = this.size / 2;
        let newX = this.x + (childX - 0.5) * newSize;
        let newY = this.y + (childY - 0.5) * newSize;
        let newZ = this.z + (childZ - 0.5) * newSize;
        this.children[index] = new Octant(
          newX,
          newY,
          newZ,
          newSize,
          this.depth - 1,
          this.name
        );
      }

      // Add the neuron to the child octant
      this.children[index].addNeuron(neuron);
    } else {
      // check if the octant file exists, if not create it
      if (!fs.existsSync(`${this.name}/${this.x}_${this.y}_${this.z}.json`)) {
        fs.writeFileSync(
          `${this.name}/${this.x}_${this.y}_${this.z}.json`,
          JSON.stringify([])
        );
      }

      // if the octant file exists, read it
      let data = fs.readFileSync(
        `${this.name}/${this.x}_${this.y}_${this.z}.json`,
        "utf-8"
      );

      // Parse the JSON string into an array of neurons
      let neurons = JSON.parse(data);

      // Add the neuron to the array
      neurons.push(neuron);

      // Write the array back to the file
      fs.writeFileSync(
        `${this.name}/${this.x}_${this.y}_${this.z}.json`,
        JSON.stringify(neurons)
      );
      // We're at the maximum depth, so just add the neuron here
      // this.neurons.push(neuron);
    }
  }

  // Save this octant's neurons to a file
  saveToDisk() {
    if (!fs.existsSync(`${this.name}`)) {
      fs.mkdirSync(`${this.name}`);
    }

    fs.writeFileSync(
      `${this.name}/${this.x}_${this.y}_${this.z}.json`,
      JSON.stringify(this.neurons)
    );
  }
}

function readOctant(x, y, z) {
  // Determine the file name
  let fileName = `octants/${x}_${y}_${z}.json`;

  // Read the file contents
  let data = fs.readFileSync(fileName, "utf-8");

  // Parse the JSON string into an array of neurons
  let neurons = JSON.parse(data);

  return neurons;
}

class Node {
  constructor(point, value, axis) {
    this.point = point;
    this.value = value;
    this.left = null;
    this.right = null;
    this.axis = axis;
  }
}

class KDTree {
  constructor(k) {
    this.root = null;
    this.k = k;
    this.values = new Map();
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

class NeuralMesh {
  constructor({
    neurons,
    clusters,
    precision = 0,
    gpuAcceleration = false,
    parallelization = false,
    buildStyle = "im",
    name,
    octantSize = 0.125,
    maxDistance = 0.2,
    k = 3,
  }) {
    this.numNeurons = neurons;
    this.numClusters = clusters;
    this.neurons = [];
    this.neuronTransform = new NeuronTransform({ objectMode: true });
    // this.writeStream = fs.createWriteStream(
    //   `meshData_${this.numNeurons}/neurons.json`,
    //   { flags: "a" }
    // );
    // this.neuronTransform.pipe(this.writeStream);
    this.maxDistance = 0.2;
    this.totalConnections = 0;
    this.precision = precision;
    this.gpuAcceleration = gpuAcceleration;
    this.parallelization = parallelization;
    this.buildStyle = buildStyle;
    this.octantSize = octantSize;
    this.maxDistance = maxDistance;
    this.k = k;
    this.name = name;
    this.name = `nm_${neurons}_${clusters}_${
      this.precision ? "parallelization" : ""
    }_${gpuAcceleration ? "gpuAcceleration" : ""}${
      parallelization ? "_parallel" : ""
    }${buildStyle ? "_" + buildStyle : ""}${
      octantSize ? "_" + octantSize : ""
    }${maxDistance ? "_" + maxDistance : ""}${k ? "_" + k : ""}`;
    this.rootOctant = new Octant(0.5, 0.5, 0.5, 1, 3, this.name); // Centered at (0.5, 0.5, 0.5), size 1, depth 3
  }

  validateMeshParams() {
    if (this.neurons > 1000000000) {
      throw new Error("Too many neurons");
    }
    if (this.clusters > 1000000) {
      throw new Error("Too many clusters");
    }
    if (this.neurons < 1000) {
      throw new Error("Too few neurons");
    }
    if (this.clusters < 10) {
      throw new Error("Too few clusters");
    }
    if (this.neurons < this.clusters) {
      throw new Error("Neurons must be greater than clusters");
    }
    if (this.clusters > this.neurons / 10) {
      throw new Error("Clusters must be less than 1/10 of neurons");
    }
    if (this.clusters > 100000000) {
      throw new Error("Clusters must be less than 100,000,000");
    }
    if (this.neurons > 100000000000) {
      throw new Error("Neurons must be less than 100,000,000,000");
    }
  }

  connectNeurons() {
    // Define a maximum distance for connections
    const maxDistance = 0.2;

    let data;

    // Read the neurons from the file
    try {
      data = fs.readFileSync(
        path.join(__dirname, `meshData_${this.numNeurons}/neurons.json`),
        "utf-8"
      );
    } catch (err) {
      console.log(
        "Error reading neurons from file. Please generate them first."
      );
      process.exit(1);
    }

    // Remove the trailing comma and wrap the data in an array
    data = "[" + data.slice(0, -2) + "]";
    let neurons = JSON.parse(data);

    console.log("Connecting neurons...");
    let connectBar = new ProgressBar(":bar", { total: this.numNeurons });
    // let connectBarTick = new ProgressBar(":current", {
    // total: this.numNeurons,
    // });

    const gpu1 = new GPU();
    const calculateDistance = gpu1
      .createKernel(function (dx, dy, dz) {
        return Math.sqrt(dx * dx + dy * dy + dz * dz);
      })
      .setOutput([1]);

    // For each neuron
    for (let i = 0; i < neurons.length; i++) {
      let neuron = neurons[i];

      // Connect to other neurons within the same cluster
      for (let j = i + 1; j < neurons.length; j++) {
        // Start from i + 1 to avoid duplicate connections and self-connections
        let otherNeuron = neurons[j];

        // Calculate the Euclidean distance between the neurons
        let dx = neuron.x - otherNeuron.x;
        let dy = neuron.y - otherNeuron.y;
        let dz = neuron.z - otherNeuron.z;
        let distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
        // let distance = calculateDistance(dx, dy, dz)[0];

        // If the distance is less than the maximum, add the connection
        if (distance < maxDistance) {
          neuron.connections.push([
            otherNeuron.x,
            otherNeuron.y,
            otherNeuron.z,
          ]);
          otherNeuron.connections.push([neuron.x, neuron.y, neuron.z]); // Add the connection in both directions to create an undirected graph
        }
      }
      connectBar.tick();
      // connectBarTick.tick();
    }

    // // Write the connected neurons back to the file
    // fs.writeFileSync(
    //   path.join(__dirname, `meshData_${this.numNeurons}/neurons.json`),
    //   JSON.stringify(neurons)
    // );

    console.log("Writing neurons to file...");
    const writeBar = new ProgressBar(":bar", { total: this.numNeurons });
    // Open the file for writing
    let file = fs.createWriteStream(
      `meshData_${this.numNeurons}/neurons_with_connections.json`
    );

    // Write each neuron to the file one at a time
    for (let neuron of neurons) {
      file.write(JSON.stringify(neuron) + ",\n");
      writeBar.tick();
    }

    // Close the file
    file.end();
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

  generateOctantAdjacencyMap() {
    // Create a map to store the adjacency map
    let adjacencyMap = new Map();

    // Iterate over all octant files
    for (let octantFile of fs.readdirSync("octants")) {
      let adjacentOctants = this.getAdjacentOctantFiles(octantFile);
      adjacencyMap.set(octantFile, adjacentOctants);
    }

    // Write the adjacency map to a file
    fs.writeFileSync("adjacencyMap.json", JSON.stringify([...adjacencyMap]));
  }

  moveOctantFilesToNeuralMeshFolder() {
    // Create the directory for the neural mesh
    fs.mkdirSync(`meshData_${this.numNeurons}`);

    // Move the octant files to the neural mesh directory
    for (let octantFile of fs.readdirSync("octants")) {
      fs.renameSync(
        `octants/${octantFile}`,
        `meshData_${this.numNeurons}/${octantFile}`
      );
    }
  }

  connectNeuronsFromOctants() {
    // Load the adjacency map from a file
    let adjacencyMap = new Map(
      JSON.parse(fs.readFileSync("adjacencyMap.json"))
    );

    // Iterate over all octants
    for (let octantFile of fs.readdirSync(`${this.name}`)) {
      let neurons = JSON.parse(fs.readFileSync(`${this.name}/${octantFile}`));

      // Create a map to store the updated neurons from adjacent octants
      let updatedAdjacentNeurons = {};

      // Load all neurons from the current and adjacent octants into memory
      let allNeurons = neurons.slice(); // Make a copy of the neurons array
      for (let adjacentOctantFile of adjacencyMap.get(octantFile)) {
        let adjacentNeurons = JSON.parse(
          fs.readFileSync(`${this.name}/${adjacentOctantFile}`)
        );
        allNeurons.push(...adjacentNeurons);
        updatedAdjacentNeurons[adjacentOctantFile] = adjacentNeurons;
      }

      // Build the k-d tree with all neurons
      let tree = new KDTree(3); // 3 dimensions: x, y, z
      for (let neuron of allNeurons) {
        tree.root = tree.insert(
          [neuron.x, neuron.y, neuron.z],
          neuron,
          tree.root
        );
      }

      // Iterate over all neurons in the current octant
      for (let neuron of neurons) {
        // Find the n nearest neighbors of the current neuron
        let nearestNeighbors = tree.nearest(neuron, 15);

        // Connect the neuron to its nearest neighbors
        for (let nearestNeighbor of nearestNeighbors) {
          this.connect(neuron, nearestNeighbor.value);
        }
      }

      // Save the updated neurons to the octant file
      fs.writeFileSync(`${this.name}/${octantFile}`, JSON.stringify(neurons));

      // Save the updated neurons from adjacent octants back to their respective files
      for (let [adjacentOctantFile, updatedNeurons] of Object.entries(
        updatedAdjacentNeurons
      )) {
        fs.writeFileSync(
          `${this.name}/${adjacentOctantFile}`,
          JSON.stringify(updatedNeurons)
        );
      }
    }
  }

  // connectNeuronsFromOctants() {
  //   // create bar for progress tracking connection events
  //   // let connectBar = new ProgressBar(":current", { total: this.numNeurons });

  //   // Load the adjacency map from a file
  //   let adjacencyMap = new Map(
  //     JSON.parse(fs.readFileSync("adjacencyMap.json"))
  //   );

  //   let test;

  //   // Iterate over all octants
  //   for (let octantFile of fs.readdirSync("octants")) {
  //     let neurons = JSON.parse(fs.readFileSync(`octants/${octantFile}`));

  //     // Create a k-d tree from the neurons
  //     let index = new KDBush(
  //       neurons,
  //       (p) => p.x,
  //       (p) => p.y,
  //       (p) => p.z
  //     );

  //     // Create a map to store the updated neurons from adjacent octants
  //     let updatedAdjacentNeurons = {};

  //     // Iterate over all neurons in the current octant
  //     for (let neuron of neurons) {
  //       // Find the k nearest neighbors of the neuron
  //       let nearestNeighbors = geokdbush.around(
  //         index,
  //         neuron.x,
  //         neuron.y,
  //         neuron.z,
  //         this.k
  //       );

  //       // Define the bounding box for the current neuron
  //       // let boundingBox = {
  //       //   minX: neuron.x - this.maxDistance,
  //       //   maxX: neuron.x + this.maxDistance,
  //       //   minY: neuron.y - this.maxDistance,
  //       //   maxY: neuron.y + this.maxDistance,
  //       //   minZ: neuron.z - this.maxDistance,
  //       //   maxZ: neuron.z + this.maxDistance,
  //       // };

  //       // Connect the neuron to its nearest neighbors
  //       for (let otherNeuron of nearestNeighbors) {
  //         this.connect(neuron, otherNeuron);
  //       }

  //       // Connect the neuron to other neurons in the same octant
  //       // for (let otherNeuron of neurons) {
  //       //   if (
  //       //     otherNeuron !== neuron &&
  //       //     this.isWithinBoundingBox(otherNeuron, boundingBox)
  //       //   ) {
  //       //     this.connect(neuron, otherNeuron);
  //       //     // connectBar.tick();
  //       //   }
  //       }

  //       // Connect the neuron to neurons in adjacent octants
  //       for (let adjacentOctantFile of adjacencyMap.get(octantFile)) {
  //         // Load the neurons from the adjacent octant if they haven't been loaded yet
  //         if (!updatedAdjacentNeurons[adjacentOctantFile]) {
  //           updatedAdjacentNeurons[adjacentOctantFile] = JSON.parse(
  //             fs.readFileSync(`octants/${adjacentOctantFile}`)
  //           );
  //         }

  //         for (let otherNeuron of updatedAdjacentNeurons[adjacentOctantFile]) {
  //           if (this.isWithinBoundingBox(otherNeuron, boundingBox)) {
  //             this.connect(neuron, otherNeuron);
  //           }
  //         }
  //       }
  //     }

  //     // Save the updated neurons to the octant file
  //     fs.writeFileSync(`octants/${octantFile}`, JSON.stringify(neurons));

  //     // Save the updated neurons from adjacent octants back to their respective files
  //     for (let [adjacentOctantFile, updatedNeurons] of Object.entries(
  //       updatedAdjacentNeurons
  //     )) {
  //       fs.writeFileSync(
  //         `octants/${adjacentOctantFile}`,
  //         JSON.stringify(updatedNeurons)
  //       );
  //     }
  //   }
  // }

  isWithinBoundingBox(neuron, boundingBox) {
    return (
      neuron.x >= boundingBox.minX &&
      neuron.x <= boundingBox.maxX &&
      neuron.y >= boundingBox.minY &&
      neuron.y <= boundingBox.maxY &&
      neuron.z >= boundingBox.minZ &&
      neuron.z <= boundingBox.maxZ
    );
  }

  connect_old(neuron1, neuron2) {
    neuron1.connections.push([neuron2.x, neuron2.y, neuron2.z]);
    neuron2.connections.push([neuron1.x, neuron1.y, neuron1.z]);
    neuron2.synapticPathways = neuron2.connections.length;
  }

  connect(neuron1, neuron2) {
    // Ensure the connections property is initialized
    if (!neuron1.connections) {
      neuron1.connections = [];
    }
    if (!neuron2.connections) {
      neuron2.connections = [];
    }

    neuron1.connections.push({ x: neuron2.x, y: neuron2.y, z: neuron2.z });
    neuron2.connections.push({ x: neuron1.x, y: neuron1.y, z: neuron1.z });
    neuron1.synapticPathways = neuron1.connections.length;
    neuron2.synapticPathways = neuron2.connections.length;
  }

  generateNeuron(x, y, z) {
    let centerX = x;
    let centerY = y;
    let centerZ = z;

    let neuron = null;

    if (this.gpuAcceleration) {
      const generateNeuronCoordinates = gpu
        .createKernel(function (centerX, centerY, centerZ) {
          let x = centerX + Math.random() - 0.5;
          let y = centerY + Math.random() - 0.5;
          let z = centerZ + Math.random() - 0.5;
          return [x, y, z];
        })
        .setOutput([1]);
      let coordinates = generateNeuronCoordinates(centerX, centerY, centerZ);
      neuron = new Neuron(
        coordinates[0][0],
        coordinates[0][1],
        coordinates[0][2]
      );
    } else {
      // minus 0.05 to ensure the neuron is within the cluster
      // increasing the range is inverse and will localise the neurons to the center of the cluster
      // default range is 0.05
      neuron = new Neuron(
        centerX + Math.random() - 0.5,
        centerY + Math.random() - 0.5,
        centerZ + Math.random() - 0.5
      );
    }

    return neuron;
  }

  standardGenerate() {
    let neuronsPerProcess = this.numNeurons / this.numClusters;
    console.log(`Neurons per process: ${neuronsPerProcess}`);

    let i = 0;
    let bar = new ProgressBar(":bar", { total: this.numClusters });

    const generateNeuronCoordinates = gpu
      .createKernel(function (centerX, centerY, centerZ) {
        let x = centerX + Math.random() - 0.5;
        let y = centerY + Math.random() - 0.5;
        let z = centerZ + Math.random() - 0.5;
        return [x, y, z];
      })
      .setOutput([1]);

    let generateNeurons = () => {
      if (i < this.numClusters) {
        let centerX = math.random();
        let centerY = math.random();
        let centerZ = math.random();

        let neuron = null;

        for (let j = 0; j < neuronsPerProcess; j++) {
          if (this.gpuAcceleration) {
            let coordinates = generateNeuronCoordinates(
              centerX,
              centerY,
              centerZ
            );
            neuron = new Neuron(
              coordinates[0][0],
              coordinates[0][1],
              coordinates[0][2]
            );
          } else {
            neuron = new Neuron(
              centerX + Math.random() - 0.5,
              centerY + Math.random() - 0.5,
              centerZ + Math.random() - 0.5
            );
          }

          // Define the bounding box for the current neuron
          let boundingBox = {
            minX: neuron.x - this.maxDistance,
            maxX: neuron.x + this.maxDistance,
            minY: neuron.y - this.maxDistance,
            maxY: neuron.y + this.maxDistance,
            minZ: neuron.z - this.maxDistance,
            maxZ: neuron.z + this.maxDistance,
          };

          // Connect the neuron to existing neurons
          for (let k = 0; k < this.neurons.length; k++) {
            // let otherNeuron =
            //   this.neurons[Math.floor(Math.random() * this.neurons.length)];
            let otherNeuron = this.neurons[k];

            // Check if the other neuron is within the bounding box
            if (
              otherNeuron.x >= boundingBox.minX &&
              otherNeuron.x <= boundingBox.maxX &&
              otherNeuron.y >= boundingBox.minY &&
              otherNeuron.y <= boundingBox.maxY &&
              otherNeuron.z >= boundingBox.minZ &&
              otherNeuron.z <= boundingBox.maxZ
            ) {
              if (this.precision === "1") {
                let dx = neuron.x - otherNeuron.x;
                let dy = neuron.y - otherNeuron.y;
                let dz = neuron.z - otherNeuron.z;
                let distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
                if (distance < this.maxDistance) {
                  neuron.connections.push([
                    otherNeuron.x,
                    otherNeuron.y,
                    otherNeuron.z,
                  ]);
                  otherNeuron.connections.push([neuron.x, neuron.y, neuron.z]);
                  otherNeuron.synapticPathways = otherNeuron.connections.length;
                }
              } else {
                neuron.connections.push([
                  otherNeuron.x,
                  otherNeuron.y,
                  otherNeuron.z,
                ]);
                otherNeuron.connections.push([neuron.x, neuron.y, neuron.z]);
                otherNeuron.synapticPathways = otherNeuron.connections.length;
              }
            }
          }

          this.neurons.push(neuron);

          let dir = `${this.name}`;
          if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
          }

          fs.appendFileSync(
            `${this.name}/neurons.json`,
            JSON.stringify(neuron) + ",\n",
            (err) => {
              if (err) throw err;
            }
          );
        }

        i++;
        bar.tick();
      }
    };

    while (i < this.numClusters) {
      generateNeurons();
    }
    console.log("Done generating neurons");
    console.log(`Total Neurons: ${this.neurons.length}`);

    let synpathLogTitle = `Synaptic Pathways`;
    console.time(synpathLogTitle);
    console.log("Calculating synaptic pathways...");
    this.calculateSynapticPathways();
    console.timeEnd(synpathLogTitle);
    console.log(`Total Connections: ${this.totalConnections}`);
  }

  octreeGenerate() {
    // create ticker to track progress
    let bar = new ProgressBar(":bar", { total: this.numNeurons });

    // check if neural mesh directory exists, if not create it
    if (!fs.existsSync(`${this.name}`)) {
      fs.mkdirSync(`${this.name}`);
    }
    // check if the octant directory exists, if not create it
    if (!fs.existsSync(`${this.name}/octants`)) {
      fs.mkdirSync(`${this.name}/octants`);
    }

    // create temp working octants directory
    // if (!fs.existsSync(`octants`)) {
    //   fs.mkdirSync(`octants`);
    // }

    // Calculate the number of neurons per cluster
    let neuronsPerCluster = this.numNeurons / this.numClusters;

    for (let i = 0; i < this.numClusters; i++) {
      // May need to record the center of the cluster for bridging connections between clusters as the neuron connections do not span clusters
      // Generate a random position for the center of the cluster
      let centerX = Math.random();
      let centerY = Math.random();
      let centerZ = Math.random();

      for (let j = 0; j < neuronsPerCluster; j++) {
        // Generate a neuron within the cluster
        let neuron = this.generateNeuron(centerX, centerY, centerZ);

        // Add the neuron to the appropriate octant
        this.rootOctant.addNeuron(neuron);
        bar.tick();

        // write progress to ./vis/progress.txt, create it if it doesn't exist
        let progressFilePath = `./progress.txt`;
        if (!fs.existsSync(progressFilePath)) {
          fs.writeFileSync(progressFilePath, "");
        }
        fs.writeFileSync(progressFilePath, `${bar.curr / bar.total}`, (err) => {
          if (err) throw err;
        });
      }
    }

    // Save the octants to disk
    // this.rootOctant.saveToDisk();
  }

  calculateSynapticPathways() {
    let bar = new ProgressBar(":bar", { total: this.neurons.length });
    for (let neuron of this.neurons) {
      neuron.synapticPathways = neuron.connections.length;
      this.totalConnections += neuron.connections.length;
      bar.tick();
    }
  }

  writeToFile(neuron) {
    let dir = `${this.name}`;
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    let writeStream = fs.createWriteStream(`${this.name}/neurons.json`, {
      flags: "a",
    });

    // for (let neuron of this.neurons) {
    // console.log(neuron);
    writeStream.write(JSON.stringify(neuron) + ",\n");
    // remove neuron from memory
    // neuron = null;
    // }

    writeStream.end();
  }
}

function benchmark() {
  for (let i = 0; i < 10; i++) {
    let meshParams = { neurons: 10 ** (i + 1), clusters: 10 ** i };
    let mesh = new NeuralMesh(meshParams.neurons, meshParams.clusters);
    let timeLogTitle = `NeuralMesh Generation (${meshParams.neurons} neurons, ${meshParams.clusters} clusters)`;
    console.time(timeLogTitle);
    mesh.standardGenerate();
    console.timeEnd(timeLogTitle);
  }
}

// benchmark();

main = (meshParams) => {
  // let meshParams = { neurons: 1000000000, clusters: 10000 }; // 1B neurons, 10K clusters
  // let meshParams = { neurons: 100000000, clusters: 1000 }; // 100M neurons, 1K clusters
  // let meshParams = { neurons: 10000000, clusters: 1000 }; // 10M neurons, 1K clusters
  // let meshParams = { neurons: 1000001, clusters: 1001 }; // 1M neurons, 100 clusters
  // let meshParams = { neurons: 100000, clusters: 100 }; // 100K neurons, 100 clusters
  // let meshParams = { neurons: 55004, clusters: 504 }; // 10K neurons, 10 clusters
  // let meshParams = { neurons: 15010, clusters: 120 }; // 1K neurons, 10 clusters
  let mesh = new NeuralMesh(meshParams);
  // mesh.validateMeshParams(); // Need to implement
  let timeLogTitle = `NeuralMesh Generation (${meshParams.neurons} neurons, ${meshParams.clusters} clusters)`;
  console.time(timeLogTitle);
  try {
    if (meshParams.buildStyle === 0) {
      console.log("Octree generation selected.");
      mesh.octreeGenerate();
      console.log("Generating octant adjacency map...");
      mesh.generateOctantAdjacencyMap();
      console.log("Connecting neurons from octants...");
      mesh.connectNeuronsFromOctants();
    } else if (meshParams.buildStyle === 1) {
      console.log("Standard generation selected.");
      mesh.standardGenerate();
    } else {
      console.log("Invalid generation type.");
    }
  } catch (err) {
    console.error(err);
    console.log(
      `Generation of NeuralMesh failed: ${meshParams.neurons} neurons, ${meshParams.clusters} clusters`
    );
    console.log(`Trying to the power of 10 less neurons and clusters...`);
    meshParams.neurons = meshParams.neurons / 10;
    meshParams.clusters = meshParams.clusters / 10;
    if (meshParams.neurons > 10 && meshParams.clusters > 10) {
      main(meshParams);
    } else {
      console.error(
        `Generation of NeuralMesh failed: ${meshParams.neurons} neurons, ${meshParams.clusters} clusters`
      );
      console.log("Please ensure your system has capable resources.");
    }
  }

  console.timeEnd(timeLogTitle);
  // mesh.connectNeurons();
  // mesh.writeToFile();
};

prompt.start();
// get generation type: automatic or manual
// manual generation: specify number of neurons and clusters
// automatic generation: specify number of neurons and the numbers of clusters will be generated automatically
prompt.get(
  [
    {
      name: "generationType",
      description: "Automatic or Manual Generation, Benchmark, or Preset?",
      type: "string",
      pattern: /automatic|a|manual|m|benchmark|b|preset|p/i,
      message: "Automatic or Manual Generation, or Benchmark?",
      required: true,
    },
  ],
  function (err, result) {
    if (
      result.generationType.toLowerCase() === "automatic" ||
      result.generationType.toLowerCase() === "a"
    ) {
      prompt.get(
        [
          {
            name: "neurons",
            description: "Number of Neurons",
            type: "integer",
            message: "Number of Neurons",
            required: true,
          },
        ],
        function (err, result) {
          let meshParams = {
            neurons: result.neurons,
            clusters: Math.floor(Math.sqrt(result.neurons)),
          };
          main(meshParams);
        }
      );
    } else if (
      result.generationType.toLowerCase() === "manual" ||
      result.generationType.toLowerCase() === "m"
    ) {
      prompt.get(
        [
          {
            name: "neurons",
            description: "Number of Neurons",
            type: "integer",
            message: "Number of Neurons",
            required: true,
          },
          {
            name: "clusters",
            description: "Number of Clusters",
            type: "integer",
            message: "Number of Clusters",
            required: true,
          },
          // precision
          {
            name: "precision",
            description:
              "Precision - Degrades performance but increases accuracy in synaptic pathways generated. Single or Double (s/d)",
            // options of 0 (single) or 1 (double)
            pattern: /single|s|double|d/i,
            type: "string",
            message: "Precision",
            required: true,
          },
          // gpuAcceleration
          {
            name: "gpuAcceleration",
            description: "GPU Acceleration",
            type: "boolean",
            message: "GPU Acceleration",
            required: true,
          },
          // parallelization
          {
            name: "parallelization",
            description: "Parallelization",
            type: "boolean",
            message:
              "Parallelization - workload distribution across CPU cores and threads or GPU cores if enabled",
            required: true,
          },
          // Build style - octree or in memory CPU/GPU dependant
          {
            name: "buildStyle",
            description: "Build Style - octree or in memory CPU/GPU dependant",
            pattern: /octree|o|in memory|im/i,
            type: "string",
            message: "Build Style - octree or in memory CPU/GPU dependant",
            required: true,
          },
          // NM, neural mesh, name
          {
            name: "name",
            description: "Neural Mesh Name",
            type: "string",
            message: "Neural Mesh Name",
            required: true,
          },
        ],
        function (err, result) {
          let meshParams = {
            neurons: result.neurons,
            clusters: result.clusters,
            precision: result.precision.toLowerCase() === "single" ? 0 : 1,
            gpuAcceleration: result.gpuAcceleration,
            parallelization: result.parallelization,
            buildStyle: result.buildStyle.toLowerCase() === "octree" ? 1 : 0,
            name: result.name,
          };
          main(meshParams);
        }
      );
    } else if (
      result.generationType.toLowerCase() === "benchmark" ||
      result.generationType.toLowerCase() === "b"
    ) {
      benchmark();
    } else if (
      result.generationType.toLowerCase() === "preset" ||
      result.generationType.toLowerCase() === "p"
    ) {
      prompt.get(
        [
          {
            name: "preset",
            description: "Preset",
            type: "string",
            pattern: /1|2|3|4|5|6|7|8|9|10|11|12|13|14|15/i,
            message: "Preset",
            required: true,
          },
        ],
        function (err, result) {
          let meshParams = {};
          switch (result.preset) {
            case "1":
              meshParams = {
                neurons: 10000000,
                clusters: 1000,
                precision: 0,
                gpuAcceleration: false,
                parallelization: true,
                buildStyle: 0,
                name: "NeuralMesh_10M_1K_Final",
              };
              break;
            case "2":
              meshParams = {
                neurons: 1000001,
                clusters: 1001,
                precision: 0,
                gpuAcceleration: false,
                parallelization: false,
                buildStyle: 1,
                name: "NeuralMesh_1M_1K",
              };
              break;
            case "3":
              meshParams = {
                neurons: 100000,
                clusters: 100,
                precision: 0,
                gpuAcceleration: false,
                parallelization: false,
                buildStyle: 1,
                name: "NeuralMesh_100K_100",
              };
              break;
            case "4":
              meshParams = {
                neurons: 55004,
                clusters: 504,
                precision: 0,
                gpuAcceleration: false,
                parallelization: false,
                buildStyle: 1,
                name: "NeuralMesh_10K_10",
              };
              break;
            case "5":
              meshParams = {
                neurons: 1010,
                clusters: 12,
                precision: 0,
                gpuAcceleration: false,
                parallelization: false,
                buildStyle: 0,
                name: "NeuralMesh_1K_10",
              };
              break;
            case "6":
              meshParams = {
                neurons: 101000,
                clusters: 120,
                precision: 0,
                gpuAcceleration: false,
                parallelization: false,
                buildStyle: 0,
                name: "NeuralMesh_100K_120",
              };
              break;
            case "7":
              meshParams = {
                neurons: 101000,
                clusters: 120,
                precision: 0,
                gpuAcceleration: true,
                parallelization: false,
                buildStyle: 0,
                name: "NeuralMesh_100K_120",
              };
              break;
          }

          console.log(meshParams);

          main(meshParams);
        }
      );
    }
  }
);

module.exports = {
  main: main,
  benchmark: benchmark,
};
