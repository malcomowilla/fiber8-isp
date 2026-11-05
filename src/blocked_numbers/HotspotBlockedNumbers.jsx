import { useState, useEffect, useCallback, useMemo } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import BlockIcon from '@mui/icons-material/Block';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

const MAX_REASON = 255;
const PHONE_RE = /^(?:\+?254|0)?[17]\d{8}$/;

const formatDate = (iso) =>
  iso ? new Date(iso).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' }) : '';

const Spinner = ({ small = false }) => (
  <span className={`inline-block rounded-full border-2 border-current border-t-transparent animate-spin ${small ? 'w-3.5 h-3.5' : 'w-6 h-6'}`} />
);

const HotspotBlockedNumbers = () => {
  const subdomain = window.location.hostname.split('.')[0];
  const headers = useMemo(
    () => ({ 'Content-Type': 'application/json', 'X-Subdomain': subdomain }),
    [subdomain]
  );

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [phone, setPhone] = useState('');
  const [reason, setReason] = useState('');
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  const [confirmId, setConfirmId] = useState(null);
  const [busyId, setBusyId] = useState(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch('/api/hotspot_blocked_numbers', { headers });
      const data = await res.json();
      if (res.ok && Array.isArray(data)) setItems(data);
      else toast.error(data.error || 'Could not load blocked numbers');
    } catch {
      toast.error('Could not load blocked numbers');
    } finally {
      setLoading(false);
    }
  }, [headers]);

  useEffect(() => { load(); }, [load]);

  const openModal = () => {
    setPhone('');
    setReason('');
    setFormError('');
    setModalOpen(true);
  };

  const closeModal = () => { if (!saving) setModalOpen(false); };

  const handleBlock = async (e) => {
    e.preventDefault();
    const cleaned = phone.replace(/[\s-]/g, '');
    if (!cleaned) return setFormError('Enter the phone number to block');
    if (!PHONE_RE.test(cleaned)) return setFormError('Enter a valid Kenyan number, e.g. 0712345678');

    setSaving(true);
    setFormError('');
    try {
      const res = await fetch('/api/hotspot_blocked_numbers', {
        method: 'POST',
        headers,
        body: JSON.stringify({ phone_number: cleaned, reason: reason.trim() }),
      });
      const data = await res.json();
      if (res.ok) {
        setItems((prev) => [data, ...prev]);
        setModalOpen(false);
        toast.success(`${data.phone_number} is blocked`);
      } else {
        setFormError(data.error || 'Could not block this number');
      }
    } catch {
      setFormError('Something went wrong. Please try again');
    } finally {
      setSaving(false);
    }
  };

  const handleUnblock = async (id) => {
    setBusyId(id);
    try {
      const res = await fetch(`/api/hotspot_blocked_numbers/${id}`, { method: 'DELETE', headers });
      if (!res.ok) throw new Error();
      setItems((prev) => prev.filter((i) => i.id !== id));
      setConfirmId(null);
      toast.success('Number unblocked');
    } catch {
      toast.error('Could not unblock this number');
    } finally {
      setBusyId(null);
    }
  };

  const filtered = useMemo(() => {
    const q = query.replace(/\s/g, '').toLowerCase();
    if (!q) return items;
    return items.filter(
      (i) => i.phone_number.includes(q) || (i.reason || '').toLowerCase().includes(query.trim().toLowerCase())
    );
  }, [items, query]);

  return (
    <div className="p-4 sm:p-6 max-w-3xl font-sans">
      <Toaster />

      {/* Header */}
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">Operations</p>
      <div className="mt-1 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Blocked customers</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Numbers and devices that cannot buy hotspot access on your network.
          </p>
        </div>
        <button
          type="button"
          onClick={openModal}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800
            dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 text-sm font-semibold transition-colors shrink-0"
        >
          <BlockIcon style={{ fontSize: 17 }} /> Block a number
        </button>
      </div>

      {/* Search */}
      {items.length > 0 && (
        <div className="relative mt-5">
          <SearchIcon style={{ fontSize: 18 }} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by number or reason"
            className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900
              text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400"
          />
        </div>
      )}

      {/* List */}
      <div className="mt-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        {loading ? (
          <div className="flex justify-center py-14 text-slate-400"><Spinner /></div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center text-center px-6 py-14">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400">
              <BlockIcon style={{ fontSize: 22 }} />
            </div>
            <p className="mt-4 text-sm font-semibold text-slate-900 dark:text-slate-100">No one is blocked</p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 max-w-xs leading-relaxed">
              Block a number to stop that customer and their devices from buying hotspot access.
            </p>
            <button
              type="button"
              onClick={openModal}
              className="mt-5 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700
                text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              <BlockIcon style={{ fontSize: 15 }} /> Block a number
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <p className="px-6 py-10 text-center text-sm text-slate-500 dark:text-slate-400">No blocked numbers match your search.</p>
        ) : (
          <ul className="divide-y divide-slate-100 dark:divide-slate-800">
            {filtered.map((i) => (
              <li key={i.id} className="flex items-center gap-3 p-4">
                <div className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center shrink-0">
                  <PhoneOutlinedIcon style={{ fontSize: 17 }} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{i.phone_number}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                    {i.reason || 'No reason given'}
                  </p>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
                    Blocked {formatDate(i.created_at)}{i.blocked_by ? ` by ${i.blocked_by}` : ''}
                  </p>
                </div>

                {confirmId === i.id ? (
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => setConfirmId(null)}
                      disabled={busyId === i.id}
                      className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-[11px] font-semibold text-slate-600 dark:text-slate-300"
                    >
                      Keep blocked
                    </button>
                    <button
                      type="button"
                      onClick={() => handleUnblock(i.id)}
                      disabled={busyId === i.id}
                      className="px-2.5 py-1.5 rounded-lg bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-[11px] font-semibold inline-flex items-center gap-1"
                    >
                      {busyId === i.id && <Spinner small />} Unblock
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setConfirmId(i.id)}
                    aria-label={`Unblock ${i.phone_number}`}
                    className="p-2 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0"
                  >
                    <DeleteOutlineIcon style={{ fontSize: 18 }} />
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Block modal */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
          >
            <motion.form
              onSubmit={handleBlock}
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.96, y: 8 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.96, y: 8 }}
              className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 shadow-xl font-sans"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">Block a number</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    Stops this customer and their devices from buying hotspot access.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={closeModal}
                  aria-label="Close"
                  className="p-1.5 -mr-1.5 -mt-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <CloseIcon style={{ fontSize: 18 }} />
                </button>
              </div>

              <p className="mt-5 text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
                Who should be blocked?
              </p>

              <div className="mt-3">
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">Phone number</label>
                <div className="relative">
                  <PhoneOutlinedIcon style={{ fontSize: 16 }} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="tel"
                    inputMode="tel"
                    autoFocus
                    value={phone}
                    onChange={(e) => { setPhone(e.target.value); setFormError(''); }}
                    placeholder="07XXXXXXXX"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60
                      text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">
                  Reason <span className="text-slate-400">(only your team sees this)</span>
                </label>
                <textarea
                  rows={3}
                  maxLength={MAX_REASON}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60
                    text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400 resize-none"
                />
                <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1 text-right">
                  {reason.length}/{MAX_REASON}
                </p>
              </div>

              {formError && <p className="mt-2 text-xs text-slate-700 dark:text-slate-300 font-medium">{formError}</p>}

              <div className="mt-5 flex gap-2">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={saving}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300
                    text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white
                    text-white dark:text-slate-900 text-sm font-semibold disabled:opacity-60 transition-colors
                    inline-flex items-center justify-center gap-2"
                >
                  {saving && <Spinner small />} Block number
                </button>
              </div>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HotspotBlockedNumbers;