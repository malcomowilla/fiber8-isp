// import React, { useState, useEffect, useCallback } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import "./PPPoEPackages.css";
// import { IoCheckmarkOutline } from "react-icons/io5";
// import { useApplicationSettings } from '../settings/ApplicationSettings';
// import { Link } from 'react-router-dom';
// import PackageNotFoundAnimation from '../loader/package_not_found.json';
// import Lottie from 'react-lottie';

// const PPPoEPackages = () => {
//   const [packages, setPackages] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const { companySettings, setCompanySettings } = useApplicationSettings();

//   const { customer_support_phone_number, customer_support_email, agent_email, contact_info, company_name } = companySettings;
//   const subdomain = window.location.hostname.split('.')[0];

//   const defaultOptions = {
//     loop: true,
//     autoplay: true,
//     animationData: PackageNotFoundAnimation,
//     rendererSettings: {
//       preserveAspectRatio: 'xMidYMid slice',
//     },
//   };

//   const handleGetCompanySettings = useCallback(async () => {
//     try {
//       const response = await fetch('/api/get_company_settings', {
//         headers: {
//           'X-Subdomain': subdomain,
//         },
//       });
//       const newData = await response.json();
//       if (response.ok) {
//         const { contact_info, company_name, email_info, logo_url, customer_support_phone_number, agent_email, customer_support_email } = newData;
//         console.log(logo_url);
//         setCompanySettings((prevData) => ({
//           ...prevData,
//           contact_info,
//           company_name,
//           email_info,
//           customer_support_phone_number,
//           agent_email,
//           customer_support_email,
//           logo_preview: logo_url
//         }));
//         console.log('company settings fetched', newData);
//       } else {
//         console.log('failed to fetch company settings');
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   }, [setCompanySettings]);

//   useEffect(() => {
//     handleGetCompanySettings();
//   }, [handleGetCompanySettings]);

//   const fetchPackages = useCallback(async () => {
//     try {
//       const response = await fetch('/api/allow_get_packages', {
//         headers: {
//           'X-Subdomain': subdomain,
//         },
//       });
//       const data = await response.json();
//       if (response.ok) {
//         console.log('package', data);
//         setPackages(data);
//       } else {
//         console.error('Failed to fetch packages');
//       }
//     } catch (error) {
//       console.error('Error fetching packages:', error);
//     }
//   }, []);

//   useEffect(() => {
//     fetchPackages();
//   }, [fetchPackages]);

//   const handleSelectPackage = (packageId) => {
//     alert(`You selected package with ID: ${packageId}`);
//   };

//   const containerVariants = {
//     hidden: { opacity: 0 },
//     visible: {
//       opacity: 1,
//       transition: {
//         staggerChildren: 0.2,
//       },
//     },
//   };

//   const cardVariants = {
//     hidden: { opacity: 0, y: 50 },
//     visible: { opacity: 1, y: 0 },
//     hover: { scale: 1.05, boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.2)" },
//   };

//   const sectionVariants = {
//     hidden: { opacity: 0, x: 180 },
//     visible: { opacity: 1, x: 0 },
//   };

//   return (
//     <>
//       <motion.section
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         transition={{ duration: 1 }}
//         className="relative bg-gradient-to-br from-green-900 w-screen via-green-900 to-green-950 h-full p-[100px] flex justify-center overflow-hidden"
//       >
//         <div className="absolute inset-0 bg-[url('https://via.placeholder.com/1920x800')] bg-cover bg-center opacity-20"></div>
//         <div className="relative z-10 text-center max-w-4xl px-6 animate-fade-in">
//           <div className="flex justify-end mb-4">
//             <Link to='/signin' className="">
//               <motion.button
//                 className="bg-gradient-to-r from-teal-600 to-green-600 text-white font-semibold py-2 px-6 rounded-lg hover:scale-105 transition-transform duration-300"
//                 whileHover={{ scale: 1.1 }}
//                 whileTap={{ scale: 0.9 }}
//               >
//                 Sign In
//               </motion.button>
//             </Link>
//           </div>
//           <h2 className="text-4xl font-semibold text-gray-200 mb-4 font-montserat">Welcome to {company_name}</h2>
//           <h1 className="text-6xl font-bold mb-6 bg-clip-text font-montserat text-transparent bg-gradient-to-r from-green-400 to-teal-400">
//             Stay Connected Anywhere
//           </h1>
//           <p className="text-xl text-gray-300 mb-8 font-montserat-light">
//             Affordable and reliable Wi-Fi home plans for individuals and businesses. Browse, stream, and work seamlessly on the go.
//           </p>
//         </div>
//       </motion.section>

//       <motion.div
//         className="pppoe-packages-container bg-gradient-to-br from-teal-900 via-green-900 to-gray-950 flex justify-center"
//         initial={{ opacity: 0, y: 50 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
//       >
//         {packages.length === 0 ? (
//           <div className="flex flex-col items-center justify-center">
//             <Lottie options={defaultOptions} height={400} width={400} />
//             <p className="text-gray-300 text-xl mt-4">No wifi packages available at the moment, please login and create .</p>
//           </div>
//         ) : (
//           <motion.div className="packages-grid flex flex-col lg:flex-row h-full justify-center gap-10 w-full max-w-md">
//             {packages.map((pkg) => (
//               <motion.div
//                 key={pkg.id}
//                 className="package-card"
//                 variants={cardVariants}
//                 whileHover="hover"
//                 onClick={() => handleSelectPackage(pkg?.id)}
//               >
//                 <h2 className='text-xl font-bold'>{pkg?.name}</h2>
//                 <IoCheckmarkOutline className='text-green-700 w-[20rem] h-8' /> <p>fast and reliable network</p>
//                 <p className="price">KSH{pkg?.price}/month</p>
//                 <motion.button
//                   className="select-button hover:bg-green-300"
//                   whileHover={{ scale: 1.1 }}
//                   whileTap={{ scale: 0.9 }}
//                 >
//                   Select Package
//                 </motion.button>
//               </motion.div>
//             ))}
//           </motion.div>
//         )}
//       </motion.div>
//     </>
//   );
// };

// export default PPPoEPackages;

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./PPPoEPackages.css";
import { IoCheckmarkOutline, IoMailOutline, IoCallOutline, IoHelpCircleOutline } from "react-icons/io5";
import { useApplicationSettings } from '../settings/ApplicationSettings';
import { Link } from 'react-router-dom';
import PackageNotFoundAnimation from '../loader/package_not_found.json';
import Lottie from 'react-lottie';
import toast, { Toaster } from 'react-hot-toast';


const PPPoEPackages = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const { companySettings, setCompanySettings } = useApplicationSettings();
  const [isSupportHovered, setIsSupportHovered] = useState(false);
  const [showSupport, setShowSupport] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const { customer_support_phone_number, customer_support_email, agent_email, contact_info, company_name,
    
   } = companySettings;
  const subdomain = window.location.hostname.split('.')[0];

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: PackageNotFoundAnimation,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  const handleGetCompanySettings = useCallback(async () => {
    try {
      const response = await fetch('/api/get_company_settings', {
        headers: {
          'X-Subdomain': subdomain,
        },
      });
      const newData = await response.json();
      if (response.ok) {
        const { contact_info, company_name, email_info, logo_url, customer_support_phone_number, agent_email, customer_support_email } = newData;
        console.log(logo_url);
        setCompanySettings((prevData) => ({
          ...prevData,
          contact_info,
          company_name,
          email_info,
          customer_support_phone_number,
          agent_email,
          customer_support_email,
          logo_preview: logo_url
        }));
        console.log('company settings fetched', newData);
      } else {
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
        console.log('failed to fetch company settings');
      }
    } catch (error) {
      console.log(error);
    }
  }, [setCompanySettings]);

  useEffect(() => {
    handleGetCompanySettings();
  }, [handleGetCompanySettings]);



    // Check if mobile device on component mount
    useEffect(() => {
      const checkIfMobile = () => {
        setIsMobile(window.innerWidth <= 768);
      };
      checkIfMobile();
      window.addEventListener('resize', checkIfMobile);
      return () => window.removeEventListener('resize', checkIfMobile);
    }, []);

  const fetchPackages = useCallback(async () => {
    try {
      const response = await fetch('/api/allow_get_packages', {
        headers: {
          'X-Subdomain': subdomain,
        },
      });
      const data = await response.json();
      if (response.ok) {
        console.log('package', data);
        setPackages(data);
      } else {
         if (response.status === 401) {
  toast.error(data.error, {
    position: "top-center",
    duration: 4000,
  })
   setTimeout(() => {
          // navigate('/license-expired')
          window.location.href='/signin'
         }, 1900);
}
        console.error('Failed to fetch packages');
      }
    } catch (error) {
      console.error('Error fetching packages:', error);
    }
  }, []);

  useEffect(() => {
    fetchPackages();
  }, [fetchPackages]);

  const handleSelectPackage = (packageId) => {
    alert(`You selected package with ID: ${packageId}`);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
    hover: { scale: 1.05, boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.2)" },
  };

  const sectionVariants = {
    hidden: { opacity: 0, x: 180 },
    visible: { opacity: 1, x: 0 },
  };




  const toggleSupport = () => {
    setShowSupport(!showSupport);
  };


  return (
    <>
    <Toaster />
      {/* Floating Customer Support */}
      <motion.div 
        className="fixed bottom-[100px] right-6 z-50"
      >
        <motion.div 
          className="bg-green-700 text-white rounded-full p-4 shadow-lg cursor-pointer
           flex items-center justify-center"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={toggleSupport}
          onHoverStart={() => !isMobile && setShowSupport(true)}
          onHoverEnd={() => !isMobile && setShowSupport(false)}
          style={{ width: '56px', height: '56px' }}
        >
          {showSupport ? <IoHelpCircleOutline className="text-2xl" /> : <IoCallOutline className="text-2xl" />}
        </motion.div>
        
        <AnimatePresence>
          {(!showSupport || (!isMobile && showSupport)) && (
            <motion.div 
              className="absolute right-16 bottom-0 bg-white p-4 rounded-lg shadow-lg w-64"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
            >
              <h3 className="font-bold text-green-700 mb-2">Customer Support</h3>
              <div className="flex items-center mb-2">
                <IoCallOutline className="mr-2 text-green-600" />
                <a 
                  href={`tel:${customer_support_phone_number}`} 
                  className="text-gray-700 hover:text-green-600"
                  onClick={(e) => e.stopPropagation()}
                >
                  {customer_support_phone_number}
                </a>
              </div>


              
              <div className="flex items-center">
                <IoMailOutline className="mr-2 text-green-600" />
                <a 
                  href={`mailto:${customer_support_email}`} 
                  className="text-gray-700 hover:text-green-600"
                  onClick={(e) => e.stopPropagation()}
                >
                  {customer_support_email}
                </a>
              </div>
              {isMobile && (
                <button 
                  className="mt-2 text-sm text-gray-500 hover:text-gray-700"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowSupport(false);
                  }}
                >
                  Close
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>


      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="relative bg-gradient-to-br from-green-900 w-screen via-green-900 to-green-950 h-full p-[100px] flex justify-center overflow-hidden"
      >
        <div className="absolute inset-0 bg-[url('https://via.placeholder.com/1920x800')] bg-cover bg-center opacity-20"></div>
        <div className="relative z-10 text-center max-w-4xl px-6 animate-fade-in">
          {/* <div className="flex justify-end mb-4">
            <Link to='/signin' className="">
              <motion.button
                className="bg-gradient-to-r from-teal-600 to-green-600 text-white font-semibold py-2 px-6 rounded-lg hover:scale-105 transition-transform duration-300"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                Sign In
              </motion.button>
            </Link>
          </div> */}
          <h2 className="text-4xl font-semibold text-gray-200 mb-4 font-montserat">Welcome to {company_name}</h2>
          <h1 className="text-6xl font-bold mb-6 bg-clip-text font-montserat text-transparent bg-gradient-to-r from-green-400 to-teal-400">
            Stay Connected Anywhere
          </h1>
          <p className="text-xl text-gray-300 mb-8 font-montserat-light">
            Affordable and reliable Wi-Fi home plans for individuals and businesses. Browse, stream, and work seamlessly on the go.
          </p>
        </div>
      </motion.section>

      <motion.div
        className="pppoe-packages-container bg-gradient-to-br from-teal-900 via-green-900 to-gray-950 flex justify-center"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
      >
        {packages.length === 0 ? (
          <div className="flex flex-col items-center justify-center">
            <Lottie options={defaultOptions} height={400} width={400} />
            <p className="text-gray-300 text-xl mt-4">No wifi packages available at the moment, please login and create .</p>
          </div>
        ) : (
          <motion.div className="packages-grid flex flex-col lg:flex-row h-full justify-center gap-10 w-full max-w-md">
            {packages.map((pkg) => (
              <motion.div
                key={pkg.id}
                className="package-card"
                variants={cardVariants}
                whileHover="hover"
                onClick={() => handleSelectPackage(pkg?.id)}
              >
                <h2 className='text-xl font-bold'>{pkg?.name}</h2>
                <IoCheckmarkOutline className='text-green-700 w-[20rem] h-8' /> <p>fast and reliable network</p>
                <p className="price">KSH{pkg?.price}/month</p>
                <motion.button
                  className="select-button hover:bg-green-300"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  Select Package
                </motion.button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </motion.div>
    </>
  );
};

export default PPPoEPackages;