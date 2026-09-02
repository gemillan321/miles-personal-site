<script setup lang="ts">
/**
 * The one heading pattern used by every section.
 *
 * A small uppercase kicker, then a display headline in which one or two words
 * are set in italic serif. That single typographic move is what stops the
 * headings reading as a template — see DESIGN.md §5.
 */

withDefaults(
  defineProps<{
    kicker?: string
    lead: string
    /** The word or two set in italic serif. */
    editorial?: string
    tail?: string
    lede?: string
    size?: 'l' | 'xl'
    id?: string
    /** Force the single-column form — for headings that already sit inside a
     *  narrow column and must not split again. */
    stacked?: boolean
  }>(),
  { size: 'l', stacked: false },
)
</script>

<template>
  <header class="heading" :class="{ 'heading--split': lede && !stacked }">
    <div class="heading__main">
      <p v-if="kicker" v-reveal class="label heading__kicker">
        <span class="heading__kicker-rule" />
        {{ kicker }}
      </p>

      <h2
        :id="id"
        v-reveal="60"
        :class="['heading__title', size === 'xl' ? 'display-xl' : 'display-l']"
      >
        <span>{{ lead }}</span>
        <span v-if="editorial" class="editorial">{{ ' ' + editorial }}</span>
        <span v-if="tail">{{ tail }}</span>
      </h2>
    </div>

    <div v-if="lede" class="heading__aside">
      <p v-reveal="140" class="lede heading__lede">{{ lede }}</p>
    </div>
  </header>
</template>

<style scoped>
/* Headline left, supporting sentence right and baseline-aligned to the bottom
   of it. A tall narrow headline with an empty half-page beside it looks
   unfinished; this reads as a spread. */
.heading--split {
  display: grid;
  gap: clamp(22px, 3vw, 40px);
}

@media (min-width: 900px) {
  .heading--split {
    grid-template-columns: minmax(0, 1.28fr) minmax(0, 0.72fr);
    gap: clamp(36px, 5vw, 80px);
    align-items: end;
  }
  .heading__aside {
    padding-bottom: 8px;
  }
}

.heading__title {
  max-width: 20ch;
}

.heading__kicker {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}

.heading__kicker-rule {
  width: 26px;
  height: 1px;
  background: color-mix(in oklab, var(--color-signal) 70%, transparent);
}

.heading__lede {
  max-width: 44ch;
}

.heading:not(.heading--split) .heading__lede {
  margin-top: 22px;
}
</style>
