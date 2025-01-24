// import React from 'react'
import { motion } from 'framer-motion'
// import { Link } from 'react-router-dom'
import { FaWifi, FaLock, FaCheckCircle } from 'react-icons/fa'
// import { FaPhone } from "react-icons/fa6";
// import toast, { Toaster } from 'react-hot-toast';
// import { useEffect, useState } from 'react';
import { TiArrowBackOutline } from "react-icons/ti";
// import { SlNotebook } from "react-icons/sl";
// import { HiMiniArrowLeftEndOnRectangle } from "react-icons/hi2";
import { useNavigate } from 'react-router-dom';
import { FaPerson } from "react-icons/fa6";
import { FaKey } from "react-icons/fa";
import { useApplicationSettings } from '../settings/ApplicationSettings';
import toast, { Toaster } from 'react-hot-toast';

import { useEffect, useState, useCallback } from 'react';







const HotspotLogin = () => {
const navigate = useNavigate()

    const containerVariants = {
        hidden: { opacity: 0, x: '100vw' },
        visible: {
          opacity: 1,
          x: 0,
          transition: { type: 'spring', stiffness: 50 }
        }
      };




      const buttonVariants = {
        hover: {
          scale: 1.1,
          textShadow: "0px 0px 8px rgb(255, 255, 255)",
          boxShadow: "0px 0px 8px rgb(0, 0, 0, 0.2)"
        }
      };




const {companySettings, setCompanySettings} = useApplicationSettings()

const {company_name, contact_info, email_info, logo_preview} = companySettings







const handleGetCompanySettings = useCallback(
  async() => {
    try {
      const response = await fetch('/api/allow_get_company_settings', {
      })
      const newData = await response.json()
      if (response.ok) {
        // setcompanySettings(newData)
        const { contact_info, company_name, email_info, logo_url,
          customer_support_phone_number,agent_email ,customer_support_email
         } = newData
        setCompanySettings((prevData)=> ({...prevData, 
          contact_info, company_name, email_info,
          customer_support_phone_number,agent_email ,customer_support_email,
        
          logo_preview: logo_url
        }))

        console.log('company settings fetched', newData)
      }else{
        console.log('failed to fetch company settings')
      }
    } catch (error) {
      toast.error('internal servere error  while fetching company settings')
    
    }
  },
  [setCompanySettings],
)

useEffect(() => {
  
  handleGetCompanySettings()
  
}, [handleGetCompanySettings])


  return (

    <>
    <Toaster/>
    <div className='min-h-screen   relative  z-0 flex items-center justify-center
     bg-gradient-to-r from-orange-500 to-yellow-500 p-4'>



<motion.div
 className="max-w-md w-full bg-white rounded-xl shadow-lg p-6"
 variants={containerVariants}
 initial="hidden"
 animate="visible"
>
    
 <div className="text-center mb-6">
   <FaWifi className="text-orange-500 w-12 h-12 mx-auto mb-4" />
   <h1 className="text-3xl  text-gray-900  dotted-font font-thin">Welcome to Fiber8 Hotspot</h1>
   <p className="text-gray-600 dotted-font ">Connect and enjoy fast browsing.</p>
 </div>

 <motion.div
   className="flex justify-between items-center bg-gray-100 p-4 rounded-lg mb-4"
   whileHover={{ scale: 1.02 }}
 >
   {/* <FaLock className="text-green-500 w-8 h-8" /> */}
   <FaPerson className="text-green-500 w-8 h-8"/>
   <input type="text" className='w-full text-gray-700 bg-gray-100 rounded-lg p-2 focus:outline-none' 
   placeholder="Enter your username"/>
   {/* <p className="text-gray-700">Secure Connection</p> */}
 </motion.div>





 <motion.div
   className="flex justify-between items-center bg-gray-100 p-4 rounded-lg mb-4"
   whileHover={{ scale: 1.02 }}
 >
   {/* <FaLock className="text-green-500 w-8 h-8" /> */}
   <FaKey className="text-green-500 w-6 h-6"/>
   <input type="password" className='w-full text-gray-700 bg-gray-100 rounded-lg p-2 focus:outline-none' 
   placeholder="Enter your password"/>
   {/* <p className="text-gray-700">Secure Connection</p> */}
 </motion.div>
 <motion.div
   className="flex justify-between items-center bg-gray-100 p-4 rounded-lg mb-4"
   whileHover={{ scale: 1.02 }}
 >
   {/* <FaCheckCircle className="text-green-500 w-8 h-8" />
   <p className="text-gray-700">Easy Access</p> */}
 </motion.div>

 <motion.button
   variants={buttonVariants}
   whileHover="hover"
   className="w-full py-2 px-4 bg-orange-500 text-white  rounded-full shadow-md
    focus:outline-none dotted-font font-thin"
   onClick={() => alert('Connected!')}
 >
   Connect Now
 </motion.button>

<div className='flex justify-center items-center cursor-pointer' onClick={()=>  {
  navigate(-1)
} }>
<TiArrowBackOutline className="mt-6 text-center w-8 h-8"/>

</div>
{/* 
 <div className="mt-6 text-center">
   <Link to="/terms" className="text-blue-500 hover:underline">
     Terms & Conditions
   </Link>
 </div> */}
</motion.div>

    </div>
    </>
  )
}

export default HotspotLogin