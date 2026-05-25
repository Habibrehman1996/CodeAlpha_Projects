import streamlit as st
import pandas as pd
import nltk
import string

from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity


# Download NLTK resources
nltk.download('punkt')
nltk.download('punkt_tab')
nltk.download('stopwords')


# Page settings
st.set_page_config(
    page_title="CodeAlpha FAQ Chatbot",
    page_icon="🤖",
    layout="wide"
)


# Sidebar
with st.sidebar:

    st.title("🤖 CodeAlpha FAQ Bot")

    st.write("---")

    st.subheader("Features")

    st.write("✔ NLP Processing")
    st.write("✔ TF-IDF Vectorization")
    st.write("✔ Cosine Similarity")
    st.write("✔ FAQ Matching")
    st.write("✔ Chat History")

    st.write("---")

    # Suggested Questions
    st.subheader("Suggested Questions")

    suggestions = [
        "What is AI?",
        "What is frontend?",
        "Does CodeAlpha offer internships?",
        "What is Machine Learning?",
        "What is backend?"
    ]

    for question in suggestions:

        if st.button(question):

            st.session_state.selected_question = question

    st.write("---")

    if st.button("🗑 Clear Chat"):

        st.session_state.messages=[]

        st.rerun()

# Title
st.title("🤖 CodeAlpha FAQ Chatbot")

st.write(
    "Your questions matter to us — we are always here to help you."
)


# Load FAQ CSV
faq = pd.read_csv("faq.csv")


# Text preprocessing
def preprocess(text):

    text=text.lower()

    words=word_tokenize(text)

    stop_words=set(
        stopwords.words("english")
    )

    words=[
        word for word in words
        if word not in stop_words
        and word not in string.punctuation
    ]

    return " ".join(words)


# Process FAQ questions
faq["processed"]=faq["Question"].apply(
    preprocess
)


# Vectorization
vectorizer=TfidfVectorizer()

faq_vectors=vectorizer.fit_transform(
    faq["processed"]
)


# Chatbot function
def chatbot(user_question):

    processed_question = preprocess(
        user_question
    )

    user_vector = vectorizer.transform(
        [processed_question]
    )

    similarity = cosine_similarity(
        user_vector,
        faq_vectors
    )

    best_match = similarity.argmax()

    score = similarity[0][best_match]

    confidence = round(
        score*100,
        2
    )


    if score > 0.40:

        answer = faq["Answer"][
            best_match
        ]


    else:

        answer = (
            "I couldn't find a suitable answer. "
            "Your question has been saved for future improvements."
        )

        try:

            unknown = pd.read_csv(
                "unknown_questions.csv"
            )

        except:

            unknown = pd.DataFrame(
                columns=["Question"]
            )


        # Duplicate question avoid
        if user_question not in unknown[
            "Question"
        ].values:

            new_question = pd.DataFrame(
                {
                    "Question":[
                        user_question
                    ]
                }
            )

            unknown = pd.concat(
                [
                    unknown,
                    new_question
                ],
                ignore_index=True
            )

            unknown.to_csv(
                "unknown_questions.csv",
                index=False
            )


    return answer, confidence



# Initialize chat history
if "messages" not in st.session_state:

    st.session_state.messages=[]



# Show old messages
for message in st.session_state.messages:

    with st.chat_message(
        message["role"]
    ):

        st.write(
            message["content"]
        )



# User input
prompt=st.chat_input(
    "Type your question..."
)
# Check suggested question click
if "selected_question" in st.session_state:

    prompt = st.session_state.selected_question
    del st.session_state.selected_question



if prompt:

    # Show user message
    st.session_state.messages.append(
        {
            "role":"user",
            "content":prompt
        }
    )


    with st.chat_message("user"):

        st.write(prompt)



    # Get bot response
    response,confidence=chatbot(
        prompt
    )



    bot_response=f"""
{response}

📊 Match Score: {confidence}%
"""



    st.session_state.messages.append(
        {
            "role":"assistant",
            "content":bot_response
        }
    )



    with st.chat_message(
        "assistant"
    ):

        st.write(
            bot_response
        )