<script setup lang="ts">
const game = useModule('game')
const room = useModule('room')
const dress = useModule('dress')
const mommy = useModule('mommy')
const care = useModule('care')
const s = computed(() => game.value.stats)
</script>

<template>
  <div>
    <PageHeader title="Games" subtitle="Pick something cozy to play" />
    <div class="flex flex-col gap-3">
      <GameCard to="/games/baby-room" icon="🛏️" title="Baby Room" text="Decorate a dreamy nursery. Drag, drop and unlock cute things." bg="var(--color-sky)" :badge="`${room.placed.length} items`" />
      <GameCard to="/games/memory" icon="🧩" title="Memory Puzzle" text="Flip the cards and find the matching pairs." bg="var(--color-lav)" :badge="`${s.memoryWins} wins`" />
      <GameCard to="/games/bubble-pop" icon="🫧" title="Bubble Pop" text="Aim, shoot and pop three or more matching bubbles." bg="var(--color-blush)" :badge="`Level ${game.bubble.unlockedLevel}`" />
      <GameCard to="/games/baby-care" icon="🍼" title="Baby Care Day" text="Feed, change, bath, rock and play with your little one." bg="#E9F7EF" :badge="`${care.total} cares`" />
      <GameCard to="/games/dress-up" icon="👗" title="Dress Up My Baby" text="Mix and match 40 outfits, hats, shoes and extras." bg="var(--color-peach)" :badge="`${dress.favorites.length} saved`" />
      <GameCard to="/mommy-notes" icon="💌" title="Mommy's Love Notes" text="Sweet messages from your little one, and your own notes." bg="#FFF1D6" :badge="`${mommy.favorites.length} ♥`" />
      <GameCard to="/daddy-messages" icon="💝" title="Daddy's Secret Messages" text="Little surprises from Daddy, with lots of love." bg="#FFE3EE" />
    </div>
  </div>
</template>
