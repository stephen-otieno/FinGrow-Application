// frontend/src/components/Navbar.jsx

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/'); // On logout, send to the new landing page
  };

  return (
    <nav className="bg-blue-400 text-gray-800 p-4 shadow-sm">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo links to dashboard if logged in, else to landing page */}
        <Link
          to={user ? (user.role === 'admin' ? '/admin' : '/dashboard') : '/'}
          className="text-2xl font-bold text-red-700 hover:text-red-800"
        >
          FinGrow
        </Link>
        <div className="space-x-6 flex items-center">
          {user ? (
            // --- LOGGED-IN VIEW ---
            <>
              {user.role === 'admin' ? (
                <Link to="/admin" className="text-lg text-white hover:text-red-800 ">
                  Admin Dashboard
                </Link>
              ) : (
                <>
                  <Link to="/dashboard" className="text-lg text-white hover:text-red-600">
                    Dashboard
                  </Link>
                  <Link to="/savings" className="text-lg text-white hover:text-red-600">
                    Save
                  </Link>
                  <Link to="/request-loan" className="text-lg text-white hover:text-red-600">
                    Get Loan
                  </Link>
                </>
              )}
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
              >
                Logout
              </button>
            </>
          ) : (
            // --- LOGGED-OUT VIEW (as per your image) ---
            <>
               <Link to="/#about" className="text-lg hover:text-green-800">
                About
              </Link>
              <Link to="/contact" className="text-lg text-white hover:text-red-500">
                Contact
              </Link>
              <Link
                to="/login"
                className="bg-blue-600 text-white px-4 py-2 rounded-md text-lg font-medium hover:bg-blue-700"
              >
                Login / Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;