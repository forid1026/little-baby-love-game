<script setup lang="ts">
const route = useRoute()
const { play } = useSound()
const rewards = useRewards()
const tabs = [
  { to: '/', label: 'Home', icon: 'home', match: (p: string) => p === '/' },
  { to: '/games', label: 'Games', icon: 'games', match: (p: string) => p.startsWith('/games') },
  { to: '/baby', label: 'My Baby', icon: 'baby', match: (p: string) => ['/baby', '/journey', '/collection', '/progress', '/achievements', '/rewards'].some(x => p.startsWith(x)) },
  { to: '/memories', label: 'Memories', icon: 'heart', match: (p: string) => ['/memories', '/mommy-notes', '/daddy-messages'].some(x => p.startsWith(x)) },
  { to: '/settings', label: 'Settings', icon: 'gear', match: (p: string) => p.startsWith('/settings') || p.startsWith('/about') },
]
</script>

<template>
  <nav class="fixed bottom-0 left-0 right-0 z-40 flex justify-center px-3" :style="{ paddingBottom: 'calc(var(--safe-bottom) + 8px)' }" aria-label="Main navigation">
    <ul class="card flex w-full max-w-[520px] justify-between p-1.5 m-0 list-none" style="border-radius: 999px; background: rgba(255,255,255,.95)">
      <li v-for="t in tabs" :key="t.to" class="flex-1">
        <NuxtLink :to="t.to" class="relative flex flex-col items-center justify-center gap-0.5 rounded-full py-2 font-extrabold no-underline"
          :style="t.match(route.path) ? 'background:var(--accent);color:#fff' : 'color:var(--color-ink-soft)'"
          style="min-height: 54px; font-size: .68rem" :aria-current="t.match(route.path) ? 'page' : undefined" @click="play('click')">
          <Icon :name="t.icon" :size="22" />
          <span>{{ t.label }}</span>
          <span v-if="t.to === '/' && !rewards.claimedToday.value" class="absolute top-1.5 right-4 w-2.5 h-2.5 rounded-full" style="background: #F6C453" aria-label="Daily reward ready" />
        </NuxtLink>
      </li>
    </ul>
  </nav>
</template>
