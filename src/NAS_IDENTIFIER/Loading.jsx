import * as React from 'react';
import Box from '@mui/material/Box';

import Modal from '@mui/material/Modal';


import Lottie from 'react-lottie';
import animationData from '../lotties/loading_gray.json';


const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  borderRadius: '30px',
  boxShadow: 24,
  p: 4,
  
};




const Loading = ({setOpenLoading, openLoading,
    handleClose
}) => {
  


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

 <Modal
        open={openLoading}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >

        <Box sx={style}>
        <Lottie 
          options={defaultOptions}
          height={200}
          width={200}
        />
        </Box>
      </Modal>




    </div>
  )
}

export default Loading