import type { NavItem } from '@/types'

/* Site-level content and identity. Keep this in sync with index.html. */

export const SITE = {
  name: 'Miles',
  fullName: 'Miles Gemillan',
  role: 'Computer Science student & developer',
  location: 'Philippines',
  timezone: 'GMT+8',
  url: 'https://gemillanlabs.com',
  email: 'miles.angelo77@gmail.com',
  availability: {
    open: true,
    line: 'Taking on freelance projects and internships',
  },
  socials: [
    { label: 'GitHub', href: 'https://github.com/gemillan321' },
    { label: 'Email', href: 'mailto:miles.angelo77@gmail.com' },
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
    { label: 'Based in', value: 'Philippines', detail: 'GMT+8 · available for remote work' },
    {
      label: 'Currently building',
      value: 'Gemillan Labs',
      detail: 'A home for my projects, experiments, and client work',
    },
    {
      label: 'Currently learning',
      value: 'Full-stack engineering',
      detail: 'Turning fast builds into reliable products',
    },
    {
      label: 'Weekends',
      value: 'CTFs, side projects & guitar',
      detail: 'Usually building, breaking, or playing something',
    },
  ],
}

export const WORKFLOW = {
  kicker: 'How I work',
  headlineLead: 'AI helps me move fast. The',
  headlineEditorial: 'result still has to work',
  headlineTail: '.',
  lede: 'I build directly in code with AI as part of the workflow. It helps me explore, debug, and iterate quickly; I still test what comes out, make the product decisions, and keep learning the parts I do not understand yet.',
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
      title: 'What I stay responsible for',
      items: [
        'Understanding the problem and choosing what should be built',
        'Reviewing, testing and refining what the tools produce',
        'Checking real user flows, edge cases and mobile behaviour',
        'Deployment, communication and taking responsibility for the result',
      ],
    },
  ],
  footnote:
    'The practical effect: a much shorter gap between "here is an idea" and "here is something you can click", with more time spent testing what is specific to the project instead of polishing a mockup that is not the real product.',
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
