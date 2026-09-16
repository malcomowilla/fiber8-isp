import { useCallback, useEffect, useState } from 'react'

const DISMISS_KEY = 'owitech:pwa-install-dismissed-at'
const DISMISS_TTL_MS = 1000 * 60 * 60 * 24 * 14 // 14 days

const readStandalone = () => {
  if (typeof window === 'undefined') return false
  return (
    window.matchMedia?.('(display-mode: standalone)').matches ||
    window.navigator.standalone === true ||
    document.referrer.startsWith('android-app://')
  )
}

const readIos = () => {
  if (typeof window === 'undefined') return false
  const ua = window.navigator.userAgent
  return (
    /iPad|iPhone|iPod/.test(ua) ||
    (window.navigator.platform === 'MacIntel' && window.navigator.maxTouchPoints > 1)
  )
}

const readDismissed = () => {
  try {
    const raw = window.localStorage.getItem(DISMISS_KEY)
    if (!raw) return false
    return Date.now() - Number(raw) < DISMISS_TTL_MS
  } catch {
    return false
  }
}

export default function usePwaInstall() {
  const [prompt, setPrompt] = useState(() => window.__owitechInstallPrompt || null)
  const [installed, setInstalled] = useState(readStandalone)
  const [dismissed, setDismissed] = useState(readDismissed)
  const [isIos] = useState(readIos)

  useEffect(() => {
    const onInstallable = () => setPrompt(window.__owitechInstallPrompt || null)
    const onInstalled = () => {
      setPrompt(null)
      setInstalled(true)
    }

    const onRawPrompt = (event) => {
      event.preventDefault()
      window.__owitechInstallPrompt = event
      setPrompt(event)
    }

    window.addEventListener('owitech:installable', onInstallable)
    window.addEventListener('owitech:installed', onInstalled)
    window.addEventListener('beforeinstallprompt', onRawPrompt)

    const media = window.matchMedia('(display-mode: standalone)')
    const onDisplayChange = (e) => setInstalled(e.matches)
    media.addEventListener?.('change', onDisplayChange)

    return () => {
      window.removeEventListener('owitech:installable', onInstallable)
      window.removeEventListener('owitech:installed', onInstalled)
      window.removeEventListener('beforeinstallprompt', onRawPrompt)
      media.removeEventListener?.('change', onDisplayChange)
    }
  }, [])

  const install = useCallback(async () => {
    if (!prompt) return 'unavailable'

    prompt.prompt()
    const { outcome } = await prompt.userChoice

    window.__owitechInstallPrompt = null
    setPrompt(null)

    if (outcome === 'accepted') setInstalled(true)
    return outcome
  }, [prompt])

  const dismiss = useCallback(() => {
    try {
      window.localStorage.setItem(DISMISS_KEY, String(Date.now()))
    } catch {
      /* private mode — dismiss for this session only */
    }
    setDismissed(true)
  }, [])

  const resetDismissal = useCallback(() => {
    try {
      window.localStorage.removeItem(DISMISS_KEY)
    } catch {
      /* noop */
    }
    setDismissed(false)
  }, [])

  return {
    canInstall: Boolean(prompt) && !installed,
    isIos: isIos && !installed,
    installed,
    dismissed,
    install,
    dismiss,
    resetDismissal,
  }
}