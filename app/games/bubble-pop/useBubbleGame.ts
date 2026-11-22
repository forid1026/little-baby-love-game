import {
  W, H, R, COLS, DANGER_ROW, MAX_LEVEL, cellX, cellY, createLevel, nextShooter, snapCell, resolveShot, scoreShot,
  addTopRow, countBubbles, lowestRow, levelCoins, type Grid, type LevelConfig, type Bubble, type PoppedCell,
} from './engine'

export type BubblePhase = 'menu' | 'playing' | 'won' | 'lost'
export const BUBBLE_COLORS = ['#F48FB1', '#7FB9F0', '#FFD45E', '#6FD6A3', '#B195F2', '#FFA074']

interface Flying { x: number; y: number; vx: number; vy: number; bubble: Bubble }
interface Fx { x: number; y: number; vx: number; vy: number; life: number; max: number; color: string; size: number; kind: 'spark' | 'ring' | 'fall'; bubble?: Bubble }

const SHOOTER = { x: W / 2, y: H - 46 }
const SPEED = 820

export function useBubbleGame() {
  const game = useModule('game')
  const { recordGameStart } = useCoins()
  const rewards = useRewards()
  const { play, haptic } = useSound()
  const { motionOff } = useSettings()

  const phase = ref<BubblePhase>('menu')
  const paused = ref(false)
  const level = ref(1)
  const score = ref(0)
  const combo = ref(0)
  const bubblesLeft = ref(0)
  const missesLeft = ref(0)
  const bannerText = ref('')
  const result = ref<{ coins: number; stars: number; newBest: boolean } | null>(null)
  const hasRainbowHint = ref(false)

  let canvas: HTMLCanvasElement | null = null
  let ctx: CanvasRenderingContext2D | null = null
  let grid: Grid = { rows: [], shift: 0 }
  let config: LevelConfig = { level: 1, rows: 4, colors: 3, dropEvery: 8, specialChance: 0.05 }
  let current: Bubble = { color: 0, kind: 'normal' }
  let next: Bubble = { color: 0, kind: 'normal' }
  let flying: Flying | null = null
  let fx: Fx[] = []
  let missed = 0
  let starsCollected = 0
  let angle = Math.PI / 2
  let aiming = false
  let raf = 0
  let last = 0
  let scale = 1
  let ro: ResizeObserver | null = null
  const sprites = new Map<string, HTMLCanvasElement>()

  // ---------- Setup ----------
  function mount(c: HTMLCanvasElement) {
    canvas = c
    ctx = c.getContext('2d')
    resize()
    ro = new ResizeObserver(resize)
    ro.observe(c)
    raf = requestAnimationFrame(frame)
  }
  function unmount() { cancelAnimationFrame(raf); ro?.disconnect() }

  function resize() {
    if (!canvas) return
    const dpr = Math.min(window.devicePixelRatio || 1, 2.5)
    const cssW = canvas.clientWidth || W
    const nw = Math.round(cssW * dpr)
    if (canvas.width !== nw) {
      canvas.width = nw
      canvas.height = Math.round((nw * H) / W)
      scale = nw / W
      sprites.clear()
    }
  }

  function startLevel(n: number) {
    level.value = n
    const lv = createLevel(n)
    grid = lv.grid
    config = lv.config
    score.value = 0
    combo.value = 0
    missed = 0
    starsCollected = 0
    flying = null
    fx = []
    paused.value = false
    result.value = null
    current = nextShooter(grid, n)
    next = nextShooter(grid, n)
    syncHud()
    phase.value = 'playing'
    recordGameStart()
    banner(`Level ${n}`)
    play('click')
  }

  function syncHud() {
    bubblesLeft.value = countBubbles(grid)
    missesLeft.value = Math.max(0, config.dropEvery - missed)
    hasRainbowHint.value = current.kind !== 'normal'
  }
  let bannerTimer: ReturnType<typeof setTimeout> | undefined
  function banner(t: string) { bannerText.value = t; clearTimeout(bannerTimer); bannerTimer = setTimeout(() => { bannerText.value = '' }, 1300) }

  // ---------- Input ----------
  function pointerAngle(e: PointerEvent) {
    const r = canvas!.getBoundingClientRect()
    const x = ((e.clientX - r.left) / r.width) * W
    const y = ((e.clientY - r.top) / r.height) * H
    let a = Math.atan2(SHOOTER.y - y, x - SHOOTER.x) // 0 = right, PI/2 = up
    const min = 0.2
    a = Math.max(min, Math.min(Math.PI - min, a))
    return a
  }
  function onDown(e: PointerEvent) {
    if (phase.value !== 'playing' || paused.value) return
    canvas?.setPointerCapture(e.pointerId)
    aiming = true
    angle = pointerAngle(e)
  }
  function onMove(e: PointerEvent) { if (aiming) angle = pointerAngle(e) }
  function onUp(e: PointerEvent) {
    if (!aiming) return
    aiming = false
    angle = pointerAngle(e)
    shoot()
  }
  function shoot() {
    if (phase.value !== 'playing' || paused.value || flying) return
    flying = { x: SHOOTER.x, y: SHOOTER.y, vx: Math.cos(angle) * SPEED, vy: -Math.sin(angle) * SPEED, bubble: current }
    play('shoot'); haptic(6)
  }
  function swap() {
    if (phase.value !== 'playing' || paused.value || flying) return
    ;[current, next] = [next, current]
    syncHud(); play('click')
  }
  /** Keyboard play on desktop: arrows aim, space shoots. */
  function onKey(e: KeyboardEvent) {
    if (phase.value !== 'playing') return
    if (e.key === 'ArrowLeft') angle = Math.min(Math.PI - 0.2, angle + 0.08)
    else if (e.key === 'ArrowRight') angle = Math.max(0.2, angle - 0.08)
    else if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); shoot() }
    else if (e.key === 's') swap()
  }

  function togglePause() { if (phase.value === 'playing') paused.value = !paused.value }
  function toMenu() { phase.value = 'menu'; paused.value = false; flying = null }

  // ---------- Simulation ----------
  function land(f: Flying) {
    const cell = snapCell(grid, f.x, f.y)
    flying = null
    if (!cell) return
    const res = resolveShot(grid, cell, f.bubble)
    if (res.matched) {
      const gained = scoreShot(res, combo.value)
      score.value += gained
      combo.value++
      starsCollected += res.stars
      missed = 0
      res.popped.forEach(p => addPop(p, false))
      res.fallen.forEach(p => addPop(p, true))
      play('pop'); haptic(15)
      if (combo.value >= 2) banner(`Combo x${combo.value}! +${gained}`)
      else if (res.fallen.length) banner(`Nice drop! +${gained}`)
      if (res.stars) banner(`Lucky star! ⭐ +${gained}`)
    } else {
      combo.value = 0
      missed++
      if (missed >= config.dropEvery) {
        addTopRow(grid, config)
        missed = 0
        banner('The bubbles moved down a step')
        play('place')
      }
    }
    if (countBubbles(grid) === 0) return win()
    if (lowestRow(grid) >= DANGER_ROW) return lose()
    current = next
    next = nextShooter(grid, level.value)
    syncHud()
  }

  function addPop(p: PoppedCell, fall: boolean) {
    const color = p.bubble.color >= 0 ? BUBBLE_COLORS[p.bubble.color]! : '#FFB86B'
    if (fall) { fx.push({ x: p.x, y: p.y, vx: (Math.random() - 0.5) * 80, vy: -60, life: 1.1, max: 1.1, color, size: R, kind: 'fall', bubble: p.bubble }); return }
    fx.push({ x: p.x, y: p.y, vx: 0, vy: 0, life: 0.3, max: 0.3, color, size: R, kind: 'ring' })
    if (motionOff.value) return
    for (let i = 0; i < 5; i++) {
      const a = Math.random() * Math.PI * 2
      const sp = 70 + Math.random() * 110
      fx.push({ x: p.x, y: p.y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, life: 0.5, max: 0.5, color, size: 3 + Math.random() * 3, kind: 'spark' })
    }
  }

  function win() {
    phase.value = 'won'
    const coins = levelCoins(level.value) + Math.floor(score.value / 200)
    const stars = 1 + Math.min(starsCollected, 2)
    const g = game.value
    const newBest = score.value > (g.bubble.bestByLevel[level.value] ?? 0)
    if (newBest) g.bubble.bestByLevel[level.value] = score.value
    g.stats.bubbleBestScore = Math.max(g.stats.bubbleBestScore, score.value)
    g.stats.bubbleLevelsCleared++
    g.bubble.unlockedLevel = Math.max(g.bubble.unlockedLevel, Math.min(MAX_LEVEL, level.value + 1))
    result.value = { coins, stars, newBest }
    setTimeout(() => rewards.awardGame({ title: `Level ${level.value} cleared!`, subtitle: `${score.value} points`, coins, stars, icon: '🫧' }), 500)
  }
  function lose() {
    phase.value = 'lost'
    play('error')
    const coins = Math.min(15, Math.floor(score.value / 150))
    const g = game.value
    g.stats.bubbleBestScore = Math.max(g.stats.bubbleBestScore, score.value)
    if (coins) { g.coins += coins; g.stats.totalCoinsEarned += coins }
    result.value = { coins, stars: 0, newBest: false }
  }

  function step(dt: number) {
    if (flying) {
      const f = flying
      let remaining = dt
      while (remaining > 0 && flying) {
        const h = Math.min(remaining, (R / 2) / SPEED)
        remaining -= h
        f.x += f.vx * h
        f.y += f.vy * h
        if (f.x < R) { f.x = R; f.vx = Math.abs(f.vx) }
        else if (f.x > W - R) { f.x = W - R; f.vx = -Math.abs(f.vx) }
        if (f.y <= R) { f.y = R; land(f); break }
        let hit = false
        for (let r = 0; r < grid.rows.length && !hit; r++) {
          const row = grid.rows[r]!
          if (Math.abs(cellY(r) - f.y) > 2 * R) continue
          for (let c = 0; c < row.length; c++) {
            if (!row[c]) continue
            const dx = cellX(r, c, grid.shift) - f.x
            const dy = cellY(r) - f.y
            if (dx * dx + dy * dy < (1.8 * R) ** 2) { hit = true; break }
          }
        }
        if (hit) { land(f); break }
      }
    }
    for (const p of fx) {
      p.life -= dt
      if (p.kind === 'fall') { p.vy += 900 * dt; p.y += p.vy * dt; p.x += p.vx * dt } else { p.x += p.vx * dt; p.y += p.vy * dt }
    }
    fx = fx.filter(p => p.life > 0 && p.y < H + 40)
  }

  function frame(t: number) {
    raf = requestAnimationFrame(frame)
    const dt = Math.min((t - last) / 1000 || 0, 0.05)
    last = t
    if (phase.value === 'playing' && !paused.value) step(dt)
    else if (fx.length) step(dt) // let celebration/pop effects finish on win/lose screens
    draw()
  }

  // ---------- Drawing ----------
  function sprite(b: Bubble): HTMLCanvasElement {
    const key = `${b.color}-${b.kind}`
    let s = sprites.get(key)
    if (s) return s
    const size = Math.ceil((R * 2 + 4) * scale)
    s = document.createElement('canvas')
    s.width = s.height = size
    const g = s.getContext('2d')!
    const c = size / 2
    const rad = R * scale
    g.translate(c, c)
    const base = b.color >= 0 ? BUBBLE_COLORS[b.color]! : '#FF9F6B'
    const grad = g.createRadialGradient(-rad * 0.35, -rad * 0.4, rad * 0.1, 0, 0, rad)
    if (b.kind === 'rainbow') {
      grad.addColorStop(0, '#fff'); grad.addColorStop(1, '#fff')
      g.fillStyle = grad; g.beginPath(); g.arc(0, 0, rad, 0, Math.PI * 2); g.fill()
      BUBBLE_COLORS.forEach((col, i) => { g.fillStyle = col; g.beginPath(); g.moveTo(0, 0); g.arc(0, 0, rad * 0.92, (i / 6) * Math.PI * 2, ((i + 1) / 6) * Math.PI * 2); g.fill() })
    } else {
      grad.addColorStop(0, '#ffffffcc'); grad.addColorStop(0.35, base); grad.addColorStop(1, shade(base))
      g.fillStyle = grad
      g.beginPath(); g.arc(0, 0, rad * 0.96, 0, Math.PI * 2); g.fill()
    }
    g.strokeStyle = '#ffffffaa'; g.lineWidth = 2 * scale; g.beginPath(); g.arc(0, 0, rad * 0.96, 0, Math.PI * 2); g.stroke()
    g.fillStyle = '#ffffff99'; g.beginPath(); g.ellipse(-rad * 0.35, -rad * 0.4, rad * 0.22, rad * 0.13, -0.6, 0, Math.PI * 2); g.fill()
    g.font = `900 ${rad * 1.05}px system-ui, sans-serif`; g.textAlign = 'center'; g.textBaseline = 'middle'
    if (b.kind === 'star') { g.fillStyle = '#fff'; g.fillText('★', 0, rad * 0.06) }
    if (b.kind === 'bomb') { g.fillStyle = b.color < 0 ? '#fff' : '#4a3340'; g.fillText('✸', 0, rad * 0.04) }
    sprites.set(key, s)
    return s
  }
  function shade(hex: string) {
    const n = parseInt(hex.slice(1), 16)
    const f = (v: number) => Math.round(v * 0.78)
    return `rgb(${f((n >> 16) & 255)},${f((n >> 8) & 255)},${f(n & 255)})`
  }
  const drawBubble = (b: Bubble, x: number, y: number, s = 1) => {
    const sp = sprite(b)
    const w = (sp.width / scale) * s
    ctx!.drawImage(sp, (x - w / 2) * scale, (y - w / 2) * scale, w * scale, w * scale)
  }

  function draw() {
    if (!ctx || !canvas) return
    const g = ctx
    g.setTransform(1, 0, 0, 1, 0, 0)
    g.clearRect(0, 0, canvas.width, canvas.height)
    // background
    const bg = g.createLinearGradient(0, 0, 0, canvas.height)
    bg.addColorStop(0, '#FFF1F7'); bg.addColorStop(1, '#E8F2FF')
    g.fillStyle = bg
    g.fillRect(0, 0, canvas.width, canvas.height)
    // danger line
    const dy = (cellY(DANGER_ROW) - R * 0.2) * scale
    g.strokeStyle = '#F29BBB99'; g.setLineDash([10 * scale, 8 * scale]); g.lineWidth = 2 * scale
    g.beginPath(); g.moveTo(0, dy); g.lineTo(canvas.width, dy); g.stroke(); g.setLineDash([])

    grid.rows.forEach((row, r) => row.forEach((b, c) => { if (b) drawBubble(b, cellX(r, c, grid.shift), cellY(r)) }))

    for (const p of fx) {
      const k = Math.max(0, p.life / p.max)
      if (p.kind === 'fall' && p.bubble) { g.globalAlpha = Math.min(1, k * 1.5); drawBubble(p.bubble, p.x, p.y, 0.95); g.globalAlpha = 1 }
      else if (p.kind === 'ring') { g.strokeStyle = p.color; g.globalAlpha = k; g.lineWidth = 4 * scale; g.beginPath(); g.arc(p.x * scale, p.y * scale, (R + (1 - k) * 16) * scale, 0, Math.PI * 2); g.stroke(); g.globalAlpha = 1 }
      else { g.fillStyle = p.color; g.globalAlpha = k; g.beginPath(); g.arc(p.x * scale, p.y * scale, p.size * k * scale, 0, Math.PI * 2); g.fill(); g.globalAlpha = 1 }
    }

    // aim guide (one wall bounce)
    if (phase.value === 'playing' && !flying && !paused.value) {
      g.fillStyle = '#E27AA3'
      let x: number = SHOOTER.x, y: number = SHOOTER.y
      let vx = Math.cos(angle), vy = -Math.sin(angle)
      for (let i = 1; i < 26; i++) {
        x += vx * 16; y += vy * 16
        if (x < R) { x = R; vx = -vx } else if (x > W - R) { x = W - R; vx = -vx }
        if (y < R) break
        g.globalAlpha = 0.75 - i * 0.025
        g.beginPath(); g.arc(x * scale, y * scale, 2.6 * scale, 0, Math.PI * 2); g.fill()
      }
      g.globalAlpha = 1
    }

    // shooter: base, current, next
    g.fillStyle = '#FFFFFFCC'
    g.beginPath(); g.arc(SHOOTER.x * scale, (SHOOTER.y + 6) * scale, 34 * scale, 0, Math.PI * 2); g.fill()
    if (flying) drawBubble(flying.bubble, flying.x, flying.y)
    else if (phase.value !== 'menu') {
      g.save(); g.translate(SHOOTER.x * scale, SHOOTER.y * scale); g.rotate(Math.PI / 2 - angle); g.translate(-SHOOTER.x * scale, -SHOOTER.y * scale)
      g.fillStyle = '#E27AA3'; g.fillRect((SHOOTER.x - 5) * scale, (SHOOTER.y - 40) * scale, 10 * scale, 24 * scale); g.restore()
      drawBubble(current, SHOOTER.x, SHOOTER.y)
    }
    if (phase.value !== 'menu') {
      g.globalAlpha = 0.95
      drawBubble(next, SHOOTER.x + 80, SHOOTER.y + 14, 0.78)
      g.globalAlpha = 1
    }
  }

  return {
    phase, paused, level, score, combo, bubblesLeft, missesLeft, bannerText, result, hasRainbowHint,
    mount, unmount, startLevel, togglePause, toMenu, swap, shoot, onDown, onMove, onUp, onKey,
    get dropEvery() { return config.dropEvery },
  }
}
