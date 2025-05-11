import React, { useEffect, useState } from 'react';
import { Shield, AlertTriangle, Check, Info, ChevronRight, History, Settings, HelpCircle } from 'lucide-react';
import Header from './components/Header';
import StatusDisplay from './components/StatusDisplay';
import ExplanationPanel from './components/ExplanationPanel';
import FeedbackForm from './components/FeedbackForm';
import SiteDetails from './components/SiteDetails';
import NavigationBar from './components/NavigationBar';
import HistoryPanel from './components/HistoryPanel';
import SettingsPanel from './components/SettingsPanel';
import { PhishingStatus } from './types/phishing';
import { getActiveSiteInfo, getSiteStatus } from './utils/siteUtils';

function App() {
  const [activeView, setActiveView] = useState<'main' | 'history' | 'settings'>('main');
  const [status, setStatus] = useState<PhishingStatus>({
    score: 0,
    risk: 'unknown',
    explanation: [],
    url: '',
    timestamp: new Date()
  });
  const [siteInfo, setSiteInfo] = useState({
    url: '',
    domain: '',
    title: '',
    favicon: ''
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSiteData = async () => {
      setIsLoading(true);
      try {
        // Get the active site information
        const info = await getActiveSiteInfo();
        setSiteInfo(info);
        
        // Get the phishing status for the site
        const siteStatus = await getSiteStatus(info.url);
        setStatus(siteStatus);
      } catch (error) {
        console.error('Error fetching site data:', error);
        setStatus({
          score: 0,
          risk: 'error',
          explanation: [{ factor: 'Connection Error', impact: 'high', description: 'Could not connect to the analysis service.' }],
          url: siteInfo.url,
          timestamp: new Date()
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchSiteData();
  }, []);

  return (
    <div className="w-[400px] min-h-[500px] bg-gray-50 text-gray-900 flex flex-col">
      <Header />
      
      {activeView === 'main' && (
        <div className="flex-1 flex flex-col p-4 space-y-4 overflow-y-auto">
          <StatusDisplay status={status} isLoading={isLoading} />
          <SiteDetails site={siteInfo} />
          <ExplanationPanel explanations={status.explanation} />
          <FeedbackForm siteUrl={siteInfo.url} initialStatus={status.risk} />
        </div>
      )}
      
      {activeView === 'history' && <HistoryPanel />}
      {activeView === 'settings' && <SettingsPanel />}
      
      <NavigationBar activeView={activeView} onChangeView={setActiveView} />
    </div>
  );
}

export default App;