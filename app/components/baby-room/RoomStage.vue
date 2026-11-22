<script setup lang="ts">
// The nursery: wall, floor and draggable furniture. Pointer events work for mouse and touch.
import type { PlacedItem } from '~/types'
import { roomItemById, wallById, floorById } from '~/data/room'

const props = defineProps<{ placed: PlacedItem[]; wall: string; floor: string; selectedUid: string | null; interactive: boolean }>()
const emit = defineEmits<{ select: [uid: string | null]; move: [uid: string, x: number, y: number]; dragend: [] }>()

const stage = ref<HTMLElement | null>(null)
const dragging = ref<{ uid: string; dx: number; dy: number } | null>(null)

function toPercent(e: PointerEvent) {
  const r = stage.value!.getBoundingClientRect()
  return { x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 }
}
function down(e: PointerEvent, p: PlacedItem) {
  if (!props.interactive) return
  try { (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId) } catch { /* synthetic/ended pointer */ }
  const pt = toPercent(e)
  dragging.value = { uid: p.uid, dx: pt.x - p.x, dy: pt.y - p.y }
  emit('select', p.uid)
}
function moveEv(e: PointerEvent) {
  const d = dragging.value
  if (!d) return
  const pt = toPercent(e)
  emit('move', d.uid, pt.x - d.dx, pt.y - d.dy)
}
function up() { if (dragging.value) { dragging.value = null; emit('dragend') } }
function key(e: KeyboardEvent, p: PlacedItem) {
  const step = e.shiftKey ? 5 : 2
  const map: Record<string, [number, number]> = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] }
  const m = map[e.key]
  if (m) { e.preventDefault(); emit('move', p.uid, p.x + m[0], p.y + m[1]) }
}
</script>

<template>
  <div ref="stage" class="relative w-full overflow-hidden select-none" style="aspect-ratio: 4 / 5; border-radius: 28px; box-shadow: var(--shadow); touch-action: pan-y"
    role="group" aria-label="Baby room" @pointerdown.self="emit('select', null)">
    <div class="absolute inset-x-0 top-0" style="height: 64%" :style="{ background: wallById(wall).css }" />
    <div class="absolute inset-x-0" style="top: 64%; height: 3%; background: #fff; box-shadow: 0 2px 6px rgba(0,0,0,.08)" />
    <div class="absolute inset-x-0 bottom-0" style="top: 67%" :style="{ background: floorById(floor).css }" />
    <div
      v-for="p in placed" :key="p.uid"
      class="absolute" :class="[interactive ? 'cursor-grab' : '', selectedUid === p.uid && interactive ? 'ring-sel' : '']"
      :style="{ left: p.x + '%', top: p.y + '%', width: (roomItemById(p.id)?.w ?? 15) * p.s + '%', aspectRatio: '1', transform: 'translate(-50%, -50%)', touchAction: interactive ? 'none' : 'auto', zIndex: dragging?.uid === p.uid ? 50 : undefined, filter: 'drop-shadow(0 4px 4px rgba(96,76,89,.18))' }"
      :tabindex="interactive ? 0 : -1" :role="interactive ? 'button' : undefined" :aria-label="roomItemById(p.id)?.name"
      @pointerdown="down($event, p)" @pointermove="moveEv" @pointerup="up" @pointercancel="up" @keydown="key($event, p)"
    >
      <svg viewBox="0 0 100 100" width="100%" height="100%" style="overflow: visible; pointer-events: none" v-html="roomItemById(p.id)?.art" />
    </div>
  </div>
</template>

<style scoped>
.ring-sel { outline: 3px dashed var(--accent); outline-offset: 2px; border-radius: 12px; background: rgba(255, 255, 255, 0.25); }
</style>
