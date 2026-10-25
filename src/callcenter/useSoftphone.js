import { useCallback, useEffect, useRef, useState } from 'react';
import { UserAgent, Registerer, Inviter, SessionState, RegistererState } from 'sip.js';

const MEDIA = { sessionDescriptionHandlerOptions: { constraints: { audio: true, video: false } } };
const RING_KEY = 'cc_ring_on';

export default function useSoftphone() {
  const uaRef = useRef(null);
  const regRef = useRef(null);
  const sessionRef = useRef(null);
  const cfgRef = useRef(null);
  const audioRef = useRef(null);
  const timerRef = useRef(null);
  const ctxRef = useRef(null);
  const ringRef = useRef({ timer: null, nodes: [] });

  const [reg, setReg] = useState('disconnected'); // disconnected | connecting | registered | error
  const [call, setCall] = useState(null); // { direction, number, state, muted, seconds }
  const [ringOn, setRingOnState] = useState(() => {
    try { return localStorage.getItem(RING_KEY) !== '0'; } catch { return true; }
  });
  const ringOnRef = useRef(ringOn);

  // Browsers block sound until the user has clicked something. Called from the
  // "Go online" click so the ring is allowed to play later.
  const unlockAudio = useCallback(() => {
    try {
      if (!ctxRef.current) {
        const AC = window.AudioContext || window.webkitAudioContext;
        if (AC) ctxRef.current = new AC();
      }
      if (ctxRef.current?.state === 'suspended') ctxRef.current.resume();
    } catch { /* ignore */ }
  }, []);

  const stopRing = useCallback(() => {
    const r = ringRef.current;
    clearInterval(r.timer);
    r.timer = null;
    r.nodes.forEach((n) => { try { n.stop(); } catch { /* already stopped */ } });
    r.nodes = [];
  }, []);

  const startRing = useCallback(() => {
    if (!ringOnRef.current) return;
    unlockAudio();
    stopRing();

    const burst = () => {
      const ctx = ctxRef.current;
      if (!ctx) return;
      const now = ctx.currentTime;
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.25, now + 0.02);
      gain.gain.setValueAtTime(0.25, now + 0.9);
      gain.gain.linearRampToValueAtTime(0, now + 1.0);
      gain.connect(ctx.destination);
      [440, 480].forEach((f) => {
        const o = ctx.createOscillator();
        o.type = 'sine';
        o.frequency.value = f;
        o.connect(gain);
        o.onended = () => { ringRef.current.nodes = ringRef.current.nodes.filter((n) => n !== o); };
        o.start(now);
        o.stop(now + 1.0);
        ringRef.current.nodes.push(o);
      });
    };

    burst();
    ringRef.current.timer = setInterval(burst, 3000); // 1s ring, 2s pause
  }, [unlockAudio, stopRing]);

  const setRingOn = useCallback((v) => {
    ringOnRef.current = v;
    setRingOnState(v);
    try { localStorage.setItem(RING_KEY, v ? '1' : '0'); } catch { /* ignore */ }
    if (v) unlockAudio(); else stopRing();
  }, [unlockAudio, stopRing]);

  const cleanup = useCallback(() => {
    stopRing();
    clearInterval(timerRef.current);
    if (audioRef.current) audioRef.current.srcObject = null;
    sessionRef.current = null;
    setCall(null);
  }, [stopRing]);

  const attachRemote = (session) => {
    const pc = session.sessionDescriptionHandler?.peerConnection;
    if (!pc) return;
    const stream = new MediaStream();
    pc.getReceivers().forEach((r) => r.track && stream.addTrack(r.track));
    if (!audioRef.current) audioRef.current = new Audio();
    audioRef.current.srcObject = stream;
    audioRef.current.play().catch(() => {});
  };

  const setupSession = useCallback((session, direction, number) => {
    sessionRef.current = session;
    setCall({ direction, number, state: direction === 'in' ? 'ringing' : 'dialing', muted: false, seconds: 0 });

    session.stateChange.addListener((s) => {
      if (s === SessionState.Established) {
        stopRing();
        attachRemote(session);
        clearInterval(timerRef.current);
        timerRef.current = setInterval(() => setCall((c) => (c ? { ...c, seconds: c.seconds + 1 } : c)), 1000);
        setCall((c) => (c ? { ...c, state: 'active' } : c));
      } else if (s === SessionState.Terminated) {
        cleanup();
      }
    });
  }, [cleanup, stopRing]);

  const disconnect = useCallback(async () => {
    stopRing();
    try { await regRef.current?.unregister(); } catch { /* ignore */ }
    try { await uaRef.current?.stop(); } catch { /* ignore */ }
    regRef.current = null;
    uaRef.current = null;
    setReg('disconnected');
  }, [stopRing]);

  const connect = useCallback(async ({ extension, password, ws_url, domain }) => {
    await disconnect();
    setReg('connecting');
    cfgRef.current = { domain };

    const uri = UserAgent.makeURI(`sip:${extension}@${domain}`);
    const ua = new UserAgent({
      uri,
      transportOptions: { server: ws_url },
      authorizationUsername: extension,
      authorizationPassword: password,
      displayName: extension,
      sessionDescriptionHandlerFactoryOptions: {
        peerConnectionConfiguration: { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] },
      },
      delegate: {
        onInvite: (invitation) => {
          if (sessionRef.current) { invitation.reject({ statusCode: 486 }); return; }
          setupSession(invitation, 'in', invitation.remoteIdentity.uri.user);
          startRing();
        },
        onDisconnect: (err) => setReg(err ? 'error' : 'disconnected'),
      },
    });
    uaRef.current = ua;

    try {
      await ua.start();
      const registerer = new Registerer(ua);
      regRef.current = registerer;
      registerer.stateChange.addListener((s) => {
        if (s === RegistererState.Registered) setReg('registered');
        else if (s === RegistererState.Unregistered) setReg('disconnected');
      });
      await registerer.register();
    } catch (e) {
      setReg('error');
      throw e;
    }
  }, [disconnect, setupSession, startRing]);

  const dial = useCallback(async (number) => {
    const ua = uaRef.current;
    if (!ua || sessionRef.current || !number) return;
    const target = UserAgent.makeURI(`sip:${number}@${cfgRef.current.domain}`);
    const inviter = new Inviter(ua, target, MEDIA);
    setupSession(inviter, 'out', number);
    await inviter.invite();
  }, [setupSession]);

  const answer = useCallback(() => {
    stopRing();
    sessionRef.current?.accept?.(MEDIA);
  }, [stopRing]);

  const hangup = useCallback(() => {
    stopRing();
    const s = sessionRef.current;
    if (!s) return;
    if (s.state === SessionState.Established) s.bye();
    else if (typeof s.cancel === 'function') s.cancel();
    else s.reject();
  }, [stopRing]);

  const toggleMute = useCallback(() => {
    const s = sessionRef.current;
    const pc = s?.sessionDescriptionHandler?.peerConnection;
    if (!pc) return;
    setCall((c) => {
      if (!c) return c;
      const muted = !c.muted;
      pc.getSenders().forEach((x) => { if (x.track) x.track.enabled = !muted; });
      return { ...c, muted };
    });
  }, []);

  const sendDtmf = useCallback((tone) => {
    sessionRef.current?.sessionDescriptionHandler?.sendDtmf?.(tone);
  }, []);

  useEffect(() => () => {
    stopRing();
    clearInterval(timerRef.current);
    disconnect();
    try { ctxRef.current?.close(); } catch { /* ignore */ }
  }, [disconnect, stopRing]);

  return { reg, call, ringOn, setRingOn, unlockAudio, connect, disconnect, dial, answer, hangup, toggleMute, sendDtmf };
}