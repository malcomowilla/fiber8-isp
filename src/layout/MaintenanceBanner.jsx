import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Construction, Megaphone, X, ChevronDown, ChevronUp } from 'lucide-react';
import { createConsumer } from '@rails/actioncable';

// Only 'alert' and 'maintenance' get the construction-stripe treatment —
// a high-priority 'feature'/'fix'/'general' still gets the banner, just
// with its own accent instead of the hazard stripe.
const TYPE_META = {
  feature:     { label: 'New feature',   Icon: Megaphone,     accent: '#a78bfa', stripe: false },
  fix:         { label: 'Fix',           Icon: Megaphone,     accent: '#38bdf8', stripe: false },
  alert:       { label: 'Alert',         Icon: AlertTriangle, accent: '#ef4444', stripe: true },
  maintenance: { label: 'Under construction', Icon: Construction, accent: '#f59e0b', stripe: true },
  general:     { label: 'Announcement',  Icon: Megaphone,     accent: '#34d399', stripe: false },
};

const POLL_INTERVAL_MS = 60000;
const MAX_VISIBLE_BANNERS = 2;

const BannerBar = ({ announcement, onDismiss, expanded, onToggleExpand }) => {
  const meta = TYPE_META[announcement.announcement_type] || TYPE_META.general;
  const Icon = meta.Icon;

  return (
    <motion.div
      layout
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.25, ease: 'easeInOut' }}
      className="overflow-hidden"
    >
      <div
        className="relative w-full"
        style={{ background: meta.accent }}
      >
        {meta.stripe && (
          <div
            className="absolute inset-0 opacity-[0.12] pointer-events-none"
            style={{
              backgroundImage: 'repeating-linear-gradient(-45deg, #000 0, #000 14px, transparent 14px, transparent 28px)',
            }}
          />
        )}

        <div className="relative max-w-screen-2xl mx-auto px-4 py-2.5 flex items-start gap-3 font-sans">
          <span className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center shrink-0 mt-0.5">
            <Icon size={15} className="text-white" />
          </span>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-bold uppercase tracking-wider text-white/80">
                {meta.label}
              </span>
              <p className="text-sm font-bold text-white truncate">{announcement.title}</p>
            </div>
            <p className={`text-xs text-white/90 mt-0.5 ${expanded ? '' : 'line-clamp-1'}`}>
              {announcement.body}
            </p>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            {announcement.body?.length > 90 && (
              <button
                onClick={onToggleExpand}
                className="p-1.5 rounded-lg text-white/80 hover:bg-white/15 transition-colors"
                aria-label={expanded ? 'Show less' : 'Show more'}
              >
                {expanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
              </button>
            )}
            <button
              onClick={onDismiss}
              className="p-1.5 rounded-lg text-white/80 hover:bg-white/15 transition-colors"
              aria-label="Dismiss"
            >
              <X size={15} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const MaintenanceBanner = () => {
  const subdomain = window.location.hostname.split('.')[0];
  const DISMISSED_KEY = `owitech-dismissed-banners-${subdomain}`;

  const [announcements, setAnnouncements] = useState([]);
  const [dismissedIds, setDismissedIds] = useState(() => {
    try { return JSON.parse(localStorage.getItem(DISMISSED_KEY) || '[]'); } catch { return []; }
  });
  const [expandedId, setExpandedId] = useState(null);
  const [showOverflow, setShowOverflow] = useState(false);
  const subscription = useRef(null);

  const fetchAnnouncements = useCallback(async () => {
    try {
      const res = await fetch('/api/system_announcements_active', { headers: { 'X-Subdomain': subdomain } });
      if (!res.ok) return;
      const data = await res.json();
      setAnnouncements(data.filter((a) => a.priority === 'high'));
    } catch { /* fail silent — banner just won't show this cycle */ }
  }, [subdomain]);

  useEffect(() => {
    fetchAnnouncements();
    const interval = setInterval(fetchAnnouncements, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [fetchAnnouncements]);

  // Live push — a newly-pinned high-priority announcement shows instantly
  // for anyone already in the app, not just on their next poll.
  useEffect(() => {
    const consumer = createConsumer(`wss://${window.location.hostname}/cable`);
    subscription.current = consumer.subscriptions.create(
      { channel: 'MaintenanceChannel', subdomain },
      {
        received(data) {
          const a = data.announcement;
          if (!a || a.priority !== 'high') return;

          if (data.type === 'created') {
            setAnnouncements((prev) => (prev.some((x) => x.id === a.id) ? prev : [a, ...prev]));
          }
          if (data.type === 'updated') {
            setAnnouncements((prev) => {
              const withoutThis = prev.filter((x) => x.id !== a.id);
              return a.active ? [a, ...withoutThis] : withoutThis;
            });
            // An edit to something already dismissed should be seen again —
            // silently re-surfacing a changed notice defeats the purpose
            // of a maintenance banner.
            setDismissedIds((prevIds) => {
              const next = prevIds.filter((id) => id !== a.id);
              localStorage.setItem(DISMISSED_KEY, JSON.stringify(next));
              return next;
            });
          }
        },
      }
    );
    return () => {
      subscription.current?.unsubscribe();
      consumer.disconnect();
    };
  }, [subdomain, DISMISSED_KEY]);

  const dismiss = (id) => {
    setDismissedIds((prev) => {
      const next = [...prev, id];
      localStorage.setItem(DISMISSED_KEY, JSON.stringify(next));
      return next;
    });
    if (expandedId === id) setExpandedId(null);
  };

  const visible = announcements.filter((a) => !dismissedIds.includes(a.id));
  if (visible.length === 0) return null;

  const shown = showOverflow ? visible : visible.slice(0, MAX_VISIBLE_BANNERS);
  const overflowCount = visible.length - shown.length;

  return (
    <div className="sticky top-0 z-[90] shadow-md">
      <AnimatePresence initial={false}>
        {shown.map((a) => (
          <BannerBar
            key={a.id}
            announcement={a}
            expanded={expandedId === a.id}
            onToggleExpand={() => setExpandedId((cur) => (cur === a.id ? null : a.id))}
            onDismiss={() => dismiss(a.id)}
          />
        ))}
      </AnimatePresence>

      {!showOverflow && overflowCount > 0 && (
        <button
          onClick={() => setShowOverflow(true)}
          className="w-full text-center text-[11px] font-semibold text-white py-1 bg-black/20 hover:bg-black/30 transition-colors"
        >
          +{overflowCount} more important update{overflowCount === 1 ? '' : 's'}
        </button>
      )}
    </div>
  );
};

export default MaintenanceBanner;