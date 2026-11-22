<script setup lang="ts">
import type { CareNeed } from '~/types'
import { ACTIVITIES, MOOD_TEXT, NEEDS } from '~/games/baby-care/engine'
import { useBabyCare } from '~/games/baby-care/useBabyCare'

definePageMeta({ layout: 'game' })
const c = useBabyCare()
const dress = useModule('dress')
const journey = useModule('journey')
const goBack = useGoBack('/games')
const active = ref<CareNeed | null>(null)

onMounted(c.start)

const meta: Record<CareNeed, { icon: string; label: string; bar: string }> = {
  hunger: { icon: '🍼', label: 'Tummy', bar: '#F4A0B9' },
  diaper: { icon: '🩲', label: 'Diaper', bar: '#8DBDE8' },
  clean: { icon: '🛁', label: 'Clean', bar: '#7ED3C8' },
  sleep: { icon: '🌙', label: 'Sleep', bar: '#B195F2' },
  fun: { icon: '🧸', label: 'Fun', bar: '#FFD45E' },
}
const order: CareNeed[] = ['hunger', 'diaper', 'clean', 'sleep', 'fun']
const babyName = computed(() => journey.value.nickname || 'Baby')

function done() {
  const need = active.value
  active.value = null
  if (need) c.complete(need)
}
const lowest = computed(() => NEEDS.reduce((a, b) => (c.care.value.needs[b] < c.care.value.needs[a] ? b : a)))
</script>

<template>
  <div>
    <GameHeader title="Baby Care Day" :subtitle="`Take care of ${babyName}`" @back="goBack" />

    <section class="relative card overflow-hidden px-6 pt-3 pb-4 text-center" style="background: linear-gradient(#E9F7EF, #FFE9F1)">
      <FloatingHearts v-if="c.mood.value === 'happy' || c.mood.value === 'giggle'" :count="5" />
      <div class="mx-auto w-44"><BabyAvatar :equipped="dress.equipped" :colors="dress.colors" :mood="c.mood.value" :bounce="c.mood.value !== 'sleeping'" /></div>
      <p class="font-extrabold mt-1" aria-live="polite">{{ MOOD_TEXT[c.mood.value] }}</p>
      <p class="muted text-xs">Happiness {{ c.joy.value }}%</p>
    </section>

    <section class="card card-pad mt-3" aria-label="Baby needs">
      <ul class="m-0 grid list-none gap-2 p-0">
        <li v-for="n in order" :key="n" class="flex items-center gap-2">
          <span class="w-7 text-center text-xl" aria-hidden="true">{{ meta[n].icon }}</span>
          <span class="w-14 text-sm font-bold">{{ meta[n].label }}</span>
          <div class="h-3 flex-1 overflow-hidden rounded-full" style="background: #F1EAF0" role="progressbar" :aria-label="meta[n].label" :aria-valuenow="Math.round(c.care.value.needs[n])" aria-valuemax="100">
            <div class="h-full rounded-full transition-all duration-500" :style="{ width: c.care.value.needs[n] + '%', background: meta[n].bar }" />
          </div>
        </li>
      </ul>
    </section>

    <div class="mt-3 grid grid-cols-5 gap-2">
      <button v-for="n in order" :key="n" class="card relative flex flex-col items-center gap-1 border-0 p-2" style="min-height: 74px" :style="n === lowest && c.care.value.needs[n] < 60 ? 'outline: 3px solid var(--accent)' : ''"
        :disabled="c.sleeping.value" :aria-label="ACTIVITIES[n].title" @click="active = n">
        <span class="text-3xl" aria-hidden="true">{{ meta[n].icon }}</span>
        <span class="text-xs font-extrabold">{{ meta[n].label }}</span>
      </button>
    </div>
    <p class="muted text-xs text-center mt-3">A gentle game: there is no hurry. Needs go down slowly and never below a little hum of care. Just for fun. 💕</p>

    <ModalSheet :open="!!active" :title="active ? ACTIVITIES[active].title : ''" @close="active = null">
      <CareActivity v-if="active" :key="active" :activity="ACTIVITIES[active]" :scatter="active === 'clean' || active === 'fun'" @done="done" />
    </ModalSheet>
  </div>
</template>
