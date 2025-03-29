import React from 'react';
import { motion } from 'framer-motion';
import { FaServer, FaShieldAlt, FaLock } from 'react-icons/fa';
import { SiWireguard, SiOpenvpn } from 'react-icons/si';
import {useApplicationSettings} from '../settings/ApplicationSettings'

const NetworkComponents = () => {

const {pingStatus} = useApplicationSettings()

console.log('ping status', pingStatus)


  const services = [
    {
      name: "Free Radius",
      status: "online",
      icon: <img src='/public/images/free_radius.svg' className="w-6 h-6" />,
      description: "Authentication server for network access",
      color: "bg-blue-100"
    },
    {
      name: "WireGuard",
      status: "online",
      icon: <SiWireguard className="text-purple-500 text-4xl" />,
      description: "Modern VPN with state-of-the-art cryptography",
      color: "bg-purple-100"
    },



    {
        name: "MikroTik",
        status:  pingStatus.router_status?.reachable === true ? "online" : "offline",
        icon: <img src='/public/images/mikrotik.svg' className="w-10 h-10" />,
        description: "a network device, or rather a router and wireless access point, that runs the RouterOS operating system, based on Linux, and is known for its flexibility, advanced features, and ability to handle a wide range of networking tasks ",
        color: "bg-white",
        button: true
      },
    {
      name: "OpenVPN",
      status: "offline",
      icon: <SiOpenvpn className="text-green-500 text-4xl" />,
      description: "Full-featured open source VPN solution",
      color: "bg-green-100"
    }
  ];

  return (
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
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                pingStatus.router_status?.reachable === true
                  ? "bg-green-100 text-green-800" 
                  : "bg-red-100 text-red-800"
              }`}>
                {service.status.toUpperCase()}
              </span>
            </div>
            
            <p className="text-gray-600 mb-4">{service.description}</p>
            
            <div className="flex items-center justify-between">
              <div className="flex space-x-2">
                <span className="text-sm text-gray-500">Last checked:</span>
                <span className="text-sm font-medium">Just now</span>
              </div>

{service.button === true ? (

<div className=''>

<button className='w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700'> Reboot </button>
                </div>
) : ''}
            
              
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: pingStatus.router_status?.reachable === true  ? 1 : 0.6
                }}
                transition={{ repeat: Infinity, duration: 2 }}
                className={`w-3 h-3 rounded-full ${
                    pingStatus.router_status?.reachable === true 
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
                pingStatus.router_status?.reachable === true 
                ? "bg-green-500" 
                : "bg-red-500"
            }`}
          />
        </motion.div>
      ))}
    </div>
  );
};

export default NetworkComponents;