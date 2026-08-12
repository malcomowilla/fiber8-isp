// src/components/systemadmin/SystemAdminSupportOverview.jsx
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';
import {
  LifeBuoy, Clock, CheckCircle2, AlertTriangle, CreditCard,
  Building2, TrendingUp, Search, ChevronDown, X
} from 'lucide-react';

const STATUS_STYLES = {
  open:        'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400',
  in_progress: 'bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400',
  resolved:    'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400',
  closed:      'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400',
};

const PRIORITY_STYLES = {
  low:    'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300',
  medium: 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400',
  high:   'bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400',
  urgent: 'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400',
};

const KpiCard = ({ icon: Icon, label, value, sub }) => (
  <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
    <div className="flex items-center justify-between mb-3">
      <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
        <Icon size={17} className="text-slate-500 dark:text-slate-400" />
      </div>
    </div>
    <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 tabular-nums">{value}</p>
    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{label}</p>
    {sub && <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">{sub}</p>}
  </div>
);

const TicketDrawer = ({ ticket, onClose, onUpdate }) => {
  const [status, setStatus] = useState(ticket?.status || 'open');
  const [notes, setNotes] = useState(ticket?.admin_notes || '');
  const [saving, setSaving] = useState(false);

  if (!ticket) return null;

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/system_admin/support_tickets/${ticket.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, admin_notes: notes }),
      });
      if (res.ok) {
        const updated = await res.json();
        toast.success('Ticket updated');
        onUpdate(updated);
        onClose();
      } else {
        toast.error('Could not update ticket');
      }
    } catch {
      toast.error('Something went wrong');
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-sm flex justify-end font-sans"
      onClick={onClose}
    >
      <motion.div
        initial={{ x: 400 }} animate={{ x: 0 }} exit={{ x: 400 }}
        transition={{ type: 'tween', duration: 0.25 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md h-full bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 overflow-y-auto"
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-slate-800">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Ticket details</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800">
            <X size={18} />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div>
            <p className="text-[11px] uppercase tracking-wide text-slate-400 dark:text-slate-500 mb-1">Company</p>
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{ticket.company_name}</p>
          </div>

          <div>
            <p className="text-[11px] uppercase tracking-wide text-slate-400 dark:text-slate-500 mb-1">Subject</p>
            <p className="text-sm text-slate-800 dark:text-slate-200">{ticket.subject}</p>
          </div>

          <div>
            <p className="text-[11px] uppercase tracking-wide text-slate-400 dark:text-slate-500 mb-1">Description</p>
            <p className="text-sm text-slate-600 dark:text-slate-400 whitespace-pre-wrap">{ticket.description}</p>
          </div>

          <div className="flex gap-4">
            <div>
              <p className="text-[11px] uppercase tracking-wide text-slate-400 dark:text-slate-500 mb-1">Category</p>
              <p className="text-sm capitalize text-slate-700 dark:text-slate-300">{ticket.category}</p>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-wide text-slate-400 dark:text-slate-500 mb-1">Priority</p>
              <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${PRIORITY_STYLES[ticket.priority]}`}>
                {ticket.priority}
              </span>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
            <p className="text-[11px] uppercase tracking-wide text-slate-400 dark:text-slate-500 mb-1.5">Contact</p>
            <p className="text-sm text-slate-700 dark:text-slate-300">{ticket.raised_by_name || '—'}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">{ticket.raised_by_email}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">{ticket.raised_by_phone}</p>
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-wide text-slate-400 dark:text-slate-500 mb-1.5">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/60
                px-3 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              <option value="open">Open</option>
              <option value="in_progress">In progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-wide text-slate-400 dark:text-slate-500 mb-1.5">Admin notes</label>
            <textarea
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Internal notes, resolution steps, etc."
              className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/60
                px-3 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 resize-none
                focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white text-sm font-semibold py-2.5 transition-colors"
          >
            {saving ? 'Saving…' : 'Save changes'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

const ClientHealthTable = ({ accounts, loading }) => {
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    if (!search.trim()) return accounts;
    const q = search.toLowerCase();
    return accounts.filter((a) => a.company_name?.toLowerCase().includes(q));
  }, [accounts, search]);

  const daysLeftBadge = (a) => {
    if (a.expired) {
      return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400">
        <AlertTriangle size={11} /> Expired
      </span>;
    }
    if (a.days_left == null) {
      return <span className="text-xs text-slate-400 dark:text-slate-500">No plan</span>;
    }
    if (a.days_left <= 3) {
      return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400">
        {a.days_left}d left
      </span>;
    }
    return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
      {a.days_left}d left
    </span>;
  };

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <Building2 size={16} className="text-slate-400" />
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">ISP Client Accounts</h3>
        </div>
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search company…"
            className="pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60
              text-slate-700 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 w-48"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[11px] uppercase tracking-wide text-slate-400 dark:text-slate-500 border-b border-slate-100 dark:border-slate-800">
              <th className="px-5 py-3 font-semibold">Company</th>
              <th className="px-5 py-3 font-semibold">Plan</th>
              <th className="px-5 py-3 font-semibold">Status</th>
              <th className="px-5 py-3 font-semibold">Expiry</th>
              <th className="px-5 py-3 font-semibold">Days left</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {loading ? (
              [1, 2, 3].map((i) => (
                <tr key={i}>
                  <td colSpan={5} className="px-5 py-4">
                    <div className="h-4 w-full bg-slate-100 dark:bg-slate-800 rounded animate-pulse" />
                  </td>
                </tr>
              ))
            ) : filtered.length === 0 ? (
              <tr><td colSpan={5} className="px-5 py-8 text-center text-sm text-slate-400 dark:text-slate-500">No accounts found</td></tr>
            ) : (
              filtered.map((a) => (
                <tr key={a.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="px-5 py-3 font-medium text-slate-900 dark:text-slate-100">{a.company_name}</td>
                  <td className="px-5 py-3 text-slate-600 dark:text-slate-400">{a.plan_name || '—'}</td>
                  <td className="px-5 py-3 capitalize text-slate-600 dark:text-slate-400">{a.status || '—'}</td>
                  <td className="px-5 py-3 text-slate-600 dark:text-slate-400">
                    {a.expiry ? new Date(a.expiry).toLocaleDateString() : '—'}
                  </td>
                  <td className="px-5 py-3">{daysLeftBadge(a)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const SystemAdminSupportOverview = () => {
  const [tickets, setTickets] = useState([]);
  const [stats, setStats] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [loadingTickets, setLoadingTickets] = useState(true);
  const [loadingAccounts, setLoadingAccounts] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedTicket, setSelectedTicket] = useState(null);

  const fetchTickets = useCallback(async () => {
    setLoadingTickets(true);
    try {
      const res = await fetch('/api/system_admin/support_tickets');
      if (res.ok) setTickets(await res.json());
    } catch {
      toast.error('Could not load tickets');
    } finally {
      setLoadingTickets(false);
    }
  }, []);

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch('/api/system_admin/support_tickets_stats');
      if (res.ok) setStats(await res.json());
    } catch {}
  }, []);

  const fetchAccounts = useCallback(async () => {
    setLoadingAccounts(true);
    try {
      const res = await fetch('/api/system_admin/client_accounts_overview');
      if (res.ok) setAccounts(await res.json());
    } catch {
      toast.error('Could not load client accounts');
    } finally {
      setLoadingAccounts(false);
    }
  }, []);

  useEffect(() => {
    fetchTickets();
    fetchStats();
    fetchAccounts();
  }, [fetchTickets, fetchStats, fetchAccounts]);

  const filtered = filter === 'all' ? tickets : tickets.filter((t) => t.status === filter);

  const expiringSoon = accounts.filter((a) => !a.expired && a.days_left != null && a.days_left <= 5).length;
  const expiredCount = accounts.filter((a) => a.expired).length;

  return (
    <div className="font-sans space-y-6">
      <Toaster />

      {selectedTicket && (
        <TicketDrawer
          ticket={selectedTicket}
          onClose={() => setSelectedTicket(null)}
          onUpdate={(updated) => {
            setTickets((prev) => prev.map((t) => (t.id === updated.id ? { ...t, ...updated } : t)));
            fetchStats();
          }}
        />
      )}

      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KpiCard icon={LifeBuoy} label="Open tickets" value={stats?.open ?? '—'} sub={`${stats?.total ?? 0} total`} />
        <KpiCard icon={Clock} label="In progress" value={stats?.in_progress ?? '—'} />
        <KpiCard icon={CheckCircle2} label="Resolved" value={stats?.resolved ?? '—'} />
        <KpiCard icon={AlertTriangle} label="Urgent open" value={stats?.urgent_open ?? '—'} sub="Needs attention" />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KpiCard icon={Building2} label="ISP clients" value={accounts.length} />
        <KpiCard icon={AlertTriangle} label="Expired accounts" value={expiredCount} sub="Renewal needed" />
        <KpiCard icon={TrendingUp} label="Expiring soon" value={expiringSoon} sub="Within 5 days" />
        <KpiCard icon={CreditCard} label="Closed tickets" value={stats?.closed ?? '—'} />
      </div>

      {/* Tickets list */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex-wrap gap-2">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Support Tickets</h3>
          <div className="flex items-center gap-2">
            {['all', 'open', 'in_progress', 'resolved', 'closed'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold capitalize transition-colors
                  ${filter === f
                    ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'}`}
              >
                {f.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {loadingTickets ? (
            [1, 2, 3].map((i) => (
              <div key={i} className="px-5 py-4">
                <div className="h-5 w-1/2 bg-slate-100 dark:bg-slate-800 rounded animate-pulse mb-2" />
                <div className="h-3 w-1/3 bg-slate-100 dark:bg-slate-800 rounded animate-pulse" />
              </div>
            ))
          ) : filtered.length === 0 ? (
            <div className="px-5 py-10 text-center text-sm text-slate-400 dark:text-slate-500">
              No tickets in this view
            </div>
          ) : (
            filtered.map((t) => (
              <button
                key={t.id}
                onClick={() => setSelectedTicket(t)}
                className="w-full text-left px-5 py-4 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">{t.subject}</p>
                      <span className="text-xs text-slate-400 dark:text-slate-500 shrink-0">· {t.company_name}</span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">{t.description}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${PRIORITY_STYLES[t.priority]}`}>
                      {t.priority}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${STATUS_STYLES[t.status]}`}>
                      {t.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Client health table */}
      <ClientHealthTable accounts={accounts} loading={loadingAccounts} />
    </div>
  );
};

export default SystemAdminSupportOverview;