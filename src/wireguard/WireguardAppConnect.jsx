
import { useState, useRef, useCallback, useEffect, useLayoutEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import RefreshIcon from '@mui/icons-material/Refresh';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DownloadIcon from '@mui/icons-material/Download';
import AppleIcon from '@mui/icons-material/Apple';
import AndroidIcon from '@mui/icons-material/Android';
import DesktopWindowsIcon from '@mui/icons-material/DesktopWindows';
import LaptopMacIcon from '@mui/icons-material/LaptopMac';
import TerminalIcon from '@mui/icons-material/Terminal';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap');

  .wgac-root * { box-sizing: border-box; }
  .wgac-root   { font-family: 'DM Sans', sans-serif; }
  .wgac-mono   { font-family: 'JetBrains Mono', monospace; }

  @keyframes wgac-spin { to { transform: rotate(360deg); } }
  @keyframes wgac-glow { from { box-shadow: 0 0 0 rgba(99,102,241,0); } to { box-shadow: 0 0 24px rgba(99,102,241,.22); } }

  .wgac-card {
    background: #fff; border: 1px solid #e5e7eb; border-radius: 16px;
    box-shadow: 0 4px 24px rgba(0,0,0,.06);
  }
  .wgac-tab {
    display:flex; align-items:center; gap:6px; padding:8px 14px;
    border-radius: 10px; border: 1.5px solid #e5e7eb; background:#fff;
    color:#6b7280; font-size:13px; font-weight:600; cursor:pointer;
    transition: all .15s; white-space: nowrap;
  }
  .wgac-tab.active { background:#eef2ff; border-color:#6366f1; color:#4f46e5; }
  .wgac-tab:hover:not(.active) { border-color:#d1d5db; color:#374151; }

  .wgac-btn-primary {
    display:inline-flex; align-items:center; gap:8px; padding:11px 22px;
    background:linear-gradient(135deg,#6366f1,#4f46e5); color:#fff;
    border:none; border-radius:10px; font-size:14px; font-weight:600;
    cursor:pointer; transition: transform .15s, box-shadow .15s; font-family:'DM Sans',sans-serif;
  }
  .wgac-btn-primary:hover:not(:disabled) { transform:translateY(-1px); box-shadow:0 8px 24px rgba(99,102,241,.3); }
  .wgac-btn-primary:disabled { opacity:.5; cursor:not-allowed; }
  .wgac-btn-ghost {
    display:inline-flex; align-items:center; gap:6px; padding:9px 16px;
    background:transparent; color:#6b7280; border:1.5px solid #e5e7eb;
    border-radius:10px; font-size:13px; font-weight:500; cursor:pointer;
    transition: all .15s; font-family:'DM Sans',sans-serif;
  }
  .wgac-btn-ghost:hover { border-color:#d1d5db; color:#374151; background:#f9fafb; }
`;

const PLATFORMS = [
  {
    id: 'ios',
    label: 'iPhone / iPad',
    icon: AppleIcon,
    downloadLabel: 'Get it on the App Store',
    downloadUrl: 'https://apps.apple.com/us/app/wireguard/id1441195209',
    canScan: true,
    steps: [
      'Install "WireGuard" from the App Store.',
      'Open the app and tap the + button in the top right.',
      'Choose "Create from QR Code" and point your camera at the QR code on the right.',
      'Give the tunnel a name if it asks, then tap "Save" (top right).',
      'Flip the switch next to the tunnel to ON to connect.',
    ],
  },
  {
    id: 'android',
    label: 'Android',
    icon: AndroidIcon,
    downloadLabel: 'Get it on Google Play',
    downloadUrl: 'https://play.google.com/store/apps/details?id=com.wireguard.android',
    canScan: true,
    steps: [
      'Install "WireGuard" from Google Play.',
      'Open the app and tap the + button in the bottom right.',
      'Choose "Scan from QR code" and scan the QR code on the right.',
      'Name the tunnel if prompted, then confirm.',
      'Tap the tunnel switch to connect.',
    ],
  },
  {
    id: 'windows',
    label: 'Windows',
    icon: DesktopWindowsIcon,
    downloadLabel: 'Download for Windows',
    downloadUrl: 'https://www.wireguard.com/install/',
    canScan: false,
    steps: [
      'Download and install WireGuard for Windows from the link above.',
      'Download the .conf file below — Windows can\'t scan the QR code, only mobile apps can.',
      'Open WireGuard, click "Import tunnel(s) from file…" and select the downloaded .conf file.',
      'Select the tunnel in the list and click "Activate".',
    ],
  },
  {
    id: 'macos',
    label: 'macOS',
    icon: LaptopMacIcon,
    downloadLabel: 'Get it on the Mac App Store',
    downloadUrl: 'https://apps.apple.com/us/app/wireguard/id1451685025',
    canScan: false,
    steps: [
      'Install "WireGuard" from the Mac App Store.',
      'Download the .conf file below.',
      'Open WireGuard, click "Import tunnel(s) from file…" and select the .conf file.',
      'Select the tunnel and click "Activate".',
    ],
  },
  {
    id: 'linux',
    label: 'Linux',
    icon: TerminalIcon,
    downloadLabel: 'Install instructions (wireguard.com)',
    downloadUrl: 'https://www.wireguard.com/install/',
    canScan: false,
    steps: [
      'Install wireguard-tools with your package manager, e.g. sudo apt install wireguard.',
      'Download the .conf file below and save it as /etc/wireguard/wg0.conf (root-owned, mode 600).',
      'Bring the tunnel up: sudo wg-quick up wg0',
      'Disconnect any time with: sudo wg-quick down wg0',
    ],
  },
];

function useCopy() {
  const [copied, setCopied] = useState('');
  const copy = useCallback((text, key = 'default') => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(key);
      setTimeout(() => setCopied(''), 2000);
    });
  }, []);
  return { copied, copy };
}

export default function WireguardAppConnect() {
  const subdomain = window.location.hostname.split('.')[0];
  const { copied, copy } = useCopy();

  const [platform, setPlatform] = useState('ios');
  const [loading, setLoading] = useState(false);
  const [conn, setConn] = useState(null); // { random_ip, public_key, client_config, qr_code_data_url }

  const [polling, setPolling] = useState(false);
  const [tunnelUp, setTunnelUp] = useState(false);
  const [pollCount, setPollCount] = useState(0);
  const pollRef = useRef(null);

  const stopPolling = useCallback(() => {
    if (pollRef.current) clearInterval(pollRef.current);
    pollRef.current = null;
    setPolling(false);
  }, []);

  const startPolling = useCallback((publicKey) => {
    stopPolling();
    setTunnelUp(false);
    setPollCount(0);
    setPolling(true);
    let count = 0;
    pollRef.current = setInterval(async () => {
      count += 1;
      setPollCount(count);
      try {
        const res = await fetch(`/api/wireguard/check_peer?public_key=${encodeURIComponent(publicKey)}`, {
          headers: { 'X-Subdomain': subdomain },
        });
        const data = await res.json();
        if (data.connected) {
          stopPolling();
          setTunnelUp(true);
          toast.success('Your device is connected to the VPN!');
        }
      } catch (_) { /* keep polling */ }
      if (count >= 24) stopPolling(); // ~2 minutes
    }, 5000);
  }, [subdomain, stopPolling]);

  useEffect(() => () => stopPolling(), [stopPolling]);

  const generate = async () => {
    if (conn && !window.confirm('This creates a new tunnel key and replaces the current QR code. Continue?')) {
      return;
    }
    setLoading(true);
    stopPolling();
    setTunnelUp(false);
    try {
      const res = await fetch('/api/wireguard/generate_wireguard_app_config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Subdomain': subdomain },
        body: JSON.stringify({}),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || 'Failed to generate connection');
        return;
      }
      setConn(data);
      toast.success('Ready — scan the QR code or download the config below');
      if (data.public_key) startPolling(data.public_key);
    } catch (e) {
      toast.error('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const downloadConf = () => {
    if (!conn?.client_config) return;
    const blob = new Blob([conn.client_config], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `owitech-vpn-${conn.random_ip}.conf`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  useLayoutEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = CSS;
    document.head.appendChild(style);
    return () => style.remove();
  }, []);

  const active = PLATFORMS.find(p => p.id === platform);

  return (
    <div className="wgac-root">
      <Toaster position="top-right" toastOptions={{ style: { fontFamily: 'DM Sans,sans-serif', fontSize: 13 } }} />

      <div className="wgac-card" style={{ padding: '28px 32px' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 22 }}>
          <div style={{ width: 38, height: 38, borderRadius: 10, background: 'rgba(99,102,241,.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ShieldOutlinedIcon style={{ fontSize: 18, color: '#6366f1' }} />
          </div>
          <div>
            <h2 style={{ fontSize: 17, fontWeight: 700, color: '#111827', margin: 0 }}>Connect Your Device via WireGuard App</h2>
            <p style={{ fontSize: 12, color: '#9ca3af', margin: 0 }}>Your own phone or computer — separate from MikroTik router setup below</p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8, padding: '10px 14px', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 10, marginBottom: 24 }}>
          <InfoOutlinedIcon style={{ fontSize: 16, color: '#2563eb', flexShrink: 0, marginTop: 1 }} />
          <p style={{ fontSize: 12, color: '#1e40af', margin: 0, lineHeight: 1.5 }}>
            This gives your device its own tunnel into the network. It doesn't touch or depend on any
            router onboarding — generate it whenever you need it.
          </p>
        </div>

        {/* Platform tabs */}
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', marginBottom: 20, paddingBottom: 2 }}>
          {PLATFORMS.map(p => {
            const Icon = p.icon;
            return (
              <button key={p.id} className={`wgac-tab ${platform === p.id ? 'active' : ''}`} onClick={() => setPlatform(p.id)}>
                <Icon style={{ fontSize: 16 }} /> {p.label}
              </button>
            );
          })}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 28 }}>
          {/* Left: instructions */}
          <div>
            <a href={active.downloadUrl} target="_blank" rel="noreferrer"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 600, color: '#4f46e5', textDecoration: 'none', marginBottom: 16 }}>
              <DownloadIcon style={{ fontSize: 16 }} /> {active.downloadLabel} <OpenInNewIcon style={{ fontSize: 13 }} />
            </a>

            <ol style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {active.steps.map((step, i) => (
                <li key={i} style={{ fontSize: 13, color: '#374151', lineHeight: 1.6 }}>{step}</li>
              ))}
            </ol>

            {!active.canScan && (
              <div style={{ display: 'flex', gap: 8, padding: '10px 14px', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 10, marginTop: 16 }}>
                <InfoOutlinedIcon style={{ fontSize: 15, color: '#d97706', flexShrink: 0, marginTop: 1 }} />
                <p style={{ fontSize: 11.5, color: '#92400e', margin: 0, lineHeight: 1.5 }}>
                  Desktop WireGuard apps can't scan a QR code — use the "Download .conf" button on the right instead.
                </p>
              </div>
            )}
          </div>

          {/* Right: generate / QR / status */}
          <div style={{ borderLeft: '1px solid #f3f4f6', paddingLeft: 28 }}>
            {!conn ? (
              <div style={{ textAlign: 'center', padding: '24px 0' }}>
                <QrCode2Icon style={{ fontSize: 40, color: '#c7d2fe', marginBottom: 12 }} />
                <p style={{ fontSize: 12, color: '#9ca3af', margin: '0 0 16px', maxWidth: 220, marginLeft: 'auto', marginRight: 'auto' }}>
                  Generate a QR code (and config file) for this device.
                </p>
                <button className="wgac-btn-primary" onClick={generate} disabled={loading} style={{ margin: '0 auto' }}>
                  {loading
                    ? <><span style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,.4)', borderTop: '2px solid #fff', borderRadius: '50%', animation: 'wgac-spin 1s linear infinite', display: 'inline-block' }} /> Generating…</>
                    : <><QrCode2Icon style={{ fontSize: 17 }} /> Generate My Connection</>}
                </button>
              </div>
            ) : (
              <div style={{ textAlign: 'center' }}>
                <img src={conn.qr_code_data_url} alt="WireGuard QR code"
                  style={{ width: 190, height: 190, borderRadius: 10, border: '1px solid #e5e7eb', margin: '0 auto 12px', display: 'block' }} />
                <p className="wgac-mono" style={{ fontSize: 12, color: '#6b7280', margin: '0 0 16px' }}>Assigned IP: {conn.random_ip}</p>

                <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 18 }}>
                  <button className="wgac-btn-ghost" onClick={() => copy(conn.client_config, 'conf')}>
                    {copied === 'conf' ? <><CheckIcon style={{ fontSize: 14 }} /> Copied!</> : <><ContentCopyIcon style={{ fontSize: 14 }} /> Copy Config</>}
                  </button>
                  <button className="wgac-btn-ghost" onClick={downloadConf}>
                    <DownloadIcon style={{ fontSize: 14 }} /> Download .conf
                  </button>
                  <button className="wgac-btn-ghost" onClick={generate}>
                    <RefreshIcon style={{ fontSize: 14 }} /> New QR
                  </button>
                </div>

                {/* Tunnel status */}
                <div style={{
                  padding: '14px 16px', borderRadius: 10,
                  background: tunnelUp ? '#f0fdf4' : polling ? '#eef2ff' : '#f9fafb',
                  border: `1px solid ${tunnelUp ? '#bbf7d0' : polling ? '#c7d2fe' : '#e5e7eb'}`,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: tunnelUp || polling ? 4 : 0 }}>
                    {tunnelUp
                      ? <CheckCircleIcon style={{ fontSize: 18, color: '#10b981' }} />
                      : polling
                        ? <div style={{ width: 14, height: 14, border: '2px solid rgba(99,102,241,.25)', borderTop: '2px solid #6366f1', borderRadius: '50%', animation: 'wgac-spin 1s linear infinite' }} />
                        : <ErrorOutlineIcon style={{ fontSize: 17, color: '#9ca3af' }} />}
                    <span style={{ fontSize: 13, fontWeight: 600, color: tunnelUp ? '#166534' : polling ? '#4338ca' : '#6b7280' }}>
                      {tunnelUp ? 'Your VPN tunnel is up!' : polling ? 'Checking for handshake…' : 'Not connected yet'}
                    </span>
                  </div>
                  <p style={{ fontSize: 11, color: '#9ca3af', margin: 0 }}>
                    {tunnelUp
                      ? 'This device is now reachable over the VPN.'
                      : polling
                        ? `Attempt ${pollCount}/24 — activate the tunnel in the app if you haven't yet.`
                        : 'Activate the tunnel in the WireGuard app, then check again.'}
                  </p>
                  {!polling && !tunnelUp && (
                    <button className="wgac-btn-ghost" onClick={() => startPolling(conn.public_key)} style={{ marginTop: 10 }}>
                      Check Connection
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}