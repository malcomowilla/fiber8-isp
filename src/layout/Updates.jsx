import { RiErrorWarningLine, RiDownloadLine } from "react-icons/ri";
import { APP_VERSION, APP_NAME, APP_DESCRIPTION } from '../version';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';





const Updates = () => {
  const [showUpdate, setShowUpdate] = useState(false);
  const [storedVersion, setStoredVersion] = useState('');

  const releaseDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  useEffect(() => {
    // Check localStorage for previous version
    const lastSeenVersion = localStorage.getItem('lastSeenVersion');
    
    if (lastSeenVersion) {
      setStoredVersion(lastSeenVersion);
      // Compare versions (simple string comparison works for semantic versioning)
      if (lastSeenVersion !== APP_VERSION) {
        setShowUpdate(true);
      }
    } else {
      // First time visit or no version stored
      localStorage.setItem('lastSeenVersion', APP_VERSION);
      setStoredVersion(APP_VERSION);
    }
  }, []);

  const handleUpdate = () => {
    // Update the stored version and hide the component
    localStorage.setItem('lastSeenVersion', APP_VERSION);
    setShowUpdate(false);
    window.location.reload();
  };

  if (!showUpdate) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-md mx-auto bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow-lg overflow-hidden mb-4"
    >
      <div className="p-6">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <div className="relative">
              <RiErrorWarningLine className="text-3xl text-yellow-500 animate-pulse" />
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full border-2 border-white"></div>
            </div>
          </div>
          
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-800 mb-1">New Version Available!</h3>
            <p className="text-gray-600 mb-3">{APP_NAME} {APP_VERSION} is ready to use.</p>
            
            <div className="bg-white rounded-lg p-3 mb-4 shadow-inner">
              <div className="flex justify-between items-center text-sm">
                <span className="font-medium text-gray-700">Previous Version:</span>
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md">{storedVersion}</span>
              </div>
              <div className="flex justify-between items-center text-sm mt-2">
                <span className="font-medium text-gray-700">New Version:</span>
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-md">{APP_VERSION}</span>
              </div>
              <div className="flex justify-between items-center text-sm mt-2">
                <span className="font-medium text-gray-700">Released:</span>
                <span className="text-gray-600">{releaseDate}</span>
              </div>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={handleUpdate}
                className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors duration-200"
              >
                <RiDownloadLine />
                Refresh to Update
              </button>
              <button 
                onClick={() => setShowUpdate(false)}
                className="flex-1 border border-gray-300 hover:bg-gray-50 text-gray-700 py-2 px-4 rounded-lg transition-colors duration-200"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
        
        {APP_DESCRIPTION && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-500 italic">{APP_DESCRIPTION}</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Updates;