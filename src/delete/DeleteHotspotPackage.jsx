import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    IconButton,
    Typography,
    Box,
    CircularProgress,
    Slide,
    useTheme,
    useMediaQuery,
    Paper
  } from '@mui/material';
  import {
    Close as CloseIcon,
    DeleteOutline as DeleteIcon,
    Warning as WarningIcon
  } from '@mui/icons-material';

  
  import { forwardRef } from 'react';
  
  const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });
  
  const DeleteHotspotPackage= ({ id, isOpenDelete, setisOpenDelete, loading,deleteHotspotPackage }) => {
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  
    const handleDeleteHotspotPackage = () => {
        deleteHotspotPackage(id);
    };
  
    return (
      <Dialog
        fullScreen={fullScreen}
        open={isOpenDelete}
        onClose={() => setisOpenDelete(false)}
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
            onClick={() => setisOpenDelete(false)}
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
              Delete Hotspot Package
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
            Are you sure you want to delete this hotspot package   </Typography>
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
            onClick={() => setisOpenDelete(false)}
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
            onClick={handleDeleteHotspotPackage}
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
    );
  };
  
  export default DeleteHotspotPackage;