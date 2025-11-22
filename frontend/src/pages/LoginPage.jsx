import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, user } = useAuth(); 
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    }
  }, [user, navigate]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const loggedInUser = await login(email, password); 
      if (loggedInUser.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard'); 
      }
      
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    // --- BACKGROUND CONTAINER ---
    <div 
      className="w-full min-h-[80vh] flex items-center justify-center bg-cover bg-center relative"
      style={{ backgroundImage: "url('/money-bg.png')" }} 
    >
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black opacity-40"></div>

      {/* Form Container */}
      <div className="relative z-10 max-w-md w-full m-4 p-8 border border-yellow-200 rounded-lg shadow-2xl bg-white">
        
        {/* Gold Heading */}
        <h1 className="text-3xl font-bold mb-2 text-center text-yellow-700">
          Welcome Back to FinGrow
        </h1>
        
        {/* Gold Subtext */}
        <p className="text-yellow-600 text-center mb-6">
          Log in to access your funds, make savings, and track your finances.
        </p>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 mb-4 rounded">{error}</div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-yellow-700 font-medium">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-yellow-200 rounded-md mt-1 focus:ring-2 focus:ring-yellow-500 outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-yellow-700 font-medium">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-yellow-200 rounded-md mt-1 focus:ring-2 focus:ring-yellow-500 outline-none"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-yellow-600 text-white p-3 rounded-md font-semibold hover:bg-yellow-700 transition shadow-md"
          >
            Login
          </button>
        </form>
        <p className="text-center mt-6 text-yellow-600">
          Don't have an account?{' '}
          <Link to="/register" className="text-yellow-800 hover:underline font-medium">
            Register Here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;