
// import DeleteIcon from '@mui/icons-material/Delete';
// import { IconButton } from '@mui/material';
// import EditIcon from '@mui/icons-material/Edit';
// import {useState,  useEffect, useCallback} from 'react'
// import { useApplicationSettings } from '../settings/ApplicationSettings';
// import { createConsumer } from "@rails/actioncable";
// const cable = createConsumer(`wss://${window.location.hostname}/cable`);



// const HotspotDashboard = () => {

//   const [open, setOpen] = useState(false);
//   const [search, setSearch] = useState('');
//   const {companySettings, setCompanySettings,

//     templateStates, setTemplateStates,
//     settingsformData, setFormData,
//     handleChangeHotspotVoucher, voucher, setVoucher
//   } = useApplicationSettings()
// const [stats, setStats] = useState([])
 
//   const handleClickOpen = () => {
//     setOpen(true);
//   };

//   const handleClose = () => {
//     setOpen(false);
//   };
//   const DeleteButton = ({ id }) => (
//         <IconButton style={{ color: '#8B0000' }}>
//           <DeleteIcon />
//         </IconButton>
//       );


//   const EditButton = ( ) => (
//     <IconButton onClick={handleClickOpen} style={{color: 'black'}} >
//       <EditIcon />
//     </IconButton>
//   );
  

  



          
// const subdomain = window.location.hostname.split('.')[0]


// const fetchRouters = useCallback(
//  async() => {
//    try {
//      const response = await fetch('/api/allow_get_router_settings', {
//        headers: {
//          'X-Subdomain': subdomain,
//        },
//      })
// const newData = await response.json()
//      if (response) {
//        const {router_name} = newData[0]
//        setFormData({...settingsformData, router_name})
//      } else {
//      }
//    } catch (error) {
//    }
//  },
//  [],
// )



//  useEffect(() => {
  
//    fetchRouters()
//  }, [fetchRouters]);




//  useEffect(() => {
//     const subscription = cable.subscriptions.create(
//       { channel: "HotspotChannel" ,
//         "X-Subdomain": subdomain
//   }, 
//       {
//         received(data) {
//            console.log('received data from hotspot channel', data)
//            setStats(data.users)
         
//         },
//         connected() {
//           console.log("Connected to Hotspot Chanel");
//         },
//         disconnected() {
//           console.log("Disconnected from Hotspot Chanel");
//         },
//       }
//     );

//     return () => {
//       subscription.unsubscribe();
//     };
//   }, [subdomain]);


 


//   return (
//     <>
    
//     </>
//   )
// }

// export default HotspotDashboard




import { useState, useEffect, useMemo } from 'react';
import { createConsumer } from '@rails/actioncable';
import { IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import RouterIcon from '@mui/icons-material/Router';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import WifiIcon from '@mui/icons-material/Wifi';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

const cable = createConsumer(`wss://${window.location.hostname}/cable`);

// ASSUMPTION: change to your real disconnect endpoint
const DISCONNECT_URL = '/api/disconnect_hotspot_user';
const PAGE_SIZE = 25;
const UNASSIGNED = 'Unassigned';

const formatDate = (iso) => {
  if (!iso) return '—';
  const d = new Date(iso);
  if (isNaN(d)) return '—';
  return d.toLocaleString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit', hour12: false,
  });
};

const timeLeft = (iso, now) => {
  if (!iso) return null;
  const ms = new Date(iso).getTime() - now;
  if (isNaN(ms)) return null;
  if (ms <= 0) return 'Expired';
  const m = Math.floor(ms / 60000);
  const h = Math.floor(m / 60);
  const d = Math.floor(h / 24);
  if (d > 0) return `${d}d ${h % 24}h left`;
  if (h > 0) return `${h}h ${m % 60}m left`;
  return `${m}m left`;
};

const Detail = ({ label, value, mono }) => (
  <div className="min-w-0">
    <p className="text-[11px] uppercase tracking-wider text-gray-500 dark:text-gray-400">{label}</p>
    <p className={`mt-0.5 text-sm text-gray-900 dark:text-gray-100 truncate ${mono ? 'font-mono' : ''}`}>
      {value || '—'}
    </p>
  </div>
);

const HotspotDashboard = () => {
  const subdomain = window.location.hostname.split('.')[0];

  const [users, setUsers] = useState([]);
  const [connected, setConnected] = useState(false);
  const [search, setSearch] = useState('');
  const [routerFilter, setRouterFilter] = useState('all');
  const [expanded, setExpanded] = useState(null);
  const [page, setPage] = useState(1);
  const [now, setNow] = useState(Date.now());

  // live data
  useEffect(() => {
    const subscription = cable.subscriptions.create(
      { channel: 'HotspotChannel', 'X-Subdomain': subdomain },
      {
        received(data) {
          setUsers(Array.isArray(data.users) ? data.users : []);
        },
        connected() {
          setConnected(true);
        },
        disconnected() {
          setConnected(false);
        },
      }
    );
    return () => subscription.unsubscribe();
  }, [subdomain]);

  // keep "time left" fresh
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 30000);
    return () => clearInterval(t);
  }, []);

  const routerOf = (u) => u.router || u.voucher?.router || UNASSIGNED;

  const routerCounts = useMemo(() => {
    const counts = {};
    users.forEach((u) => {
      const r = routerOf(u);
      counts[r] = (counts[r] || 0) + 1;
    });
    return counts;
  }, [users]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return users.filter((u) => {
      if (routerFilter !== 'all' && routerOf(u) !== routerFilter) return false;
      if (!q) return true;
      return [u.username, u.ip_address, u.mac_address, routerOf(u), u.package, u.voucher?.phone]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q));
    });
  }, [users, search, routerFilter]);

  useEffect(() => {
    setPage(1);
  }, [search, routerFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageRows = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const handleDisconnect = async (u) => {
    if (!window.confirm(`Disconnect ${u.username}?`)) return;
    try {
      const res = await fetch(DISCONNECT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Subdomain': subdomain },
        body: JSON.stringify({ username: u.username, router: routerOf(u) }),
      });
      if (res.ok) {
        setUsers((prev) => prev.filter((x) => x.username !== u.username));
      }
    } catch (e) {
      console.error('disconnect failed', e);
    }
  };

  return (
    <div className="font-sans w-full max-w-7xl mx-auto p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-3 mb-5">
        <div>
          <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Active Sessions</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
            <WifiIcon sx={{ fontSize: 16 }} />
            {users.length} online across {Object.keys(routerCounts).length} router
            {Object.keys(routerCounts).length === 1 ? '' : 's'}
            <span className="mx-1">·</span>
            <span className="inline-flex items-center gap-1.5">
              <span
                className={`inline-block w-1.5 h-1.5 rounded-full ${
                  connected ? 'bg-gray-900 dark:bg-gray-100' : 'bg-gray-400'
                }`}
              />
              {connected ? 'Live' : 'Reconnecting'}
            </span>
          </p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <SearchIcon
            sx={{ fontSize: 20 }}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search voucher, IP, MAC, phone, router..."
            className="w-full pl-10 pr-3 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-gray-700
              bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400
              focus:outline-none focus:ring-2 focus:ring-gray-900/10 dark:focus:ring-white/20 focus:border-gray-400"
          />
        </div>

        <div className="relative sm:w-64">
          <RouterIcon
            sx={{ fontSize: 20 }}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          />
          <select
            value={routerFilter}
            onChange={(e) => setRouterFilter(e.target.value)}
            className="w-full appearance-none pl-10 pr-9 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-gray-700
              bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100
              focus:outline-none focus:ring-2 focus:ring-gray-900/10 dark:focus:ring-white/20 focus:border-gray-400"
          >
            <option value="all">All Routers ({users.length})</option>
            {Object.entries(routerCounts)
              .sort((a, b) => a[0].localeCompare(b[0]))
              .map(([name, count]) => (
                <option key={name} value={name}>
                  {name} ({count})
                </option>
              ))}
          </select>
          <ExpandMoreIcon
            sx={{ fontSize: 20 }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-wider text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-800">
                <th className="px-5 py-3 font-medium">User</th>
                <th className="px-5 py-3 font-medium">IP / MAC</th>
                <th className="px-5 py-3 font-medium">Router</th>
                <th className="px-5 py-3 font-medium">Uptime</th>
                <th className="px-5 py-3 font-medium">Data Usage</th>
                <th className="px-5 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pageRows.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-16 text-center text-gray-500 dark:text-gray-400">
                    {users.length === 0 ? 'No active sessions right now.' : 'No sessions match your filters.'}
                  </td>
                </tr>
              )}

              {pageRows.map((u) => {
                const key = `${u.username}-${u.mac_address}`;
                const isOpen = expanded === key;
                const v = u.voucher;
                const left = timeLeft(v?.expires_at, now);

                return (
                  <FragmentRow key={key}>
                    <tr
                      onClick={() => setExpanded(isOpen ? null : key)}
                      className="cursor-pointer border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                    >
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <ExpandMoreIcon
                            sx={{ fontSize: 18 }}
                            className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                          />
                          <div>
                            <p className="font-medium text-gray-900 dark:text-gray-100">{u.username}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{u.package || '—'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <p className="font-mono text-gray-900 dark:text-gray-100">{u.ip_address}</p>
                        <p className="font-mono text-xs text-gray-500 dark:text-gray-400">{u.mac_address}</p>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300">
                          <RouterIcon sx={{ fontSize: 14 }} />
                          {routerOf(u)}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-gray-900 dark:text-gray-100 whitespace-nowrap">{u.up_time}</td>
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <p className="flex items-center gap-1 text-gray-900 dark:text-gray-100">
                          <ArrowDownwardIcon sx={{ fontSize: 14 }} className="text-gray-400" />
                          {u.download}
                        </p>
                        <p className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                          <ArrowUpwardIcon sx={{ fontSize: 14 }} className="text-gray-400" />
                          {u.upload}
                        </p>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <IconButton
                          size="small"
                          title="Disconnect"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDisconnect(u);
                          }}
                        >
                          <PowerSettingsNewIcon sx={{ fontSize: 20 }} />
                        </IconButton>
                      </td>
                    </tr>

                    {isOpen && (
                      <tr className="bg-gray-50 dark:bg-gray-800/40 border-b border-gray-100 dark:border-gray-800">
                        <td colSpan={6} className="px-5 py-5">
                          {v ? (
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-4">
                              <Detail label="Package" value={v.package} />
                              <Detail label="Speed" value={v.speed} />
                              <Detail label="Validity" value={v.validity} />
                              <Detail label="Status" value={v.status} />
                              <Detail label="Activated" value={formatDate(v.activated_at)} />
                              <Detail
                                label="Expires"
                                value={`${formatDate(v.expires_at)}${left ? ` · ${left}` : ''}`}
                              />
                              <Detail label="Purchased" value={formatDate(v.purchased_at)} />
                              <Detail label="Login by" value={v.login_by} />
                              <Detail label="Phone" value={v.phone} />
                              <Detail label="Amount" value={v.amount ? `KES ${v.amount}` : null} />
                              <Detail label="Payment" value={v.payment_method} />
                              <Detail label="Reference" value={v.reference} mono />
                              <Detail label="Router" value={v.router || routerOf(u)} />
                              <Detail label="IP" value={u.ip_address} mono />
                              <Detail label="MAC" value={u.mac_address} mono />
                            </div>
                          ) : (
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              No voucher record found for this session.
                            </p>
                          )}
                        </td>
                      </tr>
                    )}
                  </FragmentRow>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer / pagination */}
        {filtered.length > 0 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-gray-200 dark:border-gray-800 text-xs text-gray-500 dark:text-gray-400">
            <span>
              {(safePage - 1) * PAGE_SIZE + 1}–{Math.min(safePage * PAGE_SIZE, filtered.length)} of {filtered.length}
            </span>
            <div className="flex items-center gap-1">
              <IconButton size="small" disabled={safePage <= 1} onClick={() => setPage(safePage - 1)}>
                <ChevronLeftIcon sx={{ fontSize: 20 }} />
              </IconButton>
              <span className="px-2">
                {safePage} / {totalPages}
              </span>
              <IconButton size="small" disabled={safePage >= totalPages} onClick={() => setPage(safePage + 1)}>
                <ChevronRightIcon sx={{ fontSize: 20 }} />
              </IconButton>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// keeps <tr> siblings valid without extra DOM
const FragmentRow = ({ children }) => <>{children}</>;

export default HotspotDashboard;






