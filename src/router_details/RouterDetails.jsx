
import { FcAlarmClock } from "react-icons/fc";
import { GoCpu } from "react-icons/go";
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





const RouterDetails = () => {
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
        }

    ])

const [cpuLoad, setCpuLoad] = useState(0)
const [freeMemory, setFreeMemory] = useState(0)
const [totalMemory, setTotalMemory] = useState(0)
const [freeHdd, setFreeHdd] = useState(0)
const [totalHdd, setTotalHdd] = useState(0)
const [routerVersion, setRouterVersion] = useState(0)

const [showRebootConfirm, setShowRebootConfirm] = useState(false);



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
    
  return (
    <div>
      <Toaster />

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>

<div className='bg-white dark:bg-gray-800 rounded-lg shadow-2xl p-6 border-l-4 border-blue-500'>
    <p className='font-bold'>SYSTEM DATE AND TIME</p>
        <span className='flex gap-2'>UPTIME: <p>{uptime}</p> </span>
                <span className='flex gap-2'>TIMEZONE: <p>{timezone}</p> </span>

<FcAlarmClock className='w-7 h-7' />
</div>




<div className='bg-white dark:bg-gray-800 rounded-lg shadow-2xl p-6 border-l-4 border-blue-500'>
        <p className='font-bold'>SYSTEM RESOURCES</p>
                <span className='flex gap-2'>CPU LOAD: <p>{cpuLoad}</p> </span>
                <span className='flex gap-2'>FREE MEMORY: <p>{freeMemory}</p> </span>
                <span className='flex gap-2'>TOTAL MEMORY: <p>{totalMemory}</p> </span>
                <span className='flex gap-2'>FREE HDD: <p>{freeHdd}</p> </span>
                <span className='flex gap-2'>TOTAL HDD: <p>{totalHdd}</p> </span>


<GoCpu className='w-7 h-7'/>
</div>







<div className='bg-white dark:bg-gray-800 rounded-lg shadow-2xl p-6 border-l-4 border-blue-500'>
        <p className='font-bold'>ROUTERBOARD</p>

       <div className='flex'>       
<img src={currentRouterImage} alt="router" className='w-20 h-20 object-contain' />

                <div className='flex flex-col'>
                <span className='flex gap-2'>BOARD NAME: <p>{routerInfo}</p> </span>
                <span className='flex gap-2'>ROUTER OS: <p>{routerVersion}</p> </span></div>
               
                </div>
{showSucessReboot ? (

<div className="flex items-center p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400" role="alert">
  <svg className="shrink-0 inline w-4 h-4 me-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
    <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
  </svg>
  <span className="sr-only">Info</span>
  <div>
    <span className="font-medium">Success</span> Router is rebooting please wait for a few minutes...
  </div>
</div>
): null}


        {showRebootConfirm ? (
      <div className='flex space-x-2'>
        <button 
          onClick={rebootRouter}
          className='bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700'
        >
          Confirm Reboot
        </button>
        <button 
          onClick={() => setShowRebootConfirm(false)}
          className='bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600'
        >
          Cancel
        </button>
      </div>
    ) : (
      <button 
        onClick={rebootRouter}
        className='bg-red-500 text-white py-2 px-4
        rounded-lg hover:bg-red-600 disabled:bg-gray-500 disabled:text-white
        '
      >
        Reboot
                <IoWarningOutline className='w-5 h-5 text-white' />

      </button>
    )}
    

       <Box 
       
       sx={{ minWidth: 120 , 

        mt: 2

        }} >
      <FormControl sx={{ minWidth: 120 }} >
        <InputLabel id="demo-simple-select-label">Interface</InputLabel>
        <Select
          id="demo-simple-select"
          value={routerInterfaceForm}
          label="Interface"
          onChange={handleChange}
        >
          {routerInterface.map((option) => (
            <MenuItem key={option.id} value={option.name}>
              {option.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
</div>
      </div>


     <div className="mt-8">
      <TrafficStatsGraph trafficData={trafficData} />
    </div>
    </div>
  )
}

export default RouterDetails
