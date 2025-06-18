

import { AnimatePresence, motion } from "framer-motion";
import { FiAlertCircle } from "react-icons/fi";
import { useState } from "react";
import TextField from '@mui/material/TextField';
import { DemoContainer  } from '@mui/x-date-pickers/internals/demo';
import dayjs from 'dayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { StaticDateTimePicker } from '@mui/x-date-pickers/StaticDateTimePicker';
import { renderTimeViewClock } from '@mui/x-date-pickers/timeViewRenderers';
// import { useLayoutSettings } from '../settings/LayoutSettings';
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
import {useApplicationSettings} from '../settings/ApplicationSettings'




const CalendarEvent = ({ isOpen, setIsOpen , calendarEventForm, handleChange, handleChangeDateTime1,
   handleChangeDateTime2, handleCreateEvent}) => {


  const {title, start, end, task_type, status, assigned_to, client } = calendarEventForm
//   const { settings, borderRadiusClasses } = useLayoutSettings();

const {
   showMenu1, setShowMenu1, showMenu2, setShowMenu2, showMenu3, setShowMenu3,
      showMenu4, setShowMenu4, showMenu5, setShowMenu5, showMenu6, setShowMenu6,
       showMenu7, setShowMenu7, showMenu8, setShowMenu8, showMenu9, setShowMenu9,
        showMenu10, setShowMenu10, showMenu11, setShowMenu11, showMenu12, setShowMenu12,

} = useApplicationSettings()


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

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsOpen(false)}
          className="bg-slate-900/20 backdrop-blur p-8 fixed inset-0
           z-50 grid place-items-center overflow-y-scroll cursor-pointer"
        >
          <motion.div
            initial={{ scale: 0, rotate: "12.5deg" }}
            animate={{ scale: 1, rotate: "0deg" }}
            exit={{ scale: 0, rotate: "0deg" }}
            onClick={(e) => e.stopPropagation()}
            className={`bg-white text-black p-6 w-full
             max-w-lg shadow-xl cursor-default relative overflow-hidden
             `}
          >
            <FiAlertCircle className="text-white/10 rotate-12 text-[250px] absolute z-0 -top-24 -left-24" />
            <div className="relative z-10">
              <div className="bg-white w-16 h-16 mb-2 rounded-full text-3xl text-green-600 grid place-items-center mx-auto">
                <FiAlertCircle />
              </div>
              <h3 className="text-3xl font-bold text-center mb-2">
                Add Task
              </h3>

              <form onSubmit={handleCreateEvent}>
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
}}  label="Event Title"  name='title'  onChange={handleChange}/>


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
      <DateTimePicker  viewRenderers={{
    hours: renderTimeViewClock,
    minutes: renderTimeViewClock,
    seconds: renderTimeViewClock,
  }}   onChange={(date)=> handleChangeDateTime1(date)}  className='myTextField'
        label="Start"
     

      
      
      

      />
      <DateTimePicker viewRenderers={{
    hours: renderTimeViewClock,
    minutes: renderTimeViewClock,
    seconds: renderTimeViewClock,
  }}   onChange={(date)=> handleChangeDateTime2(date)} className='myTextField'
      
        label="End"
        

      

       
      />
    </DemoContainer>
    </div>
              <div className="flex gap-4 p-3 mt-3">


              <button type='submit' className={`px-6  
 flex-1 flex items-center  justify-center gap-2  py-3.5 font-medium 
                        bg-black text-white rounded-md transition-all
                         hover:bg-primary disabled:opacity-50 disabled:cursor-not-allowed
  `}>
        Create
      </button>


      <button     onClick={(e) =>{
                    e.preventDefault()
                    setIsOpen(false)
                  } } 
                  className={`flex-1 px-6 py-3.5 font-medium 
                        text-gray-700  transition-all
                               hover:bg-red-500 hover:text-white 
                               rounded-md
                               bg-warn_primary`}>
        Cancel
      </button>
               
              </div>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CalendarEvent;