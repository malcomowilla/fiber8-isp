import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import {
  Search, X, RefreshCw, ChevronRight, Coins, TrendingUp,
  ShoppingBag, Clock, Sparkles, ArrowUpRight, ArrowDownRight,
  Gift, Wallet, CalendarClock, Ban,
} from 'lucide-react'

// ---------------------------------------------------------------------------
// Small formatters — kept local, no external date lib assumed installed.
// ---------------------------------------------------------------------------
const money = (n) =>
  `KES ${Number(n || 0).toLocaleString('en-KE', { maximumFractionDigits: 0 })}`

const relativeTime = (iso) => {
  if (!iso) return '—'
  const diffMs = Date.now() - new Date(iso).getTime()
  const mins = Math.round(diffMs / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.round(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.round(hrs / 24)
  if (days < 30) return `${days}d ago`
  const months = Math.round(days / 30)
  if (months < 12) return `${months}mo ago`
  return `${Math.round(months / 12)}y ago`
}

const dateTime = (iso) => {
  if (!iso) return '—'
  const d = new Date(iso)
  return d.toLocaleDateString('en-KE', { month: 'short', day: 'numeric' }) +
    ', ' + d.toLocaleTimeString('en-KE', { hour: '2-digit', minute: '2-digit' })
}

// Tier thresholds mirror the filter chips — used to draw the progress ring.
const TIERS = [10, 50, 100, 250]
const nextTier = (balance) => TIERS.find((t) => t > balance) ?? null
const tierLabel = (balance) => {
  const passed = [...TIERS].reverse().find((t) => balance >= t)
  return passed ? `${passed}+ points` : 'New member'
}

// ---------------------------------------------------------------------------

const HotspotLoyaltyCustomers = () => {
  const subdomain = window.location.hostname.split('.')[0]
  const authHeaders = useMemo(() => ({ 'X-Subdomain': subdomain }), [subdomain])

  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [summary, setSummary] = useState(null)
  const [members, setMembers] = useState([])
  const [settingEnabled, setSettingEnabled] = useState(null)

  const [activeTier, setActiveTier] = useState(0) // index into [0, ...TIERS]
  const [query, setQuery] = useState('')
  const debounceRef = useRef(null)

  const [selected, setSelected] = useState(null) // member row clicked
  const [detail, setDetail] = useState(null)
  const [detailLoading, setDetailLoading] = useState(false)
  const [detailTab, setDetailTab] = useState('activity')
  const [packages, setPackages] = useState([])

  const tierOptions = [{ label: 'All', value: 0 }, ...TIERS.map((t) => ({ label: `${t}+ pts`, value: t }))]

  const fetchMembers = useCallback(async (opts = {}) => {
    const { silent } = opts
    silent ? setRefreshing(true) : setLoading(true)
    try {
      const params = new URLSearchParams()
      if (activeTier) params.set('min_points', activeTier)
      if (query.trim()) params.set('q', query.trim())

      const res = await fetch(`/api/hotspot_loyalty_customers?${params.toString()}`, {
        headers: authHeaders,
        credentials: 'include',
      })
      if (!res.ok) throw new Error('request failed')
      const data = await res.json()
      setSummary(data)
      setMembers(data.members || [])
    } catch (e) {
      toast.error('Could not load loyalty customers')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [activeTier, query, authHeaders])

  const fetchSetting = useCallback(async () => {
    try {
      const res = await fetch('/api/hotspot_loyalty_setting', {
        headers: authHeaders,
        credentials: 'include',
      })
      if (res.ok) {
        const data = await res.json()
        setSettingEnabled(!!data.enabled)
      }
    } catch (e) { /* non-blocking */ }
  }, [authHeaders])

  const fetchPackages = useCallback(async () => {
    try {
      const res = await fetch('/api/hotspot_packages', {
        headers: authHeaders,
        credentials: 'include',
      })
      if (res.ok) {
        const data = await res.json()
        setPackages(Array.isArray(data) ? data : data.hotspot_packages || [])
      }
    } catch (e) { /* claimable-packages section just won't render */ }
  }, [authHeaders])

  useEffect(() => { fetchSetting(); fetchPackages() }, [fetchSetting, fetchPackages])

  useEffect(() => {
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => fetchMembers(), 300)
    return () => clearTimeout(debounceRef.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTier, query])

  const openMember = async (m) => {
    setSelected(m)
    setDetail(null)
    setDetailTab('activity')
    setDetailLoading(true)
    try {
      const res = await fetch(`/api/hotspot_loyalty_customers/${m.id}`, {
        headers: authHeaders,
        credentials: 'include',
      })
      if (!res.ok) throw new Error('not found')
      const data = await res.json()
      setDetail(data)
    } catch (e) {
      toast.error("Couldn't load this customer")
      setSelected(null)
    } finally {
      setDetailLoading(false)
    }
  }

  const closeDetail = () => { setSelected(null); setDetail(null) }

  // Only packages currently visible on the hotspot page (enabled) are worth
  // showing as claimable — a disabled package isn't something a customer
  // could actually redeem right now.
  const claimable = useMemo(() => {
    if (!detail || !packages.length) return []
    return packages
      .filter((p) => p.enabled !== false)
      .map((p) => ({ name: p.name, price: Number(p.price) }))
      .filter((p) => p.name && Number.isFinite(p.price))
      .sort((a, b) => a.price - b.price)
      .map((p) => ({ ...p, affordable: p.price <= detail.balance }))
  }, [detail, packages])

  const ring = useMemo(() => {
    if (!detail) return { pct: 0, target: null }
    const target = nextTier(detail.balance)
    if (!target) return { pct: 100, target: null }
    const prevTier = [...TIERS].reverse().find((t) => t <= detail.balance) || 0
    const pct = Math.min(100, Math.round(((detail.balance - prevTier) / (target - prevTier)) * 100))
    return { pct, target }
  }, [detail])

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">

        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <h1 className="font-display text-2xl font-bold text-gray-900">Hotspot customers</h1>
            <p className="text-sm text-gray-500 mt-1 max-w-lg">
              Repeat buyers on your hotspot, with what they've spent and the points
              they're holding. A point is worth one shilling when they claim a plan.
            </p>
          </div>
          <button
            onClick={() => fetchMembers({ silent: true })}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white ring-1 ring-gray-200
              text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shrink-0"
          >
            <RefreshCw size={15} className={refreshing ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>

        {settingEnabled === false && (
          <div className="mb-6 flex items-center gap-3 px-4 py-3 rounded-xl bg-amber-50 ring-1 ring-amber-200 text-amber-800 text-sm">
            <Ban size={16} className="shrink-0" />
            Points programme is off — nothing new is being earned right now. Existing balances are kept.
          </div>
        )}

        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          <StatCard
            icon={<Coins size={16} />}
            tint="emerald"
            label="Members with points"
            value={summary?.members_10plus ?? '—'}
            sub={`${summary?.total_buyers ?? 0} buyers in total`}
          />
          <StatCard
            icon={<Wallet size={16} />}
            tint="sky"
            label="Points held"
            value={(summary?.points_held ?? 0).toLocaleString()}
            sub={`worth ${money(summary?.points_held)} in plans`}
          />
          <StatCard
            icon={<TrendingUp size={16} />}
            tint="violet"
            label="Spend from these members"
            value={money(summary?.spend_from_members)}
            sub={`${(summary?.purchases ?? 0).toLocaleString()} purchases`}
          />
          <StatCard
            icon={<ShoppingBag size={16} />}
            tint="amber"
            label="Avg. spend per buyer"
            value={money(
              summary?.total_buyers ? (summary.spend_from_members / summary.total_buyers) : 0
            )}
            sub="across all members"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
          <div className="flex items-center gap-1.5 bg-white rounded-xl ring-1 ring-gray-200 p-1">
            {tierOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setActiveTier(opt.value)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  activeTier === opt.value
                    ? 'bg-emerald-600 text-white'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <div className="relative flex-1 max-w-xs">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Phone or name"
              className="w-full pl-9 pr-8 py-2 rounded-xl bg-white ring-1 ring-gray-200 text-sm
                text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2
                focus:ring-emerald-500/40 transition-shadow"
            />
            {query && (
              <button onClick={() => setQuery('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl ring-1 ring-gray-200 overflow-hidden">
          <div className="hidden sm:grid grid-cols-[1.6fr_0.9fr_0.9fr_1.1fr_0.9fr_28px] gap-3 px-5 py-3
            text-xs font-medium text-gray-400 border-b border-gray-100">
            <span>Customer</span>
            <span>Balance</span>
            <span>Purchases</span>
            <span>Last plan</span>
            <span>Last buy</span>
            <span />
          </div>

          {loading ? (
            <div className="p-10 text-center text-sm text-gray-400">Loading members…</div>
          ) : members.length === 0 ? (
            <div className="p-12 text-center">
              <Gift size={28} className="mx-auto text-gray-300 mb-3" />
              <p className="text-sm text-gray-500">
                {query || activeTier ? 'No members match these filters.' : 'No loyalty members yet.'}
              </p>
            </div>
          ) : (
            <ul>
              {members.map((m, i) => (
                <li key={m.id}>
                  <button
                    onClick={() => openMember(m)}
                    className={`w-full grid grid-cols-2 sm:grid-cols-[1.6fr_0.9fr_0.9fr_1.1fr_0.9fr_28px]
                      gap-3 items-center px-5 py-3.5 text-left hover:bg-gray-50 transition-colors
                      ${i !== members.length - 1 ? 'border-b border-gray-100' : ''}`}
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{m.name || m.phone}</p>
                      {m.name && <p className="text-xs text-gray-400 truncate">{m.phone}</p>}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span className="text-sm font-semibold text-gray-800">{m.balance}</span>
                    </div>
                    <span className="text-sm text-gray-600 hidden sm:block">{m.purchase_count}</span>
                    <span className="text-sm text-gray-600 truncate hidden sm:block">{m.last_package || '—'}</span>
                    <span className="text-sm text-gray-500 hidden sm:block">{relativeTime(m.last_purchase_at)}</span>
                    <ChevronRight size={16} className="text-gray-300 hidden sm:block" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Slide-over detail */}
      <AnimatePresence>
        {selected && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={closeDetail}
              className="fixed inset-0 bg-black/30 backdrop-blur-[2px] z-[70]"
            />
            <motion.aside
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className="fixed top-0 right-0 h-screen w-full sm:w-[440px] bg-white z-[80]
                shadow-2xl overflow-y-auto font-sans"
            >
              <div className="sticky top-0 bg-white/95 backdrop-blur px-5 py-4 border-b border-gray-100
                flex items-center justify-between z-10">
                <p className="text-sm font-medium text-gray-500">Hotspot customer</p>
                <button onClick={closeDetail} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400">
                  <X size={18} />
                </button>
              </div>

              {detailLoading || !detail ? (
                <div className="p-10 text-center text-sm text-gray-400">Loading…</div>
              ) : (
                <div className="px-5 py-6">
                  {/* Identity + points ring */}
                  <div className="flex items-center gap-4 mb-6">
                    <PointsRing pct={ring.pct} balance={detail.balance} />
                    <div className="min-w-0">
                      <p className="text-base font-semibold text-gray-900 truncate">
                        {detail.name || detail.phone}
                      </p>
                      {detail.name && <p className="text-sm text-gray-400">{detail.phone}</p>}
                      <span className="inline-block mt-1.5 text-xs font-medium px-2 py-0.5 rounded-full
                        bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100">
                        {tierLabel(detail.balance)}
                      </span>
                    </div>
                  </div>

                  <div className="mb-6 px-4 py-3 rounded-xl bg-emerald-50/60 ring-1 ring-emerald-100">
                    <p className="text-xs text-emerald-700/80">Points balance</p>
                    <p className="text-2xl font-bold text-emerald-800 mt-0.5">{detail.balance}</p>
                    <p className="text-xs text-emerald-700/70 mt-0.5">worth {money(detail.balance)} of plans</p>
                    {ring.target && (
                      <p className="text-xs text-emerald-700/60 mt-1.5">
                        {ring.target - detail.balance} points to the next tier ({ring.target}+)
                      </p>
                    )}
                  </div>

                  {/* Stat grid */}
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    <MiniStat label="Spent" value={money(detail.total_spent)} />
                    <MiniStat label="Purchases" value={detail.purchase_count} />
                    <MiniStat label="Average buy" value={money(detail.average_buy)} />
                    <MiniStat label="Last plan" value={detail.last_package || '—'} />
                    <MiniStat label="Last buy" value={relativeTime(detail.last_purchase_at)} />
                    <MiniStat label="First seen" value={relativeTime(detail.first_seen_at)} />
                  </div>

                  {/* Claimable packages */}
                  {claimable.length > 0 && (
                    <div className="mb-6">
                      <p className="text-xs font-medium text-gray-400 mb-2">What this balance can claim</p>
                      <div className="rounded-xl ring-1 ring-gray-200 divide-y divide-gray-100 overflow-hidden">
                        {claimable.map((p, idx) => (
                          <div key={idx} className="flex items-center justify-between px-3.5 py-2.5">
                            <span className="text-sm text-gray-700">{p.name}</span>
                            <div className="flex items-center gap-2.5">
                              <span className="text-xs text-gray-400">{p.price} pts</span>
                              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                                p.affordable
                                  ? 'bg-emerald-50 text-emerald-700'
                                  : 'bg-gray-100 text-gray-400'
                              }`}>
                                {p.affordable ? 'can claim' : 'locked'}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Tabs */}
                  <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-xl mb-3 w-fit">
                    {[
                      { id: 'activity', label: 'Points activity' },
                      { id: 'payments', label: 'Payments' },
                    ].map((t) => (
                      <button
                        key={t.id}
                        onClick={() => setDetailTab(t.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                          detailTab === t.id ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'
                        }`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>

                  {detailTab === 'activity' ? (
                    <ActivityList items={detail.activity || []} />
                  ) : (
                    <PaymentsList items={(detail.activity || []).filter((a) => a.kind === 'earn')} />
                  )}
                </div>
              )}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Presentational bits
// ---------------------------------------------------------------------------

const TINTS = {
  emerald: 'bg-emerald-50 text-emerald-600',
  sky: 'bg-sky-50 text-sky-600',
  violet: 'bg-violet-50 text-violet-600',
  amber: 'bg-amber-50 text-amber-600',
}

const StatCard = ({ icon, tint, label, value, sub }) => (
  <div className="bg-white rounded-2xl ring-1 ring-gray-200 p-4">
    <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-3 ${TINTS[tint]}`}>
      {icon}
    </div>
    <p className="text-lg font-bold text-gray-900 leading-tight">{value}</p>
    <p className="text-xs text-gray-500 mt-0.5">{label}</p>
    {sub && <p className="text-[11px] text-gray-400 mt-1">{sub}</p>}
  </div>
)

const MiniStat = ({ label, value }) => (
  <div className="px-3.5 py-2.5 rounded-xl bg-gray-50">
    <p className="text-[11px] text-gray-400">{label}</p>
    <p className="text-sm font-medium text-gray-800 truncate mt-0.5">{value}</p>
  </div>
)

// The one deliberately bold element: a conic-gradient progress ring showing
// how close this member is to their next points tier.
const PointsRing = ({ pct, balance }) => (
  <div
    className="relative w-16 h-16 rounded-full shrink-0 flex items-center justify-center"
    style={{
      background: `conic-gradient(#059669 ${pct * 3.6}deg, #e5e7eb 0deg)`,
    }}
  >
    <div className="w-[52px] h-[52px] rounded-full bg-white flex items-center justify-center">
      <span className="text-sm font-bold text-gray-900">{balance}</span>
    </div>
  </div>
)

const ActivityList = ({ items }) => {
  if (!items.length) return <EmptyRow label="No points activity yet." />
  const kindMeta = {
    earn: { icon: <ArrowUpRight size={13} />, tint: 'text-emerald-600 bg-emerald-50', verb: 'Bought a plan' },
    claim: { icon: <Gift size={13} />, tint: 'text-violet-600 bg-violet-50', verb: 'Claimed a plan' },
    expire: { icon: <ArrowDownRight size={13} />, tint: 'text-rose-600 bg-rose-50', verb: 'Points expired' },
  }
  return (
    <ul className="rounded-xl ring-1 ring-gray-200 divide-y divide-gray-100 overflow-hidden">
      {items.map((a, i) => {
        const meta = kindMeta[a.kind] || kindMeta.earn
        return (
          <li key={i} className="flex items-center gap-3 px-3.5 py-2.5">
            <span className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${meta.tint}`}>
              {meta.icon}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm text-gray-800">{meta.verb}</p>
              <p className="text-[11px] text-gray-400">{dateTime(a.created_at)}</p>
            </div>
            <div className="text-right shrink-0">
              {a.amount != null && <p className="text-xs text-gray-500">{money(a.amount)}</p>}
              <p className={`text-xs font-semibold ${a.points >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                {a.points >= 0 ? '+' : ''}{a.points} → {a.balance_after}
              </p>
            </div>
          </li>
        )
      })}
    </ul>
  )
}

const PaymentsList = ({ items }) => {
  if (!items.length) return <EmptyRow label="No payments on record." />
  return (
    <ul className="rounded-xl ring-1 ring-gray-200 divide-y divide-gray-100 overflow-hidden">
      {items.map((a, i) => (
        <li key={i} className="flex items-center gap-3 px-3.5 py-2.5">
          <span className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0 bg-sky-50 text-sky-600">
            <Clock size={13} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm text-gray-800 truncate">{a.package || 'Hotspot plan'}</p>
            <p className="text-[11px] text-gray-400">{dateTime(a.created_at)}</p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-sm font-medium text-gray-800">{money(a.amount)}</p>
            <span className="text-[11px] font-medium text-emerald-600">completed</span>
          </div>
        </li>
      ))}
    </ul>
  )
}

const EmptyRow = ({ label }) => (
  <div className="rounded-xl ring-1 ring-gray-200 py-8 text-center">
    <Sparkles size={18} className="mx-auto text-gray-300 mb-2" />
    <p className="text-sm text-gray-400">{label}</p>
  </div>
)

export default HotspotLoyaltyCustomers