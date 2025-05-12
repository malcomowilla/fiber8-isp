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
import MaterialTable from 'material-table';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CloudIcon from '@mui/icons-material/Cloud';
import WarningIcon from '@mui/icons-material/Warning';

import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Divider,
  Grid,
  IconButton,
  Tooltip,
  Snackbar,
  Alert
} from '@mui/material';
import { FaRegBuilding } from "react-icons/fa";
import EditPlan from './EditPlan';

// 0x011A68747470733a2f2f74723036392e616974656368732e636f2e6b65020561646d696e030561646d696e
// Predefined plans for dropdown selection only
const PREDEFINED_PPPOE_PLANS = [
  { name: "Pro", maximum_pppoe_subscribers: 100 },
  { name: "Standard", maximum_pppoe_subscribers: 180 },
  { name: "Enterprise", maximum_pppoe_subscribers: 2000 },
  { name: "Bronze", maximum_pppoe_subscribers: 1000 },
  { name: "Startup", maximum_pppoe_subscribers: 300 },
  { name: "Basic", maximum_pppoe_subscribers: 50 },
  { name: "Silver", maximum_pppoe_subscribers: 500 },
  {name: 'Free', maximum_pppoe_subscribers: 'unlimited'}
];

const PREDEFINED_HOTSPOT_PLANS = [
  { name: "Starter", hotspot_subscribers: 50 },
  { name: "Pro", hotspot_subscribers: 200 },
  { name: "Gold Hotspot", hotspot_subscribers: 1000 },
  { name: "Business", hotspot_subscribers: 2000 },
  { name: "Startup", hotspot_subscribers: 300 },
  { name: "Silver", hotspot_subscribers: 500 },
  {name: 'Free', hotspot_subscribers: 'unlimited'}
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
  const [planCategory, setPlanCategory] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [openPlanManager, setOpenPlanManager] = useState(false);


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
      setPlans(data || []);
      setPlanCategory(data)
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
      setHotspotPlans(data|| []);
      setPlanCategory(data)
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
        label:  `${plan.name} ${plan.maximum_pppoe_subscribers || plan.hotspot_subscribers}
         ${planType === 'pppoe' ?  'PPPoE Subscribers' : 'Hotspot Subscribers'}/${plan.name === 'Free' ? 365 : 30} Days`,
        value: plan.name,
        plan: {
          name: plan.name,
          [planType === 'pppoe' ? 'maximum_pppoe_subscribers' : 'hotspot_subscribers']: 
            planType === 'pppoe' ? plan.maximum_pppoe_subscribers : plan.hotspot_subscribers,
          expiry_days: plan.name === 'Free' ? 365 : 30,
          billing_cycle: 'monthly'
        }
      }));
  };

  const handlePlanSelect = (option) => {
    if (option) {
      console.log('plans', option.plan)
      setSelectedPlan(option.plan);
      setMaxSubscribers(
        planType === 'pppoe' 
          ? option.plan.maximum_pppoe_subscribers 
          : option.plan.hotspot_subscribers
      );
      setExpiryDays(option.plan.expiry_days || 30);
      setEditMode(false); // Always treat as new plan when selecting from predefined
    } else {
      // resetForm();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // if (!selectedPlan?.name) {
    //   toast.error('Plan name is required');
    //   return;
    // }

    const payload = {
      name: selectedPlan.name,
      [planType === 'pppoe' ? 'maximum_pppoe_subscribers' : 'hotspot_subscribers']: maxSubscribers,
      expiry_days: expiryDays,
      company_name: companyName,
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
        // resetForm();
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
  console.log('selected plan', selectedPlan)


  return (
    <>
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



          <TextField 
          InputProps={{
            startAdornment: <FaRegBuilding className="mr-2" />,
          }}
          className='myTextField' sx={{
            borderRadius: 2,
            mt: 6,
          }} label="Company Name" value={companyName} onChange={(e) => setCompanyName(e.target.value)} 
          fullWidth  />
          </FormControl>



          <Autocomplete
            options={predefinedOptions}
            getOptionLabel={(option) => option.label}
            value={selectedPlan ? predefinedOptions.find(opt => opt.value === selectedPlan.name) : null}
            onChange={(_, newValue) => handlePlanSelect(newValue)}
            renderInput={(params) => (
              <TextField
                {...params}
                className='myTextField'
                label="Select Predefined Plan"
                sx={{ mb: 2 }}
              />
            )}
          />

            <>
              {/* <TextField
                label="Plan Name"
                value={selectedPlan?.name}
                onChange={(e) => setSelectedPlan({...selectedPlan, name: e.target.value})}
                fullWidth
                required
                sx={{ mb: 2 }}
              /> */}

              {/* <TextField
                label={planType === 'pppoe' ? 'Max PPPoE Subscribers' : 'Max Hotspot Users'}
                type="number"
                value={maxSubscribers}
                onChange={(e) => setMaxSubscribers(Number(e.target.value))}
                fullWidth
                required
                sx={{ mb: 2 }}
              /> */}

              {/* <TextField
                label="Expiry Days"
                type="number"
                value={expiryDays}
                onChange={(e) => setExpiryDays(Number(e.target.value))}
                fullWidth
                required
                sx={{ mb: 2 }}
              /> */}
            </>

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
        hotspotPlans={hotspotPlans}
        planCategory={planCategory}
        planType={planType}
          // plans={currentPlans} 
          plans={plans} 
          companyName={companyName}
          setCompanyName={setCompanyName}
          selectedPlan={selectedPlan}
          handlePlanSelect={handlePlanSelect}
          type={planType}
          openPlanManager={openPlanManager}
          setOpenPlanManager={setOpenPlanManager}
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

    </>
  );
};

const PlanTable = ({ plans, type, onEdit, planType, planCategory, hotspotPlans,

  
companyName, setCompanyName,selectedPlan,handlePlanSelect,
openPlanManager, setOpenPlanManager
 }) => {


  if (plans.length === 0) {
    return (
      <Paper sx={{ p: 3 }}>
        <Typography>No plans found</Typography>
      </Paper>
    );
  }

  return (
    // <TableContainer component={Paper}>
    //   <Table>
    //     <TableHead>
    //       <TableRow>
    //         <TableCell>Name</TableCell>
    //         <TableCell>
    //           {type === 'pppoe' ? 'Max Subscribers' : 'Hotspot Users'}
    //         </TableCell>
    //         <TableCell>Expiry Days</TableCell>
    //         <TableCell>Billing Cycle</TableCell>
    //         <TableCell>Actions</TableCell>
    //       </TableRow>
    //     </TableHead>
    //     <TableBody>
    //       {plans.map((plan) => (
    //         <TableRow key={plan.id}>
    //           <TableCell>{plan.name}</TableCell>
    //           <TableCell>
    //             {type === 'pppoe' 
    //               ? plan.maximum_pppoe_subscribers 
    //               : plan.hotspot_subscribers}
    //           </TableCell>
    //           <TableCell>{plan.expiry_days || 30}</TableCell>
    //           <TableCell>{plan.billing_cycle || 'monthly'}</TableCell>
    //           <TableCell>
    //             <Button 
    //               size="small" 
    //               onClick={() => onEdit(plan)}
    //               variant="outlined"
    //             >
    //               Edit
    //             </Button>
    //           </TableCell>
    //         </TableRow>
    //       ))}
    //     </TableBody>
    //   </Table>
    // </TableContainer>

    <>

<EditPlan companyName={companyName} setCompanyName={setCompanyName}
planType={planType} selectedPlan={selectedPlan} handlePlanSelect={handlePlanSelect}
open={openPlanManager} onClose={() => setOpenPlanManager(false)}
/>

        {planType === 'pppoe' ? (
           <MaterialTable
           title={<p className='text-black'>PPPoE Plans</p>}
           columns={[
            { title: 'Maximum Subscribers', field: 'maximum_pppoe_subscribers' },
            { title: 'Expiry Days', field: 'expiry_days' },
            {title: 'Company Name', field: 'account.subdomain'},
            { title: 'Billing Cycle', field: 'billing_cycle' },
            {title: 'Status', field: 'status'},
             { title: 'Plan Name', field: 'name' 
             },

             {title: 'Expiry', field: 'expiry'},
           ]}
           data={plans}
           // isLoading={loading}
           actions={[
             {
               icon: () => (
                 <Tooltip title="Add PPoe Plan">
                   <IconButton color="primary">
                     <AddCircleIcon fontSize="large" />
                   </IconButton>
                 </Tooltip>
               ),
               tooltip: 'Add PPOe Plan',
               isFreeAction: true,
               // onClick: handleOpenAddDialog
             },
             {
               icon: () => <EditIcon color="primary" onClick={() => setOpenPlanManager(true)} />,
               tooltip: 'Edit PPOe Plan',
               // onClick: (event, rowData) => handleOpenEditDialog(rowData)
             },
             {
               icon: () => <DeleteIcon color="error" />,
               tooltip: 'Delete PPOe Plan',
               // onClick: (event, rowData) => handleDelete(rowData.id)
               // onClick: (event, rowData) => handleDeleteClick(rowData.id)
             }
           ]}
           options={{
             actionsColumnIndex: -1,
             pageSize: 10,
             pageSizeOptions: [5, 10, 20],
            //  showTitle: false,
             headerStyle: {
               backgroundColor: '#f5f5f5',
               fontWeight: 'bold'
             }
           }}
         />
        ) :  <MaterialTable
        title="Hotspot Plans"
        columns={[
          { title: 'Maximum Hotspot Subscribers', field: 'hotspot_subscribers' },
            { title: 'Expiry Days', field: 'expiry_days' },
            {title: 'Company Name', field: 'account.subdomain'},
            { title: 'Billing Cycle', field: 'billing_cycle' },
            {title: 'Expiry', field: 'expiry'},
            {title: 'Status', field: 'status'},
             { title: 'Plan Name', field: 'name' 
             },
        ]}
        data={hotspotPlans}
        // isLoading={loading}
        actions={[
          {
            icon: () => (
              <Tooltip title="Add Network">
                <IconButton color="primary">
                  <AddCircleIcon fontSize="large" />
                </IconButton>
              </Tooltip>
            ),
            tooltip: 'Add Network',
            isFreeAction: true,
            // onClick: handleOpenAddDialog
          },
          {
            icon: () => <EditIcon color="primary" />,
            tooltip: 'Edit Network',
            // onClick: (event, rowData) => handleOpenEditDialog(rowData)
          },
          {
            icon: () => <DeleteIcon color="error" />,
            tooltip: 'Delete Network',
            // onClick: (event, rowData) => handleDelete(rowData.id)
            // onClick: (event, rowData) => handleDeleteClick(rowData.id)
          }
        ]}
        options={{
          actionsColumnIndex: -1,
          pageSize: 10,
          pageSizeOptions: [5, 10, 20],
          // showTitle: false,
          headerStyle: {
            backgroundColor: '#f5f5f5',
            fontWeight: 'bold'
          }
        }}
      />}

   

</>
  );
};

export default PlanManager;