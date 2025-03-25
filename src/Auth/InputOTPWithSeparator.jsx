import {Button} from '../components/ui/button'
import { ReloadIcon } from "@radix-ui/react-icons"
import {Link} from 'react-router-dom'
import {ApplicationContext} from '../context/ApplicationContext'
import {useNavigate} from 'react-router-dom'
import { useApplicationSettings } from '../settings/ApplicationSettings';
import {  Visibility, VisibilityOff } from "@mui/icons-material";


// import {
//   InputOTP,
//   InputOTPGroup,
//   InputOTPSeparator,
//   InputOTPSlot,
// } from "@/components/ui/input-otp"

import Loader from '../loader/Loader'
import { useContext, useState, useEffect, useCallback} from 'react'

import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import toast, { Toaster } from 'react-hot-toast';
import { IoKeyOutline } from "react-icons/io5";
import {
  TextField,
  Box,
  IconButton,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Modal,
  Typography,
} from '@mui/material';
import { motion } from 'framer-motion';
import { Email, Phone, Person, Business, Lock, Edit, Close } from '@mui/icons-material';





 function InputOTPWithSeparator() {

const { setCurrentUser, handleThemeSwitch   
} = useContext(ApplicationContext);


  const {settingsformData, setWelcomeMessage,  setWelcome,
    companySettings,setCompanySettings,
    adminSettings, setAdminSettings,
  }  = useApplicationSettings()
const navigate = useNavigate()
const [icon, setIcon] = useState()

  const [isSeen, setIsSeen] = useState(true)
  const [showErrors, setShowErrors] = useState(false)
  const [isPassword, setPassword] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setloading] = useState(false)
  const [error, setError] = useState('')
  const [offlineError, setOfflineError] = useState(false)
  const [done, setDone] = useState(false)
  const [seeError, setSeeError] = useState(false)
  const [openLoad, setOpenLoad] = useState(false);
  

  const [registrationError,  setRegistrationError] = useState('')

const [errorMessage, setErrorMessage] = useState(null)
const [seeErrorMessage, setSeeErrorMessage] = useState(false)
  
const [showPassword, setShowPassword] = useState(false);



  const {company_name, contact_info, email_info, logo_preview} = companySettings



  const { enable_2fa_for_admin_email, enable_2fa_for_admin_sms, send_password_via_sms,
    send_password_via_email, check_is_inactive,
    checkinactiveminutes, checkinactivehrs,checkinactivedays,
    enable_2fa_for_admin_passkeys
   }= adminSettings;


const formData = {
  email: email,
  password: isPassword,
  welcome_back_message: settingsformData.welcome_back_message
}


const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), 9000);




  const subdomain = window.location.hostname.split('.')[0];
const [logoUrl, setLogoUrl] = useState('')









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

           setLogoUrl(logo_url)
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
        console.log('internal servere error  while fetching company settings')
        // toast.error('internal servere error  while fetching company settings')
      
      }
    },
    [setCompanySettings, subdomain],
  )
  
  useEffect(() => {
    
    handleGetCompanySettings()
    
  }, [handleGetCompanySettings])






const getAdminSettings = useCallback(

  async() => {
    
    try {
      const customer_email = localStorage.getItem('customer_email')
      const response = await fetch(`/api/allow_get_admin_settings?admin_email=${customer_email}`, {
        headers: {
          'X-Subdomain': subdomain,
        },
      })
      const newData = await response.json()
      if (response.ok) {
        console.log('admin settings fetched', newData)
        const {enable_2fa_for_admin_email, enable_2fa_for_admin_sms, send_password_via_sms,
          send_password_via_email, check_is_inactive,
          enable_2fa_for_admin_passkeys,
          checkinactiveminutes, checkinactivehrs,checkinactivedays} = newData[0]
        setAdminSettings(prevData => ({
          ...prevData, 
          enable_2fa_for_admin_email, enable_2fa_for_admin_sms, send_password_via_sms,
          enable_2fa_for_admin_passkeys,
          send_password_via_email, check_is_inactive,
          checkinactiveminutes, checkinactivehrs,checkinactivedays
        }));
        console.log('admin settings fetched', newData)
      }else{

// toast.error(newData.error, {
// position: "top-center",
// duration: 5000,
// })

        // toast.error('failed to fetch admin settings', {
        //   position: "top-center",
        //   duration: 6000,
        // })
      }
    } catch (error) {
      // toast.error(`failed to fetch admin settings server error${error}`, {
      //   position: "top-center",
      //   duration: 4000,
      // })
    }
  },
  [setAdminSettings, subdomain],
)



useEffect(() => {
  getAdminSettings()
  
}, [getAdminSettings]);



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







async function authenticateWebAuthn(email) {
  setOpenLoad(true);
  setDone(false);
  setSeeError(false);

  try {
    const response = await fetch('/api/webauthn/authenticate', {
      method: 'POST',
      
      headers: { 'Content-Type': 'application/json',
        'X-Subdomain': subdomain,
       },
      // signal: controller.signal,  
      body: JSON.stringify({   email})
    });

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
      headers: { 'Content-Type': 'application/json',
        'X-Subdomain': subdomain,
       },
      body: JSON.stringify({ credential:credentialJson,
        email
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


const handleSignIn = async (e) => {
  


  e.preventDefault()
  // const response = await fetch('/api/csrf_token');
  // const { csrf_token } = await response.json();

  // console.log("CSRF Token:", csrf_token);

  try {

    setShowErrors(false)
  setOfflineError(false)
  setloading(true)

  const users = await fetch('/api/sign_in', {
    method: "POST",
    
    headers: {
      'X-Subdomain': subdomain,

      "Content-Type": "application/json",

    }, 
    signal: controller.signal,  

    // Authorization: `Bearer ${token}`,

    body: JSON.stringify(formData),

  },

  


  )

  clearTimeout(id);


  setloading(false)
  setOfflineError(false)

  let  actualUserDataInJson = await users.json()
  localStorage.setItem('customer_email', email)


  if (users.status === 423) {
   setTimeout(() => {
    navigate('/account-locked')
   }, 1800); 
  }
  // if (users.status === 401) {
  //   setOfflineError(false)

  // }

  if (actualUserDataInJson.redirect) {
    window.location.href = actualUserDataInJson.redirect; // Redirect manually
  }
  
  if (users.ok || users.status === 202) {
    
    // enable_2fa_for_admin_passkeys


if (enable_2fa_for_admin_passkeys) {
  authenticateWebAuthn(email)
} else {
  navigate('/admin/analytics')
  setEmail('')
  setPassword('')
}

    
  
    // setShowErrors(false)
    setloading(false)
   

    // setWelcomeMessage(actualUserDataInJson.welcome_back)
   
    
  //  setCurrentUser(actualUserDataInJson.user)

  //  setOfflineError(false)


  } else {
    setError(actualUserDataInJson.error);
   toast.error(actualUserDataInJson.error,{
    position: "top-right",
    duration: 7000,
   })

    setShowErrors(true)
  setCurrentUser([])
  setloading(false)


  }
  } catch (error) {
    toast.error('something went wrong internalserver eror', {
      position: "top-right",
      duration: 7000,
    })
    // console.log(error.name === 'AbortError');
    setloading(false);
    setOfflineError(true);


// setTimeout(() => {
//   setOfflineError(false)
// }, 8000);

  }

}



console.log("Logo Preview URL:", logo_preview);


  return (
<>
    
 <Toaster />

    



{/* 
    <main className=''>






    <section className="flex justify-center items-center">

  <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto h-screen lg:py-0
  
  ">




<div onClick={handleThemeSwitch} className='dark:text-white flex justify-center cursor-pointer'>
<ion-icon onClick={()=>setIcon(!icon)}  name={icon ? 'moon-outline' : 'sunny'} className='' size='large'></ion-icon>
</div>
<div className='text-center dotted-font'>
    <p className='dark:text-white mt-8 font-bold text-2xl '>Welcome To <span className='text-red-700'>
    
    {company_name}</span></p>
    </div>

      <a href="#" className="flex items-center mb-6 text-2xl font-semibold text-gray-900
       dark:text-white ">
          <img className="w-40 h-40 mr-2 rounded-full mt-20" src={logo_preview || '/images/aitechs.png'} alt="logo"  />

      </a>

      <div className="w-full p-6 bg-white rounded-lg shadow dark:border
       md:mt-0 sm:max-w-md dark:bg-gray-800 dark:border-gray-700 sm:p-8">
          <h2 className="mb-1 text-xl  leading-tight tracking-tight text-gray-900 
          md:text-2xl dotted-font 
           dark:text-white">
          Sign-In to your account and start managing your  network

          </h2>
          

          <form className="mt-4 space-y-4 lg:mt-5 md:space-y-5"   onSubmit={handleSignIn }>
              <div className=' flex  flex-col  relative '>
                <div className=''>
                <label  className="  text-sm font-mono text-gray-900 dark:text-white ">Your email</label>
                </div>
                 <div className='self-end  absolute p-8'>
                  <img src="/images/gmail.png" className=' ' alt="gmail" />

                  </div> 

                  <input value={email}  type="email" name="email" id="email" onChange={(e)=> setEmail(e.target.value)}  
                   className="bg-gray-50 border
                   border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600
                    block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600
                     dark:placeholder-gray-400 dark:text-white dark:focus:ring-red-500 dark:focus:border-red-500"
                      placeholder="" />
 
              </div>
              <div className='flex flex-col relative'>
                  <label  className="block mb-2 text-sm font-mono text-gray-900 dark:text-white"> Password</label>
                  <div className='absolute self-end p-9 dark:text-black' onClick={()=>setIsSeen(!isSeen)}>
                       <ion-icon name={isSeen ? "eye-outline" : "eye-off-outline"}></ion-icon>

                       </div>
                  <input value={isPassword} type={isSeen ? 'password' : 'text'} name="password" id="password" 
                    onChange={(e)=> {
setPassword(e.target.value)
                  }}
                   
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm
                     rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5
                      dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white
                      dark:focus:ring-red-500 dark:focus:border-red-500"
                       
                       
                       />
                      
 
              </div>
              <div>

                
              </div>
              <div className="flex flex-row  justify-between ">


<Link to='/passkey-signin' className='flex flex-row gap-2 cursor-pointer'>
                <IoKeyOutline className='w-5 h-5' />
                <p className='font-montserat-light'>passkey</p>
</Link>

                
 
                 
                  <div className="ml-3 text-sm 
                  flex justify-evenly flex-wrap lg:gap-20 max-md:gap-40 sm:gap-20 max-sm:gap-10 "> 
                   


                 <Link to='/reset-password'> <p className='text-sm  font-montserat-light'>Forgot your password?</p></Link>
                  </div>
              </div>
              <div className='flex items-center justify-center'>
              <Button variant='outline'  type='submit' className='dotted-font p-5' >Sign In
            <ReloadIcon className={`ml-2 h-4 w-4  ${loading ? 'animate-spin' : 'hidden'}  `} />

            </Button>
              </div>



<div>

</div>
          </form>

      </div>
  </div>
</section>


</main> */}




<main className="bg-gray-50 dark:bg-gray-900 min-h-screen flex items-center justify-center">
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md p-6"
      >
        <div className="text-center">
          <div onClick={handleThemeSwitch} className="dark:text-white flex justify-center cursor-pointer">
            <ion-icon
              name="moon-outline"
              size="large"
              className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
            ></ion-icon>
          </div>
          <p className="dark:text-white mt-4 font-bold text-2xl">
            Welcome To <span className=""> {company_name || 'Aitechs'}</span>
          </p>
        </div>

        <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <div className="text-center">
          <img
  className="w-[100px] h-[100px] mx-auto rounded-full"
  src={logo_preview || "/images/aitechs.png"}
  alt={company_name || "Aitechs"}
  onError={(e) => { e.target.src = "/images/aitechs.png"; }}
/>
          </div>

          <h2 className="mt-6 text-xl font-semibold text-gray-900 dark:text-white text-center">
            Sign in to your account
          </h2>

          <form onSubmit={handleSignIn} className="mt-6 space-y-6">
            {/* Email Field */}
            <TextField
              fullWidth
              label="Email"
              type="email"

              value={email}
              onChange={(e) => setEmail(e.target.value)}
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email className="text-gray-500" />
                  </InputAdornment>
                ),
              }}
              className="bg-gray-50 dark:bg-gray-700 rounded-lg myTextField"
            />

            {/* Password Field */}
            <TextField
              fullWidth
              label="Password"
              type={isSeen ? "text" : "password"}
              value={isPassword}
              onChange={(e) => setPassword(e.target.value)}
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock className="text-gray-500" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setIsSeen(!isSeen)}>
                      {isSeen ? (
                        <Visibility className="text-gray-500" />
                      ) : (
                        <VisibilityOff className="text-gray-500" />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              className="bg-gray-50 dark:bg-gray-700 rounded-lg myTextField"
            />

            {/* Forgot Password and Passkey Links */}
            <div className="flex gap-6 justify-center">

              <span className="text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400">
              <Link
                to="/reset-password"
                
              >
                Forgot password?
              </Link>
              </span>

              <span className='mx-2 text-gray-400'>|</span>

              <span className="flex items-center text-sm text-blue-600
               hover:text-blue-500 dark:text-blue-400">
              <Link
                to="/passkey-signin"
                
              >
                <IoKeyOutline className="mr-1" />
                Passkey
              </Link>
              </span>



            </div>

            {/* Sign In Button */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              className="bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition-all duration-300"
              disabled={loading}
            >
              {loading ? (
                <ReloadIcon className="animate-spin" />
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          {/* Additional Info */}
          {/* <p className="mt-6 text-sm text-center text-gray-600 dark:text-gray-400">
            New on our platform? Reach us at 0791568852 for a free trial!
          </p> */}
        </div>
      </motion.section>
    </main>





    </>
  )
}
export default  InputOTPWithSeparator