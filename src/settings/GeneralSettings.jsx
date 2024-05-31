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

import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import AlertTitle from '@mui/material/AlertTitle';

import Button from '@mui/material/Button';

import LoadingButton from '@mui/lab/LoadingButton';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import CloseIcon from '@mui/icons-material/Close';
import {useState, useEffect,  useCallback, useMemo} from 'react'
import { useApplicationSettings } from './ApplicationSettings';
import { makeStyles } from '@material-ui/core/styles';


const useStyles = makeStyles(theme => ({
  customTooltip: {
    backgroundColor: 'gray',
  },
  customArrow: {
    color: 'rgba(220, 0, 78, 0.8)',
  },
}));

const GeneralSettings = () => {
  const { handleChange, settingsformData, isloading, setisloading, setFormData } = useApplicationSettings();

const [checkedData,  setCheckedData] = useState('')
       
console.log('checked data', checkedData)

const classes = useStyles();




       const handleUpdateSettings = async(e)=> {
        e.preventDefault()

        try {
          setisloading(true)
          const url =  '/api/update_general_settings' 
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
// setCheckedData(newData1)
          localStorage.setItem("checkedtrueData2", JSON.stringify({check_update_username,  check_update_password}))
          setFormData({...settingsformData, prefix,  minimum_digits, check_update_username, check_update_password })
          setisloading(false)

        } else {
          console.log('not created')
          setisloading(false)
        }
        } catch (error) {
          console.log(error)
          setisloading(false)
        }
       }

      //  useEffect(() => {
      //   const storedData = JSON.parse(localStorage.getItem("checkedtrueData1"));
      //   if (storedData) {
      //     setFormData({
      //       ...settingsformData,
      //       check_update_username: storedData.check_update_username,
      //       check_update_password: storedData.check_update_password,

            
      //     });
      //   }
      // }, [setFormData, settingsformData.check_update_password, settingsformData ]);



       const fetchSubscriberUpdatedSettings = useCallback(async () => {
        const storedData = JSON.parse(localStorage.getItem("checkedtrueData2"));
//         const check_password =  checkedData.check_update_password
// const check_username = checkedData.check_update_username
  const requestParams = {
    check_update_password:storedData.check_update_password ,
    check_update_username: storedData.check_update_username
  };

  try {
    const response = await fetch(`/api/get_general_settings?${new URLSearchParams(requestParams)}`, {
      method: 'GET',
      headers: {
        "Content-Type"  : 'application/json'
      },

     
    })
    const newData = await response.json()
    if (response.ok) {

      // const check_password =  checkedData.check_update_password
      // const check_username = checkedData.check_update_username
      // console.log('check username', check_username)
      const {prefix, minimum_digits, check_update_password, check_update_username} = newData[0]
      setFormData({...settingsformData, prefix,  minimum_digits, check_update_password, check_update_username})

    } else {
      console.log('failed to fetch')
    }
  } catch (error) {
    console.log(error)

  }
}, []) 
      



       useEffect(() => {
        
        fetchSubscriberUpdatedSettings()
       }, [fetchSubscriberUpdatedSettings, setFormData]);

  return (

    <>

   
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


          </Typography>
        </AccordionDetails>
      </Accordion>


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
      <Alert severity="info"></Alert>
     
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
      <Alert severity="info"></Alert>
     
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

            <LoadingButton type='submit'  loading={isloading} startIcon={<AutorenewIcon/>}
             variant='outlined' color='primary'>Update Settings</LoadingButton>
          </Stack>

          </Typography>
        </AccordionDetails>
      </Accordion>
      </form>
      </>
   
  )
}

export default GeneralSettings
