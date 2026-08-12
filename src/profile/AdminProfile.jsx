import { useApplicationSettings } from '../settings/ApplicationSettings'
import { useState, useEffect } from 'react'
import { createAvatar } from '@dicebear/core'
import { lorelei } from '@dicebear/collection'
import toast, { Toaster } from 'react-hot-toast'
import LoadingAnimation from '../loader/loading_animation.json'
import Lottie from 'react-lottie'
import { useNavigate } from 'react-router-dom'
import Backdrop from '@mui/material/Backdrop'
import { FiKey, FiShield, FiCheck } from 'react-icons/fi'
import { Tooltip } from '@mui/material'
import { useLocation } from 'react-router-dom'
import { LogOut, Mail, User, Phone, Lock, CheckCircle, AlertCircle } from 'lucide-react'

const AdminProfile = () => {
  const { currentUser, setCurrentUser, currentUsername, currentEmail, setOpenDropDown } = useApplicationSettings()
  const location = useLocation()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: '',
    phone_number: '',
  })
  const [loading, setLoading] = useState(false)
  const [openLoad, setOpenLoad] = useState(false)
  const [hasPasskey, setHasPasskey] = useState(false)
  const [isRegistering, setIsRegistering] = useState(false)
  const [registrationStatus, setRegistrationStatus] = useState('')

  const { email, password, username, phone_number } = formData
  const subdomain = window.location.hostname.split('.')[0]

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await fetch('/api/currently_logged_in_user', {
          headers: {
            'X-Subdomain': subdomain,
          },
        })
        const newData = await response.json()
        if (response.ok) {
          const { username, email, id, created_at, updated_at, phone_number } = newData
          setFormData({ ...formData, username, email, phone_number })
        }
      } catch (error) {
        toast.error('Failed to fetch profile', {
          duration: 7000,
          position: "top-center",
        })
      }
    }
    fetchCurrentUser()
  }, [])

  const handleChangeFormData = (e) => {
    const { type, name, checked, value } = e.target
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/logout', {
        method: "DELETE",
        credentials: 'include',
        headers: {
          'X-Subdomain': subdomain,
        },
      })
      if (response.ok) {
        setCurrentUser(null)
        navigate('/signin')
      } else {
        throw new Error('Logout failed')
      }
    } catch (error) {
      toast.error('Logout failed', {
        position: "top-center",
        duration: 4000,
      })
    }
  }

  const updateProfile = async (e) => {
    setOpenLoad(true)
    setLoading(true)
    e.preventDefault()
    const url = "/api/update_profile"
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        'X-Subdomain': subdomain,
      },
      credentials: 'include',
      body: JSON.stringify(formData),
    })

    try {
      if (response.ok) {
        setOpenLoad(false)
        setLoading(false)
        const newData = await response.json()
        const { username, email, phone_number } = newData
        setFormData({ ...formData, username, email, phone_number })
        toast.success("Profile updated successfully", {
          duration: 7000,
          position: "top-center",
        })
      } else {
        const newData = await response.json()
        setOpenLoad(false)
        setLoading(false)
        toast.error(newData.error || "Failed to update profile", {
          duration: 7000,
          position: "top-center",
        })
      }
    } catch (error) {
      setOpenLoad(false)
      setLoading(false)
      toast.error("Something went wrong. Please try again", {
        duration: 7000,
        position: "top-center",
      })
    }
  }

  function generateAvatar(name) {
    const avatar = createAvatar(lorelei, {
      seed: name,
      backgroundColor: ['b6e3f4', 'c0aede', 'd1d4f9'],
      radius: 50,
      size: 64,
    })
    return `data:image/svg+xml;utf8,${encodeURIComponent(avatar.toString())}`
  }

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: LoadingAnimation,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  }

  function arrayBufferToBase64Url(buffer) {
    const bytes = new Uint8Array(buffer)
    let binary = ''
    for (let i = 0; i < bytes.length; i++) {
      binary += String.fromCharCode(bytes[i])
    }
    return btoa(binary).replace(/\//g, '_').replace(/\+/g, '-').replace(/=+$/, '')
  }

  async function startPasskeyRegistration(e) {
    setIsRegistering(true)
    setRegistrationStatus('starting')
    e.preventDefault()

    const response = await fetch('/api/webauthn/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Subdomain': subdomain,
        'X-Domain': window.location.hostname
      },
      body: JSON.stringify({ email: currentEmail })
    })

    const options = await response.json()
    setRegistrationStatus('authenticating')
    const challenge = options.challenge

    try {
      if (!response.ok) {
        toast.error(options.error || "Registration failed", {
          position: "top-center",
          duration: 7000,
        })
        setRegistrationStatus('error')
        setTimeout(() => {
          setIsRegistering(false)
        }, 3000)
        return
      }

      function base64UrlToBase64(base64Url) {
        return base64Url.replace(/_/g, '/').replace(/-/g, '+')
      }

      if (typeof options.user.id === 'string') {
        options.user.id = Uint8Array.from(atob(base64UrlToBase64(options.user.id)), c => c.charCodeAt(0))
      }

      if (typeof options.challenge === 'string') {
        options.challenge = Uint8Array.from(atob(base64UrlToBase64(options.challenge)), c => c.charCodeAt(0))
      }

      const credential = await navigator.credentials.create({ publicKey: options })

      const credentialJson = {
        id: credential.id,
        rp: {
          name: "fiber8",
        },
        rawId: arrayBufferToBase64Url(credential.rawId),
        type: credential.type,
        response: {
          attestationObject: arrayBufferToBase64Url(credential.response.attestationObject),
          clientDataJSON: arrayBufferToBase64Url(credential.response.clientDataJSON)
        },
        challenge: challenge
      }

      const createResponse = await fetch('/api/webauthn/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Subdomain': subdomain,
          'X-Domain': window.location.hostname
        },
        body: JSON.stringify({ credential: credentialJson, email: currentEmail })
      })

      const createResponseJson = await createResponse.json()

      if (createResponse.ok) {
        toast.success('Passkey created successfully', {
          position: "top-center",
          duration: 7000,
        })
        setLoading(false)
        setHasPasskey(true)
        setTimeout(() => {
          setIsRegistering(false)
        }, 3000)
        setRegistrationStatus('success')
      } else {
        setLoading(false)
        toast.error(createResponseJson.error || "Failed to create passkey", {
          position: "top-center",
          duration: 7000,
        })
      }
    } catch (err) {
      setLoading(false)
      toast.error('Something went wrong. Please try again', {
        position: "top-center",
        duration: 7000,
      })
      setRegistrationStatus('error')
    } finally {
      setTimeout(() => {
        setIsRegistering(false)
      }, 3000)
    }
  }

  return (
    <>
      <Toaster />

      {loading && (
        <Backdrop open={openLoad} sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
          <Lottie className='relative z-50' options={defaultOptions} height={400} width={400} />
        </Backdrop>
      )}

      <div className="min-h-screen 
     py-8 px-4 font-sans">
        <div className="max-w-3xl mx-auto">
          
          {/* Header Section */}
          <div className="mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 dark:from-blue-900/20 dark:to-purple-900/20 px-6 py-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-4">
                  <img
                    className="w-16 h-16 rounded-full ring-4 ring-blue-500/20"
                    src={generateAvatar(currentUsername?.toString())}
                    alt={`${currentUsername?.toString()}'s avatar`}
                  />
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{currentUsername}</h1>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{currentEmail}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={updateProfile} className="space-y-6">
            
            {/* Account Section */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <Mail size={20} className="text-blue-600 dark:text-blue-400" />
                  Account
                </h2>
              </div>
              <div className="px-6 py-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3.5 text-gray-400 dark:text-gray-500" size={18} />
                  <input
                    name='email'
                    value={email}
                    onChange={handleChangeFormData}
                    type="email"
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:focus:ring-blue-400 transition"
                    placeholder={currentEmail}
                  />
                </div>
              </div>
            </div>

            {/* Personal Info Section */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <User size={20} className="text-green-600 dark:text-green-400" />
                  Personal Information
                </h2>
              </div>
              <div className="px-6 py-6 space-y-5">
                {/* Username */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-3.5 text-gray-400 dark:text-gray-500" size={18} />
                    <input
                      type="text"
                      name='username'
                      value={username}
                      onChange={handleChangeFormData}
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:focus:ring-blue-400 transition"
                      placeholder={currentUsername}
                    />
                  </div>
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3.5 text-gray-400 dark:text-gray-500" size={18} />
                    <input
                      type="tel"
                      name='phone_number'
                      value={phone_number}
                      onChange={handleChangeFormData}
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:focus:ring-blue-400 transition"
                      placeholder="Enter your phone number"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Security Section */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <Lock size={20} className="text-amber-600 dark:text-amber-400" />
                  Security
                </h2>
              </div>
              <div className="px-6 py-6 space-y-5">
                {/* Password Section */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Change Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3.5 text-gray-400 dark:text-gray-500" size={18} />
                    <input
                      type="password"
                      name='password'
                      value={password}
                      onChange={handleChangeFormData}
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:focus:ring-blue-400 transition"
                      placeholder="Enter new password (leave blank to keep current)"
                    />
                  </div>
                  <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">Leave blank to keep your current password</p>
                </div>
              </div>
            </div>

            {/* Passkey Section */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="px-6 py-4 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border-b border-emerald-200 dark:border-emerald-700/50">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <FiShield size={20} className="text-emerald-600 dark:text-emerald-400" />
                  Passkey & Biometric Authentication
                </h2>
              </div>
              <div className="px-6 py-6">
                <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-700/50 rounded-xl p-4 mb-4">
                  <div className="flex items-start gap-3 mb-4">
                    <div className={`p-2 rounded-lg ${hasPasskey ? 'bg-emerald-100 dark:bg-emerald-900/50' : 'bg-gray-100 dark:bg-gray-700'}`}>
                      <FiKey className={hasPasskey ? "text-emerald-600 dark:text-emerald-400" : "text-gray-400"} size={20} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                        Passkey Status
                        {hasPasskey && (
                          <span className="flex items-center gap-1 text-sm bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 px-2 py-1 rounded-full">
                            <FiCheck size={14} /> Registered
                          </span>
                        )}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {hasPasskey
                          ? 'Your account is secured with a passkey. Use it for quick and secure passwordless sign-in.'
                          : 'Add a passkey to enable passwordless authentication and enhance your account security.'}
                      </p>
                    </div>
                  </div>

                  <Tooltip title={
                    <span className="text-sm">
                      {hasPasskey
                        ? 'You already have a registered passkey'
                        : 'Register a new passkey for secure access'}
                    </span>
                  }>
                    <button
                      type="button"
                      onClick={startPasskeyRegistration}
                      disabled={hasPasskey || isRegistering}
                      className={`w-full px-4 py-2.5 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                        hasPasskey
                          ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                          : isRegistering
                          ? 'bg-emerald-500 dark:bg-emerald-600 text-white animate-pulse'
                          : 'bg-emerald-500 dark:bg-emerald-600 text-white hover:bg-emerald-600 dark:hover:bg-emerald-700 active:scale-95'
                      }`}
                    >
                      {isRegistering ? (
                        <>
                          <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
                          <span>
                            {registrationStatus === 'starting' && 'Initializing...'}
                            {registrationStatus === 'authenticating' && 'Verify on your device...'}
                            {registrationStatus === 'success' && 'Successfully registered!'}
                            {registrationStatus === 'error' && 'Registration failed'}
                            {!registrationStatus && 'Processing...'}
                          </span>
                        </>
                      ) : (
                        <>
                          <FiKey size={18} />
                          <span>{hasPasskey ? 'Passkey Registered' : 'Register Passkey'}</span>
                        </>
                      )}
                    </button>
                  </Tooltip>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700/50 rounded-lg p-3">
                  <p className="text-xs text-blue-800 dark:text-blue-300 flex items-start gap-2">
                    <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
                    <span>Passkeys use your device's biometrics (fingerprint/face) or PIN for authentication, making your account highly secure.</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pb-6">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-500 dark:to-blue-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
                    Updating...
                  </>
                ) : (
                  <>
                    <CheckCircle size={18} />
                    Save Changes
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleLogout}
                className="px-6 py-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 font-semibold rounded-lg border border-red-200 dark:border-red-700 hover:bg-red-100 dark:hover:bg-red-900/30 transition-all duration-200 flex items-center justify-center gap-2"
              >
                <LogOut size={18} />
                Log Out
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

export default AdminProfile