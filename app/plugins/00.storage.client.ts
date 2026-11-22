// Load all saved progress from IndexedDB before the first screen renders.
export default defineNuxtPlugin(async () => {
  const { init } = useSettings()
  init()
  await initStorage()
  const { touchToday } = useRewards()
  touchToday()
  document.addEventListener('visibilitychange', () => { if (!document.hidden) touchToday() })
})
