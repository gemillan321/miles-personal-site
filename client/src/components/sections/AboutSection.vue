<script setup lang="ts">
import { ABOUT } from '@/content/site'
import RailSegment from '@/components/visual/RailSegment.vue'
import SectionHeading from '@/components/ui/SectionHeading.vue'
import milesPhoto from '@/assets/miles-photo.png'
</script>

<template>
  <section id="about" class="section" aria-labelledby="about-title">
    <div class="shell">
      <RailSegment variant="wave" index="02" />

      <div class="section-body railed">
        <div class="about__grid">
          <div class="about__heading">
            <SectionHeading
              id="about-title"
              :kicker="ABOUT.kicker"
              :lead="ABOUT.headlineLead"
              :editorial="ABOUT.headlineEditorial"
              :tail="ABOUT.headlineTail"
            />
          </div>

          <div class="about__prose">
            <p v-for="(p, i) in ABOUT.paragraphs" :key="i" v-reveal="i * 90" class="about__p">
              {{ p }}
            </p>
          </div>
        </div>

        <!-- A small bento of personal detail. Four cells, three of them plain
             text and one quietly alive — enough personality to feel like a
             person, not enough to become a section about hobbies. -->
        <ul class="bento about__facts">
          <li v-reveal class="cell cell--w2 cell--h2 surface lit-edge about__photo">
            <div class="about__photo-glow" aria-hidden="true" />
            <img :src="milesPhoto" alt="Miles" class="about__photo-img" width="683" height="900" />
            <div class="about__photo-scrim" aria-hidden="true" />
            <p class="label about__photo-label">Behind this site</p>
            <p class="display-s about__photo-name">Miles</p>
          </li>

          <li
            v-for="(fact, i) in ABOUT.facts"
            :key="fact.label"
            v-reveal="i * 70"
            v-spotlight
            class="cell glass lit-edge about__fact"
          >
            <p class="label">{{ fact.label }}</p>
            <p class="display-s about__fact-value">{{ fact.value }}</p>
            <p class="about__fact-detail">{{ fact.detail }}</p>

            <!-- The guitar reference: six strings, resting. They come back at
                 full size in the footer, where you can actually play them. -->
            <svg
              v-if="i === ABOUT.facts.length - 1"
              class="about__strings"
              viewBox="0 0 200 34"
              aria-hidden="true"
              focusable="false"
              preserveAspectRatio="none"
            >
              <line
                v-for="s in 6"
                :key="s"
                x1="0"
                :y1="3 + (s - 1) * 5.6"
                x2="200"
                :y2="3 + (s - 1) * 5.6"
                :style="{ '--s': s, 'stroke-width': `${0.5 + (6 - s) * 0.18}` }"
              />
            </svg>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<style scoped>
.about__grid {
  display: grid;
  gap: clamp(32px, 5vw, 64px);
}

@media (min-width: 900px) {
  .about__grid {
    grid-template-columns: minmax(0, 0.85fr) minmax(0, 1fr);
    align-items: start;
  }
  .about__heading {
    position: sticky;
    top: 128px;
  }
}

.about__prose {
  display: grid;
  gap: 22px;
}

.about__p {
  color: var(--color-ink-muted);
  font-size: clamp(1rem, 1.15vw, 1.0625rem);
  max-width: 60ch;
}

.about__p:first-child {
  color: var(--color-ink);
  font-size: clamp(1.06rem, 1.5vw, 1.2rem);
  line-height: 1.6;
}

/* ── Facts ────────────────────────────────────────────────────────────────── */

.about__facts {
  margin-top: clamp(48px, 7vw, 88px);
}

.about__fact {
  justify-content: flex-start;
  gap: 6px;
  min-height: 138px;
  transition: transform 420ms var(--ease-spatial);
}

/* ── Photo ────────────────────────────────────────────────────────────────── */
/* The one bento cell that isn't text. A cutout portrait, not a framed photo —
   it sits directly on the cell's ground so it reads as part of the material
   rather than a pasted-in image, with a glow standing in for a backdrop. */
.about__photo {
  padding: 0;
  justify-content: flex-end;
  background: var(--color-ground-3);
}

.about__photo-glow {
  position: absolute;
  inset: -15%;
  z-index: 0;
  background: radial-gradient(
    55% 50% at 50% 28%,
    color-mix(in oklab, var(--color-violet) 55%, transparent),
    transparent 70%
  );
  filter: blur(48px);
}

.about__photo-img {
  position: relative;
  z-index: 1;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: top center;
  filter: drop-shadow(0 20px 34px rgb(0 0 0 / 0.5));
}

.about__photo-scrim {
  position: absolute;
  inset: 0;
  z-index: 2;
  background: linear-gradient(to top, rgb(10 11 15 / 0.82), transparent 55%);
  pointer-events: none;
}

.about__photo-label {
  position: relative;
  z-index: 3;
  margin: 0 0 4px;
  padding: 0 clamp(16px, 2vw, 24px);
}

.about__photo-name {
  position: relative;
  z-index: 3;
  margin: 0;
  padding: 0 clamp(16px, 2vw, 24px) clamp(16px, 2vw, 24px);
}

.about__fact:hover {
  transform: translateY(-3px);
}

.about__fact-value {
  margin-top: 10px;
  position: relative;
  z-index: 2;
}

.about__fact-detail {
  font-size: 0.8125rem;
  color: var(--color-ink-faint);
  position: relative;
  z-index: 2;
}

.about__strings {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 14px;
  width: 100%;
  height: 34px;
  z-index: 1;
  opacity: 0.5;
}

.about__strings line {
  stroke: color-mix(in oklab, var(--color-signal) 55%, transparent);
  animation: string-rest 7s var(--ease-soft) infinite;
  animation-delay: calc(var(--s) * -0.55s);
}

/* A string settling after being touched — a shiver, not a bounce. */
@keyframes string-rest {
  0%,
  84%,
  100% {
    opacity: 0.45;
    transform: translateY(0);
  }
  88% {
    opacity: 1;
    transform: translateY(-0.9px);
  }
  92% {
    opacity: 0.8;
    transform: translateY(0.7px);
  }
  96% {
    opacity: 0.6;
    transform: translateY(-0.3px);
  }
}

@media (prefers-reduced-motion: reduce) {
  .about__strings line {
    animation: none;
  }
  .about__fact {
    transition: none;
  }
}
</style>
