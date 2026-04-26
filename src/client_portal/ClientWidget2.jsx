import {Link, useNavigate} from 'react-router-dom'
import {useState, useEffect} from 'react'
import {useApplicationSettings} from '../settings/ApplicationSettings'
// import { encode } from 'open-location-code';
import { CiLogout } from "react-icons/ci";
// import CustomerDeleteLoginAlert from '../Alert/CustomerDeleteLoginAlert'
// import { Button,  } from "flowbite-react";
// import CustomerConfirmationAlert from '../Alert/CustomerConfirmationAlert'
// import CustomerConfirmAlertError from '../Alert/CustomerConfirmAlertError'
import { BiLogOut } from "react-icons/bi";
import { SiMoneygram } from "react-icons/si";
import { motion, AnimatePresence } from "framer-motion"
// import CustomerLogin from '../Alert/CustomerLogin'
import { BiMessageDots } from "react-icons/bi";
import CustomerWhatsapSupport from './CustomerWhatsapSupport'
import { LuTicketSlash } from "react-icons/lu";
import CustomerProfile from './CustomerProfile'
import { IoIosPerson } from "react-icons/io";
import { FaWifi } from "react-icons/fa";
import { IoStarSharp } from "react-icons/io5";
import { MdOutlineQuestionMark } from "react-icons/md";
import { Menu, MenuItem, IconButton, Tooltip } from '@mui/material';
import ContactSupportIcon from '@mui/icons-material/ContactSupport';
import HelpIcon from '@mui/icons-material/Help';





// openLoginCustomerSuccessfully,handleCloseLoginCustomerSuccessfully}

const ClientWidget = () => {
 const [activeSection, setActiveSection] = useState('dashboard');
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const navigate = useNavigate()

const [showProfile, setShowProfile] = useState(false);

         
        // const [open, setOpen] = useState(false);
        const [loading, setloading] = useState(false)
        const [openConfirmationAlert, setopenConfirmationAlert] = useState(false)
        const [openConfirmAlertError, setopenConfirmAlertError] = useState(false)

        const {companySettings,setcompanySettings} = useApplicationSettings()

        const {company_name, contact_info, email_info, logo_preview} = companySettings

        const handleCloseConfirmAlertError = (event, reason)=> {
          if (reason === 'clickaway') {
            return;
          }

          setopenConfirmAlertError(false)

        }



  const [anchorEl, setAnchorEl] = useState(null);

const open = Boolean(anchorEl);


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


const handleCloseConfirmationAlert = (event, reason)=> {
  if (reason === 'clickaway') {
    return;
  }

  setopenConfirmationAlert(false)
}









        // const handleClose = (event, reason) => {
        //   if (reason === 'clickaway') {
        //     return;
        //   }
        
        //   setOpen(false);
        // };




const confirmBag = async(e)=> {
  e.preventDefault()
  try {
    setloading(true)
    const response = await fetch('/api/confirm_bag',{
      method: 'POST',
      credentials: 'include',

      headers: {
        'Content-Type': 'application/json'
      },

    })
    if (response.ok) {
      setloading(false)
      setopenConfirmationAlert(true)
    } else {
      setloading(false)
      setopenConfirmAlertError(true)

    }
  } catch (error) {
    setloading(false)
    setopenConfirmAlertError(true)
  }
}




const subdomain = window.location.hostname.split('.')[0];

 const handleCustomerLogout = async () => {
    setIsLoggingOut(true);
    try {
      const response = await fetch('/api/customer-logout', {
        method: 'POST',
        headers: {
          'X-Subdomain': subdomain,
        }

      });

      if (response.ok) {
        // Redirect to login page after successful logout
        navigate('/client-login');
      } else {
        console.error('Logout failed');

        // You might want to show an error message here
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };


  return (


   <>

<div className="min-h-screen bg-gradient-to-b from-gray-50 to-white
flex justify-center items-center">
  <div className="bg-white shadow-sm px-4 py-3 flex justify-between
   items-center fixed top-0 w-full z-10">
     < IoIosPerson onClick={() => setShowProfile(true)}  className='w-9 h-9 cursor-pointer'  />
    <AnimatePresence mode="wait">
        {showProfile && (
          <CustomerProfile 
            key="customer-profile"
            onClose={() => setShowProfile(false)} 
          />
        )}
      </AnimatePresence>

    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={handleCustomerLogout}
      className="text-gray-600 hover:text-gray-900"
    >
      <BiLogOut size={40} />
    </motion.button>
  </div>





  <div className="pt-20 px-4 pb-6 max-w-lg mx-auto">
    <div className="grid grid-cols-2 gap-4 mb-8">



  <div className="p-6
   bg-white shadow-md rounded-lg mb-7">
  <h2 className="text-xl font-bold text-black">Wallet Balance</h2>
  <p className="text-2xl text-gray-500">00.00 ksh</p>
  {/* <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">Top Up</button> */}
</div>
      <Link to='/customer-ticket-status'>
        <motion.div
          whileTap={{ scale: 0.95 }}
          className="bg-white p-4 rounded-xl 
          shadow-sm border border-gray-100
           flex flex-col items-center gap-2"
        >

          
          <div className="flex flex-col items-center">
            <LuTicketSlash className="w-12 h-12 text-yellow-400" />
            <span className="text-2xl font-medium text-gray-700
            itim-regular">Support Ticket</span>
            
            <Link 
              // to="/customer-chat"
              className="mt-2 flex items-center gap-1 text-2xl text-green-600 
              hover:text-green-700 bg-green-50 px-3 py-1 rounded-full"
            >
              <Tooltip  title={<p className='text-xl'>Support</p>}>

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
              Contact Support
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
            </Link>
          </div>
        </motion.div>
      </Link>

      <Link to='/customer-payment'>
        <motion.div
          whileTap={{ scale: 0.95 }}
          className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center gap-2"
        >
          <FaWifi className="text-green-600 w-12 h-12" />
          <span className=" font-medium text-gray-700 text-2xl">Renew Package</span>
        </motion.div>
      </Link>



      {/* <CustomerWhatsapSupport /> */}


      <Link to='/garbage-collection-schedule'>
        <motion.div
          whileTap={{ scale: 0.95 }}
          className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center gap-2"
        >
          <div className='flex items-center gap-2'>
        <IoStarSharp  className='text-yellow-400'/>
        <IoStarSharp  className='text-yellow-400'/>
        <IoStarSharp  className='text-yellow-400'/>
        </div>
          <span className="text-xl font-medium
           text-gray-700">Customer Feedback</span>
        </motion.div>
      </Link>
    </div>

    {/* <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
      <h2 className="text-2xl font-semibold text-gray-900 
      mb-6 itim-regular">Confirm Plastic Bag</h2>
      
      <form onSubmit={confirmBag}>
        <motion.button
          whileTap={{ scale: 0.95 }}
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white py-3 rounded-xl font-medium flex items-center justify-center gap-2 
            disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span className='text-2xl'>Confirming...</span>
            </>
          ) : (
           <p className="itim-regular text-2xl">Confirm Received</p>
          )}
        </motion.button>
      </form>
    </div> */}

    <Link to='/customer-request'>
      <motion.div
        whileTap={{ scale: 0.95 }}
        className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex justify-between items-center"
      >
        <div>
          <h3 className="text-3xl font-semibold text-gray-900
          itim-regular">Upgrade?</h3>
          <p className="text-xl text-gray-600">Request a new package upgrade here</p>
        </div>
        <div className="text-green-600 p-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </motion.div>
    </Link>
  </div>
</div>
   </>
  )
}

export default ClientWidget
