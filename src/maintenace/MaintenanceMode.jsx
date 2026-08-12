// ─────────────────────────────────────────────────────────────────────────────
// MaintenanceMode.jsx  — drop into src/components/maintenance/
//
// Two exports:
//   1. MaintenancePanel   → admin toggle (add value === 13 in DashboardSystemAdmin)
//   2. MaintenanceScreen  → client-facing page (render at top of your app router)
//
// USAGE IN DashboardSystemAdmin.jsx:
//   import { MaintenancePanel } from './maintenance/MaintenanceMode';
//   // add to navigationItems:
//   { label: <p className='text-black'>Maintenance</p>, icon: <BuildIcon />, value: 13 }
//   // add to content:
//   {value === 13 && <MaintenancePanel />}
//
// USAGE IN your client router (e.g. App.jsx):
//   import { MaintenanceScreen } from './components/maintenance/MaintenanceMode';
//   // at the very top of your route tree:
//   <MaintenanceGate><YourRoutes /></MaintenanceGate>
//
// RAILS ENDPOINT (see maintenance_controller.rb output file):
//   GET  /api/maintenance_status   → { enabled, until, message }
//   POST /api/maintenance_mode     → toggle on/off
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Wrench, Clock, Calendar, AlertTriangle, CheckCircle,
  Power, PowerOff, RefreshCw, Shield, Info, ChevronDown, ChevronUp,
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

const subdomain = () => window.location.hostname.split('.')[0];
const csrf      = () => document.querySelector('meta[name="csrf-token"]')?.content || '';

// ─── format countdown ─────────────────────────────────────────────────────────
function useCountdown(until) {
  const [diff, setDiff] = useState(null);

  useEffect(() => {
    if (!until) return;
    const tick = () => {
      const ms = new Date(until) - Date.now();
      if (ms <= 0) { setDiff(null); return; }
      const h  = Math.floor(ms / 3_600_000);
      const m  = Math.floor((ms % 3_600_000) / 60_000);
      const s  = Math.floor((ms % 60_000) / 1_000);
      setDiff({ h, m, s, total: ms });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [until]);

  return diff;
}

// ─── Countdown unit ───────────────────────────────────────────────────────────
function Unit({ value, label }) {
  return (
    <div className="flex flex-col items-center">
      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center text-3xl sm:text-4xl font-bold text-white"
        style={{
          background: 'rgba(251,191,36,.12)',
          border:     '1px solid rgba(251,191,36,.25)',
          fontFamily: "'Space Mono', monospace",
        }}>
        {String(value).padStart(2, '0')}
      </div>
      <span className="text-xs text-amber-400/60 uppercase tracking-wider mt-2 font-semibold">{label}</span>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// 1. ADMIN PANEL
// ═══════════════════════════════════════════════════════════════════════════════
export function MaintenancePanel() {
  const [status,   setStatus]   = useState({ enabled: false, until: '', message: '' });
  const [form,     setForm]     = useState({ until: '', message: '' });
  const [loading,  setLoading]  = useState(true);
  const [saving,   setSaving]   = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  const fetch_status = useCallback(async () => {
    try {
      const res  = await fetch('/api/maintenance_status', { headers: { 'X-Subdomain': subdomain() } });
      const data = await res.json();
      setStatus(data);
      setForm({ until: data.until || '', message: data.message || '' });
    } catch (_) {
      toast.error('Failed to load maintenance status');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetch_status(); }, [fetch_status]);

  const save = async (enable) => {
    if (enable && !form.until) {
      toast.error('Please set an end date/time before enabling maintenance mode');
      return;
    }
    setSaving(true);
    try {
      const res = await fetch('/api/maintenance_mode', {
        method:  'POST',
        headers: {
          'Content-Type': 'application/json',
          // 'X-Subdomain':  subdomain(),
          'X-CSRF-Token': csrf(),
        },
        body: JSON.stringify({
          enabled: enable,
          until:   form.until,
          message: form.message,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus(data);
        toast.success(enable ? '🔧 Maintenance mode enabled' : '✅ System back online');
      } else {
        toast.error(data.error || 'Failed to update');
      }
    } catch (_) {
      toast.error('Network error');
    } finally {
      setSaving(false);
    }
  };

  const countdown = useCountdown(status.until);

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-5">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <Wrench size={15} className="text-amber-400" />
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">System Admin</span>
          </div>
          <h2 className="text-xl font-bold text-white">Maintenance Mode</h2>
          <p className="text-sm text-slate-500 mt-0.5">
            When enabled, all users will see a maintenance screen instead of the app.
          </p>
        </div>

        {/* Live status badge */}
        <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-bold transition-all ${
          status.enabled
            ? 'bg-amber-400/10 border-amber-400/30 text-amber-400'
            : 'bg-emerald-400/10 border-emerald-400/30 text-emerald-400'
        }`}>
          <div className={`w-2 h-2 rounded-full ${status.enabled ? 'bg-amber-400' : 'bg-emerald-400'}`}
            style={{ boxShadow: status.enabled ? '0 0 6px #fbbf24' : '0 0 6px #34d399' }} />
          {status.enabled ? 'Maintenance Active' : 'System Online'}
        </div>
      </div>

      {/* Active maintenance summary */}
      <AnimatePresence>
        {status.enabled && countdown && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="rounded-2xl border p-5"
            style={{ background: 'rgba(251,191,36,.06)', borderColor: 'rgba(251,191,36,.25)' }}
          >
            <p className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Clock size={12} /> Maintenance ends in
            </p>
            <div className="flex items-center gap-3 justify-center flex-wrap">
              <Unit value={countdown.h} label="hours" />
              <span className="text-3xl font-bold text-amber-400/40 mb-5">:</span>
              <Unit value={countdown.m} label="min" />
              <span className="text-3xl font-bold text-amber-400/40 mb-5">:</span>
              <Unit value={countdown.s} label="sec" />
            </div>
            {status.until && (
              <p className="text-center text-xs text-slate-500 mt-3">
                Until {new Date(status.until).toLocaleString('en-KE', {
                  weekday: 'short', month: 'short', day: 'numeric',
                  hour: '2-digit', minute: '2-digit',
                })}
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Form */}
      <div className="rounded-2xl border p-5 space-y-4"
        style={{ background: 'rgba(15,23,42,.7)', borderColor: 'rgba(148,163,184,.1)' }}>

        {/* End date/time */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
            <Calendar size={12} className="inline mr-1" />
            Maintenance ends at
          </label>
          <input
            type="datetime-local"
            value={form.until}
            onChange={e => setForm(f => ({ ...f, until: e.target.value }))}
            className="w-full px-4 py-3 rounded-xl border text-sm text-white outline-none transition-all"
            style={{
              background:   'rgba(30,41,59,.8)',
              borderColor:  'rgba(148,163,184,.15)',
              colorScheme:  'dark',
            }}
            onFocus={e => e.target.style.borderColor = 'rgba(251,191,36,.5)'}
            onBlur={e  => e.target.style.borderColor = 'rgba(148,163,184,.15)'}
          />
          <p className="text-xs text-slate-600 mt-1">
            Clients will see a countdown timer until this date/time
          </p>
        </div>

        {/* Custom message */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
            <Info size={12} className="inline mr-1" />
            Message to show users
            <span className="ml-1 font-normal normal-case text-slate-600">(optional)</span>
          </label>
          <textarea
            rows={3}
            value={form.message}
            onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
            placeholder="e.g. We're upgrading our servers to serve you better. Back shortly!"
            className="w-full px-4 py-3 rounded-xl border text-sm text-white outline-none resize-none transition-all"
            style={{ background: 'rgba(30,41,59,.8)', borderColor: 'rgba(148,163,184,.15)' }}
            onFocus={e => e.target.style.borderColor = 'rgba(251,191,36,.5)'}
            onBlur={e  => e.target.style.borderColor = 'rgba(148,163,184,.15)'}
          />
          <p className="text-xs text-slate-600 mt-1">
            Leave blank to show the default message
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex gap-3 pt-1">
          {!status.enabled ? (
            <button
              onClick={() => save(true)}
              disabled={saving || !form.until}
              className="flex-1 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              style={{
                background:  'linear-gradient(135deg,#f59e0b,#fbbf24)',
                color:       '#000',
              }}
            >
              {saving ? <RefreshCw size={15} className="animate-spin" /> : <Power size={15} />}
              Enable Maintenance Mode
            </button>
          ) : (
            <button
              onClick={() => save(false)}
              disabled={saving}
              className="flex-1 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-40 cursor-pointer"
              style={{
                background:  'linear-gradient(135deg,#34d399,#10b981)',
                color:       '#000',
              }}
            >
              {saving ? <RefreshCw size={15} className="animate-spin" /> : <CheckCircle size={15} />}
              Disable — Bring System Online
            </button>
          )}

          {status.enabled && (
            <button
              onClick={() => save(true)}
              disabled={saving}
              title="Update end time / message"
              className="px-4 py-3 rounded-xl font-semibold text-sm border transition-all cursor-pointer"
              style={{ background: 'rgba(30,41,59,.6)', borderColor: 'rgba(148,163,184,.15)', color: '#94a3b8' }}
            >
              Update
            </button>
          )}
        </div>
      </div>

      {/* Info panel */}
      <div className="rounded-2xl border overflow-hidden"
        style={{ background: 'rgba(15,23,42,.5)', borderColor: 'rgba(148,163,184,.08)' }}>
        <button onClick={() => setShowInfo(v => !v)}
          className="w-full flex items-center justify-between px-5 py-3.5 text-sm font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer">
          <span className="flex items-center gap-2">
            <Shield size={14} className="text-sky-400" /> How maintenance mode works
          </span>
          {showInfo ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
        <AnimatePresence>
          {showInfo && (
            <motion.div
              initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.22 }}
              className="overflow-hidden">
              <div className="px-5 pb-5 space-y-2.5 text-xs text-slate-400 leading-relaxed">
                {[
                  ['🔧', 'When enabled, every non-admin page request redirects to the maintenance screen.'],
                  ['⏰', 'The screen shows a live countdown timer to the end time you specify.'],
                  ['💬', 'Your custom message (or the default) is shown to all visitors.'],
                  ['🛡️', 'Admins can still log in and access this panel even during maintenance.'],
                  ['✅', 'Disabling removes the maintenance screen immediately for all users.'],
                ].map(([icon, text]) => (
                  <div key={text} className="flex items-start gap-2">
                    <span>{icon}</span>
                    <span>{text}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// 2. CLIENT-FACING MAINTENANCE SCREEN
// ═══════════════════════════════════════════════════════════════════════════════
export function MaintenanceScreen({ until, message, companyName = 'Our System' }) {
  const countdown = useCountdown(until);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&family=Space+Mono:wght@400;700&display=swap');
        .maint-root { font-family: 'Plus Jakarta Sans', sans-serif; }
        .maint-mono { font-family: 'Space Mono', monospace; }
        @keyframes maint-drift {
          0%,100% { transform: translate(0,0) scale(1); }
          50%      { transform: translate(16px,-20px) scale(1.05); }
        }
        @keyframes maint-gear {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes maint-gear-rev {
          from { transform: rotate(0deg); }
          to   { transform: rotate(-360deg); }
        }
        .maint-gear1 { animation: maint-gear     8s linear infinite; }
        .maint-gear2 { animation: maint-gear-rev 6s linear infinite; }
        .maint-drift1 { animation: maint-drift 10s ease-in-out infinite; }
        .maint-drift2 { animation: maint-drift 14s ease-in-out infinite reverse; }
      `}</style>

      <div className="maint-root min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden"
        style={{ background: '#020617' }}>

        {/* Ambient blobs */}
        <div className="maint-drift1 absolute top-0 left-0 w-96 h-96 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle,rgba(251,191,36,.07) 0%,transparent 70%)' }} />
        <div className="maint-drift2 absolute bottom-0 right-0 w-96 h-96 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle,rgba(56,189,248,.05) 0%,transparent 70%)' }} />
        <div className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(rgba(148,163,184,.04) 1px,transparent 1px)',
            backgroundSize:  '28px 28px',
          }} />

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 32, scale: 0.97 }}
          animate={{ opacity: 1, y: 0,  scale: 1    }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-lg text-center"
        >
          <div className="rounded-3xl border overflow-hidden"
            style={{
              background:   'rgba(15,23,42,.78)',
              backdropFilter: 'blur(24px)',
              borderColor:  'rgba(148,163,184,.1)',
              boxShadow:    '0 0 60px rgba(251,191,36,.06)',
            }}>

            {/* Top accent */}
            <div className="h-1 w-full"
              style={{ background: 'linear-gradient(90deg,#f59e0b,#fbbf24,#f59e0b)' }} />

            <div className="px-8 pt-10 pb-8">
              {/* Gear animation */}
              <div className="flex items-center justify-center gap-1 mb-8">
                <svg className="maint-gear1 w-14 h-14 text-amber-400/80" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 15.5a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7zm7.43-2.67c.04-.32.07-.64.07-.83s-.03-.52-.07-.83l1.79-1.4c.16-.12.2-.35.1-.53l-1.7-2.94c-.1-.18-.3-.24-.49-.18l-2.11.85c-.44-.34-.91-.62-1.42-.83l-.32-2.25A.39.39 0 0 0 15 4h-3.4a.39.39 0 0 0-.38.33l-.32 2.25c-.51.21-.98.49-1.42.83L7.37 6.56c-.19-.07-.39 0-.49.18L5.19 9.68a.4.4 0 0 0 .1.53l1.79 1.4c-.04.31-.07.63-.07.83s.03.52.07.83l-1.79 1.4a.4.4 0 0 0-.1.53l1.69 2.94c.1.18.3.24.49.18l2.11-.85c.44.34.91.62 1.42.83l.32 2.25c.05.2.22.33.39.33H15c.17 0 .34-.13.38-.33l.32-2.25c.51-.21.98-.49 1.42-.83l2.11.85c.19.07.39 0 .49-.18l1.7-2.94a.4.4 0 0 0-.1-.53l-1.89-1.4z"/>
                </svg>
                <svg className="maint-gear2 w-8 h-8 text-amber-400/50" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 15.5a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7zm7.43-2.67c.04-.32.07-.64.07-.83s-.03-.52-.07-.83l1.79-1.4c.16-.12.2-.35.1-.53l-1.7-2.94c-.1-.18-.3-.24-.49-.18l-2.11.85c-.44-.34-.91-.62-1.42-.83l-.32-2.25A.39.39 0 0 0 15 4h-3.4a.39.39 0 0 0-.38.33l-.32 2.25c-.51.21-.98.49-1.42.83L7.37 6.56c-.19-.07-.39 0-.49.18L5.19 9.68a.4.4 0 0 0 .1.53l1.79 1.4c-.04.31-.07.63-.07.83s.03.52.07.83l-1.79 1.4a.4.4 0 0 0-.1.53l1.69 2.94c.1.18.3.24.49.18l2.11-.85c.44.34.91.62 1.42.83l.32 2.25c.05.2.22.33.39.33H15c.17 0 .34-.13.38-.33l.32-2.25c.51-.21.98-.49 1.42-.83l2.11.85c.19.07.39 0 .49-.18l1.7-2.94a.4.4 0 0 0-.1-.53l-1.89-1.4z"/>
                </svg>
              </div>

              <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-2 tracking-tight">
                Under Maintenance
              </h1>
              <p className="text-amber-400 font-semibold text-sm uppercase tracking-widest mb-4">
                {/* {companyName} */}
              Aitechs
              </p>
              <p className="text-slate-400 text-sm leading-relaxed mb-8 max-w-sm mx-auto">
                {message || "We're performing scheduled maintenance to improve your experience. We'll be back online shortly — thank you for your patience."}
              </p>

              {/* Countdown */}
              {countdown ? (
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">
                    Back online in
                  </p>
                  <div className="flex items-center justify-center gap-3 mb-6 flex-wrap">
                    <Unit value={countdown.h} label="hours" />
                    <span className="text-3xl font-bold text-amber-400/30 mb-5">:</span>
                    <Unit value={countdown.m} label="min" />
                    <span className="text-3xl font-bold text-amber-400/30 mb-5">:</span>
                    <Unit value={countdown.s} label="sec" />
                  </div>
                  {until && (
                    <p className="text-xs text-slate-600 mb-6">
                      Estimated completion:{' '}
                      <span className="text-slate-400 maint-mono">
                        {new Date(until).toLocaleString('en-KE', {
                          weekday: 'short', day: 'numeric', month: 'short',
                          hour: '2-digit', minute: '2-digit',
                        })}
                      </span>
                    </p>
                  )}
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2 mb-6 text-slate-500 text-sm">
                  <RefreshCw size={14} className="animate-spin" />
                  Working on it…
                </div>
              )}

              {/* Status strip */}
              <div className="flex items-center justify-center gap-6 text-xs text-slate-600 pt-5"
                style={{ borderTop: '1px solid rgba(148,163,184,.07)' }}>
                {[
                  { icon: '🔒', text: 'Your data is safe' },
                  { icon: '🔧', text: 'Maintenance in progress' },
                  { icon: '📡', text: 'Auto-refresh on completion' },
                ].map(({ icon, text }) => (
                  <span key={text} className="flex items-center gap-1">
                    {icon} {text}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <p className="text-xs text-slate-700 mt-6">
            If this is urgent, contact your administrator.
          </p>
        </motion.div>
      </div>
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// 3. GATE WRAPPER  (wrap your entire client-side router with this)
// ═══════════════════════════════════════════════════════════════════════════════
export function MaintenanceGate({ children }) {
  const [maint, setMaint] = useState(null);   // null = loading

  useEffect(() => {
    fetch('/api/maintenance_status', {
      headers: { 'X-Subdomain': window.location.hostname.split('.')[0] },
    })
      .then(r => r.json())
      .then(d => setMaint(d))
      .catch(() => setMaint({ enabled: false }));
  }, []);

  if (maint === null) return null;   // brief loading — add a spinner if needed

  if (maint.enabled) {
    return (
      <MaintenanceScreen
        until={maint.until}
        message={maint.message}
        companyName={maint.company_name}
      />
    );
  }

  return children;
}