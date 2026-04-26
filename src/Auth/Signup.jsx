import React, { useContext, useState, useRef, useEffect } from 'react';
import { ApplicationContext } from '../context/ApplicationContext';
import { FaArrowTrendUp, FaWhatsapp, FaPhoneVolume } from "react-icons/fa6";
import { FaRegArrowAltCircleRight, FaRegArrowAltCircleUp, FaCreditCard, FaUsersCog, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from "framer-motion";
import { MdOutlineMessage, MdEmail } from "react-icons/md";
import { BsQuestionCircle } from "react-icons/bs";
import { IoKeyOutline } from "react-icons/io5";
import {
  Wifi, Zap, Shield, Users, BarChart3, Globe,
  ArrowRight, Star, ChevronDown, ChevronUp, Menu, X,
  Percent, DollarSign, CheckCircle, XCircle, Phone,
  MessageSquare, Sparkles, TrendingUp, Server
} from 'lucide-react';

// ── Styles ─────────────────────────────────────────────────────────────────────
const Styles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800;900&family=Space+Mono:wght@400;700&display=swap');
    .landing-root { font-family: 'Plus Jakarta Sans', sans-serif; }
    .mono { font-family: 'Space Mono', monospace; }

    @keyframes gradientShift {
      0%,100% { background-position: 0% 50%; }
      50%      { background-position: 100% 50%; }
    }
    @keyframes float {
      0%,100% { transform: translateY(0px); }
      50%      { transform: translateY(-12px); }
    }
    @keyframes drift {
      0%,100% { transform: translate(0,0) scale(1); }
      33%      { transform: translate(18px,-22px) scale(1.04); }
      66%      { transform: translate(-12px,16px) scale(0.97); }
    }
    @keyframes shimmerText {
      0%,100% { background-position: 0% 50%; }
      50%      { background-position: 100% 50%; }
    }
    @keyframes ticker {
      0%   { transform: translateX(0); }
      100% { transform: translateX(-50%); }
    }
    @keyframes fadeUp {
      from { opacity:0; transform:translateY(24px); }
      to   { opacity:1; transform:translateY(0); }
    }
    @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
    @keyframes pulse-ring {
      0%   { transform:scale(1); opacity:.6; }
      100% { transform:scale(2.2); opacity:0; }
    }

    .gradient-hero {
      background: linear-gradient(135deg, #020617 0%, #0a1628 40%, #0f1f3d 70%, #020617 100%);
    }
    .gradient-text {
      background: linear-gradient(135deg, #22d3ee, #6366f1, #8b5cf6, #22d3ee);
      background-size: 300% 300%;
      animation: shimmerText 5s ease infinite;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    .gradient-green {
      background: linear-gradient(135deg, #10b981, #14b8a6, #22d3ee);
      background-size: 200% 200%;
      animation: gradientShift 3s ease infinite;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    .card-glass {
      background: rgba(15,23,42,.7);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid rgba(148,163,184,.1);
      transition: transform .22s ease, box-shadow .22s ease, border-color .25s;
    }
    .card-glass:hover {
      transform: translateY(-4px);
      box-shadow: 0 20px 60px rgba(0,0,0,.4);
    }
    .pricing-card {
      background: rgba(15,23,42,.8);
      backdrop-filter: blur(24px);
      border: 1px solid rgba(148,163,184,.1);
      transition: transform .25s ease, box-shadow .25s ease, border-color .25s;
    }
    .pricing-card:hover { transform: translateY(-6px); box-shadow: 0 24px 64px rgba(0,0,0,.45); }
    .pricing-featured {
      border-color: rgba(99,102,241,.5) !important;
      box-shadow: 0 0 40px rgba(99,102,241,.15) !important;
    }
    .btn-primary {
      background: linear-gradient(135deg, #10b981, #14b8a6);
      background-size: 200% 200%;
      animation: gradientShift 3s ease infinite;
      transition: transform .15s, box-shadow .15s;
    }
    .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 12px 32px rgba(16,185,129,.35); }
    .btn-cta {
      background: linear-gradient(135deg, #6366f1, #8b5cf6);
      transition: transform .15s, box-shadow .15s;
    }
    .btn-cta:hover { transform: translateY(-2px); box-shadow: 0 12px 32px rgba(99,102,241,.35); }
    .drift1 { animation: drift 12s ease-in-out infinite; }
    .drift2 { animation: drift 16s ease-in-out infinite reverse; }
    .drift3 { animation: drift 9s ease-in-out infinite 2s; }
    .float { animation: float 6s ease-in-out infinite; }
    .ticker-inner { animation: ticker 22s linear infinite; }
    .cursor-blink { animation: blink 1s step-end infinite; }
    .live-ring::after {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: 50%;
      background: #34d399;
      animation: pulse-ring 2s ease-out infinite;
    }
    .dot-grid {
      background-image: radial-gradient(rgba(148,163,184,.06) 1px, transparent 1px);
      background-size: 28px 28px;
    }
    .nav-glass {
      background: rgba(2,6,23,.85);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border-bottom: 1px solid rgba(148,163,184,.08);
    }
    .feature-icon {
      background: linear-gradient(135deg, rgba(99,102,241,.15), rgba(139,92,246,.1));
      border: 1px solid rgba(99,102,241,.2);
    }
    .integration-item {
      background: rgba(15,23,42,.6);
      border: 1px solid rgba(148,163,184,.08);
      transition: border-color .2s, transform .2s;
    }
    .integration-item:hover { border-color: rgba(99,102,241,.3); transform: translateY(-2px); }
    .whatsapp-btn {
      background: linear-gradient(135deg, #25d366, #128c7e);
      animation: gradientShift 3s ease infinite;
      background-size: 200% 200%;
    }
  `}</style>
);

// ── Data ───────────────────────────────────────────────────────────────────────
const FEATURES = [
  { icon: Shield,     accent: '#f97316', title: '99.99% Uptime',          desc: 'Our infrastructure is built for maximum reliability. SLA-backed uptime guarantee for your business.' },
  { icon: DollarSign, accent: '#10b981', title: 'Automated Payments',     desc: 'Review, monitor and manage M-Pesa payments automatically. Zero manual work.' },
  { icon: TrendingUp, accent: '#38bdf8', title: 'Infinitely Scalable',    desc: 'From 10 to 10,000+ subscribers. Our platform grows with your ISP business seamlessly.' },
  { icon: MessageSquare, accent: '#a78bfa', title: '24/7 Expert Support', desc: 'Round-the-clock technical support via WhatsApp, email and phone. We\'ve got your back.' },
  { icon: FaCreditCard, accent: '#fbbf24', title: 'Voucher System',       desc: 'Generate and manage thousands of hotspot vouchers. Auto-expire, resell and track usage.' },
  { icon: FaUsersCog,  accent: '#fb923c', title: 'User Management',       desc: 'Full control over roles, permissions, PPPoE profiles and customer settings.' },
  { icon: IoKeyOutline, accent: '#f87171', title: 'Multi-Layer Security', desc: 'Enterprise-grade auth: 2FA via SMS/email, passkeys, granular RBAC and audit trails.' },
  { icon: BarChart3,  accent: '#34d399', title: 'Advanced Analytics',     desc: 'Real-time revenue dashboards, bandwidth monitoring and customer behaviour insights.' },
];

const INTEGRATIONS = [
  { emoji: '💬', label: 'SMS',        desc: 'Integrate with your SMS provider' },
  { emoji: '💴', label: 'M-Pesa',     desc: 'Paybill & Till auto-payments' },
  { emoji: '💳', label: 'Billing',    desc: 'Automated invoicing & renewals' },
  { emoji: '🌐', label: 'Network',    desc: 'MikroTik & router management' },
  { emoji: '🔒', label: 'Security',   desc: 'Secure auth & data protection' },
  { emoji: '🏷️', label: 'White Label', desc: 'Your brand, your platform' },
];


const RESELLER_STEPS = [
  { num: '01', accent: '#38bdf8', title: 'ISP sets you up', desc: 'The ISP provides hotspot equipment and adds you as a reseller on their platform.' },
  { num: '02', accent: '#6366f1', title: 'You sell to tenants', desc: 'Your tenants pay for WiFi via M-Pesa. You sell on the ISP\'s behalf — no technical work needed.' },
  { num: '03', accent: '#10b981', title: 'ISP sets commission', desc: 'The ISP configures your commission rate. You earn automatically on every sale.' },
  { num: '04', accent: '#fbbf24', title: 'You get paid', desc: 'Earnings accumulate in your reseller portal and are paid to your M-Pesa monthly.' },
];



const AP_MONITOR_FEATURES = [
  { icon: Wifi,          accent: '#38bdf8', title: 'Constant ping monitoring',   desc: 'Every access point is pinged at set intervals. The system instantly detects when a device goes offline or becomes unreachable.' },
  { icon: Shield,        accent: '#f97316', title: 'Theft & tamper detection',   desc: 'If an AP suddenly goes offline in the field, the system flags it as a potential theft or tampering event immediately.' },
  { icon: MessageSquare, accent: '#10b981', title: 'Instant SMS alerts',         desc: 'The ISP admin receives an SMS the moment an AP goes down — with its name, location, and last-seen timestamp.' },
  { icon: Server,        accent: '#a78bfa', title: 'Device health dashboard',    desc: 'View all your access points on one screen — online, offline, or degraded — with uptime history and response times.' },
];


const PPPOE_PLANS = [
  { name: 'Starter',    color: '#10b981', subs: 50,   featured: false },
  { name: 'Basic',      color: '#38bdf8', subs: 100,  featured: false },
  { name: 'Pro',        color: '#6366f1', subs: 200,  featured: true  },
  { name: 'Business',   color: '#a78bfa', subs: 400,  featured: false },
  { name: 'Growth',     color: '#f97316', subs: 600,  featured: false },
  { name: 'Scale',      color: '#fbbf24', subs: 1000, featured: false },
  { name: 'Enterprise', color: '#f87171', subs: null,  featured: false },
];

const PPPOE_FEATURES = [
  'Your own subdomain',
  'Bulk SMS & Email',
  '24/7 Support',
  'M-Pesa integration',
  'Admin dashboard',
  'PPPoE plans',
  'Advanced analytics',
  'White-label branding',
];

const PPPOE_PLAN_FEATURES = {
  'Starter':    [1,1,1,1,1,0,0,0],
  'Basic':      [1,1,1,1,1,0,0,0],
  'Pro':        [1,1,1,1,1,1,1,0],
  'Business':   [1,1,1,1,1,1,1,0],
  'Growth':     [1,1,1,1,1,1,1,1],
  'Scale':      [1,1,1,1,1,1,1,1],
  'Enterprise': [1,1,1,1,1,1,1,1],
};

// ── Reusable components ────────────────────────────────────────────────────────
function SectionLabel({ text }) {
  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-4"
      style={{ background: 'rgba(99,102,241,.12)', border: '1px solid rgba(99,102,241,.25)' }}>
      <Sparkles size={12} style={{ color: '#818cf8' }} />
      <span className="text-xs font-semibold tracking-wider uppercase" style={{ color: '#818cf8' }}>{text}</span>
    </div>
  );
}

function WaBtn({ text = 'Chat on WhatsApp', large }) {
  return (
    <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: .97 }}
      onClick={() => window.open('https://wa.me/254791568852?text=Hello%2C%20I%20am%20interested%20in%20Aitechs%20ISP%20platform.', '_blank')}
      className={`whatsapp-btn inline-flex items-center gap-2 font-bold text-white rounded-2xl transition-all ${large ? 'px-8 py-4 text-base' : 'px-5 py-2.5 text-sm'}`}
    >
      <FaWhatsapp size={large ? 22 : 18} />
      {text}
    </motion.button>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────
const Signup = () => {
  const { email, setEmail, username, setUsername, password, setPassword,
    handleSignUp, offlineError } = useContext(ApplicationContext);

  const scrollRef    = useRef(null);
  const scrollRefTop = useRef(null);
  const [menuOpen, setMenuOpen]     = useState(false);
  const [currentText, setCurrentText] = useState('Hotspot');
  const [scrolled, setScrolled]     = useState(false);
  const [activeFaq, setActiveFaq]   = useState(null);

  const texts = ['Hotspot', 'PPPoE'];

  useEffect(() => {
    const t = setInterval(() => setCurrentText(p => p === texts[0] ? texts[1] : texts[0]), 3000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo    = () => scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  const scrollToTop = () => scrollRefTop.current?.scrollIntoView({ behavior: 'smooth' });

  const NAV_LINKS = [
    { label: 'Home',     href: '#',        onClick: scrollToTop },
    { label: 'Features', href: '#features' },
    { label: 'Pricing',  href: '#',        onClick: scrollTo },
    { label: 'Contact',  href: '#contact' },
  ];

  const calcPPPoECost = (subs) => subs ? `KES ${(subs * 25).toLocaleString()}` : 'Custom';
  const calcPPPoENote = (subs) => subs ? `${subs} active clients × KES 25` : 'Negotiated pricing';

  return (
    <>
      <Styles />
      <div className="landing-root bg-gray-950 text-white overflow-x-hidden" ref={scrollRefTop}>

        {/* ── Sticky nav ──────────────────────────────────────────────────── */}
        <nav className={`nav-glass fixed top-0 inset-x-0 z-50 transition-all duration-300 ${scrolled ? 'shadow-2xl' : ''}`}>
          <div className="max-w-7xl mx-auto px-5 py-3.5 flex items-center justify-between">
            <a href="/" className="flex items-center gap-2.5">
              <img src="/images/aitechs.png" className="h-8" alt="Aitechs" />
              <span className="text-xl font-bold text-white">Aitechs</span>
            </a>

            {/* Desktop links */}
            <ul className="hidden md:flex items-center gap-8">
              {NAV_LINKS.map(l => (
                <li key={l.label}>
                  <a href={l.href} onClick={l.onClick}
                    className="text-sm font-medium text-slate-400 hover:text-white transition-colors cursor-pointer">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>

            <div className="hidden md:flex items-center gap-3">
              <WaBtn text="Get Demo" />
              <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: .97 }}
                onClick={() => window.location.href = '/contact-us'}
                className="btn-cta px-5 py-2.5 rounded-2xl text-sm font-bold text-white">
                Contact Us →
              </motion.button>
            </div>

            <button onClick={() => setMenuOpen(p => !p)} className="md:hidden p-2 rounded-lg"
              style={{ background: 'rgba(148,163,184,.1)' }}>
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

          {/* Mobile menu */}
          <AnimatePresence>
            {menuOpen && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }} transition={{ duration: .22 }}
                className="md:hidden overflow-hidden border-t" style={{ borderColor: 'rgba(148,163,184,.08)' }}>
                <div className="px-5 py-4 space-y-3">
                  {NAV_LINKS.map(l => (
                    <a key={l.label} href={l.href} onClick={() => { setMenuOpen(false); l.onClick?.(); }}
                      className="block text-sm font-medium text-slate-400 py-2">{l.label}</a>
                  ))}
                  <WaBtn text="Get Demo" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>

        {/* ── Hero ────────────────────────────────────────────────────────── */}
        <section className="gradient-hero relative min-h-screen flex items-center justify-center dot-grid pt-20 overflow-hidden">
          {/* Blobs */}
          <div className="drift1 absolute top-20 left-10 w-96 h-96 rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle,rgba(99,102,241,.12) 0%,transparent 65%)' }} />
          <div className="drift2 absolute bottom-10 right-10 w-80 h-80 rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle,rgba(16,185,129,.1) 0%,transparent 65%)' }} />
          <div className="drift3 absolute top-1/2 right-1/4 w-64 h-64 rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle,rgba(56,189,248,.07) 0%,transparent 65%)' }} />

          <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
            {/* Animated label */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
              style={{ background: 'rgba(16,185,129,.1)', border: '1px solid rgba(16,185,129,.25)' }}>
              <span className="relative inline-flex w-2 h-2">
                <span className="live-ring absolute inset-0 rounded-full" />
                <span className="relative block w-2 h-2 rounded-full bg-emerald-400" />
              </span>
              <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Now serving ISPs across Kenya</span>
            </div>

            {/* Rotating text */}
            <div className="flex items-center justify-center gap-3 mb-4">
              <span className="text-lg text-slate-400 font-medium">Powering your</span>
              <AnimatePresence mode="wait">
                <motion.span key={currentText}
                  initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 16 }}
                  transition={{ duration: .4 }}
                  className="text-lg font-bold mono px-3 py-1 rounded-lg"
                  style={{ background: 'rgba(99,102,241,.15)', color: '#818cf8', border: '1px solid rgba(99,102,241,.25)' }}>
                  {currentText}
                </motion.span>
              </AnimatePresence>
              <span className="text-lg text-slate-400 font-medium">business</span>
            </div>

            <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .1, duration: .6 }}
              className="text-5xl md:text-7xl font-black mb-6 leading-tight">
              <span className="text-white">Revolutionize Your</span><br />
              <span className="gradient-text">Internet Business</span>
            </motion.h1>

            <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .2, duration: .5 }}
              className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
              The all-in-one SaaS platform for Kenyan ISPs — hotspot management, PPPoE billing,
              M-Pesa automation, and real-time analytics. Built for scale.
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <WaBtn text="Get Free Demo" large />
              <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: .97 }}
                onClick={scrollTo}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl text-base font-bold text-white border transition-all"
                style={{ border: '1px solid rgba(148,163,184,.2)', background: 'rgba(15,23,42,.6)' }}>
                View Pricing <ArrowRight size={18} />
              </motion.button>
            </motion.div>

            {/* Social proof */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .6 }}
              className="flex items-center justify-center gap-6 mt-12 text-sm text-slate-500">
              {[['50+', 'ISPs onboarded'], ['99.9%', 'Uptime'], ['24/7', 'Support']].map(([v, l]) => (
                <div key={l} className="text-center">
                  <p className="text-xl font-bold text-white mono">{v}</p>
                  <p className="text-xs">{l}</p>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Screenshot */}
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .4, duration: .7 }}
            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-3xl px-6 float">
            <img src="/images/isp_landing_page.png" alt="Dashboard Preview"
              className="w-full rounded-t-2xl shadow-2xl opacity-60"
              style={{ maxHeight: 240, objectFit: 'cover', objectPosition: 'top' }} />
            <div className="absolute inset-x-0 bottom-0 h-24"
              style={{ background: 'linear-gradient(to top,#020617,transparent)' }} />
          </motion.div>
        </section>

        {/* ── Ticker ──────────────────────────────────────────────────────── */}
        {/* <div className="py-3 border-y overflow-hidden" style={{ background:'rgba(15,23,42,.6)', borderColor:'rgba(148,163,184,.08)' }}>
          <div className="ticker-inner flex whitespace-nowrap">
            {[0,1].map(k => (
              <span key={k} className="mono text-xs text-slate-600 mr-20">
                ✅ No setup fees &nbsp;·&nbsp; ✅ Pay only for active users &nbsp;·&nbsp; ✅ Hotspot: 4% of revenue &nbsp;·&nbsp;
                ✅ PPPoE: KES 25/active client/month &nbsp;·&nbsp; ✅ M-Pesa integration &nbsp;·&nbsp; ✅ White-label ready &nbsp;·&nbsp;
                ✅ MikroTik compatible &nbsp;·&nbsp; ✅ Real-time analytics &nbsp;·&nbsp;
              </span>
            ))}
          </div>
        </div> */}

        {/* ── Features ────────────────────────────────────────────────────── */}
        <section id="features" className="py-24 px-6"
          style={{ background: 'linear-gradient(180deg,#020617 0%,#0a1220 100%)' }}>
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <SectionLabel text="Why Choose Aitechs" />
              <motion.h2 initial={{ opacity:0, y:16 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
                className="text-4xl md:text-5xl font-black text-white mb-4">
                Everything you need to<br /><span className="gradient-text">run a modern ISP</span>
              </motion.h2>
              <p className="text-slate-500 max-w-xl mx-auto">
                One platform. Zero complexity. Built specifically for Kenyan internet service providers.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {FEATURES.map((f, i) => {
                const Icon = f.icon;
                return (
                  <motion.div key={f.title}
                    initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }}
                    viewport={{ once:true }} transition={{ delay: i*0.06 }}
                    className="card-glass rounded-2xl p-5 relative overflow-hidden">
                    <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full pointer-events-none"
                      style={{ background:`radial-gradient(circle,${f.accent}18,transparent)` }} />
                    <div className="w-11 h-11 rounded-xl feature-icon flex items-center justify-center mb-4">
                      <Icon size={20} style={{ color: f.accent }} />
                    </div>
                    <h3 className="text-sm font-bold text-white mb-2">{f.title}</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">{f.desc}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>





{/* ── Access Point Monitoring ─────────────────────────────────────────── */}
<section className="py-24 px-6" style={{ background: '#020617' }}>
  <div className="max-w-5xl mx-auto">
    <div className="text-center mb-16">
      <SectionLabel text="Access Point Monitoring" />
      <motion.h2 initial={{ opacity:0, y:16 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
        className="text-4xl md:text-5xl font-black text-white mb-4">
        Know instantly when an AP<br />
        <span className="gradient-text">goes offline — or gets stolen</span>
      </motion.h2>
      <p className="text-slate-500 max-w-xl mx-auto">
        Access points installed in the field are a common theft target. Aitechs constantly
        pings every device and sends an SMS alert the moment one disappears — so you can act fast.
      </p>
    </div>

    {/* Feature cards */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-14">
      {AP_MONITOR_FEATURES.map((f, i) => {
        const Icon = f.icon;
        return (
          <motion.div key={f.title}
            initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }}
            viewport={{ once:true }} transition={{ delay: i*0.07 }}
            className="card-glass rounded-2xl p-5 relative overflow-hidden">
            <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full pointer-events-none"
              style={{ background:`radial-gradient(circle,${f.accent}18,transparent)` }} />
            <div className="w-11 h-11 rounded-xl feature-icon flex items-center justify-center mb-4"
              style={{ background:`${f.accent}18`, border:`1px solid ${f.accent}28` }}>
              <Icon size={20} style={{ color: f.accent }} />
            </div>
            <h3 className="text-sm font-bold text-white mb-2">{f.title}</h3>
            <p className="text-xs text-slate-500 leading-relaxed">{f.desc}</p>
          </motion.div>
        );
      })}
    </div>

    {/* Live monitor mockup + SMS alert mockup side by side */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">

      {/* Device dashboard */}
      <motion.div initial={{ opacity:0, x:-16 }} whileInView={{ opacity:1, x:0 }} viewport={{ once:true }}
        className="card-glass rounded-2xl p-6"
        style={{ border:'1px solid rgba(56,189,248,.2)' }}>
        <div className="flex items-center justify-between mb-5">
          <p className="text-sm font-bold text-white">Access point monitor</p>
          <span className="text-xs px-2.5 py-1 rounded-full font-semibold"
            style={{ background:'rgba(52,211,153,.12)', color:'#34d399' }}>
            Live
          </span>
        </div>
        {[
          { name: 'AP-001 · Westlands Rd',     status: 'online',   ping: '12ms',  uptime: '99.9%', accent: '#34d399' },
          { name: 'AP-002 · Garden Estate',    status: 'online',   ping: '18ms',  uptime: '99.7%', accent: '#34d399' },
          { name: 'AP-003 · Kasarani Stage',   status: 'offline',  ping: '—',     uptime: '61.2%', accent: '#f87171' },
          { name: 'AP-004 · Ruiru Town',       status: 'online',   ping: '9ms',   uptime: '100%',  accent: '#34d399' },
          { name: 'AP-005 · Pipeline Estate',  status: 'degraded', ping: '340ms', uptime: '88.4%', accent: '#fbbf24' },
        ].map(ap => (
          <div key={ap.name} className="flex items-center justify-between py-2.5"
            style={{ borderTop:'1px solid rgba(148,163,184,.07)' }}>
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full shrink-0" style={{ background: ap.accent }} />
              <span className="text-xs text-slate-300">{ap.name}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono" style={{ color: ap.accent === '#34d399' ? '#475569' : ap.accent }}>{ap.ping}</span>
              <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
                style={{ background:`${ap.accent}18`, color: ap.accent }}>
                {ap.status}
              </span>
            </div>
          </div>
        ))}
      </motion.div>

      {/* SMS alert mockup */}
      <motion.div initial={{ opacity:0, x:16 }} whileInView={{ opacity:1, x:0 }} viewport={{ once:true }}
        className="card-glass rounded-2xl p-6 flex flex-col"
        style={{ border:'1px solid rgba(248,113,113,.2)' }}>
        <div className="flex items-center justify-between mb-5">
          <p className="text-sm font-bold text-white">SMS alert — sent to admin</p>
          <span className="text-xs px-2.5 py-1 rounded-full font-semibold"
            style={{ background:'rgba(248,113,113,.12)', color:'#f87171' }}>
            Theft risk
          </span>
        </div>

        {/* Phone mockup */}
        <div className="flex-1 flex items-center justify-center">
          <div className="w-64 rounded-3xl p-4"
            style={{ background:'rgba(15,23,42,.9)', border:'1px solid rgba(148,163,184,.15)' }}>
            {/* Status bar */}
            <div className="flex items-center justify-between mb-3 px-1">
              <span className="text-xs text-slate-500 mono">9:41 AM</span>
              <div className="flex gap-1">
                <span style={{ width:14, height:8, background:'#334155', borderRadius:2, display:'inline-block' }} />
                <span style={{ width:14, height:8, background:'#334155', borderRadius:2, display:'inline-block' }} />
              </div>
            </div>
            {/* SMS bubble */}
            <div className="rounded-2xl p-4 mb-3"
              style={{ background:'rgba(248,113,113,.08)', border:'1px solid rgba(248,113,113,.2)' }}>
              <p className="text-xs font-bold mb-1" style={{ color:'#f87171' }}>Aitechs Alert</p>
              <p className="text-xs text-slate-300 leading-relaxed">
                ⚠️ ACCESS POINT OFFLINE<br /><br />
                Device: <span className="text-white font-semibold">AP-003 Kasarani Stage</span><br />
                Last seen: <span className="text-white">Today, 09:38 AM</span><br />
                Status: <span style={{ color:'#f87171' }}>Unreachable (ping failed)</span><br /><br />
                This may indicate theft or tampering. Please investigate immediately.
              </p>
              <p className="text-xs text-slate-600 mt-2 text-right">09:41 AM · Delivered</p>
            </div>
            <div className="rounded-2xl p-3"
              style={{ background:'rgba(251,191,36,.06)', border:'1px solid rgba(251,191,36,.15)' }}>
              <p className="text-xs font-bold mb-1" style={{ color:'#fbbf24' }}>Aitechs Alert</p>
              <p className="text-xs text-slate-400 leading-relaxed">
                ⚡ AP-005 Pipeline Estate response time degraded (340ms). Monitor closely.
              </p>
              <p className="text-xs text-slate-600 mt-1.5 text-right">08:12 AM · Delivered</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>

    {/* Bottom stats */}
    <motion.div initial={{ opacity:0, y:12 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
      className="grid grid-cols-1 sm:grid-cols-3 gap-5">
      {[
        { value:'30s',    label:'Ping interval',       note:'Every device checked every 30 seconds', accent:'#38bdf8' },
        { value:'< 1min', label:'Alert delivery time', note:'SMS reaches admin in under 60 seconds',  accent:'#f87171' },
        { value:'100%',   label:'Device coverage',     note:'Every AP on your network is monitored',  accent:'#34d399' },
      ].map(s => (
        <div key={s.label} className="card-glass rounded-2xl p-5 text-center relative overflow-hidden">
          <div className="absolute -top-4 -right-4 w-16 h-16 rounded-full pointer-events-none"
            style={{ background:`radial-gradient(circle,${s.accent}15,transparent)` }} />
          <p className="text-3xl font-black mono mb-1" style={{ color: s.accent }}>{s.value}</p>
          <p className="text-sm font-bold text-white mb-1">{s.label}</p>
          <p className="text-xs text-slate-500">{s.note}</p>
        </div>
      ))}
    </motion.div>
  </div>
</section>





{/* ── Partner / Reseller ──────────────────────────────────────────────── */}
<section className="py-24 px-6" style={{ background: '#0a1220' }}>
  <div className="max-w-5xl mx-auto">
    <div className="text-center mb-16">
      <SectionLabel text="Partner & Reseller Program" />
      <motion.h2 initial={{ opacity:0, y:16 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
        className="text-4xl md:text-5xl font-black text-white mb-4">
        Earn by reselling Aitechs<br />
        <span className="gradient-green">hotspot to your tenants</span>
      </motion.h2>
      <p className="text-slate-500 max-w-xl mx-auto">
        Are you a landlord, estate manager, or agent? Deploy hotspot equipment,
        sell internet to your customers — and earn a commission on every sale, automatically.
      </p>
    </div>

    {/* How it works */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
      {RESELLER_STEPS.map((s, i) => (
        <motion.div key={s.num}
          initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }}
          viewport={{ once:true }} transition={{ delay: i*0.08 }}
          className="card-glass rounded-2xl p-5 relative overflow-hidden">
          <div className="text-4xl font-black mono mb-3" style={{ color:`${s.accent}30` }}>{s.num}</div>
          <h3 className="text-sm font-bold text-white mb-2">{s.title}</h3>
          <p className="text-xs text-slate-500 leading-relaxed">{s.desc}</p>
        </motion.div>
      ))}
    </div>

    {/* Commission example */}
    <motion.div initial={{ opacity:0, y:16 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
      className="card-glass rounded-3xl p-8 mb-10"
      style={{ border:'1px solid rgba(16,185,129,.2)', background:'rgba(16,185,129,.04)' }}>
      <div className="flex items-center gap-3 mb-2">
        <TrendingUp size={18} style={{ color:'#34d399' }} />
        <h3 className="text-sm font-bold text-white">Example earnings — 20% commission rate</h3>
        <span className="ml-auto text-xs px-2.5 py-1 rounded-full font-semibold"
          style={{ background:'rgba(52,211,153,.12)', color:'#34d399' }}>Monthly</span>
      </div>
      <p className="text-xs text-slate-500 mb-5">Your tenants generate KES 30,000 in hotspot sales this month</p>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label:'Total sales revenue', value:'KES 30,000', note:'From your customers',  accent:'#38bdf8' },
          { label:'Your commission rate', value:'20%',        note:'Set by the ISP',       accent:'#818cf8' },
          { label:'You earn',             value:'KES 6,000',  note:'Paid to your M-Pesa', accent:'#34d399' },
          { label:'ISP earns',            value:'KES 24,000', note:'Before platform fees', accent:'#f97316' },
        ].map(r => (
          <div key={r.label} className="rounded-xl p-4 text-center"
            style={{ background:`${r.accent}0a`, border:`1px solid ${r.accent}20` }}>
            <p className="text-xl font-bold mono" style={{ color: r.accent }}>{r.value}</p>
            <p className="text-xs font-semibold text-white mt-1">{r.label}</p>
            <p className="text-xs text-slate-500 mt-0.5">{r.note}</p>
          </div>
        ))}
      </div>
    </motion.div>


















    {/* Reseller portal mockup */}
    <motion.div initial={{ opacity:0, y:16 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
      className="card-glass rounded-3xl p-7 mb-10"
      style={{ border:'1px solid rgba(99,102,241,.2)' }}>
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="text-sm font-bold text-white">Reseller portal</p>
          <p className="text-xs text-slate-500 mt-0.5">Your personal dashboard to track earnings & sales</p>
        </div>
        <span className="text-xs px-2.5 py-1 rounded-full font-semibold"
          style={{ background:'rgba(52,211,153,.12)', color:'#34d399' }}>Live</span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        {[
          { label:'This month',      value:'KES 6,200', accent:'#818cf8' },
          { label:'Total earned',    value:'KES 41,800', accent:'#818cf8' },
          { label:'Active customers', value:'87',        accent:'#818cf8' },
          { label:'Commission rate', value:'20%',        accent:'#818cf8' },
        ].map(s => (
          <div key={s.label} className="rounded-xl p-3 text-center"
            style={{ background:'rgba(99,102,241,.08)', border:'1px solid rgba(99,102,241,.15)' }}>
            <p className="text-lg font-bold mono" style={{ color: s.accent }}>{s.value}</p>
            <p className="text-xs text-slate-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>
      <p className="text-xs font-semibold text-slate-400 mb-2">Payout history</p>
      {[
        { month:'April 2025', amount:'KES 5,400', paid: true },
        { month:'March 2025', amount:'KES 4,900', paid: true },
        { month:'May 2025',   amount:'KES 6,200', paid: false },
      ].map(p => (
        <div key={p.month} className="flex items-center justify-between py-2.5"
          style={{ borderTop:'1px solid rgba(148,163,184,.07)' }}>
          <span className="text-xs text-slate-400">{p.month}</span>
          <span className="text-xs font-bold mono" style={{ color:'#34d399' }}>+ {p.amount}</span>
          <span className="text-xs px-2.5 py-1 rounded-full font-semibold"
            style={p.paid
              ? { background:'rgba(52,211,153,.12)', color:'#34d399' }
              : { background:'rgba(251,191,36,.1)', color:'#fbbf24' }}>
            {p.paid ? 'Paid' : 'Pending'}
          </span>
        </div>
      ))}
    </motion.div>

    <div className="text-center">
      <p className="text-slate-500 text-sm mb-4">
        Interested in becoming a reseller? Contact us to get set up.
      </p>
      <WaBtn text="Become a Reseller" large />
    </div>
  </div>
</section>





        {/* ── Integrations ────────────────────────────────────────────────── */}
        <section className="py-20 px-6" style={{ background:'#0a1220' }}>
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <SectionLabel text="Integrations" />
              <h2 className="text-3xl font-black text-white">Works with what you already use</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {INTEGRATIONS.map((item, i) => (
                <motion.div key={item.label}
                  initial={{ opacity:0, scale:.95 }} whileInView={{ opacity:1, scale:1 }}
                  viewport={{ once:true }} transition={{ delay: i*0.07 }}
                  className="integration-item rounded-2xl p-5 flex items-center gap-4 cursor-pointer">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0"
                    style={{ background:'rgba(99,102,241,.1)', border:'1px solid rgba(99,102,241,.2)' }}>
                    {item.emoji}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">{item.label}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── PRICING: HOTSPOT ────────────────────────────────────────────── */}
        <section ref={scrollRef} className="py-24 px-6" style={{ background:'#020617' }}>
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <SectionLabel text="Hotspot Pricing" />
              <motion.h2 initial={{ opacity:0, y:16 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
                className="text-4xl md:text-5xl font-black text-white mb-4">
                Hotspot — <span className="gradient-green">Pay as you earn</span>
              </motion.h2>
              <p className="text-slate-400 max-w-xl mx-auto text-lg">
                We charge <strong className="text-white">4% of your hotspot M-Pesa revenue</strong>.
                Zero upfront cost. You only pay when you earn.
              </p>
            </div>

            {/* How it works */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {[
                { step:'01', title:'Customer pays', desc:'Your customer pays via M-Pesa for hotspot access', icon: Percent, accent:'#10b981' },
                { step:'02', title:'They connect',  desc:'WiFi is activated instantly — seamless experience', icon: Wifi, accent:'#38bdf8' },
                { step:'03', title:'We bill 4%',    desc:'We collect 4% of that payment automatically at month end', icon: DollarSign, accent:'#a78bfa' },
              ].map((s, i) => {
                const Icon = s.icon;
                return (
                  <motion.div key={s.step}
                    initial={{ opacity:0, y:16 }} whileInView={{ opacity:1, y:0 }}
                    viewport={{ once:true }} transition={{ delay: i*0.1 }}
                    className="card-glass rounded-2xl p-6 text-center relative overflow-hidden">
                    <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full pointer-events-none"
                      style={{ background:`radial-gradient(circle,${s.accent}20,transparent)` }} />
                    <div className="text-4xl font-black mono mb-4" style={{ color:`${s.accent}40` }}>{s.step}</div>
                    <div className="w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center"
                      style={{ background:`${s.accent}18`, border:`1px solid ${s.accent}28` }}>
                      <Icon size={22} style={{ color: s.accent }} />
                    </div>
                    <h3 className="text-sm font-bold text-white mb-2">{s.title}</h3>
                    <p className="text-xs text-slate-500">{s.desc}</p>
                  </motion.div>
                );
              })}
            </div>

            {/* Revenue calculator illustration */}
            <motion.div initial={{ opacity:0, y:16 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
              className="card-glass rounded-3xl p-8 mb-6"
              style={{ border:'1px solid rgba(16,185,129,.2)', background:'rgba(16,185,129,.04)' }}>
              <div className="flex items-center gap-3 mb-6">
                <BarChart3 size={20} style={{ color:'#34d399' }} />
                <h3 className="text-sm font-bold text-white">Example Revenue Breakdown</h3>
                <span className="ml-auto text-xs px-2.5 py-1 rounded-full font-semibold"
                  style={{ background:'rgba(52,211,153,.12)', color:'#34d399' }}>Monthly</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { label:'Your hotspot revenue', value:'KES 50,000', note:'e.g. 1,000 sales × KES 50', accent:'#38bdf8' },
                  { label:'Our platform fee (4%)', value:'KES 2,000', note:'4% × KES 50,000', accent:'#a78bfa' },
                  { label:'You keep',             value:'KES 48,000', note:'96% stays with you', accent:'#34d399' },
                ].map(r => (
                  <div key={r.label} className="rounded-xl p-4 text-center"
                    style={{ background:`${r.accent}0a`, border:`1px solid ${r.accent}20` }}>
                    <p className="text-2xl font-bold mono" style={{ color: r.accent }}>{r.value}</p>
                    <p className="text-xs font-semibold text-white mt-1">{r.label}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{r.note}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            <div className="text-center">
              <WaBtn text="Start Free Trial" large />
              <p className="text-xs text-slate-600 mt-3">No contract · No setup fee · Cancel anytime</p>
            </div>
          </div>
        </section>

        {/* ── PRICING: PPPOE ──────────────────────────────────────────────── */}
        <section className="py-24 px-6" style={{ background:'#0a1220' }}>
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-6">
              <SectionLabel text="PPPoE Pricing" />
              <motion.h2 initial={{ opacity:0, y:16 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
                className="text-4xl md:text-5xl font-black text-white mb-4">
                PPPoE — <span className="gradient-text">KES 25 per active client</span>
              </motion.h2>
              <p className="text-slate-400 max-w-xl mx-auto">
                Only pay for <strong className="text-white">active subscribers</strong> each month.
                No flat fees, no hidden charges. Scale up and down freely.
              </p>
            </div>

            {/* Formula card */}
            <motion.div initial={{ opacity:0, y:12 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
              className="card-glass rounded-2xl p-6 mb-10 max-w-2xl mx-auto text-center"
              style={{ border:'1px solid rgba(99,102,241,.2)' }}>
              <p className="text-slate-400 text-sm mb-3">Monthly bill formula</p>
              <p className="text-2xl font-black mono text-white">
                Active Clients &nbsp;×&nbsp;
                <span style={{ color:'#818cf8' }}>KES 25</span>
                &nbsp;=&nbsp;
                <span className="gradient-text">Your bill</span>
              </p>
              <p className="text-xs text-slate-500 mt-3">
                Billed at end of each month · Only active (connected) subscribers count
              </p>
            </motion.div>

            {/* Plan cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
              {PPPOE_PLANS.slice(0,4).map((plan, i) => {
                const featureFlags = PPPOE_PLAN_FEATURES[plan.name];
                return (
                  <motion.div key={plan.name}
                    initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }}
                    viewport={{ once:true }} transition={{ delay: i*0.07 }}
                    className={`pricing-card rounded-2xl p-6 relative overflow-hidden ${plan.featured ? 'pricing-featured' : ''}`}>
                    {plan.featured && (
                      <div className="absolute top-4 right-4 flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold"
                        style={{ background:'rgba(99,102,241,.2)', color:'#818cf8' }}>
                        <Star size={10} fill="#818cf8" /> Most Popular
                      </div>
                    )}
                    <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full pointer-events-none"
                      style={{ background:`radial-gradient(circle,${plan.color}18,transparent)` }} />

                    <h3 className="text-lg font-bold mb-1" style={{ color: plan.color }}>{plan.name}</h3>
                    <p className="text-xs text-slate-500 mb-4">
                      {plan.subs ? `Up to ${plan.subs} active clients` : 'Unlimited clients'}
                    </p>

                    <div className="mb-5">
                      <p className="text-3xl font-black text-white mono">{calcPPPoECost(plan.subs)}</p>
                      <p className="text-xs text-slate-500 mt-1">{calcPPPoENote(plan.subs)}</p>
                    </div>

                    <div className="space-y-2 mb-6">
                      {PPPOE_FEATURES.slice(0, 5).map((feat, fi) => (
                        <div key={feat} className="flex items-center gap-2">
                          {featureFlags[fi]
                            ? <CheckCircle size={13} style={{ color:'#34d399', flexShrink:0 }} />
                            : <XCircle    size={13} style={{ color:'#475569', flexShrink:0 }} />}
                          <span className={`text-xs ${featureFlags[fi] ? 'text-slate-300' : 'text-slate-600'}`}>{feat}</span>
                        </div>
                      ))}
                    </div>

                    <WaBtn text="Get Started" />
                  </motion.div>
                );
              })}
            </div>

            {/* Remaining plans horizontal */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
              {PPPOE_PLANS.slice(4).map((plan, i) => (
                <motion.div key={plan.name}
                  initial={{ opacity:0, y:16 }} whileInView={{ opacity:1, y:0 }}
                  viewport={{ once:true }} transition={{ delay: i*0.07 }}
                  className="pricing-card rounded-2xl p-5 relative overflow-hidden flex items-center justify-between gap-4">
                  <div className="absolute -top-4 -right-4 w-16 h-16 rounded-full pointer-events-none"
                    style={{ background:`radial-gradient(circle,${plan.color}15,transparent)` }} />
                  <div>
                    <h3 className="text-base font-bold" style={{ color: plan.color }}>{plan.name}</h3>
                    <p className="text-xs text-slate-500">{plan.subs ? `Up to ${plan.subs} clients` : 'Custom'}</p>
                    <p className="text-lg font-black text-white mono mt-1">{calcPPPoECost(plan.subs)}</p>
                    <p className="text-xs text-slate-600">{calcPPPoENote(plan.subs)}</p>
                  </div>
                  <WaBtn text="Start" />
                </motion.div>
              ))}
            </div>

            <div className="text-center">
              <p className="text-slate-500 text-sm mb-4">
                All plans include a <strong className="text-white">free 14-day trial</strong>.
                No credit card required.
              </p>
              <WaBtn text="Talk to Sales — Get Custom Quote" large />
            </div>
          </div>
        </section>

        {/* ── CTA strip ───────────────────────────────────────────────────── */}
        <section className="py-20 px-6 relative overflow-hidden"
          style={{ background:'linear-gradient(135deg,#1a1040 0%,#0f1f3d 50%,#0a2218 100%)' }}>
          <div className="drift1 absolute top-0 left-0 w-80 h-80 rounded-full pointer-events-none"
            style={{ background:'radial-gradient(circle,rgba(99,102,241,.12) 0%,transparent 70%)' }} />
          <div className="drift2 absolute bottom-0 right-0 w-80 h-80 rounded-full pointer-events-none"
            style={{ background:'radial-gradient(circle,rgba(16,185,129,.1) 0%,transparent 70%)' }} />

          <motion.div initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
            className="max-w-3xl mx-auto text-center relative z-10">
            <div className="text-5xl mb-6">🚀</div>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
              Ready to grow your ISP?
            </h2>
            <p className="text-slate-400 text-lg mb-8 max-w-xl mx-auto">
              Join 50+ Kenyan ISPs already using Aitechs. Get a free demo today —
              no setup fees, no contracts, cancel anytime.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <WaBtn text="Get Free Demo on WhatsApp" large />
              <a href="tel:+254791568852"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl text-base font-bold text-white border transition-all hover:opacity-80"
                style={{ border:'1px solid rgba(148,163,184,.2)', background:'rgba(15,23,42,.6)' }}>
                <Phone size={18} /> Call Us Now
              </a>
            </div>
          </motion.div>
        </section>

        {/* ── Contact ─────────────────────────────────────────────────────── */}
        <section id="contact" className="py-20 px-6" style={{ background:'#020617' }}>
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <SectionLabel text="Get in Touch" />
              <h2 className="text-3xl font-black text-white">We're here to help</h2>
              <p className="text-slate-500 mt-2">For demos, trials, pricing or technical questions — reach out anytime.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {[
                {
                  icon: FaWhatsapp, accent:'#25d366', label:'WhatsApp',
                  value:'+254 791 568 852', action: () => window.open('https://wa.me/254791568852','_blank'),
                  cta:'Chat now',
                },
                {
                  icon: Phone, accent:'#38bdf8', label:'Phone',
                  value:'+254 791 568 852', action: () => window.location.href='tel:+254791568852',
                  cta:'Call now',
                },
                {
                  icon: MdEmail, accent:'#a78bfa', label:'Email',
                  value:'malcomowilla@gmail.com', action: () => window.location.href='mailto:malcomowilla@gmail.com',
                  cta:'Send email',
                },
              ].map((c, i) => {
                const Icon = c.icon;
                return (
                  <motion.div key={c.label}
                    initial={{ opacity:0, y:16 }} whileInView={{ opacity:1, y:0 }}
                    viewport={{ once:true }} transition={{ delay: i*0.1 }}
                    className="card-glass rounded-2xl p-6 text-center cursor-pointer"
                    onClick={c.action}>
                    <div className="w-12 h-12 rounded-2xl mx-auto mb-4 flex items-center justify-center"
                      style={{ background:`${c.accent}15`, border:`1px solid ${c.accent}25` }}>
                      <Icon size={22} style={{ color: c.accent }} />
                    </div>
                    <p className="text-xs text-slate-500 mb-1">{c.label}</p>
                    <p className="text-sm font-semibold text-white mb-3 break-all">{c.value}</p>
                    <button className="text-xs font-bold px-4 py-2 rounded-xl transition-all hover:opacity-80"
                      style={{ background:`${c.accent}18`, color: c.accent, border:`1px solid ${c.accent}25` }}>
                      {c.cta} →
                    </button>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── Footer ──────────────────────────────────────────────────────── */}
        <footer className="border-t py-8 px-6 text-center"
          style={{ borderColor:'rgba(148,163,184,.07)', background:'#020617' }}>
          <div className="flex items-center justify-center gap-2 mb-3">
            <img src="/images/aitechs.png" className="h-6 opacity-60" alt="Aitechs" />
            <span className="text-sm font-semibold text-slate-500">Aitechs</span>
          </div>
          <p className="text-xs text-slate-700">
            © {new Date().getFullYear()} Aitechs. Built for Kenyan ISPs. · <a href="/hotspot-pricing" className="hover:text-slate-500">Hotspot Pricing</a>
          </p>
        </footer>

        {/* ── Scroll to top ────────────────────────────────────────────────── */}
        <motion.button
          onClick={scrollToTop}
          whileHover={{ scale: 1.1 }} whileTap={{ scale: .95 }}
          className="fixed bottom-6 right-6 w-12 h-12 rounded-2xl flex items-center justify-center z-50 shadow-2xl"
          style={{ background:'rgba(99,102,241,.3)', border:'1px solid rgba(99,102,241,.4)', backdropFilter:'blur(12px)' }}>
          <FaRegArrowAltCircleUp size={20} style={{ color:'#818cf8' }} />
        </motion.button>
      </div>
    </>
  );
};

export default Signup;