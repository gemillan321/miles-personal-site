<script setup lang="ts">
import { SITE, FOOTER, NAV } from '@/content/site'
import StringField from '@/components/visual/StringField.vue'
import BrandMark from '@/components/ui/BrandMark.vue'

const year = new Date().getFullYear()
</script>

<template>
  <footer class="footer">
    <div class="shell">
      <!-- The through-line arrives, and turns out to have been a string. The
           lead-in keeps it continuous across the section boundary, so the line
           you have followed down the page visibly lands on the top string. -->
      <span class="footer__lead" aria-hidden="true" />

      <div class="footer__strings">
        <StringField />
      </div>

      <div class="footer__grid">
        <div class="footer__brand">
          <div class="footer__logo">
            <BrandMark />
            <span>{{ SITE.name }}</span>
          </div>
          <p class="footer__line">{{ SITE.role }} · {{ SITE.location }} · {{ SITE.timezone }}</p>
          <p v-if="SITE.availability.open" class="footer__status">
            <span class="signal-dot" />
            {{ SITE.availability.line }}
          </p>
        </div>

        <nav class="footer__nav" aria-label="Footer">
          <p class="label">Sections</p>
          <ul>
            <li v-for="item in NAV" :key="item.href">
              <a :href="item.href">{{ item.label }}</a>
            </li>
          </ul>
        </nav>

        <div class="footer__nav">
          <p class="label">Elsewhere</p>
          <ul>
            <li v-for="s in SITE.socials" :key="s.href">
              <a
                :href="s.href"
                :target="s.href.startsWith('mailto:') ? undefined : '_blank'"
                rel="noreferrer noopener"
                >{{ s.label }}</a
              >
            </li>
          </ul>
        </div>
      </div>

      <div class="footer__base">
        <p>© {{ year }} {{ SITE.fullName }}. {{ FOOTER.sign }}</p>
        <!-- A small reward for anyone who reads the colophon. -->
        <p class="footer__colophon">
          <span>{{ FOOTER.colophon }}</span>
          <span class="footer__whisper">Mostly written between classes.</span>
        </p>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  position: relative;
  z-index: 2;
  padding-bottom: 48px;
  border-top: 1px solid rgb(255 255 255 / 0.07);
  background: linear-gradient(to bottom, transparent, rgb(0 0 0 / 0.35));
}

.footer__lead {
  position: absolute;
  top: 0;
  left: calc(var(--gutter) + var(--rail-width) * 0.38);
  width: 1.5px;
  height: 48px;
  border-radius: 2px;
  transform: translateX(-50%);
  background: linear-gradient(
    to bottom,
    color-mix(in oklab, var(--color-signal) 30%, transparent),
    var(--color-signal)
  );
}

.footer__strings {
  padding-top: 46px;
  padding-bottom: 34px;
}

.footer__grid {
  display: grid;
  gap: 36px;
  padding-top: 18px;
}

@media (min-width: 760px) {
  .footer__grid {
    grid-template-columns: minmax(0, 1.6fr) minmax(0, 1fr) minmax(0, 1fr);
    gap: 32px;
  }
}

.footer__logo {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 1.0625rem;
  letter-spacing: -0.02em;
}

.footer__line {
  margin-top: 14px;
  font-size: 0.875rem;
  color: var(--color-ink-faint);
}

.footer__status {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  margin-top: 14px;
  font-size: 0.875rem;
  color: var(--color-ink-muted);
}

.footer__nav ul {
  display: grid;
  gap: 9px;
  margin-top: 16px;
}

.footer__nav a {
  font-size: 0.9375rem;
  color: var(--color-ink-muted);
  transition: color 200ms var(--ease-soft);
}

.footer__nav a:hover {
  color: var(--color-signal);
}

.footer__base {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 12px 24px;
  margin-top: 52px;
  padding-top: 22px;
  border-top: 1px solid rgb(255 255 255 / 0.06);
  font-size: 0.8125rem;
  color: var(--color-ink-faint);
}

.footer__colophon {
  position: relative;
}

.footer__whisper {
  position: absolute;
  right: 0;
  bottom: 0;
  white-space: nowrap;
  opacity: 0;
  transform: translateY(3px);
  transition:
    opacity 340ms var(--ease-soft),
    transform 340ms var(--ease-spatial);
  color: color-mix(in oklab, var(--color-signal) 62%, var(--color-ink-faint));
  font-family: var(--font-editorial);
  font-style: italic;
  font-size: 0.875rem;
}

.footer__colophon:hover > span:first-child {
  opacity: 0;
}

.footer__colophon:hover .footer__whisper {
  opacity: 1;
  transform: none;
}

.footer__colophon > span:first-child {
  transition: opacity 340ms var(--ease-soft);
}

@media (prefers-reduced-motion: reduce) {
  .footer__whisper,
  .footer__colophon > span:first-child {
    transition: none;
  }
}
</style>
