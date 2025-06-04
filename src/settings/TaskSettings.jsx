import React, { useState, useEffect, useCallback } from 'react';
import toast, { Toaster } from 'react-hot-toast';

import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Grid,
  Paper,
  CircularProgress,
  Alert
} from '@mui/material';
const TaskSettings = () => {
  const [settings, setSettings] = useState({
    start_in_hours: '',    // Default 9 AM
    start_in_minutes: ''   // Default 0 minutes
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
//   const { enqueueSnackbar } = useSnackbar();

const subdomain = window.location.hostname.split('.')[0]
  // Fetch existing settings on component mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/calendar_settings', {
            headers: {
              'X-Subdomain': subdomain,
            },
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.length > 0) {
            setSettings({
              start_in_hours: data[0].start_in_hours ,
              start_in_minutes: data[0].start_in_minutes 
            });
          }
        }
      } catch (err) {
        console.error('Error fetching settings:', err);
        setError('Failed to load settings');
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    // setSettings(prev => ({
    //   ...prev,
    //   [name]: parseInt(value) || 0
    // }));






     setSettings((prevData) => {
          let updatedData = { ...prevData };
          let updatedSettings = { ...prevData, [name]: value, };
      
      // console.log('check_inactive_hrs', updatedData .check_inactive_hrs)
          // Handle specific cases for check_inactive_minutes, check_inactive_hrs, and check_inactive_days
          if (name === 'start_in_hours') {
            updatedSettings.start_in_minutes = ''
            
      
      
      
          } else if (name === 'start_in_minutes') {
              updatedSettings.start_in_hours = ''
          
          }
      
      console.log("start in hours or minutes=>", updatedSettings );
          return updatedSettings;

        });

  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/calendar_settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Subdomain': subdomain,
        },
        body: JSON.stringify({
          calendar_setting: settings
        })
      });

      if (response.ok) {
        // enqueueSnackbar('Settings saved successfully!', { variant: 'success' });
        toast.success('Settings saved successfully!', {
          position: "top-center",
          duration: 4000,
        })
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save settings');
      }
    } catch (err) {
      console.error('Error saving settings:', err);
      setError(err.message);
    //   enqueueSnackbar(err.message, { variant: 'error' });
    toast.error(err.message, {
      position: "top-center",
      duration: 4000,
    })
    } finally {
      setLoading(false);
    }
  };

  // Validate hours (0-23) and minutes (0-59)
  const validateTime = () => {
    return (
      settings.start_in_hours >= 0 && 
      settings.start_in_hours <= 23 &&
      settings.start_in_minutes >= 0 && 
      settings.start_in_minutes <= 59
    );
  };

  return (
    <>
    <Toaster />
    <Paper elevation={3} sx={{ p: 4, maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h5" gutterBottom>
        <p className='roboto-condensed'>Task Settings</p>
      </Typography>
      <Typography variant="body1" color="text.secondary" mb={4}>
        <p className='text-black roboto-condensed '>Configure time before the event 
            starts to send notification to users of the task ahead, default will be thirty minutes (minutes or hours)</p>
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <TextField
            className='myTextField'
              fullWidth
              label="Start Hour"
              name="start_in_hours"
            //   type="number"
              value={settings.start_in_hours}
              onChange={handleChange}
              inputProps={{
                min: 0,
                max: 23,
                step: 1
              }}
            //   required
              error={settings.start_in_hours < 0 || settings.start_in_hours > 23}
              helperText={
                (settings.start_in_hours < 0 || settings.start_in_hours > 23) 
                ? 'Must be between 0-23' 
                : ''
              }
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Start Minute"
              className='myTextField'
              name="start_in_minutes"
            //   type="number"
              value={settings.start_in_minutes}
              onChange={handleChange}
              inputProps={{
                min: 0,
                max: 59,
                step: 1
              }}
            //   required
              error={settings.start_in_minutes < 0 || settings.start_in_minutes > 59}
              helperText={
                (settings.start_in_minutes < 0 || settings.start_in_minutes > 59) 
                ? 'Must be between 0-59' 
                : ''
              }
            />
          </Grid>
        </Grid>

        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            type="submit"
            variant="contained"
            disabled={loading || !validateTime()}
            startIcon={loading ? <CircularProgress size={20} /> : null}
          >
            {loading ? <p className='roboto-condensed'>Saving...</p> : <p  className='roboto-condensed' >Save Settings</p>}
          </Button>
        </Box>
      </Box>

      <Box sx={{ mt: 4, bgcolor: 'grey.100', p: 2, borderRadius: 1 }}>
        <Typography variant="subtitle2">
            
            <p  className='roboto-condensed-light'>Preview: </p>
            </Typography>
        <Typography>
          <p className='roboto-condensed'>Default event start notification will be
             (30 minutes) before the scheduled time </p>
        </Typography>
      </Box>
    </Paper>
    </>
  );
};

export default TaskSettings;