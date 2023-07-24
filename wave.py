import numpy as np
import matplotlib.pyplot as plt
import matplotlib.animation as animation

fig, ax = plt.subplots()

# Initial values
bpm = 64
breaths_per_minute = 12
body_temperature = 37

# Convert bpm and breaths per minute to Hz
heart_rate_frequency = bpm / 60
breathing_frequency = breaths_per_minute / 60

# Assuming a sample rate of 44100Hz (standard for audio)
sample_rate = 44100
time = np.linspace(0, 10, 10 * sample_rate)

# Create initial waves
heart_rate = np.sin(2 * np.pi * heart_rate_frequency * time)
breathing = np.sin(2 * np.pi * breathing_frequency * time)
# Body temperature is constant in this model
body_temperature_wave = np.full_like(time, body_temperature)

combined_wave = heart_rate + breathing + body_temperature_wave

line, = ax.plot(time, combined_wave)


def update(num, line):
    # Modulate heart rate, breathing, and body temperature over time
    bpm = 64 + 10 * np.sin(2 * np.pi * 0.1 * num / sample_rate)
    breaths_per_minute = 12 + 2 * np.sin(2 * np.pi * 0.1 * num / sample_rate)
    body_temperature = 37 + 0.5 * np.sin(2 * np.pi * 0.1 * num / sample_rate)

    heart_rate_frequency = bpm / 60
    breathing_frequency = breaths_per_minute / 60

    # Update time array
    time = np.linspace(num / sample_rate, 10 + num /
                       sample_rate, 10 * sample_rate)

    combined_wave = (np.sin(2 * np.pi * heart_rate_frequency * time) +
                     np.sin(2 * np.pi * breathing_frequency * time) +
                     body_temperature)
    line.set_ydata(combined_wave)

    # Print current values
    print(f"Heart rate: {bpm} bpm")
    print(f"Breathing: {breaths_per_minute} breaths per minute")
    print(f"Body temperature: {body_temperature} degrees Celsius")
    return line,


ani = animation.FuncAnimation(
    fig, update, frames=range(len(time)), fargs=[line])

plt.show()
