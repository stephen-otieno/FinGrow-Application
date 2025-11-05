import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardUserPage from './pages/DashboardUserPage';
import DashboardAdminPage from './pages/DashboardAdminPage';
import SavingsPage from './pages/SavingsPage';
import LoanRequestPage from './pages/LoanRequestPage';
import ContactPage from './pages/ContactPage';

// Simple placeholder pages for navbar links
// const AboutPage = () => <h1 className="text-center text-3xl mt-10">About FinGrow</h1>; // This is no longer needed

function App() {
  return (
    <AuthProvider>
      {/* 1. Added flex, flex-col, and min-h-screen to this div */}
      <div className="flex flex-col min-h-screen">
        <Navbar />
        {/* 2. Added flex-grow to main, making it push the footer down */}
        <main className="flex-grow">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            {/* <Route path="/about" element={<AboutPage />} /> */} {/* This route is removed */}
            <Route path="/contact" element={<ContactPage />} />

            {/* Member Routes (now wrapped in a protected element) */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<DashboardUserPage />} />
              <Route path="/savings" element={<SavingsPage />} />
              <Route path="/request-loan" element={<LoanRequestPage />} />
            </Route>

            {/* Admin Routes (wrapped in its own protected element) */}
            <Route element={<AdminRoute />}>
              <Route path="/admin" element={<DashboardAdminPage />} />
            </Route>
          </Routes>
        </main>
        {/* 3. Footer is now outside the <main> tag */}
        <Footer />
      </div>
    </AuthProvider>
  );
}

export default App;

