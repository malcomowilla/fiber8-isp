
import { FcAlarmClock } from "react-icons/fc";
import { GoCpu, GoServer  } from "react-icons/go";
import { useCallback, useEffect, useState } from "react";
import {useApplicationSettings} from '../settings/ApplicationSettings'
import { useSearchParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import TrafficStatsGraph from './TrafficData';
import toast, { Toaster } from 'react-hot-toast';
import { IoWarningOutline } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import { MdMemory } from "react-icons/md";  // Using MdMemory from material design icons instead

import { FiHardDrive } from "react-icons/fi";
import { FcAreaChart, FcBarChart, FcDonate, FcLandscape } from "react-icons/fc";
import Lottie from 'react-lottie';
import animationData from '../lotties/Connection error.json';

import { motion } from "framer-motion";





const RouterDetails = ({message = "Connection to router failed"}) => {
const {openNasTable, setOpenNasTable,
        openRouterDetails, setOpenRouterDetails} = useApplicationSettings()
const [routerData, setRouterData] = useState(null);
  const [loading, setLoading] = useState(true);
const [currentRouterImage, setCurrentRouterImage] = useState(null);
const [uptime, setUptime] = useState(null);
const [error, setError] = useState(null);
const [routerInfo, setRouterInfo] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [routerInterface, setRouterInterface] = useState([]);
  const [routerInterfaceForm, setRouterInterfaceForm] = useState('');
  const [showSucessReboot, setShowSucessReboot] = useState(false);
  const navigate = useNavigate()



  
  
  const handleChange = (event) => {
    setRouterInterfaceForm(event.target.value);
    localStorage.setItem('routerInterfaceForm', event.target.value)
    fetchTrafficStats(event.target.value)
  };

const [trafficData, setTrafficData] = useState([]);






 const defaultOptions = {
      loop: true,
      autoplay: true,
      animationData: animationData,
      rendererSettings: {
        preserveAspectRatio: "xMidYMid slice"
      }
    };


 const fetchTrafficStats = useCallback(async (routerInterfaceForm) => {
        try {
          setLoading(true);
          setError(null);
          
          const response = await 
          fetch(`/api/trafic_stats?id=${id} &interface=${routerInterfaceForm || localStorage.getItem('routerInterfaceForm')}`, {
            headers: { 'X-Subdomain': window.location.hostname.split('.')[0] },
          });
          if (!response.ok) throw new Error('Failed to fetch router info');
          
          const data = await response.json();
          
             setTrafficData(data[0]); // Keep last 30 data points

          
        } catch (err) {
          setError(err.message);
          setRouterInfo(null);
          setUptime(null);
        } finally {
          setLoading(false);
        }
      }, []);
    
      useEffect(() => {
        fetchTrafficStats();
        const intervalId = setInterval(fetchTrafficStats, 5000);
        return () => clearInterval(intervalId);
      }, [fetchTrafficStats]);

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
  












  
const id = searchParams.get('id')
    const [mikotik, setMikotik] = useState([
        {
            "id": 1,
            "name": "hAP ax lite",
            "image": '/images/hAP_ax_lite.png'
        },

        {
            "id": 2,
            "name": "RB951Ui-2HnD",
            "image": '/images/RB951Ui-2HnD.png'
        },
        {
            "id": 3,
            "name": "hAP ac²",
            "image": '/images/hAP_ac².png'
        },
        {
            "id": 4,
            "name": "cAP ac",
            "image": '/images/cAP_ac.png'
        },
        {
            "id": 5,
            "name": "hAP ac",
            "image": '/images/'
        },
        {
            "id": 6,
            "name": "hEX lite",
            "image": '/images/hEX_lite.png'
        },
        {
            "id": 7,
            "name": "hEX",
            "image": '/images/hEX.png'
        },
        {
            "id": 8,
            "name": "hEX PoE lite",
            "image": '/images/hEX_PoE_lite.png'
        },
        {
            "id": 9,
            "name": "RB4011iGS+RM",
            "image": '/images/RB4011iGS+RM.png'
        },
        {
            "id": 10,
            "name": "CCR2004-16G-2S+",
        "image": '/images/CCR2004-16G-2S+.png'
        },
        {
            "id": 11,
            "name": "CCR2004-16G-2S+PC",
            "image": '/images/CCR2004-16G-2S+PC.png'
        },
        {
            "id": 12,
            "name": "CCR2004-1G-12S+2XS",
            "image": '/images/CCR2004-1G-12S+2XS.png'
        },
        {
            "id": 13,
            "name": "CCR2116-12G-4S+",
            "image": '/images/CCR2116-12G-4S+.png'
        },
        {
            "id": 14,
            "name": "CCR2216-1G-12XS-2XQ",
            "image": '/images/CCR2216-1G-12XS-2XQ.png'
        },
        {
            "id": 15,
            "name": "L009UiGS-RM",
            "image": '/images/L009UiGS-RM.png'
        }, 
        {
            "id": 16,
            "name": "RB5009UG+S+IN",
            "image": '/images/RB5009UG+S+IN.png'
        },
        {
            "id": 17,
            "name": "hEX refresh",
            "image": '/public/images/hEX_refresh.png'
        },
        {
            "id": 18,
            "name": "hAP ac³",
            "image": '/images/hAP_ac³.png'
        },{
            "id": 19,
            "name": "hAP ac lite",
            "image": '/images/hAP_ac_lite.png'
        }, {
            "id": 20,
            "name": "hAP ac lite TC",
            "image": '/images/hAP_ac_lite_TC.png'
        }, {
            "id": 21,
            "name": "cAP",
            "image": '/images/cAP.png'
        }, {
            "id": 22,
            "name": "RB4011iGS+5HacQ2HnD-IN",
            "image": '/images/RB4011iGS+5HacQ2HnD-IN.png'

        }, {
            "id": 23,
            "name": "hAP ax lite LTE6",
            "image": '/public/images/hAP_ax_lite_LTE6.png'
        },
        {
            "id": 24,
            "name": "L009UiGS-2HaxD-IN",
            "image": '/images/L009UiGS-2HaxD-IN.png'
        },
        {
            "id": 25,
            "name": "RB2011UiAS-2HnD-IN",
            "image": '/images/RB2011UiAS-2HnD-IN.png'
        },

         {
            "id": 26,
            "name": "RB4011iGS+",
            "image": '/images/RB4011iGS+RM.png'
        },

    ])

const [cpuLoad, setCpuLoad] = useState(0)
const [freeMemory, setFreeMemory] = useState(0)
const [totalMemory, setTotalMemory] = useState(0)
const [freeHdd, setFreeHdd] = useState(0)
const [totalHdd, setTotalHdd] = useState(0)
const [routerVersion, setRouterVersion] = useState(0)

const [showRebootConfirm, setShowRebootConfirm] = useState(false);
const [archiTecture, setArchiTecture] = useState(null)



const rebootRouter = async(e) => {
  e.preventDefault()

    
  if (!showRebootConfirm) {
    setShowRebootConfirm(true);
    return;
  }

  try {
    
  const response = await fetch(`/api/reboot_router?id=${id}`, {
    method: 'POST',
              headers: { 'X-Subdomain': window.location.hostname.split('.')[0] },

  })

  const newData = await response.json()


  if (response.status === 402) {
    setTimeout(() => {
      window.location.href = '/license-expired';
     }, 1800);
    
  }
  
  if (response.ok) {
    toast.success('Router is rebooting', {
      position: "top-center",
      duration: 5000,
    });
        setShowSucessReboot(true);

     setTimeout(() => {
      navigate('/admin/nas')
     }, 2500);
  } else {



    toast.error(
      newData.error,{
        position: "top-center",
        duration: 5000,
      }
    )
  }
  } catch (error) {
    toast.error(
      'Failed to reboot router server error',{
        position: "top-center",
        duration: 5000,
      }
    )
  }
  


}





    const fetchRouterInfoo = useCallback(async () => {
        try {
          setLoading(true);
          setError(null);
          
          const response = await fetch(`/api/router_info?id=${id}`, {
            headers: { 'X-Subdomain': window.location.hostname.split('.')[0] },
          });
          
          if (!response.ok) throw new Error('Failed to fetch router info');
          
          const data = await response.json();
          setRouterInfo(data.board_name);
          setUptime(data.uptime);
          setCpuLoad(data.cpu_load);
          setFreeMemory(data.memory_usage.free);
          setTotalMemory(data.memory_usage.total);
          setFreeHdd(data.disk_usage.free);
          setTotalHdd(data.disk_usage.total);
          setRouterVersion(data.version);
          setArchiTecture(data.architecture_name)
          
          
          const matchedRouter = mikotik.find(router => router.name === data.board_name);
          setCurrentRouterImage(matchedRouter?.image || null);
          
        } catch (err) {
          setError(err.message);
          setRouterInfo(null);
          setUptime(null);
        } finally {
          setLoading(false);
        }
      }, []);
    
      useEffect(() => {
        fetchRouterInfoo();
        const intervalId = setInterval(fetchRouterInfoo, 8000);
        return () => clearInterval(intervalId);
      }, [fetchRouterInfoo]);



       const fetchRouterInterface = useCallback(async () => {
        try {
          setLoading(true);
          setError(null);
          
          const response = await fetch(`/api/get_router_interface
?id=${id}`, {
            headers: { 'X-Subdomain': window.location.hostname.split('.')[0] },
          });
          
          if (!response.ok) throw new Error('Failed to fetch router info');
          
          const data = await response.json();
          
        //  console.log('router interface data', data)
          if (response.ok) {
          setRouterInterface(data);

          }
        } catch (err) {
          setError(err.message);
          setRouterInfo(null);
          setUptime(null);
        } finally {
          setLoading(false);
        }
      }, []);
    
      useEffect(() => {
        fetchRouterInterface();
      
      }, [fetchRouterInterface]);





const [timezone, setTimeZone] = useState(null);



const handleGetSystemGeneralSettings = useCallback(
  async() => {
     try {
    const response = await fetch('/api/general_settings', {
      headers: {
        'X-Subdomain': window.location.hostname.split('.')[0]
      },
    })
    const newData = await response.json()
    if (response.ok) {
    //   setFormDataGeneralSettings({
    //     title: newData[0].title,
    //     timezone: newData[0].timezone,
    //     allowed_ips: newData[0].allowed_ips
    //   })
    setTimeZone(newData[0].timezone)
    } else {
      console.log('failed to fetch system general settings')
    }
  } catch (error) {
    console.log(error)
  }
  },
  [],
)

useEffect(() => {
  handleGetSystemGeneralSettings()
 
}, [handleGetSystemGeneralSettings]);

const status = searchParams.get('status')

const StatCard = ({ icon, title, value, unit, color = "blue", children }) => {
  const colors = {
    blue: "from-blue-500 to-blue-600",
    green: "from-green-500 to-green-600",
    orange: "from-orange-500 to-orange-600",
    purple: "from-purple-500 to-purple-600",
    red: "from-red-500 to-red-600"
  };

  return (
    <div className={`bg-gradient-to-br ${colors[color]} rounded-xl shadow-lg overflow-hidden text-white`}>
      <div className="p-5">
        <div className="flex justify-between items-center">
          <div className="text-2xl font-bold">
            {value} {unit && <span className="text-sm opacity-80">{unit}</span>}
          </div>
          <div className="p-3 rounded-full bg-white/20">
            {icon}
          </div>
        </div>
        <div className="mt-2 text-sm font-medium opacity-90">{title}</div>
        {children && <div className="mt-3">{children}</div>}
      </div>
    </div>
  );
};

const ProgressBar = ({ value, max = 100, color = "blue" }) => {
  const colors = {
    blue: "bg-blue-400",
    green: "bg-green-400",
    orange: "bg-orange-400",
    purple: "bg-purple-400",
    red: "bg-red-400"
  };

  const percentage = Math.min(100, (value / max) * 100);

  return (
    <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
      <div 
        className={`h-2.5 rounded-full ${colors[color]}`} 
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
  );
};





    
  return (
    <div>
  {/* <Lottie 
	    options={defaultOptions}
        height={400}
        width={400}
      /> */}

{status === 'Reachable' ? (
 <div className="space-y-6">
      <Toaster />
      
      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Uptime Card */}
        <StatCard 
          icon={<FcAlarmClock className="w-6 h-6" />} 
          title="System Uptime" 
          value={uptime || "N/A"}
          color="purple"
        />
        
        {/* CPU Card */}
        <StatCard 
          icon={<GoCpu className="w-6 h-6" />} 
          title="CPU Load" 
          value={cpuLoad || "0"} 
          unit="%"
          color="orange"
        >
          <ProgressBar value={parseFloat(cpuLoad) || 0} color="orange" />
        </StatCard>
        
        {/* Memory Card */}
        <StatCard 
          icon={<MdMemory className="w-6 h-6" />} 
          title="Memory Usage" 
          value={`${((totalMemory - freeMemory) / totalMemory * 100)}`} 
          unit="%"
          color="blue"
        >
          <div className="text-xs mb-1">
            {freeMemory} free of {totalMemory}
          </div>
          <ProgressBar 
            value={((totalMemory - freeMemory) / totalMemory * 100)} 
            color="blue" 
          />
        </StatCard>
        
        {/* Disk Card */}
        <StatCard 
          icon={<FiHardDrive className="w-6 h-6" />} 
          title="Disk Usage" 
          value={`${((totalHdd - freeHdd) / totalHdd * 100).toFixed(1)}`} 
          unit="%"
          color="green"
        >
          <div className="text-xs mb-1">
            {freeHdd} free of {totalHdd}
          </div>
          <ProgressBar 
            value={((totalHdd - freeHdd) / totalHdd * 100)} 
            color="green" 
          />
        </StatCard>
      </div>
      
      {/* Router Info Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Router Board Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden 
        border border-gray-200 dark:border-gray-700">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <GoServer className="text-blue-500" />
                Router Board
              </h3>
              {currentRouterImage && (
                <img 
                  src={currentRouterImage} 
                  alt="router" 
                  className="w-16 h-16 object-contain" 
                />
              )}
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Model:</span>
                <span className="font-medium">{routerInfo || "N/A"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Version:</span>
                <span className="font-medium">{routerVersion || "N/A"}</span>
              </div>


              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Architecture:</span>
                <span className="font-medium">{archiTecture || "N/A"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Timezone:</span>
                <span className="font-medium">{timezone || "N/A"}</span>
              </div>
            </div>
            
            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
              {showRebootConfirm ? (
                <div className="flex gap-3">
                  <button 
                    onClick={rebootRouter}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    Confirm Reboot
                  </button>
                  <button 
                    onClick={() => setShowRebootConfirm(false)}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 py-2 px-4 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button 
                  onClick={rebootRouter}
                  className="w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  Reboot Router
                  <IoWarningOutline className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </div>
        
{/* Traffic Stats Card */}
<div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg
 overflow-hidden border border-gray-200 dark:border-gray-700 lg:col-span-2">
  <div className="p-6">
    <h3 className="text-lg font-bold flex items-center gap-2 mb-4">
      <FcAreaChart className="w-6 h-6" />
      Network Traffic
    </h3>
    
    <div className="mb-4">
      <select
        value={routerInterfaceForm}
        onChange={(e) => {
          setRouterInterfaceForm(e.target.value);
          localStorage.setItem('routerInterfaceForm', e.target.value);
          fetchTrafficStats(e.target.value);
        }}
        className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg
         focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700
          dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
      >
        {routerInterface.map((option) => (
          <option key={option.id} value={option.name}>
            {option.name}
          </option>
        ))}
      </select>
    </div>
    
    {/* Modified graph container with more height and padding */}
    <div className="h-80 pb-8">  {/* Increased from h-64 and added pb-8 */}
      <TrafficStatsGraph trafficData={trafficData} />
    </div>
  </div>
</div>        
      </div>
      
      {/* Reboot Success Message */}
      {showSucessReboot && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg animate-bounce">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
            Router is rebooting. Please wait...
          </div>
        </div>
      )}
    </div>
):  <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-red-100 dark:border-red-900 max-w-md mx-auto"
    >
      {/* Lottie Animation */}
      <div className="relative mb-6">
        <Lottie 
          options={defaultOptions}
          height={200}
          width={200}
        />
        
        {/* Red alert circle around animation */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-48 h-48 rounded-full border-4 border-red-200 dark:border-red-800 opacity-60 animate-pulse"></div>
        </div>
      </div>

      {/* Error Message */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="text-center"
      >
        <h3 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-3">
          Connection Failed
        </h3>
        
        <p className="text-gray-600 dark:text-gray-300 mb-6 text-lg">
          {message}
        </p>

        {/* Action Buttons */}
       

        {/* Additional Help Text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg"
        >
          <p className="text-sm text-red-700 dark:text-red-300">
            💡 Check if the router is powered on and connected to the network
          </p>
        </motion.div>
      </motion.div>
    </motion.div>  

}
     
    </div>
  )
}

export default RouterDetails
