import { FcAlarmClock } from "react-icons/fc";
import { GoCpu, GoServer } from "react-icons/go";
import { useCallback, useEffect, useState } from "react";
import { useApplicationSettings } from '../settings/ApplicationSettings'
import { useSearchParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import TrafficStatsGraph from './TrafficData';
import toast, { Toaster } from 'react-hot-toast';
import { IoWarningOutline, IoClose, IoSearch, IoFilter, IoDownload, IoRefresh, IoEye, IoEyeOff } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import { MdMemory } from "react-icons/md";
import { FiHardDrive } from "react-icons/fi";
import { FcAreaChart } from "react-icons/fc";
import Lottie from 'react-lottie';
import animationData from '../lotties/Connection error.json';
import { motion } from "framer-motion";
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';
import CircularProgress from '@mui/material/CircularProgress';
import Tooltip from '@mui/material/Tooltip';

const RouterDetails = ({ message = "Connection to router failed" }) => {
  const { openNasTable, setOpenNasTable,
    openRouterDetails, setOpenRouterDetails } = useApplicationSettings()
  const [routerData, setRouterData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentRouterImage, setCurrentRouterImage] = useState(null);
  const [uptime, setUptime] = useState(null);
  const [error, setError] = useState(null);
  const [routerInfo, setRouterInfo] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [routerInterface, setRouterInterface] = useState([]);
  const [routerInterfaceForm, setRouterInterfaceForm] = useState('');
  const [showSucessReboot, setShowSucessReboot] = useState(false);
  const navigate = useNavigate()

  const handleChange = (event) => {
    setRouterInterfaceForm(event.target.value);
    localStorage.setItem('routerInterfaceForm', event.target.value)
    fetchTrafficStats(event.target.value)
  };

  const [trafficData, setTrafficData] = useState([]);

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice"
    }
  };

  // Logs state
  const [openLogsModal, setOpenLogsModal] = useState(false);
  const [logs, setLogs] = useState([]);
  const [loadingLogs, setLoadingLogs] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [autoRefreshInterval, setAutoRefreshInterval] = useState(5); // seconds

  const fetchTrafficStats = useCallback(async (routerInterfaceForm) => {
    try {
      setLoading(true);
      setError(null);

      const response = await
        fetch(`/api/trafic_stats?id=${id} &interface=${routerInterfaceForm || localStorage.getItem('routerInterfaceForm')}`, {
          headers: { 'X-Subdomain': window.location.hostname.split('.')[0] },
        });
      if (!response.ok) throw new Error('Failed to fetch router info');

      const data = await response.json();

      setTrafficData(data[0]); // Keep last 30 data points

    } catch (err) {
      setError(err.message);
      setRouterInfo(null);
      setUptime(null);
    } finally {
      setLoading(false);
    }
  }, []);



  useEffect(() => {
    fetchTrafficStats();
    const intervalId = setInterval(fetchTrafficStats, 5000);
    return () => clearInterval(intervalId);
  }, [fetchTrafficStats]);


  const [ubuntuStats, setUbuntuStats] = useState({
    cpuUsage: 0,
    memoryUsage: 0,
    diskUsage: 0,
    uptime: "0h 0m",
    available_memory: 0,
    memory_used: 0,
    disk_used: 0,
    available_disk: 0,
  });
  const [loadingUbuntuStats, setLoadingUbuntuStats] = useState(true);

  const event = new Date();
  console.log('current time:', event.toLocaleTimeString("en-US"))

  const id = searchParams.get('id')
  const [mikotik, setMikotik] = useState([
    {
      "id": 1,
      "name": "hAP ax lite",
      "image": '/images/hAP_ax_lite.png'
    },
    {
      "id": 2,
      "name": "RB951Ui-2HnD",
      "image": '/images/RB951Ui-2HnD.png'
    },

    {
      "id": 3,
      "name": "L009UiGS",
      "image": '/images/L009UiGS-RM.png'
    },

    {
      "id": 4,
      "name": "RB4011iGS+",
      "image": '/images/RB4011iGS+RM.png'
    },
    {
      "id": 5,
      "name": "CCR1009-7G-1C-1S+",  
      "image": '/images/CCR1009-7G-1C-1S+.webp'
    }
  ])

  const [cpuLoad, setCpuLoad] = useState(0)
  const [freeMemory, setFreeMemory] = useState(0)
  const [totalMemory, setTotalMemory] = useState(0)
  const [freeHdd, setFreeHdd] = useState(0)
  const [totalHdd, setTotalHdd] = useState(0)
  const [routerVersion, setRouterVersion] = useState(0)
  const [showRebootConfirm, setShowRebootConfirm] = useState(false);
  const [archiTecture, setArchiTecture] = useState(null)
  const [routerTimezone, setRouterTimezone] = useState(null)


  
  const rebootRouter = async (e) => {
    e.preventDefault()

    if (!showRebootConfirm) {
      setShowRebootConfirm(true);
      return;
    }

    try {
      const response = await fetch(`/api/reboot_router?id=${id}`, {
        method: 'POST',
        headers: { 'X-Subdomain': window.location.hostname.split('.')[0] },
      })

      const newData = await response.json()

      if (response.status === 402) {
        setTimeout(() => {
          window.location.href = '/license-expired';
        }, 1800);
      }

      if (response.ok) {
        toast.success('Router is rebooting', {
          position: "top-center",
          duration: 5000,
        });
        setShowSucessReboot(true);

        setTimeout(() => {
          navigate('/admin/nas')
        }, 2500);
      } else {
        toast.error(
          newData.error, {
          position: "top-center",
          duration: 5000,
        }
        )
      }
    } catch (error) {
      toast.error(
        'Failed to reboot router server error', {
        position: "top-center",
        duration: 5000,
      }
      )
    }
  }



  const fetchRouterInfoo = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/router_info?id=${id}`, {
        headers: { 'X-Subdomain': window.location.hostname.split('.')[0] },
      });

      if (!response.ok) throw new Error('Failed to fetch router info');

      const data = await response.json();
      setRouterInfo(data.board_name);
      setUptime(data.uptime);
      setCpuLoad(data.cpu_load);
      setFreeMemory(data.memory_usage.free);
      setTotalMemory(data.memory_usage.total);
      setFreeHdd(data.disk_usage.free);
      setTotalHdd(data.disk_usage.total);
      setRouterVersion(data.version);
      setArchiTecture(data.architecture_name)

      const matchedRouter = mikotik.find(router => router.name === data.board_name);
      setCurrentRouterImage(matchedRouter?.image || null);

    } catch (err) {
      setError(err.message);
      setRouterInfo(null);
      setUptime(null);
    } finally {
      setLoading(false);
    }
  }, []);





  const fetchRouterTimezone = useCallback(async () => {
    try {
    

      const response = await fetch(`/api/router_timezone?id=${id}`, {
        headers: { 'X-Subdomain': window.location.hostname.split('.')[0] },
      });

      if (!response.ok) throw new Error('Failed to fetch router timezone');

      const data = await response.json();

    setRouterTimezone(data.time_zone_name)
     

    } catch (err) {
      // setRouterTimezone('N/A')
     
    } finally {

          //  setRouterTimezone('N/A')

     
    }
  }, [id]);


useEffect(() => {
  fetchRouterTimezone();
}, [fetchRouterTimezone]);



  useEffect(() => {
    fetchRouterInfoo();
    const intervalId = setInterval(fetchRouterInfoo, 8000);
    return () => clearInterval(intervalId);
  }, [fetchRouterInfoo]);

  const fetchRouterInterface = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/get_router_interface?id=${id}`, {
        headers: { 'X-Subdomain': window.location.hostname.split('.')[0] },
      });

      if (!response.ok) throw new Error('Failed to fetch router info');

      const data = await response.json();

      if (response.ok) {
        setRouterInterface(data);
      }
    } catch (err) {
      setError(err.message);
      setRouterInfo(null);
      setUptime(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRouterInterface();
  }, [fetchRouterInterface]);

  // Logs functions
  const fetchLogs = useCallback(async () => {
    if (!openLogsModal) return;

    try {
      setLoadingLogs(true);
      const response = await fetch(`/api/get_router_logs?id=${id}`, {
        headers: { 'X-Subdomain': window.location.hostname.split('.')[0] },
      });

      if (!response.ok) throw new Error('Failed to fetch logs');

      const data = await response.json();
      setLogs(data);
    } catch (err) {
      toast.error('Failed to fetch logs: ' + err.message);
    } finally {
      setLoadingLogs(false);
    }
  }, [openLogsModal, id]);

  useEffect(() => {
    if (openLogsModal) {
      fetchLogs();
      let interval;
      if (autoRefresh) {
        interval = setInterval(fetchLogs, autoRefreshInterval * 1000);
      }
      return () => {
        if (interval) clearInterval(interval);
      };
    }
  }, [openLogsModal, autoRefresh, autoRefreshInterval]);

  const handleOpenLogs = () => {
    setOpenLogsModal(true);
  };

  const handleCloseLogs = () => {
    setOpenLogsModal(false);
  };

  const handleRefreshLogs = () => {
    fetchLogs();
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleExportLogs = () => {
    const logText = logs.map(log => 
      `${log.time || ''}\t${log.topics || ''}\t${log.message || ''}`
    ).join('\n');
    
    const blob = new Blob([logText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mikrotik-logs-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getSeverityColor = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'error':
      case 'critical':
        return '#ef4444';
      case 'warning':
        return '#f59e0b';
      case 'info':
        return '#3b82f6';
      case 'debug':
        return '#6b7280';
      default:
        return '#9ca3af';
    }
  };

  const getSeverityChip = (severity) => {
    const color = getSeverityColor(severity);
    return (
      <Chip
        label={severity || 'unknown'}
        size="small"
        style={{
          backgroundColor: color,
          color: 'white',
          fontWeight: 'bold',
          fontSize: '0.7rem',
          height: '20px'
        }}
      />
    );
  };

  const filteredLogs = logs.filter(log => {
    const matchesSearch = 
      (log.message?.toLowerCase().includes(searchTerm.toLowerCase()) ||
       log.topics?.toLowerCase().includes(searchTerm.toLowerCase()) ||
       log.time?.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesSeverity = 
      severityFilter === 'all' || 
      (log.topics?.toLowerCase().includes(severityFilter.toLowerCase()));
    
    return matchesSearch && matchesSeverity;
  });

  const [timezone, setTimeZone] = useState(null);
  const handleGetSystemGeneralSettings = useCallback(async () => {
    try {
      const response = await fetch('/api/general_settings', {
        headers: {
          'X-Subdomain': window.location.hostname.split('.')[0]
        },
      })
      const newData = await response.json()
      if (response.ok) {
        setTimeZone(newData[0].timezone)
      } else {
        console.log('failed to fetch system general settings')
      }
    } catch (error) {
      console.log(error)
    }
  }, []);

  useEffect(() => {
    handleGetSystemGeneralSettings()
  }, [handleGetSystemGeneralSettings]);

  const status = searchParams.get('status')

  const StatCard = ({ icon, title, value, unit, color = "blue", children }) => {
    const colors = {
      blue: "from-blue-500 to-blue-600",
      green: "from-green-500 to-green-600",
      orange: "from-orange-500 to-orange-600",
      purple: "from-purple-500 to-purple-600",
      red: "from-red-500 to-red-600"
    };

    return (
      <div className={`bg-gradient-to-br ${colors[color]} rounded-xl 
      shadow-lg overflow-hidden text-white`}>
        <div className="p-5">
          <div className="flex justify-between items-center">
            <div className="text-2xl font-bold">
              {value} {unit && <span className="text-sm opacity-80">{unit}</span>}
            </div>
            <div className="p-3 rounded-full bg-white/20">
              {icon}
            </div>
          </div>
          <div className="mt-2 text-sm font-medium opacity-90">{title}</div>
          {children && <div className="mt-3">{children}</div>}
        </div>
      </div>
    );
  };

  const ProgressBar = ({ value, max = 100, color = "blue" }) => {
    const colors = {
      blue: "bg-blue-400",
      green: "bg-green-400",
      orange: "bg-orange-400",
      purple: "bg-purple-400",
      red: "bg-red-400"
    };

    const percentage = Math.min(100, (value / max) * 100);

    return (
      <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
        <div
          className={`h-2.5 rounded-full ${colors[color]}`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    );
  };

  return (
    <div>
      <Toaster />

      {/* Logs Modal */}
      <Dialog
        open={openLogsModal}
        onClose={handleCloseLogs}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          style: {
            minHeight: '80vh',
            maxHeight: '80vh',
            backgroundColor: '#1f2937'
          }
        }}
      >
        <DialogTitle style={{ backgroundColor: '#111827', color: 'white', 
          borderBottom: '1px solid #374151' }}>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></div>
                <span className="font-bold text-lg">MikroTik System Logs</span>
              </div>
              <Chip
                label={`${logs.length} entries`}
                size="small"
                style={{ backgroundColor: '#3b82f6', color: 'white' }}
              />
            </div>
            <IconButton onClick={handleCloseLogs} style={{ color: 'white' }}>
              <IoClose size={24} />
            </IconButton>
          </div>
        </DialogTitle>

        <DialogContent style={{ padding: 0, backgroundColor: '#1f2937' }}>
          {/* Toolbar */}
          <div className="p-4 border-b border-gray-700 bg-gray-800">
            <div className="flex flex-wrap gap-4 items-center">
              <TextField
                size="small"
                placeholder="Search logs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: <IoSearch style={{ marginRight: 8, color: '#9ca3af' }} />,
                  style: { 
                    backgroundColor: '#374151', 
                    color: 'white',
                    width: 300
                  }
                }}
              />

              <FormControl size="small" style={{ minWidth: 120 }}>
                <Select
                  value={severityFilter}
                  onChange={(e) => setSeverityFilter(e.target.value)}
                  style={{ 
                    backgroundColor: '#374151', 
                    color: 'white',
                    height: 40
                  }}
                >
                  <MenuItem value="all">All Severities</MenuItem>
                  <MenuItem value="info">Info</MenuItem>
                  <MenuItem value="warning">Warning</MenuItem>
                  <MenuItem value="error">Error</MenuItem>
                  <MenuItem value="debug">Debug</MenuItem>
                </Select>
              </FormControl>

              <div className="flex items-center gap-2 ml-auto">
                <Tooltip title="Auto refresh">
                  <IconButton
                    size="small"
                    onClick={() => setAutoRefresh(!autoRefresh)}
                    style={{ 
                      color: autoRefresh ? '#3b82f6' : '#9ca3af',
                      backgroundColor: autoRefresh ? '#1e40af20' : 'transparent'
                    }}
                  >
                    {autoRefresh ? <IoEye size={20} /> : <IoEyeOff size={20} />}
                  </IconButton>
                </Tooltip>

                <FormControl size="small" style={{ minWidth: 100 }}>
                  <Select
                    value={autoRefreshInterval}
                    onChange={(e) => setAutoRefreshInterval(e.target.value)}
                    style={{ 
                      backgroundColor: '#374151', 
                      color: 'white',
                      height: 40
                    }}
                  >
                    <MenuItem value={2}>2 seconds</MenuItem>
                    <MenuItem value={5}>5 seconds</MenuItem>
                    <MenuItem value={10}>10 seconds</MenuItem>
                    <MenuItem value={30}>30 seconds</MenuItem>
                  </Select>
                </FormControl>

                <Button
                  variant="outlined"
                  startIcon={<IoRefresh />}
                  onClick={handleRefreshLogs}
                  disabled={loadingLogs}
                  style={{ 
                    color: '#3b82f6', 
                    borderColor: '#3b82f6',
                    height: 40
                  }}
                >
                  {loadingLogs ? <CircularProgress size={20} /> : 'Refresh'}
                </Button>

                <Button
                  variant="contained"
                  startIcon={<IoDownload />}
                  onClick={handleExportLogs}
                  style={{ 
                    backgroundColor: '#10b981',
                    color: 'white',
                    height: 40
                  }}
                >
                  Export
                </Button>
              </div>
            </div>
          </div>

          {/* Logs Table */}
          <TableContainer 
            component={Paper} 
            style={{ 
              backgroundColor: '#1f2937',
              height: 'calc(80vh - 200px)',
              overflow: 'auto'
            }}
          >
            <Table stickyHeader size="small">
              <TableHead>
                <TableRow style={{ backgroundColor: '#111827' }}>
                  <TableCell style={{ color: '#9ca3af', fontWeight: 'bold', borderColor: '#374151' }}>Time</TableCell>
                  <TableCell style={{ color: '#9ca3af', fontWeight: 'bold', borderColor: '#374151' }}>Severity</TableCell>
                  <TableCell style={{ color: '#9ca3af', fontWeight: 'bold', borderColor: '#374151' }}>Topics</TableCell>
                  <TableCell style={{ color: '#9ca3af', fontWeight: 'bold', borderColor: '#374151' }}>Message</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loadingLogs ? (
                  <TableRow>
                    <TableCell colSpan={4} align="center" style={{ color: '#9ca3af', borderColor: '#374151' }}>
                      <CircularProgress style={{ color: '#3b82f6' }} />
                    </TableCell>
                  </TableRow>
                ) : filteredLogs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} align="center" style={{ color: '#9ca3af', borderColor: '#374151' }}>
                      No logs found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredLogs
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((log, index) => (
                      <TableRow 
                        key={index} 
                        hover
                        style={{ 
                          backgroundColor: index % 2 === 0 ? '#1f2937' : '#111827',
                          borderColor: '#374151'
                        }}
                      >
                        <TableCell style={{ color: '#d1d5db', borderColor: '#374151', fontFamily: 'monospace' }}>
                          {log.time || '-'}
                        </TableCell>
                        <TableCell style={{ borderColor: '#374151' }}>
                          {getSeverityChip(log.topics)}
                        </TableCell>
                        <TableCell style={{ color: '#d1d5db', borderColor: '#374151' }}>
                          {log.topics || '-'}
                        </TableCell>
                        <TableCell style={{ color: '#d1d5db', borderColor: '#374151', whiteSpace: 'pre-wrap' }}>
                          {log.message || '-'}
                        </TableCell>
                      </TableRow>
                    ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination */}
          <div className="p-2 border-t border-gray-700 bg-gray-800">
            <TablePagination
              component="div"
              count={filteredLogs.length}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[10, 20, 50, 100]}
              style={{ color: '#9ca3af' }}
              classes={{
                root: 'text-gray-400',
                selectIcon: 'text-gray-400'
              }}
            />
          </div>
        </DialogContent>

        <DialogActions style={{ backgroundColor: '#111827', 
          borderTop: '1px solid #374151' }}>
          <div className="flex justify-between items-center w-full px-4 py-2">
            <div style={{ color: '#9ca3af', fontSize: '0.875rem' }}>
              Showing {filteredLogs.length} of {logs.length} log entries
            </div>
            <Button onClick={handleCloseLogs} style={{ color: '#9ca3af' }}>
              Close
            </Button>
          </div>
        </DialogActions>
      </Dialog>

      {status === 'Reachable' ? (
        <div className="space-y-6">
          {/* Main Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Uptime Card */}
            <StatCard
              icon={<FcAlarmClock className="w-6 h-6" />}
              title="System Uptime"
              value={uptime || "N/A"}
              color="purple"
            />

            {/* CPU Card */}
            <StatCard
              icon={<GoCpu className="w-6 h-6" />}
              title="CPU Load"
              value={cpuLoad || "0"}
              unit="%"
              color="orange"
            >
              <ProgressBar value={parseFloat(cpuLoad) || 0} color="orange" />
            </StatCard>

            {/* Memory Card */}
            <StatCard
              icon={<MdMemory className="w-6 h-6" />}
              title="Memory Usage"
              value={`${((totalMemory - freeMemory) / totalMemory * 100).toFixed(1)}`}
              unit="%"
              color="blue"
            >
              <div className="text-xs mb-1">
                {freeMemory} free of {totalMemory}
              </div>
              <ProgressBar
                value={((totalMemory - freeMemory) / totalMemory * 100)}
                color="blue"
              />
            </StatCard>

            {/* Disk Card */}
            <StatCard
              icon={<FiHardDrive className="w-6 h-6" />}
              title="Disk Usage"
              value={`${((totalHdd - freeHdd) / totalHdd * 100).toFixed(1)}`}
              unit="%"
              color="green"
            >
              <div className="text-xs mb-1">
                {freeHdd} free of {totalHdd}
              </div>
              <ProgressBar
                value={((totalHdd - freeHdd) / totalHdd * 100)}
                color="green"
              />
            </StatCard>
          </div>

          {/* Router Info Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Router Board Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden 
        border border-gray-200 dark:border-gray-700">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold flex items-center gap-2">
                    <GoServer className="text-blue-500" />
                    Router Board
                  </h3>
                  {currentRouterImage && (
                    <img
                      src={currentRouterImage}
                      alt="router"
                      className="w-16 h-16 object-contain"
                    />
                  )}
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Model:</span>
                    <span className="font-medium">{routerInfo || "N/A"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Version:</span>
                    <span className="font-medium">{routerVersion || "N/A"}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Architecture:</span>
                    <span className="font-medium">{archiTecture || "N/A"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Timezone:</span>
                    <span className="font-medium">{routerTimezone || "N/A"}</span>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700 space-y-3">
                  {/* View Logs Button */}
                  <button
                    onClick={handleOpenLogs}
                    className="w-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    View System Logs
                    <IoFilter className="w-5 h-5" />
                  </button>

                  {showRebootConfirm ? (
                    <div className="flex gap-3">
                      <button
                        onClick={rebootRouter}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                      >
                        Confirm Reboot
                      </button>
                      <button
                        onClick={() => setShowRebootConfirm(false)}
                        className="flex-1 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 py-2 px-4 rounded-lg transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={rebootRouter}
                      className="w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      Reboot Router
                      <IoWarningOutline className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Traffic Stats Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700 lg:col-span-2">
              <div className="p-6">
                <h3 className="text-lg font-bold flex items-center gap-2 mb-4">
                  <FcAreaChart className="w-6 h-6" />
                  Network Traffic
                </h3>

                <div className="mb-4">
                  <select
                    value={routerInterfaceForm}
                    onChange={(e) => {
                      setRouterInterfaceForm(e.target.value);
                      localStorage.setItem('routerInterfaceForm', e.target.value);
                      fetchTrafficStats(e.target.value);
                    }}
                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg
         focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700
          dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                  >
                    {routerInterface.map((option) => (
                      <option key={option.id} value={option.name}>
                        {option.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="h-80 pb-8 bg-white">
                  <TrafficStatsGraph trafficData={trafficData} />
                </div>
              </div>
            </div>
          </div>

          {/* Reboot Success Message */}
          {showSucessReboot && (
            <div className="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg animate-bounce">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                Router is rebooting. Please wait...
              </div>
            </div>
          )}
        </div>
      ) : <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center justify-center p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-red-100 dark:border-red-900 max-w-md mx-auto"
      >
        {/* Lottie Animation */}
        <div className="relative mb-6">
          <Lottie
            options={defaultOptions}
            height={200}
            width={200}
          />

          {/* Red alert circle around animation */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-48 h-48 rounded-full border-4 border-red-200 dark:border-red-800 opacity-60 animate-pulse"></div>
          </div>
        </div>

        {/* Error Message */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-center"
        >
          <h3 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-3">
            Connection Failed
          </h3>

          <p className="text-gray-600 dark:text-gray-300 mb-6 text-lg">
            {message}
          </p>

          {/* Additional Help Text */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg"
          >
            <p className="text-sm text-red-700 dark:text-red-300">
              💡 Check if the router is powered on and connected to the network
            </p>
          </motion.div>
        </motion.div>
      </motion.div>}
    </div>
  )
}

export default RouterDetails