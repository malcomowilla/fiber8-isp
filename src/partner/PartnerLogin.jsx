
import { useState, useEffect, useCallback } from "react";





function PartnerLogin({ onLogin }) {
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
          <h1 style={{ fontSize: 26, fontWeight: 800, color: "green", margin: "0 0 6px", background: "linear-gradient(90deg,#008000,#008000)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Partner Portal</h1>
          <p style={{ fontSize: 14, color: 
            "green", margin: 0 }}>Sign in to your partner portal</p>
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
            style={{ width: "100%", padding: "14px", borderRadius: 11,
             background: loading ? "#374151" : "linear-gradient(135deg,#008000,#008000)", border: "none", color: "#fff", fontWeight: 700, fontSize: 15, cursor: loading ? "default" : "pointer", transition: "all 0.2s" }}>
            {loading ? "Signing in..." : "Sign In"}
          </button>

          <p style={{ textAlign: "center", fontSize: 13, color: "#008000", margin: "20px 0 0" }}>
            Need help? Call <span style={{ color: "#008000", fontWeight: 600 }}>0800 720 999</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default PartnerLogin