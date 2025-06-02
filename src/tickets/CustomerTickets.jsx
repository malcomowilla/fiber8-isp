
import MaterialTable, {MTablePagination} from "material-table";
import { createTheme, ThemeProvider, CssBaseline,   Snackbar,
  Alert} from '@mui/material';
import {useApplicationSettings} from '../settings/ApplicationSettings'
import { Button, Box } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import GetAppIcon from '@mui/icons-material/GetApp';
import TicketForm from './TicketForm'
import {useState, useCallback, useEffect} from 'react'
import TicketSubmit from './TicketSubmit'
import DeleteTicket from './DeleteTicket'

import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import { makeStyles } from '@mui/styles';
import { styled } from '@mui/material/styles';
import {useNavigate} from 'react-router-dom'
import dayjs from 'dayjs';

import QuestionMarkAnimation from '../loader/question_mark.json'
import Lottie from 'react-lottie';
// import TicketAnimation from '../animation/ticket.json'
import { ToastContainer, toast,Bounce, Slide, Zoom, } from 'react-toastify';
import { useDebounce } from 'use-debounce';
import { BsTicketDetailed } from "react-icons/bs";
import toaster, { Toaster } from 'react-hot-toast';
import DeleteIcon from '@mui/icons-material/Delete';
import { IconButton } from '@mui/material';

import EditIcon from '@mui/icons-material/Edit';
import CircularProgress from "@mui/material/CircularProgress"; // Import CircularProgress for loading animation






const CustomerTickets = () => {

  const [isOpen, setIsOpen] = useState(false);
  const [isOpenTicket, setIsOpenTicket] = useState(false);
const [customers, setCustomers] = useState([])
const [agentRole, setAgentRole] = useState([])
const [ticket, setTicket] = useState([])
const [loading, setloading] = useState(false)
const [openLoad, setOpenLoad] = useState(false);
const [isOpenDelete, setisOpenDelete] = useState(false)
const [openCreateTicketAlert, setopenCreateTicketAlert] = useState(false)
const [openUpdateTicketAlert, setopenUpdateTicketAlert] = useState(false)
const [openDeleteTicketAlert, setopenDeleteTicketAlert] = useState(false)
const [phone, setPhone] = useState('')
const [customer_name, setName] = useState('')
const [ticketNo, setTicketNo] = useState('') 
const [updatedDate, setUpdatedDate] = useState('')
const [ticketForm, setTicketForm] = useState({
      customer: '',
      ticket_category: '',
      priority: '',
      agent: '',
      name: '',
      email: '',
      phone_number: '',
      status: '',
      issue_description: '',
      agent_review: '',
      agent_response: ''

})


    const navigate = useNavigate()
 
const [search, setSearch] = useState('')
const [searchInput] = useDebounce(search, 1000)
const [isSearching, setIsSearching] = useState(false); // New state for search loading


console.log('customer phone number',agentRole)
const handleCloseDeleteTicketAlert = ()=> {
  setopenDeleteTicketAlert(false)
}

const handleCloseUpdateTicketAlert = ()=> {
  setopenUpdateTicketAlert(false)
}

const handleCloseCreateTicketAlert = ()=> {
  setopenCreateTicketAlert(false)
}






const defaultOptions = {
  loop: true,
  autoplay: true, 
  animationData: QuestionMarkAnimation,
  rendererSettings: {
    preserveAspectRatio: 'xMidYMid slice'
  }
};



const handleChange = (e)=> {
const {name,  value} = e.target
setTicketForm((prev)=> ({...prev, [name]: value}))
console.log('ticket form', ticketForm)
} 


const CustomTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: 'white',
    color: 'black',
  },
}));




const subdomain = window.location.hostname.split('.')[0]; 

    
const fetchSubscribers = useCallback(
  async() => {
    
  try {
    const response = await fetch('/api/subscribers',{
      headers: {
        'X-Subdomain': subdomain,
      },
  
    }
  
  
  )
  
    const newData = await response.json()
  if (response.ok) {
    setCustomers(newData)

  } else {
    console.log('failed to fetch routers')
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
toast.error(
  'Failed to get subscribers',
  {
    position: 'top-center',
    duration: 4000,
  }
)
  }
  
  } catch (error) {
    toast.error('Failed to get subscribers internal server error', {
      position: 'top-center',
      duration: 4000,
    })
    console.log(error)
  
  }
  },
  [],
)



  useEffect(() => {
    
    fetchSubscribers()
  }, [fetchSubscribers]);


    // const {
      
    //     materialuitheme, adminFormSettings,setSnackbar,snackbar  } = useApplicationSettings()



//             const fetchCustomers = useCallback(
//               async() => {
//                 try {
//                   const response = await fetch('/api/customers')
//                   const newData = await response.json()
//                   if (response.ok) {
                    
//                     setCustomers(newData)
//                   } else {
//                     console.log('error?')
//                   }
//                 } catch (error) {
//                   console.log('error=>', error)
//                 }
//               },
//               [],
//             )



// useEffect(() => {
//   fetchCustomers()
  
// }, [fetchCustomers]);




            // const fetchAgents = useCallback(
            //   async() => {
            //     try {
            //       const response = await fetch('/api/get_service_providers')
            //       const newData = await response.json()

            //       if (response.status === 401) {
            //         if (adminFormSettings.enable_2fa_for_admin_passkeys) {
                     
                       
                  

            //           setSnackbar({
            //             open: true,
            //             message: <p className='text-lg'>Session expired please Login Again</p>,
            //             severity: 'error'
            //           })
                   
            //           navigate('/signup2fa_passkey')
                     
            //         }else{
                     
            //           setSnackbar({
            //             open: true,
            //             message: <p className='text-lg'>Session expired please Login Again</p>,
            //             severity: 'error'
            //           })
            //            navigate('/signin')
                    
            //         }
                   
            //       }

            //       if (response.ok) {
            //         console.log('get admins', newData)
            //         const getAgent = newData.map((theAgent)=> {
            //           if( theAgent.role === 'agent') {
            //             return theAgent
            //           }
            //         })

            //         console.log('get admins agent', getAgent)
            //         setAgentRole(newData)
            //       } else {
            //         console.log('error')
            //       }
            //     } catch (error) {
            //       console.log('error=>', error)
            //     }
            //   },
            //   [],
            // )
            

         
            // useEffect(() => {
            //   fetchAgents()
              
            // }, [fetchAgents]);
            


            const handleAddTicket = async (e)=> {
              e.preventDefault()
              
              try {
              setloading(true)
              setOpenLoad(true)
                const url = ticketForm.id ? `/api/update_ticket/${ticketForm.id}` : '/api/create_ticket';
                    const method = ticketForm.id ? 'PATCH' : 'POST';
              
              
                    const response = await fetch(url, {
                      method: method,

                      headers: {
                'Content-Type': 'application/json',
                'X-Subdomain': subdomain

                      },
                      body: JSON.stringify(ticketForm),
                
                      })
                
                      const newData = await response.json()

                     
                if (response.ok) {
                  
                  console.log('tickets created:', newData)
              setOpenLoad(false)
                  if (ticketForm.id) {
                    setloading(false)
//   setSnackbar({ open: true, message: 'Ticket updated successfully!', severity: 'success' });
toaster.success('Ticket updated successfully!', {
    position: "top-center",
    duration: 5000,
})

                    setIsOpen(false)
                    // setopenUpdateTicketAlert(true)
                    setTicket(ticket.map(item => (item.id === ticketForm.id ? newData : item)));
                    setIsOpen(false)
                    setIsOpenTicket(false)
                   
              
                  } else {
//   setSnackbar({ open: true, message: 'Ticket added successfully!', severity: 'success' });
toaster.success('Ticket created successfully!', {
    position: "top-center",
    duration: 5000,
})
                    setIsOpen(false)
                    setIsOpenTicket(false)
                    // Add newly created package to tableData
                    setopenCreateTicketAlert(true)
                    setTicket((prevData)=> (
                    [...prevData, newData]
                    ));
              setloading(false)
                  }
                } else {
                  console.log('error')
                  setloading(false)
                  setIsOpen(false)
                  setOpenLoad(false)
toaster.error(newData.error, {
    position: "top-center",
    duration: 5000,
})



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


toaster.error('eror creating ticket', {
    position: "top-center",
    duration: 5000,
})
//                   setSnackbar({ open: true, message: 
//                     newData.error, severity: 'error' ,
//                     vertical: 'top',
//   horizontal: 'center',
//                   });
                  // setSnackbar({ open: true, message: 'sth went wrong!', severity: 'error' });
                  if (response.status === 400) {
        
                    // setSnackbar({ open: true, message: 
                    //   'empty ticket submited', severity: 'error' ,
                    
                    // });

                  }
                }
              } catch (error) {
//                 setSnackbar({ open: true, message: 
//                   'something went wrong, please try again', severity: 'error' ,
//                   vertical: 'top',
// horizontal: 'center',
//                 });
                console.log(error)
                toaster.error('error creating tickets', {
                    position: "top-center",
                    duration: 5000,
                })  
                setOpenLoad(false)
                setloading(false)
                setIsOpen(false)
              }
              }





              const controller = new AbortController();
              const id = setTimeout(() => controller.abort(), 9000)
              
              
              const getTicket = 
              useCallback(
                async() => {
              
                  try {
                    setIsSearching(true)
                    const response = await fetch('/api/get_tickets', {
                      headers: {
                        'X-Subdomain': subdomain
                      }
                    //   signal: controller.signal,  
              
                    })
                    clearTimeout(id);
              
                    const newData = await response.json()

                  
                 
                    if (response.ok) {
                      setIsSearching(false)
                      // setTicket(newData)
                      setTicket(newData.filter((my_ticket)=> {
                        return search.toLowerCase() === '' ? my_ticket : my_ticket.ticket_number.toLowerCase().includes(search)
                      }))
                      console.log('ticket data', newData)
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
                      setIsSearching(false)
                      toaster.error(newData.error, {
                        position: 'top-right',
                        duration: 5000,
                      })
                      console.log('error')
              
                    }
                  } catch (error) {
                    setIsSearching(false)
                    toaster.error('Failed to Search Ticket server error', {
                        position: 'top-right',
                        duration: 4000,
                      })
                    console.log(error)
              
                  }
                },
                [searchInput],
              )
              
              
              
              useEffect(() => {
                getTicket()
              }, [getTicket]);



              const deleteTicket = async (id)=> {

                try {
                  setloading(true)
                  
              const response = await fetch(`/api/support_tickets/${id}`, {
                method: 'DELETE'
                })
                
                
                if (response.ok) {
                  setTicket(ticket.filter((tik)=> tik.id !==  id))
                  setloading(false)
                  toaster.success('Ticket Deleted Successfully', {
                    position: 'top-right',
                    duration: 4000,
                  })
                  setisOpenDelete(false)
                  setopenDeleteTicketAlert(true)
                } else {
                    toaster.error('Failed to Delete Ticket', {
                    position: 'top-right',
                    duration: 4000,
                  })
                  console.log('failed to delete')
                  setloading(false)
                  setisOpenDelete(false)
                }
                } catch (error) {
                    toaster.error('Failed to Delete Ticket', {
                    position: 'top-right',
                    duration: 4000,
                  })
                  console.log(error)
                  setisOpenDelete(false)
                  setloading(false)
                  
                }
                
              }
              


              console.log('my customer', customers)

        const handleAddButton = ()=> {
          // setIsOpen(true)
          setIsOpenTicket(true)
          setTicketForm('')
        }


        const handleRowClick = (event, rowData)=> {
          const customerData = customers.find(my_customer => my_customer.name === rowData.customer);
          console.log(' row data', rowData) 
  // setPhone(customerData.phone_number)
    setPhone(rowData.phone_number)

          setTicketForm(rowData)
          setName(customerData.name)
          setTicketNo(rowData.ticket_number)
          setUpdatedDate(rowData.formatted_date_closed)
        }





        const DeleteButton = ({ id }) => (
            <IconButton style={{ color: '#8B0000' }} onClick={()=> setisOpenDelete(true)}>
              <DeleteIcon />
            </IconButton>
          );
          const EditButton = () => (
            <IconButton style={{color: 'green'}} onClick={()=> setIsOpen(true)} >
              <EditIcon />
            </IconButton>
          )


  return (

    <>
    <Toaster />
{/* 
<Snackbar
 anchorOrigin={{ 
  vertical: 'top', 
  horizontal: 'center' 
}}
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>  */}




     <TicketForm phone={phone} customer_name={customer_name}  ticketNo={ticketNo} loading={loading} openLoad={openLoad}
     handleAddTicket={handleAddTicket} isOpen={isOpen} setIsOpen={setIsOpen} agentRole={agentRole} ticketForm={ticketForm}
      setTicketForm={setTicketForm} handleChange={handleChange} updatedDate={updatedDate}/>


    <TicketSubmit  openLoad={openLoad}  isloading={loading}  handleAddTicket={handleAddTicket} handleChange={handleChange} 
     isOpenTicket={isOpenTicket} setIsOpenTicket={setIsOpenTicket}
     customers={customers} agentRole={agentRole} ticketForm={ticketForm} setTicketForm={setTicketForm}
      
    /> 

    <DeleteTicket  deleteTicket={deleteTicket} id={ticketForm.id} isOpenDelete={isOpenDelete} 
    setisOpenDelete={setisOpenDelete} isloading={loading}/>



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
            <BsTicketDetailed className='text-black w-5 h-5'/>
            
        </div>
        <input type="text" value={search} onChange={(e)=> setSearch(e.target.value)}
         className="bg-gray-50 border border-gray-300 text-gray-900 
        text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full ps-10 p-2.5 
          dark:border-gray-600 dark:placeholder-gray-400 dark:text-black
          dark:focus:ring-green-500 dark:focus:border-green-500" placeholder="Search for tickets..."  />
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


    <div style={{ maxWidth: "100%" }}>
    <MaterialTable
   
      columns={[
        { title: "Ticket Status", field: "status",  align: 'left',
          render: (rowData)=> 
            
            <>
              <CustomTooltip className='myTextField' sx={{
                background: 'white',
  "& .MuiTooltip-tooltip": {
    background: 'white',
    
  }
}} title=  {<div className='text-sm flex justify-center items-center p-3 flex-col '>

  <p className='font-extrabold text-lg'>Subject</p>
   <p> {rowData.issue_description}  </p> </div>}  >

<div className={`   ${rowData.status === 'In Progress' && 'bg-orange-600'}
    ${rowData.status === 'Open' && 'bg-red-600'}
    ${rowData.status === 'Resolved' && 'bg-green-600'}
    ${rowData.status === 'Pending' && 'bg-gray-600'}
    


rounded-md  playwrite-de-grund text-sm w-20 flex justify-center p-1 items-center
             h-[3rem]`}>
             <p style={{
              color: 'white',
              
              
            }}>{rowData.status}</p>



            
            </div>
</CustomTooltip>
            </>,


          


          
         },
        { title: "Customer", field: "customer" , render: (rowData)=> 

          <>
          <div className={`flex gap-3  `}>

          
         <div className={`${rowData.status === 'In Progress' && 'bg-orange-600 '}
          ${rowData.status === 'Open' && 'bg-red-600 '}
          ${rowData.status === 'Resolved' && 'bg-green-600 '}
          ${rowData.status === 'Pending' && 'bg-gray-600 '}
          
         p-3 rounded-full `    }>
          <p className={`  text-white text-2xl font-extralight`}>
            { rowData.customer   &&   rowData.customer.split(' ').map((my_name)=>{
            return my_name.charAt(0)
          }).join('')}</p></div>


          <p>{rowData.customer}</p>
          
          </div>
          </>
        },
        { title: "Category", field: "ticket_category", align: 'left' },
        

        {
          title: "Priority",


          field: "priority",
          render: (rowData)=> 
            <>
            <div className={`  h-10 w-20 text-sm flex justify-center items-center rounded-md playwrite-de-grund
               ${rowData.priority === 'Urgent' && 'bg-red-800 '}
               ${rowData.priority === 'Medium' && 'bg-yellow-500 '}
               ${rowData.priority === 'Low' && 'bg-green-800 '}
               `}>
            <p className='text-white'>{rowData.priority}</p>

            </div>

            </>
        },
        
        {
          title: 'Assigned To',
          field: 'agent',
          render: (rowData) => 
            <>
        {rowData.agent === '' || rowData.agent === null || rowData.agent === 'null' ?  (
          <Lottie options={defaultOptions} width={70} height={70}/>
        ): rowData.agent}
            </>
        },
        {
          title: 'Ticket Number',
          field: 'ticket_number'
        },


        {
          title: 'Date',
          field: 'formatted_date_of_creation',
          render: (rowData)=>
            <>
<p> Created: <span className='font-bold'>{rowData.
formatted_date_of_creation
} </span></p>

<p className=''>Resolved: <span className='font-bold'>{rowData.status === 'Resolved' && rowData.formatted_date_closed
} </span> </p>
            </>
        },

        {title: 'Action', field:'Action',  headerClassName: 'dark:text-black',
            render: (params) =>  
            
            <>
             
              <DeleteButton {...params} />
              <EditButton {...params}/>
             
              </>
          
          
          }
      ]}



      



      actions={[
        {
          icon: () => <div onClick={handleAddButton}    className='bg-teal-700 p-2 w-14 rounded-lg'><AddIcon
           style={{color: 'white'}}/></div>,
          isFreeAction: true, // This makes the action always visible
          tooltip: 'Add Ticket',
        },
        {
          icon: () => <GetAppIcon />,
          isFreeAction: true, // This makes the action always visible
      
          tooltip: 'Import',
        },
      ]}
      title="Support Tickets"

data={ticket}


onRowClick={handleRowClick}


 options={{
        paging: true,
       pageSizeOptions:[5, 10],
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
  </div>

  </>

  )
}

export default CustomerTickets

























