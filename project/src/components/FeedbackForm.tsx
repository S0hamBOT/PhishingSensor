import React, { useState } from 'react';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { RiskLevel } from '../types/phishing';
import { submitFeedback } from '../utils/feedbackUtils';

interface FeedbackFormProps {
  siteUrl: string;
  initialStatus: RiskLevel;
}

const FeedbackForm: React.FC<FeedbackFormProps> = ({ siteUrl, initialStatus }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [userClassification, setUserClassification] = useState<RiskLevel>('unknown');
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleFeedbackClick = (value: 'correct' | 'incorrect') => {
    setFeedback(value);
    if (value === 'correct') {
      setUserClassification(initialStatus);
    }
    setIsOpen(value === 'incorrect');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await submitFeedback({
        url: siteUrl,
        userClassification,
        systemClassification: initialStatus,
        reason,
        timestamp: new Date()
      });
      
      setIsSubmitted(true);
      setTimeout(() => {
        setIsOpen(false);
      }, 2000);
    } catch (error) {
      console.error('Error submitting feedback:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="bg-green-50 text-green-800 p-4 rounded-lg shadow text-center">
        <ThumbsUp className="w-8 h-8 mx-auto mb-2" />
        <h3 className="font-medium">Thank you for your feedback!</h3>
        <p className="text-sm">Your input helps our system improve.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-4">
        <h3 className="font-medium mb-2">Was this classification helpful?</h3>
        <div className="flex space-x-2">
          <button
            className={`flex-1 py-2 rounded-md flex items-center justify-center transition ${
              feedback === 'correct'
                ? 'bg-green-100 text-green-700'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
            onClick={() => handleFeedbackClick('correct')}
          >
            <ThumbsUp className="w-4 h-4 mr-1" />
            <span>Yes</span>
          </button>
          <button
            className={`flex-1 py-2 rounded-md flex items-center justify-center transition ${
              feedback === 'incorrect'
                ? 'bg-red-100 text-red-700'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
            onClick={() => handleFeedbackClick('incorrect')}
          >
            <ThumbsDown className="w-4 h-4 mr-1" />
            <span>No</span>
          </button>
        </div>
      </div>

      {isOpen && (
        <form onSubmit={handleSubmit} className="p-4 border-t border-gray-100">
          <div className="mb-3">
            <label className="block text-sm font-medium mb-1">How would you classify this site?</label>
            <select
              className="w-full p-2 border border-gray-300 rounded-md"
              value={userClassification}
              onChange={(e) => setUserClassification(e.target.value as RiskLevel)}
              required
            >
              <option value="unknown">Please select...</option>
              <option value="safe">Safe - Legitimate website</option>
              <option value="suspicious">Suspicious - Some concerning elements</option>
              <option value="dangerous">Dangerous - Definite phishing attempt</option>
            </select>
          </div>
          
          <div className="mb-3">
            <label className="block text-sm font-medium mb-1">Additional information (optional)</label>
            <textarea
              className="w-full p-2 border border-gray-300 rounded-md"
              rows={2}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Why do you think our classification was incorrect?"
            />
          </div>
          
          <button
            type="submit"
            disabled={isSubmitting || userClassification === 'unknown'}
            className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
          </button>
        </form>
      )}
    </div>
  );
};

export default FeedbackForm;