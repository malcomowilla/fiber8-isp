import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LuTicketSlash } from "react-icons/lu";
import { CgDanger } from "react-icons/cg";
import { IoCheckmarkDoneOutline } from "react-icons/io5";
import { AiOutlineFire } from "react-icons/ai";
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { createConsumer } from "@rails/actioncable";
import { ChevronRight, RefreshCw, Activity } from 'lucide-react';

const cable = createConsumer(`wss://${window.location.hostname}/cable`);

// ── Styles ─────────────────────────────────────────────────────────────────────
const Styles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Space+Mono:wght@400;700&display=swap');
    .tickets-root { font-family: 'Plus Jakarta Sans', sans-serif; }
    .mono { font-family: 'Space Mono', monospace; }

    @keyframes shimmer {
      0%   { background-position: -600px 0; }
      100% { background-position:  600px 0; }
    }
    @keyframes pulse-ring {
      0%   { transform: scale(1); opacity: .6; }
      100% { transform: scale(2.2); opacity: 0; }
    }
    @keyframes drift {
      0%,100% { transform: translate(0,0) scale(1); }
      50%      { transform: translate(10px,-14px) scale(1.03); }
    }
    @keyframes countUp {
      from { opacity:0; transform: translateY(6px); }
      to   { opacity:1; transform: translateY(0); }
    }
    @keyframes gradientShift {
      0%,100% { background-position: 0% 50%; }
      50%      { background-position: 100% 50%; }
    }

    .skeleton {
      background: linear-gradient(90deg,#1e293b 25%,#334155 50%,#1e293b 75%);
      background-size: 600px 100%;
      animation: shimmer 1.5s infinite;
      border-radius: 8px;
    }
    .ticket-card {
      background: rgba(15,23,42,.78);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid rgba(148,163,184,.1);
      transition: transform .22s ease, box-shadow .22s ease, border-color .22s;
      cursor: pointer;
    }
    .ticket-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 20px 56px rgba(0,0,0,.4);
    }
    .ticket-card:hover .arrow-icon { transform: translateX(4px); }
    .arrow-icon { transition: transform .2s; }
    .stat-num { animation: countUp .45s ease forwards; }
    .drift1 { animation: drift 11s ease-in-out infinite; }
    .drift2 { animation: drift 15s ease-in-out infinite reverse; }
    .live-ring::after {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: 50%;
      background: #34d399;
      animation: pulse-ring 1.8s ease-out infinite;
    }
  `}</style>
);

// ── Animated counter ───────────────────────────────────────────────────────────
function AnimatedNumber({ value, loading }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (loading || value === 0) { setDisplay(0); return; }
    const start = display;
    const end   = value;
    const diff  = end - start;
    if (diff === 0) return;
    const steps    = 30;
    const stepTime = 20;
    let step = 0;
    const timer = setInterval(() => {
      step++;
      setDisplay(Math.round(start + (diff * (step / steps))));
      if (step >= steps) { setDisplay(end); clearInterval(timer); }
    }, stepTime);
    return () => clearInterval(timer);
  }, [value, loading]);

  if (loading) return <div className="skeleton h-10 w-16 mt-1" />;
  return (
    <span className="text-4xl font-bold text-white mono stat-num">
      {display}
    </span>
  );
}

// ── Single stat card ───────────────────────────────────────────────────────────
function StatCard({ title, value, icon: Icon, accent, description, to, loading, pulse }) {
  const navigate = useNavigate();
  const handleClick = () => { if (to) navigate(to); };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileTap={{ scale: .98 }}
      onClick={handleClick}
      className="ticket-card rounded-2xl p-6 relative overflow-hidden"
    >
      {/* Glow blob */}
      <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full pointer-events-none drift1"
        style={{ background: `radial-gradient(circle,${accent}22,transparent)` }} />

      {/* Top row */}
      <div className="flex items-start justify-between mb-5">
        <div className="relative">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
            style={{ background: `${accent}18`, border: `1px solid ${accent}30` }}>
            {pulse && <span className="live-ring absolute inset-0 rounded-2xl" />}
            <Icon size={22} style={{ color: accent }} className="relative z-10" />
          </div>
        </div>

        {loading ? (
          <div className="skeleton h-5 w-14 rounded-full" />
        ) : (
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full"
            style={{ background: `${accent}15`, color: accent }}>
            Live
          </span>
        )}
      </div>

      {/* Number */}
      <AnimatedNumber value={value} loading={loading} />

      {/* Title & description */}
      <div className="mt-2">
        {loading ? (
          <div className="space-y-1.5">
            <div className="skeleton h-4 w-28" />
            <div className="skeleton h-3 w-36" />
          </div>
        ) : (
          <>
            <p className="text-sm font-semibold text-slate-300 mt-1">{title}</p>
            <p className="text-xs text-slate-400 mt-0.5">{description}</p>
          </>
        )}
      </div>

      {/* Footer CTA */}
      {to && !loading && (
        <div className="flex items-center gap-1 mt-5 pt-4 text-xs font-semibold"
          style={{ borderTop: `1px solid ${accent}18`, color: accent }}>
          View tickets
          <ChevronRight size={12} className="arrow-icon" />
        </div>
      )}
    </motion.div>
  );
}

// ── Progress bar ───────────────────────────────────────────────────────────────
function ProgressBar({ label, value, total, accent, loading }) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs text-slate-500">{label}</span>
        {loading
          ? <div className="skeleton h-3 w-10 rounded" />
          : <span className="text-xs font-bold mono" style={{ color: accent }}>{pct}% · {value}</span>
        }
      </div>
      <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(30,41,59,.7)' }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: loading ? '0%' : `${pct}%` }}
          transition={{ duration: .8, ease: 'easeOut' }}
          className="h-full rounded-full"
          style={{ background: accent }}
        />
      </div>
    </div>
  );
}

// ── Main ───────────────────────────────────────────────────────────────────────
const TicketStatistics = () => {
  const subdomain = window.location.hostname.split('.')[0];
  const navigate  = useNavigate();

  const [loading,              setLoading]              = useState(true);
  const [totalTickets,         setTotalTickets]         = useState(0);
  const [openTickets,          setOpenTickets]          = useState(0);
  const [solvedTickets,        setSolvedTickets]        = useState(0);
  const [highPriorityTickets,  setHighPriorityTickets]  = useState(0);
  const [refreshing,           setRefreshing]           = useState(false);

  // ── WebSocket ──────────────────────────────────────────────────────────────
  useEffect(() => {
    const sub = cable.subscriptions.create(
      { channel: 'TicketsChannel', 'X-Subdomain': subdomain },
      {
        received(data) {
          setTotalTickets(data.total_tickets);
          setOpenTickets(data.open_tickets);
          setSolvedTickets(data.solved_tickets);
          setHighPriorityTickets(data.high_priority_tickets);
        },
      }
    );
    return () => sub.unsubscribe();
  }, [subdomain]);

  // ── Fetch all stats in one go ──────────────────────────────────────────────
  const fetchAll = useCallback(async (showRefresh = false) => {
    if (showRefresh) setRefreshing(true);
    try {
      const headers = { 'X-Subdomain': subdomain };
      const [r1, r2, r3, r4] = await Promise.allSettled([
        fetch('/api/total_tickets',         { headers }).then(r => r.ok ? r.json() : null),
        fetch('/api/open_tickets',          { headers }).then(r => r.ok ? r.json() : null),
        fetch('/api/solved_tickets',        { headers }).then(r => r.ok ? r.json() : null),
        fetch('/api/high_priority_tickets', { headers }).then(r => r.ok ? r.json() : null),
      ]);

      if (r1.value) setTotalTickets(r1.value.total_tickets           ?? 0);
      if (r2.value) setOpenTickets(r2.value.open_tickets             ?? 0);
      if (r3.value) setSolvedTickets(r3.value.solved_tickets         ?? 0);
      if (r4.value) setHighPriorityTickets(r4.value.high_priority_tickets ?? 0);

      if (showRefresh) toast.success('Tickets refreshed', { position: 'top-right', duration: 2000 });
    } catch (_) {
      toast.error('Failed to load ticket data', { position: 'top-right' });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [subdomain]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  // ── Resolution rate ────────────────────────────────────────────────────────
  const resolutionRate = totalTickets > 0
    ? Math.round((solvedTickets / totalTickets) * 100) : 0;

  const CARDS = [
    {
      title:       'Total Tickets',
      value:       totalTickets,
      icon:        LuTicketSlash,
      accent:      '#38bdf8',
      description: 'All support requests',
      to:          null,
    },
    {
      title:       'Open Tickets',
      value:       openTickets,
      icon:        CgDanger,
      accent:      '#fb923c',
      description: 'Awaiting resolution',
      to:          '/admin/open-tickets',
      pulse:       true,
    },
    {
      title:       'Solved Tickets',
      value:       solvedTickets,
      icon:        IoCheckmarkDoneOutline,
      accent:      '#34d399',
      description: 'Issues successfully resolved',
      to:          '/admin/solved-tickets',
    },
    {
      title:       'High Priority',
      value:       highPriorityTickets,
      icon:        AiOutlineFire,
      accent:      '#f87171',
      description: 'Urgent — needs immediate action',
      to:          '/admin/urgent-tickets',
      pulse:       highPriorityTickets > 0,
    },
  ];

  return (
    <>
      <Styles />
      <Toaster />

      <div className="tickets-root min-h-fit p-6 space-y-6 relative overflow-hidden"
        style={{ background: 'transparent' }}>

        {/* Ambient blobs */}
        <div className="drift1 absolute top-0 right-0 w-72 h-72 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle,rgba(56,189,248,.06) 0%,transparent 70%)', zIndex: 0 }} />
        <div className="drift2 absolute bottom-0 left-0 w-64 h-64 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle,rgba(248,113,113,.05) 0%,transparent 70%)', zIndex: 0 }} />

        <div className="relative z-10 space-y-6">

          {/* ── Header ─────────────────────────────────────────────────────── */}
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="relative inline-flex w-2.5 h-2.5">
                </span>
              </div>
              <h2 className="text-xl font-bold text-black dark:text-white">Support Tickets</h2>
              <p className="text-xs text-slate-500 mt-0.5">Real-time ticket overview</p>
            </div>

            <button
              onClick={() => fetchAll(true)}
              disabled={refreshing}
              className="flex items-center gap-2 px-4 py-2 
              rounded-xl text-sm font-semibold text-white transition-all bg-green-500"
              style={{  border: '1px solid rgba(56,189,248,.22)' }}
            >
              <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} style={{ color: 'white' }} />
              Refresh
            </button>
          </motion.div>

          {/* ── Stat cards ─────────────────────────────────────────────────── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {CARDS.map((card, i) => (
              <motion.div key={card.title}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}>
                <StatCard {...card} loading={loading} />
              </motion.div>
            ))}
          </div>

          {/* <motion.div initial={{ opacity: 0, y: 16 }}
           animate={{ opacity: 1, y: 0 }} transition={{ delay: .3 }}
            className="ticket-card rounded-2xl p-6"
            style={{ borderColor: 'rgba(148,163,184,.1)' }}>

            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <Activity size={16} style={{ color: '#38bdf8' }} />
                <h3 className="text-sm font-bold text-white">Ticket Breakdown</h3>
              </div>
              {!loading && (
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
                  style={{ background: resolutionRate >= 70 ? 'rgba(52,211,153,.12)' : 'rgba(251,146,60,.12)',
                    color: resolutionRate >= 70 ? '#34d399' : '#fb923c' }}>
                  {resolutionRate}% resolution rate
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-4">
                <ProgressBar label="Open"          value={openTickets}         total={totalTickets} accent="#fb923c" loading={loading} />
                <ProgressBar label="Solved"        value={solvedTickets}       total={totalTickets} accent="#34d399" loading={loading} />
                <ProgressBar label="High Priority" value={highPriorityTickets} total={totalTickets} accent="#f87171" loading={loading} />
              </div>

              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Total',    value: totalTickets,        accent: '#38bdf8' },
                  { label: 'Open',     value: openTickets,         accent: '#fb923c' },
                  { label: 'Solved',   value: solvedTickets,       accent: '#34d399' },
                  { label: 'Urgent',   value: highPriorityTickets, accent: '#f87171' },
                ].map(s => (
                  <div key={s.label} className="rounded-xl p-3 text-center"
                    style={{ background: 'rgba(30,41,59,.5)', border: `1px solid ${s.accent}18` }}>
                    {loading
                      ? <div className="skeleton h-6 w-10 mx-auto rounded" />
                      : <p className="text-xl font-bold mono" style={{ color: s.accent }}>{s.value}</p>
                    }
                    <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {!loading && (
              <div className="flex flex-wrap gap-2 mt-5 pt-4"
                style={{ borderTop: '1px solid rgba(148,163,184,.07)' }}>
                {[
                  { label: 'Open tickets',   to: '/admin/open-tickets',   accent: '#fb923c' },
                  { label: 'Solved tickets', to: '/admin/solved-tickets', accent: '#34d399' },
                  { label: 'Urgent tickets', to: '/admin/urgent-tickets', accent: '#f87171' },
                ].map(btn => (
                  <button key={btn.label} onClick={() => navigate(btn.to)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all hover:opacity-80"
                    style={{ background: `${btn.accent}12`, color: btn.accent, border: `1px solid ${btn.accent}22` }}>
                    {btn.label} <ChevronRight size={11} />
                  </button>
                ))}
              </div>
            )}
          </motion.div> */}

        </div>
      </div>
    </>
  );
};

export default TicketStatistics;