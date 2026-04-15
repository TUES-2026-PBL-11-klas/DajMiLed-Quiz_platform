"use client";

import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';

type ToastType = 'success' | 'error' | 'info';

interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  addToast: (message: string, type?: ToastType) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const addToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);
    
    setTimeout(() => {
      removeToast(id);
    }, 5000);
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 pointer-events-none">
        {toasts.map(toast => (
          <div 
            key={toast.id}
            className={`pointer-events-auto px-6 py-4 rounded-xl shadow-lg transform transition-all duration-300 translate-y-0 opacity-100 flex items-center justify-between min-w-[300px] border glass-overlay ${
              toast.type === 'error' 
                ? 'bg-error-container text-on-error-container border-error/20' 
                : toast.type === 'success'
                  ? 'bg-secondary-container text-on-secondary-container border-secondary/20'
                  : 'bg-surface-container-highest text-on-surface border-outline-variant/20'
            }`}
          >
            <span className="font-body text-sm font-medium">{toast.message}</span>
            <button 
              onClick={() => removeToast(toast.id)}
              className="ml-4 opacity-50 hover:opacity-100 transition-opacity"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
};
