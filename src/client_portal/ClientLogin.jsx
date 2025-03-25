import React, { useState, useEffect, useCallback} from 'react';
import { motion } from 'framer-motion';
import { FaUser, FaLock } from 'react-icons/fa'; // Icons for username and password
import {useApplicationSettings} from '../settings/ApplicationSettings'

const ClientLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const {companySettings,  setCompanySettings} = useApplicationSettings()

  const { company_name, agent_email, customer_support_email, logo_preview } = companySettings

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your login logic here
    console.log('Username:', username, 'Password:', password);
  };


const subdomain = window.location.hostname.split('.')[0];



  const handleGetCompanySettings = useCallback(
    async() => {
      try {
        const response = await fetch('/api/allow_get_company_settings', {
          headers: {
            'X-Subdomain': subdomain,
          },
        })
        const newData = await response.json()
        if (response.ok) {
          // setcompanySettings(newData)
          const { contact_info, company_name, email_info, logo_url,
            customer_support_phone_number,agent_email ,customer_support_email
           } = newData

        //    setLogoUrl(logo_url)
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
        console.log('internal servere error  while fetching company settings')
        // toast.error('internal servere error  while fetching company settings')
      
      }
    },
    [setCompanySettings, subdomain],
  )
  
  useEffect(() => {
    
    handleGetCompanySettings()
    
  }, [handleGetCompanySettings])

  return (
    <div className='flex items-center justify-center min-h-screen bg-gradient-to-r
     bg-white'>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className='bg-white p-8 rounded-lg shadow-2xl w-full max-w-md'
      >
        {/* Logo Section */}
        <div className='flex justify-center mb-6'>
          <motion.img
           
            className='w-24 h-24 rounded-full'
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}

            src={logo_preview || "/images/aitechs.png"}
            alt={company_name || "Aitechs"}
            onError={(e) => { e.target.src = "/images/aitechs.png"; }}
          />
        </div>

        {/* Customer Portal Heading */}
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className='text-3xl font-bold text-center text-gray-800 mb-6'
        >
          Customer Network
        </motion.h1>

        {/* Login Form */}
        <form onSubmit={handleSubmit}>
          {/* Username Input */}
          <div className='mb-6'>
            <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='username'>
              Username
            </label>
            <div className='relative'>
              <FaUser className='absolute left-3 top-1/2 transform -translate-y-1/2 text-black' />
              <input
                type='text'
                id='username'
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                className='w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all'
                placeholder='Enter your username'
              />
            </div>
          </div>

          {/* Password Input */}
          <div className='mb-6'>
            <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='password'>
              Password
            </label>
            <div className='relative'>
              <FaLock className='absolute left-3 top-1/2 transform -translate-y-1/2 text-black' />
              <input
                type='password'
                id='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                className='w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all'
                placeholder='Enter your password'
              />
            </div>
          </div>

          {/* Submit Button */}
          <motion.button
            type='submit'
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className='w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-all'
          >
            Login
          </motion.button>
        </form>

        {/* Additional Links */}
        <div className='mt-6 text-center'>
          <a href='#forgot-password' className='text-blue-600 hover:underline'>
            Forgot Password?
          </a>
         
        </div>
      </motion.div>
    </div>
  );
};

export default ClientLogin;