export interface DayReward { day: number; coins: number; stars: number; unlock?: string; label: string }

export const WEEK_REWARDS: DayReward[] = [
  { day: 1, coins: 20, stars: 1, label: '20 coins' },
  { day: 2, coins: 30, stars: 1, label: '30 coins' },
  { day: 3, coins: 40, stars: 1, label: '40 coins' },
  { day: 4, coins: 50, stars: 1, label: '50 coins' },
  { day: 5, coins: 75, stars: 2, label: '75 coins' },
  { day: 6, coins: 100, stars: 2, label: '100 coins' },
  { day: 7, coins: 100, stars: 3, unlock: 'teddy_golden', label: 'Golden Teddy!' },
]

export function rewardForStreak(streak: number): DayReward {
  const idx = ((Math.max(1, streak) - 1) % 7)
  return WEEK_REWARDS[idx]!
}

/** Small random "daily surprise" gift on top of the streak reward. */
export const SURPRISE_COINS = [5, 8, 10, 12, 15, 20]
