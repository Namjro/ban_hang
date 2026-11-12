'use client';

import React, { createContext, useCallback, useContext, useState } from 'react';
import { CheckCircle2, AlertTriangle, Info, X, AlertCircle } from 'lucide-react';

export type ToastVariant = 'success' | 'error' | 'warning' | 'info';

interface ToastItem {
  id: string;
  title?: string;
  message: string;
  variant: ToastVariant;
}

interface ToastContextValue {
  showToast: (message: string, variant?: ToastVariant, title?: string) => void;
  success: (message: string, title?: string) => void;
  error: (message: string, title?: string) => void;
  warning: (message: string, title?: string) => void;
  info: (message: string, title?: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const VARIANT_STYLES: Record<ToastVariant, { container: string; icon: React.ReactNode }> = {
  success: {
    container: 'bg-surface border-emerald-500 text-ink',
    icon: <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />,
  },
  error: {
    container: 'bg-surface border-red-500 text-ink',
    icon: <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />,
  },
  warning: {
    container: 'bg-surface border-amber-500 text-ink',
    icon: <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />,
  },
  info: {
    container: 'bg-navy-900 border-line-dark text-white',
    icon: <Info className="w-5 h-5 text-amber-500 shrink-0" />,
  },
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const showToast = useCallback(
    (message: string, variant: ToastVariant = 'info', title?: string) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      setToasts((prev) => [...prev.slice(-3), { id, title, message, variant }]);
      window.setTimeout(() => {
        removeToast(id);
      }, 4500);
    },
    [removeToast]
  );

  const value: ToastContextValue = {
    showToast,
    success: (message, title) => showToast(message, 'success', title),
    error: (message, title) => showToast(message, 'error', title),
    warning: (message, title) => showToast(message, 'warning', title),
    info: (message, title) => showToast(message, 'info', title),
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        aria-live="polite"
        aria-atomic="true"
        className="fixed top-4 right-4 z-[100] flex flex-col gap-2.5 max-w-sm w-[calc(100vw-2rem)] pointer-events-none"
      >
        {toasts.map((toast) => {
          const style = VARIANT_STYLES[toast.variant];
          return (
            <div
              key={toast.id}
              role="status"
              className={`pointer-events-auto flex items-start gap-3 p-4 rounded-[4px] border-l-4 border border-line shadow-axiom-modal transition-all ${style.container}`}
            >
              {style.icon}
              <div className="flex-1 min-w-0 text-[13px] leading-relaxed">
                {toast.title && <p className="font-semibold mb-0.5">{toast.title}</p>}
                <p className={toast.variant === 'info' ? 'text-ink-subtle' : 'text-ink-muted'}>
                  {toast.message}
                </p>
              </div>
              <button
                type="button"
                onClick={() => removeToast(toast.id)}
                aria-label="Đóng thông báo"
                className="p-1 rounded-[4px] opacity-70 hover:opacity-100 transition-opacity shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return ctx;
}
