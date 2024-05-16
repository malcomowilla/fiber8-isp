import DeleteIcon from '@mui/icons-material/Delete';
// import {useState} from 'react'
// import { DataGrid, GridToolbar } from '@mui/x-data-grid';

import EditIcon from '@mui/icons-material/Edit';

import { IconButton } from '@mui/material';
import GetAppIcon from '@mui/icons-material/GetApp';
import {Link} from 'react-router-dom'
import {  useState, useEffect, useMemo} from 'react'
import {ApplicationContext} from '../context/ApplicationContext'
import EditNas from '../edit/EditNas' 
import AddIcon from '@mui/icons-material/Add';

import MaterialTable from 'material-table'

import DeleteRouter from '../delete/DeleteRouter'





const Nas = () => {
const initialValue={
username:'',
password: '',
ip_address:'',
name: ''
}
  const [open, setOpen] = useState(false);
const  [formData, setFormData] = useState(initialValue)
const [tableData, setTableData] = useState([])
const [loading, setloading] = useState(false)
const [offlineerror, setofflineerror] = useState(false)
const [openDelete, setOpenDelete] = useState(false);




const handleClickOpenDelete = () => {
  setOpenDelete(true);
};

const handleCloseDelete = () => {
  setOpenDelete(false);
};

  const handleClickOpen = () => {
    setOpen(true);
  };



  const handleClose = () => {
    setOpen(false);
    setFormData(initialValue)
  };




// const updateRouter = async(id, e) => {

//   e.preventDefault()

//   try {
//       setloading(true)

//       const res = await fetch('/api/router', {
//           method: 'POST',
//           headers: {
//               'Content-Type': 'application/json'
//           },
//           signal: controller.signal,
//           body: JSON.stringify(formData),
//       })

//         clearTimeout(id)
      
//       const newData = await res.json()
//       if (res.ok) {
//           setTableData((tableData)=>[...tableData, newData])
//           setloading(false)


//       } else {
//           setloading(false)

//       }
//   } catch (error) {
//     console.log(error.name === 'AbortError');

//       setloading(false);

//   }
// }








  const deleteRouter = async (id) =>  {
    const response = await fetch(`/api/delete_router/${id}`, {
      method: "DELETE",
    })
    
    
    
    if (response.ok) {
      setTableData((tableData)=> tableData.filter(item => item.id !== id))
    } else {
      console.log('failed to delete')
    }
  }
  const handleRowClick = (event, rowData) => {
    setFormData(rowData);
    console.log('router row data', rowData)
  
    // Add your custom logic here, such as opening a modal or updating state
  };


  const fetchRouters = useMemo(() => async ()=> {
  
  try {
    const response = await fetch('/api/routers'
  
  
  )
  
    const newData = await response.json()
  if (response.ok) {
   setTableData(newData)

  } else {
    console.log('failed to fetch routers')

  }
  
  } catch (error) {
    
    console.log(error)
  
  }
  
  
  }, [])
  
  useEffect(() => {
    
    fetchRouters()
  }, [fetchRouters]);



  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), 6000);

const handleSubmit = async (e)=> {

    e.preventDefault()

    try {
        setloading(true)

        const res = await fetch('/api/router', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            signal: controller.signal,
            body: JSON.stringify(formData),
        })

          clearTimeout(id)
        
        const newData = await res.json()
        if (res.ok) {
            setTableData((tableData)=>[...tableData, newData])
            setloading(false)


        } else {
            setloading(false)

        }
    } catch (error) {
      console.log(error.name === 'AbortError');

        setloading(false);

    }


    }

  const DeleteButton = () => (
        <IconButton style={{ color: '#8B0000' }}  onClick={ handleClickOpenDelete}>
          <DeleteIcon />
        </IconButton>
      );


  const EditButton = () => (
    <IconButton style={{color: 'black'}}   onClick={handleClickOpen}>
      <EditIcon />
    </IconButton>
  );
const columns = [
    {title: 'name', field: 'name',  },

  {title: 'ip_address', field: 'ip_address', },
  {title: 'username', field: 'username', },
  {title: 'password', field: 'password', },

  {title: 'Action', field:'Action',

  render: (rowData) =>  
    
     <>
      
       <DeleteButton  id={rowData.id} />
       <EditButton />
      
       </>

}


]

  return (
    <div className=''>
            
            <div className='text-end '>
  <input type="search"  className='bg-transparent border-y-[-2]    dark:focus:border-gray-400 focus:border-black focus:border-[3px] focus:shadow 
   focus:ring-black p-3 sm:w-[900px] rounded-md ' placeholder='search....'/>
</div>
<EditNas open={open} handleClose={handleClose} tableData={tableData} handleSubmit={handleSubmit}   formData={formData}
 setFormData={setFormData}  isloading={loading}/>


<DeleteRouter  deleteRouter={deleteRouter} id={formData.id}  handleCloseDelete ={handleCloseDelete}  openDelete={openDelete}/>
      <MaterialTable columns={columns}
      
      title='NAS (Mikrotik Routers with PPPoE/Hotspot)'
      
      
      data={tableData}

    onRowClick={handleRowClick}
    actions={[
        {
          icon:()=><GetAppIcon/>,
          tooltip: 'import'
        },
        {
          icon: () => <AddIcon  onClick={handleClickOpen} />,
          isFreeAction: true, // This makes the action always visible
          tooltip: 'Add Router'
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

export default Nas

