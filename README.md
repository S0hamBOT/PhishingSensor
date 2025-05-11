
# PhishingSensor

Welcome to **PhishingSensor**, where your browser gets a sixth sense for spotting shady stuff on the internet.

It's a Chrome extension that politely (but firmly) tells you when you're about to step on a digital landmine—aka a phishing scam. Backed by AI, wrapped in a snazzy interface, and powered by a slightly over-caffeinated developer.

---

## What Works (aka the brag section)

### The Extension? Oh, it's alive.
- Scans the site you're on, like a secret agent but less creepy
- Sends that info to a local FastAPI backend that acts like the brain
- Displays whether the page is **safe**, **suspicious**, or **"please close this tab right now"**
- Comes with a smooth, futuristic background, because if you're going to fight phishing, you might as well look good doing it
- Keeps a local memory of past scans—because it never forgets, like your mom reminding you about that one failed test in 8th grade

---

## What’s Still Under Construction (read: held together with duct tape and dreams)

- **Backend**: It responds, yes. But it only knows how to handle emails right now. It hasn’t gone to URL or HTML school yet.
- **Feedback system**: Exists in spirit. The code files are there, but no one's listening (yet).
- **Machine learning models**: Only one is fully trained. The rest are sitting in the codebase like interns waiting for a project.
- **React frontend**: We have a whole React setup... that's just sitting there looking pretty. It'll do something one day.

---

## How to Try It (because you obviously want to)

1. Clone the repo or unzip the files.
2. Go to `chrome://extensions` in Chrome.
3. Turn on Developer Mode (top right).
4. Click “Load unpacked” and select the `public/` folder.
5. Visit any site and hit “Scan This Page” in the popup.
6. Watch magic happen (or at least get some mildly satisfying results).

---

## How to Run the Backend (AKA the brain)

You’ll need Python and `uvicorn`. Then:

```
uvicorn backend.app.main:app --reload
```

Make sure your model (`email_model.joblib`) and vectorizer are in `backend/saved_models/`. If not, yell at your previous self for forgetting to run the training script.

---

## What's Next?

- Smarter phishing detection using page structure and URLs
- Feedback loop (because your opinion matters, kind of)
- Cloud deployment so your laptop doesn’t have to shoulder the entire internet
- Full React UI so this project can truly shine like it deserves to

---

## Who Made This?

This work of slightly paranoid genius is brought to you by **S0hamBOT**.

If it doesn’t work, blame the AI. If it does work, definitely tell recruiters.

