import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { toast } from 'react-toastify';
import SearchIcon from '@mui/icons-material/Search';
import RefreshIcon from '@mui/icons-material/Refresh';

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
      setRegistrations((rows) => rows.map((r) => (r.id === updated.id ? updated : r)));
      toast.success(`${admin.company_name} is now ${status}`);
      load();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusyId(null);
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
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-800 dark:text-slate-200">
            {loading && (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-slate-500">Loading registrations…</td></tr>
            )}
            {!loading && visible.length === 0 && (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-slate-500">No registrations match.</td></tr>
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
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CollectorRegistrations;