import {Link} from 'react-router-dom'
import {ApplicationContext} from '../context/ApplicationContext'
import {useNavigate} from 'react-router-dom'
import { useApplicationSettings } from '../settings/ApplicationSettings';


import { useContext, useState, useEffect, useCallback} from 'react'

import toast, { Toaster } from 'react-hot-toast';

import { motion } from 'framer-motion';
import { MdOutlineCancel } from "react-icons/md";





 function InputOTPWithSeparator() {

const { setCurrentUser, handleThemeSwitch   
} = useContext(ApplicationContext);


  const {settingsformData, setWelcomeMessage,  setWelcome,
    companySettings,setCompanySettings,
    adminSettings, setAdminSettings,
  }  = useApplicationSettings()
const navigate = useNavigate()
const [icon, setIcon] = useState()

  const [isSeen, setIsSeen] = useState(false)
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
const [loginError, setLoginError] = useState(false)
const [uierror, setUiError] = useState(false)



  const {company_name, contact_info, email_info, logo_preview} = companySettings



  const { enable_2fa_for_admin_email, enable_2fa_for_admin_sms, send_password_via_sms,
    send_password_via_email, check_is_inactive,
    checkinactiveminutes, checkinactivehrs,checkinactivedays,
    enable_2fa_google_auth,
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
          enable_2fa_google_auth,
          checkinactiveminutes, checkinactivehrs,checkinactivedays} = newData[0]
        setAdminSettings(prevData => ({
          ...prevData, 
          enable_2fa_for_admin_email, enable_2fa_for_admin_sms, send_password_via_sms,
          enable_2fa_for_admin_passkeys,
          enable_2fa_google_auth,
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
    duration: 5000,
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

    } else {
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
      duration: 5000,
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
    // signal: controller.signal,  

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


  if (users.status === 402) {
    setTimeout(() => {
      navigate('/license-expired')
     }, 1800);
    
  }


  if (actualUserDataInJson.redirect) {
    window.location.href = actualUserDataInJson.redirect; 
  }
  
  if (users.ok || users.status === 202) {
    


if (enable_2fa_for_admin_passkeys) {
  authenticateWebAuthn(email)

} else if (enable_2fa_google_auth) {
  // Redirect to 2FA with email
  navigate('/two-factor-auth', { 
    state: { email } 
  });
  
// } else if (enable_2fa_google_auth) {
 ''
}else{
 // navigate('/admin/analytics')
 navigate('/admin/analytics')
 // window.location.href='/admin/router-stats'
   setEmail('')
   setPassword('')
}

    
  
    setloading(false)
   



  } else {
    setError(actualUserDataInJson.error);
    setLoginError(true)
    setUiError(true)
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





  return (
<>
    
 <Toaster />

    


<main className="min-h-screen flex items-center justify-center relative overflow-hidden">
  {/* Network nodes animation */}
    <div className="absolute inset-0 z-0">
    <img
      src="/images/Telecommunications-Aitechs.jpg" // Replace with your image path
      alt="Network Background"
      className="w-full h-full object-cover"
    />
    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
  </div>


  {/*  */}

  <motion.section
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="w-full max-w-md p-6 z-10"
  >
    <div className="text-center mb-8">
      <div className="flex justify-center mb-6">
        {/* ISP Network Icon */}
        <svg 
          className="w-16 h-16 text-white" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
            d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
      <p className="text-white text-3xl font-bold">
        {company_name || 'Aitechs'} <span className="text-blue-300">Networks</span>
      </p>
      <p className="text-blue-200 mt-2">Secure ISP Management Portal</p>
    </div>

            {uierror && loginError && (
              <div onClick={() => {
                setUiError(false);
                setLoginError(false);
              }}  className="flex items-center 
              p-4 mb-4 text-sm text-red-800 cursor-pointer rounded-lg
               bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
  <svg className="shrink-0 inline w-4 h-4 me-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
   fill="currentColor" viewBox="0 0 20 20">
    <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0
     1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
  </svg>
  <span className="sr-only">Error:</span>
  <div className='flex gap-x-[175px]'>
    <span className="font-medium">{error}</span> 
    <span className="font-medium"><MdOutlineCancel className='w-5 h-5'/> </span> 
  </div>
</div>
            )}

    <div className="bg-white/10 backdrop-blur-md rounded-xl shadow-2xl p-8 border border-white/20">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center p-4 bg-blue-600/20 rounded-full">
          {/* Shield + Network icon */}
        
<img
className="w-24 h-24 mx-auto rounded-full"
  src={logo_preview || "/images/aitechs.png"}
  alt={company_name || "Aitechs"}
  onError={(e) => { e.target.src = "/images/aitechs.png"; }}
/>
        </div>
        <h2 className="mt-4 text-xl font-bold text-white">
          Network Operations Center
        </h2>
      </div>

      <form onSubmit={handleSignIn} className="space-y-6">
        {/* Email Field */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="block w-full pl-10 pr-3 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Network Admin Email"
            required
          />
        </div>

        {/* Password Field */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <input
            type={isSeen ? "text" : "password"}
            value={isPassword}
            onChange={(e) => setPassword(e.target.value)}
            className="block w-full pl-10 pr-3 py-3 bg-white/5 border border-white/20 
            rounded-lg text-white placeholder-blue-200 focus:outline-none focus:ring-2
             focus:ring-blue-500 focus:border-transparent"
            placeholder="Access Key"
            required
          />
          <button
            type="button"
            onClick={() => setIsSeen(!isSeen)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-blue-500 "
          >
            {isSeen ? (
              
               <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
              </svg>
            ) : (

<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>

             
            )}
          </button>
        </div>

        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={handleThemeSwitch}
            className="text-blue-300 hover:text-white flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {icon ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              )}
            </svg>
            {icon ? 'Night Mode' : 'Day Mode'}
          </button>

          <div className="text-sm">
            <Link to="/reset-password" className="text-blue-300 hover:text-white">
              Forgot Access Key?
            </Link>
          </div>
        </div>

        <button
          type="submit"
          className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300"
          disabled={loading}
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Authenticating...
            </>
          ) : (
            <>
              <svg className="-ml-1 mr-3 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
              Access Network Dashboard
            </>
          )}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-blue-200">
          <Link to='/passkey-signin' className="font-semibold text-white">
          Need passwordless access?  <span className="font-semibold text-white">
            sign in with passkey</span>

            </Link>
        </p>
      </div>
    </div>
  </motion.section>
</main>

    </>
  )
}
export default  InputOTPWithSeparator