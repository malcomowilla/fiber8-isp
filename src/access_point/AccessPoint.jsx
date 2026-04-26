import DeleteIcon from '@mui/icons-material/Delete';

import EditIcon from '@mui/icons-material/Edit';

import { IconButton,Tooltip,
 } from '@mui/material';
import GetAppIcon from '@mui/icons-material/GetApp';
import {  useState, useEffect, useMemo, useCallback} from 'react'
import EditAccessPoints from '../edit/EditAccessPoints'
import AddIcon from '@mui/icons-material/Add';

import MaterialTable from 'material-table'
import toast, { Toaster } from 'react-hot-toast';
import DeleteAccessPoint from '../delete/DeleteAccessPoint'
import {useApplicationSettings} from '../settings/ApplicationSettings'
import { LuRouter } from "react-icons/lu";
import { LuChartNetwork } from "react-icons/lu";


import { FaFulcrum } from "react-icons/fa";

import { useNavigate } from 'react-router-dom';
import FreeRadiusLogo from "../../public/images/free_radius.svg";
import { BsRouter } from "react-icons/bs";




const AccessPoint = () => {

const navigate = useNavigate()
  const [open, setOpen] = useState(false);
  const [editingRouter, setEditingRouter] = useState(false)

const [loading, setloading] = useState(false)
const [offlineerror, setofflineerror] = useState(false)
const [openDelete, setOpenDelete] = useState(false);
const { accessPointForm, setAccessPointForm, setTableData,
  pingStatus, setPingStatus,
  showMenu1, setShowMenu1, showMenu2, setShowMenu2, showMenu3, setShowMenu3,
      showMenu4, setShowMenu4, showMenu5, setShowMenu5, showMenu6, setShowMenu6,
       showMenu7, setShowMenu7, showMenu8, setShowMenu8, showMenu9, setShowMenu9,
        showMenu10, setShowMenu10, showMenu11, setShowMenu11, showMenu12, setShowMenu12,
routerName, setRouterName,openNasTable, setOpenNasTable,
        openRouterDetails, setOpenRouterDetails,
        initialValueAccessPoint

 } =  useApplicationSettings() 
const [selectedRouter, setSelectedRouter] = useState(null);
const [selectedRouterInfo, setSelectedRouterInfo] = useState(null);
const [search ,setSearch] = useState('')


const [tableDataNas, setTableDataNas] = useState([]); 
const [accessPoints, setAccessPoints] = useState([]);

  const [openLoading, setOpenLoading] = useState(false);


const [selectedRouterId, setSelectedRouterId] = useState(() => {
  const savedRouterId = localStorage.getItem('selectedCheckedRouter');
  return savedRouterId ? parseInt(savedRouterId, 10) : null;
});
const handleClickOpenDelete = () => {
  setOpenDelete(true);
};

const handleCloseDelete = () => {
  
  setOpenDelete(false);
};

  
  const handleClickOpen = () => {
    setOpen(true);
    setAccessPointForm(initialValueAccessPoint)
    setEditingRouter(false)

  };



  const handleClose = () => {
    setOpen(false);
  };




const subdomain = window.location.hostname.split('.')[0];



  const deleteAccessPoint = async (id) =>  {
    setloading(true)
    const response = await fetch(`/api/access_points/${id}`, {
      method: "DELETE",
      headers: {
        'X-Subdomain': subdomain,
      },


    })
    
    
    
    if (response.ok) {
      toast.success('access point deleted successfully', {
        position: "top-center",
        duration: 5000,
      })
      setAccessPoints((prevData) => prevData.filter((router) => router.id !== id));
      setloading(false)
      
    } else {
      setloading(false)
      toast.error('failed to delete access point', {
        position: "top-center",
        duration: 5000,
      })
    }
  }



  const handleRowClick = (event, rowData) => {
    setAccessPointForm(rowData);
    setRouterName(rowData.id)
    setEditingRouter(true)
  
  };


  
  const fetchAccessPoints = useMemo(() => async ()=> {
  
  try {
    const response = await fetch('/api/access_points',
      {
        headers: {
          'X-Subdomain': subdomain,
        },
      }
  
  
  )
  
    const newData = await response.json()
  if (response.ok) {
  //  setTableData(newData)
   setAccessPoints(newData)
   const ip = newData[0].ip
   const name = newData[0].name
   const location = newData[0].location
   setAccessPointForm({...accessPointForm,name, ip, location })

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
toast.error(newData.error,{
position: 'top-center',
duration: 5000,
})

toast.error('failed to fetch routers', {
position: 'top-center',
duration: 4000,
})
   
  }
  
  } catch (error) {
    
  
  }
  
  
  }, [])
  
  useEffect(() => {
    
     fetchAccessPoints(); 
        
           const intervalId = setInterval(() => {
            fetchAccessPoints()();
          }, 35000); // Fetch every 60 seconds
          return () => clearInterval(intervalId);
  }, [fetchAccessPoints]);




const handleSubmit = async (e)=> {

    e.preventDefault()

    try {
        setloading(true)
        const url = accessPointForm.id ? `/api/access_points/${accessPointForm.id}` : '/api/access_points';
        const method = accessPointForm.id ? 'PATCH' : 'POST';
        const res = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'X-Subdomain': subdomain,
                
            },
            // signal: controller.signal,
            body: JSON.stringify(accessPointForm),
        })

          // clearTimeout(id)
        
        const newData = await res.json()
        if (res.ok) {
          setloading(false)
         
          if (accessPointForm.id) {
            toast.success('access point updated successfully', {
              position: "top-center",
              duration: 5000,
            })
            setAccessPoints(accessPoints.map(item => (item.id === accessPointForm.id ? newData : item)));
          }else{
            setAccessPoints((accessPoints)=>[...accessPoints, newData])
            toast.success('access point added successfully', {
              position: "top-center",
              duration: 5000,
            })
          }
            
            // const ip = newData.ip
            // const name = newData.name
            // const location = newData.location
            // setnasFormData({...nasformData,password, username, ip_address })
            setloading(false)
          handleClose()

        } else {
          toast.error('failed to add access point', {
            position: "top-center",
            duration: 5000,
          })
            setloading(false)

        }
    } catch (error) {
      toast.error('failed to add access point something went wrong', {
        position: "top-center",
        duration: 6000,
      })
        setloading(false);

    }


    }


  







  const DeleteButton = () => (
        <IconButton style={{ color: '#8B0000' }}  onClick={handleClickOpenDelete}>
          <DeleteIcon />
        </IconButton>
      );


  const EditButton = () => (
    <IconButton style={{color: 'green'}}   onClick={handleClickOpen}>
      <EditIcon />
    </IconButton>
  );
const columns = [
    {title: 'name', field: 'name',  },
  // {title: 'ping', field: 'ping'},


  {
    title: 'ping',
    field: 'ping',
    render: rowData => (
      <span style={{ 
        // color: pingStatus.router_status?.response ? 'green' : 'red', 
        // color: rowData.ping_status?.router_status?.reachable === true ? 'green' : 'red', 
        color: rowData.reachable === true ? 'green' : 'red', 
        fontWeight: 'bold' 
      }}>
{rowData.response?.substring(14, 35) || 'N/A'}

      </span>
    )
  },
  
  // {title: 'status', field: 'reachable'},
  {
    title: 'Status',
    field: 'reachable',
    render: rowData => (
      <span style={{ 
        color: rowData.reachable === true ? 'green' : 'red', 
        fontWeight: 'bold' 
      }}>
        {rowData.reachable === true ? 'Reachable' : 'Not Reachable' }
      </span>
    )
  },
  {title: 'ip_address', field: 'ip',
   },

   {title: 'Location', field: 'location'},
  // {title: 'password', field: 'password', },

  {title: 'Action', field:'Action',

  render: (rowData) =>  
    
     <>
      <div className='flex flex-row gap-4'>
       <DeleteButton  id={rowData.id} />
       <EditButton />


            


           
   </div>
       </>

}

]


  return (
    <>
  



    <div  
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
    className=''>
      <Toaster />
            
      <div className="flex items-center max-w-sm mx-auto p-3">  
     
     <label htmlFor="simple-search" className="sr-only">Search</label>
     <div className="relative w-full">
         <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
           
             <LuRouter className='text-black'/>
             
         </div>
 
 
         <input type="text" value={search} onChange={(e)=> 
         setSearch(e.target.value)}
          className="bg-gray-50 border border-gray-300
           text-gray-900 
         text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full ps-10 p-2.5 
           dark:border-gray-600 dark:placeholder-gray-400 dark:text-black
           dark:focus:ring-green-500 dark:focus:border-green-500"
            placeholder="Search all access points..."  />
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
<EditAccessPoints open={open} handleClose={handleClose} 
tableData={tableDataNas} handleSubmit={handleSubmit}  
 nasformData={accessPointForm}
 setnasFormData={setAccessPointForm}  isloading={loading}
 editingRouter={editingRouter} setEditingRouter={setEditingRouter}
 />


<DeleteAccessPoint loading={loading}  
 id={accessPointForm.id} deleteAccessPoint={deleteAccessPoint}
 handleCloseDelete ={handleCloseDelete}  openDelete={openDelete}/>

{/* 
 <div className="flex flex-col items-center justify-center">
     <div className="text-6xl">🚧</div> 
     
     <h1 className="text-2xl
      font-bold mt-4">Under Development</h1> 
 <p className="text-gray-500">
        </p> </div> */}

        
        <div className='flex flex-row items-center gap-2'>
      <p className='
         font-bold text-3xl inline-block p-2'> Access Points </p>
         <BsRouter className='w-7 h-7'/>
</div>
        

      <MaterialTable columns={columns}
      
      title= { <p className='
        
         font-bold text-lg text-gray-500'>
            This section lists all registered access points in the network. 
            Each access point is identified by its name, IP address, and 
            physical location. The system continuously checks their status
             by pinging their IP addresses to determine whether they are 
             online or offline,
             helping administrators quickly detect, troubleshoot, and monitor their access points eg Tender Router access points.
             </p> }
      
      
      data={accessPoints}

    onRowClick={handleRowClick}
    actions={[
        {
          icon:()=><GetAppIcon/>,
          tooltip: 'import'
        },
        {
          icon: () => <AddIcon  onClick={handleClickOpen} />,
          isFreeAction: true, 
          tooltip: 'Add Router'
        }
    ]}


localization={{
                body: {
                  emptyDataSourceMessage: 'No Access Point found. Create your first Access Point to get started!'
                },
               
              
              
              }}


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
  emptyRowsWhenPaging: false,
headerStyle:{
  fontFamily: 'bold',
  textTransform: 'uppercase'
  } ,
  
  
  fontFamily: 'mono'
}}  
      
      
      
      />

    </div>
    </>
  )
}

export default AccessPoint

