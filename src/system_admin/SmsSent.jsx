import { Link, useNavigate } from 'react-router-dom';
import { RiArrowGoBackFill } from "react-icons/ri";
import { FaPhone } from "react-icons/fa";
import Lottie from 'react-lottie';
import {useApplicationSettings} from '../settings/ApplicationSettings'
import { GoPasskeyFill } from "react-icons/go";
import Tooltip from '@mui/material/Tooltip';
import toaster, { Toaster } from 'react-hot-toast';
import { TextField, Button, Box, Typography, Paper, 
  Snackbar, Alert } from '@mui/material';
  import { MdFingerprint } from "react-icons/md";
  import { useState } from 'react';
  import { motion ,  useMotionValue, useTransform } from "framer-motion"
  import Backdrop from '@mui/material/Backdrop';

  import LoadingAnimation from '../loader/loading_animation.json'




const SmsSent = () => {
    const [otp, setOtp] = useState('')
    const [done, setDone] = useState(false)
    const [openLoad, setOpenLoad] = useState(false);
    const [openOtpInvalid, setopenOtpInvalid] = useState(false)
    const [loading, setloading] = useState(false)
    const [isSeenPassWord, setisSeenPassWord] = useState(false)
    const navigate = useNavigate()



    const {
      companySettings
     } = useApplicationSettings()
   
    

     const {company_name, contact_info, email_info, logo_preview} = companySettings

     const handleGoBack = (e)=> {
        e.preventDefault()
        // navigate(-1)
      }
      


      


     const handleVerifyOtp = async (e) => {
 

        e.preventDefault()
        
      try {
        setloading(true)
        setOpenLoad(true)
        setDone(false)
        const users = await fetch('api/otp-verification', {
          method: "POST",
          headers: {
      
            "Content-Type": "application/json",
          }, 
          credentials: 'include', // Include cookies in the request
      
      
          body: JSON.stringify({...signinFormData, otp, phone}),
      
        },
      
      
      
        )
        
      
      
        let  actualUserDataInJson = await users.json()
      
        if (users.ok) {
          // const actualUserDataInJson = await users.json
          setloading(false)
        console.log(actualUserDataInJson)
        localStorage.setItem('acha umbwakni', true);
        setTimeout(() => {
          setDone(true);
          setloading(false);
          setTimeout(() => {
            navigate('/admin/dashboard')
          }, 1000);
        }, 1900);
    
    
    
    
      
      // return redirect('/signin')
         
      
        } else {
            setloading(false)
            console.log('sigup  failed')
            // setopenOtpInvalid(true)
            if (navigator.onLine) {
              toaster.error('invalid one time password,try again')
            }
         
        }   
    
      } catch (error) {
        console.error(error);
        setloading(false)
      }
      }
    
    


  const defaultOptions = {
    loop: true,
    autoplay: true, 
    animationData: LoadingAnimation,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  };




  return (

    <>




{loading &&    <Backdrop open={openLoad} sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
  
  <Lottie className='relative z-50' options={defaultOptions} height={400} width={400} />
    
     </Backdrop>
  }

  
  
   



    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="min-h-screen flex items-center 
      justify-center sm:flex-row flex-col  bg-gradient-to-br from-emerald-50 
      to-white dark:from-gray-900 dark:to-gray-800"
    >
      <div className="w-full max-w-md p-8">
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          className="bg-white dark:bg-gray-800
           rounded-2xl max-sm:mt-[200px] shadow-xl p-8 text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300, delay: 0.2 }}
            className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <FaPhone className="text-3xl text-emerald-600 dark:text-emerald-400" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-2xl font-bold text-gray-900 dark:text-white mb-4"
          >
            SMS Sent Successfully!
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-gray-600 dark:text-gray-300 mb-8"
          >
            We've sent a verification code to your phone number. Please check your messages and enter the code to proceed.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="space-y-4"
          >
            <Link
              to="/signin"
              className="flex items-center justify-center space-x-2 w-full py-3 px-4 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors duration-200"
            >
              <RiArrowGoBackFill className="text-xl" />
              <span>Back to Sign In</span>
            </Link>

            {/* <p className="text-sm text-gray-500 dark:text-gray-400">
              Didn't receive the code?{' '}
              <button className="text-emerald-600 hover:text-emerald-500 font-medium">
                Resend SMS
              </button>
            </p> */}
          </motion.div>
        </motion.div>
      </div>



  <div className="flex flex-col items-center justify-center  px-4">
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md"
    >
      {/* Logo Section */}
      <motion.div 
        className="flex flex-col items-center mb-8"
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
      
        <h1 className="mt-4 text-3xl font-bold text-gray-900 dark:text-white">
          {company_name}
        </h1>
      </motion.div>
       {/* OTP Card */}
       <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 backdrop-blur-lg"
      >
        <h2 className="text-xl font-semibold text-center text-gray-900 dark:text-white mb-6">
          Enter Verification Code
        </h2>

        <form onSubmit={handleVerifyOtp} className="space-y-6">
          {/* OTP Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Enter the code we sent you
            </label>
            <div className="relative">
              <motion.input
              whileTap={{ scale: 1.05 }}
                whileFocus={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
                type={isSeenPassWord ? 'password' : 'text'}
                value={otp}
                onChange={(e) => {
                  setOtp(e.target.value)
                }}
                className="w-full px-4 py-3 text-center text-2xl tracking-widest 
                  bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 
                  dark:border-gray-600 rounded-xl focus:ring-2 
                  focus:ring-emerald-500 focus:border-transparent
                  transition-all duration-200
                  text-black dark:text-white"
                maxLength="6"
                placeholder="••••••"
                />
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={() => setisSeenPassWord(!isSeenPassWord)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 
                    text-gray-400 hover:text-gray-600 dark:text-gray-500 
                    dark:hover:text-gray-300"
                >
                  <ion-icon 
                    name={isSeenPassWord ? "eye-outline" : "eye-off-outline"}
                    className="w-6 h-6"
                  />
                </motion.button>
              </div>
            </div>
  
            {/* Verify Button */}
            <motion.button
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full py-3 px-4 bg-emerald-500 hover:bg-emerald-600 
                text-white font-medium rounded-xl shadow-lg 
                hover:shadow-emerald-500/25 transition-all duration-200
                focus:outline-none focus:ring-2 focus:ring-emerald-500 
                focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <img 
                    src="/images/logo/iconsreload2.png" 
                    className="w-5 h-5 animate-spin" 
                    alt="loading" 
                  />
                  <span>Verifying...</span>
                  </div>
            ) : 'Verify Code'}
          </motion.button>

          {/* Back Button */}
          <motion.button
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={handleGoBack}
            className="w-full flex items-center justify-center space-x-2 
              py-3 px-4 bg-gray-100 dark:bg-gray-700 text-gray-700 
              dark:text-gray-200 font-medium rounded-xl hover:bg-gray-200 
              dark:hover:bg-gray-600 transition-all duration-200"
          >
            <RiArrowGoBackFill className="w-5 h-5" />
            <span>Go Back</span>
          </motion.button>
        </form>
      </motion.div>
    </motion.div>
  </div>
    </motion.div>


    </>
  );
};

export default SmsSent;