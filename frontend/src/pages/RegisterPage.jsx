import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await register(name, email, phone, password);
      navigate('/login'); // Redirect to login after register
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    // --- BACKGROUND CONTAINER ---
    <div 
      className="w-full min-h-[80vh] flex items-center justify-center bg-cover bg-center relative py-12"
      style={{ backgroundImage: "url('/money-bg.png')" }} 
    >
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black opacity-40"></div>

      {/* Form Container */}
      <div className="relative z-10 max-w-md w-full m-4 p-8 border border-yellow-200 rounded-lg shadow-2xl bg-white">
        
        {/* Gold Heading */}
        <h1 className="text-3xl font-bold mb-6 text-center text-yellow-700">
          Create Your Account
        </h1>
        
        {error && (
          <div className="bg-red-100 text-red-700 p-3 mb-4 rounded border border-red-200">{error}</div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-yellow-700 font-medium">Name</label>
            <input 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              className="w-full p-3 border border-yellow-200 rounded-md mt-1 focus:ring-2 focus:ring-yellow-500 outline-none" 
              required 
            />
          </div>
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
            <label className="block text-yellow-700 font-medium">Phone (e.g., 0712345678)</label>
            <input 
              type="tel" 
              value={phone} 
              onChange={(e) => setPhone(e.target.value)} 
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
            Register
          </button>
        </form>

        <p className="text-center mt-6 text-yellow-600">
          Already have an account?{' '}
          <Link to="/login" className="text-yellow-800 hover:underline font-medium">
            Login Here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;