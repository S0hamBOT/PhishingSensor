"""
Text-based phishing detection model
"""

import pickle
import logging
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import GridSearchCV

def train_text_model(X_train, y_train, model_path=None, params=None):
    """
    Train a text-based phishing detection model
    
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
                'classifier__n_estimators': 100,
                'classifier__max_depth': 10,
                'classifier__min_samples_split': 2,
                'classifier__random_state': 42
            }
        
        # Create pipeline
        pipeline = Pipeline([
            ('scaler', StandardScaler()),
            ('classifier', RandomForestClassifier())
        ])
        
        # Train model
        pipeline.set_params(**params)
        pipeline.fit(X_train, y_train)
        
        # Save model if path provided
        if model_path:
            with open(model_path, 'wb') as f:
                pickle.dump(pipeline, f)
        
        return pipeline
        
    except Exception as e:
        logging.error(f"Error training text model: {str(e)}")
        raise

def optimize_text_model(X_train, y_train, X_val=None, y_val=None):
    """
    Optimize text model hyperparameters using grid search
    
    Args:
        X_train: Training features
        y_train: Training labels
        X_val: Validation features
        y_val: Validation labels
        
    Returns:
        Best parameters
    """
    try:
        # Create pipeline
        pipeline = Pipeline([
            ('scaler', StandardScaler()),
            ('classifier', RandomForestClassifier())
        ])
        
        # Define parameter grid
        param_grid = {
            'classifier__n_estimators': [50, 100, 200],
            'classifier__max_depth': [None, 10, 20, 30],
            'classifier__min_samples_split': [2, 5, 10],
            'classifier__random_state': [42]
        }
        
        # Run grid search
        grid_search = GridSearchCV(
            pipeline,
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
        logging.error(f"Error optimizing text model: {str(e)}")
        raise

def predict_with_text_model(model, features):
    """
    Make predictions using the text model
    
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
        logging.error(f"Error predicting with text model: {str(e)}")
        raise