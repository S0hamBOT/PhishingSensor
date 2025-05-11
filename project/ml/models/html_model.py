"""
HTML-based phishing detection model
"""

import pickle
import logging
import numpy as np
import lightgbm as lgb
from sklearn.model_selection import GridSearchCV

def train_html_model(X_train, y_train, model_path=None, params=None):
    """
    Train an HTML-based phishing detection model using LightGBM
    
    Args:
        X_train: Training features
        y_train: Training labels
        model_path: Path to save the model
        params: Hyperparameters for model training
        
    Returns:
        Trained model
    """
    try:
        # Default parameters if none provided
        if params is None:
            params = {
                'boosting_type': 'gbdt',
                'objective': 'binary',
                'metric': 'auc',
                'n_estimators': 100,
                'learning_rate': 0.1,
                'max_depth': 10,
                'random_state': 42
            }
        
        # Create model
        model = lgb.LGBMClassifier(**params)
        
        # Train model
        model.fit(X_train, y_train)
        
        # Save model if path provided
        if model_path:
            with open(model_path, 'wb') as f:
                pickle.dump(model, f)
        
        return model
        
    except Exception as e:
        logging.error(f"Error training HTML model: {str(e)}")
        raise

def optimize_html_model(X_train, y_train, X_val=None, y_val=None):
    """
    Optimize HTML model hyperparameters using grid search
    
    Args:
        X_train: Training features
        y_train: Training labels
        X_val: Validation features
        y_val: Validation labels
        
    Returns:
        Best parameters
    """
    try:
        # Create model
        model = lgb.LGBMClassifier(objective='binary')
        
        # Define parameter grid
        param_grid = {
            'boosting_type': ['gbdt', 'dart'],
            'n_estimators': [50, 100, 200],
            'learning_rate': [0.01, 0.1, 0.3],
            'max_depth': [5, 10, 20],
            'random_state': [42]
        }
        
        # Run grid search
        grid_search = GridSearchCV(
            model,
            param_grid,
            cv=5,
            scoring='roc_auc',
            n_jobs=-1
        )
        
        grid_search.fit(X_train, y_train)
        
        # Get best parameters
        best_params = grid_search.best_params_
        logging.info(f"Best parameters: {best_params}")
        
        return best_params
        
    except Exception as e:
        logging.error(f"Error optimizing HTML model: {str(e)}")
        raise

def predict_with_html_model(model, features):
    """
    Make predictions using the HTML model
    
    Args:
        model: Trained model
        features: Features to predict on
        
    Returns:
        Predicted probabilities
    """
    try:
        # Convert to numpy array if needed
        if isinstance(features, dict):
            # If the model expects a dict, just pass it through
            X = features
        else:
            # Otherwise convert to numpy array
            X = np.array(features).reshape(1, -1)
        
        # Get prediction probability
        proba = model.predict_proba(X)[0, 1]
        
        return proba
        
    except Exception as e:
        logging.error(f"Error predicting with HTML model: {str(e)}")
        raise