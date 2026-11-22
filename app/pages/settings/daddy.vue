<script setup lang="ts">
// Daddy Mode: the message management dashboard (PIN-protected, works offline on web and Android).
import type { DaddyMessage, DaddyMode } from '~/types'
import { categoryById } from '~/data/daddy'
import { FREQUENCY_LABEL } from '~/composables/useDaddyMessages'

definePageMeta({ layout: 'game' })
const api = useDaddyMessages()
const daddy = useModule('daddy')
const router = useRouter()
const toast = useToast()
const { play } = useSound()

onMounted(() => { if (!api.isUnlocked()) router.replace('/settings') })

const filter = ref<'all' | DaddyMode | 'draft'>('all')
const editing = ref<DaddyMessage | null>(null)
const editorOpen = ref(false)
const previewing = ref<DaddyMessage | null>(null)
const envelopeDemo = ref<DaddyMessage | null>(null)
const deleting = ref<DaddyMessage | null>(null)
const pinMode = ref<'change' | null>(null)
const confirmRemovePin = ref(false)

const stats = computed(() => {
  const m = daddy.value.messages
  return { total: m.length, published: m.filter(x => x.published).length, waiting: m.filter(x => x.published && !x.seenAt).length, opened: m.filter(x => x.seenAt).length }
})
const list = computed(() => daddy.value.messages.filter((m) => {
  if (filter.value === 'all') return true
  if (filter.value === 'draft') return !m.published
  return m.mode === filter.value
}))
const filters = [['all', 'All'], ['daily', 'Daily'], ['date', 'Dated'], ['manual', 'Manual'], ['draft', 'Drafts']] as const
const modeText = (m: DaddyMessage) => (m.mode === 'daily' ? 'Daily surprise' : m.mode === 'date' ? `On ${shortDate(m.scheduledDate)}` : 'Manual')
const tone = { ok: '#E5F7EC', wait: '#FFF4D6', off: '#EFE9EC', done: '#E8F0FF' } as const

function newMessage() { editing.value = null; editorOpen.value = true }
function edit(m: DaddyMessage) { editing.value = m; editorOpen.value = true }
function onSave(input: Parameters<typeof api.save>[0]) {
  api.save(input)
  editorOpen.value = false
  toast.show('Message saved ♥'); play('reward')
}
function togglePublish(m: DaddyMessage) { api.setPublished(m.id, !m.published); toast.show(m.published ? 'Published' : 'Moved to drafts') }
function send(m: DaddyMessage) { api.sendNow(m.id); toast.show('Sent! Mommy will see an envelope next time she opens the app 💌'); play('reward') }
function resend(m: DaddyMessage) { api.resend(m.id); toast.show('Will surprise Mommy again 💌') }
function doDelete() { if (deleting.value) { api.remove(deleting.value.id); toast.show('Deleted') } deleting.value = null }
function lock() { api.lockNow(); router.replace('/settings') }
function removePin() { api.removePin(); confirmRemovePin.value = false; toast.show('PIN removed. Daddy Mode is now open to anyone.', 'warn'); router.replace('/settings') }
function demo() {
  const now = new Date().toISOString()
  envelopeDemo.value = { id: 'demo', title: 'Envelope preview', body: 'This is how the surprise looks for Mommy. Your message will appear here. ❤️', signature: 'Daddy', category: 'love', design: 'rose', mode: 'manual', scheduledDate: null, queued: false, special: true, published: true, createdAt: now, updatedAt: now, seenAt: null }
}
</script>

<template>
  <div>
    <GameHeader title="Daddy Mode" subtitle="Daddy's Secret Messages" @back="router.replace('/settings')" />

    <section class="card card-pad mb-4" style="background: linear-gradient(135deg, #FFF1F6, #F1EAFF)">
      <div class="grid grid-cols-4 gap-2 text-center">
        <div v-for="s in ([['Total', stats.total], ['Published', stats.published], ['Waiting', stats.waiting], ['Opened', stats.opened]] as const)" :key="s[0]">
          <p class="h1" style="color: var(--accent-dark)">{{ s[1] }}</p><p class="muted text-xs font-bold">{{ s[0] }}</p>
        </div>
      </div>
      <button class="btn btn-primary w-full mt-4" @click="newMessage"><Icon name="plus" :size="20" /> Write a new message</button>
    </section>

    <div class="mb-3 flex gap-2 overflow-x-auto pb-1" role="tablist" style="scrollbar-width: none">
      <button v-for="f in filters" :key="f[0]" role="tab" :aria-selected="filter === f[0]" class="chip shrink-0" :style="filter === f[0] ? 'background:var(--accent);color:#fff' : ''" @click="filter = f[0]">{{ f[1] }}</button>
    </div>

    <EmptyState v-if="!list.length" title="No messages here" text="Tap “Write a new message” to add one." icon="✍️" />
    <ul v-else class="m-0 mb-4 flex list-none flex-col gap-3 p-0">
      <li v-for="m in list" :key="m.id" class="card p-4 fade-up">
        <div class="flex items-start gap-2">
          <div class="min-w-0 flex-1">
            <h3 class="font-black truncate">{{ m.special ? '★ ' : '' }}{{ m.title }}</h3>
            <p class="muted text-sm" style="display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden">{{ m.body }}</p>
          </div>
        </div>
        <div class="mt-2 flex flex-wrap gap-1.5 text-xs font-extrabold">
          <span class="rounded-full px-2.5 py-1" :style="{ background: tone[api.statusOf(m).tone] }">{{ api.statusOf(m).label }}</span>
          <span class="rounded-full bg-white px-2.5 py-1" style="box-shadow: inset 0 0 0 1.5px #F1E4EA">{{ categoryById(m.category).icon }} {{ categoryById(m.category).label }}</span>
          <span class="rounded-full bg-white px-2.5 py-1" style="box-shadow: inset 0 0 0 1.5px #F1E4EA">{{ modeText(m) }}</span>
        </div>
        <div class="mt-3 flex flex-wrap gap-2">
          <button class="btn btn-soft btn-sm" @click="previewing = m"><Icon name="eye" :size="16" /> Preview</button>
          <button class="btn btn-soft btn-sm" @click="edit(m)"><Icon name="edit" :size="16" /> Edit</button>
          <button class="btn btn-soft btn-sm" @click="togglePublish(m)">{{ m.published ? 'Unpublish' : 'Publish' }}</button>
          <button v-if="m.mode === 'manual' && !m.seenAt" class="btn btn-primary btn-sm" :disabled="m.queued && m.published" @click="send(m)"><Icon name="send" :size="16" /> {{ m.queued && m.published ? 'Queued' : 'Send now' }}</button>
          <button v-if="m.seenAt" class="btn btn-soft btn-sm" @click="resend(m)"><Icon name="restart" :size="16" /> Surprise again</button>
          <button class="btn btn-danger btn-sm" :aria-label="`Delete ${m.title}`" @click="deleting = m"><Icon name="trash" :size="16" /></button>
        </div>
      </li>
    </ul>

    <section class="card card-pad mb-4">
      <h2 class="h2 mb-1">Surprise settings</h2>
      <p class="font-extrabold mt-2 mb-1 text-sm">How often do daily surprises arrive?</p>
      <div class="grid grid-cols-2 gap-2">
        <button v-for="(label, k) in FREQUENCY_LABEL" :key="k" class="btn btn-sm" :class="daddy.surprise.frequency === k ? 'btn-primary' : 'btn-soft'" style="font-size: .8rem; padding: 0 8px" :aria-pressed="daddy.surprise.frequency === k" @click="daddy.surprise.frequency = k">{{ label }}</button>
      </div>
      <ToggleRow v-model="daddy.surprise.animations" label="Envelope animation" desc="Off shows the letter straight away, without the envelope." class="mt-2" />
      <button class="btn btn-soft btn-sm mt-1" @click="demo"><Icon name="envelope" :size="18" /> See the envelope (preview only)</button>
      <p class="muted text-xs mt-3">Mommy only ever sees published messages whose time has come, and each message surprises her just once. “Surprise again” brings one back.</p>
    </section>

    <section class="card card-pad mb-4">
      <h2 class="h2 mb-1">Backup messages</h2>
      <p class="muted text-sm mb-3">Export your messages to a JSON file and import them on another device.</p>
      <BackupPanel kind="daddy" />
    </section>

    <section class="card card-pad mb-4">
      <h2 class="h2 mb-1">Security</h2>
      <div class="flex flex-wrap gap-2 mt-2">
        <button class="btn btn-soft btn-sm" @click="pinMode = 'change'"><Icon name="lock" :size="16" /> Change PIN</button>
        <button class="btn btn-soft btn-sm" @click="lock"><Icon name="lock" :size="16" /> Lock now</button>
        <button class="btn btn-danger btn-sm" @click="confirmRemovePin = true">Remove PIN</button>
      </div>
      <ToggleRow v-model="daddy.hideEntry" label="Hide Daddy Mode in Settings" desc="Reveal it again by tapping the gear icon at the top of Settings 5 times." class="mt-2" />
    </section>

    <DaddyEditor :open="editorOpen" :message="editing" @close="editorOpen = false" @save="onSave" />
    <ModalSheet :open="!!previewing" title="Preview" wide @close="previewing = null">
      <DaddyLetter v-if="previewing" :title="previewing.title" :body="previewing.body" :signature="previewing.signature" :design="previewing.design" :special="previewing.special" :category="previewing.category" />
    </ModalSheet>
    <SurpriseEnvelope v-if="envelopeDemo" :message="envelopeDemo" :animated="daddy.surprise.animations" @close="envelopeDemo = null" />
    <ConfirmDialog :open="!!deleting" title="Delete this message?" :message="`“${deleting?.title}” will be removed for good. This cannot be undone.`" confirm-label="Delete" danger @confirm="doDelete" @cancel="deleting = null" />
    <ConfirmDialog :open="confirmRemovePin" title="Remove the PIN?" message="Anyone who opens Settings will be able to read and edit the messages." confirm-label="Remove PIN" danger @confirm="removePin" @cancel="confirmRemovePin = false" />
    <PinPad :open="pinMode === 'change'" mode="change" title="Change PIN" @done="pinMode = null; toast.show('PIN updated')" @cancel="pinMode = null" />
  </div>
</template>
