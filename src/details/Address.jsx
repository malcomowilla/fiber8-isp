import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Stack from '@mui/material/Stack';

const Address = ({handleClose}) => {
  const [checked, setChecked] = React.useState(true);

  const handleChange = (event) => {
    setChecked(event.target.checked);
  };

  return (
    <div>
        <Box
      component="form"
      className='myTextField'
      sx={{
        '& > :not(style)': { m: 1, width: {
          lg: '100%',
          xs: '35%',
          md:'50%',
          sm: '50%'
        },  '& label.Mui-focused': {
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
        }, },
      }}
      noValidate
      autoComplete="off"
    >
      <TextField id="outlined-basic" label="Mac Adress" variant="outlined" />
     
    </Box>
    <FormControlLabel
        label="Use Sticky Mac Adress"
        
        control={
          <Checkbox
          checked={checked}
          inputProps={{ 'aria-label': 'controlled' }}
          onChange={handleChange}

            indeterminate={checked[0] !== checked[1]}
          />
        }
      />


  

    <Box
    className='myTextField'
      component="form"
      sx={{
        '& > :not(style)': { m: 1, width: {
          lg: '100%',
          xs: '35%',
          md:'50%',
          sm: '50%'
        },  '& label.Mui-focused': {
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
        }, },
      }}>
    <TextField id="filled-basic" label="Static IP Address" variant="outlined" />

    </Box>

    <Box
      component="form"
      className='myTextField'
      sx={{
        '& > :not(style)': { m: 1, width: {
          lg: '100%',
          xs: '35%',
          md:'50%',
          sm: '50%'
        }, '& label.Mui-focused': {
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
        }, },
      }}>
                <TextField id="standard-basic" label="IP Pool" variant="outlined" />

        </Box>


        <Box
      component="form"
      className='myTextField'
      sx={{
        '& > :not(style)': { m: 1, width: {
          lg: '100%',
          xs: '35%',
          md:'50%',
          sm: '50%'
        } ,  '& label.Mui-focused': {
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
        },},
      }}>
      <TextField id="standard-basic" label="PPPOE profile/QoS grouping ID" variant="outlined" />


        </Box>
      

        <Box
        className='myTextField'
      component="form"
      sx={{
        '& > :not(style)': { m: 1, width: {
          lg: '100%',
          xs: '35%',
          md:'50%',
          sm: '50%'
        },  '& label.Mui-focused': {
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
        }, },
      }}>
        <TextField id="standard-basic" label="NAS ID(Router Identifier)" variant="outlined" />
        </Box>


        <Stack sx={{ width: '100%' }} >
     
      <Alert severity="info">
        <AlertTitle>You can enforce more control or security by assigning static IPs and locking 
          MAC Addresses for clients.</AlertTitle>
       <li>Check the Sticky Mac Address box to lock the first MAC address connecting with the username. No other device can 
        be used with the same username</li> 

      <li>Fill the Static IP Address field to always assign the specific IP to the specific user. Exclude the IP from any pool.</li>
      <li>Fill the IP Pool field to assign IP from a specific pool. This will be overriden if Static IP Address is specified</li>
      <li>Fill the PPPoE Profile field to authenticate user with the given profile and thus apply QoS rules specific to them. The profile must be 
        set up with the exact name on the NAS/Router</li>
        <li>Fill the NAS ID field to restrict user to only login in via the given NAS. The account will be denied access 
          if they try authenticating via a different NAS</li>
      </Alert>
     
    

    </Stack>


    <Stack sx={{ marginTop: 5,}} direction={{ xs: 'column', sm: 'row'}}  spacing={{xs: 1, sm: 2, md: 4}}>

    {/* <Button color='error'   startIcon={<CloseIcon/>} variant='outlined'  onClick={handleClose}>Cancel</Button> */}
    <button   onClick={handleClose} className='bg-red-600 text-white rounded-3xl px-4 py-2
          transform hover:scale-110 transition duration-500 hover:bg-red-200  
          text-lg ' >

            Cancel
          </button>


          <button className='bg-black text-white rounded-3xl px-4 py-2
          transform hover:scale-110 transition duration-500 hover:bg-green-500
          text-lg' type="submit">

            Save
          </button>
{/*           
<LoadingButton  loadingPosition= 'start' startIcon={<AutorenewIcon/>} type='submit'
 loading={false}  color='success'
    variant='outlined'   >


  save
</LoadingButton> */}
</Stack>

    </div>
  )
}

export default Address