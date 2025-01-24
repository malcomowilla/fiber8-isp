import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Backdrop from '../backdrop/Backdrop'
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import AlertTitle from '@mui/material/AlertTitle';
import Autocomplete from '@mui/material/Autocomplete';
import { useDebounce } from 'use-debounce';

import { Button } from "@/components/ui/button"

// import LoadingButton from '@mui/lab/LoadingButton';
import AutorenewIcon from '@mui/icons-material/Autorenew';
// import CloseIcon from '@mui/icons-material/Close';

import {useState, useEffect,  useCallback, useMemo,
  createContext, useContext,Suspense, lazy
} from 'react'
import { useApplicationSettings } from './ApplicationSettings';
import { makeStyles } from '@material-ui/core/styles';
const SettingsNotification = lazy(() => import('../notification/SettingsNotification'))

import toast, { Toaster } from 'react-hot-toast';
import UiLoader from '../uiloader/UiLoader'



const useStyles = makeStyles(theme => ({
  customTooltip: {
    backgroundColor: 'gray',
  },
  customArrow: {
    color: 'rgba(220, 0, 78, 0.8)',
  },
}));



const GeneralContext = createContext(null)


const GeneralSettings = ({children}) => {
  const { handleChange, settingsformData, isloading, setisloading,
     setFormData, companySettings, setCompanySettings} = useApplicationSettings();


     const {contact_info, company_name, email_info, logo_url,
      agent_email,customer_support_email,customer_support_phone_number  ,
      
     } =
     companySettings;


  const [ routerName] = useDebounce( settingsformData.router_name, 1000)

const [checkedData,  setCheckedData] = useState('')
const [open, setOpen] = useState(false);
const [openNotifactionSettings, setOpenSettings] = useState(false)
const [routers, setRouters]= useState ([])
const [mikrotik_router, setRouter] = useState(null)
console.log('checked data', checkedData)

const classes = useStyles();

// useEffect(() => {
//   if (settingsformData.router_name) {
//     setRouter(routers.find(router => router.name === settingsformData.router_name));
//   }
// }, [settingsformData.router_name, routers]);






const handleGetCompanySettings = useCallback(
  async() => {
    try {
      const response = await fetch('/api/get_company_settings', {
      })
      const newData = await response.json()
      if (response.ok) {
        // setcompanySettings(newData)
        const { contact_info, company_name, email_info, logo_url,
          customer_support_phone_number,agent_email ,customer_support_email
         } = newData
        setCompanySettings((prevData)=> ({...prevData, 
          contact_info, company_name, email_info,
          customer_support_phone_number,agent_email ,customer_support_email,
        
          logo_preview: logo_url
        }))

        console.log('company settings fetched', newData)
      }else{
        console.log('failed to fetch company settings')
      }
    } catch (error) {
      toast.error('internal servere error  while fetching company settings')
    
    }
  },
  [setCompanySettings],
)

useEffect(() => {
  
  handleGetCompanySettings()
  
}, [handleGetCompanySettings])






















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







useEffect(() => {
  setRouter(settingsformData.router_name)

  console.log('package_name', )
}, [ settingsformData.router_name ]);


useEffect(() => {
  const fetchRouters =  async() => {


    try {
      const response = await fetch('/api/router_settings')
const newData = await response.json()
      if (response) {
        console.log('fetched router settings', newData)
        const {router_name} = newData[0]
        setFormData({...settingsformData, router_name})
        setRouter(router_name)
      } else {
        toast.error('failed to fetch router settings', {
          duration: 7000,
          position: "top-center",
        });
      }
    } catch (error) {
      toast.error('failed to fetch router settings', {
        duration: 7000,
        position: "top-center",
      });
      
    }
  }
  fetchRouters()
}, []);

       const handleUpdateSettings = async(e)=> {
        e.preventDefault()

        try {
          setisloading(true)
          setOpen(true)
          const url =  '/api/router_settings' 
         const method =   'POST' 

         const response = await fetch(url, {
          method,
          headers: {
            "Content-Type"  : 'application/json'
          },

          body: JSON.stringify(
            settingsformData
          )
         },
        
        
        )


        const newData1 = await response.json()

        if (response.ok) {
          // const {prefix, minimum_digits, check_update_username, check_update_password } = newData[0]

          
const prefix = newData1.prefix
const minimum_digits = newData1.minimum_digits
const check_update_username = newData1.check_update_username
const check_update_password  = newData1.check_update_password 
const welcome_back_message = newData1.welcome_back_message
const router_name = newData1.router_name
// setCheckedData(newData1)
          localStorage.setItem("checkedtrueData2", JSON.stringify({check_update_username,  check_update_password,
            welcome_back_message, router_name
          }))
          setFormData({...settingsformData, prefix,  minimum_digits, router_name, check_update_username,
             check_update_password,
             welcome_back_message
           })
toast.success('settings updated successfully', {
  position: "top-center",
  duration: 7000,
  
})
          setisloading(false)
          setOpen(false)
          setOpenSettings(true)
          setRouter(routers.find(router => router.name === settingsformData.router_name));

        } else {
          setOpen(false)
          toast.error('failed to update settings', {
            position: "top-center",
            duration: 7000,
            
          })
          console.log('not created')
          setisloading(false)
          setOpenSettings(false)
        }
        } catch (error) {
          toast.error(
            'Failed to update settings something went wrong',
            {
              position: "top-center",
              duration: 7000,
              
            }
          )
          console.log(error)
          setisloading(false)
          setOpenSettings(false)
        }
       }

       const handleClose = () => {
         setOpen(false);
       };
   
       
       const handleCloseNotifaction = () => {
        setOpenSettings(false);
      };

    


const handleFormDataChangeForCompany = (e) => {
  setCompanySettings((prevData)=> ({...prevData, [e.target.name]: e.target.value}))
}






const handleImageChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    setCompanySettings(prevData => ({
      ...prevData,
      logo: file,
      logo_preview: URL.createObjectURL(file)
    }));
  }
};





const handleCreateCompanySettings = async (e) => {
  e.preventDefault()
try {
  setisloading(true)
  const formData = new FormData();
  formData.append('company_name', companySettings.company_name);
  formData.append('contact_info', companySettings.contact_info);
  formData.append('email_info', companySettings.email_info);
  formData.append('agent_email', companySettings.agent_email);
  formData.append('customer_support_phone_number', companySettings.customer_support_phone_number);
  formData.append('customer_support_email', companySettings.customer_support_email);




  if (companySettings.logo) {
    formData.append('logo', companySettings.logo);
  }
  const response = await fetch('/api/company_settings', {
    method: 'POST',
   
    body: formData
  })


  const newData = await response.json()
  if (response.ok) {
    console.log('company settings created', newData)
    const { contact_info, company_name, email_info, logo_url,
      agent_email,customer_support_email,customer_support_phone_number  ,
      
     } =
     newData;


    setisloading(false)

toast.success("company settings updated successfully", {
  position: "top-center",
  duration: 7000,
})
    setCompanySettings(prevData => ({
      ...prevData, 
      contact_info, 
      company_name, 
      customer_support_phone_number,
      customer_support_email,
      agent_email,
      email_info,
      logo_preview: logo_url
    }));
  } else {
    toast.error('failed to create company settings', {
      position: "top-center",
      duration: 7000,
    })
    setisloading({...isloading, loading8: false})


    console.log('failed to create company settings')
  }

} catch (error) {
  console.log('error creating company settings',error)
  toast.error('internal server error', {
      position: "top-center",
      duration: 7000,
    })

  
  setisloading(false)
}
}
  return (

    <>
     {/* {children} */}
     <Suspense fallback={<div className='flex justify-center items-center '>{ <UiLoader/> }</div>}>
    <GeneralContext.Provider >
    <Toaster />
<Backdrop  handleClose={handleClose}  open={open}/>
<SettingsNotification open={openNotifactionSettings} handleClose={ handleCloseNotifaction }/>
<form onSubmit={handleUpdateSettings}>

   
     <Accordion  sx={{
            backgroundColor: 'transparent',
          }}>
        <AccordionSummary
          expandIcon={<ArrowDownwardIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
         
        >
          <Typography>User Registration</Typography>
        </AccordionSummary>
        <AccordionDetails>

          <Typography>
          

      <FormControlLabel   control={<Checkbox  color="default" />} label="Require Email At Signup" />
      <FormControlLabel  control={<Checkbox  color="default"/>} label="Allow Login With Email " />
      <FormControlLabel  control={<Checkbox  color="default" />} label="Logout User on exit or after a period of inactivity" />
      <Box
      component="form"
      sx={{
        '& .MuiTextField-root': { m: 1, width: '120ch' },
      }}
      noValidate
    >

<TextField sx={{
  '& label.Mui-focused':{
    color: 'gray'
  },
width: {
xs: '30%'
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
          id="outlined-multiline-flexible"
          label="Logout User after a period of inactivity(hrs)"
          className='myTextField'
type='number'
        />

        </Box>
        <FormControlLabel  control={<Checkbox color="default"/>} label="Send Welcome Message After Registration(SMS)" />
        <FormControlLabel  control={<Checkbox color="default"  onChange={handleChange} 
        checked={settingsformData.welcome_back_message}/>}   name='welcome_back_message' label="Show Welcome Back Message After First Time Login" />

          </Typography>


          <Button className='mt-7'  type='submit'>Update General Settings</Button>

        </AccordionDetails>
      </Accordion>
</form>



<form onSubmit={handleUpdateSettings}>

<Accordion  sx={{
            backgroundColor: 'transparent',
          }}>
        <AccordionSummary
          expandIcon={<ArrowDownwardIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
         
        >
          <Typography>Router Management</Typography>
        </AccordionSummary>
        <AccordionDetails>

          <Typography>
          

          <Autocomplete
                      value={routers.find((router)=> router.name === settingsformData.router_name)|| null}

  sx={{
width:{
  xs: '55%'
},
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
             
            }} 

            
                  getOptionLabel={(router) => router.name}

        options={routers}
        
                renderInput={(params) => (
                  <TextField
                  id="router_name"
                  getOptionValue={(option) => option.id}   // Function to extract the value from the option object

                  className='myTextField'
                    {...params}
                    label="Select Router"
                 

                   
                  />
                  
                )}
              
                onChange={(event, newValue) => {
                  console.log("Selected Router:", newValue);

                  setFormData({...settingsformData, router_name: newValue ? newValue.name : '' });
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

          </Typography>


          <Button className='mt-7'  type='submit'>Update General Settings</Button>

        </AccordionDetails>
      </Accordion>

      </form>























      <form onSubmit={handleUpdateSettings}>
      <Accordion   sx={{
            backgroundColor: 'transparent',
          }}>
        <AccordionSummary
          expandIcon={<ArrowDropDownIcon />}
          aria-controls="panel2-content"
          id="panel2-header"
        >
          <Typography>Fixed Subscriber Account</Typography>
        </AccordionSummary>
        <AccordionDetails>

          <Typography>

            <FormGroup>
            <div className='flex '>

          <FormControlLabel     sx={{
            width:{
              xs: '65%',
              sm: '60%',
              md: '60%',
              lg: '30%',
              xl:'30%'
            }
          }}   control={<Checkbox color="default"/>} 
          label="Only Show Packages for Current Zone/Subdomain on homepage" />
          <Tooltip  classes={{
          tooltip: classes.customTooltip,
          arrow: classes.customArrow
        }} sx={{
            width: '20%',
            background: 'red'
          }}  title={<p className='text-lg font-extrabold'>Zone as subdomain <span className='font-extralight  text-sm font-mono'>
Show only the subscription packages to a particular area/zone. Feature is only available for isps who
 have custom domains setup for the portal. Contact us at +254791568852 for setup
            </span></p>} enterDelay={500} leaveDelay={200}>
 
          <Stack sx={{ width: 0 , display: 'flex', justifyContent: 'center'}} spacing={2}>
      <Alert sx={{background: 'transparent'}}  severity="info"></Alert>
     
    </Stack>
    </Tooltip>
    </div>
 

    <FormControlLabel      sx={{
            width:{
              xs: '65%',
              sm: '60%',
            },
            marginTop: 2
            
          }}  control={<Checkbox color="default"/>} label="Notify Customer After Sucesful Subscription Renewal" />

<div className='flex'>
    <FormControlLabel sx={{
       width:{
        xs: '25%',
        sm: '30%',
        marginTop: 30
      }
    }}  control={<Checkbox  color="default" />} label="Email Receipt To Customer On Sucessful Subscription Renewal" />

    <Tooltip title={<p className='text-lg font-extrabold'>Email Setup Required
         <span className='font-extralight  text-sm font-mono'>  Email must be set up in the EMAIL settings tab for receipts 
to be automatically emailed</span></p>} enterDelay={500} leaveDelay={200}>
 
          <Stack sx={{ width: 0 , display: 'flex', justifyContent: 'center'}} spacing={2}>
      <Alert sx={{background: 'transparent'}} severity="info"></Alert>
     
    </Stack>
    </Tooltip>
    </div>
    <FormControlLabel sx={{
       width:{
        xs: '25%',
        sm: '30%',
        marginTop: 20
        
      }
    }}  control={<Checkbox color="default" />} label="Automatically Send Reminder SMS for Expiring Subscriptions"  />
    <Box
              className='myTextField'

      component="form"
      sx={{
        '& .MuiTextField-root': { m: 1, width: {
          sm: '50ch',
          xs: '25ch',
          md:'60ch',
          lg: '100ch',
          xl: '130ch'
        }, 
       },

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
      noValidate
    >
  <TextField
          
          label="Reminder Intervals"
          helperText="Enter Days to/after expiry when reminders should be sent separated by
           commas e.g 5,2,1,0,+2,+4 to send reminders at 5,2, or 1 day to expiry, on the day of expiry and 
           for subscriptions that expired 2 or 4 days ago.

          "
        />

        </Box>


        <FormControlLabel  control={<Checkbox color="default"/>} label="Send Reminder On the Same Date Every Month"  />
        <FormControlLabel  control={<Checkbox color="default"/>} label="Set Expiry date of 30 day fixed/home
         subscriptions to same date (leave unchecked to only add 30 days to subscription)"  />
 <FormControlLabel  control={<Checkbox  color="default"/>} label="Create Partial Subscription for Partial
  Payments (Extend subscription by number of days corressponding to amount paid if partial payment)"  />
<FormControlLabel  control={<Checkbox color="default"/>} label="Use Auto Generated Account Number As PPOE username"  />
<FormControlLabel  control={<Checkbox  color="default"/>} label="Notify User Once Their Account Is Created"  />
<FormControlLabel  control={<Checkbox color="default" />} label="Use Node Code As Account Prefix"  />

</FormGroup>

        <Stack direction='row'   sx={{
        '& .MuiTextField-root': { m: 1, width: '90ch',    '& label.Mui-focused': {
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
      } },
      }}   spacing={{
          xs: 1,
          sm: 2
        }}>

          <TextField  name='prefix' className='myTextField' onChange={handleChange} value={settingsformData.prefix} 
          label='Subscriber Account No Prefix' ></TextField>
          <TextField name='minimum_digits'  className='myTextField'   onChange={handleChange}
           value={settingsformData.minimum_digits} 
             type='number'  label='Subscriber Account No Minimum Digits(Zeros will be added to the front, eg SUB001 for three digits)'></TextField>

        </Stack>



          <div className='border-2  dark:border-black  shadow-xl lg:h-[280px]  sm:h-[400px]   max-md:h-[500px]  max-sm:h-[600px] ,
           flex justify-center items-center flex-col gap-y-2 p-1'>
          <Stack  sx={{
            width: {
              sm: '40ch',
              lg: '110ch',
              xl: '150ch'
            },

           marginBottom:  {
sm: '120px',
lg: '55px',
xs: '30ch'
            },

            height: {
              sm: '10ch',
              xs: '1ch'
            }
          }}>
    
      <Alert severity="info">
        <AlertTitle>Set Account No. Counter Starting Value</AlertTitle>
        Use this to set the value from which the account number counter should start from. Run once after importing a list of customers to make sure account numbers continue from the uploaded values. Set the values of the highest account number.
.
      </Alert>
     
    </Stack>

<Box  sx={{
        '& .MuiTextField-root': { m: 1, width: {sm: '35ch', lg: '95ch', xl: '130ch' },   '& label.Mui-focused': {
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
      } },
      }}>
<TextField    label='Current Account(exclude prefix)'     className='myTextField'></TextField>

</Box>

          </div>


        <FormGroup sx={{
          marginTop: 25
        }}>
      <FormControlLabel     control={<Checkbox checked={settingsformData.check_update_username} 
       onChange={handleChange}  name='check_update_username' color="default"/>} 
       label="Use Auto-Generated  Number as PPPoE Username"  id='check_update_username'/>
      <FormControlLabel  control={<Checkbox  color="default" checked={settingsformData.check_update_password} 
       onChange={handleChange}  name='check_update_password'/>} 
         label="Auto-Generate Customer PPPoE Password" />
      <FormControlLabel control={<Checkbox color="default"/>}   color="default" label="Notify user once their account is created" />
      <FormControlLabel control={<Checkbox color="default"/>}  color="default" label="Lock PPPoE account to the MAC Address detected on 
      first dial (The first MAC Address detected will be saved as the accounts Sticky MAC address and must
         be deleted to switch to a new device)"
 />
      <FormControlLabel control={<Checkbox  color="default"/>} label="Allow Subscriber accounts to have more than one client device" />
      <FormControlLabel control={<Checkbox  color="default"/>} label="Use the same Username/Password for all devices in a multidevice account" />
      <FormControlLabel control={<Checkbox  color="default"/>} label="Automatically Redeem points when redeemable amount is reached" />

    </FormGroup>


          <Stack direction='row'>

            <Button  className='mt-7'type='submit'  loading={isloading} startIcon={<AutorenewIcon/>}
              >Update General Settings</Button>
          </Stack>

          </Typography>
        </AccordionDetails>
      </Accordion>
      </form>






      <form onSubmit={handleCreateCompanySettings}>

<Accordion  sx={{
            backgroundColor: 'transparent',
          }}>
        <AccordionSummary
          expandIcon={<ArrowDownwardIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
         
        >
          <Typography>Company Settings</Typography>
        </AccordionSummary>
        <AccordionDetails>

          <Typography>
          
          <Stack direction='column' className='myTextField' sx={{
          '& .MuiTextField-root': { 
            m: 1, 
            width: '90ch',  
            marginTop: '30px',  
            '& label.Mui-focused': {
              color: 'black',
              fontSize: '16px'
            },
            '& .MuiOutlinedInput-root': {
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "black",
                borderWidth: '3px'
              },
              '&.Mui-focused fieldset': {
                borderColor: 'black',
              }
            } 
          },
        }} spacing={{xs: 1, sm: 2}}>

          {/* Existing text fields */}
          <TextField  
            name='company_name'
            value={company_name}
            onChange={handleFormDataChangeForCompany}
            label='Company Name' 
            type='text'
          />

          <TextField  
            onChange={handleFormDataChangeForCompany}
            name='email_info'
            value={email_info}
            label='Email Info' 
            type='text'
          />

          <TextField  
            onChange={handleFormDataChangeForCompany}
            name='contact_info'
            value={contact_info}
            label='Company Contact Info' 
            type='text'
          />


<TextField  
            onChange={handleFormDataChangeForCompany}
            name='agent_email'
            value={agent_email}
            label='Agent Email' 
            type='text'
          />


<TextField  
            onChange={handleFormDataChangeForCompany}
            name='customer_support_phone_number'
            value={customer_support_phone_number} 
            label='Customer Support Phone Number'
            type='text'
          />




<TextField  
            onChange={handleFormDataChangeForCompany}
            name='customer_support_email'
            value={customer_support_email} 
            label='Customer Support Email'  
            type='text'
          />

          {/* Add the new image upload section */}
          <div className="flex flex-col gap-4 p-4">
            <label className="text-lg font-medium  dark:text-white text-black">Company Logo</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
              id="logo-upload"
            />
            
            <label 
              htmlFor="logo-upload"
              className="flex items-center justify-center p-4 border-2
               border-dashed border-gray-300 rounded-lg cursor-pointer
                hover:border-gray-400"
            >
              {companySettings.logo_preview ? (
                <div className="relative">
                  <img 
                    src={companySettings.logo_preview}
                    alt="Logo preview" 
                    className="max-w-xs max-h-48 object-contain"
                  />
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      setCompanySettings(prev => ({...prev, logo: null, logo_preview: null}));
                    }}
                    className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <div className="text-gray-500">
                  <p className='dark:text-white text-black'>Click to upload company logo</p>
                  <p className="text-sm dark:text-white text-black">PNG, JPG up to 5MB</p>
                </div>
              )}
            </label>
          </div>

        </Stack>

         

          </Typography>


          <Button className='mt-7'  type='submit'>Update General Settings</Button>

        </AccordionDetails>
      </Accordion>

      </form>


      </GeneralContext.Provider >
      </Suspense >
     
      </>
   
  )
}

export default GeneralSettings
export const useSettings = (()=> useContext(GeneralContext ))

