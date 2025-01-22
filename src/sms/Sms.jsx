
import DeleteIcon from '@mui/icons-material/Delete';
import { IconButton } from '@mui/material';
// import {useState} from 'react'
// import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
// import  EditPayment from '../edit/EditPayment'
import {useState, lazy, Suspense} from 'react'

const EditPayment = lazy(() => import('../edit/EditPayment'))

// import {Link} from 'react-router-dom'
import UiLoader from '../uiloader/UiLoader'

// import { useContext} from 'react'
// import {ApplicationContext} from '../context/ApplicationContext'


import MaterialTable from 'material-table'

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






