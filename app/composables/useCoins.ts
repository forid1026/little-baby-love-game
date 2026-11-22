import { ROOM_ITEMS, WALLS, FLOORS } from '~/data/room'
import { DRESS_ITEMS } from '~/data/dress'

const FREE = new Set<string>([
  ...ROOM_ITEMS.filter(i => i.price === 0).map(i => i.id),
  ...DRESS_ITEMS.filter(i => i.price === 0).map(i => i.id),
  ...WALLS.filter(i => i.price === 0).map(i => i.id),
  ...FLOORS.filter(i => i.price === 0).map(i => i.id),
])

/** Coins, stars and unlocks – the single place where balances change. */
export function useCoins() {
  const game = useModule('game')
  const coins = computed(() => game.value.coins)
  const stars = computed(() => game.value.stars)

  function addCoins(n: number) {
    if (n <= 0) return
    game.value.coins += Math.round(n)
    game.value.stats.totalCoinsEarned += Math.round(n)
  }
  function addStars(n: number) {
    if (n > 0) game.value.stars += Math.round(n)
  }
  function spend(n: number): boolean {
    if (n < 0 || game.value.coins < n) return false
    game.value.coins -= n
    return true
  }
  const isUnlocked = (id: string) => FREE.has(id) || game.value.unlocked.includes(id)
  function unlock(id: string) {
    if (!isUnlocked(id)) game.value.unlocked.push(id)
  }
  /** Spend coins to unlock; returns false when the player cannot afford it. */
  function buy(id: string, price: number): boolean {
    if (isUnlocked(id)) return true
    if (!spend(price)) return false
    unlock(id)
    return true
  }
  function recordGameStart() { game.value.stats.gamesPlayed++ }

  return { coins, stars, addCoins, addStars, spend, isUnlocked, unlock, buy, recordGameStart }
}
