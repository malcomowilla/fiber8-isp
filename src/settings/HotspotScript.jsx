import * as React from 'react';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Stack from '@mui/material/Stack';
import { motion } from 'framer-motion';
import { 
  InputAdornment,
  IconButton,
  Snackbar,
  Alert,
  MenuItem,
  Select,
  FormControl,
  InputLabel
} from '@mui/material';
import { IoGitNetwork } from "react-icons/io5";
import { CiUser } from "react-icons/ci";
import { TbLockPassword } from "react-icons/tb";
import { FaUserEdit, FaFileImport, FaServer } from "react-icons/fa";
import { SiGoogleappsscript } from "react-icons/si";
import { ContentCopy, Check, CloudUpload, Router } from '@mui/icons-material';
import DialogActions from '@mui/material/DialogActions';

import toast, { Toaster } from 'react-hot-toast';
import {useEffect, useState, useCallback, useMemo} from 'react'
import { Autocomplete, TextField, } from '@mui/material';



function HotspotScript({ open, handleClose }) {
  const [fullWidth, setFullWidth] = React.useState(true);
  const [maxWidth, setMaxWidth] = React.useState('lg');
  const [copiedCommand, setCopiedCommand] = React.useState('');
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState('');
  const [routers, setRouters] = useState([]);
  const [selectedRouter, setSelectedRouter] = useState('');
  const [showRouterSelection, setShowRouterSelection] = useState(false);
  const fileInputRef = React.useRef(null);
  const [loading, setloading] = useState(false);

  const mikrotikCommands = [
    {
      title: "Basic Hotspot Setup",
      commands: [
        "/ip hotspot setup",
        "Select interface: ether2",
        "Enter address of local hotspot interface: 192.168.88.1/16",
        "Masquerade network: yes",
        "Select address pool for network: 192.168.88.0/16",
        "select certificate: none",
        "Enter IP address of SMTP server: 0.0.0.0",
        "Enter DNS servers: 8.8.8.8",
        "Enter DNS name of local hotspot server: hotspot.local",
        "Create local hotspot user: admin",
        "Enter password for the user: ********",
      ]
    },
    {
      title: "Advanced Hotspot Configuration",
      commands: [
        `/ip hotspot walled-garden ip add action=accept dst-host=${window.location.hostname.split('.')[0]}.aitechs.co.ke`,
        `/ip hotspot walled-garden add action=allow dst-host="^:${window.location.hostname.split('.')[0]}.aitechs.co.ke path=:/hotspot-page\\$"`,
      ]
    },
  ];

  const subdomain = window.location.hostname.split('.')[0];

  const fetchRouters = useCallback(async () => {
    try {
      const response = await fetch('/api/routers', {
        headers: {
          'X-Subdomain': subdomain,
        },
      });
  
      if (response.ok) {
        const routersData = await response.json();
        setRouters(routersData);
        if (routersData.length > 0) {
          setSelectedRouter(routersData[0].id);
        }
      } else {
        console.log('Failed to fetch routers');
      }
    } catch (error) {
      console.log('Error fetching routers:', error);
      toast.error('Failed to fetch routers list');
    }
  }, [subdomain]);

  useEffect(() => {
    if (open) {
      fetchRouters();
    }
  }, [open, fetchRouters]);

  const copyToClipboard = async (command) => {
    try {
      await navigator.clipboard.writeText(command);
      setCopiedCommand(command);
      setSnackbarMessage('Command copied to clipboard!');
      setSnackbarOpen(true);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const handleImportHotspotFile = () => {
    fileInputRef.current?.click();
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.type === 'application/x-routeros-script' || file.name.endsWith('.rsc')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target.result;
          processHotspotFile(content, file.name);
        };
        reader.readAsText(file);
      } else {
        setSnackbarMessage('Please upload a valid MikroTik script file (.rsc)');
        setSnackbarOpen(true);
      }
    }
  };

  const processHotspotFile = (content, filename) => {
    try {
      const commands = content.split('\n').filter(cmd => cmd.trim() && !cmd.startsWith('#'));
      
      mikrotikCommands.push({
        title: `Imported from ${filename}`,
        commands: commands.slice(0, 10)
      });

      setSnackbarMessage(`Successfully imported ${commands.length} commands from ${filename}`);
      setSnackbarOpen(true);
      copyToClipboard(commands.join('\n'));
    } catch (error) {
      setSnackbarMessage('Error processing the hotspot file');
      setSnackbarOpen(true);
    }
  };

  const handleUploadToRouter = async () => {
    if (routers.length === 0) {
      toast.error('No routers available. Please add a router first.');
      return;
    }

    if (!selectedRouter) {
      toast.error('Please select a router first.');
      return;
    }

    // Show confirmation dialog
    setShowRouterSelection(true);
  };

  const confirmUploadToRouter = async () => {
    const router = routers.find(r => r.id === selectedRouter);
    if (!router) {
      toast.error('Selected router not found.');
      return;
    }

    try {
        setloading(true)
      const response = await fetch('/api/hotspot_upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Subdomain': subdomain,
        },
        body: JSON.stringify({
          router_id: selectedRouter,
          router_ip: router.ip_address,
          router_username: router.username,
          router_password: router.password
        })
      });

      if (response.ok) {
        setloading(false)
        setSnackbarMessage(`Hotspot configuration uploaded successfully to ${router.name} (${router.ip_address})`);
        toast.success(`Hotspot configuration uploaded to ${router.name}`, {
          duration: 4000,
          position: 'top-center',
        });
        setShowRouterSelection(false);
        setShowRouterSelection(false);
      } else {
        setloading(false)
        setShowRouterSelection(false);
        setSnackbarMessage('Failed to upload hotspot configuration file');
        toast.error('Failed to upload hotspot configuration file', {
          duration: 4000,
          position: 'top-center',
        });
      }
    } catch (error) {
        setloading(false)
        setShowRouterSelection(false);
      toast.error('Internal server error: Something went wrong with uploading hotspot configuration file', {
        duration: 4000,
        position: 'top-center',
      });
      setSnackbarMessage('Internal server error: Something went wrong with uploading hotspot configuration file');
    }
  };

  const generateHotspotConfigFile = () => {
    const configContent = `# MikroTik Hotspot Configuration File
# Generated on ${new Date().toLocaleDateString()}
# AITechs Hotspot System

# Basic Hotspot Setup
/ip hotspot setup
/ip hotspot profile add name=hotspot1

# Network Configuration
/ip pool add name=hotspot-pool ranges=192.168.100.10-192.168.100.254
/ip hotspot add name=hotspot1 interface=ether2 profile=hotspot1 address-pool=hotspot-pool

# Walled Garden for AITechs
/ip hotspot walled-garden ip add action=accept dst-host=${window.location.hostname.split('.')[0]}.aitechs.co.ke
/ip hotspot walled-garden add action=allow dst-host="^:${window.location.hostname.split('.')[0]}.aitechs.co.ke path=:/hotspot-page\\$"

# User Management
/ip hotspot user add name=admin password=admin123 profile=hotspot1
/ip hotspot user add name=guest password=guest123 profile=hotspot1 limit-uptime=01:00:00

# Firewall Rules
/ip firewall filter add chain=forward action=accept place-before=0 src-address=192.168.100.0/24
/ip firewall nat add chain=srcnat action=masquerade out-interface=ether1

# Bandwidth Limitation
/queue simple add name=hotspot-limit target=192.168.100.0/24 max-limit=10M/10M

echo "Hotspot configuration completed successfully"`;

    const blob = new Blob([configContent], { type: 'application/x-routeros-script' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hotspot-config-${new Date().getTime()}.rsc`;
    a.click();
    URL.revokeObjectURL(url);

    setSnackbarMessage('Hotspot configuration file downloaded!');
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
    setCopiedCommand('');
  };

  return (
    <React.Fragment>
      <Toaster />
      
      {/* Main Dialog */}
      <Dialog
        fullWidth={fullWidth}
        maxWidth={maxWidth}
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            borderRadius: '12px',
            background: 'linear-gradient(145deg, #ffffff, #f0f0f0)',
            boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
            maxHeight: '90vh'
          },
        }}
      >
        <DialogTitle>
          <div className="flex items-center gap-3">
            <SiGoogleappsscript className="text-2xl text-green-500" />
            <h2 className="text-xl font-bold text-gray-800">MikroTik Hotspot Setup Commands</h2>
          </div>
          <p className="text-sm text-gray-600 mt-1">Copy and paste these commands into your MikroTik terminal</p>
        </DialogTitle>

        <DialogContent dividers>
          {/* Router Selection Section */}
          <motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3 }}
  className="mb-4"
>
  <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-lg p-4">
    <div className="flex items-center gap-3 mb-3">
      <FaServer className="text-xl text-blue-500" />
      <h3 className="font-semibold text-blue-800">Select Target Router</h3>
    </div>
    
    <Autocomplete
    className='myTextField'
      value={routers.find(router => router.id === selectedRouter) || null}
      onChange={(event, newValue) => {
        setSelectedRouter(newValue ? newValue.id : '');
      }}
      options={routers}
      getOptionLabel={(option) => option.name}
      renderOption={(props, option) => (
        <MenuItem {...props}>
          <div className="flex justify-between items-center w-full">
            <span>{option.name}</span>
            <span className="text-xs text-gray-500 ml-2">{option.ip_address}</span>
          </div>
        </MenuItem>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Choose Router"
          size="small"
          InputProps={{
            ...params.InputProps,
            startAdornment: (
              <>
                <InputAdornment position="start">
                  <Router fontSize="small" />
                </InputAdornment>
                {params.InputProps.startAdornment}
              </>
            )
          }}
        />
      )}
      fullWidth
    />
    
    {selectedRouter && (
      <div className="mt-3 p-2 bg-white rounded border">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <span className="font-medium">IP Address:</span>
          <span>{routers.find(r => r.id === selectedRouter)?.ip_address}</span>
          <span className="font-medium">Username:</span>
          <span>{routers.find(r => r.id === selectedRouter)?.username}</span>
        </div>
      </div>
    )}
  </div>
</motion.div>

          {/* Import/Export Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="mb-6"
          >
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FaFileImport className="text-2xl text-purple-500" />
                  <div>
                    <h3 className="font-semibold text-purple-800">Import/Export Hotspot Configuration</h3>
                    <p className="text-sm text-purple-600">Upload a .rsc file or download a complete configuration</p>
                    <p className="text-sm text-purple-600">You can also upload the hotspot file to your router</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleUploadToRouter}
                    disabled={!selectedRouter}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                      selectedRouter 
                        ? 'bg-purple-500 text-white hover:bg-purple-600' 
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    <CloudUpload fontSize="small" />
                    Upload to Router
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={generateHotspotConfigFile}
                    className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors"
                  >
                    <FaFileImport fontSize="small" />
                    Export Config
                  </motion.button>
                </div>
              </div>
              
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept=".rsc,application/x-routeros-script"
                style={{ display: 'none' }}
              />
            </div>
          </motion.div>

          {/* Rest of the content remains the same */}
          <Stack spacing={3} sx={{ mt: 1 }}>
            {mikrotikCommands.map((section, sectionIndex) => (
              <motion.div
                key={sectionIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: sectionIndex * 0.1 + 0.2 }}
              >
                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <IoGitNetwork className="text-green-500" />
                  {section.title}
                </h3>
                
                <Stack spacing={1}>
                  {section.commands.map((command, cmdIndex) => (
                    <motion.div
                      key={cmdIndex}
                      whileHover={{ scale: 1.005 }}
                      className="bg-gray-50 border border-gray-200 rounded-lg p-3 flex items-center justify-between group hover:bg-blue-50 transition-all"
                    >
                      <code className="text-sm text-gray-800 font-mono flex-1">
                        {command}
                      </code>
                      <IconButton
                        size="small"
                        onClick={() => copyToClipboard(command)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                        sx={{ 
                          color: 'primary.main',
                          '&:hover': { backgroundColor: 'primary.50' }
                        }}
                      >
                        <ContentCopy fontSize="small" />
                      </IconButton>
                    </motion.div>
                  ))}
                </Stack>
              </motion.div>
            ))}
          </Stack>

          {/* Quick Copy Sections */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.6 }}
            className="mt-6"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <FaUserEdit className="text-purple-500" />
              Quick Setup Scripts
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  title: "Complete Hotspot Setup",
                  script: `/ip hotspot setup\n/ip hotspot profile add name=hotspot1\n/ip pool add name=hotspot-pool ranges=192.168.100.10-192.168.100.254\n/ip hotspot add name=hotspot1 interface=bridge-local profile=hotspot1 address-pool=hotspot-pool`
                },
              ].map((quickScript, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 cursor-pointer"
                  onClick={() => copyToClipboard(quickScript.script)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-blue-800">{quickScript.title}</h4>
                      <p className="text-xs text-blue-600 mt-1">Click to copy entire script</p>
                    </div>
                    <ContentCopy className="text-blue-500" />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </DialogContent>

        <DialogActions sx={{ p: 3, gap: 2 }}>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 font-medium text-white rounded-lg transition-all hover:bg-red-600 bg-red-500"
            onClick={handleClose}
          >
            Close
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 font-medium text-white rounded-lg transition-all hover:bg-green-600 bg-green-500"
            onClick={() => copyToClipboard(mikrotikCommands.flatMap(s => s.commands).join('\n'))}
          >
            Copy All Commands
          </motion.button>
        </DialogActions>
      </Dialog>

      {/* Router Confirmation Dialog */}
      <Dialog
        open={showRouterSelection}
        onClose={() => setShowRouterSelection(false)}
        PaperProps={{
          sx: {
            borderRadius: '12px',
            background: 'linear-gradient(145deg, #ffffff, #f0f0f0)',
          },
        }}
      >
        <DialogTitle>
          <div className="flex items-center gap-2">
            <CloudUpload className="text-green-500" />
            <span>Confirm Upload to Router</span>
          </div>
        </DialogTitle>
        <DialogContent>
          {selectedRouter && (
            <div className="space-y-3">
              <p className="text-gray-600">Are you sure you want to upload the hotspot configuration to:</p>
              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <span className="font-medium">Router Name:</span>
                  <span>{routers.find(r => r.id === selectedRouter)?.name}</span>
                  <span className="font-medium">IP Address:</span>
                  <span>{routers.find(r => r.id === selectedRouter)?.ip_address}</span>
                  <span className="font-medium">Username:</span>
                  <span>{routers.find(r => r.id === selectedRouter)?.username}</span>
                </div>
              </div>
              <p className="text-sm text-orange-600">This will overwrite existing hotspot configuration on the router.</p>
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <button
            onClick={() => setShowRouterSelection(false)}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
          <button
            onClick={confirmUploadToRouter}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-blue-600"
          >
            {loading ? <span>Confirming Upload........</span> : <span>Confirm Upload</span>}
          </button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleSnackbarClose} 
          severity="success" 
          icon={<Check fontSize="small" />}
          sx={{ 
            background: 'linear-gradient(145deg, #4caf50, #45a049)',
            color: 'white',
            fontWeight: 'medium'
          }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </React.Fragment>
  );
}

export default HotspotScript;