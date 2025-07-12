import { motion } from 'framer-motion'
import { FaWifi,} from 'react-icons/fa'
import { FaPhone } from "react-icons/fa6";
import toast, { Toaster } from 'react-hot-toast';
import { useEffect, useState, useCallback } from 'react';
import { useApplicationSettings } from '../settings/ApplicationSettings';
import { useNavigate, useLocation } from 'react-router-dom';



const HotspotPage = () => {
 const [packages, setPackages] = useState([])
 const [seeForm, setSeeForm] = useState(false)
 const [seePackages, setSeePackages] = useState(true)
 const [seeInstructions, setSeeInstructions] = useState(true)

const {companySettings, setCompanySettings} = useApplicationSettings()

 const {company_name, contact_info, email_info, logo_preview} = companySettings


 const navigate = useNavigate();
 const location = useLocation();
 const selectedTemplate = location.state?.template;

 // Default template if none is selected
 const template = selectedTemplate || {
   background: 'bg-gradient-to-r from-blue-500 to-teal-500',
   iconColor: 'text-teal-200',
   buttonColor: 'bg-teal-500',
 };


 const subdomain = window.location.hostname.split('.')[0]

 const handleGetCompanySettings = useCallback(
  async() => {
    try {
      const response = await fetch('/api/allow_get_company_settings', {
        headers: {
          'X-Subdomain': subdomain,
        },
      })
      const newData = await response.json()
      if (response.ok) {
        // setcompanySettings(newData)
        const { contact_info, company_name, email_info, logo_url,
          customer_support_phone_number,agent_email ,customer_support_email
         } = newData
        setCompanySettings((prevData)=> ({...prevData, 
          contact_info, company_name, email_info,
          customer_support_phone_number,agent_email ,customer_support_email,
        
          logo_preview: logo_url
        }))

        console.log('company settings fetched', newData)
      }else{
        console.log('failed to fetch company settings')
      }
    } catch (error) {
      toast.error('internal servere error  while fetching company settings')
    
    }
  },
  [setCompanySettings],
)

useEffect(() => {
  
  handleGetCompanySettings()
  
}, [handleGetCompanySettings])









    // const packages = [
    //     { name: 'Basic Package', speed: '5 Mbps', data: '10 GB', price: 'ksh20' },
    //     { name: 'Standard Package', speed: '10 Mbps', data: '50 GB', price: 'ksh50' },
    //     { name: 'Premium Package', speed: '50 Mbps', data: 'Unlimited', price: 'ksh100' },
    //     { name: 'Family Package', speed: '70 Mbps', data: 'Unlimited', price: 'ksh100' },
    //   ];

      const packageVariants = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: { opacity: 1, scale: 1 }
      };

  const containerVariants = {
    hidden: { opacity: 0, x: '100vw' },
    visible: {
      opacity: 1,
      x: 0,
      transition: { type: 'spring', stiffness: 50 }
    }
  };

  const buttonVariants = {
    hover: {
      scale: 1.1,
      textShadow: "0px 0px 8px rgb(255, 255, 255)",
      boxShadow: "0px 0px 8px rgb(0, 0, 0, 0.2)"
    }
  };



useEffect(() => {
  
  const fetchHotspotPackages = async() => {
    try {
      const response = await fetch('/api/hotspot_packages', {
        headers: {
          'X-Subdomain': subdomain,
        },
      })
      const newData = await response.json()
      if (response.ok) {
        // setPackages(newData)
        setPackages(newData)
        console.log('hotspot packages fetched', newData)
      } else {
        toast.error('failed to fetch hotspot packages', {
          duration: 7000,
          position: "top-center",
        });
        console.log('failed to fetch hotspot packages')
      }
    } catch (error) {
      toast.error('Something went wrong', {
        duration: 7000,
        position: "top-center",
      });
      console.log(error)
    }
  }
  fetchHotspotPackages()
}, []);


  
  return (

    <>
      <Toaster />
      <div className={`min-h-screen relative z-0 flex flex-col items-center justify-center bg-green-500 p-4`}>
        {/* Header Section */}
        <div className="w-full text-center mb-8">
          <h1 className="text-5xl font-bold text-white dotted-font">Welcome to {company_name}</h1>
          <p className="text-xl text-gray-200 mt-2">Fast and reliable internet access</p>
        </div>

        {/* Floating Card for Form or Packages */}
        <motion.div
          className="w-full max-w-lg bg-white rounded-2xl shadow-2xl p-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {seeForm ? (
            <>
              <div className="text-center mb-6">
                <FaWifi className="text-purple-600 w-12 h-12 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-800">Connect to Hotspot</h2>
                <p className="text-gray-600">Enter your phone number to proceed</p>
              </div>

              <motion.div
                className="flex justify-between items-center bg-gray-100 p-4 rounded-lg mb-4"
                whileHover={{ scale: 1.02 }}
              >
                <FaPhone className="text-purple-600 w-8 h-8" />
                <input
                  type="text"
                  className="w-full text-gray-700 bg-gray-100 rounded-lg p-2 focus:outline-none"
                  placeholder="Enter your phone number"
                />
              </motion.div>

              <motion.button
                variants={buttonVariants}
                whileHover="hover"
                className="w-full py-3 bg-purple-600 text-white rounded-full shadow-md focus:outline-none dotted-font font-thin"
                onClick={() => alert('Connected!')}
              >
                Connect Now
              </motion.button>

              <div
                className="flex justify-center items-center cursor-pointer mt-6"
                onClick={() => {
                  setSeeForm(false);
                  setSeePackages(true);
                  setSeeInstructions(true);
                }}
              >
                {/* <FaArrowLeft className="w-8 h-8 text-purple-600" /> */}
              </div>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">Choose Your Plan</h2>
              <div className="space-y-4">
                {packages.map((pkg, index) => (
                  <motion.div
                    key={index}
                    className="bg-gray-100 p-4 rounded-lg shadow-sm cursor-pointer"
                    whileHover={{ scale: 1.02 }}
                    onClick={() => {
                      setSeePackages(false);
                      setSeeForm(true);
                      setSeeInstructions(false);
                    }}
                  >
                    <h3 className="text-xl font-bold text-gray-800">{pkg.name}</h3>
                    <p className="text-gray-600">Valid For {pkg.valid}</p>
                    <p className="text-purple-600 font-bold mt-2">Price: Ksh{pkg.price}</p>
                  </motion.div>
                ))}
              </div>
            </>
          )}
        </motion.div>

        {/* Instructions Section */}
        {seeInstructions && (
          <div className="mt-8 text-center text-white">
            <h2 className="text-xl font-bold mb-4">How To Purchase:</h2>
            <ol className="space-y-2">
              <li>1. Tap the package you want to purchase</li>
              <li>2. Enter Your Phone Number</li>
              <li>3. Click "Connect Now"</li>
              <li>4. Enter your Mobile PIN in the prompt</li>
            </ol>
          </div>
        )}
      </div>
    </>
  );
};



export default HotspotPage