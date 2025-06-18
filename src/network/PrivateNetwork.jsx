
import React, { useState, useEffect } from 'react';
import MaterialTable from 'material-table';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  TextField, 
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Divider,
  Typography,
  Grid,
  IconButton,
  Tooltip,
  CircularProgress,
  Snackbar,
  Alert
} from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CloudIcon from '@mui/icons-material/Cloud';
import WarningIcon from '@mui/icons-material/Warning';
import toast, { Toaster } from 'react-hot-toast';
import { useApplicationSettings } from '../settings/ApplicationSettings';




const PrivateNetwork = () => {
  const subdomain = window.location.hostname.split('.')[0];
  const [openDialog, setOpenDialog] = useState(false);
  const [editing, setEditing] = useState(false);
  const [currentNetwork, setCurrentNetwork] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    network: '',
    subnet_mask: '24',
    private_ip: '',
    nas: ''
  });
  const [nas, setNas] = useState([]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [networkToDelete, setNetworkToDelete] = useState(null);
const {
showMenu1, setShowMenu1, showMenu2, setShowMenu2, showMenu3, setShowMenu3,
      showMenu4, setShowMenu4, showMenu5, setShowMenu5, showMenu6, setShowMenu6,
       showMenu7, setShowMenu7, showMenu8, setShowMenu8, showMenu9, setShowMenu9,
        showMenu10, setShowMenu10, showMenu11, setShowMenu11, showMenu12, setShowMenu12,

} = useApplicationSettings();
  const subnetOptions = [
    { value: '8', label: '/8 (16,777,214 hosts)' },
    { value: '16', label: '/16 (65,534 hosts)' },
    { value: '24', label: '/24 (254 hosts)' },
    { value: '32', label: '/32 (1 host)' },
    {value: '20', label: '/20 (4096 host)'},
    { value: '30', label: '/30 (2 hosts)' },
  ];

  // Fetch data from backend
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/wireguard_peers', {
        headers: { 'X-Subdomain': subdomain }
      });
      const result = await response.json();
      if (response.ok) {
        
        setData(result);
      } else {

        if (response.status === 401) {
  toast.error(result.error, {
    position: "top-center",
    duration: 4000,
  })
   setTimeout(() => {
          // navigate('/license-expired')
          window.location.href='/signin'
         }, 1900);
}
        if (response.status === 402) {
        setTimeout(() => {
          // navigate('/license-expired')
          window.location.href='/license-expired'
         }, 1800);
        
      }

        throw new Error('Failed to fetch IP networks');
      }
    } catch (error) {
      showSnackbar(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchNasRouters = async () => {
    try {
      const response = await fetch('/api/routers', {
        headers: { 'X-Subdomain': subdomain }
      });
      if (response.ok) {
        const result = await response.json();
        setNas(result);
        // setFormData(prev => ({ ...prev, nas: `"${result[0].ip_address}"` }));
        // console.log('ip',result[0].ip_address);
      }
    } catch (error) {
      console.error('Failed to fetch NAS routers:', error);
    }
  };

  useEffect(() => {
    fetchData();
    fetchNasRouters();
  }, []);

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleOpenAddDialog = () => {
    setEditing(false);
    setFormData({
      title: '',
      network: '',
      subnet_mask: '24',
      private_ip: '',
      nas: ''
    });
    setOpenDialog(true);
  };

  const handleOpenEditDialog = (rowData) => {
    setEditing(true);
    setCurrentNetwork(rowData);
    setFormData({
      title: rowData.title,
      network: rowData.network,
      subnet_mask: rowData.subnet_mask,
      nas: rowData.nas,
      private_ip: rowData.private_ip
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleInputChange = (e) => {
    console.log(e.target.value);
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const url = editing ? `/api/wireguard_peers/${currentNetwork.id}` : '/api/wireguard_peers';
      const method = editing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'X-Subdomain': subdomain
        },
        body: JSON.stringify({
          wireguard_peer: {
            ...formData,
            nas: formData.nas,
            total_ip_addresses: calculateTotalIps(formData.subnet_mask),
            client_host_range: calculateHostRange(formData.network, formData.subnet_mask),
            private_ip: formData.private_ip
          }
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.errors?.join(', ') || 'Request failed');
      }

      showSnackbar(
        editing ? 'Network updated successfully' : 'Network created successfully'
      );
      fetchData(); // Refresh data
      setOpenDialog(false);
    } catch (error) {
      showSnackbar(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/ip_networks/${id}`, {
        method: 'DELETE',
        headers: { 'X-Subdomain': subdomain }
      });

      if (!response.ok) {
        throw new Error('Failed to delete network');
      }

      showSnackbar('Network deleted successfully');
      fetchData(); // Refresh data
    } catch (error) {
      showSnackbar(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const calculateHostRange = (network, subnet) => {
    try {
      const ip = new IPAddress(`${network}/${subnet}`);
      return `${ip.first_host()} - ${ip.last_host()}`;
    } catch {
      return 'Invalid network';
    }
  };

  const calculateTotalIps = (subnet) => {
    if (subnet === '8') return 16777214;
    if (subnet === '16') return 65534;
    if (subnet === '24') return 254;
    if (subnet === '30') return 2;
    return 0;
  };

  const handleDeleteClick = (id) => {
    setNetworkToDelete(id);
    setDeleteConfirmOpen(true);
  };


  const handleDeleteCancel = () => {
    setDeleteConfirmOpen(false);
    setNetworkToDelete(null);
  };


  const handleDeleteConfirm = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/ip_networks/${networkToDelete}`, {
        method: 'DELETE',
        headers: { 'X-Subdomain': subdomain }
      });

      if (!response.ok) {
        throw new Error('Failed to delete network');
      }

      showSnackbar('Network deleted successfully');
      fetchData(); // Refresh data
    } catch (error) {
      showSnackbar(error.message, 'error');
    } finally {
      setLoading(false);
      setDeleteConfirmOpen(false);
      setNetworkToDelete(null);
    }
  };
  return (
    <>
    <Toaster />
    <div 
    onClick={() =>{
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
      <Typography
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
       variant="h4" gutterBottom sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
        <CloudIcon sx={{ mr: 2, color: 'primary.main' }} />
        <p className='roboto-condensed'>Private Networks Management </p>
      </Typography>

      <MaterialTable
        title=""
        columns={[
          { title: <p className='text-sm text-black'>AllowedIps</p>, field: 'allowed_ips' },
          { title: <p className='text-sm text-black'>Private IP </p>, field: 'private_ip' 
          },

        ]}
        data={data}
        isLoading={loading}
        actions={[
          {
            icon: () => (
              <Tooltip title="Add Private Network">
                <IconButton color="primary">
                  <AddCircleIcon fontSize="large" />
                </IconButton>
              </Tooltip>
            ),
            tooltip: 'Add Private Network',
            isFreeAction: true,
            onClick: handleOpenAddDialog
          },
          {
            icon: () => <EditIcon color="primary" />,
            tooltip: 'Edit Network',
            onClick: (event, rowData) => handleOpenEditDialog(rowData)
          },
          {
            icon: () => <DeleteIcon color="error" />,
            tooltip: 'Delete Network',
            // onClick: (event, rowData) => handleDelete(rowData.id)
            onClick: (event, rowData) => handleDeleteClick(rowData.id)
          }
        ]}
        options={{
          actionsColumnIndex: -1,
          pageSize: 10,
          pageSizeOptions: [10],
          showTitle: false,
          headerStyle: {
            backgroundColor: '#f5f5f5',
            fontWeight: 'bold'
          }
        }}
      />




      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onClose={handleDeleteCancel}>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center' }}>
          <WarningIcon color="warning" sx={{ mr: 1 }} />
          Confirm Deletion
        </DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this private network?</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={handleDeleteCancel} 
            variant="outlined" 
            startIcon={<DeleteIcon />}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleDeleteConfirm} 
            variant="contained" 
            color="error"
            startIcon={<WarningIcon />}
            disabled={loading}
          >
            {loading ? <CircularProgress size={20} /> : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>



      {/* Add/Edit Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ bgcolor: 'primary.main', color: 'white' }}>
          {editing ? 'Edit Private Network' : 'Add Private Network'}
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              {/* <TextField
              sx={{mt: 2}}
                fullWidth
                label="Title"
                name="title"
                className='myTextField'
                value={formData.title}
                onChange={handleInputChange}
                required
              /> */}
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Private Ip"
                name="private_ip"
                  className='myTextField'
                value={formData.private_ip}
                onChange={handleInputChange}
                placeholder="e.g., 10.0.0.1"
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Subnet Mask</InputLabel>
                <Select
                  name="subnet_mask"
                    className='myTextField'
                  value={formData.subnet_mask}
                  onChange={handleInputChange}
                  label="Subnet Mask"
                  required
                >
                  {subnetOptions.map(option => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            {/* <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>NAS Router</InputLabel>
                <Select
                  name="nas"
                  value={formData.nas}
                  onChange={handleInputChange}
                  // onChange={(e) => {
                  //   const selectedNas = nas.find(n => n.id === e.target.value);
                  //   setFormData(prev => ({ ...prev, nas: selectedNas }));
                  // }}
                  label="NAS Router"
                  required
                >
                  {nas.map(nas => (
                    <MenuItem key={nas.id} value={nas.name}>
                      {nas.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid> */}
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              {/* <Typography variant="subtitle1" color="text.secondary">
                Network Details:
              </Typography> */}
              {/* <Typography>
                <strong>Total IP Addresses:</strong> {calculateTotalIps(formData.subnet_mask)}
              </Typography> */}
              {/* <Typography>
                <strong>Client Host Range:</strong> {calculateHostRange(formData.network, formData.subnet_mask)}
              </Typography> */}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleCloseDialog} variant="outlined" color="secondary">
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained" 
            color="primary"
            disabled={loading || !formData.subnet_mask || !formData.private_ip}
            startIcon={loading && <CircularProgress size={20} />}
          >
            {editing ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
      >
        <Alert 
          severity={snackbar.severity}
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
      </div>
    </>
  );
};

// Simple IPAddress class - replace with a proper library in production
class IPAddress {
  constructor(cidr) {
    const [ip, mask] = cidr.split('/');
    this.ip = ip;
    this.mask = parseInt(mask, 10);
  }
  
  first_host() {
    const octets = this.ip.split('.').map(Number);
    octets[3] += 1;
    return octets.join('.');
  }
  
  last_host() {
    const octets = this.ip.split('.').map(Number);
    const hostBits = 32 - this.mask;
    if (hostBits >= 8) {
      octets[3] = 254;
    } else {
      octets[3] = (1 << (8 - hostBits)) - 2;
    }
    return octets.join('.');
  }
}

export default PrivateNetwork;