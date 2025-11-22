import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/apiService";

const SavingsPage = () => {
  const [amount, setAmount] = useState("");
  const [phone, setPhone] = useState(""); // Phone state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isPolling, setIsPolling] = useState(false);

  const { user, refreshUser } = useAuth();
  const pollingIntervalRef = useRef(null);
  const initialSavingsRef = useRef(user?.totalSavings || 0);

  // Clean up interval on component unmount
  useEffect(() => {
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, []);

  // Pre-fill phone number from user profile
  useEffect(() => {
    if (user && user.phone) {
      setPhone(user.phone);
    }
  }, [user]);

  const startPolling = () => {
    setIsPolling(true);
    setMessage(
      `STK push sent to ${phone}. Please check your phone and enter your M-PESA PIN.`
    );
    initialSavingsRef.current = user?.totalSavings || 0;

    pollingIntervalRef.current = setInterval(async () => {
      try {
        const updatedUser = await refreshUser();
        if (updatedUser.totalSavings > initialSavingsRef.current) {
          clearInterval(pollingIntervalRef.current);
          setIsPolling(false);
          setLoading(false);
          setMessage(
            `Payment Successful! Ksh ${updatedUser.totalSavings.toLocaleString()} is now available in your savings.`
          );
          setAmount("");
        }
      } catch (err) {
        console.error("Polling error:", err);
      }
    }, 3000);

    setTimeout(() => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        setIsPolling(false);
        setLoading(false);
        // Only show timeout error if we haven't succeeded yet
        if (isPolling) {
             setError(
            "Transaction timed out. If you paid, the update will appear in your dashboard shortly."
            );
        }
      }
    }, 120000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      await api.post("/api/savings/deposit", {
        amount: Number(amount),
        phone: phone // Send the phone number
      });
      startPolling();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to initiate deposit");
      setLoading(false);
    }
  };

  return (
    // --- MAIN CONTAINER WITH BACKGROUND (MONEY THEME) ---
    <div 
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative py-12"
      style={{ backgroundImage: "url('/money-bg.png')" }}
    >
      {/* Heavy Green Overlay */}
      <div className="absolute inset-0 bg-green-900 opacity-90"></div>

      {/* Content Wrapper */}
      <div className="relative z-10 w-full max-w-md px-4">
        
        <div className="p-8 border border-yellow-500/30 rounded-lg shadow-2xl bg-white">
          
          <h1 className="text-3xl font-bold mb-4 text-center text-yellow-600">Make a Deposit</h1>

          {isPolling ? (
            // --- POLLING VIEW ---
            <div className="text-center py-6">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-yellow-500 mx-auto mb-6"></div>
              <p className="text-xl font-bold text-green-800 mb-2">Waiting for Payment...</p>
              <p className="text-gray-600 px-4 text-sm">{message}</p>
            </div>
          ) : (
            // --- DEFAULT FORM VIEW ---
            <>
              <p className="mb-6 text-center text-gray-500">
                Enter the amount you wish to save. You will receive an STK push on the provided M-Pesa number.
              </p>

              {message && (
                <div className="bg-green-100 text-green-800 p-4 mb-6 rounded border border-green-200 font-medium text-center text-sm">
                  {message}
                </div>
              )}
              {error && (
                <div className="bg-red-100 text-red-700 p-4 mb-6 rounded border border-red-200 text-center text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                
                 {/* Phone Number Input */}
                 <div>
                  <label className="block text-green-800 font-semibold mb-1">M-Pesa Phone Number</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 outline-none transition text-lg"
                    required
                    placeholder="e.g. 0712345678"
                  />
                </div>

                {/* Amount Input */}
                <div>
                  <label className="block text-green-800 font-semibold mb-1">Amount (Ksh)</label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 outline-none transition text-lg"
                    required
                    min="10"
                    placeholder="e.g. 500"
                  />
                </div>
                
                <button
                  type="submit"
                  className="w-full bg-yellow-500 text-green-900 p-3 rounded-md font-bold text-lg hover:bg-yellow-400 transition shadow-md mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={loading}
                >
                  {loading ? "Processing..." : "Deposit Funds"}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SavingsPage;