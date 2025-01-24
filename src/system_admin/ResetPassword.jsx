


import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Paper } from '@mui/material';
import { toast, Slide,ToastContainer } from 'react-toastify';

const ResetPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        toast.success('New password has been sent to your email!', 
          { transition: Slide });


        setEmail('');
      } else {
        const data = await response.json();
        toast.error(data.message || 'Password reset failed. Please try again.', { transition: Slide });
        toast.error(data.error)
      }
    } catch (error) {
      toast.error('An error occurred. Please try again later.', { transition: Slide });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          maxWidth: 400,
          width: '90%',
        }}
      >
        <Typography variant="h5" component="h1" gutterBottom align="center">
          Reset Password
        </Typography>
        <Typography variant="body2" color="textSecondary" align="center" sx={{ mb: 3 }}>
          Enter your customer's email address and we'll send him a new password
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
          sx={{
            mb: 3,
            width: '100%',
            '& label.Mui-focused': { color: 'gray' },
            '& .MuiOutlinedInput-root': {
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "black",
                borderWidth: '3px'
              }
            }
          }}
            fullWidth
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className='myTextField'
           
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            disabled={loading}
            sx={{
              backgroundColor: 'green',
              '&:hover': {
                backgroundColor: 'darkgreen',
              },
            }}
          >
            {loading ? 'Sending...' : 'Reset Password'}
          </Button>
        </form>
      </Paper>
    </Box>

    <ToastContainer position='top-center' autoClose={3000} hideProgressBar={false} closeOnClick draggable pauseOnHover />
  </>
  );
};

export default ResetPassword;










