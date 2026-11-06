'use client';

import React from 'react';
import { MessageSquareText } from 'lucide-react';

interface FloatingContactBubbleProps {
  onClick: () => void;
}

export default function FloatingContactBubble({ onClick }: FloatingContactBubbleProps) {
  return (
    <div className="fixed bottom-6 right-6 z-40">
      <button
        onClick={onClick}
        aria-label="Mở cửa sổ liên hệ nhanh"
        className="w-[60px] h-[60px] sm:w-[68px] sm:h-[68px] rounded-full bg-[#f59e0b] hover:bg-[#d97706] text-[#0b132b] flex items-center justify-center shadow-lg transition-transform hover:scale-105 active:scale-95 group relative cursor-pointer"
      >
        <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-red-500"></span>
        </span>
        <MessageSquareText className="w-7 h-7 sm:w-8 sm:h-8 text-[#0b132b]" />
      </button>
    </div>
  );
}
