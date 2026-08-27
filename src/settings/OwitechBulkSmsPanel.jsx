import { useState, useEffect, useCallback } from 'react';
import { TextField, Grid } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import HistoryIcon from '@mui/icons-material/History';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const MIN_PURCHASE = 10;

const OwitechBulkSmsPanel = ({ subdomain }) => {
  const [balance, setBalance] = useState(null);
  const [sellPrice, setSellPrice] = useState(null);
  const [quantity, setQuantity] = useState(20);
  const [phone, setPhone] = useState('');
  const [purchasing, setPurchasing] = useState(false);
  const [checkoutId, setCheckoutId] = useState(null);
  const [confirming, setConfirming] = useState(false);

  const fetchBalance = useCallback(async () => {
    try {
      const res = await fetch('/api/tenant_sms_wallet/balance', {
        headers: { 'X-Subdomain': subdomain },
      });
      const data = await res.json();
      if (res.ok) {
        setBalance(data.balance);
        setSellPrice(data.sell_price_per_sms);
      }
    } catch {
      toast.error('Failed to load SMS balance', { duration: 2500, position: 'top-center' });
    }
  }, [subdomain]);

  useEffect(() => { fetchBalance(); }, [fetchBalance]);

  // Poll for confirmation after STK push is triggered — mirrors the
  // pattern your hotspot payment flow already uses (payment_reference_status).
  useEffect(() => {
    if (!checkoutId) return;
    setConfirming(true);
    const interval = setInterval(async () => {
      try {
        const res = await fetch(
          `/api/tenant_sms_wallet/confirm?checkout_request_id=${checkoutId}`,
          { method: 'POST', headers: { 'X-Subdomain': subdomain } }
        );
        const data = await res.json();
        if (res.ok) {
          clearInterval(interval);
          setConfirming(false);
          setCheckoutId(null);
          setBalance(data.balance);
          toast.success('SMS credits added!', { duration: 3000, position: 'top-center' });
        }
      } catch { /* keep polling until it resolves or times out */ }
    }, 3000);
    const timeout = setTimeout(() => { clearInterval(interval); setConfirming(false); }, 90000);
    return () => { clearInterval(interval); clearTimeout(timeout); };
  }, [checkoutId, subdomain]);

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
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '14px 20px', border: '1px solid var(--divider)', borderRadius: '12px',
      }}>
        <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>SMS credits</span>
        <span style={{ fontSize: '1.25rem', fontWeight: 600 }}>{balance ?? '…'}</span>
      </div>

      <div style={{ border: '1px solid var(--divider)', borderRadius: '12px', padding: 24 }}>
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
                inputProps={{ min: MIN_PURCHASE }}
                onChange={(e) => setQuantity(Number(e.target.value))}
                helperText={`Minimum ${MIN_PURCHASE} credits`}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth label="M-Pesa phone number" value={phone}
                className='myTextField'
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
      </div>
    </div>
  );
};

export default OwitechBulkSmsPanel;