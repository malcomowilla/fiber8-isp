import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Button } from "@/components/ui/button"
import Stack from '@mui/material/Stack';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { useMemo, useEffect, useState } from 'react';





export default function AlertDialog({open, handleClose}) {
  const [fullWidth, setFullWidth] = React.useState(true);
  const [maxWidth, setMaxWidth] = React.useState('sm');






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






// inside PPPOEpackages component:
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
    <React.Fragment>
           <ThemeProvider theme={tableTheme}>


      <Dialog
       fullWidth={fullWidth}
       maxWidth={maxWidth}
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >

<DialogTitle id="alert-dialog-title">
<ion-icon name="settings-outline"></ion-icon>

      </DialogTitle>
        <DialogTitle id="alert-dialog-title">
          <Stack direction='row' gap={2} sx={{display: 'flex', justifyContent: 'center' }}>
         <p className='font-sans'>Settings Sucessfully Applied! </p>
        </Stack>
        </DialogTitle>
       
        <DialogActions>
          <Button onClick={handleClose}><p className='font-sans'>Ok </p></Button>
       
        </DialogActions>
      </Dialog>
      </ThemeProvider>

    </React.Fragment>
  );
}