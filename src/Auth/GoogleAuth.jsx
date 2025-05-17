import React, { useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { motion } from 'framer-motion';
import {useApplicationSettings} from '../settings/ApplicationSettings'






const GoogleAuthenticatorSetup = ({ userEmail, onComplete }) => {
  const [setupData, setSetupData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isCopied, setIsCopied] = useState(false);


  const {currentUser, setCurrentUser, currentUsername, currentEmail, setOpenDropDown} = useApplicationSettings()

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 }
    }
  };




  
const subdomain = window.location.hostname.split('.')[0]
  const initiateSetup = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/setup_google_authenticator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 
            'X-Subdomain': subdomain,
         },
        body: JSON.stringify({ email: currentEmail }),});
      
      if (!response.ok) throw new Error('Setup failed');
      const data = await response.json();
      setSetupData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!setupData) {
    return (
      <div className="text-center p-8">
        <h2 className="text-2xl font-bold mb-4">Enable Two-Factor Authentication</h2>
        <p className="mb-6">Click below to begin setting up Google Authenticator</p>
        <button
          onClick={initiateSetup}
          disabled={isLoading}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg disabled:bg-blue-300 hover:bg-blue-700 transition-colors"
        >
          {isLoading ? 'Preparing Setup...' : 'Begin Setup'}
        </button>
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </div>
    );
  }

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden p-6"
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Set Up Google Authenticator
      </h2>

      <motion.div variants={itemVariants}>
        <div className="mb-6">
          <p className="text-gray-600 mb-4">
            Scan this QR code with <strong>Google Authenticator</strong> or similar app:
          </p>
          
          <div className="flex justify-center mb-6">
            <img 
              src={setupData.qr_code_data_url} 
              alt="2FA QR Code"
              className="border-4 border-white shadow-lg rounded-lg w-48 h-48"
            />
          </div>

          <div className="mb-6">
            <p className="text-gray-600 mb-2">Or enter this code manually:</p>
            <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
              <code className="font-mono text-lg">{setupData.otp_secret}</code>
              <CopyToClipboard 
                text={setupData.otp_secret}
                onCopy={() => {
                  setIsCopied(true);
                  setTimeout(() => setIsCopied(false), 2000);
                }}
              >
                <button className="px-3 py-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 transition">
                  {isCopied ? 'Copied!' : 'Copy'}
                </button>
              </CopyToClipboard>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg mb-6">
            <h3 className="font-semibold text-blue-800 mb-2">How to set up:</h3>
            <ol className="list-decimal list-inside space-y-2 text-blue-700">
              <li>Open Google Authenticator on your phone</li>
              <li>Tap the "+" icon and select "Scan QR code"</li>
              <li>Point your camera at the QR code above</li>
              <li>Or choose "Enter setup key" and paste the manual code</li>
            </ol>
          </div>

          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
            <p className="text-yellow-700">
              <strong>Important:</strong> Save these backup codes in a secure place. Each code can be used once if you lose access to your authenticator app.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-6">
            {setupData.backup_codes.map((code, index) => (
              <div 
                key={index}
                className="bg-gray-50 p-3 rounded text-center font-mono select-all"
              >
                {code}
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <CopyToClipboard text={setupData.backup_codes.join('\n')}>
              <button 
                className="flex-1 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition"
                onClick={() => {
                  setIsCopied(true);
                  setTimeout(() => setIsCopied(false), 2000);
                }}
              >
                {isCopied ? 'Copied!' : 'Copy All Codes'}
              </button>
            </CopyToClipboard>
            <button className="flex-1 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition">
              Download Codes
            </button>
          </div>

          <button
            onClick={onComplete}
            className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
          >
            I've Saved My Backup Codes - Finish Setup
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default GoogleAuthenticatorSetup;