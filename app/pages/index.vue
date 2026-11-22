<script setup lang="ts">
const game = useModule('game')
const daddy = useDaddyMessages()
const { dailyNote } = useMommyNotes()
const rewards = useRewards()
const { play } = useSound()

const hello = computed(() => `Hello ${game.value.mommyName || 'Mommy'}! ❤️`)
const dateText = computed(() => prettyDate(rewards.today.value))
const surprisesCount = computed(() => daddy.readable.value.length)

const shortcuts = computed(() => [
  { to: '/games', icon: '🎮', label: 'Games', bg: 'var(--color-lav)' },
  { to: '/rewards', icon: '🎁', label: 'Daily reward', bg: 'var(--color-peach)', dot: !rewards.claimedToday.value },
  { to: '/games/baby-room', icon: '🛏️', label: 'Baby room', bg: 'var(--color-sky)' },
  { to: '/daddy-messages', icon: '💌', label: "Daddy's Secret Messages", bg: 'var(--color-blush)', note: surprisesCount.value ? `${surprisesCount.value} opened` : 'Surprises await' },
])
</script>

<template>
  <div>
    <header class="flex items-start justify-between gap-3 mb-3">
      <div>
        <h1 class="h1">{{ hello }}</h1>
        <p class="muted text-sm font-bold">{{ dateText }}</p>
      </div>
      <CoinDisplay />
    </header>

    <section class="card relative overflow-hidden mb-4 px-5 pt-5 pb-4 fade-up" style="background: linear-gradient(135deg, #FFE3EE, #E8DFFF)">
      <FloatingHearts :count="6" />
      <div class="flex items-center gap-3">
        <div class="w-32 shrink-0"><BabyAvatar bounce :equipped="{ outfit: 'outfit_onesie', hat: 'hat_beanie', shoes: 'shoes_socks', acc: 'acc_bib' }" /></div>
        <div>
          <p class="text-xs font-extrabold tracking-widest uppercase" style="color: var(--accent-dark)">A little miracle</p>
          <p class="font-extrabold mt-1" style="line-height: 1.35">Your little miracle is growing, and every day brings a new reason to smile.</p>
        </div>
      </div>
    </section>

    <section class="card card-pad mb-4 fade-up" aria-label="Today's special message">
      <p class="text-xs font-extrabold tracking-widest uppercase mb-1" style="color: var(--accent-dark)">Today's special message</p>
      <p class="font-bold" style="font-size: 1.05rem; line-height: 1.4">“{{ dailyNote.text }}”</p>
      <NuxtLink to="/mommy-notes" class="btn btn-soft btn-sm mt-3 no-underline">More love notes</NuxtLink>
    </section>

    <section class="card card-pad mb-4 flex items-center gap-3 fade-up" aria-label="Daily reward status">
      <div class="text-4xl" :class="rewards.claimedToday.value ? '' : 'wiggle'" aria-hidden="true">{{ rewards.claimedToday.value ? '✅' : '🎁' }}</div>
      <div class="flex-1 min-w-0">
        <p class="h2">{{ rewards.claimedToday.value ? 'Reward collected today' : 'Your daily reward is ready!' }}</p>
        <p class="muted text-sm">{{ rewards.claimedToday.value ? `Day ${rewards.cycleDay.value} of 7 · come back tomorrow` : `Day ${rewards.cycleDay.value}: ${rewards.todaysReward.value.label}` }}</p>
      </div>
      <NuxtLink to="/rewards" class="btn btn-primary btn-sm no-underline" @click="play('click')">{{ rewards.claimedToday.value ? 'View' : 'Claim' }}</NuxtLink>
    </section>

    <h2 class="h2 mb-2">Quick play</h2>
    <div class="grid grid-cols-2 gap-3">
      <NuxtLink v-for="s in shortcuts" :key="s.to" :to="s.to" class="card relative no-underline p-4 flex flex-col gap-2 fade-up" :style="{ background: s.bg, minHeight: '104px', color: 'var(--color-ink)' }" @click="play('click')">
        <span class="text-3xl" aria-hidden="true">{{ s.icon }}</span>
        <span class="font-extrabold" style="line-height: 1.15">{{ s.label }}</span>
        <span v-if="s.note" class="text-xs font-bold muted">{{ s.note }}</span>
        <span v-if="s.dot" class="absolute top-3 right-3 w-3 h-3 rounded-full" style="background: #F6C453" aria-label="Ready" />
      </NuxtLink>
    </div>
  </div>
</template>
