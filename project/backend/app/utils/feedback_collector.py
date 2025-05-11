"""
Utility for collecting and processing user feedback
"""

import os
import json
import logging
from datetime import datetime
from typing import Dict, Any

from app.core.config import settings

async def process_feedback(feedback: Dict[str, Any]) -> None:
    """
    Process user feedback for model improvement
    
    Args:
        feedback: Dict containing user feedback on a prediction
    """
    try:
        # Create a filename with timestamp
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"feedback_{timestamp}.json"
        filepath = os.path.join(settings.FEEDBACK_DIR, filename)
        
        # Make sure the directory exists
        os.makedirs(settings.FEEDBACK_DIR, exist_ok=True)
        
        # Save feedback to file
        with open(filepath, 'w') as f:
            json.dump(feedback, f, default=str)
        
        # Log the feedback
        logging.info(f"Feedback saved to {filepath}")
        
        # In a production system, this is where you would:
        # 1. Add the feedback to a database
        # 2. Flag the URL for further analysis if needed
        # 3. Schedule model retraining if enough new feedback is collected
        
    except Exception as e:
        logging.error(f"Error processing feedback: {str(e)}")