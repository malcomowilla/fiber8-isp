import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { apiFetch, readJson } from '../utils/routerApi';

const btn = `inline-flex h-8 items-center gap-1.5 rounded-lg border border-black/10 px-3 text-xs font-medium
  text-black transition-colors hover:bg-black/5 disabled:opacity-50 dark:border-white/10 dark:text-white dark:hover:bg-white/10`;
const primary = `inline-flex h-8 items-center gap-1.5 rounded-lg bg-black px-4 text-xs font-semibold text-white
  disabled:opacity-50 dark:bg-white dark:text-black`;
const field = `h-10 w-full rounded-lg border border-black/10 bg-transparent px-3 text-sm text-black outline-none
  focus:border-black/40 dark:border-white/10 dark:text-white dark:focus:border-white/40`;
const label = 'mb-1 block text-[11px] font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400';

const RemoteAccessPanel = ({ router, disabled }) => {
  // ── Remote WinBox ──
  const [session, setSession] = useState(null); // { host, port, expires_at }
  const [starting, setStarting] = useState(false);
  const [ending, setEnding] = useState(false);
  const [remaining, setRemaining] = useState(null);
  const [copied, setCopied] = useState(false);
  const sessionRef = useRef(null);

  // ── Router login ──
  const [username, setUsername] = useState(router.username || '');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => { sessionRef.current = session; }, [session]);

  // Close the relay if the row is collapsed while a session is open (it also self-expires).
  useEffect(() => () => {
    if (sessionRef.current) {
      apiFetch(`/api/nas_routers/${router.id}/winbox_session`, { method: 'DELETE', keepalive: true }).catch(() => {});
    }
  }, [router.id]);

  // Countdown from the server's absolute expiry
  useEffect(() => {
    if (!session?.expires_at) return undefined;
    const tick = () => setRemaining(Math.max(0, Math.round((new Date(session.expires_at) - Date.now()) / 1000)));
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, [session]);

  const startSession = async () => {
    setStarting(true);
    try {
      const res = await apiFetch(`/api/nas_routers/${router.id}/remote_winbox_session`, { method: 'POST' });
      const data = await readJson(res);
      if (!res.ok) throw new Error(data.error || 'Failed to open remote WinBox session');
      setSession(data);
    } catch (err) {
      toast.error(err.message, { position: 'top-center', duration: 6000 });
    } finally {
      setStarting(false);
    }
  };

  const endSession = async () => {
    setEnding(true);
    try {
      await apiFetch(`/api/nas_routers/${router.id}/winbox_session`, { method: 'DELETE' });
    } catch { /* relay self-expires anyway */ }
    setSession(null);
    setRemaining(null);
    setEnding(false);
  };

  const connection = session ? `${session.host}:${session.port}` : '';
  const copy = () => {
    navigator.clipboard.writeText(connection);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  const mm = remaining != null ? String(Math.floor(remaining / 60)).padStart(2, '0') : '--';
  const ss = remaining != null ? String(remaining % 60).padStart(2, '0') : '--';
  const expired = session && remaining === 0;

  const mismatch = confirm.length > 0 && password !== confirm;
  const canSave = !disabled && !saving && username.trim() && password.length >= 8 && password === confirm;

  const resetForm = () => { setPassword(''); setConfirm(''); setShowPw(false); setUsername(router.username || ''); };

  const savePassword = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await apiFetch(`/api/nas_routers/${router.id}/change_router_password`, {
        method: 'POST',
        body: { username: username.trim(), password, password_confirmation: confirm },
      });
      const data = await readJson(res);
      if (!res.ok) throw new Error(data.error || 'Failed to change password');
      toast.success(data.message || 'Password updated', { position: 'top-center', duration: 5000 });
      resetForm();
    } catch (err) {
      toast.error(err.message, { position: 'top-center', duration: 6000 });
    } finally {
      setSaving(false);
    }
  };

  const Eye = showPw ? VisibilityOffIcon : VisibilityIcon;

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {/* Remote WinBox */}
      <div className="rounded-xl border border-black/10 p-4 dark:border-white/10">
        <h4 className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Remote WinBox</h4>

        {!session ? (
          <>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
              Opens a temporary relay to this router's WinBox port. It closes itself after 15 minutes.
            </p>
            <button className={`${primary} mt-4`} onClick={startSession} disabled={disabled || starting}
              title="Open a temporary WinBox connection to this router">
              {starting ? 'Opening…' : 'Start session'}
            </button>
          </>
        ) : (
          <div className="mt-3 space-y-3">
            <div className="flex items-center justify-between rounded-lg border border-black/10 p-3 dark:border-white/10">
              <div className="min-w-0">
                <p className="text-[11px] uppercase tracking-wider text-gray-500 dark:text-gray-400">Connect WinBox to</p>
                <p className="truncate font-mono text-lg font-semibold text-black dark:text-white">{connection}</p>
              </div>
              <button className={btn} onClick={copy} title="Copy address to clipboard">
                {copied ? <CheckIcon style={{ width: 16, height: 16 }} /> : <ContentCopyIcon style={{ width: 16, height: 16 }} />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>

            <div className="flex items-center justify-between rounded-lg border border-black/10 px-3 py-2 dark:border-white/10">
              <span className="text-sm text-gray-600 dark:text-gray-300">{expired ? 'Session expired' : 'Session closes in'}</span>
              <span className={`font-mono text-base font-semibold ${remaining != null && remaining < 60 ? 'text-red-500' : 'text-black dark:text-white'}`}>
                {mm}:{ss}
              </span>
            </div>

            <p className="text-xs text-gray-500 dark:text-gray-400">
              Sign in to WinBox with the router's own username and password.
            </p>

            <div className="flex gap-2">
              {expired && <button className={primary} onClick={startSession} disabled={starting}>Reopen</button>}
              <button className={btn} onClick={endSession} disabled={ending} title="Close the relay now">
                {ending ? 'Ending…' : 'End session'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Router login */}
      <form onSubmit={savePassword} className="rounded-xl border border-black/10 p-4 dark:border-white/10">
        <h4 className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Router login</h4>
        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          Sets the password for a user directly on the router. If it is the login the platform uses for this
          router (<span className="font-mono">{router.username}</span>), the saved credentials are updated too,
          so the platform stays connected.
        </p>

        <div className="mt-3 space-y-3">
          <div>
            <span className={label}>Username</span>
            <input className={field} value={username} onChange={(e) => setUsername(e.target.value)}
              autoComplete="off" disabled={disabled} />
          </div>

          <div>
            <span className={label}>New password</span>
            <div className="relative">
              <input className={`${field} pr-10`} type={showPw ? 'text' : 'password'} value={password}
                onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" disabled={disabled} />
              <button type="button" onClick={() => setShowPw((v) => !v)} title={showPw ? 'Hide password' : 'Show password'}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500">
                <Eye style={{ width: 18, height: 18 }} />
              </button>
            </div>
            {password.length > 0 && password.length < 8 && (
              <p className="mt-1 text-xs text-gray-500">At least 8 characters.</p>
            )}
          </div>

          <div>
            <span className={label}>Confirm new password</span>
            <input className={field} type={showPw ? 'text' : 'password'} value={confirm}
              onChange={(e) => setConfirm(e.target.value)} autoComplete="new-password" disabled={disabled} />
            {mismatch && <p className="mt-1 text-xs text-red-500">Passwords do not match.</p>}
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          <button type="submit" className={primary} disabled={!canSave} title="Apply this password on the router now">
            {saving ? 'Saving…' : 'Save'}
          </button>
          <button type="button" className={btn} onClick={resetForm} disabled={saving}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default RemoteAccessPanel;