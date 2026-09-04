import type { Discipline } from '@/types'

/* Capabilities, not a logo wall. Each cell says what I can do with the thing,
   because "knows AWS" tells a client nothing they can act on. */

export const DISCIPLINES: Discipline[] = [
  {
    id: 'software',
    title: 'Software development',
    blurb:
      'The foundation I am building through real projects — breaking problems into smaller pieces, reading the code, testing what it does, and improving it as I learn.',
    tags: ['TypeScript', 'JavaScript', 'Python', 'Git', 'Testing'],
    span: 'w2',
    tall: true,
    accent: 'violet',
  },
  {
    id: 'web',
    title: 'Web development',
    blurb:
      'Front end and back end. Interfaces that are fast and accessible, and the APIs and databases behind them.',
    tags: ['Vue', 'Node', 'Express', 'Tailwind', 'REST'],
    span: 'w2',
    accent: 'azure',
  },
  {
    id: 'cloud',
    title: 'Deployment & hosting',
    blurb:
      'Getting projects out of a local folder and onto the internet — deployments, domains, environment variables, and the first steps into cloud infrastructure.',
    tags: ['Vercel', 'Domains', 'Environment variables', 'GitHub', 'Learning AWS'],
    span: 'w2',
    accent: 'cyan',
  },
  {
    id: 'security',
    title: 'Cybersecurity',
    blurb:
      'A growing area of interest: thinking about authentication, untrusted input, exposed secrets, and how software can fail before it reaches real users.',
    tags: ['Web security', 'Auth', 'CTF', 'Hardening'],
    span: 'w2',
    accent: 'azure',
  },
  {
    id: 'ai',
    title: 'AI-assisted development',
    blurb:
      'How I turn an idea into working software quickly: use AI to explore and build, then test the result, question what looks wrong, and learn the code the product depends on.',
    tags: ['Prototyping', 'Refactoring', 'Code review', 'Tooling'],
    span: 'w2',
    accent: 'violet',
  },
  {
    id: 'systems',
    title: 'Data & APIs',
    blurb:
      'Connecting interfaces to the useful part underneath — forms, stored information, user accounts, and APIs that let different pieces work together.',
    tags: ['Databases', 'Schema design', 'APIs', 'Automation'],
    span: 'w4',
    accent: 'cyan',
  },
]
