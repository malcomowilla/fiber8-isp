import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Paper,
  Divider,
  Alert,
  CircularProgress,
  IconButton,
  Tooltip
} from '@mui/material';
import { styled } from '@mui/material/styles';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import toast, { Toaster } from 'react-hot-toast';



const ConfigPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginTop: theme.spacing(3),
  backgroundColor: theme.palette.background.paper,
}));

const PreformattedText = styled('pre')(({ theme }) => ({
  padding: theme.spacing(2),
  backgroundColor: theme.palette.grey[100],
  borderRadius: theme.shape.borderRadius,
  overflowX: 'auto',
  whiteSpace: 'pre-wrap',
  wordWrap: 'break-word',
}));

function WireguardConfigForm() {
  const [formData, setFormData] = useState({
    networkAddress: '10.2.0.0',
    subnetMask: '24',
    customIp: '',
    createRadiusEntry: false,
    pppoeUsername: ''
  });
  const [config, setConfig] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState({});


  const subnetOptions = [
    // { value: '8', label: '/8 (16,777,214 hosts)' },
    // { value: '16', label: '/16 (65,534 hosts)' },
    { value: '24', label: '/24 (254 hosts)' },
    { value: '30', label: '/30 (2 hosts)' },
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

      const subdomain = window.location.hostname.split('.')[0];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setConfig(null);

    try {
      const response = await fetch('/api/wireguard/generate_config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Subdomain': subdomain,
        },
        body: JSON.stringify({
          network_address: formData.networkAddress,
          subnet_mask: formData.subnetMask,
          client_ip: formData.customIp,
          create_radius_entry: formData.createRadiusEntry,
          pppoe_username: formData.pppoeUsername

        })
      });
      const newData = await response.json();

      if (!response.ok) {

         if (response.status === 401) {
  toast.error(newData.error, {
    position: "top-center",
    duration: 4000,
  })
   setTimeout(() => {
          // navigate('/license-expired')
          window.location.href='/signin'
         }, 1900);
}
        // const errorData = await response.json();
        throw new Error(newData.error || 'Failed to generate configuration');
      }


      if (response.status === 402) {
        setTimeout(() => {
          // navigate('/license-expired')
          window.location.href='/license-expired';
         }, 1800);
        
      }

      // const data = await response.json();
      setConfig(newData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

const ConfigBlock = styled('div')(({ theme }) => ({
  position: 'relative',
  padding: theme.spacing(2),
  backgroundColor: theme.palette.grey[100],
  borderRadius: theme.shape.borderRadius,
  marginBottom: theme.spacing(2),
  '&:hover $copyButton': {
    opacity: 1,
  },
}));

const CopyButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  right: theme.spacing(1),
  top: theme.spacing(1),
  opacity: 0,
  transition: 'opacity 0.2s',
}));

  const copyToClipboard = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopied(prev => ({ ...prev, [key]: true }));
    setTimeout(() => setCopied(prev => ({ ...prev, [key]: false })), 2000);
  };

  return (
    <>
    <Toaster />
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      <Typography variant="h4" gutterBottom>
        WireGuard Configuration Generator
      </Typography>
      
      <Paper elevation={3} sx={{ p: 3 }}>
        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'grid', gap: 3 }}>
            <TextField
                          className='myTextField'

              label="Network Address"
              name="networkAddress"
              value={formData.networkAddress}
              onChange={handleChange}
              fullWidth
              required
            />
            
            <FormControl fullWidth>
              <InputLabel>Subnet Mask</InputLabel>
              <Select
                name="subnetMask"
                value={formData.subnetMask}
                label="Subnet Mask"
                onChange={handleChange}
                required
              >
                {subnetOptions.map(option => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <TextField
              label="Custom IP (optional)"
              name="customIp"
              value={formData.customIp}
              onChange={handleChange}
              fullWidth
              className='myTextField'
              placeholder="e.g., 10.2.0.42"
            />


            
            {/* <FormControlLabel
              control={
                <Checkbox
                  name="createRadiusEntry"
                  checked={formData.createRadiusEntry}
                  onChange={handleChange}
                />
              }
              label="Create Radius entry for PPPoE"
            />
            
            {formData.createRadiusEntry && (
              <TextField
                label="PPPoE Username"
                name="pppoeUsername"
                value={formData.pppoeUsername}
                onChange={handleChange}
                fullWidth
                className='myTextField'

                required={formData.createRadiusEntry}
              />
            )} */}
            
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : null}
              sx={{ mt: 2 }}
            >
              {loading ? 'Generating...' : 'Generate Configuration'}
            </Button>
          </Box>
        </form>
      </Paper>
      
      {error && (
        <Alert severity="error" sx={{ mt: 3 }}>
          {error}
        </Alert>
      )}
      
      {config && (
        <ConfigPaper elevation={3}>
          <Typography variant="h5" gutterBottom>
            Generated Configuration
          </Typography>
          
          <Box sx={{ mb: 3 }}>
            <Typography><strong>Network:</strong> {config.network}</Typography>
            <Typography><strong>Assigned IP:</strong> {config.client_ip}</Typography>
            <Typography><strong>Server IP:</strong> {config.server_ip}</Typography>

          </Box>
          
          <Divider sx={{ my: 2 }} />
          
          <Typography variant="h6" gutterBottom>
            Client Keys:
          </Typography>
          <ConfigBlock>
            <CopyButton 
              size="small" 
              onClick={() => copyToClipboard(config.private_key, 'private')}
            >
              {copied['private'] ? <CheckIcon fontSize="small" /> : <ContentCopyIcon fontSize="small" />}
            </CopyButton>
            <Typography variant="subtitle2">Private Key:</Typography>
            <Typography sx={{ wordBreak: 'break-all' }}>{config.private_key}</Typography>
          </ConfigBlock>
          
          <ConfigBlock>
            <CopyButton 
              size="small" 
              onClick={() => copyToClipboard(config.public_key, 'public')}
            >
              {copied['public'] ? <CheckIcon fontSize="small" /> : <ContentCopyIcon fontSize="small" />}
            </CopyButton>
            <Typography variant="subtitle2">Public Key:</Typography>
            <Typography sx={{ wordBreak: 'break-all' }}>{config.public_key}</Typography>
          </ConfigBlock>
          
          <Divider sx={{ my: 2 }} />
          
          <Typography variant="h6" gutterBottom>
            MikroTik Configuration:
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Copy and paste these commands into your MikroTik terminal:
          </Typography>
          <ConfigBlock>
            <CopyButton 
              size="small" 
              onClick={() => copyToClipboard(config.mikrotik_config, 'mikrotik')}
            >
              {copied['mikrotik'] ? <CheckIcon fontSize="small" /> : <ContentCopyIcon fontSize="small" />}
            </CopyButton>
            <PreformattedText>{config.mikrotik_config}</PreformattedText>
          </ConfigBlock>
          
          <Divider sx={{ my: 2 }} />
{/*           
          <Typography variant="h6" gutterBottom>
            Server Configuration:
          </Typography> */}
          {/* <Typography variant="body2" color="text.secondary" gutterBottom>
            This peer configuration has been automatically added to your WireGuard server.
          </Typography> */}
          {/* <ConfigBlock>
            <CopyButton 
              size="small" 
              onClick={() => copyToClipboard(config.server_config, 'server')}
            >
              {copied['server'] ? <CheckIcon fontSize="small" /> : <ContentCopyIcon fontSize="small" />}
            </CopyButton>
            <PreformattedText>{config.server_config}</PreformattedText>
          </ConfigBlock> */}
        </ConfigPaper>
      )}
    </Box>
    </>
  );
}

export default WireguardConfigForm;