from preprocess import *
import pickle

print("Loading notes...")

notes = load_notes()

unique_notes = sorted(set(notes))

print("Saving notes.pkl...")

with open(
    "models/notes.pkl",
    "wb"
) as filepath:

    pickle.dump(
        unique_notes,
        filepath
    )

print("notes.pkl saved successfully!")