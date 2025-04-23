

import MaterialTable from 'material-table'
import DeleteIcon from '@mui/icons-material/Delete';

import EditIcon from '@mui/icons-material/Edit';

import { IconButton } from '@mui/material';

import AddIcon from '@mui/icons-material/Add';
import {useState, useMemo,useEffect, useCallback} from'react'
import EditSubscriber from '../edit/EditSubscriber'
import dayjs from 'dayjs';
import SubscriberNotification from '../notification/SubscriberNotification'
import { IoPeople } from "react-icons/io5";
import {motion} from 'framer-motion'
import { Button } from '@mui/material';

import LoadingAnimation from '../loader/loading_animation.json'
import Lottie from 'react-lottie';
import Backdrop from '@mui/material/Backdrop';
import DeleteSubscriber from '../delete/DeleteSubscriber'
import { useApplicationSettings } from '../settings/ApplicationSettings';
import toast, { Toaster } from 'react-hot-toast';

// import Autocomplete from '@mui/material/Autocomplete';



const PPPOEsubscribers = () => {
  const { settingsformData } = useApplicationSettings();

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
const [showClientStatsAndSUbscriptions, setShowClientStatsAndSubscriptions] = useState(true)
const [onlyShowSubscription, setOnlyShowSubscription] = useState(false)



  const handleClickOpen = () => {
    setOpen(true);
    
    // setFormData(intialValue)
    setShowClientStatsAndSubscriptions(true)


  };

  const handleCLickAdd = () => {
    setOpen(true);
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
    
    console.log('subscribers',rowData)
   console.log('showClientStatsAndSUbscriptions',showClientStatsAndSUbscriptions)
    setShowClientStatsAndSubscriptions(true)
setFormData({
  ...rowData,
  date_registered: dayjs(rowData.date_registered), 

});


  }


  const subdomain = window.location.hostname.split('.')[0]; 

    
  const fetchSubscribers = useCallback(
    async() => {
      
    try {
      const response = await fetch('/api/subscribers',{
        headers: {
          'X-Subdomain': subdomain,
        },
    
      }
    
    
    )
    
      const newData = await response.json()
    if (response.ok) {
      setTableData(newData)
  
    } else {
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
    [],
  )
  
  
  
    useEffect(() => {
      
      fetchSubscribers()
    }, [fetchSubscribers]);
  


    

  



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
        body: JSON.stringify({...formData, router_name:
           settingsformData.router_name, use_radius: settingsformData.use_radius})
      }
    )


    const newData = await response.json()


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
  const response = await fetch(`/api/delete_subscriber/${id}?router_name=${settingsformData.router_name}`, {
    method: "DELETE",
    headers: {
      'X-Subdomain': subdomain,
    },


})

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



  const columns = [
    {title: 'name', field: 'name', headerClassName: 'dark:text-black ', defaultSort: 'asc'},
    {title: 'ref_no', field: 'ref_no',  headerClassName: 'dark:text-black' ,  sorting: true, defaultSort: 'asc'},
  
    {title: 'phone_number', field: 'phone_number',  headerClassName: 'dark:text-black'},
    {title: 'package', field: 'package_name', type: 'numeric', headerClassName: 'dark:text-black', align: 'left'},
    {title: 'House Number', field:'house_number',  headerClassName: 'dark:text-black'},
    {title: ' Building', field:'building_name',  headerClassName: 'dark:text-black'},
  
    {title: 'Status', field:'status',  headerClassName: 'dark:text-black'},
    {title: 'Action', field:'Action',  headerClassName: 'dark:text-black',
    render: (params) =>  
    
    <>
     
      <DeleteButton {...params} />
      <EditButton {...params}/>
     
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
    handleClose={handleClose}
    formData={formData}
    setFormData={setFormData}
    createSubscriber={createSubscriber}
    handleChangeForm={handleChange}
  />
)}

<div className="flex items-center max-w-sm mx-auto p-3">  
     
    <label htmlFor="simple-search" className="sr-only">Search</label>
    <div className="relative w-full">
        <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            {/* <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true"
             xmlns="http://www.w3.org/2000/svg"
             fill="none" viewBox="0 0 18 20">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                 strokeWidth="2" d="M3 5v10M3 5a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm0 10a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm12 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm0 0V6a3 3 0 0 0-3-3H9m1.5-2-2 2 2 2"/>
            </svg> */}
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


<MaterialTable columns={columns}
data={tableData}
title='PPPoe Subcribers'

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
  pageSizeOptions:[2, 5, 10, 20, 25, 50, 100],
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

export default PPPOEsubscribers














