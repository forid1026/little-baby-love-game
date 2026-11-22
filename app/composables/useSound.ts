// All sounds are synthesised locally with the Web Audio API – no audio files, no network, works offline.
export type SfxName = 'click' | 'flip' | 'pop' | 'reward' | 'win' | 'envelope' | 'celebrate' | 'error' | 'place' | 'shoot'

let ctx: AudioContext | null = null
let master: GainNode | null = null
let musicGain: GainNode | null = null
let musicTimer: ReturnType<typeof setInterval> | null = null
let musicStep = 0
let musicRunning = false

function ensureCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null
  if (!ctx) {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    if (!AC) return null
    ctx = new AC()
    master = ctx.createGain()
    master.connect(ctx.destination)
    musicGain = ctx.createGain()
    musicGain.gain.value = 0.35
    musicGain.connect(master)
  }
  if (ctx.state === 'suspended') void ctx.resume()
  return ctx
}

function tone(freq: number, start: number, dur: number, opts: { type?: OscillatorType; vol?: number; slideTo?: number; dest?: AudioNode } = {}) {
  const c = ctx!
  const osc = c.createOscillator()
  const g = c.createGain()
  osc.type = opts.type ?? 'sine'
  osc.frequency.setValueAtTime(freq, start)
  if (opts.slideTo) osc.frequency.exponentialRampToValueAtTime(opts.slideTo, start + dur)
  const v = opts.vol ?? 0.3
  g.gain.setValueAtTime(0.0001, start)
  g.gain.exponentialRampToValueAtTime(v, start + 0.015)
  g.gain.exponentialRampToValueAtTime(0.0001, start + dur)
  osc.connect(g)
  g.connect(opts.dest ?? master!)
  osc.start(start)
  osc.stop(start + dur + 0.05)
}

const NOTE = (n: number) => 440 * Math.pow(2, (n - 69) / 12)

const SFX: Record<SfxName, (t: number) => void> = {
  click: t => tone(660, t, 0.08, { type: 'triangle', vol: 0.18, slideTo: 880 }),
  flip: t => { tone(420, t, 0.09, { type: 'triangle', vol: 0.2, slideTo: 640 }) },
  pop: t => { tone(520, t, 0.12, { type: 'sine', vol: 0.3, slideTo: 1100 }); tone(1300, t + 0.02, 0.06, { type: 'triangle', vol: 0.1 }) },
  shoot: t => tone(300, t, 0.12, { type: 'sine', vol: 0.22, slideTo: 700 }),
  place: t => tone(330, t, 0.1, { type: 'sine', vol: 0.25, slideTo: 250 }),
  error: t => tone(220, t, 0.18, { type: 'sine', vol: 0.2, slideTo: 160 }),
  reward: t => [72, 76, 79, 84].forEach((n, i) => tone(NOTE(n), t + i * 0.08, 0.22, { type: 'triangle', vol: 0.22 })),
  win: t => [67, 72, 76, 79, 84].forEach((n, i) => tone(NOTE(n), t + i * 0.11, 0.35, { type: 'triangle', vol: 0.22 })),
  envelope: t => [76, 79, 83].forEach((n, i) => tone(NOTE(n), t + i * 0.14, 0.7, { type: 'sine', vol: 0.18 })),
  celebrate: t => [72, 76, 79, 84, 88, 91].forEach((n, i) => tone(NOTE(n), t + i * 0.1, 0.4, { type: 'triangle', vol: 0.2 })),
}

// Gentle original lullaby-style arpeggio in C major pentatonic (60-72-ish), 8-step phrases.
const PHRASES = [
  [72, 76, 79, 76, 74, 79, 76, 72],
  [69, 72, 76, 72, 71, 74, 79, 74],
  [67, 71, 74, 71, 72, 76, 79, 76],
  [72, 79, 76, 74, 72, 74, 76, 72],
]
const BASS = [48, 45, 43, 48]

function musicTick() {
  if (!ctx || !musicGain) return
  const phrase = Math.floor(musicStep / 8) % PHRASES.length
  const step = musicStep % 8
  const t = ctx.currentTime + 0.05
  tone(NOTE(PHRASES[phrase]![step]!), t, 0.9, { type: 'sine', vol: 0.22, dest: musicGain })
  if (step === 0) tone(NOTE(BASS[phrase]!), t, 3.2, { type: 'triangle', vol: 0.12, dest: musicGain })
  musicStep++
}

export function useSound() {
  const { settings } = useSettings()

  const setVolume = () => { if (master) master.gain.value = settings.value.volume }

  function play(name: SfxName) {
    if (!settings.value.sound) return
    const c = ensureCtx()
    if (!c || !master) return
    setVolume()
    SFX[name](c.currentTime)
  }

  function startMusic() {
    if (musicRunning) return
    const c = ensureCtx()
    if (!c) return
    setVolume()
    musicRunning = true
    musicTimer = setInterval(musicTick, 650)
  }
  function stopMusic() {
    musicRunning = false
    if (musicTimer) clearInterval(musicTimer)
    musicTimer = null
  }

  /** Music only ever starts from a user gesture. */
  function syncMusic() {
    if (settings.value.music && !document.hidden) startMusic()
    else stopMusic()
  }

  function haptic(ms = 12) {
    if (!settings.value.vibration) return
    try { navigator.vibrate?.(ms) } catch { /* unsupported */ }
  }

  return { play, startMusic, stopMusic, syncMusic, haptic, setVolume }
}
