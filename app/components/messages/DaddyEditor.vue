<script setup lang="ts">
import type { DaddyMessage, DaddyMode, DaddyCategory } from '~/types'
import { CARD_DESIGNS, CATEGORIES } from '~/data/daddy'

const props = defineProps<{ open: boolean; message: DaddyMessage | null }>()
const emit = defineEmits<{ close: []; save: [m: Partial<DaddyMessage> & { title: string; body: string }] }>()
const { today } = useDaddyMessages()

const f = reactive({
  title: '', body: '', signature: 'Daddy', category: 'love' as DaddyCategory, design: 'rose', mode: 'daily' as DaddyMode,
  scheduledDate: '', special: false, published: true,
})
const error = ref('')

watch(() => props.open, (v) => {
  if (!v) return
  const m = props.message
  Object.assign(f, m
    ? { title: m.title, body: m.body, signature: m.signature, category: m.category, design: m.design, mode: m.mode, scheduledDate: m.scheduledDate ?? '', special: m.special, published: m.published }
    : { title: '', body: '', signature: 'Daddy', category: 'love', design: 'rose', mode: 'daily', scheduledDate: '', special: false, published: true })
  error.value = ''
}, { immediate: true })

const modeInfo: Record<DaddyMode, string> = {
  daily: 'Joins the surprise rotation. It arrives in an envelope on one of Mommy\'s app visits (based on your frequency setting).',
  date: 'Stays hidden until the date you choose, then arrives as an envelope the next time Mommy opens the app.',
  manual: 'Stays hidden until you tap “Send now” on the dashboard.',
}

function submit() {
  if (!f.title.trim()) { error.value = 'Please add a title.'; return }
  if (!f.body.trim()) { error.value = 'Please write your message.'; return }
  if (f.mode === 'date' && !/^\d{4}-\d{2}-\d{2}$/.test(f.scheduledDate)) { error.value = 'Please pick the date this message should arrive.'; return }
  emit('save', { id: props.message?.id, title: f.title, body: f.body, signature: f.signature.trim() || 'Daddy', category: f.category, design: f.design, mode: f.mode, scheduledDate: f.mode === 'date' ? f.scheduledDate : null, special: f.special, published: f.published })
}
</script>

<template>
  <ModalSheet :open="open" :title="message ? 'Edit message' : 'New message'" wide @close="emit('close')">
    <label class="label" for="de-t" style="margin-top: 0">Title</label>
    <input id="de-t" v-model="f.title" class="field" maxlength="80" placeholder="Good morning, my love">

    <label class="label" for="de-b">Message <span class="muted font-semibold">({{ f.body.length }}/1500)</span></label>
    <textarea id="de-b" v-model="f.body" class="field" rows="5" maxlength="1500" placeholder="Write from your heart…" />

    <label class="label" for="de-s">Signature</label>
    <input id="de-s" v-model="f.signature" class="field" maxlength="40" placeholder="Daddy">

    <p class="label">Category</p>
    <div class="flex flex-wrap gap-2">
      <button v-for="c in CATEGORIES" :key="c.id" class="chip" :aria-pressed="f.category === c.id" :style="f.category === c.id ? 'background:var(--accent);color:#fff' : ''" @click="f.category = c.id">{{ c.icon }} {{ c.label }}</button>
    </div>

    <p class="label">Card design</p>
    <div class="flex flex-wrap gap-3">
      <button v-for="d in CARD_DESIGNS" :key="d.id" class="h-11 w-11 rounded-2xl border-0" :aria-label="d.name" :aria-pressed="f.design === d.id"
        :style="{ background: d.bg, boxShadow: f.design === d.id ? '0 0 0 3px #fff, 0 0 0 6px ' + d.accent : '0 0 0 2px #fff' }" @click="f.design = d.id" />
    </div>

    <p class="label">When should Mommy get it?</p>
    <div class="seg" role="group" aria-label="Delivery">
      <button :aria-pressed="f.mode === 'daily'" style="font-size: .8rem" @click="f.mode = 'daily'">Daily surprise</button>
      <button :aria-pressed="f.mode === 'date'" style="font-size: .8rem" @click="f.mode = 'date'">On a date</button>
      <button :aria-pressed="f.mode === 'manual'" style="font-size: .8rem" @click="f.mode = 'manual'">Manual</button>
    </div>
    <p class="muted text-xs mt-2">{{ modeInfo[f.mode] }}</p>
    <template v-if="f.mode === 'date'">
      <label class="label" for="de-d">Arrival date</label>
      <input id="de-d" v-model="f.scheduledDate" type="date" class="field" :min="today">
    </template>

    <ToggleRow v-model="f.special" label="Extra special ★" desc="Special messages get a golden touch and are chosen a little more often." class="mt-2" />
    <ToggleRow v-model="f.published" label="Published" desc="Turn off to keep it as a private draft. Unpublished messages never reach Mommy." />

    <p class="label">Preview</p>
    <DaddyLetter :title="f.title" :body="f.body" :signature="f.signature" :design="f.design" :special="f.special" :category="f.category" />

    <p v-if="error" class="mt-3 text-center font-extrabold" style="color: #C0455B" role="alert">{{ error }}</p>
    <div class="mt-4 flex gap-3">
      <button class="btn btn-soft flex-1" @click="emit('close')">Cancel</button>
      <button class="btn btn-primary flex-1" @click="submit"><Icon name="check" :size="20" /> Save message</button>
    </div>
  </ModalSheet>
</template>
