import React, { useState } from 'react';
import ScanTab from './components/ScanTab';
import LogTab from './components/LogTab';
import OverviewTab from './components/OverviewTab';
import ChatButton from './components/ChatButton';
import ChatModal from './components/ChatModal';
import { Camera, Receipt, TrendingUp } from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState('scan');
  const [isChatOpen, setIsChatOpen] = useState(false);

  const tabs = [
    { id: 'scan', label: 'Scan', icon: Camera, component: ScanTab },
    { id: 'log', label: 'Log', icon: Receipt, component: LogTab },
    { id: 'overview', label: 'Overview', icon: TrendingUp, component: OverviewTab },
  ];

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component || ScanTab;

  return (
    <div className="min-h-screen bg-gray-50 safe-area-top">
      {/* Main Content */}
      <main className="pb-20">
        <ActiveComponent />
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
