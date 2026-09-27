// File: src/components/RouterReachabilityStats.jsx
import { useState, useEffect, useCallback } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import RefreshIcon from '@mui/icons-material/Refresh';
import WifiOffIcon from '@mui/icons-material/WifiOff';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ScheduleIcon from '@mui/icons-material/Schedule';
import { IconButton, Tooltip } from '@mui/material';

const PERIOD_OPTIONS = [
  { label: '7d', days: 7 },
  { label: '30d', days: 30 },
  { label: '90d', days: 90 },
];

const BarChart = ({ data, labelKey, valueKey, formatLabel, amPmSplitIndex }) => {
  const max = Math.max(1, ...data.map((d) => d[valueKey]));

  return (
    <div className="flex items-end gap-[3px] h-40 w-full">
      {data.map((d, i) => {
        const height = Math.max(2, (d[valueKey] / max) * 100);
        const isZero = d[valueKey] === 0;
        return (
          <div key={i} className="flex-1 flex flex-col items-center justify-end h-full group relative">
            <div
              className={`w-full rounded-t-sm transition-all duration-200 ${
                isZero
                  ? 'bg-[#eef0ea] dark:bg-[#2a2a2a]'
                  : 'bg-emerald-500 group-hover:bg-emerald-400'
              }`}
              style={{ height: `${isZero ? 3 : height}%` }}
            />
            <span className="text-[9px] mt-1 font-mono text-[#6b7280] dark:text-[#8a8a8a]">
              {formatLabel ? formatLabel(d[labelKey]) : d[labelKey]}
            </span>
            {amPmSplitIndex !== undefined && d[labelKey] === amPmSplitIndex && (
              <div className="absolute -left-[1.5px] top-0 bottom-4 w-px bg-[#d8d3c5] dark:bg-[#3a3a3a]" />
            )}
            <div
              className="pointer-events-none absolute -top-7 left-1/2 -translate-x-1/2 px-2 py-1 rounded text-[10px]
                font-mono whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity
                bg-[#1a1a1a] text-white dark:bg-[#2a2a2a] dark:text-[#f1f1f1]"
            >
              {d[valueKey]} outage{d[valueKey] === 1 ? '' : 's'}
            </div>
          </div>
        );
      })}
    </div>
  );
};

const StatCard = ({ icon, label, value, accent }) => (
  <div className="rounded-xl border border-white/5 bg-white/60 dark:bg-white/[0.02] p-4 flex items-center gap-3">
    <div className={`p-2 rounded-lg ${accent}`}>{icon}</div>
    <div>
      <p className="text-[11px] uppercase tracking-wide font-mono text-[#6b7280] dark:text-[#8a8a8a]">
        {label}
      </p>
      <p className="text-lg font-bold font-mono text-black dark:text-white">{value}</p>
    </div>
  </div>
);

const RouterReachabilityStats = ({ routerId }) => {
  const [days, setDays] = useState(30);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);

  const subdomain = window.location.hostname.split('.')[0];

  const fetchStats = useCallback(async () => {
    if (!routerId) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/nas_routers/${routerId}/reachability_stats?days=${days}`, {
        headers: { 'X-Subdomain': subdomain },
      });
      const data = await res.json();
      if (res.ok) {
        setStats(data);
      } else {
        toast.error(data.error || 'Failed to load reachability stats', {
          position: 'top-center', duration: 5000,
        });
      }
    } catch (error) {
      toast.error('Failed to load reachability stats — network error', {
        position: 'top-center', duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  }, [routerId, days]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  if (!routerId) return null;

  return (
    <div className="rounded-2xl border border-white/5 bg-white dark:bg-transparent overflow-hidden p-5 font-mono">
      <Toaster />

      <div className="flex items-center justify-between flex-wrap gap-3 mb-5">
        <div>
          <h2 className="text-lg font-bold text-black dark:text-white">
            {stats?.router_name || 'Router'} Reachability
          </h2>
          <p className="text-xs text-[#6b7280] dark:text-[#8a8a8a]">
            {stats?.currently_offline ? 'Currently offline' : 'Currently online'} · last {days} days
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex rounded-lg border border-white/8 overflow-hidden">
            {PERIOD_OPTIONS.map((opt) => (
              <button
                key={opt.days}
                onClick={() => setDays(opt.days)}
                className={`px-3 py-1.5 text-xs font-mono transition-colors ${
                  days === opt.days
                    ? 'bg-emerald-500 text-white'
                    : 'text-[#6b7280] dark:text-[#a3a3a3] hover:bg-[#f4f1ea] dark:hover:bg-[#2a2a2a]'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
          <Tooltip title="Refresh">
            <IconButton size="small" onClick={fetchStats}>
              <RefreshIcon
                className={`text-[#6b7280] dark:text-[#a3a3a3] ${loading ? 'animate-spin' : ''}`}
                style={{ width: 18, height: 18 }}
              />
            </IconButton>
          </Tooltip>
        </div>
      </div>

      {!stats ? (
        <p className="text-sm text-[#6b7280] dark:text-[#8a8a8a]">
          {loading ? 'Loading…' : 'No data yet.'}
        </p>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            <StatCard
              label="Uptime"
              value={`${stats.uptime_percent}%`}
              icon={<CheckCircleIcon htmlColor="#10b981" style={{ width: 20, height: 20 }} />}
              accent="bg-emerald-500/10"
            />
            <StatCard
              label="Outages"
              value={stats.total_outages}
              icon={<WifiOffIcon htmlColor="#ef4444" style={{ width: 20, height: 20 }} />}
              accent="bg-red-500/10"
            />
            <StatCard
              label="Avg Downtime"
              value={`${stats.avg_downtime_minutes}m`}
              icon={<ScheduleIcon htmlColor="#f59e0b" style={{ width: 20, height: 20 }} />}
              accent="bg-amber-500/10"
            />
            <StatCard
              label="Status"
              value={stats.currently_offline ? 'Offline' : 'Online'}
              icon={
                <div className={`w-2.5 h-2.5 rounded-full ${stats.currently_offline ? 'bg-red-500' : 'bg-emerald-500'}`} />
              }
              accent="bg-[#f4f1ea] dark:bg-[#2a2a2a]"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <p className="text-xs uppercase tracking-wide mb-3 text-[#6b7280] dark:text-[#8a8a8a]">
                Outages by day of week
              </p>
              <BarChart data={stats.by_day_of_week} labelKey="day" valueKey="count" />
            </div>

            <div>
              <p className="text-xs uppercase tracking-wide mb-3 text-[#6b7280] dark:text-[#8a8a8a]">
                Outages by hour · AM <span className="opacity-50">|</span> PM
              </p>
              <BarChart
                data={stats.by_hour}
                labelKey="hour"
                valueKey="count"
                amPmSplitIndex={12}
                formatLabel={(h) => (h % 6 === 0 ? `${h % 12 === 0 ? 12 : h % 12}${h < 12 ? 'a' : 'p'}` : '')}
              />
            </div>
          </div>

          <div className="mt-6">
            <p className="text-xs uppercase tracking-wide mb-3 text-[#6b7280] dark:text-[#8a8a8a]">
              Recent outages
            </p>
            {stats.recent_outages.length === 0 ? (
              <p className="text-sm text-[#6b7280] dark:text-[#8a8a8a]">
                No outages recorded in this period.
              </p>
            ) : (
              <div className="rounded-lg border border-white/8 overflow-hidden">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-[#f4f1ea] dark:bg-[#2a2a2a] text-[#6b7280] dark:text-[#a3a3a3]">
                      <th className="text-left px-3 py-2 font-medium uppercase">Went offline</th>
                      <th className="text-left px-3 py-2 font-medium uppercase">Back online</th>
                      <th className="text-right px-3 py-2 font-medium uppercase">Duration</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recent_outages.map((o, i) => (
                      <tr key={i} className="border-t border-white/5 text-black dark:text-white">
                        <td className="px-3 py-2">{new Date(o.went_offline_at).toLocaleString()}</td>
                        <td className="px-3 py-2">{new Date(o.back_online_at).toLocaleString()}</td>
                        <td className="px-3 py-2 text-right text-red-500 font-semibold">
                          {o.duration_minutes}m
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default RouterReachabilityStats;