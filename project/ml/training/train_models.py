"""
Script to train all phishing detection models
"""

import os
import logging
import argparse
import pickle
from datetime import datetime

# Set up logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

# Import local modules
import sys
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(__file__))))

from ml.data.dataset import (
    load_url_features_dataset,
    load_text_features_dataset,
    load_html_features_dataset
)

from ml.models.url_model import train_url_model, optimize_url_model
from ml.models.text_model import train_text_model, optimize_text_model
from ml.models.html_model import train_html_model, optimize_html_model
from ml.evaluation.evaluate_models import evaluate_model

def train_all_models(output_dir, optimize=False):
    """
    Train all phishing detection models
    
    Args:
        output_dir: Directory to save trained models
        optimize: Whether to optimize hyperparameters
    """
    # Create output directory if it doesn't exist
    os.makedirs(output_dir, exist_ok=True)
    
    # Train URL model
    logging.info("Training URL model...")
    X_train, X_test, y_train, y_test = load_url_features_dataset()
    
    if optimize:
        logging.info("Optimizing URL model...")
        best_params = optimize_url_model(X_train, y_train)
    else:
        best_params = None
    
    url_model = train_url_model(X_train, y_train, 
                               model_path=os.path.join(output_dir, 'url_model.pkl'),
                               params=best_params)
    
    url_metrics = evaluate_model(url_model, X_test, y_test)
    logging.info(f"URL model performance: {url_metrics}")
    
    # Train text model
    logging.info("Training text model...")
    X_train, X_test, y_train, y_test = load_text_features_dataset()
    
    if optimize:
        logging.info("Optimizing text model...")
        best_params = optimize_text_model(X_train, y_train)
    else:
        best_params = None
    
    text_model = train_text_model(X_train, y_train,
                                 model_path=os.path.join(output_dir, 'text_model.pkl'),
                                 params=best_params)
    
    text_metrics = evaluate_model(text_model, X_test, y_test)
    logging.info(f"Text model performance: {text_metrics}")
    
    # Train HTML model
    logging.info("Training HTML model...")
    X_train, X_test, y_train, y_test = load_html_features_dataset()
    
    if optimize:
        logging.info("Optimizing HTML model...")
        best_params = optimize_html_model(X_train, y_train)
    else:
        best_params = None
    
    html_model = train_html_model(X_train, y_train,
                                 model_path=os.path.join(output_dir, 'html_model.pkl'),
                                 params=best_params)
    
    html_metrics = evaluate_model(html_model, X_test, y_test)
    logging.info(f"HTML model performance: {html_metrics}")
    
    # Save metadata about training
    metadata = {
        'training_date': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
        'url_model': {
            'params': best_params or 'default',
            'metrics': url_metrics
        },
        'text_model': {
            'params': best_params or 'default',
            'metrics': text_metrics
        },
        'html_model': {
            'params': best_params or 'default',
            'metrics': html_metrics
        }
    }
    
    with open(os.path.join(output_dir, 'training_metadata.json'), 'w') as f:
        import json
        json.dump(metadata, f, indent=4)
    
    logging.info(f"All models trained and saved to {output_dir}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Train phishing detection models')
    parser.add_argument('--output-dir', type=str, default='../../models',
                        help='Directory to save trained models')
    parser.add_argument('--optimize', action='store_true',
                        help='Optimize hyperparameters')
    
    args = parser.parse_args()
    
    train_all_models(args.output_dir, args.optimize)