import { useState, useEffect, useCallback, useRef } from 'react';
import { TextField, Grid } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ForwardToInboxIcon from '@mui/icons-material/ForwardToInbox';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const MIN_PURCHASE = 10;

const StatCard = ({ icon: Icon, label, value, highlight = false }) => (
  <motion.div
    animate={highlight ? { scale: [1, 1.04, 1] } : {}}
    transition={{ duration: 0.5 }}
    style={{
      flex: '1 1 140px',
      border: '1px solid var(--divider)',
      borderRadius: '12px',
      padding: '16px',
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
      background: highlight ? 'rgba(16,185,129,0.06)' : 'transparent',
      borderColor: highlight ? 'rgba(16,185,129,0.35)' : 'var(--divider)',
      transition: 'background 0.4s ease, border-color 0.4s ease',
    }}
  >
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-secondary)' }}>
      <Icon style={{ width: 15, height: 15 }} />
      <span style={{ fontSize: '0.75rem' }}>{label}</span>
    </div>
    <span style={{ fontSize: '1.5rem', fontWeight: 700, lineHeight: 1 }}>
      {value === null || value === undefined ? '…' : value}
    </span>
  </motion.div>
);

const OwitechBulkSmsPanel = ({ subdomain }) => {
  const [stats, setStats] = useState({
    balance: null, sent_this_month: null, total_sent: null, total_purchased: null,
  });
  const [sellPrice, setSellPrice] = useState(null);
  const [quantity, setQuantity] = useState(20);
  const [phone, setPhone] = useState('');
  const [purchasing, setPurchasing] = useState(false);
  const [checkoutId, setCheckoutId] = useState(null);
  const [confirming, setConfirming] = useState(false);
  const [justCredited, setJustCredited] = useState(null); // { quantity } — drives the success overlay
  const [balanceFlash, setBalanceFlash] = useState(false);
  const pollFailedRef = useRef(false);

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch('/api/tenant_sms_wallet/stats', {
        headers: { 'X-Subdomain': subdomain },
      });
      const data = await res.json();
      if (res.ok) {
        setStats(data);
        setSellPrice((prev) => prev); // sell price comes from /balance below
      }
    } catch {
      toast.error('Failed to load SMS stats', { duration: 2500, position: 'top-center' });
    }
  }, [subdomain]);

  const fetchSellPrice = useCallback(async () => {
    try {
      const res = await fetch('/api/tenant_sms_wallet/balance', {
        headers: { 'X-Subdomain': subdomain },
      });
      const data = await res.json();
      if (res.ok) setSellPrice(data.sell_price_per_sms);
    } catch {
      /* non-critical — purchase form just won't show a live total */
    }
  }, [subdomain]);

  useEffect(() => {
    fetchStats();
    fetchSellPrice();
  }, [fetchStats, fetchSellPrice]);

  // Poll for confirmation after STK push is triggered. Only treats the
  // payment as done when the backend actually says status === 'completed'
  // — previously any 200 response (including "still pending") was read
  // as success, which showed "SMS credits added!" before the money had
  // even landed.
  useEffect(() => {
    if (!checkoutId) return;
    setConfirming(true);
    pollFailedRef.current = false;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(
          `/api/tenant_sms_wallet/confirm?checkout_request_id=${checkoutId}`,
          { method: 'POST', headers: { 'X-Subdomain': subdomain } }
        );
        const data = await res.json();
        if (!res.ok) return; 

        if (data.status === 'completed') {
          clearInterval(interval);
          setConfirming(false);
          setCheckoutId(null);
          setJustCredited({ quantity: data.quantity });
          setBalanceFlash(true);
          setTimeout(() => setBalanceFlash(false), 900);
          setTimeout(() => setJustCredited(null), 3200);
          fetchStats();
          toast.success(`${data.quantity} SMS credits added!`, { duration: 3000, position: 'top-center' });
        } else if (data.status === 'underpaid' || data.status === 'failed') {
          clearInterval(interval);
          setConfirming(false);
          setCheckoutId(null);
          toast.error(
            data.status === 'underpaid'
              ? 'Payment amount did not match — contact support if you were charged'
              : 'Payment failed. Please try again.',
            { duration: 4000, position: 'top-center' }
          );
        }
        // status === 'pending' → keep polling
      } catch {
        /* transient network hiccup — keep polling until timeout */
      }
    }, 3000);

    const timeout = setTimeout(() => {
      clearInterval(interval);
      setConfirming(false);
      pollFailedRef.current = true;
      toast('Still waiting on confirmation — if you paid, your credits will appear shortly.', {
        duration: 5000, position: 'top-center', icon: '⏳',
      });
    }, 90000);

    return () => { clearInterval(interval); clearTimeout(timeout); };
  }, [checkoutId, subdomain, fetchStats]);

  const totalCost = sellPrice ? (quantity * sellPrice).toFixed(2) : '—';

  const handlePurchase = async (e) => {
    e.preventDefault();
    if (quantity < MIN_PURCHASE) {
      toast.error(`Minimum purchase is ${MIN_PURCHASE} credits`, { duration: 2500, position: 'top-center' });
      return;
    }
    if (!phone) {
      toast.error('Enter a phone number to pay with', { duration: 2500, position: 'top-center' });
      return;
    }
    setPurchasing(true);
    try {
      const res = await fetch('/api/tenant_sms_wallet/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Subdomain': subdomain },
        body: JSON.stringify({ quantity, phone_number: phone }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success('Check your phone to complete payment', { duration: 3000, position: 'top-center' });
        setCheckoutId(data.checkout_request_id);
      } else {
        toast.error(data.error || 'Purchase failed', { duration: 3000, position: 'top-center' });
      }
    } catch {
      toast.error('Purchase failed', { duration: 3000, position: 'top-center' });
    } finally {
      setPurchasing(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {/* ── Stats strip ─────────────────────────────────────────────── */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <StatCard icon={AccountBalanceWalletIcon} label="SMS balance" value={stats.balance} highlight={balanceFlash} />
        <StatCard icon={ForwardToInboxIcon} label="Sent this month" value={stats.sent_this_month} />
        <StatCard icon={TrendingUpIcon} label="Total sent" value={stats.total_sent} />
        <StatCard icon={ShoppingCartIcon} label="Total purchased" value={stats.total_purchased} />
      </div>

      {/* ── Purchase card ───────────────────────────────────────────── */}
      <div style={{ border: '1px solid var(--divider)', borderRadius: '12px', padding: 24, position: 'relative', overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <ShoppingCartIcon style={{ width: 18, height: 18 }} />
          <span style={{ fontWeight: 500, fontSize: '0.9375rem' }}>Buy SMS credits</span>
        </div>

        <form onSubmit={handlePurchase}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth type="number" label="Quantity" value={quantity}
                className='myTextField'
                disabled={purchasing || confirming}
                inputProps={{ min: MIN_PURCHASE }}
                onChange={(e) => setQuantity(Number(e.target.value))}
                helperText={`Minimum ${MIN_PURCHASE} credits`}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth label="M-Pesa phone number" value={phone}
                className='myTextField'
                disabled={purchasing || confirming}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="07XXXXXXXX"
              />
            </Grid>
          </Grid>

          <div style={{
            marginTop: 16, padding: '12px 16px', borderRadius: '8px',
            background: 'rgba(37,99,235,0.06)', fontSize: '0.8125rem',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Cost per SMS</span><span>KES {sellPrice ?? '—'}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600, marginTop: 4 }}>
              <span>Total</span><span>KES {totalCost}</span>
            </div>
          </div>

          {confirming && (
            <div style={{
              marginTop: 12, display: 'flex', alignItems: 'center', gap: 8,
              fontSize: '0.8125rem', color: 'var(--text-secondary)',
            }}>
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                style={{ display: 'inline-block', width: 12, height: 12, borderRadius: '50%', border: '2px solid #2563eb', borderTopColor: 'transparent' }}
              />
              Waiting for you to complete the M-Pesa prompt on your phone…
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16 }}>
            <motion.button
              type="submit" disabled={purchasing || confirming}
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 7,
                padding: '9px 22px', fontSize: '0.875rem', fontWeight: 500,
                color: '#fff', background: (purchasing || confirming) ? '#6b7280' : '#1a1a1a',
                border: 'none', borderRadius: '8px',
                cursor: (purchasing || confirming) ? 'not-allowed' : 'pointer',
              }}
            >
              <SendIcon style={{ width: 14, height: 14 }} />
              {confirming ? 'Waiting for payment…' : purchasing ? 'Processing…' : 'Proceed to pay'}
            </motion.button>
          </div>
        </form>

        {/* Success overlay — brief, non-blocking, disappears on its own */}
        <AnimatePresence>
          {justCredited && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              style={{
                position: 'absolute', top: 16, right: 16,
                display: 'flex', alignItems: 'center', gap: 8,
                background: 'rgba(16,185,129,0.12)', color: '#059669',
                border: '1px solid rgba(16,185,129,0.3)',
                borderRadius: '999px', padding: '6px 14px',
                fontSize: '0.8125rem', fontWeight: 600,
              }}
            >
              <CheckCircleIcon style={{ width: 16, height: 16 }} />
              +{justCredited.quantity} credits added
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default OwitechBulkSmsPanel;