import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiAlertCircle } from "react-icons/fi";
import { TbZoomCancel } from "react-icons/tb";
import {useApplicationSettings} from '../settings/ApplicationSettings'
import toast, { Toaster } from 'react-hot-toast';




const IpPool = ({ isOpen, setIsOpen , ipPoolFormData, setIpPoolFormData, handleChange,
    setIpPools,ipPools
}) => {
  const [poolName, setPoolName] = useState("");
  const [startIP, setStartIP] = useState("");
  const [endIP, setEndIP] = useState("");
//   const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const {start_ip, end_ip, pool_name, description} = ipPoolFormData

  const {settingsformData} = useApplicationSettings()
  // Disable background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isOpen]);

  const validateIP = (ip) => {
    const ipPattern = /^(25[0-5]|2[0-4]\d|1\d\d|\d\d?)\.(25[0-5]|2[0-4]\d|1\d\d|\d\d?)\.(25[0-5]|2[0-4]\d|1\d\d|\d\d?)\.(25[0-5]|2[0-4]\d|1\d\d|\d\d?)$/;
    return ipPattern.test(ip);
  };

  const isStartIpLessThanEndIp = (start, end) => {
    const startParts = start.split(".").map(Number);
    const endParts = end.split(".").map(Number);

    for (let i = 0; i < 4; i++) {
      if (startParts[i] < endParts[i]) return true;
      if (startParts[i] > endParts[i]) return false;
    }
    return false;
  };


  const subdomain = window.location.hostname.split('.')[0];


  const handleSubmit = async(e) => {
    e.preventDefault();

    const trimmedPoolName = pool_name.trim();
    const trimmedStartIP = start_ip  .trim();
    const trimmedEndIP = end_ip.trim();

    if (!trimmedPoolName || !trimmedStartIP || !trimmedEndIP) {
      setError("Please fill in all required fields.");
      setSuccess("");
      return;
    }

    if (!validateIP(trimmedStartIP) || !validateIP(trimmedEndIP)) {
      setError("Invalid IP address format.");
      setSuccess("");
      return;
    }

    if (!isStartIpLessThanEndIp(trimmedStartIP, trimmedEndIP)) {
      setError("Start IP must be lower than End IP.");
      setSuccess("");
      return;
    }

    setError("");
    setSuccess("IP Pool created successfully!");

    // setPoolName("");
    // setStartIP("");
    // setEndIP("");
    setIpPoolFormData({
      start_ip: '',
      end_ip: '',
      pool_name: '',
      description: ''
    })

    setTimeout(() => {
      setIsOpen(false);
      setSuccess("");
    }, 2000);



    try {
        const url = ipPoolFormData.id ? `/api/ip_pools/${ipPoolFormData.id}` : '/api/ip_pools';
      const method = ipPoolFormData.id ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'X-Subdomain': subdomain,
        },
        body: JSON.stringify({...ipPoolFormData, router_name: settingsformData.router_name}),
      });

      const newData = await response.json();
      if (response.ok) {
if (ipPoolFormData.id) {
    setIpPools(ipPools.map(item => (item.id === ipPoolFormData.id ? {...ipPoolFormData} : item)));  
}else{
    setIpPools([...ipPools,  newData ]);
}
      } else {
        toast.error(
            newData.error,
            {
              position: 'top-center',
              duration: 4000,
            }
            
        )

        toast.error(
            'Failed to create ip pool',
            {
              position: 'top-center',
              duration: 4000,
            }
        )
      }
    } catch (error) {
        toast.error(
            'Failed to create ip pool',
            {
              position: 'top-center',
              duration: 4000,
            }
        )
    }
  };

  return (

    <>
    <Toaster />
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsOpen(false)} // Close modal when clicking outside
        >
          <motion.div
            className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-md relative"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()} // Prevent modal from closing when clicking inside
          >
            <h1 className="text-3xl font-bold mb-6 text-gray-800 
            font-montserat
            text-center">
              Create IP Pool
            </h1>

            {/* Error Message */}
            {error && (
              <motion.div
                className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4 flex items-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <FiAlertCircle className="mr-2" />
                {error}
              </motion.div>
            )}

            {/* Success Message */}
            {success && (
              <motion.div
                className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded mb-4 flex items-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                ✅ {success}
              </motion.div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Pool Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="pool_name"
                    value={pool_name}
                    onChange={handleChange}
                    // onChange={(e) => setPoolName(e.target.value)}
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg
                     shadow-sm focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Start IP <span className="text-red-500">*</span>
                  </label>
                  <input
                  name='start_ip'
                    type="text"
                    value={start_ip}
                    onChange={handleChange}
                    // onChange={(e) => setStartIP(e.target.value)}
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg
                     shadow-sm focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    End IP <span className="text-red-500">*</span>
                  </label>
                  <input
                  name='end_ip'
                    type="text"
                    value={end_ip}
                    onChange={handleChange}
                    // onChange={(e) => setEndIP(e.target.value)}
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 
                    rounded-lg shadow-sm focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Description (Optional)
                  </label>
                  <textarea
                  name='description'
                    value={description}
                    onChange={handleChange}
                    // onChange={(e) => setDescription(e.target.value)}
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 
                    rounded-lg shadow-sm focus:ring-2 focus:ring-green-500"
                    rows="3"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                className="mt-6 w-full
                font-montserat-regular
                bg-green-500 text-white px-6 py-2 rounded-lg
                hover:text-black
                hover:bg-green-200 transition duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Create IP Pool
              </motion.button>
            </form>

            {/* Close Button */}
            <button
              className="absolute top-4 right-4   hover:text-gray-700"
              onClick={() => setIsOpen(false)}
            >
              <TbZoomCancel  className='text-black w-8 h-8 '/>
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>

    </>
  );
};

export default IpPool;
