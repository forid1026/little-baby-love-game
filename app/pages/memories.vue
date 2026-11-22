<script setup lang="ts">
const mommy = useModule('mommy')
const journey = useModule('journey')
const daddy = useDaddyMessages()
</script>

<template>
  <div>
    <PageHeader title="Memories" subtitle="Words and moments to treasure" />
    <div class="flex flex-col gap-3">
      <GameCard to="/mommy-notes" icon="💌" title="Mommy's Love Notes" text="Messages from your little one, quotes and your own notes." bg="#FFE3EE" :badge="`${mommy.favorites.length} ♥`" />
      <GameCard to="/daddy-messages" icon="💝" title="Daddy's Secret Messages" text="Little surprises from Daddy, with lots of love." bg="#F1EAFF" :badge="`${daddy.readable.value.length} opened`" />
      <GameCard to="/journey" icon="📖" title="Baby Journey" text="Your baby's nickname, milestones, notes and favourite memories." bg="#E6F4FF" :badge="`${journey.memories.length} memories`" />
    </div>
  </div>
</template>
