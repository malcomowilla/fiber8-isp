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
import { CreditCard, TrendingUp, Activity, Zap, ChevronRight, Wifi } from 'lucide-react';
import License from '../layout/License';

const cable = createConsumer(`wss://${window.location.hostname}/cable`);

// ── Inline styles ──────────────────────────────────────────────────────────────
const Styles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Space+Mono:wght@400;700&display=swap');
    .analytics-root * { box-sizing: border-box; }
    .analytics-root { font-family: 'Plus Jakarta Sans', sans-serif; }
    .mono { font-family: 'Space Mono', monospace; }

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
    @keyframes fadeSlideUp {
      from { opacity:0; transform:translateY(10px); }
      to   { opacity:1; transform:translateY(0); }
    }

    .skeleton {
      background: linear-gradient(90deg,#1e293b 25%,#334155 50%,#1e293b 75%);
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
      background: rgba(15,23,42,.75);
      backdrop-filter: blur(18px);
      -webkit-backdrop-filter: blur(18px);
      border: 1px solid rgba(148,163,184,.1);
      transition: transform .2s ease, box-shadow .2s ease, border-color .2s;
    }
    .stat-card:hover {
      transform: translateY(-3px);
      box-shadow: 0 16px 48px rgba(0,0,0,.35);
    }
    .stat-card:hover .card-arrow { transform: translateX(3px); }
    .card-arrow { transition: transform .2s; }
    .bandwidth-bar {
      background: rgba(15,23,42,.75);
      backdrop-filter: blur(18px);
      border: 1px solid rgba(148,163,184,.1);
    }
    .chart-panel {
      background: rgba(15,23,42,.8);
      backdrop-filter: blur(18px);
      border: 1px solid rgba(148,163,184,.1);
    }
    .drift1 { animation: drift 10s ease-in-out infinite; }
    .drift2 { animation: drift 14s ease-in-out infinite reverse; }
  `}</style>
);

// ── Helpers ────────────────────────────────────────────────────────────────────
const fmtMbps = (v) => `${(+v || 0).toFixed(1)} Mbps`;
const fmtKsh  = (v) => `KSh ${Number(v || 0).toLocaleString('en-KE')}`;

// ── Stat card ──────────────────────────────────────────────────────────────────
function StatCard({ title, value, icon, accent, pulse, to, tag, loading }) {
  const inner = (
    <motion.div
      whileHover={{ y:-3, scale:1.01 }}
      className="stat-card rounded-2xl p-5 relative 
      overflow-hidden cursor-pointer h-full"
    >
      {/* Glow blob */}
      <div className="absolute -top-8 -right-8 w-28 h-28 rounded-full pointer-events-none drift1"
        style={{ background:`radial-gradient(circle,${accent}20,transparent)` }} />

      <div className="flex items-start justify-between mb-4">
        <div className="relative">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center"
            style={{ background:`${accent}18`, border:`1px solid ${accent}28` }}>
            {pulse === 'online'  && <span className="pulse-online  absolute inset-0 rounded-full" />}
            {pulse === 'offline' && <span className="pulse-offline absolute inset-0 rounded-full" />}
            <span className="relative z-10" style={{ color: accent }}>{icon}</span>
          </div>
        </div>
        {tag && (
          <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
            style={{ background:`${accent}18`, color: accent }}>
            {tag}
          </span>
        )}
      </div>

      {loading ? (
        <div className="space-y-2">
          <div className="skeleton h-8 w-24" />
          <div className="skeleton h-3 w-16" />
        </div>
      ) : (
        <>
          <p className="text-3xl font-bold text-white mono">{value}</p>
          <p className="text-sm mt-1 text-slate-300">{title}</p>
        </>
      )}

      {to && (
        <div className="flex items-center gap-1 mt-4 text-xs font-semibold"
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
      className="bandwidth-bar rounded-2xl p-5 flex flex-col justify-between relative overflow-hidden">
      <div className="absolute -bottom-4 -right-4 w-20 h-20 rounded-full pointer-events-none"
        style={{ background:`radial-gradient(circle,${accent}18,transparent)` }} />
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background:`${accent}18` }}>
          <span style={{ color: accent }}>{icon}</span>
        </div>
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{label}</span>
      </div>
      <p className="text-2xl font-bold text-white mono">{fmtMbps(value)}</p>
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

  const [date, setDate]               = useState(new Date().toLocaleTimeString());
  const [routerData, setRouterData]   = useState(null);
  const [loading, setLoading]         = useState(false);
  const [totalBandwidth, setTotalBandwidth] = useState(0);
  const [totalOnlineUsers, setTotalOnlineUsers] = useState(0);
  const [totalDownload, setTotalDownload]   = useState(0);
  const [totalUpload, setTotalUpload]       = useState(0);
  const [totalInvoiceAmount, setTotalInvoiceAmount] = useState(0);

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
        type: 'area', height: 320,
        background: 'transparent',
        toolbar: { show: false },
        animations: { enabled: true, easing: 'linear', dynamicAnimation: { speed: 900 } },
        zoom: { enabled: false },
      },
      theme: { mode: 'dark' },
      colors: ['#38bdf8', '#a78bfa'],
      fill: {
        type: 'gradient',
        gradient: { shadeIntensity: 1, opacityFrom: .35, opacityTo: .02, stops: [0, 90, 100] },
      },
      stroke: { curve: 'smooth', width: 2.5 },
      dataLabels: { enabled: false },
      grid: { borderColor: '#1e293b', strokeDashArray: 4, xaxis: { lines: { show: false } } },
      xaxis: {
        type: 'datetime',
        labels: {
          datetimeUTC: false, style: { colors: '#475569', fontSize: '11px' },
          formatter: (_v, ts) => new Date(ts).toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        },
        axisBorder: { show: false }, axisTicks: { show: false },
      },
      yaxis: {
        labels: { style: { colors: '#475569' }, formatter: v => `${v} Mbps` },
        min: 0,
      },
      legend: { position: 'top', labels: { colors: '#94a3b8' } },
      tooltip: { theme: 'dark', x: { format: 'HH:mm:ss' }, y: { formatter: v => `${v} Mbps` } },
    },
  });

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

  useEffect(() => {
    getUnpaidInvoiceAmount();
    getCurrentHotspotPlan();
    getPPOEstats();
    fetchtotalSubscribers();
    fetchtotalSubscribersOffline();
  }, [getUnpaidInvoiceAmount, getCurrentHotspotPlan, getPPOEstats, fetchtotalSubscribers, fetchtotalSubscribersOffline]);

  // Clock
  useEffect(() => {
    const t = setInterval(() => setDate(new Date().toLocaleTimeString('en-US', { hour:'2-digit', minute:'2-digit', second:'2-digit', hour12:true })), 1000);
    return () => clearInterval(t);
  }, []);

  // Radacct WebSocket
  useEffect(() => {
    const sub = cable.subscriptions.create(
      { channel: 'RadacctChannel', 'X-Subdomain': subdomain },
      { received(d) { setTotalOnlineUsers(d.online_radacct); } }
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
  const container = { hidden:{}, visible:{ transition:{ staggerChildren:.07 } } };
  const item      = { hidden:{ opacity:0, y:16 }, visible:{ opacity:1, y:0, transition:{ duration:.4 } } };

  return (
    <>
      <Styles />
      <div onClick={closeMenus} className="analytics-root min-h-screen p-5 space-y-6"
        style={{ color:'#e2e8f0', position:'relative', overflow:'hidden' }}>

        {/* ── Ambient blobs ──────────────────────────────────────────────────── */}
        <div className="drift1 absolute top-0 left-0 w-96 h-96 rounded-full pointer-events-none"
          style={{ background:'radial-gradient(circle,rgba(56,189,248,.05) 0%,transparent 70%)', zIndex:0 }} />
        <div className="drift2 absolute bottom-0 right-0 w-96 h-96 rounded-full pointer-events-none"
          style={{ background:'radial-gradient(circle,rgba(167,139,250,.05) 0%,transparent 70%)', zIndex:0 }} />
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage:'radial-gradient(rgba(148,163,184,.04) 1px,transparent 1px)',
          backgroundSize:'28px 28px', zIndex:0 }} />

        <Suspense fallback={<div className="flex h-64 items-center justify-center"><UiLoader /></div>}>
          <div className="relative z-10 space-y-6">

            {/* ── Header ───────────────────────────────────────────────────────── */}
            <motion.div initial={{ opacity:0, y:-10 }} animate={{ opacity:1, y:0 }}
              className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="relative inline-flex w-2.5 h-2.5">
                    <span className="pulse-online absolute inset-0 rounded-full" />
                    <span className="relative block w-2.5 h-2.5 rounded-full bg-emerald-400" />
                  </span>
                  <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Live</span>
                </div>
                <h1 className="text-2xl font-bold text-white">Network Overview</h1>
                <p className="text-sm text-slate-500 mt-0.5">
                  {new Date().toLocaleDateString('en-KE',{ weekday:'long', year:'numeric', month:'long', day:'numeric' })}
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-white mono">{date}</p>
                <p className="text-xs text-slate-500 mt-0.5">{subdomain}.isp.co.ke</p>
              </div>
            </motion.div>

            {/* ── Top 4 KPI cards ──────────────────────────────────────────────── */}
            <motion.div variants={container} initial="hidden" animate="visible"
              className="grid grid-cols-2 lg:grid-cols-4 gap-4">

              <motion.div variants={item}>
                <StatCard
                  title="All Clients"
                  value={totalSubscribers || 0}
                  icon={<LuUsers size={20} />}
                  accent="#a78bfa"
                  to="/admin/pppoe-subscribers"
                  tag="PPPoE"
                />
              </motion.div>

              <motion.div variants={item}>
                <StatCard
                  title="Clients Online"
                  value={totalOnlineUsers || 0}
                  icon={<MdOutlineOnlinePrediction size={20} />}
                  accent="#34d399"
                  pulse="online"
                  to="/admin/subscribers-online"
                  tag="Live"
                />
              </motion.div>

              <motion.div variants={item}>
                <motion.div whileHover={{ y:-3, scale:1.01 }}
                  className="stat-card rounded-2xl p-5 relative overflow-hidden h-full">
                  <div className="absolute -top-8 -right-8 w-28 h-28 rounded-full pointer-events-none drift2"
                    style={{ background:'radial-gradient(circle,#fbbf2420,transparent)' }} />
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center"
                      style={{ background:'#fbbf2418', border:'1px solid #fbbf2428' }}>
                      <CreditCard size={20} style={{ color:'#fbbf24' }} />
                    </div>
                    <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
                      style={{ background:'#fbbf2418', color:'#fbbf24' }}>Due</span>
                  </div>
                  <Link to="/admin/unpaid-invoices">
                    <p className="text-3xl font-bold text-white mono">{fmtKsh(totalInvoiceAmount)}</p>
                    <p className="text-sm mt-1 text-slate-300">Outstanding invoices</p>
                    <div className="flex items-center gap-1 mt-4 text-xs font-semibold" style={{ color:'#fbbf24' }}>
                      View invoices <ChevronRight size={12} className="card-arrow" />
                    </div>
                  </Link>
                </motion.div>
              </motion.div>

              <motion.div variants={item}>
                <StatCard
                  title="Clients Offline"
                  value={subscribersOffline || 0}
                  icon={<IoCloudOfflineOutline size={20} />}
                  accent="#f87171"
                  pulse="offline"
                  to="/admin/subscribers-offline"
                  tag="Inactive"
                />
              </motion.div>
            </motion.div>

            {/* ── License ──────────────────────────────────────────────────────── */}
            <License
              expiry={expiry} condition={condition} status={status}
              expiry2={expiry2} condition2={condition2} status2={status2}
              calculateTimeRemaining={calculateTimeRemaining}
              smsBalance={smsBalance}
            />

            {/* ── Bandwidth overview + mini cards ──────────────────────────────── */}
            <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:.15 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-4">

              {/* Data summary card */}
              <motion.div whileHover={{ y:-2 }}
                className="stat-card rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between">
                <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full pointer-events-none drift1"
                  style={{ background:'radial-gradient(circle,rgba(56,189,248,.12),transparent)' }} />

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center"
                      style={{ background:'rgba(56,189,248,.12)', border:'1px solid rgba(56,189,248,.2)' }}>
                      <Wifi size={20} style={{ color:'#38bdf8' }} />
                    </div>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
                      style={{ background:'rgba(56,189,248,.1)', color:'#38bdf8' }}>24h</span>
                  </div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Total Bandwidth</p>
                  <p className="text-4xl font-bold text-white mono">{fmtMbps(totalBandwidth)}</p>
                </div>

                <div className="mt-5 space-y-2.5 pt-4"
                  style={{ borderTop:'1px solid rgba(148,163,184,.08)' }}>
                  {[
                    { label:'Download', value: totalDownload, color:'#38bdf8', Icon: FaArrowDown },
                    { label:'Upload',   value: totalUpload,   color:'#a78bfa', Icon: FaArrowUp },
                  ].map(r => (
                    <div key={r.label} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <r.Icon size={13} style={{ color: r.color }} />
                        <span className="text-xs text-slate-500">{r.label}</span>
                      </div>
                      <span className="text-sm font-semibold mono" style={{ color: r.color }}>
                        {fmtMbps(r.value)}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Three mini bandwidth cards */}
              <div className="lg:col-span-2 grid 
              grid-cols-1 sm:grid-cols-3 gap-4 ">
                <BwCard label={<p className='text-gray-300'>Current Download </p>} value={currentData.download} accent="#F4F4F5"
                  icon={<FaArrowDown size={16} />} />
                <BwCard label={<p className='text-gray-300'>Current Upload </p>}   value={currentData.upload}   accent="#a78bfa"
                  icon={<FaArrowUp size={16} />} />
                <BwCard label={<p className='text-gray-300'>Total Bandwidth </p>}  value={currentData.total || totalBandwidth} accent="#34d399"
                  icon={<Activity size={16} />} />

                {/* Utilisation bar */}
                <div className="sm:col-span-3 bandwidth-bar rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs text-slate-300 uppercase tracking-wider font-semibold">Bandwidth split</p>
                    <div className="flex items-center gap-4 text-xs text-slate-500">
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
                  <div className="h-3 rounded-full overflow-hidden flex gap-0.5"
                    style={{ background:'rgba(30,41,59,.6)' }}>
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
                  <div className="flex justify-between mt-2 text-xs text-slate-600 mono">
                    <span>{fmtMbps(totalDownload)}</span>
                    <span>{fmtMbps(totalUpload)}</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* ── Live chart ───────────────────────────────────────────────────── */}
            <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:.22 }}
              className="chart-panel rounded-3xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="relative inline-flex w-2 h-2">
                      <span className="pulse-online absolute inset-0 rounded-full" />
                      <span className="relative block w-2 h-2 rounded-full bg-emerald-400" />
                    </span>
                    <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Real-time</span>
                  </div>
                  <h2 className="text-base font-bold text-white">Bandwidth Usage</h2>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500 mono">
                  <Zap size={12} style={{ color:'#fbbf24' }} />
                  {dataHistory.current.length}/{maxDataPoints} points
                </div>
              </div>

              <ReactApexChart
                options={chartData.options}
                series={chartData.series}
                type="area"
                height={300}
              />
            </motion.div>

          </div>
        </Suspense>
      </div>
    </>
  );
};

export default Analytics;