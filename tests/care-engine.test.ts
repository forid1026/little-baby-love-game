import assert from 'node:assert/strict'
import { applyDecay, moodFor, FLOOR, happiness } from '../app/games/baby-care/engine.ts'

const full = { hunger: 100, clean: 100, diaper: 100, sleep: 100, fun: 100 }
const a = applyDecay(full, 60 * 60000) // 1 hour
assert.ok(a.hunger < 100 && a.hunger > 70)
// a very long absence is capped and never goes below the floor
const b = applyDecay(full, 30 * 24 * 3600000)
assert.ok(Object.values(b).every(v => v >= FLOOR && v > 40), 'long break is not punished')
assert.equal(applyDecay({ ...full, hunger: 20 }, 24 * 3600000).hunger >= FLOOR, true)
// sleeping restores sleep
assert.ok(applyDecay({ ...full, sleep: 30 }, 5 * 60000, true).sleep > 30)
assert.equal(moodFor(full, false), 'happy'); assert.equal(moodFor({ ...full, hunger: 20 }, false), 'hungry')
assert.equal(moodFor({ ...full, sleep: 10 }, false), 'sleepy'); assert.equal(moodFor({ ...full, diaper: 10 }, false), 'fussy')
assert.equal(moodFor(full, true), 'sleeping'); assert.equal(happiness(full), 100)
console.log('care engine OK')
