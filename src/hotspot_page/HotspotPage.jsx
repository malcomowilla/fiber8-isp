import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { FaWifi, FaLock, FaCheckCircle } from 'react-icons/fa'
import { FaPhone } from "react-icons/fa6";
import toast, { Toaster } from 'react-hot-toast';
import { useEffect, useState } from 'react';
import { TiArrowBackOutline } from "react-icons/ti";
import { SlNotebook } from "react-icons/sl";
import { HiMiniArrowLeftEndOnRectangle } from "react-icons/hi2";






const HotspotPage = () => {
 const [packages, setPackages] = useState([])
 const [seeForm, setSeeForm] = useState(false)
 const [seePackages, setSeePackages] = useState(true)
 const [seeInstructions, setSeeInstructions] = useState(true)

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
      const response = await fetch('/api/hotspot_packages')
      const newData = await response.json()
      if (response.ok) {
        // setPackages(newData)
        setPackages(newData)
        console.log('hotspot packages fetched', newData)
      } else {
        toast.error('failed to fetch hotspot packages', {
          duration: 7000,
          position: "top-center",
        });
        console.log('failed to fetch hotspot packages')
      }
    } catch (error) {
      toast.error('Something went wrong', {
        duration: 7000,
        position: "top-center",
      });
      console.log(error)
    }
  }
  fetchHotspotPackages()
}, []);


  
  return (
    <div className="min-h-screen   relative  z-0 flex items-center justify-center
     bg-gradient-to-r from-blue-500 to-indigo-600 p-4">



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
   <h1 className="text-3xl  text-gray-900  dotted-font font-thin">Welcome to Fiber8 Hotspot</h1>
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
) : null}
      



    </div>
  );
};



export default HotspotPage