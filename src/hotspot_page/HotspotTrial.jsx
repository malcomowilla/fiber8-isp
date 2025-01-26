import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';


const HotspotTrial = () => {
  const [timeLeft, setTimeLeft] = useState(60); // 10 minutes in seconds

  useEffect(() => {
    if (timeLeft === 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-6">
      <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full text-center animate-fade-in">
        <h1 className="text-4xl font-bold text-gray-800 mb-4 animate-slide-up">
          Welcome to Free Wi-Fi!
        </h1>
        <p className="text-gray-600 mb-6 animate-slide-up delay-100">
          Enjoy complimentary internet access for a limited time.
        </p>

        {/* Countdown Timer */}
        <div className="bg-gray-100 p-6 rounded-lg mb-6 animate-slide-up delay-200">
          <p className="text-sm text-gray-600 mb-2">Time Remaining</p>
          <p className="text-3xl font-bold text-gray-800">{formatTime(timeLeft)}</p>
        </div>

        {/* Call-to-Action Button */}
        <button
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-8 rounded-lg hover:scale-105 transition-transform duration-300 animate-slide-up delay-300"
          onClick={() => alert("Trial started! Enjoy your free Wi-Fi.")}
        >
          Start Free Trial
        </button>

        {/* Footer */}
        <p className="text-sm text-gray-500 mt-6 animate-slide-up delay-400">
          By continuing, you agree to our{" "}
          <a href="#" className="text-blue-600 hover:underline">
            Terms of Service
          </a>
          .
        </p>
      </div>
    </div>
  );
};

export default HotspotTrial;