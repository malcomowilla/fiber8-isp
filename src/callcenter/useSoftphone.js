import { useCallback, useEffect, useRef, useState } from 'react';
import { UserAgent, Registerer, Inviter, SessionState, RegistererState } from 'sip.js';

const MEDIA = { sessionDescriptionHandlerOptions: { constraints: { audio: true, video: false } } };

export default function useSoftphone() {
  const uaRef = useRef(null);
  const regRef = useRef(null);
  const sessionRef = useRef(null);
  const cfgRef = useRef(null);
  const audioRef = useRef(null);
  const timerRef = useRef(null);

  const [reg, setReg] = useState('disconnected'); // disconnected | connecting | registered | error
  const [call, setCall] = useState(null); // { direction, number, state, muted, seconds }

  const cleanup = useCallback(() => {
    clearInterval(timerRef.current);
    if (audioRef.current) audioRef.current.srcObject = null;
    sessionRef.current = null;
    setCall(null);
  }, []);

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
        attachRemote(session);
        clearInterval(timerRef.current);
        timerRef.current = setInterval(() => setCall((c) => (c ? { ...c, seconds: c.seconds + 1 } : c)), 1000);
        setCall((c) => (c ? { ...c, state: 'active' } : c));
      } else if (s === SessionState.Terminated) {
        cleanup();
      }
    });
  }, [cleanup]);

  const disconnect = useCallback(async () => {
    try { await regRef.current?.unregister(); } catch { /* ignore */ }
    try { await uaRef.current?.stop(); } catch { /* ignore */ }
    regRef.current = null;
    uaRef.current = null;
    setReg('disconnected');
  }, []);

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
  }, [disconnect, setupSession]);

  const dial = useCallback(async (number) => {
    const ua = uaRef.current;
    if (!ua || sessionRef.current || !number) return;
    const target = UserAgent.makeURI(`sip:${number}@${cfgRef.current.domain}`);
    const inviter = new Inviter(ua, target, MEDIA);
    setupSession(inviter, 'out', number);
    await inviter.invite();
  }, [setupSession]);

  const answer = useCallback(() => { sessionRef.current?.accept?.(MEDIA); }, []);

  const hangup = useCallback(() => {
    const s = sessionRef.current;
    if (!s) return;
    if (s.state === SessionState.Established) s.bye();
    else if (typeof s.cancel === 'function') s.cancel();
    else s.reject();
  }, []);

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

  useEffect(() => () => { clearInterval(timerRef.current); disconnect(); }, [disconnect]);

  return { reg, call, connect, disconnect, dial, answer, hangup, toggleMute, sendDtmf };
}