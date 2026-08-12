import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useCallback } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { IoMdKey } from 'react-icons/io';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

// Mock data for passkeys (used only until the first successful fetch)
const initialPasskeys = [
  { id: 1, name: 'Passkey 1' },
  { id: 2, name: 'Passkey 2' },
  { id: 3, name: 'Passkey 3' },
];

const PasskeyList = () => {
  const [passkeys, setPasskeys] = useState(initialPasskeys);
  const [loading, setLoading] = useState(true);

  const handleDelete = (id) => {
    setPasskeys((prevPasskeys) => prevPasskeys.filter((passkey) => passkey.id !== id));
  };

  const fetchPasskeyLists = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/get_passkey_credentials_system_admin');
      const newData = await response.json();
      if (response.ok) {
        const { credentials } = newData;
        setPasskeys(credentials ?? []);
      } else {
        toast.error('Failed to fetch passkey credentials', {
          duration: 4000,
          position: 'top-center',
        });
      }
    } catch (error) {
      toast.error('We’re having trouble completing this request', {
        duration: 3000,
        position: 'top-center',
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPasskeyLists();
  }, [fetchPasskeyLists]);

  return (
    <>
      <Toaster />
      <div className="passkey-list">
        <div className="mb-5">
          <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Passkeys</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Devices and browsers registered for passwordless sign-in to this admin account.
          </p>
        </div>

        {loading && (
          <div className="flex flex-col gap-3">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="h-16 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800/50 animate-pulse"
              />
            ))}
          </div>
        )}

        {!loading && passkeys.length === 0 && (
          <div className="rounded-xl border border-dashed border-slate-300 dark:border-slate-700 p-8 text-center">
            <IoMdKey className="mx-auto w-6 h-6 text-slate-400 dark:text-slate-500" />
            <p className="mt-2 text-sm font-medium text-slate-700 dark:text-slate-300">No passkeys registered</p>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
              Register a passkey from your profile to sign in without a password.
            </p>
          </div>
        )}

        {!loading && passkeys.length > 0 && (
          <ul className="flex flex-col gap-3">
            <AnimatePresence>
              {passkeys.map((passkey) => (
                <motion.li
                  key={passkey.id}
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 50 }}
                  transition={{ duration: 0.25 }}
                  className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-3.5 shadow-sm"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0">
                      <IoMdKey className="w-4 h-4" />
                    </span>
                    <span className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">
                      {passkey.system_admin?.email ?? passkey.name ?? `Passkey ${passkey.id}`}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDelete(passkey.id)}
                    className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors shrink-0"
                  >
                    <DeleteOutlineIcon className="w-4 h-4" />
                    Remove
                  </button>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        )}
      </div>
    </>
  );
};

export default PasskeyList;