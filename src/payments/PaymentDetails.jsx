import React, { useEffect, useState } from 'react';
import { Dialog, IconButton, Tooltip } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import PaymentIcon from '@mui/icons-material/Payment';
import PersonIcon from '@mui/icons-material/Person';
import PhoneIcon from '@mui/icons-material/Phone';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import TagIcon from '@mui/icons-material/Tag';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';

const FONT_FAMILY = "'IBM Plex Mono', ui-monospace, SFMono-Regular, Menlo, monospace";
const FONT_LINK_ID = 'ibm-plex-mono-font';

const STATUS_CONFIG = {
  completed: { label: 'Completed', Icon: CheckCircleIcon },
  pending: { label: 'Pending', Icon: HourglassEmptyIcon },
  cancelled: { label: 'Cancelled', Icon: CancelIcon },
};

const formatCurrency = (amount) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'KES',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Number(amount) || 0);

// M-Pesa sends time_paid as "20261023093057" (yyyymmddHHMMSS)
const formatTimePaid = (raw) => {
  if (!raw) return 'N/A';
  const s = String(raw);
  if (!/^\d{14}$/.test(s)) return s;
  const d = new Date(
    Number(s.slice(0, 4)),
    Number(s.slice(4, 6)) - 1,
    Number(s.slice(6, 8)),
    Number(s.slice(8, 10)),
    Number(s.slice(10, 12)),
    Number(s.slice(12, 14))
  );
  return d.toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
};

const CopyButton = ({ value }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!value) return;
    try {
      await navigator.clipboard.writeText(String(value));
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable, ignore */
    }
  };

  return (
    <Tooltip title={copied ? 'Copied' : 'Copy'} arrow>
      <IconButton
        onClick={handleCopy}
        size="small"
        className="!text-emerald-600 dark:!text-emerald-400 hover:!bg-emerald-50 dark:hover:!bg-emerald-900/30"
      >
        {copied ? <CheckIcon fontSize="small" /> : <ContentCopyIcon fontSize="small" />}
      </IconButton>
    </Tooltip>
  );
};

const DetailCell = ({ icon: Icon, label, children, className = '' }) => (
  <div
    className={`rounded-xl border border-gray-200 dark:border-gray-700/70 bg-gray-50
      dark:bg-gray-800/60 p-3 min-w-0 ${className}`}
  >
    <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-gray-400 dark:text-gray-500">
      <Icon sx={{ fontSize: 14 }} className="text-emerald-600 dark:text-emerald-400" />
      {label}
    </div>
    <div className="mt-1.5 text-sm text-gray-800 dark:text-gray-100 break-words">{children}</div>
  </div>
);

const PaymentDetails = ({ open, setOpen, payment }) => {
  // Load IBM Plex Mono once, no need to touch index.html
  useEffect(() => {
    if (document.getElementById(FONT_LINK_ID)) return;
    const link = document.createElement('link');
    link.id = FONT_LINK_ID;
    link.rel = 'stylesheet';
    link.href =
      'https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600;700&display=swap';
    document.head.appendChild(link);
  }, []);

  if (!payment) return null;

  const statusKey = (payment.status || '').toLowerCase();
  const status = STATUS_CONFIG[statusKey] || STATUS_CONFIG.pending;
  const StatusIcon = status.Icon;
  const close = () => setOpen(false);

  return (
    <Dialog
      open={open}
      onClose={close}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        className: 'rounded-2xl overflow-hidden bg-white dark:bg-gray-900 shadow-2xl',
        sx: { fontFamily: FONT_FAMILY, borderRadius: '20px' },
      }}
    >
      <div style={{ fontFamily: FONT_FAMILY }}>
        {/* Header */}
        <div className="relative bg-gradient-to-br from-emerald-700 via-emerald-600 to-green-500 text-white px-6 pt-5 pb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-emerald-100">
              <ReceiptLongIcon sx={{ fontSize: 16 }} />
              Payment receipt
            </div>
            <IconButton onClick={close} size="small" className="!text-white/80 hover:!bg-white/15">
              <CloseIcon fontSize="small" />
            </IconButton>
          </div>

          <p className="mt-5 text-[11px] uppercase tracking-widest text-emerald-100">Amount paid</p>
          <p className="mt-1 text-4xl font-bold tabular-nums leading-none">
            {formatCurrency(payment.amount)}
          </p>

          <span className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-white/15 backdrop-blur px-3 py-1 text-xs font-semibold">
            <StatusIcon sx={{ fontSize: 15 }} />
            {status.label}
          </span>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-3">
          {/* Voucher */}
          <div className="rounded-xl border border-dashed border-emerald-300 dark:border-emerald-700/70 bg-emerald-50/70 dark:bg-emerald-900/10 px-4 py-3 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[10px] uppercase tracking-widest text-emerald-700 dark:text-emerald-400">
                Voucher
              </p>
              <p className="mt-1 text-xl font-semibold tracking-wider text-gray-900 dark:text-white truncate">
                {payment.voucher || 'N/A'}
              </p>
            </div>
            <CopyButton value={payment.voucher} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <DetailCell icon={PersonIcon} label="Customer">
              {payment.name || 'Anonymous'}
            </DetailCell>
            <DetailCell icon={PhoneIcon} label="Phone">
              {payment.phone_number || 'N/A'}
            </DetailCell>
            <DetailCell icon={PaymentIcon} label="Method">
              {payment.payment_method || 'N/A'}
            </DetailCell>
            <DetailCell icon={AccountBalanceWalletIcon} label="Disbursed">
              {payment.paid_out ? (
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Yes</span>
              ) : (
                <span className="text-gray-500 dark:text-gray-400">Not yet</span>
              )}
            </DetailCell>
          </div>

          <DetailCell icon={AccessTimeIcon} label="Paid at">
            {formatTimePaid(payment.time_paid)}
          </DetailCell>

          <DetailCell icon={TagIcon} label="Reference">
            <div className="flex items-center justify-between gap-2">
              <span className="break-all">{payment.reference || 'N/A'}</span>
              {payment.reference && <CopyButton value={payment.reference} />}
            </div>
          </DetailCell>
        </div>

        {/* Footer */}
        <div className="px-6 pb-5">
          <button
            onClick={close}
            className="w-full rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99]
              text-white text-sm font-semibold py-2.5 transition-all"
            style={{ fontFamily: FONT_FAMILY }}
          >
            Close
          </button>
        </div>
      </div>
    </Dialog>
  );
};

export default PaymentDetails;