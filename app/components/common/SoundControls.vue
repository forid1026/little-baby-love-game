<script setup lang="ts">
const { settings } = useSettings()
const { play, syncMusic } = useSound()

function toggleSound() { settings.value.sound = !settings.value.sound; play('click') }
function toggleMusic() { settings.value.music = !settings.value.music; syncMusic() }
</script>

<template>
  <div class="flex gap-2">
    <button class="icon-btn" :aria-pressed="settings.sound" :aria-label="settings.sound ? 'Mute sound effects' : 'Unmute sound effects'" @click="toggleSound">
      <Icon :name="settings.sound ? 'volume' : 'mute'" />
    </button>
    <button class="icon-btn" :style="settings.music ? '' : 'opacity:.55'" :aria-pressed="settings.music" :aria-label="settings.music ? 'Turn music off' : 'Turn music on'" @click="toggleMusic">
      <Icon name="music" />
    </button>
  </div>
</template>
