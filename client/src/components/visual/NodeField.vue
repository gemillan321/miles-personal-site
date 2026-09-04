<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from 'vue'
import { shouldUseStaticEffects } from '@/composables/useMotionPreference'
import { isCalm } from '@/composables/useCalmMode'
import { lightPos } from '@/composables/useLightRig'

/**
 * The node field — atmosphere, and the site's one hand-rolled 3D object.
 *
 * A cluster of nodes in 3D space, slowly orbiting, a handful of them faceted
 * low-poly crystals that catch a fixed light as they turn. Steered by the
 * same rig every other lit surface reads (`lightPos`, written by
 * useLightRig's loop) rather than tracking the pointer itself, so the whole
 * page still turns together — the rig just has a second consumer now.
 *
 * This is the one deliberate exception to "one rAF loop for the whole site"
 * (see DESIGN.md §2): canvas pixels cannot be driven by a CSS custom
 * property, so redrawing rotating geometry needs its own loop. It follows
 * the rig's own rules anyway — reduced motion gets one static frame, calm
 * mode stops it, a hidden tab pauses it.
 *
 * On mount the field assembles: nodes fly in from off-position and fade up
 * over ~1.3s before settling into the same orbit math used forever after.
 * That's the site's entrance — no separate intro overlay, no second system
 * to keep in sync.
 */

const canvasRef = ref<HTMLCanvasElement | null>(null)

let ctx: CanvasRenderingContext2D | null = null
let W = 0
let H = 0
let DPR = 1
let frame = 0
let resizeFrame = 0
let bootStart = 0
let reduced = false

const BOOT_MS = 1300

type Node = {
  x: number
  y: number
  z: number
  crystal: boolean
  scale: number
  spin: number
  spinAxis: number
  spinTilt: number
  bootDX: number
  bootDY: number
}

let nodes: Node[] = []
let edges: { a: number; b: number }[] = []
let ry = 0
let rx = -0.25
let vy = 0.00014
let vx = 0

/** How much of the hero viewport is left to scroll through before the
 *  geometry is fully gone. 1 at the top, 0 by the time the hero has
 *  scrolled past — the field is a hero moment, not a page-long overlay
 *  sitting on top of body text. The soft background wash is unaffected and
 *  stays everywhere, same as the aurora it replaced. */
let scrollFade = 1

function updateScrollFade() {
  const vh = window.innerHeight || 1
  const t = Math.min(1, Math.max(0, window.scrollY / (vh * 0.85)))
  scrollFade = 1 - t
}

/** The hero's layered Interface/Logic/Data stack — the field reads its own
 *  on-screen box each frame and carves a soft elliptical hole around it, so
 *  the network frames the stack instead of drawing through it. Same loose
 *  DOM-query coupling SiteHeader already uses for its section observer. */
let heroVisualEl: Element | null = null

type ExclusionRect = { ccx: number; ccy: number; hw: number; hh: number } | null

function getExclusionRect(): ExclusionRect {
  // Queried lazily: NodeField mounts before HeroSection does (it's declared
  // first in App.vue), so the element doesn't exist yet on NodeField's own
  // mount — try again each frame until it does.
  if (!heroVisualEl) heroVisualEl = document.querySelector('.hero-visual')
  if (!heroVisualEl) return null
  const r = heroVisualEl.getBoundingClientRect()
  if (r.width < 1 || r.height < 1 || r.bottom < 0) return null
  return {
    ccx: r.left + r.width / 2,
    ccy: r.top + r.height / 2,
    hw: (r.width / 2) * 1.08,
    hh: (r.height / 2) * 1.22,
  }
}

function exclusionAt(x: number, y: number, rect: ExclusionRect): number {
  if (!rect) return 1
  const nd = Math.sqrt(((x - rect.ccx) / rect.hw) ** 2 + ((y - rect.ccy) / rect.hh) ** 2)
  return Math.min(1, Math.max(0, (nd - 0.72) / 0.5))
}

let VIOLET = '#8b5cf6'
let AZURE = '#3b82f6'
let CYAN = '#22d3ee'
let SIGNAL = '#ffa45c'
let GROUND = '#0a0b0f'

function readTokens() {
  const cs = getComputedStyle(document.documentElement)
  const get = (name: string, fallback: string) => cs.getPropertyValue(name).trim() || fallback
  VIOLET = get('--color-violet', VIOLET)
  AZURE = get('--color-azure', AZURE)
  CYAN = get('--color-cyan', CYAN)
  SIGNAL = get('--color-signal', SIGNAL)
  GROUND = get('--color-ground', GROUND)
}

function colorMix(hexA: string, hexB: string, t: number) {
  const h2r = (h: string) => {
    h = h.replace('#', '')
    return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)]
  }
  const a = h2r(hexA)
  const b = h2r(hexB)
  const r = Math.round(a[0] + (b[0] - a[0]) * t)
  const g = Math.round(a[1] + (b[1] - a[1]) * t)
  const bl = Math.round(a[2] + (b[2] - a[2]) * t)
  return `rgb(${r},${g},${bl})`
}

type Vec3 = { x: number; y: number; z: number }

function rotY(p: Vec3, a: number): Vec3 {
  const c = Math.cos(a)
  const s = Math.sin(a)
  return { x: p.x * c + p.z * s, y: p.y, z: -p.x * s + p.z * c }
}
function rotX(p: Vec3, a: number): Vec3 {
  const c = Math.cos(a)
  const s = Math.sin(a)
  return { x: p.x, y: p.y * c - p.z * s, z: p.y * s + p.z * c }
}
function rotZ(p: Vec3, a: number): Vec3 {
  const c = Math.cos(a)
  const s = Math.sin(a)
  return { x: p.x * c - p.y * s, y: p.x * s + p.y * c, z: p.z }
}
function add3(a: Vec3, b: Vec3): Vec3 {
  return { x: a.x + b.x, y: a.y + b.y, z: a.z + b.z }
}
function toView(p: Vec3): Vec3 {
  return rotX(rotY(p, ry), rx)
}

const OCTA_V: Vec3[] = [
  { x: 1, y: 0, z: 0 },
  { x: -1, y: 0, z: 0 },
  { x: 0, y: 1, z: 0 },
  { x: 0, y: -1, z: 0 },
  { x: 0, y: 0, z: 1 },
  { x: 0, y: 0, z: -1 },
]
const OCTA_F = [
  [0, 2, 4],
  [0, 2, 5],
  [0, 3, 4],
  [0, 3, 5],
  [1, 2, 4],
  [1, 2, 5],
  [1, 3, 4],
  [1, 3, 5],
]

function easeOutCubic(t: number) {
  const u = 1 - t
  return 1 - u * u * u
}

function resize(force = false) {
  const canvas = canvasRef.value
  if (!canvas || !ctx) return false

  const nextW = window.innerWidth
  const nextH = window.innerHeight
  const nextDpr = Math.min(window.devicePixelRatio || 1, reduced ? 1.25 : 2)
  const widthChanged = Math.abs(nextW - W) > 1
  const dprChanged = Math.abs(nextDpr - DPR) > 0.01
  const significantHeightChange = Math.abs(nextH - H) > Math.max(160, H * 0.2)

  // Opening and closing mobile browser chrome changes only the viewport
  // height. Reallocating a high-DPI canvas for each of those tiny changes is
  // costly and unnecessary; orientation and real layout changes still pass.
  if (!force && !widthChanged && !dprChanged && !significantHeightChange) return false

  DPR = nextDpr
  W = nextW
  H = nextH
  canvas.width = W * DPR
  canvas.height = H * DPR
  canvas.style.width = `${W}px`
  canvas.style.height = `${H}px`
  ctx.setTransform(DPR, 0, 0, DPR, 0, 0)
  return true
}

function buildField() {
  nodes = []
  ry = Math.random() * Math.PI * 2
  rx = -0.25
  const area = W * H
  const n = Math.max(24, Math.min(60, Math.round(area / 32000) + 20))

  for (let i = 0; i < n; i++) {
    let p: Vec3
    do {
      p = { x: Math.random() * 2 - 1, y: Math.random() * 2 - 1, z: Math.random() * 2 - 1 }
    } while (p.x * p.x + p.y * p.y + p.z * p.z > 1)
    const crystal = i % 7 === 0
    const angle = Math.random() * Math.PI * 2
    const dist = 220 + Math.random() * 260
    nodes.push({
      x: p.x,
      y: p.y,
      z: p.z,
      crystal,
      scale: crystal ? 0.09 + Math.random() * 0.05 : 0,
      spin: Math.random() * Math.PI * 2,
      spinAxis: 0.6 + Math.random() * 0.9,
      spinTilt: Math.random() * Math.PI * 2,
      bootDX: Math.cos(angle) * dist,
      bootDY: Math.sin(angle) * dist,
    })
  }

  edges = []
  const seen = new Set<string>()
  for (let a = 0; a < nodes.length; a++) {
    const dists: { b: number; d: number }[] = []
    for (let b = 0; b < nodes.length; b++) {
      if (a === b) continue
      const pa = nodes[a]
      const pb = nodes[b]
      const dx = pa.x - pb.x
      const dy = pa.y - pb.y
      const dz = pa.z - pb.z
      dists.push({ b, d: dx * dx + dy * dy + dz * dz })
    }
    dists.sort((u, v) => u.d - v.d)
    const k = Math.min(2, dists.length)
    for (let m = 0; m < k; m++) {
      if (dists[m].d > 0.42) continue
      const lo = Math.min(a, dists[m].b)
      const hi = Math.max(a, dists[m].b)
      const key = `${lo}-${hi}`
      if (seen.has(key)) continue
      seen.add(key)
      edges.push({ a: lo, b: hi })
    }
  }
}

type Drawable =
  | { type: 'edge'; z: number; ax: number; ay: number; bx: number; by: number; aAlpha: number; bAlpha: number }
  | { type: 'point'; z: number; sx: number; sy: number; r: number; lit: boolean; alpha: number }
  | { type: 'face'; z: number; x0: number; y0: number; x1: number; y1: number; x2: number; y2: number; b: number; alpha: number }

function draw(now: number) {
  if (!ctx) return

  const bootT = reduced ? 1 : Math.min(1, (now - bootStart) / BOOT_MS)
  const eased = easeOutCubic(bootT)
  const spread = 1 - eased
  const sceneAlpha = eased * scrollFade

  if (!reduced) {
    const lx = lightPos.x
    const ly = lightPos.y
    const targetVy = 0.00014 + (lx - 0.34) * 0.0011
    const targetVx = (ly - 0.22) * 0.0009
    vy += (targetVy - vy) * 0.02
    vx += (targetVx - vx) * 0.02
    ry += vy * 16
    rx = Math.max(-0.6, Math.min(0.15, rx + vx * 16))
  }

  ctx.clearRect(0, 0, W, H)
  ctx.fillStyle = GROUND
  ctx.fillRect(0, 0, W, H)

  const lx = lightPos.x
  const ly = lightPos.y
  const bgx = (0.3 + (lx - 0.5) * 0.2) * W
  const bgy = (0.35 + (ly - 0.5) * 0.15) * H
  const bg = ctx.createRadialGradient(bgx, bgy, 0, bgx, bgy, Math.max(W, H) * 0.6)
  bg.addColorStop(0, 'rgba(139,92,246,0.14)')
  bg.addColorStop(0.55, 'rgba(34,211,238,0.05)')
  bg.addColorStop(1, 'transparent')
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, W, H)

  // Past the hero the geometry is fully faded — skip the (fairly expensive)
  // rotate/project/sort work entirely rather than compute it for nothing.
  if (sceneAlpha < 0.01) return

  const cx = W * 0.62
  const cy = H * 0.46
  const radius = Math.min(W, H) * 0.32
  const camZ = 2.5
  const focal = 2.0

  const dustN = 34
  for (let d = 0; d < dustN; d++) {
    const ang = d * 2.399963
    const rr = (d % dustN) / dustN
    const dx = cx + Math.cos(ang) * rr * W * 0.6 + (lx - 0.5) * -14
    const dy = cy + Math.sin(ang) * rr * H * 0.55 + (ly - 0.5) * -10
    ctx.globalAlpha = (0.08 + 0.06 * Math.sin(now * 0.0003 + d)) * sceneAlpha
    ctx.fillStyle = '#aab2c2'
    ctx.beginPath()
    ctx.arc(dx, dy, 0.8, 0, Math.PI * 2)
    ctx.fill()
  }
  ctx.globalAlpha = 1

  const view = nodes.map((n) => toView(n))

  function proj(p: Vec3) {
    const factor = focal / (camZ - p.z * 0.9)
    return { sx: cx + p.x * factor * radius, sy: cy + p.y * factor * radius, scale: factor }
  }

  const lightDir = { x: (lx - 0.5) * 1.4, y: -(ly - 0.5) * 1.4, z: 1 }
  const ll = Math.sqrt(lightDir.x * lightDir.x + lightDir.y * lightDir.y + lightDir.z * lightDir.z) || 1
  lightDir.x /= ll
  lightDir.y /= ll
  lightDir.z /= ll

  // Each node's screen position and how much the hero stack's exclusion
  // zone dims it, computed once and shared by the edge and point/crystal
  // passes below rather than reprojected twice.
  const exclRect = getExclusionRect()
  const nodeScreen = nodes.map((n, i) => {
    const vp = view[i]
    const pp = proj(vp)
    const bx = pp.sx + n.bootDX * spread
    const by = pp.sy + n.bootDY * spread
    return { bx, by, scale: pp.scale, alpha: sceneAlpha * exclusionAt(bx, by, exclRect) }
  })

  const draws: Drawable[] = []

  for (const e of edges) {
    const va = view[e.a]
    const vb = view[e.b]
    const sa = nodeScreen[e.a]
    const sb = nodeScreen[e.b]
    draws.push({
      type: 'edge',
      z: (va.z + vb.z) / 2,
      ax: sa.bx,
      ay: sa.by,
      bx: sb.bx,
      by: sb.by,
      aAlpha: sa.alpha,
      bAlpha: sb.alpha,
    })
  }

  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i]
    const vp = view[i]
    const { bx, by, scale, alpha: nodeAlpha } = nodeScreen[i]

    if (!node.crystal) {
      const depth01 = (vp.z + 1) / 2
      const dxp = node.x - (lx - 0.5) * 1.6
      const dyp = node.y - (ly - 0.5) * 1.6
      const litp = Math.max(0, 1 - Math.sqrt(dxp * dxp + dyp * dyp) * 1.6) * depth01
      draws.push({
        type: 'point',
        z: vp.z,
        sx: bx,
        sy: by,
        r: (1.1 + depth01 * 2.2) * scale,
        lit: litp > 0.45,
        alpha: (0.35 + depth01 * 0.55) * nodeAlpha,
      })
      continue
    }

    const spin = node.spin + now * 0.00025 * node.spinAxis
    const verts = OCTA_V.map((v) => {
      let s: Vec3 = { x: v.x * node.scale, y: v.y * node.scale, z: v.z * node.scale }
      s = rotZ(s, node.spinTilt)
      s = rotY(s, spin)
      return toView(add3(node, s))
    })
    for (const f of OCTA_F) {
      const v0 = verts[f[0]]
      const v1 = verts[f[1]]
      const v2 = verts[f[2]]
      const ux = v1.x - v0.x
      const uy = v1.y - v0.y
      const uz = v1.z - v0.z
      const wx = v2.x - v0.x
      const wy = v2.y - v0.y
      const wz = v2.z - v0.z
      let nx = uy * wz - uz * wy
      let ny = uz * wx - ux * wz
      let nz = ux * wy - uy * wx
      const nl = Math.sqrt(nx * nx + ny * ny + nz * nz) || 1
      nx /= nl
      ny /= nl
      nz /= nl
      const brightness = Math.max(0, nx * lightDir.x + ny * lightDir.y + nz * lightDir.z)
      const zc = (v0.z + v1.z + v2.z) / 3
      const p0 = proj(v0)
      const p1 = proj(v1)
      const p2 = proj(v2)
      draws.push({
        type: 'face',
        z: vp.z + zc * 0.02,
        x0: p0.sx + node.bootDX * spread,
        y0: p0.sy + node.bootDY * spread,
        x1: p1.sx + node.bootDX * spread,
        y1: p1.sy + node.bootDY * spread,
        x2: p2.sx + node.bootDX * spread,
        y2: p2.sy + node.bootDY * spread,
        b: brightness,
        alpha: nodeAlpha,
      })
    }
  }

  draws.sort((u, v) => u.z - v.z)

  for (const item of draws) {
    if (item.type === 'edge') {
      const depth01 = 0.5
      ctx.strokeStyle = colorMix(VIOLET, CYAN, depth01)
      ctx.globalAlpha = (0.18 + depth01 * 0.4) * item.aAlpha
      ctx.lineWidth = 0.6 + depth01 * 0.9
      ctx.beginPath()
      ctx.moveTo(item.ax, item.ay)
      ctx.lineTo(item.bx, item.by)
      ctx.stroke()
    } else if (item.type === 'point') {
      ctx.fillStyle = item.lit ? SIGNAL : colorMix(VIOLET, CYAN, 0.5)
      ctx.globalAlpha = item.alpha
      ctx.beginPath()
      ctx.arc(item.sx, item.sy, item.r, 0, Math.PI * 2)
      ctx.fill()
    } else {
      const tone = colorMix(VIOLET, CYAN, 0.3 + item.b * 0.4)
      ctx.fillStyle = item.b > 0.82 ? SIGNAL : tone
      ctx.globalAlpha = (0.5 + item.b * 0.5) * item.alpha
      ctx.beginPath()
      ctx.moveTo(item.x0, item.y0)
      ctx.lineTo(item.x1, item.y1)
      ctx.lineTo(item.x2, item.y2)
      ctx.closePath()
      ctx.fill()
      ctx.strokeStyle = 'rgba(244,246,250,0.18)'
      ctx.lineWidth = 0.5
      ctx.globalAlpha = item.alpha
      ctx.stroke()
    }
  }
  ctx.globalAlpha = 1
}

let paused = false

function onVisibility() {
  paused = document.hidden
  if (!paused && !frame && !reduced && scrollFade >= 0.01) frame = requestAnimationFrame(tick)
}

function tick(now: number) {
  if (paused) {
    frame = 0
    return
  }
  if (isCalm()) {
    frame = 0
    window.setTimeout(() => {
      if (!frame && !paused) frame = requestAnimationFrame(tick)
    }, 400)
    return
  }
  draw(now)
  if (scrollFade < 0.01 && now - bootStart >= BOOT_MS) {
    frame = 0
    return
  }
  frame = requestAnimationFrame(tick)
}

function onResize() {
  if (resizeFrame) return
  resizeFrame = requestAnimationFrame(() => {
    resizeFrame = 0
    if (resize() && (reduced || !frame)) draw(performance.now())
  })
}

function onScroll() {
  updateScrollFade()
  // The rAF loop already re-reads scrollFade every frame; reduced-motion
  // mode has no loop, so it needs an explicit redraw here instead.
  if (reduced) {
    draw(performance.now())
  } else if (!frame && !paused && !isCalm() && scrollFade >= 0.01) {
    frame = requestAnimationFrame(tick)
  }
}

onMounted(() => {
  const canvas = canvasRef.value
  if (!canvas) return
  ctx = canvas.getContext('2d')
  if (!ctx) return

  readTokens()
  reduced = shouldUseStaticEffects()
  resize(true)
  buildField()
  updateScrollFade()

  bootStart = reduced ? -BOOT_MS : performance.now()

  window.addEventListener('resize', onResize)
  window.addEventListener('scroll', onScroll, { passive: true })
  document.addEventListener('visibilitychange', onVisibility)

  if (reduced) {
    draw(performance.now())
  } else {
    frame = requestAnimationFrame(tick)
  }
})

onBeforeUnmount(() => {
  if (frame) cancelAnimationFrame(frame)
  if (resizeFrame) cancelAnimationFrame(resizeFrame)
  frame = 0
  resizeFrame = 0
  window.removeEventListener('resize', onResize)
  window.removeEventListener('scroll', onScroll)
  document.removeEventListener('visibilitychange', onVisibility)
})
</script>

<template>
  <canvas ref="canvasRef" class="node-field" aria-hidden="true" />
</template>

<style scoped>
.node-field {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  display: block;
}
</style>
