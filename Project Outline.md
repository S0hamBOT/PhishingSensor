/home/project
│
├── backend/                           # Backend API and ML engine (FastAPI)
│   ├── app/
│   │   ├── core/
│   │   │   └── config.py              # App config (CORS, model paths, timeouts)
│   │   ├── ml/
│   │   │   ├── explainer.py           # Explain model predictions in plain language
│   │   │   └── model_manager.py       # Load & manage ML models (URL, text, HTML)
│   │   ├── types/
│   │   │   └── schemas.py             # API request/response validation models
│   │   ├── utils/
│   │   │   ├── feature_extraction.py  # Extract features from URLs, text, HTML
│   │   │   └── feedback_collector.py  # Store/process user feedback
│   │   └── main.py                    # FastAPI entry point with routing
│   └── requirements.txt               # Python dependencies
│
├── ml/                                # Model training, evaluation, datasets
│   ├── data/
│   │   └── dataset.py                 # Dataset loading/generation
│   ├── evaluation/
│   │   └── evaluate_models.py         # Model evaluation metrics
│   ├── models/
│   │   ├── html_model.py              # LightGBM for HTML analysis
│   │   ├── text_model.py              # Text classifier (e.g., RandomForest)
│   │   └── url_model.py               # URL-based model
│   └── training/
│       └── train_models.py            # Unified training script for all models
│
├── public/                            # Chrome extension scripts/assets
│   ├── icons/                         # Logos and icons
│   ├── background.js                  # Background event listener
│   ├── content.js                     # Injected analysis logic
│   ├── content.css                    # UI styling for warnings, banners
│   └── manifest.json                  # Extension manifest (permissions, scripts)
│
├── src/                               # React frontend for extension UI
│   ├── components/
│   │   ├── ExplanationPanel.tsx       # Shows model reasoning to users
│   │   ├── FeedbackForm.tsx           # UI for user feedback
│   │   ├── Header.tsx                 # Top header/logo
│   │   ├── HistoryPanel.tsx           # Detection history log
│   │   ├── NavigationBar.tsx          # Navigation interface
│   │   ├── SettingsPanel.tsx          # Manage user settings
│   │   ├── SiteDetails.tsx            # Show info on current site
│   │   └── StatusDisplay.tsx          # Real-time detection status
│   ├── types/
│   │   └── phishing.ts                # TypeScript interfaces/types
│   ├── utils/
│   │   ├── featureExtraction.ts       # Local feature extraction
│   │   ├── feedbackUtils.ts           # Feedback sending logic
│   │   ├── localModel.ts              # Lightweight in-browser ML logic
│   │   ├── siteUtils.ts               # Site info processing
│   │   └── storageUtils.ts            # Local storage management
│   └── App.tsx                        # Root UI component
│
├── eslint.config.js                   # Code style rules
├── package.json                       # NPM dependencies
├── tailwind.config.js                 # Tailwind styling config
├── tsconfig.json                      # TypeScript compiler config
└── vite.config.ts                     # Vite bundler settings
