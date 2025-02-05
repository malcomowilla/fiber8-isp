
import DeleteIcon from '@mui/icons-material/Delete';
import { IconButton } from '@mui/material';
// import {useState} from 'react'
// import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
// import  EditPayment from '../edit/EditPayment'
import {useState, lazy, Suspense, useEffect, useCallback} from 'react'

import toast, { Toaster } from 'react-hot-toast';

// import {Link} from 'react-router-dom'
import UiLoader from '../uiloader/UiLoader'

// import { useContext} from 'react'
// import {ApplicationContext} from '../context/ApplicationContext'

import { BsHddNetwork } from "react-icons/bs";

import MaterialTable from 'material-table'
import AddIcon from '@mui/icons-material/Add';
import IpPool from './IpPool'





const IpPoolTable = () => {
const [search, setSearch] = useState('')
const [isOpen, setIsOpen] = useState(false);
const [ipPools, setIpPools] = useState([])
const [ipPoolFormData, setIpPoolFormData] = useState({
  start_ip: '',
  end_ip: '',
  pool_name: '',
  description: ''
})


const subdomain = window.location.hostname.split('.')[0];

const handleChange = (e) => {
  const {name, value} = e.target
  setIpPoolFormData({...ipPoolFormData, [name]: value})
}


const handleRowClick = (event, rowData) => {
    setIpPoolFormData(rowData);
  
    // Add your custom logic here, such as opening a modal or updating state
  };    
  const DeleteButton = ({ id }) => (
        <IconButton style={{ color: '#8B0000' }}>
          <DeleteIcon />
        </IconButton>
      );


  const EditButton = ({ id }) => (
    <IconButton style={{color: 'black'}} >
      <EditIcon />
    </IconButton>
  );

  
const columns = [
  {title: 'Start Ip', field: 'start_ip',   },
  {title: 'End Ip', field: 'end_ip'  },
  {title: 'Pool Name', field: 'pool_name'  },
  {title: 'Description', field: 'description'  },
 


  {title: 'Action', field:'Action', align: 'right',

  render: (params) =>  
    
     <>
      
       <DeleteButton {...params} />


       </>
}
]




// ip_pools
const fecthIpPools = useCallback(
  async() => {

try {
    const response = await fetch('/api/ip_pools', {
        headers: {
          'X-Subdomain': subdomain,
        },
    })

    const newData = await response.json()
    if (response.ok) {
      setIpPools(newData)

  
    }else{
toast.error(
    'Failed to get ip pools',
    {
      position: 'top-center',
      duration: 4000,
    }
)
    }
} catch (error) {
    toast.error('Failed to get ip pools internal server error', {
      position: 'top-center',
      duration: 3000,
    })
}
  },
  [],


)


useEffect(() => {
    
   fecthIpPools()
}, [fecthIpPools]);

  return (

    <>

    <IpPool isOpen={isOpen} setIsOpen={setIsOpen} ipPoolFormData={ipPoolFormData}
    setIpPoolFormData={setIpPoolFormData} handleChange={handleChange}

    ipPools={ipPools} setIpPools={setIpPools}
    />
    <Toaster />
    <Suspense fallback={<div className='flex justify-center items-center '>{ <UiLoader/> }</div>}>

    <div className=''>

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
             <BsHddNetwork className='text-black'/>
             
         </div>
 
 
         <input type="text" value={search} onChange={(e)=> setSearch(e.target.value)}
          className="bg-gray-50 border border-gray-300 text-gray-900 
         text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full ps-10 p-2.5 
           dark:border-gray-600 dark:placeholder-gray-400 dark:text-black
           dark:focus:ring-green-500 dark:focus:border-green-500" placeholder="Search for ip pool..."  />
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
      
      title='Ip Pool'
      
      data={ipPools}

      
    onRowClick={handleRowClick}
    actions={[
        {
          icon: () => <AddIcon  onClick={()=> setIsOpen(true)}  />,
          isFreeAction: true, // This makes the action always visible
          tooltip: 'Add Ip Pool',
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

    </div>
    
    </Suspense>

    </>
  )
}

export default IpPoolTable






