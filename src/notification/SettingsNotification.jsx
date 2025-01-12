import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Button } from "@/components/ui/button"
import Stack from '@mui/material/Stack';

export default function AlertDialog({open, handleClose}) {
  const [fullWidth, setFullWidth] = React.useState(true);
  const [maxWidth, setMaxWidth] = React.useState('sm');

  return (
    <React.Fragment>

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
         Settings Sucessfully Applied!
        </Stack>
        </DialogTitle>
       
        <DialogActions>
          <Button onClick={handleClose}>Ok</Button>
       
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}