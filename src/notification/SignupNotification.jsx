import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Button } from "@/components/ui/button"

import { useContext} from 'react'
import {ApplicationContext} from '../context/ApplicationContext'


import LockOpenSharpIcon from '@mui/icons-material/LockOpenSharp';

const SignupNotification = ({handleClose, openSignupNotification}) => {
    const [fullWidth, setFullWidth] = React.useState(true);
    const [maxWidth, setMaxWidth] = React.useState('sm');

  return (
    <React.Fragment>
   
    <Dialog
      open={openSignupNotification}
      onClose={handleClose}
      fullWidth={fullWidth}
      maxWidth={maxWidth}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
      <LockOpenSharpIcon/>
      </DialogTitle>
      <DialogContent>
       Your Details Are Saved Securely
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Ok</Button>
     
      </DialogActions>
    </Dialog>
  </React.Fragment>
  )
}

export default SignupNotification