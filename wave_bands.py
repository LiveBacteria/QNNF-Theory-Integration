import numpy as np
import matplotlib.pyplot as plt
import matplotlib.animation as animation

fig, ax = plt.subplots()

t = 0

bpm = 64
heart_rate_frequency = bpm / 60  # Convert bpm to Hz

breaths_per_minute = 12
breathing_frequency = breaths_per_minute / \
    60  # Convert breaths per minute to Hz

body_temperature = 37  # Average body temperature in degrees Celsius

# Assuming a sample rate of 44100Hz (standard for audio)
sample_rate = 44100
time = np.linspace(0, 10, 10 * sample_rate)

heart_rate = np.sin(2 * np.pi * heart_rate_frequency * time)
breathing = np.sin(2 * np.pi * breathing_frequency * time)
# Body temperature is constant in this model
body_temperature = np.full_like(time, body_temperature)

lines = [ax.plot(time, heart_rate)[0], ax.plot(time, breathing)[
    0], ax.plot(time, body_temperature)[0]]


def update(num, time, lines):
    lines[0].set_ydata(
        np.sin(2 * np.pi * heart_rate_frequency * (time + num / sample_rate)))
    lines[1].set_ydata(
        np.sin(2 * np.pi * breathing_frequency * (time + num / sample_rate)))
    return lines


ani = animation.FuncAnimation(
    fig, update, frames=range(len(time)), fargs=[time, lines])

plt.show()
