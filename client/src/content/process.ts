import type { ProcessStep } from '@/types'

/* Five steps, but drawn along the through-line rather than boxed. Each has a
   "what this means for you" line, because the value of a process section is
   removing uncertainty for someone who has never commissioned software. */

export const PROCESS: ProcessStep[] = [
  {
    n: '01',
    title: 'Understand the problem',
    blurb:
      'A conversation first. What the business does, what is currently painful, what "finished" would look like. No technical vocabulary required.',
    forYou: 'You talk, I listen and ask questions. Free, and there is no commitment at this point.',
  },
  {
    n: '02',
    title: 'Plan the solution',
    blurb:
      'I write down what will be built, what it will do, what it will not do, and roughly how long it takes — before anyone commits to anything.',
    forYou: 'You get a clear scope and timeline in plain language, and no surprises later.',
  },
  {
    n: '03',
    title: 'Design and prototype',
    blurb:
      'You see the thing before it is built. Layouts, screens, the actual flow — early, when changing it is cheap.',
    forYou: 'You can say "not that, this" while it still costs nothing to change.',
  },
  {
    n: '04',
    title: 'Build and iterate',
    blurb:
      'Built in visible increments rather than disappearing for a month. You get a working link and I keep you updated as it grows.',
    forYou: 'You always know where the project is, and you can steer it as it goes.',
  },
  {
    n: '05',
    title: 'Test, deploy, hand over',
    blurb:
      'Tested properly, put online, and handed over with everything documented — accounts, hosting, how to change the things you will want to change.',
    forYou: 'You own it. Nothing is locked to me, and I am still around if you need me.',
  },
]
