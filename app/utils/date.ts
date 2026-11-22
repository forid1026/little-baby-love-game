/** Local calendar date as YYYY-MM-DD (uses the device's local time zone). */
export function localDateKey(d: Date = new Date()): string {
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${m}-${day}`
}

/**
 * "Today" that cannot go backwards: if the phone clock is turned back past a day we
 * have already seen, we keep using the latest day seen. This stops reward re-claims
 * by changing the clock backwards (or by simply refreshing).
 */
export function effectiveToday(lastSeen: string | null): string {
  const t = localDateKey()
  return lastSeen && lastSeen > t ? lastSeen : t
}

function toUtcDays(key: string): number {
  const [y, m, d] = key.split('-').map(Number)
  return Math.round(Date.UTC(y!, (m ?? 1) - 1, d ?? 1) / 86400000)
}

export function daysBetween(a: string, b: string): number {
  return toUtcDays(b) - toUtcDays(a)
}

export function prettyDate(key?: string | null): string {
  const d = key ? new Date(`${key}T12:00:00`) : new Date()
  return d.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })
}

export function shortDate(key?: string | null): string {
  const d = key ? new Date(`${key}T12:00:00`) : new Date()
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
}
