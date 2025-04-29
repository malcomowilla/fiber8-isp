
import { Box, TextField, Autocomplete, Stack, InputAdornment, Button, } from '@mui/material';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
// import InputLabel from '@mui/material/InputLabel';
// import MenuItem from '@mui/material/MenuItem';
// import FormControl from '@mui/material/FormControl';
// import Select from '@mui/material/Select';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import LoadingButton from '@mui/lab/LoadingButton';
import CloseIcon from '@mui/icons-material/Close';

import {useApplicationSettings} from '../settings/ApplicationSettings'
import {  useState, useEffect, useMemo, useRef, useCallback} from 'react'
import { useDebounce } from 'use-debounce';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { MdOutlineMailOutline } from "react-icons/md";
import { MdOutlinePerson } from "react-icons/md";
import { FaRegUser } from "react-icons/fa";
import { TbLockPassword } from "react-icons/tb";
import { FaHouseChimneyUser } from "react-icons/fa6";
import { FaRegBuilding } from "react-icons/fa";
import { GiCycle } from "react-icons/gi";
import { MdOutlineBlock } from "react-icons/md";

import { MdErrorOutline } from "react-icons/md";


import { 
   
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Divider,
  Typography,
  Grid,
  IconButton,
  Tooltip,
  CircularProgress,
  Snackbar,
  Alert
} from '@mui/material';

import { MdOutlineNetworkPing } from "react-icons/md";
import MaterialTable from 'material-table';


import { FaRandom } from "react-icons/fa";
import { FaCheckCircle } from "react-icons/fa";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CloudIcon from '@mui/icons-material/Cloud';
import WarningIcon from '@mui/icons-material/Warning';

import { MdNetworkPing } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { FaCalendarAlt } from "react-icons/fa";
import { IoWarningOutline } from "react-icons/io5";
import { MdOutlineOnlinePrediction } from "react-icons/md";




const Subscriptions = ({
  packageNamee,
  handleClose,

  formData,  createSubscriber, handleChangeForm, setFormData, isloading,
  setShowClientStatsAndSubscriptions, setOnlyShowSubscription,onlyShowSubscription

}) => {

  const {settingsformData, subscriberSettings, setSubscriberSettings} = useApplicationSettings()
  const {name, ref_no , ppoe_password,  ppoe_username,  phone_number, email, second_phone_number,
     package_name, installation_fee, subscriber_discount, date_registered, router_name,
     latitude, longitude, house_number, building_name
    }= formData



  const [poe_package,] = useDebounce(package_name, 1000)
  const [ routerName] = useDebounce( router_name, 1000)

  const [packageName, setPackageName] = useState([])
  const [routers, setRouters]= useState ([])

  const [initialPackage, setInitialPackage] = useState(null);
  const [mikrotik_router, setRouter] = useState(null)

    const [networks, setNetworks] = useState([]);
    const [ipAssigned, setIpAssigned] = useState(false);
    const [ipAddress, setIpAddress] = useState('');
    const [showMaterialTable, setShowMaterialTable] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [ips, setIps] = useState([])
    const [subscriptions, setSubscriptions] = useState([])
    const [onlineStatusData, setOnlineStatusData] = useState([]);



const subdomain = window.location.hostname.split('.')[0];








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
        const response = await fetch('/api/subscriptions', {
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
console.log('rowData subscription add',rowData)
getIps(rowData.network_name)
// setShowClientStatsAndSubscriptions(false)
// formData.id = rowData.id
// formData.network_name = rowData.network_name 
// formData.ip_address = rowData.ip_address


  setFormData(rowData)
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

  try {
        const method = formData.id ? 'PUT' : 'POST'
    const url = formData.id ? `/api/subscriptions/${formData.id}` : '/api/subscriptions'
        const response = await fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'X-Subdomain': subdomain
      },
      body: JSON.stringify({ subscription: formData }) // Must be wrapped under `subscription`
    })

 const newData = await response.json()

 if (response.ok) {
  


  if (formData.id) {

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

// const createSubscription = async(e) => {

//   e.preventDefault()

//   try {
//     const method = formData.id ? 'PUT' : 'POST'
//     const url = formData.id ? `/api/subscriptions/${formData.id}` : '/api/subscriptions'
//     const response = await fetch(url, {
//       method: method,
//       headers: {
//         'Content-Type': 'application/json',
//         'X-Subdomain': subdomain
//       },
//       body: JSON.stringify({ subscription: formData }) // Must be wrapped under `subscription`
//     })

// const newData = await response.json()

// if (response.ok) {
  
//   console.log('subscription created')
//   // setShowMaterialTable(false)
  

//   if (formData.id) {

//   toast.success('Subscription updated successfully', {position: "top-center", duration: 3000 })
//     setSubscriptions(subscriptions.map(item => item.id === newData.id ? newData : item))
//     setShowForm(false)
//   setShowMaterialTable(true)
//   } else {
//     const newData = await response.json()

//     toast.success('Subscription added successfully', {  position: "top-center", duration: 3000 })

//     setSubscriptions([...subscriptions, newData])
//     setShowForm(false)
//   setShowMaterialTable(true)

//   }
// } else {

//   toast.error('Error creating subscription', {  position: "top-center", duration: 3000 })
//   console.log('failed to create subscription')
//   setShowForm(true)
//   setShowMaterialTable(false)


// } 
//   } catch (error) {
    
//     toast.error('Error creating subscription server error', {  position: "top-center", duration: 3000 })
//     setShowMaterialTable(true)
//     setShowForm(false)
//     console.log(error)
//   }
// }



const handleIpChange = (event) => {
  const selectedIp = event.target.value;
  console.log('Changing IP to:', selectedIp); // Debug
  
  setFormData(prev => ({
    ...prev,
    ip_address: selectedIp
  }));
};




const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
const [networkToDelete, setNetworkToDelete] = useState(null);
const [loading, setLoading] = useState(false);

const getOnlineStatus = useCallback(async () => {
  try {
    const response = await fetch('/api/last_seen', {
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
  }, 10000);

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
              minWidth: '180px' // Ensures consistent width for status cells
            },
            render: rowData => {
              // Find status info or use empty object as fallback
              const statusInfo = onlineStatusData.find(item => 
                item.ppoe_username === rowData.ppoe_username
              ) || { status: 'offline' };
          
              // Status indicator configuration
              const statusConfig = {
                online: {
                  icon: (
                    <div className="relative inline-flex items-center">
                      <MdNetworkPing className={` ${ statusInfo.status === 'blocked'  ? 'text-red-700' : 'text-green-600'}  animate-ping absolute opacity-75`} />
                      <MdNetworkPing className="text-green-600 relative" />
                    </div>
                  ),
                  text: statusInfo.status === 'blocked' ? 'Blocked' : 'Online',
                  color: 'text-green-600',
                  bg: 'bg-green-50',
                  tooltip: 'Device is currently connected'
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
          
              const currentStatus = statusInfo.status in statusConfig 
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
            title: 'Type', 
            field: 'type',
            headerStyle: {
              color: 'black',
              fontWeight: 'bold',
              fontSize: '14px'
            }
          },
          { title: 'Package', field: 'package' ,
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
          { title: 'Node', field: 'node',  headerStyle: { color: 'black' }  },
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
          { title: 'Expiry', field: 'expiry' ,

            render: rowData => (
              <p style={{ color: 'black', fontSize: '15px' }}>
                {rowData.expiry}
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
                    setFormData({...formData, id: ''})
                    
                    setShowClientStatsAndSubscriptions(false)

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
          }
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
 {/* <button onClick={(e) => {
              e.preventDefault()
              handleClose()
            }} className='bg-red-600 mt-2 text-white rounded-3xl p-2
          transform hover:scale-110 transition duration-500 hover:bg-red-200  
          text-lg ' >
              Cancel
            </button> */}
  </>
)}




{showForm && (
  <>
 <div className='p-4 flex'>
   <IoWarningOutline className='text-orange-600 text-2xl' />

   <span className='flex text-lg text-orange-400'>Note- <p className=''>Editing subscription details will affect the current connected session.</p> </span>
    </div>
 <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Toaster />
      
      {/* Credentials Section */}
      <form onSubmit={createSubscription}>
      <Stack spacing={3} sx={{ mb: 3 }}>
        {subscriberSettings.use_autogenerated_number_as_ppoe_username && (
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
        )}

        {!subscriberSettings.use_autogenerated_number_as_ppoe_username && (
          <>
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
        )}
      </Stack>

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
        <InputLabel sx={{
          fontSize: '18px',
        }}>IPv4 Adreses</InputLabel>
<Select
  value={formData.ip_address || ''}
  onChange={handleIpChange}
  name="ip_address"
  label="IPv4 Address"
  required
>
  {ips.length > 0 ? (
    ips.map(ip => (
      <MenuItem key={ip} value={ip}>
        {ip}
        {/* {formData.ip_address || 'No IPs available'} */}
      </MenuItem>
    ))
  ) : (
    <MenuItem>
      {formData.ip_address || 'No IPs available'}
    </MenuItem>
  )}
</Select>
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
        <FormControl sx={{ mt: 3 }} fullWidth>
          <InputLabel>IPv4 Network</InputLabel>
          <Select
          value={formData.network_name}
          onChange={handleChangeNetwork}
          name='network_name'
          className='myTextField'
            label="IPv4 Network"
            required
            sx={{
              '& .MuiSelect-icon': {
                color: 'primary.main'
              }
            }}
          >
            {networks.map(network => (
              <MenuItem 
                key={network.id} 
                value={network.title}
                sx={{ display: 'flex', justifyContent: 'space-between' }}
              >
                <span>{network.title}</span>

                <Typography sx={{
                  p: 2,
                  color: 'primary.main',
                }} variant="caption" color="text.secondary">
                  {network.network} 
                </Typography>

                <Typography sx={{
                  p: 2,
                  color: 'primary.main',
                }} variant="caption" color="text.secondary">
                  {network.total_ip_addresses} IPs available
                </Typography>
              </MenuItem>
            ))}
          </Select>
        </FormControl>
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
                value={packageName.find((pkg) => pkg.name === formData.package_name) || null}
                options={packageName}
                getOptionLabel={(option) => option.name}
                renderInput={(params) => (
                  <TextField className='myTextField' {...params} label="Select Package" variant="outlined" fullWidth />
                )}
                onChange={(event, newValue) => {
                  setFormData({ ...formData, package_name: newValue ? newValue.name : '' });
                }}
                sx={{ mb: 2 }}
              />
               <Box
      sx={{
        '& > :not(style)': { m: 1, },
      }}>
            <TextField fullWidth label='validity-period'   sx={{

'& label.Mui-focused': {
  color: 'black',
  fontSize:'16px'

  },
'& .MuiOutlinedInput-root': {
"&.Mui-focused .MuiOutlinedInput-notchedOutline": {
  borderColor: "black",
  borderWidth: '3px'
  },
'&.Mui-focused fieldset':  {
  borderColor: 'black', // Set border color to transparent when focused

}
},
         
        }}    className='myTextField' value={formData.validity}   
            id='validity' 
        onChange={handleChangeForm}   placeholder='validity-period...' type='number' ></TextField>

</Box>



<FormControl  


  sx={{
    '& > :not(style)': { m: 1,  },

'& label.Mui-focused': {
  color: 'black',
  fontSize:'16px'
  },
'& .MuiOutlinedInput-root': {
"&.Mui-focused .MuiOutlinedInput-notchedOutline": {
  borderColor: "black",
  borderWidth: '3px'
  },
'&.Mui-focused fieldset':  {
  borderColor: 'black', // Set border color to transparent when focused

}
},
         
        }}   >
        <InputLabel id="validity_period_units">Validity period units</InputLabel>
        <Select
          id="validity_period_units"
          label="Validity-period-units"
          
          value={formData.validity_period_units}
          onChange={e=> setFormData({...formData, validity_period_units: e.target.value})}

        >
          <MenuItem value={'days'}>days</MenuItem>
          <MenuItem value={'hours'}>hours</MenuItem>
        </Select>
      </FormControl>
            </Box>
          </div>
          <div className="flex gap-4 mt-6">

          <button  className='bg-black text-white rounded-3xl px-4 py-2
          transform hover:scale-110 transition duration-500 hover:bg-green-500
          text-lg' type="submit">
              Save
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

<GiCycle className='text-green-500 cursor-pointer'/>
</Tooltip>


<Tooltip title='Block service'>
          <MdOutlineBlock className='text-red-500 cursor-pointer'/>
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
