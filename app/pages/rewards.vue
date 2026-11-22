<script setup lang="ts">
import { WEEK_REWARDS } from '~/data/rewards'

const r = useRewards()
const game = useModule('game')
const toast = useToast()

function claim() {
  if (!r.claim()) toast.show('Already collected today. See you tomorrow! 💕', 'warn')
}
const streak = computed(() => r.liveStreak.value)
// Which days of the 7-day cycle are done (claimed) / today.
const doneUpTo = computed(() => (r.claimedToday.value ? ((streak.value - 1) % 7) + 1 : streak.value % 7))
</script>

<template>
  <div>
    <PageHeader title="Daily Rewards" subtitle="A little gift for every day together" back />

    <section class="relative card overflow-hidden text-center px-5 py-6 mb-4" style="background: linear-gradient(135deg, #FFF1D6, #FFE3EE)">
      <FloatingHearts v-if="!r.claimedToday.value" :count="8" emoji="★" />
      <div class="text-6xl" :class="r.claimedToday.value ? '' : 'wiggle'" aria-hidden="true">{{ r.claimedToday.value ? '✅' : '🎁' }}</div>
      <h2 class="h1 mt-2">{{ r.claimedToday.value ? 'Collected today!' : `Day ${r.cycleDay.value} reward` }}</h2>
      <p class="muted">{{ r.claimedToday.value ? 'Come back tomorrow for the next gift.' : r.todaysReward.value.label + ' + a surprise gift' }}</p>
      <p class="font-extrabold mt-2">🔥 {{ streak }} day streak · best {{ game.rewards.bestStreak }}</p>
      <button class="btn btn-primary mt-4" :disabled="r.claimedToday.value" @click="claim">
        <Icon name="gift" :size="20" /> {{ r.claimedToday.value ? 'Already claimed' : 'Claim reward' }}
      </button>
    </section>

    <h2 class="h2 mb-2">This week</h2>
    <ul class="m-0 grid list-none grid-cols-4 gap-2 p-0">
      <li v-for="d in WEEK_REWARDS" :key="d.day" class="card relative p-2 text-center" :class="d.day === 7 ? 'col-span-2' : ''"
        :style="{ background: d.day <= doneUpTo ? '#E9FBEF' : d.day === r.cycleDay.value && !r.claimedToday.value ? '#FFF6DA' : '#fff', outline: d.day === r.cycleDay.value && !r.claimedToday.value ? '3px solid var(--color-gold)' : 'none' }">
        <p class="text-xs font-extrabold muted">Day {{ d.day }}</p>
        <p class="text-3xl my-1" aria-hidden="true">{{ d.day === 7 ? '🧸' : d.day <= doneUpTo ? '✅' : '🪙' }}</p>
        <p class="text-xs font-extrabold">{{ d.label }}</p>
        <p class="text-xs muted">⭐ +{{ d.stars }}</p>
      </li>
    </ul>
    <p class="muted text-sm text-center mt-4">Miss a day and the week simply starts again. No pressure, just love. 💕</p>
  </div>
</template>
