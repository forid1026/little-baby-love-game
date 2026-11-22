// Pure rules for Baby Care Day. Needs fall slowly (never to zero) so there is no pressure.
import type { CareNeed } from '~/types'

export const NEEDS: CareNeed[] = ['hunger', 'clean', 'diaper', 'sleep', 'fun']
export const FLOOR = 15 // needs never fall below this
const MAX_AWAY_MINUTES = 150 // time away is capped so a long break is never punished
/** Points lost per minute. */
export const DECAY: Record<CareNeed, number> = { hunger: 0.3, clean: 0.15, diaper: 0.22, sleep: 0.18, fun: 0.2 }

export type Needs = Record<CareNeed, number>
export type Mood = 'happy' | 'hungry' | 'sleepy' | 'fussy' | 'sleeping' | 'giggle'

export const clampNeed = (n: number) => Math.max(FLOOR, Math.min(100, Math.round(n * 10) / 10))

export function applyDecay(needs: Needs, elapsedMs: number, sleeping = false): Needs {
  const minutes = Math.min(Math.max(elapsedMs, 0) / 60000, MAX_AWAY_MINUTES)
  const out = { ...needs }
  for (const k of NEEDS) out[k] = clampNeed(needs[k] - DECAY[k] * minutes * (sleeping && k === 'sleep' ? -4 : 1))
  return out
}

export function moodFor(needs: Needs, sleeping: boolean): Mood {
  if (sleeping) return 'sleeping'
  const lowest = NEEDS.reduce((a, b) => (needs[b] < needs[a] ? b : a))
  if (needs[lowest] >= 40) return 'happy'
  return ({ hunger: 'hungry', sleep: 'sleepy', clean: 'fussy', diaper: 'fussy', fun: 'fussy' } as const)[lowest]
}

export const MOOD_TEXT: Record<Mood, string> = {
  happy: 'Happy and cozy 💕', hungry: 'Tummy is rumbling… a bottle, please!', sleepy: 'So sleepy… maybe a lullaby?',
  fussy: 'A little fussy. A cuddle and some care will help.', sleeping: 'Shhh… sweet dreams 🌙', giggle: 'Hee hee hee! 😄',
}

export const happiness = (needs: Needs) => Math.round(NEEDS.reduce((s, k) => s + needs[k], 0) / NEEDS.length)

export interface Step { emoji: string; label: string }
export interface Activity { need: CareNeed; title: string; intro: string; gain: number; coins: number; steps: Step[] }

export const ACTIVITIES: Record<CareNeed, Activity> = {
  hunger: {
    need: 'hunger', title: 'Feeding time', intro: 'Tap the bottle to give little sips.', gain: 45, coins: 6,
    steps: [{ emoji: '🍼', label: 'Warm the bottle' }, { emoji: '🍼', label: 'Little sip' }, { emoji: '🍼', label: 'Another sip' }, { emoji: '🍼', label: 'One more sip' }, { emoji: '🍼', label: 'Last drops' }, { emoji: '🤱', label: 'Gentle burp pat' }],
  },
  diaper: {
    need: 'diaper', title: 'Diaper change', intro: 'Follow the steps one by one.', gain: 55, coins: 6,
    steps: [{ emoji: '🩲', label: 'Open the diaper' }, { emoji: '🧻', label: 'Wipe gently' }, { emoji: '🧴', label: 'Add a little cream' }, { emoji: '✨', label: 'Put on a fresh diaper' }],
  },
  clean: {
    need: 'clean', title: 'Bath time', intro: 'Tap the bubbles to wash the baby.', gain: 55, coins: 7,
    steps: [{ emoji: '🛁', label: 'Fill the tub' }, { emoji: '🫧', label: 'Soapy bubbles' }, { emoji: '🫧', label: 'Wash the tummy' }, { emoji: '🫧', label: 'Wash the toes' }, { emoji: '🚿', label: 'Rinse gently' }, { emoji: '🧺', label: 'Wrap in a soft towel' }],
  },
  sleep: {
    need: 'sleep', title: 'Sleepy time', intro: 'Rock and sing a lullaby.', gain: 60, coins: 7,
    steps: [{ emoji: '🌙', label: 'Dim the light' }, { emoji: '🎵', label: 'Hum a lullaby' }, { emoji: '🤱', label: 'Rock gently' }, { emoji: '🎵', label: 'Hum softly' }, { emoji: '🤱', label: 'Rock slowly' }, { emoji: '😴', label: 'Tuck in with a kiss' }],
  },
  fun: {
    need: 'fun', title: 'Playtime', intro: 'Tap the toys to make the baby giggle.', gain: 45, coins: 5,
    steps: [{ emoji: '🧸', label: 'Wave the teddy' }, { emoji: '🎈', label: 'Float the balloon' }, { emoji: '🪀', label: 'Shake the rattle' }, { emoji: '🎶', label: 'Sing a silly song' }, { emoji: '🙈', label: 'Peek-a-boo!' }],
  },
}
