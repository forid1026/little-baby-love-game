<script setup lang="ts">
// In-app splash: shown while local data loads (and at least ~1.4s so it feels like a hello).
defineProps<{ show: boolean }>()
</script>

<template>
  <Transition name="modal">
    <div v-if="show" class="fixed inset-0 z-[200] flex flex-col items-center justify-center text-center px-8" style="background: linear-gradient(#FFE3EE, #FFF8EF 70%)" role="status" aria-label="Loading Little Baby Love">
      <SkyBackdrop />
      <div class="w-44 floaty"><BabyAvatar :equipped="{ outfit: 'outfit_onesie', hat: 'hat_beanie', shoes: 'shoes_socks' }" /></div>
      <h1 class="h1 mt-4" style="font-size: 2rem; color: var(--accent-dark)">Little Baby Love</h1>
      <p class="font-extrabold muted">Mommy's Happy World</p>
      <p class="mt-1 text-sm muted">A Little World Full of Love.</p>
      <div class="mt-6 flex gap-2" aria-hidden="true"><span v-for="i in 3" :key="i" class="twinkle text-xl" :style="{ animationDelay: i * 0.25 + 's' }">❤</span></div>
    </div>
  </Transition>
</template>
