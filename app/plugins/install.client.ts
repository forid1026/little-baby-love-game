// Listen for Chrome's install prompt as early as possible (before the first screen mounts).
export default defineNuxtPlugin(() => { useInstall().init() })
