import React from 'react';
import { Shield, History, Settings } from 'lucide-react';

interface NavigationBarProps {
  activeView: 'main' | 'history' | 'settings';
  onChangeView: (view: 'main' | 'history' | 'settings') => void;
}

const NavigationBar: React.FC<NavigationBarProps> = ({ activeView, onChangeView }) => {
  return (
    <nav className="bg-white border-t border-gray-200 flex items-center justify-around py-2">
      <button 
        className={`flex flex-col items-center px-4 py-2 ${
          activeView === 'main' ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'
        }`}
        onClick={() => onChangeView('main')}
      >
        <Shield className="w-5 h-5" />
        <span className="text-xs mt-1">Scanner</span>
      </button>
      
      <button 
        className={`flex flex-col items-center px-4 py-2 ${
          activeView === 'history' ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'
        }`}
        onClick={() => onChangeView('history')}
      >
        <History className="w-5 h-5" />
        <span className="text-xs mt-1">History</span>
      </button>
      
      <button 
        className={`flex flex-col items-center px-4 py-2 ${
          activeView === 'settings' ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'
        }`}
        onClick={() => onChangeView('settings')}
      >
        <Settings className="w-5 h-5" />
        <span className="text-xs mt-1">Settings</span>
      </button>
    </nav>
  );
};

export default NavigationBar;