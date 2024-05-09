import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
const SmsSettings = () => {
  return (
    <div className='mt-6'>
        
        
<div className='flex'>


<FormControl  sx={{ m: 1, width:'80ch',
  '& label.Mui-focused': {
    color: 'black',
    fontSize: '23px'
    
    },
'& .MuiOutlinedInput-root': {
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: "black",
    borderWidth: '3px'
    },
 '&.Mui-focused fieldset':  {
    borderColor: 'black', // Set border color to transparent when focused

  }
}, }}>
        <InputLabel id="demo-simple-select-autowidth-label">Provider</InputLabel>
        <Select
          labelId="demo-simple-select-autowidth-label"
          id="demo-simple-select-autowidth"
          autoWidth
          label="User Group"
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>

          <MenuItem  value='Africastalking'>Africastalking</MenuItem>
          <MenuItem  value='Advanta' >Advanta</MenuItem>
          <MenuItem value='Mobitech Bulk' >Mobitech Bulk</MenuItem>
          <MenuItem value='Afrokatt' >Afrokatt</MenuItem>
          <MenuItem  value='Afrinet'>Afrinet</MenuItem>
          <MenuItem value='EgoSMS' >EgoSMS</MenuItem>
          <MenuItem value='BlessedTexts'>BlessedTexts</MenuItem>
          <MenuItem  value='Mobiweb'>Mobiweb</MenuItem>
          <MenuItem value='Mobivas'>Mobivas</MenuItem>
          <MenuItem value='MoveSMS' >MoveSMS</MenuItem>
          <MenuItem value='HostPinnacle'>HostPinnacle</MenuItem>
          <MenuItem value='Bytewave'>Bytewave</MenuItem>
          <MenuItem value='CrowdComm'>CrowdComm</MenuItem>
          <MenuItem  value='Ujumbe'>Ujumbe</MenuItem>
          <MenuItem value='SMS leopard' >SMS leopard</MenuItem>

        </Select>
      </FormControl>





        <Box           className='myTextField'
 component="form"
      sx={{
        '& .MuiTextField-root': { m: 1, width: '80ch',  },

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
      noValidate>


            <TextField label='username'>

            </TextField>
        </Box>
    </div>        
        

        <Box component="form"
                  className='myTextField'

      sx={{
        '& .MuiTextField-root': { m: 1, width: '100%',  },

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
      noValidate>


<TextField label='API key'>

</TextField>




        
<TextField label='Sender ID Short Code'>

</TextField>
        </Box>
        

        <div className='mt-12 flex justify-center shadow-2xl w-full h-[100px] items-center dark:bg-gray-900 '>

        <p>
            SMS balance:
        </p>
        </div>


        <div className='mt-12'>
      
<label htmlFor="message" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">PPOE subscriber welcome message </label>
<textarea id="message" rows="4" className="block p-2.5 w-full text-sm text-gray-900
 bg-gray-50 rounded-lg border border-gray-300 focus:ring-gray-500 focus:border-gray-500
  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white
   dark:focus:ring-gray-500 dark:focus:border-gray-500" placeholder="..."></textarea>

<p></p>
        </div>
        </div>
  )
}

export default SmsSettings