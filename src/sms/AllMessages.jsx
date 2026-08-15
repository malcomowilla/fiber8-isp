import MaterialTable, {MTablePagination} from "material-table";
import { createTheme, ThemeProvider, CssBaseline, Chip } from '@mui/material';
import {useApplicationSettings} from '../settings/ApplicationSettings'
import { Button, Box } from '@mui/material';
import {useCallback, useEffect, useState} from 'react'
import AddIcon from '@mui/icons-material/Add';
import GetAppIcon from '@mui/icons-material/GetApp';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import { MdOutlineSupportAgent } from "react-icons/md";
 import {useNavigate} from 'react-router-dom'
 import { ToastContainer, toast,Bounce, Slide, Zoom, } from 'react-toastify';
 import { useDebounce } from 'use-debounce';
 import { LiaSmsSolid } from "react-icons/lia";
 import { FaRegCheckCircle, FaRegTimesCircle } from "react-icons/fa";
import { FaPlus } from "react-icons/fa6";
import { useMemo } from 'react';

// Normalizes the raw `status` string coming back from the SMS provider
// into one of three buckets the UI cares about. Anything unrecognized
// falls into 'pending' rather than 'failed' — an unset/unknown status
// isn't evidence of failure, it usually just means no delivery report
// has come back yet.
const getStatusCategory = (status) => {
  if (status === 'Success') return 'delivered'
  if (status === 'Sent') return 'pending'
  if (status === 'failed') return 'failed'
  return 'pending'
}

const STATUS_FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'delivered', label: 'Delivered' },
  { key: 'pending', label: 'Pending' },
  { key: 'failed', label: 'Failed' },
]

const AllMessages = () => {

const navigate = useNavigate()


const [search, setSearch] = useState('')
const [searchInput] = useDebounce(search, 1000)
const [statusFilter, setStatusFilter] = useState('all')

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

// Search results, sorted, before the status tab/card filter is applied —
// this is what the stat cards count against, so the numbers always
// reflect "everything matching your search" regardless of which
// category is currently selected.
const statusCounts = useMemo(() => {
  const counts = { all: sortedMessages.length, delivered: 0, pending: 0, failed: 0 }
  sortedMessages.forEach((m) => {
    counts[getStatusCategory(m.status)] += 1
  })
  return counts
}, [sortedMessages])

const visibleMessages = useMemo(() => {
  if (statusFilter === 'all') return sortedMessages
  return sortedMessages.filter((m) => getStatusCategory(m.status) === statusFilter)
}, [sortedMessages, statusFilter])

        

                const EditButton = ({rowData}) => (
                  <img src="/images/logo/1495216_article_circle_edit_paper_pencil_icon.png"  
                  className='w-8 h-8 cursor-pointer '  alt="edit" onClick={handleRowOpen} />
                      )
                
                
                
                      const DeleteButton = ({id}) => (
                        <img src="/images/logo/6217227_bin_fly_garbage_trash_icon.png"  
                         className='w-8 h-8 cursor-pointer' alt="delete" onClick={handleDeleteOpen}/>
                      )







                      
                    
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

                             case 'Sent':
                            return (
                              <Chip 
                                icon={<FaRegCheckCircle />}
                                label="Pending"
                                color="warning"
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
                                icon={<FaRegCheckCircle />}
                                label="Pending"
                                color="warning"
                                variant="outlined"
                                size="small"
                              />
                            );
                        }
                      };

  const statCards = [
    {
      key: 'all',
      label: 'Total messages',
      value: statusCounts.all,
      icon: ChatBubbleOutlineIcon,
      accent: 'text-teal-600',
      ring: 'ring-teal-500',
      iconBg: 'bg-teal-50',
    },
    {
      key: 'delivered',
      label: 'Delivered',
      value: statusCounts.delivered,
      icon: CheckCircleIcon,
      accent: 'text-emerald-600',
      ring: 'ring-emerald-500',
      iconBg: 'bg-emerald-50',
    },
    {
      key: 'pending',
      label: 'Pending',
      value: statusCounts.pending,
      icon: HourglassBottomIcon,
      accent: 'text-amber-600',
      ring: 'ring-amber-500',
      iconBg: 'bg-amber-50',
    },
    {
      key: 'failed',
      label: 'Failed',
      value: statusCounts.failed,
      icon: ErrorOutlineIcon,
      accent: 'text-rose-600',
      ring: 'ring-rose-500',
      iconBg: 'bg-rose-50',
    },
  ]

  return (
    
<>
      <CssBaseline />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-sans">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Message Center</h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Track every SMS your platform has sent, and which ones need a resend.
            </p>
          </div>

          <div className="flex gap-2 w-full md:w-auto">
            <button
              className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5
               rounded-lg bg-teal-600 text-white text-sm font-medium shadow-sm hover:bg-teal-700 transition-colors"
              onClick={() => navigate('/admin/send-sms')}
            >
              <FaPlus size={14} />
              New message
            </button>
            <button
              className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5
               rounded-lg border border-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors
               dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
              onClick={() => navigate('/admin/bulk-messages')}
            >
              <FaPlus size={14} className="text-gray-400" />
              Bulk message
            </button>
          </div>
        </div>

        {/* Stat cards — click to filter the table below */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {statCards.map(({ key, label, value, icon: Icon, accent, ring, iconBg }) => {
            const active = statusFilter === key
            return (
              <button
                key={key}
                onClick={() => setStatusFilter(key)}
                className={`text-left rounded-xl border bg-white dark:bg-[#1e1e1e] px-4 py-4 transition-all
                 ${active
                   ? `border-transparent ring-2 ${ring} shadow-sm`
                   : 'border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700'}`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    {label}
                  </span>
                  <span className={`h-8 w-8 rounded-lg ${iconBg} flex items-center justify-center shrink-0`}>
                    <Icon className={accent} sx={{ fontSize: 18 }} />
                  </span>
                </div>
                <p className={`mt-2 text-2xl font-semibold ${active ? accent : 'text-gray-900 dark:text-white'}`}>
                  {value}
                </p>
              </button>
            )
          })}
        </div>

        {/* Search + status tabs */}
        <div className="mb-6 bg-white dark:bg-[#1e1e1e] rounded-xl border border-gray-100 dark:border-gray-800 p-4">
          <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
            <div className="relative flex-1 max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <LiaSmsSolid className="text-gray-400" size={18} />
              </div>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg
                 bg-gray-50 dark:bg-gray-900 dark:text-white text-sm
                 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-colors"
                placeholder="Search messages..."
              />
            </div>

            <div className="flex gap-1.5 flex-wrap">
              {STATUS_FILTERS.map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setStatusFilter(key)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors
                   ${statusFilter === key
                     ? 'bg-teal-600 text-white'
                     : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'}`}
                >
                  {label}
                  {key !== 'all' && (
                    <span className="ml-1.5 opacity-70">{statusCounts[key]}</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Messages Table */}
        <div className="rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
          <ThemeProvider theme={tableTheme}>
          
          <MaterialTable
          title={<p className='font-semibold text-lg font-sans text-gray-900 dark:text-white'>Messages</p>}

            columns={[
              { 
                title: "Message", 
                field: "message",
                cellStyle: { 
                 
                  textOverflow: 'ellipsis',
                  maxWidth: '300px'
                },
               

                render: (rowData) => (
                  <span className="font-medium dark:text-white text-sm">{rowData.message}</span>
                )
              },
              { 
                title: "Recipients", 
                field: "user",
                render: (rowData) => (
                  <span className="font-medium dark:text-white t">{rowData.user}</span>
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
                  <span className="dark:text-white t">
                  {rowData.date}
                  </span>
                )
              },
              { 
                title: "Sent By", 
                field: "system_user",
                render: (rowData) => (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <MdOutlineSupportAgent className="text-teal-600" />
                    <span className="dark:text-white ">{rowData.system_user}</span>
                  </Box>
                )
              },
            ]}
            // data={sms}
            data={visibleMessages} // Sorted + status-filtered
            onRowClick={(event, rowData) => setMessage(rowData)}
           
options={{
      sorting: true,
      pageSizeOptions: [10, 20, 50],
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
        fontFamily: 'inherit',
        textTransform: 'uppercase',
        fontWeight: 600,
        fontSize: '11px',
        letterSpacing: '0.03em',
        backgroundColor: isDark ? '#242424' : '#f0fdfa',
        color: isDark ? '#e5e5e5' : '#0f766e',
        borderBottom: isDark ? '1px solid #333' : '1px solid #ccfbf1',
      },
      rowStyle: (rowData, index) => ({
        backgroundColor: isDark
          ? (index % 2 === 0 ? '#1e1e1e' : '#242424')
          : (index % 2 === 0 ? '#ffffff' : '#fafafa'),
        color: isDark ? '#f1f1f1' : '#1a1a1a',
        fontFamily: 'inherit',
      }),
    }}
      
            actions={[]}
          />
          </ThemeProvider>
          
        </div>
      </div>

  </>

  )
}

export default AllMessages