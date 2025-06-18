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
import toast,{  Toaster } from 'react-hot-toast';
import {useApplicationSettings} from '../settings/ApplicationSettings'







const Nodes = () => {

  const [open, setOpen] = useState(false);
  const [nodes, setNodes] = useState([])
  const [search, setSearch] = useState('')
  const [searchInput] = useDebounce(search, 1000)

  const [name, setName] = useState('');
  const [position, setPosition] = useState(null);
  const [mapReady, setMapReady] = useState(false);
  const [nodeId, setNodeId] = useState('');

  const {showMenu1, setShowMenu1, showMenu2, setShowMenu2, showMenu3, setShowMenu3,
      showMenu4, setShowMenu4, showMenu5, setShowMenu5, showMenu6, setShowMenu6,
       showMenu7, setShowMenu7, showMenu8, setShowMenu8, showMenu9, setShowMenu9,
        showMenu10, setShowMenu10, showMenu11, setShowMenu11, showMenu12, setShowMenu12,} = useApplicationSettings();
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
    <IconButton style={{color: 'green'}} onClick={handleClickOpen} >
      <EditIcon />
    </IconButton>
  );

  const handleRowClick = (event, rowData) => {
    console.log('rowData node',rowData)
    // setPosition(rowData?.latitude, rowData?.longitude)
    setName(rowData?.name)
    setNodeId(rowData?.id)
  }

  const createNode = async(e) => {
    e.preventDefault();

    try {

      const url = nodeId ? `/api/nodes/${nodeId}` : '/api/nodes';
      const method = nodeId ? 'PATCH' : 'POST';
      const response = await fetch(`${url}`, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'X-Subdomain': subdomain,
        },
        body: JSON.stringify({ name, position }),
      });
      if (response.ok) {
        setOpen(false)


const newData = await response.json()
        if (nodeId) {
          setNodes(nodes.map(item => (item.id === nodeId ? newData : item)))

          toast.success('Node updated successfully', {
            position: "top-center",
            duration: 4000,
            
          })
        } else {
          
          setNodes([...nodes, newData])
          toast.success('Node created successfully', {
            position: "top-center",
            duration: 4000,
            
          })
        }
      }
    } catch (error) {
      
    }


  }

const subdomain = window.location.hostname.split('.')[0];

  const getNodes = useCallback(
    async() => {
     
      
      try {
        const response = await fetch('/api/nodes', {
          headers: { 'X-Subdomain': subdomain },
        });
        const data = await response.json();
        if (response.ok) {
          setNodes(data)
          
        } else {
          

        }
      } catch (error) {
        
      }
    },
    [],
  )
  

  useEffect(() => {
    getNodes()
   
  }, [getNodes]);

const columns = [
    {title: 'Name', field: 'name',  },

  {title: 'Latitude', field: 'latitude',    },
  {title: 'Longitude', field: 'longitude',    },

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
    <Toaster />
    <div className=''
    onClick={() => {
      setShowMenu1(false)
      setShowMenu2(false)
      setShowMenu3(false)
      setShowMenu4(false) 
      setShowMenu5(false)
      setShowMenu6(false)
      setShowMenu7(false)
      setShowMenu8(false)
      setShowMenu9(false)
      setShowMenu10(false)
      setShowMenu11(false)  
      setShowMenu12(false)
    }}
    >
         <EditNode  open={open} handleClose={handleClose}
         name={name} setName={setName} position={position} setPosition={setPosition}
         mapReady={mapReady} setMapReady={setMapReady}
         createNode={createNode}
         />
       
       


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
      
       data={nodes}

      onRowClick={handleRowClick}
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
       pageSizeOptions:[5, 10],
       pageSize: 10,
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

