<script setup lang="ts">
defineProps<{ title: string; subtitle?: string; back?: boolean }>()
const goBack = useGoBack('/')
</script>

<template>
  <header class="flex items-center gap-3 mb-4">
    <button v-if="back" class="icon-btn shrink-0" aria-label="Back" @click="goBack"><Icon name="back" /></button>
    <div class="min-w-0 flex-1">
      <h1 class="h1 truncate">{{ title }}</h1>
      <p v-if="subtitle" class="muted text-sm">{{ subtitle }}</p>
    </div>
    <slot name="right"><CoinDisplay /></slot>
  </header>
</template>
