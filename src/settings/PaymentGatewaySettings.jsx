import { useState, useEffect, useCallback } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

import PaymentGatewayOtpGate from '../security/PaymentGatewayOtpGate';
import {
  Zap, ShieldCheck, Mail, KeyRound, CheckCircle2, XCircle, Loader2,
  Smartphone, Wallet, CreditCard, Plus, X, Globe, Building2, Lock, ArrowLeft, AlertCircle,
  Landmark, Store, Trash2, Hash, User,
} from 'lucide-react';

const FONT = "'IBM Plex Mono', ui-monospace, SFMono-Regular, Menlo, monospace";

const GATEWAYS = [
  { id: 'mpesa',    name: 'M-Pesa',   icon: Smartphone, meta: 'KES · Kenya · Paybill or Till',          description: 'Direct Daraja STK push with C2B confirmation.',                         canActivate: true },
  { id: 'payhero',  name: 'PayHero',  icon: Landmark,   meta: 'KES · Kenya · Paybill, Till or Bank',    description: 'No keys needed. Add where you want to receive money and start collecting.', canActivate: true },
  { id: 'tuma',     name: 'Tuma',     icon: Zap,        meta: 'KES · Kenya',                            description: 'M-Pesa STK via Tuma, settles straight to you.',                         canActivate: true },
  { id: 'paystack', name: 'Paystack', icon: CreditCard, meta: 'KES / NGN / GHS · Africa',               description: 'Cards, mobile money and bank transfer through Paystack.',                canActivate: true },
  { id: 'sasapay',  name: 'SasaPay',  icon: Wallet,     meta: 'KES · Kenya',                            description: 'Mobile money and bank collection for Kenyan merchants.',                 canActivate: false },
];

const nameOf = (id) => GATEWAYS.find((g) => g.id === id)?.name || id;

// Bank paybill numbers PayHero collects to. Verify against PayHero's list before shipping.
const BANKS = [
  { name: 'KCB Bank',            paybill: '522522' },
  { name: 'Equity Bank',         paybill: '247247' },
  { name: 'Co-operative Bank',   paybill: '400200' },
  { name: 'NCBA Bank',           paybill: '880100' },
  { name: 'Absa Bank Kenya',     paybill: '303030' },
  { name: 'Stanbic Bank',        paybill: '600100' },
  { name: 'I&M Bank',            paybill: '542542' },
  { name: 'Family Bank',         paybill: '222111' },
  { name: 'Diamond Trust Bank',  paybill: '516600' },
  { name: 'Standard Chartered',  paybill: '329329' },
  { name: 'National Bank',       paybill: '547700' },
  { name: 'HF Group',            paybill: '100400' },
  { name: 'Bank of Africa',      paybill: '972900' },
  { name: 'Prime Bank',          paybill: '982800' },
];
const OTHER_BANK = '__other__';

// ═══════════════════════════════════════════════════════════════
// SHARED UI BITS
// ═══════════════════════════════════════════════════════════════
const SectionCard = ({ title, children, className = '' }) => (
  <div className={`rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 space-y-4 ${className}`}>
    {title && (
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">{title}</p>
    )}
    {children}
  </div>
);

const Toggle = ({ checked, onChange, name }) => (
  <label className="relative inline-flex items-center cursor-pointer shrink-0">
    <input type="checkbox" name={name} checked={checked} onChange={onChange} className="sr-only peer" />
    <div className="w-11 h-6 bg-slate-200 dark:bg-slate-700 rounded-full peer-checked:bg-emerald-600 transition-colors" />
    <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform peer-checked:translate-x-5" />
  </label>
);

const inputCls = "w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 " +
  "bg-slate-50 dark:bg-slate-800/60 text-sm text-slate-900 dark:text-slate-100 " +
  "placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400";

const primaryBtn = "w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 " +
  "disabled:opacity-60 text-white text-sm font-semibold transition-colors";

const Spinner = () => (
  <div className="flex justify-center py-10"><Loader2 className="w-6 h-6 animate-spin text-slate-400" /></div>
);

const TestResult = ({ result }) => result && (
  <div className={`flex items-start gap-2 rounded-xl p-3 text-xs
    ${result.success ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400'
                     : 'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400'}`}>
    {result.success ? <CheckCircle2 size={14} className="shrink-0 mt-0.5" /> : <XCircle size={14} className="shrink-0 mt-0.5" />}
    <span>{result.message}</span>
  </div>
);

const TextField = ({ label, icon: Icon, hint, ...props }) => (
  <div>
    <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">{label}</label>
    <div className="relative">
      <Icon size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
      <input {...props} className={inputCls} />
    </div>
    {hint && <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">{hint}</p>}
  </div>
);

// ═══════════════════════════════════════════════════════════════
// M-PESA PANEL
// ═══════════════════════════════════════════════════════════════
const MpesaPanel = ({ subdomain, onSaved }) => {
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
      const record = Array.isArray(data) ? data[0] : data;
      if (res.ok && record) setForm((prev) => ({ ...prev, ...record }));
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
        onSaved?.();
      } else {
        toast.error(data.error || 'Failed to save M-Pesa settings');
      }
    } catch {
      toast.error('Something went wrong. Please try again');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Spinner />;

  return (
    <form onSubmit={handleSave} className="space-y-5">
      <SectionCard title="Daraja credentials">
        <p className="text-xs text-slate-500 dark:text-slate-400 -mt-2">
          Leave these empty to use the platform's default M-Pesa account.
        </p>
        {[
          ['short_code', 'Short code', Building2],
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
                name={name} value={form[name] || ''} onChange={handleChange} className={inputCls}
              />
            </div>
          </div>
        ))}
      </SectionCard>
      <button type="submit" disabled={saving} className={primaryBtn}>
        {saving ? 'Saving…' : 'Save M-Pesa settings'}
      </button>
    </form>
  );
};

// ═══════════════════════════════════════════════════════════════
// PAYHERO PANEL
// Tenants add payment channels (paybill / till / bank). The backend
// registers each one in the platform's PayHero account.
// ═══════════════════════════════════════════════════════════════
const CHANNEL_TYPES = [
  { id: 'paybill', label: 'Paybill', icon: Building2 },
  { id: 'till',    label: 'Till',    icon: Store },
  { id: 'bank',    label: 'Bank',    icon: Landmark },
];
const EMPTY_FORM = { channel_type: 'paybill', short_code: '', account_number: '', description: '', bank: '' };
const digitsOnly = (v) => String(v || '').replace(/\D/g, '');
const validCode = (v) => {
  const d = digitsOnly(v);
  return d.length >= 4 && d.length <= 10 ? d : null;
};



const DIGITS = /^\d{4,8}$/;

const channelSub = (c) => {
  if (c.channel_type === 'till') return `Till ${c.short_code}`;
  if (c.channel_type === 'bank') return `Account ${c.account_number} · Paybill ${c.short_code}`;
  return `Paybill ${c.short_code} · Account ${c.account_number}`;
};

const PayheroPanel = ({ subdomain, onSaved, isActive }) => {
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState('');
  const [adding, setAdding] = useState(false);
  const [busyId, setBusyId] = useState(null);
  const [confirmId, setConfirmId] = useState(null);

  const headers = { 'Content-Type': 'application/json', 'X-Subdomain': subdomain };

  const fetchChannels = useCallback(async () => {
    try {
      const res = await fetch('/api/payhero_channels', { headers: { 'X-Subdomain': subdomain } });
      const data = await res.json();
      if (res.ok && Array.isArray(data)) setChannels(data);
    } catch {
      toast.error('Could not load payment channels');
    } finally {
      setLoading(false);
    }
  }, [subdomain]);

  useEffect(() => { fetchChannels(); }, [fetchChannels]);

  const setField = (e) => {
    const { name } = e.target;
    let { value } = e.target;
    if (name === 'short_code') value = digitsOnly(value); // paybill/till are digits only
    setForm((prev) => ({ ...prev, [name]: value }));
    setFormError('');
  };

  const pickType = (type) => { setForm({ ...EMPTY_FORM, channel_type: type }); setFormError(''); };

  const isOtherBank = form.bank === OTHER_BANK;
  const selectedBank = BANKS.find((b) => b.name === form.bank);

  const buildPayload = (f) => {
  const type = f.channel_type;
  const account_number = String(f.account_number || '').trim();
  const description = String(f.description || '').trim();
  const code = validCode(f.short_code);
  const otherBank = f.bank === OTHER_BANK;
  const bank = BANKS.find((b) => b.name === f.bank);

  const codeError = (label) =>
    !digitsOnly(f.short_code)
      ? `Enter the ${label.toLowerCase()}`
      : `${label} must be 4 to 10 digits (you entered ${digitsOnly(f.short_code).length})`;

  if (type === 'paybill') {
    if (!code) return { error: codeError('Paybill number') };
    if (!account_number) return { error: 'Enter the account number for this paybill' };
    if (!description) return { error: 'Enter the business name' };
    return { payload: { channel_type: type, short_code: code, account_number, description } };
  }

  if (type === 'till') {
    if (!code) return { error: codeError('Till number') };
    if (!description) return { error: 'Enter the business name' };
    return { payload: { channel_type: type, short_code: code, account_number: '', description } };
  }

  // bank
  if (!f.bank) return { error: 'Choose your bank' };
  if (!account_number) return { error: 'Enter your bank account number' };
  if (otherBank) {
    if (!code) return { error: codeError('Bank paybill number') };
    if (!description) return { error: 'Enter the bank name' };
    return { payload: { channel_type: type, short_code: code, account_number, description } };
  }
  if (!bank) return { error: 'Choose your bank' };
  return { payload: { channel_type: type, short_code: bank.paybill, account_number, description: bank.name } };
};


  const handleAdd = async (e) => {
  e.preventDefault();

  // Read what is actually in the inputs right now. Fall back to state if a field isn't rendered.
  const fd = new FormData(e.currentTarget);
  const pick = (name) => {
    const dom = fd.get(name);
    return dom !== null && String(dom) !== '' ? String(dom) : String(form[name] || '');
  };

  const live = {
    channel_type: form.channel_type,
    bank: pick('bank'),
    short_code: digitsOnly(pick('short_code')),
    account_number: pick('account_number'),
    description: pick('description'),
  };

  const { error, payload } = buildPayload(live);
  if (error) return setFormError(error);

  setAdding(true);
  setFormError('');
  try {
    const res = await fetch('/api/payhero_channels', {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (res.ok) {
      toast.success('Payment channel added');
      setForm((prev) => ({ ...EMPTY_FORM, channel_type: prev.channel_type }));
      await fetchChannels();
      onSaved?.();
    } else {
      setFormError(data.error || 'Could not add this channel');
    }
  } catch {
    setFormError('Something went wrong. Please try again');
  } finally {
    setAdding(false);
  }
};
  const makeDefault = async (id) => {
    setBusyId(id);
    try {
      const res = await fetch(`/api/payhero_channels/${id}/set_default`, { method: 'PATCH', headers });
      if (!res.ok) throw new Error();
      toast.success('Default channel updated');
      await fetchChannels();
    } catch {
      toast.error('Could not update default channel');
    } finally {
      setBusyId(null);
    }
  };

  const removeChannel = async (id) => {
    setBusyId(id);
    try {
      const res = await fetch(`/api/payhero_channels/${id}`, { method: 'DELETE', headers });
      if (!res.ok) throw new Error();
      toast.success('Channel removed');
      setConfirmId(null);
      await fetchChannels();
      onSaved?.();
    } catch {
      toast.error('Could not remove channel');
    } finally {
      setBusyId(null);
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="space-y-5">
      <SectionCard title="Your payment channels">
        {channels.length === 0 ? (
          <p className="text-xs text-slate-500 dark:text-slate-400">
            No channels yet. Add the paybill, till or bank account where you want customer payments to land.
          </p>
        ) : (
          <div className="space-y-2.5">
            {channels.map((c) => {
              const Icon = (CHANNEL_TYPES.find((t) => t.id === c.channel_type) || CHANNEL_TYPES[0]).icon;
              const lastOne = channels.length === 1;
              return (
                <div key={c.id} className={`flex flex-wrap items-center gap-3 rounded-xl border p-3
                  ${c.is_default ? 'border-emerald-500/60 bg-emerald-50/50 dark:bg-emerald-500/5' : 'border-slate-100 dark:border-slate-800'}`}>
                  <div className="w-9 h-9 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                    <Icon size={16} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">{c.description}</p>
                      {c.is_default && (
                        <span className="text-[9px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400 shrink-0">
                          Receiving
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{channelSub(c)}</p>
                  </div>

                  {confirmId === c.id ? (
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button type="button" onClick={() => setConfirmId(null)} disabled={busyId === c.id}
                        className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                        Keep
                      </button>
                      <button type="button" onClick={() => removeChannel(c.id)} disabled={busyId === c.id}
                        className="px-2.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-[11px] font-semibold flex items-center gap-1">
                        {busyId === c.id && <Loader2 size={11} className="animate-spin" />} Remove
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 shrink-0">
                      {!c.is_default && (
                        <button type="button" onClick={() => makeDefault(c.id)} disabled={busyId === c.id}
                          className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-[11px] font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50">
                          {busyId === c.id ? <Loader2 size={11} className="animate-spin" /> : 'Receive here'}
                        </button>
                      )}
                      <button type="button" onClick={() => setConfirmId(c.id)} aria-label="Remove channel"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  )}

                  {confirmId === c.id && isActive && lastOne && (
                    <p className="basis-full text-[11px] text-red-500">
                      This is your only channel. Removing it stops PayHero payments until you add another.
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}
        {channels.length > 1 && (
          <p className="text-[11px] text-slate-400 dark:text-slate-500">
            Customer payments go to the channel marked <b>Receiving</b>.
          </p>
        )}
      </SectionCard>

      <form onSubmit={handleAdd} autoComplete="off">
        <SectionCard title="Add a payment channel">
          <div className="grid grid-cols-3 gap-2">
            {CHANNEL_TYPES.map(({ id, label, icon: Icon }) => (
              <button key={id} type="button" onClick={() => pickType(id)}
                className={`flex items-center justify-center gap-1.5 rounded-xl border py-2.5 text-xs font-semibold transition-all
                  ${form.channel_type === id
                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700'}`}>
                <Icon size={14} /> {label}
              </button>
            ))}
          </div>

          {form.channel_type === 'paybill' && (
            <>
              <TextField label="Paybill number" icon={Hash} name="short_code" value={form.short_code} onChange={setField}
                inputMode="numeric" autoComplete="off" placeholder="e.g. 4007893" />
              <TextField label="Account number" icon={KeyRound} name="account_number" value={form.account_number} onChange={setField}
                autoComplete="off" placeholder="Account customers pay to" />
              <TextField label="Business name" icon={User} name="description" value={form.description} onChange={setField}
                autoComplete="off" placeholder="Name on this paybill" />
            </>
          )}

          {form.channel_type === 'till' && (
            <>
              <TextField label="Till number" icon={Hash} name="short_code" value={form.short_code} onChange={setField}
                inputMode="numeric" autoComplete="off" placeholder="e.g. 5012345" />
              <TextField label="Business name" icon={User} name="description" value={form.description} onChange={setField}
                autoComplete="off" placeholder="Name on this till" />
            </>
          )}

          {form.channel_type === 'bank' && (
            <>
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">Bank</label>
                <div className="relative">
                  <Landmark size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <select name="bank" value={form.bank} onChange={setField} className={inputCls}>
                    <option value="" disabled>Choose your bank…</option>
                    {BANKS.map((b) => <option key={b.name} value={b.name}>{b.name}</option>)}
                    <option value={OTHER_BANK}>Other bank (enter paybill)</option>
                  </select>
                </div>
              </div>
              {isOtherBank && (
                <>
                  <TextField label="Bank name" icon={User} name="description" value={form.description} onChange={setField}
                    autoComplete="off" placeholder="e.g. Sidian Bank" />
                  <TextField label="Bank paybill number" icon={Hash} name="short_code" value={form.short_code} onChange={setField}
                    inputMode="numeric" autoComplete="off" placeholder="The bank's paybill" />
                </>
              )}
              <TextField label="Your account number" icon={KeyRound} name="account_number" value={form.account_number} onChange={setField}
                autoComplete="off" placeholder="Where the money should land" />
            </>
          )}

          {formError && <p className="text-xs text-red-500">{formError}</p>}

          <button type="submit" disabled={adding} className={`${primaryBtn} flex items-center justify-center gap-2`}>
            {adding ? <><Loader2 size={14} className="animate-spin" /> Registering…</> : <><Plus size={14} /> Add channel</>}
          </button>
        </SectionCard>
      </form>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// TUMA PANEL
// ═══════════════════════════════════════════════════════════════
const TumaPanel = ({ subdomain, onSaved }) => {
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
        onSaved?.();
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

  if (loading) return <Spinner />;

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
              <TestResult result={testResult} />
            </SectionCard>
          </motion.div>
        )}
      </AnimatePresence>

      <button type="submit" disabled={saving} className={primaryBtn}>
        {saving ? 'Saving…' : 'Save Tuma settings'}
      </button>
    </form>
  );
};

// ═══════════════════════════════════════════════════════════════
// PAYSTACK PANEL
// ═══════════════════════════════════════════════════════════════
const PaystackPanel = ({ subdomain, onSaved }) => {
  const [form, setForm] = useState({ enabled: false, secret_key: '', public_key: '' });
  const [secretPresent, setSecretPresent] = useState(false);
  const [secretMasked, setSecretMasked] = useState(null);
  const [ipList, setIpList] = useState([]);
  const [ipInput, setIpInput] = useState('');
  const [ipError, setIpError] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);

  const fetchSettings = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/paystack_settings', { headers: { 'X-Subdomain': subdomain } });
      if (res.ok) {
        const data = await res.json();
        setForm((prev) => ({ ...prev, enabled: !!data.enabled, public_key: data.public_key || '' }));
        setSecretPresent(!!data.secret_key_present);
        setSecretMasked(data.secret_key_masked);
        setIpList(data.ip_whitelist || []);
      }
    } catch {
      toast.error('Could not load Paystack settings');
    } finally {
      setLoading(false);
    }
  }, [subdomain]);

  useEffect(() => { fetchSettings(); }, [fetchSettings]);

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

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setTestResult(null);
    try {
      const payload = { ...form, ip_whitelist: ipList };
      if (!payload.secret_key) delete payload.secret_key;
      const res = await fetch('/api/paystack_settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'X-Subdomain': subdomain },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success('Paystack settings saved');
        setSecretPresent(!!data.secret_key_present);
        setSecretMasked(data.secret_key_masked);
        setForm((prev) => ({ ...prev, secret_key: '' }));
        onSaved?.();
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
      const res = await fetch('/api/paystack_settings/test_connection', {
        method: 'POST', headers: { 'X-Subdomain': subdomain },
      });
      const data = await res.json();
      setTestResult(data);
      data.success ? toast.success('Connected to Paystack') : toast.error(data.message || 'Connection failed');
    } catch {
      setTestResult({ success: false, message: 'Network error while testing connection' });
    } finally {
      setTesting(false);
    }
  };

  if (loading) return <Spinner />;

  return (
    <form onSubmit={handleSave} className="space-y-5">
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
                  <input type="text" name="public_key" value={form.public_key} onChange={handleChange}
                    placeholder="pk_live_..." className={inputCls} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">
                  Live Secret Key {secretPresent && <span className="text-slate-400">— currently set</span>}
                </label>
                <div className="relative">
                  <KeyRound size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input type="password" name="secret_key" value={form.secret_key} onChange={handleChange}
                    placeholder={secretMasked || 'sk_live_...'} className={inputCls} />
                </div>
              </div>
              <button
                type="button" onClick={handleTestConnection} disabled={testing || !secretPresent}
                className="flex items-center gap-2 text-xs font-semibold px-3.5 py-2 rounded-lg
                  bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300
                  hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-50 transition-colors"
              >
                {testing ? <Loader2 size={13} className="animate-spin" /> : <ShieldCheck size={13} />}
                {testing ? 'Testing…' : 'Test connection'}
              </button>
              <TestResult result={testResult} />
            </SectionCard>

            <SectionCard title="IP whitelist">
              <p className="text-xs text-slate-500 dark:text-slate-400 -mt-2">Server IPs Paystack should trust for this account.</p>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Globe size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text" value={ipInput}
                    onChange={(e) => { setIpInput(e.target.value); setIpError(''); }}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addIp(); } }}
                    placeholder="e.g. 41.90.64.12" className={inputCls}
                  />
                </div>
                <button type="button" onClick={addIp}
                  className="flex items-center gap-1.5 px-4 rounded-xl bg-slate-100 dark:bg-slate-800
                    text-slate-700 dark:text-slate-300 text-sm font-semibold
                    hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors shrink-0">
                  <Plus size={14} /> Add
                </button>
              </div>
              {ipError && <p className="text-xs text-red-500">{ipError}</p>}
              {ipList.length > 0 ? (
                <div className="flex flex-wrap gap-2 pt-1">
                  {ipList.map((ip) => (
                    <span key={ip} className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 dark:bg-slate-800
                      text-slate-700 dark:text-slate-300 text-xs px-3 py-1.5">
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

      <button type="submit" disabled={saving} className={primaryBtn}>
        {saving ? 'Saving…' : 'Save Paystack settings'}
      </button>
    </form>
  );
};

// ═══════════════════════════════════════════════════════════════
// SASAPAY PANEL — frontend only (backend pending)
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
        {[
          ['client_id', 'Client ID', 'text', KeyRound],
          ['client_secret', 'Client Secret', 'password', Lock],
          ['merchant_code', 'Merchant Code', 'text', Building2],
        ].map(([name, label, type, Icon]) => (
          <div key={name}>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">{label}</label>
            <div className="relative">
              <Icon size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type={type} name={name} value={form[name]} onChange={handleChange} className={inputCls} />
            </div>
          </div>
        ))}
      </SectionCard>
      <button type="submit" disabled={saving} className={primaryBtn}>
        {saving ? 'Saving…' : 'Save SasaPay settings'}
      </button>
    </form>
  );
};

const PANELS = { mpesa: MpesaPanel, payhero: PayheroPanel, tuma: TumaPanel, paystack: PaystackPanel, sasapay: SasaPayPanel };

// ═══════════════════════════════════════════════════════════════
// STATUS BADGE + GATEWAY CARD
// One primary action per card:
//   active          -> "Collecting payments" (+ Manage)
//   ready           -> "Start collecting"    (+ Manage)
//   not ready       -> "Set up"
// ═══════════════════════════════════════════════════════════════
const Badge = ({ tone, children }) => {
  const tones = {
    active: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400',
    ready:  'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300',
    off:    'bg-slate-50 text-slate-400 dark:bg-slate-800/60 dark:text-slate-500',
  };
  return (
    <span className={`text-[10px] font-semibold uppercase tracking-wide px-2 py-1 rounded-full whitespace-nowrap ${tones[tone]}`}>
      {children}
    </span>
  );
};

const ghostBtn = "px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 " +
  "text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors";

const GatewayCard = ({ gateway, isActive, ready, onStart, onManage }) => {
  const { id, name, icon: Icon, meta, description, canActivate } = gateway;

  let badge = <Badge tone="off">Not set up</Badge>;
  if (isActive) badge = <Badge tone="active">Active</Badge>;
  else if (!canActivate) badge = <Badge tone="off">Coming soon</Badge>;
  else if (ready) badge = <Badge tone="ready">Ready</Badge>;

  return (
    <div
      className={`flex flex-col rounded-2xl border bg-white dark:bg-slate-900 p-4 transition-all
        ${isActive
          ? 'border-emerald-500 ring-2 ring-emerald-500/20 shadow-sm'
          : 'border-slate-200 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-700'}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0
          ${isActive ? 'bg-emerald-600 text-white' : 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'}`}>
          <Icon size={18} />
        </div>
        {badge}
      </div>

      <h3 className="mt-3 text-sm font-semibold text-slate-900 dark:text-slate-100">{name}</h3>
      <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">{meta}</p>
      <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 flex-1 leading-relaxed">{description}</p>

      <div className="flex gap-2 mt-4">
        {isActive ? (
          <>
            <div className="flex-1 py-2 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-xs font-semibold flex items-center justify-center gap-1.5">
              <CheckCircle2 size={13} /> Collecting payments
            </div>
            <button type="button" onClick={() => onManage(id)} className={ghostBtn}>Manage</button>
          </>
        ) : canActivate && ready ? (
          <>
            <button type="button" onClick={() => onStart(id)}
              className="flex-1 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors">
              Start collecting
            </button>
            <button type="button" onClick={() => onManage(id)} className={ghostBtn}>Manage</button>
          </>
        ) : (
          <button type="button" onClick={() => onManage(id)}
            className="flex-1 py-2 rounded-lg border border-emerald-600 text-emerald-700 dark:text-emerald-400 dark:border-emerald-500
              hover:bg-emerald-50 dark:hover:bg-emerald-500/10 text-xs font-semibold transition-colors">
            Set up
          </button>
        )}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// CONFIRM DIALOG — always names what gets switched off
// ═══════════════════════════════════════════════════════════════
const ConfirmSwitch = ({ target, current, busy, onCancel, onConfirm }) => (
  <AnimatePresence>
    {target && (
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={busy ? undefined : onCancel}
      >
        <motion.div
          className="w-full max-w-sm rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 shadow-xl"
          style={{ fontFamily: FONT }}
          initial={{ scale: 0.96, y: 8 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.96, y: 8 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center">
            <AlertCircle size={19} className="text-emerald-600 dark:text-emerald-400" />
          </div>
          <h3 className="mt-3 text-sm font-semibold text-slate-900 dark:text-slate-100">
            Start collecting with {nameOf(target)}?
          </h3>
          <p className="mt-1.5 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            {current && current !== target
              ? <>This switches off <b>{nameOf(current)}</b>, your current provider. </>
              : null}
            New hotspot voucher and TV plan payments will go through {nameOf(target)}. Payments already in progress are not affected.
          </p>
          <div className="mt-5 flex gap-2">
            <button type="button" onClick={onCancel} disabled={busy}
              className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 transition-colors">
              Cancel
            </button>
            <button type="button" onClick={onConfirm} disabled={busy}
              className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1.5">
              {busy && <Loader2 size={13} className="animate-spin" />} Start collecting
            </button>
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

// ═══════════════════════════════════════════════════════════════
// STATUS BAR shown at the top of a gateway's own page
// ═══════════════════════════════════════════════════════════════
const GatewayStatusBar = ({ gateway, isActive, ready, current, onStart }) => {
  if (isActive) {
    return (
      <div className="mb-5 flex items-center gap-2 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 px-4 py-3 text-xs text-emerald-800 dark:text-emerald-300">
        <CheckCircle2 size={14} className="shrink-0" />
        {gateway.name} is collecting payments for hotspot vouchers and TV plans.
      </div>
    );
  }
  if (!gateway.canActivate) {
    return (
      <div className="mb-5 flex items-center gap-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 px-4 py-3 text-xs text-slate-600 dark:text-slate-400">
        <AlertCircle size={14} className="shrink-0" />
        {gateway.name} can't collect payments yet. It's coming soon.
      </div>
    );
  }
  return (
    <div className="mb-5 flex flex-col sm:flex-row sm:items-center gap-3 justify-between rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 px-4 py-3">
      <p className="text-xs text-slate-600 dark:text-slate-400">
        {ready
          ? <>{gateway.name} is ready but not active. <b>{nameOf(current)}</b> is collecting payments right now.</>
          : gateway.id === 'payhero'
            ? <>Add at least one payment channel below, then start collecting.</>
            : <>Save your {gateway.name} details below, then start collecting.</>}
      </p>
      {ready && (
        <button type="button" onClick={() => onStart(gateway.id)}
          className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors shrink-0">
          Start collecting
        </button>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// MAIN COMPONENT
// One active gateway — used for hotspot vouchers AND TV plan devices.
// ═══════════════════════════════════════════════════════════════
const PaymentGatewaySettings = () => {
  const [view, setView] = useState(null);           // null = grid, else gateway id
  const [activeGateway, setActiveGateway] = useState('');
  const [ready, setReady] = useState({});
  const [pending, setPending] = useState(null);     // gateway awaiting confirmation
  const [switching, setSwitching] = useState(false);
  const subdomain = window.location.hostname.split('.')[0];

  useEffect(() => {
    const id = 'ibm-plex-mono-font';
    if (document.getElementById(id)) return;
    const link = document.createElement('link');
    link.id = id;
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&display=swap';
    document.head.appendChild(link);
  }, []);

  const loadReady = useCallback(async () => {
    const headers = { 'X-Subdomain': subdomain };
    const get = async (url) => {
      try {
        const res = await fetch(url, { headers });
        return res.ok ? await res.json() : null;
      } catch { return null; }
    };
    const [tuma, paystack, payhero] = await Promise.all([
      get('/api/tuma_settings'),
      get('/api/paystack_settings'),
      get('/api/payhero_channels'),
    ]);
    setReady({
      // M-Pesa always works: tenant keys if saved, platform defaults otherwise
      mpesa: true,
      // PayHero is ready once at least one channel is registered
      payhero: Array.isArray(payhero) && payhero.some((c) => c.is_active),
      tuma: !!(tuma && tuma.enabled && tuma.api_key_present),
      paystack: !!(paystack && paystack.enabled && paystack.secret_key_present),
      sasapay: false,
    });
  }, [subdomain]);

  useEffect(() => {
    fetch('/api/payment_gateway_settings', { headers: { 'X-Subdomain': subdomain } })
      .then((res) => (res.ok ? res.json() : {}))
      .then((data) => setActiveGateway(data.hotspot || 'mpesa'))
      .catch(() => {});
    loadReady();
  }, [subdomain, loadReady]);

  const confirmSwitch = async () => {
    const target = pending;
    const previous = activeGateway;
    setSwitching(true);
    try {
      const res = await fetch('/api/payment_gateway_settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'X-Subdomain': subdomain },
        body: JSON.stringify({ gateways: { hotspot: target } }),
      });
      if (!res.ok) throw new Error();
      setActiveGateway(target);
      toast.success(`${nameOf(target)} is now collecting payments`);
      setPending(null);
    } catch {
      setActiveGateway(previous);
      toast.error('Could not switch provider');
    } finally {
      setSwitching(false);
    }
  };

  const current = GATEWAYS.find((g) => g.id === view);
  const ActivePanel = view ? PANELS[view] : null;

  // Active first, then ready, then the rest
  const sorted = [...GATEWAYS].sort((a, b) => {
    const rank = (g) => (g.id === activeGateway ? 0 : ready[g.id] && g.canActivate ? 1 : 2);
    return rank(a) - rank(b);
  });

  return (
    <PaymentGatewayOtpGate title="Payment Gateways">
      <div className="p-4 sm:p-6 max-w-5xl" style={{ fontFamily: FONT }}>
        <Toaster />

        <AnimatePresence mode="wait">
          {!view ? (
            <motion.div key="grid" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.15 }}>
              <div className="flex items-start gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center shrink-0">
                  <Wallet size={19} className="text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">Payment collection</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                    Pick the provider your customers pay through. One is live at a time and covers hotspot vouchers and TV plans.
                  </p>
                </div>
              </div>

              {activeGateway && (
                <div className="mb-5 flex items-center gap-2 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 px-4 py-3 text-xs text-emerald-800 dark:text-emerald-300">
                  <CheckCircle2 size={14} className="shrink-0" />
                  {nameOf(activeGateway)} is collecting customer payments.
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {sorted.map((g) => (
                  <GatewayCard
                    key={g.id}
                    gateway={g}
                    isActive={activeGateway === g.id}
                    ready={!!ready[g.id]}
                    onStart={setPending}
                    onManage={setView}
                  />
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div key={view} className="max-w-3xl" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.15 }}>
              <button type="button" onClick={() => { setView(null); loadReady(); }}
                className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 mb-4 transition-colors">
                <ArrowLeft size={14} /> Back to providers
              </button>

              <div className="flex items-start gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center shrink-0">
                  <current.icon size={19} className="text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">{current.name}</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{current.description}</p>
                </div>
              </div>

              <GatewayStatusBar
                gateway={current}
                isActive={activeGateway === current.id}
                ready={!!ready[current.id]}
                current={activeGateway}
                onStart={setPending}
              />

              <ActivePanel subdomain={subdomain} onSaved={loadReady} isActive={activeGateway === current.id} />
            </motion.div>
          )}
        </AnimatePresence>

        <ConfirmSwitch
          target={pending}
          current={activeGateway}
          busy={switching}
          onCancel={() => setPending(null)}
          onConfirm={confirmSwitch}
        />
      </div>
    </PaymentGatewayOtpGate>
  );
};

export default PaymentGatewaySettings;