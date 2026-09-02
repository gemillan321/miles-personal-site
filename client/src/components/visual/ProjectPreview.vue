<script setup lang="ts">
import type { Project } from '@/types'

/**
 * Abstract project illustrations.
 *
 * Deliberately not fake screenshots. A mocked-up interface for a project that
 * is still being built is a small lie, and a stock "dashboard image" tells a
 * visitor nothing. These are diagrams of what the project *is* — a path
 * through a course, the layers of a system, the shape of a set of records —
 * and they get replaced by real screenshots the moment there are real
 * screenshots to show.
 */

defineProps<{ kind: Project['preview']; accent: Project['accent'] }>()
</script>

<template>
  <div class="preview glass lit-edge sheen" :class="`preview--${accent}`" aria-hidden="true">
    <!-- A journey through connected stages: the shape of a learning platform. -->
    <svg v-if="kind === 'arcade'" class="preview__art" viewBox="0 0 400 260" focusable="false">
      <path
        class="pv-track"
        d="M40 200 C90 200 96 132 146 132 C196 132 200 74 250 74 C300 74 306 150 360 150"
        fill="none"
      />
      <path
        class="pv-progress"
        d="M40 200 C90 200 96 132 146 132 C196 132 200 74 250 74"
        fill="none"
        pathLength="1"
      />
      <g class="pv-stops">
        <circle cx="40" cy="200" r="10" class="is-done" />
        <circle cx="146" cy="132" r="10" class="is-done" />
        <circle cx="250" cy="74" r="13" class="is-active" />
        <circle cx="360" cy="150" r="10" />
      </g>
      <g class="pv-tiles">
        <rect v-for="i in 5" :key="i" :x="40 + (i - 1) * 44" y="228" width="34" height="6" rx="3" />
      </g>
      <g class="pv-labels">
        <rect x="228" y="30" width="72" height="24" rx="8" class="pv-chip" />
        <rect x="240" y="39" width="48" height="6" rx="3" class="pv-chip-bar" />
      </g>
    </svg>

    <!-- Layers of one system, seen from the front. -->
    <svg v-else-if="kind === 'layers'" class="preview__art" viewBox="0 0 400 260" focusable="false">
      <g class="pv-layers">
        <rect x="56" y="170" width="288" height="52" rx="12" />
        <rect x="42" y="106" width="316" height="52" rx="12" />
        <rect x="28" y="42" width="344" height="52" rx="12" class="is-top" />
      </g>
      <g class="pv-layer-bars">
        <rect x="46" y="62" width="88" height="8" rx="4" class="is-bright" />
        <rect x="46" y="76" width="52" height="6" rx="3" />
        <rect x="300" y="60" width="56" height="16" rx="8" class="is-signal" />
        <rect x="60" y="126" width="70" height="6" rx="3" />
        <rect x="60" y="138" width="118" height="6" rx="3" class="is-dim" />
        <rect x="74" y="190" width="96" height="6" rx="3" class="is-dim" />
        <rect x="74" y="202" width="62" height="6" rx="3" class="is-dim" />
      </g>
      <path class="pv-beam" d="M200 232 V32" pathLength="1" fill="none" />
    </svg>

    <!-- Records and the readout over them. -->
    <svg v-else class="preview__art" viewBox="0 0 400 260" focusable="false">
      <g class="pv-bars">
        <rect
          v-for="(h, i) in [46, 78, 60, 102, 84, 130, 112]"
          :key="i"
          :x="40 + i * 46"
          :y="200 - h"
          width="26"
          :height="h"
          rx="6"
          :class="{ 'is-peak': i === 5 }"
        />
      </g>
      <path
        class="pv-progress"
        d="M53 132 L99 106 L145 122 L191 84 L237 100 L283 62 L329 80"
        fill="none"
        pathLength="1"
      />
      <g class="pv-tiles">
        <rect x="40" y="218" width="96" height="8" rx="4" />
        <rect x="150" y="218" width="60" height="8" rx="4" />
        <rect x="224" y="218" width="76" height="8" rx="4" />
      </g>
      <g class="pv-labels">
        <rect x="286" y="26" width="74" height="24" rx="8" class="pv-chip" />
        <rect x="298" y="35" width="50" height="6" rx="3" class="pv-chip-bar" />
      </g>
    </svg>
  </div>
</template>

<style scoped>
.preview {
  position: relative;
  aspect-ratio: 400 / 260;
  border-radius: var(--radius-panel);
  overflow: hidden;
  --accent: var(--color-violet);
}

.preview--azure {
  --accent: var(--color-azure);
}
.preview--cyan {
  --accent: var(--color-cyan);
}
.preview--signal {
  --accent: var(--color-signal);
}

/* A soft pool of the project's accent behind the diagram. */
.preview::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(
    70% 90% at 30% 15%,
    color-mix(in oklab, var(--accent) 22%, transparent),
    transparent 68%
  );
  z-index: 0;
}

.preview__art {
  position: relative;
  z-index: 2;
  width: 100%;
  height: 100%;
}

/* ── Shared marks ─────────────────────────────────────────────────────────── */

.pv-track {
  stroke: rgb(255 255 255 / 0.14);
  stroke-width: 2;
  stroke-linecap: round;
}

.pv-progress {
  stroke: var(--color-signal);
  stroke-width: 2.2;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-dasharray: 1;
  stroke-dashoffset: calc(1 - var(--draw, 1));
  filter: drop-shadow(0 0 6px color-mix(in oklab, var(--color-signal) 45%, transparent));
}

.pv-stops circle {
  fill: rgb(14 16 22 / 0.9);
  stroke: rgb(255 255 255 / 0.28);
  stroke-width: 1.6;
}

.pv-stops .is-done {
  stroke: color-mix(in oklab, var(--accent) 90%, transparent);
  fill: color-mix(in oklab, var(--accent) 32%, transparent);
}

.pv-stops .is-active {
  stroke: var(--color-signal);
  fill: color-mix(in oklab, var(--color-signal) 26%, transparent);
}

.pv-tiles rect {
  fill: rgb(255 255 255 / 0.13);
}

.pv-chip {
  fill: rgb(255 255 255 / 0.06);
  stroke: rgb(255 255 255 / 0.13);
  stroke-width: 1;
}

.pv-chip-bar {
  fill: rgb(255 255 255 / 0.28);
}

/* ── Layers ───────────────────────────────────────────────────────────────── */

.pv-layers rect {
  fill: rgb(255 255 255 / 0.045);
  stroke: rgb(255 255 255 / 0.12);
  stroke-width: 1;
}

.pv-layers .is-top {
  fill: rgb(255 255 255 / 0.08);
  stroke: rgb(255 255 255 / 0.2);
}

.pv-layer-bars rect {
  fill: rgb(255 255 255 / 0.26);
}

.pv-layer-bars .is-bright {
  fill: rgb(255 255 255 / 0.6);
}

.pv-layer-bars .is-dim {
  fill: rgb(255 255 255 / 0.14);
}

.pv-layer-bars .is-signal {
  fill: color-mix(in oklab, var(--color-signal) 75%, transparent);
}

.pv-beam {
  stroke: var(--color-signal);
  stroke-width: 1.4;
  stroke-linecap: round;
  stroke-dasharray: 1;
  stroke-dashoffset: calc(1 - var(--draw, 1));
  opacity: 0.8;
}

/* ── Bars ─────────────────────────────────────────────────────────────────── */

.pv-bars rect {
  fill: color-mix(in oklab, var(--accent) 26%, transparent);
  stroke: color-mix(in oklab, var(--accent) 45%, transparent);
  stroke-width: 1;
}

.pv-bars .is-peak {
  fill: color-mix(in oklab, var(--accent) 46%, transparent);
  stroke: color-mix(in oklab, var(--accent) 80%, transparent);
}
</style>
