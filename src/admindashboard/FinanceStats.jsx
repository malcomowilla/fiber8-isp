
import { motion } from "framer-motion";
import { 
  FiDollarSign, 
  FiTrendingUp, 
  FiCalendar,
  FiBarChart2
} from 'react-icons/fi';
import { FaPercentage } from 'react-icons/fa';










const FinanceStats = ({ 
    todayRevenue=12580 ,
  monthRevenue=284500,
  growthRate  = 8.5,
}) => {



    const lastFourMonths={
   
    months: [
      { name: 'Mar', revenue: 245000 },
      { name: 'Apr', revenue: 280000 },
      { name: 'May', revenue: 312000 },
      { name: 'Jun', revenue: 284500 }
    ]
  } 


  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
      {/* Today's Revenue */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        whileHover={{ scale: 1.03 }}
        className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg overflow-hidden text-white"
      >
        <div className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm opacity-80">Today's Revenue</p>
              <h3 className="text-2xl font-bold mt-1">${todayRevenue}</h3>
            </div>
            <div className="p-3 rounded-full bg-white/20">
              <FiDollarSign className="text-xl" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <FiTrendingUp className="mr-1" />
            <span>Live updates</span>
          </div>
        </div>
      </motion.div>

      {/* This Month's Revenue */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        whileHover={{ scale: 1.03 }}
        className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg overflow-hidden text-white"
      >
        <div className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm opacity-80">This Month</p>
              <h3 className="text-2xl font-bold mt-1">${monthRevenue}</h3>
            </div>
            <div className="p-3 rounded-full bg-white/20">
              <FiCalendar className="text-xl" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <div className="flex items-center mr-3">
              <FaPercentage className="mr-1" />
              <span>{growthRate}% vs last month</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Last 4 Months Trend */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        whileHover={{ scale: 1.03 }}
        className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg overflow-hidden text-white lg:col-span-2"
      >
        <div className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm opacity-80">Last 4 Months</p>
              <h3 className="text-2xl font-bold mt-1">${lastFourMonths.total}</h3>
            </div>
            <div className="p-3 rounded-full bg-white/20">
              <FiBarChart2 className="text-xl" />
            </div>
          </div>
          
          <div className="mt-4 grid grid-cols-4 gap-2">
            {lastFourMonths.months.map((month, index) => (
              <div key={index} className="text-center">
                <div className="h-24 relative">
                  {/* Animated bar chart */}
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${(month.revenue / lastFourMonths.max) * 80}%` }}
                    transition={{ duration: 0.8, delay: index * 0.1 }}
                    className="w-full bg-white/30 rounded-t-sm absolute bottom-0"
                  />
                  <div className="absolute bottom-0 w-full text-center text-xs pt-1">
                    ${(month.revenue / 1000).toFixed(1)}k
                  </div>
                </div>
                <p className="text-xs mt-1 opacity-80">{month.name}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Additional Stats Row */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700 lg:col-span-4"
      >
        <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">Avg. Daily</p>
            <h4 className="text-xl font-bold">${(todayRevenue * 1.3)}</h4>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">Projected Month</p>
            <h4 className="text-xl font-bold">${(monthRevenue * 1.15)}</h4>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">Best Day</p>
            <h4 className="text-xl font-bold">${(todayRevenue * 2.1)}</h4>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">Growth</p>
            <h4 className="text-xl font-bold text-green-500">+{growthRate}%</h4>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// Example usage:


export default FinanceStats;