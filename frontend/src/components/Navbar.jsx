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
    // Updated background to Deep Green (Money Color)
    <nav className="bg-green-900 text-white p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <Link
          to={user ? (user.role === 'admin' ? '/admin' : '/dashboard') : '/'}
          className="flex items-center space-x-3 group"
        >
          {/* Ensure you have logo1.png in your public folder */}
          <img
            src="/logo1.png" 
            alt="FinGrow Logo"
            className="w-12 h-12 rounded-full object-cover border-2 border-yellow-500" 
          />
          <div className="flex flex-col leading-tight">
             {/* Gold Color for Brand Name */}
            <span className="text-2xl font-bold text-yellow-400 group-hover:text-white transition-colors duration-300">
              FinGrow
            </span>
            <span className="text-sm italic text-yellow-100/80">
              Empowering Your Financial Growth.
            </span>
          </div>
        </Link>

        <div className="space-x-6 flex items-center">
          {user ? (
            // --- LOGGED-IN VIEW ---
            <>
              {user.role === 'admin' ? (
                <Link to="/admin" className="text-lg text-gray-100 hover:text-yellow-400 transition-colors">
                  Admin Dashboard
                </Link>
              ) : (
                <>
                  <Link to="/dashboard" className="text-lg text-gray-100 hover:text-yellow-400 transition-colors">
                    Dashboard
                  </Link>
                  <Link to="/savings" className="text-lg text-gray-100 hover:text-yellow-400 transition-colors">
                    Save
                  </Link>
                  <Link to="/request-loan" className="text-lg text-gray-100 hover:text-yellow-400 transition-colors">
                    Get Loan
                  </Link>
                </>
              )}
              <button
                onClick={handleLogout}
                // Red for logout is standard, but styled to fit the dark theme
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition shadow-sm font-medium"
              >
                Logout
              </button>
            </>
          ) : (
            // --- LOGGED-OUT VIEW ---
            <>
              <Link to="/#about" className="text-lg text-gray-100 hover:text-yellow-400 transition-colors">
                About
              </Link>
              <Link to="/contact" className="text-lg text-gray-100 hover:text-yellow-400 transition-colors">
                Contact
              </Link>
              <Link
                to="/login"
                // Gold Button for Login
                className="bg-yellow-500 text-green-900 px-5 py-2 rounded-md text-lg font-bold hover:bg-yellow-400 transition shadow-md"
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