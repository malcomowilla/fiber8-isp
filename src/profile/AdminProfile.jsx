import {useApplicationSettings} from '../settings/ApplicationSettings'
import {useState, useEffect} from 'react'
import { createAvatar } from '@dicebear/core';
  import { lorelei } from '@dicebear/collection';
  import toast, { Toaster } from 'react-hot-toast';
  import LoadingAnimation from '../loader/loading_animation.json'
import Lottie from 'react-lottie';
import {useNavigate} from 'react-router-dom'

import Backdrop from '@mui/material/Backdrop';
import { FiKey, FiShield, FiCheck } from 'react-icons/fi';
import { Tooltip } from '@mui/material';
import { useLocation } from 'react-router-dom';
import {
  LogOut,
 
} from "lucide-react"






const AdminProfile = () => {
  const {currentUser, setCurrentUser, currentUsername, currentEmail, setOpenDropDown} = useApplicationSettings()

  const location = useLocation();
  const navigate = useNavigate()

const [formData, setFormData] = useState({
  // password_confirmation: '',
  email: '',
  password: '',
  username: '',
  phone_number: '',
})
const [loading, setLoading] = useState(false)
const [openLoad, setOpenLoad] = useState(false)

const {email, password, username, phone_number} = formData
const [hasPasskey, setHasPasskey] = useState(false);
const [isRegistering, setIsRegistering] = useState(false);
const [registrationStatus, setRegistrationStatus] = useState('');






// if (location.pathname === '/admin/profile') {
//   setOpenDropDown(false)
  
// }

const subdomain = window.location.hostname.split('.')[0]










useEffect(() => {
  
  const fetchCurrentUser = async() => {
   try {
     const response = await fetch('/api/currently_logged_in_user', {
      headers: {
        'X-Subdomain': subdomain,
      },
     })
     const newData = await response.json()
     if (response) {
       console.log('fetched current user', newData)
       const {username, email, id, created_at, updated_at, phone_number} = newData
       setFormData({...formData, username, email, phone_number})
       console.log('current user', newData)
     }
   } catch (error) {
     toast.error('Something went wrong please try again failed to fetch profile', {
       duration: 7000,
       position: "top-center",
     });
   }
  }
  fetchCurrentUser()
 }, []);







  // update_profile
const handleChangeFormData = (e) => {
  const { type, name, checked, value } = e.target;
  setFormData((prevFormData) => ({
    ...prevFormData,
    [name]: type === "checkbox" ? checked : value,
  }));
};




const handleLogout = async () => {
  try {
      const response = await fetch('/api/logout', {
        method: "DELETE",
        credentials: 'include', // Include cookies in the request
        headers: {
          'X-Subdomain': subdomain,
        },

      },
      
      

      );
      if (response.ok) {

        setCurrentUser(null)
        navigate('/signin');
        
console.log(user)
      } else {
        throw new Error('Logout failed');
      }
    } catch (error) {
      console.error('Error logging out:', error);
     }
}

  const updateProfile = async(e) => {
    setOpenLoad(true)
    setLoading(true)
    e.preventDefault()
    const url = "/api/update_profile"
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        'X-Subdomain': subdomain,
      },
      credentials: 'include', // Include cookies in the request
      body: JSON.stringify(formData),
    })

    try {
      if (response.ok) {
        setOpenLoad(false)
        setLoading(false)
        const newData = await response.json()
        const {username, email,  phone_number} = newData
        setFormData({...formData, username, email, phone_number})
        console.log('updated profile', newData)
        toast.success("Profile updated successfully", {
          duration: 7000,
          position: "top-center",
        })
      } else {
        const newData = await response.json()
        setOpenLoad(false)
        setLoading(false)
        toast.error("Failed to update profile", {
          duration: 7000,
          position: "top-center",
        })

        toast.error(newData.error, {
          duration: 7000,
          position: "top-center",
        })
      }
    } catch (error) {
      setOpenLoad(false)
      setLoading(false)
      toast.error("something went wrong please try again", {
        duration: 7000,
        position: "top-center",
      })
    }
  }




  function generateAvatar(name) {
    const avatar = createAvatar(lorelei, {
      seed: name, // Use the customer's name as the seed
      // Customize options for the lorelei style
      backgroundColor: ['b6e3f4', 'c0aede', 'd1d4f9'], // Example: random background colors
      radius: 50, // Rounded corners
      size: 64, // Size of the avatar
    });
  
    // Generate the SVG as a data URL
    return `data:image/svg+xml;utf8,${encodeURIComponent(avatar.toString())}`;
  }




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

async function startPasskeyRegistration(e) {
  setIsRegistering(true);
  setRegistrationStatus('starting');
  
  e.preventDefault();

  const response = await fetch('/api/webauthn/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json',
      'X-Subdomain': subdomain,
     },
    body: JSON.stringify({  email:currentEmail })
  });

  const options = await response.json();
  setRegistrationStatus('authenticating');
  const challenge = options.challenge;

try {
if (response.ok) {
  setRegistrationStatus('authenticating');
  setTimeout(()=> {
    setIsRegistering(false)
  }, 3000);
  setOpenLoad(false);
  
  
} else {
  setOpenLoad(false);
  toast.error(options.error, {
    position: "top-center",
    duration: 7000,
  });
 

  setRegistrationStatus('error');
  setTimeout(() => {
    setIsRegistering(false)
  }, 3000);
  
  
}
} catch (error) {

  toast.error('something went wrong please try again', {
    position: "top-center",
    duration: 7000,
  });
setTimeout(() => {
  setIsRegistering(false)
}, 3000);

setTimeout(() => {
  setRegistrationStatus('starting');
}, 5000);


setRegistrationStatus('error');
  setOpenLoad(false);
}







  function base64UrlToBase64(base64Url) {
    return base64Url.replace(/_/g, '/').replace(/-/g, '+');
  }

  if (typeof options.user.id === 'string') {
    options.user.id = Uint8Array.from(atob(base64UrlToBase64(options.user.id)), c => c.charCodeAt(0));
  }

  if (typeof options.challenge === 'string') {
    options.challenge = Uint8Array.from(atob(base64UrlToBase64(options.challenge)), c => c.charCodeAt(0));
  }

  console.log('options.challenge:',options.challenge )

  try {
    const credential = await navigator.credentials.create({ publicKey: options });


    // Prepare the credential response
    const credentialJson = {
      id: credential.id,
      rp: {
        name: "fiber8",
      },
      // origin: 'http://localhost:5173',
      // origin: 'https://aitechs-sas-garbage-solution.onrender.com',
      rawId: arrayBufferToBase64Url(credential.rawId),
      type: credential.type,
      response: {
        attestationObject: arrayBufferToBase64Url(credential.response.attestationObject),
        clientDataJSON: arrayBufferToBase64Url(credential.response.clientDataJSON)
      },
      challenge: challenge

    };


    

    const createResponse = await fetch('/api/webauthn/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 
        'X-Subdomain': subdomain,
       },
      body: JSON.stringify({ credential: credentialJson, email: currentEmail})
    });

    const createResponseJson = await createResponse.json();


    if (createResponse.ok) {
     toast.success('passkey created successfully', {
        position: "top-center",
        duration: 7000,
      });
      console.log('signup success');
      // setsignupFormData('')
      setOpenLoad(false);
      // setisloading(false);
      setLoading(false)
      setHasPasskey(true);
      setTimeout(() => {
        setIsRegistering(false)
      }, 3000);
      setRegistrationStatus('success');
     

      
    } else {
      // setisloading(false);
      setLoading(false)
      toast.error(options.error, {
        position: "top-center",
        duration: 7000,
      });
      console.log('signup failed');
      // setOpen(false);
      // setRegistrationError(options.errors);
      setOpenLoad(false);
    }
  } catch (err) {
    // setisloading(false);
    setLoading(false)

    toast.error('something went wrong please try again', {
      position: "top-center",
      duration: 7000,
    });
    // setOpen(false);
    setOpenLoad(false);
    console.error('Error during WebAuthn credential creation:', err);
  }
}






  return (

<>
<Toaster />



{loading &&    <Backdrop open={openLoad} sx={{ color:'#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
  
  <Lottie className='relative z-50' options={defaultOptions} height={400} width={400} />
    
     </Backdrop>
  }
      <div className="mx-auto container max-w-2xl md:w-3/4 shadow-md rounded-lg ">
        <div className="bg-gray-100 p-4 border-t-2 bg-opacity-5 border-indigo-400 rounded-t">
          <div className="max-w-sm mx-auto md:w-full md:mx-0">
            <div className="inline-flex items-center space-x-4">
             
<img
                  className="w-12 h-12 rounded-full"
                  src={generateAvatar(currentUsername?.toString())}
                  alt={`${currentUsername?.toString()}'s avatar`}
                />

              <h1 className="text-gray-600 dark:text-white font-montserat">{currentUsername}</h1>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-black space-y-6">
        <form onSubmit={updateProfile}>

          <div className="md:inline-flex space-y-4 md:space-y-0 w-full p-4  dark:text-white items-center">
            <h2 className="md:w-1/3 max-w-sm mx-auto  font-montserat">Account</h2>
            <div className="md:w-2/3 max-w-sm mx-auto">
              <label className="text-sm  dark:text-white font-montserat-light text-gray-700">{currentEmail}</label>
              <div className="w-full inline-flex border">
                <div className="pt-2 w-1/12 bg-gray-100 bg-opacity-50">
                  <svg
                    fill="none"
                    className="w-6 text-gray-400 mx-auto"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <input
                name='email'
                value={email}
                onChange={handleChangeFormData}
                  className="w-11/12 focus:outline-none focus:text-gray-600 dark:text-black p-2"
                  placeholder={`${currentEmail}`}
                  // disabled
                />
              </div>
            </div>
          </div>

          <hr />
          <div className="md:inline-flex  space-y-4 md:space-y-0  w-full p-4 
          dark:text-white
          items-center">
            <h2 className="md:w-1/3 mx-auto max-w-sm font-montserat">Personal info</h2>
            <div className="md:w-2/3 mx-auto max-w-sm space-y-5">
              <div>
                <label className="text-sm  dark:text-white font-montserat-light text-gray-700">Full name</label>
                <div className="w-full inline-flex border">
                  <div className="w-1/12 pt-2 bg-gray-100">
                    <svg
                      fill="none"
                      className="w-6 text-gray-400 mx-auto"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                  <input
                    type="text"
                    onChange={handleChangeFormData}
                    name='username'
                    value={username}
                    className="w-11/12 focus:outline-none focus:text-gray-600 
                    dark:text-black
                    p-2"
                    placeholder={`${currentUsername}`}
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-montserat-light text-gray-700 dark:text-white">Phone number</label>
                <div className="w-full inline-flex border">
                  <div className="pt-2 w-1/12 bg-gray-100">
                    <svg
                      fill="none"
                      className="w-6 text-gray-400 mx-auto"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <input
                    type="text"
                    onChange={handleChangeFormData}
                    name='phone_number'
                    value={phone_number}
                    className="w-11/12 focus:outline-none focus:text-gray-600 
                    dark:text-black
                    p-2"
                  />
                </div>
              </div>
            </div>
          </div>

          <hr />
          <div className="md:inline-flex w-full space-y-4 md:space-y-0 p-8 
           items-center dark:text-white">
            <h2 className="md:w-4/12 max-w-sm mx-auto font-montserat">Change password</h2>

            <div className="md:w-5/12 w-full md:pl-9 max-w-sm mx-auto space-y-5 md:inline-flex pl-2">
              <div className="w-full inline-flex border-b">
                <div className="w-1/12 pt-2">
                  <svg
                    fill="none"
                    className="w-6 text-gray-400 mx-auto"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <input
                  type="password"
                  onChange={handleChangeFormData}
                  name='password'
                  value={password}
                  className="w-11/12 focus:outline-none focus:text-gray-600 dark:text-black p-2 ml-4"
                  placeholder="New"
                />
              </div>
            </div>
            <hr />





            <div className="px-4 text-center md:pl-6">
              <button type='submit' className="text-white w-full mx-auto max-w-sm rounded-md 
              text-center bg-indigo-600 py-2 px-4 inline-flex items-center 
              focus:outline-none  md:float-right font-montserat-regular">
                <svg
                  fill="none"
                  className="w-4 text-white mr-2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 
                    0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                <p  className='font-montserat-light '>Update</p> 
              </button>
            </div>
          </div>


          <div className="md:inline-flex space-y-4 md:space-y-0 w-full p-4 text-black items-center">
                      <h2 className="md:w-1/3 max-w-sm mx-auto flex items-center">
                        <FiShield className="mr-2 text-xl" /> <p className='text-xl dark:text-white
                         text-black font-montserat'>Security Key</p> 
                      </h2>
                      <div className="md:w-2/3 max-w-sm mx-auto">
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-2">
                              <FiKey className={hasPasskey ? "text-emerald-500" : "text-black "} />
                              <span className="font-medium text-black text-2xl font-montserat-regular">Passkey Status</span>
                            </div>
                            {hasPasskey && (
                              <span className="flex items-center text-emerald-500">
                                <FiCheck className="mr-1" /> <p className='dark:text-white text-black'>Registered</p>
                              </span>
                            )}
                          </div>
                          
                          <p className="text-xl text-black mb-4">
                            {hasPasskey 
                              ? <p className=' text-black'>Your account is secured with a passkey. You can use it to sign in quickly and securely</p>
                              : <p className=' text-black font-montserat-light'>Enhance your account security by registering a passkey for passwordless authentication</p>}
                          </p>

                          <Tooltip title={
                            hasPasskey 
                              ?    <p className="text-xl dark:text-white text-black">You already have a registered passkey </p> 
                              :  <p className="text-xl dark:text-white text-black"> Register a new passkey for secure access</p>
                          }>
                            <div>
                              <button
                                type="button"
                                onClick={startPasskeyRegistration}
                                disabled={hasPasskey || isRegistering}
                                className={`w-full flex items-center justify-center space-x-2 px-4 py-2 rounded-md 
                                  ${hasPasskey 
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                                    : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                                  } transition-colors duration-200`}
                              >
                                {isRegistering ? (
                                  <>
                                    <span className="animate-spin rounded-full h-4 w-4 border-b-2
                                     border-emerald-700"></span>
                                    <span>{
                                      registrationStatus === 'starting' ? 'Initializing...' :
                                      registrationStatus === 'authenticating' ? 'Verify on your device...' :
                                      registrationStatus === 'success' ? 'Successfully registered!' :
                                      registrationStatus === 'error' ? 'Registration failed' :
                                      'Processing...'
                                    }</span>
                                  </>
                                ) : (
                                  <>
                                    <FiKey />
                                    <span>{hasPasskey ? 'Passkey Registered' : 'Register Passkey'}</span>
                                  </>
                                )}
                              </button>
                            </div>
                          </Tooltip>
                        </div>
                      </div>
                    </div>
</form>
          <hr />
          <div className="w-full p-4 text-right text-black dark:text-white" onClick={handleLogout}>
            <button className="inline-flex items-center focus:outline-none mr-4">
            <LogOut   className="mr-2 h-4 w-4 " />
              Log Out
            </button>
          </div>
        </div>
      </div>

      </>
  )
}

export default AdminProfile