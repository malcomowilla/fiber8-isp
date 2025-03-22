import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend, ArcElement } from "chart.js";
import { Bar, Pie } from "react-chartjs-2";
// import { linearChartData } from './linearChartData';
// import { linearChartData2 } from './linearChataData2';
import WifiOffIcon from '@mui/icons-material/WifiOff';
import WifiIcon from '@mui/icons-material/Wifi';
import { useApplicationSettings } from '../settings/ApplicationSettings';
import { useState, useEffect, useCallback } from 'react';
import { LiaUserSolid } from "react-icons/lia";
import { motion } from 'framer-motion';
import Lottie from 'react-lottie';
import RouterNotFound from '../loader/router_not_found_animation.json';
import LoadingAnimation from '../loader/loading_animation.json'
import { GoCpu } from "react-icons/go";
import { PiMemory } from "react-icons/pi";
import { PiFloppyDiskBack } from "react-icons/pi";
import { MdOutlineTimer } from "react-icons/md";
import { IoEyeOutline } from "react-icons/io5";
import {Link} from 'react-router-dom'

const SubscriberStats = () => {
    const { welcomeMessage, welcome, setFormData, settingsformData, 
        totalSubscribers, setTotalSubscribers,subscribersOnline, setSubscribersOnline,
        subscribersOffline, setSubscribersOffline
       } = useApplicationSettings();
      const [date, setDate] = useState(new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true }));


      const subdomain = window.location.hostname.split('.')[0];


  const defaultOptions2 = {
    loop: true,
    autoplay: true,
    animationData: LoadingAnimation,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };



  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };


  const fetchtotalSubscribers = useCallback(
    async() => {
      try {
        const response = await fetch('/api/total_subscribers', {
          headers: {
            'X-Subdomain': subdomain,
          },
        });

        const newData = await response.json();

        if (response.ok) {
          setTotalSubscribers(newData.total_subscribers)
        } else {
          console.log('failed to fetch total subscribers')
        }
      } catch (error) {
        console.log('failed to fetch total subscribers')
      }
      
    },
    [],
  )
  
useEffect(() => {
  fetchtotalSubscribers()
  
}, [fetchtotalSubscribers]);
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          
  <motion.div
    className="max-w-sm p-6 bg-gradient-to-r from-blue-500 to-blue-600 border
     border-gray-200 rounded-lg shadow-2xl dark:border-gray-700 transform
      transition-all hover:scale-105 relative overflow-hidden
      gradient-border
      "
    variants={cardVariants}
    initial="hidden"
    animate="visible"
    transition={{ duration: 0.5, delay: 0.2 }}
    whileHover={{ scale: 1.05, rotate: 1 }}
  >

<Link to='/admin/pppoe-subscribers' className='cursor-pointer

flex justify-center flex-col items-center'> 
<IoEyeOutline className='text-white'/>
<p className='text-white'>view</p>

</Link>
    {/* Floating Icons */}
    <motion.div
      className="absolute -top-4 -right-4 opacity-20"
      animate={{ rotate: 360 }}
      transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
    >
      <LiaUserSolid className="w-20 h-20 text-white" />
    </motion.div>
    <LiaUserSolid className="w-10 h-10 mb-4 text-white relative z-10" />
    <a href="#">
      <h5 className="mb-2 text-xl font-semibold tracking-tight text-white raleway-dots-relative">
        Total Subscribers
      </h5>
    </a>

    <motion.p 
    animate={{ scale: [1, 1.1, 1] }}
    transition={{ duration: 1, repeat: Infinity }}
    className="mb-3 font-normal cursor-pointer
 text-white text-3xl">{totalSubscribers}</motion.p>


    
    {/* Subtle Glow Effect */}
  </motion.div>










  {/* Subscribers Online Card */}
  <motion.div
    className="max-w-sm p-6 bg-gradient-to-r from-green-500 to-green-600 border
     border-gray-200 rounded-lg shadow-2xl dark:border-gray-700 transform transition-all
      hover:scale-105 relative overflow-hidden"
    variants={cardVariants}
    initial="hidden"
    animate="visible"
    transition={{ duration: 0.5, delay: 0.4 }}
    whileHover={{ scale: 1.05, rotate: -1 }}
  >
    {/* Floating Icons */}
    <motion.div
      className="absolute -top-4 -right-4 opacity-20"
      animate={{ rotate: 360 }}
      transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
    >
      <WifiIcon className="w-20 h-20 text-white" />
    </motion.div>
    <WifiIcon className="w-10 h-10 mb-4 text-white relative z-10 animate-pulse" />
    <a href="#">
      <h5 className="mb-2 text-xl font-semibold tracking-tight text-white raleway-dots-relative">
        Subscribers Online
      </h5>
    </a>
    <motion.p
     animate={{ scale: [1, 1.1, 1] }}
     transition={{ duration: 1, repeat: Infinity }}
    className="mb-3 font-normal text-white text-3xl">{subscribersOnline}</motion.p>
    {/* Subtle Glow Effect */}
    <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-green-500 opacity-0 hover:opacity-20 transition-opacity duration-300"></div>
  </motion.div>

  {/* Subscribers Offline Card */}
  <motion.div

    className="max-w-sm p-6 bg-gradient-to-r from-white to-white border
     border-gray-200 shadow-2xl rounded-lg  dark:border-gray-700 transform
      transition-all hover:scale-105 relative overflow-hidden"
    variants={cardVariants}
    initial="hidden"
    animate="visible"
    transition={{ duration: 0.5, delay: 0.6 }}
    whileHover={{ scale: 1.05, rotate: 1 }}
  >
    {/* Floating Icons */}
    <motion.div
      className="absolute -top-4 -right-4 opacity-20"
      animate={{ rotate: 360 }}
      transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
    >
      <WifiOffIcon className="w-20 h-20 text-red" />
    </motion.div>
    <WifiOffIcon className="w-10 h-10 mb-4 text-red-600 relative z-10 animate-pulse" />
    <a href="#">
      <h5 className="mb-2 text-xl font-semibold tracking-tight text-black raleway-dots-relative">
        Subscribers Offline
      </h5>
    </a>
    <motion.p 
     animate={{ scale: [1, 1.1, 1] }}
     transition={{ duration: 1, repeat: Infinity }}
    className="mb-3 font-normal text-black text-3xl">{subscribersOffline}</motion.p>
    {/* Subtle Glow Effect */}
    <div className="absolute inset-0 bg-gradient-to-r from-red-400
     to-red-500 opacity-0 hover:opacity-20 transition-opacity duration-300"></div>
  </motion.div>
    </div>
  )
}

export default SubscriberStats