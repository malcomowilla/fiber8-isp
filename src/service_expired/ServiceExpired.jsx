import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {useApplicationSettings} from '../settings/ApplicationSettings'

const ServiceExpired = () => {
  const [showInstructions, setShowInstructions] = useState(false);
  const [countdown, setCountdown] = useState(10);


  const { companySettings, setCompanySettings } = useApplicationSettings();
  const {logo_preview, contact_info, company_name, email_info, customer_support_phone_number,agent_email ,customer_support_email} = companySettings;

  // Countdown timer effect
//   useEffect(() => {
//     const timer = countdown > 0 && setInterval(() => {
//       setCountdown(countdown - 1);
//     }, 1000);
//     return () => clearInterval(timer);
//   }, [countdown]);

  // Redirect after countdown
//   useEffect(() => {
//     if (countdown === 0) {
//       window.location.href = '/login'; // Change to your login route
//     }
//   }, [countdown]);





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
         console.log(logo_url)

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
    //   toast.error('internal servere error  while fetching company settings')
    
    }
  },
  [setCompanySettings],
)

useEffect(() => {
  
  handleGetCompanySettings()
  
}, [handleGetCompanySettings])
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex flex-col items-center justify-center p-4">
      {/* Removed Next.js Head component - add meta tags in your index.html instead */}

      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full text-center"
      >
        <div className="flex justify-center mb-6">
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </motion.div>
        </div>

        <h1 className="text-3xl font-bold text-red-600 mb-2">Service Expired</h1>
        <p className="text-gray-700 mb-6">Your internet subscription has ended. Please renew to continue enjoying our services.</p>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowInstructions(!showInstructions)}
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg mb-6 w-full"
        >
          {showInstructions ? 'Hide Instructions' : 'Renew Now'}
        </motion.button>

        <AnimatePresence>
          {showInstructions && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 text-left">
                <h2 className="font-bold text-lg mb-2">Renew via M-Pesa</h2>
                <ol className="list-decimal pl-5 space-y-2">
                  <li>Go to <strong>Lipa na M-Pesa</strong> on your phone</li>
                  <li>Select <strong>Pay Bill</strong></li>
                  <li>Enter Business No: <span className="font-mono bg-gray-100 px-2 py-1 rounded">123456</span></li>
                  <li>Account No: <span className="font-mono bg-gray-100 px-2 py-1 rounded">Your PPPoE username</span></li>
                  <li>Enter Amount: <span className="font-mono bg-gray-100 px-2 py-1 rounded">Amount According to your subscription</span></li>
                  <li>Enter your M-Pesa PIN and confirm</li>
                </ol>
                <p className="mt-3 text-sm text-gray-600">Service will be activated within 5 minutes after payment.</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-6 text-sm text-gray-500">
          <p>You will be redirected to login in {countdown} seconds...</p>
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ duration: 10 }}
            className="h-1 bg-gray-200 mt-2 rounded-full overflow-hidden"
          >
            <div className="h-full bg-red-500"></div>
          </motion.div>
        </div>
      </motion.div>

      <motion.div 
        animate={{ y: [0, -10, 0] }}
        transition={{ repeat: Infinity, duration: 3 }}
        className="mt-8 text-center"
      >
        <p className="text-gray-600">
  Need help? Call: 
  <a 
    href={`tel:+254${customer_support_phone_number.replace(/^0/, '')}`} 
    className="text-blue-600"
  >
    {customer_support_phone_number}
  </a>
</p>
        {/* <p className="text-gray-600">Need help? Call: <a href={`tel:+2547${customer_support_phone_number}`} className="text-blue-600">{customer_support_phone_number}</a></p> */}
      </motion.div>
    </div>
  );
};

export default ServiceExpired;