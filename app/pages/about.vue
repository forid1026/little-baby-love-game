<script setup lang="ts">
const install = useInstall()
</script>

<template>
  <div class="text-center">
    <PageHeader title="About" back />
    <div class="card card-pad">
      <div class="mx-auto w-36"><BabyAvatar bounce :equipped="{ outfit: 'outfit_onesie', hat: 'hat_bear', shoes: 'shoes_socks' }" /></div>
      <h2 class="h1 mt-2" style="color: var(--accent-dark)">Little Baby Love</h2>
      <p class="font-extrabold">Mommy's Happy World</p>
      <p class="muted">A Little World Full of Love.</p>
      <p class="muted text-sm mt-4" style="line-height: 1.5">Made with love as a gift for a very special Mommy-to-be. Four cozy games, sweet notes, and little surprises from Daddy. No ads, no purchases, no accounts, and it all works without internet.</p>
      <ul class="m-0 mt-4 list-none p-0 text-left text-sm font-bold" style="line-height: 1.9">
        <li>🔒 Everything is saved only on this device.</li>
        <li>📡 {{ install.isNative.value ? 'Runs fully offline inside the Android app.' : 'Works offline after the first visit.' }}</li>
        <li>🩺 Not medical software: the Baby Journey is just for fun and memories.</li>
        <li>🎨 All artwork and sounds are original and bundled with the app.</li>
      </ul>
      <p class="muted text-xs mt-4">Version 1.0.0</p>
    </div>
  </div>
</template>
