// First launch: send the user to the welcome screen once (runs after saved data has loaded).
export default defineNuxtRouteMiddleware((to) => {
  if (import.meta.server) return
  const game = useModule('game')
  if (useStorageReady().value && !game.value.welcomed && to.path !== '/welcome') return navigateTo('/welcome')
})
