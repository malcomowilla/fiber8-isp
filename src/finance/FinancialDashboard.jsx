// src/components/dashboard/SimpleBookkeeping.jsx
// Replaces the previous revenue/expense/asset/liability ledger with
// PPPoE + hotspot payment stats and a per-gateway breakdown.
import { useState, useEffect, useCallback, useMemo } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import {
  Router, Wifi, RefreshCw, TrendingUp, TrendingDown, Minus,
  Users, Package, Clock, Trophy, ArrowUpRight, ArrowDownRight,
  Landmark, Smartphone, Zap, AlertCircle, ChevronRight,
} from 'lucide-react';
import {
  ResponsiveContainer, ComposedChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
} from 'recharts';

/* ────────────────────────────────────────────────────────────────────────
   Config — these MUST match routes.rb exactly. The previous version guessed
   RESTful nested paths (e.g. /api/hotspot_mpesa_revenues/revenue_summary)
   that don't exist as routes — they silently 404'd and fell through to the
   `show` action (id = "revenue_summary"), which has no handler. That's why
   the dashboard was stuck on sample data. Fixed to the real routes below.
   ──────────────────────────────────────────────────────────────────────── */
const EP = {
  hotspotSummary: '/api/revenue_summary',
  pppoeSummary: '/api/ppoe_mpesa_revenue_summary',
  hotspotList: '/api/hotspot_mpesa_revenues',
  pppoeList: '/api/pp_poe_mpesa_revenues',
  hotspotTopCustomers: '/api/top_hotspot_users',
  pppoeTopCustomers: '/api/top_pppoe_users', // NEW — add to routes.rb, see chat
  hotspotPopularPackage: '/api/most_popular_package',
  pppoePopularPackage: '/api/pppoe_most_popular_package', // NEW — add to routes.rb, see chat
  hotspotPeakHour: '/api/peak_hour',
  hotspotBestDay: '/api/best_day_summary',
  hotspotFunnel: '/api/hotspot_payment_funnel',
};

const RANGES = [
  { id: 'today', label: 'Today' },
  { id: 'this_week', label: 'This week' },
  { id: 'this_month', label: 'This month' },
  { id: 'all_time', label: 'All time' },
];

/* Gateway taxonomy — normalises whatever `payment_method` string lands in
   the DB (mpesa API push, the no-API "phone number" flow, Tuma, cash…)
   into a consistent rail for the breakdown view. */
const GATEWAYS = {
  mpesa_api: { label: 'M-Pesa API', sub: 'Daraja · your paybill', dot: 'bg-emerald-500', text: 'text-emerald-700', bg: 'bg-emerald-50', ring: 'ring-emerald-100' },
  tuma: { label: 'Tuma', sub: 'Aggregator payout', dot: 'bg-violet-500', text: 'text-violet-700', bg: 'bg-violet-50', ring: 'ring-violet-100' },
  no_api_phone: { label: 'Phone number', sub: 'No API keys · 1% fee', dot: 'bg-amber-500', text: 'text-amber-700', bg: 'bg-amber-50', ring: 'ring-amber-100' },
  cash: { label: 'Cash', sub: 'Manual entry', dot: 'bg-slate-400', text: 'text-slate-600', bg: 'bg-slate-50', ring: 'ring-slate-200' },
  other: { label: 'Other', sub: 'Unclassified', dot: 'bg-slate-300', text: 'text-slate-500', bg: 'bg-slate-50', ring: 'ring-slate-200' },
};

function normalizeGateway(method) {
  const m = (method || '').toString().toLowerCase();
  if (!m) return 'other';
  if (m.includes('tuma')) return 'tuma';
  if (m.includes('phone') || m.includes('no_api') || m.includes('manual_stk')) return 'no_api_phone';
  if (m.includes('cash')) return 'cash';
  if (m.includes('mpesa') || m.includes('api') || m.includes('daraja')) return 'mpesa_api';
  return 'other';
}

/* ── formatting helpers ─────────────────────────────────────────────── */
function fmtKES(n) {
  const v = Number(n) || 0;
  return `KES ${v.toLocaleString('en-KE', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}
function fmtCompact(n) {
  const v = Number(n) || 0;
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000) return `${(v / 1_000).toFixed(1)}K`;
  return v.toFixed(0);
}
function pct(part, whole) {
  if (!whole) return 0;
  return Math.round((part / whole) * 1000) / 10;
}

/* ── sample data — only used per-section, as a last resort, if that
   specific endpoint fails. Never used to replace data that DID load. ──── */
const SAMPLE = {
  hotspot: { today: 4820, this_week: 26100, this_month: 98450, all_time: 1284300, this_year: 612000 },
  pppoe: { today: 12600, this_week: 61200, this_month: 241800, all_time: 2091500, this_year: 1180000 },
  last7: Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (6 - i));
    return {
      date: d.toISOString().slice(5, 10),
      Hotspot: Math.round(3000 + Math.random() * 4000),
      PPPoE: Math.round(7000 + Math.random() * 6000),
    };
  }),
  gatewayRecords: [
    ...Array.from({ length: 34 }).map(() => ({ amount: 300 + Math.random() * 900, payment_method: 'mpesa_api' })),
    ...Array.from({ length: 14 }).map(() => ({ amount: 200 + Math.random() * 600, payment_method: 'no_api_phone' })),
    ...Array.from({ length: 9 }).map(() => ({ amount: 500 + Math.random() * 1500, payment_method: 'tuma' })),
    ...Array.from({ length: 3 }).map(() => ({ amount: 400 + Math.random() * 300, payment_method: 'cash' })),
  ],
  hotspotTopCustomers: [
    { rank: 1, name: 'James Mwangi', phone: '0712•••432', purchases: 18, spent: 5400, last_payment_at: 'Aug 06, 2026 at 07:12 PM' },
    { rank: 2, name: 'Faith Achieng', phone: '0722•••108', purchases: 15, spent: 4200, last_payment_at: 'Aug 06, 2026 at 05:44 PM' },
    { rank: 3, name: 'Peter Kiptoo', phone: '0798•••920', purchases: 11, spent: 3300, last_payment_at: 'Aug 05, 2026 at 09:03 PM' },
  ],
  pppoeTopCustomers: [
    { rank: 1, name: 'Grace Wanjiru', phone: '0733•••221', purchases: 6, spent: 21600, last_payment_at: 'Aug 07, 2026 at 08:00 AM' },
    { rank: 2, name: 'Samuel Otieno', phone: '0711•••556', purchases: 5, spent: 18000, last_payment_at: 'Aug 06, 2026 at 07:30 AM' },
    { rank: 3, name: 'Lucy Nduta', phone: '0700•••884', purchases: 5, spent: 15000, last_payment_at: 'Aug 04, 2026 at 06:10 AM' },
  ],
  hotspotPackage: { package: '24-Hour Unlimited', vouchers_sold: 212, total_revenue: 63600 },
  pppoePackage: { package: '10Mbps Home Fibre', package_sold: 84, total_revenue: 168000 },
  peakHour: { time: '07:00 PM', vouchers_sold: 41, total_revenue: 12300 },
  bestDay: { day_name: 'Saturday · 02 Aug', total_revenue: 18900, vouchers_sold: 63 },
  funnel: { total_attempts: 210, completed: 148, pending: 22, cancelled: 18, abandoned: 22, conversion_rate: 70.5 },
};

/* ── small presentational pieces ───────────────────────────────────────── */

function Trend({ current, previous }) {
  if (previous === undefined || previous === null) return null;
  const diff = current - previous;
  const change = previous ? Math.round((diff / previous) * 1000) / 10 : 0;
  if (diff === 0) {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-400">
        <Minus size={12} /> flat
      </span>
    );
  }
  const up = diff > 0;
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-medium ${up ? 'text-emerald-600' : 'text-rose-600'}`}>
      {up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
      {Math.abs(change)}% vs yesterday
    </span>
  );
}

function StatCard({ icon: Icon, label, value, accent, sub }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
      <div className="flex items-center justify-between mb-3">
        <span className={`w-9 h-9 rounded-xl flex items-center justify-center ${accent}`}>
          <Icon size={16} />
        </span>
      </div>
      <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">{label}</p>
      <p className="text-2xl font-semibold text-slate-900 tabular-nums tracking-tight mt-1">{value}</p>
      {sub && <div className="mt-1.5">{sub}</div>}
    </div>
  );
}

function ServicePanel({ title, icon: Icon, accentText, accentBg, data, range, loading, isSample }) {
  const value = data ? data[range] : null;
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="flex items-center gap-2.5 mb-4">
        <span className={`w-8 h-8 rounded-lg flex items-center justify-center ${accentBg} ${accentText}`}>
          <Icon size={15} />
        </span>
        <p className="text-sm font-semibold text-slate-900">{title}</p>
        {isSample && (
          <span className="text-[10px] font-medium text-amber-600 bg-amber-50 rounded-full px-2 py-0.5 ml-auto">
            sample
          </span>
        )}
      </div>

      <p className="text-[11px] uppercase tracking-wide text-slate-400 font-medium">
        {RANGES.find((r) => r.id === range)?.label}
      </p>
      <p className="text-3xl font-semibold text-slate-900 tabular-nums tracking-tight mt-1 mb-4">
        {loading ? <span className="inline-block h-8 w-32 bg-slate-100 rounded animate-pulse" /> : fmtKES(value)}
      </p>

      <div className="grid grid-cols-4 gap-2 border-t border-slate-100 pt-3">
        {RANGES.map((r) => (
          <div key={r.id}>
            <p className="text-[10px] text-slate-400">{r.label}</p>
            <p className="text-xs font-semibold text-slate-700 tabular-nums">
              {data ? fmtCompact(data[r.id]) : '—'}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function GatewayBar({ segments, total }) {
  return (
    <div className="w-full h-3 rounded-full overflow-hidden flex bg-slate-100">
      {segments.map((s) => (
        <div
          key={s.id}
          className={`${GATEWAYS[s.id].dot} h-full transition-all duration-500`}
          style={{ width: `${pct(s.amount, total)}%` }}
          title={`${GATEWAYS[s.id].label}: ${fmtKES(s.amount)}`}
        />
      ))}
    </div>
  );
}

function TopCustomersTable({ rows, loading }) {
  if (loading) {
    return <div className="p-6 text-center text-sm text-slate-400">Loading customers…</div>;
  }
  if (!rows?.length) {
    return <div className="p-6 text-center text-sm text-slate-400">No purchases in this period yet</div>;
  }
  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="text-left text-[11px] uppercase tracking-wide text-slate-400">
          <th className="pb-2 font-medium">#</th>
          <th className="pb-2 font-medium">Customer</th>
          <th className="pb-2 font-medium text-right">Orders</th>
          <th className="pb-2 font-medium text-right">Spent</th>
          <th className="pb-2 font-medium text-right hidden sm:table-cell">Last payment</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((c) => (
          <tr key={c.rank} className="border-t border-slate-100">
            <td className="py-2.5 text-slate-400 font-medium">{c.rank}</td>
            <td className="py-2.5">
              <p className="font-medium text-slate-900">{c.name || 'Unnamed'}</p>
              <p className="text-xs text-slate-400">{c.phone}</p>
            </td>
            <td className="py-2.5 text-right tabular-nums text-slate-600">{c.purchases}</td>
            <td className="py-2.5 text-right tabular-nums font-semibold text-slate-900">{fmtKES(c.spent)}</td>
            <td className="py-2.5 text-right text-xs text-slate-400 hidden sm:table-cell">{c.last_payment_at}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/* ── main component ─────────────────────────────────────────────────── */

export default function SimpleBookkeeping() {
  const [range, setRange] = useState('this_month');
  const [customerTab, setCustomerTab] = useState('hotspot');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [failedKeys, setFailedKeys] = useState([]); // which sources fell back to sample

  const [hotspotSummary, setHotspotSummary] = useState(null);
  const [pppoeSummary, setPppoeSummary] = useState(null);
  const [last7, setLast7] = useState(null);
  const [gatewayRecords, setGatewayRecords] = useState(null);
  const [hotspotTopCustomers, setHotspotTopCustomers] = useState(null);
  const [pppoeTopCustomers, setPppoeTopCustomers] = useState(null);
  const [hotspotPackage, setHotspotPackage] = useState(null);
  const [pppoePackage, setPppoePackage] = useState(null);
  const [peakHour, setPeakHour] = useState(null);
  const [bestDay, setBestDay] = useState(null);
  const [funnel, setFunnel] = useState(null);

  const subdomain = typeof window !== 'undefined' ? window.location.hostname.split('.')[0] : '';

  const load = useCallback(async () => {
    const headers = { 'X-Subdomain': subdomain };
    const get = (url) =>
      fetch(url, { headers }).then((r) => (r.ok ? r.json() : Promise.reject(new Error(`${url} → ${r.status}`))));

    // Named sources instead of positional indices — makes it obvious in devtools
    // exactly which endpoint failed, and lets each one fall back independently
    // instead of one bad endpoint blanking the entire dashboard.
    const sources = [
      { key: 'hotspotSummary', fn: () => get(EP.hotspotSummary) },
      { key: 'pppoeSummary', fn: () => get(EP.pppoeSummary) },
      { key: 'hotspotList', fn: () => get(EP.hotspotList) },
      { key: 'pppoeList', fn: () => get(EP.pppoeList) },
      { key: 'hotspotTopCustomers', fn: () => get(EP.hotspotTopCustomers) },
      { key: 'pppoeTopCustomers', fn: () => get(EP.pppoeTopCustomers) },
      { key: 'hotspotPackage', fn: () => get(EP.hotspotPopularPackage) },
      { key: 'pppoePackage', fn: () => get(EP.pppoePopularPackage) },
      { key: 'peakHour', fn: () => get(EP.hotspotPeakHour) },
      { key: 'bestDay', fn: () => get(EP.hotspotBestDay) },
      { key: 'funnel', fn: () => get(EP.hotspotFunnel) },
    ];

    const results = await Promise.allSettled(sources.map((s) => s.fn()));
    const byKey = {};
    const failed = [];
    results.forEach((r, i) => {
      const key = sources[i].key;
      if (r.status === 'fulfilled') {
        byKey[key] = r.value;
      } else {
        failed.push(key);
        console.warn(`[SimpleBookkeeping] ${key} failed:`, r.reason);
      }
    });
    setFailedKeys(failed);

    // hotspot summary
    if (byKey.hotspotSummary) {
      const hs = byKey.hotspotSummary.summary || byKey.hotspotSummary;
      setHotspotSummary(hs);
      const h7 = byKey.hotspotSummary.last_7_days || [];
      const merged = h7.map((d) => ({ date: d.date, Hotspot: d.revenue, PPPoE: 0 }));
      setLast7((prev) => (merged.length ? mergeLast7(merged, prev, 'Hotspot') : prev));
    } else {
      setHotspotSummary(SAMPLE.hotspot);
    }

    // pppoe summary
    if (byKey.pppoeSummary) {
      const ps = byKey.pppoeSummary.summary || byKey.pppoeSummary;
      setPppoeSummary(ps);
      const p7 = byKey.pppoeSummary.last_7_days || [];
      const merged = p7.map((d) => ({ date: d.date, PPPoE: d.revenue }));
      setLast7((prev) => (merged.length ? mergeLast7(merged, prev, 'PPPoE') : prev));
    } else {
      setPppoeSummary(SAMPLE.pppoe);
    }

    if (!byKey.hotspotSummary && !byKey.pppoeSummary) {
      setLast7(SAMPLE.last7);
    }

    // gateway breakdown — combine whichever of the two record lists loaded
    const hotspotRecs = Array.isArray(byKey.hotspotList) ? byKey.hotspotList : [];
    const pppoeRecs = Array.isArray(byKey.pppoeList) ? byKey.pppoeList : [];
    if (hotspotRecs.length || pppoeRecs.length) {
      setGatewayRecords([...hotspotRecs, ...pppoeRecs]);
    } else {
      setGatewayRecords(SAMPLE.gatewayRecords);
    }

    setHotspotTopCustomers(byKey.hotspotTopCustomers || SAMPLE.hotspotTopCustomers);
    setPppoeTopCustomers(byKey.pppoeTopCustomers || SAMPLE.pppoeTopCustomers);
    setHotspotPackage(byKey.hotspotPackage || SAMPLE.hotspotPackage);
    setPppoePackage(byKey.pppoePackage || SAMPLE.pppoePackage);
    setPeakHour(byKey.peakHour || SAMPLE.peakHour);
    setBestDay(byKey.bestDay || SAMPLE.bestDay);
    setFunnel(byKey.funnel || SAMPLE.funnel);
  }, [subdomain]);

  useEffect(() => {
    setLoading(true);
    load().finally(() => setLoading(false));
  }, [load]);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await load();
      toast.success('Dashboard refreshed');
    } catch {
      toast.error('Could not refresh — showing last known data');
    } finally {
      setRefreshing(false);
    }
  };

  const gatewayBreakdown = useMemo(() => {
    if (!gatewayRecords) return { segments: [], total: 0 };
    const totals = {};
    let total = 0;
    gatewayRecords.forEach((rec) => {
      const id = normalizeGateway(rec.payment_method);
      const amt = Number(rec.amount) || 0;
      totals[id] = (totals[id] || 0) + amt;
      total += amt;
    });
    const segments = Object.entries(totals)
      .map(([id, amount]) => ({ id, amount, count: gatewayRecords.filter((r) => normalizeGateway(r.payment_method) === id).length }))
      .sort((a, b) => b.amount - a.amount);
    return { segments, total };
  }, [gatewayRecords]);

  const combinedTotal = (hotspotSummary?.[range] || 0) + (pppoeSummary?.[range] || 0);
  const usingSample = failedKeys.length > 0;

  return (
    <div className="min-h-screen  font-sans">
      <Toaster />
      <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-xl font-semibold text-slate-900 tracking-tight">Payments dashboard</h1>
            <p className="text-sm text-slate-500 mt-0.5">Revenue across PPPoE and hotspot, broken down by collection rail</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-white border border-slate-200 rounded-xl p-1">
              {RANGES.map((r) => (
                <button
                  key={r.id}
                  onClick={() => setRange(r.id)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                    range === r.id ? 'bg-slate-900 text-white' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="w-9 h-9 flex items-center justify-center rounded-xl border border-slate-200 bg-white
               text-slate-500 hover:text-slate-900 hover:border-slate-300 transition-colors disabled:opacity-50"
              title="Refresh"
            >
              <RefreshCw size={15} className={refreshing ? 'animate-spin' : ''} />
            </button>
          </div>
        </div>

        {usingSample && (
          <div className="flex items-center gap-2 text-xs text-amber-700 bg-amber-50 border border-amber-100 rounded-xl px-3.5 py-2.5 mb-6">
            <AlertCircle size={14} className="shrink-0" />
            {failedKeys.length} of 11 endpoints didn't respond ({failedKeys.join(', ')}) — those sections show sample figures until the API is reachable.
          </div>
        )}

        {/* Top summary strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          <StatCard
            icon={Landmark}
            label={`Combined · ${RANGES.find((r) => r.id === range)?.label}`}
            value={fmtKES(combinedTotal)}
            accent="bg-slate-900 text-white"
          />
          <StatCard
            icon={Router}
            label="PPPoE revenue"
            value={fmtKES(pppoeSummary?.[range])}
            accent="bg-sky-50 text-sky-600"
          />
          <StatCard
            icon={Wifi}
            label="Hotspot revenue"
            value={fmtKES(hotspotSummary?.[range])}
            accent="bg-teal-50 text-teal-600"
            sub={hotspotSummary?.today !== undefined ? <Trend current={hotspotSummary.today} previous={hotspotSummary.yesterday} /> : null}
          />

          <StatCard
            icon={Zap}
            label="Active gateways"
            value={gatewayBreakdown.segments.length || '—'}
            accent="bg-indigo-50 text-indigo-600"
          />
        </div>

        {/* Service panels */}
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <ServicePanel title="PPPoE" icon={Router} accentText="text-sky-600" accentBg="bg-sky-50" data={pppoeSummary} range={range} loading={loading} isSample={failedKeys.includes('pppoeSummary')} />
          <ServicePanel title="Hotspot" icon={Wifi} accentText="text-teal-600" accentBg="bg-teal-50" data={hotspotSummary} range={range} loading={loading} isSample={failedKeys.includes('hotspotSummary')} />
        </div>

        {/* Last 7 days chart */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 mb-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-semibold text-slate-900">Last 7 days</p>
            <div className="flex items-center gap-4 text-xs text-slate-500">
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-sky-500" /> PPPoE</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-teal-500" /> Hotspot</span>
            </div>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={last7 || []} barGap={4}>
                <CartesianGrid vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={fmtCompact} width={40} />
                <Tooltip
                  formatter={(v) => fmtKES(v)}
                  contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }}
                />
                <Bar dataKey="PPPoE" fill="#0ea5e9" radius={[4, 4, 0, 0]} maxBarSize={22} />
                <Bar dataKey="Hotspot" fill="#14b8a6" radius={[4, 4, 0, 0]} maxBarSize={22} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gateway breakdown */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 mb-6">
          <div className="flex items-center justify-between mb-1">
            <p className="text-sm font-semibold text-slate-900">Revenue by gateway</p>
            <p className="text-xs text-slate-400">{fmtKES(gatewayBreakdown.total)} total</p>
          </div>
          <p className="text-xs text-slate-500 mb-4">How money is being collected, across PPPoE and hotspot combined</p>

          <GatewayBar segments={gatewayBreakdown.segments} total={gatewayBreakdown.total} />

          <div className="grid sm:grid-cols-3 gap-3 mt-4">
            {gatewayBreakdown.segments.length === 0 && !loading && (
              <p className="text-sm text-slate-400 sm:col-span-3 text-center py-4">No transactions recorded yet</p>
            )}
            {gatewayBreakdown.segments.map((s) => {
              const g = GATEWAYS[s.id];
              return (
                <div key={s.id} className={`rounded-xl p-3.5 ring-1 ${g.bg} ${g.ring}`}>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className={`w-2 h-2 rounded-full ${g.dot}`} />
                    <p className={`text-xs font-semibold ${g.text}`}>{g.label}</p>
                  </div>
                  <p className="text-lg font-semibold text-slate-900 tabular-nums">{fmtKES(s.amount)}</p>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-[11px] text-slate-500">{s.count} transactions</p>
                    <p className="text-[11px] font-medium text-slate-500">{pct(s.amount, gatewayBreakdown.total)}%</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Insight cards */}
        <div className="grid sm:grid-cols-3 gap-4 mb-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="flex items-center gap-2 text-slate-400 mb-2">
              <Clock size={14} /> <p className="text-[11px] uppercase tracking-wide font-medium">Peak hour · hotspot</p>
            </div>
            <p className="text-xl font-semibold text-slate-900">{peakHour?.time || '—'}</p>
            <p className="text-xs text-slate-500 mt-1">{peakHour ? `${peakHour.vouchers_sold} vouchers · ${fmtKES(peakHour.total_revenue)}` : 'No data yet'}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="flex items-center gap-2 text-slate-400 mb-2">
              <Trophy size={14} /> <p className="text-[11px] uppercase tracking-wide font-medium">Best day · hotspot</p>
            </div>
            <p className="text-xl font-semibold text-slate-900">{bestDay?.day_name || '—'}</p>
            <p className="text-xs text-slate-500 mt-1">{bestDay ? `${fmtKES(bestDay.total_revenue)} · ${bestDay.vouchers_sold} vouchers` : 'No data yet'}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="flex items-center gap-2 text-slate-400 mb-2">
              <Package size={14} /> <p className="text-[11px] uppercase tracking-wide font-medium">Top packages</p>
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500 flex items-center gap-1.5"><Router size={11} className="text-sky-500" /> {pppoePackage?.package || '—'}</span>
                <span className="text-xs font-semibold text-slate-900">{pppoePackage ? fmtKES(pppoePackage.total_revenue) : ''}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500 flex items-center gap-1.5"><Wifi size={11} className="text-teal-500" /> {hotspotPackage?.package || '—'}</span>
                <span className="text-xs font-semibold text-slate-900">{hotspotPackage ? fmtKES(hotspotPackage.total_revenue) : ''}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment funnel — hotspot */}
        {funnel && (
          <div className="rounded-2xl border border-slate-200 bg-white p-5 mb-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-semibold text-slate-900">Hotspot payment funnel</p>
              <p className="text-xs font-medium text-emerald-600">{funnel.conversion_rate}% conversion</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {[
                { label: 'Attempts', value: funnel.total_attempts, color: 'text-slate-900' },
                { label: 'Completed', value: funnel.completed, color: 'text-emerald-600' },
                { label: 'Pending', value: funnel.pending, color: 'text-amber-600' },
                { label: 'Cancelled', value: funnel.cancelled, color: 'text-rose-600' },
                { label: 'Abandoned', value: funnel.abandoned, color: 'text-slate-400' },
              ].map((f) => (
                <div key={f.label} className="rounded-xl bg-slate-50 p-3">
                  <p className="text-[11px] text-slate-400">{f.label}</p>
                  <p className={`text-lg font-semibold tabular-nums ${f.color}`}>{f.value}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Top customers */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Users size={15} className="text-slate-400" />
              <p className="text-sm font-semibold text-slate-900">Top customers</p>
            </div>
            <div className="flex items-center bg-slate-100 rounded-lg p-0.5">
              <button
                onClick={() => setCustomerTab('hotspot')}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${customerTab === 'hotspot' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500'}`}
              >
                Hotspot
              </button>
              <button
                onClick={() => setCustomerTab('pppoe')}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${customerTab === 'pppoe' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500'}`}
              >
                PPPoE
              </button>
            </div>
          </div>
          <TopCustomersTable rows={customerTab === 'hotspot' ? hotspotTopCustomers : pppoeTopCustomers} loading={loading} />
        </div>

      </div>
    </div>
  );
}

/* Merges a new single-series last-7-days array into whatever's already in
   state (which may hold the other series), keyed by date, instead of one
   summary call stomping the other's series with zeros. */
function mergeLast7(newSeries, prevCombined, key) {
  const base = Array.isArray(prevCombined) && prevCombined.length ? prevCombined : newSeries.map((d) => ({ date: d.date, Hotspot: 0, PPPoE: 0 }));
  const byDate = Object.fromEntries(base.map((d) => [d.date, { ...d }]));
  newSeries.forEach((d) => {
    if (!byDate[d.date]) byDate[d.date] = { date: d.date, Hotspot: 0, PPPoE: 0 };
    byDate[d.date][key] = d[key];
  });
  return Object.values(byDate).sort((a, b) => (a.date > b.date ? 1 : -1));
}