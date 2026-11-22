import assert from 'node:assert/strict'
import { createLevel, snapCell, resolveShot, addTopRow, neighbors, countBubbles, nextShooter, cellX, cellY, rowLen, COLS, levelConfig } from '../app/games/bubble-pop/engine.ts'

let seed = 7
const rng = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646 }

// neighbour symmetry on a shifted grid
const { grid, config } = createLevel(3, rng)
for (let r = 0; r < grid.rows.length; r++) for (let c = 0; c < rowLen(r, grid.shift); c++)
  for (const n of neighbors(grid, r, c)) assert.ok(neighbors(grid, n.r, n.c).some(m => m.r === r && m.c === c), `asym ${r},${c} -> ${n.r},${n.c}`)
addTopRow(grid, config, rng)
for (let r = 0; r < grid.rows.length; r++) for (let c = 0; c < rowLen(r, grid.shift); c++)
  for (const n of neighbors(grid, r, c)) assert.ok(neighbors(grid, n.r, n.c).some(m => m.r === r && m.c === c), `asym2 ${r},${c}`)

// match of three pops, floating drops
const g = { rows: [[...Array(COLS)].map(() => null), [...Array(COLS - 1)].map(() => null), [...Array(COLS)].map(() => null)], shift: 0 } as any
g.rows[0][0] = { color: 1, kind: 'normal' }; g.rows[0][1] = { color: 1, kind: 'normal' }
g.rows[1][0] = { color: 2, kind: 'normal' } // hangs from row0 col0/1
g.rows[0][4] = { color: 3, kind: 'normal' }
const res = resolveShot(g, { r: 0, c: 2 }, { color: 1, kind: 'normal' })
assert.equal(res.matched, true); assert.equal(res.popped.length, 3)
assert.equal(res.fallen.length, 1, 'bubble hanging only from popped ones falls')
assert.ok(g.rows[0][4], 'attached bubble stays')

// miss stays
const g2 = { rows: [[...Array(COLS)].map(() => null)], shift: 0 } as any
g2.rows[0][0] = { color: 0, kind: 'normal' }
assert.equal(resolveShot(g2, { r: 0, c: 1 }, { color: 1, kind: 'normal' }).matched, false)
assert.equal(countBubbles(g2), 2)

// snap picks nearest empty
const s = snapCell(g2, cellX(0, 5, 0), cellY(0))!
assert.deepEqual(s, { r: 0, c: 5 })

// rainbow adopts neighbour colour and pops
const g3 = { rows: [[...Array(COLS)].map(() => null)], shift: 0 } as any
g3.rows[0][0] = { color: 2, kind: 'normal' }; g3.rows[0][1] = { color: 2, kind: 'normal' }
assert.equal(resolveShot(g3, { r: 0, c: 2 }, { color: -1, kind: 'rainbow' }).popped.length, 3)

// blast removes neighbours
const g4 = createLevel(5, rng).grid
const before = countBubbles(g4)
const cell = snapCell(g4, 180, 4 * 34.64 + 90)!
const r4 = resolveShot(g4, cell, { color: -1, kind: 'bomb' })
assert.ok(r4.matched && countBubbles(g4) < before + 1)

// shooter colours exist on board
for (let i = 0; i < 200; i++) { const b = nextShooter(grid, 5, rng); if (b.color >= 0) assert.ok(grid.rows.some(r => r.some(x => x && x.color === b.color))) }
assert.equal(levelConfig(1).colors, 3)
console.log('bubble engine OK')
