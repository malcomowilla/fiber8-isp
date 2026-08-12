/**
 * HotspotCustomerPortal.jsx
 *
 * Self-service portal for hotspot customers. They log in with their
 * voucher/credentials, then can:
 *   - Check data balance & expiry
 *   - View connected devices
 *   - Add their own device/TV for MAC bypass
 *   - Buy more data / renew plan
 *
 * API endpoints expected:
 *   POST /api/hotspot/portal/login          { username, password } → { token, customer }
 *   GET  /api/hotspot/portal/session        (Bearer token)         → { balance_mb, expiry, plan, sessions }
 *   GET  /api/hotspot/portal/my_devices     (Bearer token)         → [{ id, mac, name, status }]
 *   POST /api/hotspot/portal/add_device     (Bearer token)         { mac_address, device_name }
 *   DELETE /api/hotspot/portal/devices/:id  (Bearer token)
 *   GET  /api/hotspot/portal/plans          (Bearer token)         → [{ id, name, price, data_mb, days }]
 *   POST /api/hotspot/portal/renew          (Bearer token)         { plan_id }
 */

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Wifi, LogIn, LogOut, Shield, Tv, Monitor, Smartphone,
  Printer, Router, Plus, Trash2, RefreshCw, ChevronRight,
  CheckCircle, AlertCircle, Zap, Clock, Database,
  CreditCard, Eye, EyeOff, X, Loader, Signal,
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { useLayoutEffect } from "react";


// ─── CSS ──────────────────────────────────────────────────────────────────────
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');

  .cp-root *, .cp-root *::before, .cp-root *::after { box-sizing: border-box; margin:0; padding:0; }
  .cp-root {  min-height:100vh; }

  @keyframes cp-spin  { to { transform: rotate(360deg); } }
  @keyframes cp-up    { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
  @keyframes cp-pop   { from { opacity:0; transform:scale(.92); } to { opacity:1; transform:scale(1); } }
  @keyframes cp-glow  { 0%,100% { box-shadow:0 0 0 0 rgba(16,185,129,.35); } 70% { box-shadow:0 0 0 10px rgba(16,185,129,0); } }
  @keyframes cp-float { 0%,100% { transform:translateY(0); } 50% { transform:translateY(-6px); } }
  @keyframes cp-wave  {
    0%   { background-position: 200% center; }
    100% { background-position: -200% center; }
  }

  /* Background */
  .cp-bg {
    position: fixed; inset: 0; z-index: 0;
    background: #030712;
    overflow: hidden;
  }
  .cp-bg::before {
    content: '';
    position: absolute; inset: 0;
    background:
      radial-gradient(ellipse 60% 50% at 20% 20%, rgba(16,185,129,.12) 0%, transparent 60%),
      radial-gradient(ellipse 50% 60% at 80% 80%, rgba(6,182,212,.1) 0%, transparent 60%),
      radial-gradient(ellipse 40% 40% at 50% 50%, rgba(99,102,241,.06) 0%, transparent 70%);
  }
    .pm-input  { width:100%; padding:9px 13px; font-size:13px; font-family:'DM Sans',sans-serif; border:1.5px solid #e5e7eb; border-radius:9px; outline:none; color:#111827; background:#fff; transition:border .18s,box-shadow .18s; }
      .pm-select { appearance:none; cursor:pointer; }


  .cp-grid {
    position: absolute; inset: 0;
    background-image:
      linear-gradient(rgba(255,255,255,.025) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,.025) 1px, transparent 1px);
    background-size: 48px 48px;
  }

  .cp-content { position: relative; z-index: 1; }

  /* Cards */
  .cp-glass {
    background: rgba(255,255,255,.04);
    border: 1px solid rgba(255,255,255,.08);
    border-radius: 20px;
    backdrop-filter: blur(20px);
  }
  .cp-card {
    background: rgba(255,255,255,.05);
    border: 1px solid rgba(255,255,255,.09);
    border-radius: 16px;
  }

  /* Inputs */
  .cp-input {
    width: 100%; padding: 12px 16px;
    font-size: 14px; font-family: 'Plus Jakarta Sans', sans-serif;
    background: rgba(255,255,255,.06);
    border: 1px solid rgba(255,255,255,.12);
    border-radius: 12px; outline: none;
    color: #f1f5f9; transition: border-color .2s, box-shadow .2s;
  }
  .cp-input:focus { border-color: rgba(16,185,129,.6); box-shadow: 0 0 0 3px rgba(16,185,129,.1); }
  .cp-input::placeholder { color: rgba(255,255,255,.25); }

  /* Buttons */
  .cp-btn-primary {
    width: 100%; padding: 13px 20px; font-size: 15px; font-weight: 700;
    font-family: 'Plus Jakarta Sans', sans-serif; cursor: pointer; border: none;
    border-radius: 12px; color: #fff;
    background: linear-gradient(135deg, #10b981, #059669);
    transition: transform .15s, box-shadow .15s;
    display: flex; align-items: center; justify-content: center; gap: 8px;
  }
  .cp-btn-primary:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 8px 24px rgba(16,185,129,.35); }
  .cp-btn-primary:disabled { opacity: .5; cursor: not-allowed; }

  .cp-btn-sm {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 8px 14px; font-size: 12px; font-weight: 600;
    font-family: 'Plus Jakarta Sans', sans-serif; cursor: pointer;
    border-radius: 8px; border: 1px solid rgba(255,255,255,.12);
    background: rgba(255,255,255,.06); color: rgba(255,255,255,.7);
    transition: all .15s;
  }
  .cp-btn-sm:hover { background: rgba(255,255,255,.1); color: #fff; border-color: rgba(255,255,255,.2); }

  .cp-btn-danger {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 6px 10px; font-size: 11px; font-weight: 600;
    font-family: 'Plus Jakarta Sans', sans-serif; cursor: pointer;
    border-radius: 7px; border: 1px solid rgba(239,68,68,.3);
    background: rgba(239,68,68,.08); color: #f87171;
    transition: all .15s;
  }
  .cp-btn-danger:hover { background: rgba(239,68,68,.16); border-color: rgba(239,68,68,.5); }

  .cp-btn-plan {
    width: 100%; padding: 16px; text-align: left; cursor: pointer;
    border-radius: 14px; border: 1.5px solid rgba(255,255,255,.1);
    background: rgba(255,255,255,.04); font-family: 'Plus Jakarta Sans', sans-serif;
    color: #f1f5f9; transition: all .18s;
    display: flex; align-items: center; justify-content: space-between; gap:12;
  }
  .cp-btn-plan:hover { border-color: rgba(16,185,129,.4); background: rgba(16,185,129,.06); }
  .cp-btn-plan.selected { border-color: #10b981; background: rgba(16,185,129,.1); }

  /* Nav tabs */
  .cp-tab {
    display: flex; align-items: center; gap: 7px;
    padding: 9px 16px; border-radius: 10px; cursor: pointer;
    font-size: 13px; font-weight: 600;
    background: none; border: none; font-family: 'Plus Jakarta Sans', sans-serif;
    color: rgba(255,255,255,.45); transition: all .18s;
    white-space: nowrap;
  }
  .cp-tab:hover { color: rgba(255,255,255,.75); background: rgba(255,255,255,.05); }
  .cp-tab.active { color: #10b981; background: rgba(16,185,129,.1); }

  /* Progress bar */
  .cp-bar-track { height: 8px; background: rgba(255,255,255,.08); border-radius: 99px; overflow: hidden; }
  .cp-bar-fill  { height: 100%; border-radius: 99px; transition: width .8s cubic-bezier(.4,0,.2,1); }

  /* Modal */
  .cp-modal-bg {
    position: fixed; inset: 0; z-index: 999;
    background: rgba(0,0,0,.7); backdrop-filter: blur(8px);
    display: flex; align-items: center; justify-content: center; padding: 24px;
  }
  .cp-modal {
    background: #0f172a; border: 1px solid rgba(255,255,255,.1);
    border-radius: 20px; padding: 28px; width: 100%; max-width: 420px;
    box-shadow: 0 32px 64px rgba(0,0,0,.5);
    animation: cp-pop .22s cubic-bezier(.34,1.56,.64,1) both;
  }

  /* MAC row */
  .cp-mac { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: rgba(255,255,255,.4); }

  .cp-device-row {
    display: flex; align-items: center; gap: 12px;
    padding: 12px 16px; border-radius: 12px;
    border: 1px solid rgba(255,255,255,.07);
    background: rgba(255,255,255,.03);
    transition: border-color .15s;
    animation: cp-up .2s ease both;
  }
  .cp-device-row:hover { border-color: rgba(255,255,255,.12); }

  .cp-spinner {
    width: 16px; height: 16px; border-radius: 50%;
    border: 2px solid rgba(255,255,255,.2); border-top-color: #10b981;
    animation: cp-spin 1s linear infinite; display: inline-block;
  }

  .cp-select {
    width: 100%; padding: 11px 16px; font-size: 14px;
    font-family: 'Plus Jakarta Sans', sans-serif;
    background: rgba(255,255,255,.06); border: 1px solid rgba(255,255,255,.12);
    border-radius: 12px; outline: none; color: #f1f5f9;
    cursor: pointer; appearance: none;
    transition: border-color .2s;
  }
  .cp-select:focus { border-color: rgba(16,185,129,.6); }
  .cp-select option { background: #0f172a; color: #f1f5f9; }

  .cp-stat {
    flex: 1; padding: 18px; border-radius: 16px;
    background: rgba(255,255,255,.04); border: 1px solid rgba(255,255,255,.08);
    display: flex; flex-direction: column; gap: 6px;
  }
`;

// ─── Helpers ──────────────────────────────────────────────────────────────────
const subdomain = () => window.location.hostname.split('.')[0];

function validateMac(mac) {
  return /^([0-9A-Fa-f]{2}[:\-]){5}[0-9A-Fa-f]{2}$/.test(mac.trim());
}

function formatMac(raw) {
  const clean = raw.replace(/[^0-9a-fA-F]/g, '').slice(0, 12);
  return clean.match(/.{1,2}/g)?.join(':') || clean;
}

function formatMb(mb) {
  if (!mb && mb !== 0) return '—';
  if (mb >= 1024) return `${(mb / 1024).toFixed(1)} GB`;
  return `${mb} MB`;
}

const DEVICE_TYPES = [
  { value:'tv',      label:'Smart TV',     Icon: Tv },
  { value:'monitor', label:'PC/Monitor',   Icon: Monitor },
  { value:'phone',   label:'Phone/Tablet', Icon: Smartphone },
  { value:'printer', label:'Printer',      Icon: Printer },
  { value:'router',  label:'Router',       Icon: Router },
  { value:'other',   label:'Other',        Icon: Wifi },
];

function DeviceIcon({ type, size = 16 }) {
  const found = DEVICE_TYPES.find(d => d.value === type);
  const Icon  = found?.Icon || Wifi;
  return <Icon size={size}/>;
}

// ─── Login Screen ─────────────────────────────────────────────────────────────
function LoginScreen({ onLogin }) {
  const [form, setForm] = useState({ username:'', password:'' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!form.username.trim() || !form.password) { toast.error('Enter your username and password'); return; }
    setLoading(true);
    try {
      const res = await fetch('/api/hotspot/portal/login', {
        method: 'POST',
        headers: { 'Content-Type':'application/json', 'X-Subdomain': subdomain() },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error || 'Invalid credentials'); return; }
      onLogin(data.token, data.customer);
    } catch { toast.error('Could not connect. Check your connection.'); } finally { setLoading(false); }
  };

  return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'100vh', padding:24 }}>
      <motion.div initial={{ opacity:0, y:24 }} animate={{ opacity:1, y:0 }} transition={{ duration:.4, type:'spring', stiffness:120 }}
        style={{ width:'100%', maxWidth:380 }}>

        {/* Logo area */}
        <div style={{ textAlign:'center', marginBottom:36 }}>
          <div style={{ width:64, height:64, borderRadius:20, background:'linear-gradient(135deg,#10b981,#059669)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px', animation:'cp-float 3s ease-in-out infinite' }}>
            <Wifi size={28} color="#fff"/>
          </div>
          <h1 style={{ fontSize:26, fontWeight:800, color:'#f1f5f9', letterSpacing:'-.02em' }}>Customer Portal</h1>
          <p style={{ fontSize:13, color:'rgba(255,255,255,.4)', marginTop:6 }}>Sign in to manage your hotspot account</p>
        </div>

        <div className="cp-glass" style={{ padding:28 }}>
          <div style={{ marginBottom:14 }}>
            <label style={{ fontSize:12, fontWeight:600, color:'rgba(255,255,255,.5)', display:'block', marginBottom:6, letterSpacing:'.04em', textTransform:'uppercase' }}>Username</label>
            <input className="cp-input" value={form.username} onChange={e => setForm(p => ({...p, username:e.target.value}))}
              placeholder="Your voucher / username" onKeyDown={e => e.key==='Enter' && submit()}/>
          </div>
          <div style={{ marginBottom:22 }}>
            <label style={{ fontSize:12, fontWeight:600, color:'rgba(255,255,255,.5)', display:'block', marginBottom:6, letterSpacing:'.04em', textTransform:'uppercase' }}>Password</label>
            <div style={{ position:'relative' }}>
              <input className="cp-input" type={showPw ? 'text' : 'password'} value={form.password}
                onChange={e => setForm(p => ({...p, password:e.target.value}))}
                placeholder="••••••••" style={{ paddingRight:44 }} onKeyDown={e => e.key==='Enter' && submit()}/>
              <button onClick={() => setShowPw(p=>!p)} style={{ position:'absolute', right:14, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:'rgba(255,255,255,.35)' }}>
                {showPw ? <EyeOff size={15}/> : <Eye size={15}/>}
              </button>
            </div>
          </div>
          <button className="cp-btn-primary" onClick={submit} disabled={loading}>
            {loading ? <span className="cp-spinner"/> : <LogIn size={16}/>}
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </div>

        <p style={{ textAlign:'center', fontSize:12, color:'rgba(255,255,255,.2)', marginTop:20 }}>
          Use the username & password from your hotspot voucher
        </p>
      </motion.div>
    </div>
  );
}


function Field({ label, required, hint, children }) {
  return (
    <div style={{ marginBottom:16 }}>
      <label style={{ display:'block', fontSize:12, fontWeight:600, color:'#374151', marginBottom:5,
         textTransform:'uppercase', letterSpacing:'.05em' }}>
        {label}{required && <span style={{ color:'#ef4444', marginLeft:2 }}>*</span>}
      </label>
      {children}
      {hint && <p style={{ fontSize:11, color:'#9ca3af', marginTop:4, margin:'4px 0 0' }}>{hint}</p>}
    </div>
  );
}

// ─── Add Device Modal ─────────────────────────────────────────────────────────
function AddDeviceModal({ token, onClose, onAdded }) {
  const [form, setForm] = useState({ mac:'', name:'', device_type:'tv' });
  const [saving, setSaving] = useState(false);
  const [macErr, setMacErr] = useState('');

  const handleMac = (e) => {
    const v = formatMac(e.target.value);
    setForm(p => ({...p, mac:v}));
    if (macErr && validateMac(v)) setMacErr('');
  };

  const submit = async () => {
    if (!validateMac(form.mac)) { setMacErr('Enter a valid MAC (AA:BB:CC:DD:EE:FF)'); return; }
    if (!form.name.trim()) { toast.error('Enter a device name'); return; }
    setSaving(true);
    try {
      const res = await fetch('/api/hotspot/portal/add_device', {
        method: 'POST',
        headers: { 'Content-Type':'application/json', 'Authorization':`Bearer ${token}`, 'X-Subdomain': subdomain() },
        body: JSON.stringify({ mac_address: form.mac, device_name: form.name, device_type: form.device_type }),
      });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error || 'Failed'); return; }
      toast.success(`${form.name} added — it won't see the login page!`);
      onAdded(data);
      onClose();
    } catch { toast.error('Network error'); } finally { setSaving(false); }
  };

  return (
    <div className="cp-modal-bg font-sans
" >
      <div className="cp-modal" onClick={e => e.stopPropagation()}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:22 }}>
          <div>
            <h3 style={{ fontSize:18, fontWeight:800, color:'#f1f5f9' }}>Add Your Device</h3>
            <p style={{ fontSize:12, color:'rgba(255,255,255,.4)', marginTop:2 }}>Bypass hotspot login for your TV or device</p>
          </div>
          <button onClick={onClose} style={{ background:'none', border:'none', cursor:'pointer', 
            color:'rgba(255,255,255,.4)', padding:4 }}><X size={18}/></button>
        </div>


        {/* Type selector */}
        <div style={{ marginBottom:16 }}>
          <label style={{ fontSize:11, fontWeight:700, color:'rgba(255,255,255,.4)', display:'block', marginBottom:8, textTransform:'uppercase', letterSpacing:'.04em' }}>Device Type</label>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:6 }}>
            {DEVICE_TYPES.map(d => (
              <button key={d.value} onClick={() => setForm(p => ({...p, device_type:d.value}))} style={{
                padding:'9px 6px', borderRadius:10, cursor:'pointer', fontFamily:'Plus Jakarta Sans,sans-serif',
                border: form.device_type===d.value ? '1.5px solid #10b981' : '1px solid rgba(255,255,255,.1)',
                background: form.device_type===d.value ? 'rgba(16,185,129,.1)' : 'rgba(255,255,255,.03)',
                color: form.device_type===d.value ? '#10b981' : 'rgba(255,255,255,.4)',
                display:'flex', flexDirection:'column', alignItems:'center', gap:4,
                fontSize:10, fontWeight:700, transition:'all .15s',
              }}>
                <d.Icon size={15}/>{d.label}
              </button>
            ))}
          </div>
        </div>

        <div style={{ marginBottom:12 }}>
          <label style={{ fontSize:11, fontWeight:700, color:'rgba(255,255,255,.4)', display:'block', marginBottom:6, textTransform:'uppercase', letterSpacing:'.04em' }}>Device Name</label>
          <input className="cp-input" value={form.name} onChange={e => setForm(p=>({...p,name:e.target.value}))} placeholder="My Samsung TV, Bedroom TV…"/>
        </div>


        <Field label="Status">
                    <select className="pm-input pm-select" value={form.status} onChange={e=>set('status',e.target.value)}>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="pending">Pending</option>
                    </select>
                  </Field>


        <div style={{ marginBottom:20 }}>
          <label style={{ fontSize:11, fontWeight:700, color:'rgba(255,255,255,.4)', display:'block', marginBottom:6, textTransform:'uppercase', letterSpacing:'.04em' }}>MAC Address</label>
          <input className="cp-input" value={form.mac} onChange={handleMac} placeholder="AA:BB:CC:DD:EE:FF"
            style={{ fontFamily:'JetBrains Mono,monospace' }}/>
          {macErr && <p style={{ fontSize:11, color:'#f87171', marginTop:4 }}>{macErr}</p>}
          <p style={{ fontSize:11, color:'rgba(255,255,255,.25)', marginTop:4 }}>
            TV: Settings → Network → MAC Address
          </p>
        </div>

        <div style={{ display:'flex', gap:10 }}>
          <button onClick={onClose} className="cp-btn-sm" style={{ flex:1, justifyContent:'center' }}>Cancel</button>
          <button onClick={submit} disabled={saving} className="cp-btn-primary" style={{ flex:2 }}>
            {saving ? <span className="cp-spinner"/> : <Shield size={14}/>}
            {saving ? 'Adding…' : 'Bypass This Device'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Renew Plan Modal ─────────────────────────────────────────────────────────
function RenewModal({ token, onClose, onRenewed }) {
  const [plans, setPlans]       = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading]   = useState(true);
  const [paying, setPaying]     = useState(false);

  useEffect(() => {
    fetch('/api/allow_get_hotspot_packages', { headers:{ 'Authorization':`Bearer ${token}`, 'X-Subdomain':subdomain() } })
      .then(r => r.json()).then(d => { setPlans(Array.isArray(d) ? d : d.plans || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [token]);

  const renew = async () => {
    if (!selected) { toast.error('Select a plan'); return; }
    setPaying(true);
    try {
      const res = await fetch('/api/hotspot/portal/renew', {
        method:'POST',
        headers:{ 'Content-Type':'application/json', 'Authorization':`Bearer ${token}`, 'X-Subdomain':subdomain() },
        body: JSON.stringify({ plan_id: selected }),
      });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error || 'Renewal failed'); return; }
      toast.success('Plan renewed successfully!');
      onRenewed(data);
      onClose();
    } catch { toast.error('Network error'); } finally { setPaying(false); }
  };

  return (
    <div className="cp-modal-b font-sans
g" >
      <div className="cp-modal" onClick={e=>e.stopPropagation()} style={{ maxWidth:460 }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:22 }}>
          <div>
            <h3 style={{ fontSize:18, fontWeight:800, color:'#f1f5f9' }}>Buy Data / Renew Plan</h3>
            <p style={{ fontSize:12, color:'rgba(255,255,255,.4)', marginTop:2 }}>Select a package to continue browsing</p>
          </div>
          <button onClick={onClose} style={{ background:'none', border:'none', cursor:'pointer', color:'rgba(255,255,255,.4)', padding:4 }}><X size={18}/></button>
        </div>

        {loading ? (
          <div style={{ textAlign:'center', padding:'32px 0' }}>
            <span className="cp-spinner" style={{ width:24, height:24 }}/>
          </div>
        ) : plans.length === 0 ? (
          <p style={{ textAlign:'center', color:'rgba(255,255,255,.3)', padding:'24px 0', fontSize:13 }}>No plans available</p>
        ) : (
          <div style={{ display:'flex', flexDirection:'column', gap:8, marginBottom:20 }}>
            {plans.map(plan => (
              <button key={plan.id} onClick={() => setSelected(plan.id)}
                className={`cp-btn-plan ${selected===plan.id?'selected':''}`}>
                <div>
                  <p style={{ fontSize:14, fontWeight:700, color:'#f1f5f9' }}>{plan.name}</p>
                  <p style={{ fontSize:12, color:'rgba(255,255,255,.4)', marginTop:2 }}>
                    {formatMb(plan?.speed)} · {plan?.valid} day{plan?.days!==1?'s':''}
                  </p>
                </div>
                <div style={{ textAlign:'right', flexShrink:0 }}>
                  <p style={{ fontSize:18, fontWeight:800, color:'#10b981' }}>
                    KES {plan?.price?.toLocaleString()}
                  </p>
                  {selected===plan?.id && <CheckCircle size={16} style={{ color:'#10b981', marginTop:4 }}/>}
                </div>
              </button>
            ))}
          </div>
        )}

        <div style={{ display:'flex', gap:10 }}>
          <button onClick={onClose} className="cp-btn-sm" style={{ flex:1, justifyContent:'center' }}>Cancel</button>
          <button onClick={renew} disabled={paying || !selected} className="cp-btn-primary" style={{ flex:2 }}>
            {paying ? <span className="cp-spinner"/> : <CreditCard size={14}/>}
            {paying ? 'Processing…' : 'Confirm & Pay'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Dashboard ────────────────────────────────────────────────────────────────
function Dashboard({ token, customer, onLogout }) {
  const [tab,      setTab]      = useState('overview');
  const [session,  setSession]  = useState(null);
  const [devices,  setDevices]  = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [showAdd,  setShowAdd]  = useState(false);
  const [showRenew,setShowRenew]= useState(false);
  const [deleting, setDeleting] = useState(null);

  const headers = useCallback(() => ({
    'Authorization': `Bearer ${token}`, 'X-Subdomain': subdomain(),
  }), [token]);

  const loadSession = useCallback(async () => {
    try {
      const [sRes, dRes] = await Promise.all([
        fetch('/api/hotspot/portal/session',    { headers: headers() }),
        fetch('/api/hotspot/portal/my_devices', { headers: headers() }),
      ]);
      const sData = await sRes.json();
      const dData = await dRes.json();
      setSession(sData);
      setDevices(Array.isArray(dData) ? dData : dData.devices || []);
    } catch { toast.error('Failed to load data'); } finally { setLoading(false); }
  }, [headers]);

  useEffect(() => { loadSession(); }, [loadSession]);

  const removeDevice = async (d) => {
    setDeleting(d.id);
    try {
      const res = await fetch(`/api/hotspot/portal/devices/${d.id}`, {
        method:'DELETE', headers: headers(),
      });
      if (!res.ok) { toast.error('Failed to remove'); return; }
      toast.success(`${d.device_name} removed`);
      setDevices(p => p.filter(x => x.id !== d.id));
    } catch { toast.error('Network error'); } finally { setDeleting(null); }
  };

  const usedPct = session
    ? Math.min(100, ((session.used_mb || 0) / (session.total_mb || 1)) * 100)
    : 0;
  const remaining = session ? (session.total_mb || 0) - (session.used_mb || 0) : 0;

  const TABS = [
    { id:'overview', label:'Overview',  Icon: Signal },
    { id:'devices',  label:'My Devices',Icon: Tv, badge: devices.length },
    { id:'renew',    label:'Buy Data',  Icon: Zap },
  ];

  return (
    <div style={{ minHeight:'100vh', padding:'24px 16px' }} className='font-sans
'> 
      {showAdd   && <AddDeviceModal  token={token} onClose={()=>setShowAdd(false)}   onAdded={d => setDevices(p=>[d,...p])}/>}
      {showRenew && <RenewModal      token={token} onClose={()=>setShowRenew(false)} onRenewed={()=>loadSession()}/>}

      <div style={{ maxWidth:600, margin:'0 auto' }}>

        {/* Top bar */}
        <motion.div initial={{opacity:0,y:-10}} animate={{opacity:1,y:0}} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:24 }}>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <div style={{ width:38, height:38, borderRadius:12, background:'linear-gradient(135deg,#10b981,#059669)', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <Wifi size={18} color="#fff"/>
            </div>
            <div>
              <p style={{ fontSize:15, fontWeight:700, color:'#f1f5f9' }}>{customer?.username || 'My Account'}</p>
              <p style={{ fontSize:11, color:'rgba(255,255,255,.35)' }}>Hotspot Customer Portal</p>
            </div>
          </div>
          <button onClick={onLogout} className="cp-btn-sm">
            <LogOut size={13}/> Sign Out
          </button>
        </motion.div>

        {/* Nav */}
        <div style={{ display:'flex', gap:4, padding:'6px', background:'rgba(255,255,255,.04)', borderRadius:14, border:'1px solid rgba(255,255,255,.07)', marginBottom:24, overflowX:'auto' }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} className={`cp-tab ${tab===t.id?'active':''}`}>
              <t.Icon size={14}/>
              {t.label}
              {t.badge > 0 && (
                <span style={{ background:'rgba(16,185,129,.2)', color:'#10b981', borderRadius:20, padding:'1px 7px', fontSize:10, fontWeight:700 }}>
                  {t.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">

          {/* ── Overview ── */}
          {tab === 'overview' && (
            <motion.div key="overview" initial={{opacity:0,x:12}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-12}} transition={{duration:.18}}>
              {loading ? (
                <div style={{ textAlign:'center', padding:'48px 0' }}>
                  <span className="cp-spinner" style={{ width:28, height:28, borderWidth:3 }}/>
                </div>
              ) : (
                <div style={{ display:'flex', flexDirection:'column', gap:14 }}>

                  {/* Data balance card */}
                  <div className="cp-glass" style={{ padding:24 }}>
                    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:18 }}>
                      <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                        <Database size={16} style={{ color:'#10b981' }}/>
                        <span style={{ fontSize:13, fontWeight:700, color:'rgba(255,255,255,.7)' }}>Data Balance</span>
                      </div>
                      <button className="cp-btn-sm" onClick={loadSession}><RefreshCw size={12}/></button>
                    </div>

                    <div style={{ marginBottom:16 }}>
                      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom:8 }}>
                        <span style={{ fontSize:32, fontWeight:800, color:'#f1f5f9', fontFamily:'Plus Jakarta Sans,sans-serif' }}>
                          {formatMb(remaining)}
                        </span>
                        <span style={{ fontSize:13, color:'rgba(255,255,255,.35)' }}>of {formatMb(session?.total_mb)} remaining</span>
                      </div>
                      <div className="cp-bar-track">
                        <div className="cp-bar-fill" style={{
                          width: `${100 - usedPct}%`,
                          background: usedPct > 80
                            ? 'linear-gradient(90deg,#ef4444,#f97316)'
                            : usedPct > 50
                              ? 'linear-gradient(90deg,#eab308,#f59e0b)'
                              : 'linear-gradient(90deg,#10b981,#06b6d4)',
                        }}/>
                      </div>
                    </div>

                    {/* Stats row */}
                    <div style={{ display:'flex', gap:10 }}>
                      <div className="cp-stat">
                        <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                          <Clock size={12} style={{ color:'rgba(255,255,255,.35)' }}/>
                          <span style={{ fontSize:11, color:'rgba(255,255,255,.35)', fontWeight:600, textTransform:'uppercase', letterSpacing:'.04em' }}>Expires</span>
                        </div>
                        <p style={{ fontSize:14, fontWeight:700, color:'#f1f5f9' }}>
                          {session?.expiry ? new Date(session.expiry).toLocaleDateString('en-KE',{day:'numeric',month:'short',year:'numeric'}) : '—'}
                        </p>
                      </div>
                      <div className="cp-stat">
                        <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                          <Signal size={12} style={{ color:'rgba(255,255,255,.35)' }}/>
                          <span style={{ fontSize:11, color:'rgba(255,255,255,.35)', fontWeight:600, textTransform:'uppercase', letterSpacing:'.04em' }}>Plan</span>
                        </div>
                        <p style={{ fontSize:14, fontWeight:700, color:'#f1f5f9' }}>{session?.plan || '—'}</p>
                      </div>
                      <div className="cp-stat">
                        <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                          <Wifi size={12} style={{ color:'rgba(255,255,255,.35)' }}/>
                          <span style={{ fontSize:11, color:'rgba(255,255,255,.35)', fontWeight:600, textTransform:'uppercase', letterSpacing:'.04em' }}>Sessions</span>
                        </div>
                        <p style={{ fontSize:14, fontWeight:700, color:'#f1f5f9' }}>{session?.sessions ?? '—'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Quick actions */}
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
                    <button onClick={() => setShowRenew(true)} style={{
                      padding:'18px 16px', borderRadius:16, cursor:'pointer', border:'1px solid rgba(16,185,129,.2)',
                      background:'rgba(16,185,129,.07)', display:'flex', flexDirection:'column', alignItems:'flex-start', gap:8,
                      transition:'all .15s', fontFamily:'Plus Jakarta Sans,sans-serif',
                    }}
                    onMouseEnter={e=>{e.currentTarget.style.background='rgba(16,185,129,.14)';e.currentTarget.style.borderColor='rgba(16,185,129,.4)'}}
                    onMouseLeave={e=>{e.currentTarget.style.background='rgba(16,185,129,.07)';e.currentTarget.style.borderColor='rgba(16,185,129,.2)'}}>
                      <Zap size={20} style={{ color:'#10b981' }}/>
                      <div style={{ textAlign:'left' }}>
                        <p style={{ fontSize:13, fontWeight:700, color:'#f1f5f9' }}>Buy Data</p>
                        <p style={{ fontSize:11, color:'rgba(255,255,255,.35)' }}>Top up or renew plan</p>
                      </div>
                    </button>

                    <button onClick={() => { setTab('devices'); setShowAdd(true); }} style={{
                      padding:'18px 16px', borderRadius:16, cursor:'pointer', border:'1px solid rgba(6,182,212,.2)',
                      background:'rgba(6,182,212,.07)', display:'flex', flexDirection:'column', alignItems:'flex-start', gap:8,
                      transition:'all .15s', fontFamily:'Plus Jakarta Sans,sans-serif',
                    }}
                    onMouseEnter={e=>{e.currentTarget.style.background='rgba(6,182,212,.14)';e.currentTarget.style.borderColor='rgba(6,182,212,.4)'}}
                    onMouseLeave={e=>{e.currentTarget.style.background='rgba(6,182,212,.07)';e.currentTarget.style.borderColor='rgba(6,182,212,.2)'}}>
                      <Tv size={20} style={{ color:'#06b6d4' }}/>
                      <div style={{ textAlign:'left' }}>
                        <p style={{ fontSize:13, fontWeight:700, color:'#f1f5f9' }}>Add TV/Device</p>
                        <p style={{ fontSize:11, color:'rgba(255,255,255,.35)' }}>No login page for device</p>
                      </div>
                    </button>
                  </div>

                  {/* Low data warning */}
                  {usedPct > 80 && (
                    <motion.div initial={{opacity:0}} animate={{opacity:1}} style={{ padding:'14px 16px', borderRadius:12, background:'rgba(239,68,68,.08)', border:'1px solid rgba(239,68,68,.2)', display:'flex', gap:10, alignItems:'flex-start' }}>
                      <AlertCircle size={15} style={{ color:'#f87171', flexShrink:0, marginTop:2 }}/>
                      <div>
                        <p style={{ fontSize:13, fontWeight:600, color:'#fca5a5' }}>Data running low</p>
                        <p style={{ fontSize:12, color:'rgba(255,255,255,.4)', marginTop:2 }}>You've used {usedPct.toFixed(0)}% of your data. Top up to stay connected.</p>
                        <button onClick={() => setShowRenew(true)} style={{ marginTop:8, fontSize:12, fontWeight:700, color:'#f87171', background:'none', border:'none', cursor:'pointer', padding:0, display:'flex', alignItems:'center', gap:4 }}>
                          Buy more data <ChevronRight size={13}/>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </div>
              )}
            </motion.div>
          )}

          {/* ── My Devices ── */}
          {tab === 'devices' && (
            <motion.div key="devices" initial={{opacity:0,x:12}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-12}} transition={{duration:.18}}>
              <div className="cp-glass" style={{ padding:20 }}>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
                  <div>
                    <h3 style={{ fontSize:15, fontWeight:700, color:'#f1f5f9' }}>Bypassed Devices</h3>
                    <p style={{ fontSize:12, color:'rgba(255,255,255,.35)', marginTop:2 }}>These devices skip the login page</p>
                  </div>
                  <button className="cp-btn-sm" onClick={() => setShowAdd(true)}>
                    <Plus size={13}/> Add Device
                  </button>
                </div>

                {devices.length === 0 ? (
                  <div style={{ textAlign:'center', padding:'36px 16px' }}>
                    <Tv size={32} style={{ color:'rgba(255,255,255,.15)', marginBottom:10 }}/>
                    <p style={{ fontSize:13, color:'rgba(255,255,255,.3)', marginBottom:14 }}>No devices added yet</p>
                    <button className="cp-btn-sm" onClick={() => setShowAdd(true)} style={{ margin:'0 auto' }}>
                      <Plus size={13}/> Add your TV or device
                    </button>
                  </div>
                ) : (
                  <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
                    <AnimatePresence>
                      {devices.map((d, i) => (
                        <motion.div key={d.id} className="cp-device-row"
                          initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} exit={{opacity:0,x:-16}}
                          transition={{duration:.16, delay: i*.05}}>
                          <div style={{ width:36, height:36, borderRadius:10, background:'rgba(6,182,212,.1)', display:'flex', alignItems:'center', justifyContent:'center', color:'#06b6d4', flexShrink:0 }}>
                            <DeviceIcon type={d.device_type}/>
                          </div>
                          <div style={{ flex:1, minWidth:0 }}>
                            <p style={{ fontSize:13, fontWeight:600, color:'#f1f5f9', overflow:'hidden', textOverflow:'ellipsis',
                               whiteSpace:'nowrap' }}>{d.device_name}</p>
                            <p className="cp-mac">{d.mac_address}</p>
                          </div>
                          <div style={{ display:'flex', alignItems:'center', gap:8, flexShrink:0 }}>
                            <span style={{ fontSize:10, padding:'3px 8px', borderRadius:20, fontWeight:700,
                              background: d.status==='active' ? 'rgba(16,185,129,.15)' : 'rgba(234,179,8,.15)',
                              color: d.status==='active' ? '#34d399' : '#fbbf24' }}>
                              {d.status || 'Active'}
                            </span>
                            <button className="cp-btn-danger" onClick={() => removeDevice(d)} disabled={deleting===d.id}>
                              {deleting===d.id ? <span className="cp-spinner" style={{ width:11, height:11, borderWidth:1.5 }}/> : <Trash2 size={11}/>}
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </div>

              <div style={{ marginTop:12, padding:'12px 14px', borderRadius:10, background:'rgba(6,182,212,.06)', border:'1px solid rgba(6,182,212,.15)' }}>
                <p style={{ fontSize:12, color:'rgba(6,182,212,.8)', lineHeight:1.6 }}>
                  ℹ️ Devices you add here connect to the Wi-Fi normally but will <strong>never see the login page</strong>. Perfect for smart TVs, streaming sticks, and game consoles.
                </p>
              </div>
            </motion.div>
          )}

          {/* ── Buy Data ── */}
          {tab === 'renew' && (
            <motion.div key="renew" initial={{opacity:0,x:12}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-12}} transition={{duration:.18}}>
              <div className="cp-glass" style={{ padding:24 }}>
                <div style={{ textAlign:'center', marginBottom:24 }}>
                  <div style={{ width:52, height:52, borderRadius:16, background:'linear-gradient(135deg,rgba(16,185,129,.2),rgba(6,182,212,.2))', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 14px' }}>
                    <Zap size={24} style={{ color:'#10b981' }}/>
                  </div>
                  <h3 style={{ fontSize:18, fontWeight:800, color:'#f1f5f9' }}>Top Up Data</h3>
                  <p style={{ fontSize:13, color:'rgba(255,255,255,.4)', marginTop:4 }}>Choose a package to renew your access</p>
                </div>
                <button className="cp-btn-primary" onClick={() => setShowRenew(true)}>
                  <CreditCard size={15}/> View Available Plans
                </button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}

// ─── Root Component ───────────────────────────────────────────────────────────
export default function HotspotCustomerPortal() {
  const [token,    setToken]    = useState(() => sessionStorage.getItem('hsp_token') || null);
  const [customer, setCustomer] = useState(() => { try { return JSON.parse(sessionStorage.getItem('hsp_customer')); } catch { return null; } });

  const handleLogin = (t, c) => {
    sessionStorage.setItem('hsp_token',    t);
    sessionStorage.setItem('hsp_customer', JSON.stringify(c));
    setToken(t); setCustomer(c);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('hsp_token');
    sessionStorage.removeItem('hsp_customer');
    setToken(null); setCustomer(null);
  };


  useLayoutEffect(() => {
  const style = document.createElement("style");
  style.innerHTML = CSS;
  document.head.appendChild(style);

  return () => style.remove();
}, []);

  return (
    <>
      {/* <style>{CSS}</style> */}
      <Toaster position="top-right" toastOptions={{ style:{ fontFamily:'Plus Jakarta Sans,sans-serif', 
        fontSize:13, background:'#1e293b', color:'#f1f5f9', border:'1px solid rgba(255,255,255,.1)' } }}/>
      <div className="cp-root">
        <div className="cp-bg"><div className="cp-grid"/></div>
        <div className="cp-content">
          <AnimatePresence mode="wait">
            {token
              ? <motion.div key="login"  initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}><LoginScreen   onLogin={handleLogin}/></motion.div>
              : <motion.div key="dash"   initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}><Dashboard token={token} customer={customer} onLogout={handleLogout}/></motion.div>
            }
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}