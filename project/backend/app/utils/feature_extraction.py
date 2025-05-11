"""
Feature extraction utilities for URL, HTML, and text content
"""

import re
import logging
from typing import Dict, Any
from urllib.parse import urlparse

import requests
from bs4 import BeautifulSoup

from app.core.config import settings

async def extract_features_from_url(url: str) -> Dict[str, Any]:
    """
    Extract all features from a URL including URL, HTML, and text features
    
    Args:
        url: The URL to extract features from
        
    Returns:
        Dict containing url_features, html_features, and text_features
    """
    try:
        # Extract URL features
        url_features = extract_url_features(url)
        
        # Try to fetch the page content
        try:
            html_content, text_content = fetch_page_content(url)
            html_features = extract_html_features(html_content)
            text_features = extract_text_features(text_content)
        except Exception as e:
            logging.error(f"Error fetching page content: {str(e)}")
            html_features = {}
            text_features = {}
        
        return {
            "url_features": url_features,
            "html_features": html_features,
            "text_features": text_features
        }
        
    except Exception as e:
        logging.error(f"Feature extraction error: {str(e)}")
        # Return basic URL features if other extraction fails
        return {
            "url_features": extract_url_features(url),
            "html_features": {},
            "text_features": {}
        }

def extract_url_features(url: str) -> Dict[str, Any]:
    """Extract features from a URL"""
    try:
        parsed_url = urlparse(url)
        domain = parsed_url.netloc
        path = parsed_url.path
        
        # Basic URL features
        features = {
            "domain_length": len(domain),
            "path_length": len(path),
            "subdomain_count": domain.count('.'),
            "has_https": 1 if parsed_url.scheme == 'https' else 0,
            "path_depth": len([p for p in path.split('/') if p]),
            "has_suspicious_tld": 1 if domain.split('.')[-1] in ['xyz', 'tk', 'ml', 'ga', 'cf', 'gq'] else 0,
            "has_ip_address": 1 if re.search(r'\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}', domain) else 0,
            "has_at_symbol": 1 if '@' in url else 0,
            "has_double_slash_redirect": 1 if url.count('//') > 1 else 0,
            "special_char_count": len(re.findall(r'[^a-zA-Z0-9./:?&=-]', url)),
            "digit_count": len(re.findall(r'\d', url)),
            "has_suspicious_keywords": 1 if any(kw in url.lower() for kw in [
                'login', 'signin', 'verify', 'secure', 'account', 'update', 'confirm'
            ]) else 0
        }
        
        return features
        
    except Exception as e:
        logging.error(f"URL feature extraction error: {str(e)}")
        return {"error": 1}

def fetch_page_content(url: str) -> tuple:
    """Fetch HTML and text content from a URL"""
    headers = {
        'User-Agent': settings.USER_AGENT
    }
    
    response = requests.get(url, headers=headers, timeout=settings.REQUEST_TIMEOUT)
    response.raise_for_status()
    
    html_content = response.text
    soup = BeautifulSoup(html_content, 'html.parser')
    
    # Get visible text
    for script in soup(["script", "style"]):
        script.extract()
    
    text_content = soup.get_text(separator=' ', strip=True)
    
    return html_content, text_content

def extract_html_features(html: str) -> Dict[str, Any]:
    """Extract features from HTML content"""
    try:
        soup = BeautifulSoup(html, 'html.parser')
        
        # Count form elements with password or sensitive fields
        forms = soup.find_all('form')
        password_inputs = soup.find_all('input', {'type': 'password'})
        external_links = []
        
        for a in soup.find_all('a', href=True):
            href = a['href']
            if href.startswith('http') and not href.startswith(soup.title.string if soup.title else ''):
                external_links.append(href)
        
        # Extract features
        features = {
            "form_count": len(forms),
            "password_input_count": len(password_inputs),
            "external_link_count": len(external_links),
            "iframe_count": len(soup.find_all('iframe')),
            "script_count": len(soup.find_all('script')),
            "hidden_element_count": len(soup.find_all(style=re.compile(r'display:\s*none'))),
            "image_count": len(soup.find_all('img')),
            "has_favicon": 1 if soup.find('link', rel=re.compile(r'icon')) else 0,
            "has_password_field": 1 if password_inputs else 0,
            "has_login_form": 1 if any("login" in str(form).lower() or "password" in str(form).lower() for form in forms) else 0,
        }
        
        return features
        
    except Exception as e:
        logging.error(f"HTML feature extraction error: {str(e)}")
        return {"error": 1}

def extract_text_features(text: str) -> Dict[str, Any]:
    """Extract features from text content"""
    try:
        text = text.lower()
        words = text.split()
        
        # Detect common phishing keywords and phrases
        security_keywords = ['verify', 'confirm', 'update', 'login', 'sign in', 'validate', 'secure']
        urgency_keywords = ['urgent', 'immediately', 'alert', 'attention', 'important', 'action required']
        financial_keywords = ['account', 'credit card', 'bank', 'paypal', 'transaction', 'suspended', 'limited']
        
        suspicious_phrases = [
            'verify your account', 
            'confirm your identity', 
            'account has been suspended', 
            'unusual activity', 
            'security alert'
        ]
        
        # Extract features
        features = {
            "security_keyword_count": sum(1 for kw in security_keywords if kw in text),
            "urgency_keyword_count": sum(1 for kw in urgency_keywords if kw in text),
            "financial_keyword_count": sum(1 for kw in financial_keywords if kw in text),
            "total_word_count": len(words),
            "avg_word_length": sum(len(word) for word in words) / max(1, len(words)),
            "special_char_ratio": len(re.findall(r'[^a-zA-Z0-9\s]', text)) / max(1, len(text)),
            "uppercase_ratio": len(re.findall(r'[A-Z]', text)) / max(1, len(text)),
            "has_suspicious_phrases": 1 if any(phrase in text for phrase in suspicious_phrases) else 0
        }
        
        return features
        
    except Exception as e:
        logging.error(f"Text feature extraction error: {str(e)}")
        return {"error": 1}