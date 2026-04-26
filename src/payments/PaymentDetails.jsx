
import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Divider,
  Box,
  Chip,
  Stack,
  IconButton,
} from '@mui/material';
import {
  Receipt,
  Payment,
  Person,
  AccessTime,
  CreditCard,
  Close,
  CheckCircle,
  Cancel,
} from '@mui/icons-material';

const PaymentDetails = ({ open, setOpen, payment }) => {
  if (!payment) return null;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const isRedeemed = payment.redeemed === true || payment.status === 'successful';

  return (
    <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
      <DialogTitle className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Receipt className="text-blue-500" />
          <Typography variant="h6">Payment Details</Typography>
        </div>
        <IconButton onClick={() => setOpen(false)} size="small">
          <Close />
        </IconButton>
      </DialogTitle>
      
      <DialogContent dividers>
        <Stack spacing={3}>
          {/* Status */}
         

          {/* Voucher */}
          <Box>
            <Typography variant="subtitle2" color="textSecondary">
              Voucher
            </Typography>
            <Typography variant="body1" className="font-mono bg-gray-50 p-2 rounded mt-1">
              {payment.voucher || 'N/A'}
            </Typography>
          </Box>

          {/* Amount */}
          <Box className="flex items-center gap-4">
            <div className="flex-1">
              <Typography variant="subtitle2" color="textSecondary">
                Amount
              </Typography>
              <Typography variant="h5" className="text-purple-600 font-bold mt-1">
                {formatCurrency(payment.amount)}
              </Typography>
            </div>
            <div className="flex-1">
              <Typography variant="subtitle2" color="textSecondary">
                Payment Method
              </Typography>
              <div className="flex items-center gap-2 mt-1">
                <Payment className="text-green-500" />
                <Typography variant="body1">
                  {payment.payment_method || 'N/A'}
                </Typography>
              </div>
            </div>
          </Box>

          <Divider />

          {/* Customer Info */}
          <Box>
            <Typography variant="subtitle2" color="textSecondary" 
            className="mb-2 mx-0">
              Customer Information
            </Typography>
            <div className="flex items-center gap-2 mb-2 flex-col">
              <Person className="text-gray-500" />
              <Typography variant="body1">
                {payment.name || 'Anonymous'}
              </Typography>


              <Typography variant="body1">
                {payment.phone_number || 'Anonymous'}
              </Typography>
            </div>
          </Box>

          {/* Reference */}
          <Box>
            <Typography variant="subtitle2" color="textSecondary">
              Reference
            </Typography>
            <Typography variant="body1" className="font-mono text-sm mt-1">
              {payment.reference || 'N/A'}
            </Typography>
          </Box>

          {/* Time */}
          <Box>
            <Typography variant="subtitle2" color="textSecondary">
              Payment Time
            </Typography>
            <div className="flex items-center gap-2 mt-1">
              <AccessTime className="text-gray-500" />
              <Typography variant="body1">
                {payment.time_paid || 'N/A'}
              </Typography>
            </div>
          </Box>

          {/* ID */}
          <Box>
            <Typography variant="subtitle2" color="textSecondary">
              Amount Disbursed
            </Typography>
            <Typography variant="body2" className="text-gray-500 mt-1">
              {payment.amount_disbursed || 'N/A'}
            </Typography>
            {/* <Typography variant="body2" className="text-gray-500 mt-1">
              {payment.id}
            </Typography> */}
          </Box>
        </Stack>
      </DialogContent>
      
      <DialogActions>
        <Button onClick={() => setOpen(false)} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PaymentDetails;
