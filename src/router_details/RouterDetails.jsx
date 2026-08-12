import { FcAlarmClock } from "react-icons/fc";
import { GoCpu, GoServer } from "react-icons/go";
import { useCallback, useEffect, useState, useMemo } from "react";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { useApplicationSettings } from '../settings/ApplicationSettings'
import { useSearchParams } from 'react-router-dom';
import TrafficStatsGraph from './TrafficData';
import toast, { Toaster } from 'react-hot-toast';
import { IoWarningOutline, IoClose, IoSearch, IoDownload, IoRefresh, IoEye, IoEyeOff } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import { MdMemory } from "react-icons/md";
import { FiHardDrive, FiActivity } from "react-icons/fi";
import { FcAreaChart } from "react-icons/fc";
import Lottie from 'react-lottie';
import animationData from '../lotties/Connection error.json';
import { motion, AnimatePresence } from "framer-motion";
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';
import CircularProgress from '@mui/material/CircularProgress';
import Tooltip from '@mui/material/Tooltip';

// ── Radial gauge SVG ──────────────────────────────────────────────────────────
const GaugeRing = ({ value = 0, size = 72, stroke = 6, color, track = 'rgba(255,255,255,0.06)' }) => {
  const pct = Math.max(0, Math.min(100, value));
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (pct / 100) * circumference;

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90" style={{ display: 'block' }}>
        <circle cx={size / 2} cy={size / 2} r={radius} stroke={track} strokeWidth={stroke} fill="none" />
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          stroke={color} strokeWidth={stroke} fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.7s cubic-bezier(0.4,0,0.2,1)', filter: `drop-shadow(0 0 6px ${color}88)` }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xs font-bold tabular-nums" style={{ color }}>{pct.toFixed(0)}%</span>
      </div>
    </div>
  );
};

// ── Mini sparkline bar chart ──────────────────────────────────────────────────
const SparkBars = ({ color }) => (
  <div className="flex items-end gap-0.5 h-6">
    {[40, 65, 50, 80, 55, 90, 70].map((h, i) => (
      <div
        key={i}
        className="w-1 rounded-sm opacity-60"
        style={{ height: `${h}%`, backgroundColor: color, opacity: i === 6 ? 1 : 0.4 + i * 0.08 }}
      />
    ))}
  </div>
);

// ── Stat card ─────────────────────────────────────────────────────────────────
const THEMES = {
  sky:     { accent: '#38bdf8', badge: 'bg-sky-500/10 text-sky-400 ring-sky-500/20' },
  amber:   { accent: '#f59e0b', badge: 'bg-amber-500/10 text-amber-400 ring-amber-500/20' },
  emerald: { accent: '#10b981', badge: 'bg-emerald-500/10 text-emerald-400 ring-emerald-500/20' },
  violet:  { accent: '#8b5cf6', badge: 'bg-violet-500/10 text-violet-400 ring-violet-500/20' },
};

const StatCard = ({ icon, title, value, unit, gauge, theme = 'sky', footnote }) => {
  const t = THEMES[theme];
  return (
    <div className="relative group rounded-2xl border border-white/5  p-5 overflow-hidden
     transition-all duration-300 ">
      {/* Subtle gradient top accent */}
      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{ background: `linear-gradient(90deg, transparent, ${t.accent}55, transparent)` }}
      />

      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className={`mb-3 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 
            text-[11px] font-semibold uppercase tracking-wider ring-1 ${t.badge}`}>
            {icon}
            {title}
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="font-mono text-2xl font-bold text-black dark:text-white tabular-nums leading-none">{value}</span>
            {unit && <span className="text-sm font-medium text-gray-500">{unit}</span>}
          </div>
          {footnote && <p className="mt-1.5 text-xs text-gray-600 font-mono truncate">{footnote}</p>}
        </div>

        <div className="flex flex-col items-end gap-2">
          {typeof gauge === 'number' && <GaugeRing value={gauge} color={t.accent} />}
          <SparkBars color={t.accent} />
        </div>
      </div>
    </div>
  );
};

// ── Info row inside board card ────────────────────────────────────────────────
const InfoRow = ({ label, value }) => (
  <div className="flex items-center justify-between py-2.5 border-b border-white/[0.04] last:border-0">
    <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">{label}</span>
    <span className="text-sm font-sans text-black dark:text-white truncate max-w-[55%] text-right">{value || 'N/A'}</span>
  </div>
);

// ── Severity chip for logs ────────────────────────────────────────────────────
const SCOLORS = { error: '#f87171', critical: '#f87171', warning: '#fbbf24', info: '#38bdf8', debug: '#94a3b8' };
const getSeverityChip = (s) => {
  const c = SCOLORS[s?.toLowerCase()] || '#64748b';
  return (
    <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide"
      style={{ backgroundColor: `${c}18`, color: c, border: `1px solid ${c}35` }}>
      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: c }} />
      {s || '—'}
    </span>
  );
};

// ── Main component ─────────────────────────────────────────────────────────────
const RouterDetails = ({ message = "Connection to router failed" }) => {
  const { openNasTable, setOpenNasTable, openRouterDetails, setOpenRouterDetails } = useApplicationSettings();
  const [routerData, setRouterData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentRouterImage, setCurrentRouterImage] = useState(null);
  const [uptime, setUptime] = useState(null);
  const [error, setError] = useState(null);
  const [routerInfo, setRouterInfo] = useState(null);
  const [searchParams] = useSearchParams();
  const [routerInterface, setRouterInterface] = useState([]);
  const [routerInterfaceForm, setRouterInterfaceForm] = useState('');
  const [showSuccessReboot, setShowSuccessReboot] = useState(false);
  const navigate = useNavigate();
  const [trafficData, setTrafficData] = useState(null);

  const [openLogsModal, setOpenLogsModal] = useState(false);
  const [logs, setLogs] = useState([]);
  const [loadingLogs, setLoadingLogs] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [autoRefreshInterval, setAutoRefreshInterval] = useState(5);

  const [cpuLoad, setCpuLoad] = useState(0);
  const [freeMemory, setFreeMemory] = useState(0);
  const [totalMemory, setTotalMemory] = useState(0);
  const [freeHdd, setFreeHdd] = useState(0);
  const [totalHdd, setTotalHdd] = useState(0);
  const [routerVersion, setRouterVersion] = useState(0);
  const [showRebootConfirm, setShowRebootConfirm] = useState(false);
  const [archiTecture, setArchiTecture] = useState(null);
  const [routerTimezone, setRouterTimezone] = useState(null);

  const id = searchParams.get('id');
  const status = searchParams.get('status');
  const event = new Date();

  const mikotik = [
    { id: 1, name: "hAP ax lite", image: '/images/hAP_ax_lite.png' },
    { id: 2, name: "RB951Ui-2HnD", image: '/images/RB951Ui-2HnD.png' },
    { id: 3, name: "L009UiGS", image: '/images/L009UiGS-RM.png' },
    { id: 4, name: "RB4011iGS+", image: '/images/RB4011iGS+RM.png' },
    { id: 5, name: "CCR1009-7G-1C-1S+", image: '/images/CCR1009-7G-1C-1S+.webp' },
  ];






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









  const fetchTrafficStats = useCallback(async (iface) => {
  try {
    const response = await fetch(
      `/api/trafic_stats?id=${id}&interface=${iface || localStorage.getItem('routerInterfaceForm')}`,
      { headers: { 'X-Subdomain': window.location.hostname.split('.')[0] } }
    );
    if (!response.ok) throw new Error('Failed to fetch traffic stats');
    const data = await response.json();

    // Handle either shape: an array of one stats object, or the object directly
    const stats = Array.isArray(data) ? data[0] : data;

    if (stats && typeof stats.download_speed !== 'undefined') {
      setTrafficData(stats);
    } else {
      console.warn('Unexpected traffic stats shape:', data);
    }
  } catch (err) {
    console.error('Traffic stats fetch failed:', err);
  }
}, [id]);

  useEffect(() => {
    fetchTrafficStats();
    const id = setInterval(fetchTrafficStats, 5000);
    return () => clearInterval(id);
  }, [fetchTrafficStats]);

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
      setArchiTecture(data.architecture_name);
      const match = mikotik.find(r => r.name === data.board_name);
      setCurrentRouterImage(match?.image || null);
    } catch (err) {
      setError(err.message);
      setRouterInfo(null);
      setUptime(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  const fetchRouterTimezone = useCallback(async () => {
    try {
      const response = await fetch(`/api/router_timezone?id=${id}`, {
        headers: { 'X-Subdomain': window.location.hostname.split('.')[0] },
      });
      if (!response.ok) return;
      const data = await response.json();
      setRouterTimezone(data.time_zone_name);
    } catch { /* silent */ }
  }, [id]);

  const fetchRouterInterface = useCallback(async () => {
    try {
      const response = await fetch(`/api/get_router_interface?id=${id}`, {
        headers: { 'X-Subdomain': window.location.hostname.split('.')[0] },
      });
      if (!response.ok) return;
      const data = await response.json();
      setRouterInterface(data);
    } catch { /* silent */ }
  }, [id]);

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

  useEffect(() => { fetchRouterTimezone(); }, [fetchRouterTimezone]);
  useEffect(() => {
    fetchRouterInfoo();
    const interval = setInterval(fetchRouterInfoo, 8000);
    return () => clearInterval(interval);
  }, [fetchRouterInfoo]);
  useEffect(() => { fetchRouterInterface(); }, [fetchRouterInterface]);
  useEffect(() => {
    if (!openLogsModal) return;
    fetchLogs();
    if (autoRefresh) {
      const interval = setInterval(fetchLogs, autoRefreshInterval * 1000);
      return () => clearInterval(interval);
    }
  }, [openLogsModal, autoRefresh, autoRefreshInterval]);

  const rebootRouter = async (e) => {
    e.preventDefault();
    if (!showRebootConfirm) { setShowRebootConfirm(true); return; }
    try {
      const response = await fetch(`/api/reboot_router?id=${id}`, {
        method: 'POST',
        headers: { 'X-Subdomain': window.location.hostname.split('.')[0] },
      });
      const newData = await response.json();
      if (response.status === 402) { setTimeout(() => { window.location.href = '/license-expired'; }, 1800); }
      if (response.ok) {
        toast.success('Router is rebooting', { position: 'top-center', duration: 5000 });
        setShowSuccessReboot(true);
        setTimeout(() => navigate('/admin/nas'), 2500);
      } else {
        toast.error(newData.error, { position: 'top-center', duration: 5000 });
      }
    } catch {
      toast.error('Failed to reboot router', { position: 'top-center', duration: 5000 });
    }
  };

  const handleExportLogs = () => {
    const logText = logs.map(l => `${l.time || ''}\t${l.topics || ''}\t${l.message || ''}`).join('\n');
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

  const filteredLogs = logs.filter(log => {
    const q = searchTerm.toLowerCase();
    const matchSearch = log.message?.toLowerCase().includes(q) || log.topics?.toLowerCase().includes(q) || log.time?.toLowerCase().includes(q);
    const matchSev = severityFilter === 'all' || log.topics?.toLowerCase().includes(severityFilter);
    return matchSearch && matchSev;
  });

  const memPct = totalMemory ? ((totalMemory - freeMemory) / totalMemory * 100) : 0;
  const diskPct = totalHdd ? ((totalHdd - freeHdd) / totalHdd * 100) : 0;

  const defaultOptions = {
    loop: true, autoplay: true, animationData,
    rendererSettings: { preserveAspectRatio: 'xMidYMid slice' },
  };

  // ── Dialog shared styles ──────────────────────────────────────────────────
  const dlgBg = { backgroundImage: 'none', border: '1px solid rgba(255,255,255,0.06)' };
  const dlgHeaderBg = { borderBottom: '1px solid rgba(255,255,255,0.06)' };
  const cellStyle = { borderColor: 'rgba(255,255,255,0.05)', fontSize: 13 };
  const headCellStyle = { ...cellStyle, color: '#6b7280', fontWeight: 700, fontSize: 11,
     letterSpacing: '0.05em', textTransform: 'uppercase',};

  return (
    <div className="font-sans antialiased">
      <ThemeProvider theme={tableTheme}>
      
      <Toaster />

      {/* ── Logs Modal ──────────────────────────────────────────────────────── */}
      <Dialog open={openLogsModal} onClose={() => setOpenLogsModal(false)} maxWidth="lg" fullWidth
        PaperProps={{ style: { ...dlgBg, minHeight: '80vh', maxHeight: '80vh' } }}>

        <DialogTitle style={{ ...dlgHeaderBg, color: 'white', padding: '16px 24px' }}>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75 animate-ping" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-rose-500" />
              </span>
              <span className="font-mono font-bold text-base tracking-tight text-white">System Logs</span>
              <span className="rounded-full bg-sky-500/10 text-sky-400 ring-1 ring-sky-500/20 px-2.5 py-0.5 text-xs font-semibold">
                {logs.length} entries
              </span>
            </div>
            <IconButton onClick={() => setOpenLogsModal(false)} size="small" style={{ color: '#6b7280' }}>
              <IoClose size={18} />
            </IconButton>
          </div>
        </DialogTitle>

        <DialogContent style={{ padding: 0, backgroundColor: '#111827' }}>
          {/* Toolbar */}
          <div className="px-4 py-3 border-b border-white/5 bg-gray-900/60 flex flex-wrap gap-3 items-center">
            <TextField size="small" placeholder="Search logs…" value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <IoSearch style={{ marginRight: 8, color: '#6b7280' }} />,
                style: { backgroundColor: '#1f2937', color: '#e5e7eb', width: 260, borderRadius: 10, fontSize: 13 },
              }} />

            <FormControl size="small">
              <Select value={severityFilter} onChange={e => setSeverityFilter(e.target.value)}
                style={{ backgroundColor: '#1f2937', color: '#e5e7eb', height: 40, borderRadius: 10, fontSize: 13, minWidth: 130 }}>
                <MenuItem value="all">All severities</MenuItem>
                <MenuItem value="info">Info</MenuItem>
                <MenuItem value="warning">Warning</MenuItem>
                <MenuItem value="error">Error</MenuItem>
                <MenuItem value="debug">Debug</MenuItem>
              </Select>
            </FormControl>

            <div className="flex items-center gap-2 ml-auto">
              <Tooltip title={autoRefresh ? 'Pause auto-refresh' : 'Enable auto-refresh'}>
                <IconButton size="small" onClick={() => setAutoRefresh(!autoRefresh)}
                  style={{ color: autoRefresh ? '#38bdf8' : '#6b7280', backgroundColor: autoRefresh ? 'rgba(56,189,248,0.1)' : 'transparent', borderRadius: 8 }}>
                  {autoRefresh ? <IoEye size={17} /> : <IoEyeOff size={17} />}
                </IconButton>
              </Tooltip>

              <FormControl size="small">
                <Select value={autoRefreshInterval} onChange={e => setAutoRefreshInterval(e.target.value)}
                  style={{ backgroundColor: '#1f2937', color: '#e5e7eb', height: 36, borderRadius: 8, fontSize: 13, minWidth: 80 }}>
                  {[2, 5, 10, 30].map(v => <MenuItem key={v} value={v}>{v}s</MenuItem>)}
                </Select>
              </FormControl>

              <button onClick={fetchLogs} disabled={loadingLogs}
                className="flex items-center gap-1.5 h-9 px-3 rounded-lg border border-white/10 bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm font-medium transition-colors disabled:opacity-50">
                {loadingLogs ? <CircularProgress size={14} style={{ color: '#38bdf8' }} /> : <IoRefresh size={15} />}
                Refresh
              </button>

              <button onClick={handleExportLogs}
                className="flex items-center gap-1.5 h-9 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium transition-colors">
                <IoDownload size={15} />
                Export
              </button>
            </div>
          </div>

          {/* Table */}
          <TableContainer style={{ backgroundColor: '#111827', height: 'calc(80vh - 200px)', overflow: 'auto' }}>
            <Table stickyHeader size="small">
              <TableHead>
                <TableRow>
                  {['Time', 'Severity', 'Topics', 'Message'].map(h => (
                    <TableCell key={h} style={headCellStyle}>{h}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {loadingLogs ? (
                  <TableRow><TableCell colSpan={4} align="center" style={{ ...cellStyle, padding: '48px 0' }}>
                    <CircularProgress style={{ color: '#38bdf8' }} size={24} />
                  </TableCell></TableRow>
                ) : filteredLogs.length === 0 ? (
                  <TableRow><TableCell colSpan={4} align="center" style={{ ...cellStyle, color: '#6b7280', padding: '48px 0' }}>
                    No logs match your filters
                  </TableCell></TableRow>
                ) : filteredLogs.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((log, i) => (
                  <TableRow key={i} style={{ backgroundColor: i % 2 === 0 ? '#111827' : '#1f2937' }}>
                    <TableCell style={{ ...cellStyle, color: '#9ca3af', fontFamily: 'monospace', fontSize: 12 }}>{log.time || '—'}</TableCell>
                    <TableCell style={cellStyle}>{getSeverityChip(log.topics)}</TableCell>
                    <TableCell style={{ ...cellStyle, color: '#d1d5db' }}>{log.topics || '—'}</TableCell>
                    <TableCell style={{ ...cellStyle, color: '#d1d5db', whiteSpace: 'pre-wrap' }}>{log.message || '—'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <div className="border-t border-white/5 bg-gray-900/60">
            <TablePagination
              component="div" count={filteredLogs.length} page={page}
              onPageChange={(_, p) => setPage(p)} rowsPerPage={rowsPerPage}
              onRowsPerPageChange={e => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
              rowsPerPageOptions={[10, 20, 50, 100]}
              style={{ color: '#9ca3af' }} />
          </div>
        </DialogContent>

        <DialogActions style={{ ...dlgHeaderBg, borderTop: '1px solid rgba(255,255,255,0.05)', padding: '12px 20px' }}>
          <div className="flex justify-between items-center w-full">
            <span className="text-xs font-mono text-gray-600">{filteredLogs.length} / {logs.length} entries shown</span>
            <button onClick={() => setOpenLogsModal(false)}
              className="px-3 py-1.5 rounded-lg text-sm text-gray-400 hover:text-gray-200 hover:bg-white/5 transition-colors">
              Close
            </button>
          </div>
        </DialogActions>
      </Dialog>

      {/* ── Main view ───────────────────────────────────────────────────────── */}
      {status === 'Reachable' ? (
        <div className="space-y-5 
        rounded-2xl  p-5 ring-1 ring-white/5">

          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60 animate-ping" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              <h2 className="font-sans font-bold text-base text-  tracking-tight text-lack dark:text-white">
                {routerInfo || 'Router'}
                <span className="ml-2 text-gray-600 font-normal">/ online</span>
              </h2>
            </div>
            <span className="font-mono text-xs text-gray-600">{event.toLocaleTimeString('en-US')}</span>
          </div>

          {/* Stat cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <StatCard
              icon={<FcAlarmClock className="w-3 h-3" />}
              title="Uptime" value={uptime || 'N/A'} theme="violet"
            />
            <StatCard
              icon={<GoCpu className="w-3 h-3" />}
              title="CPU" value={cpuLoad || '0'} unit="%" gauge={parseFloat(cpuLoad) || 0} theme="amber"
            />
            <StatCard
              icon={<MdMemory className="w-3 h-3" />}
              title="Memory" value={memPct.toFixed(1)} unit="%" gauge={memPct} theme="sky"
              footnote={`${freeMemory} free · ${totalMemory} total`}
            />
            <StatCard
              icon={<FiHardDrive className="w-3 h-3" />}
              title="Disk" value={diskPct.toFixed(1)} unit="%" gauge={diskPct} theme="emerald"
              footnote={`${freeHdd} free · ${totalHdd} total`}
            />
          </div>

          {/* Lower section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

            {/* Board info card */}
            <div className="rounded-2xl border border-white/5 p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider
                 text-black dark:text-white">
                  <GoServer className="text-sky-400 w-3.5 h-3.5" />
                  Router Board
                </div>
                {currentRouterImage && (
                  <img src={currentRouterImage} alt="router" className="h-10 object-contain opacity-80" />
                )}
              </div>

              <div className="mb-5">
                <InfoRow label="Model" value={routerInfo} />
                <InfoRow label="Version" value={routerVersion} />
                <InfoRow label="Architecture" value={archiTecture} />
                <InfoRow label="Timezone" value={routerTimezone} />
              </div>

              <div className="space-y-2 pt-4 border-t border-white/[0.04]">
                <button onClick={() => setOpenLogsModal(true)}
                  className="w-full flex items-center justify-center gap-2 rounded-xl border border-white/8
                   bg-white/[0.03] hover:bg-white/[0.07] dark:text-gray-300 text-black text-sm font-medium 
                   py-2.5 transition-colors">
                  <FiActivity className="w-4 h-4 text-sky-400" />
                  View system logs
                </button>

                <AnimatePresence mode="wait">
                  {showRebootConfirm ? (
                    <motion.div key="confirm" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="flex gap-2">
                      <button onClick={rebootRouter}
                        className="flex-1 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-sm font-semibold py-2.5 transition-colors">
                        Confirm
                      </button>
                      <button onClick={() => setShowRebootConfirm(false)}
                        className="flex-1 rounded-xl border border-white/8 bg-white/[0.03] hover:bg-white/[0.07] text-gray-400 text-sm font-medium py-2.5 transition-colors">
                        Cancel
                      </button>
                    </motion.div>
                  ) : (
                    <motion.button key="reboot" initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={rebootRouter}
                      className="w-full flex items-center justify-center gap-2 rounded-xl border border-rose-500/20 bg-rose-500/8
                       hover:bg-rose-500/15 text-rose-400 text-sm font-semibold py-2.5 transition-colors">
                      <IoWarningOutline className="w-4 h-4" />
                      Reboot router
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Traffic graph */}
            <div className="rounded-2xl border border-white/5  p-5 lg:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-white">
                  <FcAreaChart className="w-3.5 h-3.5" />
                  Network traffic
                </div>

                <select
                  value={routerInterfaceForm}
                  onChange={e => {
                    setRouterInterfaceForm(e.target.value);
                    localStorage.setItem('routerInterfaceForm', e.target.value);
                    fetchTrafficStats(e.target.value);
                  }}
                  className="h-8 px-3 rounded-lg border border-white/8  dark:text-gray-300  text-black
                  text-xs outline-none focus:ring-1 focus:ring-sky-500/50 transition-colors"
                >
                  {routerInterface.map(opt => (
                    <option key={opt.id} value={opt.name} className="">{opt.name}</option>
                  ))}
                </select>
              </div>

              {/* Graph area with subtle grid background */}
              <div className="rounded-xl overflow-hidden  ring-1 ring-white/[0.04]" >
                <TrafficStatsGraph trafficData={trafficData} />
              </div>
            </div>
          </div>

          {/* Reboot toast */}
          <AnimatePresence>
            {showSuccessReboot && (
              <motion.div
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 16 }}
                className="fixed bottom-5 right-5 flex items-center gap-2.5 text-black bg-emerald-600 dark:text-white 
                px-4 py-3 rounded-xl shadow-lg shadow-emerald-900/40 text-sm font-medium"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                Router is rebooting…
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      ) : (
        /* ── Offline / error state ──────────────────────────────────────────── */
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col items-center justify-center p-10  rounded-2xl border
           border-rose-500/15 max-w-sm mx-auto"
        >
          <div className="relative mb-4">
            <Lottie options={defaultOptions} height={160} width={160} />
          </div>
          <h3 className="text-xl font-bold text-rose-400 mb-2 font-mono">Connection failed</h3>
          <p className="text-gray-500 text-sm text-center mb-5 leading-relaxed">{message}</p>
          <div className="w-full rounded-xl bg-rose-500/8 ring-1 ring-rose-500/15 px-4 py-3">
            <p className="text-sm text-rose-500 text-center">Check that the router is powered on and reachable on the network.</p>
          </div>
        </motion.div>
      )}

      </ThemeProvider>
      
    </div>
  );
};

export default RouterDetails;