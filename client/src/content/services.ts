import type { Service } from '@/types'

/* Written for a reader who does not work in software. No stack names, no
   jargon, no agency plural. Each one answers "what would I actually get?" */

export const SERVICES: Service[] = [
  {
    id: 'websites',
    title: 'Business websites',
    blurb:
      'A site that makes your business easy to find, easy to understand, and easy to get in touch with — fast on a phone, and something you can be proud to send to a customer.',
    examples: [
      'A first proper website for a business that only has a Facebook page',
      'A clear services-and-contact site that brings in enquiries',
      'A landing page for one product, service or campaign',
    ],
    accent: 'azure',
  },
  {
    id: 'apps',
    title: 'Web applications',
    blurb:
      'Software that lives in the browser and does real work — people log in, information is stored, things happen. No installs, works on any device.',
    examples: [
      'A booking or scheduling system your customers use themselves',
      'A members or customer portal with accounts and permissions',
      'An interactive tool built around something only you offer',
    ],
    accent: 'violet',
  },
  {
    id: 'systems',
    title: 'Custom internal systems',
    blurb:
      'The tool you keep wishing existed, built around how your business actually works instead of forcing your business to work like the software.',
    examples: [
      'Replacing a spreadsheet that too many people are editing at once',
      'Inventory, orders, records or scheduling in one place',
      'A system that finally connects two things you currently retype by hand',
    ],
    accent: 'cyan',
  },
  {
    id: 'dashboards',
    title: 'Dashboards & records',
    blurb:
      'A proper place for your data, and a screen that tells you what is going on at a glance — instead of digging through files to answer a simple question.',
    examples: [
      'An admin dashboard for staff to manage day-to-day records',
      'Reports that you can actually read, updated automatically',
      'Structured storage so your information stops living in five places',
    ],
    accent: 'azure',
  },
  {
    id: 'rebuilds',
    title: 'Rebuilds & rescues',
    blurb:
      'An existing site that is slow, dated, broken on phones, or that nobody can update any more — brought up to standard without losing what already works.',
    examples: [
      'Making an old site fast, secure and usable on mobile',
      'Taking over a project someone else left unfinished',
      'Keeping your look, replacing everything underneath it',
    ],
    accent: 'signal',
  },
  {
    id: 'automation',
    title: 'Automation & AI-assisted tools',
    blurb:
      'Getting the repetitive part of the week off your plate — the copying, the reminders, the same report every Monday — and, where it genuinely helps, putting AI to work inside your own tools.',
    examples: [
      'Automatic reminders, confirmations, exports or reports',
      'Removing a manual step that eats an hour every week',
      'Search, summarising or drafting inside a system you already use',
    ],
    accent: 'violet',
  },
]
