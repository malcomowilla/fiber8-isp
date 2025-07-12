
import { useApplicationSettings } from '../settings/ApplicationSettings';
import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import RouterNotFound from '../loader/router_not_found_animation.json';
import LoadingAnimation from '../loader/loading_animation.json'


import { Box,  Typography, } from '@mui/material';
import { Add as AddIcon, GetApp as GetAppIcon } from '@mui/icons-material';


import { MdOutlineOnlinePrediction } from "react-icons/md";
import { IoCloudOfflineOutline } from "react-icons/io5";
import { LuUsers } from "react-icons/lu";
import { MdMobiledataOff } from "react-icons/md";





// ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend, ArcElement);

const Analytics = () => {
  const options = {
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
      plugins: {
        title: {
          display: false,
          text: 'Custom Chart Title',
        },
      },
    },
  };

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: RouterNotFound,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };




  const defaultOptions2 = {
    loop: true,
    autoplay: true,
    animationData: LoadingAnimation,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  const { welcomeMessage, welcome, setFormData, settingsformData, 
    totalSubscribers, setTotalSubscribers,subscribersOnline, setSubscribersOnline,
    subscribersOffline, setSubscribersOffline,
    showMenu1, setShowMenu1, showMenu2, setShowMenu2, showMenu3, setShowMenu3,
      showMenu4, setShowMenu4, showMenu5, setShowMenu5, showMenu6, setShowMenu6,
       showMenu7, setShowMenu7, showMenu8, setShowMenu8, showMenu9, setShowMenu9,
        showMenu10, setShowMenu10, showMenu11, setShowMenu11, showMenu12, setShowMenu12,
          
      
   } = useApplicationSettings();


  const [date, setDate] = useState(new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true }));
  const [datetime, setdateTime] = useState(true);
  const [routerData, setRouterData] = useState(null);
  const [loading, setLoading] = useState(true);
const [currentRouterImage, setCurrentRouterImage] = useState(null);
const [uptime, setUptime] = useState(null);
const [error, setError] = useState(null);
const [routerInfo, setRouterInfo] = useState(null);
  const [ubuntuStats, setUbuntuStats] = useState({
    cpuUsage: 0,
    memoryUsage: 0,
    diskUsage: 0,
    uptime: "0h 0m",
    available_memory: 0,
    memory_used: 0,
    disk_used: 0,
    available_disk: 0,
  });
  const [loadingUbuntuStats, setLoadingUbuntuStats] = useState(true);
const [totalBandwidth, setTotalBandwidth] = useState(0);
const [totalOnlineUsers, setTotalOnlineUsers] = useState(0);


  // const fetchUbuntuStats = useCallback(async () => {
  //   try {
  //     const response = await fetch("/api/system_status", {
  //       headers: {
  //         'X-Subdomain': subdomain,
  //       }
  //     }); // Replace with your backend endpoint
  //     const data = await response.json();

  //     if (response.ok) {

  //       if (data.system_metrics && data.system_metrics.length > 0) {
  //         const item = data.system_metrics[0]; // Assuming you need the latest entry

  //         setUbuntuStats({
           
  //             cpuUsage: item.cpu_usage,
  //         memoryUsage: item.memory_total,
  //         diskUsage: item.disk_total,
  //         available_memory: item.memory_free,
  //         uptime: item.uptime,
  //         available_disk: item.disk_free,
  //         memory_used: item.memory_used,
  //         disk_used: item.disk_used,
  //         });
  //       }
        
    
        
  //     } else {
  //       console.error("Failed to fetch Ubuntu stats");
  //     }
  //   } catch (error) {
  //     console.error("Error fetching Ubuntu stats:", error);
  //   } finally {
  //     setLoadingUbuntuStats(false);
  //   }
  // }, []);

  // useEffect(() => {
  //   fetchUbuntuStats();
  //   const intervalId = setInterval(fetchUbuntuStats, 5000); // Refresh every 5 seconds
  //   return () => clearInterval(intervalId);
  // }, [fetchUbuntuStats]);


  useEffect(() => {
    const timeout = setTimeout(() => {
      setdateTime(false);
    }, 9000);
    return () => clearTimeout(timeout);
  }, []);

 const subdomain = window.location.hostname.split('.')[0];

  const getPPOEstats = useCallback(
    async() => {


      try {
        const response = await fetch(`/api/get_total_bandwidth_and_online_users`,
          {
            headers: { 'X-Subdomain': subdomain },
          }
        );
        const data = await response.json();
        
        if (response.ok) {
          setTotalOnlineUsers(data.active_user_count)
          setTotalBandwidth(data.total_bandwidth)
          
        } else {
          
        }
      } catch (error) {
        
      }
    },
    [],
  )





useEffect(() => {
  // Initial call
  getPPOEstats();
  
  // Set up interval for polling
  const intervalId = setInterval(() => {
    getPPOEstats();
  }, 7000);

  return () => clearInterval(intervalId);

}, [getPPOEstats]);
  // const fetchRouterInfo = useCallback(async () => {
  //   try {
  //     const response = await fetch("/api/router_info", {
  //       headers: {
  //         'X-Subdomain': subdomain,
  //       },
  //     });
  //     const data = await response.json();

  //     if (response.ok) {
  //       setLoading(false);
  //       setRouterData(data);
  //     } else {
  //       setRouterData(null); 
  //       setLoading(false);// Set routerData to null if the response is not OK
  //     }
  //   } catch (error) {
  //     setRouterData(null);
  //     setLoading(false); // Set routerData to null if there's an error
  //   } finally {
  //     setLoading(false); // Ensure loading is set to false regardless of success or failure
  //   }
  // }, []);

  // useEffect(() => {
  //   fetchRouterInfo();

  //   const intervalId = setInterval(() => {
  //     fetchRouterInfo();
  //   }, 9000); // Fetch every 60 seconds
  //   return () => clearInterval(intervalId);
  // }, [fetchRouterInfo]);


  

  useEffect(() => {
    const interval = setInterval(() => {
      setDate(new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true }));
    }, 1000);
    return () => clearInterval(interval);
  }, [date]);

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };


  const { board_name, version, cpu_load, memory_usage, disk_usage,  } = routerData || {};

  const trafficData = {
    labels: ["CPU Load", "Memory Used", "Disk Used"],
    datasets: [
      {
        label: "Usage",
        data: [
          parseFloat(cpu_load?.replace("%", "") || 0),
          parseFloat(memory_usage?.used?.replace(" MB", "") || 0),
          parseFloat(disk_usage?.used?.replace(" GB", "") || 0) * 1024, 
        ],
        backgroundColor: ["rgba(255, 99, 132, 0.6)", "rgba(54, 162, 235, 0.6)", "rgba(75, 192, 192, 0.6)"],
      },
    ],
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
    <>
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
      className="p-2">
      
     
      

      </div>

     

 <motion.div 
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
    className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700"
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
  >


 <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 align-center'>
          
          <StatCard 
          title="All Clients" 
          value={totalSubscribers}
          icon={<LuUsers size={24} className='text-black' />} 
          trend={{ value: 8, label: <p className=''>vs yesterday</p> }}
          color="secondary"
        />










  {/* Subscribers Online Card */}
  <StatCard 
          title="Clients Online"
          value={totalOnlineUsers || 0}
          icon={<MdOutlineOnlinePrediction size={24} className='text-black' />} 
          trend={{ value: 8, label: 'vs yesterday' }}
          color="secondary"
        />





  {/* Subscribers Offline Card */}
  
  <StatCard 
          title="Clients Offline"
          value={subscribersOffline}
          icon={<IoCloudOfflineOutline  size={24} className='text-black' />} 
          trend={{ value: 8, label: 'vs yesterday' }}
          color="secondary"
        />
  
    </div>


<motion.div 
    variants={cardVariants}
    className={`p-6  rounded-xl shadow-md bg-white 
      hover:shadow-xl cursor-pointer transition-shadow duration-300 ease-in-out
      roboto-condensed-light w-[500px] mt-4 px-4`}
  >
    <div className="flex justify-between items-start">
      <div>
        <Typography variant="subtitle2" color="textSecondary">
          <p className='text-black roboto-condensed-light '>Data (24H)</p>
        </Typography>
        {totalBandwidth || 0}
      </div>
      
        < MdMobiledataOff
 />
    </div>
   
  </motion.div>
    
  </motion.div>

    </>
  );
};

export default Analytics;