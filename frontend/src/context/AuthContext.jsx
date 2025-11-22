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

  // Redirect Logic: only for protected routes
  useEffect(() => {
    if (loading) return; // wait until user data is loaded

    const publicRoutes = ['/', '/login', '/register', '/about', '/contact'];
    // Check if the current path starts with a public route
    const isPublic = publicRoutes.some(route => location.pathname === route);


    // If user is not logged in and tries to access a private route
    if (!user && !isPublic) {
      // console.log('--- REDIRECTING TO /login ---');
      navigate('/login');
    }
  }, [user, loading, location.pathname, navigate]);

  const login = async (email, password) => {
    const { data } = await api.post('/api/auth/login', { email, password });
    localStorage.setItem('userInfo', JSON.stringify(data));
    setUser(data);
    return data; // Return data for LoginPage to handle redirect
  };

  const register = async (name, email, phone, password) => {
    // No longer auto-logs in, just creates the user
    await api.post('/api/auth/register', {
      name,
      email,
      phone,
      password,
    });
  };

  const logout = () => {
    localStorage.removeItem('userInfo');
    setUser(null);
    navigate('/'); // Redirect to the landing page
  };

  // New function to manually refresh user data from DB
  const refreshUser = async () => {
    try {
      const { data } = await api.get('/api/users/profile');
      localStorage.setItem('userInfo', JSON.stringify(data)); // Update localStorage
      setUser(data); // Update state
      return data; // Return the fresh data
    } catch (error) {
      console.error('Failed to refresh user', error);
      // Don't log out, just fail silently
      return user; // Return old user data if refresh fails
    }
  };


  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading, refreshUser }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);