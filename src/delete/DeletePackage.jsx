import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Stack from '@mui/material/Stack';

import CloseIcon from '@mui/icons-material/Close';

 function DeletePackage({openDelete, handleCloseDelete, deletePackage, id}) {
  const [fullWidth, setFullWidth] = React.useState(true);
  const [maxWidth, setMaxWidth] = React.useState('xs');

const handleDelete=()=> {
  deletePackage(id)
  handleCloseDelete()
}


  return (
    <React.Fragment>
     
      <Dialog
        fullWidth={fullWidth}
        maxWidth={maxWidth}
        open={openDelete}
        onClose={handleCloseDelete}
      >
        <DialogTitle>Delete Package</DialogTitle>
        <DialogContent>
         
        <p>Are you sure want to delete this package</p>
        </DialogContent>
        <DialogActions>
          <Stack direction={{ xs: 'column', sm: 'row'}}  spacing={{xs: 1, sm: 2, md: 4}}>

          <Button onClick={handleCloseDelete} color='error' variant='outlined'>Cancel</Button>
          <Button onClick={handleDelete} startIcon={<CloseIcon/>} color='error'>Delete</Button>
          </Stack>
       
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
export default DeletePackage