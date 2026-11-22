import type { ModuleKey } from '~/types'
import { SCHEMA_VERSION } from '~/utils/defaults'

const KEYS: ModuleKey[] = ['game', 'room', 'dress', 'mommy', 'daddy', 'journey', 'care']

export function useBackup() {
  const settingsApi = useSettings()

  function buildBackup(): string {
    const data: Record<string, unknown> = {}
    for (const k of KEYS) data[k] = useModule(k).value
    return JSON.stringify({ app: 'little-baby-love', type: 'full-backup', version: SCHEMA_VERSION, exportedAt: new Date().toISOString(), settings: settingsApi.settings.value, data }, null, 2)
  }

  /** Validate and parse a backup without touching any state. */
  function parseBackup(text: string) {
    let parsed: { app?: string; type?: string; data?: Record<string, unknown>; settings?: unknown }
    try { parsed = JSON.parse(text) } catch { throw new Error('That does not look like a backup file.') }
    if (parsed?.app !== 'little-baby-love' || parsed.type !== 'full-backup' || typeof parsed.data !== 'object' || !parsed.data) {
      throw new Error('That is not a Little Baby Love full backup.')
    }
    const g = parsed.data.game as { coins?: unknown } | undefined
    if (!g || typeof g.coins !== 'number') throw new Error('The backup is missing game progress.')
    return parsed
  }

  async function restore(text: string) {
    const parsed = parseBackup(text)
    await replaceAllModules(parsed.data as Partial<Record<ModuleKey, unknown>>)
    if (parsed.settings && typeof parsed.settings === 'object') Object.assign(settingsApi.settings.value, parsed.settings)
  }

  async function resetEverything() {
    await resetAllModules()
    useDaddyMessages().lockNow()
  }

  const fileName = () => `little-baby-love-backup-${localDateKey()}.json`
  return { buildBackup, parseBackup, restore, resetEverything, fileName }
}
