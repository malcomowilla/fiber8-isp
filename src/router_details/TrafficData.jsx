import React, { useState, useEffect, useRef } from 'react';
import ReactApexChart from 'react-apexcharts';
import { ArrowDown, ArrowUp, Activity } from 'lucide-react';

const TrafficStatsGraph = ({ trafficData }) => {
  const [chartData, setChartData] = useState({
    series: [
      { name: 'Download', data: [] },
      { name: 'Upload', data: [] },
    ],
    options: {
      chart: {
        id: 'live-traffic',
        height: 320,
        type: 'area',
        background: 'transparent',
        animations: {
          enabled: true,
          easing: 'easeinout',
          dynamicAnimation: { speed: 600 },
        },
        toolbar: { show: false },
        zoom: { enabled: false },
        sparkline: { enabled: false },
      },
      grid: {
        borderColor: 'rgba(148, 163, 184, 0.12)',
        strokeDashArray: 4,
        xaxis: { lines: { show: false } },
        padding: { left: 8, right: 8 },
      },
      dataLabels: { enabled: false },
      stroke: { width: 2.5, curve: 'smooth' },
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.35,
          opacityTo: 0,
          stops: [0, 90, 100],
        },
      },
      markers: { size: 0, hover: { size: 5 } },
      xaxis: {
        type: 'datetime',
        labels: {
          datetimeUTC: false,
          style: { colors: '#64748b', fontSize: '11px' },
          formatter: function (value, timestamp) {
            const date = new Date(timestamp);
            return date.toLocaleTimeString('en-US', {
              hour12: false,
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
            });
          },
        },
        axisBorder: { show: false },
        axisTicks: { show: false },
      },
      yaxis: {
        labels: {
          style: { colors: '#64748b', fontSize: '11px' },
          formatter: (val) => `${val}`,
        },
        min: 0,
      },
      tooltip: {
        theme: 'dark',
        x: {
          formatter: function (value) {
            const date = new Date(value);
            return date.toLocaleString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
              hour12: true,
            });
          },
        },
      },
      colors: ['#38bdf8', '#34d399'],
      legend: { show: false },
    },
  });

  const dataHistory = useRef([]);
  const [latest, setLatest] = useState({ download: 0, upload: 0 });
  const maxDataPoints = 30;

  useEffect(() => {
    if (trafficData) {
      const now = new Date();
      const newEntry = {
        timestamp: now.getTime(),
        download: trafficData.download_speed,
        upload: trafficData.upload_speed,
      };

      dataHistory.current = [...dataHistory.current, newEntry].slice(-maxDataPoints);
      setLatest({ download: newEntry.download, upload: newEntry.upload });

      setChartData((prev) => ({
        ...prev,
        series: [
          {
            name: 'Download',
            data: dataHistory.current.map((e) => [e.timestamp, e.download]),
          },
          {
            name: 'Upload',
            data: dataHistory.current.map((e) => [e.timestamp, e.upload]),
          },
        ],
      }));
    }
  }, [trafficData]);

  return (
    <div className="relative rounded-2xl border border-slate-700/40 bg-slate-900/70 backdrop-blur-xl p-5 shadow-[0_0_40px_-15px_rgba(56,189,248,0.4)] overflow-hidden">
      {/* ambient glow accents */}
      <div className="pointer-events-none absolute -top-24 -right-24 w-56 h-56 bg-sky-500/20 rounded-full blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 w-56 h-56 bg-emerald-500/15 rounded-full blur-3xl" />

      <div className="relative flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400" />
          </span>
          <h3 className="text-slate-200 font-semibold text-sm tracking-wide flex items-center gap-1.5">
            <Activity size={15} className="text-sky-400" />
            Network Traffic
          </h3>
        </div>
        <span className="text-[11px] uppercase tracking-wider text-slate-500 font-medium">
          Live
        </span>
      </div>

      <div className="relative h-64 w-full">
        <ReactApexChart
          options={chartData.options}
          series={chartData.series}
          type="area"
          height="100%"
        />
      </div>

      <div className="relative mt-5 grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-sky-500/10 border border-sky-400/20 p-3.5 flex items-center justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-wide text-sky-300/70 font-medium mb-1">
              Download
            </p>
            <p className="text-2xl font-bold text-sky-300 tabular-nums">
              {latest.download}
              <span className="text-xs font-medium text-sky-400/60 ml-1">Mbps</span>
            </p>
          </div>
          <ArrowDown size={20} className="text-sky-400/70" />
        </div>

        <div className="rounded-xl bg-emerald-500/10 border border-emerald-400/20 p-3.5 flex items-center justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-wide text-emerald-300/70 font-medium mb-1">
              Upload
            </p>
            <p className="text-2xl font-bold text-emerald-300 tabular-nums">
              {latest.upload}
              <span className="text-xs font-medium text-emerald-400/60 ml-1">Mbps</span>
            </p>
          </div>
          <ArrowUp size={20} className="text-emerald-400/70" />
        </div>
      </div>
    </div>
  );
};

export default TrafficStatsGraph;