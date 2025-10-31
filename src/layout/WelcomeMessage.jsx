
import { useContext, useState, useEffect, useCallback} from 'react'
import {ApplicationContext} from '../context/ApplicationContext'
import {useApplicationSettings} from '../settings/ApplicationSettings'
import ShortCuts from './ShortCuts'
import { useLocation } from 'react-router-dom';

import React from 'react'
import { IoWarningOutline } from "react-icons/io5";
import { 
  Cable as CableIcon,
  Wifi as WifiIcon,
  CalendarMonth as CalendarMonthIcon
} from '@mui/icons-material';



const WelcomeMessage = () => {


const {fetchCurrentUser, currentUser, companySettings,

  selectedProvider, setSelectedProvider,
  smsSettingsForm, setSmsSettingsForm,
  smsBalance, setSmsBalance,
  showMenu1, setShowMenu1, showMenu2, setShowMenu2, showMenu3, setShowMenu3,
      showMenu4, setShowMenu4, showMenu5, setShowMenu5, showMenu6, setShowMenu6,
       showMenu7, setShowMenu7, showMenu8, setShowMenu8, showMenu9, setShowMenu9,
        showMenu10, setShowMenu10, showMenu11, setShowMenu11, showMenu12, setShowMenu12,
        providerSms, setProviderSms
} = useApplicationSettings()

const { company_name, contact_info, email_info, logo_preview} = companySettings

const [date, setDate] = useState(new Date().toLocaleTimeString('en-US', { hour: 'numeric', 
  minute: 'numeric', second: 'numeric', hour12: true }))


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



 useEffect(() => {
    const interval = setInterval(() => {
      setDate(new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true }));
  
    }, 1000);
    return () => clearInterval(interval);
  
  }, [date]);





  return (
    <div>
       <div className="p-2">
            <p className="font-extrabold  text-xl 
           ">
              <span className=' bg-gradient-to-r from-green-600 via-blue-400 to-cyan-500 bg-clip-text
  
  text-transparent 
            '>{getTimeBasedGreeting()}, {company_name || 'Aitechs'},</span>
            </p>
            <p className="dark:text-white text-black 
            
            text-sm mt-1 welcome-message">
              {getWelcomeMessage()}
            </p>
          </div>

          <p  className="capitalize mb-10 
           bg-gradient-to-r from-green-600 via-blue-400 to-cyan-500 bg-clip-text
  
  text-transparent 
            welcome-message
          text-2xl timer">
            <p id='timer' className='
             bg-gradient-to-r from-green-600 via-blue-400 to-cyan-500 bg-clip-text
  
  text-transparent 
            '>{date} </p>
          </p>
    </div>
  )
}

export default WelcomeMessage
