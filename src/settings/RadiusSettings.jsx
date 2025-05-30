

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
import {useState, useEffect, useCallback, lazy, Suspense} from 'react'
import toast, { Toaster } from 'react-hot-toast';
import UiLoader from '../uiloader/UiLoader'
import Backdrop from '../backdrop/Backdrop'
import FreeRadiusLogo from "../../public/images/free_radius.svg";

import { IoGitNetwork } from "react-icons/io5";
import { CiUser } from "react-icons/ci";
import { TbLockPassword } from "react-icons/tb";
import { FaUserEdit } from "react-icons/fa";
import { RiLockPasswordLine } from "react-icons/ri";


const RadiusSettings = () => {

// const navigate = useNavigate()
    const [radiusSettings, setRadiusSettings] = useState({
        shortname: '',
        ipaddr: '',
        secret: '',
      })


      const {shortname, ipaddr, secret} = radiusSettings


      const onChange = (e) => {
        const { type, name, checked, value } = e.target;
        setRadiusSettings((prevFormData) => ({
    ...prevFormData,
    [name]:  value,
  }));
      }
    const iconVariants = {
        hover: {
          scale: 1.2,
          rotate: [0, 10, -10, 0], // Wiggle effect
          transition: { duration: 0.5 },
        },
        // tap: {
        //   scale: 0.9,
        // },
      };





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



const subdomain = window.location.hostname.split('.')[0]

const saveRadiusSettings = async(e) => {
    e.preventDefault()


    try {
        const response = await fetch('/api/radius_settings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Subdomain': subdomain,

            },
            body: JSON.stringify(radiusSettings),  //
        })

        const newData = await response.json()



  if (response.status === 402) {
    setTimeout(() => {
      window.location.href = '/license-expired';
     }, 1800);
    
  }

        if (response.ok) {
            toast.success('radius settings saved successfully', {
                position: "top-center",
                duration: 5000,
            })
            setRadiusSettings({
                shortname: newData.shortname,
                ipaddr: newData.ipaddr,
                secret: newData.secret,
              
            })
        } else {
           toast.error('failed to save radius settings', {
                position: "top-center",
                duration: 4000,
            })
        }
    } catch (error) {
        toast.error('failed to save radius settings server error', {
            position: "top-center",
            duration: 4000,
        })
    }
}


const getRadiusSettings = useCallback(
  async() => {
   
    
    try {
        const response = await fetch('/api/radius_settings', {
            method: 'GET',

            headers: {
                'X-Subdomain': subdomain,
            },
        })

        const newData = await response.json()
        if (response.ok) {
            setRadiusSettings({
                shortname: newData[0].shortname,
                ipaddr: newData[0].ipaddr,
                secret: newData[0].secret,
              
            })
        } else {
            toast.error('failed to fetch radius settings', {
                    position: "top-center",
                    duration: 4000,
            })
        }
    } catch (error) {
        console.log(error)
    }
  },
  [],
)


useEffect(() => {
    
    getRadiusSettings()
}, [getRadiusSettings]);

  return (
    <form onSubmit={saveRadiusSettings}>
        <Toaster />
        
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
                  {/* <SupportAgentIcon
                    sx={{ fontSize: "2rem", color: "#ff6f61" }}
                  /> */}

<img src={FreeRadiusLogo}  className='w-12 h-12' alt="FreeRADIUS Logo" />
                </motion.div>
                <p className="dark:text-white roboto-condensed text-black">
                Radius Settings
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
 <p className='roboto-condensed'> Configure RADIUS server settings for MikroTik, including user authentication, 
  rate limits, session timeouts, and burst limits. </p>
</Typography>




<TextField  
name='shortname'
value={shortname}
onChange={(e) => onChange(e)}

helperText={
    <p className='dark:text-white text-black text-lg md:w-full 
    md:text-sm  text-wrap w-[140px]'>(optional)</p>}
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
fullWidth  label='Radius Username' 

InputProps={{
    startAdornment: <CiUser className="mr-2 text-black" />,
  }}
/>




<TextField  
name='secret'
value={secret}
onChange={(e) => onChange(e)}

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
fullWidth  label='Radius Secret' 

InputProps={{
    startAdornment: <RiLockPasswordLine className="mr-2" />,
  }}
/>






<TextField 
name='ipaddr'
value={ipaddr}
onChange={(e) => onChange(e)}

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
fullWidth
label='ip adress'

InputProps={{
    startAdornment: <IoGitNetwork className="mr-2" />,
  }}

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
  )
}

export default RadiusSettings