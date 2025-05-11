
# PhishingSensor

Welcome to **PhishingSensor**, where your browser gets a sixth sense for spotting shady stuff on the internet.

It's a Chrome extension that politely (but firmly) tells you when you're about to step on a digital landmine—aka a phishing scam. Backed by AI, wrapped in a snazzy interface, and powered by a slightly over-caffeinated developer.

---

### What it does:
- Chrome extension scans the page you’re on
- Sends it to a FastAPI backend with an ML model
- Tells you if the site looks shady (or safe)
- Clean UI, confidence scores, and smart explanations

---

### What’s done:
- ✅ Extension works and looks great
- ✅ Backend detects phishing emails
- ✅ Model trained and saved

---


### How to try it:
1. Load the `public/` folder as an unpacked Chrome extension
2. Start the backend:

   ```bash
   uvicorn backend.app.main:app --reload
   ```
   
3. Visit a site and hit “Scan This Page”

Make sure your model (`email_model.joblib`) and vectorizer are in `backend/saved_models/`. If not, yell at your previous self for forgetting to run the training script.

---

## What's Next?

- Smarter phishing detection using page structure and URLs
- Feedback loop (because your opinion matters, kind of)
- Cloud deployment so your laptop doesn’t have to shoulder the entire internet
- Full React UI so this project can truly shine like it deserves to

---

Made with <3 and a spirit of inquiry

Over n Out.

