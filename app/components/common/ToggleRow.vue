<script setup lang="ts">
defineProps<{ label: string; desc?: string; modelValue: boolean }>()
defineEmits<{ 'update:modelValue': [v: boolean] }>()
</script>

<template>
  <button class="flex w-full items-center gap-3 rounded-2xl border-0 bg-transparent p-2 text-left" role="switch" :aria-checked="modelValue" style="min-height: 56px" @click="$emit('update:modelValue', !modelValue)">
    <span class="flex-1 min-w-0"><span class="block font-extrabold">{{ label }}</span><span v-if="desc" class="block muted text-xs">{{ desc }}</span></span>
    <span class="relative h-8 w-14 shrink-0 rounded-full transition-colors" :style="{ background: modelValue ? 'var(--accent)' : '#E2D6DC' }">
      <span class="absolute top-1 h-6 w-6 rounded-full bg-white shadow transition-all" :style="{ left: modelValue ? '30px' : '4px' }" />
    </span>
  </button>
</template>
