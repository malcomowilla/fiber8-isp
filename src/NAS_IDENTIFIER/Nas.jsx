import DeleteIcon from '@mui/icons-material/Delete';
// import {useState} from 'react'
// import { DataGrid, GridToolbar } from '@mui/x-data-grid';

import EditIcon from '@mui/icons-material/Edit';
// import RadioGroup from '@mui/material/RadioGroup';
// import FormControlLabel from '@mui/material/FormControlLabel';

import { IconButton,  Checkbox } from '@mui/material';
import GetAppIcon from '@mui/icons-material/GetApp';
// import {Link} from 'react-router-dom'
import {  useState, useEffect, useMemo, useCallback} from 'react'
// import {ApplicationContext} from '../context/ApplicationContext'
import EditNas from '../edit/EditNas' 
import AddIcon from '@mui/icons-material/Add';

import MaterialTable from 'material-table'
import toast, { Toaster } from 'react-hot-toast';

import DeleteRouter from '../delete/DeleteRouter'
import {useApplicationSettings} from '../settings/ApplicationSettings'
import { LuRouter } from "react-icons/lu";

import InputAdornment from '@mui/material/InputAdornment';




const Nas = () => {


  const [open, setOpen] = useState(false);

const [loading, setloading] = useState(false)
const [offlineerror, setofflineerror] = useState(false)
const [openDelete, setOpenDelete] = useState(false);
const { nasformData, setnasFormData,initialValueNas, setTableData,
  pingStatus, setPingStatus,
  showMenu1, setShowMenu1, showMenu2, setShowMenu2, showMenu3, setShowMenu3,
      showMenu4, setShowMenu4, showMenu5, setShowMenu5, showMenu6, setShowMenu6,
       showMenu7, setShowMenu7, showMenu8, setShowMenu8, showMenu9, setShowMenu9,
        showMenu10, setShowMenu10, showMenu11, setShowMenu11, showMenu12, setShowMenu12,


 } =  useApplicationSettings() 
const [selectedRouter, setSelectedRouter] = useState(null);
const [selectedRouterInfo, setSelectedRouterInfo] = useState(null);
const [search ,setSearch] = useState('')


const [tableDataNas, setTableDataNas] = useState([]); // Stores routers

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



  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), 6000);

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
            signal: controller.signal,
            body: JSON.stringify(nasformData),
        })

          clearTimeout(id)
        
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
        console.log('selected rowdata', selectedRouter)





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
              console.log('router ping status fetch', newData)
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



const mergedTableData = tableDataNas.map((router) => {
  console.log('router', router)
  const response = pingStatus?.response || "";
  const pingTimeMatch = response.match(/time (\d+ms)/); // Extracts "time XXXXms"
  const pingTime = pingTimeMatch ? pingTimeMatch[1] : "N/A"; // Default if no match
  const ip_adress_router = pingStatus?.ip

  return {
    ...router,
    ping: pingTime || "N/A", // Extracted ping time
    reachable: router.ping_status?.router_status?.reachable ? "reachable" : "not reachable",
    ip_adress_router
  };
});



  const DeleteButton = () => (
        <IconButton style={{ color: '#8B0000' }}  onClick={ handleClickOpenDelete}>
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
        color: pingStatus?.reachable === true ? 'green' : 'red', 
        fontWeight: 'bold' 
      }}>
{rowData.ip_adress_router
 === rowData.ip_address ? rowData.ping : ''}
      </span>
    )
  },
  
  // {title: 'status', field: 'reachable'},
  {
    title: 'Status',
    field: 'reachable',
    render: rowData => (
      <span style={{ 
        color: pingStatus?.reachable === true ? 'green' : 'red', 
        fontWeight: 'bold' 
      }}>
        {rowData.ip_adress_router
 === rowData.ip_address ? pingStatus?.reachable === true ? 'reachable' : 'not reachable' : ''}
      </span>
    )
  },
  {title: 'ip_address', field: 'ip_address',


   },
  {title: 'username', field: 'username', },
  {title: 'password', field: 'password', },

  {title: 'Action', field:'Action',

  render: (rowData) =>  
    
     <>
      
       <DeleteButton  id={rowData.id} />
       <EditButton />
   
       </>

}


]

  return (
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
 setnasFormData={setnasFormData}  isloading={loading}/>


<DeleteRouter loading={loading}  deleteRouter={deleteRouter} id={nasformData.id}  handleCloseDelete ={handleCloseDelete}  openDelete={openDelete}/>
      <MaterialTable columns={columns}
      
      title='NAS (Mikrotik Routers with PPPoE/Hotspot)'
      
      
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
       pageSizeOptions:[5, 10, 20, 25, 50, 100],
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
  )
}

export default Nas

