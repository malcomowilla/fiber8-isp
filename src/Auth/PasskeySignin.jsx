import {Link, useNavigate,  useParams, useLocation} from  'react-router-dom'
import {useState, useEffect, useCallback} from 'react'

import { motion ,  useMotionValue, useTransform } from "framer-motion"

import {useApplicationSettings} from '../settings/ApplicationSettings'
import { IoArrowUndoSharp } from "react-icons/io5";
import { FaRegUser } from "react-icons/fa";
import toast, { Toaster } from 'react-hot-toast';

import Lottie from 'react-lottie';
import Backdrop from '@mui/material/Backdrop';
import { RiArrowGoBackFill } from "react-icons/ri";
import { MdFingerprint } from "react-icons/md";
import LoadingAnimation from '../loader/loading_animation.json'






const PasskeySignin = () => {

  const { setPhone, phone, isloading,
    
 
    } = useApplicationSettings()






  const navigate = useNavigate()
const goBack = useNavigate()
  const [done, setDone] = useState(false)
const [seeError, setSeeError] = useState(false)
const [loading, setloading] = useState(false)
const [openLoad, setOpenLoad] = useState(false);

const app_theme = localStorage.getItem('theme_normal')

  const adminWebAuthData = {
    email: '',
    user_name: '',
    phone_number: '' 
  }



  const [registrationError,  setRegistrationError] = useState('')

const [errorMessage, setErrorMessage] = useState(null)
const [seeErrorMessage, setSeeErrorMessage] = useState(false)
  
const { search } = useLocation()
const [webAuth, setWebAuth] = useState(adminWebAuthData)
const my_user_name = new URLSearchParams(search).get('my_user_name');


const {email, user_name, phone_number} = webAuth


const handleChange = (e) => { 


  const {name, value} =  e.target
  setWebAuth((prevData) => (
    {...prevData, [name]: value}
  ))



}
const handleGoBack = (e)=> {
  e.preventDefault()
  goBack(-1)
}

// api/login-admin

// https://quality-smile-garbabe-collection-backend-1jcd.onrender.com/login-admin




const defaultOptions = {
  loop: true,
  autoplay: true, 
  animationData: LoadingAnimation,
  rendererSettings: {
    preserveAspectRatio: 'xMidYMid slice'
  }
};



function arrayBufferToBase64Url(buffer) {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\//g, '_').replace(/\+/g, '-').replace(/=+$/, '');
}


const controller = new AbortController();
const timeoutDuration = 12000; // 12 seconds
const timeoutId = setTimeout(() => {
  controller.abort();
  setOpenLoad(false);
 
}, timeoutDuration);

function base64UrlToUint8Array(base64Url) {
  const padding = '='.repeat((4 - base64Url.length % 4) % 4);
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/') + padding;
  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}





async function authenticateWebAuthn(e) {
  e.preventDefault();
  setOpenLoad(true);
  setDone(false);
  setSeeError(false);

  try {
    const response = await fetch('/api/webauthn/authenticate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,  
      body: JSON.stringify({  my_user_name, email, user_name, phone_number})
    });

    clearTimeout(timeoutId);
    const options = await response.json();
    const challenge = options.challenge;

try {
  if (response.ok) {
    setOpenLoad(false)
    setSeeError(false)
setDone(false)




setSeeError(false)
} else {
      setRegistrationError(options.error)
      setSeeError(true)
      setOpenLoad(false)
      setDone(false);
}
} catch (error) {
  toast.error('something went wrong', {
    duration: 8000,
    position: "top-center",
  })
}

   


 


  const publicKey = {
    ...options,
    challenge: base64UrlToUint8Array(options.challenge),
    allowCredentials: options.allowCredentials.map(cred => ({
      ...cred,
      id: base64UrlToUint8Array(cred.id)
    }))
  };


  try {
    // const credentialSignin = await navigator.credentials.get({ publicKey: options });
    const credential = await navigator.credentials.get({ publicKey: publicKey });


    // Prepare the credential response
    const credentialJson = {
      id: credential.id,
      rawId: arrayBufferToBase64Url(credential.rawId),
      challenge: challenge,
      type: credential.type,
      response: {
        clientDataJSON: arrayBufferToBase64Url(credential.response.clientDataJSON),
        authenticatorData: arrayBufferToBase64Url(credential.response.authenticatorData),
        signature: arrayBufferToBase64Url(credential.response.signature),
        userHandle: arrayBufferToBase64Url(credential.response.userHandle)
      }


    };




    const createResponse = await fetch('/api/webauthn/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ credential:credentialJson,
        my_user_name,email,user_name,
          })
    });

const newData = await createResponse.json()

    if (createResponse.ok ) {
      setSeeError(false);
      setOpenLoad(false);
      
    navigate('/admin/analytics')
   

      // setTimeout(() => {
      //   // setDone(true);
      //   // setloading(false);
      //   setTimeout(() => {
      //     navigate('/admin/location')
      //   }, 1000);
      // }, 2500);
    } else {
      toast.error('something went wrong', {
        duration: 8000,
        position: "top-center",
      })
      // setRegistrationError(options.errors);
      setSeeError(true);
      setOpenLoad(false);
toast.error(newData.error, {
  duration: 6000,
  position: "top-center",
})
      console.log(`passkey error =>${newData.error}`)
    }
  } catch (err) {
    setSeeError(true);
    toast.error('something went wrong', {
      duration: 8000,
      position: "top-center",
    })
    setOpenLoad(false);
    console.error('Error during WebAuthn credential creation:', err);
  }
}catch (err) {
    setSeeError(true);
    toast.error('something went wrong', {
      duration: 8000,
      position: "top-center",
    })
    setOpenLoad(false);
    setErrorMessage(err.message)
    console.error('Error during WebAuthn credential creation:', err);
  }
}







  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.2
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
        damping: 15,
        stiffness: 100
      }
    }
  };




  return (
    <>

<Toaster position="top-center" />

    

      {isloading && (
        <Backdrop 
          open={openLoad} 
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        >
          <Lottie  height={400} width={400} />
        </Backdrop>
      )}
      
      {done && (
        <Backdrop 
          open={openLoad} 
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        >
          <Lottie options={defaultOptions} height={400} width={400} />
        </Backdrop>
      )}

      {seeErrorMessage && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 rounded-lg bg-red-50 text-red-600 text-sm"
        >
          {errorMessage}
        </motion.div>
      )}
      


      <motion.section
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="min-h-screen 
     relative"
      >


        <div className="flex flex-col items-center justify-center min-h-screen px-4">

      <div className='flex justify-center items-center w-full  '>
      <a href="#" className="flex items-center  text-2xl font-semibold text-gray-900 dark:text-white">
          <img className="w-40 h-40 rounded-full p-3" src="/images/fiber8logo1.png" alt="logo"  />
          
      </a>
      </div>
          <motion.div 
            variants={itemVariants}
            className="w-full max-w-md"
          >
            {/* Logo Section */}
            <motion.div 
              className="flex flex-col items-center mb-8"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {/* <img 
                className="w-40 h-40 rounded-2xl shadow-lg ring-4 ring-emerald-100 
                  dark:ring-emerald-900/20" 
                src={logo_preview} 
                alt={company_name}
              /> */}
              {/* <h1 className="mt-4 text-4xl font-bold bg-clip-text text-transparent 
                bg-gradient-to-r from-emerald-600 to-emerald-800">
                {company_name}
              </h1> */}
            </motion.div>

            {/* Passkey Card */}
            <motion.div
              variants={itemVariants}
              className="bg-white dark:bg-gray-800 dark:border-gray-700 backdrop-blur-xl rounded-3xl 
                shadow-xl p-8 border border-gray-100  mb-[200px]"
            >
              <h2 className="text-4xl font-semibold text-center font-montserat tex-black  mb-6 
                ">
                Sign in with Passkey
              </h2>

              <form onSubmit={authenticateWebAuthn} className="space-y-6">
                {seeError && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 rounded-lg bg-red-50 text-red-600 text-sm"
                  >
                    {registrationError}
                  </motion.div>
                )}

                {/* Username Input */}
                <div className="space-y-2">
                  <label className="text-2xl font-medium text-white 
                    dark:text-gray-300">
                    Username
                  </label>
                  <motion.div 
                    className="relative"
                    whileFocus={{ scale: 1.02 }}
                  >
                    <input
                    value={user_name}
                    onChange={handleChange}
                    style={{
                      fontSize: '1.5rem'
                    }}
                      type="text"
                      name="user_name"
                      
                   
                      className="w-full px-4 py-3 pl-12 bg-white dark:bg-gray-700 
                        border-2 border-gray-200 dark:border-gray-600 rounded-xl
                        focus:ring-2 text-white
                        text-xl
                        focus:ring-emerald-500 focus:border-transparent
                        transition-all duration-200"
                      placeholder="Enter username"
                    />
                    <FaRegUser className="absolute left-4 top-1/2 transform 
                      -translate-y-1/2 text-gray-400 w-5 h-5" />
                  </motion.div>
                </div>

                    <div className='flex justify-center items-center '>
                    <p className='text-2xl dark:text-white font-montserat-light'>Or</p>
                    </div>
               



                    <div className="space-y-[-50px]">
                  <label className="text-2xl font-medium text-white 
                    dark:text-gray-300">
                    Email
                  </label>
                  <motion.div 
                    className="relative"
                    whileFocus={{ scale: 1.02 }}
                  >
                    <input
                    style={{
                      fontSize: '1.5rem'
                    }}
                      type="email"
                      name="email"
                      value={email}
                      onChange={handleChange}
                   
                      className="w-full px-4 py-3 pl-12 bg-white dark:bg-gray-700 
                        border-2 border-gray-200 dark:border-gray-600 rounded-xl
                        focus:ring-2 text-white
                        text-xl
                        focus:ring-emerald-500 focus:border-transparent
                        transition-all duration-200"
                      placeholder="Enter email"
                    />
                    <FaRegUser className="absolute left-4 top-1/2 transform 
                      -translate-y-1/2 text-gray-400 w-5 h-5" />
                  </motion.div>
                </div>

                {/* Action Buttons */}

                <div className='flex justify-center items-center '>
                <MdFingerprint className="text-4xl text-gray-600" />

                </div>
                <div className="space-y-4 pt-4">
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="w-full py-3 px-4 bg-black text-white font-medium 
                      rounded-xl shadow-lg hover:bg-emerald-700 
                      hover:shadow-emerald-500/25 transition-all duration-200
                      focus:outline-none focus:ring-2 focus:ring-emerald-500 
                      focus:ring-offset-2 disabled:opacity-50 
                      disabled:cursor-not-allowed flex items-center justify-center 
                      space-x-2"
                    disabled={isloading}
                  >
                    {isloading ? (
                      <>
                        <img 
                          src="/images/logo/iconsreload2.png" 
                          className="w-5 h-5 animate-spin" 
                          alt="loading" 
                        />
                        <span className='font-montserat-light'>Authenticating...
                        {/* <DotLottieReact
      src="https://lottie.host/8eb517c8-777a-4dc8-a5e8-f4fe52fa6708/6LMNWDVsrv.json"

      loop
      autoplay
    /> */}
                        </span>
                      </>
                    ) : (
                      <>
                        <span className='text-2xl text-white font-montserat-light'>Continue with Passkey</span>
                      </>
                    )}
                  </motion.button>

                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={handleGoBack}
                    className="w-full flex items-center justify-center space-x-2 
                      py-3 px-4 bg-gray-100 dark:bg-gray-700 text-gray-700 
                      dark:text-gray-200 font-medium rounded-xl 
                      hover:bg-gray-200 dark:hover:bg-gray-600 
                      transition-all duration-200"
                  >
                    <IoArrowUndoSharp className="w-20 h-20 dark:text-white" />
                    <span className='text-xl dark:text-white font-montserat-light'>Go Back</span>
                  </motion.button>
                </div>

                {/* Sign Up Link */}
                <motion.div 
                  variants={itemVariants}
                  className="text-center pt-4"
                >
                  {/* <Link 
                    to={`/kasspas-key?my_user_name=${user_name}`}
                    className="text-emerald-600 hover:text-emerald-700 
                      font-medium transition-colors"
                  >
                    Don't have a passkey? Set up now
                  </Link> */}
                </motion.div>
              </form>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>
    </>
  );
}

export default PasskeySignin
