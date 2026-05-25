# 🤖 FAQ Chatbot with NLP

An intelligent FAQ chatbot powered by Natural Language Processing that provides instant answers to user queries. Built with Python, Streamlit, and machine learning algorithms including TF-IDF vectorization and cosine similarity for accurate question matching.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [How It Works](#how-it-works)
- [Core Functions](#core-functions)
- [Configuration](#configuration)
- [Screenshots](#screenshots)

## 🎯 Overview

This FAQ chatbot uses machine learning and NLP techniques to understand user questions and match them with the most relevant answers from a knowledge base. The system preprocesses text, converts it into numerical vectors, and uses cosine similarity to find the best matching answer with a confidence score.

## ✨ Features

- **NLP-Based Question Matching**: Advanced text preprocessing with tokenization, stopword removal, and punctuation filtering
- **TF-IDF Vectorization**: Converts text into meaningful numerical representations
- **Cosine Similarity Algorithm**: Calculates similarity scores between user queries and FAQ database
- **Confidence Scoring**: Displays match accuracy percentage (0-100%)
- **Real-time Chat Interface**: Interactive conversation with instant responses
- **Chat History**: Maintains conversation context during the session
- **Suggested Questions**: Quick-access buttons for common queries
- **Unknown Question Logging**: Automatically saves unanswered questions for database improvement
- **Duplicate Prevention**: Avoids logging the same unknown question multiple times
- **Responsive UI**: Clean, modern interface built with Streamlit

## 🛠 Technologies Used

| Technology | Version | Purpose |
|------------|---------|---------|
| Python | 3.14+ | Core programming language |
| Streamlit | 1.57.0+ | Web application framework |
| NLTK | 3.9.4+ | Natural language processing |
| Pandas | 3.0.3+ | Data manipulation and CSV handling |
| Scikit-learn | 1.8.0+ | Machine learning algorithms |

## 📦 Installation

### Prerequisites

- Python 3.14 or higher
- pip package manager

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/FAQ_Chatbot.git
   cd FAQ_Chatbot
   ```

2. **Create virtual environment**
   ```bash
   python -m venv .venv
   ```

3. **Activate virtual environment**
   - Windows:
     ```bash
     .venv\Scripts\activate
     ```
   - macOS/Linux:
     ```bash
     source .venv/bin/activate
     ```

4. **Install dependencies**
   ```bash
   pip install nltk pandas scikit-learn streamlit
   ```

5. **Run the application**
   ```bash
   streamlit run app.py
   ```

6. **Access the chatbot**
   - Open browser at `http://localhost:8501`

## 🚀 Usage

### Basic Usage

1. Start the application using `streamlit run app.py`
2. Type your question in the chat input box
3. Press Enter to get an instant answer
4. View the confidence score to see match accuracy

### Using Suggested Questions

- Click any suggested question button in the sidebar
- The question will be automatically submitted
- View the answer with confidence score

### Clearing Chat History

- Click the "🗑 Clear Chat" button in the sidebar
- All conversation history will be reset

## 📁 Project Structure

```
FAQ_Chatbot/
│
├── app.py                    # Main application file
├── faq.csv                   # FAQ knowledge base (42 Q&A pairs)
├── unknown_questions.csv     # Logs for unanswered queries
├── pyproject.toml            # Project metadata and dependencies
├── uv.lock                   # Dependency lock file
└── README.md                 # Project documentation
```

## 🧠 How It Works

### Architecture Flow

```
User Input → Text Preprocessing → TF-IDF Vectorization → Cosine Similarity → Best Match Selection → Response Generation
```

### Step-by-Step Process

#### 1. **Text Preprocessing**
```python
def preprocess(text):
    # Convert to lowercase
    text = text.lower()
    
    # Tokenize into words
    words = word_tokenize(text)
    
    # Remove stopwords and punctuation
    stop_words = set(stopwords.words("english"))
    words = [word for word in words 
             if word not in stop_words 
             and word not in string.punctuation]
    
    return " ".join(words)
```

**Purpose**: Cleans and normalizes text for better matching
- Converts all text to lowercase for consistency
- Splits text into individual words (tokens)
- Removes common words (the, is, at, etc.) that don't add meaning
- Filters out punctuation marks

#### 2. **TF-IDF Vectorization**
```python
vectorizer = TfidfVectorizer()
faq_vectors = vectorizer.fit_transform(faq["processed"])
```

**Purpose**: Converts text into numerical vectors
- **TF (Term Frequency)**: How often a word appears in a document
- **IDF (Inverse Document Frequency)**: How unique a word is across all documents
- Creates a matrix where each FAQ question is represented as a vector of numbers

#### 3. **Cosine Similarity Calculation**
```python
user_vector = vectorizer.transform([processed_question])
similarity = cosine_similarity(user_vector, faq_vectors)
```

**Purpose**: Measures similarity between user query and FAQ questions
- Calculates the angle between two vectors
- Returns a score between 0 (completely different) and 1 (identical)
- Finds the FAQ question most similar to the user's query

#### 4. **Best Match Selection**
```python
best_match = similarity.argmax()
score = similarity[0][best_match]
confidence = round(score * 100, 2)
```

**Purpose**: Identifies the most relevant answer
- Selects the FAQ with the highest similarity score
- Converts score to percentage for user-friendly display

#### 5. **Response Generation**
```python
if score > 0.40:
    answer = faq["Answer"][best_match]
else:
    answer = "I couldn't find a suitable answer..."
    # Log unknown question
```

**Purpose**: Returns answer or logs unknown question
- **Threshold 0.40**: Minimum similarity required for a match
- If below threshold, saves question to `unknown_questions.csv`
- Prevents duplicate logging of the same question

## 🔧 Core Functions

### `preprocess(text)`
**Input**: Raw text string  
**Output**: Cleaned and processed text  
**Function**: Performs NLP preprocessing including lowercasing, tokenization, stopword removal, and punctuation filtering

### `chatbot(user_question)`
**Input**: User's question string  
**Output**: Tuple (answer, confidence_score)  
**Function**: Main chatbot logic that processes the question, finds the best match, and returns the answer with confidence percentage

### Key Variables

| Variable | Type | Description |
|----------|------|-------------|
| `faq` | DataFrame | Loaded FAQ database from CSV |
| `faq_vectors` | Sparse Matrix | TF-IDF vectors of all FAQ questions |
| `vectorizer` | TfidfVectorizer | Fitted vectorizer for text transformation |
| `similarity` | Array | Cosine similarity scores |
| `best_match` | Integer | Index of the best matching FAQ |
| `score` | Float | Similarity score (0.0 to 1.0) |
| `confidence` | Float | Percentage confidence (0 to 100) |

## ⚙️ Configuration

### Adjusting Similarity Threshold

In `app.py` at line 140:

```python
if score > 0.40:  # Modify this threshold
```

**Threshold Guidelines**:
- `0.30`: More lenient, may return less accurate answers
- `0.40`: Balanced (default)
- `0.50`: Stricter, fewer but more accurate matches
- `0.60+`: Very strict, many questions will be logged as unknown

### Adding New FAQs

Edit `faq.csv`:

```csv
Question,Answer
What is machine learning?,Machine learning is a subset of AI that enables systems to learn from data.
```

**Note**: Restart the application after updating the CSV file.

### Customizing Suggested Questions

In `app.py` at lines 46-52:

```python
suggestions = [
    "What is AI?",
    "What is frontend?",
    "Does CodeAlpha offer internships?",
    "What is Machine Learning?",
    "What is backend?"
]
```

## 📊 Performance Metrics

### Similarity Score Interpretation

| Score Range | Interpretation | Action |
|-------------|----------------|--------|
| 0.80 - 1.00 | Excellent match | High confidence answer |
| 0.60 - 0.79 | Good match | Reliable answer |
| 0.40 - 0.59 | Moderate match | Answer provided with caution |
| 0.00 - 0.39 | Poor match | Question logged as unknown |

### Current Database

- **Total FAQs**: 42 question-answer pairs
- **Categories**: AI, Web Development, Programming, Internships
- **Average Question Length**: ~8 words
- **Average Answer Length**: ~15 words

## 🎨 Screenshots

### Main Chat Interface
The chatbot displays a clean interface with:
- Chat input at the bottom
- Conversation history in the center
- Sidebar with features and suggested questions

### Confidence Scoring
Each response includes:
- The answer text
- Match score percentage (e.g., "📊 Match Score: 87.5%")

## 🔮 Future Enhancements

- [ ] Implement deep learning models (BERT, GPT) for better understanding
- [ ] Add multi-language support
- [ ] Create admin panel for FAQ management
- [ ] Export chat history to PDF/CSV
- [ ] Add voice input/output
- [ ] Implement user feedback (thumbs up/down)
- [ ] Analytics dashboard for query trends
- [ ] Context-aware conversations (remember previous questions)
- [ ] Integration with external knowledge bases
- [ ] API endpoint for programmatic access

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest new features
- Submit pull requests
- Improve documentation

## 📄 License

This project is open source and available for educational purposes.

## 👨‍💻 Author

**Habibrehman1996**

---

**Built with Python, Streamlit, and Machine Learning** 🚀
