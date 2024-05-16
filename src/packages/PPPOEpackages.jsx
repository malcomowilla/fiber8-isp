import DeleteIcon from '@mui/icons-material/Delete';
// import {useState} from 'react'
// import { DataGrid, GridToolbar } from '@mui/x-data-grid';


import ActionCable from 'actioncable';
import { makeStyles } from '@mui/styles';

import { IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';

import GetAppIcon from '@mui/icons-material/GetApp';
// import {  useState} from 'react'
import {ApplicationContext} from '../context/ApplicationContext'

import DeletePackage from '../delete/DeletePackage'
import MaterialTable from 'material-table'
import EditPackage from '../edit/EditPackage'
import { useContext, useState, useEffect, useMemo, useRef} from 'react'
import {CableContext} from '../context/CableContext'
import PackageNotification  from '.././notification/PackageNotification'
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Stack from '@mui/material/Stack';
import { useDebounce } from 'use-debounce';

const useStyles = makeStyles({
  customSearchFieldFocus: {
    '& .MuiOutlinedInput-input:focus': {
      // Add your custom styles here to override the default focus styles
      // For example:
      border: '2px solid red',
      borderColor: 'transparent'
    },
  },
});

const PPPOEpackages = () => {
  const classes = useStyles();

  // const cableContext = useContext(CableContext)
  const [open, setOpen] = useState(false);
  const [loading, setloading] = useState(false)
  const [tableData, setTableData] = useState([])
  
  
  const [openDelete, setOpenDelete] = useState(false);

  const [showNotification, setShowNotification] = useState(false)
  const [routerName, setRouterName] = useState('');
const [creationError, setCreationError] = useState(false)
const [error, setError] = useState([])


const initialValue = {
  name: '',
  validity: '',
  download_limit: '',
  upload_limit: '',
  price:  '',
  upload_burst_limit: '',
  download_burst_limit: '',
  validity_period_units: '',
 
  router_name: ''
}
const [formData, setFormData] = useState(initialValue
)
const [offlineerror, setofflineerror] = useState(false)


const [search, setSearch] = useState('')
const [searchchInput] = useDebounce(search, 1000)


const handleRowClick = (event, rowData) => {
  setFormData(rowData);

  // Add your custom logic here, such as opening a modal or updating state
};
// const formData = initialValue






const handleClickOpenDelete = () => {
  setOpenDelete(true);
};

const handleCloseDelete = () => {
  setOpenDelete(false);
};





const handleClickOpen = () => {
  setOpen(true);
  setFormData(initialValue)

};

const handleClose = () => {
  setOpen(false);

};

setTimeout(() => {
  setShowNotification(false)

}, 29000);



setTimeout(() => {
  setCreationError(false)

}, 29000);

setTimeout(() => {
  setofflineerror(false)

}, 25000);

const controller = new AbortController();
const id = setTimeout(() => controller.abort(), 9000);



const createPackage = async (e) => {
  e.preventDefault();
    try {
      setloading(true);
      const url = formData.id ? `/api/update_package/${formData.id}` : '/api/create_package';
      const method = formData.id ? 'PATCH' : 'POST';
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const newData = await response.json();
      if (response.ok) {
        setOpen(false); // Close the form modal
        setloading(false);
        setShowNotification(true);
        setofflineerror(false);
        if (formData.id) {
          // Update existing package in tableData
          setTableData(tableData.map(item => (item.id === formData.id ? newData : item)));
        } else {
          // Add newly created package to tableData
          setTableData([...tableData, newData]);
        }
      } else {
        setloading(false);
        setCreationError(true);
        setError(newData.error);
      }
    } catch (error) {
      setloading(false);
      setofflineerror(true);
    }
}


const fetchPackages = useMemo(() => async ()=> {
  setofflineerror(false)

try {
  const response = await fetch('/api/get_package',{
    signal: controller.signal,  

  }


)
clearTimeout(id);

  const newData = await response.json()

  if (response.ok) {
    setTableData(newData.filter((poe_package)=> {
      return search.toLowerCase() === ''? poe_package : poe_package.name.toLowerCase().includes(search)
    }))
  }

} catch (error) {
  console.log(error)
  setofflineerror(true)

}


}, [searchchInput])

useEffect(() => {
  
  fetchPackages()
}, [fetchPackages]);

// useEffect(() => {
  
//  const fetchPackages = async() => {
// const response = await fetch('/api/get_package', {
//   signal: controller.signal,  

// }





// )
// clearTimeout(id);

// const data = await response.json()
// setTableData(data)
//  }

//  fetchPackages()
// }, []);





// useEffect(() => {
//   const cable = ActionCable.createConsumer('ws://localhost:3000/cable');

//    cable.subscriptions.create('PpoePackagesChannel', {
//     received: (data) => {
//       setTableData(data);
//       setFormData(data)

//       console.log(data )
//     },

    
//   }, []);




  
//   // Cleanup function to disconnect when component unmounts
//   // return () => {
//   //   cableContext.cable.disconnect();
//   // };
// }, []);



// useEffect(() => {
//   const cable = ActionCable.createConsumer('ws://localhost:3000/cable');

//    cable.subscriptions.create(
//     { channel: 'PpoePackagesChannel',
  
  
  
//         headers: {
//           credentials: 'include'
//         },
  
//   },
    
//     {
//       received: (data) => {
//         console.log('Received data:', data);
//          setData1(data);
//         console.log(data.packages)
//       },
//       connected: () => {
//         console.log('Connected to PpoePackagesChannel');
//       },
//       disconnected: () => {
//         console.log('Disconnected from PpoePackagesChannel');
//       },
//       rejected: () => {
//         console.log('Subscription to PpoePackagesChannel rejected');
//       },
//     }
//   );

//   // return () => {
//   //   cable.subscriptions.remove(subscription);
//   // };
// }, []);



// useEffect(() => {
  


// const fetchData = async () => {
// const data = await fetch('/api/packages') 
// // const packages = await data
// console.log( data)


// }  

// fetchData()

// }, []);


const deletePackage = async (id) => {
const response = await fetch(`/api/package/${id}`, {
  method: "DELETE",
  

})



if (response.ok) {
  setTableData((tableData)=> tableData.filter(item => item.id !== id))
} else {
  console.log('failed to delete')
}
}

const DeleteButton = ({ id }) => (
  <IconButton style={{ color: '#8B0000' }}  onClick={handleClickOpenDelete} >
    <DeleteIcon />
  </IconButton>
);
  const EditButton = () => (
    <IconButton  onClick={handleClickOpen} style={{color: 'black'}} >
    <EditIcon />
  </IconButton>
      );

const columns = [
  {title: 'name', field: 'name',   },
  {title: 'price', field: 'price',  },


  {title: 'validity', field: 'valid', },
  {title: 'speed(Up/Down)', field: 'speed'},

  {title: 'Action', field:'Action',

  render: (rowData) =>  
    
     <>
      
       <DeleteButton  id={rowData.id} />
       <EditButton  />
      
       </>

}


]


  return (


<>

    <div className='overflow-hidden'>

      <EditPackage open={open} handleClose={handleClose} formData={formData}      isloading={loading} 
        createPackage={createPackage}   offlineerror={offlineerror} 
       showNotification={showNotification}   setofflineerror={setofflineerror}  setFormData={setFormData} 
       tableData={tableData} routerName={routerName} setRouterName={setRouterName}/>
    <DeletePackage  openDelete={openDelete} handleCloseDelete={handleCloseDelete} deletePackage={deletePackage} id={formData.id}/>

{/* 

      <div className=' relative sm:left-[400px] max-md:left-[380px] max-sm:left-[210px]  z-50 top-9'>
<AddIcon onClick={handleClickOpen} />
      </div>  */}


<div className='text-end '>
  <input type="search" value={search} onChange={(e)=> setSearch(e.target.value)} className='bg-transparent border-y-[-2]  
    dark:focus:border-gray-400 focus:border-black focus:border-[3px] focus:shadow 
   focus:ring-black p-3 sm:w-[900px] rounded-md ' placeholder='search......'/>
</div>

      <MaterialTable columns={columns}
      title='PPPoe Packages'

      data={tableData}
      
// icons={{
//   Add:()=><AddIcon onClick={handleClickOpen}/>,
// }}

//     actions={[
//         {
//           icon:()=><GetAppIcon/>,
//           tooltip: 'import'
//         }
//     ]}

// onRowDelete={deletePackage}

icons={{
  Add: () => <AddIcon onClick={handleClickOpen} />,
}}

actions={[
  {
    icon: () => <AddIcon onClick={handleClickOpen} />,
    isFreeAction: true, // This makes the action always visible
    tooltip: 'Add Package',
  },
  {
    icon: () => <GetAppIcon />,
    isFreeAction: true, // This makes the action always visible

    tooltip: 'Import',
  },
]}




    onRowClick={handleRowClick} 
  
options={{
        paging: true,
       pageSizeOptions:[5, 10, 20, 25, 50, 100],
       pageSize: 10,
       search: false,
       searchFieldAlignment:'right',
  

showSelectAllCheckbox: false,
showTextRowsSelected: false,
hover: true, 
selection: true,
paginationType: 'stepped',


paginationPosition: 'bottom',
exportButton: true,
exportAllData: true,
exportFileName: 'PPPOE packages',

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
      <div className=''>
      {showNotification &&   <PackageNotification/>}
      { creationError     &&   
<Stack sx={{ width: '50%' }} spacing={1}>
     

     
      <Alert severity="error">
        <AlertTitle>Package Error</AlertTitle>
        <p className='font-extrabold  font-mono text-red-500  text-2xl'>{error}</p>
      </Alert>
    
    </Stack>}

      </div>



      <div className=''>

      {offlineerror  && 
        <Stack sx={{ width: '50%', marginTop: 3 }}  >
     

     
     <Alert severity="error">
       <AlertTitle>Offline </AlertTitle>
       <p className='text-red-500 font-mono font-extrabold text-2xl'>Something went wrong please try again later</p>
     </Alert>
   
   </Stack>
     
          
          }
                </div>

    </div>




    </>
  )
}

export default PPPOEpackages

