import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Tv, Wifi, Plus, Trash2, Search, RefreshCw,
  AlertCircle, Loader, X, Monitor, Pencil,
  Smartphone, Shield, ChevronDown, Zap, Server,
  Calendar, Clock, Ban,
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { useLayoutEffect } from "react";

const getSubdomain = () => window.location.hostname.split('.')[0];
const getCsrf      = () => document?.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';

function validateMac(mac) {
  return /^([0-9A-Fa-f]{2}[:\-]){5}[0-9A-Fa-f]{2}$/.test(mac.trim());
}
function formatMac(raw) {
  const clean = raw.replace(/[^0-9a-fA-F]/g, '').slice(0, 12);
  return clean.match(/.{1,2}/g)?.join(':') || clean;
}

function formatExpiry(dateStr, timeStr) {
  if (!dateStr) return '';
  const time = timeStr || '23:59:59';
  const fullTime = time.length === 5 ? `${time}:00` : time;
  return `${dateStr} ${fullTime}`;
}

function displayExpiry(raw) {
  if (!raw) return null;
  try {
    return new Date(raw).toLocaleString();
  } catch {
    return raw;
  }
}

function isActiveDevice(d) {
  const statusOk = (d.status || 'active') === 'active';
  const notExpired = !d.expiry || new Date(d.expiry) > new Date();
  return statusOk && notExpired;
}

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@400;500&family=Outfit:wght@300;400;500;600&display=swap');

  .bp-root *, .bp-root *::before, .bp-root *::after { box-sizing:border-box; margin:0; padding:0; }
  .bp-root {  color:#0f1117; }

  @keyframes bp-spin  { to { transform:rotate(360deg); } }
  @keyframes bp-slide { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
  @keyframes bp-pop   { from{opacity:0;transform:scale(.94)} to{opacity:1;transform:scale(1)} }
  @keyframes bp-pulse { 0%,100%{box-shadow:0 0 0 0 rgba(34,197,94,.4)} 70%{box-shadow:0 0 0 8px rgba(34,197,94,0)} }

  .bp-card { background:#fff; border:1px solid #e8eaf0; border-radius:16px; box-shadow:0 2px 12px rgba(0,0,0,.05); }

  .bp-input {
    width:100%; padding:10px 14px; font-size:14px; font-family:'Outfit',sans-serif;
    border:1.5px solid #e8eaf0; border-radius:10px; outline:none; color:#0f1117;
    background:#fafafa; transition:border-color .18s,box-shadow .18s,background .18s;
  }
  .bp-input:focus { border-color:#0ea5e9; background:#fff; box-shadow:0 0 0 3px rgba(14,165,233,.1); }
  .bp-input::placeholder { color:#adb5bd; }
  .bp-input[type="date"]::-webkit-calendar-picker-indicator,
  .bp-input[type="time"]::-webkit-calendar-picker-indicator { opacity:.5; cursor:pointer; }

  .bp-select {
    width:100%; padding:10px 14px; font-size:14px; font-family:'Outfit',sans-serif;
    border:1.5px solid #e8eaf0; border-radius:10px; outline:none;
    color:#0f1117; background:#fafafa; cursor:pointer; appearance:none;
    transition:border-color .18s,box-shadow .18s;
  }
  .bp-select:focus { border-color:#0ea5e9; box-shadow:0 0 0 3px rgba(14,165,233,.1); }

  .bp-btn-primary {
    display:inline-flex; align-items:center; gap:8px; padding:11px 20px;
    font-size:14px; font-weight:600; font-family:'Outfit',sans-serif;
    cursor:pointer; border:none; border-radius:10px; color:#fff;
    background:linear-gradient(135deg,#0ea5e9,#0284c7);
    transition:transform .15s,box-shadow .15s;
  }
  .bp-btn-primary:hover:not(:disabled) { transform:translateY(-1px); box-shadow:0 6px 20px rgba(14,165,233,.35); }
  .bp-btn-primary:disabled { opacity:.5; cursor:not-allowed; }

  .bp-btn-ghost {
    display:inline-flex; align-items:center; gap:6px; padding:8px 14px;
    font-size:13px; font-weight:500; font-family:'Outfit',sans-serif;
    cursor:pointer; border:1.5px solid #e8eaf0; border-radius:8px;
    color:#6b7280; background:transparent; transition:all .15s;
  }
  .bp-btn-ghost:hover { border-color:#cbd5e1; background:#f8fafc; color:#374151; }

  .bp-btn-danger {
    display:inline-flex; align-items:center; justify-content:center; gap:5px;
    padding:7px 10px; font-size:12px; font-weight:500; font-family:'Outfit',sans-serif;
    cursor:pointer; border:1px solid #fecaca; border-radius:8px;
    color:#dc2626; background:#fff5f5; transition:all .15s;
  }
  .bp-btn-danger:hover:not(:disabled) { background:#fee2e2; border-color:#fca5a5; }
  .bp-btn-danger:disabled { opacity:.5; cursor:not-allowed; }

  .bp-btn-edit {
    display:inline-flex; align-items:center; justify-content:center; gap:5px;
    padding:7px 10px; font-size:12px; font-weight:500; font-family:'Outfit',sans-serif;
    cursor:pointer; border:1px solid #bae6fd; border-radius:8px;
    color:#0284c7; background:#f0f9ff; transition:all .15s;
  }
  .bp-btn-edit:hover { background:#e0f2fe; border-color:#7dd3fc; }

  .bp-btn-lease {
    display:inline-flex; align-items:center; gap:6px; padding:9px 14px;
    font-size:13px; font-weight:600; font-family:'Outfit',sans-serif;
    cursor:pointer; border:1.5px solid #d1fae5; border-radius:10px;
    color:#059669; background:#ecfdf5; transition:all .15s; width:100%;
  }
  .bp-btn-lease:hover { background:#d1fae5; border-color:#6ee7b7; }
  .bp-btn-lease:disabled { opacity:.5; cursor:not-allowed; }

  .bp-tag { display:inline-flex; align-items:center; gap:5px; padding:3px 10px; border-radius:20px; font-size:11px; font-weight:600; }
  .bp-tag-active  { background:#dcfce7; color:#166534; }
  .bp-tag-pending { background:#fef9c3; color:#854d0e; }
  .bp-tag-error   { background:#fee2e2; color:#991b1b; }

  .bp-device-row {
    padding:14px 18px; border-radius:12px; border:1px solid #f1f3f5;
    transition:border-color .18s,box-shadow .18s,background .18s;
    animation:bp-slide .22s ease both;
  }
  .bp-device-row:hover { border-color:#e2e8f0; background:#fafbfd; box-shadow:0 2px 8px rgba(0,0,0,.04); }

  .bp-mac { font-family:'DM Mono',monospace; font-size:12px; color:#64748b; }

  .bp-backdrop {
    position:fixed; inset:0; z-index:9999;
    background:rgba(15,17,23,.55); backdrop-filter:blur(6px);
    display:flex; align-items:center; justify-content:center; padding:24px;
  }
  .bp-modal {
    background:#fff; border-radius:20px; padding:28px;
    width:100%; max-width:500px; max-height:92vh; overflow-y:auto;
    box-shadow:0 24px 60px rgba(0,0,0,.18);
    animation:bp-pop .22s cubic-bezier(.34,1.56,.64,1) both;
  }
  .bp-divider { height:1px; background:#f1f3f5; margin:18px 0; }

  .bp-status-dot { width:8px; height:8px; border-radius:50%; flex-shrink:0; }
  .bp-status-dot.active  { background:#22c55e; animation:bp-pulse 2s infinite; }
  .bp-status-dot.pending { background:#eab308; }
  .bp-status-dot.error   { background:#ef4444; }

  .bp-empty { display:flex; flex-direction:column; align-items:center; justify-content:center; padding:56px 24px; gap:12px; color:#9ca3af; text-align:center; }

  .bp-spinner { width:16px; height:16px; border-radius:50%; border:2px solid rgba(255,255,255,.3); border-top-color:#fff; animation:bp-spin 1s linear infinite; display:inline-block; }

  .bp-search-wrap { position:relative; }
  .bp-search-icon { position:absolute; left:12px; top:50%; transform:translateY(-50%); color:#9ca3af; pointer-events:none; }
  .bp-search-input { padding-left:36px !important; }

  .bp-field { margin-bottom:14px; }
  .bp-label { display:block; font-size:12px; font-weight:600; color:#374151; margin-bottom:5px; text-transform:uppercase; letter-spacing:.05em; }
  .bp-hint  { font-size:11px; color:#9ca3af; margin-top:4px; }
  .bp-err   { font-size:11px; color:#dc2626; margin-top:4px; }

  .bp-expiry-box {
    border:1.5px solid #e8eaf0; border-radius:12px; padding:14px;
    background:#fafafa; transition:border-color .18s;
  }
  .bp-expiry-box.has-value { border-color:#0ea5e9; background:#f0f9ff; }
  .bp-expiry-toggle {
    display:flex; align-items:center; gap:8px; cursor:pointer;
    font-size:13px; font-weight:600; color:#374151; user-select:none;
  }
  .bp-expiry-toggle input[type=checkbox] { accent-color:#0ea5e9; width:15px; height:15px; cursor:pointer; }
  .bp-expiry-fields { margin-top:12px; display:grid; grid-template-columns:1fr 1fr; gap:10px; }
  .bp-expiry-preset { display:flex; gap:6px; flex-wrap:wrap; margin-top:10px; }
  .bp-preset-btn {
    padding:5px 10px; border-radius:7px; font-size:11px; font-weight:600;
    font-family:'Outfit',sans-serif; cursor:pointer; border:1.5px solid #e8eaf0;
    background:#fff; color:#6b7280; transition:all .15s;
  }
  .bp-preset-btn:hover { border-color:#0ea5e9; color:#0284c7; background:#f0f9ff; }
  .bp-expiry-clear {
    display:inline-flex; align-items:center; gap:4px; margin-top:8px;
    font-size:11px; color:#dc2626; cursor:pointer; background:none; border:none;
    font-family:'Outfit',sans-serif; font-weight:600; padding:0;
  }
  .bp-expiry-clear:hover { text-decoration:underline; }

  .bp-expiry-tag {
    display:inline-flex; align-items:center; gap:4px; padding:2px 8px;
    border-radius:20px; background:#fef9c3; color:#854d0e;
    font-size:10px; font-weight:700;
  }
  .bp-expiry-tag.expired { background:#fee2e2; color:#991b1b; }

  .bp-lease-modal {
    background:#fff; border-radius:20px; padding:0;
    width:100%; max-width:560px; max-height:90vh;
    box-shadow:0 24px 60px rgba(0,0,0,.18);
    animation:bp-pop .22s cubic-bezier(.34,1.56,.64,1) both;
    display:flex; flex-direction:column; overflow:hidden;
  }
  .bp-lease-header { padding:20px 24px 16px; border-bottom:1px solid #f1f3f5; flex-shrink:0; }
  .bp-lease-search { padding:12px 16px; border-bottom:1px solid #f1f3f5; flex-shrink:0; }
  .bp-lease-list { overflow-y:auto; flex:1; padding:8px; }
  .bp-lease-row {
    display:flex; align-items:center; gap:12px; padding:12px 14px;
    border-radius:10px; cursor:pointer; transition:all .15s;
    border:1.5px solid transparent;
  }
  .bp-lease-row:hover { background:#f0fdf4; border-color:#6ee7b7; }
  .bp-lease-row.selected { background:#ecfdf5; border-color:#10b981; }
  .bp-lease-dot { width:8px; height:8px; border-radius:50%; background:#22c55e; flex-shrink:0; animation:bp-pulse 2s infinite; }
  .bp-lease-dot.dynamic { background:#eab308; animation:none; }
  .bp-autofill-badge {
    display:inline-flex; align-items:center; gap:4px; padding:3px 9px;
    border-radius:20px; background:#d1fae5; color:#065f46;
    font-size:11px; font-weight:700; letter-spacing:.04em;
  }

  .bp-stat-card {
    padding:14px 18px; border-radius:14px; min-width:180px; flex:1;
  }
  .bp-stat-kicker { font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:.05em; }
  .bp-stat-value { font-size:28px; font-weight:800; font-family:'Syne',sans-serif; margin-top:4px; }
  .bp-stat-label { font-size:12px; font-weight:600; color:#0f1117; margin-top:2px; }
  .bp-stat-sub   { font-size:11px; color:#6b7280; margin-top:2px; }

  .bp-online-dot { width:7px; height:7px; border-radius:50%; display:inline-block; margin-right:5px; flex-shrink:0; }
  .bp-online-dot.on  { background:#22c55e; animation:bp-pulse 2s infinite; }
  .bp-online-dot.off { background:#d1d5db; }

  .bp-section-title { font-size:13px; font-weight:700; color:#374151; margin:22px 0 8px; }
  .bp-section-title .count { color:#9ca3af; font-weight:500; }
`;

const PRESETS = [
  { label: '1 day',    hours: 24 },
  { label: '3 days',   hours: 72 },
  { label: '1 week',   hours: 168 },
  { label: '1 month',  hours: 720 },
  { label: '3 months', hours: 2160 },
  { label: '1 year',   hours: 8760 },
];

function addHours(h) {
  const d = new Date(Date.now() + h * 3600 * 1000);
  const date = d.toISOString().slice(0, 10);
  const time = d.toTimeString().slice(0, 5);
  return { date, time };
}

function ExpiryPicker({ expiryDate, expiryTime, setExpiryDate, setExpiryTime, enabled, setEnabled }) {
  const hasValue = enabled && expiryDate;

  const applyPreset = ({ hours }) => {
    const { date, time } = addHours(hours);
    setEnabled(true);
    setExpiryDate(date);
    setExpiryTime(time);
  };

  const clear = () => {
    setEnabled(false);
    setExpiryDate('');
    setExpiryTime('');
  };

  const today = new Date().toISOString().slice(0, 10);

  return (
    <div className="bp-field">
      <span className="bp-label" style={{ display:'flex', alignItems:'center', gap:6 }}>
        <Calendar size={12}/> Expiry Date
      </span>

      <div className={`bp-expiry-box${hasValue ? ' has-value' : ''}`}>
        <label className="bp-expiry-toggle">
          <input
            type="checkbox"
            checked={enabled}
            onChange={e => {
              setEnabled(e.target.checked);
              if (!e.target.checked) { setExpiryDate(''); setExpiryTime(''); }
            }}
          />
          {enabled ? 'Set expiry date & time' : 'No expiry (permanent bypass)'}
        </label>

        {enabled && (
          <>
            <div className="bp-expiry-preset">
              {PRESETS.map(p => (
                <button key={p.label} type="button" className="bp-preset-btn" onClick={() => applyPreset(p)}>
                  {p.label}
                </button>
              ))}
            </div>

            <div className="bp-expiry-fields">
              <div>
                <label className="bp-label" style={{ marginBottom:4 }}>
                  <Calendar size={10} style={{ marginRight:4, verticalAlign:'middle' }}/>Date
                </label>
                <input
                  type="date"
                  className="bp-input"
                  value={expiryDate}
                  min={today}
                  onChange={e => setExpiryDate(e.target.value)}
                  style={{ fontSize:13 }}
                />
              </div>
              <div>
                <label className="bp-label" style={{ marginBottom:4 }}>
                  <Clock size={10} style={{ marginRight:4, verticalAlign:'middle' }}/>Time
                </label>
                <input
                  type="time"
                  className="bp-input"
                  value={expiryTime}
                  onChange={e => setExpiryTime(e.target.value)}
                  style={{ fontSize:13 }}
                />
              </div>
            </div>

            {expiryDate && (
              <div style={{ marginTop:8, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                <span style={{ fontSize:11, color:'#0284c7', fontWeight:600 }}>
                  Expires: {displayExpiry(formatExpiry(expiryDate, expiryTime))}
                </span>
                <button type="button" className="bp-expiry-clear" onClick={clear}>
                  <Ban size={10}/> Clear
                </button>
              </div>
            )}
          </>
        )}
      </div>
      <p className="bp-hint">Leave unchecked for a permanent bypass with no expiry</p>
    </div>
  );
}

const DEVICE_TYPES = [
  { value:'tv',      label:'Smart TV',     Icon:Tv         },
  { value:'monitor', label:'Monitor/PC',   Icon:Monitor    },
  { value:'phone',   label:'Phone/Tablet', Icon:Smartphone },
  { value:'other',   label:'Other',        Icon:Wifi       },
];
function DeviceIcon({ type, size=16 }) {
  const found = DEVICE_TYPES.find(d => d.value === type);
  const Icon  = found?.Icon || Wifi;
  return <Icon size={size}/>;
}

// ─── DHCP Lease Picker ────────────────────────────────────────────────────────
function DhcpLeasePicker({ router, onClose, onSelect }) {
  const [leases,  setLeases]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [search,  setSearch]  = useState('');
  const [picked,  setPicked]  = useState(null);
  const sd = getSubdomain();

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/dhcp_leases?router=${encodeURIComponent(router)}`, { headers: { 'X-Subdomain': sd } });
        if (!res.ok) throw new Error();
        const data = await res.json();
        setLeases(Array.isArray(data) ? data : data.leases || []);
      } catch { toast.error('Could not fetch DHCP leases'); onClose(); }
      finally { setLoading(false); }
    })();
  }, [router, sd]);

  const filtered = leases.filter(l =>
    (l.mac_address||'').toLowerCase().includes(search.toLowerCase()) ||
    (l.host_name||'').toLowerCase().includes(search.toLowerCase()) ||
    (l.address||'').includes(search)
  );

  return (
    <div className="bp-backdrop" >
      <div className="bp-lease-modal" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
        <div className="bp-lease-header">
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <div>
              <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4 }}>
                <Server size={16} style={{ color:'#059669' }}/>
                <h2 style={{ fontSize:17, fontWeight:800, color:'#0f1117' }}>DHCP Leases</h2>
                <span className="bp-autofill-badge"><Zap size={10}/> Auto-fill</span>
              </div>
              <p style={{ fontSize:12, color:'#6b7280' }}>Pick a device from <strong>{router}</strong> — fields fill automatically</p>
            </div>
            <button type="button" onClick={onClose} style={{ background:'none', border:'none', cursor:'pointer', color:'#9ca3af' }}><X size={18}/></button>
          </div>
        </div>
        <div className="bp-lease-search">
          <div className="bp-search-wrap">
            <Search size={13} className="bp-search-icon"/>
            <input className="bp-input bp-search-input" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name, MAC or IP…" style={{ fontSize:13 }} autoFocus/>
          </div>
        </div>
        <div className="bp-lease-list">
          {loading ? (
            <div className="bp-empty" style={{ padding:'40px 20px' }}>
              <Loader size={22} style={{ animation:'bp-spin 1s linear infinite', color:'#059669' }}/>
              <span style={{ fontSize:12 }}>Fetching leases from MikroTik…</span>
            </div>
          ) : filtered.length === 0 ? (
            <div className="bp-empty" style={{ padding:'40px 20px' }}>
              <p style={{ fontSize:13, fontWeight:600 }}>No leases found</p>
            </div>
          ) : filtered.map((lease, i) => {
            const mac      = lease.mac_address || '';
            const ip       = lease.address     || '';
            const hostname = lease.host_name   || '—';
            const isDynamic = (lease.type||'').includes('dynamic');
            const isSel    = picked === lease;
            return (
              <div key={i} className={`bp-lease-row${isSel ? ' selected' : ''}`} onClick={() => setPicked(isSel ? null : lease)}>
                <div className={`bp-lease-dot${isDynamic ? ' dynamic' : ''}`}/>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                    <span style={{ fontSize:13, fontWeight:600, color:'#0f1117', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{hostname}</span>
                    {isDynamic && <span style={{ fontSize:10, fontWeight:700, padding:'1px 6px', borderRadius:10, background:'#fef9c3', color:'#854d0e', flexShrink:0 }}>DYNAMIC</span>}
                  </div>
                  <span className="bp-mac" style={{ fontSize:11 }}>{mac}</span>
                  {lease.server && <span style={{ fontSize:11, color:'#9ca3af', marginLeft:8 }}>· {lease.server}</span>}
                </div>
                <span style={{ fontFamily:'DM Mono,monospace', fontSize:12, color:'#0284c7', flexShrink:0 }}>{ip}</span>
                {isSel && (
                  <div style={{ width:20, height:20, borderRadius:'50%', background:'#059669', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4L3.5 6.5L9 1" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <div style={{ padding:'12px 16px', borderTop:'1px solid #f1f3f5', display:'flex', gap:8, justifyContent:'flex-end', flexShrink:0 }}>
          <button className="bp-btn-ghost" onClick={onClose}>Cancel</button>
          <button className="bp-btn-primary" onClick={() => { if (picked) { onSelect(picked); onClose(); } }} disabled={!picked} style={{ background:'linear-gradient(135deg,#059669,#047857)' }}>
            <Zap size={13}/>Use this device
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Shared form fields ───────────────────────────────────────────────────────
function DeviceFormFields({ form, set, routers, plans, macErr, onMacChange,
  expiryDate, expiryTime, setExpiryDate, setExpiryTime, expiryEnabled, setExpiryEnabled }) {
  const [showPicker, setShowPicker] = useState(false);

  const handleLeaseSelect = (lease) => {
    const mac      = lease.mac_address || '';
    const ip       = lease.address     || '';
    const hostname = lease.host_name   || '';
    set('mac', formatMac(mac.replace(/[^0-9a-fA-F]/g, '')));
    if (ip)                      set('ip',   ip);
    if (hostname && !form.name)  set('name', hostname);
    toast.success(`Auto-filled from lease: ${hostname || mac}`);
  };

  return (
    <>
      {form.router && (
        <div className="bp-field">
          <span className="bp-label">Quick Fill from DHCP</span>
          <button type="button" className="bp-btn-lease" onClick={() => setShowPicker(true)}>
            <Server size={14}/>
            Browse active DHCP leases on <strong style={{ marginLeft:2 }}>{form.router}</strong>
            <Zap size={12} style={{ marginLeft:'auto', color:'#6ee7b7' }}/>
          </button>
          <p className="bp-hint">Picks MAC & IP from the router's live lease table</p>
        </div>
      )}
      {showPicker && <DhcpLeasePicker router={form.router} onClose={() => setShowPicker(false)} onSelect={handleLeaseSelect}/>}

      <div className="bp-field">
        <span className="bp-label">Device Type</span>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:8 }}>
          {DEVICE_TYPES.map(d => {
            const active = form.device_type === d.value;
            return (
              <button type="button" key={d.value} onClick={() => set('device_type', d.value)} style={{
                padding:'10px 6px', borderRadius:10, cursor:'pointer', fontFamily:'Outfit,sans-serif',
                border: active ? '2px solid #0ea5e9' : '1.5px solid #e8eaf0',
                background: active ? '#f0f9ff' : '#fafafa', color: active ? '#0284c7' : '#6b7280',
                display:'flex', flexDirection:'column', alignItems:'center', gap:5, fontSize:11, fontWeight:600, transition:'all .15s',
              }}>
                <d.Icon size={15}/>{d.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="bp-field">
        <label className="bp-label">MikroTik Router <span style={{ color:'#ef4444' }}>*</span></label>
        <div style={{ position:'relative' }}>
          <select className="bp-select" value={form.router} onChange={e => set('router', e.target.value)}>
            <option value="">— Select router —</option>
            {routers.map(r => <option key={r.id || r.name} value={r.name}>{r.name}</option>)}
          </select>
          <ChevronDown size={14} style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)', color:'#9ca3af', pointerEvents:'none' }}/>
        </div>
        {!form.router && <p className="bp-hint">Select a router first to browse DHCP leases</p>}
      </div>

      <div className="bp-field">
        <label className="bp-label">Device Name <span style={{ color:'#ef4444' }}>*</span></label>
        <input className="bp-input" value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. Reception TV, Room 3 Samsung"/>
      </div>

      <div className="bp-field">
        <label className="bp-label">TV Plan</label>
        <div style={{ position:'relative' }}>
          <select className="bp-select" value={form.package} onChange={e => set('package', e.target.value)}>
            <option value="">— Select TV plan (optional) —</option>
            {plans.map(p => <option key={p.id || p.name} value={p.name}>{p.name}</option>)}
          </select>
          <ChevronDown size={14} style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)', color:'#9ca3af', pointerEvents:'none' }}/>
        </div>
      </div>

      <div className="bp-field">
        <label className="bp-label">MAC Address <span style={{ color:'#ef4444' }}>*</span></label>
        <input className="bp-input" value={form.mac} onChange={onMacChange} placeholder="AA:BB:CC:DD:EE:FF" style={{ fontFamily:'DM Mono,monospace' }}/>
        {macErr && <p className="bp-err">{macErr}</p>}
        <p className="bp-hint">TV: Settings → Network → MAC Address</p>
      </div>

      <div className="bp-field">
        <label className="bp-label">IP Address</label>
        <input className="bp-input" value={form.ip} onChange={e => set('ip', e.target.value)} placeholder="192.168.20.10 (optional)" style={{ fontFamily:'DM Mono,monospace' }}/>
      </div>

      <ExpiryPicker
        expiryDate={expiryDate} expiryTime={expiryTime}
        setExpiryDate={setExpiryDate} setExpiryTime={setExpiryTime}
        enabled={expiryEnabled} setEnabled={setExpiryEnabled}
      />
    </>
  );
}

function useFormState(initial = {}) {
  const [form, setForm] = useState({
    mac: '', name: '', device_type: 'tv', router: '', package: '', ip: '',
    ...initial,
  });
  const [expiryEnabled, setExpiryEnabled] = useState(!!initial.expiry);
  const [expiryDate,    setExpiryDate]    = useState(initial.expiry ? initial.expiry.slice(0, 10) : '');
  const [expiryTime,    setExpiryTime]    = useState(initial.expiry ? initial.expiry.slice(11, 16) : '');
  const [macErr,        setMacErr]        = useState('');
  const [saving,        setSaving]        = useState(false);

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const onMacChange = (e) => {
    const val = formatMac(e.target.value);
    set('mac', val);
    if (macErr && validateMac(val)) setMacErr('');
  };

  const getExpiry = () => expiryEnabled && expiryDate ? formatExpiry(expiryDate, expiryTime) : '';

  return { form, set, expiryEnabled, setExpiryEnabled, expiryDate, setExpiryDate,
           expiryTime, setExpiryTime, macErr, setMacErr, saving, setSaving, onMacChange, getExpiry };
}

function AddDeviceModal({ routers, plans, onClose, onAdded }) {
  const { form, set, expiryEnabled, setExpiryEnabled, expiryDate, setExpiryDate,
          expiryTime, setExpiryTime, macErr, setMacErr, saving, setSaving, onMacChange, getExpiry }
    = useFormState({ router: routers[0]?.name || '', package: plans[0]?.name || '' });

  const submit = async (e) => {
    e.preventDefault();
    if (!validateMac(form.mac)) { setMacErr('Enter a valid MAC address (e.g. AA:BB:CC:DD:EE:FF)'); return; }
    if (!form.name.trim())      { toast.error('Enter a device name'); return; }
    if (!form.router)           { toast.error('Select a router'); return; }
    setSaving(true);
    try {
      const res = await fetch('/api/ip_bindings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Subdomain': getSubdomain(), 'X-CSRF-Token': getCsrf() },
        body: JSON.stringify({
          mac: form.mac.trim(), name: form.name.trim(), device_type: form.device_type,
          router: form.router, package: form.package, ip: form.ip.trim(),
          expiry: getExpiry(),
        }),
      });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error || 'Failed to add device'); return; }
      toast.success(`${form.name} added — bypass active!`);
      onAdded(data); onClose();
    } catch { toast.error('Network error'); } finally { setSaving(false); }
  };

  return (
    <div className="bp-backdrop" >
      <div className="bp-modal"  onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:20 }} className='font-sans'>
          <div>
            <h2 style={{ fontSize:20, fontWeight:800, color:'#0f1117' }}>Add Bypass Device</h2>
            <p style={{ fontSize:13, color:'#6b7280', marginTop:2 }}>This device will skip the hotspot login page</p>
          </div>
          <button type="button" onClick={onClose} style={{ background:'none', border:'none', cursor:'pointer', color:'#9ca3af' }}><X size={20}/></button>
        </div>
        <form onSubmit={submit}>
          <DeviceFormFields
            form={form} set={set} routers={routers} plans={plans} macErr={macErr} onMacChange={onMacChange}
            expiryDate={expiryDate} expiryTime={expiryTime} setExpiryDate={setExpiryDate}
            setExpiryTime={setExpiryTime} expiryEnabled={expiryEnabled} setExpiryEnabled={setExpiryEnabled}
          />
          <div className="bp-divider"/>
          <div style={{ display:'flex', gap:10, justifyContent:'flex-end' }}>
            <button type="button" className="bp-btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="bp-btn-primary" disabled={saving}>
              {saving ? <span className="bp-spinner"/> : <Shield size={14}/>}
              {saving ? 'Adding…' : 'Add & Bypass'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function EditDeviceModal({ device, routers, plans, onClose, onUpdated }) {
  const { form, set, expiryEnabled, setExpiryEnabled, expiryDate, setExpiryDate,
          expiryTime, setExpiryTime, macErr, setMacErr, saving, setSaving, onMacChange, getExpiry }
    = useFormState({
        mac: device.mac || '', name: device.name || '', device_type: device.device_type || 'tv',
        router: device.router || routers[0]?.name || '', package: device.package || plans[0]?.name || '',
        ip: device.ip || '', expiry: device.expiry || '',
      });

  const submit = async (e) => {
    e.preventDefault();
    if (!validateMac(form.mac)) { setMacErr('Enter a valid MAC address (e.g. AA:BB:CC:DD:EE:FF)'); return; }
    if (!form.name.trim())      { toast.error('Enter a device name'); return; }
    if (!form.router)           { toast.error('Select a router'); return; }
    setSaving(true);
    try {
      const res = await fetch(`/api/ip_bindings/${device.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'X-Subdomain': getSubdomain(), 'X-CSRF-Token': getCsrf() },
        body: JSON.stringify({
          mac: form.mac.trim(), name: form.name.trim(), device_type: form.device_type,
          router: form.router, package: form.package, ip: form.ip.trim(),
          expiry: getExpiry(),
        }),
      });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error || 'Failed to update device'); return; }
      toast.success(`${form.name} updated!`);
      onUpdated(data); onClose();
    } catch { toast.error('Network error'); } finally { setSaving(false); }
  };

  return (
    <div className="bp-backdrop"  onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="bp-modal" onClick={e => e.stopPropagation()}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:20 }}>
          <div>
            <h2 style={{ fontSize:20, fontWeight:800, color:'#0f1117' }}>Edit Device</h2>
            <p style={{ fontSize:13, color:'#6b7280', marginTop:2 }}>Update details for <strong>{device.name}</strong></p>
          </div>
          <button type="button" onClick={onClose} style={{ background:'none', border:'none', cursor:'pointer', color:'#9ca3af' }}><X size={20}/></button>
        </div>
        <form onSubmit={submit}>
          <DeviceFormFields
            form={form} set={set} routers={routers} plans={plans} macErr={macErr} onMacChange={onMacChange}
            expiryDate={expiryDate} expiryTime={expiryTime} setExpiryDate={setExpiryDate}
            setExpiryTime={setExpiryTime} expiryEnabled={expiryEnabled} setExpiryEnabled={setExpiryEnabled}
          />
          <div className="bp-divider"/>
          <div style={{ display:'flex', gap:10, justifyContent:'flex-end' }}>
            <button type="button" className="bp-btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="bp-btn-primary" disabled={saving} style={{ background:'linear-gradient(135deg,#6366f1,#4f46e5)' }}>
              {saving ? <span className="bp-spinner"/> : <Pencil size={14}/>}
              {saving ? 'Saving…' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function DeleteModal({ device, onClose, onConfirm, loading }) {
  return (
    <div className="bp-backdrop"  onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <motion.div
        initial={{ scale:.94, opacity:0 }} animate={{ scale:1, opacity:1 }}
        transition={{ type:'spring', stiffness:240, damping:22 }}
        onClick={e => e.stopPropagation()}
        style={{ background:'#fff', borderRadius:16, padding:28, maxWidth:380, width:'100%', boxShadow:'0 24px 80px rgba(0,0,0,.18)' }}>
        <div style={{ width:44, height:44, borderRadius:12, background:'#fef2f2', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:16 }}>
          <Trash2 size={20} style={{ color:'#ef4444' }}/>
        </div>
        <h3 style={{ fontSize:16, fontWeight:700, color:'#111827', margin:'0 0 6px' }}>Remove device?</h3>
        <p style={{ fontSize:13, color:'#374151', fontWeight:600, margin:'0 0 4px' }}>{device.name}</p>
        <p style={{ fontSize:13, color:'#6b7280', margin:'0 0 22px' }}>This will remove the MAC bypass from MikroTik. The device will see the login page again.</p>
        <div style={{ display:'flex', gap:10 }}>
          <button className="bp-btn-ghost" onClick={onClose} style={{ flex:1, justifyContent:'center' }}>Cancel</button>
          <button onClick={onConfirm} disabled={loading} style={{
            flex:1, display:'inline-flex', alignItems:'center', justifyContent:'center', gap:6,
            padding:'10px 16px', borderRadius:9, fontSize:13, fontWeight:600,
            cursor: loading ? 'not-allowed' : 'pointer', background:'#ef4444', color:'#fff',
            border:'none', opacity: loading ? .6 : 1, fontFamily:'Outfit,sans-serif', transition:'opacity .15s',
          }}>
            {loading
              ? <span style={{ width:14, height:14, border:'2px solid rgba(255,255,255,.3)', borderTop:'2px solid #fff', borderRadius:'50%', animation:'bp-spin 1s linear infinite', display:'inline-block' }}/>
              : <Trash2 size={13}/>}
            {loading ? 'Removing…' : 'Remove'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function ExpiryBadge({ expiry }) {
  if (!expiry) return null;
  const expired = new Date(expiry) < new Date();
  return (
    <span className={`bp-expiry-tag${expired ? ' expired' : ''}`}>
      <Calendar size={9}/>
      {expired ? 'Expired' : displayExpiry(expiry)}
    </span>
  );
}

function OnlineDot({ online }) {
  return <span className={`bp-online-dot ${online ? 'on' : 'off'}`} title={online ? 'Online now' : 'Offline'} />;
}

// ─── TV Plan Devices table ─────────────────────────────────────────────────
function TvPlanDevicesTable({ devices, onEdit, onDelete, deleting, deleteTargetId }) {
  return (
    <>
      <h3 className="bp-section-title">
        TV Plan Devices{' '}
        <span className="count">
          ({devices.filter(isActiveDevice).length} active · {devices.length} total)
        </span>
      </h3>
      <div className="bp-card" style={{ padding:8, marginBottom:24 }}>
        {devices.length === 0 ? (
          <div className="bp-empty" style={{ padding:'32px 20px' }}>
            <div style={{ width:48, height:48, borderRadius:14, background:'#f1f5f9', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <Tv size={20} style={{ color:'#cbd5e1' }}/>
            </div>
            <p style={{ fontSize:13, fontWeight:600, color:'#374151' }}>No TV plan devices yet</p>
            <p style={{ fontSize:12, color:'#9ca3af' }}>Devices appear here automatically after a successful TV-plan purchase.</p>
          </div>
        ) : (
          <div style={{ display:'flex', flexDirection:'column', gap:4 }}>
            <div style={{ display:'grid', gap:12, padding:'8px 18px', gridTemplateColumns:'1fr 110px 110px 100px 90px 100px 100px 90px', color:'#9ca3af', fontSize:11, fontWeight:700, letterSpacing:'.05em', textTransform:'uppercase' }}>
              <span>Device</span><span>Phone</span><span>Plan</span><span>Router</span><span>Status</span><span>Activated</span><span>Expires</span><span style={{ textAlign:'right' }}>Actions</span>
            </div>
            <AnimatePresence>
              {devices.map((d, i) => (
                <motion.div key={d.id}
                  className="bp-device-row"
                  initial={{ opacity:0, y:6 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, x:-20 }}
                  transition={{ duration:.18, delay: i * 0.03 }}
                  style={{ display:'grid', gap:12, alignItems:'center', gridTemplateColumns:'1fr 110px 110px 100px 90px 100px 100px 90px' }}>

                  <div style={{ display:'flex', alignItems:'center', minWidth:0 }}>
                    <OnlineDot online={d.online} />
                    <div style={{ minWidth:0 }}>
                      <p style={{ fontSize:13, fontWeight:600, color:'#0f1117', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{d.name || '—'}</p>
                      <span className="bp-mac" style={{ fontSize:10 }}>{d.mac}</span>
                    </div>
                  </div>

                  <span style={{ fontSize:12, color:'#6b7280' }}>{d.phone || '—'}</span>
                  <span style={{ fontSize:12, color:'#6b7280', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{d.package || '—'}</span>
                  <span style={{ fontSize:12, color:'#6b7280', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{d.router || '—'}</span>

                  <span className={`bp-tag bp-tag-${d.status || 'active'}`}>{d.status || 'Active'}</span>

                  <span style={{ fontSize:11, color:'#9ca3af' }}>{d.created_at ? new Date(d.created_at).toLocaleDateString() : '—'}</span>

                  <span>
                    {d.expiry ? <ExpiryBadge expiry={d.expiry}/> : <span style={{ fontSize:11, color:'#9ca3af' }}>No expiry</span>}
                  </span>

                  <div style={{ display:'flex', gap:6, justifyContent:'flex-end' }}>
                    <button className="bp-btn-edit" onClick={() => onEdit(d)}><Pencil size={12}/></button>
                    <button className="bp-btn-danger" onClick={() => onDelete(d)} disabled={deleting && deleteTargetId === d.id}>
                      {deleting && deleteTargetId === d.id
                        ? <span style={{ width:12, height:12, border:'2px solid #fca5a5', borderTop:'2px solid #dc2626', borderRadius:'50%', animation:'bp-spin 1s linear infinite', display:'inline-block' }}/>
                        : <Trash2 size={12}/>}
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </>
  );
}

// ─── MAC Voucher Devices table ──────────────────────────────────────────────
function MacVoucherDevicesTable({ devices, onEdit, onDelete, deleting, deleteTargetId, onAddFirst }) {
  return (
    <>
      <h3 className="bp-section-title">
        MAC Voucher Devices{' '}
        <span className="count">
          ({devices.filter(isActiveDevice).length} active · {devices.length} total)
        </span>
      </h3>
      <div className="bp-card" style={{ padding:8 }}>
        {devices.length === 0 ? (
          <div className="bp-empty" style={{ padding:'32px 20px' }}>
            <div style={{ width:48, height:48, borderRadius:14, background:'#f1f5f9', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <Wifi size={20} style={{ color:'#cbd5e1' }}/>
            </div>
            <p style={{ fontSize:13, fontWeight:600, color:'#374151' }}>No devices yet</p>
            <p style={{ fontSize:12, color:'#9ca3af' }}>Add a TV or console by its MAC address to grant it hotspot access.</p>
            <button className="bp-btn-primary" onClick={onAddFirst} style={{ marginTop:8 }}><Plus size={14}/> Add device</button>
          </div>
        ) : (
          <div style={{ display:'flex', flexDirection:'column', gap:4 }}>
            <div style={{ display:'grid', gap:12, padding:'8px 18px', gridTemplateColumns:'36px 1fr 150px 110px 90px 110px 110px 90px', color:'#9ca3af', fontSize:11, fontWeight:700, letterSpacing:'.05em', textTransform:'uppercase' }}>
              <span/><span>Device</span><span>MAC Address</span><span>Router</span><span>Status</span><span>Added</span><span>Expires</span><span style={{ textAlign:'right' }}>Actions</span>
            </div>
            <AnimatePresence>
              {devices.map((d, i) => (
                <motion.div key={d.id}
                  className="bp-device-row"
                  initial={{ opacity:0, y:6 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, x:-20 }}
                  transition={{ duration:.18, delay: i * 0.03 }}
                  style={{ display:'grid', gap:12, alignItems:'center', gridTemplateColumns:'36px 1fr 150px 110px 90px 110px 110px 90px' }}>

                  <div style={{ width:36, height:36, borderRadius:10, background:'#f0f9ff', display:'flex', alignItems:'center', justifyContent:'center', color:'#0284c7' }}>
                    <DeviceIcon type={d.device_type}/>
                  </div>

                  <div style={{ minWidth:0, display:'flex', alignItems:'center', gap:6 }}>
                    <OnlineDot online={d.online} />
                    <p style={{ fontSize:14, fontWeight:600, color:'#0f1117', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{d.name || '—'}</p>
                  </div>

                  <span className="bp-mac">{d.mac || '—'}</span>
                  <span style={{ fontSize:12, color:'#6b7280', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{d.router || '—'}</span>

                  <span className={`bp-tag bp-tag-${d.status || 'active'}`}>{d.status || 'Active'}</span>

                  <span style={{ fontSize:11, color:'#9ca3af' }}>{d.created_at ? new Date(d.created_at).toLocaleDateString() : '—'}</span>

                  <span>
                    {d.expiry ? <ExpiryBadge expiry={d.expiry}/> : <span style={{ fontSize:11, color:'#9ca3af' }}>No expiry</span>}
                  </span>

                  <div style={{ display:'flex', gap:6, justifyContent:'flex-end' }}>
                    <button className="bp-btn-edit" onClick={() => onEdit(d)}><Pencil size={12}/></button>
                    <button className="bp-btn-danger" onClick={() => onDelete(d)} disabled={deleting && deleteTargetId === d.id}>
                      {deleting && deleteTargetId === d.id
                        ? <span style={{ width:12, height:12, border:'2px solid #fca5a5', borderTop:'2px solid #dc2626', borderRadius:'50%', animation:'bp-spin 1s linear infinite', display:'inline-block' }}/>
                        : <Trash2 size={12}/>}
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </>
  );
}

export default function HotspotBypassManager() {
  const [tvPlanDevices,     setTvPlanDevices]     = useState([]);
  const [macVoucherDevices, setMacVoucherDevices]  = useState([]);
  const [stats,             setStats]             = useState({ online_devices: 0, active_devices: 0, registered_devices: 0 });
  const [routers,      setRouters]      = useState([]);
  const [plans,        setPlans]        = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [search,       setSearch]       = useState('');
  const [showAdd,      setShowAdd]      = useState(false);
  const [editTarget,   setEditTarget]   = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting,     setDeleting]     = useState(false);

  const sd = getSubdomain();

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [dRes, rRes, pRes] = await Promise.all([
        fetch('/api/ip_bindings', { headers:{ 'X-Subdomain':sd } }),
        fetch('/api/routers',     { headers:{ 'X-Subdomain':sd } }),
        fetch('/api/tv_plans',    { headers:{ 'X-Subdomain':sd } }),
      ]);
      const dData = await dRes.json(); const rData = await rRes.json(); const pData = await pRes.json();

      // Backend now returns { tv_plan_devices, mac_voucher_devices, stats }
      // instead of a flat array. Fall back gracefully if an older backend
      // still returns a flat array (e.g. mid-deploy).
      if (Array.isArray(dData)) {
        const isTvPlan = (d) => d.source === 'tv_plan_purchase' || !!d.tv_plan_id;
        setTvPlanDevices(dData.filter(isTvPlan));
        setMacVoucherDevices(dData.filter(d => !isTvPlan(d)));
        setStats({
          online_devices: 0,
          active_devices: dData.filter(isActiveDevice).length,
          registered_devices: dData.length,
        });
      } else {
        setTvPlanDevices(dData.tv_plan_devices || []);
        setMacVoucherDevices(dData.mac_voucher_devices || []);
        setStats(dData.stats || { online_devices: 0, active_devices: 0, registered_devices: 0 });
      }

      setRouters(Array.isArray(rData) ? rData : rData.routers || []);
      setPlans(  Array.isArray(pData) ? pData : pData.plans   || []);
    } catch { toast.error('Failed to load data'); } finally { setLoading(false); }
  }, [sd]);

  useEffect(() => { load(); }, [load]);

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/ip_bindings/${deleteTarget.id}`, { method:'DELETE', headers:{ 'X-Subdomain':sd, 'X-CSRF-Token':getCsrf() } });
      if (!res.ok) { const err = await res.json().catch(() => ({})); toast.error(err.error || `Delete failed (${res.status})`); return; }
      toast.success(`${deleteTarget.name} removed`);
      setTvPlanDevices(prev => prev.filter(d => d.id !== deleteTarget.id));
      setMacVoucherDevices(prev => prev.filter(d => d.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch { toast.error('Network error while deleting'); } finally { setDeleting(false); }
  };

  const handleUpdated = (updated) => {
    setTvPlanDevices(prev => prev.map(d => d.id === updated.id ? { ...d, ...updated } : d));
    setMacVoucherDevices(prev => prev.map(d => d.id === updated.id ? { ...d, ...updated } : d));
  };

  const matchesSearch = (d) =>
    (d.name||'').toLowerCase().includes(search.toLowerCase()) ||
    (d.mac||'').toLowerCase().includes(search.toLowerCase()) ||
    (d.phone||'').toLowerCase().includes(search.toLowerCase()) ||
    (d.router||'').toLowerCase().includes(search.toLowerCase());

  const filteredTvPlan     = tvPlanDevices.filter(matchesSearch);
  const filteredMacVoucher = macVoucherDevices.filter(matchesSearch);

  useLayoutEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = CSS;
    document.head.appendChild(style);
    return () => style.remove();
  }, []);

  return (
    <>
      <Toaster position="top-right" toastOptions={{ style:{ fontFamily:'Outfit,sans-serif', fontSize:13 } }}/>

      {showAdd   && <AddDeviceModal routers={routers} plans={plans} onClose={() => setShowAdd(false)} onAdded={d => setMacVoucherDevices(prev => [d, ...prev])}/>}
      {editTarget && <EditDeviceModal device={editTarget} routers={routers} plans={plans} onClose={() => setEditTarget(null)} onUpdated={handleUpdated}/>}
      {deleteTarget && <DeleteModal device={deleteTarget} loading={deleting} onClose={() => setDeleteTarget(null)} onConfirm={confirmDelete}/>}

      <div className="bp-root font-sans" style={{ padding:'28px 24px', maxWidth:1040, margin:'0 auto' }}>

        <div style={{ marginBottom:28 }}>
          <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:16, flexWrap:'wrap' }}>
            <div>
              <div style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'4px 12px', borderRadius:20, background:'#f0f9ff', border:'1px solid #bae6fd', marginBottom:10 }}>
                <Shield size={12} style={{ color:'#0284c7' }}/>
                <span style={{ fontSize:11, fontWeight:700, color:'#0284c7', letterSpacing:'.06em', textTransform:'uppercase' }}>Hotspot · Access</span>
              </div>
              <h1 style={{ fontSize:26, fontWeight:800, color:'#0f1117', letterSpacing:'-.02em', lineHeight:1.2 }}>TV's & Consoles · MAC Vouchers</h1>
              <p style={{ fontSize:13, color:'#6b7280', marginTop:4 }}>Register smart TVs, streaming sticks, and game consoles by MAC address. The device connects automatically — no captive-portal login needed.</p>
            </div>
            <div style={{ display:'flex', gap:10, alignItems:'center' }}>
              <button className="bp-btn-ghost" onClick={load} disabled={loading}>
                <RefreshCw size={14} style={{ animation: loading ? 'bp-spin 1s linear infinite' : 'none' }}/> Refresh
              </button>
              <button className="bp-btn-primary" onClick={() => setShowAdd(true)}>
                <Plus size={15}/> Add device
              </button>
            </div>
          </div>

          <div style={{ display:'flex', gap:12, marginTop:20, flexWrap:'wrap' }}>
            <div className="bp-stat-card" style={{ background:'#f0fdf4', border:'1px solid #86efac55' }}>
              <span className="bp-stat-kicker" style={{ color:'#16a34a' }}>Online-ready</span>
              <div className="bp-stat-value" style={{ color:'#16a34a' }}>{stats.active_devices}</div>
              <div className="bp-stat-label">Active devices</div>
              <div className="bp-stat-sub">MAC vouchers currently valid</div>
            </div>

            <div className="bp-stat-card" style={{ background:'#f0f9ff', border:'1px solid #7dd3fc55' }}>
              <span className="bp-stat-kicker" style={{ color:'#0284c7' }}>All time</span>
              <div className="bp-stat-value" style={{ color:'#0284c7' }}>{stats.registered_devices}</div>
              <div className="bp-stat-label">Registered devices</div>
              <div className="bp-stat-sub">Total TVs & consoles added</div>
            </div>
          </div>
        </div>

        <div className="bp-search-wrap" style={{ marginBottom:8 }}>
          <Search size={14} className="bp-search-icon"/>
          <input className="bp-input bp-search-input" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search MAC, phone or label…"/>
        </div>

        {loading ? (
          <div className="bp-card" style={{ padding:8, marginTop:16 }}>
            <div className="bp-empty">
              <Loader size={28} style={{ animation:'bp-spin 1s linear infinite', color:'#0ea5e9' }}/>
              <span style={{ fontSize:13 }}>Loading devices…</span>
            </div>
          </div>
        ) : (
          <>
            <TvPlanDevicesTable
              devices={filteredTvPlan}
              onEdit={setEditTarget}
              onDelete={setDeleteTarget}
              deleting={deleting}
              deleteTargetId={deleteTarget?.id}
            />
            <MacVoucherDevicesTable
              devices={filteredMacVoucher}
              onEdit={setEditTarget}
              onDelete={setDeleteTarget}
              deleting={deleting}
              deleteTargetId={deleteTarget?.id}
              onAddFirst={() => setShowAdd(true)}
            />
          </>
        )}

        <div style={{ marginTop:16, padding:'12px 16px', borderRadius:12, background:'#fffbeb', border:'1px solid #fde68a', display:'flex', gap:10 }}>
          <AlertCircle size={15} style={{ color:'#d97706', flexShrink:0, marginTop:2 }}/>
          <p style={{ fontSize:12, color:'#92400e', lineHeight:1.6 }}>
            Each device is added to MikroTik's <strong>IP Bindings</strong> as{' '}
            <code style={{ background:'#fef3c7', padding:'1px 5px', borderRadius:4 }}>type=bypassed</code>.
            Remove a device to restore the captive portal for it. The green dot means MikroTik currently reports that MAC as connected.
          </p>
        </div>
      </div>
    </>
  );
}