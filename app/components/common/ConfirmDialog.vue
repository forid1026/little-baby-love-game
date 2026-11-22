<script setup lang="ts">
withDefaults(defineProps<{
  open: boolean; title: string; message?: string; confirmLabel?: string; cancelLabel?: string; danger?: boolean
}>(), { confirmLabel: 'Yes', cancelLabel: 'Cancel' })
const emit = defineEmits<{ confirm: []; cancel: [] }>()
</script>

<template>
  <ModalSheet :open="open" :title="title" @close="emit('cancel')">
    <p v-if="message" class="muted mb-4" style="line-height: 1.45">{{ message }}</p>
    <slot />
    <div class="flex gap-3 mt-2">
      <button class="btn btn-soft flex-1" @click="emit('cancel')">{{ cancelLabel }}</button>
      <button class="btn flex-1" :class="danger ? 'btn-danger' : 'btn-primary'" @click="emit('confirm')">{{ confirmLabel }}</button>
    </div>
  </ModalSheet>
</template>
