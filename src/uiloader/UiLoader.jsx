import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Button from '@mui/material/Button';

  function  UiLoader() {
  const [open, setOpen] = React.useState(true);
  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(true);
  };

  return (
    <div>
      {/* <Button onClick={handleOpen} sx={{ color: 'black', }} className='text-black'>Show backdrop</Button> */}
      <Backdrop
        sx={{ color: 'red', zIndex: (theme) => theme.zIndex.drawer + 20 }}
        open={open}
        onClick={handleClose}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );



}



export default UiLoader