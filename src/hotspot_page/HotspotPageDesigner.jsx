// HotspotPageDesigner.jsx
import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';
import {
  Palette, Type, LayoutTemplate, Image as ImageIcon, ToggleLeft,
  Upload, X, Wifi, RefreshCw, Save, UploadCloud, Check, Smartphone, Layers
} from 'lucide-react';

const subdomain = window.location.hostname.split('.')[0];

const COLOR_SCHEMES = {
  ocean:      { label: 'Ocean',      swatch: ['#38bdf8', '#a78bfa'], theme: { primary: '#38bdf8', secondary: '#a78bfa', accent: '#34d399', button_primary: '#38bdf8', button_secondary: '#a78bfa', background: '#020617', surface: '#0f172a', text: '#e2e8f0', muted: '#64748b' } },
  sunset:     { label: 'Sunset',     swatch: ['#fb923c', '#f472b6'], theme: { primary: '#fb923c', secondary: '#f472b6', accent: '#facc15', button_primary: '#fb923c', button_secondary: '#f472b6', background: '#1c0f0a', surface: '#2a1810', text: '#fef3ec', muted: '#a8836b' } },
  forest:     { label: 'Forest',     swatch: ['#34d399', '#22c55e'], theme: { primary: '#34d399', secondary: '#22c55e', accent: '#a3e635', button_primary: '#34d399', button_secondary: '#22c55e', background: '#04140f', surface: '#0a2318', text: '#e7f9ef', muted: '#6b9a82' } },
  midnight:   { label: 'Midnight',   swatch: ['#818cf8', '#c084fc'], theme: { primary: '#818cf8', secondary: '#c084fc', accent: '#38bdf8', button_primary: '#818cf8', button_secondary: '#c084fc', background: '#0b0a1a', surface: '#161430', text: '#ece9ff', muted: '#7c78a3' } },
  monochrome: { label: 'Monochrome', swatch: ['#e2e8f0', '#94a3b8'], theme: { primary: '#e2e8f0', secondary: '#94a3b8', accent: '#ffffff', button_primary: '#e2e8f0', button_secondary: '#475569', background: '#0a0a0a', surface: '#161616', text: '#f1f1f1', muted: '#7a7a7a' } },
  rose:       { label: 'Rose',       swatch: ['#fb7185', '#f9a8d4'], theme: { primary: '#fb7185', secondary: '#f9a8d4', accent: '#fbbf24', button_primary: '#fb7185', button_secondary: '#f9a8d4', background: '#1a0a10', surface: '#2b0f1a', text: '#fdf2f4', muted: '#a8798a' } },
  amber:      { label: 'Amber',      swatch: ['#fbbf24', '#f97316'], theme: { primary: '#fbbf24', secondary: '#f97316', accent: '#facc15', button_primary: '#fbbf24', button_secondary: '#f97316', background: '#1a1206', surface: '#2b1d0a', text: '#fef9ec', muted: '#a88b5f' } },
  cyber:      { label: 'Neon Cyber', swatch: ['#22d3ee', '#f472b6'], theme: { primary: '#22d3ee', secondary: '#f472b6', accent: '#a3e635', button_primary: '#22d3ee', button_secondary: '#f472b6', background: '#050510', surface: '#0d0d1f', text: '#e0fbff', muted: '#7d84a0' } },
  mint:       { label: 'Mint',       swatch: ['#2dd4bf', '#86efac'], theme: { primary: '#2dd4bf', secondary: '#86efac', accent: '#fbbf24', button_primary: '#2dd4bf', button_secondary: '#86efac', background: '#04120f', surface: '#0a201a', text: '#ecfdf7', muted: '#6b9c8c' } },
  coral:      { label: 'Coral',      swatch: ['#f87171', '#fb923c'], theme: { primary: '#f87171', secondary: '#fb923c', accent: '#facc15', button_primary: '#f87171', button_secondary: '#fb923c', background: '#1a0906', surface: '#2b120c', text: '#fef2ee', muted: '#a87c6f' } },
  royal:      { label: 'Royal',      swatch: ['#6366f1', '#818cf8'], theme: { primary: '#6366f1', secondary: '#818cf8', accent: '#34d399', button_primary: '#6366f1', button_secondary: '#818cf8', background: '#0a0a1f', surface: '#131330', text: '#eef0ff', muted: '#7d7fa3' } },
  arctic:     { label: 'Arctic',     swatch: ['#0ea5e9', '#64748b'], theme: { primary: '#0ea5e9', secondary: '#64748b', accent: '#06b6d4', button_primary: '#0ea5e9', button_secondary: '#64748b', background: '#f8fafc', surface: '#ffffff', text: '#0f172a', muted: '#64748b' } },
};

// Full-page style presets — each bundles a color scheme with matching
// typography + layout so a non-designer can get a finished look in one tap.
// header/footer copy and feature toggles are left untouched on apply.
const DESIGN_TEMPLATES = {
  minimal_dark: {
    label: 'Minimal Dark', description: 'Low-contrast, tight corners, clean type',
    color_scheme: 'monochrome',
    theme: { ...COLOR_SCHEMES.monochrome.theme },
    typography: { font_family: 'Inter', base_size: 14, heading_size: 22, weight_heading: 600 },
    layout: { card_width: 400, corner_radius: 12 },
  },
  bold_gradient: {
    label: 'Bold Gradient', description: 'Vibrant, rounded, high energy',
    color_scheme: 'sunset',
    theme: { ...COLOR_SCHEMES.sunset.theme },
    typography: { font_family: 'Poppins', base_size: 15, heading_size: 28, weight_heading: 800 },
    layout: { card_width: 440, corner_radius: 32 },
  },
  corporate_clean: {
    label: 'Corporate Clean', description: 'Structured, professional, restrained',
    color_scheme: 'royal',
    theme: { ...COLOR_SCHEMES.royal.theme },
    typography: { font_family: 'Roboto', base_size: 14, heading_size: 22, weight_heading: 700 },
    layout: { card_width: 420, corner_radius: 16 },
  },
  playful: {
    label: 'Playful', description: 'Friendly, rounded, mint accents',
    color_scheme: 'mint',
    theme: { ...COLOR_SCHEMES.mint.theme },
    typography: { font_family: 'Manrope', base_size: 15, heading_size: 26, weight_heading: 700 },
    layout: { card_width: 400, corner_radius: 36 },
  },
  neon_cyber: {
    label: 'Neon Cyber', description: 'High contrast neon on near-black',
    color_scheme: 'cyber',
    theme: { ...COLOR_SCHEMES.cyber.theme },
    typography: { font_family: 'Space Grotesk', base_size: 14, heading_size: 24, weight_heading: 700 },
    layout: { card_width: 420, corner_radius: 18 },
  },
  elegant_light: {
    label: 'Elegant Light', description: 'Airy, soft, light background',
    color_scheme: 'arctic',
    theme: { ...COLOR_SCHEMES.arctic.theme },
    typography: { font_family: 'Plus Jakarta Sans', base_size: 14, heading_size: 24, weight_heading: 700 },
    layout: { card_width: 440, corner_radius: 20 },
  },
};

const FONT_OPTIONS = ['Plus Jakarta Sans', 'Inter', 'Poppins', 'Roboto', 'Space Grotesk',
   'Manrope', 'sans-serif', 'Helvetica', 'Arial', 'Times New Roman', 'Courier New', 'monospace'];

const DEFAULT_DESIGN = {
  color_scheme: 'ocean',
  theme: { ...COLOR_SCHEMES.ocean.theme },
  typography: { font_family: 'Plus Jakarta Sans', base_size: 14, heading_size: 24, weight_heading: 700 },
  layout: { card_width: 420, corner_radius: 24 },
  header: { show_logo: true, show_wifi_icon: true, logo_url: null, network_name: '', tagline: 'Connect to the internet' },
  footer: { support_label: 'Need help?', support_phone: '' },
  features: { show_packages: true, show_voucher: true, show_mpesa_code: true, show_ads: true, show_free_trial: true, show_tv_plans: false },
};

function ToggleRow({ label, description, checked, onChange }) {
  return (
    <div className="flex items-center justify-between py-2.5">
      <div className="pr-4">
        <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{label}</p>
        {description && <p className="text-xs text-slate-500 dark:text-slate-500 mt-0.5">{description}</p>}
      </div>
      <button
        onClick={() => onChange(!checked)}
        className="relative shrink-0 w-11 h-6 rounded-full transition-colors"
        style={{ background: checked ? '#38bdf8' : 'rgba(148,163,184,.35)' }}
      >
        <motion.div
          className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow"
          animate={{ left: checked ? 22 : 2 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      </button>
    </div>
  );
}

function ColorField({ label, value, onChange }) {
  return (
    <div className="flex items-center justify-between py-2">
      <label className="text-sm text-slate-700 dark:text-slate-300">{label}</label>
      <div className="flex items-center gap-2">
        <span className="text-xs font-mono text-slate-500 dark:text-slate-500">{value}</span>
        <div className="relative w-8 h-8 rounded-lg overflow-hidden border border-slate-300 dark:border-slate-700">
          <input
            type="color"
            value={value}
            onChange={e => onChange(e.target.value)}
            className="absolute -top-1 -left-1 w-10 h-10 cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
}

const TABS = [
  { id: 'templates',  label: 'Templates',  icon: Layers },
  { id: 'colors',     label: 'Colors',     icon: Palette },
  { id: 'typography', label: 'Typography', icon: Type },
  { id: 'layout',      label: 'Layout',     icon: LayoutTemplate },
  { id: 'content',    label: 'Content',    icon: ImageIcon },
  { id: 'sections',   label: 'Sections',   icon: ToggleLeft },
];

export default function HotspotPageDesigner() {
  const [design, setDesign] = useState(DEFAULT_DESIGN);
  const [tab, setTab] = useState('templates');
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [logoPreview, setLogoPreview] = useState(null);
  const [routers, setRouters] = useState([]);
  const [selectedRouter, setSelectedRouter] = useState('');
  const [showPublishConfirm, setShowPublishConfirm] = useState(false);
  const [activeTemplate, setActiveTemplate] = useState(null);
  const iframeRef = useRef(null);

  const set = (path, value) =>
    setDesign(prev => {
      const next = structuredClone(prev);
      const keys = path.split('.');
      let obj = next;
      for (let i = 0; i < keys.length - 1; i++) obj = obj[keys[i]];
      obj[keys[keys.length - 1]] = value;
      return next;
    });

  const applyScheme = (key) => {
    setActiveTemplate(null);
    setDesign(prev => ({ ...prev, color_scheme: key, theme: { ...COLOR_SCHEMES[key].theme } }));
  };

  const applyTemplate = (key) => {
    const t = DESIGN_TEMPLATES[key];
    if (!t) return;
    setActiveTemplate(key);
    setDesign(prev => ({
      ...prev,
      color_scheme: t.color_scheme,
      theme: { ...t.theme },
      typography: { ...t.typography },
      layout: { ...t.layout },
    }));
    toast.success(`Applied "${t.label}" template`);
  };

  const fullDomain = window.location.hostname;


  const loadDesign = useCallback(async () => {
    try {
      const res = await fetch('/api/get_page_design', { headers: { 'X-Subdomain': subdomain,
 'X-Domain': fullDomain,


       }
      
      });
      if (res.ok) {
        const data = await res.json();
        if (data.page_design && Object.keys(data.page_design).length) {
          setDesign({ ...DEFAULT_DESIGN, ...data.page_design,
            theme: { ...DEFAULT_DESIGN.theme, ...(data.page_design.theme || {}) },
            header: { ...DEFAULT_DESIGN.header, ...(data.page_design.header || {}) },
            footer: { ...DEFAULT_DESIGN.footer, ...(data.page_design.footer || {}) },
          });
          if (data.page_design.header?.logo_url) setLogoPreview(data.page_design.header.logo_url);
        }
      }
    } catch (_) {}
  }, []);
  useEffect(() => { loadDesign(); }, [loadDesign]);

  const fetchRouters = useCallback(async () => {
    try {
      const res = await fetch('/api/routers', { headers: { 'X-Subdomain': subdomain,
         'X-Domain': fullDomain,
       } });
      if (res.ok) {
        const data = await res.json();
        setRouters(data);
        if (data.length) setSelectedRouter(data[0].id);
      }
    } catch (_) {}
  }, []);
  useEffect(() => { fetchRouters(); }, [fetchRouters]);

  // Debounced live preview
  useEffect(() => {
    setPreviewLoading(true);
    const t = setTimeout(async () => {
      try {
        const res = await fetch('/api/preview_page_design', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'X-Subdomain': subdomain,
             'X-Domain': fullDomain,
           },
          body: JSON.stringify({ page_design: design }),
        });
        const html = await res.text();
        if (iframeRef.current) iframeRef.current.srcdoc = html;
      } catch (_) {
      } finally {
        setPreviewLoading(false);
      }
    }, 400);
    return () => clearTimeout(t);
  }, [design]);

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLogoPreview(URL.createObjectURL(file)); // instant feedback

    const fd = new FormData();
    fd.append('design_logo', file);
    fd.append('page_design', JSON.stringify(design));
    try {
      const res = await fetch('/api/save_page_design', {
        method: 'POST', headers: { 'X-Subdomain': subdomain,
           'X-Domain': fullDomain,
         }, body: fd,
      });
      if (res.ok) {
        const data = await res.json();
        setDesign(prev => ({ ...prev, header: { ...prev.header, logo_url: data.page_design?.header?.logo_url } }));
        toast.success('Logo uploaded');
      } else {
        toast.error('Logo upload failed');
      }
    } catch (_) {
      toast.error('Network error uploading logo');
    }
  };

  const removeLogo = () => {
    setLogoPreview(null);
    set('header.logo_url', null);
  };

  const saveDesign = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/save_page_design', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Subdomain': subdomain,
           'X-Domain': fullDomain,
         },
        body: JSON.stringify({ page_design: design }),
      });
      if (res.ok) toast.success('Design saved'); else toast.error('Failed to save design');
    } catch (_) {
      toast.error('Network error saving design');
    } finally {
      setSaving(false);
    }
  };

  const publishDesign = async () => {
    if (!selectedRouter) { toast.error('Select a router first'); return; }
    setPublishing(true);
    try {
      const res = await fetch('/api/publish_hotspot_page', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Subdomain': subdomain,
           'X-Domain': fullDomain,
         },
        body: JSON.stringify({ router_id: selectedRouter }),
      });
      const data = await res.json();
      if (res.ok) toast.success(data.message || 'Published to router');
      else toast.error(data.message || 'Publish failed');
    } catch (_) {
      toast.error('Network error publishing');
    } finally {
      setPublishing(false);
      setShowPublishConfirm(false);
    }
  };

  return (
    <>
      <Toaster />
      <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans">
        {/* Top bar */}
        <div className="sticky top-0 z-30 flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-950/90 backdrop-blur">
          <div>
            <h1 className="text-lg font-bold">Hotspot Page Designer</h1>
            <p className="text-xs text-slate-500 dark:text-slate-500">Design your captive portal, then publish it straight to a router</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={saveDesign} disabled={saving}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
              {saving ? <RefreshCw size={15} className="animate-spin" /> : <Save size={15} />}
              {saving ? 'Saving…' : 'Save Design'}
            </button>
            <button onClick={() => setShowPublishConfirm(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white"
              style={{ background: 'linear-gradient(135deg,#38bdf8,#a78bfa)' }}>
              <UploadCloud size={15} /> Publish to Router
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr_420px] gap-0">
          {/* Tab rail */}
          <div className="border-r border-slate-200 dark:border-slate-800 p-3 space-y-1">
            {TABS.map(t => {
              const Icon = t.icon;
              const active = tab === t.id;
              return (
                <button key={t.id} onClick={() => setTab(t.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                    active ? 'bg-slate-100 dark:bg-slate-800 text-sky-600 dark:text-sky-300' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}>
                  <Icon size={16} /> {t.label}
                </button>
              );
            })}
          </div>

          {/* Panel */}
          <div className="p-6 border-r border-slate-200 dark:border-slate-800">
            <AnimatePresence mode="wait">
              <motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: .15 }}>

                {tab === 'templates' && (
                  <div className="max-w-md">
                    <h3 className="text-sm font-semibold mb-1 text-slate-700 dark:text-slate-300">Page Templates</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-500 mb-4">
                      One-tap presets that set colors, typography, and layout together. Your logo, copy, and section toggles are kept as-is.
                    </p>
                    <div className="space-y-3">
                      {Object.entries(DESIGN_TEMPLATES).map(([key, t]) => {
                        const active = activeTemplate === key;
                        return (
                          <button key={key} onClick={() => applyTemplate(key)}
                            className={`w-full text-left p-4 rounded-xl border transition-all flex items-center gap-4 ${
                              active ? 'border-sky-400 ring-2 ring-sky-400/30' : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                            }`}
                            style={{ background: t.theme.background }}>
                            <div className="shrink-0 w-14 h-14 rounded-lg flex items-center justify-center"
                              style={{ background: t.theme.surface, border: `1px solid ${t.theme.primary}44` }}>
                              <div className="w-7 h-7 rounded-full" style={{ background: `linear-gradient(135deg, ${t.theme.primary}, ${t.theme.secondary})` }} />
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-semibold flex items-center gap-2" style={{ color: t.theme.text }}>
                                {t.label}
                                {active && <Check size={13} className="text-sky-400" />}
                              </p>
                              <p className="text-xs mt-0.5" style={{ color: t.theme.muted }}>{t.description}</p>
                              <p className="text-[10px] mt-1 opacity-70" style={{ color: t.theme.muted }}>
                                {t.typography.font_family} · {t.layout.corner_radius}px corners
                              </p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {tab === 'colors' && (
                  <div className="space-y-6 max-w-md">
                    <div>
                      <h3 className="text-sm font-semibold mb-3 text-slate-700 dark:text-slate-300">Color Schemes</h3>
                      <div className="grid grid-cols-2 gap-3">
                        {Object.entries(COLOR_SCHEMES).map(([key, scheme]) => (
                          <button key={key} onClick={() => applyScheme(key)}
                            className={`relative p-3 rounded-xl border text-left transition-all ${
                              design.color_scheme === key ? 'border-sky-400 ring-2 ring-sky-400/30' : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                            }`}
                            style={{ background: scheme.theme.background }}>
                            <div className="flex gap-1.5 mb-2">
                              {scheme.swatch.map(c => (
                                <div key={c} className="w-5 h-5 rounded-full" style={{ background: c }} />
                              ))}
                            </div>
                            <p className="text-xs font-semibold" style={{ color: scheme.theme.text }}>{scheme.label}</p>
                            {design.color_scheme === key && (
                              <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-sky-400 flex items-center justify-center">
                                <Check size={10} className="text-slate-950" />
                              </div>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-semibold mb-1 text-slate-700 dark:text-slate-300">Custom Colors</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-500 mb-3">Fine-tune any color — this switches the scheme to Custom.</p>
                      <div className="divide-y divide-slate-200 dark:divide-slate-800">
                        <ColorField label="Primary"          value={design.theme.primary}          onChange={v => { set('theme.primary', v); set('color_scheme', 'custom'); }} />
                        <ColorField label="Secondary"        value={design.theme.secondary}        onChange={v => { set('theme.secondary', v); set('color_scheme', 'custom'); }} />
                        <ColorField label="Accent"           value={design.theme.accent}           onChange={v => { set('theme.accent', v); set('color_scheme', 'custom'); }} />
                        <ColorField label="Button Primary"   value={design.theme.button_primary}   onChange={v => { set('theme.button_primary', v); set('color_scheme', 'custom'); }} />
                        <ColorField label="Button Secondary" value={design.theme.button_secondary} onChange={v => { set('theme.button_secondary', v); set('color_scheme', 'custom'); }} />
                        <ColorField label="Background"       value={design.theme.background}       onChange={v => { set('theme.background', v); set('color_scheme', 'custom'); }} />
                        <ColorField label="Surface"          value={design.theme.surface}          onChange={v => { set('theme.surface', v); set('color_scheme', 'custom'); }} />
                        <ColorField label="Text"             value={design.theme.text}             onChange={v => { set('theme.text', v); set('color_scheme', 'custom'); }} />
                      </div>
                    </div>
                  </div>
                )}

                {tab === 'typography' && (
                  <div className="space-y-5 max-w-md">
                    <div>
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">Font Family</label>
                      <div className="grid grid-cols-2 gap-2">
                        {FONT_OPTIONS.map(f => (
                          <button key={f} onClick={() => set('typography.font_family', f)}
                            className={`p-3 rounded-xl border text-sm text-left transition-colors ${
                              design.typography.font_family === f ? 'border-sky-400 bg-sky-50 dark:bg-sky-400/10 text-sky-600 dark:text-sky-300' : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300'
                            }`} style={{ fontFamily: f }}>
                            {f}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="text-sm text-slate-700 dark:text-slate-300 flex justify-between mb-1">
                        <span>Base font size</span><span className="text-slate-500 dark:text-slate-500">{design.typography.base_size}px</span>
                      </label>
                      <input type="range" min="12" max="18" value={design.typography.base_size}
                        onChange={e => set('typography.base_size', Number(e.target.value))} className="w-full accent-sky-400" />
                    </div>
                    <div>
                      <label className="text-sm text-slate-700 dark:text-slate-300 flex justify-between mb-1">
                        <span>Heading size</span><span className="text-slate-500 dark:text-slate-500">{design.typography.heading_size}px</span>
                      </label>
                      <input type="range" min="18" max="36" value={design.typography.heading_size}
                        onChange={e => set('typography.heading_size', Number(e.target.value))} className="w-full accent-sky-400" />
                    </div>
                    <div>
                      <label className="text-sm text-slate-700 dark:text-slate-300 flex justify-between mb-1">
                        <span>Heading weight</span><span className="text-slate-500 dark:text-slate-500">{design.typography.weight_heading}</span>
                      </label>
                      <input type="range" min="400" max="800" step="100" value={design.typography.weight_heading}
                        onChange={e => set('typography.weight_heading', Number(e.target.value))} className="w-full accent-sky-400" />
                    </div>
                  </div>
                )}

                {tab === 'layout' && (
                  <div className="space-y-5 max-w-md">
                    <div>
                      <label className="text-sm text-slate-700 dark:text-slate-300 flex justify-between mb-1">
                        <span>Card width</span><span className="text-slate-500 dark:text-slate-500">{design.layout.card_width}px</span>
                      </label>
                      <input type="range" min="320" max="560" value={design.layout.card_width}
                        onChange={e => set('layout.card_width', Number(e.target.value))} className="w-full accent-sky-400" />
                    </div>
                    <div>
                      <label className="text-sm text-slate-700 dark:text-slate-300 flex justify-between mb-1">
                        <span>Corner radius</span><span className="text-slate-500 dark:text-slate-500">{design.layout.corner_radius}px</span>
                      </label>
                      <input type="range" min="0" max="40" value={design.layout.corner_radius}
                        onChange={e => set('layout.corner_radius', Number(e.target.value))} className="w-full accent-sky-400" />
                    </div>
                  </div>
                )}

                {tab === 'content' && (
                  <div className="space-y-6 max-w-md">
                    <div>
                      <h3 className="text-sm font-semibold mb-3 text-slate-700 dark:text-slate-300">Logo</h3>
                      {logoPreview ? (
                        <div className="flex items-center gap-3 mb-3">
                          <img src={logoPreview} alt="Logo" className="w-16 h-16 rounded-xl object-contain bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800" />
                          <button onClick={removeLogo} className="flex items-center gap-1.5 text-xs text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300">
                            <X size={12} /> Remove logo
                          </button>
                        </div>
                      ) : null}
                      <label className="flex items-center justify-center gap-2 border border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-4 text-sm text-slate-500 dark:text-slate-400 cursor-pointer hover:border-slate-400 dark:hover:border-slate-600 hover:text-slate-700 dark:hover:text-slate-300 transition-colors">
                        <Upload size={15} />
                        {logoPreview ? 'Replace logo' : 'Upload logo'}
                        <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                      </label>
                      <p className="text-xs text-slate-500 dark:text-slate-500 mt-2">
                        Once uploaded, your logo shows at the top of the live preview on the right — that's the exact placement customers will see.
                      </p>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 block">Network Name (Identity)</label>
                      <input className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-sm focus:outline-none focus:border-sky-400"
                        placeholder="e.g. Twintech WiFi"
                        value={design.header.network_name} onChange={e => set('header.network_name', e.target.value)} />
                      <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">The big heading on the portal. Leave empty to use the router's own name.</p>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 block">Tagline</label>
                      <input className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-sm focus:outline-none focus:border-sky-400"
                        placeholder="Connect to the internet"
                        value={design.header.tagline} onChange={e => set('header.tagline', e.target.value)} />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 block">Support Label</label>
                      <input className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-sm focus:outline-none focus:border-sky-400"
                        placeholder="Need help?"
                        value={design.footer.support_label} onChange={e => set('footer.support_label', e.target.value)} />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 block">Support Phone</label>
                      <input className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-sm focus:outline-none focus:border-sky-400"
                        placeholder="07XX XXX XXX"
                        value={design.footer.support_phone} onChange={e => set('footer.support_phone', e.target.value)} />
                    </div>

                    <div className="border-t border-slate-200 dark:border-slate-800 pt-4">
                      <ToggleRow label="Show Logo" checked={design.header.show_logo}
                        onChange={v => set('header.show_logo', v)} />
                      <ToggleRow label="Show WiFi Icon" checked={design.header.show_wifi_icon}
                        onChange={v => set('header.show_wifi_icon', v)} />
                    </div>
                  </div>
                )}

                {tab === 'sections' && (
                  <div className="max-w-md">
                    <div className="divide-y divide-slate-200 dark:divide-slate-800">
                      <ToggleRow label="Packages" description="Let customers buy a data package" checked={design.features.show_packages}
                        onChange={v => set('features.show_packages', v)} />
                      <ToggleRow label="Voucher" description="Redeem prepaid voucher codes" checked={design.features.show_voucher}
                        onChange={v => set('features.show_voucher', v)} />
                      <ToggleRow label="M-Pesa Code" description="Verify an existing M-Pesa transaction" checked={design.features.show_mpesa_code}
                        onChange={v => set('features.show_mpesa_code', v)} />
                      <ToggleRow label="Free Trial" description="Show the free-trial banner for packages marked as free trial in Package settings" checked={design.features.show_free_trial}
  onChange={v => set('features.show_free_trial', v)} />
                      <ToggleRow label="Ads" description="Show sponsored ads on the portal" checked={design.features.show_ads}
                        onChange={v => set('features.show_ads', v)} />

                        <ToggleRow label="TV / Device Connect" description="Let customers pay to connect a smart TV or set-top box by MAC address — requires TV Plans to be created first" checked={design.features.show_tv_plans}
  onChange={v => set('features.show_tv_plans', v)} />
                    </div>
                   <p className="text-xs text-slate-500 dark:text-slate-500 mt-3">
  Any ad you've enabled under Hotspot Marketing → Ads will load live in the preview on the right whenever this is on. Free trial cards only appear for packages you've flagged as free-trial-eligible. Views there don't count toward your ad analytics.
</p>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Live preview */}
          <div className="p-6 bg-slate-50 dark:bg-slate-900/40 sticky top-[73px] h-[calc(100vh-73px)] flex flex-col items-center">
            <div className="flex items-center gap-2 mb-4 text-xs text-slate-500 dark:text-slate-400">
              <Smartphone size={13} />
              Live preview
              {previewLoading && <RefreshCw size={11} className="animate-spin text-sky-400" />}
            </div>
            {/* Device frame stays dark — it represents the physical phone bezel, not app theming */}
            <div className="relative rounded-[2.5rem] border-8 border-slate-800 shadow-2xl bg-black overflow-hidden"
              style={{ width: 340, height: 640 }}>
              <iframe ref={iframeRef} title="preview" className="w-full h-full" style={{ border: 'none' }} />
              {previewLoading && (
                <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px] flex items-center justify-center">
                  <RefreshCw size={20} className="animate-spin text-white/70" />
                </div>
              )}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-500 mt-3 text-center max-w-[300px]">
              This is the same page that gets published to your router — your logo, WiFi icon, package list, and any active ads all render here exactly as customers will see them. A "Preview" badge appears at the top so ad views here are never counted.
            </p>
          </div>
        </div>
      </div>

      {/* Publish confirm modal */}
      <AnimatePresence>
        {showPublishConfirm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            onClick={() => setShowPublishConfirm(false)}>
            <motion.div initial={{ scale: .95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 max-w-sm w-full mx-4"
              onClick={e => e.stopPropagation()}>
              <div className="flex items-center gap-2 mb-4">
                <UploadCloud className="text-sky-500 dark:text-sky-400" size={20} />
                <h3 className="font-bold text-slate-900 dark:text-slate-100">Publish to Router</h3>
              </div>
              <label className="text-xs text-slate-500 dark:text-slate-400 mb-1.5 block">Target router</label>
              <select value={selectedRouter} onChange={e => setSelectedRouter(e.target.value)}
                className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-sm mb-4">
                {routers.map(r => <option key={r.id} value={r.id}>{r.name} ({r.ip_address})</option>)}
              </select>
              <p className="text-xs text-amber-600 dark:text-amber-400/90 mb-5">This overwrites the existing hotspot login page on this router.</p>
              <div className="flex gap-2">
                <button onClick={() => setShowPublishConfirm(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm font-semibold hover:bg-slate-200 dark:hover:bg-slate-700">
                  Cancel
                </button>
                <button onClick={publishDesign} disabled={publishing}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white"
                  style={{ background: 'linear-gradient(135deg,#38bdf8,#a78bfa)' }}>
                  {publishing ? 'Publishing…' : 'Confirm Publish'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}