import React from 'react';
import { Shield, AlertTriangle, Check, AlertCircle, Loader2 } from 'lucide-react';
import { PhishingStatus } from '../types/phishing';

interface StatusDisplayProps {
  status: PhishingStatus;
  isLoading: boolean;
}

const StatusDisplay: React.FC<StatusDisplayProps> = ({ status, isLoading }) => {
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center justify-center text-gray-500">
        <Loader2 className="w-12 h-12 animate-spin mb-2 text-blue-500" />
        <h2 className="text-xl font-medium">Analyzing website...</h2>
        <p className="text-sm">We're scanning this site for phishing indicators</p>
      </div>
    );
  }

  let statusInfo = {
    title: 'Unknown Status',
    description: 'We couldn\'t determine the safety of this site.',
    icon: AlertCircle,
    iconColor: 'text-gray-500',
    bgColor: 'bg-gray-100'
  };

  switch (status.risk) {
    case 'safe':
      statusInfo = {
        title: 'Safe Website',
        description: 'This website appears to be legitimate.',
        icon: Check,
        iconColor: 'text-green-600',
        bgColor: 'bg-green-50'
      };
      break;
    case 'suspicious':
      statusInfo = {
        title: 'Suspicious Website',
        description: 'This website has some suspicious characteristics.',
        icon: AlertTriangle,
        iconColor: 'text-amber-500',
        bgColor: 'bg-amber-50'
      };
      break;
    case 'dangerous':
      statusInfo = {
        title: 'Dangerous Website',
        description: 'This website is likely a phishing attempt.',
        icon: Shield,
        iconColor: 'text-red-600',
        bgColor: 'bg-red-50'
      };
      break;
    case 'error':
      statusInfo = {
        title: 'Analysis Error',
        description: 'We couldn\'t analyze this website.',
        icon: AlertCircle,
        iconColor: 'text-gray-500',
        bgColor: 'bg-gray-100'
      };
      break;
  }

  const { title, description, icon: Icon, iconColor, bgColor } = statusInfo;

  return (
    <div className={`rounded-lg shadow p-4 flex items-center ${bgColor}`}>
      <div className={`w-16 h-16 rounded-full flex items-center justify-center ${iconColor} bg-white shadow-sm`}>
        <Icon className="w-10 h-10" />
      </div>
      <div className="ml-4 flex-1">
        <h2 className="text-xl font-medium">{title}</h2>
        <p className="text-sm">{description}</p>
        {status.risk !== 'error' && (
          <div className="mt-1 bg-gray-200 h-2 rounded-full overflow-hidden">
            <div 
              className={`h-full ${status.risk === 'safe' ? 'bg-green-500' : 
                status.risk === 'suspicious' ? 'bg-amber-500' : 'bg-red-600'}`}
              style={{ width: `${Math.max(5, Math.min(100, status.score * 100))}%` }}
            ></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatusDisplay;