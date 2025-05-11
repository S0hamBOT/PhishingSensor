import React, { useEffect, useState } from 'react';
import { Settings, Bell, Server, Shield, ToggleLeft, ToggleRight } from 'lucide-react';
import { getSettings, saveSettings } from '../utils/storageUtils';

interface SettingsState {
  showNotifications: boolean;
  useLocalModel: boolean;
  scanAutomatically: boolean;
  detectionThreshold: 'low' | 'medium' | 'high';
  apiEndpoint: string;
}

const SettingsPanel: React.FC = () => {
  const [settings, setSettings] = useState<SettingsState>({
    showNotifications: true,
    useLocalModel: false,
    scanAutomatically: true,
    detectionThreshold: 'medium',
    apiEndpoint: 'https://api.phishsense.com/v1/analyze'
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');

  useEffect(() => {
    const loadSettings = async () => {
      setIsLoading(true);
      try {
        const savedSettings = await getSettings();
        setSettings(savedSettings);
      } catch (error) {
        console.error('Error loading settings:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, []);

  const handleToggle = (setting: keyof SettingsState) => {
    setSettings(prev => ({
      ...prev,
      [setting]: !prev[setting as keyof typeof prev]
    }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveStatus('idle');
    
    try {
      await saveSettings(settings);
      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (error) {
      console.error('Error saving settings:', error);
      setSaveStatus('error');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500">
        <Settings className="w-6 h-6 animate-pulse mr-2" />
        Loading settings...
      </div>
    );
  }

  return (
    <div className="flex-1 p-4 overflow-y-auto">
      <h2 className="text-lg font-semibold mb-4 flex items-center">
        <Settings className="w-5 h-5 mr-2" />
        Settings
      </h2>

      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <h3 className="font-medium">General Settings</h3>
          </div>
          
          <div className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-start">
                <Bell className="w-5 h-5 text-gray-700 mt-0.5 mr-3" />
                <div>
                  <p className="font-medium">Notifications</p>
                  <p className="text-sm text-gray-500">Show alerts when phishing is detected</p>
                </div>
              </div>
              <button 
                onClick={() => handleToggle('showNotifications')}
                className="text-blue-600 hover:text-blue-800"
              >
                {settings.showNotifications ? 
                  <ToggleRight className="w-8 h-8" /> : 
                  <ToggleLeft className="w-8 h-8" />
                }
              </button>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-start">
                <Shield className="w-5 h-5 text-gray-700 mt-0.5 mr-3" />
                <div>
                  <p className="font-medium">Auto-scan pages</p>
                  <p className="text-sm text-gray-500">Automatically scan websites when visited</p>
                </div>
              </div>
              <button 
                onClick={() => handleToggle('scanAutomatically')}
                className="text-blue-600 hover:text-blue-800"
              >
                {settings.scanAutomatically ? 
                  <ToggleRight className="w-8 h-8" /> : 
                  <ToggleLeft className="w-8 h-8" />
                }
              </button>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-start">
                <Server className="w-5 h-5 text-gray-700 mt-0.5 mr-3" />
                <div>
                  <p className="font-medium">Use local model</p>
                  <p className="text-sm text-gray-500">Run detection locally when API is unavailable</p>
                </div>
              </div>
              <button 
                onClick={() => handleToggle('useLocalModel')}
                className="text-blue-600 hover:text-blue-800"
              >
                {settings.useLocalModel ? 
                  <ToggleRight className="w-8 h-8" /> : 
                  <ToggleLeft className="w-8 h-8" />
                }
              </button>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <h3 className="font-medium">Detection Settings</h3>
          </div>
          
          <div className="p-4 space-y-4">
            <div>
              <label className="block mb-2 text-sm font-medium">Detection Threshold</label>
              <select
                name="detectionThreshold"
                value={settings.detectionThreshold}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="low">Low - More sensitive (may have false positives)</option>
                <option value="medium">Medium - Balanced detection</option>
                <option value="high">High - Less sensitive (fewer false positives)</option>
              </select>
            </div>
            
            <div>
              <label className="block mb-2 text-sm font-medium">API Endpoint</label>
              <input
                type="text"
                name="apiEndpoint"
                value={settings.apiEndpoint}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="https://api.phishsense.com/v1/analyze"
              />
              <p className="text-xs text-gray-500 mt-1">Only change this if you're running your own API server</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-6 flex items-center">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
        >
          {isSaving ? 'Saving...' : 'Save Settings'}
        </button>
        
        {saveStatus === 'success' && (
          <span className="ml-3 text-green-600 text-sm">Settings saved successfully!</span>
        )}
        
        {saveStatus === 'error' && (
          <span className="ml-3 text-red-600 text-sm">Error saving settings</span>
        )}
      </div>
    </div>
  );
};

export default SettingsPanel;