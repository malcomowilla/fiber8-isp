
import React, {
  useState, useEffect, useCallback, useRef,
} from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';
import {
  Play, Pause, Eye, ChevronRight, Wifi, TrendingUp,
  Users, Megaphone, Star, Zap, Phone, Globe, X,
  CheckCircle, RefreshCw, ToggleLeft, ToggleRight, Sparkles,
  Flame, Truck, ShieldCheck, Tag,
} from 'lucide-react';

const SUBDOMAIN = window.location.hostname.split('.')[0];
const hdr = { 'X-Subdomain': SUBDOMAIN, 'Content-Type': 'application/json' };

// ─── Default ad catalogue ─────────────────────────────────────────────────────
// Each ad is a pure-CSS animated scene. The `scenes` array describes what
// renders sequentially. The last scene is always the branding end-card.
export const SYSTEM_ADS = [
  {
    id: 'advertise_with_us',
    title: 'Advertise With Us',
    description: 'Encourages local businesses to advertise through your hotspot. Auto-brands with your ISP name, logo, and phone.',
    category: 'promotion',
    duration: 18,        // seconds
    language: 'swahili', // scenes use Swahili + English
    tag: 'Recommended',
    tagColor: '#34d399',
  },
  {
    id: 'reach_customers',
    title: 'Reach More Customers',
    description: 'Targets restaurants, shops, salons — shows the power of WiFi advertising to local business owners.',
    category: 'business',
    duration: 16,
    language: 'english',
    tag: 'Popular',
    tagColor: '#38bdf8',
  },
  {
    id: 'fast_internet',
    title: 'Fast & Reliable Internet',
    description: 'Showcases your hotspot speed and reliability. Great for retaining existing customers.',
    category: 'brand',
    duration: 14,
    language: 'english',
    tag: 'Brand',
    tagColor: '#a78bfa',
  },
  {
    id: 'gas_delivery',
    title: 'Mseewagas — Cooking Gas Delivery',
    description: 'Promotes cheap cooking gas cylinders with free doorstep delivery. Uses the Mseewagas product photo, price tag, and a clear call-to-order.',
    category: 'product',
    duration: 16,
    language: 'swahili',
    tag: 'Hot Deal',
    tagColor: '#f97316',
  },
];

// ─── Styles ───────────────────────────────────────────────────────────────────
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800;900&display=swap');
  .sysad-root { font-family:'Plus Jakarta Sans',sans-serif; }

  /* animated ad scenes */
  @keyframes sysad-fade-up   { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
  @keyframes sysad-fade-in   { from{opacity:0} to{opacity:1} }
  @keyframes sysad-scale-in  { from{opacity:0;transform:scale(.85)} to{opacity:1;transform:scale(1)} }
  @keyframes sysad-slide-r   { from{opacity:0;transform:translateX(-32px)} to{opacity:1;transform:translateX(0)} }
  @keyframes sysad-slide-l   { from{opacity:0;transform:translateX(32px)} to{opacity:1;transform:translateX(0)} }
  @keyframes sysad-pulse-ring { 0%{transform:scale(1);opacity:.7} 100%{transform:scale(2.2);opacity:0} }
  @keyframes sysad-ticker     { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
  @keyframes sysad-count      { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
  @keyframes sysad-shimmer    { 0%{background-position:-400px 0} 100%{background-position:400px 0} }
  @keyframes sysad-gradient   { 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }
  @keyframes sysad-bob        { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
  @keyframes sysad-spin-slow  { to{transform:rotate(360deg)} }
  @keyframes sysad-flicker    { 0%,100%{opacity:1;transform:scale(1)} 45%{opacity:.85;transform:scale(.96)} 55%{opacity:1;transform:scale(1.04)} }
  @keyframes sysad-drive-in   { from{opacity:0;transform:translateX(-60px) scale(.9)} to{opacity:1;transform:translateX(0) scale(1)} }
  @keyframes sysad-price-pop  { 0%{transform:scale(0) rotate(-8deg);opacity:0} 70%{transform:scale(1.12) rotate(-8deg);opacity:1} 100%{transform:scale(1) rotate(-8deg);opacity:1} }

  .sysad-fade-up   { animation: sysad-fade-up  .55s cubic-bezier(.16,1,.3,1) both; }
  .sysad-fade-in   { animation: sysad-fade-in  .4s ease both; }
  .sysad-scale-in  { animation: sysad-scale-in .5s cubic-bezier(.34,1.56,.64,1) both; }
  .sysad-slide-r   { animation: sysad-slide-r  .5s cubic-bezier(.16,1,.3,1) both; }
  .sysad-slide-l   { animation: sysad-slide-l  .5s cubic-bezier(.16,1,.3,1) both; }
  .sysad-bob       { animation: sysad-bob      2.5s ease-in-out infinite; }
  .sysad-spin      { animation: sysad-spin-slow 6s linear infinite; }
  .sysad-flicker   { animation: sysad-flicker  1.8s ease-in-out infinite; }
  .sysad-drive-in  { animation: sysad-drive-in .6s cubic-bezier(.16,1,.3,1) both; }
  .sysad-price-pop { animation: sysad-price-pop .55s cubic-bezier(.34,1.56,.64,1) both; }

  .sysad-gradient-btn {
    background: linear-gradient(135deg,#38bdf8,#a78bfa,#34d399);
    background-size: 200% 200%;
    animation: sysad-gradient 3s ease infinite;
  }

  /* Admin panel cards */
  .sysad-card {
    background: white;
    border: 1px solid #e2e8f0;
    border-radius: 16px;
    transition: box-shadow .2s, transform .15s;
  }
  .dark .sysad-card { background: #1e293b; border-color: #334155; }
  .sysad-card:hover { box-shadow: 0 8px 24px rgba(0,0,0,.08); transform: translateY(-1px); }
  .dark .sysad-card:hover { box-shadow: 0 8px 24px rgba(0,0,0,.3); }

  .sysad-tag { font-size:10px; font-weight:800; letter-spacing:.06em; text-transform:uppercase; padding:2px 8px; border-radius:999px; }
  .sysad-preview-wrap { border-radius:12px; overflow:hidden; background:#020617; }

  /* Ticker inside ads */
  .sysad-ticker { white-space:nowrap; animation: sysad-ticker 16s linear infinite; }

  /* Progress bar for the player */
  .sysad-progress { height:3px; background:rgba(255,255,255,.2); border-radius:3px; overflow:hidden; }
  .sysad-progress-fill { height:100%; border-radius:3px; transition:width .25s linear; }
`;

// ─── Ad Scene Renderers ───────────────────────────────────────────────────────
// Each scene is a pure React component with auto-timed visibility.
// They all receive `brand` = { company_name, phone, logo_url, primary, secondary }

function SceneTicker({ items, color = '#38bdf8' }) {
  const doubled = [...items, ...items];
  return (
    <div style={{ overflow: 'hidden', background: 'rgba(0,0,0,.35)', padding: '7px 0', borderBottom: '1px solid rgba(255,255,255,.07)' }}>
      <div className="sysad-ticker" style={{ display: 'inline-flex', gap: 40 }}>
        {doubled.map((item, i) => (
          <span key={i} style={{ fontSize: 11, fontWeight: 700, color, display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <span style={{ opacity: .5 }}>•</span> {item}
          </span>
        ))}
      </div>
    </div>
  );
}

function BrandEndCard({ brand, accentColor }) {
  const primary = accentColor || brand?.primary || '#38bdf8';
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '28px 24px', background: `linear-gradient(160deg,#030712,${primary}22)`, position: 'relative', overflow: 'hidden' }}>
      {/* ambient ring */}
      <div style={{ position: 'absolute', width: 220, height: 220, borderRadius: '50%', border: `1px solid ${primary}22`, top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }} />
      <div style={{ position: 'absolute', width: 320, height: 320, borderRadius: '50%', border: `1px solid ${primary}12`, top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }} />

      {/* Logo or initials */}
      <div className="sysad-scale-in" style={{ animationDelay: '.1s', marginBottom: 16 }}>
        {brand?.logo_url
          ? <img src={brand.logo_url} alt="logo" style={{ width: 72, height: 72, objectFit: 'contain', borderRadius: 18, border: `2px solid ${primary}44`, background: 'rgba(255,255,255,.06)', padding: 6 }} />
          : (
            <div style={{ width: 72, height: 72, borderRadius: 18, background: `linear-gradient(135deg,${primary},${primary}88)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, fontWeight: 900, color: '#fff' }}>
              {(brand?.company_name || 'ISP')[0]}
            </div>
          )
        }
      </div>

      <p className="sysad-fade-up" style={{ animationDelay: '.25s', fontSize: 22, fontWeight: 900, color: '#fff', textAlign: 'center', marginBottom: 6, letterSpacing: '-.02em' }}>
        {brand?.company_name || 'Your ISP Name'}
      </p>
      <p className="sysad-fade-up" style={{ animationDelay: '.35s', fontSize: 13, color: `${primary}`, fontWeight: 700, marginBottom: 20 }}>
        WiFi Advertising Platform
      </p>

      {brand?.phone && (
        <div className="sysad-fade-up" style={{ animationDelay: '.45s', display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', borderRadius: 999, background: `${primary}18`, border: `1px solid ${primary}30` }}>
          <Phone size={13} style={{ color: primary }} />
          <span style={{ fontSize: 14, fontWeight: 800, color: '#fff' }}>{brand.phone}</span>
        </div>
      )}

      <p className="sysad-fade-up" style={{ animationDelay: '.55s', fontSize: 11, color: 'rgba(255,255,255,.35)', marginTop: 20, textAlign: 'center' }}>
        Powered by {brand?.company_name || 'your ISP'} · WiFi Marketing
      </p>
    </div>
  );
}

// ── Ad 1: Advertise With Us (Swahili + English) ───────────────────────────────
function AdvertiseWithUsAd({ brand, scene, progress }) {
  const primary = brand?.primary || '#facc15';

  const scenes = [
    // Scene 0 — hook (0–4s)
    <div key="s0" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 28, background: 'linear-gradient(160deg,#030712,#1a0f00)' }}>
      <SceneTicker items={['Tangaza biashara yako', 'Reach thousands daily', 'WiFi Marketing', 'Advertise here']} color={primary} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
        <div className="sysad-bob" style={{ position: 'relative' }}>
          <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: `2px solid ${primary}50`, animation: 'sysad-pulse-ring 2s ease-out infinite' }} />
          <div style={{ width: 72, height: 72, borderRadius: '50%', background: `${primary}22`, border: `2px solid ${primary}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Megaphone size={32} style={{ color: primary }} />
          </div>
        </div>
        <p className="sysad-fade-up" style={{ fontSize: 26, fontWeight: 900, color: '#fff', textAlign: 'center', lineHeight: 1.2, letterSpacing: '-.02em' }}>
          Je, una biashara?
        </p>
        <p className="sysad-fade-up" style={{ animationDelay: '.2s', fontSize: 15, color: 'rgba(255,255,255,.6)', textAlign: 'center' }}>
          Do you own a business?
        </p>
        <div className="sysad-scale-in" style={{ animationDelay: '.4s', padding: '8px 20px', borderRadius: 999, background: `${primary}22`, border: `1px solid ${primary}44` }}>
          <p style={{ fontSize: 13, fontWeight: 700, color: primary }}>Tangaza kwenye WiFi hii 📶</p>
        </div>
      </div>
    </div>,

    // Scene 1 — stats (4–9s)
    <div key="s1" style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '20px 24px', background: 'linear-gradient(160deg,#030712,#001a0f)', gap: 14 }}>
      <p className="sysad-slide-r" style={{ fontSize: 17, fontWeight: 800, color: '#fff', marginBottom: 4 }}>
        Wafikie wateja wako 🎯
      </p>
      <p className="sysad-slide-r" style={{ animationDelay: '.1s', fontSize: 12, color: 'rgba(255,255,255,.5)', marginBottom: 6 }}>
        Reach your customers through this hotspot
      </p>
      {[
        { icon: Users,     num: '1,000+', label: 'Wateja kila siku / Users daily',    color: '#34d399' },
        { icon: Eye,       num: '100%',   label: 'Wanaona tangazo lako / Ad visibility', color: '#38bdf8' },
        { icon: TrendingUp,num: '3×',     label: 'Zaidi ya matangazo ya kawaida / vs print', color: '#a78bfa' },
      ].map((s, i) => (
        <div key={i} className="sysad-slide-r" style={{ animationDelay: `${.2 + i * .15}s`, display: 'flex', alignItems: 'center', gap: 14, padding: '12px 16px', borderRadius: 14, background: `${s.color}0f`, border: `1px solid ${s.color}25` }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: `${s.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <s.icon size={18} style={{ color: s.color }} />
          </div>
          <div>
            <p style={{ fontSize: 20, fontWeight: 900, color: s.color, lineHeight: 1 }}>{s.num}</p>
            <p style={{ fontSize: 11, color: 'rgba(255,255,255,.5)', marginTop: 2 }}>{s.label}</p>
          </div>
        </div>
      ))}
    </div>,

    // Scene 2 — business types (9–14s)
    <div key="s2" style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '20px 24px', background: 'linear-gradient(160deg,#030712,#0a0018)', gap: 10 }}>
      <p className="sysad-fade-up" style={{ fontSize: 16, fontWeight: 800, color: '#fff', marginBottom: 4 }}>
        Inafaa kwa biashara yoyote 🏪
      </p>
      <p className="sysad-fade-up" style={{ animationDelay: '.1s', fontSize: 12, color: 'rgba(255,255,255,.4)', marginBottom: 6 }}>
        Works for any type of business
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        {[
          { emoji: '🍽️', sw: 'Mkahawa', en: 'Restaurant' },
          { emoji: '💇', sw: 'Salon',   en: 'Salon / Barber' },
          { emoji: '🏥', sw: 'Duka la dawa', en: 'Pharmacy' },
          { emoji: '🛒', sw: 'Duka',    en: 'Shop / Store' },
          { emoji: '🏫', sw: 'Shule',   en: 'School' },
          { emoji: '🎉', sw: 'Tukio',   en: 'Event / Club' },
        ].map((b, i) => (
          <div key={i} className="sysad-scale-in" style={{ animationDelay: `${.15 + i * .1}s`, padding: '10px 12px', borderRadius: 12, background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.08)', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 20 }}>{b.emoji}</span>
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, color: '#fff' }}>{b.sw}</p>
              <p style={{ fontSize: 10, color: 'rgba(255,255,255,.4)' }}>{b.en}</p>
            </div>
          </div>
        ))}
      </div>
    </div>,

    // Scene 3 — CTA + end branding (14–18s)
    <div key="s3" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '18px 24px', background: 'linear-gradient(160deg,#030712,#0d0d0d)' }}>
        <p className="sysad-fade-up" style={{ fontSize: 15, fontWeight: 800, color: '#fff', marginBottom: 4 }}>
          Wasiliana nasi leo 📞
        </p>
        <p className="sysad-fade-up" style={{ animationDelay: '.15s', fontSize: 12, color: 'rgba(255,255,255,.5)', marginBottom: 16 }}>
          Contact us today to advertise through this WiFi
        </p>
        <div className="sysad-scale-in" style={{ animationDelay: '.3s', display: 'flex', alignItems: 'center', gap: 12, padding: '14px 18px', borderRadius: 14, background: `${primary}15`, border: `2px solid ${primary}40` }}>
          {brand?.logo_url
            ? <img src={brand.logo_url} alt="" style={{ width: 36, height: 36, borderRadius: 10, objectFit: 'contain' }} />
            : <div style={{ width: 36, height: 36, borderRadius: 10, background: `${primary}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 900, color: primary }}>{(brand?.company_name || 'I')[0]}</div>
          }
          <div>
            <p style={{ fontSize: 14, fontWeight: 900, color: '#fff' }}>{brand?.company_name || 'Your ISP'}</p>
            {brand?.phone && <p style={{ fontSize: 13, color: primary, fontWeight: 700 }}>{brand.phone}</p>}
          </div>
        </div>
      </div>
    </div>,
  ];

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', background: '#030712', position: 'relative', overflow: 'hidden' }}>
      <AnimatePresence mode="wait">
        <motion.div key={scene} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: .35 }}
          style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {scenes[scene] || scenes[0]}
        </motion.div>
      </AnimatePresence>
      {/* progress bar */}
      <div className="sysad-progress" style={{ margin: '0 0 0 0' }}>
        <div className="sysad-progress-fill sysad-gradient-btn" style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}

// ── Ad 2: Reach More Customers ────────────────────────────────────────────────
function ReachCustomersAd({ brand, scene, progress }) {
  const primary = brand?.primary || '#38bdf8';

  const scenes = [
    <div key="s0" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 28, background: 'linear-gradient(160deg,#020617,#001830)' }}>
      <Wifi size={52} className="sysad-bob" style={{ color: primary, marginBottom: 20 }} />
      <p className="sysad-fade-up" style={{ fontSize: 28, fontWeight: 900, color: '#fff', textAlign: 'center', lineHeight: 1.15, letterSpacing: '-.02em' }}>
        Your Ad.<br />
        <span style={{ color: primary }}>Thousands of Eyes.</span>
      </p>
      <p className="sysad-fade-up" style={{ animationDelay: '.3s', fontSize: 13, color: 'rgba(255,255,255,.5)', marginTop: 12, textAlign: 'center' }}>
        Every person who connects to this WiFi sees your business first.
      </p>
    </div>,

    <div key="s1" style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '20px 24px', background: 'linear-gradient(160deg,#020617,#001020)', justifyContent: 'center', gap: 16 }}>
      <p className="sysad-slide-r" style={{ fontSize: 18, fontWeight: 800, color: '#fff', marginBottom: 8 }}>
        Why advertise on WiFi? 🤔
      </p>
      {[
        { point: 'Customers are already online and ready to engage', icon: '✅' },
        { point: 'Your ad shows every single time someone connects', icon: '📱' },
        { point: 'Cheaper than Facebook, Google, or print ads', icon: '💰' },
        { point: 'Track impressions and clicks in real time', icon: '📊' },
      ].map((p, i) => (
        <div key={i} className="sysad-slide-r" style={{ animationDelay: `${i * .12}s`, display: 'flex', gap: 12, alignItems: 'flex-start' }}>
          <span style={{ fontSize: 18, flexShrink: 0 }}>{p.icon}</span>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,.75)', lineHeight: 1.5 }}>{p.point}</p>
        </div>
      ))}
    </div>,

    <div key="s2" style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '20px 24px', background: 'linear-gradient(160deg,#020617,#000e1a)', justifyContent: 'center', gap: 14 }}>
      <p className="sysad-fade-up" style={{ fontSize: 18, fontWeight: 800, color: '#fff', marginBottom: 6 }}>
        Contact us to get started 🚀
      </p>
      <BrandEndCard brand={brand} accentColor={primary} />
    </div>,
  ];

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', background: '#020617' }}>
      <AnimatePresence mode="wait">
        <motion.div key={scene} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: .3 }}
          style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {scenes[Math.min(scene, scenes.length - 1)]}
        </motion.div>
      </AnimatePresence>
      <div className="sysad-progress">
        <div className="sysad-progress-fill" style={{ width: `${progress}%`, background: primary }} />
      </div>
    </div>
  );
}

// ── Ad 3: Fast & Reliable Internet ────────────────────────────────────────────
function FastInternetAd({ brand, scene, progress }) {
  const primary = brand?.primary || '#a78bfa';

  const scenes = [
    <div key="s0" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 28, background: 'linear-gradient(160deg,#020617,#0d0120)' }}>
      <div className="sysad-spin" style={{ width: 80, height: 80, borderRadius: '50%', border: `3px solid ${primary}`, borderTopColor: 'transparent', marginBottom: 24 }} />
      <p className="sysad-scale-in" style={{ fontSize: 30, fontWeight: 900, color: '#fff', textAlign: 'center', lineHeight: 1.15, letterSpacing: '-.02em' }}>
        Lightning Fast.<br /><span style={{ color: primary }}>Always On.</span>
      </p>
      <p className="sysad-fade-up" style={{ animationDelay: '.3s', fontSize: 13, color: 'rgba(255,255,255,.5)', marginTop: 14, textAlign: 'center' }}>
        {brand?.company_name || 'Your ISP'} — The internet that keeps up with you.
      </p>
    </div>,

    <div key="s1" style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '24px', background: 'linear-gradient(160deg,#020617,#0a0018)', justifyContent: 'center', gap: 16 }}>
      {[
        { label: 'Speed', value: '50 Mbps+', desc: 'Stream, game, and browse seamlessly', color: '#34d399' },
        { label: 'Uptime', value: '99.9%', desc: 'Always connected when you need it', color: '#38bdf8' },
        { label: 'Latency', value: '<10ms', desc: 'Near-instant response time', color: '#fbbf24' },
      ].map((m, i) => (
        <div key={i} className="sysad-scale-in" style={{ animationDelay: `${i * .15}s`, padding: '16px 18px', borderRadius: 16, background: `${m.color}0c`, border: `1px solid ${m.color}25`, display: 'flex', alignItems: 'center', gap: 16 }}>
          <p style={{ fontSize: 26, fontWeight: 900, color: m.color, minWidth: 80 }}>{m.value}</p>
          <div>
            <p style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>{m.label}</p>
            <p style={{ fontSize: 11, color: 'rgba(255,255,255,.4)', marginTop: 2 }}>{m.desc}</p>
          </div>
        </div>
      ))}
    </div>,

    <div key="s2" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <BrandEndCard brand={brand} accentColor={primary} />
    </div>,
  ];

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', background: '#020617' }}>
      <AnimatePresence mode="wait">
        <motion.div key={scene} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: .3 }}
          style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {scenes[Math.min(scene, scenes.length - 1)]}
        </motion.div>
      </AnimatePresence>
      <div className="sysad-progress">
        <div className="sysad-progress-fill" style={{ width: `${progress}%`, background: `linear-gradient(90deg,${primary},#38bdf8)` }} />
      </div>
    </div>
  );
}

// ── Ad 4: Mseewagas — Cooking Gas Cylinder Delivery ───────────────────────────
// This ad promotes a specific product/business (cooking gas cylinders) rather
// than the ISP's own brand, so it uses its own warm flame palette — orange,
// red and amber — instead of the blue/purple/green used by the other ads,
// and leans on the real product photo shipped at /public/images/mseewagas.png.
const GAS_IMAGE_SRC = '/images/mseewagas.jpeg';

function GasCylinderAd({ brand, scene, progress }) {
  // Deliberately its own palette — this is a product ad, not an ISP-brand ad.
  const flame = '#f97316';   // orange-500
  const ember = '#dc2626';   // red-600
  const gold  = '#facc15';   // amber-400
  const phone = brand?.phone || '0700 000 000';

  const scenes = [
    // Scene 0 — hook (0–4s): flame + headline
    <div key="s0" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 28, background: `linear-gradient(160deg,#1a0800,${ember}22)`, position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', width: 260, height: 260, borderRadius: '50%', background: `${flame}18`, filter: 'blur(10px)', top: '-10%', right: '-15%' }} />
      <div className="sysad-flicker" style={{ position: 'relative', marginBottom: 18 }}>
        <div style={{ width: 76, height: 76, borderRadius: '50%', background: `radial-gradient(circle,${gold},${flame} 60%,${ember})`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 28px ${flame}88` }}>
          <Flame size={36} style={{ color: '#fff' }} />
        </div>
      </div>
      <p className="sysad-fade-up" style={{ fontSize: 27, fontWeight: 900, color: '#fff', textAlign: 'center', lineHeight: 1.2, letterSpacing: '-.02em' }}>
        Gesi Ikiisha, <span style={{ color: gold }}>Piga Simu!</span>
      </p>
      <p className="sysad-fade-up" style={{ animationDelay: '.2s', fontSize: 14, color: 'rgba(255,255,255,.65)', marginTop: 8, textAlign: 'center' }}>
        Out of gas? We deliver a full cylinder to your door.
      </p>
      <div className="sysad-scale-in" style={{ animationDelay: '.4s', marginTop: 16, padding: '8px 20px', borderRadius: 999, background: `${flame}25`, border: `1px solid ${flame}55` }}>
        <p style={{ fontSize: 13, fontWeight: 800, color: gold }}>MSEEWAGAS 🔥 Gesi ya Kupikia</p>
      </div>
    </div>,

    // Scene 1 — convincing feature list (4–9s): cheap, free delivery, safe/quality
    <div key="s1" style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '20px 24px', background: `linear-gradient(160deg,#1a0800,#170300)`, gap: 14, justifyContent: 'center' }}>
      <p className="sysad-slide-r" style={{ fontSize: 18, fontWeight: 800, color: '#fff', marginBottom: 2 }}>
        Kwa nini Mseewagas? 🤔
      </p>
      {[
        { icon: Tag,         sw: 'Bei nafuu kuliko wote',      en: 'Cheapest cylinder refills in town',   color: gold },
        { icon: Truck,       sw: 'Delivery ya bure!',           en: 'Free delivery straight to your door', color: flame },
        { icon: ShieldCheck, sw: 'Gesi safi, mizani sahihi',    en: 'Full weight, sealed & certified',     color: ember },
      ].map((f, i) => (
        <div key={i} className="sysad-slide-r" style={{ animationDelay: `${.15 + i * .15}s`, display: 'flex', alignItems: 'center', gap: 14, padding: '12px 16px', borderRadius: 14, background: `${f.color}14`, border: `1px solid ${f.color}40` }}>
          <div style={{ width: 42, height: 42, borderRadius: 12, background: `${f.color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <f.icon size={20} style={{ color: f.color }} />
          </div>
          <div>
            <p style={{ fontSize: 14, fontWeight: 800, color: '#fff', lineHeight: 1.2 }}>{f.sw}</p>
            <p style={{ fontSize: 11, color: 'rgba(255,255,255,.5)', marginTop: 2 }}>{f.en}</p>
          </div>
        </div>
      ))}
    </div>,

    // Scene 2 — product photo + price tag (9–13s)
    <div key="s2" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '22px 20px', background: `linear-gradient(160deg,#170300,#000)`, position: 'relative' }}>
      <p className="sysad-fade-up" style={{ fontSize: 15, fontWeight: 800, color: '#fff', marginBottom: 14, textAlign: 'center' }}>
        Agiza sasa, ipate leo 🛵
      </p>
      <div className="sysad-drive-in" style={{ position: 'relative', width: '100%', maxWidth: 220, borderRadius: 18, overflow: 'hidden', background: 'rgba(255,255,255,.04)', border: `1px solid ${flame}40`, boxShadow: `0 10px 30px ${ember}33` }}>
        <img
          src={GAS_IMAGE_SRC}
          alt="Mseewagas cooking gas cylinder"
          style={{ width: '100%', height: 160, objectFit: 'cover', display: 'block' }}
          onError={(e) => { e.currentTarget.style.display = 'none'; }}
        />
        <div className="sysad-price-pop" style={{ position: 'absolute', top: -10, right: -10, background: gold, color: '#1a0800', fontWeight: 900, fontSize: 13, padding: '8px 12px', borderRadius: '50%', width: 64, height: 64, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', lineHeight: 1.05, boxShadow: `0 6px 16px ${ember}55`, transform: 'rotate(-8deg)' }}>
          <span style={{ fontSize: 9, fontWeight: 800 }}>KUANZIA</span>
          <span style={{ fontSize: 14 }}>1,200</span>
          <span style={{ fontSize: 8, fontWeight: 700 }}>KES</span>
        </div>
      </div>
      <p className="sysad-fade-up" style={{ animationDelay: '.35s', fontSize: 11, color: 'rgba(255,255,255,.45)', marginTop: 14, textAlign: 'center' }}>
        6kg · 13kg · 22kg cylinders available
      </p>
    </div>,

    // Scene 3 — CTA / call-to-order card (13–16s)
    <div key="s3" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '26px 24px', background: `linear-gradient(160deg,#000,${flame}18)`, position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', width: 240, height: 240, borderRadius: '50%', border: `1px solid ${flame}20`, top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }} />
      <div className="sysad-scale-in" style={{ marginBottom: 14 }}>
        <div style={{ width: 64, height: 64, borderRadius: 18, background: `linear-gradient(135deg,${flame},${ember})`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Flame size={28} style={{ color: '#fff' }} />
        </div>
      </div>
      <p className="sysad-fade-up" style={{ animationDelay: '.15s', fontSize: 20, fontWeight: 900, color: '#fff', textAlign: 'center', letterSpacing: '-.02em' }}>
        Mseewagas
      </p>
      <p className="sysad-fade-up" style={{ animationDelay: '.25s', fontSize: 12, color: gold, fontWeight: 700, marginBottom: 18 }}>
        Bei nafuu · Delivery ya bure · Haraka
      </p>
      <div className="sysad-fade-up" style={{ animationDelay: '.4s', display: 'flex', alignItems: 'center', gap: 8, padding: '11px 22px', borderRadius: 999, background: `${flame}25`, border: `1px solid ${flame}55` }}>
        <Phone size={14} style={{ color: gold }} />
        <span style={{ fontSize: 15, fontWeight: 800, color: '#fff' }}>Piga {phone}</span>
      </div>
      <p className="sysad-fade-up" style={{ animationDelay: '.5s', fontSize: 10, color: 'rgba(255,255,255,.35)', marginTop: 16, textAlign: 'center' }}>
        Sponsored · Order your next refill today
      </p>
    </div>,
  ];

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', background: '#170300', position: 'relative', overflow: 'hidden' }}>
      <AnimatePresence mode="wait">
        <motion.div key={scene} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: .35 }}
          style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {scenes[Math.min(scene, scenes.length - 1)]}
        </motion.div>
      </AnimatePresence>
      <div className="sysad-progress">
        <div className="sysad-progress-fill" style={{ width: `${progress}%`, background: `linear-gradient(90deg,${gold},${flame},${ember})` }} />
      </div>
    </div>
  );
}

// ─── Scene timing maps ────────────────────────────────────────────────────────
const SCENE_MAPS = {
  advertise_with_us: [ 0, 4, 9, 14 ],   // scene changes at these seconds
  reach_customers:   [ 0, 6, 11 ],
  fast_internet:     [ 0, 5, 10 ],
  gas_delivery:      [ 0, 4, 9, 13 ],
};

const AD_RENDERERS = {
  advertise_with_us: AdvertiseWithUsAd,
  reach_customers:   ReachCustomersAd,
  fast_internet:     FastInternetAd,
  gas_delivery:      GasCylinderAd,
};

// ─── HotspotDefaultAdPlayer ───────────────────────────────────────────────────
/**
 * Drop this anywhere on the hotspot page.
 * Props:
 *   adId      — one of the SYSTEM_ADS ids. Defaults to 'advertise_with_us'.
 *   brand     — { company_name, phone, logo_url, primary, secondary }
 *               Fetched automatically if omitted.
 *   onComplete — called when the ad finishes
 *   onDismiss  — called if the user taps ✕ (shown after 5s)
 */
export function HotspotDefaultAdPlayer({ adId = 'advertise_with_us', brand: brandProp, onComplete, onDismiss }) {
  const [brand, setBrand]       = useState(brandProp || null);
  const [elapsed, setElapsed]   = useState(0);
  const [dismissed, setDismissed] = useState(false);
  const [canSkip, setCanSkip]   = useState(false);
  const ad = SYSTEM_ADS.find(a => a.id === adId) || SYSTEM_ADS[0];
  const duration = ad.duration;
  const sceneMap = SCENE_MAPS[adId] || [0];

  // derive current scene from elapsed time
  const scene = sceneMap.reduce((acc, start, i) => elapsed >= start ? i : acc, 0);
  const progress = Math.min(100, (elapsed / duration) * 100);

  const Renderer = AD_RENDERERS[adId] || AdvertiseWithUsAd;

  // fetch brand if not provided
  useEffect(() => {
    if (brandProp) return;
    fetch('/api/allow_get_company_settings', { headers: { 'X-Subdomain': SUBDOMAIN } })
      .then(r => r.ok ? r.json() : null)
      .then(d => {
        if (d) setBrand({
          company_name: d.company_name,
          phone:        d.contact_info || d.customer_support_phone_number,
          logo_url:     d.logo_url || d.logo_preview,
          primary:      d.primary_color || '#38bdf8',
          secondary:    d.secondary_color || '#a78bfa',
        });
      })
      .catch(() => {});
  }, [brandProp]);

  // tick every second
  useEffect(() => {
    if (dismissed) return;
    const iv = setInterval(() => {
      setElapsed(e => {
        const next = e + 1;
        if (next >= 5) setCanSkip(true);
        if (next >= duration) {
          clearInterval(iv);
          onComplete?.();
        }
        return Math.min(next, duration);
      });
    }, 1000);
    return () => clearInterval(iv);
  }, [dismissed, duration, onComplete]);

  if (dismissed) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 99999, background: '#020617', display: 'flex', flexDirection: 'column', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      {/* top bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 16px', background: 'rgba(0,0,0,.4)', backdropFilter: 'blur(8px)', borderBottom: '1px solid rgba(255,255,255,.07)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Sparkles size={13} style={{ color: '#fbbf24' }} />
          <span style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,.5)', textTransform: 'uppercase', letterSpacing: '.08em' }}>
            Sponsored · {brand?.company_name || 'Your ISP'}
          </span>
        </div>
        {canSkip && (
          <button onClick={() => { setDismissed(true); onDismiss?.(); }}
            style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 10px', borderRadius: 8, border: '1px solid rgba(255,255,255,.15)', background: 'rgba(255,255,255,.07)', color: 'rgba(255,255,255,.7)', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
            Skip <X size={12} />
          </button>
        )}
        {!canSkip && (
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,.35)', padding: '5px 10px' }}>
            Skip in {5 - elapsed}s
          </span>
        )}
      </div>

      {/* ad content */}
      <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <Renderer brand={brand} scene={scene} progress={progress} />
      </div>

      {/* bottom info */}
      <div style={{ padding: '10px 16px', background: 'rgba(0,0,0,.5)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,.07)' }}>
        <p style={{ fontSize: 11, color: 'rgba(255,255,255,.3)' }}>
          Ad ends in {Math.max(0, duration - elapsed)}s
        </p>
        {brand?.phone && (
          <a href={`tel:${brand.phone}`}
            style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, fontWeight: 700, color: brand.primary || '#38bdf8', textDecoration: 'none' }}>
            <Phone size={11} /> {brand.phone}
          </a>
        )}
      </div>
    </div>
  );
}

// ─── DefaultSystemAdsManager — Admin Panel ────────────────────────────────────
/**
 * Renders inside your admin dashboard.
 * Shows all system ads, lets admin preview, enable/pause, and see which is active.
 */
export function DefaultSystemAdsManager() {
  const [enabled, setEnabled]       = useState({}); // { [adId]: bool }
  const [activeAd, setActiveAd]     = useState(null);
  const [previewAd, setPreviewAd]   = useState(null);
  const [brand, setBrand]           = useState(null);
  const [saving, setSaving]         = useState({});
  const [loading, setLoading]       = useState(true);

  // fetch current enabled states
  const fetchStates = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/default_system_ads', { headers: hdr });
      if (res.ok) {
        const d = await res.json();
        const map = {};
        d.forEach(r => { map[r.ad_id] = r.enabled; });
        setEnabled(map);
        const active = d.find(r => r.enabled);
        setActiveAd(active?.ad_id || null);
      }
    } catch (_) {}
    setLoading(false);
  }, []);

  // fetch brand for preview
  useEffect(() => {
    fetchStates();
    fetch('/api/allow_get_company_settings', { headers: hdr })
      .then(r => r.ok ? r.json() : null)
      .then(d => {
        if (d) setBrand({
          company_name: d.company_name,
          phone:        d.contact_info || d.customer_support_phone_number,
          logo_url:     d.logo_url || d.logo_preview,
          primary:      '#38bdf8',
          secondary:    '#a78bfa',
        });
      })
      .catch(() => {});
  }, [fetchStates]);

  const toggle = async (adId) => {
    const nowEnabled = !enabled[adId];
    setSaving(s => ({ ...s, [adId]: true }));
    try {
      const res = await fetch(`/api/default_system_ads/${adId}/toggle`, {
        method: 'POST',
        headers: hdr,
        body: JSON.stringify({ enabled: nowEnabled }),
      });
      if (res.ok) {
        // only one active at a time — if enabling, disable others
        const newEnabled = {};
        SYSTEM_ADS.forEach(a => { newEnabled[a.id] = false; });
        if (nowEnabled) newEnabled[adId] = true;
        else newEnabled[adId] = false;
        setEnabled(newEnabled);
        setActiveAd(nowEnabled ? adId : null);
        toast.success(nowEnabled ? 'Default ad enabled — it will show on your hotspot.' : 'Default ad paused.');
      } else {
        toast.error('Failed to update ad status');
      }
    } catch (_) {
      toast.error('Network error');
    } finally {
      setSaving(s => ({ ...s, [adId]: false }));
    }
  };

  return (
    <>
      <style>{CSS}</style>
      <Toaster position="top-right" />

      <div className="sysad-root min-h-screen bg-white dark:bg-slate-950 font-sans">
        <div className="max-w-5xl mx-auto px-4 py-10">

          {/* Header */}
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-sky-50 dark:bg-sky-400/10 border border-sky-200 dark:border-sky-400/20 mb-4">
              <Sparkles size={13} className="text-sky-500 dark:text-sky-400" />
              <span className="text-xs font-semibold text-sky-600 dark:text-sky-400">System Default Ads</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Default Ad Library</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
              Ready-made ads that automatically brand with your company name, logo, and phone number.
              Enable one to show it on your hotspot — or build your own in Ad Settings.
            </p>
          </div>

          {/* Active status banner */}
          <div className={`mb-6 p-4 rounded-2xl border flex items-center gap-3 ${activeAd ? 'bg-emerald-50 dark:bg-emerald-400/10 border-emerald-200 dark:border-emerald-400/25' : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700'}`}>
            <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${activeAd ? 'bg-emerald-500' : 'bg-slate-400'}`} />
            <div>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                {activeAd ? `Active: "${SYSTEM_ADS.find(a => a.id === activeAd)?.title}"` : 'No default ad active'}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {activeAd ? 'This ad is currently showing on your hotspot portal when no custom ad is running.' : 'Enable one of the ads below to show it on your hotspot.'}
              </p>
            </div>
          </div>

          {/* Ad cards */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {[1,2,3,4].map(i => <div key={i} className="h-72 rounded-2xl bg-slate-100 dark:bg-slate-800 animate-pulse" />)}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {SYSTEM_ADS.map(ad => {
                const isEnabled = !!enabled[ad.id];
                const isSaving  = !!saving[ad.id];
                return (
                  <div key={ad.id} className="sysad-card overflow-hidden">
                    {/* Preview area */}
                    <div className="sysad-preview-wrap h-48 relative cursor-pointer" onClick={() => setPreviewAd(ad.id)}>
                      <AdMiniPreview adId={ad.id} brand={brand} />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 hover:opacity-100 transition-opacity">
                        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 dark:bg-slate-900/90 text-slate-800 dark:text-slate-100 text-sm font-semibold">
                          <Play size={14} /> Preview
                        </div>
                      </div>
                      {/* Tag */}
                      <div className="absolute top-3 left-3">
                        <span className="sysad-tag" style={{ background: `${ad.tagColor}22`, color: ad.tagColor, border: `1px solid ${ad.tagColor}44` }}>
                          {ad.tag}
                        </span>
                      </div>
                      {/* Active indicator */}
                      {isEnabled && (
                        <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          <span className="text-[10px] font-bold text-emerald-400">LIVE</span>
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="p-4">
                      <p className="font-bold text-slate-800 dark:text-white text-sm mb-1">{ad.title}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">{ad.description}</p>
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-400 dark:text-slate-500">{ad.duration}s</span>
                          <span className="text-slate-200 dark:text-slate-700">·</span>
                          <span className="text-xs text-slate-400 dark:text-slate-500 capitalize">{ad.language}</span>
                        </div>
                        <button onClick={() => toggle(ad.id)} disabled={isSaving}
                          className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                            isEnabled
                              ? 'bg-emerald-50 dark:bg-emerald-400/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-400/25 hover:bg-emerald-100'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700'
                          }`}>
                          {isSaving
                            ? <RefreshCw size={12} className="animate-spin" />
                            : isEnabled ? <ToggleRight size={14} /> : <ToggleLeft size={14} />
                          }
                          {isEnabled ? 'Enabled' : 'Enable'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Info box */}
          <div className="mt-8 p-5 rounded-2xl bg-sky-50 dark:bg-sky-400/08 border border-sky-200 dark:border-sky-400/20">
            <div className="flex items-start gap-3">
              <Zap size={16} className="text-sky-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-1">
                  How default ads work
                </p>
                <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1.5 leading-relaxed">
                  <li>• Default ads auto-fill with your company name, logo, and phone number from Company Settings.</li>
                  <li>• They show on your hotspot when no custom ad is active — think of them as your always-on fallback.</li>
                  <li>• Only one default ad can be active at a time. Enabling one automatically pauses the others.</li>
                  <li>• Custom ads you create in Ad Settings always take priority over default ads.</li>
                  <li>• Want to change colors? Update your Company Settings primary color — it reflects here instantly.</li>
                  <li>• The Mseewagas gas cylinder ad uses its own fixed palette and product photo, not your Company Settings colors — it's a promoted product ad rather than an ISP-brand ad.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Full preview modal */}
      <AnimatePresence>
        {previewAd && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
            onClick={() => setPreviewAd(null)}>
            <motion.div initial={{ scale: .92 }} animate={{ scale: 1 }} exit={{ scale: .92 }}
              style={{ width: 340, height: 580, borderRadius: 28, overflow: 'hidden', boxShadow: '0 30px 60px rgba(0,0,0,.5)', border: '1px solid rgba(255,255,255,.12)' }}
              onClick={e => e.stopPropagation()}>
              <AdFullPreview adId={previewAd} brand={brand} onClose={() => setPreviewAd(null)} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ── Mini preview (static first scene) ────────────────────────────────────────
function AdMiniPreview({ adId, brand }) {
  const Renderer = AD_RENDERERS[adId] || AdvertiseWithUsAd;
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <Renderer brand={brand} scene={0} progress={0} />
    </div>
  );
}

// ── Full animated preview ─────────────────────────────────────────────────────
function AdFullPreview({ adId, brand, onClose }) {
  const [elapsed, setElapsed] = useState(0);
  const ad = SYSTEM_ADS.find(a => a.id === adId) || SYSTEM_ADS[0];
  const sceneMap = SCENE_MAPS[adId] || [0];
  const scene = sceneMap.reduce((acc, start, i) => elapsed >= start ? i : acc, 0);
  const progress = Math.min(100, (elapsed / ad.duration) * 100);
  const Renderer = AD_RENDERERS[adId] || AdvertiseWithUsAd;

  useEffect(() => {
    setElapsed(0);
    const iv = setInterval(() => {
      setElapsed(e => {
        const n = e + 1;
        if (n >= ad.duration) clearInterval(iv);
        return Math.min(n, ad.duration);
      });
    }, 1000);
    return () => clearInterval(iv);
  }, [adId, ad.duration]);

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', background: '#020617', fontFamily: "'Plus Jakarta Sans', sans-serif", position: 'relative' }}>
      <div style={{ position: 'absolute', top: 10, right: 10, zIndex: 10 }}>
        <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(255,255,255,.12)', border: 'none', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <X size={15} />
        </button>
      </div>
      <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <Renderer brand={brand} scene={scene} progress={progress} />
      </div>
      <div style={{ padding: '8px 14px', background: 'rgba(0,0,0,.4)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 11, color: 'rgba(255,255,255,.35)' }}>Preview · {ad.title}</span>
        <span style={{ fontSize: 11, color: 'rgba(255,255,255,.35)' }}>{elapsed}s / {ad.duration}s</span>
      </div>
    </div>
  );
}

export default DefaultSystemAdsManager;