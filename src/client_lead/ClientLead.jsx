import DeleteIcon from '@mui/icons-material/Delete';

import EditIcon from '@mui/icons-material/Edit';

import { IconButton, Tooltip } from '@mui/material';
import GetAppIcon from '@mui/icons-material/GetApp';
import AddIcon from '@mui/icons-material/Add';

import {  useState, useEffect, useCallback} from 'react'
import MaterialTable from 'material-table'
import { useDebounce } from 'use-debounce';
import { FaHandshake } from "react-icons/fa";
import DeleteLead from './DeleteLead'
import { toast, Toaster } from 'react-hot-toast';
import EditLead from './EditLead'
import { FaArrowsTurnRight } from "react-icons/fa6";
import ConfirmLeadConversion from './ConfirmLeadConversion'
import {useApplicationSettings} from '../settings/ApplicationSettings'







const ClientLead = () => {

  const [open, setOpen] = useState(false);
  const [nodes, setNodes] = useState([])
  const [search, setSearch] = useState('')
  const [searchInput] = useDebounce(search, 1000)
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(true)
  const { showMenu1, setShowMenu1, showMenu2, setShowMenu2, showMenu3, setShowMenu3,
      showMenu4, setShowMenu4, showMenu5, setShowMenu5, showMenu6, setShowMenu6,
       showMenu7, setShowMenu7, showMenu8, setShowMenu8, showMenu9, setShowMenu9,
        showMenu10, setShowMenu10, showMenu11, setShowMenu11, showMenu12, setShowMenu12,
} = useApplicationSettings()


  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company_name: '',
    message: '',
    phone_number: ''
  });
  const [openConfirmLeadConversion, setOpenConfirmLeadConversion] = useState(false);

const [openDelete, setOpenDelete] = useState(false);
const [openEdit, setOpenEdit] = useState(false);
const [clientName, setClientName] = useState('');
const [editLead, setEditLead] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  const handleClickOpen = () => {
      setOpen(true);
    };
    
    const handleClose = () => {
      setOpen(false);
    };





    const handleRowClick = (event, rowData) => {
        console.log('leads',rowData)
    setFormData(rowData)    
    setClientName(rowData.name)
    setEditLead(true)
}

const subdomain = window.location.hostname.split('.')[0];

const createLead = async(e) => {
    e.preventDefault();
    try {
        const url = formData.id ? `/api/client_leads/${formData.id}` : '/api/client_leads';
        const method = formData.id ? 'PATCH' : 'POST';

        const response = await fetch(url, {
          method,
          headers: {
            'Content-Type': 'application/json',
            'X-Subdomain': subdomain,
          },
          body: JSON.stringify({ ...formData }),
        });

        const newData = await response.json()
        if (response.ok) {
            setOpenEdit(false)
            if (formData.id) {
                setLeads(leads.map(item => item.id === formData.id ? formData : item))
                toast.success('Lead updated successfully', {
                  position: "top-center",
                  duration: 4000,
                  
                })
            } else {
                
                setLeads([...leads, formData])
                toast.success('Lead created successfully', {
                  position: "top-center",
                  duration: 4000,
                  
                })
            }
            
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
            if (formData.id) {
                
                toast.error('Failed to update lead', {
                    position: "top-center",
                    duration: 4000,
                    
                  })
            } else {
                

                toast.error('Failed to create lead', {
                    position: "top-center",
                    duration: 4000,
                    
                  })
            }
           
        }
    } catch (error) {
        
        toast.error('Failed to create lead', {
          position: "top-center",
          duration: 4000,
          })
    }

}

    const getLeads = useCallback(
      async() => {
        try {
            const response = await fetch('/api/client_leads', {

                headers:{
                    'X-Subdomain': subdomain,
                }
              
            });
            
const newData = await response.json()
           if (response.status === 403) {
        toast.error(newData.error, {
          position: "top-center",
          duration: 6000, 
        })      
      }
            if (response.ok) {
                setLeads(newData)
            } else {
                if (response.status === 403) {
        toast.error(newData.error, {
          position: "top-center",
          duration: 6000, 
        })      
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
            }
        } catch (error) {
            
        }
      },
      [],
    )
    

    useEffect(() => {
        getLeads()
      }, [getLeads]);
  const DeleteButton = ({ id }) => (
        <IconButton style={{ color: '#8B0000' }} onClick={()=> setOpenDelete(true)}>
          <DeleteIcon />
        </IconButton>
      );


  const EditButton = () => (
    <IconButton style={{color: 'green'}}  onClick={()=> setOpenEdit(true)} >
      <EditIcon />
    </IconButton>
  );
const columns = [
    {title: 'Lead', field: 'name',  },

  {title: 'Email', field: 'email',    },
  {title: 'Company', field: 'company_name',    },
  {title: 'Phone Number', field: 'phone_number',    },

  {title: 'Action', field:'Action', align: 'right',

  render: (rowData) =>  
    
     <>
      <div className='flex justify-center items-center'>
       <DeleteButton id={rowData.id} />

       <Tooltip title="Edit">
        <IconButton>
       <EditButton />
        </IconButton>
       </Tooltip>


       <Tooltip title="Convert To Client">
       <FaArrowsTurnRight className='text-blue-500 hover:text-blue-700 cursor-pointer'  onClick={()=>setOpenConfirmLeadConversion(true)}/>
        </Tooltip>
      </div>
       </>


}


]


const handleCloseDelete = () => {
    setOpenDelete(false);
  }


  const deleteLead = async(id) => {

    try {
        const response = await fetch(`/api/client_leads/${id}`, {
          method: "DELETE",
          headers: {
            'X-Subdomain': subdomain,
          },
         
      
      
      })
    if (response.ok) {
        toast.success('lead deleted successfully', {
          position: "top-center",
          duration: 4000,
          })
        setOpenDelete(false)
        setLeads(leads.filter(item => item.id !== id))
    } else {
        
        toast.error('failed to delete lead', {
          position: "top-center",
          duration: 4000,
          })
        setOpenDelete(false)
    }
    } catch (error) {
        toast.error('failed to delete lead server error', {
          position: "top-center",
          duration: 4000,
          })
    }
  }




  return (
    <>
    <Toaster />
    <DeleteLead  setOpenDelete={setOpenDelete} openDelete={openDelete} handleCloseDelete={handleCloseDelete} 
    deleteLead={deleteLead} id={formData.id} loading={loading}/>



<ConfirmLeadConversion openConfirmLeadConversion={openConfirmLeadConversion}
 setOpenConfirmLeadConversion={setOpenConfirmLeadConversion}
 clientName={clientName} formData={formData}
 deleteLead={deleteLead} id={formData.id}
 />

    <EditLead  setOpen={setOpenEdit} open={openEdit} 
     loading={loading} formData={formData}  createLead={createLead} setFormData={setFormData}
     editLead={editLead} setEditLead={setEditLead}
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
         {/* <EditNode  open={open} handleClose={handleClose}/> */}
       
       


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

            <FaHandshake className='text-black'/>
            
        </div>
        <input type="text" value={search} onChange={(e)=> setSearch(e.target.value)}
         className="bg-gray-50 border border-gray-300 text-gray-900 
        text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full ps-10 p-2.5 
          dark:border-gray-600 dark:placeholder-gray-400 dark:text-black
          dark:focus:ring-green-500 dark:focus:border-green-500" placeholder="search for leads..."  />
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
      onRowClick={handleRowClick}
      title='Lead List'
      
       data={leads}

      
    actions={[

      {
        icon: () => <AddIcon onClick={()=> {
            setOpenEdit(true)
            setEditLead(false)
            setFormData('')
        }} />,
        isFreeAction: true, // This makes the action always visible
        tooltip: <p className='text-sm'>Add Lead</p>
      },
        {
          icon:()=><GetAppIcon/>,
          tooltip: <p className='text-sm'>Import</p>,
          isFreeAction: true
        }
    ]}


options={{
        paging: true,
       pageSizeOptions:[5, 10],
       pageSize: 10,
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
exportButton: true,
exportAllData: true,
exportFileName: 'Nodes'
}}     
      
      
      
      
      />

    </div>
    </>
  )
}

export default ClientLead

