import { Capacitor } from '@capacitor/core'

// Register the service worker for the website/PWA. Inside the Android app the assets are
// bundled in the APK, so no service worker is needed (and we avoid stale-cache surprises).
export default defineNuxtPlugin(() => {
  if (Capacitor.isNativePlatform() || !('serviceWorker' in navigator) || import.meta.dev) return
  const register = () => navigator.serviceWorker.register('/sw.js', { scope: '/' }).catch(() => { /* offline support is optional */ })
  // The app mounts after async storage loading, so "load" may already have fired.
  if (document.readyState === 'complete') register()
  else window.addEventListener('load', register, { once: true })
})
