import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

// import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
// import LoadingButton from '@mui/lab/LoadingButton';
// import AutorenewIcon from '@mui/icons-material/Autorenew';
import CloseIcon from '@mui/icons-material/Close';
export default function MaxWidthDialog({ handleCloseDelete, openDelete, deleteZone, id}) {
  const [fullWidth, setFullWidth] = React.useState(true);
  const [maxWidth, setMaxWidth] = React.useState('lg');




const handleDelete = () =>{
    deleteZone(id)

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
        <DialogTitle sx={{
            fontWeight: 'bold'
        }}>Delete Zone</DialogTitle>
        <DialogContent>
        <p className='font-mono'>Are you sure want to delete this zone?</p>

        <DialogActions>
          <Stack direction={{ xs: 'column', sm: 'row'}}  spacing={{xs: 1, sm: 2, md: 4}}>

          <Button onClick={handleCloseDelete} color='error' >Cancel</Button>
          <Button onClick={handleDelete} startIcon={<CloseIcon/>} color='error' variant='outlined'>Delete</Button>
          </Stack>
       
        </DialogActions>
        </DialogContent>
       
      </Dialog>
    </React.Fragment>
  );
}
