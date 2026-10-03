import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/auth.service';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        try {
          const userData = await authService.getCurrentUser();
          const activeUser = userData?.user || userData;
          if (activeUser) {
            setUser(activeUser);
            localStorage.setItem('user', JSON.stringify(activeUser));
          }
        } catch(e) {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('user');
        }
      } else {
        localStorage.removeItem('user');
      }
      setIsLoading(false);
    };
    initAuth();
  }, []);

  const login = async (identifier, password, organization_id = null) => {
    // Real PostgreSQL API Call:
    const data = await authService.login(identifier, password, organization_id);
    setUser(data.user);
    if (data.user) {
      localStorage.setItem('user', JSON.stringify(data.user));
    }
    return data;
  };

  const logout = async () => {
    await authService.logout();
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
