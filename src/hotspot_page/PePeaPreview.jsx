import { FaWifi } from "react-icons/fa6";
import { motion } from "framer-motion";

import { FaLongArrowAltRight } from "react-icons/fa";
import { FaPhoneVolume } from "react-icons/fa6";
import { useState } from "react";
import { FaLongArrowAltLeft } from "react-icons/fa";





const PePeaPreview = () => {

    const [seeForm, setSeeForm] = useState(false)
    const [seePackages, setSeePackages] = useState(true)
  return (
  <>




  {seePackages ? (
    <div>
<section className='bg-yellow-300 flex  flex-col justify-center'>

<div>
    <p className='text-center'>PePea Hotspot </p>
    <FaWifi className='text-yellow-500 w-[55px] h-[55px] mx-auto mb-4' />
    <p className='text-center text-xl'>WIFI</p>
    <p className='text-center'>IS AVAILABLE NOW</p>
</div>

<div className='flex flex-row gap-2 items-center justify-center'>
     <div className="grid place-content-center bg-emerald-950 px-4 py-2 text-yellow-50">
      <h1 className="max-w-2xl text-center text-xl leading-snug">
        Wacha Stress Za Bundles Kuisha Jisort Na {" "}
        <span className="relative">
          Pepea Hotspot
          <svg
            viewBox="0 0 286 73"
            fill="none"
            className="absolute -left-2 -right-2 -top-2 bottom-0 translate-y-1"
          >
            <motion.path
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              transition={{
                duration: 1.25,
                ease: "easeInOut",
              }}
              d="M142.293 1C106.854 16.8908 6.08202 7.17705 1.23654 43.3756C-2.10604 68.3466 29.5633 73.2652 122.688 71.7518C215.814 70.2384 316.298 70.689 275.761 38.0785C230.14 1.37835 97.0503 24.4575 52.9384 1"
              stroke="#FACC15"
              strokeWidth="3"
            />
          </svg>
        </span>{" "}
      </h1>
    </div>
</div>


<div className='flex flex-row gap-2 items-center justify-center mt-4'>
<div className='grid grid-cols-3 gap-3 px-4 py-2 text-black rounded-lg'>

<div  className='bg-white rounded-lg p-7 text-center'>
<p className='font-light text-xl'>20 <span className='text-3xl font-extrabold'>bob </span></p>

<button 
onClick={() => {
    setSeeForm(true)
    setSeePackages(false)
}}
className='bg-yellow-300 text-white rounded-lg px-4 py-2 font-bold flex gap-2'>
    <p>Buy Plan </p>
    <FaLongArrowAltRight />
</button>
</div>


<div  className='bg-white rounded-lg p-7 text-center'>
<p className='font-light text-xl'>20 <span className='text-3xl font-extrabold'>bob </span></p>

<button className='bg-yellow-300 text-white rounded-lg px-4 py-2 font-bold flex gap-2'>
    <p>Buy Plan </p>
    <FaLongArrowAltRight />
</button>
</div>




<div  className='bg-white rounded-lg p-7 text-center'>
<p className='font-light text-xl'>20 <span className='text-3xl font-extrabold'>bob </span></p>

<button className='bg-yellow-300 text-white rounded-lg px-4 py-2 font-bold flex gap-2'>
    <p>Buy Plan </p>
    <FaLongArrowAltRight />
</button>
</div>



<div  className='bg-white rounded-lg p-7 text-center'>
<p className='font-light text-xl'>20 <span className='text-3xl font-extrabold'>bob </span></p>

<button className='bg-yellow-300 text-white rounded-lg px-4 py-2 font-bold flex gap-2'>
    <p>Buy Plan </p>
    <FaLongArrowAltRight />
</button>
</div>
</div>
</div>


<div className='flex flex-col gap-2 items-center justify-center mt-4'>
   <input

  name="vouchers"
              // type="password"
              className="  bg-gray-100 rounded-lg p-4 focus:outline-none"
              placeholder="Enter your voucher code"
            />

              <div>
                <p>please login to use the hotspot</p>
              </div>
            <button className='bg-yellow-400 text-white rounded-lg px-4 py-2 font-bold flex gap-2'>
              <p>connect</p>
            </button>
</div>
</section>





<section className="bg-white shadow-lg rounded-xl p-6 max-w-md w-full border border-gray-100">
  <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">
    How to Purchase
  </h3>
  
  <ul className="space-y-3">
    <li className="flex items-start">
      <span className="bg-blue-100 text-blue-600 rounded-full p-1 mr-3">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      </span>
      <span className="text-gray-700">Tap the package you want to purchase</span>
    </li>
    
    <li className="flex items-start">
      <span className="bg-blue-100 text-blue-600 rounded-full p-1 mr-3">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      </span>
      <span className="text-gray-700">Enter Your Phone Number</span>
    </li>
    
    <li className="flex items-start">
      <span className="bg-blue-100 text-blue-600 rounded-full p-1 mr-3">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      </span>
      <span className="text-gray-700">Click <strong className="text-blue-600">Connect Now</strong></span>
    </li>
    
    <li className="flex items-start">
      <span className="bg-blue-100 text-blue-600 rounded-full p-1 mr-3">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      </span>
      <span className="text-gray-700">Enter your Mobile PIN in the prompt and wait a few seconds to complete the process</span>
    </li>
  </ul>

  <div className="mt-6 text-center">
    <p className="text-sm text-gray-500">
      Need help? <a href="#" className="text-blue-600 hover:underline"><FaPhoneVolume /> Call us at <strong className="text-blue-600">+91-1234567890</strong></a>
    </p>
  </div>
</section>
    </div>
  ): null}
    




{seeForm ? (
    <div className='bg-yellow-300 flex flex-col justify-center 
    h-screen
    items-center p-4 rounded-lg'>
        <input

  name="vouchers"
              // type="password"
              className="  bg-gray-100 rounded-lg p-4 focus:outline-none"
              placeholder="Enter your phone number"
            />

              
            <button className='bg-yellow-400 text-white rounded-lg px-4 py-2 font-bold flex gap-2'>
              <p>subscribe</p>
            </button>
            <FaLongArrowAltLeft className='w-7 h-7 cursor-pointer'
            onClick={() => {
                setSeeForm(false)
                setSeePackages(true)
            }}
            />
    </div>
): null}

    </>
  )
}

export default PePeaPreview