import React, { useState } from 'react';
import { 
  TextField, 
  Button, 
  Box, 
  Typography, 
  Paper, 
  Snackbar, 
  Alert,
  Chip,
  Grid,
  Tooltip,
} from '@mui/material';
import { ContentCopy, Check } from '@mui/icons-material';
import { Autocomplete } from '@mui/material';
import { useEffect,  } from 'react';
import { useNavigate } from 'react-router-dom';



const SendSms = () => {
    const [subscribers, setSubscribers] = useState([]);


const navigate = useNavigate()

    const subdomain = window.location.hostname.split('.')[0]


    useEffect(() => {
        const fetchSubscribers = async () => {
          try {
            const res = await fetch('/api/subscribers', {
                headers: {
                  'X-Subdomain': subdomain,
                },
            }); // Update endpoint as needed
            const data = await res.json();
            setSubscribers(data); // Assuming data is an array of subscriber objects
          } catch (err) {
            console.error('Failed to fetch subscribers', err);
          }
        };
      
        fetchSubscribers();
      }, []);

  const [smsData, setSmsData] = useState({
    to: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [copiedVar, setCopiedVar] = useState(null);

  const templateVariables = [
    { label: 'Name', value: '{{name}}' },
    { label: 'Password', value: '{{password}}' },
    { label: 'Email', value: '{{email}}' },
    { label: 'Phone', value: '{{phone}}' },
    { label: 'Date', value: '{{date}}' },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSmsData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const insertVariable = (variable) => {
    setSmsData(prev => ({
      ...prev,
      message: `${prev.message}${variable} `
    }));
    setCopiedVar(variable);
    setTimeout(() => setCopiedVar(null), 2000);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('/api/send_sms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Subdomain': subdomain,
        },
        body: JSON.stringify(smsData)
      });
      
      if (!response.ok) {
        throw new Error('Failed to send SMS');
      }
      if (response.ok) {

        setTimeout(() => {
          navigate('/admin/messages')
        }, 3000)
        
         setSnackbar({
        open: true,
        message: 'SMS sent successfully!',
        severity: 'success'
      });

      } else {
        setSnackbar({
          open: true,
          message: 'Failed to send SMS',
          severity: 'error'
        });
      }
     
      
      // Clear form
      setSmsData({
        to: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.message || 'Failed to send SMS',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({
      ...prev,
      open: false
    }));
  };

  return (
    <Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h5" component="h1" gutterBottom sx={{ mb: 3 }}>
          Send SMS
        </Typography>
        
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
            <Autocomplete
              className='myTextField'
            //   value={smsData.to}
  fullWidth
  options={subscribers}
  getOptionLabel={(option) => `${option.name} - ${option.phone_number}`} // adjust fields if needed
  onChange={(event, newValue) => {
    setSmsData(prev => ({
      ...prev,
      to: newValue ? newValue.name : ''
    }));
  }}
  renderInput={(params) => (
    <TextField
    className='myTextField'
      {...params}
      label="Select Subscriber"
      margin="normal"
      required
    />
  )}
/>
            </Grid>
            
           
            
            <Grid item xs={12}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Template Variables:
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {templateVariables.map((item) => (
                    <Tooltip key={item.value} title={`Click to insert ${item.label}`}>
                      <Chip
                        label={item.label}
                        onClick={() => insertVariable(item.value)}
                        icon={copiedVar === item.value ? <Check fontSize="small" /> : <ContentCopy fontSize="small" />}
                        color={copiedVar === item.value ? 'success' : 'default'}
                        variant="outlined"
                        sx={{ cursor: 'pointer' }}
                      />
                    </Tooltip>
                  ))}
                </Box>
              </Box>
              
              <TextField
              className='myTextField'
                fullWidth
                label="Message"
                name="message"
                value={smsData.message}
                onChange={handleChange}
                margin="normal"
                required
                multiline
                rows={6}
                helperText="160 characters = 1 SMS"
              />
            </Grid>
          </Grid>
          
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
            <Button 
              type="submit" 
              variant="contained" 
              size="large"
              disabled={loading}
              sx={{ px: 4 }}
            >
              {loading ? 'Sending...' : 'Send SMS'}
            </Button>
          </Box>
        </form>
      </Paper>

      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default SendSms;