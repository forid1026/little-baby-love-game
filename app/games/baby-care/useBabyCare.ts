import type { CareNeed } from '~/types'
import { ACTIVITIES, NEEDS, applyDecay, clampNeed, moodFor, happiness, type Mood } from './engine'

export function useBabyCare() {
  const care = useModule('care')
  const game = useModule('game')
  const { addCoins, addStars, recordGameStart } = useCoins()
  const rewards = useRewards()
  const toast = useToast()
  const { play, haptic } = useSound()

  const sleeping = ref(false)
  const override = ref<Mood | null>(null)
  let timer: ReturnType<typeof setInterval> | undefined
  let wakeTimer: ReturnType<typeof setTimeout> | undefined
  let moodTimer: ReturnType<typeof setTimeout> | undefined

  function tick() {
    const now = Date.now()
    const elapsed = now - care.value.lastTick
    care.value.lastTick = now
    if (elapsed > 0) care.value.needs = applyDecay(care.value.needs, elapsed, sleeping.value)
  }

  function start() {
    recordGameStart()
    tick()
    timer = setInterval(tick, 20000)
  }
  function stop() { clearInterval(timer); clearTimeout(wakeTimer); clearTimeout(moodTimer) }
  onBeforeUnmount(stop)

  const mood = computed<Mood>(() => override.value ?? moodFor(care.value.needs, sleeping.value))
  const joy = computed(() => happiness(care.value.needs))

  /** Finish an activity: fills the need, pays a few coins and maybe a daily "happy baby" bonus. */
  function complete(need: CareNeed) {
    const a = ACTIVITIES[need]
    tick()
    const before = care.value.needs[need]
    care.value.needs[need] = clampNeed(before + a.gain)
    care.value.counts[need]++
    care.value.total++
    // Tiny reward when the baby really needed it; a smaller one otherwise so spamming does not pay.
    const coins = before < 70 ? a.coins : 2
    addCoins(coins)
    play('reward'); haptic(20)
    toast.show(`+${coins} 🪙 Baby feels better!`)

    if (need === 'sleep') {
      sleeping.value = true
      clearTimeout(wakeTimer)
      wakeTimer = setTimeout(() => { sleeping.value = false; tick() }, 6000)
    } else {
      override.value = need === 'fun' ? 'giggle' : 'happy'
      clearTimeout(moodTimer)
      moodTimer = setTimeout(() => { override.value = null }, 3000)
    }

    const today = effectiveToday(game.value.rewards.lastSeenDate)
    if (care.value.lastBonusDate !== today && NEEDS.every(k => care.value.needs[k] >= 75)) {
      care.value.lastBonusDate = today
      addStars(0)
      setTimeout(() => rewards.awardGame({ title: 'A perfectly happy baby!', subtitle: 'Every need is full today. What a wonderful Mommy!', coins: 25, stars: 1, icon: '👶' }), 900)
    }
  }

  return { care, mood, joy, sleeping, start, stop, complete, tick }
}
