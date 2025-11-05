// frontend/src/context/AuthContext.jsx

import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../api/apiService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Load user info from localStorage on app start
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      setUser(JSON.parse(userInfo));
    }
    setLoading(false);
  }, []);

  // ✅ Optional Redirect Logic: only for protected routes
  useEffect(() => {
    if (loading) return; // wait until user data is loaded

    const publicRoutes = ['/', '/login', '/register', '/about', '/contact'];
    const isPublic = publicRoutes.includes(location.pathname);

    // If user is not logged in and tries to access a private route
    if (!user && !isPublic) {
      navigate('/login');
    }
  }, [user, loading, location.pathname, navigate]);

  const login = async (email, password) => {
    const { data } = await api.post('/api/auth/login', { email, password });
    localStorage.setItem('userInfo', JSON.stringify(data));
    setUser(data);
  };

  const register = async (name, email, phone, password) => {
    const { data } = await api.post('/api/auth/register', {
      name,
      email,
      phone,
      password,
    });
    localStorage.setItem('userInfo', JSON.stringify(data));
    setUser(data);
  };

  const logout = () => {
    localStorage.removeItem('userInfo');
    setUser(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
