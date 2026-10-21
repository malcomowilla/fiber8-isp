import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import CallReceivedIcon from '@mui/icons-material/CallReceived';
import CallMadeIcon from '@mui/icons-material/CallMade';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import { api, fmtDur } from './api';
import { Card, Btn, inputCls } from './ui';

const DIR = { inbound: CallReceivedIcon, outbound: CallMadeIcon, internal: SwapHorizIcon };
const BADGE = {
  ANSWERED: 'bg-lime-100 text-lime-700 dark:bg-lime-500/20 dark:text-lime-300',
  'NO ANSWER': 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300',
  BUSY: 'bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-300',
  FAILED: 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300',
};

export default function CallsTab() {
  const [f, setF] = useState({ q: '', disposition: '', from: '', to: '' });
  const [page, setPage] = useState(1);
  const [res, setRes] = useState({ calls: [], total: 0, per: 25 });
  const [loading, setLoading] = useState(false);
  const [audio, setAudio] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const qs = new URLSearchParams({ page, ...Object.fromEntries(Object.entries(f).filter(([, v]) => v)) });
      setRes(await api(`calls?${qs}`));
    } catch (e) { toast.error(e.message); }
    finally { setLoading(false); }
  }, [f, page]);

  useEffect(() => { load(); }, [load]);

  const play = async (id) => {
    const r = await api(`recordings/${encodeURIComponent(id)}`, { raw: true });
    if (!r.ok) return toast.error('Recording not found');
    if (audio?.url) URL.revokeObjectURL(audio.url);
    setAudio({ id, url: URL.createObjectURL(await r.blob()) });
  };

  const pages = Math.max(1, Math.ceil(res.total / res.per));
  const set = (k, v) => { setPage(1); setF({ ...f, [k]: v }); };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
        <input className={`${inputCls} col-span-2`} placeholder="Search number or name…" value={f.q} onChange={(e) => set('q', e.target.value)} />
        <select className={inputCls} value={f.disposition} onChange={(e) => set('disposition', e.target.value)}>
          <option value="">All outcomes</option>
          <option value="ANSWERED">Answered</option>
          <option value="NO ANSWER">Missed</option>
          <option value="BUSY">Busy</option>
          <option value="FAILED">Failed</option>
        </select>
        <input type="date" className={inputCls} value={f.from} onChange={(e) => set('from', e.target.value)} />
        <input type="date" className={inputCls} value={f.to} onChange={(e) => set('to', e.target.value)} />
      </div>

      {audio && (
        <Card className="p-3 flex items-center gap-3">
          <span className="text-xs text-slate-500">Recording</span>
          <audio controls autoPlay src={audio.url} className="flex-1 h-9" />
        </Card>
      )}

      <Card className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wider text-slate-500 border-b border-slate-200 dark:border-slate-800">
              <th className="px-4 py-3">When</th><th>Direction</th><th>From</th><th>To</th><th>Outcome</th><th>Talk time</th><th className="pr-4 text-right">Recording</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {res.calls.map((c) => {
              const Icon = DIR[c.direction] || SwapHorizIcon;
              return (
                <tr key={c.id}>
                  <td className="px-4 py-2.5 whitespace-nowrap">{new Date(c.calldate).toLocaleString()}</td>
                  <td><span className="inline-flex items-center gap-1.5 capitalize text-slate-600 dark:text-slate-300"><Icon fontSize="inherit" /> {c.direction}</span></td>
                  <td className="tabular-nums">{c.src || '—'}</td>
                  <td className="tabular-nums">{c.dst || '—'}</td>
                  <td><span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${BADGE[c.disposition] || 'bg-slate-100 text-slate-600'}`}>{c.disposition}</span></td>
                  <td className="tabular-nums">{fmtDur(c.billsec)}</td>
                  <td className="pr-4 text-right">
                    {c.recording ? (
                      <button onClick={() => play(c.id)} className="p-1.5 rounded-full bg-lime-500 text-slate-900"><PlayArrowIcon fontSize="small" /></button>
                    ) : <span className="text-slate-400">—</span>}
                  </td>
                </tr>
              );
            })}
            {!loading && res.calls.length === 0 && (
              <tr><td colSpan={7} className="px-4 py-10 text-center text-slate-500">No calls found.</td></tr>
            )}
          </tbody>
        </table>
      </Card>

      <div className="flex items-center justify-between text-sm text-slate-500">
        <span>{res.total} calls</span>
        <div className="flex items-center gap-2">
          <Btn variant="ghost" disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</Btn>
          <span className="tabular-nums">{page} / {pages}</span>
          <Btn variant="ghost" disabled={page >= pages} onClick={() => setPage(page + 1)}>Next</Btn>
        </div>
      </div>
    </div>
  );
}