import { useNavigate, Link } from 'react-router-dom'
import { useContext, useState, useRef, useEffect } from 'react'
import { ApplicationContext } from '../context/ApplicationContext'
import { useApplicationSettings } from '../settings/ApplicationSettings'
import toast, { Toaster } from 'react-hot-toast'
import { AnimatePresence, motion } from 'framer-motion'
import { 
  LogOut, 
  Settings, 
  User, 
  Lock, 
  Key,
  HelpCircle,
  ChevronDown,
  AlertTriangle
} from 'lucide-react'

const subdomain = window.location.hostname.split('.')[0]

export function Profile() {
  const navigate = useNavigate()
  const { setCurrentUser } = useContext(ApplicationContext)
  const [isOpen, setIsOpen] = useState(false)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)
  const dropdownRef = useRef(null)

  const handleLogout = async () => {
    setLoggingOut(true)
    try {
      const response = await fetch('/api/logout', {
        method: "DELETE",
        credentials: 'include',
        headers: {
          'X-Subdomain': subdomain,
        },
      })

      const newData = await response.json()

      if (response.status === 401) {
        toast.error(newData.error, {
          position: "top-center",
          duration: 4000,
        })
        setTimeout(() => {
          window.location.href = '/signin'
        }, 1900)
        return
      }

      if (response.ok) {
        setCurrentUser(null)
        navigate('/signin')
      } else if (response.status === 402) {
        setTimeout(() => {
          navigate('/license-expired')
        }, 1800)
      }
    } catch (error) {
      console.error('Error logging out:', error)
      toast.error('Logout failed', {
        position: "top-center",
        duration: 4000,
      })
    } finally {
      setLoggingOut(false)
      setShowLogoutConfirm(false)
    }
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const menuItems = [
    { icon: User, label: 'Profile', to: '/admin/profile', shortcut: '⇧⌘P' },
    { icon: Lock, label: '2FA Setup', to: '/admin/google-authenticator', shortcut: '⇧⌘SA' },
    { icon: Key, label: 'PassKeys', to: '/admin/passkeys', shortcut: '⇧⌘PK' },
    { icon: Settings, label: 'Settings', to: '/admin/settings', shortcut: '⌘S' },
    { icon: HelpCircle, label: 'Support', href: 'https://wa.me/254791568852', shortcut: '⌘CS', isExternal: true },
  ]

  return (
    <>
      <Toaster />
      <div ref={dropdownRef} className="relative">
        {/* Trigger Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 flex items-center gap-2"
          aria-label="Open profile menu"
        >
          <ion-icon name="people-outline" size="large"></ion-icon>
          <ChevronDown 
            size={16} 
            className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
          />
        </button>

        {/* Dropdown Menu — fixed on mobile so it can't be clipped, absolute on larger screens */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.15 }}
              className="fixed top-16 left-4 right-4
                sm:absolute sm:top-auto sm:left-auto sm:right-0 sm:mt-2 sm:w-72
                bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700
                overflow-hidden z-50"
            >
              {/* Header */}
              <div className="px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 border-b border-gray-200 dark:border-gray-700">
                <p className="text-sm font-semibold text-gray-900 dark:text-white font-sans">My Account</p>
              </div>

              {/* Menu Items */}
              <div className="py-2">
                {menuItems.map((item, index) => {
                  const IconComponent = item.icon
                  if (item.isExternal) {
                    return (
                      <a
                        key={index}
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => setIsOpen(false)}
                        className="px-4 py-3 flex items-center justify-between hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150 group cursor-pointer font-sans"
                      >
                        <div className="flex items-center gap-3">
                          <IconComponent size={18} className="text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
                          <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">{item.label}</span>
                        </div>
                        <span className="text-xs text-gray-400 dark:text-gray-500">{item.shortcut}</span>
                      </a>
                    )
                  }
                  return (
                    <Link
                      key={index}
                      to={item.to}
                      onClick={() => setIsOpen(false)}
                      className="px-4 py-3 flex items-center justify-between hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150 group font-sans"
                    >
                      <div className="flex items-center gap-3">
                        <IconComponent size={18} className="text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
                        <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">{item.label}</span>
                      </div>
                      <span className="text-xs text-gray-400 dark:text-gray-500">{item.shortcut}</span>
                    </Link>
                  )
                })}
              </div>

              <div className="h-px bg-gray-200 dark:bg-gray-700" />

              {/* Logout — opens confirm step instead of logging out directly */}
              <button
                onClick={() => {
                  setIsOpen(false)
                  setShowLogoutConfirm(true)
                }}
                className="w-full px-4 py-3 flex items-center justify-between hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-150 group font-sans"
              >
                <div className="flex items-center gap-3">
                  <LogOut size={18} className="text-gray-600 dark:text-gray-400 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors" />
                  <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors font-medium">Log out</span>
                </div>
                <span className="text-xs text-gray-400 dark:text-gray-500">⇧⌘Q</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Logout confirmation modal */}
      <AnimatePresence>
        {showLogoutConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
            onClick={() => !loggingOut && setShowLogoutConfirm(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 border border-gray-200 dark:border-gray-700 font-sans"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center shrink-0">
                  <AlertTriangle size={20} className="text-red-600 dark:text-red-400" />
                </div>
                <h3 className="text-base font-semibold text-gray-900 dark:text-white">Log out?</h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                You'll need to sign in again to access the dashboard.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  disabled={loggingOut}
                  className="flex-1 py-2.5 px-4 rounded-lg text-sm font-medium
                    text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700
                    hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors
                    disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogout}
                  disabled={loggingOut}
                  className="flex-1 py-2.5 px-4 rounded-lg text-sm font-medium text-white
                    bg-red-600 hover:bg-red-700 transition-colors
                    disabled:opacity-70 disabled:cursor-not-allowed
                    flex items-center justify-center gap-2"
                >
                  {loggingOut && (
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                  )}
                  {loggingOut ? 'Logging out…' : 'Log out'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default Profile