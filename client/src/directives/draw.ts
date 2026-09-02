import type { Directive } from 'vue'
import { isReducedMotion } from '@/composables/useMotionPreference'

/**
 * v-draw — reports an element's scroll progress as a CSS custom property.
 *
 * Sets `--draw` from 0 to 1 as the element travels up the viewport. The
 * through-line uses it with `pathLength="1"` and `stroke-dashoffset`, so the
 * line appears to be drawn by the act of scrolling; other elements use it for
 * scrubbed progress of any kind.
 *
 * All registered elements share one scroll/resize listener and one animation
 * frame, and elements outside the viewport are skipped, so the cost stays flat
 * no matter how many sections register.
 *
 * With reduced motion the value is pinned to 1: the line is simply already
 * drawn, and nothing is lost.
 */

const registry = new Set<HTMLElement>()
let frame = 0
let listening = false

function measure() {
  frame = 0
  const vh = window.innerHeight

  for (const el of registry) {
    const rect = el.getBoundingClientRect()

    // Cheap rejection for anything far off-screen.
    if (rect.bottom < -vh || rect.top > vh * 1.5) continue

    // 0 when the element's top is near the bottom of the viewport,
    // 1 once its bottom has risen past the upper-middle of the viewport.
    const span = rect.height + vh * 0.4
    const raw = (vh * 0.85 - rect.top) / span
    const p = raw < 0 ? 0 : raw > 1 ? 1 : raw

    el.style.setProperty('--draw', p.toFixed(4))
  }
}

function request() {
  if (!frame) frame = requestAnimationFrame(measure)
}

function listen() {
  if (listening) return
  listening = true
  window.addEventListener('scroll', request, { passive: true })
  window.addEventListener('resize', request, { passive: true })
  request()
}

function unlisten() {
  if (!listening || registry.size) return
  listening = false
  window.removeEventListener('scroll', request)
  window.removeEventListener('resize', request)
  if (frame) cancelAnimationFrame(frame)
  frame = 0
}

export const vDraw: Directive<HTMLElement> = {
  mounted(el) {
    if (isReducedMotion()) {
      el.style.setProperty('--draw', '1')
      return
    }
    el.style.setProperty('--draw', '0')
    registry.add(el)
    listen()
  },
  unmounted(el) {
    registry.delete(el)
    unlisten()
  },
}
