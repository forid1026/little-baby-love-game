<script setup lang="ts">
definePageMeta({ layout: 'game' })
const game = useModule('game')
const journey = useModule('journey')
const name = ref(game.value.mommyName === 'Mommy' ? '' : game.value.mommyName)
const nick = ref(journey.value.nickname)
const { play } = useSound()

function start() {
  game.value.mommyName = name.value.trim().slice(0, 20) || 'Mommy'
  journey.value.nickname = nick.value.trim().slice(0, 24)
  game.value.welcomed = true
  play('reward')
  navigateTo('/')
}
</script>

<template>
  <div class="text-center">
    <div class="relative card overflow-hidden px-6 pt-8 pb-6 mb-4" style="background: linear-gradient(160deg, #FFE3EE, #E8DFFF)">
      <FloatingHearts :count="10" />
      <div class="w-48 mx-auto"><BabyAvatar bounce :equipped="{ outfit: 'outfit_tutu', hat: 'hat_flowers', shoes: 'shoes_maryjane', acc: 'acc_bowtie' }" /></div>
      <h1 class="h1 mt-3" style="font-size: 1.9rem; color: var(--accent-dark)">Little Baby Love</h1>
      <p class="font-extrabold">Mommy's Happy World</p>
      <p class="muted mt-2">A little world full of love, made just for you. Relax, play, and smile. No pressure, no ads, no internet needed.</p>
    </div>
    <div class="card card-pad text-left">
      <label class="label" for="mn">What should we call you? (optional)</label>
      <input id="mn" v-model="name" class="field" maxlength="20" placeholder="Mommy" autocomplete="off">
      <label class="label" for="bn">Baby's nickname (optional)</label>
      <input id="bn" v-model="nick" class="field" maxlength="24" placeholder="Little Peanut" autocomplete="off">
      <button class="btn btn-primary w-full mt-5" @click="start"><Icon name="heart" :size="20" /> Let's begin</button>
      <p class="muted text-xs text-center mt-3">Everything stays on this device. You can change these any time.</p>
    </div>
  </div>
</template>
