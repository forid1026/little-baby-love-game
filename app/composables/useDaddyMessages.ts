import type { DaddyMessage, DaddyFrequency } from '~/types'
import { normalizeMessage } from '~/data/daddy'
import { hashPin, randomSalt } from '~/utils/pin'
import { uid } from '~/utils/misc'
import { daysBetween } from '~/utils/date'

export const FREQUENCY_LABEL: Record<DaddyFrequency, string> = {
  daily: 'Every day', every2: 'Every 2 days', weekly: 'Once a week', off: 'Off (only dated & sent-now messages)',
}
const FREQ_DAYS: Record<DaddyFrequency, number> = { daily: 1, every2: 2, weekly: 7, off: Infinity }

// Daddy Mode stays unlocked in memory only – closing the app locks it again.
const UNLOCK_MS = 10 * 60 * 1000
let failures = 0
let lockedUntil = 0

export function useDaddyMessages() {
  const daddy = useModule('daddy')
  const game = useModule('game')
  const unlockedAt = useState<number>('daddy-unlocked-at', () => 0)

  const today = computed(() => effectiveToday(game.value.rewards.lastSeenDate))
  const messages = computed(() => daddy.value.messages)
  const hasPin = computed(() => !!daddy.value.pinHash)
  const isUnlocked = () => unlockedAt.value > 0 && Date.now() - unlockedAt.value < UNLOCK_MS

  /**
   * What Mommy may read: published AND already opened by her as a surprise envelope.
   * Unpublished, future-dated and not-yet-delivered messages are never exposed.
   */
  const readable = computed(() => daddy.value.messages.filter(m => m.published && !!m.seenAt)
    .sort((a, b) => (b.seenAt ?? '').localeCompare(a.seenAt ?? '')))

  /** Status label for the dashboard (Daddy only). */
  function statusOf(m: DaddyMessage): { label: string; tone: 'ok' | 'wait' | 'off' | 'done' } {
    if (!m.published) return { label: 'Unpublished', tone: 'off' }
    if (m.seenAt) return { label: 'Opened by Mommy', tone: 'done' }
    if (m.mode === 'date') return { label: m.scheduledDate && m.scheduledDate <= today.value ? 'Due – arrives next open' : `Scheduled ${m.scheduledDate}`, tone: 'wait' }
    if (m.mode === 'manual') return { label: m.queued ? 'Sent – arrives next open' : 'Draft – not sent yet', tone: m.queued ? 'wait' : 'off' }
    return { label: 'In daily rotation', tone: 'ok' }
  }

  const eligibleNow = (m: DaddyMessage) =>
    m.published && !m.seenAt && (
      (m.mode === 'date' && !!m.scheduledDate && m.scheduledDate <= today.value) ||
      (m.mode === 'manual' && m.queued)
    )

  // ---------- Surprise envelope ----------
  /**
   * Pick the next surprise (or null). Rules:
   *  1. Only published messages; future-dated messages are never offered early.
   *  2. Dated and "sent now" messages arrive on the next open, and only once (seenAt).
   *  3. Daily-rotation messages follow the frequency setting, once per day at most,
   *     and cycle through every message before any repeats.
   */
  function pickSurprise(): DaddyMessage | null {
    const s = daddy.value.surprise
    const due = daddy.value.messages.filter(eligibleNow)
    if (due.length) return due.find(m => m.mode === 'date') ?? due[0]!
    if (s.lastShownDate === today.value) return null
    if (s.lastShownDate && daysBetween(s.lastShownDate, today.value) < FREQ_DAYS[s.frequency]) return null
    if (s.frequency === 'off') return null
    const all = daddy.value.messages.filter(m => m.published && m.mode === 'daily')
    if (!all.length) return null
    let pool = all.filter(m => !s.recentIds.includes(m.id))
    if (!pool.length) {
      // Everyone has had a turn: start a new round, but never repeat the last one immediately.
      const last = s.recentIds[s.recentIds.length - 1]
      s.recentIds = []
      pool = all.filter(m => m.id !== last)
      if (!pool.length) pool = all
    }
    const fresh = pool.filter(m => !m.seenAt)
    if (fresh.length) pool = fresh // brand-new messages go first
    const specials = pool.filter(m => m.special)
    const src = specials.length && Math.random() < 0.35 ? specials : pool
    return src[Math.floor(Math.random() * src.length)] ?? null
  }

  function markSurpriseShown(id: string) {
    const m = daddy.value.messages.find(x => x.id === id)
    if (!m) return
    const s = daddy.value.surprise
    if (!m.seenAt) m.seenAt = new Date().toISOString()
    m.queued = false
    if (m.mode === 'daily') { s.lastShownDate = today.value; if (!s.recentIds.includes(id)) s.recentIds.push(id) }
    game.value.stats.surprisesOpened++
  }

  // ---------- CRUD (Daddy Mode) ----------
  function save(input: Partial<DaddyMessage> & { title: string; body: string }): DaddyMessage {
    const now = new Date().toISOString()
    const existing = input.id ? daddy.value.messages.find(m => m.id === input.id) : undefined
    const merged = normalizeMessage({ ...(existing ?? {}), ...input, updatedAt: now }, existing?.id ?? uid('dm'))
    if (existing) {
      // Changing the date, mode or re-publishing makes it a fresh surprise again.
      const resurface = merged.scheduledDate !== existing.scheduledDate || merged.mode !== existing.mode
      merged.seenAt = resurface ? null : existing.seenAt
      Object.assign(existing, merged)
      return existing
    }
    merged.createdAt = now
    merged.seenAt = null
    daddy.value.messages.unshift(merged)
    return merged
  }
  function remove(id: string) { daddy.value.messages = daddy.value.messages.filter(m => m.id !== id) }
  function setPublished(id: string, v: boolean) { const m = daddy.value.messages.find(x => x.id === id); if (m) m.published = v }
  /** Manual mode: queue the message as the next surprise envelope. */
  function sendNow(id: string) {
    const m = daddy.value.messages.find(x => x.id === id)
    if (!m) return
    m.published = true
    m.queued = true
    m.seenAt = null
  }
  /** Let a message surprise Mommy again (clears "opened"). */
  function resend(id: string) { const m = daddy.value.messages.find(x => x.id === id); if (m) { m.seenAt = null; if (m.mode === 'manual') m.queued = true } }

  // ---------- PIN ----------
  async function setPin(pin: string) {
    const salt = randomSalt()
    daddy.value.pinSalt = salt
    daddy.value.pinHash = await hashPin(pin, salt)
    unlockedAt.value = Date.now()
  }
  /** Returns 'ok' | 'wrong' | 'locked'. */
  async function verifyPin(pin: string): Promise<'ok' | 'wrong' | 'locked'> {
    if (Date.now() < lockedUntil) return 'locked'
    if (!daddy.value.pinHash || !daddy.value.pinSalt) return 'wrong'
    const h = await hashPin(pin, daddy.value.pinSalt)
    if (h === daddy.value.pinHash) { failures = 0; unlockedAt.value = Date.now(); return 'ok' }
    if (++failures >= 5) { lockedUntil = Date.now() + 30000; failures = 0; return 'locked' }
    return 'wrong'
  }
  const lockNow = () => { unlockedAt.value = 0 }
  const lockSecondsLeft = () => Math.max(0, Math.ceil((lockedUntil - Date.now()) / 1000))
  function removePin() { daddy.value.pinHash = null; daddy.value.pinSalt = null; unlockedAt.value = 0 }

  // ---------- Backup ----------
  const exportJson = () => JSON.stringify({ app: 'little-baby-love', type: 'daddy-messages', version: 2, exportedAt: new Date().toISOString(), messages: daddy.value.messages }, null, 2)
  /** Merge messages from a JSON backup (matched by id). Returns the number imported. */
  function importJson(text: string): number {
    let data: { app?: string; type?: string; messages?: unknown }
    try { data = JSON.parse(text) } catch { throw new Error('That is not a valid JSON file.') }
    if (data?.app !== 'little-baby-love' || !Array.isArray(data.messages)) throw new Error('This is not a Daddy messages backup.')
    let n = 0
    for (const raw of data.messages as Array<Partial<DaddyMessage>>) {
      if (typeof raw?.title !== 'string' || typeof raw?.body !== 'string') continue
      const m = normalizeMessage(raw, uid('dm'))
      const i = daddy.value.messages.findIndex(x => x.id === m.id)
      if (i >= 0) daddy.value.messages[i] = m
      else daddy.value.messages.push(m)
      n++
    }
    return n
  }

  return {
    messages, readable, hasPin, isUnlocked, unlockedAt, today, statusOf,
    pickSurprise, markSurpriseShown, save, remove, setPublished, sendNow, resend,
    setPin, verifyPin, lockNow, lockSecondsLeft, removePin, exportJson, importJson,
  }
}
