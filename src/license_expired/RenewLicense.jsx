import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiCheck, FiCopy, FiSmartphone, FiHash, FiArrowLeft,
  FiAlertTriangle, FiRefreshCw, FiList, FiShield, FiZap,
} from 'react-icons/fi';

// The platform's paybill, NOT the tenant's own hotspot shortcode.
const PLATFORM_PAYBILL = '4007893';
// Where to send the admin once the license is renewed.
const DASHBOARD_PATH = '/admin';
const TIMEOUT_SECONDS = 120;

const kes = (n) => `KES ${Number(n || 0).toLocaleString()}`;

const parseItems = (raw) => {
  try {
    const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
    return Array.isArray(parsed?.items) ? parsed.items : [];
  } catch {
    return [];
  }
};

/* ── small pieces ─────────────────────────────────────────────── */

const Stepper = ({ active }) => {
  const steps = ['Invoice', 'Pay', 'Confirmed'];
  return (
    <div className="flex items-center justify-center gap-2 sm:gap-3 mb-8">
      {steps.map((label, i) => {
        const n = i + 1;
        const done = n < active;
        const current = n === active;
        return (
          <React.Fragment key={label}>
            <div className="flex items-center gap-2">
              <span
                className={`grid place-items-center w-7 h-7 
                    rounded-full text-xs font-bold transition-all
                ${done ? ' text-emerald-950'
                  : current ? 'bg-white text-emerald-900 ring-4 ring-emerald-400/30'
                  : 'bg-white/10 text-white/40'}`}
              >
                {done ? <FiCheck /> : n}
              </span>
              <span className={`text-sm font-medium hidden sm:block ${current || done ? 'text-white' : 'text-white/40'}`}>
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <span className={`h-px w-8 sm:w-14 ${n < active ? 'bg-emerald-400' : 'bg-white/15'}`} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

const CopyField = ({ label, value, big, copied, onCopy }) => (
  <button
    type="button"
    onClick={onCopy}
    className="group w-full text-left rounded-2xl border border-white/10 bg-white/[0.04] hover:bg-white/[0.08]
               hover:border-emerald-400/50 transition-all px-4 py-3.5 flex items-center justify-between gap-3"
  >
    <span>
      <span className="block text-[11px] uppercase tracking-[0.14em] text-emerald-200/60 mb-1">{label}</span>
      <span className={`block font-mono font-semibold text-white ${big ? 'text-2xl' : 'text-lg'} tabular-nums`}>
        {value}
      </span>
    </span>
    <span
      className={`shrink-0 grid place-items-center w-9 h-9 rounded-xl text-sm transition-all
      ${copied ? 'bg-emerald-400 text-emerald-950' : 'bg-white/10 text-white/70 group-hover:bg-emerald-400/20 group-hover:text-emerald-300'}`}
    >
      {copied ? <FiCheck /> : <FiCopy />}
    </span>
  </button>
);

const Ring = ({ seconds }) => {
  const r = 44;
  const c = 2 * Math.PI * r;
  const pct = Math.min(seconds / TIMEOUT_SECONDS, 1);
  return (
    <div className="relative w-28 h-28">
      <span className="absolute inset-0 rounded-full bg-emerald-400/20 animate-ping" />
      <svg viewBox="0 0 100 100" className="relative w-28 h-28 -rotate-90">
        <circle cx="50" cy="50" r={r} fill="none" stroke="rgba(255,255,255,.1)" strokeWidth="6" />
        <circle
          cx="50" cy="50" r={r} fill="none" stroke="#34d399" strokeWidth="6" strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={c * pct} className="transition-all duration-1000 ease-linear"
        />
      </svg>
      <FiSmartphone className="absolute inset-0 m-auto text-emerald-300 text-3xl" />
    </div>
  );
};

/* ── page ─────────────────────────────────────────────────────── */

const RenewLicense = () => {
  const navigate = useNavigate();
  const subdomain = window.location.hostname.split('.')[0];

  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [selectedId, setSelectedId] = useState(null);

  const [method, setMethod] = useState('stk'); // stk | paybill
  const [phone, setPhone] = useState('');
  const [payState, setPayState] = useState('idle'); // idle|sending|waiting|paid|partial|failed|timeout
  const [payMessage, setPayMessage] = useState('');
  const [checkoutId, setCheckoutId] = useState(null);
  const [payResult, setPayResult] = useState(null);
  const [elapsed, setElapsed] = useState(0);
  const [copied, setCopied] = useState('');

  const headers = useMemo(() => ({ 'X-Subdomain': subdomain }), [subdomain]);

  /* load invoices */
  const loadInvoices = useCallback(async () => {
    try {
      setLoading(true);
      setLoadError('');
      const res = await fetch('/api/invoices', { headers });
      const data = await res.json();
      if (res.ok) {
        setInvoices(Array.isArray(data) ? data : []);
      } else if (res.status === 401) {
        window.location.href = '/signin';
      } else {
        setLoadError(data?.error || 'Could not load your invoices');
      }
    } catch {
      setLoadError('Network error while loading your invoices');
    } finally {
      setLoading(false);
    }
  }, [headers]);

  useEffect(() => { loadInvoices(); }, [loadInvoices]);

  const unpaid = useMemo(
    () =>
      invoices
        .filter((i) => String(i.status).toLowerCase() !== 'paid')
        .sort((a, b) => b.id - a.id), // newest first
    [invoices]
  );

  const invoice = useMemo(
    () => unpaid.find((i) => i.id === selectedId) || unpaid[0] || null,
    [unpaid, selectedId]
  );
  const items = useMemo(() => parseItems(invoice?.invoice_desciption), [invoice]);

  /* switching invoice resets any half-finished payment */
  const resetPayment = () => {
    setPayState('idle');
    setPayMessage('');
    setCheckoutId(null);
    setPayResult(null);
    setElapsed(0);
  };

  /* STK push */
  const sendStk = async () => {
    setPayState('sending');
    setPayMessage('');
    try {
      const res = await fetch('/api/invoice_stk_push', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...headers },
        body: JSON.stringify({ id: invoice.id, phone_number: phone.replace(/\s/g, '') }),
      });
      const data = await res.json();
      if (res.ok) {
        setCheckoutId(data.checkout_request_id || null);
        setElapsed(0);
        setPayState('waiting');
      } else {
        setPayState('failed');
        setPayMessage(data.error || 'Could not send the M-Pesa prompt');
      }
    } catch {
      setPayState('failed');
      setPayMessage('Network error, please try again');
    }
  };

  const startWatching = () => {
    setCheckoutId(null);
    setElapsed(0);
    setPayMessage('');
    setPayState('waiting');
  };

  /* watch for payment: tick every second, poll every 3s, give up at 2 min */
  const elapsedRef = useRef(0);
  useEffect(() => {
    if (payState !== 'waiting' || !invoice) return undefined;
    let cancelled = false;
    elapsedRef.current = 0;

    const check = async () => {
      try {
        const qs = new URLSearchParams({ id: invoice.id });
        if (checkoutId) qs.set('checkout_request_id', checkoutId);
        const res = await fetch(`/api/invoice_payment_status?${qs}`, { headers });
        const data = await res.json();
        if (cancelled || !res.ok) return;

        if (data.state === 'paid') {
          setPayResult(data);
          setPayState('paid');
          setInvoices((prev) => prev.map((i) => (i.id === invoice.id ? { ...i, status: 'paid' } : i)));
        } else if (data.state === 'partial') {
          setPayResult(data);
          setPayState('partial');
        } else if (data.state === 'failed') {
          setPayMessage(data.message || 'Payment failed');
          setPayState('failed');
        }
      } catch { /* next tick retries */ }
    };

    const timer = setInterval(() => {
      elapsedRef.current += 1;
      setElapsed(elapsedRef.current);
      if (elapsedRef.current >= TIMEOUT_SECONDS) {
        setPayState('timeout');
        return;
      }
      if (elapsedRef.current % 3 === 0) check();
    }, 1000);
    check();

    return () => { cancelled = true; clearInterval(timer); };
  }, [payState, checkoutId, invoice, headers]);

  const copy = async (key, value) => {
    try {
      await navigator.clipboard.writeText(String(value));
      setCopied(key);
      setTimeout(() => setCopied(''), 1600);
    } catch { /* clipboard blocked, ignore */ }
  };

  const goToDashboard = () => { window.location.href = DASHBOARD_PATH; }; // full reload so license state refreshes
  const busy = payState === 'sending' || payState === 'waiting';
  const phoneOk = phone.replace(/\D/g, '').length >= 9;
  const activeStep = payState === 'paid' ? 3 : 2;

  /* ── render ── */
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#04130d] text-white font-sans">
      {/* ambient background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 -left-32 w-[28rem] h-[28rem] rounded-full bg-emerald-500/25 blur-[120px]" />
        <div className="absolute bottom-[-10rem] right-[-8rem] w-[30rem] h-[30rem] rounded-full bg-teal-400/15 blur-[130px]" />
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
            backgroundSize: '44px 44px',
            maskImage: 'radial-gradient(ellipse at center, black 30%, transparent 75%)',
            WebkitMaskImage: 'radial-gradient(ellipse at center, black 30%, transparent 75%)',
          }}
        />
      </div>

      <div className="relative max-w-5xl mx-auto px-4 py-8 sm:py-12">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors mb-6"
        >
          <FiArrowLeft /> Back
        </button>

        <div className="text-center mb-8">
          <span className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-emerald-300 bg-emerald-400/10 border border-emerald-400/20 rounded-full px-3 py-1 mb-4">
            <FiShield /> License renewal
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Get back online in <span className="text-emerald-300">under a minute</span>
          </h1>
          <p className="text-white/50 mt-2 text-sm sm:text-base">
            Pay the invoice below. Your access is restored automatically once the payment lands.
          </p>
        </div>

        <Stepper active={activeStep} />

        {/* states: loading / error / nothing to pay */}
        {loading && (
          <div className="grid place-items-center py-24">
            <div className="w-10 h-10 rounded-full border-2 border-white/15 border-t-emerald-400 animate-spin" />
          </div>
        )}

        {!loading && loadError && (
          <div className="max-w-md mx-auto text-center rounded-3xl border border-red-400/20 bg-red-400/5 p-8">
            <FiAlertTriangle className="mx-auto text-3xl text-red-300 mb-3" />
            <p className="text-white/80 mb-5">{loadError}</p>
            <button onClick={loadInvoices} className="inline-flex items-center gap-2 rounded-xl bg-white/10 hover:bg-white/15 px-4 py-2 text-sm font-semibold">
              <FiRefreshCw /> Try again
            </button>
          </div>
        )}

        {!loading && !loadError && !invoice && payState !== 'paid' && (
          <div className="max-w-md mx-auto text-center rounded-3xl border border-emerald-400/20 bg-emerald-400/5 p-10">
            <div className="mx-auto mb-4 grid place-items-center w-14 h-14 rounded-full bg-emerald-400 text-emerald-950 text-2xl"><FiCheck /></div>
            <h2 className="text-xl font-bold mb-1">Nothing to pay</h2>
            <p className="text-white/50 text-sm mb-6">There are no unpaid invoices on your account.</p>
            <button onClick={goToDashboard} className="rounded-xl bg-emerald-400 hover:bg-emerald-300 text-emerald-950 font-bold px-6 py-3 transition-colors">
              Go to dashboard
            </button>
          </div>
        )}

        {/* main */}
        {!loading && !loadError && (invoice || payState === 'paid') && (
          <div className="grid lg:grid-cols-5 gap-6 items-start">
            {/* ── LEFT: ticket ── */}
            <div className="lg:col-span-2 relative">
              <div className="relative rounded-3xl bg-gradient-to-b from-emerald-400/20 to-emerald-400/[0.04] border border-emerald-400/25 backdrop-blur-xl overflow-hidden">
                <div className="p-6 pb-5">
                  <div className="flex items-center justify-between mb-5">
                    <span className="text-[11px] uppercase tracking-[0.18em] text-emerald-200/70">Amount due</span>
                    <span className="font-mono text-xs bg-black/30 rounded-md px-2 py-1 text-emerald-200">
                      {invoice?.invoice_number}
                    </span>
                  </div>
                  <p className="text-4xl sm:text-5xl font-extrabold tracking-tight tabular-nums">
                    {kes(invoice?.total)}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-sm text-white/55">
                    <span>Issued <b className="text-white/85 font-semibold">{invoice?.invoice_date}</b></span>
                    <span>Due <b className="text-white/85 font-semibold">{invoice?.due_date}</b></span>
                  </div>
                </div>

                {/* perforation */}
                <div className="relative h-5">
                  <span className="absolute -left-2.5 top-0 w-5 h-5 rounded-full bg-[#04130d]" />
                  <span className="absolute -right-2.5 top-0 w-5 h-5 rounded-full bg-[#04130d]" />
                  <div className="absolute left-4 right-4 top-1/2 border-t border-dashed border-white/20" />
                </div>

                <div className="p-6 pt-4">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-emerald-200/60 mb-3">What you're paying for</p>
                  <ul className="space-y-3">
                    {items.length > 0 ? items.map((it, i) => (
                      <li key={i} className="flex items-start justify-between gap-3 text-sm">
                        <span>
                          <span className="block font-medium text-white/90">{it.description}</span>
                          {it.details && <span className="block text-xs text-white/40 mt-0.5">{it.details}</span>}
                        </span>
                        <span className="font-mono tabular-nums text-white/80 whitespace-nowrap">
                          {Number(it.amount || 0).toLocaleString()}
                        </span>
                      </li>
                    )) : (
                      <li className="text-sm text-white/50">Platform license fee</li>
                    )}
                  </ul>
                </div>
              </div>

              {/* other unpaid invoices */}
              {unpaid.length > 1 && payState !== 'paid' && (
                <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <p className="text-xs text-white/50 mb-3 flex items-center gap-2">
                    <FiList /> You have {unpaid.length} unpaid invoices. Pick one:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {unpaid.map((i) => (
                      <button
                        key={i.id}
                        disabled={busy}
                        onClick={() => { setSelectedId(i.id); resetPayment(); }}
                        className={`font-mono text-xs rounded-lg px-3 py-1.5 border transition-all disabled:opacity-40
                        ${i.id === invoice?.id
                          ? 'bg-emerald-400 text-emerald-950 border-emerald-400 font-bold'
                          : 'border-white/15 text-white/70 hover:border-emerald-400/60'}`}
                      >
                        {i.invoice_number} · {Number(i.total).toLocaleString()}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* ── RIGHT: pay panel ── */}
            <div className="lg:col-span-3 rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-5 sm:p-7 min-h-[26rem]">
              <AnimatePresence mode="wait">
                {/* PAID */}
                {payState === 'paid' && (
                  <motion.div key="paid" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8">
                    <motion.div
                      initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
                      className="mx-auto mb-5 grid place-items-center w-20 h-20 rounded-full bg-emerald-400 text-emerald-950 text-4xl shadow-[0_0_60px_rgba(52,211,153,.5)]"
                    >
                      <FiCheck />
                    </motion.div>
                    <h2 className="text-2xl font-extrabold mb-2">License renewed</h2>
                    <p className="text-white/60 text-sm mb-1">
                      We received {kes(payResult?.amount_paid ?? invoice?.total)}.
                    </p>
                    {payResult?.reference && (
                      <p className="text-white/40 text-xs mb-6">
                        M-Pesa ref <span className="font-mono text-emerald-300">{payResult.reference}</span>
                      </p>
                    )}
                    <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
                      <button onClick={goToDashboard} className="rounded-xl bg-emerald-400 hover:bg-emerald-300 text-emerald-950 font-bold px-7 py-3 transition-colors">
                        Continue to dashboard
                      </button>
                      {unpaid.filter((i) => i.id !== invoice?.id).length > 0 && (
                        <button onClick={() => { setSelectedId(null); resetPayment(); }} className="rounded-xl border border-white/15 hover:border-emerald-400/60 px-7 py-3 font-semibold transition-colors">
                          Pay next invoice
                        </button>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* WAITING / SENDING */}
                {(payState === 'sending' || payState === 'waiting') && (
                  <motion.div key="waiting" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid place-items-center text-center py-8">
                    <Ring seconds={payState === 'sending' ? 0 : elapsed} />
                    <h3 className="text-xl font-bold mt-6">
                      {payState === 'sending' ? 'Sending M-Pesa prompt…' : checkoutId ? 'Check your phone' : 'Looking for your payment…'}
                    </h3>
                    <p className="text-white/50 text-sm mt-2 max-w-xs">
                      {checkoutId
                        ? 'Enter your M-Pesa PIN to approve the payment. This page updates by itself.'
                        : 'This usually takes 1 to 3 minutes. This page updates by itself.'}
                    </p>
                    <p className="font-mono text-xs text-white/30 mt-4">
                      {Math.max(TIMEOUT_SECONDS - elapsed, 0)}s left
                    </p>
                  </motion.div>
                )}

                {/* PARTIAL */}
                {payState === 'partial' && (
                  <motion.div key="partial" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="py-6">
                    <div className="rounded-2xl border border-amber-300/30 bg-amber-300/10 p-5">
                      <FiAlertTriangle className="text-amber-300 text-2xl mb-2" />
                      <p className="font-semibold mb-1">Partial payment received</p>
                      <p className="text-sm text-white/70">
                        We got {kes(payResult?.amount_paid)} (ref {payResult?.reference}). Balance remaining:{' '}
                        <b className="text-amber-200">{kes(payResult?.balance)}</b>.
                      </p>
                    </div>
                    <button onClick={resetPayment} className="mt-5 w-full rounded-xl bg-white/10 hover:bg-white/15 py-3 font-semibold transition-colors">
                      Pay the balance
                    </button>
                  </motion.div>
                )}

                {/* IDLE / FAILED / TIMEOUT: choose a method */}
                {['idle', 'failed', 'timeout'].includes(payState) && (
                  <motion.div key="choose" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                    {payState === 'failed' && (
                      <div className="mb-5 flex gap-3 rounded-2xl border border-red-400/25 bg-red-400/10 p-4 text-sm">
                        <FiAlertTriangle className="text-red-300 text-lg shrink-0 mt-0.5" />
                        <span className="text-white/80">{payMessage || 'Payment failed. Please try again.'}</span>
                      </div>
                    )}
                    {payState === 'timeout' && (
                      <div className="mb-5 flex gap-3 rounded-2xl border border-amber-300/25 bg-amber-300/10 p-4 text-sm">
                        <FiAlertTriangle className="text-amber-300 text-lg shrink-0 mt-0.5" />
                        <span className="text-white/80">
                          No payment yet. If you already paid, it can take a few minutes to show. Otherwise, try again.
                        </span>
                      </div>
                    )}

                    <p className="text-[11px] uppercase tracking-[0.18em] text-emerald-200/60 mb-3">How would you like to pay?</p>

                    {/* method tiles */}
                    <div className="grid grid-cols-2 gap-3 mb-6">
                      {[
                        { id: 'stk', icon: FiZap, title: 'M-Pesa prompt', sub: 'Fastest. We ping your phone.' },
                        { id: 'paybill', icon: FiHash, title: 'Paybill', sub: 'Pay from M-Pesa menu.' },
                      ].map((m) => {
                        const on = method === m.id;
                        return (
                          <button
                            key={m.id}
                            onClick={() => setMethod(m.id)}
                            className={`relative text-left rounded-2xl border p-4 transition-all
                            ${on ? 'border-emerald-400 bg-emerald-400/10 shadow-[0_0_30px_rgba(52,211,153,.15)]'
                                 : 'border-white/10 bg-white/[0.03] hover:border-white/25'}`}
                          >
                            <m.icon className={`text-xl mb-2 ${on ? 'text-emerald-300' : 'text-white/50'}`} />
                            <span className="block font-bold text-sm">{m.title}</span>
                            <span className="block text-xs text-white/45 mt-0.5">{m.sub}</span>
                            {m.id === 'stk' && (
                              <span className="absolute top-3 right-3 text-[10px] font-bold uppercase tracking-wider bg-emerald-400 text-emerald-950 rounded-full px-2 py-0.5">
                                Easiest
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {method === 'stk' ? (
                      <div>
                        <label className="block text-sm text-white/60 mb-2">
                          M-Pesa number to charge <span className="text-white font-semibold">{kes(invoice?.total)}</span>
                        </label>
                        <div className="flex items-stretch rounded-2xl border border-white/15 focus-within:border-emerald-400 focus-within:ring-4 focus-within:ring-emerald-400/15 bg-black/30 transition-all overflow-hidden">
                          <span className="grid place-items-center px-4 text-sm font-mono text-emerald-300 bg-white/[0.04] border-r border-white/10">
                            🇰🇪 +254
                          </span>
                          <input
                            inputMode="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="712 345 678"
                            className="flex-1 bg-transparent px-4 py-4 text-lg font-mono tabular-nums outline-none placeholder:text-white/20"
                          />
                        </div>
                        <button
                          disabled={!phoneOk}
                          onClick={sendStk}
                          className="mt-5 w-full rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-300 text-emerald-950 font-extrabold py-4 text-base
                                     hover:shadow-[0_10px_40px_rgba(52,211,153,.4)] hover:-translate-y-0.5 active:translate-y-0
                                     disabled:opacity-30 disabled:hover:shadow-none disabled:hover:translate-y-0 disabled:cursor-not-allowed transition-all"
                        >
                          {payState === 'idle' ? `Send prompt to my phone` : 'Try again'}
                        </button>
                        <p className="text-center text-xs text-white/35 mt-3">
                          You'll get a pop-up on your phone. Just enter your M-Pesa PIN.
                        </p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-sm text-white/55 mb-4">
                          Open M-Pesa → <b className="text-white">Lipa na M-Pesa</b> → <b className="text-white">Paybill</b>, then enter:
                        </p>
                        <div className="space-y-3">
                          <CopyField label="1 · Business number" value={PLATFORM_PAYBILL} big
                            copied={copied === 'bn'} onCopy={() => copy('bn', PLATFORM_PAYBILL)} />
                          <CopyField label="2 · Account number" value={invoice?.invoice_number} big
                            copied={copied === 'ac'} onCopy={() => copy('ac', invoice?.invoice_number)} />
                          <CopyField label="3 · Amount" value={Number(invoice?.total || 0)}
                            copied={copied === 'am'} onCopy={() => copy('am', Number(invoice?.total || 0))} />
                        </div>
                        <p className="text-xs text-amber-200/80 mt-4">
                          The account number must be exactly <span className="font-mono">{invoice?.invoice_number}</span> so we can match your payment.
                        </p>
                        <button
                          onClick={startWatching}
                          className="mt-5 w-full rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-300 text-emerald-950 font-extrabold py-4
                                     hover:shadow-[0_10px_40px_rgba(52,211,153,.4)] hover:-translate-y-0.5 active:translate-y-0 transition-all"
                        >
                          I've paid, check now
                        </button>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}

        <div className="text-center mt-8">
          <button
            onClick={() => navigate('/admin/invoice')}
            className="text-sm text-white/40 hover:text-emerald-300 transition-colors underline-offset-4 hover:underline"
          >
            View all invoices
          </button>
        </div>
      </div>
    </div>
  );
};

export default RenewLicense;