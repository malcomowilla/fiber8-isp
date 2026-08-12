import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import CloseIcon from '@mui/icons-material/Close';
import { forwardRef, useState, useRef, useEffect } from 'react';
import {
  Slide,
  useTheme,
  useMediaQuery,
  Box,
  IconButton,
  Typography,
  Divider,
} from '@mui/material';

import { FaRegCreditCard } from "react-icons/fa6";
import LogoutIcon from '@mui/icons-material/Logout'; // add this import

import { 
   RefreshCw,
  
} from 'lucide-react';
import Popper from '@mui/material/Popper';
import Paper from '@mui/material/Paper';

import { ThemeProvider, createTheme } from '@mui/material/styles';
import { useMemo } from 'react';





const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function VoucherDetails({
  openVoucherDetails,
  handleCloseVoucherDetails,
  voucher,
  useLimit,
  speed,
  phone,
  createdAt,
  updatedAt,
  status,
  expiration,
  payment_method,
  reference,
  amount,
  customer,
  time_paid,
  isOnline,  
  loadingLogout  ,
  logoutUser,
  loginBy        
}) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const [anchorEl, setAnchorEl] = useState(null);
  const iconRef = useRef(null);


// const handleClick = (event, rowData) => {
//     // setSelectedRow(rowData);
//     setAnchorEl(event.currentTarget);
//   };

  const handleClick = (event) => {
    // setSelectedRow(rowData);
    setAnchorEl(event.currentTarget);
  };



   const handleClosePopper = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'logout-popover' : undefined;





function useIsDarkMode() {
  const [isDark, setIsDark] = useState(
    () => typeof document !== 'undefined' &&
      document.documentElement.classList.contains('dark')
  );

  useEffect(() => {
    const root = document.documentElement;

    const update = () => setIsDark(root.classList.contains('dark'));
    update();

    const observer = new MutationObserver(update);
    observer.observe(root, { attributes: true, attributeFilter: ['class'] });

    return () => observer.disconnect();
  }, []);

  return isDark;
}




const isDark = useIsDarkMode();

const tableTheme = useMemo(() => createTheme({
  palette: {
    mode: isDark ? 'dark' : 'light',
    background: {
      paper: isDark ? '#1e1e1e' : '#ffffff',
      default: isDark ? '#1e1e1e' : '#ffffff',
    },
    text: {
      primary: isDark ? '#f1f1f1' : '#1a1a1a',
      secondary: isDark ? '#a3a3a3' : '#6b7280',
    },
  },
}), [isDark]);




  return (
    <>


 <ThemeProvider theme={tableTheme}>
    <div className='font-sans
'>
  <Popper
        id={id}
        open={open}
        anchorEl={anchorEl}
        placement="right-start"
      
        sx={{
          zIndex: 9999, 
          '&[data-popper-placement*="right"]': {
            marginLeft: '8px !important',
          }
        }}
      >
        <Paper elevation={3} sx={{ p: 2, border: '1px solid #eee' }}>
          <Typography variant="body2" sx={{ mb: 1 }}>
            <p className='font-sans'>Logout voucher</p> {voucher}?
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
            <Button 
              size="small" 
              variant="outlined" 
              onClick={handleClosePopper}
            >
              <p className='font-sans'>Cancel </p>
            </Button>
            <Button
              size="small"
              color="error"
              variant="contained"
              onClick={() => {
                // console.log('Clearing MAC for:', selectedRow);
                handleClosePopper();
                logoutUser();
              }}
            >
              <p className='font-sans'>CONFIRM </p>
            </Button>
          </Box>
        </Paper>
      </Popper>


    <Dialog
      fullScreen={fullScreen}
      open={openVoucherDetails}
      onClose={handleCloseVoucherDetails}
      TransitionComponent={Transition}
      PaperProps={{
        elevation: 0,
        sx: {
          borderRadius: fullScreen ? 0 : 3,
          minWidth: { xs: '100%', sm: '400px' },
          maxWidth: '100%',
          m: fullScreen ? 0 : 2,
          position: 'relative',
          overflow: 'hidden',
        },
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: -64,
          left: -64,
          right: 0,
          bottom: 0,
          transform: 'rotate(-12deg) scale(1.5)',
          transformOrigin: '0 100%',
          zIndex: 0,
        }}
      />

      <DialogTitle
        sx={{
          position: 'relative',
          zIndex: 1,
          color: 'white',
          pt: 3,
          pb: 4,
          textAlign: 'center',
        }}
      >
        <IconButton
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: 'white',
          }}
          onClick={handleCloseVoucherDetails}
        >
          <CloseIcon />
        </IconButton>

         {isOnline && (
            <IconButton
              sx={{ color: 'red' }}
              title="Force logout"
               ref={iconRef}
              aria-describedby={id}
              onClick={(event) => handleClick(event)}
            >
              {loadingLogout ? (
                <RefreshCw className='animate-spin
                 text-blue-500 w-4 h-4' />
              ):  <LogoutIcon  />}
            </IconButton>
             )}
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              bgcolor: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <FaRegCreditCard className="text-black" />
          </Box>
          <Typography variant="h5" component="span" fontWeight="bold">
            <p className="text-black dark:text-white font-sans">Voucher Details</p>
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent
        sx={{
          position: 'relative',
          zIndex: 1,
          bgcolor: 'background.paper',
          pt: 3,
          pb: 2,
        }}
      >
        <Typography variant="body2" color="text.secondary" align="center">
          {/* Voucher line with online indicator */}
         <p className="text-black font-bold p-1 dark:text-white flex items-center justify-center gap-2 font-sans">
  Voucher: <span className="">{voucher}</span>
  <span className="inline-flex items-center gap-1 ml-2">
    {isOnline ? (
      <span className="inline-flex items-center gap-1 bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded-full">
        <span className="w-1.5 h-1.5 bg-green-600 rounded-full animate-pulse"></span>
        Online
      </span>
    ) : (
      <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-600 text-xs font-medium px-2 py-0.5 rounded-full">
        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
        Offline
      </span>
    )}
  </span>
</p>

          <p className="text-black font-bold dark:text-white font-sans">
            Status:{' '}
            <span
              className={`${
                status === 'active'
                  ? 'text-green-500 bg-green-100 p-1 rounded-lg'
                  : status === 'expired'
                  ? 'text-red-500 bg-red-100 p-1 rounded-lg'
                  : status === 'used'
                  ? 'text-yellow-500 bg-yellow-100 p-1 rounded-lg'
                  : ''
              } font-bold`}
            >
              {status}
            </span>
          </p>
          <p className="text-black font-bold p-1 dark:text-white font-sans">
            Expiration: <span className="">{expiration}</span>
          </p>
          <p className="text-black font-bold p-1 dark:text-white font-sans">
            Speed Limit: <span className="">{speed}</span>
          </p>
          <p className="text-black font-bold p-1 dark:text-white font-sans">
            User Limit: <span className="">{useLimit}</span>
          </p>
          <p className="text-black font-bold p-1 dark:text-white font-sans">
            Phone: <span className="">{phone}</span>
          </p>

                 <p className="text-black font-bold p-1 dark:text-white font-sans">
            Login Method: <span className="">{loginBy}</span>
          </p>

          <p className="text-black font-bold p-1 dark:text-white font-sans">
            Created At: <span className="">{createdAt}</span>
          </p>
          <p className="text-black font-bold p-1 dark:text-white font-sans">
            Updated At: <span className="">{updatedAt}</span>
          </p>
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Typography variant="subtitle2" align="center" sx={{ fontWeight: 600, mb: 1 }}>
          <p className='font-sans'>Payment Information </p>
        </Typography>
        <Typography variant="body2" color="text.secondary" align="center">
          {payment_method && (
            <p className="text-black font-bold p-1 font-sans dark:text-white">
              Payment Method: <span className="">{payment_method}</span>
            </p>
          )}
          {reference && (
            <p className="text-black font-bold p-1 font-sans dark:text-white">
              Reference: <span className="">{reference}</span>
            </p>
          )}
          {amount && (
            <p className="text-black font-bold p-1 dark:text-white font-sans">
              Amount: <span className="">KES {amount}</span>
            </p>
          )}
          {customer && (
            <p className="text-black font-bold p-1 dark:text-white font-sans">
              Customer: <span className="">{customer}</span>
            </p>
          )}
          {time_paid && (
            <p className="text-black font-bold p-1 dark:text-white font-sans">
              Time Paid: <span className="">{time_paid}</span>
            </p>
          )}
        </Typography>
      </DialogContent>

      <DialogActions
        sx={{
          position: 'relative',
          zIndex: 1,
          bgcolor: 'background.paper',
          px: 2,
          pb: 2,
          gap: 1,
          justifyContent: 'center',
        }}
      >
        <Button
          variant="outlined"
          onClick={handleCloseVoucherDetails}
          sx={{
            minWidth: 100,
            borderColor: 'grey.300',
            color: 'text.primary',
            '&:hover': {
              borderColor: 'grey.400',
              bgcolor: 'grey.50',
            },
          }}
        >
          <p className='font-sans'>Close </p>
        </Button>
      </DialogActions>
    </Dialog>
    </div>

     </ThemeProvider>
    </>
  );
}

export default VoucherDetails;