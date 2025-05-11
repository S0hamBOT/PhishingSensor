import { PhishingStatus, PhishingFeatures } from '../types/phishing';

// This is a simplified model for demonstration
// In a real extension, this would use a pre-trained model loaded from a file
// or use TensorFlow.js for more sophisticated predictions
export async function predictWithLocalModel(
  url: string, 
  features: PhishingFeatures
): Promise<PhishingStatus> {
  // Simplified scoring logic based on known phishing indicators
  // In a real implementation, this would use a proper ML model
  
  let score = 0;
  const { url_features, html_features, text_features } = features;
  
  // URL features contribute to the score
  if (url_features.has_suspicious_tld) score += 0.2;
  if (url_features.has_ip_address) score += 0.3;
  if (url_features.has_at_symbol) score += 0.1;
  if (url_features.has_double_slash_redirect) score += 0.1;
  if (url_features.has_suspicious_keywords) score += 0.1;
  if (url_features.special_char_count > 5) score += 0.1;
  if (url_features.domain_length > 30) score += 0.1;
  
  // HTML features contribute to the score
  if (html_features.password_input_count > 0) score += 0.1;
  if (html_features.has_login_form) score += 0.1;
  if (html_features.iframe_count > 2) score += 0.1;
  if (html_features.hidden_element_count > 5) score += 0.2;
  if (!html_features.has_favicon) score += 0.05;
  
  // Text features contribute to the score
  if (text_features.security_keyword_count > 2) score += 0.1;
  if (text_features.urgency_keyword_count > 2) score += 0.15;
  if (text_features.financial_keyword_count > 2) score += 0.15;
  if (text_features.has_suspicious_phrases) score += 0.2;
  
  // Normalize score to be between 0 and 1
  score = Math.min(1, score);
  
  // Determine risk level based on score
  let risk: PhishingStatus['risk'];
  let explanation = [];
  
  if (score < 0.3) {
    risk = 'safe';
    explanation = generateExplanation(features, score, risk);
  } else if (score < 0.6) {
    risk = 'suspicious';
    explanation = generateExplanation(features, score, risk);
  } else {
    risk = 'dangerous';
    explanation = generateExplanation(features, score, risk);
  }
  
  return {
    score,
    risk,
    explanation,
    url,
    timestamp: new Date()
  };
}

// Generate human-readable explanations for the prediction
function generateExplanation(
  features: PhishingFeatures, 
  score: number, 
  risk: PhishingStatus['risk']
) {
  const explanations = [];
  const { url_features, html_features, text_features } = features;
  
  // URL-based explanations
  if (url_features.has_suspicious_tld) {
    explanations.push({
      factor: 'Suspicious Domain',
      impact: 'high',
      description: 'The website uses a suspicious top-level domain often associated with free domains used in phishing.'
    });
  }
  
  if (url_features.has_ip_address) {
    explanations.push({
      factor: 'IP Address URL',
      impact: 'high',
      description: 'The URL contains an IP address instead of a domain name, which is rarely used for legitimate websites.'
    });
  }
  
  if (url_features.has_suspicious_keywords) {
    explanations.push({
      factor: 'Suspicious Keywords',
      impact: 'medium',
      description: 'The URL contains words often used in phishing attempts, like "login", "verify", or "secure".'
    });
  }
  
  // HTML-based explanations
  if (html_features.has_login_form) {
    explanations.push({
      factor: 'Login Form Detected',
      impact: risk === 'safe' ? 'low' : 'medium',
      description: 'The page contains a login form asking for credentials.'
    });
  }
  
  if (html_features.iframe_count > 2) {
    explanations.push({
      factor: 'Multiple iFrames',
      impact: 'medium',
      description: 'The page uses multiple embedded frames, which can be used to load content from other sources.'
    });
  }
  
  if (html_features.hidden_element_count > 5) {
    explanations.push({
      factor: 'Hidden Elements',
      impact: 'high',
      description: 'The page contains multiple hidden elements, which may be attempting to hide malicious content.'
    });
  }
  
  // Text-based explanations
  if (text_features.urgency_keyword_count > 2) {
    explanations.push({
      factor: 'Urgent Language',
      impact: 'medium',
      description: 'The page uses urgent language to pressure users into taking immediate action.'
    });
  }
  
  if (text_features.has_suspicious_phrases) {
    explanations.push({
      factor: 'Suspicious Phrases',
      impact: 'high',
      description: 'The page contains phrases commonly used in phishing attempts, like "verify your account" or "security alert".'
    });
  }
  
  // Add positive factors for safe sites
  if (risk === 'safe') {
    if (!url_features.has_suspicious_tld && !url_features.has_ip_address) {
      explanations.push({
        factor: 'Legitimate Domain',
        impact: 'low',
        description: 'The website uses a standard domain name without suspicious characteristics.'
      });
    }
    
    if (url_features.has_https) {
      explanations.push({
        factor: 'Secure Connection',
        impact: 'low',
        description: 'The site uses HTTPS, which provides a secure connection.'
      });
    }
  }
  
  // Limit explanations to most relevant
  return explanations.slice(0, 4);
}