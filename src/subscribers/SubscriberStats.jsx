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





import RouterIcon from '@mui/icons-material/Router';

import { LuUsers } from "react-icons/lu";

// ChartJS.register(   BarElement, CategoryScale,  LinearScale, Title, Tooltip, Legend);

import MaterialTable from "material-table";
import { createTheme, ThemeProvider, CssBaseline } from '@mui/material';
import { Box, Button, Chip, Typography, useTheme  } from '@mui/material';
import { Add as AddIcon, GetApp as GetAppIcon } from '@mui/icons-material';
import { MdOutlineSupportAgent } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useDebounce } from 'use-debounce';
import { LiaSmsSolid } from "react-icons/lia";
import { FaRegCheckCircle, FaRegTimesCircle, FaRegClock } from "react-icons/fa";
import { formatDistanceToNow } from 'date-fns';

import { format } from 'date-fns';
import { LuDollarSign, LuClock, LuCalendar } from "react-icons/lu";
import { MdOutlineOnlinePrediction } from "react-icons/md";
import { IoCloudOfflineOutline } from "react-icons/io5";



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







const StatCard = ({ title, value, icon, trend, color }) => (
  <motion.div 
    variants={cardVariants}
    className={`p-6 rounded-xl shadow-md bg-white 
      hover:shadow-xl cursor-pointer transition-shadow duration-300 ease-in-out
      roboto-condensed-light`}
  >
    <div className="flex justify-between items-start">
      <div>
        <Typography variant="subtitle2" color="textSecondary">
          <p className='text-black roboto-condensed-light '>{title}</p>
        </Typography>
        <Typography variant="h4" className="mt-1 font-bold">
          <p className='text-black '>{value}</p>
        </Typography>
      </div>
      <Box 
        className={`p-3 rounded-full`}
        sx={{ bgcolor: `${color}.50`, color: `${color}.600` }}
      >
        {icon}
      </Box>
    </div>
    {trend && (
      <Typography 
        variant="caption" 
        className={`mt-2 flex items-center ${trend.value > 0 ? 'text-green-600' : 'text-red-600'}`}
      >
        {trend.value > 0 ? '↑' : '↓'} {Math.abs(trend.value)}% {trend.label}
      </Typography>
    )}
  </motion.div>
);
  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 align-center'>
          
          <StatCard 
          title="Total Subscribers" 
          value={totalSubscribers}
          icon={<LuUsers size={24} className='text-black' />} 
          trend={{ value: 8, label: <p className=''>vs yesterday</p> }}
          color="secondary"
        />










  {/* Subscribers Online Card */}
  <StatCard 
          title="Subscribers Online"
          value={subscribersOnline}
          icon={<MdOutlineOnlinePrediction size={24} className='text-black' />} 
          trend={{ value: 8, label: 'vs yesterday' }}
          color="secondary"
        />





  {/* Subscribers Offline Card */}
  
  <StatCard 
          title="Subscribers Offline"
          value={subscribersOffline}
          icon={<IoCloudOfflineOutline  size={24} className='text-black' />} 
          trend={{ value: 8, label: 'vs yesterday' }}
          color="secondary"
        />
  
    </div>
  )
}

export default SubscriberStats