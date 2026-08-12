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

import { ThemeProvider, createTheme } from '@mui/material/styles';

import { useMemo, useEffect, useCallback } from 'react';




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








  function useIsDarkMode() {
    const [isDark, setIsDark] = useState(
      () => typeof document !== 'undefined' &&
        document.documentElement.classList.contains('dark')
    );
  
    useEffect(() => {
      const root = document.documentElement;
  
      const update = () => setIsDark(root.classList.contains('dark'));
      update();
  
      const observer = new MutationObserver(update);
      observer.observe(root, { attributes: true, attributeFilter: ['class'] });
  
      return () => observer.disconnect();
    }, []);
  
    return isDark;
  }
  
  
  
  
  const isDark = useIsDarkMode();
  
  const tableTheme = useMemo(() => createTheme({
    palette: {
      mode: isDark ? 'dark' : 'light',
      background: {
        paper: isDark ? '#1e1e1e' : '#ffffff',
        default: isDark ? '#1e1e1e' : '#ffffff',
      },
      text: {
        primary: isDark ? '#f1f1f1' : '#1a1a1a',
        secondary: isDark ? '#a3a3a3' : '#6b7280',
      },
    },
  }), [isDark]);
  

  return (
          <ThemeProvider theme={tableTheme}>
    
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
        <Typography variant="h6"><p className='font-sans
'>Edit Lead Information</p></Typography>
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
            label={<p className='font-sans
'>Full Name</p>}
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
            label={<p className='font-sans
'>Email Address</p>}
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
            label={<p className='font-sans
'>Location </p>}
            name="location"
            value={formData.location}
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
            label={<p className='font-sans
'>Phone Number </p>} 
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
            <p className='font-sans
'>Cancel </p>
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
            {loading ? <p className='font-sans
'>Saving...</p> : <p>{editLead ?<p className='font-sans
'>Update Lead</p> : <p className='font-sans
'>Save Lead</p>} </p>}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
    </ThemeProvider>
    
  );
};

export default EditLead;