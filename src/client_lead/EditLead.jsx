import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Typography,
  Box,
  CircularProgress,
  Slide,
  useTheme,
  useMediaQuery,
  TextField,
  Divider,
  Avatar,
  InputAdornment
} from '@mui/material';
import {
  Close as CloseIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Business as BusinessIcon,
  Phone as PhoneIcon
} from '@mui/icons-material';
import { forwardRef } from 'react';

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const EditLead = ({ open, setOpen, formData, setFormData, createLead,
  editLead
 }) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [loading, setLoading] = useState(false);
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      console.log('Form submitted:', formData);
      setLoading(false);
      setOpen(false);
    }, 1500);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Dialog
      fullScreen={fullScreen}
      open={open}
      onClose={handleClose}
      TransitionComponent={Transition}
      PaperProps={{
        elevation: 0,
        sx: {
          borderRadius: fullScreen ? 0 : 3,
          minWidth: { xs: '100%', sm: '500px' },
          maxWidth: '100%',
          m: fullScreen ? 0 : 2,
          position: 'relative',
          overflow: 'hidden'
        }
      }}
    >
      <DialogTitle sx={{ 
        bgcolor: 'background.default',
        color: 'white',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        py: 2
      }}>
        <Typography variant="h6">Edit Lead Information</Typography>
        <IconButton 
          edge="end" 
          color="inherit" 
          onClick={handleClose}
          aria-label="close"
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <Box component="form" onSubmit={createLead}>
        <DialogContent sx={{ py: 3 }}>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            mb: 3 
          }}>
            <Avatar sx={{ 
              width: 80, 
              height: 80,
              bgcolor: 'green',
              fontSize: '2rem'
            }}>
              {formData.name?.charAt(0).toUpperCase() || <PersonIcon fontSize="large" />}
            </Avatar>
          </Box>

          <TextField
            fullWidth
            margin="normal"
            label="Full Name"
            name="name"
            className='myTextField'
            value={formData.name}
            onChange={handleChange}
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonIcon color="action" />
                </InputAdornment>
              ),
            }}
            variant="outlined"
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            className='myTextField'
            margin="normal"
            label="Email Address"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon color="action" />
                </InputAdornment>
              ),
            }}
            variant="outlined"
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            margin="normal"
            className='myTextField'
            label="Company Name"
            name="company_name"
            value={formData.company_name}
            onChange={handleChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <BusinessIcon color="action" />
                </InputAdornment>
              ),
            }}
            variant="outlined"
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            margin="normal"
            label="Phone Number"
            className='myTextField'
            name="phone_number"
            value={formData.phone_number}
            onChange={handleChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PhoneIcon color="action" />
                </InputAdornment>
              ),
            }}
            variant="outlined"
          />
        </DialogContent>

        <Divider />

        <DialogActions sx={{ 
          px: 3, 
          py: 2,
          justifyContent: 'space-between'
        }}>
          <Button 
            onClick={handleClose}
            color="inherit"
            sx={{ 
              color: theme.palette.text.success,
              '&:hover': {
                bgcolor: theme.palette.action.hover
              }
            }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="success"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
            sx={{
              minWidth: 120,
              '& .MuiCircularProgress-root': {
                color: 'white',
                marginRight: 1
              }
            }}
          >
            {loading ? 'Saving...' : <p>{editLead ? 'Update Lead' : 'Save Lead'} </p>}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default EditLead;