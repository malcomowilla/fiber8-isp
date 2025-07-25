import DeleteIcon from '@mui/icons-material/Delete';

import { makeStyles } from '@mui/styles';

import { IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';


import AddIcon from '@mui/icons-material/Add';

import GetAppIcon from '@mui/icons-material/GetApp';

import DeletePackage from '../delete/DeletePackage'
import MaterialTable from 'material-table'
import EditPackage from '../edit/EditPackage'
import { useState, useEffect, useCallback,} from 'react'
import PackageNotification  from '.././notification/PackageNotification'
import DeletePackageNotification from '.././notification/DeletePackageNotification'
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Stack from '@mui/material/Stack';
import { useDebounce } from 'use-debounce';
import {useApplicationSettings} from '../settings/ApplicationSettings'
import { FaWifi } from "react-icons/fa6";
import toast, { Toaster } from 'react-hot-toast';
import { PiNumberOne } from "react-icons/pi";


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


  const [open, setOpen] = useState(false);
  const [loading, setloading] = useState(false)
  const [tableData, setTableData] = useState([])
  const { settingsformData, materialuitheme,
showMenu1, setShowMenu1, showMenu2, setShowMenu2, showMenu3, setShowMenu3,
      showMenu4, setShowMenu4, showMenu5, setShowMenu5, showMenu6, setShowMenu6,
       showMenu7, setShowMenu7, showMenu8, setShowMenu8, showMenu9, setShowMenu9,
        showMenu10, setShowMenu10, showMenu11, setShowMenu11, showMenu12, setShowMenu12,

  } =  useApplicationSettings() 
  const [openLoad, setOpenLoad] = useState(true);
  const [openDelete, setOpenDelete] = useState(false);

  const [showNotification, setShowNotification] = useState(false)
  const [routerName, setRouterName] = useState('');
const [creationError, setCreationError] = useState(false)
const [error, setError] = useState([])
const [deleteNotification, setDeleteNotification] = useState(false)

const initialValue = {
  name: '',
  validity: '',
  validity_period_units: '',
  download_limit: '',
  upload_limit: '',
  price:  '',
  upload_burst_limit: '',
  download_burst_limit: '',
router_name: settingsformData.router_name,
ip_pool: '',
daily_charge: '',
burst_threshold_download: '',
burst_threshold_upload: '',
burst_time: '',
burst_upload_speed: '',
burst_download_speed: '',
aggregation: '',

}

console.log('router_nameee',settingsformData.router_name)
const [formData, setFormData] = useState(initialValue)

const [offlineerror, setofflineerror] = useState(false)
const [nameError, setNameError] = useState(false)
const [priceError, setPriceError] = useState(false)
const [uploadLimitError, setUploadLimitError] = useState(false)
const [downloadLimitError, setDownloadLimitError] = useState(false)
const [validityError, setValidityError]= useState(false)
const [uploadBurstSpeedError, setUploadBurstSpeedError] = useState(false)
const [downloadBurstSpeedError, setDownloadBurstSpeedError] = useState(false)
const [validityPeriodUnitError, setUnitsError] = useState(false)
const [editPackage, setEditPackage] = useState(false)


const [search, setSearch] = useState('')
const [searchchInput] = useDebounce(search, 1000)
const handleRowClick = (event, rowData) => {
  setFormData(rowData);
  setEditPackage(true)
 

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
  setEditPackage(false)

};

const handleClose = () => {
  setOpen(false);

};

useEffect(() => {
  
setTimeout(() => {
  setofflineerror(false)

}, 8000);
 
}, [offlineerror]);





const subdomain = window.location.hostname.split('.')[0]

const createPackage = async (e) => {
  e.preventDefault();

 
    try {
      setNameError(false);
      setPriceError(false);
      setUploadLimitError(false);
      setDownloadLimitError(false);
      // setValidityError(false);
      // setUploadBurstSpeedError(false)
      // setDownloadBurstSpeedError(false)
      setUnitsError(false)
     // Perform validations
     let hasError = false;


      // if (formData.name === '') {
      //   setNameError(true)
      //   hasError = true;

      // }

    
    // if (formData.upload_burst_limit === '') {
    //   setUploadBurstSpeedError(true)
    //   hasError = true
    // }


    // if (formData.download_burst_limit === '') {
    //   setDownloadBurstSpeedError(true)
    //   hasError = true
    // }
    
      // if (formData.price === '') {
      //   setPriceError(true)
      //   hasError = true;

      // }
    
    
    // if (formData.validity_period_units) {
    //  setUnitsError(true)
    // }


      // if (formData.upload_limit === '') {
      //   setUploadLimitError(true)
      //   hasError = true;

      // }
    
      // if (formData.download_limit === '') {
      //   setDownloadLimitError(true)
      //   hasError = true;

      // }
    
    
      // if (formData.validity === '') {
      //   setValidityError(true)
      //   hasError = true;

      // }

      if (hasError) {
        return; 
      }

      setloading(true);
      const url = formData.id ? `/api/update_package/${formData.id}` : '/api/create_package';
      const method = formData.id ? 'PATCH' : 'POST';
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'X-Subdomain': subdomain,

        },
        body: JSON.stringify({
          package: {
            ...formData,
            router_name: settingsformData.router_name,
            use_radius: settingsformData.use_radius
          }
        })
      });

      const newData = await response.json();



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

      if (response.status === 423) {
        setTimeout(() => {
        //  navigate('/account-locked')
         window.location.href='/account-locked'
        }, 1800); 
       }


      if (response.ok) {
        setOpen(false); // Close the form modal
        setloading(false);
        setShowNotification(true);

setTimeout(() => {
  setShowNotification(false)

}, 10000);
        setofflineerror(false);
        if (formData.id) {
          setTableData(tableData.map(item => (item.id === formData.id ? newData : item)));

          toast.success('package updated successfully', {
            position: "top-center",
            duration: 4000,
          })
          // Update existing package in tableData
        } else {
          // Add newly created package to tableData
          setTableData([...tableData, newData]);
          toast.success('package created successfully', {
            position: "top-center",
            duration: 4000,
          })
        }
      } else {
        setOpen(true)
        setloading(false);
        toast.error(newData.error, {
          position: "top-center",
          duration: 8000,
        })
       
        // setCreationError(true);

// setTimeout(() => {
//   setCreationError(false)

// }, 10000);
        setError(newData.error);
      }
    } catch (error) {
      setOpen(false); // Close the form modal
      setloading(false);
      setofflineerror(true);
      toast.error('failed to update package server error', {
        position: "top-center",
        duration: 4000,
      })
}
}




const fetchPackages = useCallback(
  async() => {
    
try {
  const response = await fetch('/api/get_package',{
    headers: {
      'X-Subdomain': subdomain,
    },

  }


)

  const newData = await response.json()

  if (response.ok) {
    setTableData(newData.filter((poe_package)=> {
      return search.toLowerCase() === ''? poe_package : poe_package.name.toLowerCase().includes(search)
    }))

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

    // setTableData(newData)
  }else{

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
    toast.error(newData.error, {
      position: 'top-center',
      duration: 5000,
    })
    toast.error(
      'Failed to get packages',
      {
        position: 'top-center',
        duration: 4000,
      }
    )
  }

} catch (error) {
  console.log(error)
  setofflineerror(true)

}
  },
  [],
)



useEffect(() => {
  
  fetchPackages()
}, [fetchPackages]);


const deletePackage = async (id) => {



try {
  
const response = await fetch(`/api/package/${id}?router_name=${settingsformData.router_name}`, {
  method: "DELETE",
  headers: {
    'X-Subdomain': subdomain,
  },
  

})
if (response.ok) {
  setTableData((tableData)=> tableData.filter(item => item.id !== id))
  toast.success('package deleted successfully', {
    position: "top-center",
    duration: 4000,
  })
 
  // setDeleteNotification(true)

// setTimeout(() => {
//   setDeleteNotification(false)

// }, 10000);

} else {
  const newData = await response.json()

  toast.error(
    newData.error,
    {
      position: 'top-center',
      duration: 4000,
    }
  )
  console.log('failed to delete')

}
} catch (error) {
  // setTableData((tableData)=> tableData.filter(item => item.id !== id))
  toast.error(`failed to delete package, server error`)
}





}

const DeleteButton = ({ id }) => (
  <IconButton style={{ color: '#8B0000' }}  onClick={handleClickOpenDelete} >
    <DeleteIcon />
  </IconButton>
);

  const EditButton = ({rowData}) => (
    <IconButton     style={{color: 'green'}} onClick={() => handleClickOpen(rowData)}  >
    <EditIcon />
  </IconButton>
      );

const columns = [
  {title: 'name', field: 'name',  

    
   },
  {title: 'price', field: 'price', 

    render: (rowData) => {
      {
return <div>{rowData.price} ksh</div>
      }
    }
   },
  {title: 'Aggregation', field: 'aggregation',  

    render: (rowData) => {
      {
        return rowData.aggregation && <div className='flex'><PiNumberOne className='text-black mt-[1px] dark:text-white' />:{rowData.aggregation}</div>
      }
    }
  },
  {title: 'Subscriptions', field: 'subscription',
     render: (rowData) => {
      return rowData.subscription && <div className='text-green-600'>{rowData.subscription}</div>
    },

  },


  // {title: 'validity', field: 'valid', },
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
<Toaster />
    <div className='overflow-hidden'
    
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
    >

      <EditPackage open={open} uploadBurstSpeedError={uploadBurstSpeedError} downloadBurstSpeedError={downloadBurstSpeedError}               handleClose={handleClose} formData={formData} validityError={validityError}
       nameError={nameError}   uploadLimitError={uploadLimitError}    downloadLimitError={downloadLimitError}        
          isloading={loading} priceError={priceError}  validityPeriodUnitError={validityPeriodUnitError}
        createPackage={createPackage}   offlineerror={offlineerror} 
       showNotification={showNotification}   setofflineerror={setofflineerror}  setFormData={setFormData} 
       tableData={tableData} routerName={routerName} setRouterName={setRouterName}
        editPackage={editPackage} setEditPackage={setEditPackage}
       />




    <DeletePackage  openDelete={openDelete} handleCloseDelete={handleCloseDelete} 
    deletePackage={deletePackage} id={formData.id} loading={loading}
   
    />



<div className="flex items-center max-w-sm mx-auto p-3">  
     
    <label htmlFor="simple-search" className="sr-only">Search</label>
    <div className="relative w-full">
        <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
           
            <FaWifi className='text-black'/>
            
        </div>


        <input type="text" value={search} onChange={(e)=> setSearch(e.target.value)}
         className="bg-gray-50 border border-gray-300 text-gray-900 
        text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full ps-10 p-2.5 
          dark:border-gray-600 dark:placeholder-gray-400 dark:text-black
          dark:focus:ring-green-500 dark:focus:border-green-500" placeholder="Search for wifi packages..."  />
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
      title='PPPoe Packages'

      data={tableData}
   

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
       pageSizeOptions:[5, 10],
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



fontFamily: 'mono'

}}     
      
      
      
      />


      <div>

        
      </div>
      <div className=''>
      {showNotification &&   <PackageNotification/>}
      {deleteNotification  &&  <DeletePackageNotification/>}
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

