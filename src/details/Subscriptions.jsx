
import { Box, TextField, Autocomplete, Stack, InputAdornment, Button,


  Typography,
  IconButton,
  Tooltip,
  CircularProgress,
 } from '@mui/material';
 import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
 import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import {useApplicationSettings} from '../settings/ApplicationSettings'
import {  useState, useEffect,useCallback, useRef} from 'react'
import { useDebounce } from 'use-debounce';
import { motion } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';
import 'leaflet/dist/leaflet.css';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { FaRegUser } from "react-icons/fa";
import { TbLockPassword } from "react-icons/tb";
import { GiCycle } from "react-icons/gi";
import { MdOutlineBlock } from "react-icons/md";
import { MdErrorOutline } from "react-icons/md";
import { MdOutlineNetworkPing } from "react-icons/md";
import MaterialTable from 'material-table';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import WarningIcon from '@mui/icons-material/Warning';
import { MdNetworkPing } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { FaCalendarAlt } from "react-icons/fa";
import { IoWarningOutline } from "react-icons/io5";
import DnsIcon from '@mui/icons-material/Dns';
import WifiIcon from '@mui/icons-material/Wifi'; // Alternative icon for PPPoE
import FingerprintIcon from '@mui/icons-material/Fingerprint';  // For unique identifier concept
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs from 'dayjs';
import { renderTimeViewClock } from '@mui/x-date-pickers/timeViewRenderers';
import { DemoContainer  } from '@mui/x-date-pickers/internals/demo';

import customParseFormat from 'dayjs/plugin/customParseFormat';
import ClearIcon from '@mui/icons-material/Clear';
import DialogContentText from '@mui/material/DialogContentText';
import Modal from '@mui/material/Modal';
import Popper from '@mui/material/Popper';
import Paper from '@mui/material/Paper';



dayjs.extend(customParseFormat);

const Subscriptions = ({
  packageNamee,
  handleClose,

  formData,  createSubscriber, handleChangeForm, setFormData, isloading,
  setShowClientStatsAndSubscriptions, setOnlyShowSubscription,onlyShowSubscription,
  subscriberId

}) => {

  const {settingsformData, subscriberSettings, setSubscriberSettings} = useApplicationSettings()
  
  const {name, ref_no , ppoe_password,  ppoe_username,  phone_number, email, second_phone_number,
      installation_fee, subscriber_discount, date_registered, router_name,
     latitude, longitude, house_number, building_name, 
    }= formData



  const [ routerName] = useDebounce( router_name, 1000)

  const [packageName, setPackageName] = useState([])
  const [routers, setRouters]= useState ([])

  const [initialPackage, setInitialPackage] = useState(null);
  const [mikrotik_router, setRouter] = useState(null)

    const [networks, setNetworks] = useState([]);
    const [ipAssigned, setIpAssigned] = useState(false);
    const [ip_address, setIpAddress] = useState('');
    const [showMaterialTable, setShowMaterialTable] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [ips, setIps] = useState([])
    const [subscriptions, setSubscriptions] = useState([])
    const [onlineStatusData, setOnlineStatusData] = useState([]);
    const [blockLoading, setBlockLoading] = useState(false);
    const [blockedSubscriptions, setBlockedSubscriptions] = useState([]);
const [service_type, setServiceType] = useState('pppoe')
const [mac_address, setMacAdress] = useState('')
const [network_name, setNetworkName] = useState('')
const [package_name, setPackagesName] = useState('')

const subdomain = window.location.hostname.split('.')[0];
 const [age, setAge] = useState('');
   const [poe_package,] = useDebounce(package_name, 1000)
   const [expiration_date,  setExpirationDate] = useState(dayjs())
   const [editing, setEditing] = useState(false);
const [subscriptionId, setSubscriptionId] = useState('');



const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const iconRef = useRef(null);

  const handleClick = (event, rowData) => {
    setSelectedRow(rowData);
    setAnchorEl(event.currentTarget);
  };

  const handleClosePopper = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'mac-address-popper' : undefined;







const confirmClearMac = async () => {
  try {
    // 1. Delete radcheck entry
    const response = await fetch('/api/delete_radcheck', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json',
          'X-Subdomain': subdomain,

       },
      body: JSON.stringify({
        username: selectedRow.ppoe_username,
      })
    });

    if (!response.ok) throw new Error('Failed to delete radcheck');

    // 2. Update local state
    const updatedSubscriptions = subscriptions.map(sub => 
      sub.id === selectedRow.id ? { ...sub, mac_address: null } : sub
    );
    setSubscriptions(updatedSubscriptions);

    // 3. Update onlineStatusData if needed
    const updatedStatusData = onlineStatusData.map(item =>
      item.ppoe_username === selectedRow.ppoe_username 
        ? { ...item, mac_address: null }
        : item
    );
    setOnlineStatusData(updatedStatusData);

    toast.success('MAC address cleared successfully!');
  } catch (error) {
    toast.error(`Error: ${error.message}`);
  } finally {
    setOpenConfirmDialog(false);
  }
};


    const handleChangeDate = (date)=> {
    setExpirationDate(date)
  }



  const handleChange = (event) => {
    setAge(event.target.value);
  };

const serviceTypeOptions = [
  { 
    value: 'dhcp', 
    label: 'DHCP (Automatic IP)',
    icon: <DnsIcon sx={{ mr: 1, color: 'primary.main' }} />
  },
  { 
    value: 'pppoe', 
    label: 'PPPoE (Dial-up)',
    icon: <WifiIcon sx={{ mr: 1, color: 'info.main' }} />
    // Alternative icon: <FiberManualRecordIcon sx={{ mr: 1, color: 'warning.main' }} />
  },
 
];


const handleBlockService = async (subscriptionData) => {
  setBlockLoading(true);
  try {
    const response = await fetch('/api/block_service', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Subdomain': subdomain
      },
      body: JSON.stringify({ subscription: subscriptionData })
    });

    const result = await response.json();
    
    if (response.ok) {
      toast.success('Service blocked successfully', {
        position: 'top-center',
        duration: 3000,
        icon: <MdOutlineBlock className="text-red-500" />
      });
      // Update the blocked status in state
      setBlockedSubscriptions([...blockedSubscriptions, subscriptionData.id]);
      // Refresh the online status
      getOnlineStatus();
    } else {
      toast.error(result.error || 'Failed to block service', {
        position: 'top-center',
        duration: 3000
      });
    }
  } catch (error) {
    toast.error('Network error while blocking service', {
      position: 'top-center',
      duration: 3000
    });
    console.error('Block service error:', error);
  } finally {
    setBlockLoading(false);
  }
};


const fetchPackages = useCallback(
  async() => {
    
  try {
    const response = await fetch('/api/get_package',{
      method: 'GET',
      headers: {
        'X-Subdomain': subdomain,
      },
  
    }
  
  )
    const newData = await response.json()
  if (response.ok) {
    // console.log('package',newData)
    setPackageName(newData)

  } else {
    console.log('failed to fetch routers')

  }
  
  } catch (error) {
    
    console.log(error)
  
  }
  },
  [],
)


  useEffect(() => {
    
    fetchPackages()
  }, [fetchPackages, poe_package]);

  const getSubscriptions = useCallback(
    async() => {
      
      try {
        const response = await fetch(`/api/subscriptions?subscriber_id=${subscriberId}`, {

          headers: { 'X-Subdomain': subdomain },
        })
        const data = await response.json()
        setSubscriptions(data)
      }
      catch (error) {
        console.log(error)
      }
    },
    []
  )



  useEffect(() => {
    getSubscriptions() 
   
  }, [getSubscriptions]);
const getIps = useCallback(
  async(network_name) => {
    
    try {
      const response = await fetch(`/api/get_ips?network_name=${network_name}`, {
        headers: { 'X-Subdomain': subdomain },
      })
      const data = await response.json()
      setIps(data)
    } catch (error) {
      
      console.log(error)
    }
  },
  [],
)

const handleChangeNetwork =(e)=> {
  const {value, name} = e.target 
  console.log('network_name',value)
  setFormData({...formData, [name]:  value})
  getIps(value) 

}


const handleChangeIpAddress =(e)=> {
  const {value, name} = e.target 
  console.log('ip_address',value)
  setFormData({...formData, [name]:  value})

}



    const fetchData = async () => {
      // setLoading(true);
      try {
        const response = await fetch('/api/ip_networks', {
          headers: { 'X-Subdomain': subdomain }
        });
        if (response.ok) {
          const result = await response.json();
          setNetworks(result);
        } else {
          throw new Error('Failed to fetch IP networks');
        }
      } catch (error) {
        // showSnackbar(error.message, 'error');
      } finally {
        // setLoading(false);
      }
    };


    useEffect(() => {
      fetchData();
     
    }, []);


    const assignRandomIp = () => {
      if (networks.length > 0) {
        const network = networks[0]; // Using first network for demo
        const baseIp = network.network.split('.');
        const randomIp = `${baseIp[0]}.${baseIp[1]}.${baseIp[2]}.${Math.floor(Math.random() * 254) + 1}`;
        setIpAddress(randomIp);
        setIpAssigned(true);
        setFormData({
          ...formData,
          ip_address: randomIp
        });
      }
    };




const handleRowClick = (event, rowData) => {
// console.log('rowData subscription add',rowData)
getIps(rowData.network_name)
setEditing(true)
setSubscriptionId(rowData.id)
// setShowClientStatsAndSubscriptions(false)
// formData.id = rowData.id
// formData.network_name = rowData.network_name 
// formData.ip_address = rowData.ip_address
  const parsedDate = dayjs(rowData.expiration_date, 'MMMM D, YYYY [at] hh:mm A');

setExpirationDate(parsedDate)
console.log('row data expiration date subscription', parsedDate)
setPackagesName(rowData.package_name)

  setNetworkName(rowData.network_name)
  setFormData(rowData)
  setIpAddress(rowData.ip_address)
  setMacAdress(rowData.mac_address)
  setServiceType(rowData.service_type)
  setFormData({
    ...rowData,
    // id: rowData.id,
    package_name: rowData.package,
   
  })

  // setFormData({
  //   ...rowData,
  //   // id: rowData.id,
  //   ppoe_username: formData.ppoe_username,
  //   ppoe_password: formData.ppoe_password,
  // })

//   setFormData({
// ...rowData,
//     id: rowData.id,
//     ip_address: rowData.ip_address,
//     package_name: rowData.package_name,
//     expiry: rowData.expiry,
//     status: rowData.status,
//     type: rowData.type,
//   }) 

  
}


const createSubscription = async(e) => {
  e.preventDefault()
const payload = {
  ...formData,
  service_type: service_type, // or just service_type, using shorthand
  network_name: network_name,
  ip_address: ip_address,
  expiration_date: expiration_date,
  package_name: package_name,
};
  try {
        const method = subscriptionId ? 'PATCH' : 'POST'
    const url = subscriptionId ? `/api/subscriptions/${subscriptionId}?subscriber_id=${subscriberId}&?update` : `/api/subscriptions?subscriber_id=${subscriberId}&?create`
        const response = await fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'X-Subdomain': subdomain
      },
      body: JSON.stringify({ subscription: payload }) // Must be wrapped under `subscription`
    })

 const newData = await response.json()

 if (response.ok) {
  


  if (subscriptionId) {

  toast.success('Subscription updated successfully', {position: "top-center", duration: 3000 })
    setSubscriptions(subscriptions.map(item => item.id === newData.id ? newData : item))
    setShowForm(false)
  setShowMaterialTable(true)
  } else {

    toast.success('Subscription added successfully', {  position: "top-center", duration: 3000 })

    setSubscriptions([...subscriptions, newData])
    setShowForm(false)
  setShowMaterialTable(true)

  }
 } else {
  
  toast.error(newData.error, {  position: "top-center", duration: 4000 })

 toast.error('Error creating subscription', {  position: "top-center", duration: 2000 })
  console.log('failed to create subscription')
   setShowForm(true)
   setShowMaterialTable(false)
 }

  } catch (error) {
    
       
    toast.error('Error creating subscription server error', {  position: "top-center", duration: 3000 })
    setShowMaterialTable(true)
    setShowForm(false)
    console.log(error)
  }

}



const handleIpChange = (event) => {
  const selectedIp = event.target.value;
  console.log('Changing IP to:', selectedIp); // Debug
  setIpAddress(selectedIp)
  // setFormData(prev => ({
  //   ...prev,
  //   ip_address: selectedIp
  // }));
};




const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
const [networkToDelete, setNetworkToDelete] = useState(null);
const [loading, setLoading] = useState(false);

const getOnlineStatus = useCallback(async () => {
  try {
    const response = await fetch(`/api/last_seen?subscriber_id=${subscriberId}`, {
      headers: { 'X-Subdomain': subdomain },
    });
    const data = await response.json();
    setOnlineStatusData(data);
  } catch (error) {
    console.log(error);
    // Set error status if API fails
    setOnlineStatusData([{ status: 'error' }]);
  }
}, [subdomain]);



useEffect(() => {
  // Initial call
  getOnlineStatus();
  
  // Set up interval for polling
  const intervalId = setInterval(() => {
    getOnlineStatus();
  }, 8000);

  // Clean up interval on unmount
  return () => clearInterval(intervalId);
}, [getOnlineStatus]);



useEffect(() => {
  // setInterval(() => {
  //   getOnlineStatus()
  // }, 10000);
  getOnlineStatus()
}, [getOnlineStatus]);

const handleDeleteClick = (id) => {
  setNetworkToDelete(id);
  setDeleteConfirmOpen(true);
};


const handleDeleteCancel = () => {
  setDeleteConfirmOpen(false);
  setNetworkToDelete(null);
};





const handleDeleteConfirm = async () => {
  try {
    setLoading(true);
    const response = await fetch(`/api/subscriptions/${networkToDelete}`, {
      method: 'DELETE',
      headers: { 'X-Subdomain': subdomain }
    });

    if (!response.ok) {
      toast.error('Failed to delete subscription', {
        position: 'top-center',
        duration: 4000,
      });
      throw new Error('Failed to delete network');

    }

    if (response.ok) {
      toast.success('Subscription deleted successfully', {
          position: 'top-center',
          duration: 4000,
      })
      setSubscriptions((tableData)=> tableData.filter(item => item.id !== networkToDelete))
    } else {
      setLoading(false);
    }
    // showSnackbar('Network deleted successfully');
    // fetchData(); // Refresh data
  } catch (error) {
    // showSnackbar(error.message, 'error');
  } finally {
    setLoading(false);
    setDeleteConfirmOpen(false);
    setNetworkToDelete(null);
  }
};



  return (
    <>
{showMaterialTable && (
  <>
  
        {/* <CloudIcon sx={{ mr: 2, color: 'primary.main' }} /> */}
         <Popper
        id={id}
        open={open}
        anchorEl={anchorEl}
        placement="right-start"
      
        sx={{
          zIndex: 9999, // Ensure it's above everything
          '&[data-popper-placement*="right"]': {
            marginLeft: '8px !important',
          }
        }}
      >
        <Paper elevation={3} sx={{ p: 2, border: '1px solid #eee' }}>
          <Typography variant="body2" sx={{ mb: 1 }}>
            Clear MAC address for <b>{selectedRow?.ppoe_username}</b>?
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
            <Button 
              size="small" 
              variant="outlined" 
              onClick={handleClosePopper}
            >
              Cancel
            </Button>
            <Button
              size="small"
              color="warning"
              variant="contained"
              onClick={() => {
                console.log('Clearing MAC for:', selectedRow);
                // handleClosePopper();
                confirmClearMac();
              }}
            >
              Clear
            </Button>
          </Box>
        </Paper>
      </Popper>

<Toaster/>


      <MaterialTable


        title="Subscription"
        onRowClick={(event, rowData)=>handleRowClick(event, rowData)}

        columns={[
          {
            title: 'Status',
            field: 'status',
            headerStyle: { 
              color: 'black',
              fontWeight: 'bold',
              fontSize: '14px'
            },
            cellStyle: {
              minWidth: '180px'
            },
            render: rowData => {
              const statusInfo = onlineStatusData.find(item => 
                item.ppoe_username === rowData.ppoe_username
              ) || { status: 'offline' };
          
              // Status indicator configuration
              const statusConfig = {
                online: {
                  icon: (
                    <div className="relative inline-flex items-center">
                      <MdNetworkPing className="text-green-500 animate-ping absolute opacity-75" />
                      <MdNetworkPing className="text-green-500 relative" />
                    </div>
                  ),
                  text: 'Online',
                  color: 'text-green-600',
                  bg: 'bg-green-50',
                  tooltip: 'Device is currently connected'
                },
                blocked: {
                  icon: (
                    <div className="relative inline-flex items-center">
                      <MdOutlineBlock className="text-red-700 animate-ping" />
                    </div>
                  ),
                  text: 'Blocked',
                  color: 'text-red-700',
                  bg: 'bg-red-50',
                  tooltip: 'Device is currently blocked'
                },
                offline: {
                  icon: <MdOutlineNetworkPing className="text-gray-500" />,
                  text: statusInfo.last_seen ? `Last seen: ${statusInfo.last_seen}` : 'Offline',
                  color: 'text-gray-600',
                  bg: 'bg-gray-50',
                  tooltip: statusInfo.last_seen ? `Last active: ${statusInfo.last_seen}` : 'No connection data'
                },
                error: {
                  icon: <MdErrorOutline className="text-red-500 animate-pulse" />,
                  text: 'Connection Error',
                  color: 'text-red-600',
                  bg: 'bg-red-50',
                  tooltip: 'Failed to retrieve status data'
                }
              };
          
              // First check if status is blocked, then fall back to other statuses
              const currentStatus = statusInfo.status === 'blocked' 
                ? 'blocked' 
                : statusInfo.status in statusConfig 
                  ? statusInfo.status 
                  : 'offline';
          
              const { icon, text, color, bg, tooltip } = statusConfig[currentStatus];
          
              return (
                <Tooltip title={tooltip} arrow>
                  <div className={`flex items-center px-3 py-1 rounded-full ${bg}`}>
                    {icon}
                    <span className={`ml-2 text-sm font-medium ${color}`}>
                      {text}
                    </span>
                  </div>
                </Tooltip>
              );
            }
          },
          { 
            title: 'Service Type', 
            field: 'service_type',
            headerStyle: {
              color: 'black',
              fontWeight: 'bold',
              fontSize: '14px'
            }
          },

 { 
            title: 'Network Name', 
            field: 'network_name',
            headerStyle: {
              color: 'black',
              fontWeight: 'bold',
              fontSize: '14px'
            }
          },




          { title: 'Package', field: 'package_name' ,
            headerStyle: { color: 'black' } 
          },
          {
            title: 'IP Address',
            field: 'ip_address',
            headerStyle: { color: 'black' } ,
            render: rowData => (
              <p style={{ color: 'green', fontSize: '15px' }}>
                {rowData.ip_address}
                <MdNetworkPing className='text-magenta-500 cursor-pointer'/>
              </p>
            ),
          },
          // { title: 'Node', field: 'node',  headerStyle: { color: 'black' }  },
          {
            title: 'MAC Address',
            
            field: 'mac_adress',
            headerStyle: { 
              color: 'black',
              fontWeight: 'bold'
            },
            render: rowData => {
              // Find status info or use empty object as fallback
              const statusInfo = onlineStatusData.find(item => 
                item.ppoe_username === rowData.ppoe_username
              ) || {};
          
              const macAddress = statusInfo.mac_adress || 'Not available';
          
              // Determine if device is online (for ping icon color)
              const isOnline = statusInfo.status === 'online';
              const pingColor = isOnline ? 'text-green-500' : 'text-gray-400';
              const pingTooltip = isOnline ? 'Device is online' : 'Device is offline';
          
              return (
                <div className="flex items-center gap-2">
                  <Tooltip title={pingTooltip} arrow>
                    <div className="flex items-center">
                      <MdNetworkPing 
                        className={`${pingColor} cursor-pointer ${isOnline ? 'animate-pulse' : ''}`} 
                        onClick={() => {
                          // Add your ping action here
                          console.log(`Pinging device with MAC: ${macAddress}`);
                        }}
                      />
                    </div>
                  </Tooltip>
                  
                  <Tooltip title="Click to copy" arrow>
                    <span 
                      className="font-mono text-sm bg-gray-100 px-2 py-1 rounded hover:bg-gray-200 cursor-pointer"
                      onClick={() => {
                        navigator.clipboard.writeText(macAddress);
                        toast.success('MAC address copied!', { 
                          position: 'top-center',
                          duration: 2000
                        });
                      }}
                    >
                      {macAddress}
                    </span>
                  </Tooltip>

 
 <Tooltip
 
 title="Clear MAC address" arrow>
          <IconButton 
         ref={iconRef}
              aria-describedby={id}
              onClick={(e) => handleClick(e, rowData)}
              size="small"
              sx={{ p: 0.5 }}
          >
            <ClearIcon color="warning" fontSize="small" />
          </IconButton>
        </Tooltip>
                </div>
              );
            }
          },
          {
            title: 'Password',
            field: 'ppoe_password',
            headerStyle: { color: 'black' } ,
            render: rowData => (
              <p style={{ color: 'red', fontSize: '15px' }}>
                {rowData.ppoe_password}
                <TbLockPassword className='text-red-500 cursor-pointer'/>
              </p>
            ),
          },
          {
            title: 'Username',
            field: 'ppoe_username',
            headerStyle: { color: 'black' } ,
            render: rowData => (
              <p style={{ color: 'blue', fontSize: '15px' }}>
                {rowData.ppoe_username}
                <FaUser className='text-blue-700 cursor-pointer'/>
              </p>
            ),
          },
          { title: 'Expiry', field: 'expiration_date' ,

            render: rowData => (
              <p style={{ color: 'black', fontSize: '15px' }}>
                {rowData.expiration_date}
                <FaCalendarAlt className='text-orange-500 cursor-pointer'/>
              </p>
            ),
          },
        ]}
        data={subscriptions}
        actions={[
          {
            icon: () => (
                <IconButton color="primary">
                  <AddCircleIcon
                   onClick={()=> {
                    setShowMaterialTable(false)
                    setShowForm(true)
                    setEditing(false)
                    
                    setShowClientStatsAndSubscriptions(false)

setExpirationDate(dayjs())
setPackagesName('')

  setNetworkName('')
  setIpAddress('')
  setMacAdress('')
  setServiceType('')

                  }}
                  fontSize="large" />
                </IconButton>
            ),
            tooltip: 'Add Subscription',
            isFreeAction: true,

            // onClick: (event, rowData) => handleRowClick(event, rowData)

            // onClick: handleOpenAddDialog
          },
          {
            icon: () => <EditIcon 
            onClick={()=> {
              setShowMaterialTable(false)
              setShowForm(true)
              setOnlyShowSubscription(false)
            }}
            color="primary" />,
            tooltip: 'Edit Network',
            onClick: (event, rowData) => handleRowClick(event, rowData)
           
          },
          {
            icon: () => <DeleteIcon color="error" />,
            tooltip: 'Delete Network',
            onClick: (event, rowData) => handleDeleteClick(rowData.id)

            // onClick: (event, rowData) => handleDelete(rowData.id)
            // onClick: (event, rowData) => handleDeleteClick(rowData.id)
          },


        ]}
        options={{
          actionsColumnIndex: -1,
          pageSize: 10,
          pageSizeOptions: [10, 20, 50],
          showTitle: false,
          headerStyle: {
            backgroundColor: '#f5f5f5',
            fontWeight: 'bold'
          }
        }}
      />
 
 <button onClick={(e) => {
              e.preventDefault()
              handleClose()
            }} className='bg-red-600  absolute top-[800px] lg:top-[855px]
            max-sm:top-[800px]
            text-white rounded-3xl px-4 py-2
          transform hover:scale-110 transition duration-500 hover:bg-red-200  
          text-lg ' >
              Cancel
            </button>
  </>
)}




{showForm && (
  <>
  {editing ? (
<div className='p-4 flex bg-yellow-50 rounded-lg shadow-sm'>
   <IoWarningOutline className='text-orange-600 text-2xl' />

   <span className='flex text-lg text-orange-400'>Note- <p className=''>Editing subscription details will affect the current connected session.</p> </span>
    </div>
  ): null}
 
 <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Toaster />
      
      {/* Credentials Section */}
      <form onSubmit={createSubscription}>
 <Box sx={{ mb: 3 }} fullWidth>
  <InputLabel sx={{ fontSize: '18px', mb: 1 }}>Change Service Type</InputLabel>
  <Autocomplete
  className='myTextField'
    options={serviceTypeOptions}
    value={serviceTypeOptions.find(option => option.value === service_type) || null}
    onChange={(event, newValue) => {
      setServiceType(newValue?.value || '');
      console.log('service_type',newValue?.value)
    }}
    getOptionLabel={(option) => option.label}
    renderOption={(props, option) => (
      <Box component="li" {...props} sx={{ display: 'flex', alignItems: 'center' }}>
        {option.icon}
        {option.label}
      </Box>
    )}
    renderInput={(params) => (
      <TextField
        {...params}
        label="Select service type"
        required
        sx={{
          '& .MuiInputBase-root': {
            padding: '8px 14px',
            fontSize: '16px'
          }
        }}
      />
    )}
    fullWidth
    disableClearable
    isOptionEqualToValue={(option, value) => option.value === value.value}
  />
</Box>

{service_type === 'pppoe' ?  (
   <Stack spacing={3} sx={{ mb: 3 }}>
          <motion.div whileHover={{ scale: 1.01 }}>
            <TextField
              fullWidth
              className='myTextField'
              id="ppoe_password"
              onChange={handleChangeForm}
              value={ppoe_password}
              label="PPPoE Password"
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <TbLockPassword className="text-blue-500" />
                  </InputAdornment>
                ),
              }}
            />
          </motion.div>

          <>
          

            <motion.div whileHover={{ scale: 1.01 }}>
              <TextField
                fullWidth
                className='myTextField'
                id="ppoe_username"
                onChange={handleChangeForm}
                value={ppoe_username}
                label="PPPoE Username"
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FaRegUser className="text-blue-500" />
                    </InputAdornment>
                  ),
                }}
              />
            </motion.div>
          </>
      </Stack>
):   <Box sx={{ mt: 2 }}>
      <TextField
        label="MAC Address"
        className='myTextField'
        value={mac_address}
        onChange={(e) => setMacAdress(e.target.value)}
        // name="macAddress"
        placeholder="00:5A:2B:3C:9D:5E"
        fullWidth
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <FingerprintIcon 
                sx={{ 
                  color: 'action.active',
                  transform: 'rotate(45deg)' // Optional rotation
                }} 
              />
            </InputAdornment>
          ),
        }}
        sx={{
          '& .MuiInputBase-input': {
            fontFamily: 'monospace', // Makes colons align better
          }
        }}
      />
    </Box>
}
      
      {/* IP Address Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold' }}>
          Assign Ips
        </Typography>


        <Stack direction="row" spacing={2} alignItems="center">
       <FormControl sx={{ mt: 3 }} fullWidth>
  <Autocomplete
  className='myTextField'
    options={ips}
    value={formData.ip_address || null}
    onChange={(event, newValue) => {
      handleIpChange({ 
        target: { 
          name: "ip_address", 
          value: newValue || '' 
        } 
      });
    }}
    freeSolo={false}
    disableClearable
    renderInput={(params) => (
      <TextField
        {...params}
        label="IPv4 Address"
        sx={{
          '& .MuiInputBase-root': {
            fontSize: '16px',
            padding: '12px 14px',
          }
        }}
        InputLabelProps={{
          sx: { fontSize: '18px' }
        }}
      />
    )}
    // noOptionsText={ips.length === 0 ? "No IPs available" : "No matching IP found"}
    loadingText="Loading IP addresses..."
    isOptionEqualToValue={(option, value) => option === value}
    filterOptions={(options, state) => {
      // Custom filtering to match partial IP addresses
      const inputValue = state.inputValue.trim();
      if (!inputValue) return options;
      
      return options.filter(option => 
        option.includes(inputValue) ||
        option.split('.').some(octet => octet.startsWith(inputValue))
      );
    }}
  />
</FormControl>
          
          {/* <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Tooltip title="Assign Random IP">
              <Button
                variant="outlined"
                startIcon={<FaRandom />}
                onClick={assignRandomIp}
                sx={{ height: '56px' }}
              >
                Assign IP
              </Button>
            </Tooltip>
          </motion.div> */}
        </Stack>
      </motion.div>

      {/* Network Selection */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        
      >
       <Autocomplete
       className='myTextField'
  options={networks}
  value={networks.find(network => network.title === network_name) || null}
  onChange={(event, newValue) => {
    const selectedNetwork = newValue?.title || '';
    setNetworkName(selectedNetwork);
    getIps(selectedNetwork);
    console.log('network_name onchange', selectedNetwork);
  }}
  getOptionLabel={(option) => option.title}
  renderOption={(props, option) => (
    <Box 
      component="li" 
      {...props}
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        width: '100%',
        py: 1
      }}
    >
      <Box sx={{ width: '30%' }}>
        <Typography>{option.title}</Typography>
      </Box>
      <Box sx={{ width: '30%' }}>
        <Typography variant="body2" color="text.secondary">
          {option.network}
        </Typography>
      </Box>
      <Box sx={{ width: '40%' }}>
        <Typography variant="body2" color="primary">
          {option.total_ip_addresses} IPs available
        </Typography>
      </Box>
    </Box>
  )}
  renderInput={(params) => (
    <TextField
      {...params}
      label="IPv4 Network"
      required
      sx={{
        '& .MuiInputBase-root': {
          padding: '8px 14px',
        },
        mt: 3
      }}
    />
  )}
  fullWidth
  disableClearable
  isOptionEqualToValue={(option, value) => option.title === value.title}
  groupBy={(option) => option.category} // Optional: if you want to group networks
/>
          {/* Package and Date */}
          <div className="mt-4">
            <Box className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-3 myTextField'
              sx={{
                '& .MuiTextField-root': {
                  marginTop: '',
                  '& label.Mui-focused': {
                    color: 'black',
                    fontSize: '18px'
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
                },
              }}
            >
              <Autocomplete
               onChange={(event, newValue) => {
                  console.log('package_name onchange',newValue.name)
                  setPackagesName(newValue.name);
                }}
                value={packageName.find((pkg) => pkg.name === package_name) || packageName.find((pkg) => pkg.name === package_name)}
                options={packageName}
                getOptionLabel={(option) => option.name}
                renderInput={(params) => (
                  <TextField className='myTextField' {...params} label="Select Package" variant="outlined" fullWidth />
                )}
               
                sx={{ mb: 2 }}
              />


              
        <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer
        sx={{
          '& label.Mui-focused': { color: 'black' },
          '& .MuiOutlinedInput-root': {
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: 'black',
              borderWidth: '3px',
            },
            '&.Mui-focused fieldset': { borderColor: 'black' },
          },
        }}
        components={['TimePicker']}
      >
        <DateTimePicker
          label="Extend Subscription"
          className="myTextField"
          viewRenderers={{
            hours: renderTimeViewClock,
            minutes: renderTimeViewClock,
            seconds: renderTimeViewClock,
          }}
          value={expiration_date}
          onChange={(newValue) => {
            setExpirationDate(dayjs(newValue))
            console.log('newValue expiration_date subscr', dayjs(newValue))
          }}
        />
      </DemoContainer>
    </LocalizationProvider>

            </Box>
          </div>
          <div className="flex gap-4 mt-6">

          <button  className='bg-black text-white rounded-3xl px-4 py-2
          transform hover:scale-110 transition duration-500 hover:bg-green-500
          text-lg' type="submit">
              {editing ? 'Update' : 'Save'}
            </button>

            <button onClick={(e) => {
              e.preventDefault()
              setShowForm(false)
              setShowMaterialTable(true)
              setOnlyShowSubscription(true)
            }} className='bg-red-600 text-white rounded-3xl px-4 py-2
          transform hover:scale-110 transition duration-500 hover:bg-red-200  
          text-lg ' >
              Cancel
            </button>
            </div>
 
      </motion.div>

      <div className='flex justify-center gap-x-3 mt-4'>
  <Tooltip title="Disconnect service">
    <GiCycle className='text-green-500 cursor-pointer hover:text-green-700'/>
  </Tooltip>

  <Tooltip title={blockedSubscriptions.includes(formData.id) ? 'Unblock service' : 'Block service'}>
    <div className="relative">
      {blockLoading && blockedSubscriptions.includes(formData.id) ? (
        <CircularProgress 
          size={24}
          thickness={4}
          sx={{
            color: 'red',
            animationDuration: '1.5s',
          }}
        />
      ) : (
        <MdOutlineBlock 
          className={`cursor-pointer text-2xl ${
            blockedSubscriptions.includes(formData.id) 
              ? 'text-red-700 animate-pulse' 
              : 'text-red-500 hover:text-red-700'
          }`}
          onClick={() => handleBlockService(formData)}
        />
      )}
    </div>
  </Tooltip>
</div>

        </form>
    </motion.div>
  </>
)}
   


   <Dialog open={deleteConfirmOpen} onClose={handleDeleteCancel}>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center' }}>
          <WarningIcon color="warning" sx={{ mr: 1 }} />
          Confirm Deletion
        </DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this subscription?</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={handleDeleteCancel} 
            variant="outlined" 
            startIcon={<DeleteIcon />}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleDeleteConfirm} 
            variant="contained" 
            color="error"
            startIcon={<WarningIcon />}
            disabled={loading}
          >
            {loading ? <CircularProgress size={20} /> : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default Subscriptions




