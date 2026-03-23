import React from 'react';

function App() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      <div style={{
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        borderRadius: '20px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        padding: '32px',
        maxWidth: '400px',
        width: '100%',
        animation: 'slideUp 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            width: '128px',
            height: '128px',
            background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
            borderRadius: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px',
            animation: 'float 3s ease-in-out infinite'
          }}>
            <span style={{
              color: 'white',
              fontSize: '48px',
              fontWeight: 'bold'
            }}>T</span>
          </div>
          <h1 style={{
            fontSize: '36px',
            fontWeight: 'bold',
            color: 'white',
            marginBottom: '8px'
          }}>Tappd</h1>
          <p style={{
            color: 'rgba(255, 255, 255, 0.8)',
            fontSize: '16px'
          }}>AI-powered receipt scanner</p>
        </div>

        <div style={{ textAlign: 'center' }}>
          <p style={{
            color: 'rgba(255, 255, 255, 0.7)',
            marginBottom: '24px',
            fontSize: '14px'
          }}>
            Beautiful iOS 26 Liquid Glass Design
          </p>
          
          <button style={{
            width: '100%',
            background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
            color: 'white',
            padding: '16px',
            borderRadius: '16px',
            fontWeight: '600',
            fontSize: '16px',
            border: 'none',
            cursor: 'pointer',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
          }}>
            Get Started
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

export default App;
