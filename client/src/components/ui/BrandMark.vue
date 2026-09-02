<script setup lang="ts">
/**
 * The mark: three stacked planes with the warm line rising through them —
 * the hero visual reduced to 28 pixels. The identity of the site is one idea
 * said at three scales (mark, hero, whole page), which is what makes it stick.
 */
</script>

<template>
  <svg class="mark" viewBox="0 0 28 28" aria-hidden="true" focusable="false">
    <g class="mark__planes" fill="none" stroke-linejoin="round">
      <path d="M3.5 20.5 L14 15.2 L24.5 20.5 L14 25.8 Z" opacity="0.42" />
      <path d="M3.5 14 L14 8.7 L24.5 14 L14 19.3 Z" opacity="0.62" />
      <path d="M3.5 7.5 L14 2.2 L24.5 7.5 L14 12.8 Z" opacity="0.9" />
    </g>
    <line class="mark__beam" x1="14" y1="25.8" x2="14" y2="2.2" />
  </svg>
</template>

<style scoped>
.mark {
  width: 28px;
  height: 28px;
  flex: none;
}

.mark__planes path {
  stroke: currentColor;
  stroke-width: 1.2;
}

.mark__beam {
  stroke: var(--color-signal);
  stroke-width: 1.2;
  stroke-linecap: round;
  opacity: 0.95;
}
</style>
