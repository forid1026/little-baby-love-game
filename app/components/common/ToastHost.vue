<script setup lang="ts">
const { toasts } = useToast()
</script>

<template>
  <div class="fixed left-0 right-0 z-[120] flex flex-col items-center gap-2 pointer-events-none" style="top: calc(var(--safe-top) + 12px)" aria-live="polite">
    <div v-for="t in toasts" :key="t.id" class="pop-in px-5 py-3 rounded-full font-extrabold shadow-lg"
      :style="t.kind === 'ok' ? 'background:#fff;color:#C45C86' : 'background:#FFF1F1;color:#C0455B'">
      {{ t.text }}
    </div>
  </div>
</template>
