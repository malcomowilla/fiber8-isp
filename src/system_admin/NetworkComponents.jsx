
import { motion } from 'framer-motion';
import { SiWireguard, } from 'react-icons/si';
import {useApplicationSettings} from '../settings/ApplicationSettings'
import {useEffect,useState, useRef} from 'react'
import toast,{Toaster} from 'react-hot-toast'
import { useLocation } from 'react-router-dom';
import {useNavigate} from 'react-router-dom';
import { 
   RefreshCw,
  BarChart3, TrendingDown, Download, Upload
} from 'lucide-react';




const NetworkComponents = () => {

const {pingStatus, setPingStatus,
  showMenu1, setShowMenu1, showMenu2, setShowMenu2, showMenu3, setShowMenu3,
      showMenu4, setShowMenu4, showMenu5, setShowMenu5, showMenu6, setShowMenu6,
       showMenu7, setShowMenu7, showMenu8, setShowMenu8, showMenu9, setShowMenu9,
        showMenu10, setShowMenu10, showMenu11, setShowMenu11, showMenu12, setShowMenu12,
} = useApplicationSettings()
const [serviceStatus, setServiceStatus] = useState({ freeradius: {}, wireguard: {} });
const [showRebootConfirm, setShowRebootConfirm] = useState(false);
const [showRebootConfirmWireguard, setShowRebootConfirmWireguard] = useState(false);
const [loadingWireguard, setLoadingWireguard] = useState(false);
const [loadingFreeRadius, setLoadingFreeRadius] = useState(false);


const navigate = useNavigate()
// const navigate = useNavigate()
const location = useLocation()
const buttonRef = useRef(null);


const subdomain = window.location.hostname.split('.')[0];
// console.log('subdomain', subdomain)

function getMainDomain(hostname) {
  const parts = hostname.split('.');
  
  if (parts.length >= 3) {
    return parts[parts.length - 3]; // Get the part before the TLD (e.g., "aitechs" from "fiber8.aitechs.co.ke")
  } 
  return hostname; // Return as is if it's already a domain
}

const domain = getMainDomain(window.location.hostname);
const fetchServiceStatus = async () => {
  try {
    const response = await fetch('/api/service_status');
    const data = await response.json();
    setServiceStatus(data);
  } catch (error) {
    toast.error("Failed to fetch service status");
  }
};




const rebootFreeRadius = async(e) => {
  e.preventDefault()

    
  if (!showRebootConfirm) {
    setShowRebootConfirm(true);
    return;
  }

  

}





const rebootWireguard = async(e) => {
  e.preventDefault()

    
 

  
if (!showRebootConfirmWireguard) {
  setShowRebootConfirmWireguard(true);
  return;
  
}

}

useEffect(() => {
  fetchServiceStatus();
  const interval = setInterval(fetchServiceStatus, 30000); // Refresh every 30 seconds
  return () => clearInterval(interval);
}, []);



  const services = [
    {


      name: "Free Radius",
      status: serviceStatus?.freeradius?.running,
      lastRestart: serviceStatus?.freeradius?.last_restart || "Unknown",
      description: "Authentication server for network access",
      color: "bg-blue-100",
      restartable: true,
      service_name: "freeradius",
      

    },
    
    


  ];




const wireguard_services = [
  {
      name: "WireGuard",
      status: serviceStatus?.wireguard?.running,
      lastRestart: serviceStatus?.wireguard?.last_restart || "Unknown",
      icon: <SiWireguard className="text-purple-500 text-4xl" />,
      description: "Modern VPN with state-of-the-art cryptography",
      color: "bg-purple-100",
      restartable: true,
      service_name: "wg-quick@wg0",

    },
]

  



  const restartService = async (service) => {
    setLoadingFreeRadius(true)
    setLoadingWireguard(true)
    try {
      const response = await fetch('/api/restart_service', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ service }),
      });



  if (response.status === 402) {
    setTimeout(() => {
      navigate('/license-expired')
     }, 1800);
    
  }
      if (response.ok) {
        setLoadingFreeRadius(false)
        setLoadingWireguard(false)
        toast.success(`${service} restarted successfully`);
        fetchServiceStatus(); // Refresh status after restart
      } else {
        toast.error(`Failed to restart ${service}`);

        setLoadingFreeRadius(false)
        setLoadingWireguard(false)
      }
    } catch (error) {
      toast.error(`Error restarting ${service}`);
      setLoadingFreeRadius(false)
        setLoadingWireguard(false)
    }
  };


  return (


    <>
    <Toaster />
    <div 
    onClick={() => {
      setShowMenu1(false)
      setShowMenu2(false)
      setShowMenu3(false) 
      setShowMenu4(false) 
      setShowMenu5(false) 
      setShowMenu6(false) 
      setShowMenu7(false) 
      setShowMenu8(false) 
      setShowMenu9(false) 
      setShowMenu10(false) 
      setShowMenu11(false)    
      setShowMenu12(false)
    }}
    className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
      
      
      {services.map((service, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.5 }}
          whileHover={{ scale: 1.03 }}
          className={`rounded-xl shadow-lg overflow-hidden ${service.color} relative`}
          onClick={() => {
            console.log('button ref', buttonRef.current)

          }}

          ref={buttonRef}
        >
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center space-x-3">
                {service.icon}
                
                <h3 className="text-xl font-bold text-gray-800">{service.name}</h3>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold
              ${
                service?.status === true
                  ? "bg-green-100 text-green-800" 
                  : "bg-red-100 text-red-800"
              }`}>
                {service?.status === true ? 'Online' : 'Offline'}
              </span>
            </div>
            
            <p className="text-gray-600 mb-4">{service?.description}</p>
            
            <div className="flex items-center justify-between">
              <div className="flex space-x-2">
                <span className="text-sm text-black">Last checked: {service?.lastRestart}</span>
                <span className="text-sm font-medium text-black">{service.checked_at && service.checked_at}</span>
              </div>

  

            <>


<div className='space-y-2'>

    {showRebootConfirm ? (
      <div className='flex space-x-2'>
        <button 
          // onClick={rebootRouter}
          onClick={() => restartService(service?.service_name)}
          className='bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700'
        >
                  {loadingFreeRadius ? <span className='flex gap-2'><RefreshCw className='animate-spin text-white w-5 h-5 mx-auto ' /> Rebooting </span>  :  <p> Confirm Reboot</p>}

          
        </button>
        <button 
          onClick={() => setShowRebootConfirm(false)}
          className='bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600'
        >
          Cancel
        </button>
      </div>
    ) : (
      <button 
        onClick={rebootFreeRadius}
        className={'w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700'}
      >
        Reboot
      </button>
    )}
  </div>


 <motion.div
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 1 }}
            className={`h-1 absolute bottom-0 ${
                service.status === true 
                ? "bg-green-500" 
                : "bg-red-500"
            }`}

          />

              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: service?.status === true  ? 1 : 0.6
                }}
                transition={{ repeat: Infinity, duration: 2 }}
                className={`w-3 h-3 rounded-full ${
                    service?.status === true 
                    ? "bg-green-500" 
                    : "bg-red-500"
                }`}
              />

            </>
           
              
            
            </div>
          </div>
          
          {/* Animated status bar */}
         
        </motion.div>
      ))}










       {wireguard_services.map((service, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.5 }}
          whileHover={{ scale: 1.03 }}
          className={`rounded-xl shadow-lg overflow-hidden ${service.color} relative`}
          ref={buttonRef}
        >
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center space-x-3">
                {service.icon}
                
                <h3 className="text-xl font-bold text-gray-800">{service.name}</h3>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold
              ${
                service?.status === true
                  ? "bg-green-100 text-green-800" 
                  : "bg-red-100 text-red-800"
              }`}>
                {service?.status === true ? 'Online' : 'Offline'}
              </span>
            </div>
            
            <p className="text-gray-600 mb-4">{service?.description}</p>
            
            <div className="flex items-center justify-between">
              <div className="flex space-x-2">
                <span className="text-sm text-black">Last checked: {service?.lastRestart}</span>
                <span className="text-sm font-medium text-black">{service.checked_at && service.checked_at}</span>
              </div>

  

            <>


<div className='space-y-2'>

    {showRebootConfirmWireguard ? (
      <div className='flex space-x-2'>
        <button 
          // onClick={rebootRouter}
          onClick={() => restartService(service?.service_name)}
          className='bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700'
        >
                          {loadingWireguard ? <span className='flex gap-2'><RefreshCw className='animate-spin text-white w-5 h-5 mx-auto ' /> Rebooting </span>  :  <p> Confirm Reboot</p>}

        </button>
        <button 
          onClick={() => setShowRebootConfirmWireguard(false)}
          className='bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600'
        >
          Cancel
        </button>
      </div>
    ) : (
      <button 
        onClick={rebootWireguard}
        className='w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700'
      >
        Reboot
      </button>
    )}
  </div>


 <motion.div
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 1 }}
            className={`h-1 absolute bottom-0 ${
                service.status === true 
                ? "bg-green-500" 
                : "bg-red-500"
            }`}

          />

              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: service?.status === true  ? 1 : 0.6
                }}
                transition={{ repeat: Infinity, duration: 2 }}
                className={`w-3 h-3 rounded-full ${
                    service?.status === true 
                    ? "bg-green-500" 
                    : "bg-red-500"
                }`}
              />

            </>
           
              
            
            </div>
          </div>
          
          {/* Animated status bar */}
         
        </motion.div>
      ))}
    </div>

    </>
  );
};

export default NetworkComponents;

