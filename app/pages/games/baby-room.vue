<script setup lang="ts">
import { roomItemById, type Paint } from '~/data/room'

definePageMeta({ layout: 'game' })
const api = useBabyRoom()
const { recordGameStart, isUnlocked } = useCoins()
const { play } = useSound()
const goBack = useGoBack('/games')

const preview = ref(false)
const confirmReset = ref(false)
const buying = ref<{ id: string; name: string; price: number; kind: 'item' | 'wall' | 'floor' } | null>(null)
onMounted(recordGameStart)

useBackHandler(preview, () => { preview.value = false; return true })

function askBuy(id: string) {
  const i = roomItemById(id)
  if (i) buying.value = { id, name: i.name, price: i.price, kind: 'item' }
}
function onPaint(kind: 'wall' | 'floor', p: Paint) {
  if (!isUnlocked(p.id)) { buying.value = { id: p.id, name: p.name, price: p.price, kind }; return }
  kind === 'wall' ? api.setWall(p.id) : api.setFloor(p.id)
}
function confirmBuy() {
  const b = buying.value
  if (!b) return
  if (api.buy(b.id, b.price, b.name)) {
    if (b.kind === 'item') api.add(b.id)
    else if (b.kind === 'wall') api.setWall(b.id)
    else api.setFloor(b.id)
  }
  buying.value = null
}
function doReset() { api.reset(); confirmReset.value = false; play('click') }
</script>

<template>
  <div>
    <GameHeader title="Baby Room" subtitle="Drag items to place them" @back="goBack" />

    <RoomStage :placed="api.room.value.placed" :wall="api.room.value.wall" :floor="api.room.value.floor" :selected-uid="api.selectedUid.value" :interactive="!preview"
      @select="api.selectedUid.value = $event" @move="api.move" />

    <div v-if="preview" class="mt-3 text-center">
      <button class="btn btn-primary" @click="preview = false"><Icon name="back" :size="20" /> Back to decorating</button>
    </div>

    <template v-else>
      <div class="flex flex-wrap items-center gap-2 my-3" role="toolbar" aria-label="Item tools">
        <template v-if="api.selected.value">
          <span class="chip text-sm">{{ roomItemById(api.selected.value.id)?.name }}</span>
          <button class="icon-btn" style="width: 44px; height: 44px" aria-label="Make smaller" @click="api.resize(-0.15)"><Icon name="minus" :size="20" /></button>
          <button class="icon-btn" style="width: 44px; height: 44px" aria-label="Make bigger" @click="api.resize(0.15)"><Icon name="plus" :size="20" /></button>
          <button class="icon-btn" style="width: 44px; height: 44px" aria-label="Bring to front" @click="api.toFront"><Icon name="layers" :size="20" /></button>
          <button class="icon-btn" style="width: 44px; height: 44px; color: #C0455B" aria-label="Remove from room" @click="api.removeSelected"><Icon name="trash" :size="20" /></button>
        </template>
        <span v-else class="muted text-sm font-bold">Tap an item in the room to move, resize or remove it.</span>
        <span class="flex-1" />
        <button class="btn btn-soft btn-sm" @click="preview = true"><Icon name="eye" :size="18" /> Preview</button>
        <button class="btn btn-soft btn-sm" @click="confirmReset = true"><Icon name="restart" :size="18" /> Reset</button>
      </div>

      <RoomTray :wall="api.room.value.wall" :floor="api.room.value.floor" :placed-ids="api.room.value.placed.map(p => p.id)" @add="api.add" @buy-item="askBuy" @paint="onPaint" />
    </template>

    <ConfirmDialog :open="confirmReset" title="Reset the room?" message="All furniture will be removed and the room goes back to its first look. Items you unlocked stay yours." confirm-label="Reset room" danger @confirm="doReset" @cancel="confirmReset = false" />
    <ConfirmDialog :open="!!buying" :title="`Unlock ${buying?.name}?`" :message="`This costs ${buying?.price} coins.`" confirm-label="Unlock" @confirm="confirmBuy" @cancel="buying = null" />
  </div>
</template>
