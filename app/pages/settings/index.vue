<script setup lang="ts">
const { settings } = useSettings()
const daddy = useDaddyMessages()
const daddyState = useModule('daddy')
const install = useInstall()
const backup = useBackup()
const toast = useToast()
const { play, syncMusic, setVolume } = useSound()
const router = useRouter()

const pinMode = ref<'set' | 'verify' | null>(null)
const confirmReset = ref(false)
const taps = ref(0)
let tapTimer: ReturnType<typeof setTimeout> | undefined
const revealed = ref(false)
const showDaddy = computed(() => !daddyState.value.hideEntry || revealed.value)

// Hidden entry: tap the page title 5 times quickly to reveal Daddy Mode when it is hidden.
function titleTap() {
  taps.value++
  clearTimeout(tapTimer)
  tapTimer = setTimeout(() => { taps.value = 0 }, 2500)
  if (taps.value >= 5) { revealed.value = true; taps.value = 0; toast.show('Daddy Mode revealed 💙') }
}

function openDaddy() { pinMode.value = daddy.hasPin.value ? 'verify' : 'set' }
function pinDone() { pinMode.value = null; router.push('/settings/daddy') }

async function doReset() {
  confirmReset.value = false
  await backup.resetEverything()
  toast.show('Everything was reset')
  router.replace('/welcome')
}
const themes = [['blush', '#F4BFD3', 'Blush'], ['lavender', '#CDBBFA', 'Lavender'], ['sky', '#BFE0F8', 'Sky'], ['peach', '#FFD2B9', 'Peach']] as const
const storage = useStorageMode()
</script>

<template>
  <div>
    <PageHeader title="Settings" :subtitle="'Make it cozy'">
      <template #right><button class="icon-btn" aria-label="Settings" @click="titleTap"><Icon name="gear" /></button></template>
    </PageHeader>

    <section class="card card-pad mb-4" aria-label="Sound and feel">
      <h2 class="h2 mb-1">Sound & feel</h2>
      <ToggleRow v-model="settings.sound" label="Sound effects" desc="Soft pops, flips and chimes" @update:model-value="play('click')" />
      <ToggleRow v-model="settings.music" label="Background music" desc="A gentle lullaby (starts only when you tap)" @update:model-value="syncMusic" />
      <div class="px-2 py-2">
        <label class="font-extrabold" for="vol">Volume · {{ Math.round(settings.volume * 100) }}%</label>
        <input id="vol" v-model.number="settings.volume" type="range" min="0" max="1" step="0.05" class="w-full" style="accent-color: var(--accent); height: 32px" @input="setVolume" @change="play('pop')">
      </div>
      <ToggleRow v-model="settings.vibration" label="Vibration" desc="Tiny buzzes on supported phones" />
      <div class="px-2 pt-2">
        <p class="font-extrabold mb-1">Animations</p>
        <div class="seg" role="group" aria-label="Animations">
          <button v-for="m in (['auto', 'on', 'off'] as const)" :key="m" :aria-pressed="settings.motion === m" @click="settings.motion = m">{{ m === 'auto' ? 'Auto' : m === 'on' ? 'On' : 'Off' }}</button>
        </div>
        <p class="muted text-xs mt-1">Auto follows your device's reduce-motion setting.</p>
      </div>
      <div class="px-2 pt-3">
        <p class="font-extrabold mb-2">Theme</p>
        <div class="flex gap-3">
          <button v-for="t in themes" :key="t[0]" class="h-12 w-12 rounded-full border-0" :aria-label="`${t[2]} theme`" :aria-pressed="settings.theme === t[0]"
            :style="{ background: t[1], boxShadow: settings.theme === t[0] ? '0 0 0 3px #fff, 0 0 0 6px var(--accent)' : '0 0 0 2px #fff' }" @click="settings.theme = t[0]; play('click')" />
        </div>
      </div>
    </section>

    <section class="card card-pad mb-4" aria-label="Offline and install">
      <h2 class="h2 mb-1">Offline & install</h2>
      <p class="flex items-center gap-2 font-bold"><Icon name="wifi" :size="20" /> {{ install.isNative.value ? 'Bundled inside the app. Always works offline.' : install.offlineReady.value ? 'Offline ready ✓ you can play without internet' : 'Getting ready for offline use… (open once while online)' }}</p>
      <p class="muted text-xs mt-1">Data is stored on this device using {{ storage === 'indexeddb' ? 'IndexedDB' : storage === 'localstorage' ? 'localStorage (fallback)' : 'temporary memory (storage blocked!)' }}.</p>
      <div v-if="!install.installed.value" class="mt-3">
        <button v-if="install.canInstall.value" class="btn btn-primary btn-sm" @click="install.install()"><Icon name="import" :size="18" /> Install app</button>
        <p v-else class="muted text-sm">To install: open your browser menu and choose “Install app” or “Add to Home screen”.</p>
      </div>
      <p v-else-if="!install.isNative.value" class="mt-2 font-bold" style="color: var(--accent-dark)">Installed ✓</p>
    </section>

    <section v-if="showDaddy" class="card card-pad mb-4" style="background: linear-gradient(135deg, #FFF1F6, #F1EAFF)" aria-label="Daddy Mode">
      <h2 class="h2">💙 Daddy Mode</h2>
      <p class="muted text-sm mb-3">Write and manage Daddy's Secret Messages. Protected by a PIN.</p>
      <button class="btn btn-primary w-full" @click="openDaddy"><Icon name="lock" :size="18" /> {{ daddy.hasPin.value ? 'Open Daddy Mode' : 'Set up Daddy Mode' }}</button>
    </section>

    <section class="card card-pad mb-4" aria-label="Backup and restore">
      <h2 class="h2 mb-1">Backup & restore</h2>
      <p class="muted text-sm mb-3">Save all progress, rooms, outfits, notes and Daddy's messages to a file, and bring them back any time.</p>
      <BackupPanel kind="full" />
    </section>

    <section class="card card-pad mb-4">
      <h2 class="h2 mb-1">Privacy</h2>
      <p class="muted text-sm">No account, no ads, no tracking. Everything you do stays on this device. Nothing is sent anywhere.</p>
      <div class="mt-3 flex flex-wrap gap-2">
        <NuxtLink to="/about" class="btn btn-soft btn-sm no-underline"><Icon name="info" :size="18" /> About the app</NuxtLink>
        <button class="btn btn-danger btn-sm" @click="confirmReset = true"><Icon name="trash" :size="18" /> Reset progress</button>
      </div>
    </section>

    <PinPad :open="pinMode !== null" :mode="pinMode ?? 'verify'" :title="pinMode === 'set' ? 'Set up Daddy Mode' : 'Daddy Mode'" @done="pinDone" @cancel="pinMode = null" />
    <ConfirmDialog :open="confirmReset" title="Reset everything?" message="This erases coins, stars, rooms, outfits, notes, achievements AND Daddy's messages and PIN on this device. Export a backup first if you might want them back." confirm-label="Yes, reset all" danger @confirm="doReset" @cancel="confirmReset = false" />
  </div>
</template>
