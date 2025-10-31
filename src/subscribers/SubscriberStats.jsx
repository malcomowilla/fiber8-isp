import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend, ArcElement } from "chart.js";

import { useApplicationSettings } from '../settings/ApplicationSettings';
import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import LoadingAnimation from '../loader/loading_animation.json'
import { LuUsers } from "react-icons/lu";
import { Box, Button, Chip, Typography, useTheme  } from '@mui/material';
import { Add as AddIcon, GetApp as GetAppIcon } from '@mui/icons-material';

import { MdOutlineOnlinePrediction } from "react-icons/md";
import { IoCloudOfflineOutline } from "react-icons/io5";
import {Link} from 'react-router-dom'
import { createConsumer } from "@rails/actioncable";
const cable = createConsumer(`wss://${window.location.hostname}/cable`);




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





  const fetchtotalSubscribersOffline = useCallback(
    async() => {
      try {
        const response = await fetch('/api/subscribers_offline', {
          headers: {
            'X-Subdomain': subdomain,
          },
        });

        const newData = await response.json();

        if (response.ok) {
          setSubscribersOffline(newData.total_subscribers)
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
  fetchtotalSubscribersOffline()
  
}, [fetchtotalSubscribersOffline]);






  useEffect(() => {
    const subscription = cable.subscriptions.create(
      { channel: "SubscriberChannel" ,
        "X-Subdomain": subdomain
  }, // must match your Rails channel class
      {
        received(data) {
           console.log('received data from subscribers channel', data)
            setTotalSubscribers(data.subscriber_count)
         
        },
        connected() {
          console.log("Connected to Subscriber Chanel");
        },
        disconnected() {
          console.log("Disconnected from Subscriber Chanel");
        },
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [subdomain,setTotalSubscribers ]);




const StatCard = ({ title, value, icon, trend, color, to, view }) => (
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
    <div className='bg-gray-100 hover:bg-gray-400 p-2 rounded-lg hover:text-white'>
  <Link to={to}>
    <p className='text-black hover:text-white'>{view}</p>
    </Link>
    </div>
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










  <StatCard 
          title="Subscribers Online"
          value={subscribersOnline}
          icon={<MdOutlineOnlinePrediction size={24} className='text-green-600
           animate-[ping_2.0s_ease-in-out_infinite]
          ' />} 
          trend={{ value: 8, label: 'vs yesterday' }}
          color="secondary"
          to='/admin/subscribers-online'
          view='view'
        />





  {/* Subscribers Offline Card */}
  
  <StatCard 
          title="Subscribers Offline"
          value={subscribersOffline}
          icon={<IoCloudOfflineOutline  size={24} className='text-red-600
          animate-[ping_2.0s_ease-in-out_infinite]
          ' />} 
          trend={{ value: 8, label: 'vs yesterday' }}
          color="secondary"
          view='view'
          to='/admin/subscribers-offline'
        />
  
    </div>
  )
}

export default SubscriberStats