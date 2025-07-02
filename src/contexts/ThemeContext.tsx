
import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isDark: boolean;
  toggleTheme: () => void;
  getThemeIcon: () => string;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>('system');
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('baapmail-theme') as Theme;
    if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
      setTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('baapmail-theme', theme);
    
    const updateTheme = () => {
      const root = document.documentElement;
      
      if (theme === 'dark') {
        setIsDark(true);
        root.classList.add('dark');
        root.style.colorScheme = 'dark';
      } else if (theme === 'light') {
        setIsDark(false);
        root.classList.remove('dark');
        root.style.colorScheme = 'light';
      } else {
        // system
        const isDarkSystem = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setIsDark(isDarkSystem);
        root.style.colorScheme = isDarkSystem ? 'dark' : 'light';
        
        if (isDarkSystem) {
          root.classList.add('dark');
        } else {
          root.classList.remove('dark');
        }
      }
    };

    updateTheme();

    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => updateTheme();
      
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [theme]);

  const toggleTheme = () => {
    const themes: Theme[] = ['light', 'dark', 'system'];
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
  };

  const getThemeIcon = () => {
    switch (theme) {
      case 'light':
        return '☀️';
      case 'dark':
        return '🌙';
      case 'system':
        return '🖥️';
      default:
        return '🖥️';
    }
  };

  return (
    <ThemeContext.Provider value={{ 
      theme, 
      setTheme, 
      isDark, 
      toggleTheme, 
      getThemeIcon 
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
