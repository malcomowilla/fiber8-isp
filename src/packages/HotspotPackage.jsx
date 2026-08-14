import DeleteIcon from '@mui/icons-material/Delete';

import EditIcon from '@mui/icons-material/Edit';

import { IconButton, Typography,
  Box,
  Button, 
  Divider, 
   Card,
  CardContent,
  Grid, } from '@mui/material';
  import {
  Payment as PaymentIcon,
  Description as DescriptionIcon,
  LocationOn as LocationIcon,
  Assignment as AssignmentIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Save as SaveIcon,
  Close as CloseIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';
import GetAppIcon from '@mui/icons-material/GetApp';
import {  useState, useCallback} from 'react'
import LoadingAnimation from '../loader/loading_animation.json'
import Lottie from 'react-lottie';

import Backdrop from '@mui/material/Backdrop';
import AddIcon from '@mui/icons-material/Add';
import MaterialTable from 'material-table'
import EditHotspotPackage from '../edit/EditHotspotPackage'
import toast, { Toaster } from 'react-hot-toast';
import { useEffect } from 'react';
import DeleteHotspotPackage from '../delete/DeleteHotspotPackage'
import {useApplicationSettings} from '../settings/ApplicationSettings'
import { RiHotspotLine } from "react-icons/ri";

import dayjs from 'dayjs';
import { useDebounce } from 'use-debounce';

import CircularProgress from "@mui/material/CircularProgress"; // Import CircularProgress for loading animation

import { useMemo } from 'react';

import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Chip, Tooltip } from '@mui/material';
import { RefreshCw } from 'lucide-react';



const HotspotPackage = () => {

  const [open, setOpen] = useState(false);
const [loading, setLoading] = useState(false);
const [openLoad, setOpenLoad] = useState(false)
const [packages, setPackages] = useState([])
const [isOpenDelete, setisOpenDelete] = useState(false)

const {settingsformData, setFormData, setNasSettingsForm, nasSettingsForm} = useApplicationSettings()

const [search, setSearch] = useState('')

const [searchInput] = useDebounce(search, 1000)
const [isSearching, setIsSearching] = useState(false); // New state for search loading

// Per-row "syncing" flags, keyed by package id, and a flag for the
// bulk-sync button — these drive the spinner / disabled states.
const [syncingIds, setSyncingIds] = useState({});
const [bulkSyncing, setBulkSyncing] = useState(false);

const [hotspotPackage, setHotspotPackage] = useState({
  name: '',
  validity: '',
  download_limit: '',
  upload_limit: '',
  price:  '',
  upload_burst_limit: '',
  valid_from: dayjs(),
  valid_until: dayjs(),
  shared_users: '',
  download_burst_limit: '',
  validity_period_units: '',
  weekdays: [] ,
  location: '',
   burst_enabled:            false,
  burst_limit_download:     '',
  burst_limit_upload:       '',
  burst_threshold_download: '',
  burst_threshold_upload:   '',
  burst_time:               '',
  enable_free_trial: false,
  free_trial_duration_minutes: '',
  free_trial_download_limit: '',
  free_trial_upload_limit: '',
  nas_router: ''

})
const [selectedRouter, setSelectedRouter] = useState('')

const [editing, setEditing] = useState(false);
        const [nodes, setNodes] = useState([])


// const navigate = useNavigate()

const handleWeekdayChange = (day) => {
  setHotspotPackage((prev) => {
    const updatedWeekdays = prev.weekdays?.includes(day)
      ? prev.weekdays?.filter((d) => d !== day) // Remove day if already selected
      : [...(prev.weekdays || []), day]; // Add day if not selected

    return { ...prev, weekdays: updatedWeekdays };
  });
};






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




const handleClickOpen = (rowData) => {
  setOpen(true);
  setEditing(false)
  setHotspotPackage(rowData);

};

  const handleClose = () => {
    setOpen(false);
  };


const handleChangeTimeFrom = (date)=> {  
  setHotspotPackage({...hotspotPackage, valid_from: date})
}



const handleChangeTimeUntil = (date)=> {  
  setHotspotPackage({...hotspotPackage, valid_until: date})
}




  // handleClose, loading, open

  const DeleteButton = ({ id }) => (
        <IconButton style={{ color: '#8B0000' }}  onClick={() => setisOpenDelete(true)}>
          <DeleteIcon />
        </IconButton>
      );


  const EditButton = ({rowData}) => (
    <IconButton style={{color: 'green'}}  onClick={() => handleClickOpen(rowData)}>
      <EditIcon />
    </IconButton>
  );


const columns = [
  {title: 'names', field: 'name', render: (rowData) => (
    <span className="font-sans font-medium text-gray-800 dark:text-white">{rowData.name}</span>
  ) },

    // {title: 'Size', field: 'Size',  type: 'numeric', align: 'left'},
    {title: 'price', field: 'price', render: (rowData) => (
      <span className="font-sans text-gray-700 dark:text-gray-200">{rowData.price}</span>
    ) },
    // {title: 'Valid From', field: 'valid_from', 
    //   render: rowData => rowData.valid_from ? dayjs(rowData.valid_from).format('hh:mm A')
    //   : 'N/A'
    //  },
     

  {title: 'Speed(Up/Down)', field: 'package_speed',   defaultSort: 'asc',


    render: (rowData) => 
      <span className="font-sans text-gray-700 dark:text-gray-200">
        {rowData.package_speed === null ||  rowData.package_speed === 'null' || rowData.package_speed === '' 
          ? 'unlimited'
          : rowData.package_speed }
      </span>
   },

  // {title: 'Validity', field: 'Validity', type: 'numeric',  align: 'right'},
  {title: 'validity', field: 'valid', render: (rowData) => (
    <span className="font-sans text-gray-700 dark:text-gray-200">{rowData.valid}</span>
  ) },
    {title: 'Router', field: 'nas_router', render: (rowData) => (
      <span className="font-sans text-xs text-gray-600 dark:text-gray-300">{rowData.nas_router || 'N/A'}</span>
    ) },
{
    title: 'Sync',
    field: 'sync_status',
    cellStyle: { minWidth: 170, whiteSpace: 'nowrap' },
    headerStyle: { minWidth: 170, whiteSpace: 'nowrap' },
    render: (rowData) => {
      if (nasSettingsForm?.use_radius) return <span className="text-xs text-gray-400 font-sans">RADIUS</span>;

      const isSyncing = !!syncingIds[rowData.id];

      const map = {
        synced: { label: 'Synced', bg: '#d1fae5', color: '#065f46' },
        not_synced: { label: 'Not synced', bg: '#fef3c7', color: '#92400e' },
        failed: { label: 'Failed', bg: '#fee2e2', color: '#991b1b' },
        syncing: { label: 'Syncing…', bg: '#dbeafe', color: '#1e40af' },
      };
      const s = isSyncing
        ? { label: 'Syncing…', bg: '#dbeafe', color: '#1e40af' }
        : (map[rowData.sync_status] || map.not_synced);

      return (
        <div className="flex items-center gap-1.5 font-sans">
          <Chip
            label={s.label}
            size="small"
            sx={{ backgroundColor: s.bg, color: s.color, fontWeight: 600, fontFamily: 'inherit' }}
          />
          <Tooltip title={rowData.sync_error || (isSyncing ? 'Syncing to router…' : 'Sync to MikroTik')}>
            <span>
              <IconButton
                size="small"
                disabled={isSyncing}
                onClick={(e) => { e.stopPropagation(); syncPackageToMikrotik(rowData.id); }}
              >
                <RefreshCw className={`w-3.5 h-3.5 text-blue-500 ${isSyncing ? 'animate-spin' : ''}`} />
              </IconButton>
            </span>
          </Tooltip>
        </div>
      );
    }
  },
  {title: 'Action', field:'Action', align: 'right',

  render: (params) =>  
    
     <>
      
       <DeleteButton {...params} />
       <EditButton {...params}/>
      
       </>


}


]




const defaultOptions = {
  loop: true,
  autoplay: true, 
  animationData: LoadingAnimation,
  rendererSettings: {
    preserveAspectRatio: 'xMidYMid slice'
  }
};

const handleRowClick = (event, rowData) => {
  setHotspotPackage(rowData);
  setEditing(true)
setHotspotPackage({
  ...rowData,
  valid_from: rowData.valid_from ? dayjs(rowData.valid_from, 'hh:mm A') : dayjs(),
  valid_until: rowData.valid_until ? dayjs(rowData.valid_until, 'hh:mm A') : dayjs(),
});

// setHotspotPackage((prevData) => ({
//   ...prevData,
//   valid_from: rowData.valid_from ? dayjs(rowData.valid_from).format('hh:mm A') : dayjs(rowData.valid_from).format('hh:mm A'),
//   valid_until: rowData.valid_until ? dayjs(rowData.valid_until).format('HH:mm:ss') : dayjs(new Date()).format('HH:mm:ss'),
// }));



  // Add your custom logic here, such as opening a modal or updating state
};







 const getNodes = useCallback(
    async() => {
     
      
      try {
        const response = await fetch('/api/nodes', {
          headers: { 'X-Subdomain': subdomain },
        });
        const data = await response.json();
        if (response.ok) {
          setNodes(data)
          
        } else {

        }
      } catch (error) {
        
      }
    },
    [],
  )
  

  useEffect(() => {
    getNodes()
   
  }, [getNodes]);


useEffect(() => {
  
  const fetchHotspotPackages = async() => {
    try {
      setIsSearching(true)
      const response = await fetch('/api/hotspot_packages', {
        headers: {
          'X-Subdomain': subdomain,
        }
      })
      const newData = await response.json()


      if (response.status === 402) {
        setTimeout(() => {
          // navigate('/license-expired')
          window.location.href='/license-expired'
         }, 1800);
        
      }
if (response.status === 401) {
  toast.error(<p  className="font-sans">newData.error</p>, {
    position: "top-center",
    duration: 4000,
  })
   setTimeout(() => {
          // navigate('/license-expired')
          window.location.href='/signin'
         }, 1900);
}
      if (response.ok) {



        // setPackages(newData)
        setIsSearching(false)
        setPackages(newData.filter((package_name)=> {
          return search.toLowerCase() === '' ? package_name : package_name.name.toLowerCase().includes(search)
        }))
      } else {

        if (response.status === 402) {
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
        setIsSearching(false)
        toast.error(<p  className="font-sans">failed to fetch hotspot packages</p>, {
          duration: 7000,
          position: "top-center",
        });
      }
    } catch (error) {
      setIsSearching(false)
      toast.error(<p className="font-sans">Something went wrong</p>, {
        duration: 7000,
        position: "top-center",
      });
      console.log(error)
    }
  }
  fetchHotspotPackages()
}, [searchInput]);



const createHotspotPackage = async (e) => {
  e.preventDefault();

   if (!selectedRouter) {
      toast.error(<p className='font-sans'>Please select a router</p>)
      return
    }
setLoading(true)
  try {
    
    const url = hotspotPackage.id ? `/api/update_hotspot_package/${hotspotPackage.id}?router_name=${settingsformData.router_name}` : '/api/hotspot_packages';
    // const url = '/api/hotspot_packages';
    const method = hotspotPackage.id ? 'PATCH' : 'POST';
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'X-Subdomain': subdomain,
      },
      body: JSON.stringify({...hotspotPackage, router_name: settingsformData.router_name}),
    });

    const newData = await response.json();

    if (response.status === 402) {
      setTimeout(() => {
        window.location.href = '/license-expired';
        // navigate('/license-expired')
       }, 1800);
      
    }


    if (response.status === 423) {
      setTimeout(() => {
        window.location.href = '/account-locked';
      //  navigate('/account-locked')
      }, 1800); 
     }


    if (response.ok) {
      setOpen(false); 
      setOpenLoad(false)
      setLoading(false);

setTimeout(() => {

}, 10000);
      if (hotspotPackage.id) {
        toast.success(<p  className="font-sans">Package updated successfully</p>, {
          duration: 5000,
          position: "top-center",
        });
        // Update existing package in tableData
        setPackages(packages.map(item => (item.id === hotspotPackage.id ? newData : item)));
      } else {
        // Add newly created package to tableData
        toast.success(<p className="font-sans" >Package created successfully</p>, {
          duration: 7000,
          position: "top-center",
        });
        setPackages([...packages, newData]);
      }
    } else {
      // setOpen(false)
      setLoading(false);
      setOpenLoad(false)

      if (hotspotPackage.id) {
        toast.error(<p  className="font-sans">Failed to update package</p>, {
          duration: 7000,
          position: "top-center",
        });


        toast.error(<p  className="font-sans">newData.error </p>, {
          duration: 7000,
          position: "top-center",
        });
      }else{

        toast.error(<p  className="font-sans">newData.error </p>, {
          duration: 7000,
          position: "top-center",
        });
        toast.error(<p  className="font-sans">Failed to create package</p>, {
          duration: 7000,
          position: "top-center",
        });
      }


    }
  } catch (error) {
    setOpen(false)
    setLoading(false)
    toast.error(<p  className="font-sans">Failed to create or update package something went wrong</p>, {
          duration: 7000,
          position: "top-center",
        });
  }
 
}










// Syncs a single package. Sets syncingIds[id] = true for the duration of the
// request so the row's Sync button/chip can show a spinner and disable
// itself — this is the loading state that was previously missing entirely.
const syncPackageToMikrotik = async (id) => {
  setSyncingIds(prev => ({ ...prev, [id]: true }));
  try {
    const response = await fetch(`/api/hotspot_packages/${id}/sync_to_mikrotik?router_name=${settingsformData.router_name}`, {
      method: 'POST',
      headers: { 'X-Subdomain': subdomain },
    });
    const newData = await response.json();
    if (response.ok) {
      setPackages(prev => prev.map(p => p.id === id ? { ...p, ...newData } : p));
      if (newData.sync_status === 'synced') {
        toast.success(<p className="font-sans">Package synced to router</p>, { position: 'top-center', duration: 3000 });
      } else {
        toast.error(<p className="font-sans">{newData.sync_error || 'Sync failed'}</p>, { position: 'top-center', duration: 4000 });
      }
    } else {
      toast.error(<p className="font-sans">{newData.error || 'Sync request failed'}</p>, { position: 'top-center', duration: 4000 });
    }
  } catch {
    toast.error(<p className="font-sans">Network error syncing package</p>, { position: 'top-center', duration: 4000 });
  } finally {
    setSyncingIds(prev => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  }
};

const bulkSyncPackagesToMikrotik = async () => {
  const unsynced = packages.filter(p => p.sync_status !== 'synced').map(p => p.id);
  if (unsynced.length === 0) {
    toast(<p className="font-sans">Nothing to sync</p>, { position: 'top-center' });
    return;
  }
  setBulkSyncing(true);
  // Mark every package we're about to touch as syncing so each row's chip
  // reflects it too, not just the bulk button.
  setSyncingIds(prev => {
    const next = { ...prev };
    unsynced.forEach(id => { next[id] = true; });
    return next;
  });
  try {
    const response = await fetch('/api/hotspot_packages/bulk_sync_to_mikrotik', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Subdomain': subdomain },
      body: JSON.stringify({ ids: unsynced, router_name: settingsformData.router_name }),
    });
    const results = await response.json();
    if (response.ok) {
      setPackages(prev => prev.map(p => {
        const r = results.find(x => x.id === p.id);
        return r ? { ...p, sync_status: r.sync_status, sync_error: r.sync_error } : p;
      }));
      const succeeded = results.filter(r => r.sync_status === 'synced').length;
      toast.success(<p className="font-sans">Synced {succeeded}/{results.length} packages</p>, { position: 'top-center', duration: 4000 });
    } else {
      toast.error(<p className="font-sans">Bulk sync failed</p>, { position: 'top-center', duration: 4000 });
    }
  } catch {
    toast.error(<p className="font-sans">Network error during bulk sync</p>, { position: 'top-center', duration: 4000 });
  } finally {
    setBulkSyncing(false);
    setSyncingIds(prev => {
      const next = { ...prev };
      unsynced.forEach(id => { delete next[id]; });
      return next;
    });
  }
};








const deleteHotspotPackage = async (id) => {
  try {
    const response = await fetch(`/api/hotspot_packages/${id}?router_name=${settingsformData.router_name}`, {
      method: "DELETE",
      headers: { 'X-Subdomain': subdomain },
    })

    const newData = await response.json()

    if (response.ok) {
      setisOpenDelete(false)
      setPackages((tableData)=> tableData.filter(item => item.id !== id))
      if (newData.mikrotik_error) {
        toast.error(<p className="font-sans">Deleted, but router cleanup failed: {newData.mikrotik_error}</p>, {
          duration: 6000,
          position: "top-center",
        });
      } else {
        toast.success(<p className="font-sans">Package deleted successfully</p>, {
          duration: 5000,
          position: "top-center",
        });
      }
    } else {
      setisOpenDelete(false)
      toast.error(<p className="font-sans">{newData.error || 'Failed to delete package'}</p>, {
        duration: 5000,
        position: "top-center",
      });
    }
  } catch (error) {
    setisOpenDelete(false)
    toast.error(<p className="font-sans">Something went wrong, please try again</p>, {
      duration: 7000,
      position: "top-center",
    });
  }
}


  return (

    <>
    <Toaster />
    < DeleteHotspotPackage isOpenDelete={isOpenDelete} setisOpenDelete={setisOpenDelete}
    deleteHotspotPackage={deleteHotspotPackage} loading={loading} id={hotspotPackage.id}
    />
    <EditHotspotPackage open={open} handleClose={handleClose}
    handleChangeTimeFrom={handleChangeTimeFrom} handleChangeTimeUntil={handleChangeTimeUntil}
    loading={loading} hotspotPackage={hotspotPackage} setHotspotPackage={setHotspotPackage}
    createHotspotPackage={createHotspotPackage}
    handleWeekdayChange={handleWeekdayChange} nodes={nodes} setNodes={setNodes}
    editing={editing} selectedRouter={selectedRouter} setSelectedRouter={setSelectedRouter}
    />




    {loading &&    <Backdrop open={openLoad} sx={{ color:'#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
  
  <Lottie className='relative z-50' options={defaultOptions} height={400} width={400} />
    
     </Backdrop>
  }
    <div className='font-sans'>

            
{/*           

<Grid item xs={12} sm={6} md={3}>
          <Card elevation={2}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <LocationIcon color="success" sx={{ mr: 1 }} />
                <Typography variant="h6">{nodes.length}</Typography>
              </Box>
              <Typography variant="body2" color="textSecondary">
                Total Locations
              </Typography>
            </CardContent>
          </Card>
        </Grid> */}

    <div className="flex items-center max-w-sm mx-auto p-3">  
     
     <div className="relative w-full">
         <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
             {/* <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none" viewBox="0 0 18 20">
                 <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                  strokeWidth="2" d="M3 5v10M3 5a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm0 10a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm12 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm0 0V6a3 3 0 0 0-3-3H9m1.5-2-2 2 2 2"/>
             </svg> */}
             <RiHotspotLine className='text-black dark:text-gray-300'/>
             
         </div>
 
 
         <input type="text" value={search} onChange={(e)=> setSearch(e.target.value)}
          className="font-sans bg-gray-50 border border-gray-300 text-gray-900 
         text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full ps-10 p-2.5 
           dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white
           dark:focus:ring-green-500 dark:focus:border-green-500"
            placeholder="Search for hotspot packages..."  />
     </div>
     <button type="" className="p-2.5 ms-2 text-sm font-medium text-white bg-green-700 
     rounded-lg border border-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none
      focus:ring-green-300 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">
         <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
             <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
              strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
         </svg>
         <span className="sr-only">Search</span>
     </button>
 </div>



<div style={{ maxWidth: "100%", position: "relative" }}>
  

  {isSearching ? (
  
  <div className="absolute inset-0 flex justify-center cursor-pointer items-center  
   bg-opacity-70 z-[2] mb-[50rem]">
      <CircularProgress size={90} color="inherit" className='text-black dark:text-white' /> 
      
      </div>
    
  ) : (
    <div className='hidden'>
    <svg
      className="w-4 h-4"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 20 20"
    >
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
      />
    </svg>
    </div>
  )} 

  <ThemeProvider theme={tableTheme}>
  

      <MaterialTable columns={columns}
      onRowClick={handleRowClick}
      title={
        <div className="flex items-center gap-2">
          <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg">
            <RiHotspotLine className="w-5 h-5 text-white" />
          </div>
          <p className='font-sans text-xl font-bold text-gray-800 dark:text-white'>Hotspot Packages</p>
        </div>
      }
      
      data={packages}

      actions={[
        {
          icon:()=><GetAppIcon/>,
          tooltip: 'import'
        },
        {
          icon: () => <AddIcon  onClick={()=> {
            setOpen(true)
            setHotspotPackage({})
            setEditing(false)
          }  } />,
          isFreeAction: true,
          tooltip: 'Add Hotspot Package'
        },
        !settingsformData?.use_radius && {
          icon: () => (
            <button
              className="flex items-center gap-2 bg-purple-500 text-white px-3 py-2 rounded-lg hover:bg-purple-600 disabled:opacity-60 disabled:cursor-not-allowed transition-colors font-sans"
              onClick={bulkSyncPackagesToMikrotik}
              disabled={bulkSyncing}
            >
              <RefreshCw className={`w-4 h-4 ${bulkSyncing ? 'animate-spin' : ''}`} />
              <span className="text-sm font-medium font-sans">{bulkSyncing ? 'Syncing…' : 'Sync All'}</span>
            </button>
          ),
          isFreeAction: true,
          tooltip: 'Sync unsynced packages to router'
        }
    ].filter(Boolean)}

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
      actionsColumnIndex: -1,
      headerStyle: {
        fontFamily: 'inherit',
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
        fontFamily: 'inherit',
      }),
    }}
      
      
      
      />
</ThemeProvider>

    </div>
    </div>

    </>
  )
}

export default HotspotPackage