import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

// ... (Placeholder components remain the same)
// ...

const LandingPage = () => {
  const location = useLocation(); // Get the current URL location

  // This hook will run when the page loads or the URL hash changes
  useEffect(() => {
    if (location.hash === '#about') {
      const el = document.getElementById('about');
      if (el) {
        // Scroll to the "about" section smoothly
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [location.hash]); // Re-run only if the hash changes

  return (
    <div className="text-center">
      {/* Hero Section */}
      <section className="pt-24 md:pt-32 pb-16 bg-white">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6">
          Grow Your
          <br />
          Financial Future
        </h1>
              
        <p className="text-lg text-gray-800 max-w-2xl mx-auto mb-8">
          Simplify your financial life with FinGrow. FinGrow gives you the 
          power to make seamless savings deposits, apply for loans in minutes, 
          and monitor your complete financial picture with easy-to-use 
          tracking tools. Get started today and watch your savings grow.
        </p>
              
        <Link
          to="/register" 
          className="bg-blue-400 text-white font-semibold px-8 py-3 rounded-md text-lg hover:bg-yellow-300 transition block w-fit mx-auto" >
          Get Started
        </Link>
      </section>

      {/* Features Section */}
      <section className="py-14 bg-gray-50">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Feature 1: Savings */}
          <div className="flex flex-col items-center">
            <img src="/savings.png" alt="Savings" className="h-23 mb-4" />
            <h3 className="text-2xl font-semibold mb-2">Savings</h3>
            <p className="text-gray-600">Automate your savings easily.</p>
          </div>

          {/* Feature 2: Financial Growth */}
          <div className="flex flex-col items-center">
            <img src="/financial-growth.png" alt="Financial Growth" className="h-23 mb-4" />
            <h3 className="text-2xl font-semibold mb-2">Financial Growth</h3>
            <p className="text-gray-600">Watch your investments grow.</p>
          </div>

          {/* Feature 3: Tracking */}
          <div className="flex flex-col items-center">
            <img src="/image.png" alt="Tracking" className="h-23 mb-4" />
            <h3 className="text-2xl font-semibold mb-2">Tracking</h3>
            <p className="text-gray-600">Track all your finances in one place.</p>
          </div>

          {/* Feature 4: Loans */}
          <div className="flex flex-col items-center">
            <img src="/loan.png" alt="Loans" className="h-23 mb-4" />
            <h3 className="text-2xl font-semibold mb-2">Loans</h3>
            <p className="text-gray-600">Access loans at fair rates.</p>
          </div>
        </div>
      </section>

      {/* --- "ABOUT US" SECTION (FIXED) --- */}
      {/* I have added the id="about" here so the link will work */}
      <section id="about" className="py-24 bg-white">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Our Mission</h2>
          <p className="text-lg text-gray-600 mb-8">
            At FinGrow, our mission is to provide accessible and robust financial tools that empower our members. 
            We are committed to building a platform that fosters financial literacy, security, and long-term 
            stability for individuals and groups.
          </p>
          
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Why Choose Us?</h3>
          <p className="text-lg text-gray-600">
            We operate on a foundation of transparency and trust. Unlike traditional systems, FinGrow is 
            built to serve its members, offering a clear path to financial independence. We are more 
            than just an app; we are your partner in building a secure and prosperous future.
          </p>
        </div>
      </section>

      
    </div>
  );
};

export default LandingPage;

