import React, { useState, useEffect, useCallback } from 'react';
import { Paper, Chip, Button, TextField, CircularProgress } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import MaterialTable from 'material-table';
import toast, { Toaster } from 'react-hot-toast';

const statusColors = {
  pending: { bg: 'bg-slate-100 dark:bg-slate-800', text: 'text-slate-600 dark:text-slate-300' },
  trial: { bg: 'bg-sky-50 dark:bg-sky-500/10', text: 'text-sky-600 dark:text-sky-400' },
  subscribed: { bg: 'bg-amber-50 dark:bg-amber-500/10', text: 'text-amber-600 dark:text-amber-400' },
  rewarded: { bg: 'bg-emerald-50 dark:bg-emerald-500/10', text: 'text-emerald-600 dark:text-emerald-400' },
  rejected: { bg: 'bg-red-50 dark:bg-red-500/10', text: 'text-red-600 dark:text-red-400' },
};

const StatusChip = ({ status }) => {
  const c = statusColors[status] || statusColors.pending;
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${c.bg} ${c.text}`}>
      {status}
    </span>
  );
};

const ReferralDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [amount, setAmount] = useState('');
  const [phone, setPhone] = useState('');
  const [withdrawing, setWithdrawing] = useState(false);
  const subdomain = window.location.hostname.split('.')[0];

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [codeRes, referralsRes, earningsRes] = await Promise.all([
        fetch('/api/referrals/my_code', { headers: { 'X-Subdomain': subdomain } }),
        fetch('/api/referrals/my_referrals', { headers: { 'X-Subdomain': subdomain } }),
        fetch('/api/referrals/my_earnings', { headers: { 'X-Subdomain': subdomain } }),
      ]);
      const [code, referrals, earnings] = await Promise.all([
        codeRes.json(), referralsRes.json(), earningsRes.json(),
      ]);
      if (codeRes.ok && referralsRes.ok && earningsRes.ok) {
        setData({ ...code, referrals, ...earnings });
      } else {
        toast.error('Failed to load referral data');
      }
    } catch {
      toast.error('Something went wrong loading referrals');
    } finally {
      setLoading(false);
    }
  }, [subdomain]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const copyLink = () => {
    navigator.clipboard.writeText(data.signup_url);
    toast.success('Referral link copied');
  };

  const handleWithdraw = async () => {
    if (!amount || !phone) return toast.error('Enter an amount and phone number');
    if (parseFloat(amount) > data.available_balance) return toast.error('Amount exceeds your available balance');

    setWithdrawing(true);
    try {
      const res = await fetch('/api/referrals/withdraw', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Subdomain': subdomain,
          'X-Idempotency-Key': crypto.randomUUID(),
        },
        body: JSON.stringify({ phone_number: phone }),
      });
      const json = await res.json();
      if (res.ok) {
        toast.success(`Withdrawal of KSh ${json.withdrawn} initiated`);
        setAmount(''); setPhone('');
        fetchAll();
      } else {
        toast.error(json.error || 'Withdrawal failed');
      }
    } catch {
      toast.error('Withdrawal failed, try again');
    } finally {
      setWithdrawing(false);
    }
  };

  if (loading) return <div className="flex justify-center p-10"><CircularProgress size={28} /></div>;
  if (!data) return null;

  return (
    <>
      <Toaster />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
          <p className="text-xs uppercase tracking-wide text-slate-400 dark:text-slate-500">Available balance</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">
            KSh {Number(data.available_balance).toLocaleString()}
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
          <p className="text-xs uppercase tracking-wide text-slate-400 dark:text-slate-500">Clearing</p>
          <p className="text-2xl font-bold text-amber-500 mt-1">
            KSh {Number(data.pending_balance).toLocaleString()}
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
          <p className="text-xs uppercase tracking-wide text-slate-400 dark:text-slate-500">Lifetime earned</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">
            KSh {Number(data.lifetime_earned).toLocaleString()}
          </p>
        </div>
      </div>

      <Paper elevation={3} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">Your referral link</p>
        <div className="flex items-center gap-2">
          <input
            readOnly
            value={data.signup_url}
            className="flex-1 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600
              rounded-lg p-2.5 text-sm font-mono text-slate-700 dark:text-slate-200"
          />
          <Button variant="outlined" startIcon={<ContentCopyIcon />} onClick={copyLink}>Copy link</Button>
        </div>
        <p className="text-xs text-slate-400 mt-2">
          Referral code: <span className="font-mono">{data.referral_code}</span>
        </p>
      </Paper>

      <Paper elevation={3} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
        <p className="text-sm font-semibold mb-3 text-slate-900 dark:text-slate-100">Withdraw earnings</p>
        <p className="text-xs text-slate-400 mb-3">
          Withdrawals pay out your full available balance to the number below.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <TextField
            label="M-Pesa phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            size="small"
            fullWidth
          />
          <Button
            variant="contained"
            color="success"
            disabled={withdrawing || data.available_balance <= 0}
            onClick={handleWithdraw}
            sx={{ whiteSpace: 'nowrap' }}
          >
            {withdrawing ? 'Processing…' : `Withdraw KSh ${Number(data.available_balance).toLocaleString()}`}
          </Button>
        </div>
      </Paper>

      <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
        <MaterialTable
          title="Your referrals"
          columns={[
            { title: 'ISP', field: 'company_name' },
            {
              title: 'Referred on', field: 'signed_up_at',
              render: (r) => new Date(r.signed_up_at).toLocaleDateString(),
            },
            {
              title: 'Status', field: 'reward_status',
              render: (r) => <StatusChip status={r.reward_status} />,
            },
            {
              title: 'Reward', field: 'reward_amount',
              render: (r) => (r.reward_amount ? `KSh ${r.reward_amount}` : '—'),
            },
          ]}
          data={data.referrals}
          localization={{
            body: { emptyDataSourceMessage: 'No referrals yet. Share your link to start earning.' },
          }}
          options={{ search: true, pageSize: 10, exportButton: false }}
        />
      </Paper>
    </>
  );
};

export default ReferralDashboard;