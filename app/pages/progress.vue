<script setup lang="ts">
import { ROOM_ITEMS } from '~/data/room'
import { DRESS_ITEMS } from '~/data/dress'

const game = useModule('game')
const room = useModule('room')
const dress = useModule('dress')
const mommy = useModule('mommy')
const daddy = useModule('daddy')
const ach = useAchievements()
const { isUnlocked } = useCoins()

const s = computed(() => game.value.stats)
const rows = computed(() => [
  { icon: '🎮', label: 'Games played', value: s.value.gamesPlayed },
  { icon: '🧩', label: 'Puzzles completed', value: s.value.memoryWins },
  { icon: '🫧', label: 'Bubble levels cleared', value: s.value.bubbleLevelsCleared },
  { icon: '🏅', label: 'Best bubble score', value: s.value.bubbleBestScore },
  { icon: '🛏️', label: 'Items in baby room', value: room.value.placed.length },
  { icon: '👗', label: 'Saved outfits', value: dress.value.favorites.length },
  { icon: '🔥', label: 'Best daily streak', value: `${game.value.rewards.bestStreak} days` },
  { icon: '🎁', label: 'Daily rewards claimed', value: game.value.rewards.totalClaims },
  { icon: '💌', label: 'Favourite love notes', value: mommy.value.favorites.length },
  { icon: '💝', label: "Daddy's messages opened", value: daddy.value.messages.filter(m => m.seenAt).length },
  { icon: '🪙', label: 'Coins earned in total', value: s.value.totalCoinsEarned },
])
const bars = computed(() => [
  { label: 'Achievements', cur: ach.unlockedCount.value, max: ach.defs.length },
  { label: 'Room items unlocked', cur: ROOM_ITEMS.filter(i => isUnlocked(i.id)).length, max: ROOM_ITEMS.length },
  { label: 'Outfit pieces unlocked', cur: DRESS_ITEMS.filter(i => isUnlocked(i.id)).length, max: DRESS_ITEMS.length },
])
</script>

<template>
  <div>
    <PageHeader title="My Progress" subtitle="Look how much fun you have had" back />
    <section class="card card-pad mb-4">
      <div v-for="b in bars" :key="b.label" class="mb-3 last:mb-0">
        <div class="flex justify-between font-extrabold text-sm"><span>{{ b.label }}</span><span>{{ b.cur }}/{{ b.max }}</span></div>
        <div class="mt-1 h-3 overflow-hidden rounded-full" style="background: #F1EAF0" role="progressbar" :aria-valuenow="b.cur" :aria-valuemax="b.max">
          <div class="h-full rounded-full" :style="{ width: (b.cur / b.max) * 100 + '%', background: 'linear-gradient(90deg, var(--accent), #F6C453)' }" />
        </div>
      </div>
    </section>
    <ul class="card m-0 list-none p-2">
      <li v-for="r in rows" :key="r.label" class="flex items-center gap-3 rounded-2xl px-3 py-2.5">
        <span class="text-2xl" aria-hidden="true">{{ r.icon }}</span>
        <span class="flex-1 font-bold">{{ r.label }}</span>
        <span class="font-black" style="color: var(--accent-dark)">{{ r.value }}</span>
      </li>
    </ul>
  </div>
</template>
