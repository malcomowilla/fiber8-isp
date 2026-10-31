import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import toast, { Toaster } from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'

const COUNTRIES = [
  'Kenya (KES)', 'Nigeria (NGN)', 'Tanzania (TZS)', 'Uganda (UGX)', 'South Africa (ZAR)',
  'Ghana (GHS)', 'Rwanda (RWF)', 'Zambia (ZMW)', 'Malawi (MWK)', 'Cameroon (XAF)',
  'Zimbabwe (USD)', 'Somalia (USD)', 'United States (USD)', 'United Kingdom (GBP)',
  'Canada (CAD)', 'Australia (AUD)', 'India (INR)', 'UAE (AED)', 'Saudi Arabia (SAR)',
]



const ROOT_DOMAIN = import.meta.env.VITE_PLATFORM_DOMAIN || 'owitech.co.ke'
const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 30)

const inputCls = `h-11 w-full rounded-lg border border-black/15 bg-transparent px-3 text-sm text-black outline-none
  focus:border-black/50 disabled:opacity-60 dark:border-white/15 dark:text-white dark:focus:border-white/50`
const btnCls = `inline-flex h-11 items-center justify-center rounded-lg bg-black px-5 text-sm font-semibold
  text-white disabled:opacity-50 dark:bg-white dark:text-black`
const ghostBtnCls = `inline-flex h-11 items-center justify-center rounded-lg border border-black/15 px-4 text-sm
  font-medium text-black disabled:opacity-50 dark:border-white/15 dark:text-white`

const Field = ({ label, hint, children }) => (
  <label className="block">
    <span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
      {label}
    </span>
    {children}
    {hint && <span className="mt-1.5 block text-xs text-gray-500 dark:text-gray-400">{hint}</span>}
  </label>
)

const postJson = async (url, body) => {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  const data = await res.json().catch(() => ({}))
  return { ok: res.ok, data }
}

export default function ApplyForAccess() {
  const [form, setForm] = useState({
    name: '', company_name: '', email: '', country: '',
    phone_number: '', support_whatsapp: '', referral_code: '', accepted_terms: false,
  })
  const [emailStage, setEmailStage] = useState('idle') // idle | code_sent | verified
  const [code, setCode] = useState('')
  const [emailToken, setEmailToken] = useState('')
  const [busy, setBusy] = useState('') // '' | 'send' | 'verify' | 'submit'
  const [resendIn, setResendIn] = useState(0)
  const [subCheck, setSubCheck] = useState(null) // { available, subdomain, domain }
  const [done, setDone] = useState(null)

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))
  const subdomain = slugify(form.company_name)

  // debounced subdomain availability check
  useEffect(() => {
    if (subdomain.length < 3) { setSubCheck(null); return }
    const t = setTimeout(async () => {
      try {
        const res = await fetch(`/api/access_applications/check_subdomain?company_name=${encodeURIComponent(form.company_name)}`)
        if (res.ok) setSubCheck(await res.json())
      } catch { /* non-critical */ }
    }, 400)
    return () => clearTimeout(t)
  }, [form.company_name, subdomain.length])

  useEffect(() => {
    if (resendIn <= 0) return
    const t = setTimeout(() => setResendIn((s) => s - 1), 1000)
    return () => clearTimeout(t)
  }, [resendIn])

  const onEmailChange = (e) => {
    setForm((f) => ({ ...f, email: e.target.value }))
    setEmailStage('idle')
    setEmailToken('')
    setCode('')
  }

  const sendCode = useCallback(async () => {
    setBusy('send')
    try {
      const { ok, data } = await postJson('/api/access_applications/send_email_code', { email: form.email })
      if (!ok) { toast.error(data.error || 'Could not send code'); return }
      setEmailStage('code_sent')
      setResendIn(45)
      toast.success('Code sent, check your inbox')
    } catch { toast.error('Network error, try again') }
    finally { setBusy('') }
  }, [form.email])

  const verifyCode = async () => {
    setBusy('verify')
    try {
      const { ok, data } = await postJson('/api/access_applications/verify_email', { email: form.email, code })
      if (!ok) { toast.error(data.error || 'Incorrect code'); return }
      setEmailToken(data.email_token)
      setEmailStage('verified')
      toast.success('Email verified')
    } catch { toast.error('Network error, try again') }
    finally { setBusy('') }
  }

  const canSubmit =
    emailStage === 'verified' && form.name.trim() && form.company_name.trim() &&
    form.country && form.phone_number.trim() && form.accepted_terms &&
    subCheck?.available !== false && subdomain.length >= 3

  const submit = async (e) => {
    e.preventDefault()
    if (!canSubmit) return
    setBusy('submit')
    try {
      const { ok, data } = await postJson('/api/access_applications', { ...form, email_token: emailToken })
      if (!ok) { toast.error(data.error || 'Could not submit application', { duration: 6000 }); return }
      setDone(data)
    } catch { toast.error('Network error, try again') }
    finally { setBusy('') }
  }

  return (
    <div className="min-h-screen bg-white px-4 py-10 font-sans text-black dark:bg-black dark:text-white">
      <Toaster position="top-center" />
      <div className="mx-auto w-full max-w-xl">
        <Link to="/" className="mb-8 inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
          <ArrowBackIcon style={{ width: 16, height: 16 }} /> Back to home
        </Link>

        <AnimatePresence mode="wait">
          {done ? (
            <motion.div key="done" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-black/10 p-8 text-center dark:border-white/10">
              <CheckCircleOutlineIcon style={{ width: 44, height: 44 }} />
              <h1 className="mt-4 text-2xl font-semibold">Application received</h1>
              <p className="mx-auto mt-3 max-w-sm text-sm text-gray-600 dark:text-gray-300">
                Thanks, {form.name.split(' ')[0]}. We review applications within one business day.
                Once approved, your login details will be emailed to <strong>{form.email}</strong>.
              </p>
              <p className="mt-4 font-mono text-sm text-gray-500 dark:text-gray-400">
                {done.subdomain}.{ROOT_DOMAIN}
              </p>
              <Link to="/" className={`${ghostBtnCls} mt-6`}>Back to home</Link>
            </motion.div>
          ) : (
            <motion.form key="form" onSubmit={submit} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-black/10 p-6 sm:p-8 dark:border-white/10">
              <p className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                ISP billing platform
              </p>
              <h1 className="mt-1 text-2xl font-semibold">Apply for access</h1>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                Tell us who you are. Applications are reviewed within one business day.
              </p>

              <div className="mt-7 space-y-5">
                <Field label="Your name">
                  <input required className={inputCls} value={form.name} onChange={set('name')} autoComplete="name" />
                </Field>

                <Field
                  label="ISP or company name"
                  hint={subdomain.length >= 3 ? (
                    <>
                      Your workspace: <span className="font-mono">{subdomain}.{ROOT_DOMAIN}</span>
                      {subCheck && <> · {subCheck.available ? 'available' : 'already taken, try another name'}</>}
                    </>
                  ) : 'Your name is used to create your workspace address.'}
                >
                  <input required className={inputCls} value={form.company_name} onChange={set('company_name')} />
                </Field>

                <Field label="Email address">
                  <div className="flex gap-2">
                    <input required type="email" className={inputCls} value={form.email}
                      onChange={onEmailChange} disabled={emailStage === 'verified'} autoComplete="email" />
                    {emailStage === 'idle' && (
                      <button type="button" className={ghostBtnCls} onClick={sendCode}
                        disabled={busy === 'send' || !form.email.includes('@')}>
                        {busy === 'send' ? 'Sending…' : 'Verify'}
                      </button>
                    )}
                    {emailStage === 'verified' && (
                      <button type="button" className={ghostBtnCls}
                        onClick={() => { setEmailStage('idle'); setEmailToken(''); setCode('') }}>
                        Change
                      </button>
                    )}
                  </div>
                  {emailStage === 'verified' && (
                    <span className="mt-1.5 block text-xs text-gray-500 dark:text-gray-400">Email verified ✓</span>
                  )}
                </Field>

                {emailStage === 'code_sent' && (
                  <Field label="6-digit code" hint={`We emailed a code to ${form.email}. It expires in 10 minutes.`}>
                    <div className="flex gap-2">
                      <input inputMode="numeric" maxLength={6} className={`${inputCls} font-mono tracking-[0.4em]`}
                        value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))} />
                      <button type="button" className={btnCls} onClick={verifyCode}
                        disabled={code.length !== 6 || busy === 'verify'}>
                        {busy === 'verify' ? 'Checking…' : 'Confirm'}
                      </button>
                    </div>
                    <button type="button" onClick={sendCode} disabled={resendIn > 0 || busy === 'send'}
                      className="mt-2 text-xs text-gray-500 underline disabled:no-underline dark:text-gray-400">
                      {resendIn > 0 ? `Resend in ${resendIn}s` : 'Resend code'}
                    </button>
                  </Field>
                )}

                <Field label="Country">
                  <select required className={inputCls} value={form.country} onChange={set('country')}>
                    <option value="" className="text-black">Select your country</option>
                    {COUNTRIES.map((c) => <option key={c} value={c} className="text-black">{c}</option>)}
                  </select>
                </Field>

                <Field label="Phone number">
                  <input required type="tel" className={inputCls} value={form.phone_number}
                    onChange={set('phone_number')} placeholder="07XX XXX XXX" autoComplete="tel" />
                </Field>

                <Field label="Support WhatsApp (optional)">
                  <input type="tel" className={inputCls} value={form.support_whatsapp} onChange={set('support_whatsapp')} />
                </Field>

                <Field label="Referral code (optional)"
                  hint="If an ISP or partner referred you, enter their code.">
                  <input className={inputCls} value={form.referral_code} onChange={set('referral_code')} />
                </Field>

                <label className="flex items-start gap-2.5 text-sm text-gray-600 dark:text-gray-300">
                  <input type="checkbox" className="mt-1" checked={form.accepted_terms}
                    onChange={(e) => setForm((f) => ({ ...f, accepted_terms: e.target.checked }))} />
                  <span>
                    By applying, you agree to our{' '}
                    <Link to="/terms-and-conditions" target="_blank" className="underline">Terms &amp; Conditions</Link>.
                  </span>
                </label>

                <button type="submit" className={`${btnCls} w-full`} disabled={!canSubmit || busy === 'submit'}>
                  {busy === 'submit' ? 'Submitting…' : 'Submit application'}
                </button>
                {emailStage !== 'verified' && (
                  <p className="text-center text-xs text-gray-500 dark:text-gray-400">
                    Verify your email to enable submission.
                  </p>
                )}
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}