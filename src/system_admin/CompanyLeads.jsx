import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Plus, Pencil, Trash2, Download, ChevronLeft, ChevronRight,
  Sparkles, PhoneCall, BadgeCheck, Trophy, XCircle, Mail, Building2, Phone, Users
} from 'lucide-react';
import { IconButton } from '@mui/material';
import { useDebounce } from 'use-debounce';
import { toast, Toaster } from 'react-hot-toast';
import DeleteLead from './DeleteLead';
import EditLead from './EditLead';

const STATUS_CONFIG = {
  new:       { label: 'New',       accent: '#38bdf8', bg: 'rgba(56,189,248,.12)', icon: Sparkles },
  contacted: { label: 'Contacted', accent: '#fbbf24', bg: 'rgba(251,191,36,.12)', icon: PhoneCall },
  qualified: { label: 'Qualified', accent: '#a78bfa', bg: 'rgba(167,139,250,.12)', icon: BadgeCheck },
  converted: { label: 'Converted', accent: '#34d399', bg: 'rgba(52,211,153,.12)', icon: Trophy },
  lost:      { label: 'Lost',      accent: '#f87171', bg: 'rgba(248,113,113,.12)', icon: XCircle },
};

const STATUS_ORDER = ['new', 'contacted', 'qualified', 'converted', 'lost'];
const PAGE_SIZE = 10;
const emptyLead = { name: '', email: '', company_name: '', phone_number: '', status: 'new' };

const formatDate = (d) => {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' });
};

const CompanyLeads = () => {
  const [leads, setLeads] = useState([]);
  const [stats, setStats] = useState({ new: 0, contacted: 0, qualified: 0, converted: 0, lost: 0, total: 0 });
  const [search, setSearch] = useState('');
  const [searchInput] = useDebounce(search, 400);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState(emptyLead);
  const [openDelete, setOpenDelete] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [statusFilter, setStatusFilter] = useState(null);

  const getLeads = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/company_leads');
      if (!response.ok) throw new Error('Failed to fetch leads');
      const data = await response.json();
      setLeads(data.leads || []);
      setStats(data.stats || { new: 0, contacted: 0, qualified: 0, converted: 0, lost: 0, total: 0 });
    } catch (error) {
      toast.error('Failed to load leads', { position: 'top-center' });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { getLeads(); }, [getLeads]);

  const createLead = async (e) => {
    e.preventDefault();
    try {
      const url = formData.id ? `/api/company_leads/${formData.id}` : '/api/company_leads';
      const method = formData.id ? 'PATCH' : 'POST';
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData }),
      });

      if (response.ok) {
        setOpenEdit(false);
        toast.success(formData.id ? 'Lead updated successfully' : 'Lead created successfully', {
          position: 'top-center', duration: 4000,
        });
        getLeads();
      } else {
        toast.error(formData.id ? 'Failed to update lead' : 'Failed to create lead', {
          position: 'top-center', duration: 4000,
        });
      }
    } catch (error) {
      toast.error('Something went wrong', { position: 'top-center', duration: 3000 });
    }
  };

  const deleteLead = async (id) => {
    try {
      setDeleting(true);
      const response = await fetch(`/api/company_leads/${id}`, { method: 'DELETE' });
      if (response.ok) {
        setOpenDelete(false);
        toast.success('Lead deleted', { position: 'top-center' });
        getLeads();
      } else {
        toast.error('Failed to delete lead', { position: 'top-center' });
      }
    } catch (error) {
      toast.error('Failed to delete lead', { position: 'top-center' });
    } finally {
      setDeleting(false);
    }
  };

  const updateStatus = async (id, status) => {
    const prev = leads;
    setLeads(leads.map((l) => (l.id === id ? { ...l, status } : l)));
    try {
      const response = await fetch(`/api/company_leads/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (response.ok) {
        toast.success('Status updated', { position: 'top-center', duration: 2000 });
        getLeads();
      } else {
        setLeads(prev);
        toast.error('Failed to update status', { position: 'top-center' });
      }
    } catch (error) {
      setLeads(prev);
      toast.error('Failed to update status', { position: 'top-center' });
    }
  };

  const openAdd = () => { setFormData(emptyLead); setOpenEdit(true); };
  const openEditFor = (lead) => { setFormData(lead); setOpenEdit(true); };
  const openDeleteFor = (id) => { setDeleteId(id); setOpenDelete(true); };

  const filteredLeads = useMemo(() => {
    let result = leads;
    if (statusFilter) result = result.filter((l) => l.status === statusFilter);
    if (searchInput) {
      const q = searchInput.toLowerCase();
      result = result.filter((l) =>
        [l.name, l.email, l.company_name, l.phone_number].some((f) => f?.toLowerCase().includes(q))
      );
    }
    return result;
  }, [leads, searchInput, statusFilter]);

  const exportCsv = () => {
    const headers = ['Name', 'Email', 'Company', 'Phone', 'Status', 'Created'];
    const rows = filteredLeads.map((l) => [l.name, l.email, l.company_name, l.phone_number, l.status, l.created_at]);
    const csv = [headers, ...rows].map((r) => r.map((v) => `"${v ?? ''}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'leads.csv';
    link.click();
  };

  const totalPages = Math.max(1, Math.ceil(filteredLeads.length / PAGE_SIZE));
  const pagedLeads = filteredLeads.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => { setPage(1); }, [searchInput, statusFilter]);

  return (
    <>
      <Toaster />
      <style>{`
        .leads-root {
          --bg-page: #020617; --bg-card: rgba(15,23,42,.7); --bg-soft: rgba(15,23,42,.6);
          --border: rgba(148,163,184,.1); --text-primary: #f1f5f9; --text-secondary: #94a3b8;
          --text-muted: #64748b;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }
        .leads-card { background: var(--bg-card); border: 1px solid var(--border); backdrop-filter: blur(16px); }
        .leads-input:focus { outline: none; }
        .status-pill { transition: transform .15s ease; }
        .status-pill:hover { transform: translateY(-2px); }
      `}</style>

      <DeleteLead
        setOpenDelete={setOpenDelete}
        openDelete={openDelete}
        deleteLead={deleteLead}
        id={deleteId}
        isloading={deleting}
      />

      <EditLead
        setOpen={setOpenEdit}
        open={openEdit}
        formData={formData}
        setFormData={setFormData}
        createLead={createLead}
      />

      <div className="leads-root min-h-screen p-6" style={{ background: 'var(--bg-page)' }}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-black" style={{ color: 'var(--text-primary)' }}>Leads</h1>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              Track and convert prospects into customers
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={exportCsv}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold"
              style={{ background: 'var(--bg-soft)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
            >
              <Download size={16} /> Export
            </button>
            <button
              onClick={openAdd}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white"
              style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}
            >
              <Plus size={16} /> Add Lead
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
          {STATUS_ORDER.map((key) => {
            const cfg = STATUS_CONFIG[key];
            const Icon = cfg.icon;
            const active = statusFilter === key;
            return (
              <motion.button
                key={key}
                whileHover={{ y: -3 }}
                onClick={() => setStatusFilter(active ? null : key)}
                className="status-pill leads-card rounded-2xl p-4 text-left relative overflow-hidden"
                style={{ borderColor: active ? cfg.accent : 'var(--border)' }}
              >
                <div className="absolute -top-4 -right-4 w-16 h-16 rounded-full pointer-events-none"
                  style={{ background: `radial-gradient(circle,${cfg.accent}25,transparent)` }} />
                <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3"
                  style={{ background: cfg.bg, border: `1px solid ${cfg.accent}30` }}>
                  <Icon size={16} style={{ color: cfg.accent }} />
                </div>
                <p className="text-2xl font-black" style={{ color: 'var(--text-primary)' }}>
                  {stats[key] ?? 0}
                </p>
                <p className="text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>{cfg.label}</p>
              </motion.button>
            );
          })}
        </div>

        <div className="leads-card rounded-2xl p-3 mb-4 flex items-center gap-3">
          <Search size={16} style={{ color: 'var(--text-muted)' }} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search leads by name, email, company or phone..."
            className="leads-input bg-transparent flex-1 text-sm"
            style={{ color: 'var(--text-primary)' }}
          />
          {statusFilter && (
            <button
              onClick={() => setStatusFilter(null)}
              className="text-xs px-3 py-1.5 rounded-full font-semibold"
              style={{ background: `${STATUS_CONFIG[statusFilter].accent}20`, color: STATUS_CONFIG[statusFilter].accent }}
            >
              {STATUS_CONFIG[statusFilter].label} ✕
            </button>
          )}
        </div>

        <div className="leads-card rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  {['Lead', 'Company', 'Phone', 'Status', 'Created', ''].map((h) => (
                    <th key={h} className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider"
                      style={{ color: 'var(--text-muted)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading && (
                  <tr><td colSpan={6} className="text-center py-10" style={{ color: 'var(--text-muted)' }}>Loading leads…</td></tr>
                )}
                {!loading && pagedLeads.length === 0 && (
                  <tr><td colSpan={6} className="text-center py-10" style={{ color: 'var(--text-muted)' }}>
                    <Users size={22} className="mx-auto mb-2 opacity-40" />
                    No leads found
                  </td></tr>
                )}
                <AnimatePresence>
                  {!loading && pagedLeads.map((lead) => {
                    const cfg = STATUS_CONFIG[lead.status] || STATUS_CONFIG.new;
                    return (
                      <motion.tr
                        key={lead.id}
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        style={{ borderBottom: '1px solid var(--border)' }}
                      >
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white"
                              style={{ background: cfg.accent }}>
                              {lead.name?.charAt(0)?.toUpperCase() || '?'}
                            </div>
                            <div>
                              <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>{lead.name}</p>
                              <p className="text-xs flex items-center gap-1" style={{ color: 'var(--text-muted)' }}>
                                <Mail size={11} /> {lead.email}
                              </p>

                              {lead.source && lead.source !== 'manual' && (
  <span className="inline-block mt-1 text-[10px] font-semibold px-2 py-0.5 rounded-full"
    style={{ background: 'rgba(129,140,248,.12)', color: '#818cf8' }}>
    {lead.source === 'website_linger' ? 'Website (lingered)' : lead.source}
  </span>
)}
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3.5" style={{ color: 'var(--text-secondary)' }}>
                          <span className="inline-flex items-center gap-1.5">
                            <Building2 size={13} style={{ color: 'var(--text-muted)' }} />
                            {lead.company_name || '—'}
                          </span>
                        </td>
                        <td className="px-5 py-3.5" style={{ color: 'var(--text-secondary)' }}>
                          <span className="inline-flex items-center gap-1.5">
                            <Phone size={13} style={{ color: 'var(--text-muted)' }} />
                            {lead.phone_number || '—'}
                          </span>
                        </td>
                        <td className="px-5 py-3.5">
                          <select
                            value={lead.status || 'new'}
                            onChange={(e) => updateStatus(lead.id, e.target.value)}
                            className="text-xs font-bold px-3 py-1.5 rounded-full border-none cursor-pointer"
                            style={{ background: cfg.bg, color: cfg.accent }}
                          >
                            {STATUS_ORDER.map((s) => (
                              <option key={s} value={s} style={{ color: '#000' }}>{STATUS_CONFIG[s].label}</option>
                            ))}
                          </select>
                        </td>
                        <td className="px-5 py-3.5 text-xs" style={{ color: 'var(--text-muted)' }}>
                          {formatDate(lead.created_at)}
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          <IconButton size="small" style={{ color: '#818cf8' }} onClick={() => openEditFor(lead)}>
                            <Pencil size={16} />
                          </IconButton>
                          <IconButton size="small" style={{ color: '#f87171' }} onClick={() => openDeleteFor(lead.id)}>
                            <Trash2 size={16} />
                          </IconButton>
                        </td>
                      </motion.tr>
                    );
                  })}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          {!loading && filteredLeads.length > 0 && (
            <div className="flex items-center justify-between px-5 py-3.5" style={{ borderTop: '1px solid var(--border)' }}>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filteredLeads.length)} of {filteredLeads.length}
              </p>
              <div className="flex items-center gap-2">
                <button disabled={page === 1} onClick={() => setPage((p) => p - 1)}
                  className="p-1.5 rounded-lg disabled:opacity-30" style={{ background: 'var(--bg-soft)' }}>
                  <ChevronLeft size={16} style={{ color: 'var(--text-primary)' }} />
                </button>
                <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{page} / {totalPages}</span>
                <button disabled={page === totalPages} onClick={() => setPage((p) => p + 1)}
                  className="p-1.5 rounded-lg disabled:opacity-30" style={{ background: 'var(--bg-soft)' }}>
                  <ChevronRight size={16} style={{ color: 'var(--text-primary)' }} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CompanyLeads;