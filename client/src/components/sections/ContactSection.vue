<script setup lang="ts">
import { computed } from 'vue'
import { CONTACT, SITE } from '@/content/site'
import RailSegment from '@/components/visual/RailSegment.vue'
import SectionHeading from '@/components/ui/SectionHeading.vue'
import {
  useInquiryForm,
  NEED_OPTIONS,
  CONTACT_OPTIONS,
} from '@/composables/useInquiryForm'

/**
 * Project enquiry.
 *
 * Written as a sentence the visitor completes rather than a stack of form
 * fields, because "Hi Miles — I'm ___ and I run ___" is an invitation and
 * "Name / Company / Subject" is a queue ticket. Every inline field still has a
 * real, if visually hidden, label, and below 720px the sentence unfolds into
 * ordinary stacked fields with visible labels — a phone is no place for
 * fill-in-the-blanks.
 */

const { form, status, error, touched, problems, valid, submit, reset } = useInquiryForm()

/** Inline inputs size themselves to their content so the sentence stays a
 *  sentence instead of a row of identical boxes. */
function widthFor(value: string, placeholder: string) {
  const len = Math.max(value.length, placeholder.length, 6) + 1
  return `${Math.min(len, 34)}ch`
}

const needLabel = computed(
  () => NEED_OPTIONS.find((o) => o.value === form.need)?.label ?? '',
)
const methodLabel = computed(
  () => CONTACT_OPTIONS.find((o) => o.value === form.method)?.label ?? '',
)
</script>

<template>
  <section id="contact" class="section" aria-labelledby="contact-title">
    <div class="shell">
      <RailSegment variant="converge" index="08" />

      <div class="section-body railed">
        <div class="contact__grid">
          <div class="contact__intro">
            <SectionHeading
              id="contact-title"
              :kicker="CONTACT.kicker"
              :lead="CONTACT.headlineLead"
              :editorial="CONTACT.headlineEditorial"
              :tail="CONTACT.headlineTail"
              :lede="CONTACT.lede"
              stacked
            />

            <ul class="contact__reassure">
              <li v-for="line in CONTACT.reassurance" :key="line">
                <span class="contact__tick" aria-hidden="true" />
                {{ line }}
              </li>
            </ul>

            <p class="contact__direct">
              Prefer email?
              <a :href="`mailto:${SITE.email}`">{{ SITE.email }}</a>
            </p>
          </div>

          <!-- ── The form ─────────────────────────────────────────────── -->
          <div v-reveal class="contact__panel glass glass--strong lit-edge sheen">
            <form v-if="status !== 'sent'" class="inquiry" novalidate @submit.prevent="submit">
              <p class="inquiry__sentence">
                <span>Hi {{ SITE.name }} — I'm</span>

                <label class="sr-only" for="f-name">Your name</label>
                <input
                  id="f-name"
                  v-model="form.name"
                  class="field field--inline"
                  :style="{ width: widthFor(form.name, 'your name') }"
                  type="text"
                  name="name"
                  autocomplete="name"
                  placeholder="your name"
                  required
                />

                <span>and I run</span>

                <label class="sr-only" for="f-business">Your business, or what you do</label>
                <span class="pair">
                  <input
                    id="f-business"
                    v-model="form.business"
                    class="field field--inline"
                    :style="{ width: widthFor(form.business, 'a small bakery') }"
                    type="text"
                    name="business"
                    autocomplete="organization"
                    placeholder="a small bakery"
                  />
                  <span class="period">.</span>
                </span>

                <span>I'm looking for</span>

                <label class="sr-only" for="f-need">What you need</label>
                <span class="select-wrap">
                  <select id="f-need" v-model="form.need" class="field field--select" name="need">
                    <option v-for="o in NEED_OPTIONS" :key="o.value" :value="o.value">
                      {{ o.label }}
                    </option>
                  </select>
                  <span class="select-face" aria-hidden="true">
                    {{ needLabel }}
                    <svg viewBox="0 0 10 6" focusable="false">
                      <path
                        d="M1 1l4 4 4-4"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="1.4"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  </span>
                </span>

                <span class="period">.</span>
              </p>

              <div class="inquiry__block">
                <label class="inquiry__label" for="f-message">Tell me about it</label>
                <textarea
                  id="f-message"
                  v-model="form.message"
                  class="field field--area"
                  name="message"
                  rows="5"
                  placeholder="What the business does, what is frustrating right now, and what you would like to be able to do instead. Plain words are perfect."
                  required
                />
              </div>

              <p class="inquiry__sentence inquiry__sentence--reply">
                <span>Reach me by</span>

                <label class="sr-only" for="f-method">Preferred way to be contacted</label>
                <span class="select-wrap">
                  <select
                    id="f-method"
                    v-model="form.method"
                    class="field field--select"
                    name="method"
                  >
                    <option v-for="o in CONTACT_OPTIONS" :key="o.value" :value="o.value">
                      {{ o.label }}
                    </option>
                  </select>
                  <span class="select-face" aria-hidden="true">
                    {{ methodLabel }}
                    <svg viewBox="0 0 10 6" focusable="false">
                      <path
                        d="M1 1l4 4 4-4"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="1.4"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  </span>
                </span>

                <span>at</span>

                <label class="sr-only" for="f-contact">Your email address or phone number</label>
                <!-- Input and full stop kept together so the sentence never
                     ends with a lonely period on its own line. -->
                <span class="pair">
                  <input
                    id="f-contact"
                    v-model="form.contact"
                    class="field field--inline"
                    :style="{ width: widthFor(form.contact, 'you@example.com') }"
                    type="text"
                    name="contact"
                    autocomplete="email"
                    placeholder="you@example.com"
                    required
                  />
                  <span class="period">.</span>
                </span>
              </p>

              <!-- Honeypot: off-screen, never announced, never focusable. -->
              <div class="hp" aria-hidden="true">
                <label for="f-website">Leave this empty</label>
                <input id="f-website" v-model="form.website" type="text" tabindex="-1" autocomplete="off" />
              </div>

              <p v-if="touched && !valid" class="inquiry__hint" role="status">
                Still need {{ problems.join(', ') }}.
              </p>
              <p v-if="status === 'error'" class="inquiry__hint inquiry__hint--error" role="alert">
                {{ error }} You can always email
                <a :href="`mailto:${SITE.email}`">{{ SITE.email }}</a> instead.
              </p>

              <button
                type="submit"
                class="inquiry__submit"
                :disabled="status === 'sending'"
                v-magnetic="6"
              >
                <span>{{ status === 'sending' ? 'Sending…' : 'Send it over' }}</span>
                <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
                  <path
                    d="M3 8h9M8.5 4l4 4-4 4"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.6"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </button>
            </form>

            <!-- Sent -->
            <div v-else class="sent" role="status">
              <span class="sent__mark" aria-hidden="true">
                <svg viewBox="0 0 24 24" focusable="false">
                  <path
                    d="M5 12.5l4.5 4.5L19 7.5"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </span>
              <h3 class="display-m">Got it — thank you.</h3>
              <p class="sent__body">
                I'll read it properly and get back to you within a day or two. If it turns out I'm
                not the right person for the job, I'll tell you that too.
              </p>
              <button type="button" class="sent__again" @click="reset">Send another</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.contact__grid {
  display: grid;
  gap: clamp(36px, 5vw, 64px);
  align-items: start;
}

@media (min-width: 980px) {
  .contact__grid {
    grid-template-columns: minmax(0, 0.82fr) minmax(0, 1.18fr);
  }
  .contact__intro {
    position: sticky;
    top: 128px;
  }
}

.contact__reassure {
  display: grid;
  gap: 11px;
  margin-top: 32px;
}

.contact__reassure li {
  display: grid;
  grid-template-columns: 16px 1fr;
  gap: 10px;
  align-items: start;
  font-size: 0.9375rem;
  color: var(--color-ink-muted);
}

.contact__tick {
  width: 6px;
  height: 6px;
  margin-top: 8px;
  border-radius: 999px;
  background: var(--color-signal);
  opacity: 0.75;
}

.contact__direct {
  margin-top: 28px;
  font-size: 0.875rem;
  color: var(--color-ink-faint);
}

.contact__direct a {
  color: var(--color-ink-muted);
  border-bottom: 1px solid rgb(255 255 255 / 0.2);
}

/* ── Panel ────────────────────────────────────────────────────────────────── */

.contact__panel {
  padding: clamp(24px, 3vw, 40px);
  border-radius: 24px;
}

.inquiry {
  position: relative;
  z-index: 3;
  display: grid;
  gap: 26px;
}

.inquiry__sentence {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 7px 8px;
  font-family: var(--font-display);
  font-size: clamp(1.1rem, 1.7vw, 1.35rem);
  line-height: 1.9;
  letter-spacing: -0.02em;
  color: var(--color-ink);
}

.pair {
  display: inline-flex;
  align-items: baseline;
}

/* ── Fields ───────────────────────────────────────────────────────────────── */

.field {
  background: transparent;
  border: 0;
  color: var(--color-ink);
  font-family: inherit;
}

.field::placeholder {
  color: var(--color-ink-faint);
}

.field--inline {
  border-bottom: 1.5px solid color-mix(in oklab, var(--color-signal) 45%, transparent);
  padding: 2px 4px;
  font-size: inherit;
  min-width: 6ch;
  transition:
    border-color 220ms var(--ease-soft),
    background-color 220ms var(--ease-soft);
}

.field--inline:hover {
  background: rgb(255 255 255 / 0.03);
}

.field--inline:focus {
  outline: none;
  border-color: var(--color-signal);
  background: color-mix(in oklab, var(--color-signal) 8%, transparent);
}

.field--inline:focus-visible {
  outline: 2px solid var(--color-signal);
  outline-offset: 3px;
}

/* Native select, kept for behaviour and accessibility, with a styled face
   drawn over it so it matches the sentence. */
.select-wrap {
  position: relative;
  display: inline-flex;
}

.field--select {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
}

.select-face {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 2px 4px;
  border-bottom: 1.5px solid color-mix(in oklab, var(--color-signal) 45%, transparent);
  color: var(--color-ink);
  pointer-events: none;
}

.select-face svg {
  width: 10px;
  height: 6px;
  color: var(--color-signal);
}

.select-wrap:hover .select-face {
  border-color: var(--color-signal);
}

.field--select:focus-visible + .select-face {
  outline: 2px solid var(--color-signal);
  outline-offset: 3px;
  border-radius: 4px;
}

.field--select option {
  background: #12141b;
  color: #f4f6fa;
}

.inquiry__block {
  display: grid;
  gap: 10px;
}

.inquiry__label {
  font-size: 0.6875rem;
  font-weight: 500;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--color-ink-faint);
}

.field--area {
  width: 100%;
  padding: 14px 16px;
  border-radius: 14px;
  border: 1px solid rgb(255 255 255 / 0.1);
  background: rgb(255 255 255 / 0.03);
  font-family: var(--font-sans);
  font-size: 0.9375rem;
  line-height: 1.6;
  resize: vertical;
  transition:
    border-color 220ms var(--ease-soft),
    background-color 220ms var(--ease-soft);
}

.field--area:focus {
  outline: none;
  border-color: color-mix(in oklab, var(--color-signal) 55%, transparent);
  background: rgb(255 255 255 / 0.05);
}

.field--area:focus-visible {
  outline: 2px solid var(--color-signal);
  outline-offset: 2px;
}

.hp {
  position: absolute;
  left: -9999px;
  width: 1px;
  height: 1px;
  overflow: hidden;
}

/* ── Feedback and submit ──────────────────────────────────────────────────── */

.inquiry__hint {
  font-size: 0.875rem;
  color: var(--color-ink-muted);
  padding: 10px 14px;
  border-radius: 10px;
  background: rgb(255 255 255 / 0.04);
  border: 1px solid rgb(255 255 255 / 0.08);
}

.inquiry__hint--error {
  color: #ffc9a8;
  border-color: color-mix(in oklab, var(--color-signal) 32%, transparent);
  background: color-mix(in oklab, var(--color-signal) 9%, transparent);
}

.inquiry__hint a {
  color: var(--color-signal);
  border-bottom: 1px solid currentColor;
}

.inquiry__submit {
  justify-self: start;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 14px 24px;
  border: 0;
  border-radius: 999px;
  background: var(--color-signal);
  color: #1a0e05;
  font-size: 0.9375rem;
  font-weight: 600;
  cursor: pointer;
  box-shadow:
    0 10px 30px -12px color-mix(in oklab, var(--color-signal) 70%, transparent),
    inset 0 1px 0 rgb(255 255 255 / 0.35);
  transition: background-color 220ms var(--ease-soft);
}

.inquiry__submit:hover:not(:disabled) {
  background: color-mix(in oklab, var(--color-signal) 88%, white);
}

.inquiry__submit:disabled {
  opacity: 0.6;
  cursor: progress;
}

.inquiry__submit svg {
  width: 15px;
  height: 15px;
}

/* ── Sent ─────────────────────────────────────────────────────────────────── */

.sent {
  position: relative;
  z-index: 3;
  display: grid;
  gap: 14px;
  justify-items: start;
  padding-block: 18px;
}

.sent__mark {
  display: grid;
  place-items: center;
  width: 46px;
  height: 46px;
  border-radius: 999px;
  color: var(--color-signal);
  border: 1px solid color-mix(in oklab, var(--color-signal) 45%, transparent);
  background: color-mix(in oklab, var(--color-signal) 12%, transparent);
  margin-bottom: 6px;
}

.sent__mark svg {
  width: 22px;
  height: 22px;
}

.sent__body {
  color: var(--color-ink-muted);
  max-width: 46ch;
}

.sent__again {
  margin-top: 8px;
  padding: 0;
  border: 0;
  background: none;
  color: var(--color-ink-faint);
  font-size: 0.875rem;
  cursor: pointer;
  border-bottom: 1px solid rgb(255 255 255 / 0.18);
}

/* ── Small screens: the sentence unfolds into ordinary labelled fields ────── */

@media (max-width: 719px) {
  .inquiry__sentence {
    display: grid;
    gap: 6px;
    font-size: 1rem;
    line-height: 1.5;
    color: var(--color-ink-muted);
  }
  .field--inline {
    width: 100% !important;
    padding: 12px 14px;
    border: 1px solid rgb(255 255 255 / 0.1);
    border-radius: 12px;
    background: rgb(255 255 255 / 0.03);
    font-size: 1rem;
    color: var(--color-ink);
  }
  .select-wrap,
  .pair {
    display: block;
  }
  /* Punctuation belongs to the sentence, not to a stack of labelled fields. */
  .period {
    display: none;
  }
  .select-face {
    justify-content: space-between;
    width: 100%;
    padding: 12px 14px;
    border: 1px solid rgb(255 255 255 / 0.1);
    border-radius: 12px;
    background: rgb(255 255 255 / 0.03);
    font-size: 1rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .field,
  .inquiry__submit {
    transition: none;
  }
}
</style>
