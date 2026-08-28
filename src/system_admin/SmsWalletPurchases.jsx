import { useState, useEffect, useCallback, useMemo } from 'react';
import { Chip, CircularProgress } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import toast, { Toaster } from 'react-hot-toast';

const STATUS_STYLES = {
  completed: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400',
  pending: 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400',
  underpaid: 'bg-orange-50 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400',
  failed: 'bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400',
};

const currency = (v) => `KES ${parseFloat(v || 0).toLocaleString()}`;

const SmsWalletPurchases = () => {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchPurchases = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/system_admins/sms_wallet_purchases');
      const data = await res.json();
      if (res.ok) {
        setPurchases(data);
      } else {
        toast.error('Failed to load SMS credit purchases', { position: 'top-center' });
      }
    } catch {
      toast.error('Failed to load SMS credit purchases', { position: 'top-center' });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchPurchases(); }, [fetchPurchases]);

  const filtered = useMemo(() => {
    if (!search.trim()) return purchases;
    const term = search.toLowerCase();
    return purchases.filter((p) =>
      p.company_name?.toLowerCase().includes(term) ||
      p.reference?.toLowerCase().includes(term) ||
      p.status?.toLowerCase().includes(term)
    );
  }, [purchases, search]);

  const totals = useMemo(() => {
    const completed = purchases.filter((p) => p.status === 'completed');
    return {
      revenue: completed.reduce((sum, p) => sum + parseFloat(p.amount || 0), 0),
      credits: completed.reduce((sum, p) => sum + (p.quantity || 0), 0),
      pending: purchases.filter((p) => p.status === 'pending').length,
    };
  }, [purchases]);

  return (
    <div className="font-sans space-y-4">
      <Toaster />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-4">
          <p className="text-xs text-slate-500">Total revenue (completed)</p>
          <p className="text-lg font-semibold mt-1">{currency(totals.revenue)}</p>
        </div>
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-4">
          <p className="text-xs text-slate-500">Total credits sold</p>
          <p className="text-lg font-semibold mt-1">{totals.credits.toLocaleString()}</p>
        </div>
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-4">
          <p className="text-xs text-slate-500">Awaiting payment</p>
          <p className="text-lg font-semibold mt-1">{totals.pending}</p>
        </div>
      </div>

      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <SearchIcon className="text-gray-400" fontSize="small" />
        </div>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by company, reference, or status…"
          className="pl-10 w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg
            focus:ring-emerald-500 focus:border-emerald-500 p-2.5
            dark:bg-slate-800 dark:border-slate-700 dark:placeholder-slate-400 dark:text-white"
        />
      </div>

      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400 uppercase text-xs">
            <tr>
              <th className="text-left px-4 py-3 font-semibold">Company</th>
              <th className="text-left px-4 py-3 font-semibold">Reference</th>
              <th className="text-right px-4 py-3 font-semibold">Credits</th>
              <th className="text-right px-4 py-3 font-semibold">Amount</th>
            <th className="text-left px-4 py-3 font-semibold">Invoice #</th>
                                                                                                                                                                                
              <th className="text-left px-4 py-3 font-semibold">Status</th>
              <th className="text-left px-4 py-3 font-semibold">Date</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="text-center py-10">
                <CircularProgress size={22} />
              </td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-10 text-slate-400">
                {search ? 'No matching purchases found' : 'No SMS credit purchases yet'}
              </td></tr>
            ) : (
              filtered.map((p) => (
                <tr key={p.id} className="border-t border-slate-100 dark:border-slate-800">
                  <td className="px-4 py-3 font-medium text-slate-900 dark:text-slate-100">{p.company_name || '—'}</td>
                  <td className="px-4 py-3 text-slate-500 dark:text-slate-400 font-mono text-xs">{p.reference || '—'}</td>
                  <td className="px-4 py-3 text-right">{p.quantity}</td>
                  <td className="px-4 py-3 text-right font-medium">{currency(p.amount)}</td>
                  <td className="px-4 py-3 text-slate-500 dark:text-slate-400 font-mono text-xs">
  {p.invoice_number || '—'}
</td>
                  <td className="px-4 py-3">
                    <Chip
                      size="small"
                      label={p.status?.charAt(0).toUpperCase() + p.status?.slice(1)}
                      className={STATUS_STYLES[p.status] || ''}
                      sx={{ fontWeight: 600, textTransform: 'capitalize' }}
                    />
                  </td>
                  <td className="px-4 py-3 text-slate-500 dark:text-slate-400">
                    {p.created_at ? new Date(p.created_at).toLocaleString() : '—'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SmsWalletPurchases;