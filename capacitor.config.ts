import type { CapacitorConfig } from '@capacitor/cli'

// The Android app loads the bundled Nuxt static output (no remote `server.url`).
const config: CapacitorConfig = {
  appId: 'com.littlebabylove.app',
  appName: 'Little Baby Love',
  webDir: '.output/public',
  backgroundColor: '#FFF8EF',
  android: { allowMixedContent: false },
  plugins: {
    SplashScreen: {
      launchShowDuration: 1200,
      launchAutoHide: true,
      backgroundColor: '#FFF8EF',
      androidScaleType: 'CENTER_INSIDE',
      showSpinner: false,
    },
    StatusBar: { style: 'LIGHT', backgroundColor: '#F8DDE8', overlaysWebView: false },
  },
}

export default config
