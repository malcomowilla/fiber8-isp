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






const MpesaSettings = () => {


  // saved_hotspot_mpesa_settings
  // hotspot_mpesa_settings

const {selectedAccountTypeHotspot, setSelectedAccountTypeHotspot,

  hotspotMpesaSettings, setHotspotMpesaSettings
} = useApplicationSettings()


const { consumer_key, consumer_secret, passkey, short_code } = hotspotMpesaSettings
const [open, setOpen] = useState(false);
const [openNotifactionSettings, setOpenSettings] = useState(false)
const [isloading, setisloading] = useState(false)
// const navigate = useNavigate()

const subdomain = window.location.hostname.split('.')[0]













const fetchSavedHotspotMpesaSettings = useCallback(
  async() => {
    
    try {
      const response = await fetch(`/api/saved_hotspot_mpesa_settings`, {
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
        console.log('Fetched hotspot mpesa settings:', newData);
        const { consumer_key, consumer_secret, passkey, short_code } = newData;
        setSelectedAccountTypeHotspot(newData.account_type)
        setHotspotMpesaSettings({ consumer_key, consumer_secret, passkey, short_code })
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
        toast.error(newData.error || 'Failed to fetch hotspot mpesa settings', {
          duration: 3000,
          position: 'top-center',
        });

        
      }
    } catch (error) {
      toast.error('Internal server error: Something went wrong with fetching hotspot mpesa settings', {
        duration: 3000,
        position: 'top-center',
      });
    }
  },
  [],
)


useEffect(() => {
  fetchSavedHotspotMpesaSettings();
 
}, [fetchSavedHotspotMpesaSettings]);








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
        console.log('No SMS settings found, resetting form.');
      
        setHotspotMpesaSettings({ 
          consumer_key: '', 
          consumer_secret: '', 
          passkey: '', 
          short_code: '' ,
        });
      
        // setSelectedProvider('');
      } else {
        console.log('Fetched hotspot mpesa settings:', newData);
      
        const { consumer_key, consumer_secret, passkey, short_code } = newData;
      

        setHotspotMpesaSettings(prevData => ({
          ...prevData, 
          consumer_key, consumer_secret, passkey, short_code
        }));




      

        // setHotspotMpesaSettings(

        //   {...hotspotMpesaSettings, consumer_key: consumer_key || '', consumer_secret: consumer_secret || '', passkey: passkey || '', short_code: short_code || ''}
        // );
      
      }
    } else {
      toast.error(newData.error || 'Failed to fetch SMS settings', {
        duration: 3000,
        position: 'top-center',
      });
    }
  } catch (error) {
    toast.error('Internal server error: Something went wrong with fetching SMS settings', {
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
    toast.error('internal server error', {  duration: 3000, position: 'top-center' })
  }


}


const handleChangeMPesaHotspotSettings = (e) => {
  const { type, name, checked, value } = e.target;
  setHotspotMpesaSettings((prevData) => ({
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
        <p className="text-xl font-semibold mb-4 flex items-center">
          <Payment className="mr-2" /> Hotspot
        </p>

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
          <InputLabel id="hotspot-account-type-label">
            Hotspot Mpesa Account Type
          </InputLabel>
          <Select
           value={selectedAccountTypeHotspot}
           onChange={(e) => setSelectedAccountTypeHotspot(e.target.value)}
            labelId="hotspot-account-type-label"
            id="hotspot-account-type"
            label="Hotspot Mpesa Account Type"
          >
            <MenuItem value="Till">Till</MenuItem>
            <MenuItem value="Paybill">Paybill</MenuItem>
          </Select>
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
          {/* <div className="flex">
            <TextField
             className='myTextField'
              id="initiator-username"
              label="Initiator Username"
              InputProps={{
                startAdornment: <Person className="mr-2" />,
              }}
            />
            <TextField
              id="initiator-password"
               className='myTextField'
              label="Initiator Password"
              InputProps={{
                startAdornment: <Lock className="mr-2" />,
              }}
            />
          </div> */}
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





      {/* Fixed Mpesa Section */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mt-8"
      >
        <p className="text-xl font-semibold mb-4 flex items-center">
          <Payment className="mr-2" /> Dial Up
        </p>
        <FormControl
          variant="standard"
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
          <InputLabel id="fixed-mpesa-account-type-label">
            Fixed Mpesa Account Type
          </InputLabel>
          <Select
            labelId="fixed-mpesa-account-type-label"
            id="fixed-mpesa-account-type"
            autoWidth
            label="Fixed Mpesa Account Type"
          >
            <MenuItem value="Paybill">Paybill</MenuItem>
            <MenuItem value="Till Number">Till Number</MenuItem>
          </Select>
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
              id="head-office-shortcode"
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
            id="fixed-consumer-secret"
            label="Consumer Secret"
            InputProps={{
              startAdornment: <Lock className="mr-2" />,
            }}
          />
          <TextField
          className='myTextField'
            id="fixed-consumer-key"
            label="Consumer Key"
            InputProps={{
              startAdornment: <VpnKey className="mr-2" />,
            }}
          />
          <TextField
           className='myTextField'
            id="fixed-pass-key"
            label="Pass Key"
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
          {/* <div className="flex">
            <TextField
              id="fixed-initiator-username"
              label="Initiator Username"
              InputProps={{
                startAdornment: <Person className="mr-2" />,
              }}
            />
            <TextField
              id="fixed-initiator-password"
              label="Initiator Password"
              InputProps={{
                startAdornment: <Lock className="mr-2" />,
              }}
            />
          </div> */}
        </Box>


{/* 
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
          <InputLabel id="fixed-api-version-label">API VERSION</InputLabel>
          <Select
            labelId="fixed-api-version-label"
            id="fixed-api-version"
            autoWidth
            label="API VERSION"
          >
            <MenuItem>V1</MenuItem>
            <MenuItem>V2</MenuItem>
          </Select>
        </FormControl> */}
      </motion.div>

      {/* Save Button */}
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
    </motion.div>

    </>
  );
};

export default MpesaSettings;