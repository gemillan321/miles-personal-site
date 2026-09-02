import { Router } from 'express'
import { config } from '../config.js'
import { rateLimit } from '../lib/rateLimit.js'
import { inquirySchema } from '../lib/schema.js'
import { sendInquiry } from '../lib/mailer.js'

/**
 * POST /api/inquiry
 *
 * Three layers of defence, in increasing order of cost: a honeypot field that
 * silently absorbs bots, a per-IP rate limit, and schema validation. The
 * honeypot returns 200 rather than an error — a bot that is told it failed
 * simply tries again differently.
 */

export const inquiryRouter = Router()

inquiryRouter.post(
  '/inquiry',
  rateLimit({ windowMs: config.rateLimit.windowMs, max: config.rateLimit.max }),
  async (req, res) => {
    const parsed = inquirySchema.safeParse(req.body)

    if (!parsed.success) {
      const first = parsed.error.issues[0]
      res.status(400).json({
        ok: false,
        message: first?.message ?? 'Some of those details did not come through.',
        field: first?.path.join('.'),
      })
      return
    }

    const inquiry = parsed.data

    // Honeypot tripped: accept, discard, say nothing.
    if (inquiry.website) {
      res.status(200).json({ ok: true })
      return
    }

    try {
      const outcome = await sendInquiry(inquiry)
      res.status(200).json({ ok: true, delivery: outcome })
    } catch (error) {
      console.error('[inquiry] delivery failed:', error)
      res.status(502).json({
        ok: false,
        message: 'That could not be delivered just now.',
      })
    }
  },
)
