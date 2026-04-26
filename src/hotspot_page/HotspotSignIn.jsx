import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Wifi, Tag, Receipt, ArrowRight, RefreshCw,
  CheckCircle, AlertCircle, Shield, Smartphone,
  Lock, ChevronRight, Phone, CreditCard,
  Zap, Clock, Globe, X, ArrowLeft,
} from 'lucide-react';

// ── Styles ─────────────────────────────────────────────────────────────────────
const Styles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Space+Mono:wght@400;700&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Plus Jakarta Sans', sans-serif; }
    .mono { font-family: 'Space Mono', monospace; }
    input:-webkit-autofill, input:-webkit-autofill:focus {
      -webkit-box-shadow: 0 0 0 1000px #0f172a inset !important;
      -webkit-text-fill-color: #e2e8f0 !important;
    }
    ::-webkit-scrollbar { width: 4px; }
    ::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 4px; }

    @keyframes drift {
      0%,100% { transform: translate(0,0) scale(1); }
      33%      { transform: translate(20px,-30px) scale(1.06); }
      66%      { transform: translate(-15px,20px) scale(0.96); }
    }
    @keyframes ripple {
      0%   { transform: scale(0.8); opacity: 0.6; }
      100% { transform: scale(2.4); opacity: 0; }
    }
    @keyframes ticker {
      0%   { transform: translateX(0); }
      100% { transform: translateX(-50%); }
    }
    @keyframes gradientShift {
      0%,100% { background-position: 0% 50%; }
      50%      { background-position: 100% 50%; }
    }
    @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
    @keyframes shimmer {
      0%   { background-position: -200% 0; }
      100% { background-position:  200% 0; }
    }

    .drift1 { animation: drift 12s ease-in-out infinite; }
    .drift2 { animation: drift 16s ease-in-out infinite reverse; }
    .drift3 { animation: drift 10s ease-in-out infinite 3s; }
    .ripple  { animation: ripple 2.5s ease-out infinite; }
    .ripple2 { animation: ripple 2.5s ease-out infinite 0.8s; }
    .ripple3 { animation: ripple 2.5s ease-out infinite 1.6s; }
    .ticker-inner { animation: ticker 22s linear infinite; }
    .cursor-blink { animation: blink 1s step-end infinite; }
    .gradient-btn {
      background: linear-gradient(135deg, #0ea5e9, #6366f1);
      background-size: 200% 200%;
      animation: gradientShift 3s ease infinite;
      transition: opacity .2s, transform .15s;
    }
    .gradient-btn:hover:not(:disabled) { opacity:.9; transform:translateY(-1px); }
    .gradient-btn:active:not(:disabled) { transform:translateY(0); }
    .gradient-btn:disabled { animation:none; background:#1e293b; opacity:.5; cursor:not-allowed; }
    .card-glass {
      background: rgba(15,23,42,0.72);
      backdrop-filter: blur(24px);
      -webkit-backdrop-filter: blur(24px);
    }
    .input-base {
      background: rgba(30,41,59,0.55);
      border: 1px solid rgba(148,163,184,0.11);
      transition: border-color .2s, box-shadow .2s;
      color: #e2e8f0;
    }
    .input-base:focus { outline:none; border-color:rgba(56,189,248,.4); box-shadow:0 0 0 3px rgba(56,189,248,.07); }
    .input-base::placeholder { color: rgba(148,163,184,.3); }
    .pkg-card { transition: border-color .2s, transform .15s, background .2s; }
    .pkg-card:hover { transform: translateY(-1px); }
    .pkg-shimmer {
      background: linear-gradient(90deg, transparent, rgba(255,255,255,.04), transparent);
      background-size: 200% 100%;
      animation: shimmer 2.5s infinite;
    }
    .tab-pill {
      transition: background .2s, color .2s, border-color .2s;
    }
  `}</style>
);

// ── Mock packages — replace with your API ─────────────────────────────────────
const MOCK_PACKAGES = [
  { id: 1, name: '1 Hour',   price: 20,  valid: '1 Hour',  speed: '5 Mbps',  popular: false, accent: '#38bdf8' },
  { id: 2, name: 'Day Pass', price: 50,  valid: '24 Hours',speed: '10 Mbps', popular: true,  accent: '#a78bfa' },
  { id: 3, name: 'Weekly',   price: 200, valid: '7 Days',  speed: '15 Mbps', popular: false, accent: '#34d399' },
  { id: 4, name: 'Monthly',  price: 600, valid: '30 Days', speed: '20 Mbps', popular: false, accent: '#fb923c' },
];

const getCsrf = () =>
  document?.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';

// ── Status banner ──────────────────────────────────────────────────────────────
function StatusBanner({ status, message, onDismiss }) {
  if (!status) return null;
  const map = {
    error:      { bg: 'rgba(239,68,68,.08)',   border: 'rgba(239,68,68,.25)',   text: '#fca5a5', Icon: AlertCircle },
    success:    { bg: 'rgba(52,211,153,.08)',  border: 'rgba(52,211,153,.25)',  text: '#6ee7b7', Icon: CheckCircle },
    processing: { bg: 'rgba(251,191,36,.08)',  border: 'rgba(251,191,36,.25)',  text: '#fcd34d', Icon: RefreshCw },
    cancelled:  { bg: 'rgba(251,146,60,.08)',  border: 'rgba(251,146,60,.25)',  text: '#fdba74', Icon: X },
  };
  const s = map[status] || map.error;
  return (
    <motion.div initial={{ opacity:0, y:-6 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-6 }}
      className="flex items-start gap-3 p-4 rounded-2xl border text-sm"
      style={{ background: s.bg, borderColor: s.border, color: s.text }}
    >
      <s.Icon size={16} className={`shrink-0 mt-0.5 ${status==='processing'?'animate-spin':''}`} />
      <span className="flex-1 leading-relaxed">{message}</span>
      {onDismiss && status !== 'processing' && (
        <button onClick={onDismiss} className="shrink-0 text-lg leading-none opacity-60 hover:opacity-100">×</button>
      )}
    </motion.div>
  );
}

function ConnectedScreen({ username, packageName, expiration }) {
  return (
    <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background:'rgba(2,6,23,.92)', backdropFilter:'blur(20px)' }}
    >
      <motion.div
        initial={{ scale:.82, opacity:0 }} animate={{ scale:1, opacity:1 }}
        transition={{ type:'spring', stiffness:220, damping:20 }}
        className="card-glass w-full max-w-sm rounded-3xl p-8 text-center border"
        style={{ borderColor:'rgba(52,211,153,.2)', boxShadow:'0 0 60px rgba(52,211,153,.1)' }}
      >
        <div className="relative w-24 h-24 mx-auto mb-6 flex items-center justify-center">
          <div className="ripple  absolute inset-0 rounded-full border" style={{ borderColor:'rgba(52,211,153,.5)' }} />
          <div className="ripple2 absolute inset-0 rounded-full border" style={{ borderColor:'rgba(52,211,153,.3)' }} />
          <div className="ripple3 absolute inset-0 rounded-full border" style={{ borderColor:'rgba(52,211,153,.15)' }} />
          <div className="relative w-16 h-16 rounded-2xl flex items-center justify-center"
            style={{ background:'rgba(52,211,153,.15)', border:'1px solid rgba(52,211,153,.3)' }}>
            <Wifi size={28} style={{ color:'#34d399' }} />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-white mb-1">Connected!</h2>
        <p className="text-sm mb-7" style={{ color:'#64748b' }}>You're online — enjoy browsing.</p>
        <div className="space-y-2 text-left mb-6">
          {[['Username', username], ['Package', packageName], ['Expires', expiration]].map(([l, v]) => (
            <div key={l} className="flex items-center justify-between px-4 py-3 rounded-xl"
              style={{ background:'rgba(30,41,59,.6)', border:'1px solid rgba(148,163,184,.08)' }}>
              <span className="text-xs" style={{ color:'#64748b' }}>{l}</span>
              <span className="text-sm font-semibold text-slate-200 mono">{v || '—'}</span>
            </div>
          ))}
        </div>
        <a href="/" className="gradient-btn block w-full py-3.5 rounded-2xl text-white font-semibold text-sm text-center">
          Start Browsing →
        </a>
      </motion.div>
    </motion.div>
  );
}

// ── Package card ───────────────────────────────────────────────────────────────
function PkgCard({ pkg, selected, onClick }) {
  return (
    <motion.button whileTap={{ scale:.98 }} onClick={onClick}
      className="pkg-card relative w-full text-left p-4 rounded-2xl border overflow-hidden"
      style={{
        borderColor: selected ? pkg.accent : 'rgba(148,163,184,.1)',
        background: selected ? `${pkg.accent}0f` : 'rgba(15,23,42,.5)',
      }}
    >
      {selected && <div className="pkg-shimmer absolute inset-0 pointer-events-none" />}

      {pkg.popular && (
        <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-xs font-bold"
          style={{ background: `${pkg.accent}22`, color: pkg.accent }}>
          Popular
        </div>
      )}

      <div className="flex items-center gap-3">
        {/* Icon */}
        <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: `${pkg.accent}18`, border:`1px solid ${pkg.accent}28` }}>
          <Wifi size={18} style={{ color: pkg.accent }} />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-slate-100">{pkg.name}</p>
          <div className="flex items-center gap-3 mt-0.5">
            <span className="flex items-center gap-1 text-xs" style={{ color:'#64748b' }}>
              <Clock size={9} /> {pkg.valid}
            </span>
            <span className="flex items-center gap-1 text-xs" style={{ color:'#64748b' }}>
              <Zap size={9} /> {pkg.speed}
            </span>
          </div>
        </div>

        {/* Price */}
        <div className="text-right shrink-0">
          <p className="text-lg font-bold text-slate-100 mono">
            <span className="text-xs font-normal mr-0.5" style={{ color:'#64748b' }}>Ksh</span>
            {pkg.price}
          </p>
        </div>
      </div>

      {/* Selected indicator */}
      {selected && (
        <motion.div initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:'auto' }}
          className="mt-3 pt-3 border-t flex items-center gap-2"
          style={{ borderColor:`${pkg.accent}25` }}>
          <CheckCircle size={12} style={{ color: pkg.accent }} />
          <span className="text-xs font-medium" style={{ color: pkg.accent }}>Selected — tap Pay Now to continue</span>
        </motion.div>
      )}
    </motion.button>
  );
}

// ── Main ───────────────────────────────────────────────────────────────────────
export default function HotspotSignIn() {
  const hotspotName  = 'NetZone WiFi';
  const hotspotPhone = '0712 345 678';
  const subdomain    = window.location.hostname.split('.')[0];
  const params       = new URLSearchParams(window.location.search);
  const mac          = params.get('mac') || localStorage.getItem('hotspot_mac') || '';
  const ip           = params.get('ip')  || localStorage.getItem('hotspot_ip')  || '';

  // ── Tabs: packages | voucher | mpesa
  const [tab, setTab]               = useState('packages');

  // ── Packages state
  const [packages, setPackages]     = useState(MOCK_PACKAGES);
  const [pkgLoading, setPkgLoading] = useState(false);
  const [selectedPkg, setSelectedPkg] = useState(null);
  const [payStep, setPayStep]       = useState('list'); // list | pay
  const [phoneNumber, setPhoneNumber] = useState('');

  // ── Voucher
  const [voucher, setVoucher]       = useState('');

  // ── M-Pesa receipt
  const [txCode, setTxCode]         = useState('');

  // ── Shared status
  const [loading, setLoading]       = useState(false);
  const [status, setStatus]         = useState(null);
  const [message, setMessage]       = useState('');

  // ── Connection result
  const [connected, setConnected]   = useState(false);
  const [username, setUsername]     = useState('');
  const [connPkg, setConnPkg]       = useState('');
  const [expiry, setExpiry]         = useState('');

  // ── UI
  const [ready, setReady]           = useState(false);
  const [typedName, setTypedName]   = useState('');

  const pollRef = useRef(null);

  // typing animation
  useEffect(() => {
    let i = 0;
    const t = setInterval(() => {
      setTypedName(hotspotName.slice(0, ++i));
      if (i === hotspotName.length) clearInterval(t);
    }, 65);
    return () => clearInterval(t);
  }, []);

  useEffect(() => { setTimeout(() => setReady(true), 80); }, []);
  useEffect(() => () => { if (pollRef.current) clearInterval(pollRef.current); }, []);

  // Fetch packages
  useEffect(() => {
    (async () => {
      try {
        setPkgLoading(true);
        const res = await fetch('/api/allow_get_hotspot_packages', {
          headers: { 'X-Subdomain': subdomain }
        });
        if (res.ok) {
          const data = await res.json();
          if (data.length) {
            // map colour palette by index
            const accents = ['#38bdf8','#a78bfa','#34d399','#fb923c','#f472b6','#facc15'];
            setPackages(data.map((p, i) => ({ ...p, accent: accents[i % accents.length] })));
          }
        }
      } catch (_) {} finally { setPkgLoading(false); }
    })();
  }, []);

  // ── Poll for connection status ─────────────────────────────────────────────
  const startPoll = () => {
    if (pollRef.current) clearInterval(pollRef.current);
    pollRef.current = setInterval(async () => {
      try {
        const res = await fetch('/api/receipt_number_status', {
          method: 'POST',
          headers: { 'Content-Type':'application/json', 'X-Subdomain':subdomain, 'X-CSRF-Token':getCsrf() },
          body: JSON.stringify({ mac, ip })
        });
        const data = await res.json();
        if (res.ok && data.connected) {
          clearInterval(pollRef.current);
          setUsername(data.username || '');
          setConnPkg(data.package || '');
          setExpiry(data.expiration || '');
          setStatus('success');
          setMessage('Payment confirmed! Connecting you…');
          setTimeout(() => setConnected(true), 700);
          setLoading(false);
        }
      } catch (_) {}
    }, 5000);
    setTimeout(() => {
      if (pollRef.current) clearInterval(pollRef.current);
      setStatus('error');
      setMessage('Timed out. Please check your M-Pesa SMS and try the receipt tab.');
      setLoading(false);
    }, 120000);
  };




  
  const reset = () => { setStatus(null); setMessage(''); setLoading(false); if (pollRef.current) clearInterval(pollRef.current); };
  const switchTab = (t) => { setTab(t); reset(); setPayStep('list'); setSelectedPkg(null); setPhoneNumber(''); };

  // ── Pay via M-Pesa STK (from packages tab) ────────────────────────────────
  const handlePackagePay = async (e) => {
    e.preventDefault();
    if (!selectedPkg || !phoneNumber) return;
    setLoading(true); setStatus(null);
    try {
      const res = await fetch('/api/make_payment', {
        method: 'POST',
        headers: { 'Content-Type':'application/json', 'X-Subdomain':subdomain, 'X-CSRF-Token':getCsrf() },
        body: JSON.stringify({ phone_number:phoneNumber, amount:selectedPkg.price, package:selectedPkg.name, ip, mac })
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('checkout_request_id', data.checkout_request_id);
        setStatus('processing');
        setMessage('STK push sent — enter your M-Pesa PIN on your phone to complete payment.');
        startPoll();
      } else {
        setStatus('error');
        setMessage(data.message || 'Payment failed. Please try again.');
        setLoading(false);
      }
    } catch (_) {
      setStatus('error');
      setMessage('Network error. Check your connection and try again.');
      setLoading(false);
    }
  };

  // ── Voucher login ──────────────────────────────────────────────────────────
  const handleVoucher = async (e) => {
    e.preventDefault();
    if (!voucher.trim()) return;
    setLoading(true); setStatus(null);
    try {
      const res = await fetch('/api/login_with_hotspot_voucher', {
        method: 'POST',
        headers: { 'Content-Type':'application/json', 'X-Subdomain':subdomain, 'X-CSRF-Token':getCsrf() },
        body: JSON.stringify({ voucher:voucher.trim(), mac, ip })
      });
      const data = await res.json();
      if (res.ok) {
        setUsername(data.username||voucher); setConnPkg(data.package||''); setExpiry(data.expiration||'');
        setStatus('success'); setMessage('Voucher accepted!');
        setTimeout(() => setConnected(true), 700);
      } else {
        setStatus('error'); setMessage(data.error||'Invalid voucher code.');
      }
    } catch (_) { setStatus('error'); setMessage('Network error. Try again.'); }
    finally { setLoading(false); }
  };

  // ── M-Pesa receipt ────────────────────────────────────────────────────────
  const handleReceipt = async (e) => {
    e.preventDefault();
    if (!txCode.trim()) return;
    setLoading(true); setStatus('processing');
    setMessage('Verifying your M-Pesa transaction…');
    try {
      const res = await fetch('/api/login_with_receipt_number', {
        method: 'POST',
        headers: { 'Content-Type':'application/json', 'X-Subdomain':subdomain, 'X-CSRF-Token':getCsrf() },
        body: JSON.stringify({ receipt_number:txCode.trim().toUpperCase(), mac, ip })
      });
      const data = await res.json();
      if (res.ok) {
        if (data.connected) {
          setUsername(data.username||''); setConnPkg(data.package||''); setExpiry(data.expiration||'');
          setStatus('success'); setMessage('Transaction verified! Connecting…');
          setTimeout(() => setConnected(true), 700);
          setLoading(false);
        } else { setMessage('Transaction found — activating your session…'); startPoll(); }
      } else {
        setStatus('error'); setMessage(data.error||'Transaction not found. Check the code and try again.');
        setLoading(false);
      }
    } catch (_) {
      setStatus('error'); setMessage('Network error. Try again.'); setLoading(false);
    }
  };

  const TABS = [
    { id:'packages', label:'Buy Package', icon:CreditCard },
    { id:'voucher',  label:'Voucher',     icon:Tag },
    { id:'mpesa',    label:'M-Pesa Code', icon:Receipt },
  ];

  return (
    <>
      <Styles />

      <AnimatePresence>
        {connected && <ConnectedScreen username={username} packageName={connPkg} 
        expiration={expiry} />}
      </AnimatePresence>

      <div className="min-h-screen relative flex flex-col items-center 
      justify-center px-4 py-12 overflow-hidden"
        style={{ background:'#020617', fontFamily:"'Plus Jakarta Sans',sans-serif" }}>

        {/* Background blobs */}
        <div className="drift1 absolute -top-32 -left-24 w-[480px] h-[480px] rounded-full pointer-events-none"
          style={{ background:'radial-gradient(circle,rgba(56,189,248,.09) 0%,transparent 65%)' }} />
        <div className="drift2 absolute -bottom-20 -right-20 w-[400px] h-[400px] rounded-full pointer-events-none"
          style={{ background:'radial-gradient(circle,rgba(99,102,241,.09) 0%,transparent 65%)' }} />
        <div className="drift3 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] h-[320px] rounded-full pointer-events-none"
          style={{ background:'radial-gradient(circle,rgba(52,211,153,.05) 0%,transparent 65%)' }} />

        {/* Dot grid */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ backgroundImage:'radial-gradient(rgba(148,163,184,.07) 1px,transparent 1px)', backgroundSize:'28px 28px' }} />

        {/* Ticker */}
        <div className="absolute top-0 inset-x-0 overflow-hidden border-b"
          style={{ background:'rgba(15,23,42,.85)', borderColor:'rgba(148,163,184,.06)', backdropFilter:'blur(8px)', zIndex:10 }}>
          <div className="py-2 flex">
            <div className="ticker-inner flex whitespace-nowrap">
              {[0,1].map(k => (
                <span key={k} className="mono text-xs mr-24" style={{ color:'#334155' }}>
                  📶 {hotspotName} &nbsp;·&nbsp; Fast &amp; Secure WiFi &nbsp;·&nbsp; Buy a package, use a voucher, or enter your M-Pesa code &nbsp;·&nbsp; Support: {hotspotPhone} &nbsp;·&nbsp; Enjoy browsing! 🌐 &nbsp;·&nbsp;
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Card */}
        <motion.div
          initial={{ opacity:0, y:32 }}
          animate={{ opacity:ready?1:0, y:ready?0:32 }}
          transition={{ duration:.55, ease:[.16,1,.3,1] }}
          className="relative w-full max-w-md mt-10"
        >
          <div className="card-glass rounded-3xl border overflow-hidden"
            style={{ borderColor:'rgba(148,163,184,.1)', boxShadow:'0 0 40px rgba(56,189,248,.06)' }}>

            {/* Header */}
            <div className="px-7 pt-8 pb-6 text-center border-b"
              style={{ borderColor:'rgba(148,163,184,.07)' }}>
              <div className="relative w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <div className="absolute inset-0 rounded-2xl"
                  style={{ background:'rgba(56,189,248,.08)', border:'1px solid rgba(56,189,248,.15)' }} />
                <Wifi size={26} className="relative" style={{ color:'#38bdf8' }} />
                <div className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 rounded-full"
                  style={{ background:'radial-gradient(circle,rgba(56,189,248,.7),transparent)' }} />
              </div>
              <div className="h-8 flex items-center justify-center mb-1">
                <h1 className="text-2xl font-bold text-white">
                  {typedName}<span className="cursor-blink" style={{ color:'#38bdf8' }}>|</span>
                </h1>
              </div>
              <p className="text-sm" style={{ color:'#475569' }}>Connect to the internet</p>
              <div className="flex items-center justify-center gap-5 mt-3">
                {[{I:Shield,l:'Secure'},{I:Lock,l:'Private'},{I:Globe,l:'Fast'}].map(({I,l})=>(
                  <div key={l} className="flex items-center gap-1.5">
                    <I size={11} style={{ color:'#38bdf8' }} />
                    <span className="text-xs" style={{ color:'#475569' }}>{l}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tab bar */}
            <div className="px-5 pt-5">
              <div className="grid grid-cols-3 gap-1.5 p-1 rounded-2xl"
                style={{ background:'rgba(15,23,42,.5)', border:'1px solid rgba(148,163,184,.07)' }}>
                {TABS.map(t => {
                  const Icon = t.icon;
                  const active = tab === t.id;
                  return (
                    <button key={t.id} onClick={() => switchTab(t.id)}
                      className={`tab-pill flex flex-col items-center justify-center gap-1 py-2.5 rounded-xl text-xs font-semibold border
                        ${active ? 'border-sky-400/30 text-sky-300' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
                      style={{ background: active ? 'rgba(56,189,248,.1)' : 'transparent' }}
                    >
                      <Icon size={14} />
                      {t.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Tab content */}
            <div className="px-5 pt-5 pb-7">
              <AnimatePresence mode="wait">

                {/* ══════════════════════ PACKAGES TAB ══════════════════════ */}
                {tab === 'packages' && (
                  <motion.div key="packages"
                    initial={{ opacity:0, x:-12 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:12 }}
                    transition={{ duration:.2 }}
                  >
                    {/* LIST step */}
                    {payStep === 'list' && (
                      <div className="space-y-3">

                        {/* Info strip */}
                        <div className="flex items-start gap-3 p-3.5 rounded-2xl mb-1"
                          style={{ background:'rgba(56,189,248,.05)', border:'1px solid rgba(56,189,248,.1)' }}>
                          <CreditCard size={15} className="shrink-0 mt-0.5" style={{ color:'#38bdf8' }} />
                          <div>
                            <p className="text-sm font-semibold text-slate-200 mb-0.5">Choose a plan</p>
                            <p className="text-xs leading-relaxed" style={{ color:'#64748b' }}>
                              Select a package below and pay instantly via M-Pesa STK push.
                            </p>
                          </div>
                        </div>

                        {/* Loading skeleton */}
                        {pkgLoading && (
                          <div className="space-y-3">
                            {[1,2,3].map(i => (
                              <div key={i} className="h-20 rounded-2xl animate-pulse"
                                style={{ background:'rgba(30,41,59,.4)' }} />
                            ))}
                          </div>
                        )}

                        {/* Package cards */}
                        {!pkgLoading && packages.map((pkg, i) => (
                          <motion.div key={pkg.id}
                            initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }}
                            transition={{ delay: i * 0.07 }}>
                            <PkgCard pkg={pkg} selected={selectedPkg?.id === pkg.id}
                              onClick={() => setSelectedPkg(prev => prev?.id === pkg.id ? null : pkg)} />
                          </motion.div>
                        ))}

                        {/* CTA */}
                        <AnimatePresence>
                          {selectedPkg && (
                            <motion.button
                              initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}
                              onClick={() => setPayStep('pay')}
                              className="w-full py-4 rounded-2xl flex items-center justify-center gap-2 font-bold text-sm text-white mt-1"
                              style={{ background:`linear-gradient(135deg,${selectedPkg.accent},${selectedPkg.accent}99)` }}
                            >
                              Pay Now — Ksh {selectedPkg.price} <ArrowRight size={15} />
                            </motion.button>
                          )}
                        </AnimatePresence>
                      </div>
                    )}

                    {/* PAY step */}
                    {payStep === 'pay' && selectedPkg && (
                      <motion.div key="pay"
                        initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }}
                        transition={{ duration:.2 }}
                        className="space-y-4"
                      >
                        {/* Back + package summary */}
                        <button onClick={() => { setPayStep('list'); reset(); }}
                          className="flex items-center gap-1.5 text-xs font-semibold mb-1 transition-colors"
                          style={{ color:'#64748b' }}
                          onMouseEnter={e=>e.currentTarget.style.color='#94a3b8'}
                          onMouseLeave={e=>e.currentTarget.style.color='#64748b'}
                        >
                          <ArrowLeft size={13} /> Back to packages
                        </button>

                        {/* Selected package recap */}
                        <div className="flex items-center gap-3 p-4 rounded-2xl border"
                          style={{ background:`${selectedPkg.accent}0a`, borderColor:`${selectedPkg.accent}25` }}>
                          <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                            style={{ background:`${selectedPkg.accent}18` }}>
                            <Wifi size={18} style={{ color:selectedPkg.accent }} />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-bold text-slate-200">{selectedPkg.name}</p>
                            <div className="flex items-center gap-3 mt-0.5">
                              <span className="flex items-center gap-1 text-xs" style={{ color:'#64748b' }}>
                                <Clock size={9}/> {selectedPkg.valid}
                              </span>
                              <span className="flex items-center gap-1 text-xs" style={{ color:'#64748b' }}>
                                <Zap size={9}/> {selectedPkg.speed}
                              </span>
                            </div>
                          </div>
                          <p className="text-lg font-bold mono text-slate-100 shrink-0">
                            <span className="text-xs font-normal mr-0.5" style={{ color:'#64748b' }}>Ksh</span>
                            {selectedPkg.price}
                          </p>
                        </div>

                        {/* Phone input */}
                        <form onSubmit={handlePackagePay} className="space-y-4">
                          <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider mb-2"
                              style={{ color:'#64748b' }}>M-Pesa Phone Number</label>
                            <div className="relative">
                              <Phone size={14} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color:'#475569' }} />
                              <input
                                type="tel"
                                value={phoneNumber}
                                onChange={e => setPhoneNumber(e.target.value)}
                                placeholder="07XX XXX XXX"
                                required
                                className="input-base w-full pl-11 pr-4 py-3.5 rounded-xl text-sm mono tracking-wide"
                              />
                            </div>
                            <p className="text-xs mt-1.5" style={{ color:'#334155' }}>
                              You'll receive a push prompt on this number
                            </p>
                          </div>

                          <AnimatePresence>
                            {status && (
                              <motion.div initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:'auto' }} exit={{ opacity:0, height:0 }}>
                                <StatusBanner status={status} message={message} onDismiss={status!=='processing'?reset:undefined} />
                              </motion.div>
                            )}
                          </AnimatePresence>

                          {(!status || status === 'error' || status === 'cancelled') && (
                            <button type="submit" disabled={loading || !phoneNumber}
                              className="gradient-btn w-full py-4 rounded-2xl text-white font-bold text-sm flex items-center justify-center gap-2">
                              {loading
                                ? <><RefreshCw size={15} className="animate-spin"/> Sending STK push…</>
                                : <>Pay Ksh {selectedPkg.price} via M-Pesa <ArrowRight size={15}/></>}
                            </button>
                          )}
                        </form>

                        {/* M-Pesa notice */}
                        <div className="flex items-start gap-2.5 p-3.5 rounded-2xl"
                          style={{ background:'rgba(30,41,59,.4)', border:'1px solid rgba(148,163,184,.07)' }}>
                          <Smartphone size={14} className="shrink-0 mt-0.5" style={{ color:'#64748b' }} />
                          <p className="text-xs leading-relaxed" style={{ color:'#64748b' }}>
                            After tapping Pay, you'll get an M-Pesa prompt on your phone. Enter your PIN to complete. Internet activates automatically within seconds.
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                )}

                {/* ══════════════════════ VOUCHER TAB ═══════════════════════ */}
                {tab === 'voucher' && (
                  <motion.div key="voucher"
                    initial={{ opacity:0, x:-12 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:12 }}
                    transition={{ duration:.2 }}
                  >
                    <div className="flex items-start gap-3 p-4 rounded-2xl mb-5"
                      style={{ background:'rgba(167,139,250,.06)', border:'1px solid rgba(167,139,250,.15)' }}>
                      <Tag size={15} className="shrink-0 mt-0.5" style={{ color:'#a78bfa' }} />
                      <div>
                        <p className="text-sm font-semibold text-slate-200 mb-0.5">Have a voucher?</p>
                        <p className="text-xs leading-relaxed" style={{ color:'#64748b' }}>
                          Enter your 8-character prepaid voucher code. Codes are not case-sensitive.
                        </p>
                      </div>
                    </div>

                    <form onSubmit={handleVoucher} className="space-y-4">
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider mb-2"
                          style={{ color:'#64748b' }}>Voucher Code</label>
                        <input
                          type="text"
                          value={voucher}
                          onChange={e => setVoucher(e.target.value.toUpperCase())}
                          placeholder="e.g.  A B C 1 2 3 4 5"
                          maxLength={8}
                          required
                          className="input-base w-full text-center py-4 text-xl font-bold tracking-[0.4em] rounded-xl mono"
                        />
                        {/* Progress dots */}
                        <div className="flex gap-1.5 mt-2.5 justify-center">
                          {Array.from({length:8}).map((_,i) => (
                            <div key={i} className="h-1 flex-1 rounded-full transition-all duration-200"
                              style={{ background: voucher.length > i ? '#a78bfa' : 'rgba(148,163,184,.15)' }} />
                          ))}
                        </div>
                        <p className="text-xs text-center mt-1.5" style={{ color:'#334155' }}>
                          {voucher.length} / 8
                        </p>
                      </div>

                      <AnimatePresence>
                        {status && (
                          <motion.div initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:'auto' }} exit={{ opacity:0, height:0 }}>
                            <StatusBanner status={status} message={message} onDismiss={reset} />
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <button type="submit" disabled={loading || voucher.length < 4}
                        className="w-full py-4 rounded-2xl font-bold text-sm text-white flex items-center justify-center gap-2 transition-all"
                        style={{ background:'linear-gradient(135deg,#7c3aed,#a78bfa)', opacity: loading||voucher.length<4 ? .45 : 1, cursor: loading||voucher.length<4 ? 'not-allowed':'pointer' }}>
                        {loading
                          ? <><RefreshCw size={15} className="animate-spin"/> Connecting…</>
                          : <>Connect with Voucher <ArrowRight size={15}/></>}
                      </button>
                    </form>

                    <div className="mt-5 space-y-2">
                      <p className="text-xs font-semibold uppercase tracking-wider mb-2.5" style={{ color:'#334155' }}>
                        Where to get a voucher
                      </p>
                      {[
                        'Purchase from the WiFi operator or agent',
                        'Received via SMS after M-Pesa payment',
                        'Ask at the front desk / reception',
                      ].map(tip => (
                        <div key={tip} className="flex items-start gap-2">
                          <ChevronRight size={12} className="shrink-0 mt-0.5" style={{ color:'#a78bfa' }} />
                          <p className="text-xs" style={{ color:'#475569' }}>{tip}</p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* ══════════════════════ MPESA CODE TAB ════════════════════ */}
                {tab === 'mpesa' && (
                  <motion.div key="mpesa"
                    initial={{ opacity:0, x:12 }} animate={{ opacity:1, x:0 }}
                     exit={{ opacity:0, x:-12 }}
                    transition={{ duration:.2 }}
                  >
                    <div className="flex items-start gap-3 p-4 rounded-2xl mb-5"
                      style={{ background:'rgba(52,211,153,.05)', 
                      border:'1px solid rgba(52,211,153,.15)' }}>
                      <Smartphone size={15} className="shrink-0 mt-0.5" 
                      style={{ color:'#34d399' }} />
                      <div>
                        <p className="text-sm font-semibold text-slate-200
                         mb-0.5">Already paid via M-Pesa?</p>
                        <p className="text-xs leading-relaxed"
                         style={{ color:'#64748b' }}>
                          Enter the transaction code from your M-Pesa confirmation SMS to connect without paying again.
                        </p>
                      </div>
                    </div>

                    <form onSubmit={handleReceipt} className="space-y-4">
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider mb-2"
                          style={{ color:'#64748b' }}>M-Pesa Transaction Code</label>
                        <div className="relative">
                          <Receipt size={14} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color:'#475569' }} />
                          <input
                            type="text"
                            value={txCode}
                            onChange={e => setTxCode(e.target.value.toUpperCase())}
                            placeholder="e.g.  QHJ1234ABC"
                            required
                            className="input-base w-full pl-11 pr-4 py-3.5 rounded-xl text-sm mono tracking-widest"
                          />
                        </div>
                        {/* Format example */}
                        <div className="flex items-center gap-2 mt-2">
                          <div className="flex gap-0.5">
                            {['Q','H','J','1','2','3','4','A','B','C'].map((c,i) => (
                              <div key={i} className="w-5 h-5 rounded flex items-center justify-center mono"
                                style={{
                                  fontSize:'9px', fontWeight:'bold',
                                  background: i<3?'rgba(52,211,153,.12)': i<7?'rgba(56,189,248,.1)':'rgba(167,139,250,.12)',
                                  color:       i<3?'#34d399':           i<7?'#38bdf8':           '#a78bfa',
                                }}>
                                {c}
                              </div>
                            ))}
                          </div>
                          <span className="text-xs" 
                          style={{ color:'#334155' }}>example format</span>
                        </div>
                      </div>

                      <AnimatePresence>
                        {status && (
                          <motion.div initial={{ opacity:0, height:0 }}
                           animate={{ opacity:1, height:'auto' }}
                            exit={{ opacity:0, height:0 }}>
                            <StatusBanner status={status} message={message}
                             onDismiss={status!=='processing'?reset:undefined} />
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <button type="submit" disabled={loading || txCode.length < 6}
                        className="w-full py-4 rounded-2xl font-bold text-sm text-black flex items-center justify-center gap-2 transition-all"
                        style={{ background:'linear-gradient(135deg,#34d399,#10b981)', opacity:loading||txCode.length<6?.45:1, cursor:loading||txCode.length<6?'not-allowed':'pointer' }}>
                        {loading
                          ? <><RefreshCw size={15} className="animate-spin text-black"/> Verifying…</>
                          : <>Verify & Connect <ArrowRight size={15}/></>}
                      </button>
                    </form>

                    {/* Steps */}
                    <div className="mt-5 space-y-2.5">
                      <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color:'#334155' }}>
                        How to find your code
                      </p>
                      {[
                        'Open your M-Pesa messages',
                        'Find the payment confirmation SMS',
                        'Copy the code at the top (e.g. QHJ1234ABC)',
                      ].map((s, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <div className="w-5 h-5 rounded-full shrink-0 flex items-center justify-center text-xs font-bold mono"
                            style={{ background:'rgba(52,211,153,.12)', color:'#34d399', border:'1px solid rgba(52,211,153,.2)' }}>
                            {i+1}
                          </div>
                          <p className="text-xs" style={{ color:'#475569' }}>{s}</p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

              </AnimatePresence>
            </div>
          </div>

          {/* Status pill */}
          <motion.div initial={{ opacity:0 }} animate={{ opacity:ready?1:0 }} transition={{ delay:.4 }}
            className="flex items-center justify-between mt-3 px-5 py-3 rounded-2xl"
            style={{ background:'rgba(15,23,42,.6)', border:'1px solid rgba(148,163,184,.07)', backdropFilter:'blur(12px)' }}>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-red-400" />
              <span className="text-xs mono" style={{ color:'#334155' }}>Not connected</span>
            </div>
            {ip && <span className="text-xs mono" style={{ color:'#334155' }}>IP: {ip}</span>}
          </motion.div>

          {/* Footer */}
          <motion.div initial={{ opacity:0 }} animate={{ opacity:ready?1:0 }} transition={{ delay:.5 }}
            className="text-center mt-5 space-y-1.5">
            <p className="text-xs" style={{ color:'#334155' }}>Need help?</p>
            <a href={`tel:${hotspotPhone}`}
              className="inline-flex items-center gap-1.5 text-xs font-semibold"
              style={{ color:'#38bdf8' }}>
              <Phone size={11}/> {hotspotPhone}
            </a>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
}

