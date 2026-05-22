import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { THEME_COLORS, ThemeType } from '../constants/theme';

const THEME_STORAGE_KEY = '@myst_theme_preference';

interface ThemeContextType {
  theme: ThemeType;
  colors: typeof THEME_COLORS.dark;
  isDark: boolean;
  isHighContrast: boolean;
  setTheme: (theme: ThemeType) => Promise<void>;
  toggleTheme: () => Promise<void>;
  toggleHighContrast: () => Promise<void>;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [theme, setInternalTheme] = useState<ThemeType>('dark');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (savedTheme === 'dark' || savedTheme === 'light' || savedTheme === 'highContrast') {
          setInternalTheme(savedTheme as ThemeType);
        } else {
          // Default to system or dark
          setInternalTheme(systemColorScheme === 'light' ? 'light' : 'dark');
        }
      } catch (e) {
        console.error('Failed to load theme', e);
      } finally {
        setIsLoaded(true);
      }
    };
    loadTheme();
  }, []);

  const colors = useMemo(() => THEME_COLORS[theme], [theme]);
  const isDark = theme === 'dark' || theme === 'highContrast';
  const isHighContrast = theme === 'highContrast';

  const setTheme = async (newTheme: ThemeType) => {
    setInternalTheme(newTheme);
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, newTheme);
    } catch (e) {
      console.error('Failed to save theme', e);
    }
  };

  const toggleTheme = async () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    await setTheme(newTheme);
  };

  const toggleHighContrast = async () => {
    const newTheme = theme === 'highContrast' ? (systemColorScheme === 'light' ? 'light' : 'dark') : 'highContrast';
    await setTheme(newTheme);
  };

  const contextValue = useMemo(() => ({
    theme,
    colors,
    isDark,
    isHighContrast,
    setTheme,
    toggleTheme,
    toggleHighContrast,
  }), [theme, colors, isDark, isHighContrast]);

  if (!isLoaded) return null; // Or a splash screen

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
