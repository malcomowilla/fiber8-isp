import * as React from 'react';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import LoadingButton from '@mui/lab/LoadingButton';
import { motion } from 'framer-motion';
import {
  InputAdornment,
  Autocomplete,
  Button
} from '@mui/material';
import AutorenewIcon from '@mui/icons-material/Autorenew';


import { IoGitNetwork } from "react-icons/io5";
import { CiUser } from "react-icons/ci";
import { TbLockPassword } from "react-icons/tb";
import { FaUserEdit, FaMapMarkerAlt } from "react-icons/fa"; 
import { TbWorldLatitude } from "react-icons/tb";
import { TbWorldLongitude } from "react-icons/tb";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import {useState,useMemo, useEffect, useCallback} from 'react'






function EditAccessPoints({ open, handleClose, handleSubmit, 
    nasformData, setnasFormData, isloading, editingRouter }) {
  const { name,  ip, location, latitude, longitude } = nasformData; // Added location and username/password
  const [fullWidth, setFullWidth] = React.useState(true);
  const [maxWidth, setMaxWidth] = React.useState('sm'); // Changed to 'sm' for better readability
  const [nodes, setNodes] = useState([]);

  const onChange = (e) => {
    setnasFormData({ ...nasformData, [e.target.id]: e.target.value });
  };

  const subdomain = window.location.hostname.split('.')[0];




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











  const getNodes = useCallback(async () => {
    try {
      const response = await fetch('/api/nodes', {
        headers: { 'X-Subdomain': subdomain },
      });
      const data = await response.json();
      if (response.ok) {
        setNodes(data);
      }
    } catch (error) {
      console.error('Failed to fetch nodes', error);
    }
  }, [subdomain]);

  useEffect(() => {
    getNodes();
  }, [getNodes]);

  return (
              <ThemeProvider theme={tableTheme}>
    
    <Dialog
      fullWidth={fullWidth}
      maxWidth={maxWidth}
      open={open}
      onClose={handleClose}
      PaperProps={{
        sx: {
          borderRadius: '16px',
          background: 'linear-gradient(145deg, #ffffff, #f8fafc)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          p: 1,
        },
      }}
    >
      <motion.div
      className='font-sans
'
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <DialogTitle sx={{ fontSize: '1.5rem', fontWeight: 600, color: '#1e293b' }}>
          {editingRouter ? <p className='font-sans
'>Edit Access Point</p> : <p className='font-sans
'>Add Access Point</p>}
        </DialogTitle>
      </motion.div>

      <DialogContent>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <Stack spacing={2.5}>
            {/* IP Address */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <TextField
                fullWidth
                id="ip"
                label="IP Address"
                className='myTextField'
                value={ip}
                onChange={onChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <IoGitNetwork className="text-gray-600" />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&.Mui-focused fieldset': {
                      borderColor: '#3b82f6',
                      borderWidth: 2,
                    },
                  },
                }}
              />
            </motion.div>

            {/* Name */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <TextField
                fullWidth
                id="name"
                label="Name"
                className='myTextField'
                value={name}
                onChange={onChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CiUser className="text-gray-600" />
                    </InputAdornment>
                  ),
                }}
              />
            </motion.div>

          

          

            {/* Location Autocomplete with icon */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.35 }}
            >

 <TextField
 sx={{
  width: '100%',
 }}
                    label="Location"
                    id='location'
                value={location}
                onChange={onChange}
                    className='myTextField'
                    InputProps={{
                      startAdornment: (
                        <>
                          <InputAdornment position="start">
                            <FaMapMarkerAlt className="text-gray-600" />
                          </InputAdornment>
                        </>
                      ),
                    }}
                  />



            </motion.div>




 <TextField
                    label="Latitude"
                    id='latitude'
                value={latitude}
                onChange={onChange}
                    className='myTextField'
                    InputProps={{
                      startAdornment: (
                        <>
                          <InputAdornment position="start">
                            <TbWorldLatitude className="text-gray-600" />
                          </InputAdornment>
                        </>
                      ),
                    }}
                  />






 <TextField
                    label="Longitude"
                    id='longitude'
                value={longitude}
                onChange={onChange}
                    className='myTextField'
                    InputProps={{
                      startAdornment: (
                        <>
                          <InputAdornment position="start">
                            <TbWorldLongitude className="text-gray-600" />
                          </InputAdornment>
                        </>
                      ),
                    }}
                  />

          </Stack>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            onClick={handleClose}
            variant="outlined"
            color="error"
            sx={{ borderRadius: '8px', px: 3 }}
          >
            Cancel
          </Button>
        </motion.div>
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <LoadingButton
            type="submit"
            onClick={handleSubmit}
            loading={isloading}
            loadingPosition="start"
            startIcon={<AutorenewIcon />}
            variant="contained"
            color="success"
            sx={{ borderRadius: '8px', px: 4, background: '#22c55e' }}
          >
            {editingRouter ? <p font-sans
>Update</p> : <p className='font-sans
'>Save</p>}
          </LoadingButton>
        </motion.div>
      </DialogActions>
    </Dialog>
         </ThemeProvider>
    
  );
}

export default EditAccessPoints;