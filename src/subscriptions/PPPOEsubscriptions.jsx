
import MaterialTable from 'material-table'
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import { IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditSubscription from '../edit/EditSubscription'
import {useState} from 'react'




const PPPOEsubscriptions = () => {
  const [open, setOpen] = useState(false);
  

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
    const columns = [
        {title: 'Name', field: 'Name', defaultSort: 'asc'},
        {title: 'RefNo', field: 'RefNo',    },
      
        {title: 'Phone', field: 'Phone',  },
        {title: 'Package', field: 'Package', },
        {title: 'Last Subscribed', field:'Last Subscribed',  },
        {title: 'Expiry', field:'Expiry',  },
      
        {title: 'Status', field:'Status',  },
        {title: 'Action', field:'Action',  
    
    
  render: (params) =>  
    
  <>
   
   <DeleteButton {...params} />
   <EditButton  {...params}/>

    </>


}
      
      ]

  const DeleteButton = ({ id }) => (
    <IconButton style={{ color: '#8B0000' }}>
      <DeleteIcon />
    </IconButton>
  );


  const EditButton = () => (

 <IconButton style={{color: 'black'}} onClick={handleClickOpen} >
 <EditIcon />
 </IconButton>
  )


  return (
    <>

    
    <div>
<EditSubscription open={open}  handleClose={handleClose}/>
 
<div className='text-end '>
  <input type="search"  className='bg-transparent border-y-[-2]    dark:focus:border-gray-400 focus:border-black focus:border-[3px] focus:shadow 
   focus:ring-black p-3 sm:w-[900px] rounded-md ' placeholder='search......'/>
</div>
<MaterialTable columns={columns}

title='PPPoe Subcriptions'

// data={rows}

icons={{
  Add: () => <AddIcon onClick={handleClickOpen} />,
}}
actions={[
  {
    icon: () => <AddIcon onClick={handleClickOpen} />,
    isFreeAction: true, // This makes the action always visible
    tooltip: 'Add Subscription',
  },
 
]}


options={{
  paging: true,
  pageSizeOptions:[5, 10, 15],
  pageSize: 15,
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
exportFileName: 'PPPOE subscriptions',

  sorting: true,
  

headerStyle:{
  fontFamily: 'bold',
  textTransform: 'uppercase'
  } ,
  
  
  
  fontFamily: 'mono'

}}



/>

    </div>
    </>
  )
}

export default PPPOEsubscriptions





