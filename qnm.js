const { map, create, re } = require("mathjs");
const { kdTree } = require("./kdtree");
const { get } = require("prompt");
const ProgressBar = require("progress");
const { PineconeClient } = require("@pinecone-database/pinecone");

// Read and store the pineconeAPIKey from the .env file
require("dotenv").config();
const pineconeAPIKey = process.env.PINECONE_API_KEY;

// Initialize the client
const client = new PineconeClient();

// const D = 3500;
// const points = Array.from({ length: 50 }, () => {
//   const coords = Array.from({ length: D }, () => Math.random());
//   return {
//     currentCoords: coords,
//     originalCoords: coords,
//     linkedPoints: [], // set your linked points here
//   };
// });

const ps = 0.988;
const gs = 512;
const nc = 1000000;
// const d = 3500;
const d = 3;
const density = 7000;

let meaningOfLife = 42;

// CurrentState of the model: [[d dimensional coordinates], ...]
// NextPotentialState of the model: [{coordinates: [d dimensional coordinates], value: SignalValue, weight: Scalar}, ...]
const currState = [],
  nextPotentialState = new Map(),
  omittedPoints = new Map();

function getInput(input) {
  switch (input.type) {
    case "audio":
      return getAudioInput(input);
    case "video":
      return getVisualInput(input);
    case "wave":
      return getWaveInput(input);
  }
}

// 44khz audio input and 256x256 visual input
// data length is mapped one to one with the number of neurons/points in the space
const inputMap = {
  //   audio: {
  //     type: "audio",
  //     dataLength: 44000,
  //     mappedNeurons: [],
  //     getInput: function () {
  //       return getInput(this);
  //     },
  //   },
  //   video: {
  //     type: "video",
  //     dataLength: 256 ^ (2 * 3),
  //     mappedNeurons: [],
  //     getInput: function () {
  //       return getInput(this);
  //     },
  //   },
  // basal waveform that represents the current state of the system(homeostatic)
  basalWaveInput: {
    type: "wave",
    dataLength: 256 ^ d,
    mappedNeurons: [],
    getInput: function () {
      return getInput(this);
    },
    data: [],
  },
};

// Creates a Psiron in the quantum space. A Psiron is essentially a superposition of entangled neurons which itself is positioned at the centroid point.
function createSuperpositionFromState() {
  // create superpositions for each point in the space
  const { avgPoint } = currState.reduce(
    (acc, cur, _, arr) => {
      for (let i = 0; i < cur.neuron.length; i++) {
        acc.avgPoint[i] += cur.neuron[i] / arr.length;
      }
      return acc;
    },
    { avgPoint: Array(d).fill(0) }
  );

  return {
    avgPoint,
  };
}

function calculateWeight(currState, neighborState) {
  // Scale states to range [0, 1]
  const currScaled = scaleToRange(currState, [0, 1]);
  const neighborScaled = scaleToRange(neighborState, [0, 1]);

  // Calculate weight based on exponential falloff
  // Higher state = more attraction
  const weightParam = 2;
  const weight = Math.exp(
    -weightParam * (1 - currScaled) * (1 - neighborScaled)
  );

  return weight;
}

function scaleToRange(value, range) {
  const [min, max] = range;
  return (value - min) / (max - min);
}

function createWeight(values) {
  const a = 1;
  const b = 0.1;

  // Calculate Gaussian weight for each value
  const weights = values.map((value) => {
    return a * Math.exp(-Math.pow(value - 0.5, 2) / (2 * Math.pow(b, 2)));
  });

  // Aggregate weights (e.g. take average)
  const aggregatedWeight =
    weights.reduce((sum, w) => sum + w, 0) / weights.length;

  return aggregatedWeight;
}

// Enact quantum motion for a superposition
// Takes qs as quantum space and vector as the vector to enact motion on
async function enactQuantumMotion(qs, vector) {
  // topK to return
  const topK = 10;
  const newID = generateUUID();

  // Array of all superpositions to update, including given superposition
  const superpositionsToUpdate = [
    {
      id: newID,
      values: vector,
      metadata: { weight: 1 },
    },
  ];

  // Array of weights for each neighbor
  const weightArray = [];

  // REWORK: Query nearest neighbors from point not id
  // doin so will allow for more efficient processing overall
  // This is because we can query the nearest neighbors of the point prior to upserting and quering the nearest neighbors of the point after upserting
  // Query nearest neighbors
  const queryRequest = {
    // ToDo Documentation:
    vector: vector,
    topK: topK,
    includeValues: true,
    includeMetadata: true,
  };

  // Neareset Neighboring Superpositions
  const response = await qs.query({ queryRequest });

  // If there are no matches, skip and return
  if (response.matches.length !== 0) {
    // May be incorrect call for getting matches
    // Working under the assumption that matches are the nearest neighbors
    // Assuming matches is: { matches: [ { id: 'id', values: 'values', metadata: 'metadata' } ] }
    const nn = response.matches;

    // Calculate motion direction based on nearest neighbors for d dimensions
    // 3500 dimensions
    const motionDirection = Array(d).fill(0);
    for (let i = 0; i < d; i++) {
      motionDirection[i] /= topK;
    }

    // Loop through neighbors
    // stepSize is the amount to move towards the neighbor, value is determined by rank of neighbor
    for (let i = 0; i < nn.length; i++) {
      const neighbor = nn[i];
      const givenVector = superpositionsToUpdate[0].values;

      // setStepSize based on rank of neighbor
      // stepSize is a scalar value between 0 and 1
      const stepSize = 1 - i / nn.length;

      // Move neighbor towards given vector
      const updatedNeighborVector = moveTowards(
        neighbor.values,
        givenVector,
        stepSize
      );

      // Move given vector towards neighbor
      const updatedVector = moveTowards(givenVector, neighbor.values, stepSize);

      // Build updated neighbor upsert request
      const updatedNeighbor = {
        id: neighbor.id,
        values: updatedNeighborVector,
        metadata: neighbor.metadata,
      };

      superpositionsToUpdate.push(updatedNeighbor);
      superpositionsToUpdate[0].values = updatedVector;

      // Append Weight values to weightArray
      weightArray.push(neighbor.metadata.weight);
    }

    // Gather weights from neighbors
    const psironWeight = createWeight(weightArray);
    superpositionsToUpdate[0].metadata.weight = psironWeight;

    // Helper functions
    function vectorSubtract(a, b) {
      let result = [];

      for (let i = 0; i < a.length; i++) {
        result[i] = a[i] - b[i];
      }

      return result;
    }

    function moveTowards(from, to, stepSize) {
      // Calculate direction vector
      const direction = vectorSubtract(to, from);

      // Normalize direction vector
      const length = vectorLength(direction);
      const normalizedDirection = direction.map((val) => val / length);

      // Scale direction by step size
      const scaledDirection = normalizedDirection.map((val) => val * stepSize);

      // Move from vector towards target
      const result = [];
      for (let i = 0; i < from.length; i++) {
        result[i] = from[i] + scaledDirection[i];
      }

      return result;
    }

    // Helper functions
    function vectorLength(vector) {
      return Math.sqrt(vector.reduce((acc, val) => acc + val ** 2, 0));
    }

    // Update Neighboring Superpositions towards the current superposition by rank
    // Update superposition
    await qs.upsert({
      upsertRequest: {
        vectors: superpositionsToUpdate,
      },
    });

    return psironWeight;
  } else {
    // Update superposition
    await qs.upsert({
      upsertRequest: {
        vectors: superpositionsToUpdate,
      },
    });

    // Sets default weight to 1, entering the attractor state
    return 1;
  }
}

function updateCurrState() {
  // get input from the environment
  for (let inputKey in inputMap) {
    let input = inputMap[inputKey];
    getInput(input);
  }

  // Update currState to reflect the current state of the system
  // currState += [point, value]

  // Loops over the input map and updates the current state to reflect the current input
  // currState += [point, value]
  // for (let inputKey in inputMap) {
  //   let input = inputMap[inputKey];
  //   // update mappedNeurons to reflect the current input
  //   currState.push(
  //     ...input.mappedNeurons.map((point) => ({
  //       point,
  //       value: input.mappedNeurons[point],
  //     }))
  //   );
  // }
}

// Generate UUID for Superposition in hypervector database
const generateUUID = () => {
  return Array.from(Array(16))
    .map((e) =>
      Math.floor(Math.random() * 255)
        .toString(16)
        .padStart(2, "0")
    )
    .join("")
    .match(/.{1,4}/g)
    .join("-");
};

// This is just a check function that moves neurons that pass the threshold of 0.3 into the currState
function determineFiringNeurons() {
  // Determine if the neurons should fire given

  // Loop through the nextPotentialState map
  for (let neuron in nextPotentialState.keys()) {
    // If the neuron's potential is greater than the threshold
    if (nextPotentialState.get(neuron).value > 0.3) {
      // Add the neuron to the currState
      currState.push({
        point: neuron,
        value: nextPotentialState.get(neuron).value,
      });
    }

    // Remove the neuron from the nextPotentialState map
    delete nextPotentialState[neuron];
  }
}

// Get adjacent points
function getAdjacentPoints(vector) {
  const adjacentPoints = [];

  const dims = vector.length;

  for (let i = 0; i < dims; i++) {
    // Create adjacent point by adding ps
    let adjacent = structuredClone(vector);
    adjacent[i] += ps;
    adjacentPoints.push(adjacent);

    // Create adjacent point by subtracting ps
    adjacent = structuredClone(vector);
    adjacent[i] -= ps;
    adjacentPoints.push(adjacent);
  }

  return adjacentPoints;
}

// Essentially the determine firing neurons function
async function updateNextPotentialState() {}

async function propagateInputSignal() {}

async function runningLoop(client) {
  const superpositions = client.Index("quantum-neural-map");

  // update currState to reflect the current state of the system from the environment: Inputs
  updateCurrState();

  const { avgPoint } = createSuperpositionFromState();

  // Update nextPotentialState
  // updateNextPotentialState();

  // enact quantum motion for the superposition and it's neighbors
  const psironState = await enactQuantumMotion(superpositions, avgPoint);

  for (let neuron of currState) {
    // Get adjacent points
    const adjacentPoints = getAdjacentPoints(neuron.neuron);

    // Loop through adjacent points
    for (let point of adjacentPoints) {
      // If the point is in the omitted points map, skip it
      if (!omittedPoints.has(point)) {
        // If the point is not in the nextPotentialState map
        if (!nextPotentialState.has(point)) {
          // Add the point to the nextPotentialState map
          nextPotentialState.set(point, {
            value: neuron.value * psironState,
            count: 1,
            weight: psironState,
          });
        } else {
          // Update the value of the point in the nextPotentialState map
          nextPotentialState.get(point).value += neuron.value * psironState;
        }

        nextPotentialState.get(point).count =
          nextPotentialState.get(point).count + 1;
      }
    }
  }

  // Add Omitted Points to the Omitted points map
  // Omitted points are the previously firing points. ie, the current state
  for (let neuron of currState) {
    omittedPoints.set(neuron.point, neuron.value);
  }

  // Phase is the superpoositions phase, gravity, chase, and repel are the parameters for the quantum motion
  // propagate the input signal to the neurons
  // await propagateInputSignal();

  // Clear the currState array
  currState.length = 0;

  // Loop the nextPotentialState map and move them to the currentState
  for (let neuron of nextPotentialState.keys()) {
    // If the neuron's potential is greater than the threshold
    if (nextPotentialState.get(neuron).value > 0.3) {
      // Add the neuron to the currState
      currState.push({
        point: neuron,
        value: nextPotentialState.get(neuron).value,
      });
    }
  }

  // run the system
  // update the environment
  // repeat
}

// Map inputs to neurons
function mapInputs() {
  for (let input of Object.values(inputMap)) {
    let centerPoint;
    switch (input.type) {
      case "audio":
        centerPoint = Array(d).fill(0);
        centerPoint[0] = 450; // place near the "edge" along the first dimension
        break;
      case "video":
        centerPoint = Array(d).fill(0);
        centerPoint[1] = 450; // place near the "edge" along the second dimension
        break;
      case "wave":
        centerPoint = Array(d).fill(0); // place at the origin
        break;
      default:
        throw new Error(`Unknown input type: ${input.type}`);
    }
    input.mappedNeurons = generateInputMap(centerPoint, input.dataLength);
  }
}

function generateInputMap(centerPoint, n) {
  let inputGrid = [];
  let gridSize = Math.ceil(Math.sqrt(n)); // size of the grid along each dimension

  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      let neuron = centerPoint.slice(); // copy the center point

      // Point Segmentation (PS) - adjust the coordinates of the neuron via a constant factor to create a quantised grid
      neuron[0] += i * ps; // adjust the first coordinate by 0.988
      neuron[1] += j * ps; // adjust the second coordinate by 0.988
      inputGrid.push(neuron);
    }
  }

  return inputGrid.slice(0, n); // return only the first n neurons
}

function getAudioInput() {
  let audioData = [];
  // get audio data
  return audioData;
}
function getVisualInput() {
  let visualData = [];
  // get visual data
  return visualData;
}

let time = 0; // Initial time
function getWaveInput(input) {
  let timeStep = 0.1; // Time step for sine wave generator

  let bpm = Math.sin(time) * 10 + 70; // Simulate fluctuating bpm around 70
  let breathingRate = Math.sin(time + Math.PI / 3) * 1 + 12; // Simulate fluctuating breathing rate around 12 breaths per minute
  let bodyTemperature = Math.sin(time + Math.PI / 6) * 0.2 + 37; // Simulate fluctuating body temperature around 37 degrees Celsius

  // Create an array of measurements
  let measurements = [bpm, breathingRate, bodyTemperature];

  // Convert the measurements to a waveform using Fourier transform
  let waveform = fourierTransform(measurements);

  // Normalize the waveform to range [0,1]
  let normalizedWaveform = normalize(waveform);

  // Map the waveform to the mappedNeurons
  let mappedNeuronsData = mapWaveformToNeurons(
    normalizedWaveform,
    input.mappedNeurons
  );

  // Add the mappedNeuronsData to the currState: Format: [{point: [x,y], value: 0.5}, ...]
  currState.push(...mappedNeuronsData);

  // Increment the time for the next call
  time += timeStep;
}

function getLiveData() {
  let timeStep = 0.1; // Time step for sine wave generator

  let bpm = Math.sin(time) * 10 + 70; // Simulate fluctuating bpm around 70
  let breathingRate = Math.sin(time + Math.PI / 3) * 1 + 12; // Simulate fluctuating breathing rate around 12 breaths per minute
  let bodyTemperature = Math.sin(time + Math.PI / 6) * 0.2 + 37; // Simulate fluctuating body temperature around 37 degrees Celsius

  // Create an array of measurements
  let measurements = [bpm, breathingRate, bodyTemperature];

  // Convert the measurements to a waveform using Fourier transform
  let waveform = fourierTransform(measurements);

  // Normalize the waveform to range [0,1]
  let normalizedWaveform = normalize(waveform);

  // Increment the time for the next call
  time += timeStep;

  return normalizedWaveform;
}

function fourierTransform(measurements) {
  let N = measurements.length;
  let waveform = new Array(N).fill(0);

  for (let k = 0; k < N; k++) {
    for (let n = 0; n < N; n++) {
      let angle = (2 * Math.PI * k * n) / N;
      waveform[k] += measurements[n] * Math.cos(angle);
    }
  }

  return waveform;
}

function inverseFourierTransform(waveform) {
  let N = waveform.length;
  let measurements = new Array(N).fill(0);

  for (let n = 0; n < N; n++) {
    for (let k = 0; k < N; k++) {
      let angle = (2 * Math.PI * k * n) / N;
      measurements[n] += waveform[k] * Math.cos(angle);
    }
  }

  return measurements;
}

function normalize(waveform) {
  // Normalize the waveform to range [0,1]
  let min = Math.min(...waveform);
  let max = Math.max(...waveform);
  let range = max - min;

  let normalizedWaveform = waveform.map((value) => (value - min) / range);
  return normalizedWaveform;
}

function mapWaveformToNeurons(waveform, neurons) {
  let neuronData = [];

  // For each neuron, assign the corresponding normalized waveform value
  for (let i = 0; i < neurons.length; i++) {
    neuronData.push({
      neuron: neurons[i],
      value: waveform[i % waveform.length], // Repeat the waveform if there are more neurons than waveform data points
    });
  }

  return neuronData;
}

let running = true;

async function runSystem() {
  mapInputs();

  await client.init({
    apiKey: pineconeAPIKey,
    environment: "us-central1-gcp",
  });

  while (running) {
    await runningLoop(client);
  }
}

runSystem();
