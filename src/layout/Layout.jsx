import {Outlet} from 'react-router-dom'
import Sidebar from '../sidebar/Sidebar'
import Header from '../header/Header'

import { useContext, useState, useEffect, useCallback} from 'react'
import {ApplicationContext} from '../context/ApplicationContext'
import {useApplicationSettings} from '../settings/ApplicationSettings'
import { Button } from "@/components/ui/button"
import Timer from '../timer/Timer'
import ShortCuts from './ShortCuts'
import { useLocation } from 'react-router-dom';
import DashboardStatistics from '../hotspot_page/DashboardStatistics'
import { APP_VERSION, APP_NAME, APP_DESCRIPTION } from '../version';
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





// import { ReloadIcon } from "@radix-ui/react-icons"



// ${seeSidebar ? 'w-[240]  ' : 'w-[1px] overflow-hidden'
        
        
        
        
// }


const Layout = () => {


const {seeSidebar, theme


} = useContext(ApplicationContext);
  const [seeButton, setSeeButton] = useState(false)
const [loading, setloading] = useState(false)
const location = useLocation();

const {fetchCurrentUser, currentUser, companySettings,

  selectedProvider, setSelectedProvider,
  smsSettingsForm, setSmsSettingsForm,
  smsBalance, setSmsBalance
} = useApplicationSettings()

const { company_name, contact_info, email_info, logo_preview} = companySettings
const [datetime, setdateTime] = useState(true)
const [expiry, setExpiry] = useState('No license')
const [expiry2, setExpiry2] = useState('No license')
const [condition, setCondition] = useState(false)
const [condition2, setCondition2] = useState(false)
const [status, setStatus] = useState('Not Active')
const [status2, setStatus2] = useState('Not Active')
const [currentHotspotPlan, setCurrentHotspotPlan] = useState(null)
const [currentPPOEPlan, setCurrentPPOEPlan] = useState(null)





const [date, setDate] = useState(new Date().toLocaleTimeString('en-US', { hour: 'numeric', 
  minute: 'numeric', second: 'numeric', hour12: true }))

  const refreshPage = ()=> {
    window.location.reload(false);
    setloading(true)
  }
  useEffect(() => {
   setSeeButton(true)
  }, [seeButton]);



  useEffect(() => {
    const timeout = setTimeout(() => {
      setdateTime(false)
  
    }, 9000);
   clearTimeout(timeout)
  }, []);
   



  const getCurrentHotspotPlan = useCallback(
    async() => {
      const response = await fetch('/api/get_current_hotspot_plan', {
        headers: {
          'X-Subdomain': subdomain,
        },
      })
      const newData = await response.json()
      if (response.ok) {
        console.log('current hotspot plan', newData)
        setExpiry2(newData[0].expiry)
        setCondition2(newData[0].condition)
        setStatus2(newData[0].status)
        setCurrentHotspotPlan(newData[0].name)
        // setCurrentPPOEPlan(newData.message)
      }
    },
    [],
  )

useEffect(() => {
  getCurrentHotspotPlan()
 
}, [getCurrentHotspotPlan]);



  const getCurrentPPOEPlan = useCallback(
    async() => {
      const response = await fetch('/api/get_current_pppoe_plan', {
        headers: {
          'X-Subdomain': subdomain,
        },
      })
      const newData = await response.json()
      if (response.ok) {
        console.log('current pppoe plan', newData)
        setExpiry(newData[0].expiry)
        setCondition(newData[0].condition)
        setStatus(newData[0].status)
        setCurrentPPOEPlan(newData[0].name)
        // setCurrentPPOEPlan(newData.message)
      }
    },
    [],
  )

  useEffect(() => {
    getCurrentPPOEPlan()
   
  }, [getCurrentPPOEPlan]);
  
  
  useEffect(() => {
    const interval = setInterval(() => {
      setDate(new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true }));
  
    }, 1000);
    return () => clearInterval(interval);
  
  }, [date]);
  



useEffect(() => {
  
  fetchCurrentUser()
}, [fetchCurrentUser]);


  const getTimeBasedGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) {
      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 
        'Thursday', 'Friday', 'Saturday'];
      const today = days[new Date().getDay()];
      return `Happy ${today}, Rise and Shine`;
    }
    if (hour < 17) return "Having a Great Day";
    return "Good Evening";
  };

  const getWelcomeMessage = () => {
    const hour = new Date().getHours();
    if (hour < 12) {
      return "Ready to make today amazing? Let's see what's new! ☀️";
    } else if (hour < 17) {
      return "Hope your day is going wonderfully! Here's what's new ✨";
    } else if (hour < 22) {
      return "Wrapping up another productive day! Check out today's highlights 🌟";
    } else {
      return "Working late? Here's a quick overview of today 🌙";
    }
  };



const subdomain = window.location.hostname.split('.')[0];

  const getSmsBalance  = useCallback(
    async(selectedProvider) => {

      try {
        const response = await fetch(`/api/get_sms_balance?selected_provider=${selectedProvider}`, {
          headers: {
            'X-Subdomain': subdomain,
          },
        })
        const newData = await response.json()

        if (response.status === 403) {
          // toast.error('acess denied for sms balance', {
          //   duration: 4000,
          //   position: 'top-center',
          // })
        }
        if(response.ok){
console.log('sms balance', newData)
setSmsBalance(newData.message)
        }else{
         
            console.log('failed to fetch sms balance')
        }
      } catch (error) {
        console.log('error', error)
      }

    },
    [],
  )

  useEffect(() => {

    if (selectedProvider) {
      getSmsBalance(selectedProvider)
    }
    // getSmsBalance()
   
  }, [getSmsBalance, selectedProvider]);




  function calculateTimeRemaining(expiryDateString) {
    // Parse the expiry date (format: "June 07, 2025 at 05:12 PM")
    const expiryDate = new Date(expiryDateString.replace(' at ', ' '));
    const now = new Date();
    const diffMs = expiryDate - now;
    
    // If already expired
    if (diffMs <= 0) return 'today (license expired)';
  
    // Calculate time components
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  
    // Build human-readable string
    let result = '';
    if (diffDays > 0) {
      const weeks = Math.floor(diffDays / 7);
      const days = diffDays % 7;
      
      if (weeks > 0) result += `${weeks} week${weeks !== 1 ? 's' : ''} `;
      if (days > 0) result += `${days} day${days !== 1 ? 's' : ''} `;
    }
    
    if (diffHours > 0 && diffDays < 2) {
      result += `${diffHours} hour${diffHours !== 1 ? 's' : ''} `;
    }
    
    if (diffMinutes > 0 && diffDays === 0) {
      result += `${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''}`;
    }
  
    // If less than 1 minute remains
    if (result === '') return 'in less than 1 minute';
  
    return `in ${result.trim()}`;
  }
  return (
    <>
    <Header />
    <div
      className={`h-screen flex flex-col overflow-y-scroll transition-all duration-500 ease-in-out ${
        seeSidebar ? '' : 'sm:ml-64'
      }`}
    >
      <div className="flex-grow p-4 overflow-x-hidden">
        <div className={`p-4 h-full`}>
          <div className="p-2">
            <p className="font-extrabold dark:text-white text-black text-xl welcome-message">
              <span>{getTimeBasedGreeting()}, {company_name}</span>
            </p>
            <p className="dark:text-white text-black text-sm mt-1 welcome-message">
              {getWelcomeMessage()}
            </p>
          </div>

          <p className="capitalize mb-10 dark:text-white text-black text-2xl">
            {date}
          </p>
          <motion.div 
  className="flex items-center px-6 py-4 mb-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-600"
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
      Current Plan: <span className="text-blue-600 dark:text-blue-300">{currentPPOEPlan}</span>
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

  {/* Rest of your menu items */}
  {/* ... */}

          {/* {smsBalance && (
    <div className="flex items-center gap-2 bg-white border
    dark:bg-gray-800 dark:border-gray-700
    border-t-blue-600 px-4 py-2 rounded-lg">
      <FaSms className="text-blue-600 dark:text-blue-300 text-xl" />
      <span className="text-blue-800 dark:text-blue-200 font-medium">
        SMS Balance: <span className="font-bold">{smsBalance}</span>
      </span>
    </div>
  )} */}

<div className="flex items-center gap-2 bg-white border
    dark:bg-gray-800 dark:border-gray-700
    border-t-blue-600 px-4 py-2 rounded-lg">
      <FaSms className="text-blue-600 dark:text-blue-300 text-xl animate-bounce" />
      <span className="text-blue-800 dark:text-blue-200 font-medium">
        SMS Balance: <span className="font-bold">{smsBalance}</span>
      </span>
    </div>

{window.location.hostname === 'demo.aitechs.co.ke' && (
  <div className='flex items-center gap-2 mt-2 bg-white border
    dark:bg-gray-800 
    border-t-red-600 px-4 py-2 rounded-lg'>
    <IoWarningOutline className='text-red-600 dark:text-red-300 text-xl' />
    <span className='text-red-800 dark:text-red-200 font-medium'>
      Warning: This is a demo version of the system. Please do not use this for any real purpose.
    </span>
  </div>
)}

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
          `}>PPPOE License -  </span> <span className='text-black font-light dark:text-white'>Your license expires in
        <span className='ml-2 text-red-600 dark:text-red-300'>
            ({calculateTimeRemaining(expiry)} remaining)
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

          `}>{status}</span>
          
      </p>

    </div>
  </div>
</div>

<div className='flex items-center gap-2 mt-2 bg-white border dark:bg-gray-800 border-b-orange-600 px-4 py-2 rounded-lg'>
  <div className='flex'>
    {expiry2 === '' ? (
      <IoCloseCircleOutline className='text-gray-500 dark:text-gray-400 text-xl ani' />
    ) : condition2 ? (
      <IoWarningOutline className='text-orange-600 dark:text-orange-300 text-xl animate-pulse' />
    ) : (
      <IoCheckmarkCircleOutline className='text-green-600 dark:text-green-300 text-xl animate-bounce' />
    )}
    <div className='flex flex-col'>
      <span className={`${expiry2 === '' ? 'text-gray-800' : condition2 ? 'text-orange-800' : 'text-green-800'} dark:text-white font-medium`}>
        Hotspot License - <span className='text-black font-light dark:text-white'>
          {expiry2  || 'No active license'}
        </span>
      </span>
      <p className='text-black text-sm font-light dark:text-white'>
        {expiry2 === 'No license' ? (
          'No active license found'
        ) : (
          <>


<p className={`text-black text-sm 
        font-light dark:text-white`}>
        Status: <span className={`font-bold
          
                  ${status === 'active' ? 'text-emerald-600' : 'text-red-600'}

          `}>{status2}</span>
          
      </p>

            Expiry Date: <span className='font-bold'>{expiry2}</span>
            {condition2 && (
              <span className='ml-2 text-orange-600 dark:text-orange-300'>
                ({calculateTimeRemaining(expiry2)} remaining)
              </span>



            )}
          </>
        )}
      </p>
    </div>
  </div>
</div>




<div className='mt-4'>
          {location.pathname !== '/admin/customer-tickets' && location.pathname !== '/admin/hotspot-dashboard' && location.pathname !== '/admin/pppoe-subscribers' && <ShortCuts />}

          
          {/* {location.pathname !== '/admin/customer-tickets' && <ShortCuts />}
          {location.pathname !== '/admin/hotspot-dashboard' && <ShortCuts />} */}
          {location.pathname === '/admin/hotspot-dashboard' && <DashboardStatistics />}
          {location.pathname === '/admin/customer-tickets' && <TicketStatistics />}
          {location.pathname === '/admin/pppoe-subscribers' && <SubscriberStats />}

</div>
          <div className="mt-8">
            <Outlet />
          </div>
        </div>
      </div>

      <div className="flex flex-col p-4 font-mono">
        <Sidebar />
      </div>

<div className='flex justify-center'>
      <footer className="p-4  bottom-0 font-mono  bg-gray-200 dark:bg-gray-800">
        <p className="text-black dark:text-white ">
          {APP_DESCRIPTION} -  <span className='border-2 border-green-600
          p-2 rounded-lg
          '>Version {APP_VERSION}  </span>
        </p>
      </footer>
      </div>
    </div>
  </>
  )
}

export default Layout
