



import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  CircularProgress,
} from '@mui/material';
import { Warning } from '@mui/icons-material';

const DeletePayment = ({ open, setOpen, paymentId, onDelete, loading }) => {
  const handleDelete = async () => {
    await onDelete(paymentId);
  };

  return (
    <Dialog open={open} onClose={() => setOpen(false)} maxWidth="xs" fullWidth>
      <DialogTitle className="flex items-center gap-2 text-red-600">
        <Warning />
        <Typography variant="h6">Delete Payment</Typography>
      </DialogTitle>
      
      <DialogContent>
        <Box className="flex flex-col items-center text-center p-4">
          <Typography variant="body1" className="mb-4">
            Are you sure you want to delete this payment record?
          </Typography>
          <Typography variant="body2" color="textSecondary">
            This action cannot be undone. The payment record will be permanently removed.
          </Typography>
        </Box>
      </DialogContent>
      
      <DialogActions className="p-4">
        <Button
          onClick={() => setOpen(false)}
          disabled={loading}
          variant="outlined"
          className="mr-2"
        >
          Cancel
        </Button>
        <Button
          onClick={handleDelete}
          disabled={loading}
          variant="contained"
          color="error"
          startIcon={loading ? <CircularProgress size={20} /> : null}
        >
          {loading ? 'Deleting...' : 'Delete Payment'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeletePayment;
