// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';
import rightArrow from '../assets/right_arrow.png';

function Newsletter() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setMessage('Please enter a valid email.');
      return;
    }
    setLoading(true);
    setMessage('');

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setMessage('Thank you for subscribing! 🎉');
      setEmail('');
    }, 2000);
  };

  return (
    <section className="mt-14 mb-10 py-12">
      <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left w-4/5 mx-auto">
        <h2 className="text-3xl font-bold text-darkCoal mb-4">
          Subscribe to our newsletter to get<br /> latest news in your inbox.
        </h2>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 items-center w-full md:w-auto"
        >
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full md:w-72 p-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-400 transition disabled:opacity-50"
            placeholder="Enter your email"
            disabled={loading}
            aria-label="Email address"
          />

          <button
            type="submit"
            className={`flex items-center justify-center text-lg font-semibold py-3 px-6 rounded-md text-white transition ${
              loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-turquoiseBlue hover:bg-teal-500'
            }`}
            disabled={loading}
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <span>Subscribe</span>
                <img src={rightArrow} alt="Right arrow" className="w-5 h-5 ml-2" />
              </>
            )}
          </button>
        </form>

        {message && (
          <p className="mt-4 md:mt-0 text-center md:text-left text-sm text-teal-700 font-medium">
            {message}
          </p>
        )}
      </div>
    </section>
  );
}

export default Newsletter;
