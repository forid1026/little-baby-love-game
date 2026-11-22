<script setup lang="ts">
defineProps<{ to: string; title: string; text: string; icon: string; bg: string; badge?: string }>()
const { play } = useSound()
</script>

<template>
  <NuxtLink :to="to" class="card relative flex items-center gap-4 p-4 no-underline fade-up" :style="{ background: bg, color: 'var(--color-ink)' }" @click="play('click')">
    <div class="flex h-16 w-16 shrink-0 items-center justify-center rounded-3xl bg-white text-4xl shadow" aria-hidden="true">{{ icon }}</div>
    <div class="min-w-0 flex-1">
      <h3 class="h2">{{ title }}</h3>
      <p class="text-sm font-semibold" style="opacity: .75; line-height: 1.3">{{ text }}</p>
    </div>
    <span v-if="badge" class="chip text-xs absolute top-2 right-3" style="min-height: 26px; padding: 2px 10px">{{ badge }}</span>
    <Icon name="play" :size="22" />
  </NuxtLink>
</template>
