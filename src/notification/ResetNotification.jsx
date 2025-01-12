import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { Button } from "@/components/ui/button"

export default function ResponsiveDialog({open, handleClose, message, error}) {
    const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

 

  return (
    <React.Fragment>
    
      <Dialog
      sx={{
        padding: 9,
        height: {
          xs: '30vh'
        }





      }}
        fullScreen={fullScreen}
        open={open}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title" sx={{
            display: 'flex',
            justifyContent: 'center'
        }}>
        <img src="/images/icons8-password-50 (1).png" alt="" />
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
                   <p className="dark:text-white font-mono text-lg">{message}</p>
                           <p className="text-red-600 font-mono text-lg">{error}</p>

          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose}>
            Sawa
          </Button>
         
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
