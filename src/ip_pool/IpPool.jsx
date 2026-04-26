import { useState, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiAlertCircle, FiInfo } from "react-icons/fi";
import { TbZoomCancel } from "react-icons/tb";
import { useApplicationSettings } from '../settings/ApplicationSettings';
import toast, { Toaster } from 'react-hot-toast';
import { 
  Select,
  MenuItem,
  InputLabel,
  Box, 
  TextField, 
  Autocomplete, 
  Stack, 
  InputAdornment, 
  Button,
  DialogContentText,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tooltip,
  IconButton,
  Divider
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

// Subnet mask reference data
const SUBNET_MASKS = [
  { cidr: '/30', mask: '255.255.255.252', hosts: 2, total: 4, description: 'Point-to-point links' },
  { cidr: '/29', mask: '255.255.255.248', hosts: 6, total: 8, description: 'Small networks' },
  { cidr: '/28', mask: '255.255.255.240', hosts: 14, total: 16, description: 'Small offices' },
  { cidr: '/27', mask: '255.255.255.224', hosts: 30, total: 32, description: 'Medium networks' },
  { cidr: '/26', mask: '255.255.255.192', hosts: 62, total: 64, description: 'Department networks' },
  { cidr: '/25', mask: '255.255.255.128', hosts: 126, total: 128, description: 'Large networks' },
  { cidr: '/24', mask: '255.255.255.0', hosts: 254, total: 256, description: 'Class C networks' },
  { cidr: '/23', mask: '255.255.254.0', hosts: 510, total: 512, description: 'Medium enterprises' },
  { cidr: '/22', mask: '255.255.252.0', hosts: 1022, total: 1024, description: 'Large enterprises' },
  { cidr: '/21', mask: '255.255.248.0', hosts: 2046, total: 2048, description: 'ISP allocations' },
  { cidr: '/16', mask: '255.255.0.0', hosts: 65534, total: 65536, description: 'Class B networks' },
];

const IpPool = ({ isOpen, setIsOpen, ipPoolFormData, setIpPoolFormData, handleChange, setIpPools, ipPools, updating }) => {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [nodes, setNodes] = useState([]);
  const [nas, setNas] = useState([]);
  const [subnetInfo, setSubnetInfo] = useState(null);
  const [showSubnetGuide, setShowSubnetGuide] = useState(false);

  const { start_ip, end_ip, pool_name, description, location, nas_router } = ipPoolFormData;
  const { settingsformData } = useApplicationSettings();

  // Disable background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isOpen]);

  // Validate IP address format
  const validateIP = (ip) => {
    const ipPattern = /^(25[0-5]|2[0-4]\d|1\d\d|\d\d?)\.(25[0-5]|2[0-4]\d|1\d\d|\d\d?)\.(25[0-5]|2[0-4]\d|1\d\d|\d\d?)\.(25[0-5]|2[0-4]\d|1\d\d|\d\d?)$/;
    return ipPattern.test(ip);
  };

  // Check if start IP is less than end IP
  const isStartIpLessThanEndIp = (start, end) => {
    const startParts = start.split(".").map(Number);
    const endParts = end.split(".").map(Number);

    for (let i = 0; i < 4; i++) {
      if (startParts[i] < endParts[i]) return true;
      if (startParts[i] > endParts[i]) return false;
    }
    return false;
  };

  // Calculate subnet information based on IP range
  const calculateSubnetInfo = (startIP, endIP) => {
    if (!validateIP(startIP) || !validateIP(endIP)) return null;

    const startParts = startIP.split(".").map(Number);
    const endParts = endIP.split(".").map(Number);

    // Calculate total addresses
    const totalAddresses = 
      (endParts[0] - startParts[0]) * 16777216 +
      (endParts[1] - startParts[1]) * 65536 +
      (endParts[2] - startParts[2]) * 256 +
      (endParts[3] - startParts[3]) + 1;

    // Find closest subnet mask
    const closestSubnet = SUBNET_MASKS.find(mask => mask.total >= totalAddresses) || 
                         SUBNET_MASKS[SUBNET_MASKS.length - 1];

    // Calculate usable hosts
    const usableHosts = Math.max(0, totalAddresses - 2); // Subtract network and broadcast addresses

    return {
      totalAddresses,
      usableHosts,
      subnetMask: closestSubnet.mask,
      cidr: closestSubnet.cidr,
      recommendedSubnet: closestSubnet,
      isStandardRange: SUBNET_MASKS.some(mask => mask.total === totalAddresses)
    };
  };

  const subdomain = window.location.hostname.split('.')[0];

  const fetchNasRouters = async () => {
    try {
      const response = await fetch('/api/routers', {
        headers: { 'X-Subdomain': subdomain }
      });
      if (response.ok) {
        const result = await response.json();
        setNas(result);
      }
    } catch (error) {
      console.error('Failed to fetch NAS routers:', error);
    }
  };

  useEffect(() => {
    fetchNasRouters();
  }, []);

  const getNodes = useCallback(async () => {
    try {
      const response = await fetch('/api/nodes', {
        headers: { 'X-Subdomain': subdomain },
      });
      const data = await response.json();
      if (response.ok) {
        setNodes(data);
      }
    } catch (error) {
      console.error('Failed to fetch nodes:', error);
    }
  }, [subdomain]);

  useEffect(() => {
    getNodes();
  }, [getNodes]);

  // Calculate subnet info when IPs change
  useEffect(() => {
    if (start_ip && end_ip && validateIP(start_ip) && validateIP(end_ip)) {
      const info = calculateSubnetInfo(start_ip, end_ip);
      setSubnetInfo(info);
    } else {
      setSubnetInfo(null);
    }
  }, [start_ip, end_ip]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedPoolName = pool_name.trim();
    const trimmedStartIP = start_ip.trim();
    const trimmedEndIP = end_ip.trim();

    if (!trimmedPoolName || !trimmedStartIP || !trimmedEndIP) {
      setError("Please fill in all required fields.");
      setSuccess("");
      return;
    }

    if (!validateIP(trimmedStartIP) || !validateIP(trimmedEndIP)) {
      setError("Invalid IP address format. Please use format: XXX.XXX.XXX.XXX");
      setSuccess("");
      return;
    }

    if (!isStartIpLessThanEndIp(trimmedStartIP, trimmedEndIP)) {
      setError("Start IP must be lower than End IP.");
      setSuccess("");
      return;
    }

    // Additional validation for network boundaries
    const startParts = trimmedStartIP.split(".").map(Number);
    const endParts = trimmedEndIP.split(".").map(Number);
    
    // Check if range is valid for common subnet masks
    const totalAddresses = 
      (endParts[0] - startParts[0]) * 16777216 +
      (endParts[1] - startParts[1]) * 65536 +
      (endParts[2] - startParts[2]) * 256 +
      (endParts[3] - startParts[3]) + 1;
    
    if (totalAddresses > 65536) {
      toast.error(
        'Range too large. Consider using /16 or larger subnet masks.',
        { position: 'top-center', duration: 4000 }
      );
      return;
    }

    setError("");
    setSuccess("IP Pool created successfully!");

    // Reset form
    setIpPoolFormData({
      start_ip: '',
      end_ip: '',
      pool_name: '',
      description: ''
    });

    setTimeout(() => {
      setIsOpen(false);
      setSuccess("");
    }, 2000);

    try {
      const url = ipPoolFormData.id ? `/api/ip_pools/${ipPoolFormData.id}` : '/api/ip_pools';
      const method = ipPoolFormData.id ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'X-Subdomain': subdomain,
        },
        body: JSON.stringify({...ipPoolFormData, nas_router: nas_router}),
      });

      const newData = await response.json();
      if (response.ok) {
        if (ipPoolFormData.id) {
          setIpPools(ipPools.map(item => (item.id === ipPoolFormData.id ? newData : item)));
          toast.success('Pool updated successfully', {
            position: "top-center",
            duration: 4000,
          });
        } else {
          setIpPools([...ipPools, newData]);
          toast.success('Pool created successfully', {
            position: "top-center",
            duration: 4000,
          });
        }
      } else {
        toast.error(
          newData.error || 'Failed to create IP pool',
          { position: 'top-center', duration: 6000 }
        );
      }
    } catch (error) {
      toast.error('Failed to create IP pool', {
        position: 'top-center',
        duration: 4000,
      });
    }
  };

  // Helper function to suggest common ranges
  const getRangeSuggestion = () => {
    if (!start_ip || !validateIP(start_ip)) return null;
    
    const parts = start_ip.split(".").map(Number);
    return {
      '/30': `${start_ip} - ${parts[0]}.${parts[1]}.${parts[2]}.${parts[3] + 3}`,
      '/29': `${start_ip} - ${parts[0]}.${parts[1]}.${parts[2]}.${parts[3] + 7}`,
      '/28': `${start_ip} - ${parts[0]}.${parts[1]}.${parts[2]}.${parts[3] + 15}`,
      '/24': `${start_ip} - ${parts[0]}.${parts[1]}.${parts[2]}.255`
    };
  };

  return (
    <>
      <Toaster />
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-4xl relative max-h-[90vh] overflow-y-auto"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -50, opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800 font-montserat">
                  {updating ? 'Update IP Pool' : 'Create IP Pool'}
                </h1>
                <Tooltip title="IP Range Guidelines">
                  <IconButton onClick={() => setShowSubnetGuide(!showSubnetGuide)}>
                    <InfoOutlinedIcon />
                  </IconButton>
                </Tooltip>
              </div>

              {/* Subnet Guide */}
              {showSubnetGuide && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-6"
                >
                  <Paper elevation={2} className="p-4 bg-blue-50">
                    <Typography variant="h6" gutterBottom className="flex items-center">
                      <FiInfo className="mr-2" /> IP Range Guidelines
                    </Typography>
                    <Typography variant="body2" paragraph>
                      When creating IP pools, use standard subnet masks for efficient network design:
                    </Typography>
                    
                    <TableContainer component={Paper} variant="outlined" className="mb-3">
                      <Table size="small">
                        <TableHead>
                          <TableRow className="bg-gray-100">
                            <TableCell><strong>CIDR</strong></TableCell>
                            <TableCell><strong>Subnet Mask</strong></TableCell>
                            <TableCell><strong>Total IPs</strong></TableCell>
                            <TableCell><strong>Usable Hosts</strong></TableCell>
                            <TableCell><strong>Typical Use</strong></TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {SUBNET_MASKS.map((mask) => (
                            <TableRow key={mask.cidr}>
                              <TableCell>{mask.cidr}</TableCell>
                              <TableCell>{mask.mask}</TableCell>
                              <TableCell>{mask.total}</TableCell>
                              <TableCell>{mask.hosts}</TableCell>
                              <TableCell>{mask.description}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>

                    <Typography variant="body2" className="text-red-600 font-semibold">
                      💡 Pro Tips:
                    </Typography>
                    <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
                      <li><strong>/30</strong>: Perfect for point-to-point links (router connections)</li>
                      <li><strong>/29</strong>: Good for small networks with up to 6 devices</li>
                      <li><strong>/24</strong>: Standard for most LAN networks (254 usable hosts)</li>
                      <li><strong>/16</strong>: Large enterprise or ISP allocations</li>
                      <li>Always leave room for network growth</li>
                      <li>Consider future expansion when selecting ranges</li>
                    </ul>
                  </Paper>
                </motion.div>
              )}

              {/* Error Message */}
              {error && (
                <motion.div
                  className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4 flex items-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <FiAlertCircle className="mr-2" />
                  {error}
                </motion.div>
              )}

              {/* Success Message */}
              {success && (
                <motion.div
                  className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded mb-4 flex items-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  ✅ {success}
                </motion.div>
              )}

              {/* Subnet Information Display */}
              {subnetInfo && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`mb-4 p-3 rounded border ${
                    subnetInfo.isStandardRange 
                      ? 'bg-green-50 border-green-200' 
                      : 'bg-yellow-50 border-yellow-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <Typography variant="subtitle2" className="font-semibold">
                        📊 Range Analysis:
                      </Typography>
                      <div className="grid grid-cols-2 gap-2 mt-1 text-sm">
                        <div><strong>Total IPs:</strong> {subnetInfo.totalAddresses}</div>
                        <div><strong>Usable Hosts:</strong> {subnetInfo.usableHosts}</div>
                        <div><strong>Recommended Mask:</strong> {subnetInfo.subnetMask}</div>
                        <div><strong>CIDR:</strong> {subnetInfo.cidr}</div>
                      </div>
                    </div>
                    {!subnetInfo.isStandardRange && (
                      <Tooltip title="Consider using standard subnet ranges for better network management">
                        <span className="text-yellow-600 text-sm">
                          ⚠️ Non-standard range
                        </span>
                      </Tooltip>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  {/* Pool Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Pool Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="pool_name"
                      value={pool_name}
                      onChange={handleChange}
                      className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500"
                      required
                      placeholder="e.g., LAN-Pool, Guest-WiFi, VPN-Users"
                    />
                  </div>

                  {/* IP Range Inputs in Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Start IP */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Start IP <span className="text-red-500">*</span>
                        <Tooltip title="First IP address in the range">
                          <span className="ml-1 text-gray-400">?</span>
                        </Tooltip>
                      </label>
                      <input
                        name="start_ip"
                        type="text"
                        value={start_ip}
                        onChange={handleChange}
                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500"
                        required
                        placeholder="192.168.1.1"
                      />
                      {start_ip && validateIP(start_ip) && (
                        <div className="mt-1 text-xs text-gray-500">
                          <strong>Common ranges from this start:</strong>
                          <ul className="list-disc pl-4">
                            <li><strong>/30:</strong> {getRangeSuggestion()?.['/30']}</li>
                            <li><strong>/24:</strong> {getRangeSuggestion()?.['/24']}</li>
                          </ul>
                        </div>
                      )}
                    </div>

                    {/* End IP */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        End IP <span className="text-red-500">*</span>
                        <Tooltip title="Last IP address in the range">
                          <span className="ml-1 text-gray-400">?</span>
                        </Tooltip>
                      </label>
                      <input
                        name="end_ip"
                        type="text"
                        value={end_ip}
                        onChange={handleChange}
                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500"
                        required
                        placeholder="192.168.1.254"
                      />
                      <div className="mt-1 text-xs text-gray-500">
                        Example ranges:
                        <ul className="list-disc pl-4">
                          <li>Small: <code>192.168.1.1 - 192.168.1.6</code> (/29)</li>
                          <li>Medium: <code>192.168.1.1 - 192.168.1.254</code> (/24)</li>
                          <li>Large: <code>10.0.0.1 - 10.0.255.254</code> (/16)</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Location Selection */}
                  <div>
                    <InputLabel>Location</InputLabel>
                    <Autocomplete
                      fullWidth
                      id="node-autocomplete"
                      options={nodes}
                      getOptionLabel={(option) => option.name}
                      value={nodes.find(n => n.name === location) || null}
                      onChange={(event, newValue) => {
                        setIpPoolFormData({...ipPoolFormData, location: newValue?.name || ''})
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Select Location"
                          variant="outlined"
                          InputProps={{
                            ...params.InputProps,
                            className: 'myTextField',
                          }}
                        />
                      )}
                    />
                  </div>

                  {/* NAS Router Selection */}
                  <div>
                    <Autocomplete
                      fullWidth
                      className='myTextField'
                      options={nas}
                      value={nas.find(n => n.name === nas_router) || null}
                      onChange={(event, newValue) => {
                        setIpPoolFormData({...ipPoolFormData, nas_router: newValue?.name || ''})
                      }}
                      getOptionLabel={(option) => option.name}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="NAS Router"
                          required
                        />
                      )}
                      isOptionEqualToValue={(option, value) => option.id === value?.id}
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Description (Optional)
                    </label>
                    <textarea
                      name="description"
                      value={description}
                      onChange={handleChange}
                      className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500"
                      rows="3"
                      placeholder="Describe the purpose of this IP pool (e.g., 'For office staff', 'Guest WiFi network', 'VPN users pool')"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  className="mt-6 w-full font-montserat-regular bg-green-500 text-white px-6 py-2 rounded-lg hover:text-black hover:bg-green-200 transition duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {updating ? 'Update IP Pool' : 'Create IP Pool'}
                </motion.button>
              </form>

              {/* Close Button */}
              <button
                className="absolute top-4 right-4 hover:text-gray-700"
                onClick={() => setIsOpen(false)}
              >
                <TbZoomCancel className='text-black w-8 h-8'/>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default IpPool;