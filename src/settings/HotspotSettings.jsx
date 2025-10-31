
import  { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { useCallback, useEffect } from 'react';
import { useApplicationSettings } from "../settings/ApplicationSettings";

import LoadingAnimation from '../loader/loading_animation.json'
import Lottie from 'react-lottie';
import { GrConfigure } from "react-icons/gr";
import HotspotScript from './HotspotScript'




const HotspotSettings = () => {
  
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate()
  const [open, setOpen] = useState(false);


  const handleClose = () => {
    setOpen(false);
  }

const {phoneNumber, setPhoneNumber,hotspotName, setHotspotName,hotspotInfo, setHotspotInfo,
  email, setEmail,hotspotPhoneNumber, setHotspotPhoneNumber,hotspotEmail, setHotspotEmail,
  hotspotBanner, setHotspotBanner,hotspotBannerPreview, setHotspotBannerPreview} = useApplicationSettings()

  // Handle image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setHotspotBanner(file);
      setHotspotBannerPreview(URL.createObjectURL(file)); // Generate preview URL
    }
  };

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: LoadingAnimation,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  const subdomain = window.location.hostname.split('.')[0];

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("phone_number", hotspotPhoneNumber);
    formData.append("hotspot_name", hotspotName);
    formData.append("hotspot_info", hotspotInfo);
    formData.append("email", hotspotEmail);
    if (hotspotBanner) {
      formData.append("hotspot_banner", hotspotBanner); // Append the file
    }

    try {
      setLoading(true);
      const response = await fetch('/api/hotspot_settings', {
        method: 'POST',
        headers: {
          'X-Subdomain': subdomain,
        },
        body: formData, // Use FormData instead of JSON
      });

      const newData = await response.json();


  if (response.status === 402) {
    setTimeout(() => {
      navigate('/license-expired')
     }, 1800);
    
  }


      if (response.ok) {
        setLoading(false);
        setHotspotPhoneNumber(newData.phone_number);
        setHotspotName(newData.hotspot_name);
        setHotspotInfo(newData.hotspot_info);
        setHotspotEmail(newData.email);
        // setHotspotBanner(newData.hotspot_banner);
        toast.success('Hotspot settings saved successfully', {
          duration: 5000,
          position: "top-right",
          style: {
            background: "#22c55e",
            color: "#fff",
          },
        });
      } else {
        setLoading(false);
        toast.error(
          'Failed to save hotspot settings, please try again later',
          {
            duration: 5000,
            position: "top-right",
            style: {
              background: "#eb5757",
              color: "#fff",
            },
          }
        );
      }
    } catch (error) {
      setLoading(false);
      toast.error(
        'Failed to save hotspot settings, please try again later',
        {
          duration: 5000,
          position: "top-right",
          style: {
            background: "#eb5757",
            color: "#fff",
          },
        }
      );
    }
  };

  const getHotspotSettings = useCallback(
    async () => {
      try {
        const response = await fetch('/api/hotspot_settings', {
          headers: {
            'X-Subdomain': subdomain,
          },
        });
        const newData = await response.json();
        if (response.ok) {
          console.log('hotspot settings fetched', newData);
          const { phone_number, hotspot_name, hotspot_info, hotspot_banner, email } = newData;
          setHotspotPhoneNumber(phone_number);
          setHotspotName(hotspot_name);
          setHotspotInfo(hotspot_info);
          setHotspotEmail(email)
          // setHotspotBanner(hotspot_banner);
          if (hotspot_banner) {
            setHotspotBannerPreview(hotspot_banner); // Set preview URL if banner exists
          }
        } else {
          if (response.status === 402) {
        setTimeout(() => {
          // navigate('/license-expired')
          window.location.href='/license-expired'
         }, 1800);
        
      }
if (response.status === 401) {
  toast.error(newData.error, {
    position: "top-center",
    duration: 4000,
  })
   setTimeout(() => {
          // navigate('/license-expired')
          window.location.href='/signin'
         }, 1900);
}
          console.log('failed to fetch hotspot settings');
        }
      } catch (error) {
        toast.error('internal server error while fetching hotspot settings', {
          duration: 5000,
          position: "top-right",
          style: {
            background: "#eb5757",
            color: "#fff",
          },
        });
      }
    },
    [],
  );

  useEffect(() => {
    getHotspotSettings();
  }, [getHotspotSettings]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const inputVariants = {
    hover: { scale: 1.02 },
    focus: { scale: 1.05, borderColor: "#3b82f6" }, // Blue border on focus
  };

  const buttonVariants = {
    hover: { scale: 1.05 },
    tap: { scale: 0.95 },
  };



  return (
    <>
    <HotspotScript handleClose={handleClose} open={open}/>


      {loading ? <Lottie className='relative z-50' options={defaultOptions} height={400} width={400} /> : null}
      <Toaster />
        <h1 className="text-2xl 
        
        mb-6 font-bold  
      bg-gradient-to-r from-green-600 via-blue-400
         to-cyan-500 bg-clip-text text-transparent inline-block
      ">Hotspot Settings</h1>


        <motion.form
          onSubmit={handleSubmit}
          className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Contact Us Phone Number */}
          <motion.div className="mb-4" variants={containerVariants}>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phoneNumber">
              Contact Us Phone Number
            </label>
            <motion.input
              type="text"
              id="phoneNumber"
              value={hotspotPhoneNumber}
              onChange={(e) => setHotspotPhoneNumber(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter phone number"
              whileHover="hover"
              whileFocus="focus"
              variants={inputVariants}
            />
          </motion.div>




          <motion.div className="mb-4" variants={containerVariants}>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phoneNumber">
              Contact Us Email
            </label>
            <motion.input
              type="text"
              id="email"
              value={hotspotEmail}
              onChange={(e) => setHotspotEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter email"
              whileHover="hover"
              whileFocus="focus"
              variants={inputVariants}
            />
          </motion.div>

          {/* Hotspot Name */}
          <motion.div className="mb-4" variants={containerVariants}>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="hotspotName">
              Hotspot Name
            </label>
            <motion.input
              type="text"
              id="hotspotName"
              value={hotspotName}
              onChange={(e) => setHotspotName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter hotspot name"
              whileHover="hover"
              whileFocus="focus"
              variants={inputVariants}
            />
          </motion.div>

          {/* Hotspot Info */}
          <motion.div className="mb-4" variants={containerVariants}>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="hotspotInfo">
              Hotspot Info
            </label>
            <motion.textarea
              id="hotspotInfo"
              value={hotspotInfo}
              onChange={(e) => setHotspotInfo(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter hotspot information"
              rows="4"
              whileHover="hover"
              whileFocus="focus"
              variants={inputVariants}
            />
          </motion.div>

          {/* Hotspot Banner (Image Upload) */}
          <motion.div className="mb-6" variants={containerVariants}>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="hotspotBanner">
              Hotspot Banner
            </label>
            <motion.div
              className="flex items-center justify-center w-full"
              whileHover={{ scale: 1.02 }}
            >
              <label className="flex flex-col items-center px-4 py-6 bg-white text-green-500 rounded-lg shadow-lg tracking-wide border border-green-500 cursor-pointer hover:bg-blue-50">
                <svg
                  className="w-8 h-8"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1zM11 11h3l-4-4-4 4h3v3h2v-3z" />
                </svg>
                <span className="mt-2 text-base leading-normal">
                  {hotspotBanner ? hotspotBanner.name : "Select a banner image"}
                </span>
                <input
                  type="file"
                  onChange={handleImageChange}
                  className="hidden"
                  id="hotspotBanner"
                  accept="image/*"
                />
              </label>

              
            </motion.div>
            {/* Image Preview */}
            {hotspotBannerPreview && (
              <div className="mt-4">
                <img
                  src={hotspotBannerPreview}
                  alt="Hotspot Banner Preview"
                  className="w-full h-48 object-cover rounded-lg"
                />
              </div>
            )}
          </motion.div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            className="w-full bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
            whileHover="hover"
            whileTap="tap"
            variants={buttonVariants}
          >
            Save Settings
          </motion.button>



         
        </motion.form>

<div className='flex justify-center '>
           <motion.button
            onClick={() => setOpen(true)}
            className="w-fit bg-green-500 text-white  flex
            justify-center items-center
            py-2 px-4  mt-2 gap-2
            rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2  focus:ring-green-500"
            whileHover="hover"
            whileTap="tap"
            variants={buttonVariants}
          >
            configure
            <GrConfigure className=""/>

          </motion.button>

          </div>
    </>
  );
};

export default HotspotSettings;