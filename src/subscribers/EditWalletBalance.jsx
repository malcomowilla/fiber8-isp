
import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import CloseIcon from '@mui/icons-material/Close';
// import Stack from '@mui/material/Stack';
import { forwardRef, useCallback, useEffect, useState } from 'react';
import {
    TextField, 

  Slide,
  useTheme,
  useMediaQuery,
  Paper,
  CircularProgress,
  IconButton,
  Typography,
  Box,
} from '@mui/material';

import {
  DeleteOutline as DeleteIcon,
  Warning as WarningIcon
} from '@mui/icons-material';
import { IoWalletOutline } from "react-icons/io5";
import {useSearchParams} from 'react-router-dom';
import toast,{ Toaster } from 'react-hot-toast';
import {useApplicationSettings} from '../settings/ApplicationSettings'





const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});


 function EditWalletBalance({openWalletBalance, handleCloseWalletBalance, loading}) {
  const [fullWidth, setFullWidth] = React.useState(true);
  const [maxWidth, setMaxWidth] = React.useState('xs');
const [walletBalance, setWalletBalance] = useState(0)

const theme = useTheme();
const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [searchParams] = useSearchParams();

  const subscriberId = searchParams.get('id')

const subdomain = window.location.hostname.split('.')[0];





const getSubscriberWalletBlance = useCallback(
  async() => {
    try {
      const response = await fetch(`/api/subscriber_wallet_balances?subscriber_id=${subscriberId}`, {
        method: 'GET',
        headers: {
          'X-Subdomain': subdomain,
          
        },

      })
      const newData = await response.json()
      if (response.ok) {
        setWalletBalance(newData[0].amount)
      }
    } catch (error) {
      
    }
  },
  [],
)


useEffect(() => {
  
    getSubscriberWalletBlance()
}, [getSubscriberWalletBlance]);







const handleCreateWalletBalance = async(e)  => {
  e.preventDefault()
  try {
    const response = await fetch(`/api/subscriber_wallet_balances?subscriber_id=${subscriberId} &amount=${walletBalance}`, {
      method: 'POST',
      headers: {
        'X-Subdomain': subdomain,
      },
      body: JSON.stringify({
        amount: walletBalance,
        })
    })

    const newData = await response.json()
    if (response.ok) {
      toast.success('Wallet balance created successfully', {
        position: "top-center",
        duration: 4000,
      })
      handleCloseWalletBalance()
      setWalletBalance(newData.amount)
      
    } else {
      toast.error('Failed to create wallet balance', {
        position: "top-center",
        duration: 4000,
      })
      
    }
  } catch (error) {
    toast.error('Failed to create wallet balance', {
      position: "top-center",
      duration: 4000,
    })
    
  }
}

  return (
    <React.Fragment>
      <Toaster />
<Dialog
        fullScreen={fullScreen}
        open={openWalletBalance}
        onClose={handleCloseWalletBalance}
        TransitionComponent={Transition}
        PaperProps={{
          elevation: 0,
          sx: {
            borderRadius: fullScreen ? 0 : 3,
            minWidth: { xs: '100%', sm: '400px' },
            maxWidth: '100%',
            m: fullScreen ? 0 : 2,
            position: 'relative',
            overflow: 'hidden'
          }
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: -64,
            left: -64,
            right: 0,
            bottom: 0,
            bgcolor: 'green',
            transform: 'rotate(-12deg) scale(1.5)',
            transformOrigin: '0 100%',
            zIndex: 0
          }}
        />
        
        <DialogTitle
          sx={{
            position: 'relative',
            zIndex: 1,
            color: 'white',
            pt: 3,
            pb: 4,
            textAlign: 'center'
          }}
        >
          <IconButton
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: 'white'
            }}
            onClick={handleCloseWalletBalance}
          >
            <CloseIcon />
          </IconButton>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            
              <IoWalletOutline  sx={{ fontSize: 32 }} />
            <Typography variant="h5" component="span" fontWeight="bold">
              Edit Wallet Balance
            </Typography>
          </Box>
        </DialogTitle>
  
        <DialogContent
          sx={{
            position: 'relative',
            zIndex: 1,
            bgcolor: 'background.paper',
            pt: 3,
            pb: 2
          }}
        >
          <Typography
            variant="subtitle1"
            align="center"
            sx={{ mb: 2, fontWeight: 500 }}
          >
<form onSubmit={handleCreateWalletBalance}>

             <TextField
              fullWidth
              className='myTextField'
    sx={{
    '& .MuiAutocomplete-inputRoot': {
      padding: '9px 14px', // Match Select component padding
    },
    mt: 2
  }}
      label="Wallet Balance"
      required
      InputProps={{
        startAdornment: <IoWalletOutline className='mr-2'  />
      }}
onChange={(e)=> setWalletBalance(e.target.value)}
        value={walletBalance}
             >

             </TextField>

              <DialogActions
          sx={{
            position: 'relative',
            zIndex: 1,
            bgcolor: 'background.paper',
            px: 2,
            pb: 2,
            gap: 1,
            justifyContent: 'center'
          }}
        >



          <Button
            variant="outlined"
            onClick={(e) => {
              handleCloseWalletBalance()
              e.preventDefault()
            }}
            sx={{
              minWidth: 100,
              borderColor: 'grey.300',
              color: 'text.primary',
              '&:hover': {
                borderColor: 'grey.400',
                bgcolor: 'grey.50'
              }
            }}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            type='submit'
            color='success'

            onClick={handleCloseWalletBalance}
            disabled={loading}
            sx={{
              minWidth: 100,
              '&:hover': {
                bgcolor: 'error.dark'
              }
            }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              'Save Changes'
            )}
          </Button>
        </DialogActions>
             </form>
               </Typography>
       
        </DialogContent>
  
       
      </Dialog>
    </React.Fragment>
  );
}
export default EditWalletBalance

























