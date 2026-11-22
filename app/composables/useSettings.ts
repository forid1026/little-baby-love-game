import type { Settings } from '~/types'
import { defaultSettings } from '~/utils/defaults'

const KEY = 'lbl:settings'

/** Small preferences live in localStorage (read synchronously so the theme never flashes). */
export function useSettings() {
  const settings = useState<Settings>('settings', () => {
    try {
      const raw = localStorage.getItem(KEY)
      return { ...defaultSettings(), ...(raw ? JSON.parse(raw) : {}) }
    } catch {
      return defaultSettings()
    }
  })
  const reducedMotionQuery = useState<boolean>('prefers-reduced', () => false)

  const motionOff = computed(() => settings.value.motion === 'off' || (settings.value.motion === 'auto' && reducedMotionQuery.value))

  function apply() {
    if (!import.meta.client) return
    const root = document.documentElement
    root.dataset.theme = settings.value.theme
    root.dataset.motion = motionOff.value ? 'off' : 'on'
  }

  function init() {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    reducedMotionQuery.value = mq.matches
    mq.addEventListener?.('change', (e) => { reducedMotionQuery.value = e.matches })
    watch([settings, motionOff], () => {
      try { localStorage.setItem(KEY, JSON.stringify(settings.value)) } catch { /* ignore */ }
      apply()
    }, { deep: true, immediate: true })
  }

  return { settings, motionOff, init, apply }
}
