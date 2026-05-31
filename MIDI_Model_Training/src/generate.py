from tensorflow.keras.models import load_model
from music21 import note, stream
import numpy as np
import pickle
import random

print("Loading model...")

model = load_model(
    "models/music_model.h5"
)

print("Loading notes mapping...")

with open(
    "models/notes.pkl",
    "rb"
) as filepath:

    unique_notes = pickle.load(filepath)

note_to_int = dict(
    (note, number)
    for number, note
    in enumerate(unique_notes)
)

int_to_note = dict(
    (number, note)
    for number, note
    in enumerate(unique_notes)
)

print("Preparing seed pattern...")

pattern = np.random.randint(
    0,
    len(unique_notes),
    100
).tolist()

prediction_output = []

print("Generating music...")

for note_index in range(200):

    prediction_input = np.reshape(
        pattern,
        (1, len(pattern), 1)
    )

    prediction_input = prediction_input / float(
        len(unique_notes)
    )

    prediction = model.predict(
        prediction_input,
        verbose=0
    )

    index = np.argmax(prediction)

    result = int_to_note[index]

    prediction_output.append(result)

    pattern.append(index)

    pattern = pattern[1:]

print("Creating MIDI file...")

offset = 0

output_notes = []

for pattern in prediction_output:

    new_note = note.Note(pattern)

    new_note.offset = offset

    output_notes.append(new_note)

    offset += 0.5

midi_stream = stream.Stream(
    output_notes
)

midi_stream.write(
    'midi',
    fp='generated_music/output.mid'
)

print("Music generated successfully!")
print("Saved at: generated_music/output.mid")