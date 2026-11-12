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
        type="button"
        onClick={onClick}
        aria-label="Mở cửa sổ liên hệ báo giá nhanh"
        className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-amber-500 hover:bg-amber-600 text-navy-900 flex items-center justify-center shadow-lg transition-transform hover:scale-105 active:scale-95 cursor-pointer"
      >
        <MessageSquareText className="w-6 h-6 sm:w-7 sm:h-7 text-navy-900" aria-hidden="true" />
      </button>
    </div>
  );
}
