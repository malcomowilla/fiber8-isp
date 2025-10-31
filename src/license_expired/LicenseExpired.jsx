import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiAlertTriangle, FiClock, FiRefreshCw, FiMail } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { FaPhoneVolume } from "react-icons/fa";


const LicenseExpired = () => {


    const [expiry, setExpiry] = useState('No license')
const [expiry2, setExpiry2] = useState('No license')
const navigate = useNavigate()



const subdomain = window.location.hostname.split('.')[0];

const getCurrentHotspotPlan = useCallback(
    async() => {
      const response = await fetch('/api/allow_get_current_hotspot_plan', {
        headers: {
          'X-Subdomain': subdomain,
        },
      })
      const newData = await response.json()
      if (response.ok) {
        console.log('current hotspot plan', newData)
        setExpiry2(newData[0].expiry)
        // setCurrentPPOEPlan(newData.message)
      }
    },
    [],
  )

useEffect(() => {
  getCurrentHotspotPlan()
 
}, [getCurrentHotspotPlan]);



  const getCurrentPPOEPlan = useCallback(
    async() => {
      const response = await fetch('/api/allow_get_current_pppoe_plan', {
        headers: {
          'X-Subdomain': subdomain,
        },
      })
      const newData = await response.json()
      if (response.ok) {
        console.log('current pppoe plan', newData)
        setExpiry(newData[0].expiry)
        // setCurrentPPOEPlan(newData.message)
      }
    },
    [],
  )

  useEffect(() => {
    getCurrentPPOEPlan()
   
  }, [getCurrentPPOEPlan]);


  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 }
    }
  };

  const pulseVariants = {
    pulse: {
      scale: [1, 1.05, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut'
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 
    flex items-center justify-center p-4">
      <AnimatePresence>
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-red-500/30"
        >
          {/* Header */}
          <motion.div
            variants={itemVariants}
            className="bg-red-500/10 p-6 flex items-center gap-4 border-b border-red-500/20"
          >
          
            <motion.div
              variants={pulseVariants}
              animate="pulse"
              className="p-3 bg-red-500/20 rounded-full"
            >
              <FiAlertTriangle className="text-red-500 text-3xl" />
            </motion.div>
            <div>
              <h2 className="text-2xl font-bold text-red-600 dark:text-red-400">License Expired</h2>
              <p className="text-red-500/80 dark:text-red-400/80">Your access has been restricted</p>
            </div>
          </motion.div>

          {/* Content */}
          <motion.div variants={itemVariants} className="p-6 space-y-6">
            <div className="flex items-start gap-4">
              <FiClock className="text-yellow-500 mt-1 text-xl" />
              <div>
                <h3 className="font-semibold text-gray-800 dark:text-gray-200 ">Subscription Ended</h3>
                <p className="text-gray-600 dark:text-gray-400 flex flex-col">
                   <span className="font-medium"> Your license expired on - <span className='font-bold'>{expiry}</span> </span>

                  <span className="font-medium">  Hotspot License - Expired on  <span className='font-bold'>{expiry2} </span> </span>
                </p>


              </div>
            </div>

            <div className="flex items-start gap-4">
              <FiRefreshCw className="text-blue-500 mt-1 text-xl" />
              <div>
                <h3 className="font-semibold text-gray-800 dark:text-gray-200">Renew Now</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  To restore access, please renew your subscription
                </p>
              </div>
            </div>

            <motion.button
            onClick={() => {
              navigate('/admin/user-license')
            }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white py-3 px-6 rounded-lg font-medium shadow-lg hover:shadow-red-500/20 transition-all"
            >
              Renew License
            </motion.button>
          </motion.div>

          {/* Footer */}
          
          <motion.div
            variants={itemVariants}
            className="bg-gray-50 dark:bg-gray-700/50
            flex flex-col items-center justify-center
            p-4 text-center"
          >
             <p className='font-bold'>Contact Support </p>

            <a
              href="mailto:owillamalcom@gmail.com"
              className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400
               hover:text-green-500 transition-colors"
            >
              <FiMail className=''/>
              <p className='text-sm text-black'>owillamalcom@gmail.com</p>
            </a>


<div
onClick={()=>{window.location.href = `tel:0791568852`}}
 className='flex gap-2 cursor-pointer' >
            <FaPhoneVolume className='mt-2' />
              <p className='text-sm mt-2 text-black '>+2547 9156 88 52</p>
</div>

 
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {/* Floating particles animation */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ y: 0, x: Math.random() * 100 - 50 }}
          animate={{
            y: [0, -100, -200, -300],
            x: [0, Math.random() * 100 - 50, Math.random() * 100 - 50],
            opacity: [1, 0.8, 0.5, 0]
          }}
          transition={{
            duration: 10 + Math.random() * 10,
            repeat: Infinity,
            delay: Math.random() * 5
          }}
          className="absolute rounded-full bg-red-500/20"
          style={{
            width: `${Math.random() * 10 + 5}px`,
            height: `${Math.random() * 10 + 5}px`,
            left: `${Math.random() * 100}%`,
            bottom: '-100px'
          }}
        />
      ))}
    </div>
  );
};

export default LicenseExpired;