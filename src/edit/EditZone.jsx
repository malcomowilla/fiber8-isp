import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import LoadingButton from '@mui/lab/LoadingButton';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import CloseIcon from '@mui/icons-material/Close';
export default function MaxWidthDialog({open, handleClose, renderCode,  handleCreateZone, formData, setFormData, isloading}) {
  const [fullWidth, setFullWidth] = React.useState(true);
  const [maxWidth, setMaxWidth] = React.useState('lg');
  const {name, zone_code} = formData


  const onChange = (e)=> {
    setFormData( {...formData, [e.target.id]:  e.target.value})
      }
    





  return (
    <React.Fragment>
     
      <Dialog
        fullWidth={fullWidth}
        maxWidth={maxWidth}
        open={open}
        onClose={handleClose}
      >
        <DialogTitle>Add Zone</DialogTitle>
        <DialogContent>
<form onSubmit={handleCreateZone}>
        <Stack direction="row" spacing={{ xs: 1, sm: 4 }}  sx={{ marginTop:  4, 
'& label.Mui-focused': {
  color: 'black'
  },
'& .MuiOutlinedInput-root': {
"&.Mui-focused .MuiOutlinedInput-notchedOutline": {
  borderColor: "black",
  borderWidth: '3px',
  },
'&.Mui-focused fieldset':  {
  borderColor: 'black', // Set border color to transparent when focused

}
},}} >

      <TextField  className='myTextField'  label='Name' id='name' value={formData.name}  sx={{ width: '60%' , }} 
       onChange={(e)=> onChange(e) } > </TextField>

       {renderCode &&       <TextField   className='myTextField  uppercase' label='Code' id='zone_code'  onChange={e => onChange(e)}  value={zone_code} > </TextField>
 }
     

        </Stack>
        <TextField    className='myTextField' label='Zone Subdmain' fullWidth sx={{marginTop: 10, 

'& label.Mui-focused': {
  color: 'black'
  },
'& .MuiOutlinedInput-root': {
"&.Mui-focused .MuiOutlinedInput-notchedOutline": {
  borderColor: "black",
  borderWidth: '3px',
  },
'&.Mui-focused fieldset':  {
  borderColor: 'black', // Set border color to transparent when focused

}
},
        }}  > </TextField>
 <DialogActions>

  <Stack  spacing={{ xs: 2, sm: 2 }} direction={{
    xs: 'column',
    sm:'row'
  }} marginTop={2}>
          <Button   color='error' startIcon={<CloseIcon/>} variant='outlined' onClick={handleClose}>Cancel</Button>

          <LoadingButton  type='submit' loading={isloading}  startIcon={<AutorenewIcon/>}  color='success' variant='outlined'>    Save</LoadingButton >
          </Stack>
        </DialogActions>
        </form>

        </DialogContent>
       
      </Dialog>
    </React.Fragment>
  );
}
