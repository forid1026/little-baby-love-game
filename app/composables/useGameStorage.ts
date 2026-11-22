import type { Modules, ModuleKey, DaddyMessage } from '~/types'
import { normalizeMessage } from '~/data/daddy'
import { moduleDefaults } from '~/utils/defaults'
import { mergeDefaults } from '~/utils/misc'

const KEYS = Object.keys(moduleDefaults) as ModuleKey[]

/** Reactive, auto-persisted state for one module (game, room, dress, mommy, daddy, journey). */
export function useModule<K extends ModuleKey>(key: K): Ref<Modules[K]> {
  return useState<Modules[K]>(`mod:${key}`, () => moduleDefaults[key]() as Modules[K])
}

export const useStorageReady = () => useState('storage-ready', () => false)
export const useStorageMode = () => useState<string>('storage-mode', () => 'indexeddb')

/** Run schema migrations on old saves. Add a case per version bump. */
function migrate(key: ModuleKey, data: Record<string, unknown>): Record<string, unknown> {
  // Future schema bumps: add `if (data.v < 2) {...}` cases. Daddy messages are always normalised
  // so older saves / hand-edited imports gain any new fields.
  if (key === 'daddy' && Array.isArray(data.messages)) {
    data.messages = (data.messages as Array<Partial<DaddyMessage>>).map((m, i) => normalizeMessage(m, `dm_legacy_${i}`))
  }
  return data
}

let started = false

/** Loads every module from IndexedDB (once), then turns on autosave. Called by the storage plugin. */
export async function initStorage() {
  if (started) return
  started = true
  try { await navigator.storage?.persist?.() } catch { /* optional */ }

  for (const key of KEYS) {
    const state = useModule(key)
    const stored = await dbGet<Record<string, unknown>>(key)
    const defaults = moduleDefaults[key]() as Modules[typeof key]
    state.value = (stored ? mergeDefaults(defaults, migrate(key, stored)) : defaults) as never
  }
  useStorageMode().value = storageMode

  let timer: ReturnType<typeof setTimeout> | undefined
  const dirty = new Set<ModuleKey>()
  const flush = async () => {
    clearTimeout(timer)
    const keys = [...dirty]
    dirty.clear()
    await Promise.all(keys.map(k => dbSet(k, useModule(k).value)))
    useStorageMode().value = storageMode
  }
  for (const key of KEYS) {
    watch(useModule(key), () => {
      dirty.add(key)
      clearTimeout(timer)
      timer = setTimeout(flush, 250)
    }, { deep: true })
  }
  const flushNow = () => { if (dirty.size) void flush() }
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') flushNow() })
  window.addEventListener('pagehide', flushNow)
  // First run: persist the seeded defaults straight away.
  KEYS.forEach(k => dirty.add(k))
  await flush()
  useStorageReady().value = true
}

/** Replace all modules from a (validated) backup and persist immediately. */
export async function replaceAllModules(data: Partial<Record<ModuleKey, unknown>>) {
  for (const key of KEYS) {
    const defaults = moduleDefaults[key]() as Modules[typeof key]
    const incoming = data[key]
    const next = incoming ? mergeDefaults(defaults, migrate(key, incoming as Record<string, unknown>)) : defaults
    useModule(key).value = next as never
    await dbSet(key, next)
  }
}

export async function resetAllModules() {
  for (const key of KEYS) {
    const next = moduleDefaults[key]()
    useModule(key).value = next as never
    await dbSet(key, next)
  }
}
