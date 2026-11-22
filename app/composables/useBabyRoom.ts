import { roomItemById, ROOM_ITEMS, WALLS, FLOORS } from '~/data/room'
import { clamp, uid } from '~/utils/misc'

export const MAX_PLACED = 30

/** Baby Room game logic: placing, moving, removing, buying and painting. All state autosaves. */
export function useBabyRoom() {
  const room = useModule('room')
  const coinsApi = useCoins()
  const { play, haptic } = useSound()
  const toast = useToast()

  const selectedUid = ref<string | null>(null)
  const selected = computed(() => room.value.placed.find(p => p.uid === selectedUid.value) ?? null)

  function add(id: string): boolean {
    const item = roomItemById(id)
    if (!item || !coinsApi.isUnlocked(id)) return false
    if (room.value.placed.length >= MAX_PLACED) { toast.show(`The room is full (max ${MAX_PLACED} items)`, 'warn'); play('error'); return false }
    const n = room.value.placed.length
    const p = { uid: uid('p'), id, x: clamp(50 + ((n * 17) % 40) - 20, 12, 88), y: item.y, s: 1 }
    room.value.placed.push(p)
    selectedUid.value = p.uid
    play('place'); haptic(10)
    return true
  }
  function move(uidv: string, x: number, y: number) {
    const p = room.value.placed.find(i => i.uid === uidv)
    if (p) { p.x = clamp(x, 0, 100); p.y = clamp(y, 0, 100) }
  }
  function resize(delta: number) {
    const p = selected.value
    if (p) p.s = clamp(Math.round((p.s + delta) * 100) / 100, 0.5, 2)
  }
  function toFront() {
    const i = room.value.placed.findIndex(p => p.uid === selectedUid.value)
    if (i >= 0) { const [p] = room.value.placed.splice(i, 1); room.value.placed.push(p!) }
  }
  function removeSelected() {
    if (!selectedUid.value) return
    room.value.placed = room.value.placed.filter(p => p.uid !== selectedUid.value)
    selectedUid.value = null
    play('click')
  }
  function buy(id: string, price: number, name: string): boolean {
    if (coinsApi.buy(id, price)) { play('reward'); haptic(20); toast.show(`Unlocked ${name}!`); return true }
    play('error'); toast.show(`You need ${price - coinsApi.coins.value} more coins`, 'warn')
    return false
  }
  function setWall(id: string) { room.value.wall = id; play('place') }
  function setFloor(id: string) { room.value.floor = id; play('place') }
  function reset() {
    room.value.placed = []
    room.value.wall = WALLS[0]!.id
    room.value.floor = FLOORS[0]!.id
    selectedUid.value = null
  }
  const ownedCount = computed(() => ROOM_ITEMS.filter(i => coinsApi.isUnlocked(i.id)).length)
  return { room, selectedUid, selected, add, move, resize, toFront, removeSelected, buy, setWall, setFloor, reset, ownedCount }
}
