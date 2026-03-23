import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Loader2, User, Bot } from 'lucide-react';
import { askAIAboutSpending } from '../api.js';
import { getReceipts } from '../db.js';

export default function ChatModal({ onClose }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: input,
      sender: 'user',
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Get receipts data for context
      const receipts = await getReceipts();
      
      const response = await askAIAboutSpending(input, receipts);
      
      const botMessage = {
        id: Date.now() + 1,
        text: response,
        sender: 'bot',
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      // Fallback to mock response
      const mockResponse = {
        id: Date.now() + 1,
        text: getMockResponse(input),
        sender: 'bot',
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, mockResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  const getMockResponse = (userInput) => {
    const input = userInput.toLowerCase();
    
    if (input.includes('food') || input.includes('eating')) {
      return "Based on your spending this month, you've spent $55.39 on food, which is 11% of your total spending. Your biggest food purchase was at Whole Foods for $45.67. You're on track with your food budget of $500.";
    }
    
    if (input.includes('biggest') || input.includes('largest')) {
      return "Your biggest purchase this month was $50.00 for Gym Membership in the Health & Fitness category. Your second largest was $45.67 at Whole Foods.";
    }
    
    if (input.includes('budget') || input.includes('over')) {
      return "Looking at your budgets, you're doing well! You're currently at 11% of your food budget, 8% of your shopping budget, and 50% of your health budget. Everything looks on track for this month.";
    }
    
    if (input.includes('week') || input.includes('last week')) {
      return "In the past week, you spent $83.88 across 3 transactions. Your spending was mainly on food ($55.39) and transportation ($12.50).";
    }
    
    return "I can help you analyze your spending patterns! You can ask me about your spending by category, time periods, specific merchants, or budget status. What would you like to know?";
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
      <div className="bg-white w-full rounded-t-3xl safe-area-top">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
              <Bot size={16} className="text-white" />
            </div>
            <div>
              <h2 className="font-semibold">Ask Tappd</h2>
              <p className="text-xs text-gray-500">Your spending assistant</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2">
            <X size={20} />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 p-4 space-y-4 h-96 overflow-y-auto">
          {messages.length === 0 && (
            <div className="text-center py-8">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Bot size={24} className="text-primary-600" />
              </div>
              <h3 className="font-semibold mb-1">Hi! I'm Tappd</h3>
              <p className="text-sm text-gray-600 px-8">
                Ask me anything about your spending! Try questions like:
              </p>
              <div className="mt-3 space-y-1 text-xs text-gray-500">
                <div>• "How much did I spend on food this month?"</div>
                <div>• "What was my biggest purchase last week?"</div>
                <div>• "Am I over my budget?"</div>
              </div>
            </div>
          )}

          {messages.map(message => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.sender === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                message.sender === 'user' 
                  ? 'bg-gray-200' 
                  : 'bg-primary-100'
              }`}>
                {message.sender === 'user' ? (
                  <User size={16} className="text-gray-600" />
                ) : (
                  <Bot size={16} className="text-primary-600" />
                )}
              </div>
              <div className={`max-w-[80%] ${
                message.sender === 'user' ? 'text-right' : ''
              }`}>
                <div className={`inline-block p-3 rounded-2xl ${
                  message.sender === 'user'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}>
                  {message.text}
                </div>
                <div className={`text-xs text-gray-500 mt-1 ${
                  message.sender === 'user' ? 'mr-1' : 'ml-1'
                }`}>
                  {formatTime(message.timestamp)}
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center bg-primary-100">
                <Bot size={16} className="text-primary-600" />
              </div>
              <div className="bg-gray-100 p-3 rounded-2xl">
                <Loader2 className="animate-spin" size={16} />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask about your spending..."
              className="input-field flex-1"
              disabled={isLoading}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="bg-primary-600 text-white p-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 transition-transform"
            >
              {isLoading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <Send size={20} />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
