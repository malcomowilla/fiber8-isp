
import MaterialTable from 'material-table';
import AddIcon from '@mui/icons-material/Add';
import { FaPhoneVolume } from "react-icons/fa6";
import { FaHands } from "react-icons/fa";
import { useState, useEffect, useCallback, useRef } from 'react'
import { IconButton, Tooltip, Chip, Badge } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { IoIosQrScanner } from "react-icons/io";
import EditVoucher from '../edit/EditVoucher';
import toast, { Toaster } from 'react-hot-toast';
import LoadingAnimation from '../loader/loading_animation.json'
import Lottie from 'react-lottie';
import Backdrop from '@mui/material/Backdrop';
import {useApplicationSettings} from '../settings/ApplicationSettings'
import EditIcon from '@mui/icons-material/Edit';
import DeleteVoucher from '../delete/DeleteVoucher';
import { FaDesktop } from "react-icons/fa"; 
import { useDebounce } from 'use-debounce';
import CircularProgress from "@mui/material/CircularProgress"; // Import CircularProgress for loading animation
import SendVoucher from './SendVoucher';
import CompensationVoucher from '../edit/CompensationVoucher';
import { createConsumer } from "@rails/actioncable";
const cable = createConsumer(`wss://${window.location.hostname}/cable`);
// const cable = createConsumer(`ws://localhost:4000/cable`);
import VoucherDetails from './VoucherDetails';
import { IoEyeOutline } from "react-icons/io5";
import { 
   RefreshCw,
  BarChart3, TrendingDown, Download, Upload,
   Wifi, 
  Smartphone, 
  Calendar, 
  Clock,
  Globe,
  Cpu,
  Activity,
} from 'lucide-react';
import {FaCheckCircle} from "react-icons/fa";
import Popper from '@mui/material/Popper';
import Paper from '@mui/material/Paper';
import { Box, Button,
  Typography,
 } from '@mui/material';


const HotspotSubscriptions = () => {

  const [search, setSearch] = useState('')
  const [searchInput] = useDebounce(search, 1000)
  const [isSearching, setIsSearching] = useState(false); // New state for search loading
  const [openSendVoucher, setOpenSendVoucher] = useState(false);
  const [editVoucher, setEditVoucher] = useState(false);
    const iconRef = useRef(null);




const [anchorEl, setAnchorEl] = useState(null);

  const { settingsformData, setFormData, selectedProvider, setSelectedProvider, 
    setSmsSettingsForm
   } = useApplicationSettings();

  const [tableData, setTableData] = useState([])
  const [loading, setloading] = useState(false)
  const [open, setOpen] = useState(false);
  const [voucherForm, setVoucherForm] = useState({
    package: '',
    phone: '',  
    shared_users: '',
    number_of_vouchers: '',
    
  })

  const handleClosePopper = () => {
    setAnchorEl(null);
  };

  const openPopper = Boolean(anchorEl);
  const idPopper = openPopper ? 'logout-popover' : undefined;

  const [vouchers, setVouchers] = useState([])
  const [openLoad, setopenLoad] = useState(false)
  const [openDelete, setOpenDelete] = useState(false);
const [voucher, setVoucher] = useState('')
const [status, setStatus] = useState('')
const [expiration, setExpiration] = useState('')
const [useLimit, setUseLimit] = useState('')
const [speed, setSpeed] = useState('')
const [phone, setPhone] = useState('')
const [createdAt, setCreatedAt] = useState('')
const [updatedAt, setUpdatedAt] = useState('')
const [id, setId] = useState('')
const [time_paid, setTimePaid] = useState('')
const [payment_method, setPaymentMethod] = useState('')
const [reference, setReference] = useState('')
const [amount, setAmount] = useState('')
const [customer, setCustomer] = useState('')
const [isOnline, setIsOnline] = useState(false)
const [loadingLogout, setLoadingLogout] = useState(false)

const [openCompensationVoucher, setOpenCompensationVoucher] = useState(false);
const [openVoucherDetails, setOpenVoucherDetails] = useState(false);
const [isSpinning, setIsSpinning] = useState(false);
const [loginBy, setLoginBy] = useState('')

const selectedVoucherIdRef = useRef(id);
const isDetailsOpenRef = useRef(openVoucherDetails);

useEffect(() => {
  selectedVoucherIdRef.current = id;
}, [id]);

useEffect(() => {
  isDetailsOpenRef.current = openVoucherDetails;
}, [openVoucherDetails]);




const handleCloseVoucherDetails = () => {
  setOpenVoucherDetails(false);
}

  const handleCloseDelete = () => {
    setOpenDelete(false);
  }


  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: LoadingAnimation,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };
const subdomain = window.location.hostname.split('.')[0]





const handleChangeVoucher = (e) => {
setVoucherForm((prevState) => ({
 ...prevState,
  [e.target.name]: e.target.value
}))
}




  const handleRowClick = (event, rowData) => {
   setVoucher(rowData.voucher)
    setVoucherForm(rowData)
    setEditVoucher(true)
    setId(rowData.id)
    setStatus(rowData.status)
    setExpiration(rowData.expiration)
    setUseLimit(rowData.shared_users)
    setPhone(rowData.phone)
    setCreatedAt(rowData.created_at)
    setUpdatedAt(rowData.updated_at)
    setSpeed(rowData.speed_limit)
    setTimePaid(rowData.time_paid)
    setPaymentMethod(rowData.payment_method)
    setReference(rowData.reference)
    setAmount(rowData.amount)
    setCustomer(rowData.customer)
    setIsOnline(rowData.is_online)
    setLoginBy(rowData.login_by)
  }







useEffect(() => {
  const subscription = cable.subscriptions.create(
    { channel: "HotspotVoucherChannel", "X-Subdomain": subdomain },
    {
      received(data) {
        console.log('voucher channel received', data);
        // Assume the backend sends at least { id, is_online }
        if (data.id && data.is_online !== undefined) {
          // 1. Update the main vouchers arrayf
          setVouchers(prevVouchers =>
            prevVouchers.map(v =>
              v.id === data.id ? { ...v, is_online: data.is_online } : v
            )
          );

          // 2. If details are open and this is the selected voucher, update isOnline
          if (isDetailsOpenRef.current && selectedVoucherIdRef.current === data.id) {
            setIsOnline(data.is_online);
          }
        }
      },
      connected() {
        console.log('voucher channel connected');
      },
      disconnected() {},
    }
  );

  return () => subscription.unsubscribe();
}, [subdomain]); 



  const parseBackendDate = (dateString) => {
  if (!dateString) return null;
  
  // Parse date in format like "March 15, 2025 at 08:46 PM"
  const [monthDayYear, timePart] = dateString.split(' at ');
  const [month, day, year] = monthDayYear.replace(',', '').split(' ');
  const [time, period] = timePart.split(' ');
  let [hours, minutes] = time.split(':').map(Number);
  
  if (period === 'PM' && hours < 12) hours += 12;
  if (period === 'AM' && hours === 12) hours = 0;
  
  return new Date(`${month} ${day}, ${year} ${hours}:${minutes}:00`);
};

const calculateExpirationProgress = (expirationDate) => {
  const expiration = parseBackendDate(expirationDate);
  if (!expiration) return 100; // Treat invalid dates as expired
  
  const now = new Date();
  const totalMs = expiration - now;
  
  // If already expired
  if (totalMs <= 0) return 100;
  
  // If expiration is more than 1 year in the future (treat as full)
  if (totalMs > 365 * 24 * 60 * 60 * 1000) return 0;
  
  // Calculate percentage of time passed in the 1-year window
  const oneYearMs = 365 * 24 * 60 * 60 * 1000;
  const progress = 100 - (totalMs / oneYearMs) * 100;
  
  return Math.max(0, Math.min(100, progress));
};

const formatRemainingTime = (expirationDate) => {
  const expiration = parseBackendDate(expirationDate);
  if (!expiration) return 'No expiration';
  
  const now = new Date();
  const diffMs = expiration - now;
  
  if (diffMs <= 0) return 'Expired';
  
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHrs = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  
  return `${diffDays}d ${diffHrs}h ${diffMins}m remaining`;
};

  



    const columns = [
    { 
      title: 'Voucher', 
      field: 'voucher', 
      headerClassName: 'dark:text-black',
      render: (rowData) => (
        <div className="flex items-center gap-2">
          <Wifi className="w-4 h-4 text-blue-500" />
          <code className="font-mono text-sm bg-gray-100
           dark:bg-gray-800 px-2 py-1 rounded">
            {rowData.voucher}
          </code>
        </div>
      ),
    },
    { 
      title: 'Status', 
      field: 'status',  
      headerClassName: 'dark:text-black', 
      render: (rowData) => (
        <Chip
          label={rowData.status}
          size="small"
          className="font-semibold"
          sx={{
            backgroundColor: rowData.status === 'active' ? '#d1fae5' : 
                           rowData.status === 'expired' ? '#fee2e2' : '#fef3c7',
            color: rowData.status === 'active' ? '#065f46' : 
                  rowData.status === 'expired' ? '#991b1b' : '#92400e',
            fontWeight: 'bold',
          }}
        />
      )
    },
    {
      title: 'Expiration', 
      field: 'expiration', 
      headerClassName: 'dark:text-black',
      render: (rowData) => {
        const progress = calculateExpirationProgress(rowData.expiration);
        const remainingText = formatRemainingTime(rowData.expiration);
        const isExpired = progress >= 100;
        
        return (
          <Tooltip title={`Expires: ${rowData.expiration}`} arrow>
            <div className="flex flex-col w-40">
              <div className="flex items-center gap-1 mb-1">
                <Calendar className="w-3 h-3 text-gray-500" />
                <span className={`text-sm ${isExpired ? 'text-red-600' : 'text-green-600'}`}>
                  {remainingText}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5 dark:bg-gray-700">
                <div 
                  className="h-1.5 rounded-full transition-all duration-300" 
                  style={{ 
                    width: `${isExpired ? 100 : 100 - progress}%`,
                    background: isExpired 
                      ? 'linear-gradient(90deg, #ef4444, #f97316)'
                      : progress > 80 
                        ? 'linear-gradient(90deg, #f59e0b, #fbbf24)'
                        : 'linear-gradient(90deg, #10b981, #34d399)'
                  }}
                ></div>
              </div>
            </div>
          </Tooltip>
        );
      }
    },
    { 
      title: 'Package', 
      field: 'package',  
      headerClassName: 'dark:text-black',
      render: (rowData) => (
        <Chip
          label={<span className='text-black
             dark:text-white text-xs'>{rowData.package}</span>}
          size="small"
          variant="outlined"
          className="border-blue-200 text-blue-700"
        />
      )
    },
    { 
      title: 'Speed Limit', 
      field: 'speed_limit',  
      headerClassName: 'dark:text-black',
      render: (rowData) => (
        <div className="flex items-center gap-1">
          <Activity className="w-3 h-3 text-purple-500" />
          <span className="font-medium text-black dark:text-white">{rowData.speed_limit}</span>
        </div>
      )
    },
    { 
      title: 'Phone', 
      field: 'phone',  
      headerClassName: 'dark:text-black',
      render: (rowData) => (
        <div className="flex items-center gap-1">
          {rowData.sms_sent && <FaCheckCircle className="text-green-500" />}
          <Smartphone className="w-4 h-4 text-black " />
          <span className="text-sm text-black dark:text-white">{rowData.phone || 'N/A'}</span>
        </div>
      )
    },
    { 
      title: 'IP Address', 
      field: 'ip',  
      headerClassName: 'dark:text-black',
      render: (rowData) => (
        <div className="flex items-center gap-1">
          <Globe className="w-3 h-3 text-blue-500" />
          <code className="text-xs font-mono bg-gray-100
           dark:bg-gray-800 px-1.5 py-0.5 rounded">
            {rowData.ip || 'N/A'}
          </code>
        </div>
      )
    },
    { 
      title: 'MAC Address', 
      field: 'mac',  
      headerClassName: 'dark:text-black',
      render: (rowData) => (
        <div className="flex items-center gap-1">
          <Cpu className="w-3 h-3 text-green-500" />
          <code className="text-xs font-mono bg-gray-100
           dark:bg-gray-800 px-1.5 py-0.5 rounded">
            {rowData.mac ? rowData.mac.toUpperCase() : 'N/A'}
          </code>
        </div>
      )
    },
    { 
      title: 'Last Login', 
      field: 'last_logged_in',  
      headerClassName: 'dark:text-black',
      render: (rowData) => (
        <Tooltip title={rowData.last_logged_in || 'Never logged in'} arrow>
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3 text-gray-500" />
            <span className="text-xs text-gray-600 dark:text-white">
              {rowData.last_logged_in}
            </span>
          </div>
        </Tooltip>
      )
    },
    {
      title: "Device & Actions",
      field: "shared_users",
      headerClassName: "dark:text-black",
      render: (rowData) => (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="relative">
              <FaDesktop className="text-green-500" />
              {rowData.shared_users > 1 && (
                <Badge 
                  badgeContent={rowData.shared_users} 
                  color="primary" 
                  className="text-xs"
                  sx={{
                    '& .MuiBadge-badge': {
                      fontSize: '0.6rem',
                      height: '16px',
                      minWidth: '16px',
                    }
                  }}
                />
              )}
            </div>
            {/* <span className="text-sm">{rowData.device || 'Unknown'}</span> */}
          </div>
          
          <div className="flex items-center gap-1">
            {rowData.status === 'active' &&  (
              <Tooltip title="Send voucher to device">
                <IconButton 
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenSendVoucher(true);
                    setVoucher(rowData.voucher);
                  }}
                  className="hover:bg-green-50"
                >
                  <FaPhoneVolume className='text-green-500 text-lg'/>
                </IconButton>
              </Tooltip>
            )}
            
            <Tooltip title="View voucher details">
              <IconButton 
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRowClick(e, rowData);
                  setOpenVoucherDetails(true);
                }}
                className="hover:bg-blue-50"
              >
                <IoEyeOutline className='text-blue-500 text-lg'/>
              </IconButton>
            </Tooltip>
          </div>
        </div>
      ),
    },
    {
      title: 'Actions', 
      field: 'actions',  
      headerClassName: 'dark:text-black', 
      sorting: false,
      render: (rowData) => (
        <div className="flex items-center gap-1">
          {/* <Tooltip title="Edit voucher">
            <IconButton 
              size="small" 
              onClick={(e) => {
                e.stopPropagation();
                handleRowClick(e, rowData);
                setOpen(true);
              }}
              className="hover:bg-green-50"
            >
              <EditIcon className="text-green-600" fontSize="small" />
            </IconButton>
          </Tooltip>
           */}
          <Tooltip title="Delete voucher">
            <IconButton 
              size="small" 
              onClick={(e) => {
                e.stopPropagation();
                handleRowClick(e, rowData);
                setOpenDelete(true);
              }}
              className="hover:bg-red-50"
            >
              <DeleteIcon className="text-red-600" fontSize="small" />
            </IconButton>
          </Tooltip>
        </div>
      )
    }
  ];


 

  const handleClose = () => {
    setOpen(false);
  }

  const handleClickOpen = () => {
    setOpen(true);
  }








const logoutUser = async() => {
  try {
    setLoadingLogout(true)
    const response = await fetch('/api/disconnect_user', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          'X-Subdomain': subdomain,
        },
      body: JSON.stringify({ voucher: voucher })

    })

    if (response.ok) {
      toast.success('logged out successfully', {
        position: "top-center",
        duration: 4000,
      })
      handleCloseVoucherDetails()
      setLoadingLogout(false)
    } else {
      toast.error('failed to logout', {
        position: "top-center",
        duration: 4000,
      })
      handleCloseVoucherDetails()
      setLoadingLogout(false)
      
    }
  } catch (error) {
    handleCloseVoucherDetails()
    setLoadingLogout(false)
    toast.error('failed to logout, something went wrong, please try again', {
      position: "top-center",
      duration: 4000,
    })
    
  }

}

const fetchRouters = useCallback(
  async() => {
    try {
      const response = await fetch('/api/allow_get_router_settings', {
        headers: {
          'X-Subdomain': subdomain,
        },
      })
const newData = await response.json()
      if (response) {
        // console.log('fetched router settings', newData)
        const {router_name} = newData[0]
        setFormData({...settingsformData, router_name})
      } else {
        // console.log('failed to fetch router settings')
      }
    } catch (error) {
      // console.log(error)
    }
  },
  [],
)



  useEffect(() => {
   
    fetchRouters()
  }, [fetchRouters]);
  




const getHotspotVouchers = useCallback(
  async() => {
    try {
      setIsSearching(true)
      setIsSpinning(true)
      const response = await fetch('/api/hotspot_vouchers', {
        headers: {
          'X-Subdomain': subdomain, 
          },
      })
      const newData = await response.json()
      if (response.ok) {
        setIsSearching(false)
        setIsSpinning(false)
        setVouchers(newData)
        setVouchers(newData.filter((voucher)=> {
          return search.trim() === ''
  ? voucher
  : (
      voucher.voucher?.toLowerCase().includes(search.toLowerCase()) ||
      voucher.phone?.includes(search) ||
      voucher.ip?.includes(search) ||
      voucher.status?.toLowerCase().includes(search.toLowerCase())
    )

        }))


        
      } else {
        setIsSearching(false)
        setIsSpinning(false)


  if (response.status === 402) {
    toast.error(newData.error, {
      position: "top-center",
      duration: 4000,
    })
    
     setTimeout(() => {
          // navigate('/license-expired')
          window.location.href='/license-expired'
         }, 1800);
  }


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
        toast.error('Failed to fetch vouchers', {
          position: "top-center",
          duration: 4000,
        })
      }
    } catch (error) {
      setIsSpinning(false)
      setIsSearching(false)
      toast.error('Failed to fetch vouchers internal server error', {
        position: "top-center",
        duration: 4000,
      })
    }


  },
  [searchInput],
)




useEffect(() => {
  
  getHotspotVouchers()
}, [getHotspotVouchers]);





const fetchSavedSmsSettings = useCallback(
  async() => {
    
    try {
      const response = await fetch(`/api/saved_sms_settings`, {
        headers: {
          'Content-Type': 'application/json',
          'X-Subdomain': subdomain,
        },
      });
  
      const data = await response.json();

      const newData = data.length > 0 
      ? data.reduce((latest, item) => new Date(item.updated_at) > new Date(latest.updated_at) ? item : latest, data[0])
      : null;
  
      if (response.ok) {
        // console.log('Fetched SMS settings:', newData);
        const { api_key, api_secret, sender_id, short_code, sms_provider, partnerID } = newData[0];
        // setSmsSettingsForm({ api_key, api_secret, sender_id, short_code, partnerID });
        setSelectedProvider(sms_provider);
        // setSelectedProvider(newData[0].sms_provider);
      } else {
        toast.error('Failed to fetch SMS settings', {
          duration: 3000,
          position: 'top-center',
        });
      }
    } catch (error) {
      // toast.error('Error fetching SMS settings, We’re having trouble completing this request.', {
      //   duration: 3000,
      //   position: 'top-center',
      // });
    }
  },
  [],
)


useEffect(() => {
  fetchSavedSmsSettings();
 
}, [fetchSavedSmsSettings]);


  const createVoucher = async(e) => {
    e.preventDefault()
setloading(true)
setopenLoad(true)
    try {
      const url = voucherForm.id ? `/api/hotspot_vouchers/${voucherForm.id}?router_name=${settingsformData.router_name}` : '/api/hotspot_vouchers';
      const method = voucherForm.id ? 'PATCH' : 'POST';
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'X-Subdomain': subdomain,
        },
        body: JSON.stringify({...voucherForm, 
          router_name:settingsformData.router_name, use_radius: settingsformData.use_radius,
          selected_provider: selectedProvider
           
        })
      })

      const newData = await response.json()
      if (response.ok) {
        setOpen(false)
        setloading(false)
setopenLoad(false)
        // setVoucherForm({
        //   package: newData.package,
        //   phone_number: newData.phone,
        //   shared_users: newData.shared_users,
        // })
        
        toast.success('Voucher created successfully', {
          position: "top-center",
          duration: 4000,
        })
        if (voucherForm.id) {
          toast.success('Voucher updated successfully', {
            position: "top-center",
            duration: 4000,
          })
           setVouchers(vouchers.map(item => (item.id === voucherForm.id ? newData : item)));
        } else {
          
          // setVouchers([...vouchers, newData])
            setVouchers(prev => [...newData, ...prev]);

          // setVouchers(prev => [newData, ...prev])

           toast.success('Voucher created successfully', {
            position: "top-center",
            duration: 4000,
          })
        }
      } else {
        setloading(false)
setopenLoad(false)
        toast.error('Failed to create voucher', {
          position: "top-center",
          duration: 4000,
        })

        toast.error(newData.error, {
          position: "top-center",
          duration: 4000,
        })
      }


    } catch (error) {
      setloading(false)
setopenLoad(false)
      toast.error('Failed to create voucher server error', {
        position: "top-center",
        duration: 4000,
      })
    }
  }



  const deleteVoucher = async(id)=> { 
    try {
      
      const response = await fetch(`/api/hotspot_vouchers/${id}?router_name=${settingsformData.router_name}&use_radius=${settingsformData.use_radius}`, {
        method: "DELETE",
        headers: {
          'X-Subdomain': subdomain,
        },
      })

      const newData = await response.json()
      if (response.ok) {
        setVouchers((vouchers)=> vouchers.filter(item => item.id !== id))
        toast.success('Voucher deleted successfully', {
          position: "top-center",
          duration: 4000,
        })
        setOpenDelete(false)
      }else{
        setOpenDelete(false)
        toast.error('Failed to delete voucher', {
          position: "top-center",
          duration: 4000,
        })

        // toast.error(newData.error, {
        //   position: "top-center",
        //   duration: 4000,
        // })
      }
    } catch (error) {
      toast.error('Failed to delete voucher servere error', {
        position: "top-center",
        duration: 4000,
      })
    }
  }

  const handleCloseCompensationVoucher = () => {
    setOpenCompensationVoucher(false);
  }



  // Add this new function to get connection status badge
  const getConnectionStatus = (rowData) => {
    if (!rowData.last_logged_in) return 'offline';
    const lastLogin = parseBackendDate(rowData.last_logged_in);
    if (!lastLogin) return 'offline';
    
    const now = new Date();
    const diffHours = (now - lastLogin) / (1000 * 60 * 60);
    
    if (diffHours < 1) return 'online';
    if (diffHours < 24) return 'recent';
    return 'offline';
  };




  // Add this new function for metrics calculation
  const calculateMetrics = () => {
    if (!vouchers.length) return { active: 0, expired: 0, used: 0, online: 0 };
    
    const active = vouchers.filter(v => v.status === 'active').length;
    const expired = vouchers.filter(v => v.status === 'expired').length;
    const used = vouchers.filter(v => v.status === 'used').length;
    const online = vouchers.filter(v => {
      const status = getConnectionStatus(v);
      return status === 'online' && v.status === 'active';
    }).length;
    
    return { active, expired, used, online };
  };

  const metrics = calculateMetrics();

  return (
   <>
      <SendVoucher  
        open={openSendVoucher} 
        setOpen={setOpenSendVoucher}
        voucher={voucher} 
        useLimit={useLimit} 
        expiration={expiration}
      />

      <VoucherDetails  
        handleCloseVoucherDetails={handleCloseVoucherDetails}
        openVoucherDetails={openVoucherDetails} 
        voucher={voucher}
        status={status}
        expiration={expiration}
        useLimit={useLimit}
        speed={speed}
        phone={phone}
        time_paid={time_paid}
        payment_method={payment_method}
        reference={reference}
        amount={amount}
        customer={customer}
        createdAt={createdAt}
        updatedAt={updatedAt}
        id={id}
        isOnline={isOnline}
        loadingLogout={loadingLogout}
        logoutUser={logoutUser}
        loginBy={loginBy}
      />

      <DeleteVoucher  
        openDelete={openDelete} 
        handleCloseDelete={handleCloseDelete} 
        deleteVoucher={deleteVoucher} 
        id={voucherForm.id} 
        loading={loading}
      />

      <Backdrop open={openLoad} sx={{ color: '#fff',
         zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Lottie className='relative z-50' options={defaultOptions}
         height={400} width={400} />
      </Backdrop>

      <Toaster />

      <EditVoucher 
        open={open} 
        handleClose={handleClose}
        voucherForm={voucherForm} 
        createVoucher={createVoucher}
        setVoucherForm={setVoucherForm}
        handleChangeVoucher={handleChangeVoucher}
        editVoucher={editVoucher}
      />

      <CompensationVoucher 
        open={openCompensationVoucher}
        handleClose={handleCloseCompensationVoucher}
        voucherForm={voucherForm} 
        createVoucher={createVoucher}
        setVoucherForm={setVoucherForm}
        handleChangeVoucher={handleChangeVoucher}
      />
      
       

        <div className="flex flex-col md:flex-row gap-4 items-center
         justify-between p-4 bg-white dark:bg-gray-800 rounded-xl 
         shadow-sm border
          border-gray-200 dark:border-gray-700 mb-4">
          <div className="flex-1 w-full md:w-auto">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex
               items-center pointer-events-none">
                <IoIosQrScanner className='text-gray-400' />
              </div>
              <input 
                type="text" 
                value={search} 
                onChange={(e)=> setSearch(e.target.value)}
                className="pl-10 w-full bg-gray-50 border border-gray-300 
                  text-gray-900 text-sm rounded-lg focus:ring-green-500
                   focus:border-green-500 
                  p-2.5 dark:bg-gray-700 dark:border-gray-600
                   dark:placeholder-gray-400 
                  dark:text-white dark:focus:ring-green-500
                   dark:focus:border-green-500" 
                placeholder="Search vouchers by status, phone, IP..." 
              />
              {isSearching && (
                <div className="absolute inset-y-0 right-0 pr-3
                 flex items-center">
                  <RefreshCw className="animate-spin
                   text-blue-500 w-4 h-4" />
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setOpenCompensationVoucher(true)}
              className="flex items-center gap-2 bg-gradient-to-r
               from-green-500 to-emerald-600
                text-white px-4 py-2.5 rounded-lg hover:from-green-600 hover:to-emerald-700
                transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <FaHands className="text-white text-lg" />
              <span className="text-sm font-medium">Compensate</span>
            </button>
          </div>
        </div>

        {/* Table Container */}
       <div className="rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
  <div style={{ 
    maxWidth: "100%", 
    position: "relative",
    overflow: 'hidden' 
  }}>
    {isSearching && (
      <div className="absolute inset-0 flex justify-center cursor-pointer items-center  
        bg-white dark:bg-gray-800 bg-opacity-80 z-[2]">
        <div className="flex flex-col items-center gap-2">
          <RefreshCw className='animate-spin text-blue-500 w-8 h-8' />
          <p className="text-gray-600 dark:text-gray-300">
            Refreshing vouchers...</p>
        </div>
      </div>
    )}
    
    <MaterialTable 
      columns={columns}
      title={
        <div className="flex items-center gap-2 p-4">
          <div className="p-2 bg-gradient-to-r from-green-500
           to-green-500 rounded-lg">
            <Wifi className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-xl font-bold text-gray-800 dark:text-white">
              Hotspot Vouchers
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {vouchers.length} total vouchers • {metrics.active} active
            </p>
          </div>
        </div>
      }
      onRowClick={handleRowClick}
      data={vouchers}
      actions={[
        {
          icon: () => (
            <button className="flex items-center gap-2 bg-gradient-to-r
             from-green-500 to-cyan-500
              text-white px-4 py-2 rounded-lg 
               hover:bg-cyan-600
              transition-all duration-200 shadow-sm hover:shadow-md"
              onClick={() => {
                getHotspotVouchers()
              }}
            >
              <RefreshCw className={`${isSpinning ? 'animate-spin' : ''}`} />
              <span className="text-sm font-medium">Refresh</span>
            </button>
          ),
          isFreeAction: true,
          tooltip: 'Refresh',
        },
        {
          icon: () => (
            <button className="flex items-center gap-2 bg-green-500
            
              text-white px-4 py-2 rounded-lg 
               hover:bg-cyan-600
              "
              onClick={() => {
                handleClickOpen()
                setEditVoucher(false)
                setVoucherForm({
                  package: '',
                  phone: '',  
                  shared_users: '',
                  number_of_vouchers: '',
                })
              }}
            >
              <AddIcon />
              <span className="text-sm font-medium">Add Voucher</span>
            </button>
          ),
          isFreeAction: true,
          tooltip: 'Add New Voucher',
        },
      ]}
      localization={{
        body: {
          emptyDataSourceMessage: (
            <div className="flex flex-col items-center
             justify-center py-12">
              <Wifi className="w-16 h-16 text-gray-300 mb-4" />
              <p className="text-gray-500 text-lg font-medium mb-2">
                No vouchers found
              </p>
              <p className="text-gray-400 text-sm">
                Create your first voucher to get started!
              </p>
            </div>
          )
        },
        header: {
          actions: 'Actions'
        }
      }}
      options={{
        sorting: true,
        pageSizeOptions: [10, 25, 50],
        pageSize: 10,
        paginationType: 'stepped',
        exportButton: true,
        exportAllData: true,
        selection: false,
        search: false,
        searchAutoFocus: true,
        showSelectAllCheckbox: false,
        showTextRowsSelected: false,
        emptyRowsWhenPaging: false,
        headerStyle: {
          backgroundColor: '#f8fafc',
          color: '#1e293b',
          fontWeight: '600',
          fontSize: '0.875rem',
          borderBottom: '2px solid #e2e8f0',
          padding: '16px',
        },
        rowStyle: {
          '&:hover': {
            backgroundColor: '#f1f5f9',
            cursor: 'pointer'
          }
        },
        cellStyle: {
          padding: '12px 16px',
        },
     
        draggable: false,
      }}
      components={{
        Container: props => (
          <div 
            className="rounded-lg overflow-hidden border border-gray-200"
            style={{ 
              overflow: 'hidden',
              height: 'auto'
            }}
          >
            {props.children}
          </div>
        )
      }}
      style={{
        overflow: 'hidden', 
      }}
    />
  </div>
</div>
    </>
  )
}

export default HotspotSubscriptions






