<script setup lang="ts">
import { MEMORY_THEMES, CARD_BACKS, DIFFICULTIES, type Difficulty } from '~/data/memory'

import { useMemoryGame } from '~/games/memory/useMemoryGame'

definePageMeta({ layout: 'game' })
const g = useMemoryGame()
const game = useModule('game')
const goBack = useGoBack('/games')
const { play } = useSound()
const confirmLeave = ref(false)

const playing = computed(() => g.phase.value === 'playing')
useBackHandler(playing, () => { confirmLeave.value = true; return true })

function back() { if (playing.value && g.matchedPairs.value > 0) confirmLeave.value = true; else if (playing.value) g.backToSetup(); else goBack() }
function leave() { confirmLeave.value = false; g.backToSetup() }
const best = computed(() => game.value.stats.memoryBest[g.difficulty.value])
</script>

<template>
  <div>
    <GameHeader title="Memory Puzzle" :subtitle="playing ? `${DIFFICULTIES[g.difficulty.value].label} · ${g.pairs.value} pairs` : 'Find the matching pairs'" :pausable="playing" :paused="g.paused.value" @back="back" @pause="g.togglePause" />

    <!-- Setup -->
    <section v-if="g.phase.value === 'setup'" class="card card-pad fade-up">
      <p class="label" style="margin-top: 0">Difficulty</p>
      <div class="seg" role="group" aria-label="Difficulty">
        <button v-for="(d, k) in DIFFICULTIES" :key="k" :aria-pressed="g.difficulty.value === k" @click="g.difficulty.value = k as Difficulty; play('click')">{{ d.label }}<br><small>{{ d.pairs }} pairs</small></button>
      </div>
      <p class="label">Theme</p>
      <div class="grid grid-cols-3 gap-2">
        <button v-for="t in MEMORY_THEMES" :key="t.id" class="rounded-2xl border-0 p-2 font-extrabold text-sm" :style="{ background: g.theme.value === t.id ? 'var(--accent-soft)' : '#fff', outline: g.theme.value === t.id ? '3px solid var(--accent)' : 'none' }"
          :aria-pressed="g.theme.value === t.id" @click="g.theme.value = t.id; play('click')">
          <span class="block text-3xl">{{ t.emoji }}</span>{{ t.name }}
        </button>
      </div>
      <p class="label">Card design</p>
      <div class="flex gap-3">
        <button v-for="b in CARD_BACKS" :key="b.id" class="flex h-14 w-11 items-center justify-center rounded-xl border-0 text-white text-xl" :aria-label="`${b.name} card design`" :aria-pressed="g.cardBack.value === b.id"
          :style="{ background: `linear-gradient(145deg, ${b.from}, ${b.to})`, outline: g.cardBack.value === b.id ? '3px solid var(--accent-dark)' : 'none', outlineOffset: '2px' }" @click="g.cardBack.value = b.id; play('click')">{{ b.mark }}</button>
      </div>
      <p v-if="best" class="muted text-sm mt-4">Your best: {{ best.score }} points · {{ best.moves }} moves · {{ formatTime(best.time) }}</p>
      <button class="btn btn-primary w-full mt-4" @click="g.start()"><Icon name="play" :size="20" /> Start game</button>
    </section>

    <!-- Playing / won -->
    <template v-else>
      <div class="flex gap-2 mb-3 justify-center flex-wrap" aria-live="polite">
        <span class="chip">👣 {{ g.moves.value }} moves</span>
        <span class="chip">⏱ {{ formatTime(g.seconds.value) }}</span>
        <span class="chip">⭐ {{ g.liveScore.value }}</span>
      </div>
      <div class="relative">
        <div class="grid gap-2.5" style="grid-template-columns: repeat(4, 1fr)">
          <MemoryCard v-for="c in g.cards.value" :key="c.uid" :card="c" :back="g.cardBack.value" @flip="g.flip(c.uid)" />
        </div>
        <div v-if="g.paused.value" class="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 rounded-3xl text-center" style="background: rgba(255, 248, 239, 0.96)">
          <p class="h1">Paused 💤</p>
          <button class="btn btn-primary" @click="g.togglePause()"><Icon name="play" :size="20" /> Resume</button>
          <button class="btn btn-soft" @click="g.start()"><Icon name="restart" :size="20" /> Restart</button>
        </div>
      </div>
      <div v-if="playing" class="flex justify-center mt-4"><button class="btn btn-soft btn-sm" @click="g.start()"><Icon name="restart" :size="18" /> Restart</button></div>

      <ModalSheet :open="g.phase.value === 'won'" title="You did it! 🎉" :dismissible="false">
        <div class="relative text-center">
          <p class="text-5xl mb-1" aria-hidden="true">{{ '⭐'.repeat(g.result.value?.rating ?? 1) }}</p>
          <p class="muted">All pairs found in <b>{{ g.moves.value }}</b> moves and <b>{{ formatTime(g.seconds.value) }}</b>.</p>
          <p class="h1 my-2">{{ g.result.value?.score }} points</p>
          <p v-if="g.result.value?.best" class="font-extrabold" style="color: var(--accent-dark)">New personal best! 🏆</p>
          <p class="font-extrabold mt-1">+{{ g.result.value?.coins }} 🪙 <span v-if="g.result.value?.stars">· +{{ g.result.value?.stars }} ⭐</span></p>
          <div class="flex gap-3 mt-5">
            <button class="btn btn-soft flex-1" @click="g.backToSetup()">Change</button>
            <button class="btn btn-primary flex-1" @click="g.start()"><Icon name="restart" :size="20" /> Play again</button>
          </div>
        </div>
      </ModalSheet>
    </template>

    <ConfirmDialog :open="confirmLeave" title="Leave this game?" message="Your current puzzle progress will be lost." confirm-label="Leave" cancel-label="Keep playing" danger @confirm="leave" @cancel="confirmLeave = false" />
  </div>
</template>
