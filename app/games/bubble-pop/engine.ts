// Pure Bubble Pop rules on a hex grid (no Vue, no DOM). Even-parity rows have COLS bubbles,
// odd-parity rows have COLS-1 and are shifted right by one radius.
export const COLS = 9
export const R = 20
export const W = COLS * R * 2 // 360
export const ROW_H = R * Math.sqrt(3)
export const DANGER_ROW = 12
export const H = 570

export type Kind = 'normal' | 'star' | 'bomb' | 'rainbow'
export interface Bubble { color: number; kind: Kind } // color -1 = colourless special
export type Row = (Bubble | null)[]
export interface Grid { rows: Row[]; shift: number }
export interface Cell { r: number; c: number }
export interface PoppedCell extends Cell { x: number; y: number; bubble: Bubble }

export interface LevelConfig { level: number; rows: number; colors: number; dropEvery: number; specialChance: number }

export function levelConfig(level: number): LevelConfig {
  return {
    level,
    rows: Math.min(3 + Math.ceil(level / 2), 9),
    colors: Math.min(3 + Math.floor((level - 1) / 2), 6),
    dropEvery: Math.max(4, 9 - Math.floor(level / 2)),
    specialChance: Math.min(0.05 + level * 0.005, 0.09),
  }
}
export const levelCoins = (level: number) => 20 + level * 6
export const MAX_LEVEL = 30

const parityOdd = (r: number, shift: number) => ((r + shift) & 1) === 1
export const rowLen = (r: number, shift: number) => (parityOdd(r, shift) ? COLS - 1 : COLS)
export const cellX = (r: number, c: number, shift: number) => R + c * 2 * R + (parityOdd(r, shift) ? R : 0)
export const cellY = (r: number) => R + r * ROW_H

export function neighbors(grid: Grid, r: number, c: number): Cell[] {
  const out: Cell[] = []
  const odd = parityOdd(r, grid.shift)
  const push = (rr: number, cc: number) => {
    if (rr < 0 || rr >= grid.rows.length) return
    if (cc < 0 || cc >= rowLen(rr, grid.shift)) return
    out.push({ r: rr, c: cc })
  }
  push(r, c - 1); push(r, c + 1)
  const cols = odd ? [c, c + 1] : [c - 1, c]
  for (const cc of cols) { push(r - 1, cc); push(r + 1, cc) }
  return out
}

const emptyRow = (r: number, shift: number): Row => Array.from({ length: rowLen(r, shift) }, () => null)

export function ensureRows(grid: Grid, upTo: number) {
  while (grid.rows.length <= upTo) grid.rows.push(emptyRow(grid.rows.length, grid.shift))
}

export function createLevel(level: number, rng: () => number = Math.random): { grid: Grid; config: LevelConfig } {
  const config = levelConfig(level)
  const grid: Grid = { rows: [], shift: 0 }
  for (let r = 0; r < config.rows; r++) grid.rows.push(randomRow(r, grid.shift, config, rng, grid.rows[r - 1]))
  return { grid, config }
}

function randomBubble(config: LevelConfig, rng: () => number, hint?: number): Bubble {
  const color = hint !== undefined && rng() < 0.32 ? hint : Math.floor(rng() * config.colors)
  const roll = rng()
  if (roll < config.specialChance * 0.55) return { color, kind: 'star' }
  if (roll < config.specialChance) return { color, kind: 'bomb' }
  return { color, kind: 'normal' }
}

function randomRow(r: number, shift: number, config: LevelConfig, rng: () => number, above?: Row): Row {
  const row: Row = []
  const len = rowLen(r, shift)
  for (let c = 0; c < len; c++) {
    const left = row[c - 1]?.color
    const up = above?.[c]?.color
    row.push(randomBubble(config, rng, left ?? up))
  }
  return row
}

/** Push every row down one step and add a fresh row on top (the ceiling "drops"). */
export function addTopRow(grid: Grid, config: LevelConfig, rng: () => number = Math.random) {
  grid.shift ^= 1
  grid.rows.unshift(randomRow(0, grid.shift, config, rng, grid.rows[0]))
}

export function trim(grid: Grid) {
  while (grid.rows.length > 1 && grid.rows[grid.rows.length - 1]!.every(b => !b)) grid.rows.pop()
}

export function countBubbles(grid: Grid): number {
  let n = 0
  for (const row of grid.rows) for (const b of row) if (b) n++
  return n
}
export function lowestRow(grid: Grid): number {
  for (let r = grid.rows.length - 1; r >= 0; r--) if (grid.rows[r]!.some(Boolean)) return r
  return -1
}
export function colorsPresent(grid: Grid): number[] {
  const s = new Set<number>()
  for (const row of grid.rows) for (const b of row) if (b && b.color >= 0) s.add(b.color)
  return [...s]
}

/** The next bubble to shoot. Always a colour that is still on the board, so levels stay winnable. */
export function nextShooter(grid: Grid, level: number, rng: () => number = Math.random): Bubble {
  const present = colorsPresent(grid)
  const roll = rng()
  if (level >= 2 && roll < 0.05) return { color: -1, kind: 'rainbow' }
  if (level >= 3 && roll < 0.08) return { color: -1, kind: 'bomb' }
  const color = present.length ? present[Math.floor(rng() * present.length)]! : 0
  return { color, kind: 'normal' }
}

/** Nearest empty cell to a point (used to snap a flying bubble into the grid). */
export function snapCell(grid: Grid, x: number, y: number): Cell | null {
  const guess = Math.round((y - R) / ROW_H)
  let best: Cell | null = null
  let bestD = Infinity
  for (let r = Math.max(0, guess - 2); r <= guess + 2; r++) {
    ensureRows(grid, r)
    for (let c = 0; c < rowLen(r, grid.shift); c++) {
      if (grid.rows[r]![c]) continue
      const dx = cellX(r, c, grid.shift) - x
      const dy = cellY(r) - y
      const d = dx * dx + dy * dy
      if (d < bestD) { bestD = d; best = { r, c } }
    }
  }
  return best
}

function cluster(grid: Grid, start: Cell, color: number): Cell[] {
  const seen = new Set<string>([`${start.r},${start.c}`])
  const q: Cell[] = [start]
  const out: Cell[] = []
  while (q.length) {
    const cur = q.pop()!
    out.push(cur)
    for (const n of neighbors(grid, cur.r, cur.c)) {
      const key = `${n.r},${n.c}`
      const b = grid.rows[n.r]![n.c]
      if (seen.has(key) || !b || b.color !== color) continue
      seen.add(key)
      q.push(n)
    }
  }
  return out
}

function floating(grid: Grid): Cell[] {
  const seen = new Set<string>()
  const q: Cell[] = []
  grid.rows[0]?.forEach((b, c) => { if (b) { seen.add(`0,${c}`); q.push({ r: 0, c }) } })
  while (q.length) {
    const cur = q.pop()!
    for (const n of neighbors(grid, cur.r, cur.c)) {
      const key = `${n.r},${n.c}`
      if (seen.has(key) || !grid.rows[n.r]![n.c]) continue
      seen.add(key)
      q.push(n)
    }
  }
  const out: Cell[] = []
  grid.rows.forEach((row, r) => row.forEach((b, c) => { if (b && !seen.has(`${r},${c}`)) out.push({ r, c }) }))
  return out
}

export interface Resolution {
  placed: Cell
  popped: PoppedCell[]
  fallen: PoppedCell[]
  stars: number
  matched: boolean
}

function take(grid: Grid, cells: Cell[]): PoppedCell[] {
  const out: PoppedCell[] = []
  for (const { r, c } of cells) {
    const b = grid.rows[r]![c]
    if (!b) continue
    out.push({ r, c, x: cellX(r, c, grid.shift), y: cellY(r), bubble: b })
    grid.rows[r]![c] = null
  }
  return out
}

/**
 * Place `shot` at `cell`, then pop matches / explosions and drop anything left hanging.
 * Rainbow takes the colour of the biggest neighbouring group; a colourless bomb ("blast") explodes on landing.
 */
export function resolveShot(grid: Grid, cell: Cell, shot: Bubble): Resolution {
  ensureRows(grid, cell.r)
  let bubble = { ...shot }

  if (bubble.kind === 'rainbow') {
    let bestColor = -1
    let bestSize = 0
    for (const col of colorsPresent(grid)) {
      grid.rows[cell.r]![cell.c] = { color: col, kind: 'normal' }
      const size = cluster(grid, cell, col).length
      if (size > bestSize) { bestSize = size; bestColor = col }
    }
    bubble = { color: bestColor >= 0 ? bestColor : 0, kind: 'normal' }
  }
  grid.rows[cell.r]![cell.c] = bubble

  let toPop: Cell[] = []
  if (bubble.kind === 'bomb' && bubble.color < 0) {
    const cx = cellX(cell.r, cell.c, grid.shift)
    const cy = cellY(cell.r)
    grid.rows.forEach((row, r) => row.forEach((b, c) => {
      if (!b) return
      const dx = cellX(r, c, grid.shift) - cx
      const dy = cellY(r) - cy
      if (dx * dx + dy * dy <= (4.2 * R) ** 2) toPop.push({ r, c })
    }))
  } else {
    const group = cluster(grid, cell, bubble.color)
    if (group.length >= 3) toPop = group
  }

  const matched = toPop.length > 0
  if (!matched) return { placed: cell, popped: [], fallen: [], stars: 0, matched: false }

  // Chain reaction: popped bomb bubbles also take their neighbours with them.
  const keys = new Set(toPop.map(p => `${p.r},${p.c}`))
  for (let i = 0; i < toPop.length; i++) {
    const p = toPop[i]!
    if (grid.rows[p.r]![p.c]?.kind !== 'bomb') continue
    for (const n of neighbors(grid, p.r, p.c)) {
      const key = `${n.r},${n.c}`
      if (!keys.has(key) && grid.rows[n.r]![n.c]) { keys.add(key); toPop.push(n) }
    }
  }

  const popped = take(grid, toPop)
  const fallen = take(grid, floating(grid))
  const stars = [...popped, ...fallen].filter(p => p.bubble.kind === 'star').length
  trim(grid)
  return { placed: cell, popped, fallen, stars, matched: true }
}

/** Score for one resolved shot; combo is the number of consecutive scoring shots before this one. */
export function scoreShot(res: Resolution, combo: number): number {
  const base = res.popped.length * 10 + res.fallen.length * 25 + res.stars * 50
  return Math.round(base * (1 + Math.min(combo, 5) * 0.5))
}
