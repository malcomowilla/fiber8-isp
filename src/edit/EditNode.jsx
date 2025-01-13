import * as React from 'react';
// import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
// import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
// import FormControl from '@mui/material/FormControl';
// import FormControlLabel from '@mui/material/FormControlLabel';
// import InputLabel from '@mui/material/InputLabel';
// import MenuItem from '@mui/material/MenuItem';
// import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Autocomplete from '@mui/material/Autocomplete';


export default function MaxWidthDialog  ({open, handleClose})  {
    const [maxWidth, setMaxWidth] = React.useState('lg');

    const [fullWidth, setFullWidth] = React.useState(true);

    const top100Films = [
        { label: 'Fiber',},
        { label: 'Wireless',  },
        { label: 'MDU' },
     
    ]
  
  
  return (
    <React.Fragment>
 
    <Dialog
            fullWidth={fullWidth}

      maxWidth={maxWidth}
      open={open}
      onClose={handleClose}
    >
      <DialogTitle>Node Details</DialogTitle>
      <DialogContent>

        <form action="">

           



                <Stack  className='myTextField'   spacing={{
                    xs: 1,
                    sm: 2,
                    md: 3,
                    lg: 4,
                    xl: 5,

                }}  sx={{
                    display:'flex',
                    marginTop: 3,

'& label.Mui-focused': {
    color: 'black',
    fontSize: '17px'
  
    },
  '& .MuiOutlinedInput-root': {
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: "black",
    borderWidth: '3px'
    },
  '&.Mui-focused fieldset':  {
    borderColor: 'black', 
    
  
  }
  },
                }}  direction={{
                    xs: 'column',
                    lg:'row',
                    xl: 'row',
                    sm:'row'
                }}>

                    <TextField  sx={{
                        width: {
                            sm: '50%',
                            lg: '50%',
                            xl: '40%',
                            md: '45%'
                        }
                    }} label='Name'/>
                    <TextField  label='Code'/>
                  
<Autocomplete
      id="combo-box-demo"
      options={top100Films}
      sx={{  width: {
        sm: '50%',
        lg: '50%',
        xl: '40%',
        md: '45%'
    } }}
      renderInput={(params) => <TextField {...params} label="Type" />}
    />

                </Stack>

                


                    <Stack direction='column'>

                    </Stack>




            <Stack className='myTextField'  sx={{
marginTop: 2,
'& label.Mui-focused': {
    color: 'black',
    fontSize: '17px'
  
    },
  '& .MuiOutlinedInput-root': {
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: "black",
    borderWidth: '3px'
    },
  '&.Mui-focused fieldset':  {
    borderColor: 'black', 
    
  
  }
  },
}}   spacing={{
lg: 4,
xl: 4,
sm: 4,
md: 4,
xs: 2
}} direction={{
xs: 'column',
sm: 'row',
md: 'row',
lg: 'row',
xl: 'row'
}}>


<Autocomplete
      id="combo-box-demo"
      options={top100Films}
      sx={{  width: {
        sm: '50%',
        lg: '50%',
        xl: '40%',
        md: '45%'
    } }}
      renderInput={(params) => <TextField {...params} label="Parent Node Conects To" />}
    />




<Autocomplete
      id="combo-box-demo"
      options={top100Films}
      sx={{  width: {
        sm: '50%',
        lg: '50%',
        xl: '40%',
        md: '45%'
    } }}
      renderInput={(params) => <TextField {...params} label="Subnet" />}
    />
            </Stack>





            <Stack   className='myTextField'  sx={{
marginTop: 2,
'& label.Mui-focused': {
    color: 'black',
    fontSize: '17px'
  
    },
  '& .MuiOutlinedInput-root': {
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: "black",
    borderWidth: '3px'
    },
  '&.Mui-focused fieldset':  {
    borderColor: 'black', 
    
  
  }
  },
}}   spacing={{
lg: 4,
xl: 4,
sm: 4,
md: 4,
xs: 2
}} direction={{
xs: 'column',
sm: 'row',
md: 'row',
lg: 'row',
xl: 'row'
}} >


<Autocomplete
      id="combo-box-demo"
      options={top100Films}
      sx={{  width: {
        sm: '50%',
        lg: '50%',
        xl: '40%',
        md: '45%'
    } }}
      renderInput={(params) => <TextField {...params} label="Zones" />}
    />



<Autocomplete
      id="combo-box-demo"
      options={top100Films}
      sx={{  width: {
        sm: '50%',
        lg: '50%',
        xl: '40%',
        md: '45%'
    } }}
      renderInput={(params) => <TextField {...params} label="Subnet" />}
    />
            </Stack>

                        <div className='flex justify-center mt-12'>

                        <div className='dark:bg-gray-500 bg-gray-800 dark:text-white
                          text-white flex justify-center items-center gap-x-4  w-[200px] h-10'>
        <p className='text-lg'>Get Location</p>

        <ion-icon name="location-outline"></ion-icon>
        </div>
                        </div>
      


            <Stack    sx={{
                
marginTop: 14,

'& label.Mui-focused': {
    color: 'black',
    fontSize: '17px'
  
    },
  '& .MuiOutlinedInput-root': {
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: "black",
    borderWidth: '3px'
    },
  '&.Mui-focused fieldset':  {
    borderColor: 'black', 
    
  
  }
  },
}}   spacing={{
lg: 4,
xl: 4,
sm: 4,
md: 4,
xs: 2
}} direction={{
xs: 'column',
sm: 'row',
md: 'row',
lg: 'row',
xl: 'row'
}}  className='myTextField'>

                <TextField    sx={{
                    width:{
                        sm: '100%'
                },
                }}  label='Latitude'/>
                <TextField  sx={{
                    width:{
                        sm: '100%'
                },
                }}  label='Longitude'/>

            </Stack>



<TextField label='Description Of Location'   className='myTextField' sx={{
    marginTop: 5,
"& .MuiInputBase-root": {
height: 400
},
'& label.Mui-focused': {
    color: 'black',
    fontSize: '16px'
  
    },
  '& .MuiOutlinedInput-root': {
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: "black",
    borderWidth: '3px'
    },
  '&.Mui-focused fieldset':  {
    borderColor: 'black', 
    
  
  }
  },
}} fullWidth/>








                <Stack  className='myTextField' sx={{
                                    marginTop: 4,
                                      '& label.Mui-focused': {
                                          color: 'black',
                                          fontSize: '17px'
                                        
                                          },
                                        '& .MuiOutlinedInput-root': {
                                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                          borderColor: "black",
                                          borderWidth: '3px'
                                          },
                                        '&.Mui-focused fieldset':  {
                                          borderColor: 'black', 
                                          
                                        
                                        }
                                        },
                }}   spacing={{
                lg: 4,
                xl: 4,
                sm: 4,
                md: 4,
                xs: 2
            }} direction={{
                xs: 'column',
                sm: 'row',
                md: 'row',
                lg: 'row',
                xl: 'row'
            }}>
                        <DialogActions>

                <Button variant='outlined' color='success'>Save</Button>
            <Button onClick={handleClose} variant='outlined' color='error'>Close</Button>
            </DialogActions>

            </Stack>
        </form>
    
        
      </DialogContent>
     
    </Dialog>
  </React.Fragment>
  )
}

