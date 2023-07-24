class Neuron {
  constructor() {
    this.connections = [];
    this.value = Math.random();
    this.weight = Math.random();
  }

  connectTo(neuron) {
    this.connections.push(neuron);
  }
}

class Superposition {
  constructor(neurons) {
    this.neurons = neurons;
    this.position = this.calculatePosition();
  }

  calculatePosition() {
    let x = 0;
    let y = 0;
    let z = 0;

    for (let neuron of this.neurons) {
      x += neuron.x;
      y += neuron.y;
      z += neuron.z;
    }

    return {
      x: x / this.neurons.length,
      y: y / this.neurons.length,
      z: z / this.neurons.length,
    };
  }
}

class NeuralNetwork {
  constructor(size) {
    this.size = size;
    this.neurons = this.createNeurons();
    this.superpositions = [];
  }

  createNeurons() {
    let neurons = [];
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        for (let k = 0; k < this.size; k++) {
          let neuron = new Neuron();
          neuron.x = i;
          neuron.y = j;
          neuron.z = k;
          neurons.push(neuron);
        }
      }
    }
    return neurons;
  }

  activateRandomNeurons(percentage) {
    let numToActivate = Math.floor(this.neurons.length * percentage);
    for (let i = 0; i < numToActivate; i++) {
      let neuron =
        this.neurons[Math.floor(Math.random() * this.neurons.length)];
      neuron.value = 1;
    }
  }

  createSuperposition() {
    let activatedNe                                                                                                                                            V+9urons = this.neurons.filter((neuron) => neuron.value === 1);
    let superposition = new Superposition(activatedNeurons);
    this.superpositions.push(superposition);
  }
}

let neuralNetwork = new NeuralNetwork(20);
neuralNetwork.activateRandomNeurons(0.05);
neuralNetwork.createSuperposition();
