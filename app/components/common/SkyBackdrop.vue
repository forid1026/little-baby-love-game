<script setup lang="ts">
// Decorative drifting clouds, twinkling stars and a sleepy moon (pure CSS/SVG).
</script>

<template>
  <div class="fixed inset-0 -z-10 overflow-hidden pointer-events-none" aria-hidden="true">
    <svg class="absolute twinkle" style="top: 7%; right: 8%" width="54" height="54" viewBox="0 0 100 100"><path d="M64 8 a42 42 0 1 0 28 62 a34 34 0 1 1 -28 -62z" fill="#FFE9A8" opacity=".8"/></svg>
    <svg class="absolute twinkle" style="top: 16%; left: 10%; animation-delay: .6s" width="22" height="22" viewBox="0 0 24 24"><path d="M12 2l2.4 6.6L21 9l-5 4.5L17.5 20 12 16.5 6.5 20 8 13.5 3 9l6.6-.4z" fill="#FFE27A"/></svg>
    <svg class="absolute twinkle" style="top: 34%; right: 6%; animation-delay: 1.4s" width="16" height="16" viewBox="0 0 24 24"><path d="M12 2l2.4 6.6L21 9l-5 4.5L17.5 20 12 16.5 6.5 20 8 13.5 3 9l6.6-.4z" fill="#CDBBFA"/></svg>
    <svg class="absolute twinkle" style="bottom: 24%; left: 6%; animation-delay: 2s" width="18" height="18" viewBox="0 0 24 24"><path d="M12 20s-8-5-8-11a4.5 4.5 0 018-2.5A4.5 4.5 0 0120 9c0 6-8 11-8 11z" fill="#F4BFD3"/></svg>
    <svg class="absolute" style="top: 22%; left: -80px; animation: drift 70s linear infinite" width="90" height="46" viewBox="0 0 90 46"><g fill="#fff" opacity=".85"><circle cx="26" cy="28" r="16"/><circle cx="46" cy="20" r="20"/><circle cx="66" cy="29" r="15"/><rect x="22" y="26" width="46" height="18" rx="9"/></g></svg>
    <svg class="absolute" style="top: 55%; left: -80px; animation: drift 95s linear infinite -40s" width="70" height="36" viewBox="0 0 90 46"><g fill="#fff" opacity=".7"><circle cx="26" cy="28" r="16"/><circle cx="46" cy="20" r="20"/><circle cx="66" cy="29" r="15"/><rect x="22" y="26" width="46" height="18" rx="9"/></g></svg>
  </div>
</template>
