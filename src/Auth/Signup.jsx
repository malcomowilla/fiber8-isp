import React, { useContext, useState } from 'react';
import { ApplicationContext } from '../context/ApplicationContext';
import { motion } from 'framer-motion';
import { Button, Alert } from '@mui/material';

const Signup = () => {
  const { email, setEmail, username, setUsername, password, setPassword,
     handleSignUp, offlineError } = useContext(ApplicationContext);

  return (
    <>
     <div className="font-sans bg-gray-950 text-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-900 via-gray-900 to-gray-950 h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://via.placeholder.com/1920x800')] bg-cover bg-center opacity-20"></div>
        <div className="relative z-10 text-center max-w-4xl px-6 animate-fade-in">
          <h1 className="text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
            Revolutionize Your Internet Experience
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Empower your business with our cutting-edge SaaS platform for seamless internet management. Fast, reliable, and scalable.
          </p>
          <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-8 rounded-lg hover:scale-105 transition-transform duration-300">
            Get Started
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-gray-950">
        <h2 className="text-4xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 animate-slide-in">
          Why Choose Us?
        </h2>
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-gray-900 p-8 rounded-xl border border-gray-800 hover:border-purple-500 transition-all duration-300 hover:scale-105 animate-fade-in-up">
            <div className="text-4xl mb-4 text-purple-500">🚀</div>
            <h3 className="text-2xl font-bold mb-4">Blazing Fast Speeds</h3>
            <p className="text-gray-400">Experience ultra-fast internet with speeds up to 10Gbps.</p>
          </div>
          <div className="bg-gray-900 p-8 rounded-xl border border-gray-800 hover:border-blue-500 transition-all duration-300 hover:scale-105 animate-fade-in-up delay-200">
            <div className="text-4xl mb-4 text-blue-500">🔒</div>
            <h3 className="text-2xl font-bold mb-4">99.99% Uptime</h3>
            <p className="text-gray-400">Our network ensures maximum reliability with 99.99% uptime.</p>
          </div>
          <div className="bg-gray-900 p-8 rounded-xl border border-gray-800 hover:border-purple-500 transition-all duration-300 hover:scale-105 animate-fade-in-up delay-400">
            <div className="text-4xl mb-4 text-purple-500">🛠️</div>
            <h3 className="text-2xl font-bold mb-4">24/7 Expert Support</h3>
            <p className="text-gray-400">Our team is available round the clock to assist you.</p>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-gray-900 to-gray-950">
        <h2 className="text-4xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 animate-slide-in">
          What Our Customers Say
        </h2>
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-gray-900 p-8 rounded-xl border border-gray-800 hover:border-purple-500 transition-all duration-300 hover:scale-105 animate-fade-in-left">
            <p className="text-gray-400 italic">"The best internet service we've ever used. Highly recommended!"</p>
            <p className="mt-4 font-semibold text-purple-500">- Jane Doe, CEO of SaaS Corp</p>
          </div>
          <div className="bg-gray-900 p-8 rounded-xl border border-gray-800 hover:border-blue-500 transition-all duration-300 hover:scale-105 animate-fade-in-right">
            <p className="text-gray-400 italic">"Reliable and fast. Perfect for our growing business needs."</p>
            <p className="mt-4 font-semibold text-blue-500">- John Smith, CTO of Tech Solutions</p>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-blue-900 to-purple-900 text-white text-center">
        <h2 className="text-4xl font-bold mb-6 animate-slide-in">
          Ready to Transform Your Business?
        </h2>
        <p className="text-xl mb-8 text-gray-300">
          Join thousands of satisfied customers and experience the difference.
        </p>
        <button className="bg-white text-blue-900 font-semibold py-3 px-8 rounded-lg hover:scale-105 transition-transform duration-300">
          Sign Up Now
        </button>
      </section>
    </div>
    </>
  );
}

export default Signup;
