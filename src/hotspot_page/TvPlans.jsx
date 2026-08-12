import { useState, useEffect, useCallback } from 'react';
import { Plus, Pencil, Trash2, Tv, RefreshCw, X, Router } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

const sd = () => window.location.hostname.split('.')[0];

function PlanModal({ plan, routers, onClose, onSaved }) {
  const [form, setForm] = useState({
    name: plan?.name || '', price: plan?.price || '',
    validity: plan?.validity || '', validity_period_units: plan?.validity_period_units || 'hours',
    download_limit: plan?.download_limit || '', upload_limit: plan?.upload_limit || '',
    active: plan?.active ?? true,
    nas_router_id: plan?.nas_router_id || '',
  });
  const [saving, setSaving] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.nas_router_id) { toast.error('Select a router before creating the plan'); return; }
    setSaving(true);
    try {
      const url = plan ? `/api/tv_plans/${plan.id}` : '/api/tv_plans';
      const res = await fetch(url, {
        method: plan ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Subdomain': sd() },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error?.join?.(', ') || 'Failed to save plan'); return; }
      toast.success(plan ? 'Plan updated' : 'Plan created');
      onSaved(data); onClose();
    } catch { toast.error('Network error'); } finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 z-[60] bg-black/50 flex items-center justify-center p-4 font-sans"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold dark:text-white">{plan ? 'Edit' : 'Add'} TV Plan</h3>
          <button onClick={onClose}><X className="w-5 h-5 text-gray-400" /></button>
        </div>
        <form onSubmit={submit} className="space-y-3">

          {/* Router — required, first field */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">
              <Router className="w-3.5 h-3.5" /> Router <span className="text-red-500">*</span>
            </label>
            <select
              className="w-full border rounded-lg p-2.5 dark:bg-gray-700 dark:text-white"
              value={form.nas_router_id}
              onChange={e => setForm({ ...form, nas_router_id: e.target.value })}
              required
            >
              <option value="">— Select router —</option>
              {routers.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
            </select>
            {!form.nas_router_id && (
              <p className="text-xs text-amber-600 mt-1">A router must be selected before this plan can be saved.</p>
            )}
          </div>

          <input className="w-full border rounded-lg p-2.5 dark:bg-gray-700 dark:text-white" placeholder="Plan name (e.g. TV Daily)"
            value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
          <div className="grid grid-cols-2 gap-3">
            <input type="number" className="border rounded-lg p-2.5 dark:bg-gray-700 dark:text-white" placeholder="Price (KES)"
              value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} required />
            <input type="number" className="border rounded-lg p-2.5 dark:bg-gray-700 dark:text-white" placeholder="Validity"
              value={form.validity} onChange={e => setForm({ ...form, validity: e.target.value })} required />
          </div>
          <select className="w-full border rounded-lg p-2.5 dark:bg-gray-700 dark:text-white"
            value={form.validity_period_units} onChange={e => setForm({ ...form, validity_period_units: e.target.value })}>
            <option value="minutes">Minutes</option>
            <option value="hours">Hours</option>
            <option value="days">Days</option>
          </select>
          <div className="grid grid-cols-2 gap-3">
            <input type="number" className="border rounded-lg p-2.5 dark:bg-gray-700 dark:text-white" placeholder="Upload (Mbps)"
              value={form.upload_limit} onChange={e => setForm({ ...form, upload_limit: e.target.value })} />
            <input type="number" className="border rounded-lg p-2.5 dark:bg-gray-700 dark:text-white" placeholder="Download (Mbps)"
              value={form.download_limit} onChange={e => setForm({ ...form, download_limit: e.target.value })} />
          </div>
          <label className="flex items-center gap-2 text-sm dark:text-gray-300">
            <input type="checkbox" checked={form.active} onChange={e => setForm({ ...form, active: e.target.checked })} />
            Active (visible to customers)
          </label>
          <button type="submit" disabled={saving || !form.nas_router_id} className="w-full py-2.5 bg-purple-600 text-white rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed">
            {saving ? 'Saving…' : 'Save Plan'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function TvPlans() {
  const [plans, setPlans] = useState([]);
  const [routers, setRouters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [pRes, rRes] = await Promise.all([
        fetch('/api/tv_plans', { headers: { 'X-Subdomain': sd() } }),
        fetch('/api/routers',  { headers: { 'X-Subdomain': sd() } }),
      ]);
      setPlans(await pRes.json());
      const rData = await rRes.json();
      setRouters(Array.isArray(rData) ? rData : rData.routers || []);
    } catch { toast.error('Failed to load TV plans'); } finally { setLoading(false); }
  }, []);
  useEffect(() => { load(); }, [load]);

  const remove = async (plan) => {
    if (!window.confirm(`Delete "${plan.name}"?`)) return;
    const res = await fetch(`/api/tv_plans/${plan.id}`, { method: 'DELETE', headers: { 'X-Subdomain': sd() } });
    if (res.ok) { toast.success('Deleted'); setPlans(p => p.filter(x => x.id !== plan.id)); }
    else toast.error('Delete failed');
  };

  const openAdd = () => {
    if (routers.length === 0) {
      toast.error('Add a MikroTik router first — TV plans need one assigned');
      return;
    }
    setShowAdd(true);
  };

  return (
    <div className="p-6 font-sans">
      <Toaster />
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold dark:text-white flex items-center gap-2"><Tv className="w-6 h-6 text-purple-500" /> TV Plans</h1>
          <p className="text-sm text-gray-500">Plans customers can buy to connect a TV/console by MAC address.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={load} className="flex items-center gap-2 border rounded-lg px-3 py-2 text-sm">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
          </button>
          <button onClick={openAdd} className="flex items-center gap-2 bg-purple-600 text-white rounded-lg px-4 py-2 text-sm">
            <Plus className="w-4 h-4" /> Add TV Plan
          </button>
        </div>
      </div>

      {showAdd && <PlanModal routers={routers} onClose={() => setShowAdd(false)} onSaved={p => setPlans(prev => [...prev, p])} />}
      {editing && <PlanModal plan={editing} routers={routers} onClose={() => setEditing(null)} onSaved={p => setPlans(prev => prev.map(x => x.id === p.id ? p : x))} />}

      <div className="bg-white dark:bg-gray-800 rounded-2xl divide-y dark:divide-gray-700 shadow-sm">
        {plans.length === 0 && !loading && <p className="p-6 text-center text-gray-400 text-sm">No TV plans yet — add one to let customers connect TVs.</p>}
        {plans.map(plan => (
          <div key={plan.id} className="flex items-center justify-between p-4">
            <div>
              <p className="font-semibold dark:text-white">{plan.name} {!plan.active && <span className="text-xs text-red-500 ml-2">(hidden)</span>}</p>
              <p className="text-xs text-gray-500">KES {plan.price} · {plan.validity} {plan.validity_period_units} · {plan.upload_limit || '—'}/{plan.download_limit || '—'} Mbps</p>
              <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                <Router className="w-3 h-3" /> {plan.router_name || 'No router assigned'}
              </p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setEditing(plan)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg"><Pencil className="w-4 h-4" /></button>
              <button onClick={() => remove(plan)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}