
import React, { useState} from 'react';
import {
  Dialog,
  DialogContent,
  TextField,
  Box,
  Stack,
  Button,
  IconButton,
  Typography,
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
  Chip,
  Avatar,
  Snackbar,
  Alert,
  InputAdornment
} from '@mui/material';


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
  InputLabel,
  Select,
  MenuItem,
  
  ListItem,
  ListItemText,
  ListItemIcon,
  
} from '@mui/material';







const TicketSubmit = ({
  isOpenTicket,
  isloading,
  setIsOpenTicket,
  customers,
  agentRole,
  handleChange,
  ticketForm,
  setTicketForm,
  handleAddTicket,
  openLoad,
  ticketError,
  seeTicketError,
}) => {
  const [customerType, setCustomerType] = useState('existing');
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const { name, email, phone_number, priority, issue_description, agent, ticket_category,
    status
   } = ticketForm;
//   const { settings, borderRadiusClasses } = useLayoutSettings();

  const ticketCategories = [
    { title: 'Network issues' },
    { title: 'LOS issues' },
    { title: 'Service Issue' },
    { title: 'General Enquiry' },
    { title: 'Customer Onboarding' },
    { title: 'Installation' },
     {title: 'Hardware issues'},
    {title: 'Hotspot issues'}
  ];



  const ticketStatus = [
    { ticketStatus: 'Open', color: 'info' },
    { ticketStatus: 'Resolved', color: 'success' },
    { ticketStatus: 'In Progress', color: 'warning' },
    { ticketStatus: 'Pending', color: 'error' }
  ];

  const ticketPriorities = [
    { title: 'Low', color: 'success' },
    { title: 'Medium', color: 'warning' },
    { title: 'Urgent', color: 'error' }
  ];

  const ticketStatuses = [
    { title: 'Open', color: 'info' },
    { title: 'Resolved', color: 'success' },
    { title: 'In Progress', color: 'warning' },
    { title: 'Pending', color: 'error' }
  ];

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: LoadingAnimation,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   try {
  //     await handleAddTicket(e)
  //     // setSnackbar({ open: true, message: 'Ticket submitted successfully!', severity: 'success' });
  //   } catch (error) {
  //     setSnackbar({ open: true, message: 'Failed to submit ticket', severity: 'error' });
  //   }
  // };


//   const getBorderRadius = () => {
//     const radiusMap = {
//       'rounded-3xl': '24px',
//       'rounded-2xl': '16px',
//       'rounded-xl': '12px',
//       'rounded-lg': '8px',
//       'rounded-md': '6px',
//       'rounded-sm': '2px',
//       'rounded': '4px',
//       'rounded-full': '9999px'
//     };
//     return radiusMap[borderRadiusClasses[settings.borderRadius]] || '0px';
//   };

  return (
    <>
      {isloading && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'rgba(0, 0, 0, 0.7)',
            zIndex: theme.zIndex.modal + 1
          }}
        >
          <Lottie options={defaultOptions} height={200} width={200} />
        </Box>
      )}

      <Dialog
        fullScreen={fullScreen}
        open={isOpenTicket}
        onClose={() => setIsOpenTicket(false)}
        TransitionComponent={Slide}
        TransitionProps={{ direction: 'up' }}
        PaperProps={{
          sx: {
            backgroundColor: 'background.default',
            backgroundImage: 'none',
            // borderRadius: getBorderRadius(),
            overflow: 'hidden'
          }
        }}
      >
        <AppBar position="sticky" elevation={0} sx={{
          backgroundColor: 'green',
        //   borderTopLeftRadius: getBorderRadius(),
        //   borderTopRightRadius: getBorderRadius(),
        }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={() => setIsOpenTicket(false)}
              aria-label="close"
            >
              <ArrowBackIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6"
            >
              New Ticket
            </Typography>
            <Chip
              label="Draft"
              color="default"
              size="small"
              sx={{ mr: 1 }}
            />
          </Toolbar>
        </AppBar>

        <Box
          component="form"
          onSubmit={handleAddTicket}
          sx={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <DialogContent sx={{ p: 2, flex: 1, overflow: 'auto' }}>
            <Paper elevation={0} sx={{ 
              p: 2, 
              mb: 2,
            //   borderRadius: settings.borderRadius === 'rounded' ? '12px' : '4px'
            }}>
              <FormControl component="fieldset">
                <Typography variant="subtitle1" gutterBottom>
                  Customer Type
                </Typography>
                <RadioGroup
                  row
                  value={customerType}
                  onChange={(e) => setCustomerType(e.target.value)}
                >
                  <FormControlLabel
                    value="new"
                    control={<Radio color="primary" />}
                    label="New Customer"
                  />
                  <FormControlLabel
                    value="existing"
                    control={<Radio color="primary" />}
                    label="Existing Customer"
                  />
                </RadioGroup>
              </FormControl>
            </Paper>

            {customerType === 'new' && (
              <Paper elevation={0} sx={{ 
                p: 2, 
                mb: 2,
                // borderRadius: settings.borderRadius === 'rounded' ? '12px' : '4px'
              }}>
                <Stack spacing={2} 
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
                }}>
                  <TextField
                    fullWidth
                    label="Name"
                    name="name"
                    value={name}
                    onChange={handleChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    value={email}
                    onChange={handleChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                  <TextField
                    fullWidth
                    label="Phone Number"
                    name="phone_number"
                    value={phone_number}
                    onChange={handleChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PhoneIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Stack>
              </Paper>
            )}

            {customerType === 'existing' && (
              <Paper elevation={0} sx={{ 
                p: 2, 
                mb: 2,
                // borderRadius: settings.borderRadius === 'rounded' ? '12px' : '4px'
              }}>







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
                          <Typography variant="subtitle2">{option.name}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {option.customer_code}
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


                  onChange={(event, newValue) => {
                    setTicketForm((prev) => ({
                      ...prev,
                      customer: newValue?.name || ''
                    }));
                  }}
                />






              </Paper>
            )}







            <Paper elevation={0} sx={{ 
              p: 2, 
              mb: 2,
            //   borderRadius: settings.borderRadius === 'rounded' ? '12px' : '4px'
            }}>
              <Stack spacing={2} 
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
              }}>













                <Autocomplete
                  options={ticketCategories}
                  getOptionLabel={(option) => option.title}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Ticket Category"
                      InputProps={{
                        ...params.InputProps,
                        startAdornment: (
                          <InputAdornment position="start">
                            <CategoryIcon />
                          </InputAdornment>
                        ),
                      }}
                    />
                  )}
                  onChange={(event, newValue) => {
                    setTicketForm((prev) => ({
                      ...prev,
                      ticket_category: newValue?.title || ''
                    }));
                  }}
                />





                <Autocomplete
                  options={ticketPriorities}
                  getOptionLabel={(option) => option.title}
                  renderOption={(props, option) => (
                    <Box component="li" {...props}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <PriorityIcon color={option.color} />
                        <Typography>{option.title}</Typography>
                      </Stack>
                    </Box>
                  )}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Priority"
                      InputProps={{
                        ...params.InputProps,
                        startAdornment: (
                          <InputAdornment position="start">
                            <PriorityIcon />
                          </InputAdornment>
                        ),
                      }}
                    />
                  )}
                  onChange={(event, newValue) => {
                    setTicketForm((prev) => ({
                      ...prev,
                      priority: newValue?.title || ''
                    }));
                  }}
                />







                <Autocomplete
                  options={agentRole.filter(Boolean)}
                  getOptionLabel={(option) => option.name}
                  renderOption={(props, option) => (
                    <Box component="li" {...props}>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Avatar sx={{ bgcolor: 'primary.main' }}>
                          {option.name.charAt(0)}
                        </Avatar>
                        <Typography>{option.name}</Typography>
                      </Stack>
                    </Box>
                  )}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Assign Agent"
                      InputProps={{
                        ...params.InputProps,
                        startAdornment: (
                          <InputAdornment position="start">
                            <AgentIcon />
                          </InputAdornment>
                        ),
                      }}
                    />
                  )}
                  onChange={(event, newValue) => {
                    setTicketForm((prev) => ({
                      ...prev,
                      agent: newValue?.name || ''
                    }));
                  }}
                />

                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Issue Description"
                  name="issue_description"
                  value={issue_description}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <DescriptionIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Stack>
            </Paper>
          </DialogContent>


{seeTicketError ? (
<div className="flex items-center p-2  text-sm text-red-800 border border-red-300 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400 dark:border-red-800" role="alert">
  <svg className="shrink-0 inline w-4 h-4 me-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
    <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
  </svg>
  <div>
    <span className="font-medium">Danger alert!</span> {ticketError || 'Something went wrong, please try again'}
  </div>
</div>
): null}
          <ListItem>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                 sx={{
                  width: '100%',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'black',
                    transition: 'border-color 0.2s ease-in-out'
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'black !important',
                    borderWidth: '2px'
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'black !important',
                    borderWidth: '2px'
                  },
                  '& .MuiSelect-icon': {
                    color: 'green'
                  },
                  '& .MuiInputBase-input': {
                    color: '#333'
                  }
                }}
                MenuProps={{
                  PaperProps: {
                    sx: {
                      '& .MuiMenuItem-root': {
                        '&:hover': {
                          backgroundColor: 'rgba(0, 128, 0, 0.08)'
                        },
                        '&.Mui-selected': {
                          backgroundColor: 'rgba(0, 128, 0, 0.16)',
                          '&:hover': {
                            backgroundColor: 'rgba(0, 128, 0, 0.24)'
                          }
                        }
                      }
                    }
                  }
                }}


                className='myTextField'
                  value={status}
                  label="Status"
                  name="status"
                  onChange={handleChange}
                >
                  {ticketStatus.map((s, index) => (
                    <MenuItem key={index} value={s.ticketStatus}>
                      <ListItemIcon>
                        <UpdateIcon color={s.color} />
                      </ListItemIcon>
                      <ListItemText 
                        primary={s.ticketStatus}
                        secondary={
                          <Chip 
                            size="small" 
                            label={s.ticketStatus}
                            color={s.color}
                          />
                        }
                      />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </ListItem>



          <Paper
            elevation={3}
            sx={{
              p: 2,
              borderTop: 1,
              borderColor: 'divider',
              position: 'sticky',
              bottom: 0,
              zIndex: 1,
              bgcolor: 'background.paper',
            //   borderBottomLeftRadius: settings.borderRadius === 'rounded' ? '16px' : '4px',
            //   borderBottomRightRadius: settings.borderRadius === 'rounded' ? '16px' : '4px',
            }}
          >
            <Stack direction="row" spacing={2}
             justifyContent="space-between">
              <Button
                sx={{
                //  borderRadius: getBorderRadius(),
                  backgroundColor: 'red',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'red',
                  },
                }}
                variant="outlined"
                onClick={() => setIsOpenTicket(false)}
                startIcon={<CloseIcon />}
              >
                Cancel
              </Button>
              <Button
              sx={{
            //    borderRadius: getBorderRadius(),
                backgroundColor: 'green',
                color: 'white',
                '&:hover': {
                  backgroundColor: 'green',
                },
              }}
                variant="contained"
                type="submit"
                disabled={isloading}
                startIcon={isloading ? <CircularProgress size={20} /> : <SaveIcon />}
              >
                Submit Ticket
              </Button>
            </Stack>
          </Paper>
        </Box>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default TicketSubmit;
