import React, { useState, useEffect } from 'react';
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
  Autocomplete,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText
} from '@mui/material';
import { ContentCopy, Check, Close, Add } from '@mui/icons-material';
import {useApplicationSettings} from '../settings/ApplicationSettings'
import { useNavigate } from 'react-router-dom';



const BulkMessage = () => {
  const { locationInput, setLocationInput, allLocations, setAllLocations, } = useApplicationSettings()
    const [subscribers, setSubscribers] = useState([]);
    const [selectedLocations, setSelectedLocations] = useState([]);
   
    const [newLocationDialogOpen, setNewLocationDialogOpen] = useState(false);
    const [pendingLocation, setPendingLocation] = useState('');

    const [strictFilter, setStrictFilter] = useState(false);
    const navigate = useNavigate()


    useEffect(() => {
        const fetchSubscribers = async () => {
          try {
            const res = await fetch('/api/subscribers');
            const data = await res.json();
            setSubscribers(data);
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

    const clientStatus = [
      {label: 'All Clients', value: 'all clients'},
        { label: 'Active', value: 'active' },
        
        { label: 'Expired', value: 'expired' },
        { label: 'Blocked', value: 'blocked' },
        { label: 'Inactive', value: 'inactive' },
    ];


    const handleLocationChange = (event, value) => {
        setSelectedLocations(value);
    };

    const handleLocationInputChange = (event, value) => {
        setLocationInput(value);
    };

    const handleDeleteLocation = (locationToDelete) => () => {
        setSelectedLocations(selectedLocations.filter(location => location !== locationToDelete));
    };

    const handleAddNewLocation = () => {
        if (locationInput && !allLocations.includes(locationInput)) {
            setPendingLocation(locationInput);
            setNewLocationDialogOpen(true);
        }
    };

    const confirmAddNewLocation = () => {
        const newLocation = pendingLocation.trim();
        if (newLocation) {
            // Add to master list
            setAllLocations(prev => [...prev, newLocation]);
            // Add to selected locations
            setSelectedLocations(prev => [...prev, newLocation]);
            // Clear input
            setLocationInput('');
        }
        setNewLocationDialogOpen(false);
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter' && locationInput && !allLocations.includes(locationInput)) {
            event.preventDefault();
            handleAddNewLocation();
        }
    };

    const insertVariable = (variable) => {
        setSmsData(prev => ({
            ...prev,
            message: `${prev.message}${variable} `
        }));
        setCopiedVar(variable);
        setTimeout(() => setCopiedVar(null), 2000);
    };


    const subdomain = window.location.hostname.split('.')[0]

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const dataToSend = {
                ...smsData,
                locations: selectedLocations,
                status: status.value,
                strict_filter: strictFilter
            };
            
            const response = await fetch('/api/send_bulk_sms', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Subdomain': subdomain,
                },
                body: JSON.stringify(dataToSend)
            });
            
            if (!response.ok) {
                throw new Error('Failed to send SMS');
            }
            if (response.ok) {
                 setTimeout(() => {
          navigate('/admin/messages')
        }, 3000)
            }
            setSnackbar({
                open: true,
                message: 'SMS sent successfully!',
                severity: 'success'
            });
            
            setSmsData({
                to: '',
                subject: '',
                message: ''
            });
            setSelectedLocations([]);
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

        const [status, setStatus] = useState(clientStatus[0]);

    function handleChangeStrictFilter() {
      // setLoginWithPasskey(e.target.checked);
      setStrictFilter(!strictFilter);
      
   }

    return (
        <Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
            <Paper elevation={3} sx={{ p: 3 }}>
                <Typography variant="h5" component="h1" gutterBottom sx={{ mb: 3 }}>
                    Send SMS In Bulk
                </Typography>
                
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Autocomplete
                                options={clientStatus}
                                getOptionLabel={(option) => option.label}
                                value={status}
                                onChange={(event, newValue) => setStatus(newValue)}
                                renderInput={(params) => (
                                    <TextField {...params} label="Client Status" required />
                                )}
                            />

                            <Box sx={{ mt: 2 }}>
                                <Autocomplete
                                    multiple
                                    freeSolo
                                    options={allLocations}
                                    value={selectedLocations}
                                    onChange={handleLocationChange}
                                    inputValue={locationInput}
                                    onInputChange={handleLocationInputChange}
                                    renderInput={(params) => (
                                        <TextField 
                                        className='myTextField'
                                            {...params} 
                                            label="Locations" 
                                            placeholder="Type and press enter to add new locations"
                                            onKeyDown={handleKeyDown}
                                        />
                                    )}
                                    renderTags={(value, getTagProps) =>
                                        value.map((option, index) => (
                                            <Chip
                                                key={option}
                                                label={option}
                                                {...getTagProps({ index })}
                                                deleteIcon={<Close />}
                                                onDelete={handleDeleteLocation(option)}
                                            />
                                        ))
                                    }
                                />
                                {locationInput && !allLocations.includes(locationInput) && (
                                    <Button
                                        size="small"
                                        startIcon={<Add />}
                                        onClick={handleAddNewLocation}
                                        sx={{ mt: 1 }}
                                    >
                                        Add "{locationInput}" as new location
                                    </Button>
                                )}
                            </Box>

                            {selectedLocations.length > 0 && (
                                <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                    {selectedLocations.map((location) => (
                                        <Chip
                                            key={location}
                                            label={location}
                                            onDelete={handleDeleteLocation(location)}
                                            deleteIcon={<Close />}
                                            variant="outlined"
                                        />
                                    ))}
                                </Box>
                            )}
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
                                fullWidth
                                label="Message"
                                name="message"
                                className='myTextField'
                                value={smsData.message}
                                onChange={(e) => setSmsData({...smsData, message: e.target.value})}
                                margin="normal"
                                required
                                multiline
                                rows={6}
                                helperText="160 characters = 1 SMS"
                            />
                        </Grid>
                    </Grid>
                    
                    <label
                    
                    className="inline-flex items-center me-5 cursor-pointer">
  <input type="checkbox"  className="sr-only peer" onChange={handleChangeStrictFilter} 
   checked={strictFilter} />
  <div className="relative w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700
   peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800
    peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full
     peer-checked:after:border-white
      after:content-[''] after:absolute after:top-0.5 after:start-[2px]
       after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5
        after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-400
         dark:peer-checked:bg-blue-400"></div>
  <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
    Strict Filter</span>
</label>
<p>
    When strict filter is enabled, a user has to match all the filters applied, if not, a user can have any of them

</p>

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

            <Dialog open={newLocationDialogOpen} onClose={() => setNewLocationDialogOpen(false)}>
                <DialogTitle>Add New Location</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to add "{pendingLocation}" as a new location?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setNewLocationDialogOpen(false)}>Cancel</Button>
                    <Button onClick={confirmAddNewLocation} color="primary" autoFocus>
                        Add Location
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar 
                open={snackbar.open} 
                autoHideDuration={6000} 
                onClose={() => setSnackbar({...snackbar, open: false})}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert 
                    onClose={() => setSnackbar({...snackbar, open: false})} 
                    severity={snackbar.severity}
                    sx={{ width: '100%' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default BulkMessage;