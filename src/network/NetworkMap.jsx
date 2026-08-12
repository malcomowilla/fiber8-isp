/**
 * NetworkMap
 * -----------------------------------------------------------------------
 * A Google-Earth-style network topology map for ISP / WISP infrastructure
 * (POPs, OLTs, switches, FATs, splitters, ONTs, access points, routers)
 * built entirely on free, key-less tile sources:
 *
 *   Streets   -> OpenStreetMap standard tiles
 *   Satellite -> Esri World Imagery
 *   Hybrid    -> Esri World Imagery + Esri reference/labels overlay
 *
 * No Google Maps, no Mapbox, no API keys, no billing.
 *
 * Styling: Tailwind CSS utility classes, LIGHT theme by default with
 * `dark:` variants for dark mode (driven by Tailwind's `class` strategy —
 * add/remove a `dark` class on a parent element, e.g. <html> or <body>,
 * to toggle). Font is `font-sans` throughout (set once on the root and
 * inherited by every child).
 *
 * Dependencies (install in your Rails/Webpacker/Vite React app):
 *   npm install leaflet
 *   Tailwind CSS configured with darkMode: 'class'
 *
 * This component talks to your Rails API through the `api` prop (see the
 * bottom of this file for the expected shape). If no `api` is supplied it
 * runs fully client-side against local state + localStorage, so you can
 * drop it in and see it work before wiring up the backend.
 * -----------------------------------------------------------------------
 */

import { useEffect, useMemo, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  Radio, Router as RouterIcon, Split, GitBranch, Wifi, Server,
  Antenna, Cable, Search, RefreshCw, Layers, X, Plus, Trash2, Pencil,
  MapPin, ChevronRight, ChevronDown, Building2, CircleDot
} from 'lucide-react';

/* ------------------------------------------------------------------ */
/* Domain constants                                                    */
/* ------------------------------------------------------------------ */

const DEVICE_TYPES = {
  olt:      { label: 'OLT',            full: 'Optical Line Terminal',   icon: Server,     color: '#0ea5e9' },
  switch:   { label: 'Switch',         full: 'Network Switch',          icon: GitBranch,  color: '#8b5cf6' },
  fat:      { label: 'FAT',            full: 'Fiber Access Terminal',   icon: Split,      color: '#f59e0b' },
  splitter: { label: 'Splitter',       full: 'Fiber Splitter',          icon: Split,      color: '#f97316' },
  ont:      { label: 'ONT',            full: 'Optical Network Terminal',icon: Radio,       color: '#10b981' },
  ap:       { label: 'Access Point',   full: 'Wireless Access Point',   icon: Antenna,     color: '#3b82f6' },
  bridge:   { label: 'Bridge Router',  full: 'Bridge Router',           icon: RouterIcon,  color: '#ec4899' },
  hotspot:  { label: 'Hotspot Router', full: 'Hotspot Router',          icon: Wifi,        color: '#06b6d4' },
};

const CABLE_TYPES = {
  adss:   { label: 'ADSS Fiber',  category: 'adss',   color: '#d97706', dash: null,     widthMbps: null },
  drop:   { label: 'Drop Cable',  category: 'drop',   color: '#ea580c', dash: null,     widthMbps: null },
  ether:  { label: 'Ethernet',    category: 'ether',  color: '#475569', dash: null,     widthMbps: null },
  wifi:   { label: 'Wireless',    category: 'wifi',   color: '#7c3aed', dash: '6 8',    widthMbps: null },
};

const ADSS_CORES = ['4', '6', '8', '12', '24', '36', '48', '72', '96', '144'];

const STATUS = {
  active:   { label: 'Active',   color: '#16a34a' },
  degraded: { label: 'Degraded', color: '#ca8a04' },
  down:     { label: 'Down',     color: '#dc2626' },
  unknown:  { label: 'Unknown',  color: '#94a3b8' },
};

const BASEMAPS = {
  streets: {
    label: 'Streets',
    layers: [
      { url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', attribution: '© OpenStreetMap contributors', subdomains: 'abc' },
    ],
  },
  satellite: {
    label: 'Satellite',
    layers: [
      { url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', attribution: 'Esri, Maxar, Earthstar Geographics' },
    ],
  },
  hybrid: {
    label: 'Hybrid',
    layers: [
      { url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', attribution: 'Esri, Maxar, Earthstar Geographics' },
      { url: 'https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}', attribution: 'Esri' },
    ],
  },
};

const uid = () => `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;

/* ------------------------------------------------------------------ */
/* Shared Tailwind class fragments                                     */
/* (kept as constants so every instance of a control stays consistent) */
/* ------------------------------------------------------------------ */

const cx = (...parts) => parts.filter(Boolean).join(' ');

const PANEL =
  'absolute z-[500] rounded-xl border border-slate-200 bg-white/95 shadow-lg shadow-slate-900/5 backdrop-blur-md ' +
  'dark:border-slate-700/60 dark:bg-slate-900/90 dark:shadow-black/40';

const PANEL_HEAD =
  'flex cursor-pointer select-none items-center gap-2 px-3.5 py-3 text-xs font-semibold uppercase tracking-wide ' +
  'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100';

const BTN =
  'inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold ' +
  'text-slate-700 transition hover:border-teal-400 hover:bg-slate-50 active:translate-y-px disabled:cursor-default disabled:opacity-60 ' +
  'dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-teal-500 dark:hover:bg-slate-700';

const BTN_PRIMARY =
  'border-transparent bg-gradient-to-b from-teal-500 to-teal-600 text-white shadow-sm hover:from-teal-400 hover:to-teal-500';

const BTN_GHOST = 'border-slate-200 bg-transparent dark:border-slate-700';

const BTN_DANGER =
  'border-red-200 bg-red-50 text-red-600 hover:bg-red-100 dark:border-red-500/40 dark:bg-red-500/10 dark:text-red-300 dark:hover:bg-red-500/20';

const FIELD_INPUT =
  'rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-2 text-sm text-slate-900 outline-none ' +
  'focus:border-teal-500 disabled:opacity-60 ' +
  'dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100';

/* ------------------------------------------------------------------ */
/* Leaflet icon builders                                               */
/* (Tailwind utility class *names* below are written out literally so  */
/*  the build-time content scanner picks them up even though they're   */
/*  injected via raw HTML strings.)                                    */
/* ------------------------------------------------------------------ */

function popDivIcon(status) {
  const c = STATUS[status]?.color || STATUS.unknown.color;
  return L.divIcon({
    className: 'bg-transparent border-0',
    html: `<div class="flex h-[30px] w-[30px] items-center justify-center rounded-t-lg rounded-b-[3px] bg-gradient-to-br from-teal-500 to-teal-700"
                style="box-shadow:0 0 0 3px #ffffff, 0 0 0 5px ${c}, 0 6px 14px rgba(15,23,42,0.25)">
             <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
               <path d="M6 22V12a6 6 0 0 1 12 0v10"/><path d="M6 22h12"/><circle cx="12" cy="9" r="2" fill="white" stroke="none"/>
             </svg>
           </div>`,
    iconSize: [34, 34],
    iconAnchor: [17, 17],
  });
}

function deviceDivIcon(type, status, selected) {
  const meta = DEVICE_TYPES[type] || DEVICE_TYPES.ont;
  const sc = STATUS[status]?.color || STATUS.unknown.color;
  const scale = selected ? 'transform:scale(1.35);' : '';
  const ring = selected ? '#0f172a' : sc;
  return L.divIcon({
    className: 'bg-transparent border-0',
    html: `<div class="flex h-4 w-4 items-center justify-center rounded-full transition-transform"
                style="background:${meta.color};box-shadow:0 0 0 3px #ffffff, 0 0 0 5px ${ring}, 0 4px 10px rgba(15,23,42,0.25);${scale}">
             <span class="h-[5px] w-[5px] rounded-full bg-white/85"></span>
           </div>`,
    iconSize: [22, 22],
    iconAnchor: [11, 11],
  });
}

/* ------------------------------------------------------------------ */
/* Main component                                                      */
/* ------------------------------------------------------------------ */

export default function NetworkMap({
  api = null,           // optional { fetchAll, createPop, createDevice, createConnection, updateNode, deleteNode, syncStatus }
  routers = [],          // [{ id, name }] e.g. MikroTik routers from your Rails app, for "link to router"
  initialCenter = [-1.2833, 36.8167], // Nairobi
  initialZoom = 12,
  height = '100vh',
}) {
  const mapElRef = useRef(null);
  const mapRef = useRef(null);
  const layerGroupRef = useRef({ base: null, devices: null, links: null });
  const markerIndexRef = useRef(new Map()); // nodeKey -> leaflet marker

  const [basemap, setBasemap] = useState('satellite');
  const [pops, setPops] = useState([]);
  const [devices, setDevices] = useState([]);
  const [connections, setConnections] = useState([]);
  const [selected, setSelected] = useState(null); // { kind: 'pop'|'device'|'connection', id }
  const [placeMode, setPlaceMode] = useState(null); // null | 'pop' | 'device' | 'link'
  const [placeDeviceType, setPlaceDeviceType] = useState('olt');
  const [pendingLatLng, setPendingLatLng] = useState(null);
  const [modal, setModal] = useState(null); // 'pop' | 'device' | 'connection' | null
  const [editing, setEditing] = useState(null); // { kind: 'pop'|'device'|'connection', id } when the open modal is editing an existing item, else null
  const [linkSource, setLinkSource] = useState(null); // { kind, id } first click for connection
  const [hierarchyCollapsed, setHierarchyCollapsed] = useState(false);
  const [legendOpen, setLegendOpen] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [search, setSearch] = useState('');

  /* ---------------- persistence (localStorage fallback) ------------ */

  useEffect(() => {
    if (api?.fetchAll) {
      api.fetchAll().then((data) => {
        setPops(data.pops || []);
        setDevices(data.devices || []);
        setConnections(data.connections || []);
      }).catch(() => {});
      return;
    }
    try {
      const raw = localStorage.getItem('nm_state_v1');
      if (raw) {
        const d = JSON.parse(raw);
        setPops(d.pops || []);
        setDevices(d.devices || []);
        setConnections(d.connections || []);
      }
    } catch {}
  }, [api]);

  useEffect(() => {
    if (api) return; // Rails backend owns persistence in that mode
    localStorage.setItem('nm_state_v1', JSON.stringify({ pops, devices, connections }));
  }, [pops, devices, connections, api]);

  /* ---------------- map init ---------------------------------------- */

  useEffect(() => {
    if (mapRef.current || !mapElRef.current) return;
    const map = L.map(mapElRef.current, {
      center: initialCenter,
      zoom: initialZoom,
      zoomControl: false,
      preferCanvas: true,
    });
    L.control.zoom({ position: 'bottomright' }).addTo(map);
    mapRef.current = map;
    layerGroupRef.current.devices = L.layerGroup().addTo(map);
    layerGroupRef.current.links = L.layerGroup().addTo(map);

    map.on('click', (e) => handleMapClickRef.current?.(e));

    return () => { map.remove(); mapRef.current = null; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ---------------- base layer switching ----------------------------- */

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    if (layerGroupRef.current.base) {
      layerGroupRef.current.base.forEach((l) => map.removeLayer(l));
    }
    const cfg = BASEMAPS[basemap];
    const tileLayers = cfg.layers.map((l) =>
      L.tileLayer(l.url, { attribution: l.attribution, subdomains: l.subdomains || 'abc', maxZoom: 20 }).addTo(map)
    );
    tileLayers.forEach((l) => l.bringToBack());
    layerGroupRef.current.base = tileLayers;
  }, [basemap]);

  /* ---------------- map click => placement / link picking ------------ */

  const [linkMiss, setLinkMiss] = useState(false);
  const linkMissTimerRef = useRef(null);

  const handleMapClickRef = useRef(null);
  handleMapClickRef.current = (e) => {
    if (placeMode === 'pop') {
      setPendingLatLng(e.latlng);
      setModal('pop');
      setPlaceMode(null);
    } else if (placeMode === 'device') {
      setPendingLatLng(e.latlng);
      setModal('device');
      setPlaceMode(null);
    } else if (placeMode === 'link') {
      // BUG FIX: clicking empty map space while in Link mode used to do
      // nothing at all — no feedback, so a missed click (very easy on a
      // small marker) looked identical to a broken modal. Flash the hint
      // bar instead so it's clear the click needs to land on a marker.
      setLinkMiss(true);
      clearTimeout(linkMissTimerRef.current);
      linkMissTimerRef.current = setTimeout(() => setLinkMiss(false), 600);
    }
  };

  /* ---------------- derived lookups ----------------------------------- */

  const allNodes = useMemo(() => {
    const m = new Map();
    pops.forEach((p) => m.set(`pop:${p.id}`, { kind: 'pop', ...p }));
    devices.forEach((d) => m.set(`device:${d.id}`, { kind: 'device', ...d }));
    return m;
  }, [pops, devices]);

  const nodeKey = (kind, id) => `${kind}:${id}`;

  const filteredHierarchy = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return { pops, devices };
    return {
      pops: pops.filter((p) => p.name.toLowerCase().includes(q)),
      devices: devices.filter((d) => d.name.toLowerCase().includes(q)),
    };
  }, [pops, devices, search]);

  /* ---------------- render markers ------------------------------------ */

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const group = layerGroupRef.current.devices;
    group.clearLayers();
    markerIndexRef.current.clear();

    pops.forEach((p) => {
      const marker = L.marker([p.lat, p.lng], { icon: popDivIcon(p.status) }).addTo(group);
      marker.on('click', (ev) => {
        L.DomEvent.stopPropagation(ev);
        onNodeClickedRef.current?.('pop', p.id);
      });
      markerIndexRef.current.set(nodeKey('pop', p.id), marker);
    });

    devices.forEach((d) => {
      const isSel = selected?.kind === 'device' && selected.id === d.id;
      const marker = L.marker([d.lat, d.lng], { icon: deviceDivIcon(d.type, d.status, isSel) }).addTo(group);
      marker.on('click', (ev) => {
        L.DomEvent.stopPropagation(ev);
        onNodeClickedRef.current?.('device', d.id);
      });
      markerIndexRef.current.set(nodeKey('device', d.id), marker);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pops, devices, selected]);

  /* ---------------- render connections --------------------------------- */

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const group = layerGroupRef.current.links;
    group.clearLayers();

    connections.forEach((c) => {
      const source = allNodes.get(nodeKey(c.sourceKind, c.sourceId));
      const target = allNodes.get(nodeKey(c.targetKind, c.targetId));
      if (!source || !target) return;
      const cable = CABLE_TYPES[c.category] || CABLE_TYPES.ether;
      const sColor = c.status && c.status !== 'unknown' ? STATUS[c.status].color : cable.color;
      const path = c.path?.length ? c.path : [[source.lat, source.lng], [target.lat, target.lng]];

      const line = L.polyline(path, {
        color: sColor,
        weight: c.status === 'down' ? 2 : 3,
        opacity: 0.9,
        dashArray: cable.dash,
        className: `nm-link nm-link-${c.category}`,
      }).addTo(group);

      line.on('click', (ev) => {
        L.DomEvent.stopPropagation(ev);
        setSelected({ kind: 'connection', id: c.id });
      });

      if (c.status === 'active' || !c.status) {
        line.on('mouseover', () => line.setStyle({ weight: 5 }));
        line.on('mouseout', () => line.setStyle({ weight: c.status === 'down' ? 2 : 3 }));
      }
    });
  }, [connections, allNodes]);

  /* ---------------- interactions --------------------------------------- */

  function onNodeClicked(kind, id) {
    if (placeMode === 'link') {
      if (!linkSource) {
        setLinkSource({ kind, id });
      } else if (linkSource.kind === kind && linkSource.id === id) {
        setLinkSource(null); // clicked same node, cancel
      } else {
        setModal('connection');
      }
      return;
    }
    setSelected({ kind, id });
  }

  // BUG FIX: the marker click handlers below are attached inside a useEffect
  // that only reruns when [pops, devices, selected] change. Turning on
  // placeMode === 'link' (or setting linkSource) does NOT rerun that effect,
  // so the markers were holding a stale closure over onNodeClicked from an
  // earlier render — one where placeMode was still null. Clicking a marker
  // in Link mode was silently falling through to setSelected(...) instead of
  // registering the link source/target, so the connection modal never
  // opened. Routing every marker click through this always-current ref
  // fixes it without forcing markers to be torn down and rebuilt on every
  // mode change.
  const onNodeClickedRef = useRef(null);
  onNodeClickedRef.current = onNodeClicked;

  function addPop(data) {
    const pop = { id: uid(), status: 'unknown', ...data };
    if (api?.createPop) api.createPop(pop).then((saved) => setPops((p) => [...p, saved]));
    else setPops((p) => [...p, pop]);
    setModal(null);
    setPendingLatLng(null);
  }

  function addDevice(data) {
    const device = { id: uid(), status: 'unknown', ...data };
    if (api?.createDevice) api.createDevice(device).then((saved) => setDevices((d) => [...d, saved]));
    else setDevices((d) => [...d, device]);
    setModal(null);
    setPendingLatLng(null);
  }

  function addConnection(data) {
    const connection = { id: uid(), status: 'unknown', ...data, sourceKind: linkSource.kind, sourceId: linkSource.id };
    if (api?.createConnection) api.createConnection(connection).then((saved) => setConnections((c) => [...c, saved]));
    else setConnections((c) => [...c, connection]);
    setModal(null);
    setLinkSource(null);
    setPlaceMode(null);
  }

  // ---- Editing existing items ----

  function startEdit(kind, id) {
    setEditing({ kind, id });
    setModal(kind);
  }

  function updatePop(id, data) {
    const updated = { ...pops.find((p) => p.id === id), ...data, id };
    if (api?.updateNode) api.updateNode('pop', id, updated).then((saved) => setPops((p) => p.map((x) => (x.id === id ? saved : x)))).catch(() => {});
    else setPops((p) => p.map((x) => (x.id === id ? updated : x)));
    setModal(null);
    setPendingLatLng(null);
    setEditing(null);
    setSelected({ kind: 'pop', id });
  }

  function updateDevice(id, data) {
    const updated = { ...devices.find((d) => d.id === id), ...data, id };
    if (api?.updateNode) api.updateNode('device', id, updated).then((saved) => setDevices((d) => d.map((x) => (x.id === id ? saved : x)))).catch(() => {});
    else setDevices((d) => d.map((x) => (x.id === id ? updated : x)));
    setModal(null);
    setPendingLatLng(null);
    setEditing(null);
    setSelected({ kind: 'device', id });
  }

  function updateConnection(id, data) {
    const existing = connections.find((c) => c.id === id);
    const updated = { ...existing, ...data, id, sourceKind: existing.sourceKind, sourceId: existing.sourceId };
    if (api?.updateNode) api.updateNode('connection', id, updated).then((saved) => setConnections((c) => c.map((x) => (x.id === id ? saved : x)))).catch(() => {});
    else setConnections((c) => c.map((x) => (x.id === id ? updated : x)));
    setModal(null);
    setLinkSource(null);
    setEditing(null);
    setSelected({ kind: 'connection', id });
  }

  function deleteSelected() {
    if (!selected) return;
    const { kind, id } = selected;
    if (api?.deleteNode) api.deleteNode(kind, id).catch(() => {});
    if (kind === 'pop') {
      setPops((p) => p.filter((x) => x.id !== id));
      setConnections((c) => c.filter((x) => !(x.sourceKind === 'pop' && x.sourceId === id) && !(x.targetKind === 'pop' && x.targetId === id)));
    } else if (kind === 'device') {
      setDevices((d) => d.filter((x) => x.id !== id));
      setConnections((c) => c.filter((x) => !(x.sourceKind === 'device' && x.sourceId === id) && !(x.targetKind === 'device' && x.targetId === id)));
    } else if (kind === 'connection') {
      setConnections((c) => c.filter((x) => x.id !== id));
    }
    setSelected(null);
  }

  function focusNode(kind, id) {
    const n = allNodes.get(nodeKey(kind, id));
    if (n && mapRef.current) mapRef.current.setView([n.lat, n.lng], Math.max(mapRef.current.getZoom(), 16), { animate: true });
    setSelected({ kind, id });
  }

  async function handleSync() {
    setSyncing(true);
    try {
      if (api?.syncStatus) {
        const result = await api.syncStatus();
        if (result?.pops) setPops(result.pops);
        if (result?.devices) setDevices(result.devices);
      } else {
        await new Promise((r) => setTimeout(r, 900));
      }
    } finally {
      setSyncing(false);
    }
  }

  const selectedNode = selected?.kind === 'connection'
    ? connections.find((c) => c.id === selected.id)
    : allNodes.get(nodeKey(selected?.kind, selected?.id));

  /* ---------------------------------------------------------------- */

  return (
    <div className="relative w-full overflow-hidden bg-slate-100 font-sans text-slate-900 dark:bg-slate-950 dark:text-slate-100" style={{ height }}>
      {/* Minimal overrides for Leaflet's own DOM (can't take className props) */}
      <style>{`
        .leaflet-container { background: #e2e8f0; font-family: inherit; }
        .dark .leaflet-container { background: #0b1220; }
        .leaflet-control-zoom a { background: #ffffff !important; color: #334155 !important; border-color: rgba(148,163,184,0.35) !important; }
        .leaflet-control-zoom a:hover { background: #f1f5f9 !important; color: #0d9488 !important; }
        .dark .leaflet-control-zoom a { background: #101a2c !important; color: #cbd5e1 !important; border-color: rgba(148,163,184,0.15) !important; }
        .dark .leaflet-control-zoom a:hover { background: #16233b !important; color: #5eead4 !important; }
        .leaflet-control-attribution { font-size: 10px; }
      `}</style>

      <div ref={mapElRef} className="absolute inset-0" />

      {/* Top bar */}
      <div className="absolute left-4 right-4 top-4 z-[600] flex items-center gap-4 rounded-xl border border-slate-200 bg-white/95 px-4 py-2.5 shadow-lg shadow-slate-900/5 backdrop-blur-md dark:border-slate-700/60 dark:bg-slate-900/90 dark:shadow-black/40">
        <div className="flex items-center gap-2 whitespace-nowrap text-sm font-bold tracking-tight">
          <span className="h-2.5 w-2.5 rounded-full bg-teal-500 shadow-[0_0_0_4px_rgba(20,184,166,0.15)]" />
          <span>Network Map</span>
        </div>
        <div className="hidden items-center gap-2 whitespace-nowrap font-mono text-xs text-slate-500 dark:text-slate-400 sm:flex">
          <span>{pops.length} POPs</span>
          <span className="h-[3px] w-[3px] rounded-full bg-slate-300 dark:bg-slate-600" />
          <span>{devices.length} Devices</span>
          <span className="h-[3px] w-[3px] rounded-full bg-slate-300 dark:bg-slate-600" />
          <span>{connections.length} Links</span>
        </div>
        <div className="ml-auto flex items-center gap-2.5">
          <button className={cx(BTN, syncing && 'border-teal-300 text-teal-600 dark:border-teal-600 dark:text-teal-400')} onClick={handleSync} disabled={syncing}>
            <RefreshCw size={15} className={syncing ? 'animate-spin' : ''} /> Sync
          </button>
          <div className="flex overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700">
            <button
              className={cx(
                'flex items-center gap-1.5 border-r border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-500 last:border-r-0 hover:bg-slate-50 hover:text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-100',
                placeMode === 'pop' && 'bg-teal-50 text-teal-600 dark:bg-teal-500/15 dark:text-teal-400'
              )}
              onClick={() => { setPlaceMode(placeMode === 'pop' ? null : 'pop'); setLinkSource(null); }}
            >
              <Building2 size={14} /> POP
            </button>
            <button
              className={cx(
                'flex items-center gap-1.5 border-r border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-500 last:border-r-0 hover:bg-slate-50 hover:text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-100',
                placeMode === 'device' && 'bg-teal-50 text-teal-600 dark:bg-teal-500/15 dark:text-teal-400'
              )}
              onClick={() => { setPlaceMode(placeMode === 'device' ? null : 'device'); setLinkSource(null); }}
            >
              <CircleDot size={14} /> Device
            </button>
            <button
              className={cx(
                'flex items-center gap-1.5 bg-white px-3 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-50 hover:text-slate-800 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-white dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-100 dark:disabled:hover:bg-slate-800',
                placeMode === 'link' && 'bg-teal-50 text-teal-600 dark:bg-teal-500/15 dark:text-teal-400'
              )}
              disabled={pops.length + devices.length < 2}
              title={pops.length + devices.length < 2 ? 'Add at least 2 POPs/devices before creating a link' : 'Draw a connection between two markers'}
              onClick={() => { setPlaceMode(placeMode === 'link' ? null : 'link'); setLinkSource(null); }}
            >
              <Cable size={14} /> Link
            </button>
          </div>
        </div>
      </div>

      {placeMode && (
        <div
          className={cx(
            'absolute left-1/2 top-[68px] z-[600] flex -translate-x-1/2 items-center gap-2.5 whitespace-nowrap rounded-full border px-3.5 py-2 text-xs font-medium shadow-md transition-colors',
            linkMiss
              ? 'border-red-300 bg-red-50 text-red-700 dark:border-red-500/50 dark:bg-red-500/15 dark:text-red-200'
              : 'border-teal-300 bg-teal-50 text-teal-700 dark:border-teal-500/40 dark:bg-teal-500/15 dark:text-teal-200'
          )}
        >
          {linkMiss ? (
            'Missed — click directly on a device or POP marker, not the empty map.'
          ) : (
            <>
              {placeMode === 'pop' && 'Click anywhere on the map to place a POP.'}
              {placeMode === 'device' && (
                <span className="flex items-center gap-1.5">
                  Click a spot to place a
                  <select
                    value={placeDeviceType}
                    onChange={(e) => setPlaceDeviceType(e.target.value)}
                    className="rounded-md border border-teal-300 bg-white px-1.5 py-0.5 text-xs text-slate-800 dark:border-teal-600 dark:bg-slate-900 dark:text-slate-100"
                  >
                    {Object.entries(DEVICE_TYPES).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                  </select>
                </span>
              )}
              {placeMode === 'link' && (linkSource
                ? `Now click a different marker to finish the connection (source: ${allNodes.get(nodeKey(linkSource.kind, linkSource.id))?.name || '…'}).`
                : (pops.length + devices.length < 2
                  ? 'Add at least 2 POPs/devices first — there’s nothing to connect yet.'
                  : 'Click the source device or POP to start a connection.'))}
            </>
          )}
          <button className="flex cursor-pointer border-none bg-transparent text-current opacity-70 hover:opacity-100" onClick={() => { setPlaceMode(null); setLinkSource(null); }}>
            <X size={13} />
          </button>
        </div>
      )}

      {/* Hierarchy panel */}
      <div className={cx(PANEL, 'left-4 top-[76px] flex w-[260px] flex-col', hierarchyCollapsed ? 'max-h-none' : 'max-h-[calc(100vh-220px)]')}>
        <div className={PANEL_HEAD} onClick={() => setHierarchyCollapsed((v) => !v)}>
          {hierarchyCollapsed ? <ChevronRight size={15} /> : <ChevronDown size={15} />}
          <span>Network Hierarchy</span>
        </div>
        {!hierarchyCollapsed && (
          <div className="overflow-y-auto px-3.5 pb-3.5">
            <div className="mb-2.5 flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-slate-400 dark:border-slate-700 dark:bg-slate-950">
              <Search size={13} />
              <input
                placeholder="Filter devices…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full border-none bg-transparent text-xs text-slate-800 outline-none placeholder:text-slate-400 dark:text-slate-100"
              />
            </div>
            {pops.length === 0 ? (
              <div className="px-1 py-4 text-center text-xs text-slate-400">
                <p>No network devices yet.</p>
                <p className="mt-1 text-slate-400">Add a central location (POP) to get started.</p>
              </div>
            ) : (
              <ul className="m-0 list-none p-0">
                {filteredHierarchy.pops.map((p) => (
                  <li key={p.id}>
                    <button
                      className={cx(
                        'flex w-full cursor-pointer items-center gap-2 rounded-md border-none bg-transparent px-2 py-1.5 text-left text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800',
                        selected?.kind === 'pop' && selected.id === p.id && 'bg-teal-50 text-teal-600 dark:bg-teal-500/15 dark:text-teal-400'
                      )}
                      onClick={() => focusNode('pop', p.id)}
                    >
                      <Building2 size={14} style={{ color: STATUS[p.status]?.color }} />
                      <span>{p.name}</span>
                    </button>
                    <ul className="my-0.5 ml-3.5 list-none border-l border-dashed border-slate-200 pl-2.5 dark:border-slate-700">
                      {devices.filter((d) => d.parentId === p.id).map((d) => (
                        <li key={d.id}>
                          <button
                            className={cx(
                              'flex w-full cursor-pointer items-center gap-2 rounded-md border-none bg-transparent px-2 py-1.5 text-left text-xs text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800',
                              selected?.kind === 'device' && selected.id === d.id && 'bg-teal-50 text-teal-600 dark:bg-teal-500/15 dark:text-teal-400'
                            )}
                            onClick={() => focusNode('device', d.id)}
                          >
                            <span className="h-[7px] w-[7px] shrink-0 rounded-full" style={{ background: DEVICE_TYPES[d.type]?.color }} />
                            <span>{d.name}</span>
                            <span className="ml-auto font-mono text-[10.5px] text-slate-400">{DEVICE_TYPES[d.type]?.label}</span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
                {filteredHierarchy.devices.filter((d) => !d.parentId).map((d) => (
                  <li key={d.id}>
                    <button
                      className={cx(
                        'flex w-full cursor-pointer items-center gap-2 rounded-md border-none bg-transparent px-2 py-1.5 text-left text-xs text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800',
                        selected?.kind === 'device' && selected.id === d.id && 'bg-teal-50 text-teal-600 dark:bg-teal-500/15 dark:text-teal-400'
                      )}
                      onClick={() => focusNode('device', d.id)}
                    >
                      <span className="h-[7px] w-[7px] shrink-0 rounded-full" style={{ background: DEVICE_TYPES[d.type]?.color }} />
                      <span>{d.name}</span>
                      <span className="ml-auto font-mono text-[10.5px] text-slate-400">{DEVICE_TYPES[d.type]?.label}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>

      {/* Basemap switcher */}
      <div className={cx(PANEL, 'bottom-6 left-4 flex items-center gap-1.5 p-1.5 text-slate-400')}>
        <Layers size={13} />
        {Object.entries(BASEMAPS).map(([k, v]) => (
          <button
            key={k}
            className={cx(
              'rounded-md border-none bg-transparent px-3 py-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100',
              basemap === k && 'bg-teal-50 text-teal-600 dark:bg-teal-500/15 dark:text-teal-400'
            )}
            onClick={() => setBasemap(k)}
          >
            {v.label}
          </button>
        ))}
      </div>

      {/* Legend */}
      <div className={cx(PANEL, 'right-4 top-[76px] w-[200px]')}>
        <div className={PANEL_HEAD} onClick={() => setLegendOpen((v) => !v)}>
          {legendOpen ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
          <span>Legend</span>
        </div>
        {legendOpen && (
          <div className="flex flex-col gap-3.5 px-3.5 pb-3.5">
            <div>
              <h4 className="mb-1.5 text-[10px] font-bold uppercase tracking-wide text-slate-400 dark:text-slate-500">Devices</h4>
              <div className="flex items-center gap-2 py-0.5 text-xs text-slate-700 dark:text-slate-200">
                <span className="h-2.5 w-2.5 shrink-0 rounded-t-sm rounded-b-none bg-teal-500" /> Central (POP/NOC)
              </div>
              {Object.entries(DEVICE_TYPES).map(([k, v]) => (
                <div className="flex items-center gap-2 py-0.5 text-xs text-slate-700 dark:text-slate-200" key={k}>
                  <span className="h-2.5 w-2.5 shrink-0 rounded-sm" style={{ background: v.color }} /> {v.label}
                </div>
              ))}
            </div>
            <div>
              <h4 className="mb-1.5 text-[10px] font-bold uppercase tracking-wide text-slate-400 dark:text-slate-500">Cable Types</h4>
              {Object.entries(CABLE_TYPES).map(([k, v]) => (
                <div className="flex items-center gap-2 py-0.5 text-xs text-slate-700 dark:text-slate-200" key={k}>
                  <span
                    className="h-[3px] w-[18px] shrink-0 rounded"
                    style={{
                      background: v.color,
                      backgroundImage: v.dash ? `repeating-linear-gradient(90deg, ${v.color} 0 6px, transparent 6px 10px)` : 'none',
                    }}
                  />
                  {v.label}
                </div>
              ))}
            </div>
            <div>
              <h4 className="mb-1.5 text-[10px] font-bold uppercase tracking-wide text-slate-400 dark:text-slate-500">Status</h4>
              {Object.entries(STATUS).map(([k, v]) => (
                <div className="flex items-center gap-2 py-0.5 text-xs text-slate-700 dark:text-slate-200" key={k}>
                  <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: v.color }} /> {v.label}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Selected node inspector */}
      {selectedNode && (
        <div className={cx(PANEL, 'bottom-6 right-4 w-[260px]')}>
          <div className="flex items-center justify-between border-b border-slate-200 px-3.5 py-3 text-sm dark:border-slate-700">
            <strong>{selectedNode.name || `${CABLE_TYPES[selectedNode.category]?.label || 'Connection'}`}</strong>
            <button className="border-none bg-transparent text-slate-400 hover:text-slate-700 dark:hover:text-slate-200" onClick={() => setSelected(null)}>
              <X size={14} />
            </button>
          </div>
          <div className="flex flex-col gap-2 px-3.5 py-2.5">
            {selected.kind !== 'connection' ? (
              <>
                <div className="flex justify-between gap-2.5 text-xs">
                  <span className="text-slate-400">Type</span>
                  <span className="font-mono text-slate-800 dark:text-slate-100">{selected.kind === 'pop' ? 'Central Location' : DEVICE_TYPES[selectedNode.type]?.full}</span>
                </div>
                <div className="flex justify-between gap-2.5 text-xs">
                  <span className="text-slate-400">Status</span>
                  <span
                    className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-semibold"
                    style={{ color: STATUS[selectedNode.status]?.color, backgroundColor: `${STATUS[selectedNode.status]?.color}20` }}
                  >
                    <span className="h-1.5 w-1.5 rounded-full" style={{ background: STATUS[selectedNode.status]?.color }} />
                    {STATUS[selectedNode.status]?.label}
                  </span>
                </div>
                <div className="flex justify-between gap-2.5 text-xs">
                  <span className="text-slate-400">Location</span>
                  <span className="font-mono text-slate-800 dark:text-slate-100">{Number(selectedNode.lat).toFixed(6)}, {Number(selectedNode.lng).toFixed(6)}</span>
                </div>
                {selectedNode.address && (
                  <div className="flex justify-between gap-2.5 text-xs">
                    <span className="text-slate-400">Address</span>
                    <span className="font-mono text-slate-800 dark:text-slate-100">{selectedNode.address}</span>
                  </div>
                )}
              </>
            ) : (
              <>
                <div className="flex justify-between gap-2.5 text-xs">
                  <span className="text-slate-400">Cable</span>
                  <span className="font-mono text-slate-800 dark:text-slate-100">{CABLE_TYPES[selectedNode.category]?.label}</span>
                </div>
                {selectedNode.bandwidthMbps && (
                  <div className="flex justify-between gap-2.5 text-xs">
                    <span className="text-slate-400">Bandwidth</span>
                    <span className="font-mono text-slate-800 dark:text-slate-100">{selectedNode.bandwidthMbps} Mbps</span>
                  </div>
                )}
                {selectedNode.distanceM && (
                  <div className="flex justify-between gap-2.5 text-xs">
                    <span className="text-slate-400">Distance</span>
                    <span className="font-mono text-slate-800 dark:text-slate-100">{selectedNode.distanceM} m</span>
                  </div>
                )}
                <div className="flex justify-between gap-2.5 text-xs">
                  <span className="text-slate-400">Status</span>
                  <span
                    className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-semibold"
                    style={{
                      color: STATUS[selectedNode.status || 'unknown']?.color,
                      backgroundColor: `${STATUS[selectedNode.status || 'unknown']?.color}20`,
                    }}
                  >
                    <span className="h-1.5 w-1.5 rounded-full" style={{ background: STATUS[selectedNode.status || 'unknown']?.color }} />
                    {STATUS[selectedNode.status || 'unknown']?.label}
                  </span>
                </div>
              </>
            )}
          </div>
          <div className="flex gap-2 border-t border-slate-200 px-3.5 py-2.5 dark:border-slate-700">
            <button className={BTN} onClick={() => startEdit(selected.kind, selected.id)}>
              <Pencil size={14} /> Edit
            </button>
            <button className={cx(BTN, BTN_DANGER)} onClick={deleteSelected}>
              <Trash2 size={14} /> Delete
            </button>
          </div>
        </div>
      )}

      {/* Modals */}
      {modal === 'pop' && (
        <PopModal
          latLng={pendingLatLng}
          routers={routers}
          initial={editing?.kind === 'pop' ? pops.find((p) => p.id === editing.id) : null}
          onCancel={() => { setModal(null); setPendingLatLng(null); setEditing(null); }}
          onSave={(data) => (editing ? updatePop(editing.id, data) : addPop(data))}
        />
      )}
      {modal === 'device' && (
        <DeviceModal
          latLng={pendingLatLng}
          defaultType={placeDeviceType}
          routers={routers}
          initial={editing?.kind === 'device' ? devices.find((d) => d.id === editing.id) : null}
          onCancel={() => { setModal(null); setPendingLatLng(null); setEditing(null); }}
          onSave={(data) => (editing ? updateDevice(editing.id, data) : addDevice(data))}
        />
      )}
      {modal === 'connection' && (linkSource || editing?.kind === 'connection') && (
        <ConnectionModal
          source={
            editing?.kind === 'connection'
              ? (() => {
                  const c = connections.find((x) => x.id === editing.id);
                  return { kind: c.sourceKind, id: c.sourceId, node: allNodes.get(nodeKey(c.sourceKind, c.sourceId)) };
                })()
              : { ...linkSource, node: allNodes.get(nodeKey(linkSource.kind, linkSource.id)) }
          }
          initial={editing?.kind === 'connection' ? connections.find((c) => c.id === editing.id) : null}
          devices={devices}
          pops={pops}
          onCancel={() => { setModal(null); setLinkSource(null); setEditing(null); }}
          onSave={(data) => (editing ? updateConnection(editing.id, data) : addConnection(data))}
        />
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Modals                                                              */
/* ------------------------------------------------------------------ */

function ModalShell({ title, subtitle, onCancel, children, wide }) {
  // BUG FIX: previously the backdrop closed on *any* bubbled click, and
  // relied only on the modal card calling stopPropagation. That's fragile
  // (any missed stopPropagation, or a click that starts on the card and
  // ends on the backdrop, closed the modal unexpectedly). Now the backdrop
  // only closes when the click's target *is* the backdrop itself.
  return (
    <div
      className="fixed inset-0 z-[2000] flex items-center justify-center bg-slate-900/40 p-6 backdrop-blur-sm dark:bg-black/70"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onCancel();
      }}
    >
      <div
        className={cx(
          'max-h-[88vh] w-[420px] max-w-full overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900',
          wide && 'w-[480px]'
        )}
      >
        <div className="flex items-start justify-between border-b border-slate-100 px-5 pb-3.5 pt-5 dark:border-slate-800">
          <div>
            <h3 className="m-0 mb-1 text-[15.5px] font-semibold text-slate-900 dark:text-slate-100">{title}</h3>
            {subtitle && <p className="m-0 max-w-[340px] text-xs leading-relaxed text-slate-500 dark:text-slate-400">{subtitle}</p>}
          </div>
          <button className="border-none bg-transparent text-slate-400 hover:text-slate-700 dark:hover:text-slate-200" onClick={onCancel}>
            <X size={16} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Field({ label, required, error, children }) {
  return (
    <label className="flex flex-col gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
      <span>{label}{required && <em className="ml-0.5 text-red-500 not-italic">*</em>}</span>
      {children}
      {error && <small className="text-red-500">{error}</small>}
    </label>
  );
}

function PopModal({ latLng, routers, initial, onCancel, onSave }) {
  const isEditing = !!initial;
  const [form, setForm] = useState({
    name: initial?.name ?? '',
    lat: initial?.lat ?? (latLng?.lat ?? ''),
    lng: initial?.lng ?? (latLng?.lng ?? ''),
    address: initial?.address ?? '',
    routerId: initial?.routerId ?? '',
    status: initial?.status ?? 'active',
    description: initial?.description ?? '',
  });
  const [errors, setErrors] = useState({});

  function set(k, v) { setForm((f) => ({ ...f, [k]: v })); }

  function submit() {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (form.lat === '' || Math.abs(form.lat) > 90) errs.lat = 'Valid latitude is required (-90 to 90)';
    if (form.lng === '' || Math.abs(form.lng) > 180) errs.lng = 'Valid longitude is required (-180 to 180)';
    setErrors(errs);
    if (Object.keys(errs).length) return;
    onSave({ ...form, lat: Number(form.lat), lng: Number(form.lng) });
  }

  return (
    <ModalShell
      title={isEditing ? 'Edit Central Location (POP/NOC)' : 'Add Central Location (POP/NOC)'}
      subtitle={isEditing ? 'Update this Point of Presence or Network Operations Center.' : 'Add a new Point of Presence or Network Operations Center. This becomes the root node for your network topology.'}
      onCancel={onCancel}
    >
      <div className="flex flex-col gap-3.5 p-5">
        <Field label="Name" required error={errors.name}>
          <input className={FIELD_INPUT} value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="e.g. Westlands POP" />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Latitude" required error={errors.lat}>
            <input className={FIELD_INPUT} type="number" step="any" value={form.lat} onChange={(e) => set('lat', e.target.value)} />
          </Field>
          <Field label="Longitude" required error={errors.lng}>
            <input className={FIELD_INPUT} type="number" step="any" value={form.lng} onChange={(e) => set('lng', e.target.value)} />
          </Field>
        </div>
        <Field label="Address">
          <input className={FIELD_INPUT} value={form.address} onChange={(e) => set('address', e.target.value)} />
        </Field>
        <Field label="Link to Router (for status monitoring)">
          <select className={FIELD_INPUT} value={form.routerId} onChange={(e) => set('routerId', e.target.value)}>
            <option value="">None</option>
            {routers.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
          </select>
          <small className="text-slate-400">Link a MikroTik router to sync location status automatically.</small>
        </Field>
        <Field label="Status">
          <select className={FIELD_INPUT} value={form.status} onChange={(e) => set('status', e.target.value)}>
            {Object.entries(STATUS).filter(([k]) => k !== 'degraded').map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
        </Field>
        <Field label="Description">
          <textarea className={FIELD_INPUT} rows={2} value={form.description} onChange={(e) => set('description', e.target.value)} />
        </Field>
      </div>
      <div className="flex justify-end gap-2.5 border-t border-slate-100 px-5 py-3.5 dark:border-slate-800">
        <button className={cx(BTN, BTN_GHOST)} onClick={onCancel}>Cancel</button>
        <button className={cx(BTN, BTN_PRIMARY)} onClick={submit}>
          {isEditing ? <Pencil size={14} /> : <Plus size={14} />} {isEditing ? 'Save Changes' : 'Add POP'}
        </button>
      </div>
    </ModalShell>
  );
}

function DeviceModal({ latLng, defaultType, routers, initial, onCancel, onSave }) {
  const isEditing = !!initial;
  const [form, setForm] = useState({
    type: initial?.type ?? (defaultType || 'olt'),
    name: initial?.name ?? '',
    identifier: initial?.identifier ?? '',
    lat: initial?.lat ?? (latLng?.lat ?? ''),
    lng: initial?.lng ?? (latLng?.lng ?? ''),
    address: initial?.address ?? '',
    routerId: initial?.routerId ?? '',
    status: initial?.status ?? 'unknown',
    description: initial?.description ?? '',
  });
  const [errors, setErrors] = useState({});
  function set(k, v) { setForm((f) => ({ ...f, [k]: v })); }

  function submit() {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (form.lat === '' || Math.abs(form.lat) > 90) errs.lat = 'Valid latitude is required (-90 to 90)';
    if (form.lng === '' || Math.abs(form.lng) > 180) errs.lng = 'Valid longitude is required (-180 to 180)';
    setErrors(errs);
    if (Object.keys(errs).length) return;
    onSave({ ...form, lat: Number(form.lat), lng: Number(form.lng) });
  }

  return (
    <ModalShell
      title={isEditing ? 'Edit Network Device' : 'Add Network Device'}
      subtitle={isEditing ? 'Update this device\u2019s details.' : 'Add a new device to your network infrastructure map.'}
      onCancel={onCancel}
    >
      <div className="flex flex-col gap-3.5 p-5">
        <Field label="Device Type" required>
          <select className={FIELD_INPUT} value={form.type} onChange={(e) => set('type', e.target.value)}>
            {Object.entries(DEVICE_TYPES).map(([k, v]) => <option key={k} value={k}>{v.label} - {v.full}</option>)}
          </select>
        </Field>
        <Field label="Name" required error={errors.name}>
          <input className={FIELD_INPUT} value={form.name} onChange={(e) => set('name', e.target.value)} />
        </Field>
        <Field label="Identifier (Serial/MAC)">
          <input className={FIELD_INPUT} value={form.identifier} onChange={(e) => set('identifier', e.target.value)} />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Latitude" required error={errors.lat}>
            <input className={FIELD_INPUT} type="number" step="any" value={form.lat} onChange={(e) => set('lat', e.target.value)} />
          </Field>
          <Field label="Longitude" required error={errors.lng}>
            <input className={FIELD_INPUT} type="number" step="any" value={form.lng} onChange={(e) => set('lng', e.target.value)} />
          </Field>
        </div>
        <Field label="Address">
          <input className={FIELD_INPUT} value={form.address} onChange={(e) => set('address', e.target.value)} />
        </Field>
        <Field label="Link to Router (for status monitoring)">
          <select className={FIELD_INPUT} value={form.routerId} onChange={(e) => set('routerId', e.target.value)}>
            <option value="">None</option>
            {routers.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
          </select>
          <small className="text-slate-400">Link a MikroTik router to sync device status automatically.</small>
        </Field>
        <Field label={isEditing ? 'Status' : 'Initial Status'}>
          <select className={FIELD_INPUT} value={form.status} onChange={(e) => set('status', e.target.value)}>
            {Object.entries(STATUS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
        </Field>
        <Field label="Description">
          <textarea className={FIELD_INPUT} rows={2} value={form.description} onChange={(e) => set('description', e.target.value)} />
        </Field>
      </div>
      <div className="flex justify-end gap-2.5 border-t border-slate-100 px-5 py-3.5 dark:border-slate-800">
        <button className={cx(BTN, BTN_GHOST)} onClick={onCancel}>Cancel</button>
        <button className={cx(BTN, BTN_PRIMARY)} onClick={submit}>
          {isEditing ? <Pencil size={14} /> : <Plus size={14} />} {isEditing ? 'Save Changes' : 'Add Device'}
        </button>
      </div>
    </ModalShell>
  );
}

function ConnectionModal({ source, devices, pops, initial, onCancel, onSave }) {
  const isEditing = !!initial;
  const [category, setCategory] = useState(initial?.category ?? 'adss');
  const [adssCore, setAdssCore] = useState(() => {
    const m = initial?.cableType?.match(/ADSS (\d+) Core/);
    return m ? m[1] : '12';
  });
  const [targetCategory, setTargetCategory] = useState('any');
  const [targetKey, setTargetKey] = useState(initial ? `${initial.targetKind}:${initial.targetId}` : '');
  const [label, setLabel] = useState(initial?.label ?? '');
  const [bandwidth, setBandwidth] = useState(initial?.bandwidthMbps != null ? String(initial.bandwidthMbps) : '');
  const [distance, setDistance] = useState(initial?.distanceM != null ? String(initial.distanceM) : '');
  const [status, setStatus] = useState(initial?.status ?? 'unknown');
  const [error, setError] = useState('');

  const targets = useMemo(() => {
    const list = [
      ...pops.filter((p) => !(source.kind === 'pop' && p.id === source.id)).map((p) => ({ key: `pop:${p.id}`, kind: 'pop', id: p.id, label: `${p.name} (POP)` })),
      ...devices
        .filter((d) => !(source.kind === 'device' && d.id === source.id))
        .filter((d) => targetCategory === 'any' || d.type === targetCategory)
        .map((d) => ({ key: `device:${d.id}`, kind: 'device', id: d.id, label: `${d.name} (${DEVICE_TYPES[d.type]?.label})` })),
    ];
    return list;
  }, [pops, devices, targetCategory, source]);

  function submit() {
    if (!targetKey) { setError('Choose a target device'); return; }
    const [kind, id] = targetKey.split(':');
    onSave({
      category,
      cableType: category === 'adss' ? `ADSS ${adssCore} Core` : CABLE_TYPES[category]?.label,
      label, bandwidthMbps: bandwidth ? Number(bandwidth) : null,
      distanceM: distance ? Number(distance) : null,
      status, targetKind: kind, targetId: id,
    });
  }

  return (
    <ModalShell
      wide
      title={isEditing ? 'Edit Network Connection' : 'Add Network Connection'}
      subtitle={isEditing ? 'Update this cable\u2019s details. The source end stays fixed \u2014 change the target below if needed.' : 'Create a connection between two network points. Source is the node you clicked on the map.'}
      onCancel={onCancel}
    >
      <div className="flex flex-col gap-3.5 p-5">
        <Field label="Source">
          <input className={FIELD_INPUT} disabled value={source.node?.name || ''} />
        </Field>
        <Field label="Category" required>
          <select className={FIELD_INPUT} value={category} onChange={(e) => setCategory(e.target.value)}>
            {Object.entries(CABLE_TYPES).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
        </Field>
        {category === 'adss' && (
          <Field label="ADSS Core Count">
            <select className={FIELD_INPUT} value={adssCore} onChange={(e) => setAdssCore(e.target.value)}>
              {ADSS_CORES.map((c) => <option key={c} value={c}>ADSS {c} Core</option>)}
            </select>
          </Field>
        )}
        <Field label="Target Category (filter)">
          <select className={FIELD_INPUT} value={targetCategory} onChange={(e) => { setTargetCategory(e.target.value); setTargetKey(''); }}>
            <option value="any">All devices</option>
            {Object.entries(DEVICE_TYPES).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
        </Field>
        <Field label="Target Device / POP" required error={error}>
          <select className={FIELD_INPUT} value={targetKey} onChange={(e) => { setTargetKey(e.target.value); setError(''); }}>
            <option value="">Select target…</option>
            {targets.map((t) => <option key={t.key} value={t.key}>{t.label}</option>)}
          </select>
        </Field>
        <Field label="Cable Label">
          <input className={FIELD_INPUT} value={label} onChange={(e) => setLabel(e.target.value)} />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Bandwidth (Mbps)">
            <input className={FIELD_INPUT} type="number" value={bandwidth} onChange={(e) => setBandwidth(e.target.value)} />
          </Field>
          <Field label="Distance (m)">
            <input className={FIELD_INPUT} type="number" value={distance} onChange={(e) => setDistance(e.target.value)} />
          </Field>
        </div>
        <Field label="Status">
          <select className={FIELD_INPUT} value={status} onChange={(e) => setStatus(e.target.value)}>
            {Object.entries(STATUS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
        </Field>
      </div>
      <div className="flex justify-end gap-2.5 border-t border-slate-100 px-5 py-3.5 dark:border-slate-800">
        <button className={cx(BTN, BTN_GHOST)} onClick={onCancel}>Cancel</button>
        <button className={cx(BTN, BTN_PRIMARY)} onClick={submit}>
          {isEditing ? <Pencil size={14} /> : <Plus size={14} />} {isEditing ? 'Save Changes' : 'Add Connection'}
        </button>
      </div>
    </ModalShell>
  );
}

/* ------------------------------------------------------------------ *
 * Expected Rails API shape (pass as the `api` prop):
 *
 * const api = {
 *   fetchAll: () => fetch('/network_map.json').then(r => r.json()),
 *   createPop: (pop) => fetch('/pops', { method: 'POST', ... }).then(r => r.json()),
 *   createDevice: (device) => fetch('/network_devices', { method: 'POST', ... }).then(r => r.json()),
 *   createConnection: (conn) => fetch('/network_connections', { method: 'POST', ... }).then(r => r.json()),
 *   updateNode: (kind, id, data) => fetch(`/${kind}s/${id}`, { method: 'PATCH', body: JSON.stringify(data), ... }).then(r => r.json()),
 *   deleteNode: (kind, id) => fetch(`/${kind}s/${id}`, { method: 'DELETE' }),
 *   syncStatus: () => fetch('/network_map/sync', { method: 'POST' }).then(r => r.json()),
 * };
 *
 * <NetworkMap api={api} routers={mikrotikRouters} />
 *
 * Dark mode: this component uses Tailwind's `dark:` variant and is LIGHT
 * by default. Make sure your tailwind.config.js has `darkMode: 'class'`,
 * then toggle a `dark` class on <html> (or any ancestor) to switch themes.
 * ------------------------------------------------------------------ */