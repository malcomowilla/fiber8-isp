import React from 'react';
import { motion } from 'framer-motion';
import { FaServer, FaShieldAlt, FaLock } from 'react-icons/fa';
import { SiWireguard, SiOpenvpn } from 'react-icons/si';
import {useApplicationSettings} from '../settings/ApplicationSettings'
import {useEffect, useCallback, useState} from 'react'
import toast,{Toaster} from 'react-hot-toast'
import { useLocation } from 'react-router-dom';

const NetworkComponents = () => {

const {pingStatus, setPingStatus} = useApplicationSettings()
const [serviceStatus, setServiceStatus] = useState({ freeradius: {}, wireguard: {} });
const location = useLocation()

console.log('ping status', pingStatus)

const subdomain = window.location.hostname.split('.')[0];
console.log('subdomain', subdomain)


const fetchServiceStatus = async () => {
  try {
    const response = await fetch('/api/service_status');
    const data = await response.json();
    setServiceStatus(data);
  } catch (error) {
    toast.error("Failed to fetch service status");
  }
};



useEffect(() => {
  fetchServiceStatus();
  const interval = setInterval(fetchServiceStatus, 30000); // Refresh every 30 seconds
  return () => clearInterval(interval);
}, []);
  const services = [
    {


      name: "Free Radius",
      status: serviceStatus?.freeradius?.running,
      lastRestart: serviceStatus?.freeradius?.last_restart || "Unknown",
      description: "Authentication server for network access",
      color: "bg-blue-100",
      restartable: true,
      service_name: "freeradius",

    },
    {
      name: "WireGuard",
      status: serviceStatus?.wireguard?.running,
      lastRestart: serviceStatus?.wireguard?.last_restart || "Unknown",
      icon: <SiWireguard className="text-purple-500 text-4xl" />,
      description: "Modern VPN with state-of-the-art cryptography",
      color: "bg-purple-100",
      restartable: true,
      service_name: "wg-quick@wg0",

    },



    {
        name: "MikroTik",
        status:  pingStatus?.reachable,
        icon: <img src='/images/mikrotik.svg' className="w-10 h-10" />,
        description: "a network device, or rather a router and wireless access point, that runs the RouterOS operating system, based on Linux, and is known for its flexibility, advanced features, and ability to handle a wide range of networking tasks ",
        color: "bg-white",
        button: true,
        checked_at: pingStatus?.checked_at
      },
    {
      name: "OpenVPN",
      status: "offline",
      icon: <SiOpenvpn className="text-green-500 text-4xl" />,
      description: "Full-featured open source VPN solution",
      color: "bg-green-100"
    }
  ];






  const getPingStatus = useCallback(
    async() => {
      

      const response = await fetch('/api/router_ping_response',{
        headers: {
          'X-Subdomain': subdomain,
        },
      })
      const newData = await response.json()
      if (response.ok) {
        setPingStatus(newData)
        console.log('router ping status fetch', newData)
        // setTableData((prevData) => ({
        //   ...prevData, 
        //   ...newData // This will overwrite existing keys if they exist
        // }));
        console.log('router ping status', newData)
      
      }else{
        // toast.error('failed to get router ping status something went wrong', {
        //   position: "top-center",
        //   duration: 5000,
        // })
      }
    },
    [],
  )
  



  useEffect(() => {
    getPingStatus(); // Initial fetch
  
     const intervalId = setInterval(() => {
      getPingStatus();
    }, 35000); // Fetch every 60 seconds
    return () => clearInterval(intervalId);
  
  }, [getPingStatus]); 
  
  



  const restartService = async (service) => {
    try {
      const response = await fetch('/api/restart_service', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ service }),
      });

      if (response.ok) {
        toast.success(`${service} restarted successfully`);
        fetchServiceStatus(); // Refresh status after restart
      } else {
        toast.error(`Failed to restart ${service}`);
      }
    } catch (error) {
      toast.error(`Error restarting ${service}`);
    }
  };
  return (


    <>
    <Toaster />
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
      {services.map((service, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.5 }}
          whileHover={{ scale: 1.03 }}
          className={`rounded-xl shadow-lg overflow-hidden ${service.color}`}
        >
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center space-x-3">
                {service.icon}
                <h3 className="text-xl font-bold text-gray-800">{service.name}</h3>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold
              ${
                service?.status === true
                  ? "bg-green-100 text-green-800" 
                  : "bg-red-100 text-red-800"
              }`}>
                {service?.status === true ? 'Online' : 'Offline'}
              </span>
            </div>
            
            <p className="text-gray-600 mb-4">{service?.description}</p>
            
            <div className="flex items-center justify-between">
              <div className="flex space-x-2">
                <span className="text-sm text-black">Last checked: {service?.lastRestart}</span>
                <span className="text-sm font-medium text-black">{service.checked_at && service.checked_at}</span>
              </div>

{service.button === true ? (

<div className=''>

<button className='w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700'> Reboot </button>
                </div>
) : ''}

          {!subdomain.startsWith('aitechs') ? (
            <>

{service.restartable && (
              <button
                className=" bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700"
                onClick={() => restartService(service?.service_name)}
              >
                Reboot
              </button>
            )}
            </>
          ): ''}  
           
              
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: pingStatus?.reachable === true  ? 1 : 0.6
                }}
                transition={{ repeat: Infinity, duration: 2 }}
                className={`w-3 h-3 rounded-full ${
                    pingStatus?.reachable === true 
                    ? "bg-green-500" 
                    : "bg-red-500"
                }`}
              />
            </div>
          </div>
          
          {/* Animated status bar */}
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 1 }}
            className={`h-1 ${
                pingStatus?.reachable === true 
                ? "bg-green-500" 
                : "bg-red-500"
            }`}
          />
        </motion.div>
      ))}
    </div>

    </>
  );
};

export default NetworkComponents;