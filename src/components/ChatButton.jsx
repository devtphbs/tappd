import React from 'react';
import { MessageCircle } from 'lucide-react';

export default function ChatButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-24 right-6 bg-primary-600 text-white rounded-full p-4 shadow-lg active:scale-95 transition-transform z-40"
    >
      <MessageCircle size={24} />
    </button>
  );
}
