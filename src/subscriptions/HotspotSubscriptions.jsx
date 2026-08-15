
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
  BarChart3,
   TrendingDown, Download, Upload,
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

import { ThemeProvider, createTheme } from '@mui/material/styles';

import { useMemo } from 'react';






const HotspotSubscriptions = () => {

  const [search, setSearch] = useState('')
  const [searchInput] = useDebounce(search, 1000)
  const [isSearching, setIsSearching] = useState(false); // New state for search loading
  const [openSendVoucher, setOpenSendVoucher] = useState(false);
  const [editVoucher, setEditVoucher] = useState(false);
    const iconRef = useRef(null);




const [anchorEl, setAnchorEl] = useState(null);

  const { settingsformData, setFormData, selectedProvider, setSelectedProvider, 
    setSmsSettingsForm, setNasSettingsForm, nasSettingsForm
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



const subdomain = window.location.hostname.split('.')[0]


  const handleGetNasSettings = useCallback(async () => {
    try {
      const response = await fetch('/api/nas_settings', { headers: { 'X-Subdomain': subdomain } });
      const newData = await response.json();
      if (response.ok) setNasSettingsForm({ ...nasSettingsForm, notification_when_unreachable: newData[0].notification_when_unreachable, 
        unreachable_duration_minutes: newData[0].unreachable_duration_minutes, 
        use_radius:newData[0].use_radius,
        notification_phone_number: newData[0].notification_phone_number });
    } catch {}
  }, []);

  useEffect(() => { handleGetNasSettings(); }, [handleGetNasSettings]);




function useIsDarkMode() {
  const [isDark, setIsDark] = useState(
    () => typeof document !== 'undefined' &&
      document.documentElement.classList.contains('dark')
  );

  useEffect(() => {
    const root = document.documentElement;

    const update = () => setIsDark(root.classList.contains('dark'));
    update();

    const observer = new MutationObserver(update);
    observer.observe(root, { attributes: true, attributeFilter: ['class'] });

    return () => observer.disconnect();
  }, []);

  return isDark;
}




const isDark = useIsDarkMode();

const tableTheme = useMemo(() => createTheme({
  palette: {
    mode: isDark ? 'dark' : 'light',
    background: {
      paper: isDark ? '#1e1e1e' : '#ffffff',
      default: isDark ? '#1e1e1e' : '#ffffff',
    },
    text: {
      primary: isDark ? '#f1f1f1' : '#1a1a1a',
      secondary: isDark ? '#a3a3a3' : '#6b7280',
    },
  },
}), [isDark]);





const handleCloseVoucherDetails = () => {
  setOpenVoucherDetails(false);
}

  const handleCloseDelete = () => {
    setOpenDelete(false);
  }






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
      <code className="font-mono text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
        {rowData.voucher}
      </code>
      <Tooltip title="Download / Print voucher">
        <IconButton
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            downloadVoucherCard(rowData);
          }}
          className="hover:bg-green-50"
        >
          <Download className="w-3.5 h-3.5 text-emerald-600" />
        </IconButton>
      </Tooltip>
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
  title: 'Sync',
  field: 'sync_status',
  headerClassName: 'dark:text-black',
  cellStyle: { minWidth: 170, whiteSpace: 'nowrap' },
  headerStyle: { minWidth: 170, whiteSpace: 'nowrap' },
  render: (rowData) => {
    if (nasSettingsForm?.use_radius) return <span className="text-xs text-gray-400 font-sans">RADIUS</span>;

    const isSyncing = !!syncingIds[rowData.id];
    const map = {
      synced: { label: 'Synced', bg: '#d1fae5', color: '#065f46' },
      not_synced: { label: 'Not synced', bg: '#fef3c7', color: '#92400e' },
      failed: { label: 'Failed', bg: '#fee2e2', color: '#991b1b' },
    };
    const s = isSyncing
      ? { label: 'Syncing…', bg: '#dbeafe', color: '#1e40af' }
      : (map[rowData.sync_status] || map.not_synced);

    return (
      <div className="flex items-center gap-1.5 font-sans">
        <Chip label={s.label} size="small" sx={{ backgroundColor: s.bg, color: s.color, fontWeight: 600, fontFamily: 'inherit' }} />
        <Tooltip title={rowData.sync_error || (isSyncing ? 'Syncing to router…' : 'Sync to MikroTik')}>
          <span>
            <IconButton size="small" disabled={isSyncing} onClick={(e) => { e.stopPropagation(); syncVoucherToMikrotik(rowData.id); }}>
              <RefreshCw className={`w-3.5 h-3.5 text-blue-500 ${isSyncing ? 'animate-spin' : ''}`} />
            </IconButton>
          </span>
        </Tooltip>
      </div>
    );
  }
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
      cellStyle: { minWidth: 100 }, headerStyle: { minWidth: 100 },
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
       cellStyle: { minWidth: 120 }, headerStyle: { minWidth: 120 },
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
      // sticky-actions-col: pinned via scoped CSS below (2nd from right)
      render: (rowData) => (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* <div className="relative">
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
            </div> */}
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
      // sticky-actions-col: pinned via scoped CSS below (last column)
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









// new state, alongside your other useState calls
const [syncingIds, setSyncingIds] = useState({});
const [bulkSyncing, setBulkSyncing] = useState(false);

const syncVoucherToMikrotik = async (id) => {
  setSyncingIds(prev => ({ ...prev, [id]: true }));
  try {
    const response = await fetch(`/api/hotspot_vouchers/${id}/sync_to_mikrotik?router_name=${settingsformData.router_name}`, {
      method: 'POST',
      headers: { 'X-Subdomain': subdomain },
    });
    const newData = await response.json();
    if (response.ok) {
      setVouchers(prev => prev.map(v => v.id === id ? { ...v, ...newData } : v));
      if (newData.sync_status === 'synced') {
        toast.success('Voucher synced to router', { position: 'top-center', duration: 3000 });
      } else {
        toast.error(newData.sync_error || 'Sync failed', { position: 'top-center', duration: 4000 });
      }
    } else {
      toast.error(newData.error || 'Sync request failed', { position: 'top-center', duration: 4000 });
    }
  } catch {
    toast.error('Network error while syncing', { position: 'top-center', duration: 4000 });
  } finally {
    setSyncingIds(prev => { const next = { ...prev }; delete next[id]; return next; });
  }
};

// bulk_sync_to_mikrotik may answer two different ways depending on how the
// backend implements it: synchronously with an array of per-voucher
// results, OR (like the hotspot_packages bulk endpoint) by dispatching an
// async background job and immediately returning a plain
// { message, queued } object. Blindly calling `.find()` on the response
// assumes the first shape — if the backend actually does the second, that
// throws inside a setVouchers(prev => prev.map(...)) updater. React runs
// that updater during its own reconciliation, OUTSIDE this function's
// try/catch, so the error is never caught here: it becomes an unhandled
// exception that stops all further rendering (white screen), and every
// row that was optimistically marked "syncing" stays stuck that way
// forever since the `finally` block that would have cleared it never runs.
// Handling both shapes explicitly avoids that entirely.
const bulkSyncVouchersToMikrotik = async () => {
  const unsynced = vouchers.filter(v => v.sync_status !== 'synced').map(v => v.id);
  if (unsynced.length === 0) {
    toast('Nothing to sync', { position: 'top-center' });
    return;
  }
  setBulkSyncing(true);
  setSyncingIds(prev => {
    const next = { ...prev };
    unsynced.forEach(id => { next[id] = true; });
    return next;
  });
  try {
    const response = await fetch('/api/hotspot_vouchers/bulk_sync_to_mikrotik', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Subdomain': subdomain },
      body: JSON.stringify({ ids: unsynced, router_name: settingsformData.router_name }),
    });
    const data = await response.json();

    if (response.ok) {
      if (Array.isArray(data)) {
        // Synchronous per-voucher results came back — original behaviour.
        setVouchers(prev => prev.map(v => {
          const r = data.find(x => x.id === v.id);
          return r ? { ...v, sync_status: r.sync_status, sync_error: r.sync_error } : v;
        }));
        const succeeded = data.filter(r => r.sync_status === 'synced').length;
        toast.success(`Synced ${succeeded}/${data.length} vouchers`, { position: 'top-center', duration: 4000 });
        setSyncingIds(prev => {
          const next = { ...prev };
          unsynced.forEach(id => { delete next[id]; });
          return next;
        });
      } else {
        // Async job dispatched — nothing to read synchronously yet. Poll
        // getHotspotVouchers to pick up real sync_status once it lands,
        // and reconcile the syncing flags there (see getHotspotVouchers).
        toast.success(data.message || `Sync queued for ${data.queued ?? unsynced.length} vouchers`, {
          position: 'top-center',
          duration: 4000,
        });
        setTimeout(getHotspotVouchers, 4000);
        setTimeout(getHotspotVouchers, 9000);
        setTimeout(getHotspotVouchers, 16000);
        // Safety valve: force-clear any flags still stuck after 20s so a
        // row can never spin forever even if the job silently stalls.
        setTimeout(() => {
          setSyncingIds(prev => {
            const next = { ...prev };
            unsynced.forEach(id => { delete next[id]; });
            return next;
          });
        }, 20000);
      }
    } else {
      toast.error(data.error || 'Bulk sync failed', { position: 'top-center', duration: 4000 });
      setSyncingIds(prev => {
        const next = { ...prev };
        unsynced.forEach(id => { delete next[id]; });
        return next;
      });
    }
  } catch {
    toast.error('Network error during bulk sync', { position: 'top-center', duration: 4000 });
    setSyncingIds(prev => {
      const next = { ...prev };
      unsynced.forEach(id => { delete next[id]; });
      return next;
    });
  } finally {
    setBulkSyncing(false);
  }
};

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
        const filtered = newData.filter((voucher)=> {
          return search.trim() === ''
  ? voucher
  : (
      voucher.voucher?.toLowerCase().includes(search.toLowerCase()) ||
      voucher.phone?.includes(search) ||
      voucher.ip?.includes(search) ||
      voucher.status?.toLowerCase().includes(search.toLowerCase())
    )

        })
        setVouchers(filtered)
        // Reconcile optimistic "syncing" flags against the real
        // sync_status this fetch just returned — without this a row can
        // stay stuck showing "Syncing…" forever once a bulk job finishes,
        // since syncingIds is otherwise only cleared on the request's own
        // success/error path (see bulkSyncVouchersToMikrotik).
        setSyncingIds(prev => {
          let changed = false
          const next = { ...prev }
          filtered.forEach(v => {
            if (next[v.id] && v.sync_status !== 'syncing') {
              delete next[v.id]
              changed = true
            }
          })
          return changed ? next : prev
        })


        
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
      // toast.error('Error fetching SMS settings, We're having trouble completing this request.', {
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
        if (newData.mikrotik_error) {
          toast.error(`Deleted, but router cleanup failed: ${newData.mikrotik_error}`, {
            position: "top-center",
            duration: 6000,
          })
        } else {
          toast.success('Voucher deleted successfully', {
            position: "top-center",
            duration: 4000,
          })
        }
        setOpenDelete(false)
      }else{
        setOpenDelete(false)
        toast.error(newData.error || 'Failed to delete voucher', {
          position: "top-center",
          duration: 4000,
        })
      }
    } catch (error) {
      toast.error('Failed to delete voucher server error', {
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







const downloadVoucherCard = (rowData) => {
  const generatedDate = new Date().toLocaleString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(rowData.voucher)}`;

  const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>WiFi Voucher - ${rowData.voucher}</title>
<style>
  * { margin:0; padding:0; box-sizing:border-box; font-family:'Segoe UI', Arial, sans-serif; }
  body { background:#f1f5f9; padding:24px; display:flex; justify-content:center; }
  .card {
    width:380px; background:#ffffff; border-radius:20px; overflow:hidden;
    box-shadow:0 10px 30px rgba(0,0,0,0.08); border:1px solid #e2e8f0;
  }
  .header {
    background:linear-gradient(135deg, #10b981, #059669);
    color:#fff; padding:20px 24px; display:flex; align-items:center; justify-content:space-between;
  }
  .header h1 { font-size:16px; font-weight:700; letter-spacing:0.5px; }
  .header .badge {
    background:rgba(255,255,255,0.2); padding:4px 10px; border-radius:999px; font-size:11px; font-weight:600;
  }
  .scan-note {
    text-align:center; padding:14px 24px 0; color:#64748b; font-size:12px; font-weight:600;
    text-transform:uppercase; letter-spacing:1px;
  }
  .qr-wrap { display:flex; justify-content:center; padding:16px 24px; }
  .qr-wrap img { width:160px; height:160px; border-radius:12px; border:1px solid #e2e8f0; padding:8px; }
  .code-section { text-align:center; padding:0 24px 16px; }
  .code-label { font-size:11px; color:#94a3b8; text-transform:uppercase; letter-spacing:1.5px; font-weight:600; margin-bottom:6px; }
  .code {
    font-family:'Courier New', monospace; font-size:32px; font-weight:800; color:#059669;
    letter-spacing:4px; background:#f0fdf4; border:2px dashed #10b981; border-radius:12px;
    padding:12px 0; margin:0 8px;
  }
  .stats {
    display:grid; grid-template-columns:1fr 1fr; gap:1px; background:#e2e8f0;
    margin:0 24px; border-radius:12px; overflow:hidden; border:1px solid #e2e8f0;
  }
  .stat { background:#fff; padding:12px 14px; }
  .stat-label { font-size:10px; color:#94a3b8; text-transform:uppercase; letter-spacing:1px; font-weight:600; margin-bottom:4px; }
  .stat-value { font-size:14px; color:#1e293b; font-weight:700; }
  .instructions { margin:16px 24px 0; background:#f8fafc; border-radius:12px; padding:14px 16px; }
  .instructions-title { font-size:11px; font-weight:700; color:#1e293b; text-transform:uppercase; letter-spacing:1px; margin-bottom:8px; }
  .instructions ol { padding-left:18px; color:#475569; font-size:12px; line-height:1.7; }
  .footer { padding:16px 24px 22px; text-align:center; }
  .footer .note { font-size:10px; color:#94a3b8; margin-bottom:4px; }
  .footer .support { font-size:11px; color:#64748b; font-weight:600; }
  .divider { height:1px; background:repeating-linear-gradient(90deg,#cbd5e1 0 6px, transparent 6px 12px); margin:14px 24px 0; }
  @media print {
    body { background:#fff; padding:0; }
    .card { box-shadow:none; border:1px solid #ccc; }
  }
</style>
</head>
<body>
  <div class="card">
    <div class="header">
      <h1>📶 WiFi Hotspot Voucher</h1>
      <span class="badge">${rowData.status?.toUpperCase() || 'ACTIVE'}</span>
    </div>

    <p class="scan-note">Scan to activate instantly</p>
    <div class="qr-wrap">
      <img src="${qrUrl}" alt="QR Code" />
    </div>

    <div class="code-section">
      <div class="code-label">Voucher Code</div>
      <div class="code">${rowData.voucher}</div>
    </div>

    <div class="stats">
      <div class="stat">
        <div class="stat-label">Speed</div>
        <div class="stat-value">${rowData.speed_limit || 'Unlimited'}</div>
      </div>
      <div class="stat">
        <div class="stat-label">Data Limit</div>
        <div class="stat-value">${rowData.data_limit || 'Unlimited'}</div>
      </div>
      <div class="stat">
        <div class="stat-label">Validity</div>
        <div class="stat-value">${rowData.validity || rowData.package || 'N/A'}</div>
      </div>
      <div class="stat">
        <div class="stat-label">Devices</div>
        <div class="stat-value">${rowData.shared_users || 1} device(s)</div>
      </div>
    </div>

    <div class="instructions">
      <div class="instructions-title">How to Connect</div>
      <ol>
        <li>Connect to WiFi network: <b>Hotspot</b></li>
        <li>Open your web browser (any website)</li>
        <li>Enter voucher code: <b>${rowData.voucher}</b></li>
        <li>Click "Connect" and enjoy your internet!</li>
      </ol>
    </div>

    <div class="divider"></div>

    <div class="footer">
      <p class="note">This voucher is valid for one-time use only.</p>
      <p class="support">Support: support@isp.com</p>
      <p class="note" style="margin-top:6px;">Generated on ${generatedDate}</p>
    </div>
  </div>
</body>
</html>`;

  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `voucher_${rowData.voucher}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};




  

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

    

      <Toaster />

      <EditVoucher 
        open={open} 
        handleClose={handleClose}
        voucherForm={voucherForm} 
        createVoucher={createVoucher}
        setVoucherForm={setVoucherForm}
        handleChangeVoucher={handleChangeVoucher}
        editVoucher={editVoucher}
        loading={loading}
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
                   dark:focus:border-green-500 font-sans
" 
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
          
          {/* <div className="flex items-center gap-2">
            <button
              onClick={() => setOpenCompensationVoucher(true)}
              className="flex items-center gap-2 bg-gradient-to-r
               from-green-500 to-emerald-600
                text-white px-4 py-2.5 rounded-lg hover:from-green-600 hover:to-emerald-700
                transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <FaHands className="text-white text-lg" />
              <span className="text-sm font-medium font-sans
">Compensate</span>
            </button>
          </div> */}
        </div>

        {/* Table Container */}
       <div className="hotspot-vouchers-table rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
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
          <p className="text-gray-600 dark:text-gray-300 font-sans
">
            Refreshing vouchers...</p>
        </div>
      </div>
    )}



      <ThemeProvider theme={tableTheme}>
    
    
    <MaterialTable 
      columns={columns}
      title={
        <div className="flex items-center gap-2 p-4">
          <div className="p-2 bg-gradient-to-r from-green-500
           to-green-500 rounded-lg">
            <Wifi className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-xl font-bold text-gray-800 font-sans dark:text-white">
              Hotspot Vouchers
            </p>
            <p className="text-sm text-gray-500  font-sans
 dark:text-gray-400">
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
            <button className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-cyan-500 text-white px-4 py-2 rounded-lg hover:bg-cyan-600 transition-all duration-200 shadow-sm hover:shadow-md"
              onClick={() => { getHotspotVouchers() }}
            >
              <RefreshCw className={`${isSpinning ? 'animate-spin' : ''}`} />
              <span className="text-sm font-medium font-sans">Refresh</span>
            </button>
          ),
          isFreeAction: true,
          tooltip: 'Refresh',
        },
        {
          icon: () => (
            <button className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-cyan-600"
              onClick={() => {
                handleClickOpen()
                setEditVoucher(false)
                setVoucherForm({ package: '', phone: '', shared_users: '', number_of_vouchers: '' })
              }}
            >
              <AddIcon />
              <span className="text-sm font-medium font-sans">Add Voucher</span>
            </button>
          ),
          isFreeAction: true,
          tooltip: 'Add New Voucher',
        },
        !settingsformData?.use_radius && {
  icon: () => (
    <button
      className="flex items-center gap-2 bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
      onClick={bulkSyncVouchersToMikrotik}
      disabled={bulkSyncing}
    >
      <RefreshCw className={bulkSyncing ? 'animate-spin' : ''} />
      <span className="text-sm font-medium font-sans">{bulkSyncing ? 'Syncing…' : 'Sync All to MikroTik'}</span>
    </button>
  ),
  isFreeAction: true,
  tooltip: 'Sync unsynced vouchers to router',
},
      ].filter(Boolean)}


      localization={{
        body: {
          emptyDataSourceMessage: (
            <div className="flex flex-col items-center
             justify-center py-12">
              <Wifi className="w-16 h-16 text-gray-300 mb-4" />
              <p className="text-gray-500 text-lg font-medium mb-2 font-sans
">
                No vouchers found
              </p>
              <p className="text-gray-400 text-sm font-sans
">
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
      pageSizeOptions: [2, 5, 10, 20],
      pageSize: 20,
      paginationPosition: 'bottom',
      exportButton: true,
      exportAllData: true,
      selection: true,
      search: false,
      searchAutoFocus: true,
      showSelectAllCheckbox: false,
      showTextRowsSelected: false,
      emptyRowsWhenPaging: false,
       padding: 'dense',
  columnsButton: true,
      actionsColumnIndex: -1,
      headerStyle: {
        fontFamily: 'monospace',
        textTransform: 'uppercase',
        fontWeight: 700,
        fontSize: '12px',
        backgroundColor: isDark ? '#2a2a2a' : '#f4f1ea',
        color: isDark ? '#f1f1f1' : '#1a1a1a',
        borderBottom: isDark ? '2px solid #3a3a3a' : '2px solid #e5e0d5',
      },
      rowStyle: (rowData, index) => ({
        backgroundColor: isDark
          ? (index % 2 === 0 ? '#1e1e1e' : '#262626')
          : (index % 2 === 0 ? '#ffffff' : '#fafaf7'),
        color: isDark ? '#f1f1f1' : '#1a1a1a',
        fontFamily: 'monospace',
      }),
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
    </ThemeProvider>
    
  </div>
</div>

{/*
  Pins the last two data columns ("Device & Actions" and "Actions") to the
  right edge so their icon buttons stay visible while the rest of the wide
  table (11 columns) scrolls underneath. Scoped to .hotspot-vouchers-table
  only, so it never touches any other material-table on the page.

  NOTE: the pixel offsets below are estimates based on the icon-button
  content in each column ("Actions" ~64px wide with a single small delete
  icon, "Device & Actions" ~120px wide with up to two icons). If the icons
  look misaligned or overlap column borders once you view it live, adjust
  --actions-col-width to match the actual rendered width of your last
  column (inspect it in devtools and copy the computed width).
*/}
<style>{`
  .hotspot-vouchers-table {
    --actions-col-width: 64px;
  }
  .hotspot-vouchers-table .MuiTableRow-root > *:nth-last-child(1) {
    position: sticky;
    right: 0;
    z-index: 2;
    background-color: inherit;
  }
  .hotspot-vouchers-table .MuiTableRow-root > *:nth-last-child(2) {
    position: sticky;
    right: var(--actions-col-width);
    z-index: 2;
    background-color: inherit;
  }
  .hotspot-vouchers-table .MuiTableHead-root .MuiTableRow-root > *:nth-last-child(-n+2) {
    z-index: 3;
  }
`}</style>
    </>
  )
}

export default HotspotSubscriptions