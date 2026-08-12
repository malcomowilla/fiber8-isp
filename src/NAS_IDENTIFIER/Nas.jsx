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
import { LuChartNetwork } from "react-icons/lu";
import { FaFulcrum } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import Loading from './Loading'
import FreeRadiusLogo from "../../public/images/free_radius.svg";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { LuMonitorSmartphone } from "react-icons/lu";
import RemoteWinboxModal from './RemoteWinboxModal'; 






const Nas = () => {

const navigate = useNavigate()
  const [open, setOpen] = useState(false);
  const [editingRouter, setEditingRouter] = useState(false)

const [loading, setloading] = useState(false)
const [offlineerror, setofflineerror] = useState(false)
const [openDelete, setOpenDelete] = useState(false);
const [winboxModalOpen, setWinboxModalOpen] = useState(false);
const [winboxRouter, setWinboxRouter] = useState(null);
const [winboxClosing, setWinboxClosing] = useState(false);








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


const [tableDataNas, setTableDataNas] = useState([]); 


  const [openLoading, setOpenLoading] = useState(false);


const [selectedRouterId, setSelectedRouterId] = useState(() => {
  const savedRouterId = localStorage.getItem('selectedCheckedRouter');
  return savedRouterId ? parseInt(savedRouterId, 10) : null;
});






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
    }
  }



  const handleRowClick = (event, rowData) => {
    setnasFormData(rowData);
    console.log('router row data', rowData)
    setRouterName(rowData.id)
    setEditingRouter(true)
  
    // Add your custom logic here, such as opening a modal or updating state
  };


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
    
    fetchRouters()
  }, [fetchRouters]);



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
            body: JSON.stringify(nasformData),
        })

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
            
            setloading(false)
          handleClose()

        } else {
          toast.error('failed to add router', {
            position: "top-center",
            duration: 6000,
          })
            setloading(false)

        }
    } catch (error) {
      toast.error('failed to add router something went wrong', {
        position: "top-center",
        duration: 6000,
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
        


const mergedTableData = tableDataNas.map((nasRouter) => {
  // Find matching ping status for this router
  const routerPingStatus = pingStatus.find(
    (status) => status?.ip === nasRouter.ip_address
  );
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


  // Stops the relay session on the server (deletes the HAProxy conf file
  // for this port) before closing the modal, so idle sessions don't sit
  // open for the full 15 minute TTL.
  const closeWinboxSession = async () => {
    if (winboxRouter?.id) {
      setWinboxClosing(true);
      try {
        const res = await fetch(`/api/nas_routers/${winboxRouter.id}/winbox_session`, {
          method: 'DELETE',
          headers: {
            'X-Subdomain': subdomain,
          },
        });
        if (res.ok) {
          toast.success('WinBox session closed', {
            position: 'top-center', duration: 3000,
          });
        } else {
          const data = await res.json().catch(() => ({}));
          toast.error(data.error || `Failed to close session (${res.status})`, {
            position: 'top-center', duration: 6000,
          });
        }
      } catch (error) {
        toast.error('Failed to close session — network error', {
          position: 'top-center', duration: 6000,
        });
        console.log('failed to stop winbox session', error);
      } finally {
        setWinboxClosing(false);
      }
    }
    setWinboxModalOpen(false);
  };


  

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

  {
    title: 'ping',
    field: 'response',
    render: rowData => (
      <span style={{ 
        color: rowData.reachable === 'Reachable' ? 'green' : 'red', 
        fontWeight: 'bold' 
      }}>
        {rowData.response?.substring(14, 35) || 'N/A'}

      </span>
    )
  },
  
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

   {title: 'Location', field: 'location'},
  {title: 'username', field: 'username', },
{title: 'Action', field:'Action',
  render: (rowData) =>  
    <>
      <div className='flex flex-wrap gap-2 items-center'>
        <DeleteButton id={rowData.id} />
        <EditButton />

        <Tooltip title="Router Details">
          <IconButton
            size="small"
            onClick={() => {
              setOpenLoading(true);
              setRouterName(rowData.id);
              setTimeout(() => {
                navigate(`/admin/router_details?id=${rowData.id}&status=${rowData.reachable}`);
              }, 2000);
            }}
          >
            <LuChartNetwork className='text-black' style={{ width: 22, height: 22 }} />
          </IconButton>
        </Tooltip>


<Tooltip title="Remote WinBox">
  <IconButton size="small" onClick={() => {
    setWinboxRouter(rowData);
    setWinboxModalOpen(true);
  }}>
    <LuMonitorSmartphone className='text-black' style={{ width: 22, height: 22 }} />
  </IconButton>
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
<RemoteWinboxModal
  open={winboxModalOpen}
  onClose={closeWinboxSession}
  closing={winboxClosing}
  routerId={winboxRouter?.id}
  routerName={winboxRouter?.name}
/>



<div className={`rounded-2xl border overflow-hidden shadow-sm ${
  isDark ? 'border-[#3a3a3a]' : 'border-[#e5e0d5]'
}`}>
 <ThemeProvider theme={tableTheme}>

      <MaterialTable columns={columns}
      
      title= { <p className='
        
         font-bold text-2xl font-sans
'>NAS (Mikrotik Routers 
         with PPPoE/Hotspot) </p> }
      
      
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


localization={{
                body: {
                  emptyDataSourceMessage: 'No NAS found. Create your first NAS to get started!'
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


    </div>
    </>
  )
}

export default Nas