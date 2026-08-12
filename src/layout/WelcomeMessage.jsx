import { useState, useEffect, useRef } from 'react'
import { useApplicationSettings } from '../settings/ApplicationSettings'
import { Link } from 'react-router-dom';

const TIME_ZONE = 'Africa/Nairobi'

const WelcomeMessage = () => {
  const {
    companySettings,
    smsBalance,
    providerSms,
  } = useApplicationSettings()

  const { company_name } = companySettings

  // offset (ms) between server time and this device's local clock.
  // null until we've synced once.
  const offsetRef = useRef(0)
  const [synced, setSynced] = useState(false)
  const [time, setTime] = useState(new Date())

  const subdomain = window.location.hostname.split('.')[0]

  // ── Sync with server time once on mount ──────────────────
  useEffect(() => {
    let cancelled = false

    const syncServerTime = async () => {
      try {
        const requestStart = Date.now()
        const response = await fetch('/api/server_time', {
          headers: { 'X-Subdomain': subdomain },
        })
        const requestEnd = Date.now()

        if (!response.ok) return

        const data = await response.json()
        const serverTime = new Date(data.time).getTime()

        // rough network-latency correction: assume the server
        // timestamp was generated roughly mid-request
        const roundTrip = requestEnd - requestStart
        const estimatedServerNow = serverTime + roundTrip / 2

        if (!cancelled) {
          offsetRef.current = estimatedServerNow - Date.now()
          setSynced(true)
        }
      } catch (error) {
        // couldn't reach server — fall back to device clock,
        // but timeZone formatting below still protects display correctness
      }
    }

    syncServerTime()
    return () => { cancelled = true }
  }, [subdomain])

  // ── Tick every second, anchored to server offset ─────────
  useEffect(() => {
    const id = setInterval(() => {
      setTime(new Date(Date.now() + offsetRef.current))
    }, 1000)
    return () => clearInterval(id)
  }, [])

  // ── Time helpers (use Nairobi hour, not device hour) ─────
  const nairobiHour = Number(
    new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      hour12: false,
      timeZone: TIME_ZONE,
    }).format(time)
  )
  const hour = nairobiHour === 24 ? 0 : nairobiHour

  const getTheme = () => {
    if (hour < 6)  return 'night'
    if (hour < 12) return 'morning'
    if (hour < 17) return 'afternoon'
    if (hour < 21) return 'evening'
    return 'night'
  }

  const THEMES = {
    morning: {
      gradient: 'from-amber-400 via-pink-400 to-violet-500',
      tag: '🌅 Rise & Shine',
      tagStyle: 'bg-amber-500/10 text-amber-400 border-amber-500/25',
      orbStyle: 'bg-amber-400',
    },
    afternoon: {
      gradient: 'from-blue-400 via-cyan-400 to-emerald-400',
      tag: '☀️ Afternoon',
      tagStyle: 'bg-blue-500/10 text-blue-300 border-blue-500/25',
      orbStyle: 'bg-blue-500',
    },
    evening: {
      gradient: 'from-violet-500 via-pink-400 to-amber-400',
      tag: '🌆 Evening',
      tagStyle: 'bg-violet-500/10 text-violet-300 border-violet-500/25',
      orbStyle: 'bg-violet-500',
    },
    night: {
      tag: '🌙 Late Night',
      tagStyle: 'bg-sky-500/10 dark:text-white border-sky-500/25 text-black ',
      gradient: 'from-sky-300 via-violet-400 to-pink-300 ',
      orbStyle: 'bg-indigo-900 ',
    },
  }

  const theme = THEMES[getTheme()]

  const getGreeting = () => {
    const day = new Intl.DateTimeFormat('en-US', { weekday: 'long', timeZone: TIME_ZONE }).format(time)
    if (hour < 6)  return `Burning the Midnight Oil`
    if (hour < 12) return `Happy ${day}, Rise & Shine`
    if (hour < 17) return `Having a Great Day`
    if (hour < 21) return `Wrapping Up Strong`
    return `Burning the Midnight Oil`
  }

  const getSubMessage = () => {
    if (hour < 6)  return "Working late? Here's a quick overview of today 🌙"
    if (hour < 12) return "Ready to make today amazing? Let's see what's new! ☀️"
    if (hour < 17) return "Hope your afternoon is going wonderfully! Here's what's new ✨"
    if (hour < 21) return "Another productive day! Check out today's highlights 🌟"
    return "Working late? Here's a quick overview of today 🌙"
  }

  const formattedTime = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true,
    timeZone: TIME_ZONE,
  }).format(time)
  const [clockMain, clockAmPm] = formattedTime.split(' ')

  const formattedDate = new Intl.DateTimeFormat('en-US', {
    weekday: 'long', month: 'long', day: 'numeric',
    timeZone: TIME_ZONE,
  }).format(time)

  const smsNotConfigured = !providerSms || !smsBalance

  return (
    <div className="space-y-3 font-sans
">

      {/* ── Greeting card ── */}
      <div className="relative rounded-2xl p-6 overflow-hidden border border-white/10 bg-white/[0.03]">

        {/* Ambient orb */}
        <div className={`absolute -top-8 -right-8 w-48 h-48 rounded-full ${theme.orbStyle} opacity-20 blur-3xl pointer-events-none`} />

        {/* Season / time tag */}
        <span className={`inline-flex items-center gap-1.5 text-[12px] 
          font-semibold tracking-widest uppercase px-3 py-1  rounded-full border mb-4 ${theme.tagStyle}`}>
          {theme.tag}
        </span>

        {/* Greeting name */}
        <p className={`font-black text-2xl leading-tight bg-gradient-to-r text-black dark:text-white bg-clip-text  mb-2`}>
          {getGreeting()}, {company_name || 'Aitechs'}
        </p>

        {/* Sub message */}
        <p className="text-sm text-gray-600 dark:text-gray-100 leading-relaxed">
          {getSubMessage()}
        </p>

        {/* Clock */}
        <div className="mt-5 flex items-baseline gap-2">
          <span className={`text-4xl font-black tracking-tight bg-gradient-to-r  bg-clip-text font-sans
 leading-none`}>
            {clockMain}
          </span>
          <div>
            <div className="text-xs font-bold text-gray-500 uppercase tracking-widest">{clockAmPm}</div>
            <div className="text-xs text-gray-600 mt-0.5">{formattedDate}</div>
          </div>
        </div>
      </div>

      {/* ── SMS notice (only when not configured) ── */}
      {smsNotConfigured && (
        <div className="flex items-start gap-3 rounded-xl p-4 bg-amber-500/[0.35] border border-amber-500/20">
          <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-amber-500/15 flex items-center justify-center text-base">
            📡
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold  mb-1">SMS provider not configured</p>
            <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
              To send messages and check your balance, connect your SMS provider.
            </p>

          <Link to="/admin/settings">
            <div className="mt-2 inline-flex items-center gap-1.5 text-[11px] font-semibold
             bg-amber-500/30 border border-amber-500/20 rounded-md px-2.5 py-1 cursor-pointer
              hover:bg-amber-500/20 transition-colors select-none">
              ⚙️ Settings <span className="">›</span> SMS Settings
            </div>
</Link>
          </div>
        </div>
      )}

    </div>
  )
}

export default WelcomeMessage