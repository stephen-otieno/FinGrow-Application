import React, { useState } from 'react';
import api from '../api/apiService'; // Your custom axios instance

const ContactPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const { data } = await api.post('/api/contact', {
        name,
        email,
        subject,
        message,
      });

      setSuccess(data.message);
      setLoading(false);
      // Clear the form
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send message. Please try again.');
      setLoading(false);
    }
  };

  return (
    // 1. Widen the container
    <div className="max-w-3xl mx-auto mt-10 p-8 border rounded-lg shadow-lg bg-white">
      <h1 className="text-3xl font-bold mb-2 text-center">Contact Us</h1>
      <p className="text-gray-600 text-center mb-6">
        Have a question or feedback? Fill out the form below to get in touch.
      </p>

      {/* Success Message */}
      {success && (
        <div className="bg-green-100 text-green-700 p-3 mb-4 rounded">
          {success}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 text-red-700 p-3 mb-4 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 2. Create a grid for side-by-side inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 md:gap-6">
          {/* Name Field */}
          <div>
            <label htmlFor="name" className="block text-gray-700">Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 border rounded-md mt-1"
              required
            />
          </div>

          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border rounded-md mt-1"
              required
            />
          </div>
        </div>
        {/* End of grid */}

        {/* 3. Subject and Message are now full-width by default */}
        <div>
          <label htmlFor="subject" className="block text-gray-700">Subject</label>
          <input
            type="text"
            id="subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full p-3 border rounded-md mt-1"
            required
          />
        </div>

        <div>
          <label htmlFor="message" className="block text-gray-700">Message</label>
          <textarea
            id="message"
            rows="5"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full p-3 border rounded-md mt-1"
            required
          ></textarea>
        </div>

        <button
          type="submit"
            className="bg-blue-400 text-white font-semibold px-8 py-3 rounded-md text-lg hover:bg-green-900 transition block w-fit mx-auto"              disabled={loading}
        >
          {loading ? 'Sending...' : 'Send Message'}
        </button>
          </form>
          
         
      </div>
      
      
  );
  
};

export default ContactPage;
