import { FeedbackData } from '../types/phishing';
import { saveFeedback } from './storageUtils';

export async function submitFeedback(feedback: FeedbackData): Promise<void> {
  // Store locally
  await saveFeedback(feedback);
  
  // In a real extension, we would also send this to a server
  // for model improvement if the user opted in.
  // This would look like:
  //
  // try {
  //   const response = await fetch('https://api.phishsense.com/v1/feedback', {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify(feedback)
  //   });
  //   
  //   if (!response.ok) {
  //     throw new Error(`API responded with status: ${response.status}`);
  //   }
  // } catch (error) {
  //   console.error('Error submitting feedback to API:', error);
  //   // Still save locally even if API submission fails
  // }
  
  console.log('Feedback submitted:', feedback);
  
  // Simulate API delay for demo purposes
  return new Promise(resolve => setTimeout(resolve, 500));
}