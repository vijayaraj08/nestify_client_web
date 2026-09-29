import React, { createContext, useContext, useState, useEffect } from 'react';
import cacheService, { CACHE_KEYS } from '../services/cacheService';
import { updateSettingSection } from '../services/settingsService';

const ThemeContext = createContext({
  theme: 'light',
  isDark: false,
  accentColor: 'indigo',
  setTheme: () => {},
  setAccentColor: () => {},
  toggleTheme: () => {},
});

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(() => {
    return cacheService.getTheme('light');
  });

  const [accentColor, setAccentState] = useState(() => {
    return cacheService.getAccent('indigo');
  });

  const [isDark, setIsDark] = useState(false);

  // Sync theme mode to DOM and cache
  const applyTheme = (mode) => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const dark = mode === 'dark' || (mode === 'system' && prefersDark);
    setIsDark(dark);
    document.documentElement.classList.toggle('dark', dark);
    cacheService.setTheme(mode);
  };

  // Sync brand accent to DOM and cache
  const applyAccent = (color) => {
    document.documentElement.setAttribute('data-accent', color);
    cacheService.setAccent(color);
  };

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  useEffect(() => {
    applyAccent(accentColor);
  }, [accentColor]);

  // Listen for OS system theme changes if in 'system' mode
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (theme === 'system') {
        applyTheme('system');
      }
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  const setTheme = (newTheme) => {
    setThemeState(newTheme);
    applyTheme(newTheme);

    // Background sync to database if user is logged in
    const user = cacheService.get(CACHE_KEYS.AUTH_USER);
    if (user) {
      updateSettingSection(user, 'appearance', { theme: newTheme }).catch(() => {});
    }
  };

  const setAccentColor = (newAccent) => {
    setAccentState(newAccent);
    applyAccent(newAccent);

    // Background sync to database if user is logged in
    const user = cacheService.get(CACHE_KEYS.AUTH_USER);
    if (user) {
      updateSettingSection(user, 'appearance', { accentColor: newAccent }).catch(() => {});
    }
  };

  const toggleTheme = () => {
    const nextTheme = isDark ? 'light' : 'dark';
    setTheme(nextTheme);
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        isDark,
        accentColor,
        setTheme,
        setAccentColor,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

export default ThemeContext;
