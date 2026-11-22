export type Slot = 'outfit' | 'hat' | 'shoes' | 'acc'

export interface PlacedItem { uid: string; id: string; x: number; y: number; s: number }
export interface RoomState { wall: string; floor: string; placed: PlacedItem[] }

export interface SavedOutfit {
  id: string
  name: string
  equipped: Partial<Record<Slot, string>>
  colors: Partial<Record<Slot, string>>
}
export interface DressState {
  equipped: Partial<Record<Slot, string>>
  colors: Partial<Record<Slot, string>>
  favorites: SavedOutfit[]
}

export interface GameStats {
  gamesPlayed: number
  memoryWins: number
  memoryBest: Record<string, { moves: number; time: number; score: number }>
  bubbleLevelsCleared: number
  bubbleBestScore: number
  randomOutfits: number
  surprisesOpened: number
  totalCoinsEarned: number
}

export interface GameState {
  v: number
  coins: number
  stars: number
  unlocked: string[]
  badges: string[]
  achievements: Record<string, string> // id -> ISO date unlocked
  stats: GameStats
  rewards: { lastClaimDate: string | null; streak: number; bestStreak: number; totalClaims: number; lastSeenDate: string | null }
  bubble: { unlockedLevel: number; bestByLevel: Record<number, number> }
  welcomed: boolean
  mommyName: string
}

export interface PersonalNote { id: string; text: string; date: string }
export interface MommyState {
  favorites: string[]
  notes: PersonalNote[]
  seenIds: string[]
}

export type DaddyFrequency = 'daily' | 'every2' | 'weekly' | 'off'
export type DaddyMode = 'daily' | 'date' | 'manual'
export type DaddyCategory = 'love' | 'encouragement' | 'baby' | 'memory' | 'funny' | 'other'
export interface DaddyMessage {
  id: string
  title: string
  body: string
  signature: string
  category: DaddyCategory
  design: string
  /** daily = joins the surprise rotation; date = arrives on scheduledDate; manual = only when Daddy taps "Send now". */
  mode: DaddyMode
  scheduledDate: string | null // YYYY-MM-DD (mode 'date')
  queued: boolean // manual mode: Daddy sent it – shows as the next envelope
  special: boolean
  published: boolean // unpublished = never shown to Mommy
  createdAt: string
  updatedAt: string
  seenAt: string | null // when Mommy opened it (a message surprises only once)
}
export interface DaddyState {
  messages: DaddyMessage[]
  pinHash: string | null
  pinSalt: string | null
  hideEntry: boolean
  sampleSeeded: boolean
  surprise: { frequency: DaddyFrequency; animations: boolean; lastShownDate: string | null; recentIds: string[] }
}

export interface JourneyState {
  nickname: string
  week: number | null
  milestones: string[]
  notes: PersonalNote[]
  memories: PersonalNote[]
}

export interface Modules {
  game: GameState
  room: RoomState
  dress: DressState
  mommy: MommyState
  daddy: DaddyState
  journey: JourneyState
}
export type ModuleKey = keyof Modules

export interface Settings {
  sound: boolean
  music: boolean
  volume: number
  vibration: boolean
  motion: 'auto' | 'on' | 'off'
  theme: 'blush' | 'lavender' | 'sky' | 'peach'
}
