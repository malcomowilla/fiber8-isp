// src/components/partners/PartnerForm.jsx
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Stepper,
  Step,
  StepLabel,
  RadioGroup,
  Radio,
  FormLabel,
  IconButton,
  Tooltip,
  InputAdornment,
  Alert,
  Divider
} from '@mui/material';
import {
  Close as CloseIcon,
  Info as InfoIcon,
  Percent as PercentIcon,
  AttachMoney as MoneyIcon
} from '@mui/icons-material';

const commissionTypes = [
  { value: 'percentage', label: 'Percentage', description: 'Percentage of each voucher sale' },
  { value: 'fixed', label: 'Fixed Amount', description: 'Fixed amount per voucher sold' },
  { value: 'tiered', label: 'Tiered', description: 'Different rates based on volume' },
  { value: 'revenue_share', label: 'Revenue Share', description: 'Share of total revenue' }
];

const partnerTypes = [
  { value: 'landlord', label: 'Landlord', icon: '🏢', description: 'Provides physical space' },
  { value: 'reseller', label: 'Reseller', icon: '🏪', description: 'Sells vouchers directly' },
  { value: 'affiliate', label: 'Affiliate', icon: '👥', description: 'Refers customers' },
  { value: 'agent', label: 'Agent', icon: '👤', description: 'Acts as sales agent' },
  { value: 'distributor', label: 'Distributor', icon: '🚚', description: 'Manages multiple resellers' }
];

const payoutMethods = [
  { value: 'bank_transfer', label: 'Bank Transfer' },
  { value: 'mobile_money', label: 'Mobile Money' },
  { value: 'cash', label: 'Cash' },
  { value: 'paypal', label: 'PayPal' },
  { value: 'stripe', label: 'Stripe' }
];

const PartnerForm = ({ open, onClose, partner, mode, onSuccess }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    type: 'landlord',
    address: '',
    city: '',
    country: '',
    commission_type: 'percentage',
    commission_rate: 15,
    fixed_amount: 2.5,
    tiered_rules: [],
    minimum_payout: 50,
    payout_method: 'mobile_money',
    payout_frequency: 'monthly',
    bank_details: {
      bank_name: '',
      account_number: '',
      account_name: '',
      branch: ''
    },
    mobile_money: {
      provider: '',
      number: '',
      name: ''
    },
    status: 'active',
    notes: '',
    contract_start_date: new Date().toISOString().split('T')[0],
    contract_end_date: '',
    assigned_hotspots: []
  });

  useEffect(() => {
    if (partner && mode === 'edit') {
      setFormData({
        ...formData,
        ...partner,
        contract_start_date: partner.contract_start_date?.split('T')[0] || new Date().toISOString().split('T')[0],
        contract_end_date: partner.contract_end_date?.split('T')[0] || ''
      });
    }
  }, [partner, mode]);

  const steps = ['Basic Info', 'Commission', 'Payout', 'Hotspots', 'Review'];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleNestedChange = (parent, field, value) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value
      }
    }));
  };

  const validateStep = () => {
    switch (activeStep) {
      case 0:
        return formData.name && formData.email && formData.phone;
      case 1:
        if (formData.commission_type === 'percentage') {
          return formData.commission_rate > 0 && formData.commission_rate <= 100;
        }
        if (formData.commission_type === 'fixed') {
          return formData.fixed_amount > 0;
        }
        return true;
      case 2:
        return formData.payout_method && formData.minimum_payout >= 0;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep()) {
      setActiveStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep(prev => prev - 1);
  };

  const handleSubmit = async () => {
    try {
      const url = mode === 'edit' ? `/api/partners/${partner.id}` : '/api/partners';
      const method = mode === 'edit' ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        toast.success(`Partner ${mode === 'edit' ? 'updated' : 'created'} successfully`);
        onSuccess();
        onClose();
      } else {
        toast.error('Failed to save partner');
      }
    } catch (error) {
      toast.error('Network error');
    }
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                Partner Information
              </Typography>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Partner Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                helperText="Company or individual name"
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Partner Type *</InputLabel>
                <Select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  label="Partner Type *"
                >
                  {partnerTypes.map(type => (
                    <MenuItem key={type.value} value={type.value}>
                      <Box display="flex" alignItems="center">
                        <Typography sx={{ mr: 1 }}>{type.icon}</Typography>
                        {type.label}
                        <Typography variant="caption" color="textSecondary" sx={{ ml: 1 }}>
                          {type.description}
                        </Typography>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Phone Number"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                InputProps={{
                  startAdornment: <InputAdornment position="start">+</InputAdornment>
                }}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                multiline
                rows={2}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="City"
                name="city"
                value={formData.city}
                onChange={handleChange}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Country"
                name="country"
                value={formData.country}
                onChange={handleChange}
              />
            </Grid>
          </Grid>
        );

      case 1:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                Commission Structure
              </Typography>
            </Grid>
            
            <Grid item xs={12}>
              <FormControl component="fieldset">
                <FormLabel component="legend">Commission Type</FormLabel>
                <RadioGroup
                  name="commission_type"
                  value={formData.commission_type}
                  onChange={handleChange}
                  row
                >
                  {commissionTypes.map(type => (
                    <FormControlLabel
                      key={type.value}
                      value={type.value}
                      control={<Radio />}
                      label={
                        <Box>
                          <Typography>{type.label}</Typography>
                          <Typography variant="caption" color="textSecondary">
                            {type.description}
                          </Typography>
                        </Box>
                      }
                    />
                  ))}
                </RadioGroup>
              </FormControl>
            </Grid>
            
            {formData.commission_type === 'percentage' && (
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Commission Rate"
                  name="commission_rate"
                  type="number"
                  value={formData.commission_rate}
                  onChange={handleChange}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">%</InputAdornment>
                  }}
                  helperText="Percentage of each voucher sale"
                />
              </Grid>
            )}
            
            {formData.commission_type === 'fixed' && (
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Fixed Amount per Voucher"
                  name="fixed_amount"
                  type="number"
                  value={formData.fixed_amount}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>
                  }}
                  helperText="Fixed commission per voucher sold"
                />
              </Grid>
            )}
            
            {formData.commission_type === 'tiered' && (
              <Grid item xs={12}>
                <Alert severity="info">
                  Tiered commission setup will be configured in the settings page.
                </Alert>
              </Grid>
            )}
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Minimum Payout"
                name="minimum_payout"
                type="number"
                value={formData.minimum_payout}
                onChange={handleChange}
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>
                }}
                helperText="Minimum amount required for payout"
              />
            </Grid>
          </Grid>
        );

      case 2:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                Payout Settings
              </Typography>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Payout Method *</InputLabel>
                <Select
                  name="payout_method"
                  value={formData.payout_method}
                  onChange={handleChange}
                  label="Payout Method *"
                >
                  {payoutMethods.map(method => (
                    <MenuItem key={method.value} value={method.value}>
                      {method.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Payout Frequency *</InputLabel>
                <Select
                  name="payout_frequency"
                  value={formData.payout_frequency}
                  onChange={handleChange}
                  label="Payout Frequency *"
                >
                  <MenuItem value="weekly">Weekly</MenuItem>
                  <MenuItem value="biweekly">Bi-weekly</MenuItem>
                  <MenuItem value="monthly">Monthly</MenuItem>
                  <MenuItem value="quarterly">Quarterly</MenuItem>
                  <MenuItem value="manual">Manual</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            {formData.payout_method === 'bank_transfer' && (
              <>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Bank Name"
                    value={formData.bank_details.bank_name}
                    onChange={(e) => handleNestedChange('bank_details', 'bank_name', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Account Number"
                    value={formData.bank_details.account_number}
                    onChange={(e) => handleNestedChange('bank_details', 'account_number', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Account Name"
                    value={formData.bank_details.account_name}
                    onChange={(e) => handleNestedChange('bank_details', 'account_name', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Branch"
                    value={formData.bank_details.branch}
                    onChange={(e) => handleNestedChange('bank_details', 'branch', e.target.value)}
                  />
                </Grid>
              </>
            )}
            
            {formData.payout_method === 'mobile_money' && (
              <>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Mobile Money Provider"
                    value={formData.mobile_money.provider}
                    onChange={(e) => handleNestedChange('mobile_money', 'provider', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Phone Number"
                    value={formData.mobile_money.number}
                    onChange={(e) => handleNestedChange('mobile_money', 'number', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Account Name"
                    value={formData.mobile_money.name}
                    onChange={(e) => handleNestedChange('mobile_money', 'name', e.target.value)}
                  />
                </Grid>
              </>
            )}
          </Grid>
        );

      case 3:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                Assign Hotspots
              </Typography>
              <Alert severity="info">
                Hotspots can be assigned after partner creation from the partner details page.
              </Alert>
            </Grid>
          </Grid>
        );

      case 4:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                Review Partner Details
              </Typography>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="textSecondary">Name</Typography>
              <Typography variant="body1" fontWeight="medium">{formData.name}</Typography>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="textSecondary">Type</Typography>
              <Typography variant="body1" fontWeight="medium">
                {partnerTypes.find(t => t.value === formData.type)?.label}
              </Typography>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="textSecondary">Email</Typography>
              <Typography variant="body1">{formData.email}</Typography>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="textSecondary">Phone</Typography>
              <Typography variant="body1">{formData.phone}</Typography>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="textSecondary">Commission</Typography>
              <Typography variant="body1" fontWeight="medium">
                {formData.commission_type === 'percentage' 
                  ? `${formData.commission_rate}% per sale`
                  : `$${formData.fixed_amount} per voucher`}
              </Typography>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="textSecondary">Payout Method</Typography>
              <Typography variant="body1">
                {formData.payout_method} ({formData.payout_frequency})
              </Typography>
            </Grid>
            
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.status === 'active'}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      status: e.target.checked ? 'active' : 'inactive'
                    }))}
                  />
                }
                label={
                  <Box>
                    <Typography>Active Partner</Typography>
                    <Typography variant="caption" color="textSecondary">
                      Partner will be able to access portal and earn commissions
                    </Typography>
                  </Box>
                }
              />
            </Grid>
          </Grid>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">
            {mode === 'edit' ? 'Edit Partner' : 'Add New Partner'}
          </Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
        
        <Stepper activeStep={activeStep} sx={{ mt: 3 }}>
          {steps.map(label => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </DialogTitle>
      
      <DialogContent dividers>
        {renderStepContent()}
      </DialogContent>
      
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        
        <Box flexGrow={1} />
        
        {activeStep > 0 && (
          <Button onClick={handleBack} sx={{ mr: 1 }}>
            Back
          </Button>
        )}
        
        {activeStep < steps.length - 1 ? (
          <Button 
            onClick={handleNext} 
            variant="contained"
            disabled={!validateStep()}
          >
            Next
          </Button>
        ) : (
          <Button 
            onClick={handleSubmit} 
            variant="contained"
            color="primary"
          >
            {mode === 'edit' ? 'Update Partner' : 'Create Partner'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default PartnerForm;