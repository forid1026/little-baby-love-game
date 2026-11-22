import { rewardForStreak, SURPRISE_COINS, type DayReward } from '~/data/rewards'
import { effectiveToday, daysBetween, localDateKey } from '~/utils/date'
import { pick } from '~/utils/misc'

export interface RewardPopup {
  kind: 'reward' | 'achievement' | 'level'
  title: string
  subtitle?: string
  icon?: string
  coins?: number
  stars?: number
  unlocks?: string[]
}

export function useRewardModal() {
  const queue = useState<RewardPopup[]>('reward-queue', () => [])
  const current = computed(() => queue.value[0] ?? null)
  function show(p: RewardPopup) { queue.value.push(p) }
  function dismiss() { queue.value.shift() }
  return { current, show, dismiss }
}

export function useRewards() {
  const game = useModule('game')
  const { addCoins, addStars, unlock } = useCoins()
  const modal = useRewardModal()
  const { play, haptic } = useSound()

  const today = computed(() => effectiveToday(game.value.rewards.lastSeenDate))
  const claimedToday = computed(() => game.value.rewards.lastClaimDate === today.value)

  /** Streak that would be shown right now (broken streaks read as 0 until claimed again). */
  const liveStreak = computed(() => {
    const r = game.value.rewards
    if (!r.lastClaimDate) return 0
    const gap = daysBetween(r.lastClaimDate, today.value)
    return gap <= 1 ? r.streak : 0
  })
  const nextStreak = computed(() => (claimedToday.value ? liveStreak.value : liveStreak.value + 1))
  const todaysReward = computed<DayReward>(() => rewardForStreak(claimedToday.value ? liveStreak.value : nextStreak.value))
  /** Day (1-7) in the weekly cycle that is currently "today". */
  const cycleDay = computed(() => ((Math.max(1, claimedToday.value ? liveStreak.value : nextStreak.value) - 1) % 7) + 1)

  /** Remember the latest calendar day we have seen (defends against clock rollbacks). */
  function touchToday() {
    const t = localDateKey()
    const r = game.value.rewards
    if (!r.lastSeenDate || t > r.lastSeenDate) r.lastSeenDate = t
  }

  function claim(): { reward: DayReward; bonus: number } | null {
    touchToday()
    const r = game.value.rewards
    const t = effectiveToday(r.lastSeenDate)
    if (r.lastClaimDate === t) return null // duplicate claim guard
    const gap = r.lastClaimDate ? daysBetween(r.lastClaimDate, t) : null
    r.streak = gap === 1 ? r.streak + 1 : 1
    r.bestStreak = Math.max(r.bestStreak, r.streak)
    r.lastClaimDate = t
    r.lastSeenDate = t
    r.totalClaims++
    const reward = rewardForStreak(r.streak)
    const bonus = pick(SURPRISE_COINS)
    addCoins(reward.coins + bonus)
    addStars(reward.stars)
    if (reward.unlock) unlock(reward.unlock)
    play('reward')
    haptic(30)
    modal.show({
      kind: 'reward', title: `Day ${((r.streak - 1) % 7) + 1} reward!`,
      subtitle: reward.unlock ? 'A very special golden teddy joins your collection!' : `Includes a surprise gift of ${bonus} coins`,
      icon: reward.unlock ? '🧸' : '🎁', coins: reward.coins + bonus, stars: reward.stars, unlocks: reward.unlock ? [reward.unlock] : [],
    })
    return { reward, bonus }
  }

  /** Game finished: pay out coins/stars and show the celebration popup. */
  function awardGame(p: { title: string; subtitle?: string; coins: number; stars?: number; icon?: string }) {
    addCoins(p.coins)
    addStars(p.stars ?? 0)
    play('win')
    haptic(40)
    modal.show({ kind: 'level', title: p.title, subtitle: p.subtitle, icon: p.icon ?? '🎉', coins: p.coins, stars: p.stars })
  }

  return { today, claimedToday, liveStreak, todaysReward, cycleDay, touchToday, claim, awardGame }
}
