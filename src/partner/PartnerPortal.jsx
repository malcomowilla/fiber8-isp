/**
 * PartnerPortal.jsx
 * Self-service dashboard for a partner to view their earnings, stats, and payouts.
 * Route: /partner-portal  (no auth required if accessed via private link, or add your own auth)
 */
import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp, DollarSign, Clock, Wifi, Calendar, ChevronRight,
  ArrowUpRight, ArrowDownRight, CheckCircle, AlertCircle,
  Download, RefreshCw, User, Phone, Mail, MapPin, Percent, Banknote,
  BarChart3, Activity, Star
} from 'lucide-react';

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700;9..40,800&family=JetBrains+Mono:wght@400;500;700&display=swap');
  .pp-root * { box-sizing:border-box; }
  .pp-root   { font-family:'DM Sans',sans-serif; }
  .pp-mono   { font-family:'JetBrains Mono',monospace; }

  @keyframes pp-up   { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
  @keyframes pp-spin { to{transform:rotate(360deg)} }
  @keyframes pp-bar  { from{width:0} to{width:var(--w,0%)} }
  @keyframes pp-shimmer { from{background-position:-300% 0} to{background-position:300% 0} }

  .pp-card  { background:#fff; border:1px solid #e5e7eb; border-radius:14px; }
  .pp-tag   { display:inline-flex; align-items:center; padding:3px 10px; border-radius:20px; font-size:11px; font-weight:600; }
  .pp-nav-item { display:flex; align-items:center; gap:8px; padding:9px 14px; border-radius:9px; font-size:13px; font-weight:500; cursor:pointer; border:none; background:transparent; width:100%; text-align:left; transition:all .15s; }
  .pp-nav-item:hover { background:#f5f3ff; color:#6366f1; }
  .pp-nav-item.active { background:#f5f3ff; color:#6366f1; font-weight:600; }
  .pp-sk { background:linear-gradient(90deg,#f3f4f6 25%,#e9eaec 50%,#f3f4f6 75%); background-size:300% 100%; animation:pp-shimmer 1.4s infinite; border-radius:8px; }
  .pp-row { border-bottom:1px solid #f3f4f6; transition:background .1s; }
  .pp-row:last-child { border-bottom:none; }
  .pp-row:hover { background:#f9fafb; }
  ::-webkit-scrollbar { width:4px; }
  ::-webkit-scrollbar-thumb { background:#e5e7eb; border-radius:4px; }
`;

const fmtKsh   = n => `KES ${Number(n||0).toLocaleString()}`;
const fmtDate  = d => d ? new Date(d).toLocaleDateString('en-KE',{day:'2-digit',month:'short',year:'numeric'}) : '—';
const fmtShort = d => d ? new Date(d).toLocaleDateString('en-KE',{day:'2-digit',month:'short'}) : '—';

// Demo data builder
function buildDemo() {
  const now   = Date.now();
  const txns  = Array.from({length:18},(_,i)=>({
    id:`t-${i}`,
    date: new Date(now - i*2.5*864e5).toISOString(),
    type: i%3===0?'payout':i%4===0?'deduction':'commission',
    description: i%3===0 ? 'Monthly payout via M-Pesa'
      : i%4===0 ? 'Platform service fee'
      : ['Hotspot voucher sale','PPPoE subscription','Voucher bundle'][i%3],
    amount:  i%3===0 ? -(1500+i*200) : i%4===0 ? -50 : 150+i*80,
    status: i%5===4?'pending':'completed',
    reference: `REF-${1000+i}`,
  }));

  const monthly = Array.from({length:6},(_,i)=>({
    month: new Date(now - i*30*864e5).toLocaleDateString('en-KE',{month:'short',year:'2-digit'}),
    earned:   1200+i*800+Math.random()*400,
    vouchers: 20+i*8,
  })).reverse();

  return {
    partner: {
      name: 'Alice Mwangi', type:'reseller', status:'active',
      email:'alice@example.com', phone:'0712 345 678', city:'Nairobi', country:'Kenya',
      commission_type:'percentage', commission_rate:15, payout_method:'mpesa',
      mpesa_number:'0712 345 678', payout_frequency:'monthly',
      joined: new Date(now-180*864e5).toISOString(),
    },
    stats: {
      total_earned:  42800, pending_payout: 6200,
      this_month:    8500,  last_month:     7200,
      total_vouchers:312,   hotspots_linked:4,
      growth:        18.1,
    },
    transactions: txns,
    monthly,
    hotspots: [
      { id:1, name:'Westgate Mall WiFi',   vouchers_sold:80,  earned:4800, status:'active' },
      { id:2, name:'CBD Kiosk Hotspot',    vouchers_sold:120, earned:7200, status:'active' },
      { id:3, name:'Karen Estate Network', vouchers_sold:60,  earned:3600, status:'active' },
      { id:4, name:'Kileleshwa Hub',       vouchers_sold:52,  earned:3120, status:'inactive' },
    ],
  };
}

// ── Stat card ─────────────────────────────────────────────────────────────────
function KPI({ label, value, sub, icon:Icon, color, trend, delay=0, loading }) {
  return (
    <motion.div initial={{ opacity:0,y:10 }} animate={{ opacity:1,y:0 }} transition={{ delay }}
      className="pp-card" style={{ padding:'18px 20px', borderLeft:`3px solid ${color}` }}>
      <div style={{ display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:10 }}>
        <div style={{ width:34,height:34,borderRadius:9,background:`${color}15`,display:'flex',alignItems:'center',justifyContent:'center' }}>
          <Icon size={16} style={{ color }}/>
        </div>
        {trend!==undefined && (
          <span className="pp-tag" style={{ color:trend>=0?'#059669':'#dc2626', background:trend>=0?'#d1fae5':'#fee2e2' }}>
            {trend>=0?<ArrowUpRight size={11}/>:<ArrowDownRight size={11}/>}{Math.abs(trend)}%
          </span>
        )}
      </div>
      {loading
        ? <div className="pp-sk" style={{ height:26,width:110,marginBottom:6 }}/>
        : <p className="pp-mono" style={{ fontSize:22,fontWeight:700,color:'#111827',margin:'0 0 4px',lineHeight:1 }}>{value}</p>}
      <p style={{ fontSize:11,color:'#9ca3af',margin:0,fontWeight:500,textTransform:'uppercase',letterSpacing:'.05em' }}>{label}</p>
      {sub && <p style={{ fontSize:11,color,marginTop:4,fontWeight:500 }}>{sub}</p>}
    </motion.div>
  );
}

// ── Horizontal bar ─────────────────────────────────────────────────────────────
function Bar({ value, max, color='#6366f1' }) {
  const pct = max>0 ? Math.min((value/max)*100,100) : 0;
  return (
    <div style={{ height:4,background:'#f3f4f6',borderRadius:99,overflow:'hidden' }}>
      <div style={{ height:'100%',width:`${pct}%`,background:color,borderRadius:99,transition:'width .8s ease' }}/>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
export default function PartnerPortal() {
  const subdomain  = window.location.hostname.split('.')[0];
  const [page,     setPage]     = useState('overview');
  const [data,     setData]     = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [refresh,  setRefresh]  = useState(0);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/partner_portal/dashboard', { headers:{'X-Subdomain':subdomain} });
      if (res.ok) setData(await res.json());
      else throw new Error();
    } catch(_){ setData(buildDemo()); }
    finally { setLoading(false); }
  }, [subdomain, refresh]);

  useEffect(()=>{ fetchData(); },[fetchData]);

  const NAV = [
    { id:'overview',      label:'Overview',      icon:BarChart3 },
    { id:'transactions',  label:'Transactions',  icon:Activity  },
    { id:'hotspots',      label:'My Hotspots',   icon:Wifi      },
    { id:'profile',       label:'My Profile',    icon:User      },
  ];

  const tx   = data?.transactions || [];
  const hs   = data?.hotspots     || [];
  const s    = data?.stats        || {};
  const p    = data?.partner      || {};
  const maxEarned = Math.max(...(data?.monthly||[]).map(m=>m.earned),1);

  return (
    <>
      <style>{CSS}</style>
      <div className="pp-root" style={{ display:'flex', minHeight:'100vh', background:'#f8f9fb' }}>

        {/* ── Sidebar ── */}
        <aside style={{ width:220,background:'#fff',borderRight:'1px solid #e5e7eb',padding:'24px 12px',display:'flex',flexDirection:'column',flexShrink:0 }}>
          {/* Logo / brand */}
          <div style={{ padding:'0 6px 20px', borderBottom:'1px solid #f3f4f6', marginBottom:16 }}>
            <div style={{ display:'flex',alignItems:'center',gap:10 }}>
              <div style={{ width:34,height:34,borderRadius:9,background:'linear-gradient(135deg,#6366f1,#8b5cf6)',display:'flex',alignItems:'center',justifyContent:'center' }}>
                <Star size={16} style={{ color:'#fff' }}/>
              </div>
              <div>
                <p style={{ fontSize:13,fontWeight:700,color:'#111827',margin:0 }}>Partner Portal</p>
                <p style={{ fontSize:10,color:'#9ca3af',margin:0 }}>Self-service dashboard</p>
              </div>
            </div>
          </div>

          {/* Partner info pill */}
          {!loading && p.name && (
            <div style={{ padding:'10px 12px', background:'#f5f3ff', borderRadius:10, marginBottom:16 }}>
              <p style={{ fontSize:13,fontWeight:600,color:'#4f46e5',margin:'0 0 2px',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap' }}>{p.name}</p>
              <span className="pp-tag" style={{ color:'#7c3aed',background:'#ede9fe',padding:'1px 7px' }}>{p.type}</span>
            </div>
          )}

          <nav style={{ flex:1 }}>
            {NAV.map(n=>{
              const I=n.icon;
              return (
                <button key={n.id} className={`pp-nav-item ${page===n.id?'active':''}`} onClick={()=>setPage(n.id)}>
                  <I size={15}/> {n.label}
                </button>
              );
            })}
          </nav>

          <div style={{ padding:'12px 6px 0', borderTop:'1px solid #f3f4f6' }}>
            <p style={{ fontSize:10,color:'#d1d5db',textAlign:'center' }}>
              {p.joined ? `Member since ${fmtDate(p.joined)}` : ''}
            </p>
          </div>
        </aside>

        {/* ── Main ── */}
        <main style={{ flex:1, overflowY:'auto', padding:'28px 28px' }}>

          {/* Top bar */}
          <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:24 }}>
            <div>
              <h1 style={{ fontSize:20,fontWeight:800,color:'#111827',margin:'0 0 2px',letterSpacing:'-.02em' }}>
                {NAV.find(n=>n.id===page)?.label}
              </h1>
              <p style={{ fontSize:12,color:'#9ca3af',margin:0 }}>
                {new Date().toLocaleDateString('en-KE',{weekday:'long',day:'numeric',month:'long',year:'numeric'})}
              </p>
            </div>
            <button onClick={()=>setRefresh(r=>r+1)}
              style={{ display:'flex',alignItems:'center',gap:6,padding:'8px 14px',borderRadius:9,border:'1.5px solid #e5e7eb',background:'#fff',cursor:'pointer',fontSize:13,color:'#374151',fontFamily:'DM Sans,sans-serif' }}>
              <RefreshCw size={13} style={{ animation:loading?'pp-spin 1s linear infinite':'' }}/> Refresh
            </button>
          </div>

          <AnimatePresence mode="wait">

            {/* ══ OVERVIEW ══ */}
            {page==='overview' && (
              <motion.div key="ov" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}>
                {/* KPIs */}
                <div style={{ display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:12,marginBottom:20 }}>
                  <KPI label="Total Earned"   value={loading?'—':fmtKsh(s.total_earned)}   icon={TrendingUp}  color="#6366f1" trend={s.growth} delay={0}   loading={loading}/>
                  <KPI label="This Month"     value={loading?'—':fmtKsh(s.this_month)}     icon={DollarSign}  color="#059669" sub={`Last month: ${fmtKsh(s.last_month)}`} delay={.05} loading={loading}/>
                  <KPI label="Pending Payout" value={loading?'—':fmtKsh(s.pending_payout)} icon={Clock}       color="#d97706" delay={.1}  loading={loading}/>
                  <KPI label="Vouchers Sold"  value={loading?'—':s.total_vouchers||0}      icon={BarChart3}   color="#0ea5e9" sub={`Across ${s.hotspots_linked} hotspots`} delay={.15} loading={loading}/>
                </div>

                {/* Monthly bar chart + payout info */}
                <div style={{ display:'grid',gridTemplateColumns:'2fr 1fr',gap:14,marginBottom:14 }}>

                  {/* Bar chart */}
                  <div className="pp-card" style={{ padding:'20px 24px' }}>
                    <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20 }}>
                      <h3 style={{ fontSize:14,fontWeight:700,color:'#111827',margin:0 }}>Monthly Earnings</h3>
                      <span style={{ fontSize:11,color:'#9ca3af' }}>Last 6 months</span>
                    </div>
                    {loading
                      ? <div style={{ display:'flex',gap:8,alignItems:'flex-end',height:120 }}>
                          {[60,80,50,90,70,100].map((h,i)=><div key={i} className="pp-sk" style={{ flex:1,height:`${h}%` }}/>)}
                        </div>
                      : (
                        <div style={{ display:'flex',gap:10,alignItems:'flex-end',height:120 }}>
                          {(data?.monthly||[]).map((m,i)=>{
                            const pct = (m.earned/maxEarned)*100;
                            return (
                              <div key={i} style={{ flex:1,display:'flex',flexDirection:'column',alignItems:'center',gap:5 }}>
                                <span style={{ fontSize:9,color:'#9ca3af',fontFamily:'JetBrains Mono' }}>{fmtKsh(m.earned).replace('KES ','')}</span>
                                <div style={{ width:'100%',height:`${pct}%`,minHeight:4,background:'linear-gradient(180deg,#6366f1,#8b5cf6)',borderRadius:'4px 4px 2px 2px',transition:'height .6s ease' }}/>
                                <span style={{ fontSize:10,color:'#9ca3af',fontWeight:500 }}>{m.month}</span>
                              </div>
                            );
                          })}
                        </div>
                      )
                    }
                  </div>

                  {/* Payout details */}
                  <div className="pp-card" style={{ padding:'20px 24px' }}>
                    <h3 style={{ fontSize:14,fontWeight:700,color:'#111827',margin:'0 0 16px' }}>Payout Details</h3>
                    {[
                      { label:'Method',     value: p.payout_method==='mpesa'?'M-Pesa':'Bank', icon:Phone },
                      { label:'Number',     value: p.mpesa_number||p.account_number||'—', icon:DollarSign },
                      { label:'Frequency',  value: p.payout_frequency||'Monthly', icon:Calendar },
                      { label:'Commission', value: p.commission_type==='percentage'?`${p.commission_rate}% per sale`:`KES ${p.fixed_amount} fixed`, icon:Percent },
                    ].map(r=>{
                      const I=r.icon;
                      return (
                        <div key={r.label} className="pp-row" style={{ display:'flex',justifyContent:'space-between',alignItems:'center',padding:'9px 0' }}>
                          <div style={{ display:'flex',alignItems:'center',gap:7 }}>
                            <I size={12} style={{ color:'#9ca3af' }}/>
                            <span style={{ fontSize:12,color:'#6b7280' }}>{r.label}</span>
                          </div>
                          <span style={{ fontSize:12,fontWeight:600,color:'#111827' }}>{loading?'—':r.value}</span>
                        </div>
                      );
                    })}

                    {!loading && s.pending_payout > 0 && (
                      <div style={{ marginTop:14,padding:'10px 12px',background:'#fef3c7',border:'1px solid #fde68a',borderRadius:9 }}>
                        <p style={{ fontSize:12,color:'#92400e',margin:0,fontWeight:600 }}>
                          {fmtKsh(s.pending_payout)} pending payout
                        </p>
                        <p style={{ fontSize:11,color:'#b45309',margin:'3px 0 0' }}>Next payout: end of month</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Recent transactions preview */}
                <div className="pp-card" style={{ overflow:'hidden' }}>
                  <div style={{ padding:'16px 20px',borderBottom:'1px solid #f3f4f6',display:'flex',justifyContent:'space-between',alignItems:'center' }}>
                    <h3 style={{ fontSize:14,fontWeight:700,color:'#111827',margin:0 }}>Recent Activity</h3>
                    <button onClick={()=>setPage('transactions')}
                      style={{ fontSize:12,color:'#6366f1',fontWeight:600,background:'none',border:'none',cursor:'pointer',display:'flex',alignItems:'center',gap:4 }}>
                      View all <ChevronRight size={13}/>
                    </button>
                  </div>
                  {tx.slice(0,5).map((t,i)=>(
                    <div key={t.id} className="pp-row" style={{ display:'flex',alignItems:'center',justifyContent:'space-between',padding:'12px 20px' }}>
                      <div style={{ display:'flex',alignItems:'center',gap:12 }}>
                        <div style={{ width:32,height:32,borderRadius:9,display:'flex',alignItems:'center',justifyContent:'center',
                          background:t.type==='commission'?'#d1fae5':t.type==='payout'?'#dbeafe':'#fee2e2',
                          flexShrink:0 }}>
                          {t.type==='commission' ? <TrendingUp size={14} style={{ color:'#059669' }}/>
                            : t.type==='payout'  ? <Download   size={14} style={{ color:'#2563eb' }}/>
                            :                       <AlertCircle size={14} style={{ color:'#dc2626' }}/>}
                        </div>
                        <div>
                          <p style={{ fontSize:13,fontWeight:500,color:'#111827',margin:0 }}>{t.description}</p>
                          <p style={{ fontSize:11,color:'#9ca3af',margin:0 }}>{fmtDate(t.date)} · {t.reference}</p>
                        </div>
                      </div>
                      <div style={{ textAlign:'right' }}>
                        <p className="pp-mono" style={{ fontSize:13,fontWeight:700,color:t.amount>=0?'#059669':'#374151',margin:0 }}>
                          {t.amount>=0?'+':''}{fmtKsh(t.amount)}
                        </p>
                        <span className="pp-tag" style={{ color:t.status==='completed'?'#059669':'#d97706', background:t.status==='completed'?'#d1fae5':'#fef3c7', padding:'1px 7px', fontSize:10 }}>
                          {t.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* ══ TRANSACTIONS ══ */}
            {page==='transactions' && (
              <motion.div key="tx" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}>
                <div className="pp-card" style={{ overflow:'hidden' }}>
                  {/* Thead */}
                  <div style={{ display:'grid',gridTemplateColumns:'2fr 1fr 1fr 1fr 1fr',padding:'10px 20px',background:'#f9fafb',borderBottom:'1px solid #f3f4f6' }}>
                    {['Description','Date','Reference','Amount','Status'].map(h=>(
                      <span key={h} style={{ fontSize:11,fontWeight:700,color:'#9ca3af',textTransform:'uppercase',letterSpacing:'.06em' }}>{h}</span>
                    ))}
                  </div>
                  {tx.map((t,i)=>(
                    <motion.div key={t.id} className="pp-row"
                      initial={{ opacity:0,y:5 }} animate={{ opacity:1,y:0 }} transition={{ delay:i*.02 }}
                      style={{ display:'grid',gridTemplateColumns:'2fr 1fr 1fr 1fr 1fr',padding:'13px 20px',alignItems:'center' }}>
                      <div style={{ display:'flex',alignItems:'center',gap:10 }}>
                        <div style={{ width:30,height:30,borderRadius:8,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,
                          background:t.type==='commission'?'#d1fae5':t.type==='payout'?'#dbeafe':'#fee2e2' }}>
                          {t.type==='commission'?<TrendingUp size={13} style={{ color:'#059669' }}/>
                            :t.type==='payout'  ?<Download   size={13} style={{ color:'#2563eb' }}/>
                            :                    <AlertCircle size={13} style={{ color:'#dc2626' }}/>}
                        </div>
                        <div>
                          <p style={{ fontSize:13,fontWeight:500,color:'#111827',margin:0 }}>{t.description}</p>
                          <span className="pp-tag" style={{ color:t.type==='commission'?'#059669':t.type==='payout'?'#2563eb':'#dc2626', background:t.type==='commission'?'#d1fae5':t.type==='payout'?'#dbeafe':'#fee2e2', padding:'1px 7px',fontSize:9,marginTop:2 }}>
                            {t.type}
                          </span>
                        </div>
                      </div>
                      <span style={{ fontSize:12,color:'#6b7280' }}>{fmtShort(t.date)}</span>
                      <span className="pp-mono" style={{ fontSize:11,color:'#9ca3af' }}>{t.reference}</span>
                      <span className="pp-mono" style={{ fontSize:13,fontWeight:700,color:t.amount>=0?'#059669':'#374151' }}>
                        {t.amount>=0?'+':''}{fmtKsh(t.amount)}
                      </span>
                      <span className="pp-tag" style={{ color:t.status==='completed'?'#059669':'#d97706', background:t.status==='completed'?'#d1fae5':'#fef3c7' }}>
                        {t.status}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* ══ HOTSPOTS ══ */}
            {page==='hotspots' && (
              <motion.div key="hs" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}>
                <div style={{ display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:12 }}>
                  {hs.map((h,i)=>{
                    const maxV = Math.max(...hs.map(x=>x.vouchers_sold),1);
                    return (
                      <motion.div key={h.id} className="pp-card" initial={{ opacity:0,y:10 }} animate={{ opacity:1,y:0 }} transition={{ delay:i*.07 }}
                        style={{ padding:'18px 20px' }}>
                        <div style={{ display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:14 }}>
                          <div style={{ display:'flex',alignItems:'center',gap:10 }}>
                            <div style={{ width:36,height:36,borderRadius:9,background:h.status==='active'?'#d1fae5':'#f3f4f6',display:'flex',alignItems:'center',justifyContent:'center' }}>
                              <Wifi size={16} style={{ color:h.status==='active'?'#059669':'#9ca3af' }}/>
                            </div>
                            <div>
                              <p style={{ fontSize:13,fontWeight:700,color:'#111827',margin:0 }}>{h.name}</p>
                              <span className="pp-tag" style={{ color:h.status==='active'?'#059669':'#6b7280', background:h.status==='active'?'#d1fae5':'#f3f4f6', padding:'1px 7px',fontSize:10 }}>
                                {h.status}
                              </span>
                            </div>
                          </div>
                          <p className="pp-mono" style={{ fontSize:16,fontWeight:700,color:'#6366f1',margin:0 }}>{fmtKsh(h.earned)}</p>
                        </div>

                        <div style={{ marginBottom:8 }}>
                          <div style={{ display:'flex',justifyContent:'space-between',marginBottom:5 }}>
                            <span style={{ fontSize:12,color:'#6b7280' }}>Vouchers sold</span>
                            <span className="pp-mono" style={{ fontSize:12,fontWeight:600,color:'#111827' }}>{h.vouchers_sold}</span>
                          </div>
                          <Bar value={h.vouchers_sold} max={maxV} color="#6366f1"/>
                        </div>

                        <div style={{ display:'flex',justifyContent:'space-between' }}>
                          <span style={{ fontSize:11,color:'#9ca3af' }}>Avg per voucher</span>
                          <span className="pp-mono" style={{ fontSize:11,color:'#374151',fontWeight:600 }}>
                            {fmtKsh(h.vouchers_sold>0?h.earned/h.vouchers_sold:0)}
                          </span>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* ══ PROFILE ══ */}
            {page==='profile' && (
              <motion.div key="pr" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
                style={{ maxWidth:560 }}>
                <div className="pp-card" style={{ padding:'24px 28px', marginBottom:14 }}>
                  <div style={{ display:'flex',alignItems:'center',gap:14,marginBottom:22,paddingBottom:18,borderBottom:'1px solid #f3f4f6' }}>
                    <div style={{ width:52,height:52,borderRadius:14,background:'linear-gradient(135deg,#6366f1,#8b5cf6)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0 }}>
                      <User size={22} style={{ color:'#fff' }}/>
                    </div>
                    <div>
                      <p style={{ fontSize:17,fontWeight:800,color:'#111827',margin:0 }}>{p.name||'—'}</p>
                      <span className="pp-tag" style={{ color:'#7c3aed',background:'#ede9fe' }}>{p.type}</span>
                      &nbsp;
                      <span className="pp-tag" style={{ color:'#059669',background:'#d1fae5' }}>{p.status}</span>
                    </div>
                  </div>

                  {[
                    { label:'Email',     value:p.email,   icon:Mail    },
                    { label:'Phone',     value:p.phone,   icon:Phone   },
                    { label:'City',      value:p.city,    icon:MapPin  },
                    { label:'Country',   value:p.country, icon:MapPin  },
                    { label:'Joined',    value:fmtDate(p.joined), icon:Calendar },
                  ].map(r=>{
                    const I=r.icon;
                    return (
                      <div key={r.label} className="pp-row" style={{ display:'flex',alignItems:'center',justifyContent:'space-between',padding:'11px 0' }}>
                        <div style={{ display:'flex',alignItems:'center',gap:8 }}>
                          <I size={13} style={{ color:'#9ca3af' }}/>
                          <span style={{ fontSize:13,color:'#6b7280' }}>{r.label}</span>
                        </div>
                        <span style={{ fontSize:13,fontWeight:600,color:'#111827' }}>{r.value||'—'}</span>
                      </div>
                    );
                  })}
                </div>

                <div className="pp-card" style={{ padding:'24px 28px' }}>
                  <h3 style={{ fontSize:14,fontWeight:700,color:'#111827',margin:'0 0 16px' }}>Commission & Payout</h3>
                  {[
                    { label:'Commission type',  value:p.commission_type },
                    { label:'Rate',             value:p.commission_type==='percentage'?`${p.commission_rate}%`:`KES ${p.fixed_amount}` },
                    { label:'Payout method',    value:p.payout_method },
                    { label:'Payout frequency', value:p.payout_frequency },
                    { label:'M-Pesa number',    value:p.mpesa_number },
                  ].map(r=>(
                    <div key={r.label} className="pp-row" style={{ display:'flex',justifyContent:'space-between',alignItems:'center',padding:'10px 0' }}>
                      <span style={{ fontSize:13,color:'#6b7280' }}>{r.label}</span>
                      <span style={{ fontSize:13,fontWeight:600,color:'#111827',textTransform:'capitalize' }}>{r.value||'—'}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </main>
      </div>
    </>
  );
}