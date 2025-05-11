import React from 'react';
import { Shield } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-blue-600 text-white p-4 flex items-center">
      <Shield className="w-6 h-6 mr-2" />
      <h1 className="text-xl font-semibold flex-1">PhishSense</h1>
      <span className="text-xs bg-blue-700 px-2 py-1 rounded">v1.0.0</span>
    </header>
  );
};

export default Header;