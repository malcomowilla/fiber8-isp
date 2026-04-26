import React, { useState, useEffect, useRef } from 'react';
import ReactApexChart from 'react-apexcharts';

const TrafficStatsGraph = ({ trafficData }) => {
  const dataHistory = useRef([]);
  const maxDataPoints = 40;

  const [series, setSeries] = useState([
    { name: 'Download', data: [] },
    { name: 'Upload',   data: [] },
  ]);

  const chartOptions = {
    chart: {
      id: 'noc-traffic',
      type: 'area',
      height: '100%',
      background: 'transparent',
      animations: {
        enabled: true,
        easing: 'linear',
        dynamicAnimation: { speed: 900 },
      },
      toolbar: { show: false },
      zoom:    { enabled: false },
      sparkline: { enabled: false },
    },
    dataLabels: { enabled: false },
    stroke: {
      width: [2, 2],
      curve: 'smooth',
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.28,
        opacityTo: 0.01,
        stops: [0, 100],
      },
    },
    markers: { size: 0 },
    grid: {
      borderColor: 'rgba(0,212,255,0.07)',
      strokeDashArray: 3,
      xaxis: { lines: { show: true } },
      yaxis: { lines: { show: true } },
    },
    xaxis: {
      type: 'datetime',
      labels: {
        style: { colors: '#4a7a8a', fontFamily: 'JetBrains Mono, monospace', fontSize: '10px' },
        datetimeUTC: false,
        formatter: (val) => {
          const d = new Date(val);
          return d.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
        },
      },
      axisBorder: { color: 'rgba(0,212,255,0.15)' },
      axisTicks:  { color: 'rgba(0,212,255,0.15)' },
    },
    yaxis: {
      labels: {
        style: { colors: '#4a7a8a', fontFamily: 'JetBrains Mono, monospace', fontSize: '10px' },
        formatter: (val) => `${Number(val).toFixed(1)}`,
      },
      title: {
        text: 'Mbps',
        style: { color: '#4a7a8a', fontFamily: 'JetBrains Mono, monospace', fontSize: '10px' },
      },
      min: 0,
    },
    tooltip: {
      theme: 'dark',
      style: { fontFamily: 'JetBrains Mono, monospace', fontSize: '11px' },
      x: {
        formatter: (val) =>
          new Date(val).toLocaleTimeString('en-US', { hour12: true, hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      },
    },
    colors: ['#00d4ff', '#00ff88'],
    legend: {
      labels: { colors: ['#00d4ff', '#00ff88'] },
      fontFamily: 'JetBrains Mono, monospace',
      fontSize: '11px',
    },
    theme: { mode: 'dark' },
  };

  useEffect(() => {
    if (!trafficData?.length) return;
    const entry = {
      timestamp: Date.now(),
      download:  parseFloat(trafficData[0]?.download) || 0,
      upload:    parseFloat(trafficData[0]?.upload)   || 0,
    };
    dataHistory.current = [...dataHistory.current, entry].slice(-maxDataPoints);
    setSeries([
      { name: 'Download', data: dataHistory.current.map(e => [e.timestamp, e.download]) },
      { name: 'Upload',   data: dataHistory.current.map(e => [e.timestamp, e.upload])   },
    ]);
  }, [trafficData]);

  const last     = dataHistory.current[dataHistory.current.length - 1];
  const dl       = last?.download ?? 0;
  const ul       = last?.upload   ?? 0;
  const dlMax    = Math.max(...dataHistory.current.map(e => e.download), 0.01);
  const ulMax    = Math.max(...dataHistory.current.map(e => e.upload),   0.01);

  return (
    <div style={{
      background: 'rgba(0,10,20,0.6)',
      border: '1px solid rgba(0,212,255,0.12)',
      borderRadius: 12,
      padding: '16px 20px 12px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Scanline overlay */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0,
        backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,212,255,0.012) 2px,rgba(0,212,255,0.012) 4px)',
      }}/>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, position: 'relative', zIndex: 1 }}>
        <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#00ff88', boxShadow: '0 0 8px #00ff88', animation: 'pulse 2s infinite' }}/>
        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: '#4a7a8a', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
          Live Traffic · Real-time
        </span>
      </div>

      {/* Chart */}
      <div style={{ height: 160, position: 'relative', zIndex: 1 }}>
        <ReactApexChart options={chartOptions} series={series} type="area" height="100%" />
      </div>

      {/* Metric bars */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 12, position: 'relative', zIndex: 1 }}>
        {[
          { label: 'DOWNLOAD', value: dl, max: dlMax, color: '#00d4ff', icon: '▼' },
          { label: 'UPLOAD',   value: ul, max: ulMax, color: '#00ff88', icon: '▲' },
        ].map(m => (
          <div key={m.label} style={{
            background: `rgba(${m.color === '#00d4ff' ? '0,212,255' : '0,255,136'},0.05)`,
            border: `1px solid ${m.color}22`,
            borderRadius: 8, padding: '10px 12px',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9, color: '#4a7a8a', letterSpacing: '0.1em' }}>{m.icon} {m.label}</span>
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 16, fontWeight: 700, color: m.color }}>
                {m.value.toFixed(2)}<span style={{ fontSize: 9, marginLeft: 3, color: '#4a7a8a' }}>Mbps</span>
              </span>
            </div>
            <div style={{ height: 3, background: 'rgba(255,255,255,0.05)', borderRadius: 99, overflow: 'hidden' }}>
              <div style={{
                height: '100%', borderRadius: 99,
                width: `${Math.min((m.value / m.max) * 100, 100)}%`,
                background: `linear-gradient(90deg, ${m.color}99, ${m.color})`,
                transition: 'width 0.9s ease',
                boxShadow: `0 0 6px ${m.color}`,
              }}/>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrafficStatsGraph;