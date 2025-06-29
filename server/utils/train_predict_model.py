import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import OneHotEncoder, MultiLabelBinarizer
from sklearn.ensemble import RandomForestClassifier
import pickle
import numpy as np
import os
import warnings
warnings.filterwarnings('ignore')

# === STEP 1: Load and Preprocess Dummy Data ===
df = pd.read_csv(r"D:\MiniProject\CampusConnectAi\server\seed\dummy_participants.csv")  # or give absolute path if needed
df["interests"] = df["interests"].apply(lambda x: [i.strip() for i in x.split(",")])
df["participated"] = [1 if i < 600 else 0 for i in range(len(df))]  # Simulate 60% participation

# Encode department
dept_encoder = OneHotEncoder(sparse_output=False)
dept_encoded = dept_encoder.fit_transform(df[["department"]])

# Encode interests
interest_encoder = MultiLabelBinarizer()
interest_encoded = interest_encoder.fit_transform(df["interests"])

# Combine features
X = np.hstack([dept_encoded, interest_encoded])
y = df["participated"]

# === STEP 2: Train Model ===
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# === STEP 3: Save Model and Encoders ===
os.makedirs("server/artifacts", exist_ok=True)
with open("server/artifacts/predict_model.pkl", "wb") as f:
    pickle.dump(model, f)
with open("server/artifacts/dept_encoder.pkl", "wb") as f:
    pickle.dump(dept_encoder, f)
with open("server/artifacts/interest_encoder.pkl", "wb") as f:
    pickle.dump(interest_encoder, f)

print(" Model and encoders saved to /server/artifacts/")

# === STEP 4: Simulate UI Input and Predict ===
ui_input = {
    "branches": ["CSE", "ISE", "AIML"],
    "interests": ["Tech", "Coding", "Fun"]
}

# Create input vectors for each branch with selected interests
X_pred = []
for dept in ui_input["branches"]:
    dept_vector = dept_encoder.transform([[dept]])[0]
    interest_vector = interest_encoder.transform([ui_input["interests"]])[0]
    X_pred.append(np.hstack([dept_vector, interest_vector]))

X_pred = np.array(X_pred)

# Predict participation
predictions = model.predict(X_pred)
likely_count = sum(predictions)

# Print simulated result
print("\n Simulated Prediction for UI Input:")
print("Branches:", ui_input["branches"])
print("Interests:", ui_input["interests"])
print(f" Estimated participants: {likely_count} out of {len(X_pred)}")
