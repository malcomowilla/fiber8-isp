import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  CircularProgress,
  Autocomplete
} from '@mui/material';
import { toast } from 'react-toastify';
// 0x011A68747470733a2f2f74723036392e616974656368732e636f2e6b65020561646d696e030561646d696e
// Predefined plans for dropdown selection only
const PREDEFINED_PPPOE_PLANS = [
  { name: "Pro", maximum_pppoe_subscribers: 100 },
  { name: "Standard", maximum_pppoe_subscribers: 180 },
  { name: "Enterprise", maximum_pppoe_subscribers: 2000 },
  { name: "Bronze", maximum_pppoe_subscribers: 1000 },
  { name: "Startup", maximum_pppoe_subscribers: 300 },
  { name: "Basic", maximum_pppoe_subscribers: 50 },
  { name: "Silver", maximum_pppoe_subscribers: 500 }
];

const PREDEFINED_HOTSPOT_PLANS = [
  { name: "Starter", hotspot_subscribers: 50 },
  { name: "Pro", hotspot_subscribers: 200 },
  { name: "Gold Hotspot", hotspot_subscribers: 1000 },
  { name: "Business", hotspot_subscribers: 2000 },
  { name: "Startup", hotspot_subscribers: 300 },
  { name: "Silver", hotspot_subscribers: 500 }
];

const PlanManager = () => {
  const [planType, setPlanType] = useState('pppoe');
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [maxSubscribers, setMaxSubscribers] = useState(0);
  const [expiryDays, setExpiryDays] = useState(30);
  const [plans, setPlans] = useState([]);
  const [hotspotPlans, setHotspotPlans] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const subdomain = window.location.hostname.split('.')[0];

  // Fetch plans from backend only (for table display)
  useEffect(() => {
    fetchPlans();
    fetchHotspotPlans();
  }, []);

  const fetchPlans = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/pppoe_plans', {
        headers: { 'X-Subdomain': subdomain },
      });
      const data = await res.json();
      setPlans(data.pppoe_plans || []);
    } catch (err) {
      toast.error('Failed to fetch PPPoE plans');
      setPlans([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchHotspotPlans = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/hotspot_plans', {
        headers: { 'X-Subdomain': subdomain },
      });
      const data = await res.json();
      setHotspotPlans(data.hotspot_plans || []);
    } catch (err) {
      toast.error('Failed to fetch Hotspot plans');
      setHotspotPlans([]);
    } finally {
      setLoading(false);
    }
  };

  // Get predefined options for dropdown based on plan type
  const getPredefinedOptions = () => {
    return (planType === 'pppoe' ? PREDEFINED_PPPOE_PLANS : PREDEFINED_HOTSPOT_PLANS)
      .map(plan => ({
        label: plan.name,
        value: plan.name,
        plan: {
          name: plan.name,
          [planType === 'pppoe' ? 'maximum_pppoe_subscribers' : 'hotspot_subscribers']: 
            planType === 'pppoe' ? plan.maximum_pppoe_subscribers : plan.hotspot_subscribers,
          expiry_days: 30,
          billing_cycle: 'monthly'
        }
      }));
  };

  const handlePlanSelect = (option) => {
    if (option) {
      setSelectedPlan(option.plan);
      setMaxSubscribers(
        planType === 'pppoe' 
          ? option.plan.maximum_pppoe_subscribers 
          : option.plan.hotspot_subscribers
      );
      setExpiryDays(option.plan.expiry_days || 30);
      setEditMode(false); // Always treat as new plan when selecting from predefined
    } else {
      resetForm();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedPlan?.name) {
      toast.error('Plan name is required');
      return;
    }

    const payload = {
      name: selectedPlan.name,
      [planType === 'pppoe' ? 'maximum_pppoe_subscribers' : 'hotspot_subscribers']: maxSubscribers,
      expiry_days: expiryDays,
      billing_cycle: 'monthly',
    };

    try {
      const endpoint = planType === 'pppoe' ? '/api/pppoe_plans' : '/api/hotspot_plans';
      const method = editMode ? 'PATCH' : 'POST';

      const res = await fetch(endpoint, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          'X-Subdomain': subdomain
        },
        body: JSON.stringify({ plan: payload }),
      });

      if (res.ok) {
        toast.success(`Plan ${editMode ? 'updated' : 'created'} successfully!`);
        planType === 'pppoe' ? fetchPlans() : fetchHotspotPlans();
        resetForm();
      } else {
        const errorData = await res.json();
        toast.error(errorData.message || 'Failed to save plan');
      }
    } catch (err) {
      toast.error('Network error');
    }
  };

  const resetForm = () => {
    setSelectedPlan(null);
    setMaxSubscribers(0);
    setExpiryDays(30);
    setEditMode(false);
  };

  const currentPlans = planType === 'pppoe' ? plans : hotspotPlans;
  const predefinedOptions = getPredefinedOptions();

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>Plan Manager</Typography>
      
      <Paper sx={{ p: 3, mb: 4 }}>
        <form onSubmit={handleSubmit}>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Plan Type</InputLabel>
            <Select
              value={planType}
              onChange={(e) => {
                setPlanType(e.target.value);
                resetForm();
              }}
              label="Plan Type"
            >
              <MenuItem value="pppoe">PPPoE Plan</MenuItem>
              <MenuItem value="hotspot">Hotspot Plan</MenuItem>
            </Select>
          </FormControl>

          <Autocomplete
            options={predefinedOptions}
            getOptionLabel={(option) => option.label}
            value={selectedPlan ? predefinedOptions.find(opt => opt.value === selectedPlan.name) : null}
            onChange={(_, newValue) => handlePlanSelect(newValue)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Select Predefined Plan"
                sx={{ mb: 2 }}
              />
            )}
          />

          {selectedPlan && (
            <>
              <TextField
                label="Plan Name"
                value={selectedPlan.name}
                onChange={(e) => setSelectedPlan({...selectedPlan, name: e.target.value})}
                fullWidth
                required
                sx={{ mb: 2 }}
              />

              <TextField
                label={planType === 'pppoe' ? 'Max PPPoE Subscribers' : 'Max Hotspot Users'}
                type="number"
                value={maxSubscribers}
                onChange={(e) => setMaxSubscribers(Number(e.target.value))}
                fullWidth
                required
                sx={{ mb: 2 }}
              />

              <TextField
                label="Expiry Days"
                type="number"
                value={expiryDays}
                onChange={(e) => setExpiryDays(Number(e.target.value))}
                fullWidth
                required
                sx={{ mb: 2 }}
              />
            </>
          )}

          <Box sx={{ display: 'flex', gap: 2 }}>
            {selectedPlan ? (
              <>
                <Button type="submit" variant="contained" color="primary">
                  {editMode ? 'Update Plan' : 'Create Plan'}
                </Button>
                <Button variant="outlined" onClick={resetForm}>
                  Cancel
                </Button>
              </>
            ) : (
              <Button 
                variant="contained" 
                onClick={() => {
                  setSelectedPlan({
                    name: '',
                    [planType === 'pppoe' ? 'maximum_pppoe_subscribers' : 'hotspot_subscribers']: 0,
                    expiry_days: 30
                  });
                }}
              >
                Create Custom Plan
              </Button>
            )}
          </Box>
        </form>
      </Paper>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      ) : (

        
        <PlanTable 
          plans={currentPlans} 
          type={planType}
          onEdit={(plan) => {
            setSelectedPlan(plan);
            setMaxSubscribers(
              planType === 'pppoe' 
                ? plan.maximum_pppoe_subscribers 
                : plan.hotspot_subscribers
            );
            setExpiryDays(plan.expiry_days || 30);
            setEditMode(true);
          }}
        />
      )}
    </Box>
  );
};

const PlanTable = ({ plans, type, onEdit }) => {
  if (plans.length === 0) {
    return (
      <Paper sx={{ p: 3 }}>
        <Typography>No plans found</Typography>
      </Paper>
    );
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>
              {type === 'pppoe' ? 'Max Subscribers' : 'Hotspot Users'}
            </TableCell>
            <TableCell>Expiry Days</TableCell>
            <TableCell>Billing Cycle</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {plans.map((plan) => (
            <TableRow key={plan.id}>
              <TableCell>{plan.name}</TableCell>
              <TableCell>
                {type === 'pppoe' 
                  ? plan.maximum_pppoe_subscribers 
                  : plan.hotspot_subscribers}
              </TableCell>
              <TableCell>{plan.expiry_days || 30}</TableCell>
              <TableCell>{plan.billing_cycle || 'monthly'}</TableCell>
              <TableCell>
                <Button 
                  size="small" 
                  onClick={() => onEdit(plan)}
                  variant="outlined"
                >
                  Edit
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default PlanManager;