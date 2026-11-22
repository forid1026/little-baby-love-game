import { buildDeck, isMatch, isComplete, scoreFor, rewardFor, type Card } from './engine'
import { DIFFICULTIES, type Difficulty } from '~/data/memory'

export type MemoryPhase = 'setup' | 'playing' | 'won'

export function useMemoryGame() {
  const game = useModule('game')
  const { recordGameStart } = useCoins()
  const rewards = useRewards()
  const { play, haptic } = useSound()

  const theme = ref('animals')
  const difficulty = ref<Difficulty>('easy')
  const cardBack = ref('hearts')
  const phase = ref<MemoryPhase>('setup')
  const paused = ref(false)
  const cards = ref<Card[]>([])
  const moves = ref(0)
  const seconds = ref(0)
  const lock = ref(false)
  const result = ref<{ score: number; coins: number; stars: number; rating: number; best: boolean } | null>(null)

  let open: Card[] = []
  let timer: ReturnType<typeof setInterval> | null = null
  let flipBackTimer: ReturnType<typeof setTimeout> | null = null

  const pairs = computed(() => DIFFICULTIES[difficulty.value].pairs)
  const matchedPairs = computed(() => cards.value.filter(c => c.matched).length / 2)
  const liveScore = computed(() => matchedPairs.value * 100)

  function stopTimer() { if (timer) clearInterval(timer); timer = null }
  function startTimer() {
    stopTimer()
    timer = setInterval(() => { if (!paused.value) seconds.value++ }, 1000)
  }

  function start() {
    if (flipBackTimer) clearTimeout(flipBackTimer)
    cards.value = buildDeck(theme.value, difficulty.value)
    moves.value = 0
    seconds.value = 0
    open = []
    lock.value = false
    paused.value = false
    result.value = null
    phase.value = 'playing'
    recordGameStart()
    startTimer()
    play('click')
  }

  function flip(uid: number) {
    if (phase.value !== 'playing' || paused.value || lock.value) return
    const card = cards.value.find(c => c.uid === uid)
    if (!card || card.flipped || card.matched) return
    card.flipped = true
    open.push(card)
    play('flip'); haptic(8)
    if (open.length < 2) return

    moves.value++
    const [a, b] = open as [Card, Card]
    open = []
    if (isMatch(a, b)) {
      a.matched = b.matched = true
      play('pop')
      if (isComplete(cards.value)) win()
    } else {
      lock.value = true
      flipBackTimer = setTimeout(() => { a.flipped = false; b.flipped = false; lock.value = false }, 800)
    }
  }

  function win() {
    stopTimer()
    const d = difficulty.value
    const score = scoreFor(pairs.value, moves.value, seconds.value)
    const r = rewardFor(d, pairs.value, moves.value)
    const prev = game.value.stats.memoryBest[d]
    const best = !prev || score > prev.score
    if (best) game.value.stats.memoryBest[d] = { moves: moves.value, time: seconds.value, score }
    game.value.stats.memoryWins++
    result.value = { score, coins: r.coins, stars: r.stars, rating: r.rating, best }
    phase.value = 'won'
    setTimeout(() => rewards.awardGame({ title: 'Puzzle complete!', subtitle: `${moves.value} moves · ${r.rating} of 3 stars`, coins: r.coins, stars: r.stars, icon: '🧩' }), 600)
  }

  function togglePause() { if (phase.value === 'playing') paused.value = !paused.value }
  function backToSetup() { stopTimer(); if (flipBackTimer) clearTimeout(flipBackTimer); phase.value = 'setup'; paused.value = false }
  onBeforeUnmount(() => { stopTimer(); if (flipBackTimer) clearTimeout(flipBackTimer) })

  return { theme, difficulty, cardBack, phase, paused, cards, moves, seconds, pairs, matchedPairs, liveScore, result, start, flip, togglePause, backToSetup }
}
