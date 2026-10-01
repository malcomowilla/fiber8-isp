import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactApexChart from 'react-apexcharts';
import toast, { Toaster } from 'react-hot-toast';
import { IconButton, Tooltip, CircularProgress } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import RefreshIcon from '@mui/icons-material/Refresh';

const RANGES = [7, 30, 90];
const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];


function useIsDarkMode() {
  const [isDark, setIsDark] = useState(
    () => typeof document !== 'undefined' && document.documentElement.classList.contains('dark')
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

const formatBytes = (bytes) => {
  if (!bytes) return '0 B';
  const KB = bytes / 1024, MB = KB / 1024, GB = MB / 1024, TB = GB / 1024;
  if (TB >= 1) return `${TB.toFixed(2)} TB`;
  if (GB >= 1) return `${GB.toFixed(2)} GB`;
  if (MB >= 1) return `${MB.toFixed(1)} MB`;
  if (KB >= 1) return `${KB.toFixed(1)} KB`;
  return `${bytes} B`;
};

const formatDuration = (seconds) => {
  const s = Math.round(seconds || 0);
  if (s <= 0) return '0m';
  const d = Math.floor(s / 86400);
  const h = Math.floor((s % 86400) / 3600);
  const m = Math.floor((s % 3600) / 60);
  if (d > 0) return `${d}d ${h}h`;
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
};

const formatHours = (seconds) => `${Math.round((seconds || 0) / 3600).toLocaleString()} h`;
const kes = (n) => `KES ${Math.round(n || 0).toLocaleString()}`;
const pad = (n) => String(n).padStart(2, '0');

/* ── small pieces ────────────────────────────────────────── */

const Kpi = ({ label, value, sub }) => (
  <div className="rounded-2xl border border-gray-200 bg-white p-4 font-sans shadow-sm dark:border-gray-800 dark:bg-gray-900">
    <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">{label}</p>
    <p className="mt-2 text-2xl font-semibold tabular-nums text-gray-900 dark:text-gray-50">{value}</p>
    <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">{sub}</p>
  </div>
);

const Panel = ({ title, subtitle, children, className = '' }) => (
  <div className={`rounded-2xl border border-gray-200 bg-white p-4 font-sans shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-5 ${className}`}>
    <div className="mb-3">
      <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">{title}</h2>
      {subtitle && <p className="text-xs text-gray-400 dark:text-gray-500">{subtitle}</p>}
    </div>
    {children}
  </div>
);

const Empty = ({ text = 'No data for this range' }) => (
  <p className="py-8 text-center text-xs text-gray-400 dark:text-gray-500">{text}</p>
);

/* ── main ────────────────────────────────────────────────── */

const HotspotAnalytics = () => {
  const navigate = useNavigate();
  const isDark = useIsDarkMode();
  const subdomain = window.location.hostname.split('.')[0];

  const [days, setDays] = useState(7);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async (range, refresh = false) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/hotspot_analytics?days=${range}${refresh ? '&refresh=1' : ''}`, {
        headers: { 'X-Subdomain': subdomain },
      });
      const json = await res.json();
      if (res.status === 402) { window.location.href = '/license-expired'; return; }
      if (res.status === 401) { window.location.href = '/signin'; return; }
      if (res.ok) {
        setData(json);
      } else {
        toast.error(<p className="font-sans">{json.error || 'Failed to load analytics'}</p>, { position: 'top-center' });
      }
    } catch {
      toast.error(<p className="font-sans">Network error loading analytics</p>, { position: 'top-center' });
    } finally {
      setLoading(false);
    }
  }, [subdomain]);

  useEffect(() => { load(days); }, [days, load]);

  const fore = isDark ? '#9ca3af' : '#6b7280';
  const grid = isDark ? 'rgba(75,85,99,0.35)' : 'rgba(148,163,184,0.25)';
  const primary = isDark ? '#e5e7eb' : '#374151';
  const secondary = isDark ? '#6b7280' : '#9ca3af';

  const baseChart = useMemo(() => ({
    fontFamily: 'inherit',
    foreColor: fore,
    toolbar: { show: false },
    zoom: { enabled: false },
    background: 'transparent',
  }), [fore]);

  const usageChart = useMemo(() => {
    if (!data) return null;
    const cats = data.usage_over_time.map((d) =>
      new Date(d.date + 'T00:00:00').toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })
    );
    return {
      series: [
        { name: 'Data (GB)', type: 'area', data: data.usage_over_time.map((d) => +(d.bytes / 1024 ** 3).toFixed(2)) },
        { name: 'Vouchers used', type: 'column', data: data.usage_over_time.map((d) => d.vouchers) },
      ],
      options: {
        chart: { ...baseChart, type: 'line', height: 300 },
        colors: [primary, secondary],
        stroke: { width: [2, 0], curve: 'smooth' },
        fill: { type: ['gradient', 'solid'], gradient: { opacityFrom: 0.3, opacityTo: 0.02 } },
        plotOptions: { bar: { columnWidth: '45%', borderRadius: 3 } },
        dataLabels: { enabled: false },
        grid: { borderColor: grid, strokeDashArray: 3 },
        xaxis: { categories: cats, labels: { rotate: 0, hideOverlappingLabels: true } },
        yaxis: [
          { title: { text: 'Data (GB)' }, labels: { formatter: (v) => Math.round(v) } },
          { opposite: true, title: { text: 'Vouchers used' }, labels: { formatter: (v) => Math.round(v) } },
        ],
        legend: { position: 'top', horizontalAlign: 'right' },
      },
    };
  }, [data, baseChart, primary, secondary, grid]);

  const heatChart = useMemo(() => {
    if (!data) return null;
    const max = Math.max(1, ...data.heatmap.flat());
    return {
      max,
      series: data.heatmap.map((row, i) => ({
        name: DAY_LABELS[i],
        data: row.map((v, h) => ({ x: pad(h), y: v })),
      })).reverse(),
      options: {
        chart: { ...baseChart, type: 'heatmap', height: 280 },
        colors: [primary],
        dataLabels: { enabled: false },
        stroke: { width: 2, colors: [isDark ? '#111827' : '#ffffff'] },
        plotOptions: { heatmap: { radius: 3, enableShades: true, shadeIntensity: 0.6 } },
        xaxis: { labels: { rotate: 0, formatter: (v) => (Number(v) % 3 === 0 ? v : '') } },
        legend: { show: false },
        grid: { padding: { top: 0 } },
      },
    };
  }, [data, baseChart, primary, isDark]);

  const barOptions = (categories, color) => ({
    chart: { ...baseChart, type: 'bar', height: 240 },
    colors: [color],
    plotOptions: { bar: { columnWidth: '60%', borderRadius: 3 } },
    dataLabels: { enabled: false },
    grid: { borderColor: grid, strokeDashArray: 3 },
    xaxis: { categories, labels: { rotate: 0, hideOverlappingLabels: true } },
    yaxis: { labels: { formatter: (v) => Math.round(v) } },
    tooltip: { y: { formatter: (v) => `${v} sessions` } },
  });

  const k = data?.kpis;

  return (
    <div className="font-sans">
      <Toaster />

      {/* header */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Tooltip title="Back">
            <IconButton size="small" onClick={() => navigate(-1)}>
              <ArrowBackIcon fontSize="small" className="text-gray-700 dark:text-gray-200" />
            </IconButton>
          </Tooltip>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-50">Hotspot analytics</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Usage statistics</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex overflow-hidden rounded-lg border border-gray-300 text-xs font-semibold dark:border-gray-700">
            {RANGES.map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setDays(r)}
                className={`px-3 py-2 transition ${
                  days === r
                    ? 'bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900'
                    : 'bg-white text-gray-600 hover:bg-gray-50 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800'
                }`}
              >
                {r} DAYS
              </button>
            ))}
          </div>
          <Tooltip title="Refresh">
            <span>
              <IconButton size="small" disabled={loading} onClick={() => load(days, true)}>
                {loading ? <CircularProgress size={18} color="inherit" /> : <RefreshIcon fontSize="small" className="text-gray-700 dark:text-gray-200" />}
              </IconButton>
            </span>
          </Tooltip>
        </div>
      </div>

           {data && (
        <div className="mb-4 rounded-xl border border-gray-200 bg-gray-50 p-3 text-xs text-gray-600 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300">
          Usage is read from your MikroTik routers. Data and time come from each voucher's router counters, counted when
          the voucher was last used in this range, and each voucher counts as one session. Treat these as close
          estimates. Online now is live.
          {data.routers_unreachable?.length > 0 && (
            <span className="mt-1 block font-medium">
              Couldn't reach: {data.routers_unreachable.join(', ')}. Their usage is missing from these numbers.
            </span>
          )}
        </div>
      )}

      {!data && loading && (
        <div className="flex justify-center py-24"><CircularProgress color="inherit" className="text-gray-500" /></div>
      )}

      {data && (
        <>
          {/* KPIs */}
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
            <Kpi label="Data used" value={formatBytes(k.data_bytes)} sub={`${k.devices.toLocaleString()} devices`} />
            <Kpi label="Time used" value={formatHours(k.time_seconds)} sub={`${k.sessions.toLocaleString()} sessions`} />
            <Kpi label="Vouchers used" value={k.vouchers_used.toLocaleString()} sub={kes(k.vouchers_revenue)} />
            <Kpi label="Online now" value={k.online_now.toLocaleString()} sub="active users" />
            <Kpi label="Avg session" value={formatDuration(k.avg_session_seconds)} sub="per session" />
            <Kpi label="Routers up" value={`${k.routers_up}/${k.routers_total}`} sub="hotspot fleet" />
          </div>

          {/* usage over time + top routers */}
          <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
            <Panel title="Usage over time" className="lg:col-span-2">
              {usageChart && (
                <ReactApexChart options={usageChart.options} series={usageChart.series} type="line" height={300} />
              )}
            </Panel>

            <Panel title="Top routers">
              {data.top_routers.length === 0 ? <Empty /> : (
                <div className="divide-y divide-gray-100 dark:divide-gray-800">
                  {data.top_routers.map((r) => (
                    <div key={r.name} className="py-3">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{r.name}</p>
                        <p className="text-sm font-semibold tabular-nums text-gray-900 dark:text-gray-100">{formatBytes(r.bytes)}</p>
                      </div>
                      <div className="mt-1 flex flex-wrap gap-x-3 text-xs text-gray-500 dark:text-gray-400">
                        <span>{r.vouchers.toLocaleString()} vouchers</span>
                        <span>{r.online} online</span>
                        <span>{kes(r.revenue)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Panel>
          </div>

          {/* heatmap + busiest hours + session length */}
          <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
            <Panel
              title="When people connect"
              subtitle={`peak ${heatChart.max} · quiet to busy`}
              className="lg:col-span-2"
            >
              <ReactApexChart options={heatChart.options} series={heatChart.series} type="heatmap" height={280} />
            </Panel>

            <Panel title="Session length">
              <ReactApexChart
                options={barOptions(data.session_length.map((b) => b.label), primary)}
                series={[{ name: 'Sessions', data: data.session_length.map((b) => b.count) }]}
                type="bar"
                height={240}
              />
            </Panel>
          </div>

          <div className="mt-4">
            <Panel title="Busiest hours">
              <ReactApexChart
                options={barOptions(data.busiest_hours.map((_, h) => pad(h)), secondary)}
                series={[{ name: 'Sessions', data: data.busiest_hours }]}
                type="bar"
                height={240}
              />
            </Panel>
          </div>

          {/* plan performance */}
          <div className="mt-4">
            <Panel title="Plan performance">
              {data.plan_performance.length === 0 ? <Empty /> : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-gray-200 text-xs uppercase tracking-wide text-gray-500 dark:border-gray-800 dark:text-gray-400">
                        <th className="py-2 pr-4 font-medium">Plan</th>
                        <th className="py-2 pr-4 font-medium">Vouchers</th>
                        <th className="py-2 pr-4 font-medium">Revenue</th>
                        <th className="py-2 pr-4 font-medium">Avg data</th>
                        <th className="py-2 font-medium">Avg time</th>
                      </tr>
                    </thead>
                    <tbody className="text-gray-800 dark:text-gray-100">
                      {data.plan_performance.map((p) => (
                        <tr key={p.package} className="border-b border-gray-100 last:border-0 dark:border-gray-800">
                          <td className="py-2.5 pr-4 font-medium">{p.package}</td>
                          <td className="py-2.5 pr-4 tabular-nums">{p.vouchers.toLocaleString()}</td>
                          <td className="py-2.5 pr-4 tabular-nums">{kes(p.revenue)}</td>
                          <td className="py-2.5 pr-4 tabular-nums">{formatBytes(p.avg_bytes)}</td>
                          <td className="py-2.5 tabular-nums">{formatDuration(p.avg_seconds)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Panel>
          </div>

          {/* devices + spenders */}
          <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Panel title="Heaviest devices" subtitle="by data, this range">
              {data.heaviest_devices.length === 0 ? <Empty /> : (
                <div className="divide-y divide-gray-100 dark:divide-gray-800">
                  {data.heaviest_devices.map((d, i) => (
                    <div key={d.mac} className="flex items-center gap-3 py-2.5">
                      <span className="w-6 text-xs tabular-nums text-gray-400">{pad(i + 1)}</span>
                      <div className="min-w-0 flex-1">
                        <code className="text-xs font-medium text-gray-800 dark:text-gray-100">{d.mac}</code>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {d.vouchers} vouchers · {formatDuration(d.seconds)} · {kes(d.spent)}
                        </p>
                      </div>
                      <span className="text-sm font-semibold tabular-nums text-gray-900 dark:text-gray-100">{formatBytes(d.bytes)}</span>
                    </div>
                  ))}
                </div>
              )}
            </Panel>

            <Panel title="Top spending accounts" subtitle="lifetime">
              {data.top_spenders.length === 0 ? <Empty text="No purchases yet" /> : (
                <div className="divide-y divide-gray-100 dark:divide-gray-800">
                  {data.top_spenders.map((s, i) => (
                    <div key={s.phone} className="flex items-center gap-3 py-2.5">
                      <span className="w-6 text-xs tabular-nums text-gray-400">{pad(i + 1)}</span>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-800 dark:text-gray-100">{s.phone}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{s.purchases} purchases</p>
                      </div>
                      <span className="text-sm font-semibold tabular-nums text-gray-900 dark:text-gray-100">{kes(s.spent)}</span>
                    </div>
                  ))}
                </div>
              )}
            </Panel>
          </div>

          <p className="mt-4 text-xs text-gray-400 dark:text-gray-500">
            {days} days to {new Date(data.generated_at).toLocaleString('en-GB')} · cached 60s
          </p>
        </>
      )}
    </div>
  );
};

export default HotspotAnalytics;