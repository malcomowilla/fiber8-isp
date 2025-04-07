import DeleteIcon from '@mui/icons-material/Delete';
// import {useState} from 'react'
// import { DataGrid, GridToolbar } from '@mui/x-data-grid';

import EditIcon from '@mui/icons-material/Edit';

import { IconButton } from '@mui/material';
import GetAppIcon from '@mui/icons-material/GetApp';
import AddIcon from '@mui/icons-material/Add';

import {Link} from 'react-router-dom'
import {  useState, useEffect, useCallback} from 'react'
import {ApplicationContext} from '../context/ApplicationContext'
import EditNode from '../edit/EditNode'
import MaterialTable from 'material-table'
import { FaCircleNodes } from "react-icons/fa6";
import { useDebounce } from 'use-debounce';








const Nodes = () => {

  const [open, setOpen] = useState(false);
  const [nodes, setNodes] = useState([])
  const [search, setSearch] = useState('')
  const [searchInput] = useDebounce(search, 1000)



  const handleClickOpen = () => {
      setOpen(true);
    };
    
    const handleClose = () => {
      setOpen(false);
    };

  const DeleteButton = ({ id }) => (
        <IconButton style={{ color: '#8B0000' }}>
          <DeleteIcon />
        </IconButton>
      );


  const EditButton = () => (
    <IconButton style={{color: 'black'}} onClick={handleClickOpen} >
      <EditIcon />
    </IconButton>
  );
const columns = [
    {title: 'Name', field: 'Name',  },

  {title: ' Code', field: ' Code',    },
  {title: ' Type', field: ' Type',    },
  {title: ' Zone', field: ' Zone',    },

  {title: 'Action', field:'Action', align: 'right',

  render: (rowData) =>  
    
     <>
      
       <DeleteButton id={rowData.id} />
       <EditButton />
      
       </>


}


]

  return (
    <>
    <div className=''>
         <EditNode  open={open} handleClose={handleClose}/>
       
       


         <div className="flex items-center max-w-sm mx-auto p-3">   
    <label htmlFor="simple-search" className="sr-only">Search</label>
    <div className="relative w-full">
        <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            {/* <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true"
             xmlns="http://www.w3.org/2000/svg"
             fill="none" viewBox="0 0 18 20">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                 strokeWidth="2" d="M3 5v10M3 5a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm0 10a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm12 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm0 0V6a3 3 0 0 0-3-3H9m1.5-2-2 2 2 2"/>
            </svg> */}

            <FaCircleNodes className='text-black'/>
            
        </div>
        <input type="text" value={search} onChange={(e)=> setSearch(e.target.value)}
         className="bg-gray-50 border border-gray-300 text-gray-900 
        text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full ps-10 p-2.5 
          dark:border-gray-600 dark:placeholder-gray-400 dark:text-black
          dark:focus:ring-green-500 dark:focus:border-green-500" placeholder="search for nodes..."  />
    </div>
    
    <button type="" className="p-2.5 ms-2 text-sm font-medium text-white bg-green-700 
    rounded-lg border border-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none
     focus:ring-green-300 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">
        <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
             strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
        </svg>
        <span className="sr-only">Search</span>
    </button>
</div>





      <MaterialTable columns={columns}
      
      title='Nodes'
      
    //   data={rows}

      
    actions={[

      {
        icon: () => <AddIcon onClick={handleClickOpen} />,
        isFreeAction: true, // This makes the action always visible
        tooltip: <p className='text-sm'>Add Node</p>
      },
        {
          icon:()=><GetAppIcon/>,
          tooltip: <p className='text-sm'>Import</p>,
          isFreeAction: true
        }
    ]}


options={{
        paging: true,
       pageSizeOptions:[5, 10, 20],
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
exportFileName: 'Nodes'
}}     
      
      
      
      
      />

    </div>
    </>
  )
}

export default Nodes

