
import MaterialTable from 'material-table'
import AddIcon from '@mui/icons-material/Add';
import { FaPhoneVolume } from "react-icons/fa6";
import { FaHands } from "react-icons/fa";
import { useState, useEffect, useCallback } from 'react'
import { IconButton, Tooltip } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { IoIosQrScanner } from "react-icons/io";
import EditVoucher from '../edit/EditVoucher'
import toast, { Toaster } from 'react-hot-toast';

import LoadingAnimation from '../loader/loading_animation.json'
import Lottie from 'react-lottie';
import Backdrop from '@mui/material/Backdrop';
import {useApplicationSettings} from '../settings/ApplicationSettings'
import EditIcon from '@mui/icons-material/Edit';
import DeleteVoucher from '../delete/DeleteVoucher'
import { FaDesktop } from "react-icons/fa"; // Import device icon
import { useDebounce } from 'use-debounce';
import CircularProgress from "@mui/material/CircularProgress"; // Import CircularProgress for loading animation
import SendVoucher from './SendVoucher'
import CompensationVoucher from '../edit/CompensationVoucher'
import { createConsumer } from "@rails/actioncable";
const cable = createConsumer(`wss://${window.location.hostname}/cable`);
// const cable = createConsumer(`ws://localhost:4000/cable`);



const HotspotSubscriptions = () => {

  const [search, setSearch] = useState('')
  const [searchInput] = useDebounce(search, 1000)
  const [isSearching, setIsSearching] = useState(false); // New state for search loading
  const [openSendVoucher, setOpenSendVoucher] = useState(false);
  const [editVoucher, setEditVoucher] = useState(false);
  



  const { settingsformData, setFormData, selectedProvider, setSelectedProvider, 
    setSmsSettingsForm
   } = useApplicationSettings();

  const [tableData, setTableData] = useState([])
  const [loading, setloading] = useState(false)
  const [open, setOpen] = useState(false);
  const [voucherForm, setVoucherForm] = useState({
    package: '',
    phone: '',  
    shared_users: '',
    


  })
  const [vouchers, setVouchers] = useState([])
  const [openLoad, setopenLoad] = useState(false)
  const [openDelete, setOpenDelete] = useState(false);
const [voucher, setVoucher] = useState('')
const [openCompensationVoucher, setOpenCompensationVoucher] = useState(false);

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


//   const handleChangeVoucher = (e) => {
// const {name, id, value} = e.target
// console.log('voucher', e.target.value)
//     setVoucherForm({
//       ...voucherForm,
//       [name]: value
//     })

//   }



const handleChangeVoucher = (e) => {
setVoucherForm((prevState) => ({
 ...prevState,
  [e.target.name]: e.target.value
}))
  console.log('voucher', e.target.value)
}




  const handleRowClick = (event, rowData) => {
    console.log('vouchers',rowData)
   setVoucher(rowData.voucher)
    setVoucherForm(rowData)
    setEditVoucher(true)


  }



  const parseBackendDate = (dateString) => {
  if (!dateString) return null;
  
  // Parse date in format like "March 15, 2025 at 08:46 PM"
  const [monthDayYear, timePart] = dateString.split(' at ');
  const [month, day, year] = monthDayYear.replace(',', '').split(' ');
  const [time, period] = timePart.split(' ');
  let [hours, minutes] = time.split(':').map(Number);
  
  if (period === 'PM' && hours < 12) hours += 12;
  if (period === 'AM' && hours === 12) hours = 0;
  
  return new Date(`${month} ${day}, ${year} ${hours}:${minutes}:00`);
};

const calculateExpirationProgress = (expirationDate) => {
  const expiration = parseBackendDate(expirationDate);
  if (!expiration) return 100; // Treat invalid dates as expired
  
  const now = new Date();
  const totalMs = expiration - now;
  
  // If already expired
  if (totalMs <= 0) return 100;
  
  // If expiration is more than 1 year in the future (treat as full)
  if (totalMs > 365 * 24 * 60 * 60 * 1000) return 0;
  
  // Calculate percentage of time passed in the 1-year window
  const oneYearMs = 365 * 24 * 60 * 60 * 1000;
  const progress = 100 - (totalMs / oneYearMs) * 100;
  
  return Math.max(0, Math.min(100, progress));
};

const formatRemainingTime = (expirationDate) => {
  const expiration = parseBackendDate(expirationDate);
  if (!expiration) return 'No expiration';
  
  const now = new Date();
  const diffMs = expiration - now;
  
  if (diffMs <= 0) return 'Expired';
  
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHrs = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  
  return `${diffDays}d ${diffHrs}h ${diffMins}m remaining`;
};

  


  
    const columns = [
        {title: 'Voucher', field: 'voucher', headerClassName: 'dark:text-black ', defaultSort: 'asc'},
      
        {title: 'Status', field: 'status',  headerClassName: 'dark:text-black', render: (rowData) => (
          <div className='flex items-center gap-2'>
            <p className={`
              ${rowData.status === 'active' && 'text-green-500 bg-green-100 p-1 rounded-lg'}
              ${rowData.status === 'expired' && 'text-red-500 bg-red-100 p-1 rounded-lg'}
              ${rowData.status === 'used' && 'text-yelow-500 bg-yellow-100 p-1 rounded-lg'}
              `}>{rowData.status}</p>
          </div>
        )},
      {
  title: 'Expiration', 
  field: 'expiration', 
  headerClassName: 'dark:text-black',
  render: (rowData) => {
    const progress = calculateExpirationProgress(rowData.expiration);
    const remainingText = formatRemainingTime(rowData.expiration);
    const isExpired = progress >= 100;
    
    return (
      <Tooltip title={remainingText} arrow>
        <div className="flex flex-col w-full">
          <span className={isExpired ? 'text-red-500' : 'text-green-500'}>
            {rowData.expiration}
          </span>
          <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
            <div 
              className="h-2.5 rounded-full" 
              style={{ 
                width: `${isExpired ? 100 : 100 - progress}%`,
                backgroundColor: isExpired 
                  ? 'orange' // red when expired
                  : progress > 80 
                    ? '#f59e0b' // yellow when less than 20% remaining
                    : '#10b981' // green otherwise
              }}
            ></div>
          </div>
        </div>
      </Tooltip>
    );
  }
},
        {title: 'package', field:'package',  headerClassName: 'dark:text-black'},
      
        {title: 'Speed Limit', field:'speed_limit',  headerClassName: 'dark:text-black'},
        {title: 'Phone', field:'phone',  headerClassName: 'dark:text-black'},
        {
          title: "Device",
          field: "shared_users",
          headerClassName: "dark:text-black",
          render: (rowData) => (
            <div className="flex items-center">
              <FaDesktop className="mr-2 text-green-500" /> {/* Device icon */}
              <span>{rowData.device}</span>
              {rowData.shared_users && (
                <span className=" text-sm text-black dark:text-white">({rowData.shared_users})</span>
              )}

               <Tooltip title="send voucher to device">
        <IconButton arrow color="primary" 
        onClick={() => setOpenSendVoucher(true)}>
         <FaPhoneVolume className='text-green-500 text-xl'/>
         </IconButton>
         </Tooltip>
            </div>
          ),
        },

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
    <IconButton style={{color: 'green'}} onClick={() => setOpen(true)} >
      <EditIcon />
    </IconButton>
  )

  const handleClose = () => {
    setOpen(false);
  }

  const handleClickOpen = () => {
    setOpen(true);
  }


const subdomain = window.location.hostname.split('.')[0]






// useEffect(() => {
//     const subscription = cable.subscriptions.create(
//       { channel: "VoucherChannel" , 
//         "X-Subdomain": subdomain
//   }, 
//       {
//         received(data) {
//            console.log('received data from voucher chanel', data)
//             setVouchers(data.vouchers)
       

         
//         },
//         connected() {
//           console.log("Connected to VoucherChannel");
//         },
//         disconnected() {
//           console.log("Disconnected from VoucherChannel");
//         },
//       }
//     );

//     return () => {
//       subscription.unsubscribe();
//     };
//   }, [subdomain]);





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
  




const getHotspotVouchers = useCallback(
  async() => {
    try {
      setIsSearching(true)
      const response = await fetch('/api/hotspot_vouchers', {
        headers: {
          'X-Subdomain': subdomain, 
          },
      })
      const newData = await response.json()
      if (response.ok) {
        setIsSearching(false)
        setVouchers(newData)
        setVouchers(newData.filter((voucher)=> {
          return search.toLowerCase() === '' ? voucher : voucher.status.toLowerCase().includes(search)
        }))


        
      } else {
        setIsSearching(false)


  if (response.status === 402) {
    toast.error(newData.error, {
      position: "top-center",
      duration: 4000,
    })
    
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
        toast.error('Failed to fetch vouchers', {
          position: "top-center",
          duration: 4000,
        })
      }
    } catch (error) {
      setIsSearching(false)
      toast.error('Failed to fetch vouchers internal server error', {
        position: "top-center",
        duration: 4000,
      })
    }


  },
  [searchInput],
)




useEffect(() => {
  
  getHotspotVouchers()
}, [getHotspotVouchers]);





const fetchSavedSmsSettings = useCallback(
  async() => {
    
    try {
      const response = await fetch(`/api/saved_sms_settings`, {
        headers: {
          'Content-Type': 'application/json',
          'X-Subdomain': subdomain,
        },
      });
  
      const data = await response.json();

      const newData = data.length > 0 
      ? data.reduce((latest, item) => new Date(item.updated_at) > new Date(latest.updated_at) ? item : latest, data[0])
      : null;
  
      if (response.ok) {
        console.log('Fetched SMS settings:', newData);
        const { api_key, api_secret, sender_id, short_code, sms_provider, partnerID } = newData[0];
        // setSmsSettingsForm({ api_key, api_secret, sender_id, short_code, partnerID });
        setSelectedProvider(sms_provider);
        // setSelectedProvider(newData[0].sms_provider);
      } else {
        toast.error(newData.error || 'Failed to fetch SMS settings', {
          duration: 3000,
          position: 'top-center',
        });
      }
    } catch (error) {
      toast.error('Internal server error: Something went wrong with fetching SMS settings', {
        duration: 3000,
        position: 'top-center',
      });
    }
  },
  [],
)


useEffect(() => {
  fetchSavedSmsSettings();
 
}, [fetchSavedSmsSettings]);


  const createVoucher = async(e) => {
    e.preventDefault()
setloading(true)
setopenLoad(true)
    try {
      const url = voucherForm.id ? `/api/hotspot_vouchers/${voucherForm.id}?router_name=${settingsformData.router_name}` : '/api/hotspot_vouchers';
      const method = voucherForm.id ? 'PATCH' : 'POST';
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'X-Subdomain': subdomain,
        },
        body: JSON.stringify({...voucherForm, 
          router_name:settingsformData.router_name, use_radius: settingsformData.use_radius,
          selected_provider: selectedProvider
           
        })
      })

      const newData = await response.json()
      if (response.ok) {
        setOpen(false)
        setloading(false)
setopenLoad(false)
        // setVoucherForm({
        //   package: newData.package,
        //   phone_number: newData.phone,
        //   shared_users: newData.shared_users,
        // })
        
        toast.success('Voucher created successfully', {
          position: "top-center",
          duration: 4000,
        })
        if (voucherForm.id) {
          toast.success('Voucher updated successfully', {
            position: "top-center",
            duration: 4000,
          })
           setVouchers(vouchers.map(item => (item.id === voucherForm.id ? newData : item)));
        } else {
          
          setVouchers([...vouchers, newData])
           toast.success('Voucher created successfully', {
            position: "top-center",
            duration: 4000,
          })
        }
      } else {
        setloading(false)
setopenLoad(false)
        toast.error('Failed to create voucher', {
          position: "top-center",
          duration: 4000,
        })

        toast.error(newData.error, {
          position: "top-center",
          duration: 4000,
        })
      }


    } catch (error) {
      setloading(false)
setopenLoad(false)
      toast.error('Failed to create voucher server error', {
        position: "top-center",
        duration: 4000,
      })
    }

  }



  const deleteVoucher = async(id)=> { 
    try {
      
      const response = await fetch(`/api/hotspot_vouchers/${id}?router_name=${settingsformData.router_name}&use_radius=${settingsformData.use_radius}`, {
        method: "DELETE",
        headers: {
          'X-Subdomain': subdomain,
        },
      })

      const newData = await response.json()
      if (response.ok) {
        setVouchers((vouchers)=> vouchers.filter(item => item.id !== id))
        toast.success('Voucher deleted successfully', {
          position: "top-center",
          duration: 4000,
        })
        setOpenDelete(false)
      }else{
        setOpenDelete(false)
        toast.error('Failed to delete voucher', {
          position: "top-center",
          duration: 4000,
        })

        toast.error(newData.error, {
          position: "top-center",
          duration: 4000,
        })
      }
    } catch (error) {
      toast.error('Failed to delete voucher servere error', {
        position: "top-center",
        duration: 4000,
      })
    }
  }

  const handleCloseCompensationVoucher = () => {
    setOpenCompensationVoucher(false);
  }

  return (
    <>

<SendVoucher  open={openSendVoucher} setOpen={setOpenSendVoucher}

voucher={voucher}
/>

<DeleteVoucher  openDelete={openDelete} handleCloseDelete={handleCloseDelete} 
deleteVoucher={deleteVoucher} id={voucherForm.id} loading={loading}/>

<Backdrop open={openLoad} sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Lottie className='relative z-50' options={defaultOptions} height={400} width={400} />
      </Backdrop>


    <Toaster />

    <EditVoucher open={open} handleClose={handleClose}
    voucherForm={voucherForm} createVoucher={createVoucher}
    setVoucherForm={setVoucherForm}
    handleChangeVoucher={handleChangeVoucher}
    editVoucher={editVoucher}

    />


    <CompensationVoucher open={openCompensationVoucher}
    handleClose={handleCloseCompensationVoucher}
    
     voucherForm={voucherForm} createVoucher={createVoucher}
    setVoucherForm={setVoucherForm}
    handleChangeVoucher={handleChangeVoucher}
    />
    <div>


         
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
            <IoIosQrScanner className='text-black'/>
            
        </div>


        <input type="text" value={search} onChange={(e)=> setSearch(e.target.value)}
         className="bg-gray-50 border border-gray-300 text-gray-900 
        text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full ps-10 p-2.5 
          dark:border-gray-600 dark:placeholder-gray-400 dark:text-black
          dark:focus:ring-green-500 dark:focus:border-green-500" placeholder="Search for vouchers..."  />
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
   
<MaterialTable columns={columns}

title={<p className='bg-gradient-to-r from-green-600 via-blue-400
         to-cyan-500 bg-clip-text text-transparent text-2xl font-bold'>Hotspot Vouchers </p>}
onRowClick={handleRowClick}
data={vouchers}

actions={[
 {
  icon: ()=> <AddIcon onClick={() => {
    handleClickOpen()
     setEditVoucher(false)
     setVoucherForm('')
  }}/>,
    isFreeAction: true,
    tooltip: 'Add Voucher',
  
  

 },

{
  

  icon: ()=>  <button
  onClick={() => setOpenCompensationVoucher(true)}
  className='flex text-white gap-2 bg-green-600
  p-2 rounded-md
  '> <FaHands  className='text-white text-xl'/>
  <p className='text-sm'>compensate</p>
    </button>,
    isFreeAction: true,



}
]}
options={{
  sorting: true,
  pageSizeOptions:[2, 5, 10],
  // pageSize: 20,
  paginationPosition: 'bottom',
exportButton: true,
exportAllData: true,
selection: true,
search: false,
searchAutoFocus: true,
showSelectAllCheckbox: false,
showTextRowsSelected: false,

hover: true, 
paginationType: 'stepped',



headerStyle:{
  fontFamily: 'bold',
  textTransform: 'uppercase'
  } ,
  
  
  fontFamily: 'mono'


}}



/>

    </div>
    </div>
    </>
  )
}

export default HotspotSubscriptions





