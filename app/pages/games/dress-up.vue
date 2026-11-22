<script setup lang="ts">
import type { Slot } from '~/types'
import { itemsForSlot, SLOT_LABEL, SLOT_VIEWBOX, DRESS_COLORS, DRESS_ITEMS, type DressItem } from '~/data/dress'
import { darken } from '~/utils/misc'

import { useDressUp } from '~/games/dress-up/useDressUp'

definePageMeta({ layout: 'game' })
const d = useDressUp()
const { recordGameStart } = useCoins()
const goBack = useGoBack('/games')
onMounted(recordGameStart)

const slot = ref<Slot>('outfit')
const items = computed(() => itemsForSlot(slot.value))
const equippedId = computed(() => d.dress.value.equipped[slot.value])
const buying = ref<DressItem | null>(null)
const saving = ref(false)
const favName = ref('')
const showFavs = ref(false)

function thumb(i: DressItem) { const c = i.color; return i.art(c, darken(c, 0.22)) }
function pickItem(i: DressItem) {
  if (!d.isUnlocked(i.id)) { buying.value = i; return }
  equippedId.value === i.id && slot.value !== 'outfit' ? d.equip(slot.value, null) : d.choose(slot.value, i.id)
}
function confirmBuy() { const i = buying.value; if (i && d.buy(i.id)) d.choose(i.slot, i.id); buying.value = null }
function openSave() { favName.value = ''; saving.value = true }
function doSave() { d.saveFavorite(favName.value); saving.value = false }
</script>

<template>
  <div>
    <GameHeader title="Dress Up My Baby" :subtitle="`${d.ownedCount.value} of ${DRESS_ITEMS.length} items unlocked`" @back="goBack" />

    <div class="relative card mx-auto mb-3 overflow-hidden" style="background: linear-gradient(#FFE9F1, #E8F2FF); max-width: 330px">
      <FloatingHearts :count="5" />
      <div class="px-8 pt-4 pb-2"><BabyAvatar :equipped="d.dress.value.equipped" :colors="d.dress.value.colors" bounce /></div>
    </div>

    <div class="flex flex-wrap gap-2 justify-center mb-3">
      <button class="btn btn-primary btn-sm" @click="d.random()"><Icon name="shuffle" :size="18" /> Random</button>
      <button class="btn btn-soft btn-sm" @click="openSave"><Icon name="heart" :size="18" /> Save outfit</button>
      <button class="btn btn-soft btn-sm" @click="showFavs = true"><Icon name="layers" :size="18" /> Favourites ({{ d.dress.value.favorites.length }})</button>
      <button class="btn btn-soft btn-sm" @click="d.clearAll()"><Icon name="restart" :size="18" /> Clear</button>
    </div>

    <section class="card p-3" aria-label="Wardrobe">
      <div class="seg mb-3" role="tablist">
        <button v-for="s in (['outfit', 'hat', 'shoes', 'acc'] as Slot[])" :key="s" role="tab" :aria-pressed="slot === s" style="font-size: .8rem" @click="slot = s">{{ SLOT_LABEL[s] }}</button>
      </div>

      <div class="grid grid-cols-4 gap-2" style="max-height: 250px; overflow-y: auto">
        <button v-if="slot !== 'outfit'" class="rounded-2xl border-0 p-1 font-extrabold text-xs" style="background: #FFF8EF; min-height: 84px" :style="!equippedId ? 'outline:3px solid var(--accent)' : ''" @click="d.equip(slot, null)">
          <span class="block text-2xl mt-2">🚫</span>None
        </button>
        <button v-for="i in items" :key="i.id" class="relative rounded-2xl border-0 p-1 text-center" style="background: #FFF8EF; min-height: 84px"
          :style="equippedId === i.id ? 'outline:3px solid var(--accent)' : ''" :aria-label="d.isUnlocked(i.id) ? i.name : `${i.name}, locked, ${i.price} coins`" :aria-pressed="equippedId === i.id" @click="pickItem(i)">
          <svg :viewBox="SLOT_VIEWBOX[i.slot]" width="100%" height="52" preserveAspectRatio="xMidYMid meet" :style="d.isUnlocked(i.id) ? '' : 'opacity:.5;filter:grayscale(.5)'" v-html="thumb(i)" />
          <span class="block text-xs font-extrabold" style="line-height: 1.05">{{ i.name }}</span>
          <span v-if="!d.isUnlocked(i.id)" class="text-xs font-extrabold" style="color: #C98A00">🔒 {{ i.price }}</span>
        </button>
      </div>

      <div v-if="equippedId" class="mt-3">
        <p class="label" style="margin-top: 0">Colour</p>
        <div class="flex flex-wrap gap-2">
          <button v-for="c in DRESS_COLORS" :key="c" class="h-9 w-9 rounded-full border-0" :aria-label="`Colour ${c}`" :aria-pressed="d.colorFor(slot) === c"
            :style="{ background: c, boxShadow: d.colorFor(slot) === c ? '0 0 0 3px #fff, 0 0 0 6px var(--accent)' : '0 0 0 2px #fff', border: '1px solid #0001' }" @click="d.setColor(slot, c)" />
        </div>
      </div>
    </section>

    <ConfirmDialog :open="!!buying" :title="`Unlock ${buying?.name}?`" :message="`This costs ${buying?.price} coins.`" confirm-label="Unlock" @confirm="confirmBuy" @cancel="buying = null" />

    <ModalSheet :open="saving" title="Save this outfit" @close="saving = false">
      <label class="label" for="fn" style="margin-top: 0">Give it a name</label>
      <input id="fn" v-model="favName" class="field" maxlength="28" placeholder="Sunday best" @keyup.enter="doSave">
      <button class="btn btn-primary w-full mt-4" @click="doSave"><Icon name="heart" :size="18" /> Save to favourites</button>
    </ModalSheet>

    <ModalSheet :open="showFavs" title="Favourite outfits" wide @close="showFavs = false">
      <EmptyState v-if="!d.dress.value.favorites.length" title="No favourites yet" text="Dress your baby, then tap “Save outfit”." icon="👗" />
      <ul v-else class="m-0 list-none p-0 flex flex-col gap-3">
        <li v-for="f in d.dress.value.favorites" :key="f.id" class="flex items-center gap-3 rounded-2xl p-2" style="background: #FFF8EF">
          <div class="w-16 shrink-0"><BabyAvatar :equipped="f.equipped" :colors="f.colors" /></div>
          <p class="flex-1 font-extrabold min-w-0 truncate">{{ f.name }}</p>
          <button class="btn btn-primary btn-sm" @click="d.applyFavorite(f); showFavs = false">Wear</button>
          <button class="icon-btn" style="width: 40px; height: 40px; color: #C0455B" :aria-label="`Delete ${f.name}`" @click="d.deleteFavorite(f.id)"><Icon name="trash" :size="18" /></button>
        </li>
      </ul>
    </ModalSheet>
  </div>
</template>
