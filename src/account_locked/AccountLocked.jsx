import Lottie from 'react-lottie';
import React from 'react';

// Import your animations
import AccountLockedAnimation from './website_closed.json';
import RateLimitAnimation from './ratelimit.json'; // Add a new animation for rate limiting
import WarningAnimation from './warning.json'; // Add another animation for warnings
import {Link} from 'react-router-dom'

const AccountLocked = () => {
  // Default options for the locked account animation
  const lockedAccountOptions = {
    loop: true,
    autoplay: true,
    animationData: AccountLockedAnimation,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  // Default options for the rate limit animation
  const rateLimitOptions = {
    loop: true,
    autoplay: true,
    animationData: RateLimitAnimation,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  // Default options for the warning animation
  const warningOptions = {
    loop: true,
    autoplay: true,
    animationData: WarningAnimation,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      {/* Display the locked account animation */}
      <div className="mb-8">
        <Lottie options={lockedAccountOptions} height={300} width={300} />
        <p className="text-center text-lg font-semibold text-gray-700 mt-4">
          Your account has been locked due to multiple failed attempts.
        </p>
      </div>

      {/* Display the rate limit animation */}
      <div className="mb-8">
        <Lottie options={rateLimitOptions} height={300} width={300} />
        <p className="text-center text-lg font-semibold text-gray-700 mt-4">
          You have been rate-limited. Please try again later.
        </p>
      </div>

      {/* Display the warning animation */}
      <div className="mb-8">
        <Lottie options={warningOptions} height={300} width={300} />
        <p className="text-center text-lg font-semibold text-gray-700 mt-4">
          Warning: Too many requests. Your account is temporarily locked.
        </p>
      </div>

      {/* Additional instructions or actions */}
      <div className="text-center">
        <p className="text-gray-600">
          If you believe this is a mistake, please contact support.
        </p>
        <button
          className="mt-4 px-6 py-2 bg-red-800
          hover:scale-[1.4] hover:text-red-600
          text-white rounded-lg hover:bg-green-300
          
           transition-all duration-300"
           // Reload the page or redirect
        >
          <Link to='/signin'>
          Try Again In 5 Minutes

          </Link>
        </button>
      </div>
    </div>
  );
};

export default AccountLocked;