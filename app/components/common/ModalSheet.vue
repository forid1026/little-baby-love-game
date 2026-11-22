<script setup lang="ts">
// Generic centered dialog. Registers with the back-button stack so Android back closes it.
const props = withDefaults(defineProps<{ open: boolean; title?: string; dismissible?: boolean; wide?: boolean }>(), { dismissible: true })
const emit = defineEmits<{ close: [] }>()

useBackHandler(() => props.open, () => {
  if (props.dismissible) emit('close')
  return true
})
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="open" class="fixed inset-0 z-[80] flex items-center justify-center p-4" style="background: rgba(96, 76, 89, 0.45)"
        role="dialog" aria-modal="true" :aria-label="title" @click.self="dismissible && emit('close')">
        <div class="sheet card w-full overflow-y-auto" :class="wide ? 'max-w-lg' : 'max-w-sm'" style="max-height: 88dvh; background: #FFFBF6">
          <div v-if="title || dismissible" class="flex items-center justify-between gap-2 px-5 pt-4">
            <h2 class="h2">{{ title }}</h2>
            <button v-if="dismissible" class="icon-btn" style="width: 40px; height: 40px" aria-label="Close" @click="emit('close')"><Icon name="close" :size="20" /></button>
          </div>
          <div class="p-5 pt-3"><slot /></div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
