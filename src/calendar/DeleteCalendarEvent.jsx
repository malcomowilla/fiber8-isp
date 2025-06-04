
import { AnimatePresence, motion } from "framer-motion";
import { FiAlertCircle } from "react-icons/fi";
import { useState, useEffect } from "react";
import {useApplicationSettings} from '../settings/ApplicationSettings'
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { ImSpinner9 } from "react-icons/im";
import { LuCalendarDays } from "react-icons/lu";
import { CiBellOn } from "react-icons/ci";
import { MdOutlineEdit } from "react-icons/md";
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import TextField from '@mui/material/TextField';
import { FaRegHandPointLeft } from "react-icons/fa6";
// import { useLayoutSettings } from '../settings/LayoutSettings';

import { renderTimeViewClock } from '@mui/x-date-pickers/timeViewRenderers';

import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Divider,
  Typography,
  Grid,
  IconButton,
  Tooltip,
  CircularProgress,
  Snackbar,
  Alert
} from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CloudIcon from '@mui/icons-material/Cloud';
import WarningIcon from '@mui/icons-material/Warning';
import toast, { Toaster } from 'react-hot-toast';

const DeleteCalendarEvent = ({ isOpenDelete,handleChange, calendarEventForm, setisOpenDelete, loading, start, end, 
   eventId, handleUpdateEvent, handleChangeDateTime1, handleDeleteEvent, handleChangeDateTime2}) => {



const {user_name, calendarSettings} = useApplicationSettings()
const [editEvent, setEditEvent] = useState(false)
const [showEvent, setShowEvent] = useState(true)
// const { settings, borderRadiusClasses } = useLayoutSettings();


  const {title,  task_type, status, assigned_to, client } = calendarEventForm




console.log('calendarEventForm', calendarEventForm)

  const my_task_type = [
    { value: '8', label: 'Installation' },
    { value: '16', label: 'Repair' },
    { value: '24', label: 'Maintenance' },
    { value: '30', label: 'Upgrade' },
    { value: '32', label: 'Other' },
  ];




  const task_status = [
    { value: '8', label: 'Failed' },
    { value: '16', label: 'Completed' },
    { value: '24', label: 'In Progress' },
    { value: '30', label: 'New' },
  ];
// const {

//   start_in_minutes,
//         start_in_hours} = calendarSettings
  
  return (
    <AnimatePresence>
    {isOpenDelete && (
     <motion.div
     initial={{ opacity: 0 }}
     animate={{ opacity: 1 }}
     exit={{ opacity: 0 }}
     className="bg-slate-900/20 backdrop-blur p-8 fixed inset-0 z-50 grid place-items-center overflow-y-scroll 
     cursor-pointer"
   >
     <motion.div
       initial={{ scale: 0, rotate: "12.5deg" }}
       animate={{ scale: 1, rotate: "0deg" }}
       exit={{ scale: 0, rotate: "0deg" }}
       className={`bg-gradient-to-br bg-white
        p-6  w-full
        max-w-lg shadow-xl cursor-default relative
         overflow-hidden `}
     >

                  {showEvent ? <>
                    <FiAlertCircle className="text-white/10 rotate-12 text-[250px] absolute z-0 -top-24 -left-24" />

       <div className="relative z-10">
       <div className="bg-white w-16 h-16 mb-2 rounded-full text-3xl text-rose-600 grid place-items-center mx-auto">
             <FiAlertCircle />
           </div>
         <h3 className="text-3xl font-bold  text-center text-black   playwrite-de-grund mb-2">
           {title}
         </h3>
        


<div className="mb-5  text-black">
{end.format('YYYY-MM-DD HH:mm A')} {'<=>'} {start.format('YYYY-MM-DD HH:mm A')}

</div>

<div className='text-black flex gap-4 font-extralight'>
  <LuCalendarDays className='w-5 h-5'/>
  <p className='text-black'>{user_name}</p>
</div>



<div className='text-black flex gap-4  mt-5'>
  <CiBellOn className='font-bold text-xl text-black' />
  {/* {start_in_hours ? <p className='font-thin'>   {start_in_hours} Hours Before</p> : '' }

{start_in_minutes ? <p className='font-thin'>   {start_in_minutes } Minutes Before</p> : ''} */}

  
</div>

<div className='text-black flex gap-4  mt-5 cursor-pointer hover:bg-green-400 w-fit p-1 rounded-md hover:bg-opacity-25' onClick={()=> {
setEditEvent(true)
setShowEvent(false)
} }>
  <MdOutlineEdit className='w-5 h-5'/>
  <p className=''>Edit Event</p>
</div>

<div className="flex gap-8 mt-3">

           <button
           onClick={handleDeleteEvent}
           disabled={loading}
             className={`bg-red-600 p-5  rounded-md `}
           >
                             {loading && <ImSpinner9 className={`${loading && 'animate-spin'}`}/> }

               Delete
           </button>


           <button
             onClick={()=> setisOpenDelete(false)}
             className={`btn btn-active bg-red-400 p-5  rounded-md `}
           >
               Cancel
           </button>
         </div>

     
       </div>
                  
                  
                  
                    </> : null}
                   

       {editEvent  ? <>
        <form onSubmit={handleUpdateEvent}>
              <TextField sx={{
  '& label.Mui-focused':{
    color: 'black'
  },
width: '100%',

'& .MuiOutlinedInput-root': {
  
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: "black",
    borderWidth: '3px'
    },
 '&.Mui-focused fieldset':  {
    borderColor: 'black', // Set border color to transparent when focused

  }
},
}}  label="Event Title"  onChange={handleChange} name='title' value={title} />



 <FormControl
 
 fullWidth sx={{ mt: 3 }}>
                <InputLabel>Task Type</InputLabel>
                <Select
                  name="task_type"
                    className='myTextField'
                  value={task_type}
                   onChange={handleChange}
                  label="Task Type"
                  required
                >
                  {my_task_type.map(option => (
                    <MenuItem key={option.value} value={option.label}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>




 <FormControl fullWidth sx={{ mt: 3 }}>
                <InputLabel>Status</InputLabel>
                <Select
                  name="status"
                    className='myTextField'
                 value={status}
                onChange={handleChange}
                  label="Status"
                  required
                >
                  {task_status.map(option => (
                    <MenuItem key={option.value} value={option.label}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>


<div className='p-2'>
<DemoContainer  sx={{
'& label.Mui-focused': {
  color: 'white'
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



<DateTimePicker  viewRenderers={{
    hours: renderTimeViewClock,
    minutes: renderTimeViewClock,
    seconds: renderTimeViewClock,
  }}   value={calendarEventForm.start} onChange={(date)=> handleChangeDateTime1(date)} className='myTextField'
        label="Start"
     

      
      
      

      />
      <DateTimePicker viewRenderers={{
    hours: renderTimeViewClock,
    minutes: renderTimeViewClock,
    seconds: renderTimeViewClock,
  }}   value={calendarEventForm.end} onChange={(date)=> handleChangeDateTime2(date)} className='myTextField'
      
        label="End"
        // minDate={dayjs(new Date())}
        // maxDate={dayjs(new Date(new Date().getTime() + (30 * 24 * 60 * 60 * 1000)))} // 30 days from today
        // onChange={(newValue) => {
        //   setDateTimeValue(newValue)
        // }   }

      

       
      />



    </DemoContainer>
    </div>
              <div className="flex gap-2 p-3 mt-3">
                <button

                 type='submit'
                  className={`bg-green-600 p-4  rounded-md text-white`}
                >
                  update
                </button>
                <button
                  onClick={(e) =>{
                    e.preventDefault()
                    setisOpenDelete(false)
                  } }
                  className={`bg-red-700 p-4  rounded-md text-white`}
                >
                  cancel
                </button>
              </div>
                    <div className='cursor-pointer' onClick={()=> {
                        setEditEvent(false)
                        setShowEvent(true)
                    } }>
                    <FaRegHandPointLeft className='text-black ' />
                    <p className='playwrite-de-grund text-black font-light'>Back</p>
                    </div>
              
              </form>
       </>: ''}
      
       
     </motion.div>
   </motion.div>
    )}
  </AnimatePresence>
   
  );
};

// const SpringModal = ({ isOpen, setIsOpen, addCustomer, handleCloseRegistrationForm }) => {
//   const { customerformData,  setcustomerformData} = useApplicationSettings()
//   const {name, email, phone_number, customer_code, location, amount_paid} = customerformData

// const handleChange = (e) => {
//   const {name, value} =  e.target
//   setcustomerformData((prevData) => (
//     {...prevData, [name]: value}
//   ))
// }




export default DeleteCalendarEvent;










































