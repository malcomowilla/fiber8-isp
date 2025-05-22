import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { 
  FaHandshake, 
  FaTimes,
  FaCheck
} from 'react-icons/fa';
import { Slide } from '@mui/material';
import { forwardRef } from 'react';
import { toast, Toaster } from 'react-hot-toast';


const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const ConfirmLeadConversion = ({ 
  openConfirmLeadConversion, 
  clientName,
  setOpenConfirmLeadConversion,
  formData,
  deleteLead,
  id
}) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const handleClose = () => {
    setOpenConfirmLeadConversion(false);
  };

  const handleConfirm = () => {
    // Add your conversion logic here
    console.log(`Converting ${clientName} to customer`);
    handleClose();
  };


  const handleDeleteLead = () => {
    deleteLead(id);
  };

const subdomain = window.location.hostname.split('.')[0];

  const createSubscriber = async (e) => {
e.preventDefault()
    try {


      const response = await fetch('/api/subscriber', {
        method: 'POST',
        headers: {
"Content-Type" : "application/json",
        'X-Subdomain': subdomain,
        },
        body: JSON.stringify({
            subscriber: formData
          })
      }
    )


    const newData = await response.json()



    if (response.status === 402) {
      setTimeout(() => {
        // navigate('/license-expired')
        window.location.href='/license-expired';
       }, 1800);
      
    }


if (response.ok) {
 
    setOpenConfirmLeadConversion(false)
// deleteLead(id)

handleDeleteLead() 
  
} else {
    setOpenConfirmLeadConversion(false)
    toast.error('failed to create client', {
          position: "top-center",
          duration: 4000,          
          })
  console.log('failed to fetch')
 

}
    } catch (error) {
        setOpenConfirmLeadConversion(false)
        toast.error('failed to create client server error', {
            position: "top-center",
            duration: 4000,          
            })
      console.log(error)
     
    
    }

  }

  return (

    <>
    <Toaster />
    <Dialog
      open={openConfirmLeadConversion}
      onClose={handleClose}
      TransitionComponent={Transition}
      fullScreen={fullScreen}
      PaperProps={{
        sx: {
          borderRadius: fullScreen ? 0 : 2,
          minWidth: { xs: '100%', sm: '450px' },
          maxWidth: '100%',
          overflow: 'hidden'
        }
      }}
    >
      <DialogTitle sx={{ 
        bgcolor: theme.palette.primary.main, 
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        gap: 2
      }}>
        <FaHandshake size={24} />
        <Typography variant="h6">Convert Lead to Customer</Typography>
      </DialogTitle>

      <DialogContent sx={{ py: 4, px: 3 }}>
        <Box sx={{ 
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          gap: 2
        }}>
          <FaHandshake size={48} color={theme.palette.primary.main} />
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            Confirm Conversion
          </Typography>
          <Typography variant="body1">
            You are about to convert <strong>{clientName}</strong> to become a permanent customer.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            This action cannot be undone. The lead will gain full customer access.
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions sx={{ 
        px: 3, 
        py: 2,
        justifyContent: 'space-between',
        borderTop: `1px solid ${theme.palette.divider}`
      }}>
        <Button
          variant="outlined"
          color="inherit"
          onClick={handleClose}
          startIcon={<FaTimes />}
          sx={{
            color: theme.palette.text.secondary,
            '&:hover': {
              backgroundColor: theme.palette.action.hover
            }
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={createSubscriber}
          startIcon={<FaCheck />}
          sx={{
            minWidth: 120,
            backgroundColor: theme.palette.success.main,
            '&:hover': {
              backgroundColor: theme.palette.success.dark
            }
          }}
        >
          Confirm
        </Button>
      </DialogActions>
    </Dialog>

    </>
  );
};

export default ConfirmLeadConversion;