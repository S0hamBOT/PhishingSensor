"""
Model manager for loading, caching, and running predictions
"""

import os
import pickle
import logging
from datetime import datetime
from typing import Dict, Any, List

import numpy as np
import pandas as pd
from sklearn.pipeline import Pipeline
from sklearn.ensemble import RandomForestClassifier
import lightgbm as lgb

from app.core.config import settings

class ModelManager:
    """Manages loading and prediction for multiple ML models"""
    
    def __init__(self):
        self.url_model = None
        self.text_model = None
        self.html_model = None
        self.ensemble_weights = [0.5, 0.3, 0.2]  # URL, text, HTML weights
        self.models_loaded = False
        self.last_updated = None
        
        # Load models on initialization
        self.load_models()
    
    def load_models(self):
        """Load all ML models from disk"""
        try:
            # Load URL model if it exists
            if os.path.exists(settings.URL_MODEL_PATH):
                with open(settings.URL_MODEL_PATH, 'rb') as f:
                    self.url_model = pickle.load(f)
            else:
                # Create a placeholder model
                self.url_model = self._create_placeholder_model('url')
            
            # Load text model if it exists
            if os.path.exists(settings.TEXT_MODEL_PATH):
                with open(settings.TEXT_MODEL_PATH, 'rb') as f:
                    self.text_model = pickle.load(f)
            else:
                # Create a placeholder model
                self.text_model = self._create_placeholder_model('text')
            
            # Load HTML model if it exists
            if os.path.exists(settings.HTML_MODEL_PATH):
                with open(settings.HTML_MODEL_PATH, 'rb') as f:
                    self.html_model = pickle.load(f)
            else:
                # Create a placeholder model
                self.html_model = self._create_placeholder_model('html')
            
            self.models_loaded = True
            self.last_updated = datetime.now()
            logging.info("Models loaded successfully")
            
        except Exception as e:
            logging.error(f"Error loading models: {str(e)}")
            # Create placeholder models
            self.url_model = self._create_placeholder_model('url')
            self.text_model = self._create_placeholder_model('text')
            self.html_model = self._create_placeholder_model('html')
    
    def _create_placeholder_model(self, model_type):
        """Create a simple placeholder model for when real models aren't available"""
        if model_type == 'url':
            return Pipeline([
                ('classifier', RandomForestClassifier(n_estimators=10, random_state=42))
            ])
        elif model_type == 'text':
            return Pipeline([
                ('classifier', RandomForestClassifier(n_estimators=10, random_state=42))
            ])
        else:  # html
            return lgb.LGBMClassifier(n_estimators=10, random_state=42)
    
    def predict(self, features: Dict[str, Any]) -> float:
        """
        Make a prediction using all available models
        
        Args:
            features: Dict containing url_features, text_features, and html_features
            
        Returns:
            float: Probability of the URL being a phishing site (0-1)
        """
        try:
            # Extract features
            url_features = features.get('url_features', {})
            text_features = features.get('text_features', {})
            html_features = features.get('html_features', {})
            
            # Make individual predictions
            url_score = self._predict_url(url_features)
            text_score = self._predict_text(text_features)
            html_score = self._predict_html(html_features)
            
            # Combine predictions using weighted average
            combined_score = (
                self.ensemble_weights[0] * url_score +
                self.ensemble_weights[1] * text_score +
                self.ensemble_weights[2] * html_score
            )
            
            return combined_score
            
        except Exception as e:
            logging.error(f"Prediction error: {str(e)}")
            # Return a middle score when there's an error
            return 0.5
    
    def _predict_url(self, url_features: Dict[str, Any]) -> float:
        """Make prediction using URL features"""
        # In a real implementation, this would convert the features to the right format
        # For this example, we'll use a simplified approach
        try:
            # Convert dictionary to DataFrame
            features_df = pd.DataFrame([url_features])
            
            # For a real model, we would do proper preprocessing
            # Here we'll just return a simple score
            if 'has_suspicious_tld' in url_features and url_features['has_suspicious_tld'] == 1:
                return 0.8
            elif 'has_ip_address' in url_features and url_features['has_ip_address'] == 1:
                return 0.9
            elif 'has_suspicious_keywords' in url_features and url_features['has_suspicious_keywords'] == 1:
                return 0.7
            else:
                return 0.2
                
        except Exception as e:
            logging.error(f"URL prediction error: {str(e)}")
            return 0.5
    
    def _predict_text(self, text_features: Dict[str, Any]) -> float:
        """Make prediction using text features"""
        try:
            # Convert dictionary to DataFrame
            features_df = pd.DataFrame([text_features])
            
            # For a real model, we would do proper preprocessing
            # Here we'll just return a simple score
            if 'has_suspicious_phrases' in text_features and text_features['has_suspicious_phrases'] == 1:
                return 0.8
            elif 'urgency_keyword_count' in text_features and text_features['urgency_keyword_count'] > 2:
                return 0.7
            else:
                return 0.2
                
        except Exception as e:
            logging.error(f"Text prediction error: {str(e)}")
            return 0.5
    
    def _predict_html(self, html_features: Dict[str, Any]) -> float:
        """Make prediction using HTML features"""
        try:
            # Convert dictionary to DataFrame
            features_df = pd.DataFrame([html_features])
            
            # For a real model, we would do proper preprocessing
            # Here we'll just return a simple score
            if 'has_login_form' in html_features and html_features['has_login_form'] == 1:
                if 'has_favicon' in html_features and html_features['has_favicon'] == 0:
                    return 0.8
                return 0.6
            elif 'hidden_element_count' in html_features and html_features['hidden_element_count'] > 5:
                return 0.7
            else:
                return 0.2
                
        except Exception as e:
            logging.error(f"HTML prediction error: {str(e)}")
            return 0.5
    
    def get_model_info(self) -> Dict[str, Any]:
        """Get information about the loaded models"""
        return {
            "url_model": {
                "type": type(self.url_model).__name__,
                "loaded": self.url_model is not None
            },
            "text_model": {
                "type": type(self.text_model).__name__,
                "loaded": self.text_model is not None
            },
            "html_model": {
                "type": type(self.html_model).__name__,
                "loaded": self.html_model is not None
            },
            "ensemble_weights": self.ensemble_weights
        }