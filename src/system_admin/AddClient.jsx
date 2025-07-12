
import { motion } from 'framer-motion';
import {
  TextField,
  Button,
  Box,
  Slide,
  IconButton,
  Tooltip,
 
} from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import RefreshIcon from '@mui/icons-material/Refresh';







import {
  Modal,
} from '@mui/material';
import 'react-toastify/dist/ReactToastify.css';



const AddClient = ({


    open,onClose, formData, 
    handleChange, hotspot_plans, plans,
    setFormData,  handleInvite,
    fetchingClients, setFetchingClients,
    loading, clients, setClients,
    errors


}) => {






const subdomain = window.location.hostname.split('.')[0];

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
    
    
  return (

    <Modal
    open={open}
    onClose={onClose}
    aria-labelledby="edit-client-modal"
    aria-describedby="edit-client-form"
  >
    <div className='flex justify-center mt-5'>
        <Box 
        
          sx={{
             gap: 4 ,
           
            maxWidth: '700px',
            width: '100%',
            padding: '24px',
            borderRadius: '12px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
            backgroundColor: 'background.paper',
          }}
        >
        <form onSubmit={handleInvite}>
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
                  // required
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
                  // required
                  sx={{ borderRadius: 2 }}
                />
                <TextField
                  label="Phone Number"
                  variant="outlined"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleChange}
                  error={!!errors.phone_number}
                  helperText={errors.phone_number}
                  // required
                  sx={{ borderRadius: 2 }}
                />

                {/* Plan Selection */}
               
               
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
                //   disabled={loading}
                >
                  Send Invitation
                </Button>




                <Button
                  variant="contained"
                  color="error"
                  onClick={onClose}
                //   disabled={loading}
                >
                  Close
                </Button>
              </Box>
            </motion.div>
          </Slide>
        </form>
      </Box>
    </div>


    </Modal>
  )
}

export default AddClient
