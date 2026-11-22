<script setup lang="ts">
// Header used on every game screen: back button, title, optional pause, coins.
defineProps<{ title: string; subtitle?: string; pausable?: boolean; paused?: boolean }>()
const emit = defineEmits<{ back: []; pause: [] }>()
</script>

<template>
  <header class="flex items-center gap-3 mb-3">
    <button class="icon-btn shrink-0" aria-label="Back" @click="emit('back')"><Icon name="back" /></button>
    <div class="min-w-0 flex-1">
      <h1 class="h2 truncate" style="line-height: 1.1">{{ title }}</h1>
      <p v-if="subtitle" class="muted text-xs truncate">{{ subtitle }}</p>
    </div>
    <button v-if="pausable" class="icon-btn shrink-0" :aria-label="paused ? 'Resume' : 'Pause'" @click="emit('pause')">
      <Icon :name="paused ? 'play' : 'pause'" />
    </button>
    <CoinDisplay :show-stars="false" class="shrink-0" />
  </header>
</template>
