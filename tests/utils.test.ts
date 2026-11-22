import assert from 'node:assert/strict'
import { mergeDefaults, formatTime } from '../app/utils/misc.ts'
import { daysBetween, effectiveToday, localDateKey } from '../app/utils/date.ts'

// nullable fields must keep stored strings (regression: lost reward claim date on reload)
const d = { rewards: { lastClaimDate: null as string | null, streak: 0 }, list: [1], name: 'x' }
const m = mergeDefaults(d, { rewards: { lastClaimDate: '2026-11-22', streak: 3 }, list: [4, 5], extra: 1 })
assert.equal(m.rewards.lastClaimDate, '2026-11-22'); assert.equal(m.rewards.streak, 3); assert.deepEqual(m.list, [4, 5]); assert.equal(m.name, 'x')
assert.equal(mergeDefaults(d, { name: 5 }).name, 'x', 'wrong type falls back to default')

assert.equal(daysBetween('2026-02-28', '2026-03-01'), 1)
assert.equal(daysBetween('2026-12-31', '2027-01-01'), 1)
// clock rolled back never goes before the latest day seen
assert.equal(effectiveToday('2999-01-01'), '2999-01-01')
assert.equal(effectiveToday(null), localDateKey())
assert.equal(formatTime(65), '1:05')
console.log('utils OK')
