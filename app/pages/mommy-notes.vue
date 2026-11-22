<script setup lang="ts">
import type { LoveNote } from '~/data/messages'

const api = useMommyNotes()
const { play, haptic } = useSound()
const toast = useToast()
const confirmDel = ref<string | null>(null)

const tab = ref<'all' | 'favs' | 'mine'>('all')
const surprise = ref<LoveNote | null>(null)
const draft = ref('')
const kindLabel = { baby: 'From Baby', love: 'For Mommy', quote: 'Sweet quote' } as const
const kindBg = { baby: 'linear-gradient(135deg,#FFE3EE,#FFD0E1)', love: 'linear-gradient(135deg,#F1EAFF,#E0D3FF)', quote: 'linear-gradient(135deg,#E6F4FF,#CFE6FA)' } as const
const hearts = ref(0)

function surpriseMe() { surprise.value = api.randomNote(surprise.value?.id); hearts.value++; play('reward'); haptic(15) }
function fav(id: string) { api.toggleFavorite(id); play('click'); haptic(8) }
function addNote() { if (!draft.value.trim()) return; api.addPersonal(draft.value); draft.value = ''; toast.show('Note saved ♥'); play('reward') }
const list = computed(() => (tab.value === 'favs' ? api.favoriteNotes.value : api.notes))
</script>

<template>
  <div>
    <PageHeader title="Mommy's Love Notes" subtitle="Little words, big love" back />

    <section class="relative card overflow-hidden px-5 py-6 mb-4 text-center" style="background: linear-gradient(135deg, #FFE3EE, #E8DFFF)" aria-live="polite">
      <FloatingHearts :key="hearts" :count="surprise ? 14 : 6" />
      <p class="text-xs font-extrabold tracking-widest uppercase" style="color: var(--accent-dark)">{{ surprise ? 'A surprise for you' : 'Today\'s love note' }}</p>
      <p class="font-black my-3" style="font-size: 1.25rem; line-height: 1.35">“{{ (surprise ?? api.dailyNote.value).text }}”</p>
      <div class="flex justify-center gap-2">
        <button class="btn btn-primary btn-sm" @click="surpriseMe"><Icon name="gift" :size="18" /> Surprise me</button>
        <button class="btn btn-soft btn-sm" :aria-pressed="api.isFavorite((surprise ?? api.dailyNote.value).id)" @click="fav((surprise ?? api.dailyNote.value).id)">
          {{ api.isFavorite((surprise ?? api.dailyNote.value).id) ? '♥ Saved' : '♡ Save' }}
        </button>
      </div>
    </section>

    <div class="seg mb-3" role="tablist">
      <button v-for="t in ([['all', 'All'], ['favs', 'Favourites'], ['mine', 'My notes']] as const)" :key="t[0]" role="tab" :aria-pressed="tab === t[0]" @click="tab = t[0]">{{ t[1] }}</button>
    </div>

    <template v-if="tab !== 'mine'">
      <EmptyState v-if="!list.length" title="No favourites yet" text="Tap the heart on a note to keep it here." icon="💞" />
      <ul v-else class="m-0 list-none p-0 flex flex-col gap-3">
        <li v-for="n in list" :key="n.id" class="card flex items-start gap-3 p-4 fade-up" :style="{ background: kindBg[n.kind] }">
          <div class="flex-1 min-w-0">
            <p class="text-xs font-extrabold tracking-wide uppercase muted mb-1">{{ kindLabel[n.kind] }}</p>
            <p class="font-bold" style="line-height: 1.4">{{ n.text }}</p>
          </div>
          <button class="icon-btn shrink-0" style="width: 44px; height: 44px" :aria-label="api.isFavorite(n.id) ? 'Remove from favourites' : 'Add to favourites'" :aria-pressed="api.isFavorite(n.id)" @click="fav(n.id)">
            <span class="text-xl" :style="{ color: api.isFavorite(n.id) ? '#E27AA3' : '#C9B7C0' }">{{ api.isFavorite(n.id) ? '♥' : '♡' }}</span>
          </button>
        </li>
      </ul>
    </template>

    <template v-else>
      <div class="card card-pad mb-3">
        <label class="label" for="pn" style="margin-top: 0">Write your own note</label>
        <textarea id="pn" v-model="draft" class="field" rows="3" maxlength="600" placeholder="Today I felt..." />
        <button class="btn btn-primary w-full mt-3" :disabled="!draft.trim()" @click="addNote"><Icon name="plus" :size="18" /> Save note</button>
      </div>
      <EmptyState v-if="!api.personal.value.length" title="Your notes live here" text="Write down a thought, a wish or a memory." icon="📝" />
      <ul v-else class="m-0 list-none p-0 flex flex-col gap-3">
        <li v-for="n in api.personal.value" :key="n.id" class="card p-4 flex gap-3">
          <div class="flex-1 min-w-0"><p class="text-xs font-bold muted">{{ shortDate(n.date) }}</p><p class="font-bold whitespace-pre-line" style="overflow-wrap: anywhere">{{ n.text }}</p></div>
          <button class="icon-btn shrink-0" style="width: 40px; height: 40px; color: #C0455B" aria-label="Delete note" @click="confirmDel = n.id"><Icon name="trash" :size="18" /></button>
        </li>
      </ul>
    </template>

    <ConfirmDialog :open="!!confirmDel" title="Delete this note?" message="This cannot be undone." confirm-label="Delete" danger @confirm="api.removePersonal(confirmDel!); confirmDel = null" @cancel="confirmDel = null" />
  </div>
</template>
