import { createContext, useCallback, useContext, useMemo, useState } from 'react';

const ThemeContext = createContext(null);

const STORAGE_KEY = 'prism-dex-theme';

export function ThemeProvider({ children }) {
  const [mode, setMode] = useState(() => {
    const s = localStorage.getItem(STORAGE_KEY);
    return s === 'light' ? 'light' : 'dark';
  });

  const setTheme = useCallback((next) => {
    const m = next === 'light' ? 'light' : 'dark';
    setMode(m);
    localStorage.setItem(STORAGE_KEY, m);
    const root = document.documentElement;
    if (m === 'light') {
      root.classList.add('theme-light');
      root.classList.remove('dark');
    } else {
      root.classList.add('dark');
      root.classList.remove('theme-light');
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(mode === 'dark' ? 'light' : 'dark');
  }, [mode, setTheme]);

  const value = useMemo(
    () => ({ mode, setTheme, toggleTheme, isDark: mode === 'dark' }),
    [mode, setTheme, toggleTheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme dentro de ThemeProvider');
  return ctx;
}
