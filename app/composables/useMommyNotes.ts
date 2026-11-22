import { LOVE_NOTES, noteById, type LoveNote } from '~/data/messages'
import { hashString, pick, uid } from '~/utils/misc'

export function useMommyNotes() {
  const mommy = useModule('mommy')
  const game = useModule('game')

  const todayKey = computed(() => effectiveToday(game.value.rewards.lastSeenDate))
  /** Same note all day, a different one tomorrow (deterministic, works offline). */
  const dailyNote = computed<LoveNote>(() => LOVE_NOTES[hashString(`lbl-${todayKey.value}`) % LOVE_NOTES.length]!)

  const isFavorite = (id: string) => mommy.value.favorites.includes(id)
  function toggleFavorite(id: string) {
    const i = mommy.value.favorites.indexOf(id)
    if (i >= 0) mommy.value.favorites.splice(i, 1)
    else mommy.value.favorites.push(id)
  }
  const favoriteNotes = computed(() => mommy.value.favorites.map(noteById).filter((n): n is LoveNote => !!n))

  function randomNote(excludeId?: string): LoveNote {
    const pool = LOVE_NOTES.filter(n => n.id !== excludeId)
    const n = pick(pool)
    if (!mommy.value.seenIds.includes(n.id)) mommy.value.seenIds.push(n.id)
    return n
  }

  function addPersonal(text: string) {
    const t = text.trim()
    if (!t) return
    mommy.value.notes.unshift({ id: uid('note'), text: t.slice(0, 600), date: localDateKey() })
  }
  function removePersonal(id: string) { mommy.value.notes = mommy.value.notes.filter(n => n.id !== id) }

  return { notes: LOVE_NOTES, dailyNote, isFavorite, toggleFavorite, favoriteNotes, randomNote, addPersonal, removePersonal, personal: computed(() => mommy.value.notes) }
}
