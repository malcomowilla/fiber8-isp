
import React from 'react';
import { Box, Typography, Avatar, Button, Paper } from '@mui/material';
import { motion } from 'framer-motion';
import {useApplicationSettings} from '../settings/ApplicationSettings'
import { createAvatar } from '@dicebear/core';
import { lorelei } from '@dicebear/collection';
import { FiKey, FiShield, FiCheck } from 'react-icons/fi';
import { Tooltip, Backdrop } from '@mui/material';
import { useState, useEffect, useCallback } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import Lottie from 'react-lottie';
import LoadingAnimation from '../loader/loading_animation.json';


const SystemAdminProfile = () => {
    const {currentSystemAdmin, systemAdminEmail, loginWithPasskey, setLoginWithPasskey,
      useEmailAuthentication, setUseEmailAuthentication, usePhoneNumberAuthentication, setUsePhoneNumberAuthentication,
    fetchCurrentSystemAdmin
    } = useApplicationSettings()
    const [hasPasskey, setHasPasskey] = useState(false);
    const [isRegistering, setIsRegistering] = useState(false);
    const [registrationStatus, setRegistrationStatus] = useState('');
    const [isloading, setisloading] = useState(false);
    const [openLoad, setOpenLoad] = useState(false);
    const [loading, setLoading] = useState(false);
    const [passkeyCreated, setPasskeyCreated] = useState(false); // Track if passkey is created


    function handleChangePasskey() {
      // setLoginWithPasskey(e.target.checked);
      setLoginWithPasskey(!loginWithPasskey);
      setUseEmailAuthentication(false);
      setUsePhoneNumberAuthentication(false);
   }

   function handleChangeEmailAuth() {
    // setLoginWithPasskey(e.target.checked);
    setUseEmailAuthentication(!useEmailAuthentication);

    setUsePhoneNumberAuthentication(false)
    setLoginWithPasskey(false);
 }

   function handleChangePhoneNumberAuth() {
    // setLoginWithPasskey(e.target.checked);
    setUsePhoneNumberAuthentication(!usePhoneNumberAuthentication);
    setUseEmailAuthentication(false)
    setLoginWithPasskey(false);
 }


 useEffect(() => {
  fetchCurrentSystemAdmin()
 
 }, [fetchCurrentSystemAdmin]);
  


//  useEffect(() => {
//  const getLoginWithPasskey = async () => {
//   try {
//     const response = await fetch('/api/get_login_with_passkey');
//     const data = await response.json();
//     if (response.ok) {
//       const { login_with_passkey } = data[0]
//       setLoginWithPasskey(login_with_passkey);
//     }
//   } catch (error) {
//     console.error('Error fetching login with passkey:', error);
//   }
// };
// getLoginWithPasskey() 
//  }, []);

// const changeLoginWithPasskey = async (e) => {
//   e.preventDefault();
//   setLoading(true);
//   setOpenLoad(true);
//   // setLoginWithPasskey(!loginWithPasskey);
//   const response = await fetch('/api/login_with_passkey', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify({ login_with_passkey: loginWithPasskey }),
//   });

//   try {
//     if (response.ok) {
//       setLoading(false);
//       setOpenLoad(false);
//       toast.success('Login with passkey has been updated successfully', {
//         duration: 7000,
//         position: "top-center",
//       });
//     } else {
//       setLoading(false);
//       setOpenLoad(false);
//       toast.error('Failed to update login with passkey', {
//         duration: 7000,
//         position: "top-center",
//       });
//     }
//   } catch (error) {
//     setLoading(false);
//       setOpenLoad(false);
//       toast.error('Failed to update login with passkey', {
//         duration: 7000,
//         position: "top-center",
//         style: {
//           background: "linear-gradient(to right, #ff6384, #36a2eb)",
//           color: "white",
//           borderRadius: "5px",
//           padding: "10px",
//           boxShadow: "0 2px 10px 0 rgba(0, 0, 0, 0.1)",
//         },
//       });
//   }
 
// };





//   useEffect(() => {
//     const checkPasskeyStatus = async () => {
//       const response = await fetch(`api/check_passkey_status?email=${systemAdminEmail}`, {
//         method: 'GET',
       
//         // body: JSON.stringify({ email: systemAdminEmail })
//       });

//       const data = await response.json();
//       if (response.ok) {
        
//         setPasskeyCreated(data.passkeyExists); // Set state based on response
//       }
//     };

//       checkPasskeyStatus();
    
//   }, [systemAdminEmail]);

//   function generateAvatar(name) {
//     const avatar = createAvatar(lorelei, {
//       seed: name, // Use the customer's name as the seed
//       // Customize options for the lorelei style
//       backgroundColor: ['b6e3f4', 'c0aede', 'd1d4f9'], // Example: random background colors
//       radius: 50, // Rounded corners
//       size: 64, // Size of the avatar
//     });
  
//     // Generate the SVG as a data URL
//     return `data:image/svg+xml;utf8,${encodeURIComponent(avatar.toString())}`;
//   }



  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: LoadingAnimation,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  // /webauthn/authenticate_webauthn_login_system_admin
  // /webauthn/verify_webauthn_login_system_admin


  const subdomain = window.location.hostname.split('.')[0]

  const subdomain_aitechs = window.location.host
console.log('subdomain_aitechs', subdomain_aitechs)
  function arrayBufferToBase64Url(buffer) {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.length; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary).replace(/\//g, '_').replace(/\+/g, '-').replace(/=+$/, '');
  }


  
  async function signupWithWebAuthn(e) {

    
    e.preventDefault();
    setOpenLoad(true);
    setIsRegistering(true);
    setRegistrationStatus('starting');
    setLoading(true);
    const response = await fetch('/api/webauthn/register_webauthn_system_admin', {
      method: 'POST',
      headers: { 'X-Subdomain': subdomain,
        'X-Subdomain-Aitechs': subdomain_aitechs
       },
      body: JSON.stringify({  email: currentSystemAdmin.email,
        phone_number: currentSystemAdmin.phone_number
       })
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
          setLoading(false);
        } else {
            setRegistrationStatus('error');
            setTimeout(() => {
              setIsRegistering(false)
            }, 3000);
          setOpenLoad(false);
          setLoading(false);
          toast.error(options.error || 'passkey creation failed');
        }
      
    } catch (error) {
        toast.error(options.error || 'passkey creation failed');
        setTimeout(() => {
            setIsRegistering(false)
          }, 3000);
          setRegistrationStatus('error');
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
          name: "aitechs",
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
     
      const createResponse = await fetch('/api/webauthn/create_webauthn_system_admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 
            'X-Subdomain': subdomain,
            'X-Subdomain-Aitechs': subdomain_aitechs
         },
        body: JSON.stringify({ credential: credentialJson,
            email:currentSystemAdmin.email, phone_number: currentSystemAdmin.phone_number})
      });
  
      const data = await createResponse.json();
  
  
      if (createResponse.ok) {
       
        toast.success('created passkey sucessfully');
       
        setOpenLoad(false);
        setLoading(false);
  
        
      } else {
        console.log('signup failed');
        // setRegistrationError(options.errors);
        setOpenLoad(false);
        setLoading(false);
        toast.error(data.error || 'passkey creation failed');
      }
    } catch (err) {
      toast.error('An error occurred. Please try again later2.');
      setOpenLoad(false);
      setLoading(false);
      console.error('Error during WebAuthn credential creation:', err);
    }
  }
  
  
  // create_system_admin_settings  



 
  const changeSystemAdminSettings = async (e) => {
    e.preventDefault();
    setLoading(true);
    setOpenLoad(true);
    // setLoginWithPasskey(!loginWithPasskey);
    const response = await fetch('/api/create_system_admin_settings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ login_with_passkey: loginWithPasskey,
        use_email_authentication: useEmailAuthentication,
        use_sms_authentication: usePhoneNumberAuthentication,
       }),
    });
  
    try {
      if (response.ok) {
        setLoading(false);
        setOpenLoad(false);
        toast.success('Login with passkey has been updated successfully', {
          duration: 7000,
          position: "top-center",
        });
      } else {
        setLoading(false);
        setOpenLoad(false);
        toast.error('Failed to update login with passkey', {
          duration: 7000,
          position: "top-center",
        });
      }
    } catch (error) {
      setLoading(false);
        setOpenLoad(false);
        toast.error('Failed to update login with passkey', {
          duration: 7000,
          position: "top-center",
          style: {
            background: "linear-gradient(to right, #ff6384, #36a2eb)",
            color: "white",
            borderRadius: "5px",
            padding: "10px",
            boxShadow: "0 2px 10px 0 rgba(0, 0, 0, 0.1)",
          },
        });
    }
   
  };






  useEffect(() => {
    const getSystemAdminSettings = async () => {
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
   };
   getSystemAdminSettings() 
    }, []);
  
  



  return (
    <>
    <Toaster />



    {loading && (
        <Backdrop open={openLoad} sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
          <Lottie className='relative z-50' options={defaultOptions} height={400} width={400} />
        </Backdrop>
      )}




    <Box
      component={motion.div}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        p: 3,
        bgcolor: '#f0f4f8',
        borderRadius: '15px',
        boxShadow: 3,
        maxWidth: 400,
        margin: 'auto',
        mt: 5,
      }}
    >
      {/* <Avatar
        src={generateAvatar(systemAdminEmail)} alt={`${systemAdminEmail}'s avatar`}
        sx={{ width: 100, height: 100, mb: 2 }}
      /> */}
      {/* <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
        Admin Name
      </Typography> */}
      <Typography variant="body1" color="textSecondary">
        <p className='text-black'>{systemAdminEmail}</p>
      </Typography>
      <Typography variant="body2" sx={{ mt: 1, color: '#555' }}>
        Role: <span className='text-black'>System Admin</span>
      </Typography>
      <Paper
        component={motion.div}
        whileHover={{ scale: 1.05 }}
        sx={{
          p: 2,
          mt: 3,
          width: '100%',
          textAlign: 'center',
          bgcolor: 'white',
          borderRadius: '10px',
          boxShadow: 1,
        }}
      >
        <Typography variant="body1">
          <strong>Bio:</strong> Controller Of The Infrastructure.
        </Typography>
      </Paper>


      <div className="md:inline-flex space-y-4 md:space-y-0 w-full p-4 text-black items-center">
                      <h2 className="md:w-1/3 max-w-sm mx-auto flex items-center">
                        <FiShield className="mr-2 text-xl" /> <p className='text-xl'>Security Key</p> 
                      </h2>
                      <div className="md:w-2/3 max-w-sm mx-auto">
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-2">
                              <FiKey className={passkeyCreated ? "text-emerald-500" : "text-black "} />
                              <span className="font-medium text-black text-2xl">Passkey Status</span>
                            </div>
                            {passkeyCreated&& (
                              <span className="flex items-center text-emerald-500">
                                <FiCheck className="mr-1" /> Registered
                              </span>
                            )}
                          </div>
                          
                          <p className="text-xl text-black mb-4">
                            {passkeyCreated
                              ? "Your account is secured with a passkey. You can use it to sign in quickly and securely."
                              : "Enhance your account security by registering a passkey for passwordless authentication."}
                          </p>

                          <Tooltip title={
                        passkeyCreated
                              ?    <p className="text-xl">You already have a registered passkey </p> 
                              :  <p className="text-xl"> Register a new passkey for secure access</p>
                          }>
                            <div>
                              <button
                                type="button"
                                onClick={signupWithWebAuthn}
                                disabled={hasPasskey || isRegistering}
                                className={`w-full flex items-center justify-center space-x-2 px-4 py-2 rounded-md 
                                  ${hasPasskey 
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                                    : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                                  } transition-colors duration-200`}
                              >
                                {isRegistering ? (
                                  <>
                                    <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-emerald-700"></span>
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





<label className="inline-flex items-center me-5 cursor-pointer">
  <input onChange={handleChangePasskey}  checked={loginWithPasskey}  
   type="checkbox"  className="sr-only peer" />
  <div className="relative w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-focus:ring-4
   peer-focus:ring-yellow-300 dark:peer-focus:ring-yellow-800 peer-checked:after:translate-x-full 
   rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-['']
    after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300
     after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600
      peer-checked:bg-yellow-400"></div>
  <span className="ms-3 text-sm text-black">Login With Passkey?</span>
</label>




<div className='p-3'>
<label className="inline-flex items-center me-5 cursor-pointer">
  <input  onChange={handleChangePhoneNumberAuth} type="checkbox" checked={usePhoneNumberAuthentication} className="sr-only peer" />
  <div className="relative w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-focus:ring-4
   peer-focus:ring-yellow-300 dark:peer-focus:ring-yellow-800 peer-checked:after:translate-x-full 
   rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-['']
    after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300
     after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600
      peer-checked:bg-yellow-400"></div>
  <span className="ms-3 text-sm text-black">SMS authentication?</span>
</label>
</div>





<div className='p-3'>
<label className="inline-flex items-center me-5 cursor-pointer">
  <input  onChange={handleChangeEmailAuth} type="checkbox" checked={useEmailAuthentication} className="sr-only peer" />
  <div className="relative w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-focus:ring-4
   peer-focus:ring-yellow-300 dark:peer-focus:ring-yellow-800 peer-checked:after:translate-x-full 
   rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-['']
    after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300
     after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600
      peer-checked:bg-yellow-400"></div>
  <span className="ms-3 text-sm text-black">Email authentication?</span>
</label>
</div>  



<form onSubmit={changeSystemAdminSettings}>
      <Box mt={3} display="flex" gap={2}>
        <Button variant="contained" color="primary" type="submit">
          Save
        </Button>
        <Button variant="outlined" color="error" onClick={() => console.log('Logout')}>
          Logout
        </Button>
      </Box>
      </form>
      
    </Box>
    
    </>
  );
};

export default SystemAdminProfile;




