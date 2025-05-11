import { PhishingFeatures } from '../types/phishing';

// Feature extraction from URLs
export function extractUrlFeatures(url: string): Record<string, number> {
  try {
    const urlObj = new URL(url);
    const domain = urlObj.hostname;
    const path = urlObj.pathname;
    
    // Basic URL features
    return {
      domain_length: domain.length,
      path_length: path.length,
      subdomain_count: domain.split('.').length - 1,
      has_https: urlObj.protocol === 'https:' ? 1 : 0,
      path_depth: path.split('/').filter(Boolean).length,
      has_suspicious_tld: ['xyz', 'tk', 'ml', 'ga', 'cf', 'gq'].includes(domain.split('.').pop() || '') ? 1 : 0,
      has_ip_address: /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/.test(domain) ? 1 : 0,
      has_at_symbol: url.includes('@') ? 1 : 0,
      has_double_slash_redirect: url.includes('//') && url.lastIndexOf('//') > url.indexOf('//') + 1 ? 1 : 0,
      special_char_count: (url.match(/[^a-zA-Z0-9./:?&=-]/g) || []).length,
      digit_count: (url.match(/\d/g) || []).length,
      has_suspicious_keywords: ['login', 'signin', 'verify', 'secure', 'account', 'update', 'confirm'].some(keyword => 
        url.toLowerCase().includes(keyword)
      ) ? 1 : 0
    };
  } catch (error) {
    console.error('Error extracting URL features:', error);
    return {
      error: 1
    };
  }
}

// Feature extraction from HTML content
export function extractHtmlFeatures(html: string): Record<string, number> {
  try {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    
    // Count form elements with password or sensitive fields
    const forms = doc.querySelectorAll('form');
    const passwordInputs = doc.querySelectorAll('input[type="password"]');
    const externalLinks = Array.from(doc.querySelectorAll('a[href]'))
      .filter(a => {
        try {
          const href = (a as HTMLAnchorElement).href;
          return href && new URL(href).host !== window.location.host;
        } catch (e) {
          return false;
        }
      });
      
    return {
      form_count: forms.length,
      password_input_count: passwordInputs.length,
      external_link_count: externalLinks.length,
      iframe_count: doc.querySelectorAll('iframe').length,
      script_count: doc.querySelectorAll('script').length,
      hidden_element_count: doc.querySelectorAll('[style*="display:none"], [style*="display: none"], [hidden]').length,
      image_count: doc.querySelectorAll('img').length,
      has_favicon: doc.querySelector('link[rel*="icon"]') ? 1 : 0,
      has_password_field: passwordInputs.length > 0 ? 1 : 0,
      has_login_form: Array.from(forms).some(form => 
        form.innerHTML.toLowerCase().includes('login') || 
        form.innerHTML.toLowerCase().includes('signin') ||
        form.innerHTML.toLowerCase().includes('username') ||
        form.innerHTML.toLowerCase().includes('password')
      ) ? 1 : 0,
    };
  } catch (error) {
    console.error('Error extracting HTML features:', error);
    return {
      error: 1
    };
  }
}

// Feature extraction from text content
export function extractTextFeatures(text: string): Record<string, number> {
  try {
    const lowerText = text.toLowerCase();
    const words = lowerText.split(/\s+/);
    
    // Detect common phishing keywords and phrases
    const securityKeywords = ['verify', 'confirm', 'update', 'login', 'sign in', 'validate', 'secure'];
    const urgencyKeywords = ['urgent', 'immediately', 'alert', 'attention', 'important', 'action required'];
    const financialKeywords = ['account', 'credit card', 'bank', 'paypal', 'transaction', 'suspended', 'limited'];
    
    return {
      security_keyword_count: securityKeywords.filter(keyword => lowerText.includes(keyword)).length,
      urgency_keyword_count: urgencyKeywords.filter(keyword => lowerText.includes(keyword)).length,
      financial_keyword_count: financialKeywords.filter(keyword => lowerText.includes(keyword)).length,
      total_word_count: words.length,
      avg_word_length: words.reduce((sum, word) => sum + word.length, 0) / words.length,
      special_char_ratio: (text.match(/[^a-zA-Z0-9\s]/g) || []).length / text.length,
      uppercase_ratio: (text.match(/[A-Z]/g) || []).length / text.length,
      has_suspicious_phrases: [
        'verify your account', 
        'confirm your identity', 
        'account has been suspended', 
        'unusual activity', 
        'security alert'
      ].some(phrase => lowerText.includes(phrase)) ? 1 : 0
    };
  } catch (error) {
    console.error('Error extracting text features:', error);
    return {
      error: 1
    };
  }
}

// Extract all features from a page
export async function extractFeatures(url: string): Promise<PhishingFeatures> {
  // In a real extension, we would extract features from the actual page
  // For this demo, we'll create mock features
  
  // This is how it would be implemented in a real extension:
  // const response = await fetch(url);
  // const html = await response.text();
  // const doc = new DOMParser().parseFromString(html, 'text/html');
  // const text = doc.body.textContent || '';
  
  // For the demo, we'll use mock data
  const urlFeatures = extractUrlFeatures(url);
  
  // These would come from the actual page in a real extension
  const mockHtml = `
    <html>
      <head>
        <title>Example Site</title>
        <link rel="icon" href="/favicon.ico">
      </head>
      <body>
        <form>
          <input type="text" placeholder="Username">
          <input type="password" placeholder="Password">
          <button type="submit">Login</button>
        </form>
        <div>Please verify your account details to continue.</div>
        <a href="https://example.com">External Link</a>
        <img src="logo.png">
      </body>
    </html>
  `;
  
  const mockText = `Welcome to our secure site. Please login to verify your account. 
    Important: Your account may be limited if you don't update your information immediately.
    Enter your username and password to continue.`;
  
  const htmlFeatures = extractHtmlFeatures(mockHtml);
  const textFeatures = extractTextFeatures(mockText);
  
  return {
    url_features: urlFeatures,
    html_features: htmlFeatures,
    text_features: textFeatures
  };
}