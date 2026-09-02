import type { Project } from '@/types'

/* ────────────────────────────────────────────────────────────────────────────
   Featured work — case studies, not cards.

   Everything the section renders comes from this array, so adding a project
   is one object — no component edits.

   ⚑ threatlens-cti is currently a private repo. Add its Repository link below
     once it's flipped to public — see gh repo edit gemillan321/threatlens-cti
     --visibility public.

   The template at the bottom of this file shows the shape.
   ──────────────────────────────────────────────────────────────────────────── */

export const PROJECTS: Project[] = [
  {
    slug: 'threatlens-cti',
    name: 'ThreatLens',
    kicker: 'Cyber threat intelligence assistant',
    year: '2026',
    status: 'Prototype',
    summary:
      'A working MVP that turns a weekly pile of security advisories into structured, sourced CTI drafts instead of another AI summary with no paper trail.',
    problem:
      'Cyber threat intelligence work means reading a stack of advisories every week and turning what matters into a short written brief. Doing that by hand does not scale, and letting a model summarize headlines unsupervised produces confident, unsourced nonsense — exactly the wrong failure mode for a security workflow.',
    role: 'Concept, architecture, front end, API, and the OpenAI integration — solo build.',
    contribution: [
      'Built an RSS ingestion pipeline that pulls only from a trusted-source allowlist — CISA, Microsoft Security, Unit 42, Cisco Talos — instead of the open web',
      'Wired every AI-drafted report back to the source article it came from, so a claim is never presented without the evidence that produced it',
      'Designed the Supabase schema with row-level security so each analyst account only ever sees its own workspace',
      'Wrote the trust-boundary documentation and a pre-deployment security checklist before writing the deployment guide',
    ],
    interesting:
      'The hard part was not the AI integration, it was deciding what the model should never be trusted to do alone. Every generated report stays editable and explicitly marked as a draft until a person signs off — the workflow assumes the analyst, not the model, is accountable for what ships.',
    stack: ['Vue 3', 'Express', 'Supabase (Postgres + Auth + RLS)', 'OpenAI API'],
    metrics: [
      { label: 'Trusted sources', value: '4 feeds' },
      { label: 'Role', value: 'Solo' },
      { label: 'Stage', value: 'Working MVP' },
    ],
    links: [],
    accent: 'cyan',
    preview: 'dashboard',
  },
  {
    slug: 'rizal-arcade',
    name: 'Rizal Arcade',
    kicker: 'Educational game platform',
    year: '2026',
    status: 'In progress',
    summary:
      'Six two-to-five-minute games that teach José Rizal’s life and writing for college Rizal Life classes — played, not read, with every answer sourced.',
    problem:
      'Course material that students are required to read is not material students want to read. The question was whether a Rizal Life class could run on something with the pick-and-play feel of a browser arcade, without losing the accuracy a history class requires.',
    role: 'Design, front end, back end, data model, deployment — the whole build, still active.',
    contribution: [
      'Built six distinct games — a values-based river crossing, a novel-character memory match, an Atbash codebreaker, a study-route passport game, a correspondence dossier, and a museum curation game — instead of one reskinned template',
      'Designed the Supabase-backed classroom layer: roster import, row-level security so a student sees only their own section, and one-time CSV credential export for instructors',
      'Sourced every historical claim to a primary text, public-domain translation, or an NHCP marker, and labeled interpretation separately from fact throughout',
      'Set up a dual deployment split — Vercel Functions for the protected roster and admin endpoints, a static build for the public landing page',
    ],
    interesting:
      'No single game was the hard part — the classroom layer underneath all six was. One Supabase project handles authentication, per-section leaderboards, and a roster importer an instructor can run without me in the room, which is what actually makes this usable in a real class instead of a nice demo.',
    stack: ['React 19', 'TypeScript', 'Tailwind CSS', 'Vinext / Vite', 'Supabase (Postgres + Auth + RLS)', 'Vercel Functions'],
    metrics: [
      { label: 'Playable games', value: '6' },
      { label: 'Role', value: 'Solo' },
      { label: 'Stage', value: 'In development' },
    ],
    links: [{ label: 'Repository', href: 'https://github.com/gemillan321/rizal-arcade' }],
    accent: 'violet',
    preview: 'arcade',
  },
  {
    slug: 'happypaws-clinic',
    name: 'HappyPaws Clinic',
    kicker: 'Clinic management system',
    year: '2026',
    status: 'Archived',
    summary:
      'A role-based booking and medical-records system for a vet clinic — separate admin, vet, and client views instead of one dashboard with hidden permissions.',
    problem:
      'A small clinic’s booking process usually lives in a notebook or a messaging app inbox — no shared record of a pet’s medical history, no simple way for an owner to check it, and no real separation between what a receptionist, a vet, and a client should each be able to see or change.',
    role: 'Full-stack build — schema, API, and three separate role-based front ends.',
    contribution: [
      'Built distinct admin, vet, and client views instead of one dashboard with permissions bolted on afterward',
      'Designed the medical record, appointment, pet, and owner data model and the REST API behind it',
      'Added JWT-based authentication with a dedicated auth store on the front end',
      'Structured the backend as proper MVC — controllers, routes, and models split by domain — instead of one file handling everything',
    ],
    interesting:
      'The real design problem was permissions, not CRUD: a vet needs to write medical records, a client needs to read only their own pet’s, and an admin needs full visibility without being able to silently rewrite medical history. Getting that split right mattered more than any individual screen.',
    stack: ['Vue 3', 'Express', 'MySQL', 'JWT Auth'],
    metrics: [
      { label: 'Access levels', value: 'Admin / Vet / Client' },
      { label: 'Role', value: 'Solo' },
      { label: 'Stage', value: 'Coursework build' },
    ],
    links: [{ label: 'Repository', href: 'https://github.com/gemillan321/HappyPawsClinic_Finals' }],
    accent: 'azure',
    preview: 'layers',
  },
  {
    slug: 'this-site',
    name: 'This website',
    kicker: 'Personal site & design system',
    year: '2026',
    status: 'Live',
    summary:
      'A portfolio built as a real project — its own design system, its own lighting model, no template underneath.',
    problem:
      'A developer portfolio has to convince two very different readers at once: a business owner deciding whether to trust me with their money, and a developer deciding whether I can actually build. Most portfolios pick one and lose the other.',
    role: 'Everything — concept, design system, front end, API, deployment.',
    contribution: [
      'Built a design system around a single simulated light source, so every glass surface on the page reacts coherently',
      'Wrote a continuous scroll-drawn line that threads the whole page and does structural work in each section',
      'Hand-rolled the motion layer — one animation frame loop and an IntersectionObserver, no animation library',
      'Built the enquiry API with validation, rate limiting and spam handling',
    ],
    interesting:
      'The lighting is the part I am most pleased with. Two CSS variables hold the light position; every panel, border and shadow derives from them. Moving the cursor turns the entire page under one lamp instead of animating a hundred separate effects.',
    stack: ['Vue 3', 'TypeScript', 'Vite', 'Tailwind CSS', 'Express', 'Web Audio API'],
    metrics: [
      { label: 'Dependencies', value: 'Minimal' },
      { label: 'Animation library', value: 'None' },
      { label: 'Template', value: 'None' },
    ],
    links: [],
    accent: 'signal',
    preview: 'layers',
  },
]

/* ── Template ─────────────────────────────────────────────────────────────────
   Copy this into the array above to add a project.

export const TEMPLATE: Project = {
  slug: 'project-slug',
  name: 'Project name',
  kicker: 'Category',
  year: '2026',
  status: 'Live',                    // 'In progress' | 'Live' | 'Prototype' | 'Archived'
  summary: 'One sentence for the index.',
  problem: 'What was wrong before this existed.',
  role: 'What I was responsible for.',
  contribution: ['…', '…'],
  interesting: 'The part worth talking about.',
  stack: ['…'],
  metrics: [{ label: '…', value: '…' }],
  links: [{ label: 'Live site', href: 'https://…' }],
  accent: 'azure',                   // 'violet' | 'azure' | 'cyan' | 'signal'
  preview: 'dashboard',              // 'arcade' | 'layers' | 'dashboard'
}
────────────────────────────────────────────────────────────────────────────── */
