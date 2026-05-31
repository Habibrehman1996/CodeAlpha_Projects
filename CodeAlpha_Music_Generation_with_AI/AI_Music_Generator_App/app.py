import streamlit as st
from utils.generator import generate_music

st.set_page_config(
    page_title="CodeAlpha AI Music Generator",
    page_icon="🎵",
    layout="wide"
)

st.title("🎵 CodeAlpha AI Music Generator")

st.markdown(
    "Generate AI music using LSTM model."
)

genre = st.selectbox(
    "Select Genre",
    [
        "Classical",
        "Jazz"
    ]
)

emotion = st.selectbox(
    "Select Emotion",
    [
        "Happy",
        "Sad",
        "Calm",
        "Energetic"
    ]
)

instrument = st.selectbox(
    "Select Instrument",
    [
        "Piano",
        "Violin",
        "Flute",
        "Guitar"
    ]
)

duration = st.slider(
    "Duration (seconds)",
    10,
    60,
    30
)

if st.button(
    "🎵 Generate Music"
):

    with st.spinner(
        "Generating Music..."
    ):

        path = generate_music(
            genre,
            emotion,
            instrument,
            duration
        )

    st.success(
        "Music Generated Successfully!"
    )

    with open(
        path,
        "rb"
    ) as file:

        st.download_button(
            label="⬇ Download MIDI",
            data=file,
            file_name="generated_music.mid",
            mime="audio/midi"
        )

    st.info(
        f"Genre: {genre} | Emotion: {emotion} | Instrument: {instrument}"
    )