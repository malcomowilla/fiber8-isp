

import MaterialTable from 'material-table'
import DeleteIcon from '@mui/icons-material/Delete';




import EditIcon from '@mui/icons-material/Edit';

import { IconButton } from '@mui/material';

import AddIcon from '@mui/icons-material/Add';
import {useState} from'react'
import EditSubscriber from '../edit/EditSubscriber'

const rows = [
  {  Speed: '4M/4M', Name: 'Makena', Price: 1500, Validity: 30 },
  {  Speed: '10M/10M', Name: 'Jane', Price: 4000, Validity: 30 },
  {  Speed: '4M/4M', Name: 'Andrew', Price: 1500, Validity: 30 },
  {  Speed: '10M/10M', Name: 'Jemo', Price: 4000, Validity: 30 },
  {  Speed: '4M/4M', Name: 'James', Price: 1500, Validity: 30 },
  {  Speed: '10M/10M', Name: 'Jeane', Price: 4000, Validity: 30 },
  {  Speed: '4M/4M', Name: 'Oscar', Price: 1500, Validity: 30 },
  {  Speed: '10M/10M', Name: 'Silky', Price: 4000, Validity: 30 },
  // Add more rows as needed
];





const PPPOEsubscribers = () => {

  const [open, setOpen] =useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);

  };
  const columns = [
    {title: 'Name', field: 'Name', headerClassName: 'dark:text-black ', defaultSort: 'asc'},
    {title: 'RefNo', field: 'RefNo',  headerClassName: 'dark:text-black' ,  sorting: true, defaultSort: 'asc'},
  
    {title: 'Phone', field: 'Phone',  headerClassName: 'dark:text-black'},
    {title: 'Package', field: 'Package', type: 'numeric', headerClassName: 'dark:text-black', align: 'left'},
    {title: 'Last Renewed', field:'Last Renewed',  headerClassName: 'dark:text-black'},
    {title: 'Expires', field:'Expires',  headerClassName: 'dark:text-black'},
  
    {title: 'Online', field:'Online',  headerClassName: 'dark:text-black'},
    {title: 'Action', field:'Action',  headerClassName: 'dark:text-black',
    render: (params) =>  
    
    <>
     
      <DeleteButton {...params} />
      <EditButton {...params}/>
     
      </>
  
  
  }
  
  ]



  const DeleteButton = ({ id }) => (
    <IconButton style={{ color: '#8B0000' }}>
      <DeleteIcon />
    </IconButton>
  );
  const EditButton = ({ id }) => (
    <IconButton style={{color: 'black'}} onClick={handleClickOpen} >
      <EditIcon />
    </IconButton>
  )

  return (
    <div>
<EditSubscriber open={open} handleClose={handleClose} 
        
            />
             
<div className='text-end '>
  <input type="search"  className='bg-transparent border-y-[-2]    dark:focus:border-gray-400 focus:border-black focus:border-[3px] focus:shadow 
   focus:ring-black p-3 sm:w-[900px] rounded-md ' placeholder='search......'/>
</div>
<MaterialTable columns={columns}

title='PPPoe Subcribers'


icons={{
  Add: () => <AddIcon onClick={handleClickOpen} />,
}}
actions={[
  {
    icon: () => <AddIcon onClick={handleClickOpen} />,
    isFreeAction: true, // This makes the action always visible
    tooltip: 'Add Subscribers',
  },
  
]}

options={{
  sorting: true,
  pageSizeOptions:[2, 5, 10, 20, 25, 50, 100],
  pageSize: 10,
  paginationPosition: 'bottom',
exportButton: true,
exportAllData: true,
selection: true,
search:false,
searchAutoFocus: true,
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
  )
}

export default PPPOEsubscribers














