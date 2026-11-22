<script setup lang="ts">
defineProps<{ title: string; text?: string; icon?: string }>()
</script>

<template>
  <div class="card card-pad text-center py-8 fade-up">
    <div class="floaty text-5xl mb-2" aria-hidden="true">{{ icon ?? '🧸' }}</div>
    <p class="h2">{{ title }}</p>
    <p v-if="text" class="muted mt-1">{{ text }}</p>
    <div class="mt-4 flex justify-center"><slot /></div>
  </div>
</template>
