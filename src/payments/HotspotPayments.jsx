import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import MaterialTable from 'material-table';
import { IconButton, Tooltip, Chip, CircularProgress } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import RefreshIcon from '@mui/icons-material/Refresh';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import Receipt from '@mui/icons-material/Receipt';
import Payment from '@mui/icons-material/Payment';
import Person from '@mui/icons-material/Person';
import AccessTime from '@mui/icons-material/AccessTime';
import CheckCircle from '@mui/icons-material/CheckCircle';
import Cancel from '@mui/icons-material/Cancel';
import TrendingUp from '@mui/icons-material/TrendingUp';
import FilterList from '@mui/icons-material/FilterList';
import HourglassEmpty from '@mui/icons-material/HourglassEmpty';
import Bolt from '@mui/icons-material/Bolt';
import PersonOff from '@mui/icons-material/PersonOff';
import ExpandMore from '@mui/icons-material/ExpandMore';
import Smartphone from '@mui/icons-material/Smartphone';
import WifiOff from '@mui/icons-material/WifiOff';
import { motion, AnimatePresence } from 'framer-motion';
import { useDebounce } from 'use-debounce';
import toast, { Toaster } from 'react-hot-toast';
import EditPayment from '../edit/EditPayment';
import DeletePayment from './DeletePayment';
import PaymentDetails from './PaymentDetails';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const subdomain = window.location.hostname.split('.')[0];

// ---------------------------------------------------------------------------
// Small helper: animates a number counting up whenever `value` changes.
// Keeps the stat cards feeling alive without pulling in a whole library.
// ---------------------------------------------------------------------------
function useCountUp(value, duration = 600) {
  const [display, setDisplay] = useState(0);
  const fromRef = useRef(0);
  const rafRef = useRef(null);

  useEffect(() => {
    const from = fromRef.current;
    const to = Number(value) || 0;
    const start = performance.now();

    cancelAnimationFrame(rafRef.current);

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(from + (to - from) * eased);
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        fromRef.current = to;
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [value, duration]);

  return display;
}

function StatCard({ icon: Icon, label, value, suffix = '', gradient, delay = 0, isCurrency = false }) {
  const animated = useCountUp(value);
  const formatted = isCurrency
    ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'KES', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(animated)
    : Math.round(animated).toLocaleString();

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay, ease: 'easeOut' }}
      whileHover={{ y: -3 }}
      className="relative overflow-hidden rounded-2xl p-4 border
        border-gray-200 dark:border-gray-700/70
        bg-white dark:bg-gray-800/60
        shadow-sm hover:shadow-md
        transition-all duration-300 ease-in-out"
    >
      <div
        className="absolute inset-0 opacity-[0.07] dark:opacity-[0.12] transition-opacity duration-300"
        style={{ background: gradient }}
      />
      <div className="relative flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 transition-colors duration-300">
            {label}
          </p>
          <p className="text-2xl font-bold text-gray-800 dark:text-gray-100 mt-1 transition-colors duration-300 tabular-nums">
            {formatted}{suffix}
          </p>
        </div>
        <div
          className="p-2.5 rounded-xl shrink-0"
          style={{ background: gradient }}
        >
          <Icon className="w-5 h-5 text-white" strokeWidth={2.2} />
        </div>
      </div>
    </motion.div>
  );
}

const STAGE_CONFIG = {
  connected: { label: 'Connected', bg: '#d1fae5', color: '#065f46', icon: CheckCircle },
  paid_not_connected: { label: 'Paid, not connected', bg: '#dbeafe', color: '#1e40af', icon: Bolt },
  cancelled: { label: 'Cancelled', bg: '#fee2e2', color: '#991b1b', icon: Cancel },
  abandoned: { label: 'Abandoned', bg: '#fef3c7', color: '#92400e', icon: PersonOff },
  in_progress: { label: 'In progress', bg: '#e0e7ff', color: '#3730a3', icon: HourglassEmpty },
};

function StageChip({ stage }) {
  const config = STAGE_CONFIG[stage] || STAGE_CONFIG.in_progress;
  const Icon = config.icon;
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition-colors duration-300"
      style={{ backgroundColor: config.bg, color: config.color }}
    >
      <Icon className="w-3.5 h-3.5" />
      {config.label}
    </span>
  );
}

function AbandonedRow({ session, index }) {
  return (
    <motion.tr
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.25, delay: index * 0.02 }}
      className="border-b border-gray-100 dark:border-gray-700/60 last:border-0
        hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors duration-200"
    >
      <td className="py-3 px-4">
        <div className="flex items-center gap-2">
          <Smartphone className="w-4 h-4 text-gray-400 dark:text-gray-500 shrink-0" />
          <div>
            <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
              {session.phone_number || <span className="italic text-gray-400">No phone</span>}
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 font-mono">{session.mac || '—'}</p>
          </div>
        </div>
      </td>
      <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-300">
        {session.package || '—'}
      </td>
      <td className="py-3 px-4">
        <StageChip stage={session.stage} />
      </td>
      <td className="py-3 px-4">
        <div className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
          <AccessTime className="w-3.5 h-3.5" />
          {session.minutes_since < 1 ? 'just now' : `${session.minutes_since}m ago`}
        </div>
      </td>
      <td className="py-3 px-4 text-sm text-gray-500 dark:text-gray-400">
        {session.connected ? (
          <span className="inline-flex items-center gap-1 text-green-600 dark:text-green-400">
            <CheckCircle className="w-3.5 h-3.5" /> Online
          </span>
        ) : (
          <span className="inline-flex items-center gap-1">
            <WifiOff className="w-3.5 h-3.5" /> Offline
          </span>
        )}
      </td>
    </motion.tr>
  );
}

const HotspotPayments = () => {
  const [search, setSearch] = useState('');
  const [searchInput] = useDebounce(search, 1000);
  const [isSearching, setIsSearching] = useState(false);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openDetails, setOpenDetails] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);

  // Funnel stats: total attempts vs completed vs pending vs abandoned/cancelled
  const [funnel, setFunnel] = useState({
    total_attempts: 0,
    completed: 0,
    pending: 0,
    cancelled: 0,
    abandoned: 0,
    conversion_rate: 0,
    completed_revenue: 0,
  });

  // Row-level detail on who dropped off
  const [abandonedSessions, setAbandonedSessions] = useState([]);
  const [showAbandonedPanel, setShowAbandonedPanel] = useState(false);
  const [abandonedLoading, setAbandonedLoading] = useState(false);

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
    transitions: {
      duration: { standard: 300 },
    },
  }), [isDark]);

  // ---- Fetch completed/pending/cancelled payment records --------------------
  const fetchPayments = useCallback(async () => {
    try {
      setIsSearching(true);
      const response = await fetch('/api/hotspot_mpesa_revenues', {
        headers: {
          'X-Subdomain': subdomain,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok) {
        setIsSearching(false);

        const filteredData = searchInput
          ? data.filter(payment =>
              payment.voucher?.toLowerCase().includes(searchInput.toLowerCase()) ||
              payment.reference?.toLowerCase().includes(searchInput.toLowerCase()) ||
              payment.name?.toLowerCase().includes(searchInput.toLowerCase()) ||
              payment?.phone_number.includes(searchInput) ||
              payment.payment_method?.toLowerCase().includes(searchInput.toLowerCase())
            )
          : data;

        setPayments(filteredData);
      } else {
        setIsSearching(false);
        toast.error(data.error || 'Failed to fetch payments', {
          position: 'top-center',
          duration: 4000,
        });
      }
    } catch (error) {
      setIsSearching(false);
      toast.error('Failed to fetch payments: Server error', {
        position: 'top-center',
        duration: 4000,
      });
    }
  }, [searchInput]);

  // ---- Fetch funnel stats (attempts vs completed vs abandoned) -------------
  const fetchFunnel = useCallback(async () => {
    try {
      const response = await fetch('/api/hotspot_payment_funnel', {
        headers: { 'X-Subdomain': subdomain, 'Content-Type': 'application/json' },
      });
      if (response.ok) {
        const data = await response.json();
        setFunnel(data);
      }
    } catch (_) {
      // Silent — funnel stats are supplementary, don't block the main table on failure
    }
  }, []);

  // ---- Fetch the actual devices/phones that started but didn't finish ------
  const fetchAbandonedSessions = useCallback(async () => {
    try {
      setAbandonedLoading(true);
      const response = await fetch('/api/hotspot_abandoned_sessions', {
        headers: { 'X-Subdomain': subdomain, 'Content-Type': 'application/json' },
      });
      if (response.ok) {
        const data = await response.json();
        setAbandonedSessions(data);
      }
    } catch (_) {
      toast.error('Failed to load abandoned sessions', { position: 'top-center' });
    } finally {
      setAbandonedLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  useEffect(() => {
    fetchFunnel();
    // Keep funnel numbers fresh without the user needing to refresh manually
    const interval = setInterval(fetchFunnel, 15000);
    return () => clearInterval(interval);
  }, [fetchFunnel]);

  useEffect(() => {
    if (showAbandonedPanel) fetchAbandonedSessions();
  }, [showAbandonedPanel, fetchAbandonedSessions]);

  const handleDeletePayment = async (id) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/hotspot_mpesa_revenues/${id}`, {
        method: 'DELETE',
        headers: {
          'X-Subdomain': subdomain,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Payment deleted successfully', {
          position: 'top-center',
          duration: 4000,
        });
        setPayments(prev => prev.filter(payment => payment.id !== id));
        setOpenDelete(false);
      } else {
        toast.error(data.error || 'Failed to delete payment', {
          position: 'top-center',
          duration: 4000,
        });
      }
    } catch (error) {
      toast.error('Failed to delete payment: Server error', {
        position: 'top-center',
        duration: 4000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (payment) => {
    setSelectedPayment(payment);
    setOpenDetails(true);
  };

  const formatTime = (timeString) => timeString || 'N/A';

  const formatCurrency = (amount) => new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'KES',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);

  const columns = [
    {
      title: 'Voucher',
      field: 'voucher',
      headerClassName: 'dark:text-black font-semibold',
      render: (rowData) => (
        <Tooltip title="Voucher code" arrow>
          <div className="flex items-center gap-2">
            <Receipt className="w-4 h-4 text-blue-500" />
            <code className="font-mono text-sm bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded transition-colors duration-300">
              {rowData.voucher || 'N/A'}
            </code>
          </div>
        </Tooltip>
      ),
    },
    {
      title: 'Payment Method',
      field: 'payment_method',
      headerClassName: 'dark:text-black font-semibold',
      render: (rowData) => (
        <div className="flex items-center gap-2">
          <Payment className="w-4 h-4 text-green-500" />
          <Chip
            label={rowData.payment_method || 'N/A'}
            size="small"
            variant="outlined"
            className={`border transition-colors duration-300 ${
              rowData.payment_method?.toLowerCase() === 'mpesa'
                ? 'border-green-200 text-green-700 bg-green-50'
                : 'border-blue-200 text-blue-700 bg-blue-50'
            }`}
          />
        </div>
      ),
    },
    {
      title: 'Reference',
      field: 'reference',
      headerClassName: 'dark:text-black font-semibold',
      render: (rowData) => (
        <div className="font-mono text-sm text-gray-600 dark:text-gray-300 transition-colors duration-300">
          {rowData.reference || 'N/A'}
        </div>
      ),
    },
    {
      title: 'Amount',
      field: 'amount',
      headerClassName: 'dark:text-black font-semibold',
      render: (rowData) => (
        <span className="font-bold text-purple-600 dark:text-purple-400 transition-colors duration-300">
          {formatCurrency(rowData.amount)}
        </span>
      ),
    },
    {
      title: 'Disbursed',
      field: 'paid_out',
      headerClassName: 'dark:text-black font-semibold',
      render: (rowData) => (
        <div className="flex items-center gap-2">
          {rowData.paid_out ? (
            <>
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="text-green-700 dark:text-green-400 transition-colors duration-300">Yes</span>
              {rowData.paid_out_at && (
                <Tooltip title={rowData.paid_out_at} arrow>
                  <AccessTime className="w-3 h-3 text-gray-400 ml-1" />
                </Tooltip>
              )}
            </>
          ) : (
            <>
              <Cancel className="w-4 h-4 text-amber-500" />
              <span className="text-amber-600 dark:text-amber-400 transition-colors duration-300">No</span>
            </>
          )}
        </div>
      ),
    },
    {
      title: 'Customer',
      field: 'name',
      headerClassName: 'dark:text-black font-semibold',
      render: (rowData) => (
        <div className="flex items-center gap-2">
          <Person className="w-4 h-4 text-gray-500" />
          <span className="dark:text-gray-200 transition-colors duration-300">{rowData.name || 'Anonymous'}</span>
        </div>
      ),
    },
    {
      title: 'Time Paid',
      field: 'time_paid',
      headerClassName: 'dark:text-black font-semibold',
      render: (rowData) => (
        <Tooltip title={formatTime(rowData.time_paid)} arrow>
          <div className="flex items-center gap-2">
            <AccessTime className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600 dark:text-gray-300 transition-colors duration-300">
              {formatTime(rowData.time_paid)}
            </span>
          </div>
        </Tooltip>
      ),
    },
    {
      title: 'Status',
      field: 'status',
      headerClassName: 'dark:text-black font-semibold',
      render: (rowData) => {
        const status = (rowData.status || '').toLowerCase();
        const statusConfig = {
          completed: { label: 'Completed', icon: <CheckCircle />, bg: '#d1fae5', color: '#065f46' },
          pending: { label: 'Pending', icon: <HourglassEmpty />, bg: '#fef3c7', color: '#92400e' },
          cancelled: { label: 'Cancelled', icon: <Cancel />, bg: '#fee2e2', color: '#991b1b' },
        };
        const config = statusConfig[status] || statusConfig.pending;
        return (
          <Chip
            icon={config.icon}
            label={config.label}
            size="small"
            sx={{ backgroundColor: config.bg, color: config.color, fontWeight: 'bold', transition: 'all 0.3s ease' }}
          />
        );
      },
    },
    {
      title: 'Actions',
      field: 'actions',
      headerClassName: 'dark:text-black font-semibold',
      sorting: false,
      render: (rowData) => (
        <div className="flex items-center gap-1">
          <Tooltip title="View details">
            <IconButton
              size="small"
              onClick={(e) => { e.stopPropagation(); handleViewDetails(rowData); }}
              className="hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors duration-200"
            >
              <SearchIcon fontSize="small" className="text-blue-600" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete payment">
            <IconButton
              size="small"
              onClick={(e) => { e.stopPropagation(); setSelectedPayment(rowData); setOpenDelete(true); }}
              className="hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors duration-200"
            >
              <DeleteIcon fontSize="small" className="text-red-600" />
            </IconButton>
          </Tooltip>
        </div>
      ),
    },
  ];

  const handleRowClick = (event, rowData) => handleViewDetails(rowData);

  const handleRefresh = () => {
    fetchPayments();
    fetchFunnel();
    if (showAbandonedPanel) fetchAbandonedSessions();
    toast.success('Payments refreshed', { position: 'top-center', duration: 2000 });
  };

  const handleExport = () => {
    toast.success('Export started', { position: 'top-center', duration: 2000 });
  };

  return (
    <div className="p-4 space-y-6 transition-colors duration-300">
      <Toaster />

      {selectedPayment && (
        <EditPayment
          open={openEdit}
          setOpen={setOpenEdit}
          payment={selectedPayment}
          onSave={() => {
            fetchPayments();
            toast.success('Payment updated successfully', { position: 'top-center', duration: 4000 });
          }}
        />
      )}

      {selectedPayment && (
        <DeletePayment
          open={openDelete}
          setOpen={setOpenDelete}
          paymentId={selectedPayment.id}
          onDelete={handleDeletePayment}
          loading={loading}
        />
      )}

      {selectedPayment && (
        <PaymentDetails open={openDetails} setOpen={setOpenDetails} payment={selectedPayment} />
      )}

      {/* Funnel dashboard — how many people started paying vs actually finished */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        <StatCard
          icon={TrendingUp}
          label="Payment Attempts"
          value={funnel.total_attempts}
          gradient="linear-gradient(135deg,#38bdf8,#0ea5e9)"
          delay={0}
        />
        <StatCard
          icon={CheckCircle}
          label="Completed"
          value={funnel.completed}
          gradient="linear-gradient(135deg,#34d399,#059669)"
          delay={0.05}
        />
        <StatCard
          icon={HourglassEmpty}
          label="Pending"
          value={funnel.pending}
          gradient="linear-gradient(135deg,#fbbf24,#f59e0b)"
          delay={0.1}
        />
        <StatCard
          icon={PersonOff}
          label="Abandoned"
          value={funnel.abandoned}
          gradient="linear-gradient(135deg,#f87171,#dc2626)"
          delay={0.15}
        />
        <StatCard
          icon={Bolt}
          label="Conversion Rate"
          value={funnel.conversion_rate}
          suffix="%"
          gradient="linear-gradient(135deg,#a78bfa,#7c3aed)"
          delay={0.2}
        />
      </div>

      {/* Abandoned / pending detail panel — collapsible so it doesn't dominate the page */}
      <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800
        shadow-sm overflow-hidden transition-colors duration-300">
        <button
          onClick={() => setShowAbandonedPanel(prev => !prev)}
          className="w-full flex items-center justify-between px-4 py-3.5
            hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-colors duration-200"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/30 transition-colors duration-300">
              <PersonOff className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold text-gray-800 dark:text-gray-100 transition-colors duration-300">
                Who bailed on payment?
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 transition-colors duration-300">
                Devices that clicked pay but never finished — {funnel.abandoned} abandoned in the last 24h
              </p>
            </div>
          </div>
          <motion.div animate={{ rotate: showAbandonedPanel ? 180 : 0 }} transition={{ duration: 0.25 }}>
            <ExpandMore className="w-5 h-5 text-gray-400" />
          </motion.div>
        </button>

        <AnimatePresence initial={false}>
          {showAbandonedPanel && (
            <motion.div
              key="abandoned-panel"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="overflow-hidden border-t border-gray-100 dark:border-gray-700/60"
            >
              {abandonedLoading ? (
                <div className="flex items-center justify-center py-10">
                  <CircularProgress size={22} className="text-amber-500" />
                </div>
              ) : abandonedSessions.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-gray-400 dark:text-gray-500">
                  <CheckCircle className="w-8 h-8 mb-2 text-green-400" />
                  <p className="text-sm">Nobody's stuck mid-payment right now — clean funnel!</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="text-xs uppercase text-gray-400 dark:text-gray-500 border-b border-gray-100 dark:border-gray-700/60 transition-colors duration-300">
                        <th className="py-2.5 px-4 font-semibold">Device / Phone</th>
                        <th className="py-2.5 px-4 font-semibold">Package</th>
                        <th className="py-2.5 px-4 font-semibold">Stage</th>
                        <th className="py-2.5 px-4 font-semibold">Started</th>
                        <th className="py-2.5 px-4 font-semibold">Router status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {abandonedSessions.map((s, i) => (
                        <AbandonedRow key={s.id} session={s} index={i} />
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Search and Actions Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between p-4 bg-white dark:bg-gray-800
        rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 transition-colors duration-300">
        <div className="flex-1 w-full md:w-auto">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon className="text-gray-400" />
            </div>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 w-full bg-gray-50 border border-gray-300
                text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500
                p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400
                dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 font-sans
                transition-colors duration-300"
              placeholder="Search by voucher, reference, name..."
            />
            {isSearching && (
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <CircularProgress size={16} className="text-blue-500" />
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Tooltip title="Refresh payments">
            <IconButton
              onClick={handleRefresh}
              className="bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 text-blue-600 dark:text-blue-400 transition-colors duration-200"
            >
              <RefreshIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="Export payments">
            <IconButton
              onClick={handleExport}
              className="bg-green-50 dark:bg-green-900/30 hover:bg-green-100 dark:hover:bg-green-900/50 text-green-600 dark:text-green-400 transition-colors duration-200"
            >
              <FileDownloadIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="Filter payments">
            <IconButton className="bg-purple-50 dark:bg-purple-900/30 hover:bg-purple-100 dark:hover:bg-purple-900/50 text-purple-600 dark:text-purple-400 transition-colors duration-200">
              <FilterList />
            </IconButton>
          </Tooltip>
        </div>
      </div>

      {/* Payments Table */}
      <div className="rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 transition-colors duration-300">
        <div style={{ maxWidth: '100%', position: 'relative' }}>
          {isSearching && (
            <div className="absolute inset-0 flex justify-center items-center
              bg-white dark:bg-gray-800 bg-opacity-80 z-[2] transition-colors duration-300">
              <div className="flex flex-col items-center gap-2">
                <CircularProgress className="text-blue-500" />
                <p className="text-gray-600 dark:text-gray-300 font-sans transition-colors duration-300">Loading payments...</p>
              </div>
            </div>
          )}

          <ThemeProvider theme={tableTheme}>
            <MaterialTable
              columns={columns}
              title={
                <div className="flex items-center gap-3 p-4">
                  <div className="p-2 bg-yellow-500 rounded-lg">
                    <Receipt className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white font-sans transition-colors duration-300">
                      Hotspot Payments
                    </h2>
                  </div>
                </div>
              }
              onRowClick={handleRowClick}
              data={payments}
              actions={[
                {
                  icon: () => (
                    <button
                      className="flex items-center gap-2 bg-yellow-500 text-white px-4 py-2 rounded-lg
                        hover:from-blue-600 hover:to-cyan-600 transition-all duration-200 shadow-sm hover:shadow-md"
                      onClick={() => {
                        toast.success('Add payment feature coming soon', { position: 'top-center', duration: 3000 });
                      }}
                    >
                      <AddIcon />
                      <span className="font-sans text-sm">Add Payment</span>
                    </button>
                  ),
                  isFreeAction: true,
                  tooltip: 'Add New Payment',
                },
              ]}
              localization={{
                body: {
                  emptyDataSourceMessage: (
                    <div className="flex flex-col items-center justify-center py-12">
                      <Receipt className="w-16 h-16 text-gray-300 mb-4" />
                      <p className="text-gray-500 text-lg font-medium mb-2">No payments found</p>
                      <p className="text-gray-400 text-sm">
                        {search ? 'Try a different search term' : 'No payment records yet'}
                      </p>
                    </div>
                  ),
                },
                header: { actions: 'Actions' },
                pagination: {
                  labelRowsSelect: 'rows',
                  labelDisplayedRows: '{from}-{to} of {count}',
                  firstTooltip: 'First Page',
                  previousTooltip: 'Previous Page',
                  nextTooltip: 'Next Page',
                  lastTooltip: 'Last Page',
                },
              }}
              options={{
                sorting: true,
                pageSizeOptions: [10, 25, 50, 100],
                pageSize: 10,
                paginationType: 'stepped',
                exportButton: { csv: true, pdf: false },
                exportAllData: true,
                selection: false,
                search: false,
                searchAutoFocus: true,
                showSelectAllCheckbox: false,
                showTextRowsSelected: false,
                emptyRowsWhenPaging: false,
                headerStyle: {
                  backgroundColor: '#f8fafc',
                  color: '#1e293b',
                  fontWeight: '600',
                  fontSize: '0.875rem',
                  textTransform: 'uppercase',
                  borderBottom: '2px solid #e2e8f0',
                  padding: '16px',
                },
                rowStyle: {
                  transition: 'background-color 0.2s ease',
                  '&:hover': {
                    backgroundColor: '#f1f5f9',
                    cursor: 'pointer',
                  },
                },
                cellStyle: {
                  padding: '12px 16px',
                  borderRight: '1px solid #f1f5f9',
                  transition: 'background-color 0.2s ease',
                },
                draggable: false,
                filterCellStyle: { padding: '16px' },
              }}
              components={{
                Container: (props) => (
                  <div className="rounded-b-xl overflow-hidden">{props.children}</div>
                ),
              }}
            />
          </ThemeProvider>
        </div>
      </div>
    </div>
  );
};

export default HotspotPayments;