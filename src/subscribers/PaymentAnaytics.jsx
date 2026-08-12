// app/javascript/components/DailyRevenueDashboard.jsx
import React, { useState, useEffect, useCallback } from 'react';
import ReactApexChart from 'react-apexcharts';
import {
  TrendingUp, Calendar, RefreshCw, BarChart3,
  Download, Upload, ArrowUpRight, ArrowDownRight,
  Wallet, Clock, Activity, CreditCard
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { Box, Button, Chip, Typography } from '@mui/material';
import { FaRegCheckCircle, FaRegTimesCircle } from "react-icons/fa";
import { format, subMonths, startOfMonth, endOfMonth } from 'date-fns';
import { useApplicationSettings } from '../settings/ApplicationSettings';
import MaterialTable from "material-table";
import { motion, AnimatePresence } from 'framer-motion';

import { ThemeProvider, createTheme } from '@mui/material/styles';

import { useMemo } from 'react';





/* ─── Helpers ─────────────────────────────────────────────────── */
const formatKES = (amount = 0) =>
  new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES', maximumFractionDigits: 0 }).format(amount);

const last3Months = () => {
  const now = new Date();
  return [2, 1, 0].map(offset => {
    const d = subMonths(now, offset);
    return {
      label: format(d, 'MMMM yyyy'),
      shortLabel: format(d, 'MMM'),
      month: d.getMonth() + 1,
      year: d.getFullYear(),
      start: startOfMonth(d).toISOString().split('T')[0],
      end: endOfMonth(d).toISOString().split('T')[0],
    };
  });
};








/* ─── Animation variants ──────────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.07, duration: 0.45, ease: 'easeOut' } }),
};

const ACCENT = '#16C784';
const ACCENT2 = '#3B82F6';

/* ─── Stat Card ───────────────────────────────────────────────── */
const StatCard = ({ title, value, sub, icon: Icon, iconColor, trend, index }) => {
  const trendUp = trend >= 0;
  return (
    <motion.div
      custom={index}
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      className="relative bg-white dark:bg-[#0F1623] border border-slate-200 dark:border-white/[0.07] rounded-2xl p-5 flex flex-col gap-3 overflow-hidden group hover:border-slate-300 dark:hover:border-white/20 transition-all duration-300"
    >
      {/* subtle glow */}
      <div className="absolute -top-8 -right-8 w-28 h-28 rounded-full blur-2xl opacity-10 group-hover:opacity-20 transition-opacity"
        style={{ background: iconColor }} />

      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold tracking-widest uppercase text-gray-500">{title}</span>
        <span className="p-2 rounded-xl" style={{ background: `${iconColor}18` }}>
          <Icon size={16} style={{ color: iconColor }} />
        </span>
      </div>

      <div className="text-2xl font-bold text-slate-900 dark:text-white font-mono tracking-tight">
        {formatKES(value)}
      </div>

      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-500">{sub}</span>
        {trend !== undefined && (
          <span className={`flex items-center text-xs font-semibold ${trendUp ? 'text-emerald-500 dark:text-emerald-400' : 'text-rose-500 dark:text-rose-400'}`}>
            {trendUp ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
            {Math.abs(trend)}%
          </span>
        )}
      </div>
    </motion.div>
  );
};

/* ─── Monthly Revenue Card ─────────────────────────────────────── */
const MonthCard = ({ month, value, index, isCurrentMonth }) => (
  <motion.div
    custom={index}
    variants={fadeUp}
    initial="hidden"
    animate="visible"
    className={`relative rounded-2xl p-5 border transition-all duration-300
      ${isCurrentMonth
        ? 'bg-gradient-to-br from-[#16C784]/20 to-white dark:to-[#0F1623] border-[#16C784]/40'
        : 'bg-white dark:bg-[#0F1623] border-slate-200 dark:border-white/[0.07] hover:border-slate-300 dark:hover:border-white/15'
      }`}
  >
    {isCurrentMonth && (
      <span className="absolute top-3 right-3 text-[10px] font-bold tracking-widest uppercase bg-[#16C784]/20 text-[#16C784] px-2 py-0.5 rounded-full">
        Current
      </span>
    )}
    <p className="text-xs font-semibold tracking-widest uppercase text-gray-500 mb-3">{month.label}</p>
    <p className="text-2xl font-bold text-slate-900 dark:text-white font-mono">{formatKES(value)}</p>
    <div className="mt-3 h-1 rounded-full bg-slate-200 dark:bg-white/5">
      <div
        className="h-full rounded-full transition-all duration-700"
        style={{
          width: `${Math.min(100, (value / 150000) * 100)}%`,
          background: isCurrentMonth ? '#16C784' : '#3B82F6'
        }}
      />
    </div>
  </motion.div>
);

/* ─── Main Component ──────────────────────────────────────────── */
const PaymentAnalytics = () => {
  const subdomain = window.location.hostname.split('.')[0];
  const months = last3Months();

  const [paymentData, setPaymentData] = useState([]);
  const [loadingRefresh, setLoadingRefresh] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const [revenueData, setRevenueData] = useState({
    today: 0, thisWeek: 0, thisMonth: 0, lastMonth: 0,
    monthlyBreakdown: { [months[0].label]: 0, [months[1].label]: 0, [months[2].label]: 0 },
    loading: true,
  });

  /* ── Revenue area chart ── */
  const [revenueChart, setRevenueChart] = useState({
    series: [{ name: 'Revenue (KES)', data: [] }],
    options: {
      chart: { type: 'area', height: 300, toolbar: { show: false }, background: 'transparent', sparkline: { enabled: false } },
      colors: [ACCENT],
      fill: { type: 'gradient', gradient: { shadeIntensity: 1, opacityFrom: 0.4, opacityTo: 0, stops: [0, 90] } },
      dataLabels: { enabled: false },
      stroke: { curve: 'smooth', width: 2 },
      grid: { borderColor: '#ffffff0d', strokeDashArray: 4 },
      xaxis: { categories: [], labels: { style: { colors: '#6B7280', fontSize: '11px' } }, axisBorder: { show: false }, axisTicks: { show: false } },
      yaxis: { labels: { style: { colors: '#6B7280', fontSize: '11px' }, formatter: v => 'KES ' + (v / 1000).toFixed(0) + 'k' } },
      tooltip: { theme: 'dark', y: { formatter: v => formatKES(v) } },
    },
  });






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




const isDark = useIsDarkMode();

const tableTheme = useMemo(() => createTheme({
  palette: {
    mode: isDark ? 'dark' : 'light',
    background: {
      paper: isDark ? '#1e1e1e' : '#ffffff',
      default: isDark ? '#1e1e1e' : '#ffffff',
    },
    text: {
      primary: isDark ? '#f1f1f1' : '#1a1a1a',
      secondary: isDark ? '#a3a3a3' : '#6b7280',
    },
  },
}), [isDark]);

// Shared chart tokens that flip with the theme (ApexCharts renders raw SVG,
// so these can't be handled with Tailwind's `dark:` classes — they need JS)
const chartGridColor = isDark ? '#ffffff0d' : '#0f172a0d';
const chartAxisColor = isDark ? '#6B7280' : '#475569';
const chartTooltipTheme = isDark ? 'dark' : 'light';







  /* ── Daily traffic bar chart ── */
  const [dailyChart, setDailyChart] = useState({
    series: [{ name: 'Transactions', data: [] }],
    options: {
      chart: { type: 'bar', height: 300, toolbar: { show: false }, background: 'transparent' },
      colors: [ACCENT2],
      plotOptions: { bar: { borderRadius: 5, columnWidth: '55%' } },
      dataLabels: { enabled: false },
      grid: { borderColor: '#ffffff0d', strokeDashArray: 4 },
      xaxis: { categories: [], labels: { style: { colors: '#6B7280', fontSize: '10px' } }, axisBorder: { show: false } },
      yaxis: { labels: { style: { colors: '#6B7280' } } },
      tooltip: { theme: 'dark' },
    },
  });

  /* ── Payment method pie ── */
  const [pieChart, setPieChart] = useState({
    series: [70, 20, 10],
    options: {
      chart: { type: 'donut', background: 'transparent' },
      labels: ['MPesa', 'Cash', 'Other'],
      colors: ['#16C784', '#3B82F6', '#F59E0B'],
      legend: { position: 'bottom', labels: { colors: '#9CA3AF' } },
      dataLabels: { style: { colors: ['#fff'] } },
      plotOptions: { pie: { donut: { size: '65%', labels: { show: true, total: { show: true, label: 'Total', color: '#9CA3AF', formatter: w => 'KES ' + w.globals.seriesTotals.reduce((a, b) => a + b, 0).toLocaleString() } } } } },
      tooltip: { theme: 'dark' },
    },
  });

  /* ── Fetch helpers ── */
  const getPaymentData = useCallback(async () => {
    try {
      const res = await fetch('/api/pp_poe_mpesa_revenues', {
        headers: { 'Content-Type': 'application/json', 'X-Subdomain': subdomain },
      });
      if (res.ok) setPaymentData(await res.json());
    } catch { console.error('Failed to fetch payment data'); }
  }, [subdomain]);

  const fetchRevenueSummary = async () => {
    setLoadingRefresh(true);
    try {
      const res = await fetch('/api/ppoe_mpesa_revenue_summary', {
        headers: { 'Content-Type': 'application/json', 'X-Subdomain': subdomain },
      });
      const data = await res.json();
      if (data.success) {
        setRevenueData({
          today: data.summary?.today ?? 0,
          thisWeek: data.summary?.this_week ?? 0,
          thisMonth: data.summary?.this_month ?? 0,
          lastMonth: data.summary?.last_month ?? 0,
          monthlyBreakdown: {
            [months[0].label]: data.monthly?.[months[0].shortLabel] ?? 0,
            [months[1].label]: data.monthly?.[months[1].shortLabel] ?? 0,
            [months[2].label]: data.monthly?.[months[2].shortLabel] ?? 0,
          },
          loading: false,
        });

        // update revenue chart
        const chartData = (data.last_7_days ?? []).map(d => d.revenue);
        const cats = (data.last_7_days ?? []).map(d =>
          new Date(d.date).toLocaleDateString('en-US', { weekday: 'short' })
        );
        setRevenueChart(prev => ({
          ...prev,
          series: [{ name: 'Revenue (KES)', data: chartData }],
          options: { ...prev.options, xaxis: { ...prev.options.xaxis, categories: cats } },
        }));

        toast.success('Revenue data refreshed', { position: 'top-right', duration: 3000 });
      } else {
        toast.error('Failed to refresh revenue data', { position: 'top-right' });
      }
    } catch {
      toast.error('Server error while refreshing');
    } finally {
      setLoadingRefresh(false);
    }
  };

  const fetchDailyRevenue = async (date) => {
    try {
      const res = await fetch(`/api/daily_revenue?date=${date}`, { headers: { 'X-Subdomain': subdomain } });
      if (res.ok) {
        const data = await res.json();
        if (data.transactions) {
          const hourly = Array(24).fill(0);
          data.transactions.forEach(tx => { hourly[new Date(tx.created_at).getHours()]++; });
          setDailyChart(prev => ({
            ...prev,
            series: [{ name: 'Transactions', data: hourly }],
            options: { ...prev.options, xaxis: { ...prev.options.xaxis, categories: Array.from({ length: 24 }, (_, i) => `${i}h`) } },
          }));
          toast.success(`${format(new Date(date), 'dd MMM')}: ${formatKES(data.total_revenue)}`);
        }
      }
    } catch { toast.error('Failed to load daily revenue'); }
  };

  useEffect(() => {
    getPaymentData();
    fetchRevenueSummary();
    const id = setInterval(() => { fetchRevenueSummary(); getPaymentData(); }, 300000);
    return () => clearInterval(id);
  }, []);

// :payment_method, :amount,
//        :reference, :time_paid, :account_id, :account_number,
//        :payment_type



  const paymentColumns = [
    {
      title: 'User', field: 'customer_name',
      render: row => <Typography variant="body2" sx={{ fontWeight: 600, color: isDark ? '#e5e7eb' : '#1e293b' }}>{row.customer_name ?? '—'}</Typography>,
    },


     {
      title: 'Account Number', field: 'account_number',
      render: row => <Typography variant="body2" sx={{ fontWeight: 600, color: isDark ? '#e5e7eb' : '#1e293b' }}>{row.account_number ?? '—'}</Typography>,
    },
    {
      title: 'Method', field: 'payment_method',
      render: row => (
        <Chip
          label={row.payment_method ?? 'Unknown'}
          size="small"
          sx={{
            background: row.payment_method === 'MPesa' ? '#16C78420' : '#3B82F620',
            color: row.payment_method === 'MPesa' ? '#16C784' : '#3B82F6',
            fontWeight: 700, fontSize: 11,
          }}
        />
      ),
    },
    {
      title: 'Amount', field: 'amount',
      render: row => <Typography variant="body2" sx={{ fontWeight: 700, color: '#16C784', fontFamily: 'monospace' }}>KSh {Number(row.amount ?? 0).toLocaleString()}</Typography>,
    },
    {
      title: 'Reference', field: 'reference',
      render: row => <Typography variant="body2" sx={{ fontSize: 11, color: '#9CA3AF', fontFamily: 'monospace' }}>{row.reference ?? '—'}</Typography>,
    },
    { title: 'Date', field: 'time_paid', defaultSort: 'desc' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#080D18] text-slate-900 dark:text-white p-6 md:p-8" style={{ fontFamily: "'DM Sans', 'IBM Plex Mono', sans-serif" }}>
      <Toaster toastOptions={{ style: {
        color: isDark ? '#fff' : '#0f172a',
        backgroundColor: isDark ? 'black' : '#ffffff',
        border: isDark ? '1px solid #ffffff12' : '1px solid #e2e8f0',
      } }} />

      {/* ── Header ── */}
      <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <p className="text-xs font-bold tracking-[0.2em] uppercase text-[#16C784] mb-1">PPPOE</p>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Revenue Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Real-time MPESA & payment analytics</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Date picker */}
          <div className="flex items-center gap-2 bg-white dark:bg-[#0F1623] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2.5">
            <Calendar size={15} className="text-gray-400" />
            <input
              type="date"
              value={selectedDate}
              onChange={e => { setSelectedDate(e.target.value); fetchDailyRevenue(e.target.value); }}
              className="bg-transparent text-sm text-slate-700 dark:text-gray-300 outline-none"
            />
          </div>
          <button
            onClick={fetchRevenueSummary}
            disabled={loadingRefresh}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#16C784] text-black text-sm font-bold rounded-xl hover:bg-[#12b070] transition-all disabled:opacity-60"
          >
            <RefreshCw size={15} className={loadingRefresh ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>
      </motion.div>

      {/* ── Primary stat cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard index={0} title="Today" value={revenueData.today} sub="Since midnight" icon={Wallet} iconColor="#16C784" trend={4.2} />
        <StatCard index={1} title="This Week" value={revenueData.thisWeek} sub="Mon – today" icon={Activity} iconColor="#3B82F6" trend={-1.8} />
        <StatCard index={2} title="This Month" value={revenueData.thisMonth} sub={format(new Date(), 'MMMM yyyy')} icon={BarChart3} iconColor="#A855F7" trend={11.3} />
        <StatCard index={3} title="Last Month" value={revenueData.lastMonth} sub={format(subMonths(new Date(), 1), 'MMMM yyyy')} icon={CreditCard} iconColor="#F59E0B" />
      </div>

      {/* ── Monthly breakdown (last 3 months) ── */}
      <div className="mb-8">
        <motion.h2 variants={fadeUp} initial="hidden" animate="visible" custom={4}
          className="text-xs font-bold tracking-widest uppercase text-gray-500 mb-4">
          Monthly Revenue — Last 3 Months
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {months.map((m, i) => (
            <MonthCard
              key={m.label}
              month={m}
              value={revenueData.monthlyBreakdown[m.label] ?? 0}
              index={5 + i}
              isCurrentMonth={i === 2}
            />
          ))}
        </div>
      </div>

      {/* ── Charts row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* 7-day revenue */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={8}
          className="bg-white dark:bg-[#0F1623] border border-slate-200 dark:border-white/[0.07] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-xs font-bold tracking-widest uppercase text-gray-500 mb-1">Revenue Trend</p>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Last 7 Days</h2>
            </div>
            <span className="text-xs bg-[#16C784]/10 text-[#16C784] font-semibold px-3 py-1 rounded-full">Live</span>
          </div>
          <ReactApexChart
            options={{
              ...revenueChart.options,
              grid: { ...revenueChart.options.grid, borderColor: chartGridColor },
              xaxis: { ...revenueChart.options.xaxis, labels: { ...revenueChart.options.xaxis.labels, style: { ...revenueChart.options.xaxis.labels.style, colors: chartAxisColor } } },
              yaxis: { ...revenueChart.options.yaxis, labels: { ...revenueChart.options.yaxis.labels, style: { ...revenueChart.options.yaxis.labels.style, colors: chartAxisColor } } },
              tooltip: { ...revenueChart.options.tooltip, theme: chartTooltipTheme },
            }}
            series={revenueChart.series}
            type="area"
            height={260}
          />
        </motion.div>

        {/* Daily hourly traffic */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={9}
          className="bg-white dark:bg-[#0F1623] border border-slate-200 dark:border-white/[0.07] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-xs font-bold tracking-widest uppercase text-gray-500 mb-1">Transaction Volume</p>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Hourly — {format(new Date(selectedDate), 'dd MMM yyyy')}</h2>
            </div>
            <Clock size={18} className="text-gray-500" />
          </div>
          <ReactApexChart
            options={{
              ...dailyChart.options,
              grid: { ...dailyChart.options.grid, borderColor: chartGridColor },
              xaxis: { ...dailyChart.options.xaxis, labels: { ...dailyChart.options.xaxis.labels, style: { ...dailyChart.options.xaxis.labels.style, colors: chartAxisColor } } },
              yaxis: { ...dailyChart.options.yaxis, labels: { ...dailyChart.options.yaxis.labels, style: { ...dailyChart.options.yaxis.labels.style, colors: chartAxisColor } } },
              tooltip: { ...dailyChart.options.tooltip, theme: chartTooltipTheme },
            }}
            series={dailyChart.series}
            type="bar"
            height={260}
          />
        </motion.div>
      </div>

      {/* ── Pie + Payments table ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Payment method donut */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={10}
          className="bg-white dark:bg-[#0F1623] border border-slate-200 dark:border-white/[0.07] rounded-2xl p-6 col-span-1">
          <p className="text-xs font-bold tracking-widest uppercase text-gray-500 mb-1">Payment Methods</p>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Distribution</h2>
          <ReactApexChart
            options={{
              ...pieChart.options,
              tooltip: { ...pieChart.options.tooltip, theme: chartTooltipTheme },
            }}
            series={pieChart.series}
            type="donut"
            height={260}
          />
        </motion.div>

        {/* Payments table */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={11}
          className="bg-white dark:bg-[#0F1623] border border-slate-200 dark:border-white/[0.07] rounded-2xl p-6 col-span-2 overflow-hidden">
          <p className="text-xs font-bold tracking-widest uppercase text-gray-500 mb-1">Subscriber Payments</p>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Recent Transactions</h2>
          <div className="revenue-table-wrap" style={{ borderRadius: 12, overflow: 'hidden' }}>
            <ThemeProvider theme={tableTheme}>
              <MaterialTable
                columns={paymentColumns}
                data={paymentData}
                title=""
                localization={{ body: { emptyDataSourceMessage: 'No recent payments found' } }}
                options={{
                  sorting: true,
                  pageSizeOptions: [5, 10, 20],
                  pageSize: 5,
                  paginationPosition: 'bottom',
                  exportButton: true,
                  exportAllData: true,
                  search: true,
                  emptyRowsWhenPaging: false,
                  showSelectAllCheckbox: false,
                  showTextRowsSelected: false,
                  headerStyle: {
                    background: isDark ? '#151C2C' : '#F8FAFC',
                    color: isDark ? '#6B7280' : '#475569',
                    fontWeight: 700,
                    fontSize: 11,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    borderBottom: isDark ? '1px solid #ffffff0d' : '1px solid #e2e8f0',
                  },
                  rowStyle: {
                    background: isDark ? '#0F1623' : '#ffffff',
                    color: isDark ? '#e5e7eb' : '#1e293b',
                    borderBottom: isDark ? '1px solid #ffffff06' : '1px solid #f1f5f9',
                  },
                  searchFieldStyle: { color: isDark ? '#9CA3AF' : '#475569' },
                }}
                style={{ background: isDark ? '#0F1623' : '#ffffff', color: isDark ? '#e5e7eb' : '#1e293b', boxShadow: 'none' }}
              />
            </ThemeProvider>
          </div>
        </motion.div>
      </div>

      {/* ── Most bought packages ── */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={12}
        className="bg-white dark:bg-[#0F1623] border border-slate-200 dark:border-white/[0.07] rounded-2xl p-6">
        <p className="text-xs font-bold tracking-widest uppercase text-gray-500 mb-1">Package Popularity</p>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Most Purchased WiFi Packages</h2>
        <ReactApexChart
          options={{
            chart: { type: 'bar', toolbar: { show: false }, background: 'transparent' },
            colors: ['#A855F7'],
            plotOptions: { bar: { horizontal: true, borderRadius: 6, dataLabels: { position: 'top' } } },
            dataLabels: { enabled: true, formatter: v => 'KES ' + v.toLocaleString(), style: { colors: [chartAxisColor], fontSize: '11px' } },
            grid: { borderColor: chartGridColor },
            xaxis: {
              categories: ['1 Hour', '3 Hours', '6 Hours', '12 Hours', '24 Hours', 'Weekly', 'Monthly'],
              labels: { style: { colors: chartAxisColor } },
            },
            yaxis: { labels: { style: { colors: chartAxisColor } } },
            tooltip: { theme: chartTooltipTheme },
          }}
          series={[{ name: 'Purchases', data: [120, 95, 78, 55, 43, 22, 14] }]}
          type="bar"
          height={260}
        />
      </motion.div>

      {/* inline style overrides for material-table — only apply when actually in dark mode */}
      <style>{`
        .dark .revenue-table-wrap .MuiPaper-root { background: #0F1623 !important; color: #e5e7eb !important; }
        .dark .revenue-table-wrap .MuiTableCell-root { color: #e5e7eb !important; border-bottom: 1px solid #ffffff08 !important; }
        .dark .revenue-table-wrap .MuiTablePagination-root, .dark .revenue-table-wrap .MuiTablePagination-caption, .dark .revenue-table-wrap .MuiSelect-icon { color: #6B7280 !important; }
        .dark .revenue-table-wrap .MuiIconButton-root { color: #6B7280 !important; }
        .dark .revenue-table-wrap .MuiInput-underline:before { border-color: #ffffff15 !important; }
        .dark .revenue-table-wrap .MuiInputBase-input { color: #9CA3AF !important; }
        .dark .revenue-table-wrap .MuiCheckbox-root { color: #3B82F6 !important; }
        .dark .revenue-table-wrap .MuiToolbar-root { background: #151C2C !important; }
      `}</style>
    </div>
  );
};

export default PaymentAnalytics;