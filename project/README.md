# PhishSense: Phishing Detection Browser Extension

PhishSense is an advanced browser extension that detects phishing attempts in real-time using multi-modal machine learning analysis. It examines URLs, page content, and HTML structure to identify potential threats and provides explainable results to users.

## Features

- **Real-time phishing detection** using URL, text, and HTML structure analysis
- **Multi-modal machine learning** approach for comprehensive threat detection
- **Explainable AI** to help users understand why a site was flagged
- **User feedback mechanism** to improve detection accuracy over time
- **Local model fallback** when the backend API is unavailable
- **Privacy-focused** design with minimal data collection

## Extension Structure

```
phishsense/
├── public/                    # Public assets and extension files
│   ├── icons/                 # Extension icons
│   ├── background.js          # Background script
│   ├── content.js             # Content script
│   ├── content.css            # Content styles
│   └── manifest.json          # Extension manifest
├── src/                       # React source code
│   ├── components/            # UI components
│   ├── types/                 # TypeScript type definitions
│   ├── utils/                 # Utility functions
│   ├── App.tsx                # Main React component
│   └── main.tsx               # Entry point
└── README.md                  # Documentation
```

## Local Development

1. Clone the repository
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`
4. Build the extension: `npm run build`

## Loading the Extension in Chrome

1. Build the extension: `npm run build`
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right
4. Click "Load unpacked" and select the `dist` directory

## API Backend

The extension is designed to work with a FastAPI backend for model hosting, but also includes a local model fallback:

- `backend/app/` - FastAPI application with model serving endpoints
- `ml/` - Machine learning models and training scripts

For complete protection, the backend API should be deployed, but the extension can function without it using the simplified local model.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT