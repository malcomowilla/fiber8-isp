import { useState } from 'react';
import CallIcon from '@mui/icons-material/Call';
import CallEndIcon from '@mui/icons-material/CallEnd';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import HeadsetMicIcon from '@mui/icons-material/HeadsetMic';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import BackspaceOutlinedIcon from '@mui/icons-material/BackspaceOutlined';
import { Dot, Btn, inputCls } from './ui';
import { fmtDur } from './api';

const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'];
const REG_LABEL = { registered: 'Online', connecting: 'Connecting…', error: 'Connection error', disconnected: 'Offline' };

export default function Softphone({ phone, myExt, setMyExt, options, onGoOnline }) {
  const { reg, call, dial, answer, hangup, toggleMute, sendDtmf, disconnect } = phone;
  const [open, setOpen] = useState(true);
  const [num, setNum] = useState('');

  const press = (k) => (call?.state === 'active' ? sendDtmf(k) : setNum((n) => n + k));
  const incoming = call?.direction === 'in' && call.state === 'ringing';

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className={`fixed bottom-5 right-5 z-50 w-14 h-14 rounded-full shadow-xl flex items-center justify-center
          bg-lime-500 text-slate-900 ${incoming ? 'animate-bounce' : ''}`}
      >
        <HeadsetMicIcon />
      </button>
    );
  }

  return (
    <div className="fixed bottom-5 right-5 z-50 w-72 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800
      bg-white dark:bg-slate-900 font-sans overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 bg-lime-500 text-slate-900">
        <div className="flex items-center gap-2 text-sm font-bold">
          <HeadsetMicIcon fontSize="small" /> Web phone
        </div>
        <button onClick={() => setOpen(false)} aria-label="Minimize"><ExpandMoreIcon /></button>
      </div>

      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
            <Dot on={reg === 'registered'} pulse /> {REG_LABEL[reg]}
          </span>
          {reg === 'registered' && (
            <button className="text-slate-500 hover:text-red-500" onClick={disconnect}>Go offline</button>
          )}
        </div>

        {reg !== 'registered' && (
          <div className="space-y-2">
            <select className={inputCls} value={myExt} onChange={(e) => setMyExt(e.target.value)}>
              <option value="">Choose my extension…</option>
              {options.map((o) => (
                <option key={o.extension} value={o.extension}>{o.extension} — {o.name}</option>
              ))}
            </select>
            <Btn className="w-full" disabled={!myExt || reg === 'connecting'} onClick={onGoOnline}>Go online</Btn>
            {options.length === 0 && (
              <p className="text-xs text-slate-500">Create a Browser (WebRTC) agent first.</p>
            )}
          </div>
        )}

        {reg === 'registered' && incoming && (
          <div className="rounded-xl bg-lime-50 dark:bg-lime-500/10 border border-lime-300/60 p-3 text-center space-y-2">
            <p className="text-xs text-slate-500">Incoming call</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">{call.number}</p>
            <div className="flex gap-2">
              <Btn className="flex-1" onClick={answer}><CallIcon fontSize="small" /> Answer</Btn>
              <Btn variant="danger" className="flex-1" onClick={hangup}><CallEndIcon fontSize="small" /> Decline</Btn>
            </div>
          </div>
        )}

        {reg === 'registered' && !incoming && (
          <>
            {call ? (
              <div className="text-center">
                <p className="text-lg font-bold text-slate-900 dark:text-white">{call.number}</p>
                <p className="text-xs text-slate-500 tabular-nums">
                  {call.state === 'active' ? fmtDur(call.seconds) : call.state === 'dialing' ? 'Calling…' : 'Ringing…'}
                </p>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <input className={`${inputCls} text-center tabular-nums`} placeholder="Enter number"
                  value={num} onChange={(e) => setNum(e.target.value.replace(/[^\d*#+]/g, ''))}
                  onKeyDown={(e) => e.key === 'Enter' && dial(num)} />
                <button className="text-slate-400 hover:text-slate-700" onClick={() => setNum((n) => n.slice(0, -1))}>
                  <BackspaceOutlinedIcon fontSize="small" />
                </button>
              </div>
            )}

            <div className="grid grid-cols-3 gap-1.5">
              {KEYS.map((k) => (
                <button key={k} onClick={() => press(k)}
                  className="py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-lime-100 dark:hover:bg-lime-500/20
                    text-slate-800 dark:text-slate-100 font-semibold">
                  {k}
                </button>
              ))}
            </div>

            {call ? (
              <div className="flex gap-2">
                <Btn variant="ghost" onClick={toggleMute} disabled={call.state !== 'active'}>
                  {call.muted ? <MicOffIcon fontSize="small" /> : <MicIcon fontSize="small" />}
                </Btn>
                <Btn variant="danger" className="flex-1" onClick={hangup}><CallEndIcon fontSize="small" /> Hang up</Btn>
              </div>
            ) : (
              <Btn className="w-full" disabled={!num} onClick={() => dial(num)}>
                <CallIcon fontSize="small" /> Call
              </Btn>
            )}
          </>
        )}
      </div>
    </div>
  );
}