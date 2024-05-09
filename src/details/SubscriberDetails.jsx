import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';

const SubscriberDetails = ({handleClose}) => {
  return (
    <div className=' relative right-20 w-full  '>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4 '>
        <Box
      component="form"
      sx={{
        '& .MuiTextField-root': { m: 1, marginTop: '',  width: {
            xs: '40%',
            sm: '80%',
            md: '50%',
            lg: '70%',

            '& label.Mui-focused': {
              color: 'black',
              fontSize:'18px'
            
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
        } },
      }}
      noValidate
      autoComplete="on"
    >
        <TextField id="outlined-basic"  className='myTextField' label="Name" variant="outlined" />

</Box>


      <FormControl   sx={{ m: 1, width: {
            xs: '40%',
            sm: '90%',
            md: '50%',
            lg: '70%',
            maxmd:'10%',




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
        }, }}>
        <InputLabel id="demo-simple-select-autowidth-label">User Group</InputLabel>
        <Select
          labelId="demo-simple-select-autowidth-label"
          id="demo-simple-select-autowidth"
          autoWidth
          label="User Group"
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          <MenuItem value={10}>Twenty</MenuItem>
          <MenuItem value={21}>Twenty one</MenuItem>
          <MenuItem value={22}>Twenty one and a half</MenuItem>
        </Select>
      </FormControl>

      <FormControl  sx={{ m: 1,  width: {
            xs: '40%',
            sm: '90%',
            md: '50%',
            lg: '70%',
            maxmd:'10%'
            

        },
        
        '& label.Mui-focused': {
          color: 'black',
          fontSize:'18px'
        
          },
        '& .MuiOutlinedInput-root': {
        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
          borderColor: "black",
          borderWidth: '3px'
          },
        '&.Mui-focused fieldset':  {
          borderColor: 'black', // Set border color to transparent when focused
        
        }
        },}}>
        <InputLabel id="demo-simple-select-autowidth-label">Node</InputLabel>
        <Select
          labelId="demo-simple-select-autowidth-label"
          id="demo-simple-select-autowidth"
          autoWidth
          label="Node"
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          <MenuItem value={10}>Twenty</MenuItem>
          <MenuItem value={21}>Twenty one</MenuItem>
          <MenuItem value={22}>Twenty one and a half</MenuItem>
        </Select>
      </FormControl>

      </div>
      


<div className='grid grid-cols-1 md:grid-cols-2 gap-1 '>

<Box
      component="form"
      sx={{
        '& > :not(style)': { m: 1, width: {
            xs: '20%',
            sm: '90%',
            md: '50%',
            lg: '40%',
        },
        '& label.Mui-focused': {
          color: 'black',
          fontSize:'18px'
        
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
      autoComplete="on"
    >
      <TextField id="outlined-basic"  className='myTextField' label="Email" variant="outlined"/>


    <TextField id="outlined-basic" label="Phone" className='myTextField'  variant="outlined" />
</Box>
</div>
  



                <div className='grid grid-cols-1 '>

<Box
      component="form"
      className='myTextField'
      sx={{
        '& > :not(style)': { m: 1,  width: {
            xs: '30%',
            sm: '90%',
            md: '50%',
            lg: '100%%',
        }  , '& label.Mui-focused': {
          color: 'black',
          fontSize:'17px'
        
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
      }}
      noValidate
      autoComplete="on"
    >
      <TextField id="outlined-basic" label="Phone Number" variant="outlined" />
    </Box>
                </div>




                <div className='grid grid-cols-1 md:grid-cols-3'>
                <Box
      component="form"
      className='myTextField'
      sx={{
        '& > :not(style)': { m: 1, width: {
            xs: '50%',
            sm: '90%',
            md: '50%',
            lg: '40%',
        } ,
        '& label.Mui-focused': {
          color: 'black',
          fontSize:'17px'
        
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
      autoComplete="on"
    >
              <TextField id="outlined-basic" label="Ref No" variant="outlined" />

      <TextField id="outlined-basic" label="Ppoe Username" variant="outlined" />
      <TextField id="outlined-basic" label="Ppoe Password" variant="outlined"/>
    </Box>

                </div>

             
                <div className='grid grid-cols-1  md:grid-cols-2  '>




 <FormControl  sx={{ m: 1, width: {
            xs: '50%',
            sm: '90%',
            md: '50%',
            lg: '70%',
        } , '& label.Mui-focused': {
          color: 'black',
          fontSize:'21px'
        
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
        <InputLabel id="demo-simple-select-autowidth-label">Package</InputLabel>
        <Select
          labelId="demo-simple-select-autowidth-label"
          id="demo-simple-select-autowidth"
          autoWidth
          label="User Group"
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          <MenuItem value={10}>Twenty</MenuItem>
          <MenuItem value={21}>Twenty one</MenuItem>
          <MenuItem value={22}>Twenty one and a half</MenuItem>
        </Select>
      </FormControl>

    <DemoContainer   sx={{ m: 1, width: {
            xs: '50%',
            sm: '90%',
            md: '50%',
            lg: '50%',
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
        },  }} components={['DatePicker']}>
        <DatePicker  className='myTextField' renderInput={(props)=> {
            return <TextField  {...props} />
        }}  label="Date Registered" />
      </DemoContainer>
                </div>





                <div>
                <Box
      component="form"
      className='myTextField'
      sx={{
        '& > :not(style)': { m: 1, width: '40ch' },
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
      noValidate
      autoComplete="on"
    >
              <TextField id="outlined-basic" label="Installation Fee" type='number' variant="outlined" />

    </Box>
                        </div>
        <div className='flex gap-x-7 mt-3'>
        <Button color='error' variant='outlined' onClick={handleClose} >Cancel</Button>
        <Button  type='submit'  color='success'  variant='outlined'   >Save</Button>
        </div> 

    </div>
  )
}

export default SubscriberDetails
