<script setup lang="ts">
import { roomItemById } from '~/data/room'
import { dressItemById } from '~/data/dress'

const { current, dismiss } = useRewardModal()
const open = computed(() => !!current.value)
useBackHandler(open, () => { dismiss(); return true })
const unlockNames = computed(() => (current.value?.unlocks ?? []).map(id => roomItemById(id)?.name ?? dressItemById(id)?.name ?? id))
const heading = computed(() => ({ reward: 'Daily Reward', achievement: 'Achievement Unlocked', level: 'Well Done' }[current.value?.kind ?? 'reward']))
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="current" class="fixed inset-0 z-[100] flex items-center justify-center p-5" style="background: rgba(96, 76, 89, 0.5)"
        role="dialog" aria-modal="true" :aria-label="current.title" @click.self="dismiss()">
        <div class="sheet card relative w-full max-w-sm text-center overflow-hidden px-6 py-7" style="background: linear-gradient(#FFFDF8, #FFEFF5)">
          <FloatingHearts :count="12" emoji="★" />
          <p class="text-xs font-extrabold tracking-widest uppercase" style="color: var(--accent-dark)">{{ heading }}</p>
          <div class="text-7xl my-3 pop-in" aria-hidden="true">{{ current.icon ?? '🎉' }}</div>
          <h2 class="h1" style="font-size: 1.4rem">{{ current.title }}</h2>
          <p v-if="current.subtitle" class="muted mt-1">{{ current.subtitle }}</p>
          <div class="flex justify-center gap-3 my-5">
            <span v-if="current.coins" class="chip pop-in">🪙 +{{ current.coins }}</span>
            <span v-if="current.stars" class="chip pop-in" style="animation-delay: .1s">⭐ +{{ current.stars }}</span>
          </div>
          <p v-if="unlockNames.length" class="font-extrabold mb-4" style="color: var(--accent-dark)">🔓 Unlocked: {{ unlockNames.join(', ') }}</p>
          <button class="btn btn-primary w-full" @click="dismiss()">Yay, thank you!</button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
