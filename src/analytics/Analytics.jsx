import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend, ArcElement } from "chart.js";
import { Bar, Pie } from "react-chartjs-2";
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




ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend, ArcElement);

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

  const { welcomeMessage, welcome, setFormData, settingsformData } = useApplicationSettings();
  const [date, setDate] = useState(new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true }));
  const [datetime, setdateTime] = useState(true);
  const [routerData, setRouterData] = useState(null);
  const [loading, setLoading] = useState(true);

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
  }, [subdomain]);

  useEffect(() => {
    fetchRouterInfo();
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

  if (loading) {
    return <Lottie className='' options={defaultOptions2} height={400} width={400} />
  }



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
          parseFloat(disk_usage?.used?.replace(" GB", "") || 0) * 1024, // Convert GB to MB
        ],
        backgroundColor: ["rgba(255, 99, 132, 0.6)", "rgba(54, 162, 235, 0.6)", "rgba(75, 192, 192, 0.6)"],
      },
    ],
  };

  return (
    <>
      <div className="p-6">
        <div className="grid grid-auto-fit gap-6">
          {/* Total Subscribers Card */}
          <motion.div
            className="max-w-sm p-6 bg-gradient-to-r from-blue-500 to-blue-600 border border-gray-200 rounded-lg shadow-lg dark:border-gray-700 transform transition-all hover:scale-105"
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.5, delay: 0.2 }}
            whileHover={{ scale: 1.1 }}
          >
            <LiaUserSolid className="w-10 h-10 mb-4 text-white" />
            <a href="#">
              <h5 className="mb-2 text-xl font-semibold tracking-tight text-white raleway-dots-regular">
                Total Subscribers
              </h5>
            </a>
            <p className="mb-3 font-normal text-white text-3xl">200</p>
          </motion.div>

          {/* Subscribers Online Card */}
          <motion.div
            whileHover={{ scale: 1.1 }}
            className="max-w-sm p-6 bg-gradient-to-r from-green-500 to-green-600 border border-gray-200 rounded-lg shadow-lg dark:border-gray-700 transform transition-all hover:scale-105"
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <WifiIcon className="w-10 h-10 mb-4 text-white" />
            <a href="#">
              <h5 className="mb-2 text-xl font-semibold tracking-tight text-white raleway-dots-regular">
                Subscribers Online
              </h5>
            </a>
            <p className="mb-3 font-normal text-white text-3xl">200</p>
          </motion.div>

          {/* Subscribers Offline Card */}
          <motion.div
            whileHover={{ scale: 1.1 }}
            className="max-w-sm p-6 bg-gradient-to-r from-red-500 to-red-600 border border-gray-200 rounded-lg shadow-lg dark:border-gray-700 transform transition-all hover:scale-105"
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <WifiOffIcon className="w-10 h-10 mb-4 text-white" />
            <a href="#">
              <h5 className="mb-2 text-xl font-semibold tracking-tight text-white raleway-dots-regular">
                Subscribers Offline
              </h5>
            </a>
            <p className="mb-3 font-normal text-white text-3xl">200</p>
          </motion.div>
        </div>
      </div>

      {/* MikroTik Board Information and Traffic Graph */}
      {routerData ? (
        <motion.div
          className="p-6 mt-10"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <h2 className="text-2xl font-semibold mb-4 dark:text-white font-montserat">Router Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* MikroTik Info Card */}
            <motion.div
              className="p-6 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg shadow-lg text-white"
              whileHover={{ scale: 1.05 }}
            >
              <h3 className="text-xl font-semibold mb-4">Board Details</h3>
              <p>Board Name: {board_name}</p>
              <p>Version: {version}</p>
              <p>Uptime: {uptime}</p>
              <p>CPU Load: {cpu_load}</p>
              <p>Memory Usage: {memory_usage?.used} / {memory_usage?.total}</p>
              <p>Disk Usage: {disk_usage?.used} / {disk_usage?.total}</p>
            </motion.div>

            {/* Traffic Graph */}
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
      )}
    </>
  );
};

export default Analytics;