

// import * as React from 'react';
// import Button from '@mui/material/Button';
// import Dialog from '@mui/material/Dialog';
// import DialogActions from '@mui/material/DialogActions';
// import DialogContent from '@mui/material/DialogContent';
// import DialogTitle from '@mui/material/DialogTitle';
// import Stack from '@mui/material/Stack';

// import CloseIcon from '@mui/icons-material/Close';

//  function DeletePackage({openDelete, handleCloseDelete, deletePackage, id}) {
//   const [fullWidth, setFullWidth] = React.useState(true);
//   const [maxWidth, setMaxWidth] = React.useState('xs');

// const handleDelete=()=> {
//   deletePackage(id)
//   handleCloseDelete()
// }


//   return (
//     <React.Fragment>
     
//       <Dialog
//         fullWidth={fullWidth}
//         maxWidth={maxWidth}
//         open={openDelete}
//         onClose={handleCloseDelete}
//       >
//         <DialogTitle sx={{
//             fontWeight: 'bold'
//         }}>Delete Package</DialogTitle>
//         <DialogContent>
         
//         <p className='font-mono'>Are you sure want to delete this package</p>
//         </DialogContent>
//         <DialogActions>
//           <Stack direction={{ xs: 'column', sm: 'row'}}  spacing={{xs: 1, sm: 2, md: 4}}>

//           <Button onClick={handleCloseDelete} color='error' >Cancel</Button>
//           <Button onClick={handleDelete} startIcon={<CloseIcon/>} color='error' variant='outlined'>Delete</Button>
//           </Stack>
       
//         </DialogActions>
//       </Dialog>
//     </React.Fragment>
//   );
// }
// export default DeletePackage



import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import CloseIcon from '@mui/icons-material/Close';
// import Stack from '@mui/material/Stack';
import { forwardRef } from 'react';
import {
  
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
const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});


 function DeleteSubscriber({openDelete,handleCloseDelete, deleteSubscriber, id, loading}) {


  const [fullWidth, setFullWidth] = React.useState(true);
  const [maxWidth, setMaxWidth] = React.useState('xs');


const handleDelete=()=> {
  deleteSubscriber(id)
  handleCloseDelete()
}



const theme = useTheme();
const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <React.Fragment>
     
      {/* <Dialog
        fullWidth={fullWidth}
        maxWidth={maxWidth}
        open={openDelete}
        onClose={handleCloseDelete}
      >
        <DialogTitle sx={{
            fontWeight: 'bold'
        }}>Delete Package</DialogTitle>
        <DialogContent>
         
        <p className='font-mono'>Are you sure want to delete this router</p>
        </DialogContent>
        <DialogActions>
        <Stack direction={{ xs: 'column', sm: 'row'}}  spacing={{xs: 1, sm: 2, md: 4}}>

          <Button onClick={handleCloseDelete} color='error'>Cancel</Button>
          <Button onClick={handleDelete} variant='outlined' startIcon={<CloseIcon/>}   color='error'>Delete</Button>
          </Stack>

        </DialogActions>
      </Dialog> */}




<Dialog
        fullScreen={fullScreen}
        open={openDelete}
        onClose={handleCloseDelete}
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
            bgcolor: 'error.main',
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
            onClick={handleCloseDelete}
          >
            <CloseIcon />
          </IconButton>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <Box
              sx={{
                width: 56,
                height: 56,
                borderRadius: '50%',
                bgcolor: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <WarningIcon color="error" sx={{ fontSize: 32 }} />
            </Box>
            <Typography variant="h5" component="span" fontWeight="bold">
              Delete Subscriber
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
            Are you sure you want to delete this subscribber   </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            align="center"
          >
            This action cannot be undone.
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
            justifyContent: 'center'
          }}
        >



          <Button
            variant="outlined"
            onClick={handleCloseDelete}
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
            color="error"
            onClick={handleDelete}
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
              'Delete'
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
export default DeleteSubscriber;









