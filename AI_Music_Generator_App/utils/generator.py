from tensorflow.keras.models import load_model
from music21 import note, stream, instrument, tempo
import numpy as np
import pickle
import os

model = load_model("model/music_model.h5")

with open("model/notes.pkl", "rb") as f:
    unique_notes = pickle.load(f)

int_to_note = dict(
    (number, n)
    for number, n in enumerate(unique_notes)
)


def generate_music(
    genre,
    emotion,
    instrument_name,
    duration
):

    os.makedirs(
        "generated_music",
        exist_ok=True
    )

    emotion_tempo = {
        "Happy": 140,
        "Sad": 60,
        "Calm": 80,
        "Energetic": 180
    }

    instrument_map = {
        "Piano": instrument.Piano(),
        "Violin": instrument.Violin(),
        "Flute": instrument.Flute(),
        "Guitar": instrument.AcousticGuitar()
    }

    generated_notes = duration * 6

    pattern = np.random.randint(
        0,
        len(unique_notes),
        100
    ).tolist()

    prediction_output = []

    for _ in range(generated_notes):

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

    output_notes = []

    current_offset = 0

    for item in prediction_output:

        new_note = note.Note(item)

        new_note.offset = current_offset

        output_notes.append(new_note)

        current_offset += 0.5

    midi_stream = stream.Stream()

    midi_stream.append(
        tempo.MetronomeMark(
            number=emotion_tempo[emotion]
        )
    )

    midi_stream.append(
        instrument_map[instrument_name]
    )

    for n in output_notes:
        midi_stream.append(n)

    output_file = (
        "generated_music/output.mid"
    )

    midi_stream.write(
        "midi",
        fp=output_file
    )

    return output_file