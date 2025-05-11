"""
Dataset loader for phishing detection models
"""

import os
import pandas as pd
import logging
from typing import Tuple, Dict, Any
from sklearn.model_selection import train_test_split

def load_url_features_dataset(data_path: str = None) -> Tuple[pd.DataFrame, pd.DataFrame, pd.Series, pd.Series]:
    """
    Load URL features dataset
    
    Args:
        data_path: Path to the dataset file
        
    Returns:
        X_train, X_test, y_train, y_test
    """
    try:
        # For a real project, load from a real dataset file
        # For this demo, we'll create a synthetic dataset
        data = generate_synthetic_url_dataset()
        
        X = data.drop('is_phishing', axis=1)
        y = data['is_phishing']
        
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
        
        return X_train, X_test, y_train, y_test
        
    except Exception as e:
        logging.error(f"Error loading URL dataset: {str(e)}")
        raise

def load_text_features_dataset(data_path: str = None) -> Tuple[pd.DataFrame, pd.DataFrame, pd.Series, pd.Series]:
    """
    Load text features dataset
    
    Args:
        data_path: Path to the dataset file
        
    Returns:
        X_train, X_test, y_train, y_test
    """
    try:
        # For a real project, load from a real dataset file
        # For this demo, we'll create a synthetic dataset
        data = generate_synthetic_text_dataset()
        
        X = data.drop('is_phishing', axis=1)
        y = data['is_phishing']
        
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
        
        return X_train, X_test, y_train, y_test
        
    except Exception as e:
        logging.error(f"Error loading text dataset: {str(e)}")
        raise

def load_html_features_dataset(data_path: str = None) -> Tuple[pd.DataFrame, pd.DataFrame, pd.Series, pd.Series]:
    """
    Load HTML features dataset
    
    Args:
        data_path: Path to the dataset file
        
    Returns:
        X_train, X_test, y_train, y_test
    """
    try:
        # For a real project, load from a real dataset file
        # For this demo, we'll create a synthetic dataset
        data = generate_synthetic_html_dataset()
        
        X = data.drop('is_phishing', axis=1)
        y = data['is_phishing']
        
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
        
        return X_train, X_test, y_train, y_test
        
    except Exception as e:
        logging.error(f"Error loading HTML dataset: {str(e)}")
        raise

def generate_synthetic_url_dataset(size: int = 1000) -> pd.DataFrame:
    """Generate a synthetic URL features dataset"""
    import numpy as np
    
    # Generate random data
    np.random.seed(42)
    
    data = {
        'domain_length': np.random.randint(5, 50, size),
        'path_length': np.random.randint(0, 100, size),
        'subdomain_count': np.random.randint(0, 5, size),
        'has_https': np.random.choice([0, 1], size),
        'path_depth': np.random.randint(0, 10, size),
        'has_suspicious_tld': np.random.choice([0, 1], size, p=[0.9, 0.1]),
        'has_ip_address': np.random.choice([0, 1], size, p=[0.95, 0.05]),
        'has_at_symbol': np.random.choice([0, 1], size, p=[0.95, 0.05]),
        'has_double_slash_redirect': np.random.choice([0, 1], size, p=[0.95, 0.05]),
        'special_char_count': np.random.randint(0, 20, size),
        'digit_count': np.random.randint(0, 15, size),
        'has_suspicious_keywords': np.random.choice([0, 1], size, p=[0.8, 0.2]),
    }
    
    # Generate labels with bias towards features commonly associated with phishing
    is_phishing = []
    for i in range(size):
        score = 0
        if data['has_suspicious_tld'][i] == 1: score += 0.3
        if data['has_ip_address'][i] == 1: score += 0.3
        if data['has_at_symbol'][i] == 1: score += 0.2
        if data['has_double_slash_redirect'][i] == 1: score += 0.2
        if data['has_suspicious_keywords'][i] == 1: score += 0.1
        if data['special_char_count'][i] > 10: score += 0.1
        
        # Add some randomness
        score += np.random.uniform(-0.2, 0.2)
        is_phishing.append(1 if score > 0.3 else 0)
    
    data['is_phishing'] = is_phishing
    
    return pd.DataFrame(data)

def generate_synthetic_text_dataset(size: int = 1000) -> pd.DataFrame:
    """Generate a synthetic text features dataset"""
    import numpy as np
    
    # Generate random data
    np.random.seed(42)
    
    data = {
        'security_keyword_count': np.random.randint(0, 10, size),
        'urgency_keyword_count': np.random.randint(0, 10, size),
        'financial_keyword_count': np.random.randint(0, 10, size),
        'total_word_count': np.random.randint(50, 1000, size),
        'avg_word_length': np.random.uniform(3, 8, size),
        'special_char_ratio': np.random.uniform(0, 0.2, size),
        'uppercase_ratio': np.random.uniform(0, 0.3, size),
        'has_suspicious_phrases': np.random.choice([0, 1], size, p=[0.7, 0.3]),
    }
    
    # Generate labels with bias towards features commonly associated with phishing
    is_phishing = []
    for i in range(size):
        score = 0
        if data['security_keyword_count'][i] > 5: score += 0.2
        if data['urgency_keyword_count'][i] > 3: score += 0.3
        if data['financial_keyword_count'][i] > 3: score += 0.2
        if data['has_suspicious_phrases'][i] == 1: score += 0.3
        
        # Add some randomness
        score += np.random.uniform(-0.2, 0.2)
        is_phishing.append(1 if score > 0.3 else 0)
    
    data['is_phishing'] = is_phishing
    
    return pd.DataFrame(data)

def generate_synthetic_html_dataset(size: int = 1000) -> pd.DataFrame:
    """Generate a synthetic HTML features dataset"""
    import numpy as np
    
    # Generate random data
    np.random.seed(42)
    
    data = {
        'form_count': np.random.randint(0, 5, size),
        'password_input_count': np.random.randint(0, 3, size),
        'external_link_count': np.random.randint(0, 50, size),
        'iframe_count': np.random.randint(0, 5, size),
        'script_count': np.random.randint(0, 20, size),
        'hidden_element_count': np.random.randint(0, 15, size),
        'image_count': np.random.randint(0, 30, size),
        'has_favicon': np.random.choice([0, 1], size),
        'has_password_field': np.random.choice([0, 1], size),
        'has_login_form': np.random.choice([0, 1], size),
    }
    
    # Generate labels with bias towards features commonly associated with phishing
    is_phishing = []
    for i in range(size):
        score = 0
        if data['has_password_field'][i] == 1: score += 0.1
        if data['has_login_form'][i] == 1: score += 0.1
        if data['iframe_count'][i] > 2: score += 0.2
        if data['hidden_element_count'][i] > 5: score += 0.3
        if data['has_favicon'][i] == 0 and data['has_login_form'][i] == 1: score += 0.3
        
        # Add some randomness
        score += np.random.uniform(-0.2, 0.2)
        is_phishing.append(1 if score > 0.3 else 0)
    
    data['is_phishing'] = is_phishing
    
    return pd.DataFrame(data)