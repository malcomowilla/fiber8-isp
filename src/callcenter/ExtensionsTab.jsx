import { useState } from 'react';
import toast from 'react-hot-toast';
import AddIcon from '@mui/icons-material/Add';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import VpnKeyOutlinedIcon from '@mui/icons-material/VpnKeyOutlined';
import LanguageIcon from '@mui/icons-material/Language';
import PhoneInTalkIcon from '@mui/icons-material/PhoneInTalk';
import { api } from './api';
import { Card, Btn, Dot, Toggle, Field, Modal, inputCls } from './ui';

const KIND = { webrtc: 'Browser (WebRTC)', softphone: 'Desk phone / softphone' };
const VIA = { webrtc: 'Browser', sip_phone: 'SIP phone' };

export default function ExtensionsTab({ data, reload }) {
  const [form, setForm] = useState(null); // { mode: 'create'|'edit', extension, name, kind }
  const [creds, setCreds] = useState(null);
  const [busy, setBusy] = useState(false);

  const save = async () => {
    setBusy(true);
    try {
      if (form.mode === 'create') {
        const r = await api('extensions', { method: 'POST', body: { extension: form.extension, name: form.name, kind: form.kind } });
        setCreds({ ...r.credentials, domain: r.sip_domain, extension: r.extension, kind: form.kind });
        toast.success('Agent created');
      } else {
        await api(`extensions/${form.extension}`, { method: 'PATCH', body: { name: form.name, kind: form.kind } });
        toast.success('Agent updated');
      }
      setForm(null);
      reload();
    } catch (e) { toast.error(e.message); }
    finally { setBusy(false); }
  };

  const toggle = async (e, enabled) => {
    try { await api(`extensions/${e.extension}`, { method: 'PATCH', body: { enabled } }); reload(); }
    catch (err) { toast.error(err.message); }
  };

  const reset = async (e) => {
    if (!window.confirm(`Reset the password for ${e.extension}? Registered phones will need the new one.`)) return;
    try {
      const r = await api(`extensions/${e.extension}/reset_password`, { method: 'POST' });
      setCreds({ ...r.credentials, domain: r.sip_domain, extension: e.extension, kind: e.kind });
    } catch (err) { toast.error(err.message); }
  };

  const remove = async (e) => {
    if (!window.confirm(`Delete agent ${e.extension} (${e.name})? This cannot be undone.`)) return;
    try { await api(`extensions/${e.extension}`, { method: 'DELETE' }); toast.success('Deleted'); reload(); }
    catch (err) { toast.error(err.message); }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xl">
          Each agent is one extension. Choose <b>Browser</b> if they take calls in this dashboard, or <b>Desk phone / softphone</b> for a SIP device or app.
        </p>
        <Btn onClick={() => setForm({ mode: 'create', extension: '', name: '', kind: 'webrtc' })}>
          <AddIcon fontSize="small" /> New agent
        </Btn>
      </div>

      <Card className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wider text-slate-500 border-b border-slate-200 dark:border-slate-800">
              <th className="px-4 py-3">Extension</th><th>Name</th><th>Type</th><th>Status</th><th>Connected via</th><th>Enabled</th><th className="text-right pr-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {data.extensions.map((e) => (
              <tr key={e.extension}>
                <td className="px-4 py-3 font-bold tabular-nums">{e.extension}</td>
                <td>{e.name}</td>
                <td className="text-slate-500">{KIND[e.kind]}</td>
                <td>
                  <span className="inline-flex items-center gap-2">
                    <Dot on={e.status === 'online'} pulse />
                    {!data.ami_online ? 'Unknown' : e.status === 'online' ? 'Online' : e.registered ? 'Unreachable' : 'Offline'}
                  </span>
                </td>
                <td className="text-slate-500">
                  {e.status === 'online' ? (
                    <span className="inline-flex items-center gap-1.5">
                      {e.via === 'webrtc' ? <LanguageIcon fontSize="inherit" /> : <PhoneInTalkIcon fontSize="inherit" />}
                      {VIA[e.via]}{e.ip ? ` · ${e.ip}` : ''}{e.rtt ? ` · ${Math.round(e.rtt)}ms` : ''}
                    </span>
                  ) : '—'}
                </td>
                <td><Toggle checked={e.enabled} onChange={(v) => toggle(e, v)} /></td>
                <td className="text-right pr-4 whitespace-nowrap">
                  <button title="Edit" className="p-1.5 text-slate-500 hover:text-lime-600" onClick={() => setForm({ mode: 'edit', extension: e.extension, name: e.name, kind: e.kind })}><EditOutlinedIcon fontSize="small" /></button>
                  <button title="Reset password" className="p-1.5 text-slate-500 hover:text-lime-600" onClick={() => reset(e)}><VpnKeyOutlinedIcon fontSize="small" /></button>
                  <button title="Delete" className="p-1.5 text-slate-500 hover:text-red-500" onClick={() => remove(e)}><DeleteOutlineIcon fontSize="small" /></button>
                </td>
              </tr>
            ))}
            {data.extensions.length === 0 && (
              <tr><td colSpan={7} className="px-4 py-10 text-center text-slate-500">No agents yet. Create your first one.</td></tr>
            )}
          </tbody>
        </table>
      </Card>

      {form && (
        <Modal title={form.mode === 'create' ? 'New agent' : `Edit ${form.extension}`} onClose={() => !busy && setForm(null)}>
          <div className="space-y-3">
            <Field label="Extension number" hint="3–10 digits, e.g. 1001">
              <input className={inputCls} value={form.extension} disabled={form.mode === 'edit'}
                onChange={(e) => setForm({ ...form, extension: e.target.value.replace(/\D/g, '') })} />
            </Field>
            <Field label="Agent name">
              <input className={inputCls} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </Field>
            <Field label="Type">
              <select className={inputCls} value={form.kind} onChange={(e) => setForm({ ...form, kind: e.target.value })}>
                {Object.entries(KIND).map(([k, l]) => <option key={k} value={k}>{l}</option>)}
              </select>
            </Field>
            <div className="flex justify-end gap-2 pt-2">
              <Btn variant="ghost" disabled={busy} onClick={() => setForm(null)}>Cancel</Btn>
              <Btn disabled={busy || !form.extension || !form.name} onClick={save}>{busy ? 'Saving…' : 'Save'}</Btn>
            </div>
          </div>
        </Modal>
      )}

      {creds && (
        <Modal title={`Credentials for ${creds.extension}`} onClose={() => setCreds(null)}>
          <p className="text-sm text-slate-500 mb-3">
            {creds.kind === 'softphone'
              ? 'Enter these in the SIP app or desk phone. The password is shown only now.'
              : 'Browser agents connect automatically from the web phone. Shown here for reference.'}
          </p>
          <dl className="rounded-xl bg-slate-50 dark:bg-slate-800 p-3 text-sm space-y-1.5 font-mono break-all">
            <div><dt className="inline text-slate-500">Server: </dt><dd className="inline">{creds.domain}</dd></div>
            <div><dt className="inline text-slate-500">Username: </dt><dd className="inline">{creds.username}</dd></div>
            <div><dt className="inline text-slate-500">Password: </dt><dd className="inline">{creds.password}</dd></div>
          </dl>
          <div className="flex justify-end pt-4"><Btn onClick={() => setCreds(null)}>Done</Btn></div>
        </Modal>
      )}
    </div>
  );
}