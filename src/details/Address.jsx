import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';

const Address = () => {
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
    </div>
  )
}

export default Address