/** Shared content types. Everything the site renders is typed here so that
 *  swapping copy in src/content/ can never silently break a section. */

export type Accent = 'violet' | 'azure' | 'cyan' | 'signal'

export interface NavItem {
  label: string
  href: string
  index: string
}

export interface Service {
  id: string
  title: string
  /** One sentence a non-technical reader understands immediately. */
  blurb: string
  /** Concrete examples, phrased as things a business actually wants. */
  examples: string[]
  accent: Accent
}

export interface ProjectMetric {
  label: string
  value: string
}

export interface ProjectLink {
  label: string
  href: string
}

export interface Project {
  slug: string
  name: string
  /** Short category line shown above the name. */
  kicker: string
  year: string
  status: 'In progress' | 'Live' | 'Prototype' | 'Archived'
  /** One-line description for the index. */
  summary: string
  /** The case-study body. */
  problem: string
  role: string
  contribution: string[]
  interesting: string
  stack: string[]
  metrics: ProjectMetric[]
  links: ProjectLink[]
  accent: Accent
  /** Which built-in preview illustration to render in the case study. */
  preview: 'arcade' | 'layers' | 'dashboard'
}

export interface Discipline {
  id: string
  title: string
  blurb: string
  tags: string[]
  /** Bento weight. */
  span: 'w2' | 'w3' | 'w4'
  tall?: boolean
  accent: Accent
}

export interface ProcessStep {
  n: string
  title: string
  /** What actually happens in this step. */
  blurb: string
  /** What it means for the person hiring me, in their words. */
  forYou: string
}
