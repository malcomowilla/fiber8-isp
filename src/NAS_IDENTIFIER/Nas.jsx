import DeleteIcon from '@mui/icons-material/Delete';

import EditIcon from '@mui/icons-material/Edit';

import { IconButton,Tooltip,
 } from '@mui/material';
import GetAppIcon from '@mui/icons-material/GetApp';
import {  useState, useEffect, useMemo, useCallback} from 'react'
import EditNas from '../edit/EditNas' 
import AddIcon from '@mui/icons-material/Add';

import MaterialTable from 'material-table'
import toast, { Toaster } from 'react-hot-toast';

import DeleteRouter from '../delete/DeleteRouter'
import {useApplicationSettings} from '../settings/ApplicationSettings'
import { LuRouter } from "react-icons/lu";

import { FaFulcrum } from "react-icons/fa";

import { useNavigate } from 'react-router-dom';
import Loading from './Loading'
import FreeRadiusLogo from "../../public/images/free_radius.svg";


const Nas = () => {

const navigate = useNavigate()
  const [open, setOpen] = useState(false);
  const [editingRouter, setEditingRouter] = useState(false)

const [loading, setloading] = useState(false)
const [offlineerror, setofflineerror] = useState(false)
const [openDelete, setOpenDelete] = useState(false);
const { nasformData, setnasFormData,initialValueNas, setTableData,
  pingStatus, setPingStatus,
  showMenu1, setShowMenu1, showMenu2, setShowMenu2, showMenu3, setShowMenu3,
      showMenu4, setShowMenu4, showMenu5, setShowMenu5, showMenu6, setShowMenu6,
       showMenu7, setShowMenu7, showMenu8, setShowMenu8, showMenu9, setShowMenu9,
        showMenu10, setShowMenu10, showMenu11, setShowMenu11, showMenu12, setShowMenu12,
routerName, setRouterName,openNasTable, setOpenNasTable,
        openRouterDetails, setOpenRouterDetails

 } =  useApplicationSettings() 
const [selectedRouter, setSelectedRouter] = useState(null);
const [selectedRouterInfo, setSelectedRouterInfo] = useState(null);
const [search ,setSearch] = useState('')


const [tableDataNas, setTableDataNas] = useState([]); // Stores routers


  const [openLoading, setOpenLoading] = useState(false);


const [selectedRouterId, setSelectedRouterId] = useState(() => {
  const savedRouterId = localStorage.getItem('selectedCheckedRouter');
  return savedRouterId ? parseInt(savedRouterId, 10) : null;
});
// console.log('nas data', nasformData)
const handleClickOpenDelete = () => {
  setOpenDelete(true);
};

const handleCloseDelete = () => {
  
  setOpenDelete(false);
};

  
  const handleClickOpen = () => {
    setOpen(true);
    setnasFormData(initialValueNas)
    setEditingRouter(false)

  };



  const handleClose = () => {
    setOpen(false);
  };




// const updateRouter = async(id, e) => {

//   e.preventDefault()

//   try {
//       setloading(true)

//       const res = await fetch('/api/router', {
//           method: 'POST',
//           headers: {
//               'Content-Type': 'application/json'
//           },
//           signal: controller.signal,
//           body: JSON.stringify(formData),
//       })

//         clearTimeout(id)
      
//       const newData = await res.json()
//       if (res.ok) {
//           setTableData((tableData)=>[...tableData, newData])
//           setloading(false)


//       } else {
//           setloading(false)

//       }
//   } catch (error) {
//     console.log(error.name === 'AbortError');

//       setloading(false);

//   }
// }




const subdomain = window.location.hostname.split('.')[0];



  const deleteRouter = async (id) =>  {
    setloading(true)
    const response = await fetch(`/api/delete_router/${id}`, {
      method: "DELETE",
      headers: {
        'X-Subdomain': subdomain,
      },


    })
    
    
    
    if (response.ok) {
      toast.success('router deleted successfully', {
        position: "top-center",
        duration: 7000,
      })
      setTableDataNas((prevData) => prevData.filter((router) => router.id !== id));
      setloading(false)
      
    } else {
      setloading(false)
      toast.error('failed to delete router', {
        position: "top-center",
        duration: 7000,
      })
      console.log('failed to delete')
    }
  }



  const handleRowClick = (event, rowData) => {
    setnasFormData(rowData);
    console.log('router row data', rowData)
    setRouterName(rowData.id)
    setEditingRouter(true)
  
    // Add your custom logic here, such as opening a modal or updating state
  };


  
// const fetchPingStatus = useCallback(
//   async() => {
    
// const response = await fetch('/api/router_ping_response', {
//     headers: {
//       'X-Subdomain': subdomain,
//     },


// })

// const newData = await response.json()
// if (response.ok) {
//   setTableData(newData)
//   console.log('router ping status', newData)
  
// }else{
//   console.log('failed to fetch ping status')
// }
//   },
//   [],
// )



// useEffect(() => {
  
//   fetchPingStatus()
// }, [fetchPingStatus]);



  const fetchRouters = useMemo(() => async ()=> {
  
  try {
    const response = await fetch('/api/routers',
      {
        headers: {
          'X-Subdomain': subdomain,
        },
      }
  
  
  )
  
    const newData = await response.json()
  if (response.ok) {
  //  setTableData(newData)
   setTableDataNas(newData)
   const ip_address = newData[0].ip_address
   const username = newData[0].username
   const password = newData[0].password
   setnasFormData({...nasformData,password, username, ip_address })

  } else {


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
    
    console.log(error)
  
  }
  
  
  }, [])
  
  useEffect(() => {
    
    fetchRouters()
  }, [fetchRouters]);



  // const controller = new AbortController();
  // const id = setTimeout(() => controller.abort(), 6000);

const handleSubmit = async (e)=> {

    e.preventDefault()

    try {
        setloading(true)
        const url = nasformData.id ? `/api/update_router/${nasformData.id}` : '/api/create_router';
        const method = nasformData.id ? 'PATCH' : 'POST';
        const res = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'X-Subdomain': subdomain,
                
            },
            // signal: controller.signal,
            body: JSON.stringify(nasformData),
        })

          // clearTimeout(id)
        
        const newData = await res.json()
        if (res.ok) {
          setloading(false)
         
          if (nasformData.id) {
            toast.success('router updated successfully', {
              position: "top-center",
              duration: 7000,
            })
            setTableDataNas(tableDataNas.map(item => (item.id === nasformData.id ? newData : item)));
          }else{
            setTableDataNas((tableData)=>[...tableData, newData])
            toast.success('router added successfully', {
              position: "top-center",
              duration: 7000,
            })
          }
            
            const ip_address = newData.ip_address
            const username = newData.username
            const password = newData.password
            // setnasFormData({...nasformData,password, username, ip_address })
            setloading(false)
          handleClose()

        } else {
          toast.error('failed to add router', {
            position: "top-center",
            duration: 7000,
          })
            setloading(false)

        }
    } catch (error) {
      toast.error('failed to add router something went wrong', {
        position: "top-center",
        duration: 7000,
      })
        setloading(false);

    }


    }


    function getRouterInfoById(id) {
      return tableDataNas.find(router => router.id === id);
    }
    useEffect(() => {
      if (selectedRouterId !== null) {
        const routerInfo = getRouterInfoById(selectedRouterId);
        setSelectedRouterInfo(routerInfo);
      }
    }, [selectedRouterId]);


    const handleCheckboxChange = (event, rowData) => {
      const newSelectedRouter = rowData.id === selectedRouter ? null : rowData.id;
      setSelectedRouter(newSelectedRouter);
      localStorage.setItem('selectedCheckedRouter', newSelectedRouter !== null ? newSelectedRouter : '');
      setnasFormData(newSelectedRouter !== null ? rowData : initialValueNas);

    };





        const getPingStatus = useCallback(
          async() => {
            

            const response = await fetch('/api/router_ping_response',{
              headers: {
                'X-Subdomain': subdomain,
              },
            })
            const newData = await response.json()
            if (response.ok) {
              setPingStatus(newData)
              console.log('router ping status fetch array', newData[0])
              // setTableData((prevData) => ({
              //   ...prevData, 
              //   ...newData // This will overwrite existing keys if they exist
              // }));
              console.log('router ping status', newData)
            
            }else{
              toast.error('failed to get router ping status something went wrong', {
                position: "top-center",
                duration: 5000,
              })
            }
          },
          [],
        )
        



        useEffect(() => {
          getPingStatus(); // Initial fetch
        
           const intervalId = setInterval(() => {
            getPingStatus();
          }, 35000); // Fetch every 60 seconds
          return () => clearInterval(intervalId);
        
        }, [getPingStatus]); 
        






// const mergedTableData = tableDataNas.map((router) => {
//   const response = router.ping_status?.router_status?.response || "";
//   const pingTimeMatch = response.match(/time (\d+ms)/); // Extracts "time XXXXms"
//   const pingTime = pingTimeMatch ? pingTimeMatch[1] : "N/A"; // Default if no match
//   console.log('router ping status',(router.ping_status?.router_status?.response))

//   return {
//     ...router,
//     ping: pingTime, // Extracted ping time
//     reachable: router.ping_status?.router_status?.reachable ? "Reachable" : "Not Reachable",
//   };
// });
// pingStatus]


const mergedTableData = tableDataNas.map((nasRouter) => {
  // Find matching ping status for this router
  const routerPingStatus = pingStatus.find(
    (status) => status?.ip === nasRouter.ip_address
  );
  console.log('routerPingStatus', routerPingStatus)
  // Extract ping time if available
  const response = routerPingStatus?.response || "";
  const pingTimeMatch = response.match(/time[=<](\d+\.?\d*ms)/i); // More robust regex
  const pingTime = pingTimeMatch ? pingTimeMatch[1] : "N/A";
  
  return {
    ...nasRouter,
    ping: pingTime || "N/A",
    reachable: routerPingStatus?.reachable ? "Reachable" : "Not reachable",
    ip_adress_router: routerPingStatus?.ip || nasRouter.ip_address || "N/A",
    last_checked: routerPingStatus?.checked_at || "Never checked",
    response: response || "N/A"
  };
});




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
        color: rowData.reachable === 'Reachable' ? 'green' : 'red', 
        fontWeight: 'bold' 
      }}>
{rowData.response.match(/time[=<](\d+\.?\d*\s*ms)/i)?.[1] ?? 'N/A'}

      </span>
    )
  },
  
  // {title: 'status', field: 'reachable'},
  {
    title: 'Status',
    field: 'reachable',
    render: rowData => (
      <span style={{ 
        color: rowData.reachable === 'Reachable' ? 'green' : 'red', 
        fontWeight: 'bold' 
      }}>
        {rowData.reachable === 'Reachable' ? 'Reachable' : 'Not Reachable' }
      </span>
    )
  },
  {title: 'ip_address', field: 'ip_address',


   },
  {title: 'username', field: 'username', },
  // {title: 'password', field: 'password', },

  {title: 'Action', field:'Action',

  render: (rowData) =>  
    
     <>
      <div className='flex flex-row gap-4'>
       <DeleteButton  id={rowData.id} />
       <EditButton />


       <Tooltip 
       
       title="View Traffic" className='text-green-700 w-6 h-6'>
                  <FaFulcrum 
                   onClick={() => {
                   setOpenLoading(true);
                   setRouterName(rowData.id)
                    setTimeout(() => {
                       navigate(`/admin/router_details?id=${rowData.id} &status=${rowData.reachable}`);
                    }, 2000);
                  }}
                 
                  fontSize="large" />
              </Tooltip>


              <Tooltip title='radius' onClick={() => {
                 navigate(`/admin/radius-settings?id=${rowData.id} &ip_address=${rowData.ip_address} &l=${rowData.password} &short_code=${rowData.shortcode}`);
              }}>
<img src={FreeRadiusLogo} className="w-6 h-6" alt="FreeRADIUS" />
              </Tooltip>
   </div>
       </>

}

]
const handleCloseLoading = () => {
  setOpenLoading(false);
};

  return (
    <>
    <Loading openLoading={openLoading} setOpenLoading={setOpenLoading}
    handleClose={handleCloseLoading}
    />



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
             {/* <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none" viewBox="0 0 18 20">
                 <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                  strokeWidth="2" d="M3 5v10M3 5a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm0 10a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm12 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm0 0V6a3 3 0 0 0-3-3H9m1.5-2-2 2 2 2"/>
             </svg> */}
             <LuRouter className='text-black'/>
             
         </div>
 
 
         <input type="text" value={search} onChange={(e)=> setSearch(e.target.value)}
          className="bg-gray-50 border border-gray-300 text-gray-900 
         text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full ps-10 p-2.5 
           dark:border-gray-600 dark:placeholder-gray-400 dark:text-black
           dark:focus:ring-green-500 dark:focus:border-green-500" placeholder="Search for wifi routers..."  />
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
<EditNas open={open} handleClose={handleClose} tableData={tableDataNas} handleSubmit={handleSubmit}   nasformData={nasformData}
 setnasFormData={setnasFormData}  isloading={loading}
 editingRouter={editingRouter} setEditingRouter={setEditingRouter}
 />


<DeleteRouter loading={loading}  deleteRouter={deleteRouter} id={nasformData.id} 
 handleCloseDelete ={handleCloseDelete}  openDelete={openDelete}/>
      <MaterialTable columns={columns}
      
      title= { <p className='bg-gradient-to-r from-green-600 via-blue-400
         to-cyan-500 bg-clip-text text-transparent font-bold text-2xl'>NAS (Mikrotik Routers with PPPoE/Hotspot) </p> }
      
      
      data={mergedTableData}

    onRowClick={handleRowClick}
    actions={[
        {
          icon:()=><GetAppIcon/>,
          tooltip: 'import'
        },
        {
          icon: () => <AddIcon  onClick={handleClickOpen} />,
          isFreeAction: true, // This makes the action always visible
          tooltip: 'Add Router'
        }
    ]}


options={{
        paging: true,
       pageSizeOptions:[5, 10, 20],
       pageSize: 20,
       search: false,
searchFieldStyle: {
  borderColor: 'red'
},
searchAutoFocus: true,
showSelectAllCheckbox: false,
showTextRowsSelected: false,

selection: true,
paginationType: 'stepped',

// rowStyle:{
//   backgroundColor: 'dark'
// },

paginationPosition: 'bottom',


headerStyle:{
  fontFamily: 'bold',
  textTransform: 'uppercase'
  } ,
  
  // rowStyle:(data, index)=> index % 2 === 0 ? {
  // background: 'gray'
  // }: null,
  
  fontFamily: 'mono'
}}     
      
      
      
      
      />

    </div>
    </>
  )
}

export default Nas

