// HotspotPageDesigner.jsx
import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';
import {
  Palette, Type, LayoutTemplate, Image as ImageIcon, ToggleLeft,
  Upload, X, RefreshCw, Save, UploadCloud, Check, Smartphone, Tablet, Monitor,
  Maximize2, Layers, GripVertical, ChevronUp, ChevronDown, Megaphone, Trash2
} from 'lucide-react';

const subdomain = window.location.hostname.split('.')[0];
const fullDomain = window.location.hostname;
const baseHeaders = { 'X-Subdomain': subdomain, 'X-Domain': fullDomain };
const jsonHeaders = { 'Content-Type': 'application/json', ...baseHeaders };

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

const DEFAULT_SECTION_ORDER = ['packages', 'recover', 'voucher', 'mpesa'];

const SECTION_META = {
  packages: { label: 'Buy a Package',   hint: 'Package list and payment',     feature: 'show_packages' },
  recover:  { label: 'Recover Session', hint: 'Reconnect using phone number', feature: null },
  voucher:  { label: 'Have a Voucher?', hint: 'Enter a voucher code',         feature: 'show_voucher' },
  mpesa:    { label: 'M-Pesa Code',     hint: 'Paid but not connected',       feature: 'show_mpesa_code' },
};

const normalizeOrder = (order) => {
  const saved = (Array.isArray(order) ? order : []).filter((id, i, a) => SECTION_META[id] && a.indexOf(id) === i);
  return [...saved, ...DEFAULT_SECTION_ORDER.filter(id => !saved.includes(id))];
};

const DEFAULT_DESIGN = {
  color_scheme: 'ocean',
  theme: { ...COLOR_SCHEMES.ocean.theme },
  typography: { font_family: 'Plus Jakarta Sans', base_size: 14, heading_size: 24, weight_heading: 700 },
  layout: { card_width: 420, corner_radius: 24, section_order: DEFAULT_SECTION_ORDER },
  header: { show_logo: true, show_wifi_icon: true, logo_url: null, network_name: '', tagline: 'Connect to the internet' },
  footer: { support_label: 'Need help?', support_phone: '' },
  features: { show_packages: true, show_voucher: true, show_mpesa_code: true, show_ads: true, show_free_trial: true, show_tv_plans: false },
};

// ── Preview devices ─────────────────────────────────────────────────
// The iframe is rendered at the real device width (so the page's own
// responsive CSS kicks in) and then scaled down to fit the pane.
const DEVICES = {
  mobile:  { label: 'Mobile',  icon: Smartphone, w: 340,  h: 640,  bw: 8,  frame: 'rounded-[2.5rem]' },
  tablet:  { label: 'Tablet',  icon: Tablet,     w: 768,  h: 1024, bw: 10, frame: 'rounded-[1.75rem]' },
  desktop: { label: 'Desktop', icon: Monitor,    w: 1280, h: 800,  bw: 6,  frame: 'rounded-xl' },
};

// ── Broadcast ───────────────────────────────────────────────────────
const BROADCAST_MAX = 280;
const BROADCAST_LEVELS = {
  info:     { label: 'Info',     hint: 'General notice' },
  warning:  { label: 'Warning',  hint: 'Slow or degraded service' },
  critical: { label: 'Critical', hint: 'Outage' },
};
const BROADCAST_TEMPLATES = [
  { label: 'Slow internet', level: 'warning', message: 'Internet may be slow right now. We are fixing network issues and will have things back to normal soon. Thank you for your patience.' },
  { label: 'Maintenance',   level: 'warning', message: 'Scheduled maintenance is in progress. Internet may drop for a short while. Sorry for the inconvenience.' },
  { label: 'Outage',        level: 'critical', message: 'We are experiencing a network outage. Our team is working to restore service. Please check back shortly.' },
  { label: 'Back to normal', level: 'info',   message: 'Internet is back to normal. Thank you for your patience.' },
];
const EMPTY_BROADCAST = { enabled: false, message: '', level: 'warning' };
const normalizeBroadcast = (b) => ({
  enabled: !!b?.enabled,
  message: b?.message || '',
  level: BROADCAST_LEVELS[b?.level] ? b.level : 'warning',
});

const formatDate = (iso) => {
  if (!iso) return '';
  try { return new Date(iso).toLocaleString(); } catch (_) { return iso; }
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

function SectionOrder({ order, features, onChange }) {
  const [dragIndex, setDragIndex] = useState(null);
  const [overIndex, setOverIndex] = useState(null);

  const move = (from, to) => {
    if (from === to || to < 0 || to >= order.length) return;
    const next = [...order];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    onChange(next);
  };

  return (
    <div className="mb-6">
      <h3 className="text-sm font-semibold mb-1 text-slate-700 dark:text-slate-300">Section Order</h3>
      <p className="text-xs text-slate-500 mb-3">
        Drag to rearrange (or use the arrows). The top item appears first on the page.
        “Buy a Package” is at the top by default so customers see where to pay right away.
      </p>

      <div className="space-y-2">
        {order.map((id, i) => {
          const meta = SECTION_META[id];
          const hidden = meta.feature && features[meta.feature] === false;
          return (
            <div key={id}
              draggable
              onDragStart={() => setDragIndex(i)}
              onDragOver={(e) => { e.preventDefault(); setOverIndex(i); }}
              onDragLeave={() => setOverIndex(null)}
              onDrop={() => { move(dragIndex, i); setDragIndex(null); setOverIndex(null); }}
              onDragEnd={() => { setDragIndex(null); setOverIndex(null); }}
              className={`flex items-center gap-3 p-3 rounded-xl border bg-white dark:bg-slate-900 cursor-grab active:cursor-grabbing transition-colors ${
                overIndex === i && dragIndex !== null && dragIndex !== i
                  ? 'border-green-400 ring-2 ring-green-400/30'
                  : 'border-slate-200 dark:border-slate-800'
              } ${dragIndex === i ? 'opacity-50' : ''} ${hidden ? 'opacity-60' : ''}`}>
              <GripVertical size={16} className="text-slate-400 shrink-0" />
              <span className="w-5 h-5 shrink-0 rounded-full bg-slate-100 dark:bg-slate-800 text-[11px] font-bold flex items-center justify-center">{i + 1}</span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                  {meta.label}
                  {hidden && <span className="ml-2 text-[10px] uppercase tracking-wide text-amber-600">Hidden</span>}
                </p>
                <p className="text-xs text-slate-500">{meta.hint}</p>
              </div>
              <div className="flex flex-col shrink-0">
                <button type="button" onClick={() => move(i, i - 1)} disabled={i === 0}
                  className="p-0.5 text-slate-500 hover:text-slate-900 dark:hover:text-white disabled:opacity-25" aria-label="Move up">
                  <ChevronUp size={16} />
                </button>
                <button type="button" onClick={() => move(i, i + 1)} disabled={i === order.length - 1}
                  className="p-0.5 text-slate-500 hover:text-slate-900 dark:hover:text-white disabled:opacity-25" aria-label="Move down">
                  <ChevronDown size={16} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <button type="button" onClick={() => onChange(DEFAULT_SECTION_ORDER)}
        className="mt-3 text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 underline">
        Reset to default order
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

function DeviceToggle({ device, onChange }) {
  return (
    <div className="inline-flex rounded-xl border border-slate-200 dark:border-slate-800 p-0.5 bg-white dark:bg-slate-900">
      {Object.entries(DEVICES).map(([key, d]) => {
        const Icon = d.icon;
        const active = device === key;
        return (
          <button key={key} type="button" onClick={() => onChange(key)} title={d.label}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              active
                ? 'bg-slate-100 dark:bg-slate-800 text-green-600 dark:text-green-300'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}>
            <Icon size={14} /> {d.label}
          </button>
        );
      })}
    </div>
  );
}

// Renders the page HTML at real device size, scaled to fit its container.
// fitHeight=false: scale to width only, container scrolls vertically.
// fitHeight=true:  scale so the whole device is visible (fullscreen / modal).
function PreviewFrame({ html, device, loading, fitHeight = false }) {
  const boxRef = useRef(null);
  const [box, setBox] = useState({ w: 0, h: 0 });

  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      setBox({ w: entry.contentRect.width, h: entry.contentRect.height });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const d = DEVICES[device];
  let scale = 1;
  if (box.w > 0) {
    scale = Math.min(1, (box.w - 2 * d.bw) / d.w);
    if (fitHeight && box.h > 0) scale = Math.min(scale, (box.h - 2 * d.bw) / d.h);
    scale = Math.max(0.1, scale);
  }

  return (
    <div ref={boxRef}
      className={`w-full ${fitHeight ? 'h-full items-center' : 'h-full items-start'} flex justify-center overflow-y-auto`}
      style={{ scrollbarGutter: 'stable' }}>
      <div className={`relative shrink-0 border-slate-800 bg-black shadow-2xl overflow-hidden ${d.frame}`}
        style={{
          width: d.w * scale + 2 * d.bw,
          height: d.h * scale + 2 * d.bw,
          borderWidth: d.bw,
          borderStyle: 'solid',
        }}>
        <iframe
          title={`preview-${device}`}
          srcDoc={html}
          style={{
            width: d.w, height: d.h, border: 'none',
            transform: `scale(${scale})`, transformOrigin: 'top left',
          }}
        />
        {loading && (
          <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px] flex items-center justify-center">
            <RefreshCw size={20} className="animate-spin text-white/70" />
          </div>
        )}
      </div>
    </div>
  );
}

const TABS = [
  { id: 'templates',  label: 'Templates',  icon: Layers },
  { id: 'colors',     label: 'Colors',     icon: Palette },
  { id: 'typography', label: 'Typography', icon: Type },
  { id: 'layout',     label: 'Layout',     icon: LayoutTemplate },
  { id: 'content',    label: 'Content',    icon: ImageIcon },
  { id: 'sections',   label: 'Sections',   icon: ToggleLeft },
  { id: 'broadcast',  label: 'Broadcast',  icon: Megaphone },
];

export default function HotspotPageDesigner() {
  const [design, setDesign] = useState(DEFAULT_DESIGN);
  const [tab, setTab] = useState('templates');
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [logoPreview, setLogoPreview] = useState(null);
  const [routers, setRouters] = useState([]);
  const [selectedRouter, setSelectedRouter] = useState('');
  const [showPublishConfirm, setShowPublishConfirm] = useState(false);
  const [activeTemplate, setActiveTemplate] = useState(null);

  // preview state
  const [device, setDevice] = useState('mobile');
  const [previewHtml, setPreviewHtml] = useState('');
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewSource, setPreviewSource] = useState('draft'); // 'draft' | router id
  const [routerHtml, setRouterHtml] = useState('');
  const [routerLoading, setRouterLoading] = useState(false);
  const [routerRefreshKey, setRouterRefreshKey] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const [modalView, setModalView] = useState('current'); // 'current' | 'new'
  const [publishedList, setPublishedList] = useState([]);

  // broadcast state
  const [broadcastDraft, setBroadcastDraft] = useState(EMPTY_BROADCAST);
  const [broadcastSaved, setBroadcastSaved] = useState(EMPTY_BROADCAST);
  const [broadcastSaving, setBroadcastSaving] = useState(false);

  const publishedMap = Object.fromEntries(publishedList.map(r => [String(r.router_id), r]));
  const broadcastDirty = JSON.stringify(broadcastDraft) !== JSON.stringify(broadcastSaved);

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
      layout: { ...t.layout, section_order: prev.layout.section_order },
    }));
    toast.success(`Applied "${t.label}" template`);
  };

  const loadDesign = useCallback(async () => {
    try {
      const res = await fetch('/api/get_page_design', { headers: baseHeaders });
      if (res.ok) {
        const data = await res.json();
        if (data.page_design && Object.keys(data.page_design).length) {
          setDesign({ ...DEFAULT_DESIGN, ...data.page_design,
            theme: { ...DEFAULT_DESIGN.theme, ...(data.page_design.theme || {}) },
            header: { ...DEFAULT_DESIGN.header, ...(data.page_design.header || {}) },
            footer: { ...DEFAULT_DESIGN.footer, ...(data.page_design.footer || {}) },
            layout: { ...DEFAULT_DESIGN.layout, ...(data.page_design.layout || {}) },
          });
          if (data.page_design.header?.logo_url) setLogoPreview(data.page_design.header.logo_url);
        }
      }
    } catch (_) {}
  }, []);
  useEffect(() => { loadDesign(); }, [loadDesign]);

  const fetchRouters = useCallback(async () => {
    try {
      const res = await fetch('/api/routers', { headers: baseHeaders });
      if (res.ok) {
        const data = await res.json();
        setRouters(data);
        if (data.length) setSelectedRouter(data[0].id);
      }
    } catch (_) {}
  }, []);
  useEffect(() => { fetchRouters(); }, [fetchRouters]);

  const fetchPublished = useCallback(async () => {
    try {
      const res = await fetch('/api/published_hotspot_designs', { headers: baseHeaders });
      if (res.ok) setPublishedList(await res.json());
    } catch (_) {}
  }, []);
  useEffect(() => { fetchPublished(); }, [fetchPublished]);

  const loadBroadcast = useCallback(async () => {
    try {
      const res = await fetch('/api/hotspot_broadcast', { headers: baseHeaders });
      if (res.ok) {
        const b = normalizeBroadcast(await res.json());
        setBroadcastDraft(b);
        setBroadcastSaved(b);
      }
    } catch (_) {}
  }, []);
  useEffect(() => { loadBroadcast(); }, [loadBroadcast]);

  // Debounced live preview of the DRAFT (design + draft broadcast)
  useEffect(() => {
    setPreviewLoading(true);
    const t = setTimeout(async () => {
      try {
        const res = await fetch('/api/preview_page_design', {
          method: 'POST',
          headers: jsonHeaders,
          body: JSON.stringify({ page_design: design, broadcast: broadcastDraft }),
        });
        setPreviewHtml(await res.text());
      } catch (_) {
      } finally {
        setPreviewLoading(false);
      }
    }, 400);
    return () => clearTimeout(t);
  }, [design, broadcastDraft]);

  // Which router (if any) should we be previewing the PUBLISHED page of?
  const routerPreviewId = showPublishConfirm
    ? (modalView === 'current' ? String(selectedRouter || '') : '')
    : (previewSource !== 'draft' ? String(previewSource) : '');

  useEffect(() => {
    if (!routerPreviewId) return;
    let cancelled = false;
    setRouterLoading(true);
    setRouterHtml('');
    (async () => {
      try {
        const res = await fetch('/api/preview_page_design', {
          method: 'POST',
          headers: jsonHeaders,
          body: JSON.stringify({ router_id: routerPreviewId }),
        });
        if (!res.ok) throw new Error('preview failed');
        const html = await res.text();
        if (!cancelled) setRouterHtml(html);
      } catch (_) {
        if (!cancelled) setRouterHtml('');
      } finally {
        if (!cancelled) setRouterLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [routerPreviewId, routerRefreshKey]);

  const sidebarShowsRouter = !showPublishConfirm && previewSource !== 'draft';
  const activeHtml = sidebarShowsRouter ? routerHtml : previewHtml;
  const activeLoading = sidebarShowsRouter ? routerLoading : previewLoading;

  const modalHtml = modalView === 'current' ? routerHtml : previewHtml;
  const modalLoading = modalView === 'current' ? routerLoading : previewLoading;

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLogoPreview(URL.createObjectURL(file));

    const fd = new FormData();
    fd.append('design_logo', file);
    fd.append('page_design', JSON.stringify(design));
    try {
      const res = await fetch('/api/save_page_design', {
        method: 'POST', headers: baseHeaders, body: fd,
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

  // Returns true on success. silent = no success toast (used before publishing).
  const saveDesign = async (silent = false) => {
    setSaving(true);
    try {
      const res = await fetch('/api/save_page_design', {
        method: 'POST',
        headers: jsonHeaders,
        body: JSON.stringify({ page_design: design }),
      });
      if (res.ok) {
        if (!silent) toast.success('Design saved');
        return true;
      }
      toast.error('Failed to save design');
      return false;
    } catch (_) {
      toast.error('Network error saving design');
      return false;
    } finally {
      setSaving(false);
    }
  };

  const publishDesign = async () => {
    if (!selectedRouter) { toast.error('Select a router first'); return; }
    setPublishing(true);
    try {
      // Publish always uses the SAVED design, so save the draft first.
      const saved = await saveDesign(true);
      if (!saved) return;

      const res = await fetch('/api/publish_hotspot_page', {
        method: 'POST',
        headers: jsonHeaders,
        body: JSON.stringify({ router_id: selectedRouter }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message || 'Published to router');
        await fetchPublished();
        setRouterRefreshKey(k => k + 1);
        setModalView('current');
      } else {
        toast.error(data.message || 'Publish failed');
      }
    } catch (_) {
      toast.error('Network error publishing');
    } finally {
      setPublishing(false);
    }
  };

  const saveBroadcast = async (next = broadcastDraft, successMsg = 'Broadcast saved') => {
    if (next.enabled && !next.message.trim()) {
      toast.error('Write a message before turning the broadcast on');
      return;
    }
    setBroadcastSaving(true);
    try {
      const res = await fetch('/api/hotspot_broadcast', {
        method: 'POST',
        headers: jsonHeaders,
        body: JSON.stringify(next),
      });
      const data = await res.json();
      if (res.ok) {
        const b = normalizeBroadcast(data);
        setBroadcastDraft(b);
        setBroadcastSaved(b);
        toast.success(successMsg);
      } else {
        toast.error(data.error || 'Failed to save broadcast');
      }
    } catch (_) {
      toast.error('Network error saving broadcast');
    } finally {
      setBroadcastSaving(false);
    }
  };

  const removeBroadcast = () =>
    saveBroadcast({ ...broadcastDraft, enabled: false }, 'Broadcast removed from hotspot pages');

  const openPublishModal = () => {
    setModalView('current');
    setShowPublishConfirm(true);
  };

  const selectedInfo = publishedMap[String(selectedRouter)];

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
            <button onClick={() => saveDesign()} disabled={saving}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-green-100 dark:bg-green-800
               hover:bg-green-200 dark:hover:bg-green-700 transition-colors">
              {saving ? <RefreshCw size={15} className="animate-spin" /> : <Save size={15} />}
              {saving ? 'Saving…' : 'Save Design'}
            </button>

            <button onClick={openPublishModal}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white"
              style={{ background: 'green' }}>
              <UploadCloud size={15} /> Publish to Router
            </button>
          </div>
        </div>

        <div className={`grid grid-cols-1 gap-0 ${
          device === 'mobile' ? 'lg:grid-cols-[320px_1fr_420px]' : 'lg:grid-cols-[320px_1fr_560px]'
        }`}>
          {/* Tab rail */}
          <div className="border-r border-slate-200 dark:border-slate-800 p-3 space-y-1">
            {TABS.map(t => {
              const Icon = t.icon;
              const active = tab === t.id;
              return (
                <button key={t.id} onClick={() => setTab(t.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                    active ? 'bg-slate-100 dark:bg-slate-800 text-green-600 dark:text-green-300' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}>
                  <Icon size={16} /> {t.label}
                  {t.id === 'broadcast' && broadcastSaved.enabled && (
                    <span className="ml-auto text-[10px] font-bold uppercase tracking-wide">Live</span>
                  )}
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
                                {active && <Check size={13} className="text-green-400" />}
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
                              design.color_scheme === key ? 'border-green-400 ring-2 ring-sky-400/30' : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                            }`}
                            style={{ background: scheme.theme.background }}>
                            <div className="flex gap-1.5 mb-2">
                              {scheme.swatch.map(c => (
                                <div key={c} className="w-5 h-5 rounded-full" style={{ background: c }} />
                              ))}
                            </div>
                            <p className="text-xs font-semibold" style={{ color: scheme.theme.text }}>{scheme.label}</p>
                            {design.color_scheme === key && (
                              <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-green-400 flex items-center justify-center">
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
                              design.typography.font_family === f ? 'border-green-400 bg-sky-50 dark:bg-sky-400/10 text-green-600 dark:text-sky-300' : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300'
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
                        onChange={e => set('typography.base_size', Number(e.target.value))} className="w-full accent-green-400" />
                    </div>
                    <div>
                      <label className="text-sm text-slate-700 dark:text-slate-300 flex justify-between mb-1">
                        <span>Heading size</span><span className="text-slate-500 dark:text-slate-500">{design.typography.heading_size}px</span>
                      </label>
                      <input type="range" min="18" max="36" value={design.typography.heading_size}
                        onChange={e => set('typography.heading_size', Number(e.target.value))} className="w-full accent-green-400" />
                    </div>
                    <div>
                      <label className="text-sm text-slate-700 dark:text-slate-300 flex justify-between mb-1">
                        <span>Heading weight</span><span className="text-slate-500 dark:text-slate-500">{design.typography.weight_heading}</span>
                      </label>
                      <input type="range" min="400" max="800" step="100" value={design.typography.weight_heading}
                        onChange={e => set('typography.weight_heading', Number(e.target.value))} className="w-full accent-green-400" />
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
                        onChange={e => set('layout.card_width', Number(e.target.value))} className="w-full accent-green-400" />
                    </div>
                    <div>
                      <label className="text-sm text-slate-700 dark:text-slate-300 flex justify-between mb-1">
                        <span>Corner radius</span><span className="text-slate-500 dark:text-slate-500">{design.layout.corner_radius}px</span>
                      </label>
                      <input type="range" min="0" max="40" value={design.layout.corner_radius}
                        onChange={e => set('layout.corner_radius', Number(e.target.value))} className="w-full accent-green-400" />
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
                      <input className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-sm focus:outline-none focus:border-green-400"
                        placeholder="Need help?"
                        value={design.footer.support_label} onChange={e => set('footer.support_label', e.target.value)} />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 block">Support Phone</label>
                      <input className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-sm focus:outline-none focus:border-green-400"
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
                    <SectionOrder
                      order={normalizeOrder(design.layout.section_order)}
                      features={design.features}
                      onChange={(next) => set('layout.section_order', next)}
                    />
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

                {tab === 'broadcast' && (
                  <div className="space-y-5 max-w-md">
                    <div>
                      <h3 className="text-sm font-semibold mb-1 text-slate-700 dark:text-slate-300">Broadcast Message</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-500">
                        Shows a notice at the top of the hotspot page, for example "Internet is slow, we're fixing network issues".
                        It is independent of Save Design and Publish: once saved it appears on every router's page within about a minute, and removing it works the same way.
                        Routers published before this feature need one republish to pick it up.
                      </p>
                    </div>

                    <div className="rounded-xl border border-slate-200 dark:border-slate-800 px-4 py-3 text-sm">
                      {broadcastSaved.enabled ? (
                        <p><span className="font-semibold">Live now</span> on all hotspot pages ({BROADCAST_LEVELS[broadcastSaved.level].label}).</p>
                      ) : (
                        <p className="text-slate-500 dark:text-slate-400">No broadcast is showing to customers.</p>
                      )}
                    </div>

                    <div>
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 block">Message</label>
                      <textarea rows={4} maxLength={BROADCAST_MAX}
                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-sm focus:outline-none focus:border-sky-400 resize-none"
                        placeholder="e.g. Internet may be slow right now. We are fixing network issues."
                        value={broadcastDraft.message}
                        onChange={e => setBroadcastDraft(prev => ({ ...prev, message: e.target.value }))} />
                      <p className="text-xs text-slate-500 dark:text-slate-500 mt-1 text-right">
                        {broadcastDraft.message.length}/{BROADCAST_MAX}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-500 mb-2">Quick messages</p>
                      <div className="flex flex-wrap gap-2">
                        {BROADCAST_TEMPLATES.map(t => (
                          <button key={t.label} type="button"
                            onClick={() => setBroadcastDraft(prev => ({ ...prev, message: t.message, level: t.level }))}
                            className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-xs font-medium hover:border-slate-300 dark:hover:border-slate-700">
                            {t.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Style</p>
                      <div className="grid grid-cols-3 gap-2">
                        {Object.entries(BROADCAST_LEVELS).map(([key, l]) => (
                          <button key={key} type="button"
                            onClick={() => setBroadcastDraft(prev => ({ ...prev, level: key }))}
                            className={`p-3 rounded-xl border text-left transition-colors ${
                              broadcastDraft.level === key
                                ? 'border-green-400 bg-sky-50 dark:bg-sky-400/10'
                                : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                            }`}>
                            <p className="text-sm font-semibold">{l.label}</p>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{l.hint}</p>
                          </button>
                        ))}
                      </div>
                    </div>

                    <ToggleRow label="Show broadcast to customers"
                      description="The preview on the right always shows your draft; this controls what customers see once saved"
                      checked={broadcastDraft.enabled}
                      onChange={v => setBroadcastDraft(prev => ({ ...prev, enabled: v }))} />

                    <div className="flex flex-wrap gap-2 pt-1">
                      <button onClick={() => saveBroadcast()} disabled={broadcastSaving || !broadcastDirty}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-green-100 dark:bg-green-800 hover:bg-green-200 dark:hover:bg-green-700 transition-colors disabled:opacity-50">
                        {broadcastSaving ? <RefreshCw size={15} className="animate-spin" /> : <Save size={15} />}
                        {broadcastSaving ? 'Saving…' : broadcastDraft.enabled ? 'Save & go live' : 'Save'}
                      </button>
                      {broadcastSaved.enabled && (
                        <button onClick={removeBroadcast} disabled={broadcastSaving}
                          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-colors disabled:opacity-50">
                          <Trash2 size={15} /> Remove from hotspot pages
                        </button>
                      )}
                      {broadcastDraft.message && (
                        <button type="button" onClick={() => setBroadcastDraft(prev => ({ ...prev, message: '', enabled: false }))}
                          className="px-3 py-2.5 text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 underline">
                          Clear text
                        </button>
                      )}
                    </div>
                    {broadcastDirty && (
                      <p className="text-xs text-amber-600 dark:text-amber-400/90">You have unsaved broadcast changes. Customers won't see them until you save.</p>
                    )}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Live preview */}
          <div className="p-6 bg-slate-50 dark:bg-slate-900/40 sticky top-[73px] h-[calc(100vh-73px)] flex flex-col">
            <div className="flex items-center justify-between gap-2 mb-3">
              <DeviceToggle device={device} onChange={setDevice} />
              <button onClick={() => setFullscreen(true)} title="Fullscreen preview"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-medium text-slate-600 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700">
                <Maximize2 size={13} /> Fullscreen
              </button>
            </div>

            <div className="flex items-center gap-2 mb-3">
              <select value={previewSource} onChange={e => setPreviewSource(e.target.value)}
                className="flex-1 min-w-0 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-2 text-xs">
                <option value="draft">Current draft (what you're editing)</option>
                {routers.map(r => {
                  const info = publishedMap[String(r.id)];
                  return (
                    <option key={r.id} value={String(r.id)}>
                      On router: {r.name}{info?.published ? '' : ' — nothing published'}
                    </option>
                  );
                })}
              </select>
              {activeLoading && <RefreshCw size={12} className="animate-spin shrink-0 text-slate-500" />}
            </div>
            {sidebarShowsRouter && (
              <p className="text-[11px] text-slate-500 dark:text-slate-500 mb-2">
                Showing the design last published to this router
                {publishedMap[previewSource]?.published_at ? ` (${formatDate(publishedMap[previewSource].published_at)})` : ''}.
              </p>
            )}

            <div className="flex-1 min-h-0">
              <PreviewFrame html={activeHtml} device={device} loading={activeLoading} />
            </div>

            <p className="text-[11px] text-slate-500 dark:text-slate-500 mt-3 text-center">
              Same page that gets published to your router. A "Preview" badge keeps ad views here from being counted.
            </p>
          </div>
        </div>
      </div>

      {/* Fullscreen preview */}
      <AnimatePresence>
        {fullscreen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col bg-black/70 backdrop-blur-sm p-4 md:p-6">
            <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
              <div className="flex items-center gap-3">
                <h3 className="font-bold text-white text-sm">
                  {sidebarShowsRouter
                    ? `On router: ${routers.find(r => String(r.id) === String(previewSource))?.name || ''}`
                    : 'Current draft'}
                </h3>
                <DeviceToggle device={device} onChange={setDevice} />
              </div>
              <button onClick={() => setFullscreen(false)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-medium">
                <X size={14} /> Close
              </button>
            </div>
            <div className="flex-1 min-h-0 rounded-2xl bg-slate-100 dark:bg-slate-900 p-4">
              <PreviewFrame html={activeHtml} device={device} loading={activeLoading} fitHeight />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Publish modal */}
      <AnimatePresence>
        {showPublishConfirm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            onClick={() => setShowPublishConfirm(false)}>
            <motion.div initial={{ scale: .95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 max-w-4xl w-full mx-4 max-h-[92vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between gap-3 mb-5 flex-wrap">
                <div className="flex items-center gap-2">
                  <UploadCloud className="text-green-500 dark:text-green-400" size={20} />
                  <h3 className="font-bold text-slate-900 dark:text-slate-100">Publish to Router</h3>
                </div>
                <DeviceToggle device={device} onChange={setDevice} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-6">
                <div>
                  <label className="text-xs text-slate-500 dark:text-slate-400 mb-1.5 block">Target router</label>
                  <select value={selectedRouter} onChange={e => setSelectedRouter(e.target.value)}
                    className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-sm mb-4">
                    {routers.map(r => (
                      <option key={r.id} value={r.id}>
                        {r.name} ({r.ip_address}){publishedMap[String(r.id)]?.published ? '' : ' — nothing published'}
                      </option>
                    ))}
                  </select>

                  <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-3 mb-4 text-xs space-y-1">
                    <p className="font-semibold text-sm">Currently on this router</p>
                    {selectedInfo?.published ? (
                      <>
                        <p className="text-slate-500 dark:text-slate-400">Published {formatDate(selectedInfo.published_at)}</p>
                        <p className="text-slate-500 dark:text-slate-400">
                          {selectedInfo.design?.color_scheme ? `${selectedInfo.design.color_scheme} scheme` : 'Default design'}
                          {selectedInfo.design?.font_family ? ` · ${selectedInfo.design.font_family}` : ''}
                        </p>
                        {selectedInfo.design?.network_name && (
                          <p className="text-slate-500 dark:text-slate-400">Heading: {selectedInfo.design.network_name}</p>
                        )}
                        {selectedInfo.design?.primary && (
                          <div className="flex items-center gap-1.5 pt-1">
                            {[selectedInfo.design.background, selectedInfo.design.primary, selectedInfo.design.secondary].filter(Boolean).map((c, i) => (
                              <span key={i} className="w-4 h-4 rounded-full border border-slate-300 dark:border-slate-700" style={{ background: c }} />
                            ))}
                          </div>
                        )}
                      </>
                    ) : (
                      <p className="text-slate-500 dark:text-slate-400">Nothing has been published to this router from the designer yet.</p>
                    )}
                  </div>

                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-1.5">Preview</p>
                  <div className="grid grid-cols-2 gap-1 p-0.5 rounded-xl border border-slate-200 dark:border-slate-800 mb-4">
                    {[['current', 'On router now'], ['new', 'New (your draft)']].map(([key, label]) => (
                      <button key={key} type="button" onClick={() => setModalView(key)}
                        className={`px-2 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                          modalView === key
                            ? 'bg-slate-100 dark:bg-slate-800 text-green-600 dark:text-green-300'
                            : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                        }`}>
                        {label}
                      </button>
                    ))}
                  </div>

                  <p className="text-xs text-amber-600 dark:text-amber-400/90 mb-5">
                    Your draft is saved first, then this overwrites the existing hotspot login page on this router.
                  </p>
                  <div className="flex gap-2">
                    <button onClick={() => setShowPublishConfirm(false)}
                      className="flex-1 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm font-semibold hover:bg-slate-200 dark:hover:bg-slate-700">
                      Close
                    </button>
                    <button onClick={publishDesign} disabled={publishing}
                      className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white"
                      style={{ background: 'linear-gradient(135deg, #34d399, #059669)' }}>
                      {publishing ? 'Publishing…' : 'Confirm Publish'}
                    </button>
                  </div>
                </div>

                <div className="h-[60vh] rounded-xl bg-slate-50 dark:bg-slate-950/40 p-3">
                  <PreviewFrame html={modalHtml} device={device} loading={modalLoading} fitHeight />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}