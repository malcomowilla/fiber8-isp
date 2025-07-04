
import {Link} from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion';

import { useState, useEffect, useCallback } from 'react';
import { useApplicationSettings } from '../settings/ApplicationSettings';
import {
  FaUserCircle,
  FaDesktop,
  FaSignInAlt,
  FaSignOutAlt,
  FaShieldAlt,
  FaCog
} from 'react-icons/fa';
import {
  SiApple,
  SiLinux,
  SiAndroid,
  SiIos
} from 'react-icons/si';
import { FaWindows } from "react-icons/fa6";

import {
  BsBrowserChrome,
  BsBrowserEdge,
  BsBrowserFirefox,
  BsBrowserSafari
} from 'react-icons/bs';
import MaterialTable from 'material-table'
import { RiDeleteBin5Line } from "react-icons/ri";



const AdminDashboard = () => {
const {showMenu1, setShowMenu1, showMenu2, setShowMenu2, showMenu3, setShowMenu3,
      showMenu4, setShowMenu4, showMenu5, setShowMenu5, showMenu6, setShowMenu6,
       showMenu7, setShowMenu7, showMenu8, setShowMenu8, showMenu9, setShowMenu9,
        showMenu10, setShowMenu10, showMenu11, setShowMenu11, showMenu12, setShowMenu12,} = useApplicationSettings()

const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

const [totalSubscribers, setTotalSubscribers] = useState(0);
const [registrations, setRegistrations] = useState({
    todayCount: 0,
    thisWeekCount: 0,
    thisMonthCount: 0,
    lastMonthCount: 0
  });
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

// <Route path='/admin/today-subscribers' element={<TodayRegisteredSubscribers/>}/>

// <Route path='/admin/this-month-subscribers' element={<ThisMonthRegisteredSubscribers/>}/>


{/* <Route path='/admin/this-week-subscribers' element={<ThisWeekRegisteredSubscribers/>}/> */}

 const fetchLogs = async () => {
    try {
      const response = await fetch('/api/activty_logs');
      const data = await response.json();
      setLogs(data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching logs:', error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const getActionIcon = (action) => {
    switch (action.toLowerCase()) {
      case 'login':
        return <FaSignInAlt className="text-green-500" />;
      case 'logout':
        return <FaSignOutAlt className="text-red-500" />;
      case 'configuration':
        return <FaCog className="text-blue-500" />;
      case 'security':
        return <FaShieldAlt className="text-purple-500" />;
        case 'delete':
        return <RiDeleteBin5Line className="text-red-500" />;
      default:
        return <FaUserCircle className="text-gray-500" />;
    }
  };

  const getOSIcon = (userAgent) => {
    if (!userAgent) return <FaWindows className="text-blue-400" />;
    if (/windows/i.test(userAgent)) return <FaWindows className="text-blue-400" />;
    if (/macintosh|mac os x/i.test(userAgent)) return <SiApple className="text-gray-700" />;
    if (/linux/i.test(userAgent)) return <SiLinux className="text-yellow-600" />;
    if (/android/i.test(userAgent)) return <SiAndroid className="text-green-500" />;
    if (/iphone|ipad|ipod/i.test(userAgent)) return <SiIos className="text-gray-500" />;
    return <FaDesktop className="text-gray-500" />;
  };

  const getBrowserIcon = (userAgent) => {
    if (!userAgent) return <BsBrowserChrome className="text-blue-500" />;
    if (/chrome/i.test(userAgent)) return <BsBrowserChrome className="text-blue-500" />;
    if (/firefox/i.test(userAgent)) return <BsBrowserFirefox className="text-orange-500" />;
    if (/safari/i.test(userAgent)) return <BsBrowserSafari className="text-blue-400" />;
    if (/edge/i.test(userAgent)) return <BsBrowserEdge className="text-blue-600" />;
    return <BsBrowserChrome className="text-blue-500" />;
  };

  useEffect(() => {
    const fetchRegistrationStats = async () => {
      try {
        const response = await fetch('/api/registration_stats');
        const data = await response.json();
        setRegistrations(data);
      } catch (error) {
        console.error('Error fetching registration stats:', error);
      }
    };
  
    fetchRegistrationStats();
  }, []);


const subdomain = window.location.hostname.split('.')[0];
  const fetchtotalSubscribers = useCallback(
    async() => {
      try {
        const response = await fetch('/api/total_subscribers', {
          headers: {
            'X-Subdomain': subdomain,
          },
        });

        const newData = await response.json();

        if (response.ok) {
          setTotalSubscribers(newData.total_subscribers)
        } else {
          console.log('failed to fetch total subscribers')
        }
      } catch (error) {
        console.log('failed to fetch total subscribers')
      }
      
    },
    [],
  )
  
useEffect(() => {
  fetchtotalSubscribers()
  
}, [fetchtotalSubscribers]);




const [status, setStatus] = useState([])


const getSubscriptions = useCallback(
  async() => {
    
    try {
      const response = await fetch('/api/subscriptions', {
        headers: { 'X-Subdomain': subdomain },
      })
      const data = await response.json()
      setStatus(data)
      // setSubscriptions(data)
    }
    catch (error) {
      console.log(error)
    }
  },
  [subdomain]
)



useEffect(() => {
  getSubscriptions() 
 
}, [getSubscriptions]);
  return (
   <>
   
   
   
   

  
   <motion.div

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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-xl shadow-md overflow-hidden"
    >
        <MaterialTable
          title={
            <motion.div
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              className="text-xl font-bold text-gray-800 p-4"
            >
              Activity Logs
            </motion.div>
          }
          data={logs}
          columns={[
            {
              title: 'Action',
              field: 'action',
              render: (rowData) => (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center gap-2"
                >
                  {getActionIcon(rowData.action)}
                  <span className='dark:text-black'>{rowData.action}</span>
                </motion.div>
              ),
              cellStyle: {
                minWidth: '150px'
              }
            },
            {
              title: 'User',
              field: 'user',
              render: (rowData) => (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center gap-2"
                >
                  <FaUserCircle className="text-blue-400" />
                  <span className='dark:text-black'>{rowData.user}</span>
                </motion.div>
              )
            },
            {
              title: 'Device',
              render: (rowData) => (
                <div className="flex items-center gap-2">
                  {getOSIcon(rowData.user_agent)}
                  {getBrowserIcon(rowData.user_agent)}
                </div>
              )
            },
            {
              title: 'IP Address',
              field: 'ip',
              render: (rowData) => (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="font-mono text-sm"
                >
                  <p className='dark:text-black'>{rowData.ip} </p>
                </motion.div>
              )
            },


            {
              title: 'Description',
              field: 'description',
              render: (rowData) => (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center gap-2"
                >
                  {getActionIcon(rowData.action)}
                  <span className='dark:text-black'>{rowData.description}</span>
                </motion.div>
              )

            },
            {
              title: 'Date',
              field: 'date',
              render: (rowData) => (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="flex flex-col"
                >
                  {/* <span className='dark:text-black'>
                    {new Date(rowData.date).toLocaleDateString()}</span>
                  <span className="text-lg dark:text-black">
                    {new Date(rowData.date).toLocaleTimeString()}
                  </span> */}
                  {rowData.date}
                </motion.div>
              )
            }
          ]}
          isLoading={isLoading}
          options={{
            pageSize: 10,
            pageSizeOptions: [5, 10, 20],
            sorting: true,
            search: true,
            searchFieldAlignment: 'left',
            headerStyle: {
              backgroundColor: '#f8fafc',
              color: '#64748b',
              fontWeight: '600',
              fontSize: '0.875rem'
            },
            rowStyle: {
              backgroundColor: '#fff',
              '&:hover': {
                backgroundColor: '#f1f5f9'
              }
            }
          }}
         
        />
    </motion.div>
   













   
   
   
   
   
   
   </>
  )
}

export default AdminDashboard