/**
 * Regenerates client/public/og.png — the social preview card.
 *
 *   node tools/og.mjs
 *
 * Edit tools/og.html and re-run whenever the headline or name changes.
 */
import { chromium } from 'playwright'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const here = path.dirname(fileURLToPath(import.meta.url))

const browser = await chromium.launch(
  // Honour a locally provisioned Chromium when there is one; otherwise use
  // whatever `npx playwright install chromium` put in place.
  process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {},
)
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 })
await page.goto(`file://${path.join(here, 'og.html')}`, { waitUntil: 'networkidle' })
await page.waitForTimeout(600)
await page.screenshot({ path: path.join(here, '..', 'client', 'public', 'og.png') })
await browser.close()
console.log('wrote client/public/og.png')
