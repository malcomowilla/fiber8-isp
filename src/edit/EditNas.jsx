import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import LoadingButton from '@mui/lab/LoadingButton';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import CloseIcon from '@mui/icons-material/Close';
function EditNas ({open, handleClose, handleSubmit, formData, setFormData, isloading}) {
const {name, username, ip_address, password} = formData
  const [fullWidth, setFullWidth] = React.useState(true);
  const [maxWidth, setMaxWidth] = React.useState('lg');



const onChange=(e)=> {
setFormData({...formData, [e.target.id]: e.target.value})
}





  return (
    <React.Fragment>

      <Dialog
        fullWidth={fullWidth}
        maxWidth={maxWidth}
        open={open}
        onClose={handleClose}
      >
        <DialogTitle>DEVICES</DialogTitle>
        <DialogContent>

        <form onSubmit={handleSubmit}>


          <Box
            noValidate
            component="form"
            sx={{
             
              m: 1,
              width: '80ch',
            }}
          >
          <Stack direction='row' spacing={2}  useFlexGap flexWrap="wrap">
            <TextField sx={{
                '& label.Mui-focused': {
                    color: 'black',
                    fontSize: '18px'
                },

                '& .MuiOutlinedInput-root':{
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "black",
                        borderWidth: '3px'
                        },
                }
            }} className='myTextField'  label='Ip Adress' id='ip_address'  value={ip_address} onChange={e=> onChange(e)}>
              
            </TextField>
            <TextField   sx={{
                '& label.Mui-focused': {
                    color: 'black',
                    fontSize: '18px'

                },

                '& .MuiOutlinedInput-root':{
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "black",
                        borderWidth: '3px'
                        },
                }
            }}className='myTextField'  id='name' value={name}  onChange={e => onChange(e)}   label='Name'></TextField>
            <TextField  onChange={e => onChange(e)} sx={{
                '& label.Mui-focused': {
                    color: 'black',
                    fontSize: '18px'

                },

                '& .MuiOutlinedInput-root':{
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "black",
                        borderWidth: '3px'
                        },
                }
            }} className='myTextField' id='password' type='password' value={password} label='Password'></TextField>

          </Stack>
        
          </Box>

                <div className='flex justify-end ' >
                <Box   noValidate
            component="form" sx={{
                          width: '40ch',

          }}>
          <TextField  onChange={e=> onChange(e)} sx={{
                '& label.Mui-focused': {
                    color: 'black',
                    fontSize: '18px'

                },

                '& .MuiOutlinedInput-root':{
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "black",
                        borderWidth: '3px'
                        },
                }
            }}className='myTextField' id='username' value={username} label='Userame'></TextField>


          </Box>

                </div>

        <DialogActions>
        <Button  onClick={handleClose} startIcon={<CloseIcon/>}     variant='outlined' color='error'>Cancel</Button>

            <LoadingButton  type='submit' variant='outlined'  startIcon={<AutorenewIcon/>} loading={isloading} color='success'>Save</LoadingButton>
        </DialogActions>

        </form>
        </DialogContent>

      </Dialog>

    </React.Fragment>
  );
}


export default EditNas
