





import MaterialTable from 'material-table'
import DeleteIcon from '@mui/icons-material/Delete';

import EditIcon from '@mui/icons-material/Edit';

import { IconButton } from '@mui/material';

import AddIcon from '@mui/icons-material/Add';
import {useState,useEffect, useCallback,} from'react'
import EditSubscriber from '../edit/EditSubscriber'
import dayjs from 'dayjs';
import SubscriberNotification from '../notification/SubscriberNotification'
import { IoPeople } from "react-icons/io5";
import { Tooltip,} from '@mui/material';
import { FaPhoneVolume } from "react-icons/fa6";

import LoadingAnimation from '../loader/loading_animation.json'
import Lottie from 'react-lottie';
import Backdrop from '@mui/material/Backdrop';
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








const SubscribersOffline = () => {
  const { settingsformData,
showMenu1, setShowMenu1, showMenu2, setShowMenu2, showMenu3, setShowMenu3,
      showMenu4, setShowMenu4, showMenu5, setShowMenu5, showMenu6, setShowMenu6,
       showMenu7, setShowMenu7, showMenu8, setShowMenu8, showMenu9, setShowMenu9,
        showMenu10, setShowMenu10, showMenu11, setShowMenu11, showMenu12, setShowMenu12,

   } = useApplicationSettings();
  // const navigate = useNavigate()

  const intialValue = {
    name: '',
    latitude: '',
    longitude: '',
    house_number: '',
    building_name: '',
    phone_number: '',
    ppoe_username: '',
    ppoe_password: '',
    ref_no: '',
    network_name: '',
    validity: '',
    validity_period_units: '',
    
  
    ip_address: '',
    package_name: '',
    installation_fee: '',
    subscriber_discount: '',
    second_phone_number: '',
    node: '',
    location: '',
    date_registered: dayjs(),
    email: '',
    router_name: '',
    check_update_username: settingsformData.check_update_username,
    check_update_password: settingsformData.check_update_password
    

  }
  const [open, setOpen] = useState(false);
const [formData,  setFormData] = useState(intialValue)
const [tableData, setTableData] = useState([])
const [loading, setloading] = useState(false)
const [savedNotification, setSavedNotification] = useState(false)
const [search, setSearch] = useState('')
const [openLoad, setOpenLoad] = useState(false)
const [openDelete, setOpenDelete] = useState(false)
const [showClientStatsAndSUbscriptions, setShowClientStatsAndSubscriptions] = useState(false)
const [onlyShowSubscription, setOnlyShowSubscription] = useState(false)
    const [selectedLocations, setSelectedLocations] = useState([]);

const [searchInput] = useDebounce(search, 1000)
const [isSearching, setIsSearching] = useState(false); // New state for search loading

const [subscriberId, setSubscriberId] = useState('')
const [editingSubscriber, setEditingSubscriber] = useState(false)
  const handleClickOpen = () => {
    setOpen(true);
    
    // setFormData(intialValue)
    setShowClientStatsAndSubscriptions(true)


  };

  const handleCLickAdd = () => {
    setOpen(true);
    setEditingSubscriber(false)
    setFormData(intialValue)
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


  


  
  

  const handleClose = () => {
    setOpen(false);


  };


  


  const handleChange = (e)=> {

    const {id, value} = e.target
    setFormData({...formData, [id]: value})
  }


const handleClickRow = () => {
  setShowClientStatsAndSubscriptions(true)
}

  const handleRowClick = (event, rowData) => {
    setOnlyShowSubscription(true)
    console.log('subscribers',rowData)
    setEditingSubscriber(true)
   console.log('showClientStatsAndSUbscriptions',showClientStatsAndSUbscriptions)
    setShowClientStatsAndSubscriptions(true)
    setSelectedLocations(rowData.location)
    setSubscriberId(rowData.id)
setFormData({
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
      // setTableData(newData)
      setIsSearching(false)
  setTableData(newData.filter((subscriber)=> {
     return search.toLowerCase() === '' ? subscriber.status === 'offline' : subscriber.name.toLowerCase().includes(search) || subscriber.ref_no.toLowerCase().includes(search) || subscriber.location?.some(loc =>
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
      console.log('failed to fetch routers')

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
          console.log(error)
        }
      },
      [subdomain]
    )
  
  
  
    useEffect(() => {
      getSubscriptions() 
     
    }, [getSubscriptions]);


  const createSubscriber = async (e) => {
    setOpenLoad(true)
e.preventDefault()
    try {
      setloading(true)

      const url = formData.id ? `/api/update_subscriber/${formData.id}` : '/api/subscriber';
      const method = formData.id ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
"Content-Type" : "application/json",
        'X-Subdomain': subdomain,
        },
        body: JSON.stringify({...formData, 
          location: selectedLocations,
          router_name:
          
           settingsformData.router_name, use_radius: settingsformData.use_radius})
      }
    )


    const newData = await response.json()



    if (response.status === 402) {
      setTimeout(() => {
        // navigate('/license-expired')
        window.location.href='/license-expired';
       }, 1800);
      
    }


if (response.ok) {
  setOpen(false)
  setOpenLoad(false)
 
  setloading(false)
  setSavedNotification(true)
  setTimeout(() => {
    setSavedNotification(false)

  }, 10000);


if (formData.id) {
  setTableData(tableData.map(item => item.id === newData.id ? newData : item))
  toast.success('Subscriber updated successfully', {
    position: "top-center",
    duration: 4000,
    
  })
} else {
  setTableData([...tableData, newData])
  toast.success('Subscriber created successfully', {
    position: "top-center",
    duration: 4000,
    
  })
}


  
} else {
  setOpenLoad(false)
  console.log('failed to fetch')
  setloading(false)
  toast.error('Failed to create subscriber', {
    position: "top-center",
    duration: 4000,
    
  })

  toast.error(newData.error, {
    position: "top-center",
    duration: 4000,
    
  })
}
    } catch (error) {
      console.log(error)
      setloading(false)
      setOpenLoad(false)
      toast.error(
        'Failed to create subscriber',
        {
          position: 'top-center',
          duration: 4000,
        }
      )
    }

  }


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
setTableData((tableData)=> tableData.filter(item => item.id !== id))
toast.success('subscriber deleted successfully', {
  position: "top-center",
  duration: 4000,
})
setOpenDelete(false)
} else {
  
setOpenDelete(false)
toast.error('failed to delete subscriber', {
  position: "top-center",
  duration: 4000,
})
}
} catch (error) {
  setOpenDelete(false)
    toast.error(`failed to delete subscriber, server error`)
}
   
  }




  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  
const subscriberOffline = tableData.filter((subscriber)=> {
return subscriber.status === 'offline'
})

  const columns = [
    {title: 'name', field: 'name', headerClassName: 'dark:text-black ', defaultSort: 'asc', 
      render: (rowData) => {
        return<> {rowData.name  && <div
          onClick={() => {
            setOpen(true)
          }}
          className='flex gap-2'> <GoPaperclip  className='text-black w-6 h-6
         dark:text-white cursor-pointer
         hover:text-green-700'/> {rowData.name}</div> } </>
      }
    },
    {title: 'ref_no', field: 'ref_no',  headerClassName: 'dark:text-black' ,  sorting: true, defaultSort: 'asc'},
    {title: 'Date Registered', field: 'registration_date',  headerClassName: 'dark:text-black' , 
      render: (rowData) => {
        return <>{rowData.registration_date && <div className='flex gap-2'> <FaCalendarCheck className='text-black w-6 h-6
         dark:text-white cursor-pointer
         hover:text-green-700'/> {rowData.registration_date}</div> }</> 
      }
       },
  
    {title: 'status', field: 'status',  headerClassName: 'dark:text-black',

     render: (rowData) => {
  return (
    <div className="flex items-center gap-2">
      {rowData?.status === 'online' ? (
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
            <FaCircle className="text-green-500 text-xs" />
          </motion.div>
          <span className="text-green-500">Online</span>
        </>
      ) : (
        <>
        
          <FaCircle className="text-red-700 text-xs" />
          <span className="text-red-700">Offline</span>
        </>
      )}
    </div>
  );
}
    },
    {title: 'phone_number', field: 'phone_number',  headerClassName: 'dark:text-black', 
      render: (rowData) => {
        return <> {rowData.phone_number &&  <div className='flex gap-2'> <MdOutlinePhoneForwarded className='text-black w-4 h-4
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
       type: 'numeric', headerClassName: 'dark:text-black', align: 'left', 
      render: (rowData) => {
        const statusInfo = status?.find(item => 
          item?.ppoe_username || item?.ppoe_password === rowData?.ref_no
        ) || { status: 'offline' };

        return (
          <>
<p
className={`${statusInfo?.status === 'active' ? 'text-emerald-500' : 'text-red-500'
        } `}
>{statusInfo?.package} </p>
        </>
        )
        
      }
      },
    {title: 'House Number', field:'house_number',  headerClassName: 'dark:text-black'},
    {title: 'Building', field:'building_name',  headerClassName: 'dark:text-black', 
      render: (rowData) => {
        
        return <> {rowData.building_name && <div className='flex gap-2'> <FaRegBuilding className='text-black w-4 h-4
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
      <IconButton arrow color="primary" onClick={()=>{window.location.href = `tel:${params.phone_number}`}}>
     <FaPhoneVolume className='text-green-500 text-xl'/>
     </IconButton>
     </Tooltip>

     <Tooltip title="Delete">
      <IconButton >
      <DeleteButton {...params} />
      </IconButton>
      </Tooltip>


      <Tooltip title="Edit">
        <IconButton >
      <EditButton {...params}/>
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
  const EditButton = () => (
    <IconButton style={{color: 'green'}} onClick={handleClickOpen} >
      <EditIcon />
    </IconButton>
  )

  
  return (
    <div>

    <DeleteSubscriber  openDelete={openDelete} handleCloseDelete={handleCloseDelete} 
    deleteSubscriber={deleteSubscriber} id={formData.id} loading={loading}/>
      <Toaster />
      <Backdrop open={openLoad} sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
  
<Lottie className='relative z-50' options={defaultOptions} height={400} width={400} />
  
   </Backdrop>

{/*    
<EditSubscriber  isloading={loading}  
showClientStatsAndSUbscriptions={showClientStatsAndSUbscriptions} setShowClientStatsAndSubscriptions={setShowClientStatsAndSubscriptions}
packageName={formData.package_name} 
  open={open} handleClose={handleClose}  formData={formData}  setFormData={setFormData}  createSubscriber={createSubscriber} 
handleChangeForm={handleChange}
        
            />
           */}
{open && (
  <EditSubscriber
    isloading={loading}
    onlyShowSubscription={onlyShowSubscription} setOnlyShowSubscription={setOnlyShowSubscription}
    showClientStatsAndSUbscriptions={showClientStatsAndSUbscriptions}
    setShowClientStatsAndSubscriptions={setShowClientStatsAndSubscriptions}
    
    packageName={formData.package_name}
    open={open}
    name={formData.name}
    package_name={formData.package_name}
    handleClose={handleClose}
    formData={formData}
    setFormData={setFormData}
    setSubscriberId={setSubscriberId}
    subscriberId={subscriberId}
    createSubscriber={createSubscriber}
    handleChangeForm={handleChange}
    selectedLocations={selectedLocations}
     setSelectedLocations={setSelectedLocations}
     editingSubscriber={editingSubscriber}
     setEditingSubscriber={setEditingSubscriber}
  />
)}

<div className="flex items-center max-w-sm mx-auto p-3">  
     
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


<MaterialTable columns={columns}
data={subscriberOffline}
title='Subscribers Offline'

onRowClick={(event, rowData)=>handleRowClick(event, rowData)}
icons={{
  Add: () => <AddIcon onClick={handleClickOpen} />,
}}
actions={[
  {
    icon: () => <AddIcon onClick={handleCLickAdd} />,
    isFreeAction: true, // This makes the action always visible
    tooltip: 'Add Subscribers',
  },
  
]}

options={{
  sorting: true,
  pageSizeOptions:[2, 5, 10],
  pageSize: 10,
  paginationPosition: 'bottom',
exportButton: true,
exportAllData: true,
selection: true,
search:false,
searchAutoFocus: true,
showSelectAllCheckbox: false,
showTextRowsSelected: false,

headerStyle:{
  fontFamily: 'bold',
  textTransform: 'uppercase'
  } ,
  
  
  fontFamily: 'mono'
}}



/>

<div>{savedNotification && <SubscriberNotification/>}</div>
    </div>
  )
}

export default SubscribersOffline














