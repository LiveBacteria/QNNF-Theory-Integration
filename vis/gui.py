from PyQt5.QtWidgets import QApplication, QWidget, QVBoxLayout, QPushButton, QListWidget, QListWidgetItem, QLineEdit, QLabel, QRadioButton, QGroupBox, QFormLayout, QProgressBar
from PyQt5.QtCore import QTimer
import sys
import os
import subprocess
from visualise import visualise_octants


class MainWindow(QWidget):
    def __init__(self):
        super().__init__()

        self.setWindowTitle("Neural Mesh Viewer")

        self.list_widget = QListWidget()

        # Load the directories from the "neural_mesh/" directory
        for dirname in os.listdir("neural_mesh"):
            if os.path.isdir(os.path.join("neural_mesh", dirname)):
                self.list_widget.addItem(QListWidgetItem(dirname))

        self.load_button = QPushButton('Load Model')
        self.load_button.clicked.connect(self.load_model)

        self.automatic_button = QRadioButton('Automatic')
        self.manual_button = QRadioButton('Manual')
        self.benchmark_button = QRadioButton('Benchmark')
        self.preset_button = QRadioButton('Preset')

        self.neurons_input = QLineEdit()
        self.clusters_input = QLineEdit()
        self.precision_input = QLineEdit()
        self.gpu_acceleration_input = QLineEdit()
        self.parallelization_input = QLineEdit()
        self.build_style_input = QLineEdit()
        self.name_input = QLineEdit()

        self.generate_button = QPushButton('Generate Neural Mesh')
        self.generate_button.clicked.connect(self.generate_neural_mesh)

        self.progress_bar = QProgressBar()
        self.progress_bar.setRange(0, 100)

        self.layout = QVBoxLayout()
        self.layout.addWidget(self.list_widget)
        self.layout.addWidget(self.load_button)

        self.group_box = QGroupBox('Generation Type')
        self.group_layout = QVBoxLayout()
        self.group_layout.addWidget(self.automatic_button)
        self.group_layout.addWidget(self.manual_button)
        self.group_layout.addWidget(self.benchmark_button)
        self.group_layout.addWidget(self.preset_button)
        self.group_box.setLayout(self.group_layout)

        self.layout.addWidget(self.group_box)

        self.form_layout = QFormLayout()
        self.form_layout.addRow(QLabel('Neurons'), self.neurons_input)
        self.form_layout.addRow(QLabel('Clusters'), self.clusters_input)
        self.form_layout.addRow(QLabel('Precision'), self.precision_input)
        self.form_layout.addRow(
            QLabel('GPU Acceleration'), self.gpu_acceleration_input)
        self.form_layout.addRow(QLabel('Parallelization'),
                                self.parallelization_input)
        self.form_layout.addRow(QLabel('Build Style'), self.build_style_input)
        self.form_layout.addRow(QLabel('Name'), self.name_input)

        self.layout.addLayout(self.form_layout)

        self.layout.addWidget(self.generate_button)
        self.layout.addWidget(self.progress_bar)

        self.setLayout(self.layout)

        self.timer = QTimer()
        self.timer.timeout.connect(self.update_progress)

    def load_model(self):
        # Get the selected directory
        selected_dir = self.list_widget.currentItem().text()

        # Visualise the octants in the selected directory
        visualise_octants(os.path.join("neural_mesh", selected_dir))

    def generate_neural_mesh(self):
        # Get the values from the input fields
        neurons = self.neurons_input.text()
        clusters = self.clusters_input.text()
        precision = self.precision_input.text()
        gpu_acceleration = self.gpu_acceleration_input.text()
        parallelization = self.parallelization_input.text()
        build_style = self.build_style_input.text()
        name = self.name_input.text()

        # Map precision and build_style to expected values
        precision_map = {"s": 0, "d": 1}
        build_style_map = {"o": "0", "im": "1"}

        precision = precision_map.get(precision.lower(), 0)
        build_style = build_style_map.get(build_style.lower(), "octree")

        # Call the main function
        subprocess.run(
            ["node", "-e", f"require('../mesh.js').main({{neurons: {neurons}, clusters: {clusters}, precision: {precision}, gpuAcceleration: {gpu_acceleration}, parallelization: {parallelization}, buildStyle: {build_style}, name: '{name}'}})"], check=True)
        self.timer.start(1000)  # Update progress bar every second

    def update_progress(self):
        try:
            with open("progress.txt", "r") as f:
                progress = int(f.read())
                self.progress_bar.setValue(progress)
        except Exception as e:
            print(e)


app = QApplication(sys.argv)

window = MainWindow()
window.show()

sys.exit(app.exec_())
