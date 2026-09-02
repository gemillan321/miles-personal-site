import { ref, readonly } from 'vue'

/**
 * A single shared reactive source of truth for `prefers-reduced-motion`.
 *
 * Every motion system on the site checks this before doing work — the rig
 * stops its loop, reveals become instant, parallax is skipped entirely. The
 * media query is watched live so toggling the OS setting takes effect without
 * a reload.
 */

const QUERY = '(prefers-reduced-motion: reduce)'
const reduced = ref(false)
let initialised = false

function init() {
  if (initialised || typeof window === 'undefined') return
  initialised = true

  const mq = window.matchMedia(QUERY)
  reduced.value = mq.matches
  mq.addEventListener('change', (e) => {
    reduced.value = e.matches
  })
}

export function useMotionPreference() {
  init()
  return { prefersReducedMotion: readonly(reduced) }
}

/** Imperative check for non-reactive call sites (directives, one-off guards). */
export function isReducedMotion(): boolean {
  if (typeof window === 'undefined') return true
  return window.matchMedia(QUERY).matches
}
