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
import {useState, useEffect, useCallback, lazy,  } from 'react'
import toast, { Toaster } from 'react-hot-toast';
import Backdrop from '../backdrop/Backdrop'
import { useApplicationSettings } from './ApplicationSettings'


const SettingsNotification = lazy(() => import('../notification/SettingsNotification'))


const GoogleMapSetting = () => {

    const [open, setOpen] = useState(false);
    // const navigate = useNavigate()
    const [openNotifactionSettings, setOpenSettings] = useState(false)
    const {mapForm, setMapForm} = useApplicationSettings()
   

    
    const {api_key} = mapForm

    const subdomain = window.location.hostname.split('.')[0]


    const handleChange = (e) => {
        const { type, name, checked, value } = e.target;

        // const captlalName = value.charAt(0).toUpperCase() + value.slice(1)
        setMapForm((prevFormData) => ({
    ...prevFormData,
    [name]: type === "checkbox" ? checked : value,
  }));
    }




const fetchMapSettings =useCallback(
  async() => {
    try {
        const response = await fetch('/api/google_maps', {
            method: 'GET',
            headers: {
                'X-Subdomain': subdomain,
            },
        })
        const newData = await response.json()
        if (response.ok) {
            setMapForm({
                api_key: newData[0].api_key
            })
        }else{

if (response.status === 401) {
  toast.error(newData.error, {
    position: "top-center",
    duration: 4000,
  })
   setTimeout(() => {
          // navigate('/license-expired')
          window.location.href='/signin'
         }, 1900);
}

          toast.error(newData.error, {
            position: 'top-center',
            duration: 5000,
          })
            toast.error('failed to fetch map settings', {
                position: 'top-center',
                duration: 4000,
            })
        }
    } catch (error) {
        toast.error(
            'failed to fetch map settings server error',
            {
                position: 'top-center',
                duration: 4000,
            }
        )
    }
  },
  [subdomain],
)



useEffect(() => {
    fetchMapSettings()
    
}, [fetchMapSettings]);





const handleCreateMapSettings = async(e) => {

e.preventDefault()
    try {

        setOpen(true);
        const response = await fetch('/api/google_maps', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Subdomain': subdomain,
            },
            body: JSON.stringify({
                api_key: api_key
            }),
        })
        const newData = await response.json()



        if (response.status === 402) {
          setTimeout(() => {
            window.location.href = '/license-expired';
           }, 1800);
          
        }

        if (response.ok) {
            toast.success('map settings saved successfully', {
                position: 'top-center',
                duration: 5000,
               
            })
            setOpenSettings(true)
            setOpen(false)
            setMapForm({
                api_key: newData.api_key
            })
        }else{


        
if (response.status === 401) {
  toast.error(newData.error, {
    position: "top-center",
    duration: 4000,
  })
   setTimeout(() => {
          // navigate('/license-expired')
          window.location.href='/signin'
         }, 1900);
}
            toast.error('failed to save map settings', {
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
            'failed to save map settings',
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
      <form onSubmit={handleCreateMapSettings}>
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
                
                <div>
                    <img src="/images/google_maps.png" className='w-8 h-8 rounded-full' alt="" />
                </div>
                </motion.div>
                <p className="dark:text-white text-black roboto-condensed">
                  Map Settings
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
            




<TextField  
name='api_key'
onChange={handleChange}
helperText={
    <p className='dark:text-white text-black text-lg md:w-full md:text-sm  
    text-wrap w-[140px] roboto-condensed'>Google Map API Key</p>}
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
value={api_key} fullWidth  label='Google Map API Key'    />




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

export default GoogleMapSetting;


