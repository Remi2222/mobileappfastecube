import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadThemePreference();
  }, []);

  const loadThemePreference = async () => {
    try {
      const storedTheme = await AsyncStorage.getItem('theme');
      if (storedTheme) {
        setIsDarkMode(storedTheme === 'dark');
      }
    } catch (error) {
      console.error('Error loading theme preference:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleTheme = async () => {
    try {
      const newTheme = !isDarkMode;
      setIsDarkMode(newTheme);
      await AsyncStorage.setItem('theme', newTheme ? 'dark' : 'light');
    } catch (error) {
      console.error('Error saving theme preference:', error);
    }
  };

  const theme = {
    colors: {
      primary: '#007AFF',
      secondary: '#5856D6',
      background: isDarkMode ? '#000000' : '#FFFFFF',
      surface: isDarkMode ? '#1C1C1E' : '#F2F2F7',
      text: isDarkMode ? '#FFFFFF' : '#000000',
      textSecondary: isDarkMode ? '#8E8E93' : '#6C6C70',
      border: isDarkMode ? '#38383A' : '#C6C6C8',
      error: '#FF3B30',
      success: '#34C759',
      warning: '#FF9500',
      info: '#007AFF',
    },
    spacing: {
      xs: 4,
      sm: 8,
      md: 16,
      lg: 24,
      xl: 32,
      xxl: 48,
    },
    borderRadius: {
      sm: 4,
      md: 8,
      lg: 12,
      xl: 16,
      round: 50,
    },
    typography: {
      h1: {
        fontSize: 32,
        fontWeight: 'bold',
      },
      h2: {
        fontSize: 24,
        fontWeight: 'bold',
      },
      h3: {
        fontSize: 20,
        fontWeight: '600',
      },
      body: {
        fontSize: 16,
        fontWeight: 'normal',
      },
      caption: {
        fontSize: 14,
        fontWeight: 'normal',
      },
      small: {
        fontSize: 12,
        fontWeight: 'normal',
      },
    },
  };

  const value = {
    isDarkMode,
    toggleTheme,
    theme,
    loading,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
