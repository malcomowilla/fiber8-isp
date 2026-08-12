import React, { useEffect, useState, useCallback, useRef, useMemo } from "react";
import { motion } from "framer-motion";
import { useApplicationSettings } from '../settings/ApplicationSettings';
import { createConsumer } from "@rails/actioncable";
import { FaLongArrowAltUp, FaLongArrowAltDown } from "react-icons/fa";
import ReactApexChart from 'react-apexcharts';
import {
  BarChart3, TrendingDown, Download, Upload,
  Wifi, Clock, Globe, Cpu, Activity, X,
} from 'lucide-react';
import MaterialTable from 'material-table';
import { MdOutlineWifi } from "react-icons/md";
import toast, { Toaster } from 'react-hot-toast';
import EditPayment from '../edit/EditPayment';
import {
  IconButton, Tooltip, Dialog, DialogTitle, DialogContent, DialogActions, Button,
} from '@mui/material';
import { IoEyeOutline } from "react-icons/io5";
import { ThemeProvider, createTheme } from '@mui/material/styles';

const cable = createConsumer(`wss://${window.location.hostname}/cable`);

/* ---------------------------------------------------------------------- */
/*  Shared: dark-mode detection (single source of truth)                  */
/* ---------------------------------------------------------------------- */

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

/* ---------------------------------------------------------------------- */
/*  Small presentational pieces                                           */
/* ---------------------------------------------------------------------- */

// Online Indicator
const OnlineIndicator = ({ size = "medium", showLabel = false }) => {
  const sizeClasses = { small: "h-2 w-2", medium: "h-2.5 w-2.5", large: "h-3.5 w-3.5" };
  const labelSizeClasses = { small: "text-xs", medium: "text-sm", large: "text-base" };

  return (
    <div className="flex items-center gap-1.5 font-sans">
      <span className="relative flex">
        <span className={`absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60 ${sizeClasses[size]}`} />
        <span className={`relative inline-flex rounded-full bg-emerald-500 ring-2 ring-white dark:ring-gray-900 ${sizeClasses[size]}`} />
      </span>
      {showLabel && (
        <span className={`${labelSizeClasses[size]} font-medium text-emerald-600 dark:text-emerald-400`}>
          Online
        </span>
      )}
    </div>
  );
};

// Connection Speed Indicator
const ConnectionSpeedIndicator = ({ download, upload }) => {
  const formatSpeed = (bytes) => {
    if (!bytes) return "0 B";
    const KB = bytes / 1024, MB = KB / 1024, GB = MB / 1024;
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

  const levelColors = {
    excellent: "text-emerald-500",
    good: "text-sky-500",
    fair: "text-amber-500",
    poor: "text-rose-500",
  };

  return (
    <div className="flex flex-col gap-1 font-sans text-sm">
      <div className="flex items-center gap-1.5">
        <Download className={`h-3.5 w-3.5 ${levelColors[getSpeedLevel(download)]}`} />
        <span className="font-medium text-gray-700 dark:text-gray-200">{formatSpeed(download)}</span>
      </div>
      <div className="flex items-center gap-1.5">
        <Upload className={`h-3.5 w-3.5 ${levelColors[getSpeedLevel(upload)]}`} />
        <span className="font-medium text-gray-700 dark:text-gray-200">{formatSpeed(upload)}</span>
      </div>
    </div>
  );
};

// Signal Strength Bars
const SignalStrength = ({ strength = 75 }) => {
  const getBarColor = (index) => {
    const thresholds = [20, 40, 60, 80];
    const colors = [
      strength > thresholds[3] ? "bg-emerald-500" : "bg-gray-200 dark:bg-gray-700",
      strength > thresholds[2] ? "bg-emerald-400" : "bg-gray-200 dark:bg-gray-700",
      strength > thresholds[1] ? "bg-amber-400" : "bg-gray-200 dark:bg-gray-700",
      strength > thresholds[0] ? "bg-rose-400" : "bg-gray-200 dark:bg-gray-700",
    ];
    return colors[index];
  };

  return (
    <div className="flex items-end gap-0.5">
      {[...Array(4)].map((_, index) => (
        <div
          key={index}
          className={`w-1.5 rounded-t-sm transition-colors ${getBarColor(index)}`}
          style={{ height: `${(index + 1) * 0.45}rem` }}
        />
      ))}
    </div>
  );
};

// User Avatar with online dot
const UserAvatar = ({ username, isOnline = true }) => {
  const getInitials = (name) => (name ? name.charAt(0).toUpperCase() : "?");

  const gradients = [
    "from-sky-500 to-blue-600",
    "from-emerald-500 to-teal-600",
    "from-violet-500 to-purple-600",
    "from-pink-500 to-rose-600",
    "from-amber-500 to-orange-600",
    "from-cyan-500 to-teal-600",
  ];
  const gradient = username
    ? gradients[username.length % gradients.length]
    : "from-gray-400 to-gray-500";

  return (
    <div className="relative shrink-0">
      <div className={`flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br ${gradient} font-sans text-sm font-semibold text-white shadow-sm`}>
        {getInitials(username)}
      </div>
      {isOnline && (
        <span className="absolute -bottom-0.5 -right-0.5">
          <OnlineIndicator size="small" />
        </span>
      )}
    </div>
  );
};

/* ---------------------------------------------------------------------- */
/*  KPI Stat Card                                                         */
/* ---------------------------------------------------------------------- */

const iconWrapStyles = {
  emerald: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400",
  rose: "bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400",
  sky: "bg-sky-50 text-sky-600 dark:bg-sky-500/10 dark:text-sky-400",
  teal: "bg-teal-50 text-teal-600 dark:bg-teal-500/10 dark:text-teal-400",
};

const StatCard = ({ title, value, icon, accent = "sky", trend, index = 0 }) => {
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    const t = setTimeout(() => setDisplayValue(value), 150);
    return () => clearTimeout(t);
  }, [value]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.05 }}
      whileHover={{ y: -2 }}
      className="group relative overflow-hidden rounded-2xl border border-gray-200/80 bg-white p-5 font-sans shadow-sm transition-shadow hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="truncate text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
            {title}
          </p>
          <p className="mt-2 text-2xl font-semibold tabular-nums text-gray-900 dark:text-gray-50">
            {displayValue}
          </p>
        </div>
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${iconWrapStyles[accent]}`}>
          {icon}
        </div>
      </div>

      {trend && (
        <div className="mt-3 flex items-center gap-3 border-t border-gray-100 pt-3 dark:border-gray-800">
          <div className="flex items-center gap-1 text-xs">
            <FaLongArrowAltDown className="h-3 w-3 text-emerald-500" />
            <span className="font-medium text-gray-600 dark:text-gray-300">{trend.download}</span>
          </div>
          <div className="flex items-center gap-1 text-xs">
            <FaLongArrowAltUp className="h-3 w-3 text-sky-500" />
            <span className="font-medium text-gray-600 dark:text-gray-300">{trend.upload}</span>
          </div>
        </div>
      )}
    </motion.div>
  );
};

/* ---------------------------------------------------------------------- */
/*  Table                                                                  */
/* ---------------------------------------------------------------------- */

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-16 font-sans">
    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 dark:bg-gray-800">
      <Wifi className="h-7 w-7 text-gray-400 dark:text-gray-500" />
    </div>
    <p className="mb-1 text-sm font-semibold text-gray-700 dark:text-gray-200">
      No active connections
    </p>
    <p className="text-xs text-gray-400 dark:text-gray-500">
      All devices are currently offline
    </p>
  </div>
);

const MemoizedHotspotTable = React.memo(({ data, columns, isMobile, onRowClick, isDark, tableTheme }) => {
  const scrollContainerRef = useRef(null);
  const savedScrollLeft = useRef(0);
  const isUserScrolling = useRef(false);
  const scrollTimeout = useRef(null);

  useEffect(() => {
    const container = document.querySelector('.MuiTableContainer-root');
    if (container && container !== scrollContainerRef.current) {
      scrollContainerRef.current = container;

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
  }, []);

  useEffect(() => {
    if (scrollContainerRef.current && !isUserScrolling.current) {
      scrollContainerRef.current.scrollLeft = savedScrollLeft.current;
    }
  }, [data]);

  return (
    <MaterialTable
      columns={columns}
      onRowClick={onRowClick}
      title=""
      data={data}
      localization={{
        body: { emptyDataSourceMessage: <EmptyState /> },
      }}
      options={{
        sorting: true,
        pageSizeOptions: [5, 10, 20, 50],
        pageSize: 10,
        paginationPosition: 'bottom',
        exportButton: true,
        exportAllData: true,
        selection: true,
        search: true,
        searchAutoFocus: false,
        showSelectAllCheckbox: false,
        showTextRowsSelected: false,
        emptyRowsWhenPaging: false,
        actionsColumnIndex: -1,
        headerStyle: {
          fontFamily: 'inherit',
          textTransform: 'uppercase',
          fontWeight: 600,
          fontSize: '11px',
          letterSpacing: '0.04em',
          backgroundColor: isDark ? '#111827' : '#f9fafb',
          color: isDark ? '#9ca3af' : '#6b7280',
          borderBottom: isDark ? '1px solid #1f2937' : '1px solid #e5e7eb',
        },
        rowStyle: (rowData, index) => ({
          backgroundColor: isDark
            ? (index % 2 === 0 ? '#111827' : '#0d1420')
            : (index % 2 === 0 ? '#ffffff' : '#fafafa'),
          color: isDark ? '#e5e7eb' : '#1f2937',
          fontFamily: 'inherit',
          transition: 'background-color 0.15s ease',
        }),
      }}
      components={{
        Container: (props) => (
          <div className="overflow-x-auto rounded-2xl border border-gray-200 font-sans dark:border-gray-800">
            {props.children}
          </div>
        ),
      }}
    />
  );
});

MemoizedHotspotTable.displayName = 'MemoizedHotspotTable';

/* ---------------------------------------------------------------------- */
/*  User details modal                                                    */
/* ---------------------------------------------------------------------- */

const DetailRow = ({ label, value }) => (
  <div className="flex items-center justify-between border-b border-gray-100 py-2.5 last:border-0 dark:border-gray-800">
    <span className="text-xs font-medium uppercase tracking-wide text-gray-400 dark:text-gray-500">
      {label}
    </span>
    <span className="font-mono text-sm text-gray-800 dark:text-gray-100">
      {value ?? '—'}
    </span>
  </div>
);

/* ---------------------------------------------------------------------- */
/*  Main component                                                        */
/* ---------------------------------------------------------------------- */

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

  const {
    settingsformData, setFormData, setExpiry2, setCondition2, setStatus2,
    setCurrentHotspotPlan,
  } = useApplicationSettings();

  const [open, setOpen] = useState(false);
  const subdomain = window.location.hostname.split('.')[0];
  const dataHistory = useRef([]);
  const maxDataPoints = 20;

  const isDark = useIsDarkMode();

  const tableTheme = useMemo(() => createTheme({
    palette: {
      mode: isDark ? 'dark' : 'light',
      background: {
        paper: isDark ? '#111827' : '#ffffff',
        default: isDark ? '#111827' : '#ffffff',
      },
      text: {
        primary: isDark ? '#f3f4f6' : '#111827',
        secondary: isDark ? '#9ca3af' : '#6b7280',
      },
    },
    typography: { fontFamily: 'inherit' },
  }), [isDark]);

  const getCurrentHotspotPlan = useCallback(async () => {
    const response = await fetch('/api/get_current_hotspot_plan', {
      headers: { 'X-Subdomain': subdomain },
    });
    const newData = await response.json();
    if (response.ok) {
      if (newData.length === 0) {
        setExpiry2('No license');
        setStatus2('Not Active');
      } else {
        setExpiry2(newData[0]?.expiry);
        setCondition2(newData[0]?.condition);
        setStatus2(newData[0]?.status);
        setCurrentHotspotPlan(newData[0]?.name);
      }
    }
  }, [subdomain, setExpiry2, setCondition2, setStatus2, setCurrentHotspotPlan]);

  useEffect(() => { getCurrentHotspotPlan(); }, [getCurrentHotspotPlan]);

  const getThisMonthsRevenue = useCallback(async () => {
    try {
      const response = await fetch('/api/this_month_revenue', { headers: { 'X-Subdomain': subdomain } });
      const newData = await response.json();
      setThisMonthsRevenue(response.ok ? newData : 0);
    } catch {
      setThisMonthsRevenue(0);
    }
  }, [subdomain]);

  const getTodaysRevenue = useCallback(async () => {
    try {
      const response = await fetch('/api/todays_revenue', { headers: { 'X-Subdomain': subdomain } });
      const newData = await response.json();
      setTodaysRevenue(response.ok ? newData : 0);
    } catch {
      setTodaysRevenue(0);
    }
  }, [subdomain]);

  const fetchRouters = useCallback(async () => {
    try {
      const response = await fetch('/api/allow_get_router_settings', { headers: { 'X-Subdomain': subdomain } });
      const newData = await response.json();
      if (response.ok) {
        const { router_name } = newData[0];
        setFormData({ ...settingsformData, router_name });
      }
    } catch {
      /* noop */
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subdomain]);

  useEffect(() => { fetchRouters(); }, [fetchRouters]);

  const [chartData, setChartData] = useState({
    series: [
      { name: "Download Speed", data: [] },
      { name: "Upload Speed", data: [] },
    ],
    options: {
      chart: {
        height: 340,
        type: 'area',
        fontFamily: 'inherit',
        animations: { enabled: true, easing: 'linear', dynamicAnimation: { speed: 800 } },
        toolbar: { show: false },
        zoom: { enabled: false },
      },
      colors: ['#0ea5e9', '#10b981'],
      fill: {
        type: 'gradient',
        gradient: { shadeIntensity: 1, opacityFrom: 0.35, opacityTo: 0.02, stops: [0, 90, 100] },
      },
      dataLabels: { enabled: false },
      stroke: { curve: 'smooth', width: 2.5 },
      grid: { borderColor: 'rgba(148,163,184,0.2)', strokeDashArray: 3 },
      markers: { size: 0, hover: { size: 4 } },
      xaxis: {
        type: 'datetime',
        labels: {
          datetimeUTC: false,
          style: { fontFamily: 'inherit', fontSize: '11px' },
          formatter: (value, timestamp) =>
            new Date(timestamp).toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        },
        axisBorder: { show: false },
        axisTicks: { show: false },
      },
      yaxis: {
        labels: {
          style: { fontFamily: 'inherit', fontSize: '11px' },
          formatter: (value) => `${value} Mbps`,
        },
      },
      legend: {
        position: 'top',
        horizontalAlign: 'right',
        fontFamily: 'inherit',
        fontSize: '13px',
        markers: { radius: 4 },
      },
      tooltip: { x: { format: 'HH:mm:ss' }, y: { formatter: (value) => `${value} Mbps` } },
    },
  });

  // Keep the chart theme (text/legend color) in sync with light/dark mode.
  useEffect(() => {
    setChartData((prev) => ({
      ...prev,
      options: {
        ...prev.options,
        chart: { ...prev.options.chart, foreColor: isDark ? '#9ca3af' : '#6b7280' },
        grid: { ...prev.options.grid, borderColor: isDark ? 'rgba(75,85,99,0.35)' : 'rgba(148,163,184,0.25)' },
      },
    }));
  }, [isDark]);

  const applyLiveUpdate = useCallback((data) => {
    setHotspotStats(data.users);
    setOnlineUsers(data.active_user_count);

    const now = Date.now();
    const newEntry = {
      timestamp: now,
      download: data.total_download || 0,
      upload: data.total_upload || 0,
      total: data.total_bandwidth || 0,
    };

    setTotalBandwidth(data.total_bandwidth);
    setTotalDownload(data.total_download);
    setTotalUpload(data.total_upload);

    dataHistory.current = [...dataHistory.current, newEntry].slice(-maxDataPoints);

    setChartData((prev) => ({
      ...prev,
      series: [
        { name: "Download Speed", data: dataHistory.current.map((e) => [e.timestamp, e.download]) },
        { name: "Upload Speed", data: dataHistory.current.map((e) => [e.timestamp, e.upload]) },
      ],
    }));
  }, []);

  const getHotspotStats = useCallback(async () => {
    try {
      const res = await fetch('/api/hotspot_traffic', {
        method: "GET",
        headers: { "X-Subdomain": subdomain },
      });
      const data = await res.json();
      if (res.ok) applyLiveUpdate(data);
    } catch {
      /* noop */
    }
  }, [subdomain, applyLiveUpdate]);

  useEffect(() => { getHotspotStats(); }, [getHotspotStats]);

  useEffect(() => {
    const subscription = cable.subscriptions.create(
      { channel: "HotspotChannel", "X-Subdomain": subdomain },
      { received: applyLiveUpdate },
    );
    return () => subscription.unsubscribe();
  }, [subdomain, applyLiveUpdate]);

  const getActiveVouchers = useCallback(async () => {
    try {
      const response = await fetch('/api/hotspot_vouchers', { headers: { 'X-Subdomain': subdomain } });
      const newData = await response.json();
      setActiveVouchers(response.ok ? newData?.filter((v) => v.status === 'active').length : 0);
    } catch {
      setActiveVouchers(0);
    }
  }, [subdomain]);

  const getExpiredVouchers = useCallback(async () => {
    try {
      const response = await fetch('/api/hotspot_vouchers', { headers: { 'X-Subdomain': subdomain } });
      const newData = await response.json();
      setExpiredVouchers(response.ok ? newData?.filter((v) => v.status === "expired").length : 0);
    } catch {
      setExpiredVouchers(0);
    }
  }, [subdomain]);

  useEffect(() => { getThisMonthsRevenue(); }, [getThisMonthsRevenue]);
  useEffect(() => { getTodaysRevenue(); }, [getTodaysRevenue]);
  useEffect(() => { getActiveVouchers(); }, [getActiveVouchers]);
  useEffect(() => { getExpiredVouchers(); }, [getExpiredVouchers]);

  const columns = useMemo(() => [
    {
      title: 'User',
      field: 'username',
      render: (rowData) => (
        <div className="flex items-center gap-3 font-sans">
          <UserAvatar username={rowData.username} isOnline />
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-gray-900 dark:text-gray-100">
              {rowData.username || rowData.mac_address}
            </p>
            <div className="flex items-center gap-1">
              <Globe className="h-3 w-3 text-gray-400 dark:text-gray-500" />
              <code className="text-xs text-gray-400 dark:text-gray-500">{rowData.ip_address || 'N/A'}</code>
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
        <div className="flex items-center gap-2 font-sans text-sm">
          <Clock className="h-3.5 w-3.5 text-sky-500" />
          <span className="font-medium text-gray-700 dark:text-gray-200">{rowData.up_time}</span>
        </div>
      ),
    },
    {
      title: 'Device',
      field: 'mac_address',
      render: (rowData) => (
        <div className="flex items-center gap-2">
          <Cpu className="h-3.5 w-3.5 text-gray-400 dark:text-gray-500" />
          <code className="rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-300">
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
          <Tooltip title="View details">
            <IconButton size="small">
              <IoEyeOutline className="text-lg text-sky-500" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Disconnect">
            <IconButton size="small">
              <MdOutlineWifi className="text-lg text-rose-500" />
            </IconButton>
          </Tooltip>
        </div>
      ),
    },
  ], []);

  const formatBytes = (bytes) => {
    if (!bytes) return "0 B";
    const KB = bytes / 1024, MB = KB / 1024, GB = MB / 1024;
    if (GB >= 1) return `${GB.toFixed(1)} GB`;
    if (MB >= 1) return `${MB.toFixed(1)} MB`;
    if (KB >= 1) return `${KB.toFixed(1)} KB`;
    return `${bytes} B`;
  };

  const stats = [
    { title: "Active Vouchers", value: activeVouchers, icon: <Activity className="h-5 w-5" />, accent: "emerald" },
    { title: "Expired Vouchers", value: expiredVouchers, icon: <TrendingDown className="h-5 w-5" />, accent: "rose" },
    {
      title: "Online Users",
      value: onlineUsers,
      icon: <Wifi className="h-5 w-5" />,
      accent: "sky",
    },
    {
      title: "Data Consumed (24h)",
      value: formatBytes(totalBandwidth),
      icon: <BarChart3 className="h-5 w-5" />,
      accent: "teal",
      trend: { download: formatBytes(totalDownload), upload: formatBytes(totalUpload) },
    },
  ];

  const handleClose = () => setOpen(false);

  const [selectedUser, setSelectedUser] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleUserClick = (event, rowData) => {
    setSelectedUser(rowData);
    setModalOpen(true);
  };

  return (
    <div className="font-sans">
      <Dialog
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ className: 'rounded-2xl dark:bg-gray-900' }}
      >
        <DialogTitle className="flex items-center justify-between font-sans !text-base !font-semibold text-gray-900 dark:text-gray-100">
          <span>User details</span>
          <IconButton size="small" onClick={() => setModalOpen(false)}>
            <X className="h-4 w-4" />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers className="dark:border-gray-800">
          {selectedUser && (
            <div className="font-sans">
              <div className="mb-4 flex items-center gap-3">
                <UserAvatar username={selectedUser.username} isOnline />
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    {selectedUser.username || 'Unknown user'}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">{selectedUser.ip_address}</p>
                </div>
              </div>
              <DetailRow label="MAC address" value={selectedUser.mac_address} />
              <DetailRow label="Download" value={selectedUser.download} />
              <DetailRow label="Upload" value={selectedUser.upload} />
              <DetailRow label="Uptime" value={selectedUser.up_time} />
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setModalOpen(false)} className="!font-sans !normal-case">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-50">
          Hotspot statistics
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Live traffic and connected devices, updated in real time.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <StatCard
            key={stat.title}
            index={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            accent={stat.accent}
            trend={stat.trend}
          />
        ))}
      </div>

      <div className="mt-6 rounded-2xl border border-gray-200/80 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-6">
        <div className="mb-2 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              Real-time bandwidth
            </h2>
            <p className="text-xs text-gray-400 dark:text-gray-500">Download and upload speed over the last few minutes</p>
          </div>
        </div>
        <ReactApexChart options={chartData.options} series={chartData.series} type="area" height={340} />
      </div>

      <div className="mt-6">
        <ThemeProvider theme={tableTheme}>
          <MemoizedHotspotTable
            data={hostpotStats}
            columns={columns}
            onRowClick={handleUserClick}
            isDark={isDark}
            tableTheme={tableTheme}
          />
        </ThemeProvider>
      </div>

      <Toaster />
      <EditPayment open={open} handleClose={handleClose} />
    </div>
  );
};

export default DashboardStatistics;