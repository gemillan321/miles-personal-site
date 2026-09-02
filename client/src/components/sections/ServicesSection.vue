<script setup lang="ts">
import { ref } from 'vue'
import { SERVICES } from '@/content/services'
import RailSegment from '@/components/visual/RailSegment.vue'
import SectionHeading from '@/components/ui/SectionHeading.vue'

/**
 * What I build.
 *
 * Presented as an index rather than a grid of identical cards: a numbered
 * list where each entry opens to show concrete examples. Reading it feels
 * like scanning a contents page, which is exactly the job — a visitor should
 * be able to find the line that describes their situation in about four
 * seconds.
 *
 * A real disclosure (button + aria-expanded), not a hover reveal: the content
 * has to be reachable on a phone and by keyboard.
 */

const open = ref<string | null>(SERVICES[0]?.id ?? null)

function toggle(id: string) {
  open.value = open.value === id ? null : id
}

/** Rail tick positions, spread across the section. */
const ticks = SERVICES.map((_, i) => 120 + i * 150)
</script>

<template>
  <section id="services" class="section" aria-labelledby="services-title">
    <div class="shell">
      <RailSegment variant="branch" index="03" :ticks="ticks" />

      <div class="section-body railed">
        <SectionHeading
          id="services-title"
          kicker="What I build"
          lead="Different problems, the same"
          editorial="way of working"
          tail="."
          lede="If any of these sounds like the thing you have been putting off, that is the conversation to have."
        />

        <ul class="services">
          <li
            v-for="(service, i) in SERVICES"
            :key="service.id"
            v-reveal="i * 60"
            class="service"
            :class="[`is-${service.accent}`, { 'is-open': open === service.id }]"
          >
            <button
              type="button"
              class="service__head"
              :aria-expanded="open === service.id"
              :aria-controls="`svc-${service.id}`"
              @click="toggle(service.id)"
            >
              <span class="service__index">{{ String(i + 1).padStart(2, '0') }}</span>
              <span class="service__title display-m">{{ service.title }}</span>
              <!-- Plus becomes minus rather than a cross: a cross reads as
                   "delete", which is not what closing a section does. -->
              <span class="service__icon" aria-hidden="true">
                <svg viewBox="0 0 14 14" focusable="false">
                  <path
                    d="M1 7h12"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.5"
                    stroke-linecap="round"
                  />
                  <path
                    class="service__icon-stem"
                    d="M7 1v12"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.5"
                    stroke-linecap="round"
                  />
                </svg>
              </span>
            </button>

            <p class="service__blurb">{{ service.blurb }}</p>

            <div :id="`svc-${service.id}`" class="service__panel" :hidden="open !== service.id">
              <p class="label service__examples-label">Typically looks like</p>
              <ul class="service__examples">
                <li v-for="example in service.examples" :key="example">
                  <span class="service__bullet" aria-hidden="true" />
                  {{ example }}
                </li>
              </ul>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<style scoped>
.services {
  margin-top: clamp(44px, 6vw, 72px);
  border-top: 1px solid rgb(255 255 255 / 0.07);
}

.service {
  position: relative;
  border-bottom: 1px solid rgb(255 255 255 / 0.07);
  padding-block: clamp(20px, 2.4vw, 28px);
  transition: background-color 300ms var(--ease-soft);
}

/* A very soft wash of the service's own accent, only while it is open. */
.service::before {
  content: '';
  position: absolute;
  inset: 0 -20px;
  border-radius: 14px;
  opacity: 0;
  transition: opacity 420ms var(--ease-soft);
  pointer-events: none;
  background: linear-gradient(90deg, rgb(255 255 255 / 0.035), transparent 62%);
}

.service.is-open::before {
  opacity: 1;
}

.service__head {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 16px;
  width: 100%;
  padding: 0;
  background: none;
  border: 0;
  text-align: left;
  cursor: pointer;
  color: inherit;
}

.service__index {
  font-size: 0.6875rem;
  font-weight: 500;
  letter-spacing: 0.15em;
  color: var(--color-ink-faint);
  transition: color 260ms var(--ease-soft);
}

.service.is-open .service__index,
.service__head:hover .service__index {
  color: var(--color-signal);
}

.service__title {
  transition: transform 420ms var(--ease-spatial);
}

.service__head:hover .service__title {
  transform: translateX(5px);
}

.service__icon {
  display: grid;
  place-items: center;
  width: 34px;
  height: 34px;
  border-radius: 999px;
  border: 1px solid rgb(255 255 255 / 0.12);
  color: var(--color-ink-muted);
  transition:
    transform 420ms var(--ease-spatial),
    border-color 260ms var(--ease-soft),
    background-color 260ms var(--ease-soft);
}

.service__icon svg {
  width: 13px;
  height: 13px;
}

.service__icon-stem {
  transform-box: fill-box;
  transform-origin: center;
  transition: transform 380ms var(--ease-spatial);
}

.service.is-open .service__icon {
  border-color: color-mix(in oklab, var(--color-signal) 55%, transparent);
  color: var(--color-signal);
  background: color-mix(in oklab, var(--color-signal) 12%, transparent);
}

.service.is-open .service__icon-stem {
  transform: scaleY(0);
}

.service__blurb {
  margin-top: 12px;
  padding-left: 40px;
  max-width: 62ch;
  color: var(--color-ink-muted);
  font-size: clamp(0.94rem, 1.05vw, 1rem);
}

/* ── Disclosure panel ─────────────────────────────────────────────────────── */

.service__panel {
  padding-left: 40px;
  margin-top: 20px;
  animation: panel-in 460ms var(--ease-spatial);
}

@keyframes panel-in {
  from {
    opacity: 0;
    transform: translateY(-6px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}

.service__examples-label {
  margin-bottom: 12px;
}

.service__examples {
  display: grid;
  gap: 9px;
  max-width: 60ch;
}

.service__examples li {
  display: grid;
  grid-template-columns: 14px 1fr;
  gap: 10px;
  align-items: start;
  font-size: 0.9375rem;
  color: var(--color-ink-muted);
}

.service__bullet {
  width: 5px;
  height: 5px;
  margin-top: 9px;
  border-radius: 999px;
  background: var(--color-signal);
  opacity: 0.7;
}

@media (max-width: 640px) {
  .service__blurb,
  .service__panel {
    padding-left: 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .service__panel {
    animation: none;
  }
  .service__title,
  .service__icon,
  .service::before {
    transition: none;
  }
}
</style>
