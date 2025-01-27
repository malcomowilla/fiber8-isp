import DeleteIcon from '@mui/icons-material/Delete';
// import {useState} from 'react'
// import { DataGrid, GridToolbar } from '@mui/x-data-grid';

import EditIcon from '@mui/icons-material/Edit';
// import RadioGroup from '@mui/material/RadioGroup';
// import FormControlLabel from '@mui/material/FormControlLabel';

import { IconButton,  Checkbox } from '@mui/material';
import GetAppIcon from '@mui/icons-material/GetApp';
// import {Link} from 'react-router-dom'
import {  useState, useEffect, useMemo} from 'react'
// import {ApplicationContext} from '../context/ApplicationContext'
import EditNas from '../edit/EditNas' 
import AddIcon from '@mui/icons-material/Add';

import MaterialTable from 'material-table'
import toast, { Toaster } from 'react-hot-toast';

import DeleteRouter from '../delete/DeleteRouter'
import {useApplicationSettings} from '../settings/ApplicationSettings'




const Nas = () => {


  const [open, setOpen] = useState(false);
const [loading, setloading] = useState(false)
const [offlineerror, setofflineerror] = useState(false)
const [openDelete, setOpenDelete] = useState(false);
const { nasformData, setnasFormData,initialValueNas, tableDataNas, setTableData } =  useApplicationSettings() 
const [selectedRouter, setSelectedRouter] = useState(null);
const [selectedRouterInfo, setSelectedRouterInfo] = useState(null);

const [selectedRouterId, setSelectedRouterId] = useState(() => {
  const savedRouterId = localStorage.getItem('selectedCheckedRouter');
  return savedRouterId ? parseInt(savedRouterId, 10) : null;
});
// console.log('nas data', nasformData)
const handleClickOpenDelete = () => {
  setOpenDelete(true);
};

const handleCloseDelete = () => {
  setOpenDelete(false);
};

  const handleClickOpen = () => {
    setOpen(true);
    setnasFormData(initialValueNas)

  };



  const handleClose = () => {
    setOpen(false);
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




const subdomain = window.location.hostname.split('.')[0];



  const deleteRouter = async (id) =>  {
    setloading(true)
    const response = await fetch(`/api/delete_router/${id}`, {
      method: "DELETE",
      headers: {
        'X-Subdomain': subdomain,
      },


    })
    
    
    
    if (response.ok) {
      toast.success('router deleted successfully', {
        position: "top-center",
        duration: 7000,
      })
      setTableData((tableData)=> tableData.filter(item => item.id !== id))
      setloading(false)
      
    } else {
      setloading(false)
      toast.error('failed to delete router', {
        position: "top-center",
        duration: 7000,
      })
      console.log('failed to delete')
    }
  }



  const handleRowClick = (event, rowData) => {
    setnasFormData(rowData);
    console.log('router row data', rowData)
  
    // Add your custom logic here, such as opening a modal or updating state
  };


  const fetchRouters = useMemo(() => async ()=> {
  
  try {
    const response = await fetch('/api/routers',
      {
        headers: {
          'X-Subdomain': subdomain,
        },
      }
  
  
  )
  
    const newData = await response.json()
  if (response.ok) {
   setTableData(newData)
   const ip_address = newData[0].ip_address
   const username = newData[0].username
   const password = newData[0].password
   setnasFormData({...nasformData,password, username, ip_address })

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
        const url = nasformData.id ? `/api/update_router/${nasformData.id}` : '/api/create_router';
        const method = nasformData.id ? 'PATCH' : 'POST';
        const res = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'X-Subdomain': subdomain,
                
            },
            signal: controller.signal,
            body: JSON.stringify(nasformData),
        })

          clearTimeout(id)
        
        const newData = await res.json()
        if (res.ok) {
          setloading(false)
         
          if (nasformData.id) {
            toast.success('router updated successfully', {
              position: "top-center",
              duration: 7000,
            })
            setTableData(tableDataNas.map(item => (item.id === nasformData.id ? newData : item)));
          }else{
            setTableData((tableData)=>[...tableData, newData])
            toast.success('router added successfully', {
              position: "top-center",
              duration: 7000,
            })
          }
            
            const ip_address = newData.ip_address
            const username = newData.username
            const password = newData.password
            // setnasFormData({...nasformData,password, username, ip_address })
            setloading(false)
          handleClose()

        } else {
          toast.error('failed to add router', {
            position: "top-center",
            duration: 7000,
          })
            setloading(false)

        }
    } catch (error) {
      toast.error('failed to add router something went wrong', {
        position: "top-center",
        duration: 7000,
      })
        setloading(false);

    }


    }


    function getRouterInfoById(id) {
      return tableDataNas.find(router => router.id === id);
    }
    useEffect(() => {
      if (selectedRouterId !== null) {
        const routerInfo = getRouterInfoById(selectedRouterId);
        setSelectedRouterInfo(routerInfo);
      }
    }, [selectedRouterId]);


    const handleCheckboxChange = (event, rowData) => {
      const newSelectedRouter = rowData.id === selectedRouter ? null : rowData.id;
      setSelectedRouter(newSelectedRouter);
      localStorage.setItem('selectedCheckedRouter', newSelectedRouter !== null ? newSelectedRouter : '');
      setnasFormData(newSelectedRouter !== null ? rowData : initialValueNas);

    };
        console.log('selected rowdata', selectedRouter)

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
     <Checkbox                onChange={(event) => handleCheckboxChange(event, rowData)}
    checked={selectedRouter === rowData.id}
/>
       </>

}


]

  return (
    <div className=''>
      <Toaster />
            
            <div className='text-end '>
  <input type="search"  className='bg-transparent border-y-[-2]    dark:focus:border-gray-400 focus:border-black focus:border-[3px] focus:shadow 
   focus:ring-black p-3 sm:w-[900px] rounded-md ' placeholder='search....'/>
</div>
<EditNas open={open} handleClose={handleClose} tableData={tableDataNas} handleSubmit={handleSubmit}   nasformData={nasformData}
 setnasFormData={setnasFormData}  isloading={loading}/>


<DeleteRouter loading={loading}  deleteRouter={deleteRouter} id={nasformData.id}  handleCloseDelete ={handleCloseDelete}  openDelete={openDelete}/>
      <MaterialTable columns={columns}
      
      title='NAS (Mikrotik Routers with PPPoE/Hotspot)'
      
      
      data={tableDataNas}

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

