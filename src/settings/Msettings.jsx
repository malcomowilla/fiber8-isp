import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import { motion } from "framer-motion";
import {
  VpnKey,
  Payment,
  Business,
  Lock,
} from "@mui/icons-material";
import { useEffect, useState, useCallback, lazy} from "react";
import {useApplicationSettings} from '../settings/ApplicationSettings'
import toast, { Toaster } from 'react-hot-toast';
const SettingsNotification = lazy(() => import('../notification/SettingsNotification'))
import Backdrop from '../backdrop/Backdrop'

import { Autocomplete  } from '@mui/material';
import { CiUser } from "react-icons/ci";





const MpesaSettings = () => {


  // saved_hotspot_mpesa_settings
  // hotspot_mpesa_settings

const {selectedAccountTypeHotspot, setSelectedAccountTypeHotspot,

  hotspotMpesaSettings, setHotspotMpesaSettings,selectedAccountTypeSubscriber, 
  setSelectedAccountTypeSubscriber,dialMpesaSettings, setDialMpesaSettings
} = useApplicationSettings()


const { consumer_key, consumer_secret, passkey, short_code, 
  api_initiator_username, api_initiator_password
 } = hotspotMpesaSettings
const [open, setOpen] = useState(false);
const [openNotifactionSettings, setOpenSettings] = useState(false)
const [isloading, setisloading] = useState(false)
// const navigate = useNavigate()

const subdomain = window.location.hostname.split('.')[0]
const [loadRegisterUrls, setLoadRegisterUrls] = useState(false)









const fetchSavedDialMpesaSettings = useCallback(
  async() => {
    
    try {
      const response = await fetch(`/api/dial_mpesa_settings`, {
        headers: {
          'Content-Type': 'application/json',
          'X-Subdomain': subdomain,
        },
      });
  
      const data = await response.json();

      const newData = data.length > 0 
        ? data.reduce((latest, item) => new Date(item.created_at) > new Date(latest.created_at) ? item : latest, data[0])
        : null;
  
      if (response.ok) {
        // console.log('Fetched hotspot mpesa settings:', newData);
        const { consumer_key, consumer_secret, passkey, short_code } = newData;
        setSelectedAccountTypeSubscriber(newData.account_type)
        setDialMpesaSettings({ consumer_key, consumer_secret, passkey, short_code,
          api_initiator_username, api_initiator_password
         })
      } else {


        if (response.status === 402) {
        setTimeout(() => {
          // navigate('/license-expired')
          window.location.href='/license-expired'
         }, 1800);
        
      }
if (response.status === 401) {
  toast.error(newData.error, {
    position: "top-center",
    duration: 4000,
  })
   setTimeout(() => {
          // navigate('/license-expired')
          window.location.href='/signin'
         }, 1900);
}
        toast.error('Failed to fetch dial mpesa settings', {
          duration: 3000,
          position: 'top-center',
        });

        
      }
    } catch (error) {
      toast.error('Something went wrong with fetching dial mpesa settings, Please retry in a moment', {
        duration: 2000,
        position: 'top-center',
      });
    }
  },
  [],
)


useEffect(() => {
  fetchSavedDialMpesaSettings();
 
}, [fetchSavedDialMpesaSettings]);






// const fetchSavedHotspotMpesaSettings = useCallback(
//   async() => {
    
//     try {
//       const response = await fetch(`/api/saved_hotspot_mpesa_settings`, {
//         headers: {
//           'Content-Type': 'application/json',
//           'X-Subdomain': subdomain,
//         },
//       });
  
//       const data = await response.json();

//       const newData = data.length > 0 
//         ? data.reduce((latest, item) => new Date(item.created_at) > new Date(latest.created_at) ? item : latest, data[0])
//         : null;
  
//       if (response.ok) {
//         // console.log('Fetched hotspot mpesa settings:', newData);
//         const { consumer_key, consumer_secret, passkey, short_code } = newData;
//         setSelectedAccountTypeHotspot(newData.account_type)
//         setHotspotMpesaSettings({ consumer_key, consumer_secret, passkey, 
//           short_code,
//           api_initiator_username, api_initiator_password
//          })
//       } else {


//         if (response.status === 402) {
//         setTimeout(() => {
//           // navigate('/license-expired')
//           window.location.href='/license-expired'
//          }, 1800);
        
//       }
// if (response.status === 401) {
//   toast.error(newData.error, {
//     position: "top-center",
//     duration: 4000,
//   })
//    setTimeout(() => {
//           // navigate('/license-expired')
//           window.location.href='/signin'
//          }, 1900);
// }
//         toast.error(newData.error || 'Failed to fetch hotspot mpesa settings', {
//           duration: 2000,
//           position: 'top-center',
//         });

        
//       }
//     } catch (error) {
//       toast.error('Something went wrong with fetching hotspot mpesa settings, Please retry in a moment', {
//         duration: 2000,
//         position: 'top-center',
//       });
//     }
//   },
//   [],
// )


// useEffect(() => {
//   fetchSavedHotspotMpesaSettings();
 
// }, [fetchSavedHotspotMpesaSettings]);








const fetchHotspotMpesaSettings = useCallback(async () => {
  try {
    const response = await fetch(`/api/hotspot_mpesa_settings?account_type=${selectedAccountTypeHotspot}`, {
      headers: {
        'Content-Type': 'application/json',
        'X-Subdomain': subdomain,
      },
    });

    const newData = await response.json();

    if (response.ok) {
      
      if (
        !newData || // Handles null or undefined
        newData.length === 0 || // Handles empty array
        !newData.account_type // Handles missing or null provider
      ) {
      
        setHotspotMpesaSettings({ 
          consumer_key: '', 
          consumer_secret: '', 
          passkey: '', 
          short_code: '' ,
          api_initiator_username: '',
          api_initiator_password: ''
        });
      
        // setSelectedProvider('');
      } else {
      
        const { consumer_key, consumer_secret, passkey, short_code,
          api_initiator_username, api_initiator_password
         } = newData;
      

        setHotspotMpesaSettings(prevData => ({
          ...prevData, 
          consumer_key, consumer_secret, passkey, short_code,
          api_initiator_username, api_initiator_password
        }));
      
      }
    } else {
      toast.error(newData.error || 'Failed to fetch SMS settings', {
        duration: 3000,
        position: 'top-center',
      });
    }
  } catch (error) {
    toast.error('Something went wrong with fetching SMS settings, Please retry in a moment', {
      duration: 3000,
      position: 'top-center',
    });
  }
}, [selectedAccountTypeHotspot]);


useEffect(() => {
  if (selectedAccountTypeHotspot) {
    fetchHotspotMpesaSettings();
  }
}, [fetchHotspotMpesaSettings, selectedAccountTypeHotspot]);





const saveDialMpesaSettings = async(e) => {
e.preventDefault()

  try {
    setisloading(true)
    setOpen(true)
    const response = await fetch('/api/dial_mpesa_settings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Subdomain': subdomain,
      },
      body: JSON.stringify({
        consumer_key: consumer_key,
        consumer_secret: consumer_secret,
        passkey: passkey,
        short_code: short_code,
        account_type: selectedAccountTypeSubscriber
      })
    })

const newData = await response.json()


  if (response.status === 402) {
    setTimeout(() => {
      window.location.href = '/license-expired';
     }, 1800);
    
  }

    if (response.ok) {
      setisloading(false)
      setOpen(false)
      setOpenSettings(true)
      toast.success('Dial Mpesa settings saved successfully', {
        duration: 3000,
        position: 'top-center',
      })
      setHotspotMpesaSettings({
        ...hotspotMpesaSettings,
        consumer_key: newData.consumer_key,
        consumer_secret: newData.consumer_secret,
        passkey: newData.passkey,
        short_code: newData.short_code,
      })
     
    } else {
      
      setOpen(false)
      setisloading(false)
      setOpenSettings(false)
      toast.error('failed to save Dial Mpesa settings', {
        duration: 3000,
        position: 'top-center',
      })
    }
  } catch (error) {
    setisloading(false)
    setOpenSettings(false)
    toast.error('Something went wrong Please retry in a moment', {  duration: 3000, position: 'top-center' })
  }


}








const saveHotspotMpesaSettings = async(e) => {
e.preventDefault()

  try {
    setisloading(true)
    setOpen(true)
    const response = await fetch('/api/hotspot_mpesa_settings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Subdomain': subdomain,
      },
      body: JSON.stringify({
        consumer_key: consumer_key,
        consumer_secret: consumer_secret,
        passkey: passkey,
        short_code: short_code,
        api_initiator_username: api_initiator_username,
        api_initiator_password: api_initiator_password,
        account_type: selectedAccountTypeHotspot
      })
    })

const newData = await response.json()


  if (response.status === 402) {
    setTimeout(() => {
      window.location.href = '/license-expired';
     }, 1800);
    
  }

    if (response.ok) {
      setisloading(false)
      setOpen(false)
      setOpenSettings(true)
      toast.success('Hotspot Mpesa settings saved successfully', {
        duration: 3000,
        position: 'top-center',
      })
      setHotspotMpesaSettings({
        ...hotspotMpesaSettings,
        consumer_key: newData.consumer_key,
        consumer_secret: newData.consumer_secret,
        passkey: newData.passkey,
        short_code: newData.short_code,
        api_initiator_username: newData.api_initiator_username,
        api_initiator_password: newData.api_initiator_password,
      })
     
    } else {
      
      setOpen(false)
      setisloading(false)
      setOpenSettings(false)
      toast.error('failed to save hotspot mpesa settings', {
        duration: 3000,
        position: 'top-center',
      })
    }
  } catch (error) {
    setisloading(false)
    setOpenSettings(false)
    toast.error('Something went wrong Please retry in a moment', {  duration: 3000, position: 'top-center' })
  }


}


const handleChangeMPesaHotspotSettings = (e) => {
  const { type, name, checked, value } = e.target;
  setHotspotMpesaSettings((prevData) => ({
    ...prevData,
    [name]: type === "checkbox" ? checked : value,
  }));
};




const handleChangeMPesaDialSettings = (e) => {
  const { type, name, checked, value } = e.target;
  setDialMpesaSettings((prevData) => ({
    ...prevData,
    [name]: type === "checkbox" ? checked : value,
  }));
};



const handleClose = () => {
  setOpen(false);
};


const handleCloseNotifaction = () => {
 setOpenSettings(false);
};


const registerUrls = async() => {

  try {
    setLoadRegisterUrls(true)
    const response = await fetch('/api/register_urls', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Subdomain': subdomain,
      },
      // body: JSON.stringify({
      //   consumer_key: consumer_key,
      //   consumer_secret: consumer_secret,
      // })
    })
   const newData = await response.json()
  if (response.ok) {
    toast.success('M-Pesa URLs registered successfully', {
      duration: 4000,
      position: 'top-center',
    })
    setLoadRegisterUrls(false)
    
  }else{
    setLoadRegisterUrls(false)
    
     toast.error(newData.error || 'Failed to register M-Pesa URLs', {
      duration: 4000,
      position: 'top-center',
    })
  }


  } catch (error) {
    setLoadRegisterUrls(false)
    toast.error(error, {
      duration: 4000,
      position: 'top-center',
    })
  }
}

  return (

    <>
    <Toaster />
    <Backdrop  handleClose={handleClose}  open={open}/>
<SettingsNotification open={openNotifactionSettings} handleClose={ handleCloseNotifaction }/>


    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mt-10 h-screen p-6"
    >
      {/* Hotspot Section */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mb-8"
      >

        <div className='flex justify-between '>
        <p className="text-xl font-semibold mb-4 flex items-center">
          <Payment className="mr-2" /> Mpesa
</p>

          <div onClick={registerUrls}
           className='p-3 bg-green-200/50  rounded-lg cursor-pointer'>
            <p className='text-black'>{ loadRegisterUrls ? 'Registering Urls......' : 'Register Urls'}</p>
          </div>
        

        </div>

    <form onSubmit={saveHotspotMpesaSettings}>
       <FormControl
  variant="standard"
  sx={{
    m: 1,
    width: "100%",
    marginTop: 4,
    "& .MuiOutlinedInput-notchedOutline": {
      px: 2.5,
    },
    "& label.Mui-focused": {
      color: "black",
      fontSize: "16px",
    },
    "& .MuiOutlinedInput-root": {
      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
        borderColor: "black",
        borderWidth: "3px",
      },
      "&.Mui-focused fieldset": {
        borderColor: "black",
      },
    },
  }}
>
{/* 
  <Autocomplete
  className='myTextField'
    value={selectedAccountTypeHotspot}
    onChange={(event, newValue) => {
      setSelectedAccountTypeHotspot(newValue);
    }}
    options={["Till", "Paybill"]}
    renderInput={(params) => (
      <TextField
        {...params}
        label="Mpesa Account Type"
        variant="outlined"
        InputLabelProps={{
          style: { 
            color: 'black',
            fontSize: '16px'
          }
        }}
      />
    )}
    sx={{
      "& .MuiAutocomplete-inputRoot": {
        padding: '8.5px 14px',
      },
      "& .MuiAutocomplete-endAdornment": {
        right: '14px',
      }
    }}
  /> */}
</FormControl>

        <Box
          component="form"
          sx={{
            "& .MuiTextField-root": { m: 1, width: "52ch", marginTop: 5 },
            "& label.Mui-focused": {
              color: "black",
              fontSize: "16px",
            },
            "& .MuiOutlinedInput-root": {
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "black",
                borderWidth: "3px",
              },
              "&.Mui-focused fieldset": {
                borderColor: "black",
              },
            },
          }}
          noValidate
        >
          <TextField
           onChange={handleChangeMPesaHotspotSettings}
            name="short_code"
            value={short_code}
            className='myTextField'
            label="Short Code"
            InputProps={{
              startAdornment: <Business className="mr-2" />,
            }}
          />
        </Box>

        <Box
          component="form"
          sx={{
            "& .MuiTextField-root": { m: 1, width: "100%", marginTop: 5 },
            "& label.Mui-focused": {
              color: "black",
              fontSize: "16px",
            },
            "& .MuiOutlinedInput-root": {
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "black",
                borderWidth: "3px",
              },
              "&.Mui-focused fieldset": {
                borderColor: "black",
              },
            },
          }}
          noValidate
        >


{/* 
  <TextField
           onChange={handleChangeMPesaHotspotSettings}
            name="api_initiator_username"
            value={api_initiator_username}
           className='myTextField'
            label="Api Initiator Username"
            InputProps={{
              startAdornment: <CiUser className="mr-2 text-black" />,
            }}
          />


<TextField
           onChange={handleChangeMPesaHotspotSettings}
            name="api_initiator_password"
            value={api_initiator_password}
           className='myTextField'
            label="Api Initiator Password"
            InputProps={{
              startAdornment: <Lock className="mr-2" />,
            }}
          /> */}




  <TextField
           onChange={handleChangeMPesaHotspotSettings}
            name="api_initiator_username"
            value={api_initiator_username}
           className='myTextField'
            label="Api Initiator Username"
            InputProps={{
              startAdornment: <CiUser className="mr-2 text-black" />,
            }}
          />


          <TextField
          className='myTextField'
          onChange={handleChangeMPesaHotspotSettings}
            name="consumer_key"
            value={consumer_key}
            label="Consumer Key"
            InputProps={{
              startAdornment: <VpnKey className="mr-2" />,
            }}
          />
          <TextField
           onChange={handleChangeMPesaHotspotSettings}
            name="consumer_secret"
            value={consumer_secret}
           className='myTextField'
            label="Consumer Secret"
            InputProps={{
              startAdornment: <Lock className="mr-2" />,
            }}
          />
          <TextField
           onChange={handleChangeMPesaHotspotSettings}
            name="passkey"
            value={passkey}
             className='myTextField'
            label="Pass Key"
            InputProps={{
              startAdornment: <VpnKey className="mr-2" />,
            }}
          />
        </Box>

        <Box
          component="form"
          sx={{
            "& .MuiTextField-root": { m: 1, width: "52ch", marginTop: 5 },
            "& label.Mui-focused": {
              color: "black",
              fontSize: "16px",
            },
            "& .MuiOutlinedInput-root": {
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "black",
                borderWidth: "3px",
              },
              "&.Mui-focused fieldset": {
                borderColor: "black",
              },
            },
          }}
          noValidate
        >
         
        </Box>

        <FormControl
          sx={{
            m: 1,
            width: "100%",
            marginTop: 4,
            "& label.Mui-focused": {
              color: "black",
              fontSize: "14px",
            },
            "& .MuiOutlinedInput-root": {
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "black",
                borderWidth: "3px",
              },
              "&.Mui-focused fieldset": {
                borderColor: "black",
              },
            },
          }}
        >
            <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="flex justify-center w-full mt-8"
      >
        <button type='submit' className="p-3 border rounded-sm
         dark:border-teal-500 dark:text-blue-300 text-center w-full border-gray-800 hover:bg-green-500 hover:text-white transition-all duration-300">
          Save
        </button>
      </motion.div>
        </FormControl>
</form>


      </motion.div>




{/* 
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mt-8"
      >
        <form onSubmit={saveDialMpesaSettings}>
        
        <p className="text-xl font-semibold mb-4 flex items-center">
          <Payment className="mr-2" /> Dial Up
        </p>

          <FormControl
  variant="standard"
  sx={{
    m: 1,
    width: "100%",
    marginTop: 4,
    "& .MuiOutlinedInput-notchedOutline": {
      px: 2.5,
    },
    "& label.Mui-focused": {
      color: "black",
      fontSize: "16px",
    },
    "& .MuiOutlinedInput-root": {
      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
        borderColor: "black",
        borderWidth: "3px",
      },
      "&.Mui-focused fieldset": {
        borderColor: "black",
      },
    },
  }}
>
  <Autocomplete
  className='myTextField'
    value={selectedAccountTypeSubscriber}
    onChange={(event, newValue) => {
      setSelectedAccountTypeSubscriber(newValue);
    }}
    options={["Till", "Paybill"]}
    renderInput={(params) => (
      <TextField
        {...params}
        label="Dial Mpesa Account Type"
        variant="outlined"
        InputLabelProps={{
          style: { 
            color: 'black',
            fontSize: '16px'
          }
        }}
      />
    )}
    sx={{
      "& .MuiAutocomplete-inputRoot": {
        padding: '8.5px 14px',
      },
      "& .MuiAutocomplete-endAdornment": {
        right: '14px',
      }
    }}
  />
</FormControl>

        <Box
          component="form"
          sx={{
            "& .MuiTextField-root": { m: 1, width: "52ch", marginTop: 2 },
            "& label.Mui-focused": {
              color: "black",
              fontSize: "16px",
            },
            "& .MuiOutlinedInput-root": {
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "black",
                borderWidth: "3px",
              },
              "&.Mui-focused fieldset": {
                borderColor: "black",
              },
            },
          }}
          noValidate
        >
          <div className="flex">
            <TextField
              className='myTextField'
              onChange={handleChangeMPesaHotspotSettings}
            name="short_code"
            value={dialMpesaSettings.short_code}
              label="Business Shortcode/Till Number"
              InputProps={{
                startAdornment: <Business className="mr-2" />,
              }}
            />
           
           
          </div>
        </Box>

        <Box
          component="form"
          sx={{
            "& .MuiTextField-root": { m: 1, width: "100%", marginTop: 2 },
            "& label.Mui-focused": {
              color: "black",
              fontSize: "16px",
            },
            "& .MuiOutlinedInput-root": {
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "black",
                borderWidth: "3px",
              },
              "&.Mui-focused fieldset": {
                borderColor: "black",
              },
            },
          }}
          noValidate
        >
          <TextField
          className='myTextField'
            name='consumer_secret'
             onChange={handleChangeMPesaHotspotSettings}
             value={dialMpesaSettings.consumer_secret}
            label="Consumer Secret"
            InputProps={{
              startAdornment: <Lock className="mr-2" />,
            }}
          />
          <TextField
          className='myTextField'
            name='consumer_key'
            onChange={handleChangeMPesaHotspotSettings}
            value={dialMpesaSettings.consumer_key}
            label="Consumer Key"
            InputProps={{
              startAdornment: <VpnKey className="mr-2" />,
            }}
          />
         
        </Box>

        <Box
          component="form"
          sx={{
            "& .MuiTextField-root": { m: 1, width: "52ch", marginTop: 2 },
            "& label.Mui-focused": {
              color: "black",
              fontSize: "16px",
            },
            "& .MuiOutlinedInput-root": {
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "black",
                borderWidth: "3px",
              },
              "&.Mui-focused fieldset": {
                borderColor: "black",
              },
            },
          }}
          noValidate
        >
        
        </Box>


      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="flex justify-center w-full mt-8"
      >
        <button className="p-3 border rounded-sm
         dark:border-teal-500 dark:text-blue-300 text-center w-full border-gray-800 hover:bg-green-500 hover:text-white transition-all duration-300">
          Save
        </button>
      </motion.div>
      </form>
      </motion.div> */}





    </motion.div>

    </>
  );
};

export default MpesaSettings;