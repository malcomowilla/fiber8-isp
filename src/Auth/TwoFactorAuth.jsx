import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import {useNavigate} from 'react-router-dom'
import toast, { Toaster } from 'react-hot-toast';





const TwoFactorAuthVerification = ({ onVerify, onBack}) => {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(30);
  const inputRefs = useRef([]);
  const location = useLocation();
  const navigate = useNavigate();
  const { email } = location.state || {};

  // Handle input change
  const handleChange = (index, value) => {
    if (/^\d*$/.test(value)) { // Fixed: Added missing parenthesis
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);
      
      // Auto-focus next input
      if (value && index < 5) {
        inputRefs.current[index + 1].focus();
      }
      
      // Auto-submit if last digit entered
      if (index === 5 && value) {
        handleSubmit(newCode.join(''));
      }
    }
  };

















  // If email isn't passed, handle appropriately
  if (!email) {
    return (
      <div className="text-center p-8">
        <h2 className="text-2xl font-bold text-red-600">Authentication Error</h2>
        <p className="mt-4">Email address not provided for verification.</p>
        <button 
          onClick={() => navigate('/signin')}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
        >
          Return to Sign In
        </button>
      </div>
    );
  }









  // Handle backspace
  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  // Handle paste
  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasteData.length === 6) {
      const pasteArray = pasteData.split('');
      setCode(pasteArray);
      inputRefs.current[5].focus();
      handleSubmit(pasteData);
    }
  };

  const subdomain = window.location.hostname.split('.')[0];
  // Submit verification
  const handleSubmit = async (fullCode) => {
    if (fullCode.length !== 6) return;
    
    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/verify_totp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Subdomain': subdomain,
        },
        body: JSON.stringify({ email, code: fullCode }),
      });

      const newData = await response.json();

      if (response.ok) {
        toast.success('Verification successful', {
            position: "top-center",
            duration: 5000,

        })

        setTimeout(() => {
            navigate('/admin/router-stats')  
        }, 2800);
       
        setIsLoading(false);
        // onVerify(fullCode);
      }else{
        setError('Invalid verification code. Please try again.');
        toast.error(newData.error, {
          position: "top-center",
          duration: 5000,
        })
      }
    } catch (err) {
      setError('Invalid verification code. Please try again.');
      // Clear inputs on error
      setCode(['', '', '', '', '', '']);
      inputRefs.current[0].focus();
    } finally {
      setIsLoading(false);
    }
  };

  // Countdown timer for code refresh
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCountdown(30);
    }
  }, [countdown]);
  

  return (
    <>
    <Toaster />
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden p-8"
    >
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Two-Factor Verification</h2>
        <p className="text-gray-600 mt-2">
          Enter the 6-digit code from your authenticator app
        </p>
        <p className="text-sm text-gray-500 mt-1">
          Sent to <span className="font-medium">{email}</span>
        </p>
      </div>

      {/* Countdown indicator */}
      <div className="flex justify-center mb-6">
        <div className="relative w-16 h-16">
          <svg className="w-full h-full" viewBox="0 0 36 36">
            <path
              d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="#E5E7EB"
              strokeWidth="3"
            />
            <path
              d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="#3B82F6"
              strokeWidth="3"
              strokeDasharray={`${(countdown / 30) * 100}, 100`}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-sm font-medium text-gray-700">{countdown}s</span>
          </div>
        </div>
      </div>

      {/* Code inputs */}
      <div className="flex justify-center space-x-3 mb-6">
        {code.map((digit, index) => (
          <motion.input
            key={index}
            ref={(el) => (inputRefs.current[index] = el)}
            type="text"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            disabled={isLoading}
            className="w-12 h-16 text-3xl text-center font-semibold border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            whileHover={{ scale: 1.05 }}
            whileFocus={{ scale: 1.1 }}
            initial={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 400, damping: 10 }}
          />
        ))}
      </div>

      {/* Error message */}
      {error && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-center"
        >
          {error}
        </motion.div>
      )}

      {/* Submit button */}
      <motion.button
        onClick={() => handleSubmit(code.join(''))}
        disabled={isLoading || code.join('').length !== 6}
        className={`w-full py-3 rounded-lg font-medium transition-colors ${
          isLoading || code.join('').length !== 6
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700 text-white'
        }`}
        whileTap={{ scale: 0.98 }}
      >
        {isLoading ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Verifying...
          </span>
        ) : (
          'Verify & Continue'
        )}
      </motion.button>

      {/* Alternative options */}
      <div className="mt-6 text-center text-sm text-gray-500">
        <p className="mb-2">Having trouble?</p>
        <div className="flex justify-center space-x-4">
          <button 
            onClick={onBack}
            className="text-blue-600 hover:text-blue-800 hover:underline"
          >
            Go back
          </button>
          <button className="text-blue-600 hover:text-blue-800 hover:underline">
            Use backup code
          </button>
          <button className="text-blue-600 hover:text-blue-800 hover:underline">
            Resend code
          </button>
        </div>
      </div>
    </motion.div>
    </>
  );
};

export default TwoFactorAuthVerification;