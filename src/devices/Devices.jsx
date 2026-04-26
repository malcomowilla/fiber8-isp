import React from 'react';
import MaterialTable from 'material-table';
import { 
  Box, 
  Typography,
  Chip,
  IconButton,
  Tooltip,
  useTheme
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Settings as SettingsIcon,
  Wifi as WifiIcon,
  Dns as DnsIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { CircularProgress } from '@mui/material';
import { Construction, Code, Rocket, Clock } from 'lucide-react';
import { CiCircleInfo } from "react-icons/ci";
import { FaLocationDot } from "react-icons/fa6";



const Devices = () => {
  const theme = useTheme();
  const [onus, setOnus] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const navigate = useNavigate();

  // ... your existing state variables ...

  const subdomain = window.location.hostname.split('.')[0];

  const getDevices = useCallback(async () => {
    try {
      const response = await fetch('/api/onus', {
        headers: {
          'X-Subdomain': subdomain,
        },
      });
      const newData = await response.json();
      if (response.ok) {
        setOnus(newData);
      } else {
      }
    } catch (error) {
    }
  }, [subdomain]);


  
  useEffect(() => {
    getDevices();
  }, [getDevices]);

  const refreshDevice = async (id, status) => {
    try {
      setRefreshing(true);
      const response = await fetch(`/api/refresh_device/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Subdomain': subdomain,
        }
      });

      const data = await response.json();
      if (response.ok) {
        toast.success('Device refreshed successfully', {
          position: "top-center",
          duration: 6000,
        });
        if (status === 'offline') {
          toast.error('Device is offline! showing last recorded values', {
            position: "top-center",
            duration: 6000,
          });
        }
        setOnus(onus.map(item => (item.id === id ? data : item)));
      } else {
        toast.error('Failed to refresh device', {
          position: "top-center",
          duration: 6000,
        });
      }
    } catch (error) {
      toast.error('Failed to refresh device - server error', {
        position: "top-center",
        duration: 6000,
      });
    } finally {
      setRefreshing(false);
    }
  };

  const columns = [
    {
      title: 'Serial Number',
      field: 'serial_number', // Fixed typo: was 'serial_umber'
      render: rowData => (
        <Box display="flex" alignItems="center">
          <DnsIcon color="action" sx={{ mr: 1 }} />
          <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
            {rowData.serial_number}
          </Typography>
        </Box>
      )
    },
    {
      title: 'Product Class',
      field: 'product_class',
      cellStyle: {
        fontWeight: 500
      }
    },
    {
      title: 'Manufacturer',
      field: 'manufacturer',
      cellStyle: {
        fontWeight: 500
      }
    },
    {
      title: 'IP Address',
      field: 'ipAddress',
      render: rowData => (
        <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
          {rowData.ipAddress}
        </Typography>
      )
    },


    {

      title: 'Location',
      field: 'location',
      render: rowData => (
        <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
          {rowData.location && <FaLocationDot className='text-black w-5 h-5 dark:text-white
         
        '/>}
         
          {rowData.location}
        </Typography>
      )
    },
    {
      title: 'SSID',
      field: 'ssid1',
      render: rowData => (
        <Box display="flex" alignItems="center">
          <WifiIcon color="action" sx={{ mr: 1, fontSize: 18 }} />
          <Typography variant="body2">
            {rowData.ssid1}
          </Typography>
        </Box>
      )
    },
    {
      title: 'Last Inform',
      field: 'last_inform',
      render: rowData => (
        <Typography variant="body2" color="textSecondary">
          {rowData.last_inform}
        </Typography>
      )
    },
    {
      title: 'Status',
      field: 'status',
      render: rowData => (
        <Box display="flex" alignItems="center" gap={1}>
          {rowData.status === 'active' && (
            <Box sx={{ position: 'relative', width: 12, height: 12 }}>
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  backgroundColor: theme.palette.success.main,
                  animation: 'ping 1.5s cubic-bezier(0,0,0.2,1) infinite',
                  '@keyframes ping': {
                    '75%, 100%': {
                      transform: 'scale(2)',
                      opacity: 0,
                    },
                  },
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  top: 3,
                  left: 3,
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  backgroundColor: theme.palette.success.main,
                }}
              />
            </Box>
          )}
          <Chip 
            label={rowData.status.toUpperCase()}
            size="small"
            sx={{
              backgroundColor: rowData.status === 'active' 
                ? theme.palette.success.light 
                : theme.palette.error.light,
              color: 'white',
              fontWeight: 500,
              animation: rowData.status === 'active' ? 'pulse 2s infinite' : 'none',
              '@keyframes pulse': {
                '0%': {
                  boxShadow: `0 0 0 0 ${theme.palette.success.light}80`
                },
                '70%': {
                  boxShadow: `0 0 0 6px ${theme.palette.success.light}00`
                },
                '100%': {
                  boxShadow: `0 0 0 0 ${theme.palette.success.light}00`
                },
              }
            }}
          />
        </Box>
      )
    }
  ];

  return (
    <>
      <Toaster />
      
    
      <div className="flex flex-col items-center justify-center"> 
        <div className="text-6xl">🚧</div> <h1 className="text-2xl 
        font-bold mt-4">Under Development</h1> <p className="text-gray-500">This
         
        feature is still in development, You Can Experiment With It, But remember still in development</p> </div>
      <p className='bg-gradient-to-r from-green-600 via-blue-400
         to-cyan-500 bg-clip-text text-transparent font-bold text-3xl inline-block'> TR069 Device Management </p>

         <div role="alert" className="alert alert-info bg-green-500
          rounded-lg w-fit
          p-2 flex items-center gap-2 justify-center mb-3">
 <CiCircleInfo className='text-white text-xl '/>
  <span className='text-white'>The only vendor we support for now is huawei.</span>
</div>

      <MaterialTable
      title=""
        // title={<p className='bg-gradient-to-r from-green-600 via-blue-400
        //  to-cyan-500 bg-clip-text text-transparent font-bold text-3xl'>TR069 
        //  Device
        //   Management </p>}
        columns={columns}
        data={onus}
      
localization={{
                body: {
                  emptyDataSourceMessage: 'No devices found. Create your first device to get started!'
                },
               
              
              
              }}


options={{
  sorting: true,
  actionsColumnIndex: -1,
  pageSizeOptions:[2, 5, 10],
  pageSize: 10,

  
exportButton: true,
exportAllData: true,


  emptyRowsWhenPaging: false,


headerStyle:{
  fontFamily: 'bold',
  textTransform: 'uppercase'
  } ,
  
  
  fontFamily: 'mono'
}}
        actions={[
          {
            icon: () => (
              <Tooltip title="Refresh For Latest Data">
                <IconButton color="primary">
                  {refreshing ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : (
                    <RefreshIcon  sx={{color: 'green'}}/>
                  )}
                </IconButton>
              </Tooltip>
            ),
            tooltip: 'Refresh For Latest Data',
            onClick: (event, rowData) => {
              refreshDevice(rowData.id, rowData.status);
            }
          },
          {
            icon: () => <EditIcon color="success" />,
            tooltip: 'Edit Device',
            onClick: (event, rowData) => {
              // Your navigation logic here
              navigate(`/admin/onu-details?id=${encodeURIComponent(rowData.id)}&serial_number=${encodeURIComponent(rowData.serial_number)}`);
            }
          },
          {
            icon: () => <DeleteIcon color="error" />,
            tooltip: 'Delete Device',
            onClick: (event, rowData) => console.log('Delete', rowData)
          },
          {
            icon: () => <InfoIcon color="" />,
            tooltip: 'Device Details',
            onClick: (event, rowData) => console.log('Details', rowData)
          }
        ]}
      />
    </>
  );
};

export default Devices;