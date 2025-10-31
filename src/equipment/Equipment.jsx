import React from 'react';
import MaterialTable from 'material-table';
import {
  AddBox,
  Search,
  Clear,
  Edit,
  DeleteOutline,
  Visibility,
  Router as RouterIcon,
  Storage as ServerIcon,
  Hub as SwitchIcon
} from '@mui/icons-material';
import { Typography, Box, Button } from '@mui/material';
import  EditEquipment from '../edit/EditEquipment'
import {useState, useEffect, useCallback,} from 'react'
import { GoNumber } from "react-icons/go";
import { TbRouter } from "react-icons/tb";
import toast, { Toaster } from 'react-hot-toast';
import DeleteEquipment from '../delete/DeleteEquipment'




const Equipment = () => {

// openDialog, setOpenDialog,loading, setLoading
    

  // Sample data

  const [openDialog, setOpenDialog] = useState(false)
  const [loading, setLoading] = useState(false)
  const [editing, setEditing] = useState(false)
  const [customers, setCustomers] = useState([])
  const [equipments, setEquipments] = useState([])
  const [isOpenDelete, setisOpenDelete] = useState(false)

const [customer_name, setName] = useState('')
  const [equipmentForm, setEquipmentForm] = useState({
    device_type: '',
    user: '',
    price: '',
    amount_paid: '',
    name: '',
    model: '',
    serial_number: '',
    name_of_customer: '',
  });


const onChange = (e)=> {
    setEquipmentForm({
      ...equipmentForm,
      [e.target.name]: e.target.value
    })
}



   const handleRowClick = (event, rowData)=> {
       setEquipmentForm(rowData)
       console.log('row data', rowData)
        }
  const equipmentData = [
    {
      id: 1,
      equipmentName: 'Cisco Catalyst 9300',
      type: 'Switch',
      user: 'Tech Corp Inc.',
      price: '$299/month',
      paidAmount: '$299',
      status: 'Active'
    },
    {
      id: 2,
      equipmentName: 'Juniper MX204',
      type: 'Router',
      user: 'Network Solutions',
      price: '$499/month',
      paidAmount: '$499',
      status: 'Active'
    },
    {
      id: 3,
      equipmentName: 'Dell PowerEdge R750',
      type: 'Server',
      user: 'Data Host LLC',
      price: '$799/month',
      paidAmount: '$799',
      status: 'Active'
    },
    {
      id: 4,
      equipmentName: 'HPE Aruba 2930F',
      type: 'Switch',
      user: 'Enterprise Systems',
      price: '$249/month',
      paidAmount: '$249',
      status: 'Active'
    },
  ];

  const getEquipmentIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'router':
        return <RouterIcon color="primary" />;
      case 'server':
        return <ServerIcon color="secondary" />;
      case 'switch':
        return <SwitchIcon color="action" />;
        case 'access point':
        return <TbRouter color="primary" />;

        case 'serial_number':
        return <GoNumber color="primary" />;
        // case 'other':
        // return <OtherIcon color="primary" />;
      default:
        return <RouterIcon />;
    }
  };


  const columns = [
    {
      title: 'Equipment',
      field: 'name',
      render: (rowData) => (
        <Box display="flex" alignItems="center">
          {getEquipmentIcon(rowData.device_type)}
          <Box ml={1}>{rowData.name}</Box>
        </Box>
      )
    },
    { title: 'Type', field: 'device_type' },
    { title: 'User', field: 'user' },
    { title: 'Price', field: 'price' },
    {title: 'Customer', field: 'name_of_customer'},
    { title: 'Paid Amount', field: 'amount_paid' },
    {title: 'Serial Number', field: 'serial_number', 
       render: (rowData) => (
        <Box display="flex" alignItems="center">
          {getEquipmentIcon(rowData.device_type)}
          <Box ml={1}>{rowData.serial_number}</Box>
        </Box>
      )
    },
    
   
  ];










   const subdomain = window.location.hostname.split('.')[0];
const fetchSubscribers = useCallback(
  async() => {
    
  try {
    const response = await fetch('/api/subscribers',{
      headers: {
        'X-Subdomain': subdomain,
      },
  
    }
  
  
  )
  
    const newData = await response.json()
  if (response.ok) {
    setCustomers(newData)

  } else {
    console.log('failed to fetch routers')
     if (response.status === 401) {
 
   setTimeout(() => {
          // navigate('/license-expired')
          window.location.href='/signin'
         }, 1900);
}

  }
  
  } catch (error) {
    
    console.log(error)
  
  }
  },
  [],
)



  useEffect(() => {
    
    fetchSubscribers()
  }, [fetchSubscribers]);

const getEquipment = useCallback(
  async() => {
    

    try {
      const response = await fetch('/api/equipment',{
        headers: {
          'X-Subdomain': subdomain,
        },
    
      }
    
    
    )

    if (response.ok) {
      const newData = await response.json()
      setEquipments(newData)
      
    } else {
      
    }
    } catch (error) {
      
    }
  },
  [],
)

useEffect(() => {
  
  getEquipment()
 
}, [getEquipment]);



  const handleCreateEquipment = async(e) => {

e.preventDefault()
    setLoading(true)
    try {
      const url = equipmentForm.id ? `/api/equipment/${equipmentForm.id}` : '/api/equipment';
      const method = equipmentForm.id ? 'PATCH' : 'POST';
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'X-Subdomain': subdomain
        },
        body: JSON.stringify({
          equipment: {
            ...equipmentForm,
            user: equipmentForm.user,
            device_type: equipmentForm.device_type,
            name: equipmentForm.name,
            model: equipmentForm.model,
            serial_number: equipmentForm.serial_number,
            price: equipmentForm.price,
            amount_paid: equipmentForm.amount_paid,
          }
        })
      });
const newData = await response.json()
      if (response.ok) {
       setOpenDialog(false)
        setLoading(false)
        
        if (equipmentForm.id) {
           toast.success('Equipment updated successfully', {
          position: "top-center",
          duration: 4000,
        })
          setEquipments(equipments.map(item => (item.id === equipmentForm.id ? newData : item)))
          
        } else {
          setOpenDialog(false)
           toast.success('Equipment created successfully', {
          position: "top-center",
          duration: 4000,
        })
          setEquipments([...equipments, newData])
          
        }

      } else {
        
        setLoading(false)
      }
    } catch (error) {
      setOpenDialog(false)
      setLoading(false)
    }
  }

 const deleteEquipment = async (id) => {
  try {
    setLoading(true);
    const response = await fetch(`/api/equipment/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'X-Subdomain': subdomain
      },
    });

    let newData = null;
    if (response.status !== 204) {
      newData = await response.json();
    }

    if (response.ok) {
      setisOpenDelete(false);
      toast.success('Equipment deleted successfully', {
        position: "top-center",
        duration: 4000,
      });
      setEquipments(equipments.filter(item => item.id !== equipmentForm.id));
    } else {
      toast.error('Failed to delete equipment', {
        position: "top-center",
        duration: 4000,
      });
    }
  } catch (error) {
    toast.error(`Failed to delete equipment: ${error.message}`, {
      position: "top-center",
      duration: 4000,
    });
  } finally {
    setLoading(false);
  }
};

  return (
    <div>

        <EditEquipment  openDialog={openDialog} setOpenDialog={setOpenDialog}
        editing={editing} setEditing={setEditing}
        setLoading={setLoading} loading={loading}
        onChange={onChange} customers={customers}
        setEquipmentForm={setEquipmentForm}
        equipmentForm={equipmentForm} handleCreateEquipment={handleCreateEquipment}
        />

<DeleteEquipment isOpenDelete={isOpenDelete} setisOpenDelete={setisOpenDelete}
 loading={loading} deleteEquipment={deleteEquipment} id={equipmentForm.id} />

        <Toaster />
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <div>
          <Typography variant="h4" component="h1" gutterBottom>
            <p className='bg-gradient-to-r from-green-600 via-blue-400
         to-cyan-500 bg-clip-text text-transparent inline-block'>Equipment </p>
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            All equipment including routers, switches, and servers that you have rented to your customers.
          </Typography>
        </div>
        <Button
        onClick={() => {
            setOpenDialog(true)
            setEditing(false)
            setEquipmentForm({
              user: '',
              device_type: '',
              name: '',
              model: '',
              serial_number: '',
              price: '',
              amount_paid: ''
            })
        }}
          variant="contained"
          color="success"
          startIcon={<AddBox />}
          sx={{ height: 'fit-content' }}
        >
          Add Equipment
        </Button>
      </Box>

      <MaterialTable
        title=""
        columns={columns}
        data={equipments}
        onRowClick={(event, rowData)=>handleRowClick(event, rowData)}

        options={{
          search: true,
          actionsColumnIndex: -1,
          pageSize: 5,
          pageSizeOptions: [5, 10, 20],
          showTitle: false,
          toolbar: true,
          // emptyRowsWhenPaging: false,
          // headerStyle: {
          //   backgroundColor: '#f5f5f5',
          //   fontWeight: 'bold'
          // }
        }}
        icons={{
          Search: Search,
          ResetSearch: Clear,
        }}
        actions={[
          {
            icon: () => <Visibility color="primary" />,
            tooltip: 'View Details',
            onClick: (event, rowData) => console.log('View', rowData)
          },
          {
            icon: () => <Edit
            
            color="secondary" />,
            tooltip: 'Edit Equipment',
            onClick: (event, rowData) =>  {
                setOpenDialog(true)
                setEditing(true)
                setEquipmentForm(rowData)
            }
          },
          {
            icon: () => <DeleteOutline color="error" />,
            tooltip: 'Delete Equipment',
            onClick: (event, rowData) => {
              setisOpenDelete(true)
              setEquipmentForm(rowData)
            }
          }
        ]}
      />
    </div>
  );
};

export default Equipment;