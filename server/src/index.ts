import path from 'node:path'
import { fileURLToPath } from 'node:url'
import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import compression from 'compression'

import { config } from './config.js'
import { inquiryRouter } from './routes/inquiry.js'

/**
 * The API behind the site.
 *
 * One real endpoint (the project enquiry) and a health check. It can also
 * serve the built front end when SERVE_CLIENT=true, which makes a single-box
 * deploy possible; on a platform where the front end is hosted separately,
 * leave that off and this process only answers /api.
 */

const app = express()
const here = path.dirname(fileURLToPath(import.meta.url))

// Behind a proxy (most hosts), so req.ip reflects the real client for the
// rate limiter rather than the load balancer.
app.set('trust proxy', 1)

app.disable('x-powered-by')
app.use(
  helmet({
    // The client is a static bundle served from its own origin; a strict CSP
    // belongs on the static host, where the hashes are known.
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  }),
)
app.use(compression())
app.use(express.json({ limit: '32kb' }))

if (config.corsOrigins.length) {
  app.use(cors({ origin: config.corsOrigins, methods: ['POST', 'GET'] }))
}

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, env: config.env, mail: config.mail.enabled ? 'configured' : 'logging' })
})

app.use('/api', inquiryRouter)

// Optional: serve the built client from this process.
if (config.serveClient) {
  const clientDir = path.resolve(here, '..', config.clientDir)
  app.use(express.static(clientDir, { maxAge: '1y', index: false }))
  app.get(/.*/, (_req, res) => {
    res.sendFile(path.join(clientDir, 'index.html'))
  })
}

// Anything unmatched under /api is a 404 in JSON, not an HTML error page.
app.use('/api', (_req, res) => {
  res.status(404).json({ ok: false, message: 'Not found.' })
})

app.listen(config.port, () => {
  console.info(
    `[server] listening on http://localhost:${config.port} (${config.env})` +
      (config.mail.enabled ? '' : ' — SMTP not configured, enquiries will be logged'),
  )
})
