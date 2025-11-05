import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    // Changed bg-gray-800 to bg-green-800 and text-gray-400 to text-gray-200 for better contrast
    <footer className="bg-blue-400 text-gray-200 py-12">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Column 1: Brand and Copyright */}
        <div>
          <h3 className="text-2xl font-bold text-white mb-2">FinGrow</h3>
          <p className="text-sm">
            &copy; {new Date().getFullYear()} FinGrow. All rights reserved.
          </p>
          <p className="text-sm mt-2">
            Managing your finances, securing your future.
          </p>
        </div>
        
        {/* Column 2: Quick Links */}
        <div>
          <h4 className="text-lg font-semibold text-white mb-4">Quick Links</h4>
          <ul className="space-y-2">
            <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
            <li><Link to="/about" className="hover:text-white transition-colors">About</Link></li>
            <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
            <li><Link to="/login" className="hover:text-white transition-colors">Login</Link></li>
            <li><Link to="/register" className="hover:text-white transition-colors">Register</Link></li>
          </ul>
        </div>

         <div>
          <h4 className="text-lg font-semibold text-white mb-4">Follow Us</h4>
          {/* Changed 'flex space-x-4' to 'flex flex-col space-y-2' for a vertical layout */}
          <div className="flex flex-col space-y-2">
            {/* Replace '#' with your actual social media links */}
            <a href="#" className="hover:text-white transition-colors">Facebook</a>
            <a href="#" className="hover:text-white transition-colors">Twitter</a>
            <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;

