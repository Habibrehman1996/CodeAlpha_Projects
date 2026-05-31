from music21 import converter, note
import glob
import numpy as np

def load_notes():

    notes=[]

    files=glob.glob("dataset/*.mid")

    for file in files:

        print("Reading:",file)

        midi=converter.parse(file)

        for element in midi.flatten().notes:

            if isinstance(element,note.Note):

                notes.append(
                    str(element.pitch)
                )

    return notes


def prepare_sequences(notes):

    unique_notes=sorted(set(notes))

    note_to_int={
        note:num
        for num,note in enumerate(unique_notes)
    }

    sequence_length=100

    network_input=[]
    network_output=[]

    for i in range(
        len(notes)-sequence_length
    ):

        seq_in=notes[i:i+sequence_length]

        seq_out=notes[i+sequence_length]

        network_input.append(
            [note_to_int[n]
            for n in seq_in]
        )

        network_output.append(
            note_to_int[seq_out]
        )

    X=np.reshape(
        network_input,
        (
            len(network_input),
            sequence_length,
            1
        )
    )

    X=X/float(
        len(unique_notes)
    )

    return X,network_output,unique_notes