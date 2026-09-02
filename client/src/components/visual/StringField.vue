<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue'
import { isReducedMotion } from '@/composables/useMotionPreference'
import { isCalm } from '@/composables/useCalmMode'

/**
 * Six strings — where the through-line ends up.
 *
 * The warm line that has run the length of the site resolves here into six
 * horizontal lines, and they turn out to be strings: hover one and it shivers,
 * click or press it and it is plucked properly, with sound. Standard tuning,
 * E-A-D-G-B-E.
 *
 * This is the personal detail the site is allowed to have. It is at the very
 * bottom, it is silent until someone deliberately clicks, and it costs nothing
 * to anyone who never finds it — which is roughly the correct amount of
 * whimsy for a site whose other job is convincing someone to spend money.
 *
 * The motion is a real damped oscillation rather than a canned CSS keyframe:
 * each string bends as a quadratic curve whose control point follows
 * A·sin(ωt)·e^(−t/τ). It is a nicer wobble, and it is about fifteen lines.
 */

interface StringDef {
  note: string
  freq: number
  width: number
}

const STRINGS: StringDef[] = [
  { note: 'E4', freq: 329.63, width: 0.9 },
  { note: 'B3', freq: 246.94, width: 1.05 },
  { note: 'G3', freq: 196.0, width: 1.2 },
  { note: 'D3', freq: 146.83, width: 1.4 },
  { note: 'A2', freq: 110.0, width: 1.65 },
  { note: 'E2', freq: 82.41, width: 1.95 },
]

const W = 1000
const GAP = 22
const TOP = 18
const H = TOP * 2 + GAP * (STRINGS.length - 1)

const paths = ref(STRINGS.map((_, i) => flat(i)))
const plucked = ref<number | null>(null)

let audio: AudioContext | null = null
let frame = 0
const active = new Map<number, { start: number; amp: number }>()

function flat(i: number) {
  const y = TOP + i * GAP
  return `M0 ${y} Q ${W / 2} ${y} ${W} ${y}`
}

function bend(i: number, offset: number) {
  const y = TOP + i * GAP
  return `M0 ${y} Q ${W / 2} ${y + offset} ${W} ${y}`
}

/** One frame of every currently ringing string. */
function tick(now: number) {
  let stillGoing = false

  for (const [i, state] of active) {
    const t = (now - state.start) / 1000
    // Frequency scaled down to something the eye can read, damped over ~1.1s.
    const offset = state.amp * Math.sin(t * 34) * Math.exp(-t / 0.28)

    if (Math.abs(offset) < 0.12) {
      active.delete(i)
      paths.value[i] = flat(i)
      continue
    }

    paths.value[i] = bend(i, offset)
    stillGoing = true
  }

  frame = stillGoing ? requestAnimationFrame(tick) : 0
}

function animate(i: number, amp: number) {
  if (isReducedMotion() || isCalm()) return
  active.set(i, { start: performance.now(), amp })
  if (!frame) frame = requestAnimationFrame(tick)
}

/** A short plucked tone: fundamental plus one harmonic, fast decay. */
function play(freq: number) {
  try {
    audio ??= new (window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
    if (audio.state === 'suspended') void audio.resume()

    const now = audio.currentTime
    const master = audio.createGain()
    master.gain.setValueAtTime(0.0001, now)
    master.gain.exponentialRampToValueAtTime(0.16, now + 0.012)
    master.gain.exponentialRampToValueAtTime(0.0001, now + 1.6)
    master.connect(audio.destination)

    for (const [mult, level, type] of [
      [1, 1, 'triangle'],
      [2, 0.32, 'sine'],
      [3, 0.12, 'sine'],
    ] as const) {
      const osc = audio.createOscillator()
      const gain = audio.createGain()
      osc.type = type
      osc.frequency.setValueAtTime(freq * mult, now)
      gain.gain.setValueAtTime(level, now)
      osc.connect(gain).connect(master)
      osc.start(now)
      osc.stop(now + 1.7)
    }
  } catch {
    /* No audio available — the string still moves, which is most of the joy. */
  }
}

function pluck(i: number) {
  plucked.value = i
  animate(i, 9)
  play(STRINGS[i].freq)
}

function brush(i: number) {
  animate(i, 3.2)
}

onBeforeUnmount(() => {
  if (frame) cancelAnimationFrame(frame)
  void audio?.close()
})
</script>

<template>
  <div class="strings">
    <svg
      class="strings__svg"
      :viewBox="`0 0 ${W} ${H}`"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        v-for="(d, i) in paths"
        :key="i"
        :d="d"
        class="strings__string"
        :class="{ 'is-plucked': plucked === i }"
        :style="{ strokeWidth: STRINGS[i].width, '--i': i }"
        vector-effect="non-scaling-stroke"
        fill="none"
      />
    </svg>

    <!-- Real buttons over the strings so this works by keyboard and on touch,
         and so it is announced as something you can do rather than decoration. -->
    <div class="strings__keys">
      <button
        v-for="(s, i) in STRINGS"
        :key="s.note"
        type="button"
        class="strings__key"
        @click="pluck(i)"
        @pointerenter="brush(i)"
        @focus="brush(i)"
      >
        <span class="sr-only">Pluck the {{ s.note }} string</span>
      </button>
    </div>

    <p class="strings__hint" aria-hidden="true">go on, then</p>
  </div>
</template>

<style scoped>
.strings {
  position: relative;
  width: 100%;
  height: 122px;
}

.strings__svg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.strings__string {
  stroke: color-mix(in oklab, var(--color-signal) 42%, transparent);
  stroke-linecap: round;
  transition: stroke 500ms var(--ease-soft);
}

.strings__string.is-plucked {
  stroke: var(--color-signal);
  filter: drop-shadow(0 0 6px color-mix(in oklab, var(--color-signal) 55%, transparent));
}

.strings__keys {
  position: absolute;
  inset: 0;
  display: grid;
  grid-template-rows: repeat(6, 1fr);
}

.strings__key {
  width: 100%;
  height: 100%;
  border: 0;
  background: transparent;
  cursor: pointer;
  padding: 0;
}

.strings__key:focus-visible {
  outline: 2px solid var(--color-signal);
  outline-offset: -4px;
  border-radius: 4px;
}

.strings__hint {
  position: absolute;
  right: 2px;
  bottom: -6px;
  font-family: var(--font-editorial);
  font-style: italic;
  font-size: 0.9375rem;
  color: var(--color-ink-faint);
  opacity: 0;
  transform: translateY(4px);
  transition:
    opacity 400ms var(--ease-soft),
    transform 400ms var(--ease-spatial);
  pointer-events: none;
}

.strings:hover .strings__hint,
.strings:focus-within .strings__hint {
  opacity: 1;
  transform: none;
}

@media (prefers-reduced-motion: reduce) {
  .strings__hint {
    transition: none;
  }
}
</style>
