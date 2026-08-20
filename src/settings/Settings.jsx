import {useState, useTransition, lazy, Suspense} from 'react'
const GeneralSettings = lazy(() => import('./GeneralSettings'))
const MpesaSettings = lazy(() => import('./MpesaSettings'))
import EmailSettings from './EmailSettings'
const SmsSettings = lazy(() => import('./SmsSettings'))
const SupportSettings = lazy(() => import('./SupportSettings'))
const RadiusSettings = lazy(() => import('./RadiusSettings'))
const LicenseSettings = lazy(() => import('./LicenseSettings'))
const TaskSettings = lazy(() => import('./TaskSettings'))
import {useApplicationSettings} from './ApplicationSettings'
const GoogleMapSetting = lazy(() => import('./GoogleMapSetting'))
const TumaSettings = lazy(() => import('./TumaSettings'))

const AppearanceSettings = lazy(() => import('./AppearanceSettings'))
import { Palette } from 'lucide-react'  
const PaymentGatewaySettings = lazy(() => import('./PaymentGatewaySettings'))





import {
  RefreshCw, Settings as SettingsIcon, MessageSquare, Award, CreditCard,
  Map, LifeBuoy, Mail, CheckSquare, Wallet, Bell, Zap
} from 'lucide-react'

const TABS = [
  { id: 'GENERAL',      label: 'General',      icon: SettingsIcon },
    { id: 'APPEARANCE', label: 'Appearance', icon: Palette },   

  { id: 'SMS',          label: 'SMS',           icon: MessageSquare },
  { id: 'LICENSE',      label: 'License',       icon: Award },
  { id: 'PAYMENT_GATEWAYS', label: 'Payment Gateways', icon: Wallet },

  // { id: 'MPESA',        label: 'M-Pesa',        icon: CreditCard },
  // { id: 'TUMA',         label: 'Tuma',          icon: Zap },

  // { id: 'MAP',          label: 'Map',           icon: Map },
  { id: 'SUPPORT',      label: 'Support',       icon: LifeBuoy },
  { id: 'EMAIL',        label: 'Email',         icon: Mail },
  // { id: 'TASK',         label: 'Task',          icon: CheckSquare },
  { id: 'PAYMENT',      label: 'Payment',       icon: Wallet, disabled: true },
  { id: 'NOTIFICATION', label: 'Notification',  icon: Bell, disabled: true },
]

const Settings = () => {
  const [selectedTab, setSelectedTab] = useState('GENERAL')
  const [isPending, startTransition] = useTransition()
  const {
    showMenu1, setShowMenu1, showMenu2, setShowMenu2, showMenu3, setShowMenu3,
    showMenu4, setShowMenu4, showMenu5, setShowMenu5, showMenu6, setShowMenu6,
    showMenu7, setShowMenu7, showMenu8, setShowMenu8, showMenu9, setShowMenu9,
    showMenu10, setShowMenu10, showMenu11, setShowMenu11, showMenu12, setShowMenu12,
  } = useApplicationSettings()

  const closeAllMenus = () => {
    setShowMenu1(false); setShowMenu2(false); setShowMenu3(false); setShowMenu4(false)
    setShowMenu5(false); setShowMenu6(false); setShowMenu7(false); setShowMenu8(false)
    setShowMenu9(false); setShowMenu10(false); setShowMenu11(false); setShowMenu12(false)
  }

  const selectTab = (tab) => {
    startTransition(() => setSelectedTab(tab))
  }

  const activeLabel = TABS.find(t => t.id === selectedTab)?.label ?? ''

  return (
    <div className="w-full h-screen bg-slate-50 dark:bg-slate-950 flex flex-col lg:flex-row" onClick={closeAllMenus}>

      {/* Mobile / tablet top nav */}
      <nav className="lg:hidden sticky top-0 z-20 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-1 overflow-x-auto px-2 py-2 ">
          {TABS.map(({ id, label, icon: Icon, disabled }) => (
            <button
              key={id}
              type="button"
              disabled={disabled}
              onClick={() => !disabled && selectTab(id)}
              className={`flex items-center gap-1.5 whitespace-nowrap px-3 py-2 rounded-lg text-sm font-medium 
                transition-colors duration-200
                ${selectedTab === id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : disabled
                    ? 'text-slate-400 dark:text-slate-600 cursor-not-allowed'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-slate-800'
                }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>
      </nav>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 shrink-0 bg-white
       dark:bg-slate-900 border-r border-slate-200 
      dark:border-slate-800 p-4 gap-1 overflow-y-auto">
        <h2 className="text-xs font-semibold uppercase tracking-wider
         text-black dark:text-slate-200 px-3 mb-2 font-sans
">
          Settings
        </h2>
        {TABS.map(({ id, label, icon: Icon, disabled }) => (
          <button
            key={id}
            type="button"
            disabled={disabled}
            onClick={() => !disabled && selectTab(id)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium 
              transition-all duration-200 text-left font-sans

              ${selectedTab === id
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                : disabled
                  ? 'text-slate-400 dark:text-slate-600 cursor-not-allowed'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-slate-800 hover:translate-x-0.5'
              }`}
          >
            <Icon className="w-4.5 h-4.5" />
            {label}
            {disabled && (
              <span className="ml-auto text-[10px] uppercase tracking-wide text-slate-400 font-sans
 dark:text-slate-600">
                soon
              </span>
            )}
          </button>
        ))}
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden">
        <div className="sticky top-0 z-10 hidden lg:block bg-slate-50/80 dark:bg-slate-950/80 backdrop-blur border-b
         border-slate-200 dark:border-slate-800 px-6 py-4">
          <h1 className="text-lg font-semibold text-slate-800 dark:text-slate-100">{activeLabel}</h1>
        </div>

        <div className="p-4 sm:p-6 font-sans
">
          <div className={`bg-white dark:bg-slate-900 rounded-2xl
             border border-slate-200 dark:border-slate-800 s
             hadow-sm transition-opacity  font-sans
duration-200 ${isPending ? 'opacity-50' : 'opacity-100'}`}>
            <Suspense fallback={
              <div className="flex justify-center items-center p-16">
                <RefreshCw className="animate-spin text-blue-500 w-10 h-10" />
              </div>
            }>
              {selectedTab === 'GENERAL' && <GeneralSettings/>}
              {selectedTab === 'MPESA' && <MpesaSettings/>}
              {selectedTab === 'TUMA' && <TumaSettings/>}
              {selectedTab === 'EMAIL' && <EmailSettings/>}
              {selectedTab === 'LICENSE' && <LicenseSettings/>}
              {selectedTab === 'SMS' && <SmsSettings/>}
              {selectedTab === 'RADIUS' && <RadiusSettings/>}
              {selectedTab === 'SUPPORT' && <SupportSettings/>}
              {selectedTab === 'TASK' && <TaskSettings/>}
              {selectedTab === 'APPEARANCE' && <AppearanceSettings/>}
              {selectedTab === 'PAYMENT_GATEWAYS' && <PaymentGatewaySettings/>}
              {/* {selectedTab === 'MAP' && <GoogleMapSetting/>} */}
            </Suspense>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Settings