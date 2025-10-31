import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';



import Lottie from 'react-lottie';
import animationData from '../lotties/loading_gray.json';


  function  UiLoader() {
  const [open, setOpen] = React.useState(true);
  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(true);
  };


 const defaultOptions = {
      loop: true,
      autoplay: true,
      animationData: animationData,
      rendererSettings: {
        preserveAspectRatio: "xMidYMid slice"
      }
    };
  return (
    <div>
      <Backdrop
        sx={{ color: 'red', zIndex: (theme) => theme.zIndex.drawer + 20 }}
        open={open}
        onClick={handleClose}
      >
         <Lottie 
          options={defaultOptions}
          height={200}
          width={200}
        />

        
      </Backdrop>
    </div>
  );



}



export default UiLoader