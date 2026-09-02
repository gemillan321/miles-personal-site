# Midnight Aurora — Design Direction

> The brief asked for Aurora UI, glass, bento, editorial type and restrained depth — but warned
> against throwing them together. This document is the "why" behind every visual decision, so the
> site stays coherent as it grows.

---

## 1. The problem with the obvious version

The default interpretation of this brief is a dark page with purple blobs behind everything, a
grid of glass rectangles, and a browser mockup in the hero. It looks fine and it looks like
everyone else. Remove the name and you could not tell whose site it is.

So the site is built on **three ideas that are structural, not decorative.** They are what make it
recognizable.

---

## 2. Signature idea #1 — The Rig (one light, one room)

Most sites scatter gradients. This site has **a single simulated light source.**

Its position lives in two CSS custom properties on `<html>`:

```
--light-x  --light-y      /* 0..1, viewport-relative */
```

One `requestAnimationFrame` loop drifts it slowly on a Lissajous path and lets the cursor pull it
a limited distance (the cursor influences the light, it does not *become* the light). Every
lit thing on the page reads those two variables:

| Element                | How it uses the light                                               |
| ---------------------- | ------------------------------------------------------------------- |
| Aurora field           | Bloom centers offset from the light, parallaxed by depth             |
| Glass panels           | Specular sheen positioned by the light, per-panel                    |
| Panel borders          | Border gradient brightens on the edge facing the light               |
| Hero stack planes      | Each plane's highlight and shadow derive from the same source        |
| Neumorphic controls    | Inset/outset shadow direction follows the light instead of "top-left"|

**Why it matters:** when you move the mouse, every glass edge on the page updates *together*, like
turning a real object under a lamp. That coherence is the "this feels modern" moment, and it is
what separates a lighting model from decoration. It costs one rAF loop and no per-element JS.

## 3. Signature idea #2 — The Through-Line

A **single continuous warm stroke** enters at the hero, runs the entire length of the page, and is
drawn as you scroll. It is the site's spine, and it does real work in every section rather than
being an ornament:

```
Hero          rises through the layered planes and exits downward
About         becomes the margin rule beside the editorial column
Services      fans into branches, one touching each offering
Featured work becomes the connector running the case-study timeline
Disciplines   splits into threads entering each bento cell
Workflow      loops — the iteration cycle drawn as a loop in the line
Process       becomes the five-step path (this is why Process is not five numbered boxes)
Contact       converges back to one line entering the form
Footer        resolves into six horizontal lines — guitar strings, and they are pluckable
```

That footer resolution is the personal detail the brief asked for, made structural instead of
tacked on: the line that carried you through the whole site turns out to have been a string all
along. Six strings, tuned E-A-D-G-B-E, played with the Web Audio API, plucked by hover or click.

## 4. Signature idea #3 — Warm signal against cool field

Every dark developer portfolio is entirely cool — violet, blue, cyan, and nothing else. This one
reserves **a single warm accent** (`#FFA45C`, amber) and spends it almost nowhere:

- the through-line
- focus rings
- the primary call-to-action
- active/selected states
- the "available for work" indicator

Nothing else may use it. One warm line cutting through a cold room is the color signature, and it
is the reason a screenshot of this site does not look like a screenshot of any other.

---

## 5. Visual system

### Ground

Deep charcoal, never pure black. A very fine film grain (SVG turbulence, ~3% opacity) sits above
the aurora and below the content — it kills gradient banding and gives the darkness a material
quality rather than a flat void.

```
--ground      #0A0B0F   page
--ground-2    #0E1016   raised sections
--ground-3    #131722   deepest wells
```

### Aurora

Three or four very large, very soft radial blooms at 18–30% opacity, blurred at 100px+, moving on
slow independent orbits. Violet → azure → cyan. They live *behind* a grain layer and *behind*
content, never competing with text. Contrast is measured against the darkest point of the field, so
text passes AA everywhere the bloom travels.

```
--violet  #8B5CF6      --azure  #3B82F6      --cyan  #22D3EE      --signal #FFA45C
```

### Glass

Glass is a **material with rules**, not a card style:

- appears only on elevated, interactive, or foreground things
- 8–16px backdrop blur, 4–8% white fill, 1px gradient border lit by the rig
- a specular sheen that follows the light
- never stacked on glass, never used for long-form reading surfaces

Roughly a third of surfaces are glass. The rest are solid, bordered, or nothing at all.

### Neumorphism

Capped at a handful of elements: the theme/sound toggle, segmented controls, small raised chips.
Soft dual shadows whose direction comes from the rig. Never on cards, never on sections.

### Typography

| Role      | Face                       | Use                                                       |
| --------- | -------------------------- | --------------------------------------------------------- |
| Display   | Inter Tight, -0.03em       | Headlines, 40–92px fluid, tight and confident              |
| Editorial | Instrument Serif, italic   | One or two emphasized words inside a headline; pull-quotes |
| Body      | Inter                      | 16–19px, 1.65 line-height, max 68ch                        |
| Label     | Inter, 11px, +0.14em, caps | Section indices, meta, kickers                             |

The serif italic is the editorial move. Used on maybe six words across the whole site, it makes
headlines feel *set* rather than typed, and it is the reason the typography does not read as a
template. No monospace anywhere — monospace on a developer site is a cliché and the brief rules it out.

### Layout — the rail

Desktop pages hang off a **left rail**: a thin persistent column carrying section indices
(`01 / 02 / 03`) and the through-line. Content sits in an asymmetric grid to the right of it. This
is what gives the site its editorial, well-set quality and stops full-bleed sections from reading
as a stack of unrelated slabs. The rail collapses below 1024px, where the through-line moves
inline and section indices become inline kickers.

### Bento

Used in three places only — Disciplines, Personal, and the capabilities grid inside Services — with
genuinely different cell weights (2×2, 2×1, 1×1) and genuinely different *contents*: some text,
some live visualization, some interactive, one purely atmospheric. Never one giant uniform grid,
never as the structure of the whole page.

---

## 6. Motion

| Rule                | Value                                                      |
| ------------------- | ---------------------------------------------------------- |
| Easing              | `cubic-bezier(0.22, 1, 0.36, 1)` for entrances; linear for the rig |
| Entrance            | 12–20px rise + fade, 600–800ms, staggered 60ms              |
| Hover               | ≤ 200ms, transform and opacity only                         |
| Pointer response    | damped/lerped, never 1:1 — the page follows the cursor lazily |
| Budget              | one rAF loop for the rig, IntersectionObserver for reveals   |
| `prefers-reduced-motion` | rig freezes at center, reveals become instant, through-line draws fully, no parallax |

Nothing animates on a timer in the reader's peripheral vision while they are reading. Nothing
moves more than it needs to to feel alive.

---

## 7. Page architecture

```
00  Header            glass, condenses on scroll, magnetic CTA
01  Hero              layered-stack visual, through-line origin
02  About             editorial column + small bento of personal detail
03  What I build      services in plain language for non-technical readers
04  Featured work     case studies, not cards — problem / role / stack / outcome
05  Disciplines       bento: software, web, cloud/AWS, security, AI-assisted, systems
06  How I work        AI-assisted development positioned as engineering workflow
07  Process           five steps drawn along the through-line
08  Contact           conversational inquiry flow, not a bare contact form
09  Footer            guitar strings, easter eggs, honest sign-off
```

## 8. Tone

Confident, specific, and honest about being early-career. No "10+ years", no invented client
counts, no agency "we". Sentences a small-business owner can read without decoding jargon,
sitting next to technical depth a developer will recognize as real. The site says *I know how to
build this and I will tell you exactly how I would* — which is more persuasive than pretending to
be an agency.
