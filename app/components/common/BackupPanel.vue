<script setup lang="ts">
// Export / import as JSON file (share sheet on Android, download on web) plus copy/paste as a fallback.
const props = defineProps<{ kind: 'full' | 'daddy' }>()
const backup = useBackup()
const daddy = useDaddyMessages()
const toast = useToast()
const { play } = useSound()

const pasteOpen = ref(false)
const pasted = ref('')
const pending = ref<string | null>(null) // full-backup text waiting for confirmation
const err = ref('')

const label = computed(() => (props.kind === 'full' ? 'backup' : 'messages backup'))
const text = () => (props.kind === 'full' ? backup.buildBackup() : daddy.exportJson())
const fileName = () => (props.kind === 'full' ? backup.fileName() : `daddy-messages-${localDateKey()}.json`)

async function exportFile() {
  try {
    const how = await saveTextFile(fileName(), text())
    toast.show(how === 'shared' ? 'Choose where to save the file' : 'Backup file downloaded')
  } catch { toast.show('Could not save the file. Try “Copy” instead.', 'warn') }
}
async function copy() { toast.show((await copyText(text())) ? 'Copied to clipboard' : 'Copy is not available here', 'warn') }

async function importFile() {
  const t = await pickTextFile()
  if (t) attempt(t)
}
function attempt(t: string) {
  err.value = ''
  try {
    if (props.kind === 'full') { backup.parseBackup(t); pending.value = t }
    else { const n = daddy.importJson(t); toast.show(`Imported ${n} message${n === 1 ? '' : 's'}`); play('reward'); pasteOpen.value = false; pasted.value = '' }
  } catch (e) { err.value = (e as Error).message; toast.show(err.value, 'warn') }
}
async function confirmRestore() {
  const t = pending.value
  pending.value = null
  if (!t) return
  try { await backup.restore(t); toast.show('Backup restored ♥'); play('reward'); pasteOpen.value = false; pasted.value = '' }
  catch (e) { toast.show((e as Error).message, 'warn') }
}
</script>

<template>
  <div>
    <div class="grid grid-cols-2 gap-2">
      <button class="btn btn-soft btn-sm" @click="exportFile"><Icon name="export" :size="18" /> Export file</button>
      <button class="btn btn-soft btn-sm" @click="importFile"><Icon name="import" :size="18" /> Import file</button>
      <button class="btn btn-soft btn-sm" @click="copy"><Icon name="copy" :size="18" /> Copy as text</button>
      <button class="btn btn-soft btn-sm" @click="pasteOpen = true; err = ''"><Icon name="edit" :size="18" /> Paste to import</button>
    </div>

    <ModalSheet :open="pasteOpen" :title="`Paste ${label}`" wide @close="pasteOpen = false">
      <textarea v-model="pasted" class="field" rows="8" placeholder="Paste the JSON text here" aria-label="Backup JSON" />
      <p v-if="err" class="mt-2 text-sm font-bold" style="color: #C0455B" role="alert">{{ err }}</p>
      <button class="btn btn-primary w-full mt-3" :disabled="!pasted.trim()" @click="attempt(pasted)"><Icon name="import" :size="18" /> Import</button>
    </ModalSheet>

    <ConfirmDialog :open="!!pending" title="Restore this backup?" message="This replaces ALL current progress on this device (coins, room, outfits, notes and Daddy's messages) with the backup." confirm-label="Restore" danger @confirm="confirmRestore" @cancel="pending = null" />
  </div>
</template>
