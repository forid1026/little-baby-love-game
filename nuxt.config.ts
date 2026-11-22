import tailwindcss from '@tailwindcss/vite'

// One codebase: static SPA output (.output/public) powers the website, the PWA
// and the Capacitor Android WebView. Hash routing means no server rewrite rules
// are needed (Hostinger, Capacitor and the service worker all "just work").
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  ssr: false,
  devtools: { enabled: false },
  modules: ['@vite-pwa/nuxt'],
  components: [{ path: '~/components', pathPrefix: false }],
  css: ['~/assets/css/main.css'],
  vite: { plugins: [tailwindcss()] },
  router: { options: { hashMode: true } },
  typescript: { strict: true },
  experimental: { appManifest: false },
  app: {
    baseURL: '/',
    pageTransition: false,
    layoutTransition: false,
    head: {
      htmlAttrs: { lang: 'en' },
      title: 'Little Baby Love – Mommy\'s Happy World',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' },
        { name: 'description', content: 'A little world full of love. Cute offline baby games for Mommy.' },
        { name: 'theme-color', content: '#F4BFD3' },
        { name: 'mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-title', content: 'Baby Love' },
        { name: 'format-detection', content: 'telephone=no' },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'apple-touch-icon', href: '/icons/apple-touch-icon.png' },
      ],
    },
  },
  pwa: {
    registerType: 'autoUpdate',
    injectRegister: false, // registered by app/plugins/pwa.client.ts (skipped inside the native app)
    client: { installPrompt: false },
    manifest: {
      id: '/',
      name: 'Little Baby Love',
      short_name: 'Baby Love',
      description: "Mommy's Happy World – a little world full of love.",
      lang: 'en',
      start_url: '/',
      scope: '/',
      display: 'standalone',
      orientation: 'portrait',
      theme_color: '#F4BFD3',
      background_color: '#FFF8EF',
      categories: ['games', 'lifestyle'],
      icons: [
        { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
        { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
        { src: '/icons/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
      ],
    },
    workbox: {
      globPatterns: ['**/*.{js,css,html,png,svg,ico,woff2,webmanifest}'],
      navigateFallback: '/',
      cleanupOutdatedCaches: true,
    },
    devOptions: { enabled: false },
  },
})
