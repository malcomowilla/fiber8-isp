
import MaterialTable from 'material-table'

import AddIcon from '@mui/icons-material/Add';



// import EditIcon from '@mui/icons-material/Edit';



import { IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

// import EditSubscription from '../edit/EditSubscription'



// const rows = [
//   {  Speed: '4M/4M', Name: 'Makena', Price: 1500, Validity: 30 },
//   {  Speed: '10M/10M', Name: 'Jane', Price: 4000, Validity: 30 },
//   {  Speed: '4M/4M', Name: 'Andrew', Price: 1500, Validity: 30 },
//   {  Speed: '10M/10M', Name: 'Jemo', Price: 4000, Validity: 30 },
//   {  Speed: '4M/4M', Name: 'James', Price: 1500, Validity: 30 },
//   {  Speed: '10M/10M', Name: 'Jeane', Price: 4000, Validity: 30 },
//   {  Speed: '4M/4M', Name: 'Oscar', Price: 1500, Validity: 30 },
//   {  Speed: '10M/10M', Name: 'Silky', Price: 4000, Validity: 30 },
// ];





const HotspotSubscriptions = () => {

    const columns = [
        {title: 'Name', field: 'Name', headerClassName: 'dark:text-black ', defaultSort: 'asc'},
      
        {title: 'Phone', field: 'Phone',  headerClassName: 'dark:text-black'},
        {title: 'Package', field: 'Package', type: 'numeric', headerClassName: 'dark:text-black'},
        {title: 'Expiry', field:'Expiry',  headerClassName: 'dark:text-black'},
      
        {title: 'Status', field:'Status',  headerClassName: 'dark:text-black'},
        {title: 'Action', field:'Action',  headerClassName: 'dark:text-black', 
    
    
  render: (params) =>  
    
  <>
   
   <DeleteButton {...params} />

    </>


}
      
      ]

  const DeleteButton = ({ id }) => (
    <IconButton style={{ color: '#8B0000' }}>
      <DeleteIcon />
    </IconButton>
  );



  return (
    <>

    
    <div>
            
    <div className='text-end '>
  <input type="search"  className='bg-transparent border-y-[-2]    dark:focus:border-gray-400 focus:border-black focus:border-[3px] focus:shadow 
   focus:ring-black p-3 sm:w-[900px] rounded-md ' placeholder='search......'/>
</div>
<MaterialTable columns={columns}

title='Hotspot Subscriptions'

// data={rows}

actions={[
 {
  icon: ()=> <AddIcon/>,
    isFreeAction: true,
    tooltip: 'Add Subscription'
  
  


 }
]}
options={{
  sorting: true,
  pageSizeOptions:[2, 5, 10, 20, 25, 50, 100],
  pageSize: 20,
  paginationPosition: 'bottom',
exportButton: true,
exportAllData: true,
selection: true,
search: false,
searchAutoFocus: true,
showSelectAllCheckbox: false,
showTextRowsSelected: false,

hover: true, 
paginationType: 'stepped',



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

export default HotspotSubscriptions





