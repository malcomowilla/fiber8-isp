import { useState } from 'react';
import { Eye, EyeOff, Lock, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import { useLayoutEffect } from "react";


const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&display=swap');
  .cp-root * { box-sizing: border-box; margin: 0; padding: 0; }
  .cp-root   { font-family: 'DM Sans', sans-serif; }

  @keyframes cp-spin  { to { transform: rotate(360deg); } }
  @keyframes cp-shake { 0%,100%{transform:translateX(0)} 20%,60%{transform:translateX(-6px)} 40%,80%{transform:translateX(6px)} }
  @keyframes cp-in    { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }

  .cp-card { animation: cp-in .3s ease both; }

  .cp-input {
    width: 100%; padding: 11px 42px 11px 14px;
    font-size: 14px; font-family: 'DM Sans', sans-serif;
    border: 1.5px solid #e5e7eb; border-radius: 10px;
    outline: none; color: #111827; background: #fff;
    transition: border-color .18s, box-shadow .18s;
  }
  .cp-input:focus { border-color: #6366f1; box-shadow: 0 0 0 3px rgba(99,102,241,.1); }
  .cp-input.error { border-color: #ef4444; box-shadow: 0 0 0 3px rgba(239,68,68,.08); animation: cp-shake .4s ease; }
  .cp-input::placeholder { color: #d1d5db; }

  .cp-btn {
    width: 100%; padding: 12px; border-radius: 10px; border: none;
    background: linear-gradient(135deg, #6366f1, #4f46e5);
    color: #fff; font-size: 14px; font-weight: 700;
    font-family: 'DM Sans', sans-serif; cursor: pointer;
    transition: transform .15s, box-shadow .15s, opacity .15s;
  }
  .cp-btn:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 8px 20px rgba(99,102,241,.35); }
  .cp-btn:disabled { opacity: .55; cursor: not-allowed; transform: none; }

  .cp-strength-bar { height: 4px; border-radius: 99px; transition: width .4s ease, background .4s ease; }

  .cp-rule { display: flex; align-items: center; gap: 6px; font-size: 12px; transition: color .2s; }
`;

const RULES = [
  { label: 'At least 8 characters',         test: v => v.length >= 8 },
  { label: 'One uppercase letter (A–Z)',     test: v => /[A-Z]/.test(v) },
  { label: 'One lowercase letter (a–z)',     test: v => /[a-z]/.test(v) },
  { label: 'One number (0–9)',               test: v => /\d/.test(v) },
  { label: 'One special character (!@#…)',   test: v => /[^A-Za-z0-9]/.test(v) },
];

function strength(pw) {
  const passed = RULES.filter(r => r.test(pw)).length;
  if (!pw)      return { score: 0, label: '',        color: '#e5e7eb' };
  if (passed <= 1) return { score: 20,  label: 'Very weak',  color: '#ef4444' };
  if (passed === 2) return { score: 40, label: 'Weak',       color: '#f97316' };
  if (passed === 3) return { score: 60, label: 'Fair',       color: '#eab308' };
  if (passed === 4) return { score: 80, label: 'Strong',     color: '#22c55e' };
  return              { score: 100, label: 'Very strong', color: '#10b981' };
}

const getCsrf = () =>
  document?.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';

export default function ChangePassword({ onSuccess }) {
  const [form,    setForm]    = useState({ current: '', password: '', confirm: '' });
  const [show,    setShow]    = useState({ current: false, password: false, confirm: false });
  const [errors,  setErrors]  = useState({});
  const [status,  setStatus]  = useState(null); // 'success' | 'error'
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (k, v) => {
    setForm(f => ({ ...f, [k]: v }));
    setErrors(e => ({ ...e, [k]: '' }));
    if (status) setStatus(null);
  };

  const toggleShow = k => setShow(s => ({ ...s, [k]: !s[k] }));

  const pw = form.password;
  const st = strength(pw);

  const validate = () => {
    const e = {};
    // if (!form.current)  e.current  = 'Current password is required.';
    if (!pw)            e.password = 'New password is required.';
    else if (pw.length < 8) e.password = 'Password must be at least 8 characters.';
    if (!form.confirm)  e.confirm  = 'Please confirm your new password.';
    else if (pw !== form.confirm) e.confirm = 'Passwords do not match.';
    return e;
  };


  const subdomain = window.location.hostname.split('.')[0];




  const handleSubmit = async e => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    try {
      const res = await fetch('/api/change_password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': getCsrf(),

            'X-Subdomain': subdomain,
         },
        body: JSON.stringify({ current_password: form.current, password: form.password, password_confirmation: form.confirm }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus('success');
        setMessage(data.message || 'Password changed successfully!');
        setForm({ current: '', password: '', confirm: '' });
        window.location.href = "/signin"
        onSuccess?.();
      } else {
        setStatus('error');
        setMessage(data.error || 'Failed to change password. Please try again.');
        if (data.error?.toLowerCase().includes('current')) {
          setErrors(e => ({ ...e, current: data.error }));
        }
      }
      
    } catch (_) {
      setStatus('error');
      setMessage('error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const InputField = ({ id, label, placeholder }) => (
    <div style={{ marginBottom: 18 }}>
      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>
        {label}
      </label>
      <div style={{ position: 'relative' }}>
        <input
          type={show[id] ? 'text' : 'password'}
          value={form[id]}
          onChange={e => set(id, e.target.value)}
          placeholder={placeholder}
          className={`cp-input${errors[id] ? ' error' : ''}`}
          autoComplete={id === 'current' ? 'current-password' : 'new-password'}
        />
        <button
          type="button"
          onClick={() => toggleShow(id)}
          style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', display: 'flex', alignItems: 'center' }}
        >
          {show[id] ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
      {errors[id] && (
        <p style={{ fontSize: 12, color: '#ef4444', marginTop: 5, display: 'flex', alignItems: 'center', gap: 4 }}>
          <AlertCircle size={12} /> {errors[id]}
        </p>
      )}
    </div>
  );




  
  useLayoutEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = CSS;
    document.head.appendChild(style);
  
    return () => style.remove();
  }, []);
  

  return (
    <>
      {/* <style>{CSS}</style> */}
      <div className="cp-root font-sans
" style={{ minHeight: '100vh', background: '#f8f9ff', 
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px 16px' }}>
 <div className="absolute inset-0 z-0">
    <img
      src="/images/Telecommunications-Aitechs.jpg" 
      alt="Network Background"
      className="w-full h-full object-cover"
    />
    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
  </div>
        {/* Card */}
        <div className="cp-card" style={{ width: '100%', maxWidth: 420, background: '#fff', border: '1px solid #e5e7eb', borderRadius: 20, boxShadow: '0 8px 40px rgba(0,0,0,.08)', overflow: 'hidden' }}>

          {/* Header */}
          <div style={{ padding: '28px 32px 20px', borderBottom: '1px solid #f3f4f6', textAlign: 'center' }}>
            <div style={{ width: 52, height: 52, borderRadius: 14, background: 'linear-gradient(135deg,#f5f3ff,#ede9fe)',
                 border: '1px solid #ddd6fe', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <Lock size={22} style={{ color: '#6366f1' }} />
            </div>
            <h1 style={{ fontSize: 20, fontWeight: 800, color: '#111827', margin: '0 0 6px', letterSpacing: '-.02em' }}>
              Change your password
            </h1>
            <p style={{ fontSize: 13, color: '#9ca3af', margin: 0 }}>
              Please change your password to something you can remember.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ padding: '24px 32px 28px' }} noValidate>

            {/* Status banner */}
            {status && (
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '12px 14px', borderRadius: 10, marginBottom: 20, background: status === 'success' ? '#f0fdf4' : '#fef2f2', border: `1px solid ${status === 'success' ? '#bbf7d0' : '#fecaca'}` }}>
                {status === 'success'
                  ? <CheckCircle size={16} style={{ color: '#059669', flexShrink: 0, marginTop: 1 }} />
                  : <AlertCircle size={16} style={{ color: '#dc2626', flexShrink: 0, marginTop: 1 }} />}
                <p style={{ fontSize: 13, color: status === 'success' ? '#166534' : '#991b1b', margin: 0 }}>{message}</p>
              </div>
            )}

            {/* <InputField id="current"  label="Current Password"  placeholder="Enter current password" /> */}
            <InputField id="password" label="New Password"       placeholder="Enter new password" />

            {/* Strength meter */}
            {pw && (
              <div style={{ marginTop: -10, marginBottom: 18 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <span style={{ fontSize: 11, color: '#9ca3af', fontWeight: 500 }}>Password strength</span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: st.color }}>{st.label}</span>
                </div>
                <div style={{ height: 4, background: '#f3f4f6', borderRadius: 99, overflow: 'hidden' }}>
                  <div className="cp-strength-bar" style={{ width: `${st.score}%`, background: st.color }} />
                </div>
                {/* Rules */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5px 8px', marginTop: 10 }}>
                  {RULES.map(r => {
                    const ok = r.test(pw);
                    return (
                      <div key={r.label} className="cp-rule" style={{ color: ok ? '#059669' : '#9ca3af' }}>
                        <CheckCircle size={11} style={{ flexShrink: 0, opacity: ok ? 1 : .35 }} />
                        {r.label}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <InputField id="confirm" label="Confirm New Password" placeholder="Re-enter new password" />

            {/* Submit */}
            <button type="submit" className="cp-btn" disabled={loading} style={{ marginTop: 4 }}>
              {loading
                ? <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ width: 15, height: 15, border: '2px solid rgba(255,255,255,.35)', borderTop: '2px solid #fff', borderRadius: '50%', animation: 'cp-spin 1s linear infinite', display: 'inline-block' }} />
                    Changing password…
                  </span>
                : 'Change Password'
              }
            </button>
          </form>
        </div>

        {/* Footer */}
        {/* <p style={{ fontSize: 12, color: '#d1d5db', marginTop: 20 }}>
          © {new Date().getFullYear()} BlessedTexts
        </p> */}

      </div>
    </>
  );
}