import type { Directive } from 'vue'
import { isReducedMotion } from '@/composables/useMotionPreference'

/**
 * v-magnetic — the element leans a few pixels toward the cursor while it is
 * hovered, and springs back when it leaves.
 *
 * Applied only to primary calls to action. Used on everything it becomes
 * noise; used on two buttons it makes the page feel physical.
 *
 *   <a v-magnetic>        default 10px of travel
 *   <a v-magnetic="16">   stronger pull
 */

interface MagneticEl extends HTMLElement {
  _magCleanup?: () => void
}

export const vMagnetic: Directive<MagneticEl, number | undefined> = {
  mounted(el, binding) {
    if (isReducedMotion() || !window.matchMedia('(hover: hover)').matches) return

    const strength = binding.value ?? 10
    let frame = 0
    let tx = 0
    let ty = 0

    const apply = () => {
      frame = 0
      el.style.transform = `translate3d(${tx.toFixed(2)}px, ${ty.toFixed(2)}px, 0)`
    }

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      tx = ((e.clientX - (r.left + r.width / 2)) / (r.width / 2)) * strength
      ty = ((e.clientY - (r.top + r.height / 2)) / (r.height / 2)) * strength
      if (!frame) frame = requestAnimationFrame(apply)
    }

    const onEnter = () => {
      el.style.transition = 'transform 120ms var(--ease-soft)'
      el.addEventListener('pointermove', onMove, { passive: true })
    }

    const onLeave = () => {
      el.removeEventListener('pointermove', onMove)
      if (frame) cancelAnimationFrame(frame)
      frame = 0
      el.style.transition = 'transform 520ms var(--ease-spatial)'
      el.style.transform = 'translate3d(0,0,0)'
    }

    el.addEventListener('pointerenter', onEnter)
    el.addEventListener('pointerleave', onLeave)

    el._magCleanup = () => {
      el.removeEventListener('pointerenter', onEnter)
      el.removeEventListener('pointerleave', onLeave)
      onLeave()
    }
  },
  unmounted(el) {
    el._magCleanup?.()
  },
}
