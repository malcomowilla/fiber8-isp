import DeleteIcon from '@mui/icons-material/Delete';
// import {useState} from 'react'
// import { DataGrid, GridToolbar } from '@mui/x-data-grid';

import EditIcon from '@mui/icons-material/Edit';

import { IconButton } from '@mui/material';
import GetAppIcon from '@mui/icons-material/GetApp';
import AddIcon from '@mui/icons-material/Add';

import {Link} from 'react-router-dom'
import {  useState} from 'react'
import {ApplicationContext} from '../context/ApplicationContext'
import EditNode from '../edit/EditNode'
import MaterialTable from 'material-table'







const Nodes = () => {

  const [open, setOpen] = useState(false);



  const handleClickOpen = () => {
      setOpen(true);
    };
    
    const handleClose = () => {
      setOpen(false);
    };

  const DeleteButton = ({ id }) => (
        <IconButton style={{ color: '#8B0000' }}>
          <DeleteIcon />
        </IconButton>
      );


  const EditButton = () => (
    <IconButton style={{color: 'black'}} onClick={handleClickOpen} >
      <EditIcon />
    </IconButton>
  );
const columns = [
    {title: 'Name', field: 'Name',  },

  {title: ' Code', field: ' Code',    },
  {title: ' Type', field: ' Type',    },
  {title: ' Zone', field: ' Zone',    },

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
         <EditNode  open={open} handleClose={handleClose}/>
         <div className='text-end '>
  <input type="search"  className='bg-transparent border-y-[-2]    dark:focus:border-gray-400 focus:border-black focus:border-[3px] focus:shadow 
   focus:ring-black p-3 sm:w-[900px] rounded-md ' placeholder='search......'/>
</div>
      <MaterialTable columns={columns}
      
      title='Nodes'
      
    //   data={rows}

      
    actions={[

      {
        icon: () => <AddIcon onClick={handleClickOpen} />,
        isFreeAction: true, // This makes the action always visible
        tooltip: <p className='text-sm'>Add Node</p>
      },
        {
          icon:()=><GetAppIcon/>,
          tooltip: <p className='text-sm'>Import</p>,
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
exportFileName: 'Nodes'
}}     
      
      
      
      
      />

    </div>
    </>
  )
}

export default Nodes

