"""
PhishSense API
A FastAPI backend for phishing detection and model serving
"""

import os
from datetime import datetime
from typing import Dict, List, Optional, Any

from fastapi import FastAPI, HTTPException, Depends, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from app.core.config import settings
from app.ml.model_manager import ModelManager
from app.ml.explainer import generate_explanation
from app.utils.feature_extraction import extract_features_from_url
from app.utils.feedback_collector import process_feedback

# Initialize FastAPI app
app = FastAPI(
    title="PhishSense API",
    description="API for detecting phishing websites using multi-modal ML analysis",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For production, specify exact origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize model manager
model_manager = ModelManager()

# Pydantic models for request/response
class AnalysisRequest(BaseModel):
    url: str
    features: Optional[Dict[str, Any]] = None

class ExplanationFactor(BaseModel):
    factor: str
    impact: str  # 'low', 'medium', 'high'
    description: str

class AnalysisResponse(BaseModel):
    url: str
    score: float
    risk: str  # 'safe', 'suspicious', 'dangerous', 'unknown', 'error'
    explanation: List[ExplanationFactor]
    timestamp: datetime

class FeedbackRequest(BaseModel):
    url: str
    user_classification: str
    system_classification: str
    reason: Optional[str] = None
    timestamp: datetime

class FeedbackResponse(BaseModel):
    status: str
    message: str

@app.get("/")
async def root():
    return {"message": "PhishSense API is running"}

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "ok",
        "version": settings.API_VERSION,
        "models_loaded": model_manager.models_loaded,
    }

@app.post("/analyze", response_model=AnalysisResponse)
async def analyze_url(request: AnalysisRequest):
    """Analyze a URL for phishing indicators"""
    try:
        # Extract features if not provided
        if not request.features:
            features = await extract_features_from_url(request.url)
        else:
            features = request.features
        
        # Run prediction
        prediction = model_manager.predict(features)
        
        # Generate explanation
        explanation = generate_explanation(features, prediction)
        
        # Determine risk level
        risk = "safe"
        if prediction > 0.7:
            risk = "dangerous"
        elif prediction > 0.3:
            risk = "suspicious"
        
        return {
            "url": request.url,
            "score": float(prediction),
            "risk": risk,
            "explanation": explanation,
            "timestamp": datetime.now()
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

@app.post("/feedback", response_model=FeedbackResponse)
async def submit_feedback(feedback: FeedbackRequest, background_tasks: BackgroundTasks):
    """Submit user feedback for improving the model"""
    try:
        # Process feedback asynchronously
        background_tasks.add_task(process_feedback, feedback)
        
        return {
            "status": "success",
            "message": "Feedback received and will be processed"
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to process feedback: {str(e)}")

@app.get("/models/info")
async def get_model_info():
    """Get information about the loaded models"""
    return {
        "models": model_manager.get_model_info(),
        "last_updated": model_manager.last_updated
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)