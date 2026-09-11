import { useState, useEffect, useCallback, useMemo } from 'react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import {
  RefreshCw, Plus, Search, X, Wand2, Trash2, Pencil,
  RotateCw, CheckCircle2, XCircle, Server
} from 'lucide-react';

const FONT = { fontFamily: "'IBM Plex Mono', ui-monospace, monospace" };

const emptyForm = {
  name: '',
  nas_router_id: '',
  ip_range_start: '',
  ip_range_end: '',
  subnet_mask: '',
  gateway: '',
  primary_dns: '',
  secondary_dns: '',
  description: '',
  sync_immediately: true
};

const StatusBadge = ({ status }) => {
  const active = status === 'active';
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px]
        uppercase tracking-wider font-medium border ${
        active
          ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/30'
          : 'bg-gray-100 text-gray-500 border-gray-200 dark:bg-gray-500/10 dark:text-gray-400 dark:border-gray-500/30'
      }`}
      style={FONT}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${active ? 'bg-emerald-500 dark:bg-emerald-400' : 'bg-gray-400 dark:bg-gray-500'}`} />
      {status}
    </span>
  );
};

const UsageBar = ({ used, total }) => {
  const pct = total > 0 ? Math.min(100, Math.round((used / total) * 100)) : 0;
  const color = pct > 85 ? 'bg-red-500' : pct > 60 ? 'bg-amber-500' : 'bg-emerald-500';
  return (
    <div className="w-24 h-1.5 rounded-full bg-gray-200 dark:bg-white/5 overflow-hidden">
      <div className={`h-full ${color} transition-all`} style={{ width: `${pct}%` }} />
    </div>
  );
};

const IpPools = () => {
  const [pools, setPools] = useState([]);
  const [routers, setRouters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncingAll, setSyncingAll] = useState(false);
  const [syncingId, setSyncingId] = useState(null);
  const [query, setQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const subdomain = window.location.hostname.split('.')[0];
  const headers = { 'Content-Type': 'application/json', 'X-Subdomain': subdomain };

  const fetchPools = useCallback(async () => {
    try {
      const res = await fetch('/api/ip_pools', { headers, credentials: 'include' });
      if (!res.ok) throw new Error();
      setPools(await res.json());
    } catch {
      toast.error('Failed to load IP pools');
    } finally {
      setLoading(false);
    }
  }, [subdomain]);

  const fetchRouters = useCallback(async () => {
    try {
      const res = await fetch('/api/routers', { headers, credentials: 'include' });
      if (res.ok) setRouters(await res.json());
    } catch {
      // non-fatal, router select just stays empty
    }
  }, [subdomain]);

  useEffect(() => {
    fetchPools();
    fetchRouters();
  }, [fetchPools, fetchRouters]);

  const filtered = useMemo(() => {
    if (!query.trim()) return pools;
    const q = query.toLowerCase();
    return pools.filter(p =>
      p.name?.toLowerCase().includes(q) ||
      `${p.ip_range_start} ${p.ip_range_end}`.toLowerCase().includes(q)
    );
  }, [pools, query]);

  const handleSyncAll = async () => {
    setSyncingAll(true);
    try {
      const res = await fetch('/api/ip_pools/sync_all', { method: 'POST', headers, credentials: 'include' });
      if (!res.ok) throw new Error();
      const data = await res.json();
      toast.success(`Queued ${data.queued} pool(s) for sync`);
      setTimeout(fetchPools, 2500);
    } catch {
      toast.error('Failed to queue sync');
    } finally {
      setSyncingAll(false);
    }
  };

  const handleSyncOne = async (pool) => {
    setSyncingId(pool.id);
    try {
      const res = await fetch(`/api/ip_pools/${pool.id}/sync`, { method: 'POST', headers, credentials: 'include' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Sync failed');
      toast.success(`${pool.name} synced to MikroTik`);
      fetchPools();
    } catch (e) {
      toast.error(e.message || 'Sync failed');
    } finally {
      setSyncingId(null);
    }
  };

  const handleAutoGenerate = async () => {
    setGenerating(true);
    try {
      const res = await fetch('/api/ip_pools/suggest_range', { headers, credentials: 'include' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Could not generate a range');
      setForm(prev => ({ ...prev, ...data }));
    } catch (e) {
      toast.error(e.message);
    } finally {
      setGenerating(false);
    }
  };

  const openCreate = () => {
    setForm(emptyForm);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/ip_pools', {
        method: 'POST',
        headers,
        credentials: 'include',
        body: JSON.stringify({
          ip_pool: {
            name: form.name,
            nas_router_id: form.nas_router_id,
            ip_range_start: form.ip_range_start,
            ip_range_end: form.ip_range_end,
            subnet_mask: form.subnet_mask,
            gateway: form.gateway,
            primary_dns: form.primary_dns,
            secondary_dns: form.secondary_dns,
            description: form.description
          },
          sync_immediately: form.sync_immediately
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error((data.errors || [data.error]).filter(Boolean).join(', '));
      toast.success('Pool created');
      if (data.sync_error) toast.error(`Created, but sync failed: ${data.sync_error}`);
      setShowModal(false);
      fetchPools();
    } catch (e) {
      toast.error(e.message || 'Failed to create pool');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      const res = await fetch(`/api/ip_pools/${deleteTarget.id}`, {
        method: 'DELETE', headers, credentials: 'include'
      });
      if (!res.ok) throw new Error();
      toast.success('Pool deleted');
      setPools(prev => prev.filter(p => p.id !== deleteTarget.id));
    } catch {
      toast.error('Failed to delete pool');
    } finally {
      setDeleteTarget(null);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0f0d] text-gray-800 dark:text-gray-200 p-6" style={FONT}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white tracking-tight">PPPoE IP Pools</h1>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">Manage PPPoE IP address pools</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleSyncAll}
            disabled={syncingAll}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium
              bg-gray-50 text-emerald-700 border border-emerald-300
              hover:bg-emerald-50 transition-colors disabled:opacity-50
              dark:bg-white/5 dark:text-emerald-400 dark:border-emerald-500/30 dark:hover:bg-emerald-500/10"
          >
            <RefreshCw size={15} className={syncingAll ? 'animate-spin' : ''} />
            Sync
          </button>
          <button
            onClick={openCreate}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium
              bg-emerald-600 text-white hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-500/10
              dark:bg-emerald-500 dark:text-black dark:hover:bg-emerald-400 dark:shadow-emerald-500/20"
          >
            <Plus size={15} />
            Create Pool
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-4 max-w-sm">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-600" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by pool name or IP range..."
          className="w-full pl-9 pr-3 py-2 rounded-lg bg-white border border-gray-300
            text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none
            focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30
            dark:bg-white/5 dark:border-white/10 dark:text-gray-200 dark:placeholder:text-gray-600
            dark:focus:border-emerald-500/50 dark:focus:ring-emerald-500/30"
        />
      </div>

      {/* Table */}
      <div className="rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/[0.02] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-white/10 text-left text-[11px] uppercase
                tracking-wider text-gray-500 dark:text-gray-500">
                <th className="px-4 py-3 font-medium">Pool Name</th>
                <th className="px-4 py-3 font-medium">Router</th>
                <th className="px-4 py-3 font-medium">IP Range</th>
                <th className="px-4 py-3 font-medium text-right">Total</th>
                <th className="px-4 py-3 font-medium text-right">Used</th>
                <th className="px-4 py-3 font-medium">Available</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr><td colSpan={8} className="px-4 py-8 text-center text-gray-400 dark:text-gray-600">Loading pools…</td></tr>
              )}
              {!loading && filtered.length === 0 && (
                <tr><td colSpan={8} className="px-4 py-8 text-center text-gray-400 dark:text-gray-600">No pools found.</td></tr>
              )}
              {!loading && filtered.map((pool) => (
                <tr key={pool.id} className="border-b border-gray-100 dark:border-white/5 last:border-0
                  hover:bg-gray-50 dark:hover:bg-white/[0.03] transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{pool.name}</td>
                  <td className="px-4 py-3 text-gray-500 dark:text-gray-400">
                    <span className="inline-flex items-center gap-1.5">
                      <Server size={13} className="text-emerald-600/70 dark:text-emerald-500/70" />
                      {pool.router_name || '—'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500 dark:text-gray-400 whitespace-nowrap">
                    {pool.ip_range_start} - {pool.ip_range_end}
                  </td>
                  <td className="px-4 py-3 text-right text-gray-700 dark:text-gray-300">{pool.total_ips?.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right text-gray-700 dark:text-gray-300">{pool.used_ips?.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <UsageBar used={pool.used_ips} total={pool.total_ips} />
                      <span className="text-xs text-gray-500">{pool.available_ips?.toLocaleString()}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3"><StatusBadge status={pool.status} /></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        title={pool.synced ? 'Re-sync to MikroTik' : 'Sync to MikroTik'}
                        onClick={() => handleSyncOne(pool)}
                        disabled={syncingId === pool.id}
                        className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10
                          text-gray-500 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                      >
                        {syncingId === pool.id
                          ? <RotateCw size={15} className="animate-spin" />
                          : pool.synced
                            ? <CheckCircle2 size={15} className="text-emerald-600 dark:text-emerald-500" />
                            : <XCircle size={15} className="text-amber-500" />}
                      </button>
                      <button
                        title="Edit"
                        className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10
                          text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        title="Delete"
                        onClick={() => setDeleteTarget(pool)}
                        className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10
                          text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Pool Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 dark:bg-black/70
              backdrop-blur-sm px-4"
            onClick={() => !saving && setShowModal(false)}
          >
            <motion.form
              onSubmit={handleSubmit}
              initial={{ opacity: 0, scale: 0.96, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 10 }}
              onClick={(e) => e.stopPropagation()}
              style={FONT}
              className="w-full max-w-lg max-h-[88vh] overflow-y-auto rounded-2xl
                bg-white dark:bg-[#0d1512] border border-gray-200 dark:border-emerald-500/20
                shadow-2xl shadow-black/10 dark:shadow-black/50 p-6"
            >
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-base font-semibold text-gray-900 dark:text-white">Create PPPoE IP Pool</h3>
                <button type="button" onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-900 dark:text-gray-500 dark:hover:text-white">
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-4">
                <Field label="Pool Name *">
                  <input required value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className={inputCls} placeholder="e.g. 20Mbps Pool" />
                </Field>

                <Field label="Router *">
                  <select required value={form.nas_router_id}
                    onChange={(e) => setForm({ ...form, nas_router_id: e.target.value })}
                    className={inputCls}>
                    <option value="">Select router</option>
                    {routers.map(r => (
                      <option key={r.id} value={r.id}>{r.name} ({r.ip_address})</option>
                    ))}
                  </select>
                </Field>

                <div className="rounded-lg border border-emerald-200 dark:border-emerald-500/20
                  bg-emerald-50 dark:bg-emerald-500/5 p-3">
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                    Auto-generate a conflict-free /19 block (~8,000+ IPs) from the 10.x.x.x private range. All fields remain editable.
                  </p>
                  <button
                    type="button"
                    onClick={handleAutoGenerate}
                    disabled={generating}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium
                      bg-emerald-100 text-emerald-700 border border-emerald-300
                      hover:bg-emerald-200 transition-colors disabled:opacity-50
                      dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/30 dark:hover:bg-emerald-500/20"
                  >
                    <Wand2 size={13} className={generating ? 'animate-pulse' : ''} />
                    {generating ? 'Generating…' : 'Auto Generate'}
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Field label="IP Range Start *">
                    <input required value={form.ip_range_start}
                      onChange={(e) => setForm({ ...form, ip_range_start: e.target.value })}
                      className={inputCls} placeholder="10.100.32.10" />
                  </Field>
                  <Field label="IP Range End *">
                    <input required value={form.ip_range_end}
                      onChange={(e) => setForm({ ...form, ip_range_end: e.target.value })}
                      className={inputCls} placeholder="10.100.35.253" />
                  </Field>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Field label="Subnet Mask *">
                    <input required value={form.subnet_mask}
                      onChange={(e) => setForm({ ...form, subnet_mask: e.target.value })}
                      className={inputCls} placeholder="255.255.224.0" />
                  </Field>
                  <Field label="Gateway *">
                    <input required value={form.gateway}
                      onChange={(e) => setForm({ ...form, gateway: e.target.value })}
                      className={inputCls} placeholder="10.100.32.1" />
                  </Field>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Field label="Primary DNS">
                    <input value={form.primary_dns}
                      onChange={(e) => setForm({ ...form, primary_dns: e.target.value })}
                      className={inputCls} placeholder="8.8.8.8" />
                  </Field>
                  <Field label="Secondary DNS">
                    <input value={form.secondary_dns}
                      onChange={(e) => setForm({ ...form, secondary_dns: e.target.value })}
                      className={inputCls} placeholder="8.8.4.4" />
                  </Field>
                </div>

                <Field label="Description">
                  <textarea value={form.description} rows={2}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className={inputCls} />
                </Field>

                <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
                  <input type="checkbox" checked={form.sync_immediately}
                    onChange={(e) => setForm({ ...form, sync_immediately: e.target.checked })}
                    className="w-4 h-4 rounded accent-emerald-500" />
                  Sync to MikroTik immediately
                </label>
              </div>

              <div className="flex gap-3 mt-6">
                <button type="button" onClick={() => setShowModal(false)}
                  className="flex-1 py-2.5 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300
                    bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={saving}
                  className="flex-1 py-2.5 rounded-lg text-sm font-medium text-white dark:text-black
                    bg-emerald-600 dark:bg-emerald-500 hover:bg-emerald-700 dark:hover:bg-emerald-400
                    transition-colors disabled:opacity-60
                    flex items-center justify-center gap-2">
                  {saving && <RotateCw size={14} className="animate-spin" />}
                  {saving ? 'Creating…' : 'Create Pool'}
                </button>
              </div>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete confirm */}
      <AnimatePresence>
        {deleteTarget && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 dark:bg-black/70 backdrop-blur-sm px-4"
            onClick={() => setDeleteTarget(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }}
              onClick={(e) => e.stopPropagation()}
              style={FONT}
              className="w-full max-w-sm rounded-2xl bg-white dark:bg-[#0d1512]
                border border-gray-200 dark:border-red-500/20 shadow-2xl p-6"
            >
              <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-2">Delete pool?</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                This removes <span className="text-gray-900 dark:text-white">{deleteTarget.name}</span> from your account. It will not be removed from the router automatically.
              </p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteTarget(null)}
                  className="flex-1 py-2.5 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300
                    bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10">
                  Cancel
                </button>
                <button onClick={handleDelete}
                  className="flex-1 py-2.5 rounded-lg text-sm font-medium text-white bg-red-600 hover:bg-red-700">
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const inputCls = "w-full px-3 py-2 rounded-lg bg-white border border-gray-300 text-sm " +
  "text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-emerald-500 " +
  "focus:ring-1 focus:ring-emerald-500/30 " +
  "dark:bg-white/5 dark:border-white/10 dark:text-gray-200 dark:placeholder:text-gray-600 " +
  "dark:focus:border-emerald-500/50 dark:focus:ring-emerald-500/30";

const Field = ({ label, children }) => (
  <div>
    <label className="block text-xs text-gray-500 dark:text-gray-500 mb-1">{label}</label>
    {children}
  </div>
);

export default IpPools;