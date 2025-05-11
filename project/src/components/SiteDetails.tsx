import React from 'react';
import { Globe, ExternalLink } from 'lucide-react';

interface SiteDetailsProps {
  site: {
    url: string;
    domain: string;
    title: string;
    favicon: string;
  };
}

const SiteDetails: React.FC<SiteDetailsProps> = ({ site }) => {
  const { url, domain, title, favicon } = site;
  
  const truncatedUrl = url.length > 40 ? url.substring(0, 37) + '...' : url;
  
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-center mb-2">
        {favicon ? (
          <img src={favicon} alt="Site icon" className="w-5 h-5 mr-2" />
        ) : (
          <Globe className="w-5 h-5 mr-2 text-gray-500" />
        )}
        <h3 className="font-medium flex-1 truncate" title={title}>{title || domain}</h3>
      </div>
      <div className="flex items-center text-sm text-gray-500">
        <span className="flex-1 truncate" title={url}>{truncatedUrl}</span>
        <a 
          href={url} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-blue-600 ml-2 flex items-center hover:text-blue-800"
        >
          <ExternalLink className="w-4 h-4" />
          <span className="sr-only">Open site</span>
        </a>
      </div>
    </div>
  );
};

export default SiteDetails;