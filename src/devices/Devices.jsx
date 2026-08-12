import React from 'react';
import MaterialTable from 'material-table';
import { 
  Box, 
  Typography,
  Chip,
  IconButton,
  Tooltip,
  useTheme,
  Tabs,
  Tab,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Stack
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Wifi as WifiIcon,
  Dns as DnsIcon,
  Info as InfoIcon,
  ExpandMore as ExpandMoreIcon,
  Router as RouterIcon,
   Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
    ContentCopy as ContentCopyIcon,

  MenuBook as MenuBookIcon
} from '@mui/icons-material';
import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { CircularProgress } from '@mui/material';
import { CiCircleInfo } from "react-icons/ci";
import { FaLocationDot } from "react-icons/fa6";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { useMemo } from 'react';




// TR-069 setup guides for various router/modem vendors
const tr069Guides = [
  {
    vendor: 'Huawei',
    models: 'HG8245H, HG8546M, EG8141A5, etc.',
    steps: [
      'Log in to the router admin panel (usually 192.168.100.1).',
      'Navigate to Management > TR-069 / WAN Management Protocol.',
      'Enable TR-069 / CWMP.',
      'Set ACS URL to your ACS server endpoint (e.g. https://your-acs-domain.com/acs).',
      'Enter ACS username and password provided by your ISP/ACS.',
      'Set the periodic inform interval (e.g. 300 seconds).',
      'Save and reboot the device. It should appear in the device list within a few minutes.'
    ]
  },
  {
    vendor: 'ZTE',
    models: 'F660, F609, ZXHN H108N, etc.',
    steps: [
      'Access the router GUI at 192.168.1.1.',
      'Go to Network > WAN > TR-069 Configuration.',
      'Toggle "Enable TR-069".',
      'Input the ACS URL and connection request credentials.',
      'Configure the inform interval and periodic inform enable flag.',
      'Apply settings — the modem will attempt to connect to the ACS automatically.'
    ]
  },
  {
    vendor: 'TP-Link',
    models: 'Archer series, Deco (limited support)',
    steps: [
      'Open the router admin page (192.168.0.1 or 192.168.1.1).',
      'Go to Advanced > System Tools > TR-069 (availability varies by firmware).',
      'Enable CWMP/TR-069 client.',
      'Enter the ACS URL, username, and password.',
      'Set connection request username/password (used by ACS to reach the device).',
      'Save settings and verify connectivity status shows "Connected".'
    ]
  },
  {
    vendor: 'MikroTik',
    models: 'RouterOS-based devices (via CAPsMAN/scripts)',
    steps: [
      'MikroTik does not natively support TR-069; use a third-party CWMP package or script.',
      'Install a TR-069 client package (e.g. via opkg if RouterOS supports it).',
      'Configure the client with your ACS URL and credentials via the config file.',
      'Set up a scheduled script to maintain periodic informs.',
      'Verify the device registers on your ACS dashboard.'
    ]
  },
  {
    vendor: 'Generic / Other ONUs',
    models: 'Most CPE devices supporting CWMP',
    steps: [
      'Locate the TR-069/CWMP settings, typically under WAN, Management, or Remote Management.',
      'Enable the TR-069 client.',
      'Set the ACS URL (provided by your provisioning system).',
      'Enter ACS authentication credentials.',
      'Configure periodic inform interval (recommended: 300–900 seconds).',
      'Save, reboot if required, and confirm the device appears in this dashboard.'
    ]
  }
];

const Devices = () => {
  const theme = useTheme();
  const [onus, setOnus] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);


  const subdomain = window.location.hostname.split('.')[0];





  function useIsDarkMode() {
    const [isDark, setIsDark] = useState(
      () => typeof document !== 'undefined' &&
        document.documentElement.classList.contains('dark')
    );
  
    useEffect(() => {
      const root = document.documentElement;
  
      const update = () => setIsDark(root.classList.contains('dark'));
      update();
  
      const observer = new MutationObserver(update);
      observer.observe(root, { attributes: true, attributeFilter: ['class'] });
  
      return () => observer.disconnect();
    }, []);
  
    return isDark;
  }
  
  
  
  
  const isDark = useIsDarkMode();
  
  const tableTheme = useMemo(() => createTheme({
    palette: {
      mode: isDark ? 'dark' : 'light',
      background: {
        paper: isDark ? '#1e1e1e' : '#ffffff',
        default: isDark ? '#1e1e1e' : '#ffffff',
      },
      text: {
        primary: isDark ? '#f1f1f1' : '#1a1a1a',
        secondary: isDark ? '#a3a3a3' : '#6b7280',
      },
    },
  }), [isDark]);
  
  










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
      }
    } catch (error) {}
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
      field: 'serial_number',
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
      cellStyle: { fontWeight: 500 }
    },
    {
      title: 'Manufacturer',
      field: 'manufacturer',
      cellStyle: { fontWeight: 500 }
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
          {rowData.location && <FaLocationDot className='text-black w-5 h-5 dark:text-white' />}
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



  const acsConfig = {
  url: 'http://tr069.aitechs.co.ke:7297',
  username: 'admin',
  password: 'f^ng&^45$',
  active: true, // toggle to false to show the "not activated" warning
}





const troubleshootingItems = [
  {
    title: 'Device not appearing?',
    points: [
      'Check that TR-069 is enabled on the device',
      'Verify the ACS URL is correct (no trailing slash)',
      'Ensure device has internet connectivity',
      'Wait up to 5 minutes for first inform'
    ]
  },
  {
    title: 'Authentication errors?',
    points: [
      'Double-check username and password',
      'Ensure no extra spaces in credentials',
      'Try rotating credentials above',
      'Some devices need a reboot after config change'
    ]
  },
  {
    title: 'Connection timeout?',
    points: [
      'Verify firewall allows outbound port 7547',
      'Check if your ISP blocks TR-069 ports',
      'Try using the IP-based URL if domain fails'
    ]
  },
  {
    title: 'WiFi config not working?',
    points: [
      'Ensure device profile is correctly detected',
      'Some devices need reboot after config',
      'Check if WiFi parameters are supported'
    ]
  }
];
  return (
    <>
      <Toaster />

      <div className="flex flex-col items-center justify-center">
        <div className="text-6xl">🚧</div>
        <h1 className="text-2xl font-sans
 font-bold mt-4">Under Development</h1>
        <p className="text-gray-500 font-sans
">This feature is still in development, You Can Experiment With It, But remember still in development</p>
      </div>

      <p className='font-sans
 font-bold text-3xl inline-block'>
        TR069 Device Management
      </p>

      <div role="alert" className="alert alert-info bg-green-500 rounded-lg w-fit p-2 flex items-center gap-2 justify-center mb-3">
        <CiCircleInfo className='text-white text-xl' />
        <span className='text-white font-sans
'>The only vendor we support for now is huawei.</span>
      </div>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs 
          value={activeTab} 
          onChange={(e, newValue) => setActiveTab(newValue)}
          sx={{
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '0.95rem',
              borderRadius: '8px 8px 0 0',
              transition: 'all 0.2s ease',
              minHeight: 48,
            },
            '& .Mui-selected': {
              color: theme.palette.primary.main,
            },
            '& .MuiTabs-indicator': {
              height: 3,
              borderRadius: '3px 3px 0 0',
              background: 'linear-gradient(90deg, #16a34a, #60a5fa, #06b6d4)',
            }
          }}
        >
          <Tab icon={<DnsIcon />} iconPosition="start" label="Devices" />
          <Tab icon={<MenuBookIcon />} iconPosition="start" label="Setup Guide" />
        </Tabs>
      </Box>

      <ThemeProvider theme={tableTheme}>

      {/* Devices Tab */}
      {activeTab === 0 && (
        <MaterialTable
          title=""
          columns={columns}
          data={onus}
          localization={{
            body: {
              emptyDataSourceMessage: <p className='font-sans
'>No devices found. Create your first device to get started! </p>
            
            }
          }}
                  
 options={{
      sorting: true,
      pageSizeOptions: [2, 5, 10, 20],
      pageSize: 20,
      paginationPosition: 'bottom',
      exportButton: true,
      exportAllData: true,
      selection: true,
      search: false,
      searchAutoFocus: true,
      showSelectAllCheckbox: false,
      showTextRowsSelected: false,
      emptyRowsWhenPaging: false,
      actionsColumnIndex: -1,
      headerStyle: {
        fontFamily: 'monospace',
        textTransform: 'uppercase',
        fontWeight: 700,
        fontSize: '12px',
        backgroundColor: isDark ? '#2a2a2a' : '#f4f1ea',
        color: isDark ? '#f1f1f1' : '#1a1a1a',
        borderBottom: isDark ? '2px solid #3a3a3a' : '2px solid #e5e0d5',
      },
      rowStyle: (rowData, index) => ({
        backgroundColor: isDark
          ? (index % 2 === 0 ? '#1e1e1e' : '#262626')
          : (index % 2 === 0 ? '#ffffff' : '#fafaf7'),
        color: isDark ? '#f1f1f1' : '#1a1a1a',
        fontFamily: 'monospace',
      }),
    }}
      
          actions={[
            {
              icon: () => (
                <Tooltip title="Refresh For Latest Data">
                  <IconButton color="primary">
                    {refreshing ? (
                      <CircularProgress size={20} color="inherit" />
                    ) : (
                      <RefreshIcon sx={{ color: 'green' }} />
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
      )}
</ThemeProvider>




      {/* Setup Guide Tab */}
      {activeTab === 1 && (
        <Box sx={{ maxWidth: 900, mx: 'auto', mt: 1 }}>
          <Box
            sx={{
              p: 3,
              mb: 3,
              borderRadius: 3,
              background: 'linear-gradient(135deg, rgba(22,163,74,0.08), rgba(96,165,250,0.08), rgba(6,182,212,0.08))',
              border: `1px solid ${theme.palette.divider}`
            }}
          >
            <Typography variant="h6" fontWeight={700} gutterBottom>
              TR-069 / CWMP Setup Guide
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Follow the steps below to configure remote management (TR-069) on your router or ONU/modem 
              so it can be auto-provisioned and monitored from this dashboard.
            </Typography>
          </Box>

          <Box
  sx={{
    background: theme.palette.background.paper,
    borderRadius: 2,
    border: `1px solid ${theme.palette.divider}`,
    p: 2.5,
    mb: 3
  }}
>
  <Box display="flex" alignItems="center" gap={1} mb={0.5}>
    <DnsIcon color="primary" fontSize="small" />
    <Typography fontWeight={600} fontSize={15}>Your ACS server URL</Typography>
  </Box>
  <Typography variant="body2" color="textSecondary" mb={1.5}>
    Use this URL to configure your TR-069 devices. Each tenant has a unique URL for security.
  </Typography>

  {acsConfig.active ? (
    <>
      <Box
        display="flex"
        alignItems="center"
        gap={1}
        sx={{
          background: theme.palette.action.hover,
          borderRadius: 1,
          px: 1.5,
          py: 1,
          mb: 1.5
        }}
      >
        <Typography sx={{ fontFamily: 'monospace', fontSize: 13, flex: 1, wordBreak: 'break-all' }}>
          {acsConfig.url}
        </Typography>
        <Tooltip title="Copy">
          <IconButton size="small" onClick={() => navigator.clipboard.writeText(acsConfig.url)}>
            <ContentCopyIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
  <Box sx={{ background: theme.palette.action.hover, borderRadius: 1, px: 1.5, py: 1 }}>
    <Typography variant="caption" color="textSecondary" display="block">ACS username</Typography>
    <Box display="flex" alignItems="center" justifyContent="space-between" gap={1}>
      <Typography sx={{ fontFamily: 'monospace', fontSize: 13 }}>{acsConfig.username}</Typography>
      <Tooltip title="Copy">
        <IconButton size="small" onClick={() => navigator.clipboard.writeText(acsConfig.username)}>
          <ContentCopyIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </Box>
  </Box>

  <Box sx={{ background: theme.palette.action.hover, borderRadius: 1, px: 1.5, py: 1 }}>
    <Typography variant="caption" color="textSecondary" display="block">ACS password</Typography>
    <Box display="flex" alignItems="center" justifyContent="space-between" gap={1}>
      <Typography sx={{ fontFamily: 'monospace', fontSize: 13 }}>
        {showPassword ? acsConfig.password : '•'.repeat(acsConfig.password.length)}
      </Typography>
      <Box display="flex">
        <Tooltip title={showPassword ? 'Hide' : 'Show'}>
          <IconButton size="small" onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
          </IconButton>
        </Tooltip>
        <Tooltip title="Copy">
          <IconButton size="small" onClick={() => navigator.clipboard.writeText(acsConfig.password)}>
            <ContentCopyIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  </Box>
</Box>
    </>
  ) : (
    <div role="alert" className="alert alert-warning bg-amber-500 rounded-lg p-2 flex items-center gap-2 w-fit">
      <CiCircleInfo className="text-white text-xl" />
      <span className="text-white">ACS is not yet activated for your account. Please contact support to enable it.</span>
    </div>
  )}
</Box>











          <Stack spacing={2}>
            {tr069Guides.map((guide, idx) => (
              <Accordion 
                key={idx}
                sx={{
                  borderRadius: 2,
                  overflow: 'hidden',
                  '&:before': { display: 'none' },
                  boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                  border: `1px solid ${theme.palette.divider}`,
                  '&.Mui-expanded': {
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                  }
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  sx={{
                    '&:hover': { backgroundColor: theme.palette.action.hover }
                  }}
                >
                  <Box display="flex" alignItems="center" gap={1.5}>
                    <RouterIcon color="primary" />
                    <Box>
                      <Typography fontWeight={600}>{guide.vendor}</Typography>
                      <Typography variant="caption" color="textSecondary">
                        {guide.models}
                      </Typography>
                    </Box>
                  </Box>
                </AccordionSummary>
                <AccordionDetails sx={{ pt: 0 }}>
                  <Stack spacing={1.25} sx={{ pl: 1 }}>
                    {guide.steps.map((step, i) => (
                      <Box key={i} display="flex" gap={1.5} alignItems="flex-start">
                        <Box
                          sx={{
                            minWidth: 24,
                            height: 24,
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            color: '#fff',
                            background: 'linear-gradient(135deg, #16a34a, #06b6d4)',
                            mt: 0.2
                          }}
                        >
                          {i + 1}
                        </Box>
                        <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
                          {step}
                        </Typography>
                      </Box>
                    ))}
                  </Stack>
                </AccordionDetails>
              </Accordion>
            ))}

            <Box
  sx={{
    background: theme.palette.background.paper,
    borderRadius: 2,
    border: `1px solid ${theme.palette.divider}`,
    p: 2.5,
    mb: 3
  }}
>
  <Box display="flex" alignItems="center" gap={1} mb={1.5}>
    <InfoIcon color="primary" fontSize="small" />
    <Typography fontWeight={600} fontSize={15}>Troubleshooting</Typography>
  </Box>

  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
    {troubleshootingItems.map((item, idx) => (
      <Box key={idx}>
        <Typography fontWeight={500} fontSize={14} mb={0.5}>
          {item.title}
        </Typography>
        <Stack spacing={0.5}>
          {item.points.map((point, i) => (
            <Typography key={i} variant="body2" color="textSecondary" sx={{ pl: 1 }}>
              • {point}
            </Typography>
          ))}
        </Stack>
      </Box>
    ))}
  </Box>
</Box>
          </Stack>
        </Box>
      )}
    </>
  );
};

export default Devices;