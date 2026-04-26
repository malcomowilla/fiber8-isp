import React, { useEffect, useState, useCallback, useRef, useMemo } from "react";
import { motion } from "framer-motion";
import { useApplicationSettings } from '../settings/ApplicationSettings';
import { createConsumer } from "@rails/actioncable";
import { FaLongArrowAltUp } from "react-icons/fa";
import { FaLongArrowAltDown } from "react-icons/fa";
import ReactApexChart from 'react-apexcharts';
import { 
  BarChart3, TrendingDown, Download, Upload,   
  Wifi, 
  Clock,
  Globe,
  Cpu,
  Activity,
 
} from 'lucide-react';
import MaterialTable from 'material-table'
import { MdOutlineWifi } from "react-icons/md";
import toast, { Toaster } from 'react-hot-toast';
import EditPayment from '../edit/EditPayment'
import { IconButton, Tooltip, Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Avatar,
  Alert,
  Button
} from '@mui/material';
import { IoEyeOutline } from "react-icons/io5";
import { 
  IoWarningOutline,
  IoCheckmarkCircleOutline 
} from 'react-icons/io5';
const cable = createConsumer(`wss://${window.location.hostname}/cable`);

// Online Indicator Component
const OnlineIndicator = ({ size = "medium", showLabel = false }) => {
  const sizeClasses = {
    small: "h-2 w-2",
    medium: "h-3 w-3",
    large: "h-4 w-4"
  };

  const labelSizeClasses = {
    small: "text-xs",
    medium: "text-sm",
    large: "text-base"
  };

  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        {/* Outer pulse ring */}
        <div className={`absolute inset-0 animate-ping bg-green-500 rounded-full opacity-75 ${sizeClasses[size]}`}></div>
        {/* Inner solid circle */}
        <div className={`relative bg-green-500 rounded-full ${sizeClasses[size]}`}></div>
      </div>
      {showLabel && (
        <span className={`${labelSizeClasses[size]} text-green-600 
          font-medium`}>Online</span>
      )}
    </div>
  );
};

// Connection Speed Indicator
const ConnectionSpeedIndicator = ({ download, upload }) => {
  const formatSpeed = (bytes) => {
    if (!bytes) return "0 B";
    
    const KB = bytes / 1024;
    const MB = KB / 1024;
    const GB = MB / 1024;
    
    if (GB >= 1) return `${GB.toFixed(1)} GB`;
    if (MB >= 1) return `${MB.toFixed(1)} MB`;
    if (KB >= 1) return `${KB.toFixed(1)} KB`;
    return `${bytes} B`;
  };

  const getSpeedLevel = (speed) => {
    if (speed > 1000000) return "excellent";
    if (speed > 500000) return "good";
    if (speed > 100000) return "fair";
    return "poor";
  };

  const downloadLevel = getSpeedLevel(download);
  const uploadLevel = getSpeedLevel(upload);

  const levelColors = {
    excellent: "text-green-500",
    good: "text-blue-500",
    fair: "text-yellow-500",
    poor: "text-red-500"
  };

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2">
        <Download className={`w-3 h-3 ${levelColors[downloadLevel]}`} />
        <span className="text-sm font-medium">{formatSpeed(download)}</span>
      </div>
      <div className="flex items-center gap-2">
        <Upload className={`w-3 h-3 ${levelColors[uploadLevel]}`} />
        <span className="text-sm font-medium">{formatSpeed(upload)}</span>
      </div>
    </div>
  );
};

// Signal Strength Bars
const SignalStrength = ({ strength = 75 }) => {
  const getBarColor = (index) => {
    const thresholds = [20, 40, 60, 80];
    const colors = [
      strength > thresholds[3] ? "bg-green-500" : "bg-gray-300",
      strength > thresholds[2] ? "bg-green-400" : "bg-gray-300",
      strength > thresholds[1] ? "bg-yellow-500" : "bg-gray-300",
      strength > thresholds[0] ? "bg-red-500" : "bg-gray-300",
    ];
    return colors[index];
  };

  return (
    <div className="flex items-end gap-0.5">
      {[...Array(4)].map((_, index) => (
        <div
          key={index}
          className={`w-1.5 rounded-t-sm ${getBarColor(index)}`}
          style={{ height: `${(index + 1) * 0.5}rem` }}
        ></div>
      ))}
    </div>
  );
};

// User Avatar with Online Indicator
const UserAvatar = ({ username, isOnline = true }) => {
  const getInitials = (name) => {
    if (!name) return "?";
    return name.charAt(0).toUpperCase();
  };

  const getColorFromName = (name) => {
    if (!name) return "bg-blue-500";
    const colors = [
      "bg-blue-500", "bg-green-500", "bg-purple-500", 
      "bg-pink-500", "bg-orange-500", "bg-teal-500"
    ];
    const index = name.length % colors.length;
    return colors[index];
  };

  return (
    <div className="relative">
      <div className={`w-8 h-8 rounded-full ${getColorFromName(username)} flex items-center justify-center text-white font-semibold`}>
        {getInitials(username)}
      </div>
      {isOnline && (
        <div className="absolute -bottom-1 -right-1">
          <OnlineIndicator size="small" />
        </div>
      )}
    </div>
  );
};

// Uptime Formatter


const StatCard = ({ title, value, icon, color, download_arrow, 
  upload_arrow, 
  totalUpload, totalDownload, month_section, month }) => {
  const [animatedValue, setAnimatedValue] = useState(0);
  
  useEffect(() => {
    const animate = setTimeout(() => {
      setAnimatedValue(value);
    }, 500);
    return () => clearTimeout(animate);
  }, [value]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.03 }}
      className={`bg-gradient-to-br ${color} rounded-xl shadow-lg p-6
         overflow-hidden text-white`}
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">{title}</h3>
          <div className='flex gap-x-8'>
            <p className="text-3xl font-bold">{animatedValue}</p>
            <div className='flex items-center'>
              <div className='flex'>
                {download_arrow}
                <p className='text-lg'>{totalDownload}</p>
              </div>
              <div className='flex'>
                {upload_arrow}
                <p className='text-lg'>{totalUpload}</p>
              </div>
            </div>
            <p className='mt-5 text-black flex font-bold'>
              <span>{month}</span>{month_section}
            </p>
          </div>
        </div>
        <div className="text-4xl">{icon}</div>
      </div>
    </motion.div>
  );
};


const MemoizedHotspotTable = React.memo(({ data, columns, isMobile, onRowClick }) => {
    // Ref for the scrollable container
  const scrollContainerRef = useRef(null);
  // Ref to store the saved scroll position
  const savedScrollLeft = useRef(0);
  // Flag to detect user-initiated scroll
  const isUserScrolling = useRef(false);
  const scrollTimeout = useRef(null);

  // --- 1. Find the scrollable container after render ---
  useEffect(() => {
    // MaterialTable's scrollable container has class 'MuiTableContainer-root'
    const container = document.querySelector('.MuiTableContainer-root');
    if (container && container !== scrollContainerRef.current) {
      scrollContainerRef.current = container;
      
      // Attach scroll event listener
      const handleScroll = (e) => {
        isUserScrolling.current = true;
        savedScrollLeft.current = e.target.scrollLeft;
        
        clearTimeout(scrollTimeout.current);
        scrollTimeout.current = setTimeout(() => {
          isUserScrolling.current = false;
        }, 150);
      };
      
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, []); // runs once after mount

  // --- 2. Restore scroll position after data updates ---
  useEffect(() => {
    if (scrollContainerRef.current && !isUserScrolling.current) {
      scrollContainerRef.current.scrollLeft = savedScrollLeft.current;
    }
  }, [data]); // runs when `data` changes

  return (
    <MaterialTable
      columns={columns}
      onRowClick={onRowClick}
      title=""
      data={data}
      localization={{
                body: {
                  emptyDataSourceMessage: (
                    <div className="flex flex-col items-center
                     justify-center py-12">
                      <div className="relative mb-4">
                        <Wifi className="w-16 h-16 text-gray-300" />
                        <div className="absolute -top-2 -right-2">
                          <div className="h-6 w-6 bg-gray-300 
                          rounded-full flex items-center justify-center">
                            <span className="text-xs">0</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-500 text-lg font-medium mb-2">
                        No active connections
                      </p>
                      <p className="text-gray-400 text-sm">
                        All devices are currently offline
                      </p>
                    </div>
                  )
                },
              }}
      options={{
        sorting: true,
        pageSizeOptions: [10, 25, 50],
        pageSize: 10,
        paginationType: 'stepped',
        exportButton: true,
        exportAllData: true,
        selection: false,
        search: false,
        showSelectAllCheckbox: false,
        showTextRowsSelected: false,
        emptyRowsWhenPaging: false,
        draggable: false,
      }}
      components={{
        Container: props => (
          <div className="rounded-lg overflow-x-auto border border-gray-200">
            {props.children}
          </div>
        )
      }}
    />
  );
});

// ✅ Add display name
MemoizedHotspotTable.displayName = 'MemoizedHotspotTable';


const DashboardStatistics = () => {
  const [expiredVouchers, setExpiredVouchers] = useState(0);
  const [activeVouchers, setActiveVouchers] = useState(0);
  const [onlineUsers, setOnlineUsers] = useState(0);
  const [totalBandwidth, setTotalBandwidth] = useState(0);
  const [totalDownload, setTotalDownload] = useState(0);
  const [totalUpload, setTotalUpload] = useState(0);
  const [hostpotStats, setHotspotStats] = useState([]);
  const [todaysRevenue, setTodaysRevenue] = useState(0);
  const [thisMonthsRevenue, setThisMonthsRevenue] = useState(0);
  const { settingsformData, setFormData,expiry, setExpiry, 
    expiry2, setExpiry2,
     condition, setCondition,
        condition2, setCondition2, status, setStatus, status2, 
        setStatus2,
        currentHotspotPlan, setCurrentHotspotPlan, currentPPOEPlan,
         setCurrentPPOEPlan, calculateTimeRemaining } = useApplicationSettings();


  const [open, setOpen] = useState(false);
  const subdomain = window.location.hostname.split('.')[0];
  const dataHistory = useRef([]);
  const maxDataPoints = 20;



  

 const getCurrentHotspotPlan = useCallback(
    async() => {
      const response = await fetch('/api/get_current_hotspot_plan', {
        headers: {
          'X-Subdomain': subdomain,
        },
      })
      const newData = await response.json()
      if (response.ok) {

        if (newData.length === 0) {
          setExpiry2('No license')
          setStatus2('Not Active')
           setStatus2(newData[0]?.status)
        } else {
        setExpiry2(newData[0]?.expiry)
        setCondition2(newData[0]?.condition)
        setStatus2(newData[0]?.status)
        setCurrentHotspotPlan(newData[0]?.name)
        }
        
        // setCurrentPPOEPlan(newData.message)
      }
    },
    [],
  )

useEffect(() => {
  getCurrentHotspotPlan()
 
}, [getCurrentHotspotPlan]);











  const getThisMonthsRevenue = useCallback(async () => {
    try {
      const response = await fetch('/api/this_month_revenue', {
        headers: { 'X-Subdomain': subdomain },
      });
      const newData = await response.json();
      if (response.ok) {
        setThisMonthsRevenue(newData);
      } else {
        setThisMonthsRevenue(0);
      }
    } catch (error) {
      setThisMonthsRevenue(0);
    }
  }, [subdomain]);

  

  const getTodaysRevenue = useCallback(async () => {
    try {
      const response = await fetch('/api/todays_revenue', {
        headers: { 'X-Subdomain': subdomain },
      });
      const newData = await response.json();
      if (response.ok) {
        setTodaysRevenue(newData);
      } else {
        setTodaysRevenue(0);
      }
    } catch (error) {
      setTodaysRevenue(0);
    }
  }, [subdomain]);

  const fetchRouters = useCallback(async () => {
    try {
      const response = await fetch('/api/allow_get_router_settings', {
        headers: { 'X-Subdomain': subdomain },
      });
      const newData = await response.json();
      if (response) {
        const { router_name } = newData[0];
        setFormData({...settingsformData, router_name});
      }
    } catch (error) {
    }
  }, []);





    useEffect(() => {
      fetchRouters();
     
    }, [fetchRouters]);

  const [chartData, setChartData] = useState({
    series: [
      { name: "Download Speed", data: [] },
      { name: "Upload Speed", data: [] }
    ],
    options: {
      chart: {
        height: 350,
        type: 'line',
        animations: {
          enabled: true,
          easing: 'linear',
          dynamicAnimation: { speed: 1000 }
        },
        dropShadow: {
          enabled: true,
          color: '#000',
          top: 18,
          left: 7,
          blur: 10,
          opacity: 0.2
        },
        zoom: { enabled: false },
        toolbar: { show: false },
        foreColor: '#374151'
      },
      colors: ['#77B6EA', '#545454'],
      dataLabels: { enabled: false },
      stroke: { curve: 'smooth', width: 3 },
      title: {
        text: 'Real-Time Bandwidth Usage',
        align: 'left',
        style: { fontSize: '16px', fontWeight: 'bold' }
      },
      grid: {
        borderColor: '#e7e7e7',
        row: {
          colors: ['#f8f9fa', 'transparent'],
          opacity: 0.5
        },
      },
      markers: {
        size: 0,
        hover: { size: 5 }
      },
      xaxis: {
        type: 'datetime',
        labels: {
          datetimeUTC: false,
          formatter: function(value, timestamp) {
            const date = new Date(timestamp);
            return date.toLocaleTimeString('en-US', {
              hour12: false,
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit'
            });
          }
        },
        title: { text: 'Time' }
      },
      yaxis: {
        title: { text: 'Speed (Mbps)' },
        min: 0,
        labels: {
          formatter: function(value) {
            return `${value} Mbps`;
          }
        }
      },
      legend: {
        position: 'top',
        horizontalAlign: 'right',
        floating: true,
        offsetY: -25,
        offsetX: -5
      },
      tooltip: {
        x: { format: 'HH:mm:ss' },
        y: {
          formatter: function(value) {
            return `${value} Mbps`;
          }
        }
      }
    },
  });



let pollInterval = 35000;
let intervalId = null;




const getHotspotStats = useCallback(
  async() => {
     try {
      const res = await fetch(
        `/api/hotspot_traffic`,
        {
          method: "GET",
          headers: {
            "X-Subdomain": subdomain,
          },
        }
      );

      const data = await res.json();

      if (res.ok) {
        clearInterval(intervalId);
        setHotspotStats(data.users);
        setOnlineUsers(data.active_user_count);


           const now = new Date().getTime();
         const newEntry = {
            timestamp: now,
            download: data.total_download || 0,
            upload: data.total_upload || 0,
            total: data.total_bandwidth || 0
          };

           setTotalBandwidth(data.total_bandwidth);
          setTotalDownload(data.total_download);
          setTotalUpload(data.total_upload);

           dataHistory.current = [...dataHistory.current, newEntry].slice(-maxDataPoints);
          
          setChartData(prev => ({
            ...prev,
            series: [
              {
                name: "Download Speed",
                data: dataHistory.current.map(entry => [entry.timestamp, entry.download])
              },
              {
                name: "Upload Speed", 
                data: dataHistory.current.map(entry => [entry.timestamp, entry.upload])
              }
            ]
          }));
      }
    } catch (err) {
    }
  },
  [],
)





useEffect(() => {
  getHotspotStats()
}, [getHotspotStats]);





  useEffect(() => {
    const subscription = cable.subscriptions.create(
      { channel: "HotspotChannel", "X-Subdomain": subdomain },
      {
        received(data) {
          setOnlineUsers(data.active_user_count);
          setHotspotStats(data.users);
          
          const now = new Date().getTime();
          const newEntry = {
            timestamp: now,
            download: data.total_download || 0,
            upload: data.total_upload || 0,
            total: data.total_bandwidth || 0
          };
          
          setTotalBandwidth(data.total_bandwidth);
          setTotalDownload(data.total_download);
          setTotalUpload(data.total_upload);
          
          dataHistory.current = [...dataHistory.current, newEntry].slice(-maxDataPoints);
          
          setChartData(prev => ({
            ...prev,
            series: [
              {
                name: "Download Speed",
                data: dataHistory.current.map(entry => [entry.timestamp, entry.download])
              },
              {
                name: "Upload Speed", 
                data: dataHistory.current.map(entry => [entry.timestamp, entry.upload])
              }
            ]
          }));
        },
        connected() {

        },
        disconnected() {

        },
      }
    );

    return () => subscription.unsubscribe();
  }, [subdomain]);








  const getActiveVouchers = useCallback(async () => {
    try {
      const response = await fetch('/api/hotspot_vouchers', {
        headers: { 'X-Subdomain': subdomain },
      });
      const newData = await response.json();
      if (response.ok) {
        const activeCount = newData?.filter(voucher => voucher.status === 'active').length;
        setActiveVouchers(activeCount);
      } else {
        setActiveVouchers(0);
      }
    } catch (error) {
      setActiveVouchers(0);
    }
  }, [subdomain]);


  const getExpiredVouchers = useCallback(async () => {
    try {
      const response = await fetch('/api/hotspot_vouchers', {
        headers: { 'X-Subdomain': subdomain },
      });
      const newData = await response.json();
      if (response.ok) {
        const expiredCount = newData?.filter(voucher => voucher.status === "expired").length;
        setExpiredVouchers(expiredCount);
      } else {
        setExpiredVouchers(0);
      }
    } catch (error) {
      setExpiredVouchers(0);
    }
  }, [subdomain]);





  useEffect(() => {
    
   getThisMonthsRevenue();
  }, [getThisMonthsRevenue]);



    useEffect(() => {
      
      getTodaysRevenue()
    }, [getTodaysRevenue]);




    


    useEffect(() => {
      getActiveVouchers();
     
    }, [getActiveVouchers]);



    useEffect(() => {
      getExpiredVouchers()
     
    }, [getExpiredVouchers]);

  
  const columns = useMemo(() => 

    [
    
    {
      title: 'User',
      field: 'username',
      render: (rowData) => (
        <div className="flex items-center gap-3">
          <UserAvatar username={rowData.username} isOnline={true} />
          <div>
            <p className="font-medium text-gray-900">{rowData.username || rowData.mac_address}</p>
            <div className="flex items-center gap-1">
              <Globe className="w-3 h-3 text-gray-500" />
              <code className="text-xs text-gray-500">{rowData.ip_address || 'N/A'}</code>
            </div>
          </div>
        </div>
      ), 
    },
    {
      title: 'Connection',
      field: 'connection',
      render: (rowData) => (
        <div className="flex items-center gap-3">
          <SignalStrength strength={Math.min(100, ((rowData.download || 0) + (rowData.upload || 0)) / 500000)} />
          <ConnectionSpeedIndicator download={rowData.download} upload={rowData.upload} />
        </div>
      ),
    },
    {
      title: 'Duration',
      field: 'up_time',
      render: (rowData) => (
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-blue-500" />
          <span className="font-medium">{rowData.up_time}</span>
        </div>
      ),
    },
    {
      title: 'Speed',
      field: 'speed',
      render: (rowData) => (
        <div className="space-y-1">
          <div className="flex items-center gap-1">
            <Download className="w-3 h-3 text-blue-500" />
            <span className="text-sm font-medium">{rowData.download}</span>
          </div>
          <div className="flex items-center gap-1">
            <Upload className="w-3 h-3 text-green-500" />
            <span className="text-sm font-medium">{rowData.upload}</span>
          </div>
        </div>
      ),
    },
    {
      title: 'Device',
      field: 'mac_address',
      render: (rowData) => (
        <div className="flex items-center gap-2">
          <Cpu className="w-4 h-4 text-gray-500" />
          <code className="text-xs font-mono bg-gray-100 px-2 py-1 rounded">
            {rowData.mac_address ? rowData.mac_address.toUpperCase() : 'N/A'}
          </code>
        </div>
      ),
    },
    {
      title: 'Actions',
      field: 'actions',
      sorting: false,
      render: (rowData) => (
        <div className="flex items-center gap-1">
          <Tooltip title="View Details">
            <IconButton size="small" className="hover:bg-blue-50">
              <IoEyeOutline className="text-blue-500 text-lg" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Disconnect">
            <IconButton size="small" className="hover:bg-red-50">
              <MdOutlineWifi className="text-red-500 text-lg" />
            </IconButton>
          </Tooltip>
        </div>
      ),
    },
  ],
     [])

  const stats = [
    {
      title: <p className='text-black font-light'>Active Vouchers</p>,
      value: <p className='text-black'>{activeVouchers}</p>,
      icon: <Activity className="w-6 h-6 text-green-600" />,
      color: "bg-green-100",
    },
    {
      title: <p className='font-light text-black'>Expired Vouchers</p>,
      value: <p className='text-black'>{expiredVouchers}</p>,
      icon: <TrendingDown className="w-6 h-6 text-red-600" />,
      color: "bg-red-100", 
    },
    {
      title: <p className='text-black font-light'>Online Users</p>,
      value: (
        <div className="flex items-center gap-2">
          <p className='text-black'>{onlineUsers}</p>
          {onlineUsers > 0 && <OnlineIndicator size="small" />}
        </div>
      ),
      icon: <Wifi className="w-6 h-6 text-blue-600" />,
      color: "bg-blue-100",
    },
    {
      title: <p className='text-black font-light'>Data Consumed (24H)</p>,
      value: <p className='font-light text-black'>{totalBandwidth}</p>,
      icon: <BarChart3 className="w-6 h-6 text-teal-600" />,
      color: "bg-teal-100",
      upload_arrow: <FaLongArrowAltUp className='text-green-500 h-6'/>,
      download_arrow: <FaLongArrowAltDown className='h-6 text-green-500'/>,
      totalUpload: <p className='text-black'>{totalUpload}</p>,
      totalDownload: <p className='text-black'>{totalDownload}</p>,
    },
  ];

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);


  const [selectedUser, setSelectedUser] = useState(null);
const [modalOpen, setModalOpen] = useState(false);

const handleUserClick = (event, rowData) => {
  setSelectedUser(rowData);
  setModalOpen(true);
};

  return (
    <>

    <Dialog open={modalOpen} onClose={() => setModalOpen(false)} maxWidth="md" fullWidth>
  <DialogTitle>User Details</DialogTitle>
  <DialogContent dividers>
    {selectedUser && (
      <div>
        <p><strong>Username:</strong> {selectedUser.username}</p>
        <p><strong>IP:</strong> {selectedUser.ip_address}</p>
        <p><strong>MAC:</strong> {selectedUser.mac_address}</p>
        <p><strong>Download:</strong> {selectedUser.download}</p>
        <p><strong>Upload:</strong> {selectedUser.upload}</p>
        <p><strong>Uptime:</strong> {selectedUser.up_time}</p>
        {/* Add more fields as needed */}
      </div>
    )}
  </DialogContent>
  <DialogActions>
    <Button onClick={() => setModalOpen(false)}>Close</Button>
  </DialogActions>
</Dialog>


      <h1 className="text-2xl 
       font-bold mb-3 inline-block">
        Hotspot Statistics
      </h1>


      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {stats.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            color={stat.color}
            download_arrow={stat.download_arrow}
            upload_arrow={stat.upload_arrow}
            totalUpload={stat.totalUpload}
            totalDownload={stat.totalDownload}
            month_section={stat.month_section}
            month={stat.month}
          />


        ))}


<div className='lg:col-span-5 space-y-1 flex flex-col justify-center mt-4'>
  

</div>



        <div className="lg:col-span-8 space-y-1 
         mt-4 md:hidden">
            <MemoizedHotspotTable
    data={hostpotStats}
    columns={columns}
    isMobile={true}
     onRowClick={handleUserClick}
  />
        </div>
      </div>



 <div className="hidden md:block lg:col-span-8 
 space-y-1   mt-4">
             <MemoizedHotspotTable
    data={hostpotStats}
    columns={columns}
    isMobile={false}
     onRowClick={handleUserClick}
  />
        </div>
      
      <Toaster />
      <EditPayment open={open} handleClose={handleClose} />
    </>
  );
};

export default DashboardStatistics;