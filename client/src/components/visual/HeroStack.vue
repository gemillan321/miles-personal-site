<script setup lang="ts">
import { HERO } from '@/content/site'

/**
 * The hero visual: three layers of a piece of software, pulled apart.
 *
 * Deliberately *not* a browser mockup, a terminal, or floating logos. What I
 * actually build has three layers — the interface people touch, the logic that
 * makes it work, and the data underneath — and the hero simply shows that,
 * exploded, with the through-line rising through all three and continuing down
 * the page. It says "clear on the surface, solid underneath" without writing
 * the words twice.
 *
 * Built from stacked isometric planes rather than true 3D translation: the
 * separation between layers stays exactly vertical on screen, which is what
 * lets the warm line pass cleanly through the whole stack.
 */

const planes = HERO.planes
</script>

<template>
  <div class="hero-visual" aria-hidden="true">
    <div class="hero-visual__glow" />

    <div class="stack">
      <!-- The line rising through the layers, before it exits into the page. -->
      <svg class="stack__beam" viewBox="0 0 4 400" preserveAspectRatio="none" focusable="false">
        <line
          x1="2"
          y1="400"
          x2="2"
          y2="0"
          vector-effect="non-scaling-stroke"
          class="stack__beam-line"
        />
      </svg>

      <!-- 03 · Data ---------------------------------------------------- -->
      <div class="plane plane--3 glass lit-edge sheen">
        <svg class="plane__art" viewBox="0 0 260 150" focusable="false">
          <g class="art-data">
            <rect v-for="i in 4" :key="`r${i}`" :x="18" :y="14 + (i - 1) * 32" width="224" height="20" rx="5" />
          </g>
          <g class="art-data-cells">
            <rect
              v-for="c in 12"
              :key="`c${c}`"
              :x="26 + ((c - 1) % 4) * 56"
              :y="20 + Math.floor((c - 1) / 4) * 32"
              :width="c % 3 === 0 ? 22 : 40"
              height="8"
              rx="4"
            />
          </g>
        </svg>
      </div>

      <!-- 02 · Logic --------------------------------------------------- -->
      <div class="plane plane--2 glass lit-edge sheen">
        <svg class="plane__art" viewBox="0 0 260 150" focusable="false">
          <g class="art-logic-links">
            <path d="M52 75 H108 M108 75 C132 75 132 42 156 42 M108 75 C132 75 132 108 156 108 M156 42 H210 M156 108 H210" />
          </g>
          <g class="art-logic-nodes">
            <circle cx="52" cy="75" r="9" />
            <circle cx="108" cy="75" r="6" />
            <circle cx="156" cy="42" r="6" />
            <circle cx="156" cy="108" r="6" />
            <circle cx="210" cy="42" r="9" class="is-signal" />
            <circle cx="210" cy="108" r="9" />
          </g>
        </svg>
      </div>

      <!-- 01 · Interface ------------------------------------------------ -->
      <div class="plane plane--1 glass--strong glass lit-edge sheen">
        <svg class="plane__art" viewBox="0 0 260 150" focusable="false">
          <g class="art-ui">
            <rect x="18" y="16" width="72" height="9" rx="4.5" class="is-bright" />
            <rect x="18" y="34" width="46" height="7" rx="3.5" />
            <rect x="18" y="62" width="104" height="60" rx="8" class="is-panel" />
            <rect x="30" y="74" width="58" height="7" rx="3.5" />
            <rect x="30" y="88" width="80" height="6" rx="3" class="is-dim" />
            <rect x="30" y="100" width="66" height="6" rx="3" class="is-dim" />
            <rect x="136" y="62" width="106" height="28" rx="8" class="is-panel" />
            <rect x="148" y="72" width="52" height="8" rx="4" />
            <rect x="136" y="98" width="70" height="24" rx="12" class="is-signal-fill" />
          </g>
        </svg>
      </div>
    </div>

    <!-- Layer legend. Sits beside the stack on wide screens, beneath it on
         narrow ones, where it reads as a plain three-item list. -->
    <ul class="legend">
      <li v-for="(p, i) in planes" :key="p.label" class="legend__item" :style="{ '--i': i }">
        <span class="legend__rule" />
        <span class="legend__label">{{ p.label }}</span>
        <span class="legend__detail">{{ p.detail }}</span>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.hero-visual {
  position: relative;
  width: 100%;
  display: grid;
  --tilt-x: 54deg;
  --tilt-z: -38deg;
  --sep: 0px;
}

/* Stack and legend as real grid columns rather than an absolutely positioned
   caption: the labels can never collide with the planes, at any width. */
@media (min-width: 1080px) {
  .hero-visual {
    grid-template-columns: minmax(0, 1fr) 168px;
    align-items: center;
    column-gap: 26px;
  }
}

.hero-visual__glow {
  position: absolute;
  left: 50%;
  top: 58%;
  width: 108%;
  aspect-ratio: 1.6;
  transform: translate(-50%, -50%);
  background: radial-gradient(
    ellipse at center,
    color-mix(in oklab, var(--color-violet) 22%, transparent),
    transparent 62%
  );
  pointer-events: none;
}

/* ── The stack ────────────────────────────────────────────────────────────── */

.stack {
  position: relative;
  width: 100%;
  aspect-ratio: 1 / 0.86;
  transform-style: preserve-3d;
  transform: rotateX(calc(var(--py) * -2.2deg)) rotateY(calc(var(--px) * 3deg));
  transition: transform 700ms var(--ease-spatial);
}

.hero-visual:hover {
  --sep: 22px;
}

.plane {
  position: absolute;
  left: 5%;
  width: 90%;
  aspect-ratio: 260 / 150;
  border-radius: 18px;
  transform: rotateX(var(--tilt-x)) rotateZ(var(--tilt-z));
  transition:
    top 620ms var(--ease-spatial),
    box-shadow 620ms var(--ease-spatial);
  box-shadow: 0 32px 60px -30px rgb(0 0 0 / 0.9);
}

.plane--1 {
  top: calc(6% - var(--sep) * 1.1);
  z-index: 3;
}
.plane--2 {
  top: 30%;
  z-index: 2;
}
.plane--3 {
  top: calc(54% + var(--sep) * 1.1);
  z-index: 1;
}

.plane__art {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 3;
}

/* ── Plane artwork ────────────────────────────────────────────────────────── */

.art-ui rect {
  fill: rgb(255 255 255 / 0.3);
}
.art-ui .is-bright {
  fill: rgb(255 255 255 / 0.72);
}
.art-ui .is-dim {
  fill: rgb(255 255 255 / 0.17);
}
.art-ui .is-panel {
  fill: rgb(255 255 255 / 0.06);
  stroke: rgb(255 255 255 / 0.14);
  stroke-width: 1;
}
.art-ui .is-signal-fill {
  fill: color-mix(in oklab, var(--color-signal) 78%, transparent);
}

.art-logic-links path {
  fill: none;
  stroke: rgb(255 255 255 / 0.24);
  stroke-width: 1.5;
}
.art-logic-nodes circle {
  fill: color-mix(in oklab, var(--color-cyan) 26%, transparent);
  stroke: color-mix(in oklab, var(--color-cyan) 75%, transparent);
  stroke-width: 1.5;
}
.art-logic-nodes .is-signal {
  fill: color-mix(in oklab, var(--color-signal) 26%, transparent);
  stroke: var(--color-signal);
}

.art-data rect {
  fill: rgb(255 255 255 / 0.045);
  stroke: rgb(255 255 255 / 0.09);
  stroke-width: 1;
}
.art-data-cells rect {
  fill: color-mix(in oklab, var(--color-azure) 42%, transparent);
}

/* ── The beam ─────────────────────────────────────────────────────────────── */

.stack__beam {
  position: absolute;
  left: 50%;
  top: 4%;
  width: 4px;
  height: 96%;
  transform: translateX(-50%);
  z-index: 4;
  overflow: visible;
}

.stack__beam-line {
  stroke: var(--color-signal);
  stroke-width: 1.5;
  stroke-linecap: round;
  stroke-dasharray: 400;
  stroke-dashoffset: 400;
  opacity: 0.9;
  filter: drop-shadow(0 0 6px color-mix(in oklab, var(--color-signal) 60%, transparent));
  animation: beam-rise 1600ms var(--ease-spatial) 500ms forwards;
}

@keyframes beam-rise {
  to {
    stroke-dashoffset: 0;
  }
}

/* ── Legend ───────────────────────────────────────────────────────────────── */

.legend {
  display: grid;
  gap: 10px;
  margin-top: 28px;
}

.legend__item {
  display: grid;
  grid-template-columns: 22px auto 1fr;
  align-items: baseline;
  gap: 10px;
  font-size: 0.8125rem;
}

/* The rules fade downward, so the eye reads the stack top-to-bottom. */
.legend__rule {
  height: 1px;
  background: var(--color-signal);
  opacity: 0.85;
  transform: translateY(-4px);
}

.legend__item:nth-child(2) .legend__rule {
  opacity: 0.55;
}

.legend__item:nth-child(3) .legend__rule {
  opacity: 0.3;
}

.legend__label {
  font-family: var(--font-display);
  font-weight: 500;
  letter-spacing: -0.01em;
  color: var(--color-ink);
}

.legend__detail {
  color: var(--color-ink-faint);
}

@media (min-width: 1080px) {
  .legend {
    margin-top: 0;
    gap: 30px;
  }
  .legend__item {
    grid-template-columns: 22px 1fr;
    grid-template-areas:
      'rule label'
      '.    detail';
    gap: 4px 10px;
  }
  .legend__rule {
    grid-area: rule;
  }
  .legend__label {
    grid-area: label;
  }
  .legend__detail {
    grid-area: detail;
    font-size: 0.75rem;
    line-height: 1.4;
  }
}

@media (prefers-reduced-motion: reduce) {
  .stack,
  .plane {
    transition: none;
    transform: rotateX(var(--tilt-x)) rotateZ(var(--tilt-z));
  }
  .stack {
    transform: none;
  }
  .stack__beam-line {
    animation: none;
    stroke-dashoffset: 0;
  }
}
</style>
