import type { Directive } from 'vue'
import { isReducedMotion } from '@/composables/useMotionPreference'

/**
 * v-tilt — a restrained perspective shift toward the cursor.
 *
 * Capped at a few degrees. The point is a hint of physical presence, not the
 * exaggerated card-flip effect that makes a page feel like a toy. Disabled
 * entirely for reduced motion and on devices without a real pointer.
 *
 *   <article v-tilt>       default 4deg
 *   <article v-tilt="2.5"> subtler
 */

interface TiltEl extends HTMLElement {
  _tiltCleanup?: () => void
}

export const vTilt: Directive<TiltEl, number | undefined> = {
  mounted(el, binding) {
    if (isReducedMotion() || !window.matchMedia('(hover: hover)').matches) return

    const max = binding.value ?? 4
    let frame = 0
    let rx = 0
    let ry = 0

    const apply = () => {
      frame = 0
      el.style.transform = `perspective(1100px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg)`
    }

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      const nx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2)
      const ny = (e.clientY - (r.top + r.height / 2)) / (r.height / 2)
      ry = nx * max
      rx = -ny * max
      if (!frame) frame = requestAnimationFrame(apply)
    }

    const onEnter = () => {
      el.style.transition = 'transform 160ms var(--ease-soft)'
      el.addEventListener('pointermove', onMove, { passive: true })
    }

    const onLeave = () => {
      el.removeEventListener('pointermove', onMove)
      if (frame) cancelAnimationFrame(frame)
      frame = 0
      el.style.transition = 'transform 620ms var(--ease-spatial)'
      el.style.transform = 'perspective(1100px) rotateX(0deg) rotateY(0deg)'
    }

    el.addEventListener('pointerenter', onEnter)
    el.addEventListener('pointerleave', onLeave)

    el._tiltCleanup = () => {
      el.removeEventListener('pointerenter', onEnter)
      el.removeEventListener('pointerleave', onLeave)
      onLeave()
    }
  },
  unmounted(el) {
    el._tiltCleanup?.()
  },
}
