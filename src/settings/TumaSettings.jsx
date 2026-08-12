// src/components/settings/TumaSettings.jsx
import { useState, useEffect, useCallback } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Zap, ShieldCheck, Mail, KeyRound, Wifi, Tv, CheckCircle2,
  XCircle, Loader2, ExternalLink, Smartphone, Wallet, ArrowRight
} from 'lucide-react';
import PaymentGatewayOtpGate from '../security/PaymentGatewayOtpGate';

const PAYMENT_FLOW_STEPS = [
  {
    icon: Zap,
    title: 'Tuma Online STK',
    description: "AITech asks Tuma to push an M-Pesa prompt. The customer sees TUMA ONLINE as the merchant name.",
  },
  {
    icon: Smartphone,
    title: 'Subscriber confirms',
    description: 'The subscriber enters their M-Pesa PIN to authorise the payment.',
  },
  {
    icon: Wallet,
    title: 'Tuma settles to you',
    description: "Funds land directly in the account you registered with Tuma (your own Safaricom paybill, or via a Tuma aggregator). AITech never holds the money — we just receive Tuma's IPN to mark the invoice paid.",
  },
];

const HowPaymentsFlow = () => (
  <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 space-y-4">
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
        How payments flow
      </p>
      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
        Tuma collects and settles directly — AITech never touches the money.
      </p>
    </div>

    <div className="grid gap-3 sm:grid-cols-3">
      {PAYMENT_FLOW_STEPS.map((step, i) => {
        const Icon = step.icon;
        return (
          <div key={step.title} className="relative rounded-xl border border-slate-100 dark:border-slate-800 p-3">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 rounded-full bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 shrink-0">
                {i + 1}
              </div>
              <Icon size={14} className="text-slate-400" />
            </div>
            <p className="text-xs font-medium text-slate-900 dark:text-slate-100">{step.title}</p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">{step.description}</p>
            {i < PAYMENT_FLOW_STEPS.length - 1 && (
              <ArrowRight size={12} className="hidden sm:block absolute -right-2.5 top-1/2 -translate-y-1/2 text-slate-300 dark:text-slate-700" />
            )}
          </div>
        );
      })}
    </div>

    <div className="rounded-xl bg-slate-50 dark:bg-slate-800/60 p-3 text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
      <span className="font-medium text-slate-700 dark:text-slate-300">Where to go in Tuma to set this up: </span>
      Log in to your{' '}
      <a href="https://tuma.co.ke" target="_blank" rel="noreferrer" className="text-indigo-500 hover:underline inline-flex items-center gap-0.5">
        Tuma dashboard <ExternalLink size={10} />
      </a>{' '}
      → register or confirm your business (paybill or aggregator payout account) → open <span className="font-medium">API / Developer settings</span> to generate an API key. Paste that key below, add the business email tied to the account, then run "Test connection" to confirm before enabling.
    </div>
  </div>
);

const TumaSettings = () => {
  const [form, setForm] = useState({
    business_email: '', api_key: '', enabled: false,
    use_for_hotspot: false, use_for_tv_plans: false,
  });
  const [apiKeyPresent, setApiKeyPresent] = useState(false);
  const [apiKeyMasked, setApiKeyMasked] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);

  const subdomain = window.location.hostname.split('.')[0];

  const fetchSettings = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/tuma_settings', { headers: { 'X-Subdomain': subdomain } });
      if (res.ok) {
        const data = await res.json();
        setForm((prev) => ({
          ...prev,
          business_email: data.business_email || '',
          enabled: !!data.enabled,
          use_for_hotspot: !!data.use_for_hotspot,
          use_for_tv_plans: !!data.use_for_tv_plans,
        }));
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
        method: 'POST',
        headers: { 'X-Subdomain': subdomain },
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
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
      </div>
    );
  }

  return (
    <PaymentGatewayOtpGate title="Tuma Settings">
    <div className="font-sans p-4 sm:p-6 max-w-2xl">
      <Toaster />

      <div className="flex items-start gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center
         justify-center shrink-0">
          <Zap size={19} className="text-indigo-600 dark:text-indigo-400" />
        </div>
        <div>
          <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">Tuma Payment Gateway</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Bring your own Tuma business account for M-Pesa STK push, settled directly to you
          </p>
        </div>
      </div>

      <div className="mb-5">
        <HowPaymentsFlow />
      </div>

      <form onSubmit={handleSave} className="space-y-5">
        <div className="flex items-center justify-between rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
          <div className="flex items-center gap-3">
            <ShieldCheck size={18} className="text-slate-400" />
            <div>
              <p className="text-sm font-medium text-slate-900 dark:text-slate-100">Enable Tuma integration</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Turn on to use your own Tuma account for payments
              </p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" name="enabled" checked={form.enabled} onChange={handleChange} className="sr-only peer" />
            <div className="w-11 h-6 bg-slate-200 dark:bg-slate-700 rounded-full peer-checked:bg-indigo-600 transition-colors" />
            <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform peer-checked:translate-x-5" />
          </label>
        </div>

        <AnimatePresence initial={false}>
          {form.enabled && (
            <motion.div
              initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }}
              className="overflow-hidden space-y-5"
            >
              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 space-y-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
                  Business credentials
                </p>

                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">Business email</label>
                  <div className="relative">
                    <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="email" name="business_email" value={form.business_email} onChange={handleChange}
                      placeholder="you@yourbusiness.com"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800
                        bg-slate-50 dark:bg-slate-800/60 text-sm text-slate-900 dark:text-slate-100
                        placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">
                    API key {apiKeyPresent && <span className="text-slate-400">— currently set</span>}
                  </label>
                  <div className="relative">
                    <KeyRound size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="password" name="api_key" value={form.api_key} onChange={handleChange}
                      placeholder={apiKeyMasked || 'tuma_xxxxxxxxxxxxxxxx'}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800
                        bg-slate-50 dark:bg-slate-800/60 text-sm text-slate-900 dark:text-slate-100
                        placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    />
                  </div>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1.5">
                    Leave blank to keep your existing key. Get this from your{' '}
                    <a href="https://tuma.co.ke" target="_blank" rel="noreferrer"
                      className="text-indigo-500 hover:underline inline-flex items-center gap-0.5">
                      Tuma dashboard <ExternalLink size={10} />
                    </a>
                  </p>
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
                    ${testResult.success
                      ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400'
                      : 'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400'}`}>
                    {testResult.success ? <CheckCircle2 size={14} className="shrink-0 mt-0.5" /> : <XCircle size={14} className="shrink-0 mt-0.5" />}
                    <span>{testResult.message}</span>
                  </div>
                )}
              </div>

              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 space-y-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">Use Tuma for</p>

                <label className="flex items-start gap-3 p-3 rounded-xl border border-slate-100 dark:border-slate-800 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <input type="checkbox" name="use_for_hotspot" checked={form.use_for_hotspot} onChange={handleChange} className="mt-0.5 accent-indigo-600" />
                  <div className="flex items-center gap-2">
                    <Wifi size={15} className="text-slate-400" />
                    <div>
                      <p className="text-sm font-medium text-slate-900 dark:text-slate-100">Hotspot voucher payments</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">STK push for hotspot internet purchases</p>
                    </div>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3 rounded-xl border border-slate-100 dark:border-slate-800 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <input type="checkbox" name="use_for_tv_plans" checked={form.use_for_tv_plans} onChange={handleChange} className="mt-0.5 accent-indigo-600" />
                  <div className="flex items-center gap-2">
                    <Tv size={15} className="text-slate-400" />
                    <div>
                      <p className="text-sm font-medium text-slate-900 dark:text-slate-100">TV plan / device bindings</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">STK push for MAC-bypass TV plan purchases</p>
                    </div>
                  </div>
                </label>
              </div>
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
    </div>
    </PaymentGatewayOtpGate>
  );
};

export default TumaSettings;