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
  MessageSquare, Sparkles, TrendingUp, Server,
  Router, Bell, ShieldCheck, MapPin, Sun, Moon
} from 'lucide-react';

// ── Styles ─────────────────────────────────────────────────────────────────────
const Styles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800;900&family=Space+Mono:wght@400;700&display=swap');
    .landing-root { font-family: 'Plus Jakarta Sans', sans-serif; }
    .mono { font-family: 'Space Mono', monospace; }

    /* ── Theme tokens ─────────────────────────────────────────────────── */
    .landing-root {
      --bg-page: #020617;
      --bg-page-alt: #0a1220;
      --bg-hero-1: #020617;
      --bg-hero-2: #0a1628;
      --bg-hero-3: #0f1f3d;
      --bg-nav: rgba(2,6,23,.85);
      --bg-card: rgba(15,23,42,.7);
      --bg-card-strong: rgba(15,23,42,.8);
      --bg-soft: rgba(15,23,42,.6);
      --border-subtle: rgba(148,163,184,.1);
      --border-subtle-2: rgba(148,163,184,.08);
      --border-subtle-3: rgba(148,163,184,.07);
      --text-primary: #ffffff;
      --text-secondary: #94a3b8;
      --text-muted: #64748b;
      --text-faint: #475569;
      --text-dim: #334155;
      --dot-color: rgba(148,163,184,.06);
      --shadow-color: rgba(0,0,0,.4);
      transition: background-color .3s ease, color .3s ease;
    }
    .landing-root[data-theme='light'] {
      --bg-page: #f8fafc;
      --bg-page-alt: #eef2f7;
      --bg-hero-1: #eef2ff;
      --bg-hero-2: #e0e7ff;
      --bg-hero-3: #dbeafe;
      --bg-nav: rgba(255,255,255,.85);
      --bg-card: rgba(255,255,255,.75);
      --bg-card-strong: rgba(255,255,255,.9);
      --bg-soft: rgba(255,255,255,.7);
      --border-subtle: rgba(15,23,42,.08);
      --border-subtle-2: rgba(15,23,42,.06);
      --border-subtle-3: rgba(15,23,42,.06);
      --text-primary: #0f172a;
      --text-secondary: #475569;
      --text-muted: #64748b;
      --text-faint: #94a3b8;
      --text-dim: #cbd5e1;
      --dot-color: rgba(15,23,42,.05);
      --shadow-color: rgba(15,23,42,.12);
    }
    .text-theme-primary   { color: var(--text-primary); }
    .text-theme-secondary { color: var(--text-secondary); }
    .text-theme-muted     { color: var(--text-muted); }
    .text-theme-faint     { color: var(--text-faint); }
    .text-theme-dim       { color: var(--text-dim); }
    .theme-toggle-btn {
      background: var(--bg-soft);
      border: 1px solid var(--border-subtle);
      color: var(--text-primary);
      transition: transform .15s, background-color .3s, border-color .3s;
    }
    .theme-toggle-btn:hover { transform: translateY(-1px); }
    .nav-link:hover { color: var(--text-primary) !important; }

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
      background: linear-gradient(135deg, var(--bg-hero-1) 0%, var(--bg-hero-2) 40%, var(--bg-hero-3) 70%, var(--bg-hero-1) 100%);
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
      background: var(--bg-card);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid var(--border-subtle);
      transition: transform .22s ease, box-shadow .22s ease, border-color .25s, background-color .3s;
    }
    .card-glass:hover {
      transform: translateY(-4px);
      box-shadow: 0 20px 60px var(--shadow-color);
    }
    .pricing-card {
      background: var(--bg-card-strong);
      backdrop-filter: blur(24px);
      border: 1px solid var(--border-subtle);
      transition: transform .25s ease, box-shadow .25s ease, border-color .25s, background-color .3s;
    }
    .pricing-card:hover { transform: translateY(-6px); box-shadow: 0 24px 64px var(--shadow-color); }
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
      background-image: radial-gradient(var(--dot-color) 1px, transparent 1px);
      background-size: 28px 28px;
    }
    .nav-glass {
      background: var(--bg-nav);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border-bottom: 1px solid var(--border-subtle-2);
      transition: background-color .3s, border-color .3s;
    }
    .feature-icon {
      background: linear-gradient(135deg, rgba(99,102,241,.15), rgba(139,92,246,.1));
      border: 1px solid rgba(99,102,241,.2);
    }
    .integration-item {
      background: var(--bg-soft);
      border: 1px solid var(--border-subtle-2);
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

const PLATFORM_FEATURES = [
  { icon: Router,      accent: '#38bdf8', title: 'Advanced MikroTik Integration',
    desc: 'Seamlessly connect and manage your entire MikroTik infrastructure. Real-time monitoring, remote configuration, bandwidth management, and automatic synchronization with RouterOS v6 and v7.',
    tags: ['CCR', 'RB4011', 'CRS', 'LtAP', 'RB5009', 'hEX'] },
  { icon: DollarSign,  accent: '#10b981', title: 'Intelligent Billing Engine',
    desc: 'Automated invoice generation, payment processing, and customer activation. Supports multiple payment gateways and currencies.',
    tags: ['Multiple Payment Gateways Supported'] },
  { icon: Wifi,        accent: '#a78bfa', title: 'PPPoE Session Control',
    desc: 'Complete subscriber session management with IP pool allocation, bandwidth profiles, and automatic service suspension for overdue accounts.' },
  { icon: Zap,         accent: '#fbbf24', title: 'Hotspot Management',
    desc: 'Bulk voucher generation, customizable captive portals, session tracking, bandwidth throttling, and usage analytics.' },
  { icon: ShieldCheck, accent: '#f87171', title: 'Radius Authentication',
    desc: 'Enterprise-grade authentication server with CoA support, accounting, and seamless integration with your network infrastructure.' },
  { icon: Users,       accent: '#f97316', title: 'Customer Self-Service',
    desc: 'White-label customer portal for account management, bill payments, usage monitoring, and support ticket submission.' },
  { icon: Bell,        accent: '#34d399', title: 'Smart Notifications',
    desc: 'Automated SMS and email alerts for billing reminders, service updates, and promotional campaigns.' },
  { icon: MapPin,      accent: '#38bdf8', title: 'Static IP Management',
    desc: 'Allocate and manage static IP addresses for business customers with automatic DNS integration and IP tracking.' },
  { icon: BarChart3,   accent: '#818cf8', title: 'Comprehensive Analytics & Reporting',
    desc: 'Real-time dashboards for MRR, customer churn, collection rates, and growth metrics. Generate detailed financial reports, subscriber analytics, and performance insights.' },
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
      data-cta="true"
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
  const [theme, setTheme] = useState(() => {
    if (typeof window === 'undefined') return 'dark';
    return window.localStorage.getItem('aitechs-theme') || 'dark';
  });

  useEffect(() => {
    window.localStorage.setItem('aitechs-theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(t => (t === 'dark' ? 'light' : 'dark'));

  // ── Lingering-visitor lead capture ────────────────────────────────────
  const [showLinger, setShowLinger] = useState(false);
  const [lingerSubmitted, setLingerSubmitted] = useState(false);
  const [lingerSubmitting, setLingerSubmitting] = useState(false);
  const [lingerName, setLingerName] = useState('');
  const [lingerPhone, setLingerPhone] = useState('');
  const engagedRef = useRef(false);
  const scrolledEnoughRef = useRef(false);

  const texts = ['Hotspot', 'PPPoE'];

  useEffect(() => {
    const t = setInterval(() => setCurrentText(p => p === texts[0] ? texts[1] : texts[0]), 3000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
      if (window.scrollY > 400) scrolledEnoughRef.current = true;
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Mark the visitor "engaged" the moment they click a primary CTA
  // (WhatsApp buttons, Contact Us, Call Us) so the linger prompt never
  // fires for someone who's already acted.
  useEffect(() => {
    const handleCtaClick = (e) => {
      if (e.target.closest('[data-cta]')) engagedRef.current = true;
    };
    document.addEventListener('click', handleCtaClick);
    return () => document.removeEventListener('click', handleCtaClick);
  }, []);

  // Soft "lingering visitor" capture — shown once per session to visitors
  // who've scrolled into the content and spent a while without clicking a CTA.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (sessionStorage.getItem('aitechs-linger-dismissed')) return;
    if (sessionStorage.getItem('aitechs-linger-submitted')) return;

    const timer = setTimeout(() => {
      if (engagedRef.current) return;
      if (!scrolledEnoughRef.current) return;
      if (document.visibilityState !== 'visible') return;
      setShowLinger(true);
    }, 48000);

    return () => clearTimeout(timer);
  }, []);

  const dismissLinger = () => {
    setShowLinger(false);
    sessionStorage.setItem('aitechs-linger-dismissed', '1');
  };

  const submitLinger = async (e) => {
    e.preventDefault();
    if (!lingerName.trim() || !lingerPhone.trim()) return;
    setLingerSubmitting(true);
    try {
      const response = await fetch('/api/company_leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: lingerName,
          phone_number: lingerPhone,
          source: 'website_linger',
          status: 'new',
        }),
      });
      if (response.ok) {
        setLingerSubmitted(true);
        sessionStorage.setItem('aitechs-linger-submitted', '1');
        setTimeout(() => setShowLinger(false), 3500);
      }
    } catch (err) {
      // non-critical widget — fail silently
    } finally {
      setLingerSubmitting(false);
    }
  };

  const scrollTo    = () => scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  const scrollToTop = () => scrollRefTop.current?.scrollIntoView({ behavior: 'smooth' });

  const NAV_LINKS = [
    { label: 'Home',     href: '#',        onClick: scrollToTop },
    { label: 'Features', href: '#features' },
    { label: 'Pricing',  href: '#',        onClick: scrollTo },
    { label: 'Contact',  href: '#contact' },
  ];

  const calcPPPoECost = (subs) => subs ? `KES ${(subs * 10).toLocaleString()}` : 'Custom';
  const calcPPPoENote = (subs) => subs ? `${subs} active clients × KES 10` : 'Negotiated pricing';

  return (
    <>
      <Styles />
      <div className="landing-root overflow-x-hidden" data-theme={theme}
        style={{ background: 'var(--bg-page)', color: 'var(--text-primary)' }} ref={scrollRefTop}>

        {/* ── Sticky nav ──────────────────────────────────────────────────── */}
        <nav className={`nav-glass fixed top-0 inset-x-0 z-50 transition-all duration-300 ${scrolled ? 'shadow-2xl' : ''}`}>
          <div className="max-w-7xl mx-auto px-5 py-3.5 flex items-center justify-between">
            <a href="/" className="flex items-center gap-2.5">
              <img src="/images/aitechs.png" className="h-8" alt="Aitechs" />
              <span className="text-xl font-bold text-theme-primary">Aitechs</span>
            </a>

            {/* Desktop links */}
            <ul className="hidden md:flex items-center gap-8">
              {NAV_LINKS.map(l => (
                <li key={l.label}>
                  <a href={l.href} onClick={l.onClick}
                    className="nav-link text-sm font-medium text-theme-secondary transition-colors cursor-pointer">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>

            <div className="hidden md:flex items-center gap-3">
              <motion.button whileHover={{ scale: 1.06 }} whileTap={{ scale: .95 }}
                onClick={toggleTheme} aria-label="Toggle light/dark theme"
                className="theme-toggle-btn w-10 h-10 rounded-xl flex items-center justify-center">
                {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
              </motion.button>
              <WaBtn text="Get Demo" />
              <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: .97 }}
                data-cta="true"
                onClick={() => window.location.href = '/contact-us'}
                className="btn-cta px-5 py-2.5 rounded-2xl text-sm font-bold text-white">
                Contact Us →
              </motion.button>
            </div>

            <div className="md:hidden flex items-center gap-2">
              <motion.button whileHover={{ scale: 1.06 }} whileTap={{ scale: .95 }}
                onClick={toggleTheme} aria-label="Toggle light/dark theme"
                className="theme-toggle-btn w-9 h-9 rounded-lg flex items-center justify-center">
                {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
              </motion.button>
              <button onClick={() => setMenuOpen(p => !p)} className="p-2 rounded-lg"
                style={{ background: 'var(--bg-soft)' }}>
                {menuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>

          {/* Mobile menu */}
          <AnimatePresence>
            {menuOpen && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }} transition={{ duration: .22 }}
                className="md:hidden overflow-hidden border-t" style={{ borderColor: 'var(--border-subtle-2)' }}>
                <div className="px-5 py-4 space-y-3">
                  {NAV_LINKS.map(l => (
                    <a key={l.label} href={l.href} onClick={() => { setMenuOpen(false); l.onClick?.(); }}
                      className="block text-sm font-medium text-theme-secondary py-2">{l.label}</a>
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
              <span className="text-lg text-theme-secondary font-medium">Powering your</span>
              <AnimatePresence mode="wait">
                <motion.span key={currentText}
                  initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 16 }}
                  transition={{ duration: .4 }}
                  className="text-lg font-bold mono px-3 py-1 rounded-lg"
                  style={{ background: 'rgba(99,102,241,.15)', color: '#818cf8', border: '1px solid rgba(99,102,241,.25)' }}>
                  {currentText}
                </motion.span>
              </AnimatePresence>
              <span className="text-lg text-theme-secondary font-medium">business</span>
            </div>

            <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .1, duration: .6 }}
              className="text-5xl md:text-7xl font-black mb-6 leading-tight">
              <span className="text-theme-primary">Revolutionize Your</span><br />
              <span className="gradient-text">Internet Business</span>
            </motion.h1>

            <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .2, duration: .5 }}
              className="text-lg md:text-xl text-theme-secondary mb-10 max-w-2xl mx-auto leading-relaxed">
              The all-in-one SaaS platform for Kenyan ISPs — hotspot management, PPPoE billing,
              M-Pesa automation, and real-time analytics. Built for scale.
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <WaBtn text="Get Free Demo" large />
              <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: .97 }}
                onClick={scrollTo}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl text-base font-bold text-theme-primary border transition-all"
                style={{ border: '1px solid var(--border-subtle)', background: 'var(--bg-soft)' }}>
                View Pricing <ArrowRight size={18} />
              </motion.button>
            </motion.div>

            {/* Social proof */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .6 }}
              className="flex items-center justify-center gap-6 mt-12 text-sm text-theme-muted">
              {[['50+', 'ISPs onboarded'], ['99.9%', 'Uptime'], ['24/7', 'Support']].map(([v, l]) => (
                <div key={l} className="text-center">
                  <p className="text-xl font-bold text-theme-primary mono">{v}</p>
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
              style={{ background: 'linear-gradient(to top,var(--bg-page),transparent)' }} />
          </motion.div>
        </section>

        {/* ── Ticker ──────────────────────────────────────────────────────── */}
        {/* <div className="py-3 border-y overflow-hidden" style={{ background:'rgba(15,23,42,.6)', borderColor:'rgba(148,163,184,.08)' }}>
          <div className="ticker-inner flex whitespace-nowrap">
            {[0,1].map(k => (
              <span key={k} className="mono text-xs text-theme-faint mr-20">
                ✅ No setup fees &nbsp;·&nbsp; ✅ Pay only for active users &nbsp;·&nbsp; ✅ Hotspot: 4% of revenue &nbsp;·&nbsp;
                ✅ PPPoE: KES 25/active client/month &nbsp;·&nbsp; ✅ M-Pesa integration &nbsp;·&nbsp; ✅ White-label ready &nbsp;·&nbsp;
                ✅ MikroTik compatible &nbsp;·&nbsp; ✅ Real-time analytics &nbsp;·&nbsp;
              </span>
            ))}
          </div>
        </div> */}

        {/* ── Features ────────────────────────────────────────────────────── */}
        <section id="features" className="py-24 px-6"
          style={{ background: 'linear-gradient(180deg,var(--bg-page) 0%,var(--bg-page-alt) 100%)' }}>
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <SectionLabel text="Why Choose Aitechs" />
              <motion.h2 initial={{ opacity:0, y:16 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
                className="text-4xl md:text-5xl font-black text-theme-primary mb-4">
                Everything you need to<br /><span className="gradient-text">run a modern ISP</span>
              </motion.h2>
              <p className="text-theme-muted max-w-xl mx-auto">
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
                    <h3 className="text-sm font-bold text-theme-primary mb-2">{f.title}</h3>
                    <p className="text-xs text-theme-muted leading-relaxed">{f.desc}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── Platform Features ───────────────────────────────────────────── */}
        <section className="py-24 px-6" style={{ background: 'var(--bg-page-alt)' }}>
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <SectionLabel text="Platform Features" />
              <motion.h2 initial={{ opacity:0, y:16 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
                className="text-4xl md:text-5xl font-black text-theme-primary mb-4">
                Enterprise-Grade<br /><span className="gradient-text">ISP Management</span>
              </motion.h2>
              <p className="text-theme-muted max-w-2xl mx-auto">
                A comprehensive suite of tools designed to automate operations, maximize revenue,
                and deliver exceptional service to your subscribers.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {PLATFORM_FEATURES.map((f, i) => {
                const Icon = f.icon;
                return (
                  <motion.div key={f.title}
                    initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }}
                    viewport={{ once:true }} transition={{ delay: i*0.05 }}
                    className="card-glass rounded-2xl p-6 relative overflow-hidden">
                    <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full pointer-events-none"
                      style={{ background:`radial-gradient(circle,${f.accent}18,transparent)` }} />
                    <div className="w-11 h-11 rounded-xl feature-icon flex items-center justify-center mb-4">
                      <Icon size={20} style={{ color: f.accent }} />
                    </div>
                    <h3 className="text-sm font-bold text-theme-primary mb-2">{f.title}</h3>
                    <p className="text-xs text-theme-muted leading-relaxed mb-3">{f.desc}</p>
                    {f.tags && (
                      <div className="flex flex-wrap gap-1.5">
                        {f.tags.map(tag => (
                          <span key={tag} className="text-[10px] font-semibold px-2 py-1 rounded-md"
                            style={{ background:`${f.accent}15`, color: f.accent, border:`1px solid ${f.accent}25` }}>
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>










{/* ── Partner / Reseller ──────────────────────────────────────────────── */}
<section className="py-24 px-6" style={{ background: 'var(--bg-page-alt)' }}>
  <div className="max-w-5xl mx-auto">
    <div className="text-center mb-16">
      <SectionLabel text="Partner & Reseller Program" />
      <motion.h2 initial={{ opacity:0, y:16 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
        className="text-4xl md:text-5xl font-black text-theme-primary mb-4">
        Earn by reselling Aitechs<br />
        <span className="gradient-green">hotspot to your tenants</span>
      </motion.h2>
      <p className="text-theme-muted max-w-xl mx-auto">
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
          <h3 className="text-sm font-bold text-theme-primary mb-2">{s.title}</h3>
          <p className="text-xs text-theme-muted leading-relaxed">{s.desc}</p>
        </motion.div>
      ))}
    </div>

    {/* Commission example */}
    <motion.div initial={{ opacity:0, y:16 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
      className="card-glass rounded-3xl p-8 mb-10"
      style={{ border:'1px solid rgba(16,185,129,.2)', background:'rgba(16,185,129,.04)' }}>
      <div className="flex items-center gap-3 mb-2">
        <TrendingUp size={18} style={{ color:'#34d399' }} />
        <h3 className="text-sm font-bold text-theme-primary">Example earnings — 20% commission rate</h3>
        <span className="ml-auto text-xs px-2.5 py-1 rounded-full font-semibold"
          style={{ background:'rgba(52,211,153,.12)', color:'#34d399' }}>Monthly</span>
      </div>
      <p className="text-xs text-theme-muted mb-5">Your tenants generate KES 30,000 in hotspot sales this month</p>
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
            <p className="text-xs font-semibold text-theme-primary mt-1">{r.label}</p>
            <p className="text-xs text-theme-muted mt-0.5">{r.note}</p>
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
          <p className="text-sm font-bold text-theme-primary">Reseller portal</p>
          <p className="text-xs text-theme-muted mt-0.5">Your personal dashboard to track earnings & sales</p>
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
            <p className="text-xs text-theme-muted mt-1">{s.label}</p>
          </div>
        ))}
      </div>
      <p className="text-xs font-semibold text-theme-secondary mb-2">Payout history</p>
      {[
        { month:'April 2025', amount:'KES 5,400', paid: true },
        { month:'March 2025', amount:'KES 4,900', paid: true },
        { month:'May 2025',   amount:'KES 6,200', paid: false },
      ].map(p => (
        <div key={p.month} className="flex items-center justify-between py-2.5"
          style={{ borderTop:'1px solid var(--border-subtle-3)' }}>
          <span className="text-xs text-theme-secondary">{p.month}</span>
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
      <p className="text-theme-muted text-sm mb-4">
        Interested in becoming a reseller? Contact us to get set up.
      </p>
      <WaBtn text="Become a Reseller" large />
    </div>
  </div>
</section>





   
     {/* ── PRICING: HOTSPOT ────────────────────────────────────────────── */}
        <section ref={scrollRef} className="py-24 px-6" style={{ background:'var(--bg-page)' }}>
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <SectionLabel text="Hotspot Pricing" />
              <motion.h2 initial={{ opacity:0, y:16 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
                className="text-4xl md:text-5xl font-black text-theme-primary mb-4">
                Hotspot — <span className="gradient-green">Pay fixed price</span>
              </motion.h2>
<p className="text-theme-secondary max-w-xl mx-auto text-lg">
  <strong className="text-theme-primary">KES 1,000/month per router</strong> — unlimited users,
  unlimited packages. No hidden fees.
</p>
            </div>

            {/* How it works */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {[
                { step:'01', title:'Customer pays', desc:'Your customer pays via M-Pesa for hotspot access', icon: Percent, accent:'#10b981' },
                { step:'02', title:'They connect',  desc:'WiFi is activated instantly — seamless experience', icon: Wifi, accent:'#38bdf8' },
                { step:'03', title:'Pay KES 1,000/router/mo', desc:'One flat monthly fee per Mikrotik router — unlimited users on that router, no percentage taken.', icon: DollarSign, accent:'#a78bfa' },

              ].map((s, i) => {
                const Icon = s.icon;
                return (
                  <motion.div key={s.step}
                    initial={{ opacity:0, y:16 }} whileInView={{ opacity:1, y:0 }}
                    viewport={{ once:true }} transition={{ delay: i*0.1 }}
                    className="card-glass rounded-2xl p-6 text-center relative overflow-hidden">
                    <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full pointer-events-none"
                      style={{ background:`radial-gradient(circle,${s.accent}20,transparent)` }} />
                    <div className="w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center"
                      style={{ background:`${s.accent}18`, border:`1px solid ${s.accent}28` }}>
                      <Icon size={22} style={{ color: s.accent }} />
                    </div>
                    <h3 className="text-sm font-bold text-theme-primary mb-2">{s.title}</h3>
                    <p className="text-xs text-theme-muted">{s.desc}</p>
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
                <h3 className="text-sm font-bold text-theme-primary">Example Revenue Breakdown</h3>
                <span className="ml-auto text-xs px-2.5 py-1 rounded-full font-semibold"
                  style={{ background:'rgba(52,211,153,.12)', color:'#34d399' }}>Monthly</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                    { label:'Flat fee per router',  value:'KES 1,000',    note:'Add more routers anytime, same flat rate',   accent:'#38bdf8' },
  { label:'Active users',      value:'Unlimited',  note:'No per-user charges, per router',         accent:'#a78bfa' },
  { label:'You keep',          value:'100%',       note:'All your M-Pesa revenue is yours', accent:'#34d399' },
                ].map(r => (
                  <div key={r.label} className="rounded-xl p-4 text-center"
                    style={{ background:`${r.accent}0a`, border:`1px solid ${r.accent}20` }}>
                    <p className="text-2xl font-bold mono" style={{ color: r.accent }}>{r.value}</p>
                    <p className="text-xs font-semibold text-theme-primary mt-1">{r.label}</p>
                    <p className="text-xs text-theme-muted mt-0.5">{r.note}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            <div className="text-center">
              <WaBtn text="Start Free Trial" large />
              <p className="text-xs text-theme-faint mt-3">No contract · No setup fee · Cancel anytime · KES 1,000/router/month</p>
            </div>
          </div>
        </section>







        {/* ── PRICING: PPPOE ──────────────────────────────────────────────── */}
        <section className="py-24 px-6" style={{ background:'var(--bg-page-alt)' }}>
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-6">
              <SectionLabel text="PPPoE Pricing" />
              <motion.h2 initial={{ opacity:0, y:16 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
               className="text-4xl md:text-5xl font-black text-theme-primary mb-4">
  PPPoE — <span className="gradient-text">KES 10 per active client</span>
</motion.h2>
<p className="text-theme-secondary max-w-xl mx-auto">
  Only pay for <strong className="text-theme-primary">active subscribers</strong> each month.
  No flat fees, no hidden charges. Scale up and down freely.
</p>
            </div>

            {/* Formula card */}
            <motion.div initial={{ opacity:0, y:12 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
              className="card-glass rounded-2xl p-6 mb-10 max-w-2xl mx-auto text-center"
              style={{ border:'1px solid rgba(99,102,241,.2)' }}>
              <p className="text-theme-secondary text-sm mb-3">Monthly bill formula</p>
              <p className="text-2xl font-black mono text-theme-primary">
                Active Clients &nbsp;×&nbsp;
                <span style={{ color:'#818cf8' }}>KES 10</span>
                &nbsp;=&nbsp;
                <span className="gradient-text">Your bill</span>
              </p>
              <p className="text-xs text-theme-muted mt-3">
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
                    <p className="text-xs text-theme-muted mb-4">
                      {plan.subs ? `Up to ${plan.subs} active clients` : 'Unlimited clients'}
                    </p>

                    <div className="mb-5">
                      <p className="text-3xl font-black text-theme-primary mono">{calcPPPoECost(plan.subs)}</p>
                      <p className="text-xs text-theme-muted mt-1">{calcPPPoENote(plan.subs)}</p>
                    </div>

                    <div className="space-y-2 mb-6">
                      {PPPOE_FEATURES.slice(0, 5).map((feat, fi) => (
                        <div key={feat} className="flex items-center gap-2">
                          {featureFlags[fi]
                            ? <CheckCircle size={13} style={{ color:'#34d399', flexShrink:0 }} />
                            : <XCircle    size={13} style={{ color:'#475569', flexShrink:0 }} />}
                          <span className={`text-xs ${featureFlags[fi] ? 'text-theme-secondary' : 'text-theme-faint'}`}>{feat}</span>
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
                    <p className="text-xs text-theme-muted">{plan.subs ? `Up to ${plan.subs} clients` : 'Custom'}</p>
                    <p className="text-lg font-black text-theme-primary mono mt-1">{calcPPPoECost(plan.subs)}</p>
                    <p className="text-xs text-theme-faint">{calcPPPoENote(plan.subs)}</p>
                  </div>
                  <WaBtn text="Start" />
                </motion.div>
              ))}
            </div>

            <div className="text-center">
              <p className="text-theme-muted text-sm mb-4">
                All plans include a <strong className="text-theme-primary">free 7-day trial</strong>.
                No credit card required.
              </p>
              <WaBtn text="Talk to Sales — Get Custom Quote" large />
            </div>
          </div>
        </section>
jdd1&FDNyv237#%
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
            <p className="text-theme-secondary text-lg mb-8 max-w-xl mx-auto">
              Join 50+ Kenyan ISPs already using Aitechs. Get a free demo today —
              no setup fees, no contracts, cancel anytime.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <WaBtn text="Get Free Demo on WhatsApp" large />
              <a href="tel:+254791568852" data-cta="true"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl text-base font-bold text-white border transition-all hover:opacity-80"
                style={{ border:'1px solid var(--border-subtle)', background:'rgba(15,23,42,.6)' }}>
                <Phone size={18} /> Call Us Now
              </a>
            </div>
          </motion.div>
        </section>

        {/* ── Contact ─────────────────────────────────────────────────────── */}
        <section id="contact" className="py-20 px-6" style={{ background:'var(--bg-page)' }}>
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <SectionLabel text="Get in Touch" />
              <h2 className="text-3xl font-black text-theme-primary">We're here to help</h2>
              <p className="text-theme-muted mt-2">For demos, trials, pricing or technical questions — reach out anytime.</p>
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
              ].map((c, i) => {
                const Icon = c.icon;
                return (
                  <motion.div key={c.label}
                    initial={{ opacity:0, y:16 }} whileInView={{ opacity:1, y:0 }}
                    viewport={{ once:true }} transition={{ delay: i*0.1 }}
                    data-cta="true"
                    className="card-glass rounded-2xl p-6 text-center cursor-pointer"
                    onClick={c.action}>
                    <div className="w-12 h-12 rounded-2xl mx-auto mb-4 flex items-center justify-center"
                      style={{ background:`${c.accent}15`, border:`1px solid ${c.accent}25` }}>
                      <Icon size={22} style={{ color: c.accent }} />
                    </div>
                    <p className="text-xs text-theme-muted mb-1">{c.label}</p>
                    <p className="text-sm font-semibold text-theme-primary mb-3 break-all">{c.value}</p>
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
          style={{ borderColor:'var(--border-subtle-3)', background:'var(--bg-page)' }}>
          <div className="flex items-center justify-center gap-2 mb-3">
            <img src="/images/aitechs.png" className="h-6 opacity-60" alt="Aitechs" />
            <span className="text-sm font-semibold text-theme-muted">Aitechs</span>
          </div>
          <p className="text-xs text-theme-dim">
            © {new Date().getFullYear()} Aitechs. Built for Kenyan ISPs. · <a href="/hotspot-pricing" className="hover:text-theme-muted">Hotspot Pricing</a>
          </p>
        </footer>

        {/* ── Lingering-visitor lead capture ─────────────────────────────── */}
        <AnimatePresence>
          {showLinger && (
            <motion.div
              initial={{ opacity: 0, y: 40, scale: .95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: .95 }}
              transition={{ type: 'spring', stiffness: 260, damping: 24 }}
              className="card-glass fixed bottom-6 left-6 z-50 rounded-3xl p-5"
              style={{ width: 320, maxWidth: 'calc(100vw - 3rem)', border: '1px solid rgba(99,102,241,.25)' }}
            >
              <button onClick={dismissLinger} aria-label="Dismiss"
                className="absolute top-3 right-3 p-1 rounded-lg opacity-60 hover:opacity-100 transition-opacity text-theme-secondary">
                <X size={16} />
              </button>

              {!lingerSubmitted ? (
                <>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-8 h-8 rounded-xl flex items-center justify-center"
                      style={{ background: 'rgba(99,102,241,.15)', border: '1px solid rgba(99,102,241,.25)' }}>
                      <Sparkles size={15} style={{ color: '#818cf8' }} />
                    </span>
                    <p className="text-sm font-bold text-theme-primary">Still exploring?</p>
                  </div>
                  <p className="text-xs text-theme-muted mb-4 leading-relaxed">
                    Get the full pricing breakdown and a quick walkthrough sent to your WhatsApp — no obligation.
                  </p>
                  <form onSubmit={submitLinger} className="space-y-2">
                    <input
                      type="text" placeholder="Your name" value={lingerName}
                      onChange={(e) => setLingerName(e.target.value)} required
                      className="w-full text-sm px-3 py-2 rounded-xl bg-transparent text-theme-primary"
                      style={{ border: '1px solid var(--border-subtle)' }}
                    />
                    <input
                      type="tel" placeholder="WhatsApp number" value={lingerPhone}
                      onChange={(e) => setLingerPhone(e.target.value)} required
                      className="w-full text-sm px-3 py-2 rounded-xl bg-transparent text-theme-primary"
                      style={{ border: '1px solid var(--border-subtle)' }}
                    />
                    <button type="submit" disabled={lingerSubmitting}
                      data-cta="true"
                      className="btn-cta w-full flex items-center justify-center gap-2 text-sm font-bold text-white py-2.5 rounded-xl">
                      {lingerSubmitting ? 'Sending...' : <>Send Me Info <ArrowRight size={14} /></>}
                    </button>
                  </form>
                </>
              ) : (
                <div className="flex items-center gap-3 py-2">
                  <CheckCircle size={22} style={{ color: '#34d399' }} />
                  <p className="text-sm text-theme-primary font-medium">
                    Thanks! We'll reach out on WhatsApp shortly.
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

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