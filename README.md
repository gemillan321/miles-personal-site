# Personal website — portfolio & client-facing presence

A single-page personal site: who I am, what I build, the work, how I work, and a way to start
a conversation about a project. Vue 3 front end, Express API, no template underneath.

Design codename **Midnight Aurora**. The reasoning behind every visual decision is in
[`DESIGN.md`](./DESIGN.md) — read that first if you are changing how the site *looks*; read this
if you are changing how it *runs*.

---

## Quick start

```bash
npm install          # installs both workspaces
npm run dev          # client on :5173, API on :8787 (proxied at /api)
```

Other scripts, all from the repo root:

| Command             | What it does                                        |
| ------------------- | --------------------------------------------------- |
| `npm run dev`       | Client and API together, both watching               |
| `npm run build`     | Type-checks and builds both workspaces               |
| `npm run typecheck` | Type-checks without emitting                         |
| `npm run preview`   | Serves the production client build on :4173          |
| `npm start`         | Runs the built API                                   |
| `npm run og`        | Regenerates the social preview card (`public/og.png`)|
| `npm run smoke`     | Browser smoke test — see below                       |

Node 20+.

### Smoke test

`tools/smoke.mjs` drives a real browser against the production build and checks the things that
can actually break: the light rig is writing its custom properties, the self-hosted fonts
resolved, the services disclosure opens and closes, calm mode toggles, the through-line advances
on scroll, the form rejects an empty submit and accepts a real one end-to-end, the guitar strings
respond, and there is exactly one `h1`, one `main`, and a label on every form control.

```bash
npm run build
npm run preview &                    # client on :4173
npm start &                          # API on :8787
npm run smoke
```

---

## Layout

```
client/                      Vue 3 + Vite + Tailwind v4
  index.html                 metadata, structured data, first-paint background
  public/                    favicon, og.png, robots.txt, sitemap.xml
  src/
    content/                 ← ALL COPY LIVES HERE. Edit these, not components.
      site.ts                identity, nav, hero, about, workflow, contact, footer
      services.ts            what I build
      projects.ts            case studies (add one object, get a full case study)
      disciplines.ts         the bento cells
      process.ts             the five stages
    styles/
      tokens.css             design tokens + the runtime custom properties
      base.css               reset, type scale, layout shell, reveal, calm mode
      materials.css          glass, lit edges, sheen, grain, neumorphism, bento
    composables/
      useLightRig.ts         the single light source (see DESIGN.md §2)
      useCalmMode.ts         visitor-facing motion switch
      useMotionPreference.ts shared prefers-reduced-motion state
      useInquiryForm.ts      contact form state and submission
    directives/
      reveal.ts              entrance on scroll (one shared observer)
      draw.ts                scroll progress as --draw (drives the through-line)
      spotlight.ts           cursor-following glow on one element
      magnetic.ts            CTA lean-toward-cursor
      tilt.ts                restrained perspective shift
    components/
      layout/                header, footer
      visual/                aurora, hero stack, rail segments, previews, strings
      ui/                    heading, action link, brand mark
      sections/              one component per page section
server/                      Express 5 + TypeScript
  src/
    index.ts                 app wiring, health check, optional static hosting
    config.ts                environment, with safe defaults for everything
    routes/inquiry.ts        POST /api/inquiry
    lib/schema.ts            zod validation
    lib/rateLimit.ts         per-IP fixed window
    lib/mailer.ts            nodemailer, falls back to logging
tools/                       og.html + og.mjs — the social card generator
```

---

## Editing content

Everything a visitor reads is in `client/src/content/`. Nothing in `components/` needs to be
touched to change copy, add a service, or publish a project.

**Adding a project** — append one object to `PROJECTS` in `content/projects.ts`. The template at
the bottom of that file shows every field. `preview` picks which built-in illustration is drawn
(`arcade`, `layers`, `dashboard`); when there is a real screenshot to show, replace
`<ProjectPreview>` in `WorkSection.vue` with an `<img>` and keep everything else.

**Launch details** — keep these current when identity or domain details change:

- `client/src/content/site.ts` — full name, email, domain and social links
- `client/index.html` — title, description, canonical URL, Open Graph URLs, JSON-LD
- `client/public/robots.txt` and `sitemap.xml` — domain
- `client/src/content/projects.ts` — real Rizal Arcade details, stack and links
- then run `node tools/og.mjs` to rebuild the preview card with the real name

---

## The API

One endpoint that matters.

```
POST /api/inquiry
{ name, business, need, message, method, contact, website }

200 { ok: true, delivery: 'sent' | 'logged' }
400 { ok: false, message, field }   validation
429 { ok: false, message }          rate limited
502 { ok: false, message }          delivery failed
```

`website` is a honeypot — it must be empty, and a filled one is accepted and discarded rather
than rejected, so a bot is never told what tripped it. `need` is one of `website | application |
system | rebuild | unsure`; `method` is `email | phone | either`.

`GET /api/health` reports the environment and whether mail is configured.

**Without SMTP configured the endpoint still works** — enquiries are written to the server log
instead of emailed, so a misconfigured mailer never costs a real lead. Copy `server/.env.example`
to `server/.env` and fill in any SMTP provider to switch delivery on.

---

## Deploying

The client is a static bundle and the API is a small Node process; they can live together or
apart.

**Separately** (recommended — static host + small API host):

1. Build: `npm run build`
2. Deploy `client/dist/` to any static host.
3. Deploy `server/` and run `npm start`, with `CORS_ORIGINS=https://gemillanlabs.com`.
4. Point `/api/*` at the API — either a host-level rewrite, or set `CORS_ORIGINS` and change the
   `fetch` URL in `useInquiryForm.ts` to the API's absolute origin.

**Together** (one box, one process): build, then run the server with `SERVE_CLIENT=true`. It
serves `client/dist` and handles `/api` itself.

**Static-only** (no Node at all): deploy `client/dist` and point the form at a form service by
changing the one `fetch` call in `useInquiryForm.ts`.

---

## Notes on the implementation

A few decisions worth knowing before changing things:

- **One animation frame loop for the whole site.** `useLightRig` writes `--light-x` / `--light-y`
  and everything lit derives from those two numbers. Do not add per-element rAF loops; add
  another consumer of the custom properties instead.
- **No animation library.** Entrances are an IntersectionObserver plus CSS transitions; the
  through-line is `pathLength="1"` and `stroke-dashoffset`. This is on purpose — it keeps the
  bundle small and the behaviour predictable.
- **The through-line is per-section.** Each section renders its own `RailSegment`; they meet
  because every path enters and leaves at the same x. Measuring one path across the whole
  document would break on every reflow.
- **Fonts are self-hosted** (`@fontsource`), imported in `main.ts`. No font CDN request, and the
  files are fingerprinted and cached with the rest of the build.
- **Reduced motion is respected in two ways**: the OS setting, and the "Motion / Calm" toggle in
  the header for people who have never changed that setting. Both paths must keep working —
  check `html[data-calm='true']` rules in `base.css` when adding animation.
- **Glass is a material with rules**, not a card style. See DESIGN.md §5 before adding another
  `.glass` surface.

## Licence

All rights reserved. The code is here to be read, not reused wholesale as a template.
