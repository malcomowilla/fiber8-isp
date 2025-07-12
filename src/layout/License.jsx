import { motion } from "framer-motion";
import { 
  IoWarningOutline,
  IoCheckmarkCircleOutline 
} from 'react-icons/io5';
import { LuBotMessageSquare } from "react-icons/lu";

const License = ({expiry, condition, status, expiry2, condition2, status2, calculateTimeRemaining,
  smsBalance
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
      {/* PPPOE License Card */}
      <motion.div
        whileHover={{ y: -2 }}
        className="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border-t-4 border-t-red-600"
      >
        {condition ? (
          <IoWarningOutline className="text-red-600 dark:text-red-300 text-xl animate-pulse" />
        ) : (
          <IoCheckmarkCircleOutline className="text-green-600 dark:text-green-300 text-xl" />
        )}
        
        <div className="flex-1">
          <div className="flex items-center gap-1">
            <span className="font-bold text-gray-800 dark:text-gray-200">PPPOE License</span>
            <span className="text-gray-500 dark:text-gray-400">-</span>
            <span className="text-gray-600 dark:text-gray-300">
              {expiry === 'No license' ? 'No license' : calculateTimeRemaining(expiry)}
            </span>
          </div>
          
          <div className="mt-1 text-sm text-gray-600 dark:text-gray-300">
            <p>Expiry: <span className="font-medium">{expiry}</span></p>
            <p>
              Status: 
              <span className={`ml-1 font-medium ${
                status === 'active' ? 'text-emerald-600' : 'text-red-600'
              }`}>
                {status}
              </span>
            </p>
          </div>
        </div>
      </motion.div>

      {/* Hotspot License Card */}
      <motion.div
        whileHover={{ y: -2 }}
        className="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border-t-4 border-t-red-600"
      >
        {condition2 ? (
          <IoWarningOutline className="text-red-600 dark:text-red-300 text-xl animate-pulse" />
        ) : (
          <IoCheckmarkCircleOutline className="text-green-600 dark:text-green-300 text-xl" />
        )}
        
        <div className="flex-1">
          <div className="flex items-center gap-1">
            <span className="font-bold text-gray-800 dark:text-gray-200">Hotspot License</span>
            <span className="text-gray-500 dark:text-gray-400">-</span>
            <span className="text-gray-600 dark:text-gray-300">
              {expiry2 === 'No license' ? 'No license' : calculateTimeRemaining(expiry2)}
            </span>
          </div>
          
          <div className="mt-1 text-sm text-gray-600 dark:text-gray-300">
            <p>Expiry: <span className="font-medium">{expiry2}</span></p>
            <p>
              Status: 
              <span className={`ml-1 font-medium ${
                status2 === 'active' ? 'text-emerald-600' : 'text-red-600'
              }`}>
                {status2}
              </span>
            </p>
          </div>
        </div>
      </motion.div>

      {/* SMS Balance Card */}
      <motion.div
        whileHover={{ y: -2 }}
        className="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border-t-4 border-t-blue-600"
      >
        <LuBotMessageSquare className="text-blue-600 dark:text-blue-300 text-xl" />
        <div className="flex-1">
          <div className="flex items-center gap-1">
            <span className="font-bold text-gray-800 dark:text-gray-200">SMS Balance</span>
          </div>
          <div className="mt-1 text-sm text-gray-600 dark:text-gray-300">
            <p>Available: <span className="font-medium">{smsBalance}</span></p>
            <p>Last Top-up: <span className="font-medium">-</span></p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default License;