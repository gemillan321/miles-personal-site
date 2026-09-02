import { ref, readonly, watch } from 'vue'

/**
 * Calm mode — a visitor-facing switch that quiets the whole site.
 *
 * `prefers-reduced-motion` is respected automatically, but plenty of people
 * who find drifting light distracting have never changed an OS setting. This
 * gives them a control in the header: one toggle stops the rig, freezes the
 * aurora, removes parallax and makes reveals instant. Nothing is hidden and no
 * content is lost — the page just stops moving.
 *
 * State lives in a data attribute on <html> so CSS can respond without any
 * component knowing about it, and is remembered between visits.
 */

const STORAGE_KEY = 'calm-mode'
const calm = ref(false)
let initialised = false

export function useCalmMode() {
  if (!initialised && typeof window !== 'undefined') {
    initialised = true
    try {
      calm.value = window.localStorage.getItem(STORAGE_KEY) === 'true'
    } catch {
      /* Storage can be unavailable (private mode, blocked cookies). Not fatal. */
    }
    apply(calm.value)

    watch(calm, (value) => {
      apply(value)
      try {
        window.localStorage.setItem(STORAGE_KEY, String(value))
      } catch {
        /* ignore */
      }
    })
  }

  return {
    calm: readonly(calm),
    toggle: () => {
      calm.value = !calm.value
    },
  }
}

function apply(value: boolean) {
  const root = document.documentElement
  root.dataset.calm = String(value)
  if (value) {
    root.style.setProperty('--light-x', '0.5')
    root.style.setProperty('--light-y', '0.18')
    root.style.setProperty('--px', '0')
    root.style.setProperty('--py', '0')
  }
}

/** Imperative check used inside the animation loop. */
export function isCalm(): boolean {
  return document.documentElement.dataset.calm === 'true'
}
