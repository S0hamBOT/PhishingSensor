import { PhishingStatus, SiteInfo, ExplanationFactor } from '../types/phishing';
import { getSettings } from './storageUtils';
import { extractFeatures } from './featureExtraction';
import { predictWithLocalModel } from './localModel';

export async function getActiveSiteInfo(): Promise<SiteInfo> {
  return new Promise((resolve, reject) => {
    // In a real extension, we would use chrome.tabs.query to get the active tab
    // For this demo, we'll simulate it by using the current document
    try {
      // In a real extension implementation, this would use:
      // chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      //   const url = tabs[0].url;
      //   const title = tabs[0].title;
      //   const favicon = tabs[0].favIconUrl;
      //   ...
      // });
      
      // For now, we'll create sample data
      const url = window.location.href || 'https://example.com';
      const domain = new URL(url).hostname;
      
      resolve({
        url,
        domain,
        title: document.title || domain,
        favicon: `https://www.google.com/s2/favicons?domain=${domain}&sz=64`
      });
    } catch (error) {
      reject(error);
    }
  });
}

export async function getSiteStatus(url: string): Promise<PhishingStatus> {
  try {
    const settings = await getSettings();
    
    // Extract features from the current page
    const features = await extractFeatures(url);
    
    // Try to use the API first if local model is not preferred
    if (!settings.useLocalModel) {
      try {
        return await analyzeSiteWithAPI(url, features, settings.apiEndpoint);
      } catch (error) {
        console.warn('API analysis failed, falling back to local model:', error);
        // If API fails and local model is available, fall back to it
      }
    }
    
    // Use local model if API failed or local model is preferred
    return await predictWithLocalModel(url, features);
  } catch (error) {
    console.error('Error getting site status:', error);
    return {
      score: 0,
      risk: 'error',
      explanation: [{
        factor: 'Analysis Error',
        impact: 'high',
        description: 'Could not analyze the website. Please try again later.'
      }],
      url,
      timestamp: new Date()
    };
  }
}

async function analyzeSiteWithAPI(
  url: string, 
  features: any, 
  apiEndpoint: string
): Promise<PhishingStatus> {
  // In a real extension, we would make an API call here
  // For this demo, we'll simulate a response
  
  // Simulating an API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // This is a placeholder. In a real implementation, this would be:
  // const response = await fetch(apiEndpoint, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ url, features })
  // });
  // const data = await response.json();
  
  // For demonstration, generate a random result
  const score = Math.random();
  let risk: PhishingStatus['risk'];
  let explanation: ExplanationFactor[] = [];
  
  if (score < 0.2) {
    risk = 'safe';
    explanation = [
      {
        factor: 'Domain Age',
        impact: 'low',
        description: 'This domain has been registered for over 2 years, which is typically a sign of legitimacy.'
      },
      {
        factor: 'SSL Certificate',
        impact: 'low',
        description: 'The site uses a valid SSL certificate issued by a trusted authority.'
      },
      {
        factor: 'Content Analysis',
        impact: 'low',
        description: 'No suspicious content patterns detected in the page text.'
      }
    ];
  } else if (score < 0.7) {
    risk = 'suspicious';
    explanation = [
      {
        factor: 'Similar Domain',
        impact: 'medium',
        description: 'This domain appears to mimic a popular website with slight spelling variations.'
      },
      {
        factor: 'Form Fields',
        impact: 'medium',
        description: 'The page contains forms requesting sensitive information without proper security indicators.'
      },
      {
        factor: 'SSL Certificate',
        impact: 'low',
        description: 'The site does use HTTPS, but with a recently issued certificate.'
      }
    ];
  } else {
    risk = 'dangerous';
    explanation = [
      {
        factor: 'Suspicious URL',
        impact: 'high',
        description: 'The URL contains random characters or suspicious patterns typical of phishing sites.'
      },
      {
        factor: 'Recently Created Domain',
        impact: 'high',
        description: 'This domain was registered less than 30 days ago, which is common for phishing sites.'
      },
      {
        factor: 'Login Form',
        impact: 'high',
        description: 'The page contains login forms that submit data to suspicious domains.'
      },
      {
        factor: 'Brand Impersonation',
        impact: 'high',
        description: 'The page appears to impersonate a well-known brand using similar logos and styling.'
      }
    ];
  }
  
  return {
    score,
    risk,
    explanation,
    url,
    timestamp: new Date()
  };
}