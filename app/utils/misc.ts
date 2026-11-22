export function uid(prefix = 'id'): string {
  return `${prefix}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`
}

export function shuffle<T>(arr: readonly T[], rng: () => number = Math.random): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[a[i], a[j]] = [a[j]!, a[i]!]
  }
  return a
}

export function pick<T>(arr: readonly T[], rng: () => number = Math.random): T {
  return arr[Math.floor(rng() * arr.length)]!
}

export function clamp(n: number, lo: number, hi: number): number {
  return Math.min(hi, Math.max(lo, n))
}

/** Deterministic string hash – used for "message of the day". */
export function hashString(s: string): number {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619) }
  return h >>> 0
}

export function formatTime(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60)
  const s = Math.floor(totalSeconds % 60)
  return `${m}:${String(s).padStart(2, '0')}`
}

/** Merge stored data over defaults (objects deep-merged, arrays/primitives replaced). */
export function mergeDefaults<T>(defaults: T, stored: unknown): T {
  if (stored === undefined || stored === null) return defaults
  // Nullable fields (default null) accept whatever type was stored, e.g. a date string.
  if (defaults === null) return stored as T
  if (Array.isArray(defaults)) return (Array.isArray(stored) ? stored : defaults) as T
  if (defaults && typeof defaults === 'object') {
    if (typeof stored !== 'object' || Array.isArray(stored)) return defaults
    const out: Record<string, unknown> = { ...(stored as Record<string, unknown>) }
    for (const k of Object.keys(defaults as object)) {
      out[k] = mergeDefaults((defaults as Record<string, unknown>)[k], (stored as Record<string, unknown>)[k])
    }
    return out as T
  }
  return (typeof stored === typeof defaults ? stored : defaults) as T
}

export function darken(hex: string, amt = 0.18): string {
  const n = parseInt(hex.replace('#', ''), 16)
  const f = (v: number) => Math.max(0, Math.min(255, Math.round(v * (1 - amt))))
  const r = f((n >> 16) & 255), g = f((n >> 8) & 255), b = f(n & 255)
  return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`
}

export function lighten(hex: string, amt = 0.35): string {
  const n = parseInt(hex.replace('#', ''), 16)
  const f = (v: number) => Math.max(0, Math.min(255, Math.round(v + (255 - v) * amt)))
  const r = f((n >> 16) & 255), g = f((n >> 8) & 255), b = f(n & 255)
  return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`
}
