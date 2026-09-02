<script setup lang="ts">
/**
 * The aurora field — atmosphere, not content.
 *
 * Four very large, very soft blooms on a fixed layer behind everything. The
 * first bloom *is* the light: it sits exactly at --light-x/--light-y, so the
 * page's brightest point and the specular highlights on every glass panel
 * agree with each other. The others trail it at different depths, which is
 * what produces the sense of a volume rather than a flat gradient.
 *
 * No blur filters: filtering a viewport-sized element is expensive and radial
 * gradients are already perfectly soft. The whole layer costs nothing to
 * animate because only two custom properties change.
 */
</script>

<template>
  <div class="aurora" aria-hidden="true">
    <div class="aurora__bloom aurora__bloom--key" />
    <div class="aurora__bloom aurora__bloom--fill" />
    <div class="aurora__bloom aurora__bloom--rim" />
    <div class="aurora__bloom aurora__bloom--deep" />
    <div class="aurora__horizon" />
  </div>
</template>

<style scoped>
.aurora {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  overflow: hidden;
  contain: strict;
}

.aurora__bloom {
  position: absolute;
  border-radius: 50%;
  will-change: transform;
}

/* The key light. Sits exactly where the rig says the light is. */
.aurora__bloom--key {
  width: 92vmax;
  height: 92vmax;
  left: calc(var(--light-x) * 100%);
  top: calc(var(--light-y) * 100%);
  transform: translate(-50%, -50%);
  background: radial-gradient(
    circle,
    color-mix(in oklab, var(--color-violet) 30%, transparent) 0%,
    color-mix(in oklab, var(--color-violet) 12%, transparent) 34%,
    transparent 62%
  );
}

/* Fill: trails the key on the opposite side, cooler and wider. */
.aurora__bloom--fill {
  width: 76vmax;
  height: 76vmax;
  left: calc((1 - var(--light-x)) * 100%);
  top: calc(var(--light-y) * 100% + 18vmax);
  transform: translate(-50%, -50%);
  background: radial-gradient(
    circle,
    color-mix(in oklab, var(--color-azure) 26%, transparent) 0%,
    color-mix(in oklab, var(--color-azure) 9%, transparent) 36%,
    transparent 64%
  );
}

/* Rim: a cyan edge low and to the right, parallaxed by the pointer. */
.aurora__bloom--rim {
  width: 64vmax;
  height: 64vmax;
  right: -14vmax;
  bottom: -16vmax;
  transform: translate3d(calc(var(--px) * -22px), calc(var(--py) * -14px), 0);
  background: radial-gradient(
    circle,
    color-mix(in oklab, var(--color-cyan) 20%, transparent) 0%,
    color-mix(in oklab, var(--color-cyan) 7%, transparent) 38%,
    transparent 66%
  );
}

/* Deep: a slow violet mass bottom-left that stops the lower page going flat. */
.aurora__bloom--deep {
  width: 70vmax;
  height: 70vmax;
  left: -22vmax;
  bottom: -26vmax;
  transform: translate3d(calc(var(--px) * 14px), calc(var(--py) * 10px), 0);
  background: radial-gradient(
    circle,
    color-mix(in oklab, var(--color-violet) 20%, transparent) 0%,
    color-mix(in oklab, var(--color-violet) 6%, transparent) 40%,
    transparent 68%
  );
}

/* A thin brightening along the very top edge, like light spilling in. */
.aurora__horizon {
  position: absolute;
  inset: 0 0 auto 0;
  height: 44vh;
  background: linear-gradient(
    to bottom,
    color-mix(in oklab, var(--color-azure) 10%, transparent),
    transparent 78%
  );
}
</style>
