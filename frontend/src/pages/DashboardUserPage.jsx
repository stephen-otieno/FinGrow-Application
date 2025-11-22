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

  if (loading) return <div className="text-center mt-20 text-white text-xl">Loading dashboard...</div>;
  if (error) return <div className="text-center mt-20 text-red-400">{error}</div>;

  const firstName = user.name ? user.name.split(' ')[0] : 'User';

  return (
    // --- MAIN CONTAINER WITH BACKGROUND ---
    <div 
      className="min-h-screen bg-cover bg-center relative py-8"
      style={{ backgroundImage: "url('/money-bg.jpg')" }}
    >
      {/* Heavy Green Overlay for readability */}
      <div className="absolute inset-0 bg-green-900 opacity-90"></div>

      <div className="relative z-10 container mx-auto px-4">
        
        {/* Welcome Message in Gold */}
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-yellow-400 drop-shadow-md">
          Welcome, {firstName}
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Total Savings Card */}
          <div className="bg-white p-6 rounded-lg shadow-xl border-l-4 border-yellow-500">
            <h2 className="text-lg font-semibold mb-2 text-gray-600 uppercase tracking-wide">Total Savings</h2>
            <p className="text-4xl font-bold text-green-800">
              Ksh {profile?.totalSavings.toLocaleString() || 0}
            </p>
            <p className="text-sm text-green-600 mt-2">Available in your wallet</p>
          </div>

          {/* Active Loan Card */}
          <div className="bg-white p-6 rounded-lg shadow-xl border-l-4 border-green-600">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-lg font-semibold mb-2 text-gray-600 uppercase tracking-wide">Active Loans</h2>
                <p className="text-4xl font-bold text-gray-800">
                  {loans.filter(loan => loan.status === 'approved' && !loan.disbursed).length}
                </p>
                <p className="text-sm text-gray-500 mt-2">Pending Disbursement</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-gray-800">{loans.length}</p>
                <p className="text-xs text-gray-500 uppercase">Total Requests</p>
              </div>
            </div>
          </div>
        </div>

        {/* My Loan History */}
        <div className="bg-white rounded-lg shadow-2xl overflow-hidden">
          <div className="bg-green-800 p-4 border-b border-green-700">
            <h2 className="text-xl font-bold text-yellow-400">My Loan History</h2>
          </div>
          
          {loans.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <p>You have not requested any loans yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-green-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-green-900 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-green-900 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-green-900 uppercase tracking-wider">Interest</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-green-900 uppercase tracking-wider">Total Owed</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-green-900 uppercase tracking-wider">Date</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {loans.map(loan => (
                    <tr key={loan._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                        Ksh {loan.amount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase
                          ${loan.status === 'approved' ? 'bg-green-100 text-green-800' : ''}
                          ${loan.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : ''}
                          ${loan.status === 'declined' ? 'bg-red-100 text-red-800' : ''}
                          ${loan.status === 'under review' ? 'bg-blue-100 text-blue-800' : ''}
                        `}>
                          {loan.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                        Ksh {loan.interest.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                        Ksh {loan.totalOwed.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                        {new Date(loan.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default DashboardUserPage;