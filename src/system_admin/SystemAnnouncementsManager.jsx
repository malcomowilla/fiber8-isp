import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles, Wrench, AlertTriangle, Construction, Megaphone,
  Plus, Trash2, Pencil, X, Check, Clock, Eye, EyeOff,
} from 'lucide-react';
import { ToastContainer, toast, Slide } from 'react-toastify';

const TYPE_META = {
  feature:     { label: 'New feature',  Icon: Sparkles,      accent: '#a78bfa' },
  fix:         { label: 'Fix',          Icon: Wrench,        accent: '#38bdf8' },
  alert:       { label: 'Alert',        Icon: AlertTriangle, accent: '#f87171' },
  maintenance: { label: 'Maintenance',  Icon: Construction,  accent: '#fbbf24' },
  general:     { label: 'Announcement', Icon: Megaphone,     accent: '#34d399' },
};

const PRIORITY_META = {
  low:    { label: 'Low',    color: '#94a3b8' },
  medium: { label: 'Medium', color: '#38bdf8' },
  high:   { label: 'High',   color: '#f87171' },
};

const EMPTY_FORM = {
  id: null,
  title: '',
  body: '',
  announcement_type: 'general',
  priority: 'medium',
  active: true,
  expires_at: '',
};

const SystemAnnouncementsManager = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(EMPTY_FORM);
  const [showComposer, setShowComposer] = useState(false);
  const [saving, setSaving] = useState(false);

  const fetchAnnouncements = useCallback(async () => {
    try {
      const res = await fetch('/api/system_announcements', { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setAnnouncements(data);
      }
    } catch (_) {
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAnnouncements(); }, [fetchAnnouncements]);

  const openComposer = (announcement = null) => {
    setForm(
      announcement
        ? {
            id: announcement.id,
            title: announcement.title,
            body: announcement.body,
            announcement_type: announcement.announcement_type,
            priority: announcement.priority,
            active: announcement.active,
            expires_at: announcement.expires_at ? announcement.expires_at.slice(0, 16) : '',
          }
        : EMPTY_FORM
    );
    setShowComposer(true);
  };

  const closeComposer = () => {
    setShowComposer(false);
    setForm(EMPTY_FORM);
  };

  const handleSave = async () => {
    if (!form.title.trim() || !form.body.trim()) {
      toast.error('Title and message are required.', { transition: Slide });
      return;
    }
    setSaving(true);
    try {
      const isEdit = Boolean(form.id);
      const res = await fetch(
        isEdit ? `/api/system_announcements/${form.id}` : '/api/system_announcements',
        {
          method: isEdit ? 'PATCH' : 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: form.title,
            body: form.body,
            announcement_type: form.announcement_type,
            priority: form.priority,
            active: form.active,
            expires_at: form.expires_at || null,
          }),
        }
      );
      if (res.ok) {
        toast.success(isEdit ? 'Announcement updated' : 'Announcement published', { transition: Slide });
        closeComposer();
        fetchAnnouncements();
      } else {
        toast.error('Could not save announcement.', { transition: Slide });
      }
    } catch (_) {
      toast.error('Something went wrong.', { transition: Slide });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`/api/system_announcements/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (res.ok) {
        toast.success('Announcement removed', { transition: Slide });
        setAnnouncements((prev) => prev.filter((a) => a.id !== id));
      }
    } catch (_) {}
  };

  const toggleActive = async (announcement) => {
    try {
      const res = await fetch(`/api/system_announcements/${announcement.id}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: !announcement.active }),
      });
      if (res.ok) {
        setAnnouncements((prev) =>
          prev.map((a) => (a.id === announcement.id ? { ...a, active: !a.active } : a))
        );
      }
    } catch (_) {}
  };

  return (
    <div className="font-sans">
      <ToastContainer position="top-center" autoClose={3000} transition={Slide} />

      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">System notifications & alerts</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Write once, broadcast everywhere — every tenant sees this on their dashboard.
          </p>
        </div>
        <button
          type="button"
          onClick={() => openComposer()}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold transition-colors shadow-sm"
        >
          <Plus size={16} /> New announcement
        </button>
      </div>

      {/* Composer */}
      <AnimatePresence>
        {showComposer && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden mb-6"
          >
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  {form.id ? 'Edit announcement' : 'Compose announcement'}
                </h3>
                <button onClick={closeComposer} className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800">
                  <X size={16} />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                {Object.entries(TYPE_META).map(([key, { label, Icon, accent }]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, announcement_type: key }))}
                    className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl border text-sm font-medium transition-colors ${
                      form.announcement_type === key
                        ? 'border-transparent text-white'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                    }`}
                    style={form.announcement_type === key ? { background: accent } : {}}
                  >
                    <Icon size={16} /> {label}
                  </button>
                ))}
              </div>

              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                placeholder="Title — e.g. New M-Pesa STK push retry logic"
                className="w-full mb-3 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-sm text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-emerald-500/40"
              />

              <textarea
                value={form.body}
                onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))}
                placeholder="What changed, what to expect, or what to do about it..."
                rows={4}
                className="w-full mb-3 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-sm text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-emerald-500/40 resize-none"
              />

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                <div>
                  <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 block">Priority</label>
                  <select
                    value={form.priority}
                    onChange={(e) => setForm((f) => ({ ...f, priority: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-sm text-slate-900 dark:text-slate-100"
                  >
                    {Object.entries(PRIORITY_META).map(([k, v]) => (
                      <option key={k} value={k}>{v.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 block">Expires (optional)</label>
                  <input
                    type="datetime-local"
                    value={form.expires_at}
                    onChange={(e) => setForm((f) => ({ ...f, expires_at: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-sm text-slate-900 dark:text-slate-100"
                  />
                </div>

                <div className="flex items-end">
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.active}
                      onChange={(e) => setForm((f) => ({ ...f, active: e.target.checked }))}
                      className="w-4 h-4 rounded accent-emerald-500"
                    />
                    Publish immediately
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  onClick={closeComposer}
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 disabled:opacity-60 text-white text-sm font-semibold transition-colors"
                >
                  <Check size={16} /> {saving ? 'Saving...' : form.id ? 'Update' : 'Publish'}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* List */}
      {loading ? (
        <p className="text-sm text-slate-400">Loading announcements...</p>
      ) : announcements.length === 0 ? (
        <p className="text-sm text-slate-400">No announcements yet. Write your first one above.</p>
      ) : (
        <div className="space-y-2.5">
          {announcements.map((a) => {
            const meta = TYPE_META[a.announcement_type] || TYPE_META.general;
            const Icon = meta.Icon;
            const expired = a.expires_at && new Date(a.expires_at) < new Date();
            return (
              <motion.div
                key={a.id}
                layout
                className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3.5 flex items-start gap-3"
              >
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background: `${meta.accent}18`, border: `1px solid ${meta.accent}28` }}
                >
                  <Icon size={16} style={{ color: meta.accent }} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{a.title}</p>
                    <span
                      className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full"
                      style={{ background: `${PRIORITY_META[a.priority]?.color}18`, color: PRIORITY_META[a.priority]?.color }}
                    >
                      {PRIORITY_META[a.priority]?.label}
                    </span>
                    {!a.active && (
                      <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500">
                        Hidden
                      </span>
                    )}
                    {expired && (
                      <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-red-50 dark:bg-red-500/10 text-red-500">
                        Expired
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">{a.body}</p>
                  <div className="flex items-center gap-1 mt-1.5 text-[11px] text-slate-400">
                    <Clock size={11} />
                    {new Date(a.published_at).toLocaleString('en-KE', { dateStyle: 'medium', timeStyle: 'short' })}
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => toggleActive(a)}
                    title={a.active ? 'Hide from tenants' : 'Show to tenants'}
                    className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    {a.active ? <Eye size={15} /> : <EyeOff size={15} />}
                  </button>
                  <button
                    onClick={() => openComposer(a)}
                    className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    <Pencil size={15} />
                  </button>
                  <button
                    onClick={() => handleDelete(a.id)}
                    className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SystemAnnouncementsManager;