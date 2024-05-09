


import DeleteIcon from '@mui/icons-material/Delete';
import { IconButton } from '@mui/material';
// import {useState} from 'react'
// import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import  EditPayment from '../edit/EditPayment'

import {Link} from 'react-router-dom'
import {useState, useContext} from 'react'
import {ApplicationContext} from '../context/ApplicationContext'

import AddIcon from '@mui/icons-material/Add';

import GetAppIcon from '@mui/icons-material/GetApp';

import MaterialTable from 'material-table'








const FixedPayments = () => {

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


  const EditButton = ( ) => (
    <IconButton onClick={handleClickOpen} style={{color: 'black'}} >
      <EditIcon />
    </IconButton>
  );
const columns = [
  {title: 'Confirmation Code', field: 'Confirmation Code',   },
  {title: 'Paybill', field: 'Paybill',  },
  {title: 'Ref No', field: 'Ref No', type:'numeric',  defaultSort: 'asc', align: 'left'},
  {title: 'Phone', field: 'Phone', type: 'numeric',align: 'left' },
  {title: 'Name', field: 'Name', defaultSort: 'asc'  },
  {title: 'Amount', field: 'Amount', defaultSort: 'asc', type: 'numeric', align: 'left'  },
  {title: 'Redeemed', field: 'Redeemed',   },
  {title: 'Transaction Time', field: 'Transaction Time', type: 'date'   },


  {title: 'Action', field:'Action', align: 'right',

  render: (params) =>  
    
     <>
      
       <DeleteButton {...params} />


       <EditButton    onClick={handleClickOpen} {...params}/>
       </>


}


]



  return (
    <>
    <div className=''>
    <EditPayment open={open} handleClose={handleClose}/>
            
    <div className='text-end '>
  <input type="search"  className='bg-transparent border-y-[-2]    dark:focus:border-gray-400 focus:border-black focus:border-[3px] focus:shadow 
   focus:ring-black p-3 sm:w-[900px] rounded-md ' placeholder='search......'/>
</div>
      <MaterialTable columns={columns}
      
      title='Mpesa Payments'
      
      // data={rows}

      
    

      actions={[
        {
          icon: () => <AddIcon  onClick={handleClickOpen }/>,
          isFreeAction: true, // This makes the action always visible
          tooltip: 'Edit Payment',
        },
        {
          icon: () => <GetAppIcon />,
          isFreeAction: true, // This makes the action always visible
      
          tooltip: 'Import',
        },
      ]}

options={{
       pageSizeOptions:[5, 10, 20, 25, 50, 100],
       pageSize: 20,
       search: false,
searchFieldStyle: {
  borderColor: 'red'
},
searchAutoFocus: true,



selection: true,


paginationPosition: 'bottom',
exportButton: true,
exportAllData: true,
showSelectAllCheckbox: false,
showTextRowsSelected: false,

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

export default FixedPayments





