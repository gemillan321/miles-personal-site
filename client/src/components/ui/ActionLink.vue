<script setup lang="ts">
/**
 * The site's call to action.
 *
 * Two variants only. `primary` is the one place the warm signal colour is used
 * as a fill; `ghost` is a quiet glass counterpart. Both lean toward the cursor
 * (v-magnetic) — restricted to these buttons, because a page where everything
 * is magnetic just feels unstable.
 */

withDefaults(defineProps<{ href: string; variant?: 'primary' | 'ghost' }>(), {
  variant: 'primary',
})
</script>

<template>
  <a v-magnetic="8" :href="href" :class="['action', `action--${variant}`]">
    <span class="action__label"><slot /></span>
    <svg class="action__arrow" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
      <path
        d="M3 8h9M8.5 4l4 4-4 4"
        fill="none"
        stroke="currentColor"
        stroke-width="1.6"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  </a>
</template>

<style scoped>
.action {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 13px 22px;
  border-radius: 999px;
  font-size: 0.9375rem;
  font-weight: 500;
  letter-spacing: -0.01em;
  white-space: nowrap;
  isolation: isolate;
  transition:
    background-color 220ms var(--ease-soft),
    border-color 220ms var(--ease-soft),
    box-shadow 220ms var(--ease-soft);
}

.action__arrow {
  width: 15px;
  height: 15px;
  transition: transform 320ms var(--ease-spatial);
}

.action:hover .action__arrow {
  transform: translateX(3px);
}

/* Primary — the one filled use of the signal colour on the page. */
.action--primary {
  background: var(--color-signal);
  color: #1a0e05;
  font-weight: 600;
  box-shadow:
    0 10px 30px -12px color-mix(in oklab, var(--color-signal) 70%, transparent),
    inset 0 1px 0 rgb(255 255 255 / 0.35);
}

.action--primary:hover {
  background: color-mix(in oklab, var(--color-signal) 88%, white);
  box-shadow:
    0 14px 38px -12px color-mix(in oklab, var(--color-signal) 80%, transparent),
    inset 0 1px 0 rgb(255 255 255 / 0.45);
}

/* Ghost — glass, quiet, still obviously clickable. */
.action--ghost {
  background: rgb(255 255 255 / 0.05);
  border: 1px solid rgb(255 255 255 / 0.13);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  color: var(--color-ink);
}

.action--ghost:hover {
  background: rgb(255 255 255 / 0.09);
  border-color: rgb(255 255 255 / 0.24);
}

@media (prefers-reduced-motion: reduce) {
  .action,
  .action__arrow {
    transition: none;
  }
}
</style>
