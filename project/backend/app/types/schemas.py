"""
Pydantic schemas for API requests and responses
"""

from datetime import datetime
from typing import Dict, List, Optional, Any
from pydantic import BaseModel

class ExplanationFactor(BaseModel):
    factor: str
    impact: str  # 'low', 'medium', 'high'
    description: str

class PhishingFeatures(BaseModel):
    url_features: Dict[str, Any]
    text_features: Dict[str, Any]
    html_features: Dict[str, Any]

class AnalysisRequest(BaseModel):
    url: str
    features: Optional[PhishingFeatures] = None

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

class ModelInfo(BaseModel):
    type: str
    loaded: bool

class ModelsInfoResponse(BaseModel):
    url_model: ModelInfo
    text_model: ModelInfo
    html_model: ModelInfo
    ensemble_weights: List[float]
    last_updated: datetime