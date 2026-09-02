import { reactive, ref, computed } from 'vue'

/**
 * State and submission for the project enquiry.
 *
 * Validation is intentionally forgiving: the only hard requirements are a
 * name, a way to reply, and some description of the project. Someone
 * describing a problem they cannot yet name should not be blocked by a form.
 * The server validates the same fields properly — this is only here so the
 * visitor is told about a mistake before a round trip.
 */

export type NeedKind = 'website' | 'application' | 'system' | 'rebuild' | 'unsure'
export type ContactMethod = 'email' | 'phone' | 'either'
export type Status = 'idle' | 'sending' | 'sent' | 'error'

export const NEED_OPTIONS: { value: NeedKind; label: string }[] = [
  { value: 'website', label: 'a website' },
  { value: 'application', label: 'a web application' },
  { value: 'system', label: 'a custom system' },
  { value: 'rebuild', label: 'to fix or rebuild something' },
  { value: 'unsure', label: "help working out what I need" },
]

export const CONTACT_OPTIONS: { value: ContactMethod; label: string }[] = [
  { value: 'email', label: 'email' },
  { value: 'phone', label: 'phone or message' },
  { value: 'either', label: 'either is fine' },
]

export function useInquiryForm() {
  const form = reactive({
    name: '',
    business: '',
    need: 'website' as NeedKind,
    message: '',
    method: 'email' as ContactMethod,
    contact: '',
    /** Honeypot. Real people never see it, bots fill it in. */
    website: '',
  })

  const status = ref<Status>('idle')
  const error = ref('')
  const touched = ref(false)

  const problems = computed(() => {
    const list: string[] = []
    if (!form.name.trim()) list.push('your name')
    if (!form.contact.trim()) list.push('a way to reply to you')
    if (form.message.trim().length < 12) list.push('a sentence or two about the project')
    return list
  })

  const valid = computed(() => problems.value.length === 0)

  async function submit() {
    touched.value = true
    if (!valid.value || status.value === 'sending') return

    status.value = 'sending'
    error.value = ''

    try {
      const res = await fetch('/api/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as { message?: string } | null
        throw new Error(body?.message ?? `Request failed (${res.status})`)
      }

      status.value = 'sent'
    } catch (e) {
      status.value = 'error'
      error.value =
        e instanceof Error && e.message
          ? e.message
          : 'Something went wrong sending that. Email works too.'
    }
  }

  function reset() {
    status.value = 'idle'
    touched.value = false
    error.value = ''
    form.name = ''
    form.business = ''
    form.message = ''
    form.contact = ''
  }

  return { form, status, error, touched, problems, valid, submit, reset }
}
