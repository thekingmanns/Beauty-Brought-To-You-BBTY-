import React, { createContext, useContext, useState, useEffect } from 'react';

export interface AccessibilitySettings {
  highContrast: boolean;
  readabilityMode: boolean;
  darkMode: boolean;
}

interface AccessibilityContextType {
  settings: AccessibilitySettings;
  toggleHighContrast: () => void;
  toggleReadability: () => void;
  toggleDarkMode: () => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
};

export const AccessibilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<AccessibilitySettings>(() => {
    try {
      const saved = localStorage.getItem('bbty_accessibility_preferences');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Error parsing accessibility settings', e);
    }
    
    // Fallbacks from previous individual keys or defaults
    const legacyHighContrast = localStorage.getItem('bbty_high_contrast') === 'true';
    const legacyReadability = localStorage.getItem('bbty_readability_mode') === 'true';
    const legacyDarkMode = localStorage.getItem('bbty_dark_mode') === 'true';
    
    return {
      highContrast: legacyHighContrast,
      readabilityMode: legacyReadability,
      darkMode: legacyDarkMode,
    };
  });

  const updateSetting = (key: keyof AccessibilitySettings, value: boolean) => {
    setSettings((prev) => {
      const next = { ...prev, [key]: value };
      localStorage.setItem('bbty_accessibility_preferences', JSON.stringify(next));
      return next;
    });
  };

  const toggleHighContrast = () => updateSetting('highContrast', !settings.highContrast);
  const toggleReadability = () => updateSetting('readabilityMode', !settings.readabilityMode);
  const toggleDarkMode = () => updateSetting('darkMode', !settings.darkMode);

  // Sync state with DOM classes
  useEffect(() => {
    if (settings.highContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
  }, [settings.highContrast]);

  useEffect(() => {
    if (settings.readabilityMode) {
      document.documentElement.classList.add('readability-mode');
    } else {
      document.documentElement.classList.remove('readability-mode');
    }
  }, [settings.readabilityMode]);

  useEffect(() => {
    if (settings.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings.darkMode]);

  return (
    <AccessibilityContext.Provider value={{ settings, toggleHighContrast, toggleReadability, toggleDarkMode }}>
      {children}
    </AccessibilityContext.Provider>
  );
};
