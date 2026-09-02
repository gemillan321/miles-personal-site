<script setup lang="ts">
import { PROCESS } from '@/content/process'
import RailSegment from '@/components/visual/RailSegment.vue'
import SectionHeading from '@/components/ui/SectionHeading.vue'

/**
 * Process.
 *
 * The brief's instruction was "five steps, but not five numbered boxes". So
 * the steps are strung along the through-line itself: the line that has been
 * running down the page since the hero passes through a node at each stage,
 * and fills with warm colour as you scroll through them. The numbers are
 * present as outlined ghosts rather than badges, which keeps the eye on the
 * words.
 *
 * Each step ends with a plain-language "what this means for you", because the
 * whole value of a process section is removing uncertainty for someone who
 * has never commissioned software before.
 */
</script>

<template>
  <section id="process" class="section" aria-labelledby="process-title">
    <div class="shell">
      <RailSegment variant="straight" index="07" />

      <div class="section-body">
        <div class="railed">
          <SectionHeading
            id="process-title"
            kicker="Process"
            lead="How working together"
            editorial="actually goes"
            tail="."
            lede="No jargon, no disappearing for a month. Five stages, and you can see where the project is at every one of them."
          />
        </div>

        <ol v-draw class="steps">
          <!-- The line through the nodes. It sits at exactly the same x as the
               rail segment behind it, so it reads as the same line. -->
          <span class="steps__line" aria-hidden="true" />

          <li v-for="(step, i) in PROCESS" :key="step.n" class="step">
            <div class="step__node-col" aria-hidden="true">
              <span class="step__node" :style="{ '--i': i }" />
            </div>

            <div v-reveal="i * 70" class="step__body">
              <p class="step__n">{{ step.n }}</p>
              <h3 class="display-m step__title">{{ step.title }}</h3>
              <p class="step__blurb">{{ step.blurb }}</p>
              <p class="step__for">
                <span class="step__for-label">For you</span>
                {{ step.forYou }}
              </p>
            </div>
          </li>
        </ol>
      </div>
    </div>
  </section>
</template>

<style scoped>
.steps {
  position: relative;
  margin-top: clamp(48px, 6vw, 76px);
  display: grid;
  gap: clamp(30px, 4vw, 52px);
}

/* Progressive fill: warm above the scroll position, hairline below. */
.steps__line {
  position: absolute;
  top: 8px;
  bottom: 8px;
  left: calc(var(--rail-width) * 0.38);
  width: 1.5px;
  border-radius: 2px;
  transform: translateX(-50%);
  background: linear-gradient(
    to bottom,
    var(--color-signal) 0%,
    var(--color-signal) calc(var(--draw, 0) * 100%),
    rgb(255 255 255 / 0.08) calc(var(--draw, 0) * 100%),
    rgb(255 255 255 / 0.08) 100%
  );
}

.step {
  display: grid;
  grid-template-columns: var(--rail-width) minmax(0, 1fr);
  align-items: start;
}

.step__node-col {
  position: relative;
  height: 100%;
}

.step__node {
  position: absolute;
  top: 10px;
  left: 38%;
  width: 11px;
  height: 11px;
  border-radius: 999px;
  transform: translateX(-50%);
  background: var(--color-ground);
  border: 1.5px solid rgb(255 255 255 / 0.22);
  transition:
    border-color 400ms var(--ease-soft),
    box-shadow 400ms var(--ease-soft);
}

/* Nodes light up as their step reveals — :has() keeps this in CSS instead of
   adding another observer. Browsers without :has() simply show dim nodes. */
.step:has([data-reveal='in']) .step__node {
  border-color: var(--color-signal);
  background: color-mix(in oklab, var(--color-signal) 22%, var(--color-ground));
  box-shadow: 0 0 0 4px color-mix(in oklab, var(--color-signal) 12%, transparent);
}

.step__body {
  position: relative;
  padding-bottom: 4px;
}

.step__n {
  font-family: var(--font-display);
  font-size: clamp(2.4rem, 5.5vw, 3.6rem);
  font-weight: 700;
  line-height: 0.9;
  letter-spacing: -0.04em;
  color: transparent;
  -webkit-text-stroke: 1px rgb(255 255 255 / 0.16);
  margin-bottom: 10px;
  user-select: none;
}

.step__title {
  font-size: clamp(1.25rem, 2vw, 1.6rem);
}

.step__blurb {
  margin-top: 12px;
  max-width: 58ch;
  color: var(--color-ink-muted);
  font-size: 0.9375rem;
}

.step__for {
  margin-top: 16px;
  padding: 12px 16px;
  border-radius: 12px;
  max-width: 58ch;
  font-family: var(--font-editorial);
  font-style: italic;
  font-size: 1.0625rem;
  line-height: 1.45;
  color: var(--color-ink);
  background: color-mix(in oklab, var(--color-signal) 7%, transparent);
  border: 1px solid color-mix(in oklab, var(--color-signal) 18%, transparent);
}

.step__for-label {
  display: block;
  font-family: var(--font-sans);
  font-style: normal;
  font-size: 0.6875rem;
  font-weight: 500;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: color-mix(in oklab, var(--color-signal) 82%, white);
  margin-bottom: 5px;
}

@media (min-width: 1080px) {
  .steps {
    gap: 64px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .step__node {
    transition: none;
  }
}
</style>
