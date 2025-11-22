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
    // --- BACKGROUND CONTAINER ---
    <div 
      className="w-full min-h-[80vh] flex items-center justify-center bg-cover bg-center relative py-12"
      style={{ backgroundImage: "url('/money-bg.png')" }} 
    >
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black opacity-40"></div>

      {/* Form Container */}
      <div className="relative z-10 max-w-3xl w-full mx-4 p-8 border border-yellow-200 rounded-lg shadow-2xl bg-white">
        
        {/* Gold Heading */}
        <h1 className="text-3xl font-bold mb-2 text-center text-yellow-700">
          Contact Us
        </h1>
        
        {/* Gold Subtext */}
        <p className="text-yellow-600 text-center mb-6">
          Have a question or feedback? Fill out the form below to get in touch.
        </p>

        {/* Success Message */}
        {success && (
          <div className="bg-green-100 text-green-700 p-3 mb-4 rounded border border-green-200">
            {success}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 text-red-700 p-3 mb-4 rounded border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Grid for Name and Email */}
          <div className="grid grid-cols-1 md:grid-cols-2 md:gap-6">
            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-yellow-700 font-medium">Name</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-3 border border-yellow-200 rounded-md mt-1 focus:ring-2 focus:ring-yellow-500 outline-none"
                required
              />
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-yellow-700 font-medium">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border border-yellow-200 rounded-md mt-1 focus:ring-2 focus:ring-yellow-500 outline-none"
                required
              />
            </div>
          </div>
          {/* End of grid */}

          {/* Subject Field */}
          <div>
            <label htmlFor="subject" className="block text-yellow-700 font-medium">Subject</label>
            <input
              type="text"
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full p-3 border border-yellow-200 rounded-md mt-1 focus:ring-2 focus:ring-yellow-500 outline-none"
              required
            />
          </div>

          {/* Message Field */}
          <div>
            <label htmlFor="message" className="block text-yellow-700 font-medium">Message</label>
            <textarea
              id="message"
              rows="5"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full p-3 border border-yellow-200 rounded-md mt-1 focus:ring-2 focus:ring-yellow-500 outline-none"
              required
            ></textarea>
          </div>

          {/* Gold Button */}
          <button
            type="submit"
            className="w-full bg-yellow-600 text-white p-3 rounded-md font-semibold hover:bg-yellow-700 transition shadow-md"
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Send Message'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContactPage;