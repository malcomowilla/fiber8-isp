
import { FaRegBuilding } from "react-icons/fa";
import {
  TextField,
  Box,
  
  Modal,
  Autocomplete

} from '@mui/material';

import 'react-toastify/dist/ReactToastify.css';




const EditPlan = ({companyName, setCompanyName, planType, selectedPlan, handlePlanSelect,
    open, onClose
}) => {

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


      const getPredefinedOptions = () => {
        return (planType === 'pppoe' ? PREDEFINED_PPPOE_PLANS : PREDEFINED_HOTSPOT_PLANS)
          .map(plan => ({
            label:  `${plan.name} ${plan.maximum_pppoe_subscribers || plan.hotspot_subscribers} ${planType === 'pppoe' ?  'PPPoE Subscribers' : 'Hotspot Subscribers'}/${plan.expiry_days || 30} Days`,
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

    const predefinedOptions = getPredefinedOptions();

 

  return (

      <Modal
    open={open}
    onClose={onClose}
    aria-labelledby="edit-client-modal"
    aria-describedby="edit-client-form"
  >
    <div className='flex justify-center mt-10'>
    <Box
          sx={{
            maxWidth: '500px',
            width: '100%',
            padding: '24px',
            borderRadius: '12px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
            backgroundColor: 'background.paper',
            position: 'relative',
          }}
        >
        <TextField 
          InputProps={{
            startAdornment: <FaRegBuilding className="mr-2" />,
          }}
          className='myTextField' sx={{
            borderRadius: 2,
            mt: 6,
          }} label="Company Name" value={companyName} onChange={(e) => setCompanyName(e.target.value)} 
          fullWidth  />




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
                sx={{ mt: 2 }}
              />
            )}
          />
          </Box>
    </div>

    </Modal>
  )
}

export default EditPlan
