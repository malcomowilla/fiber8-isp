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

import { IoSparklesOutline } from "react-icons/io5";

import { 
  IoCheckmarkCircleOutline, 
  IoCloseCircleOutline 
} from 'react-icons/io5';


const License = ({expiry, condition, status, expiry2, condition2, status2, calculateTimeRemaining}) => {
  return (
    <div>


<div className='flex items-center gap-2 mt-2 bg-white border dark:bg-gray-800 border-t-red-600 px-4 py-2 rounded-lg'>
  <div className='flex'>
    {condition ? (
      <IoWarningOutline className='text-red-600 dark:text-red-300 text-xl animate-pulse' />
    ) : (
      <IoCheckmarkCircleOutline className='text-green-600 dark:text-green-300 text-xl animate-bounce' />
    )}
    <div className='flex flex-col'>
      <span className='text-red-800 dark:text-red-200 font-medium'>
        <span className={`
          ${condition ? 'text-red-800 dark:text-red-200' : 'text-green-800 dark:text-green-200'}
          `}> <span className='font-bold'>PPPOE License</span> -  </span> <span className='text-black
           font-light dark:text-white'>Your
           license expires in
        <span className='ml-2 text-red-600 dark:text-red-300'>
            ({ expiry === 'No license' ? 'No license' : calculateTimeRemaining(expiry)})
          </span>

           </span>
       
      </span>
      
      <p className='text-black text-sm font-light dark:text-white'>
        Expiry Date: <span className='font-bold'>{expiry}</span>
          
      </p>

      <p className={`text-black text-sm 
        font-light dark:text-white`}>
        Status: <span className={`font-bold
          
                  ${status === 'active' ? 'text-emerald-600' : 'text-red-600'}

          `}>{status === 'Not Active' ? 'Not Active' : status}</span>
          
      </p>

    </div>
  </div>
</div>




<div className='flex items-center gap-2 mt-2 bg-white border dark:bg-gray-800
 border-t-red-600 px-4 py-2 rounded-lg'>
  <div className='flex'>
    {condition2 ? (
      <IoWarningOutline className='text-red-600 dark:text-red-300 text-xl animate-pulse' />
    ) : (
      <IoCheckmarkCircleOutline className='text-green-600 dark:text-green-300 text-xl animate-bounce' />
    )}
    <div className='flex flex-col'>
      <span className='text-red-800 dark:text-red-200 font-medium'>
        <span className={`
          ${condition2 ? 'text-red-800 dark:text-red-200' : 'text-green-800 dark:text-green-200'}
          `}> <span className='font-bold'>Hotspot License- </span>  </span> <span className='text-black 
          font-light dark:text-white'>Your license expires in
        <span className='ml-2 text-red-600 dark:text-red-300'>
            ({ expiry2 === 'No license' ? 'No license' : calculateTimeRemaining(expiry2)})
          </span>

           </span>
       
      </span>
      
      <p className='text-black text-sm font-light dark:text-white'>
        Expiry Date: <span className='font-bold'>{expiry2}</span>
          
      </p>

      <p className={`text-black text-sm 
        font-light dark:text-white`}>
        Status: <span className={`font-bold
          
                  ${status2 === 'active' ? 'text-emerald-600' : 'text-red-600'}

          `}>{status2}</span>
          
      </p>

    </div>
  </div>
</div>
    </div>
  )
}

export default License