<script setup lang="ts">
import type { Card } from '~/games/memory/engine'
import { CARD_BACKS } from '~/data/memory'

const props = defineProps<{ card: Card; back: string }>()
defineEmits<{ flip: [] }>()
const b = computed(() => CARD_BACKS.find(x => x.id === props.back) ?? CARD_BACKS[0]!)
const isSvg = computed(() => props.card.face.startsWith('svg:'))
const svg = computed(() => props.card.face.slice(4))
const up = computed(() => props.card.flipped || props.card.matched)
</script>

<template>
  <button class="relative w-full border-0 bg-transparent p-0" style="aspect-ratio: 3 / 4; perspective: 700px" :aria-label="up ? `Card: ${isSvg ? 'teddy bear' : card.face}` : 'Hidden card'" :aria-pressed="up" @click="$emit('flip')">
    <div class="absolute inset-0 transition-transform duration-500" :style="{ transformStyle: 'preserve-3d', transform: up ? 'rotateY(180deg)' : 'rotateY(0)' }">
      <!-- back -->
      <div class="absolute inset-0 flex items-center justify-center rounded-2xl text-white" style="backface-visibility: hidden; box-shadow: var(--shadow); font-size: 2rem; border: 3px solid #fff"
        :style="{ background: `linear-gradient(145deg, ${b.from}, ${b.to})` }"><span style="opacity: .9">{{ b.mark }}</span></div>
      <!-- face -->
      <div class="absolute inset-0 flex items-center justify-center rounded-2xl" style="backface-visibility: hidden; transform: rotateY(180deg); background: #fff; box-shadow: var(--shadow); font-size: 2.4rem"
        :style="card.matched ? 'border: 3px solid #8FD9AE; background: #F2FFF7' : 'border: 3px solid #fff'">
        <span v-if="isSvg" class="block w-4/5" v-html="svg" />
        <span v-else aria-hidden="true">{{ card.face }}</span>
      </div>
    </div>
  </button>
</template>
