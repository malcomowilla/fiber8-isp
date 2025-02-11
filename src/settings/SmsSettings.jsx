import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import { useApplicationSettings } from '../settings/ApplicationSettings';
import { useState, useEffect, useCallback,lazy, Suspense } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { Button } from "@/components/ui/button" 

import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Tooltip from '@mui/material/Tooltip';
import Backdrop from '../backdrop/Backdrop'
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import AlertTitle from '@mui/material/AlertTitle';
import Autocomplete from '@mui/material/Autocomplete';
import { useDebounce } from 'use-debounce';
import UiLoader from '../uiloader/UiLoader'



const SettingsNotification = lazy(() => import('../notification/SettingsNotification'))



const SmsSettings = () => {
const [smsBalance, setSmsBalance] = useState(0)
const [selectedProvider, setSelectedProvider] = useState('SMS leopard'); // Default value
const [smsSettingsForm, setSmsSettingsForm] = useState({
  api_key: '',
  api_secret: '',
  sender_id: '',
  short_code: '',
  // username: '',
});


const {isloading, setisloading} = useApplicationSettings()
const [open, setOpen] = useState(false);
const [openNotifactionSettings, setOpenSettings] = useState(false)

const subdomain = window.location.hostname.split('.')[0]

const {api_key, api_secret, sender_id, short_code,} = smsSettingsForm

  const getSmsBalance  = useCallback(
    async(selectedProvider) => {

      try {
        const response = await fetch(`/api/get_sms_balance?selected_provider=${selectedProvider}`, {
          headers: {
            'X-Subdomain': subdomain,
          },
        })
        const newData = await response.json()

        if (response.status === 403) {
          toast.error('acess denied for sms balance', {
            duration: 5000,
            position: 'top-center',
          })
        }
        if(response.ok){
console.log('sms balance', newData)
setSmsBalance(newData.message)
        }else{
          toast.error('failed to fetch sms balance', {
            duration: 3000,
            position: 'top-center',
          })
            console.log('failed to fetch sms balance')
        }
      } catch (error) {
        toast.error('internal server error something went wrong with geting sms balance', {
          duration: 4000,
          position: 'top-center',
        })
      }

    },
    [],
  )

  useEffect(() => {
    getSmsBalance()
   
  }, [getSmsBalance]);




//   const saveSmsSettings = async (e) => {
//     e.preventDefault()
//     setisloading(true)
//     const response = await fetch('/api/sms_settings', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         api_key: api_key,
//         api_secret: api_secret,
//         sender_id: sender_id,
//         short_code: short_code,
//         sms_provider: selectedProvider,
//       }),

      
//     });
// const newData = await response.json()
// setOpen(false)
//     try {
//       if(response.ok){
//         setisloading(false)
//           setOpen(false)
//           setOpenSettings(true)
//         console.log('sms settings', newData)
// toast.success('sms settings saved successfully', {
//           duration: 3000,
//           position: 'top-center',
//         })


//       }else{
//         setisloading(false)
//           setOpen(false)
//           setOpenSettings(false)
//         toast.error('failed to save sms settings', {
//           duration: 3000,
//           position: 'top-center',
//         })
//       }
//     } catch (error) {
//       setOpen(false)
//       setisloading(false)
//       setOpenSettings(false)
//           setOpen(false)
//       toast.error('internal server error something went wrong with saving sms settings', {
//         duration: 6000,
//         position: 'top-center',
//       })

//     }
//   }


const fetchSmsSettings = useCallback(
  async() => {
    try {
      const response = await fetch('/api/sms_settings')
      const newData = await response.json()
      if (response.ok) {
        
        console.log('sms settings', newData)
        const {api_key, api_secret, sender_id, short_code} = newData[0]

        setSmsSettingsForm({...smsSettingsForm, api_key,api_secret,sender_id,short_code})
          setSelectedProvider(newData[0].sms_provider)


      }else{
        toast.error(newData.error, {
          duration: 5000,
          position: 'top-center',
        })
        console.log('failed to fetch sms settings')
        toast.error('failed to fetch sms settings', {
          duration: 3000,
          position: 'top-center',
        })
      }
    } catch (error) { 
      toast.error('internal server error something went wrong with fetching sms settings', {
        duration: 3000,
        position: 'top-center',
      })
    }
  },
  [],
)


useEffect(() => {
  fetchSmsSettings()
  
}, [fetchSmsSettings]);


const saveSmsSettings = async (e) => {
  e.preventDefault();
  setisloading(true);
  setOpen(true);

  try {
    const response = await fetch('/api/sms_settings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Subdomain': subdomain,

        

      },
      body: JSON.stringify({
        api_key: api_key,
        api_secret: api_secret,
        sender_id: sender_id,
        short_code: short_code,
        sms_provider: selectedProvider,
      }),
    });

    const newData = await response.json();

    if (response.ok) {
      setisloading(false);
      const {api_key, api_secret, sender_id, short_code} = newData
      setSelectedProvider(newData.sms_provider)
      setSmsSettingsForm({...smsSettingsForm, api_key,api_secret,sender_id,short_code})
      setOpenSettings(true);
      setOpen(false);
      console.log('SMS settings saved:', newData);
      toast.success('SMS settings saved successfully', {
        duration: 3000,
        position: 'top-center',
      });
    } else {
      setisloading(false);
      setOpenSettings(false);
      setOpen(false);
      toast.error('Failed to save SMS settings', {
        duration: 3000,
        position: 'top-center',
      });
    }
  } catch (error) {
    setisloading(false);
    setOpenSettings(false);
    setOpen(false);
    toast.error('Internal server error: Something went wrong with saving SMS settings', {
      duration: 6000,
      position: 'top-center',
    });
  }
};




  const handleChange = (e) => {

    const {name, id, value} = e.target
    setSmsSettingsForm((prevData) => (
      {...prevData, [name]: value} 
    ))
  }
  


  const handleClose = () => {
    setOpen(false);
  };

  
  const handleCloseNotifaction = () => {
   setOpenSettings(false);
 };
  return (
    <>

<Backdrop  handleClose={handleClose}  open={open}/>
<SettingsNotification open={openNotifactionSettings} handleClose={ handleCloseNotifaction }/>
    <Toaster  />
    <Suspense fallback={<div className='flex justify-center items-center '>{ <UiLoader/> }</div>}>

    <div className='mt-6'>
        
   <form onSubmit={saveSmsSettings}>
<div className='flex'>

<FormControl  sx={{ m: 1, width:'80ch',
  '& label.Mui-focused': {
    color: 'black',
    fontSize: '23px'
    
    },
'& .MuiOutlinedInput-root': {
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: "black",
    borderWidth: '3px'
    },
 '&.Mui-focused fieldset':  {
    borderColor: 'black', // Set border color to transparent when focused

  }
}, }}>
        <InputLabel id="demo-simple-select-autowidth-label">Provider</InputLabel>
        <Select
        value={selectedProvider}
        onChange={(e) => setSelectedProvider(e.target.value)}
          labelId="demo-simple-select-autowidth-label"
          id="demo-simple-select-autowidth"
          autoWidth
          label="User Group"
        >
                   <MenuItem value='SMS leopard' >SMS leopard</MenuItem>


          <MenuItem  value='Africastalking'>Africastalking</MenuItem>
          <MenuItem  value='Advanta' >Advanta</MenuItem>
          <MenuItem value='Mobitech Bulk' >Mobitech Bulk</MenuItem>
          <MenuItem value='Afrokatt' >Afrokatt</MenuItem>
          <MenuItem  value='Afrinet'>Afrinet</MenuItem>
          <MenuItem value='EgoSMS' >EgoSMS</MenuItem>
          <MenuItem value='BlessedTexts'>BlessedTexts</MenuItem>
          <MenuItem  value='Mobiweb'>Mobiweb</MenuItem>
          <MenuItem value='Mobivas'>Mobivas</MenuItem>
          <MenuItem value='MoveSMS' >MoveSMS</MenuItem>
          <MenuItem value='HostPinnacle'>HostPinnacle</MenuItem>
          <MenuItem value='Bytewave'>Bytewave</MenuItem>
          <MenuItem value='CrowdComm'>CrowdComm</MenuItem>
          <MenuItem  value='Ujumbe'>Ujumbe</MenuItem>

        </Select>
      </FormControl>




        <Box           className='myTextField'
 component="form"
      sx={{
        '& .MuiTextField-root': { m: 1, width: '80ch',  },

  '& label.Mui-focused': {
    color: 'black'
    },

'& .MuiOutlinedInput-root': {
  
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: "black",
    borderWidth: '3px'
    },
 '&.Mui-focused fieldset':  {
    borderColor: 'black', // Set border color to transparent when focused

  }
},
      }}
      noValidate>


            {/* <TextField label='username'>

            </TextField> */}
        </Box>
    </div>        
        

        <Box component="form"
                  className='myTextField'

      sx={{
        '& .MuiTextField-root': { m: 1, width: '100%',  },

  '& label.Mui-focused': {
    color: 'black'
    },

'& .MuiOutlinedInput-root': {
  
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: "black",
    borderWidth: '3px'
    },
 '&.Mui-focused fieldset':  {
    borderColor: 'black', // Set border color to transparent when focused

  }
},
      }}
      noValidate>


<TextField label='API key'  value={api_key} onChange={handleChange} name='api_key'>

</TextField>


<TextField label='API secret' value={api_secret} onChange={handleChange}  name='api_secret'> 

</TextField>

        
<TextField label='Short Code' value={short_code} onChange={handleChange} name='short_code'>
  

</TextField>





<TextField label='Sender ID' value={sender_id} onChange={handleChange} name='sender_id'>
  

</TextField>

        </Box>
        <Button className='mt-7'  type='submit'>save settings</Button>

        
</form>
        <div className='mt-12 flex justify-center shadow-2xl w-full h-[100px] items-center dark:bg-gray-900 '>

        <p>
            {smsBalance}
        </p>
        </div>


        <div className='mt-12'>
      
<label htmlFor="message" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">PPOE subscriber welcome message </label>
<textarea id="message" rows="4" className="block p-2.5 w-full text-sm text-gray-900
 bg-gray-50 rounded-lg border border-gray-300 focus:ring-gray-500 focus:border-gray-500
  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white
   dark:focus:ring-gray-500 dark:focus:border-gray-500" placeholder="..."></textarea>

<p></p>
        </div>
        </div>

        </Suspense>

        </>
  )
}

export default SmsSettings