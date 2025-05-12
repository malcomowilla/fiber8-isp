import React, { useState, useEffect, useCallback } from 'react';
import {
  TextField,
  Button,
  Box,
  IconButton,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Modal,
  Typography,
} from '@mui/material';
import { motion } from 'framer-motion';
import { Email, Phone, Person, Business, Lock, Edit, Close } from '@mui/icons-material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EditClient = ({ open, onClose, handleChange, formData, hotspot_plans, plans,
    currentPlan, setCurrentPlan, handleInvite
 }) => {
 
    // current_plan
  const [loading, setLoading] = useState(false);



  

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="edit-client-modal"
      aria-describedby="edit-client-form"
    >
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
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
          {/* Close Button */}
          <IconButton
            onClick={onClose}
            sx={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              color: 'text.secondary',
            }}
          >
            <Close />
          </IconButton>

          {/* Form Header */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              marginBottom: '24px',
            }}
          >
            <Edit fontSize="large" color="success" />
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              style={{ fontSize: '24px', fontWeight: 'bold', color: 'green' }}
            >
              Edit Client
            </motion.h1>
          </Box>

          {/* Form Fields */}
          <form  onSubmit={(e)=> handleInvite(e)}>
            <TextField
            className='myTextField'
              fullWidth
              label="Name"
              name="username"
              value={formData.username}
              onChange={handleChange}
              margin="normal"
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Person color="action" />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
               className='myTextField'
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              margin="normal"
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email color="action" />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
             className='myTextField'
              fullWidth
              label="Phone"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleChange}
              margin="normal"
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Phone color="action" />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              label="Company"
              name="company"
              className='myTextField'
              value={formData.company}
              onChange={handleChange}
              margin="normal"
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Business color="action" />
                  </InputAdornment>
                ),
              }}
            />

            {/* <FormControl fullWidth margin="normal" variant="outlined">
              <InputLabel>Plan</InputLabel>
              <Select
                name="plan"
                value={formData.plan}
                onChange={handleChange}
                label="Plan"
              >
                {plans.map((plan) => (
                      <MenuItem 
                      sx={{
                        color: 'black',
                        fontSize: '16px'
                      }}
                      key={plan.id} value={plan.name}>
                        {plan.name}
                      </MenuItem>
                    ))}
              </Select>
            </FormControl> */}





{/* 

            <FormControl fullWidth margin="normal" variant="outlined">
              <InputLabel>Hotspot Plan</InputLabel>
              <Select
                name="hotspot_plan"
                value={formData.hotspot_plan}
                onChange={handleChange}
                label="Plan"
              >
                {hotspot_plans.map((plan) => (
                      <MenuItem 
                      sx={{
                        color: 'black',
                        fontSize: '16px'
                      }}
                      key={plan.id} value={plan.name}>
                        {plan.name}
                      </MenuItem>
                    ))}
              </Select>
            </FormControl> */}

            <TextField
              fullWidth
              label="Password"
              name="password"
              type="password"
              className='myTextField'
              value={formData.password}
              onChange={handleChange}
              margin="normal"
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock color="action" />
                  </InputAdornment>
                ),
              }}
            />

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{ marginTop: '24px' }}
            >
              <Button
                fullWidth
                type="submit"
                variant="contained"
                color="success"
                size="large"
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} /> : null}
              >
                {loading ? 'Updating...' : 'Update Client'}
              </Button>
            </motion.div>
          </form>
        </Box>
      </motion.div>
    </Modal>
  );
};

export default EditClient;