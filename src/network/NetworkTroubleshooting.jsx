import { useState, useEffect, useCallback, useRef } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import RouterIcon from '@mui/icons-material/Router';
import SendIcon from '@mui/icons-material/Send';
import MemoryIcon from '@mui/icons-material/Memory';
import StorageIcon from '@mui/icons-material/Storage';
import SpeedIcon from '@mui/icons-material/Speed';
import VpnLockIcon from '@mui/icons-material/VpnLock';
import SecurityIcon from '@mui/icons-material/Security';
import DnsIcon from '@mui/icons-material/Dns';
import WifiTetheringIcon from '@mui/icons-material/WifiTethering';
import RefreshIcon from '@mui/icons-material/Refresh';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import CircleIcon from '@mui/icons-material/Circle';

const subdomain = window.location.hostname.split('.')[0];
const headers = { 'X-Subdomain': subdomain, 'Content-Type': 'application/json' };

const QUICK_PROMPTS = [
  "Is this router online and healthy right now?",
  "Why is CPU usage high and what should I do?",
  "Is the WireGuard tunnel up for this router?",
  "Any DHCP or IP addressing issues I should know about?",
  "Anything wrong with hotspot logins or vouchers here?",
];

const TABS = [
  { key: 'overview', label: 'Overview', icon: <SpeedIcon fontSize="small" /> },
  { key: 'wireguard', label: 'WireGuard', icon: <VpnLockIcon fontSize="small" /> },
  { key: 'firewall', label: 'Firewall', icon: <SecurityIcon fontSize="small" /> },
  { key: 'dhcp', label: 'DHCP Leases', icon: <DnsIcon fontSize="small" /> },
  { key: 'hotspot', label: 'Hotspot', icon: <WifiTetheringIcon fontSize="small" /> },
];




const suggestTabFor = (question) => {
  const q = question.toLowerCase();
  if (q.includes('wireguard') || q.includes('tunnel') || q.includes('vpn')) return { tab: 'wireguard', label: 'WireGuard' };
  if (q.includes('firewall') || q.includes('rule')) return { tab: 'firewall', label: 'Firewall' };
  if (q.includes('dhcp') || q.includes('lease') || q.includes('ip address')) return { tab: 'dhcp', label: 'DHCP Leases' };
  if (q.includes('hotspot') || q.includes('voucher') || q.includes('active user')) return { tab: 'hotspot', label: 'Hotspot' };
  return { tab: 'overview', label: 'Overview' };
};




export default function NetworkTroubleshooting() {
  const [routers, setRouters] = useState([]);
  const [selected, setSelected] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [diagnostics, setDiagnostics] = useState(null);
  const [tabData, setTabData] = useState(null);
  const [loadingTab, setLoadingTab] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [asking, setAsking] = useState(false);
  const chatEndRef = useRef(null);

  const fetchRouters = useCallback(async () => {
  try {
    const res = await fetch('/api/router_troubleshooting', { headers });
    const data = await res.json();
    if (res.ok && Array.isArray(data)) {
      setRouters(data);
      if (data.length && !selected) setSelected(data[0]);
    } else {
      setRouters([]);
      if (!res.ok) toast.error(data?.error || 'Failed to load routers');
    }
  } catch {
    setRouters([]);
    toast.error('Failed to load routers');
  }
}, [selected]);

  useEffect(() => { fetchRouters(); }, []);

  const fetchDiagnostics = useCallback(async (router) => {
    if (!router) return;
    try {
      const res = await fetch(`/api/router_troubleshooting/${router.id}/diagnostics`, { headers });
      const data = await res.json();
      if (res.ok) setDiagnostics(data);
      else setDiagnostics(null);
    } catch {
      setDiagnostics(null);
    }
  }, []);

  useEffect(() => {
    if (!selected) return;
    setMessages([{
      role: 'assistant',
      content: `Hey, I'm looking at **${selected.name}** (${selected.ip_address}) now. Ask me anything — CPU, WireGuard, DHCP, firewall, hotspot users — or tap a suggestion below.`
    }]);
    fetchDiagnostics(selected);
    setActiveTab('overview');
  }, [selected]);

  const fetchTab = useCallback(async (tab) => {
  if (!selected || tab === 'overview') { setTabData(null); return; }
  setLoadingTab(true);
  const endpointMap = {
    wireguard: 'wireguard', firewall: 'firewall', dhcp: 'dhcp_leases', hotspot: 'hotspot'
  };
  try {
    const res = await fetch(`/api/router_troubleshooting/${selected.id}/${endpointMap[tab]}`, { headers });
    const data = await res.json();
    setTabData(res.ok ? data : null);
  } catch {
    setTabData(null);
  } finally {
    setLoadingTab(false);
  }
}, [selected]);

  useEffect(() => { fetchTab(activeTab); }, [activeTab, fetchTab]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, asking]);


  




const sendMessage = async (text) => {
  const question = (text ?? input).trim();
  if (!question || !selected || asking) return;

  const nextMessages = [...messages, { role: 'user', content: question }];
  setMessages(nextMessages);
  setInput('');
  setAsking(true);

  try {
    const res = await fetch(`/api/router_troubleshooting/${selected.id}/ask`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        message: question,
        history: nextMessages.map(m => ({ role: m.role, content: m.content }))
      })
    });
    const data = await res.json();

    if (res.ok) {
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
    } else if (data.fallback) {
      // AI unreachable — fall back to pointing at the manual tab with the
      // relevant live data, rather than leaving the admin stuck.
      const { tab, label } = suggestTabFor(question);
      setActiveTab(tab);
      toast.error('Assistant is unavailable right now — showing raw data instead', { position: 'top-center', duration: 5000 });
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `I can't reach the AI right now, but I've pulled up the ${label} tab with live data for ${selected.name} — you can check it manually there. CPU is at ${data.snapshot?.cpu_load_percent ?? '—'}%, ${data.snapshot?.active_hotspot_users ?? 0} active hotspot users.`
      }]);
       } else {
      toast.error(data.error || 'Assistant is unavailable right now');
      setMessages(prev => [...prev, { role: 'assistant', content: "I couldn't reach my diagnostics tools just now — try the tabs above for the raw data." }]);
    }
  } catch {
    toast.error('Network error reaching assistant');
    setMessages(prev => [...prev, { role: 'assistant', content: "Network error reaching the assistant — the diagnostics tabs above still work independently." }]);
  } finally {
    setAsking(false);
  }
};





  const pingRouter = async () => {
    if (!selected) return;
    try {
      const res = await fetch(`/api/router_troubleshooting/${selected.id}/ping`, { method: 'POST', headers });
      const data = await res.json();
      toast[data.reachable ? 'success' : 'error'](
        data.reachable ? `${selected.name} is reachable` : `${selected.name} did not respond`,
        { position: 'top-center' }
      );
    } catch {
      toast.error('Ping failed');
    }
  };

  return (
    <div className="min-h-screen font-sans p-4 md:p-6">
      <Toaster />
      <div className="mb-5">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <SmartToyIcon className="text-indigo-500" /> Network Troubleshooting
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Live router diagnostics with an assistant that already knows what it's looking at.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr_380px] gap-4">
        {/* Router list */}
        <div className="rounded-2xl border border-gray-200 dark:border-[#3a3a3a] p-3 h-fit">
          <div className="text-xs uppercase tracking-wider text-gray-400 font-semibold mb-2 px-1">
            Routers
          </div>
          <ul className="space-y-1 max-h-[70vh] overflow-y-auto">
            {routers.map(r => (
              <li key={r.id}>
                <button
                  onClick={() => setSelected(r)}
                  className={`w-full flex items-center gap-2 p-2.5 rounded-xl text-left transition-colors ${
                    selected?.id === r.id
                      ? 'bg-indigo-500/10 ring-1 ring-indigo-400/40'
                      : 'hover:bg-gray-100 dark:hover:bg-white/5'
                  }`}
                >
                  <RouterIcon fontSize="small" className="text-gray-400 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium truncate">{r.name}</div>
                    <div className="text-xs text-gray-400 truncate">{r.ip_address}</div>
                  </div>
                  <CircleIcon
                    style={{ fontSize: 10 }}
                    className={r.reachable ? 'text-emerald-400' : 'text-red-400'}
                  />
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Diagnostics dashboard */}
        <div className="rounded-2xl border border-gray-200 dark:border-[#3a3a3a] p-4">
          {!selected ? (
            <p className="text-sm text-gray-400">Select a router to view diagnostics.</p>
          ) : (
            <>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="font-semibold text-lg">{selected.name}</h2>
                  <p className="text-xs text-gray-400">{selected.ip_address} · {selected.location || 'No location set'}</p>
                </div>
                <button
                  onClick={pingRouter}
                  className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-indigo-500 text-white hover:bg-indigo-600 transition-colors"
                >
                  <RefreshIcon style={{ fontSize: 15 }} /> Ping now
                </button>
              </div>

              <div className="flex gap-1 mb-4 overflow-x-auto pb-1">
                {TABS.map(t => (
                  <button
                    key={t.key}
                    onClick={() => setActiveTab(t.key)}
                    className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                      activeTab === t.key
                        ? 'bg-indigo-500/10 text-indigo-500 ring-1 ring-indigo-400/40'
                        : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5'
                    }`}
                  >
                    {t.icon} {t.label}
                  </button>
                ))}
              </div>

              {activeTab === 'overview' && diagnostics && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  <StatCard icon={<SpeedIcon />} label="CPU Load" value={`${diagnostics.cpu_load_percent ?? '—'}%`}
                    warn={diagnostics.cpu_load_percent >= 70} critical={diagnostics.cpu_load_percent >= 90} />
                  <StatCard icon={<MemoryIcon />} label="Memory Used" value={`${diagnostics.memory_used_percent ?? '—'}%`}
                    warn={diagnostics.memory_used_percent >= 70} critical={diagnostics.memory_used_percent >= 90} />
                  <StatCard icon={<StorageIcon />} label="Disk Used" value={`${diagnostics.disk_used_percent ?? '—'}%`}
                    warn={diagnostics.disk_used_percent >= 70} critical={diagnostics.disk_used_percent >= 90} />
                  <div className="col-span-2 md:col-span-3 text-xs text-gray-400 px-1">
                    {diagnostics.board} · RouterOS {diagnostics.version} · Uptime {diagnostics.uptime}
                  </div>

                  {diagnostics.insights?.length > 0 && (
                    <div className="col-span-2 md:col-span-3 space-y-2 mt-1">
                      {diagnostics.insights.map((i, idx) => (
                        <div key={idx} className={`text-sm rounded-lg px-3 py-2 ${
                          i.level === 'critical' ? 'bg-red-500/10 text-red-500' : 'bg-amber-500/10 text-amber-500'
                        }`}>
                          {i.message}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab !== 'overview' && (
                <TabContent tab={activeTab} data={tabData} loading={loadingTab} />
              )}
            </>
          )}
        </div>

        {/* AI troubleshooting assistant */}
        <div className="rounded-2xl border border-gray-200 dark:border-[#3a3a3a] flex flex-col h-[75vh]">
          <div className="p-3 border-b border-gray-200 dark:border-[#3a3a3a] flex items-center gap-2">
            <SmartToyIcon className="text-indigo-500" fontSize="small" />
            <span className="text-sm font-semibold">Troubleshooting Assistant</span>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {messages.map((m, idx) => (
              <div key={idx} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] text-sm rounded-2xl px-3 py-2 whitespace-pre-wrap ${
                  m.role === 'user'
                    ? 'bg-indigo-500 text-white rounded-br-sm'
                    : 'bg-gray-100 dark:bg-white/10 rounded-bl-sm'
                }`}>
                  {m.content}
                </div>
              </div>
            ))}
            <AnimatePresence>
              {asking && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="flex justify-start">
                  <div className="text-sm rounded-2xl rounded-bl-sm px-3 py-2 bg-gray-100 dark:bg-white/10 text-gray-400">
                    Checking the router…
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <div ref={chatEndRef} />
          </div>

          <div className="p-3 border-t border-gray-200 dark:border-[#3a3a3a] space-y-2">
            <div className="flex gap-1.5 overflow-x-auto pb-1">
              {QUICK_PROMPTS.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => sendMessage(p)}
                  className="text-xs whitespace-nowrap px-2.5 py-1 rounded-full bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 transition-colors"
                >
                  {p}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                placeholder={selected ? `Ask about ${selected.name}...` : 'Select a router first'}
                disabled={!selected || asking}
                className="flex-1 text-sm rounded-xl border border-gray-300 dark:border-[#3a3a3a] bg-transparent px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              <button
                onClick={() => sendMessage()}
                disabled={!selected || asking || !input.trim()}
                className="p-2.5 rounded-xl bg-indigo-500 text-white hover:bg-indigo-600 disabled:opacity-40 transition-colors"
              >
                <SendIcon fontSize="small" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, warn, critical }) {
  const color = critical ? 'text-red-500' : warn ? 'text-amber-500' : 'text-emerald-500';
  return (
    <div className="rounded-xl border border-gray-200 dark:border-[#3a3a3a] p-3">
      <div className={`flex items-center gap-1.5 text-xs text-gray-400 mb-1`}>{icon} {label}</div>
      <div className={`text-xl font-bold ${color}`}>{value}</div>
    </div>
  );
}





function TabContent({ tab, data, loading }) {
  if (loading) return <p className="text-sm text-gray-400">Loading…</p>;
  if (!data) return <p className="text-sm text-gray-400">No data available right now.</p>;

  if (tab === 'wireguard') {
    return (
      <div className="space-y-2 text-sm">
        <Row label="Configured" value={data.configured ? 'Yes' : 'No'} />
        <Row label="Tunnel IP" value={data.tunnel_ip || '—'} />
        <Row label="Connected" value={data.connected ? 'Yes' : 'No'} warn={!data.connected} />
        <Row label="Reachable" value={data.reachable ? 'Yes' : 'No'} warn={!data.reachable} />
        <Row label="Since" value={data.since || '—'} />
        <Row label="Last checked"
          value={data.last_checked_minutes_ago != null ? `${data.last_checked_minutes_ago} min ago` : '—'}
          warn={data.last_checked_minutes_ago > 15} />
      </div>
    );
  }

  if (tab === 'firewall') {
    if (!Array.isArray(data)) return <p className="text-sm text-gray-400">No firewall data available.</p>;
    return (
      <div className="max-h-[50vh] overflow-y-auto space-y-1.5 text-sm">
        {data.map((r, idx) => (
          <div key={idx} className="flex justify-between gap-2 border-b border-gray-100 dark:border-white/5 py-1.5">
            <span className="truncate">{r.chain} → {r.action} {r.disabled === 'true' && '(disabled)'}</span>
            <span className="text-gray-400 truncate">{r.comment}</span>
          </div>
        ))}
      </div>
    );
  }

  if (tab === 'dhcp') {
    if (!Array.isArray(data)) return <p className="text-sm text-gray-400">No DHCP lease data available.</p>;
    return (
      <div className="max-h-[50vh] overflow-y-auto space-y-1.5 text-sm">
        {data.map((l, idx) => (
          <div key={idx} className="flex justify-between gap-2 border-b border-gray-100 dark:border-white/5 py-1.5">
            <span>{l.address} · {l.mac_address}</span>
            <span className="text-gray-400">{l.host_name || '—'} ({l.status})</span>
          </div>
        ))}
      </div>
    );
  }

  if (tab === 'hotspot') {
    const users = Array.isArray(data.active_users) ? data.active_users : [];
    return (
      <div className="text-sm space-y-2">
        <p className="font-medium">{data.active_user_count ?? users.length} active users</p>
        <div className="max-h-[45vh] overflow-y-auto space-y-1.5">
          {users.map((u, idx) => (
            <div key={idx} className="flex justify-between border-b border-gray-100 dark:border-white/5 py-1.5">
              <span>{u.user}</span>
              <span className="text-gray-400">{u.address} · up {u.uptime}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return null;
}


function Row({ label, value, warn }) {
  return (
    <div className="flex justify-between">
      <span className="text-gray-400">{label}</span>
      <span className={warn ? 'text-red-500 font-medium' : 'font-medium'}>{value}</span>
    </div>
  );
}