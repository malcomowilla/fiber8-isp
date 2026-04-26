

import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Divider,
  Box,
  Chip,
  Stack,
  IconButton,
  TextField,
  FormControl,
  RadioGroup,
  Radio,
  FormControlLabel,
  Autocomplete,
  CircularProgress,
  AppBar,
  Toolbar,
  useTheme,
  useMediaQuery,
  Paper,
  Slide,
  Avatar,
  Snackbar,
  Alert,
  InputAdornment
} from '@mui/material';
import {
  Receipt,
  Payment,
  Person,
  AccessTime,
  CreditCard,
  Close,
  CheckCircle,
  Cancel,
} from '@mui/icons-material';
import { FaReceipt } from "react-icons/fa";
import { RiSecurePaymentLine } from "react-icons/ri";





const RecordPpoePaymentDetails = ({ openRecordDetails, setOpenRecordDetails,
     payment, customers,setRecordPaymentForm,recordPaymentForm,
      handleChange, recordPayment }) => {
//   if (!payment) return null;

  


  const paymentMethods = [
    { title: 'Mpesa' },
    { title: 'Cash' },
    { title: 'Bank' },
    { title: 'Kopo Kopo' },
  
  ];




  return (
    <Dialog open={openRecordDetails}
     onClose={() => setOpenRecordDetails(false)} maxWidth="md"
     fullWidth>
      <DialogTitle className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Receipt className="text-blue-500" />
          <Typography variant="h6">Record Payment</Typography>
        </div>
        <IconButton onClick={() => setOpenRecordDetails(false)}
         size="small">
          <Close />
        </IconButton>
      </DialogTitle>
      
      <DialogContent dividers>
        <form onSubmit={recordPayment}>
        <Stack spacing={3}>
          {/* Status */}
         

            <Autocomplete
                  fullWidth
                  options={customers}
                  getOptionLabel={(option) => option.name}
                  renderOption={(props, option) => (
                    <Box component="li" {...props}>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Avatar sx={{ bgcolor: 'primary.main' }}>
                          {option.name.charAt(0)}
                        </Avatar>
                        <Stack>
                          <Typography variant="subtitle2">{option?.name}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {option?.ppoe_username}
                          </Typography>
                        </Stack>
                      </Stack>
                    </Box>
                  )}
                  renderInput={(params) => (
                    <TextField
                    className='myTextField'
                    sx={{
                      width: '100%',
                      '& label.Mui-focused': { color: 'gray' },
                      '& .MuiOutlinedInput-root': {
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          borderColor: "black",
                          borderWidth: '3px'
                        }
                      }
                    }}
                      {...params}
                      label="Select Customer"
                      InputProps={{
                        ...params.InputProps,
                        startAdornment: (
                          <InputAdornment position="start">
                            <Person />
                          </InputAdornment>
                        ),
                      }}
                    />
                    
                  )}


                  onChange={(event, newValue) => {
                    setRecordPaymentForm((prev) => ({
                      ...prev,
                      user: newValue?.name || ''
                    }));
                  }}
                />




          {/* Amount */}
          <Box className="flex items-center gap-4">
            <div className="flex-1">
             

               <TextField
               value={recordPaymentForm.amount}
               name='amount'
               onChange={handleChange}
                    className='myTextField'
                    sx={{
                      width: '100%',
                      '& label.Mui-focused': { color: 'gray' },
                      '& .MuiOutlinedInput-root': {
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          borderColor: "black",
                          borderWidth: '3px'
                        }
                      }
                    }}
                      label="Amount"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <p>KSH </p>
                          </InputAdornment>
                        ),
                      }}
                    />
             






              
             
           
            </div>


            
          </Box>

 <TextField
 name='reference'
               value={recordPaymentForm.reference}
               onChange={handleChange}
                    className='myTextField'
                    sx={{
                      width: '100%',
                      '& label.Mui-focused': { color: 'gray' },
                      '& .MuiOutlinedInput-root': {
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          borderColor: "black",
                          borderWidth: '3px'
                        }
                      }
                    }}

                      label="Receipt Number"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                           <FaReceipt />
                          </InputAdornment>
                        ),
                      }}
                    />
         

         

            <Autocomplete
                  fullWidth
                  options={paymentMethods}
                  getOptionLabel={(option) => option.title}
                  renderOption={(props, option) => (
                    <Box component="li" {...props}>
                      <Stack direction="row" spacing={2} alignItems="center">
                        
                        <Stack>
                          <Typography variant="subtitle2">{option?.title}</Typography>
                         
                        </Stack>
                      </Stack>
                    </Box>
                  )}
                  renderInput={(params) => (
                    <TextField
                    className='myTextField'
                    sx={{
                      width: '100%',
                      '& label.Mui-focused': { color: 'gray' },
                      '& .MuiOutlinedInput-root': {
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          borderColor: "black",
                          borderWidth: '3px'
                        }
                      }
                    }}
                      {...params}
                      label="Payment Method"
                      InputProps={{
                        ...params.InputProps,
                        startAdornment: (
                          <InputAdornment position="start">
                            < RiSecurePaymentLine />
                          </InputAdornment>
                        ),
                      }}
                    />
                    
                  )}


                  onChange={(event, newValue) => {
                    setRecordPaymentForm((prev) => ({
                      ...prev,
                      payment_method: newValue?.title || ''
                    }));
                  }}
                />
         

         
        </Stack>


         <DialogActions
         sx={{
            mt: 1
         }}
         >
        <button 
        type='submit'
        className='bg-green-500 hover:bg-green-700
         text-white font-bold py-2 px-4 border border-green-700 rounded'
         >
          Save
        </button>



         <button 
        className='bg-red-500 hover:bg-red-700
         text-white font-bold py-2 px-4 border border-red-700 rounded'
        onClick={(e) => {
            setOpenRecordDetails(false)
            e.preventDefault()

        }} >
          Cancel
        </button>
      </DialogActions>
      </form>
      </DialogContent>
      
      
     
    </Dialog>
  );
};

export default RecordPpoePaymentDetails;
