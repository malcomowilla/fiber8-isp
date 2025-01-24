

import React, { useState } from 'react';
import { Box, Typography, TextField, Button, FormControlLabel, Checkbox, Paper, CircularProgress } from '@mui/material';
import { motion } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';
// import SystemAdminEmailSettings from './SystemAdminEmailSettings'

const Settings = () => {
  const [isLocked, setIsLocked] = useState(false);
  const [settingValue, setSettingValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [subdomain, setSubdomain] = useState('');




  const handleChangeSubdomain = (e) => {
    setSubdomain(e.target.value);
  };
  const validateSettings = () => {
    if (settingValue.trim().length < 3) {
      setError('Setting value must be at least 3 characters long');
      return false;
    }
    setError('');
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // if (!validateSettings()) {
    //   return;
    // }

    setIsLoading(true);
    try {
      const response = await fetch('/api/lock_admin_account', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          locked_account: isLocked,
          setting_value: settingValue,
          subdomain: subdomain
        })
      });
  
      if (response.ok) {
        toast.success('Settings saved successfully', {
          duration: 4000,
          icon: '✅'
        });
      } else {
        const data = await response.json();
        toast.error(data.error, {
          duration: 4000,
          icon: '❌'
        });
        throw new Error(data.message || 'Failed to save settings');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error(error.message || 'Error saving settings', {
        duration: 4000,
        icon: '❌'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 600, margin: '0 auto', padding: 2 }}>
      <Toaster position="top-center"/>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Paper elevation={3} sx={{ padding: 4, borderRadius: 2 }}>
          <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
            Account Settings
          </Typography>
          
          <form onSubmit={handleSubmit}>
            <Box sx={{ mb: 3 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={isLocked}
                    onChange={(e) => setIsLocked(e.target.checked)}
                    color="success"
                    disabled={isLoading}
                  />
                }
                label="Lock Account"
              />
            </Box>

            <TextField
             sx={{
              mb: 3,
              '& label.Mui-focused': { color: 'black' },
              '& .MuiOutlinedInput-root': {
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "black",
                  borderWidth: '3px'
                }
              }
            }}
              spacing={{
                xs: 1,
                sm: 2
              }}
            className='myTextField'
              label="Subdomain"
              variant="outlined"
              fullWidth
              value={subdomain}  
              onChange={handleChangeSubdomain}
              // error={!!error}
              // helperText={error}
              disabled={isLoading}
            />

            <Button 
              type="submit"
              variant="contained" 
              color="success" 
              disabled={isLoading}
              sx={{ 
                minWidth: 120,
                position: 'relative'
              }}
            >
              {isLoading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                'Save Settings'
              )}
            </Button>
          </form>
          {/* <SystemAdminEmailSettings/> */}

        </Paper>
      </motion.div>
    </Box>
  );
};

export default Settings;
