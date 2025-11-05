// frontend/src/pages/DashboardAdminPage.jsx

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
      // Refresh data
      fetchData();
    } catch (err) {
      alert('Failed to update status: ' + (err.response?.data?.message || err.message));
    }
  };

  if (loading) return <p>Loading admin data...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>

      {/* TABS */}
      <div className="flex border-b mb-4">
        <button onClick={() => setView('loans')} className={`py-2 px-4 ${view === 'loans' ? 'border-b-2 border-blue-500 font-semibold' : ''}`}>
          Loan Requests ({loans.filter(l => l.status === 'pending').length})
        </button>
        <button onClick={() => setView('users')} className={`py-2 px-4 ${view === 'users' ? 'border-b-2 border-blue-500 font-semibold' : ''}`}>
          All Members ({users.length})
        </button>
      </div>

      {/* CONTENT */}
      {view === 'loans' && (
        <LoanRequestsTable loans={loans} onUpdate={handleLoanStatusUpdate} />
      )}
      {view === 'users' && (
        <UsersTable users={users} />
      )}
    </div>
  );
};

// Sub-component for Loan Requests Table
const LoanRequestsTable = ({ loans, onUpdate }) => {
  const pendingLoans = loans.filter(l => l.status === 'pending');

  return (
    <div className="bg-white p-6 rounded-lg shadow overflow-x-auto">
      <h2 className="text-2xl font-semibold mb-4">Pending Loan Requests</h2>
      {pendingLoans.length === 0 ? (<p>No pending loan requests.</p>) : (
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            <th className="px-4 py-3 text-left">User</th>
            <th className="px-4 py-3 text-left">Email</th>
            <th className="px-4 py-3 text-left">Amount</th>
            <th className="px-4 py-3 text-left">Date</th>
            <th className="px-4 py-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {pendingLoans.map(loan => (
            <tr key={loan._id}>
              <td className="px-4 py-4">{loan.user.name}</td>
              <td className="px-4 py-4">{loan.user.email}</td>
              <td className="px-4 py-4">Ksh {loan.amount.toLocaleString()}</td>
              <td className="px-4 py-4">{new Date(loan.createdAt).toLocaleDateString()}</td>
              <td className="px-4 py-4 space-x-2">
                <button onClick={() => onUpdate(loan._id, 'approved')} className="bg-green-500 text-white px-3 py-1 rounded text-sm">Approve</button>
                <button onClick={() => onUpdate(loan._id, 'declined')} className="bg-red-500 text-white px-3 py-1 rounded text-sm">Decline</button>
                <button onClick={() => onUpdate(loan._id, 'under review')} className="bg-yellow-500 text-white px-3 py-1 rounded text-sm">Review</button>
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
  <div className="bg-white p-6 rounded-lg shadow overflow-x-auto">
    <h2 className="text-2xl font-semibold mb-4">All Members</h2>
    <table className="min-w-full divide-y divide-gray-200">
      <thead>
        <tr>
          <th className="px-4 py-3 text-left">Name</th>
          <th className="px-4 py-3 text-left">Email</th>
          <th className="px-4 py-3 text-left">Phone</th>
          <th className="px-4 py-3 text-left">Savings</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200">
        {users.map(user => (
          <tr key={user._id}>
            <td className="px-4 py-4">{user.name}</td>
            <td className="px-4 py-4">{user.email}</td>
            <td className="px-4 py-4">{user.phone}</td>
            <td className="px-4 py-4">Ksh {user.totalSavings.toLocaleString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default DashboardAdminPage;