import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Tabs, 
  Tab, 
  Grid, 
  Card, 
  CardContent, 
  Button,
  Chip,
  Divider,
  Paper,
    TextField, 
    InputAdornment,
    CircularProgress

} from '@mui/material';
import { 
  Wifi as WifiIcon,
  Lan as LanIcon,
  CheckCircle as CheckIcon,
  Star as StarIcon,
    Payment as PaymentIcon,
  Phone as PhoneIcon,
  ArrowForward as ArrowForwardIcon,

    Info as InfoIcon

} from '@mui/icons-material';
import { FaLongArrowAltLeft } from "react-icons/fa";




const PREDEFINED_PPPOE_PLANS = [
  { name: "Pro", maximum_pppoe_subscribers: 100, price: 2700,  expiry_days: 30 },
  { name: "Standard", maximum_pppoe_subscribers: 180, price: 3200,  expiry_days: 30 },
  { name: "Enterprise", maximum_pppoe_subscribers: 2000, price: 8000,  expiry_days: 30 },
  { name: "Bronze", maximum_pppoe_subscribers: 1000, price: 6000, expiry_days: 30 },
  { name: "Startup", maximum_pppoe_subscribers: 300 , price: 3500, expiry_days: 30 },
  { name: "Basic", maximum_pppoe_subscribers: 50, price: 1500, expiry_days: 30 },
  { name: "Silver", maximum_pppoe_subscribers: 500 , price: 4500, expiry_days: 30 },
];

const PREDEFINED_HOTSPOT_PLANS = [
  { name: "Starter", hotspot_subscribers: 50, price: 1500,  expiry_days: 30 },
  { name: "Pro", hotspot_subscribers: 200, price: 2500,  expiry_days: 30 },
  { name: "Gold Hotspot", hotspot_subscribers: 1000, price: 5000 ,  expiry_days: 30 },
  { name: "Business", hotspot_subscribers: 2000, price: 10000,  expiry_days: 30 },
  { name: "Startup", hotspot_subscribers: 300 , price: 3500,  expiry_days: 30 },
  { name: "Silver", hotspot_subscribers: 500, price: 4500,  expiry_days: 30 },
];

const UserLicense = () => {
  const [planType, setPlanType] = useState('pppoe');
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [phone, setPhone] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [seePlans, setSeePlans] = useState(true);
  const [seePayment, setSeePayment] = useState(false);


const subdomain = window.location.hostname.split('.')[0]
  const makePayment = async(e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    // setTimeout(() => {
      
    // }, 2000);


    try {
      const response = await fetch('/api/make_subscription_payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Subdomain': subdomain,
        },
        body: JSON.stringify({
          phone_number: phone,
          amount: selectedPlan.price,
          package: selectedPlan.name,
          plan: selectedPlan,
          plan_type: planType,
        }),
      });


      if (response.ok) {
        
        setLoading(false);
        setSuccess(true);

      } else {
        
        setLoading(false);
        setSuccess(false);
      }
    } catch (error) {
      
      setLoading(false);
      setSuccess(false);
    }
  };


  const handlePlanTypeChange = (event, newValue) => {
    setPlanType(newValue);
    setSelectedPlan(null);
  };

  console.log('selected plan', selectedPlan)
  const plans = planType === 'pppoe' ? PREDEFINED_PPPOE_PLANS : PREDEFINED_HOTSPOT_PLANS;

  return (
    <>
{seePayment ? (
  <Paper elevation={3} sx={{ 
      maxWidth: 450, 
      mx: 'auto', 
      p: 4, 
      borderRadius: 3,
      background: 'linear-gradient(145deg, #f5f7fa 0%, #ffffff 100%)',
      border: '1px solid rgba(0, 0, 0, 0.1)'
    }}>
      <Box sx={{ textAlign: 'center', mb: 3 }}>
        <PaymentIcon color="success" sx={{ fontSize: 50 }} />
        <Typography variant="h5" component="h2" sx={{ mt: 1, fontWeight: 'bold' }}>
          M-Pesa Payment
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Complete your payment securely via M-Pesa
        </Typography>
      </Box>

      <Divider sx={{ my: 2 }} />

      {!success ? (
        <form onSubmit={makePayment}>
          <TextField
            fullWidth
            label="Phone Number"
            variant="outlined"
            className='myTextField'
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="07XXXXXXXX"
            required
            sx={{ mb: 3 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PhoneIcon color="primary" />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            fullWidth
            label="Amount (KES)"
            variant="outlined"
            type="number"
            className='myTextField'
            value={selectedPlan ? selectedPlan.price : ''}
            onChange={(e) => setAmount(e.target.value)}
            required
            sx={{ mb: 3 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">KES</InputAdornment>
              ),
            }}
          />

          <Button
            fullWidth
            variant="contained"
            size="large"
            type="submit"
            disabled={loading}
            sx={{
              py: 1.5,
              borderRadius: 2,
              background: 'linear-gradient(90deg, #2e7d32 0%, #4caf50 100%)',
              boxShadow: '0 4px 6px rgba(76, 175, 80, 0.2)',
              '&:hover': {
                boxShadow: '0 6px 8px rgba(76, 175, 80, 0.3)'
              }
            }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              <>
                Pay via M-Pesa
                <ArrowForwardIcon sx={{ ml: 1 }} />
              </>
            )}
          </Button>
          <FaLongArrowAltLeft 
          onClick={() => {
            setSeePayment(false)
            setSeePlans(true)
          }}
          className='w-7 h-7 cursor-pointer mt-2'/>
        </form>
      ) : (
        <Box sx={{ textAlign: 'center', py: 3 }}>
          <Box sx={{
            width: 80,
            height: 80,
            mx: 'auto',
            mb: 2,
            borderRadius: '50%',
            bgcolor: '#4caf50',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <PaymentIcon sx={{ fontSize: 40, color: 'white' }} />
          </Box>
          <Typography variant="h6" sx={{ mb: 1, fontWeight: 'bold' }}>
            Payment Initiated!
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Please check your phone to complete the M-Pesa payment
          </Typography>
          <Button 
            variant="outlined" 
            color="success"
            onClick={() => setSuccess(false)}
          >
            Make Another Payment
          </Button>
        </Box>
      )}

      <Box sx={{ 
        mt: 3, 
        p: 2, 
        bgcolor: '#f8f9fa', 
        borderRadius: 2,
        display: 'flex',
        alignItems: 'center'
      }}>
        <InfoIcon color="info" sx={{ mr: 1 }} />
        <Typography variant="caption">
          You'll receive an M-Pesa prompt on your phone to confirm payment
        </Typography>
      </Box>
    </Paper>
): null}












    {seePlans ? (

<Paper elevation={3} sx={{ p: 4, borderRadius: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
        Choose Your Plan
      </Typography>
      
      <Tabs 
        value={planType} 
        onChange={handlePlanTypeChange}
        variant="fullWidth"
        sx={{ mb: 4 }}
      >
        <Tab 
          value="pppoe" 
          label="PPPoE Plans" 
          icon={<LanIcon />} 
          iconPosition="start"
          sx={{ fontWeight: 600 }}
        />
        <Tab 
          value="hotspot" 
          label="Hotspot Plans" 
          icon={<WifiIcon />} 
          iconPosition="start"
          sx={{ fontWeight: 600 }}
        />
      </Tabs>

      <Grid container spacing={3}>
        {plans.map((plan) => (
          <Grid item xs={12} sm={6} md={4} key={plan.name}>
            <Card 
              elevation={selectedPlan?.name === plan.name ? 6 : 2}
              sx={{ 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                border: selectedPlan?.name === plan.name ? '2px solid #1976d2' : 'none',
                transition: 'all 0.3s ease'
              }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h5" component="h3" sx={{ fontWeight: 'bold' }}>
                    {plan.name}
                  </Typography>
                  {plan.name.includes('Pro') || plan.name.includes('Enterprise') || plan.name.includes('Gold') ? (
                    <Chip 
                      icon={<StarIcon />} 
                      label="Popular" 
                      color="primary" 
                      size="small"
                    />
                  ) : null}
                </Box>

                <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2 }}>
                    Ksh{plan.price.toLocaleString()}
                </Typography>

                <Divider sx={{ my: 2 }} />

                <Box sx={{ mb: 3 }}>
                  <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <CheckIcon color="success" sx={{ mr: 1 }} />
                    {planType === 'pppoe' 
                      ? `${plan.maximum_pppoe_subscribers} PPPoE Users`
                      : `${plan.hotspot_subscribers} Hotspot Users`}
                  </Typography>
                  <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center' }}>
                    <CheckIcon color="success" sx={{ mr: 1 }} />
                    24/7 Support
                  </Typography>
                </Box>
              </CardContent>

              <Box sx={{ p: 2 }}>
                <Button
                  fullWidth
                  color="success" 
                  variant={selectedPlan?.name === plan.name ? "contained" : "outlined"}
                  size="large"
                  onClick={() => setSelectedPlan(plan)}
                >
                  {selectedPlan?.name === plan.name ? 'Selected' : 'Select Plan'}
                </Button>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      {selectedPlan && (
        <Box sx={{ mt: 4, p: 3, bgcolor: 'action.hover', borderRadius: 2 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            You selected: <strong>{selectedPlan.name}</strong>
          </Typography>
          <Button 
          onClick={() => {
            setSeePlans(false)
            setSeePayment(true)
          }}
            variant="contained" 
            size="large" 
           color="success" 
            sx={{ px: 4 }}
          >
            Continue to Payment
          </Button>
        </Box>
      )}
    </Paper>
    ): null}
    
    </>
  );
};

export default UserLicense;