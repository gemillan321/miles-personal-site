<script setup lang="ts">
import { HERO, SITE } from '@/content/site'
import HeroStack from '@/components/visual/HeroStack.vue'
import RailSegment from '@/components/visual/RailSegment.vue'
import ActionLink from '@/components/ui/ActionLink.vue'
</script>

<template>
  <section id="top" class="section hero">
    <div class="shell">
      <RailSegment variant="origin" index="01" />

      <div class="section-body railed hero__grid">
        <div class="hero__text">
          <p class="hero__status">
            <span class="signal-dot" />
            <span>{{ SITE.availability.line }}</span>
          </p>

          <h1 class="display-xl hero__title">
            <span>{{ HERO.headlineLead }}</span>
            <span class="editorial">{{ ' ' + HERO.headlineEditorial }}</span>
            <span>{{ ' ' + HERO.headlineTail }}</span>
          </h1>

          <p class="lede hero__lede">{{ HERO.lede }}</p>

          <div class="hero__actions">
            <ActionLink :href="HERO.primaryCta.href">{{ HERO.primaryCta.label }}</ActionLink>
            <ActionLink :href="HERO.secondaryCta.href" variant="ghost">
              {{ HERO.secondaryCta.label }}
            </ActionLink>
          </div>

          <p class="hero__meta">
            {{ SITE.role }} · {{ SITE.location }} · Working with clients anywhere
          </p>
        </div>

        <div class="hero__visual">
          <HeroStack />
        </div>
      </div>
    </div>

    <div class="hero__scroll" aria-hidden="true">
      <span class="hero__scroll-rule" />
      <span class="label">Scroll</span>
    </div>
  </section>
</template>

<style scoped>
.hero {
  min-height: 100svh;
  display: flex;
  align-items: center;
}

.hero .shell {
  width: 100%;
}

.hero__grid {
  display: grid;
  gap: clamp(48px, 7vw, 72px);
  padding-top: clamp(112px, 15vh, 168px);
  padding-bottom: clamp(88px, 12vh, 132px);
  align-items: center;
}

@media (min-width: 1000px) {
  .hero__grid {
    grid-template-columns: minmax(0, 1.22fr) minmax(0, 1fr);
    gap: clamp(36px, 4vw, 64px);
  }
}

/* ── Text column ──────────────────────────────────────────────────────────── */

.hero__status {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 7px 14px 7px 12px;
  border-radius: 999px;
  border: 1px solid rgb(255 255 255 / 0.1);
  background: rgb(255 255 255 / 0.035);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  font-size: 0.8125rem;
  color: var(--color-ink-muted);
  margin-bottom: 28px;
  animation: hero-in 800ms var(--ease-spatial) both;
}

.hero__title {
  max-width: 17ch;
  animation: hero-in 900ms var(--ease-spatial) 80ms both;
}

.hero__lede {
  margin-top: 26px;
  max-width: 52ch;
  animation: hero-in 900ms var(--ease-spatial) 180ms both;
}

.hero__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 36px;
  animation: hero-in 900ms var(--ease-spatial) 280ms both;
}

.hero__meta {
  margin-top: 30px;
  font-size: 0.8125rem;
  color: var(--color-ink-faint);
  animation: hero-in 900ms var(--ease-spatial) 380ms both;
}

@keyframes hero-in {
  from {
    opacity: 0;
    transform: translate3d(0, 18px, 0);
  }
  to {
    opacity: 1;
    transform: none;
  }
}

/* ── Visual column ────────────────────────────────────────────────────────── */

.hero__visual {
  position: relative;
  animation: hero-visual-in 1200ms var(--ease-spatial) 260ms both;
}

/* Below the two-column breakpoint the visual would otherwise stretch to the
   full column and dwarf the text it is supporting. */
@media (max-width: 999px) {
  .hero__visual {
    width: 100%;
    max-width: 460px;
    margin-inline: auto;
  }
}

@keyframes hero-visual-in {
  from {
    opacity: 0;
    transform: translate3d(0, 30px, 0) scale(0.965);
  }
  to {
    opacity: 1;
    transform: none;
  }
}

/* ── Scroll cue ───────────────────────────────────────────────────────────── */

.hero__scroll {
  position: absolute;
  bottom: 28px;
  left: 50%;
  transform: translateX(-50%);
  display: none;
  align-items: center;
  gap: 12px;
}

@media (min-width: 1000px) and (min-height: 720px) {
  .hero__scroll {
    display: flex;
  }
}

.hero__scroll-rule {
  width: 34px;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgb(255 255 255 / 0.35));
  animation: scroll-sweep 2.6s var(--ease-soft) infinite;
}

@keyframes scroll-sweep {
  0%,
  100% {
    opacity: 0.25;
    transform: translateX(-4px);
  }
  50% {
    opacity: 1;
    transform: translateX(4px);
  }
}

@media (prefers-reduced-motion: reduce) {
  .hero__status,
  .hero__title,
  .hero__lede,
  .hero__actions,
  .hero__meta,
  .hero__visual {
    animation: none;
  }
  .hero__scroll-rule {
    animation: none;
    opacity: 0.5;
  }
}
</style>
