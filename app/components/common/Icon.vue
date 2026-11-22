<script setup lang="ts">
const props = withDefaults(defineProps<{ name: string; size?: number; sw?: number }>(), { size: 24, sw: 2.2 })

const P: Record<string, string> = {
  home: 'M3 11l9-8 9 8M5 10v10h14V10',
  games: 'M6 8h12a4 4 0 014 4v3a3 3 0 01-5 2l-1-2H8l-1 2a3 3 0 01-5-2v-3a4 4 0 014-4zM8 10v4M6 12h4M16 11h.01M18 13h.01',
  baby: 'M12 3a9 9 0 100 18 9 9 0 000-18zM8.5 10h.01M15.5 10h.01M8.5 14.5q3.5 3 7 0',
  heart: 'M12 20s-8-5-8-11a4.5 4.5 0 018-2.5A4.5 4.5 0 0120 9c0 6-8 11-8 11z',
  gear: 'M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12M20 18h0M14 4v4M8 10v4M16 16v4',
  back: 'M15 5l-7 7 7 7',
  pause: 'M8 5v14M16 5v14',
  play: 'M8 5l11 7-11 7z',
  restart: 'M20 12a8 8 0 11-3-6.2M20 4v5h-5',
  star: 'M12 3l2.6 5.6 6 .7-4.5 4.1 1.3 6L12 16.4 6.6 19.4l1.3-6L3.4 9.3l6-.7z',
  lock: 'M6 11h12v9H6zM8 11V8a4 4 0 118 0v3',
  check: 'M5 12l5 5 9-10',
  plus: 'M12 5v14M5 12h14',
  minus: 'M5 12h14',
  trash: 'M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13',
  edit: 'M4 20h4L19 9l-4-4L4 16zM13 7l4 4',
  volume: 'M4 9v6h4l5 4V5L8 9zM16 9a4 4 0 010 6M18.5 6.5a8 8 0 010 11',
  mute: 'M4 9v6h4l5 4V5L8 9zM17 9l5 6M22 9l-5 6',
  music: 'M9 18V6l11-2v12M9 18a3 3 0 11-6 0 3 3 0 016 0zM20 16a3 3 0 11-6 0 3 3 0 016 0z',
  close: 'M6 6l12 12M18 6L6 18',
  gift: 'M4 10h16v10H4zM3 7h18v3H3zM12 7v13M12 7C9 7 8 3 11 3s1 4 1 4zM12 7c3 0 4-4 1-4s-1 4-1 4z',
  trophy: 'M8 4h8v5a4 4 0 01-8 0zM8 6H4v1a4 4 0 004 4M16 6h4v1a4 4 0 01-4 4M12 13v4M8 20h8M10 17h4',
  export: 'M12 3v12M7 8l5-5 5 5M5 14v6h14v-6',
  import: 'M12 15V3M7 10l5 5 5-5M5 17v3h14v-3',
  book: 'M4 5a2 2 0 012-2h13v16H6a2 2 0 00-2 2zM4 19a2 2 0 012-2h13',
  envelope: 'M3 6h18v13H3zM3 7l9 7 9-7',
  shuffle: 'M3 7h4l10 10h4M3 17h4l3-3M14 10l3-3h4M18 4l3 3-3 3M18 14l3 3-3 3',
  eye: 'M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12zM12 9a3 3 0 100 6 3 3 0 000-6z',
  layers: 'M12 3l9 5-9 5-9-5zM3 13l9 5 9-5',
  calendar: 'M4 6h16v14H4zM4 10h16M8 3v4M16 3v4',
  info: 'M12 3a9 9 0 100 18 9 9 0 000-18zM12 11v6M12 7.5h.01',
  shield: 'M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z',
  chart: 'M4 20V10M10 20V4M16 20v-8M22 20H2',
  send: 'M3 11l18-8-8 18-2-8z',
  copy: 'M8 8h12v12H8zM4 16V4h12',
  zoom: 'M11 4a7 7 0 100 14 7 7 0 000-14zM20 20l-4-4',
  up: 'M12 19V5M6 11l6-6 6 6',
  wifi: 'M2 9a15 15 0 0120 0M5 12.5a10 10 0 0114 0M8.5 16a5 5 0 017 0M12 19.5h.01',
}
const filled = computed(() => props.name === 'play')
</script>

<template>
  <svg :width="size" :height="size" viewBox="0 0 24 24" aria-hidden="true" focusable="false"
    :fill="filled ? 'currentColor' : 'none'" stroke="currentColor" :stroke-width="sw" stroke-linecap="round" stroke-linejoin="round">
    <path :d="P[name] ?? P.info" />
  </svg>
</template>
