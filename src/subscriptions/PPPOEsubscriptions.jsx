
import MaterialTable from 'material-table'


import { ThemeProvider, createTheme } from '@mui/material';


import EditIcon from '@mui/icons-material/Edit';



import { IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

import {EditSubscription} from '../edit/EditSubscription'



const rows = [
  {  Speed: '4M/4M', Name: 'Makena', Price: 1500, Validity: 30 },
  {  Speed: '10M/10M', Name: 'Jane', Price: 4000, Validity: 30 },
  {  Speed: '4M/4M', Name: 'Andrew', Price: 1500, Validity: 30 },
  {  Speed: '10M/10M', Name: 'Jemo', Price: 4000, Validity: 30 },
  {  Speed: '4M/4M', Name: 'James', Price: 1500, Validity: 30 },
  {  Speed: '10M/10M', Name: 'Jeane', Price: 4000, Validity: 30 },
  {  Speed: '4M/4M', Name: 'Oscar', Price: 1500, Validity: 30 },
  {  Speed: '10M/10M', Name: 'Silky', Price: 4000, Validity: 30 },
];





const PPPOEsubscriptions = () => {

    const columns = [
        {title: 'Name', field: 'Name', headerClassName: 'dark:text-black ', defaultSort: 'asc'},
        {title: 'RefNo', field: 'RefNo',  headerClassName: 'dark:text-black' ,  sorting: true, defaultSort: 'asc'},
      
        {title: 'Phone', field: 'Phone',  headerClassName: 'dark:text-black'},
        {title: 'Package', field: 'Package', type: 'numeric', headerClassName: 'dark:text-black'},
        {title: 'Last Subscribed', field:'Last Subscribed',  headerClassName: 'dark:text-black'},
        {title: 'Expiry', field:'Expiry',  headerClassName: 'dark:text-black'},
      
        {title: 'Status', field:'Status',  headerClassName: 'dark:text-black'},
        {title: 'Action', field:'Action',  headerClassName: 'dark:text-black', 
    
    
  render: (params) =>  
    
  <>
   
   <DeleteButton {...params} />
   <EditSubscription/>

    </>


}
      
      ]

  const DeleteButton = ({ id }) => (
    <IconButton style={{ color: '#8B0000' }}>
      <DeleteIcon />
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
    <>

    
    <div>
           <ThemeProvider theme={defaultMaterialTheme}>

<MaterialTable columns={columns}

title='PPPoe Subcriptions'

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
    </>
  )
}

export default PPPOEsubscriptions





