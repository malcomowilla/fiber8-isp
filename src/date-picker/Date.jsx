import { DateTimePicker,LocalizationProvider } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns'; // Import the appropriate date adapter
import {Stack, TextField} from '@mui/material'
import {useState} from 'react'
export const DatePicker = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
    <Stack spacing={4} sx={{width: '250px'}}>
          <DateTimePicker label="Basic date time picker" 
          
          renderInput={(params)=> <TextField {...params}/>}
          value={selectedDate}
          onChange={handleDateChange}
          />

    </Stack>
    </LocalizationProvider>
  );
};
