<script setup lang="ts">
// Mommy's side: only published messages she has already opened as surprise envelopes are shown.
const api = useDaddyMessages()
const open = ref<string | null>(null)
</script>

<template>
  <div>
    <PageHeader title="Daddy's Secret Messages" subtitle="Little surprises from Daddy, with lots of love." back />

    <div class="relative card overflow-hidden text-center px-5 py-5 mb-4" style="background: linear-gradient(135deg, #FFE3EE, #FFF1D6)">
      <FloatingHearts :count="6" />
      <div class="text-5xl floaty" aria-hidden="true">💌</div>
      <p class="font-extrabold mt-2">New surprises arrive as little envelopes when you open the app.</p>
      <p class="muted text-sm">Every message you open is kept here for you to read again.</p>
    </div>

    <EmptyState v-if="!api.readable.value.length" title="No messages opened yet" text="Keep an eye out for Daddy's envelope when you open the app 💝" icon="✉️" />
    <ul v-else class="m-0 list-none p-0 flex flex-col gap-3">
      <li v-for="m in api.readable.value" :key="m.id" class="fade-up">
        <button v-if="open !== m.id" class="card flex w-full items-center gap-3 p-4 text-left" style="background: #fff" :aria-expanded="false" @click="open = m.id">
          <span class="text-3xl" aria-hidden="true">{{ m.special ? '💖' : '💌' }}</span>
          <span class="flex-1 min-w-0"><span class="block font-extrabold truncate">{{ m.title }}</span><span class="block muted text-xs">Opened {{ shortDate(m.seenAt?.slice(0, 10)) }}</span></span>
          <Icon name="play" :size="18" />
        </button>
        <div v-else>
          <DaddyLetter :title="m.title" :body="m.body" :signature="m.signature" :design="m.design" :special="m.special" />
          <button class="btn btn-soft btn-sm mt-2 w-full" @click="open = null">Close</button>
        </div>
      </li>
    </ul>
  </div>
</template>
