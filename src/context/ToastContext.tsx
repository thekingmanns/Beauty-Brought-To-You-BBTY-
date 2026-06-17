import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

interface ToastContextType {
  addToast: (message: string, type: ToastType, duration?: number) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const addToast = useCallback((message: string, type: ToastType, duration = 4000) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type, duration }]);

    setTimeout(() => {
      removeToast(id);
    }, duration);
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      
      {/* Toast Portal/Container with high z-index */}
      <div 
        className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 max-w-sm w-full pointer-events-none"
        id="toast-notifications-container"
      >
        <AnimatePresence mode="popLayout">
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              layout
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, y: -20, transition: { duration: 0.2 } }}
              className="pointer-events-auto"
            >
              <div
                className={`w-full p-4 rounded-2xl border shadow-2xl flex gap-3 text-left items-start backdrop-blur-md relative overflow-hidden transition-all group ${
                  toast.type === 'success'
                    ? 'bg-slate-900 border-emerald-500/30 text-white dark:bg-slate-950 dark:border-emerald-500/40'
                    : toast.type === 'error'
                    ? 'bg-slate-900 border-rose-500/30 text-white dark:bg-slate-950 dark:border-rose-500/40'
                    : 'bg-slate-900 border-indigo-500/30 text-white dark:bg-slate-100 dark:bg-slate-950 dark:border-indigo-500/45'
                }`}
                role="alert"
              >
                {/* Visual Accent Bar */}
                <div 
                  className={`absolute left-0 top-0 bottom-0 w-1.5 ${
                    toast.type === 'success' 
                      ? 'bg-emerald-500' 
                      : toast.type === 'error' 
                      ? 'bg-rose-500' 
                      : 'bg-indigo-500'
                  }`}
                />

                {/* Icon wrapper */}
                <div className={`p-1.5 rounded-xl shrink-0 ${
                  toast.type === 'success'
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : toast.type === 'error'
                    ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                    : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                }`}>
                  {toast.type === 'success' && <CheckCircle2 className="w-4 h-4" />}
                  {toast.type === 'error' && <AlertCircle className="w-4 h-4" />}
                  {toast.type === 'info' && <Info className="w-4 h-4" />}
                </div>

                {/* Text Content */}
                <div className="flex-1 pr-6 self-center">
                  <p className="text-xs font-semibold leading-relaxed text-slate-100">
                    {toast.message}
                  </p>
                </div>

                {/* Dismiss Button */}
                <button
                  type="button"
                  onClick={() => removeToast(toast.id)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-white transition-all rounded-lg p-1 hover:bg-white/5 cursor-pointer active:scale-95"
                  aria-label="Close notification"
                >
                  <X className="w-3.5 h-3.5" />
                </button>

                {/* Background glow matching the notification vibe */}
                <div className={`absolute -right-12 -bottom-12 w-24 h-24 rounded-full blur-2xl opacity-10 pointer-events-none transition-transform duration-500 group-hover:scale-125 ${
                  toast.type === 'success' 
                    ? 'bg-emerald-500' 
                    : toast.type === 'error' 
                    ? 'bg-rose-500' 
                    : 'bg-indigo-500'
                }`} />
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
