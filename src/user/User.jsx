import DeleteIcon from '@mui/icons-material/Delete';
// import {useState} from 'react'
// import { DataGrid, GridToolbar } from '@mui/x-data-grid';

import EditIcon from '@mui/icons-material/Edit';

import { IconButton } from '@mui/material';
// import GetAppIcon from '@mui/icons-material/GetApp';
// import {Link} from 'react-router-dom'
// import {  useState} from 'react'
// import {ApplicationContext} from '../context/ApplicationContext'
import AddIcon from '@mui/icons-material/Add';

import { IoPeople } from "react-icons/io5";

import MaterialTable from 'material-table'

import {useState, useEffect, useCallback, Link} from 'react'
import InvitationForm from  './InvitationForm'
import toast,{Toaster} from 'react-hot-toast'
import DeleteUser from '../delete/DeleteUser'


// const rows = [
//   {  Speed: '4M/4M', Name: '4MBPS', Price: 1500, Validity: 30 },
//   {  Speed: '10M/10M', Name: '10MBPS', Price: 4000, Validity: 30 },
//   {  Speed: '4M/4M', Name: '4MBPS', Price: 1500, Validity: 30 },
//   {  Speed: '10M/10M', Name: '10MBPS', Price: 4000, Validity: 30 },
//   {  Speed: '4M/4M', Name: '4MBPS', Price: 1500, Validity: 30 },
//   {  Speed: '10M/10M', Name: '10MBPS', Price: 4000, Validity: 30 },
//   {  Speed: '4M/4M', Name: '4MBPS', Price: 1500, Validity: 30 },
//   {  Speed: '10M/10M', Name: '10MBPS', Price: 4000, Validity: 30 },
//   // Add more rows as needed
// ];





const User = () => {
const [search, setSearch] = useState('')

const [userPermisions, setUserPermisions] = useState({
  username: '',
     email: '',
     phone_number: '',
     user_role: '',
    
     
 });
 const [isOpen, setIsOpen] = useState(false)
 const [loading ,setloading] = useState(false)
 const [openLoad, setOpenLoad] = useState(false);
 const [users, setUsers] = useState([])
 const [openDelete, setOpenDelete] = useState(false);

const [permissionAndRoles, setPermissionAndRoles] = useState({
  package: { read: false, readWrite: false },
  hotspotPackage: { read: false, readWrite: false },
  subscriber: { read: false, readWrite: false },
  smsSettings: { read: false, readWrite: false },
  sms: {read: false, readWrite: false},
  tickets: {read: false, readWrite: false},
  ticketSettings: {read: false, readWrite: false},
  emailSettings: {read: false, readWrite: false},
  subscriberSettings: {read: false, readWrite: false},
  router: { read: false, readWrite: false },
  routerSettings: {read: false, readWrite: false},
  subscription: {read: false, readWrite: false},
  companySettings: {read: false, readWrite: false},
  user: {read: false, readWrite: false},
  userSettings: {read: false, readWrite: false},
  pool: {read: false, readWrite: false},
});




console.log('permissionAndRoles', userPermisions)


const handleCloseDelete = () => {
  setOpenDelete(false);
};



const handleRowAdd = (event, rowData)=> {
  
console.log('rowData users', rowData)
  setUserPermisions((prevData) => {
    
    const updatedData = {
      ...prevData,
      user_role: rowData.role 
      
    };
    return updatedData;
  });

  


  

  setUserPermisions(rowData)
  setPermissionAndRoles({

    package: {
      read: rowData.can_read_ppoe_package,
      readWrite: rowData.can_manage_ppoe_package,
    },
    hotspotPackage: {
      read: rowData.can_read_hotspot_packages,
      readWrite: rowData.can_manage_hotspot_packages,
    },
    smsSettings: {
      read: rowData.can_read_sms_settings,
      readWrite: rowData.can_manage_sms_settings,
    },
    sms: {
      read: rowData.can_read_sms,
      readWrite: rowData.can_manage_sms,
    },
    tickets: {
      read: rowData.can_read_support_tickets,
      readWrite: rowData.can_manage_support_tickets,
    },
    ticketSettings: {
      read: rowData.can_read_ticket_settings,
      readWrite: rowData.can_manage_ticket_settings,
    },

    subscription: {
      read: rowData.can_read_subscription,
      readWrite: rowData.can_manage_subscription,
    },
    emailSettings: {
      read: rowData.can_read_email_setting,
      readWrite: rowData.can_manage_email_setting,
    },
    subscriberSettings: {
      read: rowData.can_read_subscriber_setting,
      readWrite: rowData.can_manage_subscriber_setting,
    },
    pool: {
      read: rowData.can_read_ip_pool,
      readWrite: rowData.can_manage_ip_pool,
    },
    router: {
      read: rowData.can_read_nas_routers,
      readWrite: rowData.can_manage_nas_routers,
    },
     

    subscriber: {
      read: rowData.can_read_read_subscriber,
      readWrite: rowData.can_manage_subscriber
    },
   
    routerSettings: {
      read: rowData.can_read_router_setting,
      readWrite: rowData.can_manage_router_setting,
    },
    companySettings: {
      read: rowData.can_read_company_setting,
      readWrite: rowData.can_manage_company_setting,
    },

   
    user: {
      
      read: rowData.can_read_users,
      readWrite: rowData.can_manage_users
    },
   
    userSettings: {
      read: rowData.can_read_user_setting,
      readWrite: rowData.can_manage_user_setting,
    },
  });
}


const handleAddButton = ()=> {
  setIsOpen(true)
  setUserPermisions('')
  setPermissionAndRoles({
    package: { read: false, readWrite: false },
    hotspotPackage: { read: false, readWrite: false },
    subscriber: { read: false, readWrite: false },
    smsSettings: { read: false, readWrite: false },
    sms: {read: false, readWrite: false},
    tickets: {read: false, readWrite: false},
    ticketSettings: {read: false, readWrite: false},
    emailSettings: {read: false, readWrite: false},
    subscriberSettings: {read: false, readWrite: false},
    router: { read: false, readWrite: false },
    routerSettings: {read: false, readWrite: false},
    subscription: {read: false, readWrite: false},
    companySettings: {read: false, readWrite: false},
    user: {read: false, readWrite: false},
    userSettings: {read: false, readWrite: false},
    pool: {read: false, readWrite: false},


})
}




  const DeleteButton = ({ id }) => (
        <IconButton style={{ color: '#8B0000' }} onClick={()=> setOpenDelete(true)}>
          <DeleteIcon />
        </IconButton>
      );


  const EditButton = ({ id }) => (
    <IconButton style={{color: 'green'}} onClick={()=> setIsOpen(true)}>
      <EditIcon />
    </IconButton>
  );
const columns = [
    {title: 'Name', field: 'username',  },

  {title: 'Phone', field: 'phone_number',    },
  {title: 'Email', field: 'email',    },
  {title: 'Role', field: 'role',    },
    {title: 'Date Registered', field: 'date_registered',    },

  
  {title: 'Action', field:'Action', align: 'right',

  render: (params) =>  
    
     <>
      
       <DeleteButton {...params} />
       <EditButton {...params}/>
      
       </>


}


]




// get_all_admins
// invite_client
// update_client



const subdomain = window.location.hostname.split('.')[0]
const inviteUser = async(e) => {

  e.preventDefault()

  try {
    setOpenLoad(true);
    setloading(true);

    const url = userPermisions.id
      ? `/api/update_client/${userPermisions.id}`
      : '/api/invite_client';
    const method = userPermisions.id ? 'PATCH' : 'POST';

    const response = await fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'X-Subdomain': subdomain,
      },
      body: JSON.stringify({
        ...userPermisions,
        user_role: userPermisions.user_role,
       
      }),
    });

    const newData = await response.json();

    if (response.ok) {
      setIsOpen(false);

if (response.status === 403) {
  toast.error('permision denied to create or update user', {
    duration: 6000, 
  })
}

      if (userPermisions.id) {
        setloading(false);
       
        toast.success('User Updated Successfully', {
          duration: 5000, // Duration in milliseconds (3 seconds)
        })
        setIsOpen(false);
        setUsers(users.map((item) =>
          item.id === userPermisions.id ? newData : item
        ));
        // setopenUserUpdatedAlert(true);
      
      } else {
       
       

        toast.success('User Added Successfully', {
          duration: 5000, // Duration in milliseconds (3 seconds)
        })
        setIsOpen(false);
        setUsers([...users, newData]); // Add newly created user to table
        setloading(false);
      }
    } else {
      toast.error('User Addition Failed', {
        duration: 5000, // Duration in milliseconds (3 seconds)
        position: 'top-center'
      })
      toast.error(newData.error, {
        duration: 5000, // Duration in milliseconds (3 seconds)
      })
      setloading(false);
      // Handle server-side validation errors
      if (newData.errors) {
        // Example: Handling email and username errors
        
      } else {
        // Handle other types of errors (network, unexpected responses)
        console.log(newData.role_error)
        console.error('Unexpected error:', newData.error || 'Unknown error');
        // Display a generic error message to the user
      }
      setIsOpen(true); // Ensure the form remains open to show errors
    }
  } catch (error) {
    toast.error(
      'An unexpected error occurred while creating or updating user',
      {

        duration: 4000,
        position: 'top-center',
      }
    )
    console.error('Network error:', error);
    setloading(false);
    
    setIsOpen(false);
    // Handle network errors, such as timeout or connection issues
  }
}
// delete_user

const deleteUser = async(id)=> {


  try {
    const response = await fetch(`/api/delete_user/${id}`, {
      method: 'DELETE',
      headers: {  
        'X-Subdomain': subdomain,
      },
    })
const newData = await response.json()


if (response.status === 403) {
  toast.error('permision denied to delete user', {
    duration: 6000, 
  })
  
}
    if (response.ok) {

      setUsers((users)=> users.filter(item => item.id !== id))
      toast.success('user deleted successfully', {
        position: 'top-center',
        duration: 4000,
      })
    } else {
      toast.error('failed to delete user', {
        position: 'top-center',
        duration: 4000,
      })
    }
  } catch (error) {
    toast.error('failed to delete user', {
      position: 'top-center',
      duration: 4000,
    })
  }
}




const fetchAdmins = useCallback(
  async() => {
    try {
      const response = await fetch('/api/get_all_admins', {
        headers: {
          'X-Subdomain': subdomain,
        },  
      })
      const newData = await response.json()
      if (response.status === 403) {
        toast.error('permision denied to view user management', {
          duration: 6000, 
        })
      }
      if (response.ok) {
        
        setUsers(newData)

        setPermissionAndRoles({

          package: {
            read: newData[0].can_read_ppoe_package,
            readWrite: newData[0].can_manage_ppoe_package,
          },
          hotspotPackage: {
            read: newData[0].can_read_hotspot_packages,
            readWrite: newData[0].can_manage_hotspot_packages,
          },
          smsSettings: {
            read: newData[0].can_read_sms_settings,
            readWrite: newData[0].can_manage_sms_settings,
          },
          sms: {
            read: newData[0].can_read_sms,
            readWrite: newData[0].can_manage_sms,
          },
          tickets: {
            read: newData[0].can_read_support_tickets,
            readWrite: newData[0].can_manage_support_tickets,
          },
          ticketSettings: {
            read: newData[0].can_read_ticket_settings,
            readWrite: newData[0].can_manage_ticket_settings,
          },
      
          subscription: {
            read: newData[0].can_read_subscription,
            readWrite: newData[0].can_manage_subscription,
          },
          emailSettings: {
            read: newData[0].can_read_email_setting,
            readWrite: newData[0].can_manage_email_setting,
          },
          subscriberSettings: {
            read: newData[0].can_read_subscriber_setting,
            readWrite: newData[0].can_manage_subscriber_setting,
          },
          pool: {
            read: newData[0].can_read_ip_pool,
            readWrite: newData[0].can_manage_ip_pool,
          },
          router: {
            read: newData[0].can_read_nas_routers,
            readWrite: newData[0].can_manage_nas_routers,
          },
           
      
          subscriber: {
            read: newData[0].can_read_read_subscriber,
            readWrite: newData[0].can_manage_subscriber
          },
         
          routerSettings: {
            read: newData[0].can_read_router_setting,
            readWrite: newData[0].can_manage_router_setting,
          },
          companySettings: {
            read:newData[0].can_read_company_setting,
            readWrite: newData[0].can_manage_company_setting,
          },
      
         
          user: {
            
            read: newData[0].can_read_users,
            readWrite: newData[0].can_manage_users
          },
         
          userSettings: {
            read: newData[0].can_read_user_setting,
            readWrite: newData[0].can_manage_user_setting,
          },
        });
      }else{
toast.error('Failed to get admins', {
          duration: 6000, 
        })
      }
    } catch (error) {
      toast.error('Failed to get admins server error', {
        duration: 5000, 
      })
    }
  },
  [],
)


useEffect(() => {
  fetchAdmins()
}, [fetchAdmins]);



  return (
    <div className=''>
      <DeleteUser  openDelete={openDelete} handleCloseDelete={handleCloseDelete} 
        deleteUser={deleteUser} id={userPermisions.id} loading={loading}/>
      <Toaster />
         <InvitationForm  isOpen={isOpen} setIsOpen={setIsOpen}
         permissionAndRoles={permissionAndRoles} openLoad={openLoad}
         setPermissionAndRoles={setPermissionAndRoles} userPermisions={userPermisions} 
          loading={loading} inviteUser={inviteUser}
          setUserPermisions={setUserPermisions}
         />
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
           dark:focus:ring-green-500 dark:focus:border-green-500" placeholder="Search for users..."  />
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
      onRowClick={handleRowAdd}
      title='Users'
      
       data={users}

      
    actions={[
        {
          icon:()=><AddIcon onClick={handleAddButton}/>,
          tooltip: 'Add User',
          isFreeAction: true
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
exportButton: true,
exportAllData: true,
exportFileName: 'Users',

headerStyle:{
  fontFamily: 'bold',
  textTransform: 'uppercase'
  } ,
  
  rowStyle:(data, index)=> index % 2 === 0 ? {
  background: 'gray'
  }: null,
  
  fontFamily: 'mono'
}}     
      
      
      
      
      />

    </div>
  )
}

export default User

