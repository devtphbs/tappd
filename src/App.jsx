import React, { useState, useEffect } from 'react';
import ScanTab from './components/ScanTab';
import LogTab from './components/LogTab';
import OverviewTab from './components/OverviewTab';
import Auth from './components/Auth';
import Settings from './components/Settings';
import ChatButton from './components/ChatButton';
import ChatModal from './components/ChatModal';
import { Camera, Receipt, TrendingUp, Settings as SettingsIcon } from 'lucide-react';
import { getCurrentUser, onAuthStateChange } from './supabase.js';
import { haptics } from './utils/haptics.js';

function App() {
  const [activeTab, setActiveTab] = useState('scan');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
        if (currentUser) {
          haptics.pageLoad();
        }
      } catch (error) {
        console.error('Error checking user:', error);
      } finally {
        setLoading(false);
      }
    };

    checkUser();

    const { data: { subscription } } = onAuthStateChange((event, session) => {
      const currentUser = session?.user || null;
      setUser(currentUser);
      
      if (currentUser) {
        haptics.success();
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    haptics.tabSwitch();
  };

  const tabs = [
    { id: 'scan', label: 'Scan', icon: Camera, component: ScanTab },
    { id: 'log', label: 'Log', icon: Receipt, component: LogTab },
    { id: 'overview', label: 'Overview', icon: TrendingUp, component: OverviewTab },
    { id: 'settings', label: 'Settings', icon: SettingsIcon, component: Settings },
  ];

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component || ScanTab;

  if (loading) {
    return (
      <div className="min-h-screen safe-area-top flex items-center justify-center">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="text-white/80">Loading Tappd...</p>
        </div>
      </div>
    );
  }

  // Show auth screen if not authenticated
  if (!user) {
    return <Auth user={user} onAuthChange={setUser} />;
  }

  return (
    <div className="min-h-screen safe-area-top">
      {/* Main Content */}
      <main className="pb-20">
        <div className="slide-up">
          <ActiveComponent user={user} />
        </div>
      </main>

      {/* Bottom Tab Navigation */}
      <nav className="tab-bar">
        <div className="flex justify-around items-center py-2">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`flex flex-col items-center p-2 rounded-xl transition-all duration-300 ${
                  isActive 
                    ? 'text-white scale-110' 
                    : 'text-white/60 hover:text-white/80'
                }`}
              >
                <Icon size={24} className={isActive ? 'floating' : ''} />
                <span className="text-xs mt-1 font-medium">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Chat Button */}
      <ChatButton onClick={() => {
        setIsChatOpen(true);
        haptics.buttonPress();
      }} />

      {/* Chat Modal */}
      {isChatOpen && (
        <ChatModal onClose={() => {
          setIsChatOpen(false);
          haptics.buttonPress();
        }} />
      )}
    </div>
  );
}

export default App;
