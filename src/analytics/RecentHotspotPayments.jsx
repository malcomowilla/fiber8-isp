import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Ticket, Tv, Zap, Radio } from 'lucide-react';

const fmtKsh = (v) => `KSh ${Number(v || 0).toLocaleString('en-KE')}`;

function timeAgo(iso) {
  const diff = Math.max(0, Math.floor((Date.now() - new Date(iso).getTime()) / 1000));
  if (diff < 5) return 'just now';
  if (diff < 60) return `${diff}s ago`;
  const m = Math.floor(diff / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

function maskPhone(phone) {
  if (!phone) return 'Unknown';
  const s = String(phone);
  return s.length > 6 ? `${s.slice(0, 4)}••${s.slice(-3)}` : s;
}

const KIND_META = {
  voucher: { label: 'Voucher', icon: Ticket, accent: '#22d3ee' },
  tv_plan: { label: 'TV Plan', icon: Tv, accent: '#a78bfa' },
};

function PaymentRow({ payment, isNew }) {
  const meta = KIND_META[payment.kind] || KIND_META.voucher;
  const Icon = meta.icon;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -24, scale: 0.96 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 24, scale: 0.96 }}
      transition={{ type: 'spring', stiffness: 300, damping: 26 }}
      className="relative flex items-center gap-3 rounded-xl px-3 py-2.5 overflow-hidden"
      style={{
        background: isNew ? `${meta.accent}12` : 'transparent',
        border: `1px solid ${isNew ? `${meta.accent}30` : 'rgba(148,163,184,.08)'}`,
      }}
    >
      {isNew && (
        <motion.div
          initial={{ opacity: .55 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 1.8 }}
          className="absolute inset-0 pointer-events-none"
          style={{ background: `${meta.accent}20` }}
        />
      )}

      <div className="relative w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
        style={{ background: `${meta.accent}18`, border: `1px solid ${meta.accent}28` }}>
        <Icon size={16} style={{ color: meta.accent }} />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
            {payment.name || maskPhone(payment.phone)}
          </p>
          <p className="text-sm font-bold tabular-nums shrink-0" style={{ color: meta.accent }}>
            +{fmtKsh(payment.amount)}
          </p>
        </div>
        <div className="flex items-center justify-between gap-2 mt-0.5">
          <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
            {meta.label}{payment.package ? ` · ${payment.package}` : ''}
          </p>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 shrink-0 tabular-nums">
            {timeAgo(payment.created_at)}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export default function RecentHotspotPayments({ cable, subdomain, maxItems = 12 }) {
  const [payments, setPayments] = useState([]);
  const [toast, setToast] = useState(null);
  const [, setTick] = useState(0);
  const newIdsRef = useRef(new Set());
  const toastTimerRef = useRef(null);

  // keep "x ago" fresh
  useEffect(() => {
    const t = setInterval(() => setTick(v => v + 1), 15000);
    return () => clearInterval(t);
  }, []);

  const pushPayment = useCallback((data) => {
    setPayments(prev => {
      if (prev.some(p => p.id === data.id)) return prev;
      return [data, ...prev].slice(0, maxItems);
    });

    newIdsRef.current.add(data.id);
    setTimeout(() => { newIdsRef.current.delete(data.id); setTick(v => v + 1); }, 2200);

    setToast(data);
    clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => setToast(null), 4200);
  }, [maxItems]);

  useEffect(() => {
    if (!cable || !subdomain) return;
    const sub = cable.subscriptions.create(
      { channel: 'HotspotPaymentsChannel', 'X-Subdomain': subdomain },
      { received: (data) => pushPayment(data) }
    );
    return () => sub.unsubscribe();
  }, [cable, subdomain, pushPayment]);

  const toastMeta = toast ? (KIND_META[toast.kind] || KIND_META.voucher) : null;

  return (
    <>
      {/* ── Toast ─────────────────────────────────────────────────────────── */}
      <div className="fixed top-5 right-5 z-[9999] pointer-events-none" style={{ width: 320 }}>
        <AnimatePresence>
          {toast && (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: -16, scale: .92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: .95, transition: { duration: .2 } }}
              transition={{ type: 'spring', stiffness: 340, damping: 24 }}
              className="pointer-events-auto rounded-2xl p-3.5 flex items-center gap-3 shadow-2xl"
              style={{
                background: 'rgba(15,23,42,.92)',
                border: `1px solid ${toastMeta.accent}40`,
                backdropFilter: 'blur(18px)',
              }}
            >
              <motion.div
                initial={{ scale: 0 }} animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 400, damping: 14, delay: .05 }}
                className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                style={{ background: `${toastMeta.accent}22` }}
              >
                <toastMeta.icon size={18} style={{ color: toastMeta.accent }} />
              </motion.div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">New payment</p>
                <p className="text-sm font-bold text-white truncate">{fmtKsh(toast.amount)} · {toast.name || maskPhone(toast.phone)}</p>
                <p className="text-[11px] text-slate-400 truncate">
                  {toastMeta.label}{toast.package ? ` · ${toast.package}` : ''}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Panel ─────────────────────────────────────────────────────────── */}
      <div className="chart-panel rounded-2xl p-5">
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="relative inline-flex w-2 h-2">
                <span className="pulse-online absolute inset-0 rounded-full" />
                <span className="relative block w-2 h-2 rounded-full bg-emerald-400" />
              </span>
              <span className="text-xs font-semibold text-emerald-500 dark:text-emerald-400 uppercase tracking-wider">Live</span>
            </div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">Recent Hotspot Payments</h2>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500">
            <Zap size={12} style={{ color: '#fbbf24' }} />
            {payments.length} recent
          </div>
        </div>

        <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
          <AnimatePresence initial={false}>
            {payments.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-10 text-center gap-2"
              >
                <Radio size={22} className="text-slate-300 dark:text-slate-600" />
                <p className="text-sm text-slate-400 dark:text-slate-500">Waiting for the next payment…</p>
              </motion.div>
            ) : (
              payments.map(p => (
                <PaymentRow key={p.id} payment={p} isNew={newIdsRef.current.has(p.id)} />
              ))
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}