
import MaterialTable, {MTablePagination} from "material-table";
import { createTheme, ThemeProvider, CssBaseline } from '@mui/material';
import {useApplicationSettings} from '../settings/ApplicationSettings'
import { Button, Box } from '@mui/material';
import {useState, useCallback, useEffect,} from 'react'
import AddIcon from '@mui/icons-material/Add';
import GetAppIcon from '@mui/icons-material/GetApp';
// import CustomerRegistrationForm from '../registration/CustomerRegitrationForm'
import dayjs from 'dayjs';

import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { ImSpinner9 } from "react-icons/im";
import AccessDenied from '../access_denied/AccessDenied'
// import { requestPermission } from '../firebase/firebasePermission';
import {useNavigate} from 'react-router-dom'

import { ToastContainer, toast,Bounce, Slide, Zoom, } from 'react-toastify';

import QuestionMarkAnimation from '../animation/question_mark.json'
import Lottie from 'react-lottie';
import LoadingAnimation from '../animation/loading_animation.json'
import Backdrop from '@mui/material/Backdrop';
import { createConsumer } from '@rails/actioncable';
import { useDebounce } from 'use-debounce';
import { IoPeople } from "react-icons/io5";
import DeleteRequests from './DeleteRequests'
import toaster, { Toaster } from 'react-hot-toast';




const ClientRequests = () => {
const navigate = useNavigate()
 
  const {customers, setGetCustomers, customerformData, setcustomerformData,
     setSeeCustomerCode, updatedMessage, setUpdatedMessage,  settingsformData,
     materialuitheme,adminFormSettings,setopenLogoutSession,
     setSnackbar
  } = useApplicationSettings()

  const {send_sms_and_email, send_email} = settingsformData
console.log('sms and email:',send_sms_and_email )
  const [isOpen, setIsOpen] = useState(false);
const [openAddition, setopenAddition] = useState(false)
const [ openUpdated, setIsOpenUpdated] = useState(false)
const [isOpenDelete, setIsOpenDelete] = useState(false)
const [openDeleteAlert, setOpenDeleteAlert] = useState(false)
const [openOfflineAlert, setOpenOfflineAlert] = useState(false)
const [loading, setloading] = useState(false)
const [emailError, setEmailError] = useState('')
const [seeEmailError, setSeeEmailError] = useState(false)
const [phoneNumberError, setPhoneNumberError] = useState('')
const [seePhoneNumberError, setSeePhoneNumberError] = useState(false)
const [nameError, setNameError] = useState('')
const [seeNameError, setSeeNameError] = useState(false)
const [openAccessDenied, setopenopenAccessDenied] = useState(false)
const [openLoad, setopenLoad] = useState(false)
const [requestid, setRequestId] = useState(null)
const [search, setSearch] = useState('')
const [searchInput] = useDebounce(search, 1000)
const [isOpenDeleteRequests, setIsOpenDeleteRequests] = useState(false)

// console.log('adminset',adminFormSettings)



const defaultOptions = {
  loop: true,
  autoplay: true, 
  animationData: LoadingAnimation,
  rendererSettings: {
    preserveAspectRatio: 'xMidYMid slice'
  }
};

const defaultOptions2 = {
  loop: true,
  autoplay: true, 
  animationData: QuestionMarkAnimation,
  rendererSettings: {
    preserveAspectRatio: 'xMidYMid slice'
  }
};





const handleCloseOfflineAlert = ()=> {
  setOpenOfflineAlert(false)
}





const handleCloseUpdated = ()=> {
  setIsOpenUpdated(false)
}






const handleCloseDeleteAlert = ()=> {
  setOpenDeleteAlert(false)
}




const handleCloseRegistrationForm = (e)=> {
  setIsOpen(false)
  e.preventDefault()
}




// const handleClickOpen = () => {
//   setcustomerformData('');
//   setIsOpen(true)
//   setSeeCustomerCode(false)
//   setSeeNameError(false)
//   setSeeEmailError(false)
//   setSeePhoneNumberError(false)
//   setcustomerformData((prevData) => (
//     {...prevData , date_registered: dayjs(new Date())}
//   ))

// }






  const handleCloseAddition = () => {
    setopenAddition(false)
  }

  
const handleRowClick = (event, rowData) => {
    setRequestId(rowData.id);
  

};





const deleteRequests = async (id)=> {

  try {
    setloading(true)

const response = await fetch(`/api/delete_client_request/${id}`, {
  method: 'DELETE'
  })
  
  if (response.ok) {
    toaster.success('Client Request Deleted Successfully', {
        duration: 5000,
        position: "top-center",
    })
    setGetCustomers(customers.filter((customer)=> customer.id !==  id))
    setIsOpenDeleteRequests(false)
    setOpenDeleteAlert(true)
    setloading(false)

  
  } else {
    console.log('failed to delete')
    setIsOpenDeleteRequests(false)
    setloading(false)
    toaster.error('Failed to Delete Client Request', {
        duration: 6000,
        position: "top-center",
      })

    
    
  }
  } catch (error) {
    console.log(error)
    setIsOpenDeleteRequests(false)
    setloading(false)
    toaster.error('Failed to Delete Client Request Something Went Wrong', {
        duration: 6000,
        position: "top-center",
      })

  }
  
}














const controller = new AbortController();
const id = setTimeout(() => controller.abort(), 9000);




const getCustomers = 
useCallback(
  async() => {

    try {
      const response = await fetch('/api/client_requets', {
        signal: controller.signal,  

      })
      clearTimeout(id);
     
     
      const newData = await response.json()
      
      if (response.ok) {
        // setGetCustomers(newData)
        setGetCustomers(newData.filter((customer)=> {
          return search.toLowerCase() === '' ? customer : customer.name.toLowerCase().includes(search)
        }))
        console.log('customer data', newData)
      } else {
        console.log('error')
        setOpenOfflineAlert(false)
      }
    } catch (error) {
      setOpenOfflineAlert(true)
    }
  },
  [searchInput],
)



useEffect(() => {
  getCustomers()
}, [getCustomers,]);





  const EditButton = ({rowData}) => (
  <img src="/images/logo/1495216_article_circle_edit_paper_pencil_icon.png"  
  className='w-8 h-8  ' alt="edit" onClick={()=>setIsOpen(true)}/>
      );



      const DeleteButton = ({id}) => (
        <img src="/images/logo/6217227_bin_fly_garbage_trash_icon.png"  onClick={()=> setIsOpenDeleteRequests(true)}  className='w-8 h-8 ' alt="delete" />
      )

  return (

<>
<Toaster />
<DeleteRequests   isOpenDeleteRequests={isOpenDeleteRequests} 
setIsOpenDeleteRequests={setIsOpenDeleteRequests} deleteRequests={deleteRequests} id={requestid}/>


{loading &&    <Backdrop open={openLoad} sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
  
<Lottie className='relative z-50' options={defaultOptions} height={400} width={400} />
  
   </Backdrop>
}





{openAccessDenied ? (
  <AccessDenied />
) : 
<>
<ThemeProvider theme={materialuitheme}>


    <div style={{ maxWidth: "100%" }} className='cursor-pointer'>
   
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
          dark:focus:ring-green-500 dark:focus:border-green-500" placeholder="Search for customers..."  />
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



{/* 
:company_name, :business_type, :contact_person, 
        :business_email, :phone_number, :expected_users,
        :country, :city, :message, :company_website,:name,
        :no_of_employees,  */}
    <MaterialTable
   
      columns={[
        { title: "User Name", field: "name",
         
        },
        { title: "Company  Name", field: "company_name" },
        { title: "Number of Employees", field: "no_of_employees" },
        { title: "Expected Number of Users", field: "expected_users" },
      
        {
          title: "Phone Number",
          field: "phone_number", 
        },
       
        {
          title: "Busines Email",
          field: "business_email",
        
        },
    
      
        {
          title: 'Message',
          field: 'message',
        
        },
        {
          title: "Action",
          field: "Action",
          render: (rowData) => 
            <>
              <Box sx={{
                display: 'flex',
                gap: 2
              }}>
                <EditButton   />

              <DeleteButton   id={rowData.id}/>
              </Box>
            

              
              </>
            
            
          }
      ]}

      onRowClick={handleRowClick} 


      actions={[
        {
          icon: () => <div    className='bg-teal-700 p-2 w-14 rounded-lg'><AddIcon
           style={{color: 'white'}}/></div>,
          isFreeAction: true, // This makes the action always visible
          tooltip: 'Add Customer',
        },
        {
          icon: () => <GetAppIcon />,
          isFreeAction: true, // This makes the action always visible
      
          tooltip: 'Import',
        },
      ]}

   data={customers}


      title="Client Requests"
      

      options={{
        paging: true,
       pageSizeOptions:[5, 10, 20, 25, 50, 100],
       pageSize: 10,
       search: false,
  

showSelectAllCheckbox: false,
showTextRowsSelected: false,
hover: true, 
selection: true,
paginationType: 'stepped',


paginationPosition: 'bottom',
exportButton: true,
exportAllData: true,
exportFileName: 'Customers',

headerStyle:{
fontFamily: 'bold',
textTransform: 'uppercase'
} ,


fontFamily: 'customers'

}}     
    />
  </div>
  </ThemeProvider >
</>}
    
</>
  )
}

export default ClientRequests
