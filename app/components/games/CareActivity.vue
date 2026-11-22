<script setup lang="ts">
// One tap-through care mini-game (feeding, diaper, bath, bedtime, play).
import type { Activity } from '~/games/baby-care/engine'

const props = defineProps<{ activity: Activity; scatter?: boolean }>()
const emit = defineEmits<{ done: [] }>()
const { play, haptic } = useSound()

const step = ref(0)
const pos = ref({ x: 50, y: 50 })
const finished = ref(false)
const current = computed(() => props.activity.steps[Math.min(step.value, props.activity.steps.length - 1)]!)

function tap() {
  if (finished.value) return
  play(props.activity.need === 'clean' ? 'pop' : 'click'); haptic(8)
  step.value++
  if (step.value >= props.activity.steps.length) {
    finished.value = true
    setTimeout(() => emit('done'), 350)
    return
  }
  if (props.scatter) pos.value = { x: 15 + Math.random() * 70, y: 12 + Math.random() * 62 }
}
</script>

<template>
  <div class="text-center">
    <p class="muted mb-2">{{ activity.intro }}</p>
    <div class="h-3 overflow-hidden rounded-full mb-3" style="background: #F1EAF0" role="progressbar" :aria-valuenow="step" :aria-valuemax="activity.steps.length">
      <div class="h-full rounded-full transition-all" :style="{ width: (step / activity.steps.length) * 100 + '%', background: 'var(--accent)' }" />
    </div>
    <div class="relative mx-auto rounded-3xl" style="height: 190px; background: linear-gradient(#FFF8EF, #FFE9F1)">
      <button class="absolute flex flex-col items-center justify-center border-0 rounded-full pop-in" :key="step"
        :style="{ left: pos.x + '%', top: pos.y + '%', transform: 'translate(-50%, -50%)', width: '92px', height: '92px', background: '#fff', boxShadow: 'var(--shadow)', fontSize: '2.6rem' }"
        :aria-label="current.label" @click="tap">
        <span aria-hidden="true">{{ finished ? '💖' : current.emoji }}</span>
      </button>
    </div>
    <p class="font-extrabold mt-3" aria-live="polite">{{ finished ? 'All done! 💕' : current.label }}</p>
    <p class="muted text-xs">Step {{ Math.min(step + 1, activity.steps.length) }} of {{ activity.steps.length }}</p>
  </div>
</template>
