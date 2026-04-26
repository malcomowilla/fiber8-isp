import { motion } from "framer-motion";
import { 
  IoWarningOutline,
  IoCheckmarkCircleOutline 
} from 'react-icons/io5';
import { LuBotMessageSquare } from "react-icons/lu";

const License = ({expiry, condition, status, expiry2, condition2, status2, 
  calculateTimeRemaining, smsBalance}) => {
  
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
      










      {/* Hotspot License Card */}
      
<div className="rounded-xl shadow-lg p-6
         overflow-hidden flex flex-col">
  <div className= {`relative flex w-full p-3 pr-12 text-sm text-white
   ${status2 === 'expired' ? 'bg-red-500' : 'bg-green-500'}
   rounded-md` }>
    
    Hotspot And PPPOE License
    
  </div>
  <div className="p-3">
    <div className="flex items-center mb-2 ">
        
          <div className="flex items-start gap-4">
          <div className="relative ">
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
            <div className="absolute inset-0 flex items-center  justify-center">
              {status2 === 'expired' ? (
                <IoWarningOutline className="text-red-500 dark:text-red-400 text-xl animate-pulse" />
              ) : (
                <IoCheckmarkCircleOutline className="text-green-500 dark:text-green-400 text-xl" />
              )}
            </div>
          </div>
          </div>
        <h5 className="ml-2 text-slate-800 text-xl dark:text-white font-semibold">
        Hotspot And PPOE License
        </h5>
    </div>
    

      <div className="space-y-2 ">
              
                <span className={`text-sm font-medium ${
                  status2 === 'active' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {status2}
                </span>
              </div>


               <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600
                 dark:text-gray-500 ">Time Left:</span>
                <span className="text-sm font-medium text-gray-800 
                dark:text-white">
                  {expiry2 === 'No license' ? 'N/A' : calculateTimeRemaining(expiry2)}
                </span>
              </div>


<div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-500">Expires:</span>
                <span className="text-sm font-medium text-gray-800
                 dark:text-white">
                  {expiry2 === 'No license' ? 'No license' : expiry2}
                </span>
              </div>

  </div>
</div>


    
    </div>
  );
};

export default License;