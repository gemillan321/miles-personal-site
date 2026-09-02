import { onMounted, onBeforeUnmount } from 'vue'
import { isReducedMotion } from './useMotionPreference'
import { isCalm } from './useCalmMode'

/**
 * The Rig — the site's single light source.
 *
 * Signature idea #1 (see DESIGN.md §2). Instead of scattering decorative
 * gradients, the whole page is lit by one simulated lamp whose position lives
 * in two CSS custom properties on <html>:
 *
 *     --light-x, --light-y   0..1, viewport-relative
 *
 * Aurora blooms, glass sheens, lit borders and neumorphic shadows all derive
 * from those two numbers, so when the light moves every surface on screen
 * turns together — the way a real object does under a real lamp.
 *
 * Cost: one rAF loop for the entire site, two custom property writes per
 * frame, zero per-element JavaScript.
 *
 * The light also drifts on its own so the page is quietly alive without a
 * cursor (and on touch devices, where there is never one).
 */

/** How far the pointer is allowed to pull the light, as a fraction of viewport. */
const POINTER_PULL = 0.34
/** Damping — the light follows the cursor lazily, never 1:1. */
const LERP = 0.045
/** Drift path period in milliseconds. Deliberately slow and prime-ish so the
 *  two axes do not visibly resynchronise. */
const DRIFT_X_MS = 47_000
const DRIFT_Y_MS = 61_000

let refCount = 0
let frame = 0
let detach: (() => void) | null = null

export function useLightRig() {
  onMounted(() => {
    refCount += 1
    if (refCount === 1) start()
  })

  onBeforeUnmount(() => {
    refCount -= 1
    if (refCount === 0) stop()
  })
}

function start() {
  const root = document.documentElement

  // Reduced motion: place the light once, at rest, and never animate it.
  if (isReducedMotion()) {
    root.style.setProperty('--light-x', '0.5')
    root.style.setProperty('--light-y', '0.18')
    return
  }

  // Where the light is now, and where it wants to be.
  let x = 0.34
  let y = 0.22
  let targetOffsetX = 0
  let targetOffsetY = 0

  // Damped pointer, exposed separately as --px/--py for parallax layers.
  let px = 0
  let py = 0
  let pxTarget = 0
  let pyTarget = 0

  const onPointerMove = (e: PointerEvent) => {
    const nx = e.clientX / window.innerWidth
    const ny = e.clientY / window.innerHeight
    targetOffsetX = (nx - 0.5) * POINTER_PULL
    targetOffsetY = (ny - 0.5) * POINTER_PULL
    pxTarget = nx * 2 - 1
    pyTarget = ny * 2 - 1
  }

  const onPointerLeave = () => {
    targetOffsetX = 0
    targetOffsetY = 0
    pxTarget = 0
    pyTarget = 0
  }

  const t0 = performance.now()
  let paused = false

  const onVisibility = () => {
    paused = document.hidden
    if (!paused && !frame) frame = requestAnimationFrame(tick)
  }

  function tick(now: number) {
    if (paused) {
      frame = 0
      return
    }

    // Calm mode: stop writing entirely and drop to a slow poll, so switching
    // back on is instant without burning frames in the meantime.
    if (isCalm()) {
      frame = 0
      window.setTimeout(() => {
        if (!frame && !paused) frame = requestAnimationFrame(tick)
      }, 400)
      return
    }

    const t = now - t0

    // Slow independent drift on each axis — a Lissajous path, not a circle,
    // so the movement never reads as a loop.
    const driftX = 0.34 + Math.sin((t / DRIFT_X_MS) * Math.PI * 2) * 0.16
    const driftY = 0.22 + Math.cos((t / DRIFT_Y_MS) * Math.PI * 2) * 0.12

    x += (driftX + targetOffsetX - x) * LERP
    y += (driftY + targetOffsetY - y) * LERP
    px += (pxTarget - px) * 0.06
    py += (pyTarget - py) * 0.06

    root.style.setProperty('--light-x', x.toFixed(4))
    root.style.setProperty('--light-y', y.toFixed(4))
    root.style.setProperty('--px', px.toFixed(4))
    root.style.setProperty('--py', py.toFixed(4))

    frame = requestAnimationFrame(tick)
  }

  window.addEventListener('pointermove', onPointerMove, { passive: true })
  document.addEventListener('pointerleave', onPointerLeave)
  document.addEventListener('visibilitychange', onVisibility)
  frame = requestAnimationFrame(tick)

  detach = () => {
    window.removeEventListener('pointermove', onPointerMove)
    document.removeEventListener('pointerleave', onPointerLeave)
    document.removeEventListener('visibilitychange', onVisibility)
  }
}

function stop() {
  if (frame) cancelAnimationFrame(frame)
  frame = 0
  detach?.()
  detach = null
}
