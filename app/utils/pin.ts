// PIN hashing for Daddy Mode. This only keeps a surprise from being spoiled by accident –
// it is not bank-grade security (all data lives unencrypted on the device).
export function randomSalt(): string {
  const a = new Uint8Array(12)
  crypto.getRandomValues(a)
  return Array.from(a, b => b.toString(16).padStart(2, '0')).join('')
}

export async function hashPin(pin: string, salt: string): Promise<string> {
  const data = new TextEncoder().encode(`${salt}:${pin}`)
  if (globalThis.crypto?.subtle) {
    const buf = await crypto.subtle.digest('SHA-256', data)
    return Array.from(new Uint8Array(buf), b => b.toString(16).padStart(2, '0')).join('')
  }
  // Fallback for non-secure contexts (e.g. plain-http LAN testing)
  let h = 5381
  for (const b of data) h = ((h << 5) + h + b) | 0
  return `f${(h >>> 0).toString(16)}`
}
