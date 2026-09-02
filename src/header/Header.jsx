import { useContext, useState, useEffect, useCallback } from 'react'
import { ApplicationContext } from '../context/ApplicationContext'
import { Profile } from '../profile/Profile'
import { useApplicationSettings } from '../settings/ApplicationSettings'
import { Link } from 'react-router-dom'
import {
  ArrowLeft,
  ArrowRight,
  Copy,
  MessageSquare,
  AlertCircle,
  Moon,
  Sun,
  Info,
  Wallet
} from 'lucide-react'
import toast from 'react-hot-toast'

// Must match the platform-managed provider name used in SmsSettings.jsx
const PROVIDER_MODE_PLATFORM = 'Owitech Bulk SMS'

const Header = () => {
  const { handleThemeSwitch, seeSidebar, setSeeSideBar, setPreferDarkMode, preferDarkMode } = useContext(ApplicationContext)

  const {
    showMenu1, setShowMenu1, showMenu2, setShowMenu2, showMenu3, setShowMenu3,
    showMenu4, setShowMenu4, showMenu5, setShowMenu5, showMenu6, setShowMenu6,
    showMenu7, setShowMenu7, showMenu8, setShowMenu8, showMenu9, setShowMenu9,
    showMenu10, setShowMenu10, showMenu11, setShowMenu11, showMenu12, setShowMenu12,
    providerSms, setProviderSms, smsBalance, setSmsBalance, setSelectedProvider
  } = useApplicationSettings()

  const [companyId, setCompanyId] = useState('')
  const [copiedId, setCopiedId] = useState(false)
  const [walletBalance, setWalletBalance] = useState(null)
  const [walletLoading, setWalletLoading] = useState(false)
  const subdomain = window.location.hostname.split('.')[0]

  const isOwitech = providerSms === PROVIDER_MODE_PLATFORM

  const getCompanyId = useCallback(async () => {
    try {
      const response = await fetch('/api/company_ids', {
        headers: { 'X-Subdomain': subdomain },
      })
      const newData = await response.json()
      if (response.ok) {
        setCompanyId(newData[0].company_id)
      }
    } catch (error) {
      console.error('Error fetching company ID:', error)
    }
  }, [subdomain])

  const handleGetSmsProviderSettings = useCallback(async () => {
    try {
      const response = await fetch(`/api/sms_provider_settings`, {
        headers: { 'Content-Type': 'application/json', 'X-Subdomain': subdomain },
      })
      const newData = await response.json()
      if (response.ok) {
        setProviderSms(newData[0].sms_provider)
      }
    } catch (error) {
      console.error('Error fetching SMS provider settings:', error)
    }
  }, [subdomain, setProviderSms])

  // Balance for bring-your-own-credentials providers (SMS Leopard, TextSMS, etc.)
  const getSmsBalance = useCallback(async () => {
    try {
      const response = await fetch(`/api/get_sms_balance?selected_provider=${providerSms}`, {
        headers: { 'X-Subdomain': subdomain },
      })
      const newData = await response.json()
      if (response.ok) {
        setSmsBalance(newData.message)
      }
    } catch (error) {
      console.error('Error fetching SMS balance:', error)
    }
  }, [providerSms, subdomain, setSmsBalance])

  // Balance for the platform-managed Owitech Bulk SMS wallet
  const getWalletBalance = useCallback(async () => {
    setWalletLoading(true)
    try {
      const response = await fetch('/api/tenant_sms_wallet/balance', {
        headers: { 'X-Subdomain': subdomain },
      })
      const newData = await response.json()
      if (response.ok) {
        setWalletBalance(newData.balance ?? newData.message ?? null)
      } else {
        console.error('Failed to fetch Owitech wallet balance')
      }
    } catch (error) {
      console.error('Error fetching Owitech wallet balance:', error)
    } finally {
      setWalletLoading(false)
    }
  }, [subdomain])

  const fetchSavedSmsSettings = useCallback(async () => {
    try {
      const response = await fetch(`/api/saved_sms_settings`, {
        headers: { 'Content-Type': 'application/json', 'X-Subdomain': subdomain },
      })
      const data = await response.json()
      const newData = data.length > 0
        ? data.reduce((latest, item) => new Date(item.sms_setting_updated_at) > new Date(latest.sms_setting_updated_at) ? item : latest, data[0])
        : null
      if (response.ok && newData) {
        setSelectedProvider(newData.sms_provider)
      }
    } catch (error) {
      console.error('Error fetching SMS settings:', error)
    }
  }, [subdomain, setSelectedProvider])

  useEffect(() => {
    getCompanyId()
    handleGetSmsProviderSettings()
    fetchSavedSmsSettings()
  }, [getCompanyId, handleGetSmsProviderSettings, fetchSavedSmsSettings])

  // Route to the correct balance source depending on active provider
  useEffect(() => {
    if (!providerSms) return
    if (isOwitech) {
      getWalletBalance()
    } else {
      getSmsBalance()
    }
  }, [providerSms, isOwitech, getWalletBalance, getSmsBalance])

  const handleCopyId = () => {
    navigator.clipboard.writeText(companyId || 'FFETE')
    setCopiedId(true)
    toast.success('Company ID copied!', { duration: 2000 })
    setTimeout(() => setCopiedId(false), 2000)
  }

  const closeAllMenus = () => {
    setShowMenu1(false); setShowMenu2(false); setShowMenu3(false);
    setShowMenu4(false); setShowMenu5(false); setShowMenu6(false);
    setShowMenu7(false); setShowMenu8(false); setShowMenu9(false);
    setShowMenu10(false); setShowMenu11(false); setShowMenu12(false);
  }

  return (
    <div
      className="w-full px-4 sm:px-10 py-4 sm:py-5 font-sans"
      onClick={closeAllMenus}
    >
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">

        {/* Left Section: Toggle & Company ID */}
        <div className="flex items-center gap-4 w-full sm:w-auto">
          {/* Sidebar Toggle */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              setSeeSideBar(!seeSidebar)
            }}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300"
            aria-label="Toggle sidebar"
          >
            {seeSidebar ? (
              <ArrowRight size={24} />
            ) : (
              <ArrowLeft size={24} />
            )}
          </button>

          {/* Company ID Card */}
          <div className="flex items-center gap-3 bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-750 rounded-lg px-4 py-3 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow w-full sm:w-auto">
            <div className="flex items-center gap-3 flex-1">
              <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <span className="text-lg">🆔</span>
              </div>
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">Company ID</p>
                <p className="font-mono font-semibold text-gray-900 dark:text-white text-sm">{companyId || 'FFETE'}</p>
              </div>
            </div>
            <button
              onClick={handleCopyId}
              className={`p-2 rounded-lg transition-all duration-300 ${
                copiedId
                  ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                  : 'hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
              title="Copy Company ID"
            >
              <Copy size={18} />
            </button>
          </div>
        </div>

        {/* Right Section: SMS, Theme, Profile */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">

          {/* SMS Status */}
          <div className="w-full sm:w-auto">
            {providerSms ? (
              isOwitech ? (
                // Owitech Bulk SMS — platform-managed wallet balance
                <div className="flex items-center gap-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg px-4 py-3 border border-blue-200 dark:border-blue-800/50 shadow-sm">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
                    <Wallet size={18} className="text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-medium text-gray-600 dark:text-gray-300">Owitech SMS Wallet</p>
                    <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                      {walletLoading
                        ? 'Loading…'
                        : walletBalance !== null
                          ? walletBalance
                          : 'Not loaded'}
                    </p>
                  </div>
                </div>
              ) : (
                // Bring-your-own-credentials provider — provider account balance
                <div className="flex items-center gap-3 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg px-4 py-3 border border-green-200 dark:border-green-800/50 shadow-sm">
                  <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/50 flex items-center justify-center">
                    <MessageSquare size={18} className="text-green-600 dark:text-green-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-medium text-gray-600 dark:text-gray-300">SMS Provider</p>
                    <p className="text-sm font-semibold text-green-600 dark:text-green-400">{providerSms}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">Balance: <span className="font-bold text-green-600 dark:text-green-400">{smsBalance}</span></p>
                  </div>
                </div>
              )
            ) : (
              <div className="flex items-start gap-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg px-4 py-3 border border-amber-200 dark:border-amber-800/50 shadow-sm w-full sm:w-auto">
                <AlertCircle size={18} className="text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-gray-900 dark:text-gray-100 mb-1">SMS not configured</p>
                  <p className="text-xs text-gray-700 dark:text-gray-300 mb-2 leading-relaxed">
                    Connect your SMS provider to send messages.
                  </p>
                  <Link
                    to="/admin/settings"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-600 dark:text-amber-400 bg-amber-100/50 dark:bg-amber-900/30 border border-amber-300 dark:border-amber-700 rounded-md px-2.5 py-1 hover:bg-amber-100 dark:hover:bg-amber-900/50 transition-colors"
                  >
                    ⚙️ SMS Settings
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Theme Toggle & Profile */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Theme Toggle */}
            <button
              onClick={handleThemeSwitch}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300"
              aria-label="Toggle theme"
            >
              {preferDarkMode ? (
                <Sun size={20} />
              ) : (
                <Moon size={20} />
              )}
            </button>

            {/* Profile Menu */}
            <div id="profile">
              <Profile />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Header