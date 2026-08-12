import React, { useState, useEffect, useMemo } from 'react';
import {
  TextField,
  Button,
  Box,
  IconButton,
  InputAdornment,
  Modal,
  Tooltip,
  Divider,
} from '@mui/material';
import { motion } from 'framer-motion';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import {
  Email,
  Phone,
  Person,
  Business,
  Lock,
  Close,
  PersonAddAlt,
} from '@mui/icons-material';
import RefreshIcon from '@mui/icons-material/Refresh';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function useIsDarkMode() {
  const [isDark, setIsDark] = useState(
    () => typeof document !== 'undefined' && document.documentElement.classList.contains('dark')
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

const AddClient = ({
  open,
  onClose,
  formData,
  handleChange,
  handleInvite,
  fetchingClients,
  setFetchingClients,
  clients,
  setClients,
  errors,
}) => {
  const isDark = useIsDarkMode();

  const modalTheme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: isDark ? 'dark' : 'light',
          success: { main: '#10b981' },
        },
        typography: { fontFamily: 'inherit' },
      }),
    [isDark]
  );

  const subdomain = window.location.hostname.split('.')[0];

  const fetchClients = async () => {
    setFetchingClients(true);
    try {
      const response = await fetch('/api/get_all_clients', {
        method: 'GET',
        headers: { 'X-Subdomain': subdomain },
      });
      if (response.ok) {
        const data = await response.json();
        setClients(data);
      } else {
        toast.error('Failed to fetch clients');
      }
    } catch (error) {
      toast.error('Error loading clients');
    } finally {
      setFetchingClients(false);
    }
  };

  const fieldSx = {
    '& .MuiOutlinedInput-root': { borderRadius: '10px' },
  };

  return (
    <ThemeProvider theme={modalTheme}>
      <Modal open={open} onClose={onClose} aria-labelledby="add-client-modal" className="font-sans">
        <Box className="flex items-center justify-center min-h-screen p-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-lg"
          >
            <Box className="relative rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl p-6 sm:p-7">
              <IconButton
                onClick={onClose}
                className="!absolute !top-4 !right-4 !text-slate-400 dark:!text-slate-500"
                size="small"
              >
                <Close fontSize="small" />
              </IconButton>

              <div className="flex items-center gap-3 mb-1">
                <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0">
                  <PersonAddAlt fontSize="small" />
                </span>
                <div>
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Invite new client</h2>
                  <p className="text-xs text-slate-400 dark:text-slate-500">Creates a login for a new ISP account</p>
                </div>
                <Tooltip title="Refresh client list">
                  <span className="ml-auto">
                    <IconButton onClick={fetchClients} disabled={fetchingClients} size="small">
                      <RefreshIcon
                        fontSize="small"
                        className={`text-slate-400 dark:text-slate-500 ${fetchingClients ? 'animate-spin' : ''}`}
                      />
                    </IconButton>
                  </span>
                </Tooltip>
              </div>

              <Divider className="!my-4 dark:!border-slate-800" />

              <form onSubmit={handleInvite}>
                <div className="flex flex-col gap-4">
                  <TextField
                    label="User name"
                    variant="outlined"
                    name="username"
                    className='myTextField'
                    value={formData.username}
                    onChange={handleChange}
                    error={!!errors.username}
                    helperText={errors.username}
                    fullWidth
                    sx={fieldSx}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Person fontSize="small" color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                  <TextField
                    label="Client email"
                    variant="outlined"
                    className='myTextField'
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    error={!!errors.email}
                    helperText={errors.email}
                    fullWidth
                    sx={fieldSx}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Email fontSize="small" color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                  <TextField
                    label="Phone number"
                    variant="outlined"
                    className='myTextField'
                    name="phone_number"
                    value={formData.phone_number}
                    onChange={handleChange}
                    error={!!errors.phone_number}
                    helperText={errors.phone_number}
                    fullWidth
                    sx={fieldSx}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Phone fontSize="small" color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                  <TextField
                    label="Company name"
                    name="company_name"
                    className='myTextField'
                    value={formData.company_name}
                    onChange={handleChange}
                    error={!!errors.company_name}
                    helperText={errors.company_name}
                    fullWidth
                    sx={fieldSx}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Business fontSize="small" color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                  <TextField
                    label="Client password"
                    name="password"
                    type="password"
                    className='myTextField'
                    value={formData.password}
                    onChange={handleChange}
                    error={!!errors.password}
                    helperText={errors.password}
                    fullWidth
                    sx={fieldSx}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Lock fontSize="small" color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </div>

                <div className="flex gap-3 mt-6">
                  <Button
                    variant="outlined"
                    color="inherit"
                    onClick={onClose}
                    fullWidth
                    sx={{ borderRadius: '10px', textTransform: 'none' }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    color="success"
                    fullWidth
                    sx={{ borderRadius: '10px', textTransform: 'none', fontWeight: 600 }}
                  >
                    Send invitation
                  </Button>
                </div>
              </form>
            </Box>
          </motion.div>
        </Box>
      </Modal>
    </ThemeProvider>
  );
};

export default AddClient;