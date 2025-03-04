// // import React from 'react'
// import { motion } from 'framer-motion'
// import { Link } from 'react-router-dom'
// import { FaWifi, FaLock, FaCheckCircle } from 'react-icons/fa'
// import { FaPhone } from "react-icons/fa6";
// import toast, { Toaster } from 'react-hot-toast';
// import { useEffect, useState, useCallback } from 'react';
// import { TiArrowBackOutline } from "react-icons/ti";
// import { SlNotebook } from "react-icons/sl";
// import { HiMiniArrowLeftEndOnRectangle } from "react-icons/hi2";
// import { useApplicationSettings } from '../settings/ApplicationSettings';
// import { useNavigate, useLocation } from 'react-router-dom';



// const HotspotPage = () => {
//  const [packages, setPackages] = useState([])
//  const [seeForm, setSeeForm] = useState(false)
//  const [seePackages, setSeePackages] = useState(true)
//  const [seeInstructions, setSeeInstructions] = useState(true)

// const {companySettings, setCompanySettings} = useApplicationSettings()

//  const {company_name, contact_info, email_info, logo_preview} = companySettings


//  const navigate = useNavigate();
//  const location = useLocation();
//  const selectedTemplate = location.state?.template;

//  // Default template if none is selected
//  const template = selectedTemplate || {
//    background: 'bg-gradient-to-r from-blue-500 to-teal-500',
//    iconColor: 'text-teal-200',
//    buttonColor: 'bg-teal-500',
//  };


//  const subdomain = window.location.hostname.split('.')[0]

//  const handleGetCompanySettings = useCallback(
//   async() => {
//     try {
//       const response = await fetch('/api/allow_get_company_settings', {
//         headers: {
//           'X-Subdomain': subdomain,
//         },
//       })
//       const newData = await response.json()
//       if (response.ok) {
//         // setcompanySettings(newData)
//         const { contact_info, company_name, email_info, logo_url,
//           customer_support_phone_number,agent_email ,customer_support_email
//          } = newData
//         setCompanySettings((prevData)=> ({...prevData, 
//           contact_info, company_name, email_info,
//           customer_support_phone_number,agent_email ,customer_support_email,
        
//           logo_preview: logo_url
//         }))

//         console.log('company settings fetched', newData)
//       }else{
//         console.log('failed to fetch company settings')
//       }
//     } catch (error) {
//       toast.error('internal servere error  while fetching company settings')
    
//     }
//   },
//   [setCompanySettings],
// )

// useEffect(() => {
  
//   handleGetCompanySettings()
  
// }, [handleGetCompanySettings])









//     // const packages = [
//     //     { name: 'Basic Package', speed: '5 Mbps', data: '10 GB', price: 'ksh20' },
//     //     { name: 'Standard Package', speed: '10 Mbps', data: '50 GB', price: 'ksh50' },
//     //     { name: 'Premium Package', speed: '50 Mbps', data: 'Unlimited', price: 'ksh100' },
//     //     { name: 'Family Package', speed: '70 Mbps', data: 'Unlimited', price: 'ksh100' },
//     //   ];

//       const packageVariants = {
//         hidden: { opacity: 0, scale: 0.8 },
//         visible: { opacity: 1, scale: 1 }
//       };

//   const containerVariants = {
//     hidden: { opacity: 0, x: '100vw' },
//     visible: {
//       opacity: 1,
//       x: 0,
//       transition: { type: 'spring', stiffness: 50 }
//     }
//   };

//   const buttonVariants = {
//     hover: {
//       scale: 1.1,
//       textShadow: "0px 0px 8px rgb(255, 255, 255)",
//       boxShadow: "0px 0px 8px rgb(0, 0, 0, 0.2)"
//     }
//   };



// useEffect(() => {
  
//   const fetchHotspotPackages = async() => {
//     try {
//       const response = await fetch('/api/hotspot_packages', {
//         headers: {
//           'X-Subdomain': subdomain,
//         },
//       })
//       const newData = await response.json()
//       if (response.ok) {
//         // setPackages(newData)
//         setPackages(newData)
//         console.log('hotspot packages fetched', newData)
//       } else {
//         toast.error('failed to fetch hotspot packages', {
//           duration: 7000,
//           position: "top-center",
//         });
//         console.log('failed to fetch hotspot packages')
//       }
//     } catch (error) {
//       toast.error('Something went wrong', {
//         duration: 7000,
//         position: "top-center",
//       });
//       console.log(error)
//     }
//   }
//   fetchHotspotPackages()
// }, []);


  
//   return (

//     <>
//     <Toaster/>
//     <div className="min-h-screen   relative  z-0 flex items-center justify-center
//      bg-gradient-to-r from-blue-500 to-indigo-600 p-4 
//      transition-colors duration-300 ">



// {seeInstructions ? (


//   <div className='bg-white dark:bg-gray-800  
//   z-50 absolute left-0 top-0

//   flex flex-col items-center justify-center
//   text-white p-10 rounded-md cursor-pointer'  >


// <div className='flex flex-row gap-2 items-center justify-center'>
// <SlNotebook  className='w-5 h-5 text-teal-500'/>
// <h2 className=" text-lg font-semibold text-gray-900 dark:text-white dotted-font">How To Purchase:</h2>

// </div>


// <ol className="max-w-md space-y-1 text-gray-500 list-decimal  mt-4 dark:text-gray-400">
//     <li>
//         <span className="dotted-font font-thin  text-gray-900 dark:text-white">  Tap the package you want to purchase</span>
//     </li>
//     <li>
//         <span className="dotted-font font-thin text-gray-900 dark:text-white">Enter Your Phone Number</span> 
//     </li>
//     <li>
//         <span className="dotted-font font-thin text-gray-900 dark:text-white">click connect now</span> 
//     </li>


//     <li>
//         <span className="dotted-font font-thin text-gray-900 dark:text-white">Enter your Mobile PIN in the prompt and wait
//           a few seconds to complete the process
//           </span> 
//     </li>
// </ol>

// <Link to='/hotspot-login' className='flex flex-row items-center justify-center'>
// <div className='flex flex-row items-center justify-center'>
// <HiMiniArrowLeftEndOnRectangle className='w-8 h-8 text-teal-500'/>
//   <p className='dotted-font font-thin text-gray-900 mt-3'>Already subscribed?</p>
// </div>

// </Link>

// </div>
// ): null}




//       {seeForm  ?  (



//  <motion.div
//  className="max-w-md w-full bg-white rounded-xl shadow-lg p-6"
//  variants={containerVariants}
//  initial="hidden"
//  animate="visible"
// >
//  <div className="text-center mb-6">
//    <FaWifi className="text-blue-500 w-12 h-12 mx-auto mb-4" />
//    <h1 className="text-3xl  text-gray-900  dotted-font font-thin">Welcome to {company_name} Hotspot</h1>
//    <p className="text-gray-600 dotted-font ">Connect and enjoy fast browsing.</p>
//  </div>

//  <motion.div
//    className="flex justify-between items-center bg-gray-100 p-4 rounded-lg mb-4"
//    whileHover={{ scale: 1.02 }}
//  >
//    {/* <FaLock className="text-green-500 w-8 h-8" /> */}
//    <FaPhone className="text-green-500 w-8 h-8"/>
//    <input type="text" className='w-full text-gray-700 bg-gray-100 rounded-lg p-2 focus:outline-none' 
//    placeholder="Enter your phone number"/>
//    {/* <p className="text-gray-700">Secure Connection</p> */}
//  </motion.div>

//  <motion.div
//    className="flex justify-between items-center bg-gray-100 p-4 rounded-lg mb-4"
//    whileHover={{ scale: 1.02 }}
//  >
//    {/* <FaCheckCircle className="text-green-500 w-8 h-8" />
//    <p className="text-gray-700">Easy Access</p> */}
//  </motion.div>

//  <motion.button
//    variants={buttonVariants}
//    whileHover="hover"
//    className="w-full py-2 px-4 bg-blue-500 text-white  rounded-full shadow-md
//     focus:outline-none dotted-font font-thin"
//    onClick={() => alert('Connected!')}
//  >
//    Connect Now
//  </motion.button>

// <div className='flex justify-center items-center cursor-pointer' onClick={()=>  {
//   setSeeForm(false)
//   setSeePackages(true)
//   setSeeInstructions(true)
// } }>
// <TiArrowBackOutline className="mt-6 text-center w-8 h-8"/>

// </div>
// {/* 
//  <div className="mt-6 text-center">
//    <Link to="/terms" className="text-blue-500 hover:underline">
//      Terms & Conditions
//    </Link>
//  </div> */}
// </motion.div>

//       ): null}
     





//         {/* Packages Section */}

// {/*         
// {seePackages  ? (
//   <motion.div className="max-w-md w-full mx-auto text-center">
//   <h2 className="text-2xl  text-white mb-4 dotted-font font-thin">Choose Your Plan</h2>
//   <div className="grid grid-cols-1 gap-6">
//     {packages.map((pkg, index) => (
//       <motion.div
//         key={index}
//         className="bg-white p-4 rounded-lg shadow-lg"
//         variants={packageVariants}
//         initial="hidden"
//         animate="visible"
//       >
//         <h3 className="text-xl font-bold text-gray-900">{pkg.name}</h3>
//         <p className="text-gray-600">Speed: {pkg?.speed}</p>
//         <p className="text-gray-600">Valid For {pkg.valid}</p>
//         <p className="text-blue-500 font-bold mt-2"> Price: Ksh{pkg.price}</p>

//         <button onClick={()=> {
//           setSeePackages(false)
//           setSeeForm(true)
//           setSeeInstructions(false)
//         } } className='p-2 bg-blue-500 mt-2 rounded-md cursor-pointer
//         dotted-font font-thin
//         '>subscribe</button>

//       </motion.div>
//     ))}



//   </div>

 
// </motion.div>
// ) : null} */}
      

//       {seePackages && (
//   <motion.div className="max-w-md w-full mx-auto text-center mt-[320px] sm:mt-0">
//     <h2 className="text-2xl text-white mb-4 dotted-font font-thin">Choose Your Plan</h2>
//     <div className="h-96 overflow-y-auto  sm:overflow-visible 

//     grid grid-cols-1 gap-6">
//       {packages.map((pkg, index) => (
//         <motion.div
//           key={index}
//           className="bg-white p-4 rounded-lg shadow-lg"
//           variants={packageVariants}
//           initial="hidden"
//           animate="visible"
//         >
//           <h3 className="text-xl font-bold text-gray-900">{pkg.name}</h3>
//           {/* <p className="text-gray-600">Speed: {pkg?.speed}</p> */}
//           <p className="text-gray-600">Valid For {pkg.valid}</p>
//           <p className="text-blue-500 font-bold mt-2"> Price: Ksh{pkg.price}</p>
//           <button
//             onClick={() => {
//               setSeePackages(false);
//               setSeeForm(true);
//               setSeeInstructions(false);
//             }}
//             className="p-2 bg-blue-500 mt-2 rounded-md cursor-pointer dotted-font font-thin"
//           >
//             Subscribe
//           </button>
//         </motion.div>
//       ))}
//     </div>
//   </motion.div>
// )}


//     </div>
//     </>
//   );
// };



// export default HotspotPage

















// import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { FaWifi, FaLock, FaCheckCircle } from 'react-icons/fa'
import { FaPhone } from "react-icons/fa6";
import toast, { Toaster } from 'react-hot-toast';
import { useEffect, useState, useCallback } from 'react';
import { TiArrowBackOutline } from "react-icons/ti";
import { SlNotebook } from "react-icons/sl";
import { HiMiniArrowLeftEndOnRectangle } from "react-icons/hi2";
import { useApplicationSettings } from '../settings/ApplicationSettings';
import { useNavigate, useLocation } from 'react-router-dom';
import {  FaKey } from 'react-icons/fa';
import { FaPerson } from "react-icons/fa6";
import { CiBarcode } from "react-icons/ci";
import { FaArrowAltCircleLeft } from "react-icons/fa";
import { CiWifiOff } from "react-icons/ci";
import Backdrop from '@mui/material/Backdrop';
import { MdOutlineWifi } from "react-icons/md";







const HotspotPage = () => {
 const [packages, setPackages] = useState([])
 const [seeForm, setSeeForm] = useState(false)
 const [seePackages, setSeePackages] = useState(true)
 const [seeInstructions, setSeeInstructions] = useState(true)
 const [loading, setLoading] = useState(false)
 const [success, setsuccess] = useState(false)

const {companySettings, setCompanySettings,

  templateStates, setTemplateStates,
  settingsformData, setFormData,
  handleChangeHotspotVoucher, voucher, setVoucher
} = useApplicationSettings()

 const {company_name, contact_info, email_info, logo_preview} = companySettings

 const {attractive, flat,
  minimal, simple, clean, default_template, sleekspot,} = templateStates


 const navigate = useNavigate();
 const location = useLocation();
 const selectedTemplate = location.state?.template;


 // Default template if none is selected
 const template = selectedTemplate || {
   background: 'bg-gradient-to-r from-blue-500 to-teal-500',
   iconColor: 'text-teal-200',
   buttonColor: 'bg-teal-500',
 };

 
const { vouchers } = voucher


//  allow_get_hotspot_templates 




              
 const subdomain = window.location.hostname.split('.')[0]

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
  







 const getHotspotTemplates = useCallback(
  async() => {
    const response = await fetch('/api/hotspot_templates', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Subdomain': subdomain,

      },
    });

const newData = await response.json();
    if (response.ok) {
      
      const { attractive, flat,
        minimal, simple, clean, default_template, sleekspot} = newData[0]

     setTemplateStates({
       ...templateStates,
       sleekspot: sleekspot,
       default_template: default_template,
       attractive: attractive,
       flat: flat,
       minimal: minimal,
       simple: simple,
       clean: clean,
     });
    } else {
      toast.error('failed to get hotspot templates settings', {
        duration: 3000,
        position: 'top-right',
      });
    }

  },
  [],
)

useEffect(() => {
  getHotspotTemplates();
 
}, [getHotspotTemplates]);






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









    // const packages = [
    //     { name: 'Basic Package', speed: '5 Mbps', data: '10 GB', price: 'ksh20' },
    //     { name: 'Standard Package', speed: '10 Mbps', data: '50 GB', price: 'ksh50' },
    //     { name: 'Premium Package', speed: '50 Mbps', data: 'Unlimited', price: 'ksh100' },
    //     { name: 'Family Package', speed: '70 Mbps', data: 'Unlimited', price: 'ksh100' },
    //   ];

      const packageVariants = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: { opacity: 1, scale: 1 }
      };

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



useEffect(() => {
  
  const fetchHotspotPackages = async() => {
    try {
      const response = await fetch('/api/hotspot_packages', {
        headers: {
          'X-Subdomain': subdomain,
        },
      })
      const newData = await response.json()
      if (response.ok) {
        // setPackages(newData)
        setPackages(newData)
        console.log('hotspot packages fetched', newData)
      } else {
        // toast.error('failed to fetch hotspot packages', {
        //   duration: 7000,
        //   position: "top-center",
        // });
        console.log('failed to fetch hotspot packages')
      }
    } catch (error) {
      // toast.error('Something went wrong', {
      //   duration: 7000,
      //   position: "top-center",
      // });
      console.log(error)
    }
  }
  fetchHotspotPackages()
}, []);


  
// login_with_hotspot_voucher

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
        router_name: settingsformData.router_name
      })
  
  
    });
  
  
    const newData = await response.json();
    if (response.ok) {
      setLoading(false)
      setTimeout(() => {
        setsuccess(true)
  
      }, 2000);
      
      // setPackages(newData)
      toast.success('Voucher verified successfully', {
        duration: 3000,
        position: 'top-right',
      });
      console.log('company settings fetched', newData)
    } else {
      setLoading(false)
      toast.error('Voucher verification failed', {
        duration: 3000,
        position: 'top-right',
      });

      toast.error(newData.error, {
        duration: 7000,
        position: 'top-right',
      });
    }
  } catch (error) {
    setLoading(false)
  }
 
}


if (success) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 50 }}
        className="bg-white p-8 rounded-lg shadow-lg text-center"
      >
        <MdOutlineWifi className="text-green-500 w-12 h-12 mx-auto mb-4" />
        <motion.h2
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-2xl font-bold text-gray-900"
        >
          Connected!
        </motion.h2>
      </motion.div>
    </motion.div>
  );
}




if (loading) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 50 }}
        className="bg-white p-8 rounded-lg shadow-lg text-center"
      >
        <MdOutlineWifi className="text-yellow-500 w-12 h-12 mx-auto animate-pulse mb-4" />
        <motion.h2
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-2xl font-bold text-gray-900"
        >
          Connecting...
        </motion.h2>
      </motion.div>
    </motion.div>
  );
}

  return (

    <>


{default_template ? (

<>
<Toaster/>
<div className="min-h-screen   relative  z-0 flex items-center justify-center
 bg-gradient-to-r from-blue-500 to-indigo-600 p-4 
 transition-colors duration-300 ">



{seeInstructions ? (


<div className='bg-white dark:bg-gray-800  
z-50 absolute left-0 top-0

flex flex-col items-center justify-center
text-white p-10 rounded-md cursor-pointer'  >


<div className='flex flex-row gap-2 items-center justify-center'>
<SlNotebook  className='w-5 h-5 text-teal-500'/>
<h2 className=" text-lg font-semibold text-gray-900 dark:text-white dotted-font">How To Purchase:</h2>

</div>


<ol className="max-w-md space-y-1 text-gray-500 list-decimal  mt-4 dark:text-gray-400">
<li>
    <span className="dotted-font font-thin  text-gray-900 dark:text-white">  Tap the package you want to purchase</span>
</li>
<li>
    <span className="dotted-font font-thin text-gray-900 dark:text-white">Enter Your Phone Number</span> 
</li>
<li>
    <span className="dotted-font font-thin text-gray-900 dark:text-white">click connect now</span> 
</li>


<li>
    <span className="dotted-font font-thin text-gray-900 dark:text-white">Enter your Mobile PIN in the prompt and wait
      a few seconds to complete the process
      </span> 
</li>
</ol>

<Link to='/hotspot-login' className='flex flex-row items-center justify-center'>
<div className='flex flex-row items-center justify-center'>
<HiMiniArrowLeftEndOnRectangle className='w-8 h-8 text-teal-500'/>
<p className='dotted-font font-thin text-gray-900 mt-3'>Already subscribed?</p>
</div>

</Link>

</div>
): null}




  {seeForm  ?  (


<motion.div
className="max-w-md w-full bg-white rounded-xl shadow-lg p-6"
variants={containerVariants}
initial="hidden"
animate="visible"
>
<div className="text-center mb-6">
<FaWifi className="text-blue-500 w-12 h-12 mx-auto mb-4" />
<h1 className="text-3xl  text-gray-900  dotted-font font-thin">Welcome to {company_name} Hotspot</h1>
<p className="text-gray-600 dotted-font ">Connect and enjoy fast browsing.</p>
</div>

<motion.div
className="flex justify-between items-center bg-gray-100 p-4 rounded-lg mb-4"
whileHover={{ scale: 1.02 }}
>
{/* <FaLock className="text-green-500 w-8 h-8" /> */}
<FaPhone className="text-green-500 w-8 h-8"/>


<input type="text" className='w-full text-gray-700 bg-gray-100 rounded-lg p-2 focus:outline-none' 
placeholder="Enter your phone number"/>


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
className="w-full py-2 px-4 bg-blue-500 text-white  rounded-full shadow-md
focus:outline-none dotted-font font-thin"
onClick={() => alert('Connected!')}
>
Connect Now
</motion.button>

<div className='flex justify-center items-center cursor-pointer' onClick={()=>  {
setSeeForm(false)
setSeePackages(true)
setSeeInstructions(true)
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

  ): null}
 





    {/* Packages Section */}

{/*         
{seePackages  ? (
<motion.div className="max-w-md w-full mx-auto text-center">
<h2 className="text-2xl  text-white mb-4 dotted-font font-thin">Choose Your Plan</h2>
<div className="grid grid-cols-1 gap-6">
{packages.map((pkg, index) => (
  <motion.div
    key={index}
    className="bg-white p-4 rounded-lg shadow-lg"
    variants={packageVariants}
    initial="hidden"
    animate="visible"
  >
    <h3 className="text-xl font-bold text-gray-900">{pkg.name}</h3>
    <p className="text-gray-600">Speed: {pkg?.speed}</p>
    <p className="text-gray-600">Valid For {pkg.valid}</p>
    <p className="text-blue-500 font-bold mt-2"> Price: Ksh{pkg.price}</p>

    <button onClick={()=> {
      setSeePackages(false)
      setSeeForm(true)
      setSeeInstructions(false)
    } } className='p-2 bg-blue-500 mt-2 rounded-md cursor-pointer
    dotted-font font-thin
    '>subscribe</button>

  </motion.div>
))}



</div>


</motion.div>
) : null} */}
  

  {seePackages && (
<motion.div className="max-w-md w-full mx-auto text-center mt-[320px] sm:mt-0">
<h2 className="text-2xl text-white mb-4 dotted-font font-thin">Choose Your Plan</h2>
<div className="h-96 overflow-y-auto  sm:overflow-visible 

grid grid-cols-1 gap-6">
  {packages.map((pkg, index) => (
    <motion.div
      key={index}
      className="bg-white p-4 rounded-lg shadow-lg"
      variants={packageVariants}
      initial="hidden"
      animate="visible"
    >
      <h3 className="text-xl font-bold text-gray-900">{pkg.name}</h3>
      {/* <p className="text-gray-600">Speed: {pkg?.speed}</p> */}
      <p className="text-gray-600">Valid For {pkg.valid}</p>
      <p className="text-blue-500 font-bold mt-2"> Price: Ksh{pkg.price}</p>
      <button
        onClick={() => {
          setSeePackages(false);
          setSeeForm(true);
          setSeeInstructions(false);
        }}
        className="p-2 bg-blue-500 mt-2 rounded-md cursor-pointer dotted-font font-thin"
      >
        Subscribe
      </button>
    </motion.div>
  ))}
</div>
</motion.div>
)}


</div>
</>
): null}


{sleekspot ? (

<>

<>
      <Toaster />
      <div className={`min-h-screen relative z-0 flex flex-col items-center justify-center bg-green-500 p-4`}>
        {/* Header Section */}
        <div className="w-full text-center mb-8">
          <h1 className="text-5xl font-bold text-white dotted-font">Welcome to {company_name}</h1>
          <p className="text-xl text-gray-200 mt-2">Fast and reliable internet access</p>
        </div>

        {/* Floating Card for Form or Packages */}
        <motion.div
          className="w-full max-w-lg bg-white rounded-2xl shadow-2xl p-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {seeForm ? (
            <>
              <div className="text-center mb-6">
                <FaWifi className="text-purple-600 w-12 h-12 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-800">Connect to Hotspot</h2>
                <p className="text-gray-600">Enter your phone number to proceed</p>
              </div>

              <motion.div
                className="flex justify-between items-center bg-gray-100 p-4 rounded-lg mb-4"
                whileHover={{ scale: 1.02 }}
              >
                <FaPhone className="text-purple-600 w-8 h-8" />
                <input
                  type="text"
                  className="w-full text-gray-700 bg-gray-100 rounded-lg p-2 focus:outline-none"
                  placeholder="Enter your phone number"
                />
              </motion.div>
              <motion.button
                variants={buttonVariants}
                whileHover="hover"
                className="w-full py-3 bg-purple-600 text-white rounded-full shadow-md focus:outline-none dotted-font font-thin"
                onClick={() => alert('Connected!')}
              >
                Connect Now
              </motion.button>

              <div className='flex justify-center items-center cursor-pointer mt-6' onClick={()=>  {
                setSeeForm(false);
                setSeePackages(true);
                setSeeInstructions(true);
              } }>
              <FaArrowAltCircleLeft className='w-8 h-8'/>

              </div>
 
              <div
                className="flex justify-center items-center cursor-pointer mt-6"
                onClick={() => {
                  setSeeForm(false);
                  setSeePackages(true);
                  setSeeInstructions(true);
                }}
              >
                {/* <FaArrowLeft className="w-8 h-8 text-purple-600" /> */}
              </div>
            </>
          ) : (
            <>

<CiBarcode className="text-green-500 w-8 h-8"/>


<input type="text"

onChange={(e) => handleChangeHotspotVoucher(e)}
value={vouchers}
  name="vouchers"
className='w-full text-gray-700 bg-gray-100 rounded-lg p-2 focus:outline-none' 
placeholder="Enter your voucher code"/>

<motion.button
                variants={buttonVariants}
                whileHover="hover"
                className="w-full py-3 bg-purple-600 text-white rounded-full shadow-md 
                focus:outline-none dotted-font font-thin mt-4"
                onClick={() => alert('Connected!')}
              >
                Connect Now
              </motion.button>
              <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">Choose Your Plan</h2>


              <div className="space-y-4">
                {packages.map((pkg, index) => (
                  <motion.div
                    key={index}
                    className="bg-gray-100 p-4 rounded-lg shadow-sm cursor-pointer"
                    whileHover={{ scale: 1.02 }}
                    onClick={() => {
                      setSeePackages(false);
                      setSeeForm(true);
                      setSeeInstructions(false);
                    }}
                  >
                    <h3 className="text-xl font-bold text-gray-800">{pkg.name}</h3>
                    <p className="text-gray-600">Valid For {pkg.valid}</p>
                    <p className="text-purple-600 font-bold mt-2">Price: Ksh{pkg.price}</p>
                  </motion.div>
                ))}
              </div>
            </>
          )}
        </motion.div>

        {/* Instructions Section */}
        {seeInstructions && (
          <div className="mt-8 text-center text-white">
            <h2 className="text-xl font-bold mb-4">How To Purchase:</h2>
            <ol className="space-y-2">
              <li>1. Tap the package you want to purchase</li>
              <li>2. Enter Your Phone Number</li>
              <li>3. Click "Connect Now"</li>
              <li>4. Enter your Mpesa PIN in the prompt</li>
            </ol>
          </div>
        )}
      </div>
    </>
</>
):null}






    {attractive ? (


<>
<Toaster/>
    <div className="min-h-screen   relative  z-0 flex items-center justify-center
     bg-gradient-to-r from-gray-500 to-gray-600 p-4
     transition-colors duration-300 ">



{seeInstructions ? (


  <div className='bg-white dark:bg-gray-800  
  z-50 absolute left-0 top-0

  flex flex-col items-center justify-center
  text-white p-10 rounded-md cursor-pointer'  >


<motion.div
          className="max-w-md w-full bg-white rounded-xl shadow-lg 
          
          p-6 mb-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="text-center mb-6">
            <FaWifi className={`text-yellow-500 w-12 h-12 mx-auto mb-4`} />
            <h1 className="text-3xl text-gray-900 dotted-font font-thin">Welcome to {company_name} Hotspot</h1>
            <p className="text-gray-600 dotted-font">Connect and enjoy fast browsing.</p>
          </div>
          <form onSubmit={loginWithVoucher}>
          <motion.div
            className="flex justify-between items-center bg-gray-100 p-4 rounded-lg mb-4"
            whileHover={{ scale: 1.02 }}
          >
            <CiBarcode className={`text-yellow-500 w-8 h-8`} />
            
            <input
            onChange={(e) => handleChangeHotspotVoucher(e)}
            value={vouchers}
              name="vouchers"
              className="w-full text-gray-700 bg-gray-100
              focus:border-transparent focus:outline-none focus:ring-0
              rounded-lg p-2 "
              placeholder="Voucher Code"
            />
            
           
          </motion.div>
          

         
          <motion.button
            variants={buttonVariants}
            type='submit'
            whileHover="hover"
            className={`w-full py-2 px-4 bg-yellow-500 text-white rounded-full 
              shadow-md focus:outline-none dotted-font font-thin`}
           
          >
            Connect Now
          </motion.button>
          </form>

          <div className="flex justify-center items-center cursor-pointer mt-6" onClick={() => navigate(-1)}>
            <TiArrowBackOutline className="w-8 h-8" />
          </div>
        </motion.div>





<div className='flex flex-row gap-2 items-center justify-center'>
<SlNotebook  className='w-5 h-5 text-teal-500'/>
<h2 className=" text-lg font-semibold text-gray-900 dark:text-white dotted-font">How To Purchase:</h2>

</div>


<ol className="max-w-md space-y-1 text-gray-500 list-decimal  mt-4 dark:text-gray-400">
    <li>
        <span className="dotted-font font-thin  text-gray-900 dark:text-white">  Tap the package you want to purchase</span>
    </li>
    <li>
        <span className="dotted-font font-thin text-gray-900 dark:text-white">Enter Your Phone Number</span> 
    </li>
    <li>
        <span className="dotted-font font-thin text-gray-900 dark:text-white">click connect now</span> 
    </li>


    <li>
        <span className="dotted-font font-thin text-gray-900 dark:text-white">Enter your Mobile PIN in the prompt and wait
          a few seconds to complete the process
          </span> 
    </li>
</ol>

<Link to='/hotspot-login' className='flex flex-row items-center justify-center'>
<div className='flex flex-row items-center justify-center'>
{/* <HiMiniArrowLeftEndOnRectangle className='w-8 h-8 text-teal-500'/> */}
  {/* <p className='dotted-font font-thin text-gray-900 mt-3'>Already subscribed?</p> */}
</div>

</Link>

</div>
): null}




      {seeForm  ?  (



 <motion.div
 className="max-w-md w-full bg-white rounded-xl shadow-lg p-6"
 variants={containerVariants}
 initial="hidden"
 animate="visible"
>
 <div className="text-center mb-6">
   <FaWifi className="text-yellow-500 w-12 h-12 mx-auto mb-4" />
   <h1 className="text-3xl  text-gray-900  dotted-font font-thin">Welcome to {company_name} Hotspot</h1>
   <p className="text-gray-600 dotted-font ">Connect and enjoy fast browsing.</p>
 </div>

 <motion.div
   className="flex justify-between items-center bg-gray-100 p-4 rounded-lg mb-4"
   whileHover={{ scale: 1.02 }}
 >
   {/* <FaLock className="text-green-500 w-8 h-8" /> */}
   <FaPhone className="text-green-500 w-8 h-8"/>
   <input type="text"
   
   className='w-full text-gray-700 bg-gray-100 rounded-lg p-2 focus:outline-none' 
   placeholder="Enter your phone number"/>
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
   className="w-full py-2 px-4 bg-yellow-500 text-white  rounded-full shadow-md
    focus:outline-none dotted-font font-thin"
   onClick={() => alert('Connected!')}
 >
   Connect Now
 </motion.button>

<div className='flex justify-center items-center cursor-pointer' onClick={()=>  {
  setSeeForm(false)
  setSeePackages(true)
  setSeeInstructions(true)
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

      ): null}
     





        {/* Packages Section */}

{/*         
{seePackages  ? (
  <motion.div className="max-w-md w-full mx-auto text-center">
  <h2 className="text-2xl  text-white mb-4 dotted-font font-thin">Choose Your Plan</h2>
  <div className="grid grid-cols-1 gap-6">
    {packages.map((pkg, index) => (
      <motion.div
        key={index}
        className="bg-white p-4 rounded-lg shadow-lg"
        variants={packageVariants}
        initial="hidden"
        animate="visible"
      >
        <h3 className="text-xl font-bold text-gray-900">{pkg.name}</h3>
        <p className="text-gray-600">Speed: {pkg?.speed}</p>
        <p className="text-gray-600">Valid For {pkg.valid}</p>
        <p className="text-blue-500 font-bold mt-2"> Price: Ksh{pkg.price}</p>

        <button onClick={()=> {
          setSeePackages(false)
          setSeeForm(true)
          setSeeInstructions(false)
        } } className='p-2 bg-blue-500 mt-2 rounded-md cursor-pointer
        dotted-font font-thin
        '>subscribe</button>

      </motion.div>
    ))}



  </div>

 
</motion.div>
) : null} */}
      

      {seePackages && (
  <motion.div className="max-w-md w-full mx-auto text-center mt-[320px] sm:mt-0">
    <h2 className="text-2xl text-white mb-4 dotted-font font-thin">{company_name}</h2>


    <div>
      </div>
    <div className="h-96 overflow-y-auto  sm:overflow-visible 

    grid grid-cols-1 gap-6 ">
      
      {packages.map((pkg, index) => (
        <motion.div
          key={index}
          className="bg-gray-800 p-4 rounded-lg shadow-lg"
          variants={packageVariants}
          initial="hidden"
          animate="visible"
        >
          <p className='text-yellow-500 dotted-font text-xl'>SELECT PACKAGE</p>
<div className='border border-white
flex flex-col items-center justify-center mx-auto
rounded-full w-[220px] h-[220px]
bg-yellow-500
p-4 mt-4'>
          <h3 className="text-sm font-bold text-gray-900">{pkg.name}</h3>
          {/* <p className="text-gray-600">Speed: {pkg?.speed}</p> */}
          <p className="text-white">Valid For {pkg.valid}</p>
          <p className="text-white font-bold mt-2"> Price: Ksh{pkg.price}</p>
          <button
            onClick={() => {
              setSeePackages(false);
              setSeeForm(true);
              setSeeInstructions(false);
            }}
            className="p-2 bg-yellow-500 mt-2 rounded-md cursor-pointer dotted-font font-thin"
          >
            Subscribe
          </button>
          </div>
        </motion.div>
      ))}
    
    </div>

    
  </motion.div>
)}


    </div>
</>
    ): null}
   
    </>
  );
};



export default HotspotPage