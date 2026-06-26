import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, X, Lock, CheckCircle } from 'lucide-react';

interface SecurityModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SecurityModal({ isOpen, onClose }: SecurityModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/60 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: 50, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 20, opacity: 0, scale: 0.95 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-lg border border-slate-100 dark:border-slate-800 overflow-hidden relative"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 p-6 sm:p-8 flex items-start justify-between border-b border-emerald-100 dark:border-emerald-900/50">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/50 rounded-2xl flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                  Verified Secure Profile
                </h3>
                <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1.5">
                  <Lock className="w-4 h-4" />
                  256-bit SSL/HTTPS Encryption
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white bg-white/50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 rounded-full transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 sm:p-8 space-y-6 max-h-[60vh] overflow-y-auto">
            <div className="space-y-4">
              <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                Sometimes you may see a temporary "unsafe site" warning due to our cloud-native infrastructure setup. Please rest assured: your connection to Beauty Brought To You is fully encrypted, completely private, and secure.
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider font-mono border-b border-slate-100 dark:border-slate-800 pb-2">
                Our Security Standards
              </h4>
              <ul className="space-y-3">
                {[
                  "We use industry-standard TLS 1.3 encryption for all traffic.",
                  "We do not process credit cards or sensitive medical data on this informational preview domain.",
                  "We use Google Cloud Run infrastructure that enforces strict HTTPS protocol policies.",
                  "We routinely monitor infrastructure and ensure zero unencrypted traffic leaves the network."
                ].map((item, idx) => (
                  <li key={idx} className="flex gap-3 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-700/50">
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed text-center">
                If you continue to experience security warnings or errors on your browser, please ensure your system date/time is correct and clear your browser cache.
              </p>
            </div>
          </div>

          <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl text-sm font-bold shadow-sm hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              Understood
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
