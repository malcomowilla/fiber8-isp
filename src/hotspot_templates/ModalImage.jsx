

import Modal from '@mui/material/Modal';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Fade from '@mui/material/Fade';

import { motion, AnimatePresence } from 'framer-motion';
import CircularProgress from '@mui/material/CircularProgress';
import { useState, useEffect } from 'react';



const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 'auto', // Changed from fixed 400px
  maxWidth: '90vw', // Prevent touching screen edges
  maxHeight: '90vh', // Prevent vertical overflow
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
};
const ModalImage = ({ isModalOpen, setIsModalOpen, previewImage, title }) => {


    const [isLoading, setIsLoading] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    if (!isModalOpen) {
      // Reset states when modal closes
      setIsLoading(true);
      setImageLoaded(false);
    } else {
      // Start loading when modal opens
      setIsLoading(true);
    }
  }, [isModalOpen]);

  const handleImageLoad = () => {
    setImageLoaded(true);
    setIsLoading(false);
  };

  return (
   
     <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        closeAfterTransition
          BackdropProps={{
    invisible: true
  }}
        // slots={{ backdrop: Backdrop }}
      slotProps={{
    backdrop: {
      timeout: 500,
      style: {
        backgroundColor: 'rgba(0,0,0,0.2)' // Lighter black
      }
    }
  }}
      >
          <Box sx={style}>
          <motion.div
          className="bg-white p-6 rounded-lg shadow-lg relative flex flex-col"
          style={{ height: '100%' }}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.3, opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Modal Header */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl text-gray-800">{title} Preview</h2>
            <button
              onClick={() => setIsModalOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Modal Content - Scrollable Image Container */}
          <div className="flex-1 overflow-auto rounded-lg bg-gray-100 p-4 flex items-center justify-center">
            <img
              src={previewImage}
              alt="Preview"
              className="max-w-full max-h-[65vh] object-scale-down"
              style={{ width: 'auto', height: 'auto' }}
            />
          </div>

          {/* Modal Footer */}
          <div className="mt-6 flex justify-end">
            <button
              onClick={() => setIsModalOpen(false)}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-300"
            >
              Close
            </button>
          </div>
        </motion.div>
            </Box>
                </Modal>


  );
};

export default ModalImage;