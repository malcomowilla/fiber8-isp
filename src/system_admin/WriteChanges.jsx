import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { styled } from '@mui/material/styles';
import toast, { Toaster } from 'react-hot-toast';



const modalStyle = {
 
//   transform: 'translate(-50%, -50%)',
  width: { xs: '90%', sm: '80%', md: 600 },
  maxHeight: '80vh',
  bgcolor: 'background.paper',
  border: 'none',
  borderRadius: 2,
  boxShadow: 24,
  
  p: 4,
};

const headerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  mb: 2,
};

const StyledForm = styled('form')({
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
});

const WriteChanges = () => {
  const [change_title, setChangeTitle] = useState('');
  const [version, setVersion] = useState('');
  const [changes, setChanges] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleClose = () => {
    // setOpen(false);
    setVersion('');
    setChanges('');
    setError(null);
  };


        const changesArray = changes.split('\n').filter(change => change.trim() !== '');
console.log('changesArray', changesArray);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Split changes by newline to create an array
      const changesArray = changes.split('\n').filter(change => change.trim() !== '');

      const response = await fetch('/api/change_logs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
       body: JSON.stringify({
      change_log: {  // Rails expects nested params
        version,
        change_title,
        system_changes: changesArray
      }
    }),
      });

      if (response.ok) {
        
        toast.success('Changes submitted successfully');
        return;
      }

      if (!response.ok) {
        toast.error('Failed to submit changes');
        return;
      }

      // Reset form on success
      setVersion('');
      setChanges('');
      handleClose();
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
   <section className='flex justify-center'>
    <Toaster />
      <Box  sx={modalStyle}>
        <Box sx={headerStyle}>
          <Typography id="write-changes-modal-title" variant="h5" component="h2">
            Submit New Changes
          </Typography>
          <IconButton
            aria-label="close write changes"
            onClick={handleClose}
            sx={{ color: 'text.secondary' }}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        <StyledForm onSubmit={handleSubmit}>
          <TextField
          className='myTextField'
            label="Version Number"
            variant="outlined"
            value={version}
            onChange={(e) => setVersion(e.target.value)}
            // required
            placeholder="e.g., 1.2.0"
          />


          <TextField
          className='myTextField'
            label="Change Title"
            variant="outlined"
            value={change_title}
            onChange={(e) => setChangeTitle(e.target.value)}
            required
            placeholder="e.g., Change Title"
          />

          <TextField
            label="Changes"
            variant="outlined"
            value={changes}
            onChange={(e) => setChanges(e.target.value)}
            required
            multiline
            className='myTextField'
            rows={6}
            placeholder="Enter each change on a new line"
            helperText="List each change on a separate line"
          />

          {error && (
            <Typography color="error" variant="body2">
              {error}
            </Typography>
          )}

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
           
            <Button
              type="submit"
              variant="contained"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Changes'}
            </Button>
          </Box>
        </StyledForm>
      </Box>
      </section>
  );
};

export default WriteChanges;