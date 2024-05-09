import DeleteIcon from '@mui/icons-material/Delete';
// import {useState} from 'react'
// import { DataGrid, GridToolbar } from '@mui/x-data-grid';

import EditIcon from '@mui/icons-material/Edit';

import { IconButton } from '@mui/material';
import GetAppIcon from '@mui/icons-material/GetApp';
import {Link} from 'react-router-dom'
import {  useState} from 'react'
import {ApplicationContext} from '../context/ApplicationContext'

import AddIcon from '@mui/icons-material/Add';

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





const HotspotPackage = () => {


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
    {title: 'Name', field: 'Name',  defaultSort: 'asc'},
    {title: 'Size', field: 'Size',  type: 'numeric', align: 'left'},

  {title: 'Speed(Up/Down)', field: 'Speed',   defaultSort: 'asc', },
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

  return (
    <div className=''>
            
            <div className='text-end '>
  <input type="search"  className='bg-transparent border-y-[-2]    dark:focus:border-gray-400 focus:border-black focus:border-[3px] focus:shadow 
   focus:ring-black p-3 sm:w-[900px] rounded-md ' placeholder='search......'/>
</div>
      <MaterialTable columns={columns}
      
      title='Hotspot Package'
      
    //   data={rows}

      
    actions={[
        {
          icon:()=><GetAppIcon/>,
          tooltip: 'import'
        },
        {
          icon: () => <AddIcon  />,
          isFreeAction: true, // This makes the action always visible
          tooltip: 'Add Hotspot Package'
        }
    ]}


options={{
        paging: true,
       pageSizeOptions:[5, 10, 20, 25, 50, 100],
       pageSize: 20,
       search: false,
searchFieldStyle: {
  borderColor: 'red'
},
searchAutoFocus: true,
showSelectAllCheckbox: false,
showTextRowsSelected: false,

selection: true,
paginationType: 'stepped',

// rowStyle:{
//   backgroundColor: 'dark'
// },

paginationPosition: 'bottom',
exportButton: true,
exportAllData: true,
exportFileName: 'PPPOE packages',

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

export default HotspotPackage

