import { MdOutlineOnlinePrediction } from "react-icons/md";
import { FaUser, FaClock, FaChartLine, FaDownload, FaUpload } from "react-icons/fa";
import { GiNetworkBars } from "react-icons/gi";
import { useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams } from 'react-router-dom';
import TrafficStatsGraph from './TrafficStatsGraph';

// ── CSS ────────────────────────────────────────────────────────────────────────
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap');

  .noc * { box-sizing: border-box; margin: 0; padding: 0; }
  .noc { font-family: 'Inter', system-ui, sans-serif; }
  .noc .mono { font-family: 'JetBrains Mono', monospace; }

  /* ── Design tokens (light default) ── */
  .noc {
    --bg:          #F8FAFC;
    --surface:     #FFFFFF;
    --surface-2:   #F1F5F9;
    --border:      #E2E8F0;
    --border-2:    #CBD5E1;
    --text-1:      #0F172A;
    --text-2:      #475569;
    --text-3:      #94A3B8;
    --accent:      #2563EB;
    --accent-light:#EFF6FF;
    --accent-mid:  #BFDBFE;
    --green:       #10B981;
    --green-light: #ECFDF5;
    --amber:       #F59E0B;
    --amber-light: #FFFBEB;
    --red:         #EF4444;
    --shadow-sm:   0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04);
    --shadow-md:   0 4px 12px rgba(0,0,0,0.07), 0 2px 4px rgba(0,0,0,0.04);
    --radius:      10px;
    --radius-sm:   6px;
  }

  /* ── Dark mode ── */
  @media (prefers-color-scheme: dark) {
    .noc {
      --bg:          #0B1120;
      --surface:     #111827;
      --surface-2:   #1A2333;
      --border:      #1E293B;
      --border-2:    #2D3F55;
      --text-1:      #F1F5F9;
      --text-2:      #94A3B8;
      --text-3:      #475569;
      --accent:      #3B82F6;
      --accent-light:#1E3A5F;
      --accent-mid:  #1D4ED8;
      --green:       #10B981;
      --green-light: #064E3B;
      --amber:       #F59E0B;
      --amber-light: #451A03;
      --shadow-sm:   0 1px 3px rgba(0,0,0,0.3);
      --shadow-md:   0 4px 12px rgba(0,0,0,0.4);
    }
  }

  /* ── Base ── */
  .noc-wrap {
    background: var(--bg);
    min-height: 100%;
    padding: 24px;
    border-radius: 12px;
  }

  /* ── Cards ── */
  .noc-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    box-shadow: var(--shadow-sm);
  }

  /* ── Stat card ── */
  .noc-stat {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 18px 20px;
    box-shadow: var(--shadow-sm);
    transition: box-shadow 0.2s, transform 0.2s;
    position: relative;
    overflow: hidden;
  }
  .noc-stat::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 3px;
    background: var(--stat-accent, var(--accent));
    border-radius: var(--radius) var(--radius) 0 0;
  }
  .noc-stat:hover {
    box-shadow: var(--shadow-md);
    transform: translateY(-1px);
  }

  /* ── Table ── */
  .noc-table { width: 100%; border-collapse: collapse; }
  .noc-table thead th {
    font-family: 'Inter', sans-serif;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--text-3);
    padding: 10px 14px;
    text-align: left;
    background: var(--surface-2);
    border-bottom: 1px solid var(--border);
    white-space: nowrap;
  }
  .noc-table tbody td {
    padding: 12px 14px;
    border-bottom: 1px solid var(--border);
    color: var(--text-2);
    font-size: 13px;
    vertical-align: middle;
  }
  .noc-table tbody tr:last-child td { border-bottom: none; }
  .noc-table tbody tr { transition: background 0.12s; }
  .noc-table tbody tr:hover td { background: var(--surface-2); }

  /* ── Badge ── */
  .noc-badge {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 3px 9px;
    border-radius: 20px;
    font-size: 11px;
    font-weight: 600;
    font-family: 'JetBrains Mono', monospace;
    letter-spacing: 0.02em;
  }

  /* ── Live pulse — the ONE animated element ── */
  @keyframes noc-live {
    0%, 100% { opacity: 1; box-shadow: 0 0 0 0 var(--green); }
    50%       { opacity: 0.8; box-shadow: 0 0 0 4px transparent; }
  }
  .noc-live-dot {
    width: 7px; height: 7px; border-radius: 50%;
    background: var(--green);
    animation: noc-live 2.4s ease-in-out infinite;
    flex-shrink: 0;
  }

  /* ── Mini bar ── */
  .noc-bar-track {
    height: 3px;
    background: var(--border);
    border-radius: 99px;
    overflow: hidden;
    margin-top: 4px;
  }
  .noc-bar-fill {
    height: 100%;
    border-radius: 99px;
    transition: width 0.9s cubic-bezier(0.4, 0, 0.2, 1);
  }

  /* ── Scrollbar ── */
  .noc-scroll::-webkit-scrollbar { width: 4px; height: 4px; }
  .noc-scroll::-webkit-scrollbar-track { background: transparent; }
  .noc-scroll::-webkit-scrollbar-thumb { background: var(--border-2); border-radius: 4px; }

  /* ── Loading spinner ── */
  @keyframes noc-spin { to { transform: rotate(360deg); } }
  .noc-spinner {
    width: 32px; height: 32px;
    border: 2px solid var(--border);
    border-top-color: var(--accent);
    border-radius: 50%;
    animation: noc-spin 0.8s linear infinite;
  }

  /* ── Fade in ── */
  @keyframes noc-fade { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }
  .noc-fade { animation: noc-fade 0.25s ease both; }

  /* ── Responsive grid ── */
  .noc-kpi-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 12px;
  }
  .noc-mid-grid {
    display: grid;
    grid-template-columns: 1fr 2fr;
    gap: 12px;
  }
  @media (max-width: 900px) {
    .noc-kpi-grid { grid-template-columns: repeat(2, 1fr); }
    .noc-mid-grid { grid-template-columns: 1fr; }
  }
  @media (max-width: 500px) {
    .noc-kpi-grid { grid-template-columns: 1fr; }
    .noc-wrap { padding: 14px; }
  }
`;

// ── Helpers ────────────────────────────────────────────────────────────────────
const fmtBytes = (bytes, dp = 1) => {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024, sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / k ** i).toFixed(dp)} ${sizes[i]}`;
};

const parseBytes = (str) => {
  if (!str || typeof str !== 'string') return 0;
  const m = str.match(/(\d+\.?\d*)\s*(KB|MB|GB|B)/i);
  if (!m) return 0;
  const v = parseFloat(m[1]), u = m[2].toUpperCase();
  return u === 'KB' ? v * 1024 : u === 'MB' ? v * 1048576 : u === 'GB' ? v * 1073741824 : v;
};

const parseMbps = (str) => {
  if (!str || typeof str !== 'string') return 0;
  const m = str.match(/(\d+\.?\d*)/);
  return m ? parseFloat(m[1]) : 0;
};

// ── StatCard ──────────────────────────────────────────────────────────────────
function StatCard({ label, value, sub, icon: Icon, accentVar = '--accent', delay = 0 }) {
  return (
    <div className="noc-stat noc-fade" style={{ '--stat-accent': `var(${accentVar})`, animationDelay: `${delay}s` }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--text-3)' }}>
          {label}
        </span>
        <div style={{
          width: 30, height: 30, borderRadius: 7,
          background: `var(${accentVar === '--green' ? '--green-light' : accentVar === '--amber' ? '--amber-light' : '--accent-light'})`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon style={{ color: `var(${accentVar})`, fontSize: 13 }} />
        </div>
      </div>
      <p className="mono" style={{ fontSize: 24, fontWeight: 600, color: 'var(--text-1)', lineHeight: 1, marginBottom: 4 }}>
        {value}
      </p>
      {sub && (
        <p className="mono" style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 5 }}>{sub}</p>
      )}
    </div>
  );
}

// ── BandwidthBar ──────────────────────────────────────────────────────────────
function BandwidthBar({ label, value, max, colorVar }) {
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0;
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
        <span style={{ fontSize: 10, color: 'var(--text-3)', fontWeight: 500 }}>{label}</span>
        <span className="mono" style={{ fontSize: 10, color: `var(${colorVar})`, fontWeight: 600 }}>
          {value.toFixed(2)} Mbps
        </span>
      </div>
      <div className="noc-bar-track">
        <div className="noc-bar-fill" style={{ width: `${pct}%`, background: `var(${colorVar})` }} />
      </div>
    </div>
  );
}

// ── LoadingScreen ─────────────────────────────────────────────────────────────
function LoadingScreen() {
  return (
    <div className="noc" style={{
      minHeight: 360, display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      background: 'var(--bg)', borderRadius: 12, gap: 14,
    }}>
      <style>{CSS}</style>
      <div className="noc-spinner" />
      <p className="mono" style={{ fontSize: 11, color: 'var(--text-3)', letterSpacing: '0.1em' }}>
        LOADING SESSIONS
      </p>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
const LiveData = () => {
  const [stats,          setStats]          = useState([]);
  const [trafficData,    setTrafficData]    = useState([]);
  const [totalBandwidth, setTotalBandwidth] = useState('0 MB');
  const [isLoading,      setIsLoading]      = useState(true);
  const [error,          setError]          = useState(null);
  const [lastRefresh,    setLastRefresh]    = useState(null);
  const [tick,           setTick]           = useState(0);

  const [searchParams] = useSearchParams();
  const subscriberId   = searchParams.get('id');
  const subdomain      = window.location.hostname.split('.')[0];
  const isMounted      = useRef(true);

  const getPPPoEstats = useCallback(async () => {
    if (!isMounted.current) return;
    try {
      const res = await fetch(`/api/get_active_pppoe_users?subscriber_id=${subscriberId}`, {
        headers: { 'X-Subdomain': subdomain },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (isMounted.current) {
        setStats(data?.users || []);
        setTrafficData(data?.users || []);
        setTotalBandwidth(data?.total_bandwidth || '0 MB');
        setLastRefresh(new Date());
        setIsLoading(false);
      }
    } catch (e) {
      if (isMounted.current) { setError(e.message); setIsLoading(false); }
    }
  }, [subscriberId, subdomain]);

  useEffect(() => {
    isMounted.current = true;
    getPPPoEstats();
    const id = setInterval(() => {
      if (isMounted.current) { getPPPoEstats(); setTick(t => t + 1); }
    }, 5000);
    return () => { isMounted.current = false; clearInterval(id); };
  }, [getPPPoEstats]);

  const totalDl  = stats.reduce((s, u) => s + parseMbps(u?.download || ''), 0);
  const totalUl  = stats.reduce((s, u) => s + parseMbps(u?.upload   || ''), 0);
  const totalDlB = stats.reduce((s, u) => s + parseBytes(u?.download || ''), 0);
  const totalUlB = stats.reduce((s, u) => s + parseBytes(u?.upload   || ''), 0);
  const maxDl    = Math.max(...stats.map(u => parseMbps(u?.download || '')), 0.01);
  const maxUl    = Math.max(...stats.map(u => parseMbps(u?.upload   || '')), 0.01);

  if (isLoading) return <LoadingScreen />;

  if (error) return (
    <div className="noc">
      <style>{CSS}</style>
      <div className="noc-wrap font-sans
" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', 
        justifyContent: 'center', minHeight: 320, gap: 14 }}>
        <div style={{
          width: 48, height: 48, borderRadius: 12,
          background: 'rgba(239,68,68,0.1)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <GiNetworkBars style={{ fontSize: 22, color: 'var(--red)' }} />
        </div>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-1)', marginBottom: 4 }}>Connection Error</p>
          <p className="mono" style={{ fontSize: 12, color: 'var(--text-3)' }}>{error}</p>
        </div>
        <button onClick={getPPPoEstats} style={{
          background: 'var(--accent)', color: '#fff', border: 'none',
          padding: '8px 20px', borderRadius: 7, cursor: 'pointer',
          fontFamily: 'Inter', fontSize: 13, fontWeight: 600,
        }}>
          Retry
        </button>
      </div>
    </div>
  );

  return (
    <div className="noc font-sans
">
      <style>{CSS}</style>
      <div className="noc-wrap">

        {/* ── Header ── */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 
          'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 22 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <div className="noc-live-dot" />
              <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--green)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                Live · refreshes every 5s
              </span>
            </div>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-1)', letterSpacing: '-0.03em' }}>
              Active Sessions
            </h1>
          </div>

          <div style={{ display: 'flex', align: 'center', gap: 10 }}>
            <div className="noc-badge" style={{ background: 'var(--accent-light)', color: 'var(--accent)', border: '1px solid var(--accent-mid)', fontSize: 12 }}>
              <MdOutlineOnlinePrediction style={{ fontSize: 13 }} />
              {stats.length} connected
            </div>
            {lastRefresh && (
              <span className="mono" style={{ fontSize: 11, color: 'var(--text-3)', alignSelf: 'center' }}>
                {lastRefresh.toLocaleTimeString('en-US', { hour12: false })}
              </span>
            )}
          </div>
        </div>

        {/* ── KPI Cards ── */}
        <div className="noc-kpi-grid" style={{ marginBottom: 14 }}>
          <StatCard label="Sessions"       value={stats.length}                  icon={MdOutlineOnlinePrediction} accentVar="--accent"  delay={0}    />
          <StatCard label="Download"       value={`${totalDl.toFixed(1)} Mbps`}  icon={FaDownload}                accentVar="--accent"  delay={0.05} sub={fmtBytes(totalDlB)} />
          <StatCard label="Upload"         value={`${totalUl.toFixed(1)} Mbps`}  icon={FaUpload}                  accentVar="--green"   delay={0.1}  sub={fmtBytes(totalUlB)} />
          <StatCard label="Bandwidth Used" value={totalBandwidth}                 icon={GiNetworkBars}             accentVar="--amber"   delay={0.15} />
        </div>

        {/* ── Middle: per-user bars + graph ── */}
        <div className="noc-mid-grid" style={{ marginBottom: 14 }}>

          {/* Per-user bandwidth */}
          <div className="noc-card" style={{ padding: '16px 18px' }}>
            <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text-3)', marginBottom: 14 }}>
              Per-User Bandwidth
            </p>
            {stats.length === 0 ? (
              <p className="mono" style={{ fontSize: 11, color: 'var(--text-3)', textAlign: 'center', padding: '24px 0' }}>No data</p>
            ) : (
              <div className="noc-scroll" style={{ maxHeight: 200, overflowY: 'auto', paddingRight: 4 }}>
                {stats.map((s, i) => {
                  const dl = parseMbps(s?.download || '');
                  const ul = parseMbps(s?.upload   || '');
                  return (
                    <div key={i} style={{ marginBottom: 14 }}>
                      <p className="mono" style={{
                        fontSize: 10, color: 'var(--text-2)', marginBottom: 5,
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                      }}>
                        {s?.username || s?.client || `User ${i + 1}`}
                      </p>
                      <BandwidthBar label="DL" value={dl} max={maxDl} colorVar="--accent" />
                      <BandwidthBar label="UL" value={ul} max={maxUl} colorVar="--green"  />
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Traffic graph */}
          <div className="noc-card" style={{ padding: '16px 18px' }}>
            <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text-3)', marginBottom: 14 }}>
              Traffic Overview
            </p>
            <TrafficStatsGraph trafficData={trafficData} />
          </div>
        </div>

        {/* ── Sessions Table ── */}
        <div className="noc-card" style={{ overflow: 'hidden' }}>

          {/* Table toolbar */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '12px 16px', borderBottom: '1px solid var(--border)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
              <FaChartLine style={{ color: 'var(--accent)', fontSize: 12 }} />
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-1)' }}>Session Detail</span>
            </div>
            <span className="noc-badge" style={{ background: 'var(--surface-2)', color: 'var(--text-2)', border: '1px solid var(--border)' }}>
              {stats.length} rows
            </span>
          </div>

          <div className="noc-scroll" style={{ overflowX: 'auto' }}>
            <table className="noc-table">
              <thead>
                <tr>
                  {['#', 'Client', 'Package', 'Username', 'IP Address', 'Uptime', 'Upload', 'Download'].map(h => (
                    <th key={h}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {stats.length > 0 ? (
                  stats.map((s, i) => {
                    const dl    = parseMbps(s?.download || '');
                    const ul    = parseMbps(s?.upload   || '');
                    const dlPct = maxDl > 0 ? (dl / maxDl) * 100 : 0;
                    const ulPct = maxUl > 0 ? (ul / maxUl) * 100 : 0;
                    return (
                      <tr key={i}>
                        {/* # */}
                        <td className="mono" style={{ color: 'var(--text-3)', fontSize: 11, width: 42 }}>
                          {String(i + 1).padStart(2, '0')}
                        </td>

                        {/* Client */}
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <div style={{
                              width: 30, height: 30, borderRadius: 8, flexShrink: 0,
                              background: 'var(--accent-light)', border: '1px solid var(--accent-mid)',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}>
                              <FaUser style={{ color: 'var(--accent)', fontSize: 11 }} />
                            </div>
                            <div>
                              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-1)', whiteSpace: 'nowrap' }}>
                                {s?.client || 'Unknown'}
                              </div>
                              <div className="mono" style={{ fontSize: 10, color: 'var(--text-3)', whiteSpace: 'nowrap' }}>
                                {s?.mac_address || '—'}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Package */}
                        <td>
                          <span className="noc-badge" style={{ background: 'var(--surface-2)', color: 'var(--text-2)', border: '1px solid var(--border)' }}>
                            {s?.package || 'N/A'}
                          </span>
                        </td>

                        {/* Username */}
                        <td className="mono" style={{ color: 'var(--text-2)', fontSize: 12 }}>
                          {s?.username || '—'}
                        </td>

                        {/* IP */}
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--green)', flexShrink: 0 }} />
                            <span className="mono" style={{ color: 'var(--text-1)', fontSize: 12 }}>
                              {s?.ip_address || '—'}
                            </span>
                          </div>
                        </td>

                        {/* Uptime */}
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                            <FaClock style={{ color: 'var(--text-3)', fontSize: 10 }} />
                            <span className="mono" style={{ color: 'var(--text-2)', fontSize: 11 }}>
                              {s?.up_time || '—'}
                            </span>
                          </div>
                        </td>

                        {/* Upload */}
                        <td style={{ minWidth: 120 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                            <FaUpload style={{ color: 'var(--green)', fontSize: 10, flexShrink: 0 }} />
                            <div style={{ flex: 1 }}>
                              <span className="mono" style={{ fontSize: 12, fontWeight: 600, color: 'var(--green)' }}>
                                {s?.upload || '0'}
                              </span>
                              <div className="noc-bar-track">
                                <div className="noc-bar-fill" style={{ width: `${ulPct}%`, background: 'var(--green)' }} />
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Download */}
                        <td style={{ minWidth: 120 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                            <FaDownload style={{ color: 'var(--accent)', fontSize: 10, flexShrink: 0 }} />
                            <div style={{ flex: 1 }}>
                              <span className="mono" style={{ fontSize: 12, fontWeight: 600, color: 'var(--accent)' }}>
                                {s?.download || '0'}
                              </span>
                              <div className="noc-bar-track">
                                <div className="noc-bar-fill" style={{ width: `${dlPct}%`, background: 'var(--accent)' }} />
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={8} style={{ padding: '52px 20px', textAlign: 'center' }}>
                      <GiNetworkBars style={{ fontSize: 32, color: 'var(--border-2)', display: 'block', margin: '0 auto 10px' }} />
                      <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-2)', marginBottom: 4 }}>No active sessions</p>
                      <p style={{ fontSize: 12, color: 'var(--text-3)' }}>Waiting for PPPoE connections</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '10px 16px', borderTop: '1px solid var(--border)',
            background: 'var(--surface-2)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div className="noc-live-dot" style={{ width: 6, height: 6 }} />
              <span style={{ fontSize: 11, color: 'var(--green)', fontWeight: 600 }}>System Operational</span>
            </div>
            <span className="mono" style={{ fontSize: 10, color: 'var(--text-3)' }}>
              Auto-refresh 5s · tick {tick}
            </span>
          </div>

        </div>
      </div>
    </div>
  );
};

export default LiveData;