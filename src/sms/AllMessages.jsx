
import MaterialTable, {MTablePagination} from "material-table";
import { createTheme, ThemeProvider, CssBaseline } from '@mui/material';
import {useApplicationSettings} from '../settings/ApplicationSettings'
import { Button, Box } from '@mui/material';
import {useCallback, useEffect, useState} from 'react'
import AddIcon from '@mui/icons-material/Add';
import GetAppIcon from '@mui/icons-material/GetApp';
import { MdOutlineSupportAgent } from "react-icons/md";
 import {useNavigate} from 'react-router-dom'
 import { ToastContainer, toast,Bounce, Slide, Zoom, } from 'react-toastify';
 import { useDebounce } from 'use-debounce';
 import { LiaSmsSolid } from "react-icons/lia";


const AllMessages = () => {

const navigate = useNavigate()


const [search, setSearch] = useState('')
const [searchInput] = useDebounce(search, 1000)

  const [sms, setSms] = useState([])
  const [isOpen, setIsOpen] = useState(false);
const [isOpenDelete, setisOpenDelete] = useState(false)
const [message, setMessage] = useState({
  message: ''
})
const [openDeleteMessage, setopenDeleteMessage] = useState(false)

const handleCloseDeleteMessage = ()=>{
  setopenDeleteMessage(false)
}

const [openLoad, setopenLoad] = useState(false)
const [loading, setloading] = useState(false)
    const {
      
        materialuitheme, smsBalance, setSmsBalance, adminFormSettings,
        setSnackbar
        } = useApplicationSettings()


const handleAddButton = () => {
  setMessage('')
  setIsOpen(true)
}
const handleDeleteOpen= ()=>{
  setisOpenDelete(true)
}

const handleRowClick = (event, rowData)=> {
  setMessage(rowData)
}

const handleRowOpen = ()=> {
  setIsOpen(true)
}



const deleteMessage = async(id)=> {
  
  try {
    setopenLoad(true)
  setloading(true)
    const response = await fetch(`/api/delete_sms/${id}`,{
      method: "DELETE"
    })
    if(response.ok) {
      setSms(sms.filter((my_message)=> my_message.id !==  id))
      setopenDeleteMessage(true)
      setopenLoad(false)
      setloading(false)
      setisOpenDelete(false)
      
    } else {
      setopenLoad(false)
      setisOpenDelete(false)
      setloading(false)
    }
  } catch (error) {
    setopenLoad(false)
    setloading(false)
  }
}
const controller = new AbortController();
const id = setTimeout(() => controller.abort(), 9000)

const subdomain = window.location.hostname.split('.')[0]

const getSms = 
useCallback(
  async() => {

    try {
      const response = await fetch('/api/system_admin_sms', {
        
        headers: {
          'X-Subdomain': subdomain,
        },

      })
      clearTimeout(id);

      const newData = await response.json()
      // if (response.status === 403) {
      //   setopenopenAccessDenied3(true)
        
      // }

      if (response.status === 401) {
        if (adminFormSettings.enable_2fa_for_admin_passkeys) {
         
          // toast.error(
          //   <div>
          //     <p className='playwrite-de-grund font-extrabold text-xl'>Session expired please Login Again
          //       <div> <span className='font-thin flex gap-3'>
             
          //         </span></div></p>
          //   </div>,
           
          // );

          setSnackbar({
            open: true,
            message: <p className='text-lg'>Session expired please Login Again</p>,
            severity: 'error'
          })
       
          navigate('/signup2fa_passkey')
          // setlogoutmessage(true)
          // localStorage.setItem('logoutMessage', true)
        }else{
          // toast.error(
          //   <div>
          //     <p className='playwrite-de-grund font-extrabold text-xl'>Session expired please Login Again
          //       <div> <span className='font-thin flex gap-3'>
             
          //         </span></div></p>
          //   </div>,
           
          // );


          setSnackbar({
            open: true,
            message: <p className='text-lg'>Session expired please Login Again</p>,
            severity: 'error'
          })
           navigate('/signin')
        // setlogoutmessage(true)
        // localStorage.setItem('logoutMessage', true)
        }
       
      }
      if (response.ok) {
        // setSms(newData)
        setSms(newData.filter((my_sms)=> {
          return search.toLowerCase() === '' ? my_sms : my_sms.message.toLowerCase().includes(search)
        }))
        console.log('customer data', newData)
      } else {
        console.log('error')
        

      }
    } catch (error) {
      console.log(error)

    }
  },
  [searchInput],
)



useEffect(() => {
  getSms()
}, [getSms]);




        

                const EditButton = ({rowData}) => (
                  <img src="/images/logo/1495216_article_circle_edit_paper_pencil_icon.png"  
                  className='w-8 h-8 cursor-pointer '  alt="edit" onClick={handleRowOpen} />
                      )
                
                
                
                      const DeleteButton = ({id}) => (
                        <img src="/images/logo/6217227_bin_fly_garbage_trash_icon.png"  
                         className='w-8 h-8 cursor-pointer' alt="delete" onClick={handleDeleteOpen}/>
                      )
  return (
    
<>

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

            <LiaSmsSolid className='text-black'/>
            
        </div>
        <input type="text" value={search} onChange={(e)=> setSearch(e.target.value)}
         className="bg-gray-50 border border-gray-300 text-gray-900 
        text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full ps-10 p-2.5 
          dark:border-gray-600 dark:placeholder-gray-400 dark:text-black
          dark:focus:ring-green-500 dark:focus:border-green-500" placeholder="search for messages..."  />
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









    <div style={{ maxWidth: "100%" }}>
    <MaterialTable
   
      columns={[
        { title: "Message", field: "message" , cellStyle: {display: 
            'flex', whiteSpace: 'nowrap', overflow: 'hidden'
           ,padding:'20px' }},
        { title: "Receipients", field: "user",  align: 'left' },
        // { title: "Status", field: "status",  align: 'left' ,
        //   lookup: {
        //     queued: <p style={{
        //       color: 'green'
        //     }}>success</p>
        //   }
        // },

        {
          title: "Date",
          field: "formatted_date",
        },

        {
          title: "Sent By",
          field: "Sent By",
          render: (rowData) => 

            <>
            <Box sx={{
              display: 'flex',
              gap: 2
            }}>
           <p>system</p>
           <MdOutlineSupportAgent/>

            </Box>
            </>
        },



       

        
       
      ]}


      


onRowClick={handleRowClick}
      actions={[
        {
          icon: () => <div   onClick={handleAddButton}  className='bg-teal-700 p-2 w-14 rounded-lg'><AddIcon
           style={{color: 'white'}}/></div>,
          isFreeAction: true, // This makes the action always visible
          tooltip: 'Send Sms',
        },
        {
          icon: () => <GetAppIcon />,
          isFreeAction: true, // This makes the action always visible
      
          tooltip: 'Import',
        },
      ]}

     data={sms}
      title="Messages"
      
      options={{
        paging: true,
       pageSizeOptions:[5, 10, 20],
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


fontFamily: 'mono'

}}  
    />
  </div>

  </>

  )
}

export default AllMessages




