import {Link} from 'react-router-dom'
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

import {useState, useRef, useMemo, useEffect, useCallback} from 'react'
import * as React from 'react';

import {
  renderDigitalClockTimeView,
  renderTimeViewClock,
} from '@mui/x-date-pickers/timeViewRenderers';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Loader from '../loader/Loader'

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
// import DialogContentText from '@mui/material/DialogContentText';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
// import { IconButton } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import AlertTitle from '@mui/material/AlertTitle';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import PackageNotification  from '.././notification/PackageNotification'
import {useApplicationSettings} from '../settings/ApplicationSettings'
// import LoadingButton from '@mui/lab/LoadingButton';
// import AutorenewIcon from '@mui/icons-material/Autorenew';
// import CloseIcon from '@mui/icons-material/Close';

// import Autocomplete from '@mui/material/Autocomplete';
import { useDebounce } from 'use-debounce';
import {Button} from '../components/ui/button'
import { Autocomplete, InputAdornment } from '@mui/material';

import { ReloadIcon } from "@radix-ui/react-icons"
import toast, { Toaster } from 'react-hot-toast';



const EditPackage = ({open, handleClose, formData, loading, setFormData, showNotification, nameError, validityError,
  uploadBurstSpeedError, downloadBurstSpeedError,
  priceError, uploadLimitError, downloadLimitError,
  createPackage,offlineerror,isloading, validityPeriodUnitError,
  
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


const fetchRouters = useMemo(() => async ()=> {
  


  try {
    const response = await fetch('/api/routers',{
  
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
  console.log('formData,',formData)
  // const {value, id} = e.target
  setFormData({ ...formData, [e.target.id]: e.target.value });

//   const isComplete = name && price && upload_limit && download_limit && validity && validity_period_units && upload_burst_speed
//  && download_burst_speed ;
const isComplete = formData.name && formData.validity && formData.upload_limit && formData.download_limit && formData.price 
&& formData.upload_burst_limit && formData.download_burst_limit && formData.router_name








  setFormComplete(isComplete);
  }

  
  const theme = useTheme();

  const fullScreen = useMediaQuery(theme.breakpoints.down('sm', 'lg', 'md'));

 
  const fecthIpPools = useCallback(
    async() => {
  
  try {
      const response = await fetch('/api/ip_pools', {
          // headers: {
          //   'X-Subdomain': subdomain,
          // },
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
          value={formData.name} onChange={(e)=> onChange(e) } 
             placeholder='enter name...' label='package-name' fullWidth   ></TextField>

            </Box>
{settingsformData.use_radius ? (
null
): <>


<Autocomplete
            
            value={ipPool.find((pkg) => pkg.pool_name === formData.ip_pool) || null}
            options={ipPool}
            getOptionLabel={(option) => option.pool_name || ""}  // Ensure string label

            // getOptionLabel={(option) => option.name}
            renderInput={(params) => (
              <TextField  className='myTextField' {...params} label="ip pool" variant="outlined" fullWidth />
            )}
            onChange={(event, newValue) => {
              setFormData({ ...formData, ip_pool: newValue ? newValue.pool_name : '' });
            }}
            sx={{
              mt: 4,

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
                       
                      }}
          />
</>}
           

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
         
        }}   value={formData.price} className='myTextField'      id='price'
            onChange={e =>onChange(e)  }  type='number' fullWidth></TextField>

            <TextField label='upload-speed-limit(mbps)' id='upload_limit'  sx={{

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
            <TextField  label='download-speed-limit(mbps)'   id='download_limit'   sx={{

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
            </div>
           
           <div className='flex '>

           <Box
      sx={{
        '& > :not(style)': { m: 1, width: '40ch' },
      }}>
{settingsformData.use_radius ? (
  <>
  <TextField  label='upload-burst-speed(mbps)' 
             onChange={e => onChange(e)}
               value={formData.upload_burst_limit}    
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
               type='number'  fullWidth id='upload_burst_limit' className='myTextField'></TextField>
              <TextField    sx={{
  
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
  
           value={formData.download_burst_limit}      
                type='number' className='myTextField'  id='download_burst_limit'
             fullWidth></TextField>
  
  </>
): null}
           

           {settingsformData.use_radius ? (
             <>

             <TextField label='burst-period(s)'   sx={{
             
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
                      
                     }}    type='number'  placeholder='burst-period(s)...' 
                      className='myTextField'  id='' fullWidth></TextField>
                         <TextField label='burst-threshhold(mbps)'   sx={{
             
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
                      
                     }}    placeholder='burst-threshhold(mbps)...'   className='myTextField'  fullWidth></TextField>
                        
                         </>
           ): null}

</Box> 

           </div>
         

           <Stack sx={{ width: '100%' }} spacing={2}>
      
      <Alert severity="info">
        <AlertTitle>Speed Boost</AlertTitle>
        You can provide your customers with boosted speeds during off-peak hours. The boosted speeds will apply between the specified hours 
        and revert to regular limits during other hours
      </Alert>
      
    
    </Stack>

              <div className='flex gap-3 mt-2 justify-center'>


           {settingsformData.use_radius  ? (
 <>
 <TextField label='boosted-upload-speed-limit'   sx={{

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
       
      }}   type='number'  className='myTextField' placeholder='boosted-upload-speed-limit...' ></TextField>
          <TextField label='boosted-download-speed-limit'     sx={{

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
       
      }}   type='number' className='myTextField'  placeholder='boosted-download-speed-limit...'></TextField>
          <DemoContainer components={['TimePicker']}    sx={{

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
       
      }}  >
     <TimePicker          viewRenderers={{
          hours: renderTimeViewClock,
          minutes: renderTimeViewClock,
          seconds: renderTimeViewClock,
        }}   className='dark:text-black myTextField'
label="Boost Start Time" />

<TimePicker       viewRenderers={{
          hours: renderTimeViewClock,
          minutes: renderTimeViewClock,
          seconds: renderTimeViewClock,
        }}      className='dark:text-black myTextField'
label="Boost End Time" />


  </DemoContainer>
          </>
           ): ''}

           
              </div>
       

            <div className='mt-4 flex  flex-wrap'>
            <Box
      sx={{
        '& > :not(style)': { m: 1, width: '80ch' },
      }}>
            <TextField label='validity-period'   sx={{

'& label.Mui-focused': {
  color: 'black',
  fontSize:'16px'

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
         
        }}    className='myTextField' value={formData.validity}   
            id='validity' 
        onChange={e =>onChange(e)}   placeholder='validity-period...' type='number' ></TextField>

</Box>



<FormControl  


  sx={{
    '& > :not(style)': { m: 1, width: '50ch' },

'& label.Mui-focused': {
  color: 'black',
  fontSize:'16px'
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
         
        }}   >
        <InputLabel id="validity_period_units">Validity period units</InputLabel>
        <Select
          id="validity_period_units"
          label="Validity-period-units"
          
          value={formData.validity_period_units}
          onChange={e=> setFormData({...formData, validity_period_units: e.target.value})}

        >
          <MenuItem value={'days'}>days</MenuItem>
          <MenuItem value={'hours'}>hours</MenuItem>
        </Select>
      </FormControl>
            </div>



           
            <DialogActions>

{/* <Button  className='dotted-font p-5'    variant='outlined' onClick={handleClose}  >Cancel</Button> */}


<button   onClick={(e)=> {
handleClose()
e.preventDefault()
}  } className='bg-red-600 text-white rounded-3xl px-4 py-2
          transform hover:scale-110 transition duration-500 hover:bg-red-200  
          text-lg ' >

            Cancel
          </button>
{/* 
<Button  

  type='submit'  
  color={`${formData.name && formData.validity && formData.upload_limit && formData
    .download_limit && formData.price && formData.upload_burst_limit && formData.download_burst_limit !== null ? 'success' : 'primary'}`}
  variant='outlined'  
  disabled={!formComplete || submitting} >
  {submitting ? 'Submitting...' : 'Save'}
</Button>  */}




{/* 
<Button variant='outline'  type='submit' className='dotted-font p-5' >Save
            <ReloadIcon className={`ml-2 h-4 w-4  ${isloading ? 'animate-spin' : 'hidden'}  `} />

            </Button> */}

<button className='bg-black text-white rounded-3xl px-4 py-2
          transform hover:scale-110 transition duration-500 hover:bg-green-500
          text-lg' type="submit">

            Save
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















