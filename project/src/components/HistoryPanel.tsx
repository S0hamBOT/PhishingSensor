import React, { useEffect, useState } from 'react';
import { Clock, Search, Shield, AlertTriangle, X, Trash2 } from 'lucide-react';
import { PhishingStatus } from '../types/phishing';
import { getDetectionHistory, clearDetectionHistory } from '../utils/storageUtils';

const HistoryPanel: React.FC = () => {
  const [history, setHistory] = useState<PhishingStatus[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadHistory = async () => {
      setIsLoading(true);
      try {
        const data = await getDetectionHistory();
        setHistory(data.items);
      } catch (error) {
        console.error('Error loading history:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadHistory();
  }, []);

  const handleClearHistory = async () => {
    if (confirm('Are you sure you want to clear all history?')) {
      await clearDetectionHistory();
      setHistory([]);
    }
  };

  const getRiskIcon = (risk: string) => {
    switch (risk) {
      case 'safe':
        return <Shield className="w-5 h-5 text-green-600" />;
      case 'suspicious':
        return <AlertTriangle className="w-5 h-5 text-amber-500" />;
      case 'dangerous':
        return <X className="w-5 h-5 text-red-600" />;
      default:
        return <Shield className="w-5 h-5 text-gray-400" />;
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredHistory = history.filter(item => 
    item.url.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col p-4 overflow-hidden">
      <h2 className="text-lg font-semibold mb-3 flex items-center">
        <Clock className="w-5 h-5 mr-2" />
        Detection History
      </h2>
      
      <div className="relative mb-4">
        <input
          type="text"
          placeholder="Search history..."
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
      </div>
      
      {history.length > 0 && (
        <button
          onClick={handleClearHistory}
          className="flex items-center text-sm text-red-600 mb-3 hover:text-red-800"
        >
          <Trash2 className="w-4 h-4 mr-1" />
          Clear History
        </button>
      )}
      
      {isLoading ? (
        <div className="flex-1 flex items-center justify-center text-gray-500">
          <Clock className="w-6 h-6 animate-pulse mr-2" />
          Loading history...
        </div>
      ) : filteredHistory.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
          <Clock className="w-12 h-12 mb-2" />
          <p>{searchTerm ? 'No matches found' : 'No history yet'}</p>
          <p className="text-sm">
            {searchTerm ? 'Try a different search term' : 'Websites you scan will appear here'}
          </p>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto">
          <div className="space-y-2">
            {filteredHistory.map((item, index) => (
              <div key={index} className="bg-white rounded-lg shadow p-3">
                <div className="flex items-center">
                  {getRiskIcon(item.risk)}
                  <div className="ml-2 flex-1 min-w-0">
                    <p className="text-sm font-medium truncate" title={item.url}>
                      {new URL(item.url).hostname}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatDate(item.timestamp)}
                    </p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    item.risk === 'safe' ? 'bg-green-100 text-green-800' :
                    item.risk === 'suspicious' ? 'bg-amber-100 text-amber-800' :
                    item.risk === 'dangerous' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {item.risk.charAt(0).toUpperCase() + item.risk.slice(1)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default HistoryPanel;