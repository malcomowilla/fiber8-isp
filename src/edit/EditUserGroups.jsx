import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import TextField from '@mui/material/TextField';
import { motion, } from 'framer-motion';
import {
  InputAdornment,
 
} from '@mui/material';

import { CiUser } from "react-icons/ci";

import { ThemeProvider, createTheme } from '@mui/material/styles';
import { useMemo, useState, useEffect } from 'react';








const EditUserGroups = ({
    open, handleClose,userGroups, handleChangeUserGroups,
    createUserGroups, setUserGroups, name, editUserGroup,loading
}) => {


    const [fullWidth, setFullWidth] = React.useState(true);
    const [maxWidth, setMaxWidth] = React.useState("lg");






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
    

  return (
    <ThemeProvider theme={tableTheme}>
    
    <Dialog fullWidth={fullWidth} maxWidth={maxWidth} open={open} onClose={handleClose}>
        <form onSubmit={createUserGroups}>
  <DialogContent>
    <Box sx={{ minHeight: '100px', display: 'flex', flexDirection: 'column' }}>
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <TextField
          sx={{
            '& label.Mui-focused': {
              color: '#333',
              fontSize: '16px',
            },
            '& .MuiOutlinedInput-root': {
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: '#333',
                borderWidth: '2px',
              },
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <CiUser className="text-black dark:text-black" />
              </InputAdornment>
            ),
          }}
          className="myTextField"
          id="name"
          value={name.name}
          onChange={handleChangeUserGroups}
          label={<p className="dark:text-white font-sans
 text-black">Name</p>}
          fullWidth
        />
      </motion.div>
    </Box>
  </DialogContent>
  <DialogActions>
    <Button onClick={handleClose}  color="error">Cancel</Button>
    <Button  type='submit' variant="contained" color="success">
      {editUserGroup ? loading ?  <p className='font-sans
'>Updating...</p> : <p className='font-sans
'>Update</p> : loading ? <p className='font-sans
'>Saving...</p> : <p className='font-sans
'>Save</p>}
    </Button>
  </DialogActions>
  </form>
</Dialog>
</ThemeProvider >
  )
}

export default EditUserGroups