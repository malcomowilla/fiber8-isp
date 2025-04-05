import { RiArrowGoBackFill } from "react-icons/ri";
import {Link, useNavigate, useParams, useLocation} from 'react-router-dom'
import {useState, useEffect, useCallback} from 'react'
import Lottie from 'react-lottie';
import LoadingAnimation from '../loader/loading_animation.json'
import Backdrop from '@mui/material/Backdrop';
import AnimationDone from '../loader/done_tick-animtation.json'
import {useApplicationSettings} from '../settings/ApplicationSettings'
import { motion } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';
import { Button, TextField, CircularProgress } from "@mui/material";





const ConfirmResetPassword = () => {

    const navigate = useNavigate()
    
    // const { token } = useParams();
    const { search } = useLocation()
    const token = new URLSearchParams(search).get('token');
    const {
    
       companySettings, setcompanySettings } = useApplicationSettings()
  

    const {company_name, contact_info, email_info, logo_preview} = companySettings

    const [loading, setloading] = useState(false)
    const [password, setPassword] = useState('')
    const [password_confirmation, setpassword_confirmation] = useState('')


const [isSeenPassWord,  setIsSeenPassword] = useState(false)
const [isSeenPassWord2,  setIsSeenPassword2] = useState(false)
const [openConfirmationAlert, setopenConfirmationAlert] = useState(false)
const [passwordConfirmationError, setpasswordConfirmationError] = useState('')
const [seepasswordConfirmationError, setseepasswordConfirmationError] = useState(false)
const [expiredPassword, setexpiredPassword] = useState('')
const [seexpiredPassword, setseeexpiredPassword] = useState(false)
const [passwordError, setpasswordError] = useState('')
const [seepasswordError, setseepasswordError] = useState(false)
const [passwordSuccesful, setpasswordSuccesful] = useState('')
const [seepasswordSuccesful, setseepasswordSuccesful] = useState(false)
const [openPasswordSuccess, setopenPasswordSuccess] = useState(false)
const [done, setDone] = useState(false)
const [openLoad, setOpenLoad] = useState(false);
const [openexpiredAlert, setopenexpiredAlert] = useState(false)
const [openFailedPasswordAlert, setopenFailedPasswordAlert] = useState(false)











    const handleGoBack = ()=> {
        navigate(-1)
    }
   






      const handleResetPassword = async(e)=> {
        e.preventDefault()
        try {
          setloading(true)
          setOpenLoad(true)
          const response = await fetch('api/password_reset', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              password,
              password_confirmation,
              token,

            })
            
          })

          const newData = await response.json()
              if (response.ok) {

                setseepasswordConfirmationError(false)
                setseeexpiredPassword(false)
                setseepasswordError(false)
                setseepasswordSuccesful(true)
                setpasswordSuccesful(newData.message)
                setloading(false)
                setopenPasswordSuccess(true)
                setTimeout(() => {
                  setDone(true)

                  setTimeout(() => {

                    navigate('/signin')
                    
                  }, 2000);
                   
                  
                }, 3000);



               


              } else {
                toast.error(newData.error, {
                  duration: 4000,
                  position: 'top-center',
                })
                setloading(false)
                setopenConfirmationAlert(true)
                setseepasswordConfirmationError(true)
                setseeexpiredPassword(true)
                setseepasswordError(true)
                setopenexpiredAlert(true)
                setopenFailedPasswordAlert(true)
                setpasswordConfirmationError(newData.error)
                setseepasswordSuccesful(false)
                setexpiredPassword(newData.error)
                setpasswordError(newData.error)
              }
        } catch (error) {
          setloading(false)
          setseeexpiredPassword(false)
          setseepasswordSuccesful(false)
          setseepasswordConfirmationError(false)
          setseepasswordError(false)
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

  const defaultOptions2 = {
    loop: true,
    autoplay: true, 
    animationData: AnimationDone,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: "spring",
        damping: 20,
        stiffness: 100
      }
    }
  };







  const handleGetCompanySettings = useCallback(
    async(abortController) => {
      try {
        const response = await fetch('/api/get_company_settings', {
          signal: abortController.signal // Add the abort signal to the fetch
        })
        const newData = await response.json()
        if (response.ok) {
          // setcompanySettings(newData)
  
          const { contact_info, company_name, email_info, logo_url } = newData
          setcompanySettings((prevData)=> ({...prevData, 
            contact_info, company_name, email_info,
          
            logo_preview: logo_url
          }))
  
          console.log('company settings fetched', newData)
        }else{
          console.log('failed to fetch company settings')
        }
      } catch (error) {
        if (error.name === 'AbortError') {
          console.log('Fetch aborted')
        } else {
          console.log("error fetching company settings", error)
        }
      }
    },
    [setcompanySettings],
  )
  
  useEffect(() => {
    const abortController = new AbortController()
    
    handleGetCompanySettings(abortController)
    
    return () => {
      // This cleanup function runs when component unmounts
      abortController.abort()
    }
  }, [handleGetCompanySettings])
  
  











  return (
    <>
   < Toaster />

{loading &&    <Backdrop open={openLoad} sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
  
  <Lottie className='relative z-50' options={defaultOptions} height={400} width={400} />
    
     </Backdrop>
  }
  
  {done  &&  <Backdrop open={openLoad} sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
    
    <Lottie className='relative z-50' options={defaultOptions2} 
    height={400} width={400} />
      
       </Backdrop> }

    <motion.section
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen bg-gradient-to-br 
        bg-white"
    >
      <div className="container mx-auto px-4 py-8 min-h-screen flex
       items-center justify-center">
        <motion.div 
          variants={itemVariants}
          className="w-full max-w-md space-y-8"
        >
          {/* Logo Section */}
          <motion.div 
            className="text-center space-y-4"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
         



            <img
  className="mx-auto h-20 w-20 rounded-full shadow-lg ring-4
               ring-emerald-50"
  src={logo_preview || "/images/aitechs.png"}
  alt={company_name || "Aitechs"}
  onError={(e) => { e.target.src = "/images/aitechs.png"; }}
/>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Reset Your Password
            </h2>
          </motion.div>

          {/* Form Section */}
          <motion.div 
            variants={itemVariants}
            className="bg-white dark:bg-gray-800 px-6 py-8 rounded-2xl shadow-xl 
              space-y-6 backdrop-blur-xl backdrop-filter"
          >
            <form onSubmit={handleResetPassword} className="space-y-6">
              {/* Password Input */}
              <motion.div variants={itemVariants}>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  New Password
                </label>
                <div className="relative mt-1">
                  <input
                    type={isSeenPassWord ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 
                      dark:border-gray-700 bg-white/50 dark:bg-gray-900/50
                      focus:ring-2 focus:ring-emerald-500 focus:border-transparent
                      transition-all duration-200"
                  />
                  <button
                    type="button"
                    onClick={() => setIsSeenPassword(!isSeenPassWord)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2"
                  >
                    <ion-icon 
                      name={isSeenPassWord ? "eye-outline" : "eye-off-outline"}
                      style={{ width: 20, height: 20 }}
                    />
                  </button>
                </div>
              </motion.div>

              {/* Confirm Password Input */}
              <motion.div variants={itemVariants}>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  Confirm Password
                </label>
                <div className="relative mt-1">
                  <input
                    type={isSeenPassWord2 ? 'text' : 'password'}
                    value={password_confirmation}
                    onChange={(e) => setpassword_confirmation(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 
                      dark:border-gray-700 bg-white/50 dark:bg-gray-900/50
                      focus:ring-2 focus:ring-emerald-500 focus:border-transparent
                      transition-all duration-200"
                  />
                  <button
                    type="button"
                    onClick={() => setIsSeenPassword2(!isSeenPassWord2)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2"
                  >
                    <ion-icon 
                      name={isSeenPassWord2 ? "eye-outline" : "eye-off-outline"}
                      style={{ width: 20, height: 20 }}
                    />
                  </button>
                </div>
              </motion.div>

              {/* Action Buttons */}
              <motion.div variants={itemVariants} className="space-y-4 pt-4">
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 bg-blue-600 text-white font-medium 
                    rounded-xl shadow-lg hover:bg-blue-700 
                    hover:shadow-blue-500/25 transition-all duration-200
                    focus:outline-none focus:ring-2 focus:ring-blue-500 
                    focus:ring-offset-2 disabled:opacity-50 flex items-center 
                    justify-center space-x-2"
                >
                   {loading ? (
                    <CircularProgress size={24} className="text-white" />
                  ) : (
                    "Reset Password"
                  )}
                </motion.button>

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
              </motion.div>
            </form>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
        
    
    </>
  )
}

export default ConfirmResetPassword

