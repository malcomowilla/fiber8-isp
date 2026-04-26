import { MdOutlineOnlinePrediction } from "react-icons/md";
import { FaUser, FaClock, FaChartLine, FaDownload, FaUpload } from "react-icons/fa";
import { GiNetworkBars } from "react-icons/gi";
import { useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams } from 'react-router-dom';
import TrafficStatsGraph from './TrafficStatsGraph';

// ── CSS injected once ──────────────────────────────────────────────────────────
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;700&family=Syne:wght@400;600;700;800&display=swap');

  .noc-root *   { box-sizing: border-box; }
  .noc-root     { font-family: 'Syne', sans-serif; }
  .noc-root .mono { font-family: 'JetBrains Mono', monospace; }

  @keyframes noc-pulse  { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(1.25)} }
  @keyframes noc-blink  { 0%,100%{opacity:1} 50%{opacity:0} }
  @keyframes noc-slide  { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
  @keyframes noc-glow   { 0%,100%{box-shadow:0 0 6px #00d4ff44} 50%{box-shadow:0 0 18px #00d4ff88} }
  @keyframes noc-spin   { to{transform:rotate(360deg)} }
  @keyframes noc-bar    { from{width:0} to{width:var(--w)} }

  .noc-card  { background:rgba(0,16,30,0.75); border:1px solid rgba(0,212,255,0.12); border-radius:14px; backdrop-filter:blur(12px); }
  .noc-row   { animation: noc-slide .25s ease both; }
  .noc-row:hover { background:rgba(0,212,255,0.04) !important; }
  .noc-stat-card { transition:border-color .2s, transform .2s; }
  .noc-stat-card:hover { border-color:rgba(0,212,255,.35) !important; transform:translateY(-2px); }
  .noc-table th { font-family:'JetBrains Mono',monospace; font-size:10px; letter-spacing:.1em; color:#3a6a7a; text-transform:uppercase; }
  .noc-table td { font-size:13px; border-bottom:1px solid rgba(0,212,255,0.05); }
  .noc-tag { display:inline-flex; align-items:center; padding:2px 9px; border-radius:20px; font-size:10px; font-family:'JetBrains Mono',monospace; font-weight:600; letter-spacing:.04em; }

  ::-webkit-scrollbar       { width:4px; height:4px; }
  ::-webkit-scrollbar-thumb { background:#0d3040; border-radius:4px; }

  /* scanline */
  .noc-scanline::before {
    content:'';
    position:absolute;
    inset:0;
    pointer-events:none;
    z-index:0;
    background-image:repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,212,255,0.01) 2px,rgba(0,212,255,0.01) 4px);
  }
`;

// ── Helpers ────────────────────────────────────────────────────────────────────
const fmtBytes = (bytes, dp = 2) => {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024, sizes = ['B','KB','MB','GB','TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / k ** i).toFixed(dp)} ${sizes[i]}`;
};

const parseBytes = (str) => {
  if (!str || typeof str !== 'string') return 0;
  const m = str.match(/(\d+\.?\d*)\s*(KB|MB|GB|B)/i);
  if (!m) return 0;
  const v = parseFloat(m[1]), u = m[2].toUpperCase();
  return u==='KB'?v*1024:u==='MB'?v*1048576:u==='GB'?v*1073741824:v;
};

const parseMbps = (str) => {
  if (!str || typeof str !== 'string') return 0;
  const m = str.match(/(\d+\.?\d*)/);
  return m ? parseFloat(m[1]) : 0;
};

// ── Sub-components ─────────────────────────────────────────────────────────────
function Dot({ color = '#00ff88', glow }) {
  return (
    <span style={{
      display: 'inline-block', width: 7, height: 7, borderRadius: '50%',
      background: color, flexShrink: 0,
      boxShadow: glow ? `0 0 8px ${color}` : 'none',
      animation: 'noc-pulse 2s ease-in-out infinite',
    }}/>
  );
}

function StatCard({ label, value, sub, icon: Icon, color, accent, delay = 0 }) {
  return (
    <div className="noc-card noc-stat-card" style={{
      padding: '16px 18px', position: 'relative', overflow: 'hidden',
      borderLeft: `2px solid ${color}`,
      animation: `noc-slide .35s ease ${delay}s both`,
    }}>
      {/* Corner glow */}
      <div style={{
        position: 'absolute', top: 0, right: 0, width: 80, height: 80,
        background: `radial-gradient(circle at top right, ${color}18, transparent)`,
        pointerEvents: 'none',
      }}/>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
        <div style={{
          width: 32, height: 32, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: `${color}15`, border: `1px solid ${color}30`,
        }}>
          <Icon style={{ color, fontSize: 15 }}/>
        </div>
        {accent && (
          <span className="noc-tag" style={{ color: accent, background: `${accent}15` }}>{accent}</span>
        )}
      </div>

      <p className="mono" style={{ fontSize: 22, fontWeight: 700, color: '#e8f4f8', lineHeight: 1.1, marginBottom: 4 }}>
        {value}
      </p>
      <p style={{ fontSize: 11, color: '#3a6a7a', letterSpacing: '.06em', textTransform: 'uppercase' }}>{label}</p>
      {sub && <p className="mono" style={{ fontSize: 10, color: `${color}aa`, marginTop: 3 }}>{sub}</p>}
    </div>
  );
}

function BandwidthBar({ label, value, max, color }) {
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0;
  return (
    <div style={{ marginBottom: 8 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
        <span style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: '#3a6a7a' }}>{label}</span>
        <span className="mono" style={{ fontSize: 10, color }}>{value.toFixed(2)} Mbps</span>
      </div>
      <div style={{ height: 4, background: 'rgba(255,255,255,0.04)', borderRadius: 99, overflow: 'hidden' }}>
        <div style={{
          height: '100%', borderRadius: 99,
          width: `${pct}%`,
          background: `linear-gradient(90deg,${color}88,${color})`,
          boxShadow: `0 0 8px ${color}66`,
          transition: 'width 1s ease',
        }}/>
      </div>
    </div>
  );
}

function LoadingScreen() {
  return (
    <div className="noc-root" style={{
      minHeight: 400, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg,#000d1a 0%,#001428 100%)', borderRadius: 14,
    }}>
      <div style={{
        width: 44, height: 44, border: '2px solid rgba(0,212,255,.15)',
        borderTop: '2px solid #00d4ff', borderRadius: '50%',
        animation: 'noc-spin 1s linear infinite', marginBottom: 16,
      }}/>
      <p className="mono" style={{ color: '#00d4ff', fontSize: 12, letterSpacing: '.12em' }}>INITIALISING SESSIONS…</p>
    </div>
  );
}

// ── Main ───────────────────────────────────────────────────────────────────────
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

  const getPPOEstats = useCallback(async () => {
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
    getPPOEstats();
    const id = setInterval(() => { if (isMounted.current) { getPPOEstats(); setTick(t => t + 1); } }, 5000);
    return () => { isMounted.current = false; clearInterval(id); };
  }, [getPPOEstats]);

  // Aggregate totals
  const totalDl  = stats.reduce((s, u) => s + parseMbps(u?.download || ''), 0);
  const totalUl  = stats.reduce((s, u) => s + parseMbps(u?.upload   || ''), 0);
  const totalDlB = stats.reduce((s, u) => s + parseBytes(u?.download || ''), 0);
  const totalUlB = stats.reduce((s, u) => s + parseBytes(u?.upload   || ''), 0);
  const maxDl    = Math.max(...stats.map(u => parseMbps(u?.download || '')), 0.01);
  const maxUl    = Math.max(...stats.map(u => parseMbps(u?.upload   || '')), 0.01);

  if (isLoading) return <LoadingScreen />;

  if (error) return (
    <div className="noc-root" style={{
      background: 'linear-gradient(135deg,#000d1a,#001428)', borderRadius: 14, padding: 40, textAlign: 'center',
    }}>
      <style>{CSS}</style>
      <GiNetworkBars style={{ fontSize: 40, color: '#ff4466', marginBottom: 12 }}/>
      <p className="mono" style={{ color: '#ff4466', marginBottom: 16 }}>{error}</p>
      <button onClick={getPPOEstats} style={{
        background: 'rgba(0,212,255,.12)', border: '1px solid rgba(0,212,255,.3)',
        color: '#00d4ff', padding: '8px 20px', borderRadius: 8, cursor: 'pointer',
        fontFamily: 'JetBrains Mono', fontSize: 12,
      }}>RETRY</button>
    </div>
  );

  return (
    <div className="noc-root" style={{
      background: 'linear-gradient(160deg,#000d1a 0%,#001020 40%,#000d18 100%)',
      borderRadius: 16, padding: '24px 24px 20px', position: 'relative', overflow: 'hidden',
    }}>
      <style>{CSS}</style>

      {/* Background grid */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0,
        backgroundImage: `
          linear-gradient(rgba(0,212,255,0.025) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0,212,255,0.025) 1px, transparent 1px)
        `,
        backgroundSize: '48px 48px',
      }}/>

      {/* Ambient blobs */}
      <div style={{ position:'absolute', top:-80, right:-80, width:300, height:300, borderRadius:'50%', background:'radial-gradient(circle,rgba(0,212,255,.06) 0%,transparent 70%)', pointerEvents:'none', zIndex:0 }}/>
      <div style={{ position:'absolute', bottom:-60, left:-60, width:240, height:240, borderRadius:'50%', background:'radial-gradient(circle,rgba(0,255,136,.05) 0%,transparent 70%)', pointerEvents:'none', zIndex:0 }}/>

      <div style={{ position: 'relative', zIndex: 1 }}>

        {/* ── Header ── */}
        <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', flexWrap:'wrap', gap:12, marginBottom:24 }}>
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4 }}>
              <Dot color="#00ff88" glow/>
              <span className="mono" style={{ fontSize:10, color:'#00ff88', letterSpacing:'.14em', textTransform:'uppercase' }}>
                System Operational
              </span>
            </div>
            <h1 style={{ fontSize:26, fontWeight:800, color:'#e8f4f8', margin:0, letterSpacing:'-.02em' }}>
              Active Sessions
            </h1>
            <p className="mono" style={{ fontSize:11, color:'#3a6a7a', marginTop:3 }}>
              PPPoE live monitoring · refreshes every 5s
            </p>
          </div>

          <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:6 }}>
            <div style={{
              display:'flex', alignItems:'center', gap:6, padding:'6px 14px',
              background:'rgba(0,212,255,.07)', border:'1px solid rgba(0,212,255,.18)',
              borderRadius:20,
            }}>
              <Dot color="#00d4ff" glow/>
              <span className="mono" style={{ fontSize:12, color:'#00d4ff', fontWeight:600 }}>
                {stats.length} CONNECTED
              </span>
            </div>
            {lastRefresh && (
              <span className="mono" style={{ fontSize:9, color:'#2a4a5a' }}>
                UPDATED {lastRefresh.toLocaleTimeString('en-US',{hour12:false})}
              </span>
            )}
          </div>
        </div>

        {/* ── KPI Cards ── */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(150px,1fr))', gap:12, marginBottom:20 }}>
          <StatCard label="Active Sessions"  value={stats.length}            icon={MdOutlineOnlinePrediction} color="#00d4ff" delay={0}/>
          <StatCard label="Total Download"   value={`${totalDl.toFixed(1)} Mbps`} icon={FaDownload}          color="#00d4ff" sub={fmtBytes(totalDlB)} delay={0.05}/>
          <StatCard label="Total Upload"     value={`${totalUl.toFixed(1)} Mbps`} icon={FaUpload}            color="#00ff88" sub={fmtBytes(totalUlB)} delay={0.1}/>
          <StatCard label="Bandwidth Used"   value={totalBandwidth}          icon={GiNetworkBars}             color="#ffaa00" delay={0.15}/>
        </div>

        {/* ── Bandwidth bars + Graph ── */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 2fr', gap:14, marginBottom:20 }}>

          {/* Bandwidth per-user bars */}
          <div className="noc-card" style={{ padding:'16px 18px' }}>
            <p className="mono" style={{ fontSize:10, color:'#3a6a7a', letterSpacing:'.1em', textTransform:'uppercase', marginBottom:14 }}>
              Per-User Bandwidth
            </p>
            {stats.length === 0
              ? <p className="mono" style={{ fontSize:11, color:'#2a4a5a', textAlign:'center', padding:'20px 0' }}>No data</p>
              : <div style={{ maxHeight:180, overflowY:'auto' }}>
                  {stats.map((s, i) => {
                    const dl = parseMbps(s?.download || '');
                    const ul = parseMbps(s?.upload   || '');
                    return (
                      <div key={i} style={{ marginBottom:12 }}>
                        <p className="mono" style={{ fontSize:10, color:'#5a8a9a', marginBottom:4, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                          {s?.username || s?.client || `User ${i+1}`}
                        </p>
                        <BandwidthBar label="DL" value={dl} max={maxDl} color="#00d4ff"/>
                        <BandwidthBar label="UL" value={ul} max={maxUl} color="#00ff88"/>
                      </div>
                    );
                  })}
                </div>
            }
          </div>

          {/* Traffic graph */}
          <TrafficStatsGraph trafficData={trafficData}/>
        </div>

        {/* ── Sessions Table ── */}
        <div className="noc-card" style={{ overflow:'hidden' }}>
          {/* Table header */}
          <div style={{
            display:'flex', alignItems:'center', justifyContent:'space-between',
            padding:'14px 18px 10px', borderBottom:'1px solid rgba(0,212,255,0.08)',
          }}>
            <div style={{ display:'flex', alignItems:'center', gap:8 }}>
              <FaChartLine style={{ color:'#00d4ff', fontSize:13 }}/>
              <span className="mono" style={{ fontSize:11, color:'#5a8a9a', letterSpacing:'.08em', textTransform:'uppercase' }}>
                Session Detail
              </span>
            </div>
            <span className="noc-tag" style={{ color:'#00d4ff', background:'rgba(0,212,255,.08)' }}>
              {stats.length} rows
            </span>
          </div>

          <div style={{ overflowX:'auto' }}>
            <table className="noc-table" style={{ width:'100%', borderCollapse:'collapse' }}>
              <thead>
                <tr style={{ background:'rgba(0,212,255,0.03)' }}>
                  {['#','Client','Package','Username','IP Address','Uptime','Upload','Download'].map(h => (
                    <th key={h} style={{ padding:'10px 14px', textAlign:'left', whiteSpace:'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {stats.length > 0
                  ? stats.map((s, i) => {
                      const dl = parseMbps(s?.download || '');
                      const ul = parseMbps(s?.upload   || '');
                      const dlPct = maxDl > 0 ? (dl / maxDl) * 100 : 0;
                      const ulPct = maxUl > 0 ? (ul / maxUl) * 100 : 0;
                      return (
                        <tr key={i} className="noc-row" style={{ animationDelay:`${i*0.03}s` }}>
                          <td style={{ padding:'10px 14px', color:'#2a4a5a' }} className="mono">{String(i+1).padStart(2,'0')}</td>
                          <td style={{ padding:'10px 14px' }}>
                            <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                              <div style={{
                                width:28, height:28, borderRadius:8, flexShrink:0,
                                background:'rgba(0,212,255,.1)', border:'1px solid rgba(0,212,255,.2)',
                                display:'flex', alignItems:'center', justifyContent:'center',
                              }}>
                                <FaUser style={{ color:'#00d4ff', fontSize:11 }}/>
                              </div>
                              <div>
                                <div style={{ color:'#cce8f0', fontWeight:600, fontSize:12, whiteSpace:'nowrap' }}>{s?.client || 'Unknown'}</div>
                                <div className="mono" style={{ fontSize:9, color:'#3a6a7a', whiteSpace:'nowrap' }}>{s?.mac_address || '—'}</div>
                              </div>
                            </div>
                          </td>
                          <td style={{ padding:'10px 14px' }}>
                            <span className="noc-tag" style={{ color:'#b088ff', background:'rgba(176,136,255,.1)' }}>
                              {s?.package || 'N/A'}
                            </span>
                          </td>
                          <td style={{ padding:'10px 14px' }} className="mono" >
                            <span style={{ color:'#5a8a9a', fontSize:12 }}>{s?.username || '—'}</span>
                          </td>
                          <td style={{ padding:'10px 14px' }}>
                            <div style={{ display:'flex', alignItems:'center', gap:5 }}>
                              <Dot color="#00ff88"/>
                              <span className="mono" style={{ color:'#cce8f0', fontSize:12 }}>{s?.ip_address || '—'}</span>
                            </div>
                          </td>
                          <td style={{ padding:'10px 14px' }}>
                            <div style={{ display:'flex', alignItems:'center', gap:5 }}>
                              <FaClock style={{ color:'#3a6a7a', fontSize:10 }}/>
                              <span className="mono" style={{ color:'#8aaabb', fontSize:11 }}>{s?.up_time || '—'}</span>
                            </div>
                          </td>
                          {/* Upload cell with mini-bar */}
                          <td style={{ padding:'10px 14px', minWidth:110 }}>
                            <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                              <FaUpload style={{ color:'#00ff88', fontSize:10, flexShrink:0 }}/>
                              <div style={{ flex:1 }}>
                                <span className="mono" style={{ color:'#00ff88', fontWeight:700, fontSize:12 }}>{s?.upload || '0'}</span>
                                <div style={{ height:2, background:'rgba(255,255,255,.04)', borderRadius:99, marginTop:3, overflow:'hidden' }}>
                                  <div style={{ height:'100%', width:`${ulPct}%`, background:'#00ff88', borderRadius:99, transition:'width 1s ease' }}/>
                                </div>
                              </div>
                            </div>
                          </td>
                          {/* Download cell with mini-bar */}
                          <td style={{ padding:'10px 14px', minWidth:110 }}>
                            <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                              <FaDownload style={{ color:'#00d4ff', fontSize:10, flexShrink:0 }}/>
                              <div style={{ flex:1 }}>
                                <span className="mono" style={{ color:'#00d4ff', fontWeight:700, fontSize:12 }}>{s?.download || '0'}</span>
                                <div style={{ height:2, background:'rgba(255,255,255,.04)', borderRadius:99, marginTop:3, overflow:'hidden' }}>
                                  <div style={{ height:'100%', width:`${dlPct}%`, background:'#00d4ff', borderRadius:99, transition:'width 1s ease' }}/>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  : (
                    <tr>
                      <td colSpan={8} style={{ padding:'48px 20px', textAlign:'center' }}>
                        <GiNetworkBars style={{ fontSize:36, color:'#1a3a4a', display:'block', margin:'0 auto 10px' }}/>
                        <p className="mono" style={{ color:'#2a4a5a', fontSize:12 }}>NO ACTIVE SESSIONS</p>
                        <p style={{ color:'#1a3a4a', fontSize:11, marginTop:4 }}>Waiting for PPPoE connections…</p>
                      </td>
                    </tr>
                  )
                }
              </tbody>
            </table>
          </div>

          {/* Table footer */}
          <div style={{
            display:'flex', alignItems:'center', justifyContent:'space-between',
            padding:'10px 18px', borderTop:'1px solid rgba(0,212,255,0.06)',
          }}>
            <div style={{ display:'flex', alignItems:'center', gap:6 }}>
              <Dot color="#00ff88" glow/>
              <span className="mono" style={{ fontSize:9, color:'#3a6a7a', letterSpacing:'.08em' }}>SYSTEM OPERATIONAL</span>
            </div>
            <span className="mono" style={{ fontSize:9, color:'#2a4a5a' }}>
              AUTO-REFRESH 5s · TICK {tick}
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default LiveData;