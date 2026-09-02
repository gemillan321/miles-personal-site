import type { Directive } from 'vue'
import { isReducedMotion } from '@/composables/useMotionPreference'

/**
 * v-reveal — entrance on scroll.
 *
 * One shared IntersectionObserver for the whole document rather than one per
 * element, and each element unobserves itself after it fires. Reveals are
 * one-way: content never fades back out, because re-animating text a visitor
 * has already read is irritating rather than delightful.
 *
 *   <div v-reveal>            fires immediately when it enters
 *   <div v-reveal="120">      staggered 120ms behind its neighbours
 */

let observer: IntersectionObserver | null = null

function getObserver() {
  if (observer) return observer
  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        const el = entry.target as HTMLElement
        el.dataset.reveal = 'in'
        observer?.unobserve(el)
      }
    },
    { rootMargin: '0px 0px -12% 0px', threshold: 0.08 },
  )
  return observer
}

export const vReveal: Directive<HTMLElement, number | undefined> = {
  mounted(el, binding) {
    if (isReducedMotion()) {
      el.dataset.reveal = 'in'
      return
    }
    el.dataset.reveal = 'out'
    if (binding.value) el.style.setProperty('--reveal-delay', `${binding.value}ms`)
    getObserver().observe(el)
  },
  unmounted(el) {
    observer?.unobserve(el)
  },
}
