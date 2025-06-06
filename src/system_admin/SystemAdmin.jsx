
import {  ThemeProvider } from '@mui/material';
import { useApplicationSettings } from '../settings/ApplicationSettings';
import { IoKeyOutline, IoLockClosedOutline } from "react-icons/io5";
import Backdrop from '@mui/material/Backdrop';
// import LoadingAnimation from '../animation/loading_animation.json'
import Lottie from 'react-lottie';
import {useState, useCallback, useEffect,useMemo} from 'react'
import { MdOutlineMarkEmailRead } from "react-icons/md";
import toast, { Toaster } from 'react-hot-toast';
import {useNavigate} from 'react-router-dom'
import { MdOutlinePhonePaused } from "react-icons/md";


const SystemAdminLogin = () => {
  const [loading, setloading] = useState(false)
  const [success, setSuccess] = useState(false)
  
  const [phoneNumberVerified, setPhoneNumberVerified] = useState(false)
  const [emailVerified, setEmailVerified] = useState(false)

  const {formData, setFormDataSystemAdmin, setLoginWithPasskey, setUseEmailAuthentication,
     setUsePhoneNumberAuthentication, useEmailAuthentication, usePhoneNumberAuthentication,
     loginWithPasskey
    } = useApplicationSettings()


    const [openLoad, setOpenLoad] = useState(false);
    
  const navigate = useNavigate()



  const {password, phone_number, email} = formData
  const handleChange = (e) => {
    setFormDataSystemAdmin({ ...formData, [e.target.name]: e.target.value })
  }


  const subdomain = window.location.hostname.split('.')[0]; // 






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
  
  
  const subdomain_aitechs = window.location.host

  
  // /webauthn/register_system_admin
  // /webauthn/verify-system-admin
  
  async function authenticateWebAuthn(email, phone_number) {
    // e.preventDefault();
    setOpenLoad(true);
  
    try {
      const response = await fetch('/api/webauthn/authenticate_webauthn_login_system_admin', {
        method: 'POST',
        

        headers: { 'Content-Type': 'application/json' ,
          'X-Subdomain': subdomain, 
        'X-Subdomain-Aitechs': subdomain_aitechs,
        },
        body: JSON.stringify({email,phone_number})
      });
  
      const options = await response.json();
      const challenge = options.challenge;
  
  try {
    if (response.ok) {
      setOpenLoad(false)
  
  
  
  
  } else {
      
        setOpenLoad(false)
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
  
  
  
  
      const createResponse = await fetch('/api/webauthn/verify_webauthn_login_system_admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' ,
          'X-Subdomain': subdomain, 
          'X-Subdomain-Aitechs': subdomain_aitechs,
        },
        body: JSON.stringify({ credential:credentialJson,
          email,phone_number,
            })
      });
  
  const newData = await createResponse.json()
  
      if (createResponse.ok ) {
        setOpenLoad(false);
        
      navigate('/system-admin-dashboard')
     
  
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
        setOpenLoad(false);
  toast.error(newData.error, {
    duration: 6000,
    position: "top-center",
  })
        console.log(`passkey error =>${newData.error}`)
      }
    } catch (err) {
      toast.error('something went wrong', {
        duration: 8000,
        position: "top-center",
      })
      setOpenLoad(false);
      console.error('Error during WebAuthn credential creation:', err);
    }
  }catch (err) {
      toast.error('something went wrong', {
        duration: 8000,
        position: "top-center",
      })
      setOpenLoad(false);
      console.error('Error during WebAuthn credential creation:', err);
    }
  }








const isEmailVerified = useCallback(
  async(email) => {
    // const my_email = localStorage.getItem('phone_number')
    const response = await fetch(`/api/email_verified?email=${email}`, {
      method: 'GET',
      headers: {
        'X-Subdomain': subdomain,
      },
      
    })


    const newData = await response.json()
    try {
      if (response.ok){

        setEmailVerified(newData.email_verified)
      }else{
        toast.error('Something went wrong with geting email verification status', {
          duration: 7000,
          position: 'top-center',
        })
      }
      
    } catch (error) {
      toast.error('internal server error something went wrong with geting email verification status', {
        duration: 7000,
        position: 'top-center',
      })
    }
  },
  [],
)
 


// useEffect(() => {
//   isEmailVerified()
// }, [isEmailVerified]);

  const isPhoneNumberVerified = useCallback(
    async(phone_number) => {
      const phone_number2 = localStorage.getItem('phone_number')

      const response = await fetch(`/api/phone_number_verified?phone_number=${phone_number} &phone_number2=${phone_number2}`, {
        method: 'GET',
        headers: {
          'X-Subdomain': subdomain,
        },
      })
  
      try {
        if (response.ok) {
          const newData = await response.json()
          setPhoneNumberVerified(newData.sms_verified)
        } else {
          toast.error('Something went wrong with geting phone number verification status', {
            duration: 4000,
            position: 'top-center',
          })
        }
      } catch (error) {
        toast.error('internal server error something went wrong with geting phone number verification status', {
          duration: 4000,
          position: 'top-center',
        })
      }
  
    },
    [],
  )
  
  
  // useEffect(() => {
  //   isPhoneNumberVerified()
  // }, [isPhoneNumberVerified]);
  





const systemAdminLogin = async(e) => {
  e.preventDefault()
  setloading(true)


  try {
    const response = await fetch('/api/system-admin-login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Subdomain': subdomain,
      },
      body: JSON.stringify({
        password: password,
        phone_number: phone_number,
        email: email
        
      }),
    })

    if (response.ok) {
      setSuccess(true)
      setloading(false)
      localStorage.setItem('phone_number', phone_number);
      localStorage.setItem('email', email);
      isPhoneNumberVerified(phone_number)
      isEmailVerified(email)

      if(loginWithPasskey){
        authenticateWebAuthn(email, phone_number)

      }

      if  (usePhoneNumberAuthentication){

    
      if (phoneNumberVerified) {
        navigate('/system-admin-dashboard')
      } else {
        navigate('/sms-sent')
      }
    }else if(useEmailAuthentication == true || useEmailAuthentication == 'true'){
      // email-sent
      navigate('/email-sent')
      // navigate('/system-admin-dashboard')
    }else{
      navigate('/system-admin-dashboard')
    }
      
    } else {
      setloading(false)
      toast.error('Something went wrong', {
        duration: 3000,
        position: 'top-center',
      })


const newData = await response.json()
      toast.error(newData.error, {
        duration: 3000,
        position: 'top-center',
      })
    }
  } catch (error) {
    setloading(false)
    toast.error('internal server error something went wrong', {
      duration: 3000,
      position: 'top-center',
    })
  }
}






  const getSystemAdminSettings = useCallback(
    async() => {
      try {
        const response = await fetch('/api/get_system_admin_settings');
        const data = await response.json();
        if (response.ok) {
          const { login_with_passkey } = data[0]
          setLoginWithPasskey(login_with_passkey);
   
        setUseEmailAuthentication(data[0].use_email_authentication)
         setUsePhoneNumberAuthentication(data[0].use_sms_authentication)
        }
      } catch (error) {
        console.error('Error fetching login with passkey:', error);
      }
    },
    [],
  )
  



useEffect(() => {
  getSystemAdminSettings()
}, [getSystemAdminSettings]);


  return (

    <>

<Toaster />
<div className=" p-4 ">
      <div className=" flex justify-center items-center h-screen">
        <div className="dark:bg-gray-800 bg-white w-full max-w-md rounded-2xl 
        shadow-lg p-6 ">
          <h2 className="text-3xl font-bold text-gray-900
           dark:text-white mb-6 roboto-condensed">
          System Admin
          </h2>
          
          <form className="space-y-6" onSubmit={systemAdminLogin}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 
                dark:text-gray-200 mb-2 ">
                Phone Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MdOutlinePhonePaused className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="phone_number"
                    value={phone_number}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl 
                      focus:ring-2 focus:ring-green-500 focus:border-green-500
                      dark:bg-gray-700 dark:border-gray-600 dark:text-white
                      transition duration-150 ease-in-out"
                    placeholder="Enter Phone Number"
                  />



                  
                </div>


                
              </div>
  




              <div>
                <label className="block text-sm font-medium text-gray-700 
                dark:text-gray-200 mb-2 ">
                Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MdOutlineMarkEmailRead className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={email}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl 
                      focus:ring-2 focus:ring-green-500 focus:border-green-500
                      dark:bg-gray-700 dark:border-gray-600 dark:text-white
                      transition duration-150 ease-in-out"
                    placeholder="Enter Email"
                  />



                  
                </div>


                
              </div>
  
     <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <IoLockClosedOutline className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    name="password"
                    value={password}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl
                      focus:ring-2 focus:ring-green-500 focus:border-green-500
                      dark:bg-gray-700 dark:border-gray-600 dark:text-white
                      transition duration-150 ease-in-out"
                    placeholder="Enter Your Password"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-xl
                text-sm font-medium text-white bg-green-600 hover:bg-green-700
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500
                transition duration-150 ease-in-out
                ${loading ? 'opacity-50 cursor-not-allowed' : ''}
                ${success ? 'bg-green-600 hover:bg-green-700' : ''}`}
            >
              {loading ? (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg"
                 fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                   strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 
                  0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 
                  7.938l3-2.647z"></path>
                </svg>
              ) : success ? (
                'Login Successful!'
              ) : (
                'Login'
              )}
            </button>
          </form>

          <p className="mt-6 text-sm text-black
           dark:text-white">
           Login And Start Managing Your ISP Customers
          </p>
        </div>
      </div>
    </div>

    </>
  )
}



export default SystemAdminLogin

