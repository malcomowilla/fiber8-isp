
// // import {Link} from 'react-router-dom'
// import { TimePicker } from '@mui/x-date-pickers/TimePicker';
// import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
// // import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

// import {useState, useRef, useMemo, useEffect} from 'react'
// import * as React from 'react';

// import {
//   renderDigitalClockTimeView,
//   renderTimeViewClock,
// } from '@mui/x-date-pickers/timeViewRenderers';
// import Alert from '@mui/material/Alert';
// import Stack from '@mui/material/Stack';
// // import Loader from '../loader/Loader'
// import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

// import Dialog from '@mui/material/Dialog';
// import DialogActions from '@mui/material/DialogActions';
// import DialogContent from '@mui/material/DialogContent';
// // import DialogContentText from '@mui/material/DialogContentText';
// import Box from '@mui/material/Box';
// import TextField from '@mui/material/TextField';
// // import { IconButton } from '@mui/material';
// import useMediaQuery from '@mui/material/useMediaQuery';
// import { useTheme } from '@mui/material/styles';
// import AlertTitle from '@mui/material/AlertTitle';
// import InputLabel from '@mui/material/InputLabel';
// import MenuItem from '@mui/material/MenuItem';
// import FormControl from '@mui/material/FormControl';
// import Select from '@mui/material/Select';
// import dayjs from 'dayjs';
// import {useApplicationSettings} from '../settings/ApplicationSettings'

// // import PackageNotification  from '.././notification/PackageNotification'


// // import LoadingButton from '@mui/lab/LoadingButton';
// // import AutorenewIcon from '@mui/icons-material/Autorenew';
// // import CloseIcon from '@mui/icons-material/Close';

// // import Autocomplete from '@mui/material/Autocomplete';
// // import { useDebounce } from 'use-debounce';
// import {Button} from '../components/ui/button'
// import { ReloadIcon } from "@radix-ui/react-icons"


// const EditHotspotPackage =  ({handleClose, loading, open, hotspotPackage, setHotspotPackage,
//   createHotspotPackage,
//   handleChangeTimeFrom, handleChangeTimeUntil,handleWeekdayChange
//  }) => {
 
   



// const {name, validity, download_limit, upload_limit, price, upload_burst_limit, download_burst_limit,
//   validity_period_units} = hotspotPackage



  
//   const theme = useTheme();

//   const fullScreen = useMediaQuery(theme.breakpoints.down('sm', 'lg', 'md'));

//  const handleChangeHotspotPackage = (e)=> {
//    const {value, id} = e.target
//    setHotspotPackage({...hotspotPackage, [id]: value})
// }


// // const [dateTimeValue, setDateTimeValue] = useState(dayjs(new Date()))

// const {dateTimeValue, newDate, setNewDate, setDateTimeValue} =  useApplicationSettings()


// // const [dateTimeValue, setDateTimeValue] = useState(null)

// // const [newDate, setNewDate] = React.useState(null)
// console.log('newDate', newDate)

// console.log('dateTimeValue', dateTimeValue)

//   return (
//     <React.Fragment>
//      {/* onClick={handleClickOpen */}

//       {/* <IconButton  style={{color: 'black'}} >
//       <EditIcon />
//     </IconButton> */}
//       <Dialog
//         open={open}
//         onClose={handleClose}
//         aria-labelledby="alert-dialog-title"
//         aria-describedby="alert-dialog-description"
//         fullScreen={fullScreen}
//         fullWidth={true}
//         maxWidth={'lg'}
//       >
        
//         <DialogContent >
//             <form onSubmit={createHotspotPackage}>
//             <Box
//       sx={{
//         '&.MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': { m: 1, width: '50ch' , border: 0},
//         "&.MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline":
//         {
//           border: 0,
//         },
//       }}>
//             <TextField   sx={{

// '& label.Mui-focused': {
//   color: 'black',
//   fontSize: '17px'

//   },
// '& .MuiOutlinedInput-root': {
// "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
//   borderColor: "black",
//   borderWidth: '3px'
//   },
// '&.Mui-focused fieldset':  {
//   borderColor: 'black', 
  

// }
// },
         
//         }}   id='name' value={name}   onChange={handleChangeHotspotPackage}  className='myTextField'   
//              placeholder='enter name...' label='package-name' fullWidth   ></TextField>

//             </Box>



//             <div className='flex  gap-3 mt-4'>
//           <TextField label='bundle-price'   sx={{

// '& label.Mui-focused': {
//   color: 'black',
//   fontSize: '17px'

//   },
// '& .MuiOutlinedInput-root': {
// "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
//   borderColor: "black",
//   borderWidth: '3px'
//   },
// '&.Mui-focused fieldset':  {
//   borderColor: 'black', // Set border color to transparent when focused

// }
// },
         
//         }}    className='myTextField'  onChange={handleChangeHotspotPackage}     id='price'
//               type='number'   value={price} fullWidth></TextField>




//             <TextField label='upload-speed-limit(mbps)'   
            
//             value={upload_limit}
//             onChange={handleChangeHotspotPackage} id='upload_limit'
            
            
//             sx={{

// '& label.Mui-focused': {
//   color: 'black'
//   },
// '& .MuiOutlinedInput-root': {
// "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
//   borderColor: "black",
//   borderWidth: '3px',
//   },
// '&.Mui-focused fieldset':  {
//   borderColor: 'black', // Set border color to transparent when focused

// }
// },
         
//         }}     className='myTextField'  
//             type='number' placeholder='upload-speed-limit(mbps)...' fullWidth></TextField> 



//             <TextField    value={download_limit}  onChange={handleChangeHotspotPackage} 
//             label='download-speed-limit(mbps)'   id='download_limit'   sx={{

// '& label.Mui-focused': {
//   color: 'black'
//   },
// '& .MuiOutlinedInput-root': {
// "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
//   borderColor: "black",
//   borderWidth: '3px'
//   },
// '&.Mui-focused fieldset':  {
//   borderColor: 'black', // Set border color to transparent when focused

// }
// },
         
//         }}   className='myTextField'       
//           type='number' 
//       fullWidth></TextField> 
//             </div>
           
//            {/* <div className='flex   '>

//            <Box
//       sx={{
//         '& > :not(style)': { m: 1, width: '40ch' },
//       }}>

      

//            <TextField  label='upload-burst-speed(mbps)' 
          
             
//                 sx={{

// '& label.Mui-focused': {
//   color: 'black'
//   },
// '& .MuiOutlinedInput-root': {
// "&.Mui-focused .2MuiOutlinedInput-notchedOutline": {
//   borderColor: "black",
//   borderWidth: '3px'
//   },
// '&.Mui-focused fieldset':  {
//   borderColor: 'black', // Set border color to transparent when focused

// }
// },
         
//         }}  
//              type='number'  fullWidth id='upload_burst_limit' className='myTextField'></TextField>





             
//             <TextField    sx={{

// '& label.Mui-focused': {
//   color: 'black'
//   },
// '& .MuiOutlinedInput-root': {
// "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
//   borderColor: "black",
//   borderWidth: '3px'
//   },
// '&.Mui-focused fieldset':  {
//   borderColor: 'black', // Set border color to transparent when focused

// }
// },
         
//         }}   label='download-burst-speed(mbps)'    
  
//           type='number' className='myTextField'  id='download_burst_limit'
//            fullWidth></TextField>


           
//             <TextField label='burst-period(s)'   sx={{

// '& label.Mui-focused': {
//   color: 'black'
//   },
// '& .MuiOutlinedInput-root': {
// "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
//   borderColor: "black",
//   borderWidth: '3px'
//   },
// '&.Mui-focused fieldset':  {
//   borderColor: 'black', // Set border color to transparent when focused

// }
// },
         
//         }}    type='number'  placeholder='burst-period(s)...'  className='myTextField'  id='' fullWidth></TextField>
        
          

// </Box> 

//            </div> */}
         

//            {/* <Stack sx={{ width: '100%' }} spacing={2}>
      
//       <Alert severity="info">
//         <AlertTitle>Speed Boost</AlertTitle>
//         You can provide your customers with boosted speeds during off-peak hours. The boosted speeds will apply between the specified hours 
//         and revert to regular limits during other hours
//       </Alert>
      
    
//     </Stack> */}



//               {/* <div className='flex gap-3 mt-2 justify-center'>

             

          
//             <DemoContainer components={['TimePicker']}    sx={{

// '& label.Mui-focused': {
//   color: 'black'
//   },
// '& .MuiOutlinedInput-root': {
// "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
//   borderColor: "black",
//   borderWidth: '3px'
//   },
// '&.Mui-focused fieldset':  {
//   borderColor: 'black', // Set border color to transparent when focused

// }
// },
         
//         }}  >
//        <TimePicker          viewRenderers={{
//             hours: renderTimeViewClock,
//             minutes: renderTimeViewClock,
//             seconds: renderTimeViewClock,
//           }}   className='dark:text-black myTextField'
//  label="Boost Start Time" />

//  <TimePicker       viewRenderers={{
//             hours: renderTimeViewClock,
//             minutes: renderTimeViewClock,
//             seconds: renderTimeViewClock,
//           }}      className='dark:text-black myTextField'
//  label="Boost End Time" />


//     </DemoContainer>
//               </div> */}
       




//             <div className='mt-4 flex  flex-wrap'>
//             <Box
//       sx={{
//         '& > :not(style)': { m: 1, width: '80ch' },
//       }}>


//             <TextField label='validity-period'    sx={{

// '& label.Mui-focused': {
//   color: 'black',
//   fontSize:'16px'

//   },
// '& .MuiOutlinedInput-root': {
// "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
//   borderColor: "black",
//   borderWidth: '3px'
//   },
// '&.Mui-focused fieldset':  {
//   borderColor: 'black', // Set border color to transparent when focused

// }
// },
         
//         }}    className='myTextField'    
//             id='validity'  value={validity} onChange={handleChangeHotspotPackage}
//            placeholder='validity-period...' type='number' ></TextField>

// </Box>


// <DemoContainer  sx={{

// '& label.Mui-focused': {
//   color: 'black'
//   },
// '& .MuiOutlinedInput-root': {
// "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
//   borderColor: "black",
//   borderWidth: '3px'
//   },
// '&.Mui-focused fieldset':  {
//   borderColor: 'black', // Set border color to transparent when focused

// }
// },
//     }}  components={['TimePicker', 'TimePicker']}>
//       <TimePicker className='myTextField'
//         label="Valid From"
//         value={hotspotPackage.valid_from}
//       //  minDate={dayjs(new Date())}
//       //    maxDate={dayjs(new Date())} 
// onChange ={(date) => handleChangeTimeFrom(date)}
//         viewRenderers={{
//           hours: renderTimeViewClock,
//           minutes: renderTimeViewClock,
//           seconds: renderTimeViewClock,
//         }}
      

//       />
//       <TimePicker  className='myTextField'
//         label="Valid Until" value={hotspotPackage.valid_until}
//         onChange ={(date) => handleChangeTimeUntil(date)}

//         // minDate={dayjs(new Date())}
//         // maxDate={dayjs(new Date(new Date().getTime() + (30 * 24 * 60 * 60 * 1000)))} // 30 days from today
//         // onChange={(newValue) => {
//         //   setDateTimeValue(newValue)
//         // }   }

//         viewRenderers={{
//           hours:  renderTimeViewClock,
//           minutes:  renderTimeViewClock,
//           seconds: renderTimeViewClock,
//         }}


       
//       />
//     </DemoContainer>


//     <div className="flex justify-center items-center flex-col space-y-4">
//   <p className="text-xl font-thin text-green-600 mb-4">Valid Days</p>

//   <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
//     {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
//       <label
//         key={day}
//         className="flex items-center space-x-2 p-4 bg-white rounded-xl shadow-lg cursor-pointer hover:shadow-xl transition-shadow duration-300"
//       >
        
//         <input
//          type="checkbox"
//          className="form-checkbox h-5 w-5 text-green-600 rounded border-2 border-green-500 focus:ring-green-500"
//          checked={hotspotPackage.weekdays?.includes(day)}
//  // Check if the day is in state
//          onChange={() => handleWeekdayChange(day)} // Handle chang
//           // value={day}
//           // checked={templateStates[day]}
//           // onChange={(e) => handleCheckboxChange(e)}
//         />
//         <span className="text-gray-700 font-medium">{day}</span>
//       </label>
//     ))}
//   </div>
// </div>

// <FormControl  


//   sx={{
//     '& > :not(style)': { m: 1, width: '50ch' },

// '& label.Mui-focused': {
//   color: 'black',
//   fontSize:'16px'
//   },
// '& .MuiOutlinedInput-root': {
// "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
//   borderColor: "black",
//   borderWidth: '3px'
//   },
// '&.Mui-focused fieldset':  {
//   borderColor: 'black', // Set border color to transparent when focused

// }
// },
         
//         }}   >
//         <InputLabel id="validity_period_units">Validity period units</InputLabel>
//         <Select
//         value={validity_period_units} onChange={e=>  setHotspotPackage({...hotspotPackage, 
//           validity_period_units: e.target.value})}
//           id="validity_period_units"
//           label="Validity-period-units"
             
         
        

//         >
//            <MenuItem value="">
//                   <em>None</em>
//                 </MenuItem>
//           <MenuItem value={'days'}>days</MenuItem>
//           <MenuItem value={'hours'}>hours</MenuItem>
//           <MenuItem value={'minutes'}>minutes</MenuItem>
//         </Select>
//       </FormControl>
//             </div>



           
//             <DialogActions>

// <button    className='dotted-font p-2 bg-red-700 rounded-md text-white '    onClick={(e)=> {
// e.preventDefault()
// handleClose()

// }}  >Cancel</button>


// {/* 
// <Button  

//   type='submit'  
//   color={`${formData.name && formData.validity && formData.upload_limit && formData
//     .download_limit && formData.price && formData.upload_burst_limit && formData.download_burst_limit !== null ? 'success' : 'primary'}`}
//   variant='outlined'  
//   disabled={!formComplete || submitting} >
//   {submitting ? 'Submitting...' : 'Save'}
// </Button>  */}





// <Button variant='outline'  type='submit' className='dotted-font p-5' >Save
//             <ReloadIcon className={`ml-2 h-4 w-4  ${loading ? 'animate-spin' : 'hidden'}  `} />

//             </Button>

// </DialogActions>
//             </form>
//           {/* {showNotification &&   <PackageNotification/>}
//           {offlineerror   && <p className='text-red-500 font-mono font-extrabold'>Something went wrong please try again later
//           </p>} */}
//         </DialogContent>
      
//       </Dialog>
//     </React.Fragment>


//   )
// }

// export default EditHotspotPackage









import React from "react";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { useState, useRef, useMemo, useEffect } from "react";
import {
  renderDigitalClockTimeView,
  renderTimeViewClock,
} from "@mui/x-date-pickers/timeViewRenderers";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import AlertTitle from "@mui/material/AlertTitle";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import dayjs from "dayjs";
import { useApplicationSettings } from "../settings/ApplicationSettings";
import { Button } from "../components/ui/button";
import { ReloadIcon } from "@radix-ui/react-icons";
import { FaUsers } from "react-icons/fa"; // Import user icon

const EditHotspotPackage = ({
  handleClose,
  loading,
  open,
  hotspotPackage,
  setHotspotPackage,
  createHotspotPackage,
  handleChangeTimeFrom,
  handleChangeTimeUntil,
  handleWeekdayChange,
}) => {
  const {
    name,
    validity,
    download_limit,
    upload_limit,
    price,
    upload_burst_limit,
    download_burst_limit,
    validity_period_units,
    shared_users, // Add shared_users to the destructured object
  } = hotspotPackage;

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm", "lg", "md"));

  const handleChangeHotspotPackage = (e) => {
    const { value, id } = e.target;
    setHotspotPackage({ ...hotspotPackage, [id]: value });
  };

  const { dateTimeValue, newDate, setNewDate, setDateTimeValue } =
    useApplicationSettings();

  return (
    <React.Fragment>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullScreen={fullScreen}
        fullWidth={true}
        maxWidth={"lg"}
      >
        <DialogContent>
          <form onSubmit={createHotspotPackage}>
            <Box
              sx={{
                "&.MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                  { m: 1, width: "50ch", border: 0 },
                "&.MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline":
                  {
                    border: 0,
                  },
              }}
            >
              <TextField
                sx={{
                  "& label.Mui-focused": {
                    color: "black",
                    fontSize: "17px",
                  },
                  "& .MuiOutlinedInput-root": {
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "black",
                      borderWidth: "3px",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "black",
                    },
                  },
                }}
                id="name"
                value={name}
                onChange={handleChangeHotspotPackage}
                className="myTextField"
                placeholder="enter name..."
                label="package-name"
                fullWidth
              ></TextField>
            </Box>

            <div className="flex gap-3 mt-4">
              <TextField
                label="bundle-price"
                sx={{
                  "& label.Mui-focused": {
                    color: "black",
                    fontSize: "17px",
                  },
                  "& .MuiOutlinedInput-root": {
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "black",
                      borderWidth: "3px",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "black",
                    },
                  },
                }}
                className="myTextField"
                onChange={handleChangeHotspotPackage}
                id="price"
                type="number"
                value={price}
                fullWidth
              ></TextField>

              <TextField
                label="upload-speed-limit(mbps)"
                value={upload_limit}
                onChange={handleChangeHotspotPackage}
                id="upload_limit"
                sx={{
                  "& label.Mui-focused": {
                    color: "black",
                  },
                  "& .MuiOutlinedInput-root": {
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "black",
                      borderWidth: "3px",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "black",
                    },
                  },
                }}
                className="myTextField"
                type="number"
                placeholder="upload-speed-limit(mbps)..."
                fullWidth
              ></TextField>

              <TextField
                value={download_limit}
                onChange={handleChangeHotspotPackage}
                label="download-speed-limit(mbps)"
                id="download_limit"
                sx={{
                  "& label.Mui-focused": {
                    color: "black",
                  },
                  "& .MuiOutlinedInput-root": {
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "black",
                      borderWidth: "3px",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "black",
                    },
                  },
                }}
                className="myTextField"
                type="number"
                fullWidth
              ></TextField>
            </div>

            {/* Shared Users Field */}
            {/* <div className="flex gap-3 mt-4">
              <TextField
                label="Shared Users"
                value={shared_users}
                name='shared_users'
                onChange={handleChangeHotspotPackage}
                id="shared_users"
                sx={{
                  "& label.Mui-focused": {
                    color: "black",
                  },
                  "& .MuiOutlinedInput-root": {
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "black",
                      borderWidth: "3px",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "black",
                    },
                  },
                }}
                className="myTextField"
                type="number"
                placeholder="Number of shared users..."
                fullWidth
                InputProps={{
                  startAdornment: (
                    <FaUsers className="mr-2 text-gray-500" /> // Add user icon
                  ),
                }}
              ></TextField>
            </div> */}

            <div className="mt-4 flex flex-wrap">
              <Box
                sx={{
                  "& > :not(style)": { m: 1, width: "80ch" },
                }}
              >
                <TextField
                  label="validity-period"
                  sx={{
                    "& label.Mui-focused": {
                      color: "black",
                      fontSize: "16px",
                    },
                    "& .MuiOutlinedInput-root": {
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "black",
                        borderWidth: "3px",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "black",
                      },
                    },
                  }}
                  className="myTextField"
                  id="validity"
                  value={validity}
                  onChange={handleChangeHotspotPackage}
                  placeholder="validity-period..."
                  type="number"
                ></TextField>
              </Box>

              <DemoContainer
                sx={{
                  "& label.Mui-focused": {
                    color: "black",
                  },
                  "& .MuiOutlinedInput-root": {
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "black",
                      borderWidth: "3px",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "black",
                    },
                  },
                }}
                components={["TimePicker", "TimePicker"]}
              >
                <TimePicker
                  className="myTextField"
                  label="Valid From"
                  value={hotspotPackage.valid_from}
                  onChange={(date) => handleChangeTimeFrom(date)}
                  viewRenderers={{
                    hours: renderTimeViewClock,
                    minutes: renderTimeViewClock,
                    seconds: renderTimeViewClock,
                  }}
                />
                <TimePicker
                  className="myTextField"
                  label="Valid Until"
                  value={hotspotPackage.valid_until}
                  onChange={(date) => handleChangeTimeUntil(date)}
                  viewRenderers={{
                    hours: renderTimeViewClock,
                    minutes: renderTimeViewClock,
                    seconds: renderTimeViewClock,
                  }}
                />
              </DemoContainer>

              <div className="flex justify-center items-center flex-col space-y-4">
                <p className="text-xl font-thin text-green-600 mb-4">Valid Days</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
                  {[
                    "Monday",
                    "Tuesday",
                    "Wednesday",
                    "Thursday",
                    "Friday",
                    "Saturday",
                    "Sunday",
                  ].map((day) => (
                    <label
                      key={day}
                      className="flex items-center space-x-2 p-4 bg-white rounded-xl shadow-lg cursor-pointer hover:shadow-xl transition-shadow duration-300"
                    >
                      <input
                        type="checkbox"
                        className="form-checkbox h-5 w-5 text-green-600 rounded border-2 border-green-500 focus:ring-green-500"
                        checked={hotspotPackage.weekdays?.includes(day)}
                        onChange={() => handleWeekdayChange(day)}
                      />
                      <span className="text-gray-700 font-medium">{day}</span>
                    </label>
                  ))}
                </div>
              </div>

              <FormControl
                sx={{
                  "& > :not(style)": { m: 1, width: "50ch" },
                  "& label.Mui-focused": {
                    color: "black",
                    fontSize: "16px",
                  },
                  "& .MuiOutlinedInput-root": {
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "black",
                      borderWidth: "3px",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "black",
                    },
                  },
                }}
              >
                <InputLabel id="validity_period_units">
                  Validity period units
                </InputLabel>
                <Select
                  value={validity_period_units}
                  onChange={(e) =>
                    setHotspotPackage({
                      ...hotspotPackage,
                      validity_period_units: e.target.value,
                    })
                  }
                  id="validity_period_units"
                  label="Validity-period-units"
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value={"days"}>days</MenuItem>
                  <MenuItem value={"hours"}>hours</MenuItem>
                  <MenuItem value={"minutes"}>minutes</MenuItem>
                </Select>
              </FormControl>
            </div>

            <DialogActions>
              <button
                className="dotted-font p-2 bg-red-700 rounded-md text-white"
                onClick={(e) => {
                  e.preventDefault();
                  handleClose();
                }}
              >
                Cancel
              </button>

              <Button
                variant="outline"
                type="submit"
                className="dotted-font p-5"
              >
                Save
                <ReloadIcon
                  className={`ml-2 h-4 w-4  ${
                    loading ? "animate-spin" : "hidden"
                  }  `}
                />
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
};

export default EditHotspotPackage;





