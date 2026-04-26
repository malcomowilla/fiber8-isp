import {Link, useNavigate} from 'react-router-dom'
import {useState, useEffect} from 'react'
import {useApplicationSettings} from '../settings/ApplicationSettings'




const PLANS = [
  { id: 1, name: "Basic Fiber", speed: "10 Mbps", price: 999, color: "#0ea5e9", popular: false, features: ["Unlimited data", "Email support", "1 device"] },
  { id: 2, name: "Home Plus", speed: "50 Mbps", price: 1999, color: "#8b5cf6", popular: true, features: ["Unlimited data", "Priority support", "5 devices", "Free router"] },
  { id: 3, name: "Business Pro", speed: "100 Mbps", price: 3499, color: "#f59e0b", popular: false, features: ["Unlimited data", "24/7 support", "10 devices", "Static IP", "SLA guarantee"] },
  { id: 4, name: "Ultra 5G", speed: "500 Mbps", price: 5999, color: "#10b981", popular: false, features: ["Unlimited data", "Dedicated account manager", "Unlimited devices", "Static IP", "SLA", "Cloud backup"] },
];

const TICKETS = [
  { id: "TKT-1042", subject: "Slow speeds in the evening", status: "In Progress", date: "2025-03-28", priority: "High" },
  { id: "TKT-1031", subject: "Router keeps disconnecting", status: "Resolved", date: "2025-03-15", priority: "Medium" },
  { id: "TKT-1018", subject: "Billing discrepancy for February", status: "Resolved", date: "2025-02-20", priority: "Low" },
];

const USAGE_DATA = [40, 65, 55, 80, 72, 90, 68, 85, 78, 92, 88, 76];
const MONTHS = ["Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec","Jan","Feb","Mar"];

const statusColor = (s) => {
  if (s === "Resolved") return { bg: "#d1fae5", text: "#065f46" };
  if (s === "In Progress") return { bg: "#fef3c7", text: "#92400e" };
  return { bg: "#dbeafe", text: "#1e40af" };
};

const priorityColor = (p) => {
  if (p === "High") return { bg: "#fee2e2", text: "#991b1b" };
  if (p === "Medium") return { bg: "#fef3c7", text: "#92400e" };
  return { bg: "#f0fdf4", text: "#166534" };
};

function LoginScreen({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPass, setShowPass] = useState(false);

  const handleLogin = () => {
    if (!username.trim() || !password.trim()) { setError("Please enter your account number and password."); return; }
    setError(""); setLoading(true);
    setTimeout(() => { setLoading(false); onLogin(); }, 1600);
  };









  return (
    <div style={{ minHeight: "100vh", background: "#0f0e17", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans','Segoe UI',sans-serif", padding: 20 }}>
      <div style={{ width: "100%", maxWidth: 420 }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{ width: 56, height: 56, borderRadius: 16, background: "linear-gradient(135deg,#7c3aed,#3b82f6)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 24, color: "#fff", margin: "0 auto 14px" }}>N</div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: "#fffffe", margin: "0 0 6px", background: "linear-gradient(90deg,#a78bfa,#60a5fa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>NetLink ISP</h1>
          <p style={{ fontSize: 14, color: "#6b7280", margin: 0 }}>Sign in to your customer portal</p>
        </div>

        {/* Card */}
        <div style={{ background: "#16131f", border: "1px solid #2a2637", borderRadius: 18, padding: "32px 28px" }}>
          {error && (
            <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 9, padding: "10px 14px", marginBottom: 18, fontSize: 13, color: "#f87171" }}>
              {error}
            </div>
          )}

          <label style={{ fontSize: 13, color: "#9ca3af", display: "block", marginBottom: 6 }}>Account Number</label>
          <input value={username} onChange={e => setUsername(e.target.value)} placeholder="e.g. NL-2024-0042817"
            style={{ width: "100%", padding: "12px 14px", borderRadius: 10, background: "#0f0e17", border: "1px solid #2a2637", color: "#fffffe", fontSize: 14, outline: "none", boxSizing: "border-box", marginBottom: 16 }} />

          <label style={{ fontSize: 13, color: "#9ca3af", display: "block", marginBottom: 6 }}>Password</label>
          <div style={{ position: "relative", marginBottom: 10 }}>
            <input value={password} onChange={e => setPassword(e.target.value)} type={showPass ? "text" : "password"} placeholder="Enter your password"
              onKeyDown={e => e.key === "Enter" && handleLogin()}
              style={{ width: "100%", padding: "12px 44px 12px 14px", borderRadius: 10, background: "#0f0e17", border: "1px solid #2a2637", color: "#fffffe", fontSize: 14, outline: "none", boxSizing: "border-box" }} />
            <button onClick={() => setShowPass(v => !v)}
              style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "#6b7280", cursor: "pointer", fontSize: 16, padding: 0 }}>
              {showPass ? "◎" : "◉"}
            </button>
          </div>

          <div style={{ textAlign: "right", marginBottom: 22 }}>
            <button style={{ background: "none", border: "none", color: "#7c3aed", fontSize: 13, cursor: "pointer", padding: 0 }}>Forgot password?</button>
          </div>

          <button onClick={handleLogin} disabled={loading}
            style={{ width: "100%", padding: "14px", borderRadius: 11, background: loading ? "#374151" : "linear-gradient(135deg,#7c3aed,#3b82f6)", border: "none", color: "#fff", fontWeight: 700, fontSize: 15, cursor: loading ? "default" : "pointer", transition: "all 0.2s" }}>
            {loading ? "Signing in..." : "Sign In"}
          </button>

          <p style={{ textAlign: "center", fontSize: 13, color: "#6b7280", margin: "20px 0 0" }}>
            Need help? Call <span style={{ color: "#a78bfa", fontWeight: 600 }}>0800 720 999</span>
          </p>
        </div>
      </div>
    </div>
  );
}

function LogoutModal({ onConfirm, onCancel }) {
   const [isLoggingOut, setIsLoggingOut] = useState(false);
    const navigate = useNavigate()




    
const subdomain = window.location.hostname.split('.')[0];

 const handleCustomerLogout = async () => {
    setIsLoggingOut(true);
    try {
      const response = await fetch('/api/customer-logout', {
        method: 'POST',
        headers: {
          'X-Subdomain': subdomain,
        }

      });

      if (response.ok) {
        // Redirect to login page after successful logout
        navigate('/client-login');
      } else {
        console.error('Logout failed');

        // You might want to show an error message here
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };


  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
      <div style={{ background: "#16131f", border: "1px solid #2a2637", borderRadius: 16, padding: "32px 28px", maxWidth: 360, width: "90%", textAlign: "center" }}>
        <div style={{ width: 52, height: 52, borderRadius: "50%", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", fontSize: 22 }}>⏻</div>
        <h3 style={{ fontSize: 18, fontWeight: 700, color: "#fffffe", margin: "0 0 8px" }}>Sign Out?</h3>
        <p style={{ fontSize: 14, color: "#9ca3af", margin: "0 0 24px" }}>You'll be returned to the login screen.</p>
        <div style={{ display: "flex", gap: 12 }}>
          <button onClick={onCancel}
            style={{ flex: 1, padding: "11px", borderRadius: 9, background: "transparent", border: "1px solid #2a2637", color: "#d1d5db", fontWeight: 600, fontSize: 14, cursor: "pointer" }}>
            Cancel
          </button>
          <button onClick={handleCustomerLogout}
            style={{ flex: 1, padding: "11px", borderRadius: 9, background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.4)", color: "#f87171", fontWeight: 600, fontSize: 14, cursor: "pointer" }}>
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ISPPortal() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [paymentMethod, setPaymentMethod] = useState("mpesa");
  const [mpesaPhone, setMpesaPhone] = useState("0712 345 678");
  const [bankName, setBankName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [paySuccess, setPaySuccess] = useState(false);
  const [payLoading, setPayLoading] = useState(false);
  const [ticketSubject, setTicketSubject] = useState("");
  const [ticketDesc, setTicketDesc] = useState("");
  const [ticketPriority, setTicketPriority] = useState("Medium");
  const [ticketSuccess, setTicketSuccess] = useState(false);
  const [feedbackRating, setFeedbackRating] = useState(0);
  const [feedbackText, setFeedbackText] = useState("");
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);
  const [upgradeSelected, setUpgradeSelected] = useState(null);
  const [upgradeSuccess, setUpgradeSuccess] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const navigate = useNavigate()

  // if (!isLoggedIn) return <LoginScreen onLogin={() => setIsLoggedIn(true)} />;








  const currentPlan = PLANS[1];
  const expiryDate = "April 14, 2026";
  const daysLeft = 13;
  const usagePercent = 68;

  const handlePay = () => {
    setPayLoading(true);
    setTimeout(() => { setPayLoading(false); setPaySuccess(true); }, 2000);
  };

  const handleTicket = () => {
    if (!ticketSubject.trim()) return;
    setTicketSuccess(true);
    setTicketSubject(""); setTicketDesc("");
  };

  const handleFeedback = () => {
    if (!feedbackRating) return;
    setFeedbackSuccess(true);
    setFeedbackRating(0); setFeedbackText("");
  };

  const handleUpgrade = () => {
    if (!upgradeSelected) return;
    setUpgradeSuccess(true);
  };

  const nav = [
    { id: "dashboard", icon: "⊞", label: "Dashboard" },
    { id: "pay", icon: "₿", label: "Pay Bill" },
    { id: "plans", icon: "◈", label: "Plans" },
    { id: "upgrade", icon: "↑", label: "Upgrade" },
    { id: "tickets", icon: "◎", label: "Support" },
    { id: "feedback", icon: "✦", label: "Feedback" },
    { id: "account", icon: "◉", label: "Account" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#0f0e17", color: "#fffffe", fontFamily: "'DM Sans', 'Segoe UI', sans-serif", display: "flex", overflow: "hidden" }}>
      {showLogoutModal && <LogoutModal onConfirm={() => { setIsLoggedIn(false); setShowLogoutModal(false); setActiveTab("dashboard"); }} onCancel={() => setShowLogoutModal(false)} />}

      {/* Sidebar */}
      <aside style={{
        width: sidebarOpen ? 220 : 68, minWidth: sidebarOpen ? 220 : 68,
        background: "#16131f", borderRight: "1px solid #2a2637",
        display: "flex", flexDirection: "column", transition: "width 0.25s ease, min-width 0.25s ease",
        zIndex: 20, overflow: "hidden"
      }}>
        <div style={{ padding: "24px 0 16px", display: "flex", alignItems: "center", justifyContent: "center", borderBottom: "1px solid #2a2637" }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg,#7c3aed,#3b82f6)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 16, color: "#fff", flexShrink: 0 }}>N</div>
          {sidebarOpen && <span style={{ marginLeft: 10, fontWeight: 700, fontSize: 17, whiteSpace: "nowrap", background: "linear-gradient(90deg,#a78bfa,#60a5fa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>NetLink ISP</span>}
        </div>

        <nav style={{ flex: 1, padding: "12px 0" }}>
          {nav.map(n => (
            <button key={n.id} onClick={() => { setActiveTab(n.id); setSidebarOpen(false); }}
              style={{
                width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "11px 16px",
                background: activeTab === n.id ? "rgba(124,58,237,0.18)" : "transparent",
                border: "none", borderLeft: activeTab === n.id ? "3px solid #7c3aed" : "3px solid transparent",
                color: activeTab === n.id ? "#a78bfa" : "#9ca3af", cursor: "pointer",
                fontSize: 14, fontWeight: activeTab === n.id ? 600 : 400, transition: "all 0.15s"
              }}>
              <span style={{ fontSize: 18, width: 20, textAlign: "center", flexShrink: 0 }}>{n.icon}</span>
              {sidebarOpen && <span style={{ whiteSpace: "nowrap" }}>{n.label}</span>}
            </button>
          ))}
        </nav>

        <button onClick={() => setShowLogoutModal(true)}
          style={{ margin: "0 10px 8px", padding: "10px 16px", borderRadius: 8, background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", color: "#f87171", cursor: "pointer", fontSize: 14, display: "flex", alignItems: "center", gap: 10, width: "calc(100% - 20px)" }}>
          <span style={{ fontSize: 17, flexShrink: 0 }}>⏻</span>
          {sidebarOpen && <span style={{ fontWeight: 600, fontSize: 13, whiteSpace: "nowrap" }}>Sign Out</span>}
        </button>

        <button onClick={() => setSidebarOpen(o => !o)}
          style={{ margin: "0 10px 20px", padding: "9px", borderRadius: 8, background: "rgba(255,255,255,0.05)", border: "1px solid #2a2637", color: "#9ca3af", cursor: "pointer", fontSize: 14 }}>
          {sidebarOpen ? "◀" : "▶"}
        </button>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, overflowY: "auto", overflowX: "hidden" }}>

        {/* Topbar */}
        <div style={{ padding: "18px 28px", borderBottom: "1px solid #2a2637", display: "flex", alignItems: "center", justifyContent: "space-between", background: "#16131f", position: "sticky", top: 0, zIndex: 10 }}>
          <h1 style={{ fontSize: 20, fontWeight: 700, margin: 0, color: "#fffffe" }}>
            {nav.find(n => n.id === activeTab)?.label}
          </h1>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ padding: "5px 12px", borderRadius: 20, background: daysLeft <= 7 ? "rgba(239,68,68,0.15)" : "rgba(16,185,129,0.15)", border: `1px solid ${daysLeft <= 7 ? "rgba(239,68,68,0.4)" : "rgba(16,185,129,0.4)"}`, fontSize: 12, color: daysLeft <= 7 ? "#f87171" : "#34d399", fontWeight: 600 }}>
              Expires: {expiryDate}
            </div>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg,#7c3aed,#3b82f6)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 14 }}>JK</div>
          </div>
        </div>

        <div style={{ padding: "28px", maxWidth: 960 }}>

          {/* ── DASHBOARD ── */}
          {activeTab === "dashboard" && (
            <div>
              {/* Stat cards */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 16, marginBottom: 28 }}>
                {[
                  { label: "Current Plan", value: currentPlan.name, sub: currentPlan.speed, color: "#7c3aed" },
                  { label: "Days Remaining", value: daysLeft, sub: "until renewal", color: daysLeft <= 7 ? "#ef4444" : "#10b981" },
                  { label: "Monthly Cost", value: `KES ${currentPlan.price.toLocaleString()}`, sub: "per month", color: "#3b82f6" },
                  { label: "Data Used", value: `${usagePercent}%`, sub: "of fair use", color: "#f59e0b" },
                ].map(c => (
                  <div key={c.label} style={{ background: "#16131f", border: "1px solid #2a2637", borderRadius: 14, padding: "18px 20px", position: "relative", overflow: "hidden" }}>
                    <div style={{ position: "absolute", top: 0, left: 0, width: 3, height: "100%", background: c.color, borderRadius: "3px 0 0 3px" }} />
                    <p style={{ fontSize: 12, color: "#9ca3af", margin: "0 0 6px", fontWeight: 500 }}>{c.label}</p>
                    <p style={{ fontSize: 22, fontWeight: 700, margin: "0 0 2px", color: "#fffffe" }}>{c.value}</p>
                    <p style={{ fontSize: 12, color: "#6b7280", margin: 0 }}>{c.sub}</p>
                  </div>
                ))}
              </div>

              {/* Usage chart + Plan summary */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 20, marginBottom: 24 }}>
                <div style={{ background: "#16131f", border: "1px solid #2a2637", borderRadius: 14, padding: "22px 24px" }}>
                  <p style={{ fontSize: 14, fontWeight: 600, color: "#d1d5db", margin: "0 0 20px" }}>Data Usage — Last 12 Months (%)</p>
                  <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 120 }}>
                    {USAGE_DATA.map((v, i) => (
                      <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                        <div style={{ width: "100%", background: i === 11 ? "#7c3aed" : "rgba(124,58,237,0.3)", borderRadius: "4px 4px 0 0", height: `${v}%`, transition: "height 0.5s" }} />
                        <span style={{ fontSize: 10, color: "#6b7280" }}>{MONTHS[i]}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ background: "#16131f", border: "1px solid #2a2637", borderRadius: 14, padding: "22px 24px" }}>
                  <p style={{ fontSize: 14, fontWeight: 600, color: "#d1d5db", margin: "0 0 16px" }}>Active Plan</p>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                    <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(139,92,246,0.2)", border: "1px solid rgba(139,92,246,0.4)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>◈</div>
                    <div>
                      <p style={{ margin: 0, fontSize: 17, fontWeight: 700, color: "#fffffe" }}>{currentPlan.name}</p>
                      <p style={{ margin: 0, fontSize: 13, color: "#a78bfa" }}>{currentPlan.speed}</p>
                    </div>
                  </div>
                  <div style={{ borderTop: "1px solid #2a2637", paddingTop: 14 }}>
                    {currentPlan.features.map(f => (
                      <div key={f} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 7 }}>
                        <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#7c3aed", flexShrink: 0 }} />
                        <span style={{ fontSize: 13, color: "#d1d5db" }}>{f}</span>
                      </div>
                    ))}
                  </div>
                  <button onClick={() => setActiveTab("pay")}
                    style={{ marginTop: 16, width: "100%", padding: "10px", borderRadius: 9, background: "linear-gradient(135deg,#7c3aed,#3b82f6)", border: "none", color: "#fff", fontWeight: 600, fontSize: 14, cursor: "pointer" }}>
                    Renew Now
                  </button>
                </div>
              </div>

              {/* Recent tickets */}
              <div style={{ background: "#16131f", border: "1px solid #2a2637", borderRadius: 14, padding: "22px 24px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                  <p style={{ fontSize: 14, fontWeight: 600, color: "#d1d5db", margin: 0 }}>Recent Tickets</p>
                  <button onClick={() => setActiveTab("tickets")} style={{ fontSize: 13, color: "#7c3aed", background: "none", border: "none", cursor: "pointer" }}>View all →</button>
                </div>
                {TICKETS.slice(0, 2).map(t => (
                  <div key={t.id} style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 0", borderBottom: "1px solid #2a2637" }}>
                    <span style={{ fontSize: 12, color: "#6b7280", minWidth: 80 }}>{t.id}</span>
                    <span style={{ flex: 1, fontSize: 14, color: "#d1d5db" }}>{t.subject}</span>
                    <span style={{ fontSize: 12, padding: "3px 10px", borderRadius: 20, background: statusColor(t.status).bg, color: statusColor(t.status).text, fontWeight: 600 }}>{t.status}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── PAY BILL ── */}
          {activeTab === "pay" && (
            <div style={{ maxWidth: 560 }}>
              {paySuccess ? (
                <div style={{ textAlign: "center", padding: "60px 0" }}>
                  <div style={{ width: 72, height: 72, borderRadius: "50%", background: "rgba(16,185,129,0.15)", border: "2px solid #10b981", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", fontSize: 32 }}>✓</div>
                  <h2 style={{ fontSize: 24, fontWeight: 700, color: "#fffffe", margin: "0 0 8px" }}>Payment Successful!</h2>
                  <p style={{ color: "#9ca3af", margin: "0 0 28px" }}>Your internet plan has been renewed until May 14, 2026.</p>
                  <button onClick={() => { setPaySuccess(false); setActiveTab("dashboard"); }}
                    style={{ padding: "12px 32px", borderRadius: 9, background: "linear-gradient(135deg,#7c3aed,#3b82f6)", border: "none", color: "#fff", fontWeight: 600, fontSize: 15, cursor: "pointer" }}>
                    Back to Dashboard
                  </button>
                </div>
              ) : (
                <div>
                  <div style={{ background: "#16131f", border: "1px solid #2a2637", borderRadius: 14, padding: "20px 24px", marginBottom: 20 }}>
                    <p style={{ fontSize: 12, color: "#9ca3af", margin: "0 0 4px" }}>Amount Due</p>
                    <p style={{ fontSize: 36, fontWeight: 800, color: "#fffffe", margin: "0 0 2px" }}>KES {currentPlan.price.toLocaleString()}</p>
                    <p style={{ fontSize: 13, color: "#f87171", margin: 0 }}>Expires {expiryDate} · {daysLeft} days left</p>
                  </div>

                  {/* Payment methods */}
                  <div style={{ background: "#16131f", border: "1px solid #2a2637", borderRadius: 14, padding: "22px 24px", marginBottom: 20 }}>
                    <p style={{ fontSize: 14, fontWeight: 600, color: "#d1d5db", margin: "0 0 16px" }}>Payment Method</p>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 20 }}>
                      {[
                        { id: "mpesa", label: "M-Pesa", icon: "📱", color: "#10b981" },
                        { id: "bank", label: "Bank Transfer", icon: "🏦", color: "#3b82f6" },
                        { id: "card", label: "Debit/Credit", icon: "💳", color: "#f59e0b" },
                      ].map(m => (
                        <button key={m.id} onClick={() => setPaymentMethod(m.id)}
                          style={{
                            padding: "14px 10px", borderRadius: 10, border: paymentMethod === m.id ? `2px solid ${m.color}` : "1px solid #2a2637",
                            background: paymentMethod === m.id ? `rgba(${m.id === "mpesa" ? "16,185,129" : m.id === "bank" ? "59,130,246" : "245,158,11"},0.1)` : "transparent",
                            color: "#fffffe", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 6
                          }}>
                          <span style={{ fontSize: 22 }}>{m.icon}</span>
                          <span style={{ fontSize: 12, fontWeight: 600, color: paymentMethod === m.id ? m.color : "#9ca3af" }}>{m.label}</span>
                        </button>
                      ))}
                    </div>

                    {paymentMethod === "mpesa" && (
                      <div>
                        <label style={{ fontSize: 13, color: "#9ca3af", display: "block", marginBottom: 6 }}>M-Pesa Phone Number</label>
                        <input value={mpesaPhone} onChange={e => setMpesaPhone(e.target.value)}
                          style={{ width: "100%", padding: "11px 14px", borderRadius: 9, background: "#0f0e17", border: "1px solid #2a2637", color: "#fffffe", fontSize: 15, outline: "none", boxSizing: "border-box" }} />
                        <p style={{ fontSize: 12, color: "#6b7280", margin: "8px 0 0" }}>You'll receive a push notification on your phone to complete payment.</p>
                      </div>
                    )}

                    {paymentMethod === "bank" && (
                      <div style={{ display: "grid", gap: 14 }}>
                        <div style={{ background: "#0f0e17", border: "1px solid #2a2637", borderRadius: 10, padding: "14px 16px" }}>
                          <p style={{ fontSize: 12, color: "#9ca3af", margin: "0 0 4px" }}>Account Name</p>
                          <p style={{ fontSize: 14, fontWeight: 600, color: "#fffffe", margin: 0 }}>NetLink Internet Services Ltd</p>
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                          <div style={{ background: "#0f0e17", border: "1px solid #2a2637", borderRadius: 10, padding: "14px 16px" }}>
                            <p style={{ fontSize: 12, color: "#9ca3af", margin: "0 0 4px" }}>Account No.</p>
                            <p style={{ fontSize: 14, fontWeight: 600, color: "#fffffe", margin: 0 }}>1234567890</p>
                          </div>
                          <div style={{ background: "#0f0e17", border: "1px solid #2a2637", borderRadius: 10, padding: "14px 16px" }}>
                            <p style={{ fontSize: 12, color: "#9ca3af", margin: "0 0 4px" }}>Bank</p>
                            <p style={{ fontSize: 14, fontWeight: 600, color: "#fffffe", margin: 0 }}>Equity Bank</p>
                          </div>
                        </div>
                        <div>
                          <label style={{ fontSize: 13, color: "#9ca3af", display: "block", marginBottom: 6 }}>Your Bank Name (for reference)</label>
                          <input value={bankName} onChange={e => setBankName(e.target.value)} placeholder="e.g. KCB, Equity..."
                            style={{ width: "100%", padding: "11px 14px", borderRadius: 9, background: "#0f0e17", border: "1px solid #2a2637", color: "#fffffe", fontSize: 14, outline: "none", boxSizing: "border-box" }} />
                        </div>
                      </div>
                    )}

                    {paymentMethod === "card" && (
                      <div style={{ display: "grid", gap: 14 }}>
                        <div>
                          <label style={{ fontSize: 13, color: "#9ca3af", display: "block", marginBottom: 6 }}>Card Number</label>
                          <input value={cardNumber} onChange={e => setCardNumber(e.target.value)} placeholder="1234 5678 9012 3456"
                            style={{ width: "100%", padding: "11px 14px", borderRadius: 9, background: "#0f0e17", border: "1px solid #2a2637", color: "#fffffe", fontSize: 14, outline: "none", boxSizing: "border-box" }} />
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                          <div>
                            <label style={{ fontSize: 13, color: "#9ca3af", display: "block", marginBottom: 6 }}>Expiry</label>
                            <input placeholder="MM/YY"
                              style={{ width: "100%", padding: "11px 14px", borderRadius: 9, background: "#0f0e17", border: "1px solid #2a2637", color: "#fffffe", fontSize: 14, outline: "none", boxSizing: "border-box" }} />
                          </div>
                          <div>
                            <label style={{ fontSize: 13, color: "#9ca3af", display: "block", marginBottom: 6 }}>CVV</label>
                            <input placeholder="···"
                              style={{ width: "100%", padding: "11px 14px", borderRadius: 9, background: "#0f0e17", border: "1px solid #2a2637", color: "#fffffe", fontSize: 14, outline: "none", boxSizing: "border-box" }} />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <button onClick={handlePay} disabled={payLoading}
                    style={{ width: "100%", padding: "15px", borderRadius: 11, background: payLoading ? "#374151" : "linear-gradient(135deg,#7c3aed,#3b82f6)", border: "none", color: "#fff", fontWeight: 700, fontSize: 16, cursor: payLoading ? "default" : "pointer", transition: "all 0.2s" }}>
                    {payLoading ? "Processing..." : `Pay KES ${currentPlan.price.toLocaleString()}`}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ── PLANS ── */}
          {activeTab === "plans" && (
            <div>
              <p style={{ color: "#9ca3af", fontSize: 15, margin: "0 0 24px" }}>Browse all available internet plans. Your current plan is highlighted.</p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 16 }}>
                {PLANS.map(p => (
                  <div key={p.id} style={{ background: "#16131f", border: p.id === currentPlan.id ? `2px solid ${p.color}` : "1px solid #2a2637", borderRadius: 16, padding: "22px 20px", position: "relative", transition: "transform 0.15s", cursor: "default" }}>
                    {p.popular && <div style={{ position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)", background: "#7c3aed", color: "#fff", fontSize: 11, fontWeight: 700, padding: "4px 14px", borderRadius: 20 }}>MOST POPULAR</div>}
                    {p.id === currentPlan.id && <div style={{ position: "absolute", top: -12, right: 16, background: "#10b981", color: "#fff", fontSize: 11, fontWeight: 700, padding: "4px 12px", borderRadius: 20 }}>ACTIVE</div>}
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: `${p.color}22`, border: `1px solid ${p.color}55`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14, fontSize: 18 }}>◈</div>
                    <p style={{ fontSize: 17, fontWeight: 700, color: "#fffffe", margin: "0 0 4px" }}>{p.name}</p>
                    <p style={{ fontSize: 28, fontWeight: 800, color: p.color, margin: "0 0 2px" }}>{p.speed}</p>
                    <p style={{ fontSize: 14, color: "#6b7280", margin: "0 0 16px" }}>KES {p.price.toLocaleString()}/mo</p>
                    <div style={{ borderTop: "1px solid #2a2637", paddingTop: 14 }}>
                      {p.features.map(f => (
                        <div key={f} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 7 }}>
                          <div style={{ width: 5, height: 5, borderRadius: "50%", background: p.color, flexShrink: 0 }} />
                          <span style={{ fontSize: 12, color: "#d1d5db" }}>{f}</span>
                        </div>
                      ))}
                    </div>
                    {p.id !== currentPlan.id && (
                      <button onClick={() => { setUpgradeSelected(p); setActiveTab("upgrade"); }}
                        style={{ marginTop: 16, width: "100%", padding: "9px", borderRadius: 8, background: "transparent", border: `1px solid ${p.color}`, color: p.color, fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
                        Switch to this
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── UPGRADE ── */}
          {activeTab === "upgrade" && (
            <div style={{ maxWidth: 540 }}>
              {upgradeSuccess ? (
                <div style={{ textAlign: "center", padding: "60px 0" }}>
                  <div style={{ width: 72, height: 72, borderRadius: "50%", background: "rgba(124,58,237,0.15)", border: "2px solid #7c3aed", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", fontSize: 32 }}>↑</div>
                  <h2 style={{ fontSize: 24, fontWeight: 700, color: "#fffffe", margin: "0 0 8px" }}>Request Submitted!</h2>
                  <p style={{ color: "#9ca3af", margin: "0 0 28px" }}>Your upgrade request to <strong>{upgradeSelected?.name}</strong> has been received. Our team will contact you within 24 hours.</p>
                  <button onClick={() => { setUpgradeSuccess(false); setUpgradeSelected(null); setActiveTab("dashboard"); }}
                    style={{ padding: "12px 32px", borderRadius: 9, background: "linear-gradient(135deg,#7c3aed,#3b82f6)", border: "none", color: "#fff", fontWeight: 600, fontSize: 15, cursor: "pointer" }}>
                    Back to Dashboard
                  </button>
                </div>
              ) : (
                <div>
                  <div style={{ background: "#16131f", border: "1px solid #2a2637", borderRadius: 14, padding: "20px 24px", marginBottom: 20 }}>
                    <p style={{ fontSize: 12, color: "#9ca3af", margin: "0 0 4px" }}>Current Plan</p>
                    <p style={{ fontSize: 18, fontWeight: 700, color: "#fffffe", margin: 0 }}>{currentPlan.name} — {currentPlan.speed}</p>
                  </div>

                  <p style={{ fontSize: 14, fontWeight: 600, color: "#d1d5db", margin: "0 0 12px" }}>Select New Plan</p>
                  <div style={{ display: "grid", gap: 10, marginBottom: 20 }}>
                    {PLANS.filter(p => p.id !== currentPlan.id).map(p => (
                      <button key={p.id} onClick={() => setUpgradeSelected(p)}
                        style={{
                          display: "flex", alignItems: "center", gap: 16, padding: "16px 18px", borderRadius: 12,
                          border: upgradeSelected?.id === p.id ? `2px solid ${p.color}` : "1px solid #2a2637",
                          background: upgradeSelected?.id === p.id ? `${p.color}11` : "#16131f",
                          color: "#fffffe", cursor: "pointer", textAlign: "left"
                        }}>
                        <div style={{ width: 40, height: 40, borderRadius: 10, background: `${p.color}22`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>◈</div>
                        <div style={{ flex: 1 }}>
                          <p style={{ margin: "0 0 2px", fontWeight: 600, fontSize: 15 }}>{p.name}</p>
                          <p style={{ margin: 0, fontSize: 13, color: "#9ca3af" }}>{p.speed}</p>
                        </div>
                        <p style={{ margin: 0, fontSize: 16, fontWeight: 700, color: p.color }}>KES {p.price.toLocaleString()}</p>
                      </button>
                    ))}
                  </div>

                  <button onClick={handleUpgrade} disabled={!upgradeSelected}
                    style={{ width: "100%", padding: "15px", borderRadius: 11, background: upgradeSelected ? "linear-gradient(135deg,#7c3aed,#3b82f6)" : "#1f1f2e", border: "none", color: upgradeSelected ? "#fff" : "#4b5563", fontWeight: 700, fontSize: 16, cursor: upgradeSelected ? "pointer" : "default", transition: "all 0.2s" }}>
                    Request Upgrade
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ── TICKETS ── */}
          {activeTab === "tickets" && (
            <div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 20 }}>
                {/* Ticket history */}
                <div>
                  <p style={{ fontSize: 14, fontWeight: 600, color: "#d1d5db", margin: "0 0 14px" }}>Your Tickets</p>
                  {TICKETS.map(t => (
                    <div key={t.id} style={{ background: "#16131f", border: "1px solid #2a2637", borderRadius: 12, padding: "16px 18px", marginBottom: 10 }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                        <span style={{ fontSize: 12, color: "#6b7280", fontFamily: "monospace" }}>{t.id}</span>
                        <div style={{ display: "flex", gap: 8 }}>
                          <span style={{ fontSize: 11, padding: "2px 9px", borderRadius: 20, background: priorityColor(t.priority).bg, color: priorityColor(t.priority).text, fontWeight: 600 }}>{t.priority}</span>
                          <span style={{ fontSize: 11, padding: "2px 9px", borderRadius: 20, background: statusColor(t.status).bg, color: statusColor(t.status).text, fontWeight: 600 }}>{t.status}</span>
                        </div>
                      </div>
                      <p style={{ fontSize: 14, fontWeight: 600, color: "#fffffe", margin: "0 0 4px" }}>{t.subject}</p>
                      <p style={{ fontSize: 12, color: "#6b7280", margin: 0 }}>{t.date}</p>
                    </div>
                  ))}
                </div>

                {/* New ticket form */}
                <div style={{ background: "#16131f", border: "1px solid #2a2637", borderRadius: 14, padding: "22px 20px", height: "fit-content" }}>
                  {ticketSuccess ? (
                    <div style={{ textAlign: "center", padding: "30px 0" }}>
                      <div style={{ fontSize: 40, marginBottom: 12 }}>◎</div>
                      <p style={{ fontWeight: 700, fontSize: 16, color: "#fffffe", margin: "0 0 6px" }}>Ticket Created!</p>
                      <p style={{ color: "#9ca3af", fontSize: 13, margin: "0 0 20px" }}>We'll respond within 24 hours.</p>
                      <button onClick={() => setTicketSuccess(false)}
                        style={{ padding: "9px 20px", borderRadius: 8, background: "rgba(124,58,237,0.15)", border: "1px solid #7c3aed", color: "#a78bfa", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
                        New Ticket
                      </button>
                    </div>
                  ) : (
                    <div>
                      <p style={{ fontSize: 14, fontWeight: 600, color: "#d1d5db", margin: "0 0 16px" }}>Create New Ticket</p>
                      <label style={{ fontSize: 12, color: "#9ca3af", display: "block", marginBottom: 6 }}>Subject *</label>
                      <input value={ticketSubject} onChange={e => setTicketSubject(e.target.value)} placeholder="Brief description of issue"
                        style={{ width: "100%", padding: "10px 12px", borderRadius: 8, background: "#0f0e17", border: "1px solid #2a2637", color: "#fffffe", fontSize: 13, outline: "none", boxSizing: "border-box", marginBottom: 14 }} />

                      <label style={{ fontSize: 12, color: "#9ca3af", display: "block", marginBottom: 6 }}>Priority</label>
                      <select value={ticketPriority} onChange={e => setTicketPriority(e.target.value)}
                        style={{ width: "100%", padding: "10px 12px", borderRadius: 8, background: "#0f0e17", border: "1px solid #2a2637", color: "#fffffe", fontSize: 13, outline: "none", marginBottom: 14 }}>
                        <option>Low</option><option>Medium</option><option>High</option>
                      </select>

                      <label style={{ fontSize: 12, color: "#9ca3af", display: "block", marginBottom: 6 }}>Description</label>
                      <textarea value={ticketDesc} onChange={e => setTicketDesc(e.target.value)} rows={4} placeholder="Describe the issue in detail..."
                        style={{ width: "100%", padding: "10px 12px", borderRadius: 8, background: "#0f0e17", border: "1px solid #2a2637", color: "#fffffe", fontSize: 13, outline: "none", resize: "vertical", boxSizing: "border-box", marginBottom: 16 }} />

                      <button onClick={handleTicket} disabled={!ticketSubject.trim()}
                        style={{ width: "100%", padding: "12px", borderRadius: 9, background: ticketSubject.trim() ? "linear-gradient(135deg,#7c3aed,#3b82f6)" : "#1f1f2e", border: "none", color: ticketSubject.trim() ? "#fff" : "#4b5563", fontWeight: 600, fontSize: 14, cursor: ticketSubject.trim() ? "pointer" : "default" }}>
                        Submit Ticket
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ── FEEDBACK ── */}
          {activeTab === "feedback" && (
            <div style={{ maxWidth: 520 }}>
              {feedbackSuccess ? (
                <div style={{ textAlign: "center", padding: "60px 0" }}>
                  <div style={{ fontSize: 52, marginBottom: 16 }}>✦</div>
                  <h2 style={{ fontSize: 22, fontWeight: 700, color: "#fffffe", margin: "0 0 8px" }}>Thank you for your feedback!</h2>
                  <p style={{ color: "#9ca3af", margin: "0 0 28px" }}>Your input helps us improve our service.</p>
                  <button onClick={() => setFeedbackSuccess(false)}
                    style={{ padding: "11px 28px", borderRadius: 9, background: "linear-gradient(135deg,#7c3aed,#3b82f6)", border: "none", color: "#fff", fontWeight: 600, fontSize: 15, cursor: "pointer" }}>
                    Leave More Feedback
                  </button>
                </div>
              ) : (
                <div style={{ background: "#16131f", border: "1px solid #2a2637", borderRadius: 14, padding: "28px 28px" }}>
                  <p style={{ fontSize: 15, color: "#d1d5db", fontWeight: 600, margin: "0 0 6px" }}>How would you rate our service?</p>
                  <p style={{ fontSize: 13, color: "#6b7280", margin: "0 0 20px" }}>Your feedback matters and helps us serve you better.</p>

                  <div style={{ display: "flex", gap: 10, marginBottom: 24 }}>
                    {[1,2,3,4,5].map(s => (
                      <button key={s} onClick={() => setFeedbackRating(s)}
                        style={{ width: 52, height: 52, borderRadius: 12, border: feedbackRating >= s ? "2px solid #f59e0b" : "1px solid #2a2637", background: feedbackRating >= s ? "rgba(245,158,11,0.15)" : "transparent", fontSize: 24, cursor: "pointer" }}>
                        ★
                      </button>
                    ))}
                  </div>

                  {feedbackRating > 0 && (
                    <p style={{ fontSize: 13, color: "#f59e0b", margin: "0 0 16px", fontWeight: 600 }}>
                      {["", "Very Poor", "Poor", "Average", "Good", "Excellent"][feedbackRating]}
                    </p>
                  )}

                  <div style={{ display: "grid", gap: 10, marginBottom: 20 }}>
                    {["Network speed & reliability", "Customer service", "Billing & pricing", "General feedback"].map(cat => (
                      <div key={cat} style={{ padding: "12px 14px", borderRadius: 9, border: "1px solid #2a2637", background: "#0f0e17", fontSize: 14, color: "#d1d5db", cursor: "default" }}>{cat}</div>
                    ))}
                  </div>

                  <label style={{ fontSize: 12, color: "#9ca3af", display: "block", marginBottom: 6 }}>Additional Comments</label>
                  <textarea value={feedbackText} onChange={e => setFeedbackText(e.target.value)} rows={4} placeholder="Tell us more..."
                    style={{ width: "100%", padding: "11px 14px", borderRadius: 9, background: "#0f0e17", border: "1px solid #2a2637", color: "#fffffe", fontSize: 14, outline: "none", resize: "vertical", boxSizing: "border-box", marginBottom: 18 }} />

                  <button onClick={handleFeedback} disabled={!feedbackRating}
                    style={{ width: "100%", padding: "14px", borderRadius: 11, background: feedbackRating ? "linear-gradient(135deg,#7c3aed,#3b82f6)" : "#1f1f2e", border: "none", color: feedbackRating ? "#fff" : "#4b5563", fontWeight: 700, fontSize: 15, cursor: feedbackRating ? "pointer" : "default" }}>
                    Submit Feedback
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ── ACCOUNT ── */}
          {activeTab === "account" && (
            <div style={{ maxWidth: 620 }}>
              {/* Profile card */}
              <div style={{ background: "#16131f", border: "1px solid #2a2637", borderRadius: 14, padding: "24px", marginBottom: 20 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
                  <div style={{ width: 60, height: 60, borderRadius: "50%", background: "linear-gradient(135deg,#7c3aed,#3b82f6)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 22, color: "#fff" }}>JK</div>
                  <div>
                    <p style={{ margin: "0 0 4px", fontSize: 20, fontWeight: 700, color: "#fffffe" }}>John Kamau</p>
                    <p style={{ margin: 0, fontSize: 14, color: "#9ca3af" }}>Customer since January 2023</p>
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  {[
                    { label: "Account Number", value: "NL-2024-0042817" },
                    { label: "Customer ID", value: "CID-98312" },
                    { label: "Email", value: "john.kamau@email.com" },
                    { label: "Phone", value: "+254 712 345 678" },
                    { label: "Location", value: "Githunguri, Kiambu" },
                    { label: "Installation Date", value: "January 12, 2023" },
                  ].map(f => (
                    <div key={f.label} style={{ background: "#0f0e17", border: "1px solid #2a2637", borderRadius: 10, padding: "12px 14px" }}>
                      <p style={{ fontSize: 11, color: "#6b7280", margin: "0 0 4px", textTransform: "uppercase", letterSpacing: "0.05em" }}>{f.label}</p>
                      <p style={{ fontSize: 14, fontWeight: 600, color: "#fffffe", margin: 0 }}>{f.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Billing history */}
              <div style={{ background: "#16131f", border: "1px solid #2a2637", borderRadius: 14, padding: "22px 24px" }}>
                <p style={{ fontSize: 14, fontWeight: 600, color: "#d1d5db", margin: "0 0 14px" }}>Billing History</p>
                {[
                  { date: "Mar 14, 2026", amount: 1999, method: "M-Pesa", status: "Paid" },
                  { date: "Feb 14, 2026", amount: 1999, method: "M-Pesa", status: "Paid" },
                  { date: "Jan 14, 2026", amount: 1999, method: "Bank Transfer", status: "Paid" },
                  { date: "Dec 14, 2025", amount: 1999, method: "M-Pesa", status: "Paid" },
                ].map((b, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", padding: "12px 0", borderBottom: i < 3 ? "1px solid #2a2637" : "none" }}>
                    <span style={{ flex: 1, fontSize: 14, color: "#d1d5db" }}>{b.date}</span>
                    <span style={{ fontSize: 13, color: "#9ca3af", marginRight: 16 }}>{b.method}</span>
                    <span style={{ fontSize: 14, fontWeight: 700, color: "#fffffe", marginRight: 16 }}>KES {b.amount.toLocaleString()}</span>
                    <span style={{ fontSize: 12, padding: "3px 10px", borderRadius: 20, background: "#d1fae5", color: "#065f46", fontWeight: 600 }}>{b.status}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}