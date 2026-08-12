import { useNavigate, useLocation } from 'react-router-dom'
import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from "framer-motion"
import { useApplicationSettings } from '../settings/ApplicationSettings'
import { IoArrowUndoSharp } from "react-icons/io5"
import { FaRegUser } from "react-icons/fa"
import { MdFingerprint } from "react-icons/md"
import toast, { Toaster } from 'react-hot-toast'
import { TextField, InputAdornment } from "@mui/material"
import { Email } from '@mui/icons-material'

const STAGE_LABELS = {
  idle: 'Continue with Passkey',
  requesting: 'Preparing request…',
  'awaiting-passkey': 'Waiting for your passkey…',
  verifying: 'Verifying…',
}

const PasskeySignin = () => {
  const {
    companySettings, setCompanySettings,
  } = useApplicationSettings()

  const navigate = useNavigate()
  const { search } = useLocation()
  const my_user_name = new URLSearchParams(search).get('my_user_name')

  const [webAuth, setWebAuth] = useState({ email: '', user_name: '', phone_number: '' })
  const { email, user_name } = webAuth

  // single source of truth for "what is happening right now"
  const [stage, setStage] = useState('idle') // idle | requesting | awaiting-passkey | verifying
  const isBusy = stage !== 'idle'

  const [uierror, setUiError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const subdomain = window.location.hostname.split('.')[0]
  const { company_name, logo_preview } = companySettings

  const handleChange = (e) => {
    const { name, value } = e.target
    setWebAuth((prev) => ({ ...prev, [name]: value }))
  }

  const handleGoBack = (e) => {
    e.preventDefault()
    navigate(-1)
  }

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
      // ignore — non-critical branding fetch
    }
  }, [setCompanySettings, subdomain])

  useEffect(() => {
    handleGetCompanySettings()
  }, [handleGetCompanySettings])

  const fail = (message) => {
    setUiError(true)
    setErrorMessage(message)
    setStage('idle')
    toast.error(message || 'Something went wrong', {
      duration: 6000,
      position: 'top-center',
    })
  }

  async function authenticateWebAuthn(e) {
    e.preventDefault()
    setUiError(false)
    setErrorMessage('')
    setStage('requesting')

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 12000)

    try {
      const response = await fetch('/api/webauthn/authenticate', {
        method: 'POST',
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          'X-Subdomain': subdomain,
          'X-Domain': window.location.hostname,
        },
        body: JSON.stringify({ my_user_name, email, user_name }),
      })
      clearTimeout(timeoutId)

      if (response.status === 402) {
        setTimeout(() => navigate('/license-expired'), 1800)
        return
      }
      if (response.status === 423) {
        setTimeout(() => navigate('/account-locked'), 1800)
        return
      }

      const options = await response.json()
      if (!response.ok) {
        fail(options.error || 'Could not start passkey sign-in')
        return
      }

      const challenge = options.challenge
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

      const verifyResponse = await fetch('/api/webauthn/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Subdomain': subdomain,
          'X-Domain': window.location.hostname,
        },
        body: JSON.stringify({ credential: credentialJson, my_user_name, email, user_name }),
      })
      const verifyData = await verifyResponse.json()

      if (verifyResponse.status === 402) {
        setTimeout(() => navigate('/license-expired'), 1800)
        return
      }

      if (verifyResponse.ok) {
        setStage('idle')
        navigate('/admin/analytics')
      } else {
        fail(verifyData.error || 'Verification failed')
      }
    } catch (err) {
      fail(err.message || 'Something went wrong')
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { when: 'beforeChildren', staggerChildren: 0.2 } },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', damping: 15, stiffness: 100 } },
  }

  return (
    <>
      <Toaster position="top-center" />

      <motion.section
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="min-h-screen flex items-center justify-center relative overflow-hidden font-sans"
      >
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

        <div className="flex flex-col items-center justify-center min-h-screen px-4 relative z-10">
          <motion.div
            variants={itemVariants}
            className="w-full max-w-sm bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/15"
          >
            <div className="text-center mb-6">
              <img
                className="w-20 h-20 mx-auto rounded-full ring-2 ring-white/20 object-cover"
                src={logo_preview || "/images/aitechs.png"}
                alt={company_name || "Aitechs"}
                onError={(e) => { e.target.src = "/images/aitechs.png" }}
              />
              <h2 className="text-xl font-semibold text-white mt-4 font-sans">
                Sign in with Passkey
              </h2>
              <p className="text-sm text-white/60 mt-1 font-sans">
                Use your fingerprint, face, or device PIN
              </p>
            </div>

            <form onSubmit={authenticateWebAuthn} className="space-y-5">
              <TextField
                fullWidth
                size="small"
                label="Username"
                name="user_name"
                className='myTextField'
                value={user_name}
                onChange={handleChange}
                variant="outlined"
                disabled={isBusy}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FaRegUser className="text-white/70" size={14} />
                    </InputAdornment>
                  ),
                }}
                sx={textFieldStyles}
              />

              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-white/15" />
                <span className="text-xs text-white/50 font-sans">OR</span>
                <div className="flex-1 h-px bg-white/15" />
              </div>

              <TextField
                fullWidth
                size="small"
                label="Email"
                type="email"
                name="email"
                className='myTextField'
                value={email}
                onChange={handleChange}
                variant="outlined"
                disabled={isBusy}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email sx={{ color: 'rgba(255,255,255,0.7)', fontSize: 18 }} />
                    </InputAdornment>
                  ),
                }}
                sx={textFieldStyles}
              />

              <div className="flex justify-center pt-1">
                <MdFingerprint className={`text-4xl ${isBusy ? 'text-blue-400 animate-pulse' : 'text-white/70'}`} />
              </div>

              <AnimatePresence>
                {uierror && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    onClick={() => setUiError(false)}
                    className="flex items-center gap-2 cursor-pointer p-3 text-sm text-red-100 rounded-lg bg-red-500/15 border border-red-400/30 font-sans"
                  >
                    <span className="font-medium">{errorMessage || 'Something went wrong'}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-3 pt-2">
                <motion.button
                  whileTap={{ scale: isBusy ? 1 : 0.98 }}
                  type="submit"
                  disabled={isBusy}
                  className="w-full py-3 px-4 rounded-xl font-medium font-sans text-white
                    bg-gradient-to-r from-blue-500 to-blue-600
                    shadow-lg shadow-blue-900/30
                    hover:from-blue-600 hover:to-blue-700
                    transition-all duration-200
                    disabled:opacity-80 disabled:cursor-not-allowed
                    flex items-center justify-center gap-2"
                >
                  {isBusy && (
                    <svg
                      className="animate-spin h-4 w-4 text-white"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle
                        className="opacity-25"
                        cx="12" cy="12" r="10"
                        stroke="currentColor" strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                  )}
                  <span>{STAGE_LABELS[stage]}</span>
                </motion.button>

                <motion.button
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={handleGoBack}
                  disabled={isBusy}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4
                    bg-white/10 text-white font-medium rounded-xl font-sans
                    hover:bg-white/15 transition-all duration-200
                    disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <IoArrowUndoSharp className="w-4 h-4" />
                  <span className="text-sm">Go Back</span>
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      </motion.section>
    </>
  )
}

const textFieldStyles = {
  '& .MuiInputBase-input': { color: 'white' },
  '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' },
  '& label.Mui-focused': { color: 'white' },
  '& .MuiOutlinedInput-root': {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: '10px',
    '& fieldset': { borderColor: 'rgba(255,255,255,0.25)' },
    '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.4)' },
    '&.Mui-focused fieldset': { borderColor: '#60a5fa', borderWidth: '2px' },
  },
}

export default PasskeySignin