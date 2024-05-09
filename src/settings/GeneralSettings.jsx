import * as React from 'react';
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
const GeneralSettings = () => {
       
  return (
   <div>
     <Accordion>
        <AccordionSummary
          expandIcon={<ArrowDownwardIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
        >
          <Typography>User Registration</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
          <FormGroup>
      <FormControlLabel control={<Checkbox defaultChecked />} label="Require Email At Signup" />
      <FormControlLabel  control={<Checkbox />} label="Allow Login With Email " />
      <FormControlLabel  control={<Checkbox />} label="Logout User on exit or after a period of inactivity" />
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
          maxRows={4}
type='number'
        />

        </Box>
        <FormControlLabel  control={<Checkbox />} label="Send Welcome Message After Registration(SMS)" />

    </FormGroup>
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion>
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

          <FormControlLabel  control={<Checkbox />} label="Only Show Packages for Current Zone/Subdomain on homepage" />
          <Tooltip title="Zones as Subdomains
Show only the subscription packages to a particular area/zone. Feature is only available for isps who
 have custom domains setup for the porttal. Contact us at +254791568852 for setup" enterDelay={500} leaveDelay={200}>
 
          <Stack sx={{ width: '10%'  , display: 'flex', justifyContent: 'center'}} spacing={2}>
      <Alert severity="info"></Alert>
     
    </Stack>
    </Tooltip>
    </div>
 

    <FormControlLabel  control={<Checkbox />} label="Notify Customer After Sucesful Subscription Renewal" />

<div className='flex'>
    <FormControlLabel  control={<Checkbox />} label="Email Receipt To Customer On Sucessful Subscription Renewal" />

    <Tooltip title="Email Setup Required
Email must be set up in the EMAIL settings tab for receipts 
to be automatically emailed" enterDelay={500} leaveDelay={200}>
 
          <Stack sx={{ width: '10%'  , display: 'flex', justifyContent: 'center'}} spacing={2}>
      <Alert severity="info"></Alert>
     
    </Stack>
    </Tooltip>
    </div>
    <FormControlLabel  control={<Checkbox />} label="Automatically Send Reminder SMS for Expiring Subscriptions"  />
    <Box
              className='myTextField'

      component="form"
      sx={{
        '& .MuiTextField-root': { m: 1, width: '120ch', 
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


        <FormControlLabel  control={<Checkbox />} label="Send Reminder On the Same Date Every Month"  />
        <FormControlLabel  control={<Checkbox />} label="Set Expiry date of 30 day fixed/home
         subscriptions to same date (leave unchecked to only add 30 days to subscription)"  />
 <FormControlLabel  control={<Checkbox />} label="Create Partial Subscription for Partial
  Payments (Extend subscription by number of days corressponding to amount paid if partial payment)"  />
<FormControlLabel  control={<Checkbox />} label="Use Auto Generated Account Number As PPOE username"  />
<FormControlLabel  control={<Checkbox />} label="Notify User Once Their Account Is Created"  />

</FormGroup>

          </Typography>
        </AccordionDetails>
      </Accordion>
   </div>
  )
}

export default GeneralSettings
