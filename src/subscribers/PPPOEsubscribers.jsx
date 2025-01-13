

import MaterialTable from 'material-table'
import DeleteIcon from '@mui/icons-material/Delete';

import EditIcon from '@mui/icons-material/Edit';

import { IconButton } from '@mui/material';

import AddIcon from '@mui/icons-material/Add';
import {useState, useMemo,useEffect} from'react'
import EditSubscriber from '../edit/EditSubscriber'
import dayjs from 'dayjs';
import SubscriberNotification from '../notification/SubscriberNotification'

import { useApplicationSettings } from '../settings/ApplicationSettings';

// import Autocomplete from '@mui/material/Autocomplete';



const PPPOEsubscribers = () => {
  const { settingsformData } = useApplicationSettings();

  const intialValue = {
    name: '',
    phone_number: '',
    ppoe_username: '',
    ppoe_password: '',
    ref_no: '',
    package_name: '',
    installation_fee: '',
    subscriber_discount: '',
    second_phone_number: '',
    date_registered: dayjs(),
    email: '',
    router_name: '',
    check_update_username: settingsformData.check_update_username,
    check_update_password: settingsformData.check_update_password
    

  }
  const [open, setOpen] =useState(false);
const [formData,  setFormData] = useState(intialValue)
const [tableData, setTableData] = useState([])
const [loading, setloading] = useState(false)
const [savedNotification, setSavedNotification] = useState(false)

  const handleClickOpen = () => {
    setOpen(true);
    setFormData(intialValue)

  };

  const handleClose = () => {
    setOpen(false);

  };


  const handleChange = (e)=> {

    const {id, value} = e.target
    setFormData({...formData, [id]: value})
  }


  const handleRowClick = (event, rowData) => {
    console.log('subscribers',rowData)
   

setFormData({
  ...rowData,
  date_registered: dayjs(rowData.date_registered), 

});


  }


  const fetchSubscribers = useMemo(() => async ()=> {
  


    try {
      const response = await fetch('/api/subscribers',{
    
      }
    
    
    )
    
      const newData = await response.json()
    if (response.ok) {
      setTableData(newData)
  
    } else {
      console.log('failed to fetch routers')
  
    }
    
    } catch (error) {
      
      console.log(error)
    
    }
    
    
    }, [])
    
  
  
  
    useEffect(() => {
      
      fetchSubscribers()
    }, [fetchSubscribers]);
  
  



  const createSubscriber = async (e) => {
e.preventDefault()
    try {
      setloading(true)
      const url = '/api/subscriber'
      const method = 'POST'

      const response = await fetch(url, {
        method,
        headers: {
"Content-Type" : "application/json"
        },
        body: JSON.stringify(formData)
      }
    )


    const newData = await response.json()


if (response.ok) {
  setOpen(false)
  setTableData([...tableData, newData])
  setloading(false)
  setSavedNotification(true)
  setTimeout(() => {
    setSavedNotification(false)

  }, 10000);
  
} else {
  console.log('failed to fetch')
  setloading(false)
}
    } catch (error) {
      console.log(error)
      setloading(false)
    }

  }
  const columns = [
    {title: 'name', field: 'name', headerClassName: 'dark:text-black ', defaultSort: 'asc'},
    {title: 'ref_no', field: 'ref_no',  headerClassName: 'dark:text-black' ,  sorting: true, defaultSort: 'asc'},
  
    {title: 'phone_number', field: 'phone_number',  headerClassName: 'dark:text-black'},
    {title: 'package_name', field: 'package_name', type: 'numeric', headerClassName: 'dark:text-black', align: 'left'},
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
  const EditButton = () => (
    <IconButton style={{color: 'black'}} onClick={handleClickOpen} >
      <EditIcon />
    </IconButton>
  )

  return (
    <div>
<EditSubscriber  isloading={loading}   packageName={formData.package_name} 
  open={open} handleClose={handleClose}  formData={formData}  setFormData={setFormData}  createSubscriber={createSubscriber} 
handleChangeForm={handleChange}
        
            />
             
<div className='text-end '>
  <input type="search"  className='bg-transparent border-y-[-2]    dark:focus:border-gray-400 focus:border-black focus:border-[3px] focus:shadow 
   focus:ring-black p-3 sm:w-[900px] rounded-md ' placeholder='search......'/>
</div>
<MaterialTable columns={columns}
data={tableData}
title='PPPoe Subcribers'

onRowClick={(event, rowData)=>handleRowClick(event, rowData)}

icons={{
  Add: () => <AddIcon onClick={handleClickOpen} />,
}}
actions={[
  {
    icon: () => <AddIcon onClick={handleClickOpen} />,
    isFreeAction: true, // This makes the action always visible
    tooltip: 'Add Subscribers',
  },
  
]}

options={{
  sorting: true,
  pageSizeOptions:[2, 5, 10, 20, 25, 50, 100],
  pageSize: 10,
  paginationPosition: 'bottom',
exportButton: true,
exportAllData: true,
selection: true,
search:false,
searchAutoFocus: true,
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

<div>{savedNotification && <SubscriberNotification/>}</div>
    </div>
  )
}

export default PPPOEsubscribers














