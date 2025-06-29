import os
import sys
import json
import pickle
import pandas as pd
import numpy as np
from sklearn.preprocessing import OneHotEncoder, MultiLabelBinarizer

# === Setup paths ===
base_dir = os.path.dirname(os.path.abspath(__file__))

model_dir = os.path.join(base_dir, "server", "artifacts")
csv_path = os.path.join(base_dir, "..", "seed", "dummy_participants.csv")  # one level up into /seed

# === Load Model and Encoders ===
with open(os.path.join(model_dir, "predict_model.pkl"), "rb") as f:
    model = pickle.load(f)
with open(os.path.join(model_dir, "dept_encoder.pkl"), "rb") as f:
    dept_encoder = pickle.load(f)
with open(os.path.join(model_dir, "interest_encoder.pkl"), "rb") as f:
    interest_encoder = pickle.load(f)

# === Load dummy data ===
df = pd.read_csv(csv_path)
df["interests"] = df["interests"].apply(lambda x: [i.strip() for i in x.split(",")])

# === Parse UI Input from Node.js ===
try:
    ui_input = json.loads(sys.argv[1])
except Exception as e:
    print(json.dumps({ "error": f"Invalid input: {str(e)}" }))
    sys.exit(1)

# === Prepare prediction data ===
branches = ui_input.get("branches", [])
interests = ui_input.get("interests", [])

# Filter participants matching selected branches and at least one interest
filtered_df = df[df["department"].isin(branches)].copy()

def has_matching_interest(user_interests, event_interests):
    return any(interest in event_interests for interest in user_interests)

filtered_df = filtered_df[filtered_df["interests"].apply(lambda x: has_matching_interest(x, interests))]

if filtered_df.empty:
    print(json.dumps({
        "estimatedParticipants": 0,
        "totalSimulated": 0
    }))
    sys.exit(0)

# Encode filtered participants
dept_encoded = dept_encoder.transform(filtered_df[["department"]])
interest_encoded = interest_encoder.transform(filtered_df["interests"])
X_pred = np.hstack([dept_encoded, interest_encoded])

# Predict participation
predictions = model.predict(X_pred)
likely_count = int(np.sum(predictions))
total_count = len(filtered_df)

# === Predict and Count ===
predictions = model.predict(X_pred)
likely_count = int(np.sum(predictions))
total_count = len(X_pred)

# === Output Result to Node ===
print(json.dumps({
    "estimatedParticipants": likely_count,
    "totalSimulated": total_count
}))
