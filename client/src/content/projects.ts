import type { Project } from '@/types'

/* ────────────────────────────────────────────────────────────────────────────
   Featured work — case studies, not cards.

   ⚑ The Rizal Arcade entry below is a scaffold built from what is known so
     far. Replace the marked fields with real details (metrics, links,
     screenshots) as the project develops. Everything the section renders comes
     from this array, so adding a project is one object — no component edits.

   The template at the bottom of this file shows the shape.
   ──────────────────────────────────────────────────────────────────────────── */

export const PROJECTS: Project[] = [
  {
    slug: 'rizal-arcade',
    name: 'Rizal Arcade',
    kicker: 'Educational platform',
    year: '2026',
    status: 'In progress',
    summary:
      'An interactive web platform that teaches through play rather than through another wall of text.',
    problem:
      'Course material that students are required to read is not material students want to read. The subject matter is genuinely interesting, and the format is what loses people. The question was whether the same content could be delivered as something you play with instead of something you scroll through.', // ⚑ refine with real project framing
    role: 'Design, front end, back end, data model, deployment — the whole build.',
    contribution: [
      'Designed the platform structure and how a learner moves through it',
      'Built the interactive modules and the state that tracks progress',
      'Designed the data model behind content, progress and results',
      'Handled deployment, hosting and iteration on real feedback',
    ],
    interesting:
      'The hard part is not the interactivity, it is pacing. Too much game and nothing is learned; too little and it is a textbook with buttons. Most of the work has gone into the loop between showing something, letting the learner try it, and responding to what they did.',
    stack: ['Vue', 'Node / Express', 'Database', 'Deployment'], // ⚑ replace with the real stack
    metrics: [
      { label: 'Scope', value: 'Full build' },
      { label: 'Role', value: 'Solo' },
      { label: 'Stage', value: 'In development' },
    ],
    links: [], // ⚑ add { label: 'Live site', href: '…' } / repository when available
    accent: 'violet',
    preview: 'arcade',
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
