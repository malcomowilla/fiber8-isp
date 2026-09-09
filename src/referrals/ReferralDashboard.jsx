import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import BoltIcon from '@mui/icons-material/Bolt';
import HourglassTopRoundedIcon from '@mui/icons-material/HourglassTopRounded';
import SavingsRoundedIcon from '@mui/icons-material/SavingsRounded';
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded';
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import PhoneIphoneRoundedIcon from '@mui/icons-material/PhoneIphoneRounded';
import ArrowOutwardRoundedIcon from '@mui/icons-material/ArrowOutwardRounded';
import toast, { Toaster } from 'react-hot-toast';

const STATUS_STYLES = {
  awaiting_subscription: { label: 'Awaiting subscription', dot: 'bg-slate-400', text: 'text-slate-500 dark:text-slate-400' },
  pending: { label: 'Clearing', dot: 'bg-amber-400', text: 'text-amber-600 dark:text-amber-400' },
  available: { label: 'Available', dot: 'bg-emerald-500', text: 'text-emerald-600 dark:text-emerald-400' },
  processing: { label: 'Processing', dot: 'bg-sky-400', text: 'text-sky-600 dark:text-sky-400' },
  paid_out: { label: 'Paid out', dot: 'bg-emerald-500', text: 'text-emerald-600 dark:text-emerald-400' },
  void: { label: 'Voided', dot: 'bg-red-400', text: 'text-red-500 dark:text-red-400' },
};

const StatusDot = ({ status }) => {
  const cfg = STATUS_STYLES[status] || STATUS_STYLES.awaiting_subscription;
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${cfg.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
};

const initials = (name = '') =>
  name
    .split(/[\s._-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join('') || '?';

const AVATAR_TINTS = [
  'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400',
  'bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-400',
  'bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-400',
  'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400',
  'bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-400',
];
const tintFor = (str = '') => AVATAR_TINTS[[...str].reduce((a, c) => a + c.charCodeAt(0), 0) % AVATAR_TINTS.length];

const StatTile = ({ icon, label, value, accent }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="relative overflow-hidden rounded-2xl bg-white dark:bg-slate-900 border border-slate-200
      dark:border-slate-800 p-5"
  >
    <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-[0.07] ${accent.blob}`} />
    <div className="flex items-center justify-between">
      <span className={`flex items-center justify-center w-10 h-10 rounded-xl ${accent.chip}`}>
        {icon}
      </span>
    </div>
    <p className="text-xs uppercase tracking-wider text-slate-400 dark:text-slate-500 mt-4">{label}</p>
    <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1 tabular-nums">{value}</p>
  </motion.div>
);

const ReferralDashboard = () => {
  const subdomain = window.location.hostname.split('.')[0];
  const headers = { 'X-Subdomain': subdomain };

  const [loading, setLoading] = useState(true);
  const [code, setCode] = useState({ referral_code: '', signup_url: '' });
  const [earnings, setEarnings] = useState({ available_balance: 0, pending_balance: 0, lifetime_earned: 0, history: [] });
  const [referrals, setReferrals] = useState([]);
  const [terms, setTerms] = useState([]);
  const [showTerms, setShowTerms] = useState(false);
  const [copied, setCopied] = useState(false);

  const [phone, setPhone] = useState('');
  const [withdrawing, setWithdrawing] = useState(false);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [codeRes, earningsRes, referralsRes, termsRes] = await Promise.all([
        fetch('/api/referrals/my_code', { headers }),
        fetch('/api/referrals/my_earnings', { headers }),
        fetch('/api/referrals/my_referrals', { headers }),
        fetch('/api/referrals/terms', { headers }),
      ]);
      if (codeRes.ok) setCode(await codeRes.json());
      if (earningsRes.ok) setEarnings(await earningsRes.json());
      if (referralsRes.ok) setReferrals(await referralsRes.json());
      if (termsRes.ok) setTerms((await termsRes.json()).terms || []);
    } catch (error) {
      toast.error('Failed to load referral data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const handleCopy = () => {
    navigator.clipboard.writeText(code.signup_url);
    setCopied(true);
    toast.success('Referral link copied');
    setTimeout(() => setCopied(false), 1800);
  };

  const handleWithdraw = async (e) => {
    e.preventDefault();
    if (!phone.trim()) {
      toast.error('Enter your M-Pesa phone number');
      return;
    }
    setWithdrawing(true);
    try {
      const idempotency_key = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
      const response = await fetch('/api/referrals/withdraw', {
        method: 'POST',
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone_number: phone, idempotency_key }),
      });
      const data = await response.json();
      if (response.ok) {
        toast.success(`Withdrawal of KSh ${data.withdrawn} initiated`);
        setPhone('');
        fetchAll();
      } else {
        toast.error(data.error || 'Withdrawal failed');
      }
    } catch (error) {
      toast.error('Something went wrong, please try again');
    } finally {
      setWithdrawing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="font-sans space-y-6">
      <Toaster />

      {/* Hero */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 p-6 sm:p-8">
        <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -left-10 -bottom-16 w-52 h-52 rounded-full bg-white/10 blur-2xl" />

        <div className="relative flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <p className="text-emerald-50/80 text-xs font-semibold uppercase tracking-widest">Refer & Earn</p>
            <h1 className="text-white text-2xl sm:text-3xl font-bold mt-1">
              KSh 300 per ISP that subscribes
            </h1>
            <p className="text-emerald-50/90 text-sm mt-2 max-w-md">
              Share your code with other ISP owners. Once they sign up and pay, you get paid.
            </p>
          </div>

          <div className="w-full md:w-auto md:min-w-[320px]">
            <div className="bg-white/15 backdrop-blur-md rounded-2xl p-4 border border-white/20">
              <p className="text-emerald-50/70 text-[11px] uppercase tracking-wider mb-1.5">Your code</p>
              <p className="text-white font-mono text-lg font-semibold tracking-wide mb-3">
                {code.referral_code}
              </p>
              <button
                type="button"
                onClick={handleCopy}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-white text-emerald-700
                  text-sm font-semibold py-2.5 hover:bg-emerald-50 transition-colors"
              >
                <AnimatePresence mode="wait" initial={false}>
                  {copied ? (
                    <motion.span
                      key="copied"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="flex items-center gap-2"
                    >
                      <CheckIcon fontSize="small" /> Copied
                    </motion.span>
                  ) : (
                    <motion.span
                      key="copy"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="flex items-center gap-2"
                    >
                      <ContentCopyIcon fontSize="small" /> Copy referral link
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatTile
          icon={<BoltIcon fontSize="small" className="!text-emerald-600 dark:!text-emerald-400" />}
          accent={{ chip: 'bg-emerald-50 dark:bg-emerald-500/10', blob: 'bg-emerald-500' }}
          label="Available balance"
          value={`KSh ${Number(earnings.available_balance).toLocaleString()}`}
        />
        <StatTile
          icon={<HourglassTopRoundedIcon fontSize="small" className="!text-amber-600 dark:!text-amber-400" />}
          accent={{ chip: 'bg-amber-50 dark:bg-amber-500/10', blob: 'bg-amber-500' }}
          label="Clearing"
          value={`KSh ${Number(earnings.pending_balance).toLocaleString()}`}
        />
        <StatTile
          icon={<SavingsRoundedIcon fontSize="small" className="!text-violet-600 dark:!text-violet-400" />}
          accent={{ chip: 'bg-violet-50 dark:bg-violet-500/10', blob: 'bg-violet-500' }}
          label="Lifetime earned"
          value={`KSh ${Number(earnings.lifetime_earned).toLocaleString()}`}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Referrals list */}
        <div className="lg:col-span-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5">
          <div className="flex items-center gap-2 mb-4">
            <GroupsRoundedIcon fontSize="small" className="!text-slate-400" />
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Your referrals</p>
            <span className="ml-auto text-xs text-slate-400">{referrals.length} total</span>
          </div>

          {referrals.length === 0 ? (
            <div className="py-14 text-center">
              <p className="text-sm text-slate-400 dark:text-slate-500">
                No referrals yet — share your link to start earning.
              </p>
            </div>
          ) : (
            <div className="space-y-1.5">
              {referrals.map((r) => (
                <div
                  key={r.id}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
                >
                  <span className={`flex items-center justify-center w-9 h-9 rounded-full text-xs font-bold shrink-0 ${tintFor(r.company_name)}`}>
                    {initials(r.company_name)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">
                      {r.company_name}
                    </p>
                    <p className="text-xs text-slate-400 dark:text-slate-500">
                      {new Date(r.signed_up_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <StatusDot status={r.reward_status} />
                    {r.reward_amount && (
                      <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mt-0.5">
                        KSh {r.reward_amount}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Withdraw + terms */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5">
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-1">Withdraw</p>
            <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">
              Sends your entire available balance in one go.
            </p>
            <form onSubmit={handleWithdraw} className="space-y-3">
              <div className="relative">
                <PhoneIphoneRoundedIcon
                  fontSize="small"
                  className="!absolute left-3 top-1/2 -translate-y-1/2 !text-slate-400"
                />
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0712 345 678"
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border
                    border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white
                    focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500"
                />
              </div>
              <button
                type="submit"
                disabled={withdrawing || Number(earnings.available_balance) <= 0}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-slate-900 dark:bg-emerald-500
                  hover:bg-slate-800 dark:hover:bg-emerald-600 disabled:opacity-40 disabled:cursor-not-allowed
                  text-white text-sm font-semibold py-2.5 transition-colors"
              >
                {withdrawing ? (
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                ) : (
                  <ArrowOutwardRoundedIcon fontSize="small" />
                )}
                Withdraw KSh {Number(earnings.available_balance).toLocaleString()}
              </button>
            </form>
          </div>

          <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5">
            <button
              type="button"
              onClick={() => setShowTerms((v) => !v)}
              className="w-full flex items-center justify-between"
            >
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">How it works</p>
              <motion.span animate={{ rotate: showTerms ? 180 : 0 }} transition={{ duration: 0.2 }}>
                <ExpandMoreRoundedIcon fontSize="small" className="!text-slate-400" />
              </motion.span>
            </button>
            <AnimatePresence initial={false}>
              {showTerms && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <ul className="mt-3 space-y-2.5">
                    {terms.map((t, idx) => (
                      <li key={idx} className="flex gap-2.5 text-xs text-slate-500 dark:text-slate-400">
                        <span className="w-1 h-1 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                        {t}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReferralDashboard;