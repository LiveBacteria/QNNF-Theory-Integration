from vispy import app, visuals, scene
from vispy.app.timer import Timer
import json
import os
import numpy as np
from tqdm import tqdm


def visualise_octants(directory):
    # Create a canvas with a 3D viewport
    canvas = scene.SceneCanvas(keys='interactive', show=True)
    view = canvas.central_widget.add_view()

    # Prepare an empty array for the coordinates
    coords = np.empty((0, 3), dtype=np.float32)

    # Iterate over all JSON files in the directory
    for filename in tqdm(os.listdir(directory)):
        if filename.endswith('.json'):
            # Load the data
            with open(os.path.join(directory, filename)) as f:
                data = json.load(f)

            # Extract the coordinates and append them to the array
            new_coords = np.array(
                [[neuron['x'], neuron['y'], neuron['z']] for neuron in data])
            coords = np.vstack((coords, new_coords))

    # Create a scatter plot
    scatter = scene.visuals.Markers()
    scatter.set_data(coords, edge_color=None, face_color=(1, 1, 1, .5), size=5)

    view.add(scatter)

    # Add a camera to move, zoom and rotate the plot
    view.camera = 'fly'
    view.camera.fov = 65  # Adjust field of view
    view.camera.distance = 10  # Adjust distance from center

    # Create a timer that updates the camera's azimuthal angle
    def rotate_view(event):
        view.camera.phi += 1  # Adjust speed of rotation here

    timer = Timer(interval=0.1, connect=rotate_view, start=True)

    app.run()
