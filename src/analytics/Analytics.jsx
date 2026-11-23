import { useApplicationSettings } from '../settings/ApplicationSettings';
import { useState, useEffect, useCallback, useRef, Suspense } from 'react';
import { motion } from 'framer-motion';
import { IoCloudOfflineOutline } from "react-icons/io5";
import { GiWifiRouter } from "react-icons/gi";
import { Link } from 'react-router-dom';
import { createConsumer } from "@rails/actioncable";
import UiLoader from '../uiloader/UiLoader';
import ReactApexChart from 'react-apexcharts';
import {
  ChevronRight, Ticket, AlarmClock, History, AlertTriangle, Eye, EyeOff,
} from 'lucide-react';

import License from '../layout/License';
import ChurnRateSection from './ChurnRateSection';
import NotificationCenter from './NotificationCenter';
import RecentHotspotPayments from './RecentHotspotPayments';

const cable = createConsumer(`wss://${window.location.hostname}/cable`);

// ── Dark-mode detection (drives chart theming only) ───────────────────────────
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

// ── Minimal styles: skeleton + live pulse only ────────────────────────────────
const Styles = () => (
  <style>{`
    @keyframes shimmer { 0% { background-position: -600px 0; } 100% { background-position: 600px 0; } }
    @keyframes pulse-ring { 0% { transform: scale(1); opacity: .6; } 100% { transform: scale(2.2); opacity: 0; } }
    .skeleton {
      background: linear-gradient(90deg,#e2e8f0 25%,#f1f5f9 50%,#e2e8f0 75%);
      background-size: 600px 100%; animation: shimmer 1.5s infinite; border-radius: 8px;
    }
    .dark .skeleton { background: linear-gradient(90deg,#1e293b 25%,#334155 50%,#1e293b 75%); background-size: 600px 100%; }
    .live-dot::after {
      content: ''; position: absolute; inset: 0; border-radius: 50%;
      background: currentColor; animation: pulse-ring 1.8s ease-out infinite;
    }
  `}</style>
);

// ── Helpers ───────────────────────────────────────────────────────────────────
const fmtKsh = (v) => `KSh ${Number(v || 0).toLocaleString('en-KE')}`;
const HIDDEN = 'KSh ••••••';
const toNumber = (d, ...keys) => {
  if (typeof d === 'number') return d;
  if (d && typeof d === 'object') {
    for (const k of keys) if (typeof d[k] === 'number') return d[k];
  }
  return Number(d) || 0;
};

// ── Layout primitives ─────────────────────────────────────────────────────────
const cardBase =
  'rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-5';

function Section({ title, description, action, children }) {
  return (
    <section className="space-y-3">
      <div className="flex items-end justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">{title}</h2>
          {description && (
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">{description}</p>
          )}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

function Skeleton({ className = 'h-8 w-24' }) {
  return <div className={`skeleton ${className}`} />;
}

function Metric({ label, value, loading, hint }) {
  return (
    <div className="min-w-0">
      <p className="text-sm text-slate-600 dark:text-slate-400">{label}</p>
      {loading ? (
        <Skeleton className="h-7 w-20 mt-1" />
      ) : (
        <p className="text-xl font-semibold text-slate-900 dark:text-white tabular-nums mt-0.5 truncate">{value}</p>
      )}
      {hint && !loading && <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{hint}</p>}
    </div>
  );
}

function LinkCard({ to, children, className = '' }) {
  const inner = (
    <motion.div whileHover={{ y: -2 }} className={`${cardBase} h-full ${className}`}>
      {children}
    </motion.div>
  );
  return to ? <Link to={to} className="block h-full">{inner}</Link> : inner;
}

// ── Top row: Revenue today ────────────────────────────────────────────────────
function RevenueTodayCard({ pppoe, hotspot, yesterdayTotal, show, loading }) {
  const total = pppoe + hotspot;
  const pct = yesterdayTotal > 0 ? ((total - yesterdayTotal) / yesterdayTotal) * 100 : null;
  const money = (v) => (show ? fmtKsh(v) : HIDDEN);

  return (
    <div className={`${cardBase} h-full`}>
      <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">Revenue today</p>
      {loading ? (
        <div className="space-y-2 mt-2"><Skeleton className="h-9 w-40" /><Skeleton className="h-4 w-48" /></div>
      ) : (
        <>
          <p className="text-3xl font-bold text-slate-900 dark:text-white tabular-nums mt-1">{money(total)}</p>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            {pct === null ? 'No revenue recorded yesterday to compare with' : (
              <>
                <span className={`font-semibold ${pct >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                  {pct >= 0 ? '+' : ''}{pct.toFixed(0)}%
                </span>{' '}
                vs {money(yesterdayTotal)} yesterday
              </>
            )}
          </p>
          <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
            <Metric label="Home internet (PPPoE)" value={money(pppoe)} />
            <Metric label="Hotspot" value={money(hotspot)} />
          </div>
        </>
      )}
    </div>
  );
}

// ── Top row: Bandwidth ────────────────────────────────────────────────────────
function BandwidthCard({ total, download, upload }) {
  return (
    <div className={`${cardBase} h-full`}>
      <div className="flex items-center gap-2">
        <span className="relative inline-flex w-2.5 h-2.5 text-emerald-500">
          <span className="live-dot absolute inset-0 rounded-full" />
          <span className="relative block w-2.5 h-2.5 rounded-full bg-emerald-500" />
        </span>
        <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">Internet traffic (live)</p>
      </div>
      <p className="text-3xl font-bold text-slate-900 dark:text-white tabular-nums mt-1">{total || 0}</p>
      <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Total bandwidth in use right now</p>
      <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
        <Metric label="Download" value={download || 0} />
        <Metric label="Upload" value={upload || 0} />
      </div>
    </div>
  );
}

// ── Top row: Customers ────────────────────────────────────────────────────────
function CustomersCard({ total, online }) {
  const notConnected = Math.max((+total || 0) - (+online || 0), 0);
  return (
    <LinkCard to="/admin/pppoe-subscribers">
      <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">Home internet customers (PPPoE)</p>
      <p className="text-3xl font-bold text-slate-900 dark:text-white tabular-nums mt-1">{total || 0}</p>
      <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Total registered customers</p>
      <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
        <Metric label="Online now" value={online || 0} />
        <Metric label="Not connected" value={notConnected} />
      </div>
    </LinkCard>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
const Analytics = () => {
  const {
    totalSubscribers, setTotalSubscribers,
    setShowMenu1, setShowMenu2, setShowMenu3, setShowMenu4, setShowMenu5, setShowMenu6,
    setShowMenu7, setShowMenu8, setShowMenu9, setShowMenu10, setShowMenu11, setShowMenu12,
    expiry, setExpiry, expiry2, setExpiry2,
    condition, setCondition, condition2, setCondition2,
    status, setStatus, status2, setStatus2,
    setCurrentHotspotPlan,
    calculateTimeRemaining, smsBalance,
  } = useApplicationSettings();

  const subdomain = window.location.hostname.split('.')[0];
  const isDark = useIsDarkMode();
  const headers = { 'X-Subdomain': subdomain };

  // Show/hide money amounts (persisted, hidden by default)
  const [showAmounts, setShowAmounts] = useState(() => {
    try { return localStorage.getItem('dashboard_show_amounts') === '1'; } catch (_) { return false; }
  });
  const toggleAmounts = (e) => {
    e.stopPropagation();
    setShowAmounts(v => {
      try { localStorage.setItem('dashboard_show_amounts', v ? '0' : '1'); } catch (_) {}
      return !v;
    });
  };
  const money = (v) => (showAmounts ? fmtKsh(v) : HIDDEN);

  // Live data
  const [totalBandwidth, setTotalBandwidth] = useState(0);
  const [totalDownload, setTotalDownload]   = useState(0);
  const [totalUpload, setTotalUpload]       = useState(0);
  const [totalOnlineUsers, setTotalOnlineUsers] = useState(0);
  const [hotspotActiveUsers, setHotspotActiveUsers] = useState(0);

  // Revenue
  const [hotspotToday, setHotspotToday]         = useState(0);
  const [hotspotYesterday, setHotspotYesterday] = useState(0);
  const [hotspotMonth, setHotspotMonth]         = useState(0);
  const [pppoeToday, setPppoeToday]             = useState(0);
  const [pppoeYesterday, setPppoeYesterday]     = useState(0);
  const [pppoeMonth, setPppoeMonth]             = useState(0);
  const [revenueLoading, setRevenueLoading]     = useState(true);

  // Operations
  const [openTickets, setOpenTickets] = useState(0);
  const [expiringSoonCount, setExpiringSoonCount]       = useState(0);
  const [expiringSoonDays, setExpiringSoonDays]         = useState(10);
  const [recentlyExpiredCount, setRecentlyExpiredCount] = useState(0);
  const [recentlyExpiredDays, setRecentlyExpiredDays]   = useState(20);

  // Activity / system
  const [newCustomersMonth, setNewCustomersMonth]   = useState('');
  const [newCustomersTotal, setNewCustomersTotal]   = useState(0);
  const [newCustomersRecent, setNewCustomersRecent] = useState([]);
  const [sysCustomers, setSysCustomers]             = useState(0);
  const [sysRouters, setSysRouters]                 = useState(0);
  const [sysOnlineRouters, setSysOnlineRouters]     = useState(0);
  const [insightsLoading, setInsightsLoading]       = useState(true);

  // Alerts
  const [apStats, setApStats] = useState({ total: 0, online: 0, offline: 0, offline_list: [] });
  const [apLoading, setApLoading] = useState(true);
  const [pncStats, setPncStats] = useState({ count: 0, amount: 0, auto_eligible_count: 0 });

  // Chart
  const maxDataPoints = 20;
  const dataHistory = useRef([]);
  const [chartData, setChartData] = useState({
    series: [{ name: 'Download', data: [] }, { name: 'Upload', data: [] }],
    options: {
      chart: {
        type: 'area', height: 280, fontFamily: 'inherit', background: 'transparent',
        toolbar: { show: false }, zoom: { enabled: false },
        animations: { enabled: true, easing: 'linear', dynamicAnimation: { speed: 900 } },
      },
      colors: ['#334155', '#94a3b8'],
      fill: { type: 'gradient', gradient: { shadeIntensity: 1, opacityFrom: .25, opacityTo: .02, stops: [0, 90, 100] } },
      stroke: { curve: 'smooth', width: 2.5 },
      dataLabels: { enabled: false },
      grid: { strokeDashArray: 4, xaxis: { lines: { show: false } } },
      xaxis: {
        type: 'datetime',
        labels: {
          datetimeUTC: false, style: { fontSize: '12px' },
          formatter: (_v, ts) => new Date(ts).toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        },
        axisBorder: { show: false }, axisTicks: { show: false },
      },
      yaxis: { labels: { formatter: v => `${v} Mbps`, style: { fontSize: '12px' } }, min: 0 },
      legend: { position: 'top', fontSize: '13px' },
      tooltip: { x: { format: 'HH:mm:ss' }, y: { formatter: v => `${v} Mbps` } },
    },
  });

  useEffect(() => {
    const axisColor = isDark ? '#cbd5e1' : '#475569';
    const gridColor = isDark ? 'rgba(148,163,184,.15)' : 'rgba(148,163,184,.3)';
    const seriesColors = isDark ? ['#e2e8f0', '#64748b'] : ['#334155', '#94a3b8'];
    setChartData(prev => ({
      ...prev,
      options: {
        ...prev.options,
        colors: seriesColors,
        theme: { mode: isDark ? 'dark' : 'light' },
        chart: { ...prev.options.chart, foreColor: axisColor },
        grid: { ...prev.options.grid, borderColor: gridColor },
        xaxis: { ...prev.options.xaxis, labels: { ...prev.options.xaxis.labels, style: { ...prev.options.xaxis.labels.style, colors: axisColor } } },
        yaxis: { ...prev.options.yaxis, labels: { ...prev.options.yaxis.labels, style: { fontSize: '12px', colors: axisColor } } },
        legend: { ...prev.options.legend, labels: { colors: axisColor } },
        tooltip: { ...prev.options.tooltip, theme: isDark ? 'dark' : 'light' },
      },
    }));
  }, [isDark]);

  // ── Fetchers ────────────────────────────────────────────────────────────────
  const getJson = useCallback(async (url) => {
    try {
      const res = await fetch(url, { headers });
      return res.ok ? await res.json() : null;
    } catch (_) { return null; }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subdomain]);

  const getCurrentHotspotPlan = useCallback(async () => {
    const d = await getJson('/api/get_hotspot_and_dial_plan');
    if (!d) return;
    if (!d.length) { setExpiry2('No license'); setStatus2('Not Active'); }
    else {
      setExpiry2(d[0]?.expiry); setCondition2(d[0]?.condition);
      setStatus2(d[0]?.status); setCurrentHotspotPlan(d[0]?.name);
    }
  }, [getJson]);

  const getBandwidthStats = useCallback(async () => {
    const d = await getJson('/api/get_total_bandwidth_and_online_users');
    if (!d) return;
    setTotalBandwidth(d.total_bandwidth); setTotalDownload(d.total_download); setTotalUpload(d.total_upload);
  }, [getJson]);

  const fetchTotalSubscribers = useCallback(async () => {
    const d = await getJson('/api/total_subscribers');
    if (d) setTotalSubscribers(d.total_subscribers);
  }, [getJson]);

  // All revenue endpoints return a plain number except where noted
  const fetchRevenue = useCallback(async () => {
    const [hT, hY, hM, pT, pY, pM] = await Promise.all([
      getJson('/api/todays_revenue'),
      getJson('/api/yesterdays_revenue'),
      getJson('/api/this_month_revenue'),
      getJson('/api/pppoe_revenue_today'),
      getJson('/api/pppoe_revenue_yesterday'),
      getJson('/api/pppoe_revenue_this_month'),
    ]);
    setHotspotToday(toNumber(hT));
    setHotspotYesterday(toNumber(hY));
    setHotspotMonth(toNumber(hM));
    setPppoeToday(toNumber(pT, 'revenue_today'));
    setPppoeYesterday(toNumber(pY, 'revenue_yesterday'));
    setPppoeMonth(toNumber(pM));
    setRevenueLoading(false);
  }, [getJson]);

  const fetchOpenTickets = useCallback(async () => {
    const d = await getJson('/api/open_tickets');
    if (d === null) return;
    setOpenTickets(Array.isArray(d) ? d.length : toNumber(d, 'count', 'open_tickets', 'total'));
  }, [getJson]);

  const fetchInsights = useCallback(async () => {
    const [soon, expired, fresh, sys] = await Promise.all([
      getJson('/api/expiring_soon?days=10'),
      getJson('/api/recently_expired?days=20'),
      getJson('/api/new_customers_this_month'),
      getJson('/api/system_statistics'),
    ]);
    if (soon)    { setExpiringSoonCount(soon.count ?? 0); setExpiringSoonDays(soon.days ?? 10); }
    if (expired) { setRecentlyExpiredCount(expired.count ?? 0); setRecentlyExpiredDays(expired.days ?? 20); }
    if (fresh)   { setNewCustomersMonth(fresh.month ?? ''); setNewCustomersTotal(fresh.total_joined ?? 0); setNewCustomersRecent(fresh.recent ?? []); }
    if (sys)     { setSysCustomers(sys.total_customers ?? 0); setSysRouters(sys.total_routers ?? 0); setSysOnlineRouters(sys.online_routers ?? 0); }
    setInsightsLoading(false);
  }, [getJson]);

  const fetchAccessPointStats = useCallback(async () => {
    const d = await getJson('/api/access_points/analytics');
    if (d) setApStats({ total: d.total ?? 0, online: d.online ?? 0, offline: d.offline ?? 0, offline_list: d.offline_list ?? [] });
    setApLoading(false);
  }, [getJson]);

  const fetchPaidNotConnected = useCallback(async () => {
    const d = await getJson('/api/paid_not_connected/summary');
    if (d) setPncStats({ count: d.count ?? 0, amount: d.amount ?? 0, auto_eligible_count: d.auto_eligible_count ?? 0 });
  }, [getJson]);

  useEffect(() => {
    getCurrentHotspotPlan();
    getBandwidthStats();
    fetchTotalSubscribers();
    fetchRevenue();
    fetchOpenTickets();
    fetchInsights();
    fetchAccessPointStats();
    fetchPaidNotConnected();
  }, [getCurrentHotspotPlan, getBandwidthStats, fetchTotalSubscribers, fetchRevenue,
      fetchOpenTickets, fetchInsights, fetchAccessPointStats, fetchPaidNotConnected]);

  // ── WebSockets ──────────────────────────────────────────────────────────────
  useEffect(() => {
    const sub = cable.subscriptions.create(
      { channel: 'RadacctChannel', 'X-Subdomain': subdomain },
      { received(d) { setTotalOnlineUsers(d.online_radacct); } }
    );
    return () => sub.unsubscribe();
  }, [subdomain]);

  useEffect(() => {
    const sub = cable.subscriptions.create(
      { channel: 'HotspotChannel', 'X-Subdomain': subdomain },
      { received(d) { setHotspotActiveUsers(d.active_user_count); } }
    );
    return () => sub.unsubscribe();
  }, [subdomain]);

  useEffect(() => {
    const sub = cable.subscriptions.create(
      { channel: 'BandwidthChannel', 'X-Subdomain': subdomain },
      {
        received(d) {
          setTotalBandwidth(d.total_bandwidth);
          setTotalDownload(d.total_download);
          setTotalUpload(d.total_upload);
          const entry = { timestamp: Date.now(), download: d.total_download || 0, upload: d.total_upload || 0 };
          dataHistory.current = [...dataHistory.current, entry].slice(-maxDataPoints);
          setChartData(prev => ({
            ...prev,
            series: [
              { name: 'Download', data: dataHistory.current.map(e => [e.timestamp, e.download]) },
              { name: 'Upload',   data: dataHistory.current.map(e => [e.timestamp, e.upload]) },
            ],
          }));
        },
      }
    );
    return () => sub.unsubscribe();
  }, [subdomain]);

  const closeMenus = () => {
    [setShowMenu1, setShowMenu2, setShowMenu3, setShowMenu4, setShowMenu5, setShowMenu6,
     setShowMenu7, setShowMenu8, setShowMenu9, setShowMenu10, setShowMenu11, setShowMenu12]
      .forEach(fn => fn && fn(false));
  };

  const yesterdayTotal = pppoeYesterday + hotspotYesterday;

  return (
    <>
      <Styles />
      <div onClick={closeMenus}
        className="font-sans min-h-screen p-5 space-y-8 text-slate-900 dark:text-slate-200">
        <Suspense fallback={<div className="flex h-64 items-center justify-center"><UiLoader /></div>}>

          {/* ── Header ─────────────────────────────────────────────────────── */}
          <div className="flex items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Network overview</h1>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">
                {new Date().toLocaleDateString('en-KE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={toggleAmounts}
                className="flex items-center gap-2 text-sm font-medium px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800">
                {showAmounts ? <EyeOff size={16} /> : <Eye size={16} />}
                {showAmounts ? 'Hide amounts' : 'Show amounts'}
              </button>
              <NotificationCenter />
            </div>
          </div>

          {/* ── Today at a glance: revenue · traffic · customers ───────────── */}
          <Section title="Today at a glance" description="Money coming in, internet traffic, and customers online">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <RevenueTodayCard
                pppoe={pppoeToday} hotspot={hotspotToday}
                yesterdayTotal={yesterdayTotal}
                show={showAmounts} loading={revenueLoading}
              />
              <BandwidthCard total={totalBandwidth} download={totalDownload} upload={totalUpload} />
              <CustomersCard total={totalSubscribers} online={totalOnlineUsers} />
            </div>
          </Section>

          {/* ── Needs attention (only shows when there is something) ───────── */}
          {((!apLoading && apStats.offline > 0) || pncStats.count > 0) && (
            <Section title="Needs attention" description="Problems that may be costing you customers or money">
              <div className="space-y-3">
                {!apLoading && apStats.offline > 0 && (
                  <div className="rounded-2xl p-4 flex items-start gap-3 border border-red-300 dark:border-red-500/40 bg-red-50 dark:bg-red-500/10">
                    <div className="relative shrink-0 w-9 h-9 text-red-500">
                      <span className="live-dot absolute inset-0 rounded-full" />
                      <div className="relative z-10 w-9 h-9 rounded-full flex items-center justify-center bg-red-100 dark:bg-red-500/20">
                        <IoCloudOfflineOutline size={18} />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-base font-semibold text-red-700 dark:text-red-400">
                        {apStats.offline} access point{apStats.offline > 1 ? 's are' : ' is'} offline
                      </p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {apStats.offline_list.map(ap => (
                          <span key={ap.id}
                            className="text-sm px-2.5 py-1 rounded-full bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-300">
                            {ap.name}{ap.location ? ` · ${ap.location}` : ''}{ap.ip ? ` (${ap.ip})` : ''}
                          </span>
                        ))}
                      </div>
                      {apStats.offline_list[0]?.last_seen_at && (
                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                          Last seen: {new Date(apStats.offline_list[0].last_seen_at).toLocaleString()}
                        </p>
                      )}
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xl font-bold text-red-700 dark:text-red-400 tabular-nums">{apStats.online}/{apStats.total}</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">online</p>
                    </div>
                  </div>
                )}

                {pncStats.count > 0 && (
                  <Link to="/admin/incidents#paid-not-connected" className="block">
                    <motion.div whileHover={{ y: -2 }} className={`${cardBase} flex items-center gap-3`}>
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 bg-slate-100 dark:bg-slate-800">
                        <AlertTriangle size={18} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-base font-semibold text-slate-900 dark:text-white">
                          {pncStats.count} customer{pncStats.count === 1 ? '' : 's'} paid but never connected
                        </p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          {money(pncStats.amount)} paid · {pncStats.auto_eligible_count} can be compensated quickly
                        </p>
                      </div>
                      <span className="flex items-center gap-1 text-sm font-semibold">Review <ChevronRight size={14} /></span>
                    </motion.div>
                  </Link>
                )}
              </div>
            </Section>
          )}

          {/* ── Licence ────────────────────────────────────────────────────── */}
          <License
            expiry={expiry} condition={condition} status={status}
            expiry2={expiry2} condition2={condition2} status2={status2}
            calculateTimeRemaining={calculateTimeRemaining}
            smsBalance={smsBalance}
          />

          {/* ── Operations ─────────────────────────────────────────────────── */}
          <Section title="Operations" description="Support tickets and customer subscriptions that need follow-up">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <LinkCard to="/admin/support-tickets">
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                  <Ticket size={18} />
                  <p className="text-sm font-semibold">Open support tickets</p>
                </div>
                {revenueLoading && insightsLoading ? <Skeleton className="h-9 w-16 mt-2" /> : (
                  <p className="text-3xl font-bold text-slate-900 dark:text-white tabular-nums mt-1">{openTickets}</p>
                )}
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  {openTickets === 0 ? 'No open tickets. All caught up.' : 'Customers waiting for help'}
                </p>
                <p className="flex items-center gap-1 mt-3 text-sm font-semibold">View tickets <ChevronRight size={14} /></p>
              </LinkCard>

              <LinkCard to="/admin/pppoe-subscribers">
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                  <AlarmClock size={18} />
                  <p className="text-sm font-semibold">Expiring soon · next {expiringSoonDays} days</p>
                </div>
                {insightsLoading ? <Skeleton className="h-9 w-16 mt-2" /> : (
                  <p className="text-3xl font-bold text-slate-900 dark:text-white tabular-nums mt-1">{expiringSoonCount}</p>
                )}
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  {expiringSoonCount === 0
                    ? `Nobody expires in the next ${expiringSoonDays} days`
                    : `customer${expiringSoonCount === 1 ? '' : 's'} need to renew soon`}
                </p>
                <p className="flex items-center gap-1 mt-3 text-sm font-semibold">View customers <ChevronRight size={14} /></p>
              </LinkCard>

              <LinkCard to="/admin/pppoe-subscribers">
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                  <History size={18} />
                  <p className="text-sm font-semibold">Recently expired · last {recentlyExpiredDays} days</p>
                </div>
                {insightsLoading ? <Skeleton className="h-9 w-16 mt-2" /> : (
                  <p className="text-3xl font-bold text-slate-900 dark:text-white tabular-nums mt-1">{recentlyExpiredCount}</p>
                )}
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  {recentlyExpiredCount === 0
                    ? `No expiries in the last ${recentlyExpiredDays} days`
                    : `customer${recentlyExpiredCount === 1 ? '' : 's'} have not renewed`}
                </p>
                <p className="flex items-center gap-1 mt-3 text-sm font-semibold">View customers <ChevronRight size={14} /></p>
              </LinkCard>
            </div>
          </Section>

          {/* ── Network ────────────────────────────────────────────────────── */}
          <Section title="Network" description="Access point status and live internet traffic">
            {!apLoading && apStats.total > 0 && (
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: 'Total access points', value: apStats.total, cls: 'text-slate-900 dark:text-white' },
                  { label: 'Online', value: apStats.online, cls: 'text-emerald-600 dark:text-emerald-400' },
                  { label: 'Offline', value: apStats.offline, cls: apStats.offline > 0 ? 'text-red-600 dark:text-red-400' : 'text-slate-900 dark:text-white' },
                ].map(s => (
                  <div key={s.label} className={cardBase}>
                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                      <GiWifiRouter size={16} />
                      <p className="text-sm font-semibold">{s.label}</p>
                    </div>
                    <p className={`text-3xl font-bold tabular-nums mt-1 ${s.cls}`}>{s.value}</p>
                  </div>
                ))}
              </div>
            )}

            <div className={cardBase}>
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h3 className="text-base font-semibold text-slate-900 dark:text-white">Internet traffic over time</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Updates live. Shows the last {maxDataPoints} readings.</p>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 tabular-nums">
                  {dataHistory.current.length}/{maxDataPoints} readings
                </p>
              </div>
              <ReactApexChart options={chartData.options} series={chartData.series} type="area" height={280} />
            </div>
          </Section>

          {/* ── Hotspot ────────────────────────────────────────────────────── */}
          <Section title="Hotspot" description="Voucher customers: who is connected and how much they paid">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <LinkCard to="/admin/hotspot-dashboard">
                <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">Connected now</p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white tabular-nums mt-1">{hotspotActiveUsers || 0}</p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">hotspot users online</p>
              </LinkCard>
              {[
                { label: 'Today', value: hotspotToday },
                { label: 'Yesterday', value: hotspotYesterday },
                { label: 'This month', value: hotspotMonth },
              ].map(r => (
                <div key={r.label} className={cardBase}>
                  <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">Hotspot revenue · {r.label.toLowerCase()}</p>
                  {revenueLoading ? <Skeleton className="h-8 w-28 mt-2" /> : (
                    <p className="text-2xl font-bold text-slate-900 dark:text-white tabular-nums mt-1 break-words">{money(r.value)}</p>
                  )}
                </div>
              ))}
            </div>

            <RecentHotspotPayments cable={cable} subdomain={subdomain} />
          </Section>

          {/* ── Home internet revenue ──────────────────────────────────────── */}
          <Section title="Home internet revenue (PPPoE)" description="Payments from monthly home internet customers">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { label: 'Today', value: pppoeToday },
                { label: 'Yesterday', value: pppoeYesterday },
                { label: 'This month', value: pppoeMonth },
              ].map(r => (
                <div key={r.label} className={cardBase}>
                  <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">PPPoE revenue · {r.label.toLowerCase()}</p>
                  {revenueLoading ? <Skeleton className="h-8 w-28 mt-2" /> : (
                    <p className="text-2xl font-bold text-slate-900 dark:text-white tabular-nums mt-1 break-words">{money(r.value)}</p>
                  )}
                </div>
              ))}
            </div>
          </Section>

          {/* ── Activity ───────────────────────────────────────────────────── */}
          <Section title="Activity" description="New customers and system totals">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className={cardBase}>
                <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">
                  New customers{newCustomersMonth ? ` · ${newCustomersMonth}` : ' this month'}
                </p>
                {insightsLoading ? <Skeleton className="h-9 w-16 mt-2" /> : (
                  <>
                    <p className="text-3xl font-bold text-slate-900 dark:text-white tabular-nums mt-1">{newCustomersTotal}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">joined this month</p>
                    {newCustomersRecent.length > 0 && (
                      <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700 space-y-2">
                        {newCustomersRecent.map((r, i) => (
                          <div key={i} className="flex items-center justify-between gap-3 text-sm">
                            <span className="text-slate-700 dark:text-slate-300 truncate">{r.name}</span>
                            <span className="font-semibold tabular-nums text-slate-900 dark:text-white shrink-0">{money(r.amount)}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>

              <div className={cardBase}>
                <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">System totals</p>
                {insightsLoading ? (
                  <div className="grid grid-cols-3 gap-3 mt-3">{[1, 2, 3].map(i => <Skeleton key={i} className="h-14" />)}</div>
                ) : (
                  <div className="grid grid-cols-3 gap-4 mt-3">
                    <Metric label="Customers" value={sysCustomers} />
                    <Metric label="Routers" value={sysRouters} />
                    <Metric label="Routers online" value={sysOnlineRouters} />
                  </div>
                )}
              </div>
            </div>
          </Section>

          {/* ── Retention ──────────────────────────────────────────────────── */}
          <ChurnRateSection subdomain={subdomain} />
        </Suspense>
      </div>
    </>
  );
};

export default Analytics;