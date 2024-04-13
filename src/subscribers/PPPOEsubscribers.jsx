

import MaterialTable from 'material-table'
import DeleteIcon from '@mui/icons-material/Delete';


import { ThemeProvider, createTheme } from '@mui/material';


import EditIcon from '@mui/icons-material/Edit';

import { IconButton } from '@mui/material';




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


  const columns = [
    {title: 'Name', field: 'Name', headerClassName: 'dark:text-black ', defaultSort: 'asc'},
    {title: 'RefNo', field: 'RefNo',  headerClassName: 'dark:text-black' ,  sorting: true, defaultSort: 'asc'},
  
    {title: 'Phone', field: 'Phone',  headerClassName: 'dark:text-black'},
    {title: 'Package', field: 'Package', type: 'numeric', headerClassName: 'dark:text-black'},
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
    <IconButton style={{color: 'black'}} >
      <EditIcon />
    </IconButton>
  );
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
    <div>
           <ThemeProvider theme={defaultMaterialTheme}>

<MaterialTable columns={columns}

title='PPPoe Subcribers'

data={rows}


options={{
  sorting: true,
  filtering: true,
  pageSizeOptions:[2, 5, 10, 20, 25, 50, 100],
  pageSize: 20,
  paginationPosition: 'top',
exportButton: true,
exportAllData: true,
selection: true,

rowStyle:{
  backgroundColor: 'grey'
}
}}



/>

</ThemeProvider>
    </div>
  )
}

export default PPPOEsubscribers















// import { IconButton } from '@mui/material';
// import {useState} from 'react'
// import EditIcon from '@mui/icons-material/Edit';
// import {Link} from 'react-router-dom'

// import { useContext} from 'react'
// import {ApplicationContext} from '../context/ApplicationContext'

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



// const PPPOEsubscribers = () => {
//   const [data, setData] = useState(rows);


//   const { theme


//   } = useContext(ApplicationContext);
    
//   const handleDelete = (id) => {
//     const updatedRows = data.filter((row) => row.id !== id);
//     setData(updatedRows);
//   };

//   const DeleteButton = ({ id }) => (
//     <IconButton onClick={() => handleDelete(id)} style={{ color: 'red' }}>
//       <DeleteIcon />
//     </IconButton>
//   );



//   const EditButton = ({ id }) => (
//     <Link to='/layout/edit-package'>
//     <IconButton style={{color: 'green'}} >
//       <EditIcon />
//     </IconButton>
//     </Link>
//   );
//   const columns = [
//     { field: 'id', headerName: 'id', width: 70 , color: 'black', headerClassName: theme ? 'dark:text-black' : ''},
//     { field: 'Package', headerName: 'Package', width: 130 , headerClassName: theme ? 'dark:text-black' : ''},
//     { field: 'Online', headerName: 'Online', width: 130 ,  headerClassName: theme ? 'dark:text-black' : ''},
//     {
//       field: 'Phone_number',
//       headerName: 'Phone_number`',
//       type: 'number',
//       width: 90,
//       headerClassName: theme ? 'dark:text-black' : ''
//     },
   
//     {
//       field: 'Name',
//       headerName: 'Name',
//       width: 90,
//       editable: true,
//       headerClassName: theme ? 'dark:text-black' : ''
//     },


//     {
//         field: 'Expires On',
//         headerName: 'Expires On',
//         width: 90,
//         editable: true,
//         headerClassName: theme ? 'dark:text-black' : ''
//       },




//     {
//         field: 'Last Renewed',
//         headerName: 'Last Renewed',
//         width: 90,
//         editable: true,
//         headerClassName: theme ? 'dark:text-black' : ''
//       },
//     { field: 'Action',
//     headerClassName: theme ? 'dark:text-black' : '',
//     headerName: 'Action', sortable: false, width: 160, renderCell: (params) =>  
    
//     <>
    
//     <DeleteButton {...params} />
//     <EditButton {...params} />

    
//     </>
//      },
 
//   ];
//   return (

//     <div className=' relative max-sm:right-20  flex justify-center items-center font-mono '>
//  <div className={`w-[85vw] h-full mt-4  font-mono  flex-initial 
//  ${theme ? 'dark:text-black' : ''}
 
 
//  `}>
  
//  <DataGrid

//  className={`dark:text-white`}
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

//     </div>
   
//   )
// }

// export default PPPOEsubscribers