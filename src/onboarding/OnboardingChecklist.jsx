import { useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked'
import CloseIcon from '@mui/icons-material/Close'
import RefreshIcon from '@mui/icons-material/Refresh'

const subdomain = window.location.hostname.split('.')[0]
const DISMISS_KEY = `owitech:onboarding-dismissed:${subdomain}`
const PAYMENTS_KEY = `owitech:onboarding-payments:${subdomain}`

const getList = async (url) => {
  try {
    const res = await fetch(url, { credentials: 'include', headers: { 'X-Subdomain': subdomain } })
    if (!res.ok) return null
    const data = await res.json()
    return Array.isArray(data) ? data : null
  } catch { return null }
}

export default function OnboardingChecklist() {
  const [dismissed, setDismissed] = useState(() => localStorage.getItem(DISMISS_KEY) === '1')
  const [loading, setLoading] = useState(true)
  const [state, setState] = useState({ router: false, packages: false })
  const [paymentsDone, setPaymentsDone] = useState(() => localStorage.getItem(PAYMENTS_KEY) === '1')

  const refresh = useCallback(async () => {
    setLoading(true)
    const [routers, pppoe, hotspot] = await Promise.all([
      getList('/api/routers'),
      getList('/api/packages'),
      getList('/api/hotspot_packages'),
    ])
    setState({
      router: (routers?.length || 0) > 0,
      packages: (pppoe?.length || 0) + (hotspot?.length || 0) > 0,
    })
    setLoading(false)
  }, [])

  useEffect(() => { refresh() }, [refresh])

  const steps = [
    {
      key: 'router', done: state.router,
      title: 'Connect your first MikroTik router',
      desc: 'Generate a WireGuard config, paste it into your router and we detect the tunnel. Your router then appears in Routers automatically.',
      to: '/admin/networks-wireguard-config', cta: 'Connect router',
    },
    {
      key: 'packages', done: state.packages,
      title: 'Create your first package',
      desc: 'Set up a PPPoE or Hotspot package with speed and price.',
      to: '/admin/pppoe-packages', cta: 'Create package',
    },
    {
      key: 'payments', done: paymentsDone,
      title: 'Set up how you get paid',
      desc: 'Add your M-Pesa / payment gateway details in settings.',
      to: '/admin/settings', cta: 'Open settings',
      manual: true,
    },
  ]

  const allDone = steps.every((s) => s.done)
  if (dismissed) return null

  const dismiss = () => { localStorage.setItem(DISMISS_KEY, '1'); setDismissed(true) }
  const markPayments = () => { localStorage.setItem(PAYMENTS_KEY, '1'); setPaymentsDone(true) }

  return (
    <section className="mb-6 rounded-2xl border border-black/10 p-5 font-sans dark:border-white/10">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-black dark:text-white">
            {allDone ? 'You’re all set' : 'Get your network live'}
          </h2>
          <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
            {steps.filter((s) => s.done).length} of {steps.length} steps complete
          </p>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={refresh} disabled={loading} title="Re-check progress"
            className="rounded-lg p-1.5 text-gray-500 hover:bg-black/5 dark:text-gray-400 dark:hover:bg-white/10">
            <RefreshIcon style={{ width: 18, height: 18 }} className={loading ? 'animate-spin' : ''} />
          </button>
          <button onClick={dismiss} title="Dismiss"
            className="rounded-lg p-1.5 text-gray-500 hover:bg-black/5 dark:text-gray-400 dark:hover:bg-white/10">
            <CloseIcon style={{ width: 18, height: 18 }} />
          </button>
        </div>
      </div>

      <ol className="mt-4 divide-y divide-black/5 dark:divide-white/5">
        {steps.map((s) => (
          <li key={s.key} className="flex items-start gap-3 py-3">
            <span className="mt-0.5 text-black dark:text-white">
              {s.done
                ? <CheckCircleIcon style={{ width: 22, height: 22 }} />
                : <RadioButtonUncheckedIcon style={{ width: 22, height: 22, opacity: 0.4 }} />}
            </span>
            <div className="min-w-0 flex-1">
              <p className={`text-sm font-medium text-black dark:text-white ${s.done ? 'line-through opacity-60' : ''}`}>
                {s.title}
              </p>
              {!s.done && <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">{s.desc}</p>}
            </div>
            {!s.done && (
              <div className="flex shrink-0 items-center gap-2">
                {s.manual && (
                  <button onClick={markPayments}
                    className="text-xs text-gray-500 underline dark:text-gray-400">Mark done</button>
                )}
                <Link to={s.to}
                  className="inline-flex h-8 items-center rounded-lg bg-black px-3 text-xs font-semibold text-white dark:bg-white dark:text-black">
                  {s.cta}
                </Link>
              </div>
            )}
          </li>
        ))}
      </ol>

      {allDone && (
        <button onClick={dismiss} className="mt-3 text-xs text-gray-500 underline dark:text-gray-400">
          Hide this guide
        </button>
      )}
    </section>
  )
}