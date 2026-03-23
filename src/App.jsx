import React, { useState, useEffect } from 'react';

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('App component mounted');
    setLoading(false);
  }, []);

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

  return (
    <div className="min-h-screen safe-area-top flex items-center justify-center p-6">
      <div className="glass-card max-w-md w-full slide-up liquid-fill">
        <div className="text-center mb-8">
          <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-6 floating">
            <span className="text-white text-5xl font-bold">T</span>
          </div>
          <h1 className="text-4xl font-bold mb-2">Tappd</h1>
          <p className="text-white/80">AI-powered receipt scanner</p>
        </div>

        <div className="text-center">
          <p className="text-white/70 mb-6">
            Beautiful iOS 26 Liquid Glass Design
          </p>
          
          <button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 rounded-2xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-xl">
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
