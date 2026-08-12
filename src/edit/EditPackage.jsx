import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
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
import Switch from '@mui/material/Switch';
import InputAdornment from '@mui/material/InputAdornment';
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
import { Gauge, ShieldAlert, Database } from 'lucide-react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import {useState,useMemo, useEffect, useCallback} from 'react'

import { 
  
  CircularProgress, 
} from '@mui/material'
import { Server } from 'lucide-react'



const EditPackage = ({open, handleClose, formData, loading, setFormData, showNotification, 
  nameError, validityError,
  uploadBurstSpeedError, downloadBurstSpeedError,
  priceError, uploadLimitError, downloadLimitError,
  createPackage,offlineerror,isloading, validityPeriodUnitError,
  editPackage, allPackages,selectedRouter, setSelectedRouter
  
   }) => {
const [error, setError] = useState('')
const [message, setMessage] = useState('')
const [routers, setRouters]= useState ([])
const [formComplete, setFormComplete] = useState(false);
const [submitting, setSubmitting] = useState(false);
const [mikrotik_router, setRouter] = useState(null)
const [ipPool, setIpPool] = useState([])
const [loadingRouters, setLoadingRouters] = useState(false)
const [routerDetails, setRouterDetails] = useState(null)
const {router_name} = formData
const { settingsformData } = useApplicationSettings()





function useIsDarkMode() {
  const [isDark, setIsDark] = useState(
    () => typeof document !== 'undefined' &&
      document.documentElement.classList.contains('dark')
  );

  useEffect(() => {
    const root = document.documentElement;

    const update = () => setIsDark(root.classList.contains('dark'));
    update();

    const observer = new MutationObserver(update);
    observer.observe(root, { attributes: true, attributeFilter: ['class'] });

    return () => observer.disconnect();
  }, []);

  return isDark;
}




const isDark = useIsDarkMode();

const tableTheme = useMemo(() => createTheme({
  palette: {
    mode: isDark ? 'dark' : 'light',
    background: {
      paper: isDark ? '#1e1e1e' : '#ffffff',
      default: isDark ? '#1e1e1e' : '#ffffff',
    },
    text: {
      primary: isDark ? '#f1f1f1' : '#1a1a1a',
      secondary: isDark ? '#a3a3a3' : '#6b7280',
    },
  },
}), [isDark]);



useEffect(() => {
  
  setRouter(router_name)

}, [router_name]);

const [routerName] = useDebounce(router_name, 1000)

const subdomain = window.location.hostname.split('.')[0]

const fetchRouters = useCallback(async () => {
  try {
    setLoadingRouters(true)
    const response = await fetch('/api/routers', {
      headers: { 'X-Subdomain': subdomain }
    })
    const data = await response.json()
    setRouters(data || [])
    
    // Pre-select if editing
    if (formData?.id && formData?.nas_router) {
      setSelectedRouter(formData.nas_router)
      const router = data.find(r => r.name === formData.nas_router)
      if (router) setRouterDetails(router)
    }
  } catch (error) {
    toast.error('Failed to load routers')
  } finally {
    setLoadingRouters(false)
  }
}, [formData, subdomain])




useEffect(() => {
  if (open) {
    fetchRouters()
  }
}, [open, fetchRouters])


// ── FUP helpers ───────────────────────────────────────────────────────────
const fupEnabled = !!formData.fup_enabled
const fupDataUnit = formData.fup_data_unit || 'GB'

// Plans eligible as a throttle target: must have a lower download speed
// than the plan currently being edited.
const eligibleFupPlans = useMemo(() => {
  const currentDownload = Number(formData.download_limit) || 0
  if (!Array.isArray(allPackages)) return []
  return allPackages.filter((pkg) => {
    if (editPackage && pkg.id === formData.id) return false
    return Number(pkg.download_limit) < currentDownload
  })
}, [allPackages, formData.download_limit, formData.id, editPackage])

const toggleFup = (e) => {
  const checked = e.target.checked
  setFormData({
    ...formData,
    fup_enabled: checked,
    ...(checked ? {} : { fup_data_limit: '', fup_throttle_plan_id: '' }),
  })
}

const onFupUnitChange = (e) => {
  setFormData({ ...formData, fup_data_unit: e.target.value })
}

const onFupThrottlePlanChange = (e) => {
  setFormData({ ...formData, fup_throttle_plan_id: e.target.value })
}



const handleRouterChange = (e) => {
  const routerName = e.target.value
  setSelectedRouter(routerName)
  const selected = routers.find(r => r.name === routerName)
  setRouterDetails(selected || null)
  setFormData({
    ...formData,
    router_name: selected?.name || '',
     nas_router: selected?.name || ''
  })
}



const onChange = (e) =>{
  setFormData({ ...formData, [e.target.id]: e.target.value });

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
          <ThemeProvider theme={tableTheme}>
    
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

           

            <div className='flex  gap-3 mt-4 font-sans
'>
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
        <AlertTitle> <p className='font-sans
'>Speed Boost </p></AlertTitle>

        <p className='font-sans
'>You can provide your customers with boosted speeds during off-peak hours. The boosted speeds will apply between the specified hours 
        and revert to regular limits during other hours </p>
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








{/* Router Selection */}
<div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
  <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
    <Server className="w-5 h-5" />
    Select Router *
  </h3>

  {loadingRouters ? (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <CircularProgress size={30} />
      <span style={{ marginLeft: '12px' }}>Loading routers...</span>
    </div>
  ) : routers.length === 0 ? (
    <Alert severity="warning">No routers found. Add a router first.</Alert>
  ) : (
    <>
      <FormControl fullWidth style={{ marginBottom: '12px' }}>
        <InputLabel>Select Router</InputLabel>
        <Select value={selectedRouter} onChange={handleRouterChange} label="Select Router">
          <MenuItem value=""><em>Choose a router...</em></MenuItem>
          {routers.map((router) => (
            <MenuItem key={router.id} value={router.name}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Server className="w-4 h-4" />
                {router.name}
              </div>
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {routerDetails && (
        <div style={{ padding: '12px', backgroundColor: 'white', borderRadius: '6px', borderLeft: '4px solid #2196F3' }}>
          <p style={{ fontWeight: 'bold', marginBottom: '8px' }}>Selected Router:</p>
          <div style={{ fontSize: '13px' }}>
            <div>Name: <strong>{routerDetails.name}</strong></div>
            <div>IP: <strong>{routerDetails.ip_address}</strong></div>
          </div>
        </div>
      )}
    </>
  )}
</div>







{/* ── Fair Usage Policy (FUP) ─────────────────────────────────────────── */}
<Stack sx={{ width: '100%', mt: 3 }}>
  <Box
    sx={{
      border: '1px solid',
      borderColor: fupEnabled ? 'rgba(16,185,129,0.4)' : 'rgba(0,0,0,0.12)',
      borderRadius: '20px',
      p: { xs: 2, sm: 3 },
      transition: 'border-color .3s ease, background-color .3s ease',
      backgroundColor: fupEnabled ? 'rgba(16,185,129,0.04)' : 'transparent',
    }}
  >
    <div className='flex items-start justify-between gap-3 flex-wrap'>
      <div className='flex items-start gap-3'>
        <div
          className='flex items-center justify-center rounded-2xl shrink-0'
          style={{
            width: 44, height: 44,
            background: fupEnabled ? 'rgba(16,185,129,0.12)' : 'rgba(0,0,0,0.05)',
            color: fupEnabled ? '#10b981' : '#6b7280',
          }}
        >
          <Gauge size={22} />
        </div>
        <div>
          <p className='font-semibold text-base m-0' font-sans
>Fair Usage Policy (FUP)</p>
          <p className='text-sm text-gray-500 font-sans
 dark:text-gray-400 m-0 mt-1 max-w-md'>
            FUP automatically throttles customers to a lower-speed plan when they exceed
            their data limit within a billing cycle. The customer is restored to their
            original plan when they renew.
          </p>
        </div>
      </div>

      <Switch
        checked={fupEnabled}
        onChange={toggleFup}
        sx={{
          '& .MuiSwitch-switchBase.Mui-checked': { color: '#10b981' },
          '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#10b981' },
        }}
        inputProps={{ 'aria-label': 'Enable FUP for this plan' }}
      />
    </div>

    {fupEnabled && (
      <div className='mt-4 space-y-4' style={{ animation: 'fupFadeIn .25s ease' }}>

        {/* Data limit + unit */}
        <div className='flex gap-3 items-start flex-wrap sm:flex-nowrap'>
          <TextField
            label='Data Limit'
            type='number'
            id='fup_data_limit'
            placeholder='e.g. 500'
            className="myTextField"
            value={formData.fup_data_limit || ''}
            onChange={(e) => onChange(e)}
            InputProps={{
              startAdornment: <Database className='mr-2 w-5 h-5 text-gray-500' />,
            }}
            helperText={
              formData.fup_data_limit
                ? `Limit: ${Number(formData.fup_data_limit).toLocaleString()} ${fupDataUnit}`
                : 'Set the data threshold for this plan'
            }
            sx={{
              flex: 2,
              '& label.Mui-focused': { color: '#10b981' },
              '& .MuiOutlinedInput-root': {
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#10b981',
                  borderWidth: '2px',
                },
              },
            }}
            fullWidth
          />

          <FormControl sx={{ flex: 1, minWidth: 120 }}>
            <InputLabel id='fup-unit-label'>Unit</InputLabel>
            <Select
              labelId='fup-unit-label'
              id='fup_data_unit'
              value={fupDataUnit}
              label='Unit'
              onChange={onFupUnitChange}
              sx={{
                borderRadius: '8px',
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#10b981',
                  borderWidth: '2px',
                },
              }}
            >
              <MenuItem value='GB'>GB</MenuItem>
              <MenuItem value='TB'>TB</MenuItem>
            </Select>
          </FormControl>
        </div>

        {/* Throttle plan */}
        <FormControl fullWidth error={eligibleFupPlans.length === 0}>
          <InputLabel id='fup-throttle-plan-label'>
            Throttle Plan (plan to switch to when limit exceeded)
          </InputLabel>
          <Select
            labelId='fup-throttle-plan-label'
            id='fup_throttle_plan_id'
            value={formData.fup_throttle_plan_id || ''}
            label='Throttle Plan (plan to switch to when limit exceeded)'
            onChange={onFupThrottlePlanChange}
            disabled={eligibleFupPlans.length === 0}
            sx={{
              borderRadius: '8px',
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: '#10b981',
                borderWidth: '2px',
              },
            }}
          >
            {eligibleFupPlans.map((pkg) => (
              <MenuItem key={pkg.id} value={pkg.id}>
                {pkg.name} — {pkg.download_limit} Mbps
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {eligibleFupPlans.length === 0 && (
          <Alert
            severity='warning'
            icon={<ShieldAlert size={18} />}
            sx={{ borderRadius: '12px' }}
          >
            No eligible FUP plans found. Create a plan with a lower download speed first.
            Current plan speed: {formData.download_limit || 0} Mbps.
          </Alert>
        )}
      </div>
    )}
  </Box>
</Stack>

<style>{`
  @keyframes fupFadeIn {
    from { opacity: 0; transform: translateY(-6px); }
    to   { opacity: 1; transform: translateY(0); }
  }
`}</style>


           <DialogActions>
  <button
    onClick={(e) => {
      handleClose()
      e.preventDefault()
    }}
    disabled={isloading}
    className='bg-red-600 text-white rounded-3xl px-4 py-2
      transform hover:scale-110 transition duration-500 hover:bg-red-200
      text-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100' font-sans

  >
    Cancel
  </button>

  <button
    type="submit"
    disabled={isloading}
    className='bg-black text-white rounded-3xl px-4 py-2 min-w-[110px]
      transform hover:scale-110 transition duration-500 hover:bg-green-500
      text-lg flex items-center justify-center gap-2
      disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100'
  >
    {isloading ? (
      <>
        <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full
         animate-spin" />
        {editPackage ? <p className='font-sans
'>Updating…</p> : <p className='font-sans
'>Saving… </p>}
      </>
    ) : (
      editPackage ? <p className='font-sans
'>Update</p> : <p className='font-sans
'>Save</p>
    )}
  </button>
</DialogActions>
            </form>
          {showNotification &&   <PackageNotification/>}
          {offlineerror   && <p className='text-red-500 font-sans font-extrabold '>Something went wrong please try again later
          </p>}
        </DialogContent>
      
      </Dialog>
    </React.Fragment>
     </ThemeProvider>


  )
}

export default EditPackage