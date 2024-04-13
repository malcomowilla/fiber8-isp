

import React from 'react'

import DeleteIcon from '@mui/icons-material/Delete';
import { IconButton } from '@mui/material';
// import {useState} from 'react'
// import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import  {EditPayment} from '../edit/EditPayment'

import {Link} from 'react-router-dom'
import {useState} from 'react'
import { useContext} from 'react'
import {ApplicationContext} from '../context/ApplicationContext'


import MaterialTable from 'material-table'


import { ThemeProvider, createTheme } from '@mui/material';


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
  const defaultMaterialTheme = createTheme({
    palette: {
      primary: {
        main: '#000',
      },
      secondary: {
        main: '#000',
      },
    },
  });

  return (
    <div className=''>
                      <ThemeProvider theme={defaultMaterialTheme}>

      <MaterialTable columns={columns}
      
      title='Hotspot Payments'
      
      data={rows}

      
    


options={{
       pageSizeOptions:[5, 10, 20, 25, 50, 100],
       pageSize: 20,
       search: true,
searchFieldStyle: {
  borderColor: 'red'
},
searchAutoFocus: true,



selection: true,


rowStyle:{
  backgroundColor: 'grey'
},

paginationPosition: 'top',
exportButton: true,
exportAllData: true,

}}     
      
      
      
      
      />

</ThemeProvider>
    </div>
  )
}

export default HotspotPayments










// // import DeleteIcon from '@mui/icons-material/Delete';
// // import { IconButton } from '@mui/material';
// // import {useState} from 'react'
// // import { DataGrid, GridToolbar } from '@mui/x-data-grid';
// // import EditIcon from '@mui/icons-material/Edit';

// import { useContext} from 'react'
// import {ApplicationContext} from '../context/ApplicationContext'

// import {EditPayment} from '../edit/EditPayment'
// const rows = [
//   { id: 1, Speed: 'Snow', Name: 'Jon', Price: 35, Validity: 30   },
//   { id: 2, Speed: 'Lannister', Name: 'Cersei', Price: 42,Validity: 20, },
//   { id: 3, Speed: 'Lannister', Name: 'Jaime', Price: 45,Validity: 20  },
//   { id: 4, Speed: 'Stark', Name: 'Arya', Price: 16,Validity: 20, },
//   { id: 5, Speed: 'Targaryen', Name: 'Daenerys', Price: 13,Validity: 20, },
//   { id: 6, Speed: 'Melisandre', Name: null, Price: 150 ,Validity: 20 },
//   { id: 7, Speed: 'Clifford', Name: 'Ferrara', Price: 44, Validity: 20,},
//   { id: 8, Speed: 'Frances', Name: 'Rossini', Price: 36 ,Validity: 20,},
//   { id: 9, Speed: 'Roxie', Name: 'Harvey', Price: 65 ,Validity: 20,},



// ];



// const FixedPayments = () => {
//   const [data, setData] = useState(rows);


//   const { theme


//   } = useContext(ApplicationContext);
    
//   const handleDelete = (id) => {
//     const updatedRows = data.filter((row) => row.id !== id);
//     setData(updatedRows);
//   };

//   // const DeleteButton = ({ id }) => (
//   //   <IconButton onClick={() => handleDelete(id)} style={{ color: 'red' }}>
//   //     <DeleteIcon />
//   //   </IconButton>
//   // );



//   // const EditButton = ({ id }) => (
//   //   <IconButton style={{color: 'green'}} >
//   //     <EditIcon />
//   //   </IconButton>
//   // );
//   const columns = [
//     { field: 'id', headerName: 'id', width: 70 , color: 'black', headerClassName: 'dark:text-black font-mono' },
//     { field: 'Confirmation Code ', headerName: 'Confirmation Code', width: 130 , headerClassName: 'dark:text-black font-mono' },
//     { field: 'Paybill', headerName: 'Paybill', width: 130 ,  headerClassName:  'dark:text-black font-mono' },
//     {
//       field: 'Phone Number',
//       headerName: 'Phone Number',
//       type: 'number',
//       width: 90,
//       headerClassName: 'dark:text-black font-mono' 
//     },
   
//     {
//         field: 'Amount',
//         headerName: 'Amount',
//         type: 'number',
//         width: 90,
//         headerClassName: 'dark:text-black font-mono' 
//       },
//     {
//       field: 'Name',
//       headerName: 'Name',
//       width: 90,
//       editable: true,
//       headerClassName: 'dark:text-black font-mono' 
//     },



//     {
//         field: 'Redeemed',
//         headerName: 'Redeemed',
//         width: 90,
//         editable: true,
//         headerClassName:  'dark:text-black font-mono' 
//       },



//       {
//         field: 'Trans Time',
//         headerName: 'Trans Time',
//         width: 90,
//         editable: true,
//         headerClassName:  'dark:text-black font-mono' 
//       },

//     { field: 'Action',
//     headerClassName:  'dark:text-black font-mono' ,
//     headerName: 'Action', sortable: false, width: 160, renderCell: (params) =>  
    
//     <>
    
//     <DeleteButton {...params} />

// {/* 
// <EditButton   {...params} 
// >



//     </EditButton> */}

//     <EditPayment>
//     </EditPayment>





    
//     </>
//      },
 
//   ];

  
//   return (
// <div className=''>

//  <div className={` w-auto h-auto
//  ${theme ? 'dark:text-black' : ''}
 
 
//  `}>
        
//  <DataGrid

//  className={`dark:text-white font-mono `}
//         rows={rows}
//         columns={columns}
//         initialState={{
//           pagination: {
//             paginationModel: { page: 0, pageSize: 5},
//           },
//         }}
//         pageSizeOptions={[5, 10, 20, 30]}
//         checkboxSelection
//         components={{
//           Toolbar: GridToolbar,
//         }}
//       />
      
   
//       </div>
//       </div>

   
//   )
// }

// export default FixedPayments