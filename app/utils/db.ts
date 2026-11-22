// Tiny IndexedDB key/value store with a localStorage fallback (private modes, old WebViews).
const DB_NAME = 'little-baby-love'
const STORE = 'kv'
let dbPromise: Promise<IDBDatabase> | null = null

export type StorageMode = 'indexeddb' | 'localstorage' | 'memory'
export let storageMode: StorageMode = 'indexeddb'
const memory = new Map<string, string>()

function openDb(): Promise<IDBDatabase> {
  if (!dbPromise) {
    dbPromise = new Promise((resolve, reject) => {
      if (typeof indexedDB === 'undefined') return reject(new Error('no indexedDB'))
      const req = indexedDB.open(DB_NAME, 1)
      req.onupgradeneeded = () => { req.result.createObjectStore(STORE) }
      req.onsuccess = () => resolve(req.result)
      req.onerror = () => reject(req.error)
      req.onblocked = () => reject(new Error('blocked'))
    })
  }
  return dbPromise
}

function lsGet(key: string): string | null {
  try { return localStorage.getItem(`lbl:${key}`) } catch { return memory.get(key) ?? null }
}
function lsSet(key: string, val: string) {
  try { localStorage.setItem(`lbl:${key}`, val) } catch { memory.set(key, val); storageMode = 'memory' }
}

export async function dbGet<T>(key: string): Promise<T | undefined> {
  try {
    const db = await openDb()
    return await new Promise<T | undefined>((resolve, reject) => {
      const r = db.transaction(STORE, 'readonly').objectStore(STORE).get(key)
      r.onsuccess = () => resolve(r.result as T | undefined)
      r.onerror = () => reject(r.error)
    })
  } catch {
    storageMode = 'localstorage'
    const raw = lsGet(key)
    return raw ? (JSON.parse(raw) as T) : undefined
  }
}

export async function dbSet(key: string, value: unknown): Promise<void> {
  const clean = JSON.parse(JSON.stringify(value))
  try {
    const db = await openDb()
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE, 'readwrite')
      tx.objectStore(STORE).put(clean, key)
      tx.oncomplete = () => resolve()
      tx.onerror = () => reject(tx.error)
      tx.onabort = () => reject(tx.error)
    })
  } catch {
    storageMode = storageMode === 'memory' ? 'memory' : 'localstorage'
    lsSet(key, JSON.stringify(clean))
  }
}

export async function dbClearAll(): Promise<void> {
  try {
    const db = await openDb()
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE, 'readwrite')
      tx.objectStore(STORE).clear()
      tx.oncomplete = () => resolve()
      tx.onerror = () => reject(tx.error)
    })
  } catch { /* fall through */ }
  try {
    Object.keys(localStorage).filter(k => k.startsWith('lbl:')).forEach(k => localStorage.removeItem(k))
  } catch { /* ignore */ }
  memory.clear()
}
