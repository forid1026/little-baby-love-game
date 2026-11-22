<script setup lang="ts">
// Soft hearts floating up. Disabled automatically when animations are off.
withDefaults(defineProps<{ count?: number; emoji?: string }>(), { count: 14, emoji: '❤' })
const { motionOff } = useSettings()
const items = Array.from({ length: 24 }, (_, i) => ({
  left: 4 + ((i * 37) % 92), delay: (i * 0.23) % 2.6, dur: 3.2 + ((i * 7) % 20) / 10, size: 14 + ((i * 11) % 22),
  color: ['#E27AA3', '#F4BFD3', '#FFB3C6', '#CDBBFA', '#F6C453'][i % 5]!,
}))
</script>

<template>
  <div v-if="!motionOff" class="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
    <span v-for="(h, i) in items.slice(0, count)" :key="i" class="absolute"
      :style="{ left: h.left + '%', bottom: '-20px', fontSize: h.size + 'px', color: h.color, animation: `rise ${h.dur}s ${h.delay}s ease-out infinite` }">{{ emoji }}</span>
  </div>
</template>
