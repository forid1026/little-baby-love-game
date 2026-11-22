<script setup lang="ts">
const ready = useStorageReady()
const game = useModule('game')
const { evaluate } = useAchievements()
const install = useInstall()

const minSplash = ref(true)
const showSplash = computed(() => !ready.value || minSplash.value)

onMounted(() => {
  setTimeout(() => { minSplash.value = false }, 1400)
})


// Achievements are checked whenever progress changes (debounced).
let t: ReturnType<typeof setTimeout> | undefined
const modules = ['game', 'room', 'dress', 'mommy', 'daddy', 'care'] as const
watch(() => ready.value && modules.map(m => JSON.stringify(useModule(m).value)).join('|').length, () => {
  clearTimeout(t)
  t = setTimeout(evaluate, 400)
})
</script>

<template>
  <div>
    <NuxtLayout v-if="ready">
      <NuxtPage />
    </NuxtLayout>
    <SurpriseHost v-if="ready && game.welcomed && !showSplash" />
    <RewardModal />
    <ToastHost />
    <AppSplash :show="showSplash" />
  </div>
</template>
