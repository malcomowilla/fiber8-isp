// src/components/settings/PaymentGatewaySettings.jsx
import { useState, useEffect, useCallback, useMemo } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Zap, ShieldCheck, Mail, KeyRound, Wifi, Tv, CheckCircle2,
  XCircle, Loader2, ExternalLink, Smartphone, Wallet, ArrowRight,
  CreditCard, Plus, X, Globe, Business, Lock
} from 'lucide-react';
import PaymentGatewayOtpGate from '../security/PaymentGatewayOtpGate';

// ═══════════════════════════════════════════════════════════════
// GATEWAY REGISTRY — add a new gateway here and it shows up
// everywhere: the picker, the active-gateway selects, etc.
// ═══════════════════════════════════════════════════════════════
const GATEWAYS = [
  { id: 'mpesa',    name: 'M-Pesa',    icon: Smartphone, description: 'Direct Daraja STK push' },
  { id: 'tuma',     name: 'Tuma',      icon: Zap,         description: 'M-Pesa STK via Tuma, settles to you' },
  { id: 'paystack', name: 'Paystack',  icon: CreditCard,  description: 'Cards, mobile money & bank transfer' },
  { id: 'sasapay',  name: 'SasaPay',   icon: Wallet,      description: 'M-Pesa & bank payments via SasaPay' },
];

const USE_CASES = [
  { id: 'hotspot',  label: 'Hotspot voucher payments',     icon: Wifi },
  { id: 'tv_plans', label: 'TV plan / device bindings',     icon: Tv },
];

// ═══════════════════════════════════════════════════════════════
// SHARED UI BITS
// ═══════════════════════════════════════════════════════════════
const SectionCard = ({ title, children, className = '' }) => (
  <div className={`rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 space-y-4 ${className}`}>
    {title && (
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
        {title}
      </p>
    )}
    {children}
  </div>
);

const Toggle = ({ checked, onChange, name }) => (
  <label className="relative inline-flex items-center cursor-pointer shrink-0">
    <input type="checkbox" name={name} checked={checked} onChange={onChange} className="sr-only peer" />
    <div className="w-11 h-6 bg-slate-200 dark:bg-slate-700 rounded-full peer-checked:bg-indigo-600 transition-colors" />
    <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform peer-checked:translate-x-5" />
  </label>
);

const inputCls = "w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 " +
  "bg-slate-50 dark:bg-slate-800/60 text-sm text-slate-900 dark:text-slate-100 " +
  "placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400";

// ═══════════════════════════════════════════════════════════════
// ACTIVE GATEWAY SELECTOR
// One choice per use case — selecting a gateway here is what
// `make_payment` should key off, instead of asking each gateway
// "are you enabled AND am I flagged for this use case".
// ═══════════════════════════════════════════════════════════════
const ActiveGatewaySelector = ({ activeGateways, onChange, saving }) => (
  <SectionCard title="Active gateway per use case">
    <p className="text-xs text-slate-500 dark:text-slate-400 -mt-2">
      Exactly one gateway processes payments for each use case below. Switching here is what your backend should check —
      not per-gateway toggles.
    </p>
    <div className="space-y-3">
      {USE_CASES.map(({ id, label, icon: Icon }) => (
        <div key={id} className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 dark:border-slate-800 p-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <Icon size={15} className="text-slate-400 shrink-0" />
            <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">{label}</p>
          </div>
          <select
            value={activeGateways[id] || ''}
            onChange={(e) => onChange(id, e.target.value)}
            disabled={saving}
            className="text-sm font-medium rounded-lg border border-slate-200 dark:border-slate-800
              bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-slate-100 px-3 py-1.5
              focus:outline-none focus:ring-2 focus:ring-indigo-400 disabled:opacity-50"
          >
            <option value="" disabled>Choose gateway…</option>
            {GATEWAYS.map((g) => (
              <option key={g.id} value={g.id}>{g.name}</option>
            ))}
          </select>
        </div>
      ))}
    </div>
  </SectionCard>
);

// ═══════════════════════════════════════════════════════════════
// M-PESA PANEL (wraps your existing hotspot mpesa settings logic)
// ═══════════════════════════════════════════════════════════════
const MpesaPanel = ({ subdomain }) => {
  const [form, setForm] = useState({
    short_code: '', consumer_key: '', consumer_secret: '', passkey: '',
    api_initiator_username: '', api_initiator_password: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchSettings = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/hotspot_mpesa_settings`, {
        headers: { 'Content-Type': 'application/json', 'X-Subdomain': subdomain },
      });
      const data = await res.json();
      if (res.ok && data && !Array.isArray(data)) {
        setForm((prev) => ({ ...prev, ...data }));
      }
    } catch {
      toast.error('Could not load M-Pesa settings');
    } finally {
      setLoading(false);
    }
  }, [subdomain]);

  useEffect(() => { fetchSettings(); }, [fetchSettings]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/hotspot_mpesa_settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Subdomain': subdomain },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success('M-Pesa settings saved');
        setForm((prev) => ({ ...prev, ...data }));
      } else {
        toast.error(data.error || 'Failed to save M-Pesa settings');
      }
    } catch {
      toast.error('Something went wrong. Please try again');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center py-10"><Loader2 className="w-6 h-6 animate-spin text-slate-400" /></div>;
  }

  return (
    <form onSubmit={handleSave} className="space-y-5">
      <SectionCard title="Daraja credentials">
        {[
          ['short_code', 'Short code', Business],
          ['api_initiator_username', 'API initiator username', KeyRound],
          ['consumer_key', 'Consumer key', KeyRound],
          ['consumer_secret', 'Consumer secret', Lock],
          ['passkey', 'Pass key', KeyRound],
          ['api_initiator_password', 'API initiator password', Lock],
        ].map(([name, label, Icon]) => (
          <div key={name}>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">{label}</label>
            <div className="relative">
              <Icon size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type={name.includes('secret') || name.includes('password') || name === 'passkey' ? 'password' : 'text'}
                name={name} value={form[name] || ''} onChange={handleChange}
                className={inputCls}
              />
            </div>
          </div>
        ))}
      </SectionCard>

      <button
        type="submit" disabled={saving}
        className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700
          disabled:opacity-60 text-white text-sm font-semibold transition-colors"
      >
        {saving ? 'Saving…' : 'Save M-Pesa settings'}
      </button>
    </form>
  );
};

// ═══════════════════════════════════════════════════════════════
// TUMA PANEL (your existing TumaSettings, minus the use_for_*
// checkboxes — that choice now lives in ActiveGatewaySelector)
// ═══════════════════════════════════════════════════════════════
const TumaPanel = ({ subdomain }) => {
  const [form, setForm] = useState({ business_email: '', api_key: '', enabled: false });
  const [apiKeyPresent, setApiKeyPresent] = useState(false);
  const [apiKeyMasked, setApiKeyMasked] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);

  const fetchSettings = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/tuma_settings', { headers: { 'X-Subdomain': subdomain } });
      if (res.ok) {
        const data = await res.json();
        setForm((prev) => ({ ...prev, business_email: data.business_email || '', enabled: !!data.enabled }));
        setApiKeyPresent(!!data.api_key_present);
        setApiKeyMasked(data.api_key_masked);
      }
    } catch {
      toast.error('Could not load Tuma settings');
    } finally {
      setLoading(false);
    }
  }, [subdomain]);

  useEffect(() => { fetchSettings(); }, [fetchSettings]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setTestResult(null);
    try {
      const payload = { ...form };
      if (!payload.api_key) delete payload.api_key;
      const res = await fetch('/api/tuma_settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'X-Subdomain': subdomain },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success('Tuma settings saved');
        setApiKeyPresent(!!data.api_key_present);
        setApiKeyMasked(data.api_key_masked);
        setForm((prev) => ({ ...prev, api_key: '' }));
      } else {
        toast.error(data.errors?.[0] || 'Could not save settings');
      }
    } catch {
      toast.error('Something went wrong. Please try again');
    } finally {
      setSaving(false);
    }
  };

  const handleTestConnection = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      const res = await fetch('/api/tuma_settings/test_connection', {
        method: 'POST', headers: { 'X-Subdomain': subdomain },
      });
      const data = await res.json();
      setTestResult(data);
      data.success ? toast.success('Connected to Tuma') : toast.error(data.message || 'Connection failed');
    } catch {
      setTestResult({ success: false, message: 'Network error while testing connection' });
    } finally {
      setTesting(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center py-10"><Loader2 className="w-6 h-6 animate-spin text-slate-400" /></div>;
  }

  return (
    <form onSubmit={handleSave} className="space-y-5">
      <div className="flex items-center justify-between rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
        <div className="flex items-center gap-3">
          <ShieldCheck size={18} className="text-slate-400" />
          <div>
            <p className="text-sm font-medium text-slate-900 dark:text-slate-100">Enable Tuma integration</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Turn on to use your own Tuma account</p>
          </div>
        </div>
        <Toggle checked={form.enabled} onChange={handleChange} name="enabled" />
      </div>

      <AnimatePresence initial={false}>
        {form.enabled && (
          <motion.div
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }}
            className="overflow-hidden space-y-5"
          >
            <SectionCard title="Business credentials">
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">Business email</label>
                <div className="relative">
                  <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input type="email" name="business_email" value={form.business_email} onChange={handleChange}
                    placeholder="you@yourbusiness.com" className={inputCls} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">
                  API key {apiKeyPresent && <span className="text-slate-400">— currently set</span>}
                </label>
                <div className="relative">
                  <KeyRound size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input type="password" name="api_key" value={form.api_key} onChange={handleChange}
                    placeholder={apiKeyMasked || 'tuma_xxxxxxxxxxxxxxxx'} className={inputCls} />
                </div>
              </div>
              <button
                type="button" onClick={handleTestConnection} disabled={testing || !apiKeyPresent}
                className="flex items-center gap-2 text-xs font-semibold px-3.5 py-2 rounded-lg
                  bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300
                  hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-50 transition-colors"
              >
                {testing ? <Loader2 size={13} className="animate-spin" /> : <ShieldCheck size={13} />}
                {testing ? 'Testing…' : 'Test connection'}
              </button>
              {testResult && (
                <div className={`flex items-start gap-2 rounded-xl p-3 text-xs
                  ${testResult.success ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400'
                                       : 'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400'}`}>
                  {testResult.success ? <CheckCircle2 size={14} className="shrink-0 mt-0.5" /> : <XCircle size={14} className="shrink-0 mt-0.5" />}
                  <span>{testResult.message}</span>
                </div>
              )}
            </SectionCard>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        type="submit" disabled={saving}
        className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700
          disabled:opacity-60 text-white text-sm font-semibold transition-colors"
      >
        {saving ? 'Saving…' : 'Save Tuma settings'}
      </button>
    </form>
  );
};

// ═══════════════════════════════════════════════════════════════
// PAYSTACK PANEL — frontend only for now, per your instruction.
// Backend wiring (settings table + controller) comes when you say go.
// ═══════════════════════════════════════════════════════════════
const PaystackPanel = () => {
  const [form, setForm] = useState({ enabled: false, live_secret_key: '', live_public_key: '' });
  const [ipList, setIpList] = useState([]);
  const [ipInput, setIpInput] = useState('');
  const [ipError, setIpError] = useState('');
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const isValidIp = (ip) =>
    /^(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}$/.test(ip.trim());

  const addIp = () => {
    const ip = ipInput.trim();
    if (!ip) return;
    if (!isValidIp(ip)) return setIpError('Enter a valid IPv4 address');
    if (ipList.includes(ip)) return setIpError('That IP is already whitelisted');
    setIpList((prev) => [...prev, ip]);
    setIpInput('');
    setIpError('');
  };

  const removeIp = (ip) => setIpList((prev) => prev.filter((i) => i !== ip));

  const handleSave = (e) => {
    e.preventDefault();
    // Frontend-only for now — no backend endpoint yet.
    // Wire this up to POST /api/paystack_settings once the backend lands.
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      toast.success('Paystack settings saved locally (backend wiring coming soon)', {
        duration: 3000, position: 'top-center',
      });
    }, 400);
  };

  return (
    <form onSubmit={handleSave} className="space-y-5">
      <SectionCard title="Where to get these">
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          Log in to your{' '}
          <a href="https://dashboard.paystack.com" target="_blank" rel="noreferrer"
            className="text-indigo-500 hover:underline inline-flex items-center gap-0.5">
            Paystack dashboard <ExternalLink size={10} />
          </a>{' '}
          → Settings → API Keys &amp; Webhooks to copy your live keys, and Settings → Preferences → IP Whitelisting
          to see/add the IPs Paystack should accept requests from.
        </p>
      </SectionCard>

      <div className="flex items-center justify-between rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
        <div className="flex items-center gap-3">
          <ShieldCheck size={18} className="text-slate-400" />
          <div>
            <p className="text-sm font-medium text-slate-900 dark:text-slate-100">Enable Paystack integration</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Cards, mobile money & bank transfer via Paystack</p>
          </div>
        </div>
        <Toggle checked={form.enabled} onChange={handleChange} name="enabled" />
      </div>

      <AnimatePresence initial={false}>
        {form.enabled && (
          <motion.div
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }}
            className="overflow-hidden space-y-5"
          >
            <SectionCard title="Live API keys">
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">Live Public Key</label>
                <div className="relative">
                  <Globe size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text" name="live_public_key" value={form.live_public_key} onChange={handleChange}
                    placeholder="Enter your live pulic key"
                    className={inputCls}
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">Live Secret Key</label>
                <div className="relative">
                  <KeyRound size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="password" name="live_secret_key" value={form.live_secret_key} onChange={handleChange}
                    placeholder="Enter your live secret key"
                    className={inputCls}
                  />
                </div>
                <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1.5">
                  Never shown again after saving — stored encrypted server-side once the backend is wired up.
                </p>
              </div>
            </SectionCard>

            <SectionCard title="IP whitelist">
              <p className="text-xs text-slate-500 dark:text-slate-400 -mt-2">
                Server IPs Paystack should trust for this account. Should match what's configured in your Paystack dashboard.
              </p>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Globe size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text" value={ipInput}
                    onChange={(e) => { setIpInput(e.target.value); setIpError(''); }}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addIp(); } }}
                    placeholder="e.g. 41.90.64.12"
                    className={inputCls}
                  />
                </div>
                <button
                  type="button" onClick={addIp}
                  className="flex items-center gap-1.5 px-4 rounded-xl bg-slate-100 dark:bg-slate-800
                    text-slate-700 dark:text-slate-300 text-sm font-semibold
                    hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors shrink-0"
                >
                  <Plus size={14} /> Add
                </button>
              </div>
              {ipError && <p className="text-xs text-red-500">{ipError}</p>}

              {ipList.length > 0 ? (
                <div className="flex flex-wrap gap-2 pt-1">
                  {ipList.map((ip) => (
                    <span
                      key={ip}
                      className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 dark:bg-slate-800
                        text-slate-700 dark:text-slate-300 text-xs font-mono px-3 py-1.5"
                    >
                      {ip}
                      <button type="button" onClick={() => removeIp(ip)} className="hover:text-red-500 transition-colors">
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 dark:text-slate-600 italic">No IPs added — all IPs allowed by default</p>
              )}
            </SectionCard>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        type="submit" disabled={saving}
        className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700
          disabled:opacity-60 text-white text-sm font-semibold transition-colors"
      >
        {saving ? 'Saving…' : 'Save Paystack settings'}
      </button>
    </form>
  );
};

// ═══════════════════════════════════════════════════════════════
// SASAPAY PANEL — moved over from MpesaSettings.jsx, still
// frontend-only per your existing note there.
// ═══════════════════════════════════════════════════════════════
const SasaPayPanel = () => {
  const [form, setForm] = useState({ client_id: '', client_secret: '', merchant_code: '' });
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      toast.success('SasaPay settings saved locally (backend integration coming soon)', {
        duration: 3000, position: 'top-center',
      });
    }, 400);
  };

  return (
    <form onSubmit={handleSave} className="space-y-5">
      <SectionCard title="SasaPay credentials">
        <div>
          <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">Client ID</label>
          <div className="relative">
            <KeyRound size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" name="client_id" value={form.client_id} onChange={handleChange} className={inputCls} />
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">Client Secret</label>
          <div className="relative">
            <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="password" name="client_secret" value={form.client_secret} onChange={handleChange} className={inputCls} />
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">Merchant Code</label>
          <div className="relative">
            <Business size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" name="merchant_code" value={form.merchant_code} onChange={handleChange} className={inputCls} />
          </div>
        </div>
      </SectionCard>

      <button
        type="submit" disabled={saving}
        className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700
          disabled:opacity-60 text-white text-sm font-semibold transition-colors"
      >
        {saving ? 'Saving…' : 'Save SasaPay settings'}
      </button>
    </form>
  );
};

// ═══════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════
const PANELS = { mpesa: MpesaPanel, tuma: TumaPanel, paystack: PaystackPanel, sasapay: SasaPayPanel };

const PaymentGatewaySettings = () => {
  const [configTab, setConfigTab] = useState('mpesa');
  // TODO: once the backend concept exists, fetch this from a single
  // `payment_gateway_settings` endpoint instead of local state.
  const [activeGateways, setActiveGateways] = useState({ hotspot: 'mpesa', tv_plans: '' });
  const subdomain = window.location.hostname.split('.')[0];

  const ActivePanel = useMemo(() => PANELS[configTab], [configTab]);

  const handleActiveGatewayChange = (useCase, gatewayId) => {
    setActiveGateways((prev) => ({ ...prev, [useCase]: gatewayId }));
    // Backend note: this should PATCH the single source of truth
    // (e.g. PATCH /api/payment_gateway_settings { hotspot: gatewayId })
    // so `make_payment`/`check_payment_status` just read one field
    // instead of checking each gateway's own enabled/use_for_* flags.
  };

  return (
    <PaymentGatewayOtpGate title="Payment Gateways">
      <div className="font-sans p-4 sm:p-6 max-w-3xl">
        <Toaster />

        <div className="flex items-start gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center shrink-0">
            <Wallet size={19} className="text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">Payment Gateways</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Configure every payment provider in one place, and choose which one is live for each use case
            </p>
          </div>
        </div>

        <div className="mb-5">
          <ActiveGatewaySelector activeGateways={activeGateways} onChange={handleActiveGatewayChange} saving={false} />
        </div>

        {/* Gateway picker */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-5">
          {GATEWAYS.map(({ id, name, icon: Icon }) => (
            <button
              key={id} type="button" onClick={() => setConfigTab(id)}
              className={`flex flex-col items-center gap-1.5 rounded-xl border p-3 text-xs font-medium transition-all
                ${configTab === id
                  ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 shadow-sm'
                  : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700'}`}
            >
              <Icon size={16} />
              {name}
              {Object.values(activeGateways).includes(id) && (
                <span className="text-[9px] uppercase tracking-wide text-emerald-600 dark:text-emerald-400 font-semibold">active</span>
              )}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={configTab}
            initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
          >
            <ActivePanel subdomain={subdomain} />
          </motion.div>
        </AnimatePresence>
      </div>
    </PaymentGatewayOtpGate>
  );
};

export default PaymentGatewaySettings;