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

          {smsBalance && (
    <div className="flex items-center gap-2 bg-blue-100 dark:bg-blue-900 px-4 py-2 rounded-lg">
      <FaSms className="text-blue-600 dark:text-blue-300 text-xl" />
      <span className="text-blue-800 dark:text-blue-200 font-medium">
        SMS Balance: <span className="font-bold">{smsBalance}</span>
      </span>
    </div>
  )}
          {location.pathname !== '/admin/customer-tickets' && location.pathname !== '/admin/hotspot-dashboard' && location.pathname !== '/admin/pppoe-subscribers' && <ShortCuts />}

          
          {/* {location.pathname !== '/admin/customer-tickets' && <ShortCuts />}
          {location.pathname !== '/admin/hotspot-dashboard' && <ShortCuts />} */}
          {location.pathname === '/admin/hotspot-dashboard' && <DashboardStatistics />}
          {location.pathname === '/admin/customer-tickets' && <TicketStatistics />}
          {location.pathname === '/admin/pppoe-subscribers' && <SubscriberStats />}

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
