import { z } from 'zod'

/**
 * The enquiry payload.
 *
 * Kept deliberately loose on shape and strict on size. Someone describing a
 * problem they cannot name yet should not be turned away by a validator, but
 * nothing unbounded is ever accepted.
 */

export const inquirySchema = z.object({
  name: z.string().trim().min(1, 'A name is needed.').max(120),
  business: z.string().trim().max(160).optional().default(''),
  need: z.enum(['website', 'application', 'system', 'rebuild', 'unsure']),
  message: z
    .string()
    .trim()
    .min(12, 'A sentence or two about the project, please.')
    .max(5000),
  method: z.enum(['email', 'phone', 'either']),
  contact: z.string().trim().min(3, 'A way to reply is needed.').max(160),
  /** Honeypot: must be empty. Bots fill every field they find. */
  website: z.string().max(0).optional().default(''),
})

export type Inquiry = z.infer<typeof inquirySchema>
