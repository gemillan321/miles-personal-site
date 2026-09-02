/**
 * Smoke test: exercises the parts of the site that can actually break.
 * Run against a built client served on :4173 with the API on :8787.
 */
import { chromium } from 'playwright'

const errors = []
const results = []
const ok = (name, cond, extra = '') =>
  results.push(`${cond ? 'PASS' : 'FAIL'}  ${name}${extra ? ` — ${extra}` : ''}`)

const browser = await chromium.launch(
  // Honour a locally provisioned Chromium when there is one; otherwise use
  // whatever `npx playwright install chromium` put in place.
  process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {},
)
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
page.on('pageerror', (e) => errors.push(String(e)))

// The built client calls /api/inquiry on its own origin; point that at Express.
await page.route('**/api/**', (route) => {
  const url = new URL(route.request().url())
  route.continue({ url: `http://127.0.0.1:8787${url.pathname}${url.search}` })
})

await page.goto('http://127.0.0.1:4173/', { waitUntil: 'networkidle' })

// 1. The rig is running and writing to the document.
await page.mouse.move(900, 300)
await page.waitForTimeout(700)
const lightX = await page.evaluate(() =>
  getComputedStyle(document.documentElement).getPropertyValue('--light-x').trim(),
)
ok('light rig writes --light-x', lightX !== '' && lightX !== '0.34', `--light-x = ${lightX}`)

// 2. Fonts actually resolved to the self-hosted faces.
const font = await page.evaluate(() => {
  const h1 = document.querySelector('h1')
  return h1 ? getComputedStyle(h1).fontFamily : ''
})
ok('display font applied', font.includes('Inter Tight'), font)

// 3. Services disclosure.
const secondService = page.locator('.service__head').nth(1)
await secondService.click()
ok('service opens', (await secondService.getAttribute('aria-expanded')) === 'true')
await secondService.click()
ok('service closes', (await secondService.getAttribute('aria-expanded')) === 'false')

// 4. Calm mode toggles and persists to the document.
await page.locator('button.calm').click()
ok('calm mode on', (await page.evaluate(() => document.documentElement.dataset.calm)) === 'true')
await page.locator('button.calm').click()
ok('calm mode off', (await page.evaluate(() => document.documentElement.dataset.calm)) === 'false')

// 5. The through-line draws as you scroll.
await page.evaluate(() => document.querySelector('#process')?.scrollIntoView())
await page.waitForTimeout(900)
const draw = await page.evaluate(() => {
  const el = document.querySelector('#process .steps')
  return el ? getComputedStyle(el).getPropertyValue('--draw').trim() : ''
})
ok('through-line draw progresses', Number(draw) > 0, `--draw = ${draw}`)

// 6. Validation blocks an empty submit.
await page.evaluate(() => document.querySelector('#contact')?.scrollIntoView())
await page.locator('.inquiry__submit').click()
await page.waitForTimeout(300)
ok('empty form is rejected', await page.locator('.inquiry__hint').isVisible())

// 7. A real submission reaches the API.
await page.fill('#f-name', 'Test Person')
await page.fill('#f-business', 'A small bakery')
await page.fill('#f-message', 'We need a website with online ordering for the shop.')
await page.fill('#f-contact', 'test@example.com')
await page.locator('.inquiry__submit').click()
await page.waitForTimeout(1500)
ok('submission accepted', await page.locator('.sent').isVisible())

// 8. Guitar strings respond.
await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
await page.waitForTimeout(500)
await page.locator('.strings__key').first().click()
await page.waitForTimeout(200)
ok('string pluck registers', await page.locator('.strings__string.is-plucked').count() > 0)

// 9. Landmarks and headings.
const structure = await page.evaluate(() => ({
  h1: document.querySelectorAll('h1').length,
  main: document.querySelectorAll('main').length,
  imgAlt: [...document.querySelectorAll('img')].every((i) => i.hasAttribute('alt')),
  labelled: [...document.querySelectorAll('input, select, textarea')].every(
    (f) =>
      f.id && (document.querySelector(`label[for="${f.id}"]`) || f.getAttribute('aria-label')),
  ),
}))
ok('exactly one h1', structure.h1 === 1, `found ${structure.h1}`)
ok('main landmark present', structure.main === 1)
ok('every form control is labelled', structure.labelled)

ok('no console errors', errors.length === 0, errors.slice(0, 3).join(' | '))

await browser.close()
console.log(results.join('\n'))
process.exit(results.some((r) => r.startsWith('FAIL')) ? 1 : 0)
