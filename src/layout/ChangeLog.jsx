import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '90%', sm: '80%', md: 600 },
  maxHeight: '80vh',
  bgcolor: 'background.paper',
  border: 'none',
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
  overflowY: 'auto',
};

const headerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  mb: 2,
};

const ChangeLog = ({ open, setOpen, changelogs }) => {
  const handleClose = () => setOpen(false);

  // Example changelog data - replace with your actual data
  const changelogItems = [
    {
      changes: [
        'Added dark mode support',
        'Improved performance on mobile devices',
        'Fixed login authentication issues',
      ],
    },
    {
      changes: [
        'Added new dashboard widgets',
        'Updated documentation',
        'Minor bug fixes',
      ],
    },
  ];




  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="changelog-modal-title"
      aria-describedby="changelog-modal-description"
    >
      <Box sx={modalStyle}>
        <Box sx={headerStyle}>
          <Typography id="changelog-modal-title" variant="h5" component="h2">
            <p className='roboto-condensed text-2xl'>Whats New</p>
          </Typography>
          <IconButton
            aria-label="close changelog"
            onClick={handleClose}
            sx={{ color: 'text.secondary' }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
        
        <Box id="changelog-modal-description" sx={{ mt: 2 }}>
            <Box  sx={{ mb: 4 }}>
              <Typography variant="h6" component="h3" sx={{ fontWeight: 'bold' }}>
                {changelogs.map((changeLog) => (
                  <Box key={changeLog.id} sx={{ mb: 4 }}>
                    <Typography variant="h6" component="h3" sx={{ fontWeight: 'bold' }}>
                     <p className='roboto-condensed text-2xl'>{changeLog.change_title}</p>
                    </Typography>
                    
                    <ul style={{ marginTop: 0, paddingLeft: 20 }}>
                      {changeLog.system_changes.map((my_change, index) => (
                        <li key={index}>
                          <Typography variant="body1">
                            
                            <p className='roboto-condensed font-thin'>{my_change}</p>
                            
                            </Typography>
                        </li>
                      ))}
                    </ul>
                  </Box>
                ))}
              </Typography>
              
              {/* <ul style={{ marginTop: 0, paddingLeft: 20 }}>
                {release.changes.map((change, changeIndex) => (
                  <li key={changeIndex}>
                    <Typography variant="body1">{change}</Typography>
                  </li>
                ))}
              </ul> */}
            </Box>
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
          <Button 
            variant="contained" 
            onClick={handleClose}
            aria-label="Close release notes"
          >
            <p className='roboto-condensed'>Close</p>
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default ChangeLog;