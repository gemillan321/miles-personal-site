<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, watch } from 'vue'
import { NAV, SITE } from '@/content/site'
import { useCalmMode } from '@/composables/useCalmMode'
import BrandMark from '@/components/ui/BrandMark.vue'
import ActionLink from '@/components/ui/ActionLink.vue'

/**
 * Fixed glass header.
 *
 * It condenses rather than hiding: the bar tightens, the glass thickens and
 * the border appears once you have left the hero, so navigation is always one
 * glance away without a bar that jumps in and out as you scroll.
 *
 * The mobile menu is a real dialog — focus is trapped by scroll lock and
 * Escape, and every link closes it.
 */

const { calm, toggle } = useCalmMode()

const scrolled = ref(false)
const menuOpen = ref(false)
const activeId = ref<string>('')

let sectionObserver: IntersectionObserver | null = null

function onScroll() {
  scrolled.value = window.scrollY > 32
}

function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape') menuOpen.value = false
}

watch(menuOpen, (open) => {
  document.body.dataset.scrollLocked = String(open)
})

onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('keydown', onKey)

  // Highlight the nav item for the section currently in view.
  const targets = NAV.map((n) => document.querySelector(n.href)).filter(
    (el): el is Element => el !== null,
  )
  sectionObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) activeId.value = `#${entry.target.id}`
      }
    },
    { rootMargin: '-45% 0px -50% 0px' },
  )
  targets.forEach((t) => sectionObserver?.observe(t))
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('keydown', onKey)
  sectionObserver?.disconnect()
  document.body.dataset.scrollLocked = 'false'
})
</script>

<template>
  <header class="header" :class="{ 'is-scrolled': scrolled }">
    <div class="header__inner shell">
      <a class="brand" href="#top" aria-label="Back to top">
        <BrandMark />
        <span class="brand__name">{{ SITE.name }}</span>
      </a>

      <nav class="nav" aria-label="Primary">
        <a
          v-for="item in NAV"
          :key="item.href"
          :href="item.href"
          class="nav__link"
          :class="{ 'is-active': activeId === item.href }"
        >
          {{ item.label }}
        </a>
      </nav>

      <div class="header__actions">
        <!-- The site's one neumorphic control. It earns the treatment by
             being a physical switch that does something real. -->
        <button
          type="button"
          class="calm neu"
          :class="{ 'neu--pressed': calm }"
          :aria-pressed="calm"
          @click="toggle"
        >
          <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
            <path
              v-if="!calm"
              d="M1.5 8h3l2-4 3 8 2-4h3"
              fill="none"
              stroke="currentColor"
              stroke-width="1.4"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              v-else
              d="M1.5 8h13"
              fill="none"
              stroke="currentColor"
              stroke-width="1.4"
              stroke-linecap="round"
            />
          </svg>
          <span class="calm__label">{{ calm ? 'Calm' : 'Motion' }}</span>
          <span class="sr-only">{{
            calm ? 'Turn animation back on' : 'Turn off animation and background motion'
          }}</span>
        </button>

        <ActionLink href="#contact" class="header__cta">Start a project</ActionLink>

        <button
          type="button"
          class="burger"
          :aria-expanded="menuOpen"
          aria-controls="mobile-menu"
          @click="menuOpen = !menuOpen"
        >
          <span class="sr-only">{{ menuOpen ? 'Close menu' : 'Open menu' }}</span>
          <span class="burger__bar" :class="{ 'is-open': menuOpen }" />
          <span class="burger__bar burger__bar--2" :class="{ 'is-open': menuOpen }" />
        </button>
      </div>
    </div>

    <!-- Mobile menu -->
    <div id="mobile-menu" class="menu" :class="{ 'is-open': menuOpen }" :inert="!menuOpen">
      <nav class="menu__nav" aria-label="Mobile">
        <a
          v-for="(item, i) in NAV"
          :key="item.href"
          :href="item.href"
          class="menu__link"
          :style="{ '--i': i }"
          @click="menuOpen = false"
        >
          <span class="menu__index">{{ item.index }}</span>
          <span>{{ item.label }}</span>
        </a>
      </nav>
      <div class="menu__foot">
        <span class="signal-dot" />
        <span>{{ SITE.availability.line }}</span>
      </div>
    </div>
  </header>
</template>

<style scoped>
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
}

.header {
  position: fixed;
  inset: 0 0 auto 0;
  z-index: 100;
  transition: background-color 380ms var(--ease-soft);
  animation: header-in 700ms var(--ease-spatial) both;
}

@keyframes header-in {
  from {
    opacity: 0;
    transform: translate3d(0, -14px, 0);
  }
  to {
    opacity: 1;
    transform: none;
  }
}

.header::after {
  content: '';
  position: absolute;
  inset: 0;
  background: rgb(10 11 15 / 0.62);
  backdrop-filter: blur(16px) saturate(150%);
  -webkit-backdrop-filter: blur(16px) saturate(150%);
  border-bottom: 1px solid rgb(255 255 255 / 0.07);
  opacity: 0;
  transition: opacity 380ms var(--ease-soft);
  pointer-events: none;
}

.header.is-scrolled::after {
  opacity: 1;
}

.header__inner {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 18px;
  padding-block: 20px;
  transition: padding-block 380ms var(--ease-spatial);
}

.header.is-scrolled .header__inner {
  padding-block: 12px;
}

.brand {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: var(--color-ink);
  margin-right: auto;
}

.brand__name {
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 1.0625rem;
  letter-spacing: -0.02em;
}

/* ── Nav ──────────────────────────────────────────────────────────────────── */

.nav {
  display: none;
  align-items: center;
  gap: 4px;
}

@media (min-width: 1000px) {
  .nav {
    display: flex;
  }
}

.nav__link {
  position: relative;
  padding: 8px 12px;
  border-radius: 999px;
  font-size: 0.875rem;
  color: var(--color-ink-muted);
  transition:
    color 200ms var(--ease-soft),
    background-color 200ms var(--ease-soft);
}

.nav__link:hover {
  color: var(--color-ink);
  background: rgb(255 255 255 / 0.05);
}

.nav__link.is-active {
  color: var(--color-ink);
}

.nav__link.is-active::after {
  content: '';
  position: absolute;
  left: 50%;
  bottom: 1px;
  width: 4px;
  height: 4px;
  margin-left: -2px;
  border-radius: 999px;
  background: var(--color-signal);
}

/* ── Actions ──────────────────────────────────────────────────────────────── */

.header__actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.calm {
  display: none;
  align-items: center;
  gap: 7px;
  padding: 8px 13px;
  border-radius: 999px;
  font-size: 0.75rem;
  color: var(--color-ink-muted);
  cursor: pointer;
  transition: color 200ms var(--ease-soft);
}

.calm:hover {
  color: var(--color-ink);
}

.calm svg {
  width: 15px;
  height: 15px;
}

@media (min-width: 720px) {
  .calm {
    display: inline-flex;
  }
}

.header__cta {
  display: none;
}

@media (min-width: 640px) {
  .header__cta {
    display: inline-flex;
  }
}

/* ── Burger ───────────────────────────────────────────────────────────────── */

.burger {
  position: relative;
  width: 42px;
  height: 42px;
  border-radius: 12px;
  border: 1px solid rgb(255 255 255 / 0.1);
  background: rgb(255 255 255 / 0.04);
  cursor: pointer;
}

@media (min-width: 1000px) {
  .burger {
    display: none;
  }
}

.burger__bar {
  position: absolute;
  left: 12px;
  width: 18px;
  height: 1.5px;
  border-radius: 2px;
  background: var(--color-ink);
  top: 18px;
  transition: transform 320ms var(--ease-spatial);
}

.burger__bar--2 {
  top: 23px;
}

.burger__bar.is-open {
  transform: translateY(2.5px) rotate(45deg);
}

.burger__bar--2.is-open {
  transform: translateY(-2.5px) rotate(-45deg);
}

/* ── Mobile menu ──────────────────────────────────────────────────────────── */

.menu {
  position: fixed;
  inset: 0;
  background: rgb(8 9 13 / 0.94);
  backdrop-filter: blur(22px);
  -webkit-backdrop-filter: blur(22px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 96px var(--gutter) 48px;
  opacity: 0;
  visibility: hidden;
  transition:
    opacity 340ms var(--ease-soft),
    visibility 340ms;
}

.menu.is-open {
  opacity: 1;
  visibility: visible;
}

@media (min-width: 1000px) {
  .menu {
    display: none;
  }
}

.menu__nav {
  display: grid;
  gap: 4px;
}

.menu__link {
  display: flex;
  align-items: baseline;
  gap: 16px;
  padding: 14px 0;
  border-bottom: 1px solid rgb(255 255 255 / 0.06);
  font-family: var(--font-display);
  font-size: 1.75rem;
  font-weight: 500;
  letter-spacing: -0.03em;
  opacity: 0;
  transform: translateY(12px);
  transition:
    opacity 420ms var(--ease-spatial),
    transform 420ms var(--ease-spatial);
  transition-delay: calc(var(--i) * 45ms + 80ms);
}

.menu.is-open .menu__link {
  opacity: 1;
  transform: none;
}

.menu__index {
  font-family: var(--font-sans);
  font-size: 0.6875rem;
  letter-spacing: 0.15em;
  color: var(--color-ink-faint);
}

.menu__foot {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 36px;
  font-size: 0.875rem;
  color: var(--color-ink-muted);
}

@media (prefers-reduced-motion: reduce) {
  .header {
    animation: none;
  }
  .header__inner,
  .menu__link,
  .burger__bar,
  .header::after {
    transition: none;
  }
}
</style>
