

import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, ReferenceLine,
} from 'recharts';
import {
  ShieldCheck, Zap, Wrench, Activity, Clock, Users, Gift, RefreshCw,
  TrendingUp, TrendingDown, Minus,
} from 'lucide-react';

const subdomain = window.location.hostname.split('.')[0];

const TYPE_META = {
  outage:      { label: 'Outage',      color: '#ef4444', icon: Zap },
  maintenance: { label: 'Maintenance', color: '#f59e0b', icon: Wrench },
  degradation: { label: 'Degradation', color: '#8b5cf6', icon: Activity },
};

// Letter-grade bands, worst to best — used both for the badge and for
// picking a color along the same scale the gauge itself uses.
const GRADE_BANDS = [
  { min: 0,    grade: 'F',  color: '#ef4444' },
  { min: 60,   grade: 'D',  color: '#f97316' },
  { min: 70,   grade: 'C',  color: '#f59e0b' },
  { min: 80,   grade: 'B',  color: '#84cc16' },
  { min: 90,   grade: 'A',  color: '#22c55e' },
  { min: 99.5, grade: 'A+', color: '#10b981' },
];

const gradeFor = (percent) => {
  let band = GRADE_BANDS[0];
  for (const b of GRADE_BANDS) if (percent >= b.min) band = b;
  return band;
};

const gradeLabel = (grade) => {
  if (grade === 'A+' || grade === 'A') return 'Excellent';
  if (grade === 'B') return 'Good';
  if (grade === 'C') return 'Fair';
  if (grade === 'D') return 'Needs attention';
  return 'Critical';
};

const monthLabel = (ym) => {
  // ym: "2026-01" -> "Jan"
  const [, m] = ym.split('-');
  return ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][Number(m) - 1] || ym;
};

/* ---------------------------------------------------------------- */
/* Uptime gauge — simple SVG arc, no chart lib needed for this one   */
/* ---------------------------------------------------------------- */
const UptimeGauge = ({ percent }) => {
  const band = gradeFor(percent);
  const size = 132;
  const stroke = 12;
  const r = (size - stroke) / 2;
  const circumference = Math.PI * r; // half circle
  const clamped = Math.min(100, Math.max(0, percent));
  const offset = circumference - (clamped / 100) * circumference;

  return (
    <div className="relative flex flex-col items-center shrink-0">
      <svg width={size} height={size / 2 + stroke} viewBox={`0 0 ${size} ${size / 2 + stroke}`}>
        <path
          d={`M ${stroke / 2} ${size / 2} A ${r} ${r} 0 0 1 ${size - stroke / 2} ${size / 2}`}
          fill="none" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round"
          className="text-gray-100 dark:text-gray-700"
        />
        <motion.path
          d={`M ${stroke / 2} ${size / 2} A ${r} ${r} 0 0 1 ${size - stroke / 2} ${size / 2}`}
          fill="none" stroke={band.color} strokeWidth={stroke} strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-end pb-0.5">
        <span className="text-3xl font-extrabold tabular-nums" style={{ color: band.color }}>
          {band.grade}
        </span>
      </div>
    </div>
  );
};

/* ---------------------------------------------------------------- */
/* Stat card                                                         */
/* ---------------------------------------------------------------- */
const StatCard = ({ icon: Icon, tint, label, value, sub, trend }) => (
  <motion.div
    initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
    className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4"
  >
    <div className="flex items-center justify-between mb-2.5">
      <span className="flex items-center justify-center w-8 h-8 rounded-lg" style={{ backgroundColor: `${tint}1a` }}>
        <Icon size={15} style={{ color: tint }} />
      </span>
      {trend !== undefined && trend !== null && (
        <span className={`flex items-center gap-0.5 text-[11px] font-semibold ${
          trend > 0 ? 'text-red-500' : trend < 0 ? 'text-emerald-500' : 'text-gray-400'
        }`}>
          {trend > 0 ? <TrendingUp size={12} /> : trend < 0 ? <TrendingDown size={12} /> : <Minus size={12} />}
          {trend !== 0 ? `${Math.abs(trend)}%` : 'flat'}
        </span>
      )}
    </div>
    <p className="text-2xl font-extrabold text-gray-900 dark:text-white tabular-nums leading-tight">{value}</p>
    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{label}</p>
    {sub && <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-1">{sub}</p>}
  </motion.div>
);

/* ---------------------------------------------------------------- */
/* Custom tooltip for the monthly bar chart                          */
/* ---------------------------------------------------------------- */
const MonthTooltip = ({ active, payload, label, threshold }) => {
  if (!active || !payload?.length) return null;
  const hours = payload[0].value;
  const over = hours > threshold;
  return (
    <div className="rounded-lg bg-gray-900 text-white text-xs px-3 py-2 shadow-xl">
      <p className="font-semibold mb-0.5">{monthLabel(label)}</p>
      <p className="text-gray-300">{hours.toFixed(1)}h downtime</p>
      <p className={over ? 'text-red-300' : 'text-emerald-300'}>
        {over ? `${(hours - threshold).toFixed(1)}h over threshold` : 'Below threshold'}
      </p>
    </div>
  );
};

/* ---------------------------------------------------------------- */
/* Main component                                                    */
/* ---------------------------------------------------------------- */
const HotspotCompensationStats = ({ month }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (month) params.set('month', month);
      const res = await fetch(`/api/incidents/stats?${params.toString()}`, {
        headers: { 'X-Subdomain': subdomain },
      });
      if (res.ok) {
        setStats(await res.json());
      } else {
        setStats(null);
      }
    } catch {
      toast.error('Failed to load compensation stats', { position: 'top-center' });
      setStats(null);
    } finally {
      setLoading(false);
    }
  }, [month]);

  useEffect(() => { fetchStats(); }, [fetchStats]);

  const band = gradeFor(stats?.uptime_percent ?? 100);

  const monthly = stats?.monthly_downtime_hours || [];
  const threshold = stats?.threshold_hours ?? 24;
  const thresholdRemaining = Math.max(0, threshold - (stats?.current_month_downtime_hours ?? 0));

  const typeBreakdown = useMemo(() => {
    const entries = stats?.type_breakdown || [];
    return entries.map((e) => ({
      name: TYPE_META[e.incident_type]?.label || e.incident_type,
      value: e.count,
      color: TYPE_META[e.incident_type]?.color || '#94a3b8',
    }));
  }, [stats]);

  const hasTypeData = typeBreakdown.some((t) => t.value > 0);
  const hasMonthlyData = monthly.some((m) => m.hours > 0);

  if (loading && !stats) {
    return (
      <div className="flex justify-center py-16">
        <RefreshCw size={22} className="animate-spin text-emerald-500" />
      </div>
    );
  }

  return (
    <div className="space-y-4 font-sans">
      {/* Uptime score + stat cards */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-2 rounded-xl border border-gray-200 dark:border-gray-700
          bg-white dark:bg-gray-800 p-5 flex items-center gap-5">
          <UptimeGauge percent={stats?.uptime_percent ?? 100} />
          <div className="min-w-0">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
              Uptime score {stats?.month_label ? `· ${stats.month_label}` : ''}
            </p>
            <p className="text-2xl font-extrabold text-gray-900 dark:text-white tabular-nums mt-0.5">
              {(stats?.uptime_percent ?? 100).toFixed(1)}%
            </p>
            <p className="text-xs font-semibold mt-0.5" style={{ color: band.color }}>
              {gradeLabel(band.grade)}
            </p>
            <p className="text-[11px] text-gray-400 mt-2">
              {stats?.total_incidents ?? 0} incident{(stats?.total_incidents ?? 0) === 1 ? '' : 's'} this month
            </p>
          </div>
        </div>

        <div className="lg:col-span-3 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatCard icon={ShieldCheck} tint="#ef4444" label="Total Incidents" value={stats?.total_incidents ?? 0} />
          <StatCard icon={Clock} tint="#f59e0b" label="Downtime Hours" value={`${(stats?.current_month_downtime_hours ?? 0).toFixed(1)}h`} />
          <StatCard icon={Users} tint="#0ea5e9" label="Active Customers" value={stats?.active_customers ?? 0} />
          <StatCard icon={Gift} tint="#22c55e" label="Grace Days Granted" value={stats?.grace_days_granted ?? 0} />
        </div>
      </div>

      {/* Threshold progress */}
      <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-semibold text-gray-600 dark:text-gray-300">Compensation Threshold</p>
          <p className="text-xs text-gray-400">
            {thresholdRemaining > 0
              ? `${thresholdRemaining.toFixed(1)}h remaining until ${threshold}h threshold`
              : 'Threshold reached — customers qualify for grace'}
          </p>
        </div>
        <div className="h-2.5 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(100, ((stats?.current_month_downtime_hours ?? 0) / threshold) * 100)}%` }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className={`h-full rounded-full ${thresholdRemaining > 0 ? 'bg-amber-500' : 'bg-red-500'}`}
          />
        </div>
        <div className="flex justify-between mt-1.5 text-[11px] text-gray-400">
          <span>0h</span>
          <span>{threshold}h threshold</span>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
          <p className="text-sm font-bold text-gray-900 dark:text-white">Incident Hours Over Time</p>
          <p className="text-xs text-gray-400 mb-3">Monthly incident downtime hours ({stats?.year ?? new Date().getFullYear()})</p>
          {hasMonthlyData ? (
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthly} margin={{ top: 4, right: 8, left: -12, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-gray-100 dark:stroke-gray-700" />
                  <XAxis dataKey="month" tickFormatter={monthLabel} tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} width={28} />
                  <ReferenceLine y={threshold} stroke="#ef4444" strokeDasharray="4 4" strokeWidth={1.5} />
                  <Tooltip content={<MonthTooltip threshold={threshold} />} cursor={{ fill: 'rgba(0,0,0,0.03)' }} />
                  <Bar dataKey="hours" radius={[5, 5, 0, 0]} maxBarSize={28}>
                    {monthly.map((m, i) => (
                      <Cell key={i} fill={m.hours > threshold ? '#ef4444' : '#34d399'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <EmptyChartState label="No incident data available" />
          )}
          <div className="flex items-center gap-4 mt-2 text-[11px] text-gray-400">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-emerald-400" /> Below Threshold</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-red-500" /> Above Threshold ({threshold}h)</span>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
          <p className="text-sm font-bold text-gray-900 dark:text-white">Incident Type Overview</p>
          <p className="text-xs text-gray-400 mb-3">Breakdown of incidents by category</p>
          {hasTypeData ? (
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={typeBreakdown} dataKey="value" nameKey="name"
                    innerRadius={48} outerRadius={70} paddingAngle={3}
                  >
                    {typeBreakdown.map((t, i) => <Cell key={i} fill={t.color} stroke="none" />)}
                  </Pie>
                  <Tooltip
                    formatter={(value, name) => [`${value} incident${value === 1 ? '' : 's'}`, name]}
                    contentStyle={{ fontSize: 12, borderRadius: 8, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}
                  />
                  <Legend
                    verticalAlign="bottom" height={28}
                    formatter={(value) => <span className="text-xs text-gray-500 dark:text-gray-400">{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <EmptyChartState label="No incident data available" />
          )}
        </div>
      </div>
    </div>
  );
};

const EmptyChartState = ({ label }) => (
  <div className="h-56 flex flex-col items-center justify-center text-center">
    <Activity size={22} className="text-gray-300 dark:text-gray-600 mb-2" />
    <p className="text-xs text-gray-400">{label}</p>
  </div>
);

export default HotspotCompensationStats;