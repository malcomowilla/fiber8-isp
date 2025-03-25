import React, { useContext, useState, useRef, useEffect } from 'react';
import { ApplicationContext } from '../context/ApplicationContext';
import { Button, Alert } from '@mui/material';
import { FaArrowTrendUp } from "react-icons/fa6";
import { FaWifi } from "react-icons/fa";
import { FaNetworkWired } from "react-icons/fa6";
import { FaTicketAlt } from "react-icons/fa";
import { FaTools } from "react-icons/fa";
import { FaRegArrowAltCircleRight } from "react-icons/fa";
import {Link} from 'react-router-dom'
import { FaRegArrowAltCircleUp } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { IoMdCheckmark } from "react-icons/io";

import { MdOutlineMessage } from "react-icons/md";
import { BsQuestionCircle } from "react-icons/bs";
import { FaWhatsapp } from "react-icons/fa6";







const Signup = () => {
  const { email, setEmail, username, setUsername, password, setPassword,
     handleSignUp, offlineError } = useContext(ApplicationContext);

const scrollIntoViewRef = useRef(null);
const scrollIntoViewRefTop = useRef(null)

     const [isMenuOpen, setIsMenuOpen] = useState(false);
     const [currentText, setCurrentText] = useState("Hotspot");
     const texts = ["Hotspot", "PPoE"]; // Tex
     const toggleMenu = () => {
       setIsMenuOpen(!isMenuOpen);
     };
   



     useEffect(() => {
      const interval = setInterval(() => {
        setCurrentText((prevText) =>
          prevText === texts[0] ? texts[1] : texts[0]
        );
      }, 3000); // Switch every 3 seconds
  
      return () => clearInterval(interval); // Cleanup interval on unmount
    }, []);

     const onScroll = () => {
      scrollIntoViewRef.current?.scrollIntoView({ behavior: 'smooth' });
     }


     const onScrollTop = () => {
      scrollIntoViewRefTop.current?.scrollIntoView({ behavior: 'smooth' });
     }


  return (
    <>
     <div className="font-sans bg-gray-950  text-white overflow-hidden">
      
      {/* Hero Section */}
      <motion.section 
      initial={{ opacity: 0 }}
     
      whileInView={{
        opacity: 1,
        transition:{
          duration: 2.5,
          delay: 0.4,
        }
      }}
      ref={scrollIntoViewRefTop} className="relative   cursor-pointer bg-gradient-to-br
       from-blue-900 via-gray-900 to-gray-950 h-screen flex items-center flex-col justify-center overflow-hidden">

        
      <nav className="bg-white border-gray-200 dark:bg-gray-900
      fixed lg:abolute top-0 left-0 right-0 z-50">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          {/* Logo */}
          <a href="https://flowbite.com/" className="flex items-center space-x-3 rtl:space-x-reverse">
            <img
              src="/images/aitechs.png"
              className="h-8"
              alt="Flowbite Logo"
            />
            <span className="self-center text-2xl font-semibold 
            whitespace-nowrap dark:text-white text-black">
              Aitechs
            </span>
          </a>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            type="button"
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm
             text-gray-500 rounded-lg md:hidden  hover:bg-gray-100 focus:outline-none
              focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            aria-controls="navbar-default"
            aria-expanded={isMenuOpen}
          >
            <span  className="sr-only text-black">Open main menu</span>
            <svg
            onClick={toggleMenu}
              className="w-5 h-5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 17 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M1 1h15M1 7h15M1 13h15"
              />
            </svg>
          </button>

          {/* Desktop Menu */}
          <div className="hidden w-full md:block md:w-auto" id="navbar-default">
            <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
              <li>
                <a
                  href="#"
                  className="block py-2 px-3 text-white bg-green-700 rounded-sm md:bg-transparent
                   md:text-green-700 md:p-0 dark:text-white md:dark:text-green-500"
                  aria-current="page"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100
                   md:hover:bg-transparent md:border-0 md:hover:text-green-700 md:p-0
                    dark:text-white
                    md:dark:hover:text-blue-500 dark:hover:bg-gray-700
                     dark:hover:text-white md:dark:hover:bg-transparent"
                >
                  About
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 
                  md:hover:bg-transparent md:border-0 md:hover:text-green-700 md:p-0 
                  dark:text-white md:dark:hover:text-green-500 dark:hover:bg-gray-700
                   dark:hover:text-white md:dark:hover:bg-transparent"
                >
                  Services
                </a>
              </li>
              <li onClick={onScroll}>
                <a
                  className="block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100
                   md:hover:bg-transparent md:border-0 md:hover:text-green-700 md:p-0 dark:text-white
                    md:dark:hover:text-green-500 dark:hover:bg-gray-700 dark:hover:text-white
                     md:dark:hover:bg-transparent"
                >
                  Pricing
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100
                   md:hover:bg-transparent md:border-0 md:hover:text-green-700 md:p-0
                    dark:text-white md:dark:hover:text-green-500 dark:hover:bg-gray-700
                     dark:hover:text-white md:dark:hover:bg-transparent"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Mobile Menu */}
          <div
            className={`${
              isMenuOpen ? 'block' : 'hidden'
            } w-full md:hidden transition-all duration-300 ease-in-out`}
            id="navbar-default"
          >
            <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border
             border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 rtl:space-x-reverse 
             md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
              <li>
                <a
                  href="#"
                  className="block py-2 px-3 text-white bg-green-700 rounded-sm md:bg-transparent
                   md:text-green-700 md:p-0 dark:text-white md:dark:text-green-500"
                  aria-current="page"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent
                   md:border-0 md:hover:text-green-700 md:p-0 dark:text-white
                    md:dark:hover:text-green-500 dark:hover:bg-gray-700 dark:hover:text-white 
                    md:dark:hover:bg-transparent"
                >
                  About
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100
                   md:hover:bg-transparent md:border-0 md:hover:text-green-700 md:p-0 dark:text-white
                    md:dark:hover:text-green-500 dark:hover:bg-gray-700 dark:hover:text-white 
                    md:dark:hover:bg-transparent"
                >
                  Services
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100
                   md:hover:bg-transparent md:border-0 md:hover:text-green-700 md:p-0 dark:text-white
                    md:dark:hover:text-green-500 dark:hover:bg-gray-700 dark:hover:text-white
                     md:dark:hover:bg-transparent"
                >
                  Pricing
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="block py-2 px-3 text-gray-900 rounded-sm
                   hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-green-700 md:p-0
                    dark:text-white md:dark:hover:text-green-500 dark:hover:bg-gray-700
                     dark:hover:text-white md:dark:hover:bg-transparent"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <AnimatePresence mode="wait">
            <motion.div
              key={currentText}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.5 }}
              className="text-2xl font-semibold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-teal-400"
            >
              {currentText}
            </motion.div>
          </AnimatePresence>


        <div className="relative   max-w-4xl px-6 
        grid lg:grid-cols-2 grid-cols-1 gap-8
        animate-fade-in">





<div className=''>

          <h1 className="text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r
           from-green-400 to-teal-400">
            Revolutionize Your Internet Experience
          </h1>


        
          <p className="text-xl text-gray-300 mb-8">
            Empower your business with our cutting-edge SaaS platform for seamless internet management. Fast, reliable, and scalable.
          </p>

          <button 
          onClick={() => window.open('https://wa.me/254791568852?text=Hello%20I%20am%20interested%20in%20your%20services', '_blank')}

          className="bg-gradient-to-r from-green-600 to-teal-600
           text-white font-semibold py-3 px-8 rounded-lg hover:scale-105 transition-transform duration-300">
            Contact Us
          </button>

          </div>
         
          <div className=" ">
      <img 
        src="/images/aitechs-image.png" // Replace with your image path
        alt="Revolutionize Your Internet Experience"
        className="w-full  rounded-lg shadow-lg"
      />
    </div>
        
        </div>
      </motion.section>



      {/* Features Section */}
      <section className="py-20 px-6 bg-gray-950">
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

        
        className="text-4xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r
         from-green-400 to-teal-400 animate-slide-in">
          Why Choose Us?
        </motion.h2>


        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">

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
        
          className="bg-gray-900 p-8 rounded-xl border border-gray-800 hover:border-purple-500 transition-all 
          duration-300 hover:scale-105 animate-fade-in-up">
            <div className="text-4xl mb-4 text-purple-500">🚀</div>
            <h3 className="text-2xl font-bold mb-4">Blazing Fast Speeds</h3>
            <p className="text-gray-400">Experience ultra-fast internet with speeds up to 10Gbps.</p>
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
          className="bg-gray-900 p-8 rounded-xl border border-gray-800 hover:border-green-500
           transition-all duration-300 hover:scale-105 animate-fade-in-up delay-200">
            <div className="text-4xl mb-4 text-green-500">🔒</div>
            <h3 className="text-2xl font-bold mb-4">99.99% Uptime</h3>
            <p className="text-gray-400">Our network ensures maximum reliability with 99.99% uptime.</p>
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
          className="bg-gray-900 p-8 rounded-xl border border-gray-800 hover:border-green-500 
          transition-all duration-300 hover:scale-105 animate-fade-in-up delay-200">
            <div className="text-4xl mb-4 text-green-500">💳</div>
            <h3 className="text-2xl font-bold mb-4">Automated Payments</h3>
            <p className="text-gray-400">Review monitor, manage your payments with ease.</p>
          </motion.div>





          <motion.div
          viewport={{ once: true, amount: 0.5 }}
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
          }}className="bg-gray-900 p-8 rounded-xl border border-gray-800 hover:border-blue-500 transition-all duration-300 hover:scale-105 animate-fade-in-up delay-200">
            <div className="text-4xl mb-4 text-green-500">
              <FaArrowTrendUp className="w-10 h-10" />

            </div>
            <h3 className="text-2xl font-bold mb-4">Scalability</h3>
            <p className="text-gray-400">it ensures PPPOE, hotspot systems, and ISP billing handle
               growing users, dynamic bandwidth, diverse billing plans, and high-volume transactions efficiently</p>
          </motion.div>




          <motion.div
         viewport={{ once: true, amount: 0.5 }} 
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
          }}className="bg-gray-900 p-8 rounded-xl border border-gray-800 hover:border-purple-500 transition-all duration-300 hover:scale-105 animate-fade-in-up delay-400">
            <div className="text-4xl mb-4 text-purple-500">🛠️</div>
            <h3 className="text-2xl font-bold mb-4">24/7 Expert Support</h3>
            <p className="text-gray-400">Our team is available round the clock to assist you.</p>
          </motion.div>
        </div>
      </section>




      <section className='py-20 px-6 bg-gradient-to-br
flex flex-col justify-center items-center
from-gray-900 to-gray-600'>

    <div className='grid lg:grid-cols-2 grid-cols-1 gap-8'>

        {/* SMS */}
        <div className='flex flex-row gap-2 cursor-pointer'>
            <div className='bg-blue-400 p-2 rounded-xl h-10 w-10 mx-0 text-center
                border border-gray-800 hover:border-purple-500 transition-all
                duration-300 hover:scale-105 animate-fade-in-up'>
                <MdOutlineMessage className='w-5 h-5' />
            </div>
            <div>
                <p className='font-extrabold text-xl'>SMS</p>
                <p className='font-thin text-xs'>Integrate with your existing SMS provider</p>
            </div>
        </div>

        {/* Payments */}
        <div className='flex flex-row gap-2 cursor-pointer'>
            <div className='bg-white  p-4 rounded-xl h-10 w-10 flex justify-center items-center
                border border-gray-800 hover:border-purple-500 transition-all
                duration-300 hover:scale-105 animate-fade-in-up'>
                💴
            </div>
            <div>
                <p className='font-extrabold text-xl'>Payments</p>
                <p className='font-thin text-xs'>Use your M-Pesa Paybill and Till for automated payments</p>
            </div>
        </div>

        {/* Billing */}
        <div className='flex flex-row gap-2 cursor-pointer'>
            <div className='bg-blue-400  p-4 rounded-xl h-8 w-8 flex justify-center items-center
                border border-gray-800 hover:border-purple-500 transition-all
                duration-300 hover:scale-105 animate-fade-in-up'>
                💳
            </div>
            <div>
                <p className='font-extrabold text-xl'>Billing</p>
                <p className='font-thin text-xs'>Manage and automate your billing process</p>
            </div>
        </div>

        {/* Network */}
        <div className='flex flex-row gap-2'>
            <div className='bg-white p-4 rounded-xl h-8 w-8 flex justify-center items-center
                border border-gray-800 hover:border-purple-500 transition-all
                duration-300 hover:scale-105 animate-fade-in-up'>
                🌐
            </div>
            <div>
                <p className='font-extrabold text-xl'>Network</p>
                <p className='font-thin text-xs'>Monitor and manage your network infrastructure</p>
            </div>
        </div>

        {/* Security */}
        <div className='flex flex-row gap-2'>
            <div className='bg-blue-400  p-4 rounded-xl h-8 w-8 flex justify-center items-center
                border border-gray-800 hover:border-purple-500 transition-all
                duration-300 hover:scale-105 animate-fade-in-up'>
                🔒
            </div>
            <div>
                <p className='font-extrabold text-xl'>Security</p>
                <p className='font-thin text-xs'>Ensure data protection with secure authentication</p>
            </div>
        </div>

        {/* White Label */}
        <div className='flex flex-row gap-2'>
            <div className='bg-blue-400  p-4 rounded-xl h-8 w-8 flex justify-center items-center
                border border-gray-800 hover:border-purple-500 transition-all
                duration-300 hover:scale-105 animate-fade-in-up'>
                🏷️
            </div>
            <div>
                <p className='font-extrabold text-xl'>White Label</p>
                <p className='font-thin text-xs'>Customize branding to match your business identity</p>
            </div>
        </div>

    </div>

</section>






<section  className="py-20 px-6 bg-gradient-to-br from-gray-900 to-gray-950">

<div className='grid lg:grid-cols-2 grid-cols-1 gap-8'> 

<div className='flex flex-col items-center justify-center'>
<BsQuestionCircle className='w-10 h-10 text-blue-500 hover:scale-110 transition-all duration-300 
animate-fade-in-up' />


<p className='font-bold text-2xl'>Ask Us A Question</p>
<p className='font-thin'>For demo logins please reachout via whatsap below </p>


<div className='flex flex-row gap-2 cursor-pointer
bg-blue-400 p-4 rounded-xl  mt-4 text-center
      border border-gray-800 hover:border-purple-500 transition-all
      duration-300 hover:scale-105 animate-fade-in-up'
      onClick={() => window.open('https://wa.me/0791568852?text=Hello%20I%20am%20interested%20in%20your%20demo', '_blank')}>

  <FaWhatsapp className='w-5 h-5' />
  <p className='font-bold'>contact us</p>
</div>
</div>



<div>

</div>

  </div>


</section>






      <section  ref={scrollIntoViewRef} className="py-20 px-6 bg-gradient-to-br from-gray-900 to-gray-950">
        <motion.h2
        initial={{
          opacity: 0,
        }}
        whileInView={{ opacity: 1,
          scale: 1.25,
        transition:{
duration: 1.5,
delay: 0.5,
ease: 'easeOut',
type: "spring",
stiffness: 100,  
damping: 15,  
        }
         }}
         viewport={{ once: true, amount: 0.5 }}
        className="text-4xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r
         from-green-400 to-teal-400 animate-slide-in">
         PPOE Pricing Plans
        </motion.h2>
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Basic Plan */}
         
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
          className="bg-gray-900 p-8 rounded-xl border border-gray-800
           hover:border-green-500 transition-all duration-300 hover:scale-105 animate-fade-in-up">
            <h3 className="text-2xl font-bold mb-4 text-green-500">Basic</h3>
            <p className="text-gray-400 mb-6">up to 50 ppoe subscribers</p>
            <p className="text-4xl font-bold mb-6">
              KES2000<span className="text-lg text-gray-400">/month</span>
            </p>
            <ul className="text-gray-400 mb-8">
              <li className="mb-2">✅ Your Own Sudomain</li>
              <li className="mb-2">✅Bulk SMS & Email Intergration</li>
              <li className="mb-2">✅ 24/7 Email Support</li>
              <li className="mb-2">✅ MPesa Intergration</li>
              <li className="mb-2">✅ Centralized Admin Dashboard Management</li>
              <li className="mb-2">❌ Customizable PPOE Plans</li>


              <li className="mb-2">❌ Advanced Analytics</li>
            </ul>
            <button className="bg-gradient-to-r from-green-600 to-teal-600 text-white font-semibold py-3 px-8 rounded-lg w-full hover:scale-105 transition-transform duration-300">
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
          className="bg-gray-900 p-8 rounded-xl border border-purple-500 transform 
          scale-105 hover:scale-110 transition-all duration-300 animate-fade-in-up delay-200">
            <h3 className="text-2xl font-bold mb-4 text-purple-500">Pro</h3>
            <p className="text-gray-400 mb-6">up to 100 ppoe subscribers</p>
            <p className="text-4xl font-bold mb-6">
              KES 2700<span className="text-lg text-gray-400">/month</span>
            </p>
            <ul className="text-gray-400 mb-8">
            <li className="mb-2">✅ Your Own Sudomain</li>
              <li className="mb-2">✅Bulk SMS & Email Intergration</li>
              <li className="mb-2">✅ 24/7 Email Support</li>
              <li className="mb-2">✅ Advanced Analytics</li>
              <li className="mb-2">✅ Customizable PPOE Plans</li>

            </ul>
            <button className="bg-gradient-to-r from-teal-600 to-green-600 text-white font-semibold py-3 px-8 rounded-lg w-full hover:scale-105 transition-transform duration-300">
              Choose Plan
            </button>
          </motion.div>


{/* standard plan */}

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
          className="bg-gray-900 p-8 rounded-xl border border-gray-800 hover:border-blue-500 transition-all duration-300 hover:scale-105 animate-fade-in-up">
            <h3 className="text-2xl font-bold mb-4 text-blue-500">Standard</h3>
            <p className="text-gray-400 mb-6">up to 180 ppoe subscribers</p>
            <p className="text-4xl font-bold mb-6">
              KES32000<span className="text-lg text-gray-400">/month</span>
            </p>
            <ul className="text-gray-400 mb-8">
              <li className="mb-2">✅ Your Own Sudomain</li>
              <li className="mb-2">✅Bulk SMS & Email Intergration</li>
              <li className="mb-2">✅ 24/7 Email Support</li>
              <li className="mb-2">✅ MPesa Intergration</li>
              <li className="mb-2">✅ Centralized Admin Dashboard Management</li>
              <li className="mb-2">✅ Customizable PPOE Plans</li>


              <li className="mb-2">❌ Advanced Analytics</li>
            </ul>
            <button className="bg-gradient-to-r from-green-600 to-teal-600 text-white font-semibold py-3 px-8 rounded-lg w-full hover:scale-105 transition-transform duration-300">
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
          className="bg-gray-900 p-8 rounded-xl border border-gray-800 hover:border-red-500 
          transition-all duration-300 hover:scale-105 animate-fade-in-up">
            <h3 className="text-2xl font-bold mb-4 text-red-500">Startup</h3>
            <p className="text-gray-400 mb-6">up to 300 ppoe subscribers</p>
            <p className="text-4xl font-bold mb-6">
              KES3500<span className="text-lg text-gray-400">/month</span>
            </p>
            <ul className="text-gray-400 mb-8">
              <li className="mb-2">✅ Your Own Sudomain</li>
              <li className="mb-2">✅Bulk SMS & Email Intergration</li>
              <li className="mb-2">✅ 24/7 Email Support</li>
              <li className="mb-2">✅ MPesa Intergration</li>
              <li className="mb-2">✅ Centralized Admin Dashboard Management</li>
              <li className="mb-2">✅ Customizable PPOE Plans</li>


              <li className="mb-2">✅ Advanced Analytics</li>
            </ul>
            <button className="bg-gradient-to-r from-teal-600 to-green-600 text-white font-semibold py-3 px-8 rounded-lg w-full hover:scale-105 transition-transform duration-300">
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
          className="bg-gray-900 p-8 rounded-xl border border-gray-800 hover:border-yellow-500 transition-all duration-300 hover:scale-105 animate-fade-in-up">
            <h3 className="text-2xl font-bold mb-4 text-yellow-500">Silver</h3>
            <p className="text-gray-400 mb-6">up to 500 ppoe subscribers</p>
            <p className="text-4xl font-bold mb-6">
              KES4500<span className="text-lg text-gray-400">/month</span>
            </p>
            <ul className="text-gray-400 mb-8">
              <li className="mb-2">✅ Your Own Sudomain</li>
              <li className="mb-2">✅Bulk SMS & Email Intergration</li>
              <li className="mb-2">✅ 24/7 Email Support</li>
              <li className="mb-2">✅ MPesa Intergration</li>
              <li className="mb-2">✅ Centralized Admin Dashboard Management</li>
              <li className="mb-2">✅ Customizable PPOE Plans</li>


              <li className="mb-2">✅ Advanced Analytics</li>
            </ul>
            <button className="bg-gradient-to-r from-yellow-600 to-orange-600 text-white font-semibold py-3 px-8 rounded-lg w-full hover:scale-105 transition-transform duration-300">
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
          className="bg-gray-900 p-8 rounded-xl border border-gray-800 hover:border-cyan-500
           transition-all duration-300 hover:scale-105 animate-fade-in-up">
            <h3 className="text-2xl font-bold mb-4 text-cyan-500">Bronze</h3>
            <p className="text-gray-400 mb-6">up to 1000 ppoe subscribers</p>
            <p className="text-4xl font-bold mb-6">
              KES6000<span className="text-lg text-gray-400">/month</span>
            </p>
            <ul className="text-gray-400 mb-8">
              <li className="mb-2">✅ Your Own Sudomain</li>
              <li className="mb-2">✅Bulk SMS & Email Intergration</li>
              <li className="mb-2">✅ 24/7 Email Support</li>
              <li className="mb-2">✅ MPesa Intergration</li>
              <li className="mb-2">✅ Centralized Admin Dashboard Management</li>
              <li className="mb-2">✅ Customizable PPOE Plans</li>


              <li className="mb-2">✅ Advanced Analytics</li>
            </ul>
            <button className="bg-gradient-to-r from-cyan-600 to-cyan-600 text-white font-semibold py-3 px-8 rounded-lg w-full hover:scale-105 transition-transform duration-300">
              Choose Plan
            </button>
          </motion.div>









          {/* Enterprise Plan */}
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
          className="bg-gray-900 p-8 rounded-xl border border-gray-800 hover:border-amber-300 transition-all 
          duration-300 hover:scale-105 animate-fade-in-up delay-800">
            <h3 className="text-2xl font-bold mb-4 text-amber-300">Enterprise</h3>
            <p className="text-gray-400 mb-6">Custom solutions for large-scale isp businesses.</p>
            <p className="text-4xl font-bold mb-6">
            Negotiated Pricing
            </p>
            <ul className="text-gray-400 mb-8">
            <li className="mb-2">✅ Your Own Sudomain</li>
              <li className="mb-2">✅Bulk SMS & Email Intergration</li>
              <li className="mb-2">✅ 24/7 Email Support</li>
              <li className="mb-2">✅ MPesa Intergration</li>
              <li className="mb-2">✅ Centralized Admin Dashboard Management</li>
              <li className="mb-2">✅ Customizable PPOE Plans</li>

            </ul>
            <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-8 rounded-lg w-full hover:scale-105 transition-transform duration-300">
              Contact Us
            </button>
          </motion.div>
        
        </div>
        
<Link to='/hotspot-pricing'>
        <div className='absolute right-0  top-[5rem] text-white 
         p-3 text-xl bg-gray-900 rounded-xl cursor-pointer hover:scale-105
          transition-all duration-300 animate-fade-in-up'>
<div>
<p>
  see also our hotspot pricing
</p>

</div>

        <FaRegArrowAltCircleRight />
        </div>

        </Link>
      </section>


      {/* Call to Action Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-green-900 to-teal-900 text-white text-center">
        <h2 className="text-4xl font-bold mb-6 animate-slide-in">

        <div onClick={onScrollTop} className='fixed right-0 bottom-0  text-white text-2xl
         p-8 bg-gray-900 rounded-xl cursor-pointer hover:scale-105 transition-all 
         duration-300 animate-fade-in-up'>

          <FaRegArrowAltCircleUp  />
          </div>
          Ready to Transform Your Business?
        </h2>
        <p className="text-xl mb-8 text-gray-300">
          Join thousands of satisfied customers and experience the difference.
        </p>
        <button className="bg-white text-blue-900 font-semibold py-3 px-8 rounded-lg hover:scale-105 transition-transform duration-300">
          Sign Up Now
        </button>
      </section>
    </div>
    </>
  );
}

export default Signup;
