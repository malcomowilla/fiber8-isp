/**
 * ChurnRateSection.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Drop this component inside Analytics.jsx, just below the live bandwidth chart.
 *
 * USAGE inside Analytics.jsx:
 *   import ChurnRateSection from './ChurnRateSection';
 *   <ChurnRateSection subdomain={subdomain} />
 *
 * API expected: GET /api/subscriber_churn_stats?months={3|6|12}
 * (see original header comment block for the full response shape)
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactApexChart from 'react-apexcharts';
import {
  TrendingDown, TrendingUp, UserMinus, UserCheck,
  AlertTriangle, Info, ChevronDown, ChevronUp, RefreshCw,
  Clock, WifiOff, Trash2, HelpCircle,
} from 'lucide-react';

/* ---------------------------------------------------------------------- */
/*  Helpers                                                                */
/* ---------------------------------------------------------------------- */

const pct = (n) => `${(+n || 0).toFixed(1)}%`;
const num = (n) => Number(n || 0).toLocaleString('en-KE');

const churnColour = (rate) => {
  if (rate < 3) return { hex: '#10b981', label: 'Healthy' };
  if (rate < 7) return { hex: '#f59e0b', label: 'Warning' };
  return { hex: '#f43f5e', label: 'Critical' };
};

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

/* ---------------------------------------------------------------------- */
/*  Small pieces                                                          */
/* ---------------------------------------------------------------------- */

function CriteriaPill({ icon: Icon, colour, title, description }) {
  return (
    <div
      className="flex items-start gap-3 rounded-xl border p-3 font-sans"
      style={{ background: `${colour}0d`, borderColor: `${colour}28` }}
    >
      <div
        className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg"
        style={{ background: `${colour}18` }}
      >
        <Icon size={14} style={{ color: colour }} />
      </div>
      <div>
        <p className="text-xs font-semibold leading-tight text-gray-800 dark:text-gray-100">{title}</p>
        <p className="mt-0.5 text-xs leading-relaxed text-gray-500 dark:text-gray-400">{description}</p>
      </div>
    </div>
  );
}

function Formula({ churned, total, rate }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-gray-50 p-3.5 font-sans dark:border-gray-800 dark:bg-gray-800/50">
      <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">
        Monthly churn formula
      </p>
      <div className="flex flex-wrap items-center gap-1.5 text-sm">
        <span className="text-gray-500 dark:text-gray-400">Churn rate</span>
        <span className="text-gray-300 dark:text-gray-600">=</span>
        <span className="rounded-md bg-rose-50 px-2 py-0.5 text-xs font-medium text-rose-600 dark:bg-rose-500/10 dark:text-rose-400">
          {num(churned)} churned
        </span>
        <span className="text-gray-300 dark:text-gray-600">÷</span>
        <span className="rounded-md bg-sky-50 px-2 py-0.5 text-xs font-medium text-sky-600 dark:bg-sky-500/10 dark:text-sky-400">
          {num(total)} at start
        </span>
        <span className="text-gray-300 dark:text-gray-600">×100 =</span>
        <span className="text-lg font-semibold tabular-nums" style={{ color: churnColour(rate).hex }}>
          {pct(rate)}
        </span>
      </div>
    </div>
  );
}

function Skel({ w = 'w-24', h = 'h-7' }) {
  return <div className={`${w} ${h} animate-pulse rounded-lg bg-gray-200 dark:bg-gray-800`} />;
}

/* ---------------------------------------------------------------------- */
/*  Main                                                                  */
/* ---------------------------------------------------------------------- */

export default function ChurnRateSection({ subdomain }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [showHow, setShowHow] = useState(false);
  const [period, setPeriod] = useState(6);

  const isDark = useIsDarkMode();
  const axisColor = isDark ? '#9ca3af' : '#6b7280';
  const gridColor = isDark ? 'rgba(75,85,99,.35)' : 'rgba(148,163,184,.25)';

  const fetchChurn = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await fetch(`/api/subscriber_churn_stats?months=${period}`, {
        headers: { 'X-Subdomain': subdomain },
      });
      if (!res.ok) throw new Error('non-ok');
      const d = await res.json();
      setData(d);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [subdomain, period]);

  useEffect(() => { fetchChurn(); }, [fetchChurn]);

  const history = data?.monthly_history || [];
  const categories = history.map((h) => h.month);
  const rateData = history.map((h) => +(h.rate || 0).toFixed(2));
  const newData = history.map((h) => h.new_subs || 0);

  const chartOptions = useMemo(() => ({
    chart: {
      type: 'line',
      height: 260,
      fontFamily: 'inherit',
      background: 'transparent',
      toolbar: { show: false },
      animations: { enabled: true, easing: 'easeinout', speed: 600 },
      zoom: { enabled: false },
      foreColor: axisColor,
    },
    theme: { mode: isDark ? 'dark' : 'light' },
    colors: ['#f43f5e', '#10b981'],
    stroke: { curve: 'smooth', width: [3, 2], dashArray: [0, 4] },
    fill: {
      type: ['gradient', 'solid'],
      gradient: {
        type: 'vertical',
        shadeIntensity: 0.9,
        gradientToColors: ['transparent'],
        opacityFrom: 0.25,
        opacityTo: 0.0,
        stops: [0, 95],
      },
      opacity: [1, 0.7],
    },
    markers: { size: [4, 3], strokeWidth: 0, hover: { sizeOffset: 3 } },
    dataLabels: { enabled: false },
    grid: { borderColor: gridColor, strokeDashArray: 4, xaxis: { lines: { show: false } } },
    xaxis: {
      categories,
      labels: { style: { colors: axisColor, fontSize: '11px' } },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: [
      {
        title: { text: 'Churn rate (%)', style: { color: '#f43f5e', fontSize: '11px', fontWeight: 600 } },
        labels: { style: { colors: '#f43f5e' }, formatter: (v) => `${v}%` },
        min: 0,
      },
      {
        opposite: true,
        title: { text: 'New subscribers', style: { color: '#10b981', fontSize: '11px', fontWeight: 600 } },
        labels: { style: { colors: '#10b981' }, formatter: (v) => `${v}` },
        min: 0,
      },
    ],
    legend: { position: 'top', labels: { colors: axisColor }, fontFamily: 'inherit' },
    tooltip: {
      theme: isDark ? 'dark' : 'light',
      shared: true,
      intersect: false,
      y: [{ formatter: (v) => `${v}% churn` }, { formatter: (v) => `${v} new subs` }],
    },
    annotations: {
      yaxis: [
        {
          y: 5, borderColor: '#f59e0b', borderWidth: 1, strokeDashArray: 6,
          label: { text: 'Warning 5%', style: { color: '#f59e0b', background: 'transparent', fontSize: '10px' }, position: 'right', offsetX: -10 },
        },
        {
          y: 10, borderColor: '#f43f5e', borderWidth: 1, strokeDashArray: 6,
          label: { text: 'Critical 10%', style: { color: '#f43f5e', background: 'transparent', fontSize: '10px' }, position: 'right', offsetX: -10 },
        },
      ],
    },
  }), [categories, axisColor, gridColor, isDark]);

  const chartSeries = [
    { name: 'Churn Rate', type: 'area', data: rateData },
    { name: 'New Subscribers', type: 'line', data: newData },
  ];

  const rate = data?.churn_rate_this_month ?? 0;
  const colour = churnColour(rate);

  const breakdownOptions = useMemo(() => ({
    chart: {
      type: 'bar', height: 150, fontFamily: 'inherit', background: 'transparent',
      toolbar: { show: false }, foreColor: axisColor,
    },
    theme: { mode: isDark ? 'dark' : 'light' },
    colors: ['#f43f5e', '#f59e0b', '#8b5cf6'],
    plotOptions: { bar: { horizontal: true, borderRadius: 6, barHeight: '55%', distributed: true } },
    dataLabels: { enabled: true, formatter: (v) => `${v}`, style: { fontSize: '11px', colors: ['#ffffff'] } },
    xaxis: {
      categories: ['Offline > 30 days', 'Expired, not renewed', 'Deleted manually'],
      labels: { style: { colors: axisColor, fontSize: '11px' } },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: { labels: { style: { colors: axisColor, fontSize: '11px' } } },
    grid: { borderColor: gridColor, xaxis: { lines: { show: true } } },
    legend: { show: false },
    tooltip: { theme: isDark ? 'dark' : 'light', y: { formatter: (v) => `${v} subscribers` } },
  }), [axisColor, gridColor, isDark]);

  const breakdownSeries = [{
    name: 'Subscribers',
    data: [data?.offline_over_30_days ?? 0, data?.expired_not_renewed ?? 0, data?.manually_deleted ?? 0],
  }];

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="space-y-4 font-sans"
    >
      {/* ── Section header ── */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="mb-0.5 flex items-center gap-2">
            <UserMinus size={13} className="text-rose-500" />
            <span className="text-xs font-semibold uppercase tracking-widest text-rose-500 dark:text-rose-400">
              Subscriber health
            </span>
          </div>
          <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">Churn rate analysis</h2>
          <p className="mt-0.5 text-xs text-gray-400 dark:text-gray-500">
            Monthly subscriber loss, broken down by cause and trend
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {[3, 6, 12].map((m) => (
            <button
              key={m}
              onClick={() => setPeriod(m)}
              className={`rounded-lg border px-2.5 py-1 text-xs font-medium transition-colors ${
                period === m
                  ? 'border-rose-200 bg-rose-50 text-rose-600 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-400'
                  : 'border-gray-200 bg-white text-gray-500 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800'
              }`}
            >
              {m}M
            </button>
          ))}
          <button
            onClick={fetchChurn}
            disabled={loading}
            className="flex h-7 w-7 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-400 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-500 dark:hover:bg-gray-800"
          >
            <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* ── Error state ── */}
      {error && !loading && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-center dark:border-rose-500/20 dark:bg-rose-500/5">
          <AlertTriangle size={24} className="mx-auto mb-2 text-rose-500" />
          <p className="mb-1 text-sm font-semibold text-gray-900 dark:text-gray-100">Couldn't load churn data</p>
          <p className="mb-4 text-xs text-gray-500 dark:text-gray-400">
            Make sure <code className="rounded bg-rose-100 px-1 text-rose-600 dark:bg-gray-800 dark:text-rose-400">/api/subscriber_churn_stats</code> is
            available and returns the expected shape.
          </p>
          <button
            onClick={fetchChurn}
            className="rounded-lg border border-rose-200 bg-rose-100 px-4 py-1.5 text-xs font-semibold text-rose-600 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-400"
          >
            Retry
          </button>
        </div>
      )}

      {!error && (
        <>
          {/* ── KPI strip ── */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {/* Churn rate — focal card */}
            <motion.div
              whileHover={{ y: -2 }}
              className="relative overflow-hidden rounded-2xl border p-4 sm:col-span-2"
              style={{ background: `${colour.hex}0d`, borderColor: `${colour.hex}28` }}
            >
              <div className="mb-2.5 flex items-start justify-between">
                <div
                  className="flex h-9 w-9 items-center justify-center rounded-xl"
                  style={{ background: `${colour.hex}1c`, border: `1px solid ${colour.hex}30` }}
                >
                  <TrendingDown size={16} style={{ color: colour.hex }} />
                </div>
                <span
                  className="rounded-full px-2.5 py-1 text-xs font-semibold"
                  style={{ background: `${colour.hex}18`, color: colour.hex }}
                >
                  {colour.label}
                </span>
              </div>

              {loading ? <Skel w="w-28" h="h-9" /> : (
                <>
                  <p className="text-3xl font-semibold tabular-nums tracking-tight" style={{ color: colour.hex }}>
                    {pct(rate)}
                  </p>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">Monthly churn rate</p>
                  <p className="mt-0.5 text-xs text-gray-400 dark:text-gray-500">
                    {num(data?.churned_this_month)} lost of {num(data?.total_start_of_month)} subscribers
                  </p>
                </>
              )}
            </motion.div>

            {/* Retained */}
            <motion.div
              whileHover={{ y: -2 }}
              className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900"
            >
              <div className="mb-2.5 flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 dark:bg-emerald-500/10">
                <UserCheck size={14} className="text-emerald-600 dark:text-emerald-400" />
              </div>
              {loading ? <Skel w="w-16" h="h-7" /> : (
                <>
                  <p className="text-2xl font-semibold tabular-nums text-gray-900 dark:text-gray-50">
                    {num(data?.retained)}
                  </p>
                  <p className="mt-0.5 text-xs text-gray-400 dark:text-gray-500">Retained this month</p>
                </>
              )}
            </motion.div>

            {/* New subs */}
            <motion.div
              whileHover={{ y: -2 }}
              className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900"
            >
              <div className="mb-2.5 flex h-8 w-8 items-center justify-center rounded-lg bg-sky-50 dark:bg-sky-500/10">
                <TrendingUp size={14} className="text-sky-600 dark:text-sky-400" />
              </div>
              {loading ? <Skel w="w-16" h="h-7" /> : (
                <>
                  <p className="text-2xl font-semibold tabular-nums text-gray-900 dark:text-gray-50">
                    {num(data?.new_this_month)}
                  </p>
                  <p className="mt-0.5 text-xs text-gray-400 dark:text-gray-500">New this month</p>
                </>
              )}
            </motion.div>
          </div>

          {/* ── Formula + trend chart ── */}
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
            {/* Left — formula + criteria */}
            <div className="space-y-3">
              {!loading && data && (
                <Formula churned={data.churned_this_month} total={data.total_start_of_month} rate={rate} />
              )}
              {loading && <Skel w="w-full" h="h-16" />}

              <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
                <button
                  onClick={() => setShowHow((v) => !v)}
                  className="flex w-full items-center justify-between px-3.5 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100"
                >
                  <span className="flex items-center gap-2">
                    <HelpCircle size={14} className="text-amber-500" />
                    How we define churn
                  </span>
                  {showHow
                    ? <ChevronUp size={14} className="text-gray-400" />
                    : <ChevronDown size={14} className="text-gray-400" />}
                </button>

                <AnimatePresence>
                  {showHow && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.22 }}
                      className="overflow-hidden"
                    >
                      <div className="space-y-2 px-3.5 pb-3.5">
                        <p className="text-xs leading-relaxed text-gray-500 dark:text-gray-400">
                          A subscriber is marked as <strong className="text-rose-500 dark:text-rose-400">churned</strong> when
                          any of the following occur:
                        </p>
                        <CriteriaPill
                          icon={WifiOff}
                          colour="#f43f5e"
                          title="Offline for more than 30 days"
                          description="No connection to the network for ≥ 30 consecutive days — the subscription likely lapsed without renewal."
                        />
                        <CriteriaPill
                          icon={Clock}
                          colour="#f59e0b"
                          title="Subscription expired, not renewed"
                          description="Package expiry has passed and no payment was received within a 7-day grace window."
                        />
                        <CriteriaPill
                          icon={Trash2}
                          colour="#8b5cf6"
                          title="Account deleted by admin"
                          description="Removed from the system, typically after repeated non-payment or a cancellation request."
                        />
                        <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 dark:border-amber-500/20 dark:bg-amber-500/5">
                          <p className="text-xs leading-relaxed text-amber-700 dark:text-amber-300">
                            <strong>Benchmark:</strong> a healthy monthly churn rate for an ISP is{' '}
                            <span className="font-semibold">below 3%</span>. Rates above{' '}
                            <span className="font-semibold text-rose-600 dark:text-rose-400">5%</span> need
                            immediate attention — that's roughly 60% of your base lost within a year.
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="rounded-xl border border-gray-200 bg-white p-3.5 dark:border-gray-800 dark:bg-gray-900">
                <p className="mb-2.5 text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                  Churn breakdown (this month)
                </p>
                {loading ? (
                  <div className="space-y-2">
                    {[1, 2, 3].map((i) => <Skel key={i} w="w-full" h="h-6" />)}
                  </div>
                ) : (
                  <ReactApexChart options={breakdownOptions} series={breakdownSeries} type="bar" height={140} />
                )}
              </div>
            </div>

            {/* Right — trend line chart */}
            <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900 lg:col-span-2">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                    Churn rate vs new subscriber growth
                  </p>
                  <p className="mt-0.5 text-[11px] text-gray-400 dark:text-gray-500">
                    Dashed green = new subs · Solid red = churn · Threshold lines at 5% and 10%
                  </p>
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-400 dark:text-gray-500">
                  <span className="flex items-center gap-1.5">
                    <span className="block h-0.5 w-4 rounded bg-rose-500" />
                    Churn %
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="block h-0.5 w-4 rounded border-t border-dashed border-emerald-500" />
                    New subs
                  </span>
                </div>
              </div>

              {loading ? (
                <div className="flex h-56 items-center justify-center">
                  <RefreshCw size={22} className="animate-spin text-gray-300 dark:text-gray-600" />
                </div>
              ) : history.length < 2 ? (
                <div className="flex h-56 flex-col items-center justify-center text-gray-400 dark:text-gray-500">
                  <Info size={22} className="mb-2" />
                  <p className="text-sm">Not enough history to plot a trend.</p>
                  <p className="mt-1 text-xs text-gray-300 dark:text-gray-600">At least 2 months of data are needed.</p>
                </div>
              ) : (
                <ReactApexChart options={chartOptions} series={chartSeries} type="line" height={260} />
              )}
            </div>
          </div>

          {/* ── Health summary bar ── */}
          {!loading && data && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900"
            >
              <div className="mb-2.5 flex flex-wrap items-center justify-between gap-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                  Subscriber composition this month
                </p>
                <p className="text-xs tabular-nums text-gray-400 dark:text-gray-500">
                  Total at period start: {num(data.total_start_of_month)}
                </p>
              </div>

              <div className="flex h-3 gap-0.5 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                {(() => {
                  const total = data.total_start_of_month || 1;
                  const retPct = ((data.retained / total) * 100).toFixed(1);
                  const newPct = ((data.new_this_month / total) * 100).toFixed(1);
                  const churnPct = ((data.churned_this_month / total) * 100).toFixed(1);
                  return (
                    <>
                      <motion.div
                        initial={{ width: 0 }} animate={{ width: `${retPct}%` }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                        className="h-full bg-emerald-500" title={`Retained: ${retPct}%`}
                      />
                      <motion.div
                        initial={{ width: 0 }} animate={{ width: `${newPct}%` }}
                        transition={{ duration: 0.8, delay: 0.1, ease: 'easeOut' }}
                        className="h-full bg-sky-500" title={`New: ${newPct}%`}
                      />
                      <motion.div
                        initial={{ width: 0 }} animate={{ width: `${churnPct}%` }}
                        transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
                        className="h-full bg-rose-500" title={`Churned: ${churnPct}%`}
                      />
                    </>
                  );
                })()}
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1.5">
                {[
                  { label: 'Retained', value: data.retained, dot: 'bg-emerald-500' },
                  { label: 'New', value: data.new_this_month, dot: 'bg-sky-500' },
                  { label: 'Churned', value: data.churned_this_month, dot: 'bg-rose-500' },
                ].map((s) => (
                  <div key={s.label} className="flex items-center gap-1.5">
                    <div className={`h-2 w-2 rounded-full ${s.dot}`} />
                    <span className="text-xs text-gray-400 dark:text-gray-500">{s.label}</span>
                    <span className="text-xs font-semibold tabular-nums text-gray-800 dark:text-gray-100">{num(s.value)}</span>
                    <span className="text-xs tabular-nums text-gray-300 dark:text-gray-600">
                      ({pct((s.value / (data.total_start_of_month || 1)) * 100)})
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </>
      )}
    </motion.section>
  );
}