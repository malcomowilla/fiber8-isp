import DeleteIcon from '@mui/icons-material/Delete';
import { IconButton } from '@mui/material';
// import {useState} from 'react'
// import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';


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





const PPPOEpackages = () => {

  const DeleteButton = ({ id }) => (
        <IconButton style={{ color: '#8B0000' }}>
          <DeleteIcon />
        </IconButton>
      );


  const EditButton = ({ id }) => (
    <Link to='/layout/edit-package'>
    <IconButton style={{color: 'black'}} >
      <EditIcon />
    </IconButton>
    </Link>
  );
const columns = [
  {title: 'Speed(Up/Down)', field: 'Speed',   defaultSort: 'asc', },
  {title: 'Name', field: 'Name',  defaultSort: 'asc'},
  {title: 'Price', field: 'Price', type: 'currency', currencySetting:{currencyCode: 'KES', 
  minimumFractionDigits: 0},  defaultSort: 'asc'},
  {title: 'Validity', field: 'Validity', type: 'numeric',  align: 'right'},
  {title: 'Action', field:'Action', align: 'right',

  render: (params) =>  
    
     <>
      
       <DeleteButton {...params} />
       <EditButton {...params}/>
      
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
      
      title='PPPoe Packages'
      
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

export default PPPOEpackages



// const PPPOEpackages = () => {
//   const [data, setData] = useState(rows);


//   const { theme, seeSidebar


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
//     { field: 'Speed', headerName: 'Speed(Up/Down)', width: 130 , headerClassName: theme ? 'dark:text-black' : ''},
//     { field: 'Price', headerName: 'Price', width: 130 ,  headerClassName: theme ? 'dark:text-black' : ''},
//     {
//       field: 'Validity',
//       headerName: 'Validity',
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

//     <div className='  flex justify-center font-mono mt-[150px]'>
//  <div className={`w-full  h-full  font-mono   
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
//         options={{
//           search: true
//         }}
//       />
      
      
//       </div>

//     </div>
   
//   )
// }

// export default PPPOEpackages