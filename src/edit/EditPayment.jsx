import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { makeStyles } from "@material-ui/core/styles";
import AutorenewIcon from '@mui/icons-material/Autorenew';
import LoadingButton from '@mui/lab/LoadingButton';
import CloseIcon from '@mui/icons-material/Close';


const useStyles = makeStyles({
  root: {
   
    
   
    
  }
 
});
export default function MaxWidthDialog({open,handleClose}) {
  const classes = useStyles();

  const [fullWidth, setFullWidth] = React.useState(true);
  const [maxWidth, setMaxWidth] = React.useState('lg');

  


  return (
    <React.Fragment>
     
      <Dialog
        fullWidth={fullWidth}
        maxWidth={maxWidth}
        open={open}
        onClose={handleClose}
      >
        <DialogTitle>Mpesa Payments</DialogTitle>
        <DialogContent>
       <div className='flex justify-center '>
       <Box
            noValidate
            component="form"
            sx={{
              '& .MuiTextField-root': { m: 1, width: '35ch'  },

            
            }}
          >
            <TextField     className='myTextField'
 sx={{

  '& label.Mui-focused': {
    color: 'black'
    },
'& .MuiOutlinedInput-root': {
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: "black",
    borderWidth: '3px'
    },
 '&.Mui-focused fieldset':  {
    borderColor: 'black', // Set border color to transparent when focused

  }
},
           
          }}   id="Name" label="Name" variant="outlined"  ></TextField>
            <TextField      className='myTextField'
 sx={{

  '& label.Mui-focused': {
    color: 'black'
    },
'& .MuiOutlinedInput-root': {
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: "black",
    borderWidth: '3px'
    },
 '&.Mui-focused fieldset':  {
    borderColor: 'black', // Set border color to transparent when focused

  }
},
           
          }}   id="Mpesa Confirmation Code" label="Mpesa Confirmation Code" variant="outlined" ></TextField>
            <TextField     className='myTextField'
 sx={{

  '& label.Mui-focused': {
    color: 'black'
    },

'& .MuiOutlinedInput-root': {
  
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: "black",
    borderWidth: '3px'
    },
 '&.Mui-focused fieldset':  {
    borderColor: 'black', // Set border color to transparent when focused

  }
},
           
          }}   id="Amount" label="Amount" variant="outlined" ></TextField>

          </Box>
       </div>


              <div className='flex justify-center'>
              <Box  noValidate
             
            component="form"
            sx={{
              '& .MuiTextField-root': { m: 1, width: '35ch'  },
            
            }}>
                            <TextField  sx={{

'& label.Mui-focused': {
  color: 'black'
  },
'& .MuiOutlinedInput-root': {
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: "black",
    borderWidth: '3px'
    },
 '&.Mui-focused fieldset':  {
    borderColor: 'black', // Set border color to transparent when focused

  }
},
           
          }}     id="ShortCode/Paybill No" label="ShortCode/Paybill No" variant="outlined"     className='myTextField'
          ></TextField>
                            <TextField      className='myTextField'
 sx={{

  '& label.Mui-focused': {
    color: 'black'
    },
'& .MuiOutlinedInput-root': {
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: "black",
    borderWidth: '3px'
    },
 '&.Mui-focused fieldset':  {
    borderColor: 'black', // Set border color to transparent when focused

  }
},
           
          }}    id="Account No" label="Account No" variant="outlined"  ></TextField>
                            <TextField     sx={{

'& label.Mui-focused': {
  color: 'black'
  },
'& .MuiOutlinedInput-root': {
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: "black",
    borderWidth: '3px'
    },
 '&.Mui-focused fieldset':  {
    borderColor: 'black', // Set border color to transparent when focused

  }
},
           
          }} 
          
          
 id="Phone" label="Phone" variant="outlined"     className='myTextField'
 ></TextField>

              </Box>

              </div>

              <div className='flex justify-center gap-x-[90px] mt-2'> 

              <div className=''>
              <DemoContainer   components={['DatePicker']}   sx={{

'& label.Mui-focused': {
  color: 'black'
  },
'& .MuiOutlinedInput-root': {
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: "black",
    borderWidth: '3px'
    },
 '&.Mui-focused fieldset':  {
    borderColor: 'black', // Set border color to transparent when focused

  }
},
           
          }}  >
        <DatePicker      className='myTextField'
 renderInput={(props)=> <TextField  {...props}/>}  label="Claimed On" />
      </DemoContainer>
              </div>
            
      <TextField   id="Claimed By"            
label="Claimed By" variant="outlined" 
// className={classes.root} 
    className='myTextField'
 sx={{

'& label.Mui-focused': {
color: 'black'
},
  '& .MuiOutlinedInput-root': {
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
       borderColor: "black",
       borderWidth: '3px'
       },
    
   '&.Mui-focused fieldset':  {
      borderColor: 'black', // Set border color to transparent when focused

    }


  },
             
            }}                  
            />

              </div>
         
        </DialogContent>
        <DialogActions>
          <LoadingButton startIcon={<AutorenewIcon/>} loading={false}  variant='outlined' color='success'> Save </LoadingButton>

          <Button variant='outlined' startIcon={<CloseIcon/>} color='error' onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
