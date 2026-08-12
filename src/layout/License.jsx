import { motion } from "framer-motion";
import { ShieldCheck, ShieldAlert, MessageSquareText } from "lucide-react";

const License = ({ expiry2, condition2, status2, calculateTimeRemaining, smsBalance }) => {
  const isExpired = status2 === 'expired';
  const hasLicense = expiry2 && expiry2 !== 'No license';

  const remainingPct = (() => {
    if (!hasLicense) return 0;
    const exp = new Date(expiry2);
    const now = new Date();
    const diff = exp - now;
    const oneYear = 365 * 24 * 60 * 60 * 1000;
    if (diff <= 0) return 0;
    if (diff > oneYear) return 100;
    return Math.round((diff / oneYear) * 100);
  })();

  return (
    <div id="system-license" className="w-full font-sans">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900"
      >
        {/* status accent line */}
        <div className={`absolute inset-x-0 top-0 h-1 ${isExpired ? 'bg-rose-500' : 'bg-emerald-500'}`} />

        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                isExpired
                  ? 'bg-rose-50 text-rose-500 dark:bg-rose-500/10 dark:text-rose-400'
                  : 'bg-emerald-50 text-emerald-500 dark:bg-emerald-500/10 dark:text-emerald-400'
              }`}
            >
              {isExpired ? <ShieldAlert className="h-4 w-4" /> : <ShieldCheck className="h-4 w-4" />}
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                Hotspot &amp; PPPoE license
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500">System license</p>
            </div>
          </div>

          <span
            className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
              isExpired
                ? 'bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400'
                : 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400'
            }`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${isExpired ? 'bg-rose-500' : 'bg-emerald-500 animate-pulse'}`} />
            {hasLicense ? (isExpired ? 'Expired' : 'Active') : 'No license'}
          </span>
        </div>

        <div className="mt-4">
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="text-xl font-semibold tabular-nums text-gray-900 dark:text-gray-50">
                {hasLicense ? calculateTimeRemaining(expiry2) : 'N/A'}
              </p>
              <p className="mt-0.5 text-xs text-gray-400 dark:text-gray-500">time remaining</p>
            </div>
            <p className="text-right text-xs text-gray-400 dark:text-gray-500">
              {hasLicense ? `Expires ${expiry2}` : 'No active license'}
            </p>
          </div>

          <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${remainingPct}%` }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              className={`h-full rounded-full ${
                isExpired ? 'bg-rose-500' : 'bg-gradient-to-r from-emerald-400 to-emerald-500'
              }`}
            />
          </div>
        </div>

        {(smsBalance !== undefined && smsBalance !== null) && (
          <div className="mt-3 flex items-center justify-between rounded-xl bg-gray-50 px-3 py-2 dark:bg-gray-800/60">
            <div className="flex items-center gap-2">
              <MessageSquareText className="h-3.5 w-3.5 text-gray-400 dark:text-gray-500" />
              <span className="text-xs text-gray-500 dark:text-gray-400">SMS balance</span>
            </div>
            <span className="text-sm font-medium tabular-nums text-gray-800 dark:text-gray-100">
              {smsBalance}
            </span>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default License;