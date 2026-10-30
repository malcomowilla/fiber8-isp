import { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import RefreshIcon from '@mui/icons-material/Refresh';
import Modal from './Modal';
import RouterDetails from './RouterDetails';
import { apiFetch, readJson } from '../utils/routerApi';

const btn = `inline-flex h-8 items-center gap-1.5 rounded-lg border border-black/10 px-3 text-xs font-medium
  text-black transition-colors hover:bg-black/5 disabled:opacity-50 dark:border-white/10 dark:text-white dark:hover:bg-white/10`;
const input = `h-10 w-full rounded-lg border border-black/10 bg-transparent px-3 text-sm text-black outline-none
  focus:border-black/40 dark:border-white/10 dark:text-white dark:focus:border-white/40`;

const StatusBadge = ({ reachable }) => {
  const map = {
    true: { dot: 'bg-emerald-500', text: 'Reachable' },
    false: { dot: 'bg-red-500', text: 'Not reachable' },
    undefined: { dot: 'bg-gray-400', text: 'Checking…' },
  };
  const s = map[String(reachable)] || map.undefined;
  return (
    <span className="inline-flex items-center gap-2 text-sm text-black dark:text-white">
      <span className={`h-2 w-2 rounded-full ${s.dot}`} />
      {s.text}
    </span>
  );
};

// ── Add / edit form ──────────────────────────────────────────────────────────
const RouterFormModal = ({ router, onClose, onSaved }) => {
  const isEdit = Boolean(router);
  const [form, setForm] = useState({
    name: router?.name || '',
    ip_address: router?.ip_address || '',
    username: router?.username || '',
    password: '',
    location: router?.location || '',
  });
  const [saving, setSaving] = useState(false);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form };
      if (isEdit && !payload.password) delete payload.password;
      const res = await apiFetch(isEdit ? `/api/update_router/${router.id}` : '/api/create_router', {
        method: isEdit ? 'PATCH' : 'POST',
        body: { nas_router: payload },
      });
      const data = await readJson(res);
      if (!res.ok) throw new Error(data.error || 'Request failed');
      toast.success(isEdit ? 'Router updated' : 'Router added', { position: 'top-center' });
      onSaved();
      onClose();
    } catch (err) {
      toast.error(err.message, { position: 'top-center' });
    } finally {
      setSaving(false);
    }
  };

  const Field = ({ label, children, hint }) => (
    <label className="block">
      <span className="mb-1 block text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-gray-500 dark:text-gray-400">{hint}</span>}
    </label>
  );

  return (
    <Modal
      title={isEdit ? `Edit ${router.name}` : 'Add router'}
      onClose={onClose}
      footer={
        <>
          <button type="button" className={btn} onClick={onClose}>Cancel</button>
          <button type="submit" form="router-form" disabled={saving}
            className="inline-flex h-8 items-center rounded-lg bg-black px-4 text-xs font-semibold text-white disabled:opacity-50 dark:bg-white dark:text-black">
            {saving ? 'Saving…' : isEdit ? 'Save changes' : 'Add router'}
          </button>
        </>
      }
    >
      <form id="router-form" onSubmit={submit} className="space-y-4">
        <Field label="Name"><input required className={input} value={form.name} onChange={set('name')} /></Field>
        <Field label="IP address"><input required className={`${input} font-mono`} value={form.ip_address} onChange={set('ip_address')} /></Field>
        <Field label="Location"><input className={input} value={form.location} onChange={set('location')} /></Field>
        <Field label="API username"><input required className={input} value={form.username} onChange={set('username')} autoComplete="off" /></Field>
        <Field
          label="API password"
          hint={
            isEdit
              ? 'Leave blank to keep the saved one. This only updates what the platform uses to connect. To change the password on the router itself, open Details → Router login.'
              : 'The platform uses this login to talk to the router.'
          }
        >
          <input required={!isEdit} type="password" className={input} value={form.password}
            onChange={set('password')} autoComplete="new-password" />
        </Field>
      </form>
    </Modal>
  );
};

// ── Main table ───────────────────────────────────────────────────────────────
const NasRoutersTable = () => {
  const [routers, setRouters] = useState([]);
  const [statuses, setStatuses] = useState({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState(null);
  const [formTarget, setFormTarget] = useState(null); // null | 'new' | router
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const loadRouters = useCallback(async () => {
    try {
      const res = await apiFetch('/api/routers');
      if (!res.ok) throw new Error('Failed to load routers');
      setRouters(await res.json());
    } catch (err) {
      toast.error(err.message, { position: 'top-center' });
    } finally {
      setLoading(false);
    }
  }, []);

  const loadStatuses = useCallback(async () => {
    try {
      const res = await apiFetch('/api/router_ping_response');
      if (!res.ok) return;
      const data = await res.json();
      const map = {};
      data.forEach((s) => { map[s.ip] = s.reachable; });
      setStatuses(map);
    } catch { /* silent */ }
  }, []);

  useEffect(() => { loadRouters(); }, [loadRouters]);
  useEffect(() => {
    loadStatuses();
    const t = setInterval(loadStatuses, 15000);
    return () => clearInterval(t);
  }, [loadStatuses]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return routers;
    return routers.filter((r) =>
      [r.name, r.ip_address, r.location].some((v) => v?.toLowerCase().includes(q)));
  }, [routers, search]);

  const confirmDelete = async () => {
    setDeleting(true);
    try {
      const res = await apiFetch(`/api/delete_router/${deleteTarget.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error((await readJson(res)).error || 'Failed to delete router');
      toast.success('Router deleted', { position: 'top-center' });
      if (expandedId === deleteTarget.id) setExpandedId(null);
      setDeleteTarget(null);
      loadRouters();
    } catch (err) {
      toast.error(err.message, { position: 'top-center' });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="font-sans antialiased">
      <Toaster />

      {/* Toolbar */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-black dark:text-white">Routers</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {routers.length} router{routers.length === 1 ? '' : 's'} · use “View details” on a row for live info,
            reachability history and remote access
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <SearchIcon className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" style={{ width: 18, height: 18 }} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, IP or location"
              className="h-9 w-64 rounded-lg border border-black/10 bg-transparent pl-8 pr-3 text-sm text-black outline-none
                focus:border-black/40 dark:border-white/10 dark:text-white dark:focus:border-white/40"
            />
          </div>
          <button className={btn} onClick={() => { loadRouters(); loadStatuses(); }} title="Reload the list and statuses">
            <RefreshIcon style={{ width: 16, height: 16 }} /> Refresh
          </button>
          <button
            onClick={() => setFormTarget('new')}
            title="Register a new router on the platform"
            className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-black px-3 text-xs font-semibold text-white dark:bg-white dark:text-black"
          >
            <AddIcon style={{ width: 16, height: 16 }} /> Add router
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl border border-black/10 dark:border-white/10">
        <table className="w-full min-w-[760px] text-left">
          <thead>
            <tr className="border-b border-black/10 text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:border-white/10 dark:text-gray-400">
              <th className="px-4 py-3">Router</th>
              <th className="px-4 py-3">IP address</th>
              <th className="px-4 py-3">Location</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="px-4 py-12 text-center text-sm text-gray-500">Loading routers…</td></tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-12 text-center text-sm text-gray-500">
                  {routers.length === 0 ? 'No routers yet. Click “Add router” to register one.' : 'No routers match your search.'}
                </td>
              </tr>
            ) : filtered.map((r) => {
              const open = expandedId === r.id;
              const reachable = statuses[r.ip_address];
              return (
                <Fragment key={r.id}>
                  <tr className={`border-b border-black/5 last:border-0 dark:border-white/5 ${open ? 'bg-black/[0.03] dark:bg-white/[0.04]' : ''}`}>
                    <td className="px-4 py-3 text-sm font-medium text-black dark:text-white">{r.name}</td>
                    <td className="px-4 py-3 font-mono text-sm text-black dark:text-white">{r.ip_address}</td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{r.location || '—'}</td>
                    <td className="px-4 py-3"><StatusBadge reachable={reachable} /></td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <button
                          className={btn}
                          aria-expanded={open}
                          title="Show router info, active sessions, reachability history and remote access"
                          onClick={() => setExpandedId(open ? null : r.id)}
                        >
                          <ExpandMoreIcon style={{ width: 16, height: 16, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform .2s' }} />
                          {open ? 'Hide details' : 'View details'}
                        </button>
                        <button className={btn} title="Change the name, IP, location or saved API login" onClick={() => setFormTarget(r)}>
                          <EditOutlinedIcon style={{ width: 16, height: 16 }} /> Edit
                        </button>
                        <button className={btn} title="Remove this router from the platform" onClick={() => setDeleteTarget(r)}>
                          <DeleteOutlineIcon style={{ width: 16, height: 16 }} /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>

                  {open && (
                    <tr className="border-b border-black/5 bg-black/[0.02] last:border-0 dark:border-white/5 dark:bg-white/[0.02]">
                      <td colSpan={5} className="p-4">
                        <RouterDetails router={r} reachable={reachable} />
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      {formTarget && (
        <RouterFormModal
          router={formTarget === 'new' ? null : formTarget}
          onClose={() => setFormTarget(null)}
          onSaved={loadRouters}
        />
      )}

      {deleteTarget && (
        <Modal
          title="Delete router?"
          onClose={() => !deleting && setDeleteTarget(null)}
          footer={
            <>
              <button className={btn} disabled={deleting} onClick={() => setDeleteTarget(null)}>Cancel</button>
              <button disabled={deleting} onClick={confirmDelete}
                className="inline-flex h-8 items-center rounded-lg bg-red-600 px-4 text-xs font-semibold text-white disabled:opacity-50">
                {deleting ? 'Deleting…' : 'Delete router'}
              </button>
            </>
          }
        >
          <p className="text-sm text-gray-700 dark:text-gray-300">
            <span className="font-semibold">{deleteTarget.name}</span> ({deleteTarget.ip_address}) will be removed from the platform.
            The router itself is not touched.
          </p>
        </Modal>
      )}
    </div>
  );
};

export default NasRoutersTable;