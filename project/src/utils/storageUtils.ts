import { PhishingStatus, DetectionHistory, FeedbackData } from '../types/phishing';

// In a real extension, these would use chrome.storage.local
// For this demo, we'll use localStorage with prefixes

// Settings

const DEFAULT_SETTINGS = {
  showNotifications: true,
  useLocalModel: false,
  scanAutomatically: true,
  detectionThreshold: 'medium',
  apiEndpoint: 'https://api.phishsense.com/v1/analyze'
};

export async function getSettings(): Promise<any> {
  return new Promise((resolve) => {
    try {
      const settingsStr = localStorage.getItem('phishsense_settings');
      const settings = settingsStr ? JSON.parse(settingsStr) : DEFAULT_SETTINGS;
      resolve(settings);
    } catch (error) {
      console.error('Error getting settings:', error);
      resolve(DEFAULT_SETTINGS);
    }
  });
}

export async function saveSettings(settings: any): Promise<void> {
  return new Promise((resolve) => {
    try {
      localStorage.setItem('phishsense_settings', JSON.stringify(settings));
      resolve();
    } catch (error) {
      console.error('Error saving settings:', error);
      throw error;
    }
  });
}

// Detection History

export async function getDetectionHistory(): Promise<DetectionHistory> {
  return new Promise((resolve) => {
    try {
      const historyStr = localStorage.getItem('phishsense_history');
      const history = historyStr ? JSON.parse(historyStr) : { items: [], lastUpdated: new Date() };
      
      // Convert string dates back to Date objects
      history.lastUpdated = new Date(history.lastUpdated);
      history.items = history.items.map((item: any) => ({
        ...item,
        timestamp: new Date(item.timestamp)
      }));
      
      resolve(history);
    } catch (error) {
      console.error('Error getting history:', error);
      resolve({ items: [], lastUpdated: new Date() });
    }
  });
}

export async function saveDetectionResult(result: PhishingStatus): Promise<void> {
  return new Promise(async (resolve) => {
    try {
      const history = await getDetectionHistory();
      
      // Add new result to history
      history.items.unshift(result);
      
      // Limit history size
      if (history.items.length > 100) {
        history.items = history.items.slice(0, 100);
      }
      
      history.lastUpdated = new Date();
      
      // Save updated history
      localStorage.setItem('phishsense_history', JSON.stringify(history));
      resolve();
    } catch (error) {
      console.error('Error saving detection result:', error);
      throw error;
    }
  });
}

export async function clearDetectionHistory(): Promise<void> {
  return new Promise((resolve) => {
    try {
      localStorage.setItem('phishsense_history', JSON.stringify({ 
        items: [], 
        lastUpdated: new Date() 
      }));
      resolve();
    } catch (error) {
      console.error('Error clearing history:', error);
      throw error;
    }
  });
}

// Feedback Storage

export async function saveFeedback(feedback: FeedbackData): Promise<void> {
  return new Promise(async (resolve) => {
    try {
      // Get existing feedback
      const feedbackStr = localStorage.getItem('phishsense_feedback');
      const existingFeedback = feedbackStr ? JSON.parse(feedbackStr) : [];
      
      // Add new feedback
      existingFeedback.push(feedback);
      
      // Save updated feedback
      localStorage.setItem('phishsense_feedback', JSON.stringify(existingFeedback));
      resolve();
    } catch (error) {
      console.error('Error saving feedback:', error);
      throw error;
    }
  });
}

export async function getFeedback(): Promise<FeedbackData[]> {
  return new Promise((resolve) => {
    try {
      const feedbackStr = localStorage.getItem('phishsense_feedback');
      const feedback = feedbackStr ? JSON.parse(feedbackStr) : [];
      
      // Convert string dates back to Date objects
      feedback.forEach((item: any) => {
        item.timestamp = new Date(item.timestamp);
      });
      
      resolve(feedback);
    } catch (error) {
      console.error('Error getting feedback:', error);
      resolve([]);
    }
  });
}