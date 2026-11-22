<script setup lang="ts">
const journey = useModule('journey')
const dress = useModule('dress')
const ach = useAchievements()
const links = computed(() => [
  { to: '/journey', icon: '📖', title: 'Baby Journey', text: journey.value.nickname ? `All about ${journey.value.nickname}` : 'Nickname, milestones and memories', bg: '#E6F4FF' },
  { to: '/collection', icon: '🧺', title: 'My Collection', text: 'Furniture, outfits, badges and treasures', bg: '#FFE3EE' },
  { to: '/achievements', icon: '🏆', title: 'Achievements', text: 'Your little victories', bg: '#FFF1D6', badge: `${ach.unlockedCount.value}/${ach.defs.length}` },
  { to: '/progress', icon: '📈', title: 'My Progress', text: 'Games played, coins earned and more', bg: '#F1EAFF' },
  { to: '/rewards', icon: '🎁', title: 'Daily Rewards', text: 'Come back every day for a gift', bg: '#FFE4D5' },
])
</script>

<template>
  <div>
    <PageHeader title="My Baby" :subtitle="journey.nickname ? `Hello, ${journey.nickname}! 💕` : 'Everything about our little one'" />
    <div class="relative card overflow-hidden mb-4 px-6 pt-4 text-center" style="background: linear-gradient(135deg, #FFE3EE, #E6F4FF)">
      <FloatingHearts :count="6" />
      <div class="mx-auto w-40"><BabyAvatar bounce :equipped="dress.equipped" :colors="dress.colors" /></div>
      <NuxtLink to="/games/dress-up" class="btn btn-soft btn-sm no-underline my-3">Change outfit</NuxtLink>
    </div>
    <div class="flex flex-col gap-3">
      <GameCard v-for="l in links" :key="l.to" :to="l.to" :icon="l.icon" :title="l.title" :text="l.text" :bg="l.bg" :badge="l.badge" />
    </div>
  </div>
</template>
