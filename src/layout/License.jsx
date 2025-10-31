import { motion } from "framer-motion";
import { 
  IoWarningOutline,
  IoCheckmarkCircleOutline 
} from 'react-icons/io5';
import { LuBotMessageSquare } from "react-icons/lu";

const License = ({expiry, condition, status, expiry2, condition2, status2, calculateTimeRemaining, smsBalance}) => {
  
  // Calculate percentage of time remaining (0-100)
  const calculateRemainingPercentage = (expiryDate) => {
    if (expiryDate === 'No license') return 0;
    
    const expiry = new Date(expiryDate);
    const now = new Date();
    const totalDuration = expiry - now;
    const oneYear = 365 * 24 * 60 * 60 * 1000; // 1 year in ms
    
    // If expired or more than 1 year remaining, cap at 0% or 100%
    if (totalDuration <= 0) return 0;
    if (totalDuration > oneYear) return 100;
    
    return Math.round((totalDuration / oneYear) * 100);
  };

  return (
    <div id='system-license' className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 w-full">
      {/* PPPOE License Card */}
      <motion.div
        whileHover={{ y: -5, scale: 1.02 }}
        className="relative p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
      >
        <div className="flex items-start gap-4">
          <div className="relative">
            <svg className="w-16 h-16" viewBox="0 0 36 36">
              {/* Background circle */}
              <path
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#eee"
                strokeWidth="3"
              />
              {/* Progress circle */}
              <path
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                 stroke={status === 'expired' ? "#ef4444" : "#10b981"}
                strokeWidth="3"
                strokeDasharray={`${calculateRemainingPercentage(expiry)}, 100`}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              {status === 'expired' ? (
                <IoWarningOutline className="text-red-500 dark:text-red-400 text-xl animate-pulse" />
              ) : (
                <IoCheckmarkCircleOutline className="text-green-500 dark:text-green-400 text-xl" />
              )}
            </div>
          </div>
          
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-1">
              PPPOE License
            </h3>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-300">Status:</span>
                <span className={`text-sm font-medium ${
                  status === 'active' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {status}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-300">Expires:</span>
                <span className="text-sm font-medium text-gray-800 dark:text-gray-100">
                  {expiry === 'No license' ? 'No license' : expiry}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-300">Time Left:</span>
                <span className="text-sm font-medium text-gray-800 dark:text-gray-100">
                  {expiry === 'No license' ? 'N/A' : calculateTimeRemaining(expiry)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Hotspot License Card */}
      <motion.div
        whileHover={{ y: -5, scale: 1.02 }}
        className="relative p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
      >
        <div className="flex items-start gap-4">
          <div className="relative">
            <svg className="w-16 h-16" viewBox="0 0 36 36">
              <path
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#eee"
                strokeWidth="3"
              />
              <path
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                // stroke={condition2 ? "#ef4444" : "#10b981"}
                stroke={status2 === 'expired' ? "#ef4444" : "#10b981"}
                strokeWidth="3"
                strokeDasharray={`${calculateRemainingPercentage(expiry2)}, 100`}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              {status2 === 'expired' ? (
                <IoWarningOutline className="text-red-500 dark:text-red-400 text-xl animate-pulse" />
              ) : (
                <IoCheckmarkCircleOutline className="text-green-500 dark:text-green-400 text-xl" />
              )}
            </div>
          </div>
          
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-1">
              Hotspot License
            </h3>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-300">Status:</span>
                <span className={`text-sm font-medium ${
                  status2 === 'active' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {status2}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-300">Expires:</span>
                <span className="text-sm font-medium text-gray-800 dark:text-gray-100">
                  {expiry2 === 'No license' ? 'No license' : expiry2}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-300">Time Left:</span>
                <span className="text-sm font-medium text-gray-800 dark:text-gray-100">
                  {expiry2 === 'No license' ? 'N/A' : calculateTimeRemaining(expiry2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

    
    </div>
  );
};

export default License;