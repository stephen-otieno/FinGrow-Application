import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/apiService';
import { Link, useNavigate } from 'react-router-dom';

const LoanRequestPage = () => {
  const [amount, setAmount] = useState('');
  const [phone, setPhone] = useState('');
  const [repaymentPeriod, setRepaymentPeriod] = useState('');
  const [loanPurpose, setLoanPurpose] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user && user.phone) {
      setPhone(user.phone);
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      await api.post('/api/loans/request', { 
        amount: Number(amount),
        phone: phone,
        repaymentPeriod: Number(repaymentPeriod),
        loanPurpose: loanPurpose
      });
      
      setSuccess('Your loan request has been submitted successfully!');
      
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit loan request');
    } finally {
      setLoading(false);
    }
  };

  const handleAnotherRequest = () => {
    setAmount('');
    setRepaymentPeriod('');
    setLoanPurpose('');
    setSuccess('');
    setError('');
  };

  return (
    // --- MAIN CONTAINER WITH BACKGROUND ---
    <div 
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative py-12"
      style={{ backgroundImage: "url('/money-bg.png')" }}
    >
      {/* Heavy Green Overlay */}
      <div className="absolute inset-0 bg-green-900 opacity-90"></div>

      {/* Content Wrapper */}
      <div className="relative z-10 w-full max-w-md px-4">
        
        <div className="p-8 border border-yellow-500/30 rounded-lg shadow-2xl bg-white">
          
          {success ? (
            <div className="text-center">
              <h1 className="text-3xl font-bold mb-4 text-green-700">Request Sent!</h1>
              <p className="mb-6 text-gray-600">{success}</p>
              <div className="space-y-4">
                <Link 
                  to="/dashboard"
                  className="block w-full bg-green-800 text-white text-center p-3 rounded-md font-bold hover:bg-green-900 transition shadow-md"
                >
                  View My Dashboard
                </Link>
                <button 
                  onClick={handleAnotherRequest}
                  className="w-full bg-yellow-100 text-yellow-800 p-3 rounded-md font-bold hover:bg-yellow-200 transition shadow-sm border border-yellow-300"
                >
                  Make Another Request
                </button>
              </div>
            </div>
          ) : (
            <>
              <h1 className="text-3xl font-bold mb-2 text-center text-yellow-600">Request a Loan</h1>
              <p className="mb-6 text-center text-gray-500">Submit your request for review.</p>
              
              {error && <div className="bg-red-100 text-red-700 p-3 mb-4 rounded border border-red-200">{error}</div>}

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Amount */}
                <div>
                  <label className="block text-green-800 font-semibold mb-1">Amount (Ksh)</label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 outline-none transition"
                    required
                    min="100"
                    placeholder="e.g. 5000"
                  />
                </div>
                
                {/* Disbursement Phone */}
                <div>
                  <label className="block text-green-800 font-semibold mb-1">Disbursement Phone</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 outline-none transition"
                    required
                    placeholder="e.g. 0712345678"
                  />
                </div>

                {/* Repayment Period */}
                <div>
                  <label className="block text-green-800 font-semibold mb-1">Repayment Period (Months)</label>
                  <input
                    type="number"
                    value={repaymentPeriod}
                    onChange={(e) => setRepaymentPeriod(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 outline-none transition"
                    required
                    min="1"
                    max="12"
                    placeholder="e.g. 3"
                  />
                </div>

                {/* Loan Purpose Dropdown */}
                <div>
                  <label className="block text-green-800 font-semibold mb-1">Reason for Loan</label>
                  <select
                    value={loanPurpose}
                    onChange={(e) => setLoanPurpose(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 outline-none bg-white transition"
                    required
                  >
                    <option value="">Select a reason...</option>
                    <option value="Pay Bills">Pay Bills</option>
                    <option value="Business Investment">Business Investment</option>
                    <option value="Emergency">Emergency</option>
                    <option value="School Fees">School Fees</option>
                    <option value="Medical">Medical</option>
                    <option value="Personal Use">Personal Use</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <button 
                  type="submit" 
                  className="w-full bg-yellow-500 text-green-900 p-3 rounded-md font-bold text-lg hover:bg-yellow-400 transition shadow-md mt-4" 
                  disabled={loading}
                >
                  {loading ? 'Submitting...' : 'Submit Request'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoanRequestPage;