

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
  Paper,
  Divider,
  Alert,
  CircularProgress,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Card,
  CardContent,
  CardActions
} from '@mui/material';
import { styled } from '@mui/material/styles';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import toast, { Toaster } from 'react-hot-toast';
import { useApplicationSettings } from '../settings/ApplicationSettings';
import { Autocomplete } from '@mui/material';





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

const ConfigBlock = styled('div')(({ theme }) => ({
  position: 'relative',
  padding: theme.spacing(2),
  backgroundColor: theme.palette.grey[100],
  borderRadius: theme.shape.borderRadius,
  marginBottom: theme.spacing(2),
}));

const CopyButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  right: theme.spacing(1),
  top: theme.spacing(1),
}));

const QrCodeContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  padding: theme.spacing(3),
  backgroundColor: 'white',
  borderRadius: theme.shape.borderRadius,
  margin: theme.spacing(2, 0),
}));

const ActionCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  boxShadow: theme.shadows[2],
  transition: 'transform 0.2s, box-shadow 0.2s',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: theme.shadows[4],
  },
}));

function WireguardConfigForm() {
  const [formData, setFormData] = useState({
    networkAddress: '10.2.0.0',
    subnetMask: '24',
    customIp: '',
  });
  const [config, setConfig] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState({});
  const [qrDialogOpen, setQrDialogOpen] = useState(false);
  const [qrCodeData, setQrCodeData] = useState(null);
  const [qrLoading, setQrLoading] = useState(false);
  const [qrFormData, setQrFormData] = useState({
    privateKey: '',
    clientIp: '',
    serverPublicKey: ''
  });

  const { 
    setShowMenu1, setShowMenu2, setShowMenu3, setShowMenu4, 
    setShowMenu5, setShowMenu6, setShowMenu7, setShowMenu8,
    setShowMenu9, setShowMenu10, setShowMenu11, setShowMenu12 
  } = useApplicationSettings();

  const subnetOptions = [
    { value: '24', label: '/24 (254 hosts)' },
    { value: '30', label: '/30 (2 hosts)' },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleQrFormChange = (e) => {
    const { name, value } = e.target;
    setQrFormData(prev => ({ ...prev, [name]: value }));
  };

  const subdomain = window.location.hostname.split('.')[0];

  const handleGenerateConfig = async (e) => {
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
        })
      });
      const newData = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          toast.error(newData.error, { position: "top-center", duration: 4000 });
          setTimeout(() => { window.location.href = '/signin' }, 1900);
        }
        throw new Error(newData.error || 'Failed to generate configuration');
      }

      if (response.status === 402) {
        setTimeout(() => { window.location.href = '/license-expired' }, 1800);
      }

      setConfig(newData);
      toast.success('Configuration generated successfully!');
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateQrCode = async () => {
    setQrLoading(true);
    setQrDialogOpen(true);
    
    try {
      const response = await fetch('/api/wireguard/generate_wireguard_app_config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Subdomain': subdomain,
        },
        body: JSON.stringify({
          client_private_key: qrFormData.privateKey || (config?.private_key || ''),
          client_ip: qrFormData.clientIp || (config?.client_ip || ''),
          server_public_key: qrFormData.serverPublicKey || (config?.public_key || '')
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate QR code');
      }
      
      const qrData = await response.json();
      setQrCodeData(qrData.qr_code_data_url);
      toast.success('QR code generated!');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setQrLoading(false);
    }
  };

  const copyToClipboard = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopied(prev => ({ ...prev, [key]: true }));
    setTimeout(() => setCopied(prev => ({ ...prev, [key]: false })), 2000);
    toast.success('Copied to clipboard!');
  };

  const closeAllMenus = () => {
    [
      setShowMenu1, setShowMenu2, setShowMenu3, setShowMenu4,
      setShowMenu5, setShowMenu6, setShowMenu7, setShowMenu8,
      setShowMenu9, setShowMenu10, setShowMenu11, setShowMenu12
    ].forEach(setter => setter(false));
  };

  return (
    <>
      <Toaster />

        <Typography variant="h4" gutterBottom sx={{


display: 'flex',
justifyContent: 'center',
         }}>
         <p className='bg-gradient-to-r from-green-600 via-blue-400
         to-cyan-500 bg-clip-text text-transparent font-bold '> WireGuard Configuration  </p>
        </Typography>


      <Box onClick={closeAllMenus} sx={{ maxWidth: 1200, mx: 'auto', p: 3 ,

display: 'flex',
justifyContent: 'center',
flexDirection: 'column',

      }}>
      
        <div
       className='flex flex-col gap-4 p-4 max-w-xl mx-auto'
       >
          {/* Configuration Generator */}
          <Grid item xs={12} md={6}>
            <ActionCard>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Generate New Configuration
                </Typography>
                <form onSubmit={handleGenerateConfig}>
                  <Box sx={{ display: 'grid', gap: 2 }}>
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
                      <Autocomplete
                      className='myTextField'
  options={subnetOptions}
  getOptionLabel={(option) => option.label}
  value={subnetOptions.find(option => option.value === formData.subnetMask) || null}
  onChange={(event, newValue) => {
    handleChange({
      target: {
        name: "subnetMask",
        value: newValue ? newValue.value : ""
      }
    });
  }}
  renderInput={(params) => (
    <TextField
      {...params}
      label="Subnet Mask"
      variant="outlined"
      required
    />
  )}
  renderOption={(props, option) => (
    <MenuItem {...props} key={option.value}>
      {option.label}
    </MenuItem>
  )}
  isOptionEqualToValue={(option, value) => option.value === value.value}
/>
                    </FormControl>

                    <TextField
                      label="Custom IP (optional)"
                      name="customIp"
                      className='myTextField'
                      value={formData.customIp}
                      onChange={handleChange}
                      fullWidth
                      placeholder="e.g., 10.2.0.42"
                    />
                  </Box>
                </form>
              </CardContent>
              <CardActions sx={{ justifyContent: 'flex-end', p: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleGenerateConfig}
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={20} /> : null}
                >
                  {loading ? 'Generating...' : 'Generate Config'}
                </Button>
              </CardActions>
            </ActionCard>

            {/* QR Code Generator */}
            <ActionCard>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Generate QR Code
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Create a scannable QR code from existing configuration
                </Typography>
                
                <Box sx={{ display: 'grid', gap: 2 }}>
                  <TextField
                  className='myTextField'
                    label="Private Key (optional)"
                    name="privateKey"
                    value={qrFormData.privateKey}
                    onChange={handleQrFormChange}
                    fullWidth
                    placeholder="Will use generated config if empty"
                  />
                  
                  <TextField
                    label="Client IP (optional)"
                      className='myTextField'
                    name="clientIp"
                    value={qrFormData.clientIp}
                    onChange={handleQrFormChange}
                    fullWidth
                    placeholder="Will use generated config if empty"
                  />
                  
                  <TextField
                    className='myTextField'
                    label="Server Public Key (optional)"
                    name="serverPublicKey"
                    value={qrFormData.serverPublicKey}
                    onChange={handleQrFormChange}
                    fullWidth
                    placeholder="Will use generated config if empty"
                  />
                </Box>
              </CardContent>
              <CardActions sx={{ justifyContent: 'flex-end', p: 2 }}>
                <Button
                  variant="contained"
                  color="secondary"
                  startIcon={<QrCode2Icon />}
                  onClick={handleGenerateQrCode}
                  disabled={qrLoading}
                >
                  {qrLoading ? 'Generating...' : 'Generate QR Code'}
                </Button>
              </CardActions>
            </ActionCard>
          </Grid>

          {/* Results Panel */}
          <Grid item xs={12} md={6}>
            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            {config && (
              <ConfigPaper elevation={0}>
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
                  Client Keys
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
                  MikroTik Configuration
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
              </ConfigPaper>
            )}
          </Grid>
        </div>
      </Box>

      {/* QR Code Dialog */}
      <Dialog open={qrDialogOpen} onClose={() => setQrDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>WireGuard Client QR Code</DialogTitle>
        <DialogContent>
          {qrLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : qrCodeData ? (
            <>
              <Typography variant="body1" gutterBottom>
                Scan this QR code with the WireGuard app to automatically configure your client:
              </Typography>
              <QrCodeContainer>
                <img 
                  src={qrCodeData} 
                  alt="WireGuard QR Code" 
                  style={{ 
                    maxWidth: '100%', 
                    height: 'auto',
                    maxHeight: '400px',
                    objectFit: 'contain'
                  }} 
                />
              </QrCodeContainer>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                If scanning doesn't work, you can manually enter the configuration.
              </Typography>
            </>
          ) : (
            <Alert severity="error">Failed to generate QR code</Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setQrDialogOpen(false)}>Close</Button>
          {qrCodeData && (
            <Button 
              onClick={() => {
                const keyToCopy = qrFormData.privateKey || config?.private_key;
                if (keyToCopy) {
                  copyToClipboard(keyToCopy, 'qr_private_key');
                  toast.success('Private key copied to clipboard');
                }
              }}
              disabled={!(qrFormData.privateKey || config?.private_key)}
            >
              Copy Private Key
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
}

export default WireguardConfigForm;




