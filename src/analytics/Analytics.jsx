// import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Title, ArcElement } from "chart.js";
// import { Bar, Pie } from "react-chartjs-2";
import { linearChartData } from './linearChartData';
import { linearChartData2 } from './linearChataData2';
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
import { LuRouter } from "react-icons/lu";
import { LineChart, Line,BarChart, Bar , XAxis, YAxis, CartesianGrid, Tooltip, Legend, Area ,
  ResponsiveContainer,
  AreaChart} from 'recharts';








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
    subscribersOffline, setSubscribersOffline
   } = useApplicationSettings();
  const [date, setDate] = useState(new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true }));
  const [datetime, setdateTime] = useState(true);
  const [routerData, setRouterData] = useState(null);
  const [loading, setLoading] = useState(true);

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



  const fetchUbuntuStats = useCallback(async () => {
    try {
      const response = await fetch("/api/system_status", {
        headers: {
          'X-Subdomain': subdomain,
        }
      }); // Replace with your backend endpoint
      const data = await response.json();

      if (response.ok) {

        if (data.system_metrics && data.system_metrics.length > 0) {
          const item = data.system_metrics[0]; // Assuming you need the latest entry

          setUbuntuStats({
            // cpuUsage: item.cpu_usage,
            // memoryTotal: item.memory_total,
            // memoryFree: item.memory_free,
            // memoryUsed: item.memory_used,
            // diskTotal: item.disk_total,
            // diskFree: item.disk_free,
            // diskUsed: item.disk_used,
            // loadAverage: item.load_average,
            // uptime: item.uptime,

              cpuUsage: item.cpu_usage,
          memoryUsage: item.memory_total,
          diskUsage: item.disk_total,
          available_memory: item.memory_free,
          uptime: item.uptime,
          available_disk: item.disk_free,
          memory_used: item.memory_used,
          disk_used: item.disk_used,
          });
        }
        
        // setUbuntuStats({
        //   cpuUsage: data.system_metrics.cpu_usage,
        //   memoryUsage: data.system_metrics.memory_total,
        //   diskUsage: data.system_metrics.disk_total,
        //   available_memory: data.system_metrics.memory_free,
        //   uptime: data.uptime,
        //   available_disk: data.system_metrics.disk_free,
        //   memory_used: data.system_metrics.memory_used,
        //   disk_used: data.system_metrics.disk_used,
        // });
        


        
      } else {
        console.error("Failed to fetch Ubuntu stats");
      }
    } catch (error) {
      console.error("Error fetching Ubuntu stats:", error);
    } finally {
      setLoadingUbuntuStats(false);
    }
  }, []);

  useEffect(() => {
    fetchUbuntuStats();
    const intervalId = setInterval(fetchUbuntuStats, 5000); // Refresh every 5 seconds
    return () => clearInterval(intervalId);
  }, [fetchUbuntuStats]);


  useEffect(() => {
    const timeout = setTimeout(() => {
      setdateTime(false);
    }, 9000);
    return () => clearTimeout(timeout);
  }, []);

  const subdomain = window.location.hostname.split('.')[0];

  const fetchRouterInfo = useCallback(async () => {
    try {
      const response = await fetch("/api/router_info", {
        headers: {
          'X-Subdomain': subdomain,
        },
      });
      const data = await response.json();

      if (response.ok) {
        setLoading(false);
        setRouterData(data);
      } else {
        setRouterData(null); 
        setLoading(false);// Set routerData to null if the response is not OK
      }
    } catch (error) {
      setRouterData(null);
      setLoading(false); // Set routerData to null if there's an error
    } finally {
      setLoading(false); // Ensure loading is set to false regardless of success or failure
    }
  }, []);

  useEffect(() => {
    fetchRouterInfo();

    const intervalId = setInterval(() => {
      fetchRouterInfo();
    }, 9000); // Fetch every 60 seconds
    return () => clearInterval(intervalId);
  }, [fetchRouterInfo]);


  

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

  // if (loading) {
  //   return <Lottie className='' options={defaultOptions2} height={400} width={400} />
  // }



  // Check if routerData is defined before destructuring
  const { board_name, version, cpu_load, memory_usage, disk_usage, uptime } = routerData || {};

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
  return (
    <>
      <div className="p-2">
      <div className='flex justify-between items-center bg-white dark:bg-gray-800 rounded-lg shadow-2xl p-6 border-l-4 border-blue-500'>
  <div className='flex items-center space-x-4'>
    {/* Tux Linux Penguin Icon */}
    <div className='w-12 h-12'>
      <svg viewBox="0 0 128 128" className='w-full h-full '>
        <path fill="#000" d="M122.2 78.3c1.6-1.6 1.6-4.2 0-5.8-1.6-1.6-4.2-1.6-5.8 0L89.8 99.2l-8.3-8.3c-1.6-1.6-4.2-1.6-5.8 0-1.6 1.6-1.6 4.2 0 5.8l11.2 11.2c.8.8 1.8 1.2 2.9 1.2 1 0 2.1-.4 2.9-1.2l29.3-29.3z"/>
        <path fill="#000" d="M64.1 1.3C29.5 1.3 1.5 29.3 1.5 63.9s28 62.6 62.6 62.6 62.6-28 62.6-62.6S98.7 1.3 64.1 1.3zm0 120C32.5 121.3 6.5 95.3 6.5 63.9S32.5 6.5 64.1 6.5s57.6 26 57.6 57.4-26 57.4-57.6 57.4z"/>
        <path fill="#000" d="M64.1 12.8c-28.2 0-51.1 22.9-51.1 51.1s22.9 51.1 51.1 51.1 51.1-22.9 51.1-51.1-22.9-51.1-51.1-51.1zm0 97.9c-25.8 0-46.8-21-46.8-46.8s21-46.8 46.8-46.8 46.8 21 46.8 46.8-21 46.8-46.8 46.8z"/>
      </svg>
    </div>
    
    <div>
      <p className='font-bold text-black dark:text-white text-xl'>
        SYSTEM RESOURCES
        <span className='ml-2 text-sm font-normal bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full'>
          Linux Server
        </span>
      </p>
      {/* <p className='text-gray-600 dark:text-gray-300 text-sm mt-1'>
        Ubuntu 22.04 LTS • Kernel 5.15.0-76-generic
      </p> */}
    </div>
  </div>
{/* 
  <div className='flex items-center space-x-2'>
    <span className={`w-3 h-3 rounded-full ${isServerOnline ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></span>
    <p className='font-light text-black dark:text-white text-lg'>
      {isServerOnline ? 'Online' : 'Offline'}
    </p>
  </div> */}
</div>
      

      <div className="grid grid-auto-fit gap-6 mt-4">
  {/* Total Subscribers Card */}





  <motion.div
  
            className="max-w-sm p-6 bg-gradient-to-r from-purple-500 to-purple-600 border border-gray-200 rounded-lg shadow-2xl dark:border-gray-700 transform transition-all hover:scale-105 relative overflow-hidden"
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.5, delay: 0.2 }}
            whileHover={{ scale: 1.05, rotate: 1 }}
          >
            <div className="flex items-center mb-4">
              <GoCpu className="w-10 h-10 mr-3 text-white" />
              <h3 className="text-2xl font-bold text-white">CPU Usage</h3>
            </div>
            <motion.p
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="mb-3 font-normal text-white text-3xl"
            >
             
             <div className='flex flex-row justify-between  gap-4'>
              {ubuntuStats.cpuUsage}
              <p className='text-sm'>Linux</p>
              </div>
            </motion.p>
            <div className="w-full bg-white bg-opacity-20 rounded-full h-3 overflow-hidden relative">
              <motion.div
               style={{ width:`${ubuntuStats.cpuUsage}` }}
                className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full"
                // animate={{ width: `${ubuntuStats.cpuUsage}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
          </motion.div>

          {/* Ubuntu Memory Usage Card */}
          <motion.div
            className="max-w-sm p-6 bg-gradient-to-r from-green-500 to-green-600 border
             border-gray-200 rounded-lg shadow-2xl dark:border-gray-700 transform 
             transition-all hover:scale-105 relative overflow-hidden"
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.5, delay: 0.4 }}
            whileHover={{ scale: 1.05, rotate: -1 }}
          >
            <div className="flex items-center mb-4">
              <PiMemory className="w-10 h-10 mr-3 text-white" />
              <h3 className="text-2xl font-bold text-white">RAM Usage</h3>
            </div>
            <div className='flex flex-row justify-between  gap-4'>
            <div className='flex flex-col'>
            <motion.p
           
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="mb-3 font-normal text-white text-2xl"
            >
              {/* {ubuntuStats.memoryUsage} */}
              <p> <span className='font-light text-lg'>Used </span> {ubuntuStats.memory_used} </p>
            </motion.p>
            <p className='text-white font-light'> [available] {ubuntuStats.available_memory} </p>
            </div>

            <motion.p
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="mb-3 font-normal text-white text-lg"
            >
               <p> <span>Total </span>{ubuntuStats.memoryUsage}</p>
               {/* {ubuntuStats.available_memory} */}
            </motion.p>

            </div>
            
          </motion.div>

          {/* Ubuntu Disk Usage Card */}
          <motion.div
            className="max-w-sm p-6 bg-gradient-to-r from-red-500 to-red-600 border border-gray-200 rounded-lg shadow-2xl dark:border-gray-700 transform transition-all hover:scale-105 relative overflow-hidden"
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.5, delay: 0.6 }}
            whileHover={{ scale: 1.05, rotate: 1 }}
          >
            <div className="flex items-center mb-4">
              <PiFloppyDiskBack className="w-10 h-10 mr-3 text-white" />
              <h3 className="text-xl font-bold text-white">Disk Usage</h3>
            </div>
            <div className='flex flex-row justify-between  gap-4'>

              <div className='flex flex-col'>
            <motion.p
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="mb-3 font-normal text-white text-2xl"
            >
              <span className='font-light text-lg'> Used </span>
              {/* {ubuntuStats.diskUsage}% */}
              {ubuntuStats.disk_used}
            </motion.p>
            <p className='text-white'> [available] {ubuntuStats.available_disk}</p>
            </div>

            <p className='text-white'><span >Total </span> {ubuntuStats.diskUsage} </p>
            </div>
           
          </motion.div>

          {/* Ubuntu Uptime Card */}
          <motion.div
            className="max-w-sm p-6 bg-gradient-to-r from-yellow-500 to-yellow-600 border border-gray-200 rounded-lg shadow-2xl dark:border-gray-700 transform transition-all hover:scale-105 relative overflow-hidden"
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.5, delay: 0.8 }}
            whileHover={{ scale: 1.05, rotate: -1 }}
          >
            <div className="flex items-center mb-4">
              <MdOutlineTimer className="w-10 h-10 mr-3 text-white" />
              <h3 className="text-2xl font-bold text-white">Uptime</h3>
            </div>
            <motion.p
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="mb-3 font-normal text-white text-3xl"
            >
              {ubuntuStats.uptime}
            </motion.p>
          </motion.div>

        
</div>
      </div>

      {/* {routerData ? (
        <motion.div
          className="p-6 mt-10"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <h2 className="text-2xl font-semibold mb-4 dark:text-white font-montserat">Router Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div
              className="p-6 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg shadow-lg text-white"
              whileHover={{ scale: 1.05 }}
            >
              <h3 className="text-2xl font-bold mb-4">Board Details</h3>
              <p className='font-light'>Board Name: <b className='font-bold'>{board_name}</b> </p>
              <p>Version: <b className=''>{version}</b> </p>
              <p>Uptime: <b className=''>{uptime}</b> </p>
              <p>CPU Load: <b className=''>{cpu_load}</b> </p>
              <p>Memory Usage: <b className=''>{memory_usage?.used} / {memory_usage?.total}</b> </p>
              <p>Disk Usage: <b className=''>{disk_usage?.used} / {disk_usage?.total}</b> </p>
              
            </motion.div>

            <motion.div
              className="p-6 bg-white rounded-lg shadow-lg"
              whileHover={{ scale: 1.05 }}
            >
              <h3 className="text-xl font-semibold mb-4 dark:text-black">Traffic Statistics</h3>
              <div className="h-[300px]">
                <Bar
                  data={trafficData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      y: {
                        beginAtZero: true,
                      },
                    },
                  }}
                />
              </div>
            </motion.div>
          </div>
        </motion.div>
      ) : (
        <Lottie className='relative z-50' options={defaultOptions} height={400} width={400} />
      )} */}


{routerData ? (
  <motion.div
    className="p-6 mt-10"
    variants={cardVariants}
    initial="hidden"
    animate="visible"
    transition={{ duration: 0.5, delay: 0.8 }}
  >
    <h2 className="text-2xl font-semibold mb-4 dark:text-white font-montserat">Router Status</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* CPU Load Card */}
      <motion.div
  className="p-6 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow-lg text-white"
  whileHover={{ scale: 1.05 }}
>
  <div className="flex items-center mb-4">
    <GoCpu className='p-2 w-12 h-12 mr-3' />
    <h3 className="text-2xl font-bold">CPU Load</h3>
  </div>
  <motion.p
   animate={{ scale: [1, 1.1, 1] }}
   transition={{ duration: 1, repeat: Infinity }}
  className='font-light  mb-2'><b className='font-bold'>{cpu_load}</b></motion.p>
  
  {/* Progress Bar Container */}
  <div className="w-full bg-white   bg-opacity-20 rounded-full h-3 overflow-hidden relative">
    {/* Glow Effect */}
    <div className="absolute inset-0 rounded-md transition-all duration-300 bg-red-400 
    animat   " style={{ width: `${cpu_load}` }} />
    
    {/* Progress Bar */}
    <motion.div
      className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full"
      initial={{ width: 0 }}
      animate={{ width: `${cpu_load}%` }}
      transition={{ duration: 1, ease: "easeOut" }}
    />
  </div>
</motion.div>

      {/* Memory Usage Card */}
      <motion.div
        className="p-6 bg-gradient-to-r from-green-500 to-green-600 rounded-lg shadow-lg text-white"
        whileHover={{ scale: 1.05 }}
      >
        
        <div className="flex items-center mb-4">
          <i className="fas fa-memory text-3xl mr-3"></i>
          <PiMemory  className='p-2 w-12 h-12 mr-3' />
          <h3 className="text-xl font-light">RAM Usage</h3>
        </div>
        <div className='flex flex-row justify-between'>
          <div className='flex flex-col'>
        <motion.p
         animate={{ scale: [1, 1.1, 1] }}
         transition={{ duration: 1, repeat: Infinity }}
        className='font-light'>Used <b className='font-bold text-3xl'>{memory_usage?.used}</b></motion.p>
        <p>[Available <span>{memory_usage?.free}</span>]</p>
</div>

        <p className='font-light'>Total  <b className='font-light text-xl'>{memory_usage?.total}</b></p>

        </div>
      </motion.div>

      {/* Disk Usage Card */}
      <motion.div
        className="p-6 bg-gradient-to-r from-red-500 to-red-600 rounded-lg shadow-lg text-white"
        whileHover={{ scale: 1.05 }}
      >
        <div className="flex items-center mb-4">
          <i className="fas fa-hdd text-3xl mr-3"></i>
          <PiFloppyDiskBack  className='p-2 w-12 h-12 mr-3' />
          <h3 className="text-2xl font-bold">Disk Usage</h3>
        </div>
        <div className='flex flex-row justify-between'>
          <div className='flex flex-col'>
        <motion.p
         animate={{ scale: [1, 1.1, 1] }}
         transition={{ duration: 1, repeat: Infinity }}
        className='font-light'><b className='font-bold text-lg'><span
        className='font-light text-lg'
        >Used </span>  {disk_usage?.used}</b></motion.p>
        <p>[Available <span>{disk_usage?.free}</span>]</p>
</div>

        <p className='font-light'>Total <b className='font-light text-lg'>{disk_usage?.total}</b></p>

          </div>



      </motion.div>

      {/* Uptime Card */}
      <motion.div
        className="p-6 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg shadow-lg text-white"
        whileHover={{ scale: 1.05 }}
      >
        <div className="flex items-center mb-4">
          <i className="fas fa-clock text-3xl mr-3"></i>
          <MdOutlineTimer  className='p-2 w-12 h-12 mr-3' />
          <motion.h3
          
          className="text-2xl font-bold">Uptime</motion.h3>
        </div>
        <motion.p
        
        className='font-light'><b className='font-bold'>{uptime}</b></motion.p>
      </motion.div>
    </div>

    {/* Traffic Graph */}
    <motion.div
      className="p-6 mt-6  rounded-lg shadow-lg"
      whileHover={{ scale: 1.05 }}
    >
      <h3 className="text-xl font-semibold mb-4 dark:text-black">Traffic Statistics</h3>
     


      <div className="h-[300px] w-full">
  <ResponsiveContainer width="100%" height="100%">
    <AreaChart
      data={[
        { 
          name: "Current",


          // parseFloat(cpu_load?.replace("%", "") || 0),
          // parseFloat(memory_usage?.used?.replace(" MB", "") || 0),
          // parseFloat(disk_usage?.used?.replace(" GB", "") || 0) * 1024, 



          cpuLoad: parseFloat(cpu_load?.replace("%", "") || 0),
          memoryUsed: parseFloat(memory_usage?.used?.replace(" MB", "") || 0),
          diskUsed: parseFloat(disk_usage?.used.replace("GB", "") || 0), 
        }
      ]}
      margin={{ top: 10, right: 30, left: 20, bottom: 20 }}
    >
      <defs>
        <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor="rgba(255, 99, 132, 0.8)" />
          <stop offset="95%" stopColor="rgba(255, 99, 132, 0)" />
        </linearGradient>
        <linearGradient id="colorMemory" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor="rgba(54, 162, 235, 0.8)" />
          <stop offset="95%" stopColor="rgba(54, 162, 235, 0)" />
        </linearGradient>
        <linearGradient id="colorDisk" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor="rgba(75, 192, 192, 0.8)" />
          <stop offset="95%" stopColor="rgba(75, 192, 192, 0)" />
        </linearGradient>
      </defs>
      
      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
      <XAxis 
        dataKey="name"
        tick={{ fill: '#6b7280' }}
      />
      <YAxis 
        tick={{ fill: '#6b7280' }}
        tickFormatter={(value) => `${value}${value > 100 ? 'MB' : '%'}`}
      />
      
      <Tooltip 
        contentStyle={{
          background: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '8px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        }}
        formatter={(value, name) => {
          let unit = '%';
          if (name === 'memoryUsed') unit = 'MB';
          if (name === 'diskUsed') unit = 'GB';
          return [`${value}${unit}`, 
            name === 'cpuLoad' ? 'CPU Load' : 
            name === 'memoryUsed' ? 'Memory Used' : 'Disk Used'];
        }}
      />
      
      <Legend 
        formatter={(value) => {
          return value === 'cpuLoad' ? 'CPU Load' : 
                 value === 'memoryUsed' ? 'Memory Used' : 'Disk Used';
        }}
      />
      
      <Area 
        type="monotone"
        dataKey="cpuLoad"
        stroke="rgba(255, 99, 132, 0.6)"
        fill="url(#colorCpu)"
        name="cpuLoad"
      />
      <Area 
        type="monotone"
        dataKey="memoryUsed"
        stroke="rgba(54, 162, 235, 0.6)"
        fill="url(#colorMemory)"
        name="memoryUsed"
      />
      <Area 
        type="monotone"
        dataKey="diskUsed"
        stroke="rgba(75, 192, 192, 0.6)"
        fill="url(#colorDisk)"
        name="diskUsed"
      />
    </AreaChart>
  </ResponsiveContainer>
</div>

    </motion.div>
  </motion.div>
) : (
  <div className='flex flex-col items-center  m
  bg-gradient-to-r from-purple-500 to-indigo-600'>
  {/* Router Icon with Animation */}
  <div className='relative flex flex-col mt-20 '>
    <LuRouter className='w-20 h-20 text-red-500 animate-bounce' />
    <div className='absolute -bottom-8 text-white text-lg font-bold'>
      No Router Connection
    </div>
  </div>

  {/* Lottie Animation */}
  <div className='mt-1 relative '>
    <Lottie
      options={defaultOptions}
      height={300}
      width={300}
      isStopped={false}
      isPaused={false}
    />
  </div>

  {/* Additional Styling */}
  <p className='mt-1 text-white text-xl font-semibold'>
    Please check your connection and try again.
  </p>
</div>
)}
    </>
  );
};

export default Analytics;