import type { RequestHandler } from 'express'

/**
 * A small fixed-window rate limiter.
 *
 * One route, one process, low traffic — a dependency and a Redis instance
 * would be more moving parts than the problem deserves. Buckets are pruned
 * lazily so memory cannot grow without bound.
 *
 * If this ever runs behind a load balancer across several instances, swap this
 * for a shared store; the interface is the same.
 */

interface Bucket {
  count: number
  resetAt: number
}

export function rateLimit(options: { windowMs: number; max: number; message?: string }): RequestHandler {
  const buckets = new Map<string, Bucket>()
  let lastSweep = Date.now()

  return (req, res, next) => {
    const now = Date.now()

    // Sweep expired buckets at most once a minute.
    if (now - lastSweep > 60_000) {
      lastSweep = now
      for (const [key, bucket] of buckets) {
        if (bucket.resetAt <= now) buckets.delete(key)
      }
    }

    const key = req.ip ?? req.socket.remoteAddress ?? 'unknown'
    const bucket = buckets.get(key)

    if (!bucket || bucket.resetAt <= now) {
      buckets.set(key, { count: 1, resetAt: now + options.windowMs })
      next()
      return
    }

    bucket.count += 1

    if (bucket.count > options.max) {
      const retryAfter = Math.ceil((bucket.resetAt - now) / 1000)
      res.setHeader('Retry-After', String(retryAfter))
      res.status(429).json({
        ok: false,
        message:
          options.message ??
          'That is a few too many messages in a short time. Try again shortly, or send an email instead.',
      })
      return
    }

    next()
  }
}
