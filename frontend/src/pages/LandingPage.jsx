import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

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
    <div className="flex flex-col">
      
      {/* --- HERO SECTION --- */}
      <section 
        className="relative pt-24 md:pt-36 pb-20 bg-cover bg-center"
        style={{ backgroundImage: "url('/money-bg.png')" }}
      >
        {/* Deep Green Overlay to make text readable */}
        <div className="absolute inset-0 bg-green-900 opacity-80"></div>

        <div className="relative z-10 container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-yellow-400 mb-6 drop-shadow-lg">
            Grow Your
            <br />
            Financial Future
          </h1>
          
          <p className="text-lg text-gray-100 max-w-2xl mx-auto mb-8 font-medium leading-relaxed">
            Simplify your financial life with FinGrow. FinGrow gives you the 
            power to make seamless savings deposits, apply for loans in minutes, 
            and monitor your complete financial picture with easy-to-use 
            tracking tools. Get started today and watch your savings grow.
          </p>
          
          <Link
            to="/register" 
            className="inline-block bg-yellow-500 text-green-900 font-bold px-8 py-3 rounded-md text-lg hover:bg-yellow-400 transition shadow-lg transform hover:-translate-y-1"
          >
            Get Started
          </Link>
        </div>
      </section>

      {/* --- FEATURES SECTION --- */}
      <section className="py-16 bg-white text-center">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Feature 1: Savings */}
          <div className="flex flex-col items-center group hover:bg-green-50 p-4 rounded-lg transition duration-300">
            <img src="/savings.png" alt="Savings" className="h-24 mb-4 transition-transform group-hover:scale-110" />
            <h3 className="text-2xl font-semibold mb-2 text-green-900">Savings</h3>
            <p className="text-gray-600">Automate your savings easily.</p>
          </div>

          {/* Feature 2: Financial Growth */}
          <div className="flex flex-col items-center group hover:bg-green-50 p-4 rounded-lg transition duration-300">
            <img src="/financial-growth.png" alt="Financial Growth" className="h-24 mb-4 transition-transform group-hover:scale-110" />
            <h3 className="text-2xl font-semibold mb-2 text-green-900">Financial Growth</h3>
            <p className="text-gray-600">Watch your investments grow.</p>
          </div>

          {/* Feature 3: Tracking */}
          <div className="flex flex-col items-center group hover:bg-green-50 p-4 rounded-lg transition duration-300">
            <img src="/image.png" alt="Tracking" className="h-24 mb-4 transition-transform group-hover:scale-110" />
            <h3 className="text-2xl font-semibold mb-2 text-green-900">Tracking</h3>
            <p className="text-gray-600">Track all your finances in one place.</p>
          </div>

          {/* Feature 4: Loans */}
          <div className="flex flex-col items-center group hover:bg-green-50 p-4 rounded-lg transition duration-300">
            <img src="/loan.png" alt="Loans" className="h-24 mb-4 transition-transform group-hover:scale-110" />
            <h3 className="text-2xl font-semibold mb-2 text-green-900">Loans</h3>
            <p className="text-gray-600">Access loans at fair rates.</p>
          </div>
        </div>
      </section>

      {/* --- "ABOUT US" SECTION --- */}
      <section id="about" className="py-24 bg-green-900 text-white">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="text-3xl font-bold text-yellow-400 mb-6">Our Mission</h2>
          <p className="text-lg text-gray-200 mb-8 leading-relaxed">
            At FinGrow, our mission is to provide accessible and robust financial tools that empower our members. 
            We are committed to building a platform that fosters financial literacy, security, and long-term 
            stability for individuals and groups.
          </p>
          
          <h3 className="text-2xl font-bold text-yellow-400 mb-4">Why Choose Us?</h3>
          <p className="text-lg text-gray-200 leading-relaxed">
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