import { useApplicationSettings } from '../settings/ApplicationSettings';
import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import RouterNotFound from '../loader/router_not_found_animation.json';
import LoadingAnimation from '../loader/loading_animation.json';
import { MdOutlineOnlinePrediction } from "react-icons/md";
import { IoCloudOfflineOutline } from "react-icons/io5";
import { LuUsers } from "react-icons/lu";
import { MdMobiledataOff } from "react-icons/md";
import { FaArrowUp, FaArrowDown } from "react-icons/fa6";
import { Link } from 'react-router-dom';
import { createConsumer } from "@rails/actioncable";
import { GiWifiRouter } from "react-icons/gi";
import UiLoader from '../uiloader/UiLoader';
import { Suspense } from "react";
import ReactApexChart from 'react-apexcharts';
import {
  CreditCard, TrendingUp, Activity, Zap, ChevronRight, Wifi,
  Ticket, UserPlus, Radio, Sun, Moon, CalendarDays,
  AlarmClock, History, BarChart3
} from 'lucide-react';
import License from '../layout/License';
import ChurnRateSection from './ChurnRateSection';
import NotificationCenter from './NotificationCenter';
const cable = createConsumer(`wss://${window.location.hostname}/cable`);

// ── Dark-mode detection (drives chart theming; nothing here is dark by default) ─
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

// ── Inline styles ──────────────────────────────────────────────────────────────
// Light by default; every dark treatment is scoped under `.dark` so the section
// follows the app's theme toggle instead of forcing a look.
const Styles = () => (
  <style>{`
    .analytics-root * { box-sizing: border-box; }

    @keyframes shimmer {
      0%   { background-position: -600px 0; }
      100% { background-position:  600px 0; }
    }
    @keyframes pulse-ring {
      0%   { transform: scale(1); opacity: .7; }
      100% { transform: scale(2); opacity: 0; }
    }
    @keyframes drift {
      0%,100% { transform: translate(0,0) scale(1); }
      50%      { transform: translate(12px,-16px) scale(1.04); }
    }
    @keyframes count-blink {
      0%,100% { opacity:1; }
      50%      { opacity:.35; }
    }

    /* Light mode (default) */
    .skeleton {
      background: linear-gradient(90deg,#e2e8f0 25%,#f1f5f9 50%,#e2e8f0 75%);
      background-size: 600px 100%;
      animation: shimmer 1.5s infinite;
      border-radius: 8px;
    }
    .pulse-online::after {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: 50%;
      background: #34d399;
      animation: pulse-ring 1.8s ease-out infinite;
    }
    .pulse-offline::after {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: 50%;
      background: #f87171;
      animation: pulse-ring 2s ease-out infinite;
    }
    .stat-card {
      background: rgba(255,255,255,.8);
      backdrop-filter: blur(18px);
      -webkit-backdrop-filter: blur(18px);
      border: 1px solid rgba(15,23,42,.08);
      box-shadow: 0 1px 3px rgba(15,23,42,.06);
      transition: transform .2s ease, box-shadow .2s ease, border-color .2s, background .2s;
    }
    .stat-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 12px 32px rgba(15,23,42,.1);
    }
    .stat-card:hover .card-arrow { transform: translateX(3px); }
    .card-arrow { transition: transform .2s; }
    .bandwidth-bar {
      background: rgba(255,255,255,.8);
      backdrop-filter: blur(18px);
      border: 1px solid rgba(15,23,42,.08);
      transition: background .2s, border-color .2s;
    }
    .chart-panel {
      background: rgba(255,255,255,.85);
      backdrop-filter: blur(18px);
      border: 1px solid rgba(15,23,42,.08);
      transition: background .2s, border-color .2s;
    }

    /* Dark mode overrides — only apply under the app's .dark class */
    .dark .skeleton {
      background: linear-gradient(90deg,#1e293b 25%,#334155 50%,#1e293b 75%);
      background-size: 600px 100%;
    }
    .dark .stat-card {
      background: rgba(15,23,42,.75);
      border: 1px solid rgba(148,163,184,.1);
      box-shadow: none;
    }
    .dark .stat-card:hover {
      box-shadow: 0 12px 32px rgba(0,0,0,.35);
    }
    .dark .bandwidth-bar {
      background: rgba(15,23,42,.75);
      border: 1px solid rgba(148,163,184,.1);
    }
    .dark .chart-panel {
      background: rgba(15,23,42,.8);
      border: 1px solid rgba(148,163,184,.1);
    }

    .drift1 { animation: drift 10s ease-in-out infinite; }
    .drift2 { animation: drift 14s ease-in-out infinite reverse; }

    .blur-amount {
      filter: blur(5px);
      transition: filter .25s ease;
      user-select: none;
    }
    .reveal-amount:hover .blur-amount {
      filter: blur(0);
    }
    .ticket-badge {
      animation: count-blink 2.4s ease-in-out infinite;
    }
  `}</style>
);

// ── Helpers ────────────────────────────────────────────────────────────────────
const fmtMbps = (v) => `${(+v || 0).toFixed(1)} Mbps`;
const fmtKsh  = (v) => `KSh ${Number(v || 0).toLocaleString('en-KE')}`;

// ── Stat card ──────────────────────────────────────────────────────────────────
function StatCard({ title, value, icon, accent, pulse, to, tag, loading }) {
  const inner = (
    <motion.div
      whileHover={{ y:-2, scale:1.005 }}
      className="stat-card rounded-2xl p-4 relative 
      overflow-hidden cursor-pointer h-full"
    >
      {/* Glow blob */}
      <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full pointer-events-none drift1"
        style={{ background:`radial-gradient(circle,${accent}20,transparent)` }} />

      <div className="flex items-start justify-between mb-3">
        <div className="relative">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center"
            style={{ background:`${accent}18`, border:`1px solid ${accent}28` }}>
            {pulse === 'online'  && <span className="pulse-online  absolute inset-0 rounded-full" />}
            {pulse === 'offline' && <span className="pulse-offline absolute inset-0 rounded-full" />}
            <span className="relative z-10" style={{ color: accent }}>{icon}</span>
          </div>
        </div>
        {tag && (
          <span className="text-[11px] px-2 py-0.5 rounded-full font-semibold"
            style={{ background:`${accent}18`, color: accent }}>
            {tag}
          </span>
        )}
      </div>

      {loading ? (
        <div className="space-y-2">
          <div className="skeleton h-7 w-20" />
          <div className="skeleton h-3 w-14" />
        </div>
      ) : (
        <>
          <p className="text-2xl font-bold text-slate-900 dark:text-white tabular-nums">{value}</p>
          <p className="text-xs mt-1 text-slate-500 dark:text-slate-400">{title}</p>
        </>
      )}

      {to && (
        <div className="flex items-center gap-1 mt-3 text-xs font-semibold"
          style={{ color: accent }}>
          View details
          <ChevronRight size={12} className="card-arrow" />
        </div>
      )}
    </motion.div>
  );

  return to ? <Link to={to} className="block h-full">{inner}</Link> : inner;
}

// ── Bandwidth mini-card ────────────────────────────────────────────────────────
function BwCard({ label, value, accent, icon }) {
  return (
    <motion.div whileHover={{ y:-2 }}
      className="bandwidth-bar rounded-2xl p-4 flex flex-col justify-between relative overflow-hidden">
      <div className="absolute -bottom-3 -right-3 w-16 h-16 rounded-full pointer-events-none"
        style={{ background:`radial-gradient(circle,${accent}18,transparent)` }} />
      <div className="flex items-center gap-2 mb-2.5">
        <div className="w-7 h-7 rounded-lg flex items-center justify-center"
          style={{ background:`${accent}18` }}>
          <span style={{ color: accent }}>{icon}</span>
        </div>
        <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{label}</span>
      </div>
      <p className="text-xl font-bold text-slate-900 dark:text-white tabular-nums">{value}</p>
    </motion.div>
  );
}

// ── Revenue card (blur-to-reveal) ──────────────────────────────────────────────
function RevenueCard({ label, value, accent, icon, loading, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity:0, y:10 }}
      animate={{ opacity:1, y:0 }}
      transition={{ delay, duration:.3 }}
      whileHover={{ y:-2 }}
      className="stat-card reveal-amount rounded-2xl p-4 relative overflow-hidden cursor-default"
    >
      <div className="absolute -top-8 -right-8 w-20 h-20 rounded-full pointer-events-none drift2"
        style={{ background:`radial-gradient(circle,${accent}1c,transparent)` }} />

      <div className="flex items-center justify-between mb-3">
        <div className="w-9 h-9 rounded-lg flex items-center justify-center"
          style={{ background:`${accent}18`, border:`1px solid ${accent}28` }}>
          <span style={{ color: accent }}>{icon}</span>
        </div>
        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider"
          style={{ background:`${accent}18`, color: accent }}>
          revenue
        </span>
      </div>

      {loading ? (
        <div className="space-y-2">
          <div className="skeleton h-7 w-24" />
          <div className="skeleton h-3 w-16" />
        </div>
      ) : (
        <>
          <p className="text-2xl font-bold text-slate-900 dark:text-white tabular-nums">
            <span className="blur-amount">{fmtKsh(value)}</span>
          </p>
          <p className="text-xs mt-1 text-slate-500 dark:text-slate-400">{label}</p>
          <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1.5">Hover to reveal</p>
        </>
      )}
    </motion.div>
  );
}

// ── Expiring soon card ──────────────────────────────────────────────────────────
function ExpiringSoonCard({ count, days = 10, loading }) {
  return (
    <motion.div whileHover={{ y:-2 }}
      className="stat-card rounded-2xl p-4 relative overflow-hidden h-full">
      <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full pointer-events-none drift1"
        style={{ background:'radial-gradient(circle,#fbbf2420,transparent)' }} />
      <div className="flex items-start justify-between mb-3">
        <div className="w-9 h-9 rounded-lg flex items-center justify-center"
          style={{ background:'#fbbf2418', border:'1px solid #fbbf2428' }}>
          <AlarmClock size={17} style={{ color:'#fbbf24' }} />
        </div>
        <span className="text-[11px] px-2 py-0.5 rounded-full font-semibold"
          style={{ background:'#fbbf2418', color:'#fbbf24' }}>
          Next {days} days
        </span>
      </div>

      {loading ? (
        <div className="space-y-2">
          <div className="skeleton h-7 w-14" />
          <div className="skeleton h-3 w-28" />
        </div>
      ) : (
        <>
          <p className="text-2xl font-bold text-slate-900 dark:text-white tabular-nums">{count}</p>
          <p className="text-xs mt-1 text-slate-500 dark:text-slate-400">Expiring soon</p>
          <p className="text-[11px] mt-1.5 text-slate-400 dark:text-slate-500">
            {count === 0
              ? `Nothing expires soon — next ${days} days are clear`
              : `${count} customer${count === 1 ? '' : 's'}`}
          </p>
        </>
      )}
    </motion.div>
  );
}

// ── Recently expired card ────────────────────────────────────────────────────────
function RecentlyExpiredCard({ count, days = 20, loading }) {
  return (
    <motion.div whileHover={{ y:-2 }}
      className="stat-card rounded-2xl p-4 relative overflow-hidden h-full">
      <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full pointer-events-none drift2"
        style={{ background:'radial-gradient(circle,#fb718520,transparent)' }} />
      <div className="flex items-start justify-between mb-3">
        <div className="w-9 h-9 rounded-lg flex items-center justify-center"
          style={{ background:'#fb718518', border:'1px solid #fb718528' }}>
          <History size={17} style={{ color:'#fb7185' }} />
        </div>
        <span className="text-[11px] px-2 py-0.5 rounded-full font-semibold"
          style={{ background:'#fb718518', color:'#fb7185' }}>
          Last {days} days
        </span>
      </div>

      {loading ? (
        <div className="space-y-2">
          <div className="skeleton h-7 w-14" />
          <div className="skeleton h-3 w-28" />
        </div>
      ) : (
        <>
          <p className="text-2xl font-bold text-slate-900 dark:text-white tabular-nums">{count}</p>
          <p className="text-xs mt-1 text-slate-500 dark:text-slate-400">Recently expired</p>
          <p className="text-[11px] mt-1.5 text-slate-400 dark:text-slate-500">
            {count === 0
              ? `No recent expiries — nothing in the last ${days} days`
              : `${count} customer${count === 1 ? '' : 's'}`}
          </p>
        </>
      )}
    </motion.div>
  );
}

// ── New customers card ───────────────────────────────────────────────────────────
function NewCustomersCard({ month, total, recent, loading }) {
  return (
    <motion.div whileHover={{ y:-2 }}
      className="stat-card rounded-2xl p-4 relative overflow-hidden h-full">
      <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full pointer-events-none drift1"
        style={{ background:'radial-gradient(circle,#34d39920,transparent)' }} />

      <div className="flex items-start justify-between mb-3">
        <div className="w-9 h-9 rounded-lg flex items-center justify-center"
          style={{ background:'#34d39918', border:'1px solid #34d39928' }}>
          <UserPlus size={17} style={{ color:'#34d399' }} />
        </div>
        <span className="text-[11px] px-2 py-0.5 rounded-full font-semibold"
          style={{ background:'#34d39918', color:'#34d399' }}>
          Growing
        </span>
      </div>

      {loading ? (
        <div className="space-y-2">
          <div className="skeleton h-7 w-14" />
          <div className="skeleton h-3 w-28" />
          <div className="skeleton h-3 w-full mt-2.5" />
          <div className="skeleton h-3 w-full" />
        </div>
      ) : (
        <>
          <p className="text-2xl font-bold text-slate-900 dark:text-white tabular-nums">{total}</p>
          <p className="text-xs mt-1 text-slate-500 dark:text-slate-400">New customers</p>
          <p className="text-[11px] mt-1 text-slate-400 dark:text-slate-500">{month} · {total} joined</p>

          {recent && recent.length > 0 && (
            <div className="mt-3 space-y-1.5 pt-2.5" style={{ borderTop:'1px solid rgba(148,163,184,.08)' }}>
              {recent.map((r, i) => (
                <div key={i} className="flex items-center justify-between gap-2 text-[11px]">
                  <span className="text-slate-500 dark:text-slate-400 truncate">{r.name}</span>
                  <span className="font-semibold tabular-nums text-slate-900 dark:text-white shrink-0">
                    {fmtKsh(r.amount)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </motion.div>
  );
}

// ── System statistics card ──────────────────────────────────────────────────────
function SystemStatsCard({ customers, routers, online, loading }) {
  return (
    <motion.div whileHover={{ y:-2 }}
      className="stat-card rounded-2xl p-4 relative overflow-hidden h-full flex flex-col justify-between">
      <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full pointer-events-none drift2"
        style={{ background:'radial-gradient(circle,#38bdf820,transparent)' }} />

      <div className="flex items-center gap-2 mb-3">
        <div className="w-9 h-9 rounded-lg flex items-center justify-center"
          style={{ background:'#38bdf818', border:'1px solid #38bdf828' }}>
          <BarChart3 size={17} style={{ color:'#38bdf8' }} />
        </div>
        <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          System statistics
        </span>
      </div>

      {loading ? (
        <div className="grid grid-cols-3 gap-2.5">
          {[1,2,3].map(i => <div key={i} className="skeleton h-10" />)}
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-2.5 text-center">
          <div>
            <p className="text-lg font-bold tabular-nums text-slate-900 dark:text-white">{customers}</p>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">customers</p>
          </div>
          <div>
            <p className="text-lg font-bold tabular-nums text-slate-900 dark:text-white">{routers}</p>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">routers</p>
          </div>
          <div>
            <p className="text-lg font-bold tabular-nums" style={{ color:'#34d399' }}>{online}</p>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">online</p>
          </div>
        </div>
      )}
    </motion.div>
  );
}

// ── Main ───────────────────────────────────────────────────────────────────────
const Analytics = () => {
  const {
    totalSubscribers, setTotalSubscribers,
    subscribersOffline, setSubscribersOffline,
    showMenu1, setShowMenu1, showMenu2, setShowMenu2, showMenu3, setShowMenu3,
    showMenu4, setShowMenu4, showMenu5, setShowMenu5, showMenu6, setShowMenu6,
    showMenu7, setShowMenu7, showMenu8, setShowMenu8, showMenu9, setShowMenu9,
    showMenu10, setShowMenu10, showMenu11, setShowMenu11, showMenu12, setShowMenu12,
    expiry, setExpiry, expiry2, setExpiry2,
    condition, setCondition, condition2, setCondition2,
    status, setStatus, status2, setStatus2,
    currentHotspotPlan, setCurrentHotspotPlan,
    currentPPOEPlan, setCurrentPPOEPlan,
    calculateTimeRemaining, smsBalance, setSmsBalance,
  } = useApplicationSettings();

  const subdomain = window.location.hostname.split('.')[0];
  const isDark = useIsDarkMode();

  const [date, setDate]               = useState(new Date().toLocaleTimeString());
  const [routerData, setRouterData]   = useState(null);
  const [loading, setLoading]         = useState(false);
  const [totalBandwidth, setTotalBandwidth] = useState(0);
  const [totalOnlineUsers, setTotalOnlineUsers] = useState(0);
  const [totalDownload, setTotalDownload]   = useState(0);
  const [totalUpload, setTotalUpload]       = useState(0);
  const [totalInvoiceAmount, setTotalInvoiceAmount] = useState(0);

  // ── Hotspot & revenue & tickets state ─────────────────────────────────────
  const [hotspotActiveUsers, setHotspotActiveUsers] = useState(0);
  const [newCustomersToday, setNewCustomersToday]   = useState(0);
  const [revenueToday, setRevenueToday]       = useState(0);
  const [revenueThisMonth, setRevenueThisMonth]       = useState(0);

  const [revenueTodayPPPoE, setRevenueTodayPPPoE]   = useState(0);
  const [revenueYesterday, setRevenueYesterday] = useState(0);
  const [revenueMonth, setRevenueMonth]       = useState(0);
  const [openTickets, setOpenTickets]         = useState(0);
  const [statsLoading, setStatsLoading]       = useState(true);

  // ── Customer Insights state ───────────────────────────────────────────────
  const [expiringSoonCount, setExpiringSoonCount]         = useState(0);
  const [expiringSoonDays, setExpiringSoonDays]           = useState(10);
  const [recentlyExpiredCount, setRecentlyExpiredCount]   = useState(0);
  const [recentlyExpiredDays, setRecentlyExpiredDays]     = useState(20);
  const [newCustomersMonth, setNewCustomersMonth]         = useState('');
  const [newCustomersTotal, setNewCustomersTotal]         = useState(0);
  const [newCustomersRecent, setNewCustomersRecent]       = useState([]);
  const [sysCustomers, setSysCustomers]                   = useState(0);
  const [sysRouters, setSysRouters]                       = useState(0);
  const [sysOnlineRouters, setSysOnlineRouters]           = useState(0);
  const [insightsLoading, setInsightsLoading]             = useState(true);

  // Chart
  const maxDataPoints = 20;
  const dataHistory   = useRef([]);
  const [chartData, setChartData] = useState({
    series: [
      { name: 'Download', data: [] },
      { name: 'Upload',   data: [] },
    ],
    options: {
      chart: {
        type: 'area', height: 280,
        fontFamily: 'inherit',
        background: 'transparent',
        toolbar: { show: false },
        animations: { enabled: true, easing: 'linear', dynamicAnimation: { speed: 900 } },
        zoom: { enabled: false },
      },
      colors: ['#38bdf8', '#a78bfa'],
      fill: {
        type: 'gradient',
        gradient: { shadeIntensity: 1, opacityFrom: .35, opacityTo: .02, stops: [0, 90, 100] },
      },
      stroke: { curve: 'smooth', width: 2.5 },
      dataLabels: { enabled: false },
      grid: { strokeDashArray: 4, xaxis: { lines: { show: false } } },
      xaxis: {
        type: 'datetime',
        labels: {
          datetimeUTC: false, style: { fontSize: '11px' },
          formatter: (_v, ts) => new Date(ts).toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        },
        axisBorder: { show: false }, axisTicks: { show: false },
      },
      yaxis: {
        labels: { formatter: v => `${v} Mbps` },
        min: 0,
      },
      legend: { position: 'top' },
      tooltip: { x: { format: 'HH:mm:ss' }, y: { formatter: v => `${v} Mbps` } },
    },
  });

  // Keep the ApexCharts theme (text/grid/tooltip colors) in sync with light/dark —
  // it must never default to a forced dark theme.
  useEffect(() => {
    const axisColor = isDark ? '#94a3b8' : '#64748b';
    const gridColor = isDark ? 'rgba(148,163,184,.12)' : 'rgba(148,163,184,.25)';

    setChartData(prev => ({
      ...prev,
      options: {
        ...prev.options,
        theme: { mode: isDark ? 'dark' : 'light' },
        chart: { ...prev.options.chart, foreColor: axisColor },
        grid: { ...prev.options.grid, borderColor: gridColor },
        xaxis: { ...prev.options.xaxis, labels: { ...prev.options.xaxis.labels, style: { ...prev.options.xaxis.labels.style, colors: axisColor } } },
        yaxis: { ...prev.options.yaxis, labels: { ...prev.options.yaxis.labels, style: { colors: axisColor } } },
        legend: { ...prev.options.legend, labels: { colors: axisColor } },
        tooltip: { ...prev.options.tooltip, theme: isDark ? 'dark' : 'light' },
      },
    }));
  }, [isDark]);

  // ── Fetches ──────────────────────────────────────────────────────────────────
  const getUnpaidInvoiceAmount = useCallback(async () => {
    try {
      const res = await fetch('/api/unpaid_invoices_amount', { headers: { 'X-Subdomain': subdomain } });
      if (res.ok) { const d = await res.json(); setTotalInvoiceAmount(d); }
    } catch (_) {}
  }, [subdomain]);

  const getCurrentHotspotPlan = useCallback(async () => {
    try {
      const res = await fetch('/api/get_hotspot_and_dial_plan', { headers: { 'X-Subdomain': subdomain } });
      const d = await res.json();
      if (res.ok) {
        if (!d.length) { setExpiry2('No license'); setStatus2('Not Active'); }
        else {
          setExpiry2(d[0]?.expiry); setCondition2(d[0]?.condition);
          setStatus2(d[0]?.status); setCurrentHotspotPlan(d[0]?.name);
        }
      }
    } catch (_) {}
  }, [subdomain]);

  const getPPOEstats = useCallback(async () => {
    try {
      const res = await fetch('/api/get_total_bandwidth_and_online_users', { headers: { 'X-Subdomain': subdomain } });
      if (res.ok) {
        const d = await res.json();
        setTotalBandwidth(d.total_bandwidth);
        setTotalDownload(d.total_download);
        setTotalUpload(d.total_upload);
      }
    } catch (_) {}
  }, [subdomain]);

  const fetchtotalSubscribers = useCallback(async () => {
    try {
      const res = await fetch('/api/total_subscribers', { headers: { 'X-Subdomain': subdomain } });
      if (res.ok) { const d = await res.json(); setTotalSubscribers(d.total_subscribers); }
    } catch (_) {}
  }, [subdomain]);

  const fetchtotalSubscribersOffline = useCallback(async () => {
    try {
      const res = await fetch('/api/subscribers_offline', { headers: { 'X-Subdomain': subdomain } });
      if (res.ok) { const d = await res.json(); setSubscribersOffline(d.total_subscribers); }
    } catch (_) {}
  }, [subdomain]);

  // ── Today's revenue ───────────────────────────────────────────────────────
  // NOTE: `/api/todays_revenue` returns a plain number (see the hotspot dashboard,
  // which reads it the same way), not an object. Previously this handler treated
  // the response as `{ revenue_yesterday, new_customers_today, open_tickets, ... }`,
  // which meant every field silently resolved to 0 — including `revenue_yesterday`,
  // which then overwrote the correct value set by `fetchYesterdayRevenue` below.
  // That was the cause of "yesterday's revenue" always showing 0.
  const fetchDashboardStats = useCallback(async () => {
    try {
      const res = await fetch('/api/todays_revenue', { headers: { 'X-Subdomain': subdomain } });
      if (res.ok) {
        const d = await res.json();
        setRevenueToday(d ?? 0);
      }
    } catch (_) {
    } finally {
      setStatsLoading(false);
    }
  }, [subdomain]);

  // ── Fetch PPPoE revenue this month ──────────────────────────────────────────
  const fetchPPPoERevenueThisMonth = useCallback(async () => {
    try {
      const res = await fetch('/api/pppoe_revenue_this_month', { headers: { 'X-Subdomain': subdomain } });
      if (res.ok) {
        const d = await res.json();
        setRevenueThisMonth(d);
      }
    } catch (_) {}
  }, [subdomain]);

  const fetchHotspotERevenueThisMonth = useCallback(async () => {
    try {
      const res = await fetch('/api/this_month_revenue', { headers: { 'X-Subdomain': subdomain } });
      if (res.ok) {
        const d = await res.json();
        setRevenueThisMonth(d);
      }
    } catch (_) {}
  }, [subdomain]);

  const fetchPPPoERevenueToday = useCallback(async () => {
    try {
      const res = await fetch('/api/pppoe_revenue_today', { headers: { 'X-Subdomain': subdomain } });
      if (res.ok) {
        const d = await res.json();
        setRevenueTodayPPPoE(d.revenue_today ?? 0);
      }
    } catch (_) {}
  }, [subdomain]);

  const fetchYesterdayRevenue = useCallback(async () => {
    try {
      const res = await fetch('/api/yesterdays_revenue', { headers: { 'X-Subdomain': subdomain } });
      if (res.ok) {
        const d = await res.json();
        setRevenueYesterday(d);
      }
    } catch (_) {
    } finally {
      setStatsLoading(false);
    }
  }, [subdomain]);

  // ── Expiring soon (next 10 days) ──────────────────────────────────────────
  const fetchExpiringSoon = useCallback(async () => {
    try {
      const res = await fetch('/api/expiring_soon?days=10', { headers: { 'X-Subdomain': subdomain } });
      if (res.ok) {
        const d = await res.json();
        setExpiringSoonCount(d.count ?? 0);
        setExpiringSoonDays(d.days ?? 10);
      }
    } catch (_) {}
  }, [subdomain]);

  // ── Recently expired (last 20 days) ───────────────────────────────────────
  const fetchRecentlyExpired = useCallback(async () => {
    try {
      const res = await fetch('/api/recently_expired?days=20', { headers: { 'X-Subdomain': subdomain } });
      if (res.ok) {
        const d = await res.json();
        setRecentlyExpiredCount(d.count ?? 0);
        setRecentlyExpiredDays(d.days ?? 20);
      }
    } catch (_) {}
  }, [subdomain]);

  // ── New customers this month ──────────────────────────────────────────────
  const fetchNewCustomers = useCallback(async () => {
    try {
      const res = await fetch('/api/new_customers_this_month', { headers: { 'X-Subdomain': subdomain } });
      if (res.ok) {
        const d = await res.json();
        setNewCustomersMonth(d.month ?? '');
        setNewCustomersTotal(d.total_joined ?? 0);
        setNewCustomersRecent(d.recent ?? []);
      }
    } catch (_) {}
  }, [subdomain]);

  // ── System statistics ─────────────────────────────────────────────────────
  const fetchSystemStatistics = useCallback(async () => {
    try {
      const res = await fetch('/api/system_statistics', { headers: { 'X-Subdomain': subdomain } });
      if (res.ok) {
        const d = await res.json();
        setSysCustomers(d.total_customers ?? 0);
        setSysRouters(d.total_routers ?? 0);
        setSysOnlineRouters(d.online_routers ?? 0);
      }
    } catch (_) {
    } finally {
      setInsightsLoading(false);
    }
  }, [subdomain]);

  useEffect(() => {
    getUnpaidInvoiceAmount();
    getCurrentHotspotPlan();
    getPPOEstats();
    fetchYesterdayRevenue();
    fetchtotalSubscribers();
    fetchtotalSubscribersOffline();
    fetchDashboardStats();
    fetchPPPoERevenueToday();
    fetchExpiringSoon();
    fetchRecentlyExpired();
    fetchNewCustomers();
    fetchHotspotERevenueThisMonth();
    fetchSystemStatistics();
  }, [getUnpaidInvoiceAmount, getCurrentHotspotPlan, getPPOEstats, fetchtotalSubscribers,
    fetchtotalSubscribersOffline, fetchDashboardStats, fetchYesterdayRevenue, fetchPPPoERevenueToday,
    fetchExpiringSoon, fetchRecentlyExpired, fetchNewCustomers,
    fetchSystemStatistics, fetchPPPoERevenueThisMonth, fetchHotspotERevenueThisMonth]);



  // Clock
  useEffect(() => {
    const t = setInterval(() => setDate(new Date().toLocaleTimeString('en-US', { hour:'2-digit', minute:'2-digit', second:'2-digit', hour12:true })), 1000);
    return () => clearInterval(t);
  }, []);

  // Radacct WebSocket
  useEffect(() => {
    const sub = cable.subscriptions.create(
      { channel: 'RadacctChannel', 'X-Subdomain': subdomain },
      { received(d) {
        setTotalOnlineUsers(d.online_radacct);
      },
        connected() {},
        disconnected() {},
      }
    );
    return () => sub.unsubscribe();
  }, [subdomain]);

  // Hotspot active users WebSocket (falls back to REST poll above if absent)
  useEffect(() => {
    const sub = cable.subscriptions.create(
      { channel: 'HotspotChannel', 'X-Subdomain': subdomain },
      {
        received(d) {
          setHotspotActiveUsers(d.active_user_count);
        },
        connected() {},
        disconnected() {},
      }
    );
    return () => sub.unsubscribe();
  }, [subdomain]);

  // Bandwidth WebSocket
  useEffect(() => {
    const sub = cable.subscriptions.create(
      { channel: 'BandwidthChannel', 'X-Subdomain': subdomain },
      {
        received(d) {
          setTotalBandwidth(d.total_bandwidth);
          setTotalDownload(d.total_download);
          setTotalUpload(d.total_upload);
          const now  = new Date().getTime();
          const entry = { timestamp: now, download: d.total_download || 0, upload: d.total_upload || 0 };
          dataHistory.current = [...dataHistory.current, entry].slice(-maxDataPoints);
          setChartData(prev => ({
            ...prev,
            series: [
              { name: 'Download', data: dataHistory.current.map(e => [e.timestamp, e.download]) },
              { name: 'Upload',   data: dataHistory.current.map(e => [e.timestamp, e.upload])   },
            ],
          }));
        },
        connected() {},
        disconnected() {},
      }
    );
    return () => sub.unsubscribe();
  }, [subdomain]);

  const closeMenus = () => {
    [setShowMenu1,setShowMenu2,setShowMenu3,setShowMenu4,setShowMenu5,setShowMenu6,
     setShowMenu7,setShowMenu8,setShowMenu9,setShowMenu10,setShowMenu11,setShowMenu12].forEach(fn => fn(false));
  };

  const currentData = dataHistory.current.slice(-1)[0] || { download: 0, upload: 0, total: 0 };

  // ── Stagger variants ─────────────────────────────────────────────────────────
  const container = { hidden:{}, visible:{ transition:{ staggerChildren:.06 } } };
  const item      = { hidden:{ opacity:0, y:14 }, visible:{ opacity:1, y:0, transition:{ duration:.35 } } };

  return (
    <>
      <Styles />
      <div onClick={closeMenus} className="analytics-root font-sans min-h-screen p-5 space-y-5 text-slate-900 dark:text-slate-200"
        style={{ position:'relative', overflow:'hidden' }}>

        {/* ── Ambient blobs ──────────────────────────────────────────────────── */}
        <div className="drift1 absolute top-0 left-0 w-96 h-96 rounded-full pointer-events-none"
          style={{ background:'radial-gradient(circle,rgba(56,189,248,.05) 0%,transparent 70%)', zIndex:0 }} />
        <div className="drift2 absolute bottom-0 right-0 w-96 h-96 rounded-full pointer-events-none"
          style={{ background:'radial-gradient(circle,rgba(167,139,250,.05) 0%,transparent 70%)', zIndex:0 }} />
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage:'radial-gradient(rgba(148,163,184,.04) 1px,transparent 1px)',
          backgroundSize:'28px 28px', zIndex:0 }} />

        <Suspense fallback={<div className="flex h-64 items-center justify-center"><UiLoader /></div>}>
          <div className="relative z-10 space-y-5">

            {/* ── Header ───────────────────────────────────────────────────────── */}
            <motion.div initial={{ opacity:0, y:-10 }} animate={{ opacity:1, y:0 }}
              className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-bold text-slate-900 dark:text-white">Network Overview</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                  {new Date().toLocaleDateString('en-KE',{ weekday:'long', year:'numeric', month:'long', day:'numeric' })}
                </p>
              </div>
              <NotificationCenter />
            </motion.div>

            {/* ── Top 4 KPI cards ──────────────────────────────────────────────── */}
            <motion.div variants={container} initial="hidden" animate="visible"
              className="grid grid-cols-2 lg:grid-cols-4 gap-3">

              <motion.div variants={item}>
                <StatCard
                  title="All Clients"
                  value={totalSubscribers || 0}
                  icon={<LuUsers size={17} />}
                  accent="#a78bfa"
                  to="/admin/pppoe-subscribers"
                  tag="PPPoE"
                />
              </motion.div>

              <motion.div variants={item}>
                <StatCard
                  title="Clients Online"
                  value={totalOnlineUsers || 0}
                  icon={<MdOutlineOnlinePrediction size={17} />}
                  accent="#34d399"
                  pulse="online"
                  to="/admin/subscribers-online"
                  tag="Live"
                />
              </motion.div>

              <motion.div variants={item}>
                <Link to="/admin/unpaid-invoices" className="block h-full">
                  <motion.div whileHover={{ y:-2, scale:1.005 }}
                    className="stat-card rounded-2xl p-4 relative overflow-hidden h-full">
                    <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full pointer-events-none drift2"
                      style={{ background:'radial-gradient(circle,#fbbf2420,transparent)' }} />
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-9 h-9 rounded-lg flex items-center justify-center"
                        style={{ background:'#fbbf2418', border:'1px solid #fbbf2428' }}>
                        <CreditCard size={17} style={{ color:'#fbbf24' }} />
                      </div>
                      <span className="text-[11px] px-2 py-0.5 rounded-full font-semibold"
                        style={{ background:'#fbbf2418', color:'#fbbf24' }}>Due</span>
                    </div>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white tabular-nums">{fmtKsh(totalInvoiceAmount)}</p>
                    <p className="text-xs mt-1 text-slate-500 dark:text-slate-400">Outstanding invoices</p>
                    <div className="flex items-center gap-1 mt-3 text-xs font-semibold" style={{ color:'#fbbf24' }}>
                      View invoices <ChevronRight size={12} className="card-arrow" />
                    </div>
                  </motion.div>
                </Link>
              </motion.div>

              {/* Revenue Today (PPPoE) */}
              <motion.div variants={item}>
                <div className="reveal-amount block h-full">
                  <motion.div whileHover={{ y:-2, scale:1.005 }}
                    className="stat-card rounded-2xl p-4 relative overflow-hidden h-full">
                    <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full pointer-events-none drift1"
                      style={{ background:'radial-gradient(circle,#22d3ee20,transparent)' }} />

                    <div className="flex items-start justify-between mb-3">
                      <div className="w-9 h-9 rounded-lg flex items-center justify-center"
                        style={{ background:'#22d3ee18', border:'1px solid #22d3ee28' }}>
                        <Sun size={17} style={{ color:'#22d3ee' }} />
                      </div>
                      <span className="text-[11px] px-2 py-0.5 rounded-full font-semibold"
                        style={{ background:'#22d3ee18', color:'#22d3ee' }}>PPPoE</span>
                    </div>

                    {statsLoading ? (
                      <div className="space-y-2">
                        <div className="skeleton h-7 w-24" />
                        <div className="skeleton h-3 w-20" />
                      </div>
                    ) : (
                      <>
                        <p className="text-2xl font-bold text-slate-900 dark:text-white tabular-nums">
                          <span className="blur-amount">{fmtKsh(revenueTodayPPPoE)}</span>
                        </p>
                        <p className="text-xs mt-1 text-slate-500 dark:text-slate-400">Revenue Today</p>
                        <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1.5">Hover to reveal</p>
                      </>
                    )}
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>

            {/* ── License ──────────────────────────────────────────────────────── */}
            <License
              expiry={expiry} condition={condition} status={status}
              expiry2={expiry2} condition2={condition2} status2={status2}
              calculateTimeRemaining={calculateTimeRemaining}
              smsBalance={smsBalance}
            />

            {/* ── Hotspot Performance · Revenue ───────────────────────────────── */}
            <motion.div initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }} transition={{ delay:.08 }}>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="relative inline-flex w-2 h-2">
                      <span className="pulse-online absolute inset-0 rounded-full" />
                      <span className="relative block w-2 h-2 rounded-full bg-emerald-400" />
                    </span>
                    <span className="text-xs font-semibold text-emerald-500 dark:text-emerald-400 uppercase tracking-wider">Live</span>
                  </div>
                  <h2 className="text-sm font-bold text-slate-900 dark:text-white">Hotspot Performance · Revenue</h2>
                </div>
              </div>

              <motion.div variants={container} initial="hidden" animate="visible"
                className="grid grid-cols-2 lg:grid-cols-6 gap-3">

                <motion.div variants={item} className="lg:col-span-1 col-span-2">
                  <StatCard
                    title="Connected now"
                    value={hotspotActiveUsers || 0}
                    icon={<Radio size={17} />}
                    accent="#22d3ee"
                    pulse="online"
                    tag="Hotspot"
                    loading={statsLoading}
                    to='/admin/hotspot-dashboard'
                  />
                </motion.div>

                <motion.div variants={item} className="lg:col-span-1 col-span-2">
                  <StatCard
                    title="New customers today"
                    value={newCustomersToday || 0}
                    icon={<UserPlus size={17} />}
                    accent="#34d399"
                    tag="Today"
                    loading={statsLoading}
                  />
                </motion.div>

                <motion.div variants={item} className="col-span-1">
                  <RevenueCard
                    label="Today's revenue"
                    value={revenueToday}
                    accent="#facc15"
                    icon={<Sun size={17} />}
                    loading={statsLoading}
                    delay={0.04}
                  />
                </motion.div>

                <motion.div variants={item} className="col-span-1">
                  <RevenueCard
                    label="Yesterday's revenue"
                    value={revenueYesterday}
                    accent="#fb923c"
                    icon={<Moon size={17} />}
                    loading={statsLoading}
                    delay={0.08}
                  />
                </motion.div>

                <motion.div variants={item} className="col-span-2 lg:col-span-1">
                  <RevenueCard
                    label="This Month's revenue"
                    value={revenueThisMonth}
                    accent="#38bdf8"
                    icon={<CalendarDays size={17} />}
                    loading={statsLoading}
                    delay={0.12}
                  />
                </motion.div>

                <motion.div variants={item} className="col-span-2 lg:col-span-1">
                  <Link to="/admin/support-tickets" className="block h-full">
                    <motion.div whileHover={{ y:-2, scale:1.005 }}
                      className="stat-card rounded-2xl p-4 relative overflow-hidden h-full">
                      <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full pointer-events-none drift1"
                        style={{ background:'radial-gradient(circle,#fb718520,transparent)' }} />

                      <div className="flex items-start justify-between mb-3">
                        <div className="w-9 h-9 rounded-lg flex items-center justify-center relative"
                          style={{ background:'#fb718518', border:'1px solid #fb718528' }}>
                          <Ticket size={17} style={{ color:'#fb7185' }} />
                        </div>
                        {openTickets > 0 && (
                          <span className="ticket-badge text-[11px] px-2 py-0.5 rounded-full font-semibold"
                            style={{ background:'#fb718518', color:'#fb7185' }}>
                            {openTickets > 99 ? '99+' : openTickets} open
                          </span>
                        )}
                      </div>

                      {statsLoading ? (
                        <div className="space-y-2">
                          <div className="skeleton h-7 w-14" />
                          <div className="skeleton h-3 w-20" />
                        </div>
                      ) : (
                        <>
                          <p className="text-2xl font-bold text-slate-900 dark:text-white tabular-nums">{openTickets || 0}</p>
                          <p className="text-xs mt-1 text-slate-500 dark:text-slate-400">Open tickets</p>
                        </>
                      )}

                      <div className="flex items-center gap-1 mt-3 text-xs font-semibold" style={{ color:'#fb7185' }}>
                        View tickets <ChevronRight size={12} className="card-arrow" />
                      </div>
                    </motion.div>
                  </Link>
                </motion.div>
              </motion.div>
            </motion.div>

            {/* ── Customer Insights ───────────────────────────────────────────── */}
            <motion.div initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }} transition={{ delay:.1 }}>
              <div className="mb-3">
                <h2 className="text-sm font-bold text-slate-900 dark:text-white">Customer Insights</h2>
              </div>

              <motion.div variants={container} initial="hidden" animate="visible"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">

                <motion.div variants={item}>
                  <ExpiringSoonCard
                    count={expiringSoonCount}
                    days={expiringSoonDays}
                    loading={insightsLoading}
                  />
                </motion.div>

                <motion.div variants={item}>
                  <RecentlyExpiredCard
                    count={recentlyExpiredCount}
                    days={recentlyExpiredDays}
                    loading={insightsLoading}
                  />
                </motion.div>

                <motion.div variants={item}>
                  <NewCustomersCard
                    month={newCustomersMonth}
                    total={newCustomersTotal}
                    recent={newCustomersRecent}
                    loading={insightsLoading}
                  />
                </motion.div>

                <motion.div variants={item}>
                  <SystemStatsCard
                    customers={sysCustomers}
                    routers={sysRouters}
                    online={sysOnlineRouters}
                    loading={insightsLoading}
                  />
                </motion.div>
              </motion.div>
            </motion.div>

            {/* ── Bandwidth overview + mini cards ──────────────────────────────── */}
            <motion.div initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }} transition={{ delay:.12 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-3">

              {/* Data summary card */}
              <motion.div whileHover={{ y:-2 }}
                className="stat-card rounded-2xl p-5 relative overflow-hidden flex flex-col justify-between">
                <div className="absolute -top-5 -right-5 w-20 h-20 rounded-full pointer-events-none drift1"
                  style={{ background:'radial-gradient(circle,rgba(56,189,248,.12),transparent)' }} />

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center"
                      style={{ background:'rgba(56,189,248,.12)', border:'1px solid rgba(56,189,248,.2)' }}>
                      <Wifi size={17} style={{ color:'#38bdf8' }} />
                    </div>
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full"
                      style={{ background:'rgba(56,189,248,.1)', color:'#38bdf8' }}>24h</span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold mb-1">Total Bandwidth</p>
                  <p className="text-3xl font-bold text-slate-900 dark:text-white tabular-nums">{totalBandwidth}</p>
                </div>

                <div className="mt-4 space-y-2 pt-3"
                  style={{ borderTop:'1px solid rgba(148,163,184,.08)' }}>
                  {[
                    { label:'Download', value: totalDownload, color:'#38bdf8', Icon: FaArrowDown },
                    { label:'Upload',   value: totalUpload,   color:'#a78bfa', Icon: FaArrowUp },
                  ].map(r => (
                    <div key={r.label} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <r.Icon size={12} style={{ color: r.color }} />
                        <span className="text-xs text-slate-500 dark:text-slate-400">{r.label}</span>
                      </div>
                      <span className="text-sm font-semibold tabular-nums" style={{ color: r.color }}>
                        {r.value}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Three mini bandwidth cards */}
              <div className="lg:col-span-2 grid 
              grid-cols-1 sm:grid-cols-3 gap-3 ">

                <BwCard label={<p className='text-gray-600 dark:text-gray-300'>Current Download </p>} value={totalDownload} accent="#38bdf8"
                  icon={<FaArrowDown size={14} />} />

                <BwCard label={<p className='text-gray-600 dark:text-gray-300'>Current Upload </p>}   value={totalUpload}   accent="#a78bfa"
                  icon={<FaArrowUp size={14} />} />
                <BwCard label={<p className='text-gray-600 dark:text-gray-300'>Total Bandwidth </p>}  value={totalBandwidth || currentData.total} accent="#34d399"
                  icon={<Activity size={14} />} />

                {/* Utilisation bar */}
                <div className="sm:col-span-3 bandwidth-bar rounded-2xl p-4">
                  <div className="flex items-center justify-between mb-2.5">
                    <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">Bandwidth split</p>
                    <div className="flex items-center gap-4 text-xs text-slate-400 dark:text-slate-500">
                      <span className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full" style={{ background:'#38bdf8' }} />
                        Download
                      </span>
                      <span className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full" style={{ background:'#a78bfa' }} />
                        Upload
                      </span>
                    </div>
                  </div>
                  <div className="h-2.5 rounded-full overflow-hidden flex gap-0.5"
                    style={{ background:'rgba(148,163,184,.25)' }}>
                    {(() => {
                      const total = (+totalDownload || 0) + (+totalUpload || 0);
                      const dlPct = total > 0 ? ((+totalDownload / total) * 100).toFixed(1) : 50;
                      const ulPct = total > 0 ? ((+totalUpload   / total) * 100).toFixed(1) : 50;
                      return (
                        <>
                          <motion.div initial={{ width:0 }} animate={{ width:`${dlPct}%` }} transition={{ duration:.8 }}
                            className="h-full rounded-l-full" style={{ background:'#38bdf8' }} />
                          <motion.div initial={{ width:0 }} animate={{ width:`${ulPct}%` }} transition={{ duration:.8 }}
                            className="h-full rounded-r-full" style={{ background:'#a78bfa' }} />
                        </>
                      );
                    })()}
                  </div>
                  <div className="flex justify-between mt-2 text-xs text-slate-500 dark:text-slate-400 tabular-nums">
                    <span>{totalDownload}</span>
                    <span>{totalUpload}</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* ── Live chart ───────────────────────────────────────────────────── */}
            <motion.div initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }} transition={{ delay:.16 }}
              className="chart-panel rounded-2xl p-5">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="relative inline-flex w-2 h-2">
                      <span className="pulse-online absolute inset-0 rounded-full" />
                      <span className="relative block w-2 h-2 rounded-full bg-emerald-400" />
                    </span>
                    <span className="text-xs font-semibold text-emerald-500 dark:text-emerald-400 uppercase tracking-wider">Real-time</span>
                  </div>
                  <h2 className="text-sm font-bold text-slate-900 dark:text-white">Bandwidth Usage</h2>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500 tabular-nums">
                  <Zap size={12} style={{ color:'#fbbf24' }} />
                  {dataHistory.current.length}/{maxDataPoints} points
                </div>
              </div>

              <ReactApexChart
                options={chartData.options}
                series={chartData.series}
                type="area"
                height={280}
              />
            </motion.div>

            <ChurnRateSection subdomain={subdomain} />

          </div>
        </Suspense>
      </div>
    </>
  );
};

export default Analytics;