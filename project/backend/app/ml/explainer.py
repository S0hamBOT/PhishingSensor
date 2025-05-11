"""
Explanation generator for phishing detection results
"""

import os
import pickle
import logging
from typing import Dict, List, Any

import numpy as np
import pandas as pd
import shap

from app.core.config import settings
from app.types.schemas import ExplanationFactor

def generate_explanation(features: Dict[str, Any], prediction: float) -> List[Dict[str, str]]:
    """
    Generate human-readable explanations for the prediction
    
    Args:
        features: Dict containing url_features, text_features, and html_features
        prediction: The model's prediction score
        
    Returns:
        List of explanations with factor, impact, and description
    """
    explanations = []
    
    # Extract features
    url_features = features.get('url_features', {})
    text_features = features.get('text_features', {})
    html_features = features.get('html_features', {})
    
    # Determine risk level
    if prediction > 0.7:
        risk = "dangerous"
    elif prediction > 0.3:
        risk = "suspicious"
    else:
        risk = "safe"
    
    # URL-based explanations
    if url_features.get('has_suspicious_tld', 0) == 1:
        explanations.append({
            "factor": "Suspicious Domain",
            "impact": "high",
            "description": "The website uses a suspicious top-level domain often associated with free domains used in phishing."
        })
    
    if url_features.get('has_ip_address', 0) == 1:
        explanations.append({
            "factor": "IP Address URL",
            "impact": "high",
            "description": "The URL contains an IP address instead of a domain name, which is rarely used for legitimate websites."
        })
    
    if url_features.get('has_suspicious_keywords', 0) == 1:
        explanations.append({
            "factor": "Suspicious Keywords",
            "impact": "medium",
            "description": "The URL contains words often used in phishing attempts, like 'login', 'verify', or 'secure'."
        })
    
    # HTML-based explanations
    if html_features.get('has_login_form', 0) == 1:
        if risk == "safe":
            impact = "low"
        else:
            impact = "medium"
        explanations.append({
            "factor": "Login Form Detected",
            "impact": impact,
            "description": "The page contains a login form asking for credentials."
        })
    
    if html_features.get('iframe_count', 0) > 2:
        explanations.append({
            "factor": "Multiple iFrames",
            "impact": "medium",
            "description": "The page uses multiple embedded frames, which can be used to load content from other sources."
        })
    
    if html_features.get('hidden_element_count', 0) > 5:
        explanations.append({
            "factor": "Hidden Elements",
            "impact": "high",
            "description": "The page contains multiple hidden elements, which may be attempting to hide malicious content."
        })
    
    # Text-based explanations
    if text_features.get('urgency_keyword_count', 0) > 2:
        explanations.append({
            "factor": "Urgent Language",
            "impact": "medium",
            "description": "The page uses urgent language to pressure users into taking immediate action."
        })
    
    if text_features.get('has_suspicious_phrases', 0) == 1:
        explanations.append({
            "factor": "Suspicious Phrases",
            "impact": "high",
            "description": "The page contains phrases commonly used in phishing attempts, like 'verify your account' or 'security alert'."
        })
    
    # Add positive factors for safe sites
    if risk == "safe":
        if not url_features.get('has_suspicious_tld', 0) and not url_features.get('has_ip_address', 0):
            explanations.append({
                "factor": "Legitimate Domain",
                "impact": "low",
                "description": "The website uses a standard domain name without suspicious characteristics."
            })
        
        if url_features.get('has_https', 0) == 1:
            explanations.append({
                "factor": "Secure Connection",
                "impact": "low",
                "description": "The site uses HTTPS, which provides a secure connection."
            })
    
    # Only return the top N most relevant explanations
    return explanations[:4]

def generate_explanation_with_shap(features, model, prediction):
    """
    Generate model explanations using SHAP values
    
    This is a more advanced implementation that would use SHAP
    to provide model-specific explanations.
    
    Note: This is a placeholder for how you would implement SHAP explanations
    in a production system.
    """
    try:
        # Load SHAP explainer
        explainer_path = settings.EXPLAINER_PATH
        if os.path.exists(explainer_path):
            with open(explainer_path, 'rb') as f:
                explainer = pickle.load(f)
                
            # Prepare features for SHAP
            features_df = pd.DataFrame([features])
            
            # Get SHAP values
            shap_values = explainer.shap_values(features_df)
            
            # Convert SHAP values to explanations
            explanations = []
            feature_names = features_df.columns
            
            # Get top features by SHAP value magnitude
            feature_importance = np.abs(shap_values[0])
            top_indices = np.argsort(feature_importance)[-5:]  # Top 5 features
            
            for i in top_indices:
                feature_name = feature_names[i]
                shap_value = shap_values[0][i]
                
                # Determine impact
                abs_value = abs(shap_value)
                if abs_value > 0.3:
                    impact = "high"
                elif abs_value > 0.1:
                    impact = "medium"
                else:
                    impact = "low"
                
                # Create description
                if shap_value > 0:
                    description = f"The feature '{feature_name}' increases the likelihood of this being a phishing site."
                else:
                    description = f"The feature '{feature_name}' suggests this is more likely a legitimate site."
                
                explanations.append({
                    "factor": feature_name.replace("_", " ").title(),
                    "impact": impact,
                    "description": description
                })
                
            return explanations
            
    except Exception as e:
        logging.error(f"Error generating SHAP explanation: {str(e)}")
        
    # Fallback to rule-based explanation if SHAP fails
    return generate_explanation(features, prediction)