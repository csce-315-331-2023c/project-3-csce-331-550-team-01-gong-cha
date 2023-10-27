'use client'
import Image from 'next/image'

import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function Home() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Simulated user data (in a real app, this would come from a server)
    const users = [
      { email: 'user1@example.com', password: 'password1' },
      { email: 'user2@example.com', password: 'password2' },
    ];

    const user = users.find((user) => user.email === email && user.password === password);

    if (user) {
      // Redirect to the dashboard or perform other actions here
      window.location.href = '/dashboard';
    } else {
      // Display an error message
      setError('Invalid email or password');
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <motion.div
        className="bg-gradient-to-r from-indigo-600 to-pink-600 py-[85px] text-center relative"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.h1
          className="text-5xl font-extrabold text-white mb-4"
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Welcome to Our App
        </motion.h1>
        <motion.p
          className="text-xl text-white mb-6"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          Please log in to access your account.
        </motion.p>
      </motion.div>
      <motion.div
        className="flex-1 bg-gray-200 flex flex-col justify-center items-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div
          className="bg-white p-[90px] rounded-lg shadow-lg"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <motion.h1
            className="text-2xl font-semibold text-center text-gray-800 mb-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            Login
          </motion.h1>
          <form onSubmit={handleSubmit}>
            <motion.div
              className="mb-4 flex items-center"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
            >
              <label htmlFor="email" className="block text-sm text-gray-600">
                Email:
              </label>
              <input
                type="email"
                id="email"
                placeholder="example@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full border-b border-gray-300 p-3 focus:outline-none focus:ring focus:ring-indigo-400"
              />
            </motion.div>
            <motion.div
              className="mb-4 flex items-center"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
            >
              <label htmlFor="password" className="block text-sm text-gray-600">
                Password:
              </label>
              <input
                type="password"
                id="password"
                placeholder="Your Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full border-b border-gray-300 p-3 focus:outline-none focus:ring focus:ring-indigo-400"
              />
            </motion.div>
            <motion.button
              type="submit"
              className="w-full bg-indigo-500 text-white py-3 rounded-[20px] hover:bg-indigo-600"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              Login
            </motion.button>
          </form>
          <motion.p
            className="text-red-500 mt-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            {error}
          </motion.p>
        </motion.div>
      </motion.div>
      <motion.div
        className="bg-gray-100 text-center p-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <p className="text-gray-600">
          Your Company &copy; {new Date().getFullYear()}
        </p>
      </motion.div>
    </div>
  );
}


