import type { Slot, SavedOutfit } from '~/types'
import { DRESS_ITEMS, itemsForSlot, dressItemById } from '~/data/dress'
import { DRESS_COLORS } from '~/data/dress'
import { pick, uid } from '~/utils/misc'

export const SLOTS: Slot[] = ['outfit', 'hat', 'shoes', 'acc']

export function useDressUp() {
  const dress = useModule('dress')
  const coinsApi = useCoins()
  const game = useModule('game')
  const { play, haptic } = useSound()
  const toast = useToast()

  function equip(slot: Slot, id: string | null) {
    if (id === null) delete dress.value.equipped[slot]
    else {
      const item = dressItemById(id)
      if (!item || !coinsApi.isUnlocked(id)) return false
      dress.value.equipped[slot] = id
    }
    play('place'); haptic(8)
    return true
  }
  const colorFor = (slot: Slot) => {
    const id = dress.value.equipped[slot]
    return dress.value.colors[slot] ?? (id ? dressItemById(id)?.color : undefined)
  }
  function setColor(slot: Slot, color: string) { dress.value.colors[slot] = color; play('click') }
  /** Equip an item and reset to its own default colour. */
  function choose(slot: Slot, id: string) {
    if (equip(slot, id)) delete dress.value.colors[slot]
  }
  function buy(id: string) {
    const item = dressItemById(id)
    if (!item) return false
    if (coinsApi.buy(id, item.price)) { play('reward'); toast.show(`Unlocked ${item.name}!`); return true }
    play('error'); toast.show(`You need ${item.price - coinsApi.coins.value} more coins`, 'warn')
    return false
  }

  function random() {
    const next: SavedOutfit['equipped'] = {}
    const colors: SavedOutfit['colors'] = {}
    for (const slot of SLOTS) {
      const owned = itemsForSlot(slot).filter(i => coinsApi.isUnlocked(i.id))
      if (!owned.length) continue
      if (slot === 'outfit' || slot === 'shoes' || Math.random() < 0.75) {
        const it = pick(owned)
        next[slot] = it.id
        if (Math.random() < 0.6) colors[slot] = pick(DRESS_COLORS)
      }
    }
    dress.value.equipped = next
    dress.value.colors = colors
    game.value.stats.randomOutfits++
    play('reward'); haptic(15)
  }

  function clearAll() { dress.value.equipped = {}; dress.value.colors = {}; play('click') }

  function saveFavorite(name: string) {
    const n = name.trim().slice(0, 28) || `Outfit ${dress.value.favorites.length + 1}`
    dress.value.favorites.unshift({ id: uid('fav'), name: n, equipped: { ...dress.value.equipped }, colors: { ...dress.value.colors } })
    play('reward')
    toast.show('Saved to your favourites ♥')
  }
  function applyFavorite(f: SavedOutfit) {
    // Items may not be owned any more after a restore; only apply owned ones.
    const eq: SavedOutfit['equipped'] = {}
    for (const slot of SLOTS) { const id = f.equipped[slot]; if (id && coinsApi.isUnlocked(id)) eq[slot] = id }
    dress.value.equipped = eq
    dress.value.colors = { ...f.colors }
    play('place')
  }
  function deleteFavorite(id: string) { dress.value.favorites = dress.value.favorites.filter(f => f.id !== id) }

  const ownedCount = computed(() => DRESS_ITEMS.filter(i => coinsApi.isUnlocked(i.id)).length)
  return { dress, equip, choose, colorFor, setColor, buy, random, clearAll, saveFavorite, applyFavorite, deleteFavorite, ownedCount, isUnlocked: coinsApi.isUnlocked }
}
