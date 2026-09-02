<script setup lang="ts">
import { computed } from 'vue'

/**
 * A segment of the through-line — signature idea #2 (DESIGN.md §3).
 *
 * One warm stroke runs the entire length of the site. Rather than measuring
 * the whole document and drawing a single giant path (fragile, and it would
 * have to be recomputed on every reflow), each section owns the segment that
 * crosses it. Because every segment enters and leaves at the same x, they meet
 * exactly and read as one continuous line — while each is free to do
 * completely different work in between.
 *
 * A dim "track" shows where the line is going; the warm stroke fills in as you
 * scroll, driven by `--draw` from the v-draw directive and `pathLength="1"`.
 */

type Variant = 'origin' | 'straight' | 'wave' | 'branch' | 'loop' | 'steps' | 'converge'

const props = withDefaults(
  defineProps<{
    variant?: Variant
    /** Section number shown at the top of the rail on wide screens. */
    index?: string
    /** Vertical positions (0–1000 in path space) for branch ticks. */
    ticks?: number[]
  }>(),
  { variant: 'straight', index: undefined, ticks: () => [] },
)

/** All paths live in a 100 × 1000 space stretched to the rail. The stroke is
 *  kept true with vector-effect, and every path enters at x=38 and leaves at
 *  x=38 so segments join across section boundaries. */
const PATHS: Record<Variant, string> = {
  // Hero: the line is born inside the hero visual and exits downward.
  origin: 'M38 620 V1000',
  straight: 'M38 0 V1000',
  // A slow lean out and back — used where the page needs to breathe.
  wave: 'M38 0 C38 240 66 300 66 500 C66 700 38 760 38 1000',
  // Main line with short branches reaching toward the content.
  branch: 'M38 0 V1000',
  // The iteration loop, drawn literally: the line circles once and carries on.
  loop: 'M38 0 V430 C4 458 4 542 38 570 C72 542 72 458 38 430 V1000',
  // Stepped jogs — the shape of a process that advances in stages.
  steps: 'M38 0 V150 H64 V330 H38 V510 H64 V690 H38 V1000',
  // Two threads converging into one before the contact form.
  converge: 'M12 0 C12 260 38 300 38 480 V1000 M64 0 C64 260 38 300 38 480',
}

const d = computed(() => PATHS[props.variant])
</script>

<template>
  <div class="rail" aria-hidden="true">
    <span v-if="index" class="rail__index">{{ index }}</span>

    <svg
      v-draw
      class="rail__svg"
      viewBox="0 0 100 1000"
      preserveAspectRatio="none"
      focusable="false"
    >
      <!-- Track: where the line is going. -->
      <path :d="d" class="rail__track" vector-effect="non-scaling-stroke" fill="none" />

      <!-- Branch ticks reaching toward the content column. -->
      <template v-if="variant === 'branch'">
        <path
          v-for="y in ticks"
          :key="y"
          :d="`M38 ${y} H92`"
          class="rail__track"
          vector-effect="non-scaling-stroke"
          fill="none"
        />
      </template>

      <!-- The line itself, drawn by scrolling. -->
      <path
        :d="d"
        class="rail__line"
        pathLength="1"
        vector-effect="non-scaling-stroke"
        fill="none"
      />
    </svg>
  </div>
</template>

<style scoped>
.rail__svg {
  width: 100%;
  height: 100%;
  overflow: visible;
}

.rail__track {
  stroke: rgb(255 255 255 / 0.07);
  stroke-width: 1;
}

.rail__line {
  stroke: var(--color-signal);
  stroke-width: 1.5;
  stroke-linecap: round;
  stroke-dasharray: 1;
  stroke-dashoffset: calc(1 - var(--draw, 0));
  opacity: 0.85;
  filter: drop-shadow(0 0 5px color-mix(in oklab, var(--color-signal) 45%, transparent));
}

.rail__index {
  position: absolute;
  /* Aligned to the kicker's optical baseline, not its box. */
  top: calc(clamp(72px, 11vw, 148px) + 6px);
  left: calc(var(--rail-width) * 0.38 + 15px);
  font-size: 0.6875rem;
  font-weight: 500;
  letter-spacing: 0.15em;
  color: var(--color-ink-faint);
  display: none;
}

@media (min-width: 1080px) {
  .rail__index {
    display: block;
  }
}

@media (prefers-reduced-motion: reduce) {
  .rail__line {
    stroke-dashoffset: 0;
  }
}
</style>
