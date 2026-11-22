<script setup lang="ts">
// On-screen PIN entry (works with touch and keyboard). mode "set" asks twice; "verify" checks the saved PIN.
const props = defineProps<{ open: boolean; mode: 'set' | 'verify' | 'change'; title?: string }>()
const emit = defineEmits<{ done: []; cancel: [] }>()
const api = useDaddyMessages()
const { play } = useSound()

const pin = ref('')
const first = ref('')
const step = ref<'old' | 'new' | 'confirm' | 'enter'>('enter')
const error = ref('')
const busy = ref(false)

function reset() {
  pin.value = ''; first.value = ''; error.value = ''
  step.value = props.mode === 'verify' ? 'enter' : props.mode === 'change' ? 'old' : 'new'
}
watch(() => props.open, (v) => { if (v) reset() }, { immediate: true })

const heading = computed(() => ({
  enter: 'Enter Daddy Mode PIN', old: 'Enter your current PIN', new: props.mode === 'set' ? 'Choose a PIN (4–8 digits)' : 'Choose a new PIN (4–8 digits)', confirm: 'Type the PIN again',
}[step.value]))

function press(d: string) { if (pin.value.length < 8) { pin.value += d; error.value = ''; play('click') } }
function del() { pin.value = pin.value.slice(0, -1) }
function onKey(e: KeyboardEvent) {
  if (!props.open) return
  if (/^\d$/.test(e.key)) press(e.key)
  else if (e.key === 'Backspace') del()
  else if (e.key === 'Enter') void submit()
}
onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => window.removeEventListener('keydown', onKey))

async function submit() {
  if (pin.value.length < 4 || busy.value) { error.value = 'Use at least 4 digits'; return }
  busy.value = true
  try {
    if (step.value === 'enter' || step.value === 'old') {
      const r = await api.verifyPin(pin.value)
      if (r === 'ok') {
        if (step.value === 'enter') { emit('done'); return }
        pin.value = ''; step.value = 'new'; return
      }
      error.value = r === 'locked' ? `Too many tries. Wait ${api.lockSecondsLeft()}s.` : 'That PIN is not right'
      pin.value = ''; play('error')
    } else if (step.value === 'new') {
      first.value = pin.value; pin.value = ''; step.value = 'confirm'
    } else {
      if (pin.value !== first.value) { error.value = 'The PINs did not match. Try again.'; pin.value = ''; first.value = ''; step.value = 'new'; play('error'); return }
      await api.setPin(pin.value)
      emit('done')
    }
  } finally { busy.value = false }
}
</script>

<template>
  <ModalSheet :open="open" :title="title ?? 'Daddy Mode'" @close="emit('cancel')">
    <p class="text-center font-extrabold mb-3">{{ heading }}</p>
    <div class="mb-3 flex justify-center gap-2" aria-live="polite" :aria-label="`${pin.length} digits entered`">
      <span v-for="i in 8" :key="i" class="h-3.5 w-3.5 rounded-full" :style="{ background: i <= pin.length ? 'var(--accent)' : '#E9DFE4', display: i > Math.max(4, pin.length) ? 'none' : 'inline-block' }" />
    </div>
    <p class="text-center text-sm font-bold mb-2" style="min-height: 20px; color: #C0455B" role="alert">{{ error }}</p>
    <div class="grid grid-cols-3 gap-2">
      <button v-for="d in ['1','2','3','4','5','6','7','8','9']" :key="d" class="btn btn-soft" style="min-height: 56px; font-size: 1.4rem" @click="press(d)">{{ d }}</button>
      <button class="btn btn-ghost" style="min-height: 56px" aria-label="Delete last digit" @click="del"><Icon name="back" /></button>
      <button class="btn btn-soft" style="min-height: 56px; font-size: 1.4rem" @click="press('0')">0</button>
      <button class="btn btn-primary" style="min-height: 56px" :disabled="busy" aria-label="Confirm PIN" @click="submit"><Icon name="check" :sw="3" /></button>
    </div>
    <p v-if="mode === 'set'" class="muted text-xs mt-3 text-center">Pick something Mommy will not guess. It keeps the surprises secret, so please remember it. There is no recovery (clearing the app data resets it).</p>
  </ModalSheet>
</template>
