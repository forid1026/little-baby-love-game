import type { DaddyMessage, DaddyCategory } from '~/types'

export interface CardDesign { id: string; name: string; bg: string; ink: string; accent: string; deco: string }

export const CARD_DESIGNS: CardDesign[] = [
  { id: 'rose', name: 'Rose Hearts', bg: 'linear-gradient(135deg,#FFE3EE,#F8C4D8)', ink: '#7A3552', accent: '#E27AA3', deco: '❤' },
  { id: 'lilac', name: 'Lilac Dream', bg: 'linear-gradient(135deg,#F1EAFF,#D9CBFF)', ink: '#4F3C86', accent: '#9A82E0', deco: '♥' },
  { id: 'sky', name: 'Sky Love', bg: 'linear-gradient(135deg,#E6F4FF,#BFDFFA)', ink: '#2F5D85', accent: '#5FA3D9', deco: '♡' },
  { id: 'peach', name: 'Peach Hug', bg: 'linear-gradient(135deg,#FFF0E5,#FFD2B9)', ink: '#8A4A2D', accent: '#EE8F66', deco: '❤' },
  { id: 'cream', name: 'Cream & Gold', bg: 'linear-gradient(135deg,#FFFBF2,#F8E6B8)', ink: '#7A5A1E', accent: '#E0A93B', deco: '★' },
  { id: 'mint', name: 'Mint Whisper', bg: 'linear-gradient(135deg,#EAFBF1,#C6EBD6)', ink: '#2E6B4C', accent: '#5FBE8C', deco: '♥' },
]
export const designById = (id: string) => CARD_DESIGNS.find(d => d.id === id) ?? CARD_DESIGNS[0]!

export const CATEGORIES: Array<{ id: DaddyCategory; label: string; icon: string }> = [
  { id: 'love', label: 'Love', icon: '💖' },
  { id: 'encouragement', label: 'Encouragement', icon: '🌷' },
  { id: 'baby', label: 'About Baby', icon: '🍼' },
  { id: 'memory', label: 'Memory', icon: '📸' },
  { id: 'funny', label: 'Funny', icon: '😄' },
  { id: 'other', label: 'Other', icon: '✉️' },
]
export const categoryById = (id: string) => CATEGORIES.find(c => c.id === id) ?? CATEGORIES[5]!

const SAMPLES: Array<{ title: string; body: string; design: string; category: DaddyCategory; special: boolean }> = [
  { title: 'Thank you, my love', body: 'My Love, you are doing something magical. Thank you for carrying our little world with so much love. I love you both. ❤️', design: 'rose', category: 'love', special: true },
  { title: 'Our little baby', body: 'One day, our little baby will call you Mommy. And I know you will be the most beautiful Mommy in the world.', design: 'lilac', category: 'baby', special: false },
  { title: 'All the comfort', body: 'I wish I could give you all the comfort in the world. Thank you for being so strong and loving.', design: 'peach', category: 'encouragement', special: false },
  { title: 'Holding our baby', body: 'Every day I imagine holding our little baby in my arms. I cannot wait for that beautiful moment.', design: 'sky', category: 'baby', special: false },
  { title: 'You are not alone', body: 'You are not alone in this journey. Daddy is always here for Mommy and Baby.', design: 'mint', category: 'encouragement', special: true },
  { title: 'Our growing family', body: 'Our family is growing, and my heart is growing with it.', design: 'rose', category: 'love', special: false },
  { title: 'Take care, Mommy', body: 'Dear Mommy, please take care of yourself. You are precious to both of us.', design: 'cream', category: 'encouragement', special: false },
  { title: 'Love before hello', body: 'One day, our baby will know how much love you gave even before we met.', design: 'lilac', category: 'baby', special: false },
  { title: 'Favorite person', body: 'You are my favorite person and soon you will be our baby’s favorite person too.', design: 'sky', category: 'love', special: false },
  { title: 'More than words', body: 'I love you, Mommy. And I already love our little miracle more than words can explain.', design: 'rose', category: 'love', special: true },
]

export function sampleDaddyMessages(): DaddyMessage[] {
  const now = new Date().toISOString()
  return SAMPLES.map((s, i) => ({
    id: `sample-${i + 1}`, title: s.title, body: s.body, signature: 'Daddy', category: s.category, design: s.design,
    mode: 'daily', scheduledDate: null, queued: false, special: s.special, published: true,
    createdAt: now, updatedAt: now, seenAt: null,
  }))
}

/** Fill in any missing fields (older saves / imports). */
export function normalizeMessage(raw: Partial<DaddyMessage> & { daily?: boolean }, fallbackId: string): DaddyMessage {
  const now = new Date().toISOString()
  const dateOk = typeof raw.scheduledDate === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(raw.scheduledDate)
  const mode = raw.mode === 'daily' || raw.mode === 'date' || raw.mode === 'manual'
    ? raw.mode
    : dateOk ? 'date' : raw.daily ? 'daily' : 'manual'
  return {
    id: typeof raw.id === 'string' && raw.id ? raw.id : fallbackId,
    title: String(raw.title ?? '').slice(0, 80),
    body: String(raw.body ?? '').slice(0, 1500),
    signature: String(raw.signature ?? 'Daddy').slice(0, 40),
    category: CATEGORIES.some(c => c.id === raw.category) ? raw.category! : 'love',
    design: designById(String(raw.design ?? 'rose')).id,
    mode,
    scheduledDate: mode === 'date' && dateOk ? raw.scheduledDate! : null,
    queued: !!raw.queued,
    special: !!raw.special,
    published: raw.published !== false,
    createdAt: raw.createdAt ?? now,
    updatedAt: raw.updatedAt ?? now,
    seenAt: raw.seenAt ?? null,
  }
}
