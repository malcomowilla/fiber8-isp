
import React, { useState, useEffect } from 'react';
// import { inviteClient } from './api';
import { motion } from 'framer-motion';
import { 
  TextField, 
  Button, 
  Box, 
  Slide, 
  Backdrop,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  CircularProgress
} from '@mui/material';
import Lottie from 'react-lottie';
import LoadingAnimation from '../loader/loading_animation.json';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import RefreshIcon from '@mui/icons-material/Refresh';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import MaterialTable from "material-table";
import { IoPeople } from "react-icons/io5";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import DeleteClient from './DeleteClient'
import toaster, { Toaster } from 'react-hot-toast';



const InviteClient = () => {
  const [formData, setFormData] = useState({
    email: '',
    phoneNumber: '',
    userName: '',
    domainSubdomain: '',
    emailApiKey: '',
    senderEmail: '',
    smtpPassword: '',
    smtpHost: '',
    smtpUsername: ''

  });

  const [errors, setErrors] = useState({
    email: '',
    phoneNumber: '',
    userName: ''
  });

  const [loading, setLoading] = useState(false);
  const [openLoad, setOpenLoad] = useState(false);
  const [clients, setClients] = useState([]);
  const [fetchingClients, setFetchingClients] = useState(false);
  const [isOpenDelete, setIsOpenDelete] = useState(false)
const [row_data, setRowData] = useState({})
  const fetchClients = async () => {
    setFetchingClients(true);
    try {
      const response = await fetch('/api/get_all_clients');
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

  useEffect(() => {
    fetchClients();
  }, []);

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      email: '',
      phoneNumber: '',
      userName: ''
    };

    // Username validation
    if (!formData.userName.trim()) {
      newErrors.userName = 'Username is required';
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
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
      isValid = false;
    } else if (!phoneRegex.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Please enter a valid phone number';
      isValid = false;
    }

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
    
    if (!validateForm()) {
      toast.error('Please fill in all required fields correctly');
      return;
    }

    setLoading(true);
    setOpenLoad(true);

    try {
      // const response = await inviteClient({
      //   email: formData.email,
      //   phone_number: formData.phoneNumber,
      //   user_name: formData.userName,
      //   company_domain_or_subdomain: formData.domainSubdomain,
      // });

      const response = await fetch('/api/invite_client', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: formData.email,
          phone_number: formData.phoneNumber,
          user_name: formData.userName,
          company_domain_or_subdomain: formData.domainSubdomain,
          email_api_key: formData.emailApiKey,
          sender_email: formData.senderEmail,
          smtp_password: formData.smtpPassword,
          smtp_host: formData.smtpHost,
          smtp_port: formData.smtpPort,
          smtp_username: formData.smtpUsername,

        })
      });

      if (response.ok) {
        // toast.success('Client successfully created');
        toaster.success('Client added successfully', {
          duration: 5000,
          icon: '✅'
        })
        setFormData({
          email: '',
          phoneNumber: '',
          userName: '',
          domainSubdomain: ''
        });
        // Refresh client list after successful invitation
        fetchClients();
      } else {
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


  const flattenedData = clients && clients.flatMap(client =>
    client.admins.map(admin => ({
      ...admin,
      subdomain: client.subdomain, // Include subdomain in each admin record
    }))
);
  // const flattenedData =  clients.map(admin => ({
  //   ...admin,
  //   subdomain: admin.subdomain, // Include subdomain in each admin record
  // }))

  const handleRowClick = (event, rowData) => {
    setRowData(rowData);
    console.log('rowData=>', rowData)
   
  
  };
  


  const DeleteButton = ({id}) => (
    <img src="/images/logo/6217227_bin_fly_garbage_trash_icon.png"  onClick={()=> setIsOpenDelete(true)}  className='w-8 h-8 ' alt="delete" />
  )
  

const deleteClient = async (id)=> {

  try {
    setLoading(true)

const response = await fetch(`/api/delete_client/${id}`, {
  method: 'DELETE'
  })
  
  if (response.ok) {
    setIsOpenDelete(false)
    setClients(flattenedData.filter((client)=> client.id !==  id))
   
    setLoading(false)
    toaster.success('Client deleted successfully', {
      duration: 5000,
      icon: '✅'
    })

  
  } else {
    setIsOpenDelete(false)
    console.log('failed to delete')
    setLoading(false)
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
    })


    
  }
  } catch (error) {
    console.log(error)
    setIsOpenDelete(false)
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
    })
    setLoading(false)

  }
  
}

  return (
    <>
    <Toaster />
<DeleteClient id={row_data.id}   loading={loading}  deleteClient={deleteClient}  
 isOpenDelete={isOpenDelete} 
setIsOpenDelete={setIsOpenDelete} />

      <ToastContainer position='top-center' autoClose={3000} hideProgressBar={false} closeOnClick draggable pauseOnHover />
      {loading && (
        <Backdrop open={openLoad} sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
          <Lottie className='relative z-50' options={defaultOptions} height={400} width={400} />
        </Backdrop>
      )}
      
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <form onSubmit={handleInvite}>
          <Slide direction="up" in={true} mountOnEnter unmountOnExit>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className='f'
            >
              <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 3
              }}>
                <h2>Invite New Client</h2>
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
                flexDirection: 'column',
                gap: 2,
                justifyContent: 'center',
                justifyItems: 'center',
                '& label.Mui-focused': { color: 'gray' },
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
                  name="userName"
                  value={formData.userName}
                  onChange={handleChange}
                  error={!!errors.userName}
                  helperText={errors.userName}
                  required
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
                  required
                  sx={{ borderRadius: 2 }}
                />
                <TextField
                  label="Phone Number"
                  variant="outlined"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  error={!!errors.phoneNumber}
                  helperText={errors.phoneNumber}
                  required
                  sx={{ borderRadius: 2 }}
                />




<TextField
                  label="email api key"
                  variant="outlined"
                  name="emailApiKey"
                  value={formData.emailApiKey}
                  onChange={handleChange}
                  error={!!errors.emailApiKey}
                  helperText={errors.emailApiKey}
                  sx={{ borderRadius: 2 }}
                />




<TextField
value={formData.senderEmail}
onChange={handleChange}
error={!!errors.senderEmail}
helperText={errors.senderEmail}
name='senderEmail'
                  label="sender email"
                  variant="outlined"
                
                  sx={{ borderRadius: 2 }}
                />




<TextField

                  label="smtp password"
                  name="smtpPassword"
                  value={formData.smtpPassword}
                  onChange={handleChange}
                  error={!!errors.smtpPassword}
                  helperText={errors.smtpPassword}
                
                  sx={{ borderRadius: 2 }}
                />





<TextField
value={formData.smtpHost}
onChange={handleChange}
error={!!errors.smtpHost}
helperText={errors.smtpHost}
name='smtpHost'

                  label="smtp host"
                  variant="outlined"
                
                  sx={{ borderRadius: 2 }}
                />



<TextField
                  label="smtp username"
                  name="smtpUsername"
                  value={formData.smtpUsername}
                  onChange={handleChange}
                  error={!!errors.smtpUsername}
                  helperText={errors.smtpUsername}
                  variant="outlined"
                
                  sx={{ borderRadius: 2 }}
                />



<TextField
                  label="subdomain"
                  name="domainSubdomain"
                  value={formData.domainSubdomain}
                  onChange={handleChange}
                  error={!!errors.domainSubdomain}
                  helperText={errors.domainSubdomain}

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
        </form>

        <MaterialTable
        onRowClick={handleRowClick}
        columns={[
          { title: "SubDomain", field: "subdomain" },
          { title: "User Name", field: "user_name" },
          { title: "Email", field: "email" },
          { title: "Role", field: "role" },
          { title: "Phone Number", field: "phone_number" },
          { title: "Locked Account", field: "locked_account" },
         
          {
            title: "Action",
            field: "Action",
            render: (rowData) => 
              <>
                <Box sx={{
                  display: 'flex',
                  gap: 2
                }}>
  
                <DeleteButton   id={rowData.id}/>
                </Box>
              
  
                
                </>
          }
        ]}
        data={flattenedData}
        title="Clients"
        options={{
          paging: true,
          pageSizeOptions: [5, 10, 20, 25, 50, 100],
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



