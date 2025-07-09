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
import CurrentPlans from './CurrentPlans'

import SmsBalance from './SmsBalance'

import License from './License'
import Updates from './Updates'


const Layout = () => {


const {seeSidebar, theme


} = useContext(ApplicationContext);
  const [seeButton, setSeeButton] = useState(false)
const [loading, setloading] = useState(false)
const location = useLocation();

const {fetchCurrentUser, currentUser, companySettings,

  selectedProvider, setSelectedProvider,
  smsSettingsForm, setSmsSettingsForm,
  smsBalance, setSmsBalance,
  showMenu1, setShowMenu1, showMenu2, setShowMenu2, showMenu3, setShowMenu3,
      showMenu4, setShowMenu4, showMenu5, setShowMenu5, showMenu6, setShowMenu6,
       showMenu7, setShowMenu7, showMenu8, setShowMenu8, showMenu9, setShowMenu9,
        showMenu10, setShowMenu10, showMenu11, setShowMenu11, showMenu12, setShowMenu12,
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

        if (newData.length === 0) {
          setExpiry2('No license')
          setStatus2('Not Active')
        } else {
          console.log('current hotspot plan', newData)
        setExpiry2(newData[0]?.expiry)
        setCondition2(newData[0]?.condition)
        setStatus2(newData[0]?.status)
        setCurrentHotspotPlan(newData[0]?.name)
        }
        
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

        if (newData.length === 0) {
          setExpiry('No license')
          setStatus('Not Active')
        }else{
          setExpiry(newData[0]?.expiry)
          setCondition(newData[0]?.condition)
          setStatus(newData[0]?.status)
          setCurrentPPOEPlan(newData[0]?.name)
          // setCurrentPPOEPlan(newData.message)
        }

       
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

       const sms_provider= JSON.parse(localStorage.getItem('sms_provider')) || localStorage.getItem('sms_provider')


const subdomain = window.location.hostname.split('.')[0];

  const getSmsBalance  = useCallback(
    async(selectedProvider) => {

      try {
        const response = await fetch(`/api/get_sms_balance?selected_provider=${sms_provider}`, {
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




  const fetchSavedSmsSettings = useCallback(
  async() => {
    
    try {
      const response = await fetch(`/api/saved_sms_settings`, {
        headers: {
          'Content-Type': 'application/json',
          'X-Subdomain': subdomain,
        },
      });
  
      const data = await response.json();

      const newData = data.length > 0 
        ? data.reduce((latest, item) => new Date(item.sms_setting_updated_at) > new Date(latest.sms_setting_updated_at) ? item : latest, data[0])
        : null;
        console.log('newdata updated at', newData)
  
      if (response.ok) {
        console.log('Fetched saved  SMS settings:', newData);
        const { api_key, api_secret, sender_id, short_code, sms_provider, partnerID } = newData;
        // setSmsSettingsForm({ api_key, api_secret, sender_id, short_code, partnerID });
        setSelectedProvider(sms_provider);
        // setSelectedProvider(newData[0].sms_provider);
      } else {

        if (response.status === 402) {
        setTimeout(() => {
          // navigate('/license-expired')
          window.location.href='/license-expired'
         }, 1800);
        
      }
if (response.status === 401) {
 
   setTimeout(() => {
          // navigate('/license-expired')
          window.location.href='/signin'
         }, 1900);
}
      
      }
    } catch (error) {
     
    }
  },
  [],
)


useEffect(() => {
  fetchSavedSmsSettings();
 
}, [fetchSavedSmsSettings]);


  function calculateTimeRemaining(expiryDateString) {
    // Parse the expiry date (format: "June 07, 2025 at 05:12 PM")
    const expiryDate = new Date(expiryDateString?.replace(' at ', ' '));
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
  
    return `in ${result?.trim()}`;
  }
  return (
    <>
    <div onClick={() => {
            setShowMenu1(false)
            setShowMenu2(false)
            setShowMenu3(false)
            setShowMenu4(false)
            setShowMenu5(false)
            setShowMenu6(false)
            setShowMenu7(false)
            setShowMenu8(false)
            setShowMenu9(false)
            setShowMenu10(false)
            setShowMenu11(false)  
            setShowMenu12(false)
          }}>
    <Header />
    </div>

    
    <div
      className={`h-screen flex flex-col overflow-y-scroll transition-all duration-500 ease-in-out ${
        seeSidebar ? 'ml-10' : 'sm:ml-64'
      }`}
    >
      <div className="flex-grow p-4 overflow-x-hidden">
        <div className={`p-4 h-full`}>
          <div className="p-2">
            <p className="font-extrabold dark:text-white text-black text-xl welcome-message">
              <span>{getTimeBasedGreeting()}, {company_name || 'Aitechs'},</span>
            </p>
            <p className="dark:text-white text-black text-sm mt-1 welcome-message">
              {getWelcomeMessage()}
            </p>
          </div>

          <p className="capitalize mb-10 dark:text-white text-black text-2xl">
            {date}
          </p>
         
{location.pathname !== '/admin/hotspot_anlytics' &&
 location.pathname !== '/admin/admin-dashboard'  && location.pathname !== '/admin/pppoe-subscribers' 
 && location.pathname !== '/admin/networks-wireguard-config' &&
 location.pathname !== '/admin/network-components' &&
 location.pathname !== '/admin/nas' && location.pathname !== '/admin/nodes' &&
 location.pathname !== '/admin/upload-subscriber' &&
 location.pathname !== '/admin/user' &&
 location.pathname !== '/admin/user-group' && location.pathname !== '/admin/client-leads' &&
 location.pathname !== '/admin/settings' && location.pathname !== '/admin/google-authenticator' &&
 location.pathname !== '/admin/profile' && location.pathname !== '/admin/customer-tickets' &&
 location.pathname !== '/admin/hotspot-dashboard' && location.pathname !== '/admin/hotspot-package' &&
 location.pathname !== '/admin/hotspot-subscriptions' && 
 location.pathname !== '/admin/hotspot-templates' && 

 location.pathname !== '/admin/hotspot_settings' && location.pathname !== '/admin/send-sms' &&

 location.pathname !== '/admin/messages' && location.pathname !== '/admin/bulk-messages' && 
 location.pathname !== '/admin/pppoe-packages' && location.pathname !== '/admin/today-subscribers' &&

location.pathname !== '/admin/this-week-subscribers' && location.pathname !== '/admin/this-month-subscribers' &&
location.pathname !== '/admin/scheduler' && location.pathname !== '/admin/private-network' &&
location.pathname !== '/admin/analytics' && location.pathname !== '/admin/router_details' &&





<div
 onClick={() => {
            setShowMenu1(false)
            setShowMenu2(false)
            setShowMenu3(false)
            setShowMenu4(false)
            setShowMenu5(false)
            setShowMenu6(false)
            setShowMenu7(false)
            setShowMenu8(false)
            setShowMenu9(false)
            setShowMenu10(false)
            setShowMenu11(false)  
            setShowMenu12(false)
          }}
>
 <CurrentPlans
currentPPOEPlan={currentPPOEPlan} currentHotspotPlan={currentHotspotPlan} 
/>
</div>

}



<Updates />



{window.location.hostname === 'demo.aitechs.co.ke' && (
  <div
  onClick={() => {
            setShowMenu1(false)
            setShowMenu2(false)
            setShowMenu3(false)
            setShowMenu4(false)
            setShowMenu5(false)
            setShowMenu6(false)
            setShowMenu7(false)
            setShowMenu8(false)
            setShowMenu9(false)
            setShowMenu10(false)
            setShowMenu11(false)  
            setShowMenu12(false)
          }}
  className='flex items-center gap-2 mt-2 bg-white border
    dark:bg-gray-800 
    border-t-red-600 px-4 py-2 rounded-lg'>
    <IoWarningOutline className='text-red-600 dark:text-red-300 text-xl' />
    <span className='text-red-800 dark:text-red-200 font-medium'>
      Warning: This is a demo version of the system. Please do not use this for any real purpose.
    </span>
  </div>
)}






  {location.pathname !== '/admin/hotspot_anlytics' && location.pathname !== '/admin/pppoe-subscribers' 
  && location.pathname !== '/admin/networks-wireguard-config' && location.pathname !== '/admin/ip_networks' && 
  location.pathname !== '/admin/network-components' &&
  location.pathname !== '/admin/nas' &&
  location.pathname !== '/admin/user' && location.pathname !== '/admin/user-group' &&
  location.pathname !== '/admin/client-leads' &&
  location.pathname !== '/admin/profile' && location.pathname !== '/admin/customer-tickets' &&
  location.pathname !== '/admin/hotspot-dashboard' && location.pathname !== '/admin/hotspot-subscriptions' &&

  location.pathname !== '/admin/hotspot-templates' &&
  location.pathname !== '/admin/hotspot_settings' &&
  location.pathname !== '/admin/send-sms' &&
  location.pathname !== '/admin/messages' &&
  location.pathname !== '/admin/bulk-messages' &&  
  location.pathname !== '/admin/pppoe-packages' && location.pathname !== '/admin/today-subscribers' &&
  location.pathname !== '/admin/this-week-subscribers' && location.pathname !== '/admin/this-month-subscribers'  &&
 location.pathname !== '/admin/upload-subscriber' &&
location.pathname !== '/admin/scheduler' && location.pathname !== '/admin/private-network' &&
location.pathname !== '/admin/router_details' &&
<div
 onClick={() => {
            setShowMenu1(false)
            setShowMenu2(false)
            setShowMenu3(false)
            setShowMenu4(false)
            setShowMenu5(false)
            setShowMenu6(false)
            setShowMenu7(false)
            setShowMenu8(false)
            setShowMenu9(false)
            setShowMenu10(false)
            setShowMenu11(false)  
            setShowMenu12(false)
          }}
>
   <License expiry={expiry} condition={condition} 
  status={status}
 expiry2={expiry2} condition2={condition2} status2={status2}
  calculateTimeRemaining={calculateTimeRemaining}  smsBalance={smsBalance} />
  </div>
   }






<div 
onClick={() => {
            setShowMenu1(false)
            setShowMenu2(false)
            setShowMenu3(false)
            setShowMenu4(false)
            setShowMenu5(false)
            setShowMenu6(false)
            setShowMenu7(false)
            setShowMenu8(false)
            setShowMenu9(false)
            setShowMenu10(false)
            setShowMenu11(false)  
            setShowMenu12(false)
          }}
className='mt-4'>
          {location.pathname !== '/admin/customer-tickets' && location.pathname 
          !== '/admin/hotspot-dashboard' && location.pathname !== '/admin/pppoe-subscribers' 
          &&  location.pathname !== '/admin/hotspot_anlytics' 
           && location.pathname !== '/admin/nodes'
           
           && location.pathname !== '/admin/user'
           && location.pathname !== '/admin/client-leads'
           && location.pathname !== '/admin/settings'
           && location.pathname !== '/admin/profile'
           && location.pathname !== '/admin/passkeys'
           && location.pathname !== '/admin/router-stats'
           && location.pathname !== '/admin/hotspot-package'
           && location.pathname !== '/admin/hotspot-templates'
           && location.pathname !== '/admin/hotspot_settings'
           && location.pathname !== '/admin/send-sms' &&
           location.pathname !== '/admin/messages' && location.pathname !== '/admin/bulk-messages'
           && location.pathname !== '/admin/today-subscribers' && 
           location.pathname !== '/admin/this-week-subscribers' && 
           location.pathname !== '/admin/this-month-subscribers' && location.pathname !== '/admin/scheduler'

           &&

location.pathname !== '/admin/router_details' 
           
           && <div
            onClick={() => {
            setShowMenu1(false)
            setShowMenu2(false)
            setShowMenu3(false)
            setShowMenu4(false)
            setShowMenu5(false)
            setShowMenu6(false)
            setShowMenu7(false)
            setShowMenu8(false)
            setShowMenu9(false)
            setShowMenu10(false)
            setShowMenu11(false)  
            setShowMenu12(false)
          }}
           ><ShortCuts /> </div>
           
           }


          {/* {location.pathname !== '/admin/customer-tickets' && <ShortCuts />}
          {location.pathname !== '/admin/hotspot-dashboard' && <ShortCuts />} */}
          {location.pathname === '/admin/hotspot-dashboard' && 
          <div
          
           onClick={() => {
            setShowMenu1(false)
            setShowMenu2(false)
            setShowMenu3(false)
            setShowMenu4(false)
            setShowMenu5(false)
            setShowMenu6(false)
            setShowMenu7(false)
            setShowMenu8(false)
            setShowMenu9(false)
            setShowMenu10(false)
            setShowMenu11(false)  
            setShowMenu12(false)
          }}
          >
          <DashboardStatistics 
          
          />
          </div>
          }

          {location.pathname === '/admin/customer-tickets' && 
          <div
           onClick={() => {
            setShowMenu1(false)
            setShowMenu2(false)
            setShowMenu3(false)
            setShowMenu4(false)
            setShowMenu5(false)
            setShowMenu6(false)
            setShowMenu7(false)
            setShowMenu8(false)
            setShowMenu9(false)
            setShowMenu10(false)
            setShowMenu11(false)  
            setShowMenu12(false)
          }}
          >
          <TicketStatistics />
          </div>
          }


          
          {location.pathname === '/admin/pppoe-subscribers' 
            && <div
             onClick={() => {
            setShowMenu1(false)
            setShowMenu2(false)
            setShowMenu3(false)
            setShowMenu4(false)
            setShowMenu5(false)
            setShowMenu6(false)
            setShowMenu7(false)
            setShowMenu8(false)
            setShowMenu9(false)
            setShowMenu10(false)
            setShowMenu11(false)  
            setShowMenu12(false)
          }}
            ><SubscriberStats />
            </div>
            }


            {location.pathname === '/admin/today-subscribers' &&
            <div
             onClick={() => {
            setShowMenu1(false)
            setShowMenu2(false)
            setShowMenu3(false)
            setShowMenu4(false)
            setShowMenu5(false)
            setShowMenu6(false)
            setShowMenu7(false)
            setShowMenu8(false)
            setShowMenu9(false)
            setShowMenu10(false)
            setShowMenu11(false)  
            setShowMenu12(false)
          }}
            >
            <SubscriberStats />
            </div>
            }
            {location.pathname === '/admin/this-week-subscribers' && 
            <div
             onClick={() => {
            setShowMenu1(false)
            setShowMenu2(false)
            setShowMenu3(false)
            setShowMenu4(false)
            setShowMenu5(false)
            setShowMenu6(false)
            setShowMenu7(false)
            setShowMenu8(false)
            setShowMenu9(false)
            setShowMenu10(false)
            setShowMenu11(false)  
            setShowMenu12(false)
          }}
            >
            <SubscriberStats />
            </div>
            }

            {location.pathname === '/admin/this-month-subscribers' &&
            <div 
             onClick={() => {
            setShowMenu1(false)
            setShowMenu2(false)
            setShowMenu3(false)
            setShowMenu4(false)
            setShowMenu5(false)
            setShowMenu6(false)
            setShowMenu7(false)
            setShowMenu8(false)
            setShowMenu9(false)
            setShowMenu10(false)
            setShowMenu11(false)  
            setShowMenu12(false)
          }}
            >
            <SubscriberStats />
            </div>
            }

</div>
          <div className="mt-8" onClick={() => {
            setShowMenu1(false)
            setShowMenu2(false)
            setShowMenu3(false)
            setShowMenu4(false)
            setShowMenu5(false)
            setShowMenu6(false)
            setShowMenu7(false)
            setShowMenu8(false)
            setShowMenu9(false)
            setShowMenu10(false)
            setShowMenu11(false)  
            setShowMenu12(false)
          }}>
            <Outlet />
          </div>
        </div>
      </div>

      <div className="flex flex-col p-4 font-mono">
        <Sidebar />
      </div>

<div className='flex justify-center roboto-condensed-light'>
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
