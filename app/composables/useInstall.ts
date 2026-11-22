import { Capacitor } from '@capacitor/core'

interface BIPEvent extends Event { prompt: () => Promise<void>; userChoice: Promise<{ outcome: string }> }
let deferred: BIPEvent | null = null

export function useInstall() {
  const canInstall = useState('can-install', () => false)
  const installed = useState('is-installed', () => false)
  const offlineReady = useState('offline-ready', () => false)
  const isNative = useState('is-native', () => false)

  async function checkOffline() {
    if (isNative.value) { offlineReady.value = true; return }
    try {
      const reg = await navigator.serviceWorker?.getRegistration()
      const keys = await caches?.keys?.()
      offlineReady.value = !!reg?.active && !!keys?.some(k => k.includes('precache'))
    } catch { offlineReady.value = false }
  }

  function init() {
    isNative.value = Capacitor.isNativePlatform()
    installed.value = window.matchMedia('(display-mode: standalone)').matches || isNative.value
    window.addEventListener('beforeinstallprompt', (e) => { e.preventDefault(); deferred = e as BIPEvent; canInstall.value = true })
    window.addEventListener('appinstalled', () => { installed.value = true; canInstall.value = false })
    void checkOffline()
    navigator.serviceWorker?.addEventListener?.('controllerchange', () => void checkOffline())
    setTimeout(checkOffline, 4000)
  }

  async function install() {
    if (!deferred) return
    await deferred.prompt()
    await deferred.userChoice
    deferred = null
    canInstall.value = false
  }

  return { canInstall, installed, offlineReady, isNative, init, install, checkOffline }
}
