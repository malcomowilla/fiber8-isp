import { FaRegArrowAltCircleLeft } from "react-icons/fa";

import {useNavigate} from 'react-router-dom'
import {motion} from 'framer-motion'

const HotspotPricing = () => {
    const navigate = useNavigate()

    const handleGoBack = () => {
        navigate(-1)
    }
  return (
    <div className="font-sans bg-gray-950 text-white">
    
      {/* Hero Section */}
      <motion.section 
       initial={{ opacity: 0, scale: 0.8 }}
       animate={{ opacity: 1, scale: 1 }}
       transition={{ duration: 1, delay: 0.1 }}
      className="relative bg-gradient-to-br from-teal-900
       via-gray-900 to-gray-950 h-screen flex items-center justify-center overflow-hidden">
        
        <div className="absolute inset-0 bg-[url('https://via.placeholder.com/1920x800')] bg-cover bg-center opacity-20"></div>
        <div className="relative z-10 text-center max-w-4xl px-6 animate-fade-in">
          <h1 className="text-6xl font-bold mb-6 bg-clip-text text-transparent
           bg-gradient-to-r from-green-400 to-teal-400">
            Stay Connected Anywhere
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Affordable and reliable Wi-Fi hotspot plans for individuals and businesses. Browse, stream, and work seamlessly on the go.
          </p>
          {/* <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-8 rounded-lg hover:scale-105 transition-transform duration-300">
            Get Started
          </button> */}
        </div>
      </motion.section>

      {/* Pricing Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-gray-900 to-gray-950">
        <motion.h2 
        initial={{
          opacity: 0,
        }}
        whileInView={{ opacity: 1,
          scale: 1.25,
        transition:{
duration: 1.5,
delay: 0.8,
ease: 'easeOut',
type: "spring",
stiffness: 100,  
damping: 15,  
        }
         }}

      viewport={{ once: true, amount: 0.5 }}
        className="text-4xl font-bold text-center mb-12 bg-clip-text text-transparent 
        bg-gradient-to-r from-teal-400 to-green-400 animate-slide-in">
          Wi-Fi Hotspot Plans
        </motion.h2>
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Starter Plan */}
          <motion.div 
           initial={{ opacity: 0, scale: 0.9 }}
           whileInView={{
             opacity: 1,
             
             scale: 1.05, 
             transition: {
              duration: 0.3,
               type: "spring",
               stiffness: 120, // Controls how stiff the animation is
               damping: 15, // Reduces the bounciness
             },
           }}

           viewport={{ once: true, amount: 0.5 }}
          className="bg-gray-900 p-8 rounded-xl border border-gray-800 hover:border-green-500 transition-all duration-300 hover:scale-105 animate-fade-in-up">
            <h3 className="text-2xl font-bold mb-4 text-green-500">Starter</h3>
            <p className="text-gray-400 mb-6">up to 50 paying hotspot users.</p>
            <p className="text-4xl font-bold mb-6">
              KES 1500<span className="text-lg text-gray-400">/month</span>
            </p>
            <ul className="text-gray-400 mb-8">
              <li className="mb-2">✅ Your Own Sudomain</li>
              <li className="mb-2">✅Bulk SMS & Email Intergration</li>
              <li className="mb-2">✅ 24/7 Email Support</li>
              <li className="mb-2">✅ MPesa Intergration</li>
              <li className="mb-2">✅ Centralized Hotspot Admin Dashboard Management</li>
              <li className="mb-2">✅ Customizable Hotspot Plans</li>


            </ul>
            <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-8 rounded-lg w-full hover:scale-105 transition-transform duration-300">
              Choose Plan
            </button>
          </motion.div>



          {/* Pro Plan */}
          <motion.div 
           initial={{ opacity: 0, scale: 0.9 }}
           whileInView={{
             opacity: 1,
             
             scale: 1.05, 
             transition: {
              duration: 0.3,
               type: "spring",
               stiffness: 120, // Controls how stiff the animation is
               damping: 15, // Reduces the bounciness
             },
           }}
           viewport={{ once: true, amount: 0.5 }}
          className="bg-gray-900 p-8 rounded-xl border border-purple-500 transform scale-105 hover:scale-110 transition-all duration-300 animate-fade-in-up delay-200">
            <h3 className="text-2xl font-bold mb-4 text-purple-500">Pro</h3>
            <p className="text-gray-400 mb-6">up to 200 hotspot users</p>
            <p className="text-4xl font-bold mb-6">
              KES 2500<span className="text-lg text-gray-400">/month</span>
            </p>
            <ul className="text-gray-400 mb-8">
              <li className="mb-2">✅ Your Own Sudomain</li>
              <li className="mb-2">✅Bulk SMS & Email Intergration</li>
              <li className="mb-2">✅ 24/7 Email Support</li>
              <li className="mb-2">✅ MPesa Intergration</li>
              <li className="mb-2">✅ Centralized Hotspot Admin Dashboard Management</li>
              <li className="mb-2">✅ Customizable Hotspot Plans</li>


            </ul>
            <button className="bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold py-3 px-8 rounded-lg w-full hover:scale-105 transition-transform duration-300">
              Choose Plan
            </button>
          </motion.div>



          <motion.div 
           initial={{ opacity: 0, scale: 0.9 }}
           whileInView={{
             opacity: 1,
             
             scale: 1.05, 
             transition: {
              duration: 0.3,
               type: "spring",
               stiffness: 120, // Controls how stiff the animation is
               damping: 15, // Reduces the bounciness
             },
           }}
           viewport={{ once: true, amount: 0.5 }}
          className="bg-gray-900 p-8 rounded-xl border border-gray-800 hover:border-amber-500 transition-all duration-300 hover:scale-105 animate-fade-in-up">
            <h3 className="text-2xl font-bold mb-4 text-amber-500">Gold Hotspot</h3>
            <p className="text-gray-400 mb-6">up to 1000 paying hotspot users.</p>
            <p className="text-4xl font-bold mb-6">
              KES 5000<span className="text-lg text-gray-400">/month</span>
            </p>
            <ul className="text-gray-400 mb-8">
              <li className="mb-2">✅ Your Own Sudomain</li>
              <li className="mb-2">✅Bulk SMS & Email Intergration</li>
              <li className="mb-2">✅ 24/7 Email Support</li>
              <li className="mb-2">✅ MPesa Intergration</li>
              <li className="mb-2">✅ Centralized Hotspot Admin Dashboard Management</li>
              <li className="mb-2">✅ Customizable Hotspot Plans</li>


            </ul>
            <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-8 rounded-lg w-full hover:scale-105 transition-transform duration-300">
              Choose Plan
            </button>
          </motion.div>

          {/* Business Plan */}
          <motion.div className="bg-gray-900 p-8 rounded-xl border border-gray-800 hover:border-blue-500 transition-all duration-300 hover:scale-105 animate-fade-in-up delay-400">
            <h3 className="text-2xl font-bold mb-4 text-blue-500">Business</h3>
            <p className="text-gray-400 mb-6">Best for teams and high-demand usage.</p>
            <p className="text-4xl font-bold mb-6">
            Negotiated Pricing
            </p>
            <ul className="text-gray-400 mb-8">
              <li className="mb-2">✅ Your Own Sudomain</li>
              <li className="mb-2">✅Bulk SMS & Email Intergration</li>
              <li className="mb-2">✅ 24/7 Email Support</li>
              <li className="mb-2">✅ MPesa Intergration</li>
              <li className="mb-2">✅ Centralized Hotspot Admin Dashboard Management</li>
              <li className="mb-2">✅ Customizable Hotspot Plans</li>


            </ul>
            <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-8 rounded-lg w-full hover:scale-105 transition-transform duration-300">
              Choose Plan
            </button>
          </motion.div>
        </div>
      </section>

    
         
        <div   onClick={handleGoBack}   className='  text-white text-xl absolute
        left-0 top-0 max-w-min max-h-min
         p-2 bg-green-900 rounded-xl cursor-pointer hover:scale-105 transition-all 
         duration-300 animate-fade-in-up'>
<div>
<p>
  go back
</p>

</div>

        <FaRegArrowAltCircleLeft />
        </div>

   
    </div>
  );
};

export default HotspotPricing;