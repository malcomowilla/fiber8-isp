import DeleteIcon from '@mui/icons-material/Delete';
// import {useState} from 'react'
// import { DataGrid, GridToolbar } from '@mui/x-data-grid';

import EditIcon from '@mui/icons-material/Edit';

import { IconButton } from '@mui/material';
import GetAppIcon from '@mui/icons-material/GetApp';
import {Link} from 'react-router-dom'
import {  useState} from 'react'
import {ApplicationContext} from '../context/ApplicationContext'
import EditNas from '../edit/EditNas' 
import AddIcon from '@mui/icons-material/Add';

import MaterialTable from 'material-table'







const Nas = () => {
const initialValue={
username:'',
password: '',
ip_address:''
}
  const [open, setOpen] = useState(false);
const  [formData, setFormData] = useState(initialValue)
const [tableData, setTableData] = useState([])
const [loading, setloading] = useState(false)

  const handleClickOpen = () => {
    setOpen(true);
  };



  const handleClose = () => {
    setOpen(false);
  };


  const handleRowClick = (event, rowData) => {
    setFormData(rowData);
    console.log('this is rowdata', rowData)
  
    // Add your custom logic here, such as opening a modal or updating state
  };


  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), 8000);
const handleSubmit = async (e)=> {

    e.preventDefault()

    try {
        setloading(true)

        const res = await fetch('/api/router', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData),
            signal: controller.signal
        })
        clearTimeout(id);

        const newData = await res.json
        if (res.ok) {
            setTableData((tableData)=>[...tableData, newData])
            setloading(false)


        } else {
            setloading(true)

        }
    } catch (error) {
        console.log(error)
        setloading(false);

    }


    }

  const DeleteButton = ({ id }) => (
        <IconButton style={{ color: '#8B0000' }}>
          <DeleteIcon />
        </IconButton>
      );


  const EditButton = () => (
    <Link >
    <IconButton style={{color: 'black'}} >
      <EditIcon />
    </IconButton>
    </Link>
  );
const columns = [
    {title: 'Name', field: 'Name',  },

  {title: 'ip_address', field: 'ip_address', },
  {title: 'username', field: 'username', },
  {title: 'password', field: 'password', },

  {title: 'Action', field:'Action',

  render: (params) =>  
    
     <>
      
       <DeleteButton {...params} />
       <EditButton {...params}/>
      
       </>


}


]

  return (
    <div className=''>
            
            <div className='text-end '>
  <input type="search"  className='bg-transparent border-y-[-2]    dark:focus:border-gray-400 focus:border-black focus:border-[3px] focus:shadow 
   focus:ring-black p-3 sm:w-[900px] rounded-md ' placeholder='search......'/>
</div>
<EditNas open={open} handleClose={handleClose} tableData={tableData} handleSubmit={handleSubmit}   formData={formData}
 setFormData={setFormData}  isloading={loading}/>

      <MaterialTable columns={columns}
      
      title='NAS (Mikrotik Routers with PPPoE/Hotspot)
      '
      
    //   data={rows}

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

