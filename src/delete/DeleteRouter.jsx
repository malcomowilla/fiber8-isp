import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import CloseIcon from '@mui/icons-material/Close';
import Stack from '@mui/material/Stack';


 function DeleteRouter({openDelete, handleCloseDelete, deleteRouter, id}) {
  const [fullWidth, setFullWidth] = React.useState(true);
  const [maxWidth, setMaxWidth] = React.useState('xs');

const handleDelete=()=> {
  deleteRouter(id)
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
         
        <p>Are you sure want to delete this router</p>
        </DialogContent>
        <DialogActions>
        <Stack direction={{ xs: 'column', sm: 'row'}}  spacing={{xs: 1, sm: 2, md: 4}}>

          <Button onClick={handleCloseDelete} color='error'>Cancel</Button>
          <Button onClick={handleDelete} variant='outlined' startIcon={<CloseIcon/>}   color='error'>Delete</Button>
          </Stack>

        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
export default DeleteRouter