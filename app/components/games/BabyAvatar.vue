<script setup lang="ts">
// Cartoon baby (original, generic artwork). Renders the equipped clothes from data/dress.ts.
import type { Slot } from '~/types'
import { dressItemById, SKIN, SKIN_DARK } from '~/data/dress'
import { darken } from '~/utils/misc'

const props = withDefaults(defineProps<{
  equipped: Partial<Record<Slot, string>>
  colors?: Partial<Record<Slot, string>>
  bounce?: boolean
  mood?: 'happy' | 'hungry' | 'sleepy' | 'fussy' | 'sleeping' | 'giggle'
}>(), { colors: () => ({}), bounce: false, mood: 'happy' })
const eyesClosed = computed(() => props.mood === 'sleeping' || props.mood === 'sleepy' || props.mood === 'giggle')
const mouth = computed(() => ({
  happy: 'M108 142 Q120 156 132 142', giggle: 'M104 140 Q120 166 136 140 Z', hungry: 'M112 144 Q120 156 128 144 Q120 138 112 144 Z',
  sleepy: 'M114 146 Q120 150 126 146', sleeping: 'M110 144 Q120 152 130 144', fussy: 'M108 152 Q120 140 132 152',
}[props.mood]))
const mouthFilled = computed(() => ['giggle', 'hungry'].includes(props.mood))

function render(slot: Slot, layer?: 'back' | 'front'): string {
  const id = props.equipped[slot]
  const item = id ? dressItemById(id) : undefined
  if (!item) return ''
  if (slot === 'acc' && (item.layer ?? 'front') !== (layer ?? 'front')) return ''
  const c = props.colors?.[slot] ?? item.color
  return item.art(c, darken(c, 0.22))
}
</script>

<template>
  <svg viewBox="0 0 240 320" role="img" aria-label="Cartoon baby wearing the chosen outfit" :class="bounce ? 'floaty' : ''" style="overflow: visible">
    <ellipse cx="120" cy="308" rx="70" ry="9" fill="#604C59" opacity=".12" />
    <g v-html="render('acc', 'back')" />
    <!-- legs & feet -->
    <g :fill="SKIN" :stroke="SKIN_DARK" stroke-width="2">
      <rect x="78" y="244" width="30" height="40" rx="15" />
      <rect x="132" y="244" width="30" height="40" rx="15" />
      <ellipse cx="92" cy="290" rx="19" ry="12" />
      <ellipse cx="148" cy="290" rx="19" ry="12" />
    </g>
    <!-- arms -->
    <g :fill="SKIN" :stroke="SKIN_DARK" stroke-width="2">
      <ellipse cx="60" cy="212" rx="14" ry="26" transform="rotate(18 60 212)" />
      <ellipse cx="180" cy="212" rx="14" ry="26" transform="rotate(-18 180 212)" />
      <circle cx="50" cy="236" r="10" />
      <circle cx="190" cy="236" r="10" />
    </g>
    <!-- body -->
    <path d="M72 178 Q120 160 168 178 L176 252 Q120 274 64 252Z" :fill="SKIN" :stroke="SKIN_DARK" stroke-width="2" />
    <g v-html="render('outfit')" />
    <g v-html="render('shoes')" />
    <!-- head -->
    <g>
      <circle cx="56" cy="122" r="15" :fill="SKIN" :stroke="SKIN_DARK" stroke-width="2" />
      <circle cx="184" cy="122" r="15" :fill="SKIN" :stroke="SKIN_DARK" stroke-width="2" />
      <circle cx="56" cy="122" r="7" fill="#FFB9A6" opacity=".7" />
      <circle cx="184" cy="122" r="7" fill="#FFB9A6" opacity=".7" />
      <circle cx="120" cy="115" r="64" :fill="SKIN" :stroke="SKIN_DARK" stroke-width="2" />
      <path d="M104 56 Q112 36 124 50 Q130 38 138 54" stroke="#C9926B" stroke-width="6" fill="none" stroke-linecap="round" />
      <template v-if="!eyesClosed">
        <ellipse cx="96" cy="118" rx="8" ry="10" fill="#4a3340" />
        <ellipse cx="144" cy="118" rx="8" ry="10" fill="#4a3340" />
        <circle cx="99" cy="114" r="3" fill="#fff" />
        <circle cx="147" cy="114" r="3" fill="#fff" />
      </template>
      <template v-else>
        <path d="M86 120 Q96 110 106 120" stroke="#4a3340" stroke-width="4" fill="none" stroke-linecap="round" />
        <path d="M134 120 Q144 110 154 120" stroke="#4a3340" stroke-width="4" fill="none" stroke-linecap="round" />
      </template>
      <path v-if="mood === 'fussy'" d="M88 134 q-3 12 0 16 q4 -4 0 -16z" fill="#8DC8F5" />
      <ellipse cx="78" cy="140" rx="12" ry="8" fill="#FFA3B8" opacity=".55" />
      <ellipse cx="162" cy="140" rx="12" ry="8" fill="#FFA3B8" opacity=".55" />
      <path :d="mouth" stroke="#B5546F" stroke-width="4" :fill="mouthFilled ? '#B5546F' : 'none'" stroke-linecap="round" stroke-linejoin="round" />
      <ellipse cx="120" cy="131" rx="3.5" ry="2.5" fill="#E9A28C" />
    </g>
    <g v-html="render('hat')" />
    <g v-html="render('acc', 'front')" />
    <text v-if="mood === 'sleeping' || mood === 'sleepy'" x="176" y="60" font-size="26" font-weight="900" fill="#8E7CC3" font-family="sans-serif">z<tspan font-size="20" dx="3" dy="-12">z</tspan><tspan font-size="15" dx="3" dy="-10">z</tspan></text>
  </svg>
</template>
