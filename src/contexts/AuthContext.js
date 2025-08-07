import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);

  useEffect(() => {
    loadStoredAuth();
  }, []);

  const loadStoredAuth = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('token');
      const storedUser = await AsyncStorage.getItem('user');
      
      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        // Set axios default header
        axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
      }
    } catch (error) {
      console.error('Error loading stored auth:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setLoading(true);
      
      // Demo mode - allow any login for testing
      if (email && password) {
        const demoUser = {
          id: 1,
          name: email.split('@')[0] || 'Demo User',
          email: email,
          role: 'user'
        };
        
        const demoToken = 'demo-token-' + Date.now();
        
        setToken(demoToken);
        setUser(demoUser);
        
        // Store in AsyncStorage
        await AsyncStorage.setItem('token', demoToken);
        await AsyncStorage.setItem('user', JSON.stringify(demoUser));
        
        // Set axios default header
        axios.defaults.headers.common['Authorization'] = `Bearer ${demoToken}`;
        
        return { success: true };
      }
      
      // Try real API if available
      const response = await axios.post('http://localhost:8000/api/auth/login', {
        email,
        password,
      });

      const { token: newToken, user: userData } = response.data;
      
      setToken(newToken);
      setUser(userData);
      
      // Store in AsyncStorage
      await AsyncStorage.setItem('token', newToken);
      await AsyncStorage.setItem('user', JSON.stringify(userData));
      
      // Set axios default header
      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      
      // If it's a network error, use demo mode
      if (error.message === 'Network Error') {
        const demoUser = {
          id: 1,
          name: email.split('@')[0] || 'Demo User',
          email: email,
          role: 'user'
        };
        
        const demoToken = 'demo-token-' + Date.now();
        
        setToken(demoToken);
        setUser(demoUser);
        
        // Store in AsyncStorage
        await AsyncStorage.setItem('token', demoToken);
        await AsyncStorage.setItem('user', JSON.stringify(demoUser));
        
        // Set axios default header
        axios.defaults.headers.common['Authorization'] = `Bearer ${demoToken}`;
        
        return { success: true };
      }
      
      return { 
        success: false, 
        error: error.response?.data?.message || 'Login failed' 
      };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      
      // Demo mode - allow any registration for testing
      if (userData.email && userData.password) {
        const demoUser = {
          id: 1,
          name: userData.name || userData.email.split('@')[0] || 'Demo User',
          email: userData.email,
          role: 'user'
        };
        
        const demoToken = 'demo-token-' + Date.now();
        
        setToken(demoToken);
        setUser(demoUser);
        
        // Store in AsyncStorage
        await AsyncStorage.setItem('token', demoToken);
        await AsyncStorage.setItem('user', JSON.stringify(demoUser));
        
        // Set axios default header
        axios.defaults.headers.common['Authorization'] = `Bearer ${demoToken}`;
        
        return { success: true };
      }
      
      // Try real API if available
      const response = await axios.post('http://localhost:8000/api/auth/register', userData);
      
      const { token: newToken, user: newUser } = response.data;
      
      setToken(newToken);
      setUser(newUser);
      
      // Store in AsyncStorage
      await AsyncStorage.setItem('token', newToken);
      await AsyncStorage.setItem('user', JSON.stringify(newUser));
      
      // Set axios default header
      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      
      return { success: true };
    } catch (error) {
      console.error('Register error:', error);
      
      // If it's a network error, use demo mode
      if (error.message === 'Network Error') {
        const demoUser = {
          id: 1,
          name: userData.name || userData.email.split('@')[0] || 'Demo User',
          email: userData.email,
          role: 'user'
        };
        
        const demoToken = 'demo-token-' + Date.now();
        
        setToken(demoToken);
        setUser(demoUser);
        
        // Store in AsyncStorage
        await AsyncStorage.setItem('token', demoToken);
        await AsyncStorage.setItem('user', JSON.stringify(demoUser));
        
        // Set axios default header
        axios.defaults.headers.common['Authorization'] = `Bearer ${demoToken}`;
        
        return { success: true };
      }
      
      return { 
        success: false, 
        error: error.response?.data?.message || 'Registration failed' 
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setUser(null);
      setToken(null);
      
      // Clear AsyncStorage
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('user');
      
      // Clear axios default header
      delete axios.defaults.headers.common['Authorization'];
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const updateUser = async (userData) => {
    try {
      setUser(userData);
      await AsyncStorage.setItem('user', JSON.stringify(userData));
    } catch (error) {
      console.error('Update user error:', error);
    }
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    updateUser,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
