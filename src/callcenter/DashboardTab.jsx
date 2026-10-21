import { useState, useEffect, useCallback } from 'react';
import ReactApexChart from 'react-apexcharts';
import { api, usePoll, fmtDur } from './api';
import { Card, Dot } from './ui';

const VIA = { webrtc: 'Browser', sip_phone: 'SIP phone' };
const isDark = () => document.documentElement.classList.contains('dark');

function Kpi({ label, value, sub, accent }) {
  return (
    <Card className="p-4">
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">{label}</p>
      <p className={`text-3xl font-bold tabular-nums mt-1 ${accent ? 'text-lime-600 dark:text-lime-400' : 'text-slate-900 dark:text-white'}`}>{value}</p>
      {sub && <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{sub}</p>}
    </Card>
  );
}

export default function DashboardTab({ extensions }) {
  const [range, setRange] = useState('today');
  const [stats, setStats] = useState(null);
  const [live, setLive] = useState({ ami_online: true, calls: [] });

  const loadStats = useCallback(async () => {
    try { setStats(await api(`stats?range=${range}`)); } catch { /* ignore */ }
  }, [range]);

  useEffect(() => { loadStats(); }, [loadStats]);
  usePoll(loadStats, 30000);
  usePoll(async () => { try { setLive(await api('live_calls')); } catch { /* ignore */ } }, 5000);

  const dark = isDark();
  const online = extensions.filter((e) => e.status === 'online');
  const rate = stats?.total ? Math.round((stats.answered / stats.total) * 100) : 0;
  const find = (ext) => extensions.find((e) => e.extension === ext);

  const common = { chart: { toolbar: { show: false }, background: 'transparent', fontFamily: 'inherit', foreColor: dark ? '#94a3b8' : '#64748b' }, theme: { mode: dark ? 'dark' : 'light' }, grid: { borderColor: dark ? 'rgba(148,163,184,.12)' : 'rgba(148,163,184,.25)' } };

  return (
    <div className="space-y-5">
      <div className="flex gap-1.5">
        {[['today', 'Today'], ['7d', '7 days'], ['30d', '30 days']].map(([v, l]) => (
          <button key={v} onClick={() => setRange(v)}
            className={`px-3.5 py-1.5 rounded-full text-sm font-semibold ${range === v ? 'bg-lime-500 text-slate-900' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}>
            {l}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3">
        <Kpi label="Calls" value={stats?.total ?? '–'} />
        <Kpi label="Answered" value={stats?.answered ?? '–'} sub={stats ? `${rate}% answer rate` : ''} accent />
        <Kpi label="Missed" value={stats?.missed ?? '–'} sub={stats ? `${stats.busy} busy · ${stats.failed} failed` : ''} />
        <Kpi label="Avg talk time" value={stats ? fmtDur(stats.avg_talk) : '–'} />
        <Kpi label="Live now" value={live.calls.length} accent />
        <Kpi label="Agents online" value={`${online.length}/${extensions.length}`} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        <Card className="p-4 lg:col-span-2">
          <p className="text-sm font-bold text-slate-900 dark:text-white mb-2">Calls by hour</p>
          <ReactApexChart type="bar" height={240}
            series={[{ name: 'Calls', data: stats?.by_hour ?? Array(24).fill(0) }]}
            options={{ ...common, colors: ['#84cc16'], plotOptions: { bar: { borderRadius: 4, columnWidth: '60%' } },
              dataLabels: { enabled: false }, xaxis: { categories: Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0')), axisTicks: { show: false } } }} />
        </Card>
        <Card className="p-4">
          <p className="text-sm font-bold text-slate-900 dark:text-white mb-2">Outcomes</p>
          <ReactApexChart type="donut" height={240}
            series={stats ? [stats.answered, stats.missed, stats.busy, stats.failed] : [0, 0, 0, 0]}
            options={{ ...common, labels: ['Answered', 'Missed', 'Busy', 'Failed'], colors: ['#84cc16', '#f59e0b', '#fb923c', '#ef4444'],
              legend: { position: 'bottom' }, dataLabels: { enabled: false }, stroke: { width: 0 } }} />
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        <Card className="p-4 lg:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2"><Dot on pulse /> Live calls</p>
            {!live.ami_online && <span className="text-xs text-red-500">PBX unreachable</span>}
          </div>
          {live.calls.length === 0 ? (
            <p className="text-sm text-slate-500 py-6 text-center">No active calls right now.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="text-left text-xs uppercase tracking-wider text-slate-500">
                  <th className="py-2">Agent</th><th>With</th><th>Using</th><th>State</th><th className="text-right">Time</th>
                </tr></thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {live.calls.map((c) => (
                    <tr key={c.channel}>
                      <td className="py-2 font-semibold">{c.endpoint}{find(c.endpoint)?.name ? ` · ${find(c.endpoint).name}` : ''}</td>
                      <td>{c.with || c.caller_id || '—'}</td>
                      <td className="text-slate-500">{VIA[find(c.endpoint)?.via] || '—'}</td>
                      <td><span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${c.state === 'talking' ? 'bg-lime-100 text-lime-700 dark:bg-lime-500/20 dark:text-lime-300' : 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300'}`}>{c.state}</span></td>
                      <td className="text-right tabular-nums">{fmtDur(c.seconds)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        <Card className="p-4">
          <p className="text-sm font-bold text-slate-900 dark:text-white mb-3">Top agents</p>
          {(stats?.top_agents ?? []).length === 0 ? (
            <p className="text-sm text-slate-500 py-6 text-center">No data yet.</p>
          ) : (
            <ul className="space-y-2">
              {stats.top_agents.map((a) => (
                <li key={a.extension} className="flex items-center justify-between text-sm">
                  <span className="font-semibold">{a.extension} <span className="font-normal text-slate-500">{a.name}</span></span>
                  <span className="tabular-nums text-slate-600 dark:text-slate-300">{a.answered}/{a.calls}</span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      <Card className="p-4">
        <p className="text-sm font-bold text-slate-900 dark:text-white mb-3">Agent status</p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
          {extensions.map((e) => (
            <div key={e.extension} className="flex items-center gap-3 rounded-xl border border-slate-200 dark:border-slate-800 px-3 py-2.5">
              <Dot on={e.status === 'online'} pulse />
              <div className="min-w-0">
                <p className="text-sm font-semibold truncate">{e.extension} · {e.name}</p>
                <p className="text-xs text-slate-500">
                  {!e.enabled ? 'Disabled' : e.status === 'online' ? `Online · ${VIA[e.via] || 'connected'}` : 'Offline'}
                </p>
              </div>
            </div>
          ))}
          {extensions.length === 0 && <p className="text-sm text-slate-500 col-span-full">No agents yet.</p>}
        </div>
      </Card>
    </div>
  );
}