import { useState, useEffect, useRef } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, CircularProgress } from '@mui/material';
import { LuMonitorSmartphone, LuCopy, LuCheck } from 'react-icons/lu';
import toast from 'react-hot-toast';

const RemoteWinboxModal = ({ open, onClose, closing, routerId, routerName }) => {
  const [loading, setLoading] = useState(false);
  const [session, setSession] = useState(null); // { host, port, expires_at }
  const [copied, setCopied] = useState(false);
  const [remaining, setRemaining] = useState(null);
  const tickRef = useRef(null);

  const subdomain = window.location.hostname.split('.')[0];

  const startSession = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/nas_routers/${routerId}/remote_winbox_session`, {
        method: 'POST',
        headers: { 'X-Subdomain': subdomain,
                'X-Domain': window.location.hostname,



         },
      });
      const data = await res.json();
      if (res.ok) {
        setSession(data);
      } else {
        toast.error(data.error || 'Failed to open remote WinBox session', {
          position: 'top-center', duration: 6000,
        });
      }
    } catch (e) {
      toast.error('Something went wrong opening the session', {
        position: 'top-center', duration: 6000,
      });
    } finally {
      setLoading(false);
    }
  };

  // Countdown driven by the server's absolute expiry, not a local timer guess
  useEffect(() => {
    if (!session?.expires_at) return;
    const tick = () => {
      const secs = Math.max(0, Math.round((new Date(session.expires_at) - Date.now()) / 1000));
      setRemaining(secs);
      if (secs === 0) clearInterval(tickRef.current);
    };
    tick();
    tickRef.current = setInterval(tick, 1000);
    return () => clearInterval(tickRef.current);
  }, [session]);

  useEffect(() => {
    if (!open) {
      setSession(null);
      setRemaining(null);
      setCopied(false);
    }
  }, [open]);

  const connectionString = session ? `${session.host}:${session.port}` : '';

  const copyToClipboard = () => {
    navigator.clipboard.writeText(connectionString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const mm = remaining !== null ? String(Math.floor(remaining / 60)).padStart(2, '0') : '--';
  const ss = remaining !== null ? String(remaining % 60).padStart(2, '0') : '--';

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth
      PaperProps={{ sx: { bgcolor: '#1e1e1e', color: '#f1f1f1', borderRadius: '16px' } }}>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1, fontFamily: 'monospace' }}>
        <LuMonitorSmartphone size={20} />
        Remote WinBox — {routerName}
      </DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        {!session && (
          <Typography sx={{ color: '#a3a3a3', mb: 2, fontFamily: 'monospace', fontSize: 14 }}>
            This opens a temporary relay to this router's WinBox port. It closes itself
            automatically after 15 minutes.
          </Typography>
        )}

        {session && (
          <div className="flex flex-col gap-3">
            <div
              className="flex items-center justify-between rounded-xl p-4"
              style={{ backgroundColor: '#262626', border: '1px solid #3a3a3a' }}
            >
              <div>
                <Typography sx={{ fontSize: 11, color: '#a3a3a3', fontFamily: 'monospace', textTransform: 'uppercase' }}>
                  Connect WinBox to
                </Typography>
                <Typography sx={{ fontSize: 20, fontWeight: 700, fontFamily: 'monospace', letterSpacing: 0.5 }}>
                  {connectionString}
                </Typography>
              </div>
              <IconButtonCopy copied={copied} onClick={copyToClipboard} />
            </div>

            <div className="flex items-center justify-between rounded-xl p-3"
              style={{ backgroundColor: remaining < 60 ? '#3a1e1e' : '#1e2a1e', border: `1px solid ${remaining < 60 ? '#5a2e2e' : '#2e5a2e'}` }}>
              <Typography sx={{ fontFamily: 'monospace', fontSize: 13, color: '#a3a3a3' }}>
                Session closes in
              </Typography>
              <Typography sx={{ fontFamily: 'monospace', fontSize: 18, fontWeight: 700, color: remaining < 60 ? '#ff8080' : '#80ff80' }}>
                {mm}:{ss}
              </Typography>
            </div>
          </div>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        {/* <Button onClick={onClose} sx={{ color: '#a3a3a3' }}>Close</Button> */}
        <Button onClick={onClose} disabled={closing} sx={{ color: '#a3a3a3' }}>
  {closing ? 'Ending session…' : 'Close'}
</Button>
        {!session && (
          <Button
            onClick={startSession}
            disabled={loading}
            variant="contained"
            startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <LuMonitorSmartphone />}
            sx={{ bgcolor: '#2e7d32', '&:hover': { bgcolor: '#1b5e20' } }}
          >
            {loading ? 'Opening…' : 'Start Session'}
          </Button>
        )}
        {session && remaining === 0 && (
          <Button onClick={startSession} variant="contained" sx={{ bgcolor: '#2e7d32' }}>
            Reopen
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

const IconButtonCopy = ({ copied, onClick }) => (
  <button
    onClick={onClick}
    className="p-2 rounded-lg hover:bg-white/10 transition"
    style={{ color: copied ? '#80ff80' : '#f1f1f1' }}
  >
    {copied ? <LuCheck size={18} /> : <LuCopy size={18} />}
  </button>
);

export default RemoteWinboxModal;