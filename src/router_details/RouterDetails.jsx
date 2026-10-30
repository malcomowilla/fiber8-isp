import { useCallback, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import RefreshIcon from '@mui/icons-material/Refresh';
import ListAltIcon from '@mui/icons-material/ListAlt';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import DownloadIcon from '@mui/icons-material/Download';
import Modal from './Modal';
import RemoteAccessPanel from './RemoteAccessPanel';
import RouterReachabilityStats from '../NAS_IDENTIFIER/RouterReachabilityStats';
import { apiFetch, readJson } from '../utils/routerApi';



const btn = `inline-flex h-8 items-center gap-1.5 rounded-lg border border-black/10 px-3 text-xs font-medium
  text-black transition-colors hover:bg-black/5 disabled:opacity-50 dark:border-white/10 dark:text-white dark:hover:bg-white/10`;

const Tile = ({ label, value, unit, hint }) => (
  <div className="rounded-xl border border-black/10 p-4 dark:border-white/10">
    <p className="text-[11px] font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">{label}</p>
    <p className="mt-1.5 truncate text-lg font-semibold tabular-nums text-black dark:text-white" title={String(value ?? '')}>
      {value ?? '—'}
      {value != null && unit && <span className="ml-1 text-xs font-normal text-gray-500">{unit}</span>}
    </p>
    {hint && <p className="mt-1 truncate text-xs text-gray-500 dark:text-gray-400">{hint}</p>}
  </div>
);

const Row = ({ label, value }) => (
  <div className="flex items-center justify-between gap-4 border-b border-black/5 py-2 last:border-0 dark:border-white/5">
    <dt className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">{label}</dt>
    <dd className="truncate text-sm text-black dark:text-white">{value || '—'}</dd>
  </div>
);

const SectionTitle = ({ title, hint, children }) => (
  <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
    <div>
      <h3 className="text-sm font-semibold text-black dark:text-white">{title}</h3>
      {hint && <p className="text-xs text-gray-500 dark:text-gray-400">{hint}</p>}
    </div>
    <div className="flex items-center gap-2">{children}</div>
  </div>
);

// ── Logs modal ───────────────────────────────────────────────────────────────
const SEVERITIES = ['all', 'info', 'warning', 'error', 'critical', 'debug'];

const RouterLogsModal = ({ routerId, routerName, onClose }) => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [severity, setSeverity] = useState('all');
  const [auto, setAuto] = useState(false);
  const [limit, setLimit] = useState(100);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiFetch(`/api/get_router_logs?id=${routerId}`);
      const data = await readJson(res);
      if (!res.ok) throw new Error(data.error || 'Failed to fetch logs');
      setLogs([...data].reverse()); // newest first
    } catch (err) {
      toast.error(err.message, { position: 'top-center' });
    } finally {
      setLoading(false);
    }
  }, [routerId]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => {
    if (!auto) return undefined;
    const t = setInterval(load, 5000);
    return () => clearInterval(t);
  }, [auto, load]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return logs.filter((l) => {
      const hay = `${l.time || ''} ${l.topics || ''} ${l.message || ''}`.toLowerCase();
      return hay.includes(q) && (severity === 'all' || (l.topics || '').toLowerCase().includes(severity));
    });
  }, [logs, search, severity]);

  const exportLogs = () => {
    const text = [...filtered].reverse().map((l) => `${l.time || ''}\t${l.topics || ''}\t${l.message || ''}`).join('\n');
    const url = URL.createObjectURL(new Blob([text], { type: 'text/plain' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = `mikrotik-logs-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const field = `h-9 rounded-lg border border-black/10 bg-transparent px-3 text-sm text-black outline-none
    focus:border-black/40 dark:border-white/10 dark:text-white dark:focus:border-white/40`;

  return (
    <Modal
      size="lg"
      title="System logs"
      subtitle={`${routerName} · last ${logs.length} entries`}
      // onClose={onClose}
      footer={<button className={btn} onClick={onClose}>Close</button>}
    >
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <input className={`${field} w-64`} placeholder="Search logs…" value={search} onChange={(e) => setSearch(e.target.value)} />
        <select className={field} value={severity} onChange={(e) => setSeverity(e.target.value)}>
          {SEVERITIES.map((s) => <option key={s} value={s} className="text-black">{s === 'all' ? 'All severities' : s}</option>)}
        </select>
        <label className="ml-auto flex cursor-pointer items-center gap-2 text-xs text-gray-600 dark:text-gray-300">
          <input type="checkbox" checked={auto} onChange={(e) => setAuto(e.target.checked)} />
          Auto-refresh (5s)
        </label>
        <button className={btn} onClick={load} disabled={loading} title="Fetch the latest logs from the router">
          <RefreshIcon style={{ width: 16, height: 16 }} /> {loading ? 'Loading…' : 'Refresh'}
        </button>
        <button className={btn} onClick={exportLogs} title="Download the filtered logs as a text file">
          <DownloadIcon style={{ width: 16, height: 16 }} /> Export
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-black/10 dark:border-white/10">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-black/10 uppercase tracking-wider text-gray-500 dark:border-white/10 dark:text-gray-400">
              <th className="px-3 py-2 font-semibold">Time</th>
              <th className="px-3 py-2 font-semibold">Topics</th>
              <th className="px-3 py-2 font-semibold">Message</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={3} className="px-3 py-10 text-center text-gray-500">{loading ? 'Loading…' : 'No logs match your filters'}</td></tr>
            ) : filtered.slice(0, limit).map((l, i) => {
              const strong = /error|critical/i.test(l.topics || '');
              return (
                <tr key={i} className="border-b border-black/5 last:border-0 dark:border-white/5">
                  <td className="whitespace-nowrap px-3 py-2 font-mono text-gray-500 dark:text-gray-400">{l.time || '—'}</td>
                  <td className={`px-3 py-2 text-black dark:text-white ${strong ? 'font-semibold' : ''}`}>{l.topics || '—'}</td>
                  <td className="whitespace-pre-wrap px-3 py-2 text-black dark:text-white">{l.message || '—'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {filtered.length > limit && (
        <div className="mt-3 text-center">
          <button className={btn} onClick={() => setLimit((n) => n + 100)}>
            Show more ({filtered.length - limit} remaining)
          </button>
        </div>
      )}
    </Modal>
  );
};

// ── Expanded row panel ───────────────────────────────────────────────────────
const RouterDetails = ({ router, reachable }) => {
  const [info, setInfo] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [logsOpen, setLogsOpen] = useState(false);
  const [confirmReboot, setConfirmReboot] = useState(false);
  const [rebooting, setRebooting] = useState(false);

  const offline = reachable === false;

  const fetchInfo = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const res = await apiFetch(`/api/router_info?id=${router.id}`);
      const data = await readJson(res);
      if (!res.ok) throw new Error(data.error || 'Failed to fetch router info');
      setInfo(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [router.id]);

  useEffect(() => {
    if (offline) return undefined;
    fetchInfo();
    const t = setInterval(() => fetchInfo(true), 10000);
    return () => clearInterval(t);
  }, [fetchInfo, offline]);

  const reboot = async () => {
    setRebooting(true);
    try {
      const res = await apiFetch(`/api/nas_routers/${router.id}/reboot`, { method: 'POST' });
      const data = await readJson(res);
      if (!res.ok) throw new Error(data.error || 'Failed to reboot router');
      toast.success('Router is rebooting', { position: 'top-center', duration: 5000 });
      setInfo(null);
    } catch (err) {
      toast.error(err.message, { position: 'top-center', duration: 5000 });
    } finally {
      setRebooting(false);
      setConfirmReboot(false);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Router info */}
      <section>
        <SectionTitle title="Router info" hint="Live from the router · refreshes every 10 seconds">
          <button className={btn} onClick={() => fetchInfo()} disabled={offline || loading} title="Fetch the latest values now">
            <RefreshIcon style={{ width: 16, height: 16 }} /> Refresh
          </button>
          <button className={btn} onClick={() => setLogsOpen(true)} disabled={offline} title="Open the router's system log">
            <ListAltIcon style={{ width: 16, height: 16 }} /> View system logs
          </button>
          {confirmReboot ? (
            <>
              <button disabled={rebooting} onClick={reboot}
                className="inline-flex h-8 items-center rounded-lg bg-red-600 px-3 text-xs font-semibold text-white disabled:opacity-50">
                {rebooting ? 'Rebooting…' : 'Confirm reboot'}
              </button>
              <button className={btn} disabled={rebooting} onClick={() => setConfirmReboot(false)}>Cancel</button>
            </>
          ) : (
            <button className={btn} onClick={() => setConfirmReboot(true)} disabled={offline}
              title="Restart the router. Everyone on it loses connection for a few minutes">
              <PowerSettingsNewIcon style={{ width: 16, height: 16 }} /> Reboot router
            </button>
          )}
        </SectionTitle>

        {offline && (
          <p className="mb-3 rounded-xl border border-black/10 p-3 text-sm text-gray-600 dark:border-white/10 dark:text-gray-300">
            This router is not reachable right now, so live info, remote access and commands are unavailable.
            Reachability history is still shown below.
          </p>
        )}

        {error && !offline && (
          <p className="mb-3 rounded-xl border border-black/10 p-3 text-sm text-gray-600 dark:border-white/10 dark:text-gray-300">
            Could not read the router: {error}
          </p>
        )}

        {!offline && (
          <>
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
              <Tile label="Brand / Model" value={info?.board_name} />
              <Tile label="RouterOS version" value={info?.version} />
              <Tile label="Uptime" value={info?.uptime} />
              <Tile label="CPU load" value={info?.cpu_load_percent} unit="%" />
              <Tile
                label="Active sessions"
                value={info?.active_sessions}
                hint={info ? `PPPoE ${info.pppoe_sessions} · Hotspot ${info.hotspot_sessions}` : null}
              />
            </div>

            <dl className="mt-3 grid gap-x-8 rounded-xl border border-black/10 px-4 dark:border-white/10 md:grid-cols-2">
              <Row label="Memory" value={info && `${info.memory_usage.used} of ${info.memory_usage.total} (${info.memory_percent}%)`} />
              <Row label="Disk" value={info && `${info.disk_usage.used} of ${info.disk_usage.total} (${info.disk_percent}%)`} />
              <Row label="Architecture" value={info?.architecture_name} />
              <Row label="Timezone" value={info?.time_zone_name} />
            </dl>
          </>
        )}
      </section>

      {/* Remote access + router login */}
      <section>
        <SectionTitle title="Remote access" hint="Open a temporary WinBox connection and manage the router's own login" />
        <RemoteAccessPanel router={router} disabled={offline} />
      </section>

      {/* Reachability */}
      <section>
        <SectionTitle title="Reachability" hint="How often this router has gone offline" />
        <RouterReachabilityStats routerId={router.id} />
      </section>

      {logsOpen && <RouterLogsModal routerId={router.id} routerName={router.name} onClose={() => setLogsOpen(false)} />}
    </div>
  );
};

export default RouterDetails;