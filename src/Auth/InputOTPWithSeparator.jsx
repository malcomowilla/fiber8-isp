import { Link, useNavigate } from 'react-router-dom'
import { ApplicationContext } from '../context/ApplicationContext'
import { useApplicationSettings } from '../settings/ApplicationSettings'
import { useContext, useState, useEffect, useCallback } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'
import { MdOutlineCancel } from "react-icons/md"

const STAGE_LABELS = {
  idle: 'Access Network Dashboard',
  'signing-in': 'Authenticating…',
  'awaiting-passkey': 'Waiting for your passkey…',
  verifying: 'Verifying…',
}

function InputOTPWithSeparator() {
  const { setCurrentUser } = useContext(ApplicationContext)

  const {
    companySettings, setCompanySettings,
    adminSettings, setAdminSettings,
  } = useApplicationSettings()

  const navigate = useNavigate()

  const [isSeen, setIsSeen] = useState(false)
  const [isPassword, setPassword] = useState('')
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [loginError, setLoginError] = useState(false)
  const [uierror, setUiError] = useState(false)

  // single source of truth for what's happening right now
  const [stage, setStage] = useState('idle') // idle | signing-in | awaiting-passkey | verifying
  const isBusy = stage !== 'idle'

  const { company_name, logo_preview } = companySettings

  const {
    enable_2fa_google_auth,
    enable_2fa_for_admin_passkeys,
  } = adminSettings

  const formData = {
    email,
    password: isPassword,
  }

  const subdomain = window.location.hostname.split('.')[0]

  const handleGetCompanySettings = useCallback(async () => {
    try {
      const response = await fetch('/api/allow_get_company_settings', {
        headers: { 'X-Subdomain': subdomain },
      })
      const newData = await response.json()
      if (response.ok) {
        const {
          contact_info, company_name, email_info, logo_url,
          customer_support_phone_number, agent_email, customer_support_email,
        } = newData
        setCompanySettings((prev) => ({
          ...prev,
          contact_info, company_name, email_info,
          customer_support_phone_number, agent_email, customer_support_email,
          logo_preview: logo_url,
        }))
      }
    } catch {
      // non-critical branding fetch
    }
  }, [setCompanySettings, subdomain])

  useEffect(() => {
    handleGetCompanySettings()
  }, [handleGetCompanySettings])

  const getAdminSettings = useCallback(async () => {
    try {
      const customer_email = localStorage.getItem('customer_email')
      const response = await fetch(`/api/allow_get_admin_settings?admin_email=${customer_email}`, {
        headers: { 'X-Subdomain': subdomain },
      })
      const newData = await response.json()
      if (response.ok) {
        const {
          enable_2fa_for_admin_email, enable_2fa_for_admin_sms, send_password_via_sms,
          send_password_via_email, check_is_inactive,
          enable_2fa_for_admin_passkeys,
          enable_2fa_google_auth,
          checkinactiveminutes, checkinactivehrs, checkinactivedays,
        } = newData[0]
        setAdminSettings((prev) => ({
          ...prev,
          enable_2fa_for_admin_email, enable_2fa_for_admin_sms, send_password_via_sms,
          enable_2fa_for_admin_passkeys,
          enable_2fa_google_auth,
          send_password_via_email, check_is_inactive,
          checkinactiveminutes, checkinactivehrs, checkinactivedays,
        }))
      }
    } catch {
      // non-critical
    }
  }, [setAdminSettings, subdomain])

  useEffect(() => {
    getAdminSettings()
  }, [getAdminSettings])

  function arrayBufferToBase64Url(buffer) {
    const bytes = new Uint8Array(buffer)
    let binary = ''
    for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i])
    return btoa(binary).replace(/\//g, '_').replace(/\+/g, '-').replace(/=+$/, '')
  }

  function base64UrlToUint8Array(base64Url) {
    const padding = '='.repeat((4 - (base64Url.length % 4)) % 4)
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/') + padding
    const rawData = atob(base64)
    const outputArray = new Uint8Array(rawData.length)
    for (let i = 0; i < rawData.length; ++i) outputArray[i] = rawData.charCodeAt(i)
    return outputArray
  }

  const fail = (message) => {
    setUiError(true)
    setStage('idle')
    toast.error(message || 'Something went wrong', {
      duration: 5000,
      position: 'top-center',
    })
  }

  async function authenticateWebAuthn(email) {
    setStage('signing-in')

    try {
      const response = await fetch('/api/webauthn/authenticate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Subdomain': subdomain,
        },
        body: JSON.stringify({ email }),
      })

      const options = await response.json()
      const challenge = options.challenge

      if (!response.ok) {
        fail(options.error)
        return
      }

      const publicKey = {
        ...options,
        challenge: base64UrlToUint8Array(options.challenge),
        allowCredentials: options.allowCredentials.map((cred) => ({
          ...cred,
          id: base64UrlToUint8Array(cred.id),
        })),
      }

      setStage('awaiting-passkey')

      let credential
      try {
        credential = await navigator.credentials.get({ publicKey })
      } catch {
        fail('Passkey sign-in was cancelled or failed')
        return
      }

      setStage('verifying')

      const credentialJson = {
        id: credential.id,
        rawId: arrayBufferToBase64Url(credential.rawId),
        challenge,
        type: credential.type,
        response: {
          clientDataJSON: arrayBufferToBase64Url(credential.response.clientDataJSON),
          authenticatorData: arrayBufferToBase64Url(credential.response.authenticatorData),
          signature: arrayBufferToBase64Url(credential.response.signature),
          userHandle: arrayBufferToBase64Url(credential.response.userHandle),
        },
      }

      const createResponse = await fetch('/api/webauthn/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Subdomain': subdomain,
        },
        body: JSON.stringify({ credential: credentialJson, email }),
      })

      const newData = await createResponse.json()

      if (createResponse.ok) {
        setStage('idle')
        navigate('/admin/analytics')
      } else {
        fail(newData.error)
      }
    } catch (err) {
      fail(err.message)
    }
  }

  const handleSignIn = async (e) => {
    e.preventDefault()

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 9000)

    try {
      setUiError(false)
      setLoginError(false)
      setStage('signing-in')

      const users = await fetch('/api/sign_in', {
        method: 'POST',
        signal: controller.signal,
        headers: {
          'X-Subdomain': subdomain,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      clearTimeout(timeoutId)

      const actualUserDataInJson = await users.json()
      localStorage.setItem('customer_email', email)

      if (users.status === 423) {
        setTimeout(() => navigate('/account-locked'), 1800)
        return
      }

      if (users.status === 402) {
        setTimeout(() => navigate('/license-expired'), 1800)
        return
      }

      if (actualUserDataInJson.redirect) {
        window.location.href = actualUserDataInJson.redirect
        return
      }

      if (actualUserDataInJson.first_login) {
        window.location.href = "/change-password"
        return
      }

      if (users.ok || users.status === 202) {
        if (enable_2fa_for_admin_passkeys) {
          authenticateWebAuthn(email)
        } else if (enable_2fa_google_auth) {
          navigate('/two-factor-auth', { state: { email } })
        } else {
          navigate('/admin/analytics')
          setEmail('')
          setPassword('')
        }
        setStage('idle')
      } else {
        setError(actualUserDataInJson.error)
        setLoginError(true)
        setUiError(true)
        toast.error(actualUserDataInJson.error, {
          position: 'top-right',
          duration: 5000,
        })
        setCurrentUser([])
        setStage('idle')
      }
    } catch {
      toast.error('We couldn\u2019t complete your request, please try again', {
        position: 'top-right',
        duration: 5000,
      })
      setStage('idle')
    }
  }

  return (
    <>
      <Toaster />

      <main className="min-h-screen flex items-center font-sans justify-center relative overflow-hidden">
        {/* thin top progress bar while busy */}
        <AnimatePresence>
          {isBusy && (
            <motion.div
              key="progress"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed top-0 left-0 right-0 h-1 z-50 overflow-hidden bg-white/10"
            >
              <motion.div
                className="h-full bg-blue-400"
                initial={{ x: '-100%' }}
                animate={{ x: '100%' }}
                transition={{ repeat: Infinity, duration: 1.1, ease: 'linear' }}
                style={{ width: '40%' }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="absolute inset-0 z-0">
          <img
            src="/images/Telecommunications-Aitechs.jpg"
            alt="Network Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
        </div>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md p-6 z-10 font-sans"
        >
          <div className="text-center mb-8">
            <div className="flex justify-center mb-5">
              <svg className="w-14 h-14 text-white/90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                  d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-white text-2xl font-semibold font-sans">
              {company_name || 'Aitechs'}
            </p>
            <p className="text-white/60 mt-1 text-sm font-sans">Secure ISP Management Portal</p>
          </div>

          <AnimatePresence>
            {uierror && loginError && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                onClick={() => {
                  setUiError(false)
                  setLoginError(false)
                }}
                className="flex items-center justify-between gap-3 p-3 mb-4 text-sm text-red-100
                  cursor-pointer rounded-lg bg-red-500/15 border border-red-400/30 font-sans"
                role="alert"
              >
                <span className="font-medium">{error}</span>
                <MdOutlineCancel className="w-5 h-5 shrink-0" />
              </motion.div>
            )}
          </AnimatePresence>

          <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/15">
            <div className="text-center mb-6">
              <img
                className="w-20 h-20 mx-auto rounded-full ring-2 ring-white/20 object-cover"
                src={logo_preview || "/images/aitechs.png"}
                alt={company_name || "Aitechs"}
                onError={(e) => { e.target.src = "/images/aitechs.png" }}
              />
              <h2 className="mt-4 text-lg font-semibold text-white font-sans">
                Network Operations Center
              </h2>
            </div>

            <form onSubmit={handleSignIn} className="space-y-5">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isBusy}
                  className="block w-full pl-10 pr-3 py-3 bg-white/5 border border-white/20 rounded-lg
                    text-white placeholder-white/40 text-sm font-sans
                    focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent
                    disabled:opacity-60 transition-all"
                  placeholder="Network Admin Email"
                  required
                />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  type={isSeen ? "text" : "password"}
                  value={isPassword}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isBusy}
                  className="block w-full pl-10 pr-10 py-3 bg-white/5 border border-white/20 rounded-lg
                    text-white placeholder-white/40 text-sm font-sans
                    focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent
                    disabled:opacity-60 transition-all"
                  placeholder="Access Key"
                  required
                />
                <button
                  type="button"
                  onClick={() => setIsSeen(!isSeen)}
                  disabled={isBusy}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-white/50 hover:text-white/80 transition-colors"
                >
                  {isSeen ? (
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>

              <div className="flex items-center justify-end">
                <Link to="/reset-password" className="text-sm text-white/60 hover:text-white transition-colors font-sans">
                  Forgot Access Key?
                </Link>
              </div>

              <motion.button
                whileTap={{ scale: isBusy ? 1 : 0.98 }}
                type="submit"
                disabled={isBusy}
                className="w-full flex justify-center items-center gap-2 py-3 px-4 rounded-xl font-sans
                  text-sm font-medium text-white
                  bg-gradient-to-r from-blue-500 to-blue-600
                  shadow-lg shadow-blue-900/30
                  hover:from-blue-600 hover:to-blue-700
                  transition-all duration-200
                  disabled:opacity-80 disabled:cursor-not-allowed"
              >
                {isBusy && (
                  <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                )}
                {!isBusy && (
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                      d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                )}
                <span>{STAGE_LABELS[stage]}</span>
              </motion.button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-white/60 font-sans">
                <Link to='/passkey-signin' className="font-sans">
                  Need passwordless access?{' '}
                  <span className="font-semibold text-white">sign in with passkey</span>
                </Link>
              </p>
            </div>
          </div>
        </motion.section>
      </main>
    </>
  )
}

export default InputOTPWithSeparator