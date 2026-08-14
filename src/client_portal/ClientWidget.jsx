import { Link, useNavigate } from 'react-router-dom'
import { useState, useEffect, useCallback, useRef } from 'react'
import { useApplicationSettings } from '../settings/ApplicationSettings'
import SpeedTestCard from './SpeedTestCard'

/* ─── Static demo data ─── */
const PLANS = [
  { id: 1, name: "Basic Fiber",    speed: "10 Mbps",  price: 999,  color: "#f59e0b", features: ["Unlimited data","Email support","1 device"] },
  { id: 2, name: "Home Plus",      speed: "50 Mbps",  price: 1999, color: "#10b981", popular: true, features: ["Unlimited data","Priority support","5 devices","Free router"] },
  { id: 3, name: "Business Pro",   speed: "100 Mbps", price: 3499, color: "#3b82f6", features: ["Unlimited data","24/7 support","10 devices","Static IP","SLA guarantee"] },
  { id: 4, name: "Ultra 5G",       speed: "500 Mbps", price: 5999, color: "#8b5cf6", features: ["Unlimited data","Dedicated manager","Unlimited devices","Static IP","SLA","Cloud backup"] },
]

const TRANSACTIONS = [
  { id: "TXN-9841", date: "Apr 14, 2026", amount: 1999, method: "M-Pesa",       ref: "QHJ2839KL", status: "Success" },
  { id: "TXN-9720", date: "Mar 14, 2026", amount: 1999, method: "M-Pesa",       ref: "PGT9183AB", status: "Success" },
  { id: "TXN-9603", date: "Feb 14, 2026", amount: 1999, method: "Bank Transfer", ref: "EQ2029112",  status: "Success" },
  { id: "TXN-9501", date: "Jan 14, 2026", amount: 1999, method: "M-Pesa",       ref: "NKL9283RT", status: "Success" },
  { id: "TXN-9388", date: "Dec 14, 2025", amount: 1999, method: "M-Pesa",       ref: "WQM0293HS", status: "Success" },
  { id: "TXN-9271", date: "Nov 14, 2025", amount: 1500, method: "M-Pesa",       ref: "XYZ1928DF", status: "Success" },
]

const TICKETS = [
  { id: "TKT-1042", subject: "Slow speeds in the evening", status: "In Progress", date: "2025-03-28", priority: "High" },
  { id: "TKT-1031", subject: "Router keeps disconnecting",  status: "Resolved",    date: "2025-03-15", priority: "Medium" },
  { id: "TKT-1018", subject: "Billing discrepancy Feb",     status: "Resolved",    date: "2025-02-20", priority: "Low" },
]

const MONTHS = ["Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec","Jan","Feb","Mar"]
const USAGE_DATA = [40,65,55,80,72,90,68,85,78,92,88,76]

/* ─── Helpers ─── */
const statusStyle = s => s === "Resolved"    ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                       : s === "In Progress" ? "bg-amber-100 text-amber-700 border-amber-200"
                       :                       "bg-blue-100 text-blue-700 border-blue-200"

const priorityStyle = p => p === "High"   ? "bg-red-100 text-red-600 border-red-200"
                         : p === "Medium" ? "bg-amber-100 text-amber-700 border-amber-200"
                         :                  "bg-green-100 text-green-700 border-green-200"

/* ─── Live Speed Gauge ─── */
function SpeedGauge({ label, value, max, unit, color }) {
  const pct = Math.min(value / max, 1)
  const r = 52, cx = 60, cy = 60
  const circ = Math.PI * r  // half circle
  const dash = pct * circ
  const strokeColor = color

  return (
    <div className="flex flex-col items-center gap-1">
      <svg width="120" height="72" viewBox="0 0 120 80">
        {/* track */}
        <path d={`M ${cx - r},${cy} A ${r},${r} 0 0 1 ${cx + r},${cy}`}
          fill="none" stroke="#e5e7eb" strokeWidth="10" strokeLinecap="round" />
        {/* fill */}
        <path d={`M ${cx - r},${cy} A ${r},${r} 0 0 1 ${cx + r},${cy}`}
          fill="none" stroke={strokeColor} strokeWidth="10" strokeLinecap="round"
          strokeDasharray={`${dash} ${circ}`}
          style={{ transition: "stroke-dasharray 1s ease" }} />
        {/* value */}
        <text x={cx} y={cy - 4} textAnchor="middle" fontSize="18" fontWeight="700" fill="#111827">{value}</text>
        <text x={cx} y={cy + 12} textAnchor="middle" fontSize="11" fill="#6b7280">{unit}</text>
      </svg>
      <span className="text-xs font-semibold text-gray-500 tracking-wide uppercase">{label}</span>
    </div>
  )
}

/* ─── Live Usage Widget ─── */
function LiveUsageCard({ planSpeed }) {
  const [download, setDownload] = useState(18.4)
  const [upload, setUpload]     = useState(4.2)
  const [latency, setLatency]   = useState(12)
  const [online, setOnline]     = useState(true)
  const [sessionTime, setSessionTime] = useState(7234) // seconds
  const [totalUsed, setTotalUsed]     = useState(42.7)  // GB this month

  useEffect(() => {
    const id = setInterval(() => {
      setDownload(v => +(Math.max(0.5, v + (Math.random() - 0.48) * 4)).toFixed(1))
      setUpload(v   => +(Math.max(0.1, v + (Math.random() - 0.48) * 1.5)).toFixed(1))
      setLatency(v  => Math.max(2, Math.min(80, v + Math.round((Math.random() - 0.48) * 6))))
      setSessionTime(v => v + 1)
      setTotalUsed(v => +(v + 0.001).toFixed(3))
    }, 1800)
    return () => clearInterval(id)
  }, [])

  const fmt = s => {
    const h = String(Math.floor(s / 3600)).padStart(2,'0')
    const m = String(Math.floor((s % 3600) / 60)).padStart(2,'0')
    const sec = String(s % 60).padStart(2,'0')
    return `${h}:${m}:${sec}`
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
          </span>
          <span className="text-sm font-bold text-gray-800 tracking-tight">Live Connection</span>
        </div>
        <span className="text-xs font-mono text-gray-400 bg-gray-50 px-2.5 py-1 rounded-lg border border-gray-100">
          Session: {fmt(sessionTime)}
        </span>
      </div>

      {/* gauges */}
      <div className="grid grid-cols-3 gap-0 divide-x divide-gray-100 py-4 px-2">
        <SpeedGauge label="Download" value={download} max={parseFloat(planSpeed) || 50} unit="Mbps" color="#10b981" />
        <SpeedGauge label="Upload"   value={upload}   max={parseFloat(planSpeed) * 0.4 || 20} unit="Mbps" color="#3b82f6" />
        <SpeedGauge label="Latency"  value={latency}  max={100} unit="ms"   color={latency > 50 ? "#ef4444" : "#f59e0b"} />
      </div>

      {/* stats bar */}
      <div className="grid grid-cols-2 gap-px bg-gray-100 border-t border-gray-100">
        <div className="bg-white px-5 py-3">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-0.5">Used This Month</p>
          <p className="text-lg font-bold text-gray-800">{totalUsed.toFixed(1)} <span className="text-sm font-normal text-gray-500">GB</span></p>
        </div>
        <div className="bg-white px-5 py-3">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-0.5">Plan Speed</p>
          <p className="text-lg font-bold text-gray-800">{planSpeed}</p>
        </div>
      </div>
    </div>
  )
}

/* ─── Logout Modal ─── */
function LogoutModal({ onCancel }) {
  const [busy, setBusy] = useState(false)
  const navigate = useNavigate()
  const subdomain = window.location.hostname.split('.')[0]

  const handleLogout = async () => {
    setBusy(true)
    try {
      const res = await fetch('/api/customer-logout', {
        method: 'POST', headers: { 'X-Subdomain': subdomain }
      })
      if (res.ok) navigate('/client-login')
    } catch { } finally { setBusy(false) }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center">
        <div className="w-14 h-14 rounded-full bg-red-50 border border-red-100 flex items-center justify-center mx-auto mb-4 text-2xl">👋</div>
        <h3 className="text-lg font-bold text-gray-800 mb-1">Sign Out?</h3>
        <p className="text-sm text-gray-500 mb-6">You'll be returned to the login screen.</p>
        <div className="flex gap-3">
          <button onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-semibold text-sm hover:bg-gray-50 transition">
            Cancel
          </button>
          <button onClick={handleLogout} disabled={busy}
            className="flex-1 py-2.5 rounded-xl bg-red-50 border border-red-200 text-red-600 font-semibold text-sm hover:bg-red-100 transition">
            {busy ? "Signing out…" : "Sign Out"}
          </button>
        </div>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════
   MAIN PORTAL
══════════════════════════════════════════════════════════ */
export default function ISPPortal() {
  const [activeTab, setActiveTab]             = useState("dashboard")
  const [showLogout, setShowLogout]           = useState(false)
  const [sidebarOpen, setSidebarOpen]         = useState(false)
  const [payMethod, setPayMethod]             = useState("mpesa")
  const [mpesaPhone, setMpesaPhone]           = useState("0712 345 678")
  const [cardNumber, setCardNumber]           = useState("")
  const [bankName, setBankName]               = useState("")
  const [payLoading, setPayLoading]           = useState(false)
  const [paySuccess, setPaySuccess]           = useState(false)
  const [ticketSubject, setTicketSubject]     = useState("")
  const [ticketDesc, setTicketDesc]           = useState("")
  const [ticketPriority, setTicketPriority]   = useState("Medium")
  const [ticketSuccess, setTicketSuccess]     = useState(false)
  const [rating, setRating]                   = useState(0)
  const [feedbackText, setFeedbackText]       = useState("")
  const [feedbackOk, setFeedbackOk]           = useState(false)
  const [upgradeSelected, setUpgradeSelected] = useState(null)
  const [upgradeOk, setUpgradeOk]             = useState(false)
  const [txFilter, setTxFilter]               = useState("all")
  const [transactions, setTransactions] = useState(TRANSACTIONS)
  const [supportTickets, setSupportTickets] = useState(TICKETS)
  const navigate = useNavigate()

  const { currentCustomer, settingsformData, setWelcomeMessage,  setWelcome,
    companySettings,setCompanySettings,
    adminSettings, setAdminSettings, } = useApplicationSettings()



      const {company_name, contact_info, email_info, logo_preview} = companySettings

  const subdomain = window.location.hostname.split('.')[0]

  const currentPlan  = PLANS[1]
  const expiryDate   = "May 14, 2026"
  const daysLeft     = 13

  const handlePay = () => {
    setPayLoading(true)
    setTimeout(() => { setPayLoading(false); setPaySuccess(true) }, 2000)
  }




  const handleGetCompanySettings = useCallback(
    async() => {
      try {
        const response = await fetch('/api/allow_get_company_settings', {
          headers: {
            'X-Subdomain': subdomain,
          },
        })
        const newData = await response.json()
        if (response.ok) {
          // setcompanySettings(newData)
          const { contact_info, company_name, email_info, logo_url,
            customer_support_phone_number,agent_email ,customer_support_email
           } = newData

           setLogoUrl(logo_url)
          setCompanySettings((prevData)=> ({...prevData, 
            contact_info, company_name, email_info,
            customer_support_phone_number,agent_email ,customer_support_email,
          
            logo_preview: logo_url
          }))
  
        }else{
        }
      } catch (error) {
      
      }
    },
    [setCompanySettings, subdomain],
  )



  const fetchPackages = useCallback(async () => {
    try {
      await fetch('/api/allow_get_packages', { headers: { 'X-Subdomain': subdomain } })
    } catch {}
  }, [subdomain])



// /api/allow_get_pp_poe_mpesa_revenues




  const getRevenue = useCallback(
    async() => {
      
      try {
        const response = await fetch(`/api/allow_get_pp_poe_mpesa_revenues?subscriber_id=${currentCustomer.id}`, {

          headers: { 'X-Subdomain': subdomain },
        })
        const data = await response.json()
        if (response.ok) {
          setTransactions(data)
        } else {
          
        }
      }
      catch (error) {
        console.log(error)
      }
    },
    []
  )




  const getSubscriptions = useCallback(
    async() => {
      
      try {
        const response = await fetch(`/api/allow_get_subscriptions?subscriber_id=${currentCustomer.id}`, {

          headers: { 'X-Subdomain': subdomain },
        })
        const data = await response.json()
      }
      catch (error) {
        console.log(error)
      }
    },
    []
  )





  const getSupportTickets = useCallback(
    async() => {
      
      try {
        const response = await fetch(`/api/allow_get_support_ticket?subscriber_id=${currentCustomer.id}`, {

          headers: { 'X-Subdomain': subdomain },
        })
        const data = await response.json()

        if (response.ok){
setSupportTickets(data)
        }
      }
      catch (error) {
        console.log(error)
      }
    },
    []
  )




  useEffect(() => { 
    
    fetchPackages() 
     getSubscriptions() 
     getRevenue()
     getSupportTickets()
     handleGetCompanySettings()


  }, [fetchPackages, getSubscriptions, getRevenue, getSupportTickets, handleGetCompanySettings])

  const nav = [
    { id: "dashboard",    icon: "⊞", label: "Dashboard"    },
    { id: "usage",        icon: "📶", label: "Live Usage"   },
    { id: "speedtest",    icon: "⚡", label: "Speed Test"   },
    { id: "transactions", icon: "💳", label: "Transactions" },
    { id: "pay",          icon: "₿",  label: "Pay Bill"     },
    { id: "plans",        icon: "◈",  label: "Plans"        },
    { id: "upgrade",      icon: "↑",  label: "Upgrade"      },
    { id: "tickets",      icon: "◎",  label: "Support"      },
    { id: "account",      icon: "◉",  label: "Account"      },
  ]

  const filteredTx = txFilter === "all" ? transactions
    : transactions.filter(t => t?.payment_method.toLowerCase().includes(txFilter))

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans overflow-hidden"
      style={{ fontFamily: "'Plus Jakarta Sans','DM Sans','Segoe UI',sans-serif" }}>

      {/* inject font */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        .tab-active { background: linear-gradient(135deg,#ecfdf5,#d1fae5); color:#065f46; border-left:3px solid #10b981; }
        .tab-inactive { color:#6b7280; border-left:3px solid transparent; }
        .tab-inactive:hover { background:#f9fafb; color:#374151; }
        ::-webkit-scrollbar { width:5px; }
        ::-webkit-scrollbar-track { background:transparent; }
        ::-webkit-scrollbar-thumb { background:#d1d5db; border-radius:99px; }
      `}</style>

      {showLogout && <LogoutModal onCancel={() => setShowLogout(false)} />}

      {/* ── Sidebar ── */}
      <aside className={`${sidebarOpen ? 'w-56' : 'w-16'} bg-white border-r border-gray-100 flex flex-col
        transition-all duration-200 z-20 shrink-0 shadow-sm`}>

        {/* Logo */}
        <div className="h-16 flex items-center justify-center border-b border-gray-100 px-3">
         
          {sidebarOpen && (
            <span className="ml-2.5 font-extrabold text-gray-800 text-sm whitespace-nowrap truncate">
              {company_name}
            </span>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 py-3 overflow-y-auto">
          {nav.map(n => (
            <button key={n.id}
              onClick={() => { setActiveTab(n.id); setSidebarOpen(false) }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 text-sm font-medium transition-all
                ${activeTab === n.id ? 'tab-active' : 'tab-inactive'}`}>
              <span className="text-base w-5 text-center shrink-0">{n.icon}</span>
              {sidebarOpen && <span className="whitespace-nowrap">{n.label}</span>}
            </button>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-2 border-t border-gray-100 space-y-1">
          <button onClick={() => setShowLogout(true)}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl
              text-red-800 hover:bg-red-50 hover:text-red-500 transition text-sm font-medium">
            <span className="text-base w-5 text-center shrink-0">⏻</span>
            {sidebarOpen && <span className="whitespace-nowrap">Sign Out</span>}
          </button>
          <button onClick={() => setSidebarOpen(o => !o)}
            className="w-full flex items-center justify-center py-1.5 rounded-xl
              text-black hover:bg-gray-50 transition text-xs">
            {sidebarOpen ? '◀' : '▶'}
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden">

        {/* Topbar */}
        <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between
          px-6 sticky top-0 z-10 shadow-sm">
          <div className="flex items-center gap-3">
            <h1 className="text-base font-bold text-gray-800">
              {nav.find(n => n.id === activeTab)?.label}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <div className={`text-xs font-semibold px-3 py-1.5 rounded-full border
              ${daysLeft <= 7
                ? 'bg-red-50 text-red-600 border-red-200'
                : 'bg-emerald-50 text-emerald-700 border-emerald-200'}`}>
              Expires {expiryDate}
            </div>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500
              flex items-center justify-center text-white font-bold text-xs cursor-pointer"
              onClick={() => setActiveTab("account")}>
              {currentCustomer?.name?.slice(0,2)?.toUpperCase() || "CU"}
            </div>
          </div>
        </header>

        <div className="p-5 md:p-7 max-w-5xl mx-auto">

          {/* ══ DASHBOARD ══ */}
          {activeTab === "dashboard" && (
            <div className="space-y-5">
              {/* Greeting */}
              <div>
                <h2 className="text-2xl font-extrabold text-gray-800">
                  Welcome back, {currentCustomer?.name?.split(' ')[0] || 'Customer'} 👋
                </h2>
                <p className="text-sm text-gray-500 mt-0.5">Here's your internet account at a glance.</p>
              </div>

              {/* Stat cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: "Current Plan",    value: currentPlan.name,                          sub: currentPlan.speed,         accent: "bg-emerald-500", icon: "📡" },
                  { label: "Days Left",        value: daysLeft,                                   sub: "until renewal",           accent: daysLeft <= 7 ? "bg-red-500" : "bg-amber-400", icon: "⏳" },
                  { label: "Monthly Cost",     value: `KES ${currentPlan.price.toLocaleString()}`, sub: "per month",               accent: "bg-blue-500",    icon: "💰" },
                  { label: "Payments Made",    value: transactions.length,                        sub: "total transactions",      accent: "bg-violet-500",  icon: "✅" },
                ].map(c => (
                  <div key={c.label} className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm
                    hover:shadow-md transition-shadow relative overflow-hidden group">
                    <div className={`absolute top-0 right-0 w-16 h-16 rounded-bl-3xl ${c.accent} opacity-10 group-hover:opacity-20 transition-opacity`} />
                    <div className="text-2xl mb-2">{c.icon}</div>
                    <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-1">{c.label}</p>
                    <p className="text-xl font-extrabold text-gray-800 leading-tight">{c.value}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{c.sub}</p>
                  </div>
                ))}
              </div>

              {/* Live usage + plan */}
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
                <div className="lg:col-span-3">
                  <LiveUsageCard planSpeed={currentPlan.speed} />
                </div>

                <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Active Plan</p>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-11 h-11 rounded-xl bg-emerald-50 border border-emerald-100
                      flex items-center justify-center text-emerald-600 font-black text-lg">◈</div>
                    <div>
                      <p className="font-bold text-gray-800 text-base">{currentPlan.name}</p>
                      <p className="text-xs text-emerald-600 font-semibold">{currentPlan.speed}</p>
                    </div>
                  </div>
                  <div className="space-y-2 mb-5">
                    {currentPlan.features.map(f => (
                      <div key={f} className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                          <span className="text-emerald-600 text-[9px] font-black">✓</span>
                        </div>
                        <span className="text-sm text-gray-600">{f}</span>
                      </div>
                    ))}
                  </div>
                  <button onClick={() => setActiveTab("pay")}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500
                      text-white font-bold text-sm hover:from-emerald-600 hover:to-teal-600 transition shadow-sm">
                    Renew Now
                  </button>
                </div>
              </div>

              {/* Usage chart */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">
                  Data Usage — Last 12 Months (%)
                </p>
                <div className="flex items-end gap-1.5 h-28">
                  {USAGE_DATA.map((v, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                      <div
                        className={`w-full rounded-t-md transition-all duration-500
                          ${i === 11 ? 'bg-emerald-500' : 'bg-emerald-100'}`}
                        style={{ height: `${v}%` }}
                      />
                      <span className="text-[9px] text-gray-400 font-medium">{MONTHS[i]}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent transactions preview */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Recent Payments</p>
                  <button onClick={() => setActiveTab("transactions")}
                    className="text-xs text-emerald-600 font-semibold hover:text-emerald-700">
                    View all →
                  </button>
                </div>


                <div className="space-y-2">
                  {transactions.slice(0,3).map(t => (
                    <div key={t.id} className="flex items-center gap-4 p-3 rounded-xl bg-gray-50
                      hover:bg-gray-100 transition group">
                      <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center
                        text-emerald-600 font-bold text-sm shrink-0">
                        {t.payment_method === "M-Pesa" ? "M" : "🏦"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-800 truncate">{t?.payment_method || t.method}</p>
                        <p className="text-xs text-gray-400 font-mono">{t?.reference || t.ref}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-sm font-bold text-gray-800">KES {t?.amount.toLocaleString()}</p>
                        <p className="text-xs text-gray-400">{t?.time_paid || t.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ══ LIVE USAGE ══ */}
          {activeTab === "usage" && (
            <div className="space-y-5">
              <div>
                <h2 className="text-xl font-extrabold text-gray-800">Live Connection Stats</h2>
                <p className="text-sm text-gray-500 mt-0.5">Real-time data for your active PPPoE session.</p>
              </div>
              <LiveUsageCard planSpeed={currentPlan.speed} />

              {/* monthly usage bar */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Monthly Fair-Use Progress</p>
                  <span className="text-sm font-bold text-gray-700">42.7 GB / Unlimited</span>
                </div>
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full"
                    style={{ width: '68%', transition: 'width 1s ease' }} />
                </div>
                <div className="flex justify-between mt-1.5">
                  <span className="text-xs text-gray-400">0 GB</span>
                  <span className="text-xs text-gray-400">Fair use: ~63 GB</span>
                </div>
              </div>

              {/* historical chart */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">
                  Historical Usage (%)
                </p>
                <div className="flex items-end gap-1.5 h-32">
                  {USAGE_DATA.map((v, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                      <span className="text-[9px] text-gray-400">{v}%</span>
                      <div
                        className={`w-full rounded-t-md ${i === 11 ? 'bg-emerald-500' : 'bg-emerald-100'}`}
                        style={{ height: `${v * 1.1}%` }}
                      />
                      <span className="text-[9px] text-gray-400">{MONTHS[i]}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ══ SPEED TEST ══ */}
          {activeTab === "speedtest" && (
            <div className="space-y-5">
              <div>
                <h2 className="text-xl font-extrabold text-gray-800">Speed Test</h2>
                <p className="text-sm text-gray-500 mt-0.5">
                  Check your connection against your {currentPlan.name} plan ({currentPlan.speed}).
                </p>
              </div>
              <SpeedTestCard planSpeed={currentPlan.speed} />
            </div>
          )}

          {/* ══ TRANSACTIONS ══ */}
          {activeTab === "transactions" && (
            <div className="space-y-5">
              <div>
                <h2 className="text-xl font-extrabold text-gray-800">Payment History</h2>
                <p className="text-sm text-gray-500 mt-0.5">All your payments and transactions.</p>
              </div>

              {/* summary cards */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {[
                  { label: "Total Paid",     value: `KES ${transactions.reduce((a,t)=>a+t.amount,0).toLocaleString()}` },
                  { label: "Transactions",   value: transactions.length },
                ].map(s => (
                  <div key={s.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">{s.label}</p>
                    <p className="text-lg font-extrabold text-gray-800">{s.value}</p>
                  </div>
                ))}
              </div>

              {/* filter pills */}
              <div className="flex gap-2 flex-wrap">
                {["all","mpesa","bank"].map(f => (
                  <button key={f} onClick={() => setTxFilter(f)}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold border transition
                      ${txFilter === f
                        ? 'bg-emerald-500 text-white border-emerald-500'
                        : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'}`}>
                    {f === "all" ? "All" : f === "mpesa" ? "M-Pesa" : "Bank Transfer"}
                  </button>
                ))}
              </div>

              {/* table */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                {/* head */}
                <div className="hidden sm:grid grid-cols-[1fr_1fr_1fr_1fr_1fr] px-5 py-3
                  bg-gray-50 border-b border-gray-100">
                  {["Transaction ID","Date","Method","Reference","Amount"].map(h => (
                    <span key={h} className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{h}</span>
                  ))}
                </div>

                {filteredTx.map((t, i) => (
                  <div key={t.id}
                    className={`grid grid-cols-1 sm:grid-cols-[1fr_1fr_1fr_1fr_1fr] gap-y-1 sm:gap-y-0
                      px-5 py-4 hover:bg-gray-50 transition
                      ${i < filteredTx.length - 1 ? 'border-b border-gray-100' : ''}`}>
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center
                        text-emerald-600 font-bold text-xs shrink-0">
                        {t.payment_method === "M-Pesa" ? "M" : "🏦"}
                      </div>
                      <span className="font-mono text-xs text-gray-500">{t.id}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">{t?.time_paid || t.date}</div>
                    <div className="flex items-center text-sm font-medium text-gray-700">{t?.payment_method || t.method}</div>
                    <div className="flex items-center font-mono text-xs text-gray-400">{t?.reference || t.ref}</div>
                    <div className="flex items-center justify-between sm:justify-start gap-3">
                      <span className="text-sm font-bold text-gray-800">KES {t?.amount}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ══ PAY BILL ══ */}
          {activeTab === "pay" && (
            <div className="max-w-lg space-y-4">
              {paySuccess ? (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 text-center">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 border-2 border-emerald-300
                    flex items-center justify-center mx-auto mb-4 text-3xl">✓</div>
                  <h2 className="text-xl font-extrabold text-gray-800 mb-2">Payment Successful!</h2>
                  <p className="text-sm text-gray-500 mb-6">Plan renewed until May 14, 2026.</p>
                  <button onClick={() => { setPaySuccess(false); setActiveTab("dashboard") }}
                    className="px-8 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500
                      text-white font-bold text-sm hover:from-emerald-600 hover:to-teal-600 transition">
                    Back to Dashboard
                  </button>
                </div>
              ) : (
                <>
                  {/* Amount due */}
                  <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 text-white shadow-md">
                    <p className="text-xs font-bold uppercase tracking-widest opacity-80 mb-1">Amount Due</p>
                    <p className="text-4xl font-black mb-1">KES {currentPlan.price.toLocaleString()}</p>
                    <p className="text-sm opacity-80">Expires {expiryDate} · {daysLeft} days left</p>
                  </div>

                  {/* Method select */}
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Payment Method</p>
                    <div className="grid grid-cols-3 gap-3 mb-5">
                      {[
                        { id:"mpesa", label:"M-Pesa",        icon:"📱", ring:"ring-emerald-400" },
                        { id:"bank",  label:"Bank Transfer",  icon:"🏦", ring:"ring-blue-400"    },
                        { id:"card",  label:"Debit/Credit",   icon:"💳", ring:"ring-amber-400"   },
                      ].map(m => (
                        <button key={m.id} onClick={() => setPayMethod(m.id)}
                          className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition
                            ${payMethod === m.id
                              ? `border-emerald-400 bg-emerald-50 ring-2 ${m.ring}`
                              : 'border-gray-200 hover:border-gray-300'}`}>
                          <span className="text-2xl">{m.icon}</span>
                          <span className={`text-xs font-bold ${payMethod === m.id ? 'text-emerald-700' : 'text-gray-500'}`}>
                            {m.label}
                          </span>
                        </button>
                      ))}
                    </div>

                    {payMethod === "mpesa" && (
                      <div>
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-1.5">
                          M-Pesa Phone Number
                        </label>
                        <input value={mpesaPhone} onChange={e => setMpesaPhone(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-800
                            focus:outline-none focus:ring-2 focus:ring-emerald-400 transition" />
                        <p className="text-xs text-gray-400 mt-2">You'll receive an STK push to confirm payment.</p>
                      </div>
                    )}

                    {payMethod === "bank" && (
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                          <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-0.5">Account Name</p>
                            <p className="text-sm font-semibold text-gray-700">NetLink Internet Services Ltd</p>
                          </div>
                          <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-0.5">Account No.</p>
                            <p className="text-sm font-semibold text-gray-700">1234567890</p>
                          </div>
                        </div>
                        <input value={bankName} onChange={e => setBankName(e.target.value)}
                          placeholder="Your bank name (for reference)"
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-800
                            focus:outline-none focus:ring-2 focus:ring-emerald-400 transition" />
                      </div>
                    )}

                    {payMethod === "card" && (
                      <div className="space-y-3">
                        <input value={cardNumber} onChange={e => setCardNumber(e.target.value)}
                          placeholder="1234 5678 9012 3456"
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-800
                            focus:outline-none focus:ring-2 focus:ring-emerald-400 transition" />
                        <div className="grid grid-cols-2 gap-3">
                          <input placeholder="MM/YY"
                            className="px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-800
                              focus:outline-none focus:ring-2 focus:ring-emerald-400 transition" />
                          <input placeholder="CVV"
                            className="px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-800
                              focus:outline-none focus:ring-2 focus:ring-emerald-400 transition" />
                        </div>
                      </div>
                    )}
                  </div>

                  <button onClick={handlePay} disabled={payLoading}
                    className={`w-full py-4 rounded-xl font-black text-base transition
                      ${payLoading
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:from-emerald-600 hover:to-teal-600 shadow-md'}`}>
                    {payLoading ? "Processing…" : `Pay KES ${currentPlan.price.toLocaleString()}`}
                  </button>
                </>
              )}
            </div>
          )}

          {/* ══ PLANS ══ */}
          {activeTab === "plans" && (
            <div className="space-y-5">
              <div>
                <h2 className="text-xl font-extrabold text-gray-800">Available Plans</h2>
                <p className="text-sm text-gray-500 mt-0.5">Your current plan is highlighted. Upgrade anytime.</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {PLANS.map(p => (
                  <div key={p.id}
                    className={`bg-white rounded-2xl border-2 shadow-sm p-5 relative transition-all
                      hover:shadow-md hover:-translate-y-0.5
                      ${p.id === currentPlan.id ? 'border-emerald-400 ring-2 ring-emerald-200' : 'border-gray-100'}`}>
                    {p.popular && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-violet-600 text-white
                        text-[10px] font-black px-3 py-1 rounded-full tracking-wide">POPULAR</div>
                    )}
                    {p.id === currentPlan.id && (
                      <div className="absolute -top-3 right-4 bg-emerald-500 text-white
                        text-[10px] font-black px-3 py-1 rounded-full">ACTIVE</div>
                    )}
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 text-lg"
                      style={{ background: `${p.color}18` }}>◈</div>
                    <p className="font-extrabold text-gray-800 text-base mb-0.5">{p.name}</p>
                    <p className="text-2xl font-black mb-0.5" style={{ color: p.color }}>{p.speed}</p>
                    <p className="text-sm text-gray-400 mb-4">KES {p.price.toLocaleString()}/mo</p>
                    <div className="space-y-2 mb-4">
                      {p.features.map(f => (
                        <div key={f} className="flex items-center gap-2">
                          <span className="text-[10px] font-black text-emerald-500">✓</span>
                          <span className="text-xs text-gray-600">{f}</span>
                        </div>
                      ))}
                    </div>
                    {p.id !== currentPlan.id && (
                      <button onClick={() => { setUpgradeSelected(p); setActiveTab("upgrade") }}
                        className="w-full py-2 rounded-xl border-2 font-bold text-xs transition hover:bg-gray-50"
                        style={{ borderColor: p.color, color: p.color }}>
                        Switch Plan
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ══ UPGRADE ══ */}
          {activeTab === "upgrade" && (
            <div className="max-w-lg space-y-4">
              {upgradeOk ? (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 text-center">
                  <div className="text-5xl mb-4">🚀</div>
                  <h2 className="text-xl font-extrabold text-gray-800 mb-2">Request Submitted!</h2>
                  <p className="text-sm text-gray-500 mb-6">
                    Upgrade to <strong>{upgradeSelected?.name}</strong> received. We'll call you within 24 hrs.
                  </p>
                  <button onClick={() => { setUpgradeOk(false); setUpgradeSelected(null); setActiveTab("dashboard") }}
                    className="px-8 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500
                      text-white font-bold text-sm hover:opacity-90 transition">
                    Back to Dashboard
                  </button>
                </div>
              ) : (
                <>
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Current Plan</p>
                    <p className="text-lg font-extrabold text-gray-800">{currentPlan.name} — {currentPlan.speed}</p>
                  </div>
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Select New Plan</p>
                  <div className="space-y-3">
                    {PLANS.filter(p => p.id !== currentPlan.id).map(p => (
                      <button key={p.id} onClick={() => setUpgradeSelected(p)}
                        className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition
                          ${upgradeSelected?.id === p.id ? 'border-emerald-400 bg-emerald-50' : 'border-gray-100 bg-white hover:border-gray-200'}`}>
                        <div className="w-11 h-11 rounded-xl flex items-center justify-center text-lg shrink-0"
                          style={{ background: `${p.color}18` }}>◈</div>
                        <div className="flex-1">
                          <p className="font-bold text-gray-800 text-sm">{p.name}</p>
                          <p className="text-xs text-gray-500">{p.speed}</p>
                        </div>
                        <p className="font-black text-base shrink-0" style={{ color: p.color }}>
                          KES {p.price.toLocaleString()}
                        </p>
                      </button>
                    ))}
                  </div>
                  <button onClick={() => upgradeSelected && setUpgradeOk(true)} disabled={!upgradeSelected}
                    className={`w-full py-4 rounded-xl font-black text-sm transition
                      ${upgradeSelected
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:opacity-90 shadow-md'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}>
                    Request Upgrade
                  </button>
                </>
              )}
            </div>
          )}

          {/* ══ SUPPORT ══ */}
          {activeTab === "tickets" && (
            <div className="space-y-5">
              <div>
                <h2 className="text-xl font-extrabold text-gray-800">Support Tickets</h2>
                <p className="text-sm text-gray-500 mt-0.5">Track issues or raise a new request.</p>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
                {/* list */}
                <div className="lg:col-span-3 space-y-3">
                  {supportTickets.map(t => (
                    <div key={t.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4
                      hover:shadow-md transition">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-mono text-xs text-gray-400">{t?.ticket_number || t.id}</span>
                        <div className="flex gap-2">
                          <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${priorityStyle(t?.priority)}`}>
                            {t.priority}
                          </span>
                          <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${statusStyle(t?.status)}`}>
                            {t.status}
                          </span>
                        </div>
                      </div>
                      <p className="font-semibold text-gray-800 text-sm">{t?.agent_review || t.subject}</p>
                      <p className="text-xs text-gray-400 mt-1">{t?.formatted_date_of_creation || t.date}</p>
                    </div>
                  ))}
                </div>

                {/* form */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                  {ticketSuccess ? (
                    <div className="text-center py-8">
                      <div className="text-4xl mb-3">✅</div>
                      <p className="font-bold text-gray-800 mb-1">Ticket Created!</p>
                      <p className="text-sm text-gray-500 mb-4">We'll respond within 24 hours.</p>
                      <button onClick={() => setTicketSuccess(false)}
                        className="px-5 py-2 rounded-xl bg-emerald-50 border border-emerald-200
                          text-emerald-700 font-bold text-sm hover:bg-emerald-100 transition">
                        New Ticket
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <p className="text-xs font-bold uppercase tracking-widest text-gray-400">New Ticket</p>
                      <input value={ticketSubject} onChange={e => setTicketSubject(e.target.value)}
                        placeholder="Brief subject *"
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800
                          focus:outline-none focus:ring-2 focus:ring-emerald-400 transition" />
                      <select value={ticketPriority} onChange={e => setTicketPriority(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-700
                          focus:outline-none focus:ring-2 focus:ring-emerald-400 transition bg-white">
                        <option>Low</option><option>Medium</option><option>High</option>
                      </select>
                      <textarea value={ticketDesc} onChange={e => setTicketDesc(e.target.value)} rows={4}
                        placeholder="Describe the issue in detail…"
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800
                          focus:outline-none focus:ring-2 focus:ring-emerald-400 transition resize-none" />
                      <button onClick={() => ticketSubject.trim() && setTicketSuccess(true)}
                        disabled={!ticketSubject.trim()}
                        className={`w-full py-2.5 rounded-xl font-bold text-sm transition
                          ${ticketSubject.trim()
                            ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:opacity-90'
                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}>
                        Submit Ticket
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ══ ACCOUNT ══ */}
          {activeTab === "account" && (
            <div className="max-w-2xl space-y-5">
              {/* profile card */}
              <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 text-white shadow-md">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur flex items-center
                    justify-center font-black text-xl">
                    {currentCustomer?.name?.slice(0,2)?.toUpperCase() || "CU"}
                  </div>
                  <div>
                    <p className="text-xl font-extrabold">{currentCustomer?.name || "Customer"}</p>
                    <p className="text-sm opacity-80">Customer since {currentCustomer?.registration_date || "2024"}</p>
                  </div>
                </div>
              </div>

              {/* details grid */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Account Details</p>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "Account Number",    value: currentCustomer?.ref_no       },
                     { label: "Customer Id",    value: currentCustomer?.id       },
                    { label: "Email",              value: currentCustomer?.email        },
                    { label: "Phone",              value: currentCustomer?.phone_number },
                    { label: "Location",           value: "Githunguri, Kiambu"          },
                    { label: "Installation Date",  value: currentCustomer?.registration_date },
                    { label: "Current Plan",       value: currentPlan.name              },
                  ].map(f => (
                    <div key={f.label} className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-0.5">{f.label}</p>
                      <p className="text-sm font-semibold text-gray-800">{f.value || "—"}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* billing history */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100">
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Billing History</p>
                </div>
                {transactions.map((t, i) => (
                  <div key={t.id}
                    className={`flex items-center gap-4 px-5 py-3.5 hover:bg-gray-50 transition
                      ${i < transactions.length - 1 ? 'border-b border-gray-100' : ''}`}>
                    <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center
                      text-emerald-600 font-bold text-sm shrink-0">
                      {t.method === "M-Pesa" ? "M" : "🏦"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-800">{t?.payment_method || t.method}</p>
                      <p className="text-xs text-gray-400 font-mono truncate">{t?.reference || t.ref}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-bold text-gray-800">KES {t.amount.toLocaleString()}</p>
                      <p className="text-xs text-gray-400">{t?.time_paid || t.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  )
}