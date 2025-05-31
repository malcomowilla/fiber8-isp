import React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import Tooltip from "@mui/material/Tooltip";
import { motion } from "framer-motion";
import styled from "styled-components";
import SupportAgentIcon from "@mui/icons-material/SupportAgent"; // Import the SupportAgent icon
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import {useState, useEffect, useCallback, lazy, Suspense, } from 'react'
import toast, { Toaster } from 'react-hot-toast';
import UiLoader from '../uiloader/UiLoader'
import Backdrop from '../backdrop/Backdrop'


const SettingsNotification = lazy(() => import('../notification/SettingsNotification'))


const SupportSettings = () => {

    const [open, setOpen] = useState(false);
    // const navigate = useNavigate()
    const [openNotifactionSettings, setOpenSettings] = useState(false)
    const [ticketForm, setTicketForm] = useState({
        prefix: '',
        minimum_digits: '',

    })

    
    const {prefix, minimum_digits} = ticketForm

    const subdomain = window.location.hostname.split('.')[0]


    const handleChange = (e) => {
        const { type, name, checked, value } = e.target;

        // const captlalName = value.charAt(0).toUpperCase() + value.slice(1)
        const capitalizedName = value.toUpperCase()
        setTicketForm((prevFormData) => ({
    ...prevFormData,
    [name]: type === "checkbox" ? checked : capitalizedName,
  }));
    }




const fetchTicketSettings =useCallback(
  async() => {
    try {
        const response = await fetch('/api/ticket_settings', {
            method: 'GET',
            headers: {
                'X-Subdomain': subdomain,
            },
        })
        const newData = await response.json()
        if (response.ok) {
            setTicketForm({
                prefix: newData[0].prefix,
                minimum_digits: newData[0].minimum_digits
            })
        }else{


          toast.error(newData.error, {
            position: 'top-center',
            duration: 5000,
          })
            toast.error('failed to fetch ticket settings', {
                position: 'top-center',
                duration: 4000,
            })
        }
    } catch (error) {
        toast.error(
            'failed to fetch ticket settings server error',
            {
                position: 'top-center',
                duration: 4000,
            }
        )
    }
  },
  [],
)



useEffect(() => {
    fetchTicketSettings()
    
}, [fetchTicketSettings]);





const handleCreateTicketSettings = async(e) => {

e.preventDefault()
    try {

        setOpen(true);
        const response = await fetch('/api/ticket_settings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Subdomain': subdomain,
            },
            body: JSON.stringify({
            prefix, minimum_digits
            }),
        })
        const newData = await response.json()



        if (response.status === 402) {
          setTimeout(() => {
            window.location.href = '/license-expired';
           }, 1800);
          
        }

        if (response.ok) {
            toast.success('ticket settings saved successfully', {
                position: 'top-center',
                duration: 5000,
               
            })
            setOpenSettings(true)
            setOpen(false)
            setTicketForm({
                prefix: newData.prefix,
                minimum_digits: newData.minimum_digits
            })
        }else{
            toast.error('failed to save ticket settings', {
                duration: 3000,
                position: 'top-center',
            })
            setOpenSettings(false);
      setOpen(false);
        }
    } catch (error) {
        setOpenSettings(false);
      setOpen(false);
        toast.error(
            'failed to save ticket settings',
            {
                position: 'top-center',
                duration: 4000,
            }
        )
    }
}





  const Button = styled(motion.button)`
    margin-top: 30px;
    padding: 10px 26px;
    font-size: 0.9rem;
    color: white;
    background: black;
    border: none;
    border-radius: 25px;
    cursor: pointer;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

    &:hover {
      background: green;
    }
  `;

  // Animation for the SupportAgent icon
  const iconVariants = {
    hover: {
      scale: 1.2,
      rotate: [0, 10, -10, 0], // Wiggle effect
      transition: { duration: 0.5 },
    },
    tap: {
      scale: 0.9,
    },
  };

  const handleClose = () => {
    setOpen(false);
  };


  const handleCloseNotifaction = () => {
    setOpenSettings(false);
  };
  return (

    <>

<Toaster />

<Backdrop  handleClose={handleClose}  open={open}/>
<SettingsNotification open={openNotifactionSettings} handleClose={handleCloseNotifaction }/>
    <div>
      <form onSubmit={handleCreateTicketSettings}>
        <Accordion
          sx={{
            backgroundColor: "transparent",
            boxShadow: "none",
          }}
        >
          <AccordionSummary
            expandIcon={
              <ArrowDownwardIcon
                className="dark:text-white text-black"
                sx={{ transition: "transform 0.3s" }}
              />
            }
            aria-controls="panel1-content"
            id="panel1-header"
            sx={{
              backgroundColor: "rgba(0, 0, 0, 0.05)",
              borderRadius: "10px",
              color: "black",
            }}
          >
            <Typography variant="h6">
              <motion.div
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <motion.div
                  variants={iconVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  <SupportAgentIcon
                    sx={{ fontSize: "2rem", color: "#ff6f61" }}
                  />
                </motion.div>
                <p className="dark:text-white text-black roboto-condensed">
                  Support Tickets Settings
                </p>
              </motion.div>
            </Typography>
          </AccordionSummary>

          <AccordionDetails
            sx={{
              backgroundColor: "rgba(0, 0, 0, 0.05)",
              borderRadius: "10px",
              marginTop: "10px",
              padding: "20px",
            }}
          >
            <Typography variant="body1" sx={{ mb: 2 }}>
              <strong className='roboto-condensed-light'>What does this setting do?</strong>
              <br />
              <p className='roboto-condensed'>Configure system-wide settings for support tickets, including
              notifications, priorities, and workflows. </p>
            </Typography>




<TextField  
name='prefix'
onChange={handleChange}
helperText={
    <p className='dark:text-white text-black text-lg md:w-full md:text-sm  text-wrap w-[140px]'>Can be any letter example(FK, TQ, QM, M, A, B)</p>}
className='myTextField'
  sx={{
    width: '100%',
    mt:2,

    '& label.Mui-focused': {
      color: 'black',
      fontSize:'16px'
    },
    '& .MuiOutlinedInput-root': {
      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
        borderColor: "black",
        borderWidth: '3px'
      },
      '&.Mui-focused fieldset': {
        borderColor: 'black',
      }
    },
  }}
value={prefix} fullWidth  label='Prefix'    />




<TextField 
name='minimum_digits'
value={minimum_digits}
onChange={handleChange}
className='myTextField'
type='number'
sx={{
    width: '100%',
    mt:2,

    '& label.Mui-focused': {
      color: 'black',
      fontSize:'16px'
    },
    '& .MuiOutlinedInput-root': {
      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
        borderColor: "black",
        borderWidth: '3px'
      },
      '&.Mui-focused fieldset': {
        borderColor: 'black',
      }
    },
  }}
fullWidth
label='Minimum Digits'
helperText={
  <p className='dark:text-white text-black text-lg md:w-full md:text-sm  text-wrap w-[140px]'> 
    Minimum Digits(Zeros will be added to the front of the prefix, eg SUB001 for
        three digits)
     </p>  
}
/>
            {/* Interactive Update Button */}
            <Tooltip title="Update ticket settings system-wide">
              <Button
                type="submit"
                sx={{
                  marginTop: "20px",
                  padding: "10px 20px",
                  backgroundColor: "#ff6f61",
                  color: "white",
                  borderRadius: "25px",
                  "&:hover": {
                    backgroundColor: "#ff4a3d",
                  },
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                component={motion.button}
              >
                Update Settings
              </Button>
            </Tooltip>
          </AccordionDetails>
        </Accordion>
      </form>
    </div>

    </>
  );
};

export default SupportSettings;