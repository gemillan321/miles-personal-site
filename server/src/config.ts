import 'dotenv/config'

/**
 * Configuration, read once at boot.
 *
 * Nothing here throws on a missing value: the site has to be able to run
 * locally, and in a preview deployment, without an SMTP account existing yet.
 * When mail is not configured the enquiry route says so in the logs and still
 * accepts the submission, so a misconfigured mailer never costs a real lead.
 */

function num(value: string | undefined, fallback: number): number {
  const n = Number(value)
  return Number.isFinite(n) ? n : fallback
}

function list(value: string | undefined): string[] {
  return (value ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
}

export const config = {
  env: process.env.NODE_ENV ?? 'development',
  isProd: process.env.NODE_ENV === 'production',
  port: num(process.env.PORT, 8787),

  /** Allowed browser origins. Empty in development means "same origin only". */
  corsOrigins: list(process.env.CORS_ORIGINS),

  /** Serve the built client from the API process. Handy for a single-box
   *  deploy; leave off when the front end is hosted separately. */
  serveClient: process.env.SERVE_CLIENT === 'true',
  clientDir: process.env.CLIENT_DIR ?? '../client/dist',

  rateLimit: {
    windowMs: num(process.env.RATE_LIMIT_WINDOW_MS, 15 * 60 * 1000),
    max: num(process.env.RATE_LIMIT_MAX, 5),
  },

  mail: {
    enabled: Boolean(process.env.SMTP_HOST && process.env.SMTP_USER),
    host: process.env.SMTP_HOST ?? '',
    port: num(process.env.SMTP_PORT, 587),
    secure: process.env.SMTP_SECURE === 'true',
    user: process.env.SMTP_USER ?? '',
    pass: process.env.SMTP_PASS ?? '',
    to: process.env.MAIL_TO ?? process.env.SMTP_USER ?? '',
    from: process.env.MAIL_FROM ?? process.env.SMTP_USER ?? '',
  },
} as const
