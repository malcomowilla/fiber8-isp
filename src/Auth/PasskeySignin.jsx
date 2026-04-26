import {Link, useNavigate,  useParams, useLocation} from  'react-router-dom'
import {useState, useEffect, useCallback} from 'react'

import { motion} from "framer-motion"

import {useApplicationSettings} from '../settings/ApplicationSettings'
import { IoArrowUndoSharp } from "react-icons/io5";
import { FaRegUser } from "react-icons/fa";
import toast, { Toaster } from 'react-hot-toast';

import Lottie from 'react-lottie';
import Backdrop from '@mui/material/Backdrop';
import { MdFingerprint } from "react-icons/md";
import LoadingAnimation from '../loader/loading_animation.json'
import { TextField, InputAdornment,} from "@mui/material";
import { Email,} from '@mui/icons-material';






const PasskeySignin = () => {

  const { setPhone, phone, isloading,
    settingsformData, setWelcomeMessage,  setWelcome,
    companySettings,setCompanySettings
 
    } = useApplicationSettings()






  const navigate = useNavigate()
const goBack = useNavigate()
  const [done, setDone] = useState(false)
const [seeError, setSeeError] = useState(false)
const [loading, setloading] = useState(false)
const [openLoad, setOpenLoad] = useState(false);
const [loginError, setLoginError] = useState(false) 
const [uierror, setUiError] = useState(false)

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




const defaultOptions = {
  loop: true,
  autoplay: true, 
  animationData: LoadingAnimation,
  rendererSettings: {
    preserveAspectRatio: 'xMidYMid slice'
  }
};




const controller = new AbortController();
const timeoutDuration = 12000; // 12 seconds
const timeoutId = setTimeout(() => {
  controller.abort();
  setOpenLoad(false);
 
}, timeoutDuration);
const subdomain = window.location.hostname.split('.')[0]; 

const {company_name, contact_info, email_info, logo_preview} = companySettings


function arrayBufferToBase64Url(buffer) {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\//g, '_').replace(/\+/g, '-').replace(/=+$/, '');
}





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
        const { contact_info, company_name, email_info, logo_url,
          customer_support_phone_number,agent_email ,customer_support_email
         } = newData

        setCompanySettings((prevData)=> ({...prevData, 
          contact_info, company_name, email_info,
          customer_support_phone_number,agent_email ,customer_support_email,
        
          logo_preview: logo_url
        }))

      }else{
      }
    } catch (error) {
    
    }
  },
  [setCompanySettings, subdomain],
)

useEffect(() => {
  
  handleGetCompanySettings()
  
}, [handleGetCompanySettings])



async function authenticateWebAuthn(e) {
  e.preventDefault();
  setOpenLoad(true);
  setDone(false);
  setSeeError(false);

  try {
    const response = await fetch('/api/webauthn/authenticate', {
      method: 'POST',
      
      headers: { 'Content-Type': 'application/json',
        'X-Subdomain': subdomain,
       },
      body: JSON.stringify({  my_user_name, email, user_name, phone_number})
    });

    clearTimeout(timeoutId);
    const options = await response.json();
    const challenge = options.challenge;

try {


  if (response.status === 402) {
    setTimeout(() => {
      navigate('/license-expired')
     }, 1800);
    
  }



  if (response.status === 423) {
    setTimeout(() => {
     navigate('/account-locked')
    }, 1800); 
   }

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
  setUiError(true)
  toast.error('something went wrong', {
    duration: 6000,
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
    const credential = await navigator.credentials.get({ publicKey: publicKey });


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
      headers: { 'Content-Type': 'application/json',
        'X-Subdomain': subdomain,
       },
      body: JSON.stringify({ credential:credentialJson,
        my_user_name,email,user_name,
          })
    });

const newData = await createResponse.json()



if (createResponse.status === 402) {
  setTimeout(() => {
    navigate('/license-expired')
   }, 1800);
  
}


    if (createResponse.ok ) {
      setSeeError(false);
      setOpenLoad(false);
      
   

    navigate('/admin/analytics')

     
    } else {

      setUiError(true)

      toast.error('something went wrong', {
        duration: 5000,
        position: "top-center",
      })


      setSeeError(true);
      setOpenLoad(false);
toast.error(newData.error, {
  duration: 6000,
  position: "top-center",
})
    }
  } catch (err) {
    setSeeError(true);
      setUiError(true)

    toast.error('something went wrong', {
      duration: 8000,
      position: "top-center",
    })
    setOpenLoad(false);
  }
}catch (err) {
    setSeeError(true);
    toast.error('something went wrong', {
      duration: 8000,
      position: "top-center",
    })
    setOpenLoad(false);
    setErrorMessage(err.message)
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
    sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
  >
    <Lottie height={400} width={400} />
  </Backdrop>
)}

{done && (
  <Backdrop
    open={openLoad}
    sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
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
  className="min-h-screen flex items-center justify-center relative overflow-hidden"
>

<div className="absolute inset-0 z-0">
    <img
      src="/images/Telecommunications-Aitechs.jpg"

      alt="Network Background"
      className="w-full h-full object-cover"
    />
    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
  </div>


  <div className="flex flex-col items-center justify-center min-h-screen px-4">
    
    <motion.div
      variants={itemVariants}
      className="bg-white/10 backdrop-blur-md rounded-xl shadow-2xl p-8 border border-white/20"
    >
      <h2 className="text-2xl font-semibold text-center  text-white
       dark:text-white mb-6 roboto-condensed">
        Sign in with Passkey
      </h2>

      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center p-4 bg-blue-600/20 rounded-full">
        
<img
className="w-24 h-24 mx-auto rounded-full"
  src={logo_preview || "/images/aitechs.png"}
  alt={company_name || "Aitechs"}
  onError={(e) => { e.target.src = "/images/aitechs.png"; }}
/>
        </div>
        
      </div>

      <form onSubmit={authenticateWebAuthn} className="space-y-6">
        <div className="space-y-2">
          <label className="text-2xl font-medium text-white ">
            Username
          </label>
          <motion.div className="relative" whileFocus={{ scale: 1.02 }}>
           


<TextField
sx={{
  "& label.Mui-focused": {
    color: "white",
    fontSize: "16px",
  },
  "& .MuiOutlinedInput-root": {
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "white",
      borderWidth: "3px",
    },
    "&.Mui-focused fieldset": {
      borderColor: "black",
    },
  },
}}
              fullWidth
              label="Username"

              name="user_name"
              value={user_name}
              onChange={handleChange}
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                   <FaRegUser className="text-white" />
                  </InputAdornment>
                ),
              }}
              className="block w-full pl-10 myTextField pr-3 py-3 bg-white/5
               border border-white/20 rounded-lg text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"

            />
          </motion.div>
        </div>

        <div className="flex justify-center items-center">
          <p className="text-2xl text-white font-montserat-light">Or</p>
        </div>

        <div className="space-y-2">
          <label className="text-2xl font-medium text-white dark:text-gray-300">
            Email
          </label>
          <motion.div className="relative" whileFocus={{ scale: 1.02 }}>
           


<TextField

sx={{
  "& label.Mui-focused": {
    color: "white",
    fontSize: "16px",
  },
  "& .MuiOutlinedInput-root": {
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "white",
      borderWidth: "3px",
    },
    "&.Mui-focused fieldset": {
      borderColor: "black",
    },
  },
}}
              fullWidth
              label="Email"
              type="email"
name='email'
              value={email}
              onChange={handleChange}
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email className="text-white" />
                  </InputAdornment>
                ),
              }}
              className="block w-full pl-10 pr-3 py-3 bg-white/5 
              myTextField
              border border-white/20 rounded-lg text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"

            />

          </motion.div>
        </div>

        {/* Fingerprint Icon */}
        <div className="flex justify-center items-center">
          <MdFingerprint className="text-4xl text-white " />
        </div>

{uierror && (
    <div onClick={() => setUiError(false)}  className="flex items-center cursor-pointer p-4 mb-4 text-sm text-red-800
     rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
  <svg className="shrink-0 inline w-4 h-4 me-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" 
  fill="currentColor" viewBox="0 0 20 20">
    <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 
    1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
  </svg>
  <span className="sr-only">Info</span>
  <div>
    <span className="font-medium">something went wrong</span> 
  </div>
</div>
   )}
        {/* Action Buttons */}
        <div className="space-y-4 pt-4">
          <motion.button
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full py-3 px-4 bg-blue-500 text-white font-medium 
            rounded-xl shadow-lg hover:bg-gray-700 hover:shadow-gray-500/25 
            transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500
            focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center 
            justify-center space-x-2"
            disabled={isloading}
          >
            {isloading ? (
              <>
                <img
                  src="/images/logo/iconsreload2.png"
                  className="w-5 h-5 animate-spin"
                  alt="loading"
                />
                <span className="font-montserat-light">Authenticating...</span>
              </>
            ) : (
              <>
                <span className="text-2xl text-white font-montserat-light">
                  Continue with Passkey
                </span>
              </>
            )}
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={handleGoBack}
            className="w-full flex items-center justify-center space-x-2 py-3 px-4
             bg-blue-500 dark:text-gray-200 font-medium rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200"
          >
            <IoArrowUndoSharp className="w-5 h-5 dark:text-white" />
            <span className="text-xl dark:text-white font-montserat-light">
              Go Back
            </span>
          </motion.button>
        </div>
      </form>
    </motion.div>
  </div>
</motion.section>
    </>
  );
}

export default PasskeySignin
