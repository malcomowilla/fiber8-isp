import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { useState, useEffect, useCallback,lazy, Suspense } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { Button } from "@/components/ui/button" 
import { useDebounce } from 'use-debounce';
import styled from "styled-components";
import { motion } from "framer-motion";
import { useApplicationSettings } from '../settings/ApplicationSettings';
const SettingsNotification = lazy(() => import('../notification/SettingsNotification'))
import Backdrop from '../backdrop/Backdrop'

import UiLoader from '../uiloader/UiLoader'
import { MdAttachEmail } from "react-icons/md";
import { FaKey } from "react-icons/fa";
import { TbLockPassword } from "react-icons/tb";









const EmailSettings = () => {
const subdomain = window.location.hostname.split('.')[0]
const [emailSettingsForm, setEmailSettingsForm] = useState({
  smtp_host: '',
  smtp_username: '',
  sender_email: '',
  smtp_password: '',
  api_key: '',
  domain: '',
  smtp_port: '',
})

const   {domain, api_key, smtp_host, smtp_username, sender_email, smtp_password,
  smtp_port,
} = emailSettingsForm


const {isloading, setisloading} = useApplicationSettings()
const [open, setOpen] = useState(false);
const [openNotifactionSettings, setOpenSettings] = useState(false)


const Button = styled(motion.button)`
  margin-top: 30px;
  padding: 12px 26px;
  font-size: 1.2rem;
  color: white;
  background: black;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  &:hover {
    background: green;
  }
`;



const handleChange = (e) => {
const {name, value} = e.target
setEmailSettingsForm((prevData) => (
  {...prevData, [name]: value} 
))

}



const getEmailSettings = useCallback(
  async() => {
    
    try {
      const response = await fetch('/api/email_settings', {
        headers: {
            'X-Subdomain': subdomain,
            },
      })
      const newData = await response.json()

      if (response.ok) {
        const {domain, api_key, smtp_host, smtp_username, sender_email, smtp_password, smtp_port} = newData[0]
        setEmailSettingsForm({...emailSettingsForm, domain,  smtp_host, smtp_username, sender_email, 
           smtp_port})
 
      } else {
        toast.error(newData.error, {
          duration: 5000,
          position: 'top-center',
        })
        toast.error('failed to fetch email settings', {
          duration: 3000,
          position: 'top-center',
        })
      } 
      
    } catch (error) {
      toast.error('internal server error something went wrong with getting email settings', {
        duration: 2000,
        position: 'top-center',
      })
    }
  },
  [],
)


useEffect(() => {
  getEmailSettings()
}, [getEmailSettings]);


const saveEmailSettings = async(e) => {
  e.preventDefault()
  setisloading(true);
  setOpen(true);
  try {
    const response = await fetch('/api/email_settings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Subdomain': subdomain, 
      },
      body: JSON.stringify(emailSettingsForm),
    })

const newData = await response.json()

const {domain, api_key, smtp_host, smtp_username, sender_email, smtp_password} = newData



if (response.status === 402) {
  setTimeout(() => {
    window.location.href = '/license-expired';
   }, 1800);
  
}

    if (response.ok) {
     
      setEmailSettingsForm({...emailSettingsForm, domain, api_key, smtp_host, smtp_username, sender_email, smtp_password})
      toast.success('Email settings saved successfully', {
        duration: 3000,
        position: 'top-center',
      })
      setOpenSettings(true);
      setOpen(false);
    } else {
      toast.success('Failed to save email settings', {
        duration: 3000,
        position: 'top-center',
      })
      setisloading(false);
      setOpenSettings(false);
      setOpen(false);
    }
  } catch (error) {
    setisloading(false);
    setOpenSettings(false);
    setOpen(false);
    console.log(error)
  }
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
    <Toaster />
    <Suspense fallback={<div className=' '>{ <UiLoader/> }</div>}>

    <div className='mt-8'>
      <form onSubmit={saveEmailSettings}>  
<Box component=""
 className='myTextField'
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
     >

<TextField   label='SMTP Host' 

InputProps={{
  startAdornment: <MdAttachEmail className='mr-2'/>
}}
onChange={handleChange} name='smtp_host' value={smtp_host}/>







<TextField 


InputProps={{
  startAdornment: <MdAttachEmail className='mr-2'/>
}}
label='SMTP Port' onChange={handleChange} name='smtp_port' value={smtp_port}>


</TextField>
</Box>




      <div className=''>
        <Box  className='myTextField'  sx={{'& .MuiTextField-root' : {
            width: '100%',
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
        }}}>
<TextField label='SMTP Username' 

InputProps={{
  startAdornment: <MdAttachEmail className='mr-2'/>
}}
onChange={handleChange} value={smtp_username} name='smtp_username'/>
        </Box>


        <Box  className='myTextField'  sx={{'& .MuiTextField-root' : {
            width: '100%',
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
        }}}>
        <TextField 
        
InputProps={{
  startAdornment: <TbLockPassword className='mr-2'/>
}}
        label='SMTP Password'  onChange={handleChange} name='smtp_password' value={smtp_password}/>

        </Box>
      </div>


      <FormGroup>
      <FormControlLabel  control={<Checkbox />} label="Use SSL" />
    </FormGroup>


    <div className='flex gap-6'>

        <Box   className='myTextField' sx={{'& .MuiTextField-root' : {
            width: '100%',
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
        }}}>
<TextField label='Sender Email'

InputProps={{
  startAdornment: <MdAttachEmail className='mr-2'/>
}}
onChange={handleChange} name='sender_email' value={sender_email}>

</TextField>

        </Box>


        <Box  className='myTextField' sx={{'& .MuiTextField-root' : {
            width: '100%',
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
        }}}>

           
        </Box>
    </div>



    <div className='mt-3 ml-2'> 
    <Box  className='myTextField' sx={{'& .MuiTextField-root' : {
            width: '100%',
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
        }}}>
      <TextField label='Api Key' 
      
      
InputProps={{
  startAdornment: <FaKey className='mr-2'/>
}}
      value={api_key} onChange={handleChange} name='api_key'>


      </TextField>
        </Box>
    </div>
    <Button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        Submit
      </Button>
    </form>
    </div>
    </Suspense>

    </>
  )
}

export default EmailSettings
