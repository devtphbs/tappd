import React from 'react';
import { MessageCircle } from 'lucide-react';

export default function ChatButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-24 right-6 w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-all duration-300 z-40"
    >
      <MessageCircle size={24} className="text-white" />
    </button>
  );
}
