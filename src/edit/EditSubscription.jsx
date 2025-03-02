import * as React from "react"
import {useState, useEffect} from 'react'

import Button from '@mui/material/Button';


// import TextField from '@mui/material/TextField';

// import EditIcon from '@mui/icons-material/Edit';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
// import { MobileTimePicker } from '@mui/x-date-pickers/MobileTimePicker';
// import { TimePicker } from '@mui/x-date-pickers/TimePicker';

// import Stack from '@mui/material/Stack';

// import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { DemoContainer  } from '@mui/x-date-pickers/internals/demo';
import dayjs from 'dayjs';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import LoadingButton from '@mui/lab/LoadingButton';
import CloseIcon from '@mui/icons-material/Close';
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import {
  renderDigitalClockTimeView,
  renderTimeViewClock,
} from '@mui/x-date-pickers/timeViewRenderers';
function  EditSubscription({open,  handleClose}) {
  const [fullWidth, setFullWidth] = React.useState(true);
  const [maxWidth, setMaxWidth] = React.useState('lg');
 

  const [age, setAge] = React.useState('');
const [dateTimeValue, setDateTimeValue] = useState(dayjs(new Date()))
const [newDate, setNewDate] = React.useState(null)

  const handleChange = (event) => {
    setAge(event.target.value);
  };


  useEffect(() => {
    // Calculate the date and time 30 days from the current date and time
    const thirtyDaysFromNow = dayjs(new Date()).add(30, 'day');
    setNewDate(thirtyDaysFromNow);
  }, []);
  return (
    <React.Fragment>
   
      <Dialog
        fullWidth={fullWidth}
        maxWidth={maxWidth}
        open={open}
        onClose={handleClose}
      >
        <DialogTitle>Add Subscription</DialogTitle>
        <DialogContent>

          <div className=''>
        
<FormControl  sx={{ m: 1, minWidth:520 , 
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
},}} >
        <InputLabel id="demo-simple-select-autowidth-label">Subscriber</InputLabel>
        <Select
          labelId="demo-simple-select-autowidth-label"
          id="demo-simple-select-autowidth"
          autoWidth
          label="User Group"
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          <MenuItem value={'ACTIVE'}>ACTIVE</MenuItem>
          <MenuItem value={'STANDBY'}>STANNBY</MenuItem>
          <MenuItem value={'EXPIRED'}>EXPIRED</MenuItem>
        </Select>
      </FormControl>

   
<FormControl  sx={{ m: 1, minWidth:520 , 
  '& label.Mui-focused': {
    color: 'black',
    fontSize: '20px'
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
          <MenuItem value={'ACTIVE'}>ACTIVE</MenuItem>
          <MenuItem value={'STANDBY'}>STANNBY</MenuItem>
          <MenuItem value={'EXPIRED'}>EXPIRED</MenuItem>
        </Select>
      </FormControl>
          </div>
     


<div className='flex justify-between'>

<FormControl  sx={{ m: 1, width:'40ch',
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
        <InputLabel id="demo-simple-select-autowidth-label">Status</InputLabel>
        <Select
          labelId="demo-simple-select-autowidth-label"
          id="demo-simple-select-autowidth"
          autoWidth
          label="User Group"
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          <MenuItem value={'ACTIVE'}>ACTIVE</MenuItem>
          <MenuItem value={'STANDBY'}>STANNBY</MenuItem>
          <MenuItem value={'EXPIRED'}>EXPIRED</MenuItem>
        </Select>
      </FormControl>


      <DemoContainer  sx={{

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
      }}  components={['TimePicker', 'TimePicker']}>
        <DateTimePicker className='myTextField'
          label="Date Subscribed"
          value={dateTimeValue}
         minDate={dayjs(new Date())}
           maxDate={dayjs(new Date())} 

          onChange={(newValue)=>  {
            setDateTimeValue(newValue)

          }   
          
          
          
         }
          viewRenderers={{
            hours: renderTimeViewClock,
            minutes: renderTimeViewClock,
            seconds: renderTimeViewClock,
          }}
        

        />
        <DateTimePicker  className='myTextField'
          label="Valid Until"
value={newDate}
disabled
          // minDate={dayjs(new Date())}
          // maxDate={dayjs(new Date(new Date().getTime() + (30 * 24 * 60 * 60 * 1000)))} // 30 days from today
          // onChange={(newValue) => {
          //   setDateTimeValue(newValue)
          // }   }


          
          viewRenderers={{
            hours:  renderTimeViewClock,
            minutes:  renderTimeViewClock,
            seconds: renderTimeViewClock,
          }}


         
        />
      </DemoContainer>

      

</div>


        </DialogContent>
        <DialogActions>
        
          <Button   color='error' variant='outlined' startIcon={<CloseIcon/>}    onClick={handleClose}>Cancel</Button>

          <LoadingButton  loadingPosition= 'start' startIcon={<AutorenewIcon/>} type='submit' 
 loading={false} color='success'
    variant='outlined'   >


  save
</LoadingButton>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
export default EditSubscription