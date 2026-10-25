import { useState, useCallback, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import SpaceDashboardIcon from '@mui/icons-material/SpaceDashboard';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import HistoryIcon from '@mui/icons-material/History';
import TuneIcon from '@mui/icons-material/Tune';
import { api, usePoll } from './api';
import { Dot } from './ui';
import useSoftphone from './useSoftphone';
import Softphone from './Softphone';
import DashboardTab from './DashboardTab';
import ExtensionsTab from './ExtensionsTab';
import CallsTab from './CallsTab';
import SettingsTab from './SettingsTab';

const TABS = [
  { id: 'dashboard', label: 'Dashboard', Icon: SpaceDashboardIcon },
  { id: 'agents', label: 'Agents & extensions', Icon: SupportAgentIcon },
  { id: 'calls', label: 'Call history', Icon: HistoryIcon },
  { id: 'settings', label: 'Hours & greetings', Icon: TuneIcon },
];

export default function CallCenter() {
  const [tab, setTab] = useState('dashboard');
  const [data, setData] = useState({ ami_online: true, extensions: [] });
  const [myExt, setMyExt] = useState(() => localStorage.getItem('cc_my_ext') || '');
  const phone = useSoftphone();

  // Latest values for timers and callbacks.
  const phoneRef = useRef(phone);
  const dataRef = useRef(data);
  const myExtRef = useRef(myExt);
  phoneRef.current = phone;
  dataRef.current = data;
  myExtRef.current = myExt;

  const wantOnline = useRef(localStorage.getItem('cc_online') !== '0');
  const connecting = useRef(false);

  const load = useCallback(async () => {
    try { setData(await api('extensions')); } catch { /* keep last */ }
  }, []);
  usePoll(load, 8000);

  const chooseExt = (v) => {
    setMyExt(v);
    try { localStorage.setItem('cc_my_ext', v); } catch { /* ignore */ }
  };

  const connectNow = useCallback(async (silent) => {
    const ext = myExtRef.current;
    if (!ext || connecting.current) return;
    connecting.current = true;
    try {
      const cfg = await api(`extensions/${ext}/softphone`);
      await phoneRef.current.connect(cfg);
    } catch (e) {
      if (!silent) toast.error(e.message || 'Could not connect');
    } finally {
      connecting.current = false;
    }
  }, []);

  // Keeps the agent registered: first load, and after any dropped connection.
  const ensureOnline = useCallback(() => {
    const p = phoneRef.current;
    const ok = dataRef.current.extensions.some(
      (e) => e.extension === myExtRef.current && e.kind === 'webrtc' && e.enabled
    );
    if (wantOnline.current && ok && (p.reg === 'disconnected' || p.reg === 'error')) connectNow(true);
  }, [connectNow]);

  useEffect(() => { ensureOnline(); }, [data, myExt, ensureOnline]);
  useEffect(() => {
    const id = setInterval(ensureOnline, 8000);
    return () => clearInterval(id);
  }, [ensureOnline]);

  const goOnline = () => {
    wantOnline.current = true;
    try { localStorage.setItem('cc_online', '1'); } catch { /* ignore */ }
    connectNow(false);
  };

  const goOffline = () => {
    wantOnline.current = false;
    try { localStorage.setItem('cc_online', '0'); } catch { /* ignore */ }
    return phoneRef.current.disconnect();
  };

  const browserOptions = data.extensions.filter((e) => e.kind === 'webrtc' && e.enabled);
  const online = data.extensions.filter((e) => e.status === 'online').length;

  return (
    <div className="font-sans min-h-screen p-5 space-y-5 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-200">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-lime-500 text-slate-900 flex items-center justify-center">
              <SupportAgentIcon fontSize="small" />
            </span>
            Call center
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-2">
            <Dot on={data.ami_online} pulse />
            {data.ami_online
              ? `PBX connected · ${online} of ${data.extensions.length} agents online`
              : `PBX unreachable${data.ami_error ? ` · ${data.ami_error}` : ''}`}
          </p>
        </div>
      </div>

      <div className="flex gap-1 overflow-x-auto border-b border-slate-200 dark:border-slate-800">
        {TABS.map(({ id, label, Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`flex items-center gap-2 whitespace-nowrap px-4 py-2.5 text-sm font-semibold border-b-2 -mb-px transition-colors
              ${tab === id
                ? 'border-lime-500 text-lime-600 dark:text-lime-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'}`}
          >
            <Icon fontSize="small" /> {label}
          </button>
        ))}
      </div>

      {tab === 'dashboard' && <DashboardTab extensions={data.extensions} />}
      {tab === 'agents' && <ExtensionsTab data={data} reload={load} />}
      {tab === 'calls' && <CallsTab />}
      {tab === 'settings' && <SettingsTab />}

      <Softphone
        phone={{ ...phone, disconnect: goOffline }}
        myExt={myExt}
        setMyExt={chooseExt}
        options={browserOptions}
        onGoOnline={goOnline}
      />
    </div>
  );
}