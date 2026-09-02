<script setup lang="ts">
import { PROJECTS } from '@/content/projects'
import { SITE } from '@/content/site'
import RailSegment from '@/components/visual/RailSegment.vue'
import SectionHeading from '@/components/ui/SectionHeading.vue'
import ProjectPreview from '@/components/visual/ProjectPreview.vue'
</script>

<template>
  <section id="work" class="section work" aria-labelledby="work-title">
    <div class="shell">
      <RailSegment variant="straight" index="04" />

      <div class="section-body railed">
        <SectionHeading
          id="work-title"
          kicker="Featured work"
          lead="Fewer projects, explained"
          editorial="properly"
          tail="."
          lede="I would rather show you two builds in enough detail to judge them than ten thumbnails that tell you nothing."
        />

        <div class="work__list">
          <article
            v-for="(project, i) in PROJECTS"
            :key="project.slug"
            class="case"
            :class="{ 'case--flip': i % 2 === 1 }"
          >
            <!-- Visual -->
            <div v-draw v-reveal class="case__visual">
              <div v-tilt="3">
                <ProjectPreview :kind="project.preview" :accent="project.accent" />
              </div>
              <ul class="case__metrics">
                <li v-for="m in project.metrics" :key="m.label">
                  <span class="label">{{ m.label }}</span>
                  <span class="case__metric-value">{{ m.value }}</span>
                </li>
              </ul>
            </div>

            <!-- Body -->
            <div class="case__body">
              <p v-reveal class="case__meta">
                <span class="case__kicker">{{ project.kicker }}</span>
                <span class="case__dot" aria-hidden="true">·</span>
                <span>{{ project.year }}</span>
                <span class="case__status" :class="`is-${project.accent}`">{{
                  project.status
                }}</span>
              </p>

              <h3 v-reveal="60" class="display-l case__name">{{ project.name }}</h3>
              <p v-reveal="100" class="lede case__summary">{{ project.summary }}</p>

              <dl v-reveal="140" class="case__notes">
                <div class="case__note">
                  <dt class="label">The problem</dt>
                  <dd>{{ project.problem }}</dd>
                </div>
                <div class="case__note">
                  <dt class="label">My role</dt>
                  <dd>{{ project.role }}</dd>
                </div>
                <div class="case__note">
                  <dt class="label">What I built</dt>
                  <dd>
                    <ul class="case__contrib">
                      <li v-for="c in project.contribution" :key="c">
                        <span class="case__bullet" aria-hidden="true" />{{ c }}
                      </li>
                    </ul>
                  </dd>
                </div>
                <div class="case__note case__note--pull">
                  <dt class="label">What makes it interesting</dt>
                  <dd class="case__pull">{{ project.interesting }}</dd>
                </div>
              </dl>

              <ul v-reveal="180" class="case__stack">
                <li v-for="tech in project.stack" :key="tech" class="chip">{{ tech }}</li>
              </ul>

              <ul v-if="project.links.length" class="case__links">
                <li v-for="link in project.links" :key="link.href">
                  <a :href="link.href" target="_blank" rel="noreferrer noopener">
                    {{ link.label }}
                    <svg viewBox="0 0 14 14" aria-hidden="true" focusable="false">
                      <path
                        d="M4 10L10 4M10 4H5M10 4v5"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="1.4"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  </a>
                </li>
              </ul>
            </div>
          </article>
        </div>

        <p v-reveal class="work__more">
          More builds, experiments and coursework live on
          <a
            :href="SITE.socials[0].href"
            class="work__more-link"
            target="_blank"
            rel="noreferrer noopener"
            >GitHub</a
          >
          — and there is usually something half-finished that is not on here yet.
        </p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.work__list {
  display: grid;
  gap: clamp(72px, 10vw, 132px);
  margin-top: clamp(52px, 7vw, 88px);
}

.case {
  display: grid;
  gap: clamp(28px, 4vw, 52px);
  align-items: start;
}

@media (min-width: 980px) {
  .case {
    grid-template-columns: minmax(0, 0.92fr) minmax(0, 1.08fr);
  }
  .case--flip .case__visual {
    order: 2;
  }
}

/* ── Visual column ────────────────────────────────────────────────────────── */

.case__visual {
  position: sticky;
  top: 120px;
}

@media (max-width: 979px) {
  .case__visual {
    position: static;
  }
}

.case__metrics {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
  margin-top: 14px;
}

.case__metrics li {
  display: grid;
  gap: 3px;
  padding: 12px 14px;
  border-radius: 12px;
  background: rgb(255 255 255 / 0.03);
  border: 1px solid rgb(255 255 255 / 0.06);
}

.case__metric-value {
  font-family: var(--font-display);
  font-size: 0.9375rem;
  font-weight: 500;
  letter-spacing: -0.01em;
}

/* ── Body column ──────────────────────────────────────────────────────────── */

.case__meta {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  font-size: 0.8125rem;
  color: var(--color-ink-faint);
}

.case__kicker {
  color: var(--color-ink-muted);
}

.case__status {
  margin-left: 4px;
  padding: 3px 10px;
  border-radius: 999px;
  font-size: 0.6875rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  border: 1px solid currentColor;
  opacity: 0.85;
}

.case__status.is-violet {
  color: var(--color-violet);
}
.case__status.is-azure {
  color: var(--color-azure);
}
.case__status.is-cyan {
  color: var(--color-cyan);
}
.case__status.is-signal {
  color: var(--color-signal);
}

.case__name {
  margin-top: 14px;
}

.case__summary {
  margin-top: 16px;
  max-width: 46ch;
}

.case__notes {
  display: grid;
  gap: 26px;
  margin-top: 34px;
  padding-top: 30px;
  border-top: 1px solid rgb(255 255 255 / 0.07);
}

.case__note dd {
  margin: 8px 0 0;
  color: var(--color-ink-muted);
  font-size: 0.9375rem;
  max-width: 58ch;
}

.case__contrib {
  display: grid;
  gap: 8px;
}

.case__contrib li {
  display: grid;
  grid-template-columns: 14px 1fr;
  gap: 10px;
  align-items: start;
}

.case__bullet {
  width: 5px;
  height: 5px;
  margin-top: 8px;
  border-radius: 999px;
  background: var(--color-signal);
  opacity: 0.65;
}

/* The one pull-quote treatment in the section: the sentence a developer will
   actually read to decide whether I know what I am doing. */
.case__pull {
  font-family: var(--font-editorial);
  font-style: italic;
  font-size: clamp(1.06rem, 1.5vw, 1.2rem);
  line-height: 1.5;
  color: var(--color-ink) !important;
  padding-left: 18px;
  border-left: 1px solid color-mix(in oklab, var(--color-signal) 55%, transparent);
}

.case__stack {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 30px;
}

.chip {
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 0.75rem;
  color: var(--color-ink-muted);
  background: rgb(255 255 255 / 0.04);
  border: 1px solid rgb(255 255 255 / 0.08);
}

.case__links {
  display: flex;
  gap: 18px;
  margin-top: 24px;
}

.case__links a {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.9375rem;
  color: var(--color-signal);
  border-bottom: 1px solid color-mix(in oklab, var(--color-signal) 40%, transparent);
  padding-bottom: 2px;
}

.case__links svg {
  width: 13px;
  height: 13px;
}

.work__more {
  margin-top: clamp(56px, 7vw, 88px);
  padding-top: 28px;
  border-top: 1px solid rgb(255 255 255 / 0.07);
  color: var(--color-ink-faint);
  font-size: 0.9375rem;
  max-width: 60ch;
}

.work__more-link {
  color: var(--color-ink-muted);
  border-bottom: 1px solid rgb(255 255 255 / 0.2);
}
</style>
