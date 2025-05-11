"""
Configuration settings for the PhishSense API
"""

import os
from typing import List, Optional
from pydantic import BaseSettings

class Settings(BaseSettings):
    # API settings
    API_VERSION: str = "1.0.0"
    PROJECT_NAME: str = "PhishSense API"
    
    # Model settings
    MODEL_DIR: str = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "models")
    URL_MODEL_PATH: str = os.path.join(MODEL_DIR, "url_model.pkl")
    TEXT_MODEL_PATH: str = os.path.join(MODEL_DIR, "text_model.pkl")
    HTML_MODEL_PATH: str = os.path.join(MODEL_DIR, "html_model.pkl")
    
    # Explainer settings
    EXPLAINER_PATH: str = os.path.join(MODEL_DIR, "explainer.pkl")
    
    # Feedback settings
    FEEDBACK_DIR: str = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "feedback")
    
    # Feature extraction settings
    USER_AGENT: str = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    REQUEST_TIMEOUT: int = 5  # seconds
    
    # Security settings
    CORS_ORIGINS: List[str] = ["*"]  # For production, specify exact origins
    
    # Environment settings
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    DEBUG: bool = ENVIRONMENT == "development"
    
    class Config:
        env_file = ".env"

# Create global settings object
settings = Settings()

# Make sure MODEL_DIR exists
os.makedirs(settings.MODEL_DIR, exist_ok=True)

# Make sure FEEDBACK_DIR exists
os.makedirs(settings.FEEDBACK_DIR, exist_ok=True)