import DeleteIcon from '@mui/icons-material/Delete';
// import {useState} from 'react'
// import { DataGrid, GridToolbar } from '@mui/x-data-grid';

import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';

import { IconButton } from '@mui/material';
import GetAppIcon from '@mui/icons-material/GetApp';
import {Link} from 'react-router-dom'
import {  useState} from 'react'
import {ApplicationContext} from '../context/ApplicationContext'
import EditZone from '../edit/EditZone'

import MaterialTable from 'material-table'
import {  useEffect, useMemo, useRef} from 'react'
import DeleteZone from '../delete/DeleteZone'
import { useDebounce } from 'use-debounce';
import PackageNotification  from '.././notification/PackageNotification'
import ZoneNotification from '.././notification/ZoneNotification'


const Zones = () => {
const initialValue={
  name:'',
  zone_code: ''
}
  const [open, setOpen] = useState(false);
  const [tableData, setTableData] = useState([])
  const [formData, setFormData] = useState(initialValue) 
  const [loading, setloading] = useState(false)
  const [showNotification, setShowNotification] = useState(false)
  const [renderCode, setRenderCode] = useState(false)

  const [openDelete, setOpenDelete] = useState(false);

const [search, setSearch] = useState('')
const [searchchInput] = useDebounce(search, 1000)


const handleRowClick =(event,rowData)=>{
  setFormData(rowData)
  setRenderCode(true)
  console.log('this is rowdata in zones', rowData)
  }
  

  const handleClickOpen = () => {
    setOpen(true);
    setFormData(initialValue)
    setRenderCode(false)


  };

  const handleClose = () => {
    setOpen(false);
  };









  const handleClickOpenDelete = () => {
    setOpenDelete(true);


  };

  const handleCloseDelete = () => {
    setOpenDelete(false);
  };


// const handleRenderCode = ()=> {
//       setRenderCode([...renderCode, { zoneCode: '' }]);

// }


  const handleCreateZone = async(e)=> {
  e.preventDefault()
  
  const url = formData.id ? `/api/update_zone/${formData.id}` : '/api/zone'
  const method = formData.id ? 'PATCH' : 'POST'
    try {
      setloading(true);

      const response = await fetch(url, {
        method, 
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })
      const newData = await response.json()
     if (response.ok) {
      setOpen(false); 
      setloading(false);
      setShowNotification(true)

setTimeout(() => {
  setShowNotification(false)

}, 10000);
      // handleRenderCode()
      setRenderCode(true);


      if (formData.id) {
        setTableData(tableData.map(item => (item.id === formData.id ? newData : item)));

      } else {
        setTableData([...tableData, newData])
      }
     } else {
      setloading(false);

     }
    } catch (error) {
      setloading(false);

      console.log(error)
    }
  }



const fetchZones = useMemo(() => async ()=> {

try {
  const response = await fetch('/api/zones',{

  }


)

  const newData = await response.json()

  if (response.ok) {
    setTableData(newData.filter((poe_package)=> {
      return search.toLowerCase() === ''? poe_package : poe_package.name.toLowerCase().includes(search)
    }))
  }

} catch (error) {
  console.log(error)

}


}, [searchchInput])

useEffect(() => {
  
  fetchZones()
}, [fetchZones]);




const deleteZone = async (id) => {
  const response = await fetch(`/api/delete_zone/${id}`, {
    method: "DELETE",
    
  
  })
  
  
  
  if (response.ok) {
    setTableData((tableData)=> tableData.filter(item => item.id !== id))
  } else {
    console.log('failed to delete')
  }
  }

  const DeleteButton = ({ id }) => (
        <IconButton style={{ color: '#8B0000' }} onClick={handleClickOpenDelete}>
          <DeleteIcon />
        </IconButton>
      );


  const EditButton = () => (
    <IconButton style={{color: 'black'}}  onClick={handleClickOpen}>
      <EditIcon />
    </IconButton>
  );
const columns = [
    {title: 'name', field: 'name',  },

  {title: 'zone_code', field: 'zone_code',    },
  
  {title: 'Action', field:'Action', align: 'right',

  render: (rowData) =>  
    
     <>
      
       <DeleteButton id={rowData.id} />
       <EditButton />
      
       </>


}


]

  return (
    <>
    <div className=''>
         <EditZone open={open} handleClose={handleClose}        isloading={loading}  renderCode={renderCode}  formData={formData} 
         setFormData={setFormData}
           handleCreateZone={handleCreateZone}/>

           <DeleteZone deleteZone={deleteZone} id={formData.id}  openDelete={openDelete}  handleCloseDelete={handleCloseDelete}/>
         <div className='text-end '>
  <input type="search"   value={search} onChange={(e)=> setSearch(e.target.value)}  className='bg-transparent border-y-[-2]    dark:focus:border-gray-400 focus:border-black focus:border-[3px] focus:shadow 
   focus:ring-black p-3 sm:w-[900px] rounded-md ' placeholder='search......'/>
</div>


      <MaterialTable columns={columns}
      
      title='Zones'
      
      data={tableData}

      
    actions={[
        {
          icon:()=><AddIcon  onClick={handleClickOpen }/>,
          tooltip: 'Add Zone',
          isFreeAction: true
        }
    ]}


    onRowClick={handleRowClick} 

options={{
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

    </div>

    <div>
    {showNotification &&   <ZoneNotification/>}

    </div>

    </>
  )
}

export default Zones

