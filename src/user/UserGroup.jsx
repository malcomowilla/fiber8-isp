import DeleteIcon from '@mui/icons-material/Delete';

import EditIcon from '@mui/icons-material/Edit';

import { IconButton } from '@mui/material';

import AddIcon from '@mui/icons-material/Add';
import { FaUsers } from "react-icons/fa6";
import { useDebounce } from 'use-debounce';

import {useState, useEffect, useCallback} from 'react'
import MaterialTable from 'material-table'
import CircularProgress from "@mui/material/CircularProgress"; // Import CircularProgress for loading animation

import EditUserGroups from '../edit/EditUserGroups'
import toast,{Toaster} from 'react-hot-toast'
import DeleteUser from '../delete/DeleteUserGroup'



const UserGroup = () => {
  const [search, setSearch] = useState('')
  const [searchInput] = useDebounce(search, 1000)
  const [isSearching, setIsSearching] = useState(false); // New state for search loading
  const [open, setOpen ] = useState(false)
const [userGroups, setUserGroups] = useState([])
const [name, setName] = useState('')
const [openDelete, setOpenDelete] = useState(false)
const [nameId, setNameId] = useState('')
const [editUserGroup, setEditUserGroup] = useState(false)
const [loading, setloading] = useState(false)

const handleCloseDelete = () => {
  setOpenDelete(false)
}


const handleChangeUserGroups = (e) => {
setName(e.target.value)
}

const handleRowAdd = (event,rowData) =>{

  setEditUserGroup(true)
  setName(rowData)
  setNameId(rowData.id)
  console.log('name=>',rowData)

}

  const handleClose = () => {
    setOpen(false);
  }


  const DeleteButton = ({ id }) => (
        <IconButton style={{ color: 'red' }} onClick={()=>setOpenDelete(true)}>
          <DeleteIcon />
        </IconButton>
      );


  const EditButton = ({ id }) => (
    <IconButton style={{color: 'green'}} onClick={()=>setOpen(true)}>
      <EditIcon />
    </IconButton>
  );
const columns = [
    {title: 'Name', field: 'name',  },


  
  {title: 'Action', field:'Action', align: 'right',

  render: (params) =>  
    
     <>
      
       <DeleteButton {...params} />
       <EditButton {...params}/>
      
       </>


}


]

const subdomain = window.location.hostname.split('.')[0]


const getUserGroups = useCallback(
  async() => {
    setIsSearching(true)
    try {
      const response = await fetch('/api/user_groups', {
        headers: {
          'X-Subdomain': subdomain,
        },
      })

      const newData = await response.json()
      if (response.ok) {
        setIsSearching(false)
        // setUserGroups(newData)

        setUserGroups(newData.filter((user_group)=> {
          return search.toLowerCase() === '' ? user_group : user_group.name.toLowerCase().includes(search)
        }))
      } else {
        if (response.status === 402) {
        setTimeout(() => {
          // navigate('/license-expired')
          window.location.href='/license-expired'
         }, 1800);
        
      }

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
        setIsSearching(false)
        toast.error('failed to get  user groups', { position: "top-center", duration: 4000 }) 
      }
    } catch (error) {
      setIsSearching(false)
      console.log(error)
    }
  },
  [searchInput],
)


useEffect(() => {
  getUserGroups()
  
}, [getUserGroups]);


const deleteUserGroup = async(id) => {

  try {
    const response = await fetch(`/api/user_groups/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'X-Subdomain': subdomain,
      }
    })

    if (response.ok) {
      toast.success('User group deleted successfully', {
        position: "top-center",
        duration: 4000,
      })
     setOpenDelete(false)

      setUserGroups(userGroups.filter((user_group)=> {
        return user_group.id !== id
      }))
    } else {
      setOpenDelete(false)
      toast.error('Error deleting user group', {
        position: "top-center",
        duration: 4000,
      })
    }
  } catch (error) {
    setOpenDelete(false)
    toast.error('Error deleting user group server error', {
      position: "top-center",
      duration: 4000,
    })
  }

}
const handleAdd = () => {
  setOpen(true)
  setName('')
  setNameId('')
}



const createUserGroups = async(e) => {
  e.preventDefault()
  setloading(true)

  try {
    const method = nameId ? 'PATCH' : 'POST';
    const url = nameId ? `/api/user_groups/${nameId}` : '/api/user_groups'
    const response = await fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'X-Subdomain': subdomain,
      },
      //  body: JSON.stringify(ticketForm),
        body: JSON.stringify(
{
  user_group: {
    name: name,
  }
}
        ),

    })

    const newData = await response.json()
    if (response.ok) {
      setOpen(false)
      setloading(false)
      if (nameId) {
        toast.success('user group updated succesfuly', {
          position: "top-center",
          duration: 5000,
        })
        setUserGroups(userGroups.map((item) =>
          item.id === nameId ? newData : item
        ));
      } else {
        setUserGroups([...userGroups, newData])
        toast.success('user group aded succesfuly', {
          position: "top-center",
          duration: 5000,
        })
      }
    } else {
      setloading(false)
      setOpen(false)
      if (nameId) {
        toast.error('user group update failed', {
          position: "top-center",
          duration: 5000,
        })
      } else {
        toast.error('user group addition failed', {
          position: "top-center",
          duration: 5000,
        })
      }
     
    }
  } catch (error) {
    setloading(false)
    setOpen(false)
  }

}

  return (
    <div className=''>
      <Toaster />
      <DeleteUser id={name.id} openDelete={openDelete}
       handleCloseDelete={handleCloseDelete} deleteUserGroup={deleteUserGroup} />
      <EditUserGroups handleClose={handleClose} open={open}
       handleChangeUserGroups={handleChangeUserGroups}
       name={name} loading={loading}
       createUserGroups={createUserGroups} 
       setEditUserGroup={setEditUserGroup}
       editUserGroup={editUserGroup}
       />
         
         <div className="flex items-center max-w-sm mx-auto p-3">  
     
     <div className="relative w-full">
         <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            
             <FaUsers className='text-black'/>
             
         </div>
 
 
         <input type="text" value={search} onChange={(e)=> setSearch(e.target.value)}
          className="bg-gray-50 border border-gray-300 text-gray-900 
         text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full ps-10 p-2.5 
           dark:border-gray-600 dark:placeholder-gray-400 dark:text-black
           dark:focus:ring-green-500 dark:focus:border-green-500" placeholder="Search for user groups..."  />
     </div>
     <button
          type="button"
          className="p-2.5 ms-2 text-sm font-medium text-white bg-green-700 rounded-lg border border-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
        >
          {isSearching ? (
            <CircularProgress size={20} color="inherit" /> // Show spinner when searching
          ) : (
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
          )}
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

</div>

      <MaterialTable columns={columns}
      onRowClick={handleRowAdd}
      
      title={<p className='bg-gradient-to-r from-green-600 via-blue-400
         to-cyan-500 bg-clip-text text-transparent text-2xl font-bold'>User Groups</p>}
      
       data={userGroups}

      
    actions={[
        {
          icon:()=><AddIcon  onClick={() => {
            setEditUserGroup(false)
            handleAdd()
          }}/>,
          tooltip: 'Add User Group',
          isFreeAction: true 
        }
    ]}


options={{
        paging: true,
       pageSizeOptions:[5, 10],
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
exportFileName: 'User Group',

headerStyle:{
  fontFamily: 'bold',
  textTransform: 'uppercase'
  } ,
  
 
  
  fontFamily: 'mono'
}}     
      
      
      
      
      />

    </div>
  )
}

export default UserGroup

