import React, { useState, useEffect } from 'react';
import MaterialTable from 'material-table';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  TextField, 
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
  Alert,











  Box,
  Stack,
  RadioGroup,
  Radio,
  FormControlLabel,
  AppBar,
  Toolbar,
  useTheme,
  useMediaQuery,
  Paper,
  Slide,
  Chip,
  Avatar,
} from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CloudIcon from '@mui/icons-material/Cloud';
import WarningIcon from '@mui/icons-material/Warning';
import toast, { Toaster } from 'react-hot-toast';
import { useApplicationSettings } from '../settings/ApplicationSettings';

import Autocomplete from '@mui/material/Autocomplete';
import { FaRegUser } from "react-icons/fa6";
import { TbDeviceImacPlus } from "react-icons/tb";
import { RiSortNumberAsc } from "react-icons/ri";
import { TbDeviceAnalytics } from "react-icons/tb";
import { IoPersonSharp } from "react-icons/io5";



import {
  Close as CloseIcon,
  Person as PersonIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Category as CategoryIcon,
  PriorityHigh as PriorityIcon,
  SupervisorAccount as AgentIcon,
  Description as DescriptionIcon,
  Save as SaveIcon,
  ArrowBack as ArrowBackIcon,
  Update as UpdateIcon,
} from '@mui/icons-material';
import Lottie from 'react-lottie';
import LoadingAnimation from '../loader/loading_animation.json';
import {
    InputAdornment,

  ListItem,
  ListItemText,
  ListItemIcon,
  
} from '@mui/material';




const EditEquipment = ({openDialog, setOpenDialog,loading, setLoading, editing, setEditing,


  onChange,
        equipmentForm, customers,handleCreateEquipment,setEquipmentForm,


 }) => {

  const { equipmentName, type, user, price, amount_paid, name, model, serial_number,
    name_of_customer
   } = equipmentForm
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };


  const equipmentTypeOptions = [
    { value: '8', label: 'Router' },
    { value: '16', label: 'Switch' },
        {value: '20', label: 'Other'},
    { value: '24', label: 'Server' },
    { value: '32', label: 'Access Point' },
  ];
console.log('equipment fromrm type',equipmentForm.type)

  return (

    <div>
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ bgcolor: 'green', color: 'white' }}>
          {editing ? 'Edit Equipment' : 'Add Equipment'}
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <form  onSubmit={handleCreateEquipment}>
          <Grid container spacing={3}>
            <Grid item xs={12}>


              
                <Autocomplete
                  fullWidth
                  sx={{
                    mt: 2
                  }}
                  options={customers}
                  getOptionLabel={(option) => {
  if (typeof option === 'string') return option;  // If option is a string
  if (option && typeof option === 'object') return option.name || ''; // If option is an object
  return '';
}}
                  renderOption={(props, option) => (
                    <Box component="li" {...props}>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Avatar sx={{ bgcolor: 'primary.main' }}>
                          {option.name.charAt(0)}
                        </Avatar>
                        <Stack>
                          <Typography variant="subtitle2">{option?.name}</Typography>
                          <Typography 
                           sx={{
                              color: 'black'
                            }}
                          variant="caption" color="text.secondary">
                           
                            {option.ppoe_username
}
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
                            <PersonIcon />
                          </InputAdornment>
                        ),
                      }}
                    />
                  )}
                  value={user}
                onChange={(event, newValue) => {
                  console.log('equipment form',equipmentForm)
   console.log('new value',newValue)
                  setEquipmentForm({
                    ...equipmentForm,
                    user: newValue?.name || ''
                  })
  }}
                />
              <small> The user who has rented this equipment.</small>
            </Grid>
            <Grid item xs={12} sm={6}>



 <TextField
              fullWidth
              className='myTextField'
    sx={{
    '& .MuiAutocomplete-inputRoot': {
      padding: '9px 14px', // Match Select component padding
    },
    mt: 2
  }}
      label="Name or Account Number"
      required
      InputProps={{
        startAdornment: <IoPersonSharp className='mr-2'  />
      }}

        name='name_of_customer'
    onChange={onChange}
    value={name_of_customer}
             >

             </TextField>



                <Autocomplete
  fullWidth
  name='device_type'
  options={equipmentTypeOptions}
  value={equipmentTypeOptions.find(option => option.label === equipmentForm.device_type) || null}
  
  onChange={(event, newValue) => {
    console.log('new value type',newValue)
    onChange({
      target: {
        name: "device_type",
        value: newValue?.label || ''
      }
    });
  }}
  getOptionLabel={(option) => option.label}
  renderInput={(params) => (
    <TextField
      {...params}
      label="Type"
      required
      className="myTextField"
    />
  )}
  disableClearable
  isOptionEqualToValue={(option, value) => option.value === value.value}
  sx={{
    '& .MuiAutocomplete-inputRoot': {
      padding: '8px 14px',
    },
    mt: 2 // Add margin if needed
  }}
/>


            </Grid>


            <Grid item xs={12} sm={6}>
             <TextField
              fullWidth
              className='myTextField'
    sx={{
    '& .MuiAutocomplete-inputRoot': {
      padding: '9px 14px', // Match Select component padding
    },
    mt: 2
  }}
      label="Name"
      required
      InputProps={{
        startAdornment: <TbDeviceAnalytics className='mr-2'  />
      }}

        name='name'
    onChange={onChange}
    value={name}
             >

             </TextField>
              <small> name of the equipment.</small>

            </Grid>
            <Grid item xs={12}>
        
    <TextField
    name='model'
    onChange={onChange}
    value={model}
         fullWidth
className='myTextField'
      label="Model"
      sx={{
    '& .MuiAutocomplete-inputRoot': {
      padding: '9px 14px', // Match Select component padding
    },
    mt: 2
  }}
      InputProps={{
        startAdornment: <TbDeviceImacPlus className='mr-2' />
      }}
    />


<small>Make and model of the equipment.</small>


    <TextField
     fullWidth
     className='myTextField'
    sx={{
    '& .MuiAutocomplete-inputRoot': {
      padding: '9px 14px', // Match Select component padding
    },
    mt: 2
  }}
      label="Serial Number"
      required
      InputProps={{
        startAdornment: <RiSortNumberAsc className='mr-2'  />
      }}

        name='serial_number'
    onChange={onChange}
    value={serial_number}
    />
  

<small> Serial number of the equipment.</small>




    <TextField
    className='myTextField'
     fullWidth
    sx={{
    '& .MuiAutocomplete-inputRoot': {
      padding: '9px 14px', // Match Select component padding
    },
    mt: 2
  }}
      label="Price of the equipment"
      InputProps={{
        startAdornment: <p className='mr-2'>KSH</p>
      }}
       name='price'
    onChange={onChange}
    value={price}
    />






    <TextField
    className='myTextField'
     fullWidth
    sx={{
    '& .MuiAutocomplete-inputRoot': {
      padding: '9px 14px', // Match Select component padding
    },
    mt: 2
  }}
      label="Amount Paid"
      InputProps={{
        startAdornment: <p className='mr-2'>KSH</p>
      }}

        name='amount_paid'
    onChange={onChange}
    value={amount_paid}
    />
            </Grid>
           
          </Grid>

            <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleCloseDialog} sx={{
            color: 'white',
            backgroundColor: 'red',
            borderRadius: '5px',
            '&:hover': {
              backgroundColor: 'black'
            }
          }}>
            Cancel
          </Button>

          
          <Button 
            type="submit"
            variant="contained" 
            color="success"
            disabled={loading}
            startIcon={loading && <CircularProgress size={20} />}
          >
            {editing ? loading ? 'Loading....' : 'Update' : loading ? 'Loading....' : 'Create'}
          </Button>
        </DialogActions>
          </form>
        </DialogContent>
      
      </Dialog>
    </div>
  )
}

export default EditEquipment



























