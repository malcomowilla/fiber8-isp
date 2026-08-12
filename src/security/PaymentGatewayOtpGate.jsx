// src/components/security/PaymentGatewayOtpGate.jsx
import { useState, useEffect, useCallback } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, ShieldCheck, KeyRound, Loader2, Settings2, X, ShieldOff } from 'lucide-react';

const SESSION_TTL_MINUTES = 15;

const PaymentGatewayOtpGate = ({ title, children }) => {
  const subdomain = window.location.hostname.split('.')[0];

  const [loading, setLoading] = useState(true);
  const [pinSet, setPinSet] = useState(false);
  const [verified, setVerified] = useState(false);
  const [canManagePin, setCanManagePin] = useState(false);
  const [unlockedAt, setUnlockedAt] = useState(null);
  const [remainingMs, setRemainingMs] = useState(null);

  const [pinInput, setPinInput] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [showManage, setShowManage] = useState(false);
  const [managePin, setManagePin] = useState({ current: '', next: '', confirm: '' });
  const [manageSubmitting, setManageSubmitting] = useState(false);
  const [manageMode, setManageMode] = useState(null);

  const fetchStatus = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/payment_gateway_pin', { headers: { 'X-Subdomain': subdomain } });
      const data = await res.json();
      if (res.ok) {
        setPinSet(data.pin_set);
        setVerified(data.verified);
        setCanManagePin(!!data.can_manage_pin);
        if (data.verified) setUnlockedAt(Date.now());
      } else {
        toast.error(data.error || 'Could not check payment settings lock status');
      }
    } catch {
      toast.error('Could not check payment settings lock status');
    } finally {
      setLoading(false);
    }
  }, [subdomain]);

  useEffect(() => { fetchStatus(); }, [fetchStatus]);

  useEffect(() => {
    if (!verified || !unlockedAt) return;
    const id = setInterval(() => {
      const elapsed = Date.now() - unlockedAt;
      const remaining = SESSION_TTL_MINUTES * 60 * 1000 - elapsed;
      if (remaining <= 0) {
        setVerified(false);
        setUnlockedAt(null);
        setRemainingMs(null);
        toast('Payment settings locked — enter your PIN again', { icon: '🔒' });
      } else {
        setRemainingMs(remaining);
      }
    }, 1000);
    return () => clearInterval(id);
  }, [verified, unlockedAt]);

  const formatRemaining = (ms) => {
    if (ms == null) return '';
    const totalSeconds = Math.max(0, Math.floor(ms / 1000));
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    if (pinInput.length < 4) return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/payment_gateway_pin/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Subdomain': subdomain },
        body: JSON.stringify({ pin: pinInput }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setVerified(true);
        setUnlockedAt(Date.now());
        setPinInput('');
      } else {
        toast.error(data.error || 'Incorrect PIN', { position: 'top-center' });
        setPinInput('');
      }
    } catch {
      toast.error('Something went wrong. Please try again', { position: 'top-center' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleSetupPin = async (e) => {
    e.preventDefault();
    if (managePin.next.length < 4 || managePin.next !== managePin.confirm) {
      toast.error("PINs must match and be 4-6 digits", { position: 'top-center' });
      return;
    }
    setManageSubmitting(true);
    try {
      const res = await fetch('/api/payment_gateway_pin', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'X-Subdomain': subdomain },
        body: JSON.stringify({ new_pin: managePin.next, new_pin_confirmation: managePin.confirm }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success('PIN set — this page is now protected');
        setPinSet(true);
        setVerified(true);
        setUnlockedAt(Date.now());
        setManagePin({ current: '', next: '', confirm: '' });
      } else {
        toast.error(data.error || 'Could not set PIN', { position: 'top-center' });
      }
    } catch {
      toast.error('Something went wrong. Please try again', { position: 'top-center' });
    } finally {
      setManageSubmitting(false);
    }
  };

  const handleChangePin = async (e) => {
    e.preventDefault();
    if (managePin.next.length < 4 || managePin.next !== managePin.confirm) {
      toast.error("New PINs must match and be 4-6 digits", { position: 'top-center' });
      return;
    }
    setManageSubmitting(true);
    try {
      const res = await fetch('/api/payment_gateway_pin', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'X-Subdomain': subdomain },
        body: JSON.stringify({
          current_pin: managePin.current,
          new_pin: managePin.next,
          new_pin_confirmation: managePin.confirm,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success('PIN updated');
        setUnlockedAt(Date.now());
        setManagePin({ current: '', next: '', confirm: '' });
        setManageMode(null);
        setShowManage(false);
      } else {
        toast.error(data.error || 'Could not update PIN', { position: 'top-center' });
      }
    } catch {
      toast.error('Something went wrong. Please try again', { position: 'top-center' });
    } finally {
      setManageSubmitting(false);
    }
  };

  const handleRemovePin = async (e) => {
    e.preventDefault();
    setManageSubmitting(true);
    try {
      const res = await fetch('/api/payment_gateway_pin', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', 'X-Subdomain': subdomain },
        body: JSON.stringify({ current_pin: managePin.current }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success('PIN removed — this page is no longer locked');
        setPinSet(false);
        setVerified(true);
        setManagePin({ current: '', next: '', confirm: '' });
        setManageMode(null);
        setShowManage(false);
      } else {
        toast.error(data.error || 'Could not remove PIN', { position: 'top-center' });
      }
    } catch {
      toast.error('Something went wrong. Please try again', { position: 'top-center' });
    } finally {
      setManageSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
      </div>
    );
  }

  if (!pinSet) {
    if (!canManagePin) {
      return (
        <div className="font-sans max-w-sm mx-auto py-16 px-4 text-center">
          <Toaster />
          <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-3">
            <Lock size={20} className="text-slate-500 dark:text-slate-400" />
          </div>
          <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">PIN protection not set up</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Ask an account admin to set up a PIN for {title || 'this page'} before it can be used.
          </p>
        </div>
      );
    }

    return (
      <div className="font-sans max-w-sm mx-auto py-16 px-4">
        <Toaster />
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center mb-3">
            <ShieldCheck size={22} className="text-indigo-600 dark:text-indigo-400" />
          </div>
          <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">Protect {title || 'this page'}</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Set a PIN so only someone who knows it can view or change these payment settings.
            You'll be asked for it again after 15 minutes of inactivity.
          </p>
        </div>
        <form onSubmit={handleSetupPin} className="space-y-3">
          <input
            type="password" inputMode="numeric" maxLength={6} autoFocus
            value={managePin.next}
            onChange={(e) => setManagePin((p) => ({ ...p, next: e.target.value.replace(/\D/g, '') }))}
            placeholder="Choose a 4-6 digit PIN"
            className="w-full text-center tracking-[0.5em] text-lg py-3 rounded-xl border border-slate-200 dark:border-slate-800
              bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-slate-100
              placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <input
            type="password" inputMode="numeric" maxLength={6}
            value={managePin.confirm}
            onChange={(e) => setManagePin((p) => ({ ...p, confirm: e.target.value.replace(/\D/g, '') }))}
            placeholder="Confirm PIN"
            className="w-full text-center tracking-[0.5em] text-lg py-3 rounded-xl border border-slate-200 dark:border-slate-800
              bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-slate-100
              placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <button
            type="submit" disabled={manageSubmitting}
            className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60
              text-white text-sm font-semibold transition-colors"
          >
            {manageSubmitting ? 'Setting PIN…' : 'Set PIN'}
          </button>
        </form>
      </div>
    );
  }

  if (!verified) {
    return (
      <div className="font-sans max-w-sm mx-auto py-16 px-4">
        <Toaster />
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-3">
            <Lock size={20} className="text-slate-500 dark:text-slate-400" />
          </div>
          <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">{title || 'Payment Settings'} locked</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Enter your PIN to continue</p>
        </div>
        <form onSubmit={handleVerify} className="space-y-3">
          <input
            type="password" inputMode="numeric" maxLength={6} autoFocus
            value={pinInput}
            onChange={(e) => setPinInput(e.target.value.replace(/\D/g, ''))}
            placeholder="••••"
            className="w-full text-center tracking-[0.5em] text-lg py-3 rounded-xl border border-slate-200 dark:border-slate-800
              bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-slate-100
              placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <button
            type="submit" disabled={submitting || pinInput.length < 4}
            className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60
              text-white text-sm font-semibold transition-colors"
          >
            {submitting ? 'Checking…' : 'Unlock'}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="font-sans relative">
      <Toaster />

      <div className="flex items-center justify-end gap-2 px-4 sm:px-6 pt-3">
        {remainingMs != null && (
          <span className="text-[11px] text-slate-400 dark:text-slate-500">
            Auto-locks in {formatRemaining(remainingMs)}
          </span>
        )}
        {canManagePin && (
          <button
            type="button"
            onClick={() => setShowManage(true)}
            className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500 dark:text-slate-400
              hover:text-slate-700 dark:hover:text-slate-200 px-2 py-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <Settings2 size={13} /> Manage PIN
          </button>
        )}
      </div>

      {children}

      <AnimatePresence>
        {showManage && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4"
            onClick={() => { setShowManage(false); setManageMode(null); }}
          >
            <motion.div
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 12 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5"
            >
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Manage PIN</p>
                <button onClick={() => { setShowManage(false); setManageMode(null); }} className="text-slate-400 hover:text-slate-600">
                  <X size={16} />
                </button>
              </div>

              {!manageMode && (
                <div className="space-y-2">
                  <button
                    onClick={() => setManageMode('change')}
                    className="w-full flex items-center gap-2 text-sm px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800
                      hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300 transition-colors"
                  >
                    <KeyRound size={15} /> Change PIN
                  </button>
                  <button
                    onClick={() => setManageMode('remove')}
                    className="w-full flex items-center gap-2 text-sm px-3 py-2.5 rounded-xl border border-red-200 dark:border-red-500/20
                      hover:bg-red-50 dark:hover:bg-red-500/10 text-red-600 dark:text-red-400 transition-colors"
                  >
                    <ShieldOff size={15} /> Remove PIN protection
                  </button>
                </div>
              )}

              {manageMode === 'change' && (
                <form onSubmit={handleChangePin} className="space-y-2.5">
                  <input
                    type="password" inputMode="numeric" maxLength={6} autoFocus
                    value={managePin.current}
                    onChange={(e) => setManagePin((p) => ({ ...p, current: e.target.value.replace(/\D/g, '') }))}
                    placeholder="Current PIN"
                    className="w-full text-sm px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60"
                  />
                  <input
                    type="password" inputMode="numeric" maxLength={6}
                    value={managePin.next}
                    onChange={(e) => setManagePin((p) => ({ ...p, next: e.target.value.replace(/\D/g, '') }))}
                    placeholder="New PIN"
                    className="w-full text-sm px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60"
                  />
                  <input
                    type="password" inputMode="numeric" maxLength={6}
                    value={managePin.confirm}
                    onChange={(e) => setManagePin((p) => ({ ...p, confirm: e.target.value.replace(/\D/g, '') }))}
                    placeholder="Confirm new PIN"
                    className="w-full text-sm px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60"
                  />
                  <div className="flex gap-2 pt-1">
                    <button type="button" onClick={() => setManageMode(null)}
                      className="flex-1 text-xs font-medium py-2 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300">
                      Back
                    </button>
                    <button type="submit" disabled={manageSubmitting}
                      className="flex-1 text-xs font-semibold py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white">
                      {manageSubmitting ? 'Saving…' : 'Save'}
                    </button>
                  </div>
                </form>
              )}

              {manageMode === 'remove' && (
                <form onSubmit={handleRemovePin} className="space-y-2.5">
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    This page will no longer require a PIN to view or edit. Enter your current PIN to confirm.
                  </p>
                  <input
                    type="password" inputMode="numeric" maxLength={6} autoFocus
                    value={managePin.current}
                    onChange={(e) => setManagePin((p) => ({ ...p, current: e.target.value.replace(/\D/g, '') }))}
                    placeholder="Current PIN"
                    className="w-full text-sm px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60"
                  />
                  <div className="flex gap-2 pt-1">
                    <button type="button" onClick={() => setManageMode(null)}
                      className="flex-1 text-xs font-medium py-2 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300">
                      Back
                    </button>
                    <button type="submit" disabled={manageSubmitting}
                      className="flex-1 text-xs font-semibold py-2 rounded-lg bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white">
                      {manageSubmitting ? 'Removing…' : 'Remove PIN'}
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PaymentGatewayOtpGate;