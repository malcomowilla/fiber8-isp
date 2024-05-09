import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
const EmailSettings = () => {
  return (
    <div className='mt-8'>
      <div className='flex'>
<Box component="form"
 className='myTextField'
      sx={{
        '& .MuiTextField-root': { m: 1, width: '60ch', marginTop: 2,   '& label.Mui-focused': {
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

<TextField  label='SMTP Host'>


</TextField>





<TextField  label='SMTP Port'>


</TextField>
</Box>

      </div>


      <div className='flex mt-3  w-full'>
        <Box  className='myTextField'  sx={{'& .MuiTextField-root' : {
            width: '100ch',
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
<TextField label='SMTP Username'/>
        </Box>


        <Box  className='myTextField'  sx={{'& .MuiTextField-root' : {
            width: '60ch',
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
        <TextField label='SMTP Password'/>

        </Box>
      </div>


      <FormGroup>
      <FormControlLabel  control={<Checkbox />} label="Use SSL" />
    </FormGroup>


    <div className='flex'>

        <Box   className='myTextField' sx={{'& .MuiTextField-root' : {
            width: '60ch',
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
<TextField label='Sender Email'>

</TextField>

        </Box>


        <Box  className='myTextField' sx={{'& .MuiTextField-root' : {
            width: '60ch',
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

            <TextField label='Sender Name'>


            </TextField>
        </Box>
    </div>
    </div>
  )
}

export default EmailSettings
