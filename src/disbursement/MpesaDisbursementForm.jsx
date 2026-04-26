

import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  Divider,
  IconButton,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stepper,
  Step,
  StepLabel
} from '@mui/material';
import {
  AttachMoney,
  Phone,
  AccountBalance,
  Send,
  Receipt,
  CheckCircle,
  Error,
  Info,
  Security,
  Payment,
  History,
  ContactPhone
} from '@mui/icons-material';

const MpesaDisbursementForm = () => {
  // Form state
  const [formData, setFormData] = useState({
    phoneNumber: '',
    amount: '',
    remarks: 'Partner Payment',
    occasion: 'Commission Payout'
  });
  
  // UI state
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [transactionResult, setTransactionResult] = useState(null);
  const [openConfirmation, setOpenConfirmation] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [disbursementHistory, setDisbursementHistory] = useState([]);
  
  const subdomain = window.location.hostname.split('.')[0];
  
  // Phone number prefixes for Kenya
  const phonePrefixes = [
    { value: '2547', label: '2547 (Safaricom)' },
    { value: '2541', label: '2541 (Airtel)' },
    { value: '2547', label: '2547 (Telkom)' }
  ];
  
  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Format phone number (remove spaces, dashes)
    if (name === 'phoneNumber') {
      const cleanedValue = value.replace(/[^\d]/g, '');
      setFormData({
        ...formData,
        [name]: cleanedValue
      });
    } else if (name === 'amount') {
      // Ensure amount is a positive number
      const cleanedValue = value.replace(/[^\d.]/g, '');
      setFormData({
        ...formData,
        [name]: cleanedValue
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };
  
  // Validate form
  const validateForm = () => {
    const errors = [];
    
    // Validate phone number (Kenyan format: 2547XXXXXXXX)
    if (!formData.phoneNumber.match(/^2547\d{8}$/)) {
      errors.push('Phone number must be in format: 2547XXXXXXXX (e.g., 254712345678)');
    }
    
    // Validate amount
    const amount = parseFloat(formData.amount);
    if (!amount || amount <= 0) {
      errors.push('Amount must be greater than 0');
    }
    // if (amount < 10) {
    //   errors.push('Minimum disbursement amount is KES 10');
    // }
    if (amount > 150000) {
      errors.push('Maximum disbursement amount is KES 150,000');
    }
    
    return errors;
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate
    const errors = validateForm();
    if (errors.length > 0) {
      setError(errors.join('. '));
      return;
    }
    
    setError('');
    setOpenConfirmation(true);
  };
  
  // Confirm and send disbursement
  const confirmDisbursement = async () => {
    setLoading(true);
    setOpenConfirmation(false);
    setActiveStep(1); // Processing step
    
    try {
      const response = await fetch('/api/disburse_funds', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Subdomain': subdomain,
        },
        body: JSON.stringify({
          phone_number: formData.phoneNumber,
          amount: formData.amount,
          remarks: formData.remarks,
          occasion: formData.occasion
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setSuccess(true);
        setTransactionResult(data);
        setActiveStep(2); // Success step
        
        // Add to history
        setDisbursementHistory(prev => [{
          id: Date.now(),
          phoneNumber: formData.phoneNumber,
          amount: formData.amount,
          date: new Date().toISOString(),
          status: 'success',
          reference: data.ConversationID || data.OriginatorConversationID || 'N/A'
        }, ...prev]);
        
        // Reset form after 3 seconds
        setTimeout(() => {
          setFormData({
            phoneNumber: '',
            amount: '',
            remarks: 'Partner Payment',
            occasion: 'Commission Payout'
          });
          setSuccess(false);
          setActiveStep(0);
        }, 5000);
        
      } else {
        throw new Error(data.error || 'Failed to disburse funds');
      }
    } catch (error) {
      console.error('Error disbursing funds:', error);
      setError(error.message);
      setActiveStep(3); // Error step
      
      // Add failed transaction to history
      setDisbursementHistory(prev => [{
        id: Date.now(),
        phoneNumber: formData.phoneNumber,
        amount: formData.amount,
        date: new Date().toISOString(),
        status: 'failed',
        error: error.message
      }, ...prev]);
    } finally {
      setLoading(false);
    }
  };
  
  // Format phone number for display
  const formatPhoneNumber = (phone) => {
    if (!phone) return '';
    if (phone.length === 12) { // 2547XXXXXXXX
      return `+${phone.substring(0, 4)} ${phone.substring(4, 7)} ${phone.substring(7, 10)} ${phone.substring(10, 12)}`;
    }
    return phone;
  };
  
  // Recent disbursements (mock data - in real app, fetch from API)
  const recentDisbursements = [
    { id: 1, phoneNumber: '254712345678', amount: '5000', date: '2025-12-27', status: 'success', reference: 'MPE2345678' },
    { id: 2, phoneNumber: '254798765432', amount: '7500', date: '2025-12-26', status: 'success', reference: 'MPE2345679' },
    { id: 3, phoneNumber: '254711223344', amount: '3000', date: '2025-12-25', status: 'failed', error: 'Insufficient balance' },
  ];

  // Stepper steps
  const steps = ['Enter Details', 'Processing Payment', 'Transaction Complete', 'Error'];

  return (
    <Box sx={{ p: 3, maxWidth: 800, margin: '0 auto' }}>
      {/* Header */}
      <Paper elevation={2} sx={{ p: 3, mb: 3, backgroundColor: '#f8f9fa' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <AccountBalance color="primary" sx={{ mr: 2, fontSize: 40 }} />
          <Box>
            <Typography variant="h5" fontWeight="bold">
              M-Pesa Funds Disbursement
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Send money to partners, resellers, or agents via M-Pesa B2C
            </Typography>
          </Box>
        </Box>
        
        <Alert severity="info" icon={<Info />} sx={{ mt: 2 }}>
          <Typography variant="body2">
            <strong>Note:</strong> Minimum amount: KES 10 | Maximum: KES 150,000
          </Typography>
        </Alert>
      </Paper>
      
      {/* Stepper */}
      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Grid container spacing={3}>
        {/* Left Column: Form */}
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              <Send sx={{ mr: 1, verticalAlign: 'middle' }} />
              Send Money
            </Typography>
            
            {/* Error Message */}
            {error && (
              <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
                {error}
              </Alert>
            )}
            
            {/* Success Message */}
            {success && (
              <Alert severity="success" sx={{ mb: 3 }} icon={<CheckCircle />}>
                <Typography variant="body2">
                  <strong>Payment Sent Successfully!</strong>
                  <br />
                  {transactionResult && `Reference: ${transactionResult.ConversationID || transactionResult.OriginatorConversationID}`}
                </Typography>
              </Alert>
            )}
            
            <form onSubmit={handleSubmit}>
              {/* Phone Number */}
              <TextField
                fullWidth
                label="M-Pesa Phone Number"
                name="phoneNumber"
                className='myTextField'
                value={formatPhoneNumber(formData.phoneNumber)}
                onChange={handleChange}
                placeholder="2547XXXXXXXX"
                margin="normal"
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Phone />
                    </InputAdornment>
                  ),
                }}
                helperText="Format: 2547XXXXXXXX (e.g., 254712345678)"
                disabled={loading}
              />
              
              {/* Amount */}
              <TextField
                fullWidth
                label="Amount (KES)"
                name="amount"
                className='myTextField'

                value={formData.amount}
                onChange={handleChange}
                placeholder="1000"
                margin="normal"
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AttachMoney />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      KES
                    </InputAdornment>
                  ),
                }}
                helperText="Enter amount between 10 and 150,000 KES"
                disabled={loading}
              />
              
              {/* Remarks */}
              <TextField
                fullWidth
                label="Remarks"
                name="remarks"
                  className='myTextField'

                value={formData.remarks}
                onChange={handleChange}
                margin="normal"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Receipt />
                    </InputAdornment>
                  ),
                }}
                disabled={loading}
              />
              
              {/* Occasion */}
              <TextField
                fullWidth
                label="Occasion"
                name="occasion"
           className='myTextField'

                value={formData.occasion}
                onChange={handleChange}
                margin="normal"
                helperText="Purpose of payment (e.g., Commission, Bonus, Refund)"
                disabled={loading}
              />
              
              {/* Submit Button */}
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                size="large"
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Send />}
                disabled={loading}
                sx={{ mt: 3 }}
              >
                {loading ? 'Processing...' : 'Send Payment'}
              </Button>
              
              {/* Quick Amount Buttons */}
              <Typography variant="body2" sx={{ mt: 3, mb: 1, color: 'text.secondary' }}>
                Quick Amounts:
              </Typography>
              <Grid container spacing={1}>
                {[500, 1000, 2000, 5000, 10000].map((amount) => (
                  <Grid item key={amount}>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => setFormData({...formData, amount: amount.toString()})}
                      disabled={loading}
                    >
                      KES {amount}
                    </Button>
                  </Grid>
                ))}
              </Grid>
            </form>
            
            {/* Processing Indicator */}
            {loading && (
              <Box sx={{ mt: 3, textAlign: 'center' }}>
                <CircularProgress />
                <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
                  Processing M-Pesa payment...
                </Typography>
              </Box>
            )}
          </Paper>
          
          {/* Security Info */}
          <Paper elevation={2} sx={{ p: 2, mt: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Security color="info" sx={{ mr: 1 }} />
              <Typography variant="body2" color="textSecondary">
                <strong>Secure Transaction:</strong> All payments are processed through Safaricom's secure M-Pesa API
              </Typography>
            </Box>
          </Paper>
        </Grid>
        
        {/* Right Column: Info & History */}
        <Grid item xs={12} md={6}>
          {/* Transaction Summary Card */}
          <Card elevation={2} sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <Payment sx={{ mr: 1 }} />
                Transaction Summary
              </Typography>
              
              <Divider sx={{ my: 2 }} />
              
              {formData.phoneNumber && formData.amount ? (
                <Box>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="textSecondary">Recipient:</Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {formatPhoneNumber(formData.phoneNumber)}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="textSecondary">Amount:</Typography>
                      <Typography variant="body1" color="success.main" fontWeight="bold">
                        KES {parseFloat(formData.amount).toLocaleString()}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="textSecondary">Purpose:</Typography>
                      <Typography variant="body1">{formData.occasion}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="textSecondary">Transaction Fee:</Typography>
                      <Typography variant="body1" color="text.secondary">
                        KES {calculateTransactionFee(parseFloat(formData.amount)).toFixed(2)}
                      </Typography>
                    </Grid>
                  </Grid>
                  
                  <Box sx={{ mt: 3, p: 2, backgroundColor: '#f8f9fa', borderRadius: 1 }}>
                    <Typography variant="body2">
                      <strong>Total Amount:</strong>
                    </Typography>
                    <Typography variant="h6" color="primary">
                      KES {(parseFloat(formData.amount) + calculateTransactionFee(parseFloat(formData.amount))).toFixed(2)}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      Amount + Transaction Fee
                    </Typography>
                  </Box>
                </Box>
              ) : (
                <Typography variant="body2" color="textSecondary" sx={{ textAlign: 'center', py: 3 }}>
                  Enter phone number and amount to see transaction summary
                </Typography>
              )}
            </CardContent>
          </Card>
          
          {/* Recent Disbursements */}
          <Card elevation={2}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <History sx={{ mr: 1 }} />
                Recent Disbursements
              </Typography>
              
              <Divider sx={{ my: 2 }} />
              
              <Box sx={{ maxHeight: 300, overflow: 'auto' }}>
                {disbursementHistory.length > 0 ? (
                  disbursementHistory.slice(0, 5).map((transaction) => (
                    <Box
                      key={transaction.id}
                      sx={{
                        p: 2,
                        mb: 1,
                        borderRadius: 1,
                        backgroundColor: transaction.status === 'success' ? '#e8f5e9' : '#ffebee',
                        borderLeft: transaction.status === 'success' ? '4px solid #4caf50' : '4px solid #f44336'
                      }}
                    >
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box>
                          <Typography variant="body2" fontWeight="medium">
                            {formatPhoneNumber(transaction.phoneNumber)}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            {new Date(transaction.date).toLocaleDateString()}
                          </Typography>
                        </Box>
                        <Box sx={{ textAlign: 'right' }}>
                          <Typography variant="body1" fontWeight="bold">
                            KES {parseFloat(transaction.amount).toLocaleString()}
                          </Typography>
                          <Typography variant="caption" color={transaction.status === 'success' ? 'success.main' : 'error'}>
                            {transaction.status === 'success' ? '✓ Success' : '✗ Failed'}
                          </Typography>
                        </Box>
                      </Box>
                      {transaction.error && (
                        <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
                          {transaction.error}
                        </Typography>
                      )}
                    </Box>
                  ))
                ) : (
                  recentDisbursements.map((transaction) => (
                    <Box
                      key={transaction.id}
                      sx={{
                        p: 2,
                        mb: 1,
                        borderRadius: 1,
                        backgroundColor: transaction.status === 'success' ? '#e8f5e9' : '#ffebee',
                        borderLeft: transaction.status === 'success' ? '4px solid #4caf50' : '4px solid #f44336'
                      }}
                    >
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box>
                          <Typography variant="body2" fontWeight="medium">
                            {formatPhoneNumber(transaction.phoneNumber)}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            {transaction.date}
                          </Typography>
                        </Box>
                        <Box sx={{ textAlign: 'right' }}>
                          <Typography variant="body1" fontWeight="bold">
                            KES {parseFloat(transaction.amount).toLocaleString()}
                          </Typography>
                          <Typography variant="caption" color={transaction.status === 'success' ? 'success.main' : 'error'}>
                            {transaction.status === 'success' ? '✓ Success' : '✗ Failed'}
                          </Typography>
                        </Box>
                      </Box>
                      {transaction.reference && transaction.status === 'success' && (
                        <Typography variant="caption" color="textSecondary" sx={{ mt: 1, display: 'block' }}>
                          Ref: {transaction.reference}
                        </Typography>
                      )}
                    </Box>
                  ))
                )}
              </Box>
              
              {disbursementHistory.length === 0 && recentDisbursements.length === 0 && (
                <Typography variant="body2" color="textSecondary" sx={{ textAlign: 'center', py: 3 }}>
                  No disbursement history available
                </Typography>
              )}
            </CardContent>
          </Card>
          
          {/* M-Pesa Guidelines */}
          <Paper elevation={2} sx={{ p: 2, mt: 3, backgroundColor: '#e3f2fd' }}>
            <Typography variant="subtitle2" gutterBottom>
              <Info sx={{ mr: 1, verticalAlign: 'middle' }} />
              M-Pesa B2C Guidelines
            </Typography>
            <ul style={{ margin: 0, paddingLeft: 20, fontSize: '0.8rem' }}>
              <li>Only Kenyan M-Pesa numbers (starts with 2547)</li>
              <li>Transaction limit: KES 150,000 per transaction</li>
              <li>Daily limit: KES 300,000 per recipient</li>
              <li>Processing time: Usually within 60 seconds</li>
              <li>Recipient will receive an SMS confirmation</li>
            </ul>
          </Paper>
        </Grid>
      </Grid>
      
      {/* Confirmation Dialog */}
      <Dialog open={openConfirmation} onClose={() => setOpenConfirmation(false)}>
        <DialogTitle>Confirm Disbursement</DialogTitle>
        <DialogContent>
          <Typography variant="body1" gutterBottom>
            Are you sure you want to send money to:
          </Typography>
          
          <Box sx={{ p: 2, backgroundColor: '#f5f5f5', borderRadius: 1, mb: 2 }}>
            <Typography variant="h6" align="center">
              {formatPhoneNumber(formData.phoneNumber)}
            </Typography>
          </Box>
          
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography variant="body2" color="textSecondary">Amount:</Typography>
              <Typography variant="h6" color="primary">
                KES {parseFloat(formData.amount).toLocaleString()}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2" color="textSecondary">Fee:</Typography>
              <Typography variant="body1" color="text.secondary">
                KES {calculateTransactionFee(parseFloat(formData.amount)).toFixed(2)}
              </Typography>
            </Grid>
          </Grid>
          
          <Box sx={{ mt: 3, p: 2, backgroundColor: '#fff3e0', borderRadius: 1 }}>
            <Typography variant="body2" color="warning.main">
              <strong>Total Debit:</strong> KES {(parseFloat(formData.amount) + calculateTransactionFee(parseFloat(formData.amount))).toFixed(2)}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirmation(false)} disabled={loading}>
            Cancel
          </Button>
          <Button 
            onClick={confirmDisbursement} 
            variant="contained" 
            color="primary"
            disabled={loading}
            startIcon={<Send />}
          >
            Confirm & Send
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

// Helper function to calculate M-Pesa transaction fee (approximate)
const calculateTransactionFee = (amount) => {
  if (amount <= 100) return 0;
  if (amount <= 500) return 5;
  if (amount <= 1000) return 10;
  if (amount <= 5000) return 25;
  if (amount <= 15000) return 50;
  if (amount <= 30000) return 75;
  if (amount <= 45000) return 100;
  if (amount <= 60000) return 110;
  if (amount <= 75000) return 120;
  if (amount <= 90000) return 130;
  if (amount <= 100000) return 140;
  if (amount <= 110000) return 150;
  if (amount <= 120000) return 160;
  if (amount <= 130000) return 170;
  if (amount <= 140000) return 180;
  if (amount <= 150000) return 190;
  return 195; // Max fee
};

export default MpesaDisbursementForm;