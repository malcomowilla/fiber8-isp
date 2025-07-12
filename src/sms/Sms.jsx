
import DeleteIcon from '@mui/icons-material/Delete';
import { IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import {lazy, Suspense} from 'react'

const EditPayment = lazy(() => import('../edit/EditPayment'))

import UiLoader from '../uiloader/UiLoader'
import MaterialTable from 'material-table'


const Sms = () => {

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
  {title: 'Message', field: 'Message',   },
  {title: 'Date', field: 'Date', type:'date'  },
  {title: 'Recipients', field: 'Recipients',   align: 'left'},
  {title: 'Status', field: 'Status' },
  


  {title: 'Action', field:'Action', align: 'right',

  render: (params) =>  
    
     <>
      
       <DeleteButton {...params} />


       <EditPayment/>
       </>


}


]



  return (
    <Suspense fallback={<div className='flex justify-center items-center '>{ <UiLoader/> }</div>}>

    <div className=''>

      <MaterialTable columns={columns}
      
      title='SMS'
      
    //   data={rows}

      
    


options={{
       pageSizeOptions:[5, 10, 20, 25, 50, 100],
       pageSize: 20,
       search: true,
searchFieldStyle: {
  borderColor: 'red'
},
searchAutoFocus: true,



selection: true,



paginationPosition: 'bottom',
exportButton: true,
exportAllData: true,

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
    
    </Suspense>
  )
}

export default Sms






