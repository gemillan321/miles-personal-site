import type { Discipline } from '@/types'

/* Capabilities, not a logo wall. Each cell says what I can do with the thing,
   because "knows AWS" tells a client nothing they can act on. */

export const DISCIPLINES: Discipline[] = [
  {
    id: 'software',
    title: 'Software development',
    blurb:
      'The foundation everything else sits on — structuring a system so it can be understood, changed and extended six months later by someone who is not me.',
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
    title: 'Cloud & AWS',
    blurb:
      'Getting software onto the internet properly — hosting, storage, domains, and knowing roughly what it will cost to run.',
    tags: ['AWS', 'S3', 'EC2', 'Deployment', 'CI/CD'],
    span: 'w2',
    accent: 'cyan',
  },
  {
    id: 'security',
    title: 'Cybersecurity',
    blurb:
      'A working habit rather than a specialism: authentication done properly, input never trusted, secrets kept out of the codebase. Sharpened on CTF competitions.',
    tags: ['Web security', 'Auth', 'CTF', 'Hardening'],
    span: 'w2',
    accent: 'azure',
  },
  {
    id: 'ai',
    title: 'AI-assisted development',
    blurb:
      'Modern tooling used as an accelerator — prototyping, refactoring, debugging — with every architectural decision and every shipped line still mine to defend.',
    tags: ['Prototyping', 'Refactoring', 'Code review', 'Tooling'],
    span: 'w2',
    accent: 'violet',
  },
  {
    id: 'systems',
    title: 'Systems & data',
    blurb:
      'Designing how information is stored and how the pieces talk to each other. Usually the part that decides whether a project ages well.',
    tags: ['Databases', 'Schema design', 'APIs', 'Automation'],
    span: 'w4',
    accent: 'cyan',
  },
]
