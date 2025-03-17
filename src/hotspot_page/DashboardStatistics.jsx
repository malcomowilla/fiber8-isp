

import React, { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { useApplicationSettings } from '../settings/ApplicationSettings';


// Statistic Card Component
const StatCard = ({ title, value, icon, color }) => {
  const [animatedValue, setAnimatedValue] = useState(0);
  const {companySettings, setCompanySettings,

    templateStates, setTemplateStates,
    settingsformData, setFormData,
    handleChangeHotspotVoucher, voucher, setVoucher
  } = useApplicationSettings()



  useEffect(() => {
    const animate = setTimeout(() => {
      setAnimatedValue(value);
    }, 500); // Delay animation for a smoother effect
    return () => clearTimeout(animate);
  }, [value]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`p-6 rounded-lg shadow-lg ${color} text-white`}
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="text-3xl font-bold">{animatedValue}</p>
        </div>
        <div className="text-4xl">{icon}</div>
      </div>
    </motion.div>
  );
};

// Main Dashboard Component
const DashboardStatistics = () => {
  const [expiredVouchers, setExpiredVouchers] = useState(0)
  const [activeVouchers, setActiveVouchers] = useState(0)
  const [onlineUsers, setOnlineUsers] = useState(0)
  const {companySettings, setCompanySettings,

    templateStates, setTemplateStates,
    settingsformData, setFormData,
    handleChangeHotspotVoucher, voucher, setVoucher
  } = useApplicationSettings()

const subdomain = window.location.hostname.split('.')[0];




const fetchRouters = useCallback(
  async() => {
    try {
      const response = await fetch('/api/allow_get_router_settings', {
        headers: {
          'X-Subdomain': subdomain,
        },
      })
 const newData = await response.json()
      if (response) {
        console.log('fetched router settings', newData)
        const {router_name} = newData[0]
        setFormData({...settingsformData, router_name})
      } else {
        console.log('failed to fetch router settings')
      }
    } catch (error) {
      console.log(error)
    }
  },
  [],
 )
 
 
 
  useEffect(() => {
   
    fetchRouters()
  }, [fetchRouters]);

 
const getActiveHotspotUsers = useCallback(
  async() => {

    try {
      const response = await fetch(`/api/get_active_hotspot_users?router_name=${settingsformData.router_name}`)
      const newData = await response.json()
      if (response.ok) {
        // setPackages(newData)
        const { hotspot_users } = newData
        setOnlineUsers(newData.active_user_count)
        console.log('hotspot users fetched', newData)
      }else{
        // toast.error('failed to get active users', {
        //   position: "top-center",
        //   duration: '5000'
          
        // })
      }
    } catch (error) {
      // toast.error('failed to get active users', {
      //   position: "top-center",
      //   duration: '5000'
        
      // })
    }
  },
  [],
)


useEffect(() => {

  const interval = setInterval(() => {
    getActiveHotspotUsers()
  }, 10000);
  return () => clearInterval(interval);
  
}, [getActiveHotspotUsers]);





console.log('active vouchers fetched', expiredVouchers)


const getActiveVouchers = useCallback(
  async() => {
   
    try {
      const response = await fetch('/api/hotspot_vouchers', {
        headers: {
          'X-Subdomain': subdomain,
        },
      })
      const newData = await response.json()
      if (response.ok) {
        setActiveVouchers(newData.active_voucher.filter(voucher => voucher.status === 'active').length)

      } else {
        setActiveVouchers(0)
      }
    } catch (error) {
      setActiveVouchers(0)
    }
  },
  [],
)


useEffect(() => {
  getActiveVouchers()
  
}, [getActiveVouchers]);










  const getExpiredVouchers = useCallback(
    async() => {
     
      try {
        const response = await fetch('/api/hotspot_vouchers', {
          headers: {
            'X-Subdomain': subdomain,
          },
        })
        const newData = await response.json()
        if (response.ok) {
          setExpiredVouchers(newData.active_voucher.filter(voucher => voucher.status === 'expired').length)
          
        } else {
          setExpiredVouchers(0)
        }
      } catch (error) {
        setExpiredVouchers(0)
      }
    },
    [],
  )
  


  useEffect(() => {
    getExpiredVouchers()
   
  }, [getExpiredVouchers]);
  const stats = [
    {
      title: "Active Vouchers",
      value: activeVouchers,
      icon: "🎫",
      color: "bg-purple-500",
    },

    {
      title: "Expired Vouchers",
      value: expiredVouchers, // Example value
      icon: "⛔", // Icon for expired vouchers
      color: "bg-red-500", // Red color for expired items
    },
    {
      title: "Online Users",
      value: onlineUsers,
      icon: "👥",
      color: "bg-blue-500",
    },
    {
      title: "Payments Today",
      value: 2300,
      icon: "💳",
      color: "bg-green-500",
    },
    {
      title: "Payments This Month",
      value: 45000,
      icon: "💰",
      color: "bg-orange-500",
    },
    {
      title: "Data Consumed",
      value: 1200,
      icon: "📊",
      color: "bg-pink-500",
    },
  ];

  return (
    <div className="min-h-sm bg-gradient-to-r from-blue-500 to-purple-600 p-8">
      <h1 className="text-4xl  text-white 
      font-thin
      mb-8">Hotspot Statistics</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            color={stat.color}
          />
        ))}
      </div>
    </div>
  );
};

export default DashboardStatistics;   