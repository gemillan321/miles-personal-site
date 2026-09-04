<script setup lang="ts">
import { DISCIPLINES } from '@/content/disciplines'
import RailSegment from '@/components/visual/RailSegment.vue'
import SectionHeading from '@/components/ui/SectionHeading.vue'

/**
 * Technical disciplines, as a bento.
 *
 * The rule this section exists to break: "here are thirty technology logos".
 * Every cell says what I can actually do with the thing, because a logo grid
 * tells a client nothing and tells a developer only that I have heard of
 * React. Cells are deliberately unequal — one tall anchor, one full-width
 * closer, four in between — and they carry different kinds of content rather
 * than the same card six times.
 */
</script>

<template>
  <section id="disciplines" class="section" aria-labelledby="disciplines-title">
    <div class="shell">
      <RailSegment variant="straight" index="05" />

      <div class="section-body railed">
        <SectionHeading
          id="disciplines-title"
          kicker="Disciplines"
          lead="There is more to this than"
          editorial="web development"
          tail="."
          lede="Six areas I build and learn across. They overlap constantly, because making a useful product means connecting more than one kind of skill."
        />

        <div class="bento disciplines">
          <article
            v-for="(d, i) in DISCIPLINES"
            :key="d.id"
            v-reveal="i * 65"
            v-spotlight
            class="cell glass lit-edge disc"
            :class="[`cell--${d.span}`, { 'cell--h2': d.tall }, `disc--${d.accent}`]"
          >
            <div class="disc__head">
              <span class="disc__glyph" aria-hidden="true">
                <span class="disc__glyph-dot" />
              </span>
              <h3 class="display-s disc__title">{{ d.title }}</h3>
            </div>

            <p class="disc__blurb">{{ d.blurb }}</p>

            <!-- Software: modules nested inside a system, which is what
                 "structure" actually looks like. The tall anchor cell earns a
                 quieter, more atmospheric mark than the others. -->
            <svg
              v-if="d.id === 'software'"
              class="disc__art disc__art--tall"
              viewBox="0 0 220 150"
              aria-hidden="true"
              focusable="false"
            >
              <rect class="disc-frame" x="8" y="8" width="204" height="134" rx="14" />
              <rect class="disc-frame" x="24" y="24" width="112" height="50" rx="10" />
              <rect class="disc-frame" x="24" y="86" width="72" height="40" rx="10" />
              <rect class="disc-frame" x="108" y="86" width="88" height="40" rx="10" />
              <rect class="disc-frame is-signal" x="148" y="24" width="48" height="50" rx="10" />
              <path class="disc-link" d="M80 74 V86 M136 49 H148 M96 106 H108" fill="none" />
            </svg>

            <!-- Cloud: three services standing on one platform. -->
            <svg
              v-if="d.id === 'cloud'"
              class="disc__art"
              viewBox="0 0 220 70"
              aria-hidden="true"
              focusable="false"
            >
              <path class="disc-link" d="M40 22 V44 H180 V22 M110 44 V22" fill="none" />
              <rect class="disc-node" x="20" y="6" width="40" height="18" rx="6" />
              <rect class="disc-node" x="90" y="6" width="40" height="18" rx="6" />
              <rect class="disc-node" x="160" y="6" width="40" height="18" rx="6" />
              <rect class="disc-base" x="20" y="48" width="180" height="14" rx="7" />
            </svg>

            <!-- AI: the iteration loop, drawn once. -->
            <svg
              v-if="d.id === 'ai'"
              class="disc__art"
              viewBox="0 0 220 70"
              aria-hidden="true"
              focusable="false"
            >
              <path
                class="disc-link"
                d="M36 44 C36 16 84 16 84 34 C84 52 132 52 132 34 C132 16 184 16 184 44"
                fill="none"
              />
              <circle class="disc-dot" cx="36" cy="44" r="5" />
              <circle class="disc-dot" cx="84" cy="34" r="5" />
              <circle class="disc-dot" cx="132" cy="34" r="5" />
              <circle class="disc-dot is-signal" cx="184" cy="44" r="6.5" />
            </svg>

            <!-- Systems: information moving through a system, left to right. -->
            <svg
              v-if="d.id === 'systems'"
              class="disc__art disc__art--wide"
              viewBox="0 0 620 64"
              preserveAspectRatio="xMidYMid meet"
              aria-hidden="true"
              focusable="false"
            >
              <path class="disc-link" d="M56 32 H180 M244 32 H368 M432 32 H556" fill="none" />
              <g class="disc-stage">
                <rect x="0" y="14" width="56" height="36" rx="10" />
                <rect x="180" y="14" width="64" height="36" rx="10" />
                <rect x="368" y="14" width="64" height="36" rx="10" />
                <rect x="556" y="14" width="64" height="36" rx="10" class="is-signal" />
              </g>
              <g class="disc-stage-bar">
                <rect x="12" y="29" width="32" height="6" rx="3" />
                <rect x="194" y="29" width="36" height="6" rx="3" />
                <rect x="382" y="29" width="36" height="6" rx="3" />
                <rect x="570" y="29" width="36" height="6" rx="3" />
              </g>
            </svg>

            <ul class="disc__tags">
              <li v-for="t in d.tags" :key="t">{{ t }}</li>
            </ul>
          </article>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.disciplines {
  margin-top: clamp(44px, 6vw, 72px);
}

.disc {
  --accent: var(--color-violet);
  gap: 12px;
  transition: transform 480ms var(--ease-spatial);
}

.disc--azure {
  --accent: var(--color-azure);
}
.disc--cyan {
  --accent: var(--color-cyan);
}
.disc--signal {
  --accent: var(--color-signal);
}

.disc:hover {
  transform: translateY(-3px);
}

/* A faint pool of the cell's accent in its top corner — enough to tell the
   cells apart at a glance without six coloured boxes. */
.disc::after {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(
    75% 60% at 8% 0%,
    color-mix(in oklab, var(--accent) 16%, transparent),
    transparent 62%
  );
  pointer-events: none;
  z-index: 0;
}

.disc > * {
  position: relative;
  z-index: 2;
}

.disc__head {
  display: flex;
  align-items: center;
  gap: 11px;
}

.disc__glyph {
  display: grid;
  place-items: center;
  width: 26px;
  height: 26px;
  flex: none;
  border-radius: 8px;
  border: 1px solid color-mix(in oklab, var(--accent) 42%, transparent);
  background: color-mix(in oklab, var(--accent) 14%, transparent);
}

.disc__glyph-dot {
  width: 6px;
  height: 6px;
  border-radius: 999px;
  background: color-mix(in oklab, var(--accent) 92%, white);
}

.disc__title {
  font-size: 1.0625rem;
}

.disc__blurb {
  color: var(--color-ink-muted);
  font-size: 0.9375rem;
  max-width: 52ch;
}

.disc__art {
  width: 100%;
  max-width: 260px;
  height: auto;
  padding-top: 18px;
  opacity: 0.9;
}

.disc__art--wide {
  max-width: 100%;
}

.disc__art--tall {
  margin-top: 14px;
  max-width: 100%;
  opacity: 0.7;
}

.disc-frame {
  fill: rgb(255 255 255 / 0.025);
  stroke: rgb(255 255 255 / 0.12);
  stroke-width: 1.2;
}

.disc-frame.is-signal {
  fill: color-mix(in oklab, var(--accent) 14%, transparent);
  stroke: color-mix(in oklab, var(--accent) 55%, transparent);
}

.disc-link {
  stroke: rgb(255 255 255 / 0.18);
  stroke-width: 1.4;
  stroke-linecap: round;
}

.disc-node,
.disc-base,
.disc-stage rect {
  fill: color-mix(in oklab, var(--accent) 16%, transparent);
  stroke: color-mix(in oklab, var(--accent) 52%, transparent);
  stroke-width: 1.2;
}

.disc-stage .is-signal {
  fill: color-mix(in oklab, var(--color-signal) 18%, transparent);
  stroke: color-mix(in oklab, var(--color-signal) 70%, transparent);
}

.disc-stage-bar rect {
  fill: rgb(255 255 255 / 0.26);
}

.disc-dot {
  fill: color-mix(in oklab, var(--accent) 30%, transparent);
  stroke: color-mix(in oklab, var(--accent) 80%, transparent);
  stroke-width: 1.4;
}

.disc-dot.is-signal {
  fill: color-mix(in oklab, var(--color-signal) 28%, transparent);
  stroke: var(--color-signal);
}

.disc__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: auto;
  padding-top: 16px;
}

.disc__tags li {
  padding: 4px 9px;
  border-radius: 999px;
  font-size: 0.6875rem;
  letter-spacing: 0.02em;
  color: var(--color-ink-soft);
  background: rgb(255 255 255 / 0.04);
  border: 1px solid rgb(255 255 255 / 0.07);
}

@media (prefers-reduced-motion: reduce) {
  .disc {
    transition: none;
  }
}
</style>
