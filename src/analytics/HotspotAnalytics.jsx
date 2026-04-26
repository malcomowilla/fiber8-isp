import React, { useState, useEffect, useCallback, useRef } from 'react';
import ReactApexChart from 'react-apexcharts';
import {
  TrendingUp, Calendar, RefreshCw, BarChart3,
  Download, Upload, Users, Wifi, Award, Zap,
  ArrowUpRight, ArrowDownRight, Star, Clock,
  ShoppingCart, Activity, CreditCard, Phone,
  ChevronRight, Flame, Target, Eye
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

// ── Styles ─────────────────────────────────────────────────────────────────────
const Styles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Space+Mono:wght@400;700&display=swap');
    .dash-root { font-family: 'Plus Jakarta Sans', sans-serif; }
    .mono { font-family: 'Space Mono', monospace; }
    @keyframes shimmer {
      0%   { background-position: -400px 0; }
      100% { background-position:  400px 0; }
    }
    @keyframes countUp { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
    @keyframes gradientShift {
      0%,100% { background-position: 0% 50%; }
      50%      { background-position: 100% 50%; }
    }
    @keyframes pulse-ring {
      0%   { transform:scale(1); opacity:.6; }
      100% { transform:scale(1.8); opacity:0; }
    }
    .skeleton {
      background: linear-gradient(90deg, #1e293b 25%, #334155 50%, #1e293b 75%);
      background-size: 400px 100%;
      animation: shimmer 1.4s infinite;
    }
    .stat-num { animation: countUp 0.5s ease forwards; }
    .gradient-animated {
      background: linear-gradient(135deg, #0ea5e9, #6366f1, #8b5cf6);
      background-size: 200% 200%;
      animation: gradientShift 4s ease infinite;
    }
    .live-dot::after {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: 50%;
      background: #34d399;
      animation: pulse-ring 1.5s ease-out infinite;
    }
    .card-hover { transition: transform .2s, box-shadow .2s; }
    .card-hover:hover { transform: translateY(-2px); box-shadow: 0 12px 40px rgba(0,0,0,.3); }
    .rank-1 { background: linear-gradient(135deg,#ffd700,#f59e0b); -webkit-background-clip:text; -webkit-text-fill-color:transparent; }
    .rank-2 { background: linear-gradient(135deg,#c0c0c0,#94a3b8); -webkit-background-clip:text; -webkit-text-fill-color:transparent; }
    .rank-3 { background: linear-gradient(135deg,#cd7f32,#b45309); -webkit-background-clip:text; -webkit-text-fill-color:transparent; }
    .scrollbar-thin::-webkit-scrollbar { width: 4px; }
    .scrollbar-thin::-webkit-scrollbar-thumb { background: #334155; border-radius: 4px; }
  `}</style>
);

// ── Helpers ────────────────────────────────────────────────────────────────────
const fmt = (n) =>
  new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES', maximumFractionDigits: 0 }).format(n || 0);

const fmtNum = (n) => new Intl.NumberFormat('en-KE').format(n || 0);

const pct = (now, prev) => {
  if (!prev || prev === 0) return null;
  return (((now - prev) / prev) * 100).toFixed(1);
};

// ── Mock data for demonstration — replace with API ─────────────────────────────
const MOCK_TOP_USERS = [
  { rank:1, phone:'0712 ***678', purchases:47, spent:2350, last_payment_at:'2m ago',  pkg:'Day Pass' },
  { rank:2, phone:'0722 ***901', purchases:38, spent:1900, last_payment_at:'14m ago', pkg:'Weekly' },
  { rank:3, phone:'0733 ***456', purchases:31, spent:620,  last_payment_at:'1h ago',  pkg:'1 Hour' },
  { rank:4, phone:'0700 ***123', purchases:24, spent:1200, last_payment_at:'3h ago',  pkg:'Monthly' },
  { rank:5, phone:'0711 ***789', purchases:19, spent:950,  last_payment_at:'5h ago',  pkg:'Day Pass' },
];

const MOCK_PKG_BREAKDOWN = [
  { name:'1 Hour',   count:214, revenue:4280,  color:'#38bdf8' },
  { name:'Day Pass', count:97,  revenue:4850,  color:'#a78bfa' },
  { name:'Weekly',   count:43,  revenue:8600,  color:'#34d399' },
  { name:'Monthly',  count:12,  revenue:7200,  color:'#fb923c' },
];

const MOCK_RECENT_TX = [
  { phone:'0712***78', pkg:'Day Pass',  amount:50,  time:'2m ago',  status:'success' },
  { phone:'0700***23', pkg:'1 Hour',    amount:20,  time:'8m ago',  status:'success' },
  { phone:'0733***56', pkg:'Weekly',    amount:200, time:'21m ago', status:'success' },
  { phone:'0722***01', pkg:'1 Hour',    amount:20,  time:'34m ago', status:'failed'  },
  { phone:'0711***89', pkg:'Monthly',   amount:600, time:'1h ago',  status:'success' },
  { phone:'0755***34', pkg:'Day Pass',  amount:50,  time:'2h ago',  status:'success' },
];

const MOCK_HOURLY = Array.from({ length: 24 }, (_, i) => ({
  hour: `${i}:00`,
  revenue: Math.round(Math.random() * 600 + (i > 6 && i < 22 ? 200 : 20)),
  sessions: Math.round(Math.random() * 20 + (i > 6 && i < 22 ? 8 : 1)),
}));

// ── Sub-components ─────────────────────────────────────────────────────────────

function SkeletonBlock({ h = 'h-8', w = 'w-full', rounded = 'rounded-lg' }) {
  return <div className={`skeleton ${h} ${w} ${rounded}`} />;
}

function TrendBadge({ value, suffix = '%' }) {
  if (value === null) return null;
  const up = parseFloat(value) >= 0;
  return (
    <span className={`inline-flex items-center gap-0.5 text-xs font-semibold px-2 py-0.5 rounded-full ${up ? 'bg-emerald-500/15 text-emerald-400' : 'bg-red-500/15 text-red-400'}`}>
      {up ? <ArrowUpRight size={11}/> : <ArrowDownRight size={11}/>}
      {Math.abs(value)}{suffix}
    </span>
  );
}

function StatCard({ title, value, sub, icon: Icon, accent, trend, loading, prefix = 'KES', isCount }) {
  const formattedValue = isCount ? fmtNum(value) : fmt(value);

  return (
    <motion.div
      initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }}
      className="card-hover rounded-2xl border p-4 sm:p-5
       relative overflow-hidden bg-gray-600"
      style={{ borderColor:'rgba(148,163,184,.1)', backdropFilter:'blur(16px)' }}
    >
      <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full opacity-20 pointer-events-none"
        style={{ background: `radial-gradient(circle, ${accent}, transparent)` }} />

      <div className="flex items-start justify-between mb-2 sm:mb-3">
        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center"
          style={{ background: `${accent}18`, border:`1px solid ${accent}28` }}>
          <Icon size={16} className="sm:w-[18px] sm:h-[18px]" style={{ color: accent }} />
        </div>
        {trend !== undefined && <TrendBadge value={trend} />}
      </div>

      {loading ? (
        <div className="space-y-2">
          <SkeletonBlock h="h-7" w="w-28" />
          <SkeletonBlock h="h-3" w="w-20" rounded="rounded" />
        </div>
      ) : (
        <>
          <p className="font-bold text-white mono stat-num 
                        text-lg xs:text-xl sm:text-2xl 
                        truncate max-w-full break-words"
             title={formattedValue}>   {/* tooltip shows full value on hover */}
            {formattedValue}
          </p>
          <p className="text-xs mt-1 text-gray-300" >{title}</p>
          {sub && <p className="text-[11px] mt-0.5 truncate" style={{ color:'#475569' }}>{sub}</p>}
        </>
      )}
    </motion.div>
  );
}

function LiveDot() {
  return (
    <span className="relative inline-flex w-2.5 h-2.5">
      <span className="live-dot relative block w-2.5 h-2.5 
      rounded-full bg-emerald-400" />
    </span>
  );
}

// ── Main Dashboard ─────────────────────────────────────────────────────────────
const HotspotAnalytics = () => {
  const subdomain = window.location.hostname.split('.')[0];

  // ── State ──────────────────────────────────────────────────────────────────
  const [summary, setSummary]         = useState({ today:0, thisWeek:0, thisMonth:0, allTime:0, yesterday:0, lastWeek:0 });
  const [yearRevenue, setYearRevenue] = useState(0);
  const [topUsers, setTopUsers]       = useState(MOCK_TOP_USERS);
  const [pkgBreakdown, setPkgBreakdown] = useState(MOCK_PKG_BREAKDOWN);
  const [recentTx, setRecentTx]       = useState(MOCK_RECENT_TX);
  const [hourlyData, setHourlyData]   = useState(MOCK_HOURLY);
  const [paymentData, setPaymentData] = useState([]);
  const [loading, setLoading]         = useState(true);
  const [refreshing, setRefreshing]   = useState(false);
  const [activeMetric, setActiveMetric] = useState('revenue'); // revenue | sessions
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [peakHour, setPeakHour]       = useState(null);
  const [totalSessions, setTotalSessions] = useState(0);
  const [successRate, setSuccessRate]  = useState(0);
  const [avgRevPerSession, setAvgRevPerSession] = useState(0);
  const [bestDay, setBestDay]       = useState(null);
  const [mostPopular, setMostPopular]       = useState(null);
  const [peakHr, setPeakHr]       = useState(null);
    const [thisMonthRevenue, setThisMonthRevenue] = useState(0);
    const [thisWeekRevenue, setThisWeekRevenue] = useState(0);




 const lastTwoMonthMeta = (() => {
    const now = new Date();
    return [-2, -1].map(offset => {
      const d = new Date(now.getFullYear(), now.getMonth() + offset, 1);
      return {
        key:   `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`,
        label: d.toLocaleDateString('en-KE', { month: 'long', year: 'numeric' }),
        short: d.toLocaleDateString('en-KE', { month: 'short', year: 'numeric' }),
      };
    });
  })();
  const [lastTwoMonths, setLastTwoMonths] = useState(
    lastTwoMonthMeta.map(m => ({ ...m, revenue: 0, sessions: 0, top_pkg: null, prev_revenue: null }))
  );







  // ── Chart configs ──────────────────────────────────────────────────────────
  const areaChart = {
    series: [{ name: 'Revenue (KES)', data: hourlyData.map(h => h.revenue) }],
    options: {
      chart: { type:'area', height:220, toolbar:{ show:false }, background:'transparent', sparkline:{ enabled:false } },
      theme: { mode:'dark' },
      colors: ['#38bdf8'],
      fill: { type:'gradient', gradient:{ shadeIntensity:1, opacityFrom:.4, opacityTo:.02, stops:[0,90,100] } },
      stroke: { curve:'smooth', width:2.5 },
      dataLabels: { enabled:false },
      grid: { borderColor:'#1e293b', strokeDashArray:4, xaxis:{ lines:{ show:false } } },
      xaxis: {
        categories: hourlyData.map(h => h.hour),
        labels: { style:{ colors:'#475569', fontSize:'10px' }, rotate:0 },
        axisBorder:{ show:false }, axisTicks:{ show:false },
        tickAmount: 8,
      },
      yaxis: { labels:{ style:{ colors:'#475569', fontSize:'11px' }, formatter: v => `${v/1000 >= 1 ? (v/1000).toFixed(1)+'k' : v}` } },
      tooltip: { theme:'dark', y:{ formatter: v => `KES ${fmtNum(v)}` } },
    }
  };

  const barChart = {
    series: [{ name:'Sessions', data: hourlyData.map(h => h.sessions) }],
    options: {
      chart: { type:'bar', height:220, toolbar:{ show:false }, background:'transparent' },
      theme: { mode:'dark' },
      colors: ['#a78bfa'],
      plotOptions: { bar:{ borderRadius:3, columnWidth:'60%' } },
      dataLabels: { enabled:false },
      grid: { borderColor:'#1e293b', strokeDashArray:4, xaxis:{ lines:{ show:false } } },
      xaxis: {
        categories: hourlyData.map(h => h.hour),
        labels: { style:{ colors:'#475569', fontSize:'10px' }, rotate:0 },
        axisBorder:{ show:false }, axisTicks:{ show:false },
        tickAmount: 8,
      },
      yaxis: { labels:{ style:{ colors:'#475569', fontSize:'11px' } } },
      tooltip: { theme:'dark' },
    }
  };

  const donutChart = {
    series: pkgBreakdown.map(p => p.revenue),
    options: {
      chart: { type:'donut', background:'transparent' },
      theme: { mode:'dark' },
      colors: pkgBreakdown.map(p => p.color),
      labels: pkgBreakdown.map(p => p.name),
      dataLabels: { enabled:false },
      legend: { position:'bottom', labels:{ colors:'#94a3b8' }, fontSize:'12px' },
      plotOptions: { pie:{ donut:{ size:'68%', labels:{ show:true, total:{ show:true, label:'Total', color:'#94a3b8', formatter: w => `KES ${fmtNum(w.globals.seriesTotals.reduce((a,b)=>a+b,0))}` } } } } },
      stroke: { width:0 },
      tooltip: { theme:'dark', y:{ formatter: v => `KES ${fmtNum(v)}` } },
    }
  };

  const weeklyChart = {
    series: [
      { name:'Revenue', data: summary.last7Days?.map(d => d.revenue) || [320,580,420,760,890,645,910] },
    ],
    options: {
      chart: { type:'bar', height:200, toolbar:{ show:false }, background:'transparent', stacked:false },
      theme: { mode:'dark' },
      colors: ['#34d399'],
      plotOptions: { bar:{ borderRadius:4, columnWidth:'55%' } },
      dataLabels: { enabled:false },
      grid: { borderColor:'#1e293b', strokeDashArray:3 },
      xaxis: {
        categories: summary.last7Days?.map(d => new Date(d.date).toLocaleDateString('en-KE',{weekday:'short'})) || ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
        labels: { style:{ colors:'#475569' } },
        axisBorder:{ show:false }, axisTicks:{ show:false },
      },
      yaxis: { labels:{ style:{ colors:'#475569' }, formatter: v => `${v/1000>=1?(v/1000).toFixed(1)+'k':v}` } },
      tooltip: { theme:'dark', y:{ formatter: v => `KES ${fmtNum(v)}` } },
    }
  };





  



  // ── Fetch functions ────────────────────────────────────────────────────────
  const fetchAll = useCallback(async (showToast = false) => {
    if (showToast) setRefreshing(true); else setLoading(true);
    try {
      // Revenue summary
      const r1 = await fetch('/api/revenue_summary', { headers:{ 'X-Subdomain':subdomain } });
      if (r1.ok) {
        const d = await r1.json();
        if (d.success) {
          setSummary({ ...d.summary, last7Days: d.last_7_days });
          const peak = d.hourly_revenue?.reduce((a,b) => b.revenue > a.revenue ? b : a, { revenue:0 });
          setPeakHour(peak);
        }
      }

      // best day ever
       const r7 = await fetch('/api/best_day_summary', { headers:{ 'X-Subdomain':subdomain } });
      if (r7.ok) { const d = await r7.json(); setBestDay(d); }


      // Most popular hotspot
      const r8 = await fetch('/api/most_popular_package', { headers:{ 'X-Subdomain':subdomain } });
      if (r8.ok) { const d = await r8.json(); setMostPopular(d); }

      // Peak hour
      const r9 = await fetch('/api/peak_hour', { headers:{ 'X-Subdomain':subdomain } });
      if (r9.ok) { const d = await r9.json(); setPeakHr(d); }

      // This month revenue
      const r10 = await fetch('/api/this_month_revenue', { headers:{ 'X-Subdomain':subdomain } });
      if (r10.ok) { const d = await r10.json(); setThisMonthRevenue(d); }

      // This week revenue
      const r11 = await fetch('/api/this_week_revenue', { headers:{ 'X-Subdomain':subdomain } });
      if (r11.ok) { const d = await r11.json(); setThisWeekRevenue(d); }


      // Year revenue
      const r2 = await fetch('/api/this_year_revenue', { headers:{ 'X-Subdomain':subdomain } });
      if (r2.ok) { const d = await r2.json(); setYearRevenue(d); }

      // Top users
      const r3 = await fetch('/api/top_hotspot_users', { headers:{ 'X-Subdomain':subdomain } });
      if (r3.ok) { const d = await r3.json(); if (d.length) setTopUsers(d); }

      // Package breakdown
      const r4 = await fetch('/api/package_revenue_breakdown', { headers:{ 'X-Subdomain':subdomain } });
      if (r4.ok) { const d = await r4.json(); if (d.length) setPkgBreakdown(d.map((p,i)=>({ ...p, color:['#38bdf8','#a78bfa','#34d399','#fb923c','#f472b6'][i%5] }))); }

      const r5 = await fetch('/api/hotspot_mpesa_revenues', { headers:{ 'X-Subdomain':subdomain } });
      if (r5.ok) { const d = await r5.json(); setPaymentData(d); setRecentTx(d.slice(0,6)); }

      // Stats
      const r6 = await fetch('/api/hotspot_session_stats', { headers:{ 'X-Subdomain':subdomain } });
      if (r6.ok) {
        const d = await r6.json();
        setTotalSessions(d.total_sessions || 0);
        setSuccessRate(d.success_rate || 0);
        setAvgRevPerSession(d.avg_revenue_per_session || 0);
      }


       // Last two months — always computed fresh so they update as months roll over
      const now = new Date();
      const twoMonths = [-2, -1].map(offset => {
        const d = new Date(now.getFullYear(), now.getMonth() + offset, 1);
        return {
          key:   `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`,
          label: d.toLocaleDateString('en-KE', { month: 'long', year: 'numeric' }),
          short: d.toLocaleDateString('en-KE', { month: 'short', year: 'numeric' }),
        };
      });

      // Fetch both months in parallel
      const monthResults = await Promise.allSettled(
        twoMonths.map(m =>
          fetch(`/api/monthly_revenue_detail?month=${m.key}`, { headers:{ 'X-Subdomain':subdomain } })
            .then(r => r.ok ? r.json() : null)
            .catch(() => null)
        )
      );

      setLastTwoMonths(
        twoMonths.map((m, i) => {
          const result = monthResults[i].status === 'fulfilled' ? monthResults[i].value : null;
          return {
            ...m,
            revenue:      result?.revenue      ?? 0,
            sessions:     result?.sessions     ?? 0,
            top_pkg:      result?.top_pkg      ?? null,
            prev_revenue: result?.prev_revenue ?? null,
          };
        })
      );



      if (showToast) toast.success('Dashboard refreshed', { position:'top-right' });
    } catch (e) {
      if (showToast) toast.error('Failed to refresh data', { position:'top-right' });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [subdomain]);

  useEffect(() => { fetchAll(); const t = setInterval(()=>fetchAll(), 300000); return ()=>clearInterval(t); }, [fetchAll]);

  const todayTrend  = pct(summary.today, summary.yesterday);
  const weekTrend   = pct(summary.thisWeek, summary.lastWeek);

  const rankClass = (r) => r===1?'rank-1':r===2?'rank-2':r===3?'rank-3':'text-slate-400';
  const rankBg    = (r) => r===1?'rgba(251,191,36,.12)':r===2?'rgba(148,163,184,.1)':r===3?'rgba(180,83,9,.1)':'rgba(30,41,59,.5)';

// /api/peak_hour

  return (
    <>
      <Styles />
      <Toaster />

      <div className="dash-root min-h-screen p-6 space-y-6"
        style={{  color:'#e2e8f0' }}>

        {/* ── Header ──────────────────────────────────────────────────────── */}
        <motion.div initial={{ opacity:0, y:-12 }} animate={{ opacity:1, y:0 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
           
            <h1 className="text-2xl font-bold dark:text-white text-black">Hotspot Revenue Analytics</h1>
            <p className="text-sm mt-0.5" style={{ color:'#64748b' }}>
              M-Pesa · {new Date().toLocaleDateString('en-KE',{ weekday:'long', year:'numeric', month:'long', day:'numeric' })}
            </p>
          </div>
          <div className="flex items-center gap-3 flex-col sm:flex-row">
            <input
              type="date" value={selectedDate}
              onChange={e => setSelectedDate(e.target.value)}
              className="px-3 py-2 rounded-xl text-sm border mono text-white"
              style={{ background:'rgba(15,23,42,.8)', borderColor:'rgba(148,163,184,.12)',  }}
            />
            <button onClick={() => fetchAll(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold 
              text-white transition-all "
              style={{ background:'green', border:'1px solid rgba(56,189,248,.25)' }}>
              <RefreshCw size={15} className={refreshing ? 'animate-spin' : ''} />
              Refresh
            </button>
          </div>
        </motion.div>

        {/* ── KPI Grid ────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
          <StatCard title="Today's Revenue"  value={summary.today}     icon={TrendingUp}  accent="#34d399" trend={todayTrend} loading={loading} />
          <StatCard title="This Week"        value={thisWeekRevenue}  icon={Calendar}    accent="#38bdf8" trend={weekTrend}  loading={loading} />
          <StatCard title="This Month"       value={thisMonthRevenue} icon={BarChart3}   accent="#a78bfa" loading={loading} />
          <StatCard title="This Year"        value={yearRevenue}       icon={Award}       accent="#fb923c" loading={loading} />
        </div>

        {/* ── Secondary metrics ───────────────────────────────────────────── */}
        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
          <StatCard title="Total Sessions"        value={totalSessions || 1247}   icon={Users}       accent="#f472b6" isCount loading={loading} />
          <StatCard title="Avg. per Session"      value={avgRevPerSession || 47}  icon={CreditCard}  accent="#34d399" loading={loading} />
          <StatCard title="Success Rate"          value={successRate || 94}       icon={Target}      accent="#38bdf8"
            sub="of all M-Pesa pushes" isCount loading={loading} />
          <StatCard title="All-Time Revenue"      value={summary.allTime}         icon={Flame}       accent="#fb923c" loading={loading} />
        </div>


 {/* ── Last two months ──────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {lastTwoMonths.map((month, i) => {
            const trend = pct(month.revenue, month.prev_revenue);
            const accentColors = ['#818cf8', '#fb7185']; // indigo for older, rose for more recent
            const accent = accentColors[i];
            return (
              <motion.div key={month.key}
                initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay: 0.05 + i * 0.08 }}
                className="card-hover rounded-2xl border p-5 
                relative overflow-hidden bg-gray-600"
                style={{  borderColor:`${accent}25`, backdropFilter:'blur(16px)' }}
              >
                {/* Corner glow */}
                <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full pointer-events-none"
                  style={{ background:`radial-gradient(circle,${accent}18,transparent)` }} />

                {/* Month label pill */}
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full mb-4 text-xs font-semibold"
                  style={{ background:`${accent}15`, border:`1px solid ${accent}30`, color: accent }}>
                  <Calendar size={11} />
                  {month.label}
                </div>

                <div className="flex items-end justify-between gap-4">
                  {/* Revenue block */}
                  <div>
                    {loading ? (
                      <div className="space-y-2">
                        <div className="skeleton h-8 w-32 rounded-lg" />
                        <div className="skeleton h-3 w-20 rounded" />
                      </div>
                    ) : (
                      <>
                        <p className="text-2xl font-bold text-white mono stat-num">
                          {fmt(month.revenue)}
                        </p>
                        <p className="text-xs mt-1 text-gray-300" >
                          Total revenue · {fmtNum(month.sessions)} sessions
                        </p>
                        {month.top_pkg && (
                          <div className="flex items-center gap-1.5 mt-2">
                            <Zap size={10} style={{ color: accent }} />
                            <span className="text-xs" style={{ color:'#64748b' }}>
                              Top plan: <span className="font-semibold" style={{ color: accent }}>{month.top_pkg}</span>
                            </span>
                          </div>
                        )}
                      </>
                    )}
                  </div>

                  {/* Right side: trend + mini bar */}
                  <div className="shrink-0 flex flex-col items-end gap-3">
                    {trend !== null && <TrendBadge value={trend} />}

                    {/* Tiny sparkline bars — proportion of this month vs prior */}
                    {!loading && (
                      <div className="flex items-end gap-0.5 h-10">
                        {/* Prior month bar (prev_revenue) */}
                        {month.prev_revenue > 0 && (() => {
                          const maxVal = Math.max(month.revenue, month.prev_revenue);
                          const prevH  = Math.round((month.prev_revenue / maxVal) * 100);
                          const currH  = Math.round((month.revenue      / maxVal) * 100);
                          return (
                            <>
                              <div className="flex flex-col justify-end h-10 gap-0.5">
                                <div className="w-4 rounded-sm"
                                  style={{ height:`${prevH}%`, background:'rgba(148,163,184,.2)', minHeight:4 }}
                                  title={`Prev: ${fmt(month.prev_revenue)}`} />
                              </div>
                              <div className="flex flex-col justify-end h-10 gap-0.5">
                                <div className="w-4 rounded-sm"
                                  style={{ height:`${currH}%`, background: accent, minHeight:4 }}
                                  title={`${month.short}: ${fmt(month.revenue)}`} />
                              </div>
                              <div className="text-xs ml-1 self-end" style={{ color:'#475569' }}>
                                <div style={{ color:'rgba(148,163,184,.4)', fontSize:9 }}>prev</div>
                                <div style={{ color: accent, fontSize:9, fontWeight:700 }}>{month.short.split(' ')[0]}</div>
                              </div>
                            </>
                          );
                        })()}
                      </div>
                    )}
                  </div>
                </div>

                {/* Bottom divider + sessions breakdown */}
                {!loading && (
                  <div className="mt-4 pt-3 border-t grid grid-cols-3 gap-2"
                    style={{ borderColor:`${accent}15` }}>
                    {[
                      { label:'Revenue',   val: fmt(month.revenue) },
                      { label:'Sessions',  val: fmtNum(month.sessions) },
                      { label:'Avg/Session', val: month.sessions > 0 ? fmt(Math.round(month.revenue / month.sessions)) : '—' },
                    ].map(stat => (
                      <div key={stat.label} className="text-center">
                        <p className="text-xs font-bold mono text-slate-300">{stat.val}</p>
                        <p className="text-xs mt-0.5" style={{ color:'#475569', fontSize:10 }}>{stat.label}</p>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>





        {/* ── Main charts row ─────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

          {/* Hourly activity (2 cols) */}
          <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:.1 }}
            className="lg:col-span-2 rounded-2xl border p-5"
            style={{ background:'rgba(15,23,42,.7)', borderColor:'rgba(148,163,184,.1)', backdropFilter:'blur(16px)' }}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-white">Today's Hourly Activity</h2>
                <p className="text-xs mt-0.5 text-gray-300" >
                  {peakHour ? `Peak hour: ${peakHr?.time} · KES ${fmtNum(peakHr?.total_revenue)}` : 'Revenue & sessions by hour'}
                </p>
              </div>
              <div className="flex gap-1 p-1 rounded-xl flex-col sm:flex-row" 
              style={{ background:'rgba(30,41,59,.6)' }}>
                {['total_revenue','sessions'].map(m => (
                  <button key={m} onClick={() => setActiveMetric(m)}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all"
                    style={{ background: activeMetric===m ? 'rgba(56,189,248,.15)' : 'transparent',
                      color: activeMetric===m ? '#38bdf8' : '#64748b',
                      border: activeMetric===m ? '1px solid rgba(56,189,248,.25)' : '1px solid transparent' }}>
                    {m}
                  </button>
                ))}
              </div>
            </div>
            {loading
              ? <SkeletonBlock h="h-56" rounded="rounded-xl" />
              : <AnimatePresence mode="wait">
                  {activeMetric === 'revenue'
                    ? <motion.div key="rev" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}>
                        <ReactApexChart options={areaChart.options} series={areaChart.series} type="area" height={220} />
                      </motion.div>
                    : <motion.div key="ses" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}>
                        <ReactApexChart options={barChart.options} series={barChart.series} type="bar" height={220} />
                      </motion.div>
                  }
                </AnimatePresence>
            }
          </motion.div>

          {/* Package donut */}
          <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:.15 }}
            className="rounded-2xl border p-5"
            style={{ background:'rgba(15,23,42,.7)', borderColor:'rgba(148,163,184,.1)', backdropFilter:'blur(16px)' }}>
            <h2 className="text-base font-bold text-white mb-1">Revenue by Package</h2>
            <p className="text-xs mb-3 text-gray-300" >Share of total revenue per plan</p>
            {loading
              ? <SkeletonBlock h="h-48" rounded="rounded-xl" />
              : <ReactApexChart options={donutChart.options} series={donutChart.series} type="donut" height={200} />
            }
            {/* Package legend with bars */}
            <div className="space-y-2 mt-3">
              {pkgBreakdown.map(p => {
                const total = pkgBreakdown.reduce((a,b)=>a+b.revenue,0);
                const pctVal = total ? Math.round((p.revenue/total)*100) : 0;
                return (
                  <div key={p.name}>
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-xs font-medium" style={{ color:'#94a3b8' }}>{p.name}</span>
                      <span className="text-xs mono" style={{ color: p.color }}>{pctVal}% · {fmtNum(p.count)} sales</span>
                    </div>
                    <div className="h-1.5 rounded-full" style={{ background:'rgba(30,41,59,.8)' }}>
                      <div className="h-1.5 rounded-full transition-all duration-700"
                        style={{ width:`${pctVal}%`, background: p.color }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* ── Weekly bar + Top users + Recent tx ─────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

          {/* Weekly bar */}
          <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:.2 }}
            className="rounded-2xl border p-5"
            style={{ background:'rgba(15,23,42,.7)', borderColor:'rgba(148,163,184,.1)', backdropFilter:'blur(16px)' }}>
            <h2 className="text-base font-bold text-white mb-1">Last 7 Days</h2>
            <p className="text-xs mb-3 text-gray-300" >Daily revenue trend</p>
            {loading
              ? <SkeletonBlock h="h-44" rounded="rounded-xl" />
              : <ReactApexChart options={weeklyChart.options} series={weeklyChart.series} type="bar" height={200} />
            }
          </motion.div>


{/* 
 phone: c.phone,
        name: c.name,
        total_purchases: c.total_purchases.to_i,
        total_spent: c.total_spent.to_f,
        last_payment_at: c.last_payment_at.strftime("%B %d, %Y at %I:%M %p"),
        packages: c.packages */}



         {/* Top users leaderboard */}
<motion.div
  initial={{ opacity:0, y:16 }}
  animate={{ opacity:1, y:0 }}
  transition={{ delay: .22 }}
  className="rounded-2xl border p-4 sm:p-5 max-h-72 overflow-y-auto scrollbar-thin"
  style={{ background:'rgba(15,23,42,.7)', borderColor:'rgba(148,163,184,.1)', backdropFilter:'blur(16px)' }}
>
  <div className="flex items-center gap-2 mb-4">
    <Award size={16} style={{ color:'#fbbf24' }} />
    <h2 className="text-base font-bold text-white">Top Customers</h2>
    <span className="ml-auto text-xs px-2 py-0.5 rounded-full"
      style={{ background:'rgba(251,191,36,.12)', color:'#fbbf24' }}>All time</span>
  </div>

  <div className="space-y-2">
    {topUsers.map((u, i) => (
      <motion.div
        key={u.phone}
        initial={{ opacity:0, x:-8 }}
        animate={{ opacity:1, x:0 }}
        transition={{ delay: .05*i }}
        className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-xl"
        style={{ background: rankBg(u.rank), border:'1px solid rgba(148,163,184,.06)' }}
      >
        {/* Rank - fixed width */}
        <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg flex items-center justify-center shrink-0"
          style={{ background:'rgba(15,23,42,.5)' }}>
          <span className={`text-xs sm:text-sm font-black mono ${rankClass(u.rank)}`}>#{u.rank}</span>
        </div>

        {/* Info - takes remaining space, truncates */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <p className="text-xs sm:text-sm font-semibold text-slate-200 mono truncate">
              {u.phone}
            </p>
            {u.rank <= 3 && <Star size={10} fill="#fbbf24" style={{ color:'#fbbf24', flexShrink:0 }} />}
          </div>
          {/* Secondary info: hidden on very small screens, visible on sm+ */}
          <p className="hidden sm:block text-[11px] sm:text-xs text-gray-300 truncate">
            {u.purchases} purchases · {u.last_payment_at}
            {u.name && ` · ${u.name}`}
          </p>
          {/* Minimal info for mobile */}
          <p className="sm:hidden text-[10px] text-gray-400">
            {u.purchases} buys
          </p>
        </div>

        {/* Spent - shrink only if absolutely needed */}
        <div className="text-right shrink-0 ml-1">
          <p className="text-sm sm:text-base font-bold mono whitespace-nowrap" style={{ color:'#34d399' }}>
            KES {fmtNum(u.spent)}
          </p>
          <p className="text-[10px] sm:text-xs whitespace-nowrap">{u.pkg}</p>
        </div>
      </motion.div>
    ))}
  </div>
</motion.div>

          {/* Recent transactions */}
          <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:.25 }}
            className="rounded-2xl border p-5"
            style={{ background:'rgba(15,23,42,.7)', borderColor:'rgba(148,163,184,.1)', backdropFilter:'blur(16px)' }}>
            <div className="flex items-center gap-2 mb-4">
              <Activity size={16} style={{ color:'#38bdf8' }} />
              <h2 className="text-base font-bold text-white">Recent Transactions</h2>
              <LiveDot />
            </div>

            <div className="space-y-2 max-h-72 overflow-y-auto scrollbar-thin pr-1">
              {recentTx.map((tx, i) => (
                <motion.div key={i}
                  initial={{ opacity:0, y:4 }} animate={{ opacity:1, y:0 }} transition={{ delay:.04*i }}
                  className="flex items-center gap-3 p-3 rounded-xl"
                  style={{ background:'rgba(30,41,59,.4)', border:'1px solid rgba(148,163,184,.06)' }}>

                  {/* Status dot */}
                  <div className="w-2 h-2 rounded-full shrink-0"
                    style={{ background: tx.status==='success' ? '#34d399' : '#f87171' }} />

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-300 mono truncate">{tx.phone_number || tx.PhoneNumber}</p>
                    <p className="text-xs" style={{ color:'#64748b' }}>{tx.name || tx.PackageName} · {tx.time_paid || tx.created_at}</p>
                  </div>

                  {/* Amount */}
                  <p className="text-sm font-bold mono shrink-0"
                    style={{ color: tx.status==='success' ? '#34d399' : '#f87171' }}>
                    {tx.status==='success' ? '+' : ''}KES {fmtNum(tx.amount || tx.Amount)}
                  </p>
                </motion.div>
              ))}
            </div>

            <div className="mt-3 pt-3 border-t flex items-center justify-between"
              style={{ borderColor:'rgba(148,163,184,.07)' }}>
              <p className="text-xs" style={{ color:'#475569' }}>{paymentData.length} total transactions</p>
              <button className="text-xs flex items-center gap-1 font-semibold" style={{ color:'#38bdf8' }}>
                View all <ChevronRight size={12}/>
              </button>
            </div>
          </motion.div>
        </div>

        {/* ── Package performance table ────────────────────────────────────── */}
        <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} 
        transition={{ delay:.3 }}
          className="rounded-2xl border p-5 bg-gray-600"
          style={{  borderColor:'rgba(148,163,184,.1)', backdropFilter:'blur(16px)' }}>
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <ShoppingCart size={16} style={{ color:'#a78bfa' }} />
              <h2 className="text-base font-bold text-white">Package Performance</h2>
            </div>
            <span className="text-xs" style={{ color:'#475569' }}>All-time breakdown</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className=''>
                <tr className='' style={{ borderBottom:'1px solid rgba(148,163,184,.08)' }}>
                  {['Package','Sales','Revenue','Avg. Sale','% of Total','Trend'].map(h => (
                    <th key={h} className="pb-3 text-left font-semibold
                     text-xs uppercase tracking-wider pr-4 text-gray-300"
                      >{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y" style={{ '--tw-divide-opacity':1, borderColor:'rgba(148,163,184,.05)' }}>
                {pkgBreakdown.map((p, i) => {
                  const total = pkgBreakdown.reduce((a,b)=>a+b.revenue,0);
                  const pctVal = total ? ((p.revenue/total)*100).toFixed(1) : 0;
                  const avgSale = p.count ? Math.round(p.revenue/p.count) : 0;
                  return (
                    <tr key={p.name} className="transition-colors" style={{ borderColor:'rgba(148,163,184,.05)' }}>
                      <td className="py-3 pr-4">
                        <div className="flex items-center gap-2">
                          <div className="w-2.5 h-2.5 rounded-full" style={{ background: p.color }} />
                          <span className="font-semibold text-slate-200">{p.name}</span>
                        </div>
                      </td>
                      <td className="py-3 pr-4 mono" style={{ color:'#94a3b8' }}>{fmtNum(p.count)}</td>
                      <td className="py-3 pr-4 font-bold mono" style={{ color: p.color }}>KES {fmtNum(p.revenue)}</td>
                      <td className="py-3 pr-4 mono" style={{ color:'#94a3b8' }}>KES {fmtNum(avgSale)}</td>
                      <td className="py-3 pr-4">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-1.5 rounded-full" style={{ background:'rgba(30,41,59,.8)', minWidth:60 }}>
                            <div className="h-1.5 rounded-full" style={{ width:`${pctVal}%`, background: p.color }} />
                          </div>
                          <span className="text-xs mono" style={{ color:'#64748b' }}>{pctVal}%</span>
                        </div>
                      </td>
                      <td className="py-3">
                        <TrendBadge value={[12.4,-3.2,8.1,22.6][i]} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr style={{ borderTop:'1px solid rgba(148,163,184,.1)' }}>
                  <td className="pt-3 font-bold text-slate-200">Total</td>
                  <td className="pt-3 mono font-bold text-slate-200">{fmtNum(pkgBreakdown.reduce((a,b)=>a+b.count,0))}</td>
                  <td className="pt-3 mono font-bold" style={{ color:'#34d399' }}>
                    KES {fmtNum(pkgBreakdown.reduce((a,b)=>a+b.revenue,0))}
                  </td>
                  <td colSpan={3} />
                </tr>
              </tfoot>
            </table>
          </div>
        </motion.div>


        {/* ── Insight cards row ────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              icon: Flame, accent:'#fb923c', label:'Best Day Ever',
              value:`KES ${bestDay?.total_revenue}`, sub:`${bestDay?.day_name} · ${bestDay?.vouchers_sold} sessions`,
            },



          
             {
              icon: Clock, accent:'#38bdf8', label:`Peak Hour`,
              value: peakHr?.time,
              sub:`KES ${peakHr?.total_revenue} · Most active sessions & Revenue`,
            },



            {
              icon: Phone, accent:'#a78bfa', label:'Most Popular Package',
              value: mostPopular?.package || 'Day Pass',
              sub:`${mostPopular?.vouchers_sold || 97} sold · KES ${mostPopular?.total_revenue || 4850}`,
            },
            {
              icon: Eye, accent:'#34d399', label:'Returning Customers',
              value:'67%', sub:'of users have connected before',
            },
          ].map((card, i) => {
            const Icon = card.icon;
            return (
              <motion.div key={card.label}
                initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ delay:.05*i }}
                className="card-hover rounded-2xl border p-5 relative overflow-hidden"
                style={{ background:'rgba(15,23,42,.7)', borderColor:'rgba(148,163,184,.1)' }}>
                <div className="absolute -bottom-6 -right-6 w-20 h-20 rounded-full pointer-events-none opacity-15"
                  style={{ background:`radial-gradient(circle,${card.accent},transparent)` }} />
                <Icon size={20} className="mb-3" style={{ color: card.accent }} />
                <p className="text-xs font-semibold uppercase tracking-wider mb-1 text-gray-300" >{card.label}</p>
                <p className="text-xl font-bold text-white mono">{card.value}</p>
                <p className="text-xs mt-1 text-gray-400" >{card.sub}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Footer */}
        <p className="text-center text-xs pb-4" style={{ color:'#334155' }}>
          Auto-refreshes every 5 minutes · Last updated {new Date().toLocaleTimeString()}
        </p>
      </div>
    </>
  );
};

export default HotspotAnalytics;