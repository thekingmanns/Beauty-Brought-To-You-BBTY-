import React, { Component, ErrorInfo, ReactNode } from 'react';
import { RefreshCw, ShieldAlert, Trash2 } from 'lucide-react';

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.warn("ErrorBoundary caught an uncaught React runtime error:", error, errorInfo);
  }

  private handleReload = () => {
    try {
      window.location.reload();
    } catch (e) {
      console.warn("Could not reload page inside sandboxed frame:", e);
    }
  };

  private handleReset = () => {
    try {
      // Safely clear all BBTY cached data that could trigger render/parse errors
      localStorage.removeItem('bbty_accessibility_preferences');
      localStorage.removeItem('bbty_waitlist_db');
      localStorage.removeItem('bbty_shares_count');
      localStorage.removeItem('bbty_advocate_submissions');
      localStorage.removeItem('bbty_referral_clicks');
      sessionStorage.clear();
      
      // Reload page to start with pristine state
      window.location.reload();
    } catch (e) {
      console.warn("Reset & reload failed inside sandbox:", e);
    }
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div id="error-boundary-screen" className="min-h-screen w-full flex items-center justify-center bg-slate-50 dark:bg-[#0c101d] px-6 py-12 font-sans">
          <div className="w-full max-w-md bg-white dark:bg-[#13192c] rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 p-8 text-center relative overflow-hidden">
            {/* Background glowing subtle ambient accent */}
            <div className="absolute top-0 left-12 w-48 h-48 bg-gradient-to-tr from-pink-500/10 to-purple-500/10 rounded-full blur-2xl pointer-events-none" />
            
            <div className="flex justify-center mb-6 relative">
              <div className="p-4 bg-pink-50 dark:bg-pink-950/30 rounded-2xl text-pink-500 dark:text-pink-400">
                <ShieldAlert className="w-12 h-12 stroke-[1.5]" />
              </div>
            </div>

            <h1 className="text-2xl font-semibold text-slate-900 dark:text-white tracking-tight mb-3">
              Application Refreshed Quietly
            </h1>
            
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
              A temporary rendering glitch was safely intercepted. Under our high accessibility and security layer, we protect your session safety automatically.
            </p>

            {this.state.error?.message && (
              <div className="mb-6 p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 font-mono text-xs text-left text-slate-500 dark:text-slate-400 border border-slate-100 dark:border-slate-800 break-all overflow-auto max-h-32">
                <span className="text-pink-500 font-semibold uppercase tracking-wider text-[10px]">Registry Alert:</span>
                <p className="mt-1">{this.state.error.message}</p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={this.handleReload}
                className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-medium text-sm transition-colors shadow-lg shadow-pink-600/10 focus:outline-none focus:ring-2 focus:ring-pink-500 cursor-pointer"
              >
                <RefreshCw className="w-4 h-4 animate-spin-hover" />
                Reload Application
              </button>
              
              <button
                type="button"
                onClick={this.handleReset}
                className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-medium text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-slate-500 cursor-pointer"
                title="Clears diagnostic cache to fix persistent reload loops"
              >
                <Trash2 className="w-4 h-4" />
                Reset Cache
              </button>
            </div>

            <div className="mt-6 text-[11px] text-slate-400 dark:text-slate-500 font-mono">
              Secure Sandbox Session Protected
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
