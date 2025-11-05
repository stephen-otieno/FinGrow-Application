// frontend/src/pages/DashboardUserPage.jsx

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/apiService';

const DashboardUserPage = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [profileRes, loansRes] = await Promise.all([
          api.get('/api/users/profile'),
          api.get('/api/loans/myloans'),
        ]);
        setProfile(profileRes.data);
        setLoans(loansRes.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <p>Loading dashboard...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Welcome, {user.name}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Total Savings Card */}
        <div className="bg-green-100 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">Total Savings</h2>
          <p className="text-4xl font-bold">Ksh {profile?.totalSavings.toLocaleString() || 0}</p>
        </div>

        {/* Active Loan Card (Simplified) */}
        <div className="bg-yellow-100 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">Active Loans</h2>
          <p className="text-4xl font-bold">
            {loans.filter(loan => loan.status === 'approved' && !loan.disbursed).length}
          </p>
          <p>Total {loans.length} loan requests</p>
        </div>
      </div>

      {/* My Loan History */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-semibold mb-4">My Loan History</h2>
        {loans.length === 0 ? (
          <p>You have not requested any loans.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Interest</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Owed</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loans.map(loan => (
                  <tr key={loan._id}>
                    <td className="px-6 py-4">Ksh {loan.amount.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold
                        ${loan.status === 'approved' ? 'bg-green-100 text-green-800' : ''}
                        ${loan.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : ''}
                        ${loan.status === 'declined' ? 'bg-red-100 text-red-800' : ''}
                      `}>
                        {loan.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">Ksh {loan.interest.toLocaleString()}</td>
                    <td className="px-6 py-4">Ksh {loan.totalOwed.toLocaleString()}</td>
                    <td className="px-6 py-4">{new Date(loan.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardUserPage;