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


const {isloading, setisloading, selectedProvider, setSelectedProvider,
  smsSettingsForm, setSmsSettingsForm,
  smsBalance, setSmsBalance
} = useApplicationSettings()
const [open, setOpen] = useState(false);
const [openNotifactionSettings, setOpenSettings] = useState(false)
const [smsSettingId, setSmsSettingId] = useState(null)
// const navigate = useNavigate()
const templateData = {
  // admin_otp_confirmation_template: '' ,
  // payment_reminder_template: '',
  // service_provider_otp_confirmation_template: '',
  // customer_otp_confirmation_template: '',
  // user_invitation_template: '',
  // service_provider_confirmation_code_template: '',
  // customer_confirmation_code_template: '',
  // store_manager_otp_confirmation_template: '',
  // store_manager_manager_number_confirmation_template: '',
  send_voucher_template: '',
  voucher_template: '',
}

const [smsTemplates, setSmsTemplates] = useState(templateData)

const handleChangeSmsTempalate = (e) => {
const {name, value} = e.target
setSmsTemplates((prevData) => (
  {...prevData, [name]: value} 
))
// console.log(value)
}

const subdomain = window.location.hostname.split('.')[0]

const {api_key, api_secret, sender_id, short_code, partnerID} = smsSettingsForm

const {send_voucher_template, voucher_template} = smsTemplates


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
            duration: 4000,
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

    if (selectedProvider) {
      getSmsBalance(selectedProvider)
    }
    // getSmsBalance()
   
  }, [getSmsBalance, selectedProvider]);




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


const fetchSavedSmsSettings = useCallback(
  async() => {
    
    try {
      const response = await fetch(`/api/saved_sms_settings`, {
        headers: {
          'Content-Type': 'application/json',
          'X-Subdomain': subdomain,
        },
      });
  
      const data = await response.json();

      const newData = data.length > 0 
        ? data.reduce((latest, item) => new Date(item.sms_setting_updated_at) > new Date(latest.sms_setting_updated_at) ? item : latest, data[0])
        : null;
  
      if (response.ok) {
        console.log('Fetched saved  SMS settings:', newData);
        const { api_key, api_secret, sender_id, short_code, sms_provider, partnerID } = newData[0];
        setSmsSettingId(newData.id)
        setSmsSettingsForm({ api_key, api_secret, sender_id, short_code, partnerID });
        setSelectedProvider(sms_provider);
        // setSelectedProvider(newData[0].sms_provider);
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
  },
  [],
)


useEffect(() => {
  fetchSavedSmsSettings();
 
}, [fetchSavedSmsSettings]);




const fetchSmsSettings = useCallback(async () => {
  try {
    const response = await fetch(`/api/sms_settings?provider=${selectedProvider}`, {
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
        !newData.sms_provider // Handles missing or null provider
      ) {
        console.log('No SMS settings found, resetting form.');
      
        setSmsSettingsForm({ 
          api_key: '', 
          api_secret: '', 
          sender_id: '', 
          short_code: '' ,
          partnerID: ''
        });
      
        // setSelectedProvider('');
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
        console.log('Fetched SMS settings:', newData);
      
        const { api_key, api_secret, sender_id, short_code, sms_provider, partnerID } = newData;
      
        setSmsSettingsForm({ 
          api_key: api_key || '', 
          api_secret: api_secret || '', 
          sender_id: sender_id || '', 
          short_code: short_code || '' ,
          partnerID: partnerID || ''
        });
      
        // setSelectedProvider(sms_provider || '');
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
}, [selectedProvider, setSmsSettingsForm, subdomain]);


useEffect(() => {
  if (selectedProvider) {
    fetchSmsSettings();
  }
}, [fetchSmsSettings, selectedProvider]);









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
        sms_setting_id: smsSettingId,
        api_secret: api_secret,
        sender_id: sender_id,
        short_code: short_code,
        sms_provider: selectedProvider,
        partnerID: partnerID
      }),
    });

    const newData = await response.json();




  if (response.status === 402) {
    setTimeout(() => {
      window.location.href = '/license-expired';
      // navigate('/license-expired')
     }, 1800);
    
  }
    if (response.ok) {
      setisloading(false);
      const {api_key, api_secret, sender_id, short_code, partnerID} = newData 
      setSelectedProvider(newData.sms_provider)
      setSmsSettingsForm({...smsSettingsForm, api_key,api_secret,sender_id,short_code, partnerID})
      setOpenSettings(true);
      setOpen(false);
      console.log('SMS settings saved:', newData);
      toast.success('SMS settings saved successfully', {
        duration: 3000,
        position: 'top-center',
      });
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

//  sms_templates


const getSmsTemplate = useCallback(
  async() => {
    try {
      const response = await fetch('/api/sms_templates')
      const newData = await response.json()
      const {send_voucher_template, voucher_template} = newData[0]
      
      if (response.ok) {
        setSmsTemplates({
          ...smsTemplates,
          send_voucher_template: send_voucher_template,
          voucher_template: voucher_template
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
        toast.error('failed to fetch sms templates', {
          duration: 3000,
          position: 'top-center',
        })
      }
    } catch (error) {
      toast.error('Internal server error: Something went wrong with fetching SMS templates', {
        duration: 4000,
        position: 'top-center',
      });
    }


  },
  [],
)

useEffect(() => {
  getSmsTemplate()
}, [getSmsTemplate]);


 const saveSmsTempalate = async(e) => {
e.preventDefault()

try {
  const response = await fetch('/api/sms_templates', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Subdomain': subdomain,
    },
    body: JSON.stringify({
      send_voucher_template: smsTemplates.send_voucher_template,
       voucher_template: smsTemplates.voucher_template
    })
  })


  const newData = await response.json()


  if (response.ok) {
    toast.success('SMS templates saved successfully', {
      duration: 3000,
      position: 'top-center',
      });
      setSmsTemplates({
        ...smsTemplates,
        send_voucher_template: newData.send_voucher_template,
        voucher_template: newData.voucher_template




      })



  } else {
   
    toast.error('Error Saving SMS Templates', {
      duration: 4000,
      position: 'top-center',
    })
  }
} catch (error) {
  toast.error(
    'Error Saving SMS Templates server error',
    {
      duration: 4000,
      position: 'top-center',
    }
  )
}



 }


console.log('selected provider',selectedProvider)

  return (
    <>

<Backdrop  handleClose={handleClose}  open={open}/>
<SettingsNotification open={openNotifactionSettings} handleClose={ handleCloseNotifaction }/>
    <Toaster  />
    <Suspense fallback={<div className='flex justify-center items-center '>{ <UiLoader/> }</div>}>




    <div className='p-7'>
            <p className='text-black dark:text-white playwrite-de-grund  text-2xl font-extrabold'>SMS Templates</p>
        </div>
    <div className='mt-6'>
        <p className='text-black dark:text-white playwrite-de-grund  text-lg font-bold'>
        Customize messages sent to customers using sms.Make sure to 
        include the keywords to correctly include content

        </p>
    </div>


<form onSubmit={saveSmsTempalate}>
    <Box
        className='myTextField'
     sx={{'& .MuiTextField-root' : {
        width: '100%',
        padding: '8px',
        m: 1,
        '& label.Mui-focused': {
          color: 'black',
          fontSize: '16px'
          },
      '& .MuiOutlinedInput-root': {
        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
          borderColor: "black",
          borderWidth: '3px',
          },
       '&.Mui-focused fieldset':  {
          borderColor: 'black', 
          
        }
      }
    }}}
    >
      <TextField onChange={(e)=> handleChangeSmsTempalate(e)} fullWidth label="send voucher template"
       name='send_voucher_template' 
       value={send_voucher_template}
       id="fullWidth" multiline 
       rows={4}
        helperText={<p className='text-black text-sm tracking-wider roboto-condensed-light'> 
            place  {"{{voucher_code}}"}

                    where the voucher code should appear in the text and either  {"{{phone_number}}"}, 
        to include the hotspot usesr phone number,   <span className='font-extrabold'>
          Message Sent To Customer 
          To Confirm Voucher Code
          </span></p>} />







          <TextField onChange={(e)=> handleChangeSmsTempalate(e)} fullWidth label="voucher template"
       name='voucher_template' 
       id="fullWidth" multiline 
       rows={4}
        helperText={<p className='text-black text-sm tracking-wider roboto-condensed-light'> 
            place  {"{{voucher_code}}"}

                    where the voucher code should appear in the text and either  {"{{phone_number}}"}, 
        to include the hotspot usesr phone number,   <span className='font-extrabold'>
          Message Sent To Customer 
          To Confirm Voucher Code
          </span></p>} value={voucher_template}/>
</Box>
        
<Button className='mt-2 '  type=''>save settings</Button>
</form>


   <form onSubmit={saveSmsSettings}>
<div className='flex mt-4'>

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

                   {/* c1cfc43f3e5c8b4c05d4e1b6f5be8fec */}
          <MenuItem  value='Africastalking'>Africastalking</MenuItem>
          <MenuItem  value='Advanta' >Advanta</MenuItem>
          <MenuItem value='Mobitech Bulk' >Mobitech Bulk</MenuItem>
          <MenuItem value='Afrokatt' >Afrokatt</MenuItem>
          <MenuItem  value='Afrinet'>Afrinet</MenuItem>
          <MenuItem value='EgoSMS' >EgoSMS</MenuItem>
          <MenuItem value='BlessedTexts'>BlessedTexts</MenuItem>
          <MenuItem value='TextSms'>TextSms</MenuItem>
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

{selectedProvider === 'TextSms' ?   
   <TextField label='Partner Id' value={partnerID} onChange={handleChange}  name='partnerID' >

</TextField>:  

<>

<TextField label='API secret' value={api_secret} onChange={handleChange}  name='api_secret'> 

</TextField>

        
<TextField label='Short Code' value={short_code} onChange={handleChange} name='short_code'>
  

</TextField>
</>
}






<TextField label='Sender ID' value={sender_id} onChange={handleChange} name='sender_id'>
  

</TextField>

        </Box>
        <Button className='mt-7'  type='submit'>save settings</Button>

        
</form>
        <div className='mt-12 flex justify-center shadow-2xl w-full h-[100px] items-center dark:bg-gray-900 '>

        <p>
           SMS balance:{smsBalance}
        </p>
        </div>


        <div className='mt-12'>
      
<label htmlFor="message" className="block mb-2 text-sm font-medium text-gray-900
 dark:text-white roboto-condensed-light">PPPOE subscriber welcome message </label>
<textarea id="message" rows="4" className="block p-2.5 w-full text-sm text-gray-900
 bg-gray-50 rounded-lg border border-gray-300 focus:ring-gray-500 focus:border-gray-500
  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white
   dark:focus:ring-gray-500 dark:focus:border-gray-500" placeholder="..."></textarea>

<p></p>
        </div>

        </Suspense>

        </>
  )
}

export default SmsSettings