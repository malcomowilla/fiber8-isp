import {Link} from 'react-router-dom'
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

import {useState, useRef, useMemo, useEffect} from 'react'
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
import DialogContentText from '@mui/material/DialogContentText';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { IconButton } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import AlertTitle from '@mui/material/AlertTitle';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import PackageNotification  from '.././notification/PackageNotification'

import Button from '@mui/material/Button';

import LoadingButton from '@mui/lab/LoadingButton';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import CloseIcon from '@mui/icons-material/Close';

import Autocomplete from '@mui/material/Autocomplete';
import { useDebounce } from 'use-debounce';

const EditPackage = ({open, handleClose, formData, loading, setFormData, showNotification
  ,createPackage,offlineerror,isloading, 
   }) => {

const [error, setError] = useState('')
const [message, setMessage] = useState('')
const [routers, setRouters]= useState ([])
const [formComplete, setFormComplete] = useState(false);
const [submitting, setSubmitting] = useState(false);
const [mikrotik_router, setRouter] = useState(null)

const {router_name} = formData


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

 


  return (
    <React.Fragment>
     {/* onClick={handleClickOpen */}

      {/* <IconButton  style={{color: 'black'}} >
      <EditIcon />
    </IconButton> */}
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullScreen={fullScreen}
        fullWidth={true}
        maxWidth={'xl'}
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
         
        }}   id='name'  className='myTextField' value={formData.name} onChange={(e)=> onChange(e) } 
         error={!formData.name}    helperText={!formData.name ? 'required' : ''}
             placeholder='enter name...' label='package-name' fullWidth   ></TextField>

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
         
        }}   value={formData.price} className='myTextField'    error={!formData.price}    helperText={!formData.price? 'required' : ''} id='price'
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
         
        }}   value={formData.upload_limit}    error={!formData.upload_limit}    helperText={!formData.upload_limit ? 'required' : ''}  className='myTextField' onChange={e =>onChange(e)} 
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
         
        }}   className='myTextField' value={formData.download_limit}     error={!formData.download_limit}  
          helperText={!formData.download_limit ? 'required' : ''}  onChange={e =>onChange(e)} type='number' 
      fullWidth></TextField>
            </div>
           
           <div className='flex   '>

           <Box
      sx={{
        '& > :not(style)': { m: 1, width: '40ch' },
      }}>

           <TextField  label='upload-burst-speed(mbps)' 
           onChange={e =>onChange(e)}
             value={formData.upload_burst_limit}    error={!formData.upload_burst_limit}    helperText={!formData.upload_burst_limit ? 'required' : ''}  sx={{

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

         value={formData.download_burst_limit}     error={!formData.download_burst_limit}  
           helperText={!formData.download_burst_limit ? 'required' : ''}   type='number' className='myTextField'  id='download_burst_limit'
           fullWidth></TextField>
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
         
        }}    type='number'  placeholder='burst-period(s)...'  className='myTextField'  id='' fullWidth></TextField>
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
          error={!formData.validity}    helperText={!formData.validity ? 'required' : ''}   id='validity' 
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
          error={!formData.validity_period_units}    helperText={!formData.validity_period_units ? 'required' : ''}
          value={formData.validity_period_units}
          onChange={e=> setFormData({...formData, validity_period_units: e.target.value})}

        >
          <MenuItem value={'days'}>days</MenuItem>
          <MenuItem value={'hours'}>hours</MenuItem>
        </Select>
      </FormControl>
            </div>



              <Autocomplete
                      value={routers.find((router)=> router.name === mikrotik_router)|| null}

  sx={{

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
             
            }} fullWidth

            
                  getOptionLabel={(router) => router.name}

        options={routers}
        
                renderInput={(params) => (
                  <TextField
                  id="router_name"
                  getOptionValue={(option) => option.id}   // Function to extract the value from the option object

                  className='myTextField'
                    {...params}
                    label="Select Router"
                    error={!formData.router_name}
                    helperText={!formData.router_name ? 'required' : ''}

                   
                  />
                )}
              
                onChange={(event, newValue) => {
                  console.log("Selected Router:", newValue);

                  setFormData({...formData, router_name: newValue ? newValue.name : '' });
                }}

                renderOption={(props, routerName) => (
                  <Stack
                    direction='row'
                    spacing={2}
                    sx={{
                      width: '100%',
                      padding: 1,
                      '&:hover': {
                        backgroundColor: 'rgba(0, 0, 0, 0.1)',
                        display: 'flex',
                        flexDirection: 'start'
                      }
                    }}
                    {...props}
                  >
                   <img  className='w-[60px] h-[50px]' src="/images/icons8-router-80.png" alt="router" />
                    <Stack direction='column'>
                    <span>{routerName.name}</span>
                    </Stack>
                  
                  </Stack>
                  
                )}
              />
              
           
            <DialogActions>

<Button color='error'  startIcon={<CloseIcon/>}  variant='outlined' onClick={handleClose}  >Cancel</Button>


{/* 
<Button  

  type='submit'  
  color={`${formData.name && formData.validity && formData.upload_limit && formData
    .download_limit && formData.price && formData.upload_burst_limit && formData.download_burst_limit !== null ? 'success' : 'primary'}`}
  variant='outlined'  
  disabled={!formComplete || submitting} >
  {submitting ? 'Submitting...' : 'Save'}
</Button>  */}


<LoadingButton  loadingPosition= 'start' startIcon={<AutorenewIcon/>} type='submit' disabled={Object.values(formData  )?.includes("")}
 loading={isloading} color='success'
    variant='outlined'   >


  save
</LoadingButton>




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















