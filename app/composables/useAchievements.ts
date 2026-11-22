import { ROOM_COMPLETE_REQUIREMENTS } from '~/data/room'

export interface AchievementDef {
  id: string
  title: string
  desc: string
  icon: string
  target: number
  coins: number
  stars: number
  unlock?: string
  progress: () => number
}

export function useAchievements() {
  const game = useModule('game')
  const room = useModule('room')
  const dress = useModule('dress')
  const mommy = useModule('mommy')
  const daddy = useModule('daddy')
  const care = useModule('care')
  const { addCoins, addStars, unlock } = useCoins()
  const modal = useRewardModal()
  const { play } = useSound()

  const roomRequirementsMet = () => {
    const ids = new Set(room.value.placed.map(p => p.id))
    return ROOM_COMPLETE_REQUIREMENTS.filter(r => r.ids.some(i => ids.has(i))).length
  }

  const defs: AchievementDef[] = [
    { id: 'first_game', title: 'First Game Played', desc: 'Play any game for the very first time.', icon: '🎮', target: 1, coins: 20, stars: 1, progress: () => game.value.stats.gamesPlayed },
    { id: 'first_puzzle', title: 'First Puzzle Completed', desc: 'Finish a Memory Puzzle.', icon: '🧩', target: 1, coins: 25, stars: 1, progress: () => game.value.stats.memoryWins },
    { id: 'bubble_master', title: 'Bubble Master', desc: 'Clear 5 Bubble Pop levels.', icon: '🫧', target: 5, coins: 60, stars: 3, progress: () => game.value.stats.bubbleLevelsCleared },
    { id: 'room_designer', title: 'Room Designer', desc: 'Place 10 items in the Baby Room.', icon: '🛏️', target: 10, coins: 40, stars: 2, unlock: 'rug_star', progress: () => room.value.placed.length },
    { id: 'fashion_lover', title: 'Fashion Lover', desc: 'Save 3 favourite outfits.', icon: '👗', target: 3, coins: 40, stars: 2, unlock: 'hat_crown', progress: () => dress.value.favorites.length },
    { id: 'seven_days', title: 'Seven Days Together', desc: 'Claim your daily reward 7 days in a row.', icon: '📅', target: 7, coins: 100, stars: 3, progress: () => game.value.rewards.bestStreak },
    { id: 'message_collector', title: 'Message Collector', desc: "Favourite 10 of Mommy's Love Notes.", icon: '💌', target: 10, coins: 40, stars: 2, progress: () => mommy.value.favorites.length },
    { id: 'baby_room_complete', title: 'Baby Room Completed', desc: 'Add a crib, lamp, rug, curtains, window, cuddly toy and wall decoration.', icon: '🏠', target: ROOM_COMPLETE_REQUIREMENTS.length, coins: 80, stars: 3, unlock: 'crib_cloud', progress: roomRequirementsMet },
    { id: 'daddy_love', title: "Daddy's Love", desc: "Open 5 of Daddy's Secret Messages.", icon: '💝', target: 5, coins: 50, stars: 2, progress: () => daddy.value.messages.filter(m => m.seenAt).length },
    { id: 'baby_carer', title: 'Caring Mommy', desc: 'Complete 20 Baby Care activities.', icon: '🍼', target: 20, coins: 40, stars: 2, unlock: 'hat_bear', progress: () => care.value.total },
    { id: 'coin_collector', title: 'Coin Collector', desc: 'Earn 500 coins in total.', icon: '🪙', target: 500, coins: 50, stars: 2, progress: () => game.value.stats.totalCoinsEarned },
  ]

  const list = computed(() => defs.map((d) => {
    const current = Math.min(d.progress(), d.target)
    const at = game.value.achievements[d.id]
    return { def: d, current, done: !!at, at }
  }))
  const unlockedCount = computed(() => list.value.filter(a => a.done).length)

  function evaluate() {
    for (const d of defs) {
      if (game.value.achievements[d.id]) continue
      if (d.progress() >= d.target) {
        game.value.achievements[d.id] = new Date().toISOString()
        addCoins(d.coins)
        addStars(d.stars)
        if (d.unlock) unlock(d.unlock)
        play('celebrate')
        modal.show({ kind: 'achievement', title: d.title, subtitle: d.desc, icon: d.icon, coins: d.coins, stars: d.stars, unlocks: d.unlock ? [d.unlock] : [] })
      }
    }
  }

  return { defs, list, unlockedCount, evaluate }
}
