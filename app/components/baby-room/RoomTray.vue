<script setup lang="ts">
import { ROOM_ITEMS, ROOM_CATS, WALLS, FLOORS, type RoomCat, type Paint } from '~/data/room'

const props = defineProps<{ wall: string; floor: string; placedIds: string[] }>()
const emit = defineEmits<{ add: [id: string]; buyItem: [id: string]; paint: [kind: 'wall' | 'floor', p: Paint] }>()
const { isUnlocked } = useCoins()

const tab = ref<RoomCat | 'paint'>('furniture')
const tabs = [...ROOM_CATS, { id: 'paint' as const, label: 'Paint' }]
const items = computed(() => ROOM_ITEMS.filter(i => i.cat === tab.value && i.price !== -1))
const count = (id: string) => props.placedIds.filter(i => i === id).length
</script>

<template>
  <section class="card p-3" aria-label="Decoration shop">
    <div class="flex gap-2 overflow-x-auto pb-2" role="tablist" style="scrollbar-width: none">
      <button v-for="t in tabs" :key="t.id" role="tab" :aria-selected="tab === t.id" class="chip shrink-0"
        :style="tab === t.id ? 'background:var(--accent);color:#fff' : ''" @click="tab = t.id">{{ t.label }}</button>
    </div>

    <div v-if="tab !== 'paint'" class="grid grid-cols-3 gap-2" style="max-height: 230px; overflow-y: auto">
      <button v-for="i in items" :key="i.id" class="relative rounded-2xl border-0 p-2 text-center" style="background: #FFF8EF; min-height: 96px"
        :aria-label="isUnlocked(i.id) ? `Add ${i.name}` : `Unlock ${i.name} for ${i.price} coins`"
        @click="isUnlocked(i.id) ? emit('add', i.id) : emit('buyItem', i.id)">
        <svg viewBox="0 0 100 100" class="mx-auto" width="54" height="54" :style="isUnlocked(i.id) ? '' : 'opacity:.55;filter:grayscale(.4)'" v-html="i.art" />
        <span class="block text-xs font-extrabold" style="line-height: 1.1">{{ i.name }}</span>
        <span v-if="!isUnlocked(i.id)" class="text-xs font-extrabold" style="color: #C98A00">🔒 {{ i.price }} 🪙</span>
        <span v-else-if="count(i.id)" class="absolute top-1 right-1 rounded-full bg-white px-1.5 text-xs font-black" style="color: var(--accent-dark)">×{{ count(i.id) }}</span>
      </button>
    </div>

    <div v-else style="max-height: 230px; overflow-y: auto">
      <p class="label">Wall</p>
      <div class="grid grid-cols-4 gap-2">
        <button v-for="w in WALLS" :key="w.id" class="rounded-2xl border-0 p-1 text-xs font-extrabold" :style="{ background: '#FFF8EF', outline: wall === w.id ? '3px solid var(--accent)' : 'none' }" :aria-label="`${w.name} wall`" @click="emit('paint', 'wall', w)">
          <span class="block h-9 rounded-xl" :style="{ background: w.css }" />
          <span class="block mt-1" style="font-size: .65rem; line-height: 1">{{ w.name }}</span>
          <span style="font-size: .65rem; color: #C98A00">{{ isUnlocked(w.id) ? '' : `🔒 ${w.price}` }}</span>
        </button>
      </div>
      <p class="label">Floor</p>
      <div class="grid grid-cols-4 gap-2">
        <button v-for="f in FLOORS" :key="f.id" class="rounded-2xl border-0 p-1 text-xs font-extrabold" :style="{ background: '#FFF8EF', outline: floor === f.id ? '3px solid var(--accent)' : 'none' }" :aria-label="`${f.name} floor`" @click="emit('paint', 'floor', f)">
          <span class="block h-9 rounded-xl" :style="{ background: f.css }" />
          <span class="block mt-1" style="font-size: .65rem; line-height: 1">{{ f.name }}</span>
          <span style="font-size: .65rem; color: #C98A00">{{ isUnlocked(f.id) ? '' : `🔒 ${f.price}` }}</span>
        </button>
      </div>
    </div>
  </section>
</template>
