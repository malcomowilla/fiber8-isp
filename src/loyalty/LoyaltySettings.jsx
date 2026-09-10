import { useState, useEffect, useCallback, useMemo } from 'react';
import { Ticket, Check, X, Loader2, AlertCircle, Info } from 'lucide-react';

// Receipt-style loyalty settings page.
// Talks to GET/PATCH /api/hotspot_loyalty_setting, following the same
// X-Subdomain tenant-header + credentials pattern used elsewhere in the app.

const FONT_IMPORT = `@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600;700&display=swap');`;

const DEFAULT_SETTING = {
  enabled: true,
  earn_rate_percent: 5,
  max_points: null,
  expire_after_days: 30,
  expire_warning_days: 2,
  expire_min_balance: 10,
};

const PREVIEW_AMOUNTS = [20, 50, 100, 200, 500];

function Toggle({ checked, onChange, disabled }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full
        transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed
        focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
        focus-visible:ring-[#1F7A4D] ${checked ? 'bg-[#1F7A4D]' : 'bg-[#D8E3DA]'}`}
    >
      <span
        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm
          transition-transform duration-200 ${checked ? 'translate-x-6' : 'translate-x-1'}`}
      />
    </button>
  );
}

function Field({ label, hint, children }) {
  return (
    <div className="py-4 border-b border-dashed border-[#D8E3DA] last:border-b-0">
      <div className="flex items-start justify-between gap-6">
        <div className="min-w-0 flex-1">
          <div className="text-[13px] font-medium text-[#0B1F16]">{label}</div>
          {hint && <p className="mt-1 text-[12px] leading-relaxed text-[#6B7C71]">{hint}</p>}
        </div>
        <div className="shrink-0">{children}</div>
      </div>
    </div>
  );
}

function NumberInput({ value, onChange, suffix, placeholder, min = 0, width = 'w-24' }) {
  return (
    <div className="relative">
      <input
        type="number"
        inputMode="numeric"
        min={min}
        value={value ?? ''}
        placeholder={placeholder}
        onChange={(e) => {
          const v = e.target.value;
          onChange(v === '' ? null : Number(v));
        }}
        className={`${width} rounded-md border border-[#D8E3DA] bg-white px-3 py-1.5
          text-right text-[13px] font-medium text-[#0B1F16] font-mono
          focus:outline-none focus:ring-2 focus:ring-[#1F7A4D]/40 focus:border-[#1F7A4D]
          placeholder:text-[#A9B8AC]`}
      />
      {suffix && (
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-[#A9B8AC]">
          {suffix}
        </span>
      )}
    </div>
  );
}

export default function LoyaltySettings() {
  const subdomain = typeof window !== 'undefined' ? window.location.hostname.split('.')[0] : '';

  const [tab, setTab] = useState('hotspot');
  const [setting, setSetting] = useState(DEFAULT_SETTING);
  const [initial, setInitial] = useState(DEFAULT_SETTING);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState(null); // { type: 'ok' | 'error', message }
  const [loadError, setLoadError] = useState(false);

  const fetchSetting = useCallback(async () => {
    setLoading(true);
    setLoadError(false);
    try {
      const res = await fetch('/api/hotspot_loyalty_setting', {
        method: 'GET',
        credentials: 'include',
        headers: { 'X-Subdomain': subdomain },
      });
      if (!res.ok) throw new Error('Failed to load');
      const data = await res.json();
      setSetting({ ...DEFAULT_SETTING, ...data });
      setInitial({ ...DEFAULT_SETTING, ...data });
    } catch {
      setLoadError(true);
    } finally {
      setLoading(false);
    }
  }, [subdomain]);

  useEffect(() => {
    fetchSetting();
  }, [fetchSetting]);

  const dirty = useMemo(
    () => JSON.stringify(setting) !== JSON.stringify(initial),
    [setting, initial]
  );

  const patch = (key) => (value) => setSetting((prev) => ({ ...prev, [key]: value }));

  const handleSave = async () => {
    setSaving(true);
    setStatus(null);
    try {
      const res = await fetch('/api/hotspot_loyalty_setting', {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-Subdomain': subdomain,
        },
        body: JSON.stringify(setting),
      });
      const data = await res.json();
      if (!res.ok) {
        const msg = Array.isArray(data?.errors) ? data.errors.join(', ') : 'Could not save settings';
        throw new Error(msg);
      }
      setSetting({ ...DEFAULT_SETTING, ...data });
      setInitial({ ...DEFAULT_SETTING, ...data });
      setStatus({ type: 'ok', message: 'Settings saved' });
    } catch (err) {
      setStatus({ type: 'error', message: err.message || 'Could not save settings' });
    } finally {
      setSaving(false);
      setTimeout(() => setStatus(null), 4000);
    }
  };

  const earnRate = Number(setting.earn_rate_percent) || 0;

  return (
    <div className="min-h-screen  px-4 py-10 
    font-mono" style={{ fontFamily: "'IBM Plex Mono', ui-monospace, monospace" }}>
      <style>{FONT_IMPORT}</style>

      <div className="mx-auto max-w-[640px]">
        {/* Header */}
        <div className="mb-6 flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg
           bg-[#0B1F16] text-[#34C77B]">
            <Ticket size={18} strokeWidth={2} />
          </div>
          <div>
            <h1 className="text-lg font-semibold tracking-tight text-[#0B1F16]">Loyalty Points</h1>
            <p className="mt-0.5 text-[13px] text-[#6B7C71]">
              Hotspot customers earn points on every purchase. They spend them on any hotspot plan from their account page.
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-5 inline-flex rounded-lg border border-[#D8E3DA] bg-white p-1">
          <button
            onClick={() => setTab('pppoe')}
            className={`rounded-md px-3.5 py-1.5 text-[12px] font-medium transition-colors ${
              tab === 'pppoe' ? 'bg-[#0B1F16] text-white' : 'text-[#6B7C71] hover:text-[#0B1F16]'
            }`}
          >
            PPPoE &amp; Static IP
          </button>
          <button
            onClick={() => setTab('hotspot')}
            className={`rounded-md px-3.5 py-1.5 text-[12px] font-medium transition-colors ${
              tab === 'hotspot' ? 'bg-[#0B1F16] text-white' : 'text-[#6B7C71] hover:text-[#0B1F16]'
            }`}
          >
            Hotspot
          </button>
        </div>

        {tab === 'pppoe' ? (
          <div className="rounded-xl border border-dashed border-[#D8E3DA] bg-white px-6 py-10 text-center">
            <p className="text-[13px] text-[#6B7C71]">Loyalty points for PPPoE &amp; Static IP aren't available yet.</p>
          </div>
        ) : loading ? (
          <div className="flex items-center justify-center rounded-xl border border-[#D8E3DA] bg-white py-16">
            <Loader2 size={18} className="animate-spin text-[#6B7C71]" />
          </div>
        ) : loadError ? (
          <div className="flex items-center justify-between rounded-xl border border-[#E6B8AE] bg-[#FBEEEB] px-5 py-4">
            <div className="flex items-center gap-2 text-[13px] text-[#8A3B2C]">
              <AlertCircle size={16} />
              Couldn't load loyalty settings.
            </div>
            <button
              onClick={fetchSetting}
              className="text-[12px] font-medium text-[#8A3B2C] underline underline-offset-2"
            >
              Retry
            </button>
          </div>
        ) : (
          <>
            {/* Ticket card */}
            <div
              className="relative rounded-xl border border-[#D8E3DA] bg-white shadow-[0_1px_2px_rgba(11,31,22,0.04)]"
              style={{
                backgroundImage:
                  'radial-gradient(circle at 0 0, transparent 8px, white 8.5px), radial-gradient(circle at 100% 0, transparent 8px, white 8.5px)',
              }}
            >
              <div className="px-6 py-5">
                <Field label="Hotspot programme" hint="Off means nothing is earned and nothing can be redeemed. Existing balances are kept and return when you switch it back on.">
                  <div className="flex items-center gap-2.5">
                    <span className={`text-[11px] font-semibold tracking-wide ${setting.enabled ? 'text-[#1F7A4D]' : 'text-[#A9B8AC]'}`}>
                      {setting.enabled ? 'ON' : 'OFF'}
                    </span>
                    <Toggle checked={!!setting.enabled} onChange={patch('enabled')} />
                  </div>
                </Field>

                <Field
                  label="Points earned per purchase (% of amount paid)"
                  hint="1 point = KSh 1. At the saved rate a KSh 100 purchase earns 5 points. Customers spend points on any hotspot plan at its listed price, from their account page."
                >
                  <NumberInput value={setting.earn_rate_percent} onChange={patch('earn_rate_percent')} suffix="%" />
                </Field>

                {/* Receipt-style preview */}
                <div className="my-1 rounded-lg bg-[#F6F8F4] px-4 py-3">
                  <div className="mb-2 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-[#6B7C71]">
                    <Info size={11} />
                    What customers earn · saved rate
                  </div>
                  <div className="space-y-1">
                    {PREVIEW_AMOUNTS.map((amt) => {
                      const pts = Math.round((amt * earnRate) / 100);
                      return (
                        <div key={amt} className="flex items-baseline text-[12px] text-[#0B1F16]">
                          <span>KSh {amt}</span>
                          <span className="mx-2 flex-1 overflow-hidden border-b border-dotted border-[#C3D1C6] translate-y-[-3px]" />
                          <span className="font-semibold">{pts} {pts === 1 ? 'pt' : 'pts'}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <Field
                  label="Maximum points a customer can hold"
                  hint="Optional. Leave blank for no maximum. Earning pauses at the maximum and resumes once points are spent."
                >
                  <NumberInput
                    value={setting.max_points}
                    onChange={patch('max_points')}
                    placeholder="No maximum"
                    width="w-28"
                  />
                </Field>
              </div>

              {/* Perforation divider */}
              <div className="relative h-0 border-t border-dashed border-[#D8E3DA]">
                <div className="absolute -left-[9px] -top-[9px] h-[18px] w-[18px] rounded-full bg-[#F6F8F4]" />
                <div className="absolute -right-[9px] -top-[9px] h-[18px] w-[18px] rounded-full bg-[#F6F8F4]" />
              </div>

              <div className="px-6 py-5">
                <div className="mb-1">
                  <h2 className="text-[13px] font-semibold text-[#0B1F16]">Expire points from inactive customers</h2>
                  <p className="mt-1 text-[12px] leading-relaxed text-[#6B7C71]">
                    A customer who buys a plan or spends points keeps their balance. We text them before anything is removed.
                  </p>
                </div>

                <Field label="Destroy points after this many quiet days" hint="Counted from their last purchase or their last claim, whichever came later.">
                  <NumberInput value={setting.expire_after_days} onChange={patch('expire_after_days')} suffix="days" width="w-24" />
                </Field>

                <Field label="Warn the customer this many days first" hint="One SMS through your own gateway. Set 0 to remove points with no warning.">
                  <NumberInput value={setting.expire_warning_days} onChange={patch('expire_warning_days')} suffix="days" width="w-24" />
                </Field>

                <Field label="Only expire balances of at least" hint="Smaller balances are left alone, and their holders are never texted about them.">
                  <NumberInput value={setting.expire_min_balance} onChange={patch('expire_min_balance')} suffix="pts" width="w-24" />
                </Field>
              </div>
            </div>

            {/* Save bar */}
            <div className="mt-5 flex items-center justify-between">
              <div className="text-[12px]">
                {status?.type === 'ok' && (
                  <span className="flex items-center gap-1.5 text-[#1F7A4D]">
                    <Check size={14} /> {status.message}
                  </span>
                )}
                {status?.type === 'error' && (
                  <span className="flex items-center gap-1.5 text-[#B3402F]">
                    <X size={14} /> {status.message}
                  </span>
                )}
                {!status && dirty && <span className="text-[#A9B8AC]">Unsaved changes</span>}
              </div>
              <button
                onClick={handleSave}
                disabled={saving || !dirty}
                className="flex items-center gap-2 rounded-lg bg-[#1F7A4D] px-5 py-2.5 text-[13px]
                  font-semibold text-white transition-colors hover:bg-[#186039]
                  disabled:cursor-not-allowed disabled:bg-[#A9B8AC]"
              >
                {saving && <Loader2 size={14} className="animate-spin" />}
                {saving ? 'Saving…' : 'Save settings'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}