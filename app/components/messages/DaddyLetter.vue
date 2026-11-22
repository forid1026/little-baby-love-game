<script setup lang="ts">
// A heart-themed message card. Used for the envelope reveal, Mommy's list and Daddy's preview.
import { designById, categoryById } from '~/data/daddy'

const props = defineProps<{ title: string; body: string; signature?: string; design: string; special?: boolean; category?: string }>()
const d = computed(() => designById(props.design))
</script>

<template>
  <article class="relative overflow-hidden rounded-[28px] p-6 text-left shadow-lg" :style="{ background: d.bg, color: d.ink }">
    <span class="absolute -top-3 -right-2 text-7xl opacity-20" aria-hidden="true">{{ d.deco }}</span>
    <span class="absolute -bottom-4 -left-2 text-6xl opacity-15" aria-hidden="true">{{ d.deco }}</span>
    <p v-if="special" class="text-xs font-extrabold tracking-widest uppercase mb-1" :style="{ color: d.accent }">★ Extra special</p>
    <p v-if="category" class="text-xs font-bold mb-1 opacity-70">{{ categoryById(category).icon }} {{ categoryById(category).label }}</p>
    <h3 class="font-black text-xl mb-2" style="line-height: 1.15">{{ title || 'Untitled message' }}</h3>
    <p class="whitespace-pre-line" style="line-height: 1.55; font-size: 1.02rem; overflow-wrap: anywhere">{{ body || 'Your message will appear here…' }}</p>
    <p v-if="signature" class="mt-4 font-extrabold text-right" :style="{ color: d.accent }">— {{ signature }} ❤</p>
  </article>
</template>
