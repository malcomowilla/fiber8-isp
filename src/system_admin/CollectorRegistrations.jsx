import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { toast } from 'react-toastify';
import SearchIcon from '@mui/icons-material/Search';
import RefreshIcon from '@mui/icons-material/Refresh';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

const STATUS_FILTERS = ['all', 'active', 'pending', 'suspended'];

const formatDate = (value) =>
  value ? new Date(value).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }) : 'Never';

const StatCard = ({ label, value }) => (
  <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-4">
    <p className="text-2xl font-semibold text-slate-900 dark:text-slate-100">{value}</p>
    <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
  </div>
);

const CollectorRegistrations = () => {
  const [stats, setStats] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [busyId, setBusyId] = useState(null);

  // delete confirmation
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [confirmText, setConfirmText] = useState('');
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/collector_registrations', { credentials: 'include' });
      if (!res.ok) throw new Error('Could not load registrations');
      const data = await res.json();
      setStats(data.stats);
      setRegistrations(data.registrations);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const changeStatus = async (admin, status) => {
    setBusyId(admin.id);
    try {
      const res = await fetch(`/api/collector_registrations/${admin.id}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error('Could not update status');
      const updated = await res.json();
      setRegistrations((rows) => rows.map((r) => (r.id === updated.id ? { ...r, ...updated } : r)));
      toast.success(`${admin.company_name} is now ${status}`);
      load();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusyId(null);
    }
  };

  const openDelete = (row) => {
    setConfirmText('');
    setDeleteTarget(row);
  };

  const closeDelete = () => {
    if (deleting) return;
    setDeleteTarget(null);
    setConfirmText('');
  };

  const deleteAccount = async () => {
    setDeleting(true);
    try {
      const res = await fetch(`/api/collector_registrations/${deleteTarget.id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Could not delete account');
      toast.success(data.message || 'Account deleted');
      setDeleteTarget(null);
      setConfirmText('');
      load();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setDeleting(false);
    }
  };

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    return registrations.filter((r) => {
      const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
      const matchesSearch =
        !q ||
        [r.company_name, r.owner_name, r.email, r.phone_number].some((v) => String(v || '').toLowerCase().includes(q));
      return matchesStatus && matchesSearch;
    });
  }, [registrations, search, statusFilter]);

  const canConfirmDelete = deleteTarget && confirmText.trim() === deleteTarget.company_name;

  return (
    <div className="space-y-5">
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <StatCard label="Total registered" value={stats.total} />
          <StatCard label="Today" value={stats.today} />
          <StatCard label="Last 7 days" value={stats.last_7_days} />
          <StatCard label="Active" value={stats.active} />
          <StatCard label="Pending approval" value={stats.pending} />
          <StatCard label="Suspended" value={stats.suspended} />
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <div className="relative sm:w-80">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" fontSize="small" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search company, name, email, phone"
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 pl-9 pr-3 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-400"
          />
        </div>
        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-slate-100"
          >
            {STATUS_FILTERS.map((s) => (
              <option key={s} value={s}>{s === 'all' ? 'All statuses' : s}</option>
            ))}
          </select>
          <button
            type="button"
            onClick={load}
            className="flex items-center gap-1 rounded-xl border border-slate-300 dark:border-slate-700 px-3 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <RefreshIcon fontSize="small" /> Refresh
          </button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 dark:bg-slate-800/60 text-left text-slate-600 dark:text-slate-300">
            <tr>
              <th className="px-4 py-3 font-medium">Company</th>
              <th className="px-4 py-3 font-medium">Admin</th>
              <th className="px-4 py-3 font-medium">Contact</th>
              <th className="px-4 py-3 font-medium">Registered</th>
              <th className="px-4 py-3 font-medium">Last sign in</th>
              <th className="px-4 py-3 font-medium">Data</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-800 dark:text-slate-200">
            {loading && (
              <tr><td colSpan={8} className="px-4 py-8 text-center text-slate-500">Loading registrations…</td></tr>
            )}
            {!loading && visible.length === 0 && (
              <tr><td colSpan={8} className="px-4 py-8 text-center text-slate-500">No registrations match.</td></tr>
            )}
            {!loading &&
              visible.map((r) => (
                <tr key={r.id}>
                  <td className="px-4 py-3 font-medium">{r.company_name}</td>
                  <td className="px-4 py-3">{r.owner_name}</td>
                  <td className="px-4 py-3">
                    <p>{r.email}</p>
                    <p className="text-xs text-slate-500">{r.phone_number}</p>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <p>{formatDate(r.registered_at)}</p>
                    <p className="text-xs text-slate-500">{r.signup_ip || ''}</p>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <p>{formatDate(r.last_sign_in_at)}</p>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-xs text-slate-500">
                    <p>{r.buildings_count ?? 0} buildings</p>
                    <p>{r.customers_count ?? 0} customers</p>
                    <p>{r.transactions_count ?? 0} transactions</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className="rounded-full border border-slate-300 dark:border-slate-600 px-2.5 py-0.5 text-xs font-medium capitalize">
                      {r.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    {r.status !== 'active' && (
                      <button
                        type="button"
                        disabled={busyId === r.id}
                        onClick={() => changeStatus(r, 'active')}
                        className="rounded-lg border border-slate-300 dark:border-slate-600 px-3 py-1 text-xs font-medium hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50"
                      >
                        {r.status === 'pending' ? 'Approve' : 'Reactivate'}
                      </button>
                    )}
                    {r.status !== 'suspended' && (
                      <button
                        type="button"
                        disabled={busyId === r.id}
                        onClick={() => changeStatus(r, 'suspended')}
                        className="ml-2 rounded-lg border border-slate-300 dark:border-slate-600 px-3 py-1 text-xs font-medium hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50"
                      >
                        Suspend
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => openDelete(r)}
                      aria-label={`Delete ${r.company_name}`}
                      className="ml-2 inline-flex items-center gap-1 rounded-lg border border-red-300 px-3 py-1 text-xs font-medium text-red-600 hover:bg-red-50 dark:border-red-500/40 dark:text-red-400 dark:hover:bg-red-500/10"
                    >
                      <DeleteOutlineIcon sx={{ fontSize: 16 }} /> Delete
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Delete confirmation */}
      {deleteTarget && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4"
          onClick={closeDelete}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-collector-title"
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900"
          >
            <h2 id="delete-collector-title" className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              Delete {deleteTarget.company_name}?
            </h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              This permanently deletes the company, its admin login,{' '}
              <strong>{deleteTarget.buildings_count ?? 0}</strong> buildings,{' '}
              <strong>{deleteTarget.customers_count ?? 0}</strong> customers and{' '}
              <strong>{deleteTarget.transactions_count ?? 0}</strong> transactions. This cannot be undone.
            </p>

            <label htmlFor="confirm-company" className="mt-4 block text-sm text-slate-700 dark:text-slate-300">
              Type <strong>{deleteTarget.company_name}</strong> to confirm
            </label>
            <input
              id="confirm-company"
              autoFocus
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-400 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
            />

            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={closeDelete}
                disabled={deleting}
                className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 disabled:opacity-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={deleteAccount}
                disabled={!canConfirmDelete || deleting}
                className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {deleting ? 'Deleting…' : 'Delete everything'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CollectorRegistrations;