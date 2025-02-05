import {Outlet} from 'react-router-dom'
import Sidebar from '../sidebar/Sidebar'
import Header from '../header/Header'

import { useContext, useState, useEffect, useCallback} from 'react'
import {ApplicationContext} from '../context/ApplicationContext'
import {useApplicationSettings} from '../settings/ApplicationSettings'
import { Button } from "@/components/ui/button"
import Timer from '../timer/Timer'
import ShortCuts from './ShortCuts'
// import { ReloadIcon } from "@radix-ui/react-icons"



// ${seeSidebar ? 'w-[240]  ' : 'w-[1px] overflow-hidden'
        
        
        
        
// }


const Layout = () => {


const {seeSidebar, theme


} = useContext(ApplicationContext);
  const [seeButton, setSeeButton] = useState(false)
const [loading, setloading] = useState(false)

const {fetchCurrentUser, currentUser} = useApplicationSettings()


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
  return (
<>
    <Header/>
{/* <ShortCuts /> */}
    <div className={`h-screen  overflow-y-scroll p-4 transition-ml duration-500   overflow-x-hidden
     ease-in-out ${seeSidebar ? '' : 'sm:ml-64'} `}>

<div className={`p-4  h-[1000px]  `}>
  <div className='p-2'>
{/* 

  {seeButton && <Button onClick={refreshPage}>Reload Page

</Button>} */}
  <p className='font-extrabold dark:text-white text-black text-xl welcome-message'>
    <span>{getTimeBasedGreeting()}, {currentUser?.username || currentUser?.email }</span></p>
  <p className='dark:text-white text-black text-sm mt-1 welcome-message'>{getWelcomeMessage()}</p>
    
    </div>   

    <p className="capitalize mb-10 dark:text-white text-black text-2xl">{date}</p>
    <ShortCuts />


<div>
<Outlet/>

</div>

<div className='flex flex-col p-4 font-mono  '>
<Sidebar/>
</div>

  
      </div>
      </div>
      </>
  )
}

export default Layout
