import DeleteIcon from '@mui/icons-material/Delete';
// import {useState} from 'react'
// import { DataGrid, GridToolbar } from '@mui/x-data-grid';

import EditIcon from '@mui/icons-material/Edit';

import { IconButton } from '@mui/material';
import GetAppIcon from '@mui/icons-material/GetApp';
import {Link} from 'react-router-dom'
import {  useState} from 'react'
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
const [hotspotPackage, setHotspotPackage] = useState({
  name: '',
  validity: '',
  download_limit: '',
  upload_limit: '',
  price:  '',
  upload_burst_limit: '',
  download_burst_limit: '',
  validity_period_units: '',
})


const handleClickOpen = (rowData) => {
  setOpen(true);
  setHotspotPackage(rowData);

};

  const handleClose = () => {
    setOpen(false);
  };



  // handleClose, loading, open

  const DeleteButton = ({ id }) => (
        <IconButton style={{ color: '#8B0000' }}  onClick={() => setisOpenDelete(true)}>
          <DeleteIcon />
        </IconButton>
      );


  const EditButton = ({rowData}) => (
    <IconButton style={{color: 'black'}}  onClick={() => handleClickOpen(rowData)}>
      <EditIcon />
    </IconButton>
  );


const columns = [
  {title: 'names', field: 'name',  },

    // {title: 'Size', field: 'Size',  type: 'numeric', align: 'left'},
    {title: 'price', field: 'price',  },

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

  // Add your custom logic here, such as opening a modal or updating state
};

const subdomain = window.location.hostname.split('.')[0]

useEffect(() => {
  
  const fetchHotspotPackages = async() => {
    try {
      const response = await fetch('/api/hotspot_packages', {
        headers: {
          'X-Original-Host': subdomain
        }
      })
      const newData = await response.json()
      if (response.ok) {
        setPackages(newData)
      } else {
        toast.error('failed to fetch hotspot packages', {
          duration: 7000,
          position: "top-center",
        });
        console.log('failed to fetch hotspot packages')
      }
    } catch (error) {
      toast.error('Something went wrong', {
        duration: 7000,
        position: "top-center",
      });
      console.log(error)
    }
  }
  fetchHotspotPackages()
}, []);



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
        'X-Original-Host': subdomain
      },
      body: JSON.stringify({...hotspotPackage, router_name: settingsformData.router_name}),
    });

    const newData = await response.json();
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
      }else{
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
    
    loading={loading} hotspotPackage={hotspotPackage} setHotspotPackage={setHotspotPackage}
    createHotspotPackage={createHotspotPackage}
    />




    {loading &&    <Backdrop open={openLoad} sx={{ color:'#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
  
  <Lottie className='relative z-50' options={defaultOptions} height={400} width={400} />
    
     </Backdrop>
  }
    <div className=''>

            
            <div className='text-end '>
  <input type="search"  className='bg-transparent border-y-[-2]    dark:focus:border-gray-400 focus:border-black focus:border-[3px] focus:shadow 
   focus:ring-black p-3 sm:w-[900px] rounded-md ' placeholder='search......'/>
</div>
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

    </div>

    </>
  )
}

export default HotspotPackage

