import React, { useState } from 'react';
import { ChevronDown, AlertTriangle, Check, X } from 'lucide-react';
import { ExplanationFactor } from '../types/phishing';

interface ExplanationPanelProps {
  explanations: ExplanationFactor[];
}

const ExplanationPanel: React.FC<ExplanationPanelProps> = ({ explanations }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  if (!explanations || explanations.length === 0) {
    return null;
  }

  const impactIcon = (impact: string) => {
    switch (impact) {
      case 'high':
        return <X className="w-4 h-4 text-red-600" />;
      case 'medium':
        return <AlertTriangle className="w-4 h-4 text-amber-500" />;
      case 'low':
        return <Check className="w-4 h-4 text-green-600" />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <button 
        className="w-full p-4 flex items-center justify-between bg-blue-50 text-blue-800 font-medium" 
        onClick={toggleExpand}
      >
        <span>Why this classification?</span>
        <ChevronDown className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
      </button>
      
      {isExpanded && (
        <div className="p-4 divide-y divide-gray-100">
          {explanations.map((item, index) => (
            <div key={index} className="py-3 flex items-start">
              <div className="mt-0.5 mr-3">
                {impactIcon(item.impact)}
              </div>
              <div>
                <h3 className="font-medium">{item.factor}</h3>
                <p className="text-sm text-gray-600">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExplanationPanel;