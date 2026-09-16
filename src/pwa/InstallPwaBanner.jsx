
import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import InstallMobileRoundedIcon from '@mui/icons-material/InstallMobileRounded'
import IosShareRoundedIcon from '@mui/icons-material/IosShareRounded'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import BoltRoundedIcon from '@mui/icons-material/BoltRounded'
import WifiOffRoundedIcon from '@mui/icons-material/WifiOffRounded'
import NotificationsActiveRoundedIcon from '@mui/icons-material/NotificationsActiveRounded'
import usePwaInstall from '../../hooks/usePwaInstall'
import IosInstallSheet from './IosInstallSheet'

const PERKS = [
  { icon: BoltRoundedIcon, label: 'Opens instantly' },
  { icon: WifiOffRoundedIcon, label: 'Works offline' },
  { icon: NotificationsActiveRoundedIcon, label: 'Payment alerts' },
]

export default function InstallPwaBanner({ delayMs = 4000 }) {
  const { canInstall, isIos, installed, dismissed, install, dismiss } = usePwaInstall()
  const [visible, setVisible] = useState(false)
  const [sheetOpen, setSheetOpen] = useState(false)
  const [busy, setBusy] = useState(false)

  const eligible = !installed && !dismissed && (canInstall || isIos)

  useEffect(() => {
    if (!eligible) {
      setVisible(false)
      return
    }

    const timer = setTimeout(() => setVisible(true), delayMs)
    return () => clearTimeout(timer)
  }, [eligible, delayMs])

  const handleInstall = async () => {
    if (isIos && !canInstall) {
      setSheetOpen(true)
      return
    }

    setBusy(true)
    const outcome = await install()
    setBusy(false)

    if (outcome === 'dismissed') dismiss()
    setVisible(false)
  }

  const handleDismiss = () => {
    dismiss()
    setVisible(false)
  }

  return (
    <>
      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ opacity: 0, y: 32, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 32, scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 360, damping: 30 }}
            role="dialog"
            aria-label="Install Owitech"
            className="font-sans fixed inset-x-3 bottom-3 z-[60] mx-auto max-w-md sm:inset-x-auto sm:bottom-6 sm:right-6"
            style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
          >
            <div className="relative overflow-hidden rounded-2xl border border-neutral-200 bg-white/95 p-4 shadow-xl backdrop-blur-md dark:border-neutral-800 dark:bg-neutral-900/95">
              <button
                type="button"
                onClick={handleDismiss}
                aria-label="Dismiss"
                className="absolute right-2 top-2 inline-flex h-7 w-7 items-center justify-center rounded-full text-neutral-400 transition hover:bg-neutral-100 hover:text-neutral-700 dark:hover:bg-neutral-800 dark:hover:text-neutral-200"
              >
                <CloseRoundedIcon sx={{ fontSize: 16 }} />
              </button>

              <div className="flex items-start gap-3 pr-6">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-neutral-200 bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800">
                  <img
                    src="/images/pwa-192x192.png"
                    alt=""
                    className="h-7 w-7 rounded-md object-contain"
                  />
                </div>

                <div className="min-w-0">
                  <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-50">
                    Install Owitech
                  </p>
                  <p className="mt-0.5 text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">
                    Add it to your home screen and run it like a native app — no
                    browser bar, no reloads.
                  </p>
                </div>
              </div>

              <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 pl-14">
                {PERKS.map(({ icon: Icon, label }) => (
                  <li
                    key={label}
                    className="flex items-center gap-1.5 text-[11px] text-neutral-500 dark:text-neutral-400"
                  >
                    <Icon sx={{ fontSize: 14 }} />
                    {label}
                  </li>
                ))}
              </ul>

              <div className="mt-4 flex items-center gap-2 pl-14">
                <button
                  type="button"
                  onClick={handleInstall}
                  disabled={busy}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-neutral-800 active:scale-[0.98] disabled:opacity-60 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-white"
                >
                  {isIos && !canInstall ? (
                    <IosShareRoundedIcon sx={{ fontSize: 17 }} />
                  ) : (
                    <InstallMobileRoundedIcon sx={{ fontSize: 17 }} />
                  )}
                  {busy
                    ? 'Installing…'
                    : isIos && !canInstall
                      ? 'How to install'
                      : 'Install'}
                </button>

                <button
                  type="button"
                  onClick={handleDismiss}
                  className="rounded-xl px-3 py-2 text-sm text-neutral-500 transition hover:bg-neutral-100 hover:text-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-100"
                >
                  Not now
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <IosInstallSheet open={sheetOpen} onClose={() => setSheetOpen(false)} />
    </>
  )
}