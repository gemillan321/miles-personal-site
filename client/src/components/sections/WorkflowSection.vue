<script setup lang="ts">
import { WORKFLOW } from '@/content/site'
import RailSegment from '@/components/visual/RailSegment.vue'
import SectionHeading from '@/components/ui/SectionHeading.vue'

/**
 * AI-assisted development.
 *
 * The rail loops here — literally, the through-line circles once and carries
 * on — because this section is about iteration. The two columns are
 * deliberately unequal in weight: what AI accelerates is stated plainly and
 * quietly, what remains my responsibility is given the glass panel and the
 * warm accent. That asymmetry is the argument.
 */
</script>

<template>
  <section id="workflow" class="section" aria-labelledby="workflow-title">
    <div class="shell">
      <RailSegment variant="loop" index="06" />

      <div class="section-body railed">
        <SectionHeading
          id="workflow-title"
          :kicker="WORKFLOW.kicker"
          :lead="WORKFLOW.headlineLead"
          :editorial="WORKFLOW.headlineEditorial"
          :tail="WORKFLOW.headlineTail"
          :lede="WORKFLOW.lede"
        />

        <div class="wf">
          <section
            v-for="(col, i) in WORKFLOW.columns"
            :key="col.title"
            v-reveal="i * 110"
            class="wf__col"
            :class="i === 1 ? 'wf__col--own glass lit-edge' : 'wf__col--tool'"
          >
            <h3 class="wf__title">
              <span class="wf__marker" aria-hidden="true" />
              {{ col.title }}
            </h3>
            <ul class="wf__list">
              <li v-for="item in col.items" :key="item">{{ item }}</li>
            </ul>
          </section>
        </div>

        <p v-reveal class="wf__footnote">
          <span class="wf__footnote-rule" aria-hidden="true" />
          {{ WORKFLOW.footnote }}
        </p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.wf {
  display: grid;
  gap: 16px;
  margin-top: clamp(44px, 6vw, 72px);
}

@media (min-width: 900px) {
  .wf {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1.08fr);
    gap: 22px;
    align-items: start;
  }
}

.wf__col {
  padding: clamp(22px, 2.6vw, 32px);
  border-radius: var(--radius-panel);
}

.wf__col--tool {
  border: 1px dashed rgb(255 255 255 / 0.11);
  background: rgb(255 255 255 / 0.015);
}

.wf__col--own {
  position: relative;
  overflow: hidden;
}

.wf__col--own::after {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(
    80% 70% at 100% 0%,
    color-mix(in oklab, var(--color-signal) 13%, transparent),
    transparent 62%
  );
  pointer-events: none;
}

.wf__col--own > * {
  position: relative;
  z-index: 2;
}

.wf__title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-family: var(--font-display);
  font-size: 1.0625rem;
  font-weight: 600;
  letter-spacing: -0.02em;
  margin-bottom: 20px;
}

.wf__marker {
  width: 18px;
  height: 1.5px;
  border-radius: 2px;
  background: rgb(255 255 255 / 0.28);
}

.wf__col--own .wf__marker {
  background: var(--color-signal);
  box-shadow: 0 0 10px color-mix(in oklab, var(--color-signal) 60%, transparent);
}

.wf__list {
  display: grid;
  gap: 14px;
}

.wf__list li {
  position: relative;
  padding-left: 20px;
  font-size: 0.9375rem;
  color: var(--color-ink-muted);
  line-height: 1.58;
}

.wf__list li::before {
  content: '';
  position: absolute;
  left: 0;
  top: 9px;
  width: 9px;
  height: 1px;
  background: rgb(255 255 255 / 0.3);
}

.wf__col--own .wf__list li {
  color: var(--color-ink);
}

.wf__col--own .wf__list li::before {
  background: var(--color-signal);
  opacity: 0.8;
}

.wf__footnote {
  position: relative;
  margin-top: clamp(32px, 4vw, 48px);
  padding-left: 22px;
  max-width: 74ch;
  font-size: 0.9375rem;
  color: var(--color-ink-muted);
}

.wf__footnote-rule {
  position: absolute;
  left: 0;
  top: 4px;
  bottom: 4px;
  width: 1px;
  background: linear-gradient(
    to bottom,
    color-mix(in oklab, var(--color-signal) 70%, transparent),
    transparent
  );
}
</style>
