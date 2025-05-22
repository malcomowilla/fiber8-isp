
import MaterialTable, {MTablePagination} from "material-table";
import { createTheme, ThemeProvider, CssBaseline, Chip } from '@mui/material';
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
 import { FaRegCheckCircle, FaRegTimesCircle } from "react-icons/fa";





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
        // console.log('customer data', newData)
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

const parseCustomDate = (dateString) => {
  // Example input: "March 07, 2025 at 04:19 PM"
  return new Date(
    Date.parse(
      dateString.replace(' at ', ',') // convert to: "March 07, 2025, 04:19 PM"
    )
  );
};

const sortedMessages = [...sms].sort((a, b) => {
  return parseCustomDate(b.date) - parseCustomDate(a.date);
});

        

                const EditButton = ({rowData}) => (
                  <img src="/images/logo/1495216_article_circle_edit_paper_pencil_icon.png"  
                  className='w-8 h-8 cursor-pointer '  alt="edit" onClick={handleRowOpen} />
                      )
                
                
                
                      const DeleteButton = ({id}) => (
                        <img src="/images/logo/6217227_bin_fly_garbage_trash_icon.png"  
                         className='w-8 h-8 cursor-pointer' alt="delete" onClick={handleDeleteOpen}/>
                      )







                      const tableTheme = createTheme({
                        palette: {
                          mode: 'light',
                          primary: {
                            main: '#4f46e5', // Indigo
                          },
                          secondary: {
                            main: '#10b981', // Emerald
                          },
                          background: {
                            default: '#f9fafb', // Cool gray 50
                          },
                        },
                        components: {
                          MuiTableCell: {
                            styleOverrides: {
                              head: {
                                fontWeight: 700,
                                fontSize: '0.875rem',
                                color: '#111827', // Gray 900
                              },
                            },
                          },
                        },
                      });
                    
                      const statusChip = (status) => {
                        switch(status) {
                          case 'Success':
                            return (
                              <Chip 
                                icon={<FaRegCheckCircle />}
                                label="Delivered"
                                color="success"
                                variant="outlined"
                                size="small"
                              />
                            );
                          case 'failed':
                            return (
                              <Chip 
                                icon={<FaRegTimesCircle />}
                                label="Failed"
                                color="error"
                                variant="outlined"
                                size="small"
                              />
                            );
                          default:
                            return (
                              <Chip 
                                label="Pending"
                                color="warning"
                                variant="outlined"
                                size="small"
                              />
                            );
                        }
                      };

  return (
    
<>
      <CssBaseline />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Message Center</h1>
            <p className="mt-2 text-gray-600">Manage all your SMS communications</p>
          </div>
          
          <div className="flex gap-3 w-full md:w-auto">
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setIsOpen(true)}
              sx={{
                bgcolor: 'primary.main',
                '&:hover': { bgcolor: 'primary.dark' },
                textTransform: 'none',
                fontWeight: 600,
              }}
            >
              New Message
            </Button>
            
            <Button
              variant="outlined"
              startIcon={<GetAppIcon />}
              sx={{
                borderColor: 'gray.300',
                color: 'gray.700',
                '&:hover': { borderColor: 'gray.400' },
                textTransform: 'none',
                fontWeight: 600,
              }}
            >
              Import
            </Button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-8 bg-white rounded-lg shadow-sm p-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <LiaSmsSolid className="text-gray-400" size={20} />
            </div>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Search messages..."
            />
          </div>
        </div>

        {/* Messages Table */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <MaterialTable
            columns={[
              { 
                title: "Message", 
                field: "message",
                cellStyle: { 
                  whiteSpace: 'nowrap', 
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  maxWidth: '300px'
                },
                headerStyle: {
                  backgroundColor: '#f9fafb',
                }
              },
              { 
                title: "Recipients", 
                field: "user",
                render: (rowData) => (
                  <span className="font-medium text-gray-700">{rowData.user}</span>
                )
              },
              { 
                title: "Status", 
                field: "status",
                render: (rowData) => statusChip(rowData.status)
              },
              { 
                title: "Date", 
                field: "date",
                render: (rowData) => (
                  <span className="text-gray-500">
                  {rowData.date}
                  </span>
                )
              },
              { 
                title: "Sent By", 
                field: "system_user",
                render: (rowData) => (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <MdOutlineSupportAgent className="text-indigo-600" />
                    <span className="text-gray-700">{rowData.system_user}</span>
                  </Box>
                )
              },
            ]}
            // data={sms}
            data={sortedMessages} // Using the sorted array
            onRowClick={(event, rowData) => setMessage(rowData)}
            options={{
              paging: true,
              pageSizeOptions: [10, 25, 50],
              pageSize: 10,
              search: false,
              showTitle: false,
              toolbar: false,
              headerStyle: {
                backgroundColor: '#f9fafb',
                fontWeight: 600,
                color: '#374151',
                textTransform: 'uppercase',
                fontSize: '0.75rem',
                letterSpacing: '0.05em'
              },
              rowStyle: {
                '&:hover': {
                  backgroundColor: '#f3f4f6'
                }
              },
              actionsColumnIndex: -1
            }}
            actions={[
              {
                icon: () => (
                  <Button 
                    variant="contained" 
                    startIcon={<AddIcon />}
                    onClick={() => setIsOpen(true)}
                    sx={{
                      bgcolor: 'primary.main',
                      '&:hover': { bgcolor: 'primary.dark' },
                      textTransform: 'none',
                      fontWeight: 600,
                    }}
                  >
                    New Message
                  </Button>
                ),
                isFreeAction: true,
                position: 'toolbar'
              }
            ]}
          />
        </div>

        {/* Stats Footer */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-indigo-50 p-4 rounded-lg">
            <h3 className="text-indigo-800 font-medium">Total Messages</h3>
            <p className="text-3xl font-bold text-indigo-600 mt-2">{sms.length}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="text-green-800 font-medium">Delivered</h3>
            <p className="text-3xl font-bold text-green-600 mt-2">
              {sms.filter(m => m.status === 'Success').length}
            </p>
          </div>
          <div className="bg-amber-50 p-4 rounded-lg">
            <h3 className="text-amber-800 font-medium">Pending</h3>
            <p className="text-3xl font-bold text-amber-600 mt-2">
              {sms.filter(m => !m.status || m.status === 'Pending').length}
            </p>
          </div>
        </div>
      </div>

  </>

  )
}

export default AllMessages




