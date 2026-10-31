import { useState, useEffect, useCallback, useMemo } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import RefreshIcon from '@mui/icons-material/Refresh'
import CheckIcon from '@mui/icons-material/Check'
import CloseIcon from '@mui/icons-material/Close'

const TABS = ['pending', 'approved', 'rejected']
const btn = `inline-flex h-8 items-center gap-1.5 rounded-lg border border-black/10 px-3 text-xs font-medium
  text-black hover:bg-black/5 disabled:opacity-50 dark:border-white/10 dark:text-white dark:hover:bg-white/10`

const AccessApplications = () => {
  const [apps, setApps] = useState([])
  const [stats, setStats] = useState({ pending: 0, approved: 0, rejected: 0 })
  const [tab, setTab] = useState('pending')
  const [loading, setLoading] = useState(true)
  const [actingId, setActingId] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/access_applications', { credentials: 'include' })
      if (!res.ok) throw new Error('Failed to load applications')
      const data = await res.json()
      setApps(data.applications)
      setStats(data.stats)
    } catch (e) {
      toast.error(e.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const rows = useMemo(() => apps.filter((a) => a.status === tab), [apps, tab])

  const approve = async (a) => {
    if (!window.confirm(`Approve ${a.company_name}?\n\nThis creates ${a.hostname} on Cloudflare, creates the account and emails login credentials to ${a.email}.`)) return
    setActingId(a.id)
    try {
      const res = await fetch(`/api/access_applications/${a.id}/approve`, { method: 'POST', credentials: 'include' })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || 'Approval failed')
      toast.success(`${a.company_name} approved, credentials emailed`)
      load()
    } catch (e) {
      toast.error(e.message, { duration: 7000 })
    } finally {
      setActingId(null)
    }
  }

  const reject = async (a) => {
    const reason = window.prompt(`Reject ${a.company_name}? Optional reason (included in the email):`)
    if (reason === null) return
    setActingId(a.id)
    try {
      const res = await fetch(`/api/access_applications/${a.id}/reject`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || 'Rejection failed')
      toast.success('Application rejected')
      load()
    } catch (e) {
      toast.error(e.message)
    } finally {
      setActingId(null)
    }
  }

  return (
    <div className="font-sans">
      <Toaster position="top-center" />
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-black dark:text-white">Access applications</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">ISPs that applied through the signup page</p>
        </div>
        <button className={btn} onClick={load} disabled={loading}>
          <RefreshIcon style={{ width: 16, height: 16 }} /> Refresh
        </button>
      </div>

      <div className="mb-4 flex gap-2">
        {TABS.map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`h-9 rounded-lg border px-4 text-sm font-medium capitalize ${
              tab === t
                ? 'border-black bg-black text-white dark:border-white dark:bg-white dark:text-black'
                : 'border-black/10 text-black dark:border-white/10 dark:text-white'
            }`}>
            {t} ({stats[t] ?? 0})
          </button>
        ))}
      </div>

      <div className="overflow-x-auto rounded-2xl border border-black/10 dark:border-white/10">
        <table className="w-full min-w-[860px] text-left">
          <thead>
            <tr className="border-b border-black/10 text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:border-white/10 dark:text-gray-400">
              <th className="px-4 py-3">Company</th>
              <th className="px-4 py-3">Applicant</th>
              <th className="px-4 py-3">Contact</th>
              <th className="px-4 py-3">Country</th>
              <th className="px-4 py-3">Referral</th>
              <th className="px-4 py-3">Applied</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} className="px-4 py-12 text-center text-sm text-gray-500">Loading…</td></tr>
            ) : rows.length === 0 ? (
              <tr><td colSpan={7} className="px-4 py-12 text-center text-sm text-gray-500">No {tab} applications.</td></tr>
            ) : rows.map((a) => (
              <tr key={a.id} className="border-b border-black/5 last:border-0 dark:border-white/5">
                <td className="px-4 py-3">
                  <p className="text-sm font-medium text-black dark:text-white">{a.company_name}</p>
                  <p className="font-mono text-xs text-gray-500 dark:text-gray-400">{a.hostname}</p>
                </td>
                <td className="px-4 py-3 text-sm text-black dark:text-white">{a.name}</td>
                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                  <p>{a.email}</p>
                  <p>{a.phone_number}</p>
                  {a.support_whatsapp && <p className="text-xs">WA: {a.support_whatsapp}</p>}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{a.country || '—'}</td>
                <td className="px-4 py-3 font-mono text-sm text-gray-600 dark:text-gray-300">{a.referral_code || '—'}</td>
                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                  {new Date(a.created_at).toLocaleString()}
                </td>
                <td className="px-4 py-3">
                  {a.status === 'pending' ? (
                    <div className="flex justify-end gap-2">
                      <button className={btn} disabled={actingId === a.id} onClick={() => approve(a)}>
                        <CheckIcon style={{ width: 16, height: 16 }} /> {actingId === a.id ? 'Working…' : 'Approve'}
                      </button>
                      <button className={btn} disabled={actingId === a.id} onClick={() => reject(a)}>
                        <CloseIcon style={{ width: 16, height: 16 }} /> Reject
                      </button>
                    </div>
                  ) : (
                    <p className="text-right text-xs text-gray-500 dark:text-gray-400">
                      {a.reviewed_at ? new Date(a.reviewed_at).toLocaleDateString() : ''}
                      {a.rejection_reason ? ` · ${a.rejection_reason}` : ''}
                    </p>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AccessApplications