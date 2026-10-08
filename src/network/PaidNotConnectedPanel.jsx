import { useState, useEffect, useCallback, useMemo } from 'react';
import toast from 'react-hot-toast';
import { ShieldCheck, RefreshCw, Send, Users, XCircle, Info, CheckCircle2 } from 'lucide-react';

const subdomain = window.location.hostname.split('.')[0];

const UNIT_MINUTES = { minutes: 1, hours: 60, days: 1440 };

const fmtMinutes = (m) => {
  const n = Math.round(m || 0);
  if (n < 60) return `${n}m`;
  const h = Math.floor(n / 60);
  const r = n % 60;
  if (h < 24) return r ? `${h}h ${r}m` : `${h}h`;
  const d = Math.floor(h / 24);
  const hr = h % 24;
  return hr ? `${d}d ${hr}h` : `${d}d`;
};

const fmtKsh = (v) => `KSh ${Number(v || 0).toLocaleString('en-KE')}`;

const PaidNotConnectedPanel = ({ onChanged }) => {
  const [rows, setRows] = useState([]);
  const [defaultGrace, setDefaultGrace] = useState(1440);
  const [loading, setLoading] = useState(false);
  const [days, setDays] = useState(7);
  const [selected, setSelected] = useState(new Set());
  const [mode, setMode] = useState('suggested'); // 'suggested' | 'custom'
  const [customValue, setCustomValue] = useState(1);
  const [customUnit, setCustomUnit] = useState('hours');
  const [notify, setNotify] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  const fetchRows = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/paid_not_connected?days=${days}`, {
        headers: { 'X-Subdomain': subdomain },
      });
      const data = await res.json();
      if (res.ok) {
        setRows(data.rows || []);
        setDefaultGrace(data.default_grace_minutes || 1440);
        setSelected((prev) => {
          const ids = new Set((data.rows || []).map((r) => r.id));
          return new Set([...prev].filter((id) => ids.has(id)));
        });
      } else {
        toast.error(data.error || 'Failed to load customers', { position: 'top-center' });
      }
    } catch {
      toast.error('Network error while loading customers', { position: 'top-center' });
    } finally {
      setLoading(false);
    }
  }, [days]);

  useEffect(() => { fetchRows(); }, [fetchRows]);

  // jump here when coming from the dashboard banner
  useEffect(() => {
    if (!loading && window.location.hash === '#paid-not-connected') {
      document.getElementById('paid-not-connected')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [loading]);

  const selectedRows = useMemo(() => rows.filter((r) => selected.has(r.id)), [rows, selected]);
  const allSelected = rows.length > 0 && selected.size === rows.length;
  const eligibleCount = useMemo(() => rows.filter((r) => r.auto_eligible).length, [rows]);

  const customMinutes = (Number(customValue) || 0) * UNIT_MINUTES[customUnit];
  const customValid = customMinutes > 0 && customMinutes <= 30 * 1440;
  const smsEstimate = selectedRows.length;

  const toggle = (id) =>
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const toggleAll = () => setSelected(allSelected ? new Set() : new Set(rows.map((r) => r.id)));
  const selectEligible = () => setSelected(new Set(rows.filter((r) => r.auto_eligible).map((r) => r.id)));

  const handleApprove = async () => {
    if (selected.size === 0) return;
    if (mode === 'custom' && !customValid) {
      return toast.error('Enter a valid compensation length (max 30 days)', { position: 'top-center' });
    }
    const durationText = mode === 'suggested' ? 'suggested time per customer' : `${customValue} ${customUnit}`;
    const ok = window.confirm(
      `Compensate ${selected.size} customer(s) with ${durationText}?\n` +
      (notify ? `SMS ON: up to ${smsEstimate} message(s) will be sent and billed.` : 'SMS OFF: no messages will be sent.')
    );
    if (!ok) return;

    setSubmitting(true);
    try {
      const res = await fetch('/api/paid_not_connected/compensate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Subdomain': subdomain },
        body: JSON.stringify({
          session_ids: [...selected],
          mode,
          duration_value: customValue,
          duration_unit: customUnit,
          notify,
          days,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setResult(data);
        setSelected(new Set());
        toast.success(`Compensated ${data.compensated_count} customer(s)`, { position: 'top-center' });
        fetchRows();
        onChanged?.();
      } else {
        toast.error(data.error || 'Compensation failed', { position: 'top-center' });
      }
    } catch {
      toast.error('Network error during compensation', { position: 'top-center' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDismiss = async () => {
    if (selected.size === 0) return;
    if (!window.confirm(`Dismiss ${selected.size} customer(s)? They will not be compensated and will leave this list.`)) return;
    try {
      const res = await fetch('/api/paid_not_connected/dismiss', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Subdomain': subdomain },
        body: JSON.stringify({ session_ids: [...selected] }),
      });
      if (res.ok) {
        toast.success('Dismissed', { position: 'top-center' });
        setSelected(new Set());
        fetchRows();
        onChanged?.();
      } else {
        toast.error('Failed to dismiss', { position: 'top-center' });
      }
    } catch {
      toast.error('Network error', { position: 'top-center' });
    }
  };

  return (
    <div id="paid-not-connected"
      className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 px-4 py-3 border-b border-gray-200 dark:border-gray-700">
        <div>
          <h2 className="text-sm font-bold text-gray-900 dark:text-white">Paid but not connected</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            These customers paid successfully but never got online. Approve compensation below.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <select value={days} onChange={(e) => setDays(Number(e.target.value))}
            className="rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white px-2.5 py-1.5 text-xs">
            <option value={1}>Last 24 hours</option>
            <option value={3}>Last 3 days</option>
            <option value={7}>Last 7 days</option>
            <option value={14}>Last 14 days</option>
            <option value={30}>Last 30 days</option>
          </select>
          <button onClick={fetchRows}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700">
            <RefreshCw size={12} className={loading ? 'animate-spin' : ''} /> Refresh
          </button>
        </div>
      </div>

      {result && (
        <div className="mx-4 mt-4 flex items-start gap-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/40 p-3 text-xs text-gray-700 dark:text-gray-200">
          <CheckCircle2 size={14} className="mt-0.5 shrink-0" />
          <div className="flex-1">
            {result.compensated_count} compensated, {result.sms_sent_count} SMS sent
            {result.skipped_count > 0 && `, ${result.skipped_count} skipped (no voucher found, or duplicate phone in the same batch)`}.
          </div>
          <button onClick={() => setResult(null)} className="text-gray-400 hover:text-gray-600"><XCircle size={14} /></button>
        </div>
      )}

      {rows.length === 0 && !loading ? (
        <div className="py-12 text-center text-sm text-gray-500 dark:text-gray-400">
          Nobody is waiting for compensation in this period.
        </div>
      ) : (
        <>
          {/* Selection + approval controls */}
          <div className="px-4 py-3 space-y-3 border-b border-gray-200 dark:border-gray-700">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <button onClick={toggleAll}
                className="px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 font-semibold hover:bg-gray-50 dark:hover:bg-gray-700">
                {allSelected ? 'Clear selection' : `Select all (${rows.length})`}
              </button>
              <button onClick={selectEligible} disabled={eligibleCount === 0}
                className="px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50">
                Select auto-eligible ({eligibleCount})
              </button>
              <span className="text-gray-500 dark:text-gray-400 flex items-center gap-1">
                <Users size={13} /> {selected.size} selected
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Duration */}
              <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-3 space-y-2">
                <p className="text-xs font-semibold text-gray-700 dark:text-gray-200">Compensation time</p>
                <label className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300 cursor-pointer">
                  <input type="radio" checked={mode === 'suggested'} onChange={() => setMode('suggested')} />
                  Suggested per customer (time they lost, 1h minimum, capped at your grace period of {fmtMinutes(defaultGrace)})
                </label>
                <label className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300 cursor-pointer">
                  <input type="radio" checked={mode === 'custom'} onChange={() => setMode('custom')} />
                  Same for everyone:
                  <input type="number" min={1} value={customValue} disabled={mode !== 'custom'}
                    onChange={(e) => setCustomValue(e.target.value)}
                    className="w-16 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white px-1.5 py-0.5 text-xs text-center disabled:opacity-50" />
                  <select value={customUnit} disabled={mode !== 'custom'} onChange={(e) => setCustomUnit(e.target.value)}
                    className="rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white px-1.5 py-0.5 text-xs disabled:opacity-50">
                    <option value="minutes">Minutes</option>
                    <option value="hours">Hours</option>
                    <option value="days">Days</option>
                  </select>
                </label>
              </div>

              {/* SMS */}
              <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-3 space-y-1.5">
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="flex items-center gap-2 text-xs font-semibold text-gray-700 dark:text-gray-200">
                    <Send size={13} /> Send SMS to customers
                  </span>
                  <input type="checkbox" checked={notify} onChange={(e) => setNotify(e.target.checked)}
                    className="w-4 h-4 rounded" />
                </label>
                <p className="text-[11px] text-gray-500 dark:text-gray-400">
                  {notify
                    ? `Up to ${smsEstimate} SMS will be sent and billed to your SMS wallet.`
                    : 'Off. Vouchers are extended silently, no SMS cost.'}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button onClick={handleApprove} disabled={selected.size === 0 || submitting}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:opacity-90 disabled:opacity-50">
                {submitting ? <RefreshCw size={14} className="animate-spin" /> : <ShieldCheck size={14} />}
                Approve and compensate ({selected.size})
              </button>
              <button onClick={handleDismiss} disabled={selected.size === 0 || submitting}
                className="px-4 py-2 rounded-lg text-sm font-semibold border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50">
                Dismiss selected
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-left text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                  <th className="px-4 py-2 w-8">
                    <input type="checkbox" checked={allSelected} onChange={toggleAll} />
                  </th>
                  <th className="px-2 py-2">Phone</th>
                  <th className="px-2 py-2">Package</th>
                  <th className="px-2 py-2">Voucher</th>
                  <th className="px-2 py-2">Amount</th>
                  <th className="px-2 py-2">Paid at</th>
                  <th className="px-2 py-2">Waiting</th>
                  <th className="px-2 py-2">Suggested</th>
                  <th className="px-2 py-2">Auto-eligible</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id}
                    onClick={() => toggle(r.id)}
                    className="border-b border-gray-100 dark:border-gray-700/60 hover:bg-gray-50 dark:hover:bg-gray-700/40 cursor-pointer text-gray-800 dark:text-gray-200">
                    <td className="px-4 py-2" onClick={(e) => e.stopPropagation()}>
                      <input type="checkbox" checked={selected.has(r.id)} onChange={() => toggle(r.id)} />
                    </td>
                    <td className="px-2 py-2 font-mono">{r.phone_number}</td>
                    <td className="px-2 py-2">{r.package}</td>
                    <td className="px-2 py-2 font-mono">{r.voucher || '—'}</td>
                    <td className="px-2 py-2 tabular-nums">{fmtKsh(r.amount)}</td>
                    <td className="px-2 py-2 whitespace-nowrap">{r.paid_at}</td>
                    <td className="px-2 py-2 tabular-nums">{fmtMinutes(r.minutes_since_paid)}</td>
                    <td className="px-2 py-2 tabular-nums">{fmtMinutes(r.suggested_minutes)}</td>
                    <td className="px-2 py-2">
                      {r.auto_eligible ? 'Yes' : <span title={r.reasons.join(', ')}>No: {r.reasons[0]}</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="px-4 py-3 flex items-start gap-2 text-[11px] text-gray-500 dark:text-gray-400">
            <Info size={13} className="mt-0.5 shrink-0" />
            <p>
              Auto-eligible = payment confirmed, amount above zero, voucher found, not online since, waiting at least
              10 minutes, and compensated fewer than 2 times in the last 30 days. If a phone appears twice, only its
              latest voucher is extended.
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default PaidNotConnectedPanel;