import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { AccessibilityProvider } from './context/AccessibilityContext.tsx';
import { ToastProvider } from './context/ToastContext.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AccessibilityProvider>
      <ToastProvider>
        <App />
      </ToastProvider>
    </AccessibilityProvider>
  </StrictMode>,
);
