import DeleteIcon from '@mui/icons-material/Delete';
// import {useState} from 'react'
// import { DataGrid, GridToolbar } from '@mui/x-data-grid';

import EditIcon from '@mui/icons-material/Edit';

import { IconButton } from '@mui/material';
import GetAppIcon from '@mui/icons-material/GetApp';
import {Link} from 'react-router-dom'
import {  useState, useNavigate} from 'react'
import {ApplicationContext} from '../context/ApplicationContext'
import LoadingAnimation from '../loader/loading_animation.json'
import Lottie from 'react-lottie';

import Backdrop from '@mui/material/Backdrop';
import AddIcon from '@mui/icons-material/Add';
import MaterialTable from 'material-table'
import EditHotspotPackage from '../edit/EditHotspotPackage'
import toast, { Toaster } from 'react-hot-toast';
import { useEffect } from 'react';
import DeleteHotspotPackage from '../delete/DeleteHotspotPackage'
import {useApplicationSettings} from '../settings/ApplicationSettings'
import { RiHotspotLine } from "react-icons/ri";

import dayjs from 'dayjs';
import { useDebounce } from 'use-debounce';

import CircularProgress from "@mui/material/CircularProgress"; // Import CircularProgress for loading animation





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




// settingsformData
const HotspotPackage = () => {

  const [open, setOpen] = useState(false);
const [loading, setLoading] = useState(false);
const [openLoad, setOpenLoad] = useState(false)
const [packages, setPackages] = useState([])
const [isOpenDelete, setisOpenDelete] = useState(false)

const {settingsformData} = useApplicationSettings()
const [search, setSearch] = useState('')

const [searchInput] = useDebounce(search, 1000)
const [isSearching, setIsSearching] = useState(false); // New state for search loading

const [hotspotPackage, setHotspotPackage] = useState({
  name: '',
  validity: '',
  download_limit: '',
  upload_limit: '',
  price:  '',
  upload_burst_limit: '',
  valid_from: dayjs(),
  valid_until: dayjs(),
  shared_users: '',
  download_burst_limit: '',
  validity_period_units: '',
  weekdays: [] // <-- Add weekdays array

})


const navigate = useNavigate()

const handleWeekdayChange = (day) => {
  console.log('day', day);
  setHotspotPackage((prev) => {
    const updatedWeekdays = prev.weekdays?.includes(day)
      ? prev.weekdays?.filter((d) => d !== day) // Remove day if already selected
      : [...(prev.weekdays || []), day]; // Add day if not selected

    return { ...prev, weekdays: updatedWeekdays };
  });
};

const handleClickOpen = (rowData) => {
  setOpen(true);
  setHotspotPackage(rowData);

};

  const handleClose = () => {
    setOpen(false);
  };


const handleChangeTimeFrom = (date)=> {  
  setHotspotPackage({...hotspotPackage, valid_from: date})
}



const handleChangeTimeUntil = (date)=> {  
  setHotspotPackage({...hotspotPackage, valid_until: date})
}




  // handleClose, loading, open

  const DeleteButton = ({ id }) => (
        <IconButton style={{ color: '#8B0000' }}  onClick={() => setisOpenDelete(true)}>
          <DeleteIcon />
        </IconButton>
      );


  const EditButton = ({rowData}) => (
    <IconButton style={{color: 'green'}}  onClick={() => handleClickOpen(rowData)}>
      <EditIcon />
    </IconButton>
  );


const columns = [
  {title: 'names', field: 'name',  },

    // {title: 'Size', field: 'Size',  type: 'numeric', align: 'left'},
    {title: 'price', field: 'price',  },
    // {title: 'Valid From', field: 'valid_from', 
    //   render: rowData => rowData.valid_from ? dayjs(rowData.valid_from).format('hh:mm A')
    //   : 'N/A'
    //  },
     

  {title: 'Speed(Up/Down)', field: 'speed',   defaultSort: 'asc',


    render: (rowData) => 
      <>
        {rowData.speed === null ||  rowData.speed === 'null' || rowData.speed === '' 
          ? <p>unlimited </p>
          : rowData.speed }
      </>
   },

  // {title: 'Validity', field: 'Validity', type: 'numeric',  align: 'right'},
  {title: 'validity', field: 'valid', },
  {title: 'Action', field:'Action', align: 'right',

  render: (params) =>  
    
     <>
      
       <DeleteButton {...params} />
       <EditButton {...params}/>
      
       </>


}


]




const defaultOptions = {
  loop: true,
  autoplay: true, 
  animationData: LoadingAnimation,
  rendererSettings: {
    preserveAspectRatio: 'xMidYMid slice'
  }
};

const handleRowClick = (event, rowData) => {
  setHotspotPackage(rowData);
  console.log('hotspot package ',rowData )
console.log('hotspot package row data', rowData.valid_from)
setHotspotPackage({
  ...rowData,
  valid_from: rowData.valid_from ? dayjs(rowData.valid_from, 'hh:mm A') : dayjs(),
  valid_until: rowData.valid_until ? dayjs(rowData.valid_until, 'hh:mm A') : dayjs(),
});

// setHotspotPackage((prevData) => ({
//   ...prevData,
//   valid_from: rowData.valid_from ? dayjs(rowData.valid_from).format('hh:mm A') : dayjs(rowData.valid_from).format('hh:mm A'),
//   valid_until: rowData.valid_until ? dayjs(rowData.valid_until).format('HH:mm:ss') : dayjs(new Date()).format('HH:mm:ss'),
// }));



  // Add your custom logic here, such as opening a modal or updating state
};

const subdomain = window.location.hostname.split('.')[0]

useEffect(() => {
  
  const fetchHotspotPackages = async() => {
    try {
      setIsSearching(true)
      const response = await fetch('/api/hotspot_packages', {
        headers: {
          'X-Subdomain': subdomain,
        }
      })
      const newData = await response.json()
      if (response.ok) {
        // setPackages(newData)
        setIsSearching(false)
        setPackages(newData.filter((package_name)=> {
          return search.toLowerCase() === '' ? package_name : package_name.name.toLowerCase().includes(search)
        }))
      } else {
        setIsSearching(false)
        toast.error('failed to fetch hotspot packages', {
          duration: 7000,
          position: "top-center",
        });
        console.log('failed to fetch hotspot packages')
      }
    } catch (error) {
      setIsSearching(false)
      toast.error('Something went wrong', {
        duration: 7000,
        position: "top-center",
      });
      console.log(error)
    }
  }
  fetchHotspotPackages()
}, [searchInput]);



const createHotspotPackage = async (e) => {
  e.preventDefault();

  try {
    // const response = await fetch('/hotspot_packages', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json'
    //   },
    // }) 
    const url = hotspotPackage.id ? `/api/update_hotspot_package/${hotspotPackage.id}?router_name=${settingsformData.router_name}` : '/api/hotspot_packages';
    // const url = '/api/hotspot_packages';
    const method = hotspotPackage.id ? 'PATCH' : 'POST';
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'X-Subdomain': subdomain,
      },
      body: JSON.stringify({...hotspotPackage, router_name: settingsformData.router_name}),
    });

    const newData = await response.json();



    if (response.status === 402) {
      setTimeout(() => {
        navigate('/license-expired')
       }, 1800);
      
    }


    if (response.status === 423) {
      setTimeout(() => {
       navigate('/account-locked')
      }, 1800); 
     }


    if (response.ok) {
      setOpen(false); // Close the form modal
      setOpenLoad(false)
      setLoading(false);

setTimeout(() => {

}, 10000);
      if (hotspotPackage.id) {
        toast.success('Package updated successfully', {
          duration: 7000,
          position: "top-center",
        });
        // Update existing package in tableData
        setPackages(packages.map(item => (item.id === hotspotPackage.id ? newData : item)));
      } else {
        // Add newly created package to tableData
        toast.success('Package created successfully', {
          duration: 7000,
          position: "top-center",
        });
        setPackages([...packages, newData]);
      }
    } else {
      // setOpen(false)
      setLoading(false);
      setOpenLoad(false)

      if (hotspotPackage.id) {
        toast.error('Failed to update package', {
          duration: 7000,
          position: "top-center",
        });


        toast.error(newData.error, {
          duration: 7000,
          position: "top-center",
        });
      }else{

        toast.error(newData.error, {
          duration: 7000,
          position: "top-center",
        });
        toast.error('Failed to create package', {
          duration: 7000,
          position: "top-center",
        });
      }


    }
  } catch (error) {
    setOpen(false)
    toast.error('Failed to create or update package something went wrong', {
          duration: 7000,
          position: "top-center",
        });
  }
 
}







const deleteHotspotPackage = async (id) => {
  const response = await fetch(`/api/hotspot_packages/${id}?router_name=${settingsformData.router_name}`, {
    method: "DELETE",
    headers: {
      'X-Subdomain': subdomain,
    },
    
  
  })
  
  try {
    if (response.ok) {
      setisOpenDelete(false)
      setPackages((tableData)=> tableData.filter(item => item.id !== id))
    toast.success('package deleted successfully', {
            duration: 7000,
            position: "top-center",
          });
    
    } else {
      setisOpenDelete(false)
      toast.error('failed to delete package', {
            duration: 7000,
            position: "top-center",
          });


          toast.error('failed to delete package', {
            duration: 7000,
            position: "top-center",
          });
      console.log('failed to delete')
    
    
    }
  } catch (error) {
    setisOpenDelete(false)
    toast.error('something went wr9ng please try again', {
          duration: 7000,
          position: "top-center",
        });
  }
  
  
  }
  return (

    <>
    <Toaster />
    < DeleteHotspotPackage isOpenDelete={isOpenDelete} setisOpenDelete={setisOpenDelete}
    deleteHotspotPackage={deleteHotspotPackage} loading={loading} id={hotspotPackage.id}
    />
    <EditHotspotPackage open={open} handleClose={handleClose}
    handleChangeTimeFrom={handleChangeTimeFrom} handleChangeTimeUntil={handleChangeTimeUntil}
    loading={loading} hotspotPackage={hotspotPackage} setHotspotPackage={setHotspotPackage}
    createHotspotPackage={createHotspotPackage}
    handleWeekdayChange={handleWeekdayChange}
    />




    {loading &&    <Backdrop open={openLoad} sx={{ color:'#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
  
  <Lottie className='relative z-50' options={defaultOptions} height={400} width={400} />
    
     </Backdrop>
  }
    <div className=''>

            
          



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
             <RiHotspotLine className='text-black'/>
             
         </div>
 
 
         <input type="text" value={search} onChange={(e)=> setSearch(e.target.value)}
          className="bg-gray-50 border border-gray-300 text-gray-900 
         text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full ps-10 p-2.5 
           dark:border-gray-600 dark:placeholder-gray-400 dark:text-black
           dark:focus:ring-green-500 dark:focus:border-green-500"
            placeholder="Search for hotspot packages..."  />
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

      <MaterialTable columns={columns}
      onRowClick={handleRowClick}
      title='Hotspot Packages'
      
      data={packages}

      
    actions={[
        {
          icon:()=><GetAppIcon/>,
          tooltip: 'import'
        },
        {
          icon: () => <AddIcon  onClick={()=> {
            setOpen(true)
            setHotspotPackage({})
          }  } />,
          isFreeAction: true, // This makes the action always visible
          tooltip: 'Add Hotspot Package'
        }
    ]}


options={{
        paging: true,
       pageSizeOptions:[5, 10],
      //  pageSize: 20,
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
exportFileName: 'Hotspot packages',

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

export default HotspotPackage

