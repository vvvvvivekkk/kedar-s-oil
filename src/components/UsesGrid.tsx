import type { ReactNode } from 'react'
import { Reveal } from './Reveal'
import { SectionHeading } from './SectionHeading'

type Use = { title: string; body: string; icon: ReactNode }

const iconProps = {
  width: 28,
  height: 28,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
}

const USES: Use[] = [
  {
    title: 'Hair & Scalp',
    body: 'Virgin coconut oil as a pre-wash treatment; a few drops of sesame oil warmed for a scalp massage. Both are traditional for a reason.',
    icon: (
      <svg {...iconProps}>
        <path d="M12 3c-3 4-6 6-6 10a6 6 0 0 0 12 0c0-4-3-6-6-10Z" />
        <path d="M9 14c0 2 1.5 3 3 3" />
      </svg>
    ),
  },
  {
    title: 'Skin',
    body: 'Unrefined oils keep their natural emollients. Virgin coconut for daily moisture, sesame oil for the abhyanga massage tradition.',
    icon: (
      <svg {...iconProps}>
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1 7 17M17 7l2.1-2.1" />
      </svg>
    ),
  },
  {
    title: 'Everyday Cooking',
    body: 'Cold-pressed coconut for South Indian dishes and baking; mustard for pickles, curries and anything that wants a sharp, full flavour.',
    icon: (
      <svg {...iconProps}>
        <path d="M3 10h18l-1.5 9a2 2 0 0 1-2 1.7h-11a2 2 0 0 1-2-1.7L3 10Z" />
        <path d="M8 10V7a4 4 0 0 1 8 0v3" />
      </svg>
    ),
  },
  {
    title: 'Tempering & Frying',
    body: 'Mustard oil’s high smoke point suits deep frying — unusual for a cold-pressed oil. Heat until it just shimmers, then temper.',
    icon: (
      <svg {...iconProps}>
        <path d="M12 21c-4 0-7-2.6-7-6.5C5 10 9 8 9 4c2 1 3 3 3 5 1-1 1.5-2 1.5-3.5C16.5 7.5 19 10.5 19 14.5 19 18.4 16 21 12 21Z" />
        <path d="M12 21c-1.8 0-3-1.3-3-3 0-2 2-3 2-5 1.5 1 2 2.5 2 3.5 0-.8.3-1.4.6-1.8 1 1 1.4 2 1.4 3.3 0 1.7-1.2 3-3 3Z" />
      </svg>
    ),
  },
]

export function UsesGrid() {
  return (
    <section id="uses" className="section scroll-mt-16">
      <div className="container-site">
        <Reveal>
          <SectionHeading
            eyebrow="How people use it"
            title="One oil, many uses — because nothing has been stripped out."
            intro="Pressed oil keeps the aroma, colour and nutrients that refining removes. That’s what makes it useful beyond the pan."
          />
        </Reveal>
        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {USES.map((u, i) => (
            <Reveal as="li" key={u.title} delay={i * 0.07} className="card group p-6">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-moss/15 text-secondary transition-colors group-hover:bg-moss/25">
                {u.icon}
              </div>
              <h3 className="mt-5 font-heading text-2xl font-semibold tracking-heading">{u.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-soft">{u.body}</p>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}
