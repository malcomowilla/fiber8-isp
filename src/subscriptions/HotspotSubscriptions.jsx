
import MaterialTable from 'material-table'

import AddIcon from '@mui/icons-material/Add';



// import EditIcon from '@mui/icons-material/Edit';

import { useState, useEffect, useCallback } from 'react'

import { IconButton } from '@mui/material';
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




// import EditSubscription from '../edit/EditSubscription'



// const rows = [
//   {  Speed: '4M/4M', Name: 'Makena', Price: 1500, Validity: 30 },
//   {  Speed: '10M/10M', Name: 'Jane', Price: 4000, Validity: 30 },
//   {  Speed: '4M/4M', Name: 'Andrew', Price: 1500, Validity: 30 },
//   {  Speed: '10M/10M', Name: 'Jemo', Price: 4000, Validity: 30 },
//   {  Speed: '4M/4M', Name: 'James', Price: 1500, Validity: 30 },
//   {  Speed: '10M/10M', Name: 'Jeane', Price: 4000, Validity: 30 },
//   {  Speed: '4M/4M', Name: 'Oscar', Price: 1500, Validity: 30 },
//   {  Speed: '10M/10M', Name: 'Silky', Price: 4000, Validity: 30 },
// ];




// resources :hotspot_vouchers

const HotspotSubscriptions = () => {

  const [search, setSearch] = useState('')
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
   
    setVoucherForm(rowData)


  }
  
    const columns = [
        {title: 'Voucher', field: 'voucher', headerClassName: 'dark:text-black ', defaultSort: 'asc'},
      
        {title: 'Status', field: 'status',  headerClassName: 'dark:text-black'},
        {title: 'Expiration', field: 'expiration', type: 'numeric', headerClassName: 'dark:text-black'},
        {title: 'package', field:'package',  headerClassName: 'dark:text-black'},
      
        {title: 'Speed Limit', field:'speed limit',  headerClassName: 'dark:text-black'},
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
      const response = await fetch('/api/hotspot_vouchers')
      const newData = await response.json()
      if (response.ok) {
      
        setVouchers(newData)
      } else {
        toast.error('Failed to fetch vouchers', {
          position: "top-center",
          duration: 4000,
        })
      }
    } catch (error) {
      toast.error('Failed to fetch vouchers internal server error', {
        position: "top-center",
        duration: 4000,
      })
    }


  },
  [],
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
        ? data.reduce((latest, item) => new Date(item.created_at) > new Date(latest.created_at) ? item : latest, data[0])
        : null;
  
      if (response.ok) {
        console.log('Fetched SMS settings:', newData);
        const { api_key, api_secret, sender_id, short_code, sms_provider, partnerID } = newData;
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
      const response = await fetch('/api/hotspot_vouchers', {
        method: 'POST',
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
        setVoucherForm({
          package: newData.package,
          phone_number: newData.phone,
          shared_users: newData.shared_users,
        })
        
        toast.success('Voucher created successfully', {
          position: "top-center",
          duration: 4000,
        })
        setVouchers([...vouchers, newData])
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

  return (
    <>


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
   
<MaterialTable columns={columns}

title='Hotspot Vouchers'
onRowClick={handleRowClick}
data={vouchers}

actions={[
 {
  icon: ()=> <AddIcon onClick={handleClickOpen}/>,
    isFreeAction: true,
    tooltip: 'Add Voucher'
  
  


 }
]}
options={{
  sorting: true,
  pageSizeOptions:[2, 5, 10, 20],
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
    </>
  )
}

export default HotspotSubscriptions





