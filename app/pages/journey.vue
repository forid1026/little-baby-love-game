<script setup lang="ts">
import { uid } from '~/utils/misc'

// Entertainment only: no medical information or predictions are given or collected.
const j = useModule('journey')
const room = useModule('room')
const game = useModule('game')
const toast = useToast()
const { play } = useSound()

const note = ref('')
const memory = ref('')
const confirmDel = ref<{ list: 'notes' | 'memories'; id: string } | null>(null)

const MILESTONES = [
  { id: 'nickname', label: 'Chose a nickname for baby' },
  { id: 'told', label: 'Shared the happy news with family' },
  { id: 'name-ideas', label: 'Started a list of name ideas' },
  { id: 'first-outfit', label: 'Picked the very first outfit' },
  { id: 'room', label: 'Started decorating the baby room' },
  { id: 'lullaby', label: 'Sang or hummed a lullaby' },
  { id: 'bag', label: 'Packed a little bag' },
  { id: 'letter', label: 'Wrote a letter to baby' },
  { id: 'photo', label: 'Took a family photo' },
  { id: 'cozy', label: 'Had a cozy day of pure rest' },
]
const done = (id: string) => j.value.milestones.includes(id) || (id === 'nickname' && !!j.value.nickname) || (id === 'room' && room.value.placed.length > 3)
function toggle(id: string) { const i = j.value.milestones.indexOf(id); if (i >= 0) j.value.milestones.splice(i, 1); else { j.value.milestones.push(id); play('reward') } }
function bump(n: number) { j.value.week = Math.min(42, Math.max(1, (j.value.week ?? 12) + n)) }
function add(list: 'notes' | 'memories') {
  const ref_ = list === 'notes' ? note : memory
  const t = ref_.value.trim()
  if (!t) return
  j.value[list].unshift({ id: uid('j'), text: t.slice(0, 600), date: localDateKey() })
  ref_.value = ''
  toast.show('Saved ♥'); play('reward')
}
function del() { const d = confirmDel.value; if (d) j.value[d.list] = j.value[d.list].filter(x => x.id !== d.id); confirmDel.value = null }
const doneCount = computed(() => MILESTONES.filter(m => done(m.id)).length)
void game
</script>

<template>
  <div>
    <PageHeader title="Baby Journey" subtitle="Our little story, in our own words" back />

    <section class="card card-pad mb-4">
      <label class="label" for="nick" style="margin-top: 0">Baby's nickname</label>
      <input id="nick" v-model="j.nickname" class="field" maxlength="24" placeholder="Little Peanut" autocomplete="off">
      <p class="label">Pregnancy week (set it yourself)</p>
      <div class="flex items-center gap-3">
        <button class="icon-btn" aria-label="Previous week" :disabled="!j.week" @click="bump(-1)"><Icon name="minus" /></button>
        <p class="flex-1 text-center h1">{{ j.week ? `Week ${j.week}` : 'Not set' }}</p>
        <button class="icon-btn" aria-label="Next week" @click="bump(1)"><Icon name="plus" /></button>
      </div>
      <button v-if="j.week" class="btn btn-ghost btn-sm w-full mt-1" @click="j.week = null">Clear week</button>
      <p class="muted text-xs mt-3">This journey is just for fun and memories. It does not give medical advice or predictions. For anything about health, please talk to your doctor or midwife. 💕</p>
    </section>

    <section class="card card-pad mb-4">
      <div class="flex items-center justify-between"><h2 class="h2">Family milestones</h2><span class="chip text-sm">{{ doneCount }}/{{ MILESTONES.length }}</span></div>
      <ul class="m-0 mt-2 list-none p-0">
        <li v-for="m in MILESTONES" :key="m.id">
          <button class="flex w-full items-center gap-3 rounded-2xl border-0 bg-transparent p-2 text-left" :aria-pressed="done(m.id)" :disabled="m.id === 'nickname' && !!j.nickname" @click="toggle(m.id)">
            <span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white" :style="{ background: done(m.id) ? 'var(--accent)' : '#E9DFE4' }"><Icon v-if="done(m.id)" name="check" :size="18" :sw="3" /></span>
            <span class="font-bold" :style="done(m.id) ? 'opacity:.7' : ''">{{ m.label }}</span>
          </button>
        </li>
      </ul>
    </section>

    <section v-for="s in ([{ k: 'memories', title: 'Favourite memories', ph: 'The day we...', ref: memory, icon: '📸' }, { k: 'notes', title: 'Personal notes', ph: 'A thought for baby...', ref: note, icon: '📝' }] as const)" :key="s.k" class="card card-pad mb-4">
      <h2 class="h2 mb-2">{{ s.icon }} {{ s.title }}</h2>
      <textarea v-if="s.k === 'memories'" v-model="memory" class="field" rows="2" maxlength="600" :placeholder="s.ph" :aria-label="s.title" />
      <textarea v-else v-model="note" class="field" rows="2" maxlength="600" :placeholder="s.ph" :aria-label="s.title" />
      <button class="btn btn-primary btn-sm mt-2" :disabled="!(s.k === 'memories' ? memory : note).trim()" @click="add(s.k)"><Icon name="plus" :size="18" /> Add</button>
      <ul class="m-0 mt-3 flex list-none flex-col gap-2 p-0">
        <li v-for="n in j[s.k]" :key="n.id" class="flex gap-2 rounded-2xl p-3" style="background: #FFF8EF">
          <div class="flex-1 min-w-0"><p class="text-xs font-bold muted">{{ shortDate(n.date) }}</p><p class="font-semibold whitespace-pre-line" style="overflow-wrap: anywhere">{{ n.text }}</p></div>
          <button class="icon-btn shrink-0" style="width: 40px; height: 40px; color: #C0455B" aria-label="Delete" @click="confirmDel = { list: s.k, id: n.id }"><Icon name="trash" :size="18" /></button>
        </li>
      </ul>
      <p v-if="!j[s.k].length" class="muted text-sm mt-2">Nothing here yet. Your first entry will be a keepsake. 💕</p>
    </section>

    <ConfirmDialog :open="!!confirmDel" title="Delete this entry?" message="This cannot be undone." confirm-label="Delete" danger @confirm="del" @cancel="confirmDel = null" />
  </div>
</template>
