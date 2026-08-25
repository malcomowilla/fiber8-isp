import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';
import {
  AlertTriangle, Wrench, Activity, Plus, X, Send, Users, CheckCircle2,
  Clock, Trash2, RefreshCw, Info, Phone, Wifi, ChevronDown,
  ShieldCheck, Zap, CalendarDays, History,
} from 'lucide-react';

const subdomain = window.location.hostname.split('.')[0];

const TYPE_META = {
  outage:      { label: 'Outage',      icon: Zap,      color: '#ef4444', bg: '#fee2e2', text: '#991b1b' },
  maintenance: { label: 'Maintenance', icon: Wrench,    color: '#f59e0b', bg: '#fef3c7', text: '#92400e' },
  degradation: { label: 'Degradation', icon: Activity,  color: '#8b5cf6', bg: '#ede9fe', text: '#5b21b6' },
};

const STATUS_META = {
  ongoing:  { label: 'Ongoing',  bg: '#fef3c7', text: '#92400e' },
  resolved: { label: 'Resolved', bg: '#d1fae5', text: '#065f46' },
};

const fmtDate = (d) => {
  if (!d) return '—';
  try {
    return new Date(d).toLocaleString('en-GB', {
      day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
    });
  } catch { return d; }
};

/* ---------------------------------------------------------------- */
/* Classification guide                                              */
/* ---------------------------------------------------------------- */
const ClassificationGuide = () => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
    {[
      { key: 'outage', title: 'Outage', desc: 'Complete loss of connectivity. Directly impacts uptime calculations and may trigger automatic SLA credits if prolonged.' },
      { key: 'maintenance', title: 'Maintenance', desc: 'Planned work or upgrades. Does not count as downtime if customers are notified 24h in advance.' },
      { key: 'degradation', title: 'Degradation', desc: 'Service is usable but with high latency, packet loss, or reduced speeds. May warrant partial credit.' },
    ].map(({ key, title, desc }) => {
      const meta = TYPE_META[key];
      const Icon = meta.icon;
      return (
        <div key={key} className="rounded-xl border border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-800">
          <div className="flex items-center gap-2 mb-2">
            <span className="flex items-center justify-center w-8 h-8 rounded-lg" style={{ backgroundColor: meta.bg }}>
              <Icon size={16} style={{ color: meta.color }} />
            </span>
            <p className="font-semibold text-sm text-gray-800 dark:text-white font-sans">{title}</p>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 font-sans leading-relaxed">{desc}</p>
        </div>
      );
    })}
  </div>
);

/* ---------------------------------------------------------------- */
/* Record Incident Modal                                             */
/* ---------------------------------------------------------------- */
const RecordIncidentModal = ({ open, onClose, onCreated, routers, graceSetting }) => {
  const emptyForm = {
    title: '', incident_type: 'outage', status: 'resolved',
    start_time: '', end_time: '', notes: '',
    service_type: 'hotspot', router_scope: 'all', affected_routers: [],
    compensate: true, active_customers_only: false, expired_lookback_days: 3,
  };
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [preview, setPreview] = useState(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    if (open) { setForm(emptyForm); setResult(null); setPreview(null); }
  }, [open]);

  const set = (patch) => setForm((prev) => ({ ...prev, ...patch }));

  const toggleRouter = (name) => {
    set({
      affected_routers: form.affected_routers.includes(name)
        ? form.affected_routers.filter((r) => r !== name)
        : [...form.affected_routers, name],
    });
  };

  const fetchPreview = useCallback(async () => {
    if (!form.compensate) return setPreview(null);
    setPreviewLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('router_scope', form.router_scope);
      params.set('active_customers_only', form.active_customers_only);
      params.set('expired_lookback_days', form.expired_lookback_days || 3);
      if (form.start_time) params.set('start_time', form.start_time);
      form.affected_routers.forEach((r) => params.append('affected_routers[]', r));
      const response = await fetch(`/api/incidents/preview_affected?${params.toString()}`, {
        headers: { 'X-Subdomain': subdomain },
      });
      const data = await response.json();
      if (response.ok) setPreview(data);
    } catch { /* silent — preview is best-effort */ }
    setPreviewLoading(false);
  }, [form.compensate, form.router_scope, form.active_customers_only, form.affected_routers, form.expired_lookback_days, form.start_time]);

  useEffect(() => {
    const t = setTimeout(fetchPreview, 350);
    return () => clearTimeout(t);
  }, [fetchPreview]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return toast.error('Title is required', { position: 'top-center' });
    if (!form.start_time) return toast.error('Start time is required', { position: 'top-center' });
    if (form.router_scope === 'specific' && form.affected_routers.length === 0) {
      return toast.error('Select at least one router, or choose "All routers"', { position: 'top-center' });
    }
    setSaving(true);
    try {
      const response = await fetch('/api/incidents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Subdomain': subdomain },
        body: JSON.stringify({ incident: form }),
      });
      const data = await response.json();
      if (response.ok) {
        toast.success('Incident recorded', { position: 'top-center', duration: 3000 });
        setResult(data.compensation_result || null);
        onCreated?.(data);
        if (!data.compensation_result) onClose();
      } else {
        toast.error(data.error || 'Failed to record incident', { position: 'top-center', duration: 4000 });
      }
    } catch {
      toast.error('Network error while recording incident', { position: 'top-center', duration: 4000 });
    } finally {
      setSaving(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }} animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }} onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-800
              rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 font-sans"
          >
            {result ? (
              <div className="p-8 text-center">
                <div className="mx-auto w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-900/30
                  flex items-center justify-center mb-4">
                  <CheckCircle2 size={28} className="text-emerald-600 dark:text-emerald-400" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Customers compensated</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                  Affected vouchers were extended automatically and eligible customers were notified.
                </p>
                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="rounded-xl bg-gray-50 dark:bg-gray-700/50 p-4">
                    <p className="text-2xl font-extrabold text-gray-800 dark:text-white">{result.compensated_count}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mt-1">Vouchers compensated</p>
                  </div>
                  <div className="rounded-xl bg-gray-50 dark:bg-gray-700/50 p-4">
                    <p className="text-2xl font-extrabold text-gray-800 dark:text-white">{result.sms_sent_count}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mt-1">SMS notifications sent</p>
                  </div>
                </div>
                <button onClick={onClose}
                  className="w-full py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold transition-colors">
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-2.5">
                    <span className="w-9 h-9 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                      <AlertTriangle size={17} className="text-red-600 dark:text-red-400" />
                    </span>
                    <div>
                      <h3 className="text-base font-bold text-gray-900 dark:text-white">Record New Incident</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Record a new network incident</p>
                    </div>
                  </div>
                  <button type="button" onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                    <X size={18} className="text-gray-400" />
                  </button>
                </div>

                <div className="p-6 space-y-5">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1.5">Incident Title *</label>
                    <input required value={form.title} onChange={(e) => set({ title: e.target.value })}
                      placeholder="e.g. Fiber cut on Kilimani backbone"
                      className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50
                        dark:bg-gray-700 dark:text-white px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1.5">Type *</label>
                      <select value={form.incident_type} onChange={(e) => set({ incident_type: e.target.value })}
                        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50
                          dark:bg-gray-700 dark:text-white px-3 py-2 text-sm">
                        <option value="outage">Outage</option>
                        <option value="maintenance">Maintenance</option>
                        <option value="degradation">Degradation</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1.5">Status</label>
                      <select value={form.status} onChange={(e) => set({ status: e.target.value })}
                        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50
                          dark:bg-gray-700 dark:text-white px-3 py-2 text-sm">
                        <option value="resolved">Resolved</option>
                        <option value="ongoing">Ongoing</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1.5">Start Time *</label>
                      <input required type="datetime-local" value={form.start_time}
                        onChange={(e) => set({ start_time: e.target.value })}
                        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50
                          dark:bg-gray-700 dark:text-white px-3 py-2 text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1.5">End Time</label>
                      <input type="datetime-local" value={form.end_time}
                        onChange={(e) => set({ end_time: e.target.value })}
                        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50
                          dark:bg-gray-700 dark:text-white px-3 py-2 text-sm" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1.5">Notes</label>
                    <textarea rows={2} value={form.notes} onChange={(e) => set({ notes: e.target.value })}
                      placeholder="What happened, root cause, resolution..."
                      className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50
                        dark:bg-gray-700 dark:text-white px-3 py-2 text-sm resize-none" />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1.5">Service Affected</label>
                    <div className="flex gap-2">
                      {['hotspot', 'pppoe', 'both'].map((s) => (
                        <button type="button" key={s} onClick={() => set({ service_type: s })}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize border transition-colors ${
                            form.service_type === s
                              ? 'bg-emerald-600 border-emerald-600 text-white'
                              : 'border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                          }`}>
                          {s === 'pppoe' ? 'PPPoE' : s}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-xl border border-gray-200 dark:border-gray-700 p-4 space-y-3">
                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300">Affected Routers</label>
                    <div className="flex gap-2">
                      {['all', 'specific'].map((s) => (
                        <button type="button" key={s} onClick={() => set({ router_scope: s })}
                          className={`flex-1 px-3 py-2 rounded-lg text-xs font-semibold border transition-colors ${
                            form.router_scope === s
                              ? 'bg-emerald-600 border-emerald-600 text-white'
                              : 'border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                          }`}>
                          {s === 'all' ? 'All routers' : 'Specific routers'}
                        </button>
                      ))}
                    </div>
                    {form.router_scope === 'specific' && (
                      <>
                        <p className="text-xs text-gray-400">Only customers on the targeted routers are compensated.</p>
                        <div className="max-h-32 overflow-y-auto grid grid-cols-2 gap-1.5 pt-1">
                          {routers.length === 0 && <p className="text-xs text-gray-400 col-span-2">No routers found.</p>}
                          {routers.map((r) => (
                            <label key={r.id ?? r.name} className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300 cursor-pointer">
                              <input type="checkbox" checked={form.affected_routers.includes(r.name)}
                                onChange={() => toggleRouter(r.name)} className="rounded accent-emerald-600" />
                              {r.name}
                            </label>
                          ))}
                        </div>
                      </>
                    )}
                    {form.router_scope === 'all' && (
                      <p className="text-xs text-gray-400">Choose specific routers to avoid gracing your whole customer base.</p>
                    )}
                  </div>

                  <div className="rounded-xl border border-emerald-200 dark:border-emerald-900/40 bg-emerald-50/60
                    dark:bg-emerald-900/10 p-4 space-y-3">
                    <label className="flex items-center justify-between cursor-pointer">
                      <span className="flex items-center gap-2 text-sm font-semibold text-gray-800 dark:text-white">
                        <ShieldCheck size={16} className="text-emerald-600" /> Compensate
                      </span>
                      <input type="checkbox" checked={form.compensate} onChange={(e) => set({ compensate: e.target.checked })}
                        className="w-4 h-4 rounded accent-emerald-600" />
                    </label>

                    {form.compensate && (
                      <>
                        <label className="flex items-center justify-between cursor-pointer pl-6">
                          <span className="text-xs text-gray-600 dark:text-gray-300">Active customers only</span>
                          <input type="checkbox" checked={form.active_customers_only}
                            onChange={(e) => set({ active_customers_only: e.target.checked })}
                            className="w-4 h-4 rounded accent-emerald-600" />
                        </label>

                        {!form.active_customers_only && (
                          <div className="pl-6 flex items-center gap-2">
                            <History size={13} className="text-gray-400 shrink-0" />
                            <span className="text-xs text-gray-600 dark:text-gray-300">
                              Also include customers who expired within the last
                            </span>
                            <input type="number" min={1} value={form.expired_lookback_days}
                              onChange={(e) => set({ expired_lookback_days: e.target.value })}
                              className="w-14 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700
                                px-1.5 py-0.5 text-xs text-center" />
                            <span className="text-xs text-gray-600 dark:text-gray-300">day(s)</span>
                          </div>
                        )}

                        <p className="pl-6 text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed">
                          Active customers get their grace period applied at their expiry. Recently expired
                          customers, when included, are graced immediately — vouchers that expired further back
                          than the window above are left untouched. Grace length uses your Grace Period Settings
                          {graceSetting ? ` (currently ${graceSetting.grace_period_value} ${graceSetting.grace_period_unit})` : ''}.
                        </p>
                        <div className="pl-6 flex items-center gap-2 text-xs font-semibold text-gray-700 dark:text-gray-200">
                          <Users size={14} className="text-emerald-600" />
                          {previewLoading ? (
                            <span className="text-gray-400 flex items-center gap-1"><RefreshCw size={12} className="animate-spin" /> calculating…</span>
                          ) : preview ? (
                            <span>{preview.total_count} customer(s) will be compensated ({preview.active_count} active, {preview.expired_count} recently expired)</span>
                          ) : (
                            <span className="text-gray-400">—</span>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex gap-3 px-6 py-4 border-t border-gray-200 dark:border-gray-700">
                  <button type="button" onClick={onClose}
                    className="flex-1 py-2.5 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300
                      bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                    Cancel
                  </button>
                  <button type="submit" disabled={saving}
                    className="flex-1 py-2.5 rounded-lg text-sm font-semibold text-white bg-emerald-600
                      hover:bg-emerald-700 disabled:opacity-60 transition-colors flex items-center justify-center gap-2">
                    {saving && <RefreshCw size={14} className="animate-spin" />}
                    {saving ? 'Recording…' : 'Record Incident'}
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

/* ---------------------------------------------------------------- */
/* Bulk Compensation Modal (by phone numbers)                        */
/* ---------------------------------------------------------------- */
const BulkCompensationModal = ({ open, onClose, graceSetting }) => {
  const [phones, setPhones] = useState('');
  const [graceValue, setGraceValue] = useState(graceSetting?.grace_period_value || 1);
  const [graceUnit, setGraceUnit] = useState(graceSetting?.grace_period_unit || 'days');
  const [lookbackDays, setLookbackDays] = useState(3);
  const [notify, setNotify] = useState(true);
  const [saving, setSaving] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    if (open) {
      setPhones(''); setResult(null); setNotify(true); setLookbackDays(3);
      setGraceValue(graceSetting?.grace_period_value || 1);
      setGraceUnit(graceSetting?.grace_period_unit || 'days');
    }
  }, [open, graceSetting]);

  const phoneList = useMemo(
    () => phones.split(/[\n,]/).map((p) => p.trim()).filter(Boolean),
    [phones]
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (phoneList.length === 0) return toast.error('Enter at least one phone number', { position: 'top-center' });
    setSaving(true);
    try {
      const response = await fetch('/api/hotspot_compensations/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Subdomain': subdomain },
        body: JSON.stringify({
          phone_numbers: phoneList, grace_value: graceValue, grace_unit: graceUnit,
          notify, expired_lookback_days: lookbackDays,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setResult(data);
        toast.success('Compensation applied', { position: 'top-center', duration: 3000 });
      } else {
        toast.error(data.error || 'Bulk compensation failed', { position: 'top-center', duration: 4000 });
      }
    } catch {
      toast.error('Network error during bulk compensation', { position: 'top-center', duration: 4000 });
    } finally {
      setSaving(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          onClick={onClose}>
          <motion.div initial={{ opacity: 0, scale: 0.96, y: 12 }} animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }} onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg bg-white dark:bg-gray-800 rounded-2xl shadow-2xl
              border border-gray-200 dark:border-gray-700 font-sans">
            {result ? (
              <div className="p-8 text-center">
                <div className="mx-auto w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-900/30
                  flex items-center justify-center mb-4">
                  <CheckCircle2 size={28} className="text-emerald-600 dark:text-emerald-400" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Customers compensated</h3>
                <div className="grid grid-cols-2 gap-3 my-6">
                  <div className="rounded-xl bg-gray-50 dark:bg-gray-700/50 p-4">
                    <p className="text-2xl font-extrabold text-gray-800 dark:text-white">{result.compensated_count}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mt-1">Vouchers compensated</p>
                  </div>
                  <div className="rounded-xl bg-gray-50 dark:bg-gray-700/50 p-4">
                    <p className="text-2xl font-extrabold text-gray-800 dark:text-white">{result.sms_sent_count}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mt-1">SMS sent</p>
                  </div>
                </div>
                <button onClick={onClose}
                  className="w-full py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold transition-colors">
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-2.5">
                    <span className="w-9 h-9 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                      <Phone size={16} className="text-purple-600 dark:text-purple-400" />
                    </span>
                    <div>
                      <h3 className="text-base font-bold text-gray-900 dark:text-white">Bulk Compensate</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Compensate specific customers by phone number</p>
                    </div>
                  </div>
                  <button type="button" onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                    <X size={18} className="text-gray-400" />
                  </button>
                </div>

                <div className="p-6 space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1.5">
                      Phone Numbers <span className="text-gray-400 font-normal">(comma or newline separated)</span>
                    </label>
                    <textarea rows={4} value={phones} onChange={(e) => setPhones(e.target.value)}
                      placeholder={"0712345678\n0798765432"}
                      className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50
                        dark:bg-gray-700 dark:text-white px-3 py-2 text-sm font-mono resize-none" />
                    <p className="text-xs text-gray-400 mt-1">{phoneList.length} number(s) detected</p>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1.5">Grace Length</label>
                      <input type="number" min={1} value={graceValue} onChange={(e) => setGraceValue(e.target.value)}
                        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50
                          dark:bg-gray-700 dark:text-white px-3 py-2 text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1.5">Unit</label>
                      <select value={graceUnit} onChange={(e) => setGraceUnit(e.target.value)}
                        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50
                          dark:bg-gray-700 dark:text-white px-3 py-2 text-sm">
                        <option value="minutes">Minutes</option>
                        <option value="hours">Hours</option>
                        <option value="days">Days</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1.5">
                        Expired within
                      </label>
                      <div className="flex items-center gap-1">
                        <input type="number" min={1} value={lookbackDays}
                          onChange={(e) => setLookbackDays(e.target.value)}
                          className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50
                            dark:bg-gray-700 dark:text-white px-2 py-2 text-sm" />
                        <span className="text-xs text-gray-400 shrink-0">days</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-[11px] text-gray-400 -mt-2">
                    Only vouchers currently active, or expired within this window, are compensated —
                    older expired vouchers for these numbers are left alone.
                  </p>

                  <label className="flex items-center justify-between cursor-pointer rounded-lg border
                    border-gray-200 dark:border-gray-700 p-3">
                    <span className="text-xs font-medium text-gray-600 dark:text-gray-300">Notify customers via SMS</span>
                    <input type="checkbox" checked={notify} onChange={(e) => setNotify(e.target.checked)}
                      className="w-4 h-4 rounded accent-emerald-600" />
                  </label>
                </div>

                <div className="flex gap-3 px-6 py-4 border-t border-gray-200 dark:border-gray-700">
                  <button type="button" onClick={onClose}
                    className="flex-1 py-2.5 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300
                      bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                    Cancel
                  </button>
                  <button type="submit" disabled={saving}
                    className="flex-1 py-2.5 rounded-lg text-sm font-semibold text-white bg-purple-600
                      hover:bg-purple-700 disabled:opacity-60 transition-colors flex items-center justify-center gap-2">
                    {saving && <RefreshCw size={14} className="animate-spin" />}
                    {saving ? 'Sending…' : (<><Send size={14} /> Compensate</>)}
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

/* ---------------------------------------------------------------- */
/* Incident Card                                                     */
/* ---------------------------------------------------------------- */
const IncidentCard = ({ incident, onRecompensate, onDelete, compensating }) => {
  const meta = TYPE_META[incident.incident_type] || TYPE_META.outage;
  const statusMeta = STATUS_META[incident.status] || STATUS_META.resolved;
  const Icon = meta.icon;

  return (
    <motion.div layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800
        overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-stretch">
        <div style={{ backgroundColor: meta.color }} className="w-1.5 shrink-0" />
        <div className="flex-1 p-4">
          <div className="flex items-start justify-between gap-3 mb-2">
            <div className="flex items-center gap-2.5">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg shrink-0" style={{ backgroundColor: meta.bg }}>
                <Icon size={15} style={{ color: meta.color }} />
              </span>
              <div>
                <p className="text-sm font-bold text-gray-900 dark:text-white font-sans">{incident.title}</p>
                <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-0.5">
                  <Clock size={11} /> {fmtDate(incident.start_time)}
                  {incident.end_time && <> — {fmtDate(incident.end_time)}</>}
                </div>
              </div>
            </div>
            <button onClick={() => onDelete(incident.id)}
              className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-500 transition-colors">
              <Trash2 size={15} />
            </button>
          </div>

          {incident.notes && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 line-clamp-2">{incident.notes}</p>
          )}

          <div className="flex items-center flex-wrap gap-2">
            <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold" style={{ backgroundColor: meta.bg, color: meta.text }}>
              {meta.label}
            </span>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold" style={{ backgroundColor: statusMeta.bg, color: statusMeta.text }}>
              {statusMeta.label}
            </span>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 capitalize">
              {incident.service_type}
            </span>
            {incident.router_scope === 'specific' && incident.affected_routers?.length > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-300">
                {incident.affected_routers.length} router(s)
              </span>
            )}
            {incident.compensate && (
              <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400">
                ≤{incident.expired_lookback_days ?? 3}d expired window
              </span>
            )}

            {typeof incident.compensated_count === 'number' && (
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold
                bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300">
                <Users size={11} /> {incident.compensated_count} compensated
              </span>
            )}
            {typeof incident.sms_sent_count === 'number' && (
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold
                bg-sky-50 dark:bg-sky-900/20 text-sky-700 dark:text-sky-300">
                <Send size={11} /> {incident.sms_sent_count} SMS sent
              </span>
            )}

            {incident.compensate && (
              <button onClick={() => onRecompensate(incident.id)} disabled={compensating}
                className="ml-auto flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold
                  text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 transition-colors">
                {compensating ? <RefreshCw size={12} className="animate-spin" /> : <ShieldCheck size={12} />}
                {incident.compensated_at ? 'Re-compensate' : 'Compensate'}
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

/* ---------------------------------------------------------------- */
/* Main Page                                                          */
/* ---------------------------------------------------------------- */
const HotspotIncidents = () => {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [routers, setRouters] = useState([]);
  const [graceSetting, setGraceSetting] = useState(null);
  const [showRecord, setShowRecord] = useState(false);
  const [showBulk, setShowBulk] = useState(false);
  const [showGuide, setShowGuide] = useState(true);
  const [compensatingId, setCompensatingId] = useState(null);

  const now = new Date();
  const defaultMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const [filters, setFilters] = useState({ month: defaultMonth, type: 'all', status: 'all' });

  const fetchIncidents = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.month) params.set('month', filters.month);
      if (filters.type !== 'all') params.set('type', filters.type);
      if (filters.status !== 'all') params.set('status', filters.status);
      const response = await fetch(`/api/incidents?${params.toString()}`, { headers: { 'X-Subdomain': subdomain } });
      const data = await response.json();
      if (response.ok) setIncidents(data);
    } catch {
      toast.error('Failed to load incidents', { position: 'top-center' });
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => { fetchIncidents(); }, [fetchIncidents]);

  useEffect(() => {
    (async () => {
      try {
        const r = await fetch('/api/routers', { headers: { 'X-Subdomain': subdomain } });
        if (r.ok) setRouters(await r.json());
      } catch {}
      try {
        const g = await fetch('/api/grace_period_setting', { headers: { 'X-Subdomain': subdomain } });
        if (g.ok) setGraceSetting(await g.json());
      } catch {}
    })();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this incident record? This does not reverse any compensation already applied.')) return;
    try {
      const response = await fetch(`/api/incidents/${id}`, { method: 'DELETE', headers: { 'X-Subdomain': subdomain } });
      if (response.ok || response.status === 204) {
        setIncidents((prev) => prev.filter((i) => i.id !== id));
        toast.success('Incident deleted', { position: 'top-center' });
      } else {
        toast.error('Failed to delete incident', { position: 'top-center' });
      }
    } catch {
      toast.error('Network error while deleting', { position: 'top-center' });
    }
  };

  const handleRecompensate = async (id) => {
    setCompensatingId(id);
    try {
      const response = await fetch(`/api/incidents/${id}/compensate`, { method: 'POST', headers: { 'X-Subdomain': subdomain } });
      const data = await response.json();
      if (response.ok) {
        toast.success(
          `Compensated ${data.compensation_result.compensated_count} voucher(s), sent ${data.compensation_result.sms_sent_count} SMS`,
          { position: 'top-center', duration: 4000 }
        );
        fetchIncidents();
      } else {
        toast.error(data.error || 'Compensation failed', { position: 'top-center', duration: 4000 });
      }
    } catch {
      toast.error('Network error during compensation', { position: 'top-center', duration: 4000 });
    } finally {
      setCompensatingId(null);
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-5 font-sans">
      <Toaster />
      <RecordIncidentModal open={showRecord} onClose={() => { setShowRecord(false); fetchIncidents(); }}
        onCreated={fetchIncidents} routers={routers} graceSetting={graceSetting} />
      <BulkCompensationModal open={showBulk} onClose={() => setShowBulk(false)} graceSetting={graceSetting} />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-9 h-9 rounded-lg bg-gradient-to-r from-red-500 to-orange-500
              flex items-center justify-center shadow-sm">
              <AlertTriangle size={18} className="text-white" />
            </span>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">Incident Reports</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">Track and manage network incidents for customer compensation</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowBulk(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-white
              bg-purple-600 hover:bg-purple-700 shadow-sm transition-colors">
            <Phone size={15} /> Bulk Compensate
          </button>
          <button onClick={() => setShowRecord(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-white
              bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700
              shadow-sm transition-colors">
            <Plus size={15} /> Record Incident
          </button>
        </div>
      </div>

      {/* About + classification guide */}
      <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden">
        <button onClick={() => setShowGuide((s) => !s)}
          className="w-full flex items-center justify-between px-4 py-3">
          <span className="flex items-center gap-2 text-sm font-semibold text-gray-800 dark:text-white">
            <Info size={15} className="text-blue-500" /> About Incident Reporting
          </span>
          <ChevronDown size={16} className={`text-gray-400 transition-transform ${showGuide ? 'rotate-180' : ''}`} />
        </button>
        <AnimatePresence>
          {showGuide && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
              <div className="px-4 pb-4 space-y-3">
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                  This log serves as the official record of service interruptions. Accurate reporting is
                  crucial for calculating SLA compliance, determining customer compensation, and identifying
                  infrastructure reliability trends.
                </p>
                <p className="text-xs font-semibold text-gray-600 dark:text-gray-300">Incident Classification Guide</p>
                <ClassificationGuide />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 bg-white dark:bg-gray-800 rounded-xl border
        border-gray-200 dark:border-gray-700 p-3">
        <div className="flex items-center gap-2">
          <CalendarDays size={14} className="text-gray-400" />
          <input type="month" value={filters.month} onChange={(e) => setFilters((f) => ({ ...f, month: e.target.value }))}
            className="rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700
              dark:text-white px-2.5 py-1.5 text-xs" />
        </div>
        <select value={filters.type} onChange={(e) => setFilters((f) => ({ ...f, type: e.target.value }))}
          className="rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700
            dark:text-white px-2.5 py-1.5 text-xs">
          <option value="all">All Types</option>
          <option value="outage">Outage</option>
          <option value="maintenance">Maintenance</option>
          <option value="degradation">Degradation</option>
        </select>
        <select value={filters.status} onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))}
          className="rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700
            dark:text-white px-2.5 py-1.5 text-xs">
          <option value="all">All Incidents</option>
          <option value="ongoing">Ongoing</option>
          <option value="resolved">Resolved</option>
        </select>
        <button onClick={fetchIncidents}
          className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold
            text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700">
          <RefreshCw size={12} className={loading ? 'animate-spin' : ''} /> Refresh
        </button>
      </div>

      {/* List */}
      <div>
        <p className="text-xs text-gray-400 mb-2">{incidents.length} incident(s) recorded</p>
        {loading ? (
          <div className="flex justify-center py-16">
            <RefreshCw size={24} className="animate-spin text-emerald-500" />
          </div>
        ) : incidents.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 rounded-xl border
            border-dashed border-gray-300 dark:border-gray-700">
            <Wifi className="w-12 h-12 text-gray-300 mb-3" />
            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">No incidents recorded for this period</p>
          </div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence>
              {incidents.map((incident) => (
                <IncidentCard key={incident.id} incident={incident}
                  onRecompensate={handleRecompensate} onDelete={handleDelete}
                  compensating={compensatingId === incident.id} />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default HotspotIncidents;