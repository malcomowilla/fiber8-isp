import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Box,
  Stack,
  Avatar,
  Typography,
  Paper,
  Button,
  IconButton,
  Divider,
  CircularProgress,
  Chip,
  Slide,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  useTheme,
  useMediaQuery,
  AppBar,
  Toolbar,
  SwipeableDrawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Fab,
  Snackbar,
  Alert
} from '@mui/material';
import {
  Phone as PhoneIcon,
  Description as DescriptionIcon,
  Feedback as FeedbackIcon,
  Note as NoteIcon,
  Close as CloseIcon,
  SupervisorAccount as AgentIcon,
  PriorityHigh as PriorityIcon,
  Category as CategoryIcon,
  Update as UpdateIcon,
  Save as SaveIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
// import { useLayoutSettings } from '../settings/LayoutSettings';
import toast, { Toaster } from 'react-hot-toast';



const TicketForm = ({
  isOpen,
  setIsOpen,
  agentRole,
  ticketForm,
  setTicketForm,
  handleAddTicket,
  loading,
  phone,
  customer_name,
  ticketNo,
  handleChange,
  updatedDate
}) => {
  const [activeNote, setActiveNote] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
//   const { settings, borderRadiusClasses } = useLayoutSettings();



  const {
    priority,
    issue_description,
    agent,
    ticket_category,
    agent_review,
    status
  } = ticketForm;

  const ticketCategory = [
    { title: 'Network issues' },
    { title: 'LOS issues' },
    { title: 'General Enquiry' },
    { title: 'Customer Onboarding' },
    { title: 'Installation' }
  ];

  const ticketPriority = [
    { ticket: 'Low', color: 'success' },
    { ticket: 'Medium', color: 'warning' },
    { ticket: 'Urgent', color: 'error' }
  ];

  const ticketStatus = [
    { ticketStatus: 'Open', color: 'info' },
    { ticketStatus: 'Resolved', color: 'success' },
    { ticketStatus: 'In Progress', color: 'warning' },
    { ticketStatus: 'Pending', color: 'error' }
  ];

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {

      await handleAddTicket(e);
      // setSnackbar({ open: true, message: 'Ticket updated successfully!', severity: 'success' });
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to update ticket', severity: 'error' });
    }
  };

  const handleClose = () => {
    setIsOpen(false);
  };





  const getBorderRadius = () => {
    const radiusMap = {
      'rounded-3xl': '24px',
      'rounded-2xl': '16px',
      'rounded-xl': '12px',
      'rounded-lg': '8px',
      'rounded-md': '6px',
      'rounded-sm': '2px',
      'rounded': '4px',
      'rounded-full': '9999px'
    };
    // return radiusMap[borderRadiusClasses[settings.borderRadius]] || '0px';
  }

  return (

    <>
    <Toaster />
    <Dialog
      fullScreen={fullScreen}
      open={isOpen}
      onClose={handleClose}
      TransitionComponent={Slide}
      TransitionProps={{ direction: 'up' }}
      PaperProps={{
        sx: {
          bgcolor: 'background.default',
          backgroundImage: 'none',
          borderRadius: getBorderRadius(),
        }
      }}
    >
      <AppBar position="sticky" elevation={0} color="primary"
      
      sx={{
        backgroundColor: 'green',
      }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={handleClose}
            aria-label="close"
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
            Ticket #{ticketNo}
          </Typography>
          <Chip 
            label={status} 
            color={ticketStatus.find(s => s.ticketStatus === status)?.color || 'default'}
            size="small"
            sx={{ mr: 2 }}
          />
        </Toolbar>
      </AppBar>

      <Box 
        component="form" 
        onSubmit={handleSubmit}
        sx={{ 
          height: '100%',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <Box sx={{ p: 2, flex: 1, overflow: 'auto' }}>
          <Paper elevation={0} sx={{ p: 2, mb: 2 }}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar 
                sx={{ 
                  width: 56, 
                  height: 56, 
                  bgcolor: 'primary.main',
                  fontSize: '1.5rem'
                }}
              >
                {getInitials(customer_name)}
              </Avatar>
              <Box flex={1}>
                <Typography variant="h6">{customer_name}</Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 1,
                    color: 'text.secondary'
                  }}
                >
                  <PhoneIcon fontSize="small" />
                  {phone}
                </Typography>
              </Box>
            </Stack>
          </Paper>

          <Paper elevation={0} sx={{ p: 2, mb: 2 }}>
            <Typography variant="body1" color="text.secondary" paragraph>
              {issue_description}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Last updated: {updatedDate}
            </Typography>
          </Paper>

          <List sx={{ p: 0 }}>
            <ListItem>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                className='myTextField'
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
                  value={ticket_category}
                  label="Category"
                  name="ticket_category"
                  onChange={handleChange}
                >
                  {ticketCategory.map((category, index) => (
                    <MenuItem key={index} value={category.title}>
                      <ListItemIcon>
                        <CategoryIcon />
                      </ListItemIcon>
                      <ListItemText primary={category.title} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </ListItem>

            <ListItem>
              <FormControl fullWidth>
                <InputLabel>Priority</InputLabel>
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
                  value={priority}
                  label="Priority"
                  name="priority"
                  onChange={handleChange}
                >
                  {ticketPriority.map((p, index) => (
                    <MenuItem key={index} value={p.ticket}>
                      <ListItemIcon>
                        <PriorityIcon color={p.color} />
                      </ListItemIcon>
                      <ListItemText primary={p.ticket} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </ListItem>

            <ListItem>
              <FormControl fullWidth>
                <InputLabel>Assign Agent</InputLabel>
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
                  value={agent}
                  label="Assign Agent"
                  name="agent"
                  onChange={handleChange}
                >
                  {agentRole.filter(Boolean).map((a, index) => (
                    <MenuItem key={index} value={a.name}>
                      <ListItemIcon>
                        <AgentIcon />
                      </ListItemIcon>
                      <ListItemText primary={a.name} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </ListItem>

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

            <ListItem>
              <TextField
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
                fullWidth
                multiline
                rows={3}
                label="Agent Note"
                name="agent_review"
                value={agent_review}
                onChange={handleChange}
                variant="outlined"
              />
            </ListItem>
          </List>
        </Box>

        <Paper 
          elevation={3} 
          sx={{ 
            p: 2, 
            position: 'sticky', 
            bottom: 0,
            borderTop: 1,
            borderColor: 'divider',
            zIndex: 1,
            bgcolor: 'background.paper'
          }}
        >
          <Stack direction="row" spacing={2} justifyContent="space-between"
          
          >
            <Button
              sx={{
                borderRadius: getBorderRadius(),
                backgroundColor: 'green',
                color: 'white',
                '&:hover': {
                  backgroundColor: 'green',
                  
                  
                },
              }}
              variant="outlined"
              startIcon={<NoteIcon />}
              onClick={() => setActiveNote(!activeNote)}
            >
              Add Note
            </Button>
            <Button
            sx={{
              backgroundColor: 'green',
              borderRadius: getBorderRadius(),
              color: 'white',
              '&:hover': {
                backgroundColor: 'green',
              },
            }}
              variant="contained"
              type="submit"
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
            >
              Save Changes
            </Button>
          </Stack>
        </Paper>

        <SwipeableDrawer
          anchor="bottom"
          open={activeNote}
          onClose={() => setActiveNote(false)}
          onOpen={() => setActiveNote(true)}
          disableSwipeToOpen={false}
          PaperProps={{
            sx: {
              height: '50%',
              borderTopLeftRadius: 16,
              borderTopRightRadius: 16
            }
          }}
        >
          <Box sx={{ p: 2 , }}>
            <Typography variant="h6" gutterBottom>
              Add Note
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={4}
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="Type your note here..."
              variant="outlined"
              sx={{ mb: 2 }}
            />
            <Button
            sx={{
              borderRadius: getBorderRadius(),
            }}
              fullWidth
              variant="contained"
              startIcon={<SaveIcon />}
              disabled={!noteText.trim()}
            >
              Save Note
            </Button>
          </Box>
        </SwipeableDrawer>
      </Box>

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
    </Dialog>
    </>
  );
};

export default TicketForm;