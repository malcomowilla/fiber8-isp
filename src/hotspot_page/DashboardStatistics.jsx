

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
      className={`p-6 rounded-lg shadow-2xl ${color} text-white`}
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







const getActiveVouchers = useCallback(
  async() => {
   
    try {
      const response = await fetch('/api/hotspot_vouchers', {
        headers: {
          'X-Subdomain': subdomain,
        },
      })
      const newData = await response.json()
      if (response.ok ) {
        // Ensure it's an array before filtering
        const activeCount = newData?.filter(voucher => voucher.status === 'active').length;
        setActiveVouchers(activeCount);
      } else {
        setActiveVouchers(0);
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








const getExpiredVouchers = useCallback(async () => {
  try {
    console.log("Fetching expired vouchers..."); // <== Check if this appears

    const response = await fetch('/api/hotspot_vouchers', {
      headers: { 'X-Subdomain': subdomain },
    });

    console.log("Response received:", response); // <== Log response object

    const newData = await response.json();

    console.log("Parsed JSON:", newData); // <== Log full response data

    if (response.ok) {
      console.log("Filtered expired vouchers:", newData?.filter(voucher => voucher.status === "expired").length);

      const expiredCount = newData?.filter(voucher => voucher.status === "expired").length
      setExpiredVouchers(expiredCount);
    } else {
      setExpiredVouchers(0);
    }
  } catch (error) {
    console.error("Error fetching vouchers:", error);
    setExpiredVouchers(0);
  }
}, []);
  


  useEffect(() => {
    getExpiredVouchers()
   
  }, [getExpiredVouchers]);


  const stats = [
    {
      title: <p className='font-thin'>Active Vouchers</p>,
      value: activeVouchers,
      icon: "🎫",
      color: "bg-purple-500",
    },

    {
      title: <p className='font-thin'>Expired Vouchers</p>,
      value: <p className='font-thin'>{expiredVouchers}</p>, // Example value
      icon: "⛔", // Icon for expired vouchers
      color: "bg-red-500", // Red color for expired items
    },
    {
      title: <p className='font-light'>Online Users</p>,
      value: <p className='font-light'> {onlineUsers}</p>,
      icon: "👥",
      color: "bg-blue-500",
    },
    {
      title: <p className='font-thin text-black'>Payments Today  </p>,
      value: <p className='font-thin text-black'>2300</p>,
      icon: "💳",
      color: "bg-white",
    },
    {
      title: <p className='font-light'>Payments This Month</p>,
      value: <p className='font-light'>45000</p>,
      icon: "💰",
      color: "bg-orange-500",
    },
    {
      title: <p className='font-light'>Data Consumed</p>,
      value: <p className='font-light'>1200</p>,
      icon: "📊",
      color: "bg-pink-500",
    },
  ];

  return (
    <div className="min-h-sm bg-gradient-to-r  p-2">
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