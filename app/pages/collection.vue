<script setup lang="ts">
import { ROOM_ITEMS } from '~/data/room'
import { DRESS_ITEMS, SKIN } from '~/data/dress'
import { darken } from '~/utils/misc'

const { isUnlocked, stars } = useCoins()
const ach = useAchievements()
const game = useModule('game')
const dress = useModule('dress')

type Tab = 'furniture' | 'outfits' | 'accessories' | 'stars' | 'badges' | 'special'
const tab = ref<Tab>('furniture')
const tabs: Array<[Tab, string]> = [['furniture', 'Furniture'], ['outfits', 'Outfits'], ['accessories', 'Accessories'], ['stars', 'Stars'], ['badges', 'Badges'], ['special', 'Special']]

const furniture = computed(() => ROOM_ITEMS.filter(i => i.price >= 0))
const outfits = computed(() => DRESS_ITEMS.filter(i => i.slot === 'outfit'))
const accessories = computed(() => DRESS_ITEMS.filter(i => i.slot !== 'outfit'))
const special = computed(() => ROOM_ITEMS.filter(i => i.price < 0))
const owned = (list: Array<{ id: string }>) => list.filter(i => isUnlocked(i.id)).length
</script>

<template>
  <div>
    <PageHeader title="My Collection" subtitle="Treasures you have gathered" back />
    <div class="flex gap-2 overflow-x-auto pb-3" role="tablist" style="scrollbar-width: none">
      <button v-for="t in tabs" :key="t[0]" role="tab" :aria-selected="tab === t[0]" class="chip shrink-0" :style="tab === t[0] ? 'background:var(--accent);color:#fff' : ''" @click="tab = t[0]">{{ t[1] }}</button>
    </div>

    <section v-if="tab === 'furniture'">
      <p class="muted text-sm mb-2">{{ owned(furniture) }} of {{ furniture.length }} collected</p>
      <ul class="m-0 grid list-none grid-cols-3 gap-2 p-0">
        <li v-for="i in furniture" :key="i.id" class="card p-2 text-center" :style="isUnlocked(i.id) ? '' : 'opacity:.55'">
          <svg viewBox="0 0 100 100" width="56" height="56" class="mx-auto" :style="isUnlocked(i.id) ? '' : 'filter:grayscale(1)'" v-html="i.art" />
          <p class="text-xs font-extrabold">{{ isUnlocked(i.id) ? i.name : '???' }}</p>
        </li>
      </ul>
    </section>

    <section v-else-if="tab === 'outfits' || tab === 'accessories'">
      <p class="muted text-sm mb-2">{{ owned(tab === 'outfits' ? outfits : accessories) }} of {{ (tab === 'outfits' ? outfits : accessories).length }} collected · {{ dress.favorites.length }} saved looks</p>
      <ul class="m-0 grid list-none grid-cols-3 gap-2 p-0">
        <li v-for="i in (tab === 'outfits' ? outfits : accessories)" :key="i.id" class="card p-2 text-center" :style="isUnlocked(i.id) ? '' : 'opacity:.55'">
          <svg :viewBox="tab === 'outfits' ? '40 150 160 150' : '10 40 220 270'" width="100%" height="64" :style="isUnlocked(i.id) ? '' : 'filter:grayscale(1)'">
            <g v-html="i.art(i.color, darken(i.color, 0.22))" />
            <circle v-if="false" :fill="SKIN" r="0" />
          </svg>
          <p class="text-xs font-extrabold">{{ isUnlocked(i.id) ? i.name : '???' }}</p>
        </li>
      </ul>
    </section>

    <section v-else-if="tab === 'stars'" class="card card-pad text-center">
      <p class="text-6xl floaty" aria-hidden="true">⭐</p>
      <p class="h1">{{ stars }} stars</p>
      <p class="muted">Earn stars from daily rewards, puzzles, bubble levels and achievements.</p>
      <div class="mt-3 flex flex-wrap justify-center gap-1 text-2xl" aria-hidden="true"><span v-for="n in Math.min(stars, 40)" :key="n">⭐</span></div>
    </section>

    <section v-else-if="tab === 'badges'">
      <p class="muted text-sm mb-2">Achievement badges: {{ ach.unlockedCount.value }} of {{ ach.defs.length }}</p>
      <ul class="m-0 grid list-none grid-cols-3 gap-2 p-0">
        <li v-for="a in ach.list.value" :key="a.def.id" class="card p-3 text-center" :style="a.done ? '' : 'opacity:.5'">
          <p class="text-4xl" :style="a.done ? '' : 'filter:grayscale(1)'">{{ a.def.icon }}</p>
          <p class="text-xs font-extrabold mt-1" style="line-height: 1.1">{{ a.def.title }}</p>
        </li>
      </ul>
    </section>

    <section v-else>
      <ul class="m-0 flex list-none flex-col gap-3 p-0">
        <li v-for="i in special" :key="i.id" class="card flex items-center gap-3 p-4" :style="isUnlocked(i.id) ? 'background:#FFFBEA' : 'opacity:.6'">
          <svg viewBox="0 0 100 100" width="72" height="72" :style="isUnlocked(i.id) ? '' : 'filter:grayscale(1)'" v-html="i.art" />
          <div><p class="h2">{{ isUnlocked(i.id) ? i.name : 'Mystery treasure' }}</p><p class="muted text-sm">{{ isUnlocked(i.id) ? 'A special reward from your 7-day streak!' : 'Claim your daily reward 7 days in a row to receive it.' }}</p></div>
        </li>
      </ul>
      <p class="muted text-sm text-center mt-4">Coins earned in total: {{ game.stats.totalCoinsEarned }} 🪙</p>
    </section>
  </div>
</template>
