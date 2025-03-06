
import DeleteIcon from '@mui/icons-material/Delete';
import { IconButton } from '@mui/material';
// import {useState} from 'react'
// import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import  EditPayment from '../edit/EditPayment'

import {Link} from 'react-router-dom'
import {useState, useContext, useEffect, useCallback} from 'react'
import {ApplicationContext} from '../context/ApplicationContext'

import AddIcon from '@mui/icons-material/Add';

import GetAppIcon from '@mui/icons-material/GetApp';

import MaterialTable from 'material-table'
import { MdOutlineWifi } from "react-icons/md";
import { useApplicationSettings } from '../settings/ApplicationSettings';


import toast, { Toaster } from 'react-hot-toast';






const HotspotDashboard = () => {

  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const {companySettings, setCompanySettings,

    templateStates, setTemplateStates,
    settingsformData, setFormData,
    handleChangeHotspotVoucher, voucher, setVoucher
  } = useApplicationSettings()
const [stats, setStats] = useState([])
 
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const DeleteButton = ({ id }) => (
        <IconButton style={{ color: '#8B0000' }}>
          <DeleteIcon />
        </IconButton>
      );


  const EditButton = ( ) => (
    <IconButton onClick={handleClickOpen} style={{color: 'black'}} >
      <EditIcon />
    </IconButton>
  );
const columns = [
  {title: 'voucher', field: 'voucher',   },
  {title: 'ip adress', field: 'ip_address',  },
  {title: 'start time', field: 'start_time'},
  {title: 'up time', field: 'up_time'},
  {title: 'download', field: 'download',   },
  {title: 'upload', field: 'upload' },


//   {title: 'Action', field:'Action', align: 'right',

//   render: (params) =>  
    
//      <>
      
//        <DeleteButton {...params} />


//        <EditButton    onClick={handleClickOpen} {...params}/>
//        </>


// }


]


// get_active_hotspot_users


          
const subdomain = window.location.hostname.split('.')[0]

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
       console.log('fetched router settings', newData)
       const {router_name} = newData[0]
       setFormData({...settingsformData, router_name})
     } else {
       console.log('failed to fetch router settings')
     }
   } catch (error) {
     console.log(error)
   }
 },
 [],
)



 useEffect(() => {
  
   fetchRouters()
 }, [fetchRouters]);
 
const getActiveHotspotUsers = useCallback(
  async() => {

    try {
      const response = await fetch(`/api/get_active_hotspot_users?router_name=${settingsformData.router_name}`)
      const newData = await response.json()
      if (response.ok) {
        // setPackages(newData)
        const { hotspot_users } = newData
        setStats(newData)
        console.log('hotspot users fetched', newData)
      }else{
        // toast.error('failed to get active users', {
        //   position: "top-center",
        //   duration: '5000'
          
        // })
      }
    } catch (error) {
      // toast.error('failed to get active users', {
      //   position: "top-center",
      //   duration: '5000'
        
      // })
    }
  },
  [],
)


useEffect(() => {

  const interval = setInterval(() => {
    getActiveHotspotUsers()
  }, 10000);
  return () => clearInterval(interval);
  
}, [getActiveHotspotUsers]);



  return (
    <>
    <Toaster />
    <div className=''>
    <EditPayment open={open} handleClose={handleClose}/>
     



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
             <MdOutlineWifi className='text-green-500'/>
             
         </div>
 
 
         <input type="text" value={search} onChange={(e)=> setSearch(e.target.value)}
          className="bg-gray-50 border border-gray-300 text-gray-900 
         text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full ps-10 p-2.5 
           dark:border-gray-600 dark:placeholder-gray-400 dark:text-black
           dark:focus:ring-green-500 dark:focus:border-green-500"
            placeholder="Search for online users..."  />
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
      
      title='Online Hotspot Users'
      
      data={stats}

      
    

      actions={[
        {
        //   icon: () => <AddIcon  onClick={handleClickOpen }/>,
        //   isFreeAction: true, 
        //   tooltip: 'Edit Payment',
        },
        {
          icon: () => <GetAppIcon />,
          isFreeAction: true, // This makes the action always visible
      
          tooltip: 'Import',
        },
      ]}

options={{
       pageSizeOptions:[5, 10, 20],
    //    pageSize: 20,
       search: false,
searchFieldStyle: {
  borderColor: 'red'
},
searchAutoFocus: true,



selection: true,


paginationPosition: 'bottom',
exportButton: true,
exportAllData: true,
showSelectAllCheckbox: false,
showTextRowsSelected: false,

headerStyle:{
  fontFamily: 'bold',
  textTransform: 'uppercase'
  } ,
  
//   rowStyle:(data, index)=> index % 2 === 0 ? {
//   background: 'gray'
//   }: null,
  
  fontFamily: 'mono'
}}     
      
      
      
      
      />

    </div>
    </>
  )
}

export default HotspotDashboard











