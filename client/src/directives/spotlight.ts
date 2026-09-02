import type { Directive } from 'vue'

/**
 * v-spotlight — a soft glow that follows the cursor across one element.
 *
 * Complements The Rig: the rig gives the page a single coherent light, this
 * gives the element you are actually touching a local response. Only the
 * hovered element listens, so the cost is one pointermove handler at a time.
 */

interface SpotlightEl extends HTMLElement {
  _spotCleanup?: () => void
}

export const vSpotlight: Directive<SpotlightEl> = {
  mounted(el) {
    el.classList.add('spotlight')

    let frame = 0
    let x = 0
    let y = 0

    const apply = () => {
      frame = 0
      el.style.setProperty('--mx', `${x}px`)
      el.style.setProperty('--my', `${y}px`)
    }

    const onMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect()
      x = e.clientX - rect.left
      y = e.clientY - rect.top
      if (!frame) frame = requestAnimationFrame(apply)
    }

    const onEnter = () => el.addEventListener('pointermove', onMove, { passive: true })
    const onLeave = () => {
      el.removeEventListener('pointermove', onMove)
      if (frame) cancelAnimationFrame(frame)
      frame = 0
    }

    el.addEventListener('pointerenter', onEnter)
    el.addEventListener('pointerleave', onLeave)

    el._spotCleanup = () => {
      el.removeEventListener('pointerenter', onEnter)
      el.removeEventListener('pointerleave', onLeave)
      onLeave()
    }
  },
  unmounted(el) {
    el._spotCleanup?.()
  },
}
