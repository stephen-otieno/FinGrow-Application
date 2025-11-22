import React, { useState, useEffect } from 'react';
import api from '../api/apiService';

const DashboardAdminPage = () => {
  const [loans, setLoans] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [view, setView] = useState('loans'); // 'loans' or 'users'

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');
      const [loansRes, usersRes] = await Promise.all([
        api.get('/api/loans'),
        api.get('/api/users'),
      ]);
      setLoans(loansRes.data);
      setUsers(usersRes.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleLoanStatusUpdate = async (id, status) => {
    if (!window.confirm(`Are you sure you want to ${status} this loan?`)) return;
    
    try {
      await api.put(`/api/loans/${id}/status`, { status });
      fetchData();
    } catch (err) {
      alert('Failed to update status: ' + (err.response?.data?.message || err.message));
    }
  };

  // --- CALCULATE STATS ---
  // 1. Total Savings (The Kitty)
  const totalSavings = users.reduce((acc, user) => acc + (user.totalSavings || 0), 0);

  // 2. Total Outstanding Loans (Money currently out)
  // Counting ALL 'approved' loans, regardless of disbursement status
  const totalOutstanding = loans
    .filter(loan => loan.status === 'approved') 
    .reduce((acc, loan) => acc + (loan.totalOwed || 0), 0);
  // -----------------------

  if (loading) return <div className="text-center mt-20 text-white text-xl">Loading admin data...</div>;
  if (error) return <div className="text-center mt-20 text-red-400">{error}</div>;

  return (
    // --- MAIN CONTAINER WITH BACKGROUND ---
    <div 
      className="min-h-screen bg-cover bg-center relative py-8"
      style={{ backgroundImage: "url('/money-bg.jpg')" }}
    >
      {/* Deep Green Overlay */}
      <div className="absolute inset-0 bg-green-900 opacity-90"></div>

      <div className="relative z-10 container mx-auto px-4">
        
        {/* Admin Heading in Gold */}
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-yellow-400 drop-shadow-md border-b border-green-700 pb-4">
          Admin Dashboard
        </h1>

        {/* --- STATS CARDS --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Total Kitty Card */}
          <div className="bg-white p-6 rounded-lg shadow-xl border-l-4 border-green-600 relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-lg font-bold mb-2 text-gray-600 uppercase tracking-wide">Total Kitty (Member Savings)</h2>
              <p className="text-4xl font-extrabold text-green-800">
                Ksh {totalSavings.toLocaleString()}
              </p>
              <p className="text-sm text-green-600 mt-2 font-medium">
                Funds available from {users.length} members
              </p>
            </div>
            <div className="absolute right-0 top-0 h-full w-24 bg-green-50 skew-x-12 opacity-50"></div>
          </div>

          {/* Total Loans Out Card */}
          <div className="bg-white p-6 rounded-lg shadow-xl border-l-4 border-yellow-500 relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-lg font-bold mb-2 text-gray-600 uppercase tracking-wide">Total Outstanding Loans</h2>
              <p className="text-4xl font-extrabold text-green-800">
                Ksh {totalOutstanding.toLocaleString()}
              </p>
              <p className="text-sm text-green-600 mt-2 font-medium">
                Value of all approved loans
              </p>
            </div>
            <div className="absolute right-0 top-0 h-full w-24 bg-yellow-50 skew-x-12 opacity-50"></div>
          </div>
        </div>

        {/* --- TABS --- */}
        <div className="flex border-b border-green-700 mb-6 space-x-1">
          <button 
            onClick={() => setView('loans')} 
            className={`py-3 px-6 text-lg font-bold transition-all duration-200 rounded-t-lg ${
              view === 'loans' 
                ? 'bg-green-800 text-yellow-400 border-t border-l border-r border-green-700' 
                : 'text-gray-400 hover:text-white hover:bg-green-800/50'
            }`}
          >
            Loan Requests 
            <span className={`ml-2 py-0.5 px-2 rounded-full text-xs ${view === 'loans' ? 'bg-yellow-400 text-green-900' : 'bg-gray-600 text-white'}`}>
              {loans.filter(l => l.status === 'pending').length}
            </span>
          </button>
          <button 
            onClick={() => setView('users')} 
            className={`py-3 px-6 text-lg font-bold transition-all duration-200 rounded-t-lg ${
              view === 'users' 
                ? 'bg-green-800 text-yellow-400 border-t border-l border-r border-green-700' 
                : 'text-gray-400 hover:text-white hover:bg-green-800/50'
            }`}
          >
            Members 
            <span className={`ml-2 py-0.5 px-2 rounded-full text-xs ${view === 'users' ? 'bg-yellow-400 text-green-900' : 'bg-gray-600 text-white'}`}>
              {users.length}
            </span>
          </button>
        </div>

        {/* --- CONTENT WRAPPER --- */}
        <div className="bg-white rounded-lg shadow-2xl overflow-hidden">
          {view === 'loans' && (
            <LoanRequestsTable loans={loans} onUpdate={handleLoanStatusUpdate} />
          )}
          {view === 'users' && (
            <UsersTable users={users} />
          )}
        </div>
      </div>
    </div>
  );
};

// Sub-component for Loan Requests Table
const LoanRequestsTable = ({ loans, onUpdate }) => {
  const pendingLoans = loans.filter(l => l.status === 'pending');
  
  return (
    <div className="overflow-x-auto">
      <div className="bg-green-800 p-4 border-b border-green-700 flex justify-between items-center">
        <h2 className="text-xl font-bold text-yellow-400">Pending Loan Requests</h2>
      </div>
      
      {pendingLoans.length === 0 ? (
        <div className="p-12 text-center text-gray-500 bg-gray-50">
          <p className="text-lg">No pending loan requests found.</p>
        </div>
      ) : (
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-green-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-extrabold text-green-900 uppercase tracking-wider">User</th>
              <th className="px-6 py-4 text-left text-xs font-extrabold text-green-900 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-4 text-left text-xs font-extrabold text-green-900 uppercase tracking-wider">Phone</th>
              <th className="px-6 py-4 text-left text-xs font-extrabold text-green-900 uppercase tracking-wider">Purpose</th>
              <th className="px-6 py-4 text-left text-xs font-extrabold text-green-900 uppercase tracking-wider">Period</th>
              <th className="px-6 py-4 text-left text-xs font-extrabold text-green-900 uppercase tracking-wider">Date</th>
              <th className="px-6 py-4 text-left text-xs font-extrabold text-green-900 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {pendingLoans.map(loan => (
              <tr key={loan._id} className="hover:bg-green-50 transition-colors duration-150">
                <td className="px-6 py-4 whitespace-nowrap font-bold text-gray-900">{loan.user?.name || 'N/A'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-800 font-medium">Ksh {loan.amount.toLocaleString()}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-600">{loan.disbursementPhone || '0115598800'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-600">{loan.loanPurpose || '-'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-600">{loan.repaymentPeriod ? `${loan.repaymentPeriod} months` : '-'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-500 text-sm">{new Date(loan.createdAt).toLocaleDateString()}</td>
                <td className="px-6 py-4 whitespace-nowrap space-x-2">
                  <button 
                    onClick={() => onUpdate(loan._id, 'approved')} 
                    className="bg-green-600 text-white px-4 py-1.5 rounded shadow hover:bg-green-700 hover:shadow-md transition font-bold text-sm"
                  >
                    Approve
                  </button>
                  <button 
                    onClick={() => onUpdate(loan._id, 'declined')} 
                    className="bg-red-600 text-white px-4 py-1.5 rounded shadow hover:bg-red-700 hover:shadow-md transition font-bold text-sm"
                  >
                    Decline
                  </button>
                  <button 
                    onClick={() => onUpdate(loan._id, 'under review')} 
                    className="bg-yellow-500 text-white px-4 py-1.5 rounded shadow hover:bg-yellow-600 hover:shadow-md transition font-bold text-sm text-gray-800"
                  >
                    Review
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

// Sub-component for Users Table
const UsersTable = ({ users }) => (
  <div className="overflow-x-auto">
    <div className="bg-green-800 p-4 border-b border-green-700">
      <h2 className="text-xl font-bold text-yellow-400">Member Directory</h2>
    </div>

    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-green-50">
        <tr>
          <th className="px-6 py-4 text-left text-xs font-extrabold text-green-900 uppercase tracking-wider">Name</th>
          <th className="px-6 py-4 text-left text-xs font-extrabold text-green-900 uppercase tracking-wider">Email</th>
          <th className="px-6 py-4 text-left text-xs font-extrabold text-green-900 uppercase tracking-wider">Phone</th>
          <th className="px-6 py-4 text-left text-xs font-extrabold text-green-900 uppercase tracking-wider">Role</th>
          <th className="px-6 py-4 text-left text-xs font-extrabold text-green-900 uppercase tracking-wider">Total Savings</th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {users.map(user => (
          <tr key={user._id} className="hover:bg-green-50 transition-colors duration-150">
            <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{user.name}</td>
            <td className="px-6 py-4 whitespace-nowrap text-gray-600">{user.email}</td>
            <td className="px-6 py-4 whitespace-nowrap text-gray-600">{user.phone}</td>
            <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase border ${
                  user.role === 'admin' 
                    ? 'bg-yellow-100 text-yellow-800 border-yellow-300' 
                    : 'bg-green-100 text-green-800 border-green-200'
                }`}>
                    {user.role}
                </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap font-bold text-green-700">Ksh {user.totalSavings.toLocaleString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
    
export default DashboardAdminPage;