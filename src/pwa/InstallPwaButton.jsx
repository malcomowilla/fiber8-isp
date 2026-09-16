import { useState } from 'react'
import InstallMobileRoundedIcon from '@mui/icons-material/InstallMobileRounded'
import IosShareRoundedIcon from '@mui/icons-material/IosShareRounded'
import usePwaInstall from './usePwaInstall'
import IosInstallSheet from './IosInstallSheet'

export default function InstallPwaButton({ label = 'Install app', compact = false }) {
  const { canInstall, isIos, installed, install } = usePwaInstall()
  const [sheetOpen, setSheetOpen] = useState(false)
  const [busy, setBusy] = useState(false)

  if (installed) return null
  if (!canInstall && !isIos) return null

  const handleClick = async () => {
    if (isIos && !canInstall) {
      setSheetOpen(true)
      return
    }

    setBusy(true)
    await install()
    setBusy(false)
  }

  const Icon = isIos && !canInstall ? IosShareRoundedIcon : InstallMobileRoundedIcon

  if (compact) {
    return (
      <>
        <button
          type="button"
          onClick={handleClick}
          disabled={busy}
          aria-label={label}
          title={label}
          className="font-sans inline-flex h-9 w-9 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-700 transition hover:bg-neutral-100 active:scale-95 disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
        >
          <Icon sx={{ fontSize: 18 }} />
        </button>
        <IosInstallSheet open={sheetOpen} onClose={() => setSheetOpen(false)} />
      </>
    )
  }

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        disabled={busy}
        className="font-sans group inline-flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-800 shadow-sm transition hover:border-neutral-300 hover:bg-neutral-50 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:hover:bg-neutral-800"
      >
        <Icon
          sx={{ fontSize: 18 }}
          className="transition-transform group-hover:translate-y-0.5"
        />
        <span>{busy ? 'Opening…' : label}</span>
      </button>
      <IosInstallSheet open={sheetOpen} onClose={() => setSheetOpen(false)} />
    </>
  )
}