<script setup lang="ts">
const { coins, stars } = useCoins()
withDefaults(defineProps<{ showStars?: boolean }>(), { showStars: true })
</script>

<template>
  <div class="flex items-center gap-2" aria-label="Your coins and stars">
    <NuxtLink to="/rewards" class="chip" :aria-label="`${coins} coins`">
      <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10" fill="#F6C453" stroke="#D9A02B" stroke-width="2"/><circle cx="12" cy="12" r="6.2" fill="none" stroke="#fff" stroke-width="1.6" opacity=".8"/><path d="M12 8.4v7.2M10 10.2h3a1.2 1.2 0 010 2.4h-2a1.2 1.2 0 000 2.4h3" stroke="#fff" stroke-width="1.5" fill="none" stroke-linecap="round" opacity=".9"/></svg>
      <span>{{ coins }}</span>
    </NuxtLink>
    <NuxtLink v-if="showStars" to="/achievements" class="chip" :aria-label="`${stars} stars`">
      <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.5l2.9 6 6.6.8-4.9 4.5 1.3 6.5L12 17l-5.9 3.3 1.3-6.5L2.5 9.3l6.6-.8z" fill="#FFD36B" stroke="#E0A93B" stroke-width="1.6" stroke-linejoin="round"/></svg>
      <span>{{ stars }}</span>
    </NuxtLink>
  </div>
</template>
