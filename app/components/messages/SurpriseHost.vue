<script setup lang="ts">
// Decides (once per app open) whether Mommy gets a surprise envelope from Daddy.
import type { DaddyMessage } from '~/types'

const daddy = useModule('daddy')
const api = useDaddyMessages()
const current = ref<DaddyMessage | null>(null)

onMounted(() => {
  setTimeout(() => {
    const m = api.pickSurprise()
    if (m) current.value = m
  }, 900)
})

function opened() { if (current.value) api.markSurpriseShown(current.value.id) }
</script>

<template>
  <SurpriseEnvelope v-if="current" :key="current.id" :message="current" :animated="daddy.surprise.animations" @opened="opened" @close="current = null" />
</template>
