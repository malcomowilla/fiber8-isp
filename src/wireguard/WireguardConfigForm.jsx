/**
 * MikrotikWireguardOnboarding.jsx
 *
 * Multi-step wizard that:
 *   1. Collects device identity + optional custom IP
 *   2. Calls POST /api/wireguard/generate_config  →  gets MikroTik script + keys
 *   3. Shows the ready-to-paste MikroTik terminal script with copy button
 *   4. Polls a reachability check to confirm the tunnel is up
 *   5. Optionally configures PPPoE / Hotspot on the same device
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Router, Shield, Terminal, CheckCircle, Copy, Check,
  ChevronRight, ChevronLeft, Wifi, Server, AlertCircle,
  RefreshCw, Key, Globe, Network, Zap, Eye, EyeOff,
  Download, QrCode, Info, ArrowRight, Loader
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

// ── CSS ────────────────────────────────────────────────────────────────────────
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap');

  .wg-root * { box-sizing: border-box; }
  .wg-root   { font-family: 'DM Sans', sans-serif; }
  .wg-mono   { font-family: 'JetBrains Mono', monospace; }

  @keyframes wg-fade-up  { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
  @keyframes wg-pulse    { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.55;transform:scale(1.3)} }
  @keyframes wg-spin     { to{transform:rotate(360deg)} }
  @keyframes wg-glow-in  { from{box-shadow:0 0 0 rgba(99,102,241,0)} to{box-shadow:0 0 24px rgba(99,102,241,.22)} }
  @keyframes wg-shimmer  { from{background-position:-200% 0} to{background-position:200% 0} }
  @keyframes wg-beam     {
    0%   {transform:translateX(-100%) skewX(-20deg); opacity:0}
    15%  {opacity:.18}
    85%  {opacity:.18}
    100% {transform:translateX(300%) skewX(-20deg); opacity:0}
  }

  .wg-card {
    background: #fff;
    border: 1px solid #e5e7eb;
    border-radius: 16px;
    box-shadow: 0 4px 24px rgba(0,0,0,.06);
  }
  .wg-input {
    width:100%; padding:10px 14px; font-size:14px; font-family:'DM Sans',sans-serif;
    border:1.5px solid #e5e7eb; border-radius:10px; outline:none; color:#111827;
    background:#fff; transition:border-color .18s, box-shadow .18s;
  }
  .wg-input:focus { border-color:#6366f1; box-shadow:0 0 0 3px rgba(99,102,241,.12); }
  .wg-input::placeholder { color:#9ca3af; }
  .wg-btn-primary {
    display:inline-flex; align-items:center; gap:8px; padding:11px 22px;
    background:linear-gradient(135deg,#6366f1,#4f46e5); color:#fff;
    border:none; border-radius:10px; font-size:14px; font-weight:600;
    cursor:pointer; transition:transform .15s, box-shadow .15s; font-family:'DM Sans',sans-serif;
  }
  .wg-btn-primary:hover:not(:disabled) { transform:translateY(-1px); box-shadow:0 8px 24px rgba(99,102,241,.3); }
  .wg-btn-primary:disabled { opacity:.5; cursor:not-allowed; }
  .wg-btn-ghost {
    display:inline-flex; align-items:center; gap:6px; padding:10px 18px;
    background:transparent; color:#6b7280; border:1.5px solid #e5e7eb;
    border-radius:10px; font-size:14px; font-weight:500; cursor:pointer;
    transition:all .15s; font-family:'DM Sans',sans-serif;
  }
  .wg-btn-ghost:hover { border-color:#d1d5db; color:#374151; background:#f9fafb; }
  .wg-step-indicator.active { background:#6366f1; color:#fff; border-color:#6366f1; }
  .wg-step-indicator.done   { background:#10b981; color:#fff; border-color:#10b981; }
  .wg-step-indicator.idle   { background:#fff; color:#9ca3af; border-color:#e5e7eb; }
  .wg-code-block {
    background:#0f172a; border:1px solid #1e293b; border-radius:12px;
    padding:18px 20px; overflow-x:auto; position:relative;
  }
  .wg-code-block pre { margin:0; font-family:'JetBrains Mono',monospace; font-size:12px; line-height:1.7; color:#94a3b8; white-space:pre; }
  .wg-code-block pre .kw  { color:#818cf8; }
  .wg-code-block pre .val { color:#34d399; }
  .wg-code-block pre .cmt { color:#475569; font-style:italic; }
  .wg-code-block pre .key { color:#f472b6; }

  .wg-status-tunnel { transition:all .3s; }
  .wg-progress-bar  { transition:width .6s cubic-bezier(.4,0,.2,1); }

  .wg-shimmer-row {
    background:linear-gradient(90deg,#f3f4f6 25%,#e9eaec 50%,#f3f4f6 75%);
    background-size:200% 100%;
    animation:wg-shimmer 1.4s infinite;
    border-radius:6px;
  }
`;

// ── Helpers ────────────────────────────────────────────────────────────────────
const getCsrf = () =>
  document?.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';

function useCopy() {
  const [copied, setCopied] = useState('');
  const copy = useCallback((text, key = 'default') => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(key);
      setTimeout(() => setCopied(''), 2000);
    });
  }, []);
  return { copied, copy };
}

// ── Step meta ──────────────────────────────────────────────────────────────────
const STEPS = [
  { id: 'device',    label: 'Device Info',    icon: Router  },
  { id: 'tunnel',    label: 'WireGuard',      icon: Shield  },
  { id: 'script',    label: 'Apply Script',   icon: Terminal },
  { id: 'verify',    label: 'Verify Tunnel',  icon: CheckCircle },
  { id: 'services',  label: 'Services',       icon: Wifi    },
];

// ── Step indicator bar ─────────────────────────────────────────────────────────
function StepBar({ current }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:0, marginBottom:32 }}>
      {STEPS.map((s, i) => {
        const Icon = s.icon;
        const state = i < current ? 'done' : i === current ? 'active' : 'idle';
        return (
          <div key={s.id} style={{ display:'flex', alignItems:'center', flex: i < STEPS.length-1 ? 1 : 'none' }}>
            <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:6 }}>
              <div className={`wg-step-indicator ${state}`} style={{
                width:36, height:36, borderRadius:'50%', border:'2px solid',
                display:'flex', alignItems:'center', justifyContent:'center',
                transition:'all .3s', flexShrink:0,
              }}>
                {state === 'done'
                  ? <Check size={16}/>
                  : <Icon size={14}/>}
              </div>
              <span style={{
                fontSize:10, fontWeight:600, textAlign:'center', whiteSpace:'nowrap',
                color: state === 'active' ? '#6366f1' : state === 'done' ? '#10b981' : '#9ca3af',
                letterSpacing:'.04em', textTransform:'uppercase',
              }}>{s.label}</span>
            </div>
            {i < STEPS.length-1 && (
              <div style={{
                flex:1, height:2, margin:'0 6px', marginBottom:22,
                background: i < current ? '#10b981' : '#e5e7eb',
                transition:'background .4s',
              }}/>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Field wrapper ──────────────────────────────────────────────────────────────
function Field({ label, hint, required, children }) {
  return (
    <div style={{ marginBottom:18 }}>
      <label style={{ display:'block', fontSize:13, fontWeight:600, color:'#374151', marginBottom:6 }}>
        {label}{required && <span style={{ color:'#ef4444', marginLeft:2 }}>*</span>}
      </label>
      {children}
      {hint && <p style={{ fontSize:11, color:'#9ca3af', marginTop:5 }}>{hint}</p>}
    </div>
  );
}

// ── Syntax highlight (very lightweight) ───────────────────────────────────────
function HighlightedScript({ text }) {
  const lines = text.split('\n').map((line, i) => {
    if (line.startsWith('#')) return <div key={i}><span className="cmt">{line}</span></div>;
    // key=value pairs
    const parts = line.split(/(?<==)/);
    return (
      <div key={i}>
        {line.split(' ').map((word, j) => {
          if (word.startsWith('#')) return <span key={j} className="cmt">{word} </span>;
          if (word.startsWith('/')) return <span key={j} className="kw">{word} </span>;
          if (word.includes('=')) {
            const [k, ...vs] = word.split('=');
            return <span key={j}><span className="key">{k}</span>=<span className="val">{vs.join('=')}</span> </span>;
          }
          if (['add','set','put','remove','print','ip','interface','route','address','firewall','filter','chain'].includes(word)) {
            return <span key={j} className="kw">{word} </span>;
          }
          return <span key={j}>{word} </span>;
        })}
      </div>
    );
  });
  return <pre>{lines}</pre>;
}



// ── QR Modal ──────────────────────────────────────────────────────────────────
function QrModal({ qrDataUrl, onClose }) {
  return (
    <div style={{
      position:'fixed', inset:0, zIndex:9999,
      background:'rgba(0,0,0,.55)', backdropFilter:'blur(6px)',
      display:'flex', alignItems:'center', justifyContent:'center', padding:24,
    }} onClick={onClose}>
      <motion.div initial={{ scale:.88, opacity:0 }} 
      animate={{ scale:1, opacity:1 }}
        transition={{ type:'spring', stiffness:220, damping:22 }}
        className="wg-card" style={{ padding:32, textAlign:'center', maxWidth:320 }}
        onClick={e => e.stopPropagation()}>
        <h3 style={{ fontSize:16, fontWeight:700, color:'#111827', marginBottom:4 }}>Scan with WireGuard App</h3>
        <p style={{ fontSize:12, color:'#9ca3af', marginBottom:20 }}>Open the WireGuard mobile app and scan this QR code to import the tunnel</p>
        <img src={qrDataUrl} 
        alt="WireGuard QR"
        //  style={{ width:220, height:220, 
        //  borderRadius:8, margin:'0 auto', display:'block',
        //  border:'1px solid #e5e7eb' }}
         style={{ 
                    maxWidth: '100%', 
                    height: 'auto',
                    maxHeight: '400px',
                    objectFit: 'contain'
                  }} 
         
         />
        <button onClick={onClose} className="wg-btn-ghost" style={{ marginTop:20, width:'100%', justifyContent:'center' }}>Close</button>
      </motion.div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ══════════════════════════════════════════════════════════════════════════════
export default function MikrotikWireguardOnboarding({ onComplete }) {
  const subdomain = window.location.hostname.split('.')[0];
  const { copied, copy } = useCopy();

  const [step,        setStep]        = useState(0);
  const [loading,     setLoading]     = useState(false);
  const [showQr,      setShowQr]      = useState(false);
  const [showPrivKey, setShowPrivKey] = useState(false);
  const [polling,     setPolling]     = useState(false);
  const [tunnelUp,    setTunnelUp]    = useState(false);
  const [pollCount,   setPollCount]   = useState(0);
  const pollRef = useRef(null);

  // ── Step 1 form ──────────────────────────────────────────────────────────────
  const [deviceForm, setDeviceForm] = useState({
    identity:        '',
    router_ip:       '',
    network_address: '10.2.0.0',
    subnet_mask:     '24',
    client_ip:       '',
    notes:           '',
  });

  // ── Step 2 result (from API) ─────────────────────────────────────────────────
  const [wgConfig, setWgConfig] = useState(null);
  // { mikrotik_config, server_config, client_ip, server_ip, network,
  //   private_key, public_key, qr_code_data_url }

  // ── Step 5 services ──────────────────────────────────────────────────────────
  const [services, setServices] = useState({
    pppoe:   false,
    hotspot: false,
    pppoe_pool:   '192.168.100.2-192.168.100.254',
    hotspot_pool: '10.3.0.2-10.3.0.254',
    pppoe_secret_prefix: 'client',
  });

  // ── Generate WireGuard config (Step 1 → 2) ───────────────────────────────────
  const generateConfig = async () => {
    // if (!deviceForm.identity.trim()) {
    //   toast.error('Please enter the MikroTik identity name.');
    //   return;
    // }
    setLoading(true);
    try {
      const res = await fetch('/api/wireguard/generate_config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Subdomain':  subdomain,
          'X-CSRF-Token': getCsrf(),
        },
        body: JSON.stringify({
          network_address: deviceForm.network_address,
          subnet_mask:     deviceForm.subnet_mask,
          client_ip:       deviceForm.client_ip || undefined,
          identity:        deviceForm.identity,
          router_ip:       deviceForm.router_ip,
        }),
      });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error || 'Failed to generate config'); return; }
      setWgConfig(data);
      toast.success('WireGuard configuration generated!');
      setStep(2); // Jump straight to script view
    } catch (e) {
      toast.error('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ── Also supports QR (mobile app flow) ───────────────────────────────────────
  const generateAppConfig = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/wireguard/generate_wireguard_app_config', {
        method: 'POST',
        headers: { 'Content-Type':'application/json',
           'X-Subdomain':subdomain,  },
        body: JSON.stringify({ network_address: deviceForm.network_address }),
      });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error || 'Failed'); return; }
      // setWgConfig(data);
      setWgConfig(prev => ({ ...prev, ...data }));
      setShowQr(true);
    } catch (_) {
      toast.error('Failed to generate QR config.');
    } finally {
      setLoading(false);
    }
  };

  // ── Poll tunnel reachability ─────────────────────────────────────────────────
  const startPolling = useCallback(() => {
    setPolling(true);
    setPollCount(0);
    setTunnelUp(false);
    let count = 0;
    pollRef.current = setInterval(async () => {
      count++;
      setPollCount(count);
      try {
        const res = await fetch(`/api/wireguard/check_peer?public_key=${encodeURIComponent(wgConfig?.public_key || '')}`, {
          headers: { 'X-Subdomain': subdomain },
        });
        const data = await res.json();
        if (data.connected) {
          clearInterval(pollRef.current);
          setTunnelUp(true);
          setPolling(false);
          toast.success('Tunnel is UP! MikroTik connected successfully.');
          setTimeout(() => setStep(4), 1200);
        }
      } catch (_) {}
      if (count >= 24) { // 2 min timeout
        clearInterval(pollRef.current);
        setPolling(false);
      }
    }, 5000);
  }, [wgConfig, subdomain]);

  useEffect(() => () => { if (pollRef.current) clearInterval(pollRef.current); }, []);

  // ── PPPoE script generator ───────────────────────────────────────────────────
  const pppoeScript = `# PPPoE Server Setup — paste in MikroTik terminal
/ip pool add name=pppoe-pool ranges=${services.pppoe_pool}
/ppp profile add name=pppoe-profile local-address=192.168.100.1 remote-address=pppoe-pool use-encryption=yes
/interface pppoe-server server add service-name=pppoe interface=ether1 authentication=mschap2 default-profile=pppoe-profile enabled=yes max-sessions=500
/ip firewall nat add chain=srcnat out-interface=ether1 action=masquerade`;

  const hotspotScript = `# Hotspot Setup — paste in MikroTik terminal  
 /interface bridge add name=bridge-hotspot comment="Owitech Hotspot"
    /interface/bridge/port add interface=ether5 bridge=bridge-hotspot
    /ip pool
    add name=hotspot-pool ranges=10.3.0.2-10.3.0.254 comment="Hotspot IP Pool Owitech"

    /ip address
add address=10.3.0.1/24 comment="hotspot network Owitech" interface=bridge-hotspot
/ip dhcp-server
add address-pool=hotspot-pool disabled=no interface=bridge-hotspot lease-time=40m name=hotspot-dhcp comment="Hotspot DHCP Owitech"

/ip dhcp-server network
add address=10.3.0.0/24 comment="hotspot network Owitech" gateway=10.3.0.1 netmask=255.255.255.0 dns-s=8.8.8.8
    /ip hotspot profile add name=hsprof1 hotspot-address=10.3.0.1 use-radius=yes radius-accounting=yes radius-interim-update=10s
    

  /ip hotspot add name=hotspot1 interface=bridge-hotspot profile=hsprof1 address-pool=hotspot-pool disabled=no 

/ip dns
set allow-remote-requests=yes

# Walled Garden for AITechs
/ip hotspot walled-garden ip add action=accept dst-host=${window.location.hostname.split('.')[0]}.owitech.co.ke
/ip hotspot walled-garden add action=allow dst-host="^:${window.location.hostname.split('.')[0]}.owitech.co.ke path=:/hotspot-page\\$"



    /ip firewall nat add chain=srcnat action=masquerade out-interface=bridge-hotspot comment="Hotspot Owitech"





`;

  // ── Render ────────────────────────────────────────────────────────────────────
  return (
    <>
      <style>{CSS}</style>
      <Toaster position="top-right" 
      toastOptions={{ style:{ fontFamily:'DM Sans,sans-serif', fontSize:13 } }}/>
      {showQr && wgConfig?.qr_code_data_url && (
        <QrModal qrDataUrl={wgConfig.qr_code_data_url} onClose={() => setShowQr(false)}/>
      )}

      <div className="wg-root" style={{
        minHeight:'100vh',
        
        padding:'32px 16px', display:'flex',
         flexDirection:'column', alignItems:'center',
      }}>
        <div style={{ width:'100%', maxWidth:760 }}>

          {/* Page header */}
          <motion.div initial={{ opacity:0, y:-12 }}
           animate={{ opacity:1, y:0 }} style={{ textAlign:'center',
            marginBottom:36 }}>
            <div style={{ display:'inline-flex', 
              alignItems:'center', gap:10, padding:'6px 16px',
               borderRadius:20, background:'rgba(99,102,241,.08)', 
               border:'1px solid rgba(99,102,241,.18)', marginBottom:14 }}>
              <Router size={14} style={{ color:'#6366f1' }}/>
              <span style={{ fontSize:12, fontWeight:600, color:'#6366f1',
                 letterSpacing:'.06em',
                  textTransform:'uppercase' }}>MikroTik Onboarding</span>
            </div>
            <h1 style={{ fontSize:30, fontWeight:800, color:'#111827', margin:'0 0 8px', letterSpacing:'-.03em' }}>
              Connect Your Router
            </h1>
            <p style={{ fontSize:14, color:'#6b7280', margin:0 }}>
              Follow the steps to connect your MikroTik to our WireGuard VPN and provision services.
            </p>
          </motion.div>

          <div className="wg-card" style={{ padding:'32px 36px' }}>
            <StepBar current={step}/>

            <AnimatePresence mode="wait">

              {/* ══ STEP 0 — Device Info ══ */}
              {step === 0 && (
                <motion.div key="step0"
                  initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-20 }}
                  transition={{ duration:.22 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:24 }}>
                    <div style={{ width:38, height:38, borderRadius:10, background:'rgba(99,102,241,.1)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                      <Router size={18} style={{ color:'#6366f1' }}/>
                    </div>
                    <div>
                      <h2 style={{ fontSize:17, fontWeight:700, color:'#111827', margin:0 }}>Wireguard Configuration</h2>
                      <p style={{ fontSize:12, color:'#9ca3af', margin:0 }}>Basic info about your MikroTik router</p>
                    </div>
                  </div>

                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
                    

                 
                    <Field label="WireGuard Network" hint="VPN subnet to assign">
                      <input className="wg-input" value={deviceForm.network_address}
                        onChange={e=>setDeviceForm(p=>({...p,network_address:e.target.value}))}
                        placeholder="10.2.0.0"/>
                    </Field>
                    <Field label="Subnet Mask" hint="CIDR prefix (e.g. 24)">
                      <input className="wg-input" value={deviceForm.subnet_mask}
                        onChange={e=>setDeviceForm(p=>({...p,subnet_mask:e.target.value}))}
                        placeholder="24"/>
                    </Field>
                    <Field label="Preferred Client IP" hint="Optional — leave blank for auto-assign">
                      <input className="wg-input" value={deviceForm.client_ip}
                        onChange={e=>setDeviceForm(p=>({...p,client_ip:e.target.value}))}
                        placeholder="10.2.0.10 (optional)"/>
                    </Field>


                    {/* <Field label="Notes" hint="Internal reference only">
                      <input className="wg-input" value={deviceForm.notes}
                        onChange={e=>setDeviceForm(p=>({...p,notes:e.target.value}))}
                        placeholder="e.g. Nairobi tower - rooftop"/>
                    </Field> */}


                  </div>

                  {/* Info banner */}
                  <div style={{ display:'flex', gap:10, padding:'12px 16px', background:'#fffbeb', border:'1px solid #fde68a', borderRadius:10, marginTop:8, marginBottom:24 }}>
                    <Info size={15} style={{ color:'#d97706', flexShrink:0, marginTop:2 }}/>
                    <p style={{ fontSize:12, color:'#92400e', margin:0, lineHeight:1.5 }}>
                      We will generate a WireGuard key pair and assign a VPN IP to this router.
                      The private key will only be shown once — copy it immediately.
                    </p>
                  </div>

                  <div style={{ display:'flex', justifyContent:'flex-end' }}>
                    <button className="wg-btn-primary" onClick={generateConfig} disabled={loading}>
                      {loading ? <><span style={{ width:14, height:14, border:'2px solid rgba(255,255,255,.4)', borderTop:'2px solid #fff', borderRadius:'50%', animation:'wg-spin 1s linear infinite', display:'inline-block' }}/> Generating…</> : <>Generate WireGuard Config <ChevronRight size={15}/></>}
                    </button>
                  </div>
                </motion.div>
              )}

              {/* ══ STEP 2 — Script ══ */}
              {step === 2 && wgConfig && (
                <motion.div key="step2"
                  initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-20 }}
                  transition={{ duration:.22 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:20 }}>
                    <div style={{ width:38, height:38, borderRadius:10, background:'rgba(16,185,129,.1)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                      <Terminal size={18} style={{ color:'#10b981' }}/>
                    </div>
                    <div>
                      <h2 style={{ fontSize:17, fontWeight:700, color:'#111827', margin:0 }}>Apply to MikroTik</h2>
                      <p style={{ fontSize:12, color:'#9ca3af', margin:0 }}>Open a terminal in WinBox or SSH and paste the script below</p>
                    </div>
                  </div>

                  {/* Key summary cards */}
                  <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10, marginBottom:16 }}>
                    {[
                      { label:'Assigned IP', value:wgConfig.client_ip, icon:Network, color:'#6366f1' },
                      { label:'Server IP',   value:wgConfig.server_ip, icon:Server,  color:'#0ea5e9' },
                      { label:'Network',     value:wgConfig.network,   icon:Globe,   color:'#10b981' },
                    ].map(k => {
                      const Icon = k.icon;
                      return (
                        <div key={k.label} style={{ padding:'12px 14px', borderRadius:10, border:`1px solid ${k.color}22`, background:`${k.color}08` }}>
                          <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:4 }}>
                            <Icon size={12} style={{ color:k.color }}/>
                            <span style={{ fontSize:10, color:k.color, fontWeight:600, textTransform:'uppercase', letterSpacing:'.06em' }}>{k.label}</span>
                          </div>
                          <p className="wg-mono" style={{ fontSize:13, color:'#111827', margin:0, fontWeight:600 }}>{k.value}</p>
                        </div>
                      );
                    })}
                  </div>

                  {/* Private key — sensitive */}
                  <div style={{ padding:'12px 16px', borderRadius:10, background:'#fff7ed', border:'1px solid #fed7aa', marginBottom:16 }}>
                    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:6 }}>
                      <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                        <Key size={13} style={{ color:'#ea580c' }}/>
                        <span style={{ fontSize:12, fontWeight:600, color:'#ea580c' }}>Private Key — save this now</span>
                      </div>
                      <div style={{ display:'flex', gap:8 }}>
                        <button onClick={() => setShowPrivKey(p=>!p)} style={{ background:'none', border:'none', cursor:'pointer', color:'#9a3412', display:'flex', alignItems:'center', gap:4, fontSize:11 }}>
                          {showPrivKey ? <EyeOff size={13}/> : <Eye size={13}/>} {showPrivKey?'Hide':'Show'}
                        </button>
                        <button onClick={() => copy(wgConfig.private_key, 'privkey')} style={{ background:'none', border:'none', cursor:'pointer', color:'#9a3412', display:'flex', alignItems:'center', gap:4, fontSize:11 }}>
                          {copied==='privkey' ? <><Check size={13}/> Copied!</> : <><Copy size={13}/> Copy</>}
                        </button>
                      </div>
                    </div>
                    <p className="wg-mono" style={{ fontSize:12, color:'#9a3412', wordBreak:'break-all', margin:0, filter:showPrivKey?'none':'blur(5px)', transition:'filter .25s', userSelect:showPrivKey?'text':'none' }}>
                      {wgConfig.private_key}
                    </p>
                  </div>

                  {/* MikroTik script */}
                  <div style={{ marginBottom:8 }}>
                    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:8 }}>
                      <span style={{ fontSize:13, fontWeight:600, color:'#374151' }}>MikroTik Terminal Script</span>
                      <div style={{ display:'flex', gap:8 }}>
                        <button onClick={() => copy(wgConfig.mikrotik_config, 'script')}
                          className="wg-btn-ghost" style={{ padding:'6px 12px', fontSize:12 }}>
                          {copied==='script' ? <><Check size={12}/> Copied!</> : <><Copy size={12}/> Copy Script</>}
                        </button>
                        <button onClick={generateAppConfig} disabled={loading}
                          className="wg-btn-ghost" style={{ padding:'6px 12px', fontSize:12 }}>
                          <QrCode size={12}/> QR Code
                        </button>
                      </div>
                    </div>
                    <div className="wg-code-block">
                      <HighlightedScript text={wgConfig.mikrotik_config}/>
                    </div>
                  </div>

                  <div style={{ padding:'10px 14px', borderRadius:8, background:'#f0fdf4', border:'1px solid #bbf7d0', marginTop:12, marginBottom:20 }}>
                    <p style={{ fontSize:12, color:'#166534', margin:0 }}>
                      ✅ Paste this entire script into the MikroTik terminal (WinBox → New Terminal or SSH). Then click <strong>Check Connection</strong> below.
                    </p>
                  </div>

                  <div style={{ display:'flex', justifyContent:'space-between' }}>
                    <button className="wg-btn-ghost" onClick={() => setStep(0)}>
                      <ChevronLeft size={15}/> Back
                    </button>
                    <button className="wg-btn-primary" onClick={() => setStep(3)}>
                      Done — Verify Tunnel <ChevronRight size={15}/>
                    </button>
                  </div>
                </motion.div>
              )}

              {/* ══ STEP 3 — Verify tunnel ══ */}
              {step === 3 && (
                <motion.div key="step3"
                  initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-20 }}
                  transition={{ duration:.22 }}>
                  <div style={{ textAlign:'center', padding:'20px 0 16px' }}>
                    <div style={{
                      width:72, height:72, borderRadius:'50%', margin:'0 auto 20px',
                      background: tunnelUp ? 'rgba(16,185,129,.1)' : 'rgba(99,102,241,.08)',
                      border:`2px solid ${tunnelUp ? '#10b981' : '#6366f1'}44`,
                      display:'flex', alignItems:'center', justifyContent:'center',
                      animation: tunnelUp ? 'none' : polling ? 'wg-glow-in 2s ease infinite alternate' : 'none',
                    }}>
                      {tunnelUp
                        ? <CheckCircle size={32} style={{ color:'#10b981' }}/>
                        : polling
                          ? <div style={{ width:28, height:28, border:'3px solid rgba(99,102,241,.2)', borderTop:'3px solid #6366f1', borderRadius:'50%', animation:'wg-spin 1s linear infinite' }}/>
                          : <Shield size={32} style={{ color:'#6366f1' }}/>
                      }
                    </div>

                    <h2 style={{ fontSize:20, fontWeight:800, color:'#111827', margin:'0 0 8px' }}>
                      {tunnelUp ? 'Tunnel Active! 🎉' : polling ? 'Checking tunnel…' : 'Verify Connection'}
                    </h2>
                    <p style={{ fontSize:13, color:'#6b7280', maxWidth:380, margin:'0 auto 24px' }}>
                      {tunnelUp
                        ? 'WireGuard tunnel is established. Your MikroTik is connected.'
                        : polling
                          ? `Polling for handshake… attempt ${pollCount}/24 (5s interval)`
                          : 'After applying the script, click below to check if the WireGuard handshake succeeded.'}
                    </p>

                    {/* Progress bar */}
                    {polling && (
                      <div style={{ height:4, background:'#e5e7eb', borderRadius:99, overflow:'hidden', maxWidth:320, margin:'0 auto 24px' }}>
                        <div className="wg-progress-bar" style={{ height:'100%', background:'linear-gradient(90deg,#6366f1,#8b5cf6)', width:`${(pollCount/24)*100}%`, borderRadius:99 }}/>
                      </div>
                    )}

                    {!polling && !tunnelUp && (
                      <button className="wg-btn-primary" onClick={startPolling} style={{ margin:'0 auto' }}>
                        <Zap size={15}/> Check Connection
                      </button>
                    )}

                    {polling && (
                      <p style={{ fontSize:11, color:'#9ca3af' }}>
                        Make sure the MikroTik script has been applied. Timeout in {Math.max(0, 24-pollCount) * 5}s.
                      </p>
                    )}

                    {!polling && !tunnelUp && pollCount > 0 && (
                      <div style={{ marginTop:16, padding:'12px 16px', background:'#fef2f2', border:'1px solid #fecaca', borderRadius:10, maxWidth:380, margin:'16px auto 0' }}>
                        <div style={{ display:'flex', gap:8, alignItems:'flex-start' }}>
                          <AlertCircle size={14} style={{ color:'#dc2626', flexShrink:0, marginTop:2 }}/>
                          <p style={{ fontSize:12, color:'#991b1b', margin:0 }}>
                            Handshake not detected. Check that the script ran without errors and the MikroTik can reach <strong>102.221.35.92:51820</strong>.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div style={{ display:'flex', justifyContent:'space-between', marginTop:24 }}>
                    <button className="wg-btn-ghost" onClick={() => setStep(2)}>
                      <ChevronLeft size={15}/> Back to Script
                    </button>
                    <button className="wg-btn-primary" onClick={() => setStep(4)}>
                      Skip Verification <ChevronRight size={15}/>
                    </button>
                  </div>
                </motion.div>
              )}

              {/* ══ STEP 4 — Services ══ */}
              {step === 4 && (
                <motion.div key="step4"
                  initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-20 }}
                  transition={{ duration:.22 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:24 }}>
                    <div style={{ width:38, height:38, borderRadius:10, background:'rgba(16,185,129,.1)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                      <Wifi size={18} style={{ color:'#10b981' }}/>
                    </div>
                    <div>
                      <h2 style={{ fontSize:17, fontWeight:700, color:'#111827', margin:0 }}>Configure Services</h2>
                      <p style={{ fontSize:12, color:'#9ca3af', margin:0 }}>Optional — set up PPPoE and Hotspot scripts for this router</p>
                    </div>
                  </div>

                  {/* Toggle cards */}
                  {[
                    {
                      key:'pppoe', icon:Server, color:'#6366f1', label:'PPPoE Server',
                      desc:'Provision a PPPoE server for subscriber authentication',
                      extras: (
                        <>
                          <Field label="IP Pool Range">
                            <input className="wg-input" value={services.pppoe_pool}
                              onChange={e=>setServices(p=>({...p,pppoe_pool:e.target.value}))}/>
                          </Field>
                        </>
                      ),
                      script: pppoeScript,
                      scriptKey: 'pppoe_script',
                    },
                    {
                      key:'hotspot', icon:Wifi, color:'#0ea5e9', label:'Hotspot',
                      desc:'Set up a captive portal hotspot for guest access',
                      extras: (
                        <Field label="IP Pool Range">
                          <input className="wg-input" value={services.hotspot_pool}
                            onChange={e=>setServices(p=>({...p,hotspot_pool:e.target.value}))}/>
                        </Field>
                      ),
                      script: hotspotScript,
                      scriptKey: 'hotspot_script',
                    },
                  ].map(svc => {
                    const Icon = svc.icon;
                    const enabled = services[svc.key];
                    return (
                      <div key={svc.key} style={{
                        border:`1.5px solid ${enabled ? svc.color+'44' : '#e5e7eb'}`,
                        borderRadius:12, marginBottom:14, overflow:'hidden',
                        transition:'border-color .2s',
                      }}>
                        <div
                          onClick={() => setServices(p=>({...p,[svc.key]:!p[svc.key]}))}
                          style={{
                            display:'flex', alignItems:'center', gap:12, padding:'14px 18px',
                            cursor:'pointer', background: enabled ? `${svc.color}06` : '#fff',
                            transition:'background .2s',
                          }}>
                          <div style={{ width:36, height:36, borderRadius:8, background:`${svc.color}12`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                            <Icon size={16} style={{ color:svc.color }}/>
                          </div>
                          <div style={{ flex:1 }}>
                            <p style={{ fontSize:14, fontWeight:600, color:'#111827', margin:'0 0 2px' }}>{svc.label}</p>
                            <p style={{ fontSize:12, color:'#6b7280', margin:0 }}>{svc.desc}</p>
                          </div>
                          {/* Toggle switch */}
                          <div style={{
                            width:42, height:24, borderRadius:12, padding:3,
                            background: enabled ? svc.color : '#e5e7eb',
                            transition:'background .2s', flexShrink:0,
                          }}>
                            <div style={{
                              width:18, height:18, borderRadius:'50%', background:'#fff',
                              transform: enabled ? 'translateX(18px)' : 'translateX(0)',
                              transition:'transform .2s', boxShadow:'0 1px 4px rgba(0,0,0,.15)',
                            }}/>
                          </div>
                        </div>

                        <AnimatePresence>
                          {enabled && (
                            <motion.div initial={{ height:0,opacity:0 }} animate={{ height:'auto',opacity:1 }} exit={{ height:0,opacity:0 }}
                              transition={{ duration:.2 }} style={{ overflow:'hidden' }}>
                              <div style={{ padding:'0 18px 18px', borderTop:`1px solid ${svc.color}22` }}>
                                <div style={{ marginTop:14, marginBottom:14 }}>{svc.extras}</div>
                                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:8 }}>
                                  <span style={{ fontSize:12, fontWeight:600, color:'#374151' }}>Terminal Script</span>
                                  <button onClick={() => copy(svc.script, svc.scriptKey)}
                                    className="wg-btn-ghost" style={{ padding:'5px 10px', fontSize:11 }}>
                                    {copied===svc.scriptKey ? <><Check size={11}/> Copied!</> : <><Copy size={11}/> Copy</>}
                                  </button>
                                </div>
                                <div className="wg-code-block">
                                  <HighlightedScript text={svc.script}/>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}

                  <div style={{ display:'flex', 
                    justifyContent:'space-between', marginTop:8 }}>
                    <button className="wg-btn-ghost" 
                    onClick={() => setStep(3)}>
                      <ChevronLeft size={15}/> Back
                    </button>
                    <button className="wg-btn-primary "
                     onClick={() => { toast.success('Router onboarding complete!'); onComplete?.(); }}>
                      <CheckCircle size={15}/> Complete Onboarding
                    </button>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>

          {/* Help footer */}
          <div style={{ textAlign:'center', marginTop:20 }}>
            <p style={{ fontSize:12, color:'#9ca3af' }}>
              Need help? Contact support via WhatsApp or check the{' '}
              <a href="#" style={{ color:'#6366f1', textDecoration:'none', fontWeight:500 }}>MikroTik setup guide</a>.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}