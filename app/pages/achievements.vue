<script setup lang="ts">
import { roomItemById } from '~/data/room'
import { dressItemById } from '~/data/dress'

const ach = useAchievements()
const unlockName = (id?: string) => (id ? roomItemById(id)?.name ?? dressItemById(id)?.name : undefined)
</script>

<template>
  <div>
    <PageHeader title="Achievements" :subtitle="`${ach.unlockedCount.value} of ${ach.defs.length} unlocked`" back />
    <ul class="m-0 flex list-none flex-col gap-3 p-0">
      <li v-for="a in ach.list.value" :key="a.def.id" class="card flex items-center gap-3 p-4 fade-up" :style="{ background: a.done ? '#FFFBEA' : '#fff' }">
        <div class="flex h-16 w-16 shrink-0 items-center justify-center rounded-3xl text-4xl" :style="{ background: a.done ? '#FFE9A8' : '#F1EAF0', filter: a.done ? 'none' : 'grayscale(1)', opacity: a.done ? 1 : 0.6 }" aria-hidden="true">{{ a.done ? a.def.icon : '🔒' }}</div>
        <div class="min-w-0 flex-1">
          <h3 class="h2" style="line-height: 1.15">{{ a.def.title }}</h3>
          <p class="muted text-sm">{{ a.def.desc }}</p>
          <div v-if="!a.done" class="mt-2 h-2.5 overflow-hidden rounded-full" style="background: #F1EAF0" role="progressbar" :aria-valuenow="a.current" :aria-valuemin="0" :aria-valuemax="a.def.target">
            <div class="h-full rounded-full" :style="{ width: (a.current / a.def.target) * 100 + '%', background: 'var(--accent)' }" />
          </div>
          <p class="text-xs font-extrabold mt-1" style="color: var(--accent-dark)">
            <template v-if="a.done">Unlocked {{ shortDate(a.at?.slice(0, 10)) }}</template>
            <template v-else>{{ a.current }}/{{ a.def.target }} · </template>
            Reward: 🪙{{ a.def.coins }} ⭐{{ a.def.stars }}<template v-if="unlockName(a.def.unlock)"> · 🔓 {{ unlockName(a.def.unlock) }}</template>
          </p>
        </div>
      </li>
    </ul>
  </div>
</template>
