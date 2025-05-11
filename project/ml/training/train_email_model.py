# train_email_model.py

import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.metrics import classification_report
import joblib
import os

# === Load Dataset ===
df = pd.read_csv('phishing_mails.csv')
df.columns = df.columns.str.strip().str.lower().str.replace(" ", "_")
df = df.dropna(subset=['email_text', 'email_type'])

# Convert to binary labels: 1 = phishing, 0 = safe
df['label'] = df['email_type'].apply(lambda x: 1 if 'phishing' in x.lower() else 0)
df = df[['email_text', 'label']].dropna()
df = df[df['email_text'].str.strip() != ""].sample(frac=1, random_state=42)

# === Split Data ===
X_train, X_test, y_train, y_test = train_test_split(
    df['email_text'], df['label'], test_size=0.2, random_state=42
)

# === Vectorize Text ===
vectorizer = TfidfVectorizer()
X_train_vec = vectorizer.fit_transform(X_train)
X_test_vec = vectorizer.transform(X_test)

# === Train Model ===
model = MultinomialNB()
model.fit(X_train_vec, y_train)

# === Evaluate ===
y_pred = model.predict(X_test_vec)
print("Classification Report:\n", classification_report(y_test, y_pred))

# === Save Model + Vectorizer ===
os.makedirs("ml/saved_models", exist_ok=True)
joblib.dump(model, "ml/saved_models/email_model.joblib")
joblib.dump(vectorizer, "ml/saved_models/vectorizer.joblib")
print("✅ Model and vectorizer saved!")
