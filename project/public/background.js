// Background Script - runs in the background of the extension

// Initialize default settings if not already set
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.get(['settings'], (result) => {
    if (!result.settings) {
      chrome.storage.local.set({
        settings: {
          showNotifications: true,
          useLocalModel: false,
          scanAutomatically: true,
          detectionThreshold: 'medium',
          apiEndpoint: 'https://api.phishsense.com/v1/analyze'
        }
      });
    }
  });
});

// Listen for navigation events to analyze new pages
chrome.webNavigation.onCompleted.addListener(async (details) => {
  // Only analyze the main frame, not iframes
  if (details.frameId !== 0) return;
  
  // Get settings to check if auto-scan is enabled
  const { settings } = await chrome.storage.local.get(['settings']);
  if (!settings || !settings.scanAutomatically) return;
  
  // Analyze the page
  analyzeCurrentPage(details.tabId, details.url);
});

// Function to analyze the current page
async function analyzeCurrentPage(tabId, url) {
  try {
    // Execute content script to extract features from the page
    const features = await chrome.scripting.executeScript({
      target: { tabId },
      func: extractFeaturesFromPage
    });
    
    // Use the local model or API based on settings
    const { settings } = await chrome.storage.local.get(['settings']);
    
    let result;
    if (settings.useLocalModel) {
      // Use local model (simplified for this example)
      result = await predictWithLocalModel(url, features[0].result);
    } else {
      // Try API first, fall back to local model if needed
      try {
        result = await analyzeSiteWithAPI(url, features[0].result, settings.apiEndpoint);
      } catch (error) {
        console.warn('API analysis failed, falling back to local model:', error);
        result = await predictWithLocalModel(url, features[0].result);
      }
    }
    
    // Store the result
    await saveDetectionResult(result);
    
    // Show notification if enabled and site is suspicious or dangerous
    if (settings.showNotifications && (result.risk === 'suspicious' || result.risk === 'dangerous')) {
      showPhishingNotification(result);
    }
    
    // Send result to content script to display warning if needed
    chrome.tabs.sendMessage(tabId, { 
      action: 'phishing_result', 
      result 
    });
    
  } catch (error) {
    console.error('Error analyzing page:', error);
  }
}

// Function to be injected into the page to extract features
function extractFeaturesFromPage() {
  // This is a simplified version - in a real extension, this would be more comprehensive
  const url = window.location.href;
  const domain = window.location.hostname;
  const html = document.documentElement.outerHTML;
  const text = document.body.textContent || '';
  
  // Extract basic URL features
  const urlFeatures = {
    domain_length: domain.length,
    path_length: window.location.pathname.length,
    has_https: window.location.protocol === 'https:' ? 1 : 0,
    has_suspicious_tld: ['xyz', 'tk', 'ml', 'ga', 'cf', 'gq'].includes(domain.split('.').pop() || '') ? 1 : 0,
    has_ip_address: /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/.test(domain) ? 1 : 0,
    has_at_symbol: url.includes('@') ? 1 : 0,
    special_char_count: (url.match(/[^a-zA-Z0-9./:?&=-]/g) || []).length,
  };
  
  // Extract basic HTML features
  const htmlFeatures = {
    form_count: document.forms.length,
    password_input_count: document.querySelectorAll('input[type="password"]').length,
    external_link_count: Array.from(document.querySelectorAll('a[href]'))
      .filter(a => a.href && new URL(a.href).host !== window.location.host).length,
    iframe_count: document.querySelectorAll('iframe').length,
    hidden_element_count: document.querySelectorAll('[style*="display:none"], [style*="display: none"], [hidden]').length,
    has_favicon: document.querySelector('link[rel*="icon"]') ? 1 : 0,
    has_login_form: Array.from(document.forms).some(form => 
      form.innerHTML.toLowerCase().includes('login') || 
      form.innerHTML.toLowerCase().includes('password')
    ) ? 1 : 0,
  };
  
  // Extract basic text features
  const lowerText = text.toLowerCase();
  const textFeatures = {
    has_suspicious_phrases: [
      'verify your account', 
      'confirm your identity', 
      'account has been suspended', 
      'unusual activity', 
      'security alert'
    ].some(phrase => lowerText.includes(phrase)) ? 1 : 0,
    urgency_keywords: ['urgent', 'immediately', 'alert', 'attention', 'important'].filter(
      keyword => lowerText.includes(keyword)
    ).length
  };
  
  return {
    url_features: urlFeatures,
    html_features: htmlFeatures,
    text_features: textFeatures
  };
}

// Show notification for phishing sites
function showPhishingNotification(result) {
  chrome.notifications.create({
    type: 'basic',
    iconUrl: result.risk === 'dangerous' ? 'icons/warning128.png' : 'icons/caution128.png',
    title: result.risk === 'dangerous' ? 'Dangerous Website Detected!' : 'Suspicious Website Warning',
    message: `PhishSense has detected that ${new URL(result.url).hostname} may be a ${result.risk} website.`,
    priority: 2
  });
}

// Functions for analyzing sites and storing results would be implemented here
// For brevity, these are omitted but would mirror the functionality in the utils folder

// Listen for messages from the popup or content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'analyze_site') {
    // Analyze the current page on demand
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        analyzeCurrentPage(tabs[0].id, tabs[0].url);
        sendResponse({ status: 'analyzing' });
      }
    });
    return true; // Indicates we'll send a response asynchronously
  }
  
  if (message.action === 'feedback_submitted') {
    // Process feedback - in a real extension, this might be used to improve the model
    console.log('Feedback received:', message.feedback);
    sendResponse({ status: 'received' });
  }
});