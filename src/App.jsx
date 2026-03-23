import React, { useState, useEffect } from 'react';
import ScanTab from './components/ScanTab';
import LogTab from './components/LogTab';
import OverviewTab from './components/OverviewTab';
import Auth from './components/Auth';
import Settings from './components/Settings';
import ChatButton from './components/ChatButton';
import ChatModal from './components/ChatModal';
import { Camera, Receipt, TrendingUp, Settings as SettingsIcon } from 'lucide-react';

// Temporarily disable Supabase to test basic app functionality
// import { getCurrentUser, onAuthStateChange } from './supabase.js';

function App() {
  const [activeTab, setActiveTab] = useState('scan');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [user, setUser] = useState(null); // Temporarily set to null for testing
  const [loading, setLoading] = useState(false); // Set to false to skip loading

  // Temporarily disable auth for testing
  useEffect(() => {
    setLoading(false);
    setUser(null);
  }, []);

  // Original auth code (commented out for testing)
  /*
  useEffect(() => {
    // Check for existing user session
    const checkUser = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error('Error checking user:', error);
      } finally {
        setLoading(false);
      }
    };

    checkUser();

    // Listen for auth changes
    const { data: { subscription } } = onAuthStateChange((event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);
  */

  const tabs = [
    { id: 'scan', label: 'Scan', icon: Camera, component: ScanTab },
    { id: 'log', label: 'Log', icon: Receipt, component: LogTab },
    { id: 'overview', label: 'Overview', icon: TrendingUp, component: OverviewTab },
    { id: 'settings', label: 'Settings', icon: SettingsIcon, component: Settings },
  ];

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component || ScanTab;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 safe-area-top">
        <main>
          <Auth user={user} onAuthChange={setUser} />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 safe-area-top">
      {/* Main Content */}
      <main className="pb-20">
        <ActiveComponent user={user} />
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
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
                  isActive ? 'text-primary-600' : 'text-gray-400'
                }`}
              >
                <Icon size={24} />
                <span className="text-xs mt-1">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Chat Button */}
      <ChatButton onClick={() => setIsChatOpen(true)} />

      {/* Chat Modal */}
      {isChatOpen && (
        <ChatModal onClose={() => setIsChatOpen(false)} />
      )}
    </div>
  );
}

export default App;
