import matplotlib.pyplot as plt
from mpl_toolkits.mplot3d import Axes3D
from tqdm import tqdm
import json
import os

# Create a new figure
fig = plt.figure(figsize=(15, 15))

fig.suptitle('NeuralMesh_1MN_1KC_512O')
fig.canvas.set_window_title('Octants')

# Create a 3D axis
ax = fig.add_subplot(111, projection='3d')

# Directory containing the octant files
directory = 'C:/Users/Tyler/Documents/Projects/QNN/octants'

# Iterate over all JSON files in the directory
for filename in tqdm(os.listdir(directory)):
    if filename.endswith('.json'):
        # Load the data
        with open(os.path.join(directory, filename)) as f:
            data = json.load(f)

        # Extract the coordinates
        x = [neuron['x'] for neuron in data]
        y = [neuron['y'] for neuron in data]
        z = [neuron['z'] for neuron in data]

        # Scatter plot
        ax.scatter(x, y, z, s=0.5, alpha=0.5)

# Set labels
ax.set_xlabel('X')
ax.set_ylabel('Y')
ax.set_zlabel('Z')

# Show the plot
plt.show()
