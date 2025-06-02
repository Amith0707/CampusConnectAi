# server/utils/sentiment.py

import sys
import json
import pandas as pd
import os
from nltk.sentiment import SentimentIntensityAnalyzer 
import nltk

nltk.download('vader_lexicon', quiet=True)

def analyze_sentiments(event_name, feedback_list):
    sia = SentimentIntensityAnalyzer()
    results = []
    sentiment_counts = {"positive": 0, "neutral": 0, "negative": 0}

    for feedback in feedback_list:
        scores = sia.polarity_scores(feedback)
        compound = scores['compound']

        if compound >= 0.05:
            sentiment = "positive"
        elif compound <= -0.05:
            sentiment = "negative"
        else:
            sentiment = "neutral"

        sentiment_counts[sentiment] += 1

        results.append({
            "feedback": feedback,
            "neg": scores['neg'],
            "neu": scores['neu'],
            "pos": scores['pos'],
            "compound": scores['compound'],
            "sentiment": sentiment
        })

    # Save to Excel
    df = pd.DataFrame(results)
    output_dir = os.path.join(os.path.dirname(__file__), '../feedback_files')
    os.makedirs(output_dir, exist_ok=True)

    file_path = os.path.join(output_dir, f"feedback_{event_name}.xlsx")
    df.to_excel(file_path, index=False)

    return sentiment_counts

if __name__ == "__main__":
    # Accept a single JSON string from Node.js
    data = json.loads(sys.argv[1])
    event_name = data["event_name"]
    feedback_list = data["feedback_list"]

    sentiment_counts = analyze_sentiments(event_name, feedback_list)

    print(json.dumps(sentiment_counts))  # Return stats to Node
