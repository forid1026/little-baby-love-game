<script setup lang="ts">
import type { DaddyMessage } from '~/types'

const props = defineProps<{ message: DaddyMessage; animated: boolean }>()
const emit = defineEmits<{ opened: []; close: [] }>()
const { play, haptic } = useSound()

// stage: closed envelope -> opening flap -> letter revealed
const stage = ref<'closed' | 'opening' | 'letter'>(props.animated ? 'closed' : 'letter')
if (!props.animated) emit('opened')

useBackHandler(() => true, () => { emit('close'); return true })

function open() {
  if (stage.value !== 'closed') return
  stage.value = 'opening'
  play('envelope')
  haptic(25)
  emit('opened')
  setTimeout(() => { stage.value = 'letter'; play('reward') }, 1100)
}
</script>

<template>
  <Teleport to="body">
    <div class="fixed inset-0 z-[110] flex items-center justify-center p-5 overflow-y-auto" style="background: rgba(96, 76, 89, 0.55)"
      role="dialog" aria-modal="true" aria-label="A little surprise from Daddy">
      <FloatingHearts v-if="stage !== 'closed'" :count="20" />

      <!-- Envelope -->
      <div v-if="stage !== 'letter'" class="text-center w-full max-w-xs fade-up">
        <p class="font-black text-white text-xl mb-5" style="text-shadow: 0 2px 8px rgba(0,0,0,.25)">A Little Surprise From Daddy ❤️</p>
        <button class="relative block mx-auto border-0 bg-transparent p-0" :class="stage === 'closed' ? 'wiggle' : ''" style="width: 260px; height: 190px; perspective: 800px"
          aria-label="Open the envelope" @click="open">
          <div class="absolute inset-0 rounded-2xl" style="background: linear-gradient(#FFD6E5, #F4A9C4); box-shadow: 0 14px 30px rgba(0,0,0,.25)" />
          <!-- letter peeking out -->
          <div class="absolute left-4 right-4 rounded-xl transition-transform duration-700" :style="{ top: '14px', height: '150px', background: '#FFFBF2', transform: stage === 'opening' ? 'translateY(-70px)' : 'translateY(0)' }" />
          <!-- front pockets -->
          <svg class="absolute inset-0" viewBox="0 0 260 190" width="260" height="190" aria-hidden="true">
            <path d="M0 190 L0 20 Q0 0 20 0 L130 100 L240 0 Q260 0 260 20 L260 190Z" fill="#F7B7CF" opacity="0" />
            <path d="M0 190 L130 96 L260 190Z" fill="#F29BBB" />
            <path d="M0 18 L0 190 L130 96Z" fill="#F7B3CC" />
            <path d="M260 18 L260 190 L130 96Z" fill="#F7B3CC" />
          </svg>
          <!-- flap -->
          <div class="absolute left-0 right-0 top-0 transition-transform duration-700" :style="{ height: '100px', transformOrigin: 'top', transform: stage === 'opening' ? 'rotateX(180deg)' : 'rotateX(0)', zIndex: stage === 'opening' ? 0 : 3 }">
            <svg viewBox="0 0 260 100" width="260" height="100" aria-hidden="true"><path d="M0 0 L260 0 L130 100Z" fill="#F4A9C4" stroke="#E98FB3" stroke-width="2" /></svg>
          </div>
          <!-- heart seal -->
          <div v-if="stage === 'closed'" class="absolute text-4xl" style="left: 50%; top: 70px; transform: translateX(-50%); z-index: 4; filter: drop-shadow(0 2px 3px rgba(0,0,0,.25))" aria-hidden="true">❤️</div>
        </button>
        <p class="mt-6 text-white font-extrabold" style="text-shadow: 0 2px 8px rgba(0,0,0,.25)">{{ stage === 'closed' ? 'Tap the envelope to open it' : 'Opening…' }}</p>
      </div>

      <!-- Letter -->
      <div v-else class="relative w-full max-w-sm pop-in">
        <DaddyLetter :title="message.title" :body="message.body" :signature="message.signature" :design="message.design" :special="message.special" />
        <button class="btn btn-primary w-full mt-4" @click="emit('close')">Close with a hug 🤗</button>
      </div>
    </div>
  </Teleport>
</template>
