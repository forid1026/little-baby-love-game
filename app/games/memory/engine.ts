// Pure Memory Puzzle rules – no Vue, no DOM, so they are easy to test.
import { DIFFICULTIES, themeById, type Difficulty } from '~/data/memory'
import { shuffle } from '~/utils/misc'

export interface Card { uid: number; pairId: number; face: string; flipped: boolean; matched: boolean }

export function buildDeck(themeId: string, difficulty: Difficulty, rng: () => number = Math.random): Card[] {
  const { pairs } = DIFFICULTIES[difficulty]
  const faces = shuffle(themeById(themeId).faces, rng).slice(0, pairs)
  const cards: Card[] = []
  faces.forEach((face, pairId) => {
    cards.push({ uid: pairId * 2, pairId, face, flipped: false, matched: false })
    cards.push({ uid: pairId * 2 + 1, pairId, face, flipped: false, matched: false })
  })
  // Fresh random order every game.
  return shuffle(cards, rng).map((c, i) => ({ ...c, uid: i }))
}

export const isMatch = (a: Card, b: Card) => a.uid !== b.uid && a.pairId === b.pairId
export const isComplete = (cards: Card[]) => cards.every(c => c.matched)

/** Higher is better. Perfect play (pairs moves, fast) scores most. */
export function scoreFor(pairs: number, moves: number, seconds: number): number {
  const base = pairs * 100
  const moveBonus = Math.max(0, pairs * 3 - moves) * 10
  const timeBonus = Math.max(0, pairs * 12 - seconds) * 5
  return base + moveBonus + timeBonus
}

/** 1-3 stars based on efficiency. */
export function ratingFor(pairs: number, moves: number): 1 | 2 | 3 {
  if (moves <= Math.ceil(pairs * 1.6)) return 3
  if (moves <= Math.ceil(pairs * 2.4)) return 2
  return 1
}

export function rewardFor(difficulty: Difficulty, pairs: number, moves: number) {
  const d = DIFFICULTIES[difficulty]
  const rating = ratingFor(pairs, moves)
  return { rating, coins: d.coins + (rating === 3 ? d.bonus : 0), stars: rating === 3 ? 2 : rating === 2 ? 1 : 0 }
}
