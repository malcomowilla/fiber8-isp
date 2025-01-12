import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Button from '@mui/material/Button';

export default function SimpleBackdrop({handleClose, open}) {
 

  return (
    <div>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={open}
        onClick={handleClose}
      >
                   


        <div className=' flex flex-col gap-y-10'>
            <CircularProgress color="inherit" />
            <p className='flex flex-row gap-x-10 font-mono sm:text-5xl'> Waiting for general 
               <span> <ion-icon name="settings-outline" size='large'></ion-icon></span></p>

          {/* <ion-icon name="settings-outline" size='large'></ion-icon> */}
        </div>
      </Backdrop>
    </div>
  );
}

















