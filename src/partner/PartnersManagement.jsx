/**
 * PartnersManagement.jsx
 * Fixed: dropdown actions work, fully mobile-responsive card layout
 */
import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, TrendingUp, DollarSign, Clock, Plus, Search, RefreshCw,
  Edit, Trash2, ChevronRight, ChevronLeft, X, Check,
  Wifi, MoreVertical, ToggleLeft, ToggleRight,
  Building, ShoppingBag, Share2, User, Percent, Banknote,
  Phone, Mail, MapPin
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

// ── CSS ─────────────────────────────────────────────────────────────────────
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&family=JetBrains+Mono:wght@400;500&display=swap');
  .pm-root *  { box-sizing:border-box; }
  .pm-root    { font-family:'DM Sans',sans-serif; }
  .pm-mono    { font-family:'JetBrains Mono',monospace; }

  @keyframes pm-up   { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
  @keyframes pm-in   { from{opacity:0;transform:scale(.97)} to{opacity:1;transform:scale(1)} }
  @keyframes pm-spin { to{transform:rotate(360deg)} }

  .pm-card   { background:#fff; border:1px solid #e5e7eb; border-radius:14px; }
  .pm-input  { width:100%; padding:9px 13px; font-size:13px; font-family:'DM Sans',sans-serif; border:1.5px solid #e5e7eb; border-radius:9px; outline:none; color:#111827; background:#fff; transition:border .18s,box-shadow .18s; }
  .pm-input:focus { border-color:#6366f1; box-shadow:0 0 0 3px rgba(99,102,241,.1); }
  .pm-input::placeholder { color:#d1d5db; }
  .pm-select { appearance:none; cursor:pointer; }
  .pm-btn    { display:inline-flex; align-items:center; gap:6px; padding:9px 16px; border-radius:9px; font-size:13px; font-weight:600; cursor:pointer; border:none; font-family:'DM Sans',sans-serif; transition:all .15s; }
  .pm-btn-primary { background:#6366f1; color:#fff; }
  .pm-btn-primary:hover { background:#4f46e5; transform:translateY(-1px); box-shadow:0 6px 18px rgba(99,102,241,.28); }
  .pm-btn-ghost { background:transparent; color:#374151; border:1.5px solid #e5e7eb; }
  .pm-btn-ghost:hover { border-color:#c7d2fe; color:#6366f1; background:#f5f3ff; }
  .pm-tag    { display:inline-flex; align-items:center; padding:2px 9px; border-radius:20px; font-size:11px; font-weight:600; }
  .pm-step-dot { width:28px; height:28px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:11px; font-weight:700; flex-shrink:0; transition:all .2s; }
  .pm-backdrop { position:fixed; inset:0; background:rgba(0,0,0,.45); backdrop-filter:blur(5px); z-index:50; display:flex; align-items:center; justify-content:center; padding:20px; }
  .pm-modal  { background:#fff; border-radius:18px; width:100%; max-width:640px; max-height:90vh; overflow:hidden; display:flex; flex-direction:column; box-shadow:0 24px 80px rgba(0,0,0,.18); }
  ::-webkit-scrollbar { width:4px; }
  ::-webkit-scrollbar-thumb { background:#e5e7eb; border-radius:4px; }

  /* Partner card for mobile */
  .partner-card { background:#fff; border:1px solid #e5e7eb; border-radius:14px; padding:16px; margin-bottom:10px; }
  .partner-card:last-child { margin-bottom:0; }

  /* Responsive grid */
  .stat-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:12px; }
  .table-view { display:block; }
  .card-view  { display:none; }

  @media (max-width: 900px) {
    .stat-grid { grid-template-columns:repeat(2,1fr); }
  }
  @media (max-width: 640px) {
    .stat-grid { grid-template-columns:repeat(2,1fr); gap:8px; }
    .table-view { display:none; }
    .card-view  { display:block; }
    .pm-modal   { max-height:95vh; border-radius:14px; }
    .header-row { flex-direction:column; align-items:flex-start !important; gap:10px; }
    .header-btns { width:100%; }
    .header-btns button { flex:1; justify-content:center; }
    .filter-row { flex-wrap:wrap; }
    .filter-row input { min-width:0; }
    .filter-row select { width:100% !important; }
  }
`;

// ── Helpers ──────────────────────────────────────────────────────────────────
const fmtKsh  = n  => `KES ${Number(n||0).toLocaleString()}`;
const fmtDate = d  => d ? new Date(d).toLocaleDateString('en-KE',{day:'2-digit',month:'short',year:'numeric'}) : '—';
const uid     = () => Math.random().toString(36).slice(2,9);
const getCsrf = () => document?.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';

const TYPE_META = {
  landlord:  { label:'Landlord',  icon:Building,   color:'#059669', bg:'#d1fae5' },
  reseller:  { label:'Reseller',  icon:ShoppingBag, color:'#2563eb', bg:'#dbeafe' },
  affiliate: { label:'Affiliate', icon:Share2,      color:'#d97706', bg:'#fef3c7' },
  agent:     { label:'Agent',     icon:User,        color:'#7c3aed', bg:'#ede9fe' },
};

const STATUS_META = {
  active:   { color:'#059669', bg:'#d1fae5', label:'Active' },
  inactive: { color:'#6b7280', bg:'#f3f4f6', label:'Inactive' },
  pending:  { color:'#d97706', bg:'#fef3c7', label:'Pending' },
};

function TypeBadge({ type }) {
  const m = TYPE_META[type] || TYPE_META.agent;
  const Icon = m.icon;
  return (
    <span className="pm-tag" style={{ color:m.color, background:m.bg }}>
      <Icon size={10} style={{ marginRight:4 }}/>{m.label}
    </span>
  );
}

function StatusBadge({ status }) {
  const m = STATUS_META[status] || STATUS_META.inactive;
  return <span className="pm-tag" style={{ color:m.color, background:m.bg }}>{m.label}</span>;
}

function StatCard({ label, value, sub, icon:Icon, color, delay=0 }) {
  return (
    <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ delay }}
      className="pm-card" style={{ padding:'16px 18px', borderLeft:`3px solid ${color}` }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
        <div style={{ minWidth:0 }}>
          <p style={{ fontSize:10, color:'#9ca3af', fontWeight:600, textTransform:'uppercase', letterSpacing:'.06em', marginBottom:5, margin:'0 0 5px' }}>{label}</p>
          <p className="pm-mono" style={{ fontSize:20, fontWeight:700, color:'#111827', lineHeight:1, margin:0, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{value}</p>
          {sub && <p style={{ fontSize:11, color, marginTop:4, fontWeight:500, margin:'4px 0 0' }}>{sub}</p>}
        </div>
        <div style={{ width:34, height:34, borderRadius:10, background:`${color}15`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, marginLeft:8 }}>
          <Icon size={16} style={{ color }}/>
        </div>
      </div>
    </motion.div>
  );
}

function Field({ label, required, hint, children }) {
  return (
    <div style={{ marginBottom:16 }}>
      <label style={{ display:'block', fontSize:12, fontWeight:600, color:'#374151', marginBottom:5, textTransform:'uppercase', letterSpacing:'.05em' }}>
        {label}{required && <span style={{ color:'#ef4444', marginLeft:2 }}>*</span>}
      </label>
      {children}
      {hint && <p style={{ fontSize:11, color:'#9ca3af', marginTop:4, margin:'4px 0 0' }}>{hint}</p>}
    </div>
  );
}

// ── Dropdown Menu (fixed: uses mousedown, not click) ─────────────────────────
function ActionMenu({ partner, onEdit, onToggle, onDelete, onPayout }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const actions = [
    { label:'Edit',        icon:Edit,      danger:false, fn: () => { onEdit(); setOpen(false); } },
    { label:'Record Payout', icon:DollarSign, danger:false, fn: () => { onPayout(); setOpen(false); } },
    { label: partner.status==='active' ? 'Deactivate' : 'Activate',
      icon: partner.status==='active' ? ToggleLeft : ToggleRight,
      danger:false, fn: () => { onToggle(); setOpen(false); } },
    { label:'Delete',      icon:Trash2,    danger:true,  fn: () => { onDelete(); setOpen(false); } },
  ];

  return (
    <div ref={ref} style={{ position:'relative' }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{ width:32, height:32, border:'1px solid #e5e7eb', borderRadius:8, background:'#fff', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:'#6b7280' }}>
        <MoreVertical size={14}/>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity:0, scale:.93, y:-4 }}
            animate={{ opacity:1, scale:1, y:0 }}
            exit={{ opacity:0, scale:.93 }}
            style={{ position:'absolute', right:0, top:'calc(100% + 6px)', zIndex:100, background:'#fff', border:'1px solid #e5e7eb', borderRadius:10, padding:6, boxShadow:'0 8px 30px rgba(0,0,0,.15)', minWidth:170 }}>
            {actions.map(a => {
              const I = a.icon;
              return (
                <button key={a.label}
                  onMouseDown={(e) => { e.preventDefault(); a.fn(); }}
                  style={{ display:'flex', alignItems:'center', gap:8, width:'100%', padding:'9px 11px', border:'none', background:'none', cursor:'pointer', borderRadius:7, fontSize:13, color:a.danger?'#ef4444':'#374151', textAlign:'left', fontFamily:'DM Sans,sans-serif', fontWeight:500 }}
                  onMouseEnter={e => e.currentTarget.style.background = a.danger?'#fef2f2':'#f9fafb'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <I size={13}/>{a.label}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Form Modal ────────────────────────────────────────────────────────────────
const STEPS = ['Basic Info','Commission','Payout'];

function PartnerModal({ open, onClose, partner, onSaved, subdomain }) {
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    full_name:'', email:'', phone:'', partner_type:'landlord', city:'', country:'Kenya',
    commission_type:'percentage', commission_rate:15, fixed_amount:50,
    minimum_payout:500, payout_method:'mpesa', payout_frequency:'monthly',
    mpesa_number:'', mpesa_name:'', bank_name:'', account_number:'', account_name:'',
    status:'active', notes:'', 
  });

  useEffect(() => {
    if (partner) setForm(f => ({ ...f, ...partner }));
    else setForm({ full_name:'', email:'', phone:'', partner_type:'landlord',
       city:'', country:'Kenya',
      commission_type:'percentage', commission_rate:15, fixed_amount:50,
      minimum_payout:500, payout_method:'mpesa', payout_frequency:'monthly',
      mpesa_number:'', mpesa_name:'', bank_name:'', account_number:'', account_name:'',
      status:'active', notes:'',
    });
    setStep(0);
  }, [partner, open]);

  const set = (k, v) => setForm(f => ({ ...f, [k]:v }));
  const isEdit = !!partner;

  const handleSave = async () => {
    if (!form.full_name || !form.email || !form.phone) { toast.error('Fill in all required fields.'); setStep(0); return; }
    setSaving(true);
    try {
      const res = await fetch(isEdit ? `/api/partners/${partner.id}` : '/api/partners', {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type':'application/json', 'X-Subdomain':subdomain, 'X-CSRF-Token':getCsrf() },
        body: JSON.stringify({ partner: form }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(isEdit ? 'Partner updated.' : 'Partner created.');
        onSaved(data);
        onClose();
      } else {
        toast.error(data.error || 'Failed to save partner.');
      }
    } catch (_) {
      toast.success(isEdit ? 'Partner updated.' : 'Partner created (local).');
      onSaved({ ...form, id: partner?.id || uid(), created_at: new Date().toISOString(), total_earned:partner?.total_earned||0, pending_payout:partner?.pending_payout||0, hotspots_count:partner?.hotspots_count||0 });
      onClose();
    } finally {
      setSaving(false);
    }
  };

  if (!open) return null;
  return (
    <div className="pm-backdrop" onClick={onClose}>
      <motion.div 
      className="bg-white roundecleard-[18px] w-5/6 max-w-[640px]
       max-h-[90vh] overflow-hidden flex 
      flex-col shadow-[0_24px_80px_rgba(0,0,0,0.18)]"
      
      initial={{ scale:.95, opacity:0 }} animate={{ scale:1, opacity:1 }}
        transition={{ type:'spring', stiffness:220, damping:22 }} onClick={e => e.stopPropagation()}>

        <div style={{ padding:'20px 24px 16px', borderBottom:'1px solid #f3f4f6', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div>
            <h2 style={{ fontSize:16, fontWeight:700, color:'#111827', margin:0 }}>{isEdit ? 'Edit Partner' : 'Add Partner'}</h2>
            <p style={{ fontSize:12, color:'#9ca3af', margin:0 }}>Step {step+1} of {STEPS.length} — {STEPS[step]}</p>
          </div>
          <button onClick={onClose} style={{ background:'none', border:'none', cursor:'pointer', color:'#6b7280', padding:4 }}>
            <X size={18}/>
          </button>
        </div>

        {/* Step bar */}
        <div style={{ display:'flex', padding:'14px 24px', borderBottom:'1px solid #f3f4f6', overflowX:'auto' }}>
          {STEPS.map((s, i) => (
            <div key={s} style={{ display:'flex', alignItems:'center', flex: i<STEPS.length-1?1:'none', minWidth:0 }}>
              <button onClick={() => i < step && setStep(i)}
                style={{ display:'flex', alignItems:'center', gap:8, background:'none', border:'none', cursor: i<step?'pointer':'default', padding:0, minWidth:0 }}>
                <div className="pm-step-dot" style={{ background:i<step?'#10b981':i===step?'#6366f1':'#f3f4f6', color:i<=step?'#fff':'#9ca3af', flexShrink:0 }}>
                  {i < step ? <Check size={13}/> : i+1}
                </div>
                <span style={{ fontSize:12, fontWeight:600, color:i===step?'#6366f1':i<step?'#10b981':'#9ca3af', whiteSpace:'nowrap' }}>{s}</span>
              </button>
              {i < STEPS.length-1 && <div style={{ flex:1, height:2, background:i<step?'#10b981':'#e5e7eb', margin:'0 8px', minWidth:12 }}/>}
            </div>
          ))}
        </div>

        <div style={{ flex:1, overflowY:'auto', padding:'20px 24px' }}>
          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div key="s0" initial={{ opacity:0, x:12 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-12 }} transition={{ duration:.18 }}>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:12 }}>
                  <div style={{ gridColumn:'1/-1' }}>
                    <Field label="Full Name" required>
                      <input className="pm-input" value={form.full_name} onChange={e=>set('full_name',e.target.value)} placeholder="e.g. John Doe"/>
                    </Field>
                  </div>
                  <Field label="Partner Type" required>
                    <select className="pm-input pm-select" value={form.partner_type} onChange={e=>set('partner_type',e.target.value)}>
                      {Object.entries(TYPE_META).map(([k,v])=><option key={k} value={k}>{v.label}</option>)}
                    </select>
                  </Field>
                  <Field label="Status">
                    <select className="pm-input pm-select" value={form.status} onChange={e=>set('status',e.target.value)}>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="pending">Pending</option>
                    </select>
                  </Field>
                  <Field label="Email" required>
                    <input className="pm-input" type="email" value={form.email} onChange={e=>set('email',e.target.value)} placeholder="email@example.com"/>
                  </Field>
                  <Field label="Phone" required>
                    <input className="pm-input" value={form.phone} onChange={e=>set('phone',e.target.value)} placeholder="07XX XXX XXX"/>
                  </Field>
                  <Field label="City">
                    <input className="pm-input" value={form.city} onChange={e=>set('city',e.target.value)} placeholder="Nairobi"/>
                  </Field>
                  <Field label="Country">
                    <input className="pm-input" value={form.country} onChange={e=>set('country',e.target.value)} placeholder="Kenya"/>
                  </Field>
                  <div style={{ gridColumn:'1/-1' }}>
                    <Field label="Notes">
                      <textarea className="pm-input" value={form.notes} onChange={e=>set('notes',e.target.value)} rows={2} style={{ resize:'none' }} placeholder="Optional internal notes"/>
                    </Field>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 1 && (
              <motion.div key="s1" initial={{ opacity:0, x:12 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-12 }} transition={{ duration:.18 }}>
                <Field label="Commission Type" required>
                  <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))', gap:10 }}>
                    {[{k:'percentage',l:'Percentage',icon:Percent,desc:'% of each sale'},{k:'fixed',l:'Fixed Amount',icon:Banknote,desc:'Fixed KES per sale'}].map(opt => {
                      const Icon = opt.icon;
                      const active = form.commission_type === opt.k;
                      return (
                        <button key={opt.k} onClick={()=>set('commission_type',opt.k)}
                          style={{ display:'flex', alignItems:'center', gap:10, padding:'12px 14px', border:`1.5px solid ${active?'#6366f1':'#e5e7eb'}`, borderRadius:10, background:active?'#f5f3ff':'#fff', cursor:'pointer', textAlign:'left' }}>
                          <Icon size={16} style={{ color:active?'#6366f1':'#9ca3af', flexShrink:0 }}/>
                          <div>
                            <p style={{ fontSize:13, fontWeight:600, color:active?'#6366f1':'#374151', margin:0 }}>{opt.l}</p>
                            <p style={{ fontSize:11, color:'#9ca3af', margin:0 }}>{opt.desc}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </Field>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))', gap:12, marginTop:4 }}>
                  {form.commission_type === 'percentage' ? (
                    <Field label="Commission Rate (%)" required>
                      <input className="pm-input pm-mono" type="number" min="1" max="100" value={form.commission_rate} onChange={e=>set('commission_rate',e.target.value)} placeholder="15"/>
                    </Field>
                  ) : (
                    <Field label="Fixed Amount (KES)" required>
                      <input className="pm-input pm-mono" type="number" min="1" value={form.fixed_amount} onChange={e=>set('fixed_amount',e.target.value)} placeholder="50"/>
                    </Field>
                  )}
                  <Field label="Minimum Payout (KES)">
                    <input className="pm-input pm-mono" type="number" min="0" value={form.minimum_payout} onChange={e=>set('minimum_payout',e.target.value)} placeholder="500"/>
                  </Field>
                </div>
                <div style={{ padding:'12px 14px', background:'#f0fdf4', border:'1px solid #bbf7d0', borderRadius:10, marginTop:4 }}>
                  <p style={{ fontSize:12, color:'#166534', margin:0 }}>
                    {form.commission_type === 'percentage'
                      ? `✅ Partner earns ${form.commission_rate}% on each voucher/subscription sold`
                      : `✅ Partner earns KES ${form.fixed_amount} per voucher/subscription sold`}
                  </p>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="s2" initial={{ opacity:0, x:12 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-12 }} transition={{ duration:.18 }}>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))', gap:12 }}>
                  <Field label="Payout Method" required>
                    <select className="pm-input pm-select" value={form.payout_method} onChange={e=>set('payout_method',e.target.value)}>
                      <option value="mpesa">M-Pesa</option>
                      <option value="bank">Bank Transfer</option>
                      <option value="cash">Cash</option>
                    </select>
                  </Field>
                  <Field label="Payout Frequency">
                    <select className="pm-input pm-select" value={form.payout_frequency} onChange={e=>set('payout_frequency',e.target.value)}>
                      <option value="weekly">Weekly</option>
                       <option value="Daily">Daily</option>
                      <option value="biweekly">Bi-weekly</option>
                      <option value="monthly">Monthly</option>
                      <option value="manual">Manual</option>
                    </select>
                  </Field>
                </div>
                {form.payout_method === 'mpesa' && (
                  <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))', gap:12, padding:14, background:'#f9fafb', borderRadius:10, border:'1px solid #e5e7eb', marginTop:4 }}>
                    <Field label="M-Pesa Number" required>
                      <input className="pm-input" value={form.mpesa_number} onChange={e=>set('mpesa_number',e.target.value)} placeholder="07XX XXX XXX"/>
                    </Field>
                    <Field label="Account Name">
                      <input className="pm-input" value={form.mpesa_name} onChange={e=>set('mpesa_name',e.target.value)} placeholder="Registered name"/>
                    </Field>
                  </div>
                )}
                {form.payout_method === 'bank' && (
                  <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))', gap:12, padding:14, background:'#f9fafb', borderRadius:10, border:'1px solid #e5e7eb', marginTop:4 }}>
                    <Field label="Bank Name">
                      <input className="pm-input" value={form.bank_name} onChange={e=>set('bank_name',e.target.value)} placeholder="KCB, Equity…"/>
                    </Field>
                    <Field label="Account Number">
                      <input className="pm-input pm-mono" value={form.account_number} onChange={e=>set('account_number',e.target.value)} placeholder="1234567890"/>
                    </Field>
                    <div style={{ gridColumn:'1/-1' }}>
                      <Field label="Account Holder Name">
                        <input className="pm-input" value={form.account_name} onChange={e=>set('account_name',e.target.value)} placeholder="John Doe"/>
                      </Field>
                    </div>
                  </div>
                )}
                <div style={{ marginTop:16, padding:14, background:'#fff', border:'1px solid #e5e7eb', borderRadius:10 }}>
                  <p style={{ fontSize:11, fontWeight:700, color:'#374151', textTransform:'uppercase', letterSpacing:'.06em', marginBottom:10 }}>Summary</p>
                  {[
                    ['Name',       form.name],
                    ['Type',       TYPE_META[form.type]?.label],
                    ['Commission', form.commission_type==='percentage' ? `${form.commission_rate}%` : `KES ${form.fixed_amount} fixed`],
                    ['Payout',     `${form.payout_method} · ${form.payout_frequency}`],
                    ['Min payout', `KES ${form.minimum_payout}`],
                  ].map(([k,v]) => (
                    <div key={k} style={{ display:'flex', justifyContent:'space-between', padding:'4px 0', borderBottom:'1px solid #f3f4f6' }}>
                      <span style={{ fontSize:12, color:'#6b7280' }}>{k}</span>
                      <span style={{ fontSize:12, fontWeight:600, color:'#111827' }}>{v}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div style={{ padding:'14px 24px', borderTop:'1px solid #f3f4f6', display:'flex', justifyContent:'space-between' }}>
          <button className="pm-btn pm-btn-ghost" onClick={step===0?onClose:()=>setStep(s=>s-1)}>
            {step===0 ? <><X size={14}/>Cancel</> : <><ChevronLeft size={14}/>Back</>}
          </button>
          <button className="pm-btn pm-btn-primary"
            onClick={step<STEPS.length-1?()=>setStep(s=>s+1):handleSave}
            disabled={saving} style={{ opacity:saving?.6:1 }}>
            {saving
              ? <><span style={{ width:13,height:13,border:'2px solid rgba(255,255,255,.4)',borderTop:'2px solid #fff',borderRadius:'50%',animation:'pm-spin 1s linear infinite',display:'inline-block' }}/> Saving…</>
              : step<STEPS.length-1 ? <>Continue <ChevronRight size={14}/></> : <><Check size={14}/>{isEdit?'Update Partner':'Create Partner'}</>}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ── Payout Modal ──────────────────────────────────────────────────────────────
function PayoutModal({ open, partner, onClose, subdomain }) {
  const [amount, setAmount] = useState('');
  const [note,   setNote]   = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => { if (open) { setAmount(''); setNote(''); } }, [open]);

  const handlePay = async () => {
    if (!amount) { toast.error('Enter amount'); return; }
    setLoading(true);
    try {
      const res = await fetch('/api/partner_payouts', {
        method:'POST',
        headers:{'Content-Type':'application/json','X-Subdomain':subdomain,'X-CSRF-Token':getCsrf()},
        body: JSON.stringify({ partner_id:partner.id, amount, note }),
      });
      if (res.ok) { toast.success(`KES ${amount} payout initiated to ${partner.name}`); onClose(); }
      else toast.error('Payout failed');
    } catch(_){ toast.success(`KES ${amount} payout recorded (local)`); onClose(); }
    finally{ setLoading(false); }
  };

  if (!open || !partner) return null;
  return (
    <div className="pm-backdrop" onClick={onClose}>
      <motion.div initial={{ scale:.95,opacity:0 }} animate={{ scale:1,opacity:1 }}
        transition={{ type:'spring',stiffness:220,damping:22 }}
        style={{ background:'#fff',borderRadius:16,width:'100%',maxWidth:420,padding:28,boxShadow:'0 24px 80px rgba(0,0,0,.18)' }}
        onClick={e=>e.stopPropagation()}>
        <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20 }}>
          <h3 style={{ fontSize:16,fontWeight:700,color:'#111827',margin:0 }}>Record Payout</h3>
          <button onClick={onClose} style={{ background:'none',border:'none',cursor:'pointer',color:'#6b7280' }}><X size={16}/></button>
        </div>
        <div style={{ padding:'12px 14px',background:'#f9fafb',borderRadius:10,marginBottom:18 }}>
          <p style={{ fontSize:13,fontWeight:600,color:'#111827',margin:'0 0 2px' }}>{partner.name}</p>
          <p style={{ fontSize:12,color:'#6b7280',margin:0 }}>
            Pending: <strong style={{ color:'#dc2626' }}>{fmtKsh(partner?.pending_payout)}</strong> ·
            Method: <strong>{partner?.payout_method||'M-Pesa'}</strong>
          </p>
        </div>
        <Field label="Payout Amount (KES)" required>
          <input className="pm-input pm-mono" type="number" value={amount} onChange={e=>setAmount(e.target.value)} placeholder="e.g. 500"/>
        </Field>
        <Field label="Note">
          <input className="pm-input" value={note} onChange={e=>setNote(e.target.value)} placeholder="Optional note"/>
        </Field>
        <button className="pm-btn pm-btn-primary" onClick={handlePay} disabled={loading}
          style={{ width:'100%',justifyContent:'center',marginTop:4 }}>
          {loading ? 'Processing…' : `Send Payout → ${partner.payout_method==='mpesa'?partner.mpesa_number:partner.account_number||'partner'}`}
        </button>
      </motion.div>
    </div>
  );
}

// ── Mobile Partner Card ───────────────────────────────────────────────────────
function PartnerCard({ p, onEdit, onToggle, onDelete, onPayout, index }) {
  const partnerType = p.partner_type || p.type || 'agent';
  const m = TYPE_META[partnerType] || TYPE_META.agent;
  const TypeIcon = m.icon;

  return (
    <motion.div className="partner-card"
      initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} transition={{ delay: index * 0.04 }}>
      {/* Top row: avatar + name + menu */}
      <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:12 }}>
        <div style={{ width:40,height:40,borderRadius:10,background:m.bg,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0 }}>
          <TypeIcon size={18} style={{ color:m.color }}/>
        </div>
        <div style={{ flex:1, minWidth:0 }}>
          <p style={{ fontSize:14,fontWeight:700,color:'#111827',margin:0,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap' }}>{p.name}</p>
          <p style={{ fontSize:12,color:'#9ca3af',margin:0,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap' }}>{p.email}</p>
        </div>
        <ActionMenu partner={p} onEdit={onEdit} onToggle={onToggle} onDelete={onDelete} onPayout={onPayout}/>
      </div>

      {/* Badges */}
      <div style={{ display:'flex', gap:6, flexWrap:'wrap', marginBottom:12 }}>
        <TypeBadge type={partnerType}/>
        <StatusBadge status={p.status}/>
        <span className="pm-tag" style={{ color:'#374151', background:'#f3f4f6' }}>
          <Wifi size={9} style={{ marginRight:4 }}/>{p.hotspots_count} APs
        </span>
      </div>

      {/* Stats row */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:8 }}>
        <div style={{ background:'#f9fafb', borderRadius:8, padding:'8px 10px' }}>
          <p style={{ fontSize:10,color:'#9ca3af',margin:'0 0 2px',fontWeight:600,textTransform:'uppercase',letterSpacing:'.05em' }}>Commission</p>
          <p className="pm-mono" style={{ fontSize:13,fontWeight:700,color:'#111827',margin:0 }}>
            {p.commission_type==='percentage' ? `${p.commission_rate}%` : fmtKsh(p.fixed_amount)}
          </p>
        </div>
        <div style={{ background:'#f0fdf4', borderRadius:8, padding:'8px 10px' }}>
          <p style={{ fontSize:10,color:'#9ca3af',margin:'0 0 2px',fontWeight:600,textTransform:'uppercase',letterSpacing:'.05em' }}>Earned</p>
          <p className="pm-mono" style={{ fontSize:13,fontWeight:700,color:'#059669',margin:0 }}>{fmtKsh(p.total_earned)}</p>
        </div>
        <div style={{ background:'#fefce8', borderRadius:8, padding:'8px 10px' }}>
          <p style={{ fontSize:10,color:'#9ca3af',margin:'0 0 2px',fontWeight:600,textTransform:'uppercase',letterSpacing:'.05em' }}>Pending</p>
          <p className="pm-mono" style={{ fontSize:13,fontWeight:700,color:'#d97706',margin:0 }}>{fmtKsh(p.pending_payout)}</p>
        </div>
      </div>

      {/* Quick payout button */}
      <button className="pm-btn pm-btn-ghost" onClick={onPayout}
        style={{ width:'100%', justifyContent:'center', marginTop:10, fontSize:13 }}>
        <DollarSign size={13}/> Record Payout
      </button>
    </motion.div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function PartnersManagement() {
  const subdomain = window.location.hostname.split('.')[0];

  const [partners,     setPartners]     = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [search,       setSearch]       = useState('');
  const [typeFilter,   setTypeFilter]   = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showForm,     setShowForm]     = useState(false);
  const [editTarget,   setEditTarget]   = useState(null);
  const [payoutTarget, setPayoutTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const fetchPartners = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/partners', { headers:{'X-Subdomain':subdomain} });
      if (res.ok) { setPartners(await res.json()); return; }
      throw new Error();
    } catch (_) {
      const NAMES = ['Alice Mwangi','Bob Kamau','Carol Odhiambo','David Njoroge','Eve Atieno','Frank Omondi','Grace Wanjiru','Hassan Abdi'];
      setPartners(Array.from({length:8},(_,i)=>({
        id:`p-${i}`, name:NAMES[i%NAMES.length], email:`partner${i+1}@demo.com`,
        phone:`07${String(10000000+i*1234567).slice(0,8)}`, type:['landlord','reseller','affiliate','agent'][i%4],
        city:'Nairobi', country:'Kenya', commission_type:i%2===0?'percentage':'fixed',
        commission_rate:15+i, fixed_amount:30+i*10, payout_method:i%3===0?'bank':'mpesa',
        payout_frequency:'monthly', mpesa_number:`07${String(10000000+i).slice(0,8)}`,
        status:['active','active','active','inactive','pending'][i%5],
        total_earned:(i+1)*8500, pending_payout:(i+1)*1200, hotspots_count:i+1,
        created_at: new Date(Date.now()-i*30*864e5).toISOString(),
      })));
    } finally { setLoading(false); }
  }, [subdomain]);

  useEffect(() => { fetchPartners(); }, [fetchPartners]);

  const visible = partners.filter(p => {
    const q = search.toLowerCase();
    const matchQ = !q || p.name?.toLowerCase().includes(q) || p.email?.toLowerCase().includes(q) || p.phone?.includes(q);
    const matchT = typeFilter==='all' || (p.partner_type||p.type)===typeFilter;
    const matchS = statusFilter==='all' || p.status===statusFilter;
    return matchQ && matchT && matchS;
  });

  const stats = {
    total:        partners.length,
    active:       partners.filter(p=>p.status==='active').length,
    totalEarned:  partners.reduce((s,p)=>s+(p.total_earned||0),0),
    pending:      partners.reduce((s,p)=>s+(p.pending_payout||0),0),
  };

  const handleSaved = (data) => {
    setPartners(prev => {
      const idx = prev.findIndex(p=>p.id===data.id);
      if (idx>=0) { const n=[...prev]; n[idx]=data; return n; }
      return [data,...prev];
    });
  };

  const handleDelete = async (id) => {
    try { await fetch(`/api/partners/${id}`,{method:'DELETE',headers:{'X-Subdomain':subdomain,'X-CSRF-Token':getCsrf()}}); } catch(_){}
    setPartners(prev=>prev.filter(p=>p.id!==id));
    setDeleteTarget(null);
    toast.success('Partner deleted.');
  };

  const handleToggle = (p) => {
    const next = p.status==='active'?'inactive':'active';
    setPartners(prev=>prev.map(x=>x.id===p.id?{...x,status:next}:x));
    toast.success(`${p.name} set to ${next}.`);
  };

  const openEdit   = (p) => { setEditTarget(p); setShowForm(true); };
  const openPayout = (p) => setPayoutTarget(p);
  const openDelete = (p) => setDeleteTarget(p.id);

  return (
    <>
      <style>{CSS}</style>
      <Toaster position="top-right" toastOptions={{ style:{fontFamily:'DM Sans,sans-serif',fontSize:13} }}/>

      <PartnerModal
        open={showForm}
        onClose={()=>{setShowForm(false);setEditTarget(null);}}
        partner={editTarget}
        onSaved={handleSaved}
        subdomain={subdomain}/>

      <PayoutModal
        open={!!payoutTarget}
        onClose={()=>setPayoutTarget(null)}
        partner={payoutTarget}
        subdomain={subdomain}/>

      {/* Delete confirm */}
      {deleteTarget && (
        <div className="pm-backdrop" onClick={()=>setDeleteTarget(null)}>
          <motion.div initial={{ scale:.94,opacity:0 }} animate={{ scale:1,opacity:1 }}
            transition={{ type:'spring',stiffness:240,damping:22 }}
            onClick={e=>e.stopPropagation()}
            style={{ background:'#fff',borderRadius:16,padding:28,maxWidth:380,width:'100%',boxShadow:'0 24px 80px rgba(0,0,0,.18)' }}>
            <div style={{ width:44,height:44,borderRadius:12,background:'#fef2f2',display:'flex',alignItems:'center',justifyContent:'center',marginBottom:16 }}>
              <Trash2 size={20} style={{ color:'#ef4444' }}/>
            </div>
            <h3 style={{ fontSize:16,fontWeight:700,color:'#111827',margin:'0 0 6px' }}>Delete partner?</h3>
            <p style={{ fontSize:13,color:'#6b7280',margin:'0 0 22px' }}>
              This will permanently remove the partner and all their records. This cannot be undone.
            </p>
            <div style={{ display:'flex',gap:10 }}>
              <button className="pm-btn pm-btn-ghost" onClick={()=>setDeleteTarget(null)} style={{ flex:1,justifyContent:'center' }}>
                Cancel
              </button>
              <button className="pm-btn" onClick={()=>handleDelete(deleteTarget)}
                style={{ flex:1,justifyContent:'center',background:'#ef4444',color:'#fff',border:'none' }}>
                <Trash2 size={13}/> Delete
              </button>
            </div>
          </motion.div>
        </div>
      )}

      <div className="pm-root" style={{ padding:'24px 0', minHeight:'100vh', background:'#f9fafb' }}>
        <div style={{ maxWidth:1100, margin:'0 auto', padding:'0 16px' }}>

          {/* Header */}
          <div className="header-row" style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:20 }}>
            <div>
              <h1 style={{ fontSize:22, fontWeight:800, color:'#111827', margin:'0 0 4px', letterSpacing:'-.02em' }}>Partners</h1>
              <p style={{ fontSize:13, color:'#9ca3af', margin:0 }}>Manage commissions, payouts and partner accounts</p>
            </div>
            <div className="header-btns" style={{ display:'flex', gap:8, flexShrink:0 }}>
              <button className="pm-btn pm-btn-ghost" onClick={fetchPartners}>
                <RefreshCw size={14} style={{ animation:loading?'pm-spin 1s linear infinite':'' }}/> Refresh
              </button>
              <button className="pm-btn pm-btn-primary" onClick={()=>{setEditTarget(null);setShowForm(true);}}>
                <Plus size={14}/> Add Partner
              </button>
            </div>
          </div>

          {/* Stat cards */}
          <div className="stat-grid" style={{ marginBottom:16 }}>
            <StatCard label="Total Partners"    value={stats.total}               icon={Users}      color="#6366f1" delay={0}/>
            <StatCard label="Active"            value={stats.active}              icon={Check}      color="#059669" delay={.05}/>
            <StatCard label="Total Commissions" value={fmtKsh(stats.totalEarned)} icon={TrendingUp} color="#0ea5e9" delay={.1}/>
            <StatCard label="Pending Payouts"   value={fmtKsh(stats.pending)}     icon={Clock}      color="#d97706" delay={.15}/>
          </div>

          {/* Filters */}
          <div className="pm-card filter-row" style={{ padding:'12px 14px', marginBottom:12, display:'flex', gap:8, alignItems:'center', flexWrap:'wrap' }}>
            <div style={{ position:'relative', flex:'1 1 200px', minWidth:0 }}>
              <Search size={13} style={{ position:'absolute', left:10, top:'50%', transform:'translateY(-50%)', color:'#9ca3af' }}/>
              <input className="pm-input" style={{ paddingLeft:30 }} value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search name, email, phone…"/>
            </div>
            <select className="pm-input pm-select" style={{ flex:'0 0 130px', width:'auto' }} value={typeFilter} onChange={e=>setTypeFilter(e.target.value)}>
              <option value="all">All Types</option>
              {Object.entries(TYPE_META).map(([k,v])=><option key={k} value={k}>{v.label}</option>)}
            </select>
            <select className="pm-input pm-select" style={{ flex:'0 0 130px', width:'auto' }} value={statusFilter} onChange={e=>setStatusFilter(e.target.value)}>
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="pending">Pending</option>
            </select>
            <span style={{ fontSize:12, color:'#9ca3af', whiteSpace:'nowrap' }}>{visible.length} results</span>
          </div>

          {/* ── Desktop Table ─────────────────────────────────────────────── */}
          <div className="pm-card table-view" >
            {loading ? (
              <div style={{ padding:60, textAlign:'center' }}>
                <div style={{ width:32,height:32,border:'3px solid #e5e7eb',borderTop:'3px solid #6366f1',borderRadius:'50%',animation:'pm-spin 1s linear infinite',margin:'0 auto 12px'}}/>
                <p style={{ color:'#9ca3af', fontSize:13 }}>Loading partners…</p>
              </div>
            ) : visible.length === 0 ? (
              <div style={{ padding:60, textAlign:'center' }}>
                <Users size={36} style={{ color:'#e5e7eb', marginBottom:12 }}/>
                <p style={{ fontWeight:600, color:'#374151', marginBottom:4 }}>No partners found</p>
                <p style={{ fontSize:12, color:'#9ca3af' }}>Try adjusting your search or filters</p>
              </div>
            ) : (
              <>
                <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr 1fr 1fr 1fr 1fr 44px', padding:'10px 18px', background:'#f9fafb', borderBottom:'1px solid #f3f4f6' }}>
                  {['Partner','Type','Commission','Earnings','APs','Status',''].map(h=>(
                    <span key={h} style={{ fontSize:11, fontWeight:700, color:'#9ca3af', textTransform:'uppercase', letterSpacing:'.06em' }}>{h}</span>
                  ))}
                </div>
                {visible.map((p, i) => {
                  const partnerType = p?.partner_type || 'agent';
                  const m = TYPE_META[partnerType] || TYPE_META.agent;
                  const TypeIcon = m.icon;
                  return (
                    <motion.div key={p.id}
                      initial={{ opacity:0, y:6 }} animate={{ opacity:1, y:0 }} transition={{ delay:i*.03 }}
                      style={{ display:'grid', gridTemplateColumns:'2fr 1fr 1fr 1fr 1fr 1fr 44px', padding:'13px 18px', alignItems:'center', borderBottom:'1px solid #f3f4f6', position:'relative' }}
                      onMouseEnter={e=>e.currentTarget.style.background='#f9fafb'}
                      onMouseLeave={e=>e.currentTarget.style.background='#fff'}>
                      <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                        <div style={{ width:34,height:34,borderRadius:9,background:m.bg,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0 }}>
                          <TypeIcon size={15} style={{ color:m.color }}/>
                        </div>
                        <div style={{ minWidth:0 }}>
                          <p style={{ fontSize:13,fontWeight:600,color:'#111827',margin:0,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap' }}>{p?.full_name}</p>
                          <p style={{ fontSize:11,color:'#9ca3af',margin:0,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap' }}>{p?.email}</p>
                        </div>
                      </div>
                      <TypeBadge type={partnerType}/>
                      <div>
                        <p className="pm-mono" style={{ fontSize:14,fontWeight:700,color:'#111827',margin:0 }}>
                          {p?.commission_type==='percentage' ? `${p?.commission_rate}%` : fmtKsh(p?.fixed_amount)}
                        </p>
                        <p style={{ fontSize:11,color:'#9ca3af',margin:0 }}>{p.commission_type==='percentage'?'per sale':'fixed'}</p>
                      </div>
                      <div>
                        <p className="pm-mono" style={{ fontSize:13,fontWeight:600,color:'#059669',margin:0 }}>{fmtKsh(p?.total_earned)}</p>
                        <p style={{ fontSize:11,color:'#d97706',margin:0 }}>Pending: {fmtKsh(p?.pending_payout)}</p>
                      </div>
                      <div style={{ display:'flex',alignItems:'center',gap:5 }}>
                        <Wifi size={13} style={{ color:'#059669' }}/>
                        <span style={{ fontSize:13,fontWeight:600,color:'#374151' }}>{p?.hotspots_count}</span>
                      </div>
                      <StatusBadge status={p?.status}/>
                      <div style={{ display:'flex', justifyContent:'flex-end' }}>
                        <ActionMenu
                          partner={p}
                          onEdit={()=>openEdit(p)}
                          onToggle={()=>handleToggle(p)}
                          onDelete={()=>openDelete(p)}
                          onPayout={()=>openPayout(p)}/>
                      </div>
                    </motion.div>
                  );
                })}
              </>
            )}
          </div>

          {/* ── Mobile Card View ──────────────────────────────────────────── */}
          <div className="card-view">
            {loading ? (
              <div style={{ padding:60, textAlign:'center' }}>
                <div style={{ width:32,height:32,border:'3px solid #e5e7eb',borderTop:'3px solid #6366f1',borderRadius:'50%',animation:'pm-spin 1s linear infinite',margin:'0 auto 12px'}}/>
                <p style={{ color:'#9ca3af', fontSize:13 }}>Loading partners…</p>
              </div>
            ) : visible.length === 0 ? (
              <div style={{ padding:60, textAlign:'center' }}>
                <Users size={36} style={{ color:'#e5e7eb', marginBottom:12 }}/>
                <p style={{ fontWeight:600, color:'#374151', marginBottom:4 }}>No partners found</p>
                <p style={{ fontSize:12, color:'#9ca3af' }}>Try adjusting filters</p>
              </div>
            ) : visible.map((p, i) => (
              <PartnerCard
                key={p.id}
                p={p}
                index={i}
                onEdit={()=>openEdit(p)}
                onToggle={()=>handleToggle(p)}
                onDelete={()=>openDelete(p)}
                onPayout={()=>openPayout(p)}/>
            ))}
          </div>

        </div>
      </div>
    </>
  );
}