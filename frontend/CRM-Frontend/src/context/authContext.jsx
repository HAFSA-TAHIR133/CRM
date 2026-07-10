// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext(null);

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUserFromToken = (token) => {
    if (!token) return null;
    try {
      const decoded = jwtDecode(token);
      return {
        id: decoded.id || decoded.userId,
        email: decoded.email,
        role: (decoded.role || 'user').toLowerCase(),
        name: decoded.name || 'CRM User',
        ...decoded
      };
    } catch (error) {
      console.error("JWT decode failed:", error);
      return null;
    }
  };

  // Initialize auth on mount
  useEffect(() => {
    const initializeAuth = () => {
      const token = localStorage.getItem('token') || localStorage.getItem('accessToken');
      if (token) {
        const userData = loadUserFromToken(token);
        if (userData) {
          setUser(userData);
          // Sync role to localStorage for sidebar protection
          localStorage.setItem('role', userData.role);
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const handleLogin = (token, userDataFromApi = null) => {
    localStorage.setItem('token', token);
    localStorage.setItem('accessToken', token);

    const userData = userDataFromApi || loadUserFromToken(token);
    
    if (userData) {
      userData.role = (userData.role || 'user').toLowerCase();
      setUser(userData);
      localStorage.setItem('role', userData.role);
      localStorage.setItem('userName', userData.name);
      localStorage.setItem('userId', userData.id);
      localStorage.setItem('email', userData.email);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
  };

  const updateUserProfile = (profileData) => {
    if (!profileData) return;
    const normalized = {
      ...profileData,
      role: (profileData.role || 'user').toLowerCase(),
    };
    setUser((prev) => ({ ...prev, ...normalized }));
    localStorage.setItem('user', JSON.stringify(normalized));
    localStorage.setItem('userName', normalized.name || '');
    localStorage.setItem('email', normalized.email || '');
    localStorage.setItem('role', normalized.role);
    if (normalized.avatar) localStorage.setItem('avatar', normalized.avatar);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      handleLogin, 
      handleLogout,
      updateUserProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within AuthContextProvider");
  }
  return context;
};