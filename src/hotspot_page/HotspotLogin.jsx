import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaWifi,} from 'react-icons/fa';

import { TiArrowBackOutline } from 'react-icons/ti';
import toast, { Toaster } from 'react-hot-toast';
import { CiBarcode } from "react-icons/ci";
import { useApplicationSettings } from '../settings/ApplicationSettings';
import { MdCancel } from "react-icons/md";
import {useState} from 'react'






const HotspotLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedTemplate = location.state?.template;
  const {companySettings, setCompanySettings,

    templateStates, setTemplateStates,
    settingsformData, setFormData,
    handleChangeHotspotVoucher, voucher, setVoucher,
  loading, setLoading,


  } = useApplicationSettings()

const [showVoucherError, setShowVoucherError] = useState(false)
const [voucherError, setVoucherError] = useState('')



  // Default template if none is selected
  const template = selectedTemplate || {
    background: 'bg-gradient-to-r from-blue-500 to-teal-500',
    iconColor: 'text-teal-200',
    buttonColor: 'bg-teal-500',
  };

  const containerVariants = {
    hidden: { opacity: 0, x: '100vw' },
    visible: {
      opacity: 1,
      x: 0,
      transition: { type: 'spring', stiffness: 50 },
    },
  };

  const buttonVariants = {
    hover: {
      scale: 1.1,
      textShadow: '0px 0px 8px rgb(255, 255, 255)',
      boxShadow: '0px 0px 8px rgb(0, 0, 0, 0.2)',
    },
  };


  const { vouchers } = voucher
   const subdomain = window.location.hostname.split('.')[0]

const queryParams = new URLSearchParams(window.location.search);

const mac = queryParams.get('mac')
const ip = queryParams.get('ip')

const storedIp = localStorage.getItem('hotspot_mac')
const storedMac = localStorage.getItem('hotspot_ip') 

  const loginWithVoucher = async(e) => {

  e.preventDefault()
  
    try {
      setLoading(true)
      const response = await fetch('/api/login_with_hotspot_voucher', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Subdomain': subdomain,
    
        },
  
        body: JSON.stringify({
          voucher: vouchers,
          router_name: settingsformData.router_name,
          stored_mac: storedMac,
          stored_ip: storedIp, 
          mac: mac,
          ip: ip
        })
    
    
      });
    
    
      const newData = await response.json();
      if (response.ok) {
        setsuccess(true)
        setLoading(false)
        // setTimeout(() => {
        //   setsuccess(true)
    
        // }, 2000);
        
        // setPackages(newData)
        toast.success('Voucher verified successfully', {
          duration: 3000,
          position: 'top-right',
        });
        console.log('company settings fetched', newData)
      } else {
        setLoading(false)
        setVoucherError(newData.error)
        setShowVoucherError(true)
        toast.error('Voucher verification failed', {
          duration: 3000,
          position: 'top-right',
        });
  
        toast.error(newData.error, {
          duration: 5000,
          position: 'top-right',
        });
      }
    } catch (error) {
      setShowVoucherError(true)
      setLoading(false)
    }
   
  }

  return (
    <>
      <Toaster />
      <div className={`min-h-screen relative z-0 flex items-center justify-center ${template.background} p-4`}>
        <motion.div
          className="max-w-md w-full bg-white rounded-xl shadow-lg p-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="text-center mb-6">
            <FaWifi className={`${template.iconColor} w-12 h-12 mx-auto mb-4`} />
            <h1 className="text-3xl text-gray-900 dotted-font font-thin">Welcome to Fiber8 Hotspot</h1>
            <p className="text-gray-600 dotted-font">Connect and enjoy fast browsing.</p>
          </div>


{showVoucherError ? (
 <div className="flex items-center p-4 mb-4 text-sm text-red-800
 cursor-pointer f
relative
 rounded-lg bg-red-50
  dark:bg-gray-800 dark:text-red-400" role="alert">
  <svg className="shrink-0 inline w-4 h-4 me-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" 
  fill="currentColor" viewBox="0 0 20 20">
    <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 
    1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1
     1 0 0 1 0 2Z"/>
  </svg>
  <div className='flex' onClick={() => setShowVoucherError(false)}>
    <span className="font-bold text-lg">Danger alert! <span className='font-medium'>{voucherError || 'Voucher verification failed'}</span>
      </span>   
    <MdCancel className='text-black w-4 h-4 absolute right-0 '/>
  </div>
</div>
): null}
          {/* <motion.div
            className="flex justify-between items-center bg-gray-100 p-4 rounded-lg mb-4"
            whileHover={{ scale: 1.02 }}
          >
            <FaPerson className={`${template.iconColor} w-8 h-8`} />
            <input
              type="text"
              className="w-full text-gray-700 bg-gray-100 rounded-lg p-2 focus:outline-none"
              placeholder="Enter your username"
            />
          </motion.div> */}




{/* 
          <motion.div
            className="flex justify-between items-center bg-gray-100 p-4 rounded-lg mb-4"
            whileHover={{ scale: 1.02 }}
          >
            <FaKey className={`${template.iconColor} w-6 h-6`} />
            <input
              type="password"
              className="w-full text-gray-700 bg-gray-100 rounded-lg p-2 focus:outline-none"
              placeholder="Enter your password"
            />
          </motion.div> */}



<form onSubmit={loginWithVoucher}>

<motion.div
            className="flex justify-between items-center bg-gray-100 p-4 rounded-lg mb-4"
            whileHover={{ scale: 1.02 }}
          >
            <CiBarcode className={`${template.iconColor} w-6 h-6`} />
           
            <input

onChange={(e) => handleChangeHotspotVoucher(e)}
value={vouchers}
  name="vouchers"
              // type="password"
              className="w-full text-gray-700 bg-gray-100 rounded-lg p-2 focus:outline-none"
              placeholder="Enter your voucher code"
            />
          </motion.div>











          <motion.button
            variants={buttonVariants}
            whileHover="hover"
            className={`w-full py-2 px-4 ${template.buttonColor} text-white rounded-full shadow-md focus:outline-none dotted-font font-thin`}
          >
            Connect Now
          </motion.button>
          

          <div className="flex justify-center items-center cursor-pointer mt-6" onClick={() => navigate(-1)}>
            <TiArrowBackOutline className="w-8 h-8" />
          </div>
          </form>
        </motion.div>
       
      </div>
    </>
  );
};

export default HotspotLogin;