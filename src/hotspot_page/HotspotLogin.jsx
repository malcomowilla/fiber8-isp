import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Wifi, 
  Smartphone, 
  CreditCard, 
  CheckCircle, 
  Clock,
  Shield,
  Users,
  Zap,
  ArrowRight,
  AlertCircle,
  X,
  ChevronRight,
  Info,
  Lock,
  Globe,
  RefreshCw,
  WifiOff
} from 'lucide-react';

const HotspotLogin = () => {
  // Get URL parameters
  const queryParams = new URLSearchParams(window.location.search);
  const mac = queryParams.get('mac') || '00:00:00:00:00';
  const ip = queryParams.get('ip') || '192.168.1.1';
  const username = queryParams.get('username') || 'guest';
  
  // State management
  const [activeTab, setActiveTab] = useState('packages'); // 'packages', 'voucher', 'instructions'
  const [packages, setPackages] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [voucherCode, setVoucherCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showInstructions, setShowInstructions] = useState(false);
  const [remainingTime, setRemainingTime] = useState(300); // 5 minutes in seconds
  const [sessionInfo, setSessionInfo] = useState(null);

  // Mock packages data - replace with API call
  const mockPackages = [
    { id: 1, name: "15 Minutes", price: 10, duration: 900, speed: "5 Mbps", color: "bg-blue-500" },
    { id: 2, name: "1 Hour", price: 30, duration: 3600, speed: "10 Mbps", color: "bg-green-500" },
    { id: 3, name: "3 Hours", price: 80, duration: 10800, speed: "15 Mbps", color: "bg-purple-500" },
    { id: 4, name: "1 Day", price: 200, duration: 86400, speed: "20 Mbps", color: "bg-orange-500" },
    { id: 5, name: "1 Week", price: 1000, duration: 604800, speed: "25 Mbps", color: "bg-red-500" },
    { id: 6, name: "1 Month", price: 3000, duration: 2592000, speed: "30 Mbps", color: "bg-indigo-500" },
  ];

  // Initialize packages
  useEffect(() => {
    setPackages(mockPackages);
    
    // Simulate fetching packages from API
    // fetch('/api/hotspot/packages')
    //   .then(res => res.json())
    //   .then(data => setPackages(data));
  }, []);

  // Timer for connection countdown
  useEffect(() => {
    if (remainingTime > 0 && isConnecting) {
      const timer = setTimeout(() => {
        setRemainingTime(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [remainingTime, isConnecting]);

  // Format time
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Handle package selection
  const handlePackageSelect = (pkg) => {
    setSelectedPackage(pkg);
    setActiveTab('payment');
    setError('');
  };

  // Handle payment submission
  const handlePayment = async (e) => {
    e.preventDefault();
    
    if (!phoneNumber || phoneNumber.length < 10) {
      setError('Please enter a valid phone number');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setSuccessMessage('Payment successful! Connecting to WiFi...');
      setIsLoading(false);
      
      // Start connection process
      setTimeout(() => {
        setIsConnecting(true);
        // Simulate connection process
        setTimeout(() => {
          setIsConnecting(false);
          setIsConnected(true);
          setSessionInfo({
            package: selectedPackage.name,
            expiresAt: new Date(Date.now() + selectedPackage.duration * 1000),
            device: 'iPhone 14',
            speed: selectedPackage.speed
          });
        }, 3000);
      }, 2000);

    } catch (err) {
      setError('Payment failed. Please try again.');
      setIsLoading(false);
    }
  };

  // Handle voucher submission
  const handleVoucherSubmit = async (e) => {
    e.preventDefault();
    
    if (!voucherCode) {
      setError('Please enter voucher code');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate success
      setSuccessMessage('Voucher accepted! Connecting...');
      setIsLoading(false);
      
      setTimeout(() => {
        setIsConnected(true);
        setSessionInfo({
          package: "Voucher Access",
          expiresAt: new Date(Date.now() + 3600000), // 1 hour
          device: 'Samsung Galaxy',
          speed: '10 Mbps'
        });
      }, 2000);

    } catch (err) {
      setError('Invalid voucher code');
      setIsLoading(false);
    }
  };

  // Handle logout
  const handleLogout = () => {
    setIsConnected(false);
    setSelectedPackage(null);
    setActiveTab('packages');
    setSuccessMessage('');
    setSessionInfo(null);
  };








  // Connection Status Component
  const ConnectionStatus = () => {
    if (isConnecting) {
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        >
          <div className="bg-white rounded-2xl p-8 text-center max-w-md mx-4">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 mx-auto mb-4"
            >
              <RefreshCw className="w-full h-full text-blue-500" />
            </motion.div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Connecting...</h3>
            <p className="text-gray-600 mb-4">Please wait while we establish your connection</p>
            <div className="bg-gray-100 rounded-full h-2 overflow-hidden">
              <motion.div
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 3 }}
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-full"
              />
            </div>
            <p className="text-sm text-gray-500 mt-2">Time remaining: {formatTime(remainingTime)}</p>
          </div>
        </motion.div>
      );
    }

    if (isConnected && sessionInfo) {
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        >
          <div className="bg-white rounded-2xl p-8 text-center max-w-md mx-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center"
            >
              <CheckCircle className="w-10 h-10 text-green-500" />
            </motion.div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Connected!</h3>
            <p className="text-gray-600 mb-6">You're now connected to the WiFi</p>
            
            <div className="space-y-4 text-left mb-6">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">Package</span>
                <span className="font-semibold">{sessionInfo.package}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">Expires</span>
                <span className="font-semibold">
                  {sessionInfo.expiresAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">Speed</span>
                <span className="font-semibold">{sessionInfo.speed}</span>
              </div>
            </div>
            
            <button
              onClick={handleLogout}
              className="w-full py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
            >
              Disconnect
            </button>
          </div>
        </motion.div>
      );
    }

    return null;
  };


  

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      {/* Connection Status Overlay */}
      <ConnectionStatus />
      
      {/* Main Container */}
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <motion.header
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex flex-col md:flex-row justify-between items-center mb-8"
        >
          <div className="flex items-center space-x-4 mb-4 md:mb-0">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl">
              <Wifi className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Premium WiFi Hotspot</h1>
              <p className="text-gray-400">Fast, Secure, Reliable Internet</p>
            </div>
          </div>
          
          <div className="text-right">
            <div className="flex items-center space-x-2 text-sm">
              <Shield className="w-4 h-4 text-green-400" />
              <span>🔒 Secure Connection</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <Users className="w-4 h-4" />
              <span>247 Active Users</span>
            </div>
          </div>
        </motion.header>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Device Info & Instructions */}
          <div className="lg:col-span-1 space-y-6">
            {/* Device Info Card */}
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700"
            >
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Info className="w-5 h-5 mr-2" />
                Device Information
              </h3>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-gray-900/50 rounded-lg">
                  <span className="text-gray-400">MAC Address</span>
                  <code className="font-mono text-sm">{mac}</code>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-900/50 rounded-lg">
                  <span className="text-gray-400">IP Address</span>
                  <code className="font-mono text-sm">{ip}</code>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-900/50 rounded-lg">
                  <span className="text-gray-400">Username</span>
                  <span className="font-medium">{username}</span>
                </div>
              </div>
            </motion.div>

            {/* Instructions Card */}
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700"
            >
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <AlertCircle className="w-5 h-5 mr-2" />
                How to Connect
              </h3>
              
              <ol className="space-y-3">
                {[
                  "Select a WiFi package below",
                  "Enter your phone number",
                  "Complete payment via M-Pesa",
                  "Automatically connect to WiFi"
                ].map((step, index) => (
                  <li key={index} className="flex items-start">
                    <span className="flex-shrink-0 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-sm mr-3 mt-0.5">
                      {index + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
              
              <div className="mt-6 p-4 bg-blue-900/30 rounded-lg border border-blue-800/50">
                <div className="flex items-center">
                  <Lock className="w-5 h-5 text-blue-400 mr-2" />
                  <span className="text-sm">
                    <strong>Tip:</strong> Save this page to automatically reconnect
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Support Card */}
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700"
            >
              <h3 className="text-lg font-semibold mb-4">Need Help?</h3>
              <div className="space-y-3">
                <button className="w-full text-left p-3 bg-gray-900/50 hover:bg-gray-800 rounded-lg transition-colors">
                  📞 Call Support: 0700 000 000
                </button>
                <button className="w-full text-left p-3 bg-gray-900/50 hover:bg-gray-800 rounded-lg transition-colors">
                  💬 Live Chat Support
                </button>
                <button className="w-full text-left p-3 bg-gray-900/50 hover:bg-gray-800 rounded-lg transition-colors">
                  📧 Email: support@wifi.co.ke
                </button>
              </div>
            </motion.div>
          </div>

          {/* Right Column - Main Content */}
          <div className="lg:col-span-2">
            {/* Tab Navigation */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="flex space-x-4 mb-6"
            >
              <button
                onClick={() => setActiveTab('packages')}
                className={`px-6 py-3 rounded-full font-medium transition-all ${
                  activeTab === 'packages'
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500'
                    : 'bg-gray-800 hover:bg-gray-700'
                }`}
              >
                <span className="flex items-center">
                  <CreditCard className="w-4 h-4 mr-2" />
                  Packages
                </span>
              </button>
              
              <button
                onClick={() => setActiveTab('voucher')}
                className={`px-6 py-3 rounded-full font-medium transition-all ${
                  activeTab === 'voucher'
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500'
                    : 'bg-gray-800 hover:bg-gray-700'
                }`}
              >
                <span className="flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  Voucher Code
                </span>
              </button>
            </motion.div>

            {/* Packages Tab */}
            {activeTab === 'packages' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                {/* Success Message */}
                {successMessage && (
                  <motion.div
                    initial={{ y: -10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="p-4 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-xl"
                  >
                    <div className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
                      <span>{successMessage}</span>
                    </div>
                  </motion.div>
                )}

                {/* Error Message */}
                {error && (
                  <motion.div
                    initial={{ y: -10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="p-4 bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-500/30 rounded-xl"
                  >
                    <div className="flex items-center">
                      <AlertCircle className="w-5 h-5 text-red-400 mr-2" />
                      <span>{error}</span>
                    </div>
                  </motion.div>
                )}

                {/* Packages Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {packages.map((pkg) => (
                    <motion.div
                      key={pkg.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handlePackageSelect(pkg)}
                      className={`${pkg.color} rounded-2xl p-6 cursor-pointer transition-all hover:shadow-2xl`}
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-2xl font-bold">{pkg.name}</h3>
                          <p className="text-white/80">High-Speed Internet</p>
                        </div>
                        <Zap className="w-8 h-8 text-white/50" />
                      </div>
                      
                      <div className="mb-6">
                        <div className="text-3xl font-bold mb-1">Ksh {pkg.price}</div>
                        <div className="text-sm opacity-80">
                          {pkg.duration >= 86400
                            ? `${pkg.duration / 86400} Days`
                            : pkg.duration >= 3600
                            ? `${pkg.duration / 3600} Hours`
                            : `${pkg.duration / 60} Minutes`}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Globe className="w-4 h-4" />
                          <span className="text-sm">{pkg.speed}</span>
                        </div>
                        <ArrowRight className="w-5 h-5" />
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Payment Form */}
                {selectedPackage && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700"
                  >
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h3 className="text-xl font-bold">Selected Package</h3>
                        <p className="text-gray-400">{selectedPackage.name} • {selectedPackage.speed}</p>
                      </div>
                      <button
                        onClick={() => setSelectedPackage(null)}
                        className="p-2 hover:bg-gray-700 rounded-lg"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    
                    <form onSubmit={handlePayment}>
                      <div className="mb-6">
                        <label className="block text-sm font-medium mb-2">
                          Phone Number (M-Pesa)
                        </label>
                        <div className="flex">
                          <div className="flex-shrink-0 px-4 py-3 bg-gray-900 border border-r-0 border-gray-700 rounded-l-lg">
                            +254
                          </div>
                          <input
                            type="tel"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                            placeholder="7XX XXX XXX"
                            className="flex-grow p-3 bg-gray-900 border border-gray-700 rounded-r-lg focus:outline-none focus:border-blue-500"
                            maxLength="9"
                          />
                        </div>
                      </div>
                      
                      <div className="mb-6 p-4 bg-gray-900/50 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <span>Package</span>
                          <span className="font-semibold">{selectedPackage.name}</span>
                        </div>
                        <div className="flex justify-between items-center mb-2">
                          <span>Duration</span>
                          <span>
                            {selectedPackage.duration >= 86400
                              ? `${selectedPackage.duration / 86400} Days`
                              : selectedPackage.duration >= 3600
                              ? `${selectedPackage.duration / 3600} Hours`
                              : `${selectedPackage.duration / 60} Minutes`}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Speed</span>
                          <span>{selectedPackage.speed}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between mb-6">
                        <div>
                          <div className="text-2xl font-bold">Ksh {selectedPackage.price}</div>
                          <div className="text-sm text-gray-400">Total Amount</div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <img src="/mpesa-logo.png" alt="M-Pesa" className="h-8" />
                          <span className="text-sm">Payment Method</span>
                        </div>
                      </div>
                      
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isLoading ? (
                          <span className="flex items-center justify-center">
                            <RefreshCw className="w-5 h-5 animate-spin mr-2" />
                            Processing Payment...
                          </span>
                        ) : (
                          <span className="flex items-center justify-center">
                            Pay Now
                            <ArrowRight className="w-5 h-5 ml-2" />
                          </span>
                        )}
                      </button>
                      
                      <p className="text-sm text-gray-400 text-center mt-4">
                        You will receive an M-Pesa prompt on your phone
                      </p>
                    </form>
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* Voucher Tab */}
            {activeTab === 'voucher' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700"
              >
                <div className="text-center mb-8">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center">
                    <Clock className="w-8 h-8 text-blue-400" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Enter Voucher Code</h3>
                  <p className="text-gray-400">Redeem your prepaid voucher code</p>
                </div>
                
                <form onSubmit={handleVoucherSubmit}>
                  <div className="mb-6">
                    <label className="block text-sm font-medium mb-2">
                      Voucher Code
                    </label>
                    <input
                      type="text"
                      value={voucherCode}
                      onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
                      placeholder="Enter 8-digit voucher code"
                      className="w-full p-4 bg-gray-900 border border-gray-700 rounded-xl focus:outline-none focus:border-blue-500 text-center font-mono text-xl tracking-widest"
                      maxLength="8"
                    />
                  </div>
                  
                  {error && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                      <div className="flex items-center">
                        <AlertCircle className="w-5 h-5 text-red-400 mr-2" />
                        <span>{error}</span>
                      </div>
                    </div>
                  )}
                  
                  <button
                    type="submit"
                    disabled={isLoading || !voucherCode}
                    className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center">
                        <RefreshCw className="w-5 h-5 animate-spin mr-2" />
                        Validating Voucher...
                      </span>
                    ) : (
                      'Connect with Voucher'
                    )}
                  </button>
                </form>
                
                <div className="mt-8 p-4 bg-gray-900/50 rounded-xl border border-gray-700">
                  <h4 className="font-semibold mb-2 flex items-center">
                    <Info className="w-4 h-4 mr-2" />
                    About Vouchers
                  </h4>
                  <ul className="space-y-2 text-sm text-gray-400">
                    <li>• Vouchers are case-insensitive</li>
                    <li>• Single use only</li>
                    <li>• Cannot be combined with other offers</li>
                    <li>• Expire 30 days after purchase</li>
                  </ul>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Footer */}
        <motion.footer
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-400 text-sm"
        >
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <div className="flex items-center space-x-2">
                <WifiOff className="w-4 h-4" />
                <span>Hotspot v2.0 • Terms & Conditions • Privacy Policy</span>
              </div>
            </div>
            <div>
              © {new Date().getFullYear()} Premium WiFi Hotspot. All rights reserved.
            </div>
          </div>
        </motion.footer>
      </div>
    </div>
  );
};

export default HotspotLogin;