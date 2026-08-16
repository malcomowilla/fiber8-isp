import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell, Sparkles, Wrench, AlertTriangle, Construction, Megaphone, X,
} from 'lucide-react';

const TYPE_META = {
  feature:     { label: 'New feature',  Icon: Sparkles,      accent: '#a78bfa' },
  fix:         { label: 'Fix',          Icon: Wrench,        accent: '#38bdf8' },
  alert:       { label: 'Alert',        Icon: AlertTriangle, accent: '#f87171' },
  maintenance: { label: 'Maintenance',  Icon: Construction,  accent: '#fbbf24' },
  general:     { label: 'Announcement', Icon: Megaphone,     accent: '#34d399' },
};

// Toasts auto-dismiss after this long unless the user is hovering them.
const TOAST_LIFETIME_MS = 9000;
const POLL_INTERVAL_MS = 60000;

const timeAgo = (dateStr) => {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString('en-KE', { month: 'short', day: 'numeric' });
};

// ── Individual toast ─────────────────────────────────────────────────────────
function Toast({ announcement, onDismiss }) {
  const meta = TYPE_META[announcement.announcement_type] || TYPE_META.general;
  const Icon = meta.Icon;
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const t = setTimeout(onDismiss, TOAST_LIFETIME_MS);
    return () => clearTimeout(t);
  }, [paused, onDismiss]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 60, scale: 0.96 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 60, scale: 0.96, transition: { duration: 0.18 } }}
      transition={{ type: 'spring', stiffness: 300, damping: 26 }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      className="pointer-events-auto w-[340px] rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl overflow-hidden"
    >
      <div className="flex gap-3 px-4 py-3">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
          style={{ background: `${meta.accent}18`, border: `1px solid ${meta.accent}28` }}
        >
          <Icon size={15} style={{ color: meta.accent }} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: meta.accent }}>
              {meta.label}
            </span>
            <span className="text-[10px] text-slate-400">{timeAgo(announcement.published_at)}</span>
          </div>
          <p className="text-sm font-semibold text-slate-900 dark:text-white mt-0.5">{announcement.title}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-3">{announcement.body}</p>
        </div>
        <button
          onClick={onDismiss}
          className="p-1 h-fit rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 shrink-0"
        >
          <X size={14} />
        </button>
      </div>
      {/* Lifetime progress bar */}
      <motion.div
        key={paused ? 'paused' : 'running'}
        initial={{ scaleX: paused ? undefined : 1 }}
        animate={{ scaleX: paused ? undefined : 0 }}
        transition={{ duration: TOAST_LIFETIME_MS / 1000, ease: 'linear' }}
        style={{ transformOrigin: 'left', background: meta.accent }}
        className="h-[3px] w-full opacity-60"
      />
    </motion.div>
  );
}

const NotificationCenter = () => {
  const subdomain = window.location.hostname.split('.')[0];
  // Scope seen-state per tenant subdomain so it can't leak across tenants
  // sharing the same browser/origin.
  const SEEN_KEY = `owitech-seen-announcement-ids-${subdomain}`;

  const [announcements, setAnnouncements] = useState([]);
  const [toasts, setToasts] = useState([]);
  const [open, setOpen] = useState(false);
  const [seenIds, setSeenIds] = useState(() => {
    try { return JSON.parse(localStorage.getItem(SEEN_KEY) || '[]'); } catch (_) { return []; }
  });
  const panelRef = useRef(null);
  const hasLoadedOnce = useRef(false);

  const persistSeen = (ids) => {
    setSeenIds(ids);
    localStorage.setItem(SEEN_KEY, JSON.stringify(ids));
  };

  const fetchAnnouncements = useCallback(async () => {
    try {
      const res = await fetch('/api/system_announcements_active', { headers: { 'X-Subdomain': subdomain } });
      if (!res.ok) return;
      const data = await res.json();
      setAnnouncements(data);

      // Anything not seen yet gets pushed out as an auto-popping toast —
      // that's the whole point of a notification, it shouldn't wait for a click.
      setSeenIds((currentSeen) => {
        const unseen = data.filter((a) => !currentSeen.includes(a.id));
        if (unseen.length) {
          setToasts((prev) => {
            const existingIds = new Set(prev.map((t) => t.id));
            const fresh = unseen.filter((a) => !existingIds.has(a.id));
            return [...fresh, ...prev].slice(0, 4); // cap visible toasts
          });
        }
        return currentSeen;
      });

      hasLoadedOnce.current = true;
    } catch (_) {}
  }, [subdomain]);

  useEffect(() => {
    fetchAnnouncements();
    const interval = setInterval(fetchAnnouncements, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [fetchAnnouncements]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    setSeenIds((currentSeen) => {
      if (currentSeen.includes(id)) return currentSeen;
      const next = [...currentSeen, id];
      localStorage.setItem(SEEN_KEY, JSON.stringify(next));
      return next;
    });
  }, [SEEN_KEY]);

  // Badge reflects announcements the user hasn't dismissed/opened yet —
  // a toast showing up doesn't clear it, only dismissing the toast or
  // opening the history panel does.
  const unreadCount = announcements.filter((a) => !seenIds.includes(a.id)).length;

  const markAllSeen = () => {
    const ids = announcements.map((a) => a.id);
    persistSeen(ids);
    setToasts([]);
  };

  const togglePanel = () => {
    setOpen((v) => {
      const next = !v;
      if (next) markAllSeen();
      return next;
    });
  };

  return (
    <>
      {/* ── Auto-popping toast stack — this is the actual "notification" ──── */}
      <div className="fixed top-20 right-5 z-[100] flex flex-col gap-2.5 pointer-events-none">
        <AnimatePresence mode="popLayout">
          {toasts.map((a) => (
            <Toast key={a.id} announcement={a} onDismiss={() => dismissToast(a.id)} />
          ))}
        </AnimatePresence>
      </div>

      {/* ── Bell + history panel — for anything you dismissed or missed ────── */}
      <div className="relative" ref={panelRef}>
        <button
          type="button"
          onClick={togglePanel}
          className="relative p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
        >
          <Bell size={18} className="text-slate-500 dark:text-slate-400" />
          {unreadCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </motion.span>
          )}
        </button>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 mt-2 w-[360px] max-h-[440px] overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl z-50 flex flex-col"
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-800">
                <p className="text-sm font-bold text-slate-900 dark:text-white">Updates & alerts</p>
                <button onClick={() => setOpen(false)} className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800">
                  <X size={15} />
                </button>
              </div>

              <div className="overflow-y-auto flex-1">
                {announcements.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10 text-center px-6">
                    <Bell size={22} className="text-slate-300 dark:text-slate-700 mb-2" />
                    <p className="text-xs text-slate-400 dark:text-slate-500">Nothing new — you're all caught up.</p>
                  </div>
                ) : (
                  announcements.map((a, i) => {
                    const meta = TYPE_META[a.announcement_type] || TYPE_META.general;
                    const Icon = meta.Icon;
                    return (
                      <motion.div
                        key={a.id}
                        initial={{ opacity: 0, x: 8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.03 }}
                        className="px-4 py-3 border-b border-slate-50 dark:border-slate-800/60 last:border-0 flex gap-3"
                      >
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                          style={{ background: `${meta.accent}18`, border: `1px solid ${meta.accent}28` }}
                        >
                          <Icon size={15} style={{ color: meta.accent }} />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span
                              className="text-[10px] font-semibold uppercase tracking-wider"
                              style={{ color: meta.accent }}
                            >
                              {meta.label}
                            </span>
                            <span className="text-[10px] text-slate-400">{timeAgo(a.published_at)}</span>
                          </div>
                          <p className="text-sm font-semibold text-slate-900 dark:text-white mt-0.5">{a.title}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{a.body}</p>
                        </div>
                      </motion.div>
                    );
                  })
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default NotificationCenter;