import React from 'react'

import { useContext, useState, useEffect, useCallback} from 'react'
import {ApplicationContext} from '../context/ApplicationContext'
import {useApplicationSettings} from '../settings/ApplicationSettings'
import { Button } from "@/components/ui/button"
import { useLocation } from 'react-router-dom';
import TicketStatistics from '../tickets/TicketStatistics'
import SubscriberStats from '../subscribers/SubscriberStats'
import { FaSms } from 'react-icons/fa';
import { IoWarningOutline } from "react-icons/io5";
import { motion } from "framer-motion";
import VerifiedIcon from '@mui/icons-material/Verified';
import { 
  Cable as CableIcon,
  Wifi as WifiIcon,
  CalendarMonth as CalendarMonthIcon
} from '@mui/icons-material';



const CurrentPlans = ({currentPPOEPlan, currentHotspotPlan}) => {
  return (
    <div>

<motion.div 
  className="flex items-center px-6 py-4 mb-4 bg-gradient-to-br from-red-50 to-indigo-50 dark:from-blue-800 dark:to-gray-700 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-600"
  initial={{ opacity: 0, scale: 0.95 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ duration: 0.3 }}
>
  {/* Animated verification badges */}
  <motion.div
    className="relative mr-4"
    animate={{
      rotate: [0, 5, -5, 0],
      y: [0, -3, 0]
    }}
    transition={{
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut"
    }}
  >
    <div className="relative">
      <VerifiedIcon className="text-blue-500 dark:text-blue-400 text-4xl drop-shadow-md" />
      <VerifiedIcon 
        className="text-indigo-400 dark:text-indigo-300 text-3xl absolute -bottom-1 -right-1 drop-shadow-md"
        style={{ transform: 'rotate(15deg)' }}
      />
    </div>
  </motion.div>

  {/* Plan information */}
  <div className="flex-1 space-y-2">
    <motion.p 
      className="font-bold text-gray-800 dark:text-white text-lg"
      initial={{ x: -10 }}
      animate={{ x: 0 }}
      transition={{ delay: 0.1 }}
    >
      Current PPPoe Plan: <span className="text-blue-600 dark:text-blue-300">{currentPPOEPlan || 'Not Set'}</span>
    </motion.p>
    
    <motion.p 
      className="font-bold text-gray-800 dark:text-white text-lg"
      initial={{ x: -10 }}
      animate={{ x: 0 }}
      transition={{ delay: 0.2 }}
    >
      Hotspot Plan: <span className="text-purple-600 dark:text-purple-300">
        {currentHotspotPlan || 'Not Set'}
      </span>
    </motion.p>
  </div>
</motion.div>
    </div>
  )
}

export default CurrentPlans