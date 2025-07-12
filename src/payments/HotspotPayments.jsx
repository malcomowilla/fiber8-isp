


import DeleteIcon from '@mui/icons-material/Delete';
import { IconButton } from '@mui/material';

import EditIcon from '@mui/icons-material/Edit';
import  EditPayment from '../edit/EditPayment'

import AddIcon from '@mui/icons-material/Add';

import MaterialTable from 'material-table'




const rows = [
  {  Speed: '4M/4M', Name: '4MBPS', Price: 1500, Validity: 30 },
  {  Speed: '10M/10M', Name: '10MBPS', Price: 4000, Validity: 30 },
  {  Speed: '4M/4M', Name: '4MBPS', Price: 1500, Validity: 30 },
  {  Speed: '10M/10M', Name: '10MBPS', Price: 4000, Validity: 30 },
  {  Speed: '4M/4M', Name: '4MBPS', Price: 1500, Validity: 30 },
  {  Speed: '10M/10M', Name: '10MBPS', Price: 4000, Validity: 30 },
  {  Speed: '4M/4M', Name: '4MBPS', Price: 1500, Validity: 30 },
  {  Speed: '10M/10M', Name: '10MBPS', Price: 4000, Validity: 30 },
  // Add more rows as needed
];





const HotspotPayments = () => {

  const DeleteButton = ({ id }) => (
        <IconButton style={{ color: '#8B0000' }}>
          <DeleteIcon />
        </IconButton>
      );


  const EditButton = ({ id }) => (
    <IconButton style={{color: 'black'}} >
      <EditIcon />
    </IconButton>
  );
const columns = [
  {title: 'Confirmation Code', field: 'Confirmation Code',   },
  {title: 'Paybill', field: 'Paybill',  },
  {title: 'Ref No', field: 'Ref No', type:'numeric',  defaultSort: 'asc'},
  {title: 'Phone', field: 'Phone', type: 'numeric', align: 'left'},
  {title: 'Name', field: 'Name', defaultSort: 'asc'  },
  {title: 'Amount', field: 'Amount', defaultSort: 'asc', type: 'numeric', align: 'left'  },
  {title: 'Redeemed', field: 'Redeemed',   },
  {title: 'Transaction Time', field: 'Transaction Time', type: 'date'   },


  {title: 'Action', field:'Action', align: 'right',

  render: (params) =>  
    
     <>
      
       <DeleteButton {...params} />


       <EditPayment/>
       </>


}


]



  return (
    <div className=''>
                    
<div className='text-end '>
  <input type="search"  className='bg-transparent border-y-[-2]    dark:focus:border-gray-400
   focus:border-black focus:border-[3px] focus:shadow 
   focus:ring-black p-3 sm:w-[900px] rounded-md ' placeholder='search......'/>
</div>
      <MaterialTable columns={columns}
      
      title='Hotspot Payments'
      
      data={rows}

      
    


      actions={[
        {
          icon: () => <AddIcon  />,
          isFreeAction: true, // This makes the action always visible
          tooltip: 'Add Package',
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
  )
}

export default HotspotPayments








