import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaWifi, FaKey } from 'react-icons/fa';
import { FaPerson } from "react-icons/fa6";

import { TiArrowBackOutline } from 'react-icons/ti';
import toast, { Toaster } from 'react-hot-toast';
import { CiBarcode } from "react-icons/ci";
import { useApplicationSettings } from '../settings/ApplicationSettings';






const HotspotLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedTemplate = location.state?.template;
  const {companySettings, setCompanySettings,

    templateStates, setTemplateStates,
    settingsformData, setFormData,
    handleChangeHotspotVoucher, voucher, setVoucher
  } = useApplicationSettings()


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
            onClick={() => toast.success('Connected!')}
          >
            Connect Now
          </motion.button>

          <div className="flex justify-center items-center cursor-pointer mt-6" onClick={() => navigate(-1)}>
            <TiArrowBackOutline className="w-8 h-8" />
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default HotspotLogin;