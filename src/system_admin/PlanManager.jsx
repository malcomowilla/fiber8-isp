import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  
  FormControl,
  Paper,
  
  CircularProgress,
  Autocomplete
} from '@mui/material';
import { toast } from 'react-toastify';
import MaterialTable from 'material-table';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import { 
 
  IconButton,
  Tooltip,
  
} from '@mui/material';
import { FaRegBuilding } from "react-icons/fa";
import EditPlan from './EditPlan';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import DeleteHotspotPlan from './DeleteHotspotPlan';
import DeletePPPOEPlan from './DeletePPPOEPlan';




const PREDEFINED_PPPOE_PLANS = [
  { name: "Pro", maximum_pppoe_subscribers: 100, price: 2700, expiry_days: 30 },
  { name: "Standard", maximum_pppoe_subscribers: 180, price: 3200, expiry_days: 30 },
  { name: "Enterprise", maximum_pppoe_subscribers: 2000, price: 8000, expiry_days: 30 },
  { name: "Bronze", maximum_pppoe_subscribers: 1000, price: 6000, expiry_days: 30 },
  { name: "Startup", maximum_pppoe_subscribers: 300 , price: 3500, expiry_days: 30 },
  { name: "Basic", maximum_pppoe_subscribers: 50, price: 1500, expiry_days: 30 },
  { name: "Silver", maximum_pppoe_subscribers: 500 , price: 4500, expiry_days: 30 },
  {name: 'Free PPPoe', maximum_pppoe_subscribers: 'unlimited', price: 0, expiry_days: 365},
  { name: "Free Trial", maximum_pppoe_subscribers: 'unlimited', price: 0, expiry_days: 3}
];

const PREDEFINED_HOTSPOT_PLANS = [
  { name: "Starter", hotspot_subscribers: 50, price: 1000, expiry_days: 30 },
  { name: "Improved", hotspot_subscribers: 100, price: 1500, expiry_days: 30 },
  { name: "Pro", hotspot_subscribers: 200, price: 2500, expiry_days: 30 },
  { name: "Gold Hotspot", hotspot_subscribers: 1000, price: 5000, expiry_days: 30 },
  { name: "Business", hotspot_subscribers: 2000, price: 10000, expiry_days: 30 },
  { name: "Startup", hotspot_subscribers: 300 , price: 3500, expiry_days: 30 },
  { name: "Silver", hotspot_subscribers: 500, price: 4500, expiry_days: 30 },
  {name: 'Free Hotspot', hotspot_subscribers: 'unlimited', price: 0, expiry_days: 365},
    { name: "Free Trial", maximum_pppoe_subscribers: 'unlimited', price: 0, expiry_days: 3}

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








  const defaultMaterialTheme = createTheme({
    props: {
      MuiInputLabel: {
          shrink: true
       }
  },
    palette: {
    
      
      mode:  'light' ,
      primary: {
        light: '#757ce8',
        main: '#3f50b5',
        dark: '000000',
        contrastText: '#fff',
      },
      secondary: {
        light: '#ff7961',
        main: '#f44336',
        dark: '#ba000d',
        contrastText: '#000',
      },
  
    },
  
  });
  const [materialuitheme, setMaterialuiTheme] = 
  useState(createTheme(defaultMaterialTheme));





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





const planOptions = [
  { value: 'pppoe', label: 'PPPoE Plan' },
  { value: 'hotspot', label: 'Hotspot Plan' },
];



  // Get predefined options for dropdown based on plan type
  const getPredefinedOptions = () => {
    return (planType === 'pppoe' ? PREDEFINED_PPPOE_PLANS : PREDEFINED_HOTSPOT_PLANS)
      .map(plan => ({
        label:  `${plan.name}  Ksh ${plan.price}  ${plan.maximum_pppoe_subscribers || plan.hotspot_subscribers} 
         ${planType === 'pppoe' ?  'PPPoE Subscribers' : 'Hotspot Subscribers'}/${plan.name === 'Free PPPoe' || plan.name === 'Free Hotspot' ? 365 : plan.name === 'Free Trial' ? 3 : 30} Days`,
        value: plan.name,
        plan: {
          name: plan.name,
          [planType === 'pppoe' ? 'maximum_pppoe_subscribers' : 'hotspot_subscribers']: 
            planType === 'pppoe' ? plan.maximum_pppoe_subscribers : plan.hotspot_subscribers,
          expiry_days: plan.name === 'Free PPPoe' || plan.name === 'Free Hotspot' ? 365 : 30,
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
        toast.error('Failed to save plan');
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
    <>

    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>Plan Manager</Typography>
      

      <ThemeProvider theme={materialuitheme}>

      <Paper sx={{ p: 3, mb: 4 }}>
        <form onSubmit={handleSubmit}>
          <FormControl fullWidth sx={{ mb: 2 }}>
           <Autocomplete
           className='myTextField'
  options={planOptions}
  value={planOptions.find(option => option.value === planType) || null}
  onChange={(event, newValue) => {
    setPlanType(newValue?.value || '');
    resetForm();
  }}
  getOptionLabel={(option) => option.label}
  renderInput={(params) => (
    <TextField
      {...params}
      label="Plan Type"
      variant="outlined"
    />
  )}
  sx={{ 
    '& .MuiAutocomplete-inputRoot': {
      padding: '8px 14px',
    },
    '& .MuiOutlinedInput-root': {
      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
        borderColor: 'primary.main',
        borderWidth: '2px'
      }
    },
    '& .MuiInputLabel-root.Mui-focused': {
      color: 'primary.main'
    }
  }}
/>

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

      </ThemeProvider>




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
          setHotspotPlans={setHotspotPlans}
          setPlans={setPlans}
          
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
setHotspotPlans,
setPlans,
  
companyName, setCompanyName,selectedPlan,handlePlanSelect,
openPlanManager, setOpenPlanManager
 }) => {

const [openDeleteHotspotPlan, setOpenDeleteHotspotPlan] = useState(false);
const [openDeletePPPOEPlan, setOpenDeletePPPOEPlan] = useState(false);
  const [companyNameDelete, setCompanyNameDelete] = useState('');
  const [companyId, setCompanyId] = useState('');
  const [ppoePlanId, setPpoePlanId] = useState('');



const handleCloseDeletePPPOEPlan = () => {
  setOpenDeletePPPOEPlan(false);
}




const deletePPPOEPlan = async () => {
  try {
      const response = await fetch(`/api/pppoe_plans/${ppoePlanId}?company_name=${companyNameDelete}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',

        },
        body: JSON.stringify({
          company_name: companyNameDelete
        }),
      });

      if (response.ok) {
       setOpenDeletePPPOEPlan(false);
        toast.success('Pppoe plan deleted successfully');
        setPlans(plans.filter(plan => plan.id !== ppoePlanId))
        
      } else {
        toast.error('Failed to delete pppoe plan');

        setOpenDeletePPPOEPlan(false);
      }
    } catch (error) {
      
      toast.error('Failed to delete pppoe plan server error');
     setOpenDeletePPPOEPlan(false);
    }

}




const deleteHotspotPlan = async () => {
    try {
      const response = await fetch(`/api/hotspot_plans/${companyId}?company_name=${companyNameDelete}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',

        },
        body: JSON.stringify({
          company_name: companyNameDelete
        }),
      });

      if (response.ok) {
        setOpenDeleteHotspotPlan(false);
        toast.success('Hotspot plan deleted successfully');
        setHotspotPlans(hotspotPlans.filter(plan => plan.id !== companyId))
        
      } else {
        toast.error('Failed to delete hotspot plan');

        setOpenDeleteHotspotPlan(false);
      }
    } catch (error) {
      
      toast.error('Failed to delete hotspot plan,We’re having trouble completing this request');
      setOpenDeleteHotspotPlan(false);
    }
}




const handleCloseDeleteHotspotPlan = () => {
  setOpenDeleteHotspotPlan(false);
}


  const defaultMaterialTheme = createTheme({
    props: {
      MuiInputLabel: {
          shrink: true
       }
  },
    palette: {
    
      
      mode:  'light' ,
      primary: {
        light: '#757ce8',
        main: '#3f50b5',
        dark: '000000',
        contrastText: '#fff',
      },
      secondary: {
        light: '#ff7961',
        main: '#f44336',
        dark: '#ba000d',
        contrastText: '#000',
      },
  
    },
  
  });
  
  const [materialuitheme, setMaterialuiTheme] = 
  useState(createTheme(defaultMaterialTheme));


  if (plans.length === 0) {
    return (
      <ThemeProvider theme={materialuitheme}>

      <Paper sx={{ p: 3 }}>
        <Typography>No plans found</Typography>
      </Paper>

      </ThemeProvider>
    );
  }





  return (
    
    <>

<EditPlan companyName={companyName} setCompanyName={setCompanyName}
planType={planType} selectedPlan={selectedPlan} handlePlanSelect={handlePlanSelect}
open={openPlanManager} onClose={() => setOpenPlanManager(false)}
/>
<DeletePPPOEPlan openDeletePPPOEPlan={openDeletePPPOEPlan} 
handleCloseDeletePPPOEPlan={handleCloseDeletePPPOEPlan}
deletePPPOEPlan={deletePPPOEPlan}  
/>

        {planType === 'pppoe' ? (

<ThemeProvider theme={materialuitheme}>
           <MaterialTable
           title={<p className='text-black'>PPPoE Plans</p>}
           columns={[
            { title: 'Maximum Subscribers', field: 'maximum_pppoe_subscribers' },
            {title: 'Company Name', field: 'company_name'},
            // { title: 'Billing Cycle', field: 'billing_cycle' },
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
                   <IconButton color="primary">
                     <AddCircleIcon fontSize="large" />
                   </IconButton>
               ),
               tooltip: 'Add PPPOe Plan',
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

            onClick: (event, rowData) => {
              setOpenDeletePPPOEPlan(true)
              setCompanyNameDelete(rowData.company_name)
              setPpoePlanId(rowData.id)
            }
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

         </ThemeProvider>


        ) : 
        <>
        <DeleteHotspotPlan   handleCloseDeleteHotspotPlan={handleCloseDeleteHotspotPlan}
        openDeleteHotspotPlan={openDeleteHotspotPlan}
       deleteHotspotPlan={deleteHotspotPlan}
        />
        <ThemeProvider theme={materialuitheme}>
        <MaterialTable
        title="Hotspot Plans"
        columns={[
          { title: 'Maximum Hotspot Subscribers', field: 'hotspot_subscribers' },
            { title: 'Expiry Days', field: 'expiry_days' },
            {title: 'Company Name', field: 'company_name'},
            // { title: 'Billing Cycle', field: 'billing_cycle' },
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
                <IconButton color="primary">
                  <AddCircleIcon fontSize="large" />
                </IconButton>
            ),
            tooltip: 'Add Hotspot Plan',
            isFreeAction: true,
            // onClick: handleOpenAddDialog
          },
          {
            icon: () => <EditIcon color="primary" />,
            tooltip: 'Edit Hotspot Plan',
            // onClick: (event, rowData) => handleOpenEditDialog(rowData)
          },
          {
            icon: (event, rowData) => <DeleteIcon color="error" onClick={() =>
               setOpenDeleteHotspotPlan(true)} />,
            tooltip: 'Delete Hotspot Plan',

            onClick: (event, rowData) => {
              setOpenDeleteHotspotPlan(true)
              setCompanyNameDelete(rowData.company_name)
              setCompanyId(rowData.id)
            }
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
      />
      </ThemeProvider>
      </>
      }

      

   

</>
  );
};

export default PlanManager;