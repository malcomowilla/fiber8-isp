
import MaterialTable from 'material-table'
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { IconButton, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import {useState,useEffect, useCallback,} from'react'
import dayjs from 'dayjs';
import SubscriberNotification from '../notification/SubscriberNotification'
import { IoPeople } from "react-icons/io5";
import { Tooltip,} from '@mui/material';
import { FaPhoneVolume } from "react-icons/fa6";
import LoadingAnimation from '../loader/loading_animation.json'
import Lottie from 'react-lottie';
import Backdrop from '@mui/material/Backdrop'
import DeleteSubscriber from '../delete/DeleteSubscriber'
import { useApplicationSettings } from '../settings/ApplicationSettings';
import toast, { Toaster } from 'react-hot-toast';
import { useDebounce } from 'use-debounce';
import CircularProgress from "@mui/material/CircularProgress"; 
import { motion } from 'framer-motion';
import { FaCircle } from 'react-icons/fa';
import { CiLocationOn } from "react-icons/ci";
import { FaRegBuilding } from "react-icons/fa";
import { FaCalendarCheck } from "react-icons/fa";
import { FaShareNodes } from "react-icons/fa6";
import { MdOutlinePhoneForwarded } from "react-icons/md";
import { GoPaperclip } from "react-icons/go";
import {useNavigate} from 'react-router-dom'
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { useMemo } from 'react';






const PPPOEsubscribers = () => {
  const { settingsformData,
showMenu1, setShowMenu1, showMenu2, setShowMenu2, showMenu3, setShowMenu3,
      showMenu4, setShowMenu4, showMenu5, setShowMenu5, showMenu6, setShowMenu6,
       showMenu7, setShowMenu7, showMenu8, setShowMenu8, showMenu9, setShowMenu9,
        showMenu10, setShowMenu10, showMenu11, setShowMenu11, showMenu12, setShowMenu12,
formDataSubscriber, setFormDataSubscriber,intialValueSubscriber,handleChangeSubscriber,
selectedLocations, setSelectedLocations,editingSubscriber, setEditingSubscriber,
tableDataSubscriber, setTableDataSubscriber,
   } = useApplicationSettings();
  // const navigate = useNavigate()

  const [open, setOpen] = useState(false);
// const [tableData, setTableData] = useState([])
const [loading, setloading] = useState(false)
const [savedNotification, setSavedNotification] = useState(false)
const [search, setSearch] = useState('')
const [openLoad, setOpenLoad] = useState(false)
const [openDelete, setOpenDelete] = useState(false)
const [showClientStatsAndSUbscriptions, setShowClientStatsAndSubscriptions] = useState(false)
const [onlyShowSubscription, setOnlyShowSubscription] = useState(false)

const [searchInput] = useDebounce(search, 1000)
const [isSearching, setIsSearching] = useState(false); 

const [subscriberId, setSubscriberId] = useState('')

const [statusFilter, setStatusFilter] = useState('all');
const [routers, setRouters] = useState([]);
const [routerFilter, setRouterFilter] = useState('all');
const statusCounts = useMemo(() => {
  const counts = { Active: 0, Online: 0, Throttled: 0, Expiring: 0, Expired: 0 };
  tableDataSubscriber.forEach((s) => {
    const st = (s.status || '').toLowerCase();
    if (st === 'active') counts.Active++;
    else if (st === 'online') counts.Online++;
    else if (st === 'throttled') counts.Throttled++;
    else if (st === 'expiring') counts.Expiring++;
    else if (st === 'expired') counts.Expired++;
  });
  return counts;
}, [tableDataSubscriber]);




const filteredSubscribers = useMemo(() => {
  return tableDataSubscriber.filter((s) => {
    const statusMatch =
      statusFilter === 'all' ||
      (s.status || '').toLowerCase() === statusFilter.toLowerCase();

    const routerMatch =
      routerFilter === 'all' ||
      (s.router_name || s.nas_router) === routerFilter;

    return statusMatch && routerMatch;
  });
}, [tableDataSubscriber, statusFilter, routerFilter]);



  const handleClickOpen = () => {
    // setOpen(true);
    setEditingSubscriber(true)
    // setFormData(intialValue)
    setShowClientStatsAndSubscriptions(true)

  };


  const navigate = useNavigate()

  const handleCLickAdd = () => {
    setOpen(true);
    setEditingSubscriber(false)
    setFormDataSubscriber(intialValueSubscriber)
    setShowClientStatsAndSubscriptions(false)
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




  
  

  const handleClose = () => {
    setOpen(false);


  };


  


  


const handleClickRow = () => {
  setShowClientStatsAndSubscriptions(true)
}

  const handleRowClick = (event, rowData) => {
    setOnlyShowSubscription(true)
    setEditingSubscriber(true)
    setShowClientStatsAndSubscriptions(true)
    setSelectedLocations(rowData.location)
    setSubscriberId(rowData.id)
setFormDataSubscriber({
  ...rowData,
  date_registered: dayjs(rowData.date_registered), 

});


  }


  const subdomain = window.location.hostname.split('.')[0]; 

    
  const fetchSubscribers = useCallback(
    async() => {
      
    try {
      setIsSearching(true)
      const response = await fetch('/api/subscribers',{
        headers: {
          'X-Subdomain': subdomain,
        },
    
      }
    
    
    )
    
      const newData = await response.json()
    if (response.ok) {
      // setTableDataSubscriber(newData)
      setIsSearching(false)
  setTableDataSubscriber(newData.filter((subscriber)=> {
     return search.toLowerCase() === '' ? subscriber : subscriber.name.toLowerCase().includes(search) || subscriber.ref_no.toLowerCase().includes(search) || subscriber.location?.some(loc => 
      typeof loc === 'string' && loc.toLowerCase().includes(search.toLowerCase())
  );
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

      toast.error(newData.error, {
        position: 'top-center',
        duration: 5000,
      })
  toast.error(
    'Failed to get subscribers',
    {
      position: 'top-center',
      duration: 4000,
    }
  )
    }
    
    } catch (error) {
      toast.error('Failed to get subscribers internal server error', {
        position: 'top-center',
        duration: 4000,
      })
      console.log(error)
    
    }
    },
    [searchInput],
  )
  
  
  
    useEffect(() => {
      
      fetchSubscribers()
    }, [fetchSubscribers]);
  


    

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
          if (!response.ok) {
            if (response.status === 402) {
        setTimeout(() => {
          // navigate('/license-expired')
          window.location.href='/license-expired'
         }, 1800);
        
      }
if (response.status === 401) {
  toast.error(data.error, {
    position: "top-center",
    duration: 4000,
  })
   setTimeout(() => {
          // navigate('/license-expired')
          window.location.href='/signin'
         }, 1900);
}
          }
        }
        catch (error) {
        }
      },
      [subdomain]
    )
  
  
  
    useEffect(() => {
      getSubscriptions() 
     
    }, [getSubscriptions]);


  

  const deleteSubscriber = async(id)=> {

try {
  const response = await fetch(`/api/delete_subscriber/${id}`, {
    method: "DELETE",
    headers: {
      'X-Subdomain': subdomain,
    },


})



if (response.status === 402) {
  setTimeout(() => {
    window.location.href = '/license-expired';
    // navigate('/license-expired')
   }, 1800);
  
}

if (response.ok) {
setTableDataSubscriber((tableData)=> tableData.filter(item => item.id !== id))
toast.success('subscriber deleted successfully', {
  position: "top-center",
  duration: 4000,
})
setOpenDelete(false)
} else {
  
setOpenDelete(false)
toast.error('failed to delete subscriber', {
  position: "top-center",
  duration: 3000,
})
}
} catch (error) {
  setOpenDelete(false)
    toast.error(`failed to delete subscriber,We’re having trouble completing this request.`)
}
   
  }




const fetchRouters = useCallback(async () => {
  try {
    const response = await fetch('/api/routers', {
      headers: { 'X-Subdomain': subdomain },
    });
    const data = await response.json();
    if (response.ok) setRouters(data || []);
  } catch (error) {
    // silent fail is fine here, filter just won't populate
  }
}, [subdomain]);

useEffect(() => {
  fetchRouters();
}, [fetchRouters]);

  


  const columns = [
    {title: 'name', field: 'name', headerClassName: 'dark:text-black ', 
      render: (rowData) => {
        return<> {rowData.name  && <div
          onClick={() => {
            navigate(`/admin/subscriber-details?id=${encodeURIComponent(rowData.id)} `)

            // setOpen(true)
          }}
          className='flex gap-2'> <GoPaperclip  className='text-black w-6 h-6
         dark:text-white cursor-pointer
         hover:text-green-700'/> {rowData.name}</div> } </>
      }
    },
    {title: 'Account Number', field: 'ref_no',  headerClassName: 'dark:text-black' ,  sorting: true, },
    {title: 'Date Registered', field: 'date_registered',  
      defaultSort: 'dsc', 
      
      render: (rowData) => {
        return <>{rowData.date_registered && <div className='flex gap-2'> <FaCalendarCheck className='text-black w-6 h-6
         dark:text-white cursor-pointer
         hover:text-green-700'/> {rowData.date_registered}</div> }</> 
      }
       },
  
    {title: 'status', field: 'status',  headerClassName: 'dark:text-black',

     render: (rowData) => {
  return (
    <div className="flex items-center gap-2">
      {rowData?.status === 'active' ? (
        <>
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.8, 1, 0.8]
            }}
            transition={{
              duration: 0.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            {/* <FaCircle className="text-green-500 text-xs" /> */}
          </motion.div>
          <span className="text-green-500">Active</span>
        </>
      ) : (
        <>
        
          <FaCircle className="text-red-700 text-xs" />
          <span className="text-red-700">{rowData.status}</span>
        </>
      )}
    </div>
  );
}
    },
    {title: 'phone_number', field: 'phone_number',  headerClassName: 'dark:text-black', 
      render: (rowData) => {
        return <> {rowData.phone_number &&  <div className='flex gap-2'> <MdOutlinePhoneForwarded 
          className='text-black w-4 h-4
         dark:text-white cursor-pointer
         hover:text-green-700'/> {rowData.phone_number}</div>} </>
      }
    },

    {title: 'Location', field: 'location',  headerClassName: 'dark:text-black', 
      render: (rowData) => {
        return <>  {rowData.location && <div className='flex'> <CiLocationOn className='text-black w-6 h-6
         dark:text-white cursor-pointer
         hover:text-green-700'/> {rowData.location}</div>} </> 
      }
    },
    {title: 'package', field: 'package_name',
       headerClassName: 'dark:text-black', align: 'left', 
       render: (rowData) => {
        return <div className='flex gap-2'> {rowData.package_name } </div>     
         }
     
      },
    {title: 'House Number', field:'house_number',  headerClassName: 'dark:text-black'},
    {title: 'Building', field:'building_name',  headerClassName: 'dark:text-black', 
      render: (rowData) => {
        
        return <> {rowData.building_name && <div className='flex gap-2'> <FaRegBuilding className='text-black
           w-4 h-4
         dark:text-white cursor-pointer
         hover:text-green-700'/> {rowData.building_name}</div> } </>
      }
    },
        {title: 'Node', field:'node',  headerClassName: 'dark:text-black', 
          render: (rowData) => {
            return <> {rowData.node && <div className='flex gap-2'> <FaShareNodes className='text-black w-6 h-6
             dark:text-white cursor-pointer
             hover:text-green-700'/> {rowData.node}</div>} </> 
          }
        },

  
    
    {title: 'Action', field:'Action',  headerClassName: 'dark:text-black',
    render: (params) =>  
    
    <>
    <div className='flex items-center gap-2'
    
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
    >
      <Tooltip title="Call">
      <IconButton arrow color="primary" 
      onClick={()=>{window.location.href = `tel:${params.phone_number}`}}>
     <FaPhoneVolume className='text-green-500 text-xl'/>
     </IconButton>
     </Tooltip>


     <Tooltip title="Delete">
      <IconButton >
      <DeleteButton {...params} />
      </IconButton>
      </Tooltip>


      <Tooltip title="Edit">
        <IconButton onClick={() => {
          handleClickOpen()
navigate(`/admin/subscriber-details?id=${encodeURIComponent(params.id)}
   `);

        }}>
      <EditButton {...params} />
      </IconButton>
      </Tooltip>
     </div>
      </>
  
  
  }
  
  ]


  const DeleteButton = ({ id }) => (
    <IconButton style={{ color: '#8B0000' }} onClick={()=> setOpenDelete(true)}>
      <DeleteIcon />
    </IconButton>
  );
  const EditButton = ({rowData}) => (
    <IconButton style={{color: 'green'}}  >
      <EditIcon />
    </IconButton>
  )

  
  return (
    <div>

    <DeleteSubscriber  openDelete={openDelete} handleCloseDelete={handleCloseDelete} 
    deleteSubscriber={deleteSubscriber} id={formDataSubscriber.id}
     loading={loading}/>


      <Toaster />
      <Backdrop open={openLoad} sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
  
<Lottie className='relative z-50' options={defaultOptions} 
height={400} width={400} />
  
   </Backdrop>

{/*    
<EditSubscriber  isloading={loading}  
showClientStatsAndSUbscriptions={showClientStatsAndSUbscriptions} setShowClientStatsAndSubscriptions={setShowClientStatsAndSubscriptions}
packageName={formData.package_name} 
  open={open} handleClose={handleClose}  formData={formData}  setFormData={setFormData}  createSubscriber={createSubscriber} 
        
            />
           */}


<div className="flex items-center max-w-sm mx-auto ">  
     
    <label htmlFor="simple-search" className="sr-only">Search</label>
    <div className="relative w-full">
        <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <IoPeople className='text-black'/>
        </div>


        <input type="text" value={search} onChange={(e)=> setSearch(e.target.value)}
         className="bg-gray-50 border border-gray-300 text-gray-900 
        text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full ps-10 p-2.5 
          dark:border-gray-600 dark:placeholder-gray-400 dark:text-black
          dark:focus:ring-green-500 dark:focus:border-green-500" placeholder="Search for subscribers..."  />
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


<div className="flex gap-2 flex-wrap items-center my-3 font-sans
">
  {[
    { label: 'Active', value: 'active', color: 'bg-green-600' },
    { label: 'Online', value: 'online', color: 'bg-blue-600' },
    { label: 'Throttled', value: 'throttled', color: 'bg-orange-500' },
    { label: 'Expiring', value: 'expiring', color: 'bg-yellow-500' },
    { label: 'Expired', value: 'expired', color: 'bg-red-600' },
  ].map((item) => (
    <button
      key={item.value}
      onClick={() =>
        setStatusFilter((prev) => (prev === item.value ? 'all' : item.value))
      }
      className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium text-white
        transition transform hover:scale-105
        ${statusFilter === item.value ? `${item.color} ring-2 ring-offset-1 ring-black` : `${item.color} opacity-70`}
      `}
    >
      {item.label}
      <span className="bg-white/30 rounded-full px-1.5">
        {statusCounts[item.label]}
      </span>
    </button>
  ))}

<ThemeProvider theme={tableTheme}>

 <FormControl size="small" sx={{ minWidth: 180, ml: 2 }}>
    <InputLabel><p className='font-sans
'>Router </p></InputLabel>
    <Select
      value={routerFilter}
      label="Router"
      onChange={(e) => setRouterFilter(e.target.value)}
    >
      <MenuItem value="all">
        <em className='font-sans
'>All Routers</em>
      </MenuItem>
      {routers.map((r) => (
        <MenuItem key={r.id} value={r.name}>
          {r.name}
        </MenuItem>
      ))}
    </Select>
  </FormControl>

</ThemeProvider >
  {statusFilter !== 'all' && (
    <button
      onClick={() => setStatusFilter('all')}
      className="text-sm text-gray-500 underline ml-2 font-sans
"
    >
      Clear filter
    </button>
  )}
</div>
<div className="rounded-2xl border border-[#e5e0d5] overflow-hidden shadow-sm">

<ThemeProvider theme={tableTheme}>

<MaterialTable columns={columns}
isLoading={isSearching}
data={filteredSubscribers}
title={<p className=' font-bold text-xl font-sans'>PPPoe Subscribers</p>}

onRowClick={(event, rowData)=>handleRowClick(event, rowData)}
icons={{
  Add: () => <AddIcon onClick={handleClickOpen} />,
}}
actions={[
  {
    icon: () => <AddIcon onClick={() => {
      setFormDataSubscriber('')
      setEditingSubscriber(false)
      navigate('/admin/create-subscriber')
    }} />,
    isFreeAction: true, // This makes the action always visible
    tooltip: 'Add Subscribers',
  },
  
]}





localization={{
                body: {
                  emptyDataSourceMessage: 'No subscribers found. Create your first subscriber to get started!'
                },
               
              
              
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
      



/>
</ThemeProvider>

</div>


<div>{savedNotification && <SubscriberNotification/>}</div>
    </div>
  )
}

export default PPPOEsubscribers














