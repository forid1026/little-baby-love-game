import { Capacitor } from '@capacitor/core'

// Android integration: status bar, native splash, hardware back button, lifecycle.
export default defineNuxtPlugin(() => {
  const router = useRouter()
  const { syncMusic } = useSound()

  // Music (if the user turned it on) may only start after a real tap – never automatically.
  const unlockAudio = () => { syncMusic() }
  window.addEventListener('pointerdown', unlockAudio, { once: true })
  document.addEventListener('visibilitychange', () => syncMusic())

  if (!Capacitor.isNativePlatform()) return

  void (async () => {
    try {
      const { StatusBar, Style } = await import('@capacitor/status-bar')
      await StatusBar.setStyle({ style: Style.Light })
      await StatusBar.setBackgroundColor({ color: '#F8DDE8' })
      await StatusBar.setOverlaysWebView({ overlay: false })
    } catch { /* status bar is cosmetic */ }

    const { App } = await import('@capacitor/app')
    // Back: close dialogs/pause first, then go back, and from a main tab minimise the app.
    await App.addListener('backButton', () => {
      if (runBack()) return
      const root = ['/', '/games', '/baby', '/memories', '/settings']
      if (root.includes(router.currentRoute.value.path)) {
        if (router.currentRoute.value.path !== '/') void router.push('/')
        else void App.minimizeApp()
      } else {
        router.back()
      }
    })
    await App.addListener('appStateChange', ({ isActive }) => {
      if (isActive) syncMusic()
      else useSound().stopMusic()
    })

    try {
      const { SplashScreen } = await import('@capacitor/splash-screen')
      await SplashScreen.hide()
    } catch { /* ignore */ }
  })()
})
