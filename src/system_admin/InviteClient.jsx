import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  TextField,
  Button,
  Box,
  Slide,
  Backdrop,
  IconButton,
  Tooltip,
  CircularProgress,
  Select,
  MenuItem,
  InputLabel,
  FormControl
} from '@mui/material';
import Lottie from 'react-lottie';
import LoadingAnimation from '../loader/loading_animation.json';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import RefreshIcon from '@mui/icons-material/Refresh';
import MaterialTable from "material-table";
import toaster,{ Toaster } from 'react-hot-toast';
import DeleteClient from './DeleteClient';
import DeleteIcon from '@mui/icons-material/Delete';
import  EditClient from './EditClient'
import EditIcon from '@mui/icons-material/Edit';
import AddClient from './AddClient';
import { FaRegBuilding } from "react-icons/fa";

import AddCircleIcon from '@mui/icons-material/AddCircle';





const InviteClient = () => {
  const [formData, setFormData] = useState({
    email: '',
    phone_number: '',
    userName: '',
    domainSubdomain: '',
    emailApiKey: '',
    senderEmail: '',
    smtpPassword: '',
    smtpHost: '',
    smtpUsername: '',
    plan: '' ,// Add planId to formData
    hotspot_plan: '',
    password: '',
    company_name: '',
  });

  const [errors, setErrors] = useState({
    email: '',
    phone_number: '',
    username: '',
    plan: '',
    company_name: ''
  });

  const [loading, setLoading] = useState(false);
  const [openLoad, setOpenLoad] = useState(false);
  const [clients, setClients] = useState([]);
  const [fetchingClients, setFetchingClients] = useState(false);
  const [isOpenDelete, setIsOpenDelete] = useState(false);
  const [row_data, setRowData] = useState({});
  const [plans, setPlans] = useState([]); // State to store plans
  const [hotspot_plans, setHotspotPlans] = useState([]); // State to store hotspot plans
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentHotspotPlan, setCurrentHotspotPlan] = useState(null);
  const [addClient, setAddClient] = useState(false);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);
  const handleCloseAddClient = () => setAddClient(false);


  const subdomain = window.location.hostname.split('.')[0];

const handleAddClient = () => setAddClient(true);
  // hotspot_plans
  // Fetch plans from the backend
  const fetchPlans = async () => {
    try {
      const response = await fetch('/api/pp_poe_plans', {
        method: 'GET',
        // headers: {
        //   'X-Subdomain': subdomain,
        // },
      });
      if (response.ok) {
        const data = await response.json();
        setPlans(data);
      } else {
        toast.error('Failed to fetch plans');
      }
    } catch (error) {
      console.error('Error fetching plans:', error);
      toast.error('Error loading plans');
    }
  };

  useEffect(() => {
    fetchPlans(); // Fetch plans when the component mounts
    fetchClients();
  }, []);









  const fetchHotspotPlans = async () => {
    try {
      const response = await fetch('/api/hotspot_plans', {
        method: 'GET',
        // headers: {
        //   'X-Subdomain': subdomain,
        // },
      });
      if (response.ok) {
        const data = await response.json();
        setHotspotPlans(data);
      } else {
        toast.error('Failed to fetch plans');
      }
    } catch (error) {
      console.error('Error fetching plans:', error);
      toast.error('Error loading plans');
    }
  };

  useEffect(() => {
    fetchHotspotPlans(); // Fetch plans when the component mounts
  }, []);

  const fetchClients = async () => {
    setFetchingClients(true);
    try {
      const response = await fetch('/api/get_all_clients', {
        method: 'GET',
        headers: {
          'X-Subdomain': subdomain,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setClients(data);
      } else {
        toast.error('Failed to fetch clients');
      }
    } catch (error) {
      console.error('Error fetching clients:', error);
      toast.error('Error loading clients');
    } finally {
      setFetchingClients(false);
    }
  };


  const [currentPlan, setCurrentPlan] = useState(null);


  const flattenedData = clients && clients.flatMap(client =>
    client.users.map(admin => ({
      ...admin,
      subdomain: client.subdomain,
      plan: currentPlan,
      hotspot_plan: currentHotspotPlan
    }))
  );

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      email: '',
      phone_number: '',
      username: '',
      plan: ''
    };

    // Username validation
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
      isValid = false;
    }


    if (!formData.username.trim()) {
      newErrors.company_name = 'Company Name is required';
      isValid = false;
    }


    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
      isValid = false;
    }

    // Phone number validation
    const phoneRegex = /^\+?[\d\s-]{10,}$/;
    if (!formData.phone_number.trim()) {
      newErrors.phone_number = 'Phone number is required';
      isValid = false;
    } else if (!phoneRegex.test(formData.phone_number)) {
      newErrors.phone_number = 'Please enter a valid phone number';
      isValid = false;
    }

    // Plan validation
    // if (!formData.plan) {
    //   newErrors.plan = 'Plan is required';
    //   isValid = false;
    // }

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));




    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleInvite = async (e) => {
    e.preventDefault();


    if (!formData.id) {
      if (!validateForm()) {
        toast.error('Please fill in all required fields correctly');
        return;
      }
    }
   

    setLoading(true);
    setOpenLoad(true);

    try {
      const method = formData.id ? 'PATCH' : 'POST';
      const url = formData.id ? `/api/update_client/${formData.id}` : '/api/invite_client_super_admins';
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'X-Subdomain': subdomain,
        },
        body: JSON.stringify({
          ...formData,
          plan: formData.plan // Include the selected plan ID
        }),
      });

      const newData = await response.json();
      if (response.ok) {
        setAddClient(false)
        if (formData.id) {
          handleCloseModal()
          toaster.success('Client updated successfully', {
            duration: 5000,
            icon: '✅'
          });
  
          setClients((prevClients) =>
            prevClients.map((client) => ({
              ...client,
              users: client.users.map((user) =>
                user.id === formData.id ? newData : user
              ),
            }))
          );
        } else {
          setAddClient(false)
          toaster.success('Client added successfully', {
            duration: 5000,
            icon: '✅'
          });
  
          fetchClients();
        }
        setAddClient(false)
        setFormData({
          email: '',
          phone_number: '',
          user_name: '',
          company_name: '',
          domainSubdomain: '',
          emailApiKey: '',
          senderEmail: '',
          smtpPassword: '',
          password: '',
          smtpHost: '',
          smtpUsername: '',
          plan: '' // Reset planId
        });
        
      } else {
        setAddClient(false)
        toaster.error('Something went wrong, please try again', {
          duration: 5000,
          position: 'top-center',
          style: {
            background: 'linear-gradient(135deg, #FF0000, #36A2EA)',
            color: '#fff',
            borderRadius: '5px',
            padding: '10px',
            boxShadow: '0 2px 10px 0 rgba(0, 0, 0, 0.1)',
          },
        });
      }
    } catch (error) {
      console.error('Error inviting client:', error);
      toaster.error('Something went wrong, please try again', {
        duration: 5000,
        position: 'top-center',
        style: {
          background: 'linear-gradient(135deg, #FF0000, #36A2EA)',
          color: '#fff',
          borderRadius: '5px',
          padding: '10px',
          boxShadow: '0 2px 10px 0 rgba(0, 0, 0, 0.1)',
        },
      });
    } finally {
      setLoading(false);
      setOpenLoad(false);
    }
  };

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: LoadingAnimation,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };


  const handleRowClick = (event, rowData) => {
    setFormData(rowData);

    console.log('rowData=>', rowData);
  };

  

  const deleteClient = async (id) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/delete_client/${id}`, {
        method: 'DELETE',
        headers: {
          'X-Subdomain': subdomain,
        },
      });
      if (response.ok) {
        setIsOpenDelete(false);
        setClients(flattenedData.filter((client) => client.id !== id));
        setLoading(false);
        toaster.success('Client deleted successfully', {
          duration: 5000,
          icon: '✅'
        });
      } else {
        setIsOpenDelete(false);
        console.log('failed to delete');
        setLoading(false);
        toaster.error('Failed to delete client', {
          duration: 5000,
          position: 'top-center',
          style: {
            background: 'linear-gradient(135deg, #FF0000, #36A2EA)',
            color: '#fff',
            borderRadius: '5px',
            padding: '10px',
            boxShadow: '0 2px 10px 0 rgba(0, 0, 0, 0.1)',
          },
        });
      }
    } catch (error) {
      console.log(error);
      setIsOpenDelete(false);
      toaster.error('Failed to delete client', {
        duration: 5000,
        position: 'top-center',
        style: {
          background: 'linear-gradient(135deg, #FF0000, #36A2EA)',
          color: '#fff',
          borderRadius: '5px',
          padding: '10px',
          boxShadow: '0 2px 10px 0 rgba(0, 0, 0, 0.1)',
        },
      });
      setLoading(false);
    }
  };


// current_hotspot_plan
 
// setCurrentHotspotPlan
const getCurreentHotspotPlan = useCallback(
  async() => {
    
    try {
      const response = await fetch('/api/current_hotspot_plan', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-Subdomain': subdomain,
        }
      });
      const data = await response.json();
     

      if (response.ok) {
        setCurrentHotspotPlan(data.hotspot_plans);
          console.log('current plan', data.current_hotspot_plan);
      } else {
          console.log('Error fetching current plan');
      }
  } catch (error) {
      console.log('Error fetching current plan');
  }
  },
  
  [],
)


useEffect(() => {
  
  getCurreentHotspotPlan();
 
}, [getCurreentHotspotPlan]);

const getCurrentPlan = useCallback(
  async() => {
    
    try {
        const response = await fetch('/api/current_plan', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'X-Subdomain': subdomain,
          }
        });
        const data = await response.json();
       

        if (response.ok) {
            setCurrentPlan(data.ppoe_plans);
            console.log('current plan', data.current_plan);
        } else {
            console.log('Error fetching current plan');
        }
    } catch (error) {
        console.log('Error fetching current plan');
    }
  },
  [],
)


useEffect(() => {
    getCurrentPlan()
}, [getCurrentPlan]);

  const DeleteButton = ({ id }) => (
    <IconButton style={{ color: '#8B0000' }} >
      <DeleteIcon />
    </IconButton>
  );

  const EditButton = ({rowData}) => (
    <IconButton     style={{color: 'green'}}  onClick={() => handleOpenModal()} >
    <EditIcon />
  </IconButton>
      );
  return (
    <>
<AddClient open={addClient} onClose={handleCloseAddClient} currentPlan={currentPlan} formData={formData} 
    handleChange={handleChange} hotspot_plans={hotspot_plans} plans={plans}
    setFormData={setFormData}  handleInvite={handleInvite}
    fetchingClients={fetchingClients} setFetchingClients={setFetchingClients}
    loading={loading} clients={clients} setClients={setClients} errors={errors}
    />


    <EditClient open={isModalOpen} onClose={handleCloseModal} currentPlan={currentPlan} formData={formData} 
    handleChange={handleChange} hotspot_plans={hotspot_plans} plans={plans}
    setFormData={setFormData}  handleInvite={handleInvite}/>


      <Toaster />
      <DeleteClient
        id={row_data.id}
        loading={loading}
        deleteClient={deleteClient}
        isOpenDelete={isOpenDelete}
        setIsOpenDelete={setIsOpenDelete}
      />
      <ToastContainer position='top-center' autoClose={3000} hideProgressBar={false} closeOnClick draggable pauseOnHover />
      {loading && (
        <Backdrop open={openLoad} sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
          <Lottie className='relative z-50' options={defaultOptions} height={400} width={400} />
        </Backdrop>
      )}

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {/* <form onSubmit={handleInvite}>
          <Slide direction="up" in={true} mountOnEnter unmountOnExit>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className='f text-black'
            >
              <Box sx={{
                display: 'flex',
                color: 'black',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 3
              }}>
                <h2 className='text-black'>Invite New Client</h2>
                <Tooltip title="Refresh client list">
                  <IconButton
                    onClick={fetchClients}
                    disabled={fetchingClients}
                    sx={{ color: 'green' }}
                  >
                    <RefreshIcon />
                  </IconButton>
                </Tooltip>
              </Box>

              <Box sx={{
                display: 'flex',
                color: 'black',
                flexDirection: 'column',
                gap: 2,
                justifyContent: 'center',
                justifyItems: 'center',
                '& label.Mui-focused': { color: 'black' },
                '& .MuiOutlinedInput-root': {
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "black",
                    borderWidth: '3px'
                  }
                }
              }} className='myTextField'>
                <TextField
                  label="User Name"
                  variant="outlined"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  error={!!errors.username}
                  helperText={errors.username}
                  sx={{ borderRadius: 2 }}
                />
                <TextField
                  label="Client Email"
                  variant="outlined"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  error={!!errors.email}
                  helperText={errors.email}
                  sx={{ borderRadius: 2 }}
                />
                <TextField
                  label="Phone Number"
                  variant="outlined"
                  name="phoneNumber"
                  value={formData.phone_number}
                  onChange={handleChange}
                  error={!!errors.phone_number}
                  helperText={errors.phone_number}
                  sx={{ borderRadius: 2 }}
                />

               
               
                <TextField
                  label="Company Name"
                  name="company_name"
                  value={formData.company_name}
                  onChange={handleChange}
                  error={!!errors.company_name}
                  helperText={errors.company_name}
                  sx={{ borderRadius: 2 }}
                
                />


<TextField
                  label="Client Password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  error={!!errors.password}
                  helperText={errors.password}
                  sx={{ borderRadius: 2 }}
                
                />



                <Button
                  type='submit'
                  variant="contained"
                  color="success"
                  disabled={loading}
                >
                  Send Invitation
                </Button>
              </Box>
            </motion.div>
          </Slide>
        </form> */}




        

        <MaterialTable
          onRowClick={handleRowClick}
          actions={[
            {
              icon: () => (
                <Tooltip title="Add Client">
                  <IconButton color="primary">
                    <AddCircleIcon fontSize="large" onClick={() => handleAddClient()} />
                  </IconButton>
                </Tooltip>
              ),
              tooltip: 'Add Client',
              isFreeAction: true,
              // onClick: handleOpenAddDialog
            },
         
          ]}

          
          columns={[
            { title: "Company Name", field: "subdomain" },
            { title: "User Name", field: "username" },
            { title: "Email", field: "email" },
            // { title: "Plan", field: "plan" },
            // { title: "Hotspot Plan", field: "hotspot_plan" },
            { title: "Role", field: "role" },
            { title: "Phone Number", field: "phone_number" },
            { title: "Locked Account", field: "locked_account" },
            {title: 'Action', field:'Action',

              render: (rowData) =>  

                
                 <>
                  
                   <DeleteButton  id={rowData.id} />
                   <EditButton  />
                  
                   </>
            
            }
          ]}

          
          data={flattenedData}
          title="Clients"
          options={{
            paging: true,
            pageSizeOptions: [5, 10, 20],
            pageSize: 10,
            search: false,
            exportButton: true,
            headerStyle: {
              fontFamily: 'bold',
              textTransform: 'uppercase'
            },
          }}
        />
      </Box>
    </>
  );
};

export default InviteClient;