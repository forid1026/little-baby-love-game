import type { Modules, ModuleKey, Settings } from '~/types'
import { sampleDaddyMessages } from '~/data/daddy'
import { FREE_DRESS_IDS } from '~/data/dress'

export const SCHEMA_VERSION = 1

export const defaultSettings = (): Settings => ({
  sound: true, music: false, volume: 0.7, vibration: true, motion: 'auto', theme: 'blush',
})

export const moduleDefaults: { [K in ModuleKey]: () => Modules[K] } = {
  game: () => ({
    v: SCHEMA_VERSION,
    coins: 50,
    stars: 0,
    unlocked: [],
    badges: [],
    achievements: {},
    stats: { gamesPlayed: 0, memoryWins: 0, memoryBest: {}, bubbleLevelsCleared: 0, bubbleBestScore: 0, randomOutfits: 0, surprisesOpened: 0, totalCoinsEarned: 0 },
    rewards: { lastClaimDate: null, streak: 0, bestStreak: 0, totalClaims: 0, lastSeenDate: null },
    bubble: { unlockedLevel: 1, bestByLevel: {} },
    welcomed: false,
    mommyName: 'Mommy',
  }),
  room: () => ({
    wall: 'wall_blush',
    floor: 'floor_wood',
    placed: [
      { uid: 'start_crib', id: 'crib_classic', x: 34, y: 70, s: 1 },
      { uid: 'start_window', id: 'window_day', x: 74, y: 30, s: 1 },
      { uid: 'start_rug', id: 'rug_round', x: 52, y: 88, s: 1 },
    ],
  }),
  dress: () => ({
    equipped: { outfit: 'outfit_onesie', shoes: 'shoes_socks' },
    colors: {},
    favorites: [],
  }),
  mommy: () => ({ favorites: [], notes: [], seenIds: [] }),
  daddy: () => ({
    messages: sampleDaddyMessages(),
    pinHash: null,
    pinSalt: null,
    hideEntry: false,
    sampleSeeded: true,
    surprise: { frequency: 'every2', animations: true, lastShownDate: null, recentIds: [] },
  }),
  journey: () => ({ nickname: '', week: null, milestones: [], notes: [], memories: [] }),
}

/** Items that never need unlocking (free from the start). */
export const FREE_ITEM_IDS: string[] = [...FREE_DRESS_IDS]
