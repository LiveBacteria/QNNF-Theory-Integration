import numpy as np
import matplotlib.pyplot as plt
import matplotlib.animation as animation

# Parameters
sample_rate = 44100  # Sample rate in Hz
duration = 10  # Duration in seconds
FPS = 30  # Desired frames per second
window_duration = 1  # Duration of the moving window in seconds

# Time array
time = np.linspace(0, duration, int(duration * sample_rate), endpoint=False)

# Define the new amplitude for each input
sensory_inputs = {
    "heart_rate": {"bpm": 64, "amplitude": 0.1, "frequency": 64 / 60},
    "breathing": {"breaths_per_minute": 12, "amplitude": 0.2, "frequency": 12 / 60},
    "body_temperature": {"degrees_celsius": 37, "amplitude": 0.3},
}

# Define a function to generate the signal data


def generate_signals(t, sensory_inputs):
    signals = {}
    signals["heart_rate"] = sensory_inputs["heart_rate"]["amplitude"] * \
        np.sin(2 * np.pi * sensory_inputs["heart_rate"]["frequency"] * t)
    signals["breathing"] = sensory_inputs["breathing"]["amplitude"] * \
        np.sin(2 * np.pi * sensory_inputs["breathing"]["frequency"] * t)
    signals["body_temperature"] = sensory_inputs["body_temperature"]["amplitude"] * \
        np.ones_like(t)
    return signals


# Generate the signals
signals = generate_signals(time, sensory_inputs)

# Define the combined wave
combined_wave = sum(signal for signal in signals.values())

# Define a function to update the plot for each frame


def update(num, time, line):
    start = max(0, num - window_duration * sample_rate)
    end = max(num, window_duration * sample_rate)
    window_time = time[int(start):int(end)]
    window_wave = combined_wave[int(start):int(end)]
    line.set_data(window_time, window_wave)
    return line,


# Create the figure and line object
fig, ax = plt.subplots()
ax.set_xlim(0, window_duration)
ax.set_ylim(-0.6, 0.6)
line, = ax.plot([], [])

# Set up the animation
ani = animation.FuncAnimation(fig, update, frames=len(
    time), fargs=(time, line), interval=1000/FPS)

# Display the animation
plt.show()
