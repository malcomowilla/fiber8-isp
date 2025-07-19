
import { useState, useEffect } from 'react'
import { useApplicationSettings } from '../settings/ApplicationSettings'
import { motion } from 'framer-motion';
import { LuTicketSlash } from "react-icons/lu";
import { CgDanger } from "react-icons/cg";
import { IoCheckmarkDoneOutline } from "react-icons/io5";
import { AiOutlineFire } from "react-icons/ai";





const StatCard = ({ title, value, icon, color, extratext }) => {
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
            <h3 className="text-lg font-semibold ">{title}</h3>
            <p className="text-3xl font-bold">{animatedValue}</p>
            <p> {extratext} </p>
          </div>
          <div className="text-4xl">{icon}</div>
        </div>
      </motion.div>
    );
  };


  const stats = [
    {
      title: <p className='text-black '>Total Tickets</p>,
      value: <p className='text-black '>0</p>, 
      extratext: <p className='text-black '> All support tickets</p>,
      icon: <div className='bg-green-300 p-1 rounded-lg'>< LuTicketSlash className='text-green-500'/></div>,

      color: "bg-white",
    },

    {
        title: <p className='text-black '>Open Tickets</p>,
        value: <p className='text-black '>0</p>, 
        extratext: <p className='text-black '> Ticket requiring attention</p>,
        icon:  <div className='bg-orange-300 p-1 rounded-lg'>< CgDanger className='text-red-500'/></div>,
  
        color: "bg-white",
    },
    {
      title: "Solved Tickets",
      value: 0,
      icon: <IoCheckmarkDoneOutline />,
      extratext: <p className='text-white'> Ticket resolved(issue resolved)</p>,
      color: "bg-green-500",
    },
    {
      title: <p className='text-black'>High Priority Tickets</p>,
      value: <p className='text-black'>0</p>,
      icon:  <div className='bg-red-300 p-1 rounded-lg'><AiOutlineFire  className='text-red-500'/> </div>,
      extratext: <p className='text-black'> High Priority Ticket</p>,
      color: "bg-white",
    },
  
   
  ];

const TicketStatistics = () => {
  return (
    <div className="min-h-sm bg-gradient-to-r  p-8">
     
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            extratext={stat.extratext}
            color={stat.color}
          />
        ))}
      </div>
    </div>
  )
}

export default TicketStatistics