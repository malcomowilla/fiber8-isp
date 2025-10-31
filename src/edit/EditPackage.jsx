import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import {useState,useMemo, useEffect, useCallback} from 'react'
import * as React from 'react';
import {
  renderTimeViewClock,
} from '@mui/x-date-pickers/timeViewRenderers';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import AlertTitle from '@mui/material/AlertTitle';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import PackageNotification  from '.././notification/PackageNotification'
import {useApplicationSettings} from '../settings/ApplicationSettings'
import { useDebounce } from 'use-debounce';
import { Autocomplete} from '@mui/material';
import toast, { Toaster } from 'react-hot-toast';
import { PiMoneyThin } from "react-icons/pi";
import { CiWifiOn } from "react-icons/ci";
import { FaLongArrowAltUp } from "react-icons/fa";
import { FaLongArrowAltDown } from "react-icons/fa";
import { IoMdTime } from "react-icons/io";
import { PiNumberOne } from "react-icons/pi";
import { MdOutlineAttachMoney } from "react-icons/md";



const EditPackage = ({open, handleClose, formData, loading, setFormData, showNotification, 
  nameError, validityError,
  uploadBurstSpeedError, downloadBurstSpeedError,
  priceError, uploadLimitError, downloadLimitError,
  createPackage,offlineerror,isloading, validityPeriodUnitError,
  editPackage
  
   }) => {
const [error, setError] = useState('')
const [message, setMessage] = useState('')
const [routers, setRouters]= useState ([])
const [formComplete, setFormComplete] = useState(false);
const [submitting, setSubmitting] = useState(false);
const [mikrotik_router, setRouter] = useState(null)
const [ipPool, setIpPool] = useState([])

const {router_name} = formData
const { settingsformData } = useApplicationSettings()

useEffect(() => {
  
  setRouter(router_name)
  console.log('router_name',router_name )

}, [router_name]);
// const {price, download_limit, upload_limit, validity, name, upload_burst_limit, download_burst_limit,
//   validity_period_units, tx_rate_limit, rx_rate_limit} = formData

const [routerName] = useDebounce(router_name, 1000)

console.log(routerName)
const subdomain = window.location.hostname.split('.')[0]


const fetchRouters = useMemo(() => async ()=> {
  


  try {
    const response = await fetch('/api/routers',{
      method: 'GET',
      headers: {
        'X-Subdomain': subdomain,
      },
  
    }
  
  
  )
  
    const newData = await response.json()
  if (response.ok) {
    console.log('router',newData)
    setRouters(newData)

  } else {
    console.log('failed to fetch routers')

  }
  
  } catch (error) {
    
    console.log(error)
  
  }
  
  
  }, [])
  



  useEffect(() => {
    
    fetchRouters()
  }, [ fetchRouters, routerName]);







const onChange = (e) =>{
  console.log('formData onchage edit package,',formData)
  // const {value, id} = e.target
  setFormData({ ...formData, [e.target.id]: e.target.value });

//   const isComplete = name && price && upload_limit && download_limit && validity && validity_period_units && upload_burst_speed
//  && download_burst_speed ;






  }

  
  const theme = useTheme();

  const fullScreen = useMediaQuery(theme.breakpoints.down('sm', 'lg', 'md'));
 
  const fecthIpPools = useCallback(
    async() => {
  
  try {
      const response = await fetch('/api/ip_pools', {
          headers: {
            'X-Subdomain': subdomain,
          },
      })
  
      const newData = await response.json()
      if (response.ok) {
  console.log('ip pools',newData)
  setIpPool(newData)
    
      }else{
  toast.error(
      'Failed to get ip pools',
      {
        position: 'top-center',
        duration: 4000,
      }
  )
      }
  } catch (error) {
      toast.error('Failed to get ip pools internal server error', {
        position: 'top-center',
        duration: 3000,
      })
  }
    },
    [],
  
  
  )
  
  
  useEffect(() => {
      
     fecthIpPools()
  }, [fecthIpPools]);


  return (
    <React.Fragment>
      <Toaster />
     {/* onClick={handleClickOpen */}

      {/* <IconButton  style={{color: 'black'}} >
      <EditIcon />
    </IconButton> */}
      <Dialog
      sx={{
        borderRadius: '150px'
      }}
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullScreen={fullScreen}
        fullWidth={true}
        maxWidth={'lg'}
      >
        
        <DialogContent >
            <form onSubmit={createPackage} >
            <Box
      sx={{
        '&.MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': { m: 1, width: '50ch' , border: 0},
        "&.MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline":
        {
          border: 0,
        },
      }}>
            <TextField   sx={{

'& label.Mui-focused': {
  color: 'black',
  fontSize: '17px'

  },
'& .MuiOutlinedInput-root': {
"&.Mui-focused .MuiOutlinedInput-notchedOutline": {
  borderColor: "black",
  borderWidth: '3px'
  },
'&.Mui-focused fieldset':  {
  borderColor: 'black', 
  

}
},
         
        }}   id='name'  className='myTextField' 
         InputProps={{
                startAdornment: <CiWifiOn  className='mr-2 w-6 h-6'/>,
              }}
          value={formData.name} onChange={(e)=> onChange(e) } 
             placeholder='enter name...' label='package-name' fullWidth ></TextField>



            </Box>

           

            <div className='flex  gap-3 mt-4'>
          <TextField label='bundle-price'   sx={{

'& label.Mui-focused': {
  color: 'black',
  fontSize: '17px'

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
         
        }
      
      } 
        
         InputProps={{
                startAdornment: <PiMoneyThin  className='mr-2 w-6 h-6'/>,
              }}
        value={formData.price} className='myTextField'      id='price'
            onChange={e =>onChange(e)  }  type='number' fullWidth></TextField>



            <TextField label='upload-speed-limit(mbps)'
              InputProps={{
                startAdornment: <FaLongArrowAltUp  className='mr-2 w-5 h-5'/>,
              }}
            
              
            id='upload_limit'  sx={{

'& label.Mui-focused': {
  color: 'black'
  },
'& .MuiOutlinedInput-root': {
"&.Mui-focused .MuiOutlinedInput-notchedOutline": {
  borderColor: "black",
  borderWidth: '3px',
  },
'&.Mui-focused fieldset':  {
  borderColor: 'black', // Set border color to transparent when focused

}
},
         
        }}   value={formData.upload_limit}         className='myTextField' onChange={e =>onChange(e)} 
            type='number' placeholder='upload-speed-limit(mbps)...' fullWidth></TextField>


            <TextField  label='download-speed-limit(mbps)'
             InputProps={{
                startAdornment: <FaLongArrowAltDown  className='mr-2 w-5 h-5'/>,
              }}
            id='download_limit'   sx={{

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
         
        }}   className='myTextField' value={formData.download_limit}    
            onChange={e =>onChange(e)} type='number' 
      fullWidth></TextField>




             <TextField   
              
               InputProps={{
                startAdornment:<> <PiNumberOne className='mr-2 w-5 h-5'/> <p 
                className='text-black dark:text-white'
                >:</p> </>,
              }}
              sx={{
  
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
           
          }}   label='Aggregation'
  
             onChange={e => onChange(e)}
           value={formData.aggregation}
                 className='myTextField'  id='aggregation'
             fullWidth></TextField>
            </div>
           
          

          
          <div className='mt-2'>
 <TextField  label='daily charge'
   InputProps={{
                startAdornment: <MdOutlineAttachMoney  className='mr-2 w-5 h-5'/>,
              }}
             onChange={e => onChange(e)}

               value={formData.daily_charge}
                    sx={{
  
  '& label.Mui-focused': {
    color: 'black'
    },
  '& .MuiOutlinedInput-root': {
  "&.Mui-focused .2MuiOutlinedInput-notchedOutline": {
    borderColor: "black",
    borderWidth: '3px'
    },
  '&.Mui-focused fieldset':  {
    borderColor: 'black', // Set border color to transparent when focused
  
  }
  },
           
          }}  
                 fullWidth id='daily_charge' className='myTextField'></TextField>



          </div>
         


<div className='flex  gap-3 mt-4'>
  <TextField  label='Burst Threshold Download(mbps)'
   InputProps={{
                startAdornment: <FaLongArrowAltDown  className='mr-2 w-5 h-5'/>,
              }}
             onChange={e => onChange(e)}

               value={formData.burst_threshold_download}
                    sx={{
  
  '& label.Mui-focused': {
    color: 'black'
    },
  '& .MuiOutlinedInput-root': {
  "&.Mui-focused .2MuiOutlinedInput-notchedOutline": {
    borderColor: "black",
    borderWidth: '3px'
    },
  '&.Mui-focused fieldset':  {
    borderColor: 'black', // Set border color to transparent when focused
  
  }
  },
           
          }}  
                 fullWidth id='burst_threshold_download' className='myTextField'></TextField>



        <TextField  label='Burst Threshold Upload(mbps)'
   InputProps={{
                startAdornment: <FaLongArrowAltUp  className='mr-2 w-5 h-5'/>,
              }}
             onChange={e => onChange(e)}

               value={formData.burst_threshold_upload}
                    sx={{
  
  '& label.Mui-focused': {
    color: 'black'
    },
  '& .MuiOutlinedInput-root': {
  "&.Mui-focused .2MuiOutlinedInput-notchedOutline": {
    borderColor: "black",
    borderWidth: '3px'
    },
  '&.Mui-focused fieldset':  {
    borderColor: 'black', // Set border color to transparent when focused
  
  }
  },
           
          }}  
                 fullWidth id='burst_threshold_upload' className='myTextField'></TextField>
</div>
           <Stack sx={{ width: '100%', mt: 2 }} spacing={2}>
      
      <Alert severity="info">
        <AlertTitle>Speed Boost</AlertTitle>
        You can provide your customers with boosted speeds during off-peak hours. The boosted speeds will apply between the specified hours 
        and revert to regular limits during other hours
      </Alert>
      
    
    </Stack>

            <div className='flex  mt-2'>

           <Box
      sx={{
        '& > :not(style)': { m: 1, width: '40ch' },
      }}>

        
  <>
  <TextField  label='upload-burst-speed(mbps)' 
   InputProps={{
                startAdornment: <FaLongArrowAltUp  className='mr-2 w-5 h-5'/>,
              }}
             onChange={e => onChange(e)}

               value={formData.burst_upload_speed}    
                    sx={{
  
  '& label.Mui-focused': {
    color: 'black'
    },
  '& .MuiOutlinedInput-root': {
  "&.Mui-focused .2MuiOutlinedInput-notchedOutline": {
    borderColor: "black",
    borderWidth: '3px'
    },
  '&.Mui-focused fieldset':  {
    borderColor: 'black', // Set border color to transparent when focused
  
  }
  },
           
          }}  
                 fullWidth id='burst_upload_speed' className='myTextField'></TextField>



              <TextField   
              
               InputProps={{
                startAdornment: <FaLongArrowAltDown className='mr-2 w-5 h-5'/>,
              }}
              sx={{
  
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
           
          }}   label='download-burst-speed(mbps)'    onChange={e =>onChange(e)}
  
           value={formData.burst_download_speed}      
                 className='myTextField'  id='burst_download_speed'
             fullWidth></TextField>



              <TextField   
              
               InputProps={{
                startAdornment: <IoMdTime className='mr-2 w-5 h-5'/>,
              }}
              sx={{
  
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
           
          }}   label='burst time(s)'
  
           value={formData.burst_time}
            onChange={e => onChange(e)}
                type='number' className='myTextField'  id='burst_time'
             fullWidth></TextField>






  
  </>
           


</Box> 

           </div>
    

           
            <DialogActions>



<button   onClick={(e)=> {
handleClose()
e.preventDefault()
}  } className='bg-red-600 text-white rounded-3xl px-4 py-2
          transform hover:scale-110 transition duration-500 hover:bg-red-200  
          text-lg ' >

            Cancel
          </button>


<button className='bg-black text-white rounded-3xl px-4 py-2
          transform hover:scale-110 transition duration-500 hover:bg-green-500
          text-lg' type="submit">

            {editPackage ? 'Update' : 'Save'}
          </button>

</DialogActions>
            </form>
          {showNotification &&   <PackageNotification/>}
          {offlineerror   && <p className='text-red-500 font-mono font-extrabold'>Something went wrong please try again later
          </p>}
        </DialogContent>
      
      </Dialog>
    </React.Fragment>


  )
}

export default EditPackage















