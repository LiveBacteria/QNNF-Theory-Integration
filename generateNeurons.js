const fs = require("fs");
const path = require("path");
const math = require("mathjs");

class Neuron {
  constructor(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
  }
}

process.on(
  "message",
  ({ centerX, centerY, centerZ, neuronsPerProcess, filename }) => {
    // Create the directory if it doesn't exist
    let dir = path.dirname(filename);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    let writeStream = fs.createWriteStream(filename, { flags: "a" });

    for (let j = 0; j < neuronsPerProcess; j++) {
      let x = centerX + math.random(-0.1, 0.1);
      let y = centerY + math.random(-0.1, 0.1);
      let z = centerZ + math.random(-0.1, 0.1);

      let neuron = new Neuron(x, y, z);
      writeStream.write(JSON.stringify(neuron) + ",\n");
    }

    writeStream.end();
  }
);
