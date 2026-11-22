<script setup lang="ts">
import { MAX_LEVEL, levelConfig } from '~/games/bubble-pop/engine'

import { useBubbleGame } from '~/games/bubble-pop/useBubbleGame'

definePageMeta({ layout: 'game' })
const g = useBubbleGame()
const game = useModule('game')
const goBack = useGoBack('/games')
const canvas = ref<HTMLCanvasElement | null>(null)
const confirmLeave = ref(false)

const active = computed(() => g.phase.value === 'playing')
useBackHandler(active, () => {
  if (g.paused.value) { g.togglePause(); return true }
  g.togglePause(); confirmLeave.value = true; return true
})

onMounted(() => {
  g.mount(canvas.value!)
  window.addEventListener('keydown', g.onKey)
})
onBeforeUnmount(() => { g.unmount(); window.removeEventListener('keydown', g.onKey) })

const unlocked = computed(() => game.value.bubble.unlockedLevel)
const levels = computed(() => Array.from({ length: Math.min(MAX_LEVEL, Math.max(9, unlocked.value + 2)) }, (_, i) => i + 1))

function back() { if (active.value) { if (!g.paused.value) g.togglePause(); confirmLeave.value = true } else if (g.phase.value === 'menu') goBack(); else g.toMenu() }
function leave() { confirmLeave.value = false; g.toMenu() }
function cancelLeave() { confirmLeave.value = false; if (g.paused.value) g.togglePause() }
</script>

<template>
  <div>
    <GameHeader title="Bubble Pop" :subtitle="active ? `Level ${g.level.value}` : 'Match 3 or more'" :pausable="active" :paused="g.paused.value" @back="back" @pause="g.togglePause" />

    <section v-show="g.phase.value === 'menu'" class="card card-pad fade-up">
      <p class="muted mb-3">Aim anywhere on the board and let go to shoot. Pop groups of three or more matching bubbles. Tap the <b>Swap</b> button to switch bubbles. Clear every bubble to win!</p>
      <div class="grid grid-cols-3 gap-2 mb-3 text-center text-sm font-bold">
        <div class="rounded-2xl p-2" style="background: #FFF0F5">🌟 Star bubbles<br><span class="muted font-semibold">bonus points</span></div>
        <div class="rounded-2xl p-2" style="background: #FFF4E5">✸ Bomb bubbles<br><span class="muted font-semibold">pop neighbours</span></div>
        <div class="rounded-2xl p-2" style="background: #EEF6FF">🌈 Rainbow<br><span class="muted font-semibold">matches any</span></div>
      </div>
      <h2 class="h2 mb-2">Choose a level</h2>
      <div class="grid grid-cols-3 gap-2">
        <button v-for="n in levels" :key="n" class="btn" :class="n <= unlocked ? 'btn-primary' : 'btn-soft'" :disabled="n > unlocked" style="flex-direction: column; gap: 0; padding: 8px 4px; height: 64px"
          :aria-label="n <= unlocked ? `Play level ${n}` : `Level ${n} locked`" @click="g.startLevel(n)">
          <span v-if="n <= unlocked">Level {{ n }}</span><Icon v-else name="lock" :size="20" />
          <small v-if="n <= unlocked" style="opacity: .85">{{ levelConfig(n).colors }} colours</small>
        </button>
      </div>
      <p class="muted text-sm mt-3">Best score: {{ game.stats.bubbleBestScore }} · Levels cleared: {{ game.stats.bubbleLevelsCleared }}</p>
    </section>

    <div v-show="g.phase.value !== 'menu'">
      <div class="flex gap-2 mb-2 justify-center flex-wrap" aria-live="polite">
        <span class="chip">⭐ {{ g.score.value }}</span>
        <span class="chip">🫧 {{ g.bubblesLeft.value }} left</span>
        <span class="chip" title="Shots until the bubbles move down">⏬ {{ g.missesLeft.value }}</span>
      </div>
    </div>

    <div v-show="g.phase.value !== 'menu'" class="relative mx-auto" style="width: min(100%, calc((100dvh - 250px) * 0.6316)); min-width: 260px">
      <canvas ref="canvas" class="block w-full rounded-3xl" style="aspect-ratio: 360 / 570; touch-action: none; box-shadow: var(--shadow); background: #FFF1F7"
        role="img" aria-label="Bubble Pop board. Aim and release to shoot." @pointerdown="g.onDown" @pointermove="g.onMove" @pointerup="g.onUp" @pointercancel="g.onUp" />
      <p v-if="g.bannerText.value" class="pop-in absolute left-0 right-0 text-center font-black pointer-events-none" style="top: 42%; color: var(--accent-dark); text-shadow: 0 2px 0 #fff, 0 0 12px #fff">{{ g.bannerText.value }}</p>

      <div v-if="g.paused.value && g.phase.value === 'playing'" class="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-3xl text-center" style="background: rgba(255, 248, 239, 0.95)">
        <p class="h1">Paused 💤</p>
        <button class="btn btn-primary" @click="g.togglePause()"><Icon name="play" :size="20" /> Resume</button>
        <button class="btn btn-soft" @click="g.startLevel(g.level.value)"><Icon name="restart" :size="20" /> Restart level</button>
        <button class="btn btn-soft" @click="g.toMenu()">Choose level</button>
      </div>
    </div>

    <div v-if="active" class="flex justify-center gap-3 mt-3">
      <button class="btn btn-soft btn-sm" @click="g.swap()"><Icon name="shuffle" :size="18" /> Swap</button>
      <button class="btn btn-soft btn-sm" @click="g.startLevel(g.level.value)"><Icon name="restart" :size="18" /> Restart</button>
    </div>

    <ModalSheet :open="g.phase.value === 'won'" title="Level cleared! 🎉" :dismissible="false">
      <div class="text-center">
        <p class="h1">{{ g.score.value }} points</p>
        <p v-if="g.result.value?.newBest" class="font-extrabold" style="color: var(--accent-dark)">New best for this level! 🏆</p>
        <p class="font-extrabold mt-1">+{{ g.result.value?.coins }} 🪙 · +{{ g.result.value?.stars }} ⭐</p>
        <div class="flex gap-3 mt-5">
          <button class="btn btn-soft flex-1" @click="g.toMenu()">Levels</button>
          <button v-if="g.level.value < MAX_LEVEL" class="btn btn-primary flex-1" @click="g.startLevel(g.level.value + 1)">Next level</button>
          <button v-else class="btn btn-primary flex-1" @click="g.startLevel(g.level.value)">Replay</button>
        </div>
      </div>
    </ModalSheet>
    <ModalSheet :open="g.phase.value === 'lost'" title="Oh no, the bubbles got low 🫧" :dismissible="false">
      <div class="text-center">
        <p class="muted">No worries, it is just for fun. You scored <b>{{ g.score.value }}</b>.</p>
        <p v-if="g.result.value?.coins" class="font-extrabold mt-2">Comfort prize: +{{ g.result.value.coins }} 🪙</p>
        <div class="flex gap-3 mt-5">
          <button class="btn btn-soft flex-1" @click="g.toMenu()">Levels</button>
          <button class="btn btn-primary flex-1" @click="g.startLevel(g.level.value)"><Icon name="restart" :size="20" /> Try again</button>
        </div>
      </div>
    </ModalSheet>
    <ConfirmDialog :open="confirmLeave" title="Leave this level?" message="Your progress in this level will be lost." confirm-label="Leave" cancel-label="Keep playing" danger @confirm="leave" @cancel="cancelLeave" />
  </div>
</template>
