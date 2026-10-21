import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { api } from './api';
import { Card, Btn, Toggle, Field, Dot, inputCls } from './ui';

const DAYS = [['mon', 'Mon'], ['tue', 'Tue'], ['wed', 'Wed'], ['thu', 'Thu'], ['fri', 'Fri'], ['sat', 'Sat'], ['sun', 'Sun']];
const PRESETS = [
  { label: 'Weekdays 8–5', always_open: false, open_days: ['mon', 'tue', 'wed', 'thu', 'fri'], open_from: '08:00', open_until: '17:00' },
  { label: 'Mon–Sat 8–6', always_open: false, open_days: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat'], open_from: '08:00', open_until: '18:00' },
  { label: 'Every day 7–10', always_open: false, open_days: DAYS.map(([d]) => d), open_from: '07:00', open_until: '22:00' },
  { label: '24/7', always_open: true, open_days: DAYS.map(([d]) => d), open_from: '00:00', open_until: '23:59' },
];

export default function SettingsTab() {
  const [s, setS] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => { api('settings').then(setS).catch((e) => toast.error(e.message)); }, []);
  if (!s) return <p className="text-sm text-slate-500">Loading…</p>;

  const set = (patch) => setS({ ...s, ...patch });
  const toggleDay = (d) => set({ open_days: s.open_days.includes(d) ? s.open_days.filter((x) => x !== d) : [...s.open_days, d] });

  const save = async () => {
    setSaving(true);
    try { setS(await api('settings', { method: 'PATCH', body: s })); toast.success('Saved'); }
    catch (e) { toast.error(e.message); }
    finally { setSaving(false); }
  };

  return (
    <div className="max-w-3xl space-y-5">
      <Card className="p-5 space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Hours & greetings</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Outside these hours callers hear the closed message and can leave a voicemail.</p>
          </div>
          <span className="inline-flex items-center gap-2 text-xs font-semibold whitespace-nowrap">
            <Dot on={s.open_now} pulse /> {s.open_now ? 'Open now' : 'Closed now'}
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          {PRESETS.map((p) => (
            <button key={p.label} type="button"
              onClick={() => set({ always_open: p.always_open, open_days: p.open_days, open_from: p.open_from, open_until: p.open_until })}
              className="px-3 py-1.5 rounded-full text-sm font-semibold bg-lime-100 text-lime-800 hover:bg-lime-200 dark:bg-lime-500/15 dark:text-lime-300">
              {p.label}
            </button>
          ))}
        </div>

        <div className={`grid grid-cols-7 gap-1.5 ${s.always_open ? 'opacity-40 pointer-events-none' : ''}`}>
          {DAYS.map(([d, l]) => {
            const on = s.open_days.includes(d);
            return (
              <button key={d} type="button" onClick={() => toggleDay(d)}
                className={`rounded-xl py-2 text-center text-sm font-semibold border transition-colors
                  ${on ? 'bg-lime-500 border-lime-500 text-slate-900' : 'border-slate-200 dark:border-slate-700 text-slate-500'}`}>
                {l}
                <span className="block text-[10px] font-medium opacity-80">{on ? 'open' : 'closed'}</span>
              </button>
            );
          })}
        </div>

        <div className={`grid grid-cols-2 gap-3 ${s.always_open ? 'opacity-40 pointer-events-none' : ''}`}>
          <Field label="Open from"><input type="time" className={inputCls} value={s.open_from} onChange={(e) => set({ open_from: e.target.value })} /></Field>
          <Field label="Until"><input type="time" className={inputCls} value={s.open_until} onChange={(e) => set({ open_until: e.target.value })} /></Field>
        </div>

        <Field label="When open"><textarea rows={2} className={inputCls} value={s.open_message || ''} onChange={(e) => set({ open_message: e.target.value })} /></Field>
        <Field label="When closed"><textarea rows={2} className={inputCls} value={s.closed_message || ''} onChange={(e) => set({ closed_message: e.target.value })} /></Field>
      </Card>

      <Card className="p-5 space-y-4">
        <h2 className="text-base font-bold text-slate-900 dark:text-white">While callers wait</h2>
        <Field label="Music while ringing (MP3 link, optional)">
          <input className={inputCls} placeholder="https://…/hold.mp3" value={s.hold_music_url || ''} onChange={(e) => set({ hold_music_url: e.target.value })} />
        </Field>
        <Field label="What callers hear while they wait"
          hint="Spoken once before the hold music: tell callers about your company, offers or opening hours. Empty: “Please hold while we connect you.”">
          <textarea rows={3} className={inputCls} value={s.hold_message || ''} onChange={(e) => set({ hold_message: e.target.value })} />
        </Field>
      </Card>

      <Card className="p-5 space-y-4">
        <h2 className="text-base font-bold text-slate-900 dark:text-white">Recording</h2>
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold">Record calls</p>
            <p className="text-xs text-slate-500">Recordings appear on each call under Call history.</p>
          </div>
          <Toggle checked={s.record_calls} onChange={(v) => set({ record_calls: v, ...(v ? {} : { announce_recording: false }) })} />
        </div>
        <div className={`flex items-center justify-between gap-4 ${s.record_calls ? '' : 'opacity-40'}`}>
          <div>
            <p className="text-sm font-semibold">Tell callers calls are recorded</p>
            <p className="text-xs text-slate-500">After your welcome they hear: “This call may be recorded for quality and training purposes.”</p>
          </div>
          <Toggle checked={s.announce_recording} disabled={!s.record_calls} onChange={(v) => set({ announce_recording: v })} />
        </div>
      </Card>

      <div className="flex justify-end"><Btn disabled={saving} onClick={save}>{saving ? 'Saving…' : 'Save changes'}</Btn></div>
    </div>
  );
}