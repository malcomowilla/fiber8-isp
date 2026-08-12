import React, { useState, useEffect } from 'react';
import { 
  Wallet, 
  Wifi, 
  Server, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff,
  Loader2,
  Shield,
  AlertCircle,
  CheckCircle,
  User,
  Building
} from 'lucide-react';
import {useNavigate,useLocation} from 'react-router-dom'


const AdminLogin = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [selectedRole, setSelectedRole] = useState('admin'); // admin or tenant_admin
  const [phoneNumber, setPhoneNumber] = useState('')
      const navigate = useNavigate()
  

  // Check for saved session on mount
  useEffect(() => {
    const savedSession = localStorage.getItem('adminSession');
    if (savedSession) {
      try {
        const session = JSON.parse(savedSession);
        if (session.expiresAt > Date.now()) {
          // Session is still valid
          onLoginSuccess(session.user);
        } else {
          localStorage.removeItem('adminSession');
        }
      } catch (e) {
        localStorage.removeItem('adminSession');
      }
    }
  }, [onLoginSuccess]);

  const validateForm = () => {
    if (!email.trim()) {
      setError('Please enter your email address');
      return false;
    }
    // if (!email.includes('@') || !email.includes('.')) {
    //   setError('Please enter a valid email address');
    //   return false;
    // }
    if (!password) {
      setError('Please enter your password');
      return false;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    return true;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Replace with your actual authentication API endpoint
      const response = await fetch('/api/admin_wallet_signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
           'X-Subdomain': window.location.hostname.split('.')[0]
        },
        body: JSON.stringify({
          email: email,
          password: password,
          role: selectedRole,
          remember_me: rememberMe
        })
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage('Login successful! Redirecting...');
        navigate('/admin-wallet') 
        
        if (rememberMe) {
          const session = {
            user: data.user,
            expiresAt: Date.now() + (7 * 24 * 60 * 60 * 1000) // 7 days
          };
          localStorage.setItem('adminSession', JSON.stringify(session));
        } else {
          sessionStorage.setItem('adminSession', JSON.stringify({
            user: data.user,
            expiresAt: Date.now() + (24 * 60 * 60 * 1000) // 1 day
          }));
        }

        // Store auth token
        if (data.token) {
          localStorage.setItem('authToken', data.token);
        }

        // Call success callback after short delay
        setTimeout(() => {
          onLoginSuccess(data.user);
        }, 1500);
      } else {
        setError(data.error || 'Invalid login');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Network error. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = () => {
    setEmail('admin@example.com');
    setPassword('password123');
    setSuccessMessage('Demo credentials loaded. Click login to continue.');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center
     justify-center p-4 font-sans
">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo/Brand Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-4 bg-black rounded-2xl shadow-xl mb-4">
            <Wallet className="text-white" size={40} />
          </div>
          <h1 className="text-3xl font-bold ">
            Admin Portal
          </h1>
          <p className="text-gray-600 mt-2">Manage wallets, process withdrawals, and monitor revenue</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-gray-800 to-gray-900 px-6 py-4">
            <div className="flex items-center gap-3">
              <Shield className="text-blue-400" size={24} />
              <h2 className="text-white font-semibold text-lg">Administrator Login</h2>
            </div>
          </div>

          <div className="p-6 md:p-8">
            {/* Error Alert */}
            {error && (
              <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2">
                <AlertCircle size={18} className="text-red-500 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {/* Success Alert */}
            {successMessage && (
              <div className="mb-6 p-3 bg-green-50 border border-green-200 rounded-xl flex items-start gap-2">
                <CheckCircle size={18} className="text-green-500 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-green-700">{successMessage}</p>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-5">
             

              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address or username
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    // type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    // placeholder="admin@example.com"
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-12 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 text-blue-500 rounded focus:ring-blue-500"
                    disabled={isLoading}
                  />
                  <span className="text-sm text-gray-600">Remember me</span>
                </label>
                <button
                  type="button"
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  onClick={() => {
                    setError('');
                    setSuccessMessage('Password reset link has been sent to your email (demo only)');
                    setTimeout(() => setSuccessMessage(''), 3000);
                  }}
                >
                  Forgot password?
                </button>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 bg-black
                  text-white font-semibold rounded-xldisabled:opacity-50 disabled:cursor-not-allowed 
                  flex items-center justify-center gap-2 shadow-lg "
              >

                {isLoading ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    <span>Authenticating...</span>
                  </>
                ) : (
                  <>
                    <Shield size={20} />
                    <span>Login to Portal</span>
                  </>
                )}
              </button>
            </form>

           

        
          </div>
        </div>

        {/* Footer */}
        {/* <div className="text-center mt-6">
          <p className="text-xs text-gray-400">
            &copy; {new Date().getFullYear()} Admin Portal. All rights reserved.
          </p>
        </div> */}
      </div>
    </div>
  );
};

export default AdminLogin;