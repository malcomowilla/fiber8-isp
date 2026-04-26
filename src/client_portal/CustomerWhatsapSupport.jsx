import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import Shepherd from 'shepherd.js';
import 'shepherd.js/dist/css/shepherd.css';
import { useApplicationSettings } from '../settings/ApplicationSettings';
import { Menu, MenuItem, IconButton, Tooltip } from '@mui/material';
import HelpIcon from '@mui/icons-material/Help';
import LiveHelpIcon from '@mui/icons-material/LiveHelp';
import TourIcon from '@mui/icons-material/Tour';
import ContactSupportIcon from '@mui/icons-material/ContactSupport';
// import { useAuth } from '../settings/AuthSettings';

const CustomerWhatsapSupport = () => {
  const location = useLocation();
  const { companySettings, setcompanySettings, currentUser,
    customerProfileData
   } = useApplicationSettings();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleGetCompanySettings = useCallback(
    async () => {
      try {
        const response = await fetch('/api/get_company_settings', {
        })
        const newData = await response.json()
        if (response.ok) {
          // setcompanySettings(newData)
          const { contact_info, company_name, email_info, logo_url } = newData
          setcompanySettings((prevData) => ({ ...prevData, contact_info, company_name, email_info, logo_preview: logo_url }))
          console.log('company settings fetched', newData)
        } else {
          console.log('failed to fetch company settings')
        }
      } catch (error) {
        if (error.name === 'AbortError') {
          console.log('Fetch aborted')
        } else {
          console.log("error fetching company settings", error)
        }
      }
    },
    [],
  )

  useEffect(() => {
    handleGetCompanySettings()
    return () => {
      // This cleanup function runs when component unmounts
    }
  }, [handleGetCompanySettings])

  const { company_name } = companySettings
 

  

    // location.pathname.includes('/dashboard')
    
  


  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };


  const handleContactSupport = () => {
    handleClose();
    // WhatsApp click-to-chat link with your support number
    // Format: https://wa.me/[country_code][phone_number]
    window.open(`https://wa.me/254791568852?text=Hi,%20I%20need%20assistance%20with%20%20an issue`, '_blank');
  };

  const handleViewDocs = () => {
    handleClose();
    window.open('/docs', '_blank');
  };

  return customerProfileData ? (
    <>
      <Tooltip title={<p className='text-xl'>Help & Resources</p>}>
        <IconButton
          onClick={handleClick}
          className="help-button"
          sx={{
            // position: 'fixed',
            // bottom: '20px',
            // right: '20px',
            backgroundColor: 'green',
            color: 'white',
            '&:hover': {
              backgroundColor: 'darkgreen',
            },
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            zIndex: 1000
          }}
        >
          <HelpIcon />
        </IconButton>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
      >
       
      
        <MenuItem onClick={handleContactSupport}>
          <ContactSupportIcon sx={{ mr: 1, 
            fontSize: 55,
           }} />
          Contact Customer Support via WhatsApp
        </MenuItem>
      </Menu>
    </>
  ) : null;
};

export default CustomerWhatsapSupport;
