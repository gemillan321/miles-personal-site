import type { NavItem } from '@/types'

/* ────────────────────────────────────────────────────────────────────────────
   Site-level content and identity.

   ⚑ PLACEHOLDERS — replace these with real details before launch. They are
     also mirrored in index.html (title, description, canonical, OG, JSON-LD);
     keep the two in sync.
   ──────────────────────────────────────────────────────────────────────────── */

export const SITE = {
  name: 'Miles',
  fullName: 'Miles', // ⚑ full name
  role: 'Computer Science student & developer',
  location: 'Philippines', // ⚑
  timezone: 'GMT+8',
  url: 'https://your-domain.com', // ⚑
  email: 'hello@your-domain.com', // ⚑
  availability: {
    open: true,
    line: 'Taking on freelance projects and internships',
  },
  socials: [
    { label: 'GitHub', href: 'https://github.com/your-handle' }, // ⚑
    { label: 'LinkedIn', href: 'https://linkedin.com/in/your-handle' }, // ⚑
    { label: 'Email', href: 'mailto:hello@your-domain.com' }, // ⚑
  ],
} as const

export const NAV: NavItem[] = [
  { label: 'About', href: '#about', index: '02' },
  { label: 'What I build', href: '#services', index: '03' },
  { label: 'Work', href: '#work', index: '04' },
  { label: 'Disciplines', href: '#disciplines', index: '05' },
  { label: 'Process', href: '#process', index: '07' },
  { label: 'Contact', href: '#contact', index: '08' },
]

/** Hero copy. The three-word promise and the layered hero visual are the same
 *  idea said twice: clear on the surface, solid underneath. */
export const HERO = {
  eyebrow: 'Computer Science student · Developer',
  headlineLead: 'Websites, web apps, and the',
  headlineEditorial: 'systems underneath',
  headlineTail: 'them.',
  lede:
    "I'm Miles. I build software for people and small businesses — clear on the surface, solid underneath. Simple sites, real web applications, and the custom tools that quietly run a business day to day.",
  primaryCta: { label: 'Start a project', href: '#contact' },
  secondaryCta: { label: 'See the work', href: '#work' },
  /** Labels on the three hero planes, top to bottom. */
  planes: [
    { label: 'Interface', detail: 'What people see and use' },
    { label: 'Logic', detail: 'The rules that make it work' },
    { label: 'Data', detail: 'Where everything is kept' },
  ],
}

export const ABOUT = {
  kicker: 'About',
  headlineLead: 'I like building things that',
  headlineEditorial: 'actually get used',
  headlineTail: '.',
  paragraphs: [
    "I'm a Computer Science student, and most of what I know came from building things and then finding out what I got wrong. That's still how I work: make something real, put it in front of people, fix what doesn't hold up.",
    "I care about the parts nobody sees — how data is structured, what happens when something fails, whether the person using it on a phone at 11pm can still get their job done. Those are the details that decide whether software is worth having.",
    "I'm early in my career and I don't pretend otherwise. What I can promise is that I'll understand your problem before I write code, tell you honestly what's realistic, and hand over something you can keep using after I've finished.",
  ],
  /** Small personal bento — tasteful, not a life story. */
  facts: [
    { label: 'Based in', value: 'Philippines', detail: 'GMT+8 · working with anyone, anywhere' },
    { label: 'Currently building', value: 'Rizal Arcade', detail: 'An interactive learning platform' },
    { label: 'Also learning', value: 'AWS & cloud architecture', detail: 'Because things have to run somewhere' },
    { label: 'Weekends', value: 'CTFs and guitar', detail: 'Both are pattern recognition, arguably' },
  ],
}

export const WORKFLOW = {
  kicker: 'How I work',
  headlineLead: 'Modern tools, but the',
  headlineEditorial: 'engineering is mine',
  headlineTail: '.',
  lede: 'AI is part of how I build — the same way version control and a good debugger are. It changes how fast I can move, not who is responsible for the result.',
  columns: [
    {
      title: 'What AI speeds up',
      items: [
        'Getting a working prototype in front of you in days, not weeks',
        'Exploring several approaches before committing to one',
        'Boilerplate, migrations, tests and the tedious middle of a build',
        'Tracking down bugs faster and refactoring with less risk',
      ],
    },
    {
      title: 'What stays mine',
      items: [
        'Deciding how the system is structured and why',
        'Understanding every line that ships — no code I cannot explain',
        'Integration, security decisions and handling failure cases',
        'Testing, deployment, and being accountable when something breaks',
      ],
    },
  ],
  footnote:
    'The practical effect for a small business: fewer billable hours spent on groundwork, more spent on the parts specific to you, and a much shorter gap between "here is an idea" and "here is something you can click".',
}

export const CONTACT = {
  kicker: 'Contact',
  headlineLead: 'Have something you',
  headlineEditorial: 'want built',
  headlineTail: '?',
  lede: "Tell me a little about it. You don't need to know the technical terms — describing the problem in plain words is genuinely more useful than a spec.",
  reassurance: [
    'No obligation, and no sales pitch back.',
    "If your project isn't a good fit for me, I'll say so and point you somewhere better.",
    'I usually reply within a day or two.',
  ],
}

export const FOOTER = {
  sign: 'Designed and built from scratch — no template.',
  colophon: 'Vue 3 · Vite · Tailwind · Express. Type set in Inter Tight and Instrument Serif.',
}
